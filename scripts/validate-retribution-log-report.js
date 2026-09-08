const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const report = require('../src/data/retributionCoiledAltarReport.json');
const kb = require('../src/data/kb-skills.json');
const source = path.resolve(__dirname, '../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/08-성기사/징벌/Meta/log-coiled-altar.json');
if (fs.existsSync(source)) assert.deepEqual(report, JSON.parse(fs.readFileSync(source, 'utf8')), 'Report DB must match source KB');
assert.equal(report.players.length, 2);
assert.deepEqual(report.players.map(p=>[p.report,p.fight,p.source]), [['nRwzFbvJ39fPTygA',44,83],['jTbHPdQyGFYZNM6x',4,3]]);
assert.equal(new Set(report.sections.map(s=>s.id)).size,report.sections.length);
for (const p of report.players) {
  assert(p.duration>0 && p.dps>0 && p.rank>=0 && p.rank<=100);
  assert(p.wings.every((t,i)=>t>=0 && t<p.duration && (!i || t>p.wings[i-1])));
}
for (const row of report.casts) {
  assert(kb.skills[row.id]?.koreanName && (kb.skills[row.id]?.iconUrls?.small || kb.skills[row.id]?.iconUrl), `Missing skill/icon: ${row.id}`);
}
for (const [i, label] of ['a','b'].entries()) {
  const rawPath = path.resolve(__dirname, `../artifacts/ret-compare-${label}.json`);
  if (!fs.existsSync(rawPath)) continue;
  const raw = JSON.parse(fs.readFileSync(rawPath,'utf8'));
  assert.equal(raw.casts.nextPageTimestamp,null,'Incomplete cast pagination');
  assert.equal((raw.fights[0].endTime-raw.fights[0].startTime)/1000,report.players[i].duration);
  for (const row of report.casts) assert.equal(raw.casts.data.filter(e=>e.type==='cast' && e.abilityGameID===row.id).length,row[label],`Cast mismatch ${label}:${row.id}`);
  assert(Math.abs(raw.damage.data.entries.reduce((sum,e)=>sum+e.total,0)/report.players[i].duration-report.players[i].dps)<0.01);
  for (const event of report.opener[i]) assert(raw.casts.data.some(e=>e.type==='cast' && e.abilityGameID===event.id && Math.abs((e.timestamp-raw.fights[0].startTime)/1000-event.t)<0.001));
  const eventPath = path.resolve(__dirname, `../artifacts/ret-compare-${label}-events.json`);
  if (fs.existsSync(eventPath)) {
    const events = JSON.parse(fs.readFileSync(eventPath,'utf8'));
    const resources = events.resources.filter(e=>e.resourceChangeType===9);
    assert.equal(resources.reduce((sum,e)=>sum+e.resourceChange,0),report.resources[label].generated);
    assert.equal(resources.reduce((sum,e)=>sum+(e.waste||0),0),report.resources[label].waste);
    assert.equal(resources.filter(e=>e.abilityGameID===255937).reduce((sum,e)=>sum+(e.waste||0),0),report.resources[label].wakeWaste);
    const names = new Map(raw.masterData.actors.map(a=>[a.id,a.name]));
    for (const row of report.targets) assert.equal(events.damageEvents.filter(e=>e.type==='damage' && names.get(e.targetID)===row.name).reduce((sum,e)=>sum+(e.amount||0),0),row[label]);
  }
}
console.log('Retribution log report: KB/DB, actor scope, metrics, icons and available raw evidence passed');
