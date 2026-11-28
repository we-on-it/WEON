import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import {
  ALL_PROJECTS_ID,
  PROJECT_COLORS,
  Sidebar,
  SIDEBAR_MENUS,
  SidebarMenuItem,
  SidebarProjectItem,
  type SidebarMenu,
  type SidebarProject,
} from './Sidebar';

const PROJECTS: SidebarProject[] = [
  { id: 'midu', name: 'MIDU', color: 'teal' },
  { id: 'jjw', name: '졸준위', color: 'orange' },
  { id: 'capstone', name: '캡스톤', color: 'purple' },
];

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  args: {
    activeMenu: 'team-project',
    activeProjectId: 'midu',
    projects: PROJECTS,
    userName: 'NAME',
    // Avatar 컴포넌트가 생기기 전까지 쓰는 자리 표시용 원 (Figma Avatar small 22px)
    avatar: (
      <span
        aria-hidden
        style={{
          width: 22,
          height: 22,
          flexShrink: 0,
          borderRadius: 999,
          background: 'var(--fill-neutral-weak)',
          boxShadow: 'inset 0 0 0 1px var(--border-weak)',
        }}
      />
    ),
  },
  argTypes: {
    avatar: { control: false },
    activeMenu: { control: 'select', options: [undefined, ...SIDEBAR_MENUS] },
    activeProjectId: { control: 'select', options: [null, ALL_PROJECTS_ID, ...PROJECTS.map((p) => p.id)] },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', minHeight: 900, padding: 20, boxSizing: 'border-box', background: 'var(--background-default)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 현재 메뉴·프로젝트를 바꿔볼 수 있어요 */
export const Playground: Story = {};

/** 클릭하면 선택이 바뀌어요 */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => {
    const [menu, setMenu] = useState<SidebarMenu>('team-project');
    const [project, setProject] = useState<string | null>('midu');
    return (
      <Sidebar
        {...args}
        activeMenu={menu}
        activeProjectId={menu === 'team-project' ? project : null}
        onMenuSelect={(m) => {
          setMenu(m);
          if (m === 'team-project' && project === null) setProject(ALL_PROJECTS_ID);
        }}
        onProjectSelect={(id) => {
          setMenu('team-project');
          setProject(id);
        }}
      />
    );
  },
};

export const MyTasks: Story = {
  args: { activeMenu: 'my-tasks', activeProjectId: null },
};

const label: CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  whiteSpace: 'nowrap',
};

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '120px repeat(2, 199px)',
  gap: '12px 24px',
  alignItems: 'center',
};

/** Sidebar/MenuItem · Sidebar/ProjectItem variant 표. hover·press는 직접 마우스를 올려 확인하세요 */
export const Items: Story = {
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ padding: 32, background: 'var(--background-floated)' }}><Story /></div>],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={grid}>
        <span />
        <span style={label}>selected=false</span>
        <span style={label}>selected=true</span>
        <span style={label}>MenuItem</span>
        <SidebarMenuItem icon="home" label="홈" />
        <SidebarMenuItem icon="home" label="홈" selected />
      </div>
      <div style={grid}>
        <span />
        <span style={label}>selected=false</span>
        <span style={label}>selected=true</span>
        {PROJECT_COLORS.map((color) => (
          <div key={color} style={{ display: 'contents' }}>
            <span style={label}>ProjectItem · {color}</span>
            <SidebarProjectItem label="프로젝트" color={color} />
            <SidebarProjectItem label="프로젝트" color={color} selected />
          </div>
        ))}
      </div>
    </div>
  ),
};
