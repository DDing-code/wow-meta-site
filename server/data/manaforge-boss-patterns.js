// Manaforge Omega 보스 패턴 및 전투 특성 데이터
// 각 보스별 단일/광역 상황과 최적 사이클 정의

const ManaforgeOmegaBosses = {
  // 1번 보스: Plexus Sentinel (ID: 3131)
  3131: {
    id: 3131,
    name: "Plexus Sentinel",
    nameKr: "플렉서스 파수병",
    type: "single_target",  // 주로 단일 타겟
    phases: [
      {
        phase: 1,
        name: "기본 페이즈",
        duration: "0-70%",
        mechanics: {
          targetCount: 1,
          addSpawnInterval: null,
          burstWindows: [10, 40, 70, 100, 130], // 초 단위
          movement: "low"
        },
        optimalRotation: {
          dps: {
            priority: "single_target_burst",
            cooldowns: "on_pull_and_burst_windows",
            notes: "단일 타겟 극대화, 쿨다운은 버스트 윈도우에 맞춰 사용"
          },
          healer: {
            priority: "tank_healing",
            cooldowns: "tank_busters",
            notes: "탱커 집중 힐, 탱크버스터 타이밍 주의"
          }
        }
      },
      {
        phase: 2,
        name: "강화 페이즈",
        duration: "70-40%",
        mechanics: {
          targetCount: 1,
          addSpawnInterval: 60, // 60초마다 쫄 소환
          burstWindows: [10, 35, 60, 85],
          movement: "medium"
        },
        optimalRotation: {
          dps: {
            priority: "cleave_with_priority",
            cooldowns: "save_for_adds",
            notes: "쫄 처리 우선, 본체는 지속딜로 처리"
          },
          healer: {
            priority: "raid_healing",
            cooldowns: "raid_damage",
            notes: "광역 피해 증가, 공대 생존기 준비"
          }
        }
      },
      {
        phase: 3,
        name: "마무리 페이즈",
        duration: "40-0%",
        mechanics: {
          targetCount: 1,
          addSpawnInterval: null,
          burstWindows: "continuous",
          movement: "high"
        },
        optimalRotation: {
          dps: {
            priority: "execute_phase",
            cooldowns: "use_everything",
            notes: "처형 페이즈, 모든 쿨다운 사용"
          },
          healer: {
            priority: "survival",
            cooldowns: "chain_defensives",
            notes: "생존 최우선, 연속 생존기 사용"
          }
        }
      }
    ]
  },

  // 2번 보스: Loomithar (ID: 3132)
  3132: {
    id: 3132,
    name: "Loomithar",
    nameKr: "루미타르",
    type: "add_heavy",  // 쫄이 많은 전투
    phases: [
      {
        phase: 1,
        name: "거미 소환 페이즈",
        duration: "0-80%",
        mechanics: {
          targetCount: "1-5",
          addSpawnInterval: 30, // 30초마다 거미 무리
          burstWindows: [15, 45, 75, 105],
          movement: "medium"
        },
        optimalRotation: {
          dps: {
            priority: "aoe_focused",
            cooldowns: "on_add_spawns",
            notes: "광역 딜 중심, 쫄 소환시 쿨다운 사용"
          },
          healer: {
            priority: "spread_healing",
            cooldowns: "aoe_damage_phases",
            notes: "공대원 분산 힐링, 광역 피해 대비"
          }
        }
      },
      {
        phase: 2,
        name: "대량 소환 페이즈",
        duration: "80-30%",
        mechanics: {
          targetCount: "5-10",
          addSpawnInterval: 20, // 20초마다 대량 소환
          burstWindows: "continuous",
          movement: "high"
        },
        optimalRotation: {
          dps: {
            priority: "sustained_aoe",
            cooldowns: "rolling_cooldowns",
            notes: "지속적인 광역딜, 쿨다운 순환 사용"
          },
          healer: {
            priority: "group_healing",
            cooldowns: "rotate_raid_cds",
            notes: "그룹 힐링, 공대 생존기 순환"
          }
        }
      },
      {
        phase: 3,
        name: "광란 페이즈",
        duration: "30-0%",
        mechanics: {
          targetCount: "10+",
          addSpawnInterval: 10,
          burstWindows: null,
          movement: "very_high"
        },
        optimalRotation: {
          dps: {
            priority: "maximum_aoe",
            cooldowns: "burn_everything",
            notes: "최대 광역딜, 모든 자원 소진"
          },
          healer: {
            priority: "spam_aoe_heals",
            cooldowns: "emergency_mode",
            notes: "광역 힐 스팸, 비상 모드"
          }
        }
      }
    ]
  },

  // 3번 보스: Keeper Artificer Xy'mox (ID: 3133)
  3133: {
    id: 3133,
    name: "Keeper Artificer Xy'mox",
    nameKr: "수호자 기능공 자이목스",
    type: "mechanics_heavy",  // 기믹이 많은 전투
    phases: [
      {
        phase: 1,
        name: "포탈 페이즈",
        duration: "0-75%",
        mechanics: {
          targetCount: 1,
          addSpawnInterval: null,
          burstWindows: [20, 50, 80, 110],
          movement: "very_high",
          special: "portal_mechanics"
        },
        optimalRotation: {
          dps: {
            priority: "mobile_rotation",
            cooldowns: "between_portals",
            notes: "이동 중 딜 유지, 포탈 사이에 쿨다운"
          },
          healer: {
            priority: "instant_casts",
            cooldowns: "movement_phases",
            notes: "즉시 시전 위주, 이동 중 힐링"
          }
        }
      },
      {
        phase: 2,
        name: "분열 페이즈",
        duration: "75-50%",
        mechanics: {
          targetCount: "1-3", // 본체 + 분신
          addSpawnInterval: 90,
          burstWindows: [15, 45, 75],
          movement: "medium",
          special: "clone_mechanics"
        },
        optimalRotation: {
          dps: {
            priority: "multi_dot_cleave",
            cooldowns: "on_clone_spawns",
            notes: "멀티 도트/클리브, 분신 소환시 폭딜"
          },
          healer: {
            priority: "split_damage",
            cooldowns: "clone_burst",
            notes: "분산 피해 대응, 분신 폭발 대비"
          }
        }
      },
      {
        phase: 3,
        name: "차원 붕괴",
        duration: "50-0%",
        mechanics: {
          targetCount: "variable",
          addSpawnInterval: 30,
          burstWindows: "chaotic",
          movement: "extreme",
          special: "dimensional_tears"
        },
        optimalRotation: {
          dps: {
            priority: "adaptive_rotation",
            cooldowns: "on_demand",
            notes: "상황별 대응, 기회 포착시 쿨다운"
          },
          healer: {
            priority: "triage_healing",
            cooldowns: "emergency_response",
            notes: "우선순위 힐링, 긴급 대응"
          }
        }
      }
    ]
  },

  // 4번 보스: Nexus-King Zalazar (ID: 3134)
  3134: {
    id: 3134,
    name: "Nexus-King Zalazar",
    nameKr: "연결체 왕 잘라자르",
    type: "two_target",  // 2타겟 클리브
    phases: [
      {
        phase: 1,
        name: "왕좌 페이즈",
        duration: "0-80%",
        mechanics: {
          targetCount: 1,
          addSpawnInterval: null,
          burstWindows: [10, 35, 60, 85, 110],
          movement: "low"
        },
        optimalRotation: {
          dps: {
            priority: "single_target_optimal",
            cooldowns: "2min_windows",
            notes: "단일 타겟 최적화, 2분 쿨다운 정렬"
          },
          healer: {
            priority: "predictable_damage",
            cooldowns: "planned_usage",
            notes: "예측 가능한 피해, 계획된 쿨다운"
          }
        }
      },
      {
        phase: 2,
        name: "수호자 소환",
        duration: "80-40%",
        mechanics: {
          targetCount: 2, // 왕 + 수호자
          addSpawnInterval: null,
          burstWindows: [10, 40, 70],
          movement: "medium",
          special: "shared_health"
        },
        optimalRotation: {
          dps: {
            priority: "two_target_cleave",
            cooldowns: "cleave_optimization",
            notes: "2타겟 클리브 최적화, 동시 처치 목표"
          },
          healer: {
            priority: "dual_tank_healing",
            cooldowns: "tank_swaps",
            notes: "듀얼 탱킹 힐, 탱크 교대 지원"
          }
        }
      },
      {
        phase: 3,
        name: "연결체 해방",
        duration: "40-0%",
        mechanics: {
          targetCount: "2-4",
          addSpawnInterval: 45,
          burstWindows: [10, 30, 50],
          movement: "high",
          special: "nexus_orbs"
        },
        optimalRotation: {
          dps: {
            priority: "priority_target_switching",
            cooldowns: "burn_phase",
            notes: "우선순위 타겟 전환, 번 페이즈"
          },
          healer: {
            priority: "heavy_raid_damage",
            cooldowns: "healing_cooldown_rotation",
            notes: "강한 공대 피해, 힐 쿨다운 순환"
          }
        }
      }
    ]
  },

  // 5번 보스: Dimensius, the All-Devouring (ID: 3135)
  3135: {
    id: 3135,
    name: "Dimensius, the All-Devouring",
    nameKr: "모든 것을 삼키는 디멘시우스",
    type: "multi_phase_complex",  // 복잡한 다단계 전투
    phases: [
      {
        phase: 1,
        name: "차원 균열",
        duration: "0-85%",
        mechanics: {
          targetCount: 1,
          addSpawnInterval: 60,
          burstWindows: [15, 45, 75, 105, 135],
          movement: "medium",
          special: "void_zones"
        },
        optimalRotation: {
          dps: {
            priority: "positional_awareness",
            cooldowns: "safe_windows",
            notes: "위치 선정 중요, 안전 구간에 쿨다운"
          },
          healer: {
            priority: "dot_healing",
            cooldowns: "void_explosion",
            notes: "도트 힐 관리, 공허 폭발 대비"
          }
        }
      },
      {
        phase: 2,
        name: "공허 소환",
        duration: "85-60%",
        mechanics: {
          targetCount: "1-5",
          addSpawnInterval: 40,
          burstWindows: [10, 35, 60],
          movement: "high",
          special: "void_tentacles"
        },
        optimalRotation: {
          dps: {
            priority: "priority_adds",
            cooldowns: "tentacle_spawns",
            notes: "촉수 우선 처리, 소환시 폭딜"
          },
          healer: {
            priority: "dispel_priority",
            cooldowns: "mass_dispel",
            notes: "디스펠 우선순위, 대량 디스펠 준비"
          }
        }
      },
      {
        phase: 3,
        name: "차원 붕괴",
        duration: "60-30%",
        mechanics: {
          targetCount: "variable",
          addSpawnInterval: 30,
          burstWindows: "intermittent",
          movement: "extreme",
          special: "dimensional_shift"
        },
        optimalRotation: {
          dps: {
            priority: "survival_dps",
            cooldowns: "defensive_usage",
            notes: "생존 우선 딜링, 방어 쿨다운 활용"
          },
          healer: {
            priority: "emergency_healing",
            cooldowns: "save_for_shifts",
            notes: "응급 힐링, 차원 이동 대비 쿨다운"
          }
        }
      },
      {
        phase: 4,
        name: "최종 광란",
        duration: "30-0%",
        mechanics: {
          targetCount: "5+",
          addSpawnInterval: 15,
          burstWindows: null,
          movement: "extreme",
          special: "void_storm"
        },
        optimalRotation: {
          dps: {
            priority: "burn_everything",
            cooldowns: "all_offensive",
            notes: "모든 화력 집중, 공격 쿨다운 총동원"
          },
          healer: {
            priority: "spam_everything",
            cooldowns: "chain_all_cooldowns",
            notes: "모든 힐 동원, 쿨다운 연계 사용"
          }
        }
      }
    ]
  }
};

// 보스 타입별 일반 전략
const BossTypeStrategies = {
  single_target: {
    description: "단일 타겟 중심 전투",
    dps_priority: ["단일 타겟 로테이션 최적화", "버스트 윈도우 활용", "쿨다운 정렬"],
    healer_priority: ["탱커 집중 케어", "예측 가능한 피해 패턴 대응"],
    tank_priority: ["미티게이션 로테이션", "탱크버스터 대비"]
  },
  add_heavy: {
    description: "쫄이 많이 나오는 전투",
    dps_priority: ["광역 딜 준비", "쫄 우선순위 설정", "클리브 포지션"],
    healer_priority: ["공대 전체 힐링", "광역 피해 대응"],
    tank_priority: ["쫄 어그로 관리", "포지셔닝"]
  },
  two_target: {
    description: "2타겟 클리브 전투",
    dps_priority: ["클리브 로테이션", "도트 관리", "타겟 전환 최적화"],
    healer_priority: ["듀얼 탱킹 지원", "분산 힐링"],
    tank_priority: ["탱크 스왑", "동시 탱킹"]
  },
  mechanics_heavy: {
    description: "기믹이 많은 전투",
    dps_priority: ["기믹 수행 우선", "이동 중 딜 유지", "기회 포착"],
    healer_priority: ["기동성 있는 힐링", "즉시 시전 활용"],
    tank_priority: ["위치 선정", "기믹 대응"]
  },
  multi_phase_complex: {
    description: "복잡한 다단계 전투",
    dps_priority: ["페이즈별 전략 전환", "자원 관리", "생존 우선"],
    healer_priority: ["쿨다운 분배", "페이즈 전환 대비"],
    tank_priority: ["페이즈별 포지션", "생존기 관리"]
  }
};

// 전문화별 보스 대응 전략
const SpecializationBossStrategies = {
  // 전사
  warrior: {
    fury: {
      3131: { // Plexus Sentinel
        priority: "단일 타겟 극대화",
        talents: "단일 타겟 특성",
        cooldowns: "버스트 윈도우에 블러드서스트 + 레커리스",
        tips: "2페이즈 쫄은 월윈드로 처리하되 본체 우선"
      },
      3132: { // Loomithar
        priority: "광역 딜 중심",
        talents: "광역 특성 (블러드배스, 미트클리버)",
        cooldowns: "쫄 웨이브마다 블러드서스트",
        tips: "미트클리버 유지하면서 월윈드 스팸"
      },
      3133: { // Xy'mox
        priority: "이동 중 딜 유지",
        talents: "기동성 특성",
        cooldowns: "포탈 사이 안전 구간에 사용",
        tips: "헤로익 리프 활용으로 이동 최소화"
      },
      3134: { // Zalazar
        priority: "2타겟 클리브",
        talents: "클리브 강화",
        cooldowns: "2페이즈 시작과 동시에 폭딜",
        tips: "두 타겟 모두에게 디버프 유지"
      },
      3135: { // Dimensius
        priority: "생존형 딜링",
        talents: "생존기 추가",
        cooldowns: "안전 확보 후 사용",
        tips: "인레이징 블로우로 힐 지원"
      }
    },
    arms: {
      // Arms 전사 보스별 전략...
    },
    protection: {
      // 방어 전사 보스별 전략...
    }
  },

  // 사냥꾼
  hunter: {
    beastmastery: {
      3131: { // Plexus Sentinel
        priority: "펫 관리와 단일 딜",
        talents: "Killer Cobra, Aspect of the Beast",
        cooldowns: "Wild Spirits + Bestial Wrath 정렬",
        tips: "펫 위치 관리로 클리브 피해 최소화"
      },
      3132: { // Loomithar
        priority: "Beast Cleave 극대화",
        talents: "Scent of Blood, One with the Pack",
        cooldowns: "쫄 웨이브에 Wild Spirits",
        tips: "Multi-Shot으로 Beast Cleave 100% 유지"
      },
      // ... 더 많은 보스별 전략
    },
    marksmanship: {
      // 사격 사냥꾼 보스별 전략...
    },
    survival: {
      // 생존 사냥꾼 보스별 전략...
    }
  },

  // 더 많은 클래스와 전문화...
};

// 학습 데이터 생성 함수
function generateBossLearningData(bossId, className, specName) {
  const boss = ManaforgeOmegaBosses[bossId];
  if (!boss) return null;

  const learningData = {
    bossId: boss.id,
    bossName: boss.name,
    bossNameKr: boss.nameKr,
    bossType: boss.type,
    className: className,
    specName: specName,
    phases: boss.phases.map(phase => ({
      phaseNumber: phase.phase,
      phaseName: phase.name,
      mechanics: phase.mechanics,
      rotation: phase.optimalRotation,
      targetCount: phase.mechanics.targetCount,
      movement: phase.mechanics.movement,
      special: phase.mechanics.special || null
    })),
    generalStrategy: BossTypeStrategies[boss.type],
    specificStrategy: SpecializationBossStrategies[className]?.[specName]?.[bossId] || null,
    timestamp: new Date()
  };

  return learningData;
}

// 보스 패턴 분석 함수
function analyzeBossPattern(bossId) {
  const boss = ManaforgeOmegaBosses[bossId];
  if (!boss) return null;

  let totalTargets = 0;
  let phaseCount = 0;
  let hasAdds = false;
  let movementIntensity = 0;

  boss.phases.forEach(phase => {
    phaseCount++;

    // 타겟 수 계산
    const targets = phase.mechanics.targetCount;
    if (typeof targets === 'string' && targets.includes('-')) {
      const [min, max] = targets.split('-').map(Number);
      totalTargets += (min + max) / 2;
    } else if (typeof targets === 'string' && targets.includes('+')) {
      totalTargets += parseInt(targets);
    } else if (targets === 'variable') {
      totalTargets += 3; // 평균값 가정
    } else {
      totalTargets += Number(targets) || 1;
    }

    // 쫄 체크
    if (phase.mechanics.addSpawnInterval) {
      hasAdds = true;
    }

    // 이동 강도
    const movementLevels = {
      low: 1,
      medium: 2,
      high: 3,
      very_high: 4,
      extreme: 5
    };
    movementIntensity += movementLevels[phase.mechanics.movement] || 0;
  });

  const avgTargets = totalTargets / phaseCount;
  const avgMovement = movementIntensity / phaseCount;

  return {
    bossId: boss.id,
    bossName: boss.name,
    type: boss.type,
    analysis: {
      averageTargets: avgTargets,
      hasAdds: hasAdds,
      movementIntensity: avgMovement,
      phaseCount: phaseCount,
      combatType: avgTargets > 3 ? 'aoe' : avgTargets > 1.5 ? 'cleave' : 'single_target',
      difficulty: {
        mechanical: avgMovement > 3 ? 'high' : avgMovement > 2 ? 'medium' : 'low',
        numerical: hasAdds ? 'high' : 'medium'
      }
    },
    recommendations: {
      talentFocus: avgTargets > 2 ? 'aoe_talents' : 'single_target_talents',
      cooldownUsage: hasAdds ? 'save_for_adds' : 'on_cooldown',
      positioning: avgMovement > 3 ? 'high_mobility_required' : 'standard'
    }
  };
}

module.exports = {
  ManaforgeOmegaBosses,
  BossTypeStrategies,
  SpecializationBossStrategies,
  generateBossLearningData,
  analyzeBossPattern
};