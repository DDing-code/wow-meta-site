// 스조라크(3420) 신화 · 12.1.5 구간(partition 2) 딜러 전문화 characterRankings 1~2쪽 (전 지역, KR). 캐시: rankings/<id>.json
const fs = require('node:fs');
const path = require('node:path');
const R5 = 'C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs';
const {specs, req, pool} = require(R5 + '/common.cjs');
const dir = path.join(__dirname, 'rankings');
const PAGES = {ALL: [1, 2], KR: [1]};
async function one(s) {
  const file = path.join(dir, s.id + '.json');
  const cached = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {id: s.id};
  for (const region of ['ALL', 'KR']) for (const page of PAGES[region]) {
    const k = region + page;
    if (cached[k]?.data) continue;
    const args = `className:"${s.className}",specName:"${s.specName}",${region === 'KR' ? 'serverRegion:"KR",' : ''}metric:${s.metric},includeCombatantInfo:true,partition:2,difficulty:5,page:${page}`;
    const query = `{worldData{raid:encounter(id:3420){characterRankings(${args})}}}`;
    try { cached[k] = {checkedAt: new Date().toISOString(), query, data: await req(query, s.id + ' ' + k)}; }
    catch (e) { cached[k] = {checkedAt: new Date().toISOString(), query, error: String(e.message).slice(0, 500)}; }
    fs.writeFileSync(file, JSON.stringify(cached));
  }
  const n = k => cached[k]?.data?.worldData?.raid?.characterRankings?.rankings?.length ?? 'ERR';
  console.log(`${s.id} ALL1 ${n('ALL1')} ALL2 ${n('ALL2')} KR ${n('KR1')}`);
}
(async () => {
  fs.mkdirSync(dir, {recursive: true});
  const list = specs().filter(s => s.role !== 'tanks' && s.role !== 'healers');
  console.log('전문화', list.length);
  await pool(process.argv[2] ? list.filter(s => s.id === process.argv[2]) : list, 3, one);
})().catch(e => { console.error(e.message); process.exitCode = 1; });
