#!/usr/bin/env node
/**
 * Compatibility entrypoint for the retired site-local KB builder.
 *
 * Site data generation is owned by the root canonical builder:
 * C:/wowmeta/scripts/kb-sync/kb-to-skill-json.js. This wrapper preserves old
 * commands while preventing a second parser from writing generated data.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const builder = path.join(repoRoot, 'scripts', 'kb-sync', 'kb-to-skill-json.js');

console.warn('[scripts/kb-build] Deprecated entrypoint. Delegating to root canonical KB builder.');

if (!fs.existsSync(builder)) {
  console.warn(`[scripts/kb-build] Canonical builder not found: ${builder}`);
  console.warn('[scripts/kb-build] Keeping the checked-in generated JSON files.');
  process.exit(0);
}

const result = spawnSync(process.execPath, [builder, ...process.argv.slice(2)], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
