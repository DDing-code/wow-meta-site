# 🎯 WoW 스킬 아이콘 매핑 필수 참조 문서

> ⚠️ **이 문서는 가이드 JSON 작성/수정 시 반드시 참조해야 합니다!**
> 
> 아이콘명이 틀리면 물음표(?)가 표시되거나 다른 스킬 아이콘이 표시됩니다.

---

## 📋 아이콘 URL 형식

```
https://wow.zamimg.com/images/wow/icons/{size}/{icon_name}.jpg
```

- size: `small`, `medium`, `large`
- icon_name: 아래 표 참조 (대소문자 구분 없음, 언더스코어 필수)

---

## 🔧 아이콘 조회 스크립트

```bash
# Wowhead API를 통한 아이콘 조회
node scripts/wowhead-icon-mapper.js <spellId>

# 여러 스킬 일괄 조회
node scripts/wowhead-icon-mapper.js 204596 198013 188499
```

---

## 🗡️ 악마사냥꾼 (Demon Hunter) 아이콘 매핑

### ⚔️ 핵심 전투 스킬 (Wowhead API 검증됨 ✅)

| 한글명 | 영문명 | Spell ID | 아이콘 파일명 | 비고 |
|--------|--------|----------|---------------|------|
| 악마의 이빨 | Demon's Bite | 162243 | `inv_weapon_glave_01` | ✅ 기본 공격 |
| 혼돈의 일격 | Chaos Strike | 162794 | `ability_demonhunter_chaosstrike` | ✅ |
| 파멸 | Annihilation | 201427 | `inv_glaive_1h_npc_d_02` | ✅ 탈태 변형 (다른 아이콘!) |
| 칼춤 | Blade Dance | 188499 | `ability_demonhunter_bladedance` | ✅ |
| 죽음의 휩쓸기 | Death Sweep | 210152 | `inv_glaive_1h_artifactaldrochi_d_02dual` | ✅ 탈태 변형 (다른 아이콘!) |
| 안광 | Eye Beam | 198013 | `ability_demonhunter_eyebeam` | ✅ |
| 정수 파쇄 | Essence Break | 258860 | `spell_shadow_ritualofsacrifice` | ✅ |
| 탈태 | Metamorphosis | 191427 | `ability_demonhunter_metamorphasisdps` | ✅ |
| 제물의 오라 | Immolation Aura | 258920 | `ability_demonhunter_immolation` | ✅ |

### 🏃 이동기 및 유틸리티 (Wowhead API 검증됨 ✅)

| 한글명 | 영문명 | Spell ID | 아이콘 파일명 | 비고 |
|--------|--------|----------|---------------|------|
| 지옥 돌진 | Fel Rush | 195072 | `ability_demonhunter_felrush` | ✅ |
| 복수의 퇴각 | Vengeful Retreat | 198793 | `ability_demonhunter_vengefulretreat2` | ✅ |
| 지옥칼 | Felblade | 232893 | `ability_demonhunter_felblade` | ✅ |
| 글레이브 투척 | Throw Glaive | 185123 | `ability_demonhunter_throwglaive` | ✅ |
| 사냥 | The Hunt | 323639 | `ability_ardenweald_demonhunter` | ✅ |

### 🔮 인장 스킬 (Wowhead API 검증됨 ✅)

| 한글명 | 영문명 | Spell ID | 아이콘 파일명 | 비고 |
|--------|--------|----------|---------------|------|
| 불꽃의 인장 | Sigil of Flame | 204596 | `ability_demonhunter_sigilofinquisition` | ⚠️ sigilofflame 존재안함! |
| 원한의 인장 | Sigil of Misery | 207684 | `ability_demonhunter_sigilofmisery` | ✅ |
| 악의의 인장 | Sigil of Spite | 388113 | `spell_shadow_shadesofdarkness` | ✅ |
| 파멸의 인장 | Sigil of Doom | 452490 | `ability_bossfelorcs_necromancer_red` | ✅ Fel-Scarred |
| 불의낙인 | Fiery Brand | 204021 | `ability_demonhunter_fierybrand` | ✅ |

### 🛡️ TWW 알드라치 파괴자 영웅 특성 (Wowhead API 검증됨 ✅)

| 한글명 | 영문명 | Spell ID | 아이콘 파일명 | 비고 |
|--------|--------|----------|---------------|------|
| 파괴자의 글레이브 | Reaver's Glaive | 442294 | `inv_ability_aldrachireaverdemonhunter_reaversglaive` | ✅ TWW 아이콘 |
| 전투의 전율 | Thrill of the Fight | 442688 | `spell_mage_overpowered` | 마법사 아이콘 재사용 |
| 파괴자의 징표 | Reaver's Mark | 442624 | `ability_hunter_harass` | 사냥꾼 아이콘 재사용 |
| 알드라치의 격노 | Fury of the Aldrachi | 444806 | `ability_glaivetoss` | ✅ |

### 😈 TWW 지옥상흔 영웅 특성 (Wowhead API 검증됨 ✅)

| 한글명 | 영문명 | Spell ID | 아이콘 파일명 | 비고 |
|--------|--------|----------|---------------|------|
| 악마쇄도 | Demonsurge | 452402 | `inv_ability_felscarreddemonhunter_demonsurge` | ✅ TWW 아이콘 |

---

## ❌ 존재하지 않는 아이콘 (주의!)

다음 아이콘 이름들은 Wowhead CDN에 **존재하지 않습니다**:

| 잘못된 아이콘 이름 | 올바른 대체 아이콘 |
|-------------------|-------------------|
| `ability_demonhunter_sigilofflame` | `ability_demonhunter_sigilofinquisition` |
| `ability_demonhunter_annihilation` | `inv_glaive_1h_npc_d_02` |
| `ability_demonhunter_essencebreak` | `spell_shadow_ritualofsacrifice` |
| `ability_demonhunter_demonsbite` | `inv_weapon_glave_01` |
| `ability_demonhunter_vengefulretreat` | `ability_demonhunter_vengefulretreat2` |

---

## 🔍 아이콘 확인 방법

1. **Wowhead Tooltip API** (가장 정확):
   ```bash
   curl "https://nether.wowhead.com/tooltip/spell/{spellId}?dataEnv=1&locale=0" | grep -o '"icon":"[^"]*"'
   ```

2. **Wowpedia 아이콘 카테고리**: 
   https://wowpedia.fandom.com/wiki/Category:WoW_Icons:_Ability_DemonHunter

3. **직접 테스트**: 
   `https://wow.zamimg.com/images/wow/icons/large/[icon_name].jpg`

---

## 📂 관련 파일

- `src/data/guides/demonHunterIcons.js` - 악마사냥꾼 아이콘 매핑
- `src/data/iconMapping.json` - 전역 Spell ID → 아이콘 매핑
- `src/utils/iconMappingData.js` - 클래스별 아이콘 매핑
- `scripts/wowhead-icon-mapper.js` - 아이콘 조회 유틸리티

---

## 📝 JSON 작성 시 체크리스트

- [ ] 모든 스킬의 `icon` 필드가 이 문서의 "검증됨" 아이콘과 일치하는가?
- [ ] Spell ID가 올바른가? (Wowhead에서 확인)
- [ ] TWW 영웅 특성 아이콘은 새로운 TWW 아이콘을 사용하고 있는가?
- [ ] 브라우저에서 아이콘 URL을 직접 열어 확인했는가?
- [ ] 물음표 아이콘이 나타나면 이 문서의 대체 아이콘으로 수정했는가?

---

*최종 업데이트: 2025-12-01*
*검증 방법: Wowhead Tooltip API (nether.wowhead.com)*
