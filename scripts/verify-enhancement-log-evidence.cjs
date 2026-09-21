const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.join(__dirname, '../artifacts/enhancement-12.1');
const rankings = require(path.join(root, 'wcl-heroic-and-keys.json')).response.data.worldData;
const metadata = require(path.join(root, 'wcl-representative-metadata.json')).response.data.reportData;
const events = require(path.join(root, 'wcl-representative-casts.json')).response.data.reportData;

for (const [key, expected] of [['heroic', 100], ['keys', 89]]) {
  const rows = rankings[key].characterRankings.rankings;
  assert.equal(rows.length, 100);
  const known = rows.filter(row => row.talents.length);
  assert.equal(known.length, expected);
  assert.equal(known.filter(row => row.talents.some(t => t.talentID === 117489)).length, expected);
  const unknown = rows.filter(row => !row.talents.length);
  assert(unknown.every(row => row.gear.every(item => item.id === null)));
}

for (const [key, count, duration] of [['raid', 5, 578550], ['dungeon', 12, 1768493]]) {
  const result = events[key].events;
  assert.equal(result.nextPageTimestamp, null, 'Evidence must include all cast pages');
  const casts = result.data.filter(event => event.type === 'cast');
  assert.equal(casts.filter(event => event.abilityGameID === 114051).length, count);
  assert.equal(casts.filter(event => [197214, 1218090].includes(event.abilityGameID)).length, 0);
  const fight = metadata[key].fights[0];
  assert.equal(fight.endTime - fight.startTime, duration);
  assert(casts.every(event => event.timestamp >= fight.startTime && event.timestamp <= fight.endTime));
}
const raid = events.raid.events.data.filter(event => event.type === 'cast');
assert.deepEqual(raid.slice(0, 5).map(event => event.abilityGameID), [470057, 17364, 187874, 17364, 114051]);
assert.deepEqual(raid.slice(0, 5).map(event => event.timestamp - metadata.raid.fights[0].startTime), [1645, 2888, 4185, 5422, 6768]);
assert(raid.some(event => event.abilityGameID === 452201 && raid.some(other => other.abilityGameID === 115356 && other.timestamp === event.timestamp)));
console.log('Enhancement snapshot counts, missing-data denominators, cast pagination and opener evidence passed. Not a live ranking or resource-loss audit.');
