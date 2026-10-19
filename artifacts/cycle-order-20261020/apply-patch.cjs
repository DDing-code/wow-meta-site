// 딜사이클 순서 수정 반영: patches/<가이드 ID>.cjs 의 apply(m) 를 원래 정본에 적용해
// KB 정본(Meta/guide-12.1.json)과 사이트 원고(src/data/manuscripts/<ID>.js)를 같은 객체로 바꾼다.
//   - 항상 처음 정본(patches/orig/<ID>.json, 첫 실행 때 저장)에 적용하므로 여러 번 돌려도 결과가 같다.
//   - 딜사이클 구조 안의 skillId 가 kb-skills.json 에 있는지 검사한다(없으면 중단 — KB 노트부터 추가).
//   - 바뀐 순서를 patches/<ID>.diff.md 로 남기고, patch.changelog 를 KB Meta/patch-changelog.md 끝에 붙인다.
// 사용: node apply-patch.cjs <가이드 ID> [...] [--dry]
//
// patches/<ID>.cjs 형식
// module.exports = {
//   evidenceNote: '딜사이클 순서 대조(2026-10-20): …',   // evidence 배열에 추가(같은 머리말이면 교체)
//   changelog: '…마크다운 본문…',                        // KB patch-changelog.md 에 "## 2026-10-20 · 딜사이클 순서 대조" 절로 붙임
//   apply(m) { …m 을 고친다…; return m; },
// };
const fs = require('node:fs');
const path = require('node:path');
const SITE = 'C:/wowmeta/site';
const {manuscriptFile, kbGuidePath, replaceManuscript} = require(SITE + '/artifacts/book-rebuild/lib.cjs');
const {fixDeep} = require(SITE + '/artifacts/mm-concept-sample/terms.cjs');
const kb = require(SITE + '/src/data/kb-skills.json').skills;
const P = path.join(__dirname, 'patches');
const ORIG = path.join(P, 'orig');
const HEAD = '## 2026-10-20 · 딜사이클 순서 대조 (12.1.5 상위 로그·심크 APL)';
const MODES = ['opener', 'singleTarget', 'aoe', 'tankRaid', 'tankMythic'];

function rotationIds(m) {
  const out = [];
  (m.blocks || []).forEach((b, i) => {
    const tls = Array.isArray(b.timeline) ? b.timeline : b.timeline ? [b.timeline] : [];
    tls.forEach(t => (t.rails || []).forEach(r => (r.nodes || []).forEach(n => {
      out.push([`blocks[${i}] ${t.title} / ${r.label}`, n.skillId]);
      if (n.above) out.push([`blocks[${i}] ${t.title} / ${r.label} (위)`, n.above.skillId]);
    })));
  });
  (m.heroBranches || []).forEach(h => MODES.forEach(k => {
    const mode = h[k];
    if (!mode) return;
    [...(mode.steps || []), ...(mode.priority || [])].forEach(s => out.push([`${h.label}.${k}`, s.skillId]));
  }));
  return out;
}

function summary(m) {
  const name = id => `${kb[String(id)]?.name || '?'}(${id})`;
  const L = [];
  (m.blocks || []).forEach((b, i) => {
    const tls = Array.isArray(b.timeline) ? b.timeline : b.timeline ? [b.timeline] : [];
    tls.forEach(t => {
      L.push(`### blocks[${i}] ${b.title} — ${t.title}${t.kind ? ' kind=' + t.kind : ''}`);
      (t.rails || []).forEach(r => {
        L.push(`- ${r.label}${r.loop ? ' (반복)' : ''}: ${(r.nodes || []).map(n => name(n.skillId) + (n.caption ? `[${n.caption}]` : '') + (n.above ? `{위 ${name(n.above.skillId)} ${n.above.when || ''}}` : '')).join(' → ')}`);
        if (r.note) L.push(`  - note: ${r.note}`);
      });
    });
  });
  (m.heroBranches || []).forEach(h => MODES.forEach(k => {
    const mode = h[k];
    if (!mode) return;
    L.push(`### ${h.label}.${k}${mode.tabLabel ? ' [' + mode.tabLabel + ']' : ''} — ${mode.title}`);
    L.push(`- summary: ${mode.summary}`);
    [...(mode.steps || []), ...(mode.priority || [])].forEach((s, i) => L.push(`  ${i + 1}. ${name(s.skillId)} — ${s.note || ''}${s.trigger ? ' / ' + s.trigger : ''}`));
  }));
  return L;
}


// 이번에 새로 쓴 독자용 문장에서 영어 약어 APL을 '심크 우선순위'로 바꾼다(조사도 받침 없는 말에 맞춘다).
// 근거·출처·로그 검토 필드와 원래 있던 문장은 건드리지 않는다.
const SKIP_KEYS = new Set(['evidence', 'sources', 'logReview', 'sourceStatus', 'sourceNote', 'talentBuilds']);
const PLAIN = [
  [/심크 APL/g, 'APL'],
  [/APL(\([^)]*\))?은/g, '심크 우선순위$1는'],
  [/APL(\([^)]*\))?과/g, '심크 우선순위$1와'],
  [/APL(\([^)]*\))?이 /g, '심크 우선순위$1가 '],
  [/APL(\([^)]*\))?을/g, '심크 우선순위$1를'],
  [/APL(\([^)]*\))?으로/g, '심크 우선순위$1로'],
  [/\(APL\)/g, '(심크 우선순위)'],
  [/APL/g, '심크 우선순위'],
];
function plainTerms(next, original) {
  const old = new Set();
  const collect = v => { if (typeof v === 'string') old.add(v); else if (Array.isArray(v)) v.forEach(collect); else if (v && typeof v === 'object') Object.values(v).forEach(collect); };
  collect(original);
  const walk = (v, key) => {
    if (SKIP_KEYS.has(key)) return v;
    if (typeof v === 'string') return old.has(v) || !/APL/.test(v) ? v : PLAIN.reduce((t, [a, b]) => t.replace(a, b), v);
    if (Array.isArray(v)) return v.map(x => walk(x, key));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, k)]));
    return v;
  };
  return walk(next, '');
}

function apply(id, dry) {
  const {file} = kbGuidePath(id);
  fs.mkdirSync(ORIG, {recursive: true});
  const origFile = path.join(ORIG, id + '.json');
  if (!fs.existsSync(origFile)) fs.copyFileSync(file, origFile);
  const original = JSON.parse(fs.readFileSync(origFile, 'utf8'));
  const patchFile = path.join(P, id + '.cjs');
  delete require.cache[require.resolve(patchFile)];
  const patch = require(patchFile);
  let next = patch.apply(JSON.parse(JSON.stringify(original))) || null;
  if (!next) throw new Error(`${id}: apply(m) 가 객체를 돌려주지 않음`);
  if (patch.evidenceNote) {
    next.evidence = [...(next.evidence || []).filter(x => !x.startsWith('딜사이클 순서 대조')), patch.evidenceNote];
  }
  next = plainTerms(fixDeep(next), original);
  const missing = rotationIds(next).filter(([, sid]) => !kb[String(sid)]);
  if (missing.length) throw new Error(`${id}: kb-skills.json 에 없는 skillId — ${missing.map(([w, s]) => `${s} @ ${w}`).join(', ')}`);
  const before = summary(original), after = summary(next);
  const diff = ['# ' + id + ' 딜사이클 변경', '', '## 바뀐 줄 (전 → 후)'];
  const bs = new Set(before), as = new Set(after);
  diff.push('### 빠진 줄', ...before.filter(l => !as.has(l)).map(l => '- ' + l.replace(/^- /, '')));
  diff.push('### 새 줄', ...after.filter(l => !bs.has(l)).map(l => '+ ' + l.replace(/^- /, '')));
  diff.push('', '## 바뀐 뒤 전체', ...after);
  const changed = JSON.stringify(original) !== JSON.stringify(next);
  if (dry) { console.log(`${id}: dry — 바뀜 ${changed}, 빠진 줄 ${before.filter(l => !as.has(l)).length}, 새 줄 ${after.filter(l => !bs.has(l)).length}`); return; }
  fs.writeFileSync(path.join(P, id + '.diff.md'), diff.join('\n') + '\n');
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + '\n');
  const target = manuscriptFile(id);
  fs.writeFileSync(target, replaceManuscript(fs.readFileSync(target, 'utf8'), id, next));
  if (patch.changelog) {
    const log = path.join(path.dirname(file), 'patch-changelog.md');
    let text = fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : `# 변경 기록\n`;
    const at = text.indexOf(HEAD);
    if (at >= 0) {
      const nextHead = text.indexOf('\n## ', at + HEAD.length);
      text = text.slice(0, at).replace(/\n+$/, '\n') + (nextHead >= 0 ? text.slice(nextHead + 1) : '');
    }
    text = text.replace(/\n*$/, '\n\n') + HEAD + '\n\n' + patch.changelog.trim() + '\n';
    fs.writeFileSync(log, text);
  }
  console.log(`${id}: 반영 — 바뀜 ${changed}, 빠진 줄 ${before.filter(l => !as.has(l)).length}, 새 줄 ${after.filter(l => !bs.has(l)).length}`);
}

const dry = process.argv.includes('--dry');
for (const id of process.argv.slice(2).filter(a => !a.startsWith('--'))) apply(id, dry);
