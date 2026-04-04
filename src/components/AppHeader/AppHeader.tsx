import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { matchPath, useNavigate, useLocation } from 'react-router-dom';
import type { VocabUnit } from '@/data/types';
import { getVocabularyUnitSummary } from '@/data/vocabulary/summary';
import { useTopicMenu } from '@/context/TopicMenuContext';
import { useHelperLang } from '@/i18n';
import styles from './AppHeader.module.css';

const ContentDrawer = lazy(() => import('@/components/ContentDrawer').then((m) => ({ default: m.ContentDrawer })));
const TopicMenuOverlay = lazy(() => import('./TopicMenuOverlay').then((m) => ({ default: m.TopicMenuOverlay })));

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isTopicMenuOpen, toggleTopicMenu, closeTopicMenu } = useTopicMenu();
  const { uiText } = useHelperLang();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerUnit, setDrawerUnit] = useState<VocabUnit | null>(null);
  const isSelect = location.pathname === '/select';

  const vocabMatch = useMemo(
    () => matchPath('/vocab/:unitId/:step/:index', location.pathname),
    [location.pathname],
  );
  const currentUnit = useMemo(() => {
    if (!vocabMatch?.params.unitId) return null;
    return getVocabularyUnitSummary(vocabMatch.params.unitId);
  }, [vocabMatch]);
  const currentStep = vocabMatch?.params.step ?? '';
  const currentIndex = Number(vocabMatch?.params.index ?? 0);

  const topicLabel = currentUnit ? uiText(currentUnit.title) : uiText('選擇主題');
  const topicIcon = currentUnit?.icon ?? '🗂️';
  const topicButtonActive = isTopicMenuOpen || isSelect;

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  useEffect(() => {
    closeTopicMenu();
    setIsDrawerOpen(false);
    setDrawerUnit(null);
  }, [location.pathname, closeTopicMenu]);

  useEffect(() => {
    if (!isDrawerOpen || !currentUnit?.id) {
      setDrawerUnit(null);
      return;
    }

    let cancelled = false;
    import('@/data/vocabulary').then(({ vocabularyModule }) => {
      if (cancelled) return;
      setDrawerUnit(
        vocabularyModule.units.find((unit) => unit.id === currentUnit.id) ?? null,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [currentUnit?.id, isDrawerOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.brandButton}
            onClick={() => {
              closeTopicMenu();
              navigate('/');
            }}
            aria-label={uiText('回首頁')}
          >
            <span className={styles.brandIcon} aria-hidden="true">
              ✍️
            </span>
            <span className={styles.brandText}>{uiText('字學 Batli')}</span>
          </button>

          <button
            type="button"
            className={`${styles.topicButton} ${topicButtonActive ? styles.topicButtonActive : ''}`}
            onClick={toggleTopicMenu}
            aria-current={isSelect ? 'page' : undefined}
            aria-expanded={isTopicMenuOpen}
            aria-haspopup="dialog"
          >
            <span className={styles.topicButtonIcon} aria-hidden="true">
              {topicIcon}
            </span>
            <span className={styles.topicButtonLabel}>{topicLabel}</span>
          </button>

          {currentUnit ? (
            <button
              type="button"
              className={`${styles.drawerToggle} ${isDrawerOpen ? styles.drawerToggleActive : ''}`}
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              aria-label={uiText('內容列表')}
              aria-pressed={isDrawerOpen}
              aria-expanded={isDrawerOpen}
              aria-haspopup="dialog"
            >
              <span className={styles.drawerToggleIcon} aria-hidden="true">
                <span className={styles.drawerToggleBar} />
                <span className={styles.drawerToggleBar} />
                <span className={styles.drawerToggleBar} />
              </span>
            </button>
          ) : (
            <div className={styles.headerSpacer} aria-hidden="true" />
          )}
        </div>
      </header>

      {isTopicMenuOpen && (
        <Suspense fallback={null}>
          <TopicMenuOverlay currentUnitId={currentUnit?.id} onClose={closeTopicMenu} />
        </Suspense>
      )}

      {isDrawerOpen && drawerUnit && (
        <Suspense fallback={null}>
          <ContentDrawer
            unit={drawerUnit}
            currentIndex={currentIndex}
            currentStep={currentStep}
            onClose={closeDrawer}
          />
        </Suspense>
      )}
    </>
  );
}
