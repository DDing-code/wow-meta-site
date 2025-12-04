import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import styles from './BeastMasteryGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus.js';
import aiFeedbackService from '../services/AIFeedbackService.js';
import externalGuideCollector from '../services/ExternalGuideCollector.js';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater.js';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer.js';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons.js';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// Guide 페이지의 통일된 테마 (BeastMasteryMaxrollGuideV2에서 가져온 레이아웃)
const unifiedTheme = {
  colors: {
    primary: '#AAD372',      // 사냥꾼 클래스 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#AAD372',
    border: '#2a2a3e',
    hover: 'rgba(170, 211, 114, 0.1)',
    success: '#4caf50',
    danger: '#f44336',
    warning: '#ff9800',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  }
};

// 업데이트 알림 토스트
const UpdateToast = styled(motion.div)`
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.accent} 100%);
  color: ${props => props.theme.colors.background};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(170, 211, 114, 0.4);
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;

  &::before {
    content: '🔄';
    font-size: 1.5rem;
  }
`;

// Guide 페이지 레이아웃 스타일 컴포넌트들
const PageWrapper = styled.div`
  min-height: 100vh;
  color: ${props => props.theme.colors.text};
  display: flex;
`;

const Sidebar = styled.nav`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  max-height: 80vh;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  border-radius: 0 8px 8px 0;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg} 0;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
    opacity: 0.8;
  }

  /* 모바일에서 숨기기 */
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavSection = styled.div`
  padding: 0 ${props => props.theme.spacing.lg};
`;

const NavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.md};
  margin: 0.2rem 0;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  background: ${props => props.active ? props.theme.colors.hover : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.primary};
  }
`;

const SubNavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: ${props => props.theme.spacing.xxl};
  margin: 0.1rem 0;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.subtext};
  text-decoration: none;
  border-left: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  background: ${props => props.active ? 'rgba(170, 211, 114, 0.05)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '500' : '400'};

  &:hover {
    background: rgba(170, 211, 114, 0.05);
    color: ${props => props.theme.colors.accent};
  }
`;

const MainContent = styled.main`
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${props => props.theme.spacing.md} 0;

  /* 모바일에서 전체 화면 사용 */
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 3000px;
  padding: 0 0.5rem;
  margin: 0 auto;

  /* 모바일에서 패딩 조정 */
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Section = styled.section`
  width: 100%;
  margin-bottom: 1rem;
  scroll-margin-top: 120px;
`;

const SectionHeader = styled.div`
  background: linear-gradient(to right, ${props => props.theme.colors.hover}, transparent);
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-weight: 700;

  /* 모바일에서 폰트 사이즈 조정 */
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  margin-bottom: 0.5rem;
  width: 100%;
  max-width: 100%;

  /* 모바일에서 패딩 조정 */
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    border-radius: 4px;
  }
`;

const HeroCard = styled(Card)`
  background: ${props => {
    if (props.heroType === 'packLeader') {
      return 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(218, 165, 32, 0.05))';
    } else if (props.heroType === 'darkRanger') {
      return 'linear-gradient(135deg, rgba(128, 0, 128, 0.05), rgba(75, 0, 130, 0.05))';
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'packLeader') {
      return 'rgba(255, 215, 0, 0.3)';
    } else if (props.heroType === 'darkRanger') {
      return 'rgba(128, 0, 128, 0.3)';
    }
    return props.theme.colors.border;
  }};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      if (props.heroType === 'packLeader') {
        return 'linear-gradient(90deg, #AAD372, #8BC34A)';
      } else if (props.heroType === 'darkRanger') {
        return 'linear-gradient(90deg, #800080, #4B0082)';
      }
      return 'transparent';
    }};
  }
`;

// Global styles for animations
const GlobalStyle = createGlobalStyle`
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Class 페이지의 스킬 데이터와 내용 (BeastMasteryGuideRestructured에서 가져옴)
const skillData = {
  bloodshed: {
    id: '321530',
    name: '유혈',
    englishName: 'Bloodshed',
    icon: 'ability_druid_primaltenacity',
    description: '야수에게 명령을 내려 대상을 찢어, 12초에 걸쳐 [전투력 * 1.2 * 12 * 1 * 1 * (1 + 유연성) * 1.02]의 출혈 피해를 입히도록 합니다. 유혈로 피해를 입히면 일정 확률로 광포한 야수를 소환합니다.',
    cooldown: '1분',
    resourceCost: '없음',
    resourceGain: '없음'
  },
  bestialWrath: {
    id: '19574',
    name: '야수의 격노',
    englishName: 'Bestial Wrath',
    icon: 'ability_druid_ferociousbite',
    description: '펫에게 격노를 불어넣어 15초 동안 피해량을 25% 증가시킵니다. 야수의 격노는 펫의 집중 소모량을 50% 감소시킵니다.',
    cooldown: '1분 30초',
    resourceCost: '없음',
    resourceGain: '없음'
  },
  barbedShot: {
    id: '217200',
    name: '날카로운 사격',
    englishName: 'Barbed Shot',
    icon: 'ability_hunter_barbedshot',
    description: '대상을 가시로 찔러 물리 피해를 입히고 8초 동안 출혈 피해를 입힙니다. 펫의 공격 속도를 30% 증가시키는 광기를 8초 부여합니다. 3번까지 중첩됩니다.',
    cooldown: '재충전 12초',
    resourceCost: '없음',
    resourceGain: '집중 20',
    charges: '2'
  },
  killCommand: {
    id: '34026',
    name: '살상 명령',
    englishName: 'Kill Command',
    icon: 'ability_hunter_killcommand',
    description: '펫에게 대상을 즉시 공격하도록 명령하여 물리 피해를 입힙니다.',
    cooldown: '7.5초',
    resourceCost: '집중 30',
    resourceGain: '없음'
  },
  cobraShot: {
    id: '193455',
    name: '코브라 사격',
    englishName: 'Cobra Shot',
    icon: 'ability_hunter_cobrashot',
    description: '대상에게 코브라 사격을 날려 물리 피해를 입힙니다. 살상 명령의 재사용 대기시간을 1초 감소시킵니다.',
    castTime: '1.75초',
    resourceCost: '집중 35',
    resourceGain: '없음'
  },
  multiShot: {
    id: '2643',
    name: '일제 사격',
    englishName: 'Multi-Shot',
    icon: 'ability_upgrademoonglaive',
    description: '전방의 모든 적에게 물리 피해를 입히고, 펫에게 4초 동안 야수의 회전베기를 부여합니다.',
    resourceCost: '집중 40',
    resourceGain: '없음'
  },
  killShot: {
    id: '53351',
    name: '마무리 사격',
    englishName: 'Kill Shot',
    icon: 'ability_hunter_assassinate',
    description: '생명력이 20% 이하인 적에게 강력한 일격을 가합니다.',
    cooldown: '20초',
    resourceCost: '집중 10',
    resourceGain: '없음'
  },
  aspectOfTheWild: {
    id: '193530',
    name: '야생의 상',
    englishName: 'Aspect of the Wild',
    icon: 'spell_nature_protectionformnature',
    description: '20초 동안 당신과 펫의 치명타 확률이 20% 증가합니다. 또한 날카로운 사격의 충전 속도가 12초 감소합니다.',
    cooldown: '2분',
    resourceCost: '없음',
    resourceGain: '없음'
  },
  callOfTheWild: {
    id: '359844',
    name: '야생의 부름',
    englishName: 'Call of the Wild',
    icon: 'ability_hunter_callofthewild',
    description: '모든 펫과 야수 소환물의 피해량을 20초 동안 20% 증가시킵니다.',
    cooldown: '3분',
    resourceCost: '없음',
    resourceGain: '없음'
  },
  direBeast: {
    id: '120679',
    name: '광포한 야수',
    englishName: 'Dire Beast',
    icon: 'ability_hunter_longevity',
    description: '야생에서 광포한 야수를 소환하여 15초 동안 대상을 공격합니다.',
    cooldown: '20초',
    resourceCost: '집중 25',
    resourceGain: '없음'
  },
  frenzy: {
    id: '272790',
    name: '광기',
    englishName: 'Frenzy',
    icon: 'ability_druid_mangle',
    description: '날카로운 사격이 펫의 공격 속도를 30% 증가시킵니다. 3번까지 중첩됩니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  masterOfBeasts: {
    id: '76657',
    name: '야수의 왕',
    englishName: 'Master of Beasts',
    icon: 'ability_hunter_masterscall',
    description: '펫이 입히는 피해가 15% 증가합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  beastCleave: {
    id: '115939',
    name: '야수의 회전베기',
    englishName: 'Beast Cleave',
    icon: 'ability_hunter_sickem',
    description: '일제 사격 후 4초 동안 펫의 기본 공격이 주변의 모든 적에게 피해를 입힙니다.',
    duration: '4초',
    cooldown: '해당 없음',
    castTime: '즉시',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  stampede: {
    id: '201430',
    name: '쇄도',
    englishName: 'Stampede',
    icon: 'ability_hunter_bestialdiscipline',
    description: '자신의 주위에 전방으로 쇄도하는 동물 무리를 소환하여 적에게 7초에 걸쳐 [전투력의 300% * 3]의 물리 피해를 입힙니다.',
    cooldown: '3분',
    castTime: '즉시',
    range: '40 야드',
    resourceCost: '없음',
    resourceGain: '없음',
    duration: '7초'
  },
  // 추가 스킬들
  howlOfThePack: {
    id: '378739',
    name: '무리 우두머리의 울부짖음',
    englishName: 'Howl of the Pack',
    icon: 'ability_hunter_callofthewild',
    description: '무리의 지도자의 핵심 능력. 야수의 격노, 야생의 부름, 피흘리기 사용 시 추가 펫을 소환하여 15초 동안 함께 전투합니다. 티어 세트 효과로 공격력이 25% 증가합니다.',
    cooldown: '트리거 기반',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  aheadOfTheGame: {
    id: '378740',
    name: '앞서가는 전략',
    englishName: 'Ahead of the Game',
    icon: 'ability_hunter_aspectofthefox',
    description: '무리 우두머리의 울부짖음이 활성화된 동안 수여되는 버프. 날카로운 사격의 효율을 크게 증가시키고, 티어 4세트 효과로 날카로운 사격 시전 시 무리 우두머리의 울부짖음 지속시간을 1초 연장합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  blackArrow: {
    id: '194599',
    name: '검은 화살',
    englishName: 'Black Arrow',
    icon: 'spell_shadow_painspike',
    description: '암흑 피해를 입히는 화살을 발사합니다.',
    cooldown: '30초',
    resourceCost: '집중 10',
    resourceGain: '없음'
  },
  darkRangerMark: {
    id: '466933',
    name: '어둠 순찰자의 징표',
    englishName: 'Dark Ranger\'s Mark',
    icon: 'ability_blackhand_marked4death',
    description: '어둠 순찰자의 강력한 표식. 검은 화살이나 날카로운 사격이 대상에게 어둠 순찰자의 징표를 남깁니다. 표식이 있는 대상에게는 모든 피해가 증가합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  bleakArrows: {
    id: '378742',
    name: '음산한 화살',
    englishName: 'Bleak Arrows',
    icon: 'ability_theblackarrow',
    description: '자동 사격이 암흑 피해를 추가로 입힙니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  explosiveShot: {
    id: '212431',
    name: '폭발 사격',
    englishName: 'Explosive Shot',
    icon: 'ability_hunter_explosiveshot',
    description: '폭발하는 탄환을 발사하여 범위 피해를 입힙니다.',
    cooldown: '20초',
    resourceCost: '집중 20',
    resourceGain: '없음'
  },
  umbralReach: {
    id: '1235397',
    name: '암영의 영역',
    englishName: 'Umbral Reach',
    icon: 'spell_deathknight_strangulate',
    description: '검은 화살의 주기적인 피해가 100%만큼 증가하고 황폐의 화약이 피해를 입히는 모든 적에게 검은 화살의 주기적인 효과를 부여합니다. 황폐의 화약이 2명 이상의 적에게 피해를 입히면 야수의 회전베기가 부여됩니다.',
    cooldown: '해당 없음',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  }
};

// 영웅특성별 콘텐츠 생성 함수 (SkillIcon 컴포넌트 사용을 위해 함수로 변경)
const getHeroContent = (SkillIcon) => ({
  packLeader: {
    name: '무리의 지도자',
    icon: '🐺',
    tierSet: {
      '2set': (
        <>
          <SkillIcon skill={skillData.bestialWrath} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.bestialWrath} textOnly={true} />,
          {' '}<SkillIcon skill={skillData.callOfTheWild} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.callOfTheWild} textOnly={true} />,
          {' '}<SkillIcon skill={skillData.bloodshed} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.bloodshed} textOnly={true} /> 사용 시 추가로
          {' '}<SkillIcon skill={skillData.howlOfThePack} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.howlOfThePack} textOnly={true} />을 소환합니다.
          {' '}<SkillIcon skill={skillData.howlOfThePack} textOnly={true} />의 공격력이 25% 증가합니다.
        </>
      ),
      '4set': (
        <>
          <SkillIcon skill={skillData.howlOfThePack} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.howlOfThePack} textOnly={true} />이 활성화되어 있는 동안,
          {' '}<SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.barbedShot} textOnly={true} />의 치명타 확률이 15% 증가합니다.
          {' '}<SkillIcon skill={skillData.aheadOfTheGame} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.aheadOfTheGame} textOnly={true} />을 받는 동안
          {' '}<SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 시전 시
          {' '}<SkillIcon skill={skillData.howlOfThePack} textOnly={true} />의 지속시간이 1초 증가합니다.
        </>
      )
    },
    singleTarget: {
      opener: [
        skillData.barbedShot,
        skillData.bestialWrath,
        skillData.killCommand,
        skillData.barbedShot,
        skillData.callOfTheWild,
        skillData.bloodshed,
        skillData.killCommand,
        skillData.barbedShot,
        skillData.direBeast,
        skillData.stampede,
        skillData.killCommand,
        skillData.barbedShot,
        skillData.killCommand
      ],
      priority: [
        { skill: skillData.bloodshed, desc: '재사용 대기시간마다 사용' },
        { skill: skillData.frenzy, desc: '3중첩 유지 (날카로운 사격으로 갱신)' },
        { skill: skillData.bestialWrath, desc: '재사용 대기시간마다 사용' },
        { skill: skillData.killCommand, desc: '최대한 자주 사용' },
        { skill: skillData.direBeast, desc: '재사용 대기시간마다' },
        { skill: skillData.cobraShot, desc: '집중 60 이상일 때 사용' }
      ]
    },
    aoe: {
      opener: [
        skillData.multiShot,
        skillData.bestialWrath,
        skillData.barbedShot,
        skillData.bloodshed,
        skillData.callOfTheWild,
        skillData.stampede,
        skillData.killCommand,
        skillData.barbedShot,
        skillData.killCommand,
        skillData.cobraShot,
        skillData.barbedShot
      ],
      priority: [
        { skill: skillData.multiShot, desc: '야수의 회전베기 활성화 (처음 1회)' },
        { skill: skillData.stampede, desc: '위치 선정 후 사용 (플레이어→타겟 직선 피해)' },
        { skill: skillData.barbedShot, desc: '광기 유지 및 펫 추가 소환' },
        { skill: skillData.killCommand, desc: '주 대상에게' },
        { skill: skillData.cobraShot, desc: '집중 소비' }
      ]
    }
  },
  darkRanger: {
    name: '어둠 순찰자',
    icon: '🏹',
    tierSet: {
      '2set': (
        <>
          <SkillIcon skill={skillData.blackArrow} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.blackArrow} textOnly={true} />이
          {' '}<SkillIcon skill={skillData.darkRangerMark} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.darkRangerMark} textOnly={true} />를 남깁니다.
          {' '}<SkillIcon skill={skillData.blackArrow} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.blackArrow} textOnly={true} /> 또는
          {' '}<SkillIcon skill={skillData.darkRangerMark} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.darkRangerMark} textOnly={true} />가 활성화되어 있는 동안
          {' '}<SkillIcon skill={skillData.killCommand} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.killCommand} textOnly={true} />과
          {' '}<SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.barbedShot} textOnly={true} />의 피해량이 15% 증가합니다.
        </>
      ),
      '4set': (
        <>
          <SkillIcon skill={skillData.bleakArrows} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.bleakArrows} textOnly={true} />이 활성화되어 있는 동안
          {' '}<SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.barbedShot} textOnly={true} />의 재사용 대기시간이 2초 감소하고,
          {' '}<SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.barbedShot} textOnly={true} />으로 적에게
          {' '}<SkillIcon skill={skillData.darkRangerMark} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.darkRangerMark} textOnly={true} />를 남길 확률이 25% 증가합니다.
        </>
      )
    },
    singleTarget: {
      opener: [
        skillData.barbedShot,
        skillData.blackArrow,
        skillData.bestialWrath,
        skillData.killCommand,
        skillData.barbedShot,
        skillData.callOfTheWild,
        skillData.bloodshed,
        skillData.killCommand,
        skillData.barbedShot,
        skillData.killCommand
      ],
      priority: [
        { skill: skillData.blackArrow, desc: '재사용 대기시간마다' },
        { skill: skillData.bleakArrows, desc: '효과 활용 (자동 사격 암흑 피해)' },
        { skill: skillData.barbedShot, desc: '광기 유지' },
        { skill: skillData.killCommand, desc: '사용' },
        { skill: skillData.cobraShot, desc: '필러' }
      ]
    },
    aoe: {
      opener: [
        skillData.blackArrow,
        skillData.barbedShot,
        skillData.bestialWrath,
        skillData.bloodshed,
        skillData.callOfTheWild,
        skillData.stampede,
        skillData.killCommand,
        skillData.barbedShot,
        skillData.blackArrow,
        skillData.killCommand,
        skillData.cobraShot
      ],
      priority: [
        { skill: skillData.blackArrow, desc: '3타겟 이상 적중으로 야수의 회전베기 발동' },
        { skill: skillData.barbedShot, desc: '광기 유지' },
        { skill: skillData.killCommand, desc: '주 대상에게' },
        { skill: skillData.multiShot, desc: '필요시만 (몹 남았을 때)' },
        { skill: skillData.cobraShot, desc: '집중 소비' }
      ]
    }
  }
});


// SkillIcon을 컴포넌트 외부에서 정의
const SkillIconComponent = ({ skill, size = 'medium', showTooltip = true, className = '', textOnly = false }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const iconRef = useRef(null);

  // wowhead 데이터베이스에서 스킬 정보 가져오기
  const getEnhancedSkillData = () => {
    if (!skill) return null;

    // wowhead 설명 찾기
    const wowheadInfo = wowheadDescriptions[skill.id] ||
                        wowheadDescriptions[skill.koreanName] ||
                        wowheadDescriptions[skill.englishName];

    // 데이터 병합
    return {
      ...skill,
      koreanName: skill.name || skill.koreanName,
      englishName: skill.englishName,
      description: wowheadInfo?.description || skill.description,
      cooldown: wowheadInfo?.cooldown || skill.cooldown,
      castTime: wowheadInfo?.castTime || skill.castTime,
      range: wowheadInfo?.range || skill.range,
      resourceCost: wowheadInfo?.resourceCost || skill.resourceCost,
      resourceGain: wowheadInfo?.resourceGain || skill.resourceGain,
      type: wowheadInfo?.type || skill.type,
      spec: wowheadInfo?.spec || skill.spec
    };
  };

  const enhancedSkill = getEnhancedSkillData();
  if (!enhancedSkill) return null;

  const sizeMap = {
    small: '24px',
    medium: '36px',
    large: '48px'
  };

  // 액티브/패시브에 따른 색상 구분
  const getSkillColor = () => {
    if (enhancedSkill.type === 'passive' || enhancedSkill.type === '지속 효과') {
      return '#94a3b8'; // 밝은 회색 - 패시브 스킬
    } else if (enhancedSkill.type === 'talent' || enhancedSkill.type === '특성') {
      return '#22c55e'; // 녹색 - 특성
    }
    return '#AAD372'; // 기본 색상 - 액티브 스킬
  };

  const getTooltipPortal = () => {
    let portal = document.getElementById('tooltip-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'tooltip-portal';
      document.body.appendChild(portal);
    }
    return portal;
  };

  const Tooltip = () => {
    if (!isTooltipVisible || !iconRef.current) return null;

    const rect = iconRef.current.getBoundingClientRect();
    const tooltipWidth = 350;
    const tooltipHeight = 280;

    // 화면 경계 체크
    let top = rect.top - tooltipHeight - 10;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // 상단 경계 체크
    if (top < 10) {
      top = rect.bottom + 10;
    }

    // 좌우 경계 체크
    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    const tooltipStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      backgroundColor: 'rgba(26, 26, 46, 0.98)',
      backgroundImage: 'linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, transparent 50%)',
      border: '2px solid #AAD372',
      borderRadius: '10px',
      padding: '16px',
      zIndex: 10000,
      width: `${tooltipWidth}px`,
      pointerEvents: 'none',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(170, 211, 114, 0.2)',
      animation: 'fadeIn 0.2s ease-in-out'
    };

    return ReactDOM.createPortal(
      <div style={tooltipStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(170, 211, 114, 0.2)'
        }}>
          <div style={{
            padding: '4px',
            background: 'linear-gradient(135deg, rgba(170, 211, 114, 0.2), transparent)',
            borderRadius: '8px',
            border: '1px solid rgba(170, 211, 114, 0.3)'
          }}>
            <img
              src={`https://wow.zamimg.com/images/wow/icons/large/${enhancedSkill.icon}.jpg`}
              alt={enhancedSkill.koreanName}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '6px',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#AAD372',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '2px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              {enhancedSkill.koreanName}
            </div>
            {enhancedSkill.englishName && (
              <div style={{ color: '#999', fontSize: '12px', fontStyle: 'italic' }}>
                {enhancedSkill.englishName}
              </div>
            )}
            {enhancedSkill.type && (
              <div style={{
                color: getSkillColor(),
                fontSize: '11px',
                marginTop: '2px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {enhancedSkill.type} {enhancedSkill.spec && enhancedSkill.spec !== '공용' && `• ${enhancedSkill.spec}`}
              </div>
            )}
          </div>
        </div>

        {enhancedSkill.description && (
          <div style={{
            color: '#d8d8d8',
            fontSize: '13px',
            lineHeight: '1.7',
            marginBottom: '12px',
            textAlign: 'justify'
          }}>
            {enhancedSkill.description}
          </div>
        )}

        {(enhancedSkill.cooldown || enhancedSkill.castTime || enhancedSkill.range ||
          enhancedSkill.resourceCost || enhancedSkill.resourceGain) && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}>
              {enhancedSkill.castTime && (
                <>
                  <span style={{ color: '#AAD372', fontWeight: 'bold' }}>시전 시간:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.castTime}</span>
                </>
              )}
              {enhancedSkill.cooldown && (
                <>
                  <span style={{ color: '#AAD372', fontWeight: 'bold' }}>재사용 대기시간:</span>
                  <span style={{ color: '#ffa500' }}>{enhancedSkill.cooldown}</span>
                </>
              )}
              {enhancedSkill.range && (
                <>
                  <span style={{ color: '#AAD372', fontWeight: 'bold' }}>사거리:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.range}</span>
                </>
              )}
              {enhancedSkill.resourceCost && enhancedSkill.resourceCost !== '없음' && (
                <>
                  <span style={{ color: '#ef5350', fontWeight: 'bold' }}>소모:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.resourceCost}</span>
                </>
              )}
              {enhancedSkill.resourceGain && enhancedSkill.resourceGain !== '없음' && (
                <>
                  <span style={{ color: '#4fc3f7', fontWeight: 'bold' }}>획득:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.resourceGain}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>,
      getTooltipPortal()
    );
  };

  if (textOnly) {
    return (
      <span
        ref={iconRef}
        className={`${styles.skillText} ${className}`}
        style={{
          color: getSkillColor(),
          fontWeight: 'bold',
          cursor: 'pointer',
          borderBottom: `1px dotted ${getSkillColor()}`,
          textShadow: skill.type === 'passive' ? 'none' : '0 0 4px rgba(170, 211, 114, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {enhancedSkill.koreanName}
        {showTooltip && <Tooltip />}
      </span>
    );
  }

  return (
    <>
      <div
        ref={iconRef}
        className={`${styles.skillIcon} ${className}`}
        style={{
          display: 'inline-block',
          width: sizeMap[size],
          height: sizeMap[size],
          position: 'relative',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <img
          src={`https://wow.zamimg.com/images/wow/icons/large/${enhancedSkill.icon}.jpg`}
          alt={enhancedSkill.koreanName}
          style={{
            width: '100%',
            height: '100%',
            border: `2px solid ${getSkillColor()}`,
            borderRadius: '4px',
            opacity: enhancedSkill.type === 'passive' || enhancedSkill.type === '지속 효과' ? 0.85 : 1,
            boxShadow: enhancedSkill.type === 'passive' || enhancedSkill.type === '지속 효과' ? 'none' : '0 0 8px rgba(170, 211, 114, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
          }}
        />
      </div>
      {showTooltip && <Tooltip />}
    </>
  );
};

const BeastMasteryLayoutIntegrated = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [selectedTier, setSelectedTier] = useState('packLeader');
  const [showToast, setShowToast] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('raid-single');
  const [selectedStatHero, setSelectedStatHero] = useState('packLeader');
  const [selectedStatMode, setSelectedStatMode] = useState('single');

  // 수동 가이드 업데이트 함수 (외부에서 호출 가능)
  const updateGuideData = (newData) => {
    console.log('📝 수동 가이드 업데이트 수신:', newData);

    // 업데이트 알림 표시
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);

    // 데이터 업데이트 처리
    moduleEventBus.emit('guide-data-update', {
      spec: 'hunter-beast-mastery',
      data: newData,
      timestamp: new Date().toISOString()
    });

    // 필요한 상태 업데이트
    if (newData.talents) {
      // 탤런트 관련 업데이트
      console.log('특성 빌드 업데이트');
    }
    if (newData.rotation) {
      // 로테이션 관련 업데이트
      console.log('딜사이클 업데이트');
    }
    if (newData.stats) {
      // 스탯 관련 업데이트
      console.log('스탯 우선순위 업데이트');
    }
  };

  // 전역 객체에 업데이트 함수 노출 (디버깅/개발용)
  React.useEffect(() => {
    window.updateBeastMasteryGuide = updateGuideData;
    return () => {
      delete window.updateBeastMasteryGuide;
    };
  }, []);

  // SkillIcon을 내부에서 사용할 수 있도록 설정
  const SkillIcon = SkillIconComponent;

  const sectionRefs = {
    overview: useRef(null),
    rotation: useRef(null),
    builds: useRef(null),
    stats: useRef(null),
  };

  const subSectionRefs = {
    // 개요 서브섹션
    'overview-intro': useRef(null),
    'overview-resource': useRef(null),
    // 딜사이클 서브섹션
    'rotation-tier': useRef(null),
    'rotation-single': useRef(null),
    'rotation-aoe': useRef(null),
    // 특성 서브섹션
    'builds-talents': useRef(null),
    // 스탯 서브섹션
    'stats-priority': useRef(null),
    'stats-simc': useRef(null),
  };

  // 유기적 모듈 초기화 및 연결
  useEffect(() => {
    // 모듈 등록
    moduleEventBus.registerModule('beastMasteryGuide', {
      name: 'Beast Mastery Guide',
      version: '2.0.0',
      spec: 'hunter-beast-mastery'
    });

    // 외부 가이드 수집 - 자동 동기화 비활성화
    // 수동으로만 업데이트 (필요시 호출)
    // externalGuideCollector.collectAllGuides('hunter-beast-mastery');

    // 실시간 업데이트 구독
    const handleGuideUpdate = (update) => {
      console.log('📡 Guide updated:', update);

      // 토스트 알림 표시
      if (update.type === 'update' && update.differences.length > 0) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }

      // 중요 업데이트인 경우 데이터 갱신
      if (update.differences.some(d => d.priority === 'high')) {
        // 여기서 필요한 상태 업데이트 수행
        moduleEventBus.emit('refresh-guide-data', {
          spec: 'hunter-beast-mastery'
        });
      }
    };

    realtimeGuideUpdater.subscribe('hunter-beast-mastery', handleGuideUpdate);

    // 학습 AI 시작
    learningAIPatternAnalyzer.startLearning();

    // AI 추천 리스너
    const handleAIRecommendations = (recommendations) => {
      console.log('🤖 AI Recommendations:', recommendations);
      // 추천사항을 UI에 반영
    };

    moduleEventBus.on('ai-recommendations', handleAIRecommendations);

    // 플레이어 액션 트래킹
    const trackPlayerAction = (action) => {
      moduleEventBus.emit('player-action', {
        type: 'guide-interaction',
        skill: action.skill,
        timestamp: Date.now()
      });
    };

    // 가이드 상호작용 트래킹
    const trackGuideUsage = (section) => {
      moduleEventBus.emit('guide-interaction', {
        section,
        action: 'view',
        duration: 0,
        spec: 'hunter-beast-mastery'
      });
    };

    // 클린업
    return () => {
      realtimeGuideUpdater.unsubscribe('hunter-beast-mastery', handleGuideUpdate);
      moduleEventBus.off('ai-recommendations', handleAIRecommendations);
    };
  }, []);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // 페이지 끝에 도달했는지 확인
      const isAtBottom = scrollPosition + windowHeight >= fullHeight - 100;

      if (isAtBottom) {
        // 페이지 끝에 도달하면 마지막 섹션 활성화
        setActiveSection('stats');
        const statsSubSections = Object.keys(subSectionRefs).filter(key => key.startsWith('stats-'));
        if (statsSubSections.length > 0) {
          setActiveSubSection(statsSubSections[statsSubSections.length - 1]);
        }
      } else {
        // 메인 섹션 확인
        let currentSection = 'overview';
        Object.keys(sectionRefs).forEach(key => {
          const element = sectionRefs[key]?.current;
          if (element) {
            const { offsetTop } = element;
            if (scrollPosition >= offsetTop - 10) {
              currentSection = key;
            }
          }
        });
        setActiveSection(currentSection);

        // 서브섹션 확인
        let currentSubSection = '';
        Object.keys(subSectionRefs).forEach(key => {
          const element = subSectionRefs[key]?.current;
          if (element) {
            const { offsetTop } = element;
            if (scrollPosition >= offsetTop - 10) {
              currentSubSection = key;
            }
          }
        });
        setActiveSubSection(currentSubSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSubSection = (subSectionId) => {
    subSectionRefs[subSectionId]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroContent = getHeroContent(SkillIcon);
  const currentContent = heroContent[selectedTier];

  // Class 페이지의 모든 렌더링 함수들을 Guide 레이아웃에 맞춰 렌더링
  const renderOverview = () => (
    <Section ref={sectionRefs.overview} id="overview">
      <SectionHeader>
        <SectionTitle>개요</SectionTitle>
      </SectionHeader>
      <Card>
        <div className={styles.subsection} ref={subSectionRefs['overview-intro']}>
          <h3 className={styles.subsectionTitle}>야수 전문화 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            야수 사냥꾼은 펫과 함께 전투하는 원거리 딜러 전문화입니다.
            TWW 시즌3에서는 <span style={{ color: '#b896d8', fontWeight: 'bold' }}>어둠 순찰자</span>와
            <span style={{ color: '#AAD372', fontWeight: 'bold' }}>무리의 지도자</span> 영웅특성이 모두 사용되며,
            특히 어둠 순찰자가 현재 메타에서 강세를 보이고 있습니다.
          </p>

          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            야수 사냥꾼은 <strong style={{ color: '#AAD372' }}>게임 내 유일하게 이동하면서 100% 피해를 입힐 수 있는 원거리 전문화</strong>입니다.
            대부분의 피해는 펫을 통해 이루어지며, 이는 단순한 자동 공격이 아닌
            <SkillIcon skill={skillData.killCommand} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.killCommand} textOnly={true} />과 {' '}
            <SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.barbedShot} textOnly={true} />을 통한 능동적인 제어로 극대화됩니다.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            핵심 시너지는
            <SkillIcon skill={skillData.frenzy} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.frenzy} textOnly={true} /> 중첩 유지를 통한 펫 공격 속도 증가와,
            <SkillIcon skill={skillData.bestialWrath} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.bestialWrath} textOnly={true} /> 및
            <SkillIcon skill={skillData.callOfTheWild} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.callOfTheWild} textOnly={true} /> 같은
            강력한 쿨기 동안 펫 피해량을 폭발적으로 증가시키는 것입니다.
            특화 {' '}
            <SkillIcon skill={skillData.masterOfBeasts} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.masterOfBeasts} textOnly={true} />은 모든 펫 피해를 15% 증가시켜 이러한 메커니즘을 더욱 강화합니다.
          </p>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {Object.values(skillData).slice(0, 6).map((skill) => (
              <div key={skill.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <SkillIcon skill={skill} size="medium" />
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    <SkillIcon skill={skill} textOnly={true} />
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{skill.cooldown || '즉시'}</div>
                </div>
              </div>
            ))}
          </div>

          <h4 ref={subSectionRefs['overview-resource']} style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>리소스 시스템</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li>주 자원: <span style={{ color: '#4fc3f7', fontWeight: 'bold' }}>집중</span> (0-100)</li>
            <li>집중 생성: <SkillIcon skill={skillData.barbedShot} textOnly={true} /> (+20), 자동 공격</li>
            <li>집중 소비: <SkillIcon skill={skillData.killCommand} textOnly={true} /> (-30), <SkillIcon skill={skillData.cobraShot} textOnly={true} /> (-35)</li>
            <li>펫 집중: <SkillIcon skill={skillData.bestialWrath} textOnly={true} /> 중 50% 감소</li>
          </ul>
        </div>
      </Card>
    </Section>
  );


  const renderRotation = () => (
    <Section ref={sectionRefs.rotation} id="rotation">
      <SectionHeader>
        <SectionTitle>딜사이클</SectionTitle>
      </SectionHeader>

      <HeroCard heroType={selectedTier}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>영웅특성별 딜사이클</h2>

          {/* 영웅특성 선택 탭 */}
          <div className={styles.tierTabs} style={{ marginBottom: '30px' }}>
            <button
              className={`${styles.tierTab} ${selectedTier === 'packLeader' ? styles.active : ''}`}
              onClick={() => setSelectedTier('packLeader')}
            >
              <span className={styles.tierIcon}>🐺</span> 무리의 지도자
            </button>
            <button
              className={`${styles.tierTab} ${selectedTier === 'darkRanger' ? styles.active : ''}`}
              onClick={() => setSelectedTier('darkRanger')}
            >
              <span className={styles.tierIcon}>🏹</span> 어둠 순찰자
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'packLeader' ? '#AAD372' : '#b896d8'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'packLeader'
                ? 'linear-gradient(135deg, rgba(170, 211, 114, 0.1), rgba(170, 211, 114, 0.05))'
                : 'linear-gradient(135deg, rgba(184, 150, 216, 0.1), rgba(184, 150, 216, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'packLeader'
                ? '1px solid rgba(170, 211, 114, 0.3)'
                : '1px solid rgba(184, 150, 216, 0.3)'
            }}>
              <div className={styles.bonusItem} style={{
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <span className={styles.bonusLabel} style={{
                  color: '#ffa500',
                  fontWeight: 'bold',
                  minWidth: '60px',
                  flexShrink: 0
                }}>2세트:</span>
                <span className={styles.bonusDescription} style={{
                  lineHeight: '1.8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  flexWrap: 'wrap'
                }}>
                  {currentContent.tierSet['2set']}
                </span>
              </div>
              <div className={styles.bonusItem} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <span className={styles.bonusLabel} style={{
                  color: '#ffa500',
                  fontWeight: 'bold',
                  minWidth: '60px',
                  flexShrink: 0
                }}>4세트:</span>
                <span className={styles.bonusDescription} style={{
                  lineHeight: '1.8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  flexWrap: 'wrap'
                }}>
                  {currentContent.tierSet['4set']}
                </span>
              </div>
            </div>
          </div>

          {/* 영웅 특성별 딜링 메커니즘 변화 */}
          <div className={styles.subsection} style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1.5rem',
            border: selectedTier === 'packLeader'
              ? '1px solid rgba(170, 211, 114, 0.3)'
              : '1px solid rgba(184, 150, 216, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'packLeader' ? '#AAD372' : '#b896d8'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'packLeader' ? (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#AAD372' }}>무리의 지도자</strong>는 {' '}
                  <strong style={{ color: '#AAD372' }}>다수의 야수를 동시에 운용</strong>하여 압도적인 지속 딜을 제공합니다.
                  티어 세트와 결합 시 최대 3종류의 추가 야수를 소환하여
                  <strong style={{ color: '#ffa500' }}>멀티타겟과 단일 대상 모두에서 뛰어난 성능</strong>을 발휘합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#AAD372', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.howlOfThePack} size="small" className={styles.inlineIcon} />
                    무리 우두머리의 울부짖음 - 3종 야수 소환
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li><strong style={{ color: '#8B4513' }}>곰</strong>: 대상에게 강력한 출혈 피해를 입힘</li>
                    <li><strong style={{ color: '#CD853F' }}>멧돼지</strong>: 적들을 관통하며 돌진 피해</li>
                    <li><strong style={{ color: '#4169E1' }}>와이번</strong>: 사냥꾼과 펫의 피해량 10-15% 증가</li>
                  </ul>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    티어 2세트 효과로 이 야수들의 공격력이 <strong style={{ color: '#ffa500' }}>25% 증가</strong>하며,
                    4세트 효과로 {' '}
                    <SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.barbedShot} textOnly={true} />의 치명타 확률이 {' '}
                    <strong style={{ color: '#ffa500' }}>15% 증가</strong>하여 더 자주 소환됩니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#AAD372', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.stampede} size="small" className={styles.inlineIcon} />
                    쇄도 - 전략적 위치 선정의 핵심
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>광역 전용</strong>: 단일 대상에서는 사용하지 않음 (APL 기준)
                    </li>
                    <li>
                      <strong style={{ color: '#AAD372' }}>직선 피해 메커니즘</strong>: 플레이어 위치에서 타겟 방향으로 일직선 피해
                    </li>
                    <li>
                      <strong>최적 위치</strong>: 가장 많은 적을 관통하도록 사전 포지셔닝 필수
                    </li>
                    <li>
                      <strong>시전 타이밍</strong>: 적이 이동하지 않을 때 사용하여 피해 최대화
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 쇄도는 시전 후 경로가 고정되므로, 무빙 보스나 이동하는 몹 그룹에는 신중히 사용하세요.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 변화</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.bestialWrath} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.bestialWrath} textOnly={true} />와 {' '}
                      <SkillIcon skill={skillData.callOfTheWild} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.callOfTheWild} textOnly={true} />를 자주 사용하여 야수 군단 유지
                    </li>
                    <li>
                      <strong style={{ color: '#AAD372' }}>이동 중에도 100% 딜링</strong>이 가능한 특성을 극대화
                    </li>
                    <li>쐐기돌 던전에서 특히 강력 - 지속적인 광역 피해와 단일 딜 모두 우수</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#b896d8' }}>어둠 순찰자</strong>는 {' '}
                  <strong style={{ color: '#AAD372' }}>현재 메타에서 압도적인 성능</strong>을 자랑합니다.
                  <SkillIcon skill={skillData.blackArrow} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.blackArrow} textOnly={true} />가 3타겟 이상 적중 시 {' '}
                  <SkillIcon skill={skillData.beastCleave} size="small" className={styles.inlineIcon} />
                  <strong style={{ color: '#b896d8' }}><SkillIcon skill={skillData.beastCleave} textOnly={true} /></strong> 버프가 자동 발동되어 {' '}
                  <strong style={{ color: '#ffa500' }}>일제 사격 없이도 강력한 광역 딜</strong>을 가능하게 합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#b896d8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.blackArrow} size="small" className={styles.inlineIcon} />
                    검은 화살 - 혁신적인 광딜 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심:</strong> 3타겟 이상 적중 시 <strong>야수의 회전베기</strong> 자동 발동
                    </li>
                    <li>
                      <strong>일제 사격 없이도</strong> 펫의 모든 공격이 광역 클리브 효과 획득
                    </li>
                    <li>
                      <SkillIcon skill={skillData.umbralReach} size="small" className={styles.inlineIcon} />
                      <strong style={{ color: '#b896d8' }}><SkillIcon skill={skillData.umbralReach} textOnly={true} /></strong> 특성으로 자동화
                    </li>
                    <li>
                      <SkillIcon skill={skillData.darkRangerMark} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.darkRangerMark} textOnly={true} />로 모든 피해 15% 증가
                    </li>
                    <li>
                      쐐기 던전에서 일제 사격 사용 횟수: <strong style={{ color: '#ff6b6b' }}>거의 0회</strong>
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 다수 몹 구간에서는 검은 화살만으로 광딜 사이클을 유지할 수 있습니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 변화</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>일제 사격 의존도 제거</strong> -
                      검은 화살로 광딜 사이클 구현
                    </li>
                    <li>
                      <SkillIcon skill={skillData.blackArrow} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.blackArrow} textOnly={true} />를 3타겟 이상에게 적중시켜 야수의 회전베기 유지
                    </li>
                    <li>
                      별도의 준비 없이도 <strong>지속적인 광딜 가능</strong>
                    </li>
                    <li>쐐기돌 던전과 레이드 모두에서 최고 성능 발휘</li>
                  </ul>
                </div>
              </>
            )}

            <div style={{
              background: 'rgba(170, 211, 114, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <p style={{ color: '#AAD372', fontSize: '0.95rem', margin: 0 }}>
                <strong>💡 추천 콘텐츠:</strong> {' '}
                {selectedTier === 'packLeader' ?
                  '쐐기돌 던전, 다수 몹 구간이 많은 레이드' :
                  '단일 보스 레이드, 긴 전투 시간의 보스전'}
              </p>
            </div>
          </div>

          {/* 단일 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-single']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'packLeader' ? '#AAD372' : '#b896d8',
              marginTop: '1.5rem'
            }}>단일 대상</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
            <div className={styles.openerSequence}>
              <div className={styles.skillSequence}>
                {currentContent.singleTarget.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
            <ol className={styles.priorityListWow}>
              {currentContent.singleTarget.priority.map((item, index) => (
                <li key={index}>
                  <span className={styles.priorityNumber}>{index + 1}.</span>
                  <SkillIcon skill={item.skill} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={item.skill} textOnly={true} /> - {item.desc}
                </li>
              ))}
            </ol>
          </div>

          {/* 광역 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-aoe']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'packLeader' ? '#AAD372' : '#b896d8',
              marginTop: '1.5rem'
            }}>광역 대상 (3+ 타겟)</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
            <div className={styles.openerSequence}>
              <div className={styles.skillSequence}>
                {currentContent.aoe.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
            <ol className={styles.priorityListWow}>
              {currentContent.aoe.priority.map((item, index) => (
                <li key={index}>
                  <span className={styles.priorityNumber}>{index + 1}.</span>
                  <SkillIcon skill={item.skill} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={item.skill} textOnly={true} /> - {item.desc}
                </li>
              ))}
            </ol>
          </div>

          {/* 심화 분석 섹션 추가 */}
          <div className={styles.subsection} style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1.5rem',
            border: '1px solid rgba(170, 211, 114, 0.2)'
          }}>
            <h3 className={styles.subsectionTitle}>심화 분석</h3>

            {selectedTier === 'packLeader' ? (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#AAD372', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.howlOfThePack} size="small" className={styles.inlineIcon} />
                    무리 우두머리의 울부짖음 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.bestialWrath} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.bestialWrath} textOnly={true} />, {' '}
                      <SkillIcon skill={skillData.callOfTheWild} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.callOfTheWild} textOnly={true} />, {' '}
                      <SkillIcon skill={skillData.bloodshed} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.bloodshed} textOnly={true} /> 사용 시 추가 펫 소환
                    </li>
                    <li>티어 2세트 효과로 추가 펫의 공격력 25% 증가</li>
                    <li>
                      티어 4세트 효과로 {' '}
                      <SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 치명타 확률 15% 증가
                    </li>
                    <li>
                      <SkillIcon skill={skillData.aheadOfTheGame} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.aheadOfTheGame} textOnly={true} /> 버프 활용으로 지속시간 연장
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.frenzy} size="small" className={styles.inlineIcon} />
                    광기 관리 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>항상 3중첩 유지가 최우선 과제</li>
                    <li>
                      <SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 충전을 2개 이상 쌓지 않기
                    </li>
                    <li>14초 지속시간을 활용한 효율적인 갱신</li>
                    <li>가속 스탯으로 관리 난이도 감소</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6b6b', fontSize: '1.2rem', marginBottom: '15px' }}>
                    🔥 일제 사격 없는 광딜 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심:</strong> {' '}
                      <SkillIcon skill={skillData.blackArrow} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.blackArrow} textOnly={true} />를 3타겟 이상에 적중
                    </li>
                    <li>
                      검은 화살 3타겟 → 야수의 회전베기 발동 → 펫의 모든 공격이 광역 피해
                    </li>
                    <li>
                      일제 사격 사용 횟수: <strong style={{ color: '#ffa500' }}>몹 남았을 때 1-2번 정도</strong>
                    </li>
                    <li>
                      별도의 준비 없이도 즉시 광딜 전환 가능
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#b896d8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.darkRangerMark} size="small" className={styles.inlineIcon} />
                    어둠 순찰자의 징표 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.blackArrow} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.blackArrow} textOnly={true} />로 징표 생성 및 야수의 회전베기 발동
                    </li>
                    <li>징표가 있는 대상에게는 모든 피해가 15% 증가</li>
                    <li>
                      티어 4세트로 {' '}
                      <SkillIcon skill={skillData.barbedShot} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 재사용 대기시간 2초 감소
                    </li>
                    <li>검은 화살만으로도 광역전 대응 가능</li>
                  </ul>
                </div>
              </>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>
                <SkillIcon skill={skillData.bestialWrath} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.bestialWrath} textOnly={true} /> 최적화
              </h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>버스트 윈도우에서 최대한 많은 <SkillIcon skill={skillData.killCommand} textOnly={true} /> 시전</li>
                <li>사용 효과 장신구와 물약을 함께 사용하여 딜 극대화</li>
                <li>펫의 집중 소모량 50% 감소 효과 활용</li>
                <li>지속시간 15초 동안 최소 5회 이상 <SkillIcon skill={skillData.killCommand} textOnly={true} /> 사용</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>집중 관리</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>60-80 집중 유지가 이상적</li>
                <li><SkillIcon skill={skillData.barbedShot} textOnly={true} />으로 +20 집중 회복</li>
                <li><SkillIcon skill={skillData.cobraShot} textOnly={true} />으로 집중 소비 및 킬 명령 재사용 대기시간 감소</li>
                <li>집중 부족 시 <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 우선 사용</li>
              </ul>
            </div>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 데이터
  const talentBuilds = {
    darkRanger: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '단일 보스전에 최적화된 빌드입니다. 높은 단일 딜과 생존력을 제공합니다.',
        code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRSJkkkkkgkgEkIpFJJRSSSJA',
        icon: '⚔️'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '다수의 적이 있는 상황에서 사용하는 빌드입니다. 쫄 페이즈가 있는 보스전에 적합합니다.',
        code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRSJhkkkkkgkgEkIpFJJRSSIJA',
        icon: '💥'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '신화+ 던전에 최적화된 빌드입니다. 광역 딜과 유틸리티에 중점을 둡니다.',
        code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRSJQkkkkkgkgEkIpFJJRSSSJA',
        icon: '🌪️'
      }
    },
    packLeader: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '무리의 지도자를 활용한 단일 대상 빌드입니다. 펫 시너지를 극대화합니다.',
        code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlkQSIJJplkkkkAJSKRSSakkkkSA',
        icon: '🐺'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '무리의 지도자를 활용한 광역 빌드입니다. 다수의 야수로 지속적인 광역 딜을 제공합니다.',
        code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlEQSIJJRlkkkkAJSKRSSakkkkSA',
        icon: '💥'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '무리의 지도자를 활용한 신화+ 빌드입니다. 안정적인 광역 딜을 제공합니다.',
        code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlESSIJJRlkkkkAJSKRSSakkkkSA',
        icon: '🏃'
      }
    }
  };

  const handleCopyBuild = (code) => {
    navigator.clipboard.writeText(code);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const renderBuilds = () => (
    <Section ref={sectionRefs.builds} id="builds">
      <SectionHeader>
        <SectionTitle>특성 빌드 추천</SectionTitle>
      </SectionHeader>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(135deg, #2a4330 0%, #1a1a2e 100%)',
          border: '2px solid #AAD372',
          borderRadius: '8px',
          padding: '16px 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 20px rgba(170, 211, 114, 0.3)',
          zIndex: 10000,
          animation: 'slideInRight 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>✅</span>
          <div>
            <div style={{ color: '#AAD372', fontWeight: 'bold', marginBottom: '4px' }}>복사되었습니다</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>특성 창에서 가져오기 버튼을 누르고 붙여넣으세요.</div>
          </div>
        </div>
      )}

      {/* 영웅 특성 선택 탭 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '20px',
          borderBottom: '2px solid #1e2328'
        }}>
          <button
            onClick={() => {
              setSelectedTier('packLeader');
              setSelectedBuild('mythic-plus');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'packLeader' ?
                'linear-gradient(135deg, #5a8656 0%, #2a4330 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'packLeader' ? '#AAD372' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'packLeader' ? '#AAD372' : '#94a3b8',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🐺</span>
            <span>무리의 지도자</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>쐐기 추천</span>
          </button>

          <button
            onClick={() => {
              setSelectedTier('darkRanger');
              setSelectedBuild('raid-single');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'darkRanger' ?
                'linear-gradient(135deg, #7a5896 0%, #3a2846 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'darkRanger' ? '#b896d8' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'darkRanger' ? '#b896d8' : '#94a3b8',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🏹</span>
            <span>어둠 순찰자</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>레이드 추천</span>
          </button>
        </div>

        {/* 빌드 선택 버튼들 */}
        <div style={{ padding: '20px' }}>
          <h4 style={{
            color: selectedTier === 'packLeader' ? '#AAD372' : '#b896d8',
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            {selectedTier === 'packLeader' ? '무리의 지도자' : '어둠 순찰자'} 특성 빌드
          </h4>

          {/* 빌드 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.entries(talentBuilds[selectedTier]).map(([key, build]) => (
              <div
                key={key}
                style={{
                  background: selectedBuild === key ?
                    'linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, rgba(170, 211, 114, 0.05) 100%)' :
                    'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${selectedBuild === key ? '#AAD372' : '#2a2d35'}`,
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedBuild(key)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{build.icon}</span>
                    <div>
                      <h5 style={{
                        color: selectedBuild === key ? '#AAD372' : '#e0e0e0',
                        fontSize: '1.1rem',
                        marginBottom: '5px'
                      }}>
                        {build.name}
                      </h5>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                        {build.description}
                      </p>
                    </div>
                  </div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #AAD372 0%, #7FB347 100%)',
                      border: 'none',
                      color: '#1a1a2e',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      boxShadow: '0 2px 8px rgba(170, 211, 114, 0.3)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyBuild(build.code);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    복사하기
                  </button>
                </div>

                {/* 빌드 코드 */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px',
                  padding: '10px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#AAD372',
                  wordBreak: 'break-all',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyBuild(build.code);
                }}
                >
                  {build.code}
                </div>
              </div>
            ))}
          </div>

          {/* 사용 방법 안내 */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(170, 211, 114, 0.05)',
            border: '1px solid rgba(170, 211, 114, 0.2)',
            borderRadius: '8px'
          }}>
            <h5 style={{ color: '#AAD372', marginBottom: '15px', fontSize: '1rem' }}>📋 특성 빌드 사용법</h5>
            <ol style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.95rem' }}>
              <li>원하는 빌드의 "복사하기" 버튼을 클릭하거나 빌드 코드를 클릭합니다.</li>
              <li>게임 내에서 특성 창(N)을 엽니다.</li>
              <li>특성 창 하단의 "가져오기" 버튼을 클릭합니다.</li>
              <li>복사한 빌드 코드를 붙여넣기(Ctrl+V) 합니다.</li>
              <li>"적용" 버튼을 클릭하여 빌드를 적용합니다.</li>
            </ol>
          </div>
        </div>
      </Card>


    </Section>
  );

  const renderStats = () => {
    // 소프트캡과 브레이크포인트를 표시하는 함수
    const renderStatInfo = (stat) => {
      if (!stat.softcap && !stat.breakpoints?.length && !stat.note) return null;

      return (
        <div style={{ marginTop: '15px' }}>
          {/* 소프트캡 표시 */}
          {stat.softcap && (
            <div style={{
              marginBottom: '10px',
              padding: '8px 12px',
              background: 'rgba(255, 107, 107, 0.1)',
              borderLeft: '3px solid #ff6b6b',
              borderRadius: '4px'
            }}>
              <span style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>
                ⚠️ 소프트캡: <strong>{stat.softcap}</strong>
              </span>
            </div>
          )}

          {/* 브레이크포인트 표시 - 시각적 개선 */}
          {stat.breakpoints && stat.breakpoints.length > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                브레이크포인트
              </div>
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {stat.breakpoints.map((bp, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: bp.color === '#ff6b6b'
                        ? 'rgba(255, 107, 107, 0.15)'
                        : 'rgba(255, 165, 0, 0.12)',
                      border: `2px solid ${bp.color || stat.color}`,
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${bp.color || stat.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{
                      color: bp.color || stat.color,
                      fontWeight: '800',
                      fontSize: '1rem'
                    }}>
                      {bp.value}%
                    </span>
                    <span style={{
                      color: '#f5f5f5',
                      fontWeight: '600'
                    }}>
                      {bp.label}
                    </span>
                  </div>
                ))}
              </div>
              {stat.softcap && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px',
                  background: 'rgba(255, 107, 53, 0.1)',
                  borderLeft: '3px solid #ff6b35',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  color: '#ffa500'
                }}>
                  ⚠️ 권장 범위: <strong>{stat.softcap}</strong>
                </div>
              )}
            </div>
          )}

          {/* 참고사항 */}
          {stat.note && (
            <div style={{
              marginTop: '10px',
              padding: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderLeft: `2px solid ${stat.color}`,
              borderRadius: '4px',
              fontSize: '0.85rem',
              color: '#cbd5e1'
            }}>
              💡 {stat.note}
            </div>
          )}
        </div>
      );
    };

    // 영웅 특성과 콘텐츠 타입별 스탯 데이터 생성 함수
    const getStatData = (hero, mode) => {
      const baseStats = {
        haste: {
          name: '가속',
          color: '#4ecdc4',
          icon: '⚡',
          description: 'GCD 감소 & 쿨다운 감소'
        },
        crit: {
          name: '치명타',
          color: '#ff6b6b',
          icon: '💥',
          description: '직접 대미지 증가'
        },
        mastery: {
          name: '특화',
          color: '#ffe66d',
          icon: '📈',
          description: '야수 대미지 증가'
        },
        versatility: {
          name: '유연',
          color: '#95e77e',
          icon: '🔄',
          description: '대미지 & 생존력'
        }
      };

      // 영웅 특성과 콘텐츠 타입별 브레이크포인트
      const breakpointData = {
        packLeader: {
          single: {
            haste: {
              softcap: '30-35%',
              breakpoints: [
                { value: 30, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 35, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '무리의 지도자는 빠른 집중 재생에 의존'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '야생의 부름 발동 빈도 증가, 특화와 비슷한 가치'
            },
            mastery: {
              breakpoints: [],
              note: '펫 대미지 증가로 치명타와 동등한 가치'
            },
            versatility: {
              breakpoints: [],
              note: '가장 낮은 우선순위, 대미지와 생존력 증가'
            }
          },
          aoe: {
            haste: {
              softcap: '30-40%',
              breakpoints: [
                { value: 30, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 40, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '빠른 날카로운 사격 재사용이 중요'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '야생의 부름으로 날카로운 사격 재사용'
            },
            mastery: {
              breakpoints: [],
              note: '광역에서는 치명타보다 낮은 가치'
            },
            versatility: {
              breakpoints: [],
              note: '가장 낮은 우선순위'
            }
          }
        },
        darkRanger: {
          single: {
            haste: {
              softcap: '30-40%',
              breakpoints: [
                { value: 30, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 40, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '가장 중요한 스탯, 직접 대미지 증가'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '가속과 함께 최우선 스탯, 직접 대미지 증가'
            },
            mastery: {
              breakpoints: [],
              note: '어둠 순찰자는 야수보다 본체 대미지에 의존'
            },
            versatility: {
              breakpoints: [],
              note: '특화보다 높지만 여전히 낮은 우선순위'
            }
          },
          aoe: {
            haste: {
              softcap: '30-40%',
              breakpoints: [
                { value: 30, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 40, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '가장 중요한 스탯'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '가속과 함께 최우선 스탯, 검은 화살 강화'
            },
            mastery: {
              breakpoints: [],
              note: '검은 화살로 표식이 빠른 광역 대응'
            },
            versatility: {
              breakpoints: [],
              note: '특화보다 높지만 여전히 낮은 우선순위'
            }
          }
        }
      };

      // 선택된 영웅 특성과 모드에 맞는 데이터 병합
      const selectedBreakpoints = breakpointData[hero][mode];
      const statData = {};

      Object.keys(baseStats).forEach(stat => {
        statData[stat] = {
          ...baseStats[stat],
          ...selectedBreakpoints[stat]
        };
      });

      return statData;
    };

    const statPriorities = {
      packLeader: {
        single: ['haste', 'mastery', 'crit', 'versatility'],
        aoe: ['haste', 'crit', 'mastery', 'versatility']
      },
      darkRanger: {
        single: ['haste', 'crit', 'versatility', 'mastery'],
        aoe: ['haste', 'crit', 'versatility', 'mastery']
      }
    };

    // 현재 선택된 영웅 특성과 모드에 맞는 스탯 데이터 가져오기
    const statData = getStatData(selectedStatHero, selectedStatMode);

    return (
      <Section ref={sectionRefs.stats} id="stats">
        <SectionHeader>
          <SectionTitle>스탯 우선순위</SectionTitle>
        </SectionHeader>

        {/* 영웅 특성 선택 탭 */}
        <Card style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '20px',
            borderBottom: '2px solid #1e2328'
          }}>
            <button
              onClick={() => setSelectedStatHero('packLeader')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'packLeader' ?
                  'linear-gradient(135deg, #5a8656 0%, #2a4330 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'packLeader' ? '#AAD372' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'packLeader' ? '#AAD372' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🐺 무리의 지도자
            </button>
            <button
              onClick={() => setSelectedStatHero('darkRanger')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'darkRanger' ?
                  'linear-gradient(135deg, #7a5896 0%, #3a2846 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'darkRanger' ? '#b896d8' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'darkRanger' ? '#b896d8' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🏹 어둠 순찰자
            </button>
          </div>

          {/* 콘텐츠 타입 선택 */}
          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '20px'
          }}>
            <button
              onClick={() => setSelectedStatMode('single')}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedStatMode === 'single' ?
                  'rgba(170, 211, 114, 0.1)' :
                  'transparent',
                border: `1px solid ${selectedStatMode === 'single' ? '#AAD372' : '#2a2d35'}`,
                borderRadius: '6px',
                color: selectedStatMode === 'single' ? '#AAD372' : '#94a3b8',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              단일 대상 (레이드)
            </button>
            <button
              onClick={() => setSelectedStatMode('aoe')}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedStatMode === 'aoe' ?
                  'rgba(170, 211, 114, 0.1)' :
                  'transparent',
                border: `1px solid ${selectedStatMode === 'aoe' ? '#AAD372' : '#2a2d35'}`,
                borderRadius: '6px',
                color: selectedStatMode === 'aoe' ? '#AAD372' : '#94a3b8',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              광역 (쐐기돌)
            </button>
          </div>
        </Card>

        {/* 스탯 우선순위 표시 */}
        <Card style={{ marginBottom: '20px' }}>
          <div className={styles.subsection} ref={subSectionRefs['stats-priority']}>
            <h3 style={{
              color: selectedStatHero === 'packLeader' ? '#AAD372' : '#b896d8',
              fontSize: '1.3rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{selectedStatHero === 'packLeader' ? '🐺' : '🏹'}</span>
              <span>{selectedStatHero === 'packLeader' ? '무리의 지도자' : '어둠 순찰자'}</span>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                - {selectedStatMode === 'single' ? '단일 대상' : '광역'}
              </span>
            </h3>

            {/* 우선순위 카드 */}
            <div style={{
              display: 'grid',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {statPriorities[selectedStatHero][selectedStatMode].map((statKey, index) => {
                const stat = statData[statKey];
                const isEqual = index > 0 &&
                  ((selectedStatHero === 'packLeader' && selectedStatMode === 'single' && index === 2) ||
                   (selectedStatHero === 'darkRanger' && index === 4));

                return (
                  <div key={statKey} style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: index === 0 ?
                      'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)' :
                      'rgba(0, 0, 0, 0.3)',
                    border: `1px solid ${index === 0 ? '#AAD372' : '#2a2d35'}`,
                    borderRadius: '8px',
                    padding: '15px 20px',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}>
                    {/* 순위 */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: index === 0 ?
                        'linear-gradient(135deg, #AAD372 0%, #8BC34A 100%)' :
                        'linear-gradient(135deg, #2a2d35 0%, #1e2328 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '20px',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: index === 0 ? '#1a1a2e' : '#94a3b8',
                      boxShadow: index === 0 ? '0 2px 8px rgba(255, 215, 0, 0.3)' : 'none'
                    }}>
                      {isEqual ? '=' : index + 1}
                    </div>

                    {/* 스탯 아이콘과 이름 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flex: 1
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                      <span style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: stat.color
                      }}>
                        {stat.name}
                      </span>
                      {statKey === 'weaponDamage' && (
                        <span style={{
                          background: 'linear-gradient(135deg, #AAD372 0%, #8BC34A 100%)',
                          color: '#1a1a2e',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          marginLeft: '10px'
                        }}>
                          최우선
                        </span>
                      )}
                    </div>

                    {/* 스탯 설명 */}
                    <div style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      fontSize: '0.9rem'
                    }}>
                      {stat.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 스탯 브레이크포인트 상세 정보 */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              border: '1px solid #2a2d35'
            }}>
              <h4 style={{
                color: '#AAD372',
                marginBottom: '20px',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📊</span>
                <span>스탯 브레이크포인트 & 목표</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {/* 가속 브레이크포인트 */}
                <div>
                  <h5 style={{
                    color: statData.haste.color,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{statData.haste.icon}</span>
                    <span>{statData.haste.name}</span>
                  </h5>
                  {renderStatInfo(statData.haste)}
                </div>

                {/* 치명타 브레이크포인트 */}
                <div>
                  <h5 style={{
                    color: statData.crit.color,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{statData.crit.icon}</span>
                    <span>{statData.crit.name}</span>
                  </h5>
                  {renderStatInfo(statData.crit)}
                </div>

                {/* 특화 브레이크포인트 */}
                <div>
                  <h5 style={{
                    color: statData.mastery.color,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{statData.mastery.icon}</span>
                    <span>{statData.mastery.name}</span>
                  </h5>
                  {renderStatInfo(statData.mastery)}
                </div>

                {/* 유연 브레이크포인트 */}
                <div>
                  <h5 style={{
                    color: statData.versatility.color,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{statData.versatility.icon}</span>
                    <span>{statData.versatility.name}</span>
                  </h5>
                  {renderStatInfo(statData.versatility)}
                </div>
              </div>

              {/* 브레이크포인트 요약 */}
              <div style={{
                marginTop: '30px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#ff6b35', marginBottom: '15px', fontSize: '1.1rem' }}>
                  📊 브레이크포인트 요약
                </h4>

                <div style={{ marginBottom: '15px' }}>
                  <h5 style={{ color: '#AAD372', marginBottom: '10px' }}>
                    무리의 지도자 (Pack Leader)
                  </h5>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>단일:</strong> 가속 30-35% > 치명타 = 특화 > 유연</li>
                    <li><strong>광역:</strong> 가속 30-40% > 치명타 > 특화 > 유연</li>
                  </ul>
                </div>

                <div>
                  <h5 style={{ color: '#b896d8', marginBottom: '10px' }}>
                    어둠 순찰자 (Dark Ranger)
                  </h5>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>단일/광역:</strong> 가속 30-40% > 치명타 > 유연 > 특화</li>
                  </ul>
                </div>

                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    ⚠️ 가속은 30%부터 소프트캡 시작, 40%에서 효율 크게 감소
                  </p>
                </div>
              </div>
            </div>

            {/* 중요 참고사항 */}
            <div style={{
              background: 'rgba(170, 211, 114, 0.05)',
              border: '1px solid rgba(170, 211, 114, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h4 style={{ color: '#AAD372', marginBottom: '15px', fontSize: '1.1rem' }}>
                ⚠️ 중요 참고사항
              </h4>
              <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.95rem' }}>
                <li>가속은 30-40%에서 소프트캡에 도달합니다</li>
                <li>치명타는 특별한 소프트캡이 없습니다</li>
                {selectedStatHero === 'packLeader' && selectedStatMode === 'single' && (
                  <li>무리의 지도자는 특화와 치명타가 동일한 가치를 가집니다</li>
                )}
                {selectedStatHero === 'darkRanger' && (
                  <li>어둠 순찰자는 가속과 치명타를 우선시합니다</li>
                )}
                <li>정확한 스탯 가중치는 개인 시뮬레이션을 권장합니다</li>
                <li>콘텐츠 타입에 따라 우선순위가 변경됩니다</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SimC 스트링 섹션 */}
        <Card>
          <div className={styles.subsection} ref={subSectionRefs['stats-simc']}>
            <h3 style={{ color: '#AAD372', marginBottom: '20px', fontSize: '1.2rem' }}>
              📊 SimulationCraft 설정
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* 기본 가중치 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid #2a2d35',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#ffa500', marginBottom: '15px' }}>기본 가중치</h4>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid #1e2328',
                  borderRadius: '4px',
                  padding: '15px',
                  color: '#AAD372',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}>
{`# TWW Season 3 Beast Mastery
scale_factors="1"
scale_factor_dps="1"
interpolation="1"
iterate="10000"

# Stat Weights (예시)
haste=1.00
crit=0.95
mastery=0.90
versatility=0.75

# 영웅 특성별 조정 필요`}
                </pre>
              </div>

              {/* 프로필 예시 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid #2a2d35',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#ffa500', marginBottom: '15px' }}>프로필 예시</h4>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid #1e2328',
                  borderRadius: '4px',
                  padding: '15px',
                  color: '#AAD372',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}>
{`hunter="BM_Hunter"
level=80
race=orc
region=kr
server=azshara
role=attack
professions=engineering=100

# Gear (639 ilvl)
head=,id=212018,ilevel=639
neck=,id=212448,ilevel=639
shoulder=,id=212016,ilevel=639`}
                </pre>
              </div>
            </div>

            {/* Raidbots 링크 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, transparent 100%)',
              border: '1px solid #AAD372',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
                정확한 스탯 가중치를 알고 싶다면 Raidbots에서 시뮬레이션을 돌려보세요
              </p>
              <a
                href="https://www.raidbots.com/simbot"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #AAD372 0%, #7FB347 100%)',
                  color: '#1a1a2e',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  boxShadow: '0 2px 8px rgba(170, 211, 114, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Raidbots에서 시뮬레이션하기 →
              </a>
            </div>
          </div>
        </Card>
      </Section>
    );
  };

  return (
    <ThemeProvider theme={unifiedTheme}>
      <GlobalStyle />
      {/* 업데이트 알림 토스트 */}
      {showToast && (
        <UpdateToast
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          가이드가 업데이트되었습니다!
        </UpdateToast>
      )}
      <PageWrapper>
        <Sidebar>
          <NavSection>
            {/* 개요 섹션 */}
            <NavItem
              active={activeSection === 'overview'}
              onClick={() => scrollToSection('overview')}
            >
              개요
            </NavItem>
            <SubNavItem
              active={activeSubSection === 'overview-intro'}
              onClick={() => scrollToSubSection('overview-intro')}
              style={{ display: activeSection === 'overview' ? 'block' : 'none' }}
            >
              전문화 소개
            </SubNavItem>
            <SubNavItem
              active={activeSubSection === 'overview-resource'}
              onClick={() => scrollToSubSection('overview-resource')}
              style={{ display: activeSection === 'overview' ? 'block' : 'none' }}
            >
              리소스 시스템
            </SubNavItem>

            {/* 딜사이클 섹션 */}
            <NavItem
              active={activeSection === 'rotation'}
              onClick={() => scrollToSection('rotation')}
            >
              딜사이클
            </NavItem>
            <SubNavItem
              active={activeSubSection === 'rotation-tier'}
              onClick={() => scrollToSubSection('rotation-tier')}
              style={{ display: activeSection === 'rotation' ? 'block' : 'none' }}
            >
              티어 세트
            </SubNavItem>
            <SubNavItem
              active={activeSubSection === 'rotation-single'}
              onClick={() => scrollToSubSection('rotation-single')}
              style={{ display: activeSection === 'rotation' ? 'block' : 'none' }}
            >
              단일 대상
            </SubNavItem>
            <SubNavItem
              active={activeSubSection === 'rotation-aoe'}
              onClick={() => scrollToSubSection('rotation-aoe')}
              style={{ display: activeSection === 'rotation' ? 'block' : 'none' }}
            >
              광역 대상
            </SubNavItem>

            {/* 특성 섹션 */}
            <NavItem
              active={activeSection === 'builds'}
              onClick={() => scrollToSection('builds')}
            >
              특성
            </NavItem>
            <SubNavItem
              active={activeSubSection === 'builds-talents'}
              onClick={() => scrollToSubSection('builds-talents')}
              style={{ display: activeSection === 'builds' ? 'block' : 'none' }}
            >
              특성 빌드
            </SubNavItem>

            {/* 스탯 섹션 */}
            <NavItem
              active={activeSection === 'stats'}
              onClick={() => scrollToSection('stats')}
            >
              스탯
            </NavItem>
            <SubNavItem
              active={activeSubSection === 'stats-priority'}
              onClick={() => scrollToSubSection('stats-priority')}
              style={{ display: activeSection === 'stats' ? 'block' : 'none' }}
            >
              우선순위
            </SubNavItem>
            <SubNavItem
              active={activeSubSection === 'stats-simc'}
              onClick={() => scrollToSubSection('stats-simc')}
              style={{ display: activeSection === 'stats' ? 'block' : 'none' }}
            >
              SimC 스트링
            </SubNavItem>
          </NavSection>
        </Sidebar>

        <MainContent>
          <ContentContainer>
            {/* 가이드 제목 및 메타 정보 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem',
              paddingTop: '2rem'
            }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #AAD372 0%, #8bc34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                textShadow: '0 0 30px rgba(170, 211, 114, 0.3)'
              }}>
                야수 사냥꾼 가이드
              </h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                최종 수정일: 2025.09.27 | 작성: WoWMeta | 검수: 데덴바-아즈샤라
              </p>
            </div>

            {renderOverview()}
            {renderRotation()}
            {renderBuilds()}
            {renderStats()}
          </ContentContainer>
        </MainContent>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default BeastMasteryLayoutIntegrated;