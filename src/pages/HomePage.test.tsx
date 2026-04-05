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
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    });
    Object.defineProperty(window.navigator, 'maxTouchPoints', {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window.navigator, 'standalone', {
      configurable: true,
      value: false,
    });
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.alert = vi.fn();
  });

  it('opens the settings page from the home settings button', async () => {
    const user = userEvent.setup();

    renderHomeWithRouter();

    await user.click(screen.getByRole('button', { name: '設定' }));

    expect(await screen.findByText('settings-page')).toBeInTheDocument();
  });

  it('shows manual iPhone install instructions when no native install prompt is available', async () => {
    const user = userEvent.setup();

    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    });
    Object.defineProperty(window.navigator, 'maxTouchPoints', {
      configurable: true,
      value: 5,
    });

    renderHomeWithRouter();

    await user.click(await screen.findByRole('button', { name: '安裝到手機首頁' }));

    expect(window.alert).toHaveBeenCalledWith('請按 Safari 下方的分享按鈕，再選「加入主畫面」。');
  });

  it('uses the browser install prompt when available', async () => {
    const user = userEvent.setup();
    const prompt = vi.fn().mockResolvedValue(undefined);
    const promptEvent = new Event('beforeinstallprompt') as Event & {
      prompt: ReturnType<typeof vi.fn>;
      userChoice: Promise<{ outcome: 'accepted'; platform: string }>;
    };

    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
    });
    Object.defineProperty(window.navigator, 'maxTouchPoints', {
      configurable: true,
      value: 5,
    });
    promptEvent.prompt = prompt;
    promptEvent.userChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' });

    renderHomeWithRouter();
    window.dispatchEvent(promptEvent);

    await user.click(await screen.findByRole('button', { name: '安裝到手機首頁' }));

    expect(prompt).toHaveBeenCalledTimes(1);
  });
});
