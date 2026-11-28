import type { ReactElement, ReactNode } from 'react';
import { DropdownMenu, MenuRadioGroup, MenuRadioItem } from '../Dropdown/Dropdown';
import { Icon } from '../Icon/Icon';
import type { FillableIconName, IconName } from '../Icon/icons';
import styles from './PriorityMenu.module.css';

/** 우선순위 4단계 (Jira 방식) */
export const PRIORITY_LEVELS = ['highest', 'high', 'medium', 'low'] as const;
export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

export const PRIORITY_LABEL: Record<PriorityLevel, string> = {
  highest: '최상',
  high: '높음',
  medium: '보통',
  low: '낮음',
};

/** 자동 산정 기준 (Figma Priority 설명) */
export const PRIORITY_DESCRIPTION: Record<PriorityLevel, string> = {
  highest: '마감 지남 · D-1 이내',
  high: 'D-2 ~ 3',
  medium: 'D-4 ~ 7',
  low: 'D-8 이후',
};

/** 채움 버전이 없는 아이콘만 (Icon 타입 규칙) */
const TEMP_ICON: Record<PriorityLevel, Exclude<IconName, FillableIconName>> = {
  highest: 'priority-highest',
  high: 'chevron-up',
  medium: 'priority-medium',
  low: 'chevron-down',
};

/**
 * TODO(Priority): Priority 컴포넌트가 생기면 `renderIcon` 기본값을 그걸로 바꾸고 이 함수는 지워 주세요.
 * Figma Priority 아이콘(16)을 흉내 낸 임시 아이콘입니다. 색은 화면 기준 추정값이에요.
 */
export function TempPriorityIcon({ level }: { level: PriorityLevel }) {
  return <Icon name={TEMP_ICON[level]} size={16} className={styles[level]} />;
}

export type PriorityMenuProps = {
  /** 지금 우선순위. 이 항목이 selected(배경 + check)가 돼요 */
  value: PriorityLevel;
  /** 직접 골랐을 때. 고른 값은 ‘수동’으로 저장해 마감일이 바뀌어도 다시 계산하지 않아요 */
  onValueChange: (value: PriorityLevel) => void;
  /**
   * 메뉴를 여는 요소. Figma 규칙: Priority 칩(chevron 켬)을 넣어요.
   * ref를 받는 요소여야 해요 (button 등).
   */
  trigger: ReactElement;
  /** 각 행 앞 아이콘. 기본은 임시 아이콘(TempPriorityIcon) — Priority 컴포넌트가 생기면 연결 */
  renderIcon?: (level: PriorityLevel) => ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Figma `PriorityMenu` 컴포넌트 (node 877:23536). 칩을 누르면 열리는 완성형 메뉴.
 * 행 = Priority 아이콘 + 라벨 + 설명(자동 산정 기준) · footer 수동 안내. 문구·순서는 여기 고정입니다.
 */
export function PriorityMenu({
  value,
  onValueChange,
  trigger,
  renderIcon = (level) => <TempPriorityIcon level={level} />,
  open,
  onOpenChange,
}: PriorityMenuProps) {
  return (
    <DropdownMenu
      trigger={trigger}
      footer="직접 고르면 ‘수동’으로 표시되고 마감일이 바뀌어도 다시 계산하지 않아요."
      open={open}
      onOpenChange={onOpenChange}
    >
      <MenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as PriorityLevel)}>
        {PRIORITY_LEVELS.map((level) => (
          <MenuRadioItem
            key={level}
            value={level}
            label={PRIORITY_LABEL[level]}
            description={PRIORITY_DESCRIPTION[level]}
            leading={renderIcon(level)}
          />
        ))}
      </MenuRadioGroup>
    </DropdownMenu>
  );
}

export default PriorityMenu;
