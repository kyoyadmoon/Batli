import taiAudioManifest from '@/data/taiAudioManifest.json';

type TaiAudioManifest = Record<string, { url: string }>;
type AudioCtor = new (src?: string) => HTMLAudioElement;

const manifest = taiAudioManifest as TaiAudioManifest;

function hasTaiAudioEntry(data: TaiAudioManifest, term: string): boolean {
  return Boolean(data[term]);
}

export function hasTaiAudio(term: string): boolean {
  return hasTaiAudioEntry(manifest, term);
}

export interface PlayMp3Options {
  playbackRate?: number;
}

export interface Mp3Engine {
  play: (term: string, options?: PlayMp3Options) => boolean;
  cancel: () => void;
  hasTermAudio: (term: string) => boolean;
  isSupported: () => boolean;
}

interface CreateMp3EngineOptions {
  manifest?: TaiAudioManifest;
  audioCtor?: AudioCtor;
  baseUrl?: string;
}

export function createMp3Engine(options: CreateMp3EngineOptions = {}): Mp3Engine {
  const data = options.manifest ?? manifest;
  const baseUrl = options.baseUrl ?? import.meta.env.BASE_URL ?? '/';
  let currentAudio: HTMLAudioElement | null = null;

  const getAudioCtor = (): AudioCtor | null => {
    if (options.audioCtor) {
      return options.audioCtor;
    }

    if (typeof window === 'undefined' || typeof window.Audio === 'undefined') {
      return null;
    }

    return window.Audio;
  };

  const cancel = () => {
    if (!currentAudio) {
      return;
    }

    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  };

  const isSupported = () => Boolean(getAudioCtor());

  const hasTermAudio = (term: string): boolean => isSupported() && hasTaiAudioEntry(data, term);

  const play = (term: string, playOptions: PlayMp3Options = {}): boolean => {
    const AudioElement = getAudioCtor();
    const entry = data[term];
    if (!AudioElement || !entry) {
      return false;
    }

    cancel();

    const resolvedUrl = entry.url.startsWith('/')
      ? `${baseUrl}${entry.url.slice(1)}`
      : entry.url;
    const audio = new AudioElement(resolvedUrl);
    const playbackRate = playOptions.playbackRate;
    audio.preload = 'auto';
    audio.playbackRate = typeof playbackRate === 'number' && Number.isFinite(playbackRate) && playbackRate > 0
      ? playbackRate
      : 1;
    currentAudio = audio;

    const clearCurrentAudio = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
    };

    const playResult = audio.play();
    if (playResult && typeof playResult.catch === 'function') {
      void playResult.catch(clearCurrentAudio);
    }

    audio.onended = clearCurrentAudio;
    audio.onerror = clearCurrentAudio;

    return true;
  };

  return {
    play,
    cancel,
    hasTermAudio,
    isSupported,
  };
}

export const mp3Engine = createMp3Engine();
