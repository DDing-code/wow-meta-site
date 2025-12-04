#!/usr/bin/env node

/**
 * sync-md-to-js.js - Obsidian → JavaScript DB 역방향 동기화
 *
 * Purpose: Obsidian에서 편집한 스킬 노트를 JavaScript 데이터베이스로 동기화
 *
 * Workflow:
 * 1. WoW-Meta-Knowledge/01-스킬-DB/ 폴더 스캔
 * 2. 각 .md 파일의 YAML frontmatter 파싱
 * 3. tww-s3-complete-database-enhanced.json 업데이트
 * 4. 변경 사항 리포트 출력
 *
 * Input: WoW-Meta-Knowledge/01-스킬-DB/**/*.md
 * Output: database-builder/tww-s3-complete-database-enhanced.json
 */

import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROJECT_ROOT = path.resolve(process.cwd(), '../..');
const VAULT_ROOT = path.join(PROJECT_ROOT, 'WoW-Meta-Knowledge');
const SKILL_DB_FOLDER = path.join(VAULT_ROOT, '01-스킬-DB');
const JS_DB_PATH = path.join(PROJECT_ROOT, 'database-builder/tww-s3-complete-database-enhanced.json');
const BACKUP_PATH = path.join(PROJECT_ROOT, `database-builder/backups/tww-s3-backup-${Date.now()}.json`);

const CLASS_FOLDER_MAP = {
  'Warriors': 'WARRIOR',
  'Paladins': 'PALADIN',
  'Hunters': 'HUNTER',
  'Rogues': 'ROGUE',
  'Priests': 'PRIEST',
  'Shamans': 'SHAMAN',
  'Mages': 'MAGE',
  'Warlocks': 'WARLOCK',
  'Monks': 'MONK',
  'Druids': 'DRUID',
  'DemonHunters': 'DEMONHUNTER',
  'DeathKnights': 'DEATHKNIGHT',
  'Evokers': 'EVOKER'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * 필수 필드 검증
 */
function validateSkill(skill, filePath) {
  const required = [
    'id', 'koreanName', 'englishName', 'icon',
    'description', 'cooldown', 'castTime', 'range',
    'resourceCost', 'resourceGain', 'type', 'spec', 'level', 'pvp'
  ];

  const missing = required.filter(field => skill[field] === undefined);

  if (missing.length > 0) {
    console.warn(`⚠️  ${filePath}: 누락된 필드 - ${missing.join(', ')}`);
    return false;
  }

  return true;
}

/**
 * Obsidian 노트를 JavaScript 스킬 객체로 변환
 */
function convertMarkdownToSkill(frontmatter, content) {
  return {
    id: frontmatter.id,
    koreanName: frontmatter.koreanName,
    englishName: frontmatter.englishName,
    icon: frontmatter.icon,
    description: frontmatter.description || content.split('\n')[0] || '',
    cooldown: frontmatter.cooldown || '없음',
    castTime: frontmatter.castTime || '즉시',
    range: frontmatter.range || '근접',
    resourceCost: frontmatter.resourceCost || '없음',
    resourceGain: frontmatter.resourceGain || '없음',
    type: frontmatter.type || '기본',
    spec: frontmatter.spec || '공용',
    level: frontmatter.level || 1,
    pvp: frontmatter.pvp || false,
    verified: frontmatter.verified !== false, // 기본값 true
    tier: frontmatter.tier || 'B',
    tags: frontmatter.tags || []
  };
}

/**
 * 클래스 폴더 스캔 및 스킬 수집
 */
async function scanClassFolder(classFolder, className) {
  const skills = {};
  const files = await fs.readdir(classFolder);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(classFolder, file);
    const fileContent = await fs.readFile(filePath, 'utf8');

    try {
      const parsed = matter(fileContent);
      const skill = convertMarkdownToSkill(parsed.data, parsed.content);

      // 필수 필드 검증
      if (!validateSkill(skill, filePath)) {
        continue;
      }

      // 스킬 ID를 키로 사용
      skills[skill.id] = skill;

    } catch (error) {
      console.error(`❌ ${filePath} 파싱 실패:`, error.message);
    }
  }

  return skills;
}

// ============================================================================
// MAIN SYNC FUNCTION
// ============================================================================

async function syncMarkdownToJS() {
  console.log('============================================================');
  console.log('  Obsidian → JavaScript DB 역방향 동기화');
  console.log('============================================================\n');

  try {
    // Step 1: 기존 JavaScript DB 백업
    console.log('📦 기존 데이터베이스 백업 중...');

    if (await fs.pathExists(JS_DB_PATH)) {
      await fs.ensureDir(path.dirname(BACKUP_PATH));
      await fs.copy(JS_DB_PATH, BACKUP_PATH);
      console.log(`✅ 백업 완료: ${BACKUP_PATH}\n`);
    } else {
      console.warn('⚠️  기존 데이터베이스 없음, 새로 생성합니다.\n');
    }

    // Step 2: Obsidian 스킬 노트 스캔
    console.log('🔍 Obsidian 스킬 노트 스캔 중...\n');

    const newDatabase = {};
    let totalSkills = 0;
    let newSkills = 0;
    let updatedSkills = 0;

    // 기존 DB 로드 (비교용)
    let oldDatabase = {};
    if (await fs.pathExists(JS_DB_PATH)) {
      oldDatabase = await fs.readJson(JS_DB_PATH);
    }

    // 각 클래스 폴더 처리
    for (const [folderName, className] of Object.entries(CLASS_FOLDER_MAP)) {
      const classFolder = path.join(SKILL_DB_FOLDER, folderName);

      if (!(await fs.pathExists(classFolder))) {
        console.warn(`⚠️  ${folderName} 폴더 없음, 건너뜁니다.`);
        continue;
      }

      const skills = await scanClassFolder(classFolder, className);
      const skillCount = Object.keys(skills).length;

      if (skillCount > 0) {
        newDatabase[className] = skills;
        totalSkills += skillCount;

        // 변경 사항 분석
        const oldSkills = oldDatabase[className] || {};
        for (const [skillId, skill] of Object.entries(skills)) {
          if (!oldSkills[skillId]) {
            newSkills++;
          } else if (JSON.stringify(oldSkills[skillId]) !== JSON.stringify(skill)) {
            updatedSkills++;
          }
        }

        console.log(`✅ ${folderName}: ${skillCount}개 스킬 (신규 ${newSkills}, 수정 ${updatedSkills})`);
      }
    }

    // Step 3: JavaScript DB 저장
    console.log('\n💾 JavaScript 데이터베이스 저장 중...');
    await fs.writeJson(JS_DB_PATH, newDatabase, { spaces: 2 });
    console.log(`✅ 저장 완료: ${JS_DB_PATH}\n`);

    // Step 4: 통계 출력
    console.log('============================================================');
    console.log('  동기화 통계');
    console.log('============================================================');
    console.log(`총 스킬: ${totalSkills}개`);
    console.log(`신규 스킬: ${newSkills}개`);
    console.log(`수정된 스킬: ${updatedSkills}개`);
    console.log(`클래스: ${Object.keys(newDatabase).length}개`);
    console.log('============================================================\n');

    // Step 5: 검증
    console.log('🔍 데이터 무결성 검증 중...\n');

    let validationErrors = 0;

    // 중복 ID 확인
    const allIds = new Set();
    const duplicates = [];

    for (const [className, skills] of Object.entries(newDatabase)) {
      for (const [skillId, skill] of Object.entries(skills)) {
        if (allIds.has(skillId)) {
          duplicates.push(skillId);
          validationErrors++;
        }
        allIds.add(skillId);
      }
    }

    if (duplicates.length > 0) {
      console.error('❌ 중복 스킬 ID:', duplicates.join(', '));
    }

    // 필수 필드 재검증
    for (const [className, skills] of Object.entries(newDatabase)) {
      for (const [skillId, skill] of Object.entries(skills)) {
        if (!validateSkill(skill, `${className}/${skillId}`)) {
          validationErrors++;
        }
      }
    }

    if (validationErrors === 0) {
      console.log('✅ 모든 검증 통과!\n');
    } else {
      console.warn(`⚠️  ${validationErrors}개 검증 오류 발견\n`);
    }

    console.log('🎉 동기화 완료!\n');

  } catch (error) {
    console.error('❌ 동기화 실패:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  syncMarkdownToJS();
}

export { syncMarkdownToJS };
