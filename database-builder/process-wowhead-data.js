const fs = require('fs').promises;
const path = require('path');

async function processWowheadData() {
  try {
    // 수집한 데이터 읽기
    const rawData = await fs.readFile(
      path.join(__dirname, 'wowhead-dynamic-talents.json'),
      'utf-8'
    );
    const data = JSON.parse(rawData);

    console.log(`📊 총 ${data.nodes.length}개 특성 처리 중...`);

    // 특성을 트리별로 분류
    const processedData = {
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

    // 특성 데이터 매핑 (실제 게임 데이터 기반)
    const talentMappings = {
      // 클래스 특성 (사냥꾼 공통)
      "53351": { name: "마무리 사격", tree: "class", row: 1, col: 4 },
      "257284": { name: "사냥꾼의 징표", tree: "class", row: 1, col: 1 },
      "185358": { name: "신비한 사격", tree: "class", row: 1, col: 7 },
      "343248": { name: "강화된 마무리 사격", tree: "class", row: 2, col: 5 },
      "342049": { name: "키메라 사격", tree: "class", row: 2, col: 7 },
      "270581": { name: "자연 치유", tree: "class", row: 4, col: 1 },
      "109215": { name: "성급함", tree: "class", row: 5, col: 1 },
      "187698": { name: "타르 덫", tree: "class", row: 3, col: 6 },
      "19801": { name: "평정의 사격", tree: "class", row: 3, col: 6 },
      "109248": { name: "구속 사격", tree: "class", row: 4, col: 4 },
      "236776": { name: "폭발 덫", tree: "class", row: 4, col: 6 },
      "5116": { name: "충격포", tree: "class", row: 3, col: 2 },
      "213691": { name: "산탄 사격", tree: "class", row: 4, col: 2 },
      "266921": { name: "타고난 야생", tree: "class", row: 5, col: 3 },
      "199483": { name: "위장", tree: "class", row: 5, col: 5 },

      // 야수 전문화 특성
      "34026": { name: "살상 명령", tree: "spec", row: 1, col: 1 },
      "217200": { name: "날카로운 사격", tree: "spec", row: 1, col: 4 },
      "267116": { name: "동물 동료", tree: "spec", row: 2, col: 1 },
      "378017": { name: "무리 우두머리", tree: "spec", row: 2, col: 2 },
      "185789": { name: "야생의 부름", tree: "spec", row: 2, col: 4 },
      "231548": { name: "날카로운 격노", tree: "spec", row: 2, col: 5 },
      "191384": { name: "야수의 상", tree: "spec", row: 2, col: 7 },
      "193455": { name: "코브라 사격", tree: "spec", row: 3, col: 4 },
      "19574": { name: "야수의 격노", tree: "spec", row: 3, col: 1 },
      "359844": { name: "야생의 부름", tree: "spec", row: 3, col: 7 },
      "199532": { name: "살인 코브라", tree: "spec", row: 4, col: 5 },
      "378244": { name: "코브라 감각", tree: "spec", row: 4, col: 3 },
      "115939": { name: "야수 절단", tree: "spec", row: 4, col: 1 },
      "2643": { name: "일제 사격", tree: "spec", row: 5, col: 1 },
      "120679": { name: "광포한 야수", tree: "spec", row: 5, col: 4 },
      "321530": { name: "유혈", tree: "spec", row: 5, col: 6 },
      "194599": { name: "흑까마귀", tree: "spec", row: 6, col: 2 },
      "378442": { name: "야수 군주", tree: "spec", row: 6, col: 4 },
      "378743": { name: "쇄도", tree: "spec", row: 6, col: 6 },
      "375891": { name: "죽음의 무리", tree: "spec", row: 7, col: 3 },
      "378280": { name: "피에 굶주린 무리", tree: "spec", row: 7, col: 5 }
    };

    // 수집된 노드 처리
    data.nodes.forEach(node => {
      const mapping = talentMappings[node.id];
      if (mapping) {
        const talentNode = {
          id: parseInt(node.id),
          name: mapping.name,
          englishName: node.name,
          position: { row: mapping.row, col: mapping.col },
          maxRank: 1,
          type: "active",
          connections: []
        };

        if (mapping.tree === "class") {
          processedData.classTalents.nodes[node.id] = talentNode;
        } else if (mapping.tree === "spec") {
          processedData.specTalents.nodes[node.id] = talentNode;
        }
      }
    });

    // 통계 출력
    const classCount = Object.keys(processedData.classTalents.nodes).length;
    const specCount = Object.keys(processedData.specTalents.nodes).length;

    console.log('\n✅ 처리 완료:');
    console.log(`  - 클래스 특성: ${classCount}개`);
    console.log(`  - 전문화 특성: ${specCount}개`);
    console.log(`  - 미매핑 특성: ${data.nodes.length - classCount - specCount}개`);

    // 결과 저장
    const outputPath = path.join(__dirname, 'beastmastery-talents-final.json');
    await fs.writeFile(outputPath, JSON.stringify(processedData, null, 2), 'utf-8');
    console.log(`\n📁 최종 데이터 저장: ${outputPath}`);

    // JavaScript 파일로도 저장
    const jsContent = `// WoW 11.0.5 야수 사냥꾼 특성 데이터
// Wowhead에서 수집한 실제 데이터

export const beastMasteryTalentsFinal = ${JSON.stringify(processedData, null, 2)};

export default beastMasteryTalentsFinal;`;

    const jsPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryTalentsFinal.js');
    await fs.writeFile(jsPath, jsContent, 'utf-8');
    console.log(`📁 JS 파일 저장: ${jsPath}`);

  } catch (error) {
    console.error('❌ 오류:', error);
  }
}

// 실행
processWowheadData();