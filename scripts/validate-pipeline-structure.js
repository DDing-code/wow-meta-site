#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const EXPECTED_PATCH = process.env.WOWMETA_EXPECTED_PATCH || '12.0.5';
const REQUIRED_KB_SEGMENT = '08-\uC9C1\uC5C5\uBCC4-Knowledge-Base';

const errors = [];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function validatePackageScripts() {
  const pkg = readJson(path.join(SITE_ROOT, 'package.json'));
  const scripts = pkg.scripts || {};
  const prebuild = scripts.prebuild || '';

  assert(scripts['sync-kb'] === 'node scripts/sync-kb.js', 'sync-kb must use the site-local wrapper');
  assert(scripts['validate:generated-data']?.includes('validate-generated-data.js'), 'validate:generated-data is missing');
  assert(scripts['validate:pipeline'] === 'node scripts/validate-pipeline-structure.js', 'validate:pipeline must be site-local');
  assert(scripts['validate:guide-registry']?.includes('validate-guide-registry.js'), 'validate:guide-registry is missing');
  assert(scripts['validate:guide-copy']?.includes('validate-guide-copy.js'), 'validate:guide-copy is missing');
  assert(scripts['validate:guide-manuscripts']?.includes('validate-guide-manuscripts.js'), 'validate:guide-manuscripts is missing');
  assert(scripts['validate:guide-charts']?.includes('validate-guide-charts.js'), 'validate:guide-charts is missing');
  assert(scripts['validate:kb-tooltips']?.includes('validate-kb-official-tooltips.js'), 'validate:kb-tooltips is missing');
  assert(prebuild.includes('validate:generated-data'), 'prebuild must validate generated data');
  assert(prebuild.includes('validate:pipeline'), 'prebuild must validate pipeline structure');
  assert(prebuild.includes('validate:guide-registry'), 'prebuild must validate guide registry');
  assert(prebuild.includes('validate:guide-copy'), 'prebuild must validate guide copy terms');
  assert(prebuild.includes('validate:guide-manuscripts'), 'prebuild must validate guide manuscript coverage');
  assert(prebuild.includes('validate:guide-charts'), 'prebuild must validate guide chart coverage');
  assert(prebuild.includes('validate:kb-tooltips'), 'prebuild must validate KB tooltip/icon data');
  assert(prebuild.includes('validate-translations.js'), 'prebuild must run translation validation');
}

function validateGeneratedData() {
  const dataDir = path.join(SITE_ROOT, 'src', 'data');
  const pairs = [
    ['kb-skills.json', 'skills', 'totalSkills'],
    ['kb-synergies.json', 'synergies', 'totalSynergies'],
  ];

  for (const [fileName, collectionKey, totalKey] of pairs) {
    const data = readJson(path.join(dataDir, fileName));
    const collection = data[collectionKey] || {};
    const metadata = data.metadata || {};
    const kbRoot = normalizePath(metadata.kbRoot);

    assert(metadata.patch === EXPECTED_PATCH, `${fileName} metadata.patch must be ${EXPECTED_PATCH}`);
    assert(kbRoot.includes(REQUIRED_KB_SEGMENT), `${fileName} metadata.kbRoot must point at ${REQUIRED_KB_SEGMENT}`);
    assert(metadata[totalKey] === Object.keys(collection).length, `${fileName} metadata count must match collection`);
    assert((metadata.duplicateIds || []).length === 0, `${fileName} must not contain duplicate ids`);
  }
}

function validateGuideEntrypoints() {
  const appSource = fs.readFileSync(path.join(SITE_ROOT, 'src', 'App.js'), 'utf8');
  const registryPath = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
  const detailPath = path.join(SITE_ROOT, 'src', 'pages', 'GuideDetailPage.js');
  const manuscriptsPath = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');

  assert(fs.existsSync(registryPath), 'guideRegistry.js is missing');
  assert(fs.existsSync(detailPath), 'GuideDetailPage.js is missing');
  assert(fs.existsSync(manuscriptsPath), 'guideManuscripts.js is missing');
  assert(appSource.includes('./pages/GuideDetailPage.js'), 'App.js must import GuideDetailPage');
  assert(appSource.includes('guideRouteComponents'), 'App.js must expose guideRouteComponents');
}

validatePackageScripts();
validateGeneratedData();
validateGuideEntrypoints();

if (errors.length) {
  console.error(`Pipeline structure validation failed (${errors.length}):`);
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

console.log('Pipeline structure validation passed');
