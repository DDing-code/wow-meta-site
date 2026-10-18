// 2)~3) 기준 시각 이후 행만 거르고 영웅 트리 판정·집계 → judged.json
const fs = require('node:fs');
const path = require('node:path');
const {specs, selection, THRESHOLD} = require('./common.cjs');
const tDefault = Date.parse(THRESHOLD.default), tKR = Date.parse(THRESHOLD.KR);
const out = [];
for (const s of specs()) {
  const file = path.join(__dirname,'rankings',s.id+'.json');
  const cached = JSON.parse(fs.readFileSync(file,'utf8'));
  for (const scope of ['ALL','KR']) for (const [mode,alias] of [['raid','raid'],['mythicPlus','mythic']]) {
    const base = {id:s.id, mode, scope, encounterId:mode==='raid'?3379:s.mythicEncounter, specId:s.specId, heroes:s.heroes.map(h=>({label:h.label,heroTreeId:h.heroTreeId}))};
    const part = cached[scope];
    const ranking = part?.data?.worldData?.[alias]?.characterRankings;
    if (!ranking) { out.push({...base, error: part?.error || '응답 없음'}); continue; }
    const rows = ranking.rankings || [];
    const judged = rows.map((r,rank)=>{
      const region = r.server?.region || null;
      const threshold = region==='KR' ? tKR : tDefault;
      let hero; try { hero = selection(r, s.specId); } catch (e) { hero = {heroTreeId:null, selectionEntries:[], unverified:(r.talents||[]).length ? e.message : '랭킹 응답의 talents 비어 있음(전투원 정보 없음)'}; }
      const h = s.heroes.find(x=>x.heroTreeId===hero.heroTreeId);
      return {rank:rank+1, name:r.name, amount:r.amount, region, server:r.server?.name ?? null, startedAt:new Date(r.startTime).toISOString(),
        after: region ? r.startTime>=threshold : null, report:r.report, url:`https://www.warcraftlogs.com/reports/${r.report.code}#fight=${r.report.fightID}`,
        bracket:r.bracketData, heroTreeId:hero.heroTreeId, heroLabel:h?.label ?? null, selectionEntries:hero.selectionEntries, unverified:hero.unverified};
    });
    const after = judged.filter(r=>r.after===true);
    const byHero = {};
    for (const h of s.heroes) { const c = after.filter(r=>r.heroTreeId===h.heroTreeId).length; byHero[h.label] = {heroTreeId:h.heroTreeId, count:c}; }
    const undetermined = after.filter(r=>!r.heroLabel).length;
    const judgedN = after.length - undetermined;
    for (const k in byHero) byHero[k].share = judgedN ? Math.round(byHero[k].count/judgedN*1000)/1000 : null;
    const regions = {}; for (const r of judged) regions[r.region||'(없음)'] = (regions[r.region||'(없음)']||0)+1;
    out.push({...base, page:ranking.page, hasMorePages:ranking.hasMorePages, rowsTotal:rows.length, rowsAfter:after.length,
      rowsBefore:judged.filter(r=>r.after===false).length, missingRegion:judged.filter(r=>r.region===null).length,
      undetermined, regions, earliest:judged.map(r=>r.startedAt).sort()[0]??null, latest:judged.map(r=>r.startedAt).sort().at(-1)??null,
      byHero, rows:judged});
  }
}
fs.writeFileSync(path.join(__dirname,'judged.json'), JSON.stringify(out,null,1));
for (const e of out) console.log(e.id.padEnd(22), e.mode.padEnd(10), e.scope.padEnd(3), e.error ? 'ERR '+e.error : `${e.rowsAfter}/${e.rowsTotal} 미판정${e.undetermined} 지역없음${e.missingRegion} `+Object.entries(e.byHero).map(([k,v])=>`${k}:${v.count}`).join(' ')+` [${e.earliest?.slice(0,10)}~${e.latest?.slice(0,10)}]`);
