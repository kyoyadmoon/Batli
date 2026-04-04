import { useCallback, useEffect, useState } from 'react';
import { useHelperLang } from '@/i18n';
import { getGuideSpeechLang, getGuideSpeechText } from '@/i18n/guideSpeech';
import { getEncouragements, getRetryMessages, randomPick } from './encouragements';
import { bindIOSUnlockListeners } from './engines/iosUnlock';
import { mp3Engine } from './engines/mp3Engine';
import { speechEngine, type SpeakOptions } from './engines/speechEngine';
import { toneEngine } from './engines/toneEngine';

export interface UseAudioReturn {
  speak: (text: string, options?: { interrupt?: boolean }) => void;
  speakGuide: (chineseText: string) => void;
  speakGuideRaw: (text: string) => void;
  playTaiAudio: (term: string) => boolean;
  hasTaiAudio: (term: string) => boolean;
  playCorrect: () => void;
  playIncorrect: () => void;
  encourage: (text?: string) => void;
  cancelAll: () => void;
  speaking: boolean;
  guideText: (chineseText: string) => string;
  guideTitle: (chineseText: string) => string;
  isEnglishGuide: boolean;
}

const DEFAULT_SPEECH_OPTIONS: SpeakOptions = {
  lang: 'zh-TW',
  rate: 0.85,
  pitch: 1,
  volume: 1,
};

export function useAudio(): UseAudioReturn {
  const { lang, uiText } = useHelperLang();
  const [speaking, setSpeaking] = useState(() => speechEngine.isSpeaking());
  const guideLang = getGuideSpeechLang(lang);
  const encouragements = getEncouragements(lang);
  const retryMessages = getRetryMessages(lang);
  const isEnglishGuide = lang === 'en';

  useEffect(() => {
    bindIOSUnlockListeners();
    return speechEngine.onSpeakingChange(setSpeaking);
  }, []);

  const speak = useCallback(
    (text: string, options?: { interrupt?: boolean }) => {
      speechEngine.speak(text, {
        ...DEFAULT_SPEECH_OPTIONS,
        interrupt: options?.interrupt,
      });
    },
    [],
  );

  const speakGuideRaw = useCallback(
    (text: string) => {
      speechEngine.speak(text, {
        ...DEFAULT_SPEECH_OPTIONS,
        lang: guideLang,
      });
    },
    [guideLang],
  );

  const guideText = useCallback(
    (chineseText: string) => getGuideSpeechText(lang, chineseText),
    [lang],
  );

  const guideTitle = useCallback(
    (chineseText: string) => (isEnglishGuide ? uiText(chineseText) : chineseText),
    [isEnglishGuide, uiText],
  );

  const speakGuide = useCallback(
    (chineseText: string) => {
      speakGuideRaw(guideText(chineseText));
    },
    [guideText, speakGuideRaw],
  );

  const playTaiAudio = useCallback((term: string) => mp3Engine.play(term), []);

  const hasTaiAudio = useCallback((term: string) => mp3Engine.hasTermAudio(term), []);

  const playCorrect = useCallback(() => {
    toneEngine.playCorrectTone();
    speakGuideRaw(randomPick(encouragements));
  }, [encouragements, speakGuideRaw]);

  const playIncorrect = useCallback(() => {
    toneEngine.playIncorrectTone();
    speakGuideRaw(randomPick(retryMessages));
  }, [retryMessages, speakGuideRaw]);

  const encourage = useCallback(
    (text?: string) => {
      if (text) {
        speakGuideRaw(guideText(text));
        return;
      }

      speakGuideRaw(randomPick(encouragements));
    },
    [encouragements, guideText, speakGuideRaw],
  );

  const cancelAll = useCallback(() => {
    speechEngine.cancel();
    mp3Engine.cancel();
  }, []);

  return {
    speak,
    speakGuide,
    speakGuideRaw,
    playTaiAudio,
    hasTaiAudio,
    playCorrect,
    playIncorrect,
    encourage,
    cancelAll,
    speaking,
    guideText,
    guideTitle,
    isEnglishGuide,
  };
}
