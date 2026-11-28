import { useEffect, useState, type HTMLAttributes, type Ref } from 'react';
import styles from './Avatar.module.css';

export const AVATAR_SIZES = ['small', 'large'] as const;
export const AVATAR_TYPES = ['initial', 'image'] as const;
export const AVATAR_STATES = ['default', 'selected', 'dimmed'] as const;

export type AvatarSize = (typeof AVATAR_SIZES)[number];
export type AvatarType = (typeof AVATAR_TYPES)[number];
export type AvatarState = (typeof AVATAR_STATES)[number];

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ref?: Ref<HTMLSpanElement>;
  /** Figma `size`. small 22px(목록·드롭다운·필터) · large 48px(프로필), 테두리 1 · 2px (기본 small) */
  size?: AvatarSize;
  /** Figma `type`. 생략하면 src가 있으면 image, 없으면 initial로 자동 선택돼요. image인데 src가 없거나 이미지를 못 불러오면 initial로 보여요 */
  type?: AvatarType;
  /** Figma `state`. 선택 필터용: 선택된 사람은 selected(테두리 border/focus), 나머지는 dimmed(opacity 40%). 아무도 선택 안 했으면 전부 default (기본 default) */
  state?: AvatarState;
  /** Figma `initial`. 이름 첫 글자. small 12 Medium · large 20 SemiBold */
  initial: string;
  /** 프로필 이미지 주소. 있으면 이니셜 대신 이미지를 보여줘요 */
  src?: string;
};

/**
 * Figma `Avatar` 컴포넌트.
 * 표시용이라 클릭 동작은 없습니다. 선택 필터로 쓸 때는 button으로 감싸세요.
 */
export function Avatar({
  size = 'small',
  type,
  state = 'default',
  initial,
  src,
  className,
  ...rest
}: AvatarProps) {
  // 이미지를 못 불러오면 이니셜로 되돌립니다 (src가 바뀌면 다시 시도)
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  useEffect(() => setFailedSrc(null), [src]);

  const canShowImage = Boolean(src) && failedSrc !== src;
  const resolvedType: AvatarType = (type ?? (src ? 'image' : 'initial')) === 'image' && canShowImage ? 'image' : 'initial';

  const classes = [
    styles.avatar,
    styles[size],
    state !== 'default' && styles[state],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} data-type={resolvedType} {...rest}>
      {resolvedType === 'image' ? (
        <img className={styles.image} src={src} alt="" draggable={false} onError={() => setFailedSrc(src ?? null)} />
      ) : (
        initial
      )}
    </span>
  );
}

export default Avatar;
