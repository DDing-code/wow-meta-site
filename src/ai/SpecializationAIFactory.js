// 직업 전문화 AI 팩토리
// 전사
import FuryWarriorAI from './specializations/warrior/FuryWarriorAI.js';
import ArmsWarriorAI from './specializations/warrior/ArmsWarriorAI.js';
import ProtectionWarriorAI from './specializations/warrior/ProtectionWarriorAI.js';

// 성기사
import RetributionPaladinAI from './specializations/paladin/RetributionPaladinAI.js';
import HolyPaladinAI from './specializations/paladin/HolyPaladinAI.js';
import ProtectionPaladinAI from './specializations/paladin/ProtectionPaladinAI.js';

// 사냥꾼
import BeastMasteryHunterAI from './specializations/hunter/BeastMasteryHunterAI.js';
import MarksmanshipHunterAI from './specializations/hunter/MarksmanshipHunterAI.js';
import SurvivalHunterAI from './specializations/hunter/SurvivalHunterAI.js';

// 도적
import AssassinationRogueAI from './specializations/rogue/AssassinationRogueAI.js';
import OutlawRogueAI from './specializations/rogue/OutlawRogueAI.js';
import SubtletyRogueAI from './specializations/rogue/SubtletyRogueAI.js';

// 사제
import ShadowPriestAI from './specializations/priest/ShadowPriestAI.js';
import DisciplinePriestAI from './specializations/priest/DisciplinePriestAI.js';
import HolyPriestAI from './specializations/priest/HolyPriestAI.js';

// 죽음의 기사
import UnholyDeathKnightAI from './specializations/deathknight/UnholyDeathKnightAI.js';
import FrostDeathKnightAI from './specializations/deathknight/FrostDeathKnightAI.js';
import BloodDeathKnightAI from './specializations/deathknight/BloodDeathKnightAI.js';

// 주술사
import ElementalShamanAI from './specializations/shaman/ElementalShamanAI.js';
import EnhancementShamanAI from './specializations/shaman/EnhancementShamanAI.js';
import RestorationShamanAI from './specializations/shaman/RestorationShamanAI.js';

// 마법사
import FireMageAI from './specializations/mage/FireMageAI.js';
import ArcaneMageAI from './specializations/mage/ArcaneMageAI.js';
import FrostMageAI from './specializations/mage/FrostMageAI.js';

// 흑마법사
import AfflictionWarlockAI from './specializations/warlock/AfflictionWarlockAI.js';
import DemonologyWarlockAI from './specializations/warlock/DemonologyWarlockAI.js';
import DestructionWarlockAI from './specializations/warlock/DestructionWarlockAI.js';

// 수도사
import BrewmasterMonkAI from './specializations/monk/BrewmasterMonkAI.js';
import MistweaverMonkAI from './specializations/monk/MistweaverMonkAI.js';
import WindwalkerMonkAI from './specializations/monk/WindwalkerMonkAI.js';

// 드루이드
import BalanceDruidAI from './specializations/druid/BalanceDruidAI.js';
import FeralDruidAI from './specializations/druid/FeralDruidAI.js';
import GuardianDruidAI from './specializations/druid/GuardianDruidAI.js';
import RestorationDruidAI from './specializations/druid/RestorationDruidAI.js';

// 악마사냥꾼
import HavocDemonHunterAI from './specializations/demonhunter/HavocDemonHunterAI.js';
import VengeanceDemonHunterAI from './specializations/demonhunter/VengeanceDemonHunterAI.js';

// 기원사 - 아직 구현 안됨
// import DevastationEvokerAI from './specializations/evoker/DevastationEvokerAI.js';
// import PreservationEvokerAI from './specializations/evoker/PreservationEvokerAI.js';
// import AugmentationEvokerAI from './specializations/evoker/AugmentationEvokerAI.js';

import APLData from './apl/APLData.js';

class SpecializationAIFactory {
  constructor() {
    // 전문화별 AI 인스턴스 캐시
    this.aiInstances = new Map();

    // 전문화 매핑
    this.specializationMapping = {
      // 전사
      'warrior_fury': FuryWarriorAI,
      'warrior_arms': ArmsWarriorAI,
      'warrior_protection': ProtectionWarriorAI,

      // 성기사
      'paladin_holy': HolyPaladinAI,
      'paladin_protection': ProtectionPaladinAI,
      'paladin_retribution': RetributionPaladinAI,

      // 사냥꾼
      'hunter_beastmastery': BeastMasteryHunterAI,
      'hunter_marksmanship': MarksmanshipHunterAI,
      'hunter_survival': SurvivalHunterAI,

      // 도적
      'rogue_assassination': AssassinationRogueAI,
      'rogue_outlaw': OutlawRogueAI,
      'rogue_subtlety': SubtletyRogueAI,

      // 사제
      'priest_discipline': DisciplinePriestAI,
      'priest_holy': HolyPriestAI,
      'priest_shadow': ShadowPriestAI,

      // 죽음의 기사
      'deathknight_blood': BloodDeathKnightAI,
      'deathknight_frost': FrostDeathKnightAI,
      'deathknight_unholy': UnholyDeathKnightAI,

      // 주술사
      'shaman_elemental': ElementalShamanAI,
      'shaman_enhancement': EnhancementShamanAI,
      'shaman_restoration': RestorationShamanAI,

      // 마법사
      'mage_arcane': ArcaneMageAI,
      'mage_fire': FireMageAI,
      'mage_frost': FrostMageAI,

      // 흑마법사
      'warlock_affliction': AfflictionWarlockAI,
      'warlock_demonology': DemonologyWarlockAI,
      'warlock_destruction': DestructionWarlockAI,

      // 수도사
      'monk_brewmaster': BrewmasterMonkAI,
      'monk_mistweaver': MistweaverMonkAI,
      'monk_windwalker': WindwalkerMonkAI,

      // 드루이드
      'druid_balance': BalanceDruidAI,
      'druid_feral': FeralDruidAI,
      'druid_guardian': GuardianDruidAI,
      'druid_restoration': RestorationDruidAI,

      // 악마사냥꾼
      'demonhunter_havoc': HavocDemonHunterAI,
      'demonhunter_vengeance': VengeanceDemonHunterAI,

      // 기원사 - 아직 구현 안됨
      // 'evoker_devastation': DevastationEvokerAI,
      // 'evoker_preservation': PreservationEvokerAI,
      // 'evoker_augmentation': AugmentationEvokerAI
    };

    // 전문화별 메타 정보
    this.specializationMeta = {
      'warrior_fury': {
        name: '분노 전사',
        role: 'dps',
        tier: 'S',
        complexity: 'medium',
        description: '쌍수 무기로 빠른 공격을 가하는 광전사'
      },
      'warrior_arms': {
        name: '무기 전사',
        role: 'dps',
        tier: 'A',
        complexity: 'medium',
        description: '양손 무기로 강력한 일격을 가하는 전사'
      },
      'warrior_protection': {
        name: '방어 전사',
        role: 'tank',
        tier: 'S+',
        complexity: 'high',
        description: '방패로 아군을 보호하는 탱커'
      },
      'paladin_retribution': {
        name: '징벌 성기사',
        role: 'dps',
        tier: 'A+',
        complexity: 'medium',
        description: '신성한 힘으로 적을 응징하는 성기사'
      },
      'deathknight_unholy': {
        name: '언홀리 죽음의 기사',
        role: 'dps',
        tier: 'S',
        complexity: 'high',
        description: '역병과 부정의 힘을 다루는 죽음의 기사'
      },
      'rogue_assassination': {
        name: '암살 도적',
        role: 'dps',
        tier: 'S',
        complexity: 'medium',
        description: '독과 은밀한 공격을 전문으로 하는 도적'
      },
      'hunter_beastmastery': {
        name: '야수 사냥꾼',
        role: 'dps',
        tier: 'A',
        complexity: 'low',
        description: '펫과 함께 전투하는 사냥꾼'
      },
      // ... 다른 전문화들의 메타 정보
    };

    // 역할별 그룹
    this.roleGroups = {
      dps: [],
      healer: [],
      tank: []
    };

    this.initialize();
  }

  // 초기화
  initialize() {
    // 역할별 그룹 생성
    Object.entries(this.specializationMeta).forEach(([key, meta]) => {
      if (this.roleGroups[meta.role]) {
        this.roleGroups[meta.role].push(key);
      }
    });

    console.log('🏭 AI Factory 초기화 완료');
    console.log(`📊 총 ${Object.keys(this.specializationMapping).length}개 전문화 등록`);
  }

  // 전문화 AI 인스턴스 가져오기
  getSpecializationAI(className, specName) {
    const key = `${className}_${specName}`;

    // 캐시 확인
    if (this.aiInstances.has(key)) {
      return this.aiInstances.get(key);
    }

    // AI 클래스 확인
    const AIClass = this.specializationMapping[key];

    if (!AIClass) {
      console.warn(`⚠️ ${className} ${specName} AI가 아직 구현되지 않았습니다`);
      return null;
    }

    // 새 인스턴스 생성
    const aiInstance = new AIClass();
    this.aiInstances.set(key, aiInstance);

    console.log(`✅ ${className} ${specName} AI 인스턴스 생성`);

    return aiInstance;
  }

  // 역할별 AI 목록 가져오기
  getAIsByRole(role) {
    const specs = this.roleGroups[role] || [];
    return specs.map(key => {
      const [className, specName] = key.split('_');
      return this.getSpecializationAI(className, specName);
    }).filter(ai => ai !== null);
  }

  // 모든 DPS AI 가져오기
  getAllDPSAIs() {
    return this.getAIsByRole('dps');
  }

  // 모든 힐러 AI 가져오기
  getAllHealerAIs() {
    return this.getAIsByRole('healer');
  }

  // 모든 탱커 AI 가져오기
  getAllTankAIs() {
    return this.getAIsByRole('tank');
  }

  // 전문화 정보 가져오기
  getSpecializationInfo(className, specName) {
    const key = `${className}_${specName}`;
    return this.specializationMeta[key] || null;
  }

  // 전체 학습 실행
  async trainAllAIs(trainingData) {
    const results = [];

    for (const [key, AIClass] of Object.entries(this.specializationMapping)) {
      if (!AIClass) continue;

      const [className, specName] = key.split('_');
      const ai = this.getSpecializationAI(className, specName);

      if (ai) {
        console.log(`🎓 ${className} ${specName} 학습 시작...`);

        // 해당 전문화의 데이터만 필터링
        const specData = trainingData.filter(log =>
          log.class === className && log.spec === specName
        );

        if (specData.length > 0) {
          try {
            const result = await ai.train(specData, 30);
            results.push({
              spec: key,
              ...result
            });
          } catch (error) {
            console.error(`❌ ${key} 학습 실패:`, error);
          }
        }
      }
    }

    return results;
  }

  // 실시간 예측 수행
  async predictForSpec(className, specName, currentState) {
    const ai = this.getSpecializationAI(className, specName);

    if (!ai) {
      throw new Error(`${className} ${specName} AI를 찾을 수 없습니다`);
    }

    return await ai.predict(currentState);
  }

  // 실시간 조언 생성
  async getRealtimeAdvice(className, specName, currentState) {
    const ai = this.getSpecializationAI(className, specName);

    if (!ai) {
      return {
        immediate: ['AI가 아직 준비되지 않았습니다'],
        warnings: [],
        optimizations: []
      };
    }

    return await ai.generateRealtimeAdvice(currentState);
  }

  // 전문화별 전략 생성
  async getStrategy(className, specName, encounter, phase) {
    const ai = this.getSpecializationAI(className, specName);

    if (!ai) {
      return null;
    }

    if (ai.generateRealtimeStrategy) {
      return await ai.generateRealtimeStrategy(encounter, phase);
    }

    return {
      immediate: ['기본 로테이션 유지'],
      upcoming: [],
      warnings: [],
      priorities: []
    };
  }

  // 성능 분석
  async analyzePerformance(className, specName, combatLog) {
    const ai = this.getSpecializationAI(className, specName);

    if (!ai) {
      return null;
    }

    const prediction = await ai.predict(combatLog);
    const currentDPS = combatLog.dps || 0;

    return {
      current: currentDPS,
      predicted: prediction.predictedDPS,
      improvement: prediction.predictedDPS - currentDPS,
      scores: {
        rotation: prediction.rotationScore,
        resource: prediction.resourceScore,
        survival: prediction.survivalScore
      },
      recommendations: await ai.generateRealtimeAdvice(combatLog)
    };
  }

  // 모든 AI 상태 조회
  getAIStatus() {
    const status = {
      total: Object.keys(this.specializationMapping).length,
      implemented: 0,
      loaded: this.aiInstances.size,
      byRole: {
        dps: { total: 0, implemented: 0 },
        healer: { total: 0, implemented: 0 },
        tank: { total: 0, implemented: 0 }
      }
    };

    Object.entries(this.specializationMapping).forEach(([key, AIClass]) => {
      const meta = this.specializationMeta[key];
      if (meta) {
        status.byRole[meta.role].total++;
        if (AIClass) {
          status.implemented++;
          status.byRole[meta.role].implemented++;
        }
      }
    });

    return status;
  }

  // 메타 티어 리스트
  getMetaTierList() {
    const tierList = {
      'S+': [],
      'S': [],
      'A+': [],
      'A': [],
      'B+': [],
      'B': [],
      'C': []
    };

    Object.entries(this.specializationMeta).forEach(([key, meta]) => {
      if (tierList[meta.tier]) {
        tierList[meta.tier].push({
          spec: key,
          name: meta.name,
          role: meta.role
        });
      }
    });

    return tierList;
  }

  // 모든 모델 저장
  async saveAllModels() {
    const saves = [];

    for (const ai of this.aiInstances.values()) {
      saves.push(ai.saveModel());
    }

    await Promise.all(saves);
    console.log('💾 모든 AI 모델 저장 완료');
  }

  // 모든 모델 로드
  async loadAllModels() {
    const loads = [];

    for (const [key, AIClass] of Object.entries(this.specializationMapping)) {
      if (AIClass) {
        const [className, specName] = key.split('_');
        const ai = this.getSpecializationAI(className, specName);
        if (ai) {
          loads.push(ai.loadModel());
        }
      }
    }

    await Promise.all(loads);
    console.log('📂 모든 AI 모델 로드 시도 완료');
  }

  // 모든 APL 사전 로드
  async preloadAllAPLs() {
    console.log('📚 모든 전문화 APL 로드 시작...');

    const results = {};
    const aplData = APLData;

    // 각 전문화별로 APL 로드
    for (const key of Object.keys(this.specializationMapping)) {
      try {
        const [className, specName] = key.split('_');
        const apl = await aplData.fetchAPL(className, specName);

        if (apl) {
          results[key] = 'success';
          console.log(`✅ ${key} APL 로드 성공`);
        } else {
          results[key] = 'not_found';
          console.log(`⚠️ ${key} APL을 찾을 수 없음`);
        }
      } catch (error) {
        results[key] = 'error';
        console.error(`❌ ${key} APL 로드 실패:`, error.message);
      }
    }

    console.log('📚 APL 로드 완료:', results);
    return results;
  }

  // APL 기반 로테이션 예측
  async predictAPLRotation(className, specName, gameState) {
    const ai = this.getSpecializationAI(className, specName);

    if (!ai) {
      console.warn(`AI를 찾을 수 없습니다: ${className} ${specName}`);
      return null;
    }

    // APL 기반 로테이션 가져오기
    if (ai.getAPLRotation) {
      return await ai.getAPLRotation(gameState);
    } else if (ai.getAPLBasedRotation) {
      return await ai.getAPLBasedRotation(gameState);
    }

    return null;
  }

  // 실시간 APL 조언 생성
  async getAPLAdvice(className, specName, gameState) {
    const aplRotation = await this.predictAPLRotation(className, specName, gameState);

    if (!aplRotation) {
      return {
        nextSkill: null,
        reason: 'APL 데이터 없음',
        alternatives: []
      };
    }

    // 간소화된 APL 데이터 가져오기
    const aplData = APLData;
    const simplifiedAPL = aplData.getSimplifiedAPL(className, specName);

    if (!simplifiedAPL) {
      return {
        nextSkill: aplRotation,
        reason: '기본 로테이션',
        alternatives: []
      };
    }

    // 쿨다운 확인
    const cooldowns = simplifiedAPL.cooldowns || [];
    const availableCooldowns = cooldowns.filter(cd => {
      // 쿨다운 조건 평가 (간단한 예시)
      if (cd.condition.includes('target.time_to_die')) {
        const timeRequired = parseInt(cd.condition.match(/\d+/)?.[0] || '0');
        return (gameState.target_time_to_die || 999) > timeRequired;
      }
      return true;
    });

    return {
      nextSkill: aplRotation,
      reason: this.getSkillReason(aplRotation, gameState),
      cooldowns: availableCooldowns.map(cd => cd.skill),
      alternatives: this.getAlternativeSkills(className, specName, gameState)
    };
  }

  // 스킬 선택 이유
  getSkillReason(skill, gameState) {
    const reasons = {
      'rampage': '분노 소모 및 격노 발동',
      'execute': '처형 페이즈 또는 급살 발동',
      'bloodthirst': '분노 생성 및 치명타 버프',
      'raging_blow': '충전 소모 및 데미지',
      'whirlwind': '광역 또는 버프 유지'
    };

    return reasons[skill] || '최적 로테이션';
  }

  // 대체 스킬 제안
  getAlternativeSkills(className, specName, gameState) {
    // 간단한 대체 스킬 목록
    const alternatives = [];

    if (gameState.enemy_count > 1) {
      alternatives.push('광역 스킬 우선');
    }

    if (gameState.target_hp_percent < 20) {
      alternatives.push('처형 스킬 사용');
    }

    if (gameState.resource_percent > 80) {
      alternatives.push('자원 소모 스킬');
    }

    return alternatives;
  }
}

// 싱글톤 인스턴스
const specializationAIFactory = new SpecializationAIFactory();

export default specializationAIFactory;