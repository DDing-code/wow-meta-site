// 기원사 페르소나 테스트 스크립트
import evokerPersona from './src/ai/personas/EvokerPersona.js';
import moduleEventBus from './src/services/ModuleEventBus.js';

console.log('🐉 기원사 페르소나 활성화 중...\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 기원사 페르소나 상태');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const status = evokerPersona.getStatus();
console.log(`클래스: ${status.koreanName} (${status.class})`);
console.log(`레벨: ${status.level}`);
console.log(`경험치: ${status.experience}`);
console.log(`신뢰도: ${(status.confidence * 100).toFixed(1)}%`);
console.log(`전문화: ${status.specs.join(', ')}`);
console.log(`성격: ${status.personalityType}`);
console.log(`발견한 스킬: ${status.discoveredSkillsCount}개`);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎯 지원 가능한 콘텐츠');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 각 전문화별 영웅 특성 표시
const specs = {
  '황폐': ['불꽃형성자 (Flameshaper)', '비늘사령관 (Scalecommander)'],
  '보존': ['불꽃형성자 (Flameshaper)', '시간 감시자 (Chronowarden)'],
  '증강': ['시간 감시자 (Chronowarden)', '비늘사령관 (Scalecommander)']
};

for (const [spec, heroTalents] of Object.entries(specs)) {
  console.log(`\n${spec} (${spec === '황폐' ? 'Devastation' : spec === '보존' ? 'Preservation' : 'Augmentation'}):`);
  heroTalents.forEach(talent => {
    console.log(`  • ${talent}`);
  });
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💬 대화 예시');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 질문 테스트
async function testQuestion() {
  const questions = [
    {
      type: 'rotation',
      spec: '황폐',
      heroTalent: '불꽃형성자',
      question: '황폐 불꽃형성자 오프닝 로테이션이 어떻게 되나요?'
    },
    {
      type: 'stats',
      spec: '보존',
      heroTalent: '시간 감시자',
      question: '보존 시간 감시자 스탯 우선순위가 뭔가요?'
    },
    {
      type: 'build',
      spec: '증강',
      heroTalent: '비늘사령관',
      question: '증강 비늘사령관 레이드 빌드 알려주세요'
    }
  ];

  for (const q of questions) {
    console.log(`\n질문: "${q.question}"`);

    await new Promise((resolve) => {
      moduleEventBus.emit('question-evoker', {
        type: q.type,
        spec: q.spec,
        heroTalent: q.heroTalent,
        question: q.question,
        callback: (response) => {
          if (response.success) {
            console.log(`답변: ${response.message.substring(0, 200)}...`);
          }
          resolve();
        }
      });
    });
  }
}

// 새 스킬 발견 테스트
async function testNewSkillDiscovery() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 새 스킬 발견 시뮬레이션');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 테스트용 스킬 (실제로는 존재하지 않을 수 있음)
  const testSkills = [
    { id: '999999', name: 'Test_Skill', spec: '황폐' },
    { id: '357208', name: 'Fire_Breath', spec: '황폐' },  // 실제 스킬
    { id: '361500', name: 'Living_Flame', spec: '공용' }  // 실제 스킬
  ];

  for (const skill of testSkills) {
    console.log(`\n테스트: ${skill.name} (ID: ${skill.id})`);

    try {
      const result = await evokerPersona.encounterNewSkill(
        skill.id,
        skill.name,
        skill.spec
      );

      if (result) {
        console.log(`✅ 스킬 학습 완료: ${result.koreanName}`);
      } else {
        console.log(`⏳ 스킬 번역 대기 중...`);
      }
    } catch (error) {
      console.log(`❌ 오류: ${error.message}`);
    }
  }
}

// 페르소나 지식 확인
function checkKnowledge() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📚 페르소나 지식 베이스');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const knowledge = evokerPersona.knowledge;

  console.log(`\n등록된 전문화 지식: ${knowledge.size}개`);
  for (const [key, value] of knowledge.entries()) {
    if (key !== 'skills') {
      console.log(`  • ${key}: ${value.patch || 'N/A'}`);
    }
  }

  // 학습한 스킬 확인
  if (knowledge.has('skills')) {
    const skills = knowledge.get('skills');
    console.log(`\n학습한 스킬: ${skills.size}개`);

    let count = 0;
    for (const [id, skill] of skills.entries()) {
      if (count < 5) {  // 처음 5개만 표시
        console.log(`  • ${skill.koreanName} (${skill.englishName})`);
        count++;
      }
    }
    if (skills.size > 5) {
      console.log(`  ... 외 ${skills.size - 5}개`);
    }
  }
}

// 실행
async function main() {
  await testQuestion();
  await testNewSkillDiscovery();
  checkKnowledge();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ 기원사 페르소나 테스트 완료');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 최종 상태
  const finalStatus = evokerPersona.getStatus();
  console.log(`\n최종 레벨: ${finalStatus.level}`);
  console.log(`최종 경험치: ${finalStatus.experience}`);
  console.log(`최종 신뢰도: ${(finalStatus.confidence * 100).toFixed(1)}%`);
  console.log(`발견한 스킬 총계: ${finalStatus.discoveredSkillsCount}개`);

  process.exit(0);
}

// 3초 후 시작 (초기화 대기)
setTimeout(main, 3000);