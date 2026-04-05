import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/context/LearningContext';
import { useTopicMenu } from '@/context/TopicMenuContext';
import { vocabularyUnitSummaries } from '@/data/vocabulary/summary';
import { useAudio } from '@/hooks/audio';
import { useHomeScreenInstall } from '@/hooks/useHomeScreenInstall';
import { useHelperLang } from '@/i18n';
import styles from './HomePage.module.css';

function getProgressBadge(completed: number): string {
  if (completed === 0) return '🌱';
  if (completed <= 3) return '🌿';
  if (completed <= 10) return '🌳';
  return '🌲';
}

export function HomePage() {
  const navigate = useNavigate();
  const { speakGuide, speakGuideRaw, guideTitle, isEnglishGuide } = useAudio();
  const { openTopicMenu } = useTopicMenu();
  const { totalCompleted, learnedVocab } = useLearning();
  const { status: installStatus, requestInstall } = useHomeScreenInstall();
  const {
    lang,
    showPronunciation,
    uiText,
    availableLanguages,
  } = useHelperLang();

  const handleStart = useCallback(() => {
    speakGuide('請選擇今天想學的生活主題');
    openTopicMenu();
  }, [openTopicMenu, speakGuide]);

  const nextLesson = useMemo(() => {
    for (const unit of vocabularyUnitSummaries) {
      const nextIndex = unit.characters.findIndex(
        (character) => !learnedVocab.has(character),
      );

      if (nextIndex !== -1) {
        return { unit, index: nextIndex };
      }
    }

    return null;
  }, [learnedVocab]);

  const handleContinue = useCallback(() => {
    if (!nextLesson) {
      speakGuide('已完成目前的學習內容，請選擇新的生活主題');
      openTopicMenu();
      return;
    }

    speakGuideRaw(
      isEnglishGuide
        ? `Continue with ${guideTitle(nextLesson.unit.title)}.`
        : `回到${nextLesson.unit.title}，繼續學習`,
    );
    navigate(`/vocab/${nextLesson.unit.id}/recognition/${nextLesson.index}`);
  }, [guideTitle, isEnglishGuide, navigate, nextLesson, openTopicMenu, speakGuide, speakGuideRaw]);

  const hasHistory = totalCompleted > 0;

  const handlePrimaryAction = useCallback(() => {
    if (hasHistory) {
      handleContinue();
      return;
    }

    handleStart();
  }, [handleContinue, handleStart, hasHistory]);

  const handleOpenSettings = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  const handleInstall = useCallback(async () => {
    const result = await requestInstall();

    if (result === 'manual-ios') {
      const message = uiText('請按 Safari 下方的分享按鈕，再選「加入主畫面」。');
      window.alert(message);
      speakGuideRaw(message);
      return;
    }

    if (result === 'manual-android') {
      const message = uiText('請按瀏覽器右上角選單，再選「加入主畫面」或「安裝應用程式」。');
      window.alert(message);
      speakGuideRaw(message);
    }
  }, [requestInstall, speakGuideRaw, uiText]);

  const primaryTitle = hasHistory ? '繼續學習' : '開始學習';
  const primarySubtitle = hasHistory
    ? (nextLesson ? uiText(nextLesson.unit.title) : uiText('所有主題'))
    : uiText('查看主題');
  const primaryMeta = hasHistory ? `${uiText('已完成')} ${totalCompleted} ${uiText('項目')}` : '';
  const topicTitle = uiText('查看主題');
  const topicSubtitle = uiText('所有主題');
  const progressBadge = getProgressBadge(totalCompleted);
  const titleText = uiText('開始上課');
  const primaryDisplayTitle = uiText(primaryTitle);
  const currentLangInfo = availableLanguages.find((item) => item.code === lang) ?? availableLanguages[0];
  const settingsSummary = currentLangInfo.hasPronunciation
    ? `${currentLangInfo.nativeName} · ${uiText('顯示拼音')} ${showPronunciation ? 'ON' : 'OFF'}`
    : currentLangInfo.nativeName;
  const installTitle = installStatus === 'installed'
    ? uiText('已安裝到手機首頁')
    : uiText('安裝到手機首頁');
  const installSubtitle = installStatus === 'prompt'
    ? uiText('點一下，直接安裝成 app')
    : installStatus === 'manual-ios'
      ? uiText('Safari 按分享，再選加入主畫面')
      : installStatus === 'manual-android'
        ? uiText('瀏覽器選單裡選加入主畫面')
        : uiText('已安裝');

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{titleText}</h1>

        <div className={styles.cardStack}>
          <button
            type="button"
            className={`${styles.card} ${styles.primaryCard}`}
            onClick={handlePrimaryAction}
            aria-label={primaryDisplayTitle}
          >
            <div className={styles.primaryIconWrap}>
              <span className={styles.primaryIcon} aria-hidden="true">
                {hasHistory ? progressBadge : '📖'}
              </span>
            </div>

            <div className={styles.primaryCopy}>
              <div className={styles.primaryTitle}>{primaryDisplayTitle}</div>
              <div className={styles.primarySubtitle}>{primarySubtitle}</div>
              {primaryMeta && <div className={styles.primaryMeta}>{primaryMeta}</div>}
            </div>
          </button>

          <button
            type="button"
            className={`${styles.card} ${styles.secondaryCard}`}
            onClick={handleStart}
            aria-label={topicTitle}
          >
            <div className={styles.secondaryIconTile}>
              <span className={styles.secondaryIcon} aria-hidden="true">
                🗂️
              </span>
            </div>

            <div className={styles.secondaryCopy}>
              <div className={styles.secondaryTitle}>{topicTitle}</div>
              <div className={styles.secondarySubtitle}>{topicSubtitle}</div>
            </div>

            <div className={styles.secondaryActions} aria-hidden="true">
              <span className={styles.secondaryArrow}>→</span>
            </div>
          </button>

          {installStatus !== 'hidden' && (
            <button
              type="button"
              className={`${styles.card} ${styles.installCard}`}
              onClick={handleInstall}
              aria-label={installTitle}
              disabled={installStatus === 'installed'}
            >
              <div className={styles.installCardIconWrap}>
                <span className={styles.installCardIcon} aria-hidden="true">
                  📱
                </span>
              </div>

              <div className={styles.installCardCopy}>
                <div className={styles.installCardTitle}>{installTitle}</div>
                <div className={styles.installCardSubtitle}>{installSubtitle}</div>
              </div>

              <div className={styles.secondaryActions} aria-hidden="true">
                <span className={styles.secondaryArrow}>
                  {installStatus === 'installed' ? '✓' : '→'}
                </span>
              </div>
            </button>
          )}

          <button
            type="button"
            className={`${styles.card} ${styles.settingsCard}`}
            onClick={handleOpenSettings}
            aria-label={uiText('設定')}
          >
            <div className={styles.settingsCardIconWrap}>
              <span className={styles.settingsCardIcon} aria-hidden="true">
                ⚙️
              </span>
            </div>

            <div className={styles.settingsCardCopy}>
              <div className={styles.settingsCardTitle}>{uiText('設定')}</div>
              <div className={styles.settingsCardSubtitle}>{settingsSummary}</div>
            </div>

            <div className={styles.secondaryActions} aria-hidden="true">
              <span className={styles.secondaryArrow}>→</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
