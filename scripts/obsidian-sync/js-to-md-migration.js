#!/usr/bin/env node

/**
 * WoW Skill DB → Obsidian Markdown Migration Script
 *
 * Purpose: Convert 1,186 skills from JavaScript JSON to Obsidian Markdown notes
 * Input: database-builder/all-classes-skills-data.json
 * Output: WoW-Meta-Knowledge/01-스킬-DB/{Class}/{SkillName}.md
 *
 * Template: 08-메타데이터/Templates/Skill-Note-Template.md
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const DB_PATH = path.join(PROJECT_ROOT, 'database-builder/all-classes-skills-data.json');
const VAULT_ROOT = path.join(PROJECT_ROOT, 'WoW-Meta-Knowledge');
const SKILL_DB_FOLDER = path.join(VAULT_ROOT, '01-스킬-DB');

// Class name mapping (JSON key → Folder name)
const CLASS_FOLDER_MAP = {
  'WARRIOR': 'Warriors',
  'PALADIN': 'Paladins',
  'HUNTER': 'Hunters',
  'ROGUE': 'Rogues',
  'PRIEST': 'Priests',
  'SHAMAN': 'Shamans',
  'MAGE': 'Mages',
  'WARLOCK': 'Warlocks',
  'MONK': 'Monks',
  'DRUID': 'Druids',
  'DEMONHUNTER': 'DemonHunters',
  'DEATHKNIGHT': 'DeathKnights',
  'EVOKER': 'Evokers'
};

// Class name mapping (한글)
const CLASS_KOREAN_MAP = {
  'WARRIOR': '전사',
  'PALADIN': '성기사',
  'HUNTER': '사냥꾼',
  'ROGUE': '도적',
  'PRIEST': '사제',
  'SHAMAN': '주술사',
  'MAGE': '마법사',
  'WARLOCK': '흑마법사',
  'MONK': '수도사',
  'DRUID': '드루이드',
  'DEMONHUNTER': '악마사냥꾼',
  'DEATHKNIGHT': '죽음의 기사',
  'EVOKER': '기원사'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Sanitize filename for file system (remove invalid characters)
 */
function sanitizeFilename(name) {
  if (!name || typeof name !== 'string') {
    return 'Unknown-Skill';
  }
  return name
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .trim();
}

/**
 * Determine skill tier based on verification status
 */
function determineSkillTier(skill) {
  if (skill.verified === true) {
    return 'A'; // High reliability (95%)
  } else if (skill.verified === false) {
    return 'C'; // Lower reliability (70%)
  } else {
    return 'B'; // Default (85%)
  }
}

/**
 * Parse resource information
 */
function parseResource(skill) {
  const resourceCost = skill.resource || '없음';
  const resourceGain = ''; // Not in current DB structure
  return { resourceCost, resourceGain };
}

/**
 * Generate Markdown content from skill data using template
 */
function generateSkillMarkdown(skill, className) {
  const today = new Date().toISOString().split('T')[0];
  const tier = determineSkillTier(skill);
  const { resourceCost, resourceGain } = parseResource(skill);
  const classKorean = CLASS_KOREAN_MAP[className] || className;

  return `---
type: skill
id: ${skill.id}
koreanName: ${skill.koreanName}
englishName: ${skill.englishName}
class: ${classKorean}
spec: ${skill.spec || '공용'}
icon: ${skill.icon || 'inv_misc_questionmark'}
tier: ${tier}
tags:
  - skill
  - ${classKorean.replace(/\s+/g, '')}
  - ${(skill.spec || '공용').replace(/\s+/g, '')}
created: ${today}
updated: ${today}
---

# ${skill.koreanName} (${skill.englishName})

## 📊 기본 정보

| 속성 | 값 |
|------|-----|
| **스킬 ID** | ${skill.id} |
| **클래스** | [[${CLASS_FOLDER_MAP[className]}\\|${classKorean}]] |
| **전문화** | ${skill.spec || '공용'} |
| **재사용 대기시간** | ${skill.cooldown || '없음'} |
| **시전 시간** | ${skill.castTime || '즉시'} |
| **사거리** | ${skill.range || '근접'} |
| **자원 소모** | ${resourceCost} |
| **자원 획득** | ${resourceGain || '없음'} |
| **스킬 타입** | ${skill.type || '기본'} |
| **습득 레벨** | ${skill.level || 1} |
| **PvP** | ${skill.pvp || false} |
| **신뢰도 등급** | ${tier} |

## 📖 설명

${skill.description || '설명 없음'}

## 🎯 주요 용도

- 단일 대상: 미정
- 다수 대상: 미정
- 생존기: 미정

## 🔗 관련 링크

### 가이드
- 관련 가이드: 미정

### 관련 스킬
- 관련 스킬 1: 미정
- 관련 스킬 2: 미정

### 외부 리소스
- [Wowhead (한)](https://ko.wowhead.com/spell=${skill.id})
- [Wowhead (영)](https://wowhead.com/spell=${skill.id})

## 📝 학습 노트

### AI 페르소나 피드백
- 평가: 미정

### 로그 분석 인사이트
- 사용 빈도: 미정
- 평균 DPS 기여도: 미정

### 변경 이력
- ${today}: 초기 마이그레이션 (JS DB → Markdown)

---

**생성일**: ${today}
**마지막 업데이트**: ${today}
**검증 상태**: ${skill.verified ? '검증됨' : '미검증'}
`;
}

/**
 * Write skill to Markdown file
 */
function writeSkillToMarkdown(skill, className) {
  const folderName = CLASS_FOLDER_MAP[className];
  if (!folderName) {
    console.warn(`⚠️  Unknown class: ${className}, skipping...`);
    return false;
  }

  const classFolder = path.join(SKILL_DB_FOLDER, folderName);

  // Ensure class folder exists
  if (!fs.existsSync(classFolder)) {
    console.warn(`⚠️  Class folder not found: ${classFolder}, creating...`);
    fs.mkdirSync(classFolder, { recursive: true });
  }

  // Generate filename (sanitized Korean name)
  const filename = `${sanitizeFilename(skill.koreanName)}.md`;
  const filePath = path.join(classFolder, filename);

  // Generate Markdown content
  const markdown = generateSkillMarkdown(skill, className);

  // Write to file
  try {
    fs.writeFileSync(filePath, markdown, 'utf8');
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filename}:`, error.message);
    return false;
  }
}

// ============================================================================
// MAIN MIGRATION FUNCTION
// ============================================================================

function migrateSkillDatabase() {
  console.log('============================================================');
  console.log('  WoW Skill DB → Obsidian Markdown Migration');
  console.log('============================================================\n');

  // Step 1: Load database
  console.log('📂 Loading database...');
  if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ Database file not found: ${DB_PATH}`);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  console.log(`✅ Database loaded successfully\n`);

  // Step 2: Count skills
  let totalSkills = 0;
  const classCounts = {};

  for (const [className, skills] of Object.entries(db)) {
    const skillCount = Object.keys(skills).length;
    classCounts[className] = skillCount;
    totalSkills += skillCount;
  }

  console.log('📊 Database Statistics:');
  console.log(`   Total skills: ${totalSkills}`);
  console.log(`   Total classes: ${Object.keys(db).length}\n`);

  // Step 3: Migrate skills
  console.log('🔄 Starting migration...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const [className, skills] of Object.entries(db)) {
    const classKorean = CLASS_KOREAN_MAP[className] || className;
    const skillCount = classCounts[className];

    console.log(`📦 Migrating ${classKorean} (${skillCount} skills)...`);

    let classSuccessCount = 0;

    for (const [skillId, skill] of Object.entries(skills)) {
      const success = writeSkillToMarkdown(skill, className);
      if (success) {
        classSuccessCount++;
        successCount++;
      } else {
        errorCount++;
      }
    }

    const percentage = ((classSuccessCount / skillCount) * 100).toFixed(1);
    console.log(`   ✅ ${classSuccessCount}/${skillCount} (${percentage}%)\n`);
  }

  // Step 4: Summary
  console.log('============================================================');
  console.log('  Migration Summary');
  console.log('============================================================');
  console.log(`✅ Success: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`📊 Success rate: ${((successCount / totalSkills) * 100).toFixed(1)}%`);
  console.log(`📂 Output folder: ${SKILL_DB_FOLDER}`);
  console.log('============================================================\n');

  if (errorCount > 0) {
    console.warn(`⚠️  ${errorCount} errors occurred during migration.`);
    console.warn('   Please check the logs above for details.\n');
  } else {
    console.log('🎉 Migration completed successfully!\n');
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

if (require.main === module) {
  migrateSkillDatabase();
}

module.exports = { migrateSkillDatabase };
