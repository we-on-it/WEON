import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterButton } from '../FilterButton/FilterButton';
import { PRIORITY_LABEL, PriorityMenu, type PriorityLevel } from './PriorityMenu';

const meta = {
  title: 'Components/PriorityMenu',
  component: PriorityMenu,
  args: { value: 'medium', onValueChange: () => {}, trigger: <button /> },
  parameters: { controls: { disable: true } },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 340 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PriorityMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 트리거와 행 아이콘은 임시입니다. Priority 컴포넌트가 생기면
 * `trigger={<Priority level={value} chevron />}` · `renderIcon={(l) => <Priority level={l} iconOnly />}`로 연결하세요.
 */
export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<PriorityLevel>('high');
    return (
      <PriorityMenu
        value={value}
        onValueChange={setValue}
        trigger={<FilterButton>{PRIORITY_LABEL[value]}</FilterButton>}
      />
    );
  },
};
