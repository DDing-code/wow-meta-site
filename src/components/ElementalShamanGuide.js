/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  GuideTemplate.js - WoW 전문화 가이드 통합 템플릿 (ArcaneMage 기반)  ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 *
 * 📋 템플릿 개요:
 * - 기반: ArcaneMageGuide.js (3,520줄 완전 구조)
 * - 크기: 3,500+ 줄 (전체 비전 마법사 가이드 포함)
 * - 업데이트: 2025-01-04 (최신 개선사항 반영)
 * - 용도: 새로운 전문화 가이드 제작 시 복사하여 사용
 * - 전략: "템플릿 단계에서 버그 최대한 제거 → 내용만 교체 → 빠른 제작"
 *
 * ✅ 최신 기능 포함:
 * - 한국어 조사 괄호 표기 시스템 (가, 을, 은(는), 와, 으로)
 * - 복사 토스트/업데이트 토스트 분리
 * - SimC 탭 제거, Raidbots 링크 통합
 * - 스탯 우선순위 단일 탭 구조
 *
 * ⚠️ 필수 수정 항목 (순서대로):
 * 1. Line 48: import 스킬 데이터 변경
 *    - arcaneMageSkills → 실제 전문화 스킬 (예: fireMageSkills)
 *    - '../data/arcaneMageSkillData' → 실제 경로
 *
 * 2. Line 58-81: unifiedTheme 색상 변경
 *    - primary/accent: #0070DE → 실제 클래스 색상
 *    - hover: rgba(63, 198, 234, 0.1) → 실제 색상 rgba
 *
 * 3. getHeroContent 함수 수정 (검색: "getHeroContent")
 *    - 키 이름: 'farseer'/'stormbringer' → 실제 영웅특성 영문명
 *    - name/icon/tierSet/opener/priority 모두 교체
 *
 * 4. 영웅특성 선택 버튼 수정 (검색: "setSelectedTier")
 *    - setSelectedTier('farseer') → 실제 영웅특성명
 *
 * 5. 빌드 코드 교체 (검색: "talentBuilds")
 *    - Wowhead 특성 계산기에서 빌드 복사
 *
 * 6. 스탯 우선순위 수정 (검색: "statPriorities")
 *    - statPriorities 객체 전체 교체
 *
 * 📚 참고 문서:
 * - WOW_GUIDE_TEMPLATE_MANUAL.md: 상세 제작 가이드
 * - CLAUDE.md: 데이터 소스 우선순위, 검증 체크리스트
 *
 * 🎨 클래스 색상 코드표:
 * - Warrior: #C79C6E (199, 156, 110)
 * - Paladin: #F58CBA (245, 140, 186)
 * - Hunter: #AAD372 (170, 211, 114)
 * - Rogue: #FFF569 (255, 245, 105)
 * - Priest: #FFFFFF (255, 255, 255)
 * - Shaman: #0070DE (0, 112, 222)
 * - Mage: #0070DE (63, 198, 234)
 * - Warlock: #9482C9 (148, 130, 201)
 * - Monk: #00FF96 (0, 255, 150)
 * - Druid: #FF7D0A (255, 125, 10)
 * - DemonHunter: #A330C9 (163, 48, 201)
 * - DeathKnight: #C41E3A (196, 30, 58)
 * - Evoker: #33937F (51, 147, 127)
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';

// ✅ 정기 주술사 스킬 데이터 import
import { elementalShamanSkills as skillData} from '../data/elementalShamanSkillData';
import styles from './DevastationEvokerGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus';
import aiFeedbackService from '../services/AIFeedbackService';
import externalGuideCollector from '../services/ExternalGuideCollector';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// ✅ 주술사 색상 테마 (Shaman: #0070DE)
const unifiedTheme = {
  colors: {
    primary: '#0070DE',      // ✅ 주술사 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#0070DE',       // ✅ 주술사 색상
    border: '#2a2a3e',
    hover: 'rgba(0, 112, 222, 0.1)',  // ✅ 주술사 색상 (0, 112, 222)
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
  box-shadow: 0 4px 20px rgba(63, 198, 176, 0.4);
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
    if (props.heroType === 'farseer') {
      return 'linear-gradient(135deg, rgba(63, 198, 234, 0.05), rgba(255, 107, 107, 0.05))';
    } else if (props.heroType === 'stormbringer') {
      return 'linear-gradient(135deg, rgba(78, 205, 196, 0.05), rgba(93, 173, 226, 0.05))';
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'farseer') {
      return 'rgba(63, 198, 234, 0.3)';
    } else if (props.heroType === 'stormbringer') {
      return 'rgba(78, 205, 196, 0.3)';
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
      if (props.heroType === 'farseer') {
        return 'linear-gradient(90deg, #0070DE, #FF6B6B)';
      } else if (props.heroType === 'stormbringer') {
        return 'linear-gradient(90deg, #0070DE, #5DADE2)';
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

// skillData는 devastationEvokerSkillData.js 파일에서 import 됨

// ⚠️ TODO: 영웅특성별 콘텐츠 생성 함수 (Step 3)
// 이 함수 전체를 실제 전문화의 영웅특성 데이터로 교체하세요
// - 키 이름: 'farseer', 'stormbringer' → 실제 영웅특성 영문명 (예: 'frostfire', 'farseer')
// - name, icon, tierSet, opener, priority 모두 교체
// - 영웅특성별로 단일/광역 우선순위가 다르므로 각각 작성
const getHeroContent = (SkillIcon) => ({
  farseer: {  // ✅ 선견자 영웅특성
    name: '선견자',
    icon: '🔮',
    tierSet: {
      '2set': '용암 폭발이 원소 또는 자연 피해를 15% 증가시키는 용암의 힘을 부여합니다. 8초 지속.',
      '4set': '번개 화살, 용암 폭발 또는 연쇄 번개를 시전하면 소용돌이를 5만큼 추가로 생성합니다.'
    },
    singleTarget: {
      opener: [
        skillData.stormElemental,    // 전투 4.5초 전: 폭풍의 정령
        skillData.stormkeeper,       // 전투 3초 전: 폭풍지기
        skillData.lavaBurst,         // 전투 1.5초 전: 용암 폭발
        skillData.flameShock,        // Pull: 화염 충격
        skillData.primordialWave,    // 태초의 파도
        skillData.ancestralSwiftness,// 선조의 신속함 (동시)
        skillData.ascendance,        // 승천
        skillData.lavaBurst,         // 용암 폭발
        skillData.lightningBolt,     // 번개 화살 (폭풍지기 소모)
        skillData.lavaBurst          // 용암 폭발 (가능 시)
      ],
      priority: [
        {
          skill: skillData.stormElemental,
          desc: '폭풍의 정령',
          conditions: [
            '쿨다운 완료',
            '즉시 사용'
          ],
          priority: 0,
          why: '주 쿨다운 - 30초간 강력한 피해 제공'
        },
        {
          skill: skillData.stormkeeper,
          desc: '폭풍지기',
          conditions: [
            '쿨다운 완료',
            '대략적으로 쿨마다 사용'
          ],
          priority: 0,
          why: '번개 화살 2회 강화 - 버스트 윈도우 극대화'
        },
        {
          skill: skillData.flameShock,
          desc: '화염 충격 유지',
          conditions: [
            '도트 유지',
            '지속시간 <6초 또는 없을 때'
          ],
          priority: 1,
          why: '용암 폭발 시전 조건 - 항상 유지 필수'
        },
        {
          skill: skillData.ascendance,
          desc: '승천',
          conditions: [
            '사용 횟수 극대화',
            '주요 쿨다운 활성 중'
          ],
          priority: 0,
          why: '15초간 용암 폭발 즉시 시전 - 사용 횟수 극대화'
        },
        {
          skill: skillData.primordialWave,
          desc: '태초의 파도',
          conditions: [
            '쿨다운 완료',
            '즉시 사용'
          ],
          priority: 1,
          why: '선조 소환 + 화염 충격 즉시 적용 - 선조의 신속함와 함께 사용'
        },
        {
          skill: skillData.ancestralSwiftness,
          desc: '선조의 신속함',
          conditions: [
            '쿨다운 완료',
            '태초의 파도와 함께 사용'
          ],
          priority: 1,
          why: '다음 주문 즉시 시전 + 강화된 선조 소환 (티어 2세트)'
        },
        {
          skill: skillData.earthShock,
          desc: '대지 충격',
          conditions: [
            '원소의 대가 활성',
            '또는 소용돌이 오버캡 직전'
          ],
          priority: 2,
          why: '원소의 대가 버프와 함께 사용하여 피해 극대화'
        },
        {
          skill: skillData.icefury,
          desc: '얼음격노',
          conditions: [
            '정기의 융합 비활성',
            '쿨다운 완료'
          ],
          priority: 2,
          why: '정기의 융합 트리거 - 냉기 충격 강화'
        },
        {
          skill: skillData.lavaBurst,
          desc: '용암 폭발',
          conditions: [
            '사용 가능할 때',
            '화염 충격 유지 중'
          ],
          priority: 3,
          why: '원소의 대가 버프 발동 - 항상 우선 사용'
        },
        {
          skill: skillData.frostShock,
          desc: '냉기 충격',
          conditions: [
            '이동 중',
            '얼음격노 또는 정기의 융합 활성'
          ],
          priority: 3,
          why: '이동 중 DPS 손실 최소화'
        },
        {
          skill: skillData.lightningBolt,
          desc: '번개 화살',
          conditions: [
            '필러 스킬',
            '소용돌이 생성'
          ],
          priority: 4,
          why: '소용돌이 8 생성 - 기본 필러 스킬'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.flameShock,        // 전투 4초 전: 화염 충격 (주 대상)
        skillData.stormkeeper,       // 전투 3초 전: 폭풍수호자 (연쇄 번개 강화)
        skillData.chainLightning,    // Pull 시작: 연쇄 번개 (폭풍수호자)
        skillData.chainLightning,    // 연쇄 번개 (폭풍수호자)
        skillData.stormElemental,    // 폭풍의 정령 (주 쿨다운)
        skillData.lavaBurst,         // 용암 폭발 (원소의 대가)
        skillData.earthquake,        // 지진 (소용돌이 소모 + 광역 도트)
        skillData.chainLightning,    // 연쇄 번개
        skillData.lavaBurst,         // 용암 폭발 (용암 쇄도)
        skillData.chainLightning,    // 연쇄 번개
        skillData.earthquake         // 지진
      ],
      priority: [
        {
          skill: skillData.stormElemental,
          desc: '폭풍의 정령 (최우선)',
          conditions: [
            '쿨다운 완료',
            '즉시 사용'
          ],
          priority: 0,
          why: '단일/광역 모두 최우선 - 30초간 강력한 지속 피해'
        },
        {
          skill: skillData.stormkeeper,
          desc: '폭풍수호자 (연쇄 번개 강화)',
          conditions: [
            '쿨다운 완료',
            '즉시 사용'
          ],
          priority: 0,
          why: '연쇄 번개 2회 즉시 시전 + 150% 피해 - 광역에서 극강 DPS'
        },
        {
          skill: skillData.ascendance,
          desc: '승천 (광역 버스트)',
          conditions: [
            '쿨다운 완료',
            '폭풍의 정령 활성 중',
            '3+ 적'
          ],
          priority: 0,
          why: '15초간 용암 폭발 즉시 시전 + 화염 충격 최대 6개로 확산'
        },
        {
          skill: skillData.lavaBurst,
          desc: '용암 폭발 (용암 쇄도)',
          conditions: [
            '용암 쇄도 활성',
            '즉시 시전 가능'
          ],
          priority: 1,
          why: '용암 쇄도 프록 즉시 사용 - 원소의 대가 발동'
        },
        {
          skill: skillData.earthquake,
          desc: '지진 (소용돌이 소모)',
          conditions: [
            '소용돌이 60 이상',
            '3+ 적'
          ],
          priority: 1,
          why: '광역 상황에서 대지 충격 대신 지진 사용 - 도트 피해 + 광역'
        },
        {
          skill: skillData.lavaBurst,
          desc: '용암 폭발 (원소의 대가)',
          conditions: [
            '재사용 대기시간 완료',
            '화염 충격 유지 중'
          ],
          priority: 2,
          why: '용암 폭발로 원소의 대가 버프 유지 - 다음 스킬 피해 20% 증가'
        },
        {
          skill: skillData.flameShock,
          desc: '화염 충격 (도트 확산)',
          conditions: [
            '주 대상 도트 만료 직전',
            '또는 승천 버프 활성 (최대 6개 확산)'
          ],
          priority: 2,
          why: '승천 중 화염 충격 1회로 6개 대상에 도트 확산 가능'
        },
        {
          skill: skillData.chainLightning,
          desc: '연쇄 번개 (광역 주력)',
          conditions: [
            '3+ 적',
            '소용돌이 생성'
          ],
          priority: 3,
          why: '광역 상황에서 번개 화살 대신 연쇄 번개 사용 - 소용돌이 생성'
        },
        {
          skill: skillData.lightningBolt,
          desc: '번개 화살 (단일 필러)',
          conditions: [
            '2 이하 적',
            '이동 불필요'
          ],
          priority: 4,
          why: '2 이하 적일 때는 단일 대상 우선순위 사용'
        }
      ]
    },
    mechanics: [
      {
        title: '소용돌이 값 관리',
        icon: '🌀',
        desc: '소용돌이 값 0-100 관리 및 최적 소모 타이밍',
        details: [
          '생성: 번개 화살/연쇄 번개 (+8), 용암 폭발 (+8-12)',
          '소모: 대지 충격 (단일), 지진 (광역 3+ 적)',
          '최적 타이밍: 소용돌이 60 이상 도달 시 즉시 소모',
          '주의: 소용돌이 100 도달 시 생성 중단 → 리소스 낭비'
        ],
        why: '소용돌이 60+ 유지로 DPS 극대화, 100 넘치지 않게 관리'
      },
      {
        title: '용암 쇄도 프록 활용',
        icon: '🔥',
        desc: '번개 화살/연쇄 번개 시전 시 용암 쇄도 확률 발동 (10-15%)',
        details: [
          '용암 쇄도 발동 시: 용암 폭발 재사용 대기시간 초기화 + 즉시 시전',
          '최우선 사용: 용암 쇄도 활성 시 다른 스킬보다 먼저 용암 폭발',
          '원소의 대가 트리거: 용암 폭발 → 다음 스킬 피해 20% 증가 (15초)',
          '티어 4세트: 용암 쇄도 확률 10% 증가'
        ],
        why: '용암 쇄도 즉시 사용가 정기 주술사 DPS의 25-30% 차지'
      },
      {
        title: '원소의 대가 버프 관리',
        icon: '⚡',
        desc: '용암 폭발 시전 후 15초간 다음 스킬 피해 20% 증가',
        details: [
          '1단계: 용암 폭발 시전 → 원소의 대가 버프 활성 (15초)',
          '2단계: 버프 활성 중 가장 강력한 스킬 사용 (폭풍수호자 번개 화살, 대지 충격)',
          '3단계: 버프 만료 전 다음 용암 폭발로 연장',
          '핵심: 원소의 대가를 항상 유지하여 지속적인 피해 증가'
        ],
        why: '원소의 대가 100% 유지 시 전체 DPS 20% 증가'
      },
      {
        title: '화염 충격 도트 유지',
        icon: '🔥',
        desc: '화염 충격 도트를 항상 유지해야 용암 폭발 시전 가능',
        details: [
          '화염 충격 지속시간: 18초 (도트 피해 + 용암 폭발 활성화)',
          '갱신 타이밍: 화염 충격 3초 이하 남았을 때',
          '승천 활성 시: 화염 충격 1회로 최대 6개 대상에 확산',
          '주의: 화염 충격 없으면 용암 폭발 시전 불가'
        ],
        why: '화염 충격 유지가 용암 폭발 사용의 전제 조건'
      },
      {
        title: '버스트 윈도우 최적화',
        icon: '💥',
        desc: '폭풍의 정령 + 폭풍수호자 + 승천 동시 사용으로 극대 DPS',
        details: [
          '1단계: 폭풍의 정령 활성화 (30초 지속)',
          '2단계: 폭풍수호자 사용 → 번개 화살/연쇄 번개 2회 즉시 시전 (150% 피해)',
          '3단계: 승천 활성화 (15초 동안 용암 폭발 즉시 시전)',
          '4단계: 용암 폭발 연타 + 원소의 대가 유지 → 버스트 극대화'
        ],
        why: '3대 쿨다운 동시 사용 시 전체 DPS의 40-50% 차지'
      }
    ]
  },
  stormbringer: {
    name: '폭풍인도자',
    icon: '⚡',
    tierSet: {
      '2set': '용암 폭발이 원소 또는 자연 피해를 15% 증가시키는 용암의 힘을 부여합니다. 8초 지속.',
      '4set': '번개 화살, 용암 폭발 또는 연쇄 번개를 시전하면 소용돌이를 5만큼 추가로 생성합니다.'
    },
    singleTarget: {
      opener: [
        skillData.stormElemental,    // 전투 3초 전: 폭풍의 정령
        skillData.stormkeeper,       // 전투 1.5초 전: 폭풍지기
        skillData.lightningBolt      // Pull: 번개 화살
      ],
      priority: [
        {
          skill: skillData.stormElemental,
          desc: '폭풍의 정령',
          conditions: [
            '쿨다운 완료',
            '즉시 사용'
          ],
          priority: 0,
          why: '주 쿨다운 - 30초간 강력한 피해'
        },
        {
          skill: skillData.stormkeeper,
          desc: '폭풍지기',
          conditions: [
            '쿨다운 완료',
            '즉시 사용'
          ],
          priority: 0,
          why: '번개 화살 2회 강화 - 버스트 윈도우 극대화'
        },
        {
          skill: skillData.flameShock,
          desc: '화염 충격 유지',
          conditions: [
            '도트 유지',
            '지속시간 <6초 또는 없을 때'
          ],
          priority: 1,
          why: '용암 폭발 시전 조건 - 항상 유지 필수'
        },
        {
          skill: skillData.lavaBurst,
          desc: '용암 폭발 (용암 쇄도)',
          conditions: [
            '용암 쇄도 활성',
            '즉시 시전 가능'
          ],
          priority: 1,
          why: '용암 쇄도 프록 즉시 사용 - 원소의 대가 발동'
        },
        {
          skill: skillData.earthShock,
          desc: '대지 충격',
          conditions: [
            '원소의 대가 활성',
            '또는 소용돌이 오버캡 직전'
          ],
          priority: 2,
          why: '원소의 대가 버프와 함께 사용하여 피해 극대화'
        },
        {
          skill: skillData.lavaBurst,
          desc: '용암 폭발',
          conditions: [
            '사용 가능할 때',
            '화염 충격 유지 중'
          ],
          priority: 3,
          why: '원소의 대가 버프 발동 - 항상 우선 사용'
        },
        {
          skill: skillData.lightningBolt,
          desc: '번개 화살',
          conditions: [
            '필러 스킬',
            '소용돌이 생성'
          ],
          priority: 4,
          why: '소용돌이 8 생성 - 기본 필러 스킬'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.stormElemental,    // 전투 3초 전: 폭풍의 정령
        skillData.stormkeeper,       // 전투 1.5초 전: 폭풍지기
        skillData.chainLightning     // Pull: 연쇄 번개
      ],
      priority: [
        {
          skill: skillData.stormElemental,
          desc: '폭풍의 정령',
          conditions: [
            '쿨다운 완료',
            '즉시 사용'
          ],
          priority: 0,
          why: '주 쿨다운 - 30초간 강력한 피해'
        },
        {
          skill: skillData.stormkeeper,
          desc: '폭풍지기',
          conditions: [
            '쿨다운 완료',
            '즉시 사용'
          ],
          priority: 0,
          why: '연쇄 번개 강화 - 광역 피해 극대화'
        },
        {
          skill: skillData.ascendance,
          desc: '승천',
          conditions: [
            '쿨다운 완료',
            '승천 중 가능한 한 많은 지진/연쇄 번개 시전'
          ],
          priority: 0,
          why: '15초간 용암 폭발 즉시 시전 - 광역 버스트'
        },
        {
          skill: skillData.primordialWave,
          desc: '태초의 파도',
          conditions: [
            '승천 후 사용',
            '즉시 사용'
          ],
          priority: 1,
          why: '선조 소환 - 승천 윈도우에서 활용'
        },
        {
          skill: skillData.tempest,
          desc: '폭풍',
          conditions: [
            'Lightning Rod 없는 대상',
            '대상 변경하여 사용'
          ],
          priority: 1,
          why: 'Lightning Rod 확산 - 여러 대상 피해 증가'
        },
        {
          skill: skillData.earthquake,
          desc: '지진',
          conditions: [
            'Echoes of Great Sundering 활성',
            '광역 상황'
          ],
          priority: 2,
          why: 'Lightning Rod 확산 + 광역 피해'
        },
        {
          skill: skillData.elementalBlast,
          desc: '원소 작렬',
          conditions: [
            'Lightning Rod 없는 대상',
            '대상 변경하여 사용'
          ],
          priority: 2,
          why: 'Lightning Rod 확산 - 단일 대상에도 유용'
        },
        {
          skill: skillData.chainLightning,
          desc: '연쇄 번개',
          conditions: [
            '광역 필러',
            '소용돌이 생성'
          ],
          priority: 3,
          why: '소용돌이 생성 + 용암 쇄도 확률 + 전격 방전 중첩 증가'
        },
        {
          skill: skillData.frostShock,
          desc: '냉기 충격 (이동 중)',
          conditions: [
            '이동하면서 시전 필요',
            '소용돌이 60 미만'
          ],
          priority: 4,
          why: '이동 중 즉시 시전 - DPS 손실 최소화'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.flameShock,        // 전투 4초 전: 화염 충격 (주 대상)
        skillData.stormkeeper,       // 전투 3초 전: 폭풍수호자 (연쇄 번개 강화)
        skillData.chainLightning,    // Pull 시작: 연쇄 번개 (폭풍수호자)
        skillData.chainLightning,    // 연쇄 번개 (폭풍수호자)
        skillData.tempest,           // 폭풍 (광역에도 강력)
        skillData.lavaBurst,         // 용암 폭발 (원소의 대가)
        skillData.earthquake,        // 지진 (소용돌이 소모 + 광역)
        skillData.arcDischarge,      // 전격 방전 (광역 폭발)
        skillData.chainLightning,    // 연쇄 번개
        skillData.lavaBurst,         // 용암 폭발 (용암 쇄도)
        skillData.chainLightning,    // 연쇄 번개
        skillData.earthquake         // 지진
      ],
      priority: [
        {
          skill: skillData.tempest,
          desc: '폭풍 (광역 최우선)',
          conditions: [
            '쿨다운 완료',
            '3+ 적'
          ],
          priority: 0,
          why: '폭풍인도자 핵심 - 광역에서도 극대 피해 + 전격 방전 중첩 생성'
        },
        {
          skill: skillData.arcDischarge,
          desc: '전격 방전 (광역 폭발)',
          conditions: [
            '전격 방전 중첩 15+ (최대)',
            '3+ 적'
          ],
          priority: 0,
          why: '광역 상황에서 전격 방전 폭발 피해 극대화 - 모든 대상 피해'
        },
        {
          skill: skillData.stormkeeper,
          desc: '폭풍수호자 (연쇄 번개)',
          conditions: [
            '쿨다운 완료',
            '3+ 적'
          ],
          priority: 0,
          why: '연쇄 번개 2회 즉시 시전 + 150% 피해 - 광역에서 극강'
        },
        {
          skill: skillData.lavaBurst,
          desc: '용암 폭발 (용암 쇄도)',
          conditions: [
            '용암 쇄도 활성',
            '즉시 시전 가능'
          ],
          priority: 1,
          why: '광역에서도 용암 쇄도 즉시 사용 - 원소의 대가 유지'
        },
        {
          skill: skillData.earthquake,
          desc: '지진 (광역 소용돌이 소모)',
          conditions: [
            '소용돌이 60 이상',
            '3+ 적'
          ],
          priority: 1,
          why: '광역 상황 지진 우선 - 대지 충격보다 높은 광역 피해'
        },
        {
          skill: skillData.lavaBurst,
          desc: '용암 폭발 (원소의 대가)',
          conditions: [
            '재사용 대기시간 완료',
            '화염 충격 유지 중'
          ],
          priority: 2,
          why: '광역에서도 원소의 대가 버프 유지'
        },
        {
          skill: skillData.flameShock,
          desc: '화염 충격 (도트 확산)',
          conditions: [
            '주 대상 도트 만료 직전',
            '또는 승천 활성 (6개 확산)'
          ],
          priority: 2,
          why: '승천 중 화염 충격으로 최대 6개 대상 도트 확산'
        },
        {
          skill: skillData.chainLightning,
          desc: '연쇄 번개 (광역 주력)',
          conditions: [
            '3+ 적',
            '소용돌이 생성'
          ],
          priority: 3,
          why: '광역 주력 스킬 - 전격 방전 중첩 + 소용돌이 생성'
        },
        {
          skill: skillData.lightningBolt,
          desc: '번개 화살 (2 이하 적)',
          conditions: [
            '2 이하 적'
          ],
          priority: 4,
          why: '2 이하 적일 때 단일 우선순위로 전환'
        }
      ]
    },
    mechanics: [
      {
        title: '폭풍 (Tempest) 핵심 스킬',
        icon: '⚡',
        desc: '폭풍인도자 전용 스킬 - 막대한 피해 + 전격 방전 활성화',
        details: [
          '재사용 대기시간: 40초 (2 충전)',
          '효과: 강력한 자연 피해 + 소용돌이 40 생성 + 전격 방전 버프 15초',
          '전격 방전 활성화: 번개 화살/연쇄 번개 사용 시 중첩 1개 생성 (최대 15중첩)',
          '최적 타이밍: 쿨다운 완료 즉시 사용 → 전격 방전 중첩 쌓기 시작',
          '버스트 윈도우: 폭풍 → 번개 화살 연타 → 전격 방전 폭발'
        ],
        why: '폭풍인도자의 핵심 - 폭풍 사용 후 전격 방전가 DPS의 40% 차지'
      },
      {
        title: '전격 방전 중첩 관리',
        icon: '💥',
        desc: '폭풍 사용 후 번개 화살로 중첩 쌓아 폭발 피해',
        details: [
          '중첩 생성: 전격 방전 버프 활성 중 번개 화살/연쇄 번개 시전마다 +1',
          '최대 중첩: 15중첩 (중첩당 피해 증가)',
          '폭발 타이밍: 15중첩 도달 또는 버프 만료 3초 전',
          '폭발 효과: 전격 방전 사용 시 모든 중첩 소모 → 단일/광역 폭발 피해',
          '핵심: 15중첩 달성 후 즉시 전격 방전으로 최대 피해'
        ],
        why: '전격 방전 15중첩 폭발가 폭풍인도자 버스트의 핵심'
      },
      {
        title: '깨어나는 폭풍 (Awakening Storms)',
        icon: '🌩️',
        desc: '폭풍 사용 시 추가 효과 발동 패시브',
        details: [
          '발동: 폭풍 사용 시 자동 발동',
          '효과 1: 번개 화살/연쇄 번개 재사용 대기시간 감소 (4초)',
          '효과 2: 번개 화살/연쇄 번개 피해 증가 (20%, 12초 지속)',
          '효과 3: 용암 쇄도 확률 증가 (15%, 12초 지속)',
          '최적 활용: 폭풍 → 폭풍수호자 → 번개 화살 연타로 극대화'
        ],
        why: '폭풍인도자 특성 - 폭풍 사용 후 12초간 모든 스킬 강화'
      },
      {
        title: '소용돌이 관리 (폭풍인도자)',
        icon: '🌀',
        desc: '폭풍으로 소용돌이 40 즉시 생성',
        details: [
          '일반 생성: 번개 화살/연쇄 번개 (+8)',
          '폭풍 생성: 폭풍 사용 시 소용돌이 40 즉시 생성',
          '소모: 대지 충격 (단일), 지진 (광역)',
          '최적 운용: 폭풍 → 소용돌이 40 획득 → 번개 화살 → 소용돌이 60+ → 대지 충격',
          '주의: 폭풍인도자도(도) 소용돌이 100 넘치지 않게 관리'
        ],
        why: '폭풍으로 즉시 소용돌이 40 생성 → 빠른 대지 충격 가능'
      },
      {
        title: '폭풍인도자 버스트 사이클',
        icon: '💫',
        desc: '폭풍 → 전격 방전 중첩 → 폭발의 3단계 사이클',
        details: [
          '1단계: 폭풍 사용 (소용돌이 40 + 전격 방전 버프 15초)',
          '2단계: 폭풍수호자 → 번개 화살/연쇄 번개 연타 (15중첩 달성)',
          '3단계: 전격 방전 폭발 (15중첩 소모 → 막대한 피해)',
          '4단계: 깨어나는 폭풍 버프 유지 중 원소의 대가 버프와 동기화',
          '최적: 폭풍 40초마다 사이클 반복 (2 충전 번갈아 사용)'
        ],
        why: '폭풍인도자 핵심 사이클 - 이 패턴가 DPS의 70-80% 차지'
      }
    ]
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
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: getSkillColor(),
          fontWeight: 'bold',
          cursor: 'pointer',
          textShadow: skill.type === 'passive' ? 'none' : '0 0 4px rgba(170, 211, 114, 0.3)',
          transition: 'all 0.2s ease',
          verticalAlign: 'middle'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <img
          src={`https://wow.zamimg.com/images/wow/icons/large/${enhancedSkill.icon}.jpg`}
          alt={enhancedSkill.koreanName}
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '3px',
            display: 'inline-block',
            verticalAlign: 'middle'
          }}
          onError={(e) => {
            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
          }}
        />
        <span style={{ lineHeight: '18px', verticalAlign: 'middle' }}>{enhancedSkill.koreanName}</span>
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

// 영어 용어 툴팁 컴포넌트 (심화 분석 섹션용)
const EnglishTerm = ({ english, korean, description = '' }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const termRef = useRef(null);

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
    if (!isTooltipVisible || !termRef.current) return null;

    const rect = termRef.current.getBoundingClientRect();
    const tooltipWidth = 300;
    const tooltipHeight = description ? 120 : 80;

    let top = rect.top - tooltipHeight - 10;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    if (top < 10) {
      top = rect.bottom + 10;
    }
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
      backgroundImage: 'linear-gradient(135deg, rgba(63, 198, 234, 0.1) 0%, transparent 50%)',
      border: '2px solid #0070DE',
      borderRadius: '10px',
      padding: '12px',
      zIndex: 10000,
      width: `${tooltipWidth}px`,
      pointerEvents: 'none',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(63, 198, 234, 0.2)',
      animation: 'fadeIn 0.2s ease-in-out'
    };

    return ReactDOM.createPortal(
      <div style={tooltipStyle}>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: 'bold',
          color: '#e0e0e0',
          marginBottom: description ? '8px' : '4px'
        }}>
          {korean}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: '#0070DE',
          marginBottom: description ? '8px' : '0'
        }}>
          {english}
        </div>
        {description && (
          <div style={{
            fontSize: '0.8rem',
            color: '#a0a0a0',
            lineHeight: '1.4',
            borderTop: '1px solid rgba(63, 198, 234, 0.2)',
            paddingTop: '8px'
          }}>
            {description}
          </div>
        )}
      </div>,
      getTooltipPortal()
    );
  };

  return (
    <span
      ref={termRef}
      style={{
        color: '#0070DE',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderBottom: '1px dotted #0070DE',
        textShadow: '0 0 4px rgba(63, 198, 234, 0.3)',
        transition: 'all 0.2s ease',
        padding: '0 2px'
      }}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      {english}
      {<Tooltip />}
    </span>
  );
};

const ElementalShamanGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [selectedTier, setSelectedTier] = useState('farseer');
  const [showToast, setShowToast] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('raid-single');
  const [selectedStatHero, setSelectedStatHero] = useState('farseer');
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
    window.updateDevastationEvokerGuide = updateGuideData;
    return () => {
      delete window.updateDevastationEvokerGuide;
    };
  }, []);

  // SkillIcon을 내부에서 사용할 수 있도록 설정
  const SkillIcon = SkillIconComponent;

  // EnglishTerm 컴포넌트도 내부에서 사용 가능하도록 설정
  const Term = EnglishTerm;

  // 텍스트에서 스킬명을 찾아 SkillIcon으로 교체하는 헬퍼 함수
  const renderTextWithSkillIcons = (text) => {
    if (!text) return text;

    // 스킬명과 스킬 데이터 매핑 (스킬 + 버프/메커니즘)
    const skillNameMap = {
      // 주력 스킬
      '번개 화살': skillData.lightningBolt,
      '용암 폭발': skillData.lavaBurst,
      '대지 충격': skillData.earthShock,
      '지진': skillData.earthquake,
      '화염 충격': skillData.flameShock,
      '연쇄 번개': skillData.chainLightning,
      '전격 방전': skillData.lightningBoltOverload,
      // 쿨다운 스킬
      '폭풍지기': skillData.stormkeeper,
      '폭풍의 정령': skillData.stormElemental,
      '승천': skillData.ascendance,
      '태초의 파도': skillData.primordialWave,
      '정화의 토템': skillData.purifyingTotem,
      '뇌우': skillData.thunderstorm,
      // 유틸리티
      '늑대 정령': skillData.ghostWolf,
      '대지의 정령': skillData.earthElemental,
      '영웅심': skillData.heroism,
      '피의 욕망': skillData.bloodlust,
      '진정의 토템': skillData.tremorTotem,
      '땅가르기': skillData.earthenWall,
      // 버프 및 메커니즘
      '원소의 대가': skillData.masterOfTheElements,
      '용암 쇄도': skillData.lavaSurge,
      '깨어나는 폭풍': skillData.awakeningStorms,
      '폭풍 변환': skillData.tempest,
      '선조의 부름': skillData.callOfTheAncestors,
      '선조의 신속함': skillData.ancestorSwiftness,
      // 리소스
      '소용돌이': skillData.maelstrom,
      '소용돌이 100': skillData.maelstrom,
      '소용돌이 60': skillData.maelstrom,
      '소용돌이 80': skillData.maelstrom,
      '소용돌이 300': skillData.maelstrom,
      '소용돌이 값': skillData.maelstrom
    };

    // 1단계: "한글 (English)" 패턴 제거 (괄호와 영어 제거)
    let processedText = text.replace(/([가-힣\s]+)\s*\(([A-Z][a-zA-Z\s]+)\)/g, '$1');

    // 2단계: 스킬 이름 처리
    const termNames = Object.keys(skillNameMap).sort((a, b) => b.length - a.length);
    const termPattern = new RegExp(termNames.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');

    const parts = [];
    let lastIndex = 0;
    let match;
    let matchIndex = 0;

    while ((match = termPattern.exec(processedText)) !== null) {
      // 용어 이전 텍스트
      if (match.index > lastIndex) {
        parts.push(processedText.substring(lastIndex, match.index));
      }

      const termName = match[0].trim();

      // 스킬 아이콘 추가
      if (skillNameMap[termName]) {
        const skillObj = skillNameMap[termName];
        parts.push(
          <React.Fragment key={`skill-${matchIndex}`}>
            <SkillIcon skill={skillObj} textOnly />
          </React.Fragment>
        );
      }

      lastIndex = match.index + termName.length;
      matchIndex++;
    }

    // 나머지 텍스트
    if (lastIndex < processedText.length) {
      parts.push(processedText.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : processedText;
  };

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
  };

  // 유기적 모듈 초기화 및 연결
  useEffect(() => {
    // 모듈 등록
    moduleEventBus.registerModule('devastationEvokerGuide', {
      name: 'Devastation Evoker Guide',
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
          <h3 className={styles.subsectionTitle}>정기 주술사 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            정기 주술사는 <strong style={{ color: '#0070DE' }}>소용돌이 값을 관리하여 강력한 자연 피해를 입히는</strong> 원거리 캐스터 DPS 전문화입니다.
            <strong style={{ color: '#FFD700' }}>레이드에서는 선견자</strong>를 사용하여 안정적인 단일 대상 피해를 제공하고,
            <strong style={{ color: '#32CD32' }}>쐐기에서는 폭풍인도자</strong>를 사용하여 폭발적인 광역 피해를 입힙니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: '단일 대상', value: '5/5', color: '#FFD700' },
              { label: '광역', value: '4/5', color: '#32CD32' },
              { label: '유틸리티', value: '4/5', color: '#0070DE' },
              { label: '생존력', value: '3/5', color: '#ffa500' },
              { label: '기동성', value: '3/5', color: '#ff6b6b' }
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                textAlign: 'center',
                border: `1px solid ${color}30`
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color, marginBottom: '5px' }}>{value}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{label}</div>
              </div>
            ))}
          </div>

          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            정기 주술사는 <strong style={{ color: '#0070DE' }}>소용돌이 값 0-100을 쌓고 소모하는</strong> 메커니즘을 가지고 있습니다.
            <SkillIcon skill={skillData.lightningBolt} textOnly={true} />와 {' '}
            <SkillIcon skill={skillData.chainLightning} textOnly={true} />로 소용돌이 값을 생성하고,
            <SkillIcon skill={skillData.earthShock} textOnly={true} /> 또는 <SkillIcon skill={skillData.earthquake} textOnly={true} />로 폭발적인 피해를 입힙니다.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            용암 쇄도 프록 발동 시 <SkillIcon skill={skillData.lavaBurst} textOnly={true} />를 즉시 시전하며,
            <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 사용 후에는
            <SkillIcon skill={skillData.masterOfTheElements} textOnly={true} /> 버프로 다음 스킬 피해가 20% 증가합니다.
            <SkillIcon skill={skillData.stormkeeper} textOnly={true} />는 번개 화살을 강화하여 버스트 윈도우를 극대화합니다.
          </p>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {[
              { skill: skillData.lightningBolt, label: '소용돌이 8 생성' },
              { skill: skillData.lavaBurst, label: '원소의 대가 트리거' },
              { skill: skillData.earthShock, label: '소용돌이 소모 (단일)' },
              { skill: skillData.earthquake, label: '소용돌이 소모 (광역)' },
              { skill: skillData.stormkeeper, label: '번개 화살 강화' },
              { skill: skillData.stormElemental, label: '주 쿨다운' }
            ].map(({ skill, label }) => (
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
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, color: label.includes('생성') ? '#32CD32' : label.includes('조각') ? '#9482C9' : '#ffa500' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          <h4 ref={subSectionRefs['overview-resource']} style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>리소스 시스템</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li>주 자원: <span style={{ color: '#0070DE', fontWeight: 'bold' }}>마나</span> (최대 100%, 전투 중 자연 회복 있음)</li>
            <li>보조 자원: <span style={{ color: '#0070DE', fontWeight: 'bold' }}>소용돌이 값</span> (최대 100, 전투 이탈 시 유지)</li>
            <li>소용돌이 생성:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.lightningBolt} textOnly={true} /> - 소용돌이 8 생성 (기본 스킬)</li>
                <li><SkillIcon skill={skillData.chainLightning} textOnly={true} /> - 소용돌이 8 생성 (광역)</li>
                <li><SkillIcon skill={skillData.lavaBurst} textOnly={true} /> - 소용돌이 8-12 생성 (용암 쇄도 프록 시)</li>
              </ul>
            </li>
            <li>소용돌이 소비:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.earthShock} textOnly={true} /> - 소용돌이 60 소모 (단일 대상 피해)</li>
                <li><SkillIcon skill={skillData.earthquake} textOnly={true} /> - 소용돌이 60 소모 (광역 도트 피해)</li>
              </ul>
            </li>
            <li><strong style={{ color: '#ffa500' }}>핵심 전략:</strong> 소용돌이 60+ 도달 시 즉시 소모 → <SkillIcon skill={skillData.earthShock} textOnly={true} />로 폭발적 피해</li>
            <li><strong style={{ color: '#ff6b6b' }}>주의:</strong> 소용돌이가 100 도달하면 생성 중단 → 리소스 낭비 방지 필수</li>
          </ul>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginTop: '25px', marginBottom: '15px' }}>영웅 특성 메커니즘</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ padding: '15px', background: 'rgba(0, 112, 222, 0.1)', borderRadius: '8px', border: '1px solid #0070DE30' }}>
              <h5 style={{ color: '#0070DE', fontSize: '1.1rem', marginBottom: '10px' }}>🔮 선견자 (레이드)</h5>
              <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                <li><strong>선조의 부름:</strong> <SkillIcon skill={skillData.primordialWave} textOnly={true} /> 또는 <SkillIcon skill={skillData.ancestralSwiftness} textOnly={true} /> 사용 시 선조 소환</li>
                <li><strong>선조 행동:</strong> 플레이어의 주문을 따라 시전
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>단일 대상: <SkillIcon skill={skillData.lavaBurst} textOnly={true} /></li>
                    <li>광역: <SkillIcon skill={skillData.chainLightning} textOnly={true} /></li>
                  </ul>
                </li>
                <li><strong>정령 쿨다운 감소:</strong> 불/폭풍의 정령 쿨다운 5초 감소</li>
              </ul>
            </div>
            <div style={{ padding: '15px', background: 'rgba(50, 205, 50, 0.1)', borderRadius: '8px', border: '1px solid #32CD3230' }}>
              <h5 style={{ color: '#32CD32', fontSize: '1.1rem', marginBottom: '10px' }}>⚡ 폭풍인도자 (쐐기)</h5>
              <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                <li><strong>폭풍 변환:</strong> <SkillIcon skill={skillData.lightningBolt} textOnly={true} />가 <SkillIcon skill={skillData.tempest} textOnly={true} />로 변환
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>소용돌이 300 소모 후</li>
                    <li>깨어나는 폭풍 3중첩 획득 시</li>
                  </ul>
                </li>
                <li><strong>전격 방전:</strong> 다음 <SkillIcon skill={skillData.lightningBolt} textOnly={true} /> / <SkillIcon skill={skillData.chainLightning} textOnly={true} /> 2회
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>즉시 시전</li>
                    <li>피해 40% 증가</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginTop: '25px', marginBottom: '15px' }}>주요 메커니즘</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li><strong style={{ color: '#0070DE' }}>소용돌이 관리:</strong> 오버캡 방지가 핵심 - <SkillIcon skill={skillData.masterOfTheElements} textOnly={true} /> 활성 시 또는(는) 소용돌이 높을 때 <SkillIcon skill={skillData.earthShock} textOnly={true} /> 사용</li>
            <li><strong style={{ color: '#ff6b6b' }}>원소의 대가:</strong> <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 사용 후 15초간 다음 스킬 피해 20% 증가</li>
            <li><strong style={{ color: '#ffa500' }}>화염 충격 유지:</strong> <SkillIcon skill={skillData.flameShock} textOnly={true} /> 도트를 항상 유지해야 <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 시전 가능</li>
            <li><strong style={{ color: '#FFD700' }}>버스트 윈도우:</strong> <SkillIcon skill={skillData.stormElemental} textOnly={true} /> + <SkillIcon skill={skillData.stormkeeper} textOnly={true} /> + <SkillIcon skill={skillData.ascendance} textOnly={true} /> 동시 사용으로 극대 DPS</li>
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
              className={`${styles.tierTab} ${selectedTier === 'farseer' ? styles.active : ''}`}
              onClick={() => setSelectedTier('farseer')}
            >
              <span className={styles.tierIcon}>🔮</span> 선견자
            </button>
            <button
              className={`${styles.tierTab} ${selectedTier === 'stormbringer' ? styles.active : ''}`}
              onClick={() => setSelectedTier('stormbringer')}
            >
              <span className={styles.tierIcon}>⚡</span> 폭풍인도자
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'farseer' ? '#0070DE' : '#0070DE'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'farseer'
                ? 'linear-gradient(135deg, rgba(63, 198, 234, 0.1), rgba(63, 198, 234, 0.05))'
                : 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'farseer'
                ? '1px solid rgba(63, 198, 234, 0.3)'
                : '1px solid rgba(78, 205, 196, 0.3)'
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
                  {renderTextWithSkillIcons(currentContent.tierSet['2set'])}
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
                  {renderTextWithSkillIcons(currentContent.tierSet['4set'])}
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
            border: selectedTier === 'farseer'
              ? '1px solid rgba(63, 198, 234, 0.3)'
              : '1px solid rgba(78, 205, 196, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'farseer' ? '#0070DE' : '#0070DE'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'farseer' ? (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#0070DE' }}>선견자</strong>는 {' '}
                  {renderTextWithSkillIcons('선조의 부름')} 메커니즘과 {renderTextWithSkillIcons('원소의 대가')} 버프를 극대화하는 {' '}
                  <strong style={{ color: '#0070DE' }}>안정적인 단일 대상 피해</strong>로 {' '}
                  <strong style={{ color: '#ffa500' }}>레이드 보스전에서 최고의 성능</strong>을 제공합니다.
                  {renderTextWithSkillIcons('태초의 파도')}와 {renderTextWithSkillIcons('선조의 신속함')}을 함께 사용하여
                  강화된 선조를 소환하는 것이 핵심입니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#0070DE', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('용암 폭발')} - 핵심 피해 스킬
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li><strong style={{ color: '#0070DE' }}>항상 사용 가능할 때 시전:</strong> {renderTextWithSkillIcons('용암 폭발')}은 {renderTextWithSkillIcons('화염 충격')} 유지 중 항상 우선</li>
                    <li><strong style={{ color: '#ffa500' }}>원소의 대가:</strong> {renderTextWithSkillIcons('용암 폭발')} 후 15초간 다음 스킬 피해 20% 증가</li>
                    <li><strong style={{ color: '#0070DE' }}>티어 4세트:</strong> 주문 피해 증가, 마나 비용 감소, {renderTextWithSkillIcons('용암 폭발')} 충전 증가</li>
                    <li><strong style={{ color: '#FFD700' }}>선조 소환:</strong> {renderTextWithSkillIcons('태초의 파도')} + {renderTextWithSkillIcons('선조의 신속함')} 함께 사용</li>
                  </ul>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    선견자는 {renderTextWithSkillIcons('태초의 파도')}와 {renderTextWithSkillIcons('선조의 신속함')}을 함께 사용하여 강화된 선조를 소환하고, {' '}
                    {renderTextWithSkillIcons('원소의 대가')} 버프를 항상 유지해야 DPS가 극대화됩니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#0070DE', fontSize: '1.1rem', marginBottom: '15px' }}>
                    소용돌이 관리 - 오버캡 방지
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 규칙:</strong> {renderTextWithSkillIcons('원소의 대가')} 활성 시 또는 소용돌이 오버캡 직전 {renderTextWithSkillIcons('대지 충격')} 사용
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>최적 타이밍:</strong> {renderTextWithSkillIcons('원소의 대가')} 버프와 함께 {renderTextWithSkillIcons('대지 충격')} 사용하여 피해 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>승천 중:</strong> {renderTextWithSkillIcons('승천')} 활성 시 {renderTextWithSkillIcons('냉기 충격')} 사용 금지 (이동 시 제외)
                    </li>
                    <li>
                      <strong>얼음격노 활용:</strong> {renderTextWithSkillIcons('정기의 융합')} 비활성 시 {renderTextWithSkillIcons('얼음격노')} 사용
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: {renderTextWithSkillIcons('원소의 대가')} 버프 100% 유지가 DPS 극대화의 핵심입니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#0070DE' }}>소용돌이 관리:</strong> 오버캡 방지 최우선, {renderTextWithSkillIcons('원소의 대가')} 활성 시 {renderTextWithSkillIcons('대지 충격')} 우선
                    </li>
                    <li>
                      {renderTextWithSkillIcons('원소의 대가')} - 15초 버프 100% 유지가 핵심 ({renderTextWithSkillIcons('용암 폭발')} 쿨다운마다 사용)
                    </li>
                    <li>{renderTextWithSkillIcons('화염 충격')} 도트 항상 유지 필수 - {renderTextWithSkillIcons('용암 폭발')} 시전 조건</li>
                    <li>레이드 단일 대상과 보스 버스트 구간에서 최고 성능</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#32CD32' }}>폭풍인도자</strong>는 {' '}
                  {renderTextWithSkillIcons('폭풍 변환')}과 {renderTextWithSkillIcons('Lightning Rod 확산')}을 통한 {' '}
                  <strong style={{ color: '#32CD32' }}>광역 피해 극대화 플레이</strong>로 {' '}
                  <strong style={{ color: '#ffa500' }}>쐐기돌에서 최고의 성능</strong>을 제공합니다.
                  {renderTextWithSkillIcons('승천')} 중 최대한 많은 {renderTextWithSkillIcons('지진')}과 {renderTextWithSkillIcons('연쇄 번개')}를 시전하는 것이 핵심입니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#32CD32', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('폭풍')} - 소용돌이 300 소모 후 변환
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#FFD700' }}>변환 조건:</strong> 소용돌이 300 소모 후 + {renderTextWithSkillIcons('깨어나는 폭풍')} 3중첩
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>대상 변경:</strong> Lightning Rod 없는 대상에 {renderTextWithSkillIcons('폭풍')} 사용하여 디버프 확산
                    </li>
                    <li>
                      <strong style={{ color: '#0070DE' }}>광역 활용:</strong> {renderTextWithSkillIcons('지진')}, {renderTextWithSkillIcons('원소 작렬')}로 Lightning Rod 확산
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: {renderTextWithSkillIcons('승천')} 중 {renderTextWithSkillIcons('지진')}과 {renderTextWithSkillIcons('연쇄 번개')}를 최대한 많이 시전하여 광역 버스트 극대화
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#0070DE', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('전격 방전')} - 버스트 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      {renderTextWithSkillIcons('폭풍')} 사용 시 전격 방전 버프 15초 활성화
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>중첩 생성:</strong> 번개 화살/연쇄 번개 시전 시 중첩 1개 (최대 15중첩)
                    </li>
                    <li>
                      <strong style={{ color: '#0070DE' }}>연계:</strong> {renderTextWithSkillIcons('폭풍')} → 번개 화살 연타 → 15중첩 → {renderTextWithSkillIcons('전격 방전')} 폭발
                    </li>
                    <li>
                      {renderTextWithSkillIcons('폭풍의 정령')}와 함께 사용하여 폭발 딜 극대화
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#0070DE' }}>버스트 중심:</strong> {renderTextWithSkillIcons('폭풍')} 40초 쿨다운 → 주기적 전격 방전 폭발 패턴
                    </li>
                    <li>
                      <strong style={{ color: '#0070DE' }}>중첩 관리:</strong> 전격 방전 15중첩 도달 시 즉시 사용 (버프 만료 전)
                    </li>
                    <li>
                      {renderTextWithSkillIcons('깨어나는 폭풍')} 버프로 추가 피해 증가
                    </li>
                    <li>쐐기돌 광역와 레이드 단일 대상 모두에서 최고 성능</li>
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
              <p style={{ color: selectedTier === 'farseer' ? '#0070DE' : '#0070DE', fontSize: '0.95rem', margin: 0 }}>
                <strong>💡 추천 콘텐츠:</strong> {' '}
                {selectedTier === 'farseer' ?
                  '단일 보스 레이드, 버스트 딜이 중요한 전투' :
                  '쐐기돌 던전, 광역 딜이 필요한 레이드 구간'}
              </p>
            </div>
          </div>

          {/* 단일 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-single']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'farseer' ? '#0070DE' : '#0070DE',
              marginTop: '1.5rem'
            }}>단일 대상</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px' }}>
                {selectedTier === 'farseer' ?
                  renderTextWithSkillIcons('⏱️ 전투 3초 전: 폭풍의 정령 소환 → 전투 1.5초 전: 폭풍지기 사용 → Pull: 번개 화살') :
                  renderTextWithSkillIcons('⏱️ 전투 3초 전: 폭풍의 정령 소환 → 전투 1.5초 전: 폭풍지기 사용 → Pull: 연쇄 번개')}
              </p>
              <div className={styles.skillSequence}>
                {currentContent.singleTarget.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              {selectedTier === 'farseer' && (
                <p style={{ fontSize: '0.85rem', color: '#0070DE', marginTop: '8px' }}>
                  💡 팁: {renderTextWithSkillIcons('폭풍의 정령은 전투 3초 전 프리-풀 전용 - 30초간 강력한 피해')}
                </p>
              )}
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentContent.singleTarget.priority.map((item, index) => (
                <div key={index} style={{
                  background: index === 0 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : '#666'}`,
                  border: index === 0 ? '2px solid #ff6b6b' : 'none'
                }}>
                  {/* 우선순위 번호 + 스킬명 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      background: index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : '#666',
                      color: '#fff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: index === 0 ? '0.95rem' : '0.85rem',
                      fontWeight: 'bold',
                      boxShadow: index === 0 ? '0 0 10px rgba(255, 107, 107, 0.5)' : 'none'
                    }}>
                      {index === 0 ? '0' : index}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SkillIcon skill={item.skill} textOnly={true} />
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>- {renderTextWithSkillIcons(item.desc)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 조건 */}
                  {item.conditions && (
                    <div style={{ marginLeft: '34px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '4px' }}>📋 조건:</div>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                        {item.conditions.map((condition, idx) => (
                          <li key={idx} style={{ color: '#ccc' }}>{renderTextWithSkillIcons(condition)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 이유 */}
                  {item.why && (
                    <div style={{
                      marginLeft: '34px',
                      padding: '6px 10px',
                      background: 'rgba(255, 165, 0, 0.1)',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#ffa500'
                    }}>
                      💡 {renderTextWithSkillIcons(item.why)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 광역 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-aoe']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'farseer' ? '#9482C9' : '#32CD32',
              marginTop: '1.5rem'
            }}>광역 대상 (4+ 타겟)</h3>

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
              {selectedTier === 'farseer' && (
                <p style={{ fontSize: '0.85rem', color: '#0070DE', marginTop: '8px' }}>
                  💡 팁: {renderTextWithSkillIcons('폭풍의 정령은 전투 3초 전 프리-풀 전용 - 30초간 강력한 피해')}
                </p>
              )}
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentContent.aoe.priority.map((item, index) => (
                <div key={index} style={{
                  background: index === 0 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : '#666'}`,
                  border: index === 0 ? '2px solid #ff6b6b' : 'none'
                }}>
                  {/* 우선순위 번호 + 스킬명 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      background: index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : '#666',
                      color: '#fff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: index === 0 ? '0.95rem' : '0.85rem',
                      fontWeight: 'bold',
                      boxShadow: index === 0 ? '0 0 10px rgba(255, 107, 107, 0.5)' : 'none'
                    }}>
                      {index === 0 ? '0' : index}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SkillIcon skill={item.skill} textOnly={true} />
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>- {renderTextWithSkillIcons(item.desc)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 조건 */}
                  {item.conditions && (
                    <div style={{ marginLeft: '34px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '4px' }}>📋 조건:</div>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                        {item.conditions.map((condition, idx) => (
                          <li key={idx} style={{ color: '#ccc' }}>{renderTextWithSkillIcons(condition)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 이유 */}
                  {item.why && (
                    <div style={{
                      marginLeft: '34px',
                      padding: '6px 10px',
                      background: 'rgba(255, 165, 0, 0.1)',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#ffa500'
                    }}>
                      💡 {renderTextWithSkillIcons(item.why)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 게임 메커니즘 섹션 */}
          <div className={styles.subsection} style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1.5rem',
            border: '1px solid rgba(100, 200, 255, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'farseer' ? '#9482C9' : '#32CD32',
              marginBottom: '1.5rem'
            }}>
              🎮 게임 메커니즘
            </h3>

            <div style={{ display: 'grid', gap: '20px' }}>
              {currentContent.mechanics.map((mechanic, index) => (
                <div key={index} style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '15px',
                  borderRadius: '8px',
                  borderLeft: '4px solid rgba(100, 200, 255, 0.5)'
                }}>
                  {/* 메커니즘 제목 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{mechanic.icon}</span>
                    <h4 style={{
                      color: '#64c8ff',
                      fontSize: '1.1rem',
                      margin: 0
                    }}>
                      {mechanic.title}
                    </h4>
                  </div>

                  {/* 설명 */}
                  <p style={{
                    color: '#ccc',
                    fontSize: '0.95rem',
                    marginBottom: '12px',
                    lineHeight: '1.6'
                  }}>
                    {renderTextWithSkillIcons(mechanic.desc)}
                  </p>

                  {/* 세부 사항 */}
                  <ul style={{
                    margin: '0 0 12px 0',
                    paddingLeft: '20px',
                    fontSize: '0.9rem',
                    lineHeight: '1.7'
                  }}>
                    {mechanic.details.map((detail, idx) => (
                      <li key={idx} style={{ color: '#aaa', marginBottom: '6px' }}>
                        {renderTextWithSkillIcons(detail)}
                      </li>
                    ))}
                  </ul>

                  {/* 중요도 */}
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(100, 200, 255, 0.1)',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    color: '#64c8ff',
                    fontStyle: 'italic'
                  }}>
                    💡 {renderTextWithSkillIcons(mechanic.why)}
                  </div>
                </div>
              ))}
            </div>
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

            {selectedTier === 'farseer' && (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ {renderTextWithSkillIcons('소용돌이 값')} 생성/소비
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> 선견자의 전체 플레이스타일은 {renderTextWithSkillIcons('소용돌이 값')}을 최대한 효율적으로 생성하고 소비하는 것
                    </li>
                    <li>
                      <strong>소비 방법:</strong> {renderTextWithSkillIcons('대지 충격')}을 통해 {renderTextWithSkillIcons('소용돌이 값')} 60 소비
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>{renderTextWithSkillIcons('용암 쇄도')}:</strong> {renderTextWithSkillIcons('용암 폭발')} 시전 시 중첩, 다음 {renderTextWithSkillIcons('번개 화살')} 즉시 시전
                    </li>
                    <li>
                      <strong>생성 조건:</strong> {renderTextWithSkillIcons('번개 화살')} 8, {renderTextWithSkillIcons('용암 폭발')} 10, {renderTextWithSkillIcons('연쇄 번개')} 4 생성
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>최적화:</strong> {renderTextWithSkillIcons('승천')} 동안 최대한 많은 {renderTextWithSkillIcons('용암 폭발')} 시전
                    </li>
                  </ul>
                </div>

                {/* Maxroll 기반 선견자(Farseer) 심화 분석 */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔮 {renderTextWithSkillIcons('선조의 부름')} 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> {renderTextWithSkillIcons('태초의 파도')} 또는 {renderTextWithSkillIcons('선조의 신속함')} 사용 시 선조 소환
                    </li>
                    <li>
                      <strong>선조 행동:</strong> 플레이어의 주문을 따라 시전
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                        <li>단일 대상: {renderTextWithSkillIcons('용암 폭발')} 시전</li>
                        <li>광역: {renderTextWithSkillIcons('연쇄 번개')} 시전</li>
                      </ul>
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>최적화:</strong> {renderTextWithSkillIcons('태초의 파도')}와 {renderTextWithSkillIcons('선조의 신속함')}을 함께 사용하여 강화된 선조 소환
                    </li>
                    <li>
                      <strong>쿨다운 감소:</strong> 불/폭풍의 정령 쿨다운 5초 감소
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💥 {renderTextWithSkillIcons('원소의 대가')} 버프 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>발동 조건:</strong> {renderTextWithSkillIcons('용암 폭발')} 사용 후 15초간 활성
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>효과:</strong> 다음 주문 피해 20% 증가
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>우선 순위:</strong> {renderTextWithSkillIcons('원소의 대가')} 버프 시 {renderTextWithSkillIcons('대지 충격')} 또는 {renderTextWithSkillIcons('지진')} 사용
                    </li>
                    <li>
                      <strong>버스트 극대화:</strong> {renderTextWithSkillIcons('승천')} 동안 최대한 많은 {renderTextWithSkillIcons('용암 폭발')} 시전 → {renderTextWithSkillIcons('원소의 대가')} 지속 유지
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ {renderTextWithSkillIcons('승천')} 윈도우 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>기간:</strong> 15초간 {renderTextWithSkillIcons('용암 폭발')} 즉시 시전 + 30% 피해 증가
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>쿨다운 정렬:</strong> {renderTextWithSkillIcons('폭풍의 정령')} + {renderTextWithSkillIcons('폭풍지기')} + {renderTextWithSkillIcons('승천')} 동시 사용
                    </li>
                    <li>
                      <strong>윈도우 내 우선순위:</strong>
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                        <li>{renderTextWithSkillIcons('용암 폭발')} (최우선)</li>
                        <li>{renderTextWithSkillIcons('대지 충격')} (소용돌이 60+)</li>
                        <li>{renderTextWithSkillIcons('번개 화살')} (필러)</li>
                      </ul>
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>극대화 팁:</strong> {renderTextWithSkillIcons('승천')} 전 소용돌이 40-50 유지 → 윈도우 내 {renderTextWithSkillIcons('대지 충격')} 2회 이상 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🌊 {renderTextWithSkillIcons('태초의 파도')} 활용법
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>효과:</strong> 대상에게 {renderTextWithSkillIcons('화염 충격')} 적용 + 다음 {renderTextWithSkillIcons('용암 폭발')} 2배 피해
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>타이밍:</strong> 쿨다운마다 사용 - {renderTextWithSkillIcons('용암 폭발')} 전에 시전
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>버스트 활용:</strong> {renderTextWithSkillIcons('선조의 신속함')}과 동시 사용 → 강화된 선조 소환
                    </li>
                    <li>
                      <strong>광역 상황:</strong> {renderTextWithSkillIcons('화염 충격')} 확산 효과로 다수 대상 도트 적용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚠️ 소용돌이 값 오버캡 방지
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>위험 구간:</strong> 소용돌이 80+ 도달 시 즉시 {renderTextWithSkillIcons('대지 충격')} 사용
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>오버캡 방지:</strong> 소용돌이 100 도달 시 추가 생성 불가 → 리소스 낭비
                    </li>
                    <li>
                      <strong>최적 사용:</strong> {renderTextWithSkillIcons('원소의 대가')} 버프 활성 + 소용돌이 60+ 시 {renderTextWithSkillIcons('대지 충격')} 우선
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>고급 팁:</strong> {renderTextWithSkillIcons('폭풍지기')} 사용 전 소용돌이 50-60 유지 → 3회 {renderTextWithSkillIcons('번개 화살')} 후 {renderTextWithSkillIcons('대지 충격')}
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Maxroll 기반 폭풍인도자(Stormbringer) 심화 분석 */}
            {selectedTier === 'stormbringer' && (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ {renderTextWithSkillIcons('폭풍 변환')} 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> {renderTextWithSkillIcons('소용돌이 300+ 시 폭풍 사용 가능')}
                    </li>
                    <li>
                      <strong style={{ color: '#28a745' }}>폭풍 타이밍:</strong> {renderTextWithSkillIcons('지진 시전 중 폭풍 사용 → 시전 중단 없이 즉시 발동')}
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>광역 최적화:</strong> {renderTextWithSkillIcons('3+ 적에서 폭풍 → 지진 콤보 우선')}
                    </li>
                    <li>
                      <strong style={{ color: '#dc3545' }}>주의사항:</strong> {renderTextWithSkillIcons('소용돌이 300 미만 시 폭풍 사용 불가 → 리소스 낭비 방지')}
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ {renderTextWithSkillIcons('깨어나는 폭풍')} 중첩 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>중첩 획득:</strong> {renderTextWithSkillIcons('번개 화살 또는 연쇄 번개 시전 시 1중첩 (최대 3중첩)')}
                    </li>
                    <li>
                      <strong style={{ color: '#28a745' }}>즉시 시전 활용:</strong> {renderTextWithSkillIcons('깨어나는 폭풍 3중첩 → 전격 방전 즉시 시전 가능')}
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>우선순위:</strong> {renderTextWithSkillIcons('3중첩 도달 즉시 전격 방전 사용 → 중첩 낭비 방지')}
                    </li>
                    <li>
                      <strong style={{ color: '#dc3545' }}>주의사항:</strong> {renderTextWithSkillIcons('전격 방전 시전 시 모든 중첩 소모 → 다시 쌓아야 함')}
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ {renderTextWithSkillIcons('전격 방전')} 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>기본 시전:</strong> {renderTextWithSkillIcons('전격 방전 2초 시전 → 대상 및 주변 적 피해')}
                    </li>
                    <li>
                      <strong style={{ color: '#28a745' }}>즉시 시전:</strong> {renderTextWithSkillIcons('깨어나는 폭풍 3중첩 시 전격 방전 즉시 시전 → 이동 중 사용 가능')}
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>광역 활용:</strong> {renderTextWithSkillIcons('3+ 적 광역 구간에서 전격 방전 우선 → 지진과 병행')}
                    </li>
                    <li>
                      <strong style={{ color: '#28a745' }}>버스트 타이밍:</strong> {renderTextWithSkillIcons('폭풍지기 + 폭풍의 정령과 함께 사용 → 최대 피해')}
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ M+ 이동 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>영혼 이동 활용:</strong> {renderTextWithSkillIcons('영혼 이동으로 장판 회피 + 시전 중에도 사용 가능')}
                    </li>
                    <li>
                      <strong style={{ color: '#28a745' }}>즉시 시전 스킬:</strong> {renderTextWithSkillIcons('깨어나는 폭풍 3중첩 → 이동 중 전격 방전 시전')}
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>화염 충격 유지:</strong> {renderTextWithSkillIcons('이동 중 화염 충격 갱신 → 딜 손실 최소화')}
                    </li>
                    <li>
                      <strong style={{ color: '#dc3545' }}>주의사항:</strong> {renderTextWithSkillIcons('지진 시전 중 이동 시 시전 중단 → 폭풍으로 대체 가능')}
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 소용돌이 오버캡 방지
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>리소스 한계:</strong> {renderTextWithSkillIcons('소용돌이 최대 100 (폭풍 변환 시 300까지 누적 가능)')}
                    </li>
                    <li>
                      <strong style={{ color: '#dc3545' }}>오버캡 방지:</strong> {renderTextWithSkillIcons('소용돌이 80+ 도달 시 대지 충격 사용 → 리소스 낭비 방지')}
                    </li>
                    <li>
                      <strong style={{ color: '#28a745' }}>폭풍 준비:</strong> {renderTextWithSkillIcons('소용돌이 250+ 시 곧바로 폭풍 사용 준비')}
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>광역 우선순위:</strong> {renderTextWithSkillIcons('3+ 적 광역 구간 → 소용돌이 300 도달 즉시 폭풍 사용')}
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>공통 생존 메커니즘</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>
                  {renderTextWithSkillIcons('늑대 정령')} - 이동 속도 30% 증가, 이동 중에도 사용 가능
                </li>
                <li>
                  {renderTextWithSkillIcons('영혼 이동')} - 12초 동안 받는 피해 40% 감소 (2분 쿨다운)
                </li>
                <li>
                  {renderTextWithSkillIcons('대지의 정령')} - 즉시 체력 20% 회복 + 5초간 받는 피해 40% 감소 (2분 쿨다운)
                </li>
                <li>
                  <strong style={{ color: '#ffa500' }}>파티 유틸:</strong> {renderTextWithSkillIcons('영웅심')} / {renderTextWithSkillIcons('피의 욕망')} - 공격대 쿨기, 지상 토템 (5분 쿨다운)
                </li>
                <li>
                  {renderTextWithSkillIcons('진정의 토템')} - 30미터 내 공포/매혹/수면 제거 (1분 쿨다운)
                </li>
              </ul>
            </div>

            {/* 실전 팁 */}
            <div style={{ marginTop: '30px' }}>
              <h4 style={{
                color: selectedTier === 'farseer' ? '#9482C9' : '#32CD32',
                fontSize: '1.2rem',
                marginBottom: '20px',
                borderBottom: '2px solid rgba(170, 211, 114, 0.3)',
                paddingBottom: '10px'
              }}>
                💡 실전 팁 & 주의사항
              </h4>

              {/* 흔한 실수 */}
              <div style={{
                background: 'rgba(220, 53, 69, 0.15)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid rgba(220, 53, 69, 0.3)'
              }}>
                <h5 style={{ color: '#dc3545', fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ❌ 흔한 실수
                </h5>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: '#ccc' }}>
                  • <strong style={{ color: '#ff6b6b' }}>소용돌이 오버캡:</strong> {renderTextWithSkillIcons('소용돌이 100 도달로 추가 생성 불가 → 리소스 낭비')}<br/>
                  • <strong style={{ color: '#ff6b6b' }}>화염 충격 누락:</strong> {renderTextWithSkillIcons('화염 충격 없이 용암 폭발 시전 불가 → 딜 손실')}<br/>
                  {selectedTier === 'farseer' && (
                    <>
                      • <strong style={{ color: '#ff6b6b' }}>원소의 대가 낭비:</strong> {renderTextWithSkillIcons('원소의 대가 버프 시 대지 충격 미사용 → 20% 피해 손실')}<br/>
                      • <strong style={{ color: '#ff6b6b' }}>승천 낭비:</strong> {renderTextWithSkillIcons('승천 윈도우에서 용암 폭발 미사용 → 버스트 손실')}<br/>
                    </>
                  )}
                  {selectedTier === 'stormbringer' && (
                    <>
                      • <strong style={{ color: '#ff6b6b' }}>폭풍 변환 낭비:</strong> {renderTextWithSkillIcons('소용돌이 300+ 후 즉시 폭풍 미사용 → 피해 손실')}<br/>
                      • <strong style={{ color: '#ff6b6b' }}>전격 방전 지연:</strong> {renderTextWithSkillIcons('깨어나는 폭풍 3중첩 후 즉시 사용 누락')}<br/>
                    </>
                  )}
                  • <strong style={{ color: '#ff6b6b' }}>광역 지진 누락:</strong> {renderTextWithSkillIcons('3+ 적 광역 구간에서 지진 미사용 → 광역 피해 손실')}
                </p>
              </div>

              {/* 고급 팁 */}
              <div style={{
                background: 'rgba(40, 167, 69, 0.15)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid rgba(40, 167, 69, 0.3)'
              }}>
                <h5 style={{ color: '#28a745', fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✅ 고급 팁
                </h5>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: '#ccc' }}>
                  • <strong style={{ color: '#28a745' }}>주문 대기열 활용:</strong> 전역 쿨다운 종료 0.25초 전 다음 스킬 입력 → 즉시 발동<br/>
                  • <strong style={{ color: '#28a745' }}>소용돌이 관리:</strong> {renderTextWithSkillIcons('원소의 대가 버프 + 소용돌이 60+ 시 대지 충격 우선 사용')}<br/>
                  {selectedTier === 'farseer' && (
                    <>
                      • <strong style={{ color: '#28a745' }}>버스트 타이밍:</strong> {renderTextWithSkillIcons('폭풍의 정령 + 폭풍지기 + 승천 동시 활용 → 최대 초당 피해량')}<br/>
                      • <strong style={{ color: '#28a745' }}>승천 최대화:</strong> {renderTextWithSkillIcons('승천 윈도우 15초 동안 용암 폭발 최대한 시전 → 원소의 대가 지속 유지')}<br/>
                    </>
                  )}
                  {selectedTier === 'stormbringer' && (
                    <>
                      • <strong style={{ color: '#28a745' }}>폭풍 활용:</strong> {renderTextWithSkillIcons('깨어나는 폭풍 3중첩 즉시 전격 방전 사용 → 즉시 시전 활용')}<br/>
                      • <strong style={{ color: '#28a745' }}>이동 최적화:</strong> {renderTextWithSkillIcons('영혼 이동으로 장판 회피 + 시전 중에도 사용 가능')}<br/>
                    </>
                  )}
                  • <strong style={{ color: '#28a745' }}>화염 충격 유지:</strong> {renderTextWithSkillIcons('화염 충격 도트를 항상 유지 → 용암 폭발 시전 가능')}<br/>
                  • <strong style={{ color: '#28a745' }}>위크오라 설정:</strong> {renderTextWithSkillIcons('원소의 대가')} 버프, 소용돌이 값, {selectedTier === 'farseer' ? renderTextWithSkillIcons('승천') : renderTextWithSkillIcons('깨어나는 폭풍')} 중첩 추적 필수
                </p>
              </div>
            </div>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 데이터 - 정기 주술사 TWW 시즌3
  const talentBuilds = {
    farseer: {  // 선견자 (Farseer)
      'raid-single': {
        name: '레이드 단일 대상',
        description: '선견자를 활용한 단일 대상 빌드입니다. 원소의 대가와 용암 쇄도를 극대화하여 보스전에 특화되어 있습니다.',
        code: 'EleShaman_Farseer_Raid_ST_TWW_S3',  // ⚠️ TODO: Wowhead 실제 빌드 코드로 교체
        icon: '🔮'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '선견자를 활용한 광역 빌드입니다. 승천 + 화염 충격 확산으로 광역 딜 극대화.',
        code: 'EleShaman_Farseer_Raid_AoE_TWW_S3',  // ⚠️ TODO: Wowhead 실제 빌드 코드로 교체
        icon: '🔮'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '선견자를 활용한 쐐기돌 빌드입니다. 지진와 연쇄 번개로 쐐기돌에 최적화되어 있습니다.',
        code: 'EleShaman_Farseer_M+_TWW_S3',  // ⚠️ TODO: Wowhead 실제 빌드 코드로 교체
        icon: '🔮'
      }
    },
    stormbringer: {  // 폭풍인도자 (Stormbringer)
      'raid-single': {
        name: '레이드 단일 대상',
        description: '폭풍인도자를 활용한 단일 대상 빌드입니다. 폭풍 + 전격 방전 사이클로 안정적인 단일 딜을 제공합니다.',
        code: 'EleShaman_Stormbringer_Raid_ST_TWW_S3',  // ⚠️ TODO: Wowhead 실제 빌드 코드로 교체
        icon: '⚡'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '폭풍인도자를 활용한 광역 빌드입니다. 전격 방전 광역 폭발로 강력한 광역 딜을 제공합니다.',
        code: 'EleShaman_Stormbringer_Raid_AoE_TWW_S3',  // ⚠️ TODO: Wowhead 실제 빌드 코드로 교체
        icon: '⚡'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '폭풍인도자를 활용한 쐐기돌 빌드입니다. 깨어나는 폭풍 + 전격 방전으로 쐐기돌에 최적화되어 있습니다.',
        code: 'EleShaman_Stormbringer_M+_TWW_S3',  // ⚠️ TODO: Wowhead 실제 빌드 코드로 교체
        icon: '⚡'
      }
    }
  };

  const handleCopyBuild = (code) => {
    navigator.clipboard.writeText(code);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 3000);
  };

  const renderBuilds = () => (
    <Section ref={sectionRefs.builds} id="builds">
      <SectionHeader>
        <SectionTitle>특성 빌드 추천</SectionTitle>
      </SectionHeader>

      {/* Toast Notification */}
      {showCopyToast && (
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
          {/* ⚠️ TODO: setSelectedTier 값을 실제 영웅특성명으로 변경 */}
          <button
            onClick={() => {
              setSelectedTier('farseer');
              setSelectedBuild('mythic-plus');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'farseer' ?
                'linear-gradient(135deg, #5a3896 0%, #2a1846 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'farseer' ? '#9482C9' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'farseer' ? '#9482C9' : '#94a3b8',
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
            <span style={{ fontSize: '1.5rem' }}>🔮</span>
            <span>선견자</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>레이드 추천</span>
          </button>

          <button
            onClick={() => {
              setSelectedTier('stormbringer');
              setSelectedBuild('raid-single');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'stormbringer' ?
                'linear-gradient(135deg, #2a7a46 0%, #1a3a26 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'stormbringer' ? '#32CD32' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'stormbringer' ? '#32CD32' : '#94a3b8',
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
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span>폭풍인도자</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>쐐기 추천</span>
          </button>
        </div>

        {/* 빌드 선택 버튼들 */}
        <div style={{ padding: '20px' }}>
          {/* ⚠️ TODO: selectedTier 조건을 실제 영웅특성명으로 변경 */}
          <h4 style={{
            color: selectedTier === 'farseer' ? '#9482C9' : '#32CD32',
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            {selectedTier === 'farseer' ? '선견자' : '폭풍인도자'} 특성 빌드
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
          description: '시전 속도 증가 & 쿨다운 감소'
        },
        crit: {
          name: '치명타',
          color: '#ff6b6b',
          icon: '⚡',
          description: '치명타 확률 증가'
        },
        mastery: {
          name: '특화',
          color: '#ffe66d',
          icon: '📈',
          description: '스킬이 입히는 피해 증가'
        },
        versatility: {
          name: '유연',
          color: '#95e77e',
          icon: '🔄',
          description: '피해 & 피해 감소'
        }
      };

      // 영웅 특성과 콘텐츠 타입별 브레이크포인트
      const breakpointData = {
        farseer: {  // 선견자 (Farseer)
          single: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#0070DE', priority: 'high' }
              ],
              note: 'GCD 감소와 용암 폭발 시전 속도 향상, 원소의 대가 유지 용이'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '용암 폭발 치명타 확률 증가, 용암 쇄도 프록 활용'
            },
            mastery: {
              breakpoints: [],
              note: '용암 폭발 피해 증가, 선견자 특성과 시너지'
            },
            versatility: {
              breakpoints: [],
              note: '안정적인 피해 증가 및 생존력 향상'
            }
          },
          aoe: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#0070DE', priority: 'high' }
              ],
              note: '빠른 연쇄 번개 시전과 소용돌이 생성 증가'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '연쇄 번개와 지진 치명타로 광역 딜 증가'
            },
            mastery: {
              breakpoints: [],
              note: '모든 원소 피해 증가로 광역에서도 높은 가치'
            },
            versatility: {
              breakpoints: [],
              note: '안정적인 피해 증가 옵션'
            }
          }
        },
        stormbringer: {  // 폭풍인도자 (Stormbringer)
          single: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#0070DE', priority: 'high' }
              ],
              note: '번개 화살 빈도 증가와 깨어나는 폭풍 중첩 빠른 획득'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '전격 방전 치명타 확률 증가, 안정적인 평균 딜 향상'
            },
            mastery: {
              breakpoints: [],
              note: '연쇄 번개 피해 증가, 폭풍인도자 특성과 시너지'
            },
            versatility: {
              breakpoints: [],
              note: '안정적인 피해 증가 및 생존력 향상'
            }
          },
          aoe: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#0070DE', priority: 'high' }
              ],
              note: '최우선 스탯, 전격 방전 빈도와 광역 딜 극대화'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '광역 전격 방전 치명타로 폭발 딜 증가'
            },
            mastery: {
              breakpoints: [],
              note: '전격 방전과 폭풍 피해 증가'
            },
            versatility: {
              breakpoints: [],
              note: '안정적인 피해 증가 옵션'
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

    // 스탯 우선순위 - 정기 주술사 TWW 시즌3
    const statPriorities = {
      farseer: {  // 선견자 (Farseer)
        single: ['haste', 'mastery', 'crit', 'versatility'],  // 단일: 가속 > 특화 > 치명타 > 유연
        aoe: ['haste', 'crit', 'mastery', 'versatility']  // 광역: 가속 > 치명타 > 특화 > 유연 (연쇄 번개)
      },
      stormbringer: {  // 폭풍인도자 (Stormbringer)
        single: ['haste', 'mastery', 'crit', 'versatility'],  // 단일: 가속 > 특화 > 치명타 > 유연 (전격 방전 중첩)
        aoe: ['haste', 'crit', 'mastery', 'versatility']  // 광역: 가속 > 치명타 > 특화 > 유연 (폭풍 + 전격 방전)
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
              onClick={() => setSelectedStatHero('farseer')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'farseer' ?
                  'linear-gradient(135deg, #0070DE 0%, #005ba0 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'farseer' ? '#0070DE' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'farseer' ? '#0070DE' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🔮 선견자
            </button>
            <button
              onClick={() => setSelectedStatHero('stormbringer')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'stormbringer' ?
                  'linear-gradient(135deg, #0070DE 0%, #005ba0 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'stormbringer' ? '#0070DE' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'stormbringer' ? '#0070DE' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ⚡ 폭풍인도자
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
              color: selectedStatHero === 'farseer' ? '#0070DE' : '#0070DE',
              fontSize: '1.3rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{selectedStatHero === 'farseer' ? '🔥' : '✨'}</span>
              <span>{selectedStatHero === 'farseer' ? '성난태양' : '주문술사'}</span>
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
                  ((selectedStatHero === 'farseer' && selectedStatMode === 'single' && index === 2) ||
                   (selectedStatHero === 'stormbringer' && index === 4));

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

            {/* Raidbots 링크 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, transparent 100%)',
              border: '1px solid #AAD372',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              marginTop: '30px'
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
                background: 'linear-gradient(135deg, #0070DE 0%, #2a9cc4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                textShadow: '0 0 30px rgba(0, 112, 222, 0.3)'
              }}>
                정기 주술사 가이드
              </h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                최종 수정일: 2025.10.03 | 작성: WoWMeta
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

export default ElementalShamanGuide;