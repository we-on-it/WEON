import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

/** Figma 타이포 스케일. global.css의 `.typo-*` 클래스와 1:1 대응 */
const STYLES = [
  { figma: 'Heading/Heading1', className: 'typo-heading1', size: 34, weight: 600, lineHeight: '1.4 (47.5px)', letterSpacing: '-0.015em (-0.5px)' },
  { figma: 'Heading/Heading2', className: 'typo-heading2', size: 28, weight: 600, lineHeight: '1.4 (39px)' },
  { figma: 'Heading/Heading3', className: 'typo-heading3', size: 24, weight: 600, lineHeight: '1.4 (33.5px)' },
  { figma: 'Heading/Heading4', className: 'typo-heading4', size: 20, weight: 600, lineHeight: '1.4 (28px)' },
  { figma: 'Title/Title', className: 'typo-title', size: 18, weight: 600, lineHeight: '1.5 (27px)' },
  { figma: 'Body/Body1/Medium', className: 'typo-body1-medium', size: 16, weight: 500, lineHeight: '1.5 (24px)' },
  { figma: 'Body/Body1/SemiBold', className: 'typo-body1-semibold', size: 16, weight: 600, lineHeight: '1.5 (24px)' },
  { figma: 'Body/Body2/Medium', className: 'typo-body2-medium', size: 15, weight: 500, lineHeight: '1.5 (22.5px)' },
  { figma: 'Body/Body2/SemiBold', className: 'typo-body2-semibold', size: 15, weight: 600, lineHeight: '1.5 (22.5px)' },
  { figma: 'Caption/Caption1/Medium', className: 'typo-caption1-medium', size: 13, weight: 500, lineHeight: '1.5 (19.5px)' },
  { figma: 'Caption/Caption1/SemiBold', className: 'typo-caption1-semibold', size: 13, weight: 600, lineHeight: '1.5 (19.5px)' },
  { figma: 'Caption/Caption2/Medium', className: 'typo-caption2-medium', size: 12, weight: 500, lineHeight: '1.5 (18px)' },
  { figma: 'Caption/Caption2/SemiBold', className: 'typo-caption2-semibold', size: 12, weight: 600, lineHeight: '1.5 (18px)' },
] as const;

type TypoClass = (typeof STYLES)[number]['className'];

const toRem = (px: number) => `${px / 16}rem`;

const metaText: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  color: '#6b7280',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

function TypographyScale({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {STYLES.map((s) => (
        <div
          key={s.className}
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gap: 24,
            alignItems: 'baseline',
            padding: '16px 0',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{s.figma}</div>
            <div style={metaText}>.{s.className}</div>
            <div style={metaText}>
              {s.size}px / {toRem(s.size)} · {s.weight}
            </div>
            <div style={metaText}>
              LH {s.lineHeight}
              {'letterSpacing' in s ? ` · LS ${s.letterSpacing}` : ''}
            </div>
          </div>
          <div className={s.className} style={{ minWidth: 0, wordBreak: 'keep-all', overflowWrap: 'anywhere' }}>
            {text}
          </div>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: 'Foundations/Typography',
  component: TypographyScale,
  args: {
    text: 'We’re on it! 우리가 제대로 해내다.',
  },
  argTypes: {
    text: { control: 'text', description: '미리보기 문구' },
  },
} satisfies Meta<typeof TypographyScale>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 전체 타이포 스케일 */
export const Scale: Story = {};

/** 한 스타일을 골라 여러 줄 문단으로 확인 (줄 간격 체크용) */
export const Playground: StoryObj<{ variant: TypoClass; text: string }> = {
  args: {
    variant: 'typo-body1-medium',
    // 줄 간격 확인용으로 여러 줄이 되도록 반복
    text: 'We’re on it! 우리가 제대로 해내다. We’re on it! 우리가 제대로 해내다. We’re on it! 우리가 제대로 해내다.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: STYLES.map((s) => s.className),
      description: '`.typo-*` 클래스',
    },
  },
  render: ({ variant, text }) => (
    <p className={variant} style={{ maxWidth: 360, margin: 0, wordBreak: 'keep-all' }}>
      {text}
    </p>
  ),
};

/** 사용 중인 폰트. 영문은 Google Sans, 한글은 Pretendard로 렌더링됨 */
const FONTS = [
  { label: '영문', family: 'Google Sans', sample: 'We’re on it! Aa Bb Cc 0123456789' },
  { label: '한글', family: 'Pretendard Variable', sample: '우리가 제대로 해내다. 가나다라 0123456789' },
] as const;

function FontFamilies() {
  // global.css의 --font-sans를 그대로 읽어 와서, CSS가 바뀌면 여기도 자동으로 바뀜
  const stack =
    typeof document === 'undefined'
      ? ''
      : getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {FONTS.map((f) => (
        <section key={f.family}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            {f.label} · {f.family.replace(' Variable', '')}
          </div>
          <div style={{ ...metaText, marginBottom: 8 }}>weight 500 (Medium) · 600 (SemiBold)</div>
          {[500, 600].map((w) => (
            <div
              key={w}
              style={{ fontFamily: `"${f.family}"`, fontWeight: w, fontSize: 24, lineHeight: 1.4, wordBreak: 'keep-all' }}
            >
              {f.sample}
            </div>
          ))}
        </section>
      ))}
      <section>
        <div style={{ fontSize: 13, fontWeight: 600 }}>font-family (--font-sans)</div>
        <div style={{ ...metaText, overflowWrap: 'anywhere' }}>{stack}</div>
      </section>
    </div>
  );
}

/** 사용 폰트와 fallback 순서 */
export const FontFamily: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => <FontFamilies />,
};
