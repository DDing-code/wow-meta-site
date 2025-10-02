const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
const content = fs.readFileSync(dbPath, 'utf8');
const lines = content.split('\n');

// Check for various syntax issues
console.log('🔍 문법 오류 검색 중...\n');

// Check for duplicate properties on same line
lines.forEach((line, index) => {
  // Check for properties appearing twice on same line
  if (line.includes('},') && line.includes('"') && !line.includes('//')) {
    console.log(`Line ${index + 1}: Possible error - object close and property on same line`);
    console.log(`  → ${line.trim().substring(0, 80)}...`);
  }

  // Check for missing commas between properties
  if (line.match(/"[^"]+"\s*:\s*"[^"]+"\s+"[^"]+"\s*:/)) {
    console.log(`Line ${index + 1}: Missing comma between properties`);
    console.log(`  → ${line.trim().substring(0, 80)}...`);
  }

  // Check for orphaned properties after object close
  if (line.includes('},') && line.includes('":') && !line.includes('"id"')) {
    console.log(`Line ${index + 1}: Property after object close`);
    console.log(`  → ${line.trim().substring(0, 80)}...`);
  }
});

// Extract problematic segments
console.log('\n🔍 문제 있는 구간 찾기...\n');

const regex = /},\s*"[^"]+"\s*:/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const position = match.index;
  const lineNumber = content.substring(0, position).split('\n').length;
  const context = content.substring(position - 50, position + 100);

  if (!context.includes('"id"')) {
    console.log(`Line ~${lineNumber}: Suspicious pattern`);
    console.log(context.replace(/\n/g, '\\n'));
    console.log('---');
  }
}