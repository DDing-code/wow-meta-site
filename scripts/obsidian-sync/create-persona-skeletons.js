#!/usr/bin/env node

/**
 * AI Persona Skeleton Generator
 *
 * Purpose: Create 39 AI persona notes with initial state
 * - Level: 1 (초기)
 * - Confidence: 50% (기본)
 * - Experience: 0
 * - Status: 학습 준비
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const VAULT_ROOT = path.join(PROJECT_ROOT, 'WoW-Meta-Knowledge');
const PERSONA_FOLDER = path.join(VAULT_ROOT, '05-AI-페르소나');

// 39 Specializations (from create-guide-skeletons.js)
const SPECS = [
  // Warriors
  { class: 'Warriors', classKR: '전사', spec: 'Arms', specKR: '무기', role: 'Melee DPS' },
  { class: 'Warriors', classKR: '전사', spec: 'Fury', specKR: '분노', role: 'Melee DPS' },
  { class: 'Warriors', classKR: '전사', spec: 'Protection', specKR: '방어', role: 'Tank' },

  // Paladins
  { class: 'Paladins', classKR: '성기사', spec: 'Holy', specKR: '신성', role: 'Healer' },
  { class: 'Paladins', classKR: '성기사', spec: 'Protection', specKR: '보호', role: 'Tank' },
  { class: 'Paladins', classKR: '성기사', spec: 'Retribution', specKR: '징벌', role: 'Melee DPS' },

  // Hunters
  { class: 'Hunters', classKR: '사냥꾼', spec: 'BeastMastery', specKR: '야수', role: 'Ranged DPS' },
  { class: 'Hunters', classKR: '사냥꾼', spec: 'Marksmanship', specKR: '사격', role: 'Ranged DPS' },
  { class: 'Hunters', classKR: '사냥꾼', spec: 'Survival', specKR: '생존', role: 'Melee DPS' },

  // Rogues
  { class: 'Rogues', classKR: '도적', spec: 'Assassination', specKR: '암살', role: 'Melee DPS' },
  { class: 'Rogues', classKR: '도적', spec: 'Outlaw', specKR: '무법', role: 'Melee DPS' },
  { class: 'Rogues', classKR: '도적', spec: 'Subtlety', specKR: '잠행', role: 'Melee DPS' },

  // Priests
  { class: 'Priests', classKR: '사제', spec: 'Discipline', specKR: '수양', role: 'Healer' },
  { class: 'Priests', classKR: '사제', spec: 'Holy', specKR: '신성', role: 'Healer' },
  { class: 'Priests', classKR: '사제', spec: 'Shadow', specKR: '암흑', role: 'Ranged DPS' },

  // Shamans
  { class: 'Shamans', classKR: '주술사', spec: 'Elemental', specKR: '정기', role: 'Ranged DPS' },
  { class: 'Shamans', classKR: '주술사', spec: 'Enhancement', specKR: '고양', role: 'Melee DPS' },
  { class: 'Shamans', classKR: '주술사', spec: 'Restoration', specKR: '복원', role: 'Healer' },

  // Mages
  { class: 'Mages', classKR: '마법사', spec: 'Arcane', specKR: '비전', role: 'Ranged DPS' },
  { class: 'Mages', classKR: '마법사', spec: 'Fire', specKR: '화염', role: 'Ranged DPS' },
  { class: 'Mages', classKR: '마법사', spec: 'Frost', specKR: '냉기', role: 'Ranged DPS' },

  // Warlocks
  { class: 'Warlocks', classKR: '흑마법사', spec: 'Affliction', specKR: '고통', role: 'Ranged DPS' },
  { class: 'Warlocks', classKR: '흑마법사', spec: 'Demonology', specKR: '악마', role: 'Ranged DPS' },
  { class: 'Warlocks', classKR: '흑마법사', spec: 'Destruction', specKR: '파괴', role: 'Ranged DPS' },

  // Monks
  { class: 'Monks', classKR: '수도사', spec: 'Brewmaster', specKR: '양조', role: 'Tank' },
  { class: 'Monks', classKR: '수도사', spec: 'Mistweaver', specKR: '운무', role: 'Healer' },
  { class: 'Monks', classKR: '수도사', spec: 'Windwalker', specKR: '풍운', role: 'Melee DPS' },

  // Druids
  { class: 'Druids', classKR: '드루이드', spec: 'Balance', specKR: '조화', role: 'Ranged DPS' },
  { class: 'Druids', classKR: '드루이드', spec: 'Feral', specKR: '야성', role: 'Melee DPS' },
  { class: 'Druids', classKR: '드루이드', spec: 'Guardian', specKR: '수호', role: 'Tank' },
  { class: 'Druids', classKR: '드루이드', spec: 'Restoration', specKR: '회복', role: 'Healer' },

  // Demon Hunters
  { class: 'DemonHunters', classKR: '악마사냥꾼', spec: 'Havoc', specKR: '파멸', role: 'Melee DPS' },
  { class: 'DemonHunters', classKR: '악마사냥꾼', spec: 'Vengeance', specKR: '복수', role: 'Tank' },

  // Death Knights
  { class: 'DeathKnights', classKR: '죽음의 기사', spec: 'Blood', specKR: '혈기', role: 'Tank' },
  { class: 'DeathKnights', classKR: '죽음의 기사', spec: 'Frost', specKR: '냉기', role: 'Melee DPS' },
  { class: 'DeathKnights', classKR: '죽음의 기사', spec: 'Unholy', specKR: '부정', role: 'Melee DPS' },

  // Evokers
  { class: 'Evokers', classKR: '기원사', spec: 'Devastation', specKR: '황폐', role: 'Ranged DPS' },
  { class: 'Evokers', classKR: '기원사', spec: 'Preservation', specKR: '보존', role: 'Healer' },
  { class: 'Evokers', classKR: '기원사', spec: 'Augmentation', specKR: '증강', role: 'Support' }
];

// ============================================================================
// PERSONA SKELETON GENERATOR
// ============================================================================

function generatePersonaSkeleton(spec) {
  const today = new Date().toISOString().split('T')[0];

  return `---
type: persona
class: ${spec.classKR}
spec: ${spec.specKR}
role: ${spec.role}
level: 1
experience: 0
confidence: 50
status: 학습 준비
tags:
  - ai-persona
  - ${spec.classKR}
  - ${spec.specKR}
created: ${today}
updated: ${today}
---

# ${spec.specKR} ${spec.classKR} AI 페르소나

> **전문화**: [[02-전문화별-가이드/${spec.class}/${spec.specKR}|${spec.specKR}]]
> **역할**: ${spec.role}
> **현재 레벨**: 1 (초기)
> **신뢰도**: 50% (기본)

## 📊 성장 지표

| 지표 | 현재 값 | 목표 |
|------|---------|------|
| **레벨** | 1 | 10 |
| **경험치** | 0 XP | 1000 XP |
| **신뢰도** | 50% | 95% |
| **학습된 스킬** | 0개 | 전체 |
| **분석 완료 로그** | 0개 | 100+ |

## 🎯 학습 목표

### 단기 목표 (레벨 1→3)
- [ ] 핵심 스킬 10개 학습
- [ ] 기본 딜사이클 이해
- [ ] 영웅 특성 2개 비교 분석

### 중기 목표 (레벨 4→6)
- [ ] 전체 스킬 습득
- [ ] 로그 분석 10개 완료
- [ ] 외부 가이드 통합 (Wowhead, Maxroll)

### 장기 목표 (레벨 7→10)
- [ ] 로그 분석 100개 완료
- [ ] 메타 빌드 최적화
- [ ] 신뢰도 95% 달성

## 📚 지식 베이스

### 스킬 데이터베이스
\`\`\`dataview
TABLE koreanName AS "스킬명", tier AS "신뢰도", description AS "설명"
FROM "01-스킬-DB/${spec.class}"
WHERE spec = "${spec.specKR}" OR spec = "공용"
SORT tier ASC, koreanName ASC
\`\`\`

### 관련 가이드
- [[02-전문화별-가이드/${spec.class}/${spec.specKR}|${spec.specKR} 가이드]]

## 🧠 학습 이력

### 경험치 획득 이력
| 날짜 | 활동 | 획득 XP | 총 XP |
|------|------|---------|-------|
| ${today} | 페르소나 초기화 | +0 | 0 |

### 레벨업 이력
| 날짜 | 레벨 | 신뢰도 | 주요 성과 |
|------|------|--------|----------|
| ${today} | 1 | 50% | 페르소나 생성 |

## 💡 인사이트 로그

### 최근 학습 내용
*학습 내용 없음 - 초기 상태*

### 주요 발견사항
*발견사항 없음 - 초기 상태*

## 🔗 연결된 리소스

### 내부 링크
- [[01-스킬-DB/${spec.class}/README|${spec.classKR} 스킬 DB]]
- [[02-전문화별-가이드/${spec.class}/${spec.specKR}|${spec.specKR} 가이드]]
- [[_PERSONA-INDEX|페르소나 랭킹]]

### 외부 리소스
- [Wowhead ${spec.specKR} 가이드](https://www.wowhead.com/guide/classes/${spec.class.toLowerCase()}/${spec.spec.toLowerCase()}/overview-pve-dps)
- [Maxroll ${spec.specKR} 빌드](https://maxroll.gg/wow/class-guides/${spec.class.toLowerCase()}-${spec.spec.toLowerCase()})
- [Icy Veins ${spec.specKR}](https://www.icy-veins.com/wow/${spec.class.toLowerCase()}-${spec.spec.toLowerCase()}-pve-dps-guide)

---

**생성일**: ${today}
**마지막 업데이트**: ${today}
**상태**: 🆕 초기화 완료, 학습 준비
`;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function createPersonaSkeletons() {
  console.log('============================================================');
  console.log('  AI Persona Skeleton Generator');
  console.log('============================================================\n');

  let successCount = 0;

  for (const spec of SPECS) {
    const classFolder = path.join(PERSONA_FOLDER, spec.class);

    // Ensure class folder exists
    if (!fs.existsSync(classFolder)) {
      fs.mkdirSync(classFolder, { recursive: true });
    }

    // Generate filename
    const filename = `${spec.specKR}.md`;
    const filePath = path.join(classFolder, filename);

    // Generate content
    const content = generatePersonaSkeleton(spec);

    // Write file
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${spec.specKR} ${spec.classKR} (${spec.role})`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${spec.specKR} ${spec.classKR}: ${error.message}`);
    }
  }

  console.log('\n============================================================');
  console.log(`✅ Created ${successCount}/${SPECS.length} persona skeletons`);
  console.log('============================================================\n');
}

// Execute
if (require.main === module) {
  createPersonaSkeletons();
}

module.exports = { createPersonaSkeletons };
