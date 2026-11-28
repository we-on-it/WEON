import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../../components/Avatar/Avatar';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { getCurrentUser, getMyTeams } from '../../mocks/queries';
import { MY_TASKS_TABS, MyTasks } from './MyTasks';

const user = getCurrentUser();
const projects = getMyTeams().map((t) => ({ id: t.id, name: t.name, color: t.accent }));

const meta = {
  title: 'Pages/MyTasks',
  component: MyTasks,
  parameters: { layout: 'fullscreen' },
  args: { defaultTab: 'home' },
  argTypes: {
    defaultTab: { control: 'inline-radio', options: MY_TASKS_TABS },
    onTaskSelect: { action: 'taskSelect' },
    onRequestSelect: { action: 'requestSelect' },
  },
  decorators: [
    // 앱 레이아웃 흉내: 사이드바(바깥 여백 20) + 본문. 시안 1502px 기준 본문은 left 312 · top 53 · 오른쪽 31
    (Story) => (
      <div style={{ display: 'flex', minWidth: 1280, minHeight: '100vh', background: 'var(--background-default)' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', padding: '20px 0 20px 20px', boxSizing: 'border-box', flexShrink: 0 }}>
          <Sidebar
            activeMenu="my-tasks"
            projects={projects}
            userName={user.name}
            avatar={<Avatar initial={user.name[0]} src={user.avatarUrl ?? undefined} />}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, padding: '53px 31px 40px 45px' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof MyTasks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 홈 탭 (Figma 454:18251). 가짜 '오늘'은 2026-11-11(수) 09:00 */
export const Home: Story = {};

/** 시안이 아직 없는 탭은 빈 자리로 보여요 */
export const RequestsPlaceholder: Story = { args: { defaultTab: 'requests' } };
