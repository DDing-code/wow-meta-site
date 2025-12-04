/**
 * FrostDeathKnightGuide.js에 냉기 죽음의 기사 콘텐츠 주입
 * getHeroContent 함수 전체 교체
 */

const fs = require('fs');
const path = require('path');

const guideFilePath = path.join(__dirname, '../src/components/FrostDeathKnightGuide.js');
const contentFilePath = path.join(__dirname, 'frost-dk-hero-content.js');

console.log('냉기 죽음의 기사 콘텐츠 주입 시작...\n');

// 1. 파일 읽기
let guideContent = fs.readFileSync(guideFilePath, 'utf-8');
const heroContentTemplate = require(contentFilePath);

console.log('✅ 파일 읽기 완료');

// 2. getHeroContent 함수 찾기 (Line 280-850 범위)
const getHeroContentStart = guideContent.indexOf('const getHeroContent = (SkillIcon) => ({');
const getHeroContentEnd = guideContent.indexOf('});', getHeroContentStart) + 3; // '});' 포함

if (getHeroContentStart === -1) {
  console.error('❌ getHeroContent 함수를 찾을 수 없습니다.');
  process.exit(1);
}

console.log(`✅ getHeroContent 함수 위치 확인: ${getHeroContentStart}~${getHeroContentEnd}`);

// 3. 기존 함수 교체
const before = guideContent.substring(0, getHeroContentStart);
const after = guideContent.substring(getHeroContentEnd);

guideContent = before + heroContentTemplate.trim() + '\n' + after;

console.log('✅ getHeroContent 함수 교체 완료');

// 4. 파일 저장
fs.writeFileSync(guideFilePath, guideContent, 'utf-8');

console.log(`\n✅ 냉기 죽음의 기사 콘텐츠 주입 완료!`);
console.log(`파일: ${guideFilePath}`);
console.log(`\n다음 단계: node scripts/validate-guide-creation.js --phase during`);
