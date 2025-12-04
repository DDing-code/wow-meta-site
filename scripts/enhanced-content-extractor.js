/**
 * Enhanced Content Extractor - 완전한 웹 콘텐츠 추출
 *
 * 문제 해결:
 * 1. 얕은 DOM 탐색 → 5단계 깊이 재귀 추출
 * 2. 하드코딩 선택자 → 3가지 폴백 전략
 * 3. 불충분한 대기 → React hydration + lazy-load 대기
 * 4. 제한적 추출 → 중첩 리스트, 테이블, 모든 텍스트
 * 5. 검증 부재 → 엄격한 품질 게이트
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════
// 1. 고급 페이지 로딩 시스템
// ═══════════════════════════════════════════════════════════════════

/**
 * 완전한 페이지 로딩 (lazy-load + React hydration 포함)
 * @param {Page} page - Playwright 페이지 객체
 * @param {string} url - 로드할 URL
 */
async function loadPageCompletely(page, url) {
  console.log(`📂 Loading: ${url}`);

  // Stage 1: 초기 DOM 로드
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  console.log('  ✓ DOM loaded');

  // Stage 2: React/Next.js hydration 대기
  try {
    await page.waitForFunction(() => {
      const reactRoot = document.querySelector('[data-reactroot]') ||
                       document.querySelector('#__next') ||
                       document.querySelector('#root');
      return reactRoot && reactRoot.children.length > 0;
    }, { timeout: 10000 });
    console.log('  ✓ React hydrated');
  } catch (e) {
    console.warn('  ⚠️  React hydration timeout (non-React site?)');
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
  console.log('  ✓ Lazy-load triggered');

  // Stage 4: 네트워크 idle 대기 (스크롤 후)
  try {
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    console.log('  ✓ Network idle');
  } catch (e) {
    console.warn('  ⚠️  Network idle timeout');
  }

  // Stage 5: 콘텐츠 로드 확인
  const contentCheck = await page.evaluate(() => {
    const h2Count = document.querySelectorAll('h2').length;
    const h3Count = document.querySelectorAll('h3').length;
    const listCount = document.querySelectorAll('ul, ol').length;
    const tableCount = document.querySelectorAll('table').length;

    return { h2: h2Count, h3: h3Count, lists: listCount, tables: tableCount };
  });

  console.log(`  ✓ Content loaded: ${contentCheck.h2} h2, ${contentCheck.h3} h3, ${contentCheck.lists} lists, ${contentCheck.tables} tables`);

  // 최소 콘텐츠 확인
  if (contentCheck.h2 < 3 || contentCheck.lists < 5) {
    console.warn('  ⚠️  Low content count - page may not be fully loaded');
  }
}

// ═══════════════════════════════════════════════════════════════════
// 2. 다층 섹션 추출 시스템 (핵심!)
// ═══════════════════════════════════════════════════════════════════

/**
 * 섹션 찾기 (3가지 폴백 전략)
 * @param {Page} page - Playwright 페이지
 * @param {string} sectionTitle - 섹션 제목 (예: "Rotation", "Talents")
 * @returns {Promise<Object>} 추출된 섹션 데이터
 */
async function extractSectionContent(page, sectionTitle, maxDepth = 5) {
  console.log(`\n🔍 Extracting section: "${sectionTitle}"`);

  const result = await page.evaluate(({ title, depth }) => {
    // ─────────────────────────────────────────────────────────────
    // Helper: 섹션 찾기 (3가지 전략)
    // ─────────────────────────────────────────────────────────────
    const findSection = () => {
      const titleLower = title.toLowerCase();

      // 전략 1: ID 속성 검색
      let section = document.querySelector(`[id*="${titleLower}"]`);
      if (section && section.matches('h2, h3, h4')) {
        return { element: section, strategy: 'id-attribute' };
      }

      // 전략 2: 헤딩 텍스트 검색
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'));
      section = headings.find(h => h.textContent.toLowerCase().includes(titleLower));
      if (section) {
        return { element: section, strategy: 'heading-text' };
      }

      // 전략 3: XPath 검색
      const xpathResult = document.evaluate(
        `//h2[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${titleLower}")]`,
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
    // Helper: 재귀적 콘텐츠 추출 (핵심!)
    // ─────────────────────────────────────────────────────────────
    const extractRecursive = (element, currentDepth) => {
      if (currentDepth > depth) return null;

      const content = {
        tag: element.tagName,
        text: '', // 직접 텍스트만 (자식 제외)
        children: []
      };

      // 직접 텍스트 노드만 추출 (자식 요소의 텍스트 제외)
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
          const listItems = Array.from(child.querySelectorAll(':scope > li')); // 직계 li만
          content.children.push({
            type: 'list',
            ordered: child.tagName === 'OL',
            items: listItems.map(li => {
              const itemText = Array.from(li.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE || n.matches('strong, em, code, a'))
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
        // 코드 블록
        else if (child.matches('pre, code')) {
          content.children.push({
            type: 'code',
            language: child.className.replace('language-', '') || 'text',
            code: child.textContent.trim()
          });
        }
        // 인용구
        else if (child.matches('blockquote')) {
          content.children.push({
            type: 'quote',
            text: child.textContent.trim()
          });
        }
        // 일반 요소 (p, div, span 등) - 재귀
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

    while (current && !current.matches(`h1, h2, h3, h4, h5, h6`)) {
      // 같은 레벨 이상의 헤딩을 만나면 종료
      if (current.matches('h1, h2, h3, h4, h5, h6')) {
        const currentLevel = parseInt(current.tagName.substring(1));
        if (currentLevel <= sectionLevel) break;
      }

      const extracted = extractRecursive(current, 0);
      if (extracted && (extracted.text || extracted.children.length > 0)) {
        contents.push(extracted);
      }

      current = current.nextElementSibling;
    }

    // 통계 계산
    const totalChars = JSON.stringify(contents).length;
    const listCount = contents.filter(c => c.children?.some(ch => ch.type === 'list')).length;
    const tableCount = contents.filter(c => c.children?.some(ch => ch.type === 'table')).length;

    return {
      found: true,
      strategy: strategy,
      sectionTitle: section.textContent.trim(),
      sectionLevel: sectionLevel,
      contents: contents,
      stats: {
        totalElements: contents.length,
        totalCharacters: totalChars,
        lists: listCount,
        tables: tableCount
      }
    };
  }, { title: sectionTitle, depth: maxDepth });

  if (!result.found) {
    console.warn(`  ❌ ${result.reason}`);
  } else {
    console.log(`  ✅ Found via ${result.strategy}: ${result.stats.totalElements} elements, ${result.stats.totalCharacters} chars`);
    console.log(`     Lists: ${result.stats.lists}, Tables: ${result.stats.tables}`);
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════
// 3. 콘텐츠 완전성 검증
// ═══════════════════════════════════════════════════════════════════

/**
 * 추출된 콘텐츠의 완전성 검증
 * @param {Object} data - 추출된 데이터
 * @param {string} spec - 전문화명
 * @returns {Object} 검증 결과
 */
function validateExtractedContent(data, spec) {
  const thresholds = {
    minTotalChars: 5000,
    minRotationChars: 2000,
    minMechanicsChars: 1000,
    minListItems: 10,
    requiredSections: ['rotation', 'talents', 'stats']
  };

  const errors = [];
  const warnings = [];

  // 총 문자 수 검증
  const totalChars = JSON.stringify(data).length;
  if (totalChars < thresholds.minTotalChars) {
    errors.push(`Total content too short: ${totalChars} < ${thresholds.minTotalChars} chars`);
  }

  // 섹션별 검증
  if (data.rotation) {
    const rotationChars = JSON.stringify(data.rotation).length;
    if (rotationChars < thresholds.minRotationChars) {
      warnings.push(`Rotation section short: ${rotationChars} chars`);
    }

    // 리스트 항목 수 확인
    const countListItems = (obj) => {
      let count = 0;
      if (obj.contents) {
        obj.contents.forEach(c => {
          if (c.children) {
            c.children.forEach(ch => {
              if (ch.type === 'list') {
                count += ch.items.length;
              }
            });
          }
        });
      }
      return count;
    };

    const listItems = countListItems(data.rotation);
    if (listItems < thresholds.minListItems) {
      warnings.push(`Few rotation items: ${listItems} < ${thresholds.minListItems}`);
    }
  }

  // 필수 섹션 확인
  thresholds.requiredSections.forEach(section => {
    if (!data[section] || !data[section].found) {
      errors.push(`Missing required section: ${section}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalChars,
      sections: Object.keys(data).filter(k => data[k]?.found).length,
      timestamp: new Date().toISOString()
    }
  };
}

// ═══════════════════════════════════════════════════════════════════
// 4. 메인 추출 함수
// ═══════════════════════════════════════════════════════════════════

/**
 * Maxroll 가이드 완전 추출
 * @param {string} className - 클래스명 (예: 'demon-hunter')
 * @param {string} spec - 전문화 (예: 'havoc')
 */
async function extractMaxrollGuide(className, spec) {
  const url = `https://maxroll.gg/wow/${className}/${spec}-guide`;

  console.log('════════════════════════════════════════════════════════════');
  console.log('  Enhanced Content Extractor - Maxroll Guide');
  console.log('════════════════════════════════════════════════════════════\n');
  console.log(`Class: ${className}`);
  console.log(`Spec: ${spec}`);
  console.log(`URL: ${url}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 완전한 페이지 로딩
    await loadPageCompletely(page, url);

    // 주요 섹션 추출
    const extractedData = {};

    const sectionsToExtract = [
      'Rotation',
      'Talents',
      'Stats',
      'Gear',
      'Hero Talents',
      'Opener',
      'Priority',
      'Mechanics',
      'Trinkets'
    ];

    for (const sectionTitle of sectionsToExtract) {
      const sectionData = await extractSectionContent(page, sectionTitle, 5);
      const key = sectionTitle.toLowerCase().replace(/\s+/g, '_');
      extractedData[key] = sectionData;
    }

    // 검증
    console.log('\n📊 Validating extracted content...');
    const validation = validateExtractedContent(extractedData, spec);

    if (!validation.valid) {
      console.error('\n❌ Validation failed:');
      validation.errors.forEach(err => console.error(`  - ${err}`));
    }

    if (validation.warnings.length > 0) {
      console.warn('\n⚠️  Warnings:');
      validation.warnings.forEach(warn => console.warn(`  - ${warn}`));
    }

    if (validation.valid && validation.warnings.length === 0) {
      console.log('\n✅ All validations passed!');
    }

    console.log(`\n📈 Final stats:`);
    console.log(`  Total characters: ${validation.stats.totalChars.toLocaleString()}`);
    console.log(`  Sections found: ${validation.stats.sections}`);

    // 파일 저장
    const outputDir = path.join(__dirname, '../database-builder/maxroll-cache');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${className}-${spec}-complete.json`);
    fs.writeFileSync(
      outputPath,
      JSON.stringify({
        metadata: {
          source: url,
          extractedAt: new Date().toISOString(),
          version: '2.0-enhanced'
        },
        validation,
        data: extractedData
      }, null, 2),
      'utf-8'
    );

    console.log(`\n💾 Saved: ${outputPath}`);

    return { success: true, data: extractedData, validation };

  } catch (error) {
    console.error('\n❌ Extraction failed:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// ═══════════════════════════════════════════════════════════════════
// 5. CLI 실행
// ═══════════════════════════════════════════════════════════════════

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node enhanced-content-extractor.js <class> <spec>');
    console.log('Example: node enhanced-content-extractor.js demon-hunter havoc');
    process.exit(1);
  }

  const [className, spec] = args;

  extractMaxrollGuide(className, spec)
    .then(result => {
      if (result.success) {
        console.log('\n✅ Extraction completed successfully!');
        process.exit(0);
      } else {
        console.error('\n❌ Extraction failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = {
  extractMaxrollGuide,
  extractSectionContent,
  loadPageCompletely,
  validateExtractedContent
};
