/**
 * WoWHead 고급 스크래핑 - 에러 처리 및 Fallback 전략 포함
 *
 * 주요 기능:
 * 1. Headless 모드에서도 작동하는 툴팁 수집
 * 2. Rate limit 회피 전략
 * 3. 다양한 fallback 메커니즘
 * 4. 성능 최적화
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class WowheadScraper {
  constructor(options = {}) {
    this.options = {
      headless: options.headless ?? true,
      rateLimit: options.rateLimit ?? { min: 1000, max: 3000 },
      maxRetries: options.maxRetries ?? 3,
      timeout: options.timeout ?? 30000,
      blockResources: options.blockResources ?? true,
      userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
      ]
    };

    this.talentData = {
      classTalents: [],
      specTalents: [],
      heroTalents: { packLeader: [], darkRanger: [] },
      errors: []
    };
  }

  // 랜덤 User-Agent 선택
  getRandomUserAgent() {
    return this.options.userAgents[Math.floor(Math.random() * this.options.userAgents.length)];
  }

  // 랜덤 딜레이
  async randomDelay() {
    const delay = Math.random() * (this.options.rateLimit.max - this.options.rateLimit.min) + this.options.rateLimit.min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // 브라우저 초기화
  async initBrowser() {
    this.browser = await puppeteer.launch({
      headless: this.options.headless,
      defaultViewport: { width: 1920, height: 1080 },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();

    // Stealth 설정 (봇 감지 회피)
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    await this.page.setUserAgent(this.getRandomUserAgent());

    // 리소스 차단 설정
    if (this.options.blockResources) {
      await this.setupRequestInterception();
    }
  }

  // 리소스 차단 설정
  async setupRequestInterception() {
    await this.page.setRequestInterception(true);

    this.page.on('request', (request) => {
      const resourceType = request.resourceType();
      const url = request.url();

      // 차단 규칙
      const blockPatterns = [
        'google-analytics',
        'doubleclick',
        'facebook',
        'amazon-adsystem',
        'googlesyndication',
        'adnxs',
        'twitter.com',
        'pinterest.com'
      ];

      const shouldBlock =
        // 광고 및 추적 스크립트 차단
        blockPatterns.some(pattern => url.includes(pattern)) ||
        // 대용량 미디어 차단 (아이콘 제외)
        (resourceType === 'image' && !url.includes('icons') && !url.includes('spell')) ||
        resourceType === 'media' ||
        resourceType === 'font' ||
        // 불필요한 스타일시트 차단
        (resourceType === 'stylesheet' && url.includes('ads'));

      if (shouldBlock) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  // 메인 스크래핑 로직
  async scrapeTalents() {
    console.log('🚀 WoWHead 특성 스크래핑 시작');

    await this.initBrowser();

    try {
      // 페이지 접속 (재시도 포함)
      for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
        try {
          console.log(`📌 페이지 접속 시도 ${attempt}/${this.options.maxRetries}`);

          await this.page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
            waitUntil: 'networkidle2',
            timeout: this.options.timeout
          });

          // 특성 트리 로딩 대기
          await this.page.waitForSelector('a[href*="/spell="]', { timeout: 10000 });

          console.log('✅ 페이지 로딩 성공');
          break;
        } catch (err) {
          console.log(`⚠️ 시도 ${attempt} 실패: ${err.message}`);
          if (attempt === this.options.maxRetries) throw err;
          await this.randomDelay();
        }
      }

      // Step 1: 기본 특성 데이터 수집
      await this.collectBasicTalentData();

      // Step 2: 툴팁 데이터 수집 (여러 전략 사용)
      await this.collectTooltipData();

      // Step 3: Fallback - data 속성 기반 수집
      await this.collectDataAttributes();

      // Step 4: 데이터 후처리 및 정리
      this.postProcessData();

      return this.talentData;

    } finally {
      await this.browser.close();
    }
  }

  // 기본 특성 데이터 수집
  async collectBasicTalentData() {
    console.log('📊 Step 1: 기본 특성 데이터 수집');

    this.talentData = await this.page.evaluate(() => {
      const result = {
        classTalents: [],
        specTalents: [],
        heroTalents: { packLeader: [], darkRanger: [] },
        errors: [],
        debug: { totalFound: 0 }
      };

      // 모든 특성 링크 수집
      const talentNodes = document.querySelectorAll('a[href*="/spell="]');
      result.debug.totalFound = talentNodes.length;

      talentNodes.forEach((node, index) => {
        try {
          const href = node.getAttribute('href');
          const spellId = href?.match(/spell=(\d+)/)?.[1];
          if (!spellId) return;

          // 특성 이름 추출 (여러 방법 시도)
          const name =
            node.getAttribute('data-name') ||
            node.getAttribute('title') ||
            node.querySelector('.talent-name')?.textContent ||
            node.textContent?.trim() ||
            `Spell ${spellId}`;

          // 위치 계산
          const rect = node.getBoundingClientRect();
          const position = {
            x: rect.left,
            y: rect.top,
            absoluteX: rect.left + window.scrollX,
            absoluteY: rect.top + window.scrollY
          };

          // 아이콘 정보
          const iconImg = node.querySelector('img');
          const iconSrc = iconImg?.src || '';
          const iconName = iconSrc.match(/icons\/large\/(.+?)\.jpg/)?.[1] || '';

          const talent = {
            id: spellId,
            name: name,
            href: href,
            position: position,
            icon: iconName,
            iconSrc: iconSrc,
            index: index
          };

          // 트리 타입 판별 (위치 기반)
          if (position.absoluteX < 620) {
            result.classTalents.push(talent);
          } else {
            result.specTalents.push(talent);
          }

        } catch (err) {
          result.errors.push({ index, error: err.message });
        }
      });

      return result;
    });

    console.log(`  ✓ 수집 완료: ${this.talentData.debug.totalFound}개 특성`);
  }

  // 툴팁 데이터 수집
  async collectTooltipData() {
    console.log('📊 Step 2: 툴팁 데이터 수집');

    // Headless 모드 체크
    if (this.options.headless) {
      console.log('  ℹ️ Headless 모드 - JavaScript 기반 툴팁 수집');
      await this.collectTooltipViaJS();
    } else {
      console.log('  ℹ️ Non-headless 모드 - Hover 기반 툴팁 수집');
      await this.collectTooltipViaHover();
    }
  }

  // JavaScript로 툴팁 데이터 수집 (Headless 모드용)
  async collectTooltipViaJS() {
    const tooltips = await this.page.evaluate(() => {
      const result = [];

      // WoWHead의 툴팁 데이터는 종종 전역 변수에 저장됨
      if (typeof WH !== 'undefined' && WH.Tooltips) {
        // WH.Tooltips 객체에서 데이터 추출
        for (const key in WH.Tooltips.templates) {
          if (key.includes('spell')) {
            result.push({
              id: key,
              data: WH.Tooltips.templates[key]
            });
          }
        }
      }

      // data-wowhead 속성에서 추출
      document.querySelectorAll('[data-wowhead]').forEach(el => {
        const data = el.getAttribute('data-wowhead');
        const spellMatch = data.match(/spell=(\d+)/);
        if (spellMatch) {
          result.push({
            id: spellMatch[1],
            data: data
          });
        }
      });

      return result;
    });

    console.log(`  ✓ JavaScript 툴팁 수집: ${tooltips.length}개`);

    // 수집된 툴팁 데이터 병합
    this.mergeTooltipData(tooltips);
  }

  // Hover로 툴팁 수집 (Non-headless 모드용)
  async collectTooltipViaHover() {
    const allLinks = await this.page.$$('a[href*="/spell="]');
    const sampleSize = Math.min(20, allLinks.length); // 샘플링
    const collected = [];

    for (let i = 0; i < sampleSize; i++) {
      try {
        const element = allLinks[i];

        // 요소로 스크롤
        await element.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);

        // Hover
        await element.hover();
        await this.page.waitForTimeout(800);

        // 툴팁 추출
        const tooltipContent = await this.page.evaluate(() => {
          const selectors = [
            '.wowhead-tooltip',
            '.whtt-tooltip',
            '#wowhead-tooltip',
            '[role="tooltip"]:not(.hidden)',
            '.tooltip-content'
          ];

          for (const selector of selectors) {
            const tooltip = document.querySelector(selector);
            if (tooltip && tooltip.offsetHeight > 0) {
              return {
                text: tooltip.innerText,
                html: tooltip.innerHTML
              };
            }
          }
          return null;
        });

        if (tooltipContent) {
          const href = await element.evaluate(el => el.href);
          const spellId = href.match(/spell=(\d+)/)?.[1];

          collected.push({
            id: spellId,
            tooltip: tooltipContent
          });

          console.log(`  ✓ 툴팁 수집: Spell ${spellId}`);
        }

        // Rate limit
        await this.randomDelay();

      } catch (err) {
        // 에러는 조용히 처리
      }
    }

    console.log(`  ✓ Hover 툴팁 수집 완료: ${collected.length}개`);
    this.mergeTooltipData(collected);
  }

  // Data 속성 수집 (Fallback)
  async collectDataAttributes() {
    console.log('📊 Step 3: Data 속성 Fallback 수집');

    const dataAttributes = await this.page.evaluate(() => {
      const result = [];

      document.querySelectorAll('a[href*="/spell="]').forEach(node => {
        const spellId = node.href?.match(/spell=(\d+)/)?.[1];
        if (!spellId) return;

        // 모든 data-* 속성 수집
        const dataAttrs = {};
        for (const attr of node.attributes) {
          if (attr.name.startsWith('data-')) {
            dataAttrs[attr.name] = attr.value;
          }
        }

        if (Object.keys(dataAttrs).length > 0) {
          result.push({
            id: spellId,
            attributes: dataAttrs
          });
        }
      });

      return result;
    });

    console.log(`  ✓ Data 속성 수집: ${dataAttributes.length}개`);

    // data 속성 정보 병합
    dataAttributes.forEach(item => {
      const updateTalent = (talent) => {
        if (talent.id === item.id) {
          talent.dataAttributes = item.attributes;

          // 설명이 없으면 data 속성에서 추출
          if (!talent.description && item.attributes['data-description']) {
            talent.description = item.attributes['data-description'];
          }
        }
      };

      this.talentData.classTalents.forEach(updateTalent);
      this.talentData.specTalents.forEach(updateTalent);
    });
  }

  // 툴팁 데이터 병합
  mergeTooltipData(tooltipData) {
    tooltipData.forEach(item => {
      const updateTalent = (talent) => {
        if (talent.id === item.id) {
          if (item.tooltip) {
            talent.tooltipText = item.tooltip.text;
            talent.tooltipHtml = item.tooltip.html;
          }
          if (item.data) {
            talent.tooltipData = item.data;
          }
        }
      };

      this.talentData.classTalents.forEach(updateTalent);
      this.talentData.specTalents.forEach(updateTalent);
    });
  }

  // 데이터 후처리
  postProcessData() {
    console.log('📊 Step 4: 데이터 후처리');

    // 통계 계산
    this.talentData.stats = {
      classTalents: this.talentData.classTalents.length,
      specTalents: this.talentData.specTalents.length,
      heroTalents: {
        packLeader: this.talentData.heroTalents.packLeader.length,
        darkRanger: this.talentData.heroTalents.darkRanger.length
      },
      total: this.talentData.classTalents.length + this.talentData.specTalents.length,
      errors: this.talentData.errors.length
    };

    console.log('  ✓ 통계:', JSON.stringify(this.talentData.stats, null, 2));
  }

  // 결과 저장
  async saveResults(filename = 'wowhead-talents-complete.json') {
    const outputPath = path.join(__dirname, filename);

    const output = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        url: 'https://www.wowhead.com/talent-calc/hunter/beast-mastery',
        headlessMode: this.options.headless,
        userAgent: this.getRandomUserAgent()
      },
      talents: this.talentData,
      stats: this.talentData.stats
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`✅ 결과 저장: ${outputPath}`);

    return outputPath;
  }
}

// 실행
async function main() {
  const scraper = new WowheadScraper({
    headless: false, // true로 변경하여 백그라운드 실행 가능
    rateLimit: { min: 500, max: 2000 },
    maxRetries: 3,
    blockResources: true
  });

  try {
    const data = await scraper.scrapeTalents();
    await scraper.saveResults();

    // 결과 출력
    console.log('\n' + '='.repeat(50));
    console.log('📊 최종 결과:');
    console.log('='.repeat(50));
    console.log(JSON.stringify(data.stats, null, 2));

    // 샘플 출력
    if (data.classTalents.length > 0) {
      console.log('\n📋 샘플 (첫 번째 직업 특성):');
      console.log(JSON.stringify(data.classTalents[0], null, 2));
    }

  } catch (error) {
    console.error('❌ 오류:', error.message);
    console.error(error.stack);
  }
}

// 모듈로도 사용 가능
module.exports = WowheadScraper;

// 직접 실행 시
if (require.main === module) {
  main().catch(console.error);
}