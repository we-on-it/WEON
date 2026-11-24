import type { SVGProps } from 'react';
import { ICON_MARKUP, pickSource, type FillableIconName, type IconName } from './icons';

type BaseProps = Omit<SVGProps<SVGSVGElement>, 'fill' | 'name' | 'children'> & {
  /** 표시 크기(px). 기본 24. 22 미만이면 16px 원본, 22 이상이면 24px 원본을 사용 */
  size?: 16 | 24 | number;
  /** 스크린리더용 이름. 없으면 장식용으로 보고 aria-hidden 처리 */
  title?: string;
};

export type IconProps = BaseProps &
  (
    | { name: FillableIconName; /** 채움 버전 */ fill?: boolean }
    | { name: Exclude<IconName, FillableIconName>; fill?: never }
  );

/**
 * Figma `Icon/*` 아이콘. 색은 `color`(currentColor)로 지정합니다.
 * 규칙: 표시 크기 22px 미만은 16px 원본, 22px 이상은 24px 원본을 늘리거나 줄여 씁니다.
 */
export function Icon({ name, fill = false, size = 24, title, ...rest }: IconProps) {
  const source = pickSource(size);
  const markup = ICON_MARKUP[source][fill ? `${name}-fill` : name];

  if (markup === undefined && import.meta.env.DEV) {
    console.warn(`[Icon] "${name}${fill ? '-fill' : ''}" 아이콘이 없습니다.`);
  }

  const a11y = title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': true as const, focusable: 'false' as const };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${source} ${source}`}
      fill="none"
      {...a11y}
      {...rest}
      dangerouslySetInnerHTML={{ __html: markup ?? '' }}
    />
  );
}

export default Icon;
