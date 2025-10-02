const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function collectBeastMasteryTalents() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  try {
    console.log('🎯 야수 사냥꾼 특성 계산기 페이지 접속 중...');
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // 페이지 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('📊 특성 데이터 수집 중...');

    // 특성 트리 데이터 추출
    const talentData = await page.evaluate(() => {
      const result = {
        classTalents: {
          layout: { rows: 10, columns: 7, totalPoints: 31 },
          nodes: []
        },
        specTalents: {
          layout: { rows: 10, columns: 7, totalPoints: 30 },
          nodes: []
        },
        heroTalents: {
          packLeader: { layout: { rows: 5, columns: 3, totalPoints: 10 }, nodes: [] },
          darkRanger: { layout: { rows: 5, columns: 3, totalPoints: 10 }, nodes: [] }
        }
      };

      // 클래스 특성 수집
      const classTree = document.querySelector('.talent-tree-class');
      if (classTree) {
        const classTalents = classTree.querySelectorAll('.talent-node');
        classTalents.forEach(node => {
          const dataCell = node.getAttribute('data-cell');
          const spellId = node.getAttribute('data-spell-id') || node.querySelector('a')?.href?.match(/spell=(\d+)/)?.[1];
          const iconElement = node.querySelector('ins');
          const nameElement = node.querySelector('.talent-name') || node.querySelector('a');

          if (dataCell && spellId) {
            const [row, col] = dataCell.split('-').map(n => parseInt(n));

            // 아이콘 URL 추출
            let iconUrl = '';
            if (iconElement) {
              const style = iconElement.getAttribute('style');
              const match = style?.match(/url\(['"]?([^'")]+)['"]?\)/);
              if (match) {
                iconUrl = match[1];
              }
            }

            // 특성 이름 추출
            const talentName = nameElement?.textContent?.trim() ||
                              nameElement?.getAttribute('data-wowhead') ||
                              node.getAttribute('data-tooltip-name') ||
                              '';

            result.classTalents.nodes.push({
              id: spellId,
              name: talentName,
              position: { row, col },
              icon: iconUrl,
              nodeType: node.classList.contains('passive') ? 'passive' : 'active',
              maxRank: parseInt(node.getAttribute('data-max-rank')) || 1,
              connections: [] // 연결 관계는 별도로 수집
            });
          }
        });
      }

      // 전문화 특성 수집
      const specTree = document.querySelector('.talent-tree-spec');
      if (specTree) {
        const specTalents = specTree.querySelectorAll('.talent-node');
        specTalents.forEach(node => {
          const dataCell = node.getAttribute('data-cell');
          const spellId = node.getAttribute('data-spell-id') || node.querySelector('a')?.href?.match(/spell=(\d+)/)?.[1];
          const iconElement = node.querySelector('ins');
          const nameElement = node.querySelector('.talent-name') || node.querySelector('a');

          if (dataCell && spellId) {
            const [row, col] = dataCell.split('-').map(n => parseInt(n));

            // 아이콘 URL 추출
            let iconUrl = '';
            if (iconElement) {
              const style = iconElement.getAttribute('style');
              const match = style?.match(/url\(['"]?([^'")]+)['"]?\)/);
              if (match) {
                iconUrl = match[1];
              }
            }

            // 특성 이름 추출
            const talentName = nameElement?.textContent?.trim() ||
                              nameElement?.getAttribute('data-wowhead') ||
                              node.getAttribute('data-tooltip-name') ||
                              '';

            result.specTalents.nodes.push({
              id: spellId,
              name: talentName,
              position: { row, col },
              icon: iconUrl,
              nodeType: node.classList.contains('passive') ? 'passive' : 'active',
              maxRank: parseInt(node.getAttribute('data-max-rank')) || 1,
              connections: []
            });
          }
        });
      }

      return result;
    });

    // 마우스 오버로 툴팁 정보 수집
    console.log('🔍 툴팁 정보 수집 중...');

    // 각 특성 노드에 마우스 오버하여 상세 정보 수집
    for (let i = 0; i < talentData.classTalents.nodes.length; i++) {
      const node = talentData.classTalents.nodes[i];
      const selector = `.talent-tree-class .talent-node[data-spell-id="${node.id}"]`;

      try {
        const element = await page.$(selector);
        if (element) {
          await element.hover();
          await new Promise(resolve => setTimeout(resolve, 500));

          // 툴팁에서 한국어 이름과 설명 추출
          const tooltipData = await page.evaluate(() => {
            const tooltip = document.querySelector('.wowhead-tooltip');
            if (tooltip) {
              const name = tooltip.querySelector('.q')?.textContent?.trim();
              const description = tooltip.querySelector('.tooltip-content')?.textContent?.trim();
              return { name, description };
            }
            return null;
          });

          if (tooltipData) {
            node.koreanName = tooltipData.name || node.name;
            node.description = tooltipData.description || '';
          }
        }
      } catch (err) {
        console.log(`특성 ${node.id} 툴팁 수집 실패:`, err.message);
      }
    }

    // 전문화 특성도 동일하게 처리
    for (let i = 0; i < talentData.specTalents.nodes.length; i++) {
      const node = talentData.specTalents.nodes[i];
      const selector = `.talent-tree-spec .talent-node[data-spell-id="${node.id}"]`;

      try {
        const element = await page.$(selector);
        if (element) {
          await element.hover();
          await new Promise(resolve => setTimeout(resolve, 500));

          const tooltipData = await page.evaluate(() => {
            const tooltip = document.querySelector('.wowhead-tooltip');
            if (tooltip) {
              const name = tooltip.querySelector('.q')?.textContent?.trim();
              const description = tooltip.querySelector('.tooltip-content')?.textContent?.trim();
              return { name, description };
            }
            return null;
          });

          if (tooltipData) {
            node.koreanName = tooltipData.name || node.name;
            node.description = tooltipData.description || '';
          }
        }
      } catch (err) {
        console.log(`특성 ${node.id} 툴팁 수집 실패:`, err.message);
      }
    }

    // 결과 저장
    const outputPath = path.join(__dirname, 'bm-hunter-talents-accurate.json');
    await fs.writeFile(outputPath, JSON.stringify(talentData, null, 2), 'utf-8');

    console.log('✅ 특성 데이터 수집 완료!');
    console.log(`📁 저장 위치: ${outputPath}`);
    console.log(`📊 수집된 특성:`);
    console.log(`  - 클래스 특성: ${talentData.classTalents.nodes.length}개`);
    console.log(`  - 전문화 특성: ${talentData.specTalents.nodes.length}개`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

// 실행
collectBeastMasteryTalents();