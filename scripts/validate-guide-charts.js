#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const GUIDE_DETAIL_PATH = path.join(SITE_ROOT, 'src', 'pages', 'GuideDetailPage.js');
const GUIDE_REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');

const ALLOWED_SPECIALIST_CHARTS = new Set(['uptime', 'cooldown', 'defensive', 'resource']);
const MIN_UPTIME_ROWS = 6;

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8');
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

function firstChartId(branchBody) {
  return branchBody.match(/\bid:\s*'([^']+)'/)?.[1] || null;
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
  const guideIds = parseGuideIds(guideRegistrySource);
  const planBody = extractFunctionBody(guideDetailSource, 'getInlineChartPlan');
  const uptimeBody = extractFunctionBody(guideDetailSource, 'getUptimeRows');
  const planBranches = extractGuideBranches(planBody);
  const uptimeBranches = extractGuideBranches(uptimeBody);
  const planBranchMap = new Map(planBranches.map(branch => [branch.id, branch]));
  const uptimeBranchMap = new Map(uptimeBranches.map(branch => [branch.id, branch]));

  assert(guideIds.length === 40, `guideRegistry should expose 40 specs, found ${guideIds.length}`);
  validateNoDuplicateBranches(planBranches, 'getInlineChartPlan');
  validateNoDuplicateBranches(uptimeBranches, 'getUptimeRows');

  for (const guideId of guideIds) {
    assert(planBranchMap.has(guideId), `getInlineChartPlan is missing a specialist chart branch for ${guideId}`);
  }

  const plannedUptimeIds = [];

  for (const branch of planBranches) {
    const chartId = firstChartId(branch.body);
    assert(chartId, `getInlineChartPlan branch for ${branch.id} does not declare a chart id`);
    assert(ALLOWED_SPECIALIST_CHARTS.has(chartId), `getInlineChartPlan branch for ${branch.id} uses unsupported chart id "${chartId}"`);
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
  }

  if (errors.length) {
    console.error(`Guide chart validation failed (${errors.length}):`);
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  console.log(`Guide chart validation passed: ${guideIds.length} specs, ${plannedUptimeIds.length} uptime timelines`);
}

main();
