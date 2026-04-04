import { describe, expect, it } from 'vitest';
import { getGuideSpeechLang, getGuideSpeechText } from './guideSpeech';

describe('guideSpeech', () => {
  it('keeps chinese guide speech for none zh and tai', () => {
    expect(getGuideSpeechLang('none')).toBe('zh-TW');
    expect(getGuideSpeechLang('zh')).toBe('zh-TW');
    expect(getGuideSpeechLang('tai')).toBe('zh-TW');
    expect(getGuideSpeechText('none', '接下來，聽一聽')).toBe('接下來，聽一聽');
    expect(getGuideSpeechText('zh', '接下來，聽一聽')).toBe('接下來，聽一聽');
    expect(getGuideSpeechText('tai', '接下來，聽一聽')).toBe('接下來，聽一聽');
  });

  it('translates guide speech to english only in en mode', () => {
    expect(getGuideSpeechLang('en')).toBe('en-US');
    expect(getGuideSpeechText('en', '接下來，聽一聽')).toBe('Next, listen.');
    expect(getGuideSpeechText('en', '寫得很漂亮！')).toBe('Well done.');
  });
});
