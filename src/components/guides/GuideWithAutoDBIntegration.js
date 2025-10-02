/**
 * 가이드 컴포넌트에 DB 자동 통합 예시
 * 새로운 스킬이 발견되면 자동으로 통합 DB에 추가
 */

import React, { useEffect, useState } from 'react';
import { addSkillToDB, getSkillFromDB, updateSkillInDB, getAllSkillsByClass } from '../../utils/skillDBManager';

const GuideWithAutoDBIntegration = ({ className, specName }) => {
  const [dbSkills, setDbSkills] = useState({});
  const [newSkillsAdded, setNewSkillsAdded] = useState([]);

  // 컴포넌트 로드 시 DB에서 스킬 로드
  useEffect(() => {
    loadSkillsFromDB();
  }, [className]);

  /**
   * DB에서 클래스별 스킬 로드
   */
  const loadSkillsFromDB = () => {
    const skills = getAllSkillsByClass(className);
    setDbSkills(skills);
    console.log(`✅ ${className} 클래스 스킬 ${Object.keys(skills).length}개 로드됨`);
  };

  /**
   * 가이드 작성 중 새 스킬 발견 시 처리
   * @param {Object} skill - 새로운 스킬 데이터
   */
  const handleNewSkill = async (skill) => {
    // 1. DB에 스킬이 있는지 확인
    const existingSkill = getSkillFromDB(className, skill.id);

    if (existingSkill) {
      console.log(`ℹ️ 스킬이 이미 DB에 존재: ${skill.name}`);

      // 필요시 업데이트
      if (needsUpdate(existingSkill, skill)) {
        const updated = updateSkillInDB(className, skill.id, skill);
        if (updated) {
          console.log(`✅ 스킬 정보 업데이트됨: ${skill.name}`);
        }
      }

      return existingSkill;
    }

    // 2. 새 스킬이면 DB에 추가
    console.log(`🆕 새 스킬 발견: ${skill.name}`);

    // 스킬 데이터 완성도 체크
    const validatedSkill = validateAndCompleteSkill(skill);

    // DB에 추가
    const added = addSkillToDB(className, validatedSkill);

    if (added) {
      setNewSkillsAdded(prev => [...prev, skill.name]);
      console.log(`✅ 새 스킬이 DB에 추가됨: ${skill.name}`);

      // DB 다시 로드
      loadSkillsFromDB();
    }

    return validatedSkill;
  };

  /**
   * 스킬 업데이트 필요 여부 확인
   */
  const needsUpdate = (existingSkill, newSkill) => {
    // 주요 필드 변경 확인
    const fieldsToCheck = ['description', 'cooldown', 'resourceCost', 'resourceGain'];

    for (const field of fieldsToCheck) {
      if (existingSkill[field] !== newSkill[field]) {
        return true;
      }
    }

    return false;
  };

  /**
   * 스킬 데이터 검증 및 완성
   */
  const validateAndCompleteSkill = (skill) => {
    const completed = {
      ...skill,
      // 필수 필드 확인
      id: skill.id || generateTemporaryId(skill.name),
      koreanName: skill.name || skill.koreanName,
      englishName: skill.englishName || translateToEnglish(skill.name),
      icon: skill.icon || 'inv_misc_questionmark',
      type: skill.type || determineSkillType(skill),
      spec: skill.spec || specName,
      heroTalent: skill.heroTalent || null,
      level: skill.level || 1,
      pvp: skill.pvp || false,

      // 전투 관련 정보
      duration: skill.duration || 'n/a',
      school: skill.school || 'Physical',
      mechanic: skill.mechanic || 'n/a',
      dispelType: skill.dispelType || 'n/a',
      gcd: skill.gcd || 'Normal',

      // 자원 정보 (통합된 필드명 사용)
      resourceCost: skill.resourceCost || skill.focusCost || '없음',
      resourceGain: skill.resourceGain || skill.focusGain || '없음',

      // 시전 정보
      range: skill.range || '0 야드',
      castTime: skill.castTime || '즉시',
      cooldown: skill.cooldown || '해당 없음',

      // 설명
      description: skill.description || '설명 없음'
    };

    return completed;
  };

  /**
   * 임시 ID 생성
   */
  const generateTemporaryId = (name) => {
    return `temp_${name.replace(/\s+/g, '_')}_${Date.now()}`;
  };

  /**
   * 간단한 영문 변환 (실제로는 wowhead API 사용 권장)
   */
  const translateToEnglish = (koreanName) => {
    // 실제로는 wowhead API나 번역 DB 사용
    return `[Needs Translation: ${koreanName}]`;
  };

  /**
   * 스킬 타입 자동 판별
   */
  const determineSkillType = (skill) => {
    if (skill.passive || !skill.resourceCost) {
      return '지속 효과';
    }
    if (skill.talentTree) {
      return '특성';
    }
    return '기본';
  };

  /**
   * 여러 스킬 일괄 처리
   */
  const handleMultipleSkills = async (skills) => {
    const processedSkills = [];

    for (const skill of skills) {
      const processed = await handleNewSkill(skill);
      processedSkills.push(processed);
    }

    console.log(`✅ ${processedSkills.length}개 스킬 처리 완료`);
    return processedSkills;
  };

  /**
   * 가이드 작성 완료 시 호출
   */
  const onGuideComplete = () => {
    if (newSkillsAdded.length > 0) {
      console.log('=== 가이드 작성 중 추가된 새 스킬 ===');
      newSkillsAdded.forEach(skill => console.log(`- ${skill}`));
      console.log(`총 ${newSkillsAdded.length}개 스킬이 DB에 추가됨`);

      // 알림 표시 (옵션)
      alert(`${newSkillsAdded.length}개의 새로운 스킬이 통합 DB에 추가되었습니다.`);
    }
  };

  // 예시 스킬 데이터
  const exampleSkillData = {
    killCommand: {
      id: '34026',
      name: '살상 명령',
      englishName: 'Kill Command',
      icon: 'ability_hunter_killcommand',
      description: '펫에게 대상을 즉시 공격하도록 명령하여 물리 피해를 입힙니다.',
      cooldown: '7.5초',
      resourceCost: '집중 30',
      resourceGain: '없음',
      type: '기본',
      spec: '야수'
    }
  };

  return (
    <div>
      <h2>{className} - {specName} 가이드</h2>

      {/* DB 상태 표시 */}
      <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '5px', marginBottom: '20px' }}>
        <p>📊 DB 상태: {Object.keys(dbSkills).length}개 스킬 로드됨</p>
        {newSkillsAdded.length > 0 && (
          <p>🆕 새로 추가된 스킬: {newSkillsAdded.length}개</p>
        )}
      </div>

      {/* 가이드 컨텐츠 */}
      <div>
        {/* 스킬 사용 예시 */}
        <button onClick={() => handleNewSkill(exampleSkillData.killCommand)}>
          살상 명령 스킬 추가 테스트
        </button>
      </div>

      {/* 가이드 완료 버튼 */}
      <button onClick={onGuideComplete} style={{ marginTop: '20px' }}>
        가이드 작성 완료
      </button>
    </div>
  );
};

export default GuideWithAutoDBIntegration;