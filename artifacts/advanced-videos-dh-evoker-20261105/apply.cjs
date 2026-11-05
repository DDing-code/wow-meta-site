// 공개 확인된 악마사냥꾼·기원사 심화편 6편(v10)을 원고·KB 가이드·원고 검사기에 넣는다(드루이드 advanced-videos-druid-20261105/apply.cjs 와 같은 칸).
// 파멸은 10-29 시범 심화판(bFrBTJqCUuU)이 이미 들어 있어 v10 번호로 바꾼다(2026-11-05 '파멸도 v10으로 새로'). 다른 편은 새로 넣는다.
// 사용: node artifacts/advanced-videos-dh-evoker-20261105/apply.cjs [--check]
// 번호의 정본: ai-hub outputs/pixel-guides/youtube-upload-advanced-v10-dh-evoker-20261105.json (status published, verifiedAt 있는 것만)
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const SITE = path.resolve(__dirname, '..', '..');
const KB = path.resolve(SITE, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base');
const UPLOADS = 'F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/pixel-guides/youtube-upload-advanced-v10-dh-evoker-20261105.json';
const CHANNEL = 'wowmeta 와우메타';
const CHANNEL_ID = 'UCYXt-DyhdhkkRqB-UUJRdKQ';
const KB_DIRS = {
  'demonhunter-havoc': '02-악마사냥꾼/파멸',
  'demonhunter-devourer': '02-악마사냥꾼/포식',
  'demonhunter-vengeance': '02-악마사냥꾼/복수',
  'evoker-devastation': '04-기원사/황폐',
  'evoker-augmentation': '04-기원사/증강',
  'evoker-preservation': '04-기원사/보존',
};
// 바꿔도 되는 예전 심화 번호(파멸 10-29 시범판).
const REPLACE = { 'demonhunter-havoc': 'bFrBTJqCUuU' };
const check = process.argv.includes('--check');

const uploads = JSON.parse(fs.readFileSync(UPLOADS, 'utf8'));
assert.equal(uploads.length, 6);
const rows = uploads.map(item => {
  const id = item.id.replace(/-advanced$/, '');
  assert(KB_DIRS[id], `모르는 가이드: ${item.id}`);
  assert(item.channelId === CHANNEL_ID && item.status === 'published' && item.verifiedAt, `${item.id} 공개 확인 전`);
  assert(/^[A-Za-z0-9_-]{11}$/.test(item.youtubeId) && item.youtubeId !== REPLACE[id]);
  assert(/^한밤 2시즌 12\.1\.5 .+ 심화 가이드$/.test(item.title));
  return { id, youtubeId: item.youtubeId, title: item.title };
});

function insertJs(text, row) {
  if (text.includes('advancedVideo:')) {
    if (text.includes(`youtubeId: '${row.youtubeId}'`)) return text;
    const old = REPLACE[row.id];
    assert(old && text.includes(`youtubeId: '${old}'`), `${row.id} 원고에 다른 심화 번호가 있음`);
    const re = new RegExp(`( *)advancedVideo: \\{\\n\\1  youtubeId: '${old}',\\n\\1  title: '[^']*',\\n\\1  channel: '[^']*',\\n\\1\\},\\n`);
    const m = re.exec(text);
    assert(m, `${row.id} 원고 advancedVideo 칸을 찾지 못함`);
    const pad = m[1];
    return text.replace(m[0], `${pad}advancedVideo: {\n${pad}  youtubeId: '${row.youtubeId}',\n${pad}  title: '${row.title}',\n${pad}  channel: '${CHANNEL}',\n${pad}},\n`);
  }
  const re = /^( *)video: \{\n\1  youtubeId: '([A-Za-z0-9_-]{11})',\n[\s\S]*?\n\1\},\n/m;
  const m = re.exec(text);
  assert(m, `${row.id} 원고 video 칸을 찾지 못함`);
  const pad = m[1];
  const block = `${pad}advancedVideo: {\n${pad}  youtubeId: '${row.youtubeId}',\n${pad}  title: '${row.title}',\n${pad}  channel: '${CHANNEL}',\n${pad}},\n`;
  return text.slice(0, m.index + m[0].length) + block + text.slice(m.index + m[0].length);
}

function insertJson(text, row) {
  if (text.includes('"advancedVideo"')) {
    if (text.includes(`"youtubeId": "${row.youtubeId}"`)) return text;
    const old = REPLACE[row.id];
    assert(old && text.includes(`"youtubeId": "${old}"`), `${row.id} KB에 다른 심화 번호가 있음`);
    const re = new RegExp(`  "advancedVideo": \\{\\n    "youtubeId": "${old}",\\n    "title": "[^"]*",\\n    "channel": "[^"]*"\\n  \\}`);
    const m = re.exec(text);
    assert(m, `${row.id} KB advancedVideo 칸을 찾지 못함`);
    const out = text.replace(m[0], `  "advancedVideo": {\n    "youtubeId": "${row.youtubeId}",\n    "title": "${row.title}",\n    "channel": "${CHANNEL}"\n  }`);
    JSON.parse(out);
    return out;
  }
  const re = /^  "video": \{\n    "youtubeId": "[A-Za-z0-9_-]{11}",\n[\s\S]*?\n  \}(,?)\n/m;
  const m = re.exec(text);
  assert(m, `${row.id} KB video 칸을 찾지 못함`);
  const block = `  "advancedVideo": {\n    "youtubeId": "${row.youtubeId}",\n    "title": "${row.title}",\n    "channel": "${CHANNEL}"\n  }${m[1]}\n`;
  const head = m[0].replace(/\}(,?)\n$/, '},\n');
  const out = text.slice(0, m.index) + head + block + text.slice(m.index + m[0].length);
  JSON.parse(out);
  return out;
}

const changed = [];
for (const row of rows) {
  const js = path.join(SITE, 'src/data/manuscripts', `${row.id}.js`);
  const kb = path.join(KB, KB_DIRS[row.id], 'Meta/guide-12.1.json');
  for (const [file, fn] of [[js, insertJs], [kb, insertJson]]) {
    const before = fs.readFileSync(file, 'utf8');
    const after = fn(before, row);
    if (after !== before) { changed.push(file); if (!check) fs.writeFileSync(file, after); }
  }
  const kbVideo = JSON.parse(fs.readFileSync(kb, 'utf8')).advancedVideo;
  if (!check) assert.deepEqual(kbVideo, { youtubeId: row.youtubeId, title: row.title, channel: CHANNEL });
}

// 원고 검사기의 심화 영상 목록에 번호를 고정한다(파멸은 v10 번호로 바꾼다).
const validator = path.join(SITE, 'scripts/validate-guide-manuscripts.js');
let v = fs.readFileSync(validator, 'utf8');
const mapRe = /const GUIDE_ADVANCED_VIDEOS = new Map\(\[\n([\s\S]*?)\n  \]\);/;
const mm = mapRe.exec(v);
assert(mm, '검사기 심화 목록을 찾지 못함');
const entries = new Map([...mm[1].matchAll(/\['([a-z-]+)', '([A-Za-z0-9_-]{11})'\]/g)].map(x => [x[1], x[2]]));
const havoc = rows.find(r => r.id === 'demonhunter-havoc');
assert(['bFrBTJqCUuU', havoc.youtubeId].includes(entries.get('demonhunter-havoc')));
assert.equal(entries.get('warrior-arms'), 'KgLPXpTh6BU');
assert.equal(entries.get('mage-frost'), 'UjzEaZSte6Y');
assert.equal(entries.get('warlock-destruction'), 'i7K6WcRyZzY');
assert.equal(entries.get('monk-brewmaster'), '-w-k0VAN7lQ');
assert.equal(entries.get('druid-balance'), 'XaHnh_xfCOo');
for (const row of rows) entries.set(row.id, row.youtubeId);
const list = [...entries].sort(([a], [b]) => a.localeCompare(b)).map(([k, id]) => `    ['${k}', '${id}'],`).join('\n');
const nv = v.replace(mapRe, `const GUIDE_ADVANCED_VIDEOS = new Map([\n${list}\n  ]);`);
if (nv !== v) { changed.push(validator); if (!check) fs.writeFileSync(validator, nv); }

console.log(JSON.stringify({ mode: check ? 'check' : 'apply', guides: rows.map(r => `${r.id} ${r.youtubeId}`), changed: changed.length }, null, 2));
if (check && changed.length) process.exit(1);
