#!/usr/bin/env node
// 포에버 안내(/forever, /forever/start, /forever/rules)와 리테일/포에버 토글 검사. npm run validate:forever
// - 포에버 글(src/data/foreverGuide.js)의 항목마다 근거가 있고, 근거는 블리자드 한국어 공지 주소여야 한다.
// - 포에버 자료는 리테일 KB·스킬 DB와 섞지 않는다(리테일 KB는 주문 번호 하나로 색인해서 서로 덮어쓴다).
// - 토글은 주소로만 버전을 가른다: 짝이 있는 페이지는 짝으로, 없으면 그 버전의 홈으로 간다.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(SITE_ROOT, file), 'utf8');

function loadModule(file, names) {
  const source = read(file)
    .replace(/^import .*$/gm, '')
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function');
  return new Function('foreverTalents', 'foreverVisuals', `${source}\nreturn { ${names.join(', ')} };`)(JSON.parse(read('src/data/foreverTalents.json')), JSON.parse(read('src/data/foreverVisuals.json')));
}

const guideSource = read('src/data/foreverGuide.js');
const pageSource = read('src/pages/ForeverPage.js');
const guide = loadModule('src/data/foreverGuide.js', ['FOREVER_ART_NOTE', 'foreverSources', 'foreverPages', 'foreverHome', 'foreverStart', 'foreverRules', 'foreverGuides', 'foreverDetailGuides', 'foreverVisualArt', 'isForeverPageActive']);
const editions = loadModule('src/data/gameEditions.js', ['EDITIONS', 'FOREVER_ROOT', 'getEdition', 'getEditionSwitchPath']);

// 별도 KB의 원문과 생성 파일, 미확인 설명의 빈칸을 유지한다.
const talents = JSON.parse(read('src/data/foreverTalents.json'));
assert.strictEqual(talents.metadata.edition, 'forever');
assert.strictEqual(talents.metadata.kbSource, '09-포에버/talents.json');
const talentSource = path.resolve(SITE_ROOT, '../WoW-Meta-Knowledge', talents.metadata.kbSource);
if (fs.existsSync(talentSource)) assert.deepStrictEqual(talents, JSON.parse(fs.readFileSync(talentSource, 'utf8')), '포에버 KB와 생성 특성 설명 불일치');
assert.deepStrictEqual(Object.keys(talents.classes).sort(), Object.entries(guide.foreverDetailGuides).filter(([, page]) => page.parent === 'classes').map(([id]) => id.split('/')[1]).sort());
const spellIds = new Set();
const abilities = JSON.parse(read('src/data/foreverSpells.json'));
assert.strictEqual(abilities.metadata.edition, 'forever');
const abilitySource = path.resolve(SITE_ROOT, '../WoW-Meta-Knowledge', abilities.metadata.kbSource);
if (fs.existsSync(abilitySource)) assert.deepStrictEqual(abilities, JSON.parse(fs.readFileSync(abilitySource, 'utf8')), '포에버 일반 주문 정본과 생성본 불일치');
for (const spell of Object.values(abilities.classes).flat()) {
  assert.ok(spell.id && spell.name && /^[a-z0-9_]+$/.test(spell.icon));
  assert.ok(spell.source.startsWith(`https://www.wowhead.com/forever/ko/spell=${spell.id}/`));
  assert.ok(spell.verified && /[가-힣]/.test(spell.description));
  assert.ok(spell.rank === null || Number.isInteger(spell.rank) && spell.rank > 0);
}
for (const [id, spells] of Object.entries(talents.classes)) {
  assert.ok(spells.filter(spell => spell.verified).length >= 3, `${id}: 확인된 핵심 특성 설명 부족`);
  for (const spell of spells) {
    assert.ok(Number.isInteger(spell.id) && spell.id > 0 && !spellIds.has(spell.id), `${id}: 주문 번호 누락·중복`);
    spellIds.add(spell.id);
    assert.ok(spell.name && /^[a-z0-9_]+$/.test(spell.icon), `${id}/${spell.id}: 이름·아이콘 누락`);
    assert.strictEqual(spell.rank, 1);
    const source = new URL(spell.source);
    assert.strictEqual(source.origin, 'https://www.wowhead.com');
    assert.ok(source.pathname.startsWith(`/forever/ko/spell=${spell.id}/`), `${id}/${spell.id}: 포에버 한국어 원문이 아님`);
    assert.strictEqual(source.searchParams.get('rank'), '1');
    assert.ok(/^\d+$/.test(source.searchParams.get('def')), `${id}/${spell.id}: 특성 정의 번호 누락`);
    assert.strictEqual(typeof spell.verified, 'boolean');
    if (spell.verified) assert.ok(/[가-힣]/.test(spell.description) && !/[<>$]/.test(spell.description), `${id}/${spell.id}: 한국어 원문 누락·수식 미해결`);
    else assert.ok(spell.description === '' && spell.reason, `${id}/${spell.id}: 미확인 설명을 채우면 안 됨`);
  }
}

// 1. 근거: 블리자드 한국어 공지만, 항목이 가리키는 근거 이름은 모두 있어야 한다.
const sourceIds = Object.keys(guide.foreverSources);
for (const [id, source] of Object.entries(guide.foreverSources)) {
  assert.ok(/^https:\/\/(worldofwarcraft\.blizzard\.com\/ko-kr\/news\/\d+|news\.blizzard\.com\/ko-kr\/article\/\d+\/|forever-tavern\.com\/guides\/[a-z-]+\/|foreverdb\.net\/(guide\/[a-z-]+|class\/(Warrior|Paladin|Hunter|Rogue|Priest|Shaman|Mage|Warlock|Druid)(\/builds)?)|bindonforever\.com\/leveling(\/(alliance|horde))?|www\.method\.gg\/wow-forever\/all-travel-routes-in-wow-forever-boats-zeppelins|www\.wowhead\.com\/forever\/ko\/(talent-calc\/[a-z]+|guide\/zones-maps-locations-rewards|world-map))$/.test(source.url), `근거 ${id}: 허용한 포에버 근거 주소가 아님 (${source.url})`);
  assert.ok(source.label, `근거 ${id}: 제목 없음`);
}
const used = new Set();
function checkSources(where, list) {
  assert.ok(Array.isArray(list) && list.length, `${where}: 근거가 없음`);
  for (const id of list) {
    assert.ok(sourceIds.includes(id), `${where}: 모르는 근거 '${id}'`);
    used.add(id);
  }
}
guide.foreverHome.facts.forEach(item => checkSources(`홈 요약 '${item.label}'`, item.sources));
guide.foreverHome.differences.forEach(item => checkSources(`다른 점 '${item.topic}'`, item.sources));
guide.foreverStart.steps.forEach(item => checkSources(`시작 단계 '${item.title}'`, item.sources));
checkSources('시작하기 처음 알아둘 것', guide.foreverStart.basicsSources);
guide.foreverRules.rules.forEach(item => checkSources(`규칙 '${item.name}'`, item.sources));
checkSources('친구와 같이 하려면', guide.foreverRules.togetherSources);
checkSources('고른 뒤에 바꿀 수 있나요', guide.foreverRules.limitsSources);
const allGuides = { ...guide.foreverGuides, ...guide.foreverDetailGuides };
for (const [id, page] of Object.entries(allGuides)) {
  assert.ok(page.title && page.lead && page.sections.length, `${id}: 빈 안내`);
  assert.strictEqual(new Set(page.sections.map(block => block.id)).size, page.sections.length, `${id}: 중복 목차`);
  page.sections.forEach(block => {
    checkSources(`${id}/${block.id}`, block.sources);
    assert.ok(block.title && (block.items?.length || block.table?.rows.length || block.links?.length || block.spells?.length || block.map || block.journey || block.combat || block.flows?.length), `${id}/${block.id}: 빈 본문`);
    block.items?.forEach(item => assert.ok(item.title && item.body, `${id}/${block.id}: 빈 항목`));
    block.table?.rows.forEach(row => assert.ok(row.length === block.table.columns.length && row.every(Boolean), `${id}/${block.id}: 표 열 불일치·빈 칸`));
    block.links?.forEach(link => {
      assert.ok(link.label && (/^\/forever(?:\/|#|$)/.test(link.path) || /^https:\/\/(forever-tavern\.com|foreverdb\.net)\//.test(link.path) || /^https:\/\/bindonforever\.com\/leveling\/(alliance|horde)$/.test(link.path)), `${id}/${block.id}: 잘못된 연결`);
      if (link.path.startsWith('/forever/')) {
        const [pathname, hash] = link.path.split('#');
        const target = allGuides[pathname.slice('/forever/'.length)];
        assert.ok(target, `${id}: 없는 포에버 가이드 연결 (${link.path})`);
        if (hash) assert.ok(target.sections.some(section => section.id === hash) || target.index?.id === hash, `${id}: 없는 목차 연결 (${link.path})`);
      }
    });
  });
}
// 직업 가이드·레벨링 가이드 탭의 목록: 상세 쪽을 빠짐없이 한 번씩, 실제 있는 주소로 연결한다.
const indexPaths = [];
const groupPaths = [];
for (const [id, page] of Object.entries(allGuides)) {
  if (!page.index) continue;
  checkSources(`${id}/목록`, page.index.sources);
  assert.ok(page.index.id && page.index.title && page.index.lead && page.index.groups.length, `${id}: 빈 목록`);
  for (const group of page.index.groups) {
    assert.ok(group.label && /^#[0-9a-f]{6}$/i.test(group.color) && group.items.length, `${id}/${group.id}: 목록 묶음 누락`);
    if (group.path) {
      assert.ok(allGuides[group.path.slice('/forever/'.length)], `${id}/${group.id}: 없는 묶음 주소`);
      groupPaths.push(group.path);
    }
    for (const item of group.items) {
      assert.ok(item.label && item.description && allGuides[item.path.slice('/forever/'.length)], `${id}/${group.id}: 목록 칸 누락 (${item.path})`);
      indexPaths.push(item.path);
    }
  }
}
assert.deepStrictEqual(guide.foreverGuides.classes.index.groups.map(group => group.items.length), Array(9).fill(3), '직업 가이드 목록: 아홉 직업 × 전문화 셋');
assert.deepStrictEqual(guide.foreverGuides.races.index.groups.map(group => group.items.length), [5, 5], '레벨링 가이드 목록: 진영별 다섯 종족');
for (const [id, page] of Object.entries(guide.foreverDetailGuides)) {
  const listed = indexPaths.filter(item => item === `/forever/${id}`).length;
  if (page.specialization || page.parent === 'leveling') assert.strictEqual(listed, 1, `${id}: 탭 목록에 한 번만 있어야 함`);
  if (page.parent === 'classes') assert.ok(groupPaths.includes(`/forever/${id}`), `${id}: 직업 가이드 목록의 직업 제목에 연결되지 않음`);
  assert.ok(page.back && (allGuides[page.back.path.split('#')[0].slice('/forever/'.length)]), `${id}: 목록으로 돌아가는 단추 누락`);
}
for (const id of sourceIds) assert.ok(used.has(id), `근거 ${id}: 어느 항목도 쓰지 않음`);

// 2. 공지에서 확인한 사실이 바뀌지 않게 붙잡아 둔다(고치려면 공지를 다시 확인한 뒤 여기와 함께 고친다).
const text = JSON.stringify([guide.foreverHome, guide.foreverStart, guide.foreverRules, allGuides]);
for (const fact of ['2026년 11월 5일', '오전 8시(한국 시간)', '1~60레벨', '12월 10일', '지하 심굴 10인', '하이잘 정상 20인', '오닉시아의 둥지 40인', '비룡불꽃 아뮬렛', '16점', '언데드 성기사', '스카이본', '영웅 꾸러미']) {
  assert.ok(text.includes(fact), `공지에서 확인한 내용이 빠짐: ${fact}`);
}
assert.deepStrictEqual(guide.foreverRules.rules.map(rule => rule.name), ['일반', 'PvP', '롤플레이', '롤플레이 PvP', '하드코어'], '규칙 다섯 가지와 순서');
assert.ok(guide.foreverRules.rules.find(rule => rule.name === '하드코어').tag, '하드코어는 출시 뒤 추가 예정으로 표시');
assert.strictEqual(guide.foreverStart.steps.length, 6, '시작 단계는 여섯 개');
assert.strictEqual(guide.foreverStart.steps.filter(step => step.presets).length, 1, '사전 설정 표는 한 단계에만');
assert.strictEqual(guide.foreverStart.presets.rows.length, 6, '사전 설정 처음 설정 여섯 줄');

// 2-1. 그림: 쪽마다 대표 그림, 항목마다 그림 하나. 파일(작은 판·큰 판)이 있고 설명(alt)이 있어야 한다.
// 그림은 공식 아트·공지 스크린샷을 도트로 다시 그린 것이라, 실제 게임 화면이 아니라는 안내를 근거 아래에 함께 보여 준다.
const ART_WIDTHS = { hero: [768, 1536], square: [512, 1024], scene: [640, 1280] };
const artIds = new Set();
function checkArt(where, art, { decorative = false } = {}) {
  assert.ok(art && /^[a-z0-9-]+$/.test(art.id || ''), `${where}: 그림(art.id)이 없음`);
  const widths = ART_WIDTHS[art.kind || 'scene'];
  assert.ok(widths, `${where}: 모르는 그림 종류 '${art.kind}'`);
  for (const width of widths) {
    const file = `public/images/forever/${art.id}-${width}.webp`;
    assert.ok(fs.existsSync(path.join(SITE_ROOT, file)), `${where}: 그림 파일이 없음 (${file})`);
  }
  if (decorative) assert.strictEqual(art.alt, '', `${where}: 글과 같은 내용을 되풀이하는 그림은 alt를 비운다`);
  else assert.ok(typeof art.alt === 'string' && art.alt.length >= 8, `${where}: 그림 설명(alt)이 없음`);
  if (!decorative) {
    artIds.add(art.id);
  }
}
checkArt('홈 대표 그림', guide.foreverHome.art);
checkArt('시작하기 대표 그림', guide.foreverStart.art);
checkArt('규칙·진영 대표 그림', guide.foreverRules.art);
guide.foreverHome.differences.forEach(item => checkArt(`다른 점 '${item.topic}'`, item.art));
guide.foreverHome.next.forEach(item => checkArt(`이어서 보기 '${item.title}'`, item.art, { decorative: true }));
guide.foreverStart.steps.forEach(item => checkArt(`시작 단계 '${item.title}'`, item.art));
guide.foreverStart.basics.forEach(item => checkArt(`처음 알아둘 것 '${item.title}'`, item.art));
checkArt('첫 모험 팁', guide.foreverStart.tipsArt);
guide.foreverRules.rules.forEach(item => checkArt(`규칙 '${item.name}'`, item.art));
checkArt('친구와 같이 하려면', guide.foreverRules.togetherArt);
assert.ok(/도트로 다시 그린/.test(guide.FOREVER_ART_NOTE) && /실제 게임 화면과 다릅니다/.test(guide.FOREVER_ART_NOTE), '그림 안내 문구(도트로 다시 그림·실제 화면과 다름)가 없음');
assert.ok(pageSource.includes('{FOREVER_ART_NOTE}'), '근거 아래에 그림 안내 문구를 보여 주지 않음');
const onDisk = fs.readdirSync(path.join(SITE_ROOT, 'public/images/forever')).filter(name => name.endsWith('.webp')).map(name => name.replace(/-\d+\.webp$/, ''));
guide.foreverVisualArt.forEach(art => checkArt('시각 안내 '+art.id, art));
for (const id of new Set(onDisk)) assert.ok(artIds.has(id), `public/images/forever: 쓰지 않는 그림 (${id})`);
// 공통 지형과 직업 삽화는 같은 설명을 가진 상세 쪽에서 재사용한다.
for (const [id, page] of Object.entries(allGuides)) {
  assert.ok(artIds.has(page.art.id) && page.art.alt.length >= 8, `${id}: 기존 대표 그림·설명 누락`);
  for (const block of page.sections) {
    if (block.art) assert.ok(artIds.has(block.art.id) && block.art.alt.length >= 8, `${id}/${block.id}: 본문 그림·설명 누락`);
  }
}
assert.strictEqual(guide.foreverGuides.leveling.sections.find(block => block.id === 'dungeons').table.rows.length, 9, '새 던전 아홉 곳');
assert.strictEqual(guide.foreverGuides.growth.sections.find(block => block.id === 'facilities').table.rows.length, 10, '첫 캠핑 설비 열 종류');
assert.strictEqual(guide.foreverGuides.classes.sections.find(block => block.id === 'combinations').table.rows.length, 6, '새 종족·직업 조합 여섯 가지');
for (const id of ['alliance-attunement', 'horde-attunement']) {
  const block = guide.foreverGuides.raids.sections.find(block => block.id === id);
  assert.ok(block?.items.length && block.items.some(item => item.body.includes('드라키사스')), `${id}: 진영별 입장 퀘스트 누락`);
}

// 3. 사이트 용어·금지어(가이드 용어 규칙과 내부 작업 표시 금지).
// 공식 고유명사 '엠버스트라이프'의 일부는 금지어 '버스트'가 아니다.
const copyText = text.replaceAll('엠버스트라이프', '').replaceAll('무리의 우두머리', '');
for (const banned of ['우두머리', '졸개', '보스', '로테이션', '오프너', '신화+', '버스트', '임의 번역', '인벤']) {
  assert.ok(!copyText.includes(banned), `쓰지 않는 말: ${banned}`);
}
const mark = text.match(/사용자 ?(확인|결정|요청|지정|정정|지시|확정|지적|원칙)|사용자가 (정한|보낸|확인)/);
assert.ok(!mark, `내부 작업 표시: ${mark && mark[0]}`);

// 4. 리테일 자료와 섞지 않는다.
for (const [file, source] of [['src/data/foreverGuide.js', guideSource], ['src/pages/ForeverPage.js', pageSource]]) {
  for (const retail of ['kb-skills', 'kb-synergies', 'guideRegistry', 'guideManuscripts', 'raidGuide', 'mythicPlusGuide', 'beginnerGuide']) {
    assert.ok(!new RegExp(`import[^;]*${retail}`).test(source), `${file}: 리테일 자료(${retail})를 읽으면 안 됨`);
  }
}
for (const file of ['src/data/kb-skills.json', 'src/data/kb-synergies.json']) {
  assert.ok(!/포에버|"forever"/i.test(read(file)), `${file}: 리테일 스킬 DB에 포에버 자료가 들어 있음`);
}

// 5. 주소·메뉴·검색 제목 연결.
const app = read('src/App.js');
const siteMeta = read('src/data/siteMeta.js');
assert.deepStrictEqual(guide.foreverPages.map(page => page.path), ['/forever', '/forever/start', '/forever/rules', '/forever/classes', '/forever/races', '/forever/leveling', '/forever/growth', '/forever/raids'], '포에버 페이지 주소');
for (const page of guide.foreverPages) {
  assert.ok(app.includes(`path="${page.path}" element={<ForeverPage section="${page.id}" />}`), `App.js에 ${page.path} 경로가 없음`);
  assert.ok(siteMeta.includes(`'${page.path}': {`), `siteMeta.js STATIC_PAGES에 ${page.path}가 없음`);
}
const nav = read('src/components/Navigation.js');
assert.strictEqual(Object.values(guide.foreverDetailGuides).filter(page => page.parent === 'classes').length, 9, '직업별 가이드 아홉 쪽');
assert.strictEqual(Object.values(guide.foreverDetailGuides).filter(page => page.parent === 'leveling').length, 10, '종족별 가이드 열 쪽');
assert.strictEqual(Object.values(guide.foreverDetailGuides).filter(page => page.specialization).length, 27, '전문화별 가이드 27쪽');
const visuals = JSON.parse(read('src/data/foreverVisuals.json'));
assert.strictEqual(Object.keys(visuals.combat).length, 27);
const knownSpells = new Map([...Object.values(talents.classes).flat(), ...Object.values(abilities.classes).flat()].map(s => [s.id, s]));
for (const [key, combat] of Object.entries(visuals.combat)) {
  assert.ok(guide.foreverDetailGuides[`classes/${key}`]);
  assert.ok(combat.core.length && combat.principle.length === 3 && combat.flows.length === 3);
  for (const step of [...combat.principle, ...combat.flows.flatMap(flow => flow.steps)]) if (step.id) assert.ok(knownSpells.get(step.id)?.verified, `${key}: 미확인 기술로 전투 설명`);
}
assert.strictEqual(Object.keys(visuals.routes).length, 10);
assert.deepStrictEqual(Object.keys(visuals.journeys).sort(), Object.keys(visuals.routes).sort(), '종족 열 개의 움직이는 경로');
const mapPlaces = new Map([...visuals.regions, ...visuals.places].map(place => [place.id, place]));
for (const [race, journey] of Object.entries(visuals.journeys)) {
  const page = guide.foreverDetailGuides[`leveling/${race}`];
  assert.strictEqual(page.sections.find(block => block.id === 'starting-map').journey, race);
  assert.strictEqual(journey.stages.length, page.sections.find(block => block.id === 'route').table.rows.length, `${race}: 초반 지도와 원고 구간 수`);
  const later = visuals.laterJourneys[journey.faction];
  assert.strictEqual(later.length, page.sections.find(block => block.id === 'after-30').table.rows.length, `${race}: 후반 지도와 원고 구간 수`);
  for (const stage of [...journey.stages, ...later]) {
    assert.ok(stage.travel && stage.points.length, `${race}: 이동 안내 누락`);
    for (const id of stage.points) assert.ok(mapPlaces.has(id), `${race}: 없는 지도 지점 ${id}`);
    assert.strictEqual(new Set(stage.points).size, stage.points.length, `${race}: 구간 안 중복 지점`);
  }
}
assert.deepStrictEqual(visuals.journeys.dwarf, visuals.journeys.gnome);
assert.deepStrictEqual(visuals.journeys.orc, visuals.journeys.troll);
assert.deepStrictEqual(visuals.journeys['skyborne-alliance'].stages[1].points, ['dalaran-transit', 'stormwind']);
assert.deepStrictEqual(visuals.journeys['skyborne-horde'].stages[1].points, ['skyborne-landing']);
assert.strictEqual(visuals.places.filter(p => p.kind === 'dungeon').length, 9);
assert.strictEqual(visuals.places.filter(p => p.kind === 'raid').length, 3);
for (const place of [...visuals.places, ...visuals.regions]) assert.ok(place.x >= 0 && place.x <= 903 && place.y >= 0 && place.y <= 640 && typeof place.marker === 'boolean');
assert.strictEqual(Object.values(guide.foreverDetailGuides).filter(page => page.specialization && page.sections.some(block => block.id === 'talents')).length, 27, '전문화 27개 배분 견본 누락');
assert.ok(app.includes('Object.keys(foreverDetailGuides).map'), '상세 가이드 주소 연결 누락');
const displayedSpellIds = new Set();
for (const [id, page] of Object.entries(guide.foreverDetailGuides)) {
  assert.ok(siteMeta.includes(`\n  '/forever/${id}': {`), `${id}: 검색 주소 누락`);
  assert.ok(indexPaths.includes(`/forever/${id}`) || groupPaths.includes(`/forever/${id}`) || allGuides[page.parent].sections.some(block => block.links?.some(link => link.path === `/forever/${id}`)), `${id}: 목록에서 찾을 수 없음`);
  if (page.parent === 'classes') {
    const links = page.sections.find(block => block.id === 'specializations')?.links;
    assert.strictEqual(links?.length, 3, `${id}: 전문화 세 개 연결 누락`);
    assert.ok(links.every(link => allGuides[link.path.slice('/forever/'.length)]?.parent === id), `${id}: 다른 직업 전문화를 연결함`);
  } else if (page.specialization) {
    const paths = page.sections.filter(block => block.id.startsWith('talent-guide-'));
    assert.strictEqual(paths.length, 1, `${id}: 선택한 전문화의 특성 가이드만 표시`);
    for (const spec of paths) {
      assert.ok(spec.title.includes('특성 가이드') && spec.milestones.length >= 2, `${id}/${spec.id}: 추천 순서 누락`);
      assert.ok(spec.sources.includes(`wowhead-${id.split('/')[1]}`) && spec.sources.includes(`db-${id.split('/')[1]}`), `${id}/${spec.id}: 교차 근거 누락`);
      assert.strictEqual(new Set(spec.milestones.map(step => step.spell?.id)).size, spec.milestones.length, `${id}/${spec.id}: 중복 이정표`);
      for (const step of spec.milestones) {
        assert.ok(step.spell && step.reason, `${id}/${spec.id}: 특성·이유 누락`);
        assert.deepStrictEqual(step.spell, talents.classes[id.split('/')[1]].find(spell => spell.id === step.spell.id), `${id}/${spec.id}: KB 원문과 다름`);
      }
    }
    const effects = page.sections.find(item => item.id === 'talent-effects')?.spells;
    assert.ok(effects?.length, `${id}: 특성 효과 누락`);
    for (const spell of effects) {
      assert.deepStrictEqual(spell, talents.classes[id.split('/')[1]].find(item => item.id === spell.id), `${id}: KB 원문과 다름`);
      displayedSpellIds.add(spell.id);
    }
    assert.ok(paths[0].milestones.every(step => effects.some(spell => spell.id === step.spell.id)), `${id}: 추천한 특성 효과 누락`);
    const block = page.sections.find(item => item.id === 'talents');
    for (const [level, distribution, total] of block?.table.rows || []) {
      const points = distribution.split(' / ').map(Number);
      assert.strictEqual(points.reduce((sum, n) => sum + n, 0), Number(level.replace('레벨', '')) - 9, `${id}/${level}: 기본 특성 점수`);
      assert.strictEqual(Number(total.replace('점', '')), points.reduce((sum, n) => sum + n, 0));
      const link = block.links.find(item => item.label.startsWith(level));
      assert.ok(link, `${id}/${level}: 견본 연결 누락`);
      const url = new URL(link.path);
      if (url.hostname === 'foreverdb.net') {
        const classId = id.split('/')[1];
        assert.strictEqual(url.pathname, `/class/${classId[0].toUpperCase()}${classId.slice(1)}/talents`);
        assert.strictEqual(Number(url.searchParams.get('lvl')), Number(level.replace('레벨', '')));
        const code = url.searchParams.get('t');
        assert.ok(/^[a-f0-9]{6}\.[0-5]*(?:-[0-5]*){0,2}$/.test(code), `${id}/${level}: 계산기 코드 형식`);
        const trees = code.split('.')[1].split('-');
        const totals = [0, 1, 2].map(index => [...(trees[index] || '')].reduce((sum, rank) => sum + Number(rank), 0));
        assert.deepStrictEqual(totals, points, `${id}/${level}: 계산기와 분야별 배분 불일치`);
        assert.ok(block.sources.includes(`db-builds-${classId}`) && block.lead.includes('검증') && block.lead.includes('초기화'), `${id}: 견본 근거·한계 안내 누락`);
        continue;
      }
      assert.strictEqual(url.hostname, 'forever-tavern.com');
      const build = JSON.parse(Buffer.from(url.searchParams.get('build').slice(3), 'base64url').toString('utf8'));
      assert.strictEqual(build.level, Number(level.replace('레벨', '')));
      assert.strictEqual(build.legacy, 0);
      assert.deepStrictEqual(build.talents.map(tree => tree.reduce((sum, [, n]) => sum + n, 0)), points, `${id}/${level}: 계산기와 배분 표 불일치`);
    }
  } else if (page.parent === 'leveling') {
    const leveling = page.sections.find(item => item.id === 'leveling-guide');
    assert.ok(leveling?.title.includes('레벨업 가이드') && leveling.items.length >= 3, `${id}: 별도 레벨업 가이드 누락`);
    assert.ok(leveling.items.some(item => item.title.includes('30~60') && item.title.includes('추정')), `${id}: 후반 동선 추정 안내 누락`);
    const later = page.sections.find(item => item.id === 'after-30');
    assert.strictEqual(later.table.rows.length, 7, `${id}: 30~60레벨 후보 표 누락`);
    const early = page.sections.find(item => item.id === 'route');
    assert.ok(early.table.rows.length >= 7 && early.sources.some(source => /^bof-(alliance|horde)$/.test(source)), `${id}: 종족별 퀘스트 경로 누락`);
    assert.ok(leveling.items[0].body.includes('합류') || leveling.items[0].body.includes('합쳐'), `${id}: 경로 합류 지점 누락`);
    assert.ok(!JSON.stringify(page).includes('도착지를 확정하지'), `${id}: 옛 스카이본 도착지 안내가 남음`);
    assert.ok(later.lead.includes('추정') && ['routes', 'dungeons', 'wowhead-zones', 'bof-leveling'].every(source => later.sources.includes(source)), `${id}: 추정·교차 근거 구분 누락`);
    assert.ok(later.table.rows.filter(row => !row[1].startsWith('강물터')).every(row => row[2].includes('추정')), `${id}: 추정 경로를 확정으로 표시함`);
  }
}
assert.deepStrictEqual([...displayedSpellIds].sort(), [...spellIds].sort(), '전문화 분리 뒤 KB 특성 설명이 누락됨');
assert.ok(nav.includes('getEditionSwitchPath(location.pathname, item.id)') && nav.includes('aria-label="게임 버전"'), '상단 메뉴에 리테일/포에버 토글이 없음');
for (const page of guide.foreverPages) assert.ok(nav.includes(`path: '${page.path}'`), `포에버 메뉴에 ${page.path}가 없음`);
// 종족별 상세(/forever/leveling/<종족>)에서는 지역·던전이 아니라 레벨링 가이드 탭이 켜져야 한다.
const isActive = guide.isForeverPageActive || (() => true);
assert.deepStrictEqual(guide.foreverPages.filter(page => isActive(page, '/forever/leveling/human')).map(page => page.id), ['races']);
assert.deepStrictEqual(guide.foreverPages.filter(page => isActive(page, '/forever/leveling')).map(page => page.id), ['leveling']);
assert.deepStrictEqual(guide.foreverPages.filter(page => isActive(page, '/forever/classes/warrior/arms')).map(page => page.id), ['classes']);
assert.ok(nav.includes("path: '/forever/leveling', label: '지역·던전', icon: MapIcon, exact: true") && nav.includes("match: ['/forever/leveling/']"), '상단 메뉴의 레벨링 가이드 탭 판정 누락');

// 6. 토글 주소 규칙.
const { getEdition, getEditionSwitchPath } = editions;
assert.deepStrictEqual(editions.EDITIONS.map(item => item.id), ['retail', 'forever']);
assert.strictEqual(getEdition('/'), 'retail');
assert.strictEqual(getEdition('/guide/hunter/marksmanship'), 'retail');
assert.strictEqual(getEdition('/forever'), 'forever');
assert.strictEqual(getEdition('/forever/rules/'), 'forever');
assert.strictEqual(getEdition('/forevermore'), 'retail');
assert.strictEqual(getEditionSwitchPath('/', 'forever'), '/forever');
assert.strictEqual(getEditionSwitchPath('/beginner', 'forever'), '/forever/start');
assert.strictEqual(getEditionSwitchPath('/raid/kithix', 'forever'), '/forever');
assert.strictEqual(getEditionSwitchPath('/forever', 'retail'), '/');
assert.strictEqual(getEditionSwitchPath('/forever/start', 'retail'), '/beginner');
assert.strictEqual(getEditionSwitchPath('/forever/rules', 'retail'), '/');
assert.strictEqual(getEditionSwitchPath('/guide', 'retail'), '/guide');
assert.strictEqual(getEditionSwitchPath('/forever/rules', 'forever'), '/forever/rules');

console.log(`✅ 포에버 안내 ${guide.foreverPages.length + Object.keys(guide.foreverDetailGuides).length}쪽·근거 ${sourceIds.length}개·그림 ${artIds.size}장·특성 배분·주소 규칙 확인`);
