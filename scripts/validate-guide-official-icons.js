#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const SKILLS_PATH = path.join(SITE_ROOT, 'src', 'data', 'kb-skills.json');
const REPORT_PATH = path.join(SITE_ROOT, 'guide-official-icon-validation-report.json');

const args = process.argv.slice(2);
const specArgIndex = args.indexOf('--spec');
const positionalSpec = args.find((arg, index) => (
  arg
  && !arg.startsWith('--')
  && !(specArgIndex >= 0 && index === specArgIndex + 1)
));
const specFilter = specArgIndex >= 0
  ? String(args[specArgIndex + 1] || '').trim()
  : String(positionalSpec || '').trim();
const strictName = args.includes('--strict-name');

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

function cleanText(value) {
  return String(value || '').trim();
}

function skillName(skill) {
  return skill?.koreanName || skill?.name || skill?.englishName || '';
}

function skillIcon(skill) {
  return cleanText(skill?.icon || skill?.iconName).toLowerCase();
}

function collectSkillRefs(value, ids = new Set()) {
  if (!value) return ids;

  if (Array.isArray(value)) {
    value.forEach(item => collectSkillRefs(item, ids));
    return ids;
  }

  if (typeof value !== 'object') return ids;

  Object.entries(value).forEach(([key, item]) => {
    if (/^(skillId|graphCenterSkillId)$/.test(key) || /SkillId$/.test(key)) {
      if (item) ids.add(String(item));
      return;
    }
    if (key === 'skillIds' && Array.isArray(item)) {
      item.filter(Boolean).forEach(skillId => ids.add(String(skillId)));
      return;
    }
    collectSkillRefs(item, ids);
  });

  return ids;
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

async function main() {
  const registry = loadSourceModule(REGISTRY_PATH, '{ getReadyGuideSpecs }');
  const manuscripts = loadSourceModule(MANUSCRIPT_PATH, 'guideManuscripts');
  const kbSkills = JSON.parse(read(SKILLS_PATH)).skills || {};
  const specs = registry.getReadyGuideSpecs()
    .filter(spec => !specFilter || spec.id === specFilter || spec.path.includes(specFilter));
  const errors = [];
  const warnings = [];
  const tooltipCache = new Map();

  if (!specs.length) {
    throw new Error(specFilter ? `No guide matched --spec ${specFilter}` : 'No ready guides found');
  }

  for (const spec of specs) {
    const manuscript = manuscripts[spec.id];
    if (!manuscript) {
      errors.push({ spec: spec.id, code: 'MISSING_MANUSCRIPT', message: 'Guide manuscript is missing.' });
      continue;
    }

    const extraSkills = new Map((manuscript.extraSkills || []).map(skill => [String(skill.id), skill]));
    const ids = [...collectSkillRefs(manuscript)].sort((a, b) => Number(a) - Number(b));

    for (const id of ids) {
      const skill = extraSkills.get(id) || kbSkills[id];
      if (!skill) {
        errors.push({ spec: spec.id, spellId: id, code: 'MISSING_SKILL', message: 'Referenced skill is not in KB or extraSkills.' });
        continue;
      }

      if (!/^\d+$/.test(id)) {
        errors.push({ spec: spec.id, spellId: id, code: 'NON_NUMERIC_SPELL_ID', message: 'Referenced skill id cannot build a Wowhead tooltip.' });
        continue;
      }

      let tooltip = tooltipCache.get(id);
      if (!tooltip) {
        try {
          tooltip = await fetchWowheadTooltip(id);
          tooltipCache.set(id, tooltip);
        } catch (error) {
          errors.push({ spec: spec.id, spellId: id, code: 'WOWHEAD_TOOLTIP_FETCH_FAILED', message: error.message });
          continue;
        }
      }

      const localIcon = skillIcon(skill);
      const officialIcon = cleanText(tooltip.icon).toLowerCase();
      const localName = cleanText(skillName(skill));
      const officialName = cleanText(tooltip.name);

      if (officialIcon && localIcon && officialIcon !== localIcon) {
        errors.push({
          spec: spec.id,
          spellId: id,
          code: 'WOWHEAD_ICON_MISMATCH',
          message: `Icon mismatch: local=${localIcon}, official=${officialIcon}`,
          localName,
          officialName,
        });
      }

      if (officialName && localName && officialName !== localName) {
        const target = strictName && skill.allow_name_mismatch !== true ? errors : warnings;
        target.push({
          spec: spec.id,
          spellId: id,
          code: 'WOWHEAD_NAME_MISMATCH',
          message: `Name mismatch: local=${localName}, official=${officialName}`,
          localIcon,
          officialIcon,
        });
      }
    }
  }

  const report = {
    online: true,
    specs: specs.map(spec => spec.id),
    checkedTooltips: tooltipCache.size,
    errors,
    warnings,
  };

  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log('\nGuide official icon validation');
  console.log(`  specs: ${specs.length}`);
  console.log(`  tooltips: ${tooltipCache.size}`);
  console.log(`  errors: ${errors.length}`);
  console.log(`  warnings: ${warnings.length}`);
  console.log(`  report: ${REPORT_PATH}`);

  if (errors.length) {
    errors.slice(0, 25).forEach(error => {
      console.error(`  [${error.code}] ${error.spec || ''} ${error.spellId || ''} ${error.message}`);
    });
    process.exit(1);
  }

  console.log('Guide official icon validation passed');
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
