const fs = require('fs');
const path = require('path');

// 수집된 Wowhead 데이터 로드
const visibleTalents = require('./visible-talents.json');

// 한국어 번역 매핑
const koreanTranslations = {
  // 직업 특성
  "Natural Mending": "자연 치유",
  "Posthaste": "신속",
  "Kill Shot": "마무리 사격",
  "Rejuvenating Wind": "활력의 바람",
  "Hunter's Avoidance": "사냥꾼의 회피",
  "Deathblow": "죽음의 일격",
  "Wilderness Medicine": "야생 의술",
  "Tar Trap": "타르 덫",
  "Tranquilizing Shot": "평정의 사격",
  "Concussive Shot": "충격포",
  "Binding Shot": "구속의 사격",
  "Binding Shackles": "구속의 족쇄",
  "Disengage": "철수",
  "Eagle Eye": "매의 눈",
  "Camouflage": "위장",
  "Pathfinding": "길찾기",
  "Beast Lore": "야수 지식",
  "Freezing Trap": "빙결의 덫",
  "Intimidation": "위협",
  "Exhilaration": "활기",
  "Dire Beast": "광포한 야수",
  "Sticky Tar": "끈적이는 타르",
  "Muzzle": "재갈",
  "Survival of the Fittest": "적자생존",
  "Lone Survivor": "고독한 생존자",
  "Survival Tactics": "생존 전술",
  "Multi-Shot": "일제 사격",
  "A Murder of Crows": "까마귀 살인마",
  "Counter Shot": "반격의 사격",
  "Flare": "조명탄",
  "Trailblazer": "개척자",
  "Sentinel Owl": "파수 올빼미",
  "Sentinel's Perception": "파수꾼의 감지",
  "Sentinel's Protection": "파수꾼의 보호",
  "Misdirection": "눈속임",
  "Entrapment": "올가미",
  "Scare Beast": "야수 겁주기",
  "Binding Shackles": "구속의 족쇄",
  "Scout's Instincts": "정찰병의 본능",
  "Padded Armor": "덧댄 방어구",
  "Disruptive Rounds": "방해 탄환",
  "No Hard Feelings": "감정 없음",
  "Territorial Instincts": "영역 본능",
  "Trigger Finger": "방아쇠 손가락",

  // 전문화 특성
  "Kill Command": "살상 명령",
  "Cobra Shot": "코브라 사격",
  "Barbed Shot": "날카로운 사격",
  "Pack Tactics": "무리 전술",
  "Aspect of the Beast": "야수의 상",
  "War Orders": "전쟁 명령",
  "Thrill of the Hunt": "사냥의 전율",
  "Go for the Throat": "목조르기",
  "Multi-Shot": "일제 사격",
  "Laceration": "찢어발기기",
  "Alpha Predator": "우두머리 포식자",
  "Beast Cleave": "야수 가르기",
  "Training Expert": "훈련 전문가",
  "Hunter's Prey": "사냥꾼의 먹잇감",
  "Stomp": "발구르기",
  "Master Handler": "숙련된 조련사",
  "Kill Cleave": "살상 가르기",
  "Wild Call": "야생의 부름",
  "Dire Beast": "광포한 야수",
  "Savagery": "야만성",
  "Bloodshed": "피바람",
  "Barbed Scales": "가시 비늘",
  "Bestial Wrath": "야수의 격노",
  "Poisoned Barbs": "독 가시",
  "Dire Command": "광포한 명령",
  "Dire Cleave": "광포한 가르기",
  "Killer Instinct": "살인 본능",
  "Serpentine Rhythm": "뱀의 리듬",
  "Barbed Wrath": "가시 격노",
  "Call of the Wild": "야생의 부름",
  "Killer Cobra": "살인 코브라",
  "Scent of Blood": "피의 냄새",
  "Brutal Companion": "잔혹한 동료",
  "Stampede": "쇄도",
  "Venomous Bite": "맹독 물기",
  "Huntmaster's Call": "사냥단장의 부름",
  "Explosive Venom": "폭발 맹독"
};

// 아이콘 매핑
const iconMapping = {
  // 직업 특성
  270581: 'spell_nature_rejuvenation',
  109215: 'ability_hunter_posthaste',
  53351: 'ability_hunter_assassinate',
  385539: 'spell_nature_rejuvenation',
  384799: 'ability_hunter_improvedsteadyshot',

  // 전문화 특성
  34026: 'ability_hunter_killcommand',
  193455: 'ability_hunter_cobrashot',
  217200: 'ability_hunter_barbedshot',
  321014: 'ability_hunter_packleader',
  191384: 'ability_hunter_aspectofthebeast',
  193532: 'ability_hunter_callofthewild',
  19574: 'ability_druid_ferociousbite',
  120679: 'ability_hunter_direbeast',
  201304: 'ability_hunter_stampede'
};

// 완전한 특성 트리 구성
const completeTalentTree = {
  classTalents: {
    layout: { rows: 15, columns: 3, totalPoints: 31 },
    nodes: {}
  },
  specTalents: {
    layout: { rows: 13, columns: 3, totalPoints: 30 },
    nodes: {}
  },
  heroTalents: {
    packLeader: {
      layout: { rows: 5, columns: 3, totalPoints: 10 },
      nodes: {}
    },
    darkRanger: {
      layout: { rows: 5, columns: 3, totalPoints: 10 },
      nodes: {}
    }
  },
  connections: []
};

// 직업 특성 처리
visibleTalents.classTalents.forEach((talent, index) => {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;

  completeTalentTree.classTalents.nodes[talent.id] = {
    id: parseInt(talent.id),
    koreanName: koreanTranslations[talent.name] || talent.name,
    englishName: talent.name,
    icon: iconMapping[talent.id] || `inv_misc_questionmark`,
    description: `${koreanTranslations[talent.name] || talent.name} - 직업 특성`,
    position: { row, col },
    maxRanks: 1,
    currentRank: 0
  };
});

// 전문화 특성 처리
visibleTalents.specTalents.forEach((talent, index) => {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;

  completeTalentTree.specTalents.nodes[talent.id] = {
    id: parseInt(talent.id),
    koreanName: koreanTranslations[talent.name] || talent.name,
    englishName: talent.name,
    icon: iconMapping[talent.id] || `inv_misc_questionmark`,
    description: `${koreanTranslations[talent.name] || talent.name} - 전문화 특성`,
    position: { row, col },
    maxRanks: 1,
    currentRank: 0
  };
});

// 영웅 특성 추가 (무리의 지도자)
const packLeaderTalents = [
  { id: 450958, koreanName: "포악한 습격", englishName: "Vicious Hunt", row: 1, col: 2 },
  { id: 450964, koreanName: "무리 조직", englishName: "Pack Coordination", row: 2, col: 1 },
  { id: 450963, koreanName: "굴 회복력", englishName: "Den Recovery", row: 2, col: 2 },
  { id: 450962, koreanName: "광기의 무리", englishName: "Frenzied Pack", row: 2, col: 3 },
  { id: 451160, koreanName: "사냥의 부름", englishName: "Howl of the Pack", row: 3, col: 1 },
  { id: 451161, koreanName: "무리 우두머리", englishName: "Pack Leader", row: 3, col: 2 },
  { id: 450360, koreanName: "엄호 사격", englishName: "Covering Fire", row: 3, col: 3 },
  { id: 450361, koreanName: "무리의 맹위", englishName: "Furious Assault", row: 4, col: 1 },
  { id: 450362, koreanName: "짐승의 축복", englishName: "Blessing of the Pack", row: 4, col: 3 },
  { id: 450363, koreanName: "무리의 분노", englishName: "Pack's Wrath", row: 5, col: 2 }
];

packLeaderTalents.forEach(talent => {
  completeTalentTree.heroTalents.packLeader.nodes[talent.id] = {
    id: talent.id,
    koreanName: talent.koreanName,
    englishName: talent.englishName,
    icon: 'ability_hunter_packleader',
    description: `${talent.koreanName} - 무리의 지도자 영웅 특성`,
    position: { row: talent.row, col: talent.col }
  };
});

// 영웅 특성 추가 (어둠 순찰자)
const darkRangerTalents = [
  { id: 450381, koreanName: "어둠의 사격", englishName: "Shadow Shot", row: 1, col: 2 },
  { id: 450382, koreanName: "검은 화살", englishName: "Black Arrow", row: 2, col: 2 },
  { id: 450383, koreanName: "연막", englishName: "Smoke Screen", row: 3, col: 1 },
  { id: 450384, koreanName: "쇠약의 화살", englishName: "Withering Fire", row: 3, col: 3 },
  { id: 450385, koreanName: "어둠의 사냥꾼", englishName: "Shadow Hunter", row: 4, col: 2 }
];

darkRangerTalents.forEach(talent => {
  completeTalentTree.heroTalents.darkRanger.nodes[talent.id] = {
    id: talent.id,
    koreanName: talent.koreanName,
    englishName: talent.englishName,
    icon: 'ability_theblackarrow',
    description: `${talent.koreanName} - 어둠 순찰자 영웅 특성`,
    position: { row: talent.row, col: talent.col }
  };
});

// 통계 출력
console.log('📊 완성된 특성 트리:');
console.log(`✅ 직업 특성: ${Object.keys(completeTalentTree.classTalents.nodes).length}개`);
console.log(`✅ 전문화 특성: ${Object.keys(completeTalentTree.specTalents.nodes).length}개`);
console.log(`✅ 무리의 지도자: ${Object.keys(completeTalentTree.heroTalents.packLeader.nodes).length}개`);
console.log(`✅ 어둠 순찰자: ${Object.keys(completeTalentTree.heroTalents.darkRanger.nodes).length}개`);

const total = Object.keys(completeTalentTree.classTalents.nodes).length +
              Object.keys(completeTalentTree.specTalents.nodes).length +
              Object.keys(completeTalentTree.heroTalents.packLeader.nodes).length +
              Object.keys(completeTalentTree.heroTalents.darkRanger.nodes).length;

console.log(`📌 총 특성 개수: ${total}개`);

// 파일 저장
const outputPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryWowheadAccurate.js');
const fileContent = `// WoW 11.0.5 야수 사냥꾼 특성 트리 (Wowhead 정확한 데이터)
// 직업 특성: ${Object.keys(completeTalentTree.classTalents.nodes).length}개
// 전문화 특성: ${Object.keys(completeTalentTree.specTalents.nodes).length}개
// 무리의 지도자: ${Object.keys(completeTalentTree.heroTalents.packLeader.nodes).length}개
// 어둠 순찰자: ${Object.keys(completeTalentTree.heroTalents.darkRanger.nodes).length}개
// 총 ${total}개 특성

export const beastMasteryWowheadAccurate = ${JSON.stringify(completeTalentTree, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`\n💾 파일 저장 완료: ${outputPath}`);