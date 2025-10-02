/**
 * WowHead에서 실제 특성 빌드 데이터 수집
 * https://www.wowhead.com/ko/guide/classes/hunter/beast-mastery/overview-pve-dps
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeWowheadBuilds() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    console.log('🎯 WowHead 빌드 데이터 수집 시작\n');

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // 단일 대상 빌드 수집
    console.log('📌 단일 대상 빌드 수집 중...');
    await page.goto('https://www.wowhead.com/ko/guide/classes/hunter/beast-mastery/single-target-rotation-pve-dps', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    // 특성 트리 정보 수집
    const singleTargetBuild = await page.evaluate(() => {
      const result = {
        name: '단일 대상',
        description: '',
        talents: []
      };

      // 특성 트리 컨테이너 찾기
      const talentContainers = document.querySelectorAll('.talent-tree-container, .guide-section-talent-builds');

      // 특성 링크들 수집
      const talentLinks = document.querySelectorAll('a[href*="/spell="]');
      talentLinks.forEach(link => {
        const href = link.getAttribute('href');
        const spellId = href?.match(/spell=(\d+)/)?.[1];
        const name = link.textContent?.trim();

        if (spellId && name) {
          // 아이콘 찾기
          const icon = link.querySelector('ins')?.style?.backgroundImage?.match(/\/([^\/]+)\.jpg/)?.[1] || '';

          result.talents.push({
            id: parseInt(spellId),
            name: name,
            icon: icon
          });
        }
      });

      // Import string 찾기
      const importCode = document.querySelector('.talent-loadout-code, code')?.textContent?.trim();
      if (importCode && importCode.startsWith('B')) {
        result.importString = importCode;
      }

      return result;
    });

    console.log(`  ✓ 단일 대상: ${singleTargetBuild.talents.length}개 특성 수집`);

    // AOE 빌드 수집
    console.log('\n📌 AOE/쐐기 빌드 수집 중...');
    await page.goto('https://www.wowhead.com/ko/guide/classes/hunter/beast-mastery/aoe-rotation-pve-dps', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const aoeBuild = await page.evaluate(() => {
      const result = {
        name: '광역 (AOE)',
        description: '',
        talents: []
      };

      const talentLinks = document.querySelectorAll('a[href*="/spell="]');
      talentLinks.forEach(link => {
        const href = link.getAttribute('href');
        const spellId = href?.match(/spell=(\d+)/)?.[1];
        const name = link.textContent?.trim();

        if (spellId && name) {
          const icon = link.querySelector('ins')?.style?.backgroundImage?.match(/\/([^\/]+)\.jpg/)?.[1] || '';

          result.talents.push({
            id: parseInt(spellId),
            name: name,
            icon: icon
          });
        }
      });

      const importCode = document.querySelector('.talent-loadout-code, code')?.textContent?.trim();
      if (importCode && importCode.startsWith('B')) {
        result.importString = importCode;
      }

      return result;
    });

    console.log(`  ✓ AOE: ${aoeBuild.talents.length}개 특성 수집`);

    // 레이드 빌드 수집
    console.log('\n📌 레이드 빌드 수집 중...');
    await page.goto('https://www.wowhead.com/ko/guide/classes/hunter/beast-mastery/talent-builds-pve-dps', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const raidBuild = await page.evaluate(() => {
      const result = {
        name: '레이드',
        description: '',
        talents: []
      };

      // 레이드 빌드 섹션 찾기
      const raidSection = Array.from(document.querySelectorAll('h2, h3')).find(h =>
        h.textContent?.includes('레이드') || h.textContent?.includes('Raid')
      )?.parentElement;

      if (raidSection) {
        const talentLinks = raidSection.querySelectorAll('a[href*="/spell="]');
        talentLinks.forEach(link => {
          const href = link.getAttribute('href');
          const spellId = href?.match(/spell=(\d+)/)?.[1];
          const name = link.textContent?.trim();

          if (spellId && name) {
            const icon = link.querySelector('ins')?.style?.backgroundImage?.match(/\/([^\/]+)\.jpg/)?.[1] || '';

            result.talents.push({
              id: parseInt(spellId),
              name: name,
              icon: icon
            });
          }
        });
      }

      const importCode = document.querySelector('.talent-loadout-code, code')?.textContent?.trim();
      if (importCode && importCode.startsWith('B')) {
        result.importString = importCode;
      }

      return result;
    });

    console.log(`  ✓ 레이드: ${raidBuild.talents.length}개 특성 수집`);

    // 메인 가이드 페이지에서 전체 특성 정보 수집
    console.log('\n📌 전체 특성 정보 수집 중...');
    await page.goto('https://www.wowhead.com/ko/guide/classes/hunter/beast-mastery/talent-builds-pve-dps', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    // 특성 계산기 iframe이나 embed 찾기
    const fullTalentData = await page.evaluate(() => {
      const result = {
        classTalents: [],
        specTalents: [],
        heroTalents: []
      };

      // 모든 특성 관련 요소 수집
      const talentElements = document.querySelectorAll('[data-spell-id], [data-talent-id], .talent-icon');

      talentElements.forEach(elem => {
        const spellId = elem.getAttribute('data-spell-id') || elem.getAttribute('data-talent-id');
        const name = elem.getAttribute('data-name') || elem.querySelector('.talent-name')?.textContent?.trim();
        const icon = elem.querySelector('img')?.src?.match(/\/([^\/]+)\.(jpg|png)/)?.[1];

        if (spellId && name) {
          const talent = {
            id: parseInt(spellId),
            name: name,
            icon: icon || 'inv_misc_questionmark'
          };

          // 트리 타입 구분
          if (elem.classList.contains('class-talent')) {
            result.classTalents.push(talent);
          } else if (elem.classList.contains('spec-talent')) {
            result.specTalents.push(talent);
          } else if (elem.classList.contains('hero-talent')) {
            result.heroTalents.push(talent);
          }
        }
      });

      return result;
    });

    console.log(`  ✓ 직업 특성: ${fullTalentData.classTalents.length}개`);
    console.log(`  ✓ 전문화 특성: ${fullTalentData.specTalents.length}개`);
    console.log(`  ✓ 영웅 특성: ${fullTalentData.heroTalents.length}개`);

    // 최종 데이터 구성
    const finalData = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        source: 'WowHead Korea',
        url: 'https://www.wowhead.com/ko/guide/classes/hunter/beast-mastery'
      },
      builds: {
        singleTarget: singleTargetBuild,
        aoe: aoeBuild,
        raid: raidBuild
      },
      allTalents: fullTalentData,
      stats: {
        singleTarget: singleTargetBuild.talents.length,
        aoe: aoeBuild.talents.length,
        raid: raidBuild.talents.length,
        total: fullTalentData.classTalents.length + fullTalentData.specTalents.length + fullTalentData.heroTalents.length
      }
    };

    // 파일 저장
    const outputPath = path.join(__dirname, 'wowhead-actual-builds.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');

    console.log('\n' + '='.repeat(60));
    console.log('📊 수집 완료');
    console.log('='.repeat(60));
    console.log(`💾 저장: ${outputPath}`);

  } catch (error) {
    console.error('❌ 오류:', error);
  } finally {
    await browser.close();
    console.log('\n🔚 브라우저 종료');
  }
}

// 실행
scrapeWowheadBuilds().catch(console.error);