#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const LOG_REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'logReportRegistry.js');
const LOG_SIDEBAR_PATH = path.join(SITE_ROOT, 'src', 'components', 'LogReportSidebarList.js');
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

function loadLogRegistry() {
  const source = fs.readFileSync(LOG_REGISTRY_PATH, 'utf8');
  const executable = source
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function');

  return new Function(`${executable}\nreturn { logReports };`)();
}

function readReportRoutes() {
  const appSource = fs.readFileSync(APP_PATH, 'utf8');
  const componentFiles = new Map();
  const reportRoutes = new Map();

  for (const match of appSource.matchAll(/import\s+([^;]+?)\s+from\s+['"](\.\/pages\/[^'"]+)['"]/g)) {
    for (const component of match[1].match(/[A-Z][A-Za-z0-9_]*/g) || []) {
      componentFiles.set(component, path.resolve(SITE_ROOT, 'src', match[2]));
    }
  }

  for (const match of appSource.matchAll(/<Route\s+path=["']([^"']+)["']\s+element=\{<([A-Za-z0-9_]+)\s*\/>\}/g)) {
    reportRoutes.set(match[1], match[2]);
  }

  return { componentFiles, reportRoutes };
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

let logRegistry;
try {
  logRegistry = loadLogRegistry();
} catch (error) {
  errors.push(`logReportRegistry.js: failed to evaluate registry (${error.message})`);
}

const { componentIds, explicitGuideRoutes } = readRouteComponentIds();
const { componentFiles, reportRoutes } = readReportRoutes();

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

if (registry && logRegistry) {
  const guideIds = new Set(registry.getAllGuideSpecs().map(spec => spec.id));
  const reportIds = new Set();
  const reportPaths = new Set();
  const reports = logRegistry.logReports;

  assert(Array.isArray(reports), 'logReportRegistry.js: logReports must be an array');

  (Array.isArray(reports) ? reports : []).forEach(report => {
    assert(report.id, 'logReportRegistry.js: a report is missing id');
    assert(report.guideId, `logReportRegistry.js:${report.id || 'unknown'}: guideId is missing`);
    assert(report.title, `logReportRegistry.js:${report.id || 'unknown'}: title is missing`);
    assert(report.summary, `logReportRegistry.js:${report.id || 'unknown'}: summary is missing`);
    assert(report.encounter, `logReportRegistry.js:${report.id || 'unknown'}: encounter is missing`);
    assert(report.fights, `logReportRegistry.js:${report.id || 'unknown'}: fights is missing`);
    assert(report.subject, `logReportRegistry.js:${report.id || 'unknown'}: subject is missing`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(report.date || ''), `logReportRegistry.js:${report.id || 'unknown'}: date must use YYYY-MM-DD`);
    assert(report.path?.startsWith('/guide/'), `logReportRegistry.js:${report.id || 'unknown'}: path must start with /guide/`);
    assert(guideIds.has(report.guideId), `logReportRegistry.js:${report.id || 'unknown'}: unknown guideId ${report.guideId}`);

    if (report.id) {
      assert(!reportIds.has(report.id), `logReportRegistry.js:${report.id}: duplicate id`);
      reportIds.add(report.id);
    }

    if (!report.path) return;
    assert(!reportPaths.has(report.path), `logReportRegistry.js:${report.id}: duplicate path ${report.path}`);
    reportPaths.add(report.path);

    const component = reportRoutes.get(report.path);
    assert(component, `App.js: log report ${report.id} has no route for ${report.path}`);
    if (!component) return;

    const componentPath = componentFiles.get(component);
    assert(componentPath && fs.existsSync(componentPath), `App.js: log report component ${component} has no readable page file`);
    if (!componentPath || !fs.existsSync(componentPath)) return;

    const componentSource = fs.readFileSync(componentPath, 'utf8');
    assert(/<LogReportSidebarList\s*\/>/.test(componentSource), `${path.basename(componentPath)}: log report page must render LogReportSidebarList`);
  });

  assert(fs.existsSync(LOG_SIDEBAR_PATH), 'LogReportSidebarList.js is missing');
  if (fs.existsSync(LOG_SIDEBAR_PATH)) {
    const sidebarSource = fs.readFileSync(LOG_SIDEBAR_PATH, 'utf8');
    assert(sidebarSource.includes('logReports') && sidebarSource.includes('report.path'), 'LogReportSidebarList.js must render paths from logReportRegistry.js');
  }
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

console.log('Guide and log registry validation passed');
