// 4) 전문화×모드×범위(ALL/KR)마다 12.1.5 이후 영웅 트리별 최상위 1개 전투의 casts table. 원본: combats/<id>-<mode>-<code>-<fight>.json
const fs = require('node:fs');
const path = require('node:path');
const {req, pool} = require('./common.cjs');
const judged = require('./judged.json');
const dir = path.join(__dirname,'combats');
const scopes = (process.argv[2]||'ALL,KR').split(',');
function tasks() {
  const t = [], seen = new Set();
  for (const e of judged) {
    if (e.error || !scopes.includes(e.scope)) continue;
    for (const h of e.heroes) {
      const row = e.rows.find(r=>r.after===true && r.heroTreeId===h.heroTreeId);
      if (!row) continue;
      const key = `${e.id}-${e.mode}-${row.report.code}-${row.report.fightID}`;
      t.push({e, h, row, key, dup:seen.has(key)}); seen.add(key);
    }
  }
  return t;
}
async function one({e, h, row, key}) {
  const file = path.join(dir, key+'.json');
  if (fs.existsSync(file)) { const c = JSON.parse(fs.readFileSync(file,'utf8')); if (!c.error) return c; }
  const {code, fightID:id} = row.report;
  try {
    const report = (await req(`{reportData{report(code:"${code}"){code startTime region{slug} fights(fightIDs:[${id}]){id name encounterID difficulty kill startTime endTime keystoneLevel keystoneTime} playerDetails(fightIDs:[${id}])}}}`, key)).reportData.report;
    const fight = report.fights.find(f=>f.id===id);
    const ranking = require(`./rankings/${e.id}.json`)[e.scope].data.worldData[e.mode==='raid'?'raid':'mythic'].characterRankings.rankings.find(r=>r.report.code===code&&r.report.fightID===id&&r.name===row.name);
    const players = Object.values(report.playerDetails.data.playerDetails).flat();
    const player = players.find(p=>p.name===row.name && p.specs?.some(s=>s.spec===ranking.spec)) || players.find(p=>p.name===row.name);
    if (!player?.id) throw new Error('playerDetails 에서 플레이어를 찾지 못함: '+row.name);
    const checks = {kill:fight?.kill===true, encounter:fight?.encounterID===e.encounterId, difficultyOrKey:e.mode==='raid'?fight?.difficulty===5:fight?.keystoneLevel>0,
      startMatchesRanking:fight ? Math.abs(report.startTime+fight.startTime-Date.parse(row.startedAt))<1000 : false};
    const tables = (await req(`{reportData{report(code:"${code}"){casts:table(fightIDs:[${id}],sourceID:${player.id},dataType:Casts)}}}`, key+' casts')).reportData.report;
    const entries = tables.casts?.data?.entries || [];
    const topCasts = [...entries].sort((a,b)=>b.total-a.total).slice(0,15).map(x=>({id:x.guid, name:x.name, count:x.total}));
    const result = {guideId:e.id, mode:e.mode, scope:e.scope, checkedAt:new Date().toISOString(), url:row.url+'&source='+player.id, startedAt:row.startedAt,
      region:row.region, reportRegion:report.region?.slug ?? null, server:row.server, name:row.name, rank:row.rank, amount:row.amount, bracket:row.bracket,
      heroTreeId:h.heroTreeId, heroLabel:h.label, selectionEntries:row.selectionEntries, fight, player:{id:player.id, name:player.name, type:player.type, specs:player.specs},
      checks, topCasts, castEntries:entries.length, tables,
      scope_note:'랭킹 상위 개별 전투의 시전 횟수. 장비·외부 강화·전투 조건을 통제한 영웅 성능 비교가 아님.'};
    fs.writeFileSync(file, JSON.stringify(result));
    return result;
  } catch (err) {
    const result = {guideId:e.id, mode:e.mode, scope:e.scope, url:row.url, heroLabel:h.label, error:String(err.message).slice(0,500)};
    fs.writeFileSync(file, JSON.stringify(result));
    return result;
  }
}
(async()=>{
  fs.mkdirSync(dir,{recursive:true});
  const list = tasks().filter(t=>!t.dup);
  const limit = process.argv[3] ? Number(process.argv[3]) : list.length;
  let done = 0;
  const res = await pool(list.slice(0,limit), 3, async t=>{ const r = await one(t); done++; if (done%10===0 || r.error) console.log(`${done}/${Math.min(limit,list.length)} ${t.key} ${r.error||'ok'}`); return r; });
  console.log(JSON.stringify({tasks:Math.min(limit,list.length), errors:res.filter(r=>r.error).length}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
