// 나의 태스크 화면에서 쓰는 날짜 계산·목록 고르기. 기준 시각은 MOCK_NOW (KST)
import {
  MOCK_NOW,
  getMilestone,
  getMyActiveMilestones,
  getMyTasks,
  getMyUnreadRequests,
} from '../../mocks/queries';
import type { Milestone, Notification, Task, TaskPriority } from '../../mocks/types';

const DAY_MS = 86_400_000;
const KST_OFFSET_MS = 9 * 3_600_000;

/** KST 기준 날짜 번호 (1970-01-01 = 0). 시각은 버리고 날짜만 비교할 때 써요 */
const kstDay = (iso: string): number => Math.floor((Date.parse(iso) + KST_OFFSET_MS) / DAY_MS);

/** KST 기준 Date (getUTC*로 읽으면 한국 시각이 나와요) */
const kstDate = (iso: string): Date => new Date(Date.parse(iso) + KST_OFFSET_MS);

const pad2 = (n: number) => String(n).padStart(2, '0');

/** 마감까지 남은 날 수. 지났으면 음수, 오늘이면 0 */
export const daysUntil = (dueAt: string, now: string = MOCK_NOW): number => kstDay(dueAt) - kstDay(now);

/** 3 → 'D-3', 0 → 'D-Day', -1 → 'D+1' */
export const formatDDay = (days: number): string =>
  days < 0 ? `D+${-days}` : days === 0 ? 'D-Day' : `D-${days}`;

/** '11/4' */
export const formatMonthDay = (iso: string): string => {
  const d = kstDate(iso);
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
};

/** 알림 시각: '오늘 09:10' · '어제 22:14' · '11/8 14:00' */
export const formatRelativeTime = (iso: string, now: string = MOCK_NOW): string => {
  const d = kstDate(iso);
  const time = `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
  const diff = kstDay(now) - kstDay(iso);
  if (diff === 0) return `오늘 ${time}`;
  if (diff === 1) return `어제 ${time}`;
  return `${formatMonthDay(iso)} ${time}`;
};

/** 마감일로 정하는 우선순위 (PriorityMenu의 자동 산정 기준과 같음) */
export const autoPriority = (days: number): TaskPriority =>
  days <= 1 ? 'highest' : days <= 3 ? 'high' : days <= 7 ? 'medium' : 'low';

export type TaskItem = Task & {
  /** 마감까지 남은 날 수 (daysUntil) */
  days: number;
  /** 직접 고른 값이 있으면 그것, 없으면 자동 산정 */
  effectivePriority: TaskPriority;
  milestone: Milestone | undefined;
  /** 안 읽은 찌르기가 있는 태스크 (사이렌 표시) */
  nudged: boolean;
};

export type MyTasksOverview = {
  /** 마감 지남 */
  overdue: TaskItem[];
  /** 오늘 마감 */
  dueToday: TaskItem[];
  /** 내일 ~ 이번 주 토요일 마감 */
  dueLaterThisWeek: TaskItem[];
  /** 진행 중인 태스크 수 */
  inProgressCount: number;
  /** 우선순위 최상·높음, 마감 빠른 순 */
  important: TaskItem[];
  /** 안 읽은 요청, 최신순 */
  unreadRequests: Notification[];
  /** 지금 기간 안에 있는 마일스톤 */
  activeMilestones: Milestone[];
};

/**
 * 나의 태스크 홈에 보여줄 값을 한 번에 계산해요.
 * '이번 주'는 일요일 ~ 토요일이에요.
 */
export function getMyTasksOverview(now: string = MOCK_NOW): MyTasksOverview {
  const unreadRequests = getMyUnreadRequests();
  const nudgedTaskIds = new Set(
    unreadRequests.filter((n) => n.type === 'nudge' && n.taskId).map((n) => n.taskId),
  );

  // 마감일이 있는 미완료 태스크만 날짜 계산 대상 (getMyTasks가 마감 빠른 순으로 줘요)
  const open: TaskItem[] = getMyTasks()
    .filter((t): t is Task & { dueAt: string } => t.status !== 'done' && t.dueAt !== null)
    .map((t) => {
      const days = daysUntil(t.dueAt, now);
      return {
        ...t,
        days,
        effectivePriority: t.priority ?? autoPriority(days),
        milestone: t.milestoneId ? getMilestone(t.milestoneId) : undefined,
        nudged: nudgedTaskIds.has(t.id),
      };
    });

  const today = kstDay(now);
  const weekday = (today + 4) % 7; // 1970-01-01은 목요일 → 일요일 = 0
  const daysToSaturday = 6 - weekday;

  return {
    overdue: open.filter((t) => t.days < 0),
    dueToday: open.filter((t) => t.days === 0),
    dueLaterThisWeek: open.filter((t) => t.days > 0 && t.days <= daysToSaturday),
    inProgressCount: getMyTasks().filter((t) => t.status === 'in_progress').length,
    important: open.filter((t) => t.effectivePriority === 'highest' || t.effectivePriority === 'high'),
    unreadRequests,
    activeMilestones: getMyActiveMilestones(),
  };
}
