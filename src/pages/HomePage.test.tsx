import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LearningProvider } from '@/context/LearningContext';
import { TopicMenuProvider } from '@/context/TopicMenuContext';
import { HelperLanguageProvider } from '@/i18n';
import { createMockAudio } from '@/test/createMockAudio';
import { HomePage } from './HomePage';

const mockState = vi.hoisted(() => ({
  audio: null as ReturnType<typeof createMockAudio> | null,
}));

vi.mock('@/hooks/audio', () => ({
  useAudio: () => mockState.audio,
  useSpeechOnly: () => ({ speak: vi.fn() }),
  hasTaiAudio: vi.fn(() => false),
}));

function renderHomeWithRouter() {
  const router = createMemoryRouter([
    { path: '/', element: <HomePage /> },
    { path: '/settings', element: <div>settings-page</div> },
  ], {
    initialEntries: ['/'],
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

describe('HomePage', () => {
  beforeEach(() => {
    mockState.audio = createMockAudio();
    localStorage.clear();
    localStorage.setItem('learnzhtw-helper-lang', JSON.stringify({ lang: 'none', showPronunciation: false }));
  });

  it('opens the settings page from the home settings button', async () => {
    const user = userEvent.setup();

    renderHomeWithRouter();

    await user.click(screen.getByRole('button', { name: '設定' }));

    expect(await screen.findByText('settings-page')).toBeInTheDocument();
  });
});
