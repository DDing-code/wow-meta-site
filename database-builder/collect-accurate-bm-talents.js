/**
 * WoWHead 야수 사냥꾼 정확한 특성 수집
 * 중복 제거 및 실제 특성만 필터링
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectAccurateBMTalents() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    console.log('🎯 WoWHead 야수 사냥꾼 정확한 특성 수집 시작\n');

    await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 페이지 완전 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 특성 트리가 있는 영역으로 스크롤
    await page.evaluate(() => {
      const talentSection = document.querySelector('.dragonflight-talent-trees');
      if (talentSection) {
        talentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 정확한 특성 수집
    const talentData = await page.evaluate(() => {
      const result = {
        classTalents: [],
        specTalents: [],
        heroTalents: [],
        debug: {
          totalLinks: 0,
          uniqueTalents: 0,
          duplicates: []
        }
      };

      // 모든 spell 링크 찾기
      const allSpellLinks = document.querySelectorAll('a[href*="/spell="]');
      result.debug.totalLinks = allSpellLinks.length;

      console.log('Found spell links:', allSpellLinks.length);

      // 중복 제거를 위한 Set
      const seenIds = new Set();
      const talentMap = new Map();

      allSpellLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const spellId = href?.match(/spell=(\d+)/)?.[1];

        if (!spellId) return;

        // 중복 체크
        if (seenIds.has(spellId)) {
          result.debug.duplicates.push(spellId);
          return;
        }

        seenIds.add(spellId);

        // 특성 정보 수집
        const rect = link.getBoundingClientRect();
        const name = link.textContent?.trim() || '';

        // 빈 텍스트나 불필요한 링크 필터링
        if (!name || name === '' || name.includes('Rank')) {
          return;
        }

        // 실제 특성 트리 영역인지 확인 (Y 좌표 기반)
        // 특성 트리는 보통 페이지의 특정 영역에 위치
        const scrollTop = window.scrollY;
        const absoluteTop = rect.top + scrollTop;

        // 너무 위나 아래에 있는 것들은 특성이 아님
        if (absoluteTop < 500 || absoluteTop > 2000) {
          return;
        }

        const talent = {
          id: parseInt(spellId),
          name: name,
          position: {
            screenX: Math.round(rect.left),
            screenY: Math.round(rect.top),
            absoluteX: Math.round(rect.left),
            absoluteY: Math.round(absoluteTop)
          }
        };

        // 위치로 트리 타입 구분
        // 직업 특성: 왼쪽 (X < 620)
        // 전문화 특성: 오른쪽 (X >= 620)
        if (rect.left < 620) {
          talent.tree = 'class';
          result.classTalents.push(talent);
        } else {
          talent.tree = 'spec';
          result.specTalents.push(talent);
        }

        talentMap.set(spellId, talent);
      });

      result.debug.uniqueTalents = talentMap.size;

      // 그리드 위치 계산 (상대적 위치 기반)
      const calculateGrid = (talents) => {
        if (talents.length === 0) return talents;

        // Y 위치로 정렬하여 row 계산
        const sortedByY = [...talents].sort((a, b) => a.position.absoluteY - b.position.absoluteY);

        let currentRow = 1;
        let lastY = sortedByY[0].position.absoluteY;
        const rowThreshold = 50; // 같은 row로 간주할 Y 차이

        sortedByY.forEach(talent => {
          if (talent.position.absoluteY - lastY > rowThreshold) {
            currentRow++;
            lastY = talent.position.absoluteY;
          }
          talent.gridRow = currentRow;
        });

        // 각 row 내에서 X 위치로 정렬하여 column 계산
        for (let row = 1; row <= currentRow; row++) {
          const rowTalents = talents.filter(t => t.gridRow === row);
          const sortedByX = rowTalents.sort((a, b) => a.position.screenX - b.position.screenX);

          sortedByX.forEach((talent, index) => {
            // 3열 그리드로 매핑 (X 위치 기반)
            if (sortedByX.length === 1) {
              talent.gridCol = 2; // 중앙
            } else if (sortedByX.length === 2) {
              talent.gridCol = index === 0 ? 1 : 3;
            } else {
              // X 위치 차이로 컬럼 결정
              const minX = sortedByX[0].position.screenX;
              const maxX = sortedByX[sortedByX.length - 1].position.screenX;
              const range = maxX - minX;

              if (range > 0) {
                const relativeX = (talent.position.screenX - minX) / range;
                if (relativeX < 0.33) {
                  talent.gridCol = 1;
                } else if (relativeX < 0.67) {
                  talent.gridCol = 2;
                } else {
                  talent.gridCol = 3;
                }
              } else {
                talent.gridCol = 2;
              }
            }
          });
        }

        return talents;
      };

      // 그리드 위치 계산
      result.classTalents = calculateGrid(result.classTalents);
      result.specTalents = calculateGrid(result.specTalents);

      return result;
    });

    // 영웅 특성 확인 (별도 탭)
    console.log('📌 영웅 특성 확인 중...');

    // 영웅 특성은 별도 처리 필요 (현재는 스킵)

    // 결과 출력
    console.log('\n📊 수집 결과:');
    console.log('='.repeat(50));
    console.log(`  총 링크 발견: ${talentData.debug.totalLinks}개`);
    console.log(`  중복 제거: ${talentData.debug.duplicates.length}개`);
    console.log(`  고유 특성: ${talentData.debug.uniqueTalents}개`);
    console.log('  ' + '-'.repeat(46));
    console.log(`  ✅ 직업 특성: ${talentData.classTalents.length}개`);
    console.log(`  ✅ 전문화 특성: ${talentData.specTalents.length}개`);
    console.log(`  ✅ 영웅 특성: ${talentData.heroTalents.length}개`);
    console.log('  ' + '-'.repeat(46));

    const total = talentData.classTalents.length +
                  talentData.specTalents.length +
                  talentData.heroTalents.length;

    console.log(`  📌 실제 특성 총계: ${total}개`);
    console.log('='.repeat(50));

    // 파일 저장
    const outputPath = path.join(__dirname, 'bm-hunter-accurate-talents.json');
    fs.writeFileSync(outputPath, JSON.stringify(talentData, null, 2), 'utf-8');
    console.log(`\n💾 저장 완료: ${outputPath}`);

    // 샘플 출력
    if (talentData.classTalents.length > 0) {
      console.log('\n📋 직업 특성 샘플 (처음 3개):');
      talentData.classTalents.slice(0, 3).forEach(t => {
        console.log(`  [${t.id}] ${t.name} - Row ${t.gridRow}, Col ${t.gridCol}`);
      });
    }

    if (talentData.specTalents.length > 0) {
      console.log('\n📋 전문화 특성 샘플 (처음 3개):');
      talentData.specTalents.slice(0, 3).forEach(t => {
        console.log(`  [${t.id}] ${t.name} - Row ${t.gridRow}, Col ${t.gridCol}`);
      });
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await browser.close();
    console.log('\n🔚 브라우저 종료');
  }
}

collectAccurateBMTalents().catch(console.error);