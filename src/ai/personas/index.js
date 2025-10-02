/**
 * 전문화 페르소나 초기화 및 등록
 */

import specializationPersonaManager from './SpecializationPersonaManager.js';
import BeastMasteryHunterPersona from './BeastMasteryHunterPersona.js';
// import DevastationEvokerPersona from './DevastationEvokerPersona.js';

// 추가 페르소나 임포트 (나중에 추가)
// import MarksmanshipHunterPersona from './MarksmanshipHunterPersona.js';
// import SurvivalHunterPersona from './SurvivalHunterPersona.js';
// import PreservationEvokerPersona from './PreservationEvokerPersona.js';
// import AugmentationEvokerPersona from './AugmentationEvokerPersona.js';

/**
 * 모든 전문화 페르소나 등록
 */
async function registerAllPersonas() {
  console.log('🎮 전문화 페르소나 시스템 초기화 시작...');

  // 사냥꾼 페르소나
  const beastMasteryHunter = new BeastMasteryHunterPersona();
  specializationPersonaManager.registerSpecializationPersona(beastMasteryHunter);

  // 기원사 페르소나 (임시 비활성화)
  // const devastationEvoker = new DevastationEvokerPersona();
  // specializationPersonaManager.registerSpecializationPersona(devastationEvoker);

  // 추가 페르소나 등록 (나중에 구현)
  // 전사
  // - 무기 전사
  // - 분노 전사
  // - 방어 전사

  // 성기사
  // - 신성 성기사
  // - 보호 성기사
  // - 징벌 성기사

  // 도적
  // - 암살 도적
  // - 무법 도적
  // - 잠행 도적

  // 사제
  // - 수양 사제
  // - 신성 사제
  // - 암흑 사제

  // 죽음의 기사
  // - 혈기 죽음의 기사
  // - 냉기 죽음의 기사
  // - 부정 죽음의 기사

  // 주술사
  // - 정기 주술사
  // - 고양 주술사
  // - 복원 주술사

  // 마법사
  // - 비전 마법사
  // - 화염 마법사
  // - 냉기 마법사

  // 흑마법사
  // - 고통 흑마법사
  // - 악마 흑마법사
  // - 파괴 흑마법사

  // 수도사
  // - 양조 수도사
  // - 운무 수도사
  // - 풍운 수도사

  // 드루이드
  // - 조화 드루이드
  // - 야성 드루이드
  // - 수호 드루이드
  // - 회복 드루이드

  // 악마사냥꾼
  // - 파멸 악마사냥꾼
  // - 복수 악마사냥꾼

  console.log('✅ 모든 페르소나 등록 완료');

  // 모든 페르소나 초기화
  await specializationPersonaManager.initializeAllPersonas();

  // 저장된 상태 복원 (있다면)
  specializationPersonaManager.loadAllPersonaStates();

  console.log('🎯 전문화 페르소나 시스템 준비 완료!');

  return specializationPersonaManager;
}

/**
 * 페르소나 시스템 종료 시 상태 저장
 */
function savePersonaStates() {
  specializationPersonaManager.saveAllPersonaStates();
}

// 브라우저 종료 시 자동 저장
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', savePersonaStates);
}

export {
  specializationPersonaManager,
  registerAllPersonas,
  savePersonaStates
};

export default registerAllPersonas;