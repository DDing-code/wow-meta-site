const fs = require('fs');

// 악마 흑마법사 주요 특성 ID 목록 (Wowhead 가이드 기준)
const talentIds = [
  '267216', // 소환: 악마 폭군 강화
  '270569', // 악마의 힘
  '387393', // 지옥의 통솔
  '387441', // 악마의 숙련
  '387163', // 악마의 공명
  '119898', // 지옥의 탄생
  '196098', // 영혼 강탈자
  '387157', // 악마 지식
  '387158', // 악마 소환 강화
  '270580', // 내면의 악마들
  '193396', // 악마 핵심
  '193440', // 악마핵: 부패
  '111897', // 지옥불길
  '196099', // 흑마법서: 악마 폭군
  '119905', // 영혼결속
  '267214', // 악마 소환사
  '456552', // 디아블리스트 영웅 특성
  '455145'  // 영혼 수확자 영웅 특성
];

const db = JSON.parse(fs.readFileSync('tww-s3-refined-database.json', 'utf8'));

const missing = talentIds.filter(id => !db[id]);
const existing = talentIds.filter(id => db[id]);

console.log('=== 악마 흑마법사 특성 체크 ===');
console.log('전체 특성:', talentIds.length);
console.log('DB에 있는 특성:', existing.length);
console.log('누락된 특성:', missing.length);
console.log('\n누락된 특성 ID 목록:');
console.log(missing.join(', '));