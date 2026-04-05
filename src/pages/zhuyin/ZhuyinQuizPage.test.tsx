import { act, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LearningProvider } from '@/context/LearningContext';
import { TopicMenuProvider } from '@/context/TopicMenuContext';
import { HelperLanguageProvider } from '@/i18n';
import { createMockAudio } from '@/test/createMockAudio';
import { ZhuyinQuizPage } from './ZhuyinQuizPage';

const mockState = vi.hoisted(() => ({
  audio: null as ReturnType<typeof createMockAudio> | null,
}));

vi.mock('@/hooks/audio', () => ({
  useAudio: () => mockState.audio,
  useSpeechOnly: () => ({ speak: vi.fn() }),
  hasTaiAudio: vi.fn(() => false),
}));

function renderZhuyinQuizPage() {
  const router = createMemoryRouter([
    { path: '/zhuyin/quiz', element: <ZhuyinQuizPage /> },
    { path: '/', element: <div>home-page</div> },
  ], {
    initialEntries: ['/zhuyin/quiz'],
  });

  return render(
    <HelperLanguageProvider>
      <LearningProvider>
        <TopicMenuProvider>
          <RouterProvider router={router} />
        </TopicMenuProvider>
      </LearningProvider>
    </HelperLanguageProvider>,
  );
}

describe('ZhuyinQuizPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockState.audio = createMockAudio();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stays on the current question until the user manually advances', () => {
    renderZhuyinQuizPage();

    fireEvent.click(screen.getByRole('button', { name: 'ㄅ' }));

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(screen.getByText('1 / 5')).toBeInTheDocument();
    expect(screen.queryByText('home-page')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '下一個' }));

    expect(screen.getByText('2 / 5')).toBeInTheDocument();
  });
});
