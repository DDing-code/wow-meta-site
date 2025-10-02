/**
 * 스킬 DB 자동 관리 유틸리티
 * 가이드 작성 시 새로운 스킬을 자동으로 통합 DB에 추가
 */

const fs = require('fs');
const path = require('path');

// DB 경로 설정
const DB_PATH = path.join(__dirname, '../../database-builder/tww-s3-refined-database.json');
const BACKUP_DIR = path.join(__dirname, '../../database-builder/backups');

// 클래스명 매핑
const CLASS_MAP = {
  WARRIOR: '전사',
  PALADIN: '성기사',
  HUNTER: '사냥꾼',
  ROGUE: '도적',
  PRIEST: '사제',
  SHAMAN: '주술사',
  MAGE: '마법사',
  WARLOCK: '흑마법사',
  MONK: '수도사',
  DRUID: '드루이드',
  DEMONHUNTER: '악마사냥꾼',
  DEATHKNIGHT: '죽음의기사',
  EVOKER: '기원사'
};

/**
 * DB 백업 생성
 */
function createBackup() {
  try {
    // 백업 디렉토리 생성
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.json`);

    const dbContent = fs.readFileSync(DB_PATH, 'utf8');
    fs.writeFileSync(backupPath, dbContent);

    console.log(`✅ DB 백업 생성됨: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('❌ 백업 생성 실패:', error);
    return null;
  }
}

/**
 * DB 로드
 */
function loadDB() {
  try {
    const dbContent = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(dbContent);
  } catch (error) {
    console.error('❌ DB 로드 실패:', error);
    return null;
  }
}

/**
 * DB 저장
 */
function saveDB(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log('✅ DB 저장 완료');
    return true;
  } catch (error) {
    console.error('❌ DB 저장 실패:', error);
    return false;
  }
}

/**
 * 스킬 데이터 정규화
 */
function normalizeSkillData(skill) {
  // 필수 필드 확인 및 기본값 설정
  return {
    id: skill.id || '',
    englishName: skill.englishName || '',
    koreanName: skill.koreanName || skill.name || '',
    icon: skill.icon || '',
    type: skill.type || '기본',
    spec: skill.spec || '공용',
    heroTalent: skill.heroTalent || null,
    level: skill.level || 1,
    pvp: skill.pvp || false,
    duration: skill.duration || 'n/a',
    school: skill.school || 'Physical',
    mechanic: skill.mechanic || 'n/a',
    dispelType: skill.dispelType || 'n/a',
    gcd: skill.gcd || 'Normal',
    resourceCost: skill.resourceCost || skill.focusCost || '없음',
    resourceGain: skill.resourceGain || skill.focusGain || '없음',
    range: skill.range || '0 야드',
    castTime: skill.castTime || '즉시',
    cooldown: skill.cooldown || '해당 없음',
    description: skill.description || '설명 없음',
    charges: skill.charges,
    coefficient: skill.coefficient,
    maxTargets: skill.maxTargets,
    radius: skill.radius,
    stacks: skill.stacks,
    proc: skill.proc
  };
}

/**
 * 스킬을 DB에 추가
 * @param {string} className - 클래스명 (예: 'HUNTER')
 * @param {Object} skill - 스킬 데이터
 * @returns {boolean} 성공 여부
 */
function addSkillToDB(className, skill) {
  try {
    // DB 백업
    createBackup();

    // DB 로드
    const db = loadDB();
    if (!db) {
      console.error('❌ DB 로드 실패');
      return false;
    }

    // 클래스 섹션 확인
    if (!db[className]) {
      db[className] = {};
      console.log(`🆕 새 클래스 섹션 생성: ${className}`);
    }

    // 스킬 정규화
    const normalizedSkill = normalizeSkillData(skill);

    // 스킬 ID 확인
    if (!normalizedSkill.id) {
      console.error('❌ 스킬 ID가 없습니다');
      return false;
    }

    // 중복 확인
    if (db[className][normalizedSkill.id]) {
      console.log(`⚠️ 스킬이 이미 존재함: ${normalizedSkill.koreanName} (${normalizedSkill.id})`);
      return false;
    }

    // 스킬 추가
    db[className][normalizedSkill.id] = normalizedSkill;

    // DB 저장
    if (saveDB(db)) {
      console.log(`✅ 스킬 추가됨: ${normalizedSkill.koreanName} (${normalizedSkill.id})`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ 스킬 추가 실패:', error);
    return false;
  }
}

/**
 * DB에서 스킬 조회
 * @param {string} className - 클래스명
 * @param {string} skillId - 스킬 ID
 * @returns {Object|null} 스킬 데이터
 */
function getSkillFromDB(className, skillId) {
  try {
    const db = loadDB();
    if (!db || !db[className]) {
      return null;
    }

    return db[className][skillId] || null;
  } catch (error) {
    console.error('❌ 스킬 조회 실패:', error);
    return null;
  }
}

/**
 * DB에서 스킬 업데이트
 * @param {string} className - 클래스명
 * @param {string} skillId - 스킬 ID
 * @param {Object} updates - 업데이트할 필드
 * @returns {boolean} 성공 여부
 */
function updateSkillInDB(className, skillId, updates) {
  try {
    // DB 백업
    createBackup();

    // DB 로드
    const db = loadDB();
    if (!db || !db[className] || !db[className][skillId]) {
      console.error('❌ 스킬을 찾을 수 없음');
      return false;
    }

    // 기존 스킬과 병합
    const existingSkill = db[className][skillId];
    const updatedSkill = {
      ...existingSkill,
      ...updates
    };

    // 정규화
    db[className][skillId] = normalizeSkillData(updatedSkill);

    // DB 저장
    if (saveDB(db)) {
      console.log(`✅ 스킬 업데이트됨: ${db[className][skillId].koreanName} (${skillId})`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ 스킬 업데이트 실패:', error);
    return false;
  }
}

/**
 * 여러 스킬 일괄 추가
 * @param {string} className - 클래스명
 * @param {Array} skills - 스킬 배열
 * @returns {Object} 추가 결과
 */
function addMultipleSkillsToDB(className, skills) {
  const results = {
    added: [],
    skipped: [],
    failed: []
  };

  for (const skill of skills) {
    const result = addSkillToDB(className, skill);
    if (result === true) {
      results.added.push(skill.id || skill.name);
    } else if (result === false) {
      results.skipped.push(skill.id || skill.name);
    } else {
      results.failed.push(skill.id || skill.name);
    }
  }

  console.log('\n=== 일괄 추가 결과 ===');
  console.log(`✅ 추가됨: ${results.added.length}개`);
  console.log(`⚠️ 건너뜀: ${results.skipped.length}개`);
  console.log(`❌ 실패: ${results.failed.length}개`);

  return results;
}

/**
 * 클래스별 모든 스킬 조회
 * @param {string} className - 클래스명
 * @returns {Object} 스킬 목록
 */
function getAllSkillsByClass(className) {
  try {
    const db = loadDB();
    if (!db || !db[className]) {
      return {};
    }

    return db[className];
  } catch (error) {
    console.error('❌ 클래스 스킬 조회 실패:', error);
    return {};
  }
}

/**
 * DB 통계 정보
 * @returns {Object} 통계 정보
 */
function getDBStats() {
  try {
    const db = loadDB();
    if (!db) {
      return null;
    }

    const stats = {
      totalSkills: 0,
      byClass: {}
    };

    for (const [className, skills] of Object.entries(db)) {
      const skillCount = Object.keys(skills).length;
      stats.byClass[className] = skillCount;
      stats.totalSkills += skillCount;
    }

    return stats;
  } catch (error) {
    console.error('❌ DB 통계 조회 실패:', error);
    return null;
  }
}

// CommonJS export만 지원
module.exports = {
  addSkillToDB,
  getSkillFromDB,
  updateSkillInDB,
  addMultipleSkillsToDB,
  getAllSkillsByClass,
  getDBStats,
  createBackup,
  CLASS_MAP
};