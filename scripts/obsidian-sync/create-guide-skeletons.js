#!/usr/bin/env node

/**
 * Guide Skeleton Generator
 *
 * Purpose: Create 39 specialization guide skeleton notes in Obsidian
 * Output: WoW-Meta-Knowledge/02-전문화별-가이드/{Class}/{Spec}-Guide.md
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const VAULT_ROOT = path.join(PROJECT_ROOT, 'WoW-Meta-Knowledge');
const GUIDE_FOLDER = path.join(VAULT_ROOT, '02-전문화별-가이드');

// 39 specializations with hero talents
const SPECS = [
  // Warriors (3)
  { class: 'Warriors', classKR: '전사', spec: 'Arms', specKR: '무기', hero1: '거신', hero1EN: 'Colossus', hero2: '학살자', hero2EN: 'Slayer', role: 'Melee DPS' },
  { class: 'Warriors', classKR: '전사', spec: 'Fury', specKR: '분노', hero1: '산왕', hero1EN: 'Mountain Thane', hero2: '학살자', hero2EN: 'Slayer', role: 'Melee DPS' },
  { class: 'Warriors', classKR: '전사', spec: 'Protection', specKR: '방어', hero1: '거신', hero1EN: 'Colossus', hero2: '산왕', hero2EN: 'Mountain Thane', role: 'Tank' },

  // Paladins (3)
  { class: 'Paladins', classKR: '성기사', spec: 'Holy', specKR: '신성', hero1: '빛의 대장장이', hero1EN: 'Lightsmith', hero2: '태양의 사자', hero2EN: 'Herald of the Sun', role: 'Healer' },
  { class: 'Paladins', classKR: '성기사', spec: 'Protection', specKR: '보호', hero1: '빛의 대장장이', hero1EN: 'Lightsmith', hero2: '기사단', hero2EN: 'Templar', role: 'Tank' },
  { class: 'Paladins', classKR: '성기사', spec: 'Retribution', specKR: '징벌', hero1: '기사단', hero1EN: 'Templar', hero2: '태양의 사자', hero2EN: 'Herald of the Sun', role: 'Melee DPS' },

  // Hunters (3)
  { class: 'Hunters', classKR: '사냥꾼', spec: 'BeastMastery', specKR: '야수', hero1: '어둠 순찰자', hero1EN: 'Dark Ranger', hero2: '무리의 지도자', hero2EN: 'Pack Leader', role: 'Ranged DPS' },
  { class: 'Hunters', classKR: '사냥꾼', spec: 'Marksmanship', specKR: '사격', hero1: '어둠 순찰자', hero1EN: 'Dark Ranger', hero2: '파수꾼', hero2EN: 'Sentinel', role: 'Ranged DPS' },
  { class: 'Hunters', classKR: '사냥꾼', spec: 'Survival', specKR: '생존', hero1: '무리의 지도자', hero1EN: 'Pack Leader', hero2: '파수꾼', hero2EN: 'Sentinel', role: 'Melee DPS' },

  // Rogues (3)
  { class: 'Rogues', classKR: '도적', spec: 'Assassination', specKR: '암살', hero1: '운명결속', hero1EN: 'Fatebound', hero2: '죽음추적자', hero2EN: 'Deathstalker', role: 'Melee DPS' },
  { class: 'Rogues', classKR: '도적', spec: 'Outlaw', specKR: '무법', hero1: '기만자', hero1EN: 'Trickster', hero2: '운명결속', hero2EN: 'Fatebound', role: 'Melee DPS' },
  { class: 'Rogues', classKR: '도적', spec: 'Subtlety', specKR: '잠행', hero1: '기만자', hero1EN: 'Trickster', hero2: '죽음추적자', hero2EN: 'Deathstalker', role: 'Melee DPS' },

  // Priests (3)
  { class: 'Priests', classKR: '사제', spec: 'Discipline', specKR: '수양', hero1: '예언자', hero1EN: 'Oracle', hero2: '공허술사', hero2EN: 'Voidweaver', role: 'Healer' },
  { class: 'Priests', classKR: '사제', spec: 'Holy', specKR: '신성', hero1: '예언자', hero1EN: 'Oracle', hero2: '집정관', hero2EN: 'Archon', role: 'Healer' },
  { class: 'Priests', classKR: '사제', spec: 'Shadow', specKR: '암흑', hero1: '집정관', hero1EN: 'Archon', hero2: '공허술사', hero2EN: 'Voidweaver', role: 'Ranged DPS' },

  // Shamans (3)
  { class: 'Shamans', classKR: '주술사', spec: 'Elemental', specKR: '정기', hero1: '선견자', hero1EN: 'Farseer', hero2: '폭풍인도자', hero2EN: 'Stormbringer', role: 'Ranged DPS' },
  { class: 'Shamans', classKR: '주술사', spec: 'Enhancement', specKR: '고양', hero1: '토템술사', hero1EN: 'Totemic', hero2: '폭풍인도자', hero2EN: 'Stormbringer', role: 'Melee DPS' },
  { class: 'Shamans', classKR: '주술사', spec: 'Restoration', specKR: '복원', hero1: '선견자', hero1EN: 'Farseer', hero2: '토템술사', hero2EN: 'Totemic', role: 'Healer' },

  // Mages (3)
  { class: 'Mages', classKR: '마법사', spec: 'Arcane', specKR: '비전', hero1: '성난태양', hero1EN: 'Sunfury', hero2: '주문술사', hero2EN: 'Spellslinger', role: 'Ranged DPS' },
  { class: 'Mages', classKR: '마법사', spec: 'Fire', specKR: '화염', hero1: '성난태양', hero1EN: 'Sunfury', hero2: '서리불꽃', hero2EN: 'Frostfire', role: 'Ranged DPS' },
  { class: 'Mages', classKR: '마법사', spec: 'Frost', specKR: '냉기', hero1: '서리불꽃', hero1EN: 'Frostfire', hero2: '주문술사', hero2EN: 'Spellslinger', role: 'Ranged DPS' },

  // Warlocks (3)
  { class: 'Warlocks', classKR: '흑마법사', spec: 'Affliction', specKR: '고통', hero1: '영혼 수확자', hero1EN: 'Soul Harvester', hero2: '지옥소환사', hero2EN: 'Hellcaller', role: 'Ranged DPS' },
  { class: 'Warlocks', classKR: '흑마법사', spec: 'Demonology', specKR: '악마', hero1: '악마학자', hero1EN: 'Diabolist', hero2: '영혼 수확자', hero2EN: 'Soul Harvester', role: 'Ranged DPS' },
  { class: 'Warlocks', classKR: '흑마법사', spec: 'Destruction', specKR: '파괴', hero1: '악마학자', hero1EN: 'Diabolist', hero2: '지옥소환사', hero2EN: 'Hellcaller', role: 'Ranged DPS' },

  // Monks (3)
  { class: 'Monks', classKR: '수도사', spec: 'Brewmaster', specKR: '양조', hero1: '음영파', hero1EN: 'Shado-Pan', hero2: '조화의 종사', hero2EN: 'Master of Harmony', role: 'Tank' },
  { class: 'Monks', classKR: '수도사', spec: 'Mistweaver', specKR: '운무', hero1: '천신의 대변자', hero1EN: 'Conduit of the Celestials', hero2: '조화의 종사', hero2EN: 'Master of Harmony', role: 'Healer' },
  { class: 'Monks', classKR: '수도사', spec: 'Windwalker', specKR: '풍운', hero1: '천신의 대변자', hero1EN: 'Conduit of the Celestials', hero2: '음영파', hero2EN: 'Shado-Pan', role: 'Melee DPS' },

  // Druids (4)
  { class: 'Druids', classKR: '드루이드', spec: 'Balance', specKR: '조화', hero1: '숲의 수호자', hero1EN: 'Keeper of the Grove', hero2: '엘룬의 대리자', hero2EN: "Elune's Chosen", role: 'Ranged DPS' },
  { class: 'Druids', classKR: '드루이드', spec: 'Feral', specKR: '야성', hero1: '야생추적자', hero1EN: 'Wildstalker', hero2: '발톱의 드루이드', hero2EN: 'Druid of the Claw', role: 'Melee DPS' },
  { class: 'Druids', classKR: '드루이드', spec: 'Guardian', specKR: '수호', hero1: '엘룬의 대리자', hero1EN: "Elune's Chosen", hero2: '발톱의 드루이드', hero2EN: 'Druid of the Claw', role: 'Tank' },
  { class: 'Druids', classKR: '드루이드', spec: 'Restoration', specKR: '회복', hero1: '야생추적자', hero1EN: 'Wildstalker', hero2: '숲의 수호자', hero2EN: 'Keeper of the Grove', role: 'Healer' },

  // Demon Hunters (2)
  { class: 'DemonHunters', classKR: '악마사냥꾼', spec: 'Havoc', specKR: '파멸', hero1: '알드라치 파괴자', hero1EN: 'Aldrachi Reaver', hero2: '지옥상흔', hero2EN: 'Fel-Scarred', role: 'Melee DPS' },
  { class: 'DemonHunters', classKR: '악마사냥꾼', spec: 'Vengeance', specKR: '복수', hero1: '알드라치 파괴자', hero1EN: 'Aldrachi Reaver', hero2: '지옥상흔', hero2EN: 'Fel-Scarred', role: 'Tank' },

  // Death Knights (3)
  { class: 'DeathKnights', classKR: '죽음의 기사', spec: 'Blood', specKR: '혈기', hero1: '산레인', hero1EN: "San'layn", hero2: '죽음인도자', hero2EN: 'Deathbringer', role: 'Tank' },
  { class: 'DeathKnights', classKR: '죽음의 기사', spec: 'Frost', specKR: '냉기', hero1: '종말의 기수', hero1EN: 'Rider of the Apocalypse', hero2: '죽음인도자', hero2EN: 'Deathbringer', role: 'Melee DPS' },
  { class: 'DeathKnights', classKR: '죽음의 기사', spec: 'Unholy', specKR: '부정', hero1: '산레인', hero1EN: "San'layn", hero2: '종말의 기수', hero2EN: 'Rider of the Apocalypse', role: 'Melee DPS' },

  // Evokers (3)
  { class: 'Evokers', classKR: '기원사', spec: 'Devastation', specKR: '황폐', hero1: '불꽃형성자', hero1EN: 'Flameshaper', hero2: '비늘사령관', hero2EN: 'Scalecommander', role: 'Ranged DPS' },
  { class: 'Evokers', classKR: '기원사', spec: 'Preservation', specKR: '보존', hero1: '불꽃형성자', hero1EN: 'Flameshaper', hero2: '시간 감시자', hero2EN: 'Chronowarden', role: 'Healer' },
  { class: 'Evokers', classKR: '기원사', spec: 'Augmentation', specKR: '증강', hero1: '시간 감시자', hero1EN: 'Chronowarden', hero2: '비늘사령관', hero2EN: 'Scalecommander', role: 'Support' }
];

function generateGuideSkeleton(spec) {
  const today = new Date().toISOString().split('T')[0];

  return `---
type: guide
class: ${spec.classKR}
spec: ${spec.specKR}
patch: 11.2
season: TWW Season 3
status: 계획
confidence: 0
role: ${spec.role}
tags:
  - guide
  - ${spec.classKR.replace(/\s+/g, '')}
  - ${spec.specKR}
created: ${today}
updated: ${today}
---

# ${spec.specKR} ${spec.classKR} 가이드

## 📌 가이드 정보

| 항목 | 내용 |
|------|------|
| **전문화** | ${spec.specKR} ${spec.classKR} |
| **패치 버전** | 11.2 |
| **시즌** | TWW Season 3 |
| **난이도** | 미정 |
| **역할** | ${spec.role} |
| **가이드 상태** | 계획 |
| **AI 신뢰도** | 0% |

## 🎭 영웅 특성

### ${spec.hero1}
영웅 특성 설명 작성 예정

**핵심 메커니즘**:
- 메커니즘 1
- 메커니즘 2
- 메커니즘 3

### ${spec.hero2}
영웅 특성 설명 작성 예정

**핵심 메커니즘**:
- 메커니즘 1
- 메커니즘 2
- 메커니즘 3

## ⚔️ 딜사이클 (Rotation)

### 티어 세트 효과

#### 2세트
티어 세트 효과 작성 예정

#### 4세트
티어 세트 효과 작성 예정

### 오프닝

오프닝 로테이션 작성 예정

### 단일 대상 우선순위

우선순위 작성 예정

### 다수 대상 우선순위

우선순위 작성 예정

## 🌟 특성 빌드

### 레이드 빌드 (${spec.hero1})
빌드 코드 작성 예정

### 쐐기돌 빌드 (${spec.hero1})
빌드 코드 작성 예정

## 📊 스탯 우선순위

### ${spec.hero1}
스탯 우선순위 작성 예정

## 🔗 관련 리소스

### 내부 링크
- AI 페르소나: [[${spec.classKR}-${spec.specKR}-Persona]]
- 스킬 목록: [[_SKILL-INDEX#${spec.classKR}]]

### 외부 가이드
- Wowhead, Maxroll, Icy Veins 링크 작성 예정

---

**생성일**: ${today}
**마지막 업데이트**: ${today}
**가이드 버전**: 1.0.0
**검증 상태**: 미검증
`;
}

function createGuideSkeletons() {
  console.log('============================================================');
  console.log('  Guide Skeleton Generator');
  console.log('============================================================\n');

  let successCount = 0;

  for (const spec of SPECS) {
    const classFolder = path.join(GUIDE_FOLDER, spec.class);

    // Ensure class folder exists
    if (!fs.existsSync(classFolder)) {
      fs.mkdirSync(classFolder, { recursive: true });
    }

    const filename = `${spec.spec}-Guide.md`;
    const filePath = path.join(classFolder, filename);
    const markdown = generateGuideSkeleton(spec);

    try {
      fs.writeFileSync(filePath, markdown, 'utf8');
      successCount++;
      console.log(`✅ ${spec.specKR} ${spec.classKR} (${spec.spec})`);
    } catch (error) {
      console.error(`❌ Error: ${filename}`, error.message);
    }
  }

  console.log('\n============================================================');
  console.log(`✅ Created ${successCount}/39 guide skeletons`);
  console.log('============================================================\n');
}

if (require.main === module) {
  createGuideSkeletons();
}

module.exports = { createGuideSkeletons };
