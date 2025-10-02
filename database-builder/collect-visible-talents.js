const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectVisibleTalents() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  try {
    console.log('🌐 Wowhead 야수 사냥꾼 특성 트리 접속 중...');
    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 페이지 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 7000));

    // 특성 트리가 보이는 영역까지 스크롤
    await page.evaluate(() => {
      const trees = document.querySelector('.dragonflight-talent-trees');
      if (trees) {
        trees.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 스크롤 후 특성 데이터 수집
    const talentData = await page.evaluate(() => {
      const result = {
        classTalents: [],
        specTalents: [],
        heroTalents: [],
        totalCount: 0,
        viewport: {
          scrollY: window.scrollY,
          innerHeight: window.innerHeight
        },
        debug: []
      };

      // 모든 특성 링크 찾기
      const allSpellLinks = document.querySelectorAll('a[href*="/spell="]');

      allSpellLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const spellId = href.match(/spell=(\d+)/)?.[1];

        if (spellId) {
          const rect = link.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;
          const absoluteLeft = rect.left + window.scrollX;

          // 텍스트 내용과 부모 요소 정보 수집
          const talentInfo = {
            id: spellId,
            name: link.textContent.trim(),
            position: {
              screenTop: Math.round(rect.top),
              screenLeft: Math.round(rect.left),
              absoluteTop: Math.round(absoluteTop),
              absoluteLeft: Math.round(absoluteLeft)
            }
          };

          // 화면에 보이는 특성만 분류 (viewport 기준)
          if (rect.top > 0 && rect.top < window.innerHeight && rect.left > 0 && rect.left < window.innerWidth) {
            // 위치로 트리 타입 추정
            // 직업 특성: 왼쪽 (X < 620)
            // 전문화 특성: 오른쪽 (X >= 620)
            // 영웅 특성: 상단 (별도 섹션)

            if (absoluteLeft < 620) {
              result.classTalents.push(talentInfo);
            } else {
              result.specTalents.push(talentInfo);
            }
          }

          result.debug.push(talentInfo);
        }
      });

      // 영웅 특성 찾기 (별도 섹션)
      const heroSections = document.querySelectorAll('.hero-talent-tree, [class*="hero"]');
      heroSections.forEach(section => {
        const heroLinks = section.querySelectorAll('a[href*="/spell="]');
        heroLinks.forEach(link => {
          const href = link.getAttribute('href');
          const spellId = href.match(/spell=(\d+)/)?.[1];
          if (spellId) {
            result.heroTalents.push({
              id: spellId,
              name: link.textContent.trim()
            });
          }
        });
      });

      result.totalCount = result.classTalents.length + result.specTalents.length + result.heroTalents.length;

      return result;
    });

    // 결과 저장
    const outputPath = path.join(__dirname, 'visible-talents.json');
    fs.writeFileSync(outputPath, JSON.stringify(talentData, null, 2), 'utf-8');

    console.log('\n📊 화면에 보이는 특성 개수:');
    console.log('================================');
    console.log(`✅ 직업 특성: ${talentData.classTalents.length}개`);
    console.log(`✅ 전문화 특성: ${talentData.specTalents.length}개`);
    console.log(`✅ 영웅 특성: ${talentData.heroTalents.length}개`);
    console.log('--------------------------------');
    console.log(`📌 전체 특성 개수: ${talentData.totalCount}개`);
    console.log(`📋 디버그용 전체 링크: ${talentData.debug.length}개`);
    console.log(`📐 스크롤 위치: ${talentData.viewport.scrollY}px`);
    console.log('================================');

    // 스크린샷 저장
    const screenshotPath = path.join(__dirname, 'talent-tree-visible.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 스크린샷 저장: ${screenshotPath}`);

    // 직업 특성 샘플 출력
    if (talentData.classTalents.length > 0) {
      console.log('\n📋 직업 특성 샘플 (처음 5개):');
      talentData.classTalents.slice(0, 5).forEach((t, i) => {
        console.log(`  ${i + 1}. ${t.name} (ID: ${t.id})`);
      });
    }

    // 전문화 특성 샘플 출력
    if (talentData.specTalents.length > 0) {
      console.log('\n📋 전문화 특성 샘플 (처음 5개):');
      talentData.specTalents.slice(0, 5).forEach((t, i) => {
        console.log(`  ${i + 1}. ${t.name} (ID: ${t.id})`);
      });
    }

    console.log(`\n💾 결과 저장 완료: ${outputPath}`);

  } catch (error) {
    console.error('❌  에러 발생:', error);
  } finally {
    await browser.close();
  }
}

collectVisibleTalents();