const puppeteer = require('puppeteer');

async function debugDPSParsing() {
  let browser;
  let page;

  try {
    console.log('🚀 브라우저 시작...');
    browser = await puppeteer.launch({
      headless: false,  // 디버깅을 위해 헤드리스 모드 비활성화
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    page = await browser.newPage();

    // 사용자 에이전트 설정
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Nerub-ar Palace Mythic DPS 랭킹 페이지
    const url = 'https://www.warcraftlogs.com/zone/rankings/38#difficulty=5&metric=dps';
    console.log('📊 페이지 접속:', url);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 페이지 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 디버깅: 테이블 구조 분석
    const tableInfo = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return { error: '테이블을 찾을 수 없음' };

      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());

      const firstRow = table.querySelector('tbody tr');
      if (!firstRow) return { error: '데이터 행을 찾을 수 없음' };

      const cells = Array.from(firstRow.querySelectorAll('td'));
      const cellData = cells.map((cell, index) => ({
        index: index,
        text: cell.textContent.trim(),
        className: cell.className,
        innerHTML: cell.innerHTML.substring(0, 200)
      }));

      return {
        headers: headers,
        cellCount: cells.length,
        cellData: cellData
      };
    });

    console.log('\n📋 테이블 구조:');
    console.log('헤더:', tableInfo.headers);
    console.log('셀 개수:', tableInfo.cellCount);
    console.log('\n첫 번째 행 데이터:');
    tableInfo.cellData?.forEach(cell => {
      console.log(`  [${cell.index}] "${cell.text}" (class: ${cell.className})`);
    });

    // 실제 DPS 값 찾기
    const players = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      const playerData = [];

      rows.forEach((row, index) => {
        if (index >= 5) return; // 상위 5명만

        const cells = row.querySelectorAll('td');
        const cellTexts = Array.from(cells).map(cell => cell.textContent.trim());

        // 플레이어 이름 찾기 (보통 a 태그 포함)
        const nameCell = row.querySelector('a[href*="/character/"]');
        const name = nameCell ? nameCell.textContent.trim() : 'Unknown';

        // DPS 값을 다양한 방법으로 찾기
        let dps = null;

        // 방법 1: "k" 단위 찾기 (예: 1234.5k)
        for (const text of cellTexts) {
          if (/^\d+(\.\d+)?k$/i.test(text)) {
            dps = parseFloat(text.replace(/k$/i, '')) * 1000;
            break;
          }
        }

        // 방법 2: 큰 숫자 찾기 (100000 이상)
        if (!dps) {
          for (const text of cellTexts) {
            const cleaned = text.replace(/,/g, '');
            if (/^\d{6,}(\.\d+)?$/.test(cleaned)) {
              const value = parseFloat(cleaned);
              if (value > 100000) {
                dps = value;
                break;
              }
            }
          }
        }

        // 방법 3: 특정 클래스명을 가진 셀에서 찾기
        if (!dps) {
          const dpsCell = row.querySelector('[class*="dps"], [class*="amount"], [class*="number"]');
          if (dpsCell) {
            const text = dpsCell.textContent.trim().replace(/,/g, '');
            if (/^\d+(\.\d+)?k$/i.test(text)) {
              dps = parseFloat(text.replace(/k$/i, '')) * 1000;
            } else if (/^\d+(\.\d+)?$/.test(text)) {
              dps = parseFloat(text);
            }
          }
        }

        playerData.push({
          rank: index + 1,
          name: name,
          dps: dps || 0,
          cellTexts: cellTexts  // 디버깅용
        });
      });

      return playerData;
    });

    console.log('\n🎯 파싱된 플레이어 데이터:');
    players.forEach(player => {
      console.log(`  ${player.rank}. ${player.name}: ${player.dps} DPS`);
      console.log(`     셀 내용: ${player.cellTexts.slice(0, 10).join(' | ')}`);
    });

    // 스크린샷 저장
    await page.screenshot({ path: 'debug-warcraftlogs.png', fullPage: false });
    console.log('\n📸 스크린샷 저장: debug-warcraftlogs.png');

  } catch (error) {
    console.error('❌ 에러:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('✅ 브라우저 종료');
    }
  }
}

debugDPSParsing();