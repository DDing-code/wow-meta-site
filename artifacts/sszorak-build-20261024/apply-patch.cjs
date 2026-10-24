// 단일 딜사이클 스조라크 빌드 기준(2026-10-24 2차) 수정 반영.
// patches/<가이드 ID>.cjs 의 apply(m) 를 이번 작업 시작 때의 정본(patches/orig/<ID>.json, 첫 실행 때 저장)에 적용하고,
// 아래를 자동으로 더해 KB 정본(Meta/guide-12.1.json)과 사이트 원고(src/data/manuscripts/<ID>.js)를 같은 객체로 바꾼다.
//   - 기본 영웅 탭: decisions.json 의 defaultHeroBranchIndex
//   - 단일 특성 견본(single-target): 스조라크 상위 기록 대표 빌드(build-diff.json + 계산기 확인 calc-sszorak.json)
//     지난 단일 견본과 같은 코드를 쓰던 레이드 견본의 "같은 견본" 설명을 고친다(레이드 견본 코드는 그대로).
//   - 기준 영웅 탭의 오프닝·단일 탭에 단일 견본 링크(talentBuildId: 'single-target')
//   - 화면에 안 나오는 상단 opener 가 기본 영웅 탭 오프닝과 같았으면 새 기본 탭 오프닝으로 맞춘다(검사기 규칙)
//   - 딜사이클 skillId 가 kb-skills.json 에 있는지, count(반복 횟수)가 3·'2~3' 꼴인지 검사한다.
//   - 바뀐 줄을 patches/<ID>.diff.md 로, patch.changelog 를 KB Meta/patch-changelog.md 끝에 남긴다.
// 사용: node apply-patch.cjs <가이드 ID> [...] [--dry]
//
// patches/<ID>.cjs 형식
// module.exports = {
//   evidenceNote: '단일 딜사이클 스조라크 빌드 기준(2026-10-24): …',   // evidence 배열에 추가(같은 머리말이면 교체)
//   buildNote: '…',            // (선택) 단일 견본 설명 끝에 붙일 한두 문장(예: 영혼 소집·천체의 정렬을 고른 빌드)
//   changelog: '…마크다운 본문…',
//   apply(m) { …m 을 고친다…; return m; },
// };
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const SITE = 'C:/wowmeta/site';
const {manuscriptFile, kbGuidePath, replaceManuscript} = require(SITE + '/artifacts/book-rebuild/lib.cjs');
const {fixDeep} = require(SITE + '/artifacts/mm-concept-sample/terms.cjs');
const {D} = require(SITE + '/artifacts/meta-followup-20261020/encode-talents.cjs');
const kb = require(SITE + '/src/data/kb-skills.json').skills;
const decisions = require('./decisions.json');
const diffs = require('./build-diff.json');
const dominant = require('./dominant.json');
const calc = require('./calc-sszorak.json');
const P = path.join(__dirname, 'patches');
const ORIG = path.join(P, 'orig');
const HEAD = '## 2026-10-24 · 단일 딜사이클 스조라크 빌드 기준 (스조라크 신화 12.1.5 상위 기록의 영웅 특성·특성 견본·반복 횟수)';
const EV = '단일 딜사이클 스조라크 빌드 기준';
const MODES = ['opener', 'singleTarget', 'aoe', 'tankRaid', 'tankMythic'];
const isCount = c => { const m = String(c).match(/^(\d+)(?:~(\d+))?$/); return !!m && Number(m[1]) >= 2 && (!m[2] || Number(m[2]) > Number(m[1])); };

function rotationRows(m) {
  const out = [];
  (m.blocks || []).forEach((b, i) => {
    [].concat(b.timeline || []).forEach(t => (t.rails || []).forEach(r => (r.nodes || []).forEach(n => {
      out.push([`blocks[${i}] ${t.title} / ${r.label}`, n]);
      if (n.above) out.push([`blocks[${i}] ${t.title} / ${r.label} (위)`, n.above]);
    })));
  });
  (m.heroBranches || []).forEach(h => MODES.forEach(k => {
    const mode = h[k];
    if (!mode) return;
    [...(mode.steps || []), ...(mode.priority || [])].forEach(s => out.push([`${h.label}.${k}`, s]));
  }));
  return out;
}

function summary(m) {
  const name = id => `${kb[String(id)]?.name || '?'}(${id})`;
  const cnt = n => (n.count ? ` ×${n.count}` : '');
  const L = [];
  L.push(`### 기본 영웅 탭: [${m.defaultHeroBranchIndex || 0}] ${m.heroBranches[m.defaultHeroBranchIndex || 0]?.label}`);
  (m.talentBuilds || []).forEach(b => L.push(`- 견본 ${b.id} (${b.heroLabel}): ${b.code.slice(0, 24)}… — ${b.note}`));
  (m.blocks || []).forEach((b, i) => {
    [].concat(b.timeline || []).forEach(t => {
      L.push(`### blocks[${i}] ${b.title} — ${t.title}`);
      (t.rails || []).forEach(r => {
        L.push(`- ${r.label}${r.loop ? ' (반복)' : ''}: ${(r.nodes || []).map(n => name(n.skillId) + cnt(n) + (n.caption ? `[${n.caption}]` : '') + (n.above ? `{위 ${name(n.above.skillId)} ${n.above.when || ''}}` : '')).join(' → ')}`);
        if (r.note) L.push(`  - note: ${r.note}`);
      });
    });
  });
  (m.heroBranches || []).forEach(h => {
    L.push(`### ${h.label} — summary: ${h.summary}`);
    MODES.forEach(k => {
      const mode = h[k];
      if (!mode) return;
      L.push(`### ${h.label}.${k}${mode.tabLabel ? ' [' + mode.tabLabel + ']' : ''}${mode.talentBuildId ? ' {견본 ' + mode.talentBuildId + '}' : ''} — ${mode.title}`);
      L.push(`- summary: ${mode.summary}`);
      [...(mode.steps || []), ...(mode.priority || [])].forEach((s, i) => L.push(`  ${i + 1}. ${name(s.skillId)}${cnt(s)} [${s.label || ''}] — ${s.note || ''}${s.phase ? ' / ' + s.phase : ''}${s.trigger ? ' / ' + s.trigger : ''}`));
    });
  });
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

// 새 단일 견본: 스조라크 상위 기록 대표 빌드
function singleBuild(id, prev, buildNote) {
  const diff = diffs.find(d => d.id === id);
  const dom = dominant.find(d => d.id === id);
  const code = diff.best.code;
  const check = D.check(code, D.decode(code).spec);
  if (!check.ok || check.decoded.hero !== dom.heroTreeId) throw new Error(`${id}: 새 견본 코드 검사 실패 ${JSON.stringify(check.problems)}`);
  const browser = diff.same ? prev.validation?.browser : calc.find(c => c.code === code);
  if (!diff.same && !browser?.ok) throw new Error(`${id}: 새 견본이 계산기 확인을 통과하지 못함`);
  const date = diff.best.startedAt.slice(0, 10);
  const where = diff.best.scope === 'KR' ? `한국 ${diff.best.rank}위` : `전체 ${diff.best.rank}위`;
  const rowsText = `전 지역 ${dom.all[dom.hero]}행${dom.kr[dom.hero] ? `·한국 ${dom.kr[dom.hero]}행` : ''}`;
  const base = `단일 네임드 전투용 견본입니다. 12.1.5 이후 신화 스조라크 상위 랭킹의 ${dom.hero} 기록(${rowsText})에서 특성이 가장 많이 겹친 실제 빌드를 골랐습니다(${where} 기록).`;
  return {
    ...prev,
    code,
    url: 'https://www.wowhead.com/ko/talent-calc/blizzard/' + code,
    sourceUrl: diff.best.url,
    sourceLabel: `WCL 12.1.5 이후 신화 스조라크 상위 ${dom.hero} 대표 빌드(${where}, ${date})`,
    checkedAt: '2026-10-24',
    note: [base, buildNote].filter(Boolean).join(' '),
    validation: {
      ...(prev.validation || {}),
      specId: check.decoded.spec,
      heroTreeId: check.decoded.hero,
      points: check.decoded.points,
      checkedAt: '2026-10-24',
      browser: diff.same ? prev.validation.browser : {
        checkedAt: browser.checkedAt.slice(0, 10),
        points: browser.points,
        parentConnections: browser.grids.every(g => !g.orphaned.length),
        available: browser.grids.every(g => !g.unavailable.length),
        sha256: crypto.createHash('sha256').update(code).digest('hex'),
      },
      scope: '12.1.5 신화 스조라크 상위 로그 특성으로 만든 코드. SimC midnight(5537d881, 12.1.5.70448) 전문화·노드·랭크·포인트 문턱과 한국어 Wowhead 계산기 포인트·선택 가능 여부·부모 연결 확인.',
    },
    heroLabel: dom.hero,
  };
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
  const dec = decisions[id];
  const dom = dominant.find(d => d.id === id);
  // 기본 영웅 탭
  const origDefault = original.defaultHeroBranchIndex || 0;
  next.defaultHeroBranchIndex = dec.defaultHeroBranchIndex;
  if (!next.defaultHeroBranchIndex && original.defaultHeroBranchIndex === undefined) delete next.defaultHeroBranchIndex;
  if (next.heroBranches[dec.defaultHeroBranchIndex]?.label !== dom.hero) throw new Error(`${id}: 기본 영웅 탭이 ${dom.hero} 가 아님`);
  // 단일 견본 + 레이드 견본 설명
  const prevSingle = original.talentBuilds.find(b => b.id === 'single-target');
  const newSingle = singleBuild(id, prevSingle, patch.buildNote);
  next.talentBuilds = next.talentBuilds.map(b => {
    if (b.id === 'single-target') return newSingle;
    if (b.id === 'raid' && b.code === prevSingle.code && b.code !== newSingle.code && /단일 네임드용과 일반 레이드용으로 같은 .{0,8}견본을 사용합니다\./.test(b.note)) {
      return {...b, note: b.note.replace(/현재 원문에서 단일 네임드용과 일반 레이드용으로 같은 .{0,8}견본을 사용합니다\./, '레이드 견본입니다(지난 단일 견본과 같은 코드). 단일 네임드는 스조라크 상위 기록으로 만든 단일 견본을 쓰세요.')};
    }
    return b;
  });
  // 기준 영웅 탭의 오프닝·단일에 단일 견본 링크
  next.heroBranches.forEach(h => ['opener', 'singleTarget'].forEach(k => {
    if (!h[k]) return;
    if (h.label === dom.hero) h[k] = {...h[k], talentBuildId: 'single-target'};
    else if (h[k].talentBuildId === 'single-target') { const {talentBuildId, ...rest} = h[k]; h[k] = rest; }
  }));
  // 상단 opener(화면에 안 나옴) = 기본 영웅 탭 오프닝이던 가이드는 계속 같게
  if (JSON.stringify(original.opener) === JSON.stringify(original.heroBranches[origDefault]?.opener)) next.opener = JSON.parse(JSON.stringify(next.heroBranches[dec.defaultHeroBranchIndex].opener));
  // 통합 단계: 화면 상단 글(먼저 기억할 것·요약·주의·부 요약)을 새 기준에 맞춘다(toplevel.cjs)
  delete require.cache[require.resolve('./toplevel.cjs')];
  const top = require('./toplevel.cjs')[id];
  if (top) top(next);
  // 게시 검수 기록(logReview.publicationReview.choice)은 3부 본문의 선택 조건 문단과 같은 문장이어야 한다(validate-guide-publication).
  // 작업자가 그 문단을 고쳤으면 기록도 새 문단으로 따라간다.
  const review = next.logReview?.publicationReview;
  if (review?.choice) {
    original.blocks.forEach((b, i) => (b.paragraphs || []).forEach((para, j) => {
      if (para === original.logReview.publicationReview.choice && next.blocks[i]?.paragraphs?.[j] && next.blocks[i].paragraphs[j] !== para) review.choice = next.blocks[i].paragraphs[j];
    }));
  }
  if (review?.evidence && !review.evidence.includes('2026-10-24') && newSingle.code !== prevSingle.code) {
    review.evidence += ` 2026-10-24에 단일 견본만 신화 스조라크 상위 ${dom.hero} 기록(전 지역 ${dom.all[dom.hero]}행)에서 고른 대표 빌드로 바꿨습니다.`;
  }
  if (patch.evidenceNote) {
    if (!patch.evidenceNote.startsWith(EV)) throw new Error(`${id}: evidenceNote 는 '${EV}' 로 시작해야 함`);
    next.evidence = [...(next.evidence || []).filter(x => !x.startsWith(EV)), patch.evidenceNote];
  }
  next = plainTerms(fixDeep(next), original);
  const rows = rotationRows(next);
  const missing = rows.filter(([, n]) => !kb[String(n.skillId)]);
  if (missing.length) throw new Error(`${id}: kb-skills.json 에 없는 skillId — ${missing.map(([w, n]) => `${n.skillId} @ ${w}`).join(', ')}`);
  const badCount = rows.filter(([, n]) => n.count != null && !isCount(n.count));
  if (badCount.length) throw new Error(`${id}: count 는 3 또는 '2~3' 꼴(2 이상) — ${badCount.map(([w, n]) => `${n.count} @ ${w}`).join(', ')}`);
  const before = summary(original), after = summary(next);
  const bs = new Set(before), as = new Set(after);
  const diff = ['# ' + id + ' 단일 딜사이클 스조라크 빌드 기준 변경', '', '## 바뀐 줄 (전 → 후)', '### 빠진 줄', ...before.filter(l => !as.has(l)).map(l => '- ' + l.replace(/^- /, '')), '### 새 줄', ...after.filter(l => !bs.has(l)).map(l => '+ ' + l.replace(/^- /, '')), '', '## 바뀐 뒤 전체', ...after];
  const changed = JSON.stringify(original) !== JSON.stringify(next);
  const counts = `빠진 줄 ${before.filter(l => !as.has(l)).length}, 새 줄 ${after.filter(l => !bs.has(l)).length}`;
  if (dry) { console.log(`${id}: dry — 바뀜 ${changed}, ${counts}`); return; }
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
  console.log(`${id}: 반영 — 바뀜 ${changed}, ${counts}`);
}

const dry = process.argv.includes('--dry');
for (const id of process.argv.slice(2).filter(a => !a.startsWith('--'))) apply(id, dry);
