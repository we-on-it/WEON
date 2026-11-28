import { useMemo, useState } from 'react';
import { TabItem, Tabs } from '../../components/Tab/Tab';
import type { ID } from '../../mocks/types';
import { getMyTasksOverview } from './myTasksOverview';
import styles from './MyTasks.module.css';
import { HomeTab } from './tabs/HomeTab';
import { RequestsTab } from './tabs/RequestsTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { TaskManageTab } from './tabs/TaskManageTab';

export const MY_TASKS_TABS = ['home', 'schedule', 'manage', 'requests'] as const;
export type MyTasksTab = (typeof MY_TASKS_TABS)[number];

const TAB_LABEL: Record<MyTasksTab, string> = {
  home: '홈',
  schedule: '나의 일정',
  manage: '태스크 관리',
  requests: '나에게 온 요청',
};

export type MyTasksProps = {
  /** 처음 열릴 탭 (기본 home) */
  defaultTab?: MyTasksTab;
  /** 태스크 줄을 눌렀을 때 (홈 탭) */
  onTaskSelect?: (taskId: ID) => void;
  /** 요청 줄을 눌렀을 때 (홈 탭) */
  onRequestSelect?: (notificationId: ID) => void;
  className?: string;
};

/**
 * 나의 태스크 화면 (Figma 454:18251). 헤더 + 탭, 선택된 탭 내용을 아래에 보여줘요.
 * 사이드바는 앱 레이아웃이 그리고, 이 화면은 본문만 담당해요.
 */
export function MyTasks({ defaultTab = 'home', onTaskSelect, onRequestSelect, className }: MyTasksProps) {
  const [tab, setTab] = useState<MyTasksTab>(defaultTab);
  const overview = useMemo(() => getMyTasksOverview(), []);
  const overdueCount = overview.overdue.length;

  return (
    <main className={[styles.page, className].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <h1 className={styles.title}>나의 태스크 관리</h1>
        <p className={styles.subtitle}>
          {overdueCount > 0 ? `마감이 지난 태스크가 ${overdueCount}개 있어요.` : '마감이 지난 태스크가 없어요.'}
        </p>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as MyTasksTab)} aria-label="나의 태스크 메뉴">
        {MY_TASKS_TABS.map((t) => (
          <TabItem key={t} value={t} count={t === 'requests' ? overview.unreadRequests.length : undefined}>
            {TAB_LABEL[t]}
          </TabItem>
        ))}
      </Tabs>

      <div role="tabpanel" aria-label={TAB_LABEL[tab]}>
        {tab === 'home' && (
          <HomeTab overview={overview} onTaskSelect={onTaskSelect} onRequestSelect={onRequestSelect} />
        )}
        {tab === 'schedule' && <ScheduleTab />}
        {tab === 'manage' && <TaskManageTab />}
        {tab === 'requests' && <RequestsTab />}
      </div>
    </main>
  );
}

export default MyTasks;
