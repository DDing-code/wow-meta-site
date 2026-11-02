// 원본 스냅샷(orig/<ID>.json)을 지금 원고에서 affects/talents 만 뺀 것으로 다시 맞춘다.
// 특성 연결을 넣은 뒤 다른 도구(예: 심화편 단추 advancedVideo)가 원고를 고쳤을 때, apply.cjs 를 다시 돌려도 그 변경이 지워지지 않게 한다.
// 사용: node refresh-orig.cjs <가이드 ID>...
const fs = require('node:fs');
const path = require('node:path');
const SITE = path.resolve(__dirname, '..', '..');
const { loadGuideManuscript } = require(path.join(SITE, 'scripts', 'lib', 'guideManuscripts.cjs'));
const strip = value => {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) if (key !== 'affects' && key !== 'talents') out[key] = strip(item);
    return out;
  }
  return value;
};
for (const id of process.argv.slice(2)) {
  fs.writeFileSync(path.join(__dirname, 'orig', `${id}.json`), JSON.stringify(strip(loadGuideManuscript(id)), null, 2) + '\n');
  console.log('orig', id);
}
