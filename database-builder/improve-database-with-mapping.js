const fs = require('fs');
const path = require('path');

console.log('🔧 기존 데이터베이스 개선 작업 시작...');

// 기존 데이터베이스 로드
const dbPath = path.join(__dirname, 'tww-s3-refined-database.json');
const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 클래스별 기본 스킬 ID 매핑 (확실한 기본 스킬들)
const baselineSkills = {
  'WARRIOR': [
    '100', // 돌진
    '355', // 도발
    '6673', // 전투의 외침
    '18499', // 광전사의 격노
    '23920', // 주문 반사
    '1160', // 사기의 외침
    '6544', // 영웅의 도약
    '5246', // 위협의 외침
    '2565', // 방패 막기
    '1715', // 무력화
  ],
  'PALADIN': [
    '853', // 심판의 망치
    '62124', // 신의 권능
    '633', // 신의 축복
    '642', // 천상의 보호막
    '1044', // 자유의 축복
    '1022', // 보호의 축복
    '6940', // 희생의 축복
    '31884', // 응징의 격노
    '184662', // 응징의 방패
    '85673', // 영광의 서약
  ],
  'HUNTER': [
    '1543', // 섬광탄
    '19801', // 평정 사격
    '147362', // 역습
    '186265', // 거북의 상
    '109304', // 활성화
    '195645', // 날개 절단
    '1513', // 야수 위협
    '5116', // 뇌진탕 사격
    '2643', // 독사 쏘기
    '187650', // 빙결의 덫
  ],
  'ROGUE': [
    '1784', // 은신
    '1766', // 발차기
    '2094', // 실명
    '1856', // 소멸
    '5277', // 회피
    '31224', // 그림자 망토
    '114018', // 은신처
    '1725', // 혼란
    '2823', // 독칼
    '3408', // 상처 감염 독
  ],
  'PRIEST': [
    '17', // 신의 권능: 보호막
    '21562', // 신의 권능: 인내
    '2061', // 빛의 섬광
    '589', // 암흑의 마법
    '8092', // 정신 폭발
    '605', // 정신 제어
    '586', // 소실
    '528', // 사악 무효화
    '527', // 정화
    '2006', // 부활
  ],
  'SHAMAN': [
    '188196', // 번개 화살
    '51505', // 용암 폭발
    '188389', // 화염 충격
    '51490', // 천둥폭풍
    '108271', // 영혼 이동
    '556', // 영혼 귀환
    '2008', // 선조의 영혼
    '370', // 대지 정령 토템
    '51485', // 속박의 토템
    '192058', // 번개 축전기 토템
  ],
  'MAGE': [
    '1449', // 비전 폭발
    '319836', // 화염 폭발
    '116', // 서리 화살
    '2136', // 화염 작렬
    '122', // 얼음 회오리
    '130', // 저속 낙하
    '1953', // 점멸
    '475', // 투명화
    '80353', // 시간 왜곡
    '190336', // 비전 지능
  ],
  'WARLOCK': [
    '172', // 부패
    '980', // 고통
    '702', // 어둠의 저주
    '1454', // 생명력 집중
    '5782', // 공포
    '710', // 추방
    '20707', // 영혼석
    '698', // 의식: 소환
    '697', // 의식: 소환진
    '48018', // 악마의 마법진
  ],
  'MONK': [
    '100780', // 해오름차기
    '100784', // 흑우 차기
    '101546', // 회전 학다리차기
    '109132', // 구르기
    '115178', // 재활
    '115203', // 강화 주
    '115546', // 소혹의 안개
    '116670', // 평온
    '116705', // 손날 찌르기
    '119381', // 팽이차기
  ],
  'DRUID': [
    '5487', // 곰 변신
    '768', // 표범 변신
    '783', // 여행 변신
    '22812', // 나무껍질
    '5211', // 거센 강타
    '99', // 방향 감각 상실의 포효
    '1126', // 야생의 징표
    '20484', // 환생
    '29166', // 정신 자극
    '2908', // 달빛섬광
  ],
  'DEMONHUNTER': [
    '162794', // 혼돈의 일격
    '162243', // 악마의 이빨
    '198013', // 눈빔
    '195072', // 지옥 돌진
    '185245', // 고문
    '188501', // 악령 시야
    '196718', // 어둠의 권능
    '198589', // 흐릿해지기
    '183752', // 분열
    '185123', // 투척 글레이브
  ],
  'DEATHKNIGHT': [
    '49998', // 죽음의 일격
    '195182', // 룬 무기 일격
    '47528', // 정신 얼리기
    '43265', // 죽음과 부패
    '48707', // 대마법 보호막
    '48792', // 얼음같은 인내력
    '49576', // 죽음의 손아귀
    '56222', // 어둠의 명령
    '61999', // 아군 되살리기
    '3714', // 죽음의 길
  ],
  'EVOKER': [
    '361469', // 살아있는 불꽃
    '357208', // 불의 숨결
    '362969', // 푸른 용의 힘
    '351338', // 억제
    '358267', // 호버
    '357210', // 깊은 숨결
    '360806', // 잠자는 숨결
    '363916', // 흑요석 비늘
    '365585', // 날개의 완충
    '361227', // 귀환
  ]
};

// 클래스별 대표 특성 스킬 (특성 트리에만 있는 스킬들)
const talentSkills = {
  'WARRIOR': [
    '167105', // 거인의 강타
    '262161', // 전쟁인도자
    '152277', // 분쇄
    '227847', // 칼날폭풍
    '46968', // 충격파
    '107574', // 투신
    '260708', // 휩쓸기 일격
    '262150', // 학살
    '383762', // 폭발의 격노
    '392778', // 광폭한 포효
  ],
  'PALADIN': [
    '31850', // 헌신적인 수호자
    '86659', // 고대 왕의 수호자
    '231895', // 성전사
    '215652', // 정의의 방패
    '343527', // 처형 선고
    '255937', // 십자군의 선고
    '343721', // 최후의 심판
    '384027', // 은총의 재
    '403876', // 빛의 인도
    '427441', // 신성한 병기
  ],
  'HUNTER': [
    '257044', // 급속 사격
    '193530', // 야생의 상
    '260402', // 이중 사격
    '257620', // 다중 사격
    '259387', // 몽구스 물기
    '266779', // 조정 사격
    '194407', // 창 투척
    '236776', // 생명력 폭발
    '390163', // 약점 공격
    '459922', // 야수의 격노
  ],
  'ROGUE': [
    '196819', // 절개
    '185311', // 진홍색 폭풍우
    '121471', // 그림자 칼날
    '385616', // 메아리치는 파멸
    '360194', // 망토 암살
    '381623', // 인내의 즉발탄
    '382245', // 냉혈
    '384631', // 뼈주사위
    '385408', // 혈폭풍
    '426591', // 잠재된 독
  ],
  // ... 다른 클래스들도 추가
};

// 전문화별 스킬 매핑 개선
const specSkillMapping = {
  '전사': {
    '무기': ['163201', '167105', '262161', '227847', '152277'],
    '분노': ['5308', '118038', '184367', '85288', '280735'],
    '방어': ['23922', '6572', '46968', '107574', '385952']
  },
  '성기사': {
    '신성': ['19750', '183998', '53563', '183997', '114165'],
    '보호': ['31935', '86659', '387174', '378974', '389539'],
    '징벌': ['184575', '24275', '343527', '403876', '343721']
  },
  '사냥꾼': {
    '야수': ['19574', '193530', '217200', '120679', '201430'],
    '사격': ['257044', '260402', '257620', '288613', '389880'],
    '생존': ['259387', '266779', '190925', '270335', '375891']
  },
  // ... 다른 클래스 전문화도 추가
};

// 데이터베이스 개선
let improvedCount = 0;
let baselineCount = 0;
let talentCount = 0;
let specAssignedCount = 0;

Object.entries(database).forEach(([className, classSkills]) => {
  // 기본 스킬 판별
  const baselineIds = baselineSkills[className] || [];
  const talentIds = talentSkills[className] || [];

  Object.entries(classSkills).forEach(([skillId, skill]) => {
    let improved = false;

    // 1. 기본/특성 타입 수정
    if (baselineIds.includes(skillId)) {
      skill.type = '기본';
      baselineCount++;
      improved = true;
    } else if (talentIds.includes(skillId)) {
      skill.type = '특성';
      talentCount++;
      improved = true;
    }

    // 2. 전문화 할당 개선
    const koreanClassName = skill.class;
    const specMapping = specSkillMapping[koreanClassName];

    if (specMapping) {
      for (const [specName, specSkillIds] of Object.entries(specMapping)) {
        if (specSkillIds.includes(skillId)) {
          skill.spec = specName;
          specAssignedCount++;
          improved = true;
          break;
        }
      }
    }

    // 3. 설명이 비어있거나 잘못된 경우 기본값 제공
    if (!skill.description || skill.description.length < 5 || skill.description.includes('주의:')) {
      skill.description = `${skill.koreanName || '알 수 없는 스킬'}의 설명입니다. (데이터 수집 중)`;
      improved = true;
    }

    if (improved) improvedCount++;
  });
});

console.log(`✅ ${improvedCount}개 스킬 개선 완료`);
console.log(`  - 기본 스킬: ${baselineCount}개`);
console.log(`  - 특성: ${talentCount}개`);
console.log(`  - 전문화 할당: ${specAssignedCount}개`);

// 개선된 데이터베이스 저장
const outputPath = path.join(__dirname, 'tww-s3-improved-database.json');
fs.writeFileSync(outputPath, JSON.stringify(database, null, 2), 'utf8');

// React 모듈 생성
console.log('\n📦 React 모듈 생성 중...');

const allSkills = [];
const stats = {
  total: 0,
  baseline: 0,
  talents: 0,
  withSpec: 0
};

Object.entries(database).forEach(([className, classSkills]) => {
  Object.entries(classSkills).forEach(([skillId, skill]) => {
    allSkills.push(skill);
    stats.total++;
    if (skill.type === '기본') stats.baseline++;
    if (skill.type === '특성') stats.talents++;
    if (skill.spec && skill.spec !== '공용') stats.withSpec++;
  });
});

const moduleContent = `// TWW Season 3 개선된 스킬 데이터베이스
// 생성: ${new Date().toISOString()}
// 총 ${stats.total}개 스킬 (기본: ${stats.baseline}, 특성: ${stats.talents})

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
  skillsWithSpec: ${stats.withSpec},
  classes: 13,
  patch: '11.2',
  season: 'TWW S3',
  lastUpdated: '${new Date().toISOString()}',
  dataQuality: {
    improved: true,
    typesClassified: true,
    specsEnhanced: true
  }
};

export default twwS3SkillDatabase;
`;

const reactModulePath = path.join(__dirname, '..', 'src', 'data', 'twwS3ImprovedSkillDatabase.js');
fs.writeFileSync(reactModulePath, moduleContent, 'utf8');

console.log(`\n✅ 작업 완료!`);
console.log(`  📁 개선된 DB: ${outputPath}`);
console.log(`  📦 React 모듈: ${reactModulePath}`);