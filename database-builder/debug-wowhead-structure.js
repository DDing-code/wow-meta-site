const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function debugWowheadStructure() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  console.log('🔍 Wowhead 야수 사냥꾼 특성 페이지 접속 중...');
  await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // 페이지 로딩 대기
  await new Promise(resolve => setTimeout(resolve, 8000));

  console.log('🔍 DOM 구조 분석 중...');

  const domStructure = await page.evaluate(() => {
    const result = {
      possibleSelectors: [],
      talentNodes: [],
      debugInfo: {}
    };

    // 가능한 모든 셀렉터 시도
    const selectorsToTry = [
      '.talent-node',
      '.talent-cell',
      '[data-cell]',
      '.wowhead-tc-talent',
      '.tc-talent',
      'a[href*="/spell="]',
      '.talent-icon',
      '[data-wh-rename-link]',
      '.wowhead-tc-tree-talent',
      '.tc-tree-talent',
      '.wowhead-tc-cell',
      '[class*="talent"]',
      '[class*="node"]',
      '[class*="spell"]'
    ];

    selectorsToTry.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        result.possibleSelectors.push({
          selector: selector,
          count: elements.length,
          sample: elements[0].outerHTML.substring(0, 200)
        });
      }
    });

    // 특성 링크 찾기
    const spellLinks = document.querySelectorAll('a[href*="/spell="]');
    console.log('Found spell links:', spellLinks.length);

    spellLinks.forEach((link, index) => {
      const spellMatch = link.href.match(/spell=(\d+)/);
      if (spellMatch) {
        const parentElement = link.closest('[data-cell], .talent-node, .talent-cell, [class*="talent"]');

        result.talentNodes.push({
          index: index,
          spellId: spellMatch[1],
          href: link.href,
          text: link.textContent || link.getAttribute('data-wh-rename-link') || '',
          parentClass: parentElement?.className || 'no-parent',
          parentHTML: parentElement?.outerHTML.substring(0, 100) || '',
          hasImage: !!link.querySelector('img'),
          imageUrl: link.querySelector('img')?.src || ''
        });
      }
    });

    // 트리 컨테이너 찾기
    const containers = [
      '.wowhead-tc-tree-class',
      '.wowhead-tc-tree-spec',
      '.wowhead-tc-tree-hero',
      '.talent-tree-class',
      '.talent-tree-spec',
      '.hero-talent-tree',
      '[class*="tree"]'
    ];

    containers.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        result.debugInfo[selector] = {
          count: elements.length,
          html: elements[0].outerHTML.substring(0, 300)
        };
      }
    });

    // React 또는 Vue 컴포넌트 확인
    const reactRootCandidates = document.querySelectorAll('[id*="root"], [class*="app"], #main');
    reactRootCandidates.forEach(elem => {
      if (elem._reactRootContainer || elem.__vue__ || elem.__reactInternalInstance) {
        result.debugInfo.frameworkDetected = true;
        result.debugInfo.frameworkElement = elem.id || elem.className;
      }
    });

    // data 속성 확인
    const dataElements = document.querySelectorAll('[data-spell-id], [data-talent-id], [data-node-id]');
    result.debugInfo.dataAttributeElements = dataElements.length;

    return result;
  });

  console.log('\n📊 분석 결과:');
  console.log('발견된 셀렉터들:');
  domStructure.possibleSelectors.forEach(sel => {
    console.log(`  - ${sel.selector}: ${sel.count}개 발견`);
  });

  console.log(`\n특성 노드: ${domStructure.talentNodes.length}개 발견`);
  if (domStructure.talentNodes.length > 0) {
    console.log('샘플 특성:');
    domStructure.talentNodes.slice(0, 5).forEach(node => {
      console.log(`  - ID: ${node.spellId}, 이름: ${node.text}, 부모: ${node.parentClass}`);
    });
  }

  console.log('\n디버그 정보:', JSON.stringify(domStructure.debugInfo, null, 2));

  // 스크린샷 촬영
  await page.screenshot({
    path: path.join(__dirname, 'wowhead-debug.png'),
    fullPage: false
  });

  // 결과 저장
  fs.writeFileSync(
    path.join(__dirname, 'wowhead-dom-debug.json'),
    JSON.stringify(domStructure, null, 2),
    'utf-8'
  );

  console.log('\n✅ 디버그 정보 저장 완료');

  // 브라우저는 열어둠 (수동 확인용)
  console.log('\n브라우저를 열어두었습니다. 수동으로 확인 후 닫아주세요.');

  // await browser.close();
}

debugWowheadStructure().catch(console.error);