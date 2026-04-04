import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

interface MockOscillator {
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  type: OscillatorType;
  frequency: {
    setValueAtTime: ReturnType<typeof vi.fn>;
  };
}

interface MockGainNode {
  connect: ReturnType<typeof vi.fn>;
  gain: {
    setValueAtTime: ReturnType<typeof vi.fn>;
    exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
}

describe('useAudio', () => {
  let audioContextInstances: MockAudioContext[];

  class MockAudioContext {
    public state: AudioContextState = 'suspended';
    public currentTime = 5;
    public destination = {};
    public oscillatorNodes: MockOscillator[] = [];
    public gainNodes: MockGainNode[] = [];
    public resume = vi.fn(async () => {
      this.state = 'running';
    });

    public createOscillator = vi.fn(() => {
      const osc: MockOscillator = {
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        type: 'sine',
        frequency: {
          setValueAtTime: vi.fn(),
        },
      };
      this.oscillatorNodes.push(osc);
      return osc;
    });

    public createGain = vi.fn(() => {
      const gain: MockGainNode = {
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
      };
      this.gainNodes.push(gain);
      return gain;
    });

    constructor() {
      audioContextInstances.push(this);
    }
  }

  beforeEach(() => {
    audioContextInstances = [];
    vi.resetModules();
    localStorage.clear();
    localStorage.setItem('learnzhtw-helper-lang', JSON.stringify({ lang: 'none', showPronunciation: false }));

    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      writable: true,
      value: MockAudioContext,
    });

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speaking: false,
        pending: false,
        cancel: vi.fn(),
        resume: vi.fn(),
        speak: vi.fn(),
        getVoices: vi.fn(() => []),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });

    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);
  });

  it('reuses one shared audio context across hook instances', async () => {
    const { useAudio } = await import('./useAudio');
    const { HelperLanguageProvider } = await import('@/i18n');
    const wrapper = ({ children }: { children: ReactNode }) => (
      <HelperLanguageProvider>{children}</HelperLanguageProvider>
    );

    const first = renderHook(() => useAudio(), { wrapper });
    const second = renderHook(() => useAudio(), { wrapper });

    await act(async () => {
      first.result.current.playCorrect();
      second.result.current.playIncorrect();
      await Promise.resolve();
    });

    expect(audioContextInstances).toHaveLength(1);
    expect(audioContextInstances[0].resume).toHaveBeenCalledTimes(1);
  });

  it('uses one iOS unlock listener to resume both speech and audio engines', async () => {
    const { useAudio } = await import('./useAudio');
    const { HelperLanguageProvider } = await import('@/i18n');
    const wrapper = ({ children }: { children: ReactNode }) => (
      <HelperLanguageProvider>{children}</HelperLanguageProvider>
    );

    renderHook(() => useAudio(), { wrapper });
    const pointerdown = new Event('pointerdown');

    await act(async () => {
      window.dispatchEvent(pointerdown);
      await Promise.resolve();
    });

    expect(audioContextInstances).toHaveLength(1);
    expect(audioContextInstances[0].resume).toHaveBeenCalledTimes(1);
    expect(window.speechSynthesis.resume).toHaveBeenCalledTimes(1);
  });
});
