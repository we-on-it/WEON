import * as RadixTabs from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import styles from './Tab.module.css';

/** count 표시용. 99를 넘으면 '99+' */
export const formatCount = (n: number): string => (n > 99 ? '99+' : String(n));

export type TabItemProps = {
  /** 탭을 구분하는 값. Tabs의 value와 비교해 선택 여부가 정해져요 */
  value: string;
  /** Figma `label` */
  children: ReactNode;
  /**
   * Figma `count`. 숫자를 주면 라벨 옆에 Badge(critical-solid · small · pill)가 나와요.
   * 0이나 undefined면 숨김
   */
  count?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * Figma `TabItem` 컴포넌트 (node 881:24681).
 * selected는 Tabs가 정하고(data-state=active), state=hover는 CSS :hover로 처리합니다.
 * 반드시 `Tabs` 안에서 써야 합니다.
 */
export function TabItem({ value, children, count, disabled, className }: TabItemProps) {
  const showCount = count !== undefined && count > 0;
  return (
    <RadixTabs.Trigger
      value={value}
      disabled={disabled}
      className={[styles.item, className].filter(Boolean).join(' ')}
    >
      {children}
      {showCount && (
        <Badge type="critical-solid" size="small" shape="pill">
          {formatCount(count)}
        </Badge>
      )}
    </RadixTabs.Trigger>
  );
}

export type TabsProps = {
  /** 선택된 탭의 value (selected는 하나만) */
  value: string;
  /** 탭을 누르거나 ←/→ 키로 옮기면 해당 value를 알려줘요 */
  onValueChange: (value: string) => void;
  /** 스크린리더용 탭 묶음 이름 (예: "홈 메뉴") */
  'aria-label': string;
  /** TabItem들 */
  children: ReactNode;
  className?: string;
};

/**
 * Figma `Tabs` 컴포넌트 (node 881:24682). Radix Tabs 기반이라
 * role=tablist·aria-selected·키보드 ←/→/Home/End 이동이 기본으로 동작합니다.
 * 오른쪽 정렬 요소(버튼 등)는 Tabs 밖 tab-row에서 spacer로 밀어 주세요.
 */
export function Tabs({ value, onValueChange, children, className, 'aria-label': ariaLabel }: TabsProps) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} activationMode="automatic">
      <RadixTabs.List className={[styles.list, className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
        {children}
      </RadixTabs.List>
    </RadixTabs.Root>
  );
}

export default Tabs;
