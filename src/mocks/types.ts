// ⚠️ 디미버스 시연용 더미 데이터입니다. 실제 서비스 데이터가 아니며, 백엔드 연결 후 교체·삭제합니다.
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
  /** 팀 배지·사이드바 프로젝트 색. accent 토큰(--accent-*-{색}) 이름 */
  accent: TeamAccent;
  createdAt: string;
}

/** colors.css의 accent 색 (Sidebar ProjectColor와 같은 값) */
export type TeamAccent = 'teal' | 'orange' | 'purple' | 'pink';

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

/** 마일스톤 유형. 리서치 유형만 결과물 제출 시 출처 필수 (Figma MilestoneChip 설명) */
export type MilestoneType = 'research' | 'production' | 'presentation';

/** 팀 프로젝트의 마일스톤 (기간이 있는 단계) */
export interface Milestone {
  id: ID;
  teamId: ID;
  type: MilestoneType;
  name: string;
  startAt: string;
  endAt: string;
  progress: number; // 0~100
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

/** 할 일. teamId가 null이면 개인 태스크 */
export interface Task {
  id: ID;
  teamId: ID | null;
  milestoneId: ID | null; // 개인 태스크·마일스톤 밖 태스크는 null
  title: string;
  status: TaskStatus;
  progress: number; // 0~100
  /** 본인이 켠 사이렌 표시. 중요한 태스크 맨 위로 올라가요 */
  siren: boolean;
  assigneeId: ID;
  dueAt: string | null;
  createdBy: ID;
  createdAt: string;
}

export type NotificationType =
  | 'report_request' // 자료 보고 요청
  | 'revision_request' // 수정 요청
  | 'nudge' // 찌르기
  | 'deadline_reminder' // 마감 리마인드
  | 'task_assigned' // 태스크 배정
  | 'event_created' // 일정 추가
  | 'team_invite'; // 팀 초대

/** '나에게 온 요청'에 모이는 알림 종류 */
export const REQUEST_TYPES: readonly NotificationType[] = [
  'report_request',
  'revision_request',
  'nudge',
  'deadline_reminder',
];

export interface Notification {
  id: ID;
  userId: ID; // 받는 사람
  teamId: ID | null;
  taskId: ID | null; // 특정 태스크에 대한 알림이면 그 태스크
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}
