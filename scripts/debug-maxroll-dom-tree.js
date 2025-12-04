/**
 * Maxroll DOM 트리 구조 분석
 *
 * H2 태그 주변의 실제 DOM 구조를 분석합니다.
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function debugMaxrollDOMTree(url) {
  console.log('🔍 Maxroll DOM 트리 분석:', url);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ 페이지 로드 완료');
    await page.waitForTimeout(5000);

    // DOM 트리 분석
    const domAnalysis = await page.evaluate(() => {
      const result = {};

      // Helper: h2 태그 찾기
      const findH2ByText = (keywords) => {
        const h2Elements = Array.from(document.querySelectorAll('h2'));
        return h2Elements.find(h2 => {
          const text = h2.textContent.toLowerCase();
          return keywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
      };

      // Helper: 요소 정보 추출
      const getElementInfo = (element, depth = 0) => {
        if (!element) return null;
        return {
          tag: element.tagName,
          id: element.id,
          class: element.className,
          textPreview: element.textContent ? element.textContent.trim().substring(0, 100) : '',
          childCount: element.children.length,
          depth: depth
        };
      };

      // 분석할 섹션들
      const sections = [
        { name: 'Overview', keywords: ['Overview'] },
        { name: 'Rotation', keywords: ['Rotation'] },
        { name: 'Stat Priority', keywords: ['Stat Priority', 'Stats'] },
        { name: 'Hero Talents', keywords: ['Hero Talent'] }
      ];

      sections.forEach(section => {
        const h2 = findH2ByText(section.keywords);
        if (!h2) {
          result[section.name] = { found: false };
          return;
        }

        const analysis = {
          found: true,
          h2Info: getElementInfo(h2, 0),
          parent: getElementInfo(h2.parentElement, 0),
          grandParent: getElementInfo(h2.parentElement?.parentElement, 0),
          nextSiblings: [],
          parentSiblings: [],
          allContent: ''
        };

        // H2의 다음 형제 요소들 (최대 15개)
        let current = h2.nextElementSibling;
        for (let i = 0; i < 15 && current; i++) {
          analysis.nextSiblings.push(getElementInfo(current, 1));
          if (current.matches && current.matches('h2')) break;
          current = current.nextElementSibling;
        }

        // 부모의 다음 형제 요소들 (다른 구조일 가능성)
        if (h2.parentElement) {
          let parentNext = h2.parentElement.nextElementSibling;
          for (let i = 0; i < 10 && parentNext; i++) {
            analysis.parentSiblings.push(getElementInfo(parentNext, 0));
            if (parentNext.querySelector && parentNext.querySelector('h2')) break;
            parentNext = parentNext.nextElementSibling;
          }
        }

        // H2부터 다음 H2까지의 모든 텍스트 (상위 컨테이너에서 검색)
        const container = h2.closest('article, section, main, div[class*="content"]') || h2.parentElement;
        if (container) {
          const allH2s = Array.from(container.querySelectorAll('h2'));
          const currentIndex = allH2s.indexOf(h2);
          const nextH2 = allH2s[currentIndex + 1];

          if (nextH2) {
            // H2부터 다음 H2까지의 모든 텍스트
            let node = h2.nextSibling;
            let text = '';
            while (node && node !== nextH2) {
              if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                text += node.textContent;
                if (node === nextH2.parentElement || (node.contains && node.contains(nextH2))) {
                  break;
                }
              }
              node = node.nextSibling || (node.parentElement && node.parentElement.nextSibling);
            }
            analysis.allContent = text.substring(0, 1000);
          }
        }

        result[section.name] = analysis;
      });

      return result;
    });

    console.log('\n📊 DOM 트리 분석 결과:\n');

    Object.entries(domAnalysis).forEach(([sectionName, data]) => {
      console.log(`\n=== ${sectionName} ===`);
      if (!data.found) {
        console.log('❌ 섹션을 찾을 수 없음');
        return;
      }

      console.log('\n[H2 정보]');
      console.log(`  Tag: ${data.h2Info.tag}, ID: "${data.h2Info.id}", Class: "${data.h2Info.class}"`);

      console.log('\n[부모 요소]');
      console.log(`  Tag: ${data.parent?.tag}, ID: "${data.parent?.id}", Class: "${data.parent?.class}"`);
      console.log(`  자식 개수: ${data.parent?.childCount}`);

      console.log('\n[조부모 요소]');
      console.log(`  Tag: ${data.grandParent?.tag}, ID: "${data.grandParent?.id}", Class: "${data.grandParent?.class}"`);

      console.log('\n[H2의 다음 형제 요소들]');
      if (data.nextSiblings.length === 0) {
        console.log('  ⚠️ 다음 형제 요소 없음');
      } else {
        data.nextSiblings.slice(0, 5).forEach((sibling, i) => {
          console.log(`  ${i + 1}. ${sibling.tag} (자식: ${sibling.childCount}) - ${sibling.textPreview.substring(0, 60)}`);
        });
      }

      console.log('\n[부모의 다음 형제 요소들]');
      if (data.parentSiblings.length === 0) {
        console.log('  ⚠️ 부모의 다음 형제 요소 없음');
      } else {
        data.parentSiblings.slice(0, 3).forEach((sibling, i) => {
          console.log(`  ${i + 1}. ${sibling.tag} (자식: ${sibling.childCount}) - ${sibling.textPreview.substring(0, 60)}`);
        });
      }

      console.log('\n[섹션 전체 텍스트 미리보기]');
      console.log(data.allContent.substring(0, 300) || '  ⚠️ 텍스트 없음');
    });

    // JSON 저장
    const outputPath = 'temp/maxroll-dom-tree.json';
    fs.writeFileSync(outputPath, JSON.stringify(domAnalysis, null, 2), 'utf8');
    console.log(`\n\n💾 전체 결과 저장: ${outputPath}`);

    await browser.close();

  } catch (error) {
    await browser.close();
    console.error('❌ 분석 실패:', error.message);
    throw error;
  }
}

// 실행
const url = process.argv[2] || 'https://maxroll.gg/wow/class-guides/arcane-mage-mythic-plus-guide';
debugMaxrollDOMTree(url);
