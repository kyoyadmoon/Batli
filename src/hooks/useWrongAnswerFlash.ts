import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_FLASH_MS = 2000;

export function useWrongAnswerFlash(durationMs: number = DEFAULT_FLASH_MS) {
  const [wrongAnswerId, setWrongAnswerId] = useState<string | null>(null);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearScheduled = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const flashWrongAnswer = useCallback((id: string) => {
    clearScheduled();
    setWrongAnswerId(null);

    frameRef.current = window.requestAnimationFrame(() => {
      setWrongAnswerId(id);
      frameRef.current = null;
      timeoutRef.current = window.setTimeout(() => {
        setWrongAnswerId(null);
        timeoutRef.current = null;
      }, durationMs);
    });
  }, [clearScheduled, durationMs]);

  useEffect(() => () => {
    clearScheduled();
  }, [clearScheduled]);

  return { wrongAnswerId, flashWrongAnswer };
}
