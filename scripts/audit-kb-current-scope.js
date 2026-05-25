#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(SITE_ROOT, '..');
const KB_ROOT = path.join(PROJECT_ROOT, 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base');
const DATA_DIR = path.join(SITE_ROOT, 'src', 'data');
const SRC_DIR = path.join(SITE_ROOT, 'src');
const REPORT_DIR = path.join(SITE_ROOT, 'audit-reports');
const ATOMIC_FOLDERS = new Set(['Skills', 'Talents', 'Hero-Talents', 'Buffs', 'Procs']);
const PLACEHOLDER_ICONS = new Set(['inv_elemental_mote_mana', 'inv_misc_questionmark']);
const args = process.argv.slice(2);
const ONLINE = !args.includes('--offline');
const VERBOSE = args.includes('--verbose');
const FETCH_TIMEOUT_MS = 15000;

const specs = [
  spec('01-죽음의기사', '혈기', 'Blood Death Knight', 'death-knight', 'blood', 'tank', 'blood-death-knight'),
  spec('01-죽음의기사', '냉기', 'Frost Death Knight', 'death-knight', 'frost', 'dps', 'frost-death-knight'),
  spec('01-죽음의기사', '부정', 'Unholy Death Knight', 'death-knight', 'unholy', 'dps', 'unholy-death-knight'),
  spec('02-악마사냥꾼', '파멸', 'Havoc Demon Hunter', 'demon-hunter', 'havoc', 'dps', 'havoc-demon-hunter'),
  spec('02-악마사냥꾼', '복수', 'Vengeance Demon Hunter', 'demon-hunter', 'vengeance', 'tank', 'vengeance-demon-hunter'),
  spec('02-악마사냥꾼', '포식', 'Devourer Demon Hunter', 'demon-hunter', 'devourer', 'dps', 'devourer-demon-hunter'),
  spec('03-드루이드', '조화', 'Balance Druid', 'druid', 'balance', 'dps', 'balance-druid'),
  spec('03-드루이드', '야성', 'Feral Druid', 'druid', 'feral', 'dps', 'feral-druid'),
  spec('03-드루이드', '수호', 'Guardian Druid', 'druid', 'guardian', 'tank', 'guardian-druid'),
  spec('03-드루이드', '회복', 'Restoration Druid', 'druid', 'restoration', 'healer', 'restoration-druid'),
  spec('04-기원사', '황폐', 'Devastation Evoker', 'evoker', 'devastation', 'dps', 'devastation-evoker'),
  spec('04-기원사', '증강', 'Augmentation Evoker', 'evoker', 'augmentation', 'dps', 'augmentation-evoker'),
  spec('04-기원사', '보존', 'Preservation Evoker', 'evoker', 'preservation', 'healer', 'preservation-evoker'),
  spec('05-사냥꾼', '야수', 'Beast Mastery Hunter', 'hunter', 'beast-mastery', 'dps', 'beast-mastery-hunter'),
  spec('05-사냥꾼', '사격', 'Marksmanship Hunter', 'hunter', 'marksmanship', 'dps', 'marksmanship-hunter'),
  spec('05-사냥꾼', '생존', 'Survival Hunter', 'hunter', 'survival', 'dps', 'survival-hunter'),
  spec('06-마법사', '비전', 'Arcane Mage', 'mage', 'arcane', 'dps', 'arcane-mage'),
  spec('06-마법사', '화염', 'Fire Mage', 'mage', 'fire', 'dps', 'fire-mage'),
  spec('06-마법사', '냉기', 'Frost Mage', 'mage', 'frost', 'dps', 'frost-mage'),
  spec('07-수도사', '양조', 'Brewmaster Monk', 'monk', 'brewmaster', 'tank', 'brewmaster-monk'),
  spec('07-수도사', '풍운', 'Windwalker Monk', 'monk', 'windwalker', 'dps', 'windwalker-monk'),
  spec('07-수도사', '운무', 'Mistweaver Monk', 'monk', 'mistweaver', 'healer', 'mistweaver-monk'),
  spec('08-성기사', '신성', 'Holy Paladin', 'paladin', 'holy', 'healer', 'holy-paladin'),
  spec('08-성기사', '보호', 'Protection Paladin', 'paladin', 'protection', 'tank', 'protection-paladin'),
  spec('08-성기사', '징벌', 'Retribution Paladin', 'paladin', 'retribution', 'dps', 'retribution-paladin'),
  spec('09-사제', '수양', 'Discipline Priest', 'priest', 'discipline', 'healer', 'discipline-priest'),
  spec('09-사제', '신성', 'Holy Priest', 'priest', 'holy', 'healer', 'holy-priest'),
  spec('09-사제', '암흑', 'Shadow Priest', 'priest', 'shadow', 'dps', 'shadow-priest'),
  spec('10-도적', '암살', 'Assassination Rogue', 'rogue', 'assassination', 'dps', 'assassination-rogue'),
  spec('10-도적', '무법', 'Outlaw Rogue', 'rogue', 'outlaw', 'dps', 'outlaw-rogue'),
  spec('10-도적', '잠행', 'Subtlety Rogue', 'rogue', 'subtlety', 'dps', 'subtlety-rogue'),
  spec('11-주술사', '정기', 'Elemental Shaman', 'shaman', 'elemental', 'dps', 'elemental-shaman'),
  spec('11-주술사', '고양', 'Enhancement Shaman', 'shaman', 'enhancement', 'dps', 'enhancement-shaman'),
  spec('11-주술사', '복원', 'Restoration Shaman', 'shaman', 'restoration', 'healer', 'restoration-shaman'),
  spec('12-흑마법사', '고통', 'Affliction Warlock', 'warlock', 'affliction', 'dps', 'affliction-warlock'),
  spec('12-흑마법사', '악마', 'Demonology Warlock', 'warlock', 'demonology', 'dps', 'demonology-warlock'),
  spec('12-흑마법사', '파괴', 'Destruction Warlock', 'warlock', 'destruction', 'dps', 'destruction-warlock'),
  spec('13-전사', '무기', 'Arms Warrior', 'warrior', 'arms', 'dps', 'arms-warrior'),
  spec('13-전사', '분노', 'Fury Warrior', 'warrior', 'fury', 'dps', 'fury-warrior'),
  spec('13-전사', '방어', 'Protection Warrior', 'warrior', 'protection', 'tank', 'protection-warrior'),
];

function spec(classDir, specDir, label, wowheadClass, wowheadSpec, role, icySlug) {
  const wowheadRole = role === 'healer' ? 'healer' : role;
  const icyRole = role === 'healer' ? 'healing' : role;
  return {
    classDir,
    specDir,
    label,
    root: path.join(KB_ROOT, classDir, specDir),
    urls: [
      `https://www.wowhead.com/guide/classes/${wowheadClass}/${wowheadSpec}/abilities-talents-pve-${wowheadRole}`,
      `https://www.wowhead.com/guide/classes/${wowheadClass}/${wowheadSpec}/talent-builds-pve-${wowheadRole}`,
      `https://www.wowhead.com/guide/classes/${wowheadClass}/${wowheadSpec}/rotation-cooldowns-pve-${wowheadRole}`,
      `https://www.icy-veins.com/wow/${icySlug}-pve-${icyRole}-rotation-cooldowns-abilities`,
    ],
  };
}

function walkFiles(root, predicate, output = []) {
  if (!fs.existsSync(root)) return output;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) walkFiles(fullPath, predicate, output);
    else if (predicate(fullPath)) output.push(fullPath);
  }
  return output;
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

function rel(filePath) {
  return path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
}

function normalizeReportPath(filePath) {
  return String(filePath || '').replace(/\\/g, '/');
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9가-힣]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHeadingName(content) {
  const heading = content.match(/^#\s+(.+)$/m);
  if (!heading) return {};
  const text = heading[1].trim();
  const pair = text.match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (!pair) return { nameKr: text };
  return { nameKr: pair[1].trim(), nameEn: pair[2].trim() };
}

function stripFrontmatter(content) {
  return String(content || '').replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---/, '');
}

function readSkillsJson() {
  const filePath = path.join(DATA_DIR, 'kb-skills.json');
  if (!fs.existsSync(filePath)) return { skills: {} };
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readSynergiesJson() {
  const filePath = path.join(DATA_DIR, 'kb-synergies.json');
  if (!fs.existsSync(filePath)) return { synergies: {} };
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fetchUrl(url) {
  return new Promise(resolve => {
    const request = https.get(url, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        body += chunk;
      });
      response.on('end', () => {
        resolve({
          url,
          ok: response.statusCode >= 200 && response.statusCode < 300,
          status: response.statusCode,
          text: body,
        });
      });
    });

    request.on('error', error => resolve({ url, ok: false, status: 0, error: error.message, text: '' }));
    request.setTimeout(FETCH_TIMEOUT_MS, () => {
      request.destroy();
      resolve({ url, ok: false, status: 0, error: `timeout ${FETCH_TIMEOUT_MS}ms`, text: '' });
    });
  });
}

async function buildSourceCorpus(specInfo, issues) {
  if (!ONLINE) return '';
  const results = [];
  for (const url of specInfo.urls) {
    const result = await fetchUrl(url);
    results.push(result);
    if (!result.ok) {
      issues.push({
        severity: 'warning',
        code: 'SOURCE_FETCH_FAILED',
        spec: specInfo.label,
        url,
        message: `Current source fetch failed (${result.status || result.error || 'unknown'}).`,
      });
    }
  }
  return stripHtml(results.filter(result => result.ok).map(result => result.text).join(' '));
}

function sourceMentionsNote(corpus, note) {
  if (!corpus) return true;
  const candidates = [
    note.id && `spell=${note.id}`,
    note.id && `/spell=${note.id}`,
    normalizeName(note.nameEn),
    normalizeName(note.nameKr),
  ].filter(value => value && String(value).length >= 3);

  return candidates.some(candidate => corpus.includes(candidate));
}

function collectKbNotes(specInfo) {
  return walkFiles(specInfo.root, isAtomicFile).map(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    const heading = extractHeadingName(content);
    return {
      filePath,
      file: rel(filePath),
      content,
      frontmatter,
      id: String(frontmatter.id || '').trim(),
      icon: String(frontmatter.icon || frontmatter.iconName || '').trim(),
      nameKr: frontmatter.name_kr || frontmatter.name || heading.nameKr || path.basename(filePath, '.md'),
      nameEn: frontmatter.name_en || frontmatter.englishName || heading.nameEn || '',
      type: frontmatter.type || frontmatter.skill_type || '',
      nonAtomic: frontmatter.non_atomic === 'true',
    };
  }).filter(note => !note.nonAtomic);
}

function auditGeneratedData(issues) {
  const skillsData = readSkillsJson();
  const synergiesData = readSynergiesJson();
  const skills = skillsData.skills || {};
  const synergies = synergiesData.synergies || {};
  const knownSkillIds = new Set(Object.keys(skills));
  const knownNames = new Set();

  Object.values(skills).forEach(skill => {
    [skill.name, skill.koreanName, skill.name_kr, skill.englishName, skill.name_en].filter(Boolean).forEach(name => {
      knownNames.add(normalizeName(name));
    });

    const kbPath = skill.source && skill.source.kbPath;
    if (kbPath && !fs.existsSync(path.join(PROJECT_ROOT, kbPath))) {
      issues.push({
        severity: 'error',
        code: 'GENERATED_SKILL_SOURCE_MISSING',
        file: 'src/data/kb-skills.json',
        spellId: skill.id,
        name: skill.koreanName || skill.name,
        message: `Generated skill points to a missing KB file: ${kbPath}`,
      });
    }
  });

  Object.values(synergies).forEach(synergy => {
    const participantIds = synergy.participantIds || synergy.participants || [];
    participantIds.forEach(participantId => {
      if (/^\d+$/.test(String(participantId)) && !knownSkillIds.has(String(participantId))) {
        issues.push({
          severity: 'error',
          code: 'SYNERGY_PARTICIPANT_NOT_IN_SKILLS',
          file: normalizeReportPath(synergy.source && synergy.source.kbPath),
          synergyId: synergy.id,
          participantId,
          message: `Synergy participant spell id is not present in generated skills: ${participantId}`,
        });
      }
    });

    const kbPath = synergy.source && synergy.source.kbPath;
    if (kbPath && !fs.existsSync(path.join(PROJECT_ROOT, kbPath))) {
      issues.push({
        severity: 'error',
        code: 'GENERATED_SYNERGY_SOURCE_MISSING',
        file: 'src/data/kb-synergies.json',
        synergyId: synergy.id,
        message: `Generated synergy points to a missing KB file: ${kbPath}`,
      });
    }
  });

  for (const filePath of walkFiles(SRC_DIR, candidate => candidate.endsWith('.js') || candidate.endsWith('.jsx'))) {
    const source = fs.readFileSync(filePath, 'utf8');
    for (const match of source.matchAll(/skillId:\s*['"](\d+)['"]/g)) {
      const spellId = match[1];
      if (!knownSkillIds.has(spellId)) {
        issues.push({
          severity: 'error',
          code: 'JS_SKILL_ID_NOT_IN_KB',
          file: rel(filePath),
          spellId,
          message: `JS references a skillId that is not present in generated KB data: ${spellId}`,
        });
      }
    }

    for (const match of source.matchAll(/findSkillByNames\([^[]*\[([^\]]+)\]/g)) {
      const names = [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map(item => normalizeName(item[1]));
      if (names.length && !names.some(name => knownNames.has(name))) {
        issues.push({
          severity: 'warning',
          code: 'JS_FIND_SKILL_NAMES_NOT_IN_KB',
          file: rel(filePath),
          names,
          message: `JS findSkillByNames candidates are all absent from generated KB data.`,
        });
      }
    }
  }
}

function auditSyncState(issues) {
  const syncFiles = walkFiles(KB_ROOT, filePath => path.basename(filePath) === '_sync-state.json');
  for (const filePath of syncFiles) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      issues.push({
        severity: 'error',
        code: 'SYNC_STATE_INVALID_JSON',
        file: rel(filePath),
        message: error.message,
      });
      continue;
    }

    const specRoot = path.dirname(filePath);
    const canonicalEntries = {
      ...(data.canonical || {}),
      ...(data.canonicalNotes || {}),
    };

    for (const [id, notePath] of Object.entries(canonicalEntries)) {
      if (!/^\d+$/.test(String(id))) continue;
      const directTarget = path.resolve(specRoot, notePath);
      const classTarget = path.resolve(specRoot, '..', notePath);
      if (!fs.existsSync(directTarget) && !fs.existsSync(classTarget)) {
        issues.push({
          severity: 'error',
          code: 'SYNC_STATE_CANONICAL_NOTE_MISSING',
          file: rel(filePath),
          spellId: id,
          notePath,
          message: `canonicalNotes points to a missing note: ${notePath}`,
        });
      }
    }

    for (const synergyPath of data.synergies || []) {
      const target = path.resolve(specRoot, synergyPath);
      if (!fs.existsSync(target)) {
        issues.push({
          severity: 'error',
          code: 'SYNC_STATE_SYNERGY_MISSING',
          file: rel(filePath),
          notePath: synergyPath,
          message: `synergies points to a missing note: ${synergyPath}`,
        });
      }
    }
  }
}

function auditNoteMetadata(specInfo, notes, corpus, issues) {
  for (const note of notes) {
    const icon = note.icon.toLowerCase();
    if (!note.id) {
      issues.push({
        severity: 'warning',
        code: 'NOTE_MISSING_ID',
        spec: specInfo.label,
        file: note.file,
        name: note.nameKr,
        message: 'Atomic note has no spell id.',
      });
    }

    if (PLACEHOLDER_ICONS.has(icon)) {
      issues.push({
        severity: 'error',
        code: 'PLACEHOLDER_ICON',
        spec: specInfo.label,
        file: note.file,
        spellId: note.id,
        name: note.nameKr,
        message: `Placeholder icon is still present: ${icon}`,
      });
    }

    const reviewText = stripFrontmatter(note.content);
    if (/deleted|deprecated|retired|removed|legacy[-\s]?(only|data|version)|삭제된|삭제|제거된|폐기|구식|사용\s*불가|더\s*이상/i.test(reviewText)) {
      issues.push({
        severity: 'warning',
        code: 'LEGACY_WORDING_IN_CURRENT_KB',
        spec: specInfo.label,
        file: note.file,
        spellId: note.id,
        name: note.nameKr,
        message: 'Current KB note contains legacy/removal wording and needs manual review.',
      });
    }

    if (!sourceMentionsNote(corpus, note)) {
      issues.push({
        severity: 'review',
        code: 'NOT_MENTIONED_IN_CURRENT_GUIDE_SOURCES',
        spec: specInfo.label,
        file: note.file,
        spellId: note.id,
        name: note.nameKr,
        nameEn: note.nameEn,
        message: 'Spell/talent note was not found by id or name in fetched current Wowhead/Icy guide pages.',
      });
    }
  }
}

async function main() {
  const issues = [];
  const perSpec = [];

  auditGeneratedData(issues);
  auditSyncState(issues);

  for (const specInfo of specs) {
    if (!fs.existsSync(specInfo.root)) {
      issues.push({
        severity: 'error',
        code: 'SPEC_ROOT_MISSING',
        spec: specInfo.label,
        file: rel(specInfo.root),
        message: 'Expected spec KB folder is missing.',
      });
      continue;
    }

    const notes = collectKbNotes(specInfo);
    const before = issues.length;
    const corpus = await buildSourceCorpus(specInfo, issues);
    auditNoteMetadata(specInfo, notes, corpus, issues);
    perSpec.push({
      spec: specInfo.label,
      notes: notes.length,
      issues: issues.length - before,
      urls: specInfo.urls,
    });

    if (VERBOSE) {
      console.log(`${specInfo.label}: notes=${notes.length}, issues=${issues.length - before}`);
    }
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const report = {
    timestamp: new Date().toISOString(),
    online: ONLINE,
    sources: 'Wowhead current guide pages, Icy Veins current rotation pages, local KB/generated data/source code',
    summary: {
      totalIssues: issues.length,
      errors: issues.filter(issue => issue.severity === 'error').length,
      warnings: issues.filter(issue => issue.severity === 'warning').length,
      review: issues.filter(issue => issue.severity === 'review').length,
    },
    perSpec,
    issues,
  };

  const reportPath = path.join(REPORT_DIR, 'kb-current-scope-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\nKB current-scope audit');
  console.log(`  online sources: ${ONLINE ? 'on' : 'off'}`);
  console.log(`  specs: ${perSpec.length}`);
  console.log(`  issues: ${report.summary.totalIssues}`);
  console.log(`  errors: ${report.summary.errors}`);
  console.log(`  warnings: ${report.summary.warnings}`);
  console.log(`  review: ${report.summary.review}`);
  console.log(`  report: ${reportPath}`);

  const important = issues.filter(issue => issue.severity === 'error' || issue.code === 'LEGACY_WORDING_IN_CURRENT_KB').slice(0, 40);
  if (important.length) {
    console.log('\nHigh-priority findings:');
    important.forEach(issue => {
      console.log(`  - [${issue.severity}] ${issue.code} ${issue.file || issue.spec || ''} ${issue.spellId || ''} ${issue.name || ''}`);
    });
  }

  if (report.summary.errors > 0) process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
