import type { ZhuyinSymbol, VocabCharacter, QuizQuestion } from './types';

/** Fisher-Yates shuffle (non-mutating) */
function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pick `count` distractors from `pool`, excluding items matching `exclude`.
 */
export function pickDistractors<T>(
  pool: readonly T[],
  exclude: T,
  count: number,
  isEqual: (a: T, b: T) => boolean = (a, b) => a === b,
): T[] {
  const candidates = pool.filter((item) => !isEqual(item, exclude));
  return shuffle(candidates).slice(0, count);
}

/**
 * Generate a zhuyin listening quiz question.
 * Prefers same-group distractors (visually similar = better quiz).
 */
export function generateZhuyinQuiz(
  target: ZhuyinSymbol,
  allSymbols: readonly ZhuyinSymbol[],
  distractorCount: number = 3,
): QuizQuestion<ZhuyinSymbol> {
  const sameGroup = allSymbols.filter(
    (s) => s.group === target.group && s.symbol !== target.symbol,
  );

  let distractors: ZhuyinSymbol[];
  if (sameGroup.length >= distractorCount) {
    distractors = shuffle(sameGroup).slice(0, distractorCount);
  } else {
    const otherGroup = allSymbols.filter(
      (s) => s.group !== target.group && s.symbol !== target.symbol,
    );
    distractors = [...shuffle(sameGroup), ...shuffle(otherGroup)].slice(
      0,
      distractorCount,
    );
  }

  return {
    prompt: `請幫我找到「${target.pronunciation}」`,
    correctAnswer: target,
    distractors,
  };
}

/**
 * Generate a vocabulary listening quiz question.
 * Distractors are drawn from the same unit.
 */
export function generateVocabListeningQuiz(
  target: VocabCharacter,
  unitCharacters: readonly VocabCharacter[],
  distractorCount: number = 3,
): QuizQuestion<VocabCharacter> {
  const distractors = pickDistractors(
    unitCharacters,
    target,
    distractorCount,
    (a, b) => a.character === b.character,
  );

  return {
    prompt: target.pronunciation,
    correctAnswer: target,
    distractors,
  };
}
