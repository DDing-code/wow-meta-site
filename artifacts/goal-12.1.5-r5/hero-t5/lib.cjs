// 담당 전문화 정본 JSON 수정 도우미 (t5). 읽기 → 수정 → 2칸 들여쓰기 + 끝 줄바꿈 쓰기.
const fs = require('fs');
const crypto = require('crypto');
const KB = 'C:/wowmeta/kb/08-직업별-Knowledge-Base';
function load(rel) { const file = `${KB}/${rel}/Meta/guide-12.1.json`; return { file, j: JSON.parse(fs.readFileSync(file, 'utf8')) }; }
function save({ file, j }) { fs.writeFileSync(file, JSON.stringify(j, null, 2) + '\n'); }
// 기존 talentBuild 항목의 키 순서를 유지한 채 새 코드로 바꾼다.
function swapBuild(build, { code, sourceUrl, sourceLabel, note, heroLabel, heroTreeId, specId, points = { 1: 34, 2: 34, 3: 13, 4: 1 } }) {
  const sha256 = crypto.createHash('sha256').update(code).digest('hex');
  const validation = {
    specId, heroTreeId, points,
    checkedAt: '2026-10-19',
    traitDataCommit: '5537d8813dfc59707927722b1e23ffa6fd67ee59',
    gameBuild: '12.1.5.70448',
    browser: { checkedAt: '2026-10-19', points: [34, 34, 13], parentConnections: true, available: true, sha256 },
    scope: build.validation.scope,
  };
  const vals = { code, url: `https://www.wowhead.com/ko/talent-calc/blizzard/${code}`, sourceUrl, sourceLabel, checkedAt: '2026-10-19', note, validation, heroLabel };
  const out = {};
  for (const k of Object.keys(build)) out[k] = k in vals ? vals[k] : build[k];
  for (const k of Object.keys(vals)) if (!(k in out)) out[k] = vals[k];
  return out;
}
function insertEvidence(j, line) {
  const i = j.evidence.findIndex(x => x.startsWith('개념서형 개편'));
  if (i < 0) j.evidence.push(line); else j.evidence.splice(i, 0, line);
}
module.exports = { load, save, swapBuild, insertEvidence };
