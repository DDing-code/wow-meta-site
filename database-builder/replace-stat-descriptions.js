/**
 * replace-stat-descriptions.js
 *
 * 목적: ElementalShamanGuide.js 스탯 섹션에서 마법사 용어를 주술사 용어로 교체
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'ElementalShamanGuide.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔄 스탯 설명 교체 시작...\n');

// 스탯 설명 교체 규칙
const replacements = [
  // Farseer Single Target (Lines 3069-3083)
  {
    from: "note: 'GCD 감소와 비전 작렬 시전 속도 향상, 비전 충전물 빠른 생성'",
    to: "note: 'GCD 감소와 용암 폭발 시전 속도 향상, 원소의 대가 유지 용이'",
    name: 'Farseer Single Haste'
  },
  {
    from: "note: '비전의 여파 발동 확률 간접 증가, 평균 딜 향상'",
    to: "note: '용암 폭발 치명타 확률 증가, 용암 쇄도 프록 활용'",
    name: 'Farseer Single Crit'
  },

  // Farseer AoE (Lines 3091-3105)
  {
    from: "note: '빠른 비전 충전물 생성과 비전 탄막 빈도 증가'",
    to: "note: '빠른 연쇄 번개 시전과 소용돌이 생성 증가'",
    name: 'Farseer AoE Haste'
  },
  {
    from: "note: '광역 비전 스킬 치명타로 폭발 딜 증가'",
    to: "note: '연쇄 번개와 지진 치명타로 광역 딜 증가'",
    name: 'Farseer AoE Crit'
  },
  {
    from: "note: '모든 비전 피해 증가로 광역에서도 높은 가치'",
    to: "note: '모든 원소 피해 증가로 광역에서도 높은 가치'",
    name: 'Farseer AoE Mastery'
  },

  // Stormbringer Single Target (Lines 3115-3129)
  {
    from: "note: '비전 보주 빈도 증가와 즉시 시전 효율 향상, 이동 중 딜 극대화'",
    to: "note: '번개 화살 빈도 증가와 깨어나는 폭풍 중첩 빠른 획득'",
    name: 'Stormbringer Single Haste'
  },
  {
    from: "note: '비전 보주 치명타 확률 증가, 안정적인 평균 딜 향상'",
    to: "note: '전격 방전 치명타 확률 증가, 안정적인 평균 딜 향상'",
    name: 'Stormbringer Single Crit'
  },

  // Stormbringer AoE (Lines 3137-3151)
  {
    from: "note: '최우선 스탯, 비전 보주 빈도와 광역 딜 극대화'",
    to: "note: '최우선 스탯, 전격 방전 빈도와 광역 딜 극대화'",
    name: 'Stormbringer AoE Haste'
  },
  {
    from: "note: '광역 비전 보주 치명타로 폭발 딜 증가'",
    to: "note: '광역 전격 방전 치명타로 폭발 딜 증가'",
    name: 'Stormbringer AoE Crit'
  },
  {
    from: "note: '비전 보주와 비전 탄막 피해 증가'",
    to: "note: '전격 방전과 폭풍 피해 증가'",
    name: 'Stormbringer AoE Mastery'
  }
];

// 각 교체 실행
let totalReplacements = 0;
replacements.forEach(({ from, to, name }) => {
  if (content.includes(from)) {
    content = content.replace(from, to);
    console.log(`✅ ${name}`);
    totalReplacements++;
  } else {
    console.log(`⚠️  ${name} - 원본 문자열 없음`);
  }
});

// 파일 저장
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n✅ 총 ${totalReplacements}개 스탯 설명 교체 완료!`);
console.log(`💾 파일 저장: ${filePath}\n`);
