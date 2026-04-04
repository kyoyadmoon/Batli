import { useEffect } from 'react';
import { useHanziWriter } from '@/hooks/useHanziWriter';
import type { UseHanziWriterOptions } from '@/hooks/useHanziWriter';
import styles from './StrokeCanvas.module.css';

interface StrokeData {
  character: string;
  strokeNum: number;
  mistakesOnStroke: number;
  totalMistakes: number;
  strokesRemaining: number;
}

export interface StrokeCanvasProps {
  /** Character to render (漢字 or 注音) */
  character: string;
  /** Display mode */
  mode: 'static' | 'animate' | 'quiz';
  /** Forces the current mode to re-run without remounting the canvas */
  runId?: number;
  /** Called when animation or quiz completes */
  onComplete?: (summary?: { character: string; totalMistakes: number }) => void;
  /** Called on each correct stroke in quiz mode */
  onCorrectStroke?: (data: StrokeData) => void;
  /** Called on each mistake in quiz mode */
  onMistake?: (data: StrokeData) => void;
  /** Hanzi Writer visual options */
  writerOptions?: UseHanziWriterOptions;
}

export function StrokeCanvas({
  character,
  mode,
  runId = 0,
  onComplete,
  onCorrectStroke,
  onMistake,
  writerOptions = {},
}: StrokeCanvasProps) {
  const defaultOptions: UseHanziWriterOptions = {
    width: 250,
    height: 250,
    strokeColor: '#1c1c1c',
    outlineColor: '#e0e0e0',
    showOutline: true,
    ...writerOptions,
  };

  const { containerRef, animate, quiz, stop } = useHanziWriter(character, defaultOptions);

  // Auto-trigger animation or quiz based on mode
  useEffect(() => {
    let active = true;

    if (mode === 'animate') {
      animate().then(() => {
        if (active) {
          onComplete?.();
        }
      });
    } else if (mode === 'quiz') {
      quiz({
        onCorrectStroke,
        onMistake,
        onComplete,
      });
    }

    return () => {
      active = false;
      stop();
    };
  }, [character, mode, runId, animate, quiz, stop, onComplete, onCorrectStroke, onMistake]);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.canvas} />
    </div>
  );
}
