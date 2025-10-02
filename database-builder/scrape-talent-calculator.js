/**
 * WowHead 특성 계산기에서 직접 빌드 데이터 수집
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// WowHead 가이드에 나온 실제 import 문자열들
const TALENT_BUILDS = {
  singleTarget: {
    name: '단일 대상 (Single Target)',
    heroTalent: '무리의 지도자',
    importString: 'B4PAA+jLdyb/oR7T2I4kSSSaSKJJpEIikQSSSKRJJCBAAAAAAAAAAAAAAAwYmZmZmxMzMzYGzMzMzMDDzMzMmZMjhZmZGAgZMA',
    url: 'https://www.wowhead.com/talent-calc/hunter/beast-mastery/pack-leader/DAREFRUVBVQFFQIBAwURJRElERIRJBUFVAVQlFFFBRQFEQSg'
  },
  aoe: {
    name: '광역 (AOE/쐐기)',
    heroTalent: '무리의 지도자',
    importString: 'B4PAA+jLdyb/oR7T2I4kSSSaSKJJpEIikQSSSKRJJCBAAAAAAAAAAAAAAAwYmZmZmxMzMzYGzMzMzMDzYmZmZmhMmZmxAAzYA',
    url: 'https://www.wowhead.com/talent-calc/hunter/beast-mastery/pack-leader/DAREFRUVBVQFFQIBAwURJRElERIRJBUFVAVQlFFFBRQFEQUg'
  },
  raid: {
    name: '레이드',
    heroTalent: '어둠 순찰자',
    importString: 'B8PAvaNW+SCu2Sp3N/EkkkkrUSTSJRJJJJkEJJhIRJBAAAAAAAAAAAAAAAAAzYmZmZMzMzMmZMzMzMzwMmxMzMsxMzMzYAAmlA',
    url: 'https://www.wowhead.com/talent-calc/hunter/beast-mastery/dark-ranger/DAREFRUVBVQFFQIBAwURJRElERIRJBUFVAVQlFFFBRQFEQVA'
  }
};

async function scrapeTalentCalculator() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    console.log('🎯 WowHead 특성 계산기 데이터 수집 시작\n');

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    const collectedBuilds = {};

    // 각 빌드별로 데이터 수집
    for (const [key, build] of Object.entries(TALENT_BUILDS)) {
      console.log(`\n📌 ${build.name} 빌드 수집 중...`);

      await page.goto(build.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 페이지 완전 로딩 대기
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 특성 데이터 수집
      const talentData = await page.evaluate(() => {
        const result = {
          classTalents: [],
          specTalents: [],
          heroTalents: []
        };

        // 직업 특성 수집
        const classTalentNodes = document.querySelectorAll('.talent-tree-class .talent-node');
        classTalentNodes.forEach((node, index) => {
          const isSelected = node.classList.contains('selected') ||
                           node.classList.contains('active') ||
                           node.querySelector('.talent-node-active');

          if (isSelected) {
            const tooltip = node.getAttribute('data-tooltip') || node.getAttribute('title');
            const spellId = node.getAttribute('data-spell-id') ||
                          node.getAttribute('data-talent-id') ||
                          node.querySelector('a[href*="/spell="]')?.href?.match(/spell=(\d+)/)?.[1];

            const name = node.querySelector('.talent-name')?.textContent?.trim() ||
                        tooltip?.split('|')[0]?.trim() ||
                        '';

            const icon = node.querySelector('img')?.src?.match(/\/([^\/]+)\.(jpg|png)/)?.[1] ||
                        node.querySelector('ins')?.style?.backgroundImage?.match(/\/([^\/]+)\.(jpg|png)/)?.[1] ||
                        '';

            // 그리드 위치 계산
            const gridPosition = window.getComputedStyle(node);
            const row = parseInt(gridPosition.gridRowStart || index / 3 + 1);
            const col = parseInt(gridPosition.gridColumnStart || (index % 3) + 1);

            if (spellId && name) {
              result.classTalents.push({
                id: parseInt(spellId),
                name: name,
                icon: icon,
                row: row,
                col: col,
                selected: true
              });
            }
          }
        });

        // 전문화 특성 수집
        const specTalentNodes = document.querySelectorAll('.talent-tree-spec .talent-node');
        specTalentNodes.forEach((node, index) => {
          const isSelected = node.classList.contains('selected') ||
                           node.classList.contains('active') ||
                           node.querySelector('.talent-node-active');

          if (isSelected) {
            const tooltip = node.getAttribute('data-tooltip') || node.getAttribute('title');
            const spellId = node.getAttribute('data-spell-id') ||
                          node.getAttribute('data-talent-id') ||
                          node.querySelector('a[href*="/spell="]')?.href?.match(/spell=(\d+)/)?.[1];

            const name = node.querySelector('.talent-name')?.textContent?.trim() ||
                        tooltip?.split('|')[0]?.trim() ||
                        '';

            const icon = node.querySelector('img')?.src?.match(/\/([^\/]+)\.(jpg|png)/)?.[1] ||
                        node.querySelector('ins')?.style?.backgroundImage?.match(/\/([^\/]+)\.(jpg|png)/)?.[1] ||
                        '';

            const gridPosition = window.getComputedStyle(node);
            const row = parseInt(gridPosition.gridRowStart || index / 3 + 1);
            const col = parseInt(gridPosition.gridColumnStart || (index % 3) + 1);

            if (spellId && name) {
              result.specTalents.push({
                id: parseInt(spellId),
                name: name,
                icon: icon,
                row: row,
                col: col,
                selected: true
              });
            }
          }
        });

        // 영웅 특성 수집
        const heroTalentNodes = document.querySelectorAll('.hero-talent-tree .talent-node');
        heroTalentNodes.forEach((node) => {
          const isSelected = node.classList.contains('selected') ||
                           node.classList.contains('active');

          if (isSelected) {
            const spellId = node.getAttribute('data-spell-id') ||
                          node.getAttribute('data-talent-id');
            const name = node.querySelector('.talent-name')?.textContent?.trim() || '';
            const icon = node.querySelector('img')?.src?.match(/\/([^\/]+)\.(jpg|png)/)?.[1] || '';

            if (spellId && name) {
              result.heroTalents.push({
                id: parseInt(spellId),
                name: name,
                icon: icon,
                selected: true
              });
            }
          }
        });

        return result;
      });

      console.log(`  ✓ 직업 특성: ${talentData.classTalents.length}개`);
      console.log(`  ✓ 전문화 특성: ${talentData.specTalents.length}개`);
      console.log(`  ✓ 영웅 특성: ${talentData.heroTalents.length}개`);

      collectedBuilds[key] = {
        ...build,
        talents: talentData
      };
    }

    // 기존 정확한 특성 데이터 로드 및 병합
    const accurateTalents = require('./bm-hunter-accurate-talents.json');
    const completeTalents = require('./bm-hunter-complete-talent-db.json');

    // 최종 데이터 구성
    const finalBuilds = {};

    for (const [key, build] of Object.entries(collectedBuilds)) {
      finalBuilds[key] = {
        name: build.name,
        description: key === 'singleTarget' ?
          '레이드 보스전 및 단일 대상에 최적화된 빌드입니다.' :
          key === 'aoe' ?
          '신화+ 던전 및 다수 대상 처리에 최적화된 빌드입니다.' :
          '레이드 환경에 최적화된 빌드입니다.',
        heroTalent: build.heroTalent,
        importString: build.importString,
        talents: {
          class: [],
          spec: []
        }
      };

      // 정확한 특성 정보로 매핑
      accurateTalents.classTalents.forEach(talent => {
        const completeInfo = completeTalents.talents[talent.id];
        finalBuilds[key].talents.class.push({
          id: talent.id,
          name: completeInfo?.koreanName || talent.name,
          englishName: completeInfo?.englishName || '',
          icon: completeInfo?.icon || 'inv_misc_questionmark',
          row: talent.gridRow,
          col: talent.gridCol,
          selected: false // 기본값
        });
      });

      accurateTalents.specTalents.forEach(talent => {
        const completeInfo = completeTalents.talents[talent.id];
        finalBuilds[key].talents.spec.push({
          id: talent.id,
          name: completeInfo?.koreanName || talent.name,
          englishName: completeInfo?.englishName || '',
          icon: completeInfo?.icon || 'inv_misc_questionmark',
          row: talent.gridRow,
          col: talent.gridCol,
          selected: false // 기본값
        });
      });
    }

    // 파일 저장
    const outputPath = path.join(__dirname, 'wowhead-real-talent-builds.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalBuilds, null, 2), 'utf-8');

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
scrapeTalentCalculator().catch(console.error);