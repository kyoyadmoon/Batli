import { fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HelperLanguageProvider } from '@/i18n';
import { createMockAudio } from '@/test/createMockAudio';
import { RecognitionPage } from './RecognitionPage';

const speakMock = vi.fn();
const playTermMock = vi.fn();
const mockState = vi.hoisted(() => ({
  audio: null as ReturnType<typeof createMockAudio> | null,
}));

vi.mock('@/hooks/audio', () => ({
  useAudio: () => mockState.audio,
  useSpeechOnly: () => ({ speak: vi.fn() }),
  hasTaiAudio: vi.fn(() => true),
}));

function renderRecognitionPage(initialEntry: string) {
  const router = createMemoryRouter([
    { path: '/vocab/:unitId/recognition/:index', element: <RecognitionPage /> },
  ], {
    initialEntries: [initialEntry],
  });

  return render(
    <HelperLanguageProvider>
      <RouterProvider router={router} />
    </HelperLanguageProvider>,
  );
}

describe('RecognitionPage', () => {
  beforeEach(() => {
    mockState.audio = createMockAudio({
      speak: speakMock,
      playTaiAudio: playTermMock,
      hasTaiAudio: vi.fn(() => true),
    });
    localStorage.clear();
    localStorage.setItem('learnzhtw-helper-lang', JSON.stringify({ lang: 'tai', showPronunciation: true }));
    speakMock.mockReset();
    playTermMock.mockReset();
  });

  it('shows the primary tai helper and Tai-lo pronunciation for active vocabulary units', async () => {
    renderRecognitionPage('/vocab/unit-family/recognition/0');

    expect(await screen.findByText('人')).toBeInTheDocument();
    expect(await screen.findByText('lâng')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: '播放台語發音：人' })).toBeInTheDocument();
  });

  it('keeps Tai-lo visible and routes primary tai helper clicks through tai audio playback', async () => {
    renderRecognitionPage('/vocab/unit-family/recognition/14');

    expect(await screen.findByText('家')).toBeInTheDocument();
    expect(await screen.findByText('厝')).toBeInTheDocument();
    expect(await screen.findByText('tshù')).toBeInTheDocument();

    fireEvent.click(await screen.findByRole('button', { name: '播放台語發音：厝' }));

    expect(playTermMock).toHaveBeenCalledWith('家');
    expect(speakMock).not.toHaveBeenCalled();
  });

  it('still shows Chinese related words in tai mode when those related words have no tai audio', async () => {
    mockState.audio = createMockAudio({
      speak: speakMock,
      playTaiAudio: playTermMock,
      hasTaiAudio: vi.fn((term: string) => term === '兔'),
    });

    renderRecognitionPage('/vocab/unit-animals/recognition/3');

    expect(await screen.findByText('兔')).toBeInTheDocument();
    expect(await screen.findByText('兔子')).toBeInTheDocument();
    expect(screen.getByText('白兔')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /播放台語發音：兔子/ })).not.toBeInTheDocument();
  });

  it('plays the radical hint in Mandarin when the hint is clicked', async () => {
    renderRecognitionPage('/vocab/unit-furniture/recognition/3');

    const radicalHintButton = await screen.findByRole('button', { name: '播放部首提示：木字旁，跟木頭有關' });

    expect(radicalHintButton).toHaveTextContent('🔊');
    fireEvent.click(radicalHintButton);

    expect(speakMock).toHaveBeenCalledWith('木字旁，跟木頭有關');
  });
});
