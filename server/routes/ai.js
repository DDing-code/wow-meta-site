const express = require('express');
const router = express.Router();
const fileDB = require('../services/FileDB');

// AI 전문가 상태 조회
router.get('/expert/:class/:spec', async (req, res) => {
  try {
    const { class: className, spec } = req.params;

    // FileDB에서 해당 클래스/스펙의 최신 학습 데이터 조회
    const recentData = await fileDB.getTop10Logs(className, spec, 100);

    // 통계 계산
    const stats = await fileDB.getClassStatistics(className, spec);

    res.json({
      success: true,
      expert: {
        class: className,
        spec: spec,
        statistics: stats || {
          avgDPS: 0,
          maxDPS: 0,
          count: 0
        },
        recentLearning: recentData.length,
        lastUpdate: recentData[0]?.timestamp || null
      }
    });
  } catch (error) {
    console.error('Expert 상태 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI 분석 요청
router.post('/analyze', async (req, res) => {
  try {
    const { logData, className, spec } = req.body;

    // 상위 10% 데이터와 비교
    const benchmarks = await fileDB.getTop10Logs(className, spec, 10);

    if (benchmarks.length === 0) {
      return res.json({
        success: false,
        message: '비교할 벤치마크 데이터가 없습니다'
      });
    }

    const avgBenchmark = benchmarks.reduce((sum, b) => sum + b.dps, 0) / benchmarks.length;

    // 분석 수행
    const analysis = {
      score: Math.min(100, (logData.dps / avgBenchmark) * 100),
      percentile: calculatePercentile(logData.dps, benchmarks),
      suggestions: [],
      improvements: []
    };

    // 개선 사항 도출
    if (analysis.score < 90) {
      analysis.suggestions.push('로테이션 최적화 필요');
      analysis.suggestions.push('쿨다운 정렬 개선 필요');
    }

    if (logData.deaths > 0) {
      analysis.suggestions.push('생존 기술 사용 개선 필요');
    }

    // 학습 데이터로 저장
    const learningEntry = {
      logId: `analyzed_${Date.now()}`,
      class: className,
      spec: spec,
      dps: logData.dps,
      percentile: analysis.percentile,
      source: 'manual',
      aiAnalysis: {
        score: analysis.score,
        suggestions: analysis.suggestions
      }
    };

    await new LearningData(learningEntry).save();

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('AI 분석 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 실시간 전략 제공
router.post('/strategy', async (req, res) => {
  try {
    const { className, spec, encounter, phase } = req.body;

    // DB에서 해당 보스/페이즈의 성공 패턴 조회
    const successfulLogs = await LearningData.find({
      class: className,
      spec: spec,
      percentile: { $gte: 95 }
    }).limit(5);

    if (successfulLogs.length === 0) {
      return res.json({
        success: false,
        message: '참고할 전략 데이터가 없습니다'
      });
    }

    // 로테이션 패턴 추출
    const rotationPatterns = successfulLogs.map(log => log.rotationAnalysis);

    // 가장 효율적인 패턴 선택
    const bestPattern = rotationPatterns.find(p => p && p.efficiency > 0.9) || rotationPatterns[0];

    const strategy = {
      phase: phase,
      rotation: bestPattern?.[phase] || [],
      priority: `${className} ${spec} ${phase} 우선순위`,
      tips: bestPattern?.tips || [],
      targetDPS: successfulLogs[0].dps,
      confidence: 0.85
    };

    res.json({
      success: true,
      strategy
    });

  } catch (error) {
    console.error('전략 생성 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 백분위 계산 헬퍼
function calculatePercentile(dps, benchmarks) {
  const sorted = benchmarks.map(b => b.dps).sort((a, b) => a - b);
  const index = sorted.findIndex(b => b > dps);

  if (index === -1) return 99; // 최고 성능
  if (index === 0) return 1; // 최저 성능

  return Math.round((index / sorted.length) * 100);
}

module.exports = router;