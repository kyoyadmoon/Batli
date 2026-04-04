type AudioContextCtor = typeof AudioContext;
type AudioContextWindow = typeof globalThis & {
  AudioContext?: AudioContextCtor;
  webkitAudioContext?: AudioContextCtor;
};

export interface ToneEngine {
  playCorrectTone: () => void;
  playIncorrectTone: () => void;
  ensureRunning: () => Promise<AudioContext | null>;
  isSupported: () => boolean;
}

interface CreateToneEngineOptions {
  audioContextCtor?: AudioContextCtor | null;
  webkitAudioContextCtor?: AudioContextCtor | null;
  win?: AudioContextWindow;
}

function scheduleTone(
  ctx: AudioContext,
  startAt: number,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const attackTime = 0.01;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.3, startAt + attackTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startAt + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration);
}

export function createToneEngine(options: CreateToneEngineOptions = {}): ToneEngine {
  let sharedAudioCtx: AudioContext | null = null;
  let resumePromise: Promise<AudioContext | null> | null = null;

  const getAudioContextCtor = (): AudioContextCtor | null => {
    if (options.audioContextCtor) {
      return options.audioContextCtor;
    }

    if (options.webkitAudioContextCtor) {
      return options.webkitAudioContextCtor;
    }

    const win = options.win ?? (typeof window !== 'undefined' ? window as AudioContextWindow : undefined);
    if (!win) {
      return null;
    }

    return win.AudioContext ?? win.webkitAudioContext ?? null;
  };

  const getSharedAudioContext = (): AudioContext | null => {
    const AudioContextImpl = getAudioContextCtor();
    if (!AudioContextImpl) {
      return null;
    }

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextImpl();
    }

    return sharedAudioCtx;
  };

  const ensureRunning = async (): Promise<AudioContext | null> => {
    if (resumePromise) {
      return resumePromise;
    }

    resumePromise = (async () => {
      const ctx = getSharedAudioContext();
      if (!ctx) {
        return null;
      }

      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch {
          return ctx;
        }
      }

      return ctx;
    })();

    try {
      return await resumePromise;
    } finally {
      resumePromise = null;
    }
  };

  const playCorrectTone = () => {
    void ensureRunning().then((ctx) => {
      if (!ctx || ctx.state !== 'running') {
        return;
      }

      const startAt = ctx.currentTime + 0.01;
      scheduleTone(ctx, startAt, 523, 0.15);
      scheduleTone(ctx, startAt + 0.18, 659, 0.2);
    });
  };

  const playIncorrectTone = () => {
    void ensureRunning().then((ctx) => {
      if (!ctx || ctx.state !== 'running') {
        return;
      }

      scheduleTone(ctx, ctx.currentTime + 0.01, 330, 0.3, 'triangle');
    });
  };

  return {
    playCorrectTone,
    playIncorrectTone,
    ensureRunning,
    isSupported: () => Boolean(getAudioContextCtor()),
  };
}

export const toneEngine = createToneEngine();
