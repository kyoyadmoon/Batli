import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMp3Engine } from './mp3Engine';

const audioInstances: MockAudioElement[] = [];

class MockAudioElement {
  src: string;
  preload: '' | 'none' | 'metadata' | 'auto' = '';
  playbackRate = 1;
  currentTime = 0;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();

  constructor(src?: string) {
    this.src = src ?? '';
    audioInstances.push(this);
  }
}

describe('mp3Engine', () => {
  beforeEach(() => {
    audioInstances.length = 0;
  });

  it('uses the requested playback rate for term audio', () => {
    const engine = createMp3Engine({
      manifest: {
        兔: { url: '/audio/rabbit.mp3' },
      },
      audioCtor: MockAudioElement as unknown as new (src?: string) => HTMLAudioElement,
      baseUrl: '/app/',
    });

    expect(engine.play('兔', { playbackRate: 0.8 })).toBe(true);
    expect(audioInstances).toHaveLength(1);
    expect(audioInstances[0].src).toBe('/app/audio/rabbit.mp3');
    expect(audioInstances[0].playbackRate).toBe(0.8);
  });

  it('falls back to normal speed for invalid playback rates', () => {
    const engine = createMp3Engine({
      manifest: {
        兔: { url: '/audio/rabbit.mp3' },
      },
      audioCtor: MockAudioElement as unknown as new (src?: string) => HTMLAudioElement,
      baseUrl: '/app/',
    });

    expect(engine.play('兔', { playbackRate: 0 })).toBe(true);
    expect(audioInstances).toHaveLength(1);
    expect(audioInstances[0].playbackRate).toBe(1);
  });
});
