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
): Promise<SeparateResult> {
  if (!capability.backend) {
    throw new Error(
      capability.reason || "This device can't run local stem separation.",
    );
  }

  const startedAt = performance.now();

  events.onStage?.("Reading audio");
  const audio = await decodeToStereo44k(input);

  const worker = new Worker(new URL("./demucs.worker.ts", import.meta.url), {
    type: "module",
  });

  try {
    const outcome = await new Promise<{
      stems: Record<string, [Float32Array, Float32Array]>;
      backend: string;
    }>(
      (resolve, reject) => {
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
        };
        worker.postMessage(request, [
          audio.channels[0].buffer,
          audio.channels[1].buffer,
        ]);
      },
    );

    events.onStage?.("Encoding stems");
    const files: StemFile[] = Object.entries(outcome.stems).map(([name, channels]) => {
      const blob = encodeWav(channels, TARGET_SAMPLE_RATE);
      return {
        name,
        label: STEM_LABELS[name] || name,
        blob,
        url: URL.createObjectURL(blob),
      };
    });

    // Present in the order people actually reach for.
    const order = ["vocals", "drums", "bass", "other"];
    files.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    return {
      stems: files,
      backend: outcome.backend,
      durationSeconds: (performance.now() - startedAt) / 1000,
    };
  } finally {
    worker.terminate();
  }
}
