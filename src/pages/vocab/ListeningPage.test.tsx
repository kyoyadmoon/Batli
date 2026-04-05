import { act, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HelperLanguageProvider } from '@/i18n';
import { createMockAudio } from '@/test/createMockAudio';
import { ListeningPage } from './ListeningPage';

const mockState = vi.hoisted(() => ({
  audio: null as ReturnType<typeof createMockAudio> | null,
}));

vi.mock('@/hooks/audio', () => ({
  useAudio: () => mockState.audio,
  useSpeechOnly: () => ({ speak: vi.fn() }),
  hasTaiAudio: vi.fn(() => false),
}));

function renderListeningPage(initialEntry: string) {
  const router = createMemoryRouter([
    { path: '/vocab/:unitId/listening/:index', element: <ListeningPage /> },
    { path: '/vocab/:unitId/writing/:index', element: <div>writing-page</div> },
  ], {
    initialEntries: [initialEntry],
  });

  return render(
    <HelperLanguageProvider>
      <RouterProvider router={router} />
    </HelperLanguageProvider>,
  );
}

describe('ListeningPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockState.audio = createMockAudio();
    localStorage.clear();
    localStorage.setItem('learnzhtw-helper-lang', JSON.stringify({ lang: 'none', showPronunciation: false }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits for the next button instead of auto-navigating after a correct answer', () => {
    renderListeningPage('/vocab/unit-family/listening/0');

    fireEvent.click(screen.getByRole('button', { name: '人' }));

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(screen.queryByText('writing-page')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '下一步' }));

    expect(screen.getByText('writing-page')).toBeInTheDocument();
  });
});
