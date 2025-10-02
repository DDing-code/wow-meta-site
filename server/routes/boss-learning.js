const express = require('express');
const router = express.Router();
const {
  ManaforgeOmegaBosses,
  generateBossLearningData,
  analyzeBossPattern,
  SpecializationBossStrategies
} = require('../data/manaforge-boss-patterns');

// 보스 정보 조회
router.get('/bosses', (req, res) => {
  const bossList = Object.values(ManaforgeOmegaBosses).map(boss => ({
    id: boss.id,
    name: boss.name,
    nameKr: boss.nameKr,
    type: boss.type,
    phaseCount: boss.phases.length
  }));

  res.json({
    success: true,
    zone: "Manaforge Omega",
    zoneId: 44,
    bosses: bossList,
    count: bossList.length
  });
});

// 특정 보스 상세 정보
router.get('/boss/:bossId', (req, res) => {
  const bossId = parseInt(req.params.bossId);
  const boss = ManaforgeOmegaBosses[bossId];

  if (!boss) {
    return res.status(404).json({
      error: '보스를 찾을 수 없습니다',
      bossId: bossId
    });
  }

  const analysis = analyzeBossPattern(bossId);

  res.json({
    success: true,
    boss: boss,
    analysis: analysis,
    strategies: {
      general: analysis.recommendations,
      byRole: {
        dps: boss.phases.map(p => p.optimalRotation.dps),
        healer: boss.phases.map(p => p.optimalRotation.healer)
      }
    }
  });
});

// 클래스/스펙별 보스 전략
router.post('/boss-strategy', (req, res) => {
  const { bossId, className, specName } = req.body;

  if (!bossId || !className || !specName) {
    return res.status(400).json({
      error: '필수 파라미터가 누락되었습니다',
      required: ['bossId', 'className', 'specName']
    });
  }

  const learningData = generateBossLearningData(bossId, className, specName);

  if (!learningData) {
    return res.status(404).json({
      error: '보스 데이터를 찾을 수 없습니다',
      bossId: bossId
    });
  }

  res.json({
    success: true,
    strategy: learningData,
    optimizedFor: `${className} ${specName}`,
    bossName: learningData.bossName
  });
});

// 보스별 최적 사이클 학습 데이터 생성
router.post('/generate-cycles', async (req, res) => {
  const { bossId, className, specName, phase = 1 } = req.body;

  const boss = ManaforgeOmegaBosses[bossId];
  if (!boss) {
    return res.status(404).json({ error: '보스를 찾을 수 없습니다' });
  }

  const phaseData = boss.phases.find(p => p.phase === phase);
  if (!phaseData) {
    return res.status(404).json({ error: '페이즈를 찾을 수 없습니다' });
  }

  // 타겟 수에 따른 로테이션 결정
  let rotationType = 'single_target';
  const targetCount = phaseData.mechanics.targetCount;

  if (typeof targetCount === 'string') {
    if (targetCount.includes('-')) {
      const [min, max] = targetCount.split('-').map(Number);
      const avg = (min + max) / 2;
      if (avg >= 5) rotationType = 'aoe';
      else if (avg >= 2) rotationType = 'cleave';
    } else if (targetCount.includes('+')) {
      rotationType = 'aoe';
    }
  } else if (typeof targetCount === 'number') {
    if (targetCount >= 5) rotationType = 'aoe';
    else if (targetCount >= 2) rotationType = 'cleave';
  }

  // 실제 WarcraftLogs 데이터와 연동 (fetch-real-api-data.js 활용)
  const RealDataFetcher = require('../fetch-real-api-data');
  const fetcher = new RealDataFetcher();

  // 보스별 실제 로그 검색을 위한 쿼리 생성
  const cycleData = {
    bossId: boss.id,
    bossName: boss.name,
    phase: phase,
    phaseName: phaseData.name,
    className: className,
    specName: specName,
    rotationType: rotationType,
    mechanics: phaseData.mechanics,

    // 최적 사이클 정보
    optimalCycle: {
      opener: generateOpener(className, specName, rotationType),
      mainRotation: generateMainRotation(className, specName, rotationType, phaseData),
      cooldownUsage: generateCooldownPlan(className, specName, phaseData),
      movement: generateMovementStrategy(className, specName, phaseData.mechanics.movement)
    },

    // 실제 상위 플레이어 데이터 (나중에 실제 API로 대체)
    topPlayerExamples: await getTopPlayerRotations(bossId, className, specName),

    timestamp: new Date()
  };

  res.json({
    success: true,
    cycleData: cycleData,
    message: `${boss.nameKr} ${phaseData.name}에 대한 ${className} ${specName} 사이클 생성 완료`
  });
});

// 오프너 생성 함수
function generateOpener(className, specName, rotationType) {
  const openers = {
    warrior: {
      fury: {
        single_target: ["Charge", "Recklessness", "Rampage", "Bloodthirst", "Raging Blow"],
        cleave: ["Charge", "Recklessness", "Whirlwind", "Rampage", "Bloodthirst"],
        aoe: ["Charge", "Recklessness", "Whirlwind", "Bloodthirst", "Whirlwind"]
      },
      arms: {
        single_target: ["Charge", "Colossus Smash", "Mortal Strike", "Overpower", "Execute"],
        cleave: ["Charge", "Sweeping Strikes", "Colossus Smash", "Mortal Strike"],
        aoe: ["Charge", "Sweeping Strikes", "Bladestorm"]
      }
    },
    hunter: {
      beastmastery: {
        single_target: ["Hunter's Mark", "Bestial Wrath", "Kill Command", "Barbed Shot", "Cobra Shot"],
        cleave: ["Multi-Shot", "Bestial Wrath", "Kill Command", "Barbed Shot"],
        aoe: ["Multi-Shot", "Bestial Wrath", "Beast Cleave", "Multi-Shot spam"]
      },
      marksmanship: {
        single_target: ["Hunter's Mark", "Trueshot", "Aimed Shot", "Rapid Fire", "Aimed Shot"],
        cleave: ["Multi-Shot", "Trueshot", "Rapid Fire", "Aimed Shot"],
        aoe: ["Multi-Shot", "Volley", "Rapid Fire", "Multi-Shot spam"]
      }
    }
    // 더 많은 클래스...
  };

  return openers[className]?.[specName]?.[rotationType] || ["Auto Attack"];
}

// 메인 로테이션 생성
function generateMainRotation(className, specName, rotationType, phaseData) {
  const rotations = {
    warrior: {
      fury: {
        single_target: {
          priority: ["Rampage (Rage >= 80)", "Execute (< 20% HP)", "Bloodthirst", "Raging Blow", "Whirlwind (filler)"],
          notes: "Enrage 유지 최우선"
        },
        cleave: {
          priority: ["Whirlwind (buff)", "Rampage", "Bloodthirst", "Raging Blow"],
          notes: "Meat Cleaver 유지"
        },
        aoe: {
          priority: ["Whirlwind spam", "Bloodthirst on CD", "Rampage at 95 Rage"],
          notes: "광역 극대화"
        }
      }
    },
    hunter: {
      beastmastery: {
        single_target: {
          priority: ["Kill Command", "Barbed Shot (< 2 charges)", "Cobra Shot (Focus dump)"],
          notes: "Frenzy 3스택 유지"
        },
        cleave: {
          priority: ["Multi-Shot (Beast Cleave)", "Kill Command", "Barbed Shot"],
          notes: "Beast Cleave 100% 유지"
        },
        aoe: {
          priority: ["Multi-Shot spam", "Kill Command on priority", "Barbed Shot maintenance"],
          notes: "AoE 극대화"
        }
      }
    }
    // 더 많은 클래스...
  };

  return rotations[className]?.[specName]?.[rotationType] || { priority: ["Basic Attack"], notes: "기본 공격" };
}

// 쿨다운 계획 생성
function generateCooldownPlan(className, specName, phaseData) {
  const burstWindows = phaseData.mechanics.burstWindows;

  if (!burstWindows || burstWindows === 'continuous') {
    return {
      strategy: "continuous_usage",
      timing: "즉시 사용 및 쿨마다 사용",
      notes: "지속적인 딜 극대화"
    };
  }

  if (burstWindows === 'chaotic' || burstWindows === 'intermittent') {
    return {
      strategy: "adaptive",
      timing: "기회 포착시 사용",
      notes: "상황 판단 필요"
    };
  }

  return {
    strategy: "planned",
    timing: burstWindows.map(t => `${t}초`),
    notes: "버스트 윈도우 정렬"
  };
}

// 이동 전략 생성
function generateMovementStrategy(className, specName, movementLevel) {
  const strategies = {
    low: "포지션 유지, 최대 딜 집중",
    medium: "예측 이동, 즉시 시전 스킬 활용",
    high: "이동 스킬 적극 활용, 이동 중 딜 유지",
    very_high: "이동 최적화 필수, 이동기 쿨다운 관리",
    extreme: "생존 최우선, 이동 중 가능한 딜만"
  };

  return strategies[movementLevel] || "표준 이동";
}

// 상위 플레이어 로테이션 예시 (실제로는 WarcraftLogs API 연동)
async function getTopPlayerRotations(bossId, className, specName) {
  // 추후 실제 API 연동으로 대체
  // const fetcher = new RealDataFetcher();
  // const logs = await fetcher.fetchBossLogs(bossId, className, specName);

  // 임시 예시 데이터
  return [
    {
      playerName: "TopPlayer1",
      dps: 950000,
      rotation: ["Opener sequence", "Main rotation", "Execute phase"],
      keyPoints: ["버스트 정렬 완벽", "이동 최소화", "쿨다운 최적화"]
    }
  ];
}

// 전체 보스 학습 데이터 생성 (AI 훈련용)
router.post('/train-all-bosses', async (req, res) => {
  const { className, specName } = req.body;

  if (!className || !specName) {
    return res.status(400).json({ error: '클래스와 스펙을 지정하세요' });
  }

  const trainingData = [];

  for (const bossId in ManaforgeOmegaBosses) {
    const boss = ManaforgeOmegaBosses[bossId];

    for (const phase of boss.phases) {
      const learningEntry = {
        bossId: boss.id,
        bossName: boss.name,
        bossNameKr: boss.nameKr,
        bossType: boss.type,
        phaseNumber: phase.phase,
        phaseName: phase.name,

        // 전투 상황
        combatScenario: {
          targetCount: phase.mechanics.targetCount,
          hasAdds: !!phase.mechanics.addSpawnInterval,
          movementLevel: phase.mechanics.movement,
          specialMechanics: phase.mechanics.special
        },

        // 최적 대응
        optimalResponse: {
          rotationType: determineRotationType(phase.mechanics.targetCount),
          priority: phase.optimalRotation.dps.priority,
          cooldownUsage: phase.optimalRotation.dps.cooldowns,
          tips: phase.optimalRotation.dps.notes
        },

        // 클래스별 특화
        classSpecific: SpecializationBossStrategies[className]?.[specName]?.[bossId] || {},

        timestamp: new Date()
      };

      trainingData.push(learningEntry);
    }
  }

  res.json({
    success: true,
    className: className,
    specName: specName,
    trainingEntries: trainingData.length,
    data: trainingData,
    message: `${className} ${specName}에 대한 모든 보스 학습 데이터 생성 완료`
  });
});

// 로테이션 타입 결정 헬퍼
function determineRotationType(targetCount) {
  if (typeof targetCount === 'string') {
    if (targetCount.includes('10') || targetCount.includes('+')) return 'aoe_heavy';
    if (targetCount.includes('5')) return 'aoe';
    if (targetCount.includes('3')) return 'cleave';
    return 'single_target';
  }

  if (targetCount >= 5) return 'aoe';
  if (targetCount >= 2) return 'cleave';
  return 'single_target';
}

module.exports = router;