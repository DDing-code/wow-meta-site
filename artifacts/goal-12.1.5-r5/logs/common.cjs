// 공통: 40개 전문화 목록, 영웅 트리 판정(review-heroes.cjs selection() 방식), WCL 재시도 요청
const fs = require('node:fs');
const path = require('node:path');
const {request} = require('C:/wowmeta/site/artifacts/chaeyong-wcl.cjs');
// 트리 자료: SimC midnight 5537d881, wow build 12.1.5.70448 (goal-12.1.5/talents/trait_data.inc).
// 판정 알고리즘은 goal-12.1-round-2/decode-talents.cjs 와 같고(12.1.5 사본은 파일 경로만 인자로 받음),
// trait-diff.json 기준 12.1.0(oct7)→12.1.5 사이 tree 3/4(영웅) 항목 변화는 0건.
const {makeDecoder, defaultFile} = require('C:/wowmeta/site/artifacts/goal-12.1.5/talents/decode-talents.cjs');
const {decode, traits, build} = makeDecoder(defaultFile);
const review = require('C:/wowmeta/site/artifacts/goal-12.1-round-7/hero-review.json');
const scope = require('C:/wowmeta/site/artifacts/goal-12.1-round-3/scope.json');
const classNames = {warrior:'Warrior',paladin:'Paladin',deathknight:'DeathKnight',monk:'Monk',druid:'Druid',demonhunter:'DemonHunter',rogue:'Rogue',shaman:'Shaman',hunter:'Hunter',priest:'Priest',mage:'Mage',warlock:'Warlock',evoker:'Evoker'};
const specNames = {beastmastery:'BeastMastery',marksmanship:'Marksmanship'};
const THRESHOLD = {default:'2026-10-13T15:00:00Z', KR:'2026-10-15T06:00:00+09:00'};
const TRAIT_SOURCE = {file:defaultFile, build, simc:'midnight 5537d8813dfc59707927722b1e23ffa6fd67ee59', heroTreeChangesVs1210:0};

function selection(row, spec) {
  const entries = new Set((row.talents||[]).map(t=>t.talentID));
  const selected = traits.filter(t=>t.tree===4 && t.specs.includes(spec) && entries.has(t.entry));
  const heroes = [...new Set(selected.map(t=>t.hero))];
  if (heroes.length !== 1) throw new Error('영웅 트리 선택 노드 '+heroes.length+'개');
  return {heroTreeId:heroes[0], selectionEntries:selected.map(t=>t.entry)};
}

function specs() {
  return review.map(g=>{
    const m = JSON.parse(fs.readFileSync(g.canonical,'utf8'));
    const decoded = decode(m.talentBuilds[0].code);
    const available = [...new Set(traits.filter(t=>t.tree===4&&t.specs.includes(decoded.spec)).map(t=>t.hero))];
    const heroes = m.heroBranches.map(b=>{
      let ids = [...new Set((b.skillIds||[]).flatMap(id=>traits.filter(t=>t.tree===3&&t.spell===Number(id)&&available.includes(t.hero)).map(t=>t.hero)))];
      if (ids.length!==1) ids = [...new Set(m.talentBuilds.filter(t=>t.heroLabel===b.label).map(t=>{try{return decode(t.code).hero}catch{return null}}).filter(Boolean))];
      return {label:b.label, heroTreeId:ids.length===1?ids[0]:null, candidates:ids};
    });
    // 한 갈래만 판정 실패하면 남은 영웅 트리를 배정한다(round-7 hero-review 매핑과 대조해 표시).
    const unresolved = heroes.filter(h=>!h.heroTreeId);
    if (unresolved.length===1) {
      const rest = available.filter(id=>!heroes.some(h=>h.heroTreeId===id));
      if (rest.length===1) { unresolved[0].heroTreeId = rest[0]; unresolved[0].inferred = '갈래 skillIds·견본 코드로 판정 불가 → 남은 영웅 트리로 배정'; }
    }
    const prev = g.heroes.map(h=>[h.label,h.heroTreeId]);
    for (const h of heroes) { const p = prev.find(x=>x[1]===h.heroTreeId); h.round7Label = p ? p[0] : null; }
    const [classKey,specKey] = g.id.split('-');
    const role = scope.find(s=>s.id===g.id).role;
    return {id:g.id, canonical:g.canonical, specId:decoded.spec, available, heroes,
      className:classNames[classKey], specName:specNames[specKey]||specKey[0].toUpperCase()+specKey.slice(1),
      role, metric:role==='healers'?'hps':'dps', mythicEncounter:g.korea.mythicPlus.encounterId,
      heroConclusion:m.logReview?.heroConclusion?.conclusion ?? null};
  });
}

const sleep = ms=>new Promise(r=>setTimeout(r,ms));
async function req(query, label) {
  let last;
  for (let i=0;i<6;i++) {
    try { return await request(query); }
    catch (e) {
      last = e;
      const msg = String(e.message);
      const wait = /429|rate|limit|points/i.test(msg) ? 60000*(i+1) : 5000*(i+1);
      console.error(`[재시도 ${i+1}] ${label}: ${msg.slice(0,200)} → ${wait/1000}s 대기`);
      await sleep(wait);
    }
  }
  throw last;
}
async function pool(items, n, fn) {
  const out = new Array(items.length); let k = 0;
  await Promise.all(Array.from({length:n}, async()=>{ while (k<items.length) { const i=k++; out[i]=await fn(items[i],i); } }));
  return out;
}
module.exports = {selection, specs, req, pool, THRESHOLD, TRAIT_SOURCE, decode, traits};
