/**
 * 스킬 리졸버
 *
 * Maxroll에서 추출한 영문 스킬명을 내부 DB와 매칭하고,
 * 누락된 스킬은 Wowhead에서 자동으로 스크래핑합니다.
 *
 * 사용법:
 *   node skill-resolver.js <extracted-guide-data.json>
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 내부 스킬 DB 경로
const SKILL_DB_PATH = path.join(__dirname, '../database-builder/tww-s3-complete-database-enhanced.json');

// 스킬명 정규화 (공백, 하이픈, 대소문자 통일)
function normalizeSkillName(name) {
  return name
    .toLowerCase()
    .replace(/[-_\s]/g, '')
    .trim();
}

/**
 * 내부 DB에서 스킬 검색
 * @param {string} englishName - 영문 스킬명
 * @param {string} className - 클래스명 (WARRIOR, MAGE, etc.)
 * @returns {Object|null} 매칭된 스킬 객체 또는 null
 */
function searchInternalDB(englishName, className) {
  if (!fs.existsSync(SKILL_DB_PATH)) {
    console.warn(`⚠️  내부 DB 파일 없음: ${SKILL_DB_PATH}`);
    return null;
  }

  const db = JSON.parse(fs.readFileSync(SKILL_DB_PATH, 'utf8'));
  const classLower = className.toLowerCase();

  // 클래스 데이터 확인
  if (!db[classLower]) {
    console.warn(`⚠️  클래스 데이터 없음: ${className}`);
    return null;
  }

  const normalizedSearch = normalizeSkillName(englishName);

  // 정확 매칭 시도
  for (const [skillId, skillData] of Object.entries(db[classLower])) {
    const normalizedDB = normalizeSkillName(skillData.englishName || '');

    if (normalizedDB === normalizedSearch) {
      console.log(`✅ 매칭 성공: ${englishName} → ${skillData.koreanName} (ID: ${skillId})`);
      return {
        id: skillId,
        ...skillData
      };
    }
  }

  // 유사도 매칭 (Levenshtein Distance)
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const [skillId, skillData] of Object.entries(db[classLower])) {
    const normalizedDB = normalizeSkillName(skillData.englishName || '');
    const distance = levenshteinDistance(normalizedSearch, normalizedDB);

    // 거리 3 이하면 유사한 것으로 판단
    if (distance < bestDistance && distance <= 3) {
      bestDistance = distance;
      bestMatch = {
        id: skillId,
        ...skillData
      };
    }
  }

  if (bestMatch) {
    console.log(`🔍 유사 매칭: ${englishName} → ${bestMatch.koreanName} (거리: ${bestDistance})`);
    return bestMatch;
  }

  console.warn(`❌ 매칭 실패: ${englishName}`);
  return null;
}

/**
 * Levenshtein Distance 계산 (유사도 측정)
 * @param {string} a - 문자열 A
 * @param {string} b - 문자열 B
 * @returns {number} 편집 거리
 */
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Wowhead에서 스킬 정보 스크래핑
 * @param {string} skillName - 영문 스킬명
 * @param {string} className - 클래스명
 * @returns {Object} 스킬 데이터
 */
async function scrapeWowhead(skillName, className) {
  console.log(`🌐 Wowhead 스크래핑: ${skillName}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Wowhead 검색 URL (영문)
    const searchURL = `https://www.wowhead.com/search?q=${encodeURIComponent(skillName)}`;
    await page.goto(searchURL, { waitUntil: 'networkidle', timeout: 15000 });

    // 첫 번째 검색 결과 클릭 (스킬 페이지로 이동)
    const firstResult = await page.locator('.listview-cleartext a').first();
    const href = await firstResult.getAttribute('href');

    if (!href || !href.includes('/spell=')) {
      throw new Error('스킬 검색 결과 없음');
    }

    // 스킬 ID 추출
    const skillIdMatch = href.match(/spell=(\d+)/);
    const skillId = skillIdMatch ? skillIdMatch[1] : null;

    if (!skillId) {
      throw new Error('스킬 ID 추출 실패');
    }

    // 한글 페이지로 이동
    const koURL = `https://ko.wowhead.com/spell=${skillId}`;
    await page.goto(koURL, { waitUntil: 'networkidle', timeout: 15000 });

    // 스킬 데이터 추출
    const skillData = await page.evaluate(() => {
      const title = document.querySelector('.heading-size-1')?.textContent?.trim() || '';
      const iconElement = document.querySelector('[class*="iconsmall"]');
      const iconUrl = iconElement?.src || '';
      const iconMatch = iconUrl.match(/\/([^\/]+)\.(jpg|png)$/);
      const icon = iconMatch ? iconMatch[1] : '';

      const description = document.querySelector('.wowhead-tooltip-item-description')?.textContent?.trim() || '';

      return {
        koreanName: title,
        icon: icon,
        description: description
      };
    });

    // 영문 페이지에서 영문명 추출
    const enURL = `https://www.wowhead.com/spell=${skillId}`;
    await page.goto(enURL, { waitUntil: 'networkidle', timeout: 15000 });

    const englishName = await page.evaluate(() => {
      return document.querySelector('.heading-size-1')?.textContent?.trim() || '';
    });

    await browser.close();

    const result = {
      id: skillId,
      koreanName: skillData.koreanName,
      englishName: englishName,
      icon: skillData.icon,
      description: skillData.description,
      cooldown: '없음',  // TODO: 세부 정보 테이블에서 추출
      castTime: '즉시',
      range: '근접',
      resourceCost: '없음',
      resourceGain: '없음',
      type: '기본',
      spec: '공용',
      level: 1,
      pvp: false
    };

    console.log(`✅ Wowhead 스크래핑 성공: ${result.koreanName}`);
    return result;

  } catch (error) {
    await browser.close();
    console.error(`❌ Wowhead 스크래핑 실패: ${error.message}`);
    return null;
  }
}

/**
 * Maxroll 추출 데이터의 모든 스킬 리졸빙
 * @param {Object} extractedData - Maxroll 파서 출력 데이터
 * @returns {Object} 리졸빙된 스킬 데이터
 */
async function resolveAllSkills(extractedData) {
  const { metadata, data } = extractedData;
  const resolvedSkills = {};
  const missingSkills = [];

  console.log('\n🔍 스킬 리졸빙 시작...\n');

  // 단일 대상 Rotation 스킬 리졸빙
  for (const item of data.rotation.singleTarget) {
    const skillName = item.skill;

    if (!skillName) continue;

    // 내부 DB 검색
    let skillData = searchInternalDB(skillName, metadata.className);

    // 내부 DB에 없으면 Wowhead 스크래핑
    if (!skillData) {
      console.log(`📥 누락 스킬 감지: ${skillName} - Wowhead에서 가져오는 중...`);
      skillData = await scrapeWowhead(skillName, metadata.className);

      if (skillData) {
        missingSkills.push(skillData);
      } else {
        console.error(`❌ 스킬 데이터 획득 실패: ${skillName}`);
        continue;
      }
    }

    // camelCase 키 생성 (예: "Rampage" → "rampage")
    const camelKey = skillName.charAt(0).toLowerCase() + skillName.slice(1).replace(/\s+/g, '');
    resolvedSkills[camelKey] = skillData;

    // Rotation 항목의 skill 필드를 객체로 교체
    item.skillData = skillData;
  }

  console.log(`\n✅ 리졸빙 완료: ${Object.keys(resolvedSkills).length}개 스킬`);
  console.log(`📥 신규 스킬: ${missingSkills.length}개\n`);

  return {
    resolvedSkills,
    missingSkills,
    updatedRotation: data.rotation
  };
}

/**
 * 스킬 데이터 파일 생성
 * @param {Object} resolvedSkills - 리졸빙된 스킬 객체
 * @param {string} className - 클래스명
 * @param {string} spec - 전문화명
 */
function generateSkillDataFile(resolvedSkills, className, spec) {
  const fileName = `${spec}${className.charAt(0) + className.slice(1).toLowerCase()}SkillData.js`;
  const outputPath = path.join(__dirname, '../src/data', fileName);

  const fileContent = `/**
 * ${className} ${spec} 스킬 데이터
 *
 * 자동 생성됨: ${new Date().toISOString()}
 * 출처: Maxroll + Internal DB + Wowhead
 */

export const ${spec}${className.charAt(0) + className.slice(1).toLowerCase()}Skills = ${JSON.stringify(resolvedSkills, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log(`💾 스킬 데이터 파일 생성: ${outputPath}`);
}

/**
 * 내부 DB에 누락 스킬 추가
 * @param {Array} missingSkills - 누락 스킬 배열
 * @param {string} className - 클래스명
 */
function updateInternalDB(missingSkills, className) {
  if (missingSkills.length === 0) {
    console.log('✅ 내부 DB 업데이트 불필요 (누락 스킬 없음)');
    return;
  }

  const db = JSON.parse(fs.readFileSync(SKILL_DB_PATH, 'utf8'));
  const classLower = className.toLowerCase();

  if (!db[classLower]) {
    db[classLower] = {};
  }

  missingSkills.forEach(skill => {
    db[classLower][skill.id] = skill;
  });

  fs.writeFileSync(SKILL_DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`💾 내부 DB 업데이트 완료: ${missingSkills.length}개 스킬 추가`);
}

// CLI 실행
async function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error('❌ 사용법: node skill-resolver.js <extracted-guide-data.json>');
    process.exit(1);
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ 파일 없음: ${inputPath}`);
    process.exit(1);
  }

  try {
    // 1. 추출 데이터 로드
    const extractedData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

    // 2. 스킬 리졸빙
    const { resolvedSkills, missingSkills, updatedRotation } = await resolveAllSkills(extractedData);

    // 3. 스킬 데이터 파일 생성
    generateSkillDataFile(
      resolvedSkills,
      extractedData.metadata.className,
      extractedData.metadata.spec
    );

    // 4. 내부 DB 업데이트
    updateInternalDB(missingSkills, extractedData.metadata.className);

    // 5. 업데이트된 Rotation 데이터 저장
    const outputPath = inputPath.replace('.json', '-resolved.json');
    extractedData.data.rotation = updatedRotation;
    extractedData.resolvedSkills = resolvedSkills;

    fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2), 'utf8');
    console.log(`\n✅ 스킬 리졸빙 완료!`);
    console.log(`📁 출력 파일: ${outputPath}`);

  } catch (error) {
    console.error('❌ 실행 실패:', error.message);
    process.exit(1);
  }
}

// 모듈로 사용할 경우
if (require.main === module) {
  main();
} else {
  module.exports = {
    resolveAllSkills,
    searchInternalDB,
    scrapeWowhead,
    generateSkillDataFile,
    updateInternalDB
  };
}
