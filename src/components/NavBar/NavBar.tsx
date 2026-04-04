import { useNavigate } from 'react-router-dom';
import { IconButton } from '@/components/IconButton';
import { useHelperLang } from '@/i18n';
import styles from './NavBar.module.css';

interface NavBarProps {
  /** Show back button */
  showBack?: boolean;
  /** Show next button and its handler */
  onNext?: () => void;
  /** TTS label for next button */
  nextLabel?: string;
}

export function NavBar({ showBack = true, onNext, nextLabel = '下一個' }: NavBarProps) {
  const navigate = useNavigate();
  const { uiText } = useHelperLang();
  const backLabel = uiText('上一頁');
  const nextDisplayLabel = uiText(nextLabel);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.left}>
          {showBack && (
            <IconButton
              icon="⬅️"
              onPress={() => navigate(-1)}
              size="md"
              variant="neutral"
              ariaLabel={backLabel}
            />
          )}
        </div>
        <div className={styles.right}>
          {onNext && (
            <IconButton
              icon="➡️"
              onPress={onNext}
              size="md"
              variant="neutral"
              ariaLabel={nextDisplayLabel}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
