#!/usr/bin/env node

/**
 * Knowledge Base 폴더 구조 생성 스크립트
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const KNOWLEDGE_BASE = path.join(PROJECT_ROOT, 'knowledge-base');

const FOLDERS = [
  'Skills',
  'Rotations',
  'Stats',
  'Builds',
  'Mechanics',
  'Sources',
  'Conflicts'
];

console.log('============================================================');
console.log('  Knowledge Base 폴더 구조 생성');
console.log('============================================================\n');

// knowledge-base 생성
if (!fs.existsSync(KNOWLEDGE_BASE)) {
  fs.mkdirSync(KNOWLEDGE_BASE);
  console.log('✅ knowledge-base/ 생성');
} else {
  console.log('⚠️  knowledge-base/ 이미 존재');
}

// 하위 폴더 생성
for (const folder of FOLDERS) {
  const folderPath = path.join(KNOWLEDGE_BASE, folder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ ${folder}/ 생성`);
  } else {
    console.log(`⚠️  ${folder}/ 이미 존재`);
  }
}

console.log('\n============================================================');
console.log('✅ Knowledge Base 폴더 구조 생성 완료');
console.log(`📂 경로: ${KNOWLEDGE_BASE}`);
console.log('============================================================\n');
