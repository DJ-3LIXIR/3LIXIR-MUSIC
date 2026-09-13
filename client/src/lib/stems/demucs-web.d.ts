// Types for `demucs-web`, which ships plain JS with no declarations.
//
// We use it only for the DSP that bridges raw audio and this particular ONNX
// export: the graph has the STFT cut out of it, so the caller must build the
// complex spectrogram input and invert the spectrogram output by hand. Those
// conventions (padding, bin drop, frame offsets) are proven against this exact
// weights file, which is why we lean on them rather than re-deriving them.
declare module "demucs-web" {
  export const CONSTANTS: {
    SAMPLE_RATE: number;
    FFT_SIZE: number;
    HOP_SIZE: number;
    TRAINING_SAMPLES: number;
    MODEL_SPEC_BINS: number;
    MODEL_SPEC_FRAMES: number;
    SEGMENT_OVERLAP: number;
    TRACKS: string[];
    DEFAULT_MODEL_URL: string;
  };

  export type TrackSpec = {
    leftReal: Float32Array;
    leftImag: Float32Array;
    rightReal: Float32Array;
    rightImag: Float32Array;
  };

  /** Split the model's 5-D frequency output into one complex spec per track. */
  export function standaloneMask(
    freqOutput: Float32Array | ArrayLike<number>,
  ): TrackSpec[];

  /** Inverse STFT one track's spectrogram back to a stereo waveform. */
  export function standaloneIspec(
    trackSpec: TrackSpec,
    targetLength: number,
  ): { left: Float32Array; right: Float32Array };

  /** Build both model inputs (waveform + complex spectrogram) from a segment. */
  export function prepareModelInput(
    leftChannel: Float32Array,
    rightChannel: Float32Array,
  ): {
    waveform: Float32Array;
    magSpec: Float32Array;
    numBins: number;
    numFrames: number;
    originalLength: number;
  };
}
