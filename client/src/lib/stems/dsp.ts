// client/src/lib/stems/dsp.ts
//
// The spectrogram plumbing around the HTDemucs graph, rewritten to allocate
// once instead of once per segment.
//
// demucs-web's prepareModelInput / standaloneMask / standaloneIspec are
// correct but allocate fresh typed arrays on every call -- roughly 200MB of
// short-lived garbage per segment. On a long track at high overlap the
// garbage collector falls behind, memory climbs until the browser kills the
// page, and on unified-memory Macs the whole machine stalls first. The
// maths here is the same, step for step, so output matches bit for bit;
// only the buffers are long-lived. We keep demucs-web's FFT kernel and Hann
// window rather than re-deriving them.

import { CONSTANTS, fft, getHannWindow, ifft } from "demucs-web";

const SEG = CONSTANTS.TRAINING_SAMPLES; // 343980
const NFFT = CONSTANTS.FFT_SIZE; // 4096
const HOP = CONSTANTS.HOP_SIZE; // 1024
const BINS = CONSTANTS.MODEL_SPEC_BINS; // 2048
const FRAMES = CONSTANTS.MODEL_SPEC_FRAMES; // 336
const BF = BINS * FRAMES;

// Padding and offsets, as derived in demucs-web's processor.js (which mirrors
// Demucs' _spec / _ispec).
const LE = Math.ceil(SEG / HOP); // 336
const PAD = Math.floor(HOP / 2) * 3; // 1536
const PAD_RIGHT = PAD + LE * HOP - SEG; // 1620
const CENTER = NFFT / 2; // 2048
// The model's frames are the STFT's frames 2..337; the outer two on each side
// exist only for padding.
const FRAME_OFFSET = 2;
const STFT_FRAMES = FRAMES + 2 * FRAME_OFFSET; // 340
const STFT_BINS = NFFT / 2 + 1; // 2049
const STFT_INPUT_LEN = SEG + PAD + PAD_RIGHT; // 347136
const CENTERED_LEN = STFT_INPUT_LEN + 2 * CENTER; // 351232
const ISTFT_LEN = (STFT_FRAMES - 1) * HOP + NFFT; // 351232
const ISPEC_OFFSET = CENTER + PAD; // 3584

/** reflectPad(), writing into a caller-owned buffer. Same index rules. */
function reflectPadInto(
  src: Float32Array,
  length: number,
  padLeft: number,
  padRight: number,
  out: Float32Array,
): void {
  for (let i = 0; i < padLeft; i += 1) {
    out[i] = src[Math.min(padLeft - i, length - 1)];
  }
  out.set(src.subarray(0, length), padLeft);
  for (let i = 0; i < padRight; i += 1) {
    out[padLeft + length + i] = src[Math.max(0, length - 2 - i)];
  }
}

export class DemucsDsp {
  /** Model input 0: [1, 2, SEG] -- left then right. Rewritten each segment. */
  readonly waveform = new Float32Array(2 * SEG);
  /** Model input 1: [1, 4, BINS, FRAMES] -- L real, L imag, R real, R imag. */
  readonly magSpec = new Float32Array(4 * BF);

  private readonly window: Float32Array = getHannWindow(NFFT);

  // Forward STFT scratch.
  private readonly stftInput = new Float32Array(STFT_INPUT_LEN);
  private readonly centered = new Float32Array(CENTERED_LEN);
  private readonly windowed = new Float32Array(NFFT);
  private readonly frameReal = new Float32Array(NFFT);
  private readonly frameImag = new Float32Array(NFFT);

  // Inverse STFT scratch.
  private readonly fullReal = new Float32Array(NFFT);
  private readonly fullImag = new Float32Array(NFFT);
  private readonly outReal = new Float32Array(NFFT);
  private readonly outImag = new Float32Array(NFFT);
  private readonly istftOut = new Float32Array(ISTFT_LEN);
  // The overlap-add normaliser depends only on the window and frame count, so
  // it is identical for every call -- compute it once.
  private readonly windowSum = new Float32Array(ISTFT_LEN);

  constructor() {
    for (let frame = 0; frame < STFT_FRAMES; frame += 1) {
      const start = frame * HOP;
      for (let i = 0; i < NFFT && start + i < ISTFT_LEN; i += 1) {
        this.windowSum[start + i] += this.window[i] * this.window[i];
      }
    }
  }

  /**
   * Fill `waveform` and `magSpec` for one segment. Both inputs must be exactly
   * SEG samples (zero-padded by the caller for the final segment).
   */
  prepare(segLeft: Float32Array, segRight: Float32Array): void {
    this.waveform.set(segLeft, 0);
    this.waveform.set(segRight, SEG);
    this.spectrogram(segLeft, 0);
    this.spectrogram(segRight, 2);
  }

  /** Forward STFT of one channel into magSpec channels [base, base + 1]. */
  private spectrogram(signal: Float32Array, base: number): void {
    reflectPadInto(signal, SEG, PAD, PAD_RIGHT, this.stftInput);
    reflectPadInto(this.stftInput, STFT_INPUT_LEN, CENTER, CENTER, this.centered);

    const scale = 1 / Math.sqrt(NFFT);
    const realBase = base * BF;
    const imagBase = (base + 1) * BF;

    // Only the frames the model sees; the padding frames are never read.
    for (let f = 0; f < FRAMES; f += 1) {
      const start = (f + FRAME_OFFSET) * HOP;
      for (let i = 0; i < NFFT; i += 1) {
        this.windowed[i] = this.centered[start + i] * this.window[i];
      }
      fft(this.frameReal, this.frameImag, this.windowed, NFFT);
      for (let b = 0; b < BINS; b += 1) {
        this.magSpec[realBase + b * FRAMES + f] = this.frameReal[b] * scale;
        this.magSpec[imagBase + b * FRAMES + f] = this.frameImag[b] * scale;
      }
    }
  }

  /**
   * Inverse-STFT one channel of one track straight out of the model's
   * frequency output, with no per-track copy of the spectrogram.
   *
   * @param freqData  the 5-D output, [1, tracks, 4, BINS, FRAMES]
   * @param channel   0 = left, 1 = right
   * @returns a view of SEG samples into a shared buffer. It is overwritten by
   *          the next call, so consume it before calling again.
   */
  ispec(freqData: Float32Array, track: number, channel: 0 | 1): Float32Array {
    const realBase = track * 4 * BF + channel * 2 * BF;
    const imagBase = realBase + BF;
    const scale = Math.sqrt(NFFT);
    const out = this.istftOut;
    out.fill(0);

    // Padding frames hold an all-zero spectrum, so they add nothing to the sum
    // and are skipped. They still count toward windowSum, which is precomputed.
    for (let f = 0; f < FRAMES; f += 1) {
      this.fullReal.fill(0);
      this.fullImag.fill(0);
      for (let b = 0; b < BINS; b += 1) {
        this.fullReal[b] = freqData[realBase + b * FRAMES + f];
        this.fullImag[b] = freqData[imagBase + b * FRAMES + f];
      }
      // Mirror to the negative frequencies (bin STFT_BINS - 1 is padding, 0).
      for (let k = 1; k < STFT_BINS - 1; k += 1) {
        this.fullReal[NFFT - k] = this.fullReal[k];
        this.fullImag[NFFT - k] = -this.fullImag[k];
      }
      ifft(this.outReal, this.outImag, this.fullReal, this.fullImag, NFFT);

      const start = (f + FRAME_OFFSET) * HOP;
      for (let i = 0; i < NFFT && start + i < ISTFT_LEN; i += 1) {
        out[start + i] += this.outReal[i] * this.window[i] * scale;
      }
    }

    // Normalise only the span we return.
    const end = ISPEC_OFFSET + SEG;
    for (let i = ISPEC_OFFSET; i < end; i += 1) {
      if (this.windowSum[i] > 1e-8) out[i] /= this.windowSum[i];
    }
    return out.subarray(ISPEC_OFFSET, end);
  }
}
