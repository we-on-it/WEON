import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TEXT_AREA_STATES, TextArea } from './TextArea';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  args: {
    placeholder: '플레이스홀더',
    state: 'default',
    disabled: false,
    invalid: false,
  },
  argTypes: {
    state: { control: 'inline-radio', options: TEXT_AREA_STATES },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 state, invalid, disabled를 바꾸고 직접 입력해 보세요 */
export const Playground: Story = {};

const variants = [
  { name: 'default · empty', state: 'default', invalid: false, disabled: false, defaultValue: undefined },
  { name: 'default · has value', state: 'default', invalid: false, disabled: false, defaultValue: '입력값' },
  { name: 'focus · empty', state: 'focus', invalid: false, disabled: false, defaultValue: undefined },
  { name: 'focus · has value', state: 'focus', invalid: false, disabled: false, defaultValue: '입력값' },
  { name: 'default · invalid · empty', state: 'default', invalid: true, disabled: false, defaultValue: undefined },
  { name: 'default · invalid · has value', state: 'default', invalid: true, disabled: false, defaultValue: '입력값' },
  { name: 'focus · invalid · empty', state: 'focus', invalid: true, disabled: false, defaultValue: undefined },
  { name: 'focus · invalid · has value', state: 'focus', invalid: true, disabled: false, defaultValue: '입력값' },
  { name: 'disabled · empty', state: 'default', invalid: false, disabled: true, defaultValue: undefined },
  { name: 'disabled · has value', state: 'default', invalid: false, disabled: true, defaultValue: '입력값' },
] as const;

/** Figma에 표시된 10개 조합을 한 화면에서 비교합니다 */
export const Variants: Story = {
  decorators: [(Story) => <Story />],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: '24px 40px' }}>
      {variants.map(({ name, ...props }) => (
        <div key={name} style={{ display: 'grid', gap: 8 }}>
          <span style={{ color: 'var(--foreground-tertiary)', fontSize: 12 }}>{name}</span>
          <TextArea aria-label={name} {...props} />
        </div>
      ))}
    </div>
  ),
};

const LONG = Array.from({ length: 12 }, (_, i) => `${i + 1}번째 줄입니다. 내용이 길어지면 상자가 늘어나요.`).join('\n');

/** 내용에 맞춰 100px부터 늘어나다 200px을 넘으면 스크롤돼요. 줄을 추가하거나 지워 보세요 */
export const AutoGrow: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState(LONG.split('\n').slice(0, 3).join('\n'));
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <TextArea aria-label="자동 높이" value={value} onChange={(e) => setValue(e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setValue(LONG)}>
            긴 내용 넣기
          </button>
          <button type="button" onClick={() => setValue('')}>
            비우기
          </button>
        </div>
      </div>
    );
  },
};
