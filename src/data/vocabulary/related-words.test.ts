import { describe, expect, it } from 'vitest';
import type { VocabCharacter } from '../types';
import { getRelatedWordsForVocab, getTaiAudioRelatedWordsForVocab } from './related-words';

describe('related words selectors', () => {
  it('preserves non-audio related words for non-tai helper modes', () => {
    const vocab: VocabCharacter = {
      character: '測',
      zhuyin: 'ㄘㄜˋ',
      pronunciation: '測',
      imageRef: '/images/test.webp',
      order: 0,
      relatedWords: [
        { emoji: '🍚', word: '白飯', pronunciation: '白飯' },
        { emoji: '🧪', word: '測試詞', pronunciation: '測試詞' },
      ],
    };

    expect(getRelatedWordsForVocab(vocab)).toEqual(vocab.relatedWords);
  });

  it('filters tai related words to items with audio', () => {
    const vocab: VocabCharacter = {
      character: '測',
      zhuyin: 'ㄘㄜˋ',
      pronunciation: '測',
      imageRef: '/images/test.webp',
      order: 0,
      relatedWords: [
        { emoji: '🍚', word: '白飯', pronunciation: '白飯' },
        { emoji: '🧪', word: '測試詞', pronunciation: '測試詞' },
      ],
    };

    expect(getTaiAudioRelatedWordsForVocab(vocab)).toEqual([
      { emoji: '🍚', word: '白飯', pronunciation: '白飯' },
    ]);
  });
});
