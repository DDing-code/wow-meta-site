const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const report = require('../src/data/ragereaverHeroicReport.json');
const kb = require('../src/data/kb-skills.json');
const source = path.resolve(__dirname, '../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/12-흑마법사/악마/Meta/log-ragereaver-heroic.json');
if (fs.existsSync(source)) assert.deepEqual(report, JSON.parse(fs.readFileSync(source,'utf8')), 'Report DB must match KB');
assert.equal(report.character.name, 'Ragereaver');
assert.equal(report.difficulty, 4);
const byKey = new Map(report.fights.map(f => [f.key, f]));
assert.equal(byKey.size, report.fights.length);
for (const key of report.currentKeys) assert.equal(byKey.get(key)?.name, 'Ragereaver');
for (const comparison of report.comparisons) {
  const a = byKey.get(comparison.subject), b = byKey.get(comparison.reference);
  assert(a && b && a.encounter === b.encounter && a.spec === b.spec, 'Compare matching bosses and specs');
}
for (const f of report.fights) {
  assert(f.duration > 0 && f.rank >= 0 && f.rank <= 100);
  assert(Math.abs(f.totalDamage / f.duration - f.dps) < 0.01, 'DPS denominator mismatch '+f.key);
  for (const c of f.cooldowns) assert(c.t >= 0 && c.t <= f.duration);
  for (const d of f.deaths) assert(d.t >= 0 && d.t <= f.duration && (d.resurrect == null || d.resurrect >= d.t));
  const rawPath = path.resolve(__dirname, '../artifacts/ragereaver-'+f.key+'.json');
  if (!fs.existsSync(rawPath)) continue;
  const raw = JSON.parse(fs.readFileSync(rawPath,'utf8'));
  assert.equal(raw.casts.nextPageTimestamp,null);
  assert.equal(raw.fights[0].difficulty,4);
  assert.equal(raw.fights[0].id,f.fight);
  assert.equal(raw.masterData.actors.find(a=>a.id===f.actor)?.name,f.name);
  assert.equal((raw.fights[0].endTime-raw.fights[0].startTime)/1000,f.duration);
  for (const [id,count] of Object.entries(f.counts)) assert.equal(raw.casts.data.filter(e=>e.type==='cast' && e.sourceID===f.actor && e.abilityGameID===Number(id)).length,count,'Cast mismatch '+f.key+':'+id);
}
for (const id of [265187,104316,105174,264178,1276452,196277,428522,1276222,1122,442726,445468,80240,116858,17877,80353,10060,395152,409311]) assert(kb.skills[id]?.koreanName && kb.skills[id]?.iconUrls?.small, 'Missing spell '+id);
console.log('Ragereaver report: KB/DB, internal metrics, comparison scope and spell references passed; raw checks run only when available.');
