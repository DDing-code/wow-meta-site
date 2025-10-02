// Playwright를 사용한 실제 Wowhead TWW Season 3 크롤러
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class WowheadPlaywrightCrawler {
  constructor() {
    this.patch = "11.2.0";
    this.season = "TWW Season 3";
    this.browser = null;
    this.page = null;
    this.collectedData = {};
    this.errors = [];
  }

  // 브라우저 초기화
  async initialize() {
    console.log('🌐 브라우저 초기화 중...');
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    this.page = await context.newPage();

    console.log('✅ 브라우저 준비 완료\n');
  }

  // 스킬 데이터 크롤링
  async crawlSpellData(spellId, className = null) {
    try {
      const urls = {
        english: `https://www.wowhead.com/spell=${spellId}`,
        korean: `https://ko.wowhead.com/spell=${spellId}`
      };

      console.log(`  🔍 스킬 ${spellId} 크롤링 시작...`);

      const spellData = {
        base: {
          id: spellId.toString(),
          name: '',
          koreanName: '',
          icon: '',
          class: className || 'Unknown',
          patch: this.patch
        },
        classification: {},
        mechanics: {},
        resources: {},
        specializationDetails: {},
        description: {
          korean: '',
          english: ''
        },
        metadata: {
          patch: this.patch,
          season: this.season,
          lastUpdated: new Date().toISOString(),
          verified: true,
          dataSource: 'wowhead-playwright'
        }
      };

      // 한국어 페이지 크롤링
      await this.page.goto(urls.korean, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 스킬명 추출
      const koreanName = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1.heading-size-1');
        return titleEl ? titleEl.textContent.trim() : '';
      });
      spellData.base.koreanName = koreanName;

      // 아이콘 추출
      const iconUrl = await this.page.evaluate(() => {
        const iconEl = document.querySelector('.iconlarge ins');
        if (iconEl) {
          const style = iconEl.getAttribute('style');
          const match = style ? style.match(/\/icons\/large\/([^.]+)\.jpg/) : null;
          return match ? match[1] : '';
        }
        return '';
      });
      spellData.base.icon = iconUrl;

      // 한국어 설명 추출
      const koreanDesc = await this.page.evaluate(() => {
        const tooltipEl = document.querySelector('.q');
        if (tooltipEl) {
          return tooltipEl.textContent.trim();
        }
        // 대체 선택자 시도
        const spellDescEl = document.querySelector('#spelldetails .indent');
        return spellDescEl ? spellDescEl.textContent.trim() : '';
      });
      spellData.description.korean = koreanDesc;

      // 재사용 대기시간 추출
      const cooldown = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('#spelldetails td');
        for (let el of elements) {
          if (el.textContent.includes('재사용 대기시간')) {
            const nextEl = el.nextElementSibling;
            return nextEl ? nextEl.textContent.trim() : '';
          }
        }
        return '';
      });
      if (cooldown) {
        spellData.mechanics.cooldown = { base: cooldown };
      }

      // 자원 소모 추출
      const resourceCost = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('#spelldetails td');
        for (let el of elements) {
          const text = el.textContent;
          if (text.includes('마나') || text.includes('분노') || text.includes('기력') ||
              text.includes('신성한 힘') || text.includes('룬 마력')) {
            return text.trim();
          }
        }
        return '';
      });
      if (resourceCost) {
        spellData.resources.cost = this.parseResourceCost(resourceCost);
      }

      // 사정거리 추출
      const range = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('#spelldetails td');
        for (let el of elements) {
          if (el.textContent.includes('사정거리')) {
            const nextEl = el.nextElementSibling;
            return nextEl ? nextEl.textContent.trim() : '';
          }
        }
        return '';
      });
      if (range) {
        spellData.mechanics.targeting = { range };
      }

      // 시전 시간 추출
      const castTime = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('#spelldetails td');
        for (let el of elements) {
          if (el.textContent.includes('시전 시간')) {
            const nextEl = el.nextElementSibling;
            return nextEl ? nextEl.textContent.trim() : '';
          }
        }
        return '';
      });
      if (castTime) {
        spellData.mechanics.cast = { castTime };
      }

      // 영어 페이지에서 영문명 추출
      await this.page.goto(urls.english, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      const englishName = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1.heading-size-1');
        return titleEl ? titleEl.textContent.trim() : '';
      });
      spellData.base.name = englishName;

      // 영어 설명 추출
      const englishDesc = await this.page.evaluate(() => {
        const tooltipEl = document.querySelector('.q');
        if (tooltipEl) {
          return tooltipEl.textContent.trim();
        }
        const spellDescEl = document.querySelector('#spelldetails .indent');
        return spellDescEl ? spellDescEl.textContent.trim() : '';
      });
      spellData.description.english = englishDesc;

      console.log(`    ✅ ${koreanName} (${englishName})`);
      return spellData;

    } catch (error) {
      console.error(`    ❌ 스킬 ${spellId} 크롤링 실패:`, error.message);
      this.errors.push({
        spellId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  // 자원 소모 파싱
  parseResourceCost(resourceText) {
    const result = {};

    if (resourceText.includes('마나')) {
      const match = resourceText.match(/(\d+%?)\s*기본 마나/);
      if (match) {
        result.type = '마나';
        result.amount = match[1];
        result.percentage = match[1].includes('%');
      }
    } else if (resourceText.includes('분노')) {
      const match = resourceText.match(/분노\s*(\d+)/);
      if (match) {
        result.type = '분노';
        result.amount = match[1];
      }
    } else if (resourceText.includes('기력')) {
      const match = resourceText.match(/기력\s*(\d+)/);
      if (match) {
        result.type = '기력';
        result.amount = match[1];
      }
    } else if (resourceText.includes('신성한 힘')) {
      const match = resourceText.match(/신성한 힘\s*(\d+)/);
      if (match) {
        result.type = '신성한힘';
        result.amount = match[1];
      }
    }

    return result;
  }

  // 스킬 ID 목록으로 크롤링
  async crawlSpellList(spellIds, className = null) {
    const results = {};

    for (const spellId of spellIds) {
      const data = await this.crawlSpellData(spellId, className);
      if (data) {
        results[spellId] = data;
      }

      // 속도 제한 (1~2초 딜레이)
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    return results;
  }

  // 브라우저 종료
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('\n🔚 브라우저 종료');
    }
  }

  // 데이터 저장
  saveData(data) {
    const outputPath = path.join(__dirname, 'src/data/wowhead-crawled-data.json');

    const outputData = {
      metadata: {
        patch: this.patch,
        season: this.season,
        collectionDate: new Date().toISOString(),
        totalSkills: Object.keys(data).length,
        errors: this.errors.length,
        dataSource: 'wowhead-playwright'
      },
      skills: data,
      errors: this.errors
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`\n✅ 크롤링 데이터 저장 완료: ${outputPath}`);
    console.log(`📊 총 ${outputData.metadata.totalSkills}개 스킬 수집`);

    if (this.errors.length > 0) {
      console.log(`⚠️ ${this.errors.length}개 오류 발생`);
    }
  }
}

// 실행
async function main() {
  const crawler = new WowheadPlaywrightCrawler();

  try {
    console.log('🚀 Wowhead Playwright 크롤러 시작\n');
    console.log('📌 TWW Season 3 (11.2 패치) 데이터 수집\n');

    await crawler.initialize();

    // 테스트용 주요 스킬 ID (실제 운영 시 확장)
    const testSpells = {
      paladin: [
        6940,   // 희생의 축복
        184575, // 심판의 칼날
        204074, // 정의로운 수호자
        853,    // 심판의 망치
        642,    // 천상의 보호막
      ],
      warrior: [
        1680,   // 소용돌이
        46968,  // 칼날폭풍
        23920,  // 주문 반사
        167105, // 거인의 강타
      ]
    };

    const allResults = {};

    // 클래스별 크롤링
    for (const [className, spellIds] of Object.entries(testSpells)) {
      console.log(`\n📊 ${className} 클래스 크롤링:`);
      const classResults = await crawler.crawlSpellList(spellIds, className);
      Object.assign(allResults, classResults);
    }

    // 데이터 저장
    crawler.saveData(allResults);

  } catch (error) {
    console.error('❌ 크롤러 오류:', error);
  } finally {
    await crawler.close();
  }
}

// 모듈 내보내기
module.exports = { WowheadPlaywrightCrawler };

// 직접 실행 시
if (require.main === module) {
  main();
}