const fs = require('fs');
const path = require('path');

// 색상 변경 규칙
const colorMappings = [
  {
    file: 'ArcaneMageGuide.js',
    replacements: [
      { from: '#C69B6D', to: '#3FC6EA' },  // 전사 → 마법사
      { from: 'rgba(198, 155, 109, 0.1)', to: 'rgba(63, 198, 234, 0.1)' }  // 전사 hover → 마법사 hover
    ]
  },
  {
    file: 'ElementalShamanGuide.js',
    replacements: [
      { from: '#9482C9', to: '#0080FF' },
      { from: '#AAD372', to: '#0080FF' }
    ]
  },
  {
    file: 'FuryWarriorGuide.js',
    replacements: [
      { from: '#AAD372', to: '#C79C6E' },
      { from: '#9482C9', to: '#C79C6E' },
      { from: '#4ECDC4', to: '#C79C6E' }
    ]
  },
  {
    file: 'DevastationEvokerLayoutIntegrated.js',
    replacements: [
      { from: '#AAD372', to: '#00B4D8' },
      { from: '#8BC34A', to: '#00B4D8' },
      { from: '#7FB347', to: '#00B4D8' }
    ]
  },
  {
    file: 'DemonologyWarlockGuide.js',
    replacements: [
      { from: '#AAD372', to: '#9482C9' }
    ]
  },
  {
    file: 'AfflictionWarlockGuide.js',
    replacements: [
      { from: '#AAD372', to: '#9482C9' }
    ]
  },
  {
    file: 'DestructionWarlockGuide.js',
    replacements: [
      { from: '#AAD372', to: '#9482C9' }
    ]
  }
];

const componentsDir = path.join(__dirname, 'src', 'components');

console.log('🎨 가이드 색상 테마 통일 시작...\n');

colorMappings.forEach(({ file, replacements }) => {
  const filePath = path.join(componentsDir, file);

  try {
    // UTF-8 인코딩으로 파일 읽기
    let content = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;

    // 모든 색상 교체 적용
    replacements.forEach(({ from, to }) => {
      const regex = new RegExp(from, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, to);
        changeCount += matches.length;
        console.log(`  ✓ ${file}: ${from} → ${to} (${matches.length}개)`);
      }
    });

    if (changeCount > 0) {
      // UTF-8 인코딩으로 파일 쓰기
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ ${file}: 총 ${changeCount}개 색상 변경 완료\n`);
    } else {
      console.log(`  ⏭️  ${file}: 변경할 색상 없음\n`);
    }
  } catch (error) {
    console.error(`  ❌ ${file}: 오류 발생 - ${error.message}\n`);
  }
});

console.log('✨ 모든 가이드 색상 테마 통일 완료!');
