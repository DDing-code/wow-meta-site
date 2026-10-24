// 스조라크 단일 딜사이클 대조 자료: digests/<가이드 ID>.md / .json
//   1) 지금 가이드의 단일·오프닝 구조(개념서 타임라인 + 영웅 탭 opener·singleTarget)
//   2) 스조라크 신화 12.1.5 상위 로그: 풀 전(사전 시전) · 오프닝 · 반복(분당·다음 스킬·예시)
//   3) 자동 대조 표시, 심크 APL·공개 가이드 발췌 위치
// 사용: node digest.cjs [가이드 ID]
const fs = require('node:fs');
const path = require('node:path');
const SITE = 'C:/wowmeta/site';
const {loadGuideManuscripts} = require(SITE + '/scripts/lib/guideManuscripts.cjs');
const kb = require(SITE + '/src/data/kb-skills.json').skills;
const judged = require('./judged.json');
const EV = path.join(__dirname, 'events');
const OUT = path.join(__dirname, 'digests');
const APL_FILE = {'hunter-beastmastery': 'hunter_beast_mastery'};
const aplCommits = Object.fromEntries(fs.readFileSync(path.join(__dirname, 'apl', 'LAST-COMMITS.txt'), 'utf8').trim().split('\n').map(l => [l.split(' ')[0], l.split(' ').slice(1).join(' ')]));
const IGNORE = new Set([1, 6603, 75, 5019]);
const kbName = id => kb[String(id)]?.name || null;
// 스조라크 신화 밀어내기 사잇단계(단계 2): 대략 100~125초, 227~252초 (레이드 영상 구성표 대조 4개 전투)
const INTER = [[100000, 125000], [227000, 252000]];
const inInter = t => INTER.some(([a, b]) => t >= a && t <= b);

function presses(file) {
  const out = [], open = new Map();
  for (const [t, type, id, target] of file.events) {
    if (IGNORE.has(id)) continue;
    if (type === 'b') { const p = {t, id, target, begin: true, done: false}; out.push(p); open.set(id, p); continue; }
    const o = open.get(id);
    if (o && !o.done && t - o.t < 12000) { o.done = true; open.delete(id); continue; }
    out.push({t, id, target, done: true});
  }
  const kept = out.filter(p => !p.begin || p.done).sort((a, b) => a.t - b.t);
  const res = [];
  for (const p of kept) { const prev = res[res.length - 1]; if (prev && p.t - prev.t <= 5 && !kbName(p.id)) continue; res.push(p); }
  return res;
}
function nameOf(id, files) {
  const k = kbName(id); if (k) return k;
  for (const f of files) if (f.abilityNames?.[id]) return f.abilityNames[id] + '*';
  return String(id) + '*';
}
const CLASS = {warrior: 'Warrior', paladin: 'Paladin', deathknight: 'DeathKnight', demonhunter: 'DemonHunter', druid: 'Druid', evoker: 'Evoker', hunter: 'Hunter', mage: 'Mage', monk: 'Monk', priest: 'Priest', rogue: 'Rogue', shaman: 'Shaman', warlock: 'Warlock'};
const IGNORE_NAMES = new Set(['Soul Fragment', 'Melee', 'Auto Shot', 'Shoot']);
const TYPE_RANK = ['atomic-skill', 'skill', 'spec-talent', 'class-talent', 'talent', 'hero-talent', 'proc', 'passive', 'buff'];
function aliasFiles(id, files) {
  const [cls, spec] = id.split('-');
  const aliases = new Map();
  for (const f of files) for (const ev of f.events) {
    const raw = ev[2];
    if (kb[String(raw)]) continue;
    const name = f.abilityNames?.[raw];
    if (!name) continue;
    if (IGNORE_NAMES.has(name)) { ev[2] = 1; continue; }
    if (!aliases.has(raw)) {
      const cands = Object.values(kb).filter(k => k.class === CLASS[cls] && k.englishName === name);
      const score = k => ((k.specs || []).some(x => x.toLowerCase().replace(/\s/g, '') === spec) ? 0 : 10) + (TYPE_RANK.indexOf(k.type) < 0 ? 9 : TYPE_RANK.indexOf(k.type));
      cands.sort((a, b) => score(a) - score(b));
      aliases.set(raw, cands[0] ? Number(cands[0].id) : null);
    }
    if (aliases.get(raw)) ev[2] = aliases.get(raw);
  }
  return [...aliases].filter(([, v]) => v).map(([raw, v]) => `${files.find(f => f.abilityNames?.[raw])?.abilityNames[raw]}(${raw})→${kbName(v)}(${v})`);
}
function guideStructures(m) {
  const tl = [];
  (m.blocks || []).forEach((b, i) => {
    [].concat(b.timeline || []).forEach(t => {
      if (t.kind === 'tank') return;
      tl.push({block: i, part: b.part, title: b.title, timeline: t.title, rails: t.rails.map(r => ({label: r.label, kind: r.kind || null, loop: !!r.loop,
        nodes: (r.nodes || []).map(n => ({id: n.skillId, caption: n.caption || '', above: n.above ? {id: n.above.skillId, when: n.above.when || ''} : null})), note: r.note || ''}))});
    });
  });
  const hb = (m.heroBranches || []).map(h => ({label: h.label,
    opener: (h.opener?.steps || []).map(s => ({id: s.skillId, note: s.note || s.label || '', phase: s.phase || '', trigger: s.trigger || ''})),
    singleTarget: (h.singleTarget?.priority || []).map(s => ({id: s.skillId, note: s.note || s.label || ''}))}));
  return {tl, hb};
}
const fmtNode = (n, files) => `${nameOf(n.id, files)}(${n.id})${n.caption ? '[' + n.caption + ']' : ''}${n.above ? ` {위: ${nameOf(n.above.id, files)}(${n.above.id}) ${n.above.when}}` : ''}`;
const sec = t => (t / 1000).toFixed(1);
function perMinute(list, spanMs) { const c = new Map(); for (const p of list) c.set(p.id, (c.get(p.id) || 0) + 1); return new Map([...c].map(([id, n]) => [id, n / (spanMs / 60000)])); }
function avgMaps(maps) { const all = new Map(); for (const m of maps) for (const [id, v] of m) all.set(id, (all.get(id) || 0) + v / maps.length); return all; }

function build(id, m) {
  const files = fs.readdirSync(EV).filter(f => f.startsWith(id + '-')).map(f => JSON.parse(fs.readFileSync(path.join(EV, f), 'utf8'))).filter(f => !f.error && f.events?.length);
  const aliasNote = aliasFiles(id, files);
  const {tl, hb} = guideStructures(m);
  const share = judged.filter(e => e.id === id).map(e => `${e.scope} ${e.rowsAfter}행: ${Object.entries(e.byHero).map(([k, v]) => k + ' ' + v).join(', ')}`).join(' / ');
  const heroes = [...new Set([...hb.map(h => h.label), ...files.map(f => f.heroLabel)])];
  const L = [], J = {id, heroes: {}, flags: []};
  L.push(`# ${id} — 스조라크 단일 딜사이클 대조 자료`);
  L.push(`생성 ${new Date().toISOString()} · 로그: 독사의 심연 신화 스조라크(3420), WCL 12.1.5 구간 랭킹 상위(영웅 트리별 전 지역 상위 8 + KR 상위 3) 시전 이벤트, 풀 8초 전부터. 이름 뒤 * = KB에 없는 ID(WCL 영어 이름). [ ] = 캡션, {위: } = 위쪽 가지.`);
  L.push(`랭킹 영웅 특성 분포(12.1.5 구간 상위 행): ${share}`);
  if (aliasNote.length) L.push(`시전 번호 → KB 스킬로 묶은 것(영어 이름 일치): ${aliasNote.join(', ')}`);
  L.push('주의: 스조라크는 단일 네임드다. 밀어내기 사잇단계(대략 100~125초, 227~252초)에는 이동·구슬 처리로 딜이 끊길 수 있어 반복 통계에서 뺐다. 풀 전(음수 초)은 로그에 남은 사전 시전만 보인다 — 버프·징표·소환수 등 로그 창 밖 준비는 심크 우선순위 precombat와 공개 가이드로 판단한다.');
  const aplName = APL_FILE[id] || id.replace('-', '_');
  const aplPath = path.join(__dirname, 'apl', aplName + '.simc');
  L.push(`심크 우선순위(APL): ${fs.existsSync(aplPath) ? aplPath.replace(/\\/g, '/') + ' (마지막 수정 ' + (aplCommits[aplName + '.simc'] || '?') + ')' : '없음'}`);
  L.push(`공개 가이드 오프닝·프리풀 발췌: ${path.join(__dirname, 'sources', id + '.txt').replace(/\\/g, '/')} (원본 HTML 같은 폴더 -icy.html / -method.html)`);
  L.push('');
  L.push('## 1. 지금 가이드의 단일·오프닝 순서');
  for (const t of tl) {
    if (/광역/.test(t.timeline) && !/단일|오프닝/.test(t.timeline)) { L.push(`### blocks[${t.block}] ${t.title} — ${t.timeline} (광역: 이번 범위 아님, 생략)`); continue; }
    L.push(`### blocks[${t.block}] (${t.part}) ${t.title} — ${t.timeline}`);
    for (const r of t.rails) {
      L.push(`- rail "${r.label}"${r.loop ? ' (반복)' : ''}${r.kind ? ' kind=' + r.kind : ''}: ${r.nodes.map(n => fmtNode(n, files)).join(' → ')}`);
      if (r.note) L.push(`  - note: ${r.note}`);
    }
  }
  for (const h of hb) {
    L.push(`### heroBranches "${h.label}"`);
    L.push(`- opener: ${h.opener.map((s, i) => `${i + 1}.${nameOf(s.id, files)}(${s.id})${s.phase ? '[' + s.phase + ']' : ''}`).join(' ')}`);
    L.push(`- singleTarget: ${h.singleTarget.map((s, i) => `${i + 1}.${nameOf(s.id, files)}(${s.id})`).join(' ')}`);
  }
  L.push('');
  for (const hero of heroes) {
    const raid = files.filter(f => f.heroLabel === hero).sort((a, b) => (a.scope === b.scope ? a.rank - b.rank : a.scope === 'ALL' ? -1 : 1));
    const H = {raid: raid.length};
    J.heroes[hero] = H;
    L.push(`## 2. 스조라크 로그 — ${hero} (${raid.length}개)`);
    if (!raid.length) { L.push('- 12.1.5 구간 상위 로그 없음'); L.push(''); continue; }
    const pre = new Map();
    for (const f of raid) for (const id2 of new Set(presses(f).filter(p => p.t < 0).map(p => p.id))) pre.set(id2, (pre.get(id2) || 0) + 1);
    L.push(`### 풀 전(0초 전) 사전 시전 — 전투 수/${raid.length}`);
    L.push('  ' + ([...pre].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${nameOf(k, files)}(${k}) ${n}`).join(' · ') || '없음'));
    L.push(`### 오프닝 (풀 −8초부터 첫 24회)`);
    const openers = [];
    for (const f of raid) {
      const op = presses(f).slice(0, 24);
      openers.push(op.map(p => p.id));
      L.push(`- ${f.scope} #${f.rank} ${f.region || ''} ${f.name} ${Math.round(f.fight.durationMs / 1000)}초 <${f.url}>`);
      L.push(`  ${op.map(p => `${sec(p.t)} ${nameOf(p.id, files)}`).join(' → ')}`);
    }
    H.openers = openers;
    const rates = [], trans = new Map(), loopLists = [];
    for (const f of raid) {
      const ps = presses(f).filter(p => p.t > 25000 && !inInter(p.t));
      loopLists.push(ps);
      const span = (f.fight.durationMs - 25000) - INTER.reduce((s, [a, b]) => s + Math.max(0, Math.min(b, f.fight.durationMs) - a), 0);
      if (ps.length > 10 && span > 30000) rates.push(perMinute(ps, span));
      for (let i = 0; i + 1 < ps.length; i++) {
        if (ps[i + 1].t - ps[i].t > 6000) continue;
        const a = ps[i].id, b = ps[i + 1].id;
        if (!trans.has(a)) trans.set(a, new Map());
        trans.get(a).set(b, (trans.get(a).get(b) || 0) + 1);
      }
    }
    const rate = avgMaps(rates);
    H.raidRate = Object.fromEntries([...rate].map(([k, v]) => [k, +v.toFixed(2)]));
    L.push(`### 반복(풀 25초 이후, 사잇단계 제외) — 분당 시전(전투 평균)`);
    L.push('  ' + [...rate].sort((a, b) => b[1] - a[1]).filter(([, v]) => v >= 0.15).map(([k, v]) => `${nameOf(k, files)}(${k}) ${v.toFixed(2)}`).join(' · '));
    L.push(`### 반복 — 바로 다음에 누른 스킬(상위 4, 10회 이상)`);
    for (const [a, nx] of [...trans].sort((x, y) => [...y[1].values()].reduce((s, v) => s + v, 0) - [...x[1].values()].reduce((s, v) => s + v, 0))) {
      const tot = [...nx.values()].reduce((s, v) => s + v, 0);
      if (tot < 10) continue;
      L.push(`- ${nameOf(a, files)} (${tot}) → ${[...nx].sort((x, y) => y[1] - x[1]).slice(0, 4).map(([b, n]) => `${nameOf(b, files)} ${Math.round(n / tot * 100)}%`).join(', ')}`);
    }
    for (const [k, f] of raid.slice(0, 2).entries()) {
      const ex = presses(f).filter(p => p.t >= 130000 && p.t <= 175000);
      if (ex.length) { L.push(`### 반복 예시 ${k + 1} (${f.scope} #${f.rank} ${f.name}, 130~175초)`); L.push('  ' + ex.map(p => `${sec(p.t)} ${nameOf(p.id, files)}`).join(' → ')); }
    }
    H.loopLists = loopLists.map(l => l.map(p => p.id));
    L.push('');
  }
  L.push('## 3. 자동 대조 표시 (판단은 사람이 — 위 원자료를 볼 것)');
  for (const h of hb) {
    const H = J.heroes[h.label];
    if (!H?.openers?.length) { L.push(`- ${h.label}: 스조라크 로그 없음 — 대조 불가`); continue; }
    const pos = (sid, k) => H.openers.map(o => { let c = 0; for (let i = 0; i < o.length; i++) if (o[i] === Number(sid) && ++c === k) return i; return null; });
    const med = arr => { const v = arr.filter(x => x != null).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };
    const seen = {};
    const rows = h.opener.map(s => { const k = (seen[s.id] = (seen[s.id] || 0) + 1); const p = pos(s.id, k); return {id: s.id, k, med: med(p), seen: p.filter(x => x != null).length}; });
    L.push(`- ${h.label} 오프닝 각 단계가 로그 오프닝 몇 번째에 나오나(중앙값, 나온 전투 수/${H.openers.length}): ${rows.map(r => `${nameOf(r.id, [])}${r.k > 1 ? '#' + r.k : ''}=${r.med == null ? '없음' : r.med + 1}(${r.seen})`).join(', ')}`);
    const inv = [];
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      if (rows[i].id === rows[j].id || rows[i].med == null || rows[j].med == null) continue;
      if (rows[i].med > rows[j].med + 1) inv.push(`${nameOf(rows[i].id, [])}${rows[i].k > 1 ? '#' + rows[i].k : ''}→${nameOf(rows[j].id, [])}${rows[j].k > 1 ? '#' + rows[j].k : ''}`);
    }
    if (inv.length) { L.push(`  - 순서 뒤바뀜(가이드 앞 → 로그에선 뒤): ${inv.slice(0, 14).join(', ')}`); J.flags.push({hero: h.label, kind: 'opener-inversion', items: inv}); }
    const guideIds = new Set(h.opener.map(s => Number(s.id)));
    const common = new Map();
    for (const o of H.openers) for (const x of new Set(o.slice(0, 14))) common.set(x, (common.get(x) || 0) + 1);
    const missing = [...common].filter(([x, n]) => n / H.openers.length >= 0.6 && !guideIds.has(x) && kbName(x)).map(([x, n]) => `${nameOf(x, [])}(${x}) ${n}/${H.openers.length}`);
    if (missing.length) { L.push(`  - 로그 오프닝 첫 14회에 60% 이상 나오는데 영웅 탭 오프닝에 없음: ${missing.join(', ')}`); J.flags.push({hero: h.label, kind: 'opener-missing', items: missing}); }
    const absent = rows.filter(r => r.seen === 0).map(r => nameOf(r.id, []));
    if (absent.length) { L.push(`  - 영웅 탭 오프닝에 있는데 로그 첫 24회에 한 번도 없음(사전 준비·버프일 수 있음): ${absent.join(', ')}`); J.flags.push({hero: h.label, kind: 'opener-absent', items: absent}); }
    const st = new Set(h.singleTarget.map(s => Number(s.id)));
    const miss = Object.entries(H.raidRate).filter(([k, v]) => v >= 1 && !st.has(Number(k)) && kbName(k)).map(([k, v]) => `${nameOf(k, [])}(${k}) ${v}/분`);
    if (miss.length) { L.push(`  - 분당 1회 이상인데 영웅 탭 단일 우선순위에 없음: ${miss.join(', ')}`); J.flags.push({hero: h.label, kind: 'st-missing', items: miss}); }
    const rare = h.singleTarget.filter(s => kbName(s.id) && (H.raidRate[s.id] || 0) < 0.1).map(s => `${nameOf(s.id, [])}(${s.id}) ${(H.raidRate[s.id] || 0)}/분`);
    if (rare.length) { L.push(`  - 단일 우선순위에 있는데 스조라크 로그 분당 0.1 미만(다른 ID·피해로 찍히는지 확인): ${rare.join(', ')}`); J.flags.push({hero: h.label, kind: 'st-rare', items: rare}); }
    const loops = H.loopLists || [];
    const mainRails = tl.flatMap(t => t.rails.filter(r => r.loop && r.kind !== 'inserts' && /단일/.test(t.timeline + r.label)));
    for (const r of mainRails) {
      const pairs = [];
      for (let i = 0; i + 1 < r.nodes.length; i++) {
        const a = Number(r.nodes[i].id), b = Number(r.nodes[i + 1].id);
        if (a === b) continue;
        let ab = 0, ba = 0, na = 0, nb = 0;
        for (const l of loops) for (let k = 0; k < l.length; k++) {
          if (l[k] === a) { na++; if (l.slice(k + 1, k + 4).includes(b)) ab++; }
          if (l[k] === b) { nb++; if (l.slice(k + 1, k + 4).includes(a)) ba++; }
        }
        pairs.push(`${nameOf(a, [])}→${nameOf(b, [])} ${na ? Math.round(ab / na * 100) : '-'}% / 반대 ${nb ? Math.round(ba / nb * 100) : '-'}%`);
      }
      L.push(`  - [${h.label}] 단일 반복 rail "${r.label}" 이웃 쌍(A 뒤 3회 안에 B / B 뒤 3회 안에 A): ${pairs.join(' · ')}`);
    }
  }
  fs.writeFileSync(path.join(OUT, id + '.md'), L.join('\n') + '\n');
  fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(J));
  return {id, files: files.length, flags: J.flags.length, kb: Math.round(L.join('\n').length / 1024)};
}
fs.mkdirSync(OUT, {recursive: true});
const all = loadGuideManuscripts();
const ids = process.argv[2] ? [process.argv[2]] : [...new Set(judged.map(e => e.id))];
for (const id of ids) console.log(JSON.stringify(build(id, all[id])));
