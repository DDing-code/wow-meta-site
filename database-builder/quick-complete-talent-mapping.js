const fs = require('fs').promises;
const path = require('path');

// cell 번호로 row와 column 계산
function calculatePosition(cell, columns = 7) {
  const cellNum = parseInt(cell);
  const row = Math.floor(cellNum / columns) + 1;
  const col = (cellNum % columns) || columns;
  return { row, col };
}

// 빠른 매핑을 위한 함수
async function quickCompleteTalentMapping() {
  console.log('⚡ 빠른 특성 매핑 시작...');

  // 수집된 데이터 로드
  const rawData = await fs.readFile(
    path.join(__dirname, 'wowhead-dynamic-talents.json'),
    'utf-8'
  );
  const collectedData = JSON.parse(rawData);

  // 특성 트리 구조
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

  // 한국어 이름 매핑 (알려진 것들)
  const koreanNames = {
    // 클래스 특성
    "270581": "자연 치유",
    "109215": "성급함",
    "53351": "마무리 사격",
    "385539": "원기 회복의 바람",
    "384799": "사냥꾼의 회피",
    "343248": "죽음의 일격",
    "343242": "야생 약초학",
    "187698": "타르 덫",
    "19801": "평정의 사격",
    "5116": "충격포",
    "264735": "최적자 생존",
    "393344": "올가미",
    "147362": "반격의 사격",
    "34477": "눈속임",
    "459455": "정찰병의 직감",
    "459450": "보강 갑옷",
    "388039": "고독한 생존자",
    "459542": "특수 무기고",
    "343244": "방해탄",
    "199483": "위장",
    "257284": "사냥꾼의 징표",
    "109248": "구속 사격",
    "236776": "폭발 덫",
    "213691": "산탄 사격",
    "19577": "위협",
    "264198": "우두머리 사냥꾼",
    "266921": "타고난 야생",
    "385638": "보초 올빼미",
    "388035": "강화 덫",
    "260309": "명사수",
    "231390": "서바이벌 전술",
    "378905": "야생 생존술",
    "378902": "냉혹함",

    // 야수 전문화 특성
    "34026": "살상 명령",
    "217200": "날카로운 사격",
    "193455": "코브라 사격",
    "19574": "야수의 격노",
    "120679": "광포한 야수",
    "185789": "야생의 부름",
    "2643": "일제 사격",
    "115939": "야수 절단",
    "321530": "유혈",
    "199532": "살인 코브라",
    "378244": "코브라 감각",
    "191384": "야수의 상",
    "359844": "야생의 호출",
    "231548": "날카로운 격노",
    "267116": "동물 동료",
    "378017": "무리 우두머리",
    "194599": "흑까마귀",
    "378442": "야수 군주",
    "378743": "쇄도",
    "375891": "죽음의 무리",
    "378280": "피에 굶주린 무리",
    "185358": "신비한 사격",
    "342049": "키메라 사격",

    // 영웅 특성들
    "445404": "사나운 사냥",
    "445500": "무리 조율",
    "445505": "거친 공격",
    "445711": "무리의 울부짖음",
    "445696": "광란의 찢기",
    "445715": "엄호 사격",
    "431481": "검은 화살",
    "442409": "그림자 사냥개",
    "434859": "암흑 쇄도",
    "431920": "그림자 포용",
    "431623": "어둠 강화",
    "432077": "시들어가는 불꽃"
  };

  console.log(`📊 ${collectedData.nodes.length}개 특성 매핑 중...`);

  let classCount = 0;
  let specCount = 0;
  let heroPackCount = 0;
  let heroDarkCount = 0;

  // 각 노드 처리
  collectedData.nodes.forEach((node, index) => {
    const cellNum = parseInt(node.cell) || index;

    // 특성 데이터 생성
    const talentData = {
      id: parseInt(node.id),
      koreanName: koreanNames[node.id] || node.name || '미확인',
      englishName: node.name || 'Unknown',
      icon: '',
      description: '',
      cooldown: '없음',
      castTime: '즉시 시전',
      range: '0',
      resourceCost: '없음',
      resourceGain: '없음',
      type: '특성',
      spec: '야수',
      level: 10,
      pvp: false,
      maxRank: 1,
      connections: []
    };

    // 트리 분류 및 위치 계산
    if (cellNum < 70) {
      // 클래스 특성 (0-69)
      talentData.position = calculatePosition(cellNum);
      talentTree.classTalents.nodes[node.id] = talentData;
      classCount++;
    } else if (cellNum < 140) {
      // 전문화 특성 (70-139)
      talentData.position = calculatePosition(cellNum - 70);
      talentTree.specTalents.nodes[node.id] = talentData;
      specCount++;
    } else if (cellNum < 155) {
      // 영웅 특성 - 무리의 지도자
      const heroCell = cellNum - 140;
      talentData.position = {
        row: Math.floor(heroCell / 3) + 1,
        col: (heroCell % 3) || 3
      };
      talentTree.heroTalents.packLeader.nodes[node.id] = talentData;
      heroPackCount++;
    } else {
      // 영웅 특성 - 어둠 순찰자
      const heroCell = cellNum - 155;
      talentData.position = {
        row: Math.floor(heroCell / 3) + 1,
        col: (heroCell % 3) || 3
      };
      talentTree.heroTalents.darkRanger.nodes[node.id] = talentData;
      heroDarkCount++;
    }
  });

  console.log('\n📊 매핑 완료:');
  console.log(`  - 클래스 특성: ${classCount}개`);
  console.log(`  - 전문화 특성: ${specCount}개`);
  console.log(`  - 무리의 지도자: ${heroPackCount}개`);
  console.log(`  - 어둠 순찰자: ${heroDarkCount}개`);
  console.log(`  - 총합: ${classCount + specCount + heroPackCount + heroDarkCount}개`);

  // 파일 저장
  const jsContent = `// WoW 11.0.5 야수 사냥꾼 완전한 특성 트리 (139개 모든 특성)
// 빠른 매핑 버전

export const beastMasteryFullTalentTree = ${JSON.stringify(talentTree, null, 2)};

export default beastMasteryFullTalentTree;`;

  const jsPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryFullTalentTree.js');
  await fs.writeFile(jsPath, jsContent, 'utf-8');
  console.log(`\n✅ JS 파일 저장: ${jsPath}`);

  const jsonPath = path.join(__dirname, 'quick-complete-talent-tree.json');
  await fs.writeFile(jsonPath, JSON.stringify(talentTree, null, 2), 'utf-8');
  console.log(`✅ JSON 파일 저장: ${jsonPath}`);
}

// 실행
quickCompleteTalentMapping();