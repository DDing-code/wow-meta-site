// 기원사 페르소나 간단한 테스트
import evokerPersona from './src/ai/personas/EvokerPersona.js';

console.log('🐉 기원사 페르소나 테스트\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 1. 페르소나 상태 확인
const status = evokerPersona.getStatus();
console.log('📊 페르소나 정보:');
console.log(`• 클래스: ${status.koreanName} (${status.class})`);
console.log(`• 레벨: ${status.level}`);
console.log(`• 신뢰도: ${(status.confidence * 100).toFixed(1)}%`);
console.log(`• 전문화: ${status.specs.join(', ')}`);

// 2. 지식 베이스 확인
console.log('\n📚 지식 베이스:');
const knowledgeCount = evokerPersona.knowledge.size;
console.log(`• 등록된 지식: ${knowledgeCount}개`);

let count = 0;
for (const [key, value] of evokerPersona.knowledge.entries()) {
  if (count < 5 && key) {
    const specInfo = key.toString().split('-');
    console.log(`  - ${specInfo[0]} ${specInfo[1] || ''}: ${value?.patch || 'N/A'}`);
    count++;
  }
}

// 3. 특성 확인
console.log('\n⚙️ 기원사 특성:');
const char = evokerPersona.characteristics;
console.log(`• 역할: ${char.role.join(', ')}`);
console.log(`• 자원: ${char.resourceType}`);
console.log(`• 방어구: ${char.armorType}`);
console.log(`• 주 스탯: ${char.mainStat}`);
console.log(`• 사거리: ${char.rangeLimit} 야드`);
console.log(`• 고유 메커니즘: ${char.uniqueMechanics.join(', ')}`);

// 4. 간단한 질문 테스트
console.log('\n💬 질문 응답 테스트:');

// 직접 메서드 호출 테스트
const testQuestion = {
  type: 'rotation',
  spec: '황폐',
  heroTalent: '불꽃형성자',
  question: '황폐 불꽃형성자 주요 스킬은 뭔가요?'
};

console.log(`질문: "${testQuestion.question}"`);

// handleQuestion 메서드 직접 호출
const response = await evokerPersona.handleQuestion({
  ...testQuestion,
  callback: (result) => {
    if (result.success) {
      console.log(`답변: ${result.message.substring(0, 200)}...`);
    } else {
      console.log('답변 생성 실패');
    }
  }
});

// 5. 새 스킬 발견 테스트
console.log('\n🔍 스킬 학습 테스트:');
const testSkillId = '361500';  // Living Flame
const testSkillName = 'Living_Flame';

console.log(`테스트 스킬: ${testSkillName} (ID: ${testSkillId})`);

// encounterNewSkill이 없을 수 있으므로 체크
if (typeof evokerPersona.encounterNewSkill === 'function') {
  try {
    const skillData = await evokerPersona.encounterNewSkill(testSkillId, testSkillName, '황폐');
    if (skillData) {
      console.log(`✅ 학습 완료: ${skillData.koreanName || testSkillName}`);
    }
  } catch (error) {
    console.log(`⚠️ 스킬 학습 중 오류: ${error.message}`);
  }
} else {
  console.log('⚠️ encounterNewSkill 메서드가 구현되지 않음');
}

// 6. 최종 상태
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const finalStatus = evokerPersona.getStatus();
console.log('✨ 테스트 완료');
console.log(`• 최종 레벨: ${finalStatus.level}`);
console.log(`• 최종 경험치: ${finalStatus.experience}`);
console.log(`• 발견한 스킬: ${finalStatus.discoveredSkillsCount}개`);

process.exit(0);