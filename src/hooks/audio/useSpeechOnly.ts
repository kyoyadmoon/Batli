import { useCallback, useEffect } from 'react';
import { bindIOSUnlockListeners } from './engines/iosUnlock';
import { speechEngine } from './engines/speechEngine';

export interface UseSpeechOnlyReturn {
  speak: (text: string) => void;
}

export function useSpeechOnly(): UseSpeechOnlyReturn {
  useEffect(() => {
    bindIOSUnlockListeners();
  }, []);

  const speak = useCallback((text: string) => {
    speechEngine.speak(text, {
      lang: 'zh-TW',
      rate: 0.85,
      pitch: 1,
      volume: 1,
    });
  }, []);

  return { speak };
}
