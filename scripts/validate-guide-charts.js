#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const GUIDE_DETAIL_PATH = path.join(SITE_ROOT, 'src', 'pages', 'GuideDetailPage.js');
const GUIDE_REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const KB_SKILLS_PATH = path.join(SITE_ROOT, 'src', 'data', 'kb-skills.json');

const ALLOWED_SPECIALIST_CHARTS = new Set(['uptime', 'cooldown', 'defensive', 'resource']);
const MIN_UPTIME_ROWS = 6;
const COMMON_SPECS = new Set(['공용', 'Common']);
const SPECIAL_GUIDE_PROFILES = new Map([
  ['evoker-augmentation', 'support'],
]);
const ROLE_CHART_REQUIREMENTS = {
  tanks: {
    chartIds: new Set(['defensive', 'uptime']),
    terms: ['방어', '완화', '생존', '위협', '피해', '탱', '시간차', '무쇠', '방패', '죽음의 일격', '신성화', '정의의 방패', '영혼 파편'],
    minHits: 3,
  },
  healers: {
    chartIds: new Set(['uptime', 'defensive', 'cooldown']),
    terms: ['치유', '회복', '피해', '보호막', '속죄', '마나', '외생기', '봉화', '안개', '메아리', '권능', '복구', '예열', '힐러'],
    minHits: 3,
  },
  support: {
    chartIds: new Set(['uptime']),
    terms: ['지원', '버프', '강화', '파티', '칠흑의 힘', '예지', '영겁의 숨결'],
    minHits: 3,
  },
  melee: {
    chartIds: new Set(['uptime', 'cooldown', 'resource']),
    terms: ['피해', '구간', '소비', '자원', '발동', '유지', '극딜', '분기', '쿨기', '정렬', '타임라인', '상태 전환', '광역', '단일'],
    minHits: 3,
  },
  ranged: {
    chartIds: new Set(['uptime', 'cooldown', 'resource']),
    terms: ['피해', '구간', '소비', '자원', '발동', '유지', '극딜', '분기', '쿨기', '정렬', '타임라인', '상태 전환', '광역', '단일'],
    minHits: 3,
  },
};

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadSourceModule(filePath, returnExpression) {
  const executable = readSource(filePath)
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function')
    .replace(/export default [^;]+;/g, '');

  return new Function(`${executable}\nreturn ${returnExpression};`)();
}

function cleanText(value) {
  return String(value || '').trim();
}

function skillName(skill) {
  return skill?.koreanName || skill?.name || skill?.englishName || '스킬';
}

function normalizeSkillLookupText(value) {
  return cleanText(value)
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .split('/')
    .pop()
    .replace(/[-_\s'’]/g, '')
    .toLocaleLowerCase();
}

function skillLookupKeys(skill) {
  return [
    skillName(skill),
    skill?.koreanName,
    skill?.name,
    skill?.englishName,
    skill?.source?.kbPath,
  ]
    .map(normalizeSkillLookupText)
    .filter(Boolean);
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

function findMatchingBrace(source, openIndex) {
  let depth = 0;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function extractFunctionBody(source, functionName) {
  const functionIndex = source.indexOf(`function ${functionName}`);
  if (functionIndex === -1) {
    errors.push(`${functionName} is missing`);
    return '';
  }

  const openIndex = source.indexOf('{', functionIndex);
  const closeIndex = findMatchingBrace(source, openIndex);
  if (openIndex === -1 || closeIndex === -1) {
    errors.push(`${functionName} has an invalid body`);
    return '';
  }

  return source.slice(openIndex + 1, closeIndex);
}

function extractObjectLiteral(source, constName) {
  const constIndex = source.indexOf(`const ${constName}`);
  if (constIndex === -1) {
    errors.push(`${constName} is missing`);
    return '';
  }

  const openIndex = source.indexOf('{', constIndex);
  const closeIndex = findMatchingBrace(source, openIndex);
  if (openIndex === -1 || closeIndex === -1) {
    errors.push(`${constName} has an invalid object literal`);
    return '';
  }

  return source.slice(openIndex + 1, closeIndex);
}

function extractObjectEntries(objectBody, scopeName) {
  const entries = [];
  const matcher = /'([^']+)'\s*:\s*\{/g;
  let match;

  while ((match = matcher.exec(objectBody))) {
    const id = match[1];
    const openIndex = objectBody.indexOf('{', match.index);
    const closeIndex = findMatchingBrace(objectBody, openIndex);
    if (closeIndex === -1) {
      errors.push(`Invalid ${scopeName} entry for ${id}`);
      continue;
    }

    entries.push({
      id,
      body: objectBody.slice(openIndex + 1, closeIndex),
      start: match.index,
    });
    matcher.lastIndex = closeIndex + 1;
  }

  return entries;
}

function extractGuideBranches(functionBody) {
  const branches = [];
  const matcher = /if\s*\(\s*guide\.id\s*===\s*'([^']+)'\s*\)\s*\{/g;
  let match;

  while ((match = matcher.exec(functionBody))) {
    const id = match[1];
    const openIndex = functionBody.indexOf('{', match.index);
    const closeIndex = findMatchingBrace(functionBody, openIndex);
    if (closeIndex === -1) {
      errors.push(`Invalid guide.id branch for ${id}`);
      continue;
    }

    branches.push({
      id,
      body: functionBody.slice(openIndex + 1, closeIndex),
      start: match.index,
    });
    matcher.lastIndex = closeIndex + 1;
  }

  return branches;
}

function parseGuideIds(registrySource) {
  return [...registrySource.matchAll(/\bspec\('([^']+)'/g)].map(match => match[1]);
}

function parseClassMap(registrySource) {
  const classBlockStart = registrySource.indexOf('export const classMeta');
  const classBlockEnd = registrySource.indexOf('export const guideRoles', classBlockStart);
  const classBlock = registrySource.slice(classBlockStart, classBlockEnd);
  const classMap = new Map();
  const matcher = /(\w+):\s*\{\s*className:\s*'[^']+',\s*kbClass:\s*'([^']+)'\s*\}/g;
  let match;

  while ((match = matcher.exec(classBlock))) {
    classMap.set(match[1], match[2]);
  }

  return classMap;
}

function parseGuideRecords(registrySource) {
  const classMap = parseClassMap(registrySource);
  const records = [];
  const matcher = /spec\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'[^']+'(?:,\s*\{([\s\S]*?)\})?\)/g;
  let match;

  while ((match = matcher.exec(registrySource))) {
    const [, id, classKey, specName, kbSpec, role, options = ''] = match;
    const aliasMatch = options.match(/kbSpecAliases:\s*\[([^\]]*)\]/);
    const aliases = aliasMatch
      ? [...aliasMatch[1].matchAll(/'([^']+)'/g)].map(alias => alias[1])
      : [];

    records.push({
      id,
      classKey,
      kbClass: classMap.get(classKey),
      specName,
      kbSpec,
      role,
      kbSpecAliases: uniqueBy([kbSpec, specName, ...aliases], value => value),
    });
  }

  return records;
}

function firstChartId(branchBody) {
  return branchBody.match(/\bid:\s*'([^']+)'/)?.[1] || null;
}

function extractLiteralText(source) {
  return [...source.matchAll(/'([^'\\]*(?:\\.[^'\\]*)*)'/g)]
    .map(match => match[1])
    .join(' ');
}

function effectiveGuideProfile(guide) {
  return SPECIAL_GUIDE_PROFILES.get(guide.id) || guide.role;
}

function recordMatchesGuide(record, guide, includeCommon = true) {
  if (!record || record.class !== guide.kbClass) return false;
  const listedSpecs = Array.isArray(record.specs) ? record.specs.map(spec => String(spec)) : [];
  if (listedSpecs.some(spec => guide.kbSpecAliases.includes(spec))) return true;
  if (includeCommon && COMMON_SPECS.has(record.spec)) return true;
  return guide.kbSpecAliases.includes(record.spec);
}

function scopedSkillsForGuide(skills, guide) {
  const specSkills = uniqueBy(
    skills.filter(skill => recordMatchesGuide(skill, guide, false)),
    skill => `${skill.id}:${skill.spec}`
  );
  const commonSkills = uniqueBy(
    skills.filter(skill => skill.class === guide.kbClass && COMMON_SPECS.has(skill.spec)),
    skill => `${skill.id}:${skill.spec}`
  );

  return uniqueBy([...specSkills, ...commonSkills], skill => `${skill.id}:${skill.spec}`);
}

function parseFindSkillNameGroups(branchBody) {
  const groups = [];
  const matcher = /findSkillByNames\(data,\s*\[([^\]]*)\]\)/g;
  let match;

  while ((match = matcher.exec(branchBody))) {
    const names = [...match[1].matchAll(/'([^']+)'/g)].map(name => name[1]);
    if (names.length) groups.push(names);
  }

  return groups;
}

function parseFindSkillIdGroups(source) {
  const groups = [];
  const matcher = /findSkillByIds\(data,\s*\[([^\]]*)\]\)/g;
  let match;

  while ((match = matcher.exec(source))) {
    const ids = [...match[1].matchAll(/'([^']+)'/g)].map(id => id[1]);
    if (ids.length) groups.push(ids);
  }

  return groups;
}

function resolvesSkillName(scopedSkills, names) {
  const normalizedNames = names.map(normalizeSkillLookupText).filter(Boolean);
  const exactMatch = scopedSkills.find(skill => {
    const keys = skillLookupKeys(skill);
    return normalizedNames.some(name => keys.includes(name));
  });

  if (exactMatch) return exactMatch;

  return scopedSkills.find(skill => {
    const keys = skillLookupKeys(skill);
    return normalizedNames.some(name => keys.some(key => key.includes(name)));
  });
}

function availableSkillIds(skills, manuscripts) {
  return new Set([
    ...skills.map(skill => String(skill.id)),
    ...Object.values(manuscripts || {})
      .flatMap(manuscript => manuscript.extraSkills || [])
      .map(skill => String(skill.id)),
  ]);
}

function resolvesSkillIds(skillIds, ids) {
  return ids.map(id => String(id)).some(id => skillIds.has(id));
}

function validateNoDuplicateBranches(branches, scopeName) {
  const seen = new Map();

  for (const branch of branches) {
    if (!seen.has(branch.id)) {
      seen.set(branch.id, 1);
      continue;
    }

    seen.set(branch.id, seen.get(branch.id) + 1);
  }

  for (const [id, count] of seen.entries()) {
    assert(count === 1, `${scopeName} has duplicate branch for ${id}`);
  }
}

function main() {
  const guideDetailSource = readSource(GUIDE_DETAIL_PATH);
  const guideRegistrySource = readSource(GUIDE_REGISTRY_PATH);
  const skills = Object.values(readJson(KB_SKILLS_PATH).skills || {});
  const manuscripts = loadSourceModule(MANUSCRIPT_PATH, 'guideManuscripts');
  const skillIds = availableSkillIds(skills, manuscripts);
  const guideRecords = parseGuideRecords(guideRegistrySource);
  const guideIds = parseGuideIds(guideRegistrySource);
  const specialistChartBody = extractObjectLiteral(guideDetailSource, 'SPECIALIST_CHARTS');
  const uptimeBody = extractFunctionBody(guideDetailSource, 'getUptimeRows');
  const disciplinePriestUptimeBody = extractFunctionBody(guideDetailSource, 'getDisciplinePriestUptimeRows');
  const planBranches = extractObjectEntries(specialistChartBody, 'SPECIALIST_CHARTS');
  const uptimeBranches = extractGuideBranches(uptimeBody);
  const planBranchMap = new Map(planBranches.map(branch => [branch.id, branch]));
  const uptimeBranchMap = new Map(uptimeBranches.map(branch => [branch.id, branch]));
  const guideRecordMap = new Map(guideRecords.map(guide => [guide.id, guide]));

  assert(guideIds.length === 40, `guideRegistry should expose 40 specs, found ${guideIds.length}`);
  assert(guideRecords.length === guideIds.length, `guideRegistry parse mismatch: ${guideRecords.length} records for ${guideIds.length} ids`);
  validateNoDuplicateBranches(planBranches, 'SPECIALIST_CHARTS');
  validateNoDuplicateBranches(uptimeBranches, 'getUptimeRows');

  for (const guideId of guideIds) {
    assert(planBranchMap.has(guideId), `SPECIALIST_CHARTS is missing a specialist chart entry for ${guideId}`);
    assert(guideRecordMap.get(guideId)?.kbClass, `guideRegistry is missing kbClass mapping for ${guideId}`);
  }

  const plannedUptimeIds = [];

  for (const branch of planBranches) {
    const chartId = firstChartId(branch.body);
    const guide = guideRecordMap.get(branch.id);
    const profile = guide ? effectiveGuideProfile(guide) : null;
    const requirements = profile ? ROLE_CHART_REQUIREMENTS[profile] : null;
    const branchText = extractLiteralText(branch.body);

    assert(chartId, `getInlineChartPlan branch for ${branch.id} does not declare a chart id`);
    assert(ALLOWED_SPECIALIST_CHARTS.has(chartId), `getInlineChartPlan branch for ${branch.id} uses unsupported chart id "${chartId}"`);
    assert(/\bsectionHeading\s*:/.test(branch.body), `getInlineChartPlan branch for ${branch.id} is missing sectionHeading`);
    assert(/\bsectionIntro\s*:/.test(branch.body), `getInlineChartPlan branch for ${branch.id} is missing sectionIntro`);
    assert(/\bcaption\s*:/.test(branch.body), `getInlineChartPlan branch for ${branch.id} is missing caption`);
    assert(/\bdefinition\s*:/.test(branch.body), `getInlineChartPlan branch for ${branch.id} is missing definition`);
    assert(branchText.includes('의미'), `getInlineChartPlan branch for ${branch.id} definition must explain meaning`);
    assert(branchText.includes('읽는 법'), `getInlineChartPlan branch for ${branch.id} definition must explain how to read the chart`);
    assert(
      branchText.includes('체크 포인트') || branchText.includes('검수 포인트'),
      `getInlineChartPlan branch for ${branch.id} definition must include validation points`
    );
    assert(branchText.length >= 220, `getInlineChartPlan branch for ${branch.id} needs a richer chart explanation`);
    assert(requirements, `getInlineChartPlan branch for ${branch.id} has no role chart requirement for profile "${profile}"`);
    if (requirements) {
      const roleHits = requirements.terms.filter(term => branchText.includes(term));
      assert(
        requirements.chartIds.has(chartId),
        `getInlineChartPlan branch for ${branch.id} uses ${chartId} chart outside ${profile} profile expectations`
      );
      assert(
        roleHits.length >= requirements.minHits,
        `getInlineChartPlan branch for ${branch.id} does not describe a ${profile}-appropriate chart; found ${roleHits.length}/${requirements.minHits} (${roleHits.join(', ') || 'none'})`
      );
    }
    assert(!/^\s*return\s*\[/m.test(branch.body), `getInlineChartPlan branch for ${branch.id} returns timeline rows directly`);
    assert(!/\bsegments\s*:/.test(branch.body), `getInlineChartPlan branch for ${branch.id} contains timeline segment data`);
    assert(!/\bfindSkillByNames\s*\(/.test(branch.body), `getInlineChartPlan branch for ${branch.id} contains row-level skill lookup`);

    if (chartId === 'uptime') {
      plannedUptimeIds.push(branch.id);
    }
  }

  for (const guideId of plannedUptimeIds) {
    const branch = uptimeBranchMap.get(guideId);
    assert(branch, `getUptimeRows is missing rows for uptime chart ${guideId}`);
    if (!branch) continue;

    const rowCount = (branch.body.match(/\blabel\s*:/g) || []).length;
    assert(rowCount >= MIN_UPTIME_ROWS, `getUptimeRows branch for ${guideId} should have at least ${MIN_UPTIME_ROWS} rows, found ${rowCount}`);
    assert(!branch.body.includes("'유지 효과'"), `getUptimeRows branch for ${guideId} still uses generic "유지 효과" label`);
    assert(!branch.body.includes("'재확인'"), `getUptimeRows branch for ${guideId} still uses generic "재확인" label`);

    const guide = guideRecordMap.get(guideId);
    const scopedSkills = guide ? scopedSkillsForGuide(skills, guide) : [];
    const lookupBody = guideId === 'priest-discipline'
      ? `${branch.body}\n${disciplinePriestUptimeBody}`
      : branch.body;

    for (const names of parseFindSkillNameGroups(lookupBody)) {
      assert(
        resolvesSkillName(scopedSkills, names),
        `getUptimeRows branch for ${guideId} cannot resolve chart skill names [${names.join(', ')}]`
      );
    }

    for (const ids of parseFindSkillIdGroups(lookupBody)) {
      assert(
        resolvesSkillIds(skillIds, ids),
        `getUptimeRows branch for ${guideId} cannot resolve any chart skill ids [${ids.join(', ')}]`
      );
    }
  }

  for (const ids of parseFindSkillIdGroups(guideDetailSource)) {
    assert(
      resolvesSkillIds(skillIds, ids),
      `GuideDetailPage contains unresolved chart skill ids [${ids.join(', ')}]`
    );
  }

  if (errors.length) {
    console.error(`Guide chart validation failed (${errors.length}):`);
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  console.log(`Guide chart validation passed: ${guideIds.length} specs, ${plannedUptimeIds.length} uptime timelines`);
}

main();
