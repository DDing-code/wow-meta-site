// 상위 랭킹 행에서 특정 특성(영문 이름)을 고른 비율을 영웅 트리·모드별로 센다.
// 사용: node talent-share.cjs <가이드 ID> "<영문 이름>" [...]
const {D} = require('./encode-talents.cjs');
const LOGS = 'C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs';
const [id, ...names] = process.argv.slice(2);
const judged = require(LOGS + '/judged.json').filter(e => e.id === id);
const raw = require(`${LOGS}/rankings/${id}.json`);
const entries = new Map(names.map(n => [n, new Set(D.traits.filter(t => t.name === n).map(t => t.entry))]));
for (const e of judged) {
  const list = raw[e.scope]?.data?.worldData?.[e.mode === 'raid' ? 'raid' : 'mythic']?.characterRankings?.rankings || [];
  for (const h of e.heroes) {
    const rows = e.rows.filter(r => r.after === true && r.heroTreeId === h.heroTreeId).map(r => list.find(x => x.report.code === r.report.code && x.report.fightID === r.report.fightID && x.name === r.name)).filter(x => x?.talents);
    if (!rows.length) continue;
    console.log(`${e.mode} ${e.scope} ${h.label}: ${rows.length}행 —`, names.map(n => `${n} ${rows.filter(r => r.talents.some(t => entries.get(n).has(t.talentID))).length}`).join(', '));
  }
}
