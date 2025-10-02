// SimulationCraft APL 데이터 저장소
// The War Within (11.2) 패치 기준

class APLData {
  constructor() {
    // 전문화별 APL GitHub URL 매핑
    this.aplUrls = {
      // 전사 (Warrior)
      'warrior_arms': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/warrior_arms.simc',
      'warrior_fury': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/warrior_fury.simc',
      'warrior_protection': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/warrior_protection.simc',

      // 성기사 (Paladin)
      'paladin_holy': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/paladin_holy.simc',
      'paladin_protection': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/paladin_protection.simc',
      'paladin_retribution': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/paladin_retribution.simc',

      // 사냥꾼 (Hunter)
      'hunter_beast_mastery': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/hunter_beast_mastery.simc',
      'hunter_marksmanship': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/hunter_marksmanship.simc',
      'hunter_survival': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/hunter_survival.simc',

      // 도적 (Rogue)
      'rogue_assassination': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/rogue_assassination.simc',
      'rogue_outlaw': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/rogue_outlaw.simc',
      'rogue_subtlety': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/rogue_subtlety.simc',

      // 사제 (Priest)
      'priest_discipline': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/priest_discipline.simc',
      'priest_holy': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/priest_holy.simc',
      'priest_shadow': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/priest_shadow.simc',

      // 죽음의 기사 (Death Knight)
      'deathknight_blood': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/deathknight_blood.simc',
      'deathknight_frost': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/deathknight_frost.simc',
      'deathknight_unholy': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/deathknight_unholy.simc',

      // 주술사 (Shaman)
      'shaman_elemental': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/shaman_elemental.simc',
      'shaman_enhancement': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/shaman_enhancement.simc',
      'shaman_restoration': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/shaman_restoration.simc',

      // 마법사 (Mage)
      'mage_arcane': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/mage_arcane.simc',
      'mage_fire': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/mage_fire.simc',
      'mage_frost': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/mage_frost.simc',

      // 흑마법사 (Warlock)
      'warlock_affliction': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/warlock_affliction.simc',
      'warlock_demonology': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/warlock_demonology.simc',
      'warlock_destruction': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/warlock_destruction.simc',

      // 수도사 (Monk)
      'monk_brewmaster': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/monk_brewmaster.simc',
      'monk_mistweaver': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/monk_mistweaver.simc',
      'monk_windwalker': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/monk_windwalker.simc',

      // 드루이드 (Druid)
      'druid_balance': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/druid_balance.simc',
      'druid_feral': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/druid_feral.simc',
      'druid_guardian': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/druid_guardian.simc',
      'druid_restoration': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/druid_restoration.simc',

      // 악마사냥꾼 (Demon Hunter)
      'demonhunter_havoc': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/demonhunter_havoc.simc',
      'demonhunter_vengeance': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/demonhunter_vengeance.simc',

      // 기원사 (Evoker)
      'evoker_augmentation': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/evoker_augmentation.simc',
      'evoker_devastation': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/evoker_devastation.simc',
      'evoker_preservation': 'https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/evoker_preservation.simc'
    };

    // 캐시된 APL 데이터
    this.cachedAPLs = new Map();

    // 전문화별 핵심 우선순위 (간소화된 버전)
    this.simplifiedAPLs = {
      'warrior_fury': {
        single_target: [
          { skill: 'rampage', condition: 'rage >= 85 || buff.recklessness.up' },
          { skill: 'execute', condition: 'target.health.pct < 20 || buff.sudden_death.up' },
          { skill: 'bloodthirst', condition: 'always' },
          { skill: 'raging_blow', condition: 'charges >= 1' },
          { skill: 'whirlwind', condition: 'buff.whirlwind.down && spell_targets > 1' }
        ],
        multi_target: [
          { skill: 'whirlwind', condition: 'buff.whirlwind.down' },
          { skill: 'rampage', condition: 'rage >= 85' },
          { skill: 'execute', condition: 'buff.sudden_death.up' },
          { skill: 'bladestorm', condition: 'spell_targets >= 3' },
          { skill: 'bloodthirst', condition: 'always' }
        ],
        cooldowns: [
          { skill: 'recklessness', condition: 'target.time_to_die > 6' },
          { skill: 'avatar', condition: 'buff.recklessness.up || cooldown.recklessness.remains > 40' },
          { skill: 'ravager', condition: 'buff.recklessness.up' }
        ]
      },

      'deathknight_unholy': {
        single_target: [
          { skill: 'festering_strike', condition: 'debuff.festering_wound.stack < 4' },
          { skill: 'apocalypse', condition: 'debuff.festering_wound.stack >= 4' },
          { skill: 'death_coil', condition: 'runic_power >= 80' },
          { skill: 'scourge_strike', condition: 'debuff.festering_wound.stack >= 1' },
          { skill: 'army_of_the_dead', condition: 'target.time_to_die > 35' }
        ],
        multi_target: [
          { skill: 'death_and_decay', condition: 'spell_targets >= 2' },
          { skill: 'epidemic', condition: 'spell_targets >= 2 && runic_power >= 30' },
          { skill: 'festering_strike', condition: 'debuff.festering_wound.stack < 4' },
          { skill: 'scourge_strike', condition: 'death_and_decay.ticking' }
        ],
        cooldowns: [
          { skill: 'army_of_the_dead', condition: 'target.time_to_die > 35' },
          { skill: 'dark_transformation', condition: 'pet.active' },
          { skill: 'unholy_assault', condition: 'debuff.festering_wound.stack >= 4' }
        ]
      },

      'paladin_retribution': {
        single_target: [
          { skill: 'wake_of_ashes', condition: 'holy_power <= 2' },
          { skill: 'blade_of_justice', condition: 'holy_power <= 3' },
          { skill: 'judgment', condition: 'holy_power <= 4' },
          { skill: 'final_verdict', condition: 'holy_power >= 3' },
          { skill: 'templars_verdict', condition: 'holy_power >= 3' }
        ],
        multi_target: [
          { skill: 'divine_storm', condition: 'holy_power >= 3 && spell_targets >= 2' },
          { skill: 'wake_of_ashes', condition: 'holy_power <= 2' },
          { skill: 'blade_of_justice', condition: 'holy_power <= 3' },
          { skill: 'consecration', condition: 'spell_targets >= 2' }
        ],
        cooldowns: [
          { skill: 'avenging_wrath', condition: 'target.time_to_die > 8' },
          { skill: 'crusade', condition: 'holy_power >= 3' },
          { skill: 'execution_sentence', condition: 'target.time_to_die > 8' }
        ]
      }

      // 다른 전문화들도 추가 예정...
    };
  }

  // APL 데이터 가져오기
  async fetchAPL(className, specName) {
    const key = `${className}_${specName}`;

    // 캐시 확인
    if (this.cachedAPLs.has(key)) {
      return this.cachedAPLs.get(key);
    }

    // URL 확인
    const url = this.aplUrls[key];
    if (!url) {
      console.warn(`APL URL을 찾을 수 없습니다: ${key}`);
      return this.simplifiedAPLs[key] || null;
    }

    try {
      // GitHub에서 APL 가져오기
      const response = await fetch(url);
      const aplText = await response.text();

      // 캐시에 저장
      this.cachedAPLs.set(key, aplText);

      return aplText;
    } catch (error) {
      console.error(`APL 가져오기 실패: ${key}`, error);
      // 실패시 간소화된 버전 반환
      return this.simplifiedAPLs[key] || null;
    }
  }

  // 모든 APL 사전 로드
  async preloadAllAPLs() {
    const results = {};

    for (const key of Object.keys(this.aplUrls)) {
      try {
        const aplData = await this.fetchAPL(...key.split('_'));
        results[key] = aplData ? 'loaded' : 'failed';
      } catch (error) {
        results[key] = 'error';
      }
    }

    console.log('APL 사전 로드 완료:', results);
    return results;
  }

  // 간소화된 APL 가져오기 (빠른 접근용)
  getSimplifiedAPL(className, specName) {
    const key = `${className}_${specName}`;
    return this.simplifiedAPLs[key] || null;
  }

  // APL 캐시 초기화
  clearCache() {
    this.cachedAPLs.clear();
    console.log('APL 캐시가 초기화되었습니다');
  }

  // 전문화별 핵심 스킬 추출
  extractCoreSkills(aplText) {
    const coreSkills = {
      builders: [],
      spenders: [],
      cooldowns: [],
      maintenance: []
    };

    // APL 텍스트에서 스킬 패턴 추출
    const skillPattern = /actions[^=]*=\/([a-z_]+)/g;
    const matches = [...aplText.matchAll(skillPattern)];

    matches.forEach(match => {
      const skill = match[1];

      // 스킬 분류 (간단한 휴리스틱)
      if (skill.includes('rampage') || skill.includes('templars_verdict') || skill.includes('death_coil')) {
        coreSkills.spenders.push(skill);
      } else if (skill.includes('bloodthirst') || skill.includes('blade_of_justice') || skill.includes('festering_strike')) {
        coreSkills.builders.push(skill);
      } else if (skill.includes('recklessness') || skill.includes('avenging_wrath') || skill.includes('army')) {
        coreSkills.cooldowns.push(skill);
      } else {
        coreSkills.maintenance.push(skill);
      }
    });

    // 중복 제거
    Object.keys(coreSkills).forEach(category => {
      coreSkills[category] = [...new Set(coreSkills[category])];
    });

    return coreSkills;
  }
}

// 싱글톤 인스턴스
const aplData = new APLData();

export default aplData;