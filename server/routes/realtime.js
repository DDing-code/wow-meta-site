const express = require('express');
const router = express.Router();
const realTimeService = require('../services/RealTimeDataService');

// 실시간 순위 조회
router.get('/rankings', async (req, res) => {
  try {
    // 캐시된 순위 먼저 확인
    let rankings = realTimeService.getCachedRankings();

    if (!rankings) {
      // 캐시가 없으면 새로 가져오기
      console.log('캐시된 순위가 없음, 새로 가져오는 중...');
      const result = await realTimeService.performUpdate();

      if (result.success) {
        rankings = result.rankings;
      } else {
        return res.status(500).json({
          error: '순위 데이터를 가져올 수 없습니다',
          message: result.error
        });
      }
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      rankings
    });

  } catch (error) {
    console.error('Rankings 조회 오류:', error);
    res.status(500).json({
      error: error.message,
      note: 'WarcraftLogs API 연결을 확인하세요'
    });
  }
});

// 특정 스펙 상세 정보
router.get('/spec/:className/:specName', async (req, res) => {
  try {
    const { className, specName } = req.params;
    const specKey = `${className.toLowerCase()}_${specName.toLowerCase()}`;

    const rawData = realTimeService.getCachedRawData();
    if (!rawData) {
      return res.status(404).json({
        error: '데이터가 없습니다. 먼저 /api/realtime/update를 호출하세요'
      });
    }

    const dpsData = rawData.dpsRankings[specKey];
    const hpsData = rawData.hpsRankings[specKey];

    if (!dpsData && !hpsData) {
      return res.status(404).json({
        error: '해당 스펙의 데이터를 찾을 수 없습니다'
      });
    }

    res.json({
      success: true,
      spec: specKey,
      zone: rawData.zone,
      timestamp: rawData.timestamp,
      dps: dpsData || null,
      hps: hpsData || null
    });

  } catch (error) {
    console.error('Spec 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 수동 업데이트 트리거
router.post('/update', async (req, res) => {
  try {
    console.log('수동 업데이트 요청 받음');
    const result = await realTimeService.performUpdate();

    if (result.success) {
      res.json({
        success: true,
        message: '업데이트 완료',
        dataCount: result.dataCount,
        rankings: result.rankings
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Update 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 자동 업데이트 시작
router.post('/auto-update/start', async (req, res) => {
  try {
    const { interval = 30 } = req.body; // 기본 30분

    realTimeService.startRealTimeUpdates(interval);

    res.json({
      success: true,
      message: `실시간 업데이트 시작: ${interval}분마다 갱신`
    });

  } catch (error) {
    console.error('Auto-update start 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 자동 업데이트 중지
router.post('/auto-update/stop', async (req, res) => {
  try {
    realTimeService.stopRealTimeUpdates();

    res.json({
      success: true,
      message: '실시간 업데이트 중지됨'
    });

  } catch (error) {
    console.error('Auto-update stop 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 상위 성능자 조회
router.get('/top-performers', async (req, res) => {
  try {
    const rawData = realTimeService.getCachedRawData();
    if (!rawData) {
      return res.status(404).json({
        error: '데이터가 없습니다. 먼저 /api/realtime/update를 호출하세요'
      });
    }

    const topPerformers = rawData.topPerformers || [];

    res.json({
      success: true,
      zone: rawData.zone,
      timestamp: rawData.timestamp,
      topPerformers: topPerformers.slice(0, 20) // 상위 20개
    });

  } catch (error) {
    console.error('Top performers 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 티어 리스트 (실시간)
router.get('/tier-list', async (req, res) => {
  try {
    const rankings = realTimeService.getCachedRankings();
    if (!rankings) {
      return res.status(404).json({
        error: '순위 데이터가 없습니다. 먼저 /api/realtime/update를 호출하세요'
      });
    }

    // 티어별로 그룹화
    const tierList = {
      'S+': { dps: [], hps: [], tanks: [] },
      'S': { dps: [], hps: [], tanks: [] },
      'A+': { dps: [], hps: [], tanks: [] },
      'A': { dps: [], hps: [], tanks: [] },
      'B+': { dps: [], hps: [], tanks: [] },
      'B': { dps: [], hps: [], tanks: [] },
      'C': { dps: [], hps: [], tanks: [] },
      'D': { dps: [], hps: [], tanks: [] }
    };

    // DPS 분류
    rankings.dps.forEach(spec => {
      if (tierList[spec.tier]) {
        tierList[spec.tier].dps.push({
          spec: spec.spec,
          average: spec.average,
          topPercentile: spec.topPercentile,
          rank: spec.rank
        });
      }
    });

    // HPS 분류
    rankings.hps.forEach(spec => {
      if (tierList[spec.tier]) {
        tierList[spec.tier].hps.push({
          spec: spec.spec,
          average: spec.average,
          topPercentile: spec.topPercentile,
          rank: spec.rank
        });
      }
    });

    // 탱커 분류
    rankings.tanks.forEach(spec => {
      if (tierList[spec.tier]) {
        tierList[spec.tier].tanks.push({
          spec: spec.spec,
          average: spec.average,
          topPercentile: spec.topPercentile,
          rank: spec.rank
        });
      }
    });

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      tierList
    });

  } catch (error) {
    console.error('Tier list 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;