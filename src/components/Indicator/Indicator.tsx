import type { HTMLAttributes } from 'react';
import styles from './Indicator.module.css';

export const INDICATOR_TYPES = ['required', 'optional'] as const;
export type IndicatorType = (typeof INDICATOR_TYPES)[number];

const LABEL: Record<IndicatorType, string> = { required: '필수', optional: '선택' };

export type IndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** Figma `status`. required = 필수(빨강), optional = 선택(회색) */
  type?: IndicatorType;
};

/**
 * Figma `indicator` 컴포넌트 (node 850:16263).
 * 필드 라벨 옆에 붙는 필수/선택 표시입니다. (Caption1/Medium)
 */
export function Indicator({ type = 'required', className, ...rest }: IndicatorProps) {
  return (
    <span className={[styles.indicator, styles[type], className].filter(Boolean).join(' ')} {...rest}>
      {LABEL[type]}
    </span>
  );
}

export default Indicator;
