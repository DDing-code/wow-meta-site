/**
 * Knowledge Structurer - AI 페르소나 지식 구조화 엔진
 *
 * Purpose: 비구조화된 가이드 정보 → 구조화된 Obsidian 노트 자동 생성
 *
 * 설치 필요:
 * npm install @anthropic-ai/sdk gray-matter fs-extra
 *
 * 환경 변수:
 * ANTHROPIC_API_KEY=your_key_here
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs-extra';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';
import moduleEventBus from '../../services/ModuleEventBus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class KnowledgeStructurer {
  constructor(persona) {
    this.persona = persona;  // BaseSpecializationPersona instance

    // Anthropic API 클라이언트 (환경 변수 필요)
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || ''
    });

    // Knowledge Base 경로
    this.knowledgeBasePath = path.join(__dirname, '../../../knowledge-base');

    console.log(`🧠 [${persona.spec}] KnowledgeStructurer 초기화 완료`);
  }

  /**
   * 메인 워크플로우: 비구조화 정보 → Obsidian 노트
   */
  async structureKnowledge(rawData) {
    const { source, content, url } = rawData;

    console.log(`\n============================================================`);
    console.log(`🧠 [${this.persona.spec}] 지식 구조화 시작`);
    console.log(`============================================================`);
    console.log(`📌 출처: ${source}`);
    console.log(`📝 입력 타입: ${url ? 'URL' : '텍스트'}`);

    try {
      // Step 1: URL이 제공된 경우 Playwright로 추출
      let textContent = content;
      if (url && !content) {
        console.log(`🔍 URL에서 데이터 추출 중...`);
        textContent = await this.extractFromURL(url);
      }

      // Step 2: Claude를 통한 내용 분석 (JSON 구조화)
      console.log(`🤖 Claude API로 내용 분석 중...`);
      const analysis = await this.analyzeContent(textContent, source);

      // Step 3: 카테고리별 노트 생성
      console.log(`📝 Obsidian 노트 생성 중...`);
      const notes = await this.generateNotes(analysis);
      console.log(`   생성할 노트: ${notes.length}개`);

      // Step 4: 충돌 검사
      console.log(`🔍 기존 노트와 충돌 검사 중...`);
      const conflicts = await this.checkConflicts(notes);

      if (conflicts.length > 0) {
        console.log(`⚠️  충돌 발견: ${conflicts.length}개`);

        // 사용자 확인 UI 표시
        const resolved = await this.resolveConflictsWithUser(conflicts);

        // 사용자 선택 반영
        for (const resolution of resolved) {
          notes[resolution.index].frontmatter = resolution.selected;
        }

        console.log(`✅ 충돌 해결 완료`);
      } else {
        console.log(`✅ 충돌 없음`);
      }

      // Step 5: Obsidian 노트 저장
      console.log(`💾 Obsidian 노트 저장 중...`);
      const savedNotes = [];
      for (const note of notes) {
        const saved = await this.saveNote(note);
        savedNotes.push(saved);
      }

      // Step 6: 지식 통계 업데이트
      this.updateKnowledgeStats(savedNotes);

      console.log(`\n============================================================`);
      console.log(`✅ 지식 구조화 완료`);
      console.log(`============================================================`);
      console.log(`📊 생성된 노트: ${savedNotes.length}개`);
      console.log(`📂 경로: ${this.knowledgeBasePath}`);
      console.log(`============================================================\n`);

      return {
        success: true,
        notesCreated: savedNotes.length,
        notes: savedNotes,
        conflicts: conflicts.length
      };

    } catch (error) {
      console.error(`❌ 지식 구조화 실패:`, error.message);
      throw error;
    }
  }

  /**
   * URL에서 데이터 추출 (Playwright)
   */
  async extractFromURL(url) {
    // TODO: Playwright 구현
    // import { chromium } from 'playwright';

    console.warn('⚠️  Playwright 추출은 아직 구현되지 않았습니다.');
    console.warn('   텍스트를 직접 제공해주세요.');

    throw new Error('URL 추출은 현재 지원하지 않습니다. 텍스트를 직접 제공해주세요.');
  }

  /**
   * Claude API를 통한 내용 분석
   */
  async analyzeContent(content, source) {
    if (!this.anthropic.apiKey) {
      throw new Error('ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다.');
    }

    const prompt = `당신은 World of Warcraft 가이드 분석 전문가입니다.
다음 가이드 내용을 읽고 구조화된 JSON으로 변환하세요.

출처: ${source}
전문화: ${this.persona.spec} ${this.persona.class}

가이드 내용:
${content}

다음 JSON 형식으로 출력하세요:
{
  "skills": [
    {
      "id": "스킬 ID (Wowhead)",
      "koreanName": "한글명",
      "englishName": "영문명",
      "icon": "아이콘 파일명",
      "description": "설명",
      "cooldown": "재사용 대기시간",
      "focusCost": "집중 소모량 (숫자)",
      "focusGain": "집중 획득량 (숫자)",
      "type": "core|filler|cooldown|utility",
      "relatedTalents": ["관련 특성 영문명"],
      "usedIn": ["PackLeader-Single", "DarkRanger-AoE"]
    }
  ],
  "rotations": [
    {
      "heroTalent": "Pack Leader",
      "situation": "Single Target",
      "difficulty": "Easy",
      "opener": [
        { "skill": "Wild Call", "timing": "즉시", "note": "가장 높은 DPS 증가" },
        { "skill": "Kill Command", "timing": "즉시", "note": "" }
      ],
      "priority": [
        {
          "rank": 1,
          "skill": "Wild Call",
          "condition": "쿨다운 시 즉시",
          "reason": "가장 높은 DPS 증가"
        }
      ]
    }
  ],
  "stats": {
    "packLeader-raid": {
      "priority": ["민첩성", "가속 (20% 목표)", "치명타", "특화", "유연성"],
      "breakpoints": [
        { "stat": "가속", "value": "20%", "reason": "GCD 최적화" }
      ]
    }
  },
  "builds": [
    {
      "heroTalent": "Pack Leader",
      "content": "Raid",
      "code": "Wowhead 빌드 코드",
      "description": "레이드 최적화 빌드"
    }
  ],
  "mechanics": [
    {
      "name": "광분 (Frenzy)",
      "type": "buff",
      "description": "펫 공격 속도 30% 증가",
      "maxStacks": 3,
      "duration": "8초",
      "howToMaintain": "날카로운 사격으로 갱신"
    }
  ]
}

중요:
- 모든 한글명은 ko.wowhead.com 기준입니다.
- 스킬 ID는 Wowhead URL에서 추출합니다.
- 없는 정보는 null 또는 빈 배열로 표시합니다.
- 추측하지 말고 명시된 정보만 추출합니다.
- 반드시 유효한 JSON 형식으로만 응답하세요.`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }]
    });

    // JSON 파싱
    const jsonText = message.content[0].text;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Claude 응답에서 JSON을 찾을 수 없습니다.');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // 메타데이터 추가
    analysis.source = source;
    analysis.analyzedAt = new Date().toISOString();
    analysis.confidence = 0.9; // Claude API 응답의 신뢰도

    return analysis;
  }

  /**
   * 분석 결과 → Obsidian 노트 생성
   */
  async generateNotes(analysis) {
    const notes = [];

    // Skills 노트 생성
    for (const skill of analysis.skills || []) {
      notes.push(this.createSkillNote(skill, analysis.source));
    }

    // Rotations 노트 생성
    for (const rotation of analysis.rotations || []) {
      notes.push(this.createRotationNote(rotation, analysis.source));
    }

    // Stats 노트 생성
    for (const [key, statData] of Object.entries(analysis.stats || {})) {
      notes.push(this.createStatNote(key, statData, analysis.source));
    }

    // Builds 노트 생성
    for (const build of analysis.builds || []) {
      notes.push(this.createBuildNote(build, analysis.source));
    }

    // Mechanics 노트 생성
    for (const mechanic of analysis.mechanics || []) {
      notes.push(this.createMechanicNote(mechanic, analysis.source));
    }

    return notes;
  }

  /**
   * 스킬 노트 생성
   */
  createSkillNote(skill, source) {
    const frontmatter = {
      id: skill.id,
      koreanName: skill.koreanName,
      englishName: skill.englishName,
      icon: skill.icon || '',
      class: this.persona.classEng,
      spec: this.persona.specEng,
      type: skill.type || 'core',
      cooldown: skill.cooldown,
      focusCost: skill.focusCost,
      focusGain: skill.focusGain,
      source: source,
      lastUpdated: new Date().toISOString().split('T')[0],
      confidence: 0.9
    };

    const content = `# ${skill.koreanName} (${skill.englishName})

## 설명
${skill.description || '설명 없음'}

## 세부 정보
- **재사용 대기시간**: ${skill.cooldown}
${skill.focusCost ? `- **집중 소모**: ${skill.focusCost}` : ''}
${skill.focusGain ? `- **집중 획득**: ${skill.focusGain}` : ''}

## 사용 우선순위
${(skill.usedIn || []).map(rot => `- [[${rot}]]`).join('\n') || '정보 없음'}

## 관련 특성
${(skill.relatedTalents || []).map(talent => `- [[${talent}]]`).join('\n') || '정보 없음'}

## 출처
- ${source}: https://ko.wowhead.com/spell=${skill.id}
`;

    return {
      path: `Skills/${this.persona.classEng}/${this.sanitizeFilename(skill.englishName)}.md`,
      frontmatter,
      content
    };
  }

  /**
   * 로테이션 노트 생성
   */
  createRotationNote(rotation, source) {
    const heroTalentKey = this.sanitizeFilename(rotation.heroTalent);
    const situationKey = this.sanitizeFilename(rotation.situation);

    const frontmatter = {
      spec: this.persona.specEng,
      heroTalent: rotation.heroTalent,
      situation: rotation.situation,
      difficulty: rotation.difficulty || 'Medium',
      source: source,
      lastUpdated: new Date().toISOString().split('T')[0],
      confidence: 0.9
    };

    const content = `# ${rotation.heroTalent} - ${rotation.situation}

## 오프닝
${rotation.opener.map((step, index) =>
  `${index + 1}. [[${this.sanitizeFilename(step.skill)}]] - ${step.skill}${step.note ? ` (${step.note})` : ''}`
).join('\n')}

## 우선순위
${rotation.priority.map(p => `
### ${p.rank}. [[${this.sanitizeFilename(p.skill)}]]
- **조건**: ${p.condition}
- **이유**: ${p.reason}
`).join('\n')}

## 출처
- ${source}
`;

    return {
      path: `Rotations/${this.persona.specEng}/${heroTalentKey}-${situationKey}.md`,
      frontmatter,
      content
    };
  }

  /**
   * 스탯 노트 생성
   */
  createStatNote(key, statData, source) {
    const frontmatter = {
      spec: this.persona.specEng,
      key: key,
      source: source,
      lastUpdated: new Date().toISOString().split('T')[0],
      confidence: 0.9
    };

    const content = `# 스탯 우선순위 - ${key}

## 우선순위
${statData.priority.map((stat, i) => `${i + 1}. ${stat}`).join('\n')}

${statData.breakpoints && statData.breakpoints.length > 0 ? `
## 브레이크포인트
${statData.breakpoints.map(bp => `- **${bp.stat}**: ${bp.value} - ${bp.reason}`).join('\n')}
` : ''}

## 출처
- ${source}
`;

    return {
      path: `Stats/${this.persona.specEng}/${this.sanitizeFilename(key)}.md`,
      frontmatter,
      content
    };
  }

  /**
   * 빌드 노트 생성
   */
  createBuildNote(build, source) {
    const frontmatter = {
      spec: this.persona.specEng,
      heroTalent: build.heroTalent,
      content: build.content,
      code: build.code || '',
      source: source,
      lastUpdated: new Date().toISOString().split('T')[0],
      confidence: 0.9
    };

    const content = `# ${build.heroTalent} - ${build.content}

## 설명
${build.description}

## 빌드 코드
\`\`\`
${build.code || '코드 없음'}
\`\`\`

## 출처
- ${source}
`;

    return {
      path: `Builds/${this.persona.specEng}/${this.sanitizeFilename(build.heroTalent)}-${this.sanitizeFilename(build.content)}.md`,
      frontmatter,
      content
    };
  }

  /**
   * 메커니즘 노트 생성
   */
  createMechanicNote(mechanic, source) {
    const frontmatter = {
      spec: this.persona.specEng,
      name: mechanic.name,
      type: mechanic.type,
      source: source,
      lastUpdated: new Date().toISOString().split('T')[0],
      confidence: 0.9
    };

    const content = `# ${mechanic.name}

## 타입
${mechanic.type}

## 설명
${mechanic.description}

## 세부 정보
${mechanic.maxStacks ? `- **최대 중첩**: ${mechanic.maxStacks}` : ''}
${mechanic.duration ? `- **지속 시간**: ${mechanic.duration}` : ''}

## 유지 방법
${mechanic.howToMaintain || '정보 없음'}

## 출처
- ${source}
`;

    return {
      path: `Mechanics/${this.persona.specEng}/${this.sanitizeFilename(mechanic.name)}.md`,
      frontmatter,
      content
    };
  }

  /**
   * 충돌 검사 (기존 노트와 비교)
   */
  async checkConflicts(notes) {
    const conflicts = [];

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const existingPath = path.join(this.knowledgeBasePath, note.path);

      if (await fs.pathExists(existingPath)) {
        const existingContent = await fs.readFile(existingPath, 'utf8');
        const existingData = matter(existingContent);

        // frontmatter 비교
        const diff = this.compareData(existingData.data, note.frontmatter);

        if (diff.length > 0) {
          conflicts.push({
            index: i,
            path: note.path,
            existing: existingData.data,
            new: note.frontmatter,
            differences: diff
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * 데이터 비교 (차이점 추출)
   */
  compareData(existing, newData) {
    const differences = [];

    // 모든 필드 비교
    const allKeys = new Set([...Object.keys(existing), ...Object.keys(newData)]);

    for (const key of allKeys) {
      if (existing[key] !== newData[key]) {
        differences.push({
          field: key,
          oldValue: existing[key],
          newValue: newData[key]
        });
      }
    }

    return differences;
  }

  /**
   * 사용자 확인 UI (React 팝업)
   */
  async resolveConflictsWithUser(conflicts) {
    // ModuleEventBus를 통해 UI 팝업 표시
    return new Promise((resolve) => {
      moduleEventBus.emit('knowledge-conflict-detected', {
        conflicts: conflicts,
        callback: (resolutions) => {
          resolve(resolutions);
        }
      });
    });
  }

  /**
   * 노트 저장
   */
  async saveNote(note) {
    const fullPath = path.join(this.knowledgeBasePath, note.path);
    const dir = path.dirname(fullPath);

    // 디렉토리 생성
    await fs.ensureDir(dir);

    // frontmatter + content 결합
    const fileContent = matter.stringify(note.content, note.frontmatter);

    // 저장
    await fs.writeFile(fullPath, fileContent, 'utf8');

    console.log(`   ✅ ${note.path}`);

    return {
      path: note.path,
      fullPath: fullPath
    };
  }

  /**
   * 지식 통계 업데이트
   */
  updateKnowledgeStats(savedNotes) {
    // TODO: 페르소나의 지식 통계 업데이트
    // this.persona.knowledgeCount += savedNotes.length;
  }

  /**
   * 파일명 정제
   */
  sanitizeFilename(name) {
    if (!name || typeof name !== 'string') {
      return 'Unknown';
    }

    return name
      .replace(/[<>:"/\\|?*]/g, '')  // 금지된 문자 제거
      .replace(/\s+/g, '-')           // 공백 → 하이픈
      .trim();
  }
}

export default KnowledgeStructurer;
