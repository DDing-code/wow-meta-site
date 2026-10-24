// 단일 딜사이클 스조라크 빌드 기준 자료: bd/<가이드 ID>.md
//   1) 스조라크 상위 영웅 특성 분포와 기준 영웅 특성(dominant.json), 기본 영웅 탭 결정(decisions.json)
//   2) 새 단일 견본(build-diff.json)과 지금 견본의 차이, 선택 칸(둘 중 하나 고르는 칸)의 상위 행 선택 수
//   3) 기준 영웅 특성 스조라크 로그의 오프닝·반복 구간 — 같은 스킬을 이어서 누른 것은 ×n 으로 묶는다
//   4) 반복 구간(풀 25초 뒤, 사잇단계 제외)에서 스킬별 '이어서 누른 횟수' 분포
// 사용: node runs.cjs [가이드 ID]
const fs = require('node:fs');
const path = require('node:path');
const SITE = 'C:/wowmeta/site';
const SZ = SITE + '/artifacts/sszorak-cycle-20261024';
const kb = require(SITE + '/src/data/kb-skills.json').skills;
const {D} = require(SITE + '/artifacts/meta-followup-20261020/encode-talents.cjs');
const {loadGuideManuscripts} = require(SITE + '/scripts/lib/guideManuscripts.cjs');
const dominant = require('./dominant.json');
const decisions = require('./decisions.json');
const diffs = require('./build-diff.json');
const judged = require(SZ + '/judged.json');
const OUT = path.join(__dirname, 'bd');
const IGNORE = new Set([1, 6603, 75, 5019]);
const INTER = [[100000, 125000], [227000, 252000]];
const inInter = t => INTER.some(([a, b]) => t >= a && t <= b);
const CLASS = {warrior: 'Warrior', paladin: 'Paladin', deathknight: 'DeathKnight', demonhunter: 'DemonHunter', druid: 'Druid', evoker: 'Evoker', hunter: 'Hunter', mage: 'Mage', monk: 'Monk', priest: 'Priest', rogue: 'Rogue', shaman: 'Shaman', warlock: 'Warlock'};
const IGNORE_NAMES = new Set(['Soul Fragment', 'Melee', 'Auto Shot', 'Shoot']);
// 딜사이클 순서로 보지 않는 것(물약·생존·이동 등은 영어 이름으로만 찍히는 경우가 많아 * 표시로 남긴다)
const kbName = id => kb[String(id)]?.name || null;

function load(id) {
  return fs.readdirSync(SZ + '/events').filter(f => f.startsWith(id + '-')).map(f => JSON.parse(fs.readFileSync(path.join(SZ, 'events', f), 'utf8'))).filter(f => !f.error && f.events?.length);
}
function alias(id, files) {
  const [cls, spec] = id.split('-');
  const map = new Map();
  for (const f of files) for (const ev of f.events) {
    const raw = ev[2];
    if (kb[String(raw)]) continue;
    const name = f.abilityNames?.[raw];
    if (!name) continue;
    if (IGNORE_NAMES.has(name)) { ev[2] = 1; continue; }
    if (!map.has(raw)) {
      const cands = Object.values(kb).filter(k => k.class === CLASS[cls] && k.englishName === name);
      cands.sort((a, b) => ((a.specs || []).some(x => x.toLowerCase().replace(/\s/g, '') === spec) ? 0 : 1) - ((b.specs || []).some(x => x.toLowerCase().replace(/\s/g, '') === spec) ? 0 : 1));
      map.set(raw, cands[0] ? Number(cands[0].id) : null);
    }
    if (map.get(raw)) ev[2] = map.get(raw);
  }
}
function presses(file) {
  const out = [], open = new Map();
  for (const [t, type, id] of file.events) {
    if (IGNORE.has(id)) continue;
    if (type === 'b') { const p = {t, id, begin: true, done: false}; out.push(p); open.set(id, p); continue; }
    const o = open.get(id);
    if (o && !o.done && t - o.t < 12000) { o.done = true; open.delete(id); continue; }
    out.push({t, id, done: true});
  }
  const kept = out.filter(p => !p.begin || p.done).sort((a, b) => a.t - b.t);
  const res = [];
  for (const p of kept) { const prev = res[res.length - 1]; if (prev && p.t - prev.t <= 5 && !kbName(p.id)) continue; res.push(p); }
  return res;
}
const nameOf = (id, files) => kbName(id) || (files.find(f => f.abilityNames?.[id])?.abilityNames[id] || String(id)) + '*';
// 같은 스킬을 이어서 누른 것을 묶는다. KB에 없는 시전(* 표시: 물약·장신구 등)은 묶음을 끊지 않는다.
function collapse(list, files) {
  const groups = [];
  for (const p of list) {
    const known = !!kbName(p.id);
    const last = [...groups].reverse().find(g => g.known);
    if (known && last && last.id === p.id && groups[groups.length - 1] === last) { last.n++; last.t2 = p.t; continue; }
    if (known && last && last.id === p.id && groups[groups.length - 1] !== last && groups.slice(groups.indexOf(last) + 1).every(g => !g.known)) { last.n++; last.t2 = p.t; continue; }
    groups.push({id: p.id, n: 1, t: p.t, t2: p.t, known});
  }
  return groups.map(g => `${(g.t / 1000).toFixed(1)} ${nameOf(g.id, files)}${g.n > 1 ? ' ×' + g.n : ''}`).join(' → ');
}
function runStats(lists) {
  const runs = new Map();
  for (const l of lists) {
    const known = l.filter(p => kbName(p.id));
    for (let i = 0; i < known.length;) {
      let j = i; while (j + 1 < known.length && known[j + 1].id === known[i].id && known[j + 1].t - known[j].t < 6000) j++;
      const k = known[i].id; if (!runs.has(k)) runs.set(k, []); runs.get(k).push(j - i + 1); i = j + 1;
    }
  }
  return [...runs].filter(([, r]) => r.length >= 15).map(([id, r]) => {
    const s = [...r].sort((a, b) => a - b); const med = s[Math.floor(s.length / 2)];
    const dist = {}; for (const x of r) dist[x > 5 ? '6+' : x] = (dist[x > 5 ? '6+' : x] || 0) + 1;
    return {id, n: r.length, med, p25: s[Math.floor(s.length * 0.25)], p75: s[Math.floor(s.length * 0.75)], dist};
  }).sort((a, b) => b.n - a.n);
}
function choiceNodes(id, heroTreeId) {
  // 상위 행 특성에서 '둘 중 하나' 칸(type 2·3)의 선택 수를 센다.
  const c = require(`${SZ}/rankings/${id}.json`);
  const j = judged.filter(e => e.id === id);
  const rows = [];
  for (const e of j) {
    const list = Object.keys(c).filter(k => k.startsWith(e.scope)).sort().flatMap(k => c[k]?.data?.worldData?.raid?.characterRankings?.rankings || []);
    for (const r of e.rows.filter(r => r.after && r.heroTreeId === heroTreeId)) {
      const src = list.find(x => x.report.code === r.report.code && x.report.fightID === r.report.fightID && x.name === r.name);
      if (src?.talents) rows.push(new Set(src.talents.map(t => t.talentID)));
    }
  }
  const diff = diffs.find(d => d.id === id);
  const dec = D.decode(diff.best.code);
  const traits = D.traits.filter(t => t.cls === dec.cls);
  const nodes = new Map(); for (const t of traits) { if (!nodes.has(t.node)) nodes.set(t.node, []); nodes.get(t.node).push(t); }
  const out = [];
  for (const [node, entries] of nodes) {
    if (entries.length < 2 || ![2, 3].includes(entries[0].type)) continue;
    if (entries[0].tree === 3 && entries[0].hero !== heroTreeId) continue;
    if (entries[0].tree === 2 && !entries[0].specs.includes(dec.spec)) continue;
    if (entries[0].tree === 4) continue;
    const counts = entries.map(t => rows.filter(s => s.has(t.entry)).length);
    const tot = counts.reduce((a, b) => a + b, 0);
    if (!tot) continue;
    const pickedInBest = entries.find(t => dec.selected.some(s => s.entry === t.entry && s.purchased));
    const show = t => `${kbName(t.spell) || t.name}(${t.spell})`;
    out.push({line: `${entries.map((t, i) => `${show(t)} ${counts[i]}`).join(' / ')} — 새 견본: ${pickedInBest ? show(pickedInBest) : '안 고름'}`, castable: entries.some(t => ['atomic-skill', 'skill'].includes(kb[String(t.spell)]?.type)), split: Math.max(...counts) / tot < 0.85});
  }
  return {rows: rows.length, lines: out.sort((a, b) => (b.castable - a.castable) || (b.split - a.split))};
}

function build(id, all) {
  const dom = dominant.find(d => d.id === id);
  const dec = decisions[id];
  const diff = diffs.find(d => d.id === id);
  const files = load(id);
  alias(id, files);
  const m = all[id];
  const L = [];
  L.push(`# ${id} — 단일 딜사이클 스조라크 빌드 기준 자료`);
  L.push(`- 스조라크 신화(12.1.5) 상위 랭킹 영웅 특성: ALL ${JSON.stringify(dom.all)} · KR ${JSON.stringify(dom.kr)} → **단일 기준 영웅 특성: ${dom.hero}**`);
  const older = require(SITE + '/artifacts/goal-12.1.5-r5/logs/judged.json').filter(e => e.id === id);
  const share = mode => older.filter(e => e.mode === mode).map(e => `${e.scope} ${Object.entries(e.byHero).map(([k, v]) => k + ' ' + v.count).join('·')}`).join(' / ');
  L.push(`- 참고(다른 전투, 이번에 고치지 않음): 신화 님리사(쫄 있는 레이드) 상위 ${share('raid')} · 쐐기 상위 ${share('mythicPlus')} (goal-12.1.5-r5, 2026-10-20 집계)`);
  L.push(`- 영웅 탭: ${m.heroBranches.map((h, i) => `[${i}] ${h.label}`).join(' · ')} / 기본 탭 지금 [${m.defaultHeroBranchIndex || 0}] → 이번 결정 [${dec.defaultHeroBranchIndex}] ${m.heroBranches[dec.defaultHeroBranchIndex].label}${dec.why ? ' — ' + dec.why : ''}`);
  L.push(`- 새 단일 견본(apply-patch 가 자동으로 넣음, 원고에서 따로 고치지 않음): ${diff.same ? '지금 견본과 같은 코드' : `지금(${diff.curHero}) → 스조라크 대표 빌드(${dom.hero})`} · 대표 행 ${diff.best.scope} #${diff.best.rank} ${diff.best.name} ${diff.best.region} ${diff.best.url} · 유효 행 ${diff.rows}`);
  if (!diff.same) L.push(`  - 지금 견본에서 빠지는 칸: ${diff.removed.join(', ') || '없음'}\n  - 새로 들어오는 칸: ${diff.added.join(', ') || '없음'}`);
  const ch = choiceNodes(id, dom.heroTreeId);
  L.push(`- 둘 중 하나 고르는 칸(기준 영웅 특성 상위 ${ch.rows}행의 선택 수, 시전 버튼이 있는 칸·갈리는 칸 먼저):`);
  for (const c of ch.lines.slice(0, 18)) L.push(`  - ${c.split ? '[갈림] ' : ''}${c.line}`);
  L.push('');
  const heroFiles = files.filter(f => f.heroLabel === dom.hero).sort((a, b) => (a.scope === b.scope ? a.rank - b.rank : a.scope === 'ALL' ? -1 : 1));
  L.push(`## 기준 영웅 특성(${dom.hero}) 스조라크 로그 ${heroFiles.length}개 — 오프닝 (풀 −8초부터 첫 32회, 같은 스킬 연속은 ×n)`);
  for (const f of heroFiles) {
    L.push(`- ${f.scope} #${f.rank} ${f.region || ''} ${f.name} ${Math.round(f.fight.durationMs / 1000)}초 <${f.url}>`);
    L.push(`  ${collapse(presses(f).slice(0, 32), files)}`);
  }
  L.push('');
  L.push(`## 반복 구간 예시 (130~175초, 같은 스킬 연속은 ×n)`);
  for (const f of heroFiles.slice(0, 4)) L.push(`- ${f.scope} #${f.rank} ${f.name}: ${collapse(presses(f).filter(p => p.t >= 130000 && p.t <= 175000), files)}`);
  L.push('');
  const lists = heroFiles.map(f => presses(f).filter(p => p.t > 25000 && !inInter(p.t)));
  L.push(`## 반복 구간(풀 25초 뒤, 사잇단계 제외) 스킬별 '이어서 누른 횟수' — 묶음 수, 중앙값(25~75%), 분포`);
  for (const r of runStats(lists).slice(0, 14)) L.push(`- ${nameOf(r.id, files)}(${r.id}) 묶음 ${r.n}개: 중앙값 ${r.med} (${r.p25}~${r.p75}) · ${Object.entries(r.dist).map(([k, v]) => k + '번 ' + v).join(', ')}`);
  L.push('');
  L.push(`원자료·다른 영웅 특성·지금 가이드 구조: ../sszorak-cycle-20261024/digests/${id}.md · 지난 판정: ../sszorak-cycle-20261024/reports/${id}.md · 심크 우선순위: ../sszorak-cycle-20261024/apl/ · 공개 가이드 발췌: ../sszorak-cycle-20261024/sources/${id}.txt · 지금 원고 보기: ../sszorak-cycle-20261024/views/${id}.json (예전 판일 수 있음 — 정본은 patches/orig/${id}.json)`);
  fs.writeFileSync(path.join(OUT, id + '.md'), L.join('\n') + '\n');
  return `${id}: ${heroFiles.length}개 로그`;
}
fs.mkdirSync(OUT, {recursive: true});
const all = loadGuideManuscripts();
const ids = process.argv[2] ? [process.argv[2]] : dominant.map(d => d.id);
for (const id of ids) console.log(build(id, all));
