const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function scrapeWowheadTalents() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log('🎯 Wowhead 특성 계산기 페이지 접속 중...');

    // 콘솔 로그 캡처
    page.on('console', msg => {
      if (msg.text().includes('talent') || msg.text().includes('WH')) {
        console.log('Browser console:', msg.text());
      }
    });

    // 페이지 이동
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log('⏳ 특성 트리 로딩 대기 중...');

    // 특성 트리가 로드될 때까지 대기
    try {
      await page.waitForSelector('.talent-tree, .wowhead-tc-tree, [data-tree-id]', {
        timeout: 10000
      });
      console.log('✅ 특성 트리 컨테이너 발견');
    } catch (e) {
      console.log('⚠️ 특성 트리 컨테이너를 찾지 못함');
    }

    // 추가 대기
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('🔍 특성 데이터 수집 중...');

    // JavaScript 실행으로 데이터 수집
    const talentData = await page.evaluate(() => {
      const result = {
        pageInfo: {
          title: document.title,
          url: window.location.href,
          hasWH: typeof WH !== 'undefined',
          hasTalentCalc: typeof WH !== 'undefined' && !!WH.TalentCalc
        },
        trees: [],
        nodes: [],
        raw: {}
      };

      // WH 객체에서 데이터 추출
      if (typeof WH !== 'undefined') {
        if (WH.TalentCalc) {
          result.raw.talentCalc = {
            hasData: !!WH.TalentCalc.data,
            hasTrees: !!WH.TalentCalc.trees,
            hasSpecs: !!WH.TalentCalc.specs
          };
        }

        // WH.talentCalcData 확인
        if (WH.talentCalcData) {
          result.raw.talentCalcData = Object.keys(WH.talentCalcData);
        }
      }

      // 모든 data-tree-id 요소 찾기
      const treeElements = document.querySelectorAll('[data-tree-id]');
      treeElements.forEach(tree => {
        result.trees.push({
          id: tree.getAttribute('data-tree-id'),
          className: tree.className,
          childCount: tree.children.length
        });
      });

      // 특성 노드 찾기 - 다양한 셀렉터 시도
      const nodeSelectors = [
        '.talent-node',
        '.talent-cell',
        '.wowhead-tc-node',
        '.tc-talent',
        '[data-node-id]',
        '[data-spell-id]',
        'a[href*="/spell="]',
        '.talent-icon',
        '.talent-button'
      ];

      const foundNodes = new Set();

      for (const selector of nodeSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // 스펠 ID 추출
          let spellId = null;
          let name = null;
          let icon = null;

          // data 속성에서 ID 추출
          spellId = el.getAttribute('data-spell-id') ||
                   el.getAttribute('data-talent-id') ||
                   el.getAttribute('data-node-id');

          // 링크에서 ID 추출
          if (!spellId) {
            const link = el.tagName === 'A' ? el : el.querySelector('a');
            if (link && link.href) {
              const match = link.href.match(/spell=(\d+)/);
              if (match) spellId = match[1];
              name = link.textContent || link.getAttribute('data-wowhead');
            }
          }

          // 아이콘 추출
          const iconEl = el.querySelector('ins, img, .icon');
          if (iconEl) {
            const style = iconEl.getAttribute('style');
            if (style) {
              const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
              if (bgMatch) icon = bgMatch[1];
            }
            if (iconEl.src) icon = iconEl.src;
          }

          if (spellId && !foundNodes.has(spellId)) {
            foundNodes.add(spellId);
            result.nodes.push({
              id: spellId,
              name: name || el.textContent?.trim(),
              icon: icon,
              row: el.getAttribute('data-row'),
              col: el.getAttribute('data-col'),
              cell: el.getAttribute('data-cell'),
              tree: el.getAttribute('data-tree-id') || el.closest('[data-tree-id]')?.getAttribute('data-tree-id'),
              selector: selector,
              className: el.className
            });
          }
        });
      }

      // 트리별 특성 개수 세기
      const treeTypes = {
        class: 0,
        spec: 0,
        hero: 0
      };

      result.nodes.forEach(node => {
        const treeContainer = document.querySelector(`[data-tree-id="${node.tree}"]`);
        if (treeContainer) {
          if (treeContainer.classList.contains('talent-tree-class')) {
            treeTypes.class++;
          } else if (treeContainer.classList.contains('talent-tree-spec')) {
            treeTypes.spec++;
          } else if (treeContainer.classList.contains('talent-tree-hero')) {
            treeTypes.hero++;
          }
        }
      });

      result.treeTypes = treeTypes;

      return result;
    });

    console.log('\n📊 수집 결과:');
    console.log(`  페이지 제목: ${talentData.pageInfo.title}`);
    console.log(`  WH 객체: ${talentData.pageInfo.hasWH ? '있음' : '없음'}`);
    console.log(`  TalentCalc: ${talentData.pageInfo.hasTalentCalc ? '있음' : '없음'}`);
    console.log(`  트리 요소: ${talentData.trees.length}개`);
    console.log(`  특성 노드: ${talentData.nodes.length}개`);

    if (talentData.nodes.length > 0) {
      console.log('\n📋 샘플 특성 (처음 5개):');
      talentData.nodes.slice(0, 5).forEach(node => {
        console.log(`  - [${node.id}] ${node.name || 'Unknown'} (Tree: ${node.tree}, Row: ${node.row}, Col: ${node.col})`);
      });
    }

    // 데이터 저장
    const outputPath = path.join(__dirname, 'wowhead-dynamic-talents.json');
    await fs.writeFile(outputPath, JSON.stringify(talentData, null, 2), 'utf-8');
    console.log(`\n✅ 데이터 저장: ${outputPath}`);

    // 스크린샷 (디버깅용)
    await page.screenshot({
      path: path.join(__dirname, 'wowhead-loaded-page.png'),
      fullPage: false
    });

    // 특성 트리 영역만 스크린샷
    const treeElement = await page.$('.talent-calc-tree, .talent-calculator, [data-tree-id]');
    if (treeElement) {
      await treeElement.screenshot({
        path: path.join(__dirname, 'talent-tree-only.png')
      });
      console.log('📸 특성 트리 스크린샷 저장');
    }

  } catch (error) {
    console.error('❌ 오류:', error.message);
  } finally {
    await browser.close();
  }
}

// 실행
scrapeWowheadTalents();