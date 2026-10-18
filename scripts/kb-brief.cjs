#!/usr/bin/env node
// 전문화 KB 한 번에 보기.
// 한 전문화의 스킬·특성·영웅 특성을 한 번의 출력으로 보여 준다(이름·Spell ID·종류·재사용 대기시간/자원·툴팁 설명).
// 자료는 생성 JSON(src/data/kb-skills.json)에서 읽는다. KB 노트를 다시 훑지 않는다.
//
// 사용: node scripts/kb-brief.cjs <가이드 ID 또는 직업·전문화> [--full] [--no-class] [--find <낱말…>] [--id <Spell ID…>]
//   node scripts/kb-brief.cjs hunter-marksmanship            짧게(설명은 앞부분만)
//   node scripts/kb-brief.cjs 사냥꾼 사격 --full              설명 전체
//   node scripts/kb-brief.cjs hunter-marksmanship --find 집중  이름·설명에 그 낱말이 든 것만
//   node scripts/kb-brief.cjs --id 19434 257044               그 스킬만 전체(전문화를 안 줘도 됨)
//   --no-class  직업 공통(공용) 스킬·특성을 뺀다(영웅 특성은 남긴다)
const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(SITE_ROOT, '..');
const SKILLS_PATH = path.join(SITE_ROOT, 'src', 'data', 'kb-skills.json');
const REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const GUIDE_DETAIL_PATH = path.join(SITE_ROOT, 'src', 'pages', 'GuideDetailPage.js');
const COMMON_SPECS = new Set(['공용', 'Common']);
const SHORT_LIMIT = 120;
const FIND_FULL_LIMIT = 30;

const TYPE_LABELS = {
  'atomic-skill': '스킬', skill: '스킬',
  talent: '특성', 'spec-talent': '전문화 특성', 'class-talent': '직업 특성', 'atomic-talent': '특성',
  'apex-talent': '정점 특성', 'removed-talent': '삭제된 특성',
  'hero-talent': '영웅 특성', 'hero-tree': '영웅 특성 트리',
  passive: '지속 효과',
  buff: '버프', 'atomic-buff': '버프', debuff: '약화 효과', proc: '발동 효과',
  'set-bonus': '세트 효과', 'tier-set': '세트 효과',
};
const SECTIONS = [
  { title: '스킬', types: ['atomic-skill', 'skill'] },
  { title: '특성', types: ['talent', 'spec-talent', 'class-talent', 'atomic-talent', 'apex-talent', 'removed-talent'] },
  { title: '지속 효과', types: ['passive'] },
  { title: '버프·약화·발동 효과', types: ['buff', 'atomic-buff', 'debuff', 'proc'] },
  { title: '세트 효과', types: ['set-bonus', 'tier-set'] },
];
// 묶음 제목만으로 알 수 없는 종류만 이름 뒤에 붙인다.
const INLINE_TAGS = { 'apex-talent': '정점 특성', 'removed-talent': '삭제됨', debuff: '약화', proc: '발동' };

function fail(message) {
  console.error(message);
  process.exit(2);
}

function parseArgs(argv) {
  const options = { query: [], full: false, noClass: false, find: [], ids: [], help: false };
  let bucket = options.query;
  for (const arg of argv) {
    if (arg === '--full') { options.full = true; bucket = options.query; }
    else if (arg === '--no-class') { options.noClass = true; bucket = options.query; }
    else if (arg === '--find') bucket = options.find;
    else if (arg === '--id') bucket = options.ids;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('--')) fail(`모르는 옵션: ${arg} (쓸 수 있는 것: --full --no-class --find <낱말…> --id <Spell ID…>)`);
    else bucket.push(arg);
  }
  return options;
}

// 가이드 ID ↔ KB 직업/전문화 대응표는 사이트가 쓰는 guideRegistry.js 를 그대로 읽는다.
function loadRegistry() {
  const source = fs.readFileSync(REGISTRY_PATH, 'utf8')
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function')
    .replace(/export default [^;]+;/g, '');
  return new Function(`${source}\nreturn { guides: getAllGuideSpecs(), patch: CURRENT_PATCH_LABEL, dataPatches: CURRENT_DATA_PATCHES };`)();
}

// "이 스킬이 이 가이드 범위인가"는 화면(GuideDetailPage.js 의 recordMatchesGuide)과 같은 규칙을 쓴다.
// 화면 파일에서 그 함수를 읽어 오고, 읽지 못하면(고치는 중 등) 아래 사본을 쓴다.
function loadScopeRule() {
  const fallback = (record, guide, includeCommon, commonSpecs) => {
    if (!record || record.class !== guide.kbClass) return false;
    const listedSpecs = Array.isArray(record.specs) ? record.specs.map(spec => String(spec)) : [];
    const hasSpecificSpecScope = listedSpecs.length > 0 && !listedSpecs.some(spec => commonSpecs.has(spec));
    if (hasSpecificSpecScope && !listedSpecs.some(spec => guide.kbSpecAliases.includes(spec))) return false;
    if (listedSpecs.some(spec => guide.kbSpecAliases.includes(spec))) return true;
    if (includeCommon && commonSpecs.has(record.spec)) return true;
    return guide.kbSpecAliases.includes(record.spec);
  };
  try {
    const source = fs.readFileSync(GUIDE_DETAIL_PATH, 'utf8');
    const start = source.indexOf('function recordMatchesGuide(');
    const open = source.indexOf('{', source.indexOf(')', start));
    if (start === -1 || open === -1) return fallback;
    let depth = 0;
    for (let index = open; index < source.length; index++) {
      if (source[index] === '{') depth++;
      else if (source[index] === '}' && --depth === 0) {
        const rule = new Function('record', 'guide', 'includeCommon', 'commonSpecs', source.slice(open + 1, index));
        rule({ class: '', specs: [] }, { kbClass: 'x', kbSpecAliases: [] }, true, COMMON_SPECS);
        return rule;
      }
    }
  } catch (error) { /* 아래 사본을 쓴다 */ }
  return fallback;
}

const normalize = value => String(value).toLowerCase().replace(/[\s\-_.·/\\]+/g, '');

function resolveGuide(words, guides) {
  const query = normalize(words.join(' '));
  const keysOf = guide => {
    const classNames = [guide.classKey, guide.className, guide.kbClass];
    const specNames = [guide.spec, guide.kbSpec, ...guide.kbSpecAliases, guide.path.split('/').pop()];
    const full = new Set([guide.id, guide.path.replace('/guide/', '')].map(normalize));
    for (const className of classNames) for (const specName of specNames) {
      full.add(normalize(`${className}${specName}`));
      full.add(normalize(`${specName}${className}`));
    }
    return { full, short: new Set(specNames.map(normalize)) };
  };
  const keyed = guides.map(guide => ({ guide, ...keysOf(guide) }));
  let hits = keyed.filter(item => item.full.has(query));
  if (!hits.length) hits = keyed.filter(item => item.short.has(query));
  if (hits.length === 1) return hits[0].guide;
  const list = items => items.map(guide => `  ${guide.id}  (${guide.className} ${guide.spec})`).join('\n');
  if (hits.length > 1) fail(`"${words.join(' ')}" 에 맞는 전문화가 여러 개다. 가이드 ID나 "직업 전문화"로 다시 준다:\n${list(hits.map(item => item.guide))}`);
  return fail(`"${words.join(' ')}" 에 맞는 전문화가 없다. 가이드 ID 목록:\n${list(guides)}`);
}

const clean = value => String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
const hasValue = value => Boolean(clean(value)) && !['없음', '지속 효과', '관련 기술 연계', '-'].includes(clean(value));

function metaParts(skill, withRange) {
  const parts = [];
  if (hasValue(skill.cooldown)) parts.push(`재사용 ${clean(skill.cooldown)}`);
  if (/\d|정신 집중/.test(clean(skill.castTime))) parts.push(`시전 ${clean(skill.castTime)}`);
  if (hasValue(skill.resourceCost)) parts.push(`자원 ${clean(skill.resourceCost)}`);
  if (withRange && hasValue(skill.range)) parts.push(`사거리 ${clean(skill.range)}`);
  return parts;
}

function line(skill, full) {
  const description = clean(skill.description);
  const shown = full || description.length <= SHORT_LIMIT ? description : `${description.slice(0, SHORT_LIMIT)}…`;
  const tag = INLINE_TAGS[skill.type] ? ` [${INLINE_TAGS[skill.type]}]` : '';
  const meta = metaParts(skill, full);
  return `- ${clean(skill.name)} (${skill.id})${tag}${meta.length ? ` · ${meta.join(' · ')}` : ''} — ${shown || '(설명 없음)'}`;
}

const notePath = skill => (skill.source && skill.source.kbPath ? path.join(PROJECT_ROOT, skill.source.kbPath) : '');
const byName = (a, b) => clean(a.name).localeCompare(clean(b.name), 'ko');

function detail(skill) {
  const lines = [`${clean(skill.name)} (${skill.id})${skill.englishName ? ` · ${clean(skill.englishName)}` : ''}`];
  lines.push(`  종류: ${TYPE_LABELS[skill.type] || skill.type} (${skill.type}) · ${skill.class} ${skill.spec}${(skill.specs || []).length ? ` [${skill.specs.join(', ')}]` : ''} · 패치 ${skill.patch}`);
  const meta = metaParts(skill, true);
  if (meta.length) lines.push(`  ${meta.join(' · ')}`);
  if (notePath(skill)) lines.push(`  노트: ${notePath(skill)}`);
  lines.push(`  설명: ${clean(skill.description) || '(설명 없음)'}`);
  return lines.join('\n');
}

// 생성 JSON 을 만든 뒤에 고친 KB 노트가 있는지(파일 시각만 본다. 노트를 읽지 않는다).
function changedSinceGenerated(skills, generatedAt, knownPaths) {
  const generated = Date.parse(generatedAt);
  if (!Number.isFinite(generated)) return null;
  const changed = [];
  const folders = new Set();
  let checked = 0;
  for (const skill of skills) {
    const file = notePath(skill);
    if (!file) continue;
    folders.add(path.dirname(file));
    try {
      checked++;
      if (fs.statSync(file).mtimeMs > generated + 2000) changed.push(clean(skill.name));
    } catch (error) { changed.push(`${clean(skill.name)}(노트 파일 없음)`); }
  }
  if (!checked) return null;
  for (const folder of folders) {
    let names = [];
    try { names = fs.readdirSync(folder); } catch (error) { continue; }
    for (const name of names) {
      const file = path.join(folder, name);
      if (!name.endsWith('.md') || knownPaths.has(file.toLowerCase())) continue;
      try { if (fs.statSync(file).mtimeMs > generated + 2000) changed.push(`${name.replace(/\.md$/, '')}(JSON 에 없는 새 노트)`); } catch (error) { /* 건너뜀 */ }
    }
  }
  return changed;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help || (!options.query.length && !options.ids.length)) {
    const lines = fs.readFileSync(__filename, 'utf8').split(/\r?\n/).slice(1);
    console.log(lines.slice(0, lines.findIndex(text => !text.startsWith('//'))).map(text => text.replace(/^\/\/ ?/, '')).join('\n'));
    process.exit(options.help ? 0 : 2);
  }

  const data = JSON.parse(fs.readFileSync(SKILLS_PATH, 'utf8'));
  const everything = Object.values(data.skills || {});
  const generatedAt = (data.metadata || {}).generatedAt || '';
  const generatedLocal = generatedAt ? new Date(generatedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false }) : '알 수 없음';
  const staleNote = `자료: src/data/kb-skills.json (생성 ${generatedLocal}). KB 노트를 그 뒤에 고쳤으면 낡은 내용일 수 있다 — npm run sync-kb 한 번 뒤에 다시 본다.`;

  // --id: 그 스킬만 전체로(전문화를 안 줘도 된다).
  if (options.ids.length) {
    console.log(staleNote);
    for (const id of options.ids) {
      const found = everything.filter(skill => String(skill.id) === String(id));
      console.log('');
      console.log(found.length ? found.map(detail).join('\n') : `${id}: kb-skills.json 에 없는 ID`);
    }
    return;
  }

  const { guides, patch, dataPatches } = loadRegistry();
  const guide = resolveGuide(options.query, guides);
  const matches = loadScopeRule();
  const inScope = skill => matches(skill, guide, false, COMMON_SPECS) || (COMMON_SPECS.has(skill.spec) && matches(skill, guide, true, COMMON_SPECS));
  const scoped = everything.filter(inScope);
  // 화면과 같은 기준: Spell ID 가 숫자이고 지금 패치로 표시된 것만.
  const current = scoped.filter(skill => /^\d+$/.test(String(skill.id)) && dataPatches.includes(skill.patch));
  const dropped = scoped.filter(skill => !current.includes(skill));

  const isHero = skill => skill.type === 'hero-talent' || skill.type === 'hero-tree';
  const groups = {
    spec: current.filter(skill => !isHero(skill) && !COMMON_SPECS.has(skill.spec)),
    hero: current.filter(isHero),
    common: options.noClass ? [] : current.filter(skill => !isHero(skill) && COMMON_SPECS.has(skill.spec)),
  };
  const commonHidden = options.noClass ? current.filter(skill => !isHero(skill) && COMMON_SPECS.has(skill.spec)).length : 0;

  const terms = options.find.map(term => term.toLowerCase());
  const wanted = skill => !terms.length || terms.some(term => `${skill.name} ${skill.englishName} ${skill.description}`.toLowerCase().includes(term));
  for (const key of Object.keys(groups)) groups[key] = groups[key].filter(wanted).sort(byName);
  const total = groups.spec.length + groups.hero.length + groups.common.length;
  const full = options.full || (terms.length > 0 && total <= FIND_FULL_LIMIT);

  const out = [];
  out.push(`# ${guide.id} · ${guide.className} ${guide.spec} — KB 스킬·특성 요약 (패치 ${patch})`);
  const changed = changedSinceGenerated(current, generatedAt, new Set(everything.map(skill => notePath(skill).toLowerCase())));
  const changedText = changed === null ? '' : changed.length
    ? ` 생성 뒤에 바뀐 노트 ${changed.length}개: ${changed.slice(0, 8).join(', ')}${changed.length > 8 ? ' …' : ''}`
    : ' 생성 뒤에 바뀐 노트: 없음(지금 내용 그대로).';
  out.push(`${staleNote}${changedText}`);
  const folders = [...new Set(current.map(skill => path.dirname(path.dirname(notePath(skill)))).filter(folder => folder !== '.'))];
  const parents = [...new Set(folders.map(folder => path.dirname(folder)))];
  if (parents.length === 1) out.push(`KB 노트 폴더: ${parents[0]}${path.sep} 아래 ${folders.map(folder => path.basename(folder)).join(', ')} (노트는 고치거나 새로 쓸 때만 연다)`);
  else if (folders.length) out.push(`KB 노트 폴더: ${folders.join(' , ')} (노트는 고치거나 새로 쓸 때만 연다)`);
  const how = full ? '설명 전체' : `설명은 ${SHORT_LIMIT}자에서 자름(--full 전체, --id <Spell ID…> 하나만 전체)`;
  out.push(`${terms.length ? `찾는 낱말 "${options.find.join('", "')}": ` : ''}전문화 ${groups.spec.length}개 · 영웅 특성 ${groups.hero.length}개 · 공용 ${options.noClass ? `뺌(${commonHidden}개)` : `${groups.common.length}개`} · ${how}`);
  if (dropped.length) out.push(`패치 표기가 현재 데이터(${dataPatches.join('·')})가 아니거나 ID 가 숫자가 아니라서 뺀 것 ${dropped.length}개: ${dropped.map(skill => `${clean(skill.name)}(${skill.id}, ${skill.patch})`).join(', ')}`);

  const section = (title, skills) => {
    if (!skills.length) return;
    out.push('', `## ${title} (${skills.length})`);
    const used = new Set();
    for (const { title: sub, types } of SECTIONS) {
      const rows = skills.filter(skill => types.includes(skill.type));
      rows.forEach(skill => used.add(skill));
      if (rows.length) out.push(`### ${sub} (${rows.length})`, ...rows.map(skill => line(skill, full)));
    }
    const rest = skills.filter(skill => !used.has(skill));
    if (rest.length) out.push(`### 기타 (${rest.length})`, ...rest.map(skill => `${line(skill, full)} [${skill.type}]`));
  };

  section(`전문화: ${guide.spec}`, groups.spec);

  // 영웅 특성은 "어느 전문화들이 함께 쓰는 트리인가"로 묶고, 가이드 원고의 영웅 분기 이름을 찾을 수 있으면 붙인다.
  if (groups.hero.length) {
    const specName = name => (guides.find(item => item.kbClass === guide.kbClass && item.kbSpecAliases.includes(name)) || { spec: name }).spec;
    let branches = [];
    try { branches = require('./lib/guideManuscripts.cjs').loadGuideManuscript(guide.id).heroBranches || []; } catch (error) { /* 이름 없이 묶는다 */ }
    const trees = new Map();
    for (const skill of groups.hero) {
      const key = (skill.specs || []).slice().sort().join('|') || skill.spec;
      if (!trees.has(key)) trees.set(key, []);
      trees.get(key).push(skill);
    }
    out.push('', `## 영웅 특성 (${groups.hero.length}) — 괄호 안은 KB 에 적힌 사용 전문화, 트리 이름은 가이드 원고의 영웅 분기에서 찾은 것`);
    for (const [key, rows] of trees) {
      const ids = new Set(rows.map(skill => String(skill.id)));
      const named = branches.filter(branch => (branch.skillIds || []).some(id => ids.has(String(id))));
      const shared = key.split('|').map(specName).join('·');
      out.push(`### ${named.length === 1 ? named[0].label : '트리 이름 미확인'} (${shared}) (${rows.length})`, ...rows.map(skill => line(skill, full)));
    }
  }

  section(`공용: ${guide.className} 직업 공통`, groups.common);

  if (!total) out.push('', terms.length ? '찾는 낱말이 든 스킬·특성이 없다.' : '이 전문화에 해당하는 스킬·특성이 kb-skills.json 에 없다.');
  console.log(out.join('\n'));
}

main();
