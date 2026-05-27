#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const GUIDE_DETAIL_PATH = path.join(SITE_ROOT, 'src', 'pages', 'GuideDetailPage.js');
const REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const SKILLS_PATH = path.join(SITE_ROOT, 'src', 'data', 'kb-skills.json');
const EXPECTED_GUIDE_COUNT = Number(process.env.WOWMETA_EXPECTED_GUIDE_COUNT || 40);
const COMMON_SPECS = new Set(['공용', 'Common']);

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function loadSourceModule(filePath, returnExpression) {
  const executable = read(filePath)
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function')
    .replace(/export default [^;]+;/g, '');

  return new Function(`${executable}\nreturn ${returnExpression};`)();
}

function cleanText(value) {
  return String(value || '').trim();
}

function skillName(skill) {
  return skill?.koreanName || skill?.name || skill?.englishName || '';
}

function hasIcon(skill) {
  return !!(
    skill?.icon ||
    skill?.iconUrl ||
    skill?.iconUrls?.medium ||
    skill?.iconUrls?.small ||
    skill?.iconUrls?.large
  );
}

function hasTooltipId(skill) {
  return /^\d+$/.test(String(skill?.id || ''));
}

function skillScopeText(skill) {
  return [
    `class=${skill?.class || 'missing'}`,
    `spec=${skill?.spec || 'missing'}`,
    `specs=${Array.isArray(skill?.specs) ? skill.specs.join(',') : 'missing'}`,
  ].join(' ');
}

function skillMatchesGuide(skill, spec) {
  if (!skill || skill.class !== spec.kbClass) return false;
  const listedSpecs = Array.isArray(skill.specs) ? skill.specs.map(item => String(item)) : [];

  if (listedSpecs.some(item => spec.kbSpecAliases.includes(item))) return true;
  if (listedSpecs.some(item => COMMON_SPECS.has(item))) return true;
  if (COMMON_SPECS.has(skill.spec)) return true;
  return spec.kbSpecAliases.includes(skill.spec);
}

function collectSkillRefs(value, trail = '', refs = []) {
  if (!value) return refs;

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectSkillRefs(item, `${trail}[${index}]`, refs));
    return refs;
  }

  if (typeof value !== 'object') return refs;

  Object.entries(value).forEach(([key, item]) => {
    const nextTrail = trail ? `${trail}.${key}` : key;
    if (/^(skillId|graphCenterSkillId)$/.test(key) || /SkillId$/.test(key)) {
      refs.push({ path: nextTrail, id: String(item || '') });
      return;
    }
    collectSkillRefs(item, nextTrail, refs);
  });

  return refs;
}

function getExtraSkillMap(manuscript) {
  return new Map((manuscript.extraSkills || []).map(skill => [String(skill.id), skill]));
}

function resolveSkill(id, kbSkills, extraSkills) {
  return extraSkills.get(String(id)) || kbSkills[String(id)] || null;
}

function validateRendererSource(source) {
  assert(source.includes('function SkillIconLink'), 'SkillIconLink renderer is missing');
  assert(source.includes('function InlineSkillTerm'), 'InlineSkillTerm renderer is missing');
  assert(source.includes('data-wowhead={`spell=${skill.id}&domain=ko`}'), 'guide skill links must attach Korean Wowhead tooltip data');
  assert(source.includes('href={wowheadUrl(skill)}'), 'guide skill links must use ko Wowhead URLs');
  assert(source.includes('<img src={getIconUrl(skill)}'), 'SkillIconLink must render spell icons');
  assert(source.includes('<img src={iconUrl}'), 'InlineSkillTerm must render spell icons');
  assert(source.includes('<InlineSkillText>{children}</InlineSkillText>'), 'InlineSkillTerm must keep icon plus visible text');
  assert(source.includes('<InlineSkillTerm'), 'renderGuideText must replace skill names with InlineSkillTerm');
  assert(source.includes('...(manuscript?.extraSkills || [])'), 'inline term builder must include manuscript extraSkills');
  assert(source.includes('<SkillIconLink skill={step.skill}'), 'opener flow steps must render skill icons');
  assert(source.includes('<SkillIconLink skill={row.skill}'), 'priority rows must render skill icons');
}

function validateExtraSkills(spec, manuscript) {
  (manuscript.extraSkills || []).forEach((skill, index) => {
    const prefix = `${spec.id}.extraSkills[${index}]`;
    assert(hasTooltipId(skill), `${prefix}: numeric Wowhead spell id is required`);
    assert(skillName(skill), `${prefix}: Korean/name label is missing`);
    assert(hasIcon(skill), `${prefix}: icon data is missing`);
    assert(skill.class, `${prefix}: class scope is missing`);
    assert(skill.spec || Array.isArray(skill.specs), `${prefix}: spec scope is missing`);
    assert(skillMatchesGuide(skill, spec), `${prefix}: scope ${skillScopeText(skill)} does not match ${spec.kbClass}/${spec.kbSpecAliases.join('|')}`);
  });
}

function validateReferencedSkills(spec, manuscript, kbSkills) {
  const extraSkills = getExtraSkillMap(manuscript);
  const refs = collectSkillRefs(manuscript);
  const seen = new Set();

  refs.forEach(ref => {
    const id = String(ref.id || '');
    const key = `${ref.path}:${id}`;
    if (seen.has(key)) return;
    seen.add(key);

    const skill = resolveSkill(id, kbSkills, extraSkills);
    const prefix = `${spec.id}.${ref.path}`;

    assert(id, `${prefix}: skill id is missing`);
    assert(skill, `${prefix}: skill id ${id} is not in KB or extraSkills`);
    if (!skill) return;

    assert(hasTooltipId(skill), `${prefix}: skill id ${id} cannot build a Wowhead tooltip`);
    assert(skillName(skill), `${prefix}: skill id ${id} has no Korean/name label`);
    assert(hasIcon(skill), `${prefix}: skill id ${id} has no icon data`);
    assert(skillMatchesGuide(skill, spec), `${prefix}: skill id ${id} scope ${skillScopeText(skill)} does not match ${spec.kbClass}/${spec.kbSpecAliases.join('|')}`);
  });
}

function validateInlineTermCoverage(spec, manuscript, kbSkills) {
  const extraSkills = getExtraSkillMap(manuscript);
  const referencedIds = new Set(collectSkillRefs(manuscript).map(ref => String(ref.id || '')).filter(Boolean));
  const missingInlineTerms = [];

  referencedIds.forEach(id => {
    const skill = resolveSkill(id, kbSkills, extraSkills);
    if (!skill) return;
    const name = skillName(skill);
    if (!name || name.length < 2) missingInlineTerms.push(id);
  });

  assert(
    missingInlineTerms.length === 0,
    `${spec.id}: referenced skills without usable inline labels: ${missingInlineTerms.join(', ')}`
  );
}

function main() {
  const guideSource = read(GUIDE_DETAIL_PATH);
  const registry = loadSourceModule(REGISTRY_PATH, '{ getReadyGuideSpecs }');
  const manuscripts = loadSourceModule(MANUSCRIPT_PATH, 'guideManuscripts');
  const kbSkills = JSON.parse(read(SKILLS_PATH)).skills || {};
  const readySpecs = registry.getReadyGuideSpecs();

  assert(readySpecs.length === EXPECTED_GUIDE_COUNT, `ready guide count must be ${EXPECTED_GUIDE_COUNT}, got ${readySpecs.length}`);
  validateRendererSource(guideSource);

  readySpecs.forEach(spec => {
    const manuscript = manuscripts[spec.id];
    assert(manuscript, `${spec.id}: guide manuscript is missing`);
    if (!manuscript) return;

    validateExtraSkills(spec, manuscript);
    validateReferencedSkills(spec, manuscript, kbSkills);
    validateInlineTermCoverage(spec, manuscript, kbSkills);
  });

  if (errors.length) {
    console.error(`Guide tooltip validation failed (${errors.length}):`);
    errors.slice(0, 100).forEach(error => console.error(`  - ${error}`));
    if (errors.length > 100) {
      console.error(`  ... and ${errors.length - 100} more`);
    }
    process.exit(1);
  }

  console.log(`Guide tooltip validation passed: ${readySpecs.length} guides`);
}

main();
