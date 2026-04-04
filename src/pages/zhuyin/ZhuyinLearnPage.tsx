import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zhuyinModule } from '@/data';
import { useAudio } from '@/hooks/audio';
import { IconButton } from '@/components/IconButton';
import { StrokeCanvas } from '@/components/StrokeCanvas';
import { NavBar } from '@/components/NavBar';
import styles from './ZhuyinLearnPage.module.css';

export function ZhuyinLearnPage() {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const { speakGuide, speakGuideRaw, speak, isEnglishGuide } = useAudio();
  const [showStroke, setShowStroke] = useState(false);

  const currentIndex = Number(index ?? 0);
  const symbol = zhuyinModule.symbols[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === zhuyinModule.symbols.length - 1;

  const handlePrev = useCallback(() => {
    if (!isFirst) {
      setShowStroke(false);
      if (isEnglishGuide) {
        speakGuideRaw('Previous symbol.');
      } else {
        const prev = zhuyinModule.symbols[currentIndex - 1];
        speak(`上一個是${prev.pronunciation}`);
      }
      navigate(`/zhuyin/learn/${currentIndex - 1}`);
    }
  }, [isFirst, currentIndex, isEnglishGuide, navigate, speak, speakGuideRaw]);

  const handleNext = useCallback(() => {
    if (isLast) {
      speakGuide('注音符號都學完了！來考考看吧');
      navigate('/zhuyin/quiz');
    } else {
      setShowStroke(false);
      if (isEnglishGuide) {
        speakGuideRaw('Next symbol.');
      } else {
        const next = zhuyinModule.symbols[currentIndex + 1];
        speak(`下一個是${next.pronunciation}`);
      }
      navigate(`/zhuyin/learn/${currentIndex + 1}`);
    }
  }, [isLast, currentIndex, isEnglishGuide, navigate, speak, speakGuide, speakGuideRaw]);

  if (!symbol) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {showStroke ? (
          <StrokeCanvas
            character={symbol.symbol}
            mode="animate"
            onComplete={() => setShowStroke(false)}
            writerOptions={{ width: 250, height: 250 }}
          />
        ) : (
          <div className={styles.symbol}>{symbol.symbol}</div>
        )}

        <div className={styles.actions}>
          <IconButton
            icon="🔊"
            audioLabel={symbol.pronunciation}
            size="lg"
            variant="primary"
            ariaLabel="聽發音"
          />
          <IconButton
            icon="✍️"
            onPress={() => {
              speakGuide('看筆順');
              setShowStroke(true);
            }}
            size="lg"
            variant="primary"
            ariaLabel="看筆順"
          />
        </div>
      </div>

      <NavBar
        showBack={false}
        onNext={handleNext}
        nextLabel={isLast ? '開始測驗' : `下一個`}
      />
      {!isFirst && (
        <div className={styles.prevButton}>
          <IconButton
            icon="⬅️"
            onPress={handlePrev}
            size="md"
            variant="neutral"
            ariaLabel="上一個"
          />
        </div>
      )}
    </div>
  );
}
