import type { HTMLAttributes, Ref } from 'react';
import styles from './Indicator.module.css';

export const INDICATOR_TYPES = ['required', 'optional'] as const;
export type IndicatorType = (typeof INDICATOR_TYPES)[number];

const LABEL: Record<IndicatorType, string> = {
  required: '필수',
  optional: '선택',
};

export type IndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ref?: Ref<HTMLSpanElement>;
  /** Figma `status`. required는 "필수"(빨강), optional은 "선택"(회색) (기본 required) */
  type?: IndicatorType;
};

/**
 * Figma `indicator` 컴포넌트. 입력 필드 라벨 옆에 필수·선택 여부를 표시합니다.
 * 필수 여부는 입력칸에도 aria-required로 알려야 해요 (TextInputField가 자동으로 처리).
 */
export function Indicator({ type = 'required', className, ...rest }: IndicatorProps) {
  const classes = [styles.indicator, styles[type], className].filter(Boolean).join(' ');

  return (
    <span className={classes} {...rest}>
      {LABEL[type]}
    </span>
  );
}

export default Indicator;
