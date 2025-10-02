/**
 * ko.wowhead.com 야수 사냥꾼 한국어 특성 수집 스크립트
 * 영어 데이터와 spell ID로 매칭하기 위한 한국어 데이터 수집
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectAllBMTalentsKorean() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // 리소스 차단
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const resourceType = request.resourceType();
    const url = request.url();

    if (resourceType === 'image' && !url.includes('icons') && !url.includes('spell')) {
      request.abort();
    } else if (['media', 'font'].includes(resourceType)) {
      request.abort();
    } else if (url.includes('google-analytics') || url.includes('doubleclick')) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    console.log('🎯 야수 사냥꾼 한국어 특성 수집 시작\n');

    // ko.wowhead.com 접속
    console.log('📌 Step 1: 한국어 직업/전문화 특성 수집');
    await page.goto('https://ko.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    // 한국어 특성 수집
    const koreanTalents = await page.evaluate(() => {
      const result = {
        classTalents: [],
        specTalents: [],
        debug: { total: 0 }
      };

      const talentNodes = document.querySelectorAll('a[href*="/spell="]');
      result.debug.total = talentNodes.length;

      talentNodes.forEach((node, index) => {
        const href = node.getAttribute('href');
        const spellId = href?.match(/spell=(\d+)/)?.[1];

        if (!spellId) return;

        const koreanName = node.textContent?.trim() || '';
        const rect = node.getBoundingClientRect();

        // 아이콘 정보
        const iconImg = node.querySelector('img');
        const iconSrc = iconImg?.src || '';
        const iconName = iconSrc.match(/icons\/large\/(.+?)\.jpg/)?.[1] || '';

        const talent = {
          id: parseInt(spellId),
          koreanName: koreanName,
          icon: iconName,
          position: {
            x: Math.round(rect.left),
            y: Math.round(rect.top)
          }
        };

        // 위치로 트리 구분
        if (rect.left < 620) {
          talent.tree = 'class';
          result.classTalents.push(talent);
        } else {
          talent.tree = 'spec';
          result.specTalents.push(talent);
        }
      });

      return result;
    });

    console.log(`  ✅ 직업 특성: ${koreanTalents.classTalents.length}개`);
    console.log(`  ✅ 전문화 특성: ${koreanTalents.specTalents.length}개`);
    console.log(`  📊 총 한국어 특성: ${koreanTalents.debug.total}개\n`);

    // 툴팁 수집 (샘플)
    console.log('📌 Step 2: 한국어 툴팁 수집 (상위 10개)');

    const tooltipData = [];
    const allNodes = await page.$$('a[href*="/spell="]');
    const sampleSize = Math.min(10, allNodes.length);

    for (let i = 0; i < sampleSize; i++) {
      try {
        const node = allNodes[i];
        await node.scrollIntoViewIfNeeded();
        await new Promise(resolve => setTimeout(resolve, 300));

        await node.hover();
        await new Promise(resolve => setTimeout(resolve, 1000));

        const tooltip = await page.evaluate(() => {
          const tooltipEl = document.querySelector('.wowhead-tooltip');
          if (tooltipEl) {
            return tooltipEl.innerText;
          }
          return null;
        });

        if (tooltip) {
          const href = await node.evaluate(el => el.href);
          const spellId = href.match(/spell=(\d+)/)?.[1];

          tooltipData.push({
            id: parseInt(spellId),
            tooltipKorean: tooltip
          });

          console.log(`  ✓ 한국어 툴팁 수집: Spell ${spellId}`);
        }
      } catch (err) {
        // 에러 무시
      }
    }

    // 영어 데이터 로드
    const enDataPath = path.join(__dirname, 'bm-hunter-all-talents-en.json');
    let enData = null;

    if (fs.existsSync(enDataPath)) {
      console.log('\n📌 Step 3: 영어 데이터와 매칭');
      enData = JSON.parse(fs.readFileSync(enDataPath, 'utf-8'));
    }

    // spell ID 기반 매칭 DB 생성
    const matchedDB = {};

    if (enData) {
      // 영어 데이터 매핑
      const enMap = {};

      // 영어 직업 특성
      enData.talents.class.forEach(talent => {
        enMap[talent.id] = {
          englishName: talent.name,
          icon: talent.icon,
          tree: 'class'
        };
      });

      // 영어 전문화 특성
      enData.talents.spec.forEach(talent => {
        enMap[talent.id] = {
          englishName: talent.name,
          icon: talent.icon,
          tree: 'spec'
        };
      });

      // 한국어 데이터와 매칭
      koreanTalents.classTalents.forEach(talent => {
        if (enMap[talent.id]) {
          matchedDB[talent.id] = {
            id: talent.id,
            koreanName: talent.koreanName,
            englishName: enMap[talent.id].englishName,
            icon: talent.icon || enMap[talent.id].icon,
            tree: talent.tree
          };
        }
      });

      koreanTalents.specTalents.forEach(talent => {
        if (enMap[talent.id]) {
          matchedDB[talent.id] = {
            id: talent.id,
            koreanName: talent.koreanName,
            englishName: enMap[talent.id].englishName,
            icon: talent.icon || enMap[talent.id].icon,
            tree: talent.tree
          };
        }
      });

      // 툴팁 데이터 추가
      tooltipData.forEach(tooltip => {
        if (matchedDB[tooltip.id]) {
          matchedDB[tooltip.id].tooltipKorean = tooltip.tooltipKorean;
        }
      });

      // 영어 툴팁 데이터 추가
      if (enData.tooltips) {
        enData.tooltips.forEach(tooltip => {
          if (matchedDB[tooltip.id]) {
            matchedDB[tooltip.id].tooltipEnglish = tooltip.tooltip;
          }
        });
      }
    }

    // 최종 데이터 생성
    const finalData = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        sourceKO: 'ko.wowhead.com',
        sourceEN: 'www.wowhead.com',
        class: 'Hunter',
        spec: 'Beast Mastery'
      },
      koreanTalents: {
        class: koreanTalents.classTalents,
        spec: koreanTalents.specTalents
      },
      matchedDatabase: matchedDB,
      tooltipsKorean: tooltipData,
      stats: {
        koreanClass: koreanTalents.classTalents.length,
        koreanSpec: koreanTalents.specTalents.length,
        totalKorean: koreanTalents.debug.total,
        matchedCount: Object.keys(matchedDB).length
      }
    };

    // 파일 저장
    const outputPath = path.join(__dirname, 'bm-hunter-talents-complete-db.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');

    // 결과 출력
    console.log('\n' + '='.repeat(60));
    console.log('📊 최종 매칭 결과');
    console.log('='.repeat(60));
    console.log(`  한국어 직업 특성: ${finalData.stats.koreanClass}개`);
    console.log(`  한국어 전문화 특성: ${finalData.stats.koreanSpec}개`);
    console.log(`  총 한국어 특성: ${finalData.stats.totalKorean}개`);
    console.log('  ' + '-'.repeat(56));
    console.log(`  ✨ 매칭된 특성: ${finalData.stats.matchedCount}개`);
    console.log('='.repeat(60));
    console.log(`\n💾 완전한 DB 저장: ${outputPath}`);

    // 샘플 출력
    const firstMatch = Object.values(matchedDB)[0];
    if (firstMatch) {
      console.log('\n📋 매칭 샘플:');
      console.log(JSON.stringify(firstMatch, null, 2));
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await browser.close();
    console.log('\n🔚 브라우저 종료');
  }
}

// 실행
collectAllBMTalentsKorean().catch(console.error);