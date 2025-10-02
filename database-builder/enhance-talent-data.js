const fs = require('fs');
const path = require('path');

// 기존 139개 특성 데이터 로드
const existingData = require('../src/data/beastMasteryFullTalentTree.js').beastMasteryFullTalentTree;

// 한국어 데이터베이스 로드
const koreanDB = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'tww-s3-refined-database.json'),
  'utf-8'
));

// 특성 간 연결 관계 정의 (실제 WoW 특성 트리 기반)
const talentConnections = {
  // 클래스 특성 연결 관계 예시
  classTalents: [
    { from: 34026, to: 193530 }, // 살상 명령 -> 동물의 본능
    { from: 53351, to: 320976 }, // 킬샷 -> 킬샷 랭크2
    { from: 109215, to: 781 }, // 신속 -> 철수
    { from: 781, to: 109304 }, // 철수 -> 위장
  ],

  // 전문화 특성 연결 관계 예시
  specTalents: [
    { from: 217200, to: 378442 }, // 날카로운 사격 -> 날카로운 화살
    { from: 193530, to: 193532 }, // 동물의 본능 -> 야생의 부름
    { from: 193532, to: 359844 }, // 야생의 부름 -> 피의 광란
    { from: 120679, to: 321530 }, // 광포한 야수 -> 피바람
  ]
};

// 아이콘 매핑 테이블
const iconMapping = {
  // 주요 스킬 아이콘
  34026: 'ability_hunter_killcommand', // 살상 명령
  217200: 'ability_hunter_barbedshot', // 날카로운 사격
  193530: 'ability_hunter_aspectofthebeast', // 야생의 상
  120679: 'ability_hunter_direbeast', // 광포한 야수
  2643: 'ability_upgrademoonglaive', // 일제 사격
  193532: 'ability_hunter_callofthewild', // 야생의 부름
  120360: 'ability_hunter_barrage', // 탄막
  19574: 'ability_druid_ferociousbite', // 야수의 격노
  147362: 'spell_shadow_unholyfrenzy', // 역병사격
  5116: 'spell_frost_stun', // 충격포
  109304: 'ability_vanish', // 위장
  781: 'ability_rogue_sprint', // 철수
  109215: 'ability_hunter_posthaste', // 신속
  19801: 'spell_nature_drowsy', // 평정의 사격
  1543: 'ability_hunter_flare', // 조명탄
  187650: 'spell_frost_arcticwinds', // 빙결의 덫
  187707: 'spell_fire_burnout', // 무력화
  231548: 'spell_nature_web', // 끈적이는 타르
  199483: 'ability_hunter_camouflage', // 위장술
  264656: 'ability_hunter_pathfinding', // 길찾기
  378442: 'ability_hunter_barbedshot', // 날카로운 화살
  321530: 'spell_shadow_bloodboil', // 피바람
  359844: 'ability_hunter_bloodshed', // 피의 광란
  53351: 'ability_hunter_assassinate', // 킬 샷
  320976: 'ability_hunter_assassinate2', // 킬 샷 2
  270581: 'ability_hunter_zenarchery', // 자연 치유
  385539: 'spell_nature_rejuvenation', // 회복의 바람
  384799: 'ability_hunter_improvedsteadyshot', // 사냥꾼의 회피
};

// 특성 데이터 강화 함수
function enhanceTalent(talent, type) {
  const enhancedTalent = { ...talent };

  // 아이콘 추가
  if (iconMapping[talent.id]) {
    enhancedTalent.icon = iconMapping[talent.id];
  } else {
    enhancedTalent.icon = enhancedTalent.icon || `spell_${talent.id}`;
  }

  // 한국어 DB에서 상세 정보 추가
  let skillInfo = null;
  if (koreanDB['사냥꾼'] && koreanDB['사냥꾼'][talent.id]) {
    skillInfo = koreanDB['사냥꾼'][talent.id];
  } else {
    // 다른 클래스에서도 검색
    for (const className in koreanDB) {
      if (koreanDB[className][talent.id]) {
        skillInfo = koreanDB[className][talent.id];
        break;
      }
    }
  }

  if (skillInfo) {
    enhancedTalent.koreanName = skillInfo.koreanName || talent.koreanName;
    enhancedTalent.description = skillInfo.description || talent.description || '';
    enhancedTalent.cooldown = skillInfo.cooldown || talent.cooldown || '없음';
    enhancedTalent.castTime = skillInfo.castTime || talent.castTime || '즉시 시전';
    enhancedTalent.range = skillInfo.range || talent.range || '0';
    enhancedTalent.resourceCost = skillInfo.resourceCost || talent.resourceCost || '없음';
    enhancedTalent.resourceGain = skillInfo.resourceGain || talent.resourceGain || '없음';
  }

  // 연결 정보 추가
  enhancedTalent.connections = [];

  if (type === 'class') {
    talentConnections.classTalents.forEach(conn => {
      if (conn.from === talent.id) {
        enhancedTalent.connections.push(conn.to);
      }
    });
  } else if (type === 'spec') {
    talentConnections.specTalents.forEach(conn => {
      if (conn.from === talent.id) {
        enhancedTalent.connections.push(conn.to);
      }
    });
  }

  return enhancedTalent;
}

// 모든 특성 강화
const enhancedData = {
  classTalents: {
    layout: existingData.classTalents.layout,
    nodes: {}
  },
  specTalents: {
    layout: existingData.specTalents.layout,
    nodes: {}
  },
  packLeaderTalents: {
    layout: existingData.packLeaderTalents?.layout || { rows: 5, columns: 3, totalPoints: 10 },
    nodes: {}
  },
  darkRangerTalents: {
    layout: existingData.darkRangerTalents?.layout || { rows: 5, columns: 3, totalPoints: 10 },
    nodes: {}
  },
  connections: []
};

// 클래스 특성 강화
for (const id in existingData.classTalents.nodes) {
  enhancedData.classTalents.nodes[id] = enhanceTalent(existingData.classTalents.nodes[id], 'class');
}

// 전문화 특성 강화
for (const id in existingData.specTalents.nodes) {
  enhancedData.specTalents.nodes[id] = enhanceTalent(existingData.specTalents.nodes[id], 'spec');
}

// 영웅 특성 강화
if (existingData.heroTalents) {
  // 무리의 지도자 특성 강화
  if (existingData.heroTalents.packLeaderTalents) {
    for (const id in existingData.heroTalents.packLeaderTalents.nodes) {
      enhancedData.packLeaderTalents.nodes[id] = enhanceTalent(existingData.heroTalents.packLeaderTalents.nodes[id], 'hero');
    }
  }

  // 어둠 순찰자 특성 강화
  if (existingData.heroTalents.darkRangerTalents) {
    for (const id in existingData.heroTalents.darkRangerTalents.nodes) {
      enhancedData.darkRangerTalents.nodes[id] = enhanceTalent(existingData.heroTalents.darkRangerTalents.nodes[id], 'hero');
    }
  }
}

// heroTalents 구조 추가 (기존 UI와 호환성 유지)
enhancedData.heroTalents = {
  packLeader: enhancedData.packLeaderTalents,
  darkRanger: enhancedData.darkRangerTalents
};

// 전체 연결 정보 컴파일
talentConnections.classTalents.forEach(conn => {
  enhancedData.connections.push({
    from: conn.from,
    to: conn.to,
    tree: 'class'
  });
});

talentConnections.specTalents.forEach(conn => {
  enhancedData.connections.push({
    from: conn.from,
    to: conn.to,
    tree: 'spec'
  });
});

// 통계 출력
console.log('📊 강화된 특성 데이터 통계:');
console.log(`- 클래스 특성: ${Object.keys(enhancedData.classTalents.nodes).length}개`);
console.log(`- 전문화 특성: ${Object.keys(enhancedData.specTalents.nodes).length}개`);
console.log(`- 무리의 지도자: ${Object.keys(enhancedData.packLeaderTalents.nodes).length}개`);
console.log(`- 어둠 순찰자: ${Object.keys(enhancedData.darkRangerTalents.nodes).length}개`);
console.log(`- 총 연결 관계: ${enhancedData.connections.length}개`);

// 파일 저장
const outputPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryEnhancedTalentTree.js');
const fileContent = `// WoW 11.0.5 야수 사냥꾼 강화된 특성 트리
// 연결 관계, 아이콘, 상세 설명 포함
// 총 139개 특성 + 연결 정보

export const beastMasteryEnhancedTalentTree = ${JSON.stringify(enhancedData, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`\n✅ 강화된 특성 데이터 저장 완료: ${outputPath}`);

// 샘플 특성 출력
console.log('\n📋 샘플 특성 (살상 명령):');
console.log(JSON.stringify(enhancedData.classTalents.nodes[34026] || enhancedData.specTalents.nodes[34026], null, 2));