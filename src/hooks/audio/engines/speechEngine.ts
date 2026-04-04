const SPEECH_START_TIMEOUT_MS = 1500;

type SpeechChangeListener = (speaking: boolean) => void;

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  interrupt?: boolean;
}

export interface SpeechEngine {
  speak: (text: string, options?: SpeakOptions) => void;
  cancel: () => void;
  resume: () => void;
  isSpeaking: () => boolean;
  isSupported: () => boolean;
  onSpeakingChange: (listener: SpeechChangeListener) => () => void;
}

interface SpeechRequest {
  id: number;
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

interface CreateSpeechEngineOptions {
  win?: Window & typeof globalThis;
  doc?: Document;
  speechSynthesis?: SpeechSynthesis;
  SpeechSynthesisUtteranceCtor?: typeof SpeechSynthesisUtterance;
}

function normalizeLangTag(lang: string): string {
  return lang.trim().toLowerCase().replace(/_/g, '-');
}

function getPrimaryLang(lang: string): string {
  return normalizeLangTag(lang).split('-')[0] ?? '';
}

function findBestVoice(voices: SpeechSynthesisVoice[], requestedLang: string): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) {
    return undefined;
  }

  const normalizedRequestedLang = normalizeLangTag(requestedLang);
  const requestedPrimaryLang = getPrimaryLang(requestedLang);
  const acceptedPrimaryLangs = new Set([requestedPrimaryLang]);

  if (requestedPrimaryLang === 'zh' || requestedPrimaryLang === 'cmn') {
    acceptedPrimaryLangs.add('zh');
    acceptedPrimaryLangs.add('cmn');
  }

  return voices.find((voice) => normalizeLangTag(voice.lang) === normalizedRequestedLang)
    ?? voices.find((voice) => acceptedPrimaryLangs.has(getPrimaryLang(voice.lang)))
    ?? voices.find((voice) => voice.default)
    ?? voices[0];
}

export function createSpeechEngine(options: CreateSpeechEngineOptions = {}): SpeechEngine {
  let requestId = 0;
  let watchdogId: number | null = null;
  let initialized = false;
  let speaking = false;
  let voices: SpeechSynthesisVoice[] = [];
  const listeners = new Set<SpeechChangeListener>();

  const getWindow = () => options.win ?? (typeof window !== 'undefined' ? window : undefined);
  const getDocument = () => options.doc ?? (typeof document !== 'undefined' ? document : undefined);
  const getSpeechSynthesis = () => options.speechSynthesis ?? getWindow()?.speechSynthesis;
  const getUtteranceCtor = () => options.SpeechSynthesisUtteranceCtor
    ?? (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : undefined);

  const setSpeaking = (nextValue: boolean) => {
    if (speaking === nextValue) {
      return;
    }

    speaking = nextValue;
    listeners.forEach((listener) => listener(nextValue));
  };

  const clearSpeechWatchdog = () => {
    const win = getWindow();
    if (!win || watchdogId === null) {
      return;
    }

    win.clearTimeout(watchdogId);
    watchdogId = null;
  };

  const loadVoices = () => {
    voices = getSpeechSynthesis()?.getVoices() ?? [];
  };

  const resume = () => {
    try {
      getSpeechSynthesis()?.resume();
    } catch {
      // Some browsers throw if the engine is unavailable; ignore and keep going.
    }
  };

  const init = () => {
    if (initialized) {
      return;
    }

    initialized = true;
    const synth = getSpeechSynthesis();
    const doc = getDocument();
    if (!synth || !doc) {
      return;
    }

    loadVoices();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', loadVoices);
    } else {
      synth.onvoiceschanged = loadVoices;
    }

    doc.addEventListener('visibilitychange', () => {
      if (doc.visibilityState !== 'visible') {
        return;
      }

      clearSpeechWatchdog();
      synth.cancel();
      resume();
      setSpeaking(false);
    });
  };

  const isSupported = () => Boolean(getSpeechSynthesis() && getUtteranceCtor());

  const speak = (text: string, speakOptions: SpeakOptions = {}) => {
    const synth = getSpeechSynthesis();
    const UtteranceCtor = getUtteranceCtor();
    if (!synth || !UtteranceCtor || text.trim().length === 0) {
      return;
    }

    init();

    const {
      lang = 'zh-TW',
      rate = 0.85,
      pitch = 1,
      volume = 1,
      interrupt = true,
    } = speakOptions;

    if (!interrupt && (synth.speaking || synth.pending)) {
      return;
    }

    const request: SpeechRequest = {
      id: ++requestId,
      text,
      lang,
      rate,
      pitch,
      volume,
      voice: findBestVoice(voices, lang),
    };

    if (request.voice) {
      request.lang = request.voice.lang;
    }

    let started = false;
    let retried = false;

    const finish = () => {
      clearSpeechWatchdog();
      setSpeaking(false);
    };

    const run = () => {
      const utterance = new UtteranceCtor(request.text);
      utterance.lang = request.lang;
      utterance.rate = request.rate;
      utterance.pitch = request.pitch;
      utterance.volume = request.volume;

      if (request.voice) {
        utterance.voice = request.voice;
      }

      utterance.onstart = () => {
        started = true;
        clearSpeechWatchdog();
        setSpeaking(true);
      };
      utterance.onend = finish;
      utterance.onerror = finish;

      if (retried || (interrupt && (synth.speaking || synth.pending))) {
        synth.cancel();
      }

      resume();
      synth.speak(utterance);
      resume();
    };

    clearSpeechWatchdog();
    run();

    const win = getWindow();
    if (!win) {
      return;
    }

    watchdogId = win.setTimeout(() => {
      if (requestId !== request.id || started) {
        return;
      }

      retried = true;
      run();
    }, SPEECH_START_TIMEOUT_MS);
  };

  const cancel = () => {
    const synth = getSpeechSynthesis();
    if (!synth) {
      return;
    }

    clearSpeechWatchdog();
    synth.cancel();
    setSpeaking(false);
  };

  const onSpeakingChange = (listener: SpeechChangeListener) => {
    init();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    speak,
    cancel,
    resume,
    isSpeaking: () => speaking,
    isSupported,
    onSpeakingChange,
  };
}

export const speechEngine = createSpeechEngine();
