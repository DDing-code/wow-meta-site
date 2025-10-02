const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// cell 번호로 row와 column 계산 (7열 기준)
function calculatePosition(cell) {
  const cellNum = parseInt(cell);
  const row = Math.floor(cellNum / 7) + 1;
  const col = (cellNum % 7) || 7;
  return { row, col };
}

// DB 생성 규칙에 따른 템플릿
function createTalentTemplate(id, name, englishName = '', icon = '') {
  return {
    id: parseInt(id),
    koreanName: name || '미확인',
    englishName: englishName || 'Unknown',
    icon: icon || '',
    description: '',
    cooldown: '없음',
    castTime: '즉시 시전',
    range: '0',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '특성',
    spec: '야수',
    level: 10,
    pvp: false
  };
}

async function buildCompleteTalentTree() {
  console.log('🔨 완전한 특성 트리 구축 시작...');

  // 수집된 데이터 로드
  const rawData = await fs.readFile(
    path.join(__dirname, 'wowhead-dynamic-talents.json'),
    'utf-8'
  );
  const collectedData = JSON.parse(rawData);

  console.log(`📊 총 ${collectedData.nodes.length}개 특성 처리 중...`);

  // 특성 트리 구조 초기화
  const talentTree = {
    classTalents: {
      layout: { rows: 10, columns: 7, totalPoints: 31 },
      nodes: {}
    },
    specTalents: {
      layout: { rows: 10, columns: 7, totalPoints: 30 },
      nodes: {}
    },
    heroTalents: {
      packLeader: {
        name: "무리의 지도자",
        layout: { rows: 5, columns: 3, totalPoints: 10 },
        nodes: {}
      },
      darkRanger: {
        name: "어둠 순찰자",
        layout: { rows: 5, columns: 3, totalPoints: 10 },
        nodes: {}
      }
    }
  };

  // 데이터베이스
  const talentDB = {};

  // 브라우저 시작
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  let processedCount = 0;

  // 각 특성 분류를 위한 기준
  // cell 0-69: 클래스 특성 (10행 x 7열)
  // cell 70-139: 전문화 특성 (10행 x 7열)
  // cell 140+: 영웅 특성

  for (const node of collectedData.nodes) {
    processedCount++;
    const cellNum = parseInt(node.cell) || 0;

    try {
      console.log(`[${processedCount}/${collectedData.nodes.length}] 특성 ${node.id} - ${node.name}`);

      // 한국어 정보 수집
      const koUrl = `https://ko.wowhead.com/spell=${node.id}`;
      await page.goto(koUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const talentInfo = await page.evaluate(() => {
        const name = document.querySelector('h1.heading-size-1')?.textContent?.trim() ||
                    document.querySelector('.q0')?.textContent?.trim() ||
                    '';

        const description = document.querySelector('.q')?.textContent?.trim() ||
                          document.querySelector('.spell-tooltip-description')?.textContent?.trim() ||
                          '';

        // 아이콘 추출
        const iconElement = document.querySelector('.iconlarge ins') ||
                          document.querySelector('.icon ins');
        let icon = '';
        if (iconElement) {
          const style = iconElement.getAttribute('style');
          const match = style?.match(/([^\/]+)\.jpg/);
          if (match) {
            icon = match[1];
          }
        }

        // 재사용 대기시간, 시전 시간 등 추출
        let cooldown = '없음';
        let castTime = '즉시 시전';
        let range = '0';

        const tooltipElements = document.querySelectorAll('.spell-tooltip td');
        tooltipElements.forEach(td => {
          const text = td.textContent;
          if (text.includes('초 재사용 대기시간')) {
            cooldown = text;
          }
          if (text.includes('시전 시간')) {
            castTime = text;
          }
          if (text.includes('사거리')) {
            range = text;
          }
        });

        return { name, description, icon, cooldown, castTime, range };
      });

      // 특성 데이터 생성
      const talent = createTalentTemplate(
        node.id,
        talentInfo.name || node.name,
        node.name,
        talentInfo.icon
      );

      talent.description = talentInfo.description;
      talent.cooldown = talentInfo.cooldown;
      talent.castTime = talentInfo.castTime;
      talent.range = talentInfo.range;

      // 위치 계산
      let position;
      let treeType;

      if (cellNum < 70) {
        // 클래스 특성 (0-69)
        position = calculatePosition(node.cell);
        treeType = 'class';
      } else if (cellNum < 140) {
        // 전문화 특성 (70-139)
        position = calculatePosition(cellNum - 70);
        treeType = 'spec';
      } else if (cellNum < 155) {
        // 영웅 특성 - 무리의 지도자 (140-154)
        const heroCell = cellNum - 140;
        position = {
          row: Math.floor(heroCell / 3) + 1,
          col: (heroCell % 3) || 3
        };
        treeType = 'hero_pack';
      } else {
        // 영웅 특성 - 어둠 순찰자 (155+)
        const heroCell = cellNum - 155;
        position = {
          row: Math.floor(heroCell / 3) + 1,
          col: (heroCell % 3) || 3
        };
        treeType = 'hero_dark';
      }

      // 트리에 추가
      const talentNode = {
        ...talent,
        position,
        maxRank: 1,
        connections: []
      };

      if (treeType === 'class') {
        talentTree.classTalents.nodes[node.id] = talentNode;
      } else if (treeType === 'spec') {
        talentTree.specTalents.nodes[node.id] = talentNode;
      } else if (treeType === 'hero_pack') {
        talentTree.heroTalents.packLeader.nodes[node.id] = talentNode;
      } else if (treeType === 'hero_dark') {
        talentTree.heroTalents.darkRanger.nodes[node.id] = talentNode;
      }

      // DB에 추가
      talentDB[node.id] = talent;

      // 진행 상황 표시
      if (processedCount % 10 === 0) {
        console.log(`  ✓ ${processedCount}개 완료...`);
      }

    } catch (error) {
      console.log(`  ⚠️ ${node.id} 처리 실패: ${error.message}`);

      // 실패한 경우 기본값으로 추가
      const position = calculatePosition(node.cell || '0');
      const talent = createTalentTemplate(node.id, node.name, node.name);

      if (cellNum < 70) {
        talentTree.classTalents.nodes[node.id] = {
          ...talent,
          position,
          maxRank: 1,
          connections: []
        };
      } else if (cellNum < 140) {
        talentTree.specTalents.nodes[node.id] = {
          ...talent,
          position: calculatePosition(cellNum - 70),
          maxRank: 1,
          connections: []
        };
      }

      talentDB[node.id] = talent;
    }
  }

  await browser.close();

  // 통계
  const classCount = Object.keys(talentTree.classTalents.nodes).length;
  const specCount = Object.keys(talentTree.specTalents.nodes).length;
  const heroPackCount = Object.keys(talentTree.heroTalents.packLeader.nodes).length;
  const heroDarkCount = Object.keys(talentTree.heroTalents.darkRanger.nodes).length;

  console.log('\n📊 최종 통계:');
  console.log(`  - 클래스 특성: ${classCount}개`);
  console.log(`  - 전문화 특성: ${specCount}개`);
  console.log(`  - 무리의 지도자: ${heroPackCount}개`);
  console.log(`  - 어둠 순찰자: ${heroDarkCount}개`);
  console.log(`  - 총합: ${classCount + specCount + heroPackCount + heroDarkCount}개`);

  // 파일 저장
  const treePath = path.join(__dirname, 'complete-talent-tree.json');
  await fs.writeFile(treePath, JSON.stringify(talentTree, null, 2), 'utf-8');
  console.log(`\n✅ 트리 구조 저장: ${treePath}`);

  const dbPath = path.join(__dirname, 'complete-talent-database.json');
  await fs.writeFile(dbPath, JSON.stringify(talentDB, null, 2), 'utf-8');
  console.log(`✅ 데이터베이스 저장: ${dbPath}`);

  // JavaScript 파일로 내보내기
  const jsContent = `// WoW 11.0.5 야수 사냥꾼 완전한 특성 데이터 (139개 모든 특성 포함)
// Wowhead에서 자동 수집한 실제 데이터

export const beastMasteryCompleteTalentTree = ${JSON.stringify(talentTree, null, 2)};

export const beastMasteryCompleteDB = ${JSON.stringify(talentDB, null, 2)};

export default beastMasteryCompleteTalentTree;`;

  const jsPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryCompleteTalentTree.js');
  await fs.writeFile(jsPath, jsContent, 'utf-8');
  console.log(`✅ JS 파일 저장: ${jsPath}`);

  console.log('\n🎉 완전한 특성 트리 구축 완료!');
}

// 실행
buildCompleteTalentTree().catch(console.error);