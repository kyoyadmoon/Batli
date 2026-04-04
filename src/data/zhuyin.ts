import type { ZhuyinModule, ZhuyinSymbol } from './types';

const shengmu: readonly ZhuyinSymbol[] = [
  { symbol: 'ㄅ', group: '聲母', order: 0, pronunciation: 'ㄅ' },
  { symbol: 'ㄆ', group: '聲母', order: 1, pronunciation: 'ㄆ' },
  { symbol: 'ㄇ', group: '聲母', order: 2, pronunciation: 'ㄇ' },
  { symbol: 'ㄈ', group: '聲母', order: 3, pronunciation: 'ㄈ' },
  { symbol: 'ㄉ', group: '聲母', order: 4, pronunciation: 'ㄉ' },
  { symbol: 'ㄊ', group: '聲母', order: 5, pronunciation: 'ㄊ' },
  { symbol: 'ㄋ', group: '聲母', order: 6, pronunciation: 'ㄋ' },
  { symbol: 'ㄌ', group: '聲母', order: 7, pronunciation: 'ㄌ' },
  { symbol: 'ㄍ', group: '聲母', order: 8, pronunciation: 'ㄍ' },
  { symbol: 'ㄎ', group: '聲母', order: 9, pronunciation: 'ㄎ' },
  { symbol: 'ㄏ', group: '聲母', order: 10, pronunciation: 'ㄏ' },
  { symbol: 'ㄐ', group: '聲母', order: 11, pronunciation: 'ㄐ' },
  { symbol: 'ㄑ', group: '聲母', order: 12, pronunciation: 'ㄑ' },
  { symbol: 'ㄒ', group: '聲母', order: 13, pronunciation: 'ㄒ' },
  { symbol: 'ㄓ', group: '聲母', order: 14, pronunciation: 'ㄓ' },
  { symbol: 'ㄔ', group: '聲母', order: 15, pronunciation: 'ㄔ' },
  { symbol: 'ㄕ', group: '聲母', order: 16, pronunciation: 'ㄕ' },
  { symbol: 'ㄖ', group: '聲母', order: 17, pronunciation: 'ㄖ' },
  { symbol: 'ㄗ', group: '聲母', order: 18, pronunciation: 'ㄗ' },
  { symbol: 'ㄘ', group: '聲母', order: 19, pronunciation: 'ㄘ' },
  { symbol: 'ㄙ', group: '聲母', order: 20, pronunciation: 'ㄙ' },
] as const;

const yunmu: readonly ZhuyinSymbol[] = [
  { symbol: 'ㄚ', group: '韻母', order: 0, pronunciation: 'ㄚ' },
  { symbol: 'ㄛ', group: '韻母', order: 1, pronunciation: 'ㄛ' },
  { symbol: 'ㄜ', group: '韻母', order: 2, pronunciation: 'ㄜ' },
  { symbol: 'ㄝ', group: '韻母', order: 3, pronunciation: 'ㄝ' },
  { symbol: 'ㄞ', group: '韻母', order: 4, pronunciation: 'ㄞ' },
  { symbol: 'ㄟ', group: '韻母', order: 5, pronunciation: 'ㄟ' },
  { symbol: 'ㄠ', group: '韻母', order: 6, pronunciation: 'ㄠ' },
  { symbol: 'ㄡ', group: '韻母', order: 7, pronunciation: 'ㄡ' },
  { symbol: 'ㄢ', group: '韻母', order: 8, pronunciation: 'ㄢ' },
  { symbol: 'ㄣ', group: '韻母', order: 9, pronunciation: 'ㄣ' },
  { symbol: 'ㄤ', group: '韻母', order: 10, pronunciation: 'ㄤ' },
  { symbol: 'ㄥ', group: '韻母', order: 11, pronunciation: 'ㄥ' },
  { symbol: 'ㄦ', group: '韻母', order: 12, pronunciation: 'ㄦ' },
] as const;

const jieyin: readonly ZhuyinSymbol[] = [
  { symbol: 'ㄧ', group: '介音', order: 0, pronunciation: 'ㄧ' },
  { symbol: 'ㄨ', group: '介音', order: 1, pronunciation: 'ㄨ' },
  { symbol: 'ㄩ', group: '介音', order: 2, pronunciation: 'ㄩ' },
] as const;

export const zhuyinModule: ZhuyinModule = {
  kind: 'zhuyin',
  id: 'zhuyin-basics',
  title: '基礎正音',
  icon: 'ㄅ',
  voiceIntro: '歡迎來到注音符號學習',
  symbols: [...shengmu, ...yunmu, ...jieyin],
} as const;
