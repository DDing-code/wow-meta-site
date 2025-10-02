const fs = require('fs');
const path = require('path');

console.log('📊 전문화 제거 및 설명 추가 작업 시작...');

// 기존 데이터베이스 로드
const dbPath = path.join(__dirname, 'tww-s3-manual-enhanced-database.json');
const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 스킬별 기본 설명 템플릿
const descriptionTemplates = {
  '기본': (name) => `${name}을(를) 시전하여 대상에게 효과를 적용합니다.`,
  '특성': (name) => `${name} 특성을 활성화하여 캐릭터를 강화합니다.`,
  '액티브': (name) => `${name}을(를) 사용하여 즉시 효과를 발휘합니다.`,
  '패시브': (name) => `${name} 효과가 지속적으로 적용됩니다.`
};

// 클래스별 대표 스킬 설명 (일부 중요 스킬만)
const specificDescriptions = {
  // 전사
  '100': '적에게 돌진하여 이동 속도를 70% 감소시킵니다.',
  '355': '대상을 도발하여 3초 동안 자신을 공격하게 합니다.',
  '6673': '아군의 공격력을 5% 증가시킵니다.',
  '23920': '5초 동안 주문을 반사합니다.',
  '6544': '최대 40미터까지 도약합니다.',

  // 성기사
  '853': '대상을 3초 동안 기절시킵니다.',
  '633': '10초 동안 모든 피해에 면역이 됩니다.',
  '642': '8초 동안 모든 피해를 흡수하는 보호막을 생성합니다.',
  '1044': '대상의 이동 방해 효과를 제거하고 8초 동안 면역을 부여합니다.',

  // 사냥꾼
  '186265': '8초 동안 받는 피해를 30% 감소시킵니다.',
  '109304': '15초 동안 가속을 40% 증가시킵니다.',
  '5116': '대상의 이동 속도를 6초 동안 50% 감소시킵니다.',
  '187650': '덫을 설치하여 적을 3초 동안 빙결시킵니다.',

  // 도적
  '1784': '10초 동안 은신 상태가 됩니다.',
  '1766': '대상의 시전을 차단하고 5초 동안 같은 계열 주문 시전을 방지합니다.',
  '5277': '10초 동안 회피율을 100% 증가시킵니다.',
  '31224': '5초 동안 모든 주문에 면역이 됩니다.',

  // 사제
  '17': '대상에게 피해를 흡수하는 보호막을 씌웁니다.',
  '589': '암흑 피해를 입히고 18초 동안 지속 피해를 입힙니다.',
  '586': '10초 동안 소실 상태가 되어 피해를 받지 않습니다.',
  '605': '대상을 5초 동안 정신 제어합니다.',

  // 주술사
  '51505': '용암 폭발을 발사하여 화염 피해를 입힙니다.',
  '188389': '대상에게 화염 충격을 가하고 지속 피해를 입힙니다.',
  '108271': '묘지로 즉시 이동합니다.',
  '51490': '주변 적들을 넉백시키고 이동 속도를 감소시킵니다.',

  // 마법사
  '1449': '비전 피해를 입히고 비전 충전물을 생성합니다.',
  '116': '서리 피해를 입히고 이동 속도를 감소시킵니다.',
  '122': '주변 적들에게 서리 피해를 입히고 빙결시킵니다.',
  '1953': '전방으로 순간이동합니다.',

  // 흑마법사
  '172': '18초 동안 암흑 피해를 입힙니다.',
  '980': '18초 동안 암흑 피해를 입히고 이동 속도를 감소시킵니다.',
  '5782': '대상을 3초 동안 공포에 질리게 합니다.',
  '48018': '악마의 마법진을 생성하여 순간이동할 수 있게 합니다.',

  // 수도사
  '100780': '대상에게 물리 피해를 입힙니다.',
  '100784': '적을 기절시키고 피해를 입힙니다.',
  '109132': '전방으로 구릅니다.',
  '115178': '생명력과 마나를 즉시 회복합니다.',

  // 드루이드
  '5487': '곰 변신을 하여 방어력과 생명력을 증가시킵니다.',
  '768': '표범 변신을 하여 이동 속도와 은신 능력을 얻습니다.',
  '22812': '받는 피해를 20% 감소시킵니다.',
  '29166': '대상의 마나를 회복시킵니다.',

  // 악마사냥꾼
  '162794': '혼돈 피해를 입히고 분노를 생성합니다.',
  '198013': '전방에 눈빔을 발사하여 피해를 입힙니다.',
  '195072': '대상 지역으로 돌진하여 피해를 입힙니다.',
  '188501': '30초 동안 악마와 숨겨진 것들을 볼 수 있습니다.',

  // 죽음의기사
  '49998': '무기로 공격하여 피해를 입히고 자신을 치유합니다.',
  '47528': '대상의 정신을 얼려 3초 동안 공포에 질리게 합니다.',
  '48707': '5초 동안 모든 주문 피해를 75% 감소시킵니다.',
  '56222': '대상을 강제로 도발합니다.',

  // 기원사
  '361469': '살아있는 불꽃을 발사하여 치유하거나 피해를 입힙니다.',
  '357208': '전방에 불의 숨결을 내뿜어 피해를 입힙니다.',
  '362969': '푸른 용의 힘을 사용하여 주문력을 증가시킵니다.',
  '358267': '공중에 떠서 이동할 수 있습니다.'
};

// 통계
let updateCount = {
  specRemoved: 0,
  descriptionAdded: 0,
  descriptionFixed: 0
};

// 데이터베이스 수정
Object.entries(database).forEach(([className, classSkills]) => {
  Object.entries(classSkills).forEach(([skillId, skill]) => {
    // 1. 전문화를 모두 "공용"으로 변경
    if (skill.spec && skill.spec !== '공용') {
      skill.spec = '공용';
      updateCount.specRemoved++;
    }

    // 2. 설명이 없거나 부적절한 경우 수정
    const needsDescription = !skill.description ||
                            skill.description.length < 10 ||
                            skill.description.includes('주의:') ||
                            skill.description.includes('효과를 발휘합니다.');

    if (needsDescription) {
      // 특정 스킬 설명이 있으면 사용
      if (specificDescriptions[skillId]) {
        skill.description = specificDescriptions[skillId];
        updateCount.descriptionAdded++;
      }
      // 스킬 이름에 따른 자동 설명 생성
      else {
        const skillName = skill.koreanName || '알 수 없는 스킬';
        let description = '';

        // 스킬 이름으로 타입 추론
        if (skillName.includes('보호') || skillName.includes('방어')) {
          description = `${skillName}을(를) 시전하여 받는 피해를 감소시키고 방어력을 증가시킵니다.`;
        } else if (skillName.includes('치유') || skillName.includes('회복')) {
          description = `${skillName}을(를) 시전하여 대상의 생명력을 회복시킵니다.`;
        } else if (skillName.includes('공격') || skillName.includes('일격') || skillName.includes('타격')) {
          description = `${skillName}으로 대상에게 강력한 물리 피해를 입힙니다.`;
        } else if (skillName.includes('저주') || skillName.includes('고통')) {
          description = `${skillName}을(를) 걸어 대상에게 지속적인 암흑 피해를 입힙니다.`;
        } else if (skillName.includes('화염') || skillName.includes('불')) {
          description = `${skillName}을(를) 시전하여 화염 피해를 입힙니다.`;
        } else if (skillName.includes('냉기') || skillName.includes('서리') || skillName.includes('얼음')) {
          description = `${skillName}을(를) 시전하여 냉기 피해를 입히고 이동 속도를 감소시킵니다.`;
        } else if (skillName.includes('번개') || skillName.includes('전기')) {
          description = `${skillName}을(를) 시전하여 자연 피해를 입힙니다.`;
        } else if (skillName.includes('신성') || skillName.includes('빛')) {
          description = `${skillName}을(를) 시전하여 신성 피해를 입히거나 아군을 치유합니다.`;
        } else if (skillName.includes('은신') || skillName.includes('투명')) {
          description = `${skillName}을(를) 사용하여 적의 시야에서 사라집니다.`;
        } else if (skillName.includes('도약') || skillName.includes('돌진') || skillName.includes('점프')) {
          description = `${skillName}을(를) 사용하여 빠르게 이동합니다.`;
        } else if (skillName.includes('변신')) {
          description = `${skillName}을(를) 사용하여 형태를 변경하고 새로운 능력을 얻습니다.`;
        } else if (skillName.includes('소환')) {
          description = `${skillName}을(를) 시전하여 아군이나 소환수를 불러냅니다.`;
        } else if (skillName.includes('폭발')) {
          description = `${skillName}을(를) 시전하여 범위 피해를 입힙니다.`;
        } else if (skillName.includes('저항') || skillName.includes('면역')) {
          description = `${skillName}을(를) 사용하여 특정 효과에 저항하거나 면역이 됩니다.`;
        } else if (skill.type === '특성') {
          description = descriptionTemplates['특성'](skillName);
        } else {
          description = descriptionTemplates['기본'](skillName);
        }

        skill.description = description;
        updateCount.descriptionFixed++;
      }
    }
  });
});

console.log('\n✅ 수정 완료!');
console.log(`  - 전문화 제거 (공용으로 변경): ${updateCount.specRemoved}개`);
console.log(`  - 설명 추가: ${updateCount.descriptionAdded}개`);
console.log(`  - 설명 자동 생성: ${updateCount.descriptionFixed}개`);

// 수정된 데이터베이스 저장
const outputPath = path.join(__dirname, 'tww-s3-final-fixed-database.json');
fs.writeFileSync(outputPath, JSON.stringify(database, null, 2), 'utf8');
console.log(`\n💾 저장 완료: ${outputPath}`);

// React 모듈 생성
const allSkills = [];
const stats = {
  total: 0,
  baseline: 0,
  talents: 0,
  withDescription: 0
};

Object.entries(database).forEach(([className, classSkills]) => {
  Object.values(classSkills).forEach(skill => {
    // 클래스 정보 추가
    skill.class = className;
    allSkills.push(skill);
    stats.total++;

    if (skill.type === '기본') stats.baseline++;
    if (skill.type === '특성') stats.talents++;
    if (skill.description && skill.description.length > 10) stats.withDescription++;
  });
});

const moduleContent = `// TWW Season 3 최종 수정 데이터베이스
// 생성: ${new Date().toISOString()}
// 총 ${stats.total}개 스킬 (기본: ${stats.baseline}, 특성: ${stats.talents})
// 설명 포함: ${stats.withDescription}개

export const twwS3SkillDatabase = ${JSON.stringify(allSkills, null, 2)};

export const classData = {
  '전사': { name: '전사', color: '#C79C6E', specs: ['무기', '분노', '방어'] },
  '성기사': { name: '성기사', color: '#F58CBA', specs: ['신성', '보호', '징벌'] },
  '사냥꾼': { name: '사냥꾼', color: '#ABD473', specs: ['야수', '사격', '생존'] },
  '도적': { name: '도적', color: '#FFF569', specs: ['암살', '무법', '잠행'] },
  '사제': { name: '사제', color: '#FFFFFF', specs: ['수양', '신성', '암흑'] },
  '주술사': { name: '주술사', color: '#0070DE', specs: ['정기', '고양', '복원'] },
  '마법사': { name: '마법사', color: '#69CCF0', specs: ['비전', '화염', '냉기'] },
  '흑마법사': { name: '흑마법사', color: '#9482C9', specs: ['고통', '악마', '파괴'] },
  '수도사': { name: '수도사', color: '#00FF96', specs: ['양조', '운무', '풍운'] },
  '드루이드': { name: '드루이드', color: '#FF7D0A', specs: ['조화', '야성', '수호', '회복'] },
  '악마사냥꾼': { name: '악마사냥꾼', color: '#A330C9', specs: ['파멸', '복수'] },
  '죽음의기사': { name: '죽음의기사', color: '#C41E3A', specs: ['혈기', '냉기', '부정'] },
  '기원사': { name: '기원사', color: '#33937F', specs: ['황폐', '보존', '증강'] }
};

export const databaseStats = {
  totalSkills: ${stats.total},
  basicSkills: ${stats.baseline},
  talentSkills: ${stats.talents},
  skillsWithDescription: ${stats.withDescription},
  lastUpdated: '${new Date().toISOString()}'
};

export default twwS3SkillDatabase;
`;

const reactModulePath = path.join(__dirname, '..', 'src', 'data', 'twwS3FinalFixedDatabase.js');
fs.writeFileSync(reactModulePath, moduleContent, 'utf8');
console.log(`📦 React 모듈 저장: ${reactModulePath}`);

console.log('\n✨ 작업 완료!');