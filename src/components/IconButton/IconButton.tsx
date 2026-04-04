import { useCallback } from 'react';
import { useSpeechOnly } from '@/hooks/audio';
import styles from './IconButton.module.css';

export interface IconButtonProps {
  /** Emoji or icon content */
  icon: string;
  /** Visible label shown with the icon */
  label?: string;
  /** Optional secondary helper text */
  description?: string;
  /** TTS text spoken on click */
  audioLabel?: string;
  /** Click handler (called after TTS) */
  onPress?: () => void;
  /** Visual size variant */
  size?: 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'primary' | 'accent' | 'neutral' | 'ghost' | 'correct' | 'incorrect';
  /** Accessibility label */
  ariaLabel: string;
  /** Disabled state */
  disabled?: boolean;
}

export function IconButton({
  icon,
  label,
  description,
  audioLabel,
  onPress,
  size = 'lg',
  variant = 'primary',
  ariaLabel,
  disabled = false,
}: IconButtonProps) {
  const { speak } = useSpeechOnly();

  const handleClick = useCallback(() => {
    if (disabled) return;
    // speak() must be called synchronously in click handler (iOS)
    if (audioLabel) {
      speak(audioLabel);
    }
    onPress?.();
  }, [disabled, audioLabel, speak, onPress]);

  return (
    <button
      className={`${styles.button} ${styles[size]} ${styles[variant]} ${
        label ? styles.hasLabel : ''
      }`}
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <span className={styles.icon}>{icon}</span>
      {label && (
        <span className={styles.textWrap}>
          <span className={styles.label}>{label}</span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
      )}
    </button>
  );
}
