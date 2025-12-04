import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import Anthropic from '@anthropic-ai/sdk';

/**
 * GuideGenerator.js - Obsidian → React 가이드 자동 생성기
 *
 * Purpose: Obsidian knowledge-base 노트를 읽어서 React 가이드 컴포넌트 자동 생성
 *
 * Workflow:
 * 1. Obsidian 노트 스캔 (Skills/, Rotations/, Stats/, Builds/, Mechanics/)
 * 2. YAML frontmatter + Markdown 파싱
 * 3. Claude API로 가이드 구조 설계
 * 4. React 컴포넌트 코드 생성
 * 5. src/components/guides/ 에 저장
 *
 * Example Output:
 * - BeastMasteryHunterGuideAuto.js
 * - DevastationEvokerGuideAuto.js
 */

class GuideGenerator {
  constructor() {
    this.knowledgeBasePath = path.join(
      process.cwd(),
      '../../../knowledge-base'
    );

    this.outputPath = path.join(
      process.cwd(),
      'src/components/guides'
    );

    // Claude API 초기화
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-...'
    });

    this.classMap = {
      'hunter': { korean: '사냥꾼', english: 'Hunter' },
      'evoker': { korean: '기원사', english: 'Evoker' },
      'mage': { korean: '마법사', english: 'Mage' },
      'warrior': { korean: '전사', english: 'Warrior' },
      'paladin': { korean: '성기사', english: 'Paladin' },
      'rogue': { korean: '도적', english: 'Rogue' },
      'priest': { korean: '사제', english: 'Priest' },
      'shaman': { korean: '주술사', english: 'Shaman' },
      'warlock': { korean: '흑마법사', english: 'Warlock' },
      'monk': { korean: '수도사', english: 'Monk' },
      'druid': { korean: '드루이드', english: 'Druid' },
      'demonhunter': { korean: '악마사냥꾼', english: 'DemonHunter' },
      'deathknight': { korean: '죽음의 기사', english: 'DeathKnight' }
    };

    this.specMap = {
      'beast-mastery': { korean: '야수', english: 'BeastMastery' },
      'devastation': { korean: '황폐', english: 'Devastation' },
      'arcane': { korean: '비전', english: 'Arcane' },
      'fury': { korean: '분노', english: 'Fury' },
      'holy': { korean: '신성', english: 'Holy' },
      'assassination': { korean: '암살', english: 'Assassination' },
      'discipline': { korean: '수양', english: 'Discipline' },
      'elemental': { korean: '정기', english: 'Elemental' },
      'affliction': { korean: '고통', english: 'Affliction' },
      'brewmaster': { korean: '양조', english: 'Brewmaster' },
      'balance': { korean: '조화', english: 'Balance' },
      'havoc': { korean: '파멸', english: 'Havoc' },
      'frost': { korean: '냉기', english: 'Frost' }
    };
  }

  /**
   * 메인 가이드 생성 메서드
   *
   * @param {string} className - 클래스명 (예: 'hunter')
   * @param {string} specName - 전문화명 (예: 'beast-mastery')
   * @returns {Object} - 생성 결과
   */
  async generateGuide(className, specName) {
    console.log(`\n📝 ${className}/${specName} 가이드 생성 시작...`);

    try {
      // Step 1: Obsidian 노트 수집
      const knowledgeData = await this.collectKnowledge(className, specName);

      // Step 2: Claude API로 가이드 구조 설계
      const guideStructure = await this.designGuideStructure(knowledgeData);

      // Step 3: React 컴포넌트 코드 생성
      const componentCode = await this.generateReactComponent(guideStructure, className, specName);

      // Step 4: 파일 저장
      const savedPath = await this.saveComponent(componentCode, className, specName);

      console.log(`✅ 가이드 생성 완료: ${savedPath}`);

      return {
        success: true,
        path: savedPath,
        knowledgeUsed: {
          skills: knowledgeData.skills.length,
          rotations: knowledgeData.rotations.length,
          stats: knowledgeData.stats.length,
          builds: knowledgeData.builds.length,
          mechanics: knowledgeData.mechanics.length
        }
      };

    } catch (error) {
      console.error(`❌ 가이드 생성 실패: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obsidian 노트 수집
   *
   * @param {string} className
   * @param {string} specName
   * @returns {Object} - 수집된 지식 데이터
   */
  async collectKnowledge(className, specName) {
    console.log(`🔍 Obsidian 노트 수집 중...`);

    const knowledge = {
      skills: [],
      rotations: [],
      stats: [],
      builds: [],
      mechanics: []
    };

    // Skills 폴더 스캔
    const skillsPath = path.join(this.knowledgeBasePath, 'Skills', className);
    if (await fs.pathExists(skillsPath)) {
      const skillFiles = await fs.readdir(skillsPath);

      for (const file of skillFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(skillsPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          const parsed = matter(content);

          // 해당 전문화의 스킬만 수집
          if (parsed.data.spec === specName || parsed.data.spec === 'common') {
            knowledge.skills.push({
              ...parsed.data,
              content: parsed.content
            });
          }
        }
      }
    }

    // Rotations 폴더 스캔
    const rotationsPath = path.join(this.knowledgeBasePath, 'Rotations', className, specName);
    if (await fs.pathExists(rotationsPath)) {
      const rotationFiles = await fs.readdir(rotationsPath);

      for (const file of rotationFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(rotationsPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          const parsed = matter(content);

          knowledge.rotations.push({
            ...parsed.data,
            content: parsed.content
          });
        }
      }
    }

    // Stats 폴더 스캔
    const statsPath = path.join(this.knowledgeBasePath, 'Stats', className, `${specName}.md`);
    if (await fs.pathExists(statsPath)) {
      const content = await fs.readFile(statsPath, 'utf8');
      const parsed = matter(content);
      knowledge.stats = parsed.data;
    }

    // Builds 폴더 스캔
    const buildsPath = path.join(this.knowledgeBasePath, 'Builds', className, specName);
    if (await fs.pathExists(buildsPath)) {
      const buildFiles = await fs.readdir(buildsPath);

      for (const file of buildFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(buildsPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          const parsed = matter(content);

          knowledge.builds.push({
            ...parsed.data,
            content: parsed.content
          });
        }
      }
    }

    // Mechanics 폴더 스캔
    const mechanicsPath = path.join(this.knowledgeBasePath, 'Mechanics', className);
    if (await fs.pathExists(mechanicsPath)) {
      const mechanicsFiles = await fs.readdir(mechanicsPath);

      for (const file of mechanicsFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(mechanicsPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          const parsed = matter(content);

          // 해당 전문화의 메커니즘만 수집
          if (parsed.data.spec === specName || parsed.data.spec === 'common') {
            knowledge.mechanics.push({
              ...parsed.data,
              content: parsed.content
            });
          }
        }
      }
    }

    console.log(`✅ 수집 완료: 스킬 ${knowledge.skills.length}개, 로테이션 ${knowledge.rotations.length}개, 빌드 ${knowledge.builds.length}개, 메커니즘 ${knowledge.mechanics.length}개`);

    return knowledge;
  }

  /**
   * Claude API로 가이드 구조 설계
   *
   * @param {Object} knowledgeData
   * @returns {Object} - 가이드 구조
   */
  async designGuideStructure(knowledgeData) {
    console.log(`🧠 Claude API로 가이드 구조 설계 중...`);

    const prompt = `당신은 World of Warcraft 가이드 작성 전문가입니다.
다음 지식 데이터를 바탕으로 전문화 가이드의 구조를 설계하세요.

# 수집된 지식 데이터

## 스킬 (${knowledgeData.skills.length}개)
${knowledgeData.skills.map(skill => `
- ${skill.koreanName} (${skill.englishName})
  - 타입: ${skill.type}
  - 쿨다운: ${skill.cooldown}
  - 설명: ${skill.content.substring(0, 100)}...
`).join('\n')}

## 로테이션 (${knowledgeData.rotations.length}개)
${knowledgeData.rotations.map(rotation => `
- ${rotation.situation} (${rotation.heroTalent})
  - 우선순위: ${rotation.priority}
  - 내용: ${rotation.content.substring(0, 150)}...
`).join('\n')}

## 스탯 우선순위
${JSON.stringify(knowledgeData.stats, null, 2)}

## 빌드 (${knowledgeData.builds.length}개)
${knowledgeData.builds.map(build => `
- ${build.name}
  - 용도: ${build.purpose}
  - 코드: ${build.talentCode}
`).join('\n')}

## 메커니즘 (${knowledgeData.mechanics.length}개)
${knowledgeData.mechanics.map(mechanic => `
- ${mechanic.name}
  - 설명: ${mechanic.content.substring(0, 100)}...
`).join('\n')}

# 가이드 구조 설계 요구사항

다음 JSON 형식으로 가이드 구조를 설계하세요:

{
  "sections": [
    {
      "title": "섹션 제목",
      "type": "overview|rotation|stats|builds|mechanics",
      "content": {
        "subsections": [...],
        "dataReferences": [...스킬 ID 또는 빌드 ID...]
      }
    }
  ],
  "heroTalents": ["영웅특성1", "영웅특성2"],
  "tierSetEffects": {
    "2set": "설명",
    "4set": "설명"
  }
}

**중요**: 실제 데이터를 기반으로 설계하고, 추측하지 마세요.`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }]
    });

    const jsonText = message.content[0].text;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Claude API 응답에서 JSON을 찾을 수 없습니다.');
    }

    const structure = JSON.parse(jsonMatch[0]);

    console.log(`✅ 가이드 구조 설계 완료: ${structure.sections.length}개 섹션`);

    return structure;
  }

  /**
   * React 컴포넌트 코드 생성
   *
   * @param {Object} guideStructure
   * @param {string} className
   * @param {string} specName
   * @returns {string} - React 컴포넌트 코드
   */
  async generateReactComponent(guideStructure, className, specName) {
    console.log(`⚛️ React 컴포넌트 코드 생성 중...`);

    const classInfo = this.classMap[className];
    const specInfo = this.specMap[specName];

    const componentName = `${specInfo.english}${classInfo.english}GuideAuto`;

    const template = `import React, { useState } from 'react';
import styled from 'styled-components';
import SkillIcon from '../SkillIcon';
import { skillDatabase } from '../../data/skillDatabase';

/**
 * ${componentName}.js - 자동 생성된 ${specInfo.korean} ${classInfo.korean} 가이드
 *
 * Generated by: GuideGenerator.js
 * Date: ${new Date().toISOString().split('T')[0]}
 * Source: Obsidian knowledge-base
 */

const GuideContainer = styled.div\`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #1a1a1a;
  color: #ddd;
\`;

const Section = styled.section\`
  margin-bottom: 48px;
\`;

const SectionTitle = styled.h2\`
  font-size: 32px;
  color: #3FC6EA;
  margin-bottom: 24px;
  border-bottom: 2px solid #3FC6EA;
  padding-bottom: 12px;
\`;

const Subsection = styled.div\`
  margin-bottom: 24px;
\`;

const SubsectionTitle = styled.h3\`
  font-size: 24px;
  color: #f39c12;
  margin-bottom: 16px;
\`;

const Content = styled.div\`
  line-height: 1.8;
  font-size: 16px;
\`;

const ${componentName} = () => {
  const [activeHeroTalent, setActiveHeroTalent] = useState('${guideStructure.heroTalents[0]}');

  return (
    <GuideContainer>
      <h1>${specInfo.korean} ${classInfo.korean} 가이드</h1>

      {/* 영웅 특성 선택 */}
      <div className="hero-talent-selector">
        ${guideStructure.heroTalents.map(talent => `
        <button
          onClick={() => setActiveHeroTalent('${talent}')}
          className={activeHeroTalent === '${talent}' ? 'active' : ''}
        >
          ${talent}
        </button>
        `).join('\n        ')}
      </div>

      {/* 섹션 렌더링 */}
      ${guideStructure.sections.map(section => `
      <Section>
        <SectionTitle>${section.title}</SectionTitle>
        ${this.renderSectionContent(section)}
      </Section>
      `).join('\n      ')}
    </GuideContainer>
  );
};

export default ${componentName};
`;

    return template;
  }

  /**
   * 섹션 내용 렌더링 (헬퍼)
   *
   * @param {Object} section
   * @returns {string}
   */
  renderSectionContent(section) {
    switch (section.type) {
      case 'rotation':
        return `
        <Content>
          <p>로테이션 우선순위:</p>
          <ol>
            ${section.content.subsections.map(sub => `
            <li>${sub.title}: ${sub.description}</li>
            `).join('\n            ')}
          </ol>
        </Content>
        `;

      case 'stats':
        return `
        <Content>
          <p>스탯 우선순위:</p>
          <ul>
            ${section.content.dataReferences.map(stat => `
            <li>${stat}</li>
            `).join('\n            ')}
          </ul>
        </Content>
        `;

      case 'builds':
        return `
        <Content>
          ${section.content.subsections.map(build => `
          <div>
            <h4>${build.name}</h4>
            <p>${build.description}</p>
            <code>${build.talentCode}</code>
          </div>
          `).join('\n          ')}
        </Content>
        `;

      default:
        return `
        <Content>
          <p>${section.content.description || '내용 없음'}</p>
        </Content>
        `;
    }
  }

  /**
   * 컴포넌트 파일 저장
   *
   * @param {string} code
   * @param {string} className
   * @param {string} specName
   * @returns {string} - 저장된 경로
   */
  async saveComponent(code, className, specName) {
    console.log(`💾 컴포넌트 저장 중...`);

    const classInfo = this.classMap[className];
    const specInfo = this.specMap[specName];

    const filename = `${specInfo.english}${classInfo.english}GuideAuto.js`;
    const fullPath = path.join(this.outputPath, filename);

    await fs.ensureDir(this.outputPath);
    await fs.writeFile(fullPath, code, 'utf8');

    console.log(`✅ 저장 완료: ${fullPath}`);

    return fullPath;
  }
}

export default GuideGenerator;
