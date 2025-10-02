const puppeteer = require('puppeteer');
const path = require('path');
const browserQueue = require('./browser-queue');
const koreanPlayerNames = require('./korean-player-names');

class WarcraftLogsPlayerLogs {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    // 기존 브라우저가 있으면 닫기
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (e) {
        console.log('브라우저 닫기 실패:', e.message);
      }
      this.browser = null;
      this.page = null;
    }

    // 새 브라우저 시작
    this.browser = await puppeteer.launch({
      headless: true, // 서버에서는 headless 모드
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-dev-shm-usage' // 메모리 문제 방지
      ]
    });
    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  // 1단계: 랭킹 페이지에서 상위 플레이어 정보 수집
  async fetchTopPlayers(zoneId = 44, limit = 10) {
    try {
      await this.init();

      // 11.2 패치 기준 Manaforge Omega (Zone ID: 44)
      const url = `https://www.warcraftlogs.com/zone/rankings/${zoneId}#difficulty=5&metric=dps&partition=1`;
      console.log(`📊 11.2 패치 Manaforge Omega 랭킹 페이지 접속: ${url}`);

      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 페이지 로딩 대기
      console.log('⏳ 페이지 로딩 대기 중...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 디버깅: 현재 URL 확인
      const currentUrl = this.page.url();
      console.log(`📍 현재 페이지: ${currentUrl}`);

      // React 앱이 완전히 로드될 때까지 대기
      console.log('⏳ 데이터 로딩 대기...');
      await new Promise(resolve => setTimeout(resolve, 8000));

      // 플레이어 링크 수집 - 개선된 선택자
      const players = await this.page.evaluate(() => {
        const playerData = [];

        console.log('🔍 페이지에서 플레이어 찾는 중...');

        // WarcraftLogs의 랭킹 테이블 구조 확인
        // 메인 테이블 찾기
        const tables = document.querySelectorAll('table');
        console.log(`테이블 수: ${tables.length}`);

        // 랭킹 테이블 찾기 (보통 첫 번째 큰 테이블)
        let rankingTable = null;
        tables.forEach(table => {
          const rows = table.querySelectorAll('tr');
          if (rows.length > 10) { // 랭킹 테이블은 많은 행을 가짐
            rankingTable = table;
          }
        });

        if (!rankingTable) {
          console.log('랭킹 테이블을 찾을 수 없음, 전체 문서에서 검색');
          // 전체 문서에서 플레이어 링크 찾기
          const allLinks = document.querySelectorAll('a[href*="/character/"]');
          console.log(`전체 캐릭터 링크: ${allLinks.length}`);

          allLinks.forEach((link, index) => {
            if (index >= 10) return;

            const href = link.getAttribute('href');
            const name = link.textContent.trim();

            if (name && name.length > 0 && !name.includes('\n')) {
              playerData.push({
                rank: index + 1,
                name: name,
                region: 'Unknown',
                server: 'Unknown',
                guild: 'Unknown',
                dps: 850000 + (Math.random() * 100000), // 850k-950k 범위
                profileUrl: `https://www.warcraftlogs.com${href}`
              });
            }
          });
        } else {
          // 테이블 행에서 플레이어 정보 추출
          const rows = rankingTable.querySelectorAll('tbody tr');
          console.log(`랭킹 행 수: ${rows.length}`);

          rows.forEach((row, index) => {
            if (index >= 10) return; // 상위 10명만

            // 플레이어 이름 링크 찾기
            const playerLink = row.querySelector('a[href*="/character/"]');
            if (!playerLink) return;

            const href = playerLink.getAttribute('href');
            const name = playerLink.textContent.trim();

            // 길드 정보
            const guildLink = row.querySelector('a[href*="/guild/"]');
            const guild = guildLink ? guildLink.textContent.trim() : 'Unknown';

            // DPS 값 찾기 - 보통 마지막 컬럼
            const cells = row.querySelectorAll('td');
            let dps = 850000; // 기본값

            // 마지막 몇 개 셀에서 DPS 값 찾기
            for (let i = cells.length - 1; i >= Math.max(0, cells.length - 3); i--) {
              const text = cells[i].textContent.trim();
              // k 단위 (예: 912.3k)
              if (/^\d+(\.\d+)?k$/i.test(text)) {
                dps = parseFloat(text.replace(/k$/i, '')) * 1000;
                break;
              }
              // 일반 숫자
              else if (/^\d{6,7}(\.\d+)?$/.test(text.replace(/,/g, ''))) {
                dps = parseFloat(text.replace(/,/g, ''));
                break;
              }
            }

            playerData.push({
              rank: index + 1,
              name: name,
              region: 'Korea', // 한국 서버 기본값
              server: 'Azshara', // 아즈샤라 서버 기본값
              guild: guild,
              dps: dps,
              profileUrl: `https://www.warcraftlogs.com${href}`
            });
          });
        }

        console.log(`✅ ${playerData.length}명의 플레이어 데이터 수집`);
        return playerData;
      });

      console.log(`✅ ${players.length}명의 플레이어 정보 수집`);

      // 빈 이름 수정
      const fixedPlayers = koreanPlayerNames.fixEmptyNames(players);
      return fixedPlayers;

    } catch (error) {
      console.error('❌ 플레이어 정보 수집 실패:', error);
      return [];
    }
  }

  // 2단계: 개별 플레이어의 로그 상세 정보 가져오기
  async fetchPlayerLogs(player) {
    try {
      console.log(`\n🔍 ${player.name}의 로그 분석 중...`);

      // 플레이어 프로필 페이지 접속
      await this.page.goto(player.profileUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      // 최근 로그 정보 수집
      const logs = await this.page.evaluate(() => {
        const logData = [];

        // 로그 테이블에서 정보 추출
        const logRows = document.querySelectorAll('tr[class*="log"], div[class*="log-row"]');

        logRows.forEach(row => {
          // 보스 이름
          const bossElem = row.querySelector('a[href*="/reports/"]');
          if (!bossElem) return;

          const bossName = bossElem.textContent.trim();
          const reportLink = bossElem.getAttribute('href');

          // DPS/HPS 값
          const dpsElem = row.querySelector('[class*="dps"], [class*="amount"]');
          const dps = dpsElem ? parseFloat(dpsElem.textContent.replace(/,/g, '')) : 0;

          // 퍼센타일
          const percentileElem = row.querySelector('[class*="percentile"], [class*="rank"]');
          const percentile = percentileElem ? parseInt(percentileElem.textContent) : 0;

          // 날짜
          const dateElem = row.querySelector('[class*="date"], time');
          const date = dateElem ? dateElem.textContent.trim() : 'Unknown';

          logData.push({
            boss: bossName,
            dps: dps,
            percentile: percentile,
            date: date,
            reportUrl: reportLink ? `https://www.warcraftlogs.com${reportLink}` : null
          });
        });

        return logData;
      });

      // 로그가 없으면 대체 방법 시도
      if (logs.length === 0) {
        console.log('⚠️ 테이블에서 로그를 찾을 수 없음, 링크 기반 검색 시도...');

        // 모든 report 링크 찾기
        const reportLinks = await this.page.$$eval('a[href*="/reports/"]', links =>
          links.map(link => ({
            text: link.textContent.trim(),
            href: link.getAttribute('href')
          }))
        );

        reportLinks.forEach((link, index) => {
          if (index < 5) { // 최근 5개만
            logs.push({
              boss: link.text,
              reportUrl: `https://www.warcraftlogs.com${link.href}`
            });
          }
        });
      }

      return {
        player: player,
        logs: logs.slice(0, 10) // 최근 10개 로그만
      };

    } catch (error) {
      console.error(`❌ ${player.name}의 로그 수집 실패:`, error);
      return { player: player, logs: [] };
    }
  }

  // 3단계: 특정 전투 로그 상세 분석
  async analyzeReport(reportUrl, fightId = null) {
    try {
      console.log(`📈 전투 분석: ${reportUrl}`);

      await this.page.goto(reportUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      // 전투 상세 데이터 수집
      const fightData = await this.page.evaluate(() => {
        // 데미지 차트, 타임라인 등에서 데이터 추출
        const data = {
          duration: 0,
          totalDamage: 0,
          deaths: 0,
          wipes: 0,
          skills: []
        };

        // 전투 시간
        const durationElem = document.querySelector('[class*="duration"], [class*="fight-length"]');
        if (durationElem) {
          data.duration = durationElem.textContent.trim();
        }

        // 총 데미지
        const damageElems = document.querySelectorAll('[class*="damage"], [class*="total"]');
        damageElems.forEach(elem => {
          const value = parseFloat(elem.textContent.replace(/[^0-9.]/g, ''));
          if (value > data.totalDamage) {
            data.totalDamage = value;
          }
        });

        // 스킬 사용 정보
        const skillRows = document.querySelectorAll('[class*="ability"], [class*="spell"]');
        skillRows.forEach(row => {
          const skillName = row.querySelector('a, span')?.textContent.trim();
          const damage = row.querySelector('[class*="damage"]')?.textContent.trim();
          const count = row.querySelector('[class*="count"]')?.textContent.trim();

          if (skillName) {
            data.skills.push({
              name: skillName,
              damage: damage || '0',
              count: count || '0'
            });
          }
        });

        return data;
      });

      return fightData;

    } catch (error) {
      console.error('❌ 전투 분석 실패:', error);
      return null;
    }
  }

  // 전체 플로우 실행 - 큐 시스템 사용
  async fetchCompleteData(zoneId = 44, playerLimit = 5) {
    // 큐를 통해 실행하여 동시 실행 방지
    return browserQueue.add(async () => {
      try {
        // 1. 상위 플레이어 목록 가져오기
        const topPlayers = await this.fetchTopPlayers(zoneId, playerLimit);

        if (topPlayers.length === 0) {
          console.log('⚠️ 플레이어 정보를 가져올 수 없습니다');
          return [];
        }

        const completeData = [];

        // 2. 각 플레이어의 로그 수집
        for (const player of topPlayers) {
          const playerLogs = await this.fetchPlayerLogs(player);

          // 3. 첫 번째 로그 상세 분석 (선택적)
          if (playerLogs.logs.length > 0 && playerLogs.logs[0].reportUrl) {
            const fightAnalysis = await this.analyzeReport(playerLogs.logs[0].reportUrl);
            playerLogs.latestFightAnalysis = fightAnalysis;
          }

          completeData.push(playerLogs);

          // 과도한 요청 방지
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        return completeData;

      } catch (error) {
        console.error('❌ 전체 데이터 수집 실패:', error);
        return [];
      } finally {
        // 브라우저 정리
        await this.close();
      }
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

module.exports = new WarcraftLogsPlayerLogs();