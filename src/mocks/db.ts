// ⚠️ 디미버스 시연용 더미 데이터입니다. 실제 서비스 데이터가 아니며, 백엔드 연결 후 교체·삭제합니다.
// 가짜 DB. 로그인 없이 CURRENT_USER_ID 유저로 로그인된 상태를 가정한다.
// 홈 화면(Figma 189:2036)의 2026년 11월 2주차 캘린더·알림과 맞춰 둠.
import type {
  Milestone,
  Notification,
  ScheduleEvent,
  Task,
  Team,
  TeamMember,
  User,
} from './types';

/** 지금 로그인된 유저 */
export const CURRENT_USER_ID = 'u1';

/** 가짜 '오늘'. 화면에서 new Date() 대신 이 값을 기준으로 쓰면 데모가 항상 같은 모습이 됨 */
export const MOCK_NOW = '2026-11-11T09:00:00+09:00';

// ── 유저 ──────────────────────────────────────────────
export const users: User[] = [
  { id: 'u1', name: '한서윤', email: 'seoyun@weon.test', avatarUrl: null, createdAt: '2026-09-01T10:00:00+09:00' },
  { id: 'u2', name: '박지유', email: 'jiyu@weon.test', avatarUrl: null, createdAt: '2026-09-01T10:05:00+09:00' },
  { id: 'u3', name: '이하린', email: 'harin@weon.test', avatarUrl: null, createdAt: '2026-09-02T14:20:00+09:00' },
  { id: 'u4', name: '최수아', email: 'sua@weon.test', avatarUrl: null, createdAt: '2026-09-03T09:12:00+09:00' },
  { id: 'u5', name: '정예린', email: 'yerin@weon.test', avatarUrl: null, createdAt: '2026-09-03T21:40:00+09:00' },
  { id: 'u6', name: '강나은', email: 'naeun@weon.test', avatarUrl: null, createdAt: '2026-09-05T11:00:00+09:00' },
  { id: 'u7', name: '윤소희', email: 'sohee@weon.test', avatarUrl: null, createdAt: '2026-09-08T16:30:00+09:00' },
  { id: 'u8', name: '오채원', email: 'chaewon@weon.test', avatarUrl: null, createdAt: '2026-09-10T13:15:00+09:00' },
];

// ── 팀 ────────────────────────────────────────────────
export const teams: Team[] = [
  {
    id: 't1',
    name: 'MIDU',
    description: '모바일 UX 수업 팀 프로젝트',
    color: 'var(--fill-brand)',
    accent: 'teal',
    createdAt: '2026-09-02T15:00:00+09:00',
  },
  {
    id: 't2',
    name: '캡스톤',
    description: '캡스톤 디자인 — WEON 서비스 개발',
    color: 'var(--accent-foreground-purple)',
    accent: 'pink',
    createdAt: '2026-09-01T11:00:00+09:00',
  },
  {
    id: 't3',
    name: '졸준위',
    description: '졸업전시 준비위원회',
    color: 'var(--fill-success)',
    accent: 'orange',
    createdAt: '2026-09-10T20:00:00+09:00',
  },
];

// 한서윤(u1)은 세 팀 모두 소속, 캡스톤에서는 팀장
export const teamMembers: TeamMember[] = [
  // MIDU (4명)
  { teamId: 't1', userId: 'u2', role: 'leader', joinedAt: '2026-09-02T15:00:00+09:00' },
  { teamId: 't1', userId: 'u1', role: 'member', joinedAt: '2026-09-02T15:10:00+09:00' },
  { teamId: 't1', userId: 'u3', role: 'member', joinedAt: '2026-09-02T15:12:00+09:00' },
  { teamId: 't1', userId: 'u4', role: 'member', joinedAt: '2026-09-03T09:20:00+09:00' },
  // 캡스톤 (4명)
  { teamId: 't2', userId: 'u1', role: 'leader', joinedAt: '2026-09-01T11:00:00+09:00' },
  { teamId: 't2', userId: 'u2', role: 'member', joinedAt: '2026-09-01T11:05:00+09:00' },
  { teamId: 't2', userId: 'u5', role: 'member', joinedAt: '2026-09-03T21:45:00+09:00' },
  { teamId: 't2', userId: 'u6', role: 'member', joinedAt: '2026-09-05T11:10:00+09:00' },
  // 졸준위 (5명)
  { teamId: 't3', userId: 'u7', role: 'leader', joinedAt: '2026-09-10T20:00:00+09:00' },
  { teamId: 't3', userId: 'u1', role: 'member', joinedAt: '2026-09-10T20:30:00+09:00' },
  { teamId: 't3', userId: 'u3', role: 'member', joinedAt: '2026-09-10T20:31:00+09:00' },
  { teamId: 't3', userId: 'u5', role: 'member', joinedAt: '2026-09-11T08:00:00+09:00' },
  { teamId: 't3', userId: 'u8', role: 'member', joinedAt: '2026-09-11T12:00:00+09:00' },
];

// ── 일정 ──────────────────────────────────────────────
// title에는 팀 이름을 넣지 않는다. 화면에서는 eventLabel()로 "MIDU 회의"처럼 붙여서 표시.
export const events: ScheduleEvent[] = [
  // 11월 1주차
  { id: 'e1', teamId: 't2', title: '회의', startAt: '2026-11-04T18:00:00+09:00', endAt: '2026-11-04T19:30:00+09:00', allDay: false, createdBy: 'u1' },
  { id: 'e2', teamId: 't1', title: '아이디어 발표', startAt: '2026-11-06T00:00:00+09:00', endAt: null, allDay: true, createdBy: 'u2' },

  // 11월 2주차 (홈 화면 캘린더)
  { id: 'e3', teamId: 't3', title: '전체 회의', startAt: '2026-11-09T23:00:00+09:00', endAt: '2026-11-10T00:00:00+09:00', allDay: false, createdBy: 'u7' },
  { id: 'e4', teamId: 't1', title: '회의', startAt: '2026-11-11T11:00:00+09:00', endAt: '2026-11-11T12:00:00+09:00', allDay: false, createdBy: 'u2' },
  { id: 'e5', teamId: 't2', title: '회의', startAt: '2026-11-11T18:00:00+09:00', endAt: '2026-11-11T19:30:00+09:00', allDay: false, createdBy: 'u1' },
  { id: 'e6', teamId: 't1', title: '제출 자료 마감', startAt: '2026-11-11T19:00:00+09:00', endAt: null, allDay: false, createdBy: 'u2' },
  { id: 'e7', teamId: 't3', title: '디자인 회의', startAt: '2026-11-12T23:00:00+09:00', endAt: '2026-11-13T00:00:00+09:00', allDay: false, createdBy: 'u7' },
  { id: 'e8', teamId: 't1', title: '중간 발표일', startAt: '2026-11-13T00:00:00+09:00', endAt: null, allDay: true, createdBy: 'u2' },

  // 11월 3주차 이후
  { id: 'e9', teamId: 't2', title: '중간 점검', startAt: '2026-11-18T15:00:00+09:00', endAt: '2026-11-18T16:00:00+09:00', allDay: false, createdBy: 'u1' },
  { id: 'e10', teamId: 't3', title: '포스터 시안 마감', startAt: '2026-11-20T23:59:00+09:00', endAt: null, allDay: false, createdBy: 'u7' },
  { id: 'e11', teamId: null, title: '토익 시험', startAt: '2026-11-22T09:30:00+09:00', endAt: '2026-11-22T12:00:00+09:00', allDay: false, createdBy: 'u1' },
  { id: 'e12', teamId: 't2', title: '최종 발표', startAt: '2026-12-09T00:00:00+09:00', endAt: null, allDay: true, createdBy: 'u1' },
];

// ── 마일스톤 ──────────────────────────────────────────
// 나의 태스크 홈(Figma 454:18251) '진행 중인 마일스톤'과 맞춰 둠. m4는 아직 시작 전
export const milestones: Milestone[] = [
  { id: 'm1', teamId: 't1', type: 'research', name: '사용자 인터뷰', startAt: '2026-11-04T00:00:00+09:00', endAt: '2026-11-13T23:59:00+09:00', progress: 70 },
  { id: 'm2', teamId: 't3', type: 'production', name: '포스터 시안', startAt: '2026-11-10T00:00:00+09:00', endAt: '2026-11-13T23:59:00+09:00', progress: 10 },
  { id: 'm3', teamId: 't2', type: 'production', name: '프로토타입', startAt: '2026-11-09T00:00:00+09:00', endAt: '2026-11-20T23:59:00+09:00', progress: 2 },
  { id: 'm4', teamId: 't1', type: 'presentation', name: '중간 발표', startAt: '2026-11-14T00:00:00+09:00', endAt: '2026-11-17T23:59:00+09:00', progress: 0 },
];

// ── 태스크 ────────────────────────────────────────────
// 한서윤(u1)의 미완료 태스크는 나의 태스크 홈(Figma 454:18251)과 맞춰 둠
export const tasks: Task[] = [
  // MIDU
  { id: 'k1', teamId: 't1', milestoneId: 'm1', title: '사용자 인터뷰 결과 정리', status: 'done', progress: 100, priority: null, assigneeId: 'u1', dueAt: '2026-11-09T23:59:00+09:00', createdBy: 'u2', createdAt: '2026-11-03T12:00:00+09:00' },
  { id: 'k2', teamId: 't1', milestoneId: 'm4', title: '중간 발표 자료 3~5장 작성', status: 'in_progress', progress: 40, priority: null, assigneeId: 'u4', dueAt: '2026-11-11T19:00:00+09:00', createdBy: 'u2', createdAt: '2026-11-07T10:00:00+09:00' },
  { id: 'k3', teamId: 't1', milestoneId: null, title: '프로토타입 플로우 수정', status: 'todo', progress: 0, priority: null, assigneeId: 'u3', dueAt: '2026-11-12T23:59:00+09:00', createdBy: 'u2', createdAt: '2026-11-08T14:00:00+09:00' },
  { id: 'k4', teamId: 't1', milestoneId: 'm4', title: '발표 대본 작성', status: 'todo', progress: 0, priority: null, assigneeId: 'u4', dueAt: '2026-11-12T23:59:00+09:00', createdBy: 'u2', createdAt: '2026-11-08T14:05:00+09:00' },
  { id: 'k14', teamId: 't1', milestoneId: 'm1', title: '인터뷰 결과 요약', status: 'in_progress', progress: 70, priority: null, assigneeId: 'u1', dueAt: '2026-11-10T23:59:00+09:00', createdBy: 'u2', createdAt: '2026-11-05T10:00:00+09:00' },
  { id: 'k16', teamId: 't1', milestoneId: 'm4', title: '발표 스크립트 초안', status: 'in_progress', progress: 10, priority: 'high', assigneeId: 'u1', dueAt: '2026-11-17T23:59:00+09:00', createdBy: 'u2', createdAt: '2026-11-09T10:00:00+09:00' },

  // 캡스톤
  { id: 'k5', teamId: 't2', milestoneId: null, title: '디자인 토큰 스토리북 정리', status: 'done', progress: 100, priority: null, assigneeId: 'u1', dueAt: '2026-11-07T23:59:00+09:00', createdBy: 'u1', createdAt: '2026-11-01T18:00:00+09:00' },
  { id: 'k6', teamId: 't2', milestoneId: 'm3', title: '홈 화면 퍼블리싱', status: 'in_progress', progress: 30, priority: null, assigneeId: 'u5', dueAt: '2026-11-14T23:59:00+09:00', createdBy: 'u1', createdAt: '2026-11-04T19:30:00+09:00' },
  { id: 'k7', teamId: 't2', milestoneId: null, title: '일정 API 설계', status: 'in_progress', progress: 50, priority: null, assigneeId: 'u6', dueAt: '2026-11-15T23:59:00+09:00', createdBy: 'u1', createdAt: '2026-11-04T19:30:00+09:00' },
  { id: 'k8', teamId: 't2', milestoneId: 'm3', title: '팀 초대 플로우 와이어프레임', status: 'todo', progress: 0, priority: null, assigneeId: 'u5', dueAt: '2026-11-16T23:59:00+09:00', createdBy: 'u1', createdAt: '2026-11-04T19:35:00+09:00' },
  { id: 'k9', teamId: 't2', milestoneId: null, title: '중간 점검 보고서 초안', status: 'todo', progress: 0, priority: null, assigneeId: 'u2', dueAt: '2026-11-17T23:59:00+09:00', createdBy: 'u1', createdAt: '2026-11-10T09:00:00+09:00' },
  { id: 'k15', teamId: 't2', milestoneId: 'm3', title: '하이파이 목업 제작하기', status: 'in_progress', progress: 30, priority: 'high', assigneeId: 'u1', dueAt: '2026-11-15T23:59:00+09:00', createdBy: 'u1', createdAt: '2026-11-09T11:00:00+09:00' },

  // 졸준위
  { id: 'k10', teamId: 't3', milestoneId: 'm2', title: '전시 포스터 시안 공유하기', status: 'todo', progress: 0, priority: null, assigneeId: 'u1', dueAt: '2026-11-12T22:00:00+09:00', createdBy: 'u7', createdAt: '2026-11-09T23:40:00+09:00' },
  { id: 'k11', teamId: 't3', milestoneId: null, title: '전시장 대관 견적 받기', status: 'in_progress', progress: 50, priority: null, assigneeId: 'u8', dueAt: '2026-11-14T18:00:00+09:00', createdBy: 'u7', createdAt: '2026-11-09T23:45:00+09:00' },
  { id: 'k12', teamId: 't3', milestoneId: null, title: '참여 학생 명단 확정', status: 'done', progress: 100, priority: null, assigneeId: 'u3', dueAt: '2026-11-08T23:59:00+09:00', createdBy: 'u7', createdAt: '2026-11-02T20:00:00+09:00' },

  // 개인 태스크
  { id: 'k13', teamId: null, milestoneId: null, title: '토익 모의고사 1회분 풀기', status: 'todo', progress: 0, priority: null, assigneeId: 'u1', dueAt: '2026-11-15T23:59:00+09:00', createdBy: 'u1', createdAt: '2026-11-08T22:00:00+09:00' },
];

// ── 알림 ──────────────────────────────────────────────
// u1의 안 읽은 요청(n1·n6·n7·n8)은 나의 태스크 홈 '안 읽은 요청'과 맞춰 둠
export const notifications: Notification[] = [
  { id: 'n1', userId: 'u1', teamId: 't1', taskId: 'k14', type: 'report_request', message: 'MIDU에서 ‘인터뷰 결과 요약’ 진행 상황 보고를 요청했어요', read: false, createdAt: '2026-11-11T08:40:00+09:00' },
  { id: 'n2', userId: 'u1', teamId: 't3', taskId: 'k10', type: 'task_assigned', message: '졸준위에서 ‘전시 포스터 시안 공유하기’ 태스크가 배정됐어요', read: false, createdAt: '2026-11-09T23:40:00+09:00' },
  { id: 'n3', userId: 'u1', teamId: 't3', taskId: null, type: 'event_created', message: '졸준위에서 ‘디자인 회의’ 일정이 추가됐어요', read: true, createdAt: '2026-11-09T23:50:00+09:00' },
  { id: 'n4', userId: 'u1', teamId: 't1', taskId: null, type: 'event_created', message: 'MIDU에서 ‘중간 발표일’ 일정이 추가됐어요', read: true, createdAt: '2026-11-06T15:00:00+09:00' },
  { id: 'n5', userId: 'u2', teamId: 't2', taskId: 'k9', type: 'task_assigned', message: '캡스톤에서 ‘중간 점검 보고서 초안’ 태스크가 배정됐어요', read: false, createdAt: '2026-11-10T09:00:00+09:00' },
  { id: 'n6', userId: 'u1', teamId: 't2', taskId: 'k15', type: 'revision_request', message: '정예린님이 ‘하이파이 목업 제작하기’에 수정을 요청했어요', read: false, createdAt: '2026-11-10T22:14:00+09:00' },
  { id: 'n7', userId: 'u1', teamId: 't2', taskId: 'k15', type: 'nudge', message: '박지유님이 ‘하이파이 목업 제작하기’에 찌르기를 보냈어요', read: false, createdAt: '2026-11-11T08:30:00+09:00' },
  { id: 'n8', userId: 'u1', teamId: 't3', taskId: 'k10', type: 'deadline_reminder', message: '‘전시 포스터 시안 공유하기’ 마감이 내일이에요', read: false, createdAt: '2026-11-11T00:00:00+09:00' },
];
