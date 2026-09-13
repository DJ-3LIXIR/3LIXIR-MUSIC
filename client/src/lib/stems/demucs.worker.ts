/// <reference lib="webworker" />
// client/src/lib/stems/demucs.worker.ts
//
// Runs HTDemucs locally via ONNX Runtime Web. Lives in a worker because a
// separation pass saturates a core for tens of seconds to several minutes --
// on the main thread the tab would be frozen solid the entire time.
//
// The model is loaded here rather than on the main thread so the 172MB of
// weights never crosses a postMessage boundary.

import * as ort from "onnxruntime-web/webgpu";
// Serve ORT's own WASM binary from our origin. Loading it from a CDN would be
// blocked by the COEP header this page needs for threading, since we can't
// guarantee a third party sends Cross-Origin-Resource-Policy.
//
// It must be the *asyncify* build: the `onnxruntime-web/webgpu` entry inlines
// its JS glue but fetches this exact filename at runtime. Pointing at the jsep
// build instead leaves ORT requesting a file that was never emitted.
import ortWasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url";

import {
  CONSTANTS,
  prepareModelInput,
  standaloneIspec,
  standaloneMask,
} from "demucs-web";

import { loadModel, type ModelProgress } from "./modelCache";

// Order HTDemucs emits its four sources in. Fixed by the model, not by us.
const SOURCE_NAMES = CONSTANTS.TRACKS;
// 7.8s at 44.1kHz -- the segment length this graph is exported with.
const SEGMENT = CONSTANTS.TRAINING_SAMPLES;
// Fraction of each segment that overlaps its neighbour. Demucs' own default is
// 0.25; higher values average more passes over the same audio, which softens
// segment-boundary artifacts and generally cleans up separation, at a cost in
// time that rises with the number of segments.
const DEFAULT_OVERLAP = CONSTANTS.SEGMENT_OVERLAP;

export type WorkerRequest = {
  type: "separate";
  modelUrl: string;
  cacheKey: string;
  backend: "webgpu" | "wasm";
  threads: number;
  channels: [Float32Array, Float32Array];
  /** 0..0.9. Higher = better separation, proportionally slower. */
  overlap?: number;
};

export type WorkerResponse =
  | { type: "model-progress"; payload: ModelProgress }
  | { type: "stage"; stage: string }
  | { type: "progress"; completed: number; total: number }
  | {
      type: "done";
      stems: Record<string, [Float32Array, Float32Array]>;
      backend: string;
    }
  | { type: "error"; message: string };

const post = (msg: WorkerResponse, transfer?: Transferable[]) =>
  (self as unknown as Worker).postMessage(msg, transfer ?? []);

/**
 * Demucs' triangular crossfade window.
 *
 * Segments are blended by weight rather than butt-joined; without this the
 * seam between segments is an audible click every few seconds.
 */
function buildWindow(length: number): Float32Array {
  const w = new Float32Array(length);
  const half = Math.floor(length / 2);
  for (let i = 0; i < length; i += 1) {
    w[i] = i < half ? i + 1 : length - i;
  }
  let max = 0;
  for (let i = 0; i < length; i += 1) if (w[i] > max) max = w[i];
  if (max > 0) for (let i = 0; i < length; i += 1) w[i] /= max;
  return w;
}

async function separate(req: WorkerRequest): Promise<void> {
  const [left, right] = req.channels;
  const totalSamples = left.length;

  // --- Input normalisation -------------------------------------------------
  // HTDemucs is trained on a mix normalised to zero mean / unit variance, and
  // its reference implementation does this before inference and undoes it
  // after. Feeding raw audio instead hands the model a different input
  // distribution than it learned on, which costs separation quality -- worst
  // on quiet or heavily-limited masters. Statistics come from the mono mix of
  // the whole track, matching apply_model(), not from each segment.
  let mixMean = 0;
  for (let i = 0; i < totalSamples; i += 1) {
    mixMean += (left[i] + right[i]) * 0.5;
  }
  mixMean /= Math.max(1, totalSamples);

  let variance = 0;
  for (let i = 0; i < totalSamples; i += 1) {
    const d = (left[i] + right[i]) * 0.5 - mixMean;
    variance += d * d;
  }
  // Guard silence: a digital-black track would otherwise divide by zero.
  const mixStd = Math.sqrt(variance / Math.max(1, totalSamples)) || 1;

  for (let i = 0; i < totalSamples; i += 1) {
    left[i] = (left[i] - mixMean) / mixStd;
    right[i] = (right[i] - mixMean) / mixStd;
  }

  // --- Runtime setup -------------------------------------------------------
  ort.env.wasm.wasmPaths = { wasm: ortWasmUrl };
  // numThreads > 1 requires SharedArrayBuffer, which requires cross-origin
  // isolation. The caller has already checked; honour whatever it decided.
  ort.env.wasm.numThreads = req.threads;

  post({ type: "stage", stage: "Loading AI model" });
  const modelBytes = await loadModel(req.modelUrl, req.cacheKey, (payload) =>
    post({ type: "model-progress", payload }),
  );

  post({ type: "stage", stage: "Starting engine" });

  // Prefer WebGPU, but a WebGPU adapter can still fail at session-creation time
  // on drivers that advertise support they don't have. Fall back rather than
  // dead-ending the user.
  let session: ort.InferenceSession;
  let backendUsed = req.backend;
  try {
    session = await ort.InferenceSession.create(modelBytes, {
      executionProviders: req.backend === "webgpu" ? ["webgpu", "wasm"] : ["wasm"],
      graphOptimizationLevel: "all",
    });
  } catch (err) {
    if (req.backend !== "webgpu") throw err;
    backendUsed = "wasm";
    session = await ort.InferenceSession.create(modelBytes, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
  }

  const segment = SEGMENT;
  // Clamp: at >=1 the stride collapses to zero and the loop never advances.
  const overlap = Math.min(0.9, Math.max(0, req.overlap ?? DEFAULT_OVERLAP));
  const stride = Math.max(1, Math.floor(segment * (1 - overlap)));
  const window = buildWindow(segment);

  // This export exposes both of HTDemucs' branches rather than fusing them:
  //   inputs  -> [0] raw waveform, [1] complex spectrogram
  //   outputs -> a 4-D time-domain tensor and a 5-D frequency-domain one
  // The STFT that would normally sit inside the graph is ours to do, and the
  // real stem is the time branch plus the inverse STFT of the frequency branch.
  if (session.inputNames.length < 2) {
    throw new Error(
      "This model expects a single input — it isn't the two-branch HTDemucs export this tool is built for.",
    );
  }
  const [waveformInput, specInput] = session.inputNames;

  // --- Accumulators --------------------------------------------------------
  // One stereo buffer per source, plus the summed weights so overlapping
  // segments can be normalised back down at the end.
  const acc = SOURCE_NAMES.map(() => [
    new Float32Array(totalSamples),
    new Float32Array(totalSamples),
  ]);
  const weightSum = new Float32Array(totalSamples);

  const totalChunks = Math.max(1, Math.ceil(totalSamples / stride));
  post({ type: "stage", stage: "Separating" });
  post({ type: "progress", completed: 0, total: totalChunks });

  const segLeft = new Float32Array(segment);
  const segRight = new Float32Array(segment);

  for (let index = 0, offset = 0; offset < totalSamples; index += 1, offset += stride) {
    const valid = Math.min(segment, totalSamples - offset);

    // Zero-pad the tail so every segment is the exact size the graph expects.
    segLeft.fill(0);
    segRight.fill(0);
    segLeft.set(left.subarray(offset, offset + valid));
    segRight.set(right.subarray(offset, offset + valid));

    const prepared = prepareModelInput(segLeft, segRight);

    const result = await session.run({
      [waveformInput]: new ort.Tensor("float32", prepared.waveform, [
        1,
        2,
        segment,
      ]),
      [specInput]: new ort.Tensor("float32", prepared.magSpec, [
        1,
        4,
        CONSTANTS.MODEL_SPEC_BINS,
        CONSTANTS.MODEL_SPEC_FRAMES,
      ]),
    });

    // Identify the two branches by shape rather than by name, so a re-export
    // that renames its outputs still works.
    let timeData: Float32Array | null = null;
    let timeDims: readonly number[] = [];
    let freqData: Float32Array | null = null;
    for (const name of session.outputNames) {
      const tensor = result[name];
      if (tensor.dims.length === 4 && tensor.dims[2] === 2) {
        timeData = tensor.data as Float32Array;
        timeDims = tensor.dims;
      } else if (tensor.dims.length === 5 && tensor.dims[2] === 4) {
        freqData = tensor.data as Float32Array;
      }
    }
    if (!timeData) {
      throw new Error("Model produced no time-domain output — can't build stems.");
    }
    if (timeDims[1] !== SOURCE_NAMES.length) {
      throw new Error(
        `Model returned ${timeDims[1]} sources, expected ${SOURCE_NAMES.length}. The weights file may not be HTDemucs.`,
      );
    }

    const produced = timeDims[3];
    const channels = timeDims[2];
    // Present only when the frequency branch is exposed; without it we'd be
    // writing out the time branch alone, which is not the finished stem.
    const trackSpecs = freqData ? standaloneMask(freqData) : null;
    const copyLen = Math.min(valid, produced);

    for (let t = 0; t < SOURCE_NAMES.length; t += 1) {
      const freq = trackSpecs ? standaloneIspec(trackSpecs[t], segment) : null;
      const base = t * channels * produced;
      const accL = acc[t][0];
      const accR = acc[t][1];
      for (let i = 0; i < copyLen; i += 1) {
        const w = window[i];
        const l = timeData[base + i] + (freq ? freq.left[i] : 0);
        const r = timeData[base + produced + i] + (freq ? freq.right[i] : 0);
        accL[offset + i] += l * w;
        accR[offset + i] += r * w;
      }
    }
    for (let i = 0; i < copyLen; i += 1) weightSum[offset + i] += window[i];

    post({ type: "progress", completed: index + 1, total: totalChunks });
  }

  // Normalise by accumulated weight. Guard against zero so a sample no segment
  // covered stays silent rather than turning into NaN.
  for (let i = 0; i < totalSamples; i += 1) {
    const w = weightSum[i];
    if (w <= 1e-8) continue;
    for (let t = 0; t < SOURCE_NAMES.length; t += 1) {
      // Undo the weighting, then the normalisation applied to the input.
      acc[t][0][i] = (acc[t][0][i] / w) * mixStd + mixMean;
      acc[t][1][i] = (acc[t][1][i] / w) * mixStd + mixMean;
    }
  }

  await session.release();

  const stems: Record<string, [Float32Array, Float32Array]> = {};
  const transfer: Transferable[] = [];
  SOURCE_NAMES.forEach((name, t) => {
    stems[name] = [acc[t][0], acc[t][1]];
    transfer.push(acc[t][0].buffer, acc[t][1].buffer);
  });

  post({ type: "done", stems, backend: backendUsed }, transfer);
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  if (event.data?.type !== "separate") return;
  separate(event.data).catch((err: unknown) => {
    post({
      type: "error",
      message: err instanceof Error ? err.message : "Separation failed.",
    });
  });
};
