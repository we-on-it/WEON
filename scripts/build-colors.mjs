// Figma 토큰(JSON) → src/styles/colors.css
//   - figma-variables.tokens.json : Figma 변수 export (색상 팔레트·semantic)
//   - figma-styles.tokens.json    : Figma 스타일 수동 정리 (그라디언트·그림자 — 변수 export에 없음)
// 사용: JSON을 갱신한 뒤 npm run tokens
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const read = (p) => JSON.parse(readFileSync(fileURLToPath(new URL(p, root)), 'utf8'));
const out = fileURLToPath(new URL('src/styles/colors.css', root));

const SOURCES = [
  read('src/styles/tokens/figma-variables.tokens.json'),
  read('src/styles/tokens/figma-styles.tokens.json'),
];

/** palette.gray.100 → --palette-gray-100 / semantic.fill.brand → --fill-brand / effect.shadow.weak → --shadow-weak */
const varName = (path) => `--${(['semantic', 'effect'].includes(path[0]) ? path.slice(1) : path).join('-')}`;

const ref = (value) => {
  const m = typeof value === 'string' && value.match(/^\{(.+)\}$/);
  return m ? `var(${varName(m[1].split('.'))})` : null;
};

const color = (value) => {
  if (typeof value === 'string') {
    const r = ref(value) ?? (/^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : null);
    if (!r) throw new Error(`알 수 없는 색 값: ${value}`);
    return r;
  }
  const { hex, alpha = 1, components } = value;
  if (alpha >= 1) return hex.toUpperCase();
  const [r, g, b] = components.map((c) => Math.round(c * 255));
  return `rgb(${r} ${g} ${b} / ${+alpha.toFixed(2)})`;
};

const pct = (n) => `${+(n * 100).toFixed(2)}%`;
const px = (n) => (n === 0 ? '0' : `${n}px`);

const FORMAT = {
  color,
  gradient: ({ angle, stops }) =>
    `linear-gradient(${angle}deg, ${stops.map((s) => `${color(s.color)} ${pct(s.position)}`).join(', ')})`,
  shadow: ({ offsetX, offsetY, blur, spread, color: c }) =>
    `${px(offsetX)} ${px(offsetY)} ${px(blur)} ${px(spread)} ${color(c)}`,
};

const sections = new Map();
const walk = (node, path) => {
  if (node && typeof node === 'object' && '$value' in node) {
    const format = FORMAT[node.$type];
    if (!format) throw new Error(`지원하지 않는 타입 ${node.$type}: ${path.join('.')}`);
    const group = path.slice(0, 2).join('/');
    if (!sections.has(group)) sections.set(group, []);
    sections.get(group).push(`  ${varName(path)}: ${format(node.$value)};`);
    return;
  }
  for (const [key, child] of Object.entries(node ?? {})) {
    if (!key.startsWith('$')) walk(child, [...path, key]);
  }
};
SOURCES.forEach((src) => walk(src, []));

// palette → semantic → effect 순서 (같은 그룹은 한데 모음)
const rank = (g) => ['palette', 'semantic', 'effect'].indexOf(g.split('/')[0]);
const groups = [...sections.keys()].sort((a, b) => rank(a) - rank(b));
const body = groups.map((g) => `  /* ${g} */\n${sections.get(g).join('\n')}`).join('\n\n');

writeFileSync(
  out,
  `/* 자동 생성 파일 — 직접 수정하지 마세요.
 * 원본: src/styles/tokens/*.tokens.json (Figma 변수 export + 스타일 수동 정리)
 * 생성: npm run tokens
 */
:root {
${body}
}
`,
);

console.log(`colors.css: ${[...sections.values()].flat().length}개 변수`);
