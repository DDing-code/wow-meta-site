// 개념서형(book) 리빌딩 공용 도구.
// 전문화마다 artifacts/book-rebuild/<가이드 ID>/content.cjs 에 새 원고를 두고,
// 이 파일의 함수로 KB 정본(guide-12.1.json)과 그 전문화의 원고 파일(src/data/manuscripts/<가이드 ID>.js)을 같은 객체로 갱신한다.
// (원고는 전문화마다 파일 하나다. src/data/guideManuscripts.js 는 그 파일들을 모으기만 하므로 고치지 않는다.)
const fs = require('fs');
const path = require('path');
const { fixDeep } = require('../mm-concept-sample/terms.cjs');
const { MANUSCRIPT_DIR, listGuideManuscriptFiles, guideManuscriptPath } = require('../../scripts/lib/guideManuscripts.cjs');

const SITE = path.resolve(__dirname, '..', '..');
const KB_ROOT = path.join(SITE, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base');
const REGISTRY = path.join(SITE, 'src', 'data', 'guideRegistry.js');

// 그 전문화의 원고 파일 경로(guideManuscripts.js 목록에 없는 ID면 오류).
function manuscriptFile(id) {
  const file = guideManuscriptPath(id);
  if (!fs.existsSync(file)) throw new Error(`${id}: 원고 파일이 없음 ${file}`);
  return file;
}

// 모든 전문화 원고 파일의 글자를 목록 순서대로 이어 붙인다(검사 스크립트가 전체에서 문구를 찾을 때 보는 글자).
// id 와 swap 을 주면 그 전문화 파일의 글자만 swap(글자) 결과로 바꿔서 붙인다. 실제 파일은 바꾸지 않는다.
function allManuscriptText(id, swap) {
  const target = id ? manuscriptFile(id) : null;
  return listGuideManuscriptFiles().map(item => {
    const text = fs.readFileSync(item.filePath, 'utf8');
    return item.filePath === target ? swap(text) : text;
  }).join('\n');
}

function loadRegistry() {
  const src = fs.readFileSync(REGISTRY, 'utf8')
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function')
    .replace(/export default [^;]+;/g, '');
  return new Function(`${src}\nreturn getAllGuideSpecs();`)();
}

function kbGuidePath(id) {
  const spec = loadRegistry().find(item => item.id === id);
  if (!spec) throw new Error(`${id}: 등록된 가이드가 아님`);
  const cls = fs.readdirSync(KB_ROOT).find(dir => dir.replace(/^\d+-/, '') === spec.className.replace(/ /g, ''));
  if (!cls) throw new Error(`${id}: KB 직업 폴더를 찾지 못함`);
  const file = path.join(KB_ROOT, cls, spec.spec, 'Meta', 'guide-12.1.json');
  if (!fs.existsSync(file)) throw new Error(`${id}: KB 정본이 없음 ${file}`);
  return { spec, file };
}

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const q = s => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
function lit(v, ind) {
  const pad = ' '.repeat(ind);
  const inner = ' '.repeat(ind + 2);
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '[\n' + v.map(x => inner + lit(x, ind + 2) + ',').join('\n') + '\n' + pad + ']';
  }
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    if (!keys.length) return '{}';
    return '{\n' + keys.map(k => `${inner}${IDENT.test(k) ? k : q(k)}: ${lit(v[k], ind + 2)},`).join('\n') + '\n' + pad + '}';
  }
  if (typeof v === 'string') return q(v);
  return JSON.stringify(v);
}

function blockEnd(text, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === '`') {
      for (i++; i < text.length && text[i] !== c; i++) if (text[i] === '\\') i++;
      continue;
    }
    if (c === '/' && text[i + 1] === '/') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') { depth--; if (depth === 0) return i; }
  }
  throw new Error('unbalanced block');
}

// 전문화 원고 파일 하나의 글자(src)에서 원고 객체("const manuscript = { … };")를 새 객체로 바꾼 글자를 돌려준다.
// 그 파일이 쓰던 들여쓰기는 그대로 둔다(한 파일이던 때 객체 안에 있던 전문화는 본문이 4칸, 뒤쪽 재할당이던 전문화는 2칸).
// 검사 스크립트 일부가 '    opener: {' 처럼 들여쓰기로 구간을 찾기 때문이다.
function replaceManuscript(src, id, next) {
  const hit = src.match(/^const manuscript = \{/m);
  if (!hit) throw new Error(`${id}: 원고 정의를 찾지 못함`);
  if (src.indexOf('\nconst manuscript = {', hit.index + 1) !== -1) throw new Error(`${id}: 정의가 두 곳에 있어 중단`);
  const open = hit.index + hit[0].length - 1;
  const end = blockEnd(src, open);
  const indent = (src.slice(open, end).match(/\n( +)\S/) || [null, '  '])[1].length;
  const body = lit(next, indent - 2);
  // 닫는 중괄호는 맨 앞 칸에 둔다(파일 맨 바깥 객체이므로).
  const literal = body.includes('\n') ? `${body.slice(0, body.lastIndexOf('\n') + 1)}}` : body;
  return src.slice(0, open) + literal + src.slice(end + 1);
}

const KEY_ORDER = ['patch', 'researchedAt', 'status', 'graphCenterSkillId', 'summary', 'sourceStatus', 'sourceNote', 'playstyle', 'sources', 'evidence', 'caveats', 'blocks', 'book', 'heroBranches', 'tips', 'priority', 'opener', 'talentBuilds', 'logReview'];

// content.cjs 형식
// {
//   researchedAt?, summary?, playstyle?, tips?,
//   book: { title, intro, start?, parts, labels?, voicesIntro?, voices?, appendix? },
//   blocks: [...장],
//   evidenceNote: '개념서형 개편(날짜): …',  // 참고한 자료에 한 줄 추가(같은 머리말이면 교체)
//   caveats?: [...추가할 주의 사항], extraSources?: [...추가 출처]
//   transform?(next, original)  // 특수한 후처리가 필요할 때만
// }
function buildNext(original, content) {
  const next = { ...original };
  if (content.researchedAt) next.researchedAt = content.researchedAt;
  if (content.summary) next.summary = content.summary;
  if (content.playstyle) next.playstyle = content.playstyle;
  if (content.tips) next.tips = content.tips;
  if (content.sourceStatus) next.sourceStatus = content.sourceStatus;
  next.blocks = content.blocks;
  next.book = content.book;
  if (content.evidenceNote) {
    next.evidence = [
      ...(original.evidence || []).filter(item => !item.startsWith('개념서형 개편')),
      content.evidenceNote,
    ];
  }
  if (content.caveats?.length) {
    next.caveats = [...(original.caveats || []).filter(item => !content.caveats.includes(item)), ...content.caveats];
  }
  if (content.extraSources?.length) {
    const urls = new Set(content.extraSources.map(source => source.url));
    next.sources = [...(original.sources || []).filter(source => !urls.has(source.url)), ...content.extraSources];
  }
  const shaped = typeof content.transform === 'function' ? content.transform(next, original) : next;
  const ordered = {};
  for (const key of KEY_ORDER) if (key in shaped) ordered[key] = shaped[key];
  for (const key of Object.keys(shaped)) if (!(key in ordered)) ordered[key] = shaped[key];
  return fixDeep(ordered);
}

function loadContent(id) {
  const file = path.join(__dirname, id, 'content.cjs');
  if (!fs.existsSync(file)) throw new Error(`${id}: ${file} 이 없음`);
  delete require.cache[require.resolve(file)];
  return require(file);
}

module.exports = { SITE, KB_ROOT, MANUSCRIPT_DIR, manuscriptFile, allManuscriptText, loadRegistry, kbGuidePath, lit, replaceManuscript, buildNext, loadContent };
