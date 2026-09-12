#!/usr/bin/env node
/**
 * Site-local KB sync wrapper.
 *
 * The canonical KB builder lives at C:/wowmeta/scripts/kb-sync.
 * Keep this wrapper so existing wow-meta-site npm scripts continue to work
 * without carrying a second sync implementation.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const watchMode = args.includes('--watch');
const passThroughArgs = args.filter(arg => arg !== '--watch');

for (const [source, output] of [
  ['08-성기사/징벌/Meta/log-coiled-altar.json', 'retributionCoiledAltarReport.json'],
  ['12-흑마법사/악마/Meta/log-ragereaver-heroic.json', 'ragereaverHeroicReport.json'],
  ['04-기원사/보존/Meta/log-chaeyong-mythic.json', 'chaeyongMythicReport.json'],
]) {
  const reportSource = path.join(repoRoot, 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', source);
  if (fs.existsSync(reportSource)) {
    JSON.parse(fs.readFileSync(reportSource, 'utf8'));
    fs.copyFileSync(reportSource, path.join(__dirname, '..', 'src', 'data', output));
  }
}

const targetScript = watchMode
  ? path.join(repoRoot, 'scripts', 'kb-sync', 'kb-skill-watcher.js')
  : path.join(repoRoot, 'scripts', 'kb-sync', 'kb-to-skill-json.js');

if (!fs.existsSync(targetScript)) {
  console.warn('[sync-kb] Canonical KB builder not found.');
  console.warn(`[sync-kb] Expected: ${targetScript}`);
  console.warn('[sync-kb] Keeping the checked-in generated JSON files.');
  process.exit(0);
}

const result = spawnSync(process.execPath, [targetScript, ...passThroughArgs], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
