#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(SITE_ROOT, 'src', 'data');
const EXPECTED_PATCH = process.env.WOWMETA_EXPECTED_PATCH || '12.0.5';
const REQUIRED_KB_ROOT_SEGMENT = '08-\uC9C1\uC5C5\uBCC4-Knowledge-Base';
const FORBIDDEN_KB_SEGMENTS = ['01-ATOMIC', '02-SYNERGY'];

const errors = [];
const warnings = [];

function readJson(relativePath) {
  const filePath = path.join(DATA_DIR, relativePath);

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${relativePath}: failed to read JSON (${error.message})`);
    return null;
  }
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function hasRequiredKbRoot(value) {
  return normalizePath(value).includes(REQUIRED_KB_ROOT_SEGMENT);
}

function hasForbiddenKbRoot(value) {
  const normalized = normalizePath(value);
  return FORBIDDEN_KB_SEGMENTS.some(segment => normalized.includes(segment));
}

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function validateMetadata(label, data, collection, totalField) {
  const metadata = data && data.metadata;

  assert(metadata && typeof metadata === 'object', `${label}: metadata is missing`);
  if (!metadata) return;

  assert(metadata.patch === EXPECTED_PATCH, `${label}: metadata.patch must be ${EXPECTED_PATCH}, got ${metadata.patch || 'empty'}`);
  assert(hasRequiredKbRoot(metadata.kbRoot), `${label}: metadata.kbRoot must point at ${REQUIRED_KB_ROOT_SEGMENT}`);
  assert(!hasForbiddenKbRoot(metadata.kbRoot), `${label}: metadata.kbRoot must not point at legacy KB folders`);

  const actualCount = Object.keys(collection || {}).length;
  assert(metadata[totalField] === actualCount, `${label}: metadata.${totalField}=${metadata[totalField]} does not match actual count ${actualCount}`);

  if (Array.isArray(metadata.duplicateIds)) {
    assert(metadata.duplicateIds.length === 0, `${label}: metadata.duplicateIds must be empty, got ${metadata.duplicateIds.length}`);
  }
}

function getDisplayName(entry) {
  return entry.koreanName || entry.name || entry.name_kr || entry.nameKo || entry.englishName || entry.name_en;
}

function validateSource(label, id, entry) {
  const kbPath = entry && entry.source && entry.source.kbPath;

  assert(kbPath, `${label}:${id}: source.kbPath is missing`);
  if (!kbPath) return;

  assert(hasRequiredKbRoot(kbPath), `${label}:${id}: source.kbPath must point at ${REQUIRED_KB_ROOT_SEGMENT}`);
  assert(!hasForbiddenKbRoot(kbPath), `${label}:${id}: source.kbPath must not point at legacy KB folders`);
}

function validateSkills(data) {
  const skills = data && data.skills;

  assert(skills && typeof skills === 'object' && !Array.isArray(skills), 'skills: skills object is missing');
  if (!skills || typeof skills !== 'object' || Array.isArray(skills)) return;

  validateMetadata('skills', data, skills, 'totalSkills');

  Object.entries(skills).forEach(([key, skill]) => {
    const id = skill && skill.id;

    assert(id, `skills:${key}: id is missing`);
    assert(String(id) === String(key), `skills:${key}: id does not match object key ${id}`);
    assert(getDisplayName(skill), `skills:${key}: display name is missing`);
    assert(skill.class, `skills:${key}: class is missing`);
    assert(skill.spec, `skills:${key}: spec is missing`);
    validateSource('skills', key, skill);

    if (skill.patch && skill.patch !== EXPECTED_PATCH) {
      warnings.push(`skills:${key}: item patch is ${skill.patch}, metadata patch is ${EXPECTED_PATCH}`);
    }
  });
}

function validateUnholyMechanics(skills = {}) {
  for (const [castId, effectId] of [['1233448', '63560'], ['458128', '455397'], ['1271967', '1271974']]) {
    assert(skills[castId]?.patch === '12.1' && skills[castId]?.castTime === '즉시', `Unholy:${castId}: current cast ID must survive KB sync`);
    assert(skills[effectId]?.castTime === '지속 효과', `Unholy:${effectId}: effect/talent must not become an independently cast button`);
    assert(skills[castId]?.name === skills[effectId]?.name, `Unholy:${castId}: cast and effect must retain the same official name`);
  }
  assert(skills['42650']?.cooldown === '90초' && skills['42650']?.description.includes('30초') && skills['42650']?.description.includes('8마리') && skills['42650']?.description.includes('명령'), 'Unholy: Army must retain the 90s/30s/eight-ghoul order mechanic');
  assert(skills['1233448']?.cooldown === '45초', 'Unholy: Dark Transformation is distinct from the 90s Army cooldown');
  assert(skills['343294']?.cooldown === '15초' && skills['343294']?.description.includes('3중첩') && skills['343294']?.description.includes('부패 충전을 소비하지'), 'Unholy: Soul Reaper consumes ghoul-ready stacks, not Putrefy charges');
  assert(skills['377580']?.description.includes('최대 2회 소비') && skills['377580']?.description.includes('3충전'), 'Unholy: Putrid Echoes must distinguish casts from charge consumption');
  assert(skills['1256813']?.name === '죽은 자의 군주' && skills['1256813']?.icon === 'achievement_dungeon_thenecroticwake_nalthor' && skills['1256813']?.type === 'talent', 'Unholy: Lord of the Dead must not regress to Reanimation or a hero talent');
  assert(skills['1242158']?.type === 'talent' && skills['1256566']?.description.includes('100%'), 'Unholy: apex nodes must remain separate specialization talents');
  for (const id of ['1254252', '1256576', '191587', '1240996']) {
    assert(skills[id]?.type === 'buff' && skills[id]?.castTime === '지속 효과', `Unholy:${id}: preparation/disease effects are not cast buttons`);
  }
  assert(skills['1296655']?.description.includes('35% 미만') && skills['1296655']?.description.includes('130%'), 'Unholy: tier four-piece applies to the named pet spells below 35%');
  for (const id of ['1297086', '1297091']) {
    assert(skills[id]?.castTime === '소환수 시전', `Unholy:${id}: tier spells must be identified as pet actions`);
  }
}

function validateSynergies(data) {
  const synergies = data && data.synergies;

  assert(synergies && typeof synergies === 'object' && !Array.isArray(synergies), 'synergies: synergies object is missing');
  if (!synergies || typeof synergies !== 'object' || Array.isArray(synergies)) return;

  validateMetadata('synergies', data, synergies, 'totalSynergies');

  Object.entries(synergies).forEach(([key, synergy]) => {
    const id = synergy && synergy.id;

    assert(id, `synergies:${key}: id is missing`);
    assert(String(id) === String(key), `synergies:${key}: id does not match object key ${id}`);
    assert(getDisplayName(synergy), `synergies:${key}: display name is missing`);
    assert(synergy.class, `synergies:${key}: class is missing`);
    assert(synergy.spec, `synergies:${key}: spec is missing`);
    validateSource('synergies', key, synergy);

    if (synergy.patch && synergy.patch !== EXPECTED_PATCH) {
      warnings.push(`synergies:${key}: item patch is ${synergy.patch}, metadata patch is ${EXPECTED_PATCH}`);
    }
  });
}

const skillsData = readJson('kb-skills.json');
const synergyData = readJson('kb-synergies.json');

validateSkills(skillsData);
validateUnholyMechanics(skillsData?.skills);
validateSynergies(synergyData);

if (warnings.length) {
  console.warn(`Generated data validation warnings (${warnings.length}):`);
  warnings.slice(0, 20).forEach(warning => console.warn(`  - ${warning}`));
  if (warnings.length > 20) {
    console.warn(`  ... ${warnings.length - 20} more`);
  }
}

if (errors.length) {
  console.error(`Generated data validation failed (${errors.length}):`);
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`Generated data validation passed: patch ${EXPECTED_PATCH}, KB root ${REQUIRED_KB_ROOT_SEGMENT}`);
