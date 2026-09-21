const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const report = require('../src/data/pealMythicReport.json');
const kb = require('../src/data/kb-skills.json');
const byKey = new Map(report.fights.map(f => [f.key,f]));
assert.equal(byKey.size,12);
assert.equal(report.patch,'12.1');
assert.equal(report.fights.filter(f=>f.key.startsWith('p')).length,5);
for(const f of report.fights) {
  assert(/^[A-Za-z0-9]{16}$/.test(f.code));
  assert(f.actor>0 && f.duration>0 && f.dps>0 && f.rawEvents>0);
  assert.equal(f.cursor,null);
  assert(Math.abs(f.damage.reduce((sum,d)=>sum+d.total,0)/f.duration-f.dps)<0.001);
  assert.equal(f.targets.reduce((sum,d)=>sum+d.total,0),f.total);
  for(const times of Object.values(f.times)) for(let i=0;i<times.length;i++) {
    assert(times[i]>=0 && times[i]<=f.duration);
    if(i) assert(times[i]>=times[i-1]);
  }
  if(f.key.startsWith('p')) {
    const r=byKey.get(`r${f.key.slice(1)}`);
    assert.equal(r.encounter,f.encounter);
    assert.equal(r.ilvl,f.ilvl);
    assert(Math.abs(r.duration-f.duration)<15);
    assert(r.topPagePosition>=1 && r.topPagePosition<=100);
  }
  const rawPath=path.join(__dirname,'../artifacts/peal-mythic',`${f.key}-detail.json`);
  if(fs.existsSync(rawPath)) {
    const raw=JSON.parse(fs.readFileSync(rawPath)).response.data.reportData.report;
    assert.equal(raw.casts.nextPageTimestamp,null);
    assert.equal(raw.summary.data.damageDone.find(p=>p.id===f.actor).total,f.total);
    for(const [id,times] of Object.entries(f.times)) assert.deepEqual(times,raw.casts.data.filter(e=>e.sourceID===f.actor && e.type==='cast' && !e.fake && e.abilityGameID===Number(id)).map(e=>(e.timestamp-f.start)/1000));
    assert.equal(f.deaths.length,raw.deaths.data.filter(e=>e.type==='death' && e.targetID===f.actor).length);
  }
}
assert.equal(byKey.get('pNym').lastCast,286.586);
assert.equal(byKey.get('pNym').deaths[0].t,337.321);
assert.equal(byKey.get('pVash').times[383269].length,1);
assert.equal(byKey.get('rVash').times[383269].length,27);
assert.equal(byKey.get('pVash').times[1242174].length,35);
assert.equal(byKey.get('pSentinel').times[42650].length,5);
assert(byKey.get('pSentinel').duration-byKey.get('pSentinel').times[42650].at(-1)<2.5);
assert(byKey.get('pExplore').duration-byKey.get('pExplore').times[42650].at(-1)<0.21);
assert.equal(byKey.get('pNek').hero,'산레인');
assert.equal(byKey.get('rNek').hero,'종말의 기수');
for(const id of [42650,1233448,1247378,458128,55090,47541,1242174,383269,343294,377514,207317,49530]) assert(kb.skills[id]?.iconUrls?.small);
assert.equal(new Set(report.sections.map(s=>s.id)).size,report.sections.length);
const canonical=path.resolve(__dirname,'../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/01-죽음의기사/부정/Meta/log-peal-mythic.json');
if(fs.existsSync(canonical)) assert.deepEqual(JSON.parse(fs.readFileSync(canonical)),report);
console.log('Peal report: 12 fights, DPS/targets, source scope, pagination, replacement casts, death timeline and KB synchronization passed.');
