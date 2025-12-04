/**
 * SkillAutoFinder.js
 * Wowhead 기반 스킬 자동 검색 및 DB 추가 시스템
 *
 * 기능:
 * - Wowhead 스킬 검색 (클래스 필터링)
 * - 스킬 ID 자동 추출
 * - 한글/영문 스킬명 추출
 * - 스킬 데이터 자동 DB 추가
 * - 아이콘 파일명 추출
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TranslationValidator from './TranslationValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 클래스명 → Wowhead 클래스 ID 매핑
 */
const CLASS_ID_MAP = {
  'warrior': 1,
  'paladin': 2,
  'hunter': 3,
  'rogue': 4,
  'priest': 5,
  'deathknight': 6,
  'shaman': 7,
  'mage': 8,
  'warlock': 9,
  'monk': 10,
  'druid': 11,
  'demonhunter': 12,
  'evoker': 13
};

/**
 * Wowhead에서 스킬 검색 및 ID 추출
 * @param {string} skillName - 검색할 스킬명 (한글 또는 영어)
 * @param {string} className - 클래스명 (필터링용)
 * @returns {Promise<number|null>} 스킬 ID
 */
const searchSkillId = async (skillName, className) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const classId = CLASS_ID_MAP[className.toLowerCase()];
    if (!classId) {
      console.warn(`⚠️  알 수 없는 클래스: ${className}`);
      return null;
    }

    // Wowhead 검색 (영어 우선)
    const searchUrl = `https://www.wowhead.com/spells/name:${encodeURIComponent(skillName)}?filter-class=${classId}`;
    console.log(`🔍 Wowhead 검색: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000); // 동적 콘텐츠 로딩 대기

    // 검색 결과에서 첫 번째 스킬 ID 추출
    const skillId = await page.evaluate(() => {
      // 검색 결과 테이블에서 스킬 링크 찾기
      const firstResult = document.querySelector('table.listview-mode-default tbody tr td.listview-name a');
      if (!firstResult) return null;

      const href = firstResult.getAttribute('href');
      if (!href) return null;

      // /spell=12345/ 패턴에서 ID 추출
      const match = href.match(/\/spell=(\d+)/);
      return match ? parseInt(match[1]) : null;
    });

    await browser.close();

    if (skillId) {
      console.log(`✅ 스킬 ID 찾음: ${skillId}`);
    } else {
      console.warn(`⚠️  스킬 ID를 찾을 수 없음: ${skillName}`);
    }

    return skillId;

  } catch (error) {
    console.error(`❌ Wowhead 검색 실패: ${error.message}`);
    await browser.close();
    return null;
  }
};

/**
 * Wowhead에서 스킬 데이터 추출 (한글 + 영문)
 * @param {number} skillId - 스킬 ID
 * @returns {Promise<object|null>} 스킬 데이터
 */
const extractSkillData = async (skillId) => {
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. 한글 페이지에서 데이터 추출
    const koPage = await browser.newPage();
    const koUrl = `https://ko.wowhead.com/spell=${skillId}`;
    console.log(`🔍 한글 페이지 접속: ${koUrl}`);

    await koPage.goto(koUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await koPage.waitForTimeout(2000);

    const koData = await koPage.evaluate(() => {
      const title = document.querySelector('.heading-size-1')?.textContent?.trim();
      const tooltip = document.querySelector('.wowhead-tooltip');

      let description = '';
      let cooldown = '없음';
      let castTime = '즉시';
      let range = '근접';

      if (tooltip) {
        // 설명 추출
        const descDiv = tooltip.querySelector('div');
        if (descDiv) description = descDiv.textContent?.trim() || '';

        // 세부 정보 테이블 파싱
        const rows = tooltip.querySelectorAll('table tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const key = cells[0].textContent?.trim();
            const value = cells[1].textContent?.trim();

            if (key?.includes('재사용')) cooldown = value;
            if (key?.includes('시전')) castTime = value;
            if (key?.includes('사거리')) range = value;
          }
        });
      }

      // 아이콘 추출
      const iconElement = document.querySelector('[class*="iconsmall"]');
      let icon = 'ability_warrior_charge'; // 기본값
      if (iconElement) {
        const iconSrc = iconElement.src;
        const iconMatch = iconSrc.match(/\/([^\/]+)\.(jpg|png|gif)$/);
        if (iconMatch) icon = iconMatch[1];
      }

      return { title, description, cooldown, castTime, range, icon };
    });

    await koPage.close();

    // 2. 영문 페이지에서 영어명 추출
    const enPage = await browser.newPage();
    const enUrl = `https://www.wowhead.com/spell=${skillId}`;
    console.log(`🔍 영문 페이지 접속: ${enUrl}`);

    await enPage.goto(enUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await enPage.waitForTimeout(2000);

    const englishName = await enPage.evaluate(() => {
      return document.querySelector('.heading-size-1')?.textContent?.trim() || '';
    });

    await enPage.close();
    await browser.close();

    // 3. 데이터 조합
    const skillData = {
      id: skillId,
      koreanName: koData.title || '알 수 없음',
      englishName: englishName || '알 수 없음',
      icon: koData.icon,
      description: koData.description || '설명 없음',
      cooldown: koData.cooldown,
      castTime: koData.castTime,
      range: koData.range,
      resourceCost: '없음', // 추후 개선 가능
      resourceGain: '없음', // 추후 개선 가능
      type: '기본',
      spec: '공용',
      level: 1,
      pvp: false
    };

    console.log(`✅ 스킬 데이터 추출 완료: ${skillData.koreanName} (${skillData.englishName})`);
    return skillData;

  } catch (error) {
    console.error(`❌ 스킬 데이터 추출 실패: ${error.message}`);
    await browser.close();
    return null;
  }
};

/**
 * 스킬 데이터를 DB에 추가
 * @param {object} skillData - 추가할 스킬 데이터
 * @param {string} className - 클래스명
 * @returns {Promise<boolean>} 성공 여부
 */
const addSkillToDatabase = async (skillData, className) => {
  try {
    const dbPath = path.join(__dirname, '..', '..', 'database-builder', 'tww-s3-refined-database.json');

    // DB 로드
    let db = {};
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, 'utf-8');
      db = JSON.parse(dbContent);
    }

    // 클래스 데이터 초기화
    if (!db[className]) {
      db[className] = {};
    }

    // 중복 확인 (이미 존재하는 스킬 ID)
    const existingSkill = Object.values(db[className]).find(s => s.id === skillData.id);
    if (existingSkill) {
      console.log(`ℹ️  스킬 이미 존재: ${skillData.koreanName} (ID: ${skillData.id})`);
      return true;
    }

    // 스킬 키 생성 (camelCase)
    const skillKey = skillData.englishName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    // 스킬 추가
    db[className][skillKey] = skillData;

    // DB 저장
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`✅ 스킬 DB에 추가됨: ${skillData.koreanName} (${className}/${skillKey})`);

    return true;

  } catch (error) {
    console.error(`❌ DB 추가 실패: ${error.message}`);
    return false;
  }
};

/**
 * 메인 함수: 스킬 자동 검색 및 DB 추가 (TranslationValidator 통합)
 * @param {string} skillName - 검색할 스킬명
 * @param {string} className - 클래스명
 * @returns {Promise<object|null>} 추가된 스킬 데이터
 */
export const searchAndAddSkill = async (skillName, className) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  스킬 자동 검색 시작: ${skillName} (${className})`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    // ========================================
    // STAGE 1: Pre-validation (MANDATORY)
    // ========================================
    const validator = new TranslationValidator();
    const preValidation = validator.validateBeforeTranslation(skillName, className);

    // 내부 DB에서 발견 → Wowhead 검색 차단
    if (preValidation.status === 'MUST_USE_EXISTING') {
      console.log(`\n🔴 [MANDATORY] 내부 DB 우선 사용 프로토콜`);
      console.log(preValidation.message);
      console.log(`\n⚠️ Wowhead 검색 차단 - 기존 번역 반드시 사용`);

      // DB에서 가져온 기존 스킬 데이터 반환
      const existingSkill = {
        id: preValidation.skillId,
        koreanName: preValidation.koreanName,
        englishName: skillName,
        tier: preValidation.tier,
        confidence: preValidation.confidence,
        source: 'INTERNAL_DB'
      };

      console.log(`\n${'='.repeat(60)}`);
      console.log('  ✅ 기존 번역 사용 완료 (Wowhead 검색 불필요)');
      console.log(`${'='.repeat(60)}\n`);

      return existingSkill;
    }

    // 내부 DB에 없음 → Wowhead 검증 진행
    console.log(`\n⚠️ 내부 DB에 없음 - Wowhead 검증 시작`);

    // ========================================
    // STAGE 2: Wowhead Extraction
    // ========================================

    // 1. 스킬 ID 검색
    const skillId = await searchSkillId(skillName, className);
    if (!skillId) {
      console.error(`❌ 스킬 ID를 찾을 수 없습니다: ${skillName}`);
      return null;
    }

    // 2. 스킬 데이터 추출
    const skillData = await extractSkillData(skillId);
    if (!skillData) {
      console.error(`❌ 스킬 데이터를 추출할 수 없습니다: ${skillId}`);
      return null;
    }

    // ========================================
    // STAGE 3: Mid-validation (Conflict Detection)
    // ========================================
    const midValidation = validator.validateAfterExtraction(skillData, className);

    if (midValidation.status === 'CONFLICT_DETECTED') {
      console.warn(`\n⚠️⚠️⚠️ 충돌 감지! 사용자 확인 필요 ⚠️⚠️⚠️`);
      console.warn(midValidation.message);
      console.warn(`\n추출된 번역: "${skillData.koreanName}"`);
      console.warn(`유사한 기존 번역:\n${midValidation.conflicts.map(c =>
        `  - "${c.existing}" (${c.englishName}) [유사도 ${(c.similarity * 100).toFixed(1)}%]`
      ).join('\n')}`);
      console.warn(`\n⚠️ 계속 진행하려면 수동 확인 필요!`);
      console.warn(`   옵션 1: 기존 번역 사용 (추천)`);
      console.warn(`   옵션 2: 새 번역 사용 (신중히 결정)`);

      // 충돌 정보 포함하여 반환 (사용자가 선택할 수 있도록)
      skillData.conflict = {
        detected: true,
        conflicts: midValidation.conflicts,
        action: 'USER_CONFIRMATION_REQUIRED'
      };
    }

    // ========================================
    // STAGE 4: Add to Database
    // ========================================

    // 3. DB에 추가
    const success = await addSkillToDatabase(skillData, className);
    if (!success) {
      console.error(`❌ DB 추가 실패: ${skillData.koreanName}`);
      return null;
    }

    // ========================================
    // STAGE 5: Post-validation (Optional)
    // ========================================
    if (!skillData.conflict) {
      const postValidation = validator.validateAfterAddition(
        skillData.englishName,
        skillData.koreanName,
        className
      );

      console.log(`\n📊 최종 검증:`);
      console.log(`   ${postValidation.message}`);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('  스킬 자동 검색 완료');
    console.log(`${'='.repeat(60)}\n`);

    return skillData;

  } catch (error) {
    console.error(`❌ 스킬 자동 검색 실패: ${error.message}`);
    return null;
  }
};

/**
 * 배치 검색: 여러 스킬 동시 처리
 * @param {string[]} skillNames - 스킬명 배열
 * @param {string} className - 클래스명
 * @returns {Promise<object[]>} 추가된 스킬 데이터 배열
 */
export const searchAndAddSkillsBatch = async (skillNames, className) => {
  const results = [];

  for (const skillName of skillNames) {
    try {
      const skillData = await searchAndAddSkill(skillName, className);
      if (skillData) results.push(skillData);

      // Rate limiting (Wowhead 부하 방지)
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
      console.error(`❌ 스킬 처리 실패 (${skillName}): ${error.message}`);
    }
  }

  console.log(`\n✅ 배치 처리 완료: ${results.length}/${skillNames.length}개 성공\n`);
  return results;
};
