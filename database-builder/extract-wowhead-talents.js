const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function extractWowheadTalents() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  try {
    console.log('🎯 Wowhead 야수 사냥꾼 특성 계산기 접속 중...');

    // 한국어 Wowhead 특성 계산기
    await page.goto('https://ko.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // 페이지 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('📊 특성 데이터 추출 중...');

    // 페이지에서 JavaScript 객체 추출
    const talentData = await page.evaluate(() => {
      // Wowhead의 전역 객체들 확인
      const possibleDataSources = [
        'WH.talentCalcData',
        'WH.TalentCalc',
        'window.talentCalcData',
        'window.__talentData',
        'window.g_pageInfo',
        'window.WH'
      ];

      let extractedData = {
        raw: {},
        talents: [],
        structure: null
      };

      // 가능한 데이터 소스 탐색
      for (const source of possibleDataSources) {
        try {
          const data = eval(source);
          if (data) {
            extractedData.raw[source] = data;
          }
        } catch (e) {
          // 해당 객체가 존재하지 않음
        }
      }

      // DOM에서 특성 노드 직접 추출
      const talentNodes = document.querySelectorAll('.talent-calc-tree .talent-node, .wowhead-tc-node');

      extractedData.talents = Array.from(talentNodes).map(node => {
        const link = node.querySelector('a');
        const spellId = link?.href?.match(/spell=(\d+)/)?.[1];
        const name = link?.getAttribute('data-wowhead') || link?.textContent;

        // 위치 정보 추출
        const gridCell = node.closest('[data-row][data-col]');
        const row = gridCell?.getAttribute('data-row');
        const col = gridCell?.getAttribute('data-col');

        // 아이콘 정보 추출
        const iconElement = node.querySelector('.icon, ins');
        const iconStyle = iconElement?.style?.backgroundImage || iconElement?.style?.background;
        const iconUrl = iconStyle?.match(/url\(['"]?([^'")]+)['"]?\)/)?.[1];

        return {
          id: spellId,
          name: name,
          position: { row: parseInt(row) || 0, col: parseInt(col) || 0 },
          icon: iconUrl,
          element: {
            className: node.className,
            dataset: Object.assign({}, node.dataset)
          }
        };
      }).filter(t => t.id);

      // Network 탭에서 캡처한 API 응답 확인
      if (window.performance) {
        const entries = performance.getEntriesByType('resource');
        const apiCalls = entries.filter(e =>
          e.name.includes('talent') ||
          e.name.includes('spec') ||
          e.name.includes('hunter')
        );
        extractedData.apiCalls = apiCalls.map(e => e.name);
      }

      return extractedData;
    });

    // 추가 네트워크 요청 모니터링
    console.log('🔍 네트워크 요청 모니터링 중...');

    const requests = [];
    page.on('response', async response => {
      const url = response.url();
      if (url.includes('talent') || url.includes('spec') || url.includes('hunter')) {
        try {
          const data = await response.json();
          requests.push({
            url: url,
            status: response.status(),
            data: data
          });
        } catch (e) {
          // JSON이 아닌 응답
        }
      }
    });

    // 페이지 리로드하여 네트워크 요청 캡처
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Console 로그 캡처
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('talent') || msg.text().includes('WH')) {
        consoleLogs.push(msg.text());
      }
    });

    // 개발자 도구 콘솔에서 직접 실행
    const directExtraction = await page.evaluate(() => {
      // Wowhead 내부 함수 호출 시도
      const result = {};

      // 특성 트리 구조 찾기
      if (typeof WH !== 'undefined' && WH.TalentCalc) {
        result.talentCalc = {
          trees: WH.TalentCalc.trees,
          specs: WH.TalentCalc.specs,
          data: WH.TalentCalc.data
        };
      }

      // jQuery 데이터 추출
      if (typeof $ !== 'undefined') {
        const $talentCalc = $('.talent-calc, #talent-calc');
        if ($talentCalc.length) {
          result.jqueryData = $talentCalc.data();
        }
      }

      // LocalStorage 확인
      const localStorageData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes('talent') || key.includes('hunter')) {
          localStorageData[key] = localStorage.getItem(key);
        }
      }
      if (Object.keys(localStorageData).length > 0) {
        result.localStorage = localStorageData;
      }

      return result;
    });

    // 결과 저장
    const outputPath = path.join(__dirname, 'wowhead-extracted-data.json');
    await fs.writeFile(outputPath, JSON.stringify({
      talentData,
      networkRequests: requests,
      directExtraction,
      consoleLogs,
      timestamp: new Date().toISOString()
    }, null, 2));

    console.log('✅ 데이터 추출 완료!');
    console.log(`📁 저장 위치: ${outputPath}`);
    console.log(`📊 추출된 특성 수: ${talentData.talents.length}`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

// 실행
extractWowheadTalents();