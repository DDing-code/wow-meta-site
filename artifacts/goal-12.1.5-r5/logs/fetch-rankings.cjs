// 1) 40개 전문화 × (전 지역, KR) × (레이드 3379 신화, 쐐기) characterRankings 첫 페이지. 캐시: rankings/<id>.json
const fs = require('node:fs');
const path = require('node:path');
const {specs, req, pool} = require('./common.cjs');
const dir = path.join(__dirname,'rankings');
async function one(s) {
  const file = path.join(dir, s.id+'.json');
  const cached = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : {id:s.id};
  for (const region of ['ALL','KR']) {
    if (cached[region]?.data) continue;
    const args = `className:"${s.className}",specName:"${s.specName}",${region==='KR'?'serverRegion:"KR",':''}metric:${s.metric},includeCombatantInfo:true,page:1`;
    const query = `{worldData{raid:encounter(id:3379){characterRankings(${args},difficulty:5)} mythic:encounter(id:${s.mythicEncounter}){characterRankings(${args})}}}`;
    try {
      const data = await req(query, s.id+' '+region);
      cached[region] = {checkedAt:new Date().toISOString(), query, data};
    } catch (e) { cached[region] = {checkedAt:new Date().toISOString(), query, error:String(e.message).slice(0,500)}; }
    fs.writeFileSync(file, JSON.stringify(cached));
  }
  const n = r => ['raid','mythic'].map(a=>cached[r]?.data?.worldData[a]?.characterRankings?.rankings?.length ?? 'ERR').join('/');
  console.log(`${s.id} ALL ${n('ALL')} KR ${n('KR')}`);
}
(async()=>{
  fs.mkdirSync(dir,{recursive:true});
  const list = specs();
  const only = process.argv[2];
  await pool(only?list.filter(s=>s.id===only):list, 3, one);
})().catch(e=>{console.error(e.message);process.exitCode=1;});
