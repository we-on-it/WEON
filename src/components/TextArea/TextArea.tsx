import {
  useCallback,
  useLayoutEffect,
  useRef,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import styles from './TextArea.module.css';

export const TEXT_AREA_STATES = ['default', 'focus'] as const;
export type TextAreaState = (typeof TEXT_AREA_STATES)[number];

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> & {
  ref?: Ref<HTMLTextAreaElement>;
  /** Figma state variant. 실제 키보드 포커스도 자동으로 같은 모양이 돼요 */
  state?: TextAreaState;
  /** Figma `invalid`. 테두리를 빨강(border/critical)으로 */
  invalid?: boolean;
};

/**
 * Figma `TextArea` 컴포넌트 (node 858:16529). TextInput과 같은 규칙입니다.
 * 높이는 내용에 맞춰 100px부터 늘어나다 200px을 넘으면 스크롤됩니다.
 * has-value는 실제 value 유무로 정해져요 (값이 없으면 placeholder 색).
 */
export function TextArea({
  ref,
  state = 'default',
  invalid = false,
  disabled = false,
  placeholder = '플레이스홀더',
  className,
  onInput,
  value,
  'aria-invalid': ariaInvalid,
  ...rest
}: TextAreaProps) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  // 바깥 ref와 안쪽 ref를 함께 연결
  const setRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as { current: HTMLTextAreaElement | null }).current = el;
    },
    [ref],
  );

  // 내용 높이에 맞추기. 최소·최대 높이는 CSS(min-height / max-height)가 잡아 줘요
  const resize = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const border = el.offsetHeight - el.clientHeight;
    el.style.height = `${el.scrollHeight + border}px`;
  }, []);

  useLayoutEffect(resize, [resize, value]);

  const handleInput: TextAreaProps['onInput'] = (e) => {
    resize();
    onInput?.(e);
  };

  const classes = [styles.textarea, invalid && styles.invalid, className].filter(Boolean).join(' ');

  return (
    <textarea
      ref={setRef}
      className={classes}
      data-state={state}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      aria-invalid={invalid ? true : ariaInvalid}
      onInput={handleInput}
      {...rest}
    />
  );
}

export default TextArea;
