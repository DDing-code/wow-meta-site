#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(SITE_ROOT, '..');
const KNOWLEDGE_ROOT = path.join(PROJECT_ROOT, 'WoW-Meta-Knowledge');
const DATA_DIR = path.join(SITE_ROOT, 'src', 'data');
const ATOMIC_FOLDERS = new Set(['Skills', 'Talents', 'Hero-Talents', 'Procs', 'Buffs']);
const PLACEHOLDER_ICONS = new Set([
  'inv_elemental_mote_mana',
  'inv_misc_questionmark',
]);

const args = process.argv.slice(2);
const ONLINE = args.includes('--online');
const VERBOSE = args.includes('--verbose');
const STRICT_METADATA = args.includes('--strict-metadata');
const STRICT_LINKS = args.includes('--strict-links');
const specArgIndex = args.indexOf('--spec');
const specFilter = specArgIndex >= 0 ? normalizePath(args[specArgIndex + 1] || '') : '';

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/').toLowerCase();
}

function walkFiles(root, predicate, output = []) {
  if (!fs.existsSync(root)) return output;

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, output);
    } else if (predicate(fullPath)) {
      output.push(fullPath);
    }
  }

  return output;
}

function getKbRoot() {
  if (!fs.existsSync(KNOWLEDGE_ROOT)) return '';
  const dir = fs.readdirSync(KNOWLEDGE_ROOT).find(name => name.startsWith('08-'));
  return dir ? path.join(KNOWLEDGE_ROOT, dir) : '';
}

function parseFrontmatter(content) {
  const match = content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  return match[1].split(/\r?\n/).reduce((data, line) => {
    const pair = line.match(/^\s*([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) return data;
    data[pair[1]] = pair[2].trim().replace(/^['"]|['"]$/g, '');
    return data;
  }, {});
}

function isAtomicFile(filePath) {
  const parts = filePath.split(path.sep);
  return parts.some(part => ATOMIC_FOLDERS.has(part)) && filePath.endsWith('.md');
}

function fetchWowheadTooltip(spellId) {
  const url = `https://nether.wowhead.com/tooltip/spell/${spellId}?locale=1`;

  return new Promise((resolve, reject) => {
    const request = https
      .get(url, response => {
        let body = '';

        response.setEncoding('utf8');
        response.on('data', chunk => {
          body += chunk;
        });
        response.on('end', () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode}`));
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);

    request.setTimeout(10000, () => {
      request.destroy(new Error('Request timed out after 10000ms'));
    });
  });
}

function issue(filePath, code, message, extra = {}) {
  return {
    file: path.relative(PROJECT_ROOT, filePath),
    code,
    message,
    ...extra,
  };
}

function validateEntryOffline(filePath, frontmatter) {
  const errors = [];
  const warnings = [];
  const icon = String(frontmatter.icon || frontmatter.iconName || '').toLowerCase();

  if (!frontmatter.id) {
    const target = STRICT_METADATA ? errors : warnings;
    target.push(issue(filePath, 'MISSING_SPELL_ID', 'Atomic KB note has no spell id.'));
  }

  if (!icon) {
    const target = STRICT_METADATA ? errors : warnings;
    target.push(issue(filePath, 'MISSING_ICON', 'Atomic KB note has no icon.'));
  } else if (PLACEHOLDER_ICONS.has(icon) && frontmatter.allow_placeholder_icon !== 'true') {
    errors.push(issue(filePath, 'PLACEHOLDER_ICON', `Placeholder icon is not allowed: ${icon}`, {
      spellId: frontmatter.id,
      name: frontmatter.name_kr || frontmatter.name,
    }));
  }

  for (const [key, value] of Object.entries(frontmatter)) {
    if (key.startsWith('wowhead') && /www\.wowhead\.com\/guide\//.test(value) && !/www\.wowhead\.com\/ko\/guide\//.test(value)) {
      warnings.push(issue(filePath, 'NON_KOREAN_WOWHEAD_GUIDE', `${key} should use the /ko/ Wowhead guide URL when available.`, {
        url: value,
      }));
    }
  }

  return { errors, warnings };
}

async function validateEntryOnline(filePath, frontmatter) {
  const errors = [];
  const warnings = [];
  if (!frontmatter.id) return { errors, warnings };
  if (!/^\d+$/.test(String(frontmatter.id))) {
    errors.push(issue(filePath, 'NON_NUMERIC_SPELL_ID', `Atomic KB note id must be a numeric Wowhead spell id: ${frontmatter.id}`, {
      spellId: frontmatter.id,
      name: frontmatter.name_kr || frontmatter.name,
    }));
    return { errors, warnings };
  }

  let tooltip;
  try {
    tooltip = await fetchWowheadTooltip(frontmatter.id);
  } catch (error) {
    errors.push(issue(filePath, 'WOWHEAD_TOOLTIP_FETCH_FAILED', error.message, { spellId: frontmatter.id }));
    return { errors, warnings };
  }

  const localIcon = String(frontmatter.icon || frontmatter.iconName || '').toLowerCase();
  const officialIcon = String(tooltip.icon || '').toLowerCase();
  const localName = String(frontmatter.name_kr || frontmatter.name || '').trim();
  const officialName = String(tooltip.name || '').trim();

  if (officialIcon && localIcon && officialIcon !== localIcon) {
    errors.push(issue(filePath, 'WOWHEAD_ICON_MISMATCH', `Icon mismatch: local=${localIcon}, official=${officialIcon}`, {
      spellId: frontmatter.id,
      name: localName,
    }));
  }

  if (officialName && localName && officialName !== localName && frontmatter.allow_name_mismatch !== 'true') {
    errors.push(issue(filePath, 'WOWHEAD_NAME_MISMATCH', `Name mismatch: local=${localName}, official=${officialName}`, {
      spellId: frontmatter.id,
    }));
  }

  return { errors, warnings };
}

function validateGeneratedJsonFallback() {
  const filePath = path.join(DATA_DIR, 'kb-skills.json');
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(filePath)) {
    warnings.push({ file: path.relative(PROJECT_ROOT, filePath), code: 'GENERATED_JSON_MISSING', message: 'Generated skill JSON is missing.' });
    return { errors, warnings, files: 0 };
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const skills = data.skills || {};

  for (const [id, skill] of Object.entries(skills)) {
    const icon = String(skill.icon || skill.iconName || '').toLowerCase();
    if (PLACEHOLDER_ICONS.has(icon) && skill.allow_placeholder_icon !== true) {
      errors.push({
        file: 'src/data/kb-skills.json',
        code: 'PLACEHOLDER_ICON',
        message: `Placeholder icon is not allowed: ${icon}`,
        spellId: id,
        name: skill.koreanName || skill.name,
      });
    }
  }

  return { errors, warnings, files: Object.keys(skills).length };
}

function getSpecRootForFile(filePath) {
  const relative = path.relative(getKbRoot(), filePath);
  const parts = relative.split(path.sep);
  if (parts.length < 2) return path.dirname(filePath);
  return path.join(getKbRoot(), parts[0], parts[1]);
}

function resolveWikilinkTarget(filePath, target) {
  const normalized = String(target || '').trim().replace(/[\\/]+/g, path.sep);
  const firstSegment = normalized.split(path.sep)[0];

  if (normalized.startsWith('08-')) {
    return path.join(KNOWLEDGE_ROOT, normalized + '.md');
  }

  if (normalized.startsWith(`.${path.sep}`) || normalized.startsWith(`..${path.sep}`)) {
    return path.resolve(path.dirname(filePath), normalized + '.md');
  }

  if (['Skills', 'Talents', 'Hero-Talents', 'Synergies', 'Meta', 'Buffs', 'Procs'].includes(firstSegment)) {
    return path.join(getSpecRootForFile(filePath), normalized + '.md');
  }

  return path.join(path.dirname(filePath), normalized + '.md');
}

function normalizeNoteTitle(value) {
  return path.basename(String(value || ''), '.md').replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
}

function findLooseWikilinkTarget(filePath, target) {
  const normalized = String(target || '').trim();
  if (!normalized || /[\\/]/.test(normalized)) return '';

  for (const searchRoot of [getSpecRootForFile(filePath), path.dirname(getSpecRootForFile(filePath))]) {
    const expected = normalizeNoteTitle(normalized);
    const matches = walkFiles(searchRoot, candidate => candidate.endsWith('.md'))
      .filter(candidate => normalizeNoteTitle(candidate) === expected);

    if (matches.length === 1) return matches[0];
  }

  return '';
}

function validateWikilinkIntegrity(kbRoot) {
  const errors = [];
  const files = walkFiles(kbRoot, filePath => {
    if (!filePath.endsWith('.md')) return false;
    if (!specFilter) return true;
    return normalizePath(filePath).includes(specFilter);
  });

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g);

    for (const match of matches) {
      const target = String(match[1] || '').trim();
      if (!target || /^https?:\/\//i.test(target)) continue;

      const targetPath = resolveWikilinkTarget(filePath, target);
      const looseTargetPath = fs.existsSync(targetPath) ? targetPath : findLooseWikilinkTarget(filePath, target);
      if (!looseTargetPath || !fs.existsSync(looseTargetPath)) {
        errors.push(issue(filePath, 'BROKEN_KB_WIKILINK', `KB wikilink target does not exist: ${target}`, {
          strict: STRICT_LINKS,
        }));
      }
    }
  }

  return { errors, files: files.length };
}

async function main() {
  const errors = [];
  const warnings = [];
  const kbRoot = getKbRoot();
  let checkedFiles = 0;

  if (!kbRoot || !fs.existsSync(kbRoot)) {
    const result = validateGeneratedJsonFallback();
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    checkedFiles = result.files;
  } else {
    const linkIntegrity = validateWikilinkIntegrity(kbRoot);
    if (STRICT_LINKS) {
      errors.push(...linkIntegrity.errors);
    } else {
      warnings.push(...linkIntegrity.errors);
    }

    const files = walkFiles(kbRoot, filePath => {
      if (!isAtomicFile(filePath)) return false;
      if (!specFilter) return true;
      return normalizePath(filePath).includes(specFilter);
    });

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      if (frontmatter.non_atomic === 'true') {
        continue;
      }
      const offline = validateEntryOffline(filePath, frontmatter);
      errors.push(...offline.errors);
      warnings.push(...offline.warnings);

      if (ONLINE) {
        const online = await validateEntryOnline(filePath, frontmatter);
        errors.push(...online.errors);
        warnings.push(...online.warnings);
      }

      checkedFiles += 1;
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    online: ONLINE,
    specFilter: specFilter || null,
    files: checkedFiles,
    errors,
    warnings,
  };
  const reportPath = path.join(SITE_ROOT, 'official-tooltip-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\nKB official tooltip validation');
  console.log(`  online: ${ONLINE ? 'on' : 'off'}`);
  console.log(`  files: ${checkedFiles}`);
  console.log(`  errors: ${errors.length}`);
  console.log(`  warnings: ${warnings.length}`);
  console.log(`  report: ${reportPath}`);

  if (errors.length) {
    console.log('\nErrors:');
    errors.slice(0, 30).forEach(error => {
      console.log(`  - ${error.file} (${error.code}) ${error.message}`);
    });
  }

  if (VERBOSE && warnings.length) {
    console.log('\nWarnings:');
    warnings.slice(0, 30).forEach(warning => {
      console.log(`  - ${warning.file} (${warning.code}) ${warning.message}`);
    });
  }

  if (errors.length) {
    process.exit(1);
  }

  console.log('\nKB official tooltip validation passed');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
