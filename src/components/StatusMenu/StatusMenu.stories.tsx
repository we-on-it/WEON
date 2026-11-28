import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterButton } from '../FilterButton/FilterButton';
import { STATUS_LABEL, StatusMenu, type TaskStatusValue } from './StatusMenu';

const meta = {
  title: 'Components/StatusMenu',
  component: StatusMenu,
  args: {
    value: 'todo',
    onValueChange: () => {},
    onRequestDone: () => {},
    trigger: <button />,
  },
  parameters: { controls: { disable: true } },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 트리거·행의 칩은 임시입니다. StatusChip이 생기면
 * `trigger={<StatusChip status={value} chevron />}` · `renderChip={(s) => <StatusChip status={s} />}`로 연결하세요.
 * ‘완료’를 고르면 값이 바뀌지 않고 onRequestDone이 불려요.
 */
export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<TaskStatusValue>('todo');
    const [log, setLog] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <StatusMenu
          value={value}
          onValueChange={(v) => {
            setValue(v);
            setLog('');
          }}
          onRequestDone={() => setLog('→ 결과물 제출 화면으로 이동')}
          trigger={<FilterButton>{STATUS_LABEL[value]}</FilterButton>}
        />
        {log && <span style={{ color: 'var(--foreground-tertiary)', fontSize: 13 }}>{log}</span>}
      </div>
    );
  },
};
