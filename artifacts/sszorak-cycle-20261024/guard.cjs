// 범위 검사: 이번 작업은 오프닝·단일 반복만 고친다. patches/orig/<ID>.json(고치기 전)과 지금 KB 정본을 비교해
// 범위 밖(광역 탭·광역 타임라인·탱사이클·견본·기본 영웅 탭·영상·출처·상단 opener/priority)이 바뀌었는지,
// 포식 오프닝 첫 두 단계(영혼 제물 → 흡수)가 그대로인지 본다.
// 사용: node guard.cjs [가이드 ID ...]
const fs = require('node:fs');
const path = require('node:path');
const {kbGuidePath} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const ORIG = path.join(__dirname, 'patches', 'orig');
const FIXED_KEYS = ['talentBuilds', 'defaultHeroBranchIndex', 'video', 'sources', 'opener', 'priority', 'id', 'book'];
const s = v => JSON.stringify(v);
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(ORIG).map(f => f.replace(/\.json$/, ''));
let bad = 0;
for (const id of ids) {
  const a = JSON.parse(fs.readFileSync(path.join(ORIG, id + '.json'), 'utf8'));
  const b = JSON.parse(fs.readFileSync(kbGuidePath(id).file, 'utf8'));
  const out = [];
  for (const k of FIXED_KEYS) if (s(a[k]) !== s(b[k])) out.push(`최상위 ${k} 바뀜`);
  const changedTop = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => s(a[k]) !== s(b[k]));
  for (const k of changedTop) if (!['blocks', 'heroBranches', 'evidence'].includes(k) && !FIXED_KEYS.includes(k)) out.push(`최상위 ${k} 바뀜(확인 필요)`);
  if ((a.heroBranches || []).length !== (b.heroBranches || []).length) out.push('영웅 탭 수 바뀜');
  (a.heroBranches || []).forEach((h, i) => {
    const n = b.heroBranches[i];
    if (h.label !== n?.label) out.push(`영웅 탭 ${i} 이름 바뀜`);
    for (const k of ['aoe', 'tankRaid', 'tankMythic', 'skillIds']) if (s(h[k]) !== s(n?.[k])) out.push(`${h.label}.${k} 바뀜`);
  });
  if ((a.blocks || []).length !== (b.blocks || []).length) out.push('장 수 바뀜');
  (a.blocks || []).forEach((blk, i) => {
    const n = b.blocks[i];
    if (blk.title !== n?.title) out.push(`장 ${i} 제목 바뀜`);
    const ta = [].concat(blk.timeline || []), tb = [].concat(n?.timeline || []);
    ta.forEach((t, j) => {
      const isAoe = /광역/.test(t.title) && !/단일|오프닝/.test(t.title);
      if ((isAoe || t.kind === 'tank') && s(t) !== s(tb[j])) out.push(`장 ${i} 광역·탱 타임라인 "${t.title}" 바뀜`);
    });
    for (const k of ['tips', 'quotes', 'sources']) if (s(blk[k]) !== s(n?.[k])) out.push(`장 ${i} ${k} 바뀜`);
  });
  if (id === 'demonhunter-devourer') {
    for (const h of b.heroBranches) {
      const st = h.opener?.steps || [];
      if (String(st[0]?.skillId) !== '1241937' || String(st[1]?.skillId) !== '473662') out.push(`${h.label} 오프닝 첫 두 단계가 영혼 제물 → 흡수가 아님`);
    }
  }
  const ev = (b.evidence || []).filter(x => x.startsWith('단일 딜사이클 스조라크 대조'));
  if (ev.length !== 1) out.push(`evidence '단일 딜사이클 스조라크 대조' ${ev.length}개`);
  if ((b.evidence || []).filter(x => x.startsWith('딜사이클 순서 대조')).length !== (a.evidence || []).filter(x => x.startsWith('딜사이클 순서 대조')).length) out.push('예전 딜사이클 순서 대조 기록이 사라짐');
  if (out.length) bad++;
  console.log(`${id}: ${out.length ? out.join(' / ') : '범위 안'}`);
}
if (bad) process.exitCode = 1;
