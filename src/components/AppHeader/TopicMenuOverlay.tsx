import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { vocabularyUnitSummaries } from '@/data/vocabulary/summary';
import { useAudio } from '@/hooks/audio';
import { useHelperLang } from '@/i18n';
import styles from './TopicMenuOverlay.module.css';

interface TopicMenuOverlayProps {
  currentUnitId?: string;
  onClose: () => void;
}

export function TopicMenuOverlay({ currentUnitId, onClose }: TopicMenuOverlayProps) {
  const navigate = useNavigate();
  const { speakGuideRaw, guideText } = useAudio();
  const { uiText } = useHelperLang();
  const units = useMemo(
    () => [...vocabularyUnitSummaries].sort((a, b) => a.order - b.order),
    [],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = useCallback(
    (unitId: string, voiceIntro: string) => {
      onClose();
      speakGuideRaw(guideText(voiceIntro));
      navigate(`/vocab/${unitId}/recognition/0`);
    },
    [guideText, navigate, onClose, speakGuideRaw],
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-menu-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.panelHeader}>
          <h2 id="topic-menu-title" className={styles.title}>
            {uiText('選擇主題')}
          </h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={uiText('關閉')}
          >
            <span aria-hidden="true">✖️</span>
            <span>{uiText('關閉')}</span>
          </button>
        </div>

        <div className={styles.grid}>
          {units.map((unit) => {
            const isCurrent = unit.id === currentUnitId;
            const displayTitle = uiText(unit.title);

            return (
              <button
                key={unit.id}
                type="button"
                className={`${styles.topicCard} ${isCurrent ? styles.topicCardCurrent : ''}`}
                onClick={() => handleSelect(unit.id, unit.voiceIntro)}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <span className={styles.topicIcon} aria-hidden="true">
                  {unit.icon}
                </span>
                <span className={styles.topicTitle}>{displayTitle}</span>
                {isCurrent && (
                  <span className={styles.currentBadge}>
                    <span aria-hidden="true">📍</span>
                    <span>{uiText('目前主題')}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
