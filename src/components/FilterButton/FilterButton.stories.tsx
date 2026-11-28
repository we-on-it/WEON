import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterButton } from './FilterButton';

const meta = {
  title: 'Components/FilterButton',
  component: FilterButton,
  args: { children: '프로젝트 전체' },
} satisfies Meta<typeof FilterButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 마우스를 올리면 hover. 실제로는 DropdownMenu의 trigger로 씁니다 (Components/Dropdown 참고) */
export const Playground: Story = {};

/** Figma state 3종. open은 DropdownMenu가 붙여 주는 data-state=open으로 표시돼요 */
export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <FilterButton {...args} />
      <FilterButton {...args} data-state="open" />
      <FilterButton {...args} disabled />
    </div>
  ),
};
