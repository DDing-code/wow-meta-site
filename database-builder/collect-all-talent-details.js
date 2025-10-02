const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// DB 생성 규칙에 따른 기본 템플릿
function createSkillTemplate(id, koreanName, englishName, icon) {
  return {
    id: parseInt(id),
    koreanName: koreanName || '미확인',
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

async function collectAllTalentDetails() {
  // 이전에 수집한 데이터 로드
  const rawData = await fs.readFile(
    path.join(__dirname, 'wowhead-dynamic-talents.json'),
    'utf-8'
  );
  const collectedData = JSON.parse(rawData);

  console.log(`📊 총 ${collectedData.nodes.length}개의 특성 상세 정보 수집 시작...`);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const talentDatabase = {
    hunter: {
      야수: {}
    }
  };

  // 야수 사냥꾼 특성 트리 구조
  const talentStructure = {
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

  // 특성 위치 매핑 (실제 게임 기준)
  const talentPositions = {
    // 클래스 특성 (1-4열)
    "53351": { tree: "class", row: 1, col: 4, name: "마무리 사격" },
    "257284": { tree: "class", row: 1, col: 2, name: "사냥꾼의 징표" },
    "185358": { tree: "class", row: 1, col: 6, name: "신비한 사격" },
    "343248": { tree: "class", row: 2, col: 4, name: "강화된 마무리 사격" },
    "342049": { tree: "class", row: 2, col: 6, name: "키메라 사격" },
    "109215": { tree: "class", row: 3, col: 1, name: "성급함" },
    "270581": { tree: "class", row: 3, col: 2, name: "자연 치유" },
    "5116": { tree: "class", row: 3, col: 3, name: "충격포" },
    "260309": { tree: "class", row: 3, col: 4, name: "명사수" },
    "187698": { tree: "class", row: 3, col: 5, name: "타르 덫" },
    "19801": { tree: "class", row: 3, col: 6, name: "평정의 사격" },
    "147362": { tree: "class", row: 3, col: 7, name: "반격의 사격" },
    "213691": { tree: "class", row: 4, col: 3, name: "산탄 사격" },
    "109248": { tree: "class", row: 4, col: 4, name: "구속 사격" },
    "236776": { tree: "class", row: 4, col: 5, name: "폭발 덫" },
    "34477": { tree: "class", row: 4, col: 6, name: "눈속임" },

    // 5-10열 클래스 특성
    "266921": { tree: "class", row: 5, col: 3, name: "타고난 야생" },
    "199483": { tree: "class", row: 5, col: 5, name: "위장" },
    "231390": { tree: "class", row: 5, col: 7, name: "서바이벌 전술" },
    "378905": { tree: "class", row: 6, col: 2, name: "야생 생존술" },
    "264198": { tree: "class", row: 6, col: 4, name: "우두머리 사냥꾼" },
    "378902": { tree: "class", row: 6, col: 6, name: "냉혹함" },

    // 야수 전문화 특성
    "34026": { tree: "spec", row: 1, col: 2, name: "살상 명령" },
    "217200": { tree: "spec", row: 1, col: 4, name: "날카로운 사격" },
    "120679": { tree: "spec", row: 1, col: 6, name: "광포한 야수" },

    "267116": { tree: "spec", row: 2, col: 2, name: "동물 동료" },
    "185789": { tree: "spec", row: 2, col: 4, name: "야생의 부름" },
    "231548": { tree: "spec", row: 2, col: 5, name: "날카로운 격노" },
    "191384": { tree: "spec", row: 2, col: 7, name: "야수의 상" },

    "378017": { tree: "spec", row: 3, col: 1, name: "무리 우두머리" },
    "193455": { tree: "spec", row: 3, col: 4, name: "코브라 사격" },
    "19574": { tree: "spec", row: 3, col: 6, name: "야수의 격노" },
    "359844": { tree: "spec", row: 3, col: 7, name: "야생의 부름" },

    "378244": { tree: "spec", row: 4, col: 3, name: "코브라 감각" },
    "199532": { tree: "spec", row: 4, col: 5, name: "살인 코브라" },

    "115939": { tree: "spec", row: 5, col: 1, name: "야수 절단" },
    "2643": { tree: "spec", row: 5, col: 2, name: "일제 사격" },
    "321530": { tree: "spec", row: 5, col: 6, name: "유혈" },

    // 영웅 특성 - 무리의 지도자
    "445404": { tree: "hero_pack", row: 1, col: 2, name: "사나운 사냥" },
    "445500": { tree: "hero_pack", row: 2, col: 1, name: "무리 조율" },
    "445505": { tree: "hero_pack", row: 2, col: 3, name: "거친 공격" },
    "445711": { tree: "hero_pack", row: 3, col: 2, name: "무리의 울부짖음" },

    // 영웅 특성 - 어둠 순찰자
    "431481": { tree: "hero_dark", row: 1, col: 2, name: "검은 화살" },
    "442409": { tree: "hero_dark", row: 2, col: 1, name: "그림자 사냥개" },
    "434859": { tree: "hero_dark", row: 2, col: 3, name: "암흑 쇄도" }
  };

  const page = await browser.newPage();
  let processedCount = 0;

  // 각 특성에 대해 상세 정보 수집
  for (const node of collectedData.nodes) {
    const position = talentPositions[node.id];
    if (!position) continue;

    try {
      console.log(`[${++processedCount}/${collectedData.nodes.length}] 특성 ${node.id} (${position.name}) 처리 중...`);

      // 한국어 Wowhead 페이지 방문
      const koUrl = `https://ko.wowhead.com/spell=${node.id}`;
      await page.goto(koUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 한국어 정보 추출
      const koData = await page.evaluate(() => {
        const name = document.querySelector('h1.heading-size-1')?.textContent?.trim() ||
                    document.querySelector('.q0')?.textContent?.trim() ||
                    document.querySelector('[data-wowhead]')?.textContent?.trim();

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

        return { name, description, icon };
      });

      // 영어 페이지도 확인 (필요시)
      const enUrl = `https://www.wowhead.com/spell=${node.id}`;
      await page.goto(enUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 500));

      const enData = await page.evaluate(() => {
        return document.querySelector('h1.heading-size-1')?.textContent?.trim() || '';
      });

      // 특성 데이터 생성
      const talentData = createSkillTemplate(
        node.id,
        koData.name || position.name,
        enData || node.name,
        koData.icon || ''
      );

      talentData.description = koData.description || '';

      // 트리별로 분류
      if (position.tree === 'class') {
        talentStructure.classTalents.nodes[node.id] = {
          ...talentData,
          position: { row: position.row, col: position.col },
          maxRank: 1,
          connections: []
        };
      } else if (position.tree === 'spec') {
        talentStructure.specTalents.nodes[node.id] = {
          ...talentData,
          position: { row: position.row, col: position.col },
          maxRank: 1,
          connections: []
        };
      } else if (position.tree === 'hero_pack') {
        talentStructure.heroTalents.packLeader.nodes[node.id] = {
          ...talentData,
          position: { row: position.row, col: position.col },
          maxRank: 1
        };
      } else if (position.tree === 'hero_dark') {
        talentStructure.heroTalents.darkRanger.nodes[node.id] = {
          ...talentData,
          position: { row: position.row, col: position.col },
          maxRank: 1
        };
      }

      // 데이터베이스에 추가
      talentDatabase.hunter.야수[node.id] = talentData;

    } catch (error) {
      console.log(`  ⚠️ ${node.id} 처리 실패:`, error.message);
    }
  }

  await browser.close();

  // 결과 저장
  const dbPath = path.join(__dirname, 'beastmastery-talent-database.json');
  await fs.writeFile(dbPath, JSON.stringify(talentDatabase, null, 2), 'utf-8');
  console.log(`\n✅ 데이터베이스 저장: ${dbPath}`);

  const structurePath = path.join(__dirname, 'beastmastery-talent-structure.json');
  await fs.writeFile(structurePath, JSON.stringify(talentStructure, null, 2), 'utf-8');
  console.log(`✅ 특성 구조 저장: ${structurePath}`);

  // JS 파일로 내보내기
  const jsContent = `// WoW 11.0.5 야수 사냥꾼 완전한 특성 데이터
// Wowhead에서 수집한 실제 데이터 (DB 생성 규칙 준수)

export const beastMasteryTalentComplete = ${JSON.stringify(talentStructure, null, 2)};

export const beastMasteryTalentDB = ${JSON.stringify(talentDatabase, null, 2)};

export default beastMasteryTalentComplete;`;

  const jsPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryTalentComplete.js');
  await fs.writeFile(jsPath, jsContent, 'utf-8');
  console.log(`✅ JS 파일 저장: ${jsPath}`);

  // 통계 출력
  const classCount = Object.keys(talentStructure.classTalents.nodes).length;
  const specCount = Object.keys(talentStructure.specTalents.nodes).length;
  const heroPackCount = Object.keys(talentStructure.heroTalents.packLeader.nodes).length;
  const heroDarkCount = Object.keys(talentStructure.heroTalents.darkRanger.nodes).length;

  console.log('\n📊 최종 통계:');
  console.log(`  - 클래스 특성: ${classCount}개`);
  console.log(`  - 전문화 특성: ${specCount}개`);
  console.log(`  - 무리의 지도자: ${heroPackCount}개`);
  console.log(`  - 어둠 순찰자: ${heroDarkCount}개`);
  console.log(`  - 총합: ${classCount + specCount + heroPackCount + heroDarkCount}개`);
}

// 실행
collectAllTalentDetails().catch(console.error);