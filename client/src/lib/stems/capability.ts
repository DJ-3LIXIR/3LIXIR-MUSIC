// client/src/lib/stems/capability.ts
//
// Decides whether this browser can realistically run HTDemucs locally, and on
// which backend. Called before we offer the tool, so the UI can route people to
// the fast path, the slow path, or the ffmpeg fallback without ever starting a
// 172MB download it cannot finish.

export type StemBackend = "webgpu" | "wasm";

export type StemCapability = {
  /** Backend to run on, or null when local separation is off the table. */
  backend: StemBackend | null;
  /** True when COOP/COEP are in place, so ORT can use threads. */
  crossOriginIsolated: boolean;
  /** Threads ORT may use. 1 when not cross-origin isolated. */
  threads: number;
  /** Rough device RAM in GB, when the browser reports it. */
  deviceMemory: number | null;
  isMobile: boolean;
  /** Why we refused, or why the experience will be degraded. UI copy. */
  reason: string | null;
};

/** navigator.deviceMemory is Chromium-only and capped at 8. */
function deviceMemoryGb(): number | null {
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof mem === "number" ? mem : null;
}

function isMobileDevice(): boolean {
  const ua = navigator.userAgent;
  // iPadOS 13+ reports a desktop UA, so check touch points as well.
  const iPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle/i.test(ua) || iPadOS;
}

// Minimal shape of the bits of the WebGPU API we touch. Declared locally so we
// don't pull in @webgpu/types just to call requestAdapter().
type MinimalGpu = {
  requestAdapter(options?: { powerPreference?: string }): Promise<unknown | null>;
};

/**
 * Probe WebGPU properly. `navigator.gpu` existing is not enough -- Safari and
 * some Linux/Chrome setups expose the object but hand back no adapter, and we
 * only find out at requestAdapter() time.
 */
async function probeWebGpu(): Promise<boolean> {
  const gpu = (navigator as Navigator & { gpu?: MinimalGpu }).gpu;
  if (!gpu) return false;
  try {
    const adapter = await gpu.requestAdapter({
      powerPreference: "high-performance",
    });
    return adapter != null;
  } catch {
    return false;
  }
}

export async function detectStemCapability(): Promise<StemCapability> {
  const isMobile = isMobileDevice();
  const deviceMemory = deviceMemoryGb();
  const isolated = typeof crossOriginIsolated !== "undefined" && crossOriginIsolated;

  const base = {
    crossOriginIsolated: isolated,
    threads: isolated ? Math.min(navigator.hardwareConcurrency || 4, 8) : 1,
    deviceMemory,
    isMobile,
  };

  // Phones and tablets: a 172MB model plus ~1-2GB of working set reliably ends
  // in an out-of-memory tab crash, and the download alone is hostile on cell
  // data. Refuse up front rather than failing halfway through.
  if (isMobile) {
    return {
      ...base,
      backend: null,
      reason:
        "Local stem separation needs a desktop browser — the AI model is too large to run on phones and tablets.",
    };
  }

  // Chromium tells us RAM; anything under 4GB will thrash or crash.
  if (deviceMemory != null && deviceMemory < 4) {
    return {
      ...base,
      backend: null,
      reason:
        "This device reports under 4GB of memory, which isn't enough to run the separation model locally.",
    };
  }

  if (await probeWebGpu()) {
    return { ...base, backend: "webgpu", reason: null };
  }

  // WASM fallback. Without cross-origin isolation ORT is stuck on a single
  // thread, which turns minutes into a great many minutes -- still allowed, but
  // the UI should say so plainly.
  return {
    ...base,
    backend: "wasm",
    reason: isolated
      ? null
      : "Running single-threaded — this browser session isn't cross-origin isolated, so separation will be slow.",
  };
}
