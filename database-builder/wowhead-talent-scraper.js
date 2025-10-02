const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function scrapeTalents() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log('🎯 Wowhead 야수 사냥꾼 특성 계산기 페이지 접속 중...');

    // 페이지 이동
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // 페이지가 완전히 로드될 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('📊 페이지 구조 분석 중...');

    // 페이지에서 가능한 모든 셀렉터 시도
    const selectors = await page.evaluate(() => {
      const results = {
        found: [],
        talentData: {
          class: [],
          spec: [],
          hero: []
        }
      };

      // 1. 클래스명으로 찾기
      const classNames = [
        'talent-node',
        'talent-cell',
        'talent-tree-node',
        'wowhead-tc-node',
        'tc-node',
        'talent-button',
        'talent-icon'
      ];

      for (const className of classNames) {
        const elements = document.querySelectorAll(`.${className}`);
        if (elements.length > 0) {
          results.found.push(`${className}: ${elements.length}개`);
        }
      }

      // 2. data 속성으로 찾기
      const dataAttrs = [
        'data-spell-id',
        'data-talent-id',
        'data-node-id',
        'data-tree-id',
        'data-row',
        'data-col',
        'data-cell'
      ];

      for (const attr of dataAttrs) {
        const elements = document.querySelectorAll(`[${attr}]`);
        if (elements.length > 0) {
          results.found.push(`${attr}: ${elements.length}개`);

          // 데이터 수집
          elements.forEach(el => {
            if (attr === 'data-spell-id' || attr === 'data-talent-id') {
              const talentInfo = {
                id: el.getAttribute(attr),
                row: el.getAttribute('data-row'),
                col: el.getAttribute('data-col'),
                cell: el.getAttribute('data-cell'),
                tree: el.getAttribute('data-tree-id'),
                maxRank: el.getAttribute('data-max-rank')
              };

              // 링크에서 이름 추출
              const link = el.querySelector('a');
              if (link) {
                talentInfo.name = link.textContent || link.getAttribute('data-wowhead');
                talentInfo.href = link.href;
              }

              // 아이콘 추출
              const icon = el.querySelector('ins, .icon, img');
              if (icon) {
                const style = icon.getAttribute('style');
                if (style) {
                  const bgMatch = style.match(/background[^;]*url\(['"]?([^'")]+)['"]?\)/);
                  if (bgMatch) {
                    talentInfo.icon = bgMatch[1];
                  }
                }
                if (icon.src) {
                  talentInfo.icon = icon.src;
                }
              }

              // 트리 타입에 따라 분류
              const treeId = el.getAttribute('data-tree-id');
              if (treeId === '1' || el.closest('.talent-tree-class')) {
                results.talentData.class.push(talentInfo);
              } else if (treeId === '2' || el.closest('.talent-tree-spec')) {
                results.talentData.spec.push(talentInfo);
              } else if (el.closest('.talent-tree-hero')) {
                results.talentData.hero.push(talentInfo);
              }
            }
          });
        }
      }

      // 3. 특정 컨테이너 찾기
      const containers = [
        '.talent-calc-tree',
        '.talent-calculator',
        '.talent-tree',
        '#talent-tree-hunter',
        '.wowhead-tc-tree'
      ];

      for (const container of containers) {
        const el = document.querySelector(container);
        if (el) {
          results.found.push(`Container: ${container}`);
        }
      }

      // 4. WH 전역 객체 확인
      if (typeof WH !== 'undefined') {
        results.found.push('WH 객체 존재');

        if (WH.TalentCalc) {
          results.found.push('WH.TalentCalc 존재');
        }

        if (WH.talentCalcData) {
          results.found.push('WH.talentCalcData 존재');
        }
      }

      return results;
    });

    console.log('\n🔍 발견된 요소들:');
    selectors.found.forEach(item => console.log(`  - ${item}`));

    console.log('\n📋 수집된 특성 데이터:');
    console.log(`  - 클래스 특성: ${selectors.talentData.class.length}개`);
    console.log(`  - 전문화 특성: ${selectors.talentData.spec.length}개`);
    console.log(`  - 영웅 특성: ${selectors.talentData.hero.length}개`);

    // 결과 저장
    const outputPath = path.join(__dirname, 'wowhead-scraped-talents.json');
    await fs.writeFile(outputPath, JSON.stringify(selectors, null, 2), 'utf-8');

    console.log(`\n✅ 데이터 저장 완료: ${outputPath}`);

    // 스크린샷 저장
    await page.screenshot({
      path: path.join(__dirname, 'wowhead-talent-page.png'),
      fullPage: false
    });
    console.log('📸 스크린샷 저장 완료');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

// 실행
scrapeTalents();