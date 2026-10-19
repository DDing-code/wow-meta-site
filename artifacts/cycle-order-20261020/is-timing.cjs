// 복수 불지옥 일격 피해(189112)의 첫 적중 시각과 적중 묶음(1초 안 = 한 번 사용) 수를 센다.
const fs = require('node:fs');
const {req} = require('C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs/common.cjs');
(async () => {
  for (const f of fs.readdirSync(__dirname + '/events').filter(f => f.startsWith('demonhunter-vengeance'))) {
    const j = JSON.parse(fs.readFileSync(__dirname + '/events/' + f, 'utf8'));
    if (!j.fight) continue;
    const code = j.url.match(/reports\/(\w+)/)[1];
    const info = await req(`{reportData{report(code:"${code}"){fights(fightIDs:[${j.fight.id}]){startTime endTime}}}}`, f + ' f');
    const {startTime, endTime} = info.reportData.report.fights[0];
    const d = await req(`{reportData{report(code:"${code}"){events(startTime:${startTime},endTime:${endTime},sourceID:${j.player.id},dataType:DamageDone,abilityID:189112,limit:10000){data}}}}`, f);
    const t = d.reportData.report.events.data.filter(x => x.type === 'damage').map(x => (x.timestamp - startTime) / 1000);
    const uses = []; for (const x of t) if (!uses.length || x - uses[uses.length - 1] > 1) uses.push(x);
    const min = j.fight.durationMs / 60000;
    console.log(j.mode, j.heroLabel, j.name, `사용 ${uses.length}회(분당 ${(uses.length / min).toFixed(2)})`, '첫 사용', uses[0] != null ? uses[0].toFixed(1) + '초' : '-');
  }
})();
