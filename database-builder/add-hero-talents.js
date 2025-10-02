const fs = require('fs');
const path = require('path');

// 기존 데이터 로드
const existingData = require('../src/data/beastMasteryFullTalentTree.js').beastMasteryFullTalentTree;

// 영웅 특성 데이터 추가
const heroTalents = {
  packLeaderTalents: {
    layout: {
      rows: 5,
      columns: 3,
      totalPoints: 10
    },
    nodes: {
      // 무리의 지도자 특성들
      450958: {
        id: 450958,
        koreanName: "포악한 습격",
        englishName: "Vicious Hunt",
        icon: "ability_hunter_killcommand",
        description: "살상 명령이 추가로 10%의 피해를 입힙니다.",
        position: { row: 1, col: 2 }
      },
      450964: {
        id: 450964,
        koreanName: "무리 조직",
        englishName: "Pack Coordination",
        icon: "ability_hunter_longevity",
        description: "펫의 기본 공격이 20%의 확률로 날카로운 사격의 재충전 시간을 1초 감소시킵니다.",
        position: { row: 2, col: 1 }
      },
      450963: {
        id: 450963,
        koreanName: "굴 회복력",
        englishName: "Den Recovery",
        icon: "ability_hunter_pet_turtle",
        description: "생명력이 50% 미만일 때 받는 피해가 10% 감소합니다.",
        position: { row: 2, col: 2 }
      },
      450962: {
        id: 450962,
        koreanName: "광기의 무리",
        englishName: "Frenzied Pack",
        icon: "spell_shadow_unholyfrenzy",
        description: "광분 중첩이 최대일 때 펫이 10%의 추가 피해를 입힙니다.",
        position: { row: 2, col: 3 }
      },
      451160: {
        id: 451160,
        koreanName: "사냥의 부름",
        englishName: "Howl of the Pack",
        icon: "ability_hunter_callofthewild",
        description: "야생의 부름이 활성화되어 있는 동안 치명타 확률이 10% 증가합니다.",
        position: { row: 3, col: 1 }
      },
      451161: {
        id: 451161,
        koreanName: "무리 우두머리",
        englishName: "Pack Leader",
        icon: "ability_hunter_aspectofthebeast",
        description: "야수의 격노 지속시간이 2초 증가합니다.",
        position: { row: 3, col: 2 }
      },
      450360: {
        id: 450360,
        koreanName: "고라이크의 활력",
        englishName: "Covering Fire",
        icon: "ability_hunter_rapidkilling",
        description: "일제 사격이 2초 동안 펫의 이동 속도를 30% 증가시킵니다.",
        position: { row: 3, col: 3 }
      },
      450361: {
        id: 450361,
        koreanName: "무리의 맹위",
        englishName: "Furious Assault",
        icon: "ability_druid_ferociousbite",
        description: "야수의 격노 중 펫의 공격 속도가 25% 증가합니다.",
        position: { row: 4, col: 1 }
      },
      450362: {
        id: 450362,
        koreanName: "짐승의 축복",
        englishName: "Blessing of the Pack",
        icon: "spell_nature_unyeildingstamina",
        description: "광분 중첩당 최대 생명력이 2% 증가합니다.",
        position: { row: 4, col: 3 }
      },
      450363: {
        id: 450363,
        koreanName: "무리의 분노",
        englishName: "Pack's Wrath",
        icon: "ability_hunter_murderofcrows",
        description: "야생의 부름이 끝날 때 살상 명령의 재사용 대기시간이 초기화됩니다.",
        position: { row: 5, col: 2 }
      },
      450364: {
        id: 450364,
        koreanName: "분산된 무리",
        englishName: "Scattered Pack",
        icon: "ability_hunter_posthaste",
        description: "철수를 사용하면 2초 동안 이동 속도가 30% 증가합니다.",
        position: { row: 5, col: 1 }
      }
    }
  },
  darkRangerTalents: {
    layout: {
      rows: 5,
      columns: 3,
      totalPoints: 10
    },
    nodes: {
      // 어둠 순찰자 특성들
      450381: {
        id: 450381,
        koreanName: "어둠의 사격",
        englishName: "Shadow Shot",
        icon: "ability_theblackarrow",
        description: "날카로운 사격이 암흑 피해를 추가로 입힙니다.",
        position: { row: 1, col: 2 }
      },
      450382: {
        id: 450382,
        koreanName: "검은 화살",
        englishName: "Black Arrow",
        icon: "spell_shadow_painspike",
        description: "30초마다 다음 사격이 20초 동안 대상에게 암흑 피해를 입히는 효과를 부여합니다.",
        position: { row: 2, col: 2 }
      },
      450383: {
        id: 450383,
        koreanName: "연막",
        englishName: "Smoke Screen",
        icon: "ability_rogue_smoke",
        description: "위장을 사용하면 3초 동안 회피율이 20% 증가합니다.",
        position: { row: 3, col: 1 }
      },
      450384: {
        id: 450384,
        koreanName: "쇠약의 화살",
        englishName: "Withering Fire",
        icon: "ability_hunter_resistanceisfutile",
        description: "코브라 사격이 대상의 이동 속도를 2초 동안 15% 감소시킵니다.",
        position: { row: 3, col: 3 }
      }
    }
  }
};

// 기존 데이터 구조 업데이트
const updatedData = {
  ...existingData,
  heroTalents: heroTalents
};

// 파일 저장
const outputPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryCompleteTree.js');
const fileContent = `// WoW 11.0.5 야수 사냥꾼 완전한 특성 트리 (영웅 특성 포함)
// 총 139개 특성

export const beastMasteryCompleteTree = ${JSON.stringify(updatedData, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log('✅ 영웅 특성 추가 완료');
console.log(`- 무리의 지도자: ${Object.keys(heroTalents.packLeaderTalents.nodes).length}개`);
console.log(`- 어둠 순찰자: ${Object.keys(heroTalents.darkRangerTalents.nodes).length}개`);