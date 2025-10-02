const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function analyzeWowheadDOM() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  try {
    console.log('🌐 Wowhead 야수 사냥꾼 특성 트리 접속 중...');
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 페이지 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 5000));

    // DOM 구조 상세 분석
    const domAnalysis = await page.evaluate(() => {
      const result = {
        treeContainers: [],
        talentNodes: [],
        gridStructure: [],
        positionData: []
      };

      // 1. 특성 트리 컨테이너 찾기
      const containers = document.querySelectorAll('[class*="tree"], [class*="talent-calc"], [class*="wtc"]');
      containers.forEach((container, idx) => {
        const rect = container.getBoundingClientRect();
        result.treeContainers.push({
          index: idx,
          className: container.className,
          id: container.id,
          position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
          childrenCount: container.children.length
        });
      });

      // 2. 특성 노드 찾기
      const nodes = document.querySelectorAll('a[href*="/spell="]');
      nodes.forEach((node, idx) => {
        const rect = node.getBoundingClientRect();
        const parent = node.parentElement;
        const grandparent = parent?.parentElement;
        const greatGrandparent = grandparent?.parentElement;

        // 특성 위치로 트리 타입 판별
        let treeType = 'unknown';

        // Y 좌표로 판별
        if (rect.top < 300) {
          treeType = 'hero'; // 상단 = 영웅 특성
        } else if (rect.left < 400) {
          treeType = 'class'; // 왼쪽 = 직업 특성
        } else if (rect.left > 600) {
          treeType = 'spec'; // 오른쪽 = 전문화 특성
        }

        const spellId = node.getAttribute('href').match(/spell=(\d+)/)?.[1];

        result.talentNodes.push({
          index: idx,
          id: spellId,
          name: node.textContent.trim(),
          position: {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          },
          treeType: treeType,
          parentClass: parent?.className || '',
          grandparentClass: grandparent?.className || '',
          greatGrandparentClass: greatGrandparent?.className || ''
        });
      });

      // 3. 그리드 구조 파악
      const gridElements = document.querySelectorAll('[style*="grid"], [class*="grid"]');
      gridElements.forEach((grid, idx) => {
        const computedStyle = window.getComputedStyle(grid);
        result.gridStructure.push({
          index: idx,
          className: grid.className,
          gridTemplateRows: computedStyle.gridTemplateRows,
          gridTemplateColumns: computedStyle.gridTemplateColumns,
          display: computedStyle.display
        });
      });

      // 4. 위치별 특성 그룹화
      const grouped = {
        topArea: [], // Y < 300 (영웅 특성)
        leftArea: [], // X < 400 (직업 특성)
        centerArea: [], // 400 <= X <= 600
        rightArea: [] // X > 600 (전문화 특성)
      };

      result.talentNodes.forEach(node => {
        if (node.position.top < 300) {
          grouped.topArea.push(node);
        } else if (node.position.left < 400) {
          grouped.leftArea.push(node);
        } else if (node.position.left > 600) {
          grouped.rightArea.push(node);
        } else {
          grouped.centerArea.push(node);
        }
      });

      result.positionData = grouped;

      return result;
    });

    // 결과 저장
    const outputPath = path.join(__dirname, 'wowhead-dom-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(domAnalysis, null, 2), 'utf-8');

    console.log('\n📊 Wowhead DOM 구조 분석 결과:');
    console.log('================================');
    console.log(`🔍 트리 컨테이너: ${domAnalysis.treeContainers.length}개`);
    console.log(`📍 특성 노드: ${domAnalysis.talentNodes.length}개`);
    console.log(`📐 그리드 구조: ${domAnalysis.gridStructure.length}개`);
    console.log('\n📊 위치별 특성 분포:');
    console.log(`  상단 영역 (영웅): ${domAnalysis.positionData.topArea.length}개`);
    console.log(`  왼쪽 영역 (직업): ${domAnalysis.positionData.leftArea.length}개`);
    console.log(`  중앙 영역: ${domAnalysis.positionData.centerArea.length}개`);
    console.log(`  오른쪽 영역 (전문화): ${domAnalysis.positionData.rightArea.length}개`);
    console.log('================================');

    // 특성 타입별 개수 계산
    const typeCount = {
      hero: domAnalysis.talentNodes.filter(n => n.treeType === 'hero').length,
      class: domAnalysis.talentNodes.filter(n => n.treeType === 'class').length,
      spec: domAnalysis.talentNodes.filter(n => n.treeType === 'spec').length,
      unknown: domAnalysis.talentNodes.filter(n => n.treeType === 'unknown').length
    };

    console.log('\n📊 추정 특성 개수:');
    console.log(`  영웅 특성: ${typeCount.hero}개`);
    console.log(`  직업 특성: ${typeCount.class}개`);
    console.log(`  전문화 특성: ${typeCount.spec}개`);
    console.log(`  미분류: ${typeCount.unknown}개`);

    console.log(`\n💾 결과 저장 완료: ${outputPath}`);

    // 스크린샷 저장
    const screenshotPath = path.join(__dirname, 'wowhead-talent-tree.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 스크린샷 저장: ${screenshotPath}`);

  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await browser.close();
  }
}

analyzeWowheadDOM();