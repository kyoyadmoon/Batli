import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react';

interface LearningProgress {
  /** Set of learned zhuyin symbols */
  learnedZhuyin: Set<string>;
  /** Set of learned vocabulary characters */
  learnedVocab: Set<string>;
  /** Total lessons completed */
  totalCompleted: number;
}

interface LearningContextValue extends LearningProgress {
  markZhuyinLearned: (symbol: string) => void;
  markVocabLearned: (character: string) => void;
  isZhuyinLearned: (symbol: string) => boolean;
  isVocabLearned: (character: string) => boolean;
}

const STORAGE_KEY = 'learnzhtw-progress';

function loadProgress(): LearningProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { learnedZhuyin: new Set(), learnedVocab: new Set(), totalCompleted: 0 };
    const parsed = JSON.parse(stored);
    return {
      learnedZhuyin: new Set(parsed.learnedZhuyin ?? []),
      learnedVocab: new Set(parsed.learnedVocab ?? []),
      totalCompleted: parsed.totalCompleted ?? 0,
    };
  } catch {
    return { learnedZhuyin: new Set(), learnedVocab: new Set(), totalCompleted: 0 };
  }
}

function saveProgress(progress: LearningProgress) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      learnedZhuyin: [...progress.learnedZhuyin],
      learnedVocab: [...progress.learnedVocab],
      totalCompleted: progress.totalCompleted,
    }),
  );
}

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markZhuyinLearned = useCallback((symbol: string) => {
    setProgress((prev) => {
      if (prev.learnedZhuyin.has(symbol)) return prev;
      const next = new Set(prev.learnedZhuyin);
      next.add(symbol);
      return { ...prev, learnedZhuyin: next, totalCompleted: prev.totalCompleted + 1 };
    });
  }, []);

  const markVocabLearned = useCallback((character: string) => {
    setProgress((prev) => {
      if (prev.learnedVocab.has(character)) return prev;
      const next = new Set(prev.learnedVocab);
      next.add(character);
      return { ...prev, learnedVocab: next, totalCompleted: prev.totalCompleted + 1 };
    });
  }, []);

  const isZhuyinLearned = useCallback(
    (symbol: string) => progress.learnedZhuyin.has(symbol),
    [progress.learnedZhuyin],
  );

  const isVocabLearned = useCallback(
    (character: string) => progress.learnedVocab.has(character),
    [progress.learnedVocab],
  );

  return (
    <LearningContext.Provider
      value={{
        ...progress,
        markZhuyinLearned,
        markVocabLearned,
        isZhuyinLearned,
        isVocabLearned,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning(): LearningContextValue {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error('useLearning must be used within LearningProvider');
  return ctx;
}
