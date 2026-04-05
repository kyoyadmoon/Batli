import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vocabularyModule, generateVocabListeningQuiz } from '@/data';
import type { VocabCharacter, QuizQuestion } from '@/data';
import { useAudio } from '@/hooks/audio';
import { useWrongAnswerFlash } from '@/hooks/useWrongAnswerFlash';
import { useHelperLang } from '@/i18n';
import { NavBar } from '@/components/NavBar';
import styles from './VocabPage.module.css';

const AUTO_PLAY_LIMIT = 3;
const AUTO_PLAY_INTERVAL_MS = 10_000;
function shuffleOptions(question: QuizQuestion<VocabCharacter>): VocabCharacter[] {
  const all = [question.correctAnswer, ...question.distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

export function ListeningPage() {
  const { unitId, index } = useParams<{ unitId: string; index: string }>();
  const navigate = useNavigate();
  const { speakGuide, speak, cancelAll } = useAudio();
  const { wrongAnswerId, flashWrongAnswer } = useWrongAnswerFlash();
  const { t, uiText, isHelperEnabled, showPronunciation } = useHelperLang();

  const unit = vocabularyModule.units.find((u) => u.id === unitId);
  const charIndex = Number(index ?? 0);
  const vocab = unit?.characters[charIndex];

  const [answered, setAnswered] = useState(false);

  const question = useMemo(() => {
    if (!vocab || !unit) return null;
    const distractorCount = Math.min(3, unit.characters.length - 1);
    return generateVocabListeningQuiz(vocab, unit.characters, distractorCount);
  }, [vocab, unit]);

  const options = useMemo(
    () => (question ? shuffleOptions(question) : []),
    [question],
  );

  // Auto-play on entry, then replay every 10 seconds, up to 3 times total.
  useEffect(() => {
    if (!question || answered) return;

    let playCount = 0;
    let replayTimerId: number | null = null;

    const playPrompt = () => {
      if (playCount >= AUTO_PLAY_LIMIT) {
        if (replayTimerId !== null) {
          window.clearInterval(replayTimerId);
          replayTimerId = null;
        }
        return;
      }

      playCount += 1;
      speak(question.prompt, { interrupt: false });
    };

    const initialTimer = window.setTimeout(playPrompt, 300);
    replayTimerId = window.setInterval(playPrompt, AUTO_PLAY_INTERVAL_MS);

    return () => {
      window.clearTimeout(initialTimer);
      if (replayTimerId !== null) {
        window.clearInterval(replayTimerId);
      }
      cancelAll();
    };
  }, [question, answered, speak, cancelAll]);

  useEffect(() => cancelAll, [cancelAll]);

  const handleAnswer = useCallback(
    (selected: VocabCharacter) => {
      if (answered || !question) return;

      speak(selected.pronunciation);

      if (selected.character === question.correctAnswer.character) {
        setAnswered(true);
      } else {
        flashWrongAnswer(selected.character);
      }
    },
    [answered, question, speak, flashWrongAnswer],
  );

  const handleNext = useCallback(() => {
    if (!unitId) return;
    if (answered) {
      speakGuide('接下來，寫一寫');
    } else {
      speakGuide('先跳到寫一寫');
    }
    navigate(`/vocab/${unitId}/writing/${charIndex}`);
  }, [answered, unitId, charIndex, speakGuide, navigate]);

  if (!unit || !vocab || !question) return null;

  const visiblePrompt = '請先聽語音，再選出正確的字';
  const titleText = uiText('聽一聽');
  const promptText = uiText(visiblePrompt);
  const replayLabel = uiText('再聽一次');
  const handleReplayPrompt = useCallback(() => {
    speak(question.prompt);
  }, [question.prompt, speak]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.stepTitle}>
            <span aria-hidden="true">👂 </span>
            {titleText}
          </h1>
        </header>

        <button
          type="button"
          className={styles.promptCard}
          onClick={handleReplayPrompt}
          aria-label={replayLabel}
        >
          <div className={styles.promptCardBody}>
            <div className={styles.promptIconTile} aria-hidden="true">
              <span className={styles.promptIcon}>🔊</span>
            </div>
            <div className={styles.promptCardCopy}>
              <p className={styles.promptText}>{promptText}</p>
              <span className={styles.promptReplayHint}>{replayLabel}</span>
            </div>
          </div>
        </button>

        <div className={styles.quizOptions}>
          {options.map((opt) => {
            const isCorrect = answered && opt.character === question.correctAnswer.character;
            const isInactive = answered && !isCorrect;
            const helper = t(opt.character);

            return (
              <button
                key={opt.character}
                className={`${styles.quizOption} ${
                  isCorrect ? styles.correct : ''
                } ${
                  isInactive ? styles.quizOptionInactive : ''
                } ${
                  wrongAnswerId === opt.character ? styles.incorrectFlash : ''
                }`}
                onClick={() => handleAnswer(opt)}
                aria-label={opt.pronunciation}
                disabled={answered}
              >
                {isCorrect && (
                  <span className={styles.correctBadge} aria-hidden="true" />
                )}
                <span className={styles.choiceValue}>{opt.character}</span>
                {wrongAnswerId === opt.character && (
                  <span className={styles.incorrectOverlay} aria-hidden="true">
                    <span className={styles.incorrectMark}>X</span>
                  </span>
                )}
                {isCorrect && isHelperEnabled && helper && (
                  <span className={styles.helperSmall}>
                    {helper.translation}
                    {showPronunciation && helper.pronunciation && (
                      <> <span className={styles.helperPronunciationSmall}>{helper.pronunciation}</span></>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <NavBar showBack onNext={handleNext} nextLabel={answered ? '下一步' : '先跳過'} />
    </div>
  );
}
