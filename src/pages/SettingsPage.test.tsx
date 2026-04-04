import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { HelperLanguageProvider } from '@/i18n';
import { SettingsPage } from './SettingsPage';

function renderSettingsPage() {
  return render(
    <MemoryRouter>
      <HelperLanguageProvider>
        <SettingsPage />
      </HelperLanguageProvider>
    </MemoryRouter>,
  );
}

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('learnzhtw-helper-lang', JSON.stringify({ lang: 'none', showPronunciation: false }));
  });

  it('previews the save instruction in the selected language before applying', async () => {
    const user = userEvent.setup();

    renderSettingsPage();

    await user.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByText('Hold for 3 seconds to save')).toBeInTheDocument();
  });
});
