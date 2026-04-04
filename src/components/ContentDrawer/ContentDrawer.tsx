import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VocabUnit } from '@/data/types';
import { useHelperLang } from '@/i18n';
import styles from './ContentDrawer.module.css';

interface ContentDrawerProps {
  unit: VocabUnit;
  currentIndex: number;
  currentStep: string;
  onClose: () => void;
}

const STEP_LABELS = ['👀', '👂', '✍️'];
const STEP_KEYS = ['recognition', 'listening', 'writing'];

export function ContentDrawer({ unit, currentIndex, currentStep, onClose }: ContentDrawerProps) {
  const navigate = useNavigate();
  const { uiText } = useHelperLang();
  const drawerRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLButtonElement>(null);

  const currentStepIdx = STEP_KEYS.indexOf(currentStep);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    currentItemRef.current?.scrollIntoView({ block: 'nearest' });
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleCharClick = (index: number) => {
    navigate(`/vocab/${unit.id}/recognition/${index}`);
    onClose();
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <aside
        ref={drawerRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={uiText('內容列表')}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerIcon} aria-hidden="true">{unit.icon}</span>
          <h2 className={styles.drawerTitle}>{uiText(unit.title)}</h2>
        </div>

        <div className={styles.drawerList}>
          {unit.characters.map((char, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={char.character}
                ref={isCurrent ? currentItemRef : undefined}
                type="button"
                className={`${styles.charItem} ${isCurrent ? styles.charItemCurrent : ''}`}
                onClick={() => handleCharClick(idx)}
                aria-current={isCurrent ? 'true' : undefined}
              >
                <span className={styles.charItemIndex}>{idx + 1}</span>
                <span className={styles.charItemChar}>{char.character}</span>
                <span className={styles.charItemZhuyin}>{char.zhuyin}</span>
                {isCurrent && (
                  <span className={styles.charStepBadges} aria-hidden="true">
                    {STEP_LABELS.map((label, si) => (
                      <span
                        key={label}
                        className={`${styles.stepDot} ${si <= currentStepIdx ? styles.stepDotActive : ''}`}
                        title={label}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
