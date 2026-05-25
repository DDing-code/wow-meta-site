#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(SITE_ROOT, '..');
const KNOWLEDGE_ROOT = path.join(PROJECT_ROOT, 'WoW-Meta-Knowledge');
const REQUIRED_KB_SEGMENT = '08-직업별-Knowledge-Base';
const KB_DIR = fs.existsSync(KNOWLEDGE_ROOT)
  ? fs.readdirSync(KNOWLEDGE_ROOT).find(name => name.startsWith('08-'))
  : '';
const KB_ROOT = KB_DIR ? path.join(KNOWLEDGE_ROOT, KB_DIR) : '';

const args = process.argv.slice(2);
const STRICT_MODE = args.includes('--strict');
const VERBOSE = args.includes('--verbose');
const ATOMIC_FOLDERS = new Set(['Skills', 'Talents', 'Hero-Talents', 'Synergies']);

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

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  return match[1].split(/\r?\n/).reduce((data, line) => {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) return data;
    data[pair[1]] = pair[2].trim().replace(/^['"]|['"]$/g, '');
    return data;
  }, {});
}

function hasHangul(value) {
  return /[\u3131-\uD79D]/.test(String(value || ''));
}

function hasMojibake(value) {
  return /[�]|(?:\?[가-힣])|(?:[ìíë][\x80-\xBF])/.test(String(value || ''));
}

function classifyFile(filePath) {
  const parts = filePath.split(path.sep);
  return {
    className: parts.find(part => /^\d{2}-/.test(part)) || 'unknown',
    scope: parts[parts.findIndex(part => /^\d{2}-/.test(part)) + 1] || 'unknown',
    bucket: parts.find(part => ATOMIC_FOLDERS.has(part)) || 'unknown',
  };
}

function validateKbFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatter = parseFrontmatter(content);
  const heading = (content.match(/^#\s+(.+)$/m) || [])[1] || '';
  const displayName = frontmatter.name || frontmatter.koreanName || heading;
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  const context = classifyFile(filePath);
  const errors = [];
  const warnings = [];

  if (!displayName || !hasHangul(displayName)) {
    errors.push({
      file: relativePath,
      issue: 'MISSING_KOREAN_NAME',
      message: 'KB 원자 노트에 공식 한국어 이름이 없습니다.',
      ...context,
    });
  }

  if (hasMojibake(displayName) || hasMojibake(content.slice(0, 600))) {
    errors.push({
      file: relativePath,
      issue: 'ENCODING_ARTIFACT',
      message: '깨진 인코딩 문자열이 감지되었습니다.',
      ...context,
    });
  }

  if (frontmatter.englishName && !frontmatter.wowheadUrl && !frontmatter.sourceUrl) {
    warnings.push({
      file: relativePath,
      issue: 'ENGLISH_NAME_WITHOUT_SOURCE_URL',
      message: '영문명이 있는 항목은 Wowhead 출처 URL을 함께 갖는 것이 좋습니다.',
      ...context,
    });
  }

  return { errors, warnings };
}

function main() {
  if (!KB_ROOT || !fs.existsSync(KB_ROOT)) {
    const report = {
      timestamp: new Date().toISOString(),
      strict: STRICT_MODE,
      skipped: true,
      reason: 'KB root is not available in this environment. Checked-in generated JSON files are used for deployment.',
      kbRoot: KB_ROOT || path.join(KNOWLEDGE_ROOT, REQUIRED_KB_SEGMENT),
      files: 0,
      errors: [],
      warnings: [],
    };
    const reportPath = path.join(SITE_ROOT, 'translation-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

    console.log('\nWoW guide translation validation');
    console.log('  skipped: KB root is not available in this environment');
    console.log(`  report: ${reportPath}`);
    console.log('\nTranslation validation passed');
    return;
  }

  const files = walkFiles(KB_ROOT, filePath => {
    if (!filePath.endsWith('.md')) return false;
    return filePath.split(path.sep).some(part => ATOMIC_FOLDERS.has(part));
  });

  const report = {
    timestamp: new Date().toISOString(),
    strict: STRICT_MODE,
    kbRoot: KB_ROOT,
    files: files.length,
    errors: [],
    warnings: [],
  };

  for (const filePath of files) {
    const result = validateKbFile(filePath);
    report.errors.push(...result.errors);
    report.warnings.push(...result.warnings);
    if (VERBOSE && (result.errors.length || result.warnings.length)) {
      console.log(path.relative(PROJECT_ROOT, filePath));
    }
  }

  const reportPath = path.join(SITE_ROOT, 'translation-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\nWoW guide translation validation');
  console.log(`  strict: ${STRICT_MODE ? 'on' : 'off'}`);
  console.log(`  kb root: ${KB_ROOT}`);
  console.log(`  files: ${report.files}`);
  console.log(`  errors: ${report.errors.length}`);
  console.log(`  warnings: ${report.warnings.length}`);

  if (report.errors.length) {
    console.log('\nErrors:');
    report.errors.slice(0, 30).forEach(error => {
      console.log(`  - ${error.file} (${error.issue})`);
    });
  }

  if (report.warnings.length && VERBOSE) {
    console.log('\nWarnings:');
    report.warnings.slice(0, 30).forEach(warning => {
      console.log(`  - ${warning.file} (${warning.issue})`);
    });
  }

  console.log(`\nReport saved: ${reportPath}`);

  if (report.errors.length || (STRICT_MODE && report.warnings.length)) {
    console.error('\nTranslation validation failed');
    process.exit(1);
  }

  console.log('\nTranslation validation passed');
}

main();
