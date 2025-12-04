// AI 페르소나 기반 가이드 생성 시스템 V2 - BeastMasteryLayoutIntegrated 기반
import personaManager from './PersonaManager.js';
import moduleEventBus from '../../services/ModuleEventBus.js';
import { twwS3SkillDatabase } from '../../data/twwS3FinalCleanedDatabase.js';

class PersonaGuideGeneratorV2 {
  constructor() {
    // 클래스별 색상 시스템
    this.classColors = {
      warrior: '#C69B6D',
      paladin: '#F48CBA',
      hunter: '#AAD372',
      rogue: '#FFF468',
      priest: '#FFFFFF',
      shaman: '#0070DD',
      mage: '#3FC7EB',
      warlock: '#8788EE',
      monk: '#00FF98',
      druid: '#FF7D0A',
      deathknight: '#C41E3A',
      demonhunter: '#A330C9',
      evoker: '#33937F'
    };

    // 영웅 특성 공식 번역 (CLAUDE.md 기준)
    this.heroTalentTranslations = {
      warrior: {
        colossus: { name: '거신', icon: '⚔️', specs: ['arms', 'protection'] },
        mountainthane: { name: '산왕', icon: '🛡️', specs: ['fury', 'protection'] },
        slayer: { name: '학살자', icon: '🗡️', specs: ['arms', 'fury'] }
      },
      paladin: {
        lightsmith: { name: '빛의 대장장이', icon: '🔨', specs: ['protection', 'holy'] },
        templar: { name: '기사단', icon: '⚔️', specs: ['protection', 'retribution'] },
        heraldofthesun: { name: '태양의 사자', icon: '☀️', specs: ['holy', 'retribution'] }
      },
      hunter: {
        packleader: { name: '무리의 지도자', icon: '🐺', specs: ['beast-mastery', 'survival'] },
        darkranger: { name: '어둠 순찰자', icon: '🏹', specs: ['marksmanship', 'beast-mastery'] },
        sentinel: { name: '파수꾼', icon: '🛡️', specs: ['marksmanship', 'survival'] }
      },
      rogue: {
        trickster: { name: '기만자', icon: '🎭', specs: ['outlaw', 'subtlety'] },
        fatebound: { name: '운명결속', icon: '⚡', specs: ['assassination', 'outlaw'] },
        deathstalker: { name: '죽음추적자', icon: '💀', specs: ['assassination', 'subtlety'] }
      },
      priest: {
        oracle: { name: '예언자', icon: '🔮', specs: ['discipline', 'holy'] },
        archon: { name: '집정관', icon: '👁️', specs: ['holy', 'shadow'] },
        voidweaver: { name: '공허술사', icon: '🌑', specs: ['discipline', 'shadow'] }
      },
      shaman: {
        farseer: { name: '선견자', icon: '👁️', specs: ['elemental', 'restoration'] },
        totemic: { name: '토템술사', icon: '🗿', specs: ['restoration', 'enhancement'] },
        stormbringer: { name: '폭풍인도자', icon: '⚡', specs: ['enhancement', 'elemental'] }
      },
      mage: {
        sunfury: { name: '성난태양', icon: '☀️', specs: ['arcane', 'fire'] },
        frostfire: { name: '서리불꽃', icon: '❄️🔥', specs: ['fire', 'frost'] },
        spellslinger: { name: '주문술사', icon: '✨', specs: ['arcane', 'frost'] }
      },
      warlock: {
        diabolist: { name: '악마학자', icon: '😈', specs: ['demonology', 'destruction'] },
        hellcaller: { name: '지옥소환사', icon: '🔥', specs: ['destruction', 'affliction'] },
        soulharvester: { name: '영혼 수확자', icon: '💀', specs: ['affliction', 'demonology'] }
      },
      monk: {
        celestialconduit: { name: '천신의 대변자', icon: '☯️', specs: ['mistweaver', 'windwalker'] },
        shadopan: { name: '음영파', icon: '🥷', specs: ['brewmaster', 'windwalker'] },
        masterofharmony: { name: '조화의 종사', icon: '🕉️', specs: ['mistweaver', 'brewmaster'] }
      },
      druid: {
        wildstalker: { name: '야생추적자', icon: '🐾', specs: ['feral', 'restoration'] },
        keeperofthegrove: { name: '숲의 수호자', icon: '🌳', specs: ['balance', 'restoration'] },
        eluneschosen: { name: '엘룬의 대리자', icon: '🌙', specs: ['balance', 'guardian'] },
        druidoftheclaw: { name: '발톱의 드루이드', icon: '🐻', specs: ['feral', 'guardian'] }
      },
      demonhunter: {
        aldrachi: { name: '알드라치 파괴자', icon: '🗡️', specs: ['havoc', 'vengeance'] },
        felscarred: { name: '지옥상흔', icon: '💚', specs: ['havoc', 'vengeance'] }
      },
      deathknight: {
        sanlayn: { name: '산레인', icon: '🩸', specs: ['blood', 'unholy'] },
        rider: { name: '종말의 기수', icon: '🐴', specs: ['frost', 'unholy'] },
        deathbringer: { name: '죽음인도자', icon: '☠️', specs: ['blood', 'frost'] }
      },
      evoker: {
        flameshaper: { name: '불꽃형성자', icon: '🔥', specs: ['devastation', 'preservation'] },
        chronowarden: { name: '시간 감시자', icon: '⏰', specs: ['preservation', 'augmentation'] },
        scalecommander: { name: '비늘사령관', icon: '🐲', specs: ['devastation', 'augmentation'] }
      }
    };

    this.registerModule();
  }

  // 모듈 등록
  registerModule() {
    moduleEventBus.registerModule('persona-guide-generator-v2', {
      name: 'AI 페르소나 가이드 생성기 V2',
      version: '2.0.0',
      type: 'generator'
    });

    // 이벤트 리스너
    moduleEventBus.on('generate-guide-v2', (data) => {
      this.generateGuide(data);
    });
  }

  // 메인 가이드 생성 함수
  async generateGuide({ className, spec, context = {} }) {
    console.log(`📚 ${className} ${spec} 가이드 생성 시작 (V2)...`);

    try {
      // 페르소나 가져오기
      const persona = personaManager.personas.get(className);

      // 스킬 데이터 수집
      const skillData = await this.collectSkillData(className, spec);

      // 영웅 특성 데이터 생성
      const heroTalents = this.generateHeroTalentData(className, spec);

      // 딜사이클 데이터 생성
      const rotationData = await this.generateRotationData(className, spec, heroTalents);

      // 특성 빌드 생성
      const buildData = await this.generateBuildData(className, spec, heroTalents);

      // 스탯 우선순위 생성
      const statData = this.generateStatPriority(className, spec, heroTalents);

      // 최종 가이드 컴포넌트 생성
      const guideComponent = this.buildGuideComponent({
        className,
        spec,
        skillData,
        heroTalents,
        rotationData,
        buildData,
        statData,
        persona
      });

      console.log(`✅ ${className} ${spec} 가이드 생성 완료`);

      return {
        success: true,
        guide: guideComponent,
        metadata: {
          generatedBy: persona?.koreanName || 'AI Guide Generator',
          version: '11.2 TWW S3',
          timestamp: Date.now()
        }
      };

    } catch (error) {
      console.error('가이드 생성 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 스킬 데이터 수집
  async collectSkillData(className, spec) {
    console.log(`🔍 ${className} ${spec} 스킬 데이터 수집 중...`);

    const skills = {};
    const classSkills = twwS3SkillDatabase[className.toUpperCase()] || {};

    // 전문화 및 공용 스킬 필터링
    Object.entries(classSkills).forEach(([id, skill]) => {
      if (skill.spec === spec || skill.spec === '공용') {
        const key = this.generateSkillKey(skill.englishName);
        skills[key] = {
          id: id,
          name: skill.koreanName,
          englishName: skill.englishName,
          icon: skill.icon || this.getDefaultIcon(skill.englishName),
          description: skill.description || '',
          cooldown: skill.cooldown || '없음',
          castTime: skill.castTime || '즉시',
          range: skill.range || '근접',
          resourceCost: skill.resourceCost || '없음',
          resourceGain: skill.resourceGain || '없음'
        };
      }
    });

    console.log(`✅ ${Object.keys(skills).length}개 스킬 수집 완료`);
    return skills;
  }

  // 영웅 특성 데이터 생성
  generateHeroTalentData(className, spec) {
    const heroTalents = {};
    const classHeroes = this.heroTalentTranslations[className] || {};

    // 해당 전문화에 맞는 영웅 특성 2개 찾기
    Object.entries(classHeroes).forEach(([key, hero]) => {
      if (hero.specs.includes(spec)) {
        heroTalents[key] = {
          name: hero.name,
          icon: hero.icon,
          tierSet: {
            '2set': this.generateTierSetEffect(className, spec, hero.name, 2),
            '4set': this.generateTierSetEffect(className, spec, hero.name, 4)
          }
        };
      }
    });

    return heroTalents;
  }

  // 딜사이클 데이터 생성
  async generateRotationData(className, spec, heroTalents) {
    const rotationData = {};

    for (const [heroKey, heroData] of Object.entries(heroTalents)) {
      rotationData[heroKey] = {
        singleTarget: {
          opener: await this.generateOpener(className, spec, heroKey),
          priority: await this.generatePriority(className, spec, heroKey, 'single')
        },
        aoe: {
          opener: await this.generateOpener(className, spec, heroKey, true),
          priority: await this.generatePriority(className, spec, heroKey, 'aoe')
        }
      };
    }

    return rotationData;
  }

  // 오프닝 시퀀스 생성
  async generateOpener(className, spec, heroKey, isAoe = false) {
    // SimC APL 기반 오프닝 시퀀스 생성
    // 실제 구현에서는 APLData.js와 연동
    const baseOpener = [];

    // 클래스별 기본 오프닝 패턴
    if (className === 'hunter' && spec === 'beast-mastery') {
      if (isAoe) {
        baseOpener.push('multiShot', 'bestialWrath', 'barbedShot', 'bloodshed');
      } else {
        baseOpener.push('barbedShot', 'bestialWrath', 'killCommand', 'barbedShot');
      }
    }
    // 다른 클래스들도 추가...

    return baseOpener;
  }

  // 우선순위 생성
  async generatePriority(className, spec, heroKey, mode) {
    const priority = [];

    // 클래스별 우선순위 패턴
    if (className === 'hunter' && spec === 'beast-mastery') {
      if (mode === 'single') {
        priority.push(
          { skill: 'bloodshed', desc: '재사용 대기시간마다 사용' },
          { skill: 'frenzy', desc: '3중첩 유지 (날카로운 사격으로 갱신)' },
          { skill: 'bestialWrath', desc: '재사용 대기시간마다 사용' },
          { skill: 'killCommand', desc: '최대한 자주 사용' },
          { skill: 'cobraShot', desc: '집중 60 이상일 때 사용' }
        );
      } else {
        priority.push(
          { skill: 'multiShot', desc: '야수의 회전베기 활성화' },
          { skill: 'stampede', desc: '위치 선정 후 사용' },
          { skill: 'barbedShot', desc: '광기 유지' },
          { skill: 'killCommand', desc: '주 대상에게' }
        );
      }
    }

    return priority;
  }

  // 특성 빌드 데이터 생성
  async generateBuildData(className, spec, heroTalents) {
    const buildData = {};

    for (const heroKey of Object.keys(heroTalents)) {
      buildData[heroKey] = {
        'raid-single': {
          name: '레이드 단일 대상',
          description: '단일 보스전에 최적화된 빌드입니다.',
          code: this.generateBuildCode(className, spec, heroKey, 'raid-single'),
          icon: '⚔️'
        },
        'raid-aoe': {
          name: '레이드 광역',
          description: '광역 상황에 최적화된 빌드입니다.',
          code: this.generateBuildCode(className, spec, heroKey, 'raid-aoe'),
          icon: '💥'
        },
        'mythic-plus': {
          name: '쐐기돌',
          description: '신화+ 던전에 최적화된 빌드입니다.',
          code: this.generateBuildCode(className, spec, heroKey, 'mythic-plus'),
          icon: '🏃'
        }
      };
    }

    return buildData;
  }

  // 스탯 우선순위 생성
  generateStatPriority(className, spec, heroTalents) {
    const statPriority = {};

    for (const heroKey of Object.keys(heroTalents)) {
      statPriority[heroKey] = {
        single: this.getStatPriority(className, spec, heroKey, 'single'),
        aoe: this.getStatPriority(className, spec, heroKey, 'aoe')
      };
    }

    return statPriority;
  }

  // 스탯 우선순위 가져오기
  getStatPriority(className, spec, heroKey, mode) {
    // 기본 스탯 우선순위
    const defaultStats = ['weaponDamage', 'haste', 'crit', 'mastery', 'versatility', 'agility'];

    // 클래스별 커스터마이징
    if (className === 'hunter' && spec === 'beast-mastery') {
      if (heroKey === 'packleader') {
        if (mode === 'single') {
          return ['weaponDamage', 'haste', 'mastery', 'crit', 'versatility', 'agility'];
        } else {
          return ['weaponDamage', 'haste', 'crit', 'mastery', 'versatility', 'agility'];
        }
      }
    }

    return defaultStats;
  }

  // 최종 가이드 컴포넌트 생성
  buildGuideComponent(data) {
    const { className, spec, skillData, heroTalents, rotationData, buildData, statData } = data;

    // BeastMasteryLayoutIntegrated 구조를 따르는 컴포넌트 코드 생성
    const componentCode = `
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

// 테마 설정
const unifiedTheme = {
  colors: {
    primary: '${this.classColors[className]}',
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '${this.classColors[className]}',
    border: '#2a2a3e',
    hover: 'rgba(170, 211, 114, 0.1)',
    success: '#4caf50',
    danger: '#f44336',
    warning: '#ff9800'
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  }
};

// 스킬 데이터
const skillData = ${JSON.stringify(skillData, null, 2)};

// 영웅 특성 설정
const heroTalentConfigs = ${JSON.stringify(heroTalents, null, 2)};

// 딜사이클 데이터
const rotationData = ${JSON.stringify(rotationData, null, 2)};

// 빌드 데이터
const talentBuilds = ${JSON.stringify(buildData, null, 2)};

// 스탯 우선순위
const statPriorities = ${JSON.stringify(statData, null, 2)};

// 메인 컴포넌트
const ${this.capitalizeFirst(spec)}${this.capitalizeFirst(className)}Guide = () => {
  const [selectedTier, setSelectedTier] = useState(Object.keys(heroTalentConfigs)[0]);
  const [selectedBuildHero, setSelectedBuildHero] = useState(Object.keys(heroTalentConfigs)[0]);
  const [selectedStatHero, setSelectedStatHero] = useState(Object.keys(heroTalentConfigs)[0]);
  const [selectedStatMode, setSelectedStatMode] = useState('single');

  // 렌더링 로직...

  return (
    <ThemeProvider theme={unifiedTheme}>
      {/* 가이드 컴포넌트 구조 */}
    </ThemeProvider>
  );
};

export default ${this.capitalizeFirst(spec)}${this.capitalizeFirst(className)}Guide;
`;

    return componentCode;
  }

  // 헬퍼 함수들
  generateSkillKey(englishName) {
    return englishName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/\s+/g, '');
  }

  getDefaultIcon(skillName) {
    // 기본 아이콘 매핑
    const iconMap = {
      'Kill Command': 'ability_hunter_killcommand',
      'Barbed Shot': 'ability_hunter_barbedshot',
      'Bestial Wrath': 'ability_hunter_bestialdiscipline',
      // ... 더 많은 매핑
    };

    return iconMap[skillName] || 'inv_misc_questionmark';
  }

  generateTierSetEffect(className, spec, heroName, setPieces) {
    // 티어세트 효과 생성 로직
    if (className === 'hunter' && spec === 'beast-mastery') {
      if (setPieces === 2) {
        return '야수의 격노, 야생의 부름, 유혈 사용 시 추가로 무리 우두머리의 울부짖음을 소환합니다.';
      } else if (setPieces === 4) {
        return '무리 우두머리의 울부짖음이 활성화되어 있는 동안, 날카로운 사격의 치명타 확률이 15% 증가합니다.';
      }
    }

    return `${setPieces}세트 효과 설명`;
  }

  generateBuildCode(className, spec, heroKey, buildType) {
    // 실제 빌드 코드 생성 (Wowhead 형식)
    const baseCodes = {
      'hunter': {
        'beast-mastery': {
          'packleader': {
            'raid-single': 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlkQSIJJplkkkkAJSKRSSakkkkSA',
            'raid-aoe': 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlEQSIJJRlkkkkAJSKRSSakkkkSA',
            'mythic-plus': 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlESSIJJRlkkkkAJSKRSSakkkkSA'
          },
          'darkranger': {
            'raid-single': 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRSJkkkkkkkgkgEkIpFJJRSSSJA',
            'raid-aoe': 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSEIJSJkkkkkkkgkgEkIpFJJRSSSJA',
            'mythic-plus': 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSEIRSJkkkkkkkgkgEkIpFJJRSSSJA'
          }
        }
      }
      // 다른 클래스들도 추가...
    };

    return baseCodes[className]?.[spec]?.[heroKey]?.[buildType] || 'DEFAULT_BUILD_CODE';
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // HTML 포맷으로 가이드 미리보기 생성
  async generateHTMLPreview(className, spec) {
    const result = await this.generateGuide({ className, spec });

    if (!result.success) {
      return `<div class="error">가이드 생성 실패: ${result.error}</div>`;
    }

    // HTML 미리보기 생성
    return `
      <div class="guide-preview">
        <h1>${this.capitalizeFirst(spec)} ${this.capitalizeFirst(className)} 가이드</h1>
        <p>생성자: ${result.metadata.generatedBy}</p>
        <p>버전: ${result.metadata.version}</p>
        <div class="guide-sections">
          <section>
            <h2>영웅 특성</h2>
            <!-- 영웅 특성 내용 -->
          </section>
          <section>
            <h2>딜사이클</h2>
            <!-- 딜사이클 내용 -->
          </section>
          <section>
            <h2>특성 빌드</h2>
            <!-- 빌드 내용 -->
          </section>
          <section>
            <h2>스탯 우선순위</h2>
            <!-- 스탯 내용 -->
          </section>
        </div>
      </div>
    `;
  }
}

// 싱글톤 인스턴스
const personaGuideGeneratorV2 = new PersonaGuideGeneratorV2();

export default personaGuideGeneratorV2;