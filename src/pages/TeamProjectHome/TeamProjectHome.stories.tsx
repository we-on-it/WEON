import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent } from 'storybook/test';
import { TeamProjectHome } from './TeamProjectHome';
import { getHomeProjects } from './projectData';
import avatar from './reference-avatar.png';

const meta = {
  title: 'Pages/TeamProjectHome',
  component: TeamProjectHome,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TeamProjectHome>;

export default meta;
type Story = StoryObj<typeof meta>;

const projects = getHomeProjects();
const referenceProjects = projects.map((project, index) => {
  if (index !== 0) return { ...project, name: index === 1 ? '졸준위' : '캡스톤' };
  return { ...project, tasks: (['todo', 'in_progress', 'in_progress', 'in_progress', 'done', 'done'] as const)
    .map((status, i) => ({
      id: 'poster-' + i, title: '전시 포스터 시안 공유하기', status, siren: i === 0 || i >= 3,
      dueAt: status === 'done' ? '2026-11-12T18:00:00+09:00' : '2026-11-13T18:00:00+09:00',
      assignee: '', progress: status === 'done' ? 100 : status === 'in_progress' ? 20 : 0, comments: 0, files: 0,
    })) };
});

export const Figma: Story = { args: { projects: referenceProjects, today: '2026-11-12', profile: { name: 'NAME', avatarUrl: avatar } } };
export const Demo: Story = {};
export const ListView: Story = { args: { initialView: 'list' } };
export const EmptyBoard: Story = { args: { projects: [{ ...projects[0], tasks: [] }] } };

export const ScheduleTimeline: Story = {
  args: {
    ...Figma.args, today: '2026-11-18',
    projects: [{ ...referenceProjects[0], schedule: [
      { title: '리서치', kind: 'milestone', startAt: '2026-11-10', endAt: '2026-11-18' },
      { title: '리서치', kind: 'milestone', startAt: '2026-11-19', endAt: '2026-11-25' },
      ...[[13, 13], [14, 14], [14, 15], [18, 18], [19, 19], [19, 20], [20, 21]].map(([start, end]) => ({
        title: '회의', startAt: '2026-11-' + start + 'T11:00:00+09:00', endAt: '2026-11-' + end + 'T12:00:00+09:00',
      })),
    ] }, ...referenceProjects.slice(1)],
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('tab', { name: '전체 일정' }));
  },
};

export const ScheduleCalendar: Story = {
  args: { ...Figma.args, projects: referenceProjects.map(project => ({
    ...project, schedule: project.schedule.filter(event => event.kind === 'milestone'),
  })) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: '전체 일정' }));
    await userEvent.click(canvas.getByRole('button', { name: '캘린더' }));
  },
};
