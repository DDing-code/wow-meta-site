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
  return new Function(`${source}\nreturn { ${names.join(', ')} };`)();
}

const guideSource = read('src/data/foreverGuide.js');
const pageSource = read('src/pages/ForeverPage.js');
const guide = loadModule('src/data/foreverGuide.js', ['foreverSources', 'foreverPages', 'foreverHome', 'foreverStart', 'foreverRules']);
const editions = loadModule('src/data/gameEditions.js', ['EDITIONS', 'FOREVER_ROOT', 'getEdition', 'getEditionSwitchPath']);

// 1. 근거: 블리자드 한국어 공지만, 항목이 가리키는 근거 이름은 모두 있어야 한다.
const sourceIds = Object.keys(guide.foreverSources);
for (const [id, source] of Object.entries(guide.foreverSources)) {
  assert.ok(/^https:\/\/(worldofwarcraft\.blizzard\.com\/ko-kr\/news\/\d+|news\.blizzard\.com\/ko-kr\/article\/\d+\/)$/.test(source.url), `근거 ${id}: 블리자드 한국어 공지 주소가 아님 (${source.url})`);
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
for (const id of sourceIds) assert.ok(used.has(id), `근거 ${id}: 어느 항목도 쓰지 않음`);

// 2. 공지에서 확인한 사실이 바뀌지 않게 붙잡아 둔다(고치려면 공지를 다시 확인한 뒤 여기와 함께 고친다).
const text = JSON.stringify([guide.foreverHome, guide.foreverStart, guide.foreverRules]);
for (const fact of ['2026년 11월 5일', '오전 8시(한국 시간)', '1~60레벨', '12월 10일', '지하 심굴 10인', '하이잘 정상 20인', '오닉시아의 둥지 40인', '비룡불꽃 아뮬렛', '16점', '언데드 성기사', '스카이본', '영웅 꾸러미']) {
  assert.ok(text.includes(fact), `공지에서 확인한 내용이 빠짐: ${fact}`);
}
assert.deepStrictEqual(guide.foreverRules.rules.map(rule => rule.name), ['일반', 'PvP', '롤플레이', '롤플레이 PvP', '하드코어'], '규칙 다섯 가지와 순서');
assert.ok(guide.foreverRules.rules.find(rule => rule.name === '하드코어').tag, '하드코어는 출시 뒤 추가 예정으로 표시');
assert.strictEqual(guide.foreverStart.steps.length, 6, '시작 단계는 여섯 개');
assert.strictEqual(guide.foreverStart.steps.filter(step => step.presets).length, 1, '사전 설정 표는 한 단계에만');
assert.strictEqual(guide.foreverStart.presets.rows.length, 6, '사전 설정 처음 설정 여섯 줄');

// 3. 사이트 용어·금지어(가이드 용어 규칙과 내부 작업 표시 금지).
for (const banned of ['우두머리', '졸개', '보스', '로테이션', '오프너', '신화+', '버스트', '임의 번역', '인벤']) {
  assert.ok(!text.includes(banned), `쓰지 않는 말: ${banned}`);
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
assert.deepStrictEqual(guide.foreverPages.map(page => page.path), ['/forever', '/forever/start', '/forever/rules'], '포에버 페이지 주소');
for (const page of guide.foreverPages) {
  assert.ok(app.includes(`path="${page.path}" element={<ForeverPage section="${page.id}" />}`), `App.js에 ${page.path} 경로가 없음`);
  assert.ok(siteMeta.includes(`'${page.path}': {`), `siteMeta.js STATIC_PAGES에 ${page.path}가 없음`);
}
const nav = read('src/components/Navigation.js');
assert.ok(nav.includes('getEditionSwitchPath(location.pathname, item.id)') && nav.includes('aria-label="게임 버전"'), '상단 메뉴에 리테일/포에버 토글이 없음');
for (const page of guide.foreverPages) assert.ok(nav.includes(`path: '${page.path}'`), `포에버 메뉴에 ${page.path}가 없음`);

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

console.log(`✅ 포에버 안내 ${guide.foreverPages.length}쪽·근거 ${sourceIds.length}개·토글 주소 규칙 확인`);
