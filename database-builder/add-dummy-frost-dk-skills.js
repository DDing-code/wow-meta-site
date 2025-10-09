/**
 * add-dummy-frost-dk-skills.js
 *
 * FrostDeathKnightGuide.js에서 참조하는 마법사 스킬들을 찾아서
 * 냉기 죽음의 기사 스킬로 교체하고, 없는 스킬은 더미로 추가
 */

const fs = require('fs');
const path = require('path');

// 냉기 죽음의 기사 기본 스킬 매핑 (마법사 스킬 → 죽음의 기사 스킬)
const skillMapping = {
  // 오프너/주요 쿨다운
  'mirrorimage': 'raisedead',           // 환영 복제 → 시체 되살리기
  'evocation': 'empowerruneweapon',     // 환기 → 룬 무기 강화
  'timewarp': 'pillarofthe',            // Time Warp → 얼음 기둥
  'arcanesurge': 'breathofthe',         // Arcane Surge → 죽음의 숨결
  'touchofthemagi': 'frostscythe',      // Touch of the Magi → 냉기 낫

  // 주요 딜 스킬
  'arcaneblast': 'obliterate',          // 비전 작렬 → 말살
  'arcanebarrage': 'froststr',          // 비전 탄막 → 냉기 강타
  'arcanemissiles': 'howlingblast',     // 신비한 화살 → 울부짖는 냉기
  'arcaneorb': 'glacialadvance',        // 비전 보주 → 빙하 전진
  'arcaneexplosion': 'frostnova',       // 비전 폭발 → 얼음 회오리

  // 유틸리티
  'shiftingpower': 'mindfreeze',        // 힘의 전환 → 정신 얼리기
  'shimmer': 'deathsadvance',           // 점멸 → 죽음의 전진
  'invisibility': 'iceboundfort',       // 투명화 → 얼음의 요새
  'massbarrier': 'antimagiczone',       // 대규모 보호막 → 마법 억제 지대

  // 버프/패시브
  'arcaneintellect': 'bloodtap',        // 비전 지능 → 피의 선택
  'clearcasting': 'killingmachine',     // 번뜩임 → 도살기
  'arcanecharges': 'runicpower',        // 비전 충전물 → 룬 마력
  'arcanetempo': 'frostfever',          // 비전의 박자 → 냉기열
  'intuition': 'rimestrike',            // 직관 → 서리 일격
  'netherprecision': 'frostscythe',     // 황천의 정밀함 → 냉기 낫
  'gloriousincandescence': 'pillarofthe',  // 영광스러운 백열 → 얼음 기둥

  // 영웅 특성 관련
  'spellfirespheres': 'gatheringstorm', // 주문불꽃 구체 → 폭풍 수집
  'invocationarcanephoenix': 'breathofthe', // 비전 불사조 → 죽음의 숨결
  'memoryofalar': 'frostscythe',        // 알라르의 기억 → 냉기 낫
  'magisspark': 'frostfever',           // 마귀의 불꽃 → 냉기열
  'leydrinker': 'frostscythe',          // 지맥 흡수자 → 냉기 낫
  'arcaneharmony': 'killingmachine',    // 비전 조화 → 도살기
  'arcanesoul': 'remorselesswinter',    // 비전의 영혼 → 무자비한 겨울
  'aetherattunement': 'gatheringstorm', // 에테르 조율 → 폭풍 수집
  'netherprecisionbuff': 'frostfever',  // 황천의 정밀함 버프 → 냉기열
  'presenceofmind': 'pillarofthe',      // 정신 집중 → 얼음 기둥

  // 기타
  'mana': 'runicpower',                 // 마나 → 룬 마력
};

// 더미 스킬 생성 (실제 존재하지 않지만 참조되는 스킬용)
const dummySkills = {
  obliterate: {
    id: '49020',
    koreanName: '말살',
    englishName: 'Obliterate',
    icon: 'spell_deathknight_classicon',
    description: '룬 무기로 대상을 강타하여 물리 피해를 입힙니다. 냉기 죽음의 기사의 주요 딜링 스킬입니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '근접',
    resourceCost: '룬 2',
    resourceGain: '룬 마력 20',
    type: '기본',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  froststr: {
    id: '49143',
    koreanName: '냉기 강타',
    englishName: 'Frost Strike',
    icon: 'spell_deathknight_empowerruneblade2',
    description: '얼음의 힘으로 대상을 강타하여 냉기 피해를 입힙니다. 룬 마력을 소모하는 주요 스킬입니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '근접',
    resourceCost: '룬 마력 25',
    resourceGain: '없음',
    type: '기본',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  howlingblast: {
    id: '49184',
    koreanName: '울부짖는 냉기',
    englishName: 'Howling Blast',
    icon: 'spell_frost_arcticwinds',
    description: '대상 지역에 냉기 폭풍을 일으켜 모든 적에게 냉기 피해를 입힙니다. 광역 딜링의 핵심 스킬입니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '30 야드',
    resourceCost: '룬 1',
    resourceGain: '룬 마력 10',
    type: '기본',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  breathofthe: {
    id: '152279',
    koreanName: '신드라고사의 숨결',
    englishName: 'Breath of Sindragosa',
    icon: 'spell_frost_arcticwinds',
    description: '신드라고사의 숨결을 내뿜어 전방 원뿔 범위의 모든 적에게 지속 냉기 피해를 입힙니다.',
    cooldown: '120 초',
    castTime: '즉시',
    range: '15 야드',
    resourceCost: '룬 마력 15/초',
    resourceGain: '없음',
    type: '특성',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  pillarofthe: {
    id: '51271',
    koreanName: '얼음 기둥',
    englishName: 'Pillar of Frost',
    icon: 'ability_deathknight_pillaroffrost',
    description: '냉기의 힘을 강화하여 12초 동안 힘을 20% 증가시킵니다. 주요 버스트 쿨다운입니다.',
    cooldown: '60 초',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '쿨다운',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  glacialadvance: {
    id: '194913',
    koreanName: '빙하 전진',
    englishName: 'Glacial Advance',
    icon: 'spell_frost_summonwaterelemental_2',
    description: '빙하를 전방으로 발사하여 경로상의 모든 적에게 냉기 피해를 입힙니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '30 야드',
    resourceCost: '룬 마력 30',
    resourceGain: '없음',
    type: '특성',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  frostnova: {
    id: '57330',
    koreanName: '얼음 회오리',
    englishName: 'Horn of Winter',
    icon: 'inv_misc_horn_02',
    description: '겨울의 뿔피리를 불어 룬 마력을 생성하고 모든 룬의 재사용 대기시간을 감소시킵니다.',
    cooldown: '45 초',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '룬 마력 25',
    type: '유틸리티',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  deathsadvance: {
    id: '48265',
    koreanName: '죽음의 전진',
    englishName: "Death's Advance",
    icon: 'spell_shadow_demonicempathy',
    description: '이동 속도를 증가시키고 이동 제한 효과에 면역이 됩니다.',
    cooldown: '45 초',
    castTime: '즉시',
    range: '자신',
    resourceCost: '룬 1',
    resourceGain: '없음',
    type: '유틸리티',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  iceboundfort: {
    id: '48792',
    koreanName: '얼음의 요새',
    englishName: 'Icebound Fortitude',
    icon: 'spell_deathknight_iceboundfortitude',
    description: '받는 모든 피해를 30% 감소시키고 기절, 이동 불가, 공포 효과에 면역이 됩니다.',
    cooldown: '180 초',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '생존기',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  antimagiczone: {
    id: '51052',
    koreanName: '마법 억제 지대',
    englishName: 'Anti-Magic Zone',
    icon: 'spell_deathknight_antimagiczone',
    description: '마법 억제 지대를 생성하여 아군이 받는 마법 피해를 감소시킵니다.',
    cooldown: '120 초',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '유틸리티',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  killingmachine: {
    id: '51124',
    koreanName: '도살기',
    englishName: 'Killing Machine',
    icon: 'inv_sword_122',
    description: '다음 말살이 자동으로 극대화 효과를 발휘합니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '버프',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  runicpower: {
    id: 'RESOURCE',
    koreanName: '룬 마력',
    englishName: 'Runic Power',
    icon: 'inv_sword_62',
    description: '죽음의 기사의 주요 자원입니다. 최대 100까지 보유할 수 있습니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '자원',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  frostfever: {
    id: '55095',
    koreanName: '냉기열',
    englishName: 'Frost Fever',
    icon: 'spell_deathknight_frostfever',
    description: '대상에게 냉기열을 감염시켜 지속 피해를 입히고 이동 속도를 감소시킵니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '버프',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  rimestrike: {
    id: '316239',
    koreanName: '서리 일격',
    englishName: 'Rime',
    icon: 'spell_frost_freezingbreath',
    description: '서리 일격이 활성화되면 다음 울부짖는 냉기가 무료로 시전되고 피해량이 증가합니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '버프',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  frostscythe: {
    id: '207230',
    koreanName: '냉기 낫',
    englishName: 'Frostscythe',
    icon: 'spell_frost_frostarmor',
    description: '냉기 낫으로 주위의 모든 적을 공격하여 냉기 피해를 입힙니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '8 야드',
    resourceCost: '룬 1',
    resourceGain: '룬 마력 12',
    type: '특성',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  remorselesswinter: {
    id: '196770',
    koreanName: '무자비한 겨울',
    englishName: 'Remorseless Winter',
    icon: 'ability_deathknight_remorselesswinters2',
    description: '주위에 얼음 폭풍을 생성하여 지속적으로 냉기 피해를 입히고 이동 속도를 감소시킵니다.',
    cooldown: '20 초',
    castTime: '즉시',
    range: '8 야드',
    resourceCost: '룬 1',
    resourceGain: '없음',
    type: '쿨다운',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  gatheringstorm: {
    id: '194912',
    koreanName: '폭풍 수집',
    englishName: 'Gathering Storm',
    icon: 'spell_frost_ice-shards',
    description: '무자비한 겨울이 활성화되어 있는 동안 힘이 지속적으로 증가합니다.',
    cooldown: '없음',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '패시브',
    spec: '냉기',
    heroTalent: null,
    level: 1,
    pvp: false
  },
  bloodtap: {
    id: '221699',
    koreanName: '피의 선택',
    englishName: 'Blood Tap',
    icon: 'spell_deathknight_bloodtap',
    description: '즉시 룬 1개를 충전하고 룬 마력을 생성합니다.',
    cooldown: '60 초',
    castTime: '즉시',
    range: '자신',
    resourceCost: '없음',
    resourceGain: '룬 1, 룬 마력 10',
    type: '유틸리티',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false
  }
};

console.log('🔄 냉기 죽음의 기사 스킬 데이터 추가 시작...\n');

// 스킬 데이터 파일 읽기
const skillDataPath = path.join(__dirname, '..', 'src', 'data', 'frostDeathKnightSkillData.js');
let skillDataContent = fs.readFileSync(skillDataPath, 'utf8');

// 기존 스킬 객체 추출
const match = skillDataContent.match(/export const frostDeathKnightSkills = ({[\s\S]*?});/);
const existingSkills = eval('(' + match[1] + ')');

// 더미 스킬 추가
let addedCount = 0;
Object.entries(dummySkills).forEach(([key, skill]) => {
  if (!existingSkills[key]) {
    existingSkills[key] = skill;
    addedCount++;
    console.log(`✅ 더미 스킬 추가: ${skill.koreanName} (${skill.englishName})`);
  }
});

// 파일 재생성
const newContent = `/**
 * frostDeathKnightSkillData.js
 *
 * 냉기 죽음의 기사 스킬 데이터
 * 소스: twwS3FinalCleanedDatabase.js + Dummy Skills
 * 생성일: ${new Date().toISOString().split('T')[0]}
 *
 * 스킬 수: ${Object.keys(existingSkills).length}개
 * - 중앙 DB: ${Object.keys(existingSkills).length - addedCount}개
 * - 더미 스킬: ${addedCount}개
 *
 * 영웅 특성:
 * - 산왕 (Mountain Thane)
 * - 종말의 기수 (Rider of the Apocalypse)
 */

export const frostDeathKnightSkills = ${JSON.stringify(existingSkills, null, 2)};

// 스킬명 매핑 (역참조용)
export const skillNameMap = ${JSON.stringify(
  Object.entries(existingSkills).reduce((acc, [key, skill]) => {
    acc[skill.koreanName] = key;
    return acc;
  }, {}),
  null,
  2
)};
`;

fs.writeFileSync(skillDataPath, newContent, 'utf8');

console.log(`\n📄 스킬 데이터 파일 업데이트 완료`);
console.log(`총 스킬 수: ${Object.keys(existingSkills).length}개`);
console.log(`새로 추가된 더미 스킬: ${addedCount}개`);

// 가이드 파일의 스킬 참조 교체
const guidePath = path.join(__dirname, '..', 'src', 'components', 'FrostDeathKnightGuide.js');
let guideContent = fs.readFileSync(guidePath, 'utf8');

console.log(`\n🔄 가이드 파일의 스킬 참조 교체 시작...`);

let replacedCount = 0;
Object.entries(skillMapping).forEach(([mageSkill, dkSkill]) => {
  const regex = new RegExp(`skillData\\.${mageSkill}\\b`, 'g');
  const matches = guideContent.match(regex);
  if (matches) {
    guideContent = guideContent.replace(regex, `skillData.${dkSkill}`);
    replacedCount += matches.length;
    console.log(`✅ ${mageSkill} → ${dkSkill} (${matches.length}개)`);
  }
});

fs.writeFileSync(guidePath, guideContent, 'utf8');

console.log(`\n📄 가이드 파일 업데이트 완료`);
console.log(`총 ${replacedCount}개 참조 교체`);
