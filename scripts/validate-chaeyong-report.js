const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const report = require('../src/data/chaeyongMythicReport.json');
const kb = require('../src/data/kb-skills.json');
const byKey = new Map(report.fights.map(f => [f.key,f]));
const subjects = report.fights.filter(f => f.key.startsWith('p'));
assert.equal(report.fights.length,11);
assert.equal(byKey.size,11);
assert.equal(subjects.length,5);
assert.equal(new Set(subjects.map(f => f.encounter)).size,5);
assert.equal(report.patch,'12.1');
for (const f of report.fights) {
  assert(/^[A-Za-z0-9]{16}$/.test(f.code));
  assert(f.actor>0 && f.fight>0 && f.duration>0 && f.hps>0);
  assert(f.tier>=4 && f.rawEvents.healing>0 && f.rawEvents.outgoingBuffs>0);
  assert(Math.abs(f.heals.reduce((sum,h)=>sum+h.total,0)/f.duration-f.hps)<0.002);
  assert(Math.abs(f.hps/f.healers.reduce((sum,h)=>sum+h.hps,0)*100-f.healerShare)<0.002);
  for (const e of f.capRefresh) {
    assert(e.t>=0 && e.t<=f.duration);
    assert.equal(e.inner,f.inner.some(([start,end])=>start<=e.t && e.t<end));
  }
  const rawFile=path.join(__dirname,'..','artifacts',`chaeyong-events-${f.key}.json`);
  if(fs.existsSync(rawFile)) {
    const raw=JSON.parse(fs.readFileSync(rawFile,'utf8'));
    assert.equal(raw.fight.difficulty,5);
    assert.equal(raw.fight.kill,true);
    assert.equal(raw.fight.encounterID,f.encounter);
    assert.equal(raw.healing.length,f.rawEvents.healing);
    for(const key of ['healing','buffs'])assert.equal(raw.queries.filter(q=>q.key===key).at(-1).nextPageTimestamp,null);
  }
}
for (const f of subjects) {
  const r=byKey.get(`r${f.key.slice(1)}`);
  assert.equal(r.encounter,f.encounter);
  assert.equal(r.healers.length,f.healers.length);
  assert(Math.abs(r.duration-f.duration)<4);
  assert(Math.abs(r.ilvl-f.ilvl)<=2);
  assert(f.rank>=0 && f.rank<=100);
  assert(r.topPagePosition>=1 && r.topPagePosition<=100);
}
assert.equal(byKey.get('pSentinel').counts[364343],33);
assert.equal(byKey.get('rSentinel').counts[364343],95);
assert.equal(byKey.get('pSentinel').capRefresh.filter(e=>!e.inner).length,36);
assert.equal(byKey.get('pSentinel').replays[0].manual,false);
assert.deepEqual(byKey.get('pSentinel').replays[0].replayed,[355941,355941,373861]);
assert.deepEqual(byKey.get('pSentinel').replays.at(-1).replayed,[]);
assert.equal(byKey.get('pSentinel').death[0],420.614);
for(const id of [364343,355913,373861,355936,360995,1256581,1242031,1242745,369299,370537,363534,366155,444088,357208])assert(kb.skills[id]?.iconUrls?.small,`Missing KB icon: ${id}`);
const canonical=path.resolve(__dirname,'../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/04-기원사/보존/Meta/log-chaeyong-mythic.json');
if(fs.existsSync(canonical))assert.deepEqual(JSON.parse(fs.readFileSync(canonical,'utf8')),report,'Canonical KB and site DB differ');
assert.equal(new Set(report.sections.map(s=>s.id)).size,report.sections.length);
for(const s of report.sections)for(const id of s.sourceIds)assert(report.sources.some(x=>x.id===id));
console.log('Chaeyong report: 11 fights, matching conditions, healing totals, event pagination, KB links and Stasis regression checks passed.');
