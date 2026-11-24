// 가짜 DB 타입. 백엔드가 생기면 API 응답 타입으로 그대로 옮겨 쓸 수 있게 테이블 단위로 나눔.
// 날짜는 모두 ISO 8601 문자열(KST, +09:00).

export type ID = string;

export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl: string | null; // null이면 이름 첫 글자로 아바타 표시
  createdAt: string;
}

export interface Team {
  id: ID;
  name: string;
  description: string;
  color: string; // 캘린더·태그 구분용 semantic 변수명 (예: 'var(--fill-brand)')
  createdAt: string;
}

export type TeamRole = 'leader' | 'member';

export interface TeamMember {
  teamId: ID;
  userId: ID;
  role: TeamRole;
  joinedAt: string;
}

/** 캘린더 일정. teamId가 null이면 개인 일정 */
export interface ScheduleEvent {
  id: ID;
  teamId: ID | null;
  title: string;
  startAt: string;
  endAt: string | null; // null이면 시각만 있는 일정(마감 등)
  allDay: boolean;
  createdBy: ID;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

/** 할 일. teamId가 null이면 개인 태스크 */
export interface Task {
  id: ID;
  teamId: ID | null;
  title: string;
  status: TaskStatus;
  assigneeId: ID;
  dueAt: string | null;
  createdBy: ID;
  createdAt: string;
}

export type NotificationType =
  | 'report_request' // 자료 보고 요청
  | 'task_assigned' // 태스크 배정
  | 'event_created' // 일정 추가
  | 'team_invite'; // 팀 초대

export interface Notification {
  id: ID;
  userId: ID; // 받는 사람
  teamId: ID | null;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}
