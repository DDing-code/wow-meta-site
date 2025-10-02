/**
 * 가짜 설명("특수한 효과를 제공합니다") 제거 스크립트
 */

const fs = require('fs');
const path = require('path');

// JSON 파일 경로
const dataPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');

// JSON 파일 읽기
const descriptions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 통계 초기화
let totalCount = 0;
let fakeCount = 0;
let realCount = 0;
let removedIds = [];

// 남길 데이터만 필터링
const filteredDescriptions = {};

for (const [id, skill] of Object.entries(descriptions)) {
  totalCount++;

  // 설명에 "특수한 효과를 제공합니다" 포함 여부 확인
  if (skill.description && skill.description.includes('특수한 효과를 제공합니다')) {
    fakeCount++;
    removedIds.push(id);
    console.log(`❌ 제거: ID ${id} - ${skill.krName}`);
    // 이 항목은 filteredDescriptions에 추가하지 않음 (제거)
  } else {
    realCount++;
    filteredDescriptions[id] = skill;
    console.log(`✅ 유지: ID ${id} - ${skill.krName}`);
  }
}

// 백업 파일 생성
const backupPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-backup.json');
fs.writeFileSync(backupPath, JSON.stringify(descriptions, null, 2), 'utf8');
console.log(`\n📁 백업 파일 생성: ${backupPath}`);

// 필터링된 데이터 저장
fs.writeFileSync(dataPath, JSON.stringify(filteredDescriptions, null, 2), 'utf8');

// 결과 출력
console.log('\n===== 가짜 설명 제거 완료 =====');
console.log(`📊 전체 스킬: ${totalCount}개`);
console.log(`❌ 제거된 가짜 설명: ${fakeCount}개`);
console.log(`✅ 남은 실제 설명: ${realCount}개`);
console.log(`\n제거된 스킬 ID: ${removedIds.slice(0, 10).join(', ')}${removedIds.length > 10 ? ` 외 ${removedIds.length - 10}개` : ''}`);
console.log(`📁 저장 위치: src/data/wowhead-full-descriptions-complete.json`);