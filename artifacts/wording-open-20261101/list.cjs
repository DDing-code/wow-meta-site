// '구간을 연다' 계열 표현이 든 원고 칸을 경로와 함께 출력한다(2026-11-01 문장 다듬기 대상 찾기).
// 사용: node list.cjs <가이드 ID>
const path = require('node:path');
const SITE = path.resolve(__dirname, '..', '..');
const { loadGuideManuscript } = require(path.join(SITE, 'scripts', 'lib', 'guideManuscripts.cjs'));

const PATTERN = /구간을 ?(열|엽)|구간이 열|구간 열기|피해 구간|[을를] ?(엽니다|열고|열어|여는|열기|열었|연다)|엽니다|(?<![가-힣])열(기|고|어|자|면|린|립|었|려)|(?<![가-힣])여는|구간을 채우는|구간 (초반|안|중)/;

const id = process.argv[2];
if (!id) throw new Error('가이드 ID를 주세요');
const walk = (value, at) => {
  if (Array.isArray(value)) return value.forEach((item, i) => walk(item, `${at}[${i}]`));
  if (value && typeof value === 'object') return Object.entries(value).forEach(([k, v]) => walk(v, `${at}.${k}`));
  if (typeof value === 'string' && PATTERN.test(value)) console.log(`${at}\t${value}`);
};
walk(loadGuideManuscript(id), 'm');
