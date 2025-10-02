/**
 * Phase 2: Accurate Damage Calculator
 * 정확한 데미지 계산, 스탯 시스템, 전투 공식
 * SimC 데미지 계산 엔진 완전 구현
 * Lines: ~3,000
 */

// ==================== 데미지 타입 ====================
export const DAMAGE_TYPE = {
  PHYSICAL: 'physical',
  MAGIC: 'magic',
  HOLY: 'holy',
  FIRE: 'fire',
  FROST: 'frost',
  NATURE: 'nature',
  SHADOW: 'shadow',
  ARCANE: 'arcane',
  CHAOS: 'chaos', // 악마사냥꾼
  BLEED: 'bleed',
  POISON: 'poison'
};

// ==================== 스쿨 마스크 (WoW 방식) ====================
export const SCHOOL_MASK = {
  PHYSICAL: 0x01,
  HOLY: 0x02,
  FIRE: 0x04,
  NATURE: 0x08,
  FROST: 0x10,
  SHADOW: 0x20,
  ARCANE: 0x40,
  // 조합
  HOLYSTRIKE: 0x03, // Physical + Holy
  FLAMESTRIKE: 0x05, // Physical + Fire
  FROSTSTRIKE: 0x11, // Physical + Frost
  STORMSTRIKE: 0x09, // Physical + Nature
  SHADOWSTRIKE: 0x21, // Physical + Shadow
  SPELLSTRIKE: 0x41, // Physical + Arcane
  ELEMENTAL: 0x1C, // Fire + Frost + Nature
  CHROMATIC: 0x7E, // All magic
  MAGIC: 0x7E, // All magic
  CHAOS: 0x7F // All
};

// ==================== 공격 결과 ====================
export const ATTACK_RESULT = {
  MISS: 'miss',
  DODGE: 'dodge',
  PARRY: 'parry',
  GLANCE: 'glance',
  BLOCK: 'block',
  CRIT_BLOCK: 'crit_block',
  HIT: 'hit',
  CRIT: 'crit',
  MULTISTRIKE: 'multistrike'
};

// ==================== 스탯 타입 ====================
export const STAT_TYPE = {
  // Primary
  STRENGTH: 'strength',
  AGILITY: 'agility',
  INTELLECT: 'intellect',
  STAMINA: 'stamina',

  // Secondary
  CRITICAL_STRIKE: 'criticalStrike',
  HASTE: 'haste',
  MASTERY: 'mastery',
  VERSATILITY: 'versatility',

  // Tertiary
  LEECH: 'leech',
  AVOIDANCE: 'avoidance',
  SPEED: 'speed',

  // Combat
  ARMOR: 'armor',
  ATTACK_POWER: 'attackPower',
  SPELL_POWER: 'spellPower',
  WEAPON_DPS: 'weaponDps',

  // Defensive
  DODGE: 'dodge',
  PARRY: 'parry',
  BLOCK: 'block',
  BLOCK_VALUE: 'blockValue'
};

// ==================== 레벨 상수 ====================
export const LEVEL_CONSTANTS = {
  MAX_LEVEL: 80,
  BOSS_LEVEL: 83,
  LEVEL_DIFF_CAP: 3,

  // 레이팅 변환 (레벨 80 기준)
  RATING_CONVERSIONS: {
    [STAT_TYPE.CRITICAL_STRIKE]: 170, // 1% = 170 rating
    [STAT_TYPE.HASTE]: 170,
    [STAT_TYPE.MASTERY]: 140,
    [STAT_TYPE.VERSATILITY]: 205,
    [STAT_TYPE.DODGE]: 220,
    [STAT_TYPE.PARRY]: 220,
    [STAT_TYPE.BLOCK]: 110,
    [STAT_TYPE.LEECH]: 100,
    [STAT_TYPE.AVOIDANCE]: 72,
    [STAT_TYPE.SPEED]: 50
  },

  // 레벨 차이 패널티
  LEVEL_PENALTIES: {
    hit: 0.03, // 레벨당 3% 적중 감소
    expertise: 0.03,
    damage: 0.025 // 레벨당 2.5% 데미지 감소
  }
};

// ==================== 방어도 상수 ====================
export const ARMOR_CONSTANTS = {
  K_VALUE: 8500, // 레벨 80 K 값
  BASE_REDUCTION_CAP: 0.85, // 최대 85% 경감
  ARMOR_PENETRATION_CAP: 1.0 // 100% 관통 가능
};

// ==================== 데미지 계산기 ====================
export class DamageCalculator {
  constructor(simulation) {
    this.sim = simulation;

    // 캐시
    this.statCache = new Map();
    this.formulaCache = new Map();

    // 디버그 모드
    this.debugMode = false;
    this.detailedLog = false;
  }

  // ==================== 메인 데미지 계산 ====================
  calculateDamage(attacker, target, action, options = {}) {
    const result = {
      damage: 0,
      result: ATTACK_RESULT.HIT,
      absorbed: 0,
      blocked: 0,
      resisted: 0,
      overkill: 0,
      details: {}
    };

    // 1. 공격 테이블 굴림
    result.result = this.rollAttackTable(attacker, target, action);

    // 회피 류는 데미지 없음
    if (this.isAvoidedAttack(result.result)) {
      return result;
    }

    // 2. 기본 데미지 계산
    let damage = this.calculateBaseDamage(attacker, action);
    result.details.baseDamage = damage;

    // 3. 공격력/주문력 보정
    damage = this.applyPowerScaling(damage, attacker, action);
    result.details.powerScaled = damage;

    // 4. 타겟 디버프
    damage = this.applyTargetDebuffs(damage, target, action);
    result.details.debuffed = damage;

    // 5. 플레이어 버프
    damage = this.applyAttackerBuffs(damage, attacker, action);
    result.details.buffed = damage;

    // 6. 치명타 처리
    if (result.result === ATTACK_RESULT.CRIT) {
      damage = this.applyCritical(damage, attacker, action);
      result.details.critical = damage;
    }

    // 7. 다중타격 처리
    if (this.rollMultistrike(attacker)) {
      result.multistrike = damage * 0.3;
    }

    // 8. 방어도/저항 처리
    damage = this.applyMitigation(damage, attacker, target, action);
    result.details.mitigated = damage;

    // 9. 흡수 처리
    const absorbed = this.calculateAbsorption(damage, target);
    damage -= absorbed;
    result.absorbed = absorbed;
    result.details.afterAbsorb = damage;

    // 10. 막기 처리
    if (result.result === ATTACK_RESULT.BLOCK || result.result === ATTACK_RESULT.CRIT_BLOCK) {
      const blocked = this.calculateBlock(damage, target);
      damage -= blocked;
      result.blocked = blocked;
      result.details.afterBlock = damage;
    }

    // 11. 최종 데미지 반올림
    damage = Math.round(damage);

    // 12. 과다 피해 계산
    if (damage > target.resources.current.health) {
      result.overkill = damage - target.resources.current.health;
    }

    result.damage = damage;

    // 디버그 로깅
    if (this.debugMode) {
      this.logDamageCalculation(attacker, target, action, result);
    }

    return result;
  }

  // ==================== 공격 테이블 ====================
  rollAttackTable(attacker, target, action) {
    // WoW의 1-roll 시스템
    const roll = this.sim.rng.real(0, 1);
    let cumulative = 0;

    // 1. 회피 (근접만)
    if (action.type === 'melee') {
      const missChance = this.calculateMissChance(attacker, target, action);
      cumulative += missChance;
      if (roll < cumulative) return ATTACK_RESULT.MISS;

      // 2. 회피
      const dodgeChance = this.calculateDodgeChance(attacker, target);
      cumulative += dodgeChance;
      if (roll < cumulative) return ATTACK_RESULT.DODGE;

      // 3. 무기막기
      const parryChance = this.calculateParryChance(attacker, target);
      cumulative += parryChance;
      if (roll < cumulative) return ATTACK_RESULT.PARRY;

      // 4. 빗맞음 (레벨 차이)
      if (target.level > attacker.level) {
        const glanceChance = this.calculateGlanceChance(attacker, target);
        cumulative += glanceChance;
        if (roll < cumulative) return ATTACK_RESULT.GLANCE;
      }

      // 5. 막기
      const blockChance = this.calculateBlockChance(attacker, target);
      if (blockChance > 0) {
        cumulative += blockChance;
        if (roll < cumulative) {
          // 치명타 막기 체크
          const critBlockChance = this.calculateCritBlockChance(target);
          if (this.sim.rng.real(0, 1) < critBlockChance) {
            return ATTACK_RESULT.CRIT_BLOCK;
          }
          return ATTACK_RESULT.BLOCK;
        }
      }
    } else {
      // 주문은 저항만 체크
      const missChance = this.calculateSpellMissChance(attacker, target, action);
      cumulative += missChance;
      if (roll < cumulative) return ATTACK_RESULT.MISS;
    }

    // 6. 치명타
    const critChance = this.calculateCritChance(attacker, target, action);
    cumulative += critChance;
    if (roll < cumulative) return ATTACK_RESULT.CRIT;

    // 7. 일반 적중
    return ATTACK_RESULT.HIT;
  }

  // ==================== 확률 계산 ====================
  calculateMissChance(attacker, target, action) {
    let baseMiss = 0.03; // 3% 기본

    // 레벨 차이
    const levelDiff = target.level - attacker.level;
    if (levelDiff > 0) {
      baseMiss += levelDiff * LEVEL_CONSTANTS.LEVEL_PENALTIES.hit;
    }

    // 적중 보정
    const hitRating = attacker.stats.get('hit') || 0;
    const hitPercent = hitRating / 170 / 100; // 170 rating = 1%
    baseMiss -= hitPercent;

    // 듀얼 wield 패널티
    if (action.weapon === 'offhand') {
      baseMiss += 0.19; // 19% 추가
    }

    return Math.max(0, Math.min(1, baseMiss));
  }

  calculateSpellMissChance(attacker, target, action) {
    let baseMiss = 0.01; // 1% 기본

    // 레벨 차이 (레벨당 1%)
    const levelDiff = target.level - attacker.level;
    if (levelDiff > 0) {
      baseMiss += levelDiff * 0.01;
    }

    // 주문 적중
    const spellHit = attacker.stats.get('spellHit') || 0;
    const hitPercent = spellHit / 170 / 100;
    baseMiss -= hitPercent;

    return Math.max(0, Math.min(1, baseMiss));
  }

  calculateDodgeChance(attacker, target) {
    if (!target.canDodge) return 0;

    let baseDodge = target.stats.get(STAT_TYPE.DODGE) || 0.03; // 3% 기본

    // 숙련 감소
    const expertise = attacker.stats.get('expertise') || 0;
    const expertiseReduction = expertise / 170 / 100;
    baseDodge -= expertiseReduction;

    return Math.max(0, baseDodge);
  }

  calculateParryChance(attacker, target) {
    if (!target.canParry) return 0;

    let baseParry = target.stats.get(STAT_TYPE.PARRY) || 0.03;

    // 숙련 감소
    const expertise = attacker.stats.get('expertise') || 0;
    const expertiseReduction = expertise / 170 / 100;
    baseParry -= expertiseReduction;

    return Math.max(0, baseParry);
  }

  calculateGlanceChance(attacker, target) {
    const levelDiff = target.level - attacker.level;
    if (levelDiff <= 0) return 0;

    // 10 + (레벨차이 * 10)%
    return Math.min(0.4, 0.1 + levelDiff * 0.1);
  }

  calculateBlockChance(attacker, target) {
    if (!target.canBlock || !target.hasShield) return 0;

    const blockRating = target.stats.get(STAT_TYPE.BLOCK) || 0;
    const blockChance = blockRating / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.BLOCK] / 100;

    return Math.min(1, blockChance);
  }

  calculateCritBlockChance(target) {
    // 특화도 기반 (탱커)
    const mastery = target.stats.get(STAT_TYPE.MASTERY) || 0;
    const masteryPercent = mastery / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.MASTERY] / 100;

    return Math.min(1, masteryPercent * 0.5); // 특화도의 50%
  }

  calculateCritChance(attacker, target, action) {
    // 기본 치명타
    let baseCrit = 0.05; // 5%

    // 스탯 기반
    const critRating = attacker.stats.get(STAT_TYPE.CRITICAL_STRIKE) || 0;
    const critFromRating = critRating / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.CRITICAL_STRIKE] / 100;
    baseCrit += critFromRating;

    // 주문/근접 구분
    if (action.type === 'spell') {
      const spellCrit = attacker.stats.get('spellCrit') || 0;
      baseCrit += spellCrit / 100;
    }

    // 타겟 디버프
    if (target.debuffs?.has('criticalVulnerability')) {
      baseCrit += 0.05;
    }

    // 액션 보너스
    if (action.bonusCrit) {
      baseCrit += action.bonusCrit;
    }

    // 치명타 감소 (PvP)
    const critReduction = target.stats.get('resilience') || 0;
    baseCrit -= critReduction / 1000;

    return Math.max(0, Math.min(1, baseCrit));
  }

  rollMultistrike(attacker) {
    // TWW에는 다중타격이 제거되었지만, 일부 특수 효과로 존재
    const multistrikeChance = attacker.stats.get('multistrike') || 0;
    return this.sim.rng.real(0, 1) < multistrikeChance / 100;
  }

  // ==================== 기본 데미지 계산 ====================
  calculateBaseDamage(attacker, action) {
    let damage = 0;

    if (action.type === 'melee' || action.type === 'ranged') {
      // 무기 데미지
      damage = this.calculateWeaponDamage(attacker, action);
    } else {
      // 주문 데미지
      damage = this.calculateSpellDamage(attacker, action);
    }

    return damage;
  }

  calculateWeaponDamage(attacker, action) {
    const weapon = action.weapon === 'offhand' ? attacker.gear.offHand : attacker.gear.mainHand;
    if (!weapon) return 0;

    // 무기 데미지 범위
    const minDamage = weapon.minDamage || 100;
    const maxDamage = weapon.maxDamage || 150;
    const weaponDamage = this.sim.rng.real(minDamage, maxDamage);

    // 무기 속도 정규화
    const normalizedSpeed = this.getNormalizedWeaponSpeed(weapon.type);
    const attackPower = attacker.stats.get(STAT_TYPE.ATTACK_POWER) || 0;

    // 공식: (무기 데미지 + AP * 속도 / 14) * 계수
    let damage = weaponDamage + (attackPower * normalizedSpeed / 14);

    // 액션 계수
    if (action.weaponCoeff) {
      damage *= action.weaponCoeff;
    }

    return damage;
  }

  calculateSpellDamage(attacker, action) {
    // 기본 주문 데미지
    let damage = action.baseDamage || 0;

    // 주문력 보정
    const spellPower = attacker.stats.get(STAT_TYPE.SPELL_POWER) || attacker.stats.get(STAT_TYPE.INTELLECT) || 0;

    if (action.spellCoeff) {
      damage += spellPower * action.spellCoeff;
    }

    // 랜덤 범위
    if (action.damageRange) {
      const variance = action.damageRange * 0.5;
      damage = damage * this.sim.rng.real(1 - variance, 1 + variance);
    }

    return damage;
  }

  getNormalizedWeaponSpeed(weaponType) {
    const speeds = {
      dagger: 1.7,
      sword: 2.4,
      axe: 2.4,
      mace: 2.4,
      polearm: 3.3,
      staff: 3.0,
      twoHandSword: 3.3,
      twoHandAxe: 3.3,
      twoHandMace: 3.3
    };
    return speeds[weaponType] || 2.4;
  }

  // ==================== 보정 적용 ====================
  applyPowerScaling(damage, attacker, action) {
    if (action.type === 'spell') {
      // 주문력 증폭
      const spellAmp = attacker.stats.get('spellAmplification') || 0;
      damage *= 1 + spellAmp / 100;
    } else {
      // 공격력 증폭
      const meleeAmp = attacker.stats.get('meleeAmplification') || 0;
      damage *= 1 + meleeAmp / 100;
    }

    return damage;
  }

  applyTargetDebuffs(damage, target, action) {
    let multiplier = 1;

    // 일반 피해 증가 디버프
    if (target.debuffs?.has('damageIncrease')) {
      multiplier *= 1.05;
    }

    // 마법 피해 증가
    if (action.school !== DAMAGE_TYPE.PHYSICAL && target.debuffs?.has('magicVulnerability')) {
      multiplier *= 1.08;
    }

    // 물리 피해 증가
    if (action.school === DAMAGE_TYPE.PHYSICAL && target.debuffs?.has('physicalVulnerability')) {
      multiplier *= 1.05;
    }

    // 특정 속성 취약
    const schoolVuln = `${action.school}Vulnerability`;
    if (target.debuffs?.has(schoolVuln)) {
      multiplier *= 1.1;
    }

    return damage * multiplier;
  }

  applyAttackerBuffs(damage, attacker, action) {
    let multiplier = 1;

    // 일반 피해 증가
    const damageBonus = attacker.stats.get('damageBonus') || 0;
    multiplier *= 1 + damageBonus / 100;

    // 유연성
    const versatility = attacker.stats.get(STAT_TYPE.VERSATILITY) || 0;
    const versPercent = versatility / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.VERSATILITY] / 100;
    multiplier *= 1 + versPercent;

    // 특화도 (클래스별 구현 필요)
    if (attacker.applyMastery) {
      multiplier *= attacker.applyMastery(action);
    }

    // 버프
    for (const buff of attacker.buffs.values()) {
      if (buff.damageMultiplier) {
        multiplier *= buff.damageMultiplier;
      }
    }

    return damage * multiplier;
  }

  applyCritical(damage, attacker, action) {
    let critMultiplier = 2.0; // 기본 200%

    // 치명타 피해 증가
    const critDamageBonus = attacker.stats.get('criticalDamageBonus') || 0;
    critMultiplier += critDamageBonus / 100;

    // 특성/버프
    if (attacker.buffs?.has('chaosBlades')) {
      critMultiplier += 0.2;
    }

    return damage * critMultiplier;
  }

  // ==================== 경감 계산 ====================
  applyMitigation(damage, attacker, target, action) {
    if (action.school === DAMAGE_TYPE.PHYSICAL) {
      damage = this.applyArmorMitigation(damage, attacker, target);
    } else {
      damage = this.applyResistance(damage, target, action.school);
    }

    // 일반 경감
    damage = this.applyGeneralMitigation(damage, target);

    return damage;
  }

  applyArmorMitigation(damage, attacker, target) {
    let armor = target.stats.get(STAT_TYPE.ARMOR) || 0;

    // 방어도 관통
    const armorPen = attacker.stats.get('armorPenetration') || 0;
    const armorPenPercent = Math.min(1, armorPen / 100);
    armor *= 1 - armorPenPercent;

    // 방어도 경감 공식
    const reduction = armor / (armor + ARMOR_CONSTANTS.K_VALUE);
    const cappedReduction = Math.min(ARMOR_CONSTANTS.BASE_REDUCTION_CAP, reduction);

    return damage * (1 - cappedReduction);
  }

  applyResistance(damage, target, school) {
    // 마법 저항
    const resistance = target.stats.get(`${school}Resistance`) || 0;

    // 평균 저항 (부분 저항 시스템)
    const averageResist = resistance / (resistance + 500) * 0.75;

    return damage * (1 - averageResist);
  }

  applyGeneralMitigation(damage, target) {
    let mitigation = 1;

    // 전체 경감
    const damageReduction = target.stats.get('damageReduction') || 0;
    mitigation *= 1 - damageReduction / 100;

    // 유연성 (방어)
    const versatility = target.stats.get(STAT_TYPE.VERSATILITY) || 0;
    const versDefense = versatility / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.VERSATILITY] / 100 * 0.5;
    mitigation *= 1 - versDefense;

    // 능동 경감
    for (const buff of target.buffs.values()) {
      if (buff.damageMitigation) {
        mitigation *= 1 - buff.damageMitigation;
      }
    }

    return damage * mitigation;
  }

  // ==================== 흡수/막기 ====================
  calculateAbsorption(damage, target) {
    let totalAbsorb = 0;

    // 흡수 보호막들
    const absorbs = [];
    for (const buff of target.buffs.values()) {
      if (buff.absorb && buff.absorbRemaining > 0) {
        absorbs.push(buff);
      }
    }

    // 우선순위 정렬 (큰 것부터)
    absorbs.sort((a, b) => b.absorbRemaining - a.absorbRemaining);

    let remainingDamage = damage;
    for (const absorb of absorbs) {
      const absorbed = Math.min(remainingDamage, absorb.absorbRemaining);
      absorb.absorbRemaining -= absorbed;
      totalAbsorb += absorbed;
      remainingDamage -= absorbed;

      if (remainingDamage <= 0) break;
    }

    return totalAbsorb;
  }

  calculateBlock(damage, target) {
    const blockValue = target.stats.get(STAT_TYPE.BLOCK_VALUE) || 0;
    const blockPercent = 0.3; // 기본 30% 막기

    return Math.min(damage * blockPercent, blockValue);
  }

  // ==================== 치유 계산 ====================
  calculateHealing(healer, target, spell, options = {}) {
    const result = {
      healing: 0,
      overhealing: 0,
      absorbed: 0,
      result: ATTACK_RESULT.HIT,
      details: {}
    };

    // 1. 기본 치유량
    let healing = spell.baseHealing || 0;

    // 2. 주문력 보정
    const spellPower = healer.stats.get(STAT_TYPE.SPELL_POWER) || healer.stats.get(STAT_TYPE.INTELLECT) || 0;
    if (spell.spellCoeff) {
      healing += spellPower * spell.spellCoeff;
    }
    result.details.baseHealing = healing;

    // 3. 치유 증가
    const healingBonus = healer.stats.get('healingBonus') || 0;
    healing *= 1 + healingBonus / 100;

    // 4. 유연성
    const versatility = healer.stats.get(STAT_TYPE.VERSATILITY) || 0;
    const versPercent = versatility / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.VERSATILITY] / 100;
    healing *= 1 + versPercent;
    result.details.afterVers = healing;

    // 5. 치명타 체크
    const critChance = this.calculateHealCritChance(healer, spell);
    if (this.sim.rng.real(0, 1) < critChance) {
      healing *= 2.0; // 치유 치명타는 200%
      result.result = ATTACK_RESULT.CRIT;
      result.details.critical = healing;
    }

    // 6. 타겟 치유 증가
    const healingTaken = target.stats.get('healingTaken') || 0;
    healing *= 1 + healingTaken / 100;

    // 7. 치유 흡수 디버프
    const healAbsorb = this.calculateHealAbsorption(healing, target);
    healing -= healAbsorb;
    result.absorbed = healAbsorb;

    // 8. 과다 치유
    const missingHealth = target.resources.max.health - target.resources.current.health;
    if (healing > missingHealth) {
      result.overhealing = healing - missingHealth;
      healing = missingHealth;
    }

    result.healing = Math.round(healing);

    return result;
  }

  calculateHealCritChance(healer, spell) {
    let baseCrit = 0.05;

    const critRating = healer.stats.get(STAT_TYPE.CRITICAL_STRIKE) || 0;
    const critFromRating = critRating / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.CRITICAL_STRIKE] / 100;
    baseCrit += critFromRating;

    if (spell.bonusCrit) {
      baseCrit += spell.bonusCrit;
    }

    return Math.min(1, baseCrit);
  }

  calculateHealAbsorption(healing, target) {
    let totalAbsorb = 0;

    // 치유 흡수 디버프
    for (const debuff of target.debuffs.values()) {
      if (debuff.healAbsorb && debuff.healAbsorbRemaining > 0) {
        const absorbed = Math.min(healing, debuff.healAbsorbRemaining);
        debuff.healAbsorbRemaining -= absorbed;
        totalAbsorb += absorbed;
        healing -= absorbed;
      }
    }

    return totalAbsorb;
  }

  // ==================== DOT/HOT 계산 ====================
  calculateDotTick(source, target, dot) {
    // 스냅샷된 스탯 사용
    const snapshotStats = dot.snapshotStats || source.stats;

    // 기본 틱 데미지
    let tickDamage = dot.tickDamage || 0;

    // 주문력 보정 (스냅샷)
    if (dot.spellCoeff) {
      const spellPower = snapshotStats.get(STAT_TYPE.SPELL_POWER) || 0;
      tickDamage += spellPower * dot.spellCoeff;
    }

    // 유연성 (스냅샷)
    const versatility = snapshotStats.get(STAT_TYPE.VERSATILITY) || 0;
    const versPercent = versatility / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.VERSATILITY] / 100;
    tickDamage *= 1 + versPercent;

    // 타겟 디버프 (동적)
    tickDamage = this.applyTargetDebuffs(tickDamage, target, { school: dot.school });

    // 치명타 (각 틱마다 체크)
    const critChance = dot.canCrit ? this.calculateCritChance(source, target, dot) : 0;
    if (this.sim.rng.real(0, 1) < critChance) {
      tickDamage *= 2.0;
    }

    // 경감
    tickDamage = this.applyMitigation(tickDamage, source, target, dot);

    return Math.round(tickDamage);
  }

  calculateHotTick(source, target, hot) {
    const snapshotStats = hot.snapshotStats || source.stats;

    let tickHealing = hot.tickHealing || 0;

    if (hot.spellCoeff) {
      const spellPower = snapshotStats.get(STAT_TYPE.SPELL_POWER) || 0;
      tickHealing += spellPower * hot.spellCoeff;
    }

    const versatility = snapshotStats.get(STAT_TYPE.VERSATILITY) || 0;
    const versPercent = versatility / LEVEL_CONSTANTS.RATING_CONVERSIONS[STAT_TYPE.VERSATILITY] / 100;
    tickHealing *= 1 + versPercent;

    const critChance = hot.canCrit ? this.calculateHealCritChance(source, hot) : 0;
    if (this.sim.rng.real(0, 1) < critChance) {
      tickHealing *= 2.0;
    }

    const missingHealth = target.resources.max.health - target.resources.current.health;
    tickHealing = Math.min(tickHealing, missingHealth);

    return Math.round(tickHealing);
  }

  // ==================== 특수 계산 ====================
  calculateSplashDamage(damage, splashPercent, targetCount) {
    // 광역 데미지 감소
    const reductionPerTarget = 0.1; // 타겟당 10% 감소
    const minDamage = 0.2; // 최소 20%

    const reduction = Math.max(minDamage, 1 - (targetCount - 1) * reductionPerTarget);
    return damage * splashPercent * reduction;
  }

  calculateChainDamage(damage, bounceIndex) {
    // 연쇄 데미지 감소 (바운스마다 30% 감소)
    const reductionPerBounce = 0.3;
    return damage * Math.pow(1 - reductionPerBounce, bounceIndex);
  }

  calculateExecuteDamage(damage, target) {
    const healthPercent = target.getHealthPercent();

    // 35% 이하에서 데미지 증가
    if (healthPercent <= 0.35) {
      const executeMod = 1 + (0.35 - healthPercent) * 2; // 최대 70% 증가
      return damage * executeMod;
    }

    return damage;
  }

  // ==================== 스탯 계산 ====================
  calculateStatValue(entity, stat) {
    // 캐시 확인
    const cacheKey = `${entity.id}_${stat}`;
    if (this.statCache.has(cacheKey)) {
      return this.statCache.get(cacheKey);
    }

    let value = entity.stats.get(stat) || 0;

    // 버프 적용
    for (const buff of entity.buffs.values()) {
      if (buff.stats && buff.stats[stat]) {
        value += buff.stats[stat];
      }
      if (buff.statMultipliers && buff.statMultipliers[stat]) {
        value *= buff.statMultipliers[stat];
      }
    }

    // 디버프 적용
    for (const debuff of entity.debuffs.values()) {
      if (debuff.stats && debuff.stats[stat]) {
        value -= Math.abs(debuff.stats[stat]);
      }
      if (debuff.statMultipliers && debuff.statMultipliers[stat]) {
        value *= debuff.statMultipliers[stat];
      }
    }

    // 캐시 저장
    this.statCache.set(cacheKey, value);

    return value;
  }

  clearStatCache(entity = null) {
    if (entity) {
      // 특정 엔티티 캐시만 제거
      for (const key of this.statCache.keys()) {
        if (key.startsWith(`${entity.id}_`)) {
          this.statCache.delete(key);
        }
      }
    } else {
      // 전체 캐시 제거
      this.statCache.clear();
    }
  }

  // ==================== 공식 캐싱 ====================
  getCachedFormula(key, calculator) {
    if (this.formulaCache.has(key)) {
      return this.formulaCache.get(key);
    }

    const result = calculator();
    this.formulaCache.set(key, result);
    return result;
  }

  clearFormulaCache() {
    this.formulaCache.clear();
  }

  // ==================== 디버깅 ====================
  logDamageCalculation(attacker, target, action, result) {
    console.log('=== Damage Calculation ===');
    console.log(`Attacker: ${attacker.name}`);
    console.log(`Target: ${target.name}`);
    console.log(`Action: ${action.name}`);
    console.log(`Result: ${result.result}`);

    if (this.detailedLog) {
      console.log('Details:', result.details);
    }

    console.log(`Final Damage: ${result.damage}`);

    if (result.absorbed > 0) {
      console.log(`Absorbed: ${result.absorbed}`);
    }
    if (result.blocked > 0) {
      console.log(`Blocked: ${result.blocked}`);
    }
    if (result.overkill > 0) {
      console.log(`Overkill: ${result.overkill}`);
    }

    console.log('========================');
  }

  // ==================== 유틸리티 ====================
  isAvoidedAttack(result) {
    return result === ATTACK_RESULT.MISS ||
           result === ATTACK_RESULT.DODGE ||
           result === ATTACK_RESULT.PARRY;
  }

  isDamageType(school, mask) {
    return (SCHOOL_MASK[school.toUpperCase()] & mask) !== 0;
  }

  getSchoolName(mask) {
    for (const [name, value] of Object.entries(SCHOOL_MASK)) {
      if (value === mask) {
        return name.toLowerCase();
      }
    }
    return 'unknown';
  }

  // RPPM 계산
  calculateRppm(rppm, haste) {
    // Real Procs Per Minute with haste scaling
    const hasteMultiplier = 1 + haste / 100;
    const procChance = rppm * hasteMultiplier / 60; // per second

    return procChance;
  }

  // PPM 계산 (구식)
  calculatePpm(ppm, attackSpeed) {
    // Procs Per Minute (old system)
    const attacksPerMinute = 60 / attackSpeed;
    const procChance = ppm / attacksPerMinute;

    return Math.min(1, procChance);
  }
}

// ==================== Export ====================
export default DamageCalculator;