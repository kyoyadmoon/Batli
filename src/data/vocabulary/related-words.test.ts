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

  it('uses explicit emoji for context-word fallbacks', () => {
    const vocab: VocabCharacter = {
      character: '牛',
      zhuyin: 'ㄋㄧㄡˊ',
      pronunciation: '牛',
      imageRef: '/images/test.webp',
      order: 0,
      contextWord: '牛奶',
      contextPronunciation: '牛奶',
    };

    expect(getRelatedWordsForVocab(vocab)).toEqual([
      { emoji: '🥛', word: '牛奶', pronunciation: '牛奶' },
    ]);
  });

  it('allows blank emoji when no suitable context-word emoji exists', () => {
    const vocab: VocabCharacter = {
      character: '拿',
      zhuyin: 'ㄋㄚˊ',
      pronunciation: '拿',
      imageRef: '/images/test.webp',
      order: 0,
      contextWord: '拿東西',
      contextPronunciation: '拿東西',
    };

    expect(getRelatedWordsForVocab(vocab)).toEqual([
      { emoji: '', word: '拿東西', pronunciation: '拿東西' },
    ]);
  });

  it('returns revised related-word emoji mappings', () => {
    const vocab: VocabCharacter = {
      character: '蝦',
      zhuyin: 'ㄒㄧㄚ',
      pronunciation: '蝦',
      imageRef: '/images/test.webp',
      order: 0,
    };

    expect(getRelatedWordsForVocab(vocab)).toContainEqual({
      emoji: '🦞',
      word: '龍蝦',
      pronunciation: '龍蝦',
    });
  });

  it('does not include invalid related-word entries', () => {
    const vocab: VocabCharacter = {
      character: '奶',
      zhuyin: 'ㄋㄞˇ',
      pronunciation: '奶',
      imageRef: '/images/test.webp',
      order: 0,
    };

    expect(getRelatedWordsForVocab(vocab)).not.toContainEqual({
      emoji: '🧀',
      word: '起司奶',
      pronunciation: '起司奶',
    });
  });

  it('uses blank emoji for bean words without a precise match', () => {
    const vocab: VocabCharacter = {
      character: '豆',
      zhuyin: 'ㄉㄡˋ',
      pronunciation: '豆',
      imageRef: '/images/test.webp',
      order: 0,
    };

    expect(getRelatedWordsForVocab(vocab)).toEqual([
      { emoji: '🫘', word: '紅豆', pronunciation: '紅豆' },
      { emoji: '', word: '黃豆', pronunciation: '黃豆' },
      { emoji: '', word: '綠豆', pronunciation: '綠豆' },
      { emoji: '', word: '豆漿', pronunciation: '豆漿' },
    ]);
  });
});
