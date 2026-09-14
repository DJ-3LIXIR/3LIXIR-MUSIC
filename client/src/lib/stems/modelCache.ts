// client/src/lib/stems/modelCache.ts
//
// Persistent cache for the HTDemucs ONNX weights (~172MB).
//
// Without this, every separation re-downloads the model and the tool is
// unusable on anything but fast broadband. With it, the download is a one-time
// cost per browser and later runs start immediately.
//
// IndexedDB rather than Cache Storage because Cache Storage is keyed to
// requests and gets evicted more eagerly, and because storing a Blob lets the
// browser keep the bytes on disk instead of in the JS heap.

const DB_NAME = "3lixir-stems";
const DB_VERSION = 1;
const STORE = "models";

export type ModelProgress = {
  phase: "cache-hit" | "downloading" | "storing";
  /** 0..1, or null when the server sends no Content-Length. */
  progress: number | null;
  receivedBytes: number;
  totalBytes: number | null;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGet(db: IDBDatabase, key: string): Promise<Blob | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(db: IDBDatabase, key: string, value: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/**
 * Fetch the model, preferring the cached copy.
 *
 * `cacheKey` should change whenever the weights change, otherwise visitors keep
 * running the old model forever.
 *
 * Caching is best-effort throughout: if IndexedDB is unavailable (private
 * browsing, disabled storage) or the write blows the storage quota, we still
 * return working bytes and simply pay the download again next time. A failure
 * to cache must never be a failure to separate.
 */
export async function loadModel(
  url: string,
  cacheKey: string,
  onProgress: (p: ModelProgress) => void,
  signal?: AbortSignal,
): Promise<ArrayBuffer> {
  let db: IDBDatabase | null = null;
  try {
    db = await openDb();
    const cached = await idbGet(db, cacheKey);
    if (cached) {
      onProgress({
        phase: "cache-hit",
        progress: 1,
        receivedBytes: cached.size,
        totalBytes: cached.size,
      });
      return await cached.arrayBuffer();
    }
  } catch {
    // Storage unavailable -- fall through to a plain download.
  }

  const res = await fetch(url, { signal });
  if (!res.ok || !res.body) {
    throw new Error(
      `Couldn't download the separation model (${res.status}). Please try again.`,
    );
  }

  const lengthHeader = res.headers.get("content-length");
  const totalBytes = lengthHeader ? Number(lengthHeader) : null;

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedBytes += value.byteLength;
    onProgress({
      phase: "downloading",
      progress: totalBytes ? receivedBytes / totalBytes : null,
      receivedBytes,
      totalBytes,
    });
  }

  const blob = new Blob(chunks as BlobPart[], {
    type: "application/octet-stream",
  });

  if (db) {
    onProgress({
      phase: "storing",
      progress: 1,
      receivedBytes,
      totalBytes,
    });
    try {
      await idbPut(db, cacheKey, blob);
    } catch {
      // Over quota or evicted mid-write. Harmless: we just re-download later.
    }
  }

  return await blob.arrayBuffer();
}

/** True when the weights are already on disk, so the UI can skip the warning. */
export async function isModelCached(cacheKey: string): Promise<boolean> {
  try {
    const db = await openDb();
    return (await idbGet(db, cacheKey)) != null;
  } catch {
    return false;
  }
}

/** Free the cached weights. Surfaced in the UI so users can reclaim the space. */
export async function clearModelCache(): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Nothing cached, or storage unavailable. Either way there's nothing to do.
  }
}
