#!/usr/bin/env node
// 레이드 가이드(/raid) 자료 검사.
// - KB 정본(00-공통/공용/Meta/raid-guide.json)과 사이트의 생성 JSON(src/data/raidGuide.json)이 같은지(sync-kb를 돌렸는지)
// - 편·네임드·단계·팁·출처 구조와 고정 용어(네임드·쫄)
// - 본문에 툴팁을 붙일 직업 스킬이 KB(kb-skills.json)에 같은 번호로 있는지, 네임드 기술에 번호·아이콘이 있는지
// - 실전 글 공통 팁과 갈리는 택틱(참고) 구분, 출처에 인벤 대신 상위 공대 이름만(2026-10-23)
// - 상단 메뉴와 라우트에 /raid 가 연결됐는지, 2026-10-22 사용자 확인 사항(구슬 무적기·징표·핑·물고기 순서·1+5)이 남아 있는지
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
// 2026-10-23 사용자 지적: '위험한 겹침'처럼 '겹침'을 이름처럼 쓰면 알아듣기 어렵다 → '위험한 구간'으로 쓴다.
assert.ok(!text.includes('겹침'), "use '위험한 구간' instead of the noun '겹침' in the raid guide");

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
      // 실전 글에서 보충한 팁은 출처 칸이 없다(출처에는 상위 공대·공개 공략만 적는다).
      assert.ok(tip.source == null || guide.sources[tip.source], `${boss.id}: tip source ${tip.source}`);
      if (tip.grarlSecond != null) {
        assert.equal(tip.source, 'grarl', `${boss.id}: grarlSecond only with grarl source`);
        assert.ok(Number.isInteger(tip.grarlSecond) && tip.grarlSecond > 0, `${boss.id}: grarlSecond`);
      }
      tips++;
    }
    for (const choice of boss.choices) {
      for (const field of ['title', 'picked', 'alt', 'why']) assert.ok(choice[field], `${boss.id}: choice ${field}`);
      assert.ok(choice.open == null || choice.open === true, `${boss.id}: choice open must be true or absent`);
    }
    assert.ok(boss.sources.length >= 1, `${boss.id}: sources`);
    for (const key of boss.sources) assert.ok(guide.sources[key], `${boss.id}: source ${key}`);
  }
}
// 스토리보드 팁 108개 + 2026-10-23 신화 실전 글에서 여러 글이 함께 말한 공통 팁 20개.
assert.equal(tips, 128, `128 tips (108 storyboard + 20 field common), got ${tips}`);
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
assert.equal(guide.spells.filter(spell => spell.boss === 'coiled-altar').length, 9, 'nine confirmed Coiled Altar spells');
// 2026-10-23 님리사 구슬 설명에 넣은 심연의 비(한국어 공식 툴팁 확인).
assert.ok(guide.spells.some(spell => spell.boss === 'nymrissa' && spell.id === 1260837 && spell.name === '심연의 비'), 'nymrissa: Abyssal Rain spell');

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
// 2026-10-22 배치도 자리는 raidstrats 공략 속 플랜을 따른다. 공개 플랜이 있는 네임드는 그 공략을 근거로 걸어 둔다(키식스·울라텍은 공개 플랜 없음).
for (const id of ['nymrissa', 'nekzali', 'sentinels', 'explorers', 'vashnik', 'sszorak', 'fangs', 'coiled-altar']) {
  const boss = bosses.find(b => b.id === id);
  assert.ok(boss.sources.some(key => /raidstrats\.gg\/guides\//.test(guide.sources[key].href)), `${id}: raidstrats plan source for diagram positions`);
}
const stepFigures = bosses.flatMap(b => b.phases.flatMap(p => p.steps)).filter(step => step.figure).length;
assert.ok(stepFigures >= 60, `most steps need a plan figure, got ${stepFigures}`);

// 2026-10-22 사용자 확인 사항이 본문에 남아 있어야 한다.
const nymrissa = bosses.find(b => b.id === 'nymrissa');
const orbStep = nymrissa.phases.flatMap(p => p.steps).find(step => step.title === '얼음 구슬 9개 처리');
assert.ok(orbStep, 'nymrissa: orb step');
for (const name of ['그림자 망토', '거북의 상', '천상의 보호막']) assert.ok(orbStep.text.includes(name), `nymrissa immunity examples: ${name}`);
// 2026-10-23 사용자 정리: 9개를 어떻게든 처리하면 되고, 무적기는 중첩이 쌓이지 않아 쉬워지는 수단이다. 먹는 때는 심연의 비 지속 피해 뒤.
for (const phrase of ['심연의 비', '9개', '중첩이 쌓이지 않아', '꼭 필요한 것은 아닙니다', '죽음의 기사']) assert.ok(orbStep.text.includes(phrase), `nymrissa orb split: ${phrase}`);
// '1무적조'·'무적조'·얼음 방패 설명은 빼기로 했다(2026-10-23).
for (const word of ['무적조', '얼음 방패', '차례로 밟']) assert.ok(!JSON.stringify(nymrissa).includes(word), `nymrissa: removed wording is back: ${word}`);
// 2026-10-23 사용자 정정: 죽음의 기사는 단단해서가 아니라 대마법 보호막을 켜면 중첩이 쌓이지 않아서 구슬을 여러 개 맡는다. 9개는 대상자 3명이 3개씩 떨군 것이다.
for (const phrase of ['대마법 보호막', '대상자 3명이 3개씩']) assert.ok(orbStep.text.includes(phrase), `nymrissa orb reason: ${phrase}`);
assert.ok(guide.skills.some(skill => skill.name === '대마법 보호막' && skill.id === 48707), 'nymrissa: 대마법 보호막 tooltip skill');
for (const word of ['단단한 사람', '죽음의 기사처럼 단단']) assert.ok(!JSON.stringify(nymrissa).includes(word), `nymrissa: DK orb reason is AMS, not tankiness: ${word}`);
// 2026-10-23 사용자 지시: 화면에 '사용자 확인·요청·지정' 같은 내부 작업 표시를 쓰지 않는다(메타데이터도 번들에 실리므로 함께 본다).
{
  const mark = JSON.stringify(guide).match(/사용자 ?(확인|결정|요청|지정|정정|지시|확정|지적|원칙)|사용자가 (정한|보낸|확인)/);
  assert.ok(!mark, `raid guide shows an internal user-decision mark: ${mark && mark[0]}`);
}
// 2026-10-23 사용자 정정: 맹독 심연 같은 보통의 신화 레이드는 20명 고정이고, 탄력 공격대는 키식스 해방뿐이다.
assert.ok(guide.page.notes.some(note => note.includes('20명 고정')), 'page note: mythic raids are fixed 20');
for (const ep of guide.episodes.filter(e => e.id !== 'kithix')) assert.ok(!JSON.stringify(ep).includes('탄력'), `${ep.id}: flexible raid wording only for Kithix`);
const vashnik = bosses.find(b => b.id === 'vashnik');
// 2026-10-22 '레이드스트래츠 있는 건 바꿔' 요청으로 첫 파도 징표 줄은 raidstrats 오프셋 플랜의 색 순서를 따른다.
assert.ok(JSON.stringify(vashnik).includes('은빛 달, 주황 동그라미, 초록 세모, 노란 별, 빨간 가위'), 'vashnik marker line (raidstrats offset order)');
assert.ok(!JSON.stringify(vashnik).includes('보라 마름모, 파란 네모, 해골, 빨간 가위'), 'vashnik: old marker order is gone');
const sentinels = bosses.find(b => b.id === 'sentinels');
assert.ok(JSON.stringify(sentinels).includes('초록 하나인 사람은 멈춰서 핑을 찍고'), 'sentinels: 1 pings');
const explorers = bosses.find(b => b.id === 'explorers');
assert.ok(JSON.stringify(explorers).includes('나마 → 게보 → 이쿠'), 'explorers fish order');
const ulatek = bosses.find(b => b.id === 'ulatek');
const fangStep = ulatek.phases.flatMap(p => p.steps).find(step => step.title.includes('송곳니'));
assert.equal(fangStep.kind, '선택 택틱', 'ulatek fangs is a choice');
assert.ok(fangStep.text.includes('한 명이 먼저 끊고') && fangStep.text.includes('나머지 다섯'), 'ulatek fangs 1+5');
// 2026-10-23 사용자 지적: 울라텍 사잇단계는 따로 된 단상 지도(raidplan 'Platform')에서 징표 8구역으로 그린다.
const intermissionStep = ulatek.phases.flatMap(p => p.steps).find(step => step.title.startsWith('사잇단계'));
assert.equal(intermissionStep.figure.plan, '05-ulatek-11', 'ulatek intermission figure');
assert.ok(intermissionStep.figure.caption.includes('사잇단계 지도') && intermissionStep.text.includes('징표 8곳'), 'ulatek intermission uses the zone map');

// 2026-10-23 실전 글 비교 반영: 공통된 것만 팁에, 갈리는 택틱은 '갈리는 택틱'에 참고로만 둔다.
assert.ok(guide.page.notes.some(note => note.includes('실전 글') && note.includes('참고로만')), 'page note: field common tips / split tactics are reference only');
const fieldTips = bosses.flatMap(b => b.tips.filter(tip => tip.source == null));
assert.ok(fieldTips.length >= 20, `field common tips without a source key: ${fieldTips.length}`);
for (const split of ['6개 동시', '광폭시키', '추방 없이', '하지 않아도 된다', '도발 없이']) assert.ok(!JSON.stringify(fieldTips).includes(split), `split tactic belongs in choices, not tips: ${split}`);
// 2026-10-23 사용자 지시: 출처에 인벤과 글쓴이 닉네임을 적지 않고 상위 공대 이름만 적는다.
const guideText = JSON.stringify(guide);
for (const banned of ['인벤', 'inven', '이당이당', '레키엘', '애기트럴', 'Lucide', '동그란기린', '극려']) assert.ok(!guideText.includes(banned), `no Inven / author nickname in the raid guide: ${banned}`);
for (const [id, title] of [['explorers', '게보만 광폭시키는 쉬운 공략'], ['vashnik', '셋째 불 쫄 추방'], ['coiled-altar', '두 번째 단두대 도발'], ['nekzali', '우물 조를 줄이는 운영'], ['ulatek', '남쪽 방 알 순서'], ['ulatek', '첫 번째 흡수 담당']]) {
  assert.ok(bosses.find(b => b.id === id).choices.some(c => c.title === title && c.why.includes('참고')), `${id}: split tactic as reference choice: ${title}`);
}
const raidPage = fs.readFileSync(path.join(SITE, 'src', 'pages', 'RaidGuidePage.js'), 'utf8');
assert.ok(raidPage.includes('data-choices-lead') && raidPage.includes('참고로만'), 'page must tell readers the split tactics are reference only');

// 2026-10-24 영웅 난이도 글: 영웅 통합 영상 v2 원고(네임드 10곳·장면 66개)를 네임드별 탭으로 옮겼다(/raid/heroic/<네임드 id>).
const heroic = guide.heroic;
assert.ok(heroic && heroic.page && heroic.page.lead && heroic.page.notes.length >= 3, 'heroic: page lead/notes');
assert.equal(heroic.metadata.difficulty, '영웅', 'heroic: difficulty label');
assert.deepEqual(heroic.bosses.map(b => b.id), bosses.map(b => b.id), 'heroic: same ten bosses in the same order as mythic');
assert.ok(/^[A-Za-z0-9_-]{11}$/.test(heroic.video.id), 'heroic: video id');
let heroicSteps = 0;
let lastSecond = -1;
for (const boss of heroic.bosses) {
  for (const field of ['label', 'name', 'place', 'principle', 'summary']) assert.ok(boss[field], `heroic ${boss.id}: ${field}`);
  assert.ok(/^#[0-9a-f]{6}$/i.test(boss.color), `heroic ${boss.id}: color`);
  assert.deepEqual(boss.roles.map(r => r.role), ['탱커', '힐러', '딜러'], `heroic ${boss.id}: tank/healer/dps roles`);
  for (const role of boss.roles) assert.ok(role.text, `heroic ${boss.id}: role text`);
  assert.ok(Number.isInteger(boss.videoSecond) && boss.videoSecond > lastSecond, `heroic ${boss.id}: video chapter second`);
  lastSecond = boss.videoSecond;
  for (const id of boss.sprites) assert.ok(fs.existsSync(path.join(RAID_IMAGES, 'sprites', `${id}.webp`)), `heroic ${boss.id}: missing sprite ${id}`);
  assert.ok(boss.phases.length >= 3 && boss.phases.length <= 4, `heroic ${boss.id}: 3~4 phases`);
  assert.equal(new Set(boss.phases.map(p => p.id)).size, boss.phases.length, `heroic ${boss.id}: phase ids unique`);
  for (const phase of boss.phases) {
    assert.ok(phase.title && phase.steps.length >= 1, `heroic ${boss.id}/${phase.id}: steps`);
    for (const s of phase.steps) {
      assert.ok(['공통', '배정', '선택 택틱'].includes(s.kind), `heroic ${boss.id}: kind ${s.kind} (no 신화 steps on the heroic tab)`);
      assert.ok(s.title && s.text && s.warn, `heroic ${boss.id}/${s.title}: title/text/warn`);
      assert.ok(!s.figure, `heroic ${boss.id}: no mythic plan figure on heroic steps`);
      heroicSteps++;
    }
  }
  for (const choice of boss.choices || []) for (const field of ['title', 'picked', 'alt', 'why']) assert.ok(choice[field], `heroic ${boss.id}: choice ${field}`);
  assert.ok(boss.sources.length >= 1, `heroic ${boss.id}: sources`);
  for (const key of boss.sources) assert.ok(heroic.sources[key], `heroic ${boss.id}: source ${key}`);
}
assert.equal(heroicSteps, 66, `heroic: 66 steps (one per video scene), got ${heroicSteps}`);
for (const [key, source] of Object.entries(heroic.sources)) assert.ok(source.title && /^https:\/\//.test(source.href) && source.note, `heroic source ${key}`);
for (const id of ['nekzali', 'sentinels', 'explorers', 'vashnik', 'sszorak', 'fangs', 'coiled-altar', 'kithix']) {
  const boss = heroic.bosses.find(b => b.id === id);
  assert.ok(boss.sources.some(key => /raidstrats\.gg\/guides\/[^/]+\/heroic$/.test(heroic.sources[key].href)), `heroic ${id}: raidstrats heroic source`);
}
const heroicText = JSON.stringify(heroic);
assert.ok(!heroicText.includes('탄력'), 'heroic: no 탄력 wording');
// 영웅 선택 규칙(heroic-raid-integrated-20261024/sources/selection.json): 울라텍 송곳니는 양쪽 합쳐 두 명씩, 신화 1+5를 옮겨 쓰지 않는다.
const heroicUlatek = heroic.bosses.find(b => b.id === 'ulatek');
const heroicFangs = heroicUlatek.phases.flatMap(p => p.steps).find(s => s.title.includes('송곳니'));
assert.ok(heroicFangs.text.includes('두 명씩') && !heroicFangs.text.includes('다섯'), 'heroic ulatek fangs: two at a time');
assert.ok(heroicUlatek.phases.flatMap(p => p.steps).some(s => s.title.startsWith('물어뜯기') && s.title.includes('세 조') && s.text.includes('근접 조·힐러 조·원거리 조')), 'heroic ulatek: three soak groups');
const heroicExplorers = heroic.bosses.find(b => b.id === 'explorers');
const fishStep = heroicExplorers.phases.flatMap(p => p.steps).find(s => s.pairs);
assert.deepEqual(fishStep.pairs.map(p => p.boss), ['나마', '게보', '이쿠'], 'heroic explorers: fish order example 나마 → 게보 → 이쿠');
assert.ok(heroicExplorers.choices.some(c => c.alt.includes('게보 → 나마 → 이쿠')), 'heroic explorers: raidstrats order as reference');
// 님리사 영웅에는 신화 전용 얼음비늘 멀록·구슬 흡수 폭발을 넣지 않는다.
const heroicNymrissa = heroic.bosses.find(b => b.id === 'nymrissa');
assert.ok(!JSON.stringify(heroicNymrissa.phases).includes('얼음비늘'), 'heroic nymrissa: mythic-only frost-scale murlocs stay out of the steps');

// 화면 연결: 상단 메뉴 탭과 라우트.
const nav = fs.readFileSync(path.join(SITE, 'src', 'components', 'Navigation.js'), 'utf8');
assert.ok(nav.includes("{ path: '/raid', label: '레이드 가이드'"), 'Navigation must have the 레이드 가이드 tab');
const app = fs.readFileSync(path.join(SITE, 'src', 'App.js'), 'utf8');
assert.ok(app.includes('<Route path="/raid" element={<RaidGuidePage />} />') && app.includes('<Route path="/raid/:episodeId" element={<RaidGuidePage />} />'), 'App must route /raid and /raid/:episodeId');
assert.ok(app.includes('<Route path="/raid/heroic" element={<RaidGuidePage heroic />} />') && app.includes('<Route path="/raid/heroic/:bossId" element={<RaidGuidePage heroic />} />'), 'App must route /raid/heroic and /raid/heroic/:bossId');
assert.ok(!guide.episodes.some(e => e.id === 'heroic'), "mythic episode id must not be 'heroic' (reserved for the heroic tab)");
const page = fs.readFileSync(path.join(SITE, 'src', 'pages', 'RaidGuidePage.js'), 'utf8');
assert.ok(page.includes("from '../data/raidGuide.json'") && page.includes('data-wowhead={`spell=${term.id}&domain=ko`}'), 'page must read the generated JSON and render tooltip links');

console.log(`Raid guide validation passed: ${guide.episodes.length} episodes, ${bosses.length} bosses, ${steps} steps (${stepFigures} with plans), ${plans.length} plans, ${tips} tips, ${guide.spells.length} spells, ${guide.skills.length} player skills; heroic ${heroic.bosses.length} bosses, ${heroicSteps} steps`);
