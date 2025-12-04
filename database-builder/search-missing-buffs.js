/**
 * Wowhead 버프/메커니즘 데이터 자동 추출 스크립트
 *
 * 목적: ArcaneMageGuide에서 누락된 버프/메커니즘 용어를 ko.wowhead.com에서 자동으로 찾아 데이터 추출
 *
 * 프로세스:
 * 1. ko.wowhead.com에서 한글명으로 검색
 * 2. 첫 번째 검색 결과에서 스킬 ID 추출
 * 3. ko.wowhead.com/spell={id}에서 한글명, 아이콘, 설명 추출
 * 4. wowhead.com/spell={id}에서 영문명 추출
 * 5. 완전한 스킬 데이터 객체 생성 및 JSON 저장
 *
 * 사용법:
 * node database-builder/search-missing-buffs.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 추출할 누락된 용어
const missingTerms = [
  { korean: '비전 충전물', english: 'Arcane Charges' },
  { korean: '마나', english: 'Mana' },
  { korean: '비전 조화', english: 'Arcane Harmony' }
];

/**
 * ko.wowhead.com에서 한글명으로 검색하여 스킬 ID 추출
 * @param {string} koreanName - 검색할 한글 스킬명
 * @returns {Promise<{koreanName: string, skillId: number|null, url: string|null}>}
 */
async function searchWowheadId(koreanName) {
  console.log(`🔍 검색 중: ${koreanName}...`);

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      timeout: 60000
    });
    const page = await browser.newPage();

    // 1. ko.wowhead.com 검색 페이지 접속
    const searchUrl = `https://ko.wowhead.com/?search=${encodeURIComponent(koreanName)}`;
    console.log(`   → 검색 URL: ${searchUrl}`);

    await page.goto(searchUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // 2. 첫 번째 검색 결과 링크 추출
    const firstResult = await page.evaluate(() => {
      // 검색 결과 리스트에서 첫 번째 spell 링크 찾기
      const link = document.querySelector('.listview-cleartext a[href*="/spell="]');
      return link ? link.href : null;
    });

    if (!firstResult) {
      console.log(`   ❌ ${koreanName}: 검색 결과 없음`);
      await browser.close();
      return { koreanName, skillId: null, url: null };
    }

    // 3. URL에서 스킬 ID 추출 (예: https://ko.wowhead.com/spell=263725/)
    const match = firstResult.match(/spell=(\d+)/);
    const skillId = match ? parseInt(match[1]) : null;

    if (skillId) {
      console.log(`   ✅ ${koreanName}: 스킬 ID ${skillId} 찾음`);
    } else {
      console.log(`   ⚠️ ${koreanName}: URL에서 ID 추출 실패 (${firstResult})`);
    }

    await browser.close();
    return { koreanName, skillId, url: firstResult };

  } catch (error) {
    console.error(`   ❌ ${koreanName} 검색 실패:`, error.message);
    if (browser) await browser.close();
    return { koreanName, skillId: null, url: null };
  }
}

/**
 * Wowhead 스킬 페이지에서 완전한 스킬 데이터 추출
 * @param {number} skillId - 추출할 스킬 ID
 * @returns {Promise<Object>} 완전한 스킬 데이터 객체
 */
async function extractSkillData(skillId) {
  console.log(`📥 스킬 ID ${skillId} 데이터 추출 중...`);

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      timeout: 60000
    });
    const page = await browser.newPage();

    // 1. 한국어 페이지에서 데이터 추출
    const koUrl = `https://ko.wowhead.com/spell=${skillId}`;
    console.log(`   → 한국어 페이지: ${koUrl}`);

    await page.goto(koUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const koreanData = await page.evaluate(() => {
      // 스킬명 (페이지 제목)
      const title = document.querySelector('.heading-size-1')?.textContent?.trim();

      // 스킬 설명 (툴팁)
      const descriptionElement = document.querySelector('.wowhead-tooltip-item-description');
      const description = descriptionElement?.textContent?.trim() || '';

      // 아이콘 URL에서 아이콘명 추출
      const iconImg = document.querySelector('.iconsmall, .iconmedium, .iconlarge');
      const iconUrl = iconImg?.src || '';
      // 예: https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg
      const iconMatch = iconUrl.match(/icons\/[^/]+\/([^.]+)/);
      const icon = iconMatch ? iconMatch[1] : null;

      return {
        koreanName: title,
        icon: icon,
        description: description
      };
    });

    console.log(`   ✅ 한글명: ${koreanData.koreanName}`);
    console.log(`   ✅ 아이콘: ${koreanData.icon}`);
    console.log(`   ✅ 설명: ${koreanData.description.substring(0, 50)}...`);

    // 2. 영어 페이지에서 영문명 추출
    const enUrl = `https://wowhead.com/spell=${skillId}`;
    console.log(`   → 영어 페이지: ${enUrl}`);

    await page.goto(enUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const englishName = await page.evaluate(() => {
      const title = document.querySelector('.heading-size-1')?.textContent?.trim();
      return title || '';
    });

    console.log(`   ✅ 영문명: ${englishName}`);

    await browser.close();

    // 3. 완전한 스킬 데이터 객체 생성
    return {
      id: skillId,
      koreanName: koreanData.koreanName || '',
      englishName: englishName || '',
      icon: koreanData.icon || 'inv_misc_questionmark',
      description: koreanData.description || '',
      cooldown: '없음',
      castTime: '패시브',
      range: '자신',
      resourceCost: '없음',
      resourceGain: '없음',
      type: '메커니즘',
      spec: 'arcane',
      level: 1,
      pvp: false
    };

  } catch (error) {
    console.error(`   ❌ 스킬 ID ${skillId} 데이터 추출 실패:`, error.message);
    if (browser) await browser.close();
    return null;
  }
}

/**
 * 모든 누락된 용어를 검색하고 데이터 추출
 */
async function searchAll() {
  console.log('\n=== Wowhead 버프/메커니즘 데이터 자동 추출 시작 ===\n');
  console.log(`추출할 용어: ${missingTerms.length}개`);
  missingTerms.forEach(term => {
    console.log(`  - ${term.korean} (${term.english})`);
  });
  console.log('\n');

  const results = [];
  const notFound = [];

  for (let i = 0; i < missingTerms.length; i++) {
    const term = missingTerms[i];
    console.log(`\n[${i + 1}/${missingTerms.length}] 처리 중: ${term.korean}`);
    console.log('─'.repeat(50));

    // 1단계: 스킬 ID 검색
    const searchResult = await searchWowheadId(term.korean);

    if (searchResult.skillId) {
      // 2단계: 스킬 데이터 추출
      const skillData = await extractSkillData(searchResult.skillId);

      if (skillData) {
        results.push(skillData);
        console.log(`✅ ${term.korean}: 데이터 추출 완료`);
      } else {
        notFound.push({ ...term, reason: '데이터 추출 실패' });
        console.log(`❌ ${term.korean}: 데이터 추출 실패`);
      }
    } else {
      notFound.push({ ...term, reason: 'Wowhead에서 찾을 수 없음' });
      console.log(`❌ ${term.korean}: Wowhead에서 찾을 수 없음 (수동 추가 필요)`);
    }

    // Rate limiting: 2초 대기 (CLAUDE.md 지침)
    if (i < missingTerms.length - 1) {
      console.log('\n⏳ 2초 대기 중... (Rate limiting)');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // 결과 저장
  const outputPath = path.join(__dirname, 'extracted-buffs.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  // 요약 출력
  console.log('\n\n=== 추출 완료 ===\n');
  console.log(`✅ 성공: ${results.length}개`);
  console.log(`❌ 실패: ${notFound.length}개`);

  if (results.length > 0) {
    console.log('\n📄 추출된 데이터:');
    results.forEach(skill => {
      console.log(`  - ${skill.koreanName} (${skill.englishName}) [ID: ${skill.id}]`);
    });
    console.log(`\n💾 저장 위치: ${outputPath}`);
  }

  if (notFound.length > 0) {
    console.log('\n⚠️ 수동 추가 필요:');
    notFound.forEach(term => {
      console.log(`  - ${term.korean} (${term.english}) - ${term.reason}`);
    });
    console.log('\n📝 이 용어들은 기본 리소스이거나 Wowhead에 독립 페이지가 없을 수 있습니다.');
    console.log('   arcaneMageSkillData.js에 수동으로 추가해야 합니다.');
  }

  console.log('\n=== 작업 완료 ===\n');
}

// 스크립트 실행
if (require.main === module) {
  searchAll()
    .then(() => {
      console.log('✅ 모든 작업이 완료되었습니다.');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ 치명적 오류 발생:', error);
      process.exit(1);
    });
}

module.exports = { searchWowheadId, extractSkillData, searchAll };
