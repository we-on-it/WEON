import type { Meta, StoryObj } from '@storybook/react-vite';
import { TEXT_INPUT_STATES, TextInput } from './TextInput';

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  args: {
    placeholder: '플레이스홀더',
    state: 'default',
    disabled: false,
    invalid: false,
    showSuffix: false,
    suffixText: 'Enter로 등록',
  },
  argTypes: {
    state: { control: 'inline-radio', options: TEXT_INPUT_STATES },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    showSuffix: { control: 'boolean' },
    suffixText: { control: 'text' },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 state, invalid, disabled, suffix를 바꾸고 키보드 포커스를 확인하세요. */
export const Playground: Story = {};

const variants = [
  { name: 'default · empty', state: 'default', invalid: false, disabled: false, value: undefined },
  { name: 'default · has value', state: 'default', invalid: false, disabled: false, value: '입력값' },
  { name: 'focus · empty', state: 'focus', invalid: false, disabled: false, value: undefined },
  { name: 'focus · has value', state: 'focus', invalid: false, disabled: false, value: '입력값' },
  { name: 'default · invalid · empty', state: 'default', invalid: true, disabled: false, value: undefined },
  { name: 'default · invalid · has value', state: 'default', invalid: true, disabled: false, value: '입력값' },
  { name: 'focus · invalid · empty', state: 'focus', invalid: true, disabled: false, value: undefined },
  { name: 'focus · invalid · has value', state: 'focus', invalid: true, disabled: false, value: '입력값' },
  { name: 'disabled · empty', state: 'default', invalid: false, disabled: true, value: undefined },
  { name: 'disabled · has value', state: 'default', invalid: false, disabled: true, value: '입력값' },
] as const;

const galleryStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 360px))',
  gap: '24px 40px',
  maxWidth: 760,
} as const;

const itemStyle = { display: 'grid', gap: 8 } as const;
const labelStyle = { color: 'var(--foreground-tertiary)', fontSize: 12 } as const;

/** Figma에 표시된 10개 조합을 한 화면에서 비교합니다. */
export const Variants: Story = {
  render: () => (
    <div style={galleryStyle}>
      {variants.map(({ name, ...props }) => (
        <div key={name} style={itemStyle}>
          <span style={labelStyle}>{name}</span>
          <TextInput aria-label={name} {...props} />
        </div>
      ))}
    </div>
  ),
};

export const WithSuffix: Story = {
  args: { showSuffix: true, value: '입력값' },
};
