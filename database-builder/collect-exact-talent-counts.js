const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectExactTalentCounts() {
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
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 특성 트리 구조 분석
    const talentData = await page.evaluate(() => {
      const result = {
        classTalents: { nodes: [], count: 0 },
        specTalents: { nodes: [], count: 0 },
        heroTalents: {
          packLeader: { nodes: [], count: 0 },
          darkRanger: { nodes: [], count: 0 }
        },
        totalCount: 0,
        debug: {
          allSpellLinks: [],
          treeSections: []
        }
      };

      // 모든 특성 링크 찾기
      const allSpellLinks = document.querySelectorAll('a[href*="/spell="]');
      console.log(`전체 spell 링크 개수: ${allSpellLinks.length}`);

      // 특성 트리 섹션 찾기
      const talentTrees = document.querySelectorAll('.talent-tree, .wtc-tree, [class*="talent"]');
      console.log(`특성 트리 섹션 개수: ${talentTrees.length}`);

      // 각 특성 링크 분석
      allSpellLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const spellId = href.match(/spell=(\d+)/)?.[1];

        if (spellId) {
          // 부모 요소들 확인하여 어느 트리에 속하는지 판단
          let current = link;
          let treeType = 'unknown';
          let depth = 0;

          while (current && current !== document.body && depth < 20) {
            const className = current.className || '';
            const id = current.id || '';

            // 클래스 특성 판별
            if (className.includes('class-talent') ||
                className.includes('hunter-talents') ||
                id.includes('class')) {
              treeType = 'class';
              break;
            }

            // 전문화 특성 판별
            if (className.includes('spec-talent') ||
                className.includes('beast-mastery') ||
                className.includes('specialization') ||
                id.includes('spec')) {
              treeType = 'spec';
              break;
            }

            // 영웅 특성 판별
            if (className.includes('hero-talent') ||
                className.includes('pack-leader') ||
                className.includes('dark-ranger')) {
              if (className.includes('pack-leader')) {
                treeType = 'packLeader';
              } else if (className.includes('dark-ranger')) {
                treeType = 'darkRanger';
              } else {
                treeType = 'hero';
              }
              break;
            }

            current = current.parentElement;
            depth++;
          }

          // 특성 정보 수집
          const talentInfo = {
            id: spellId,
            name: link.textContent.trim(),
            href: href,
            treeType: treeType,
            index: index
          };

          // 트리 타입별로 분류
          switch(treeType) {
            case 'class':
              result.classTalents.nodes.push(talentInfo);
              break;
            case 'spec':
              result.specTalents.nodes.push(talentInfo);
              break;
            case 'packLeader':
              result.heroTalents.packLeader.nodes.push(talentInfo);
              break;
            case 'darkRanger':
              result.heroTalents.darkRanger.nodes.push(talentInfo);
              break;
            default:
              // unknown으로 디버깅용 저장
              result.debug.allSpellLinks.push(talentInfo);
          }
        }
      });

      // 개수 계산
      result.classTalents.count = result.classTalents.nodes.length;
      result.specTalents.count = result.specTalents.nodes.length;
      result.heroTalents.packLeader.count = result.heroTalents.packLeader.nodes.length;
      result.heroTalents.darkRanger.count = result.heroTalents.darkRanger.nodes.length;
      result.totalCount = result.classTalents.count + result.specTalents.count +
                         result.heroTalents.packLeader.count + result.heroTalents.darkRanger.count;

      // 트리 섹션 정보 수집
      talentTrees.forEach(tree => {
        result.debug.treeSections.push({
          className: tree.className,
          id: tree.id,
          childrenCount: tree.children.length
        });
      });

      return result;
    });

    // 결과 저장
    const outputPath = path.join(__dirname, 'exact-talent-counts.json');
    fs.writeFileSync(outputPath, JSON.stringify(talentData, null, 2), 'utf-8');

    console.log('\n📊 Wowhead 특성 개수 분석 결과:');
    console.log('================================');
    console.log(`✅ 직업 특성: ${talentData.classTalents.count}개`);
    console.log(`✅ 전문화 특성: ${talentData.specTalents.count}개`);
    console.log(`✅ 무리의 지도자: ${talentData.heroTalents.packLeader.count}개`);
    console.log(`✅ 어둠 순찰자: ${talentData.heroTalents.darkRanger.count}개`);
    console.log('--------------------------------');
    console.log(`📌 전체 특성 개수: ${talentData.totalCount}개`);
    console.log('================================');

    if (talentData.debug.allSpellLinks.length > 0) {
      console.log(`\n⚠️ 분류되지 않은 특성: ${talentData.debug.allSpellLinks.length}개`);
      console.log('(exact-talent-counts.json의 debug.allSpellLinks 참조)');
    }

    console.log(`\n💾 결과 저장 완료: ${outputPath}`);

  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await browser.close();
  }
}

collectExactTalentCounts();