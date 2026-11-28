import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';
import logoMark from '../../assets/logo-mark.svg?raw';
import { Icon } from '../Icon/Icon';
import type { FillableIconName } from '../Icon/icons';
import styles from './Sidebar.module.css';

export const SIDEBAR_MENUS = ['home', 'my-tasks', 'team-project', 'notifications', 'settings'] as const;
export const PROJECT_COLORS = ['teal', 'orange', 'purple', 'pink'] as const;

export type SidebarMenu = (typeof SIDEBAR_MENUS)[number];
export type ProjectColor = (typeof PROJECT_COLORS)[number];

/** 메뉴별 아이콘·라벨 (Figma Sidebar 기준) */
const MENU: Record<SidebarMenu, { icon: FillableIconName; label: string }> = {
  home: { icon: 'home', label: '홈' },
  'my-tasks': { icon: 'user', label: '나의 태스크' },
  'team-project': { icon: 'users', label: '팀 프로젝트' },
  notifications: { icon: 'bell', label: '알림' },
  settings: { icon: 'settings', label: '설정' },
};

/** 팀 프로젝트 목록 맨 위 "전체" 항목의 id */
export const ALL_PROJECTS_ID = 'all';

/* ── 공통: href가 있으면 링크, 없으면 버튼 ───────────────── */

type ItemElementProps =
  | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'color'>)
  | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'>);

function ItemElement({
  selected,
  className,
  children,
  ...rest
}: ItemElementProps & { selected: boolean; className: string; children: ReactNode }) {
  const current = selected ? { 'aria-current': 'page' as const } : {};
  if (rest.href !== undefined) {
    return (
      <a className={className} {...current} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={className}
      {...current}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}

/* ── Sidebar/MenuItem ──────────────────────────────────── */

export type SidebarMenuItemProps = ItemElementProps & {
  /** Figma `icon`. 채움(fill) 버전으로 그려요 */
  icon: FillableIconName;
  /** Figma `label` */
  label: ReactNode;
  /** Figma `selected`. 현재 보고 있는 메뉴면 true (aria-current="page") */
  selected?: boolean;
};

/**
 * Figma `Sidebar/MenuItem` (node 910:1796).
 * hover·press 상태는 CSS(:hover / :active)로 처리합니다.
 */
export function SidebarMenuItem({ icon, label, selected = false, className, ...rest }: SidebarMenuItemProps) {
  const classes = [styles.item, selected && styles.selected, className].filter(Boolean).join(' ');
  return (
    <ItemElement className={classes} selected={selected} {...rest}>
      <Icon name={icon} fill size={28} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </ItemElement>
  );
}

/* ── Sidebar/ProjectItem ───────────────────────────────── */

export type SidebarProjectItemProps = ItemElementProps & {
  /** Figma `label`. 프로젝트 이름 */
  label: ReactNode;
  /** Figma `color`. 프로젝트 색 (기본 teal) */
  color?: ProjectColor;
  /** 선택된 프로젝트는 이름과 화살표를 프로젝트 색으로 표시합니다. */
  selected?: boolean;
};

/**
 * Figma `Sidebar/ProjectItem` (node 910:1797).
 * 선택 안 된 항목의 hover·press는 회색, 선택된 항목은 프로젝트 색으로 진해져요.
 */
export function SidebarProjectItem({
  label,
  color = 'teal',
  selected = false,
  className,
  ...rest
}: SidebarProjectItemProps) {
  const classes = [styles.item, styles.project, styles[color], selected && styles.selected, className]
    .filter(Boolean)
    .join(' ');
  return (
    <ItemElement className={classes} selected={selected} {...rest}>
      <span className={styles.leading}>
        <Icon name="chevron-right" size={24} className={styles.chevron} />
      </span>
      <span className={styles.label}>{label}</span>
    </ItemElement>
  );
}

/* ── Sidebar ───────────────────────────────────────────── */

export type SidebarProject = {
  id: string;
  name: string;
  /** 프로젝트 색 (기본 teal) */
  color?: ProjectColor;
};

export type SidebarProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref?: Ref<HTMLElement>;
  /** 현재 메뉴 */
  activeMenu?: SidebarMenu;
  /** 팀 프로젝트 아래에 보여줄 프로젝트 목록 ("전체"는 자동으로 맨 위에 붙어요) */
  projects?: SidebarProject[];
  /** 선택된 프로젝트 id. "전체"는 ALL_PROJECTS_ID */
  activeProjectId?: string | null;
  /** 하단 프로필 이름 (Figma `name`) */
  userName: string;
  /**
   * 하단 프로필 이미지 자리. Figma에서는 `Avatar` (size=small) 인스턴스예요.
   * Avatar 컴포넌트를 넣어 주세요 (Sidebar가 직접 그리지 않아요)
   */
  avatar?: ReactNode;
  onMenuSelect?: (menu: SidebarMenu) => void;
  onProjectSelect?: (projectId: string) => void;
  /** 프로필 옆 더보기(⋯) 버튼 */
  onUserMenuClick?: () => void;
};

/**
 * Figma `Sidebar` (node 596:26360).
 * 메뉴·프로젝트 항목은 SidebarMenuItem / SidebarProjectItem으로 그립니다.
 */
export function Sidebar({
  activeMenu,
  projects = [],
  activeProjectId = null,
  userName,
  avatar,
  onMenuSelect,
  onProjectSelect,
  onUserMenuClick,
  className,
  ...rest
}: SidebarProps) {
  const menuItem = (menu: SidebarMenu) => (
    <SidebarMenuItem
      key={menu}
      icon={MENU[menu].icon}
      label={MENU[menu].label}
      selected={activeMenu === menu}
      onClick={() => onMenuSelect?.(menu)}
    />
  );

  const projectItems: SidebarProject[] = [{ id: ALL_PROJECTS_ID, name: '전체' }, ...projects];

  return (
    <nav aria-label="사이드바" className={[styles.sidebar, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.logo} aria-label="WEON" role="img" dangerouslySetInnerHTML={{ __html: logoMark }} />

      <div className={styles.body}>
        <ul className={styles.menu}>
          <li>{menuItem('home')}</li>
          <li>{menuItem('my-tasks')}</li>
          <li>
            {menuItem('team-project')}
            <ul className={styles.projects} aria-label="팀 프로젝트">
              {projectItems.map((p) => (
                <li key={p.id}>
                  <SidebarProjectItem
                    label={p.name}
                    color={p.color}
                    selected={activeProjectId === p.id}
                    onClick={() => onProjectSelect?.(p.id)}
                  />
                </li>
              ))}
            </ul>
          </li>
          <li className={styles.divider} role="separator" />
          <li>{menuItem('notifications')}</li>
          <li>{menuItem('settings')}</li>
        </ul>

        <div className={styles.profile}>
          <div className={styles.user}>
            {avatar}
            <span className={styles.userName}>{userName}</span>
          </div>
          <button type="button" className={styles.more} aria-label="계정 메뉴" onClick={onUserMenuClick}>
            <Icon name="more" size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
