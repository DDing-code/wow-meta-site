const fs = require('fs');

// 메인 DB 로드
const db = JSON.parse(fs.readFileSync('tww-s3-refined-database.json', 'utf8'));

// 유효한 특성 로드
const talents = JSON.parse(fs.readFileSync('valid-demonology-talents.json', 'utf8'));

console.log('=== 특성 추가 시작 ===');
console.log(`추가할 특성 수: ${talents.length}개`);

let addedCount = 0;
talents.forEach(talent => {
  if (!db[talent.id]) {
    db[talent.id] = {
      id: talent.id,
      englishName: talent.englishName,
      koreanName: talent.koreanName,
      icon: talent.icon,
      type: talent.type,
      spec: talent.spec,
      heroTalent: null,
      level: null,
      pvp: false,
      duration: null,
      school: null,
      mechanic: null,
      dispelType: null,
      gcd: null,
      resourceCost: talent.resourceCost,
      range: talent.range,
      castTime: talent.castTime,
      cooldown: talent.cooldown,
      description: talent.description,
      resourceGain: talent.resourceGain
    };
    console.log(`✓ ${talent.id} - ${talent.koreanName} 추가됨`);
    addedCount++;
  } else {
    console.log(`- ${talent.id} - ${talent.koreanName} 이미 존재`);
  }
});

// DB 저장
fs.writeFileSync(
  'tww-s3-refined-database.json',
  JSON.stringify(db, null, 2),
  'utf8'
);

console.log(`\n=== 추가 완료 ===`);
console.log(`${addedCount}개 특성이 메인 DB에 추가되었습니다.`);