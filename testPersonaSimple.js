// 사냥꾼 페르소나 학습 진척도 간단 테스트
console.log('🎯 사냥꾼 페르소나 학습 진척도 시뮬레이션\n');
console.log('=' .repeat(60));

// 초기 상태
const initialState = {
  className: 'hunter',
  koreanName: '사냥꾼',
  level: 1,
  experience: 0,
  confidence: 0.5,
  conversationCount: 0
};

console.log('\n📌 1단계: 초기 상태');
console.log(`   - 클래스: ${initialState.koreanName}`);
console.log(`   - 레벨: ${initialState.level}`);
console.log(`   - 경험치: ${initialState.experience}/100`);
console.log(`   - 신뢰도: ${(initialState.confidence * 100).toFixed(1)}%`);
console.log(`   - 대화 횟수: ${initialState.conversationCount}`);

// 학습 시뮬레이션
console.log('\n📌 2단계: 학습 시뮬레이션');

// 로그 분석 학습 (경험치 +15)
console.log('\n✅ 로그 분석 수행...');
const afterLogAnalysis = {
  ...initialState,
  experience: initialState.experience + 15,
  conversationCount: initialState.conversationCount + 1
};
console.log(`   로그 분석 완료: 경험치 +15 (${afterLogAnalysis.experience}/100)`);

// 질문 답변 학습 (경험치 +10 x 3)
console.log('\n✅ 질문 답변 수행...');
const questions = [
  '야수 사냥꾼 로테이션 알려줘',
  '어떤 펫을 사용해야 해?',
  '무리의 지도자랑 어둠 순찰자 중 뭐가 나아?'
];

let currentExperience = afterLogAnalysis.experience;
let conversationCount = afterLogAnalysis.conversationCount;

for (const question of questions) {
  currentExperience += 10;
  conversationCount++;
  console.log(`   질문: "${question}"`);
  console.log(`   답변 완료: 경험치 +10 (${currentExperience}/100)`);
}

// 공략 생성 학습 (경험치 +5 x 3)
console.log('\n✅ 공략 생성 수행...');
const guides = ['딜사이클', '특성', '스탯'];

for (const guide of guides) {
  currentExperience += 5;
  conversationCount++;
  console.log(`   ${guide} 공략 생성: 경험치 +5 (${currentExperience}/100)`);
}

// 레벨업 체크
const finalExperience = currentExperience;
const levelUps = Math.floor(finalExperience / 100);
const remainingExp = finalExperience % 100;

const finalState = {
  ...initialState,
  level: initialState.level + levelUps,
  experience: remainingExp,
  confidence: Math.min(0.95, initialState.confidence + (levelUps * 0.05)),
  conversationCount: conversationCount
};

console.log('\n📌 3단계: 학습 후 최종 상태');
console.log(`   - 레벨: ${initialState.level} → ${finalState.level}`);
console.log(`   - 경험치: ${initialState.experience} → ${finalState.experience}/100`);
console.log(`   - 신뢰도: ${(initialState.confidence * 100).toFixed(1)}% → ${(finalState.confidence * 100).toFixed(1)}%`);
console.log(`   - 대화 횟수: ${initialState.conversationCount} → ${finalState.conversationCount}`);
console.log(`   - 총 획득 경험치: ${finalExperience}`);

// 학습 능력 평가
console.log('\n📌 4단계: 학습 능력 평가');

const knowledgeBase = {
  'beast-mastery': {
    rotation: ['야수의 격노', '날카로운 사격', '살상 명령', '코브라 사격'],
    stats: ['치명타', '가속', '특화', '유연성'],
    pets: ['영혼 야수', '클렉시', '혈족인도자'],
    heroTalents: '무리의 지도자'
  },
  'marksmanship': {
    rotation: ['정조준', '조준 사격', '속사', '신비한 사격'],
    stats: ['치명타', '특화', '가속', '유연성'],
    heroTalents: '파수꾼'
  },
  'survival': {
    rotation: ['맹금 공격', '도살', '와일드파이어 폭탄', '살상 명령'],
    stats: ['가속', '치명타', '유연성', '특화'],
    heroTalents: '파수꾼'
  }
};

console.log('\n📊 보유 지식:');
for (const [spec, knowledge] of Object.entries(knowledgeBase)) {
  console.log(`\n   ${spec === 'beast-mastery' ? '야수' : spec === 'marksmanship' ? '사격' : '생존'}:`);
  console.log(`     - 딜사이클 지식: ${knowledge.rotation.length}개 스킬`);
  console.log(`     - 스탯 우선순위: ${knowledge.stats.join(' > ')}`);
  if (knowledge.pets) {
    console.log(`     - 추천 펫: ${knowledge.pets.join(', ')}`);
  }
  console.log(`     - 영웅 특성: ${knowledge.heroTalents}`);
}

// 최종 진척도 계산
console.log('\n' + '=' .repeat(60));
console.log('📈 학습 진척도 최종 평가\n');

const progressScore = {
  experienceGain: (finalExperience / 100) * 25, // 최대 25점
  levelProgress: finalState.level * 20, // 레벨당 20점
  confidenceScore: finalState.confidence * 30, // 최대 30점
  knowledgeDepth: 25 // 지식 보유로 25점
};

const totalScore = Math.round(
  progressScore.experienceGain +
  progressScore.levelProgress +
  progressScore.confidenceScore +
  progressScore.knowledgeDepth
);

console.log(`전체 진척도: ${totalScore}%\n`);
console.log('세부 평가:');
console.log(`   - 경험치 획득: ${progressScore.experienceGain.toFixed(1)}/25`);
console.log(`   - 레벨 성장: ${progressScore.levelProgress}/20`);
console.log(`   - 신뢰도: ${progressScore.confidenceScore.toFixed(1)}/30`);
console.log(`   - 지식 깊이: ${progressScore.knowledgeDepth}/25`);

if (totalScore >= 80) {
  console.log('\n✨ 우수: 페르소나가 매우 잘 학습하고 있습니다!');
} else if (totalScore >= 60) {
  console.log('\n✅ 양호: 페르소나가 꾸준히 성장하고 있습니다.');
} else {
  console.log('\n⚠️ 개선 필요: 더 많은 학습이 필요합니다.');
}

// 예상 답변 품질
console.log('\n📝 현재 레벨에서 제공 가능한 답변 예시:\n');

if (finalState.level >= 1) {
  console.log('❓ 질문: "야수 사냥꾼 로테이션 알려줘"');
  console.log(`💡 답변 (신뢰도 ${(finalState.confidence * 100).toFixed(0)}%):`);
  console.log('   야수의 격노로 버스트를 시작하고, 날카로운 사격으로 광분 3스택을');
  console.log('   유지하면서 살상 명령을 쿨마다 사용하세요. 빈 시간에는 코브라 사격으로');
  console.log('   집중을 소모하여 살상 명령 쿨다운을 감소시키세요.\n');
}

if (finalState.level >= 2) {
  console.log('❓ 질문: "무리의 지도자와 어둠 순찰자 중 뭐가 나아?"');
  console.log(`💡 답변 (신뢰도 ${(finalState.confidence * 100).toFixed(0)}%):`);
  console.log('   야수 사냥꾼은 레이드에서 무리의 지도자가 강력합니다. 펫 데미지');
  console.log('   증가와 살상 명령 강화로 단일 타겟 딜이 우수합니다. 쐐기에서는');
  console.log('   광역 상황이 많아 두 영웅 특성 모두 사용 가능합니다.\n');
}

console.log('=' .repeat(60));
console.log('\n✅ 사냥꾼 페르소나 학습 진척도 테스트 완료!');