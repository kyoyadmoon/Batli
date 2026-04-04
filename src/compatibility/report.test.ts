import { describe, expect, it, vi } from 'vitest';
import { assessCompatibility } from './report';

function createStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}

describe('assessCompatibility', () => {
  it('returns compatible when required browser features are available', async () => {
    const report = await assessCompatibility({
      localStorage: createStorageMock(),
      history: {
        pushState: vi.fn(),
        replaceState: vi.fn(),
      },
      requestAnimationFrame: vi.fn(),
      fetch: vi.fn(),
      speechSynthesis: {
        speak: vi.fn(),
        cancel: vi.fn(),
        resume: vi.fn(),
        getVoices: vi.fn(() => []),
      },
      document: {
        createElementNS: vi.fn(),
      },
    });

    expect(report.compatible).toBe(true);
    expect(report.issues).toHaveLength(0);
  });

  it('reports each missing critical capability', async () => {
    const report = await assessCompatibility({
      localStorage: undefined,
      history: undefined,
      requestAnimationFrame: undefined,
      fetch: undefined,
      speechSynthesis: undefined,
      document: undefined,
    });

    expect(report.compatible).toBe(false);
    expect(report.issues.map((issue) => issue.id)).toEqual([
      'storage',
      'history',
      'animation',
      'fetch',
      'speech',
      'svg',
    ]);
  });

  it('marks storage as incompatible when write access throws', async () => {
    const report = await assessCompatibility({
      localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(() => {
          throw new Error('blocked');
        }),
        removeItem: vi.fn(),
      },
      history: {
        pushState: vi.fn(),
        replaceState: vi.fn(),
      },
      requestAnimationFrame: vi.fn(),
      fetch: vi.fn(),
      speechSynthesis: {
        speak: vi.fn(),
        cancel: vi.fn(),
        resume: vi.fn(),
        getVoices: vi.fn(() => []),
      },
      document: {
        createElementNS: vi.fn(),
      },
    });

    expect(report.compatible).toBe(false);
    expect(report.issues.map((issue) => issue.id)).toContain('storage');
  });
});
