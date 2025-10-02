/**
 * WoWHead 야수 사냥꾼 전체 특성 수집 스크립트
 * 직업, 전문화, 영웅 특성 모두 포함
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectAllBMTalents() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // 리소스 차단 (성능 최적화)
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
    console.log('🎯 야수 사냥꾼 전체 특성 수집 시작\n');

    // Step 1: 메인 특성 트리 페이지
    console.log('📌 Step 1: 직업/전문화 특성 수집');
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    // 직업/전문화 특성 수집
    const mainTalents = await page.evaluate(() => {
      const result = {
        classTalents: [],
        specTalents: [],
        debug: { total: 0 }
      };

      // 모든 특성 노드 찾기
      const talentNodes = document.querySelectorAll('a[href*="/spell="]');
      result.debug.total = talentNodes.length;

      talentNodes.forEach((node, index) => {
        const href = node.getAttribute('href');
        const spellId = href?.match(/spell=(\d+)/)?.[1];

        if (!spellId) return;

        const name = node.textContent?.trim() || `Spell ${spellId}`;
        const rect = node.getBoundingClientRect();

        // 아이콘 정보
        const iconImg = node.querySelector('img');
        const iconSrc = iconImg?.src || '';
        const iconName = iconSrc.match(/icons\/large\/(.+?)\.jpg/)?.[1] || '';

        const talent = {
          id: parseInt(spellId),
          name: name,
          icon: iconName,
          position: {
            x: Math.round(rect.left),
            y: Math.round(rect.top)
          }
        };

        // 위치로 트리 구분 (왼쪽: 직업, 오른쪽: 전문화)
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

    console.log(`  ✅ 직업 특성: ${mainTalents.classTalents.length}개`);
    console.log(`  ✅ 전문화 특성: ${mainTalents.specTalents.length}개`);
    console.log(`  📊 총 메인 특성: ${mainTalents.debug.total}개\n`);

    // Step 2: 영웅 특성 - 무리의 지도자
    console.log('📌 Step 2: 무리의 지도자 영웅 특성 수집');
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery/pack-leader', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const packLeaderTalents = await page.evaluate(() => {
      const talents = [];
      const nodes = document.querySelectorAll('a[href*="/spell="]');

      nodes.forEach(node => {
        const href = node.getAttribute('href');
        const spellId = href?.match(/spell=(\d+)/)?.[1];

        if (spellId) {
          const name = node.textContent?.trim() || `Spell ${spellId}`;
          const iconImg = node.querySelector('img');
          const iconSrc = iconImg?.src || '';
          const iconName = iconSrc.match(/icons\/large\/(.+?)\.jpg/)?.[1] || '';

          // 영웅 특성인지 확인 (메인 특성과 중복 제거)
          const rect = node.getBoundingClientRect();
          if (rect.top < 600) { // 상단에 있는 영웅 특성만
            talents.push({
              id: parseInt(spellId),
              name: name,
              icon: iconName,
              tree: 'hero-packleader'
            });
          }
        }
      });

      // 중복 제거
      const unique = talents.filter((talent, index, self) =>
        index === self.findIndex(t => t.id === talent.id)
      );

      return unique;
    });

    console.log(`  ✅ 무리의 지도자: ${packLeaderTalents.length}개\n`);

    // Step 3: 영웅 특성 - 어둠 순찰자
    console.log('📌 Step 3: 어둠 순찰자 영웅 특성 수집');
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery/dark-ranger', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const darkRangerTalents = await page.evaluate(() => {
      const talents = [];
      const nodes = document.querySelectorAll('a[href*="/spell="]');

      nodes.forEach(node => {
        const href = node.getAttribute('href');
        const spellId = href?.match(/spell=(\d+)/)?.[1];

        if (spellId) {
          const name = node.textContent?.trim() || `Spell ${spellId}`;
          const iconImg = node.querySelector('img');
          const iconSrc = iconImg?.src || '';
          const iconName = iconSrc.match(/icons\/large\/(.+?)\.jpg/)?.[1] || '';

          // 영웅 특성인지 확인
          const rect = node.getBoundingClientRect();
          if (rect.top < 600) {
            talents.push({
              id: parseInt(spellId),
              name: name,
              icon: iconName,
              tree: 'hero-darkranger'
            });
          }
        }
      });

      // 중복 제거
      const unique = talents.filter((talent, index, self) =>
        index === self.findIndex(t => t.id === talent.id)
      );

      return unique;
    });

    console.log(`  ✅ 어둠 순찰자: ${darkRangerTalents.length}개\n`);

    // Step 4: 툴팁 정보 수집 (샘플)
    console.log('📌 Step 4: 툴팁 정보 수집 (상위 10개 샘플)');

    // 메인 페이지로 돌아가기
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2'
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    const tooltipData = [];
    const allNodes = await page.$$('a[href*="/spell="]');
    const sampleSize = Math.min(10, allNodes.length);

    for (let i = 0; i < sampleSize; i++) {
      try {
        const node = allNodes[i];
        await node.scrollIntoViewIfNeeded();
        await new Promise(resolve => setTimeout(resolve, 300));

        // Hover
        await node.hover();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 툴팁 추출
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
            tooltip: tooltip
          });

          console.log(`  ✓ 툴팁 수집: Spell ${spellId}`);
        }
      } catch (err) {
        // 에러 무시
      }
    }

    // Step 5: 데이터 통합 및 정리
    console.log('\n📌 Step 5: 데이터 통합');

    const allTalents = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        source: 'WoWHead EN',
        class: 'Hunter',
        spec: 'Beast Mastery'
      },
      talents: {
        class: mainTalents.classTalents,
        spec: mainTalents.specTalents,
        hero: {
          packLeader: packLeaderTalents,
          darkRanger: darkRangerTalents
        }
      },
      tooltips: tooltipData,
      stats: {
        classTalents: mainTalents.classTalents.length,
        specTalents: mainTalents.specTalents.length,
        packLeaderTalents: packLeaderTalents.length,
        darkRangerTalents: darkRangerTalents.length,
        total: mainTalents.classTalents.length +
               mainTalents.specTalents.length +
               packLeaderTalents.length +
               darkRangerTalents.length
      }
    };

    // 파일 저장
    const outputPath = path.join(__dirname, 'bm-hunter-all-talents-en.json');
    fs.writeFileSync(outputPath, JSON.stringify(allTalents, null, 2), 'utf-8');

    // 결과 출력
    console.log('\n' + '='.repeat(60));
    console.log('📊 최종 수집 결과');
    console.log('='.repeat(60));
    console.log(`  직업 특성: ${allTalents.stats.classTalents}개`);
    console.log(`  전문화 특성: ${allTalents.stats.specTalents}개`);
    console.log(`  무리의 지도자: ${allTalents.stats.packLeaderTalents}개`);
    console.log(`  어둠 순찰자: ${allTalents.stats.darkRangerTalents}개`);
    console.log('  ' + '-'.repeat(56));
    console.log(`  ✨ 총 특성 개수: ${allTalents.stats.total}개`);
    console.log('='.repeat(60));
    console.log(`\n💾 저장 완료: ${outputPath}`);

    // 샘플 출력
    if (allTalents.talents.class.length > 0) {
      console.log('\n📋 샘플 (첫 번째 직업 특성):');
      console.log(JSON.stringify(allTalents.talents.class[0], null, 2));
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await browser.close();
    console.log('\n🔚 브라우저 종료');
  }
}

// 실행
collectAllBMTalents().catch(console.error);