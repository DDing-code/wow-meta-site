const fs = require('fs');
const path = require('path');

// 데이터 파일 읽기
const dataPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const skills = Object.values(data);
console.log('📊 Total skills:', skills.length);

// 분석
const genericDescriptions = skills.filter(s =>
    s.description && s.description.includes('클래스의 스킬입니다')
);

const goodDescriptions = skills.filter(s =>
    s.description &&
    !s.description.includes('클래스의 스킬입니다') &&
    s.description.length > 20
);

const noDescriptions = skills.filter(s => !s.description || s.description.trim() === '');

console.log('❌ Generic descriptions:', genericDescriptions.length);
console.log('✅ Good descriptions:', goodDescriptions.length);
console.log('❓ No descriptions:', noDescriptions.length);

// 샘플 출력
if (genericDescriptions.length > 0) {
    console.log('\n📝 Sample generic descriptions (first 5):');
    genericDescriptions.slice(0, 5).forEach(s => {
        console.log(`  - ${s.krName || s.name} (${s.id}): "${s.description}"`);
    });
}