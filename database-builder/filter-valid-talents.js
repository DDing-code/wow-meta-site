const fs = require('fs');

// 추출된 특성 로드
const extracted = JSON.parse(fs.readFileSync('extracted-demonology-talents.json', 'utf8'));

// 유효한 특성 필터링 (흑마법사 관련 설명이 있거나, 악마 전문화 관련)
const validTalents = extracted.filter(talent => {
  const desc = talent.description.toLowerCase();
  const name = talent.koreanName.toLowerCase();

  // 무효한 패턴 제외
  const invalidPatterns = [
    'dnt', '[dnt]', // 테스트용
    '그리핀', 'gryphon', // 탈것
    '수압', 'water pressure', // NPC 스킬
    '최고천', 'empyrean', // 성기사 특성
    '추가 중', 'adding', 'collect page' // 일반 스킬
  ];

  for (const pattern of invalidPatterns) {
    if (name.includes(pattern) || desc.includes(pattern)) {
      console.log(`✗ 제외: ${talent.id} - ${talent.koreanName} (${pattern})`);
      return false;
    }
  }

  // 유효한 패턴
  const validPatterns = [
    '악마', '공포', '지옥', '흑마법', '영혼', '암흑', '파멸',
    '임프', '사냥개', '폭군', '소환', '마법', '희생'
  ];

  const hasValidPattern = validPatterns.some(pattern =>
    name.includes(pattern) || desc.includes(pattern)
  );

  if (hasValidPattern) {
    console.log(`✓ 유효: ${talent.id} - ${talent.koreanName}`);
    return true;
  }

  console.log(`? 불명: ${talent.id} - ${talent.koreanName}`);
  return false;
});

console.log(`\n=== 필터링 결과 ===`);
console.log(`전체: ${extracted.length}개`);
console.log(`유효: ${validTalents.length}개`);
console.log(`제외: ${extracted.length - validTalents.length}개`);

// 유효한 특성만 저장
fs.writeFileSync(
  'valid-demonology-talents.json',
  JSON.stringify(validTalents, null, 2),
  'utf8'
);

console.log(`\n유효한 특성이 valid-demonology-talents.json에 저장되었습니다.`);