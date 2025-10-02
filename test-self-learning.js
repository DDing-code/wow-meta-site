/**
 * 자가 학습 SimC 엔진 통합 테스트
 * 전체 학습 파이프라인을 테스트하고 결과를 확인
 */

import SelfLearningEngine from './src/ai/SelfLearningEngine.js';
import fs from 'fs';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

/**
 * 메인 테스트 함수
 */
async function testSelfLearningEngine() {
  console.log('🎮 WoW 자가 학습 SimC 엔진 테스트 시작\n');
  console.log('=' .repeat(60));

  // 환경 변수 확인
  const clientId = process.env.WARCRAFTLOGS_CLIENT_ID;
  const clientSecret = process.env.WARCRAFTLOGS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('❌ WarcraftLogs API 자격 증명이 없습니다.');
    console.log('💡 .env 파일에 다음을 설정하세요:');
    console.log('   WARCRAFTLOGS_CLIENT_ID=your_client_id');
    console.log('   WARCRAFTLOGS_CLIENT_SECRET=your_client_secret');
    return;
  }

  try {
    // 엔진 초기화
    console.log('🚀 자가 학습 엔진 초기화 중...\n');
    const engine = new SelfLearningEngine(clientId, clientSecret);

    // 테스트할 스펙과 보스
    const testCases = [
      { spec: 'Retribution', encounter: 2898, name: 'Broodtwister Ovi\'nax' },
      // { spec: 'Fury', encounter: 2902, name: 'Ulgrax the Devourer' },
      // { spec: 'Beast Mastery', encounter: 2917, name: 'Bloodbound Horror' }
    ];

    for (const testCase of testCases) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📊 테스트: ${testCase.spec} vs ${testCase.name}`);
      console.log('='.repeat(60));

      try {
        // 학습 파이프라인 실행
        const result = await engine.runLearningPipeline(
          testCase.spec,
          testCase.encounter
        );

        // 결과 저장
        const outputDir = './learning-results';
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // APL 저장
        const aplPath = `${outputDir}/${testCase.spec.toLowerCase()}-apl.txt`;
        const aplData = engine.aplRules.get(testCase.spec);
        if (aplData) {
          fs.writeFileSync(aplPath, aplData.text);
          console.log(`✅ APL 저장됨: ${aplPath}`);
        }

        // 패턴 저장
        const patternsPath = `${outputDir}/${testCase.spec.toLowerCase()}-patterns.json`;
        fs.writeFileSync(patternsPath, JSON.stringify(result.patterns, null, 2));
        console.log(`✅ 패턴 저장됨: ${patternsPath}`);

        // 검증 결과 저장
        const validationPath = `${outputDir}/${testCase.spec.toLowerCase()}-validation.json`;
        fs.writeFileSync(validationPath, JSON.stringify(result.validation, null, 2));
        console.log(`✅ 검증 결과 저장됨: ${validationPath}`);

        // 요약 출력
        console.log('\n📈 학습 결과 요약:');
        console.log(`   - 분석된 로그: ${result.patterns.prioritySystem?.size || 0}개 직업 패턴`);
        console.log(`   - 예상 DPS: ${Math.round(result.validation.avgDPS).toLocaleString()}`);
        console.log(`   - 일관성: ${result.validation.consistency.toFixed(1)}%`);

      } catch (error) {
        console.error(`\n❌ ${testCase.spec} 테스트 실패:`, error.message);
      }
    }

    // 전체 학습 이력 출력
    console.log('\n' + '='.repeat(60));
    console.log('📚 전체 학습 이력:');
    console.log('='.repeat(60));

    engine.learningHistory.forEach((entry, index) => {
      console.log(`\n[${index + 1}] ${new Date(entry.timestamp).toLocaleString()}`);
      console.log(`   스펙: ${entry.spec}`);
      console.log(`   분석 로그 수: ${entry.logsAnalyzed}`);
      console.log(`   발견 패턴 수: ${entry.patternsFound}`);
      console.log(`   평균 DPS: ${Math.round(entry.avgDPS).toLocaleString()}`);
      console.log(`   개선율: ${entry.improvement}%`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ 자가 학습 엔진 테스트 완료!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ 치명적 오류:', error);
    console.error(error.stack);
  }
}

// 모의 데이터로 테스트 (API 없이)
async function testWithMockData() {
  console.log('🎮 모의 데이터로 자가 학습 테스트\n');

  // 모의 로그 데이터 생성
  const mockLogs = generateMockLogs();

  // 패턴 학습 모듈 직접 테스트
  const PatternLearningModule = (await import('./src/ai/PatternLearningModule.js')).default;
  const patternLearner = new PatternLearningModule();

  console.log('🧠 패턴 학습 중...');
  const patterns = patternLearner.learnFromLogs(mockLogs);

  console.log('\n📊 학습된 패턴:');
  console.log(`   - 오프너: ${patterns.openers?.length || 0}개`);
  console.log(`   - 버스트 윈도우: ${patterns.burstWindows?.length || 0}개`);
  console.log(`   - 리소스 관리: ${patterns.resourceManagement?.size || 0}개 직업`);
  console.log(`   - 쿨다운 사용: ${patterns.cooldownUsage?.size || 0}개 직업`);
  console.log(`   - 우선순위: ${patterns.prioritySystem?.size || 0}개 직업`);

  // APL 파서 테스트
  const SimCAPLParser = (await import('./src/ai/SimCAPLParser.js')).default;
  const aplParser = new SimCAPLParser();

  const testAPL = `
actions=auto_attack
actions+=/use_items
actions+=/wake_of_ashes,if=holy_power<=2
actions+=/blade_of_justice,if=holy_power<=3
actions+=/judgment
actions+=/hammer_of_wrath,if=target.health.pct<=20
actions+=/templar_verdict,if=holy_power>=3
  `.trim();

  console.log('\n📝 APL 파싱 테스트:');
  const parsedAPL = aplParser.parse(testAPL);
  console.log('   파싱된 액션 수:', Object.keys(parsedAPL).reduce((sum, list) => sum + parsedAPL[list].length, 0));

  const compiledAPL = aplParser.compile(parsedAPL);
  console.log('   컴파일 완료:', Object.keys(compiledAPL).length, '개 리스트');

  // 게임 상태에서 다음 액션 결정 테스트
  const mockGameState = {
    resources: { holyPower: 2 },
    buffs: {},
    debuffs: {},
    cooldowns: { wake_of_ashes: { ready: true } },
    target: { health: { pct: 100 } },
    combatTime: 5000
  };

  const nextAction = aplParser.getNextAction(compiledAPL, mockGameState);
  console.log('   다음 액션:', nextAction || '없음');

  console.log('\n✅ 모의 테스트 완료!');
}

/**
 * 모의 로그 데이터 생성
 */
function generateMockLogs() {
  const logs = [];
  const abilities = [85256, 184575, 20271, 255937, 31884]; // 실제 성기사 스킬 ID

  for (let i = 0; i < 10; i++) {
    const events = [];
    let timestamp = 0;

    // 이벤트 생성
    for (let j = 0; j < 100; j++) {
      timestamp += Math.random() * 1500;
      events.push({
        timestamp,
        type: Math.random() > 0.5 ? 'cast' : 'damage',
        abilityId: abilities[Math.floor(Math.random() * abilities.length)],
        amount: Math.floor(Math.random() * 100000 + 50000),
        resources: { holyPower: Math.floor(Math.random() * 5) }
      });
    }

    logs.push({
      name: `TestPlayer${i + 1}`,
      spec: 'Retribution',
      class: 'Paladin',
      dps: Math.floor(Math.random() * 100000 + 850000),
      events,
      resourceChanges: events.filter(e => e.resources).map(e => ({
        timestamp: e.timestamp,
        current: e.resources.holyPower,
        amount: Math.random() * 3
      }))
    });
  }

  return logs;
}

// 실행 모드 선택
const args = process.argv.slice(2);
const mode = args[0] || 'mock';

if (mode === 'real') {
  console.log('🌐 실제 WarcraftLogs API를 사용한 테스트\n');
  testSelfLearningEngine();
} else {
  console.log('🎯 모의 데이터를 사용한 테스트\n');
  testWithMockData();
}