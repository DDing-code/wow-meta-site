// 2026-10-31 메타 최신성 점검: 40개 전문화 × (님리사 3379 신화·스조라크 3420 신화, 12.1.5 구간 partition 2 / 쐐기 시즌) 전 지역 랭킹 1쪽.
// 기존 goal-12.1.5-r5/logs/common.cjs(읽기만)의 전문화 목록·WCL 요청을 쓴다. 캐시: rankings/<id>.json
const fs = require('node:fs');
const path = require('node:path');
const R5 = 'C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs';
const {specs, req, pool} = require(R5 + '/common.cjs');
const dir = path.join(__dirname, 'rankings');
async function one(s) {
  const file = path.join(dir, s.id + '.json');
  const cached = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {id: s.id};
  if (!cached.ALL?.data) {
    const a = `className:"${s.className}",specName:"${s.specName}",metric:${s.metric},includeCombatantInfo:true,page:1`;
    const query = `{worldData{raid:encounter(id:3379){characterRankings(${a},partition:2,difficulty:5)} sszorak:encounter(id:3420){characterRankings(${a},partition:2,difficulty:5)} mythic:encounter(id:${s.mythicEncounter}){characterRankings(${a})}}}`;
    try { cached.ALL = {checkedAt: new Date().toISOString(), query, data: await req(query, s.id)}; }
    catch (e) { cached.ALL = {checkedAt: new Date().toISOString(), query, error: String(e.message).slice(0, 500)}; }
    fs.writeFileSync(file, JSON.stringify(cached));
  }
  const n = k => cached.ALL?.data?.worldData?.[k]?.characterRankings?.rankings?.length ?? 'ERR';
  console.log(`${s.id} raid ${n('raid')} sszorak ${n('sszorak')} mythic ${n('mythic')}`);
}
(async () => {
  fs.mkdirSync(dir, {recursive: true});
  const list = specs();
  await pool(process.argv[2] ? list.filter(s => s.id === process.argv[2]) : list, 3, one);
})().catch(e => { console.error(e.message); process.exitCode = 1; });
