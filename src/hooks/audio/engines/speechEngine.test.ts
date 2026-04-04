import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from '@testing-library/react';
import { createSpeechEngine } from './speechEngine';

class MockSpeechSynthesisUtterance {
  text: string;
  lang = '';
  rate = 1;
  pitch = 1;
  volume = 1;
  voice?: SpeechSynthesisVoice;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

function createSpeechSynthesisMock(overrides: Partial<SpeechSynthesis> = {}): SpeechSynthesis {
  return {
    speaking: false,
    pending: false,
    paused: false,
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    speak: vi.fn(),
    getVoices: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onvoiceschanged: null,
    ...overrides,
  } as unknown as SpeechSynthesis;
}

describe('speechEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('cancels queued speech before speaking by default', () => {
    const speechSynthesisMock = createSpeechSynthesisMock({
      speaking: true,
      cancel: vi.fn(),
      resume: vi.fn(),
      speak: vi.fn(),
    });
    const engine = createSpeechEngine({
      win: window,
      doc: document,
      speechSynthesis: speechSynthesisMock,
      SpeechSynthesisUtteranceCtor: MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance,
    });

    engine.speak('測試播放');

    expect(speechSynthesisMock.cancel).toHaveBeenCalledTimes(1);
    expect(speechSynthesisMock.resume).toHaveBeenCalledTimes(2);
    expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(1);
  });

  it('does not interrupt active speech when interrupt is false', () => {
    const speechSynthesisMock = createSpeechSynthesisMock({
      speaking: true,
      cancel: vi.fn(),
      resume: vi.fn(),
      speak: vi.fn(),
    });
    const engine = createSpeechEngine({
      win: window,
      doc: document,
      speechSynthesis: speechSynthesisMock,
      SpeechSynthesisUtteranceCtor: MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance,
    });

    engine.speak('自動提示', { interrupt: false });

    expect(speechSynthesisMock.cancel).not.toHaveBeenCalled();
    expect(speechSynthesisMock.speak).not.toHaveBeenCalled();
  });

  it('retries once when speech does not start in time', async () => {
    const speechSynthesisMock = createSpeechSynthesisMock({
      cancel: vi.fn(),
      resume: vi.fn(),
      speak: vi.fn(),
    });
    const engine = createSpeechEngine({
      win: window,
      doc: document,
      speechSynthesis: speechSynthesisMock,
      SpeechSynthesisUtteranceCtor: MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance,
    });

    engine.speak('重試播放');

    await act(async () => {
      vi.advanceTimersByTime(1500);
      await Promise.resolve();
    });

    expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(2);
    expect(speechSynthesisMock.cancel).toHaveBeenCalledTimes(1);
  });

  it('uses a broader Chinese voice when zh-TW is unavailable', () => {
    const chineseVoice = {
      lang: 'cmn-CN',
      default: false,
      name: 'Chinese Voice',
      localService: true,
      voiceURI: 'cmn-CN',
    } as SpeechSynthesisVoice;
    const speechSynthesisMock = createSpeechSynthesisMock({
      getVoices: vi.fn(() => [chineseVoice]),
      speak: vi.fn(),
    });
    const engine = createSpeechEngine({
      win: window,
      doc: document,
      speechSynthesis: speechSynthesisMock,
      SpeechSynthesisUtteranceCtor: MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance,
    });

    engine.speak('中文播放', { lang: 'zh-TW' });

    const utterance = vi.mocked(speechSynthesisMock.speak).mock.calls[0]?.[0] as MockSpeechSynthesisUtterance;
    expect(utterance.voice).toBe(chineseVoice);
    expect(utterance.lang).toBe('cmn-CN');
  });

  it('tracks speaking state through listener callbacks', () => {
    const speechSynthesisMock = createSpeechSynthesisMock({
      speak: vi.fn(),
    });
    const engine = createSpeechEngine({
      win: window,
      doc: document,
      speechSynthesis: speechSynthesisMock,
      SpeechSynthesisUtteranceCtor: MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance,
    });
    const onSpeakingChange = vi.fn();
    engine.onSpeakingChange(onSpeakingChange);

    engine.speak('狀態測試');

    const utterance = vi.mocked(speechSynthesisMock.speak).mock.calls[0]?.[0] as MockSpeechSynthesisUtterance;
    utterance.onstart?.();
    utterance.onend?.();

    expect(engine.isSpeaking()).toBe(false);
    expect(onSpeakingChange).toHaveBeenNthCalledWith(1, true);
    expect(onSpeakingChange).toHaveBeenNthCalledWith(2, false);
  });
});
