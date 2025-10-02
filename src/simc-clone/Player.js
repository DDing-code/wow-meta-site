/**
 * SimulationCraft Player 클래스 완벽 복제
 * 플레이어 특화 기능과 상세 메커니즘
 */

import { Actor, RESOURCE_TYPE, STAT_TYPE } from './Actor.js';

// ==================== 클래스 타입 (SimC와 동일) ====================
const CLASS_TYPE = {
  NONE: 0,
  WARRIOR: 1,
  PALADIN: 2,
  HUNTER: 3,
  ROGUE: 4,
  PRIEST: 5,
  DEATH_KNIGHT: 6,
  SHAMAN: 7,
  MAGE: 8,
  WARLOCK: 9,
  MONK: 10,
  DRUID: 11,
  DEMON_HUNTER: 12,
  EVOKER: 13
};

// ==================== 전문화 타입 ====================
const SPEC_TYPE = {
  NONE: 0,
  // 전사
  WARRIOR_ARMS: 71,
  WARRIOR_FURY: 72,
  WARRIOR_PROTECTION: 73,
  // 성기사
  PALADIN_HOLY: 65,
  PALADIN_PROTECTION: 66,
  PALADIN_RETRIBUTION: 70,
  // 사냥꾼
  HUNTER_BEAST_MASTERY: 253,
  HUNTER_MARKSMANSHIP: 254,
  HUNTER_SURVIVAL: 255,
  // 도적
  ROGUE_ASSASSINATION: 259,
  ROGUE_OUTLAW: 260,
  ROGUE_SUBTLETY: 261,
  // 사제
  PRIEST_DISCIPLINE: 256,
  PRIEST_HOLY: 257,
  PRIEST_SHADOW: 258,
  // 죽음의 기사
  DEATHKNIGHT_BLOOD: 250,
  DEATHKNIGHT_FROST: 251,
  DEATHKNIGHT_UNHOLY: 252,
  // 주술사
  SHAMAN_ELEMENTAL: 262,
  SHAMAN_ENHANCEMENT: 263,
  SHAMAN_RESTORATION: 264,
  // 마법사
  MAGE_ARCANE: 62,
  MAGE_FIRE: 63,
  MAGE_FROST: 64,
  // 흑마법사
  WARLOCK_AFFLICTION: 265,
  WARLOCK_DEMONOLOGY: 266,
  WARLOCK_DESTRUCTION: 267,
  // 수도사
  MONK_BREWMASTER: 268,
  MONK_MISTWEAVER: 270,
  MONK_WINDWALKER: 269,
  // 드루이드
  DRUID_BALANCE: 102,
  DRUID_FERAL: 103,
  DRUID_GUARDIAN: 104,
  DRUID_RESTORATION: 105,
  // 악마사냥꾼
  DEMONHUNTER_HAVOC: 577,
  DEMONHUNTER_VENGEANCE: 581,
  // 기원사
  EVOKER_DEVASTATION: 1467,
  EVOKER_PRESERVATION: 1468,
  EVOKER_AUGMENTATION: 1473
};

// ==================== 역할 타입 ====================
const ROLE_TYPE = {
  NONE: 0,
  TANK: 1,
  HEALER: 2,
  DPS_MELEE: 3,
  DPS_RANGED: 4
};

// ==================== Player 클래스 ====================
class Player extends Actor {
  constructor(sim, name = 'Player') {
    super(sim, name);

    // 플레이어 타입
    this.type = 'player';

    // 클래스와 전문화
    this.classType = CLASS_TYPE.NONE;
    this.spec = SPEC_TYPE.NONE;
    this.role = ROLE_TYPE.NONE;

    // 종족
    this.race = 'human';

    // 특성 (SimC의 talent_points_t)
    this.talents = {
      classTree: new Map(),      // 클래스 특성
      specTree: new Map(),       // 전문화 특성
      heroTree: new Map(),       // 영웅 특성
      pvpTalents: new Map(),     // PvP 특성

      // 특성 문자열 (SimC 형식)
      talentString: ''
    };

    // 장비 (SimC의 items_t)
    this.gear = {
      head: null,
      neck: null,
      shoulders: null,
      back: null,
      chest: null,
      wrists: null,
      hands: null,
      waist: null,
      legs: null,
      feet: null,
      finger1: null,
      finger2: null,
      trinket1: null,
      trinket2: null,
      mainHand: null,
      offHand: null
    };

    // 아이템 레벨
    this.itemLevel = 0;
    this.equippedItemLevel = 0;

    // 세트 보너스
    this.setBonuses = new Map();

    // 주문 리스트 (SimC의 spell_data_t)
    this.spells = new Map();

    // 액션 우선순위 리스트 (APL)
    this.aplLists = new Map();
    this.currentAPL = 'default';

    // 프록 관리
    this.procs = new Map();

    // 가인 관리
    this.gains = new Map();

    // 업타임 추적
    this.uptimes = new Map();

    // 스케일링 (SimC의 scaling)
    this.scaling = {
      strength: 0,
      agility: 0,
      stamina: 0,
      intellect: 0,
      critRating: 0,
      hasteRating: 0,
      masteryRating: 0,
      versatilityRating: 0
    };

    // 캐싱 (SimC의 cache)
    this.cache = {
      attackPower: 0,
      spellPower: 0,
      attackCrit: 0,
      spellCrit: 0,
      attackHaste: 0,
      spellHaste: 0,
      mastery: 0,
      versatilityDamage: 0,
      versatilityHeal: 0,
      versatilityMitigation: 0
    };

    // 컬렉션 (SimC의 collections_t)
    this.collections = {
      damageTakenBySpell: new Map(),
      healingTakenBySpell: new Map(),
      damageBySpell: new Map(),
      healingBySpell: new Map(),
      executeTime: new Map(),
      intervalSum: new Map(),
      intervalCount: new Map()
    };

    // 샘플 데이터 (SimC의 sample_data_t)
    this.sampleData = {
      dps: [],
      dpse: [],
      dmgTaken: [],
      healTaken: [],
      deaths: []
    };
  }

  // 플레이어 초기화 (SimC의 init())
  init() {
    // 클래스별 초기화
    this.initClass();

    // 전문화 초기화
    this.initSpec();

    // 특성 초기화
    this.initTalents();

    // 장비 초기화
    this.initGear();

    // 주문 초기화
    this.initSpells();

    // 액션 초기화
    this.initActions();

    // APL 초기화
    this.initAPL();

    // 스탯 계산
    this.calculateStats();

    // 리소스 초기화
    this.initializeResources();
  }

  // 클래스 초기화
  initClass() {
    // 클래스별 기본값 설정
    switch (this.classType) {
      case CLASS_TYPE.WARRIOR:
        this.resources.base[RESOURCE_TYPE.RAGE] = 100;
        this.resources.max[RESOURCE_TYPE.RAGE] = 100;
        break;
      case CLASS_TYPE.PALADIN:
        this.resources.base[RESOURCE_TYPE.HOLY_POWER] = 5;
        this.resources.max[RESOURCE_TYPE.HOLY_POWER] = 5;
        this.resources.base[RESOURCE_TYPE.MANA] = 50000;
        this.resources.max[RESOURCE_TYPE.MANA] = 50000;
        break;
      case CLASS_TYPE.DEATH_KNIGHT:
        this.resources.base[RESOURCE_TYPE.RUNIC_POWER] = 100;
        this.resources.max[RESOURCE_TYPE.RUNIC_POWER] = 100;
        this.resources.base[RESOURCE_TYPE.RUNE] = 6;
        this.resources.max[RESOURCE_TYPE.RUNE] = 6;
        break;
      // ... 다른 클래스들
    }
  }

  // 전문화 초기화
  initSpec() {
    // 전문화별 역할 설정
    switch (this.spec) {
      case SPEC_TYPE.WARRIOR_PROTECTION:
      case SPEC_TYPE.PALADIN_PROTECTION:
      case SPEC_TYPE.DEATHKNIGHT_BLOOD:
      case SPEC_TYPE.MONK_BREWMASTER:
      case SPEC_TYPE.DRUID_GUARDIAN:
      case SPEC_TYPE.DEMONHUNTER_VENGEANCE:
        this.role = ROLE_TYPE.TANK;
        break;

      case SPEC_TYPE.PALADIN_HOLY:
      case SPEC_TYPE.PRIEST_DISCIPLINE:
      case SPEC_TYPE.PRIEST_HOLY:
      case SPEC_TYPE.SHAMAN_RESTORATION:
      case SPEC_TYPE.MONK_MISTWEAVER:
      case SPEC_TYPE.DRUID_RESTORATION:
      case SPEC_TYPE.EVOKER_PRESERVATION:
        this.role = ROLE_TYPE.HEALER;
        break;

      case SPEC_TYPE.WARRIOR_ARMS:
      case SPEC_TYPE.WARRIOR_FURY:
      case SPEC_TYPE.PALADIN_RETRIBUTION:
      case SPEC_TYPE.ROGUE_ASSASSINATION:
      case SPEC_TYPE.ROGUE_OUTLAW:
      case SPEC_TYPE.ROGUE_SUBTLETY:
      case SPEC_TYPE.DEATHKNIGHT_FROST:
      case SPEC_TYPE.DEATHKNIGHT_UNHOLY:
      case SPEC_TYPE.SHAMAN_ENHANCEMENT:
      case SPEC_TYPE.MONK_WINDWALKER:
      case SPEC_TYPE.DRUID_FERAL:
      case SPEC_TYPE.DEMONHUNTER_HAVOC:
        this.role = ROLE_TYPE.DPS_MELEE;
        break;

      default:
        this.role = ROLE_TYPE.DPS_RANGED;
        break;
    }
  }

  // 특성 파싱 (SimC 형식)
  parseTalents(talentString) {
    this.talents.talentString = talentString;
    // Base64 디코딩 및 파싱 로직
    // SimC와 동일한 형식 지원
  }

  // 장비 초기화
  initGear() {
    // 장비 슬롯별 아이템 설정
    // 아이템 레벨 계산
    let totalItemLevel = 0;
    let itemCount = 0;

    for (const slot in this.gear) {
      const item = this.gear[slot];
      if (item) {
        totalItemLevel += item.itemLevel;
        itemCount++;

        // 스탯 적용
        this.applyItemStats(item);

        // 세트 보너스 체크
        if (item.setId) {
          this.checkSetBonus(item.setId);
        }
      }
    }

    this.equippedItemLevel = itemCount > 0 ? Math.floor(totalItemLevel / itemCount) : 0;
  }

  // 아이템 스탯 적용
  applyItemStats(item) {
    if (item.stats) {
      for (const stat in item.stats) {
        this.stats[stat] = (this.stats[stat] || 0) + item.stats[stat];
      }
    }
  }

  // 세트 보너스 체크
  checkSetBonus(setId) {
    const count = this.setBonuses.get(setId) || 0;
    this.setBonuses.set(setId, count + 1);
  }

  // 주문 초기화
  initSpells() {
    // 각 클래스/전문화별 주문 등록
    // 이 부분은 각 클래스 모듈에서 오버라이드
  }

  // 액션 초기화
  initActions() {
    // 액션 리스트 생성
    // 이 부분은 각 클래스 모듈에서 구현
  }

  // APL 초기화
  initAPL() {
    // 기본 APL 설정
    this.aplLists.set('default', []);
    this.aplLists.set('precombat', []);
    this.aplLists.set('cooldowns', []);
  }

  // APL 파싱 (SimC 형식)
  parseAPL(aplString) {
    const lines = aplString.split('\n');
    let currentList = 'default';

    for (const line of lines) {
      if (line.startsWith('actions.')) {
        const parts = line.split('=');
        const listName = parts[0].replace('actions.', '').split('+')[0];
        const action = parts[1];

        if (!this.aplLists.has(listName)) {
          this.aplLists.set(listName, []);
        }

        this.aplLists.get(listName).push(action);
      }
    }
  }

  // 스탯 계산
  calculateStats() {
    // 기본 스탯 + 장비 스탯
    this.calculatePrimaryStats();

    // 2차 스탯 계산
    this.calculateSecondaryStats();

    // 캐시 업데이트
    this.updateCache();
  }

  // 주 스탯 계산
  calculatePrimaryStats() {
    // 종족 보너스
    this.applyRacialBonuses();

    // 버프 적용
    this.applyStatBuffs();
  }

  // 2차 스탯 계산
  calculateSecondaryStats() {
    // 치명타 확률 계산 (레이팅 -> %)
    this.stats.critChance = 0.05 + (this.stats.critRating / 35 / 100);

    // 가속 계산
    this.stats.hastePercent = this.stats.hasteRating / 33 / 100;

    // 특화 계산
    this.stats.masteryValue = 0.08 + (this.stats.masteryRating / 35 / 100);

    // 유연성 계산
    this.stats.versatilityPercent = this.stats.versatilityRating / 40 / 100;
  }

  // 캐시 업데이트
  updateCache() {
    // 공격력 캐시
    if (this.primaryStat() === 'strength') {
      this.cache.attackPower = this.stats.strength * 2;
    } else if (this.primaryStat() === 'agility') {
      this.cache.attackPower = this.stats.agility * 2;
    }

    // 주문력 캐시
    if (this.primaryStat() === 'intellect') {
      this.cache.spellPower = this.stats.intellect;
    }

    // 치명타 캐시
    this.cache.attackCrit = this.stats.critChance;
    this.cache.spellCrit = this.stats.critChance;

    // 가속 캐시
    this.cache.attackHaste = 1 + this.stats.hastePercent;
    this.cache.spellHaste = 1 + this.stats.hastePercent;

    // 특화 캐시
    this.cache.mastery = this.stats.masteryValue;

    // 유연성 캐시
    this.cache.versatilityDamage = 1 + this.stats.versatilityPercent;
    this.cache.versatilityHeal = 1 + this.stats.versatilityPercent;
    this.cache.versatilityMitigation = 1 + this.stats.versatilityPercent * 0.5;
  }

  // 주 스탯 확인
  primaryStat() {
    switch (this.classType) {
      case CLASS_TYPE.WARRIOR:
      case CLASS_TYPE.PALADIN:
      case CLASS_TYPE.DEATH_KNIGHT:
        return 'strength';

      case CLASS_TYPE.HUNTER:
      case CLASS_TYPE.ROGUE:
      case CLASS_TYPE.MONK:
      case CLASS_TYPE.DEMON_HUNTER:
        return 'agility';

      case CLASS_TYPE.PRIEST:
      case CLASS_TYPE.SHAMAN:
      case CLASS_TYPE.MAGE:
      case CLASS_TYPE.WARLOCK:
      case CLASS_TYPE.EVOKER:
        return 'intellect';

      case CLASS_TYPE.DRUID:
        // 드루이드는 전문화에 따라 다름
        if (this.spec === SPEC_TYPE.DRUID_BALANCE || this.spec === SPEC_TYPE.DRUID_RESTORATION) {
          return 'intellect';
        } else {
          return 'agility';
        }

      default:
        return 'strength';
    }
  }

  // 리소스 초기화
  initializeResources() {
    // 체력 계산
    const baseHealth = 100000; // 기본 체력
    const staminaHealth = this.stats.stamina * 20;

    this.resources.base[RESOURCE_TYPE.HEALTH] = baseHealth + staminaHealth;
    this.resources.max[RESOURCE_TYPE.HEALTH] = baseHealth + staminaHealth;
    this.resources.initial[RESOURCE_TYPE.HEALTH] = baseHealth + staminaHealth;
    this.resources.current[RESOURCE_TYPE.HEALTH] = baseHealth + staminaHealth;

    // 클래스별 리소스 초기값
    this.initClassResources();
  }

  // 클래스별 리소스 초기화
  initClassResources() {
    // 각 클래스 모듈에서 오버라이드
  }

  // 종족 보너스 적용
  applyRacialBonuses() {
    switch (this.race) {
      case 'human':
        this.stats.versatilityRating += 100; // 인간 종특
        break;
      case 'orc':
        // 오크 종특: 피의 격노 등
        break;
      // ... 다른 종족들
    }
  }

  // 스탯 버프 적용
  applyStatBuffs() {
    // 레이드 버프 등
  }

  // SimC의 arise()
  arise() {
    super.reset();

    // 플레이어 특화 리셋
    this.procs.clear();
    this.gains.clear();
    this.uptimes.clear();
    this.collections.damageTakenBySpell.clear();
    this.collections.healingTakenBySpell.clear();
    this.collections.damageBySpell.clear();
    this.collections.healingBySpell.clear();
    this.collections.executeTime.clear();
    this.collections.intervalSum.clear();
    this.collections.intervalCount.clear();
  }

  // 프록 트리거
  triggerProc(name, chance = 1.0) {
    const proc = this.procs.get(name) || { count: 0, lastTrigger: 0 };

    if (this.sim.rng.roll(chance)) {
      proc.count++;
      proc.lastTrigger = this.sim.currentTime;
      this.procs.set(name, proc);
      return true;
    }

    return false;
  }

  // 리소스 획득 추적
  trackGain(amount, resourceType, source) {
    const key = `${source}_${resourceType}`;
    const gain = this.gains.get(key) || { amount: 0, count: 0 };

    gain.amount += amount;
    gain.count++;

    this.gains.set(key, gain);
  }

  // 업타임 추적
  trackUptime(name, duration) {
    const uptime = this.uptimes.get(name) || { total: 0, count: 0 };

    uptime.total += duration;
    uptime.count++;

    this.uptimes.set(name, uptime);
  }

  // 데미지 기록
  recordDamage(spell, amount) {
    const record = this.collections.damageBySpell.get(spell) || { total: 0, count: 0, min: amount, max: amount };

    record.total += amount;
    record.count++;
    record.min = Math.min(record.min, amount);
    record.max = Math.max(record.max, amount);

    this.collections.damageBySpell.set(spell, record);
  }

  // 치유 기록
  recordHealing(spell, amount) {
    const record = this.collections.healingBySpell.get(spell) || { total: 0, count: 0, min: amount, max: amount };

    record.total += amount;
    record.count++;
    record.min = Math.min(record.min, amount);
    record.max = Math.max(record.max, amount);

    this.collections.healingBySpell.set(spell, record);
  }

  // 샘플 데이터 수집
  collectSample() {
    const currentDPS = this.metrics.totalDamage / (this.sim.currentTime / 1000);
    this.sampleData.dps.push(currentDPS);
    this.sampleData.dmgTaken.push(this.metrics.damageTaken);
    this.sampleData.healTaken.push(this.metrics.healingTaken);
    this.sampleData.deaths.push(this.metrics.deaths);
  }
}

export { Player, CLASS_TYPE, SPEC_TYPE, ROLE_TYPE };