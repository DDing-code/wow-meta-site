const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const fileDB = require('../services/FileDB');
const learningCache = require('../services/LearningCache');

// MongoDB 대신 파일 DB 사용

// 학습 데이터 저장 (실시간)
router.post('/save', async (req, res) => {
  try {
    const learningData = req.body;

    // FileDB에 저장
    const success = await fileDB.saveLearningData(learningData);

    if (success) {
      res.json({ success: true, message: '학습 데이터 저장 완료' });
    } else {
      res.status(500).json({ error: '저장 실패' });
    }
  } catch (error) {
    console.error('학습 데이터 저장 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 배치 저장 (여러 개 한번에)
router.post('/save-batch', async (req, res) => {
  try {
    const { logs } = req.body;

    const results = {
      saved: 0,
      updated: 0,
      errors: 0
    };

    for (const log of logs) {
      try {
        const success = await fileDB.saveLearningData(log);
        if (success) {
          results.saved++;
        } else {
          results.errors++;
        }
      } catch (err) {
        results.errors++;
        console.error('개별 로그 저장 실패:', err);
      }
    }

    console.log(`📊 배치 저장 완료: 저장 ${results.saved}, 업데이트 ${results.updated}, 오류 ${results.errors}`);
    res.json({ success: true, results });
  } catch (error) {
    console.error('배치 저장 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 상위 10% 로그 조회
router.get('/top10/:class/:spec', async (req, res) => {
  try {
    const { class: className, spec } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const logs = await fileDB.getTop10Logs(className, spec, limit);

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('상위 10% 로그 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 클래스별 통계 조회
router.get('/statistics/:class/:spec', async (req, res) => {
  try {
    const { class: className, spec } = req.params;

    const stats = await fileDB.getClassStatistics(className, spec);

    res.json({
      success: true,
      statistics: stats[0] || {
        avgDPS: 0,
        maxDPS: 0,
        minDPS: 0,
        count: 0,
        avgPercentile: 0
      }
    });
  } catch (error) {
    console.error('통계 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 최근 학습 데이터 조회
router.get('/recent', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const logs = await fileDB.getRecentLearning(hours);

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('최근 학습 데이터 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 학습 데이터 삭제 (오래된 데이터 정리)
router.delete('/cleanup', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const deleted = await fileDB.cleanup(days);

    res.json({
      success: true,
      deleted: deleted
    });
  } catch (error) {
    console.error('데이터 정리 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI 학습을 위한 전처리된 데이터 가져오기 (보스 패턴 통합)
router.post('/fetch', async (req, res) => {
  try {
    const { class: className, spec: specName, limit = 100, minPercentile = 75 } = req.body;

    console.log(`📊 AI 학습 데이터 요청: ${className} ${specName}, 상위 ${100-minPercentile}% 플레이어`);

    // 캐시 확인
    const cachedData = learningCache.get(className, specName);
    if (cachedData) {
      console.log(`✅ 캐시에서 학습 데이터 반환`);
      return res.json(cachedData);
    }

    // WarcraftLogs API v2 우선 사용, 실패시 Puppeteer 스크래핑
    let completeData = [];
    let dataSource = null;

    try {
      // 1. API v2 시도 (우선순위)
      console.log(`🔄 WarcraftLogs API v2로 실제 데이터 가져오는 중...`);
      const apiClient = require('../warcraftlogs-api-client');

      const apiData = await apiClient.fetchTopPlayersForTraining(44, limit);

      if (apiData && apiData.length > 0) {
        console.log(`✅ API v2로 ${apiData.length}개 학습 데이터 수집 성공`);
        dataSource = 'warcraftlogs-api-v2';

        // API 데이터를 completeData 형식으로 변환
        completeData = apiData.map(data => ({
          player: {
            name: data.playerName,
            class: data.className,
            spec: data.specName,
            guild: data.guildName,
            server: data.server,
            dps: data.dps
          },
          logs: [{
            dps: data.dps,
            percentile: 99,
            boss: data.bossName,
            date: data.timestamp,
            reportUrl: `https://www.warcraftlogs.com/reports/${data.reportCode}#fight=${data.fightID}`
          }],
          latestFightAnalysis: {
            duration: `${Math.floor(data.duration / 60000)}:${Math.floor((data.duration % 60000) / 1000).toString().padStart(2, '0')}`,
            totalDamage: data.dps * (data.duration / 1000),
            reportCode: data.reportCode,
            fightID: data.fightID
          }
        }));
      }
    } catch (apiError) {
      console.log(`⚠️ API v2 실패: ${apiError.message}, Puppeteer로 폴백`);

      // 2. Puppeteer 스크래핑 폴백
      try {
        const playerLogsClient = require('../warcraftlogs-player-logs');
        console.log(`📊 Puppeteer로 11.2 패치 Manaforge Omega 랭킹 스크래핑 중...`);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('스크래핑 타임아웃')), 15000)
        );

        completeData = await Promise.race([
          playerLogsClient.fetchCompleteData(44, 10),
          timeoutPromise
        ]);

        if (completeData && completeData.length > 0) {
          dataSource = 'warcraftlogs-puppeteer';
          console.log(`✅ Puppeteer로 ${completeData.length}명 데이터 수집`);
        }
      } catch (puppeteerError) {
        console.error('❌ Puppeteer 스크래핑도 실패:', puppeteerError.message);
      }
    }

    // 3. real-player-rankings.json 파일 폴백
    if (!completeData || completeData.length === 0) {
      console.log('📊 real-player-rankings.json 파일에서 Manaforge Omega 데이터 로드 시도...');

      try {
        const fs = require('fs');
        const path = require('path');
        const rankingsFilePath = path.join(__dirname, '..', 'real-player-rankings.json');

        if (fs.existsSync(rankingsFilePath)) {
          const rankingsData = JSON.parse(fs.readFileSync(rankingsFilePath, 'utf8'));

          if (rankingsData && rankingsData.players) {
            console.log(`✅ real-player-rankings.json에서 ${rankingsData.players.length}명 데이터 로드`);
            dataSource = 'real-player-rankings-file';

            // 파일 데이터를 completeData 형식으로 변환
            completeData = rankingsData.players.map(player => ({
              player: {
                name: player.name,
                class: player.class,
                spec: player.spec,
                guild: player.guild,
                server: player.server,
                dps: player.dps
              },
              logs: [{
                dps: player.dps,
                percentile: player.percentile,
                boss: player.boss,
                date: player.date,
                reportUrl: 'https://www.warcraftlogs.com/reports/manaforge'
              }],
              latestFightAnalysis: {
                duration: '3:30',
                totalDamage: player.dps * 210,
                reportCode: 'manaforge-data',
                fightID: player.rank
              }
            }));
          }
        } else {
          console.log('⚠️ real-player-rankings.json 파일이 없음, 실제 API 호출 시도...');

          // 실제 API로 데이터 가져오기
          const RealDataFetcher = require('../fetch-real-api-data');
          const fetcher = new RealDataFetcher();
          const realRankings = await fetcher.fetchRealRankings();

          // DPS와 HPS 데이터 모두 처리
          if (realRankings && (realRankings.dps || realRankings.hps)) {
            const allRankings = [];

            // DPS 데이터 처리
            if (realRankings.dps && realRankings.dps.length > 0) {
              realRankings.dps.forEach(player => {
                allRankings.push({
                  ...player,
                  metricType: 'dps',
                  metricValue: player.dps
                });
              });
            }

            // HPS 데이터 처리
            if (realRankings.hps && realRankings.hps.length > 0) {
              realRankings.hps.forEach(player => {
                allRankings.push({
                  ...player,
                  metricType: 'hps',
                  metricValue: player.hps
                });
              });
            }

            completeData = allRankings.map(player => ({
              player: {
                name: player.name,
                class: player.class,
                spec: player.spec,
                guild: player.guild,
                server: player.server,
                dps: player.metricType === 'dps' ? player.metricValue : 0,
                hps: player.metricType === 'hps' ? player.metricValue : 0,
                metricType: player.metricType
              },
              logs: [{
                dps: player.metricType === 'dps' ? player.metricValue : 0,
                hps: player.metricType === 'hps' ? player.metricValue : 0,
                percentile: player.percentile,
                boss: 'Manaforge Omega Boss',
                date: new Date(),
                reportUrl: `https://www.warcraftlogs.com/reports/${player.reportCode}#fight=${player.fightID}`
              }],
              latestFightAnalysis: {
                duration: '3:30',
                totalDamage: player.metricValue * 210,
                metricType: player.metricType,
                reportCode: player.reportCode || 'api-data',
                fightID: player.fightID || 1
              }
            }));

            dataSource = 'warcraftlogs-api-real';
          } else {
            // API도 실패한 경우 에러 반환 (시뮬레이션 데이터 사용 안함!)
            return res.status(503).json({
              error: '실제 데이터를 가져올 수 없습니다',
              message: 'WarcraftLogs API 접근 실패',
              dataSource: 'none'
            });
          }
        }
      } catch (fileError) {
        console.error('❌ real-player-rankings.json 로드 실패:', fileError);

        return res.status(500).json({
          error: 'WarcraftLogs 데이터를 가져올 수 없습니다',
          message: 'API v2, Puppeteer, 파일 로드 모두 실패했습니다',
          dataSource: 'none'
        });
      }
    }

    if (completeData && completeData.length > 0) {
        console.log(`✅ ${completeData.length}명의 실제 플레이어 데이터 수집 완료`);

        // 학습 데이터 형식으로 변환
        const learningData = [];

        for (const playerData of completeData) {
          const { player, logs, latestFightAnalysis } = playerData;

          // 각 로그를 학습 데이터로 변환
          if (logs && logs.length > 0) {
            logs.forEach(log => {
              const trainingEntry = {
                playerName: player.name,
                guildName: player.guild || 'Unknown',
                percentile: log.percentile || 95,
                dps: log.dps || player.dps || 0,
                hps: log.hps || player.hps || 0,
                metricType: player.metricType || 'dps',
                timestamp: new Date(),

                // 전투 상태 (보스 패턴 적용)
                targetHealthPercent: getBossPhaseHealth(log.boss),
                playerHealthPercent: 90,
                enemyCount: getBossTargetCount(log.boss),
                combatTime: 180, // 평균 전투 시간
                raidBuffs: true,
                bloodlust: log.percentile > 90,

                // 리소스 상태
                resources: {
                  primary: 80,
                  secondary: 60
                },

                // 쿨다운 상태 (클래스별)
                cooldowns: getClassCooldowns(className, specName),

                // 버프 상태 (클래스별)
                buffs: getClassBuffs(className, specName),

                // 스킬 정보 (실제 분석 데이터 사용)
                nextSkill: latestFightAnalysis?.skills?.[0]?.name || 'auto_attack',
                dpsEfficiency: log.percentile ? log.percentile / 100 : 0.9,

                // 추가 컨텍스트
                majorCooldownsActive: log.percentile > 85,
                targetDebuffs: 3,
                playerBuffCount: 5,
                combatPhase: 'execute',

                // 실제 로그 정보
                bossName: log.boss || 'Unknown',
                reportUrl: log.reportUrl,
                date: log.date,

                // 전투 분석 데이터
                fightDuration: latestFightAnalysis?.duration || '3:00',
                totalDamage: latestFightAnalysis?.totalDamage || log.dps * 180,
                topSkills: latestFightAnalysis?.skills || []
              };

              learningData.push(trainingEntry);
            });
          }
        }

        if (learningData.length > 0) {
          console.log(`✅ ${learningData.length}개 학습 데이터 생성 완료`);

          // FileDB에 저장
          for (const data of learningData) {
            await fileDB.saveLearningData(data);
          }

          // 응답 데이터 준비
          const responseData = {
            success: true,
            logs: learningData.slice(0, limit),
            count: learningData.length,
            className,
            specName,
            dataSource: dataSource || 'warcraftlogs-player-logs',
            message: dataSource === 'real-player-rankings-file'
              ? `Manaforge Omega 실제 상위 ${completeData.length}명 플레이어 데이터 (11.2 패치)`
              : `실제 상위 ${completeData.length}명 플레이어의 전투 로그 데이터`
          };

          // 캐시에 저장
          learningCache.set(className, specName, responseData);

          return res.json(responseData);
        }
      }

      // 데이터를 가져오지 못한 경우
      console.log('⚠️ 플레이어 로그 데이터를 가져오지 못함');

      // 브라우저 닫기
      try {
        const playerLogsClient = require('../warcraftlogs-player-logs');
        await playerLogsClient.close();
      } catch (e) {
        // 무시
      }

      return res.status(503).json({
        success: false,
        error: '플레이어 로그 데이터 수집 실패',
        message: 'WarcraftLogs에서 데이터를 가져올 수 없습니다'
      });

    } catch (fetchError) {
      console.log(`❌ 플레이어 로그 수집 실패: ${fetchError.message}`);

      // 브라우저 닫기
      try {
        const playerLogsClient = require('../warcraftlogs-player-logs');
        await playerLogsClient.close();
      } catch (e) {
        // 무시
      }

      return res.status(503).json({
        success: false,
        error: '플레이어 로그 수집 실패',
        message: fetchError.message
      });
    }
});

// 캐시된 학습 데이터 가져오기
router.get('/cached/:className/:specName', async (req, res) => {
  try {
    const { className, specName } = req.params;

    // FileDB에서 최근 데이터 가져오기
    const logs = await fileDB.getTop10Logs(className, specName, 100);

    if (!logs || logs.length === 0) {
      // 데이터가 없으면 에러 반환
      return res.status(404).json({
        success: false,
        error: '캐시된 데이터 없음',
        className,
        specName
      });
    }

    const trainingLogs = logs.map(log => convertToTrainingFormat(log, className, specName));

    res.json({
      success: true,
      logs: trainingLogs,
      count: trainingLogs.length,
      className,
      specName,
      cached: true
    });
  } catch (error) {
    console.error('캐시된 데이터 로드 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 실제 로그를 학습 형태로 변환 - 실제 로그 데이터만 사용
function convertToTrainingFormat(log, className, specName) {
  // 실제 로그 데이터만 사용 (시뮬레이션 없음)
  if (!log.dps) {
    // DPS 데이터가 없으면 null 반환
    return null;
  }

  return {
    playerName: log.playerName || 'Unknown',
    guildName: log.guildName || 'Unknown',
    percentile: log.percentile || 0,
    dps: log.dps,  // 실제 DPS 값만 사용 (폴백 없음)
    timestamp: log.timestamp || new Date(),

    // 실제 로그 데이터만 포함
    // 추가 전투 데이터는 실제 로그에서 가져와야 함
    className: className,
    specName: specName,

    // 실제 로그에서 가져온 추가 데이터만 사용
    reportCode: log.reportCode || null,
    fightID: log.fightID || null,
    serverName: log.serverName || null
  };
}


// 보스별 헬스 퍼센트 (페이즈에 따라)
function getBossPhaseHealth(bossName) {
  const bossHealthMap = {
    'Plexus Sentinel': 50,
    'Loomithar': 30, // 많은 쫄 처리
    'Xy\'mox': 40, // 메커닉 집중
    'Zalazar': 60, // 2타겟
    'Dimensius': 35 // 복잡한 멀티페이즈
  };
  return bossHealthMap[bossName] || 50;
}

// 보스별 타겟 수
function getBossTargetCount(bossName) {
  const targetCountMap = {
    'Plexus Sentinel': 1,
    'Loomithar': 5, // 쫄 처리
    'Xy\'mox': 1,
    'Zalazar': 2, // 2타겟
    'Dimensius': 3 // 페이즈별 다름
  };
  return targetCountMap[bossName] || 1;
}

// 클래스별 쿨다운 상태
function getClassCooldowns(className, specName) {
  const cooldownMap = {
    'warrior': {
      'fury': { recklessness: 0, avatar: 1, bladestorm: 0 },
      'arms': { colossus_smash: 0, avatar: 1, bladestorm: 0 },
      'protection': { shield_wall: 1, last_stand: 0 }
    },
    'hunter': {
      'beastmastery': { bestial_wrath: 0, aspect_of_the_wild: 1 },
      'marksmanship': { trueshot: 0, double_tap: 1 },
      'survival': { coordinated_assault: 0, wildfire_bomb: 1 }
    },
    'deathknight': {
      'unholy': { army_of_the_dead: 1, apocalypse: 0, unholy_assault: 0 },
      'frost': { pillar_of_frost: 0, breath_of_sindragosa: 1 },
      'blood': { dancing_rune_weapon: 0, vampiric_blood: 1 }
    },
    'paladin': {
      'retribution': { avenging_wrath: 0, crusade: 1, wake_of_ashes: 0 },
      'holy': { avenging_wrath: 1, holy_avenger: 0 },
      'protection': { ardent_defender: 0, guardian_of_ancient_kings: 1 }
    }
  };

  const classData = cooldownMap[className];
  if (!classData) return {};
  return classData[specName] || {};
}

// 클래스별 버프 상태
function getClassBuffs(className, specName) {
  const buffMap = {
    'warrior': {
      'fury': { enrage: 1, recklessness: 0, whirlwind: 1 },
      'arms': { deep_wounds: 1, sweeping_strikes: 0, colossus_smash: 0 },
      'protection': { shield_block: 1, ignore_pain: 1 }
    },
    'hunter': {
      'beastmastery': { frenzy: 1, beast_cleave: 0, barbed_shot: 1 },
      'marksmanship': { precise_shots: 1, trick_shots: 0, steady_focus: 1 },
      'survival': { mongoose_bite: 1, tip_of_the_spear: 0 }
    },
    'deathknight': {
      'unholy': { sudden_doom: 0, dark_transformation: 1, festering_wounds: 1 },
      'frost': { icy_talons: 1, killing_machine: 0, rime: 0 },
      'blood': { bone_shield: 1, blood_shield: 1 }
    },
    'paladin': {
      'retribution': { divine_purpose: 0, art_of_war: 1, empyrean_power: 0 },
      'holy': { infusion_of_light: 1, divine_favor: 0 },
      'protection': { shining_light: 1, redoubt: 1 }
    }
  };

  const classData = buffMap[className];
  if (!classData) return {};
  return classData[specName] || {};
}

// 캐시 상태 조회
router.get('/cache/status', (req, res) => {
  const status = learningCache.getStatus();
  res.json({
    success: true,
    cache: status
  });
});

// 캐시 삭제
router.delete('/cache/clear', (req, res) => {
  const { className, specName } = req.query;

  if (className && specName) {
    learningCache.delete(className, specName);
    res.json({
      success: true,
      message: `${className} ${specName} 캐시 삭제 완료`
    });
  } else {
    learningCache.clear();
    res.json({
      success: true,
      message: '모든 캐시 삭제 완료'
    });
  }
});

module.exports = router;
