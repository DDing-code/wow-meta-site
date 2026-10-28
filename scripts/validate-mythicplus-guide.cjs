#!/usr/bin/env node
// 쐐기 가이드(/mythicplus) 자료 검사.
// - KB 정본(00-공통/공용/Meta/mythicplus-guide.json)과 사이트의 생성 JSON(src/data/mythicPlusGuide.json)이 같은지(sync-kb를 돌렸는지)
// - 던전 8곳·풀링·네임드·몹·스킬 구조, 고정 용어(네임드·쫄·쐐기), 화면에 내부 작업 표시가 없는지
// - 그림(public/images/mythicplus: 전체 루트·풀링 지도·네임드 동작 도식·도트 모델·썸네일)이 모두 있는지
// - 스킬 설명이 공식(와우헤드 한국어 또는 게임 클라이언트 문장)인지, 표시(차단·해제·피하기·탱커·통제)가 범례와 맞는지
// - 영상 번호 칸(dungeons[].video.youtubeId)이 비었거나 유튜브 번호 형식인지, 장면 시각이 오름차순인지
// - 상단 메뉴·라우트·검색 노출·홈 줄에 /mythicplus 가 연결됐는지
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const SITE = path.resolve(__dirname, '..');
const KB_MASTER = path.resolve(SITE, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '00-공통', '공용', 'Meta', 'mythicplus-guide.json');
const GENERATED = path.join(SITE, 'src', 'data', 'mythicPlusGuide.json');
const IMAGES = path.join(SITE, 'public', 'images', 'mythicplus');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));

const guide = read(GENERATED);
if (fs.existsSync(KB_MASTER)) {
  assert.deepEqual(guide, read(KB_MASTER), 'src/data/mythicPlusGuide.json must equal the KB master (run npm run sync-kb)');
}

const registry = fs.readFileSync(path.join(SITE, 'src', 'data', 'guideRegistry.js'), 'utf8');
const patchLabel = /CURRENT_PATCH_LABEL = '([^']+)'/.exec(registry)[1];
assert.equal(guide.metadata.patch, patchLabel, `mythic+ guide patch must be ${patchLabel}`);
assert.equal(guide.metadata.difficulty, '쐐기', 'difficulty label is 쐐기');
assert.ok(guide.page.title && guide.page.lead && Array.isArray(guide.page.notes) && guide.page.notes.length >= 3, 'page title/lead/notes');
assert.deepEqual(Object.keys(guide.legend), ['차단', '해제', '피하기', '탱커', '통제'], 'legend tags');
for (const [key, source] of Object.entries(guide.sources)) assert.ok(source.title && /^https:\/\//.test(source.href) && source.note, `source ${key}`);

// 고정 용어: 네임드·쫄·쐐기. 내부 작업 표시는 화면에 싣지 않는다(2026-10-23 지시). 출처에 인벤·닉네임은 쓰지 않는다.
const prose = JSON.stringify({ page: guide.page, dungeons: guide.dungeons.map(d => ({ ...d, spells: undefined })) });
for (const banned of ['우두머리', '졸개', '보스', '로테이션', '오프너', '신화+', '버스트', '임의 번역', '겹침', '인벤', 'inven']) {
  assert.ok(!prose.includes(banned), `forbidden term in mythic+ guide: ${banned}`);
}
{
  const mark = prose.match(/사용자 ?(확인|결정|요청|지정|정정|지시|확정|지적|원칙)|사용자가 (정한|보낸|확인)/);
  assert.ok(!mark, `mythic+ guide shows an internal user-decision mark: ${mark && mark[0]}`);
}
assert.ok(prose.includes('네임드') && prose.includes('쫄'), 'uses 네임드/쫄 wording');

assert.equal(guide.dungeons.length, 8, 'eight dungeons');
assert.equal(new Set(guide.dungeons.map(d => d.id)).size, 8, 'dungeon ids unique');
assert.deepEqual(
  guide.dungeons.map(d => d.id).sort(),
  ['altar-of-fangs', 'den-of-nalorakk', 'kings-rest', 'murder-row', 'ruby-life-pools', 'temple-of-sethraliss', 'the-blinding-vale', 'voidscar-arena'],
  'season 2 dungeon set'
);

let pulls = 0;
let bosses = 0;
let majors = 0;
let steps = 0;
let figures = 0;
let mobCards = 0;
let spellCount = 0;
let clientDescs = 0;
const exists = (...parts) => fs.existsSync(path.join(IMAGES, ...parts));
for (const d of guide.dungeons) {
  const where = d.id;
  for (const field of ['name', 'en', 'abbr', 'overview', 'thumbnail', 'routeFigure']) assert.ok(d[field], `${where}: ${field}`);
  assert.ok(/^#[0-9a-f]{6}$/i.test(d.color), `${where}: color`);
  assert.ok(Number.isInteger(d.timer) && d.timer >= 1500 && d.timer <= 2400, `${where}: timer`);
  assert.ok(Number.isInteger(d.required) && d.required > 0 && d.routeForces >= d.required, `${where}: forces (route must cover the required count)`);
  assert.ok(d.route.runs > 0 && d.route.totalRuns >= d.route.runs && d.route.medianSec > 0 && /^https:\/\/keystone\.guru\//.test(d.route.url), `${where}: route record`);
  assert.ok(exists('thumb', `${d.thumbnail}-960.webp`), `${where}: thumbnail`);
  for (const width of [960, 1600]) assert.ok(exists(d.id, `${d.routeFigure}-${width}.webp`), `${where}: route figure ${width}`);
  assert.ok(d.sources.length >= 1, `${where}: sources`);
  for (const s of d.sources) assert.ok(s.title && /^https:\/\//.test(s.href), `${where}: source ${s.title}`);
  assert.ok(d.sources.some(s => /method\.gg/.test(s.href)), `${where}: Method source (tactics basis)`);

  // 스킬: 이름·아이콘·공식 설명(와우헤드 한국어 또는 게임 클라이언트 문장). 수치가 깨진 2종만 '표시되지 않습니다' 문장이다.
  for (const [id, spell] of Object.entries(d.spells)) {
    assert.ok(/^\d+$/.test(id) && spell.name, `${where}: spell ${id} name`);
    assert.ok(/^[a-z0-9_-]*$/.test(spell.icon), `${where}: spell icon ${spell.name}`);   // 와우헤드 아이콘 이름에는 하이픈도 있다(ring-of-frost)
    assert.ok(['official', 'official-client', 'unresolved'].includes(spell.status), `${where}: spell ${spell.name} status ${spell.status}`);
    // 와우헤드 툴팁에 설명이 없는 스킬(탐식의 광란·기절함 같은 13종)은 설명이 비어 있어도 된다. 임의로 적지 않는다.
    assert.ok(typeof spell.desc === 'string', `${where}: spell ${spell.name} desc`);
    if (spell.status === 'unresolved') assert.ok(spell.desc.includes('표시되지 않습니다'), `${where}: unresolved spell keeps the notice: ${spell.name}`);
    if (spell.status === 'official-client') clientDescs++;
    spellCount++;
  }
  assert.ok(!JSON.stringify(d.spells).includes('spell-ko-draft'), `${where}: unapproved draft translations must not be used`);

  // 몹: 풀링의 몹이 사전에 있고, 표시된 스킬이 사전에 있으며 표시가 범례에 있다.
  for (const [id, mob] of Object.entries(d.mobs)) {
    assert.ok(mob.name && typeof mob.forces === 'number', `${where}: mob ${id}`);
    for (const item of mob.spells) {
      assert.ok(d.spells[String(item.id)], `${where}: mob ${mob.name} spell ${item.id} missing`);
      for (const tag of item.tags) assert.ok(guide.legend[tag], `${where}: mob ${mob.name} tag ${tag}`);
    }
    if (mob.sprite) assert.ok(exists('sprites', `${mob.sprite}.webp`), `${where}: sprite ${mob.sprite}`);
  }

  // 풀링: 1부터 차례로, 누적 병력은 줄지 않고, 지도 그림이 있다. 네임드 풀링은 네임드 id가 있다.
  let cum = 0;
  const seen = new Set();
  d.pulls.forEach((p, index) => {
    assert.equal(p.n, index + 1, `${where}: pull order`);
    assert.ok(p.mobs.length >= 1, `${where}: pull ${p.n} mobs`);
    for (const m of p.mobs) assert.ok(d.mobs[String(m.id)] && m.count >= 1, `${where}: pull ${p.n} mob ${m.id}`);
    assert.ok(p.cum >= cum - 0.01, `${where}: pull ${p.n} cumulative forces`);
    cum = p.cum;
    if (p.boss) assert.ok(p.bossIds.length >= 1 && p.bossIds.every(id => d.mobs[String(id)] && d.mobs[String(id)].boss), `${where}: boss pull ${p.n}`);
    assert.equal(p.figure, `pull-${String(p.n).padStart(2, '0')}`, `${where}: pull figure name`);
    assert.ok(exists(d.id, `${p.figure}-800.webp`), `${where}: missing ${p.figure}-800.webp`);
    for (const id of p.newMobs) {
      assert.ok(d.mobs[String(id)] && !d.mobs[String(id)].boss, `${where}: new mob ${id}`);
      assert.ok(!seen.has(id), `${where}: mob ${id} described twice`);
      seen.add(id);
      mobCards++;
    }
    assert.ok(p.videoSecond == null || Number.isInteger(p.videoSecond), `${where}: pull ${p.n} video second`);
    pulls++;
  });

  // 네임드: 요약·역할별 요령·전투 흐름(단계마다 영상 장면의 도식)·핵심 스킬.
  for (const b of d.bosses) {
    for (const field of ['name', 'en', 'order', 'summary']) assert.ok(b[field], `${where}/${b.id}: ${field}`);
    assert.ok(d.mobs[b.id], `${where}: boss ${b.id} not in mobs`);
    if (b.major) {
      assert.ok(/주요 쫄/.test(b.order), `${where}/${b.id}: major add order label`);
      majors++;
    } else {
      assert.ok(d.mobs[b.id].boss && /네임드$/.test(b.order), `${where}/${b.id}: boss order label`);
      bosses++;
    }
    if (b.sprite) assert.ok(exists('sprites', `${b.sprite}.webp`), `${where}/${b.id}: sprite`);
    assert.ok(b.steps.length >= 3 && b.steps.length <= 6, `${where}/${b.id}: 3~6 steps`);
    b.steps.forEach((s, index) => {
      assert.ok(s.title && s.text, `${where}/${b.id}: step ${index + 1} title/text`);
      if (s.figure) {
        assert.equal(s.figure, `boss-${b.id}-${String(index + 1).padStart(2, '0')}`, `${where}/${b.id}: step figure name`);
        assert.ok(exists(d.id, `${s.figure}-960.webp`), `${where}: missing ${s.figure}-960.webp`);
        figures++;
      }
      steps++;
    });
    assert.ok(b.roles.length >= 1 && b.roles.every(r => ['탱커', '힐러', '딜러'].includes(r.role) && r.text.length >= 1), `${where}/${b.id}: roles`);
    for (const id of b.keySpells) assert.ok(d.spells[String(id)], `${where}/${b.id}: key spell ${id}`);
    assert.ok(b.pull == null || d.pulls.some(p => p.n === b.pull && p.mobs.some(m => String(m.id) === b.id)), `${where}/${b.id}: pull number`);
  }

  // 꼭 끊을 것·지울 것은 몹·스킬이 사전에 있어야 한다.
  for (const item of [...d.kicks, ...d.dispels]) assert.ok(d.mobs[String(item.mob)] && d.spells[String(item.spell)], `${where}: must-kick/dispel ${item.mob}/${item.spell}`);

  // 영상: 번호 칸은 비었거나 유튜브 번호, 장면은 오름차순.
  assert.ok(d.video.youtubeId == null || /^[A-Za-z0-9_-]{11}$/.test(d.video.youtubeId), `${where}: video id`);
  assert.equal(d.video.title, `한밤 2시즌 ${patchLabel} ${d.name} 가이드`, `${where}: video title rule`);
  let last = -1;
  for (const c of d.video.chapters) {
    assert.ok(Number.isInteger(c.second) && c.second >= last && c.label && c.section, `${where}: chapter ${c.label}`);
    last = c.second;
  }
}
// 스토리보드(2026-10-27판): 풀링 143개, 네임드 28곳 + 루비 주요 쫄 4, 동작 도식 144장, 몹 설명 166.
assert.equal(pulls, 143, `143 pulls, got ${pulls}`);
assert.equal(bosses, 28, `28 bosses, got ${bosses}`);
assert.equal(majors, 4, `4 major adds (Ruby Life Pools), got ${majors}`);
assert.equal(figures, 144, `144 fight diagrams, got ${figures}`);
assert.equal(steps, 144, `every step has a diagram, got ${steps}`);
assert.equal(mobCards, 166, `166 mob descriptions (one per first appearance), got ${mobCards}`);
assert.ok(clientDescs >= 20, `official client descriptions for wowhead-english spells, got ${clientDescs}`);

// 화면 연결: 상단 메뉴·라우트·검색 노출·사이트맵·홈 줄.
const nav = fs.readFileSync(path.join(SITE, 'src', 'components', 'Navigation.js'), 'utf8');
assert.ok(nav.includes("{ path: '/mythicplus', label: '쐐기 가이드'"), 'Navigation must have the 쐐기 가이드 tab');
const app = fs.readFileSync(path.join(SITE, 'src', 'App.js'), 'utf8');
assert.ok(app.includes('<Route path="/mythicplus" element={<MythicPlusGuidePage />} />') && app.includes('<Route path="/mythicplus/:dungeonId" element={<MythicPlusGuidePage />} />'), 'App must route /mythicplus and /mythicplus/:dungeonId');
const meta = fs.readFileSync(path.join(SITE, 'src', 'data', 'siteMeta.js'), 'utf8');
assert.ok(meta.includes("'/mythicplus': {") && meta.includes('/^\\/mythicplus\\/([^/]+)$/'), 'siteMeta must describe /mythicplus pages');
const sitemap = fs.readFileSync(path.join(SITE, 'public', 'sitemap.xml'), 'utf8');
for (const d of guide.dungeons) assert.ok(sitemap.includes(`/mythicplus/${d.id}</loc>`), `sitemap: /mythicplus/${d.id}`);
const home = fs.readFileSync(path.join(SITE, 'src', 'pages', 'HomePage.js'), 'utf8');
assert.ok(home.includes('data-shelf="mythicplus"') && home.includes("from '../data/mythicPlusGuide.json'"), 'HomePage must have the 쐐기 가이드 shelf');
const page = fs.readFileSync(path.join(SITE, 'src', 'pages', 'MythicPlusGuidePage.js'), 'utf8');
assert.ok(page.includes("from '../data/mythicPlusGuide.json'") && page.includes('data-wowhead={`spell=${term.id}&domain=ko`}'), 'page must read the generated JSON and render tooltip links');
assert.ok(/youtube\.com\/embed\/\$\{dungeon\.video\.youtubeId\}/.test(page), 'page must embed the dungeon video from video.youtubeId');

console.log(`Mythic+ guide validation passed: ${guide.dungeons.length} dungeons, ${pulls} pulls, ${bosses} bosses + ${majors} major adds, ${steps} steps (${figures} diagrams), ${mobCards} mob cards, ${spellCount} spells (${clientDescs} client descriptions)`);
