import type { Meta, StoryObj } from '@storybook/react-vite';
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
      id: 'poster-' + i, title: '전시 포스터 시안 공유하기', status, dueAt: '2026-11-13T18:00:00+09:00',
      assignee: '', progress: status === 'done' ? 100 : status === 'in_progress' ? 20 : 0, comments: 0, files: 0,
    })) };
});

export const Figma: Story = { args: { projects: referenceProjects, today: '2026-11-12', profile: { name: 'NAME', avatarUrl: avatar } } };
export const Demo: Story = {};
export const ListView: Story = { args: { initialView: 'list' } };
export const EmptyBoard: Story = { args: { projects: [{ ...projects[0], tasks: [] }] } };
