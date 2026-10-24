// 랭킹 행의 영웅 트리 판정 → judged.json (12.1.5 구간이지만 기준 시각도 함께 확인)
const fs = require('node:fs');
const path = require('node:path');
const R5 = 'C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs';
const {specs, selection, THRESHOLD} = require(R5 + '/common.cjs');
const tDefault = Date.parse(THRESHOLD.default), tKR = Date.parse(THRESHOLD.KR);
const out = [];
for (const s of specs().filter(s => s.role !== 'tanks' && s.role !== 'healers')) {
  const cached = JSON.parse(fs.readFileSync(path.join(__dirname, 'rankings', s.id + '.json'), 'utf8'));
  for (const scope of ['ALL', 'KR']) {
    const rows = Object.keys(cached).filter(k => k.startsWith(scope)).sort().flatMap(k => cached[k]?.data?.worldData?.raid?.characterRankings?.rankings || []);
    const judged = rows.map((r, i) => {
      const region = r.server?.region || null;
      const threshold = region === 'KR' ? tKR : tDefault;
      let hero; try { hero = selection(r, s.specId); } catch (e) { hero = {heroTreeId: null, unverified: e.message}; }
      const h = s.heroes.find(x => x.heroTreeId === hero.heroTreeId);
      return {rank: i + 1, name: r.name, amount: r.amount, duration: r.duration, region, server: r.server?.name ?? null, startedAt: new Date(r.startTime).toISOString(),
        after: region ? r.startTime >= threshold : null, report: r.report, url: `https://www.warcraftlogs.com/reports/${r.report.code}#fight=${r.report.fightID}`,
        heroTreeId: hero.heroTreeId, heroLabel: h?.label ?? null};
    });
    const after = judged.filter(r => r.after === true);
    const byHero = Object.fromEntries(s.heroes.map(h => [h.label, after.filter(r => r.heroTreeId === h.heroTreeId).length]));
    out.push({id: s.id, scope, specId: s.specId, heroes: s.heroes.map(h => ({label: h.label, heroTreeId: h.heroTreeId})), rowsTotal: rows.length, rowsAfter: after.length, undetermined: after.filter(r => !r.heroLabel).length, byHero, rows: judged});
  }
}
fs.writeFileSync(path.join(__dirname, 'judged.json'), JSON.stringify(out, null, 1));
for (const e of out) console.log(e.id.padEnd(22), e.scope.padEnd(3), `${e.rowsAfter}/${e.rowsTotal} 미판정${e.undetermined}`, JSON.stringify(e.byHero));
