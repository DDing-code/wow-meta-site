// 개념서 원고 사실 점검: 새 원고(content.cjs)가 기존 검수 본문·KB 노트·공식 툴팁에 없는 것을 쓰지 않았는지 기계적으로 본다.
// 사용: node artifacts/book-rebuild/factcheck.cjs <가이드 ID> [...]
// 1) 쓴 스킬 ID가 kb-skills.json에 있는가  2) 그 ID가 이 전문화 본문·KB 직업 폴더에 나오는가
// 3) 오프닝 타임라인 순서가 기존 오프닝(heroBranches[].opener 또는 opener) 단계 순서와 같은가
// 4) 숫자(특히 %·초·중첩)가 기존 본문·KB 노트·툴팁 어딘가에 있는가
const fs = require('fs');
const path = require('path');
const { SITE, kbGuidePath, loadContent } = require('./lib.cjs');

const skills = require(path.join(SITE, 'src', 'data', 'kb-skills.json')).skills;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith('.md') || name.endsWith('.json')) out.push(full);
  }
  return out;
}

function strings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach(v => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach(v => strings(v, out));
  return out;
}

function ids(value, out = []) {
  if (Array.isArray(value)) value.forEach(v => ids(v, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'skillId' && v) out.push(String(v));
      else if (k === 'skillIds' && Array.isArray(v)) v.forEach(x => out.push(String(x)));
      else ids(v, out);
    }
  }
  return out;
}

const norm = s => s.replace(/(\d)\s+(%|초|중첩|분|회|번|개|명|미터|m)/g, '$1$2').replace(/,(\d{3})/g, '$1');

let bad = 0;
for (const id of process.argv.slice(2)) {
  const { file } = kbGuidePath(id);
  const original = JSON.parse(fs.readFileSync(file, 'utf8'));
  const content = loadContent(id);
  const specDir = path.dirname(path.dirname(file));
  const classDir = path.dirname(specDir);
  const kbText = walk(classDir).map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const origText = JSON.stringify(original);
  const used = [...new Set(ids(content))];
  const tooltipText = used.map(x => skills[x] ? `${skills[x].description || ''} ${skills[x].resourceCost || ''} ${skills[x].cooldown || ''}` : '').join('\n');
  const corpus = norm(`${origText}\n${kbText}\n${tooltipText}`);
  const issues = [];

  for (const sid of used) {
    if (!skills[sid]) { issues.push(`스킬 ID ${sid}: kb-skills.json에 없음`); continue; }
    if (!origText.includes(`"${sid}"`) && !origText.includes(sid) && !kbText.includes(sid)) {
      issues.push(`스킬 ID ${sid}(${skills[sid].name}): 기존 본문·KB 직업 폴더에 안 나옴(다른 전문화 스킬인지 확인)`);
    }
  }

  // 오프닝 타임라인
  const openers = [original.opener, ...(original.heroBranches || []).map(h => h.opener)].filter(o => o?.steps?.length)
    .map(o => o.steps.map(s => String(s.skillId)).join('>'));
  for (const block of content.blocks) {
    const rails = block.timeline?.rails || [];
    for (const rail of rails) {
      if (!/오프닝/.test(rail.label || '') || rail.kind === 'inserts') continue;
      const seq = (rail.nodes || []).map(n => String(n.skillId)).join('>');
      if (!openers.includes(seq)) issues.push(`오프닝 줄 "${rail.label}" 순서가 기존 오프닝 단계와 다름: ${seq}`);
    }
  }

  // 숫자
  const texts = strings({ ...content, blocks: content.blocks.map(({ part, ...rest }) => rest) });
  const seen = new Set();
  for (const t of texts) {
    const n = norm(t);
    for (const m of n.matchAll(/(\d+(?:\.\d+)?)(%|초|중첩|분|미터|m)?/g)) {
      const [tok, num, unit] = m;
      if (/^20\d\d$/.test(num)) continue; // 연도
      const val = Number(num);
      if (!unit && val <= 10) continue; // 작은 개수는 건너뜀
      if (seen.has(tok)) continue;
      seen.add(tok);
      if (!corpus.includes(tok) && !(unit && corpus.includes(num + ' ' + unit))) {
        const at = t.indexOf(tok.replace(/(\d)(%|초|중첩|분)/, '$1'));
        issues.push(`숫자 "${tok}": 기존 본문·KB·툴팁에서 못 찾음 — …${t.slice(Math.max(0, at - 30), at + 30)}…`);
      }
    }
  }
  console.log(`\n=== ${id}: 스킬 ${used.length}개, 확인 필요 ${issues.length}개`);
  issues.forEach(i => console.log('  - ' + i));
  bad += issues.length;
}
process.exit(bad ? 1 : 0);
