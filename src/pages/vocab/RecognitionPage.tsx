import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRadicalHint, getRelatedWordsForVocab, vocabularyModule } from '@/data';
import { useAudio } from '@/hooks/audio';
import { useHelperLang } from '@/i18n';
import { NavBar } from '@/components/NavBar';
import styles from './VocabPage.module.css';

const RELATED_WORDS_SPEECH_RATE = 0.72;

function IllustrationCard({ imageRef, character }: { imageRef: string; character: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  const resolvedSrc = imageRef.startsWith('/')
    ? `${import.meta.env.BASE_URL}${imageRef.slice(1)}`
    : imageRef;

  return (
    <div className={styles.illustrationCard}>
      <img
        src={resolvedSrc}
        alt={`${character} 的插圖`}
        className={styles.illustrationImage}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}

export function RecognitionPage() {
  const { unitId, index } = useParams<{ unitId: string; index: string }>();
  const navigate = useNavigate();
  const { speakGuide, speak, playTaiAudio, hasTaiAudio, cancelAll } = useAudio();
  const { t, uiText, isHelperEnabled, lang, showPronunciation } = useHelperLang();

  const unit = vocabularyModule.units.find((u) => u.id === unitId);
  const charIndex = Number(index ?? 0);
  const vocab = unit?.characters[charIndex];
  const primaryAudioEmoji = '🗣️';
  const helperAudioEmoji = '🔊';
  const helperAudioUnavailableEmoji = '🔇';
  const helperActionLabel = lang === 'en' ? '英文朗讀' : '中文釋義';
  const hasPrimaryHelperAudio = vocab ? hasTaiAudio(vocab.character) : false;
  const helperWord = vocab
    ? t(vocab.character)
    : undefined;
  const showPrimaryHelper = Boolean(
    helperWord && (
      !vocab?.hidePrimaryHelper
      || (lang === 'tai' && hasPrimaryHelperAudio)
    ),
  );
  const relatedWords = vocab
    ? getRelatedWordsForVocab(vocab)
    : [];
  const radicalHint = vocab ? getRadicalHint(vocab.character) : undefined;
  const titleText = uiText('看一看');
  const learnLabel = uiText('學習字詞');
  const helperLabel = uiText('輔助字詞');
  const relatedWordsLabel = uiText('生活詞語');

  useEffect(() => cancelAll, [cancelAll]);

  const handleNext = useCallback(() => {
    if (!unitId) return;
    speakGuide('接下來，聽一聽');
    navigate(`/vocab/${unitId}/listening/${charIndex}`);
  }, [unitId, charIndex, speakGuide, navigate]);

  if (!unit || !vocab) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.stepTitle}>
            <span aria-hidden="true">👀 </span>
            {titleText}
          </h1>
        </header>

        <section className={styles.focusSection} aria-label={learnLabel}>
          <div className={`${styles.relatedCard} ${styles.focusCard}`}>
            <button
              type="button"
              className={`${styles.relatedMainButton} ${styles.focusMainButton}`}
              onClick={() => speak(vocab.pronunciation)}
              aria-label={`聽 ${vocab.pronunciation} 的發音`}
            >
              <span className={styles.relatedMainBadge} aria-hidden="true">
                <span>{primaryAudioEmoji}</span>
              </span>
              <span className={styles.focusMainLabel}>{learnLabel}</span>
              <span className={styles.bigChar}>{vocab.character}</span>
              <span className={styles.zhuyin}>{vocab.zhuyin}</span>
            </button>

            {isHelperEnabled && helperWord && showPrimaryHelper && (
              lang === 'tai' ? (
                hasPrimaryHelperAudio ? (
                  <button
                    type="button"
                    className={`${styles.relatedHelperButton} ${styles.focusHelperButton}`}
                    onClick={() => playTaiAudio(vocab.character)}
                    aria-label={`播放台語發音：${helperWord.translation}`}
                  >
                    <span className={styles.relatedHelperBadge} aria-hidden="true">
                      <span>{helperAudioEmoji}</span>
                    </span>
                    <span className={styles.relatedHelperText}>
                      <span className={styles.focusHelperTag}>{helperLabel}</span>
                      <span className={styles.relatedHelperLabel}>{helperWord.translation}</span>
                      {showPronunciation && helperWord.pronunciation && (
                        <span className={styles.relatedHelperPronunciation}>{helperWord.pronunciation}</span>
                      )}
                    </span>
                  </button>
                ) : (
                  <div className={`${styles.relatedHelperButton} ${styles.focusHelperButton} ${styles.relatedHelperStatic}`}>
                    <span className={styles.relatedHelperBadge} aria-hidden="true">
                      <span>{helperAudioUnavailableEmoji}</span>
                    </span>
                    <span className={styles.relatedHelperText}>
                      <span className={styles.focusHelperTag}>{helperLabel}</span>
                      <span className={styles.relatedHelperLabel}>{helperWord.translation}</span>
                      {showPronunciation && helperWord.pronunciation && (
                        <span className={styles.relatedHelperPronunciation}>{helperWord.pronunciation}</span>
                      )}
                    </span>
                  </div>
                )
              ) : (
                <button
                  type="button"
                  className={`${styles.relatedHelperButton} ${styles.focusHelperButton}`}
                  onClick={() => {
                    speak(helperWord.translation);
                  }}
                  aria-label={`聽輔助字詞 ${helperWord.translation}`}
                >
                  <span className={styles.relatedHelperBadge} aria-hidden="true">
                    <span>{helperAudioEmoji}</span>
                  </span>
                  <span className={styles.relatedHelperText}>
                    <span className={styles.focusHelperTag}>{helperLabel}</span>
                    <span className={styles.relatedHelperLabel}>{helperWord.translation}</span>
                    {showPronunciation && helperWord.pronunciation && (
                      <span className={styles.relatedHelperPronunciation}>{helperWord.pronunciation}</span>
                    )}
                  </span>
                </button>
              )
            )}
          </div>
        </section>

        <IllustrationCard imageRef={vocab.imageRef} character={vocab.character} />

        {radicalHint && (
          <button
            type="button"
            className={styles.radicalHint}
            aria-label={`播放部首提示：${radicalHint.hint}`}
            onClick={() => speak(radicalHint.hint)}
          >
            <span className={styles.radicalHintRadical} aria-hidden="true">
              {radicalHint.radical}
            </span>
            <span className={styles.radicalHintText}>{radicalHint.hint}</span>
            <span className={styles.radicalHintBadge} aria-hidden="true">
              <span>🔊</span>
            </span>
          </button>
        )}

        {relatedWords.length > 0 && (
          <section className={styles.relatedSection} aria-label="生活詞語">
            <div className={styles.relatedHeader}>
              <span className={styles.infoLabel}>
                <span aria-hidden="true">📚</span>
                <span>{relatedWordsLabel}</span>
              </span>
            </div>

            <div className={styles.relatedGrid}>
              {relatedWords.map((item) => {
                const hw = t(item.word);
                const hasItemHelperAudio = hasTaiAudio(item.word);
                const showHelperCard = Boolean(
                  isHelperEnabled && hw && (lang !== 'tai' || hw.pronunciation),
                );
                return (
                  <div
                    key={`${vocab.character}-${item.word}`}
                    className={styles.relatedCard}
                  >
                    <button
                      type="button"
                      className={styles.relatedMainButton}
                      onClick={() => speak(item.pronunciation ?? item.word, { rate: RELATED_WORDS_SPEECH_RATE })}
                      aria-label={`播放中文發音：${item.word}`}
                    >
                      <span className={styles.relatedMainBadge} aria-hidden="true">
                        <span>{primaryAudioEmoji}</span>
                      </span>
                      <span className={styles.relatedEmoji} aria-hidden="true">
                        {item.emoji}
                      </span>
                      <span className={styles.relatedWord}>{item.word}</span>
                    </button>

                    {showHelperCard && hw && (
                      lang === 'tai' ? (
                        hasItemHelperAudio ? (
                          <button
                            type="button"
                            className={styles.relatedHelperButton}
                            onClick={() => playTaiAudio(item.word)}
                            aria-label={`播放台語發音：${hw.translation}`}
                          >
                            <span className={styles.relatedHelperBadge} aria-hidden="true">
                              <span>{helperAudioEmoji}</span>
                            </span>
                            <span className={styles.relatedHelperText}>
                              <span className={styles.relatedHelperLabel}>{hw.translation}</span>
                              {showPronunciation && hw.pronunciation && (
                                <span className={styles.relatedHelperPronunciation}>{hw.pronunciation}</span>
                              )}
                            </span>
                          </button>
                        ) : (
                          <div className={`${styles.relatedHelperButton} ${styles.relatedHelperStatic}`}>
                            <span className={styles.relatedHelperBadge} aria-hidden="true">
                              <span>{helperAudioUnavailableEmoji}</span>
                            </span>
                            <span className={styles.relatedHelperText}>
                              <span className={styles.relatedHelperLabel}>{hw.translation}</span>
                              {showPronunciation && hw.pronunciation && (
                                <span className={styles.relatedHelperPronunciation}>{hw.pronunciation}</span>
                              )}
                            </span>
                          </div>
                        )
                      ) : (
                        <button
                          type="button"
                          className={styles.relatedHelperButton}
                          onClick={() => speak(hw.translation, { rate: RELATED_WORDS_SPEECH_RATE })}
                          aria-label={`播放${helperActionLabel}：${hw.translation}`}
                        >
                          <span className={styles.relatedHelperBadge} aria-hidden="true">
                            <span>{helperAudioEmoji}</span>
                          </span>
                          <span className={styles.relatedHelperText}>
                            <span className={styles.relatedHelperLabel}>{hw.translation}</span>
                            {showPronunciation && hw.pronunciation && (
                              <span className={styles.relatedHelperPronunciation}>{hw.pronunciation}</span>
                            )}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <NavBar onNext={handleNext} nextLabel="下一步" />
    </div>
  );
}
