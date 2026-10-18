// 5)~6) summary.json / summary.md
const fs = require('node:fs');
const path = require('node:path');
const {specs, THRESHOLD, TRAIT_SOURCE} = require('./common.cjs');
const judged = require('./judged.json');
const kb = require('C:/wowmeta/site/src/data/kb-skills.json').skills; // 읽기만: 시전 주문 한국어 이름 표시용
const combats = fs.readdirSync(path.join(__dirname,'combats')).map(f=>JSON.parse(fs.readFileSync(path.join(__dirname,'combats',f),'utf8')));
const SCOPE = '랭킹 첫 페이지(최대 100행) 상위 행만 본 관측치다. 전체 사용률 전수 조사가 아니며, 영웅 트리 간 성능 우열을 뜻하지 않는다. 쐐기는 시즌 전체 상위 100행 중 12.1.5 이후 행만 남긴 것이라 표본이 작고 최고 단수 쪽으로 치우친다.';
const THRESHOLD_NOTE = `KR 이외 지역 행: ${THRESHOLD.default} 이후(미국 12.1.5 적용 2026-10-13 기준). KR 행: ${THRESHOLD.KR} 이후 — 한국 적용 시각이 확인되지 않아 보수적으로 잡은 값. server.region 이 없는 행은 기준 판정에서 빼고 missingRegion 으로 따로 셌다.`;
const modeKo = {raid:'레이드', mythicPlus:'쐐기'};
const ko = id => kb[String(id)]?.koreanName || kb[String(id)]?.name || null;
const S = specs();
// 사람 판단(정본 결론 문장을 읽고 붙인 메모). 정본은 고치지 않는다.
const NOTES = {
  'deathknight-blood':'쐐기 견본만 죽음의 인도자. 결론은 산레인 우선이라 결론과 로그는 맞고 쐐기 견본이 어긋남.',
  'monk-brewmaster':'결론("방어 레이드에 조화의 종사, 일반 쐐기에 음영파")과 견본이 로그와 정반대(레이드 음영파 85%, 쐐기 조화의 종사 96%).',
  'paladin-retribution':'견본 3개 모두 기사단인데 12.1.5 이후 레이드·쐐기 모두 태양의 사자 95~100%.',
  'rogue-assassination':'쐐기 견본 운명결속 ↔ 12.1.5 이후 쐐기 상위 죽음추적자 100%(n=16, 표본 작음). 레이드는 운명결속 98%로 일치.',
  'rogue-subtlety':'견본·첫 갈래·결론이 죽음추적자 중심인데 12.1.5 이후 레이드·쐐기 모두 기만자 91~99%.',
  'deathknight-unholy':'결론은 산레인을 첫 비교로 두지만 레이드·단일 견본과 첫 갈래가 종말의 기수. 레이드 산레인 98~100%.',
  'monk-windwalker':'견본 3개 모두 음영파, 결론도 음영파 추천 본문을 앞세움 ↔ 레이드·쐐기 모두 천신의 대변자 95~100%.',
  'druid-feral':'결론("레이드·적은 대상 수에 야생추적자, 쐐기에 발톱의 드루이드")은 로그와 맞는데 견본이 반대로 붙어 있음(레이드=발톱, 쐐기=야생추적자).',
  'demonhunter-havoc':'쐐기 견본·첫 갈래 지옥상흔 ↔ 전 지역 쐐기 알드라치 파괴자 85%(KR 쐐기는 7:7).',
  'druid-balance':'레이드 견본 엘룬의 대행자 ↔ 레이드 숲의 수호자 87~98%. 쐐기는 엘룬의 대행자 100%로 일치.',
  'evoker-augmentation':'쐐기 견본 비늘사령관 ↔ 쐐기 상위 시간 감시자 78~82%. 결론의 "주간 쐐기 비늘사령관"은 상위 고단 기록과 성격이 달라 표본 해석 주의.',
  'paladin-holy':'쐐기 견본 태양의 사자(결론도 쐐기 태양의 사자 권장) ↔ 쐐기 빛의 대장장이 86~100%.',
  'priest-discipline':'결론("쐐기에 예언자")은 로그와 맞는데 쐐기 견본이 공허술사.',
  'warrior-protection':'견본 3개 모두 산왕이고 로그도 산왕(레이드 80%, 쐐기 100%). 결론의 "단일에 거신" 언급만 참고.',
  'paladin-protection':'견본·로그 모두 빛의 대장장이. heroBranches 첫 갈래가 기사단인 순서만 다름.',
  'deathknight-frost':'견본·결론·로그 모두 죽음의 인도자. heroBranches 첫 갈래가 종말의 기수인 순서만 다름.',
  'demonhunter-devourer':'견본·결론(궤멸자 기준으로 바꿨다고 명시)·로그 모두 궤멸자. 첫 갈래 순서와 결론 첫머리 "12.1.5 적용 전 기록" 문구만 참고.',
  'warlock-demonology':'견본·로그 모두 악마학자. 첫 갈래 순서와 결론의 "순수 단일에 영혼 수확자" 언급만 참고(12.1.5 이후 상위 행에 영혼 수확자 0).',
  'priest-holy':'견본·결론·로그 모두 예언자. heroBranches 첫 갈래가 집정관인 순서만 다름.',
};
const summary = [];
for (const e of judged) {
  const rowsTop = e.heroes.map(h=>e.rows?.find(r=>r.after===true && r.heroTreeId===h.heroTreeId)).filter(Boolean);
  const topCombats = rowsTop.map(r=>{
    const c = combats.find(c=>c.guideId===e.id && c.mode===e.mode && !c.error && c.url.startsWith(r.url+'&'));
    if (!c) return {hero:r.heroLabel, url:r.url, startedAt:r.startedAt, region:r.region, error:'시전 표 없음'};
    return {hero:c.heroLabel, url:c.url, startedAt:c.startedAt, region:c.region, rank:c.rank, amount:Math.round(c.amount), name:c.name,
      fight:{encounterID:c.fight.encounterID, keystoneLevel:c.fight.keystoneLevel, durationSec:Math.round((c.fight.endTime-c.fight.startTime)/1000)},
      topCasts:c.topCasts.map(x=>({id:x.id, name:x.name, nameKo:ko(x.id), count:x.count}))};
  });
  summary.push({id:e.id, mode:e.mode, scope:e.scope==='ALL'?'전 지역':'KR', encounterId:e.encounterId, error:e.error,
    threshold:e.scope==='KR'?THRESHOLD.KR:{default:THRESHOLD.default, KR:THRESHOLD.KR},
    rowsTotal:e.rowsTotal??0, rowsAfter:e.rowsAfter??0, rowsBefore:e.rowsBefore??0, missingRegion:e.missingRegion??0, undetermined:e.undetermined??0,
    hasMorePages:e.hasMorePages, regions:e.regions,
    byHero:Object.fromEntries(Object.entries(e.byHero||{}).map(([k,v])=>[k,{heroTreeId:v.heroTreeId,count:v.count,share:v.share}])),
    topCombats, scopeNote:SCOPE});
}
fs.writeFileSync(path.join(__dirname,'summary.json'), JSON.stringify(summary, null, 1));
fs.writeFileSync(path.join(__dirname,'summary-meta.json'), JSON.stringify({generatedAt:new Date().toISOString(), scope:SCOPE, thresholdNote:THRESHOLD_NOTE,
  traitSource:TRAIT_SOURCE, raidPartition:'WCL 존 53 파티션 2 "12.1.5"(기본값) — 레이드 랭킹은 이 파티션', mythicPartition:'WCL 존 55 "Season 2" 단일 파티션 — 시각 필터로만 12.1.5 이후를 거름',
  entries:summary.length, rankingsRequests:80, combatFiles:combats.length}, null, 1));

// ---------- 대조 판단 ----------
const get = (id,mode,scope)=>summary.find(x=>x.id===id&&x.mode===mode&&x.scope===scope);
const major = x => {
  if (!x || x.rowsAfter - x.undetermined < 5) return null;
  const [label,v] = Object.entries(x.byHero).sort((a,b)=>b[1].count-a[1].count)[0];
  return {label, share:v.share, n:x.rowsAfter-x.undetermined};
};
const pct = v => v==null ? '-' : Math.round(v*100)+'%';
const heroLine = x => !x ? '응답 없음' : x.error ? '오류: '+x.error : x.rowsAfter===0 ? '12.1.5 이후 기록 없음' :
  `12.1.5 이후 ${x.rowsAfter}/${x.rowsTotal}행 — `+Object.entries(x.byHero).map(([k,v])=>`${k} ${v.count}(${pct(v.share)})`).join(', ')+(x.undetermined?`, 판정 불가 ${x.undetermined}`:'')+(x.missingRegion?`, 지역 없음 ${x.missingRegion}`:'');
const flags = [], blocks = [], none = [];
for (const s of S) {
  const m = JSON.parse(fs.readFileSync(s.canonical,'utf8'));
  const builds = Object.fromEntries(m.talentBuilds.map(t=>[t.label,t.heroLabel]));
  const issues = [];
  for (const [mode, buildKey] of [['raid','레이드'],['mythicPlus','쐐기']]) {
    for (const scope of ['전 지역','KR']) {
      const mj = major(get(s.id,mode,scope));
      if (!mj) continue;
      const rec = builds[buildKey];
      if (rec && mj.label!==rec && mj.share>=0.6) issues.push(`${scope} ${modeKo[mode]} 다수 ${mj.label} ${pct(mj.share)}(n=${mj.n}) ↔ 정본 ${buildKey} 견본 ${rec}`);
    }
  }
  const allR = major(get(s.id,'raid','전 지역')), allM = major(get(s.id,'mythicPlus','전 지역'));
  const sameMajor = allR && allM && allR.label===allM.label && allR.share>=0.6 && allM.share>=0.6;
  if (sameMajor && m.heroBranches[0].label!==allR.label)
    issues.push(`전 지역 레이드·쐐기 모두 ${allR.label} 다수 ↔ 정본 heroBranches 첫 갈래 ${m.heroBranches[0].label}`);
  const concl = m.logReview?.heroConclusion?.conclusion || '';
  const firstMentioned = s.heroes.map(h=>({l:h.label,i:concl.indexOf(h.label)})).filter(x=>x.i>=0).sort((a,b)=>a.i-b.i)[0]?.l;
  if (sameMajor && firstMentioned && firstMentioned!==allR.label)
    issues.push(`결론 문장이 먼저 내세우는 영웅(${firstMentioned})과 로그 다수(${allR.label})가 다름`);
  if (issues.length) flags.push({id:s.id, tier:issues.some(i=>i.includes('견본')) ? '견본 불일치' : '순서·문장만', issues, note:NOTES[s.id]||null, heroBranches:m.heroBranches.map(b=>b.label), builds, conclusion:concl});
  const anyAfter = summary.filter(x=>x.id===s.id).some(x=>x.rowsAfter>0);
  const emptyParts = summary.filter(x=>x.id===s.id && !x.rowsAfter).map(x=>`${x.scope} ${modeKo[x.mode]}`);
  if (!anyAfter) none.push(s.id); else if (emptyParts.length) none.push(`${s.id}(일부: ${emptyParts.join(', ')})`);
  const tc = mode => {
    const x = get(s.id,mode,'전 지역');
    return (x?.topCombats||[]).map(c=>c.error?`  - ${c.hero}: ${c.error}`:`  - ${c.hero} 최상위: ${c.region} ${c.startedAt.slice(0,16)}Z ${c.fight.keystoneLevel?'+'+c.fight.keystoneLevel+' ':''}${c.fight.durationSec}초 <${c.url}> — 시전 상위: `+c.topCasts.slice(0,8).map(t=>`${t.nameKo||t.name}(${t.id})×${t.count}`).join(', ')).join('\n');
  };
  blocks.push([
    `### ${s.id}${issues.length?' — 대조 필요':''}`,
    `- 정본 heroBranches 순서: ${m.heroBranches.map((b,i)=>`${i+1}. ${b.label}(${b.heroTreeId})`).join(' / ')} · 견본: ${m.talentBuilds.map(t=>`${t.label}=${t.heroLabel}`).join(', ')}`,
    `- 정본 결론: ${concl || '(없음)'}`,
    `- 레이드 전 지역: ${heroLine(get(s.id,'raid','전 지역'))}`,
    `- 레이드 KR: ${heroLine(get(s.id,'raid','KR'))}`,
    `- 쐐기 전 지역: ${heroLine(get(s.id,'mythicPlus','전 지역'))}`,
    `- 쐐기 KR: ${heroLine(get(s.id,'mythicPlus','KR'))}`,
    `- 레이드 전투(전 지역, 영웅별 최상위 1개):`, tc('raid')||'  - 없음',
    `- 쐐기 전투(전 지역, 영웅별 최상위 1개):`, tc('mythicPlus')||'  - 없음', ''].join('\n'));
}
const fmtFlag = f=>`- **${f.id}** (갈래 순서 ${f.heroBranches.join(' / ')}; 견본 ${Object.entries(f.builds).map(([k,v])=>k+'='+v).join(', ')})${f.note?`\n  - 판단: ${f.note}`:''}\n${f.issues.map(i=>'  - '+i).join('\n')}`;
const mixed = summary.filter(x=>{const mj=major(x);return mj&&mj.share<0.6;}).map(x=>`${x.id} ${x.scope} ${modeKo[x.mode]}: `+Object.entries(x.byHero).map(([k,v])=>`${k} ${v.count}(${pct(v.share)})`).join(', '));
const md = [
  '# 12.1.5 이후 WCL 영웅 특성·시전 원자료 (40개 전문화)', '',
  `생성: ${new Date().toISOString()} · 원자료: summary.json, judged.json, rankings/, combats/`, '',
  '## 범위·기준',
  `- ${SCOPE}`,
  `- 기준 시각: ${THRESHOLD_NOTE}`,
  '- 레이드: 독사의 심연 신화 Nymrissa Wavecaller(encounter 3379, difficulty 5), WCL 존 53 파티션 2 "12.1.5"(기본값). 쐐기: 이전 회차와 같은 던전(12993/12825/12859/61762), 존 55 시즌 2 단일 파티션이라 시각 필터로만 거름. 지표: 탱커·딜러 dps, 힐러 hps. 랭킹은 전 지역(serverRegion 없음)과 KR 두 번 조회.',
  `- 영웅 트리 판정: 랭킹 행 talents 의 entry 를 trait_data tree 4(영웅 선택 노드)와 대조(round-7 review-heroes.cjs selection() 방식). 트리 자료: ${TRAIT_SOURCE.file} (SimC ${TRAIT_SOURCE.simc}, wow build ${TRAIT_SOURCE.build}). 12.1.0(oct7 사본) 대비 영웅 항목(tree 3/4) 변화 0건이라 판정 결과는 이전 자료로 해도 같다. 판정 불가는 모두 랭킹 응답의 talents 가 비어 있는 행.`,
  '- 갈래↔영웅 트리 매핑: 정본 heroBranches.skillIds → tree 3 주문 매칭, 실패 시 talentBuilds 해석. demonhunter-devourer 의 공허상흔은 둘 다 실패해 남은 영웅 트리(126)로 배정했고, 정본 heroBranches.heroTreeId·round-7 매핑과 일치(40개 전부 heroTreeId 일치 확인).',
  '- 시전 표: 영웅 트리별 12.1.5 이후 최상위 1개 전투의 casts table(전 지역·KR 각각, 상위 15개는 summary.json). 아래에는 전 지역 상위 8개만 적었다. 한국어 이름은 kb-skills.json 에서 ID 로 찾았고, 없으면 WCL 영문 이름.',
  '- 대조 판단 규칙(자동 + 확인): 판정된 12.1.5 이후 행 5개 이상에서 한 영웅이 60% 이상인데 정본 같은 모드 견본(레이드/쐐기)의 영웅과 다르면 표시. 전 지역 레이드·쐐기 다수가 같은데 정본 첫 갈래나 결론 문장이 먼저 내세우는 영웅이 다르면 함께 표시. 정본은 고치지 않았다.', '',
  `## 대조 필요 — 견본 영웅이 12.1.5 이후 로그 다수와 다름 (${flags.filter(f=>f.tier==='견본 불일치').length}개)`,
  ...flags.filter(f=>f.tier==='견본 불일치').map(fmtFlag), '',
  `## 참고 — 견본·로그는 같고 갈래 순서나 결론 문장만 다름 (${flags.filter(f=>f.tier!=='견본 불일치').length}개)`,
  ...flags.filter(f=>f.tier!=='견본 불일치').map(fmtFlag), '',
  '## 혼재 — 한 영웅이 60% 미만(판정 행 5개 이상)',
  ...(mixed.length ? mixed.map(x=>'- '+x) : ['- 없음']), '',
  '## 12.1.5 이후 기록 없음',
  ...(none.length ? none.map(x=>'- '+x) : ['- 없음']), '',
  '## 실패·오류',
  ...(summary.some(x=>x.error) ? summary.filter(x=>x.error).map(x=>`- ${x.id} ${x.mode} ${x.scope}: ${x.error}`) : ['- 없음 (랭킹 160건·전투 시전 표 208건 전부 수신)']), '',
  '## 전문화별', ...blocks].join('\n');
fs.writeFileSync(path.join(__dirname,'summary.md'), md);
fs.writeFileSync(path.join(__dirname,'flags.json'), JSON.stringify({flags, none}, null, 1));
console.log(JSON.stringify({entries:summary.length, flags:flags.length, none}, null, 1));
for (const f of flags) console.log(f.id, '\n  '+f.issues.join('\n  '));
