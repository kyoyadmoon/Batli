import { vi } from 'vitest';
import type { UseAudioReturn } from '@/hooks/audio/useAudio';
import type { UseSpeechOnlyReturn } from '@/hooks/audio/useSpeechOnly';

export function createMockAudio(overrides: Partial<UseAudioReturn> = {}): UseAudioReturn {
  return {
    speak: vi.fn(),
    speakGuide: vi.fn(),
    speakGuideRaw: vi.fn(),
    playTaiAudio: vi.fn(() => true),
    hasTaiAudio: vi.fn(() => true),
    playCorrect: vi.fn(),
    playIncorrect: vi.fn(),
    encourage: vi.fn(),
    cancelAll: vi.fn(),
    speaking: false,
    guideText: vi.fn((text: string) => text),
    guideTitle: vi.fn((text: string) => text),
    isEnglishGuide: false,
    ...overrides,
  };
}

export function createMockSpeechOnly(
  overrides: Partial<UseSpeechOnlyReturn> = {},
): UseSpeechOnlyReturn {
  return {
    speak: vi.fn(),
    ...overrides,
  };
}
