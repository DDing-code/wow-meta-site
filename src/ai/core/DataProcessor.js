// WarcraftLogs 데이터 처리 및 특징 추출
import fileDB from '../../../server/services/FileDB';

class WarcraftLogsDataProcessor {
  constructor() {
    // 클래스별 핵심 스킬 매핑
    this.classSkills = {
      warlock_destruction: {
        primary: ['chaos_arrow', 'immolate', 'incinerate'],
        cooldowns: ['havoc', 'dark_soul', 'infernal'],
        resource: 'soul_shards'
      },
      deathknight_unholy: {
        primary: ['festering_strike', 'death_coil', 'apocalypse'],
        cooldowns: ['army_of_dead', 'dark_transformation', 'unholy_assault'],
        resource: 'runic_power'
      },
      warrior_fury: {
        primary: ['rampage', 'bloodthirst', 'raging_blow'],
        cooldowns: ['recklessness', 'avatar', 'ravager'],
        resource: 'rage'
      },
      // ... 다른 클래스들
    };

    // 보스별 페이즈 정보
    this.bossPhases = {
      manaforge_omega: {
        phases: 3,
        burnPhase: 0.35, // 35% 이하 처형 페이즈
        mechanics: ['aoe_damage', 'movement_heavy', 'add_spawns']
      }
    };
  }

  // WarcraftLogs 로그 파싱
  async parseWarcraftLog(logData) {
    const parsed = {
      // 기본 정보
      logId: logData.code || logData.logId,
      fightId: logData.fightId,
      startTime: logData.startTime,
      endTime: logData.endTime,
      duration: (logData.endTime - logData.startTime) / 1000,

      // 플레이어 정보
      player: {
        name: logData.playerName,
        class: logData.class,
        spec: logData.spec,
        ilvl: logData.itemLevel || 630,
        server: logData.server,
        guild: logData.guild
      },

      // 성능 지표
      performance: {
        dps: logData.dps || 0,
        hps: logData.hps || 0,
        percentile: logData.percentile || 50,
        rank: logData.rank || 999
      },

      // 전투 이벤트
      events: this.extractCombatEvents(logData.events || []),

      // 스킬 사용 통계
      skills: this.analyzeSkillUsage(logData.events || []),

      // 자원 관리
      resources: this.analyzeResourceManagement(logData.events || []),

      // 생존 통계
      survival: {
        deaths: logData.deaths || 0,
        damageReduced: logData.damageReduced || 0,
        defensivesUsed: logData.defensivesUsed || 0
      },

      // 스탯
      stats: {
        critical: logData.stats?.critical || 25,
        haste: logData.stats?.haste || 20,
        mastery: logData.stats?.mastery || 30,
        versatility: logData.stats?.versatility || 10
      }
    };

    return parsed;
  }

  // 전투 이벤트 추출
  extractCombatEvents(events) {
    const combatEvents = {
      casts: [],
      damage: [],
      healing: [],
      buffs: [],
      debuffs: [],
      resources: []
    };

    events.forEach(event => {
      switch (event.type) {
        case 'cast':
          combatEvents.casts.push({
            timestamp: event.timestamp,
            ability: event.ability,
            target: event.targetID
          });
          break;

        case 'damage':
          combatEvents.damage.push({
            timestamp: event.timestamp,
            ability: event.ability,
            amount: event.amount,
            critical: event.critical || false,
            target: event.targetID
          });
          break;

        case 'heal':
          combatEvents.healing.push({
            timestamp: event.timestamp,
            ability: event.ability,
            amount: event.amount,
            overheal: event.overheal || 0
          });
          break;

        case 'applybuff':
        case 'refreshbuff':
          combatEvents.buffs.push({
            timestamp: event.timestamp,
            buff: event.ability,
            duration: event.duration
          });
          break;

        case 'applydebuff':
        case 'refreshdebuff':
          combatEvents.debuffs.push({
            timestamp: event.timestamp,
            debuff: event.ability,
            target: event.targetID,
            duration: event.duration
          });
          break;

        case 'resourcechange':
          combatEvents.resources.push({
            timestamp: event.timestamp,
            resourceType: event.resourceType,
            amount: event.amount,
            waste: event.waste || 0
          });
          break;
      }
    });

    return combatEvents;
  }

  // 스킬 사용 분석
  analyzeSkillUsage(events) {
    const skillCounts = {};
    const cooldownUsage = {};
    let totalCasts = 0;

    events.forEach(event => {
      if (event.type === 'cast') {
        const skillName = event.ability?.name || 'unknown';
        skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
        totalCasts++;

        // 쿨다운 스킬 추적
        if (this.isCooldownSkill(skillName)) {
          if (!cooldownUsage[skillName]) {
            cooldownUsage[skillName] = [];
          }
          cooldownUsage[skillName].push(event.timestamp);
        }
      }
    });

    // 스킬 빈도 계산
    const skills = Object.entries(skillCounts)
      .map(([name, count]) => ({
        name,
        count,
        frequency: (count / totalCasts) * 100,
        cpm: count / ((events[events.length - 1]?.timestamp - events[0]?.timestamp) / 60000)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // 상위 10개 스킬

    // 쿨다운 효율성 계산
    const cooldownEfficiency = this.calculateCooldownEfficiency(cooldownUsage, events);

    return {
      topSkills: skills,
      totalCasts,
      cooldownEfficiency,
      castsPerMinute: totalCasts / ((events[events.length - 1]?.timestamp - events[0]?.timestamp) / 60000)
    };
  }

  // 자원 관리 분석
  analyzeResourceManagement(events) {
    let totalGenerated = 0;
    let totalWasted = 0;
    let overcapMoments = 0;
    let starvationMoments = 0;
    const resourceTimeline = [];

    events.forEach(event => {
      if (event.type === 'resourcechange') {
        totalGenerated += event.amount || 0;
        totalWasted += event.waste || 0;

        resourceTimeline.push({
          timestamp: event.timestamp,
          current: event.resourceAmount,
          max: event.maxResourceAmount
        });

        // 자원 초과 검사
        if (event.resourceAmount >= event.maxResourceAmount * 0.95) {
          overcapMoments++;
        }

        // 자원 고갈 검사
        if (event.resourceAmount <= event.maxResourceAmount * 0.1) {
          starvationMoments++;
        }
      }
    });

    const efficiency = totalGenerated > 0
      ? ((totalGenerated - totalWasted) / totalGenerated) * 100
      : 0;

    return {
      efficiency,
      totalGenerated,
      totalWasted,
      overcapRate: (overcapMoments / resourceTimeline.length) * 100,
      starvationRate: (starvationMoments / resourceTimeline.length) * 100,
      averageResource: resourceTimeline.reduce((sum, r) => sum + (r.current / r.max), 0) / resourceTimeline.length * 100
    };
  }

  // 쿨다운 효율성 계산
  calculateCooldownEfficiency(cooldownUsage, events) {
    if (!events.length) return 0;

    const fightDuration = (events[events.length - 1].timestamp - events[0].timestamp) / 1000;
    let totalEfficiency = 0;
    let cooldownCount = 0;

    // 각 쿨다운별 사용 효율성 계산
    Object.entries(cooldownUsage).forEach(([skill, uses]) => {
      const cooldownTime = this.getCooldownDuration(skill);
      if (!cooldownTime) return;

      const maxUses = Math.floor(fightDuration / cooldownTime) + 1;
      const actualUses = uses.length;
      const efficiency = Math.min(100, (actualUses / maxUses) * 100);

      totalEfficiency += efficiency;
      cooldownCount++;
    });

    return cooldownCount > 0 ? totalEfficiency / cooldownCount : 0;
  }

  // 쿨다운 시간 조회
  getCooldownDuration(skillName) {
    const cooldowns = {
      // 흑마법사
      'havoc': 45,
      'dark_soul': 120,
      'infernal': 180,
      // 죽음의 기사
      'army_of_dead': 480,
      'dark_transformation': 60,
      'unholy_assault': 90,
      // 전사
      'recklessness': 90,
      'avatar': 90,
      'ravager': 90,
      // ... 다른 스킬들
    };

    return cooldowns[skillName.toLowerCase().replace(/\s/g, '_')] || null;
  }

  // 쿨다운 스킬 여부 확인
  isCooldownSkill(skillName) {
    return this.getCooldownDuration(skillName) !== null;
  }

  // 학습용 특징 벡터 생성
  createFeatureVector(parsedLog) {
    const features = {
      // 성능 지표
      dps: parsedLog.performance.dps,
      hps: parsedLog.performance.hps || 0,
      percentile: parsedLog.performance.percentile,

      // 스탯
      critRate: parsedLog.stats.critical,
      hasteRate: parsedLog.stats.haste,
      masteryRate: parsedLog.stats.mastery,
      versatilityRate: parsedLog.stats.versatility,

      // 스킬 사용
      skill1Frequency: parsedLog.skills.topSkills[0]?.frequency || 0,
      skill2Frequency: parsedLog.skills.topSkills[1]?.frequency || 0,
      skill3Frequency: parsedLog.skills.topSkills[2]?.frequency || 0,
      cooldownEfficiency: parsedLog.skills.cooldownEfficiency,
      castsPerMinute: parsedLog.skills.castsPerMinute,

      // 자원 관리
      resourceEfficiency: parsedLog.resources.efficiency,
      overcapRate: parsedLog.resources.overcapRate,
      starvationRate: parsedLog.resources.starvationRate,
      averageResource: parsedLog.resources.averageResource,

      // 생존
      deathCount: parsedLog.survival.deaths,
      damageReduction: parsedLog.survival.damageReduced,
      defensivesUsed: parsedLog.survival.defensivesUsed,

      // 전투 지속 시간
      fightDuration: parsedLog.duration,
      itemLevel: parsedLog.player.ilvl
    };

    return features;
  }

  // 레이블 생성 (학습 목표)
  createLabels(parsedLog) {
    return {
      targetDPS: parsedLog.performance.dps,
      targetPercentile: parsedLog.performance.percentile,
      rotationScore: this.calculateRotationScore(parsedLog),
      resourceScore: parsedLog.resources.efficiency,
      survivalScore: this.calculateSurvivalScore(parsedLog),
      overallScore: this.calculateOverallScore(parsedLog)
    };
  }

  // 로테이션 점수 계산
  calculateRotationScore(log) {
    const cpm = log.skills.castsPerMinute;
    const cooldownEff = log.skills.cooldownEfficiency;

    // CPM 목표치 (클래스별로 다름)
    const targetCPM = this.getTargetCPM(log.player.class, log.player.spec);
    const cpmScore = Math.min(100, (cpm / targetCPM) * 100);

    // 가중 평균
    return (cpmScore * 0.6 + cooldownEff * 0.4);
  }

  // 생존 점수 계산
  calculateSurvivalScore(log) {
    const deathPenalty = log.survival.deaths * 20;
    const defensiveBonus = Math.min(20, log.survival.defensivesUsed * 5);
    const mitigationBonus = Math.min(30, log.survival.damageReduced / 1000000 * 10);

    return Math.max(0, 100 - deathPenalty + defensiveBonus + mitigationBonus);
  }

  // 종합 점수 계산
  calculateOverallScore(log) {
    const dpsWeight = 0.4;
    const rotationWeight = 0.25;
    const resourceWeight = 0.2;
    const survivalWeight = 0.15;

    const dpsScore = log.performance.percentile;
    const rotationScore = this.calculateRotationScore(log);
    const resourceScore = log.resources.efficiency;
    const survivalScore = this.calculateSurvivalScore(log);

    return (
      dpsScore * dpsWeight +
      rotationScore * rotationWeight +
      resourceScore * resourceWeight +
      survivalScore * survivalWeight
    );
  }

  // 목표 CPM 조회
  getTargetCPM(className, spec) {
    const targets = {
      'warlock_destruction': 30,
      'deathknight_unholy': 35,
      'warrior_fury': 40,
      'rogue_assassination': 45,
      'mage_fire': 35,
      // ... 다른 클래스
    };

    return targets[`${className}_${spec}`] || 30;
  }

  // 배치 처리
  async processBatch(logs) {
    const processedLogs = [];
    const features = [];
    const labels = [];

    for (const log of logs) {
      try {
        const parsed = await this.parseWarcraftLog(log);
        const feature = this.createFeatureVector(parsed);
        const label = this.createLabels(parsed);

        processedLogs.push(parsed);
        features.push(feature);
        labels.push(label);
      } catch (error) {
        console.error('로그 처리 실패:', error);
      }
    }

    return {
      processedLogs,
      features,
      labels,
      count: processedLogs.length
    };
  }

  // 실시간 로그 스트림 처리
  async *processStream(logStream) {
    for await (const log of logStream) {
      try {
        const parsed = await this.parseWarcraftLog(log);
        const feature = this.createFeatureVector(parsed);
        const label = this.createLabels(parsed);

        yield {
          parsed,
          feature,
          label
        };
      } catch (error) {
        console.error('스트림 로그 처리 실패:', error);
      }
    }
  }
}

export default WarcraftLogsDataProcessor;