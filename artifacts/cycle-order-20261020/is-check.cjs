// 복수 불지옥 일격: 시전 표가 아니라 피해 표·시전 표 합계에도 없는지 확인한다.
const fs = require('node:fs');
const {req} = require('C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs/common.cjs');
(async () => {
  const files = fs.readdirSync(__dirname + '/events').filter(f => f.startsWith('demonhunter-vengeance'));
  let hits = 0;
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(__dirname + '/events/' + f, 'utf8'));
    if (!j.fight) continue;
    const code = j.url.match(/reports\/(\w+)/)[1];
    const fid = j.fight.id;
    const d = await req(`{reportData{report(code:"${code}"){dmg:table(fightIDs:[${fid}],dataType:DamageDone,sourceID:${j.player.id}) cast:table(fightIDs:[${fid}],dataType:Casts,sourceID:${j.player.id})}}}`, f);
    const r = d.reportData.report;
    const ents = x => (x.data.entries || []).map(e => `${e.guid}:${e.name}(${e.hitCount ?? e.total ?? ''}회)`);
    const all = [...ents(r.dmg), ...ents(r.cast)].filter(s => /Infernal|18911/.test(s));
    if (all.length) hits++;
    console.log(j.mode, j.heroLabel, j.name, Math.round(j.fight.durationMs/60000)+'분', all.length ? all.join(', ') : '없음');
  }
  console.log(`불지옥 일격이 보인 로그 ${hits}/${files.filter(f=>JSON.parse(fs.readFileSync(__dirname + '/events/' + f,'utf8')).fight).length}`);
})();
