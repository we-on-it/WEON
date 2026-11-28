import { getCurrentUser, getMyTeams, getTeamEvents, getTeamTasks, getUser, MOCK_NOW } from '../../mocks/queries';
import type { Task, TaskStatus } from '../../mocks/types';
import type { ProjectColor } from '../Sidebar/Sidebar';

export type BoardTask = Pick<Task, 'id' | 'title' | 'status' | 'dueAt'> & {
  assignee: string;
  progress: number;
  comments: number;
  files: number;
};

export type ProjectTemplate = { name: string; url: string; filename: string };
export type Project = {
  id: string;
  name: string;
  color: ProjectColor;
  description: string;
  tasks: BoardTask[];
  schedule: { title: string; startAt: string }[];
  notice?: string;
  rules: string[];
  templates: ProjectTemplate[];
  milestone?: { title: string; steps: string[]; current: number };
};

function template(name: string, sections: string[]): ProjectTemplate {
  const markdown = ['# ' + name, ...sections.map((section) => '## ' + section)].join('\n\n');
  return { name, filename: name + '.md', url: 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdown) };
}

const miduSettings = {
  notice: '11/30 중간 발표 이후 피드백 정리한 거 꼭 확인해주세요',
  rules: ['회의 1시간 이상 지각 금지', '태스크에 피드백 달기', '마감기한 및 진행상황은 24시간 내로 공유'],
  templates: [
    template('최종 발표 자료', ['프로젝트 개요', '최종 결과', '회고']),
    template('자료조사 보고 자료양식', ['조사 주제', '조사 결과', '출처']),
    template('중간 보고서 양식', ['진행 현황', '피드백', '다음 단계']),
  ],
  milestone: { title: '앱 프로토타입 + 발표자료 20p', steps: ['리서치', '와이어프레임', '프로토타입', '발표준비'], current: 1 },
};

const colors: ProjectColor[] = ['teal', 'orange', 'purple', 'pink'];
const demoProgress: Record<TaskStatus, number> = { todo: 0, in_progress: 20, done: 100 };

export function getHomeProjects(): Project[] {
  return getMyTeams().map((team, index) => ({
    id: team.id, name: team.name, description: team.description, color: colors[index % colors.length],
    rules: [], templates: [],
    ...(team.id === 't1' ? miduSettings : {}),
    schedule: getTeamEvents(team.id),
    tasks: getTeamTasks(team.id).map((task) => ({
      ...task, assignee: getUser(task.assigneeId)?.name ?? '', progress: demoProgress[task.status],
      comments: 0, files: 0,
    })),
  }));
}

export const homeUser = getCurrentUser();
export const demoToday = MOCK_NOW.slice(0, 10);

/** WEON 데모의 마감 시각은 KST로 저장됩니다. */
export function deadline(dueAt: string | null, today: string) {
  if (!dueAt) return { day: '마감 미정', date: '미정', level: 'low' } as const;
  const days = Math.round((Date.parse(dueAt.slice(0, 10)) - Date.parse(today)) / 86_400_000);
  const level = days <= 1 ? 'highest' : days <= 3 ? 'high' : days <= 7 ? 'medium' : 'low';
  return {
    day: days === 0 ? 'D-day' : days < 0 ? 'D+' + Math.abs(days) : 'D-' + days,
    date: dueAt.slice(5, 10).replace('-', '/') + ' ' + dueAt.slice(11, 16),
    level,
  } as const;
}
