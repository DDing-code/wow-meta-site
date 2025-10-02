/**
 * WoWHead Beast Mastery Hunter Talent 완전 수집 스크립트
 *
 * 필요 패키지:
 * npm install puppeteer
 *
 * 실행:
 * node wowhead-complete-scraper.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 유틸리티 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = (min = 1000, max = 3000) => delay(Math.random() * (max - min) + min);

async function scrapeWowheadTalents() {
  const browser = await puppeteer.launch({
    headless: false, // 툴팁 확인을 위해 false로 설정 (배포 시 true로 변경)
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const page = await browser.newPage();

  // User-Agent 설정 (봇 감지 회피)
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // 불필요한 리소스 차단 (성능 최적화)
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const resourceType = request.resourceType();
    const url = request.url();

    // 광고, 분석 스크립트, 대용량 이미지 차단
    if (resourceType === 'image' && !url.includes('icons')) {
      request.abort();
    } else if (['media', 'font', 'stylesheet'].includes(resourceType) && url.includes('ads')) {
      request.abort();
    } else if (url.includes('google-analytics') || url.includes('doubleclick')) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    console.log('📌 Step 1: WoWHead 페이지 접속');
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 페이지 완전 로딩 대기
    await delay(5000);
    console.log('✅ 페이지 로딩 완료');

    console.log('📌 Step 2: 특성 트리 DOM 분석 시작');

    // 실제 WoWHead의 특성 노드 구조 분석
    const talentData = await page.evaluate(() => {
      const talents = {
        classTalents: [],
        specTalents: [],
        heroTalents: {
          packLeader: [],
          darkRanger: []
        },
        errors: [],
        debug: {
          totalNodesFound: 0,
          selectorsUsed: []
        }
      };

      // WoWHead 실제 Selector 패턴들
      const selectors = {
        // 특성 노드 컨테이너
        talentNodes: 'a[href*="/spell="]',
        // 특성 이름 (여러 가능성)
        talentNames: [
          '.talent-name',
          '.spell-name',
          '.icon-name',
          '[data-spell-name]',
          'a[href*="/spell="] > span',
          'a[href*="/spell="]'
        ],
        // 툴팁 관련
        tooltips: [
          '.wowhead-tooltip',
          '.whtt-text',
          '[data-wowhead]',
          '[data-wh-tooltip]',
          '.tooltip-content'
        ]
      };

      talents.debug.selectorsUsed = selectors;

      // 모든 특성 노드 수집
      const allNodes = document.querySelectorAll(selectors.talentNodes);
      talents.debug.totalNodesFound = allNodes.length;

      allNodes.forEach((node, index) => {
        try {
          const href = node.getAttribute('href');
          const spellId = href?.match(/spell=(\d+)/)?.[1];

          if (!spellId) return;

          // 특성 이름 추출 (여러 방법 시도)
          let talentName = node.textContent?.trim() || '';

          // data 속성에서 추출 시도
          const dataName = node.getAttribute('data-name') ||
                          node.getAttribute('data-spell-name') ||
                          node.getAttribute('data-talent-name');

          if (dataName) {
            talentName = dataName;
          }

          // 툴팁/설명 추출 (data 속성 기반)
          let description = '';

          // WoWHead는 data-wowhead 속성에 정보 저장
          const wowheadData = node.getAttribute('data-wowhead');
          if (wowheadData) {
            // data-wowhead="spell=12345&domain=classic" 형식 파싱
            const descMatch = wowheadData.match(/desc=([^&]+)/);
            if (descMatch) {
              description = decodeURIComponent(descMatch[1]);
            }
          }

          // data-wh-tooltip 속성 체크
          const whTooltip = node.getAttribute('data-wh-tooltip');
          if (whTooltip) {
            description = whTooltip;
          }

          // 위치 정보 추출
          const rect = node.getBoundingClientRect();
          const position = {
            x: Math.round(rect.left),
            y: Math.round(rect.top),
            absoluteX: Math.round(rect.left + window.scrollX),
            absoluteY: Math.round(rect.top + window.scrollY)
          };

          // 트리 타입 판별 (위치 기반)
          let treeType = 'unknown';
          const parentContainer = node.closest('.talent-tree-container, .tree-container, [class*="tree"]');

          if (parentContainer) {
            const className = parentContainer.className || '';
            if (className.includes('class') || position.absoluteX < 620) {
              treeType = 'class';
            } else if (className.includes('spec') || position.absoluteX >= 620) {
              treeType = 'spec';
            } else if (className.includes('hero')) {
              treeType = 'hero';
            }
          }

          const talentInfo = {
            id: spellId,
            name: talentName || `Spell ${spellId}`,
            description: description,
            href: href,
            position: position,
            treeType: treeType,
            index: index,
            // 추가 메타데이터
            hasIcon: node.querySelector('img') !== null,
            iconSrc: node.querySelector('img')?.src || '',
            dataAttributes: {
              wowhead: wowheadData,
              whTooltip: whTooltip,
              name: dataName
            }
          };

          // 트리 타입별 분류
          if (treeType === 'class') {
            talents.classTalents.push(talentInfo);
          } else if (treeType === 'spec') {
            talents.specTalents.push(talentInfo);
          } else {
            // 영웅 특성 판별 (이름 기반)
            if (talentName.includes('Pack') || talentName.includes('무리')) {
              talents.heroTalents.packLeader.push(talentInfo);
            } else if (talentName.includes('Dark') || talentName.includes('어둠')) {
              talents.heroTalents.darkRanger.push(talentInfo);
            }
          }

        } catch (err) {
          talents.errors.push({
            index: index,
            error: err.message
          });
        }
      });

      return talents;
    });

    console.log('✅ DOM 분석 완료');
    console.log(`📊 수집된 특성: 총 ${talentData.debug.totalNodesFound}개`);

    // Step 3: 툴팁 데이터 수집 (hover 방식)
    console.log('📌 Step 3: 툴팁 상세 정보 수집');

    const enhancedTalents = [];
    const allTalentLinks = await page.$$('a[href*="/spell="]');

    // 각 특성에 hover하여 툴팁 수집 (샘플링)
    const samplesToCollect = Math.min(10, allTalentLinks.length); // 처음 10개만 샘플

    for (let i = 0; i < samplesToCollect; i++) {
      try {
        const element = allTalentLinks[i];

        // 요소로 스크롤
        await element.scrollIntoView();
        await delay(500);

        // 마우스 hover
        await element.hover();
        await delay(1000); // 툴팁 로딩 대기

        // 툴팁 내용 추출
        const tooltipData = await page.evaluate(() => {
          // WoWHead 툴팁 selector들
          const tooltipSelectors = [
            '.wowhead-tooltip',
            '.whtt-tooltip',
            '#tooltip',
            '[role="tooltip"]',
            '.tooltip:not(.hidden)',
            'div[style*="position: absolute"][style*="visibility: visible"]'
          ];

          for (const selector of tooltipSelectors) {
            const tooltip = document.querySelector(selector);
            if (tooltip && tooltip.innerText) {
              return {
                found: true,
                selector: selector,
                content: tooltip.innerText,
                html: tooltip.innerHTML
              };
            }
          }

          return { found: false };
        });

        if (tooltipData.found) {
          const href = await element.evaluate(el => el.href);
          const spellId = href.match(/spell=(\d+)/)?.[1];

          enhancedTalents.push({
            id: spellId,
            tooltipContent: tooltipData.content,
            tooltipSelector: tooltipData.selector
          });

          console.log(`  ✓ 툴팁 수집: Spell ${spellId}`);
        }

        // Rate limit 회피
        await randomDelay(500, 1500);

      } catch (err) {
        console.log(`  ⚠️ 툴팁 수집 실패: ${err.message}`);
      }
    }

    // Step 4: 데이터 병합 및 정리
    console.log('📌 Step 4: 데이터 정리 및 저장');

    // 툴팁 데이터를 기본 데이터에 병합
    enhancedTalents.forEach(enhanced => {
      // 모든 트리에서 해당 ID 찾아 업데이트
      ['classTalents', 'specTalents'].forEach(treeType => {
        const talent = talentData[treeType].find(t => t.id === enhanced.id);
        if (talent) {
          talent.tooltipContent = enhanced.tooltipContent;
          talent.tooltipSelector = enhanced.tooltipSelector;
        }
      });
    });

    // 최종 결과 정리
    const finalData = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        url: 'https://www.wowhead.com/talent-calc/hunter/beast-mastery',
        totalTalents: talentData.debug.totalNodesFound,
        enhancedCount: enhancedTalents.length
      },
      talents: {
        class: talentData.classTalents,
        specialization: talentData.specTalents,
        hero: talentData.heroTalents
      },
      stats: {
        classTalents: talentData.classTalents.length,
        specTalents: talentData.specTalents.length,
        packLeaderTalents: talentData.heroTalents.packLeader.length,
        darkRangerTalents: talentData.heroTalents.darkRanger.length
      },
      errors: talentData.errors,
      debug: talentData.debug
    };

    // JSON 파일로 저장
    const outputPath = path.join(__dirname, 'wowhead-complete-talents.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');

    // 콘솔 출력
    console.log('\n' + '='.repeat(50));
    console.log('📊 최종 수집 결과:');
    console.log('='.repeat(50));
    console.log(JSON.stringify(finalData.stats, null, 2));
    console.log('='.repeat(50));
    console.log(`✅ 파일 저장: ${outputPath}`);

    // 샘플 데이터 출력
    if (finalData.talents.class.length > 0) {
      console.log('\n📋 샘플 데이터 (첫 번째 직업 특성):');
      console.log(JSON.stringify(finalData.talents.class[0], null, 2));
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    console.error('스택 트레이스:', error.stack);
  } finally {
    await browser.close();
    console.log('\n🔚 브라우저 종료');
  }
}

// 실행
scrapeWowheadTalents().catch(console.error);