import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { vocabularyModule } from '@/data';
import { useAudio } from '@/hooks/audio';
import { useHelperLang } from '@/i18n';
import { NavBar } from '@/components/NavBar';
import styles from './ModuleSelectPage.module.css';

export function ModuleSelectPage() {
  const navigate = useNavigate();
  const { speakGuideRaw, guideText, guideTitle } = useAudio();
  const { uiText } = useHelperLang();
  const units = [...vocabularyModule.units].sort((a, b) => a.order - b.order);
  const titleText = uiText('請選擇主題');

  const handleSelect = useCallback((unitId: string, voiceIntro: string) => {
    speakGuideRaw(guideText(voiceIntro));
    navigate(`/vocab/${unitId}/recognition/0`);
  }, [guideText, navigate, speakGuideRaw]);

  const handlePreview = useCallback(
    (event: MouseEvent<HTMLButtonElement>, title: string, voiceIntro: string) => {
      event.stopPropagation();
      speakGuideRaw(`${guideTitle(title)}. ${guideText(voiceIntro)}`);
    },
    [guideText, guideTitle, speakGuideRaw],
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{titleText}</h1>
        <div className={styles.titleUnderline} aria-hidden="true" />
      </header>

      <div className={styles.modules}>
        {units.map((unit) => {
          const displayTitle = uiText(unit.title);

          return (
            <article key={unit.id} className={styles.topicCard}>
              <button
                type="button"
                className={styles.topicCardMain}
                onClick={() => handleSelect(unit.id, unit.voiceIntro)}
                aria-label={displayTitle}
              >
                <span className={styles.topicIcon} aria-hidden="true">
                  {unit.icon}
                </span>
                <span className={styles.topicLabel}>{displayTitle}</span>
              </button>

              <button
                type="button"
                className={styles.previewButton}
                onClick={(event) => handlePreview(event, unit.title, unit.voiceIntro)}
                aria-label={`${uiText('試聽')} ${displayTitle}`}
              >
                🔊
              </button>
            </article>
          );
        })}
      </div>

      <NavBar showBack />
    </div>
  );
}
