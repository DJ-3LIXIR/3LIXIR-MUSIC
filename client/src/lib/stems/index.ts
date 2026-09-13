// client/src/lib/stems/index.ts
//
// Public surface of the local stem splitter. The page talks to this and
// nothing else, so the engine underneath (ONNX Runtime today) can be swapped
// without touching UI code.

import { decodeToStereo44k, encodeWav, TARGET_SAMPLE_RATE } from "./audio";
import { detectStemCapability, type StemCapability } from "./capability";
import { isModelCached, type ModelProgress } from "./modelCache";
import type { WorkerRequest, WorkerResponse } from "./demucs.worker";

export { detectStemCapability, type StemCapability } from "./capability";
export { isModelCached, clearModelCache } from "./modelCache";
export type { ModelProgress } from "./modelCache";

/**
 * Where the HTDemucs weights live.
 *
 * Defaults to the public Hugging Face copy so this works out of the box, but
 * production should point at our own mirror via VITE_STEMS_MODEL_URL:
 *   - COEP (`require-corp`) blocks cross-origin responses that don't send
 *     Cross-Origin-Resource-Policy, and we don't control what HF sends.
 *   - Hotlinking someone else's 172MB file means their outage is our outage.
 */
export const MODEL_URL: string =
  import.meta.env.VITE_STEMS_MODEL_URL ||
  "https://huggingface.co/timcsy/demucs-web-onnx/resolve/main/htdemucs_embedded.onnx";

/** Bump when the weights change, or cached browsers keep the old model forever. */
export const MODEL_CACHE_KEY = "htdemucs-v4-onnx-1";

export const STEM_LABELS: Record<string, string> = {
  vocals: "Vocals",
  drums: "Drums",
  bass: "Bass",
  other: "Other",
};

export type StemFile = {
  name: string;
  label: string;
  blob: Blob;
  /** Object URL for preview/download. Caller must revoke when finished. */
  url: string;
};

/**
 * Quality presets. These trade time for separation quality by varying how much
 * each analysis window overlaps its neighbour -- the same knob Demucs exposes.
 */
export const QUALITY_PRESETS = {
  fast: { label: "Fast", overlap: 0.25, costMultiplier: 1 },
  better: { label: "Better", overlap: 0.5, costMultiplier: 1.5 },
  best: { label: "Best", overlap: 0.75, costMultiplier: 3 },
} as const;

export type QualityPreset = keyof typeof QUALITY_PRESETS;

export type SeparateEvents = {
  onStage?: (stage: string) => void;
  onModelProgress?: (p: ModelProgress) => void;
  /** Separation progress through the track, 0..1. */
  onProgress?: (fraction: number) => void;
};

export type SeparateResult = {
  stems: StemFile[];
  backend: string;
  durationSeconds: number;
};

// --- Engine lifetime ---------------------------------------------------------
// One worker per page, kept between runs so the model and inference session it
// holds are built once rather than per song. See the session cache in the
// worker for why rebuilding them each run ran out of memory.
let engine: Worker | null = null;
// Rejects the run in flight, if any, when the engine is torn down under it.
let cancelActive: ((err: Error) => void) | null = null;

function getEngine(): Worker {
  if (!engine) {
    engine = new Worker(new URL("./demucs.worker.ts", import.meta.url), {
      type: "module",
    });
  }
  return engine;
}

/**
 * Terminate the engine and free everything it holds -- the model, the
 * inference session and its GPU memory. Call when leaving the tool; the next
 * run builds a fresh engine (the weights come back from the local cache).
 */
export function releaseStemEngine(): void {
  cancelActive?.(new Error("Separation cancelled."));
  cancelActive = null;
  engine?.terminate();
  engine = null;
}

/** True when the model still has to be downloaded, so the UI can warn first. */
export async function needsModelDownload(): Promise<boolean> {
  return !(await isModelCached(MODEL_CACHE_KEY));
}

/**
 * Separate a track into four stems, entirely on this machine.
 *
 * Decoding happens here rather than in the worker because WebAudio's decoder
 * isn't available to workers; only raw PCM crosses the boundary, and it is
 * transferred rather than copied.
 */
export async function separateStems(
  input: ArrayBuffer,
  capability: StemCapability,
  events: SeparateEvents = {},
  quality: QualityPreset = "fast",
): Promise<SeparateResult> {
  if (!capability.backend) {
    throw new Error(
      capability.reason || "This device can't run local stem separation.",
    );
  }

  const startedAt = performance.now();

  events.onStage?.("Reading audio");
  const audio = await decodeToStereo44k(input);

  // A run still in flight (e.g. the page was left and reopened mid-run) would
  // interleave its messages with this one. Start from a clean engine instead.
  if (cancelActive) releaseStemEngine();
  const worker = getEngine();

  try {
    const outcome = await new Promise<{
      stems: Record<string, [Float32Array, Float32Array]>;
      backend: string;
    }>(
      (resolve, reject) => {
        cancelActive = reject;
        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const msg = event.data;
          switch (msg.type) {
            case "model-progress":
              events.onModelProgress?.(msg.payload);
              break;
            case "stage":
              events.onStage?.(msg.stage);
              break;
            case "progress":
              events.onProgress?.(msg.total ? msg.completed / msg.total : 0);
              break;
            case "done":
              // Report the backend the worker actually ran on -- it downgrades
              // to wasm by itself when a WebGPU session fails to build.
              resolve({ stems: msg.stems, backend: msg.backend });
              break;
            case "error":
              reject(new Error(msg.message));
              break;
          }
        };

        // A worker that dies outright (OOM is the usual cause) fires onerror
        // and never resolves, so surface it as a real failure.
        worker.onerror = (e) =>
          reject(
            new Error(
              e.message ||
                "The separation engine stopped unexpectedly — the track may be too long for this device's memory.",
            ),
          );

        const request: WorkerRequest = {
          type: "separate",
          modelUrl: MODEL_URL,
          cacheKey: MODEL_CACHE_KEY,
          backend: capability.backend as "webgpu" | "wasm",
          threads: capability.threads,
          channels: audio.channels,
          overlap: QUALITY_PRESETS[quality].overlap,
        };
        worker.postMessage(request, [
          audio.channels[0].buffer,
          audio.channels[1].buffer,
        ]);
      },
    );

    events.onStage?.("Encoding stems");
    // Encode one stem at a time and drop its float buffers as soon as its WAV
    // exists. Mapping all four at once keeps every raw stem alive until the
    // last WAV is built -- on a long track that's several hundred MB of peak
    // memory spent at the very end of a run.
    const files: StemFile[] = [];
    for (const name of Object.keys(outcome.stems)) {
      const blob = encodeWav(outcome.stems[name], TARGET_SAMPLE_RATE);
      delete outcome.stems[name];
      files.push({
        name,
        label: STEM_LABELS[name] || name,
        blob,
        url: URL.createObjectURL(blob),
      });
    }

    // Present in the order people actually reach for.
    const order = ["vocals", "drums", "bass", "other"];
    files.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    return {
      stems: files,
      backend: outcome.backend,
      durationSeconds: (performance.now() - startedAt) / 1000,
    };
  } catch (err) {
    // A worker that errored may have lost its GPU device or be out of memory;
    // don't reuse it for the next run.
    releaseStemEngine();
    throw err;
  } finally {
    cancelActive = null;
    if (engine === worker) {
      worker.onmessage = null;
      worker.onerror = null;
    }
  }
}
