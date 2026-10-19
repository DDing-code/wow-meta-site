// 딜사이클 순서 대조 자료: 전문화마다 digests/<가이드 ID>.md 와 digests/<가이드 ID>.json 을 만든다.
//   1) 지금 가이드(정본)의 순서: 개념서 타임라인 + 영웅 특성 탭(오프닝·단일·광역)
//   2) 12.1.5 이후 상위 로그의 실제 시전 순서: 레이드 오프닝 · 레이드 반복 · 쐐기 광역 풀 시작
//   3) 자동 대조 표시(오프닝 순서 뒤바뀜, 로그에 자주 나오는데 가이드에 없는 스킬 등)
//   4) 심크 APL 파일 위치와 마지막 수정일
// 사용: node digest.cjs [가이드 ID]
const fs = require('node:fs');
const path = require('node:path');
const SITE = 'C:/wowmeta/site';
const {loadGuideManuscripts} = require(SITE + '/scripts/lib/guideManuscripts.cjs');
const kb = require(SITE + '/src/data/kb-skills.json').skills;
const EV = path.join(__dirname, 'events');
const OUT = path.join(__dirname, 'digests');
const APL_FILE = {
  'hunter-beastmastery': 'hunter_beast_mastery',
};
const aplCommits = Object.fromEntries(fs.readFileSync(path.join(__dirname, 'apl', 'LAST-COMMITS.txt'), 'utf8').trim().split('\n').map(l => [l.split(' ')[0], l.split(' ').slice(1).join(' ')]));

const IGNORE = new Set([1, 6603, 75, 5019]); // 자동 공격·자동 사격·마법봉
const kbName = id => kb[String(id)]?.name || null;

function presses(file) {
  const ev = file.events;
  const out = [];
  const open = new Map();
  for (const [t, type, id, target] of ev) {
    if (IGNORE.has(id)) continue;
    if (type === 'b') { const p = {t, id, target, begin: true, done: false}; out.push(p); open.set(id, p); continue; }
    const o = open.get(id);
    if (o && !o.done && t - o.t < 12000) { o.done = true; open.delete(id); continue; }
    out.push({t, id, target, done: true});
  }
  // 끝내지 못한(끊긴) 시전은 뺀다.
  const kept = out.filter(p => !p.begin || p.done).sort((a, b) => a.t - b.t);
  // 다른 시전과 5ms 안에 같이 찍힌, KB에 없는 주문은 따라 발동한 것으로 보고 뺀다.
  const res = [];
  for (const p of kept) {
    const prev = res[res.length - 1];
    if (prev && p.t - prev.t <= 5 && !kbName(p.id)) continue;
    res.push(p);
  }
  return res;
}

function nameOf(id, files) {
  const k = kbName(id);
  if (k) return k;
  for (const f of files) if (f.abilityNames?.[id]) return f.abilityNames[id] + '*';
  return String(id) + '*';
}

function guideStructures(m) {
  const tl = [];
  (m.blocks || []).forEach((b, i) => {
    if (!b.timeline) return;
    tl.push({block: i, title: b.title, timeline: b.timeline.title, rails: b.timeline.rails.map(r => ({label: r.label, kind: r.kind || null, loop: !!r.loop,
      nodes: (r.nodes || []).map(n => ({id: n.skillId, caption: n.caption || '', above: n.above ? {id: n.above.skillId, when: n.above.when || ''} : null})), note: r.note || ''}))});
  });
  const hb = (m.heroBranches || []).map(h => ({label: h.label,
    opener: (h.opener?.steps || []).map(s => ({id: s.skillId, note: s.note || s.label || ''})),
    singleTarget: (h.singleTarget?.priority || []).map(s => ({id: s.skillId, note: s.note || s.label || ''})),
    aoe: (h.aoe?.priority || h.aoe?.steps || []).map(s => ({id: s.skillId, note: s.note || s.label || ''}))}));
  return {tl, hb};
}

const fmtNode = (n, files) => `${nameOf(n.id, files)}(${n.id})${n.caption ? '[' + n.caption + ']' : ''}${n.above ? ` {위: ${nameOf(n.above.id, files)}(${n.above.id}) ${n.above.when}}` : ''}`;
const sec = t => (t / 1000).toFixed(1);

function perMinute(list, spanMs) {
  const c = new Map();
  for (const p of list) c.set(p.id, (c.get(p.id) || 0) + 1);
  return new Map([...c].map(([id, n]) => [id, n / (spanMs / 60000)]));
}
function avgMaps(maps) {
  const all = new Map();
  for (const m of maps) for (const [id, v] of m) all.set(id, (all.get(id) || 0) + v / maps.length);
  return all;
}

function segments(list) {
  const segs = [];
  let cur = [];
  for (const p of list) {
    if (cur.length && p.t - cur[cur.length - 1].t > 7000) { segs.push(cur); cur = []; }
    cur.push(p);
  }
  if (cur.length) segs.push(cur);
  return segs.map(s => ({list: s, start: s[0].t, end: s[s.length - 1].t,
    targets: new Set(s.slice(0, 30).map(p => p.target).filter(x => x > 0)).size}));
}


const TANK = {
  'warrior-protection': {am: [2565, 190456], cds: [871, 12975, 1243659, 23920, 97462, 1160, 107574, 385952, 228920], taunt: [355]},
  'paladin-protection': {am: [53600, 85673], cds: [86659, 31850, 642, 31884, 389539, 1022, 6940, 633, 387174], taunt: [62124]},
  'deathknight-blood': {am: [49998, 195182], cds: [55233, 48792, 48707, 51052, 49028, 49039, 194679, 219809], taunt: [56222]},
  'demonhunter-vengeance': {am: [203720], cds: [187827, 204021, 196718, 263648, 212084], taunt: [185245]},
  'druid-guardian': {am: [192081, 22842], cds: [61336, 22812, 50334, 102558, 200851, 204066], taunt: [6795]},
  'monk-brewmaster': {am: [119582, 322507, 1241059], cds: [115203, 122278, 122783, 132578, 115399, 115176, 322109], taunt: [115546]},
};
function tankSection(id, hero, raid, mplus, files, L) {
  const T = TANK[id];
  if (!T) return;
  const big = new Set([...T.cds, ...T.taunt]);
  L.push(`### 탱커 — 방어 기술 사용 (방어 유지 ${T.am.map(x => nameOf(x, files)).join('·')} / 생존기·도발)`);
  for (const f of raid.slice(0, 3)) {
    const ps = presses(f);
    const span = (ps[ps.length - 1]?.t || 1) / 60000;
    const am = T.am.map(a => `${nameOf(a, files)} ${(ps.filter(p => p.id === a).length / span).toFixed(1)}/분`).join(', ');
    L.push(`- 레이드 ${f.scope} #${f.rank} ${f.name} ${Math.round(f.fight.durationMs / 1000)}초 — 방어 유지 ${am}`);
    L.push(`  생존기·도발 시각: ${ps.filter(p => big.has(p.id)).map(p => `${sec(p.t)} ${nameOf(p.id, files)}`).join(' · ') || '없음'}`);
  }
  for (const f of mplus.slice(0, 3)) {
    const segs = segments(presses(f)).filter(s => s.list.length >= 20 && s.targets >= 4).slice(0, f === mplus[0] ? 5 : 2);
    for (const s of segs) {
      const dur = (s.end - s.start) / 1000;
      const am = T.am.map(a => `${nameOf(a, files)} ${s.list.filter(p => p.id === a).length}`).join(', ');
      const cds = s.list.filter(p => big.has(p.id) && p.t - s.start <= 90000).map(p => `+${sec(p.t - s.start)} ${nameOf(p.id, files)}`).join(' · ');
      L.push(`- 쐐기 ${f.scope} #${f.rank} +${f.fight.keystoneLevel} ${f.name} 풀 ${sec(s.start)}초(${Math.round(dur)}초, 대상 ${s.targets}) — 방어 유지 ${am}(구간 전체) · 생존기·도발(첫 90초): ${cds || '없음'}`);
      L.push(`  풀 시작 12회: ${s.list.slice(0, 12).map(p => nameOf(p.id, files)).join(' → ')}`);
    }
  }
}

// 시전 번호가 KB 번호와 다른 스킬(예: 균열·우레 작렬)은 WCL 영어 이름이 같은 같은 직업 KB 스킬로 묶는다.
const CLASS = {warrior: 'Warrior', paladin: 'Paladin', deathknight: 'DeathKnight', demonhunter: 'DemonHunter', druid: 'Druid', evoker: 'Evoker', hunter: 'Hunter', mage: 'Mage', monk: 'Monk', priest: 'Priest', rogue: 'Rogue', shaman: 'Shaman', warlock: 'Warlock'};
const IGNORE_NAMES = new Set(['Soul Fragment', 'Gift of the Ox', 'Melee', 'Auto Shot', 'Shoot']);
const TYPE_RANK = ['atomic-skill', 'skill', 'spec-talent', 'class-talent', 'talent', 'hero-talent', 'proc', 'passive', 'buff'];
function aliasFiles(id, files) {
  const [cls, spec] = id.split('-');
  const specKey = spec.toLowerCase();
  const aliases = new Map();
  for (const f of files) {
    for (const ev of f.events) {
      const raw = ev[2];
      if (kb[String(raw)]) continue;
      const name = f.abilityNames?.[raw];
      if (!name) continue;
      if (IGNORE_NAMES.has(name)) { ev[2] = 1; continue; }
      if (!aliases.has(raw)) {
        const cands = Object.values(kb).filter(k => k.class === CLASS[cls] && k.englishName === name);
        const score = k => ((k.specs || []).some(x => x.toLowerCase().replace(/\s/g, '') === specKey) ? 0 : 10) + (TYPE_RANK.indexOf(k.type) < 0 ? 9 : TYPE_RANK.indexOf(k.type));
        cands.sort((a, b) => score(a) - score(b));
        aliases.set(raw, cands[0] ? Number(cands[0].id) : null);
      }
      if (aliases.get(raw)) ev[2] = aliases.get(raw);
    }
  }
  return [...aliases].filter(([, v]) => v).map(([raw, v]) => `${files.find(f => f.abilityNames?.[raw])?.abilityNames[raw]}(${raw})→${kbName(v)}(${v})`);
}

function build(id, m) {
  const files = fs.readdirSync(EV).filter(f => f.startsWith(id + '-')).map(f => JSON.parse(fs.readFileSync(path.join(EV, f), 'utf8'))).filter(f => !f.error && f.events?.length);
  const aliasNote = aliasFiles(id, files);
  const {tl, hb} = guideStructures(m);
  const heroes = [...new Set([...hb.map(h => h.label), ...files.map(f => f.heroLabel)])];
  const L = [];
  const J = {id, heroes: {}, flags: []};
  L.push(`# ${id} — 딜사이클 순서 대조 자료`);
  L.push(`생성 ${new Date().toISOString()} · 로그: 12.1.5 이후 랭킹 상위(전 지역 상위 5 + KR 상위 3, 영웅 트리별) 시전 이벤트. 이름 뒤 * = KB에 없는 ID(WCL 영어 이름). [ ] = 캡션, {위: } = 위쪽 가지.`);
  const aplName = APL_FILE[id] || id.replace('-', '_');
  const aplPath = path.join(__dirname, 'apl', aplName + '.simc');
  if (aliasNote.length) L.push(`시전 번호 → KB 스킬로 묶은 것(영어 이름 일치): ${aliasNote.join(', ')}`);
  L.push('주의: 레이드는 독사의 심연 신화 님리사(쫄이 나오는 네임드)라 레이드 반복에도 광역기가 섞인다. 풀 5초보다 먼저 쓴 사전 준비(징표·버프 등)는 로그 창 밖이라 안 보인다. 쐐기 광역 풀 = 시전 간격 7초 넘게 끊긴 구간 중 첫 30회 대상이 4명 이상인 구간.');
  L.push(`심크 APL: ${fs.existsSync(aplPath) ? aplPath.replace(/\\/g, '/') + ' (마지막 수정 ' + (aplCommits[aplName + '.simc'] || '?') + ')' : '없음(치유 전문화)'}`);
  L.push('');
  L.push('## 1. 지금 가이드의 순서');
  for (const t of tl) {
    L.push(`### blocks[${t.block}] ${t.title} — ${t.timeline}`);
    for (const r of t.rails) {
      L.push(`- rail "${r.label}"${r.loop ? ' (반복)' : ''}${r.kind ? ' kind=' + r.kind : ''}: ${r.nodes.map(n => fmtNode(n, files)).join(' → ')}`);
      if (r.note) L.push(`  - note: ${r.note}`);
    }
  }
  for (const h of hb) {
    L.push(`### heroBranches "${h.label}"`);
    for (const k of ['opener', 'singleTarget', 'aoe']) {
      L.push(`- ${k}: ${h[k].map((s, i) => `${i + 1}.${nameOf(s.id, files)}(${s.id})`).join(' ')}`);
    }
  }
  L.push('');

  for (const hero of heroes) {
    const raid = files.filter(f => f.mode === 'raid' && f.heroLabel === hero).sort((a, b) => (a.scope === b.scope ? a.rank - b.rank : a.scope === 'ALL' ? -1 : 1));
    const mplus = files.filter(f => f.mode === 'mythicPlus' && f.heroLabel === hero).sort((a, b) => (a.scope === b.scope ? a.rank - b.rank : a.scope === 'ALL' ? -1 : 1));
    const H = {raid: raid.length, mythicPlus: mplus.length};
    J.heroes[hero] = H;
    L.push(`## 2. 로그 — ${hero} (레이드 ${raid.length}개 · 쐐기 ${mplus.length}개)`);
    if (!raid.length && !mplus.length) { L.push('- 12.1.5 이후 상위 로그 없음'); L.push(''); continue; }

    // 오프닝
    if (raid.length) {
      L.push(`### 레이드 오프닝 (풀 −5초부터 첫 22회, 초 단위)`);
      const openers = [];
      for (const f of raid) {
        const ps = presses(f);
        const op = ps.slice(0, 22);
        openers.push(op.map(p => p.id));
        L.push(`- ${f.scope} #${f.rank} ${f.region} ${f.name} ${Math.round(f.fight.durationMs / 1000)}초 <${f.url}>`);
        L.push(`  ${op.map(p => `${sec(p.t)} ${nameOf(p.id, files)}`).join(' → ')}`);
      }
      H.openers = openers;
      // 반복 구간(풀 25초 이후)
      const rates = [], trans = new Map(), loopLists = [];
      for (const f of raid) {
        const ps = presses(f).filter(p => p.t > 25000);
        loopLists.push(ps);
        if (ps.length > 10) rates.push(perMinute(ps, ps[ps.length - 1].t - ps[0].t));
        for (let i = 0; i + 1 < ps.length; i++) {
          const a = ps[i].id, b = ps[i + 1].id;
          if (!trans.has(a)) trans.set(a, new Map());
          trans.get(a).set(b, (trans.get(a).get(b) || 0) + 1);
        }
      }
      const rate = avgMaps(rates);
      H.raidRate = Object.fromEntries([...rate].map(([k, v]) => [k, +v.toFixed(2)]));
      L.push(`### 레이드 반복(풀 25초 이후) — 분당 시전(전투 평균)`);
      L.push('  ' + [...rate].sort((a, b) => b[1] - a[1]).filter(([, v]) => v >= 0.15).map(([k, v]) => `${nameOf(k, files)}(${k}) ${v.toFixed(1)}`).join(' · '));
      L.push(`### 레이드 반복 — 바로 다음에 누른 스킬(상위 3, 10회 이상)`);
      for (const [a, nx] of [...trans].sort((x, y) => [...y[1].values()].reduce((s, v) => s + v, 0) - [...x[1].values()].reduce((s, v) => s + v, 0))) {
        const tot = [...nx.values()].reduce((s, v) => s + v, 0);
        if (tot < 10) continue;
        L.push(`- ${nameOf(a, files)} (${tot}) → ${[...nx].sort((x, y) => y[1] - x[1]).slice(0, 3).map(([b, n]) => `${nameOf(b, files)} ${Math.round(n / tot * 100)}%`).join(', ')}`);
      }
      const ex = loopLists[0].filter(p => p.t >= 90000 && p.t <= 135000);
      if (ex.length) {
        L.push(`### 레이드 반복 예시 (최상위 전투 90~135초)`);
        L.push('  ' + ex.map(p => `${sec(p.t)} ${nameOf(p.id, files)}`).join(' → '));
      }
      H.loopLists = loopLists.map(l => l.map(p => p.id));
    }
    // 쐐기 광역
    if (mplus.length) {
      const aoeRates = [];
      const examples = [];
      for (const f of mplus) {
        const segs = segments(presses(f)).filter(s => s.list.length >= 20 && s.targets >= 4);
        const span = segs.reduce((s, x) => s + (x.end - x.start), 0);
        if (segs.length && span > 60000) aoeRates.push(perMinute(segs.flatMap(s => s.list), span));
        for (const s of segs.slice(0, f === mplus[0] ? 4 : 1)) examples.push({f, s});
      }
      const ar = avgMaps(aoeRates);
      H.aoeRate = Object.fromEntries([...ar].map(([k, v]) => [k, +v.toFixed(2)]));
      L.push(`### 쐐기 광역 풀(적 4명 이상) — 분당 시전 · (레이드 대비 배율)`);
      const rr = H.raidRate ? new Map(Object.entries(H.raidRate).map(([k, v]) => [Number(k), v])) : new Map();
      L.push('  ' + [...ar].sort((a, b) => b[1] - a[1]).filter(([, v]) => v >= 0.15).map(([k, v]) => `${nameOf(k, files)}(${k}) ${v.toFixed(1)}${rr.size ? ' (×' + (rr.get(k) ? (v / rr.get(k)).toFixed(1) : '레이드 0') + ')' : ''}`).join(' · '));
      L.push(`### 쐐기 광역 풀 시작 순서 (첫 16회)`);
      for (const {f, s} of examples.slice(0, 7)) {
        L.push(`- ${f.scope} #${f.rank} +${f.fight.keystoneLevel} ${f.name} 풀 ${sec(s.start)}초 대상 ${s.targets}: ${s.list.slice(0, 16).map(p => nameOf(p.id, files)).join(' → ')}`);
      }
    }
    tankSection(id, hero, raid, mplus, files, L);
    L.push('');
  }

  // 자동 대조
  L.push('## 3. 자동 대조 표시 (판단은 사람이 — 순서 근거로 쓰기 전에 위 원자료를 볼 것)');
  for (const h of hb) {
    const H = J.heroes[h.label];
    if (!H?.openers?.length) { L.push(`- ${h.label}: 레이드 로그 없음 — 오프닝 대조 불가`); continue; }
    // 같은 스킬이 여러 번 나오면 가이드의 k번째 등장을 로그의 k번째 등장과 비교한다.
    const pos = (id, k) => H.openers.map(o => { let c = 0; for (let i = 0; i < o.length; i++) if (o[i] === Number(id) && ++c === k) return i; return null; });
    const med = arr => { const v = arr.filter(x => x != null).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };
    const seenCount = {};
    const rows = h.opener.map(s => { const k = (seenCount[s.id] = (seenCount[s.id] || 0) + 1); const p = pos(s.id, k); return {id: s.id, k, med: med(p), seen: p.filter(x => x != null).length}; });
    L.push(`- ${h.label} 오프닝(영웅 탭) 각 단계가 로그 오프닝 몇 번째에 처음 나오나(중앙값, 나온 전투 수/${H.openers.length}): ${rows.map(r => `${nameOf(r.id, [])}${r.k > 1 ? '#' + r.k : ''}=${r.med == null ? '없음' : r.med + 1}(${r.seen})`).join(', ')}`);
    const inv = [];
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      if (rows[i].id === rows[j].id || rows[i].med == null || rows[j].med == null) continue;
      if (rows[i].med > rows[j].med + 1) inv.push(`${nameOf(rows[i].id, [])}${rows[i].k > 1 ? '#' + rows[i].k : ''}→${nameOf(rows[j].id, [])}${rows[j].k > 1 ? '#' + rows[j].k : ''}`);
    }
    if (inv.length) { L.push(`  - 순서 뒤바뀜(가이드 앞 → 로그에선 뒤): ${inv.slice(0, 12).join(', ')}`); J.flags.push({hero: h.label, kind: 'opener-inversion', items: inv}); }
    const guideIds = new Set([...h.opener.map(s => Number(s.id))]);
    const common = new Map();
    for (const o of H.openers) for (const id of new Set(o.slice(0, 12))) common.set(id, (common.get(id) || 0) + 1);
    const missing = [...common].filter(([id, n]) => n / H.openers.length >= 0.6 && !guideIds.has(id) && kbName(id)).map(([id]) => `${nameOf(id, [])}(${id})`);
    if (missing.length) { L.push(`  - 로그 오프닝 첫 12회에 60% 이상 나오는데 영웅 탭 오프닝에 없음: ${missing.join(', ')}`); J.flags.push({hero: h.label, kind: 'opener-missing', items: missing}); }
    const absent = rows.filter(r => r.seen === 0).map(r => nameOf(r.id, []));
    if (absent.length) { L.push(`  - 영웅 탭 오프닝에 있는데 로그 첫 22회에 한 번도 없음: ${absent.join(', ')}`); J.flags.push({hero: h.label, kind: 'opener-absent', items: absent}); }
    // 단일·광역 우선순위에 없는 자주 쓰는 스킬
    if (H.raidRate) {
      const st = new Set(h.singleTarget.map(s => Number(s.id)));
      const miss = Object.entries(H.raidRate).filter(([k, v]) => v >= 1 && !st.has(Number(k)) && kbName(k)).map(([k, v]) => `${nameOf(k, [])}(${k}) ${v}/분`);
      if (miss.length) { L.push(`  - 레이드에서 분당 1회 이상인데 영웅 탭 단일 우선순위에 없음: ${miss.join(', ')}`); J.flags.push({hero: h.label, kind: 'st-missing', items: miss}); }
      const rare = h.singleTarget.filter(s => kbName(s.id) && (H.raidRate[s.id] || 0) < 0.1 && kb[String(s.id)]?.type !== 'buff').map(s => `${nameOf(s.id, [])}(${s.id}) ${(H.raidRate[s.id] || 0)}/분`);
      if (rare.length) { L.push(`  - 영웅 탭 단일 우선순위에 있는데 레이드 로그 분당 0.1 미만(다른 ID로 찍히는지 확인): ${rare.join(', ')}`); J.flags.push({hero: h.label, kind: 'st-rare', items: rare}); }
    }
    if (H.aoeRate) {
      const ao = new Set(h.aoe.map(s => Number(s.id)));
      const miss = Object.entries(H.aoeRate).filter(([k, v]) => v >= 1 && !ao.has(Number(k)) && kbName(k)).map(([k, v]) => `${nameOf(k, [])}(${k}) ${v}/분`);
      if (miss.length) { L.push(`  - 쐐기 광역에서 분당 1회 이상인데 영웅 탭 광역 우선순위에 없음: ${miss.join(', ')}`); J.flags.push({hero: h.label, kind: 'aoe-missing', items: miss}); }
    }
    // 단일 반복 rail의 연속 쌍 지지도
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
      L.push(`  - [${h.label}] 단일 반복 rail "${r.label}" 이웃 쌍: A 뒤 3회 안에 B가 오는 비율 / B 뒤 3회 안에 A: ${pairs.join(' · ')}`);
    }
  }
  fs.writeFileSync(path.join(OUT, id + '.md'), L.join('\n') + '\n');
  fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(J));
  return {id, files: files.length, flags: J.flags.length, bytes: L.join('\n').length};
}

fs.mkdirSync(OUT, {recursive: true});
const all = loadGuideManuscripts();
const only = process.argv[2];
const ids = only ? [only] : Object.keys(all);
for (const id of ids) console.log(JSON.stringify(build(id, all[id])));
