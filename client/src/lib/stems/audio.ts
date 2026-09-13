// client/src/lib/stems/audio.ts
//
// Audio in/out for the local stem splitter. HTDemucs is trained on 44.1kHz
// stereo, so anything the user drops has to be normalised to that before it
// touches the model, and the separated channels have to come back out as files
// a DAW will open.

/** Sample rate HTDemucs expects. Feeding it anything else degrades separation. */
export const TARGET_SAMPLE_RATE = 44100;

export type DecodedAudio = {
  /** Always exactly 2 channels at TARGET_SAMPLE_RATE. */
  channels: [Float32Array, Float32Array];
  sampleRate: number;
  /** Samples per channel. */
  length: number;
  duration: number;
};

/**
 * Decode an arbitrary audio file to 44.1kHz stereo.
 *
 * Resampling goes through OfflineAudioContext, which is the only resampler the
 * platform gives us that is actually good (it's the same one WebAudio uses for
 * playback). Mono sources are duplicated to stereo; sources with more than two
 * channels are downmixed by OfflineAudioContext's own rules.
 */
export async function decodeToStereo44k(
  input: ArrayBuffer,
): Promise<DecodedAudio> {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;

  const probeCtx = new AudioCtx();
  let decoded: AudioBuffer;
  try {
    // Hand over the original rather than a copy: nothing reads these bytes
    // again, and copying a long uncompressed WAV doubles its footprint.
    decoded = await probeCtx.decodeAudioData(input);
  } catch {
    throw new Error(
      "Couldn't read that audio file. Try MP3, WAV, M4A, FLAC or OGG.",
    );
  } finally {
    // Safari leaks contexts that are never closed.
    void probeCtx.close();
  }

  const needsResample = decoded.sampleRate !== TARGET_SAMPLE_RATE;
  const needsChannelFix = decoded.numberOfChannels !== 2;

  let buffer = decoded;
  if (needsResample || needsChannelFix) {
    const frames = Math.ceil(
      (decoded.duration * TARGET_SAMPLE_RATE),
    );
    const offline = new OfflineAudioContext(2, frames, TARGET_SAMPLE_RATE);
    const src = offline.createBufferSource();
    src.buffer = decoded;
    // Force a stereo result even from a mono source.
    const splitterFix = offline.createGain();
    splitterFix.channelCount = 2;
    splitterFix.channelCountMode = "explicit";
    splitterFix.channelInterpretation = "speakers";
    src.connect(splitterFix);
    splitterFix.connect(offline.destination);
    src.start();
    buffer = await offline.startRendering();
  }

  const left = buffer.getChannelData(0);
  const right =
    buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : buffer.getChannelData(0);

  // Copy out of the AudioBuffer: the underlying memory belongs to the context
  // and we are about to transfer these into a worker.
  return {
    channels: [new Float32Array(left), new Float32Array(right)],
    sampleRate: TARGET_SAMPLE_RATE,
    length: buffer.length,
    duration: buffer.duration,
  };
}

/**
 * Encode interleaved stereo Float32 to a 16-bit PCM WAV blob.
 *
 * 16-bit rather than float32 WAV because every DAW and browser opens it, and it
 * halves the size of what can be four multi-megabyte downloads.
 */
export function encodeWav(
  channels: Float32Array[],
  sampleRate = TARGET_SAMPLE_RATE,
): Blob {
  const numChannels = channels.length;
  const numFrames = channels[0]?.length ?? 0;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeAscii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // format = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 8 * bytesPerSample, true);
  writeAscii(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let frame = 0; frame < numFrames; frame += 1) {
    for (let ch = 0; ch < numChannels; ch += 1) {
      // Clamp before scaling: separation can overshoot [-1, 1] slightly and
      // wrapping a hot sample turns into a loud click.
      const sample = Math.max(-1, Math.min(1, channels[ch][frame]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true,
      );
      offset += bytesPerSample;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}
