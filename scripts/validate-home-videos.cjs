#!/usr/bin/env node
// 홈 화면 재생목록 줄(src/data/youtubePlaylists.js)과 로그 분석 숨김을 검사한다(npm run validate:home).
// - 재생목록 4개(탱커·힐러·근딜·원딜)가 40개 가이드를 한 번씩, 역할에 맞게 담는지
// - 가이드 원고의 상단 영상 번호와 같은지, ai-hub의 공개 기록(youtube-playlists.json)이 있으면 그것과 같은지
// - 레이드 편 썸네일 그림이 있는지
// - 로그 분석이 상단 메뉴·가이드 페이지에 다시 붙지 않았는지(주소로만 연다)
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
function load(file, names) {
  const source = read(path.join('src/data', file))
    .replace(/^import .*$/gm, '')
    .replace(/\bexport (const|function)\b/g, '$1');
  return new Function(`${source}\nreturn {${names}};`)();
}

const { youtubePlaylists } = load('youtubePlaylists.js', 'youtubePlaylists');
const { getAllGuideSpecs } = load('guideRegistry.js', 'getAllGuideSpecs');
const manuscripts = require('./lib/guideManuscripts.cjs').loadGuideManuscripts();
const specs = getAllGuideSpecs();
const specById = new Map(specs.map(spec => [spec.id, spec]));

assert.deepEqual(youtubePlaylists.map(list => list.role), ['tanks', 'healers', 'melee', 'ranged'], 'Playlists must follow tank → healer → melee → ranged');
const seenGuides = new Set();
const seenVideos = new Set();
for (const list of youtubePlaylists) {
  assert.match(list.playlistId, /^PL[A-Za-z0-9_-]{10,40}$/, `${list.role} playlist id`);
  assert.match(list.title, new RegExp(`^한밤 2시즌 [0-9.]+ ${list.label} 가이드$`), `${list.role} playlist title`);
  for (const [guideId, youtubeId] of list.items) {
    const spec = specById.get(guideId);
    assert.ok(spec, `${guideId} is not a registered guide`);
    assert.equal(spec.role, list.role, `${guideId} belongs to the ${spec.role} playlist`);
    assert.match(youtubeId, /^[A-Za-z0-9_-]{11}$/, `${guideId} video id`);
    assert.ok(!seenGuides.has(guideId), `${guideId} appears twice`);
    assert.ok(!seenVideos.has(youtubeId), `${youtubeId} appears twice`);
    seenGuides.add(guideId);
    seenVideos.add(youtubeId);
    const manuscriptVideo = manuscripts[guideId]?.video?.youtubeId;
    if (manuscriptVideo) assert.equal(manuscriptVideo, youtubeId, `${guideId} home video must match its guide video`);
  }
}
assert.equal(seenGuides.size, specs.length, 'Every guide needs exactly one home video');

// 공개 기록은 이 PC의 ai-hub 작업 폴더에만 있다. 없으면 건너뛴다.
const published = [path.resolve(root, '..', '..', 'ai-hub', 'workspace', 'outputs', 'pixel-guides', 'youtube-playlists.json')]
  .find(file => fs.existsSync(file));
if (published) {
  const lists = JSON.parse(fs.readFileSync(published, 'utf8'));
  assert.deepEqual(
    youtubePlaylists.map(list => [list.title, list.playlistId, list.items]),
    lists.map(list => [list.title, list.playlistId, list.items.map(item => [item.id, item.youtubeId])]),
    'Home playlists must match the published youtube-playlists.json'
  );
}

const raidGuide = JSON.parse(read('src/data/raidGuide.json'));
for (const episode of raidGuide.episodes) {
  const plan = JSON.stringify(episode).match(/"plan":"([\w-]+)"/)?.[1];
  assert.ok(plan && fs.existsSync(path.join(root, 'public/images/raid/plan', `${plan}-960.webp`)), `${episode.id} needs a raid thumbnail`);
}

const nav = read('src/components/Navigation.js');
assert.ok(!/path: '\/logs'/.test(nav) && !nav.includes("'로그 분석'"), 'Log analysis must stay out of the top navigation');
const guidePage = read('src/pages/GuideDetailPage.js');
assert.ok(!guidePage.includes('/logs/') && !guidePage.includes('logReportRegistry'), 'Guide pages must not link log analysis');
const app = read('src/App.js');
assert.ok(app.includes('path="/logs"') && app.includes('path="/logs/:guideId"'), 'Log analysis must stay reachable by direct link');

console.log(`home videos: ${youtubePlaylists.length} playlists, ${seenVideos.size} videos${published ? ' (matches published record)' : ''}; log analysis hidden from menus`);
