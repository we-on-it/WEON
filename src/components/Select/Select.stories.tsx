import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../Badge/Badge';
import { Select, SelectItem } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  subcomponents: { SelectItem },
  args: { onValueChange: () => {}, children: null },
  parameters: { controls: { disable: true } },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const PRIORITIES = [
  { value: 'highest', label: '최상' },
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' },
];

/** 입력칸 이름은 Select 밖 화면 텍스트로 두고 aria-labelledby로 연결해요 */
export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span id="priority-label" style={{ color: 'var(--foreground-tertiary)', fontSize: 13 }}>
          우선순위
        </span>
        <Select value={value} onValueChange={setValue} aria-labelledby="priority-label">
          {PRIORITIES.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    );
  },
};

/** Figma 8 variants: has-value × (default · invalid · disabled). open은 눌러서 확인 */
export const States: Story = {
  render: () => {
    const items = PRIORITIES.map((p) => (
      <SelectItem key={p.value} value={p.value}>
        {p.label}
      </SelectItem>
    ));
    const row = (props: { invalid?: boolean; disabled?: boolean }) => (
      <div style={{ display: 'flex', gap: 24 }}>
        <Select onValueChange={() => {}} aria-label="빈 값" {...props}>
          {items}
        </Select>
        <Select value="medium" onValueChange={() => {}} aria-label="값 있음" {...props}>
          {items}
        </Select>
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {row({})}
        {row({ invalid: true })}
        {row({ disabled: true })}
      </div>
    );
  },
};

/** description · trailing: 마일스톤 기간과 ‘AI 추천’ 뱃지를 값 옆에 보여줄 때 */
export const WithDescription: Story = {
  render: () => {
    const milestones = [
      { value: 'm1', label: '기획', period: '11/2 – 11/8' },
      { value: 'm2', label: '디자인', period: '11/9 – 11/20' },
      { value: 'm3', label: '개발', period: '11/21 – 12/5' },
    ];
    const [value, setValue] = useState('m2');
    const selected = milestones.find((m) => m.value === value);
    return (
      <Select
        value={value}
        onValueChange={setValue}
        aria-label="마일스톤"
        description={selected?.period}
        trailing={value === 'm2' ? <Badge type="ai">AI 추천</Badge> : undefined}
        footer="마일스톤 마감이 태스크 마감보다 먼저면 우선순위가 한 단계 올라가요"
      >
        {milestones.map((m) => (
          <SelectItem key={m.value} value={m.value} description={m.period}>
            {m.label}
          </SelectItem>
        ))}
      </Select>
    );
  },
};
