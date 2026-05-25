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
