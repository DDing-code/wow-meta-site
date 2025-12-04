/**
 * SimulationCraft APL (Action Priority List) Parser
 *
 * Purpose: Convert SimC APL files to Korean guide rotation data
 * Input: demonhunter_havoc.simc (363 lines)
 * Output: rotations.js compatible JSON
 *
 * Key Features:
 * - Parse action priority lists
 * - Extract conditions (buff/cooldown/resource/target)
 * - Map to Korean translations
 * - Preserve priority order
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════
// 1. Condition Mapping Database (Korean Translations)
// ═══════════════════════════════════════════════════════════════════

const conditionMap = {
  // ────────────────────────────────────────────────────────────────
  // 버프 (Buffs)
  // ────────────────────────────────────────────────────────────────
  'buff.metamorphosis.up': '탈태 변신 활성화',
  'buff.metamorphosis.down': '탈태 변신 비활성화',
  'buff.metamorphosis.remains': '탈태 변신 남은 시간',
  'buff.inner_demon.up': '내면의 악마 활성화',
  'buff.inner_demon.down': '내면의 악마 비활성화',
  'buff.initiative.up': '선제 공격 활성화',
  'buff.initiative.remains': '선제 공격 남은 시간',
  'buff.rending_strike.up': '찢어발기기 활성화',
  'buff.rending_strike.down': '찢어발기기 비활성화',
  'buff.glaive_flurry.up': '글레이브 광란 활성화',
  'buff.glaive_flurry.down': '글레이브 광란 비활성화',
  'buff.thrill_of_the_fight_damage.up': '전투의 전율 피해 활성화',
  'buff.thrill_of_the_fight_damage.remains': '전투의 전율 피해 남은 시간',
  'buff.unbound_chaos.up': '결속되지 않은 혼돈 활성화',
  'buff.unbound_chaos.down': '결속되지 않은 혼돈 비활성화',
  'buff.inertia_trigger.up': '관성 발동 활성화',
  'buff.inertia_trigger.down': '관성 발동 비활성화',
  'buff.inertia.up': '관성 활성화',
  'buff.inertia.down': '관성 비활성화',
  'buff.fel_barrage.up': '지옥 난사 활성화',
  'buff.fel_barrage.down': '지옥 난사 비활성화',
  'buff.fel_barrage.remains': '지옥 난사 남은 시간',
  'buff.necessary_sacrifice.up': '필수 희생 활성화',
  'buff.necessary_sacrifice.remains': '필수 희생 남은 시간',
  'buff.necessary_sacrifice.stack': '필수 희생 중첩',
  'buff.tactical_retreat.up': '전술적 후퇴 활성화',
  'buff.immolation_aura.stack': '불타는 오라 중첩',
  'buff.out_of_range.up': '사거리 밖',
  'buff.out_of_range.down': '사거리 안',
  'buff.out_of_range.remains': '사거리 밖 남은 시간',
  'buff.cycle_of_hatred.stack': '증오의 순환 중첩',

  // ────────────────────────────────────────────────────────────────
  // 쿨다운 (Cooldowns)
  // ────────────────────────────────────────────────────────────────
  'cooldown.eye_beam.remains': '안광 쿨다운 남은 시간',
  'cooldown.eye_beam.up': '안광 쿨다운 완료',
  'cooldown.blade_dance.remains': '칼춤 쿨다운 남은 시간',
  'cooldown.blade_dance.up': '칼춤 쿨다운 완료',
  'cooldown.metamorphosis.remains': '탈태 변신 쿨다운 남은 시간',
  'cooldown.metamorphosis.up': '탈태 변신 쿨다운 완료',
  'cooldown.essence_break.remains': '정수 붕괴 쿨다운 남은 시간',
  'cooldown.essence_break.up': '정수 붕괴 쿨다운 완료',
  'cooldown.vengeful_retreat.remains': '복수의 후퇴 쿨다운 남은 시간',
  'cooldown.vengeful_retreat.up': '복수의 후퇴 쿨다운 완료',
  'cooldown.fel_barrage.remains': '지옥 난사 쿨다운 남은 시간',
  'cooldown.fel_barrage.up': '지옥 난사 쿨다운 완료',
  'cooldown.felblade.up': '지옥칼날 쿨다운 완료',
  'cooldown.the_hunt.remains': '사냥 쿨다운 남은 시간',
  'cooldown.sigil_of_flame.remains': '화염의 인장 쿨다운 남은 시간',

  // ────────────────────────────────────────────────────────────────
  // 자원 (Resources)
  // ────────────────────────────────────────────────────────────────
  'fury': '격노',
  'fury.deficit': '격노 부족',
  'fury>=30': '격노 30 이상',
  'fury>=40': '격노 40 이상',
  'fury>=70': '격노 70 이상',
  'fury>100': '격노 100 초과',
  'fury.deficit>=40': '격노 부족 40 이상',
  'soul_fragments.total>0': '영혼 조각 존재',

  // ────────────────────────────────────────────────────────────────
  // 디버프 (Debuffs)
  // ────────────────────────────────────────────────────────────────
  'debuff.reavers_mark.remains': '파괴자의 낙인 남은 시간',
  'debuff.reavers_mark.up': '파괴자의 낙인 활성화',
  'debuff.essence_break.up': '정수 붕괴 디버프 활성화',
  'debuff.essence_break.down': '정수 붕괴 디버프 비활성화',
  'debuff.essence_break.remains': '정수 붕괴 디버프 남은 시간',
  'debuff.burning_wound.remains': '타오르는 상처 남은 시간',
  'active_dot.burning_wound': '타오르는 상처 적용된 적',

  // ────────────────────────────────────────────────────────────────
  // 타겟 & 전투 (Targets & Combat)
  // ────────────────────────────────────────────────────────────────
  'active_enemies': '활성 적',
  'active_enemies>1': '적 2+ 타겟',
  'active_enemies>2': '적 3+ 타겟',
  'active_enemies>=2': '적 2+ 타겟',
  'active_enemies>=3': '적 3+ 타겟',
  'active_enemies>desired_targets': '원하는 타겟 수 초과',
  'desired_targets': '원하는 타겟 수',
  'spell_targets': '스킬 타겟 수',
  'time>4': '전투 시간 4초 초과',
  'time>10': '전투 시간 10초 초과',
  'time>15': '전투 시간 15초 초과',
  'time>20': '전투 시간 20초 초과',
  'time<15': '전투 시간 15초 미만',
  'time<20': '전투 시간 20초 미만',
  'fight_remains': '전투 남은 시간',
  'fight_remains<5': '전투 5초 미만 남음',
  'fight_remains<10': '전투 10초 미만 남음',
  'fight_remains<15': '전투 15초 미만 남음',
  'fight_remains<20': '전투 20초 미만 남음',
  'fight_remains<30': '전투 30초 미만 남음',
  'target.time_to_die': '타겟 사망 시간',
  'target.health.pct': '타겟 체력 퍼센트',
  'target.is_boss': '타겟이 보스',

  // ────────────────────────────────────────────────────────────────
  // GCD & 시전 (GCD & Casting)
  // ────────────────────────────────────────────────────────────────
  'gcd.max': 'GCD 최대값',
  'gcd.remains': 'GCD 남은 시간',
  'gcd.remains<0.1': 'GCD 0.1초 미만',
  'gcd.remains<0.2': 'GCD 0.2초 미만',
  'gcd.remains<0.3': 'GCD 0.3초 미만',
  'gcd.remains=0': 'GCD 완료',
  'prev_gcd.1.death_sweep': '직전 GCD 죽음의 휩쓸기',
  'prev_gcd.2.death_sweep': '2회 전 GCD 죽음의 휩쓸기',
  'prev_gcd.3.death_sweep': '3회 전 GCD 죽음의 휩쓸기',

  // ────────────────────────────────────────────────────────────────
  // 특성 (Talents)
  // ────────────────────────────────────────────────────────────────
  'talent.initiative': '선제 공격 특성',
  'talent.essence_break': '정수 붕괴 특성',
  'talent.inertia': '관성 특성',
  'talent.momentum': '기세 특성',
  'talent.blind_fury': '맹목적 격노 특성',
  'talent.demon_blades': '악마 칼날 특성',
  'talent.fel_barrage': '지옥 난사 특성',
  'talent.chaotic_transformation': '혼돈의 변신 특성',
  'talent.cycle_of_hatred': '증오의 순환 특성',
  'talent.shattered_destiny': '산산이 부서진 운명 특성',
  'talent.restless_hunter': '끈질긴 사냥꾼 특성',
  'talent.tactical_retreat': '전술적 후퇴 특성',
  'talent.burning_wound': '타오르는 상처 특성',
  'talent.ragefire': '분노의 불길 특성',
  'talent.a_fire_inside': '내면의 불길 특성',
  'talent.furious_throws': '격분한 투척 특성',
  'talent.soulscar': '영혼의 상처 특성',
  'talent.chaos_fragments': '혼돈 조각 특성',
  'talent.flames_of_fury': '격노의 화염 특성',
  'talent.looks_can_kill': '시선은 살인 특성',
  'talent.quickened_sigils': '신속한 인장 특성',
  'talent.student_of_suffering': '고통의 학도 특성',

  // ────────────────────────────────────────────────────────────────
  // 세트 보너스 (Set Bonuses)
  // ────────────────────────────────────────────────────────────────
  'set_bonus.thewarwithin_season_2_4pc': 'TWW 시즌2 4세트',
  'set_bonus.thewarwithin_season_3_2pc': 'TWW 시즌3 2세트',

  // ────────────────────────────────────────────────────────────────
  // 변수 (Variables)
  // ────────────────────────────────────────────────────────────────
  'variable.fury_gen': '격노 생성량',
  'variable.trinket1_steroids': '장신구1 스테로이드',
  'variable.trinket2_steroids': '장신구2 스테로이드',
  'variable.double_on_use': '이중 사용 장신구',
  'variable.fel_barrage': '지옥 난사 변수',
  'variable.rg_ds': 'RG/DS 변수',
  'variable.rg_inc': 'RG 증가 변수',
  'variable.tier33_4piece': '티어33 4세트 변수',
  'variable.special_trinket': '특수 장신구 변수',

  // ────────────────────────────────────────────────────────────────
  // 장신구 (Trinkets)
  // ────────────────────────────────────────────────────────────────
  'trinket.1.cooldown.remains': '장신구1 쿨다운 남은 시간',
  'trinket.2.cooldown.remains': '장신구2 쿨다운 남은 시간',
  'trinket.1.has_cooldown': '장신구1 쿨다운 존재',
  'trinket.2.has_cooldown': '장신구2 쿨다운 존재',

  // ────────────────────────────────────────────────────────────────
  // 액션 (Actions)
  // ────────────────────────────────────────────────────────────────
  'action.immolation_aura.charges': '불타는 오라 충전',
  'action.immolation_aura.recharge_time': '불타는 오라 재충전 시간',
  'action.reavers_glaive.last_used': '파괴자의 글레이브 마지막 사용',
  'full_recharge_time': '완전 재충전 시간',
  'recharge_time': '재충전 시간',
  'charges': '충전 횟수',
  'charges=2': '충전 2회',
  'charges_fractional>1.01': '충전 1회 이상',

  // ────────────────────────────────────────────────────────────────
  // 기타 (Misc)
  // ────────────────────────────────────────────────────────────────
  'raid_event.adds.in': '쫄 등장 시간',
  'raid_event.adds.up': '쫄 등장 중',
  'raid_event.adds.remains': '쫄 남은 시간',
  'raid_event.adds.count': '쫄 개수',
  'raid_event.adds.exists': '쫄 존재',
  'use_off_gcd': 'GCD 무시 사용',
  'line_cd': '라인 쿨다운',
  'equipped': '장착',
  'hero_tree.aldrachi_reaver': '영웅 특성 알드라치 파괴자',
  'hero_tree.felscarred': '영웅 특성 지옥상흔',
};

// ═══════════════════════════════════════════════════════════════════
// 2. Skill Name Mapping (Korean Translations)
// ═══════════════════════════════════════════════════════════════════

const skillMap = {
  // 주요 스킬
  'eye_beam': '안광',
  'blade_dance': '칼춤',
  'death_sweep': '죽음의 휩쓸기',
  'chaos_strike': '혼돈 일격',
  'annihilation': '소멸',
  'metamorphosis': '탈태 변신',
  'vengeful_retreat': '복수의 후퇴',
  'fel_rush': '지옥 돌진',
  'felblade': '지옥칼날',
  'essence_break': '정수 붕괴',
  'reavers_glaive': '파괴자의 글레이브',
  'the_hunt': '사냥',
  'immolation_aura': '불타는 오라',
  'sigil_of_flame': '화염의 인장',
  'sigil_of_spite': '악의의 인장',
  'glaive_tempest': '글레이브 폭풍',
  'throw_glaive': '글레이브 투척',
  'demons_bite': '악마의 이빨',
  'fel_barrage': '지옥 난사',
  'chaos_nova': '혼돈 폭발',
  'disrupt': '교란',
  'pick_up_fragment': '조각 획득',
  'potion': '물약',
  'auto_attack': '자동 공격',
  'arcane_torrent': '비전 격류',

  // 특수
  'use_item': '아이템 사용',
  'invoke_external_buff': '외부 버프',
  'variable': '변수',
  'run_action_list': '액션 리스트 실행',
  'call_action_list': '액션 리스트 호출',
  'retarget_auto_attack': '자동 공격 대상 변경',
  'cycling_variable': '순환 변수',
};

// ═══════════════════════════════════════════════════════════════════
// 3. APL Parser Class
// ═══════════════════════════════════════════════════════════════════

class SimCAPLParser {
  constructor() {
    this.actions = {
      precombat: [],
      main: [],
      opener: [],
      meta: [],  // Metamorphosis
      fel_barrage: [],
      cooldown: [],
    };
  }

  /**
   * Parse SimC APL file
   * @param {string} filePath - Path to .simc file
   * @returns {Object} Parsed action data
   */
  parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Skip comments and empty lines
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#') || trimmedLine === '') return;

      // Parse action lines (actions.ar+=/skill,if=conditions)
      const actionMatch = trimmedLine.match(/^actions\.([^=]+)\+=\/(.+)$/);
      if (actionMatch) {
        const section = actionMatch[1];  // ar, ar_meta, ar_opener, etc.
        const actionString = actionMatch[2];  // skill,if=conditions

        const parsedAction = this.parseAction(actionString, index + 1);
        if (parsedAction) {
          this.categorizeAction(section, parsedAction);
        }
      }
    });

    return this.actions;
  }

  /**
   * Parse single action line
   * @param {string} actionString - "skill_name,if=condition1&condition2"
   * @param {number} lineNumber - Line number in file
   * @returns {Object} Parsed action object
   */
  parseAction(actionString, lineNumber) {
    // Split by comma (skill,if=conditions,target_if=...)
    const parts = actionString.split(',');
    const skillName = parts[0].trim();

    // Extract skill (Korean)
    const skillKorean = skillMap[skillName] || skillName;

    // Extract conditions
    let conditions = [];
    let targetCondition = null;

    parts.slice(1).forEach(part => {
      if (part.startsWith('if=')) {
        const conditionString = part.substring(3);
        conditions = this.parseConditions(conditionString);
      } else if (part.startsWith('target_if=')) {
        const targetString = part.substring(10);
        targetCondition = this.translateCondition(targetString);
      }
    });

    return {
      skill: skillName,
      skillKorean: skillKorean,
      conditions: conditions,
      targetCondition: targetCondition,
      lineNumber: lineNumber,
      raw: actionString
    };
  }

  /**
   * Parse complex condition string
   * @param {string} conditionString - "buff.meta.up&fury>=40|cooldown.eb.remains<5"
   * @returns {Array} Array of Korean conditions
   */
  parseConditions(conditionString) {
    // Split by & (AND) and | (OR)
    // For now, simplified: split by & only
    const parts = conditionString.split('&');

    return parts.map(part => {
      // Remove negation (!)
      const isNegation = part.trim().startsWith('!');
      const cleanPart = part.trim().replace(/^!/, '');

      // Translate
      let translated = this.translateCondition(cleanPart);

      // Add negation
      if (isNegation) {
        translated = `${translated} 아님`;
      }

      return translated;
    }).filter(Boolean);
  }

  /**
   * Translate single condition to Korean
   * @param {string} condition - "buff.metamorphosis.up"
   * @returns {string} Korean translation
   */
  translateCondition(condition) {
    // Check exact match first
    if (conditionMap[condition]) {
      return conditionMap[condition];
    }

    // Check partial matches (e.g., "buff.metamorphosis.remains>5" → "탈태 변신 남은 시간 > 5초")
    for (const [key, value] of Object.entries(conditionMap)) {
      if (condition.includes(key)) {
        // Extract operator and value (e.g., ">5" from "buff.meta.remains>5")
        const suffix = condition.replace(key, '').trim();
        if (suffix) {
          return `${value} ${suffix}`;
        }
        return value;
      }
    }

    // Fallback: return as-is with warning
    console.warn(`⚠️  Untranslated condition: "${condition}"`);
    return condition;
  }

  /**
   * Categorize action into appropriate section
   * @param {string} section - "ar", "ar_meta", "ar_opener", etc.
   * @param {Object} action - Parsed action object
   */
  categorizeAction(section, action) {
    if (section === 'ar' || section === 'fs') {
      this.actions.main.push(action);
    } else if (section.includes('opener')) {
      this.actions.opener.push(action);
    } else if (section.includes('meta')) {
      this.actions.meta.push(action);
    } else if (section.includes('fel_barrage')) {
      this.actions.fel_barrage.push(action);
    } else if (section.includes('cooldown')) {
      this.actions.cooldown.push(action);
    } else if (section.includes('precombat')) {
      this.actions.precombat.push(action);
    }
  }

  /**
   * Convert parsed actions to rotations.js format
   * @returns {Object} Guide-compatible rotation data
   */
  toGuideFormat() {
    return {
      opener: this.actions.opener.map((action, index) => ({
        priority: index,
        skill: action.skillKorean,
        skillId: action.skill,
        conditions: action.conditions,
        targetCondition: action.targetCondition,
        why: `SimC APL Line ${action.lineNumber}에서 추출`
      })),
      priority: this.actions.main.map((action, index) => ({
        priority: index,
        skill: action.skillKorean,
        skillId: action.skill,
        conditions: action.conditions,
        targetCondition: action.targetCondition,
        why: `SimC APL Line ${action.lineNumber}에서 추출`
      })),
      meta: this.actions.meta.map((action, index) => ({
        priority: index,
        skill: action.skillKorean,
        skillId: action.skill,
        conditions: action.conditions,
        targetCondition: action.targetCondition,
        why: `탈태 변신 중 사용 (SimC APL Line ${action.lineNumber})`
      }))
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// 4. Main Execution
// ═══════════════════════════════════════════════════════════════════

function main() {
  const aplPath = path.join(__dirname, '../../simc/ActionPriorityLists/default/demonhunter_havoc.simc');
  const outputPath = path.join(__dirname, '../src/data/guides/havoc-demonhunter/rotations_simc.json');

  console.log('════════════════════════════════════════════════════════════');
  console.log('  SimC APL Parser - Havoc Demon Hunter');
  console.log('════════════════════════════════════════════════════════════\n');

  // Parse APL file
  console.log(`📂 Reading: ${aplPath}`);
  const parser = new SimCAPLParser();
  const actions = parser.parseFile(aplPath);

  // Statistics
  console.log('\n📊 Parsing Results:');
  console.log(`  - Precombat actions: ${actions.precombat.length}`);
  console.log(`  - Opener actions: ${actions.opener.length}`);
  console.log(`  - Main rotation: ${actions.main.length}`);
  console.log(`  - Meta (Metamorphosis): ${actions.meta.length}`);
  console.log(`  - Fel Barrage: ${actions.fel_barrage.length}`);
  console.log(`  - Cooldowns: ${actions.cooldown.length}`);
  console.log(`  - Total actions: ${Object.values(actions).reduce((sum, arr) => sum + arr.length, 0)}`);

  // Convert to guide format
  const guideData = parser.toGuideFormat();

  // Save JSON
  fs.writeFileSync(outputPath, JSON.stringify(guideData, null, 2), 'utf-8');
  console.log(`\n✅ Saved: ${outputPath}`);

  // Sample output (first 3 priority actions)
  console.log('\n📋 Sample Priority (First 3):');
  guideData.priority.slice(0, 3).forEach((action, index) => {
    console.log(`\n${index + 1}. ${action.skill} (${action.skillId})`);
    console.log(`   Conditions: ${action.conditions.join(', ')}`);
    if (action.targetCondition) {
      console.log(`   Target: ${action.targetCondition}`);
    }
  });

  console.log('\n════════════════════════════════════════════════════════════\n');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { SimCAPLParser, conditionMap, skillMap };
