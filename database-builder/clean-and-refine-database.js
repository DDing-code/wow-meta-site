const fs = require('fs');
const path = require('path');

console.log('🧹 TWW S3 데이터베이스 정제 및 수정 시작...');

// 원본 데이터베이스 로드
const dbPath = path.join(__dirname, 'tww-s3-final-ultimate-database.json');
const specMappingPath = path.join(__dirname, 'skill-spec-mapping.json');

// 잘못된 설명 패턴
const invalidDescriptionPatterns = [
  '주의: 제출한 동영상은 게재되기 전에 먼저 관리자의 승인을 받아야 합니다',
  'Warning: Submitted videos must be approved by administrator before being posted',
  '동영상 승인',
  'video approval',
  '관리자 승인'
];

// 클래스명 매핑
const classNameMapping = {
  'WARRIOR': '전사',
  'PALADIN': '성기사',
  'HUNTER': '사냥꾼',
  'ROGUE': '도적',
  'PRIEST': '사제',
  'SHAMAN': '주술사',
  'MAGE': '마법사',
  'WARLOCK': '흑마법사',
  'MONK': '수도사',
  'DRUID': '드루이드',
  'DEMONHUNTER': '악마사냥꾼',
  'DEMON HUNTER': '악마사냥꾼',
  'DEATHKNIGHT': '죽음의기사',
  'DEATH KNIGHT': '죽음의기사',
  'EVOKER': '기원사'
};

// 전문화 매핑 로드
const loadSpecMapping = () => {
  try {
    const specMapping = JSON.parse(fs.readFileSync(specMappingPath, 'utf8'));
    const idToSpec = {};

    Object.entries(specMapping).forEach(([className, specs]) => {
      Object.entries(specs).forEach(([specName, skillIds]) => {
        skillIds.forEach(skillId => {
          idToSpec[String(skillId)] = {
            class: className,
            spec: specName
          };
        });
      });
    });

    return idToSpec;
  } catch (error) {
    console.warn('⚠️ 전문화 매핑 파일을 찾을 수 없습니다.');
    return {};
  }
};

// 영웅 특성 매핑
const heroTalentToSpec = {
  // 전사
  '거신': ['무기', '방어'],
  '산왕': ['분노', '방어'],
  '학살자': ['무기', '분노'],
  // 성기사
  '빛의 대장장이': ['보호', '신성'],
  '기사단': ['보호', '징벌'],
  '태양의 사자': ['신성', '징벌'],
  // 사냥꾼
  '어둠 순찰자': ['사격', '야수'],
  '무리의 지도자': ['야수', '생존'],
  '파수꾼': ['사격', '생존'],
  // 도적
  '기만자': ['무법', '잠행'],
  '운명결속': ['암살', '무법'],
  '죽음추적자': ['암살', '잠행'],
  // 사제
  '예언자': ['수양', '신성'],
  '집정관': ['신성', '암흑'],
  '공허술사': ['수양', '암흑'],
  // 주술사
  '선견자': ['정기', '복원'],
  '토템술사': ['복원', '고양'],
  '폭풍인도자': ['고양', '정기'],
  // 마법사
  '성난태양': ['비전', '화염'],
  '서리불꽃': ['화염', '냉기'],
  '주문술사': ['비전', '냉기'],
  // 흑마법사
  '악마학자': ['악마', '파괴'],
  '지옥소환사': ['파괴', '고통'],
  '영혼 수확자': ['고통', '악마'],
  // 수도사
  '천신의 대변자': ['운무', '풍운'],
  '음영파': ['양조', '풍운'],
  '천상의 대리자': ['운무', '양조'],
  // 드루이드
  '야생추적자': ['야성', '회복'],
  '숲의 수호자': ['조화', '회복'],
  '엘룬의 대리자': ['조화', '수호'],
  '발톱의 드루이드': ['야성', '수호'],
  // 악마사냥꾼
  '알드라치 파괴자': ['파멸'],
  '지옥상흔': ['복수'],
  // 죽음의기사
  '산레인': ['혈기', '부정'],
  '종말의 기수': ['냉기', '부정'],
  '죽음의 인도자': ['혈기', '냉기'],
  // 기원사
  '불꽃형성자': ['황폐', '보존'],
  '시간 감시자': ['보존', '증강'],
  '비늘사령관': ['황폐', '증강']
};

// 스킬 타입 판별 함수
function determineSkillType(skill, className) {
  // 영웅 특성이 있으면 특성
  if (skill.heroTalent) {
    return '특성';
  }

  // 레벨이 높으면 특성일 가능성이 높음
  if (skill.level && parseInt(skill.level) > 10) {
    return '특성';
  }

  // type 필드가 이미 있고 유효하면 그대로 사용
  if (skill.type && ['기본', '특성', '영웅특성', 'PvP'].includes(skill.type)) {
    return skill.type;
  }

  // 기본값
  return '기본';
}

// 전문화 판별 함수 (정확한 ID 기반)
function determineSpec(skill, className, idToSpec) {
  const skillId = String(skill.id);

  // ID 기반 정확한 매핑 확인
  if (idToSpec[skillId]) {
    return idToSpec[skillId].spec;
  }

  // 영웅특성 기반 전문화
  if (skill.heroTalent && heroTalentToSpec[skill.heroTalent]) {
    // 영웅특성이 속한 첫 번째 전문화 반환
    return heroTalentToSpec[skill.heroTalent][0];
  }

  return '공용';
}

// 설명 정제 함수
function cleanDescription(description) {
  if (!description) return '';

  let cleaned = description;

  // 잘못된 패턴 제거
  invalidDescriptionPatterns.forEach(pattern => {
    cleaned = cleaned.replace(new RegExp(pattern, 'gi'), '');
  });

  // 빈 설명 처리
  cleaned = cleaned.trim();
  if (cleaned === '' || cleaned.length < 5) {
    return '스킬 설명이 없습니다.';
  }

  return cleaned;
}

// 스킬 정제 함수
function refineSkill(skill, className, idToSpec) {
  const refined = { ...skill };

  // 1. 기본/특성 타입 수정
  refined.type = determineSkillType(skill, className);

  // 2. 전문화 분류 수정
  refined.spec = determineSpec(skill, className, idToSpec);

  // 3. 설명 정제
  refined.description = cleanDescription(skill.description);

  // 4. 필드 정규화
  refined.id = skill.id || skill.skillId;
  refined.koreanName = skill.koreanName || skill.name || '';
  refined.englishName = skill.englishName || skill.nameEn || '';
  refined.icon = skill.icon || 'inv_misc_questionmark';
  refined.cooldown = skill.cooldown || '';
  refined.castTime = skill.castTime || '';
  refined.range = skill.range || '';
  refined.resourceCost = skill.resourceCost || skill.resource || '';
  refined.resourceGain = skill.resourceGain || '';
  refined.level = skill.level || 1;
  refined.pvp = skill.pvp || false;

  return refined;
}

try {
  // 데이터베이스 로드
  const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const idToSpec = loadSpecMapping();

  // 통계
  const stats = {
    totalSkills: 0,
    fixedDescriptions: 0,
    fixedTypes: 0,
    fixedSpecs: 0,
    skillsByType: {},
    skillsBySpec: {}
  };

  // 정제된 데이터베이스
  const refinedDatabase = {};

  // 각 클래스별로 처리
  Object.entries(database).forEach(([className, classSkills]) => {
    const koreanClassName = classNameMapping[className] || className;
    refinedDatabase[className] = {};

    Object.entries(classSkills).forEach(([skillId, skill]) => {
      const refined = refineSkill(skill, className, idToSpec);

      // 통계 업데이트
      stats.totalSkills++;

      if (skill.description !== refined.description) {
        stats.fixedDescriptions++;
      }

      if (skill.type !== refined.type) {
        stats.fixedTypes++;
      }

      if (skill.spec !== refined.spec) {
        stats.fixedSpecs++;
      }

      // 타입별 통계
      stats.skillsByType[refined.type] = (stats.skillsByType[refined.type] || 0) + 1;

      // 전문화별 통계
      const specKey = `${koreanClassName}-${refined.spec}`;
      stats.skillsBySpec[specKey] = (stats.skillsBySpec[specKey] || 0) + 1;

      refinedDatabase[className][skillId] = refined;
    });
  });

  // 정제된 데이터베이스 저장
  const outputPath = path.join(__dirname, 'tww-s3-refined-database.json');
  fs.writeFileSync(outputPath, JSON.stringify(refinedDatabase, null, 2), 'utf8');

  console.log('✅ 데이터베이스 정제 완료!');
  console.log(`📊 통계:`);
  console.log(`  - 총 스킬: ${stats.totalSkills}개`);
  console.log(`  - 수정된 설명: ${stats.fixedDescriptions}개`);
  console.log(`  - 수정된 타입: ${stats.fixedTypes}개`);
  console.log(`  - 수정된 전문화: ${stats.fixedSpecs}개`);

  console.log(`\n📈 타입별 분포:`);
  Object.entries(stats.skillsByType)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}개`);
    });

  console.log(`\n📈 전문화별 분포 (샘플):`);
  Object.entries(stats.skillsBySpec)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 10)
    .forEach(([spec, count]) => {
      console.log(`  - ${spec}: ${count}개`);
    });

  console.log(`\n💾 저장 위치: ${outputPath}`);

  // React 모듈 생성
  console.log('\n🔄 React 모듈 생성 중...');
  require('./convert-refined-to-react-module.js');

} catch (error) {
  console.error('❌ 정제 실패:', error);
}