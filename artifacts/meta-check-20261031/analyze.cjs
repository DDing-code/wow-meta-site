// 랭킹 → 영웅 특성 비율, 가이드 정본(견본 영웅·기본 탭)과 비교 → compare.json / compare.md
const fs = require('node:fs');
const path = require('node:path');
const R5 = 'C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs';
const {specs, selection} = require(R5 + '/common.cjs');
const prevR5 = require(R5 + '/judged.json');
const prevSz = require('C:/wowmeta/site/artifacts/sszorak-cycle-20261024/judged.json');
const T1215 = Date.parse('2026-10-13T15:00:00Z'), TKR = Date.parse('2026-10-15T06:00:00+09:00');
const T1027 = Date.parse('2026-10-28T00:00:00Z');
const out = []; const md = ['# 2026-10-31 영웅 특성 점검 (WCL 전 지역 랭킹 1쪽)', '', '비율 = 12.1.5 이후 행 중 영웅 특성별 비율(전체 사용률 아님). 괄호 = 10-28 이후 행. 이전 = 10-19(님리사·쐐기)/10-24(스조라크) 집계. 견본 = KB talentBuilds 영웅.', ''];
for (const s of specs()) {
  const file = path.join(__dirname, 'rankings', s.id + '.json');
  const c = JSON.parse(fs.readFileSync(file, 'utf8'));
  const m = JSON.parse(fs.readFileSync(s.canonical, 'utf8'));
  const tb = Object.fromEntries(m.talentBuilds.map(b => [b.id, b.heroLabel]));
  const defHero = m.heroBranches[m.defaultHeroBranchIndex ?? 0]?.label;
  const row = {id: s.id, role: s.role, defaultHero: defHero, builds: tb, modes: {}};
  for (const mode of ['sszorak', 'raid', 'mythic']) {
    const list = c.ALL?.data?.worldData?.[mode]?.characterRankings?.rankings || [];
    const cnt = {}, cnt2 = {}; let n = 0, n2 = 0;
    for (const r of list) {
      const t = r.server?.region === 'KR' ? TKR : T1215;
      if (r.startTime < t) continue;
      let h; try { h = selection(r, s.specId).heroTreeId; } catch { continue; }
      const lab = s.heroes.find(x => x.heroTreeId === h)?.label || String(h);
      cnt[lab] = (cnt[lab] || 0) + 1; n++;
      if (r.startTime >= T1027) { cnt2[lab] = (cnt2[lab] || 0) + 1; n2++; }
    }
    let prev = null;
    if (mode === 'sszorak') { const p = prevSz.find(e => e.id === s.id && e.scope === 'ALL'); if (p) prev = p.byHero; }
    else { const p = prevR5.find(e => e.id === s.id && e.scope === 'ALL' && e.mode === (mode === 'raid' ? 'raid' : 'mythicPlus')); if (p) prev = p.byHero; }
    row.modes[mode] = {n, cnt, n2, cnt2, prev};
  }
  out.push(row);
  const fmt = (cnt, n) => n ? Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${Math.round(v / n * 100)}%`).join('·') : '-';
  const fmtPrev = p => p ? Object.entries(p).filter(([, v]) => v.count).sort((a, b) => b[1].count - a[1].count).map(([k, v]) => `${k} ${Math.round((v.share ?? 0) * 100)}%`).join('·') : '-';
  md.push(`### ${s.id} (기본 탭 ${defHero}; 견본 단일 ${tb['single-target']}·쐐기 ${tb['mythic-plus']}·레이드 ${tb.raid})`);
  for (const [mode, ko] of [['sszorak', '스조라크'], ['raid', '님리사'], ['mythic', '쐐기']]) {
    const x = row.modes[mode];
    md.push(`- ${ko}: ${x.n}행 ${fmt(x.cnt, x.n)} (10-28 이후 ${x.n2}행 ${fmt(x.cnt2, x.n2)}) / 이전 ${fmtPrev(x.prev)}`);
  }
}
fs.writeFileSync(path.join(__dirname, 'compare.json'), JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(__dirname, 'compare.md'), md.join('\n') + '\n');
// 견본 영웅과 현재 다수가 다른 곳만 화면에 출력
const top = (cnt, n) => { const e = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]; return e ? [e[0], e[1] / n] : [null, 0]; };
for (const r of out) for (const [mode, bid] of [['sszorak', 'single-target'], ['raid', 'raid'], ['mythic', 'mythic-plus']]) {
  const x = r.modes[mode]; if (!x.n) continue;
  const [h, sh] = top(x.cnt, x.n);
  const [h2, sh2] = x.n2 ? top(x.cnt2, x.n2) : [null, 0];
  if (h !== r.builds[bid] || (h2 && h2 !== r.builds[bid] && x.n2 >= 5)) console.log(`${r.id.padEnd(22)} ${mode.padEnd(8)} 견본 ${r.builds[bid]} | 지금 ${h} ${Math.round(sh*100)}% (n=${x.n}) | 10-28 이후 ${h2 ?? '-'} ${Math.round(sh2*100)}% (n=${x.n2})`);
}
