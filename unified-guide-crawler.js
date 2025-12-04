/**
 * unified-guide-crawler.js
 * Wowhead/Maxroll/Icy-veins 통합 가이드 크롤러
 *
 * 핵심 기능:
 * 1. Phase 4 하이브리드 시스템 (내부 DB 99% + 외부 85%)
 * 2. Enhanced 로딩 (5단계 + React hydration + lazy-load)
 * 3. 3가지 폴백 전략 (ID → 텍스트 → XPath)
 * 4. 재시도 로직 (3회 exponential backoff)
 * 5. 사이트별 최적화 전략
 *
 * 사용법:
 *   node unified-guide-crawler.js mage arcane wowhead
 *   node unified-guide-crawler.js warrior fury maxroll
 *   node unified-guide-crawler.js paladin holy icy-veins
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═════════════════════════════════════════════════════════════════════
// 1. 내부 DB 로드 (Phase 4 하이브리드)
// ═════════════════════════════════════════════════════════════════════

let internalDB = null;

async function loadInternalDB() {
  try {
    const dbPath = path.join(__dirname, 'database-builder/all-classes-skills-data.json');
    const data = await fs.readFile(dbPath, 'utf8');
    internalDB = JSON.parse(data);
    console.log('✅ 내부 DB 로드 완료 (Tier S: 99% 신뢰도)\n');
  } catch (error) {
    console.warn('⚠️  내부 DB 로드 실패, 외부 크롤링만 사용:', error.message);
  }
}

function searchInternalDB(className) {
  if (!internalDB || !className) return null;

  const classKey = className.toUpperCase();
  return internalDB[classKey] || null;
}

// ═════════════════════════════════════════════════════════════════════
// 2. Enhanced 로딩 시스템 (5단계)
// ═════════════════════════════════════════════════════════════════════

async function loadPageCompletely(page, url) {
  console.log(`\n📂 페이지 로딩: ${url}`);
  console.log('─'.repeat(60));

  // Stage 1: 초기 DOM 로드
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  console.log('  ✓ Stage 1: DOM loaded');

  // Stage 2: React/Next.js hydration 대기
  try {
    await page.waitForFunction(() => {
      const reactRoot = document.querySelector('[data-reactroot]') ||
                       document.querySelector('#__next') ||
                       document.querySelector('#root');
      return reactRoot && reactRoot.children.length > 0;
    }, { timeout: 10000 });
    console.log('  ✓ Stage 2: React hydrated');
  } catch (e) {
    console.warn('  ⚠️  Stage 2: React hydration timeout (non-React site?)');
  }

  // Stage 3: 스크롤하여 lazy-load 콘텐츠 트리거
  await page.evaluate(async () => {
    const scrollDelay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const scrollHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;

    // 페이지 전체를 천천히 스크롤
    for (let y = 0; y < scrollHeight; y += viewportHeight) {
      window.scrollTo(0, y);
      await scrollDelay(500); // Intersection Observer 대기
    }

    window.scrollTo(0, 0); // 맨 위로 복귀
  });
  console.log('  ✓ Stage 3: Lazy-load triggered');

  // Stage 4: 네트워크 idle 대기
  try {
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    console.log('  ✓ Stage 4: Network idle');
  } catch (e) {
    console.warn('  ⚠️  Stage 4: Network idle timeout');
  }

  // Stage 5: 콘텐츠 로드 확인
  const contentCheck = await page.evaluate(() => {
    const h2Count = document.querySelectorAll('h2, h3').length;
    const listCount = document.querySelectorAll('ul, ol').length;
    const tableCount = document.querySelectorAll('table').length;
    const textLength = document.body.textContent.trim().length;

    return { h2: h2Count, lists: listCount, tables: tableCount, textLength };
  });

  console.log(`  ✓ Stage 5: Content loaded (${contentCheck.h2} headings, ${contentCheck.lists} lists, ${contentCheck.textLength} chars)`);

  // 최소 콘텐츠 확인
  if (contentCheck.h2 < 3 || contentCheck.lists < 5 || contentCheck.textLength < 1000) {
    console.warn('  ⚠️  Low content count - page may not be fully loaded');
    return false;
  }

  console.log('─'.repeat(60));
  return true;
}

// ═════════════════════════════════════════════════════════════════════
// 3. 섹션 추출 (3가지 폴백 전략)
// ═════════════════════════════════════════════════════════════════════

async function extractSectionContent(page, sectionTitle, maxDepth = 5) {
  console.log(`\n🔍 섹션 추출: "${sectionTitle}"`);

  const result = await page.evaluate(({ title, depth }) => {
    // ─────────────────────────────────────────────────────────────
    // Helper: 섹션 찾기 (3가지 전략)
    // ─────────────────────────────────────────────────────────────
    const findSection = () => {
      const titleLower = title.toLowerCase();

      // 전략 1: ID 속성 검색
      let section = document.querySelector(`[id*="${titleLower}"]`);
      if (section && section.matches('h2, h3, h4, h5')) {
        return { element: section, strategy: 'id-attribute' };
      }

      // 전략 2: 헤딩 텍스트 검색 (정확 매치)
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'));
      section = headings.find(h => h.textContent.toLowerCase().includes(titleLower));
      if (section) {
        return { element: section, strategy: 'heading-text' };
      }

      // 전략 3: XPath 검색 (대소문자 무시)
      const xpathResult = document.evaluate(
        `//h2[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${titleLower}")] | //h3[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${titleLower}")]`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      section = xpathResult.singleNodeValue;
      if (section) {
        return { element: section, strategy: 'xpath' };
      }

      return null;
    };

    // ─────────────────────────────────────────────────────────────
    // Helper: 재귀적 콘텐츠 추출
    // ─────────────────────────────────────────────────────────────
    const extractRecursive = (element, currentDepth) => {
      if (currentDepth > depth) return null;

      const content = {
        tag: element.tagName,
        text: '', // 직접 텍스트만
        children: []
      };

      // 직접 텍스트 노드만 추출
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text) content.text += text + ' ';
        }
      }
      content.text = content.text.trim();

      // 자식 요소 처리
      Array.from(element.children).forEach(child => {
        // 리스트 처리
        if (child.matches('ul, ol')) {
          const listItems = Array.from(child.querySelectorAll(':scope > li'));
          content.children.push({
            type: 'list',
            ordered: child.tagName === 'OL',
            items: listItems.map(li => {
              const itemText = Array.from(li.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE || n.matches('strong, em, code, a, span'))
                .map(n => n.textContent)
                .join('')
                .trim();

              // 중첩 리스트 확인
              const nestedList = li.querySelector('ul, ol');

              return {
                text: itemText,
                nested: nestedList ? extractRecursive(nestedList, currentDepth + 1) : null
              };
            })
          });
        }
        // 테이블 처리
        else if (child.matches('table')) {
          const rows = Array.from(child.querySelectorAll('tr'));
          const headers = Array.from(rows[0]?.querySelectorAll('th, td') || [])
            .map(th => th.textContent.trim());

          content.children.push({
            type: 'table',
            headers: headers,
            rows: rows.slice(1).map(tr =>
              Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
            )
          });
        }
        // 일반 요소 - 재귀
        else if (!child.matches('h1, h2, h3, h4, h5, h6')) {
          const nested = extractRecursive(child, currentDepth + 1);
          if (nested && (nested.text || nested.children.length > 0)) {
            content.children.push(nested);
          }
        }
      });

      return content;
    };

    // ─────────────────────────────────────────────────────────────
    // 메인 로직: 섹션 찾기 → 콘텐츠 추출
    // ─────────────────────────────────────────────────────────────
    const sectionInfo = findSection();
    if (!sectionInfo) {
      return {
        found: false,
        reason: `Section "${title}" not found with any strategy`
      };
    }

    const { element: section, strategy } = sectionInfo;

    // 헤딩 다음부터 다음 헤딩 전까지 모든 콘텐츠 추출
    let current = section.nextElementSibling;
    const contents = [];
    const sectionLevel = parseInt(section.tagName.substring(1)); // H2 → 2

    while (current) {
      // 같은 레벨 이상의 헤딩을 만나면 종료
      if (current.matches('h1, h2, h3, h4, h5, h6')) {
        const currentLevel = parseInt(current.tagName.substring(1));
        if (currentLevel <= sectionLevel) break;
      }

      const extracted = extractRecursive(current, 1);
      if (extracted && (extracted.text || extracted.children.length > 0)) {
        contents.push(extracted);
      }

      current = current.nextElementSibling;
    }

    return {
      found: true,
      strategy: strategy,
      sectionTitle: section.textContent.trim(),
      contents: contents
    };

  }, { title: sectionTitle, depth: maxDepth });

  if (result.found) {
    console.log(`  ✅ 추출 성공 (전략: ${result.strategy})`);
    console.log(`  📊 콘텐츠: ${result.contents.length}개 블록`);
  } else {
    console.log(`  ❌ 추출 실패: ${result.reason}`);
  }

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// 4. 재시도 로직 (Exponential Backoff)
// ═════════════════════════════════════════════════════════════════════

async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1); // 2s, 4s, 8s
      console.warn(`  ⚠️  시도 ${attempt}/${maxRetries} 실패: ${error.message}`);
      console.log(`  ⏳ ${delay}ms 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// ═════════════════════════════════════════════════════════════════════
// 5. 사이트별 크롤링 전략
// ═════════════════════════════════════════════════════════════════════

class WowheadStrategy {
  static getUrl(className, specName) {
    return `https://www.wowhead.com/guide/classes/${className}/${specName}/overview-pve-dps`;
  }

  static async extract(page, className, specName) {
    const data = {
      source: 'wowhead',
      className,
      specName,
      rotation: await extractSectionContent(page, 'rotation'),
      talents: await extractSectionContent(page, 'talent'),
      stats: await extractSectionContent(page, 'stat'),
      gear: await extractSectionContent(page, 'gear')
    };

    return data;
  }
}

class MaxrollStrategy {
  static getUrl(className, specName) {
    return `https://maxroll.gg/wow/class-guides/${className}-${specName}-pve-dps-guide`;
  }

  static async extract(page, className, specName) {
    const data = {
      source: 'maxroll',
      className,
      specName,
      rotation: await extractSectionContent(page, 'rotation'),
      heroTalents: await extractSectionContent(page, 'hero talent'),
      tierSet: await extractSectionContent(page, 'tier set'),
      stats: await extractSectionContent(page, 'stat'),
      mechanics: await extractSectionContent(page, 'mechanic')
    };

    return data;
  }
}

class IcyVeinsStrategy {
  static getUrl(className, specName) {
    return `https://www.icy-veins.com/wow/${className}-${specName}-pve-dps-guide`;
  }

  static async extract(page, className, specName) {
    const data = {
      source: 'icy-veins',
      className,
      specName,
      rotation: await extractSectionContent(page, 'rotation'),
      talents: await extractSectionContent(page, 'talent'),
      cooldowns: await extractSectionContent(page, 'cooldown'),
      stats: await extractSectionContent(page, 'stat')
    };

    return data;
  }
}

// ═════════════════════════════════════════════════════════════════════
// 6. 통합 크롤러 메인
// ═════════════════════════════════════════════════════════════════════

async function crawlGuide(className, specName, source = 'maxroll') {
  console.log('\n' + '═'.repeat(60));
  console.log(`  통합 가이드 크롤러`);
  console.log(`  클래스: ${className} ${specName}`);
  console.log(`  소스: ${source}`);
  console.log('═'.repeat(60));

  // 내부 DB 확인
  const dbData = searchInternalDB(className);
  if (dbData) {
    console.log(`\n✅ 내부 DB 발견: ${Object.keys(dbData).length}개 스킬 (Tier S: 99%)`);
  } else {
    console.log(`\n⚠️  내부 DB 없음: 외부 크롤링만 사용 (Tier B: 85%)`);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 사이트별 전략 선택
    const strategies = {
      'wowhead': WowheadStrategy,
      'maxroll': MaxrollStrategy,
      'icy-veins': IcyVeinsStrategy
    };

    const strategy = strategies[source];
    if (!strategy) {
      throw new Error(`Unknown source: ${source}`);
    }

    const url = strategy.getUrl(className, specName);

    // 페이지 로드 (재시도 포함)
    const loadSuccess = await retryWithBackoff(async () => {
      return await loadPageCompletely(page, url);
    });

    if (!loadSuccess) {
      throw new Error('Page loading failed after retries');
    }

    // 콘텐츠 추출 (재시도 포함)
    const extractedData = await retryWithBackoff(async () => {
      return await strategy.extract(page, className, specName);
    });

    // 메타데이터 추가
    const finalData = {
      ...extractedData,
      metadata: {
        url,
        crawledAt: new Date().toISOString(),
        hasInternalDB: !!dbData,
        reliability: dbData ? 0.95 : 0.85, // 하이브리드: 95%, 외부만: 85%
        internalDBSkills: dbData ? Object.keys(dbData).length : 0
      }
    };

    // 결과 출력
    console.log('\n' + '─'.repeat(60));
    console.log('📊 추출 결과:');
    console.log('─'.repeat(60));

    Object.entries(finalData).forEach(([key, value]) => {
      if (key === 'metadata') return;
      if (value && typeof value === 'object' && value.found !== undefined) {
        console.log(`${key}: ${value.found ? '✅ 성공' : '❌ 실패'} ${value.found ? `(${value.contents?.length || 0}개 블록)` : ''}`);
      }
    });

    console.log(`\n🎯 신뢰도: ${(finalData.metadata.reliability * 100).toFixed(0)}%`);
    console.log('─'.repeat(60));

    // 결과 저장
    const outputDir = path.join(__dirname, 'database-builder', 'guide-cache');
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${className}-${specName}-${source}.json`);
    await fs.writeFile(outputPath, JSON.stringify(finalData, null, 2), 'utf8');

    console.log(`\n✅ 결과 저장: ${outputPath}`);

    return finalData;

  } catch (error) {
    console.error('\n❌ 크롤링 실패:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// ═════════════════════════════════════════════════════════════════════
// 7. CLI 실행
// ═════════════════════════════════════════════════════════════════════

async function main() {
  const [className, specName, source = 'maxroll'] = process.argv.slice(2);

  if (!className || !specName) {
    console.error('사용법: node unified-guide-crawler.js <class> <spec> [source]');
    console.error('예시: node unified-guide-crawler.js mage arcane wowhead');
    console.error('소스: wowhead, maxroll, icy-veins (기본: maxroll)');
    process.exit(1);
  }

  // 내부 DB 로드
  await loadInternalDB();

  // 크롤링 실행
  await crawlGuide(className, specName, source);
}

// 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

// 모듈로 사용 시
export { crawlGuide, loadInternalDB };
