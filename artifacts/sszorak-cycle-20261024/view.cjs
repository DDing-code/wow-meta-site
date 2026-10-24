// 원고에서 딜사이클과 관련된 부분만 뽑아 views/<가이드 ID>.json 으로 쓴다(작업자가 읽기 쉽게).
//   - blocks: 장 번호·부·제목·한 줄 원리·본문·요점·실수·확인 문제·예시·타임라인(스킬 이름을 붙임)
//   - heroBranches: 영웅 특성 탭의 오프닝·단일·광역(+탱사이클) 전체
//   - talentBuilds: 견본 id·이름·영웅
// 사용: node view.cjs <가이드 ID> [...]   (인자 없으면 40개 전부)
const fs = require('node:fs');
const path = require('node:path');
const SITE = 'C:/wowmeta/site';
const {kbGuidePath} = require(SITE + '/artifacts/book-rebuild/lib.cjs');
const {loadGuideManuscripts} = require(SITE + '/scripts/lib/guideManuscripts.cjs');
const kb = require(SITE + '/src/data/kb-skills.json').skills;
const OUT = path.join(__dirname, 'views');
const nm = id => kb[String(id)]?.name || `?${id}`;

function named(node) {
  const out = {skill: `${nm(node.skillId)}(${node.skillId})`, ...node};
  delete out.skillId;
  if (node.above) out.above = {skill: `${nm(node.above.skillId)}(${node.above.skillId})`, when: node.above.when};
  return out;
}

function view(id) {
  const m = JSON.parse(fs.readFileSync(kbGuidePath(id).file, 'utf8'));
  const blocks = (m.blocks || []).map((b, i) => {
    const tls = [].concat(b.timeline || []);
    const o = {index: i, part: b.part, title: b.title, concept: b.concept, paragraphs: b.paragraphs, bullets: b.bullets, mistakes: b.mistakes, quiz: b.quiz, example: b.example};
    if (tls.length) o.timeline = tls.map(t => ({...t, rails: t.rails.map(r => ({...r, nodes: r.nodes.map(named)}))}));
    Object.keys(o).forEach(k => o[k] === undefined && delete o[k]);
    return o;
  });
  const modes = ['opener', 'singleTarget', 'aoe', 'tankRaid', 'tankMythic'];
  const heroBranches = (m.heroBranches || []).map(h => {
    const o = {label: h.label, summary: h.summary};
    for (const k of modes) if (h[k]) o[k] = {...h[k], steps: h[k].steps?.map(named), priority: h[k].priority?.map(named)};
    return o;
  });
  const talentBuilds = (m.talentBuilds || []).map(t => ({id: t.id, label: t.label, heroLabel: t.heroLabel, note: t.note}));
  const sources = (m.sources || []).map(x => ({label: x.label, url: x.url, updated: x.updated, note: x.note}));
  const logReview = m.logReview ? {heroConclusion: m.logReview.heroConclusion} : undefined;
  fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify({id, defaultHeroBranchIndex: m.defaultHeroBranchIndex || 0, blocks, heroBranches, talentBuilds, sources, logReview, evidence: m.evidence}, null, 1));
}

fs.mkdirSync(OUT, {recursive: true});
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(loadGuideManuscripts());
ids.forEach(view);
console.log(`views ${ids.length}`);
