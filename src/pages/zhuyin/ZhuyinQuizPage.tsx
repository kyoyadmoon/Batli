import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zhuyinModule, generateZhuyinQuiz } from '@/data';
import type { ZhuyinSymbol, QuizQuestion } from '@/data';
import { useAudio } from '@/hooks/audio';
import { useWrongAnswerFlash } from '@/hooks/useWrongAnswerFlash';
import { useLearning } from '@/context/LearningContext';
import { useTopicMenu } from '@/context/TopicMenuContext';
import { IconButton } from '@/components/IconButton';
import { NavBar } from '@/components/NavBar';
import styles from './ZhuyinQuizPage.module.css';

const TOTAL_QUESTIONS = 5;
const CORRECT_ANSWER_ADVANCE_DELAY_MS = 3_500;

function shuffleOptions(question: QuizQuestion<ZhuyinSymbol>): ZhuyinSymbol[] {
  const all = [question.correctAnswer, ...question.distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

export function ZhuyinQuizPage() {
  const navigate = useNavigate();
  const { speakGuide, speak, playCorrect, cancelAll } = useAudio();
  const { wrongAnswerId, flashWrongAnswer } = useWrongAnswerFlash();
  const { markZhuyinLearned } = useLearning();
  const { openTopicMenu } = useTopicMenu();

  // Use all symbols as quiz pool (learning happens via quiz confirmation)
  const quizPool = zhuyinModule.symbols;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const advanceTimerRef = useRef<number | null>(null);

  const question = useMemo(() => {
    const target = quizPool[questionIndex % quizPool.length];
    return generateZhuyinQuiz(target, quizPool, 3);
  }, [quizPool, questionIndex]);

  const options = useMemo(() => shuffleOptions(question), [question]);

  // Speak the prompt when question changes
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(question.prompt, { interrupt: false });
    }, 300);
    return () => {
      clearTimeout(timer);
      cancelAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  useEffect(() => () => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    cancelAll();
  }, [cancelAll]);

  const handleAnswer = useCallback(
    (selected: ZhuyinSymbol) => {
      if (answered) return;

      if (selected.symbol === question.correctAnswer.symbol) {
        setAnswered(true);
        markZhuyinLearned(selected.symbol);
        playCorrect();
        advanceTimerRef.current = window.setTimeout(() => {
          advanceTimerRef.current = null;
          if (questionIndex + 1 >= TOTAL_QUESTIONS) {
            speakGuide('太厲害了！注音測驗完成');
            navigate('/');
            window.setTimeout(openTopicMenu, 0);
          } else {
            setAnswered(false);
            setQuestionIndex((i) => i + 1);
          }
        }, CORRECT_ANSWER_ADVANCE_DELAY_MS);
      } else {
        flashWrongAnswer(selected.symbol);
      }
    },
    [answered, question, questionIndex, markZhuyinLearned, playCorrect, flashWrongAnswer, speakGuide, navigate, openTopicMenu],
  );

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {questionIndex + 1} / {TOTAL_QUESTIONS}
      </div>

      <div className={styles.content}>
        <IconButton
          icon="🔊"
          audioLabel={question.prompt}
          size="lg"
          variant="primary"
          ariaLabel="再聽一次"
        />

        <div className={styles.options}>
          {options.map((opt) => (
            <button
              key={opt.symbol}
              className={`${styles.option} ${
                answered && opt.symbol === question.correctAnswer.symbol
                  ? styles.correct
                  : ''
              } ${
                wrongAnswerId === opt.symbol ? styles.incorrectFlash : ''
              }`}
              onClick={() => handleAnswer(opt)}
              aria-label={opt.pronunciation}
            >
              <span className={styles.optionValue}>{opt.symbol}</span>
              {wrongAnswerId === opt.symbol && (
                <span className={styles.incorrectOverlay} aria-hidden="true">
                  <span className={styles.incorrectMark}>X</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <NavBar showBack />
    </div>
  );
}
