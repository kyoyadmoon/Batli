import { useEffect, useRef, useCallback } from 'react';
import HanziWriter from 'hanzi-writer';

function readCssToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** Characters in the Zhuyin/Bopomofo range */
function isZhuyin(char: string): boolean {
  const code = char.charCodeAt(0);
  // ㄅ(0x3105) ~ ㄩ(0x3129)
  if (code >= 0x3105 && code <= 0x312f) return true;
  // Tone marks: ˉ(0x02C9) ˊ(0x02CA) ˇ(0x02C7) ˋ(0x02CB) ˙(0x02D9)
  return 'ˉˊˇˋ˙'.includes(char);
}

/** Load character data from the appropriate CDN */
function charDataLoader(
  char: string,
  onLoad: (data: object) => void,
  onError: (err?: unknown) => void,
) {
  const baseUrl = isZhuyin(char)
    ? `https://cdn.jsdelivr.net/gh/MadLadSquad/hanzi-writer-data-youyin@latest/data`
    : `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest`;

  const url = `${baseUrl}/${encodeURIComponent(char)}.json`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`No stroke data for "${char}"`);
      return res.json();
    })
    .then(onLoad)
    .catch(onError);
}

export interface UseHanziWriterOptions {
  width?: number;
  height?: number;
  strokeColor?: string;
  outlineColor?: string;
  showOutline?: boolean;
  strokeAnimationSpeed?: number;
  strokeHighlightSpeed?: number;
  strokeHighlightDuration?: number;
  delayBetweenStrokes?: number;
  quizHintAfterMisses?: number;
}

interface StrokeData {
  character: string;
  strokeNum: number;
  mistakesOnStroke: number;
  totalMistakes: number;
  strokesRemaining: number;
}

type HanziWriterWithInternals = HanziWriter & {
  _renderState?: {
    cancelAll: () => void;
  };
};

export interface UseHanziWriterReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  animate: () => Promise<void>;
  quiz: (callbacks?: {
    onCorrectStroke?: (data: StrokeData) => void;
    onMistake?: (data: StrokeData) => void;
    onComplete?: (summary: { character: string; totalMistakes: number }) => void;
  }) => void;
  stop: () => void;
}

export function useHanziWriter(
  character: string,
  options: UseHanziWriterOptions = {},
): UseHanziWriterReturn {
  const {
    width = 200,
    height = 200,
    showOutline = true,
    strokeAnimationSpeed = 1,
    strokeHighlightSpeed = 1,
    strokeHighlightDuration,
    delayBetweenStrokes =300,
    quizHintAfterMisses = 2,
  } = options;
  const strokeColor = options.strokeColor ?? readCssToken('--color-text', '#333333');
  const outlineColor = options.outlineColor ?? readCssToken('--color-border-subtle', '#dddddd');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const readyRef = useRef<Promise<void> | null>(null);

  // Create / recreate writer when character or key options change
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !character) return;

    el.innerHTML = '';

    let resolveReady: () => void;
    readyRef.current = new Promise<void>((r) => { resolveReady = r; });

    writerRef.current = HanziWriter.create(el, character, {
      width,
      height,
      padding: 5,
      strokeColor,
      outlineColor,
      showOutline,
      strokeAnimationSpeed,
      strokeHighlightSpeed,
      strokeHighlightDuration,
      delayBetweenStrokes,
      charDataLoader: charDataLoader as Parameters<typeof HanziWriter.create>[2] extends infer O ? O extends { charDataLoader?: infer L } ? L : never : never,
      onLoadCharDataSuccess: () => resolveReady(),
      onLoadCharDataError: () => resolveReady(), // resolve anyway so callers don't hang
    });

    return () => {
      el.innerHTML = '';
      writerRef.current = null;
      readyRef.current = null;
    };
  }, [character, width, height, strokeColor, outlineColor, showOutline, strokeAnimationSpeed, strokeHighlightSpeed, strokeHighlightDuration, delayBetweenStrokes]);

  const animate = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const ready = readyRef.current ?? Promise.resolve();
      ready.then(() => {
        if (!writerRef.current) {
          resolve();
          return;
        }
        writerRef.current.animateCharacter({
          onComplete: () => resolve(),
        });
      });
    });
  }, []);

  const stop = useCallback(() => {
    const writer = writerRef.current as HanziWriterWithInternals | null;
    if (!writer) return;
    writer.cancelQuiz();
    writer._renderState?.cancelAll();
  }, []);

  const quiz = useCallback(
    (callbacks?: {
      onCorrectStroke?: (data: StrokeData) => void;
      onMistake?: (data: StrokeData) => void;
      onComplete?: (summary: { character: string; totalMistakes: number }) => void;
    }) => {
      const ready = readyRef.current ?? Promise.resolve();
      ready.then(() => {
        if (!writerRef.current) return;
        writerRef.current.quiz({
          showHintAfterMisses: quizHintAfterMisses,
          onCorrectStroke: callbacks?.onCorrectStroke as never,
          onMistake: callbacks?.onMistake as never,
          onComplete: callbacks?.onComplete as never,
        });
      });
    },
    [quizHintAfterMisses],
  );

  return { containerRef, animate, quiz, stop };
}
