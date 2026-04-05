import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { getUiTextForLang, useHelperLang } from '@/i18n';
import styles from './SettingsPage.module.css';

const HOLD_TO_SAVE_MS = 3000;

export function SettingsPage() {
  const location = useLocation();
  const {
    lang,
    setHelperLang,
    showPronunciation,
    setShowPronunciation,
    uiText,
    availableLanguages,
  } = useHelperLang();
  const [pendingLang, setPendingLang] = useState(lang);
  const [pendingShowPronunciation, setPendingShowPronunciation] = useState(showPronunciation);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdStartRef = useRef<number | null>(null);
  const holdFrameRef = useRef<number | null>(null);
  const holdResetTimerRef = useRef<number | null>(null);
  const creditsSectionRef = useRef<HTMLElement | null>(null);

  const currentLangInfo = availableLanguages.find((item) => item.code === lang) ?? availableLanguages[0];
  const pendingLangInfo = availableLanguages.find((item) => item.code === pendingLang) ?? availableLanguages[0];
  const hasPendingChanges = pendingLang !== lang || pendingShowPronunciation !== showPronunciation;

  const formatSettingsSummary = useCallback(
    (langInfo: (typeof availableLanguages)[number], pronunciationEnabled: boolean) => {
      const parts = [langInfo.nativeName];
      if (langInfo.hasPronunciation) {
        parts.push(`${uiText('顯示拼音')} ${pronunciationEnabled ? 'ON' : 'OFF'}`);
      }
      return parts.join(' · ');
    },
    [uiText],
  );

  const currentSettingsText = formatSettingsSummary(currentLangInfo, showPronunciation);
  const pendingSettingsText = formatSettingsSummary(pendingLangInfo, pendingShowPronunciation);

  const resolveSaveText = useCallback(
    (chineseText: string) => {
      if (pendingLang !== lang) {
        return getUiTextForLang(pendingLang, chineseText);
      }
      return uiText(chineseText);
    },
    [lang, pendingLang, uiText],
  );

  const saveButtonLabel = hasPendingChanges
    ? (isHolding ? resolveSaveText('儲存中') : resolveSaveText('長按三秒儲存'))
    : uiText('設定已套用');
  const saveButtonHint = hasPendingChanges ? pendingSettingsText : currentSettingsText;

  const clearHoldResetTimer = useCallback(() => {
    if (holdResetTimerRef.current !== null) {
      window.clearTimeout(holdResetTimerRef.current);
      holdResetTimerRef.current = null;
    }
  }, []);

  const stopHold = useCallback((resetProgress: boolean = true) => {
    if (holdFrameRef.current !== null) {
      window.cancelAnimationFrame(holdFrameRef.current);
      holdFrameRef.current = null;
    }
    holdStartRef.current = null;
    setIsHolding(false);
    clearHoldResetTimer();
    if (resetProgress) {
      setHoldProgress(0);
    }
  }, [clearHoldResetTimer]);

  const commitSettings = useCallback(() => {
    stopHold(false);
    setHoldProgress(1);
    setHelperLang(pendingLang);
    setShowPronunciation(pendingShowPronunciation);
    holdResetTimerRef.current = window.setTimeout(() => {
      setHoldProgress(0);
      holdResetTimerRef.current = null;
    }, 240);
  }, [pendingLang, pendingShowPronunciation, setHelperLang, setShowPronunciation, stopHold]);

  const updateHoldProgress = useCallback((timestamp: number) => {
    const start = holdStartRef.current;
    if (start === null) return;

    const nextProgress = Math.min((timestamp - start) / HOLD_TO_SAVE_MS, 1);
    setHoldProgress(nextProgress);

    if (nextProgress >= 1) {
      commitSettings();
      return;
    }

    holdFrameRef.current = window.requestAnimationFrame(updateHoldProgress);
  }, [commitSettings]);

  const startHoldToSave = useCallback(() => {
    if (!hasPendingChanges || holdStartRef.current !== null) return;

    clearHoldResetTimer();
    holdStartRef.current = window.performance.now();
    setIsHolding(true);
    setHoldProgress(0);
    holdFrameRef.current = window.requestAnimationFrame(updateHoldProgress);
  }, [clearHoldResetTimer, hasPendingChanges, updateHoldProgress]);

  const cancelHoldToSave = useCallback(() => {
    if (holdStartRef.current === null) return;
    stopHold();
  }, [stopHold]);

  useEffect(() => {
    setPendingLang(lang);
    setPendingShowPronunciation(showPronunciation);
  }, [lang, showPronunciation]);

  useEffect(() => {
    if (!hasPendingChanges) {
      stopHold();
    }
  }, [hasPendingChanges, stopHold]);

  useEffect(() => () => {
    stopHold();
  }, [stopHold]);

  useEffect(() => {
    if (location.hash !== '#licenses') {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      creditsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.hash]);

  const handleLanguageSelect = useCallback((code: typeof lang) => {
    stopHold();
    setPendingLang(code);
  }, [stopHold]);

  const handlePronunciationToggle = useCallback(() => {
    stopHold();
    setPendingShowPronunciation((prev) => !prev);
  }, [stopHold]);

  const handleSaveKeyDown = useCallback((event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
      event.preventDefault();
      startHoldToSave();
    }
  }, [startHoldToSave]);

  const handleSaveKeyUp = useCallback((event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      cancelHoldToSave();
    }
  }, [cancelHoldToSave]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>{uiText('學習設定')}</h1>
        </header>

        <section className={styles.settingsSection} aria-label={uiText('學習設定')}>
          <div className={styles.settingsGroup}>
            <div className={styles.settingsLabel}>{uiText('輔助語言')}</div>
            <div className={styles.languageOptions}>
              {availableLanguages.map((option) => {
                const isSelected = option.code === pendingLang;
                const isCurrent = option.code === lang;

                return (
                  <button
                    key={option.code}
                    type="button"
                    className={`${styles.languageOption} ${
                      isSelected ? styles.languageOptionSelected : ''
                    } ${isCurrent ? styles.languageOptionCurrent : ''}`}
                    onClick={() => handleLanguageSelect(option.code)}
                    aria-pressed={isSelected}
                  >
                    <span className={styles.languageOptionName}>{option.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {pendingLangInfo.hasPronunciation && (
            <div className={styles.settingsGroup}>
              <div className={styles.settingsLabel}>{uiText('顯示拼音')}</div>
              <button
                type="button"
                role="switch"
                aria-checked={pendingShowPronunciation}
                className={`${styles.switchButton} ${
                  pendingShowPronunciation ? styles.switchButtonOn : ''
                }`}
                onClick={handlePronunciationToggle}
              >
                <span className={styles.switchLabel}>{uiText('顯示拼音')}</span>
                <span className={styles.switchTrack} aria-hidden="true">
                  <span className={styles.switchThumb} />
                </span>
              </button>
            </div>
          )}

          <div className={styles.settingsFooter}>
            <div className={styles.settingsSummary}>
              {hasPendingChanges ? pendingSettingsText : currentSettingsText}
            </div>
            <button
              type="button"
              className={`${styles.saveButton} ${
                isHolding ? styles.saveButtonHolding : ''
              }`}
              style={{ '--hold-progress': holdProgress } as CSSProperties}
              disabled={!hasPendingChanges}
              aria-label={saveButtonLabel}
              onPointerDown={startHoldToSave}
              onPointerUp={cancelHoldToSave}
              onPointerLeave={cancelHoldToSave}
              onPointerCancel={cancelHoldToSave}
              onKeyDown={handleSaveKeyDown}
              onKeyUp={handleSaveKeyUp}
              onBlur={cancelHoldToSave}
              onContextMenu={(event) => event.preventDefault()}
            >
              <span className={styles.saveButtonInner}>
                <span className={styles.saveButtonLabel}>{saveButtonLabel}</span>
                <span className={styles.saveButtonHint}>{saveButtonHint}</span>
              </span>
            </button>
          </div>
        </section>

        <section
          id="licenses"
          ref={creditsSectionRef}
          className={styles.creditsSection}
        >
          <h2 className={styles.creditsTitle}>{uiText('授權資訊')}</h2>

          <div className={styles.creditItem}>
            <div className={styles.creditLabel}>{uiText('國語授權資訊')}</div>
            <div className={styles.creditBody}>
              教育部《國語辭典簡編本》
              <br />
              <a
                href="https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/dict_concised_download.html"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                language.moe.gov.tw
              </a>
              <div className={styles.creditLicense}>CC BY-ND 3.0 Taiwan</div>
            </div>
          </div>

          <div className={styles.creditItem}>
            <div className={styles.creditLabel}>{uiText('台語語音')}</div>
            <div className={styles.creditBody}>
              {uiText('教育部《臺灣台語常用詞辭典》')}
              <br />
              <a
                href="https://sutian.moe.edu.tw"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                sutian.moe.edu.tw
              </a>
              <div className={styles.creditLicense}>CC BY-ND 3.0 Taiwan</div>
            </div>
          </div>

          <div className={styles.creditItem}>
            <div className={styles.creditLabel}>{uiText('Emoji 字型')}</div>
            <div className={styles.creditBody}>
              Noto Color Emoji
              <br />
              <a
                href="https://github.com/googlefonts/noto-emoji"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                github.com/googlefonts/noto-emoji
              </a>
              <div className={styles.creditLicense}>SIL Open Font License 1.1</div>
            </div>
          </div>

          <div className={styles.creditItem}>
            <div className={styles.creditLabel}>{uiText('漢字筆順')}</div>
            <div className={styles.creditBody}>
              <a
                href="https://hanziwriter.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                Hanzi Writer
              </a>{' '}
              (MIT)
              <br />
              <a
                href="https://github.com/skishore/makemeahanzi"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                Make Me a Hanzi
              </a>{' '}
              (LGPL-3.0 / CC BY-SA 4.0)
            </div>
          </div>

          <div className={styles.creditItem}>
            <div className={styles.creditLabel}>{uiText('課程內容')}</div>
            <div className={styles.creditBody}>
              {uiText('本專案自行編撰')}
            </div>
          </div>

          <div className={styles.creditItem}>
            <div className={styles.creditLabel}>{uiText('原始碼')}</div>
            <div className={styles.creditBody}>
              MIT License
              {' · '}
              <a
                href="https://github.com/kyoyadmoon/Batli"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <NavBar showBack />
    </div>
  );
}
