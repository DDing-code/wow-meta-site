const fs = require('fs');
const path = require('path');

// 제거할 중복 ID (나중 것 유지)
const toRemove = ["46924","12294","1464","5176","187827","1752","152280","1329","199921","34026","29725","30108","1943","115181","353759","366155","23920","82326","264057","363534"];

const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let content = fs.readFileSync(dbPath, 'utf8');

toRemove.forEach(id => {
  const regex = new RegExp(`\\s*"${id}":\\s*{[^}]*},?\\n`, 'g');
  content = content.replace(regex, '');
});

fs.writeFileSync(dbPath, content, 'utf8');
console.log(`✅ ${toRemove.length}개 중복 제거`);