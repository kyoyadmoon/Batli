import type { HelperLangCode, HelperWordSet } from './types';
import { enUi } from './locales/en-ui';
import { taiUi } from './locales/tai-ui';
import { zhUi } from './locales/zh-ui';

const uiTextByLang: Record<Exclude<HelperLangCode, 'none'>, HelperWordSet['ui']> = {
  zh: zhUi,
  en: enUi,
  tai: taiUi,
};

export function getUiTextForLang(code: HelperLangCode, chineseText: string): string {
  if (code === 'none') return chineseText;
  return uiTextByLang[code][chineseText]?.translation ?? chineseText;
}
