import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vocabularyModule } from '@/data';
import { useAudio } from '@/hooks/audio';
import { useLearning } from '@/context/LearningContext';
import { useTopicMenu } from '@/context/TopicMenuContext';
import { useHelperLang } from '@/i18n';
import { IconButton } from '@/components/IconButton';
import { StrokeCanvas } from '@/components/StrokeCanvas';
import { NavBar } from '@/components/NavBar';
import styles from './VocabPage.module.css';

const WRITING_HINT_HIGHLIGHT_DURATION_MS = 1500;
const WRITING_HINT_COLOR = '#f39c12';
const PRACTICE_HINT_AFTER_MISSES = 0;
const RECALL_HINT_AFTER_MISSES = 2;

function getWritingCanvasSize(): number {
  if (typeof window === 'undefined') return 320;
  return Math.min(Math.max(window.innerWidth - 40, 280), 460);
}

export function WritingPage() {
  const { unitId, index } = useParams<{ unitId: string; index: string }>();
  const navigate = useNavigate();
  const { speak, speakGuide, speakGuideRaw, playCorrect, cancelAll, isEnglishGuide } = useAudio();
  const { markVocabLearned } = useLearning();
  const { openTopicMenu } = useTopicMenu();
  const { uiText } = useHelperLang();

  const unit = vocabularyModule.units.find((u) => u.id === unitId);
  const charIndex = Number(index ?? 0);
  const vocab = unit?.characters[charIndex];
  const isLastChar = unit ? charIndex >= unit.characters.length - 1 : false;

  const [mode, setMode] = useState<'animate' | 'quiz'>('animate');
  const [hideOutline, setHideOutline] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [canvasSize, setCanvasSize] = useState(getWritingCanvasSize);
  const [practiceRound, setPracticeRound] = useState(0);
  const [quizHintAfterMisses, setQuizHintAfterMisses] = useState(PRACTICE_HINT_AFTER_MISSES);
  const titleText = uiText('寫一寫');
  const guideButtonText = uiText('播放筆順');
  const practiceButtonText = uiText('練習');
  const completedBadgeText = uiText('已完成');
  const recallButtonText = uiText('默寫');

  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize(getWritingCanvasSize());
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => cancelAll, [cancelAll]);

  const handleAnimateComplete = useCallback(() => {
    setMode('quiz');
  }, []);

  const handleQuizComplete = useCallback(() => {
    if (!vocab) return;
    setCompleted(true);
    markVocabLearned(vocab.character);
    playCorrect();
    speakGuide('寫得很漂亮！');
  }, [vocab, markVocabLearned, playCorrect, speakGuide]);

  const handleNext = useCallback(() => {
    if (!unitId || !unit) return;
    if (isLastChar) {
      speakGuide('這個單元學完了，請選擇下一個主題');
      openTopicMenu();
    } else {
      if (isEnglishGuide) {
        speakGuideRaw('Next character.');
      } else {
        const next = unit.characters[charIndex + 1];
        speak(`下一個字，${next.pronunciation}`);
      }
      setMode('animate');
      setCompleted(false);
      navigate(`/vocab/${unitId}/recognition/${charIndex + 1}`);
    }
  }, [unitId, unit, isLastChar, charIndex, speakGuide, openTopicMenu, isEnglishGuide, speakGuideRaw, speak, navigate]);

  const handleShowGuide = useCallback(() => {
    cancelAll();
    setCompleted(false);
    setHideOutline(false);
    setQuizHintAfterMisses(PRACTICE_HINT_AFTER_MISSES);
    setPracticeRound((current) => current + 1);
    setMode('animate');
  }, [cancelAll]);

  const handlePractice = useCallback(() => {
    cancelAll();
    setCompleted(false);
    setHideOutline(false);
    setQuizHintAfterMisses(PRACTICE_HINT_AFTER_MISSES);
    setPracticeRound((current) => current + 1);
    setMode('quiz');
  }, [cancelAll]);

  const handleRecall = useCallback(() => {
    cancelAll();
    setCompleted(false);
    setHideOutline(true);
    setQuizHintAfterMisses(RECALL_HINT_AFTER_MISSES);
    setPracticeRound((current) => current + 1);
    setMode('quiz');
  }, [cancelAll]);

  if (!unit || !vocab) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.stepTitle}>
            <span aria-hidden="true">✍️ </span>
            {titleText}
          </h1>
        </header>

        <div className={styles.writingCanvasWrap}>
          <StrokeCanvas
            character={vocab.character}
            mode={mode}
            runId={practiceRound}
            onComplete={mode === 'animate' ? handleAnimateComplete : handleQuizComplete}
            writerOptions={{
              width: canvasSize,
              height: canvasSize,
              highlightColor: WRITING_HINT_COLOR,
              strokeHighlightDuration: WRITING_HINT_HIGHLIGHT_DURATION_MS,
              showOutline: !hideOutline,
              quizHintAfterMisses,
              autoHighlightNextStrokeInQuiz: !hideOutline,
            }}
          />
        </div>

        <div className={styles.writingToolbar}>
          <IconButton
            icon="▶️"
            label={guideButtonText}
            onPress={handleShowGuide}
            size="lg"
            variant="accent"
            ariaLabel={guideButtonText}
          />
          <IconButton
            icon="✍️"
            label={practiceButtonText}
            onPress={handlePractice}
            size="lg"
            variant="accent"
            ariaLabel={practiceButtonText}
          />
          <IconButton
            icon="📋"
            label={recallButtonText}
            onPress={handleRecall}
            size="lg"
            variant="neutral"
            ariaLabel={recallButtonText}
          />
        </div>

        {completed && (
          <div className={styles.completedBadge}>✅ {completedBadgeText}</div>
        )}
      </div>

      <NavBar
        showBack
        onNext={handleNext}
        nextLabel={
          completed
            ? isLastChar
              ? '完成單元'
              : '下一個字'
            : '先跳過'
        }
      />
    </div>
  );
}
