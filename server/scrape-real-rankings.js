const puppeteer = require('puppeteer');

class RealRankingScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 실제 랭킹 스크래퍼 초기화...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });

    this.page = await this.browser.newPage();

    // 사용자 에이전트 설정 (봇 차단 회피)
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 기본 뷰포트 설정
    await this.page.setViewport({ width: 1920, height: 1080 });

    // 이미지 로딩 비활성화 (속도 향상)
    await this.page.setRequestInterception(true);
    this.page.on('request', (req) => {
      if(req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  async scrapeSpecificBossRankings() {
    try {
      console.log('\n📊 특정 보스 랭킹 페이지 직접 접속...');

      // Nerub-ar Palace의 첫 번째 보스 (Ulgrax) Mythic DPS 랭킹
      // encounter=2902 는 Ulgrax the Devourer
      const url = 'https://www.warcraftlogs.com/zone/rankings/38#metric=dps&encounter=2902&difficulty=5';

      console.log('🔗 URL:', url);

      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 페이지 로딩 완료 대기
      await this.page.waitForTimeout(3000);

      // 랭킹 테이블이 로드될 때까지 대기
      await this.page.waitForSelector('table', { timeout: 10000 }).catch(() => {
        console.log('⚠️ 테이블 대기 시간 초과, 계속 진행...');
      });

      // 실제 플레이어 랭킹 데이터 추출
      const rankings = await this.page.evaluate(() => {
        const playerData = [];

        // 모든 테이블 행 찾기
        const rows = document.querySelectorAll('tr');

        rows.forEach((row, index) => {
          // 헤더 행 건너뛰기
          if (index === 0) return;

          const cells = row.querySelectorAll('td');
          if (cells.length < 5) return;

          // 각 셀에서 텍스트 추출
          const cellTexts = Array.from(cells).map(cell => cell.textContent.trim());

          // 플레이어 링크 찾기
          const playerLink = row.querySelector('a[href*="/character/"]');
          const playerName = playerLink ? playerLink.textContent.trim() : null;

          if (!playerName) return;

          // 서버와 길드 정보 추출
          let server = '';
          let guild = '';

          // 서버 정보는 보통 플레이어 이름 근처에 있음
          const serverElement = row.querySelector('a[href*="/server/"]');
          if (serverElement) {
            server = serverElement.textContent.trim();
          }

          // 길드 정보 찾기
          const guildElement = row.querySelector('a[href*="/guild/"]');
          if (guildElement) {
            guild = guildElement.textContent.trim();
          }

          // DPS 값 찾기 - 여러 패턴 시도
          let dpsValue = null;

          // 패턴 1: 숫자.숫자M (예: 1.5M)
          for (let text of cellTexts) {
            if (/^\d+\.\d+M$/i.test(text)) {
              dpsValue = parseFloat(text.replace(/M$/i, '')) * 1000000;
              break;
            }
          }

          // 패턴 2: 숫자k (예: 1523.4k)
          if (!dpsValue) {
            for (let text of cellTexts) {
              if (/^\d+(\.\d+)?k$/i.test(text)) {
                dpsValue = parseFloat(text.replace(/k$/i, '')) * 1000;
                break;
              }
            }
          }

          // 패턴 3: 큰 숫자 (쉼표 포함)
          if (!dpsValue) {
            for (let text of cellTexts) {
              const cleaned = text.replace(/,/g, '');
              if (/^\d{6,}(\.\d+)?$/.test(cleaned)) {
                const num = parseFloat(cleaned);
                if (num > 500000 && num < 2000000) { // 현실적인 DPS 범위
                  dpsValue = num;
                  break;
                }
              }
            }
          }

          // 패턴 4: data 속성에서 찾기
          if (!dpsValue) {
            const dpsCell = row.querySelector('[data-dps], [data-amount], [data-value]');
            if (dpsCell) {
              const dataDps = dpsCell.getAttribute('data-dps') ||
                           dpsCell.getAttribute('data-amount') ||
                           dpsCell.getAttribute('data-value');
              if (dataDps) {
                dpsValue = parseFloat(dataDps);
              }
            }
          }

          if (playerName && dpsValue) {
            playerData.push({
              rank: playerData.length + 1,
              name: playerName,
              server: server || 'Unknown',
              guild: guild || 'No Guild',
              dps: dpsValue,
              cellData: cellTexts.slice(0, 8) // 디버깅용
            });
          }
        });

        return playerData;
      });

      console.log(`\n✅ ${rankings.length}명의 실제 플레이어 데이터 수집`);

      // 상위 10명 출력
      rankings.slice(0, 10).forEach(player => {
        console.log(`  ${player.rank}. ${player.name} (${player.guild}) - ${Math.round(player.dps).toLocaleString()} DPS`);
      });

      return rankings;

    } catch (error) {
      console.error('❌ 랭킹 스크래핑 실패:', error.message);

      // 스크린샷 저장 (디버깅용)
      await this.page.screenshot({ path: 'error-screenshot.png' });
      console.log('📸 에러 스크린샷 저장: error-screenshot.png');

      return [];
    }
  }

  async scrapeMultipleBosses() {
    const bosses = [
      { id: 2902, name: 'Ulgrax the Devourer' },
      { id: 2917, name: 'The Bloodbound Horror' },
      { id: 2898, name: 'Sikran' }
    ];

    const allRankings = {};

    for (const boss of bosses) {
      console.log(`\n🎯 ${boss.name} 랭킹 수집 중...`);

      const url = `https://www.warcraftlogs.com/zone/rankings/38#metric=dps&encounter=${boss.id}&difficulty=5`;

      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await this.page.waitForTimeout(2000);

      // 위와 동일한 스크래핑 로직...
      const rankings = await this.scrapeSpecificBossRankings();

      if (rankings.length > 0) {
        allRankings[boss.name] = rankings.slice(0, 20); // 각 보스별 상위 20명
      }

      // 과도한 요청 방지
      await this.page.waitForTimeout(3000);
    }

    return allRankings;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ 브라우저 종료');
    }
  }
}

// 실행
async function main() {
  const scraper = new RealRankingScraper();

  try {
    await scraper.init();

    // 단일 보스 랭킹 스크래핑
    const rankings = await scraper.scrapeSpecificBossRankings();

    // JSON으로 저장
    if (rankings.length > 0) {
      const fs = require('fs');
      const data = {
        timestamp: new Date().toISOString(),
        zone: 'Nerub-ar Palace',
        difficulty: 'Mythic',
        boss: 'Ulgrax the Devourer',
        rankings: rankings.slice(0, 50) // 상위 50명
      };

      fs.writeFileSync('real-rankings-data.json', JSON.stringify(data, null, 2));
      console.log('\n💾 real-rankings-data.json 파일로 저장 완료');
    }

  } catch (error) {
    console.error('❌ 메인 실행 오류:', error);
  } finally {
    await scraper.cleanup();
  }
}

// 모듈 export
module.exports = RealRankingScraper;

// 직접 실행시
if (require.main === module) {
  main();
}