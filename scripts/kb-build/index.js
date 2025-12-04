/**
 * KB → Site 빌드 시스템 - 메인 스크립트
 * 
 * Obsidian KB 노트를 파싱하여 사이트용 JSON 생성
 * 
 * 📌 필수 참조: WoW-Meta-Knowledge/99-META/Guide-Generation-Instructions.md
 * 
 * 사용법:
 *   node scripts/kb-build/index.js           # 전체 빌드
 *   node scripts/kb-build/index.js --skills  # 스킬만
 *   node scripts/kb-build/index.js --guides  # 가이드만
 *   node scripts/kb-build/index.js --validate # 검증만
 */

const fs = require('fs');
const path = require('path');
const { parseSkillNote } = require('./parsers/skill-parser');
const { parsePriorityNote } = require('./parsers/priority-parser');
const { generateSkillDB, generateSkillNameMap, generateSkillIconMap, generateSkillsByClass } = require('./generators/skill-db');
const { generateGuideData, generatePriorityFiles } = require('./generators/guide-data');

// ========================================
// 설정
// ========================================
const CONFIG = {
  // KB 경로 (Obsidian vault) - 상대 경로로 수정
  KB_ROOT: path.resolve(__dirname, '../../../WoW-Meta-Knowledge'),
  
  // 출력 경로
  OUTPUT_DIR: path.resolve(__dirname, '../../src/data/generated'),
  
  // KB 폴더 구조
  PATHS: {
    SKILLS: '01-ATOMIC/Skills',
    PRIORITIES: '03-PRIORITY',
    GUIDES: '05-GUIDES',
    SYNERGIES: '02-SYNERGY',
  },
  
  // 현재 패치
  CURRENT_PATCH: '11.2.5',
  
  // 빌드 옵션
  VALIDATE_ONLY: process.argv.includes('--validate'),
  SKILLS_ONLY: process.argv.includes('--skills'),
  GUIDES_ONLY: process.argv.includes('--guides'),
  VERBOSE: process.argv.includes('--verbose') || process.argv.includes('-v'),
};

// ========================================
// 유틸리티 함수
// ========================================

/**
 * 디렉토리 내 모든 .md 파일 재귀적으로 찾기
 */
function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️ 디렉토리 없음: ${dir}`);
    return fileList;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.startsWith('_')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * 출력 디렉토리 확인/생성
 */
function ensureOutputDir() {
  if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
    fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
    console.log(`📁 출력 디렉토리 생성: ${CONFIG.OUTPUT_DIR}`);
  }
}

// ========================================
// 메인 빌드 로직
// ========================================

async function build() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  🔨 KB → Site 빌드 시스템 v2.0                                ║');
  console.log('║  📌 Single Source of Truth: Obsidian KB                       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
  
  const startTime = Date.now();
  const results = {
    skills: { total: 0, success: 0, errors: [] },
    priorities: { total: 0, success: 0, errors: [] },
    guides: { total: 0, success: 0, errors: [] },
  };
  
  // KB 경로 확인
  console.log(`📂 KB 경로: ${CONFIG.KB_ROOT}`);
  if (!fs.existsSync(CONFIG.KB_ROOT)) {
    console.error(`❌ KB 경로가 존재하지 않습니다: ${CONFIG.KB_ROOT}`);
    process.exit(1);
  }
  
  // 출력 디렉토리 확인
  ensureOutputDir();
  console.log(`📂 출력 경로: ${CONFIG.OUTPUT_DIR}`);
  console.log('');
  
  let skills = [];
  let priorities = [];
  
  // ========================================
  // 1. 스킬 노트 파싱
  // ========================================
  if (!CONFIG.GUIDES_ONLY) {
    console.log('📦 [1/3] 스킬 노트 파싱...');
    
    const skillsDir = path.join(CONFIG.KB_ROOT, CONFIG.PATHS.SKILLS);
    const skillFiles = findMarkdownFiles(skillsDir);
    
    console.log(`   📁 발견된 스킬 파일: ${skillFiles.length}개`);
    
    for (const filePath of skillFiles) {
      results.skills.total++;
      const relativePath = path.relative(CONFIG.KB_ROOT, filePath);
      
      try {
        const skill = parseSkillNote(filePath);
        skills.push(skill);
        results.skills.success++;
        
        if (CONFIG.VERBOSE) {
          console.log(`   ✓ ${skill.name_kr} (${skill.id})`);
        }
        
      } catch (error) {
        results.skills.errors.push({
          file: relativePath,
          error: error.message,
        });
        if (CONFIG.VERBOSE) {
          console.log(`   ✗ ${relativePath}: ${error.message}`);
        }
      }
    }
    
    console.log(`   ✅ ${results.skills.success}/${results.skills.total} 스킬 파싱 완료`);
    
    if (!CONFIG.VALIDATE_ONLY && skills.length > 0) {
      generateSkillDB(skills, CONFIG.OUTPUT_DIR);
      generateSkillNameMap(skills, CONFIG.OUTPUT_DIR);
      generateSkillIconMap(skills, CONFIG.OUTPUT_DIR);
      generateSkillsByClass(skills, CONFIG.OUTPUT_DIR);
    }
  }
  
  // ========================================
  // 2. 우선순위 노트 파싱
  // ========================================
  if (!CONFIG.GUIDES_ONLY) {
    console.log('');
    console.log('📊 [2/3] 우선순위 노트 파싱...');
    
    const prioritiesDir = path.join(CONFIG.KB_ROOT, CONFIG.PATHS.PRIORITIES);
    const priorityFiles = findMarkdownFiles(prioritiesDir);
    
    console.log(`   📁 발견된 우선순위 파일: ${priorityFiles.length}개`);
    
    for (const filePath of priorityFiles) {
      results.priorities.total++;
      const relativePath = path.relative(CONFIG.KB_ROOT, filePath);
      
      try {
        const priority = parsePriorityNote(filePath);
        priorities.push(priority);
        results.priorities.success++;
        
        if (CONFIG.VERBOSE) {
          console.log(`   ✓ ${priority.key}`);
        }
        
      } catch (error) {
        results.priorities.errors.push({
          file: relativePath,
          error: error.message,
        });
        if (CONFIG.VERBOSE) {
          console.log(`   ✗ ${relativePath}: ${error.message}`);
        }
      }
    }
    
    console.log(`   ✅ ${results.priorities.success}/${results.priorities.total} 우선순위 파싱 완료`);
    
    if (!CONFIG.VALIDATE_ONLY && priorities.length > 0) {
      generatePriorityFiles(priorities, CONFIG.OUTPUT_DIR);
    }
  }
  
  // ========================================
  // 3. 가이드 데이터 생성
  // ========================================
  if (!CONFIG.SKILLS_ONLY) {
    console.log('');
    console.log('📖 [3/3] 가이드 데이터 생성...');
    
    if (!CONFIG.VALIDATE_ONLY && skills.length > 0 && priorities.length > 0) {
      generateGuideData(priorities, skills, CONFIG.OUTPUT_DIR);
      results.guides.success = 1;
      results.guides.total = 1;
    } else if (skills.length === 0) {
      console.log('   ⚠️ 스킬 데이터 없음 - 가이드 생성 건너뜀');
    } else if (priorities.length === 0) {
      console.log('   ⚠️ 우선순위 데이터 없음 - 가이드 생성 건너뜀');
    }
    
    console.log(`   ✅ 가이드 생성 완료`);
  }
  
  // ========================================
  // 결과 요약
  // ========================================
  console.log('');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('📋 빌드 결과 요약');
  console.log('════════════════════════════════════════════════════════════════');
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`⏱️  소요 시간: ${elapsed}초`);
  console.log(`📦 스킬: ${results.skills.success}/${results.skills.total}`);
  console.log(`📊 우선순위: ${results.priorities.success}/${results.priorities.total}`);
  console.log(`📖 가이드: ${results.guides.success > 0 ? '생성됨' : '없음'}`);
  
  // 오류 출력
  const allErrors = [
    ...results.skills.errors,
    ...results.priorities.errors,
    ...results.guides.errors,
  ];
  
  if (allErrors.length > 0) {
    console.log('');
    console.log('❌ 오류 목록:');
    for (const err of allErrors) {
      console.log(`   - ${err.file}: ${err.error}`);
    }
  }
  
  // 생성된 파일 목록
  if (!CONFIG.VALIDATE_ONLY) {
    console.log('');
    console.log('📄 생성된 파일:');
    const listFiles = (dir, prefix = '') => {
      if (!fs.existsSync(dir)) return;
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          console.log(`   ${prefix}📁 ${item}/`);
          listFiles(itemPath, prefix + '  ');
        } else {
          console.log(`   ${prefix}📄 ${item}`);
        }
      }
    };
    listFiles(CONFIG.OUTPUT_DIR);
  }
  
  console.log('');
  console.log(CONFIG.VALIDATE_ONLY ? '🔍 검증 완료!' : '✅ 빌드 완료!');
  
  // 오류가 있으면 exit code 1
  if (allErrors.length > 0) {
    process.exit(1);
  }
}

// 실행
build().catch(err => {
  console.error('❌ 빌드 실패:', err);
  process.exit(1);
});
