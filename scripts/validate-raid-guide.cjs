#!/usr/bin/env node
// 레이드 가이드(/raid) 자료 검사.
// - KB 정본(00-공통/공용/Meta/raid-guide.json)과 사이트의 생성 JSON(src/data/raidGuide.json)이 같은지(sync-kb를 돌렸는지)
// - 편·네임드·단계·팁·출처 구조와 고정 용어(네임드·쫄)
// - 본문에 툴팁을 붙일 직업 스킬이 KB(kb-skills.json)에 같은 번호로 있는지, 네임드 기술에 번호·아이콘이 있는지
// - 상단 메뉴와 라우트에 /raid 가 연결됐는지, 2026-10-22 사용자 확인 사항(무적조·징표·핑·물고기 순서·1+5)이 남아 있는지
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const SITE = path.resolve(__dirname, '..');
const KB_MASTER = path.resolve(SITE, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '00-공통', '공용', 'Meta', 'raid-guide.json');
const GENERATED = path.join(SITE, 'src', 'data', 'raidGuide.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));

const guide = read(GENERATED);
if (fs.existsSync(KB_MASTER)) {
  assert.deepEqual(guide, read(KB_MASTER), 'src/data/raidGuide.json must equal the KB master (run npm run sync-kb)');
}

const registry = fs.readFileSync(path.join(SITE, 'src', 'data', 'guideRegistry.js'), 'utf8');
const patchLabel = /CURRENT_PATCH_LABEL = '([^']+)'/.exec(registry)[1];
assert.equal(guide.metadata.patch, patchLabel, `raid guide patch must be ${patchLabel}`);
assert.ok(Array.isArray(guide.page.notes) && guide.page.notes.length >= 3, 'page notes missing');

const text = JSON.stringify(guide);
for (const banned of ['우두머리', '졸개', '보스', '로테이션', '오프너', '신화+', '버스트', '문서', '임의 번역']) {
  assert.ok(!text.includes(banned), `forbidden term in raid guide: ${banned}`);
}

const bosses = guide.episodes.flatMap(episode => episode.bosses);
assert.equal(guide.episodes.length, 5, 'five episodes');
assert.equal(bosses.length, 10, 'ten bosses');
assert.equal(new Set(guide.episodes.map(e => e.id)).size, 5, 'episode ids unique');
assert.equal(new Set(bosses.map(b => b.id)).size, 10, 'boss ids unique');
let tips = 0;
let steps = 0;
for (const episode of guide.episodes) {
  assert.ok(/^#[0-9a-f]{6}$/i.test(episode.color), `${episode.id}: color`);
  for (const field of ['label', 'title', 'place', 'principle', 'scope']) assert.ok(episode[field], `${episode.id}: ${field}`);
  for (const boss of episode.bosses) {
    for (const field of ['name', 'order', 'summary']) assert.ok(boss[field], `${boss.id}: ${field}`);
    assert.equal(boss.checks.length, 3, `${boss.id}: three checks`);
    assert.ok(boss.phases.length >= 1, `${boss.id}: phases`);
    assert.equal(new Set(boss.phases.map(p => p.id)).size, boss.phases.length, `${boss.id}: phase ids unique`);
    for (const phase of boss.phases) {
      assert.ok(phase.steps.length >= 1, `${boss.id}/${phase.id}: steps`);
      for (const step of phase.steps) {
        assert.ok(['공통', '신화', '배정', '선택 택틱'].includes(step.kind), `${boss.id}/${phase.id}: kind ${step.kind}`);
        assert.ok(step.title && step.text, `${boss.id}/${phase.id}: step title/text`);
        steps++;
      }
    }
    assert.ok(boss.tips.length >= 7, `${boss.id}: at least 7 tips`);
    for (const tip of boss.tips) {
      assert.ok(tip.role && tip.text, `${boss.id}: tip role/text`);
      assert.ok(guide.sources[tip.source], `${boss.id}: tip source ${tip.source}`);
      if (tip.grarlSecond != null) {
        assert.equal(tip.source, 'grarl', `${boss.id}: grarlSecond only with grarl source`);
        assert.ok(Number.isInteger(tip.grarlSecond) && tip.grarlSecond > 0, `${boss.id}: grarlSecond`);
      }
      tips++;
    }
    for (const choice of boss.choices) for (const field of ['title', 'picked', 'alt', 'why']) assert.ok(choice[field], `${boss.id}: choice ${field}`);
    assert.ok(boss.sources.length >= 1, `${boss.id}: sources`);
    for (const key of boss.sources) assert.ok(guide.sources[key], `${boss.id}: source ${key}`);
  }
}
assert.equal(tips, 108, `108 tips from the storyboard, got ${tips}`);
assert.equal(steps, 69, `69 steps, got ${steps}`);
for (const [key, source] of Object.entries(guide.sources)) {
  assert.ok(source.title && /^https:\/\//.test(source.href) && source.note, `source ${key}`);
}

// 직업 스킬은 KB와 번호가 같아야 하고, 네임드 기술은 번호·아이콘·네임드가 있어야 한다.
const kb = read(path.join(SITE, 'src', 'data', 'kb-skills.json'));
const kbByName = new Map(Object.values(kb.skills).map(skill => [skill.koreanName || skill.name, skill]));
for (const skill of guide.skills) {
  const record = kbByName.get(skill.name);
  assert.ok(record, `player skill not in KB: ${skill.name}`);
  assert.equal(String(record.id), String(skill.id), `player skill id mismatch: ${skill.name}`);
  assert.ok(record.icon || record.iconName, `player skill icon missing: ${skill.name}`);
  assert.ok(text.includes(skill.name), `player skill never mentioned: ${skill.name}`);
}
const bossIds = new Set(bosses.map(b => b.id));
for (const spell of guide.spells) {
  assert.ok(Number.isInteger(spell.id) && spell.id > 0, `spell id: ${spell.name}`);
  assert.ok(/^[a-z0-9_]+$/.test(spell.icon), `spell icon: ${spell.name}`);
  assert.ok(bossIds.has(spell.boss), `spell boss: ${spell.name}`);
}
assert.equal(guide.spells.length, 9, 'nine confirmed Coiled Altar spells');

// 스토리보드 그림: 배치도 69장이 한 번씩 붙고(행동·네임드 개요), 파일(public/images/raid)과 네임드 스프라이트가 있어야 한다.
// 2026-10-22 사용자 요청으로 '한 장 복습' 4장과 맹독 심연 맨 위 개요(선택한 네임드만 밝힌다)는 뺐다. 다시 붙지 않게 막는다.
const REMOVED_PLANS = ['01-kithix-12', '03-venomous-1-6-01', '03-venomous-1-6-26', '04-coiled-altar-12', '05-ulatek-15'];
const RAID_IMAGES = path.join(SITE, 'public', 'images', 'raid');
const plans = [];
const pushFigure = (figure, where) => {
  if (!figure) return;
  assert.ok(/^0[1-5]-[a-z0-9-]+-\d{2}$/.test(figure.plan) && figure.caption, `${where}: figure plan/caption`);
  for (const width of [960, 1600]) assert.ok(fs.existsSync(path.join(RAID_IMAGES, 'plan', `${figure.plan}-${width}.webp`)), `${where}: missing ${figure.plan}-${width}.webp`);
  plans.push(figure.plan);
};
for (const episode of guide.episodes) {
  assert.ok(!episode.figure && !episode.recap, `${episode.id}: episode overview/recap figures were removed`);
  for (const boss of episode.bosses) {
    assert.ok(Array.isArray(boss.sprites) && boss.sprites.length, `${boss.id}: sprites`);
    for (const id of boss.sprites) assert.ok(fs.existsSync(path.join(RAID_IMAGES, 'sprites', `${id}.webp`)), `${boss.id}: missing sprite ${id}`);
    pushFigure(boss.figure, boss.id);
    assert.ok(!boss.recap, `${boss.id}: recap figure was removed`);
    boss.phases.forEach(phase => phase.steps.forEach(step => pushFigure(step.figure, `${boss.id}/${step.title}`)));
  }
}
assert.equal(plans.length, 69, `69 storyboard plans, got ${plans.length}`);
assert.equal(new Set(plans).size, 69, 'each plan used once');
for (const plan of REMOVED_PLANS) assert.ok(!plans.includes(plan), `removed plan is back: ${plan}`);
const stepFigures = bosses.flatMap(b => b.phases.flatMap(p => p.steps)).filter(step => step.figure).length;
assert.ok(stepFigures >= 60, `most steps need a plan figure, got ${stepFigures}`);

// 2026-10-22 사용자 확인 사항이 본문에 남아 있어야 한다.
const nymrissa = bosses.find(b => b.id === 'nymrissa');
const orbStep = nymrissa.phases.flatMap(p => p.steps).find(step => step.title.includes('무적조'));
for (const name of ['그림자 망토', '거북의 상', '천상의 보호막']) assert.ok(orbStep.text.includes(name), `nymrissa immune squad: ${name}`);
assert.ok(orbStep.text.includes('얼음 방패는 쓰지 못합니다'), 'nymrissa: ice block cannot be used');
const vashnik = bosses.find(b => b.id === 'vashnik');
assert.ok(JSON.stringify(vashnik).includes('주황 동그라미, 보라 마름모, 파란 네모, 해골, 빨간 가위'), 'vashnik marker line');
const sentinels = bosses.find(b => b.id === 'sentinels');
assert.ok(JSON.stringify(sentinels).includes('초록 하나인 사람은 멈춰서 핑을 찍고'), 'sentinels: 1 pings');
const explorers = bosses.find(b => b.id === 'explorers');
assert.ok(JSON.stringify(explorers).includes('나마 → 게보 → 이쿠'), 'explorers fish order');
const ulatek = bosses.find(b => b.id === 'ulatek');
const fangStep = ulatek.phases.flatMap(p => p.steps).find(step => step.title.includes('송곳니'));
assert.equal(fangStep.kind, '선택 택틱', 'ulatek fangs is a choice');
assert.ok(fangStep.text.includes('한 명이 먼저 끊고') && fangStep.text.includes('나머지 다섯'), 'ulatek fangs 1+5');

// 화면 연결: 상단 메뉴 탭과 라우트.
const nav = fs.readFileSync(path.join(SITE, 'src', 'components', 'Navigation.js'), 'utf8');
assert.ok(nav.includes("{ path: '/raid', label: '레이드 가이드'"), 'Navigation must have the 레이드 가이드 tab');
const app = fs.readFileSync(path.join(SITE, 'src', 'App.js'), 'utf8');
assert.ok(app.includes('<Route path="/raid" element={<RaidGuidePage />} />') && app.includes('<Route path="/raid/:episodeId" element={<RaidGuidePage />} />'), 'App must route /raid and /raid/:episodeId');
const page = fs.readFileSync(path.join(SITE, 'src', 'pages', 'RaidGuidePage.js'), 'utf8');
assert.ok(page.includes("from '../data/raidGuide.json'") && page.includes('data-wowhead={`spell=${term.id}&domain=ko`}'), 'page must read the generated JSON and render tooltip links');

console.log(`Raid guide validation passed: ${guide.episodes.length} episodes, ${bosses.length} bosses, ${steps} steps (${stepFigures} with plans), ${plans.length} plans, ${tips} tips, ${guide.spells.length} spells, ${guide.skills.length} player skills`);
