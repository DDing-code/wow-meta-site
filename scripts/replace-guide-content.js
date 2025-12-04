// HavocDemonHunterGuide.js 내용 교체 스크립트
const fs = require('fs');
const path = require('path');

const guideFilePath = path.join(__dirname, '../src/components/HavocDemonHunterGuide.js');

console.log('🔄 파멸 악마사냥꾼 가이드 내용 교체 시작...\n');

// 파일 읽기
let content = fs.readFileSync(guideFilePath, 'utf8');

// Step 4: 영웅 특성 교체
console.log('Step 4: 영웅 특성명 교체 중...');
content = content.replace(/성난태양/g, '알드라치 파괴자');
content = content.replace(/주문술사/g, '지옥상흔');
content = content.replace(/sunfury/g, 'aldrachireaver');
content = content.replace(/spellslinger/g, 'felscarred');
content = content.replace(/Sunfury/g, 'Aldrachi Reaver');
content = content.replace(/Spellslinger/g, 'Fel-Scarred');

// Step 5: 리소스 시스템 교체
console.log('Step 5: 리소스 시스템 교체 중...');
content = content.replace(/비전 충전물/g, '격노');
content = content.replace(/마나/g, '격노');
content = content.replace(/Arcane Charges?/g, 'Fury');
content = content.replace(/Mana/g, 'Fury');

// Step 6: 제목 교체
console.log('Step 6: 제목 교체 중...');
content = content.replace(/비전 마법사/g, '파멸 악마사냥꾼');
content = content.replace(/Arcane Mage/g, 'Havoc Demon Hunter');

// Step 7: 클래스 아이콘 키워드 교체 (classIcons 관련)
console.log('Step 7: 클래스 아이콘 키워드 교체 중...');
content = content.replace(/classIcons\.mage/g, 'classIcons.demonhunter');

// Step 8: 주석 업데이트
console.log('Step 8: 주석 업데이트 중...');
content = content.replace(/\/\/ .*비전 마법사.*/g, '// 파멸 악마사냥꾼');
content = content.replace(/\/\/ .*Arcane Mage.*/g, '// Havoc Demon Hunter');

// 파일 쓰기
fs.writeFileSync(guideFilePath, content, 'utf8');

console.log('\n✅ 교체 완료!');
console.log('📝 다음 단계:');
console.log('1. 영웅 특성 데이터 수동 입력 (알드라치 파괴자, 지옥상흔)');
console.log('2. 티어 세트 데이터 입력');
console.log('3. 스탯 우선순위 입력');
console.log('4. 로테이션 데이터 입력');
console.log('5. npm run build 테스트');
