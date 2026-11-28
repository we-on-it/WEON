import type { HTMLAttributes, Ref } from 'react';
import styles from './MilestoneChip.module.css';

/** src/mocks/types.ts의 MilestoneType과 같은 값 */
export const MILESTONE_TYPES = ['research', 'production', 'presentation'] as const;
export type MilestoneTypeValue = (typeof MILESTONE_TYPES)[number];

export const MILESTONE_TYPE_LABEL: Record<MilestoneTypeValue, string> = {
  research: '리서치',
  production: '제작',
  presentation: '발표',
};

export type MilestoneChipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ref?: Ref<HTMLSpanElement>;
  /** 마일스톤 유형. 리서치 유형만 결과물 제출 시 출처 필수 */
  type: MilestoneTypeValue;
  /** 마일스톤 이름 */
  name: string;
};

/**
 * Figma `MilestoneChip` 컴포넌트 (node 461:11422). "유형 / 마일스톤명"을 보여줘요.
 * 표시용이라 클릭 동작은 없습니다.
 */
export function MilestoneChip({ type, name, className, ...rest }: MilestoneChipProps) {
  return (
    <span className={[styles.chip, className].filter(Boolean).join(' ')} {...rest}>
      {MILESTONE_TYPE_LABEL[type]} / {name}
    </span>
  );
}

export default MilestoneChip;
