import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './TextInput.module.css';

export const TEXT_INPUT_STATES = ['default', 'focus'] as const;
export type TextInputState = (typeof TEXT_INPUT_STATES)[number];

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Figma state variant. Actual keyboard focus is also styled automatically. */
  state?: TextInputState;
  /** Shows the critical border used by the invalid variants. */
  invalid?: boolean;
  /** Figma boolean property controlling the trailing helper text. */
  showSuffix?: boolean;
  /** Figma text property for the trailing helper text. */
  suffixText?: ReactNode;
};

/** Figma `TextInput` component, with native input behavior and accessible state. */
export function TextInput({
  state = 'default',
  invalid = false,
  showSuffix = false,
  suffixText = 'Enter로 등록',
  placeholder = '플레이스홀더',
  disabled = false,
  className,
  'aria-invalid': ariaInvalid,
  ...inputProps
}: TextInputProps) {
  const classes = [styles.field, invalid && styles.invalid, disabled && styles.disabled, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} data-state={state}>
      <input
        className={styles.input}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid ? true : ariaInvalid}
        {...inputProps}
      />
      {showSuffix && <span className={styles.suffix}>{suffixText}</span>}
    </div>
  );
}

export default TextInput;
