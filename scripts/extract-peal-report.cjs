const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../artifacts/peal-mythic');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const selected = read('selection.json');
const ranks = read('rankings.json').response.data;
const fights = selected.map(s => {
  const raw = read(`${s.key}-detail.json`).response.data.reportData.report;
  assert.equal(raw.casts.nextPageTimestamp, null);
  assert.equal(raw.deaths.nextPageTimestamp, null);
  const own = ranks.characterData.character[`e${s.encounter}`].ranks;
  const top = ranks.worldData[`e${s.encounter}`].characterRankings.rankings;
  const ranking = [...own, ...top].find(r => r.report.code === s.code && r.report.fightID === s.fight && (r.name === undefined || r.name === s.name));
  assert(ranking);
  const duration = (s.end - s.start) / 1000;
  const casts = raw.casts.data.filter(e => e.sourceID === s.actor && e.type === 'cast' && !e.fake);
  const times = {};
  for (const e of casts) (times[e.abilityGameID] ||= []).push((e.timestamp - s.start) / 1000);
  const damage = raw.damage.data.entries.map(e => ({ id: e.guid, name: e.name, total: e.total }));
  const total = damage.reduce((sum, e) => sum + e.total, 0);
  assert(Math.abs(total / duration - ranking.amount) < 0.01);
  const player = Object.values(raw.summary.data.playerDetails).flat().find(p => p.id === s.actor);
  assert(player && player.icon === 'DeathKnight-Unholy');
  assert.equal(raw.summary.data.damageDone.find(p => p.id === s.actor).total, total);
  const buffs = raw.buffs.data.auras.map(a => ({ id: a.guid, name: a.name, uptime: a.totalUptime / 1000, uses: a.totalUses }));
  return { ...s, duration, date: ranking.startTime, ilvl: ranking.bracketData, dps: total / duration, rank: ranking.historicalPercent ?? null,
    topPagePosition: s.key.startsWith('r') ? top.indexOf(ranking) + 1 : null,
    hero: buffs.some(b => b.id === 434261) ? '산레인' : '종말의 기수',
    total, damage, targets: raw.targets.data.entries.map(e => ({ name: e.name, total: e.total })),
    times, buffs, talents: player.combatantInfo.talentTree,
    deaths: raw.deaths.data.filter(e => e.type === 'death' && e.targetID === s.actor).map(e => ({ t: (e.timestamp - s.start) / 1000, ability: e.killingAbilityGameID })),
    lastCast: (casts.at(-1).timestamp - s.start) / 1000,
    rawEvents: raw.casts.data.length, cursor: raw.casts.nextPageTimestamp };
});
fs.writeFileSync(path.join(root, 'metrics.json'), `${JSON.stringify(fights, null, 2)}\n`);
console.log('Extracted 12 fights; source scope, pagination and damage totals verified.');
