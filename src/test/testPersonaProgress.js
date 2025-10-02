// 사냥꾼 페르소나 학습 진척도 테스트
const personaInitializer = require('../ai/personas/PersonaInitializer').default;
const personaManager = require('../ai/personas/PersonaManager').default;
const personaLogAnalyzer = require('../ai/personas/PersonaLogAnalyzer').default;
const personaGuideGenerator = require('../ai/personas/PersonaGuideGenerator').default;

async function testPersonaLearning() {
  console.log('🎯 사냥꾼 페르소나 학습 진척도 테스트 시작...\n');
  console.log('=' .repeat(60));

  // 1. 페르소나 시스템 초기화
  console.log('\n📌 1단계: 페르소나 시스템 초기화');
  await personaInitializer.initialize();

  // 2. 현재 상태 확인
  console.log('\n📌 2단계: 초기 상태 확인');
  const initialStatus = personaInitializer.getStatus();
  const hunterPersona = initialStatus.personas.find(p => p.className === 'hunter');

  if (hunterPersona) {
    console.log(`✅ 사냥꾼 페르소나 발견`);
    console.log(`   - 레벨: ${hunterPersona.level}`);
    console.log(`   - 경험치: ${hunterPersona.experience}/100`);
    console.log(`   - 신뢰도: ${(hunterPersona.confidence * 100).toFixed(1)}%`);
    console.log(`   - 대화 횟수: ${hunterPersona.conversationCount}`);
  }

  // 3. 학습 시뮬레이션 - 로그 분석
  console.log('\n📌 3단계: 로그 분석을 통한 학습');
  const mockLogData = {
    dps: 95000,
    activityTime: 92,
    buffUptime: 88,
    dotUptime: 90,
    resourceWaste: 8,
    resourceCapping: 3,
    totalCasts: 450,
    castsPerMinute: 38,
    deaths: 1,
    deathEvents: [
      { time: '3:45', ability: '용의 숨결', damage: 150000, preventable: true }
    ],
    cooldowns: {
      '야수의 격노': { count: 8, efficiency: 75 },
      '혈욕': { count: 2, efficiency: 90 }
    }
  };

  const logAnalysis = await personaLogAnalyzer.analyzeLog({
    logData: mockLogData,
    className: 'hunter',
    spec: 'beast-mastery',
    analysisType: 'performance'
  });

  if (logAnalysis.success) {
    console.log(`✅ 로그 분석 완료`);
    console.log(`   - 점수: ${logAnalysis.analysis.summary.score}/100`);
    console.log(`   - 등급: ${logAnalysis.analysis.summary.grade}`);
    console.log(`   - 분석자: ${logAnalysis.analysis.metadata.analyzedBy}`);
  }

  // 4. 공략 생성 테스트
  console.log('\n📌 4단계: 공략 생성을 통한 학습');
  const guideTypes = ['딜사이클', '특성', '스탯'];

  for (const type of guideTypes) {
    const guide = await personaGuideGenerator.generateGuide({
      className: 'hunter',
      spec: 'beast-mastery',
      guideType: type
    });

    if (guide.success) {
      console.log(`✅ ${type} 공략 생성 완료`);
    }
  }

  // 5. 학습 후 상태 확인
  console.log('\n📌 5단계: 학습 후 진척도 확인');
  const finalStatus = personaInitializer.getStatus();
  const updatedHunter = finalStatus.personas.find(p => p.className === 'hunter');

  if (updatedHunter) {
    console.log(`✅ 학습 후 상태`);
    console.log(`   - 레벨: ${hunterPersona.level} → ${updatedHunter.level}`);
    console.log(`   - 경험치: ${hunterPersona.experience} → ${updatedHunter.experience}/100`);
    console.log(`   - 신뢰도: ${(hunterPersona.confidence * 100).toFixed(1)}% → ${(updatedHunter.confidence * 100).toFixed(1)}%`);
    console.log(`   - 대화 횟수: ${hunterPersona.conversationCount} → ${updatedHunter.conversationCount}`);
  }

  // 6. 통계 리포트
  console.log('\n📌 6단계: 전체 통계 리포트');
  const report = personaInitializer.getStatisticsReport();

  console.log('\n📊 통계 요약:');
  console.log(`   - 총 페르소나: ${report.summary.totalPersonas}개`);
  console.log(`   - 총 질문 처리: ${report.summary.totalQuestions}개`);
  console.log(`   - 총 조언 제공: ${report.summary.totalAdvice}개`);
  console.log(`   - 평균 신뢰도: ${report.summary.averageConfidence}%`);
  console.log(`   - 세션 시간: ${report.summary.sessionDuration}`);

  if (report.mostActive) {
    console.log(`\n🏆 가장 활발한 페르소나: ${report.mostActive.name}`);
  }

  if (report.highestLevel) {
    console.log(`🎖️ 최고 레벨 페르소나: ${report.highestLevel.name} (Lv.${report.highestLevel.level})`);
  }

  // 7. 학습 능력 테스트
  console.log('\n📌 7단계: 학습 능력 및 지식 확인');

  // 복잡한 질문으로 테스트
  const advancedQuestions = [
    {
      question: '야수 사냥꾼으로 쐐기 15단 이상에서 어떻게 플레이해야 해?',
      spec: 'beast-mastery'
    },
    {
      question: '무리의 지도자와 어둠 순찰자 중 레이드에서 뭐가 나아?',
      spec: 'beast-mastery'
    },
    {
      question: '펫이 죽었을 때 빠르게 회복하는 방법은?',
      spec: null
    }
  ];

  const persona = personaManager.personas.get('hunter');

  for (const q of advancedQuestions) {
    const response = await persona.handleQuestion({
      question: q.question,
      spec: q.spec,
      context: { situation: 'mythicplus' }
    });

    console.log(`\n❓ 질문: ${q.question}`);
    if (response.success) {
      console.log(`💡 답변 (신뢰도 ${(response.metadata.confidence * 100).toFixed(0)}%)`);
      console.log(`   ${response.message.substring(0, 150)}...`);
    }
  }

  // 8. 최종 평가
  console.log('\n' + '=' .repeat(60));
  console.log('📈 학습 진척도 최종 평가\n');

  const learningProgress = calculateLearningProgress(hunterPersona, updatedHunter);

  console.log(`전체 진척도: ${learningProgress.overall}%\n`);
  console.log(`세부 평가:`);
  console.log(`   - 경험치 증가율: ${learningProgress.experienceGain}%`);
  console.log(`   - 신뢰도 향상: ${learningProgress.confidenceImprovement}%`);
  console.log(`   - 지식 깊이: ${learningProgress.knowledgeDepth}/10`);
  console.log(`   - 응답 품질: ${learningProgress.responseQuality}/10`);

  if (learningProgress.overall >= 80) {
    console.log('\n✨ 우수: 페르소나가 매우 잘 학습하고 있습니다!');
  } else if (learningProgress.overall >= 60) {
    console.log('\n✅ 양호: 페르소나가 꾸준히 성장하고 있습니다.');
  } else {
    console.log('\n⚠️ 개선 필요: 더 많은 학습이 필요합니다.');
  }
}

// 학습 진척도 계산
function calculateLearningProgress(initial, current) {
  const experienceGain = ((current.experience - initial.experience) / 100) * 100;
  const confidenceImprovement = ((current.confidence - initial.confidence) / initial.confidence) * 100;
  const knowledgeDepth = Math.min(10, current.level);
  const responseQuality = Math.round(current.confidence * 10);

  const overall = Math.round(
    (experienceGain * 0.3) +
    (confidenceImprovement * 0.2) +
    (knowledgeDepth * 5) +
    (responseQuality * 5)
  );

  return {
    overall: Math.min(100, overall),
    experienceGain: Math.round(experienceGain),
    confidenceImprovement: Math.round(confidenceImprovement),
    knowledgeDepth,
    responseQuality
  };
}

// 테스트 실행
testPersonaLearning().catch(console.error);