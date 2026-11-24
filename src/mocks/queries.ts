// ⚠️ 디미버스 시연용 더미 데이터입니다. 실제 서비스 데이터가 아니며, 백엔드 연결 후 교체·삭제합니다.
// 화면에서 가짜 DB를 읽을 때 쓰는 함수. 나중에 API 호출로 바꿀 때 이 파일만 고치면 되도록 화면은 db.ts를 직접 import하지 않는다.
import {
  CURRENT_USER_ID,
  MOCK_NOW,
  events,
  notifications,
  tasks,
  teamMembers,
  teams,
  users,
} from './db';
import type { ID, ScheduleEvent, Task, Team, TeamRole, User } from './types';

export { MOCK_NOW };

export const getUser = (id: ID): User | undefined => users.find((u) => u.id === id);

export const getTeam = (id: ID): Team | undefined => teams.find((t) => t.id === id);

/** 지금 로그인된 유저 */
export const getCurrentUser = (): User => getUser(CURRENT_USER_ID)!;

/** 내가 속한 팀 (내 역할 포함) */
export const getMyTeams = (): (Team & { myRole: TeamRole })[] =>
  teamMembers
    .filter((m) => m.userId === CURRENT_USER_ID)
    .map((m) => ({ ...getTeam(m.teamId)!, myRole: m.role }));

/** 팀원 목록 (팀장 먼저) */
export const getTeamMembers = (teamId: ID): (User & { role: TeamRole })[] =>
  teamMembers
    .filter((m) => m.teamId === teamId)
    .sort((a, b) => (a.role === b.role ? 0 : a.role === 'leader' ? -1 : 1))
    .map((m) => ({ ...getUser(m.userId)!, role: m.role }));

const myTeamIds = () => new Set(getMyTeams().map((t) => t.id));

/** 내가 볼 수 있는 일정 = 내 팀 일정 + 내 개인 일정. [from, to) 범위, 시작 시각 순 */
export const getMyEvents = (from: string, to: string): ScheduleEvent[] => {
  const ids = myTeamIds();
  const start = Date.parse(from);
  const end = Date.parse(to);
  return events
    .filter((e) => (e.teamId ? ids.has(e.teamId) : e.createdBy === CURRENT_USER_ID))
    .filter((e) => {
      const t = Date.parse(e.startAt);
      return t >= start && t < end;
    })
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));
};

/** 캘린더 표시용 이름: "MIDU 회의", 개인 일정은 제목만 */
export const eventLabel = (e: ScheduleEvent): string => {
  const team = e.teamId ? getTeam(e.teamId) : undefined;
  return team ? `${team.name} ${e.title}` : e.title;
};

/** 나에게 배정된 태스크. 마감 빠른 순, 마감 없는 건 뒤로 */
export const getMyTasks = (): Task[] =>
  tasks
    .filter((k) => k.assigneeId === CURRENT_USER_ID)
    .sort((a, b) => (a.dueAt ? Date.parse(a.dueAt) : Infinity) - (b.dueAt ? Date.parse(b.dueAt) : Infinity));

export const getTeamTasks = (teamId: ID): Task[] => tasks.filter((k) => k.teamId === teamId);

/** 내 알림, 최신순 */
export const getMyNotifications = () =>
  notifications
    .filter((n) => n.userId === CURRENT_USER_ID)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
