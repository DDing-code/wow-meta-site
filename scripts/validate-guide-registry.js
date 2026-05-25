#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const APP_PATH = path.join(SITE_ROOT, 'src', 'App.js');
const ALLOWED_EXPLICIT_GUIDE_ROUTES = new Set([
  '/guide',
  '/guide/method/mage/arcane',
  '/guide/demonhunter/havoc-new',
]);

const errors = [];
const warnings = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function loadRegistry() {
  const source = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const executable = source
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function');

  return new Function(`${executable}\nreturn { guideSpecsByRole, getAllGuideSpecs, getReadyGuideSpecs };`)();
}

function readRouteComponentIds() {
  const appSource = fs.readFileSync(APP_PATH, 'utf8');
  const appWithoutComments = appSource
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const match = appSource.match(/const\s+guideRouteComponents\s*=\s*\{([\s\S]*?)\};/);

  assert(match, 'App.js: guideRouteComponents map is missing');
  if (!match) return { componentIds: new Set(), explicitGuideRoutes: [] };

  const componentIds = new Set(
    Array.from(match[1].matchAll(/['"]([^'"]+)['"]\s*:/g)).map(result => result[1])
  );

  const explicitGuideRoutes = Array.from(appWithoutComments.matchAll(/<Route\s+path=["'](\/guide[^"']*)["']/g))
    .map(result => result[1])
    .filter(route => !ALLOWED_EXPLICIT_GUIDE_ROUTES.has(route));

  return { componentIds, explicitGuideRoutes };
}

let registry;
try {
  registry = loadRegistry();
} catch (error) {
  errors.push(`guideRegistry.js: failed to evaluate registry (${error.message})`);
}

const { componentIds, explicitGuideRoutes } = readRouteComponentIds();

if (registry) {
  const allSpecs = registry.getAllGuideSpecs();
  const readySpecs = registry.getReadyGuideSpecs();
  const ids = new Set();
  const paths = new Set();

  assert(Array.isArray(allSpecs), 'guideRegistry.js: getAllGuideSpecs() must return an array');
  assert(Array.isArray(readySpecs), 'guideRegistry.js: getReadyGuideSpecs() must return an array');

  allSpecs.forEach(spec => {
    assert(spec.id, 'guideRegistry.js: a guide spec is missing id');
    assert(spec.path, `guideRegistry.js:${spec.id || 'unknown'}: path is missing`);
    assert(spec.className, `guideRegistry.js:${spec.id || 'unknown'}: className is missing`);
    assert(spec.spec, `guideRegistry.js:${spec.id || 'unknown'}: spec is missing`);

    if (spec.id) {
      assert(!ids.has(spec.id), `guideRegistry.js:${spec.id}: duplicate id`);
      ids.add(spec.id);
    }

    if (spec.path) {
      assert(spec.path.startsWith('/guide/'), `guideRegistry.js:${spec.id}: path must start with /guide/`);
      assert(!paths.has(spec.path), `guideRegistry.js:${spec.id}: duplicate path ${spec.path}`);
      paths.add(spec.path);
    }
  });

  readySpecs.forEach(spec => {
    assert(componentIds.has(spec.id), `App.js: ready guide ${spec.id} has no component mapping`);
  });

  componentIds.forEach(id => {
    if (!readySpecs.some(spec => spec.id === id)) {
      warnings.push(`App.js: component mapping ${id} is not marked ready in guideRegistry.js`);
    }
  });

  explicitGuideRoutes.forEach(route => {
    if (paths.has(route)) {
      errors.push(`App.js: ${route} is hardcoded even though guideRegistry.js owns guide routes`);
    }
  });
}

if (warnings.length) {
  console.warn(`Guide registry validation warnings (${warnings.length}):`);
  warnings.forEach(warning => console.warn(`  - ${warning}`));
}

if (errors.length) {
  console.error(`Guide registry validation failed (${errors.length}):`);
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

console.log('Guide registry validation passed');
