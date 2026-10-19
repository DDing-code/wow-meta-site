// 방어 전사 견본·상위 랭킹 행에 천둥군주(385840)가 있는지 센다.
const fs = require('node:fs');
const {D} = require('./encode-talents.cjs');
const {kbGuidePath} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const LOGS = 'C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs';
const id = process.argv[2] || 'warrior-protection';
const spell = Number(process.argv[3] || 385840);
const g = JSON.parse(fs.readFileSync(kbGuidePath(id).file, 'utf8'));
for (const b of g.talentBuilds) {
  const d = D.decode(b.code);
  const has = d.selected.some(t => t.purchased && t.spell === spell);
  console.log('견본', b.id || b.title || b.label, '영웅', d.hero, has ? '있음' : '없음');
}
const raw = require(`${LOGS}/rankings/${id}.json`);
const entry = D.traits.find(t => t.spell === spell);
for (const key of ['raid', 'mythic']) for (const scope of Object.keys(raw)) {
  const list = raw[scope]?.data?.worldData?.[key]?.characterRankings?.rankings || [];
  const rows = list.filter(r => r.talents);
  const n = rows.filter(r => r.talents.some(t => t.talentID === entry.entry)).length;
  if (rows.length) console.log(key, scope, `${n}/${rows.length}`);
}
