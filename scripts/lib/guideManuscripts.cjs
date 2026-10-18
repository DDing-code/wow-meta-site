// 전문화별 가이드 원고를 읽는 공용 도구.
// 원고는 전문화마다 파일 하나(src/data/manuscripts/<가이드 ID>.js)이고,
// src/data/guideManuscripts.js 는 그 파일들을 순서대로 모으기만 한다.
// 검사 스크립트는 guideManuscripts.js 를 글자로 읽지 말고 여기 함수를 쓴다.
const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..', '..');
const MANUSCRIPT_INDEX_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const MANUSCRIPT_DIR = path.join(SITE_ROOT, 'src', 'data', 'manuscripts');

// guideManuscripts.js 에 적힌 순서대로 [{ id, filePath }] 를 돌려준다.
// dir 을 주면 같은 이름의 파일을 그 폴더에서 찾는다(실제 파일을 바꾸지 않는 미리보기 검사용).
function listGuideManuscriptFiles(dir = MANUSCRIPT_DIR) {
  const index = fs.readFileSync(MANUSCRIPT_INDEX_PATH, 'utf8');
  const imports = new Map();
  for (const match of index.matchAll(/^import\s+([A-Za-z_$][\w$]*)\s+from\s+'\.\/manuscripts\/([^'/]+)\.js';\s*$/gm)) {
    imports.set(match[1], match[2]);
  }

  const list = index.match(/^export const guideManuscripts = \{\r?\n([\s\S]*?)\r?\n\};/m);
  if (!list) throw new Error('guideManuscripts.js: "export const guideManuscripts = { … };" 목록을 찾지 못함');

  const entries = [];
  for (const line of list[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('//')) continue;
    const match = line.match(/^\s*'([^']+)':\s*([A-Za-z_$][\w$]*),\s*$/);
    if (!match) throw new Error(`guideManuscripts.js: 목록에는 "'<가이드 ID>': <import 이름>," 줄만 둔다 — ${line.trim()}`);
    const [, id, name] = match;
    if (imports.get(name) !== id) throw new Error(`guideManuscripts.js: '${id}' 는 ./manuscripts/${id}.js 를 import 한 이름을 가리켜야 함`);
    if (entries.some(entry => entry.id === id)) throw new Error(`guideManuscripts.js: '${id}' 가 목록에 두 번 있음`);
    entries.push({ id, filePath: path.join(dir, `${id}.js`) });
  }
  if (!entries.length) throw new Error('guideManuscripts.js: 원고 목록이 비어 있음');
  return entries;
}

function guideManuscriptPath(id, dir = MANUSCRIPT_DIR) {
  const entry = listGuideManuscriptFiles(dir).find(item => item.id === id);
  if (!entry) throw new Error(`${id}: guideManuscripts.js 목록에 없는 가이드`);
  return entry.filePath;
}

// 한 전문화 원고 파일의 글자.
function readGuideManuscriptText(id, dir = MANUSCRIPT_DIR) {
  return fs.readFileSync(guideManuscriptPath(id, dir), 'utf8');
}

// 모든 전문화 원고 파일의 글자를 목록 순서대로 이어 붙인 것(전체에서 문구를 찾는 검사용).
function readAllGuideManuscriptText(dir = MANUSCRIPT_DIR) {
  return listGuideManuscriptFiles(dir).map(entry => fs.readFileSync(entry.filePath, 'utf8')).join('\n');
}

function evaluateGuideManuscript(source, label) {
  if (!/^const manuscript = \{/m.test(source) || !/^export default manuscript;/m.test(source)) {
    throw new Error(`${label}: "const manuscript = { … };" 과 "export default manuscript;" 형식이어야 함`);
  }
  return new Function(`${source.replace(/^export default manuscript;.*$/m, '')}\nreturn manuscript;`)();
}

// 한 전문화의 원고 객체.
function loadGuideManuscript(id, dir = MANUSCRIPT_DIR) {
  const filePath = guideManuscriptPath(id, dir);
  return evaluateGuideManuscript(fs.readFileSync(filePath, 'utf8'), path.relative(SITE_ROOT, filePath));
}

// src/data/guideManuscripts.js 가 내보내는 것과 같은 { '<가이드 ID>': 원고 } 객체(같은 순서).
function loadGuideManuscripts(dir = MANUSCRIPT_DIR) {
  const manuscripts = {};
  for (const entry of listGuideManuscriptFiles(dir)) {
    manuscripts[entry.id] = evaluateGuideManuscript(fs.readFileSync(entry.filePath, 'utf8'), path.relative(SITE_ROOT, entry.filePath));
  }
  return manuscripts;
}

module.exports = {
  MANUSCRIPT_INDEX_PATH,
  MANUSCRIPT_DIR,
  listGuideManuscriptFiles,
  guideManuscriptPath,
  readGuideManuscriptText,
  readAllGuideManuscriptText,
  loadGuideManuscript,
  loadGuideManuscripts,
};
