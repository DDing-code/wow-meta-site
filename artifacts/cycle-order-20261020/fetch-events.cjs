// 딜사이클 순서 대조용: 12.1.5 이후 상위 로그의 실제 시전 순서(cast 이벤트)를 받는다.
// 대상 행은 r5 judged.json(랭킹 첫 페이지, 영웅 트리 판정 완료)에서 고른다.
//   전문화 × 모드(raid/mythicPlus) × 영웅 트리마다 전 지역 상위 5개 + KR 상위 3개(중복 제외).
// 원본: events/<가이드 ID>-<모드>-<코드>-<전투>-<이름>.json
const fs = require('node:fs');
const path = require('node:path');
const R5 = 'C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs';
const {req, pool} = require(R5 + '/common.cjs');
const judged = require(R5 + '/judged.json');
const dir = path.join(__dirname, 'events');
const PER = {ALL: 5, KR: 3};

function tasks() {
  const out = [], seen = new Set();
  for (const e of judged) {
    if (e.error) continue;
    for (const h of e.heroes) {
      const rows = e.rows.filter(r => r.after === true && r.heroTreeId === h.heroTreeId).slice(0, PER[e.scope] || 0);
      for (const row of rows) {
        const key = `${e.id}-${e.mode}-${row.report.code}-${row.report.fightID}-${row.name}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({e, h, row, key});
      }
    }
  }
  return out;
}

const reportCache = new Map();
async function reportInfo(code, fightID) {
  const k = code + ':' + fightID;
  if (!reportCache.has(k)) {
    reportCache.set(k, req(`{reportData{report(code:"${code}"){code startTime region{slug} fights(fightIDs:[${fightID}]){id name encounterID difficulty kill startTime endTime keystoneLevel} playerDetails(fightIDs:[${fightID}])}}}`, k).then(d => d.reportData.report));
  }
  return reportCache.get(k);
}
const abilityCache = new Map();
async function abilities(code) {
  if (!abilityCache.has(code)) {
    abilityCache.set(code, req(`{reportData{report(code:"${code}"){masterData{abilities{gameID name icon}}}}}`, code + ' abilities')
      .then(d => new Map(d.reportData.report.masterData.abilities.map(a => [a.gameID, a.name]))));
  }
  return abilityCache.get(code);
}

async function one({e, h, row, key}) {
  const file = path.join(dir, key.replace(/[^\w\-가-힣]/g, '_') + '.json');
  if (fs.existsSync(file)) { const c = JSON.parse(fs.readFileSync(file, 'utf8')); if (!c.error) return c; }
  const {code, fightID: id} = row.report;
  try {
    const report = await reportInfo(code, id);
    const fight = report.fights.find(f => f.id === id);
    const players = Object.values(report.playerDetails.data.playerDetails).flat();
    const player = players.find(p => p.name === row.name);
    if (!player?.id) throw new Error('playerDetails 에서 플레이어를 찾지 못함: ' + row.name);
    // 레이드는 풀 직전 사전 시전을 보려고 5초 앞부터 받는다.
    const start = e.mode === 'raid' ? fight.startTime - 5000 : fight.startTime;
    const events = [];
    let t = start;
    for (let page = 0; page < 20 && t != null; page++) {
      const d = await req(`{reportData{report(code:"${code}"){events(startTime:${t},endTime:${fight.endTime},sourceID:${player.id},dataType:Casts,limit:10000){data nextPageTimestamp}}}}`, key + ' p' + page);
      const ev = d.reportData.report.events;
      for (const x of ev.data) {
        if (x.sourceID !== player.id) continue;
        if (x.type !== 'cast' && x.type !== 'begincast') continue;
        events.push([x.timestamp - fight.startTime, x.type === 'cast' ? 'c' : 'b', x.abilityGameID, x.targetID ?? -1]);
      }
      t = ev.nextPageTimestamp;
    }
    const names = await abilities(code);
    const used = [...new Set(events.map(x => x[2]))];
    const result = {guideId: e.id, mode: e.mode, scope: e.scope, heroTreeId: h.heroTreeId, heroLabel: h.label,
      url: row.url + '&source=' + player.id, rank: row.rank, amount: row.amount, name: row.name, region: row.region,
      startedAt: row.startedAt, fight: {id, kill: fight.kill, durationMs: fight.endTime - fight.startTime, keystoneLevel: fight.keystoneLevel ?? null, encounterID: fight.encounterID},
      player: {id: player.id, specs: player.specs}, fetchedAt: new Date().toISOString(),
      abilityNames: Object.fromEntries(used.map(id => [id, names.get(id) || null])),
      events};
    fs.writeFileSync(file, JSON.stringify(result));
    return result;
  } catch (err) {
    const result = {guideId: e.id, mode: e.mode, scope: e.scope, heroLabel: h.label, url: row.url, error: String(err.message).slice(0, 500)};
    fs.writeFileSync(file, JSON.stringify(result));
    return result;
  }
}

(async () => {
  fs.mkdirSync(dir, {recursive: true});
  const list = tasks();
  const only = process.argv[2];
  const work = only ? list.filter(t => t.e.id === only) : list;
  let done = 0;
  const res = await pool(work, 4, async t => {
    const r = await one(t); done++;
    if (done % 25 === 0 || r.error) console.log(`${done}/${work.length} ${t.key} ${r.error || 'ok'}`);
    return r;
  });
  console.log(JSON.stringify({tasks: work.length, errors: res.filter(r => r.error).length}));
})().catch(e => { console.error(e.message); process.exitCode = 1; });
