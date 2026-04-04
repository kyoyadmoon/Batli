import type { HelperLangCode } from '@/i18n';

const ZH_ENCOURAGEMENTS = [
  '真棒！',
  '太厲害了！',
  '學會了喔！',
  '很好！',
  '好棒！',
] as const;

const ZH_RETRY_MESSAGES = [
  '沒關係，再試一次看看',
  '慢慢來，不急',
  '再試一次',
] as const;

const EN_ENCOURAGEMENTS = [
  'Great.',
  'Excellent.',
  'You got it.',
  'Very good.',
  'Nicely done.',
] as const;

const EN_RETRY_MESSAGES = [
  'That is okay. Try again.',
  'Take your time.',
  'Try again.',
] as const;

export function getEncouragements(lang: HelperLangCode): readonly string[] {
  return lang === 'en' ? EN_ENCOURAGEMENTS : ZH_ENCOURAGEMENTS;
}

export function getRetryMessages(lang: HelperLangCode): readonly string[] {
  return lang === 'en' ? EN_RETRY_MESSAGES : ZH_RETRY_MESSAGES;
}

export function randomPick(messages: readonly string[]): string {
  return messages[Math.floor(Math.random() * messages.length)] ?? '';
}
