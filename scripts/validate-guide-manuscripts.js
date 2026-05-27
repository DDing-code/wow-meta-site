#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const SKILLS_PATH = path.join(SITE_ROOT, 'src', 'data', 'kb-skills.json');
const EXPECTED_PATCH = process.env.WOWMETA_EXPECTED_PATCH || '12.0.5';
const EXPECTED_GUIDE_COUNT = Number(process.env.WOWMETA_EXPECTED_GUIDE_COUNT || 40);

const MINIMUMS = {
  sources: 7,
  openerSteps: 6,
  priorityItems: 6,
  evidenceItems: 4,
  blockItems: 6,
  tipItems: 4,
};

const TRUST_TIERS = new Set(['S', 'A', 'B', 'C']);
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

function combinedSourceText(manuscript) {
  return [
    manuscript.sourceStatus,
    manuscript.sourceNote,
    ...(manuscript.evidence || []),
    ...(manuscript.caveats || []),
    ...(manuscript.sources || []).flatMap(source => [
      source.label,
      source.url,
      source.updated,
      source.note,
    ]),
  ].filter(Boolean).join(' ');
}

function validateSource(spec, source, index) {
  const prefix = `${spec.id}.sources[${index}]`;

  assert(TRUST_TIERS.has(source.tier), `${prefix}: tier must be one of S/A/B/C`);
  assert(source.label, `${prefix}: label is missing`);
  assert(source.url && /^https?:\/\//.test(source.url), `${prefix}: url must be an absolute web URL`);
  assert(source.updated, `${prefix}: updated date/context is missing`);
  assert(source.note && source.note.length >= 12, `${prefix}: note is too thin`);
}

function validateSkillReferences(spec, manuscript, kbSkills) {
  const extraSkills = new Set((manuscript.extraSkills || []).map(skill => String(skill.id)));
  const skillRefs = [];

  if (manuscript.graphCenterSkillId) {
    skillRefs.push(['graphCenterSkillId', manuscript.graphCenterSkillId]);
  }

  (manuscript.opener?.steps || []).forEach((step, index) => {
    skillRefs.push([`opener.steps[${index}].skillId`, step.skillId]);
  });

  (manuscript.priority || []).forEach((item, index) => {
    skillRefs.push([`priority[${index}].skillId`, item.skillId]);
  });

  skillRefs.forEach(([field, value]) => {
    const id = String(value || '');
    assert(id, `${spec.id}.${field}: skill id is missing`);
    assert(kbSkills[id] || extraSkills.has(id), `${spec.id}.${field}: skill id ${id} is not in KB or extraSkills`);
  });
}

function validateManuscript(spec, manuscript, kbSkills) {
  const prefix = spec.id;
  const sources = manuscript.sources || [];
  const openerSteps = manuscript.opener?.steps || [];
  const priority = manuscript.priority || [];
  const evidence = manuscript.evidence || [];
  const blocks = manuscript.blocks || [];
  const tips = manuscript.tips || [];
  const sourceText = combinedSourceText(manuscript);

  assert(manuscript.patch === EXPECTED_PATCH, `${prefix}: patch must be ${EXPECTED_PATCH}`);
  assert(manuscript.researchedAt, `${prefix}: researchedAt is missing`);
  assert(manuscript.summary && manuscript.summary.length >= 80, `${prefix}: summary is too thin`);
  assert(manuscript.sourceNote && manuscript.sourceNote.length >= 120, `${prefix}: sourceNote is too thin`);
  assert(manuscript.graphCenterSkillId, `${prefix}: graphCenterSkillId is missing`);
  assert(sources.length >= MINIMUMS.sources, `${prefix}: needs at least ${MINIMUMS.sources} sources`);
  assert(openerSteps.length >= MINIMUMS.openerSteps, `${prefix}: needs at least ${MINIMUMS.openerSteps} combat-flow steps`);
  assert(priority.length >= MINIMUMS.priorityItems, `${prefix}: needs at least ${MINIMUMS.priorityItems} priority items`);
  assert(evidence.length >= MINIMUMS.evidenceItems, `${prefix}: needs at least ${MINIMUMS.evidenceItems} evidence notes`);
  assert(blocks.length >= MINIMUMS.blockItems, `${prefix}: needs at least ${MINIMUMS.blockItems} narrative blocks`);
  assert(tips.length >= MINIMUMS.tipItems, `${prefix}: needs at least ${MINIMUMS.tipItems} practical tips`);

  assert(/Blizzard|news\.blizzard/i.test(sourceText), `${prefix}: Blizzard source evidence is missing`);
  assert(/Wowhead/i.test(sourceText), `${prefix}: Wowhead source evidence is missing`);
  assert(/Icy Veins/i.test(sourceText), `${prefix}: Icy Veins source evidence is missing`);
  assert(/Archon|WCL/i.test(sourceText), `${prefix}: log/Archon evidence is missing`);
  assert(/Discord|Dreamgrove|Fel Hammer|Acherus|Skyhold|Ravenholdt|Earthshrine|Warcraft Priests|Peak of Serenity|Wyrmrest|Ancestral Guidance/i.test(sourceText), `${prefix}: class Discord/public community evidence is missing`);
  assert(!/Maxroll/i.test(sourceText), `${prefix}: Maxroll must not be used as a guide source`);

  openerSteps.forEach((step, index) => {
    const stepPrefix = `${prefix}.opener.steps[${index}]`;
    assert(step.label, `${stepPrefix}: label is missing`);
    assert(step.note && step.note.length >= 8, `${stepPrefix}: note is too thin`);
  });

  priority.forEach((item, index) => {
    const itemPrefix = `${prefix}.priority[${index}]`;
    assert(item.label, `${itemPrefix}: label is missing`);
    assert(item.note && item.note.length >= 12, `${itemPrefix}: note is too thin`);
  });

  sources.forEach((source, index) => validateSource(spec, source, index));
  validateSkillReferences(spec, manuscript, kbSkills);
}

function main() {
  const registry = loadSourceModule(REGISTRY_PATH, '{ getReadyGuideSpecs }');
  const manuscripts = loadSourceModule(MANUSCRIPT_PATH, 'guideManuscripts');
  const kbSkills = JSON.parse(read(SKILLS_PATH)).skills || {};
  const readySpecs = registry.getReadyGuideSpecs();

  assert(readySpecs.length === EXPECTED_GUIDE_COUNT, `ready guide count must be ${EXPECTED_GUIDE_COUNT}, got ${readySpecs.length}`);

  readySpecs.forEach(spec => {
    const manuscript = manuscripts[spec.id];
    assert(manuscript, `${spec.id}: guide manuscript is missing`);
    if (manuscript) validateManuscript(spec, manuscript, kbSkills);
  });

  Object.keys(manuscripts).forEach(id => {
    assert(readySpecs.some(spec => spec.id === id), `${id}: manuscript is not present in ready guide registry`);
  });

  if (errors.length) {
    console.error(`Guide manuscript validation failed (${errors.length}):`);
    errors.slice(0, 80).forEach(error => console.error(`  - ${error}`));
    if (errors.length > 80) {
      console.error(`  ... and ${errors.length - 80} more`);
    }
    process.exit(1);
  }

  console.log(`Guide manuscript validation passed: ${readySpecs.length} guides`);
}

main();
