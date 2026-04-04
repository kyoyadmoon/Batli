import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '@/context/LearningContext';
import { useTopicMenu } from '@/context/TopicMenuContext';
import { vocabularyUnitSummaries } from '@/data/vocabulary/summary';
import { useAudio } from '@/hooks/audio';
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

  const handleOpenSettings = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  const continueTitle = nextLesson
    ? totalCompleted > 0
      ? '繼續學習'
      : '從第一課開始'
    : '查看主題';
  const continueSubtitle = nextLesson ? uiText(nextLesson.unit.title) : uiText('所有主題');
  const continueMeta = totalCompleted > 0 ? `${uiText('已完成')} ${totalCompleted} ${uiText('項目')}` : '';
  const progressBadge = getProgressBadge(totalCompleted);
  const titleText = uiText('開始上課');
  const startTitle = uiText('開始學習');
  const continueDisplayTitle = uiText(continueTitle);
  const currentLangInfo = availableLanguages.find((item) => item.code === lang) ?? availableLanguages[0];
  const settingsSummary = currentLangInfo.hasPronunciation
    ? `${currentLangInfo.nativeName} · ${uiText('顯示拼音')} ${showPronunciation ? 'ON' : 'OFF'}`
    : currentLangInfo.nativeName;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{titleText}</h1>

        <div className={styles.cardStack}>
          <button
            type="button"
            className={`${styles.card} ${styles.primaryCard}`}
            onClick={handleStart}
            aria-label="開始學習，直接選主題"
          >
            <div className={styles.primaryIconWrap}>
              <span className={styles.primaryIcon} aria-hidden="true">
                📖
              </span>
            </div>

            <div className={styles.primaryCopy}>
              <div className={styles.primaryTitle}>{startTitle}</div>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.card} ${styles.secondaryCard}`}
            onClick={handleContinue}
            aria-label={continueTitle}
          >
            <div className={styles.secondaryIconTile}>
              <span className={styles.secondaryIcon} aria-hidden="true">
                {progressBadge}
              </span>
            </div>

            <div className={styles.secondaryCopy}>
              <div className={styles.secondaryTitle}>{continueDisplayTitle}</div>
              <div className={styles.secondarySubtitle}>{continueSubtitle}</div>
              {continueMeta && <div className={styles.secondaryMeta}>{continueMeta}</div>}
            </div>

            <div className={styles.secondaryActions} aria-hidden="true">
              <span className={styles.secondaryArrow}>→</span>
            </div>
          </button>

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
