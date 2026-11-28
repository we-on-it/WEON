import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Avatar, AVATAR_SIZES, AVATAR_STATES, AVATAR_TYPES } from './Avatar';

/** 스토리용 샘플 사진 (외부 요청 없이 보이도록 인라인 SVG) */
const SAMPLE_PHOTO = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9CC9F5"/><stop offset="1" stop-color="#4691E8"/></linearGradient></defs>
    <rect width="96" height="96" fill="url(#g)"/>
    <circle cx="48" cy="38" r="17" fill="#F4E1D2"/>
    <path d="M14 96c4-22 18-32 34-32s30 10 34 32z" fill="#2D333D"/>
  </svg>`,
)}`;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'Figma Avatar 컴포넌트. src가 있으면 사진, 없으면 이니셜을 보여주고, 선택 필터에서는 state로 선택·흐림을 표시합니다.',
      },
    },
  },
  args: {
    initial: '한',
    size: 'large',
    state: 'default',
  },
  argTypes: {
    size: { control: 'inline-radio', options: AVATAR_SIZES },
    type: { control: 'inline-radio', options: [undefined, ...AVATAR_TYPES] },
    state: { control: 'inline-radio', options: AVATAR_STATES },
    initial: { control: 'text' },
    src: { control: 'text' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 모든 prop을 바꿔볼 수 있어요. src에 이미지 주소를 넣으면 사진으로 바뀌어요 */
export const Playground: Story = {};

/** src가 있으면 type을 주지 않아도 image로 보여요 */
export const WithImage: Story = {
  args: { src: SAMPLE_PHOTO, 'aria-label': '한서윤' } as never,
};

const label: CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  whiteSpace: 'nowrap',
};

const grid = (cols: number): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `140px repeat(${cols}, 80px)`,
  gap: '16px',
  alignItems: 'center',
  justifyItems: 'start',
});

/** size × type × state 12개 조합 (Figma variant 표와 같은 배치) */
export const AllCombinations: Story = {
  parameters: { controls: { include: ['initial'] } },
  render: ({ initial }) => (
    <div style={grid(AVATAR_STATES.length)}>
      <span />
      {AVATAR_STATES.map((state) => (
        <span key={state} style={label}>
          {state}
        </span>
      ))}
      {AVATAR_SIZES.flatMap((size) =>
        AVATAR_TYPES.map((type) => (
          <div key={`${size}-${type}`} style={{ display: 'contents' }}>
            <span style={label}>
              {size} · {type}
            </span>
            {AVATAR_STATES.map((state) => (
              <Avatar
                key={state}
                size={size}
                state={state}
                initial={initial}
                src={type === 'image' ? SAMPLE_PHOTO : undefined}
              />
            ))}
          </div>
        )),
      )}
    </div>
  ),
};

const MEMBERS = [
  { id: 'u1', name: '한서윤', src: SAMPLE_PHOTO },
  { id: 'u2', name: '박지유' },
  { id: 'u3', name: '이하린' },
  { id: 'u4', name: '최수아' },
  { id: 'u5', name: '정예린' },
] as const;

const resetButton: CSSProperties = {
  display: 'inline-flex',
  padding: 0,
  margin: 0,
  border: 'none',
  borderRadius: 999,
  background: 'none',
  cursor: 'pointer',
};

/**
 * 실제 사용 예시: 멤버 필터.
 * 한 명을 누르면 그 사람은 selected, 나머지는 dimmed. 같은 사람을 다시 누르면 선택이 풀려 전부 default로 돌아가요
 */
export const MemberFilter: Story = {
  parameters: { controls: { include: ['size'] } },
  render: function Render({ size }) {
    const [selectedId, setSelectedId] = useState<string | null>('u2');
    return (
      <div role="group" aria-label="멤버 필터" style={{ display: 'flex', gap: 8 }}>
        {MEMBERS.map((member) => {
          const selected = selectedId === member.id;
          return (
            <button
              key={member.id}
              type="button"
              aria-pressed={selected}
              aria-label={member.name}
              title={member.name}
              style={resetButton}
              onClick={() => setSelectedId(selected ? null : member.id)}
            >
              <Avatar
                size={size}
                initial={member.name[0]}
                src={'src' in member ? member.src : undefined}
                state={selectedId === null ? 'default' : selected ? 'selected' : 'dimmed'}
              />
            </button>
          );
        })}
      </div>
    );
  },
};
