/**
 * scrape-maxroll-guide.js
 * Maxroll 가이드 데이터 수집 및 캐싱 시스템
 *
 * 사용법:
 *   node scripts/scrape-maxroll-guide.js deathknight frost
 *   node scripts/scrape-maxroll-guide.js mage arcane
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 캐시 디렉토리
const CACHE_DIR = path.join(__dirname, '..', 'database-builder', 'maxroll-cache');

/**
 * Maxroll URL 생성
 */
const getMaxrollUrl = (className, specName) => {
  return `https://maxroll.gg/wow/class-guides/${className}-${specName}-pve-dps-guide`;
};

/**
 * 영웅 특성 추출
 */
const extractHeroTalents = async (page) => {
  try {
    // Maxroll의 영웅 특성 섹션 찾기
    await page.waitForSelector('text=Hero Talents', { timeout: 5000 });

    const heroTalents = await page.evaluate(() => {
      const section = document.querySelector('[id*="hero"], [id*="Hero"]');
      if (!section) return [];

      // 헤더 텍스트에서 영웅 특성명 추출
      const headers = Array.from(section.querySelectorAll('h3, h4, h5'));
      return headers
        .map(h => h.textContent.trim())
        .filter(text => text && text.length > 3 && text.length < 50);
    });

    return heroTalents;
  } catch (error) {
    console.warn('⚠️  영웅 특성 추출 실패:', error.message);
    return [];
  }
};

/**
 * 로테이션 추출
 */
const extractRotation = async (page) => {
  try {
    await page.waitForSelector('text=Rotation', { timeout: 5000 });

    const rotation = await page.evaluate(() => {
      const rotationSection = document.querySelector('[id*="rotation"], [id*="Rotation"]');
      if (!rotationSection) return { opener: [], priority: [] };

      // 오프너 추출
      const openerList = rotationSection.querySelector('[id*="opener"] ul, [id*="Opener"] ul');
      const opener = openerList ?
        Array.from(openerList.querySelectorAll('li')).map(li => li.textContent.trim()) :
        [];

      // 우선순위 추출
      const priorityList = rotationSection.querySelector('[id*="priority"] ul, [id*="Priority"] ul');
      const priority = priorityList ?
        Array.from(priorityList.querySelectorAll('li')).map(li => li.textContent.trim()) :
        [];

      return { opener, priority };
    });

    return rotation;
  } catch (error) {
    console.warn('⚠️  로테이션 추출 실패:', error.message);
    return { opener: [], priority: [] };
  }
};

/**
 * 티어 세트 효과 추출
 */
const extractTierSet = async (page) => {
  try {
    await page.waitForSelector('text=Tier Set', { timeout: 5000 });

    const tierSet = await page.evaluate(() => {
      const tierSection = document.querySelector('[id*="tier"], [id*="Tier"]');
      if (!tierSection) return {};

      const result = {};

      // 2세트 찾기
      const twoSetElement = tierSection.querySelector('[id*="2-set"], [id*="2set"]');
      if (twoSetElement) {
        const nextP = twoSetElement.nextElementSibling;
        if (nextP && nextP.tagName === 'P') {
          result['2set'] = nextP.textContent.trim();
        }
      }

      // 4세트 찾기
      const fourSetElement = tierSection.querySelector('[id*="4-set"], [id*="4set"]');
      if (fourSetElement) {
        const nextP = fourSetElement.nextElementSibling;
        if (nextP && nextP.tagName === 'P') {
          result['4set'] = nextP.textContent.trim();
        }
      }

      return result;
    });

    return tierSet;
  } catch (error) {
    console.warn('⚠️  티어 세트 추출 실패:', error.message);
    return {};
  }
};

/**
 * 스탯 우선순위 추출
 */
const extractStatPriority = async (page) => {
  try {
    await page.waitForSelector('text=Stats', { timeout: 5000 });

    const stats = await page.evaluate(() => {
      const statsSection = document.querySelector('[id*="stats"], [id*="Stats"]');
      if (!statsSection) return [];

      // 순서대로 나열된 스탯 찾기
      const statElements = statsSection.querySelectorAll('li, p strong');
      return Array.from(statElements)
        .map(el => el.textContent.trim())
        .filter(text =>
          ['haste', 'mastery', 'critical', 'versatility', 'crit'].some(stat =>
            text.toLowerCase().includes(stat)
          )
        )
        .slice(0, 4); // 상위 4개만
    });

    return stats;
  } catch (error) {
    console.warn('⚠️  스탯 우선순위 추출 실패:', error.message);
    return [];
  }
};

/**
 * 메커니즘 추출
 */
const extractMechanics = async (page) => {
  try {
    await page.waitForSelector('text=Mechanics', { timeout: 5000 });

    const mechanics = await page.evaluate(() => {
      const mechanicsSection = document.querySelector('[id*="mechanic"], [id*="Mechanic"]');
      if (!mechanicsSection) return {};

      const result = {};
      const headers = mechanicsSection.querySelectorAll('h4, h5');

      headers.forEach(header => {
        const mechanicName = header.textContent.trim();
        const nextP = header.nextElementSibling;
        if (nextP && nextP.tagName === 'P') {
          result[mechanicName] = nextP.textContent.trim();
        }
      });

      return result;
    });

    return mechanics;
  } catch (error) {
    console.warn('⚠️  메커니즘 추출 실패:', error.message);
    return {};
  }
};

/**
 * 메인 스크래핑 함수
 */
const scrapeMaxrollGuide = async (className, specName) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Maxroll 가이드 데이터 수집: ${className} ${specName}`);
  console.log(`${'='.repeat(60)}\n`);

  const url = getMaxrollUrl(className, specName);
  console.log(`📍 URL: ${url}\n`);

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  try {
    // 페이지 로드
    console.log('⏳ 페이지 로딩 중...');
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('✅ 페이지 로드 완료\n');

    // 데이터 추출
    console.log('📊 데이터 추출 중...');

    const maxrollData = {
      className,
      specName,
      url,
      lastUpdated: new Date().toISOString(),
      heroTalents: await extractHeroTalents(page),
      rotation: await extractRotation(page),
      tierSet: await extractTierSet(page),
      stats: await extractStatPriority(page),
      mechanics: await extractMechanics(page)
    };

    // 결과 출력
    console.log('\n' + '─'.repeat(60));
    console.log('📋 추출 결과:');
    console.log('─'.repeat(60));
    console.log(`영웅 특성: ${maxrollData.heroTalents.length}개`);
    maxrollData.heroTalents.forEach(ht => console.log(`  - ${ht}`));
    console.log(`\n로테이션:`);
    console.log(`  오프너: ${maxrollData.rotation.opener.length}개 스킬`);
    console.log(`  우선순위: ${maxrollData.rotation.priority.length}개 항목`);
    console.log(`\n티어 세트:`);
    console.log(`  2세트: ${maxrollData.tierSet['2set'] ? '✅' : '❌'}`);
    console.log(`  4세트: ${maxrollData.tierSet['4set'] ? '✅' : '❌'}`);
    console.log(`\n스탯 우선순위: ${maxrollData.stats.length}개`);
    maxrollData.stats.forEach(stat => console.log(`  - ${stat}`));
    console.log(`\n메커니즘: ${Object.keys(maxrollData.mechanics).length}개`);
    console.log('─'.repeat(60));

    // 캐시 저장
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const cacheFile = path.join(CACHE_DIR, `${className}-${specName}.json`);
    await fs.writeFile(cacheFile, JSON.stringify(maxrollData, null, 2), 'utf-8');

    console.log(`\n✅ 캐시 저장 완료: ${cacheFile}`);

    return maxrollData;

  } catch (error) {
    console.error(`\n❌ 스크래핑 실패: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
  }
};

/**
 * CLI 실행
 */
const main = async () => {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('사용법: node scripts/scrape-maxroll-guide.js <className> <specName>');
    console.error('예시: node scripts/scrape-maxroll-guide.js deathknight frost');
    process.exit(1);
  }

  const [className, specName] = args;

  try {
    await scrapeMaxrollGuide(className, specName);
    console.log('\n✅ 작업 완료!\n');
  } catch (error) {
    console.error('\n❌ 작업 실패:', error.message);
    process.exit(1);
  }
};

// ES Module에서 직접 실행 여부 확인
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { scrapeMaxrollGuide };
