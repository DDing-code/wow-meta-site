/**
 * Enhanced Wowhead Extractor - 완전한 가이드 콘텐츠 추출
 *
 * Wowhead 가이드 구조:
 * - 명확한 섹션 구분 (H2/H3)
 * - 풍부한 설명 (1000+ chars per section)
 * - 중첩된 리스트 구조
 * - 브레이크포인트/시너지 정보
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════
// 1. Wowhead 페이지 완전 로딩
// ═══════════════════════════════════════════════════════════════════

async function loadWowheadPage(page, url) {
  console.log(`📂 Loading Wowhead: ${url}`);

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  console.log('  ✓ DOM loaded');

  // Wowhead 특유의 로딩 대기
  try {
    // 메인 콘텐츠 로딩 대기
    await page.waitForSelector('.text', { timeout: 15000 });
    console.log('  ✓ Main content loaded');

    // 툴팁 스크립트 로딩 대기
    await page.waitForFunction(() => {
      return typeof WH !== 'undefined' && WH.Tooltips;
    }, { timeout: 10000 });
    console.log('  ✓ Wowhead tooltips ready');
  } catch (e) {
    console.warn('  ⚠️  Some Wowhead features not loaded');
  }

  // 스크롤하여 lazy-load 트리거
  await page.evaluate(async () => {
    const scrollDelay = ms => new Promise(r => setTimeout(r, ms));
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await scrollDelay(300);
    }
    window.scrollTo(0, 0);
  });
  console.log('  ✓ Lazy-load triggered');

  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  console.log('  ✓ Page fully loaded\n');
}

// ═══════════════════════════════════════════════════════════════════
// 2. Wowhead 섹션 추출 (재귀적 완전 추출)
// ═══════════════════════════════════════════════════════════════════

async function extractWowheadSection(page, sectionTitle, maxDepth = 5) {
  console.log(`🔍 Extracting: "${sectionTitle}"`);

  const result = await page.evaluate(({ title, depth }) => {
    // ───────────────────────────────────────────────────────────
    // 섹션 찾기 (Wowhead 구조 최적화)
    // ───────────────────────────────────────────────────────────
    const findSection = () => {
      const titleLower = title.toLowerCase();

      // Wowhead 가이드 구조: <h2 class="heading-size-3">Title</h2>
      const headings = Array.from(document.querySelectorAll('h2, h3, h4'));

      for (const heading of headings) {
        const headingText = heading.textContent.trim().toLowerCase();

        // 정확한 매칭 우선
        if (headingText === titleLower) {
          return { element: heading, match: 'exact' };
        }

        // 부분 매칭
        if (headingText.includes(titleLower) || titleLower.includes(headingText)) {
          return { element: heading, match: 'partial' };
        }
      }

      return null;
    };

    // ───────────────────────────────────────────────────────────
    // 재귀적 콘텐츠 추출
    // ───────────────────────────────────────────────────────────
    const extractContent = (element, currentDepth) => {
      if (currentDepth > depth || !element) return null;

      const content = {
        tag: element.tagName,
        text: '',
        children: []
      };

      // 직접 텍스트만 추출
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text) content.text += text + ' ';
        }
      }
      content.text = content.text.trim();

      // 자식 요소 처리
      Array.from(element.children).forEach(child => {
        // 리스트
        if (child.matches('ul, ol')) {
          const items = Array.from(child.querySelectorAll(':scope > li'));
          content.children.push({
            type: 'list',
            ordered: child.tagName === 'OL',
            items: items.map(li => {
              // Wowhead는 아이콘 링크로 스킬 표시 → 전체 textContent 사용
              let itemText = '';

              // 중첩 리스트 제외한 텍스트
              const nestedList = li.querySelector(':scope > ul, :scope > ol');
              const clone = li.cloneNode(true);
              if (nestedList) {
                const nestedInClone = clone.querySelector(':scope > ul, :scope > ol');
                if (nestedInClone) nestedInClone.remove();
              }

              itemText = clone.textContent.trim();

              return {
                text: itemText,
                nested: nestedList ? extractContent(nestedList, currentDepth + 1) : null
              };
            })
          });
        }
        // 테이블
        else if (child.matches('table')) {
          const rows = Array.from(child.querySelectorAll('tr'));
          const headers = Array.from(rows[0]?.querySelectorAll('th, td') || [])
            .map(th => th.textContent.trim());

          content.children.push({
            type: 'table',
            headers,
            rows: rows.slice(1).map(tr =>
              Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
            )
          });
        }
        // Pre/Code
        else if (child.matches('pre, code')) {
          content.children.push({
            type: 'code',
            code: child.textContent.trim()
          });
        }
        // Blockquote
        else if (child.matches('blockquote')) {
          content.children.push({
            type: 'quote',
            text: child.textContent.trim()
          });
        }
        // Div/P/Span - 재귀
        else if (child.matches('div, p, span, section') && !child.matches('h1, h2, h3, h4, h5, h6')) {
          const nested = extractContent(child, currentDepth + 1);
          if (nested && (nested.text || nested.children.length > 0)) {
            content.children.push(nested);
          }
        }
      });

      return content;
    };

    // ───────────────────────────────────────────────────────────
    // 메인 로직
    // ───────────────────────────────────────────────────────────
    const sectionInfo = findSection();
    if (!sectionInfo) {
      return {
        found: false,
        reason: `Section "${title}" not found`
      };
    }

    const { element: heading, match } = sectionInfo;
    const sectionLevel = parseInt(heading.tagName.substring(1));

    // 헤딩 다음부터 같은/상위 레벨 헤딩 전까지 추출
    let current = heading.nextElementSibling;
    const contents = [];

    while (current) {
      // 종료 조건: 같은 레벨 이상의 헤딩
      if (current.matches('h1, h2, h3, h4, h5, h6')) {
        const currentLevel = parseInt(current.tagName.substring(1));
        if (currentLevel <= sectionLevel) break;
      }

      const extracted = extractContent(current, 0);
      if (extracted && (extracted.text || extracted.children.length > 0)) {
        contents.push(extracted);
      }

      current = current.nextElementSibling;
    }

    // 통계
    const totalChars = JSON.stringify(contents).length;
    const countItems = (obj) => {
      let count = 0;
      if (obj.children) {
        obj.children.forEach(ch => {
          if (ch.type === 'list') count += ch.items.length;
          if (ch.children) count += countItems(ch);
        });
      }
      return count;
    };

    return {
      found: true,
      matchType: match,
      sectionTitle: heading.textContent.trim(),
      sectionLevel,
      contents,
      stats: {
        totalElements: contents.length,
        totalCharacters: totalChars,
        listItems: contents.reduce((sum, c) => sum + countItems(c), 0)
      }
    };
  }, { title: sectionTitle, depth: maxDepth });

  if (!result.found) {
    console.warn(`  ❌ ${result.reason}`);
  } else {
    console.log(`  ✅ Found (${result.matchType} match): ${result.stats.totalCharacters.toLocaleString()} chars, ${result.stats.listItems} items\n`);
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════
// 3. 메인 추출 함수
// ═══════════════════════════════════════════════════════════════════

async function extractWowheadGuide(className, spec) {
  const url = `https://www.wowhead.com/guide/classes/${className}/${spec}/rotation-cooldowns-pve-dps`;

  console.log('════════════════════════════════════════════════════════════');
  console.log('  Enhanced Wowhead Extractor');
  console.log('════════════════════════════════════════════════════════════\n');
  console.log(`Class: ${className}`);
  console.log(`Spec: ${spec}`);
  console.log(`URL: ${url}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await loadWowheadPage(page, url);

    // Wowhead 가이드 주요 섹션
    const sectionsToExtract = [
      'Rotation',
      'Opener',
      'Priority',
      'Single-Target',
      'Multi-Target',
      'AoE',
      'Cooldowns',
      'Talents',
      'Hero Talents',
      'Stat Priority',
      'Gear',
      'Tier Set',
      'Trinkets',
      'Consumables'
    ];

    const extractedData = {};

    for (const sectionTitle of sectionsToExtract) {
      const sectionData = await extractWowheadSection(page, sectionTitle, 5);
      const key = sectionTitle.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
      extractedData[key] = sectionData;
    }

    // 검증
    console.log('📊 Validation:');
    const totalChars = JSON.stringify(extractedData).length;
    const foundSections = Object.values(extractedData).filter(s => s.found).length;

    console.log(`  Total characters: ${totalChars.toLocaleString()}`);
    console.log(`  Sections found: ${foundSections}/${sectionsToExtract.length}`);

    const valid = totalChars >= 5000 && foundSections >= 5;
    if (valid) {
      console.log(`  ✅ Validation passed\n`);
    } else {
      console.warn(`  ⚠️  Low content (need ≥5000 chars, ≥5 sections)\n`);
    }

    // 저장
    const outputDir = path.join(__dirname, '../database-builder/wowhead-cache');
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
          version: '2.0-enhanced-wowhead'
        },
        validation: {
          valid,
          totalCharacters: totalChars,
          sectionsFound: foundSections,
          sectionsTotal: sectionsToExtract.length
        },
        data: extractedData
      }, null, 2),
      'utf-8'
    );

    console.log(`💾 Saved: ${outputPath}\n`);

    return { success: true, data: extractedData, totalChars, foundSections };

  } catch (error) {
    console.error('\n❌ Extraction failed:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// ═══════════════════════════════════════════════════════════════════
// 4. CLI 실행
// ═══════════════════════════════════════════════════════════════════

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node enhanced-wowhead-extractor.js <class> <spec>');
    console.log('Example: node enhanced-wowhead-extractor.js mage arcane');
    process.exit(1);
  }

  const [className, spec] = args;

  extractWowheadGuide(className, spec)
    .then(result => {
      if (result.success) {
        console.log('✅ Extraction complete!');
        console.log(`   ${result.totalChars.toLocaleString()} characters extracted`);
        console.log(`   ${result.foundSections} sections found`);
        process.exit(0);
      } else {
        console.error('❌ Extraction failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = {
  extractWowheadGuide,
  extractWowheadSection,
  loadWowheadPage
};
