import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TabItem, Tabs } from './Tab';

const meta = {
  title: 'Components/Tab',
  component: Tabs,
  subcomponents: { TabItem },
  args: {
    value: 'home',
    onValueChange: () => {},
    'aria-label': '홈 메뉴',
    children: null,
  },
  argTypes: {
    value: { control: false },
    children: { control: false },
  },
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Tabs와 같은 구성. 클릭하거나 ←/→ 키로 바꿔 보세요. 선택 안 된 탭에 마우스를 올리면 색이 진해져요 */
export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('home');
    return (
      <Tabs {...args} value={value} onValueChange={setValue}>
        <TabItem value="home">홈</TabItem>
        <TabItem value="schedule">나의 일정</TabItem>
        <TabItem value="task">태스크 관리</TabItem>
        <TabItem value="request" count={4}>
          나에게 온 요청
        </TabItem>
      </Tabs>
    );
  },
};

/** count: 0이면 숨기고, 99를 넘으면 '99+' */
export const Count: Story = {
  render: (args) => {
    const [value, setValue] = useState('a');
    return (
      <Tabs {...args} value={value} onValueChange={setValue}>
        <TabItem value="a" count={0}>
          0개
        </TabItem>
        <TabItem value="b" count={4}>
          4개
        </TabItem>
        <TabItem value="c" count={42}>
          42개
        </TabItem>
        <TabItem value="d" count={128}>
          128개
        </TabItem>
      </Tabs>
    );
  },
};

/** 비활성 탭은 키보드 이동에서 건너뛰어요 */
export const WithDisabled: Story = {
  render: (args) => {
    const [value, setValue] = useState('home');
    return (
      <Tabs {...args} value={value} onValueChange={setValue}>
        <TabItem value="home">홈</TabItem>
        <TabItem value="schedule" disabled>
          나의 일정
        </TabItem>
        <TabItem value="task">태스크 관리</TabItem>
      </Tabs>
    );
  },
};

/** 오른쪽 정렬 요소는 Tabs 밖 tab-row에서 spacer로 밀어요 */
export const WithRightAction: Story = {
  render: (args) => {
    const [value, setValue] = useState('home');
    return (
      <div style={{ display: 'flex', alignItems: 'center', width: 640 }}>
        <Tabs {...args} value={value} onValueChange={setValue}>
          <TabItem value="home">홈</TabItem>
          <TabItem value="schedule">나의 일정</TabItem>
        </Tabs>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: 'var(--foreground-tertiary)' }}>오른쪽 요소</span>
      </div>
    );
  },
};
