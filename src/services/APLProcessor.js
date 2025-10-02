// SimC APL 처리 및 스킬 자동 학습 시스템
import moduleEventBus from './ModuleEventBus.js';

class APLProcessor {
  constructor() {
    this.skillPattern = /spell=(\d+)\|([^)]+)/gi;
    this.actionPattern = /action=([a-z_]+)/gi;
    this.processedSkills = new Set();
  }

  // APL 문자열 처리 및 새 스킬 감지
  async processAPLString(aplString, persona, spec) {
    console.log(`🔧 APL 처리 시작 (${spec})`);

    const lines = aplString.split('\n');
    const processedLines = [];
    const discoveredSkills = [];

    for (const line of lines) {
      // 스킬 ID 추출
      const skillMatches = [...line.matchAll(/spell=(\d+)/gi)];

      for (const match of skillMatches) {
        const skillId = match[1];

        if (!this.processedSkills.has(skillId)) {
          // 영문명 추출 시도
          const nameMatch = line.match(new RegExp(`spell=${skillId}\\|([^)]+)`, 'i'));
          const englishName = nameMatch ? nameMatch[1] : `Unknown_Skill_${skillId}`;

          // 페르소나에게 새 스킬 학습 요청
          const skillData = await persona.encounterNewSkill(skillId, englishName, spec);

          if (skillData) {
            discoveredSkills.push(skillData);
            this.processedSkills.add(skillId);
          }
        }
      }

      // 처리된 라인 저장
      processedLines.push(line);
    }

    console.log(`✅ APL 처리 완료: ${discoveredSkills.length}개 새 스킬 발견`);

    return {
      processed: processedLines.join('\n'),
      discoveredSkills: discoveredSkills
    };
  }

  // APL action을 한글로 번역
  async translateAPLAction(action, persona) {
    let translatedAction = action;

    // 스킬 ID가 있는 경우
    const skillIdMatch = action.match(/spell=(\d+)/i);
    if (skillIdMatch) {
      const skillId = skillIdMatch[1];
      const skillData = await persona.querySkillDatabase(skillId);

      if (skillData) {
        // 스킬명으로 대체
        translatedAction = translatedAction.replace(
          /spell=\d+\|?[^,)]+/gi,
          skillData.koreanName
        );
      }
    }

    // action name이 있는 경우
    const actionMatch = action.match(/action=([a-z_]+)/i);
    if (actionMatch) {
      const actionName = actionMatch[1];
      const skillData = await this.findSkillByActionName(actionName, persona);

      if (skillData) {
        translatedAction = translatedAction.replace(
          new RegExp(`action=${actionName}`, 'gi'),
          `시전: ${skillData.koreanName}`
        );
      }
    }

    // 일반 조건 번역
    const conditions = {
      'if': '만약',
      'cooldown.ready': '재사용 대기시간 준비',
      'buff.active': '버프 활성',
      'target.time_to_die': '대상 생존 시간',
      'essence.deficit': '정수 부족',
      'empower.rank': '강화 단계',
      'spell_targets': '대상 수',
      'resource': '자원',
      'charges': '충전'
    };

    for (const [eng, kor] of Object.entries(conditions)) {
      translatedAction = translatedAction.replace(
        new RegExp(eng, 'gi'),
        kor
      );
    }

    return translatedAction;
  }

  // action name으로 스킬 찾기
  async findSkillByActionName(actionName, persona) {
    // snake_case를 일반 이름으로 변환
    const englishName = actionName.replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    // DB에서 검색
    return new Promise((resolve) => {
      moduleEventBus.emit('find-skill-by-name', {
        name: englishName,
        language: 'english',
        callback: (skillData) => {
          resolve(skillData);
        }
      });
    });
  }

  // 가이드나 로그에서 스킬 참조 처리
  async processSkillReferences(text, persona) {
    const processedText = text;
    const foundSkills = [];

    // 다양한 패턴으로 스킬 감지
    const patterns = [
      /\[spell=(\d+)\]([^[]+)\[\/spell\]/gi,  // Wowhead 링크
      /{{spell\|(\d+)}}/gi,                     // Wiki 스타일
      /skill:(\d+)/gi,                          // 커스텀 포맷
      /\b(\d{5,6})\b/g                          // 5-6자리 숫자 (스킬 ID 가능성)
    ];

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];

      for (const match of matches) {
        const skillId = match[1];

        // 유효한 스킬 ID인지 검증 (10000 ~ 999999)
        if (skillId >= 10000 && skillId <= 999999) {
          const skillData = await persona.querySkillDatabase(skillId);

          if (!skillData) {
            // DB에 없으면 새 스킬로 처리
            const englishName = match[2] || `Skill_${skillId}`;
            const newSkillData = await persona.encounterNewSkill(
              skillId,
              englishName,
              persona.currentSpec || '공용'
            );

            if (newSkillData) {
              foundSkills.push(newSkillData);
            }
          } else {
            foundSkills.push(skillData);
          }
        }
      }
    }

    return {
      processedText: processedText,
      foundSkills: foundSkills
    };
  }

  // 학습 통계
  getStatistics() {
    return {
      processedSkillsCount: this.processedSkills.size,
      processedSkillIds: Array.from(this.processedSkills)
    };
  }

  // 초기화
  reset() {
    this.processedSkills.clear();
    console.log('🔄 APLProcessor 초기화됨');
  }
}

// 싱글톤 인스턴스
const aplProcessor = new APLProcessor();
export default aplProcessor;