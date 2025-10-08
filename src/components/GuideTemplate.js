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
 * - 한국어 조사 괄호 표기 시스템 (이(가), 을(를), 은(는), 과(와), 으로(로))
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
 *    - primary/accent: #3FC6EA → 실제 클래스 색상
 *    - hover: rgba(63, 198, 234, 0.1) → 실제 색상 rgba
 *
 * 3. getHeroContent 함수 수정 (검색: "getHeroContent")
 *    - 키 이름: 'sunfury'/'spellslinger' → 실제 영웅특성 영문명
 *    - name/icon/tierSet/opener/priority 모두 교체
 *
 * 4. 영웅특성 선택 버튼 수정 (검색: "setSelectedTier")
 *    - setSelectedTier('sunfury') → 실제 영웅특성명
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
 * - Mage: #3FC6EA (63, 198, 234)
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

// ⚠️ TODO: 스킬 데이터 import 변경 (Step 1)
// - arcaneMageSkills → 실제 전문화 스킬 변수명 (예: fireMageSkills, frostMageSkills)
// - '../data/arcaneMageSkillData' → 실제 스킬 데이터 파일 경로
import { arcaneMageSkills as skillData} from '../data/arcaneMageSkillData';
import styles from './DevastationEvokerGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus';
import aiFeedbackService from '../services/AIFeedbackService';
import externalGuideCollector from '../services/ExternalGuideCollector';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// ⚠️ TODO: 클래스 색상 테마 변경 (Step 2)
// 아래 색상을 실제 클래스 색상으로 교체하세요
// 참고: 파일 상단 주석의 "🎨 클래스 색상 코드표" 참조
const unifiedTheme = {
  colors: {
    primary: '#3FC6EA',      // ⚠️ TODO: 마법사 색상 → 실제 클래스 색상으로 변경
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#3FC6EA',       // ⚠️ TODO: primary와 동일하게 변경
    border: '#2a2a3e',
    hover: 'rgba(63, 198, 234, 0.1)',  // ⚠️ TODO: primary의 RGB 값으로 변경 (예: rgba(199, 156, 110, 0.1) for Warrior)
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
    if (props.heroType === 'sunfury') {
      return 'linear-gradient(135deg, rgba(63, 198, 234, 0.05), rgba(255, 107, 107, 0.05))';
    } else if (props.heroType === 'spellslinger') {
      return 'linear-gradient(135deg, rgba(78, 205, 196, 0.05), rgba(93, 173, 226, 0.05))';
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'sunfury') {
      return 'rgba(63, 198, 234, 0.3)';
    } else if (props.heroType === 'spellslinger') {
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
      if (props.heroType === 'sunfury') {
        return 'linear-gradient(90deg, #3FC6EA, #FF6B6B)';
      } else if (props.heroType === 'spellslinger') {
        return 'linear-gradient(90deg, #4ECDC4, #5DADE2)';
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
// - 키 이름: 'sunfury', 'spellslinger' → 실제 영웅특성 영문명 (예: 'frostfire', 'farseer')
// - name, icon, tierSet, opener, priority 모두 교체
// - 영웅특성별로 단일/광역 우선순위가 다르므로 각각 작성
const getHeroContent = (SkillIcon) => ({
  sunfury: {  // ⚠️ TODO: 실제 영웅특성 영문명으로 변경 (예: frostfire, farseer)
    name: '성난태양',  // ⚠️ TODO: 실제 영웅특성 한글명
    icon: '🔥',        // ⚠️ TODO: 실제 영웅특성 아이콘
    tierSet: {
      '2set': '주문화염 구체의 주문 피해 증가 효과가 1.0% 증가합니다. 마나 연쇄가 중첩당 추가로 0.5%의 가속을 부여합니다.',
      '4set': '불사조가 시전하는 특급 주문이 다음 비전의 영혼 지속시간을 0.5초 추가합니다. 불사조가 만료되면 소형 시간 왜곡과 주문 피해 20% 증가를 10초간 부여합니다.'
    },
    singleTarget: {
      opener: [
        skillData.mirrorimage,       // 전투 4초 전: 환영 복제 (DPS 증가 + 생존력)
        skillData.evocation,         // 전투 3초 전: 환기 (완전 충전)
        skillData.arcanemissiles,    // Pull 시작: 신비한 화살
        skillData.timewarp,          // Time Warp (팀 공속 버프)
        skillData.arcanesurge,       // Arcane Surge (주요 버스트 쿨다운)
        skillData.touchofthemagi,    // Touch of the Magi (탄막 비행 중)
        skillData.arcaneorb,         // 비전 보주 (충전물 생성)
        skillData.arcaneblast,       // 비전 작렬
        skillData.arcaneblast,       // 비전 작렬
        skillData.arcaneblast,       // 비전 작렬 (4충전)
        skillData.arcanebarrage,     // 비전 탄막 (4충전 소모)
        skillData.arcaneblast        // 사이클 계속
      ],
      priority: [
        {
          skill: skillData.arcanemissiles,
          desc: '번뜩임 3중첩 신비한 화살 (최우선)',
          conditions: [
            '번뜩임 3중첩',
            '즉시 사용 필수'
          ],
          priority: 0,
          why: '번뜩임 3중첩 시 피해량 극대화 - 절대 놓치지 말 것'
        },
        {
          skill: skillData.arcanebarrage,
          desc: '버프 만료 직전 비전 탄막',
          conditions: [
            '직관 또는 비전의 박자 만료 직전',
            '다음 시전 전 만료 예정'
          ],
          priority: 1,
          why: '강력한 버프를 낭비하지 않기 위해'
        },
        {
          skill: skillData.arcanemissiles,
          desc: '비전의 영혼 신비한 화살 (최적화)',
          conditions: [
            '비전의 영혼 활성',
            '황천의 정밀함 버프 있음',
            '번뜩임 활성'
          ],
          priority: 2,
          why: '비전의 영혼 윈도우 동안 황천의 정밀함 + 신비한 화살로(으로) 주문불꽃 구체 생성 극대화'
        },
        {
          skill: skillData.shiftingpower,
          desc: '힘의 전환 (비전의 영혼 종료 후)',
          conditions: [
            '비전의 영혼 종료됨',
            '비전의 여파 쿨다운 중'
          ],
          priority: 3,
          why: '비전의 영혼 종료 직후 힘의 전환으로 비전의 여파 쿨다운 감소'
        },
        {
          skill: skillData.arcanemissiles,
          desc: '번뜩임 신비한 화살',
          conditions: [
            '번뜩임 버프 활성',
            '황천의 정밀함 없음'
          ],
          priority: 4,
          why: '번뜩임 버프를 효율적으로 소모'
        },
        {
          skill: skillData.arcaneorb,
          desc: '비전 보주 (충전물 생성)',
          conditions: [
            '비전 충전물 3 미만',
            '충전물 빠른 생성 필요'
          ],
          priority: 5,
          why: '4충전물 목표 달성을 위한 빠른 생성'
        },
        {
          skill: skillData.leydrinker,
          desc: '지맥 흡수자 버프 비전 작렬',
          conditions: [
            '지맥 흡수자 버프 활성',
            '번뜩임 소모로 발동'
          ],
          priority: 6,
          why: '지맥 흡수자 버프로 비전 작렬이(가) 메아리쳐 70% 피해 복제 - 단일/광역 모두 강력'
        },
        {
          skill: skillData.arcanebarrage,
          desc: '비전 탄막 (버프 활용)',
          conditions: [
            '직관 또는 영광스러운 백열 버프 활성',
            '비전의 여파 6초 이내면 홀드'
          ],
          priority: 7,
          why: '강력한 버프와 함께 소모 (단, 비전의 여파 직전이면 대기)'
        },
        {
          skill: skillData.arcaneexplosion,
          desc: '비전 폭발 (충전물 생성)',
          conditions: [
            '비전 충전물 0-1개',
            '빠른 충전물 생성 필요'
          ],
          priority: 8,
          why: '단일 대상에서도 0-1 충전물 시 비전 폭발로 빠른 충전물 생성'
        },
        {
          skill: skillData.arcaneblast,
          desc: '비전 작렬 (기본 스킬)',
          conditions: [
            '재사용 대기시간 없음',
            '충전물 생성'
          ],
          priority: 9,
          why: '비전 충전물을(를) 쌓고 번뜩임 발동 기회 생성'
        },
        {
          skill: skillData.arcanebarrage,
          desc: '비전 탄막 (충전물 소모)',
          conditions: [
            '비전 쇄도 대기 중'
          ],
          priority: 10,
          why: '충전물 소모로 비전 쇄도 대기'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.mirrorimage,       // 전투 4초 전: 환영 복제 (DPS 증가 + 생존력)
        skillData.evocation,         // 전투 3초 전: 환기 (완전 충전)
        skillData.arcaneorb,         // Pull 시작: 비전 보주
        skillData.timewarp,          // Time Warp (팀 공속 버프)
        skillData.arcanesurge,       // Arcane Surge (주요 버스트 쿨다운)
        skillData.touchofthemagi,    // Touch of the Magi (탄막 비행 중)
        skillData.arcaneexplosion,   // 광역 피해
        skillData.arcaneorb,         // 비전 보주
        skillData.arcaneexplosion,   // 광역 피해
        skillData.arcaneblast,       // 충전 쌓기
        skillData.arcanebarrage,     // 비전 탄막 (광역)
        skillData.arcaneexplosion    // 광역 계속
      ],
      priority: [
        {
          skill: skillData.arcanemissiles,
          desc: '번뜩임 3중첩 신비한 화살',
          conditions: [
            '번뜩임 3중첩',
            '3+ 적 상황에서도 최우선'
          ],
          priority: 0,
          why: '번뜩임 3중첩은 광역 상황에서도 절대 우선순위'
        },
        {
          skill: skillData.arcanebarrage,
          desc: '버프 만료 직전 비전 탄막',
          conditions: [
            '직관/비전의 박자 만료 직전',
            '비전 충전물 4개'
          ],
          priority: 1,
          why: '강력한 버프를 낭비하지 않기 위해'
        },
        {
          skill: skillData.arcaneorb,
          desc: '비전 보주 (광역 충전 생성)',
          conditions: [
            '비전 충전물 3 미만',
            '재사용 대기시간 완료'
          ],
          priority: 2,
          why: '광역 상황에서 빠른 충전물 생성'
        },
        {
          skill: skillData.arcaneexplosion,
          desc: '신비한 폭발 (광역 주력)',
          conditions: [
            '비전 충전물 0-1개',
            '3+ 적'
          ],
          priority: 3,
          why: '저충전 상태에서 광역 피해 극대화'
        },
        {
          skill: skillData.arcanebarrage,
          desc: '비전 탄막 (4충전 광역)',
          conditions: [
            '비전 충전물 4개',
            '비전 보주 사용 가능',
            '3+ 적'
          ],
          priority: 4,
          why: '4충전 탄막으로(로) 광역 피해 + 보주 재사용 준비'
        },
        {
          skill: skillData.arcaneblast,
          desc: '비전 작렬 (충전 쌓기)',
          conditions: [
            '비전 충전물 3 미만',
            '비전 보주 재사용 대기 중'
          ],
          priority: 5,
          why: '4충전 목표 달성을 위한 충전물 생성'
        },
        {
          skill: skillData.arcaneexplosion,
          desc: '신비한 폭발 (필러)',
          conditions: [
            '다른 스킬 재사용 대기 중',
            '3+ 적'
          ],
          priority: 6,
          why: '광역 상황에서 기본 피해 유지'
        }
      ]
    },
    mechanics: [
      {
        title: '비전의 여파 폭발 타이밍',
        icon: '💥',
        desc: '비전의 여파 활성 시 피해가 누적되어 폭발하는 메커니즘',
        details: [
          '비전의 여파: 12초 동안 입힌 피해의 15% 누적 → 폭발',
          '예시: 10초 동안 100만 피해 → 15만 비전 피해 폭발',
          '최적 타이밍: 비전의 여파 10초 남았을 때 4중첩 비전 작렬 집중'
        ],
        why: '폭발 피해를 최대화하여 버스트 DPS 극대화'
      },
      {
        title: 'Spell Queue Window',
        icon: '⏱️',
        desc: '스킬을 미리 입력할 수 있는 0.25초 시스템',
        details: [
          'GCD(1.5초) 종료 0.25초 전부터 다음 스킬 입력 가능',
          '즉시 시전: GCD 종료와 동시에 발동 (딜레이 0초)',
          '비전 마법사 핵심: 비전 작렬 4중첩 → 비전 탄막 빠른 연계 (비전 충전물 소모)'
        ],
        why: 'APM 향상 및 비전 충전물 관리 효율 극대화'
      },
      {
        title: '비전 충전물 관리',
        icon: '🔮',
        desc: '비전 충전물 4중첩 유지 및 최적 탄막 타이밍',
        details: [
          '비전 작렬 시전마다 충전물 1개 생성 (최대 4중첩)',
          '충전물당 효과: 피해 +60%, 마나 소모 +100%, 시전 시간 -8%',
          '4중첩 달성 후 비전 탄막으로(로) 모든 충전물 소모 + 폭발 딜',
          '티어 2세트: 비전 탄막 사용 시 비전의 여파 발동 확률 증가'
        ],
        why: '비전 충전물 4중첩 → 비전 탄막이(가) 비전 마법사 핵심 딜사이클'
      },
      {
        title: '번뜩임 버프 활용',
        icon: '✨',
        desc: '환기 또는 비전 충전물 소모 시 번뜩임 부여 (15초)',
        details: [
          '1단계: 환기 사용 시 번뜩임 자동 부여 + 마나 회복',
          '2단계: 번뜩임 활성화 중 신비한 화살 즉시 시전 (5발)',
          '3단계: 신비한 화살로(으로) 높은 순간 딜 + 마나 효율 극대화',
          '핵심: 번뜩임 15초 지속 → 시간 내 모든 신비한 화살 사용 필수'
        ],
        why: '번뜩임 최적 활용이 비전 마법사 DPS의 20-30% 차지'
      },
      {
        title: '마나 관리 전략',
        icon: '💧',
        desc: '마나 30% 이하 시 환기 사용, 70% 이상 유지 목표',
        details: [
          '비전 작렬 4중첩 시 마나 소모량 5배 증가 주의',
          '환기 (90초 쿨): 3초간 마나 회복 1500% + 번뜩임 부여',
          '환기 중 지능 버프: 0.5초마다 2% 증가 (최대 12%, 20초 지속)',
          '마나 30% 이하 도달 시 환기 즉시 사용 권장'
        ],
        why: '마나 부족 시 딜 급락 → 환기 타이밍이 DPS 핵심'
      }
    ]
  },
  spellslinger: {
    name: '주문술사',
    icon: '✨',
    tierSet: {
      '2set': '비전 작렬과(와) 비전 탄막의 피해가 증가합니다.',
      '4set': '비전 조화 효과가 강화됩니다. 신비한 화살이(가) 적중할 때마다 피해 증가 중첩이(가) 쌓이며, 최대 20중첩까지 가능합니다 (중첩당 5% 피해 증가).'
    },
    singleTarget: {
      opener: [
        skillData.mirrorimage,       // 전투 4초 전: 환영 복제 (DPS 증가 + 생존력)
        skillData.evocation,         // 전투 3초 전: 환기 (완전 충전)
        skillData.arcanemissiles,    // Pull 시작: 신비한 화살
        skillData.arcaneorb,         // Arcane Orb (High Voltage proc 있을 경우)
        skillData.timewarp,          // Time Warp (팀 공속 버프)
        skillData.arcanesurge,       // Arcane Surge (주요 버스트 쿨다운)
        skillData.touchofthemagi,    // Touch of the Magi (탄막 비행 중)
        skillData.arcanebarrage,     // Arcane Barrage (4충전 - Intuition 트리거)
        skillData.arcanemissiles,    // Arcane Missiles (Clearcasting)
        skillData.arcaneblast,       // Arcane Blast (충전물 쌓기)
        skillData.arcaneblast,       // Arcane Blast
        skillData.arcaneblast,       // Arcane Blast
        skillData.arcaneblast        // Arcane Blast (4충전)
      ],
      priority: [
        {
          skill: skillData.arcanebarrage,
          desc: '비전 탄막 (4충전 - 직관 트리거)',
          conditions: [
            '비전 충전물 4개',
            '다음 조건 중 하나:',
            '  - 직관 발동',
            '  - 비전의 박자 만료 직전 (1-2초 남음)',
            '  - 비전의 여파 쿨다운 직전 (5초 이내)',
            '  - 마나 20% 이하'
          ],
          priority: 0,
          why: '주문술사 핵심 - 4충전 탄막으로(로) 직관 (40% 확률) 및 비전의 박자 버프 발동/유지'
        },
        {
          skill: skillData.shiftingpower,
          desc: '힘의 전환 (전략적)',
          conditions: [
            '비전의 여파 쿨다운 중',
            '마나 충분 (50% 이상)',
            '직관 없음'
          ],
          priority: 1,
          why: '쿨다운 감소 - 비전의 여파 및 비전 쇄도 쿨다운을 6-12초 단축'
        },
        {
          skill: skillData.arcanemissiles,
          desc: '번뜩임 신비한 화살',
          conditions: [
            '번뜩임 활성',
            '황천의 정밀함 없음'
          ],
          priority: 2,
          why: '번뜩임 버프 소모 - 황천의 정밀함이 없을 때만 (있으면 비전 작렬에 사용)'
        },
        {
          skill: skillData.arcaneblast,
          desc: '비전 작렬 (4충전 유지)',
          conditions: [
            '비전 충전물 4 미만',
            '재사용 대기시간 없음'
          ],
          priority: 3,
          why: '4충전물 목표 달성 - 항상 4충전 유지가 Spellslinger 기본'
        },
        {
          skill: skillData.arcaneblast,
          desc: '비전 작렬 (기본 스킬)',
          conditions: [
            '비전 충전물 4개',
            '재사용 대기시간 없음',
            '비전 탄막 조건 미충족'
          ],
          priority: 4,
          why: '4충전 유지하며 번뜩임 및 버프 발동 대기'
        },
        {
          skill: skillData.arcanebarrage,
          desc: '비전 탄막 (마나 부족 시)',
          conditions: [
            '마나 10% 이하',
            '비전 충전물 4개'
          ],
          priority: 5,
          why: '마나 부족 시 강제 탄막 - 환기 쿨다운 대기 또는 마나 회복 포션 사용 필요'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.mirrorimage,       // 전투 4초 전: 환영 복제 (DPS 증가 + 생존력)
        skillData.evocation,         // 전투 3초 전: 환기 (완전 충전)
        skillData.arcaneexplosion,   // Pull 시작: 광역 피해
        skillData.arcaneorb,         // Arcane Orb (High Voltage proc 있을 경우)
        skillData.timewarp,          // Time Warp (팀 공속 버프)
        skillData.arcanesurge,       // Arcane Surge (주요 버스트 쿨다운)
        skillData.touchofthemagi,    // Touch of the Magi
        skillData.arcaneexplosion,   // 광역 피해
        skillData.arcaneexplosion,   // 광역 피해
        skillData.arcaneblast,       // 충전 쌓기
        skillData.arcaneblast,       // 충전 쌓기
        skillData.arcanebarrage,     // 비전 탄막 (Intuition 트리거)
        skillData.arcaneexplosion    // 광역 계속
      ],
      priority: [
        {
          skill: skillData.arcanebarrage,
          desc: '비전 탄막 (4충전 - 직관 트리거)',
          conditions: [
            '비전 충전물 4개',
            '2+ 적',
            '다음 조건 중 하나:',
            '  - 직관 발동',
            '  - 비전의 박자 만료 직전',
            '  - 비전의 여파 쿨다운 직전',
            '  - 마나 20% 이하'
          ],
          priority: 0,
          why: 'AoE에서도 직관 발동이 핵심 - 4충전 탄막으로(로) 광역 폭발 피해'
        },
        {
          skill: skillData.arcanemissiles,
          desc: '번뜩임 신비한 화살 (AoE)',
          conditions: [
            '번뜩임 활성',
            '황천의 정밀함 없음',
            '2+ 적'
          ],
          priority: 1,
          why: 'AoE에서도 번뜩임 우선 - 황천의 정밀함이 없을 때만'
        },
        {
          skill: skillData.arcaneexplosion,
          desc: '비전 폭발 (광역 필러)',
          conditions: [
            '번뜩임 없음',
            '2+ 적'
          ],
          priority: 2,
          why: '번뜩임이(가) 없을 때 광역 피해 지속 - 단일 대상보다 효율적'
        },
        {
          skill: skillData.arcaneblast,
          desc: '비전 작렬 (4충전 유지)',
          conditions: [
            '비전 충전물 4 미만',
            '2+ 적'
          ],
          priority: 3,
          why: 'AoE에서도 4충전 유지 - Barrage 준비'
        },
        {
          skill: skillData.arcanebarrage,
          desc: '비전 탄막 (마나 부족)',
          conditions: [
            '마나 10% 이하',
            '비전 충전물 4개',
            '2+ 적'
          ],
          priority: 4,
          why: '마나 부족 시 강제 탄막 - 환기 대기'
        }
      ]
    },
    mechanics: [
      {
        title: '비전 충전물 시스템',
        icon: '🔮',
        desc: '0-4 충전물 시스템 - 피해량과 마나 소모의 핵심',
        details: [
          '비전 작렬/비전 보주: 충전물 1개 생성',
          '충전물당 효과: 피해량 +60%, 마나 소모 +100%, 시전 시간 -8%',
          '4충전 비전 작렬: 기본 대비 240% 피해 + 400% 마나 소모',
          '비전 탄막: 모든 충전물 소모 → 충전물당 피해 +90%',
          '최적 운용: 4충전 유지 → 비전 탄막으로(로) 폭발적 피해'
        ],
        why: '비전 마법사의 핵심 - 충전물 관리가 DPS 결정'
      },
      {
        title: '번뜩임 프록',
        icon: '✨',
        desc: '신비한 화살 무료 시전 버프 - 3중첩 우선순위',
        details: [
          '비전 작렬 시전 시 확률적으로 발동',
          '3중첩 번뜩임: 최우선 순위로 신비한 화살 시전 필수',
          '신비한 화살: 2.5초에 걸쳐 5발 발사 (마나 소모 0)',
          '성난태양: 번뜩임 중첩 관리로 주문화염 구체 극대화',
          '시전 중 이동 가능 - 기동성 극대화 활용'
        ],
        why: '번뜩임 3중첩 놓치면 막대한 DPS 손실'
      },
      {
        title: '비전 조화 (주문술사)',
        icon: '🌀',
        desc: '신비한 화살 적중 시 피해 증가 중첩',
        details: [
          '발동: 신비한 화살 적중 시마다 중첩 1개 생성',
          '효과: 중첩당 피해 5% 증가 (최대 20중첩 = 100% 피해 증가)',
          '유지: 번뜩임 발동 시마다 신비한 화살로(으로) 중첩 유지',
          '직관: 비전 탄막 시전 시 40% 확률로 발동 (중첩과 무관)',
          '핵심: 직관 + 번뜩임 조합으로 최대 피해 극대화'
        ],
        why: '주문술사 특화 - 번뜩임 + 비전 조화 중첩 관리가 핵심'
      },
      {
        title: '마나 관리 (소진/보존 페이즈)',
        icon: '💧',
        desc: '환기 타이밍과 마나 소진/보존 페이즈 운용',
        details: [
          '소진 페이즈: 4충전물 유지 + 고마나 소모 스킬 연속 사용',
          '보존 페이즈: 마나 30% 이하 → 저마나 스킬로 회복 + 환기 대기',
          '환기: 3초간 마나 회복 +1500% + 번뜩임 부여 + 지능 2% 증가',
          '환기 타이밍: 마나 20% 이하 + 주요 쿨기 재사용 대기 중',
          '성난태양: 환기 중 번뜩임으로 주문화염 구체 극대화'
        ],
        why: '마나가 곧 DPS - 환기 타이밍 실수 시 딜 공백 발생'
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
      border: '2px solid #3FC6EA',
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
          color: '#3FC6EA',
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
        color: '#3FC6EA',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderBottom: '1px dotted #3FC6EA',
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

const ArcaneMageGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [selectedTier, setSelectedTier] = useState('sunfury');
  const [showToast, setShowToast] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('raid-single');
  const [selectedStatHero, setSelectedStatHero] = useState('sunfury');
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
      '비전 작렬': skillData.arcaneblast,
      '비전 탄막': skillData.arcanebarrage,
      '신비한 화살': skillData.arcanemissiles,
      '비전 보주': skillData.arcaneorb,
      '신비한 폭발': skillData.arcaneexplosion,
      '비전의 여파': skillData.touchofthemagi,
      '환기': skillData.evocation,
      '냉정': skillData.presenceofmind,
      '투명화': skillData.invisibility,
      '시간 왜곡': skillData.timewarp,
      '신비한 지능': skillData.arcaneintellect,
      '일렁임': skillData.shimmer,
      '얼음장': skillData.netherprecision,
      '힘의 전환': skillData.shiftingpower,
      // 버프 및 메커니즘
      '비전의 영혼': skillData.arcanesoul,
      '황천의 정밀함': skillData.netherprecisionbuff,
      '번뜩임': skillData.clearcasting,
      '직관': skillData.intuition,
      '비전의 박자': skillData.arcanetempo,
      // 리소스 및 티어 세트
      '비전 충전물': skillData.arcanecharges,
      '마나': skillData.mana,
      '비전 조화': skillData.arcaneharmony,
      '주문불꽃 구체': skillData.spellfirespheres
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
          <h3 className={styles.subsectionTitle}>비전 마법사 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            비전 마법사는 <strong style={{ color: '#3FC6EA' }}>비전 충전물과 마나를 관리하여 폭발적인 피해를 입히는</strong> 원거리 캐스터 DPS 전문화입니다.
            현재 시즌에서는 <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>성난태양</span>이 주류 빌드이며, 번뜩임 관리를 통한 주문불꽃 구체 극대화가 핵심입니다.
          </p>

          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            비전 마법사는 <strong style={{ color: '#3FC6EA' }}>비전 충전물을(를) 쌓고 소모하는</strong> 메커니즘을(를) 가지고 있습니다.
            <SkillIcon skill={skillData.arcaneblast} textOnly={true} />와 {' '}
            <SkillIcon skill={skillData.arcaneorb} textOnly={true} />로 비전 충전물을(를) 생성하고,
            <SkillIcon skill={skillData.arcanebarrage} textOnly={true} />로 폭발적인 딜을 냅니다.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            번뜩임 프록 발동 시 <SkillIcon skill={skillData.arcanemissiles} textOnly={true} />를 즉시 시전하며,
            마나 소진 시에는
            <SkillIcon skill={skillData.evocation} textOnly={true} />로 마나를 회복합니다.
            <SkillIcon skill={skillData.touchofthemagi} textOnly={true} />는 GCD 밖에서 사용하여 버스트 윈도우를 극대화합니다.
          </p>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {[
              { skill: skillData.arcaneblast, label: '충전물 1 생성' },
              { skill: skillData.arcaneorb, label: '충전물 + 조화' },
              { skill: skillData.arcanebarrage, label: '충전물 소모' },
              { skill: skillData.arcanemissiles, label: '번뜩임 소비' },
              { skill: skillData.evocation, label: '마나 회복' },
              { skill: skillData.touchofthemagi, label: 'GCD 밖 버스트' }
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
            <li>주 자원: <span style={{ color: '#3FC6EA', fontWeight: 'bold' }}>마나</span> (최대 100%, 전투 중 자연 회복 없음)</li>
            <li>보조 자원: <span style={{ color: '#9482C9', fontWeight: 'bold' }}>비전 충전물</span> (최대 4개, 전투 이탈 시 소멸)</li>
            <li>충전물 생성:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.arcaneblast} textOnly={true} /> - 비전 충전물 1개 생성 (피해 +60%, 마나 +100%, 시전 시간 -8%)</li>
                <li><SkillIcon skill={skillData.arcaneorb} textOnly={true} /> - 비전 충전물 1개 생성 + 적 통과 시 추가 생성</li>
                <li><SkillIcon skill={skillData.arcaneexplosion} textOnly={true} /> - 적 타격 시 비전 충전물 1개 생성 (광역 전용)</li>
              </ul>
            </li>
            <li>충전물 소비:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.arcanebarrage} textOnly={true} /> - 모든 충전물 소모 (충전물당 피해 +90%)</li>
              </ul>
            </li>
            <li><strong style={{ color: '#ffa500' }}>핵심 전략:</strong> 4충전물 유지 → <SkillIcon skill={skillData.arcanebarrage} textOnly={true} />로 폭발적 피해 (마나 관리 필수)</li>
            <li><strong style={{ color: '#ff6b6b' }}>주의:</strong> 마나가 20% 이하로 떨어지면 <SkillIcon skill={skillData.evocation} textOnly={true} />으로 즉시 회복해야 딜 공백 방지</li>
          </ul>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginTop: '25px', marginBottom: '15px' }}>주요 메커니즘</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li><strong style={{ color: '#3FC6EA' }}>번뜩임:</strong> <SkillIcon skill={skillData.arcaneblast} textOnly={true} /> 시전 시 확률로 발동, 3중첩 번뜩임 시 <SkillIcon skill={skillData.arcanemissiles} textOnly={true} /> 즉시 시전 필수</li>
            <li><strong style={{ color: '#ff6b6b' }}>비전 조화 (주문술사):</strong> 신비한 화살 적중 시 피해 증가 중첩 (최대 20중첩 = 100% 피해 증가), 번뜩임과 함께 사용</li>
            <li><strong style={{ color: '#ffa500' }}>소진/보존 페이즈:</strong> 소진 페이즈(4충전물 유지) → 마나 30% 이하 → 보존 페이즈(저마나 스킬) → <SkillIcon skill={skillData.evocation} textOnly={true} /> 회복</li>
            <li><strong style={{ color: '#FFD700' }}>GCD 밖 버스트:</strong> <SkillIcon skill={skillData.touchofthemagi} textOnly={true} />는 GCD 밖에서 사용하여 딜 로스 없이 버스트 윈도우 극대화</li>
            <li><strong style={{ color: '#32CD32' }}>영웅 특성 활용:</strong> 성난태양은 번뜩임으로 주문화염 구체 극대화, 주문술사는 직관 관리 및 비전 조화 중첩 유지</li>
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
              className={`${styles.tierTab} ${selectedTier === 'sunfury' ? styles.active : ''}`}
              onClick={() => setSelectedTier('sunfury')}
            >
              <span className={styles.tierIcon}>☀️</span> 성난태양
            </button>
            <button
              className={`${styles.tierTab} ${selectedTier === 'spellslinger' ? styles.active : ''}`}
              onClick={() => setSelectedTier('spellslinger')}
            >
              <span className={styles.tierIcon}>🔮</span> 주문술사
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'sunfury' ? '#3FC6EA' : '#4ECDC4'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'sunfury'
                ? 'linear-gradient(135deg, rgba(63, 198, 234, 0.1), rgba(63, 198, 234, 0.05))'
                : 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'sunfury'
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
            border: selectedTier === 'sunfury'
              ? '1px solid rgba(63, 198, 234, 0.3)'
              : '1px solid rgba(78, 205, 196, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'sunfury' ? '#3FC6EA' : '#4ECDC4'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'sunfury' ? (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#FF8C42' }}>성난태양</strong>은 {' '}
                  비전과 화염 마법의 융합을 통한 {' '}
                  <strong style={{ color: '#3FC6EA' }}>폭발적인 버스트 피해</strong>로 {' '}
                  <strong style={{ color: '#ffa500' }}>레이드 보스전에서 최고의 성능</strong>을 제공합니다.
                  티어 세트와 결합 시 비전의 여파 발동 확률 증가와 추가 비전 피해로
                  단일 대상에서 압도적인 딜을 발휘합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#FF8C42', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('비전 작렬')} - 핵심 피해 스킬
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li><strong style={{ color: '#3FC6EA' }}>충전물 생성:</strong> 시전마다 비전 충전물 1개 생성 (최대 4중첩)</li>
                    <li><strong style={{ color: '#ffa500' }}>마나 소모:</strong> 충전물당 마나 소모 +100% (4중첩 시 5배)</li>
                    <li><strong style={{ color: '#FF8C42' }}>티어 2세트:</strong> {renderTextWithSkillIcons('비전 탄막 사용 시 비전의 여파 발동 확률 증가')}</li>
                    <li><strong style={{ color: '#FFD700' }}>연계:</strong> 4중첩 달성 후 {renderTextWithSkillIcons('비전 탄막')}으로 폭발 딜</li>
                  </ul>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    성난태양은 비전 충전물 관리가 핵심이며, {' '}
                    {renderTextWithSkillIcons('환기')} 사용 시 번뜩임 버프로 {renderTextWithSkillIcons('신비한 화살')} 폭발 딜을 극대화해야 합니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#3FC6EA', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('비전의 여파')} - 버스트 타이밍
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>준비 단계:</strong> 마나 70% 이상 확보 후 {renderTextWithSkillIcons('비전 작렬')} 4중첩
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버프 효과:</strong> 12초간 입힌 피해의 15%를 누적 후 폭발 (비전 피해)
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>피해 증폭:</strong> {renderTextWithSkillIcons('냉정')}과 함께 사용하여 즉시 시전 {renderTextWithSkillIcons('비전 작렬')} 2회
                    </li>
                    <li>
                      <strong>장신구/물약 조합:</strong> {renderTextWithSkillIcons('비전의 여파')} 활성화 중 모든 쿨기 사용
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: {renderTextWithSkillIcons('티어 2세트로 비전 탄막 사용 시 비전의 여파 발동 확률이(가) 증가하므로 4중첩 비전 탄막을(를) 적극 활용하세요.')}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#3FC6EA' }}>마나 관리:</strong> 항상 70% 이상 유지하여 {renderTextWithSkillIcons('비전 작렬')} 4중첩 유지
                    </li>
                    <li>
                      {renderTextWithSkillIcons('환기')} - 마나 회복 + 번뜩임 부여의 핵심 (90초 쿨)
                    </li>
                    <li>레이드 단일 대상과 보스 버스트 구간에서 최고 성능</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#64B5F6' }}>주문술사</strong>는 {' '}
                  {renderTextWithSkillIcons('비전 보주')}와 {renderTextWithSkillIcons('냉정')}을 통한 {' '}
                  <strong style={{ color: '#4ECDC4' }}>즉시 시전 비전 작렬 중심의 안정적인 플레이</strong>로 {' '}
                  <strong style={{ color: '#ffa500' }}>쐐기돌 던전과 이동 중 딜에서 탁월한 성능</strong>을 제공합니다.
                  티어 세트 효과로 {renderTextWithSkillIcons('비전 보주')} 피해가 증가하며,
                  {renderTextWithSkillIcons('냉정')} 사용 시 마나 부담 없이 즉시 시전 {renderTextWithSkillIcons('비전 작렬')}을 연발할 수 있습니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#64B5F6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('비전 보주')} - 핵심 충전물 생성 스킬
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#3FC6EA' }}>재사용 대기시간:</strong> 없음 (즉시 시전)
                    </li>
                    <li>
                      <strong style={{ color: '#64B5F6' }}>티어 2세트:</strong> {renderTextWithSkillIcons('비전 보주 피해 15% 증가')}
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>티어 4세트:</strong> {renderTextWithSkillIcons('비전 보주가 통과하는 적마다 비전 충전물 1개 생성')}
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>비전 충전물 생성:</strong> 시전 시 1개, 적 통과마다 1개 (최대 4중첩)
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>이동 중 사용:</strong> 즉시 시전으로 이동 중에도 딜 가능
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: {renderTextWithSkillIcons('비전 보주는 티어 4세트와 함께 사용 시 빠르게 4중첩을 만들 수 있어 주문술사의 핵심 스킬입니다.')}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#3FC6EA', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('냉정')} - 버스트 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      {renderTextWithSkillIcons('냉정')} 사용 시 다음 2회 {renderTextWithSkillIcons('비전 작렬')} 즉시 시전
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>재사용 대기시간:</strong> 60초
                    </li>
                    <li>
                      <strong style={{ color: '#64B5F6' }}>연계:</strong> {renderTextWithSkillIcons('비전 보주')} → {renderTextWithSkillIcons('비전 작렬')} 4중첩 → {renderTextWithSkillIcons('냉정')} → {renderTextWithSkillIcons('비전 작렬')} × 2
                    </li>
                    <li>
                      {renderTextWithSkillIcons('비전의 여파')}와 함께 사용하여 폭발 딜 극대화
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#3FC6EA' }}>이동성:</strong> {renderTextWithSkillIcons('비전 보주')} + {renderTextWithSkillIcons('일렁임')}으로 이동 중에도 높은 딜 유지
                    </li>
                    <li>
                      <strong style={{ color: '#64B5F6' }}>안정성:</strong> 즉시 시전 스킬 중심으로 마나 관리가 상대적으로 편함
                    </li>
                    <li>
                      {renderTextWithSkillIcons('냉정')} 60초 쿨다운 → 주기적 버스트 패턴
                    </li>
                    <li>쐐기돌 던전 이동 구간과 레이드 메커니즘 대응에서 최고 성능</li>
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
              <p style={{ color: selectedTier === 'sunfury' ? '#3FC6EA' : '#4ECDC4', fontSize: '0.95rem', margin: 0 }}>
                <strong>💡 추천 콘텐츠:</strong> {' '}
                {selectedTier === 'sunfury' ?
                  '단일 보스 레이드, 버스트 딜이 중요한 전투' :
                  '쐐기돌 던전, 광역 딜이 필요한 레이드 구간'}
              </p>
            </div>
          </div>

          {/* 단일 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-single']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'sunfury' ? '#3FC6EA' : '#4ECDC4',
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
                {selectedTier === 'sunfury' ?
                  renderTextWithSkillIcons('⏱️ 전투 4초 전: 환기 사용 (프리-풀) → 번뜩임 + 지능 버프 확보 후 버스트 시작') :
                  renderTextWithSkillIcons('⏱️ 전투 직전: 비전 보주와 냉정으로 즉시 비전 충전물 4중첩 달성')}
              </p>
              <div className={styles.skillSequence}>
                {currentContent.singleTarget.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              {selectedTier === 'sunfury' && (
                <p style={{ fontSize: '0.85rem', color: '#3FC6EA', marginTop: '8px' }}>
                  💡 팁: {renderTextWithSkillIcons('환기는 전투 4초 전 프리-풀 전용 - 비전 쇄도로 즉시 마나 회복')}
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
              color: selectedTier === 'sunfury' ? '#9482C9' : '#32CD32',
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
              {selectedTier === 'sunfury' && (
                <p style={{ fontSize: '0.85rem', color: '#3FC6EA', marginTop: '8px' }}>
                  💡 팁: {renderTextWithSkillIcons('환기는 전투 4초 전 프리-풀 전용 - 비전 쇄도로 즉시 마나 회복')}
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
              color: selectedTier === 'sunfury' ? '#9482C9' : '#32CD32',
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

            {selectedTier === 'sunfury' && (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ {renderTextWithSkillIcons('주문불꽃 구체')} 생성/소비
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> 성난태양의 전체 플레이스타일은 주문불꽃 구체를 최대한 많이 생성하는 것
                    </li>
                    <li>
                      <strong>소비 방법:</strong> <SkillIcon skill={skillData.invocationarcanephoenix} textOnly={true} />을 통해 소비
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}><SkillIcon skill={skillData.gloriousincandescence} textOnly={true} />:</strong> 주문불꽃 구체 소비 시 비전 충전물 즉시 재생성
                    </li>
                    <li>
                      <strong>생성 조건:</strong> 비전 주문 시전 시 일정 확률로 생성 (<SkillIcon skill={skillData.arcanesurge} textOnly={true} /> 사용 시 대량 생성)
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>최적화:</strong> 주문불꽃 구체 충전 후 버스트 윈도우에서 집중 소비
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 <SkillIcon skill={skillData.arcanesurge} textOnly={true} /> + <SkillIcon skill={skillData.touchofthemagi} textOnly={true} /> 동기화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}><SkillIcon skill={skillData.arcanesurge} textOnly={true} />:</strong> 주요 쿨다운 - 주문력 대폭 증가 + 마나 100% 회복 + <SkillIcon skill={skillData.clearcasting} textOnly={true} /> 자동 부여
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.touchofthemagi} textOnly={true} />:</strong> 12초 동안 대상에게 입힌 피해의 20% 누적 → 폭발 시 비전 피해
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 원칙:</strong> <SkillIcon skill={skillData.arcanebarrage} textOnly={true} />가 대상에 적중하기 전에 <SkillIcon skill={skillData.touchofthemagi} textOnly={true} /> 시전
                    </li>
                    <li>
                      <strong>버스트 순서:</strong> <SkillIcon skill={skillData.touchofthemagi} textOnly={true} /> → <SkillIcon skill={skillData.arcanesurge} textOnly={true} /> → 비전 충전물 4중첩 유지 → <SkillIcon skill={skillData.arcanebarrage} textOnly={true} /> 폭발
                    </li>
                    <li>
                      <strong>쿨다운 정렬:</strong> <SkillIcon skill={skillData.shiftingpower} textOnly={true} />를 <SkillIcon skill={skillData.arcanesoul} textOnly={true} /> 종료 후 사용하여 쿨다운 12초 감소
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💥 <SkillIcon skill={skillData.clearcasting} textOnly={true} />/<SkillIcon skill={skillData.netherprecisionbuff} textOnly={true} /> 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>우선순위 1:</strong> <SkillIcon skill={skillData.clearcasting} textOnly={true} /> 3중첩 시 즉시 <SkillIcon skill={skillData.arcanemissiles} textOnly={true} /> 사용
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}><SkillIcon skill={skillData.intuition} textOnly={true} />/<SkillIcon skill={skillData.arcanetempo} textOnly={true} />:</strong> 버프 만료 직전 <SkillIcon skill={skillData.arcanebarrage} textOnly={true} /> 시전
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}><SkillIcon skill={skillData.netherprecisionbuff} textOnly={true} /> 없을 때:</strong> <SkillIcon skill={skillData.clearcasting} textOnly={true} /> 즉시 소비 (버프 낭비 방지)
                    </li>
                    <li>
                      <strong>비전 충전물 3개 미만:</strong> <SkillIcon skill={skillData.arcaneorb} textOnly={true} /> 우선 시전
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.leydrinker} textOnly={true} /> 활성화:</strong> <SkillIcon skill={skillData.arcaneblast} textOnly={true} /> 우선 시전
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚔️ <SkillIcon skill={skillData.arcanemissiles} textOnly={true} /> 클리핑 기술 (고급)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>클리핑 개념:</strong> <SkillIcon skill={skillData.arcanemissiles} textOnly={true} /> 채널을 일부러 중단하여 효율 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 규칙:</strong> <SkillIcon skill={skillData.aetherattunement} textOnly={true} />로 강화된 <SkillIcon skill={skillData.arcanemissiles} textOnly={true} /> 제외하고 모두 클리핑
                    </li>
                    <li>
                      <strong>클리핑 타이밍:</strong> 주문 틱(tick)에서 중단 - 버프 유지 우선, 순수 피해는 후순위
                    </li>
                    <li>
                      <strong>효율성:</strong> 클리핑을 통해 전역 쿨다운 최적화 및 버프 윈도우 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>에테르 조율 강화:</strong> <SkillIcon skill={skillData.aetherattunement} textOnly={true} /> 버프 시 신비한 화살을(를) 끝까지 시전 - 15% 추가 피해 활용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🌪️ 7-10 분할 타격 광역 기술 (쐐기 전용)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>기술 개요:</strong> 8+ 대상 상황에서 <SkillIcon skill={skillData.arcaneorb} textOnly={true} /> 및 <SkillIcon skill={skillData.arcanebarrage} textOnly={true} /> 피해 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>실행 방법:</strong> <SkillIcon skill={skillData.arcanebarrage} textOnly={true} />를 <SkillIcon skill={skillData.arcaneorb} textOnly={true} />가 모든 대상에 완전히 적중하기 전에 시전
                    </li>
                    <li>
                      <strong>요구사항:</strong> 정확한 포지셔닝 + 타이밍 - 고급 기술
                    </li>
                    <li>
                      <strong>광역 우선순위:</strong> <SkillIcon skill={skillData.arcaneexplosion} textOnly={true} /> (0-1 충전물) → <SkillIcon skill={skillData.arcaneorb} textOnly={true} /> → <SkillIcon skill={skillData.arcanebarrage} textOnly={true} /> (4 충전물)
                    </li>
                    <li>
                      <strong>대상 수 제한:</strong> 일부 스킬은 대상 수 제한 있음 - 효율적 대상 선택 필요
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚠️ 마나 관리 전략
                  </h4>

                  {/* 마나 게이지 시각화 */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid rgba(255, 152, 0, 0.3)'
                  }}>
                    <p style={{ fontSize: '0.9rem', color: '#ffa500', marginBottom: '12px', fontWeight: 'bold' }}>
                      📊 마나 게이지 관리
                    </p>

                    {/* 게이지 바 */}
                    <div style={{
                      position: 'relative',
                      height: '40px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '2px solid rgba(63, 198, 234, 0.5)',
                      marginBottom: '15px'
                    }}>
                      {/* 위험 구간 (0-30%) - 빨간색 */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '30%',
                        background: 'linear-gradient(90deg, rgba(220, 53, 69, 0.3), rgba(220, 53, 69, 0.2))'
                      }} />

                      {/* 회복 구간 (30-50%) - 노란색 */}
                      <div style={{
                        position: 'absolute',
                        left: '30%',
                        top: '0',
                        bottom: '0',
                        width: '20%',
                        background: 'linear-gradient(90deg, rgba(255, 193, 7, 0.4), rgba(255, 193, 7, 0.3))'
                      }} />

                      {/* 안전 구간 (50-70%) - 초록색 */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        bottom: '0',
                        width: '20%',
                        background: 'linear-gradient(90deg, rgba(40, 167, 69, 0.3), rgba(40, 167, 69, 0.2))'
                      }} />

                      {/* 이상적 구간 (70-100%) - 파란색 */}
                      <div style={{
                        position: 'absolute',
                        left: '70%',
                        top: '0',
                        bottom: '0',
                        width: '30%',
                        background: 'linear-gradient(90deg, rgba(63, 198, 234, 0.4), rgba(99, 132, 201, 0.4))'
                      }} />

                      {/* 구간 표시선 */}
                      <div style={{
                        position: 'absolute',
                        left: '30%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#dc3545'
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#ffc107'
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '70%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#28a745'
                      }} />

                      {/* 수치 표시 */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: '#fff'
                      }}>
                        <span>0%</span>
                        <span style={{ color: '#dc3545' }}>30%</span>
                        <span style={{ color: '#ffc107' }}>50%</span>
                        <span style={{ color: '#28a745' }}>70%</span>
                        <span style={{ color: '#3FC6EA' }}>100%</span>
                      </div>
                    </div>

                    {/* 구간별 설명 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(220, 53, 69, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(220, 53, 69, 0.3)'
                      }}>
                        <strong style={{ color: '#dc3545' }}>0-30%:</strong> <span style={{ color: '#ccc' }}>위험 (비전 쇄도 대기)</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(255, 193, 7, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 193, 7, 0.3)'
                      }}>
                        <strong style={{ color: '#ffc107' }}>30-50%:</strong> <span style={{ color: '#ccc' }}>안전 구간</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(40, 167, 69, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(40, 167, 69, 0.3)'
                      }}>
                        <strong style={{ color: '#28a745' }}>50-70%:</strong> <span style={{ color: '#ccc' }}>안전 구간</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(63, 198, 234, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(63, 198, 234, 0.3)'
                      }}>
                        <strong style={{ color: '#3FC6EA' }}>70-100%:</strong> <span style={{ color: '#ccc' }}>이상적 범위</span>
                      </div>
                    </div>
                  </div>

                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong><SkillIcon skill={skillData.arcanesurge} textOnly={true} /> 효과:</strong> 마나 즉시 100% 회복 + 주문력 대폭 증가 + <SkillIcon skill={skillData.clearcasting} textOnly={true} /> 자동 부여
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.evocation} textOnly={true} /> 사용:</strong> 전투 4초 전 프리-풀 전용 (<SkillIcon skill={skillData.clearcasting} textOnly={true} /> + 지능 버프 + 마나 재생)
                    </li>
                    <li>
                      <strong>충전물 관리:</strong> 비전 충전물 4중첩 시 <SkillIcon skill={skillData.arcanebarrage} textOnly={true} />로 소모
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.clearcasting} textOnly={true} /> 활용:</strong> <SkillIcon skill={skillData.arcanemissiles} textOnly={true} /> 마나 소모 없음 - 적극 활용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6347', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 <SkillIcon skill={skillData.memoryofalar} textOnly={true} /> → <SkillIcon skill={skillData.arcanesoul} textOnly={true} /> 버프 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> <SkillIcon skill={skillData.arcanesurge} textOnly={true} /> 시전 시 15% 확률로 <SkillIcon skill={skillData.arcanesoul} textOnly={true} /> 버프 부여
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}><SkillIcon skill={skillData.arcanesoul} textOnly={true} /> 효과:</strong> 비전 주문이 모든 대상에게 피해 + 주문불꽃 구체 대량 생성 (20초 지속)
                    </li>
                    <li>
                      <strong style={{ color: '#dc3545' }}>최우선 순위 (핵심!):</strong> <SkillIcon skill={skillData.arcanesoul} textOnly={true} /> 마지막 GCD에 <SkillIcon skill={skillData.arcanebarrage} textOnly={true} /> 시전
                    </li>
                    <li>
                      <strong>우선순위 2:</strong> <SkillIcon skill={skillData.netherprecisionbuff} textOnly={true} /> 없을 때 <SkillIcon skill={skillData.clearcasting} textOnly={true} /> 번뜩임으로 <SkillIcon skill={skillData.arcanemissiles} textOnly={true} /> 시전
                    </li>
                    <li>
                      <strong>우선순위 3:</strong> <SkillIcon skill={skillData.arcanebarrage} textOnly={true} /> 반복 시전
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버프 종료 후:</strong> <SkillIcon skill={skillData.shiftingpower} textOnly={true} />로 쿨다운 12초 감소 → 빠른 재사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff1493', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ✨ <SkillIcon skill={skillData.magisspark} textOnly={true} /> 중첩 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>메커니즘:</strong> <SkillIcon skill={skillData.touchofthemagi} textOnly={true} /> (비전의 여파) 대상에게 4% 피해 증가 (최대 4중첩 = 16%)
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>중첩 방법:</strong> 비전 주문 적중 시 1중첩 (비전 작렬, 비전 탄막, 비전 폭발 등)
                    </li>
                    <li>
                      <strong>빠른 4중첩:</strong> <SkillIcon skill={skillData.touchofthemagi} textOnly={true} /> → <SkillIcon skill={skillData.arcanesurge} textOnly={true} /> → <SkillIcon skill={skillData.arcaneblast} textOnly={true} /> 4회 → 4중첩 완성
                    </li>
                    <li>
                      <strong>유지 전략:</strong> 비전의 여파 12초 동안 계속 비전 주문 시전하여 4중첩 유지
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버스트 극대화:</strong> 4중첩 상태에서 <SkillIcon skill={skillData.arcanebarrage} textOnly={true} /> 시전 → 폭발 피해 16% 증가
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#4169e1', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ <SkillIcon skill={skillData.leydrinker} textOnly={true} /> 메아리 타이밍 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> <SkillIcon skill={skillData.leydrinker} textOnly={true} /> 버프 시 <SkillIcon skill={skillData.arcaneblast} textOnly={true} />이 70% 피해로 메아리 (단일/광역 모두 강력)
                    </li>
                    <li>
                      <strong>발동 조건:</strong> <SkillIcon skill={skillData.clearcasting} textOnly={true} /> 번뜩임 소모 시 <SkillIcon skill={skillData.leydrinker} textOnly={true} /> 버프 부여
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>우선순위:</strong> <SkillIcon skill={skillData.leydrinker} textOnly={true} /> 활성 시 즉시 <SkillIcon skill={skillData.arcaneblast} textOnly={true} /> 시전 (다른 주문보다 우선)
                    </li>
                    <li>
                      <strong>버스트 윈도우:</strong> <SkillIcon skill={skillData.arcanesurge} textOnly={true} /> + <SkillIcon skill={skillData.touchofthemagi} textOnly={true} /> 활성 시 <SkillIcon skill={skillData.leydrinker} textOnly={true} /> 프록 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>광역 활용:</strong> 다수 대상 시 메아리가 모든 대상에게 적용 → 총 피해 170%
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#00ced1', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🛡️ 쐐기 필수 유틸리티
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}><SkillIcon skill={skillData.spellsteal} textOnly={true} /> (마법 훔치기):</strong> 적 버프 훔치기 - 마나 21% 소모 (높은 비용 주의)
                    </li>
                    <li>
                      <strong>활용 상황:</strong> 보스/정예몹 강화 버프 제거 + 자신에게 부여 (예: 광폭화, 공속 버프)
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}><SkillIcon skill={skillData.massbarrier} textOnly={true} /> (집단 보호막):</strong> 2분 쿨 - 파티원 10미터 내 피해 흡수 (15초 지속)
                    </li>
                    <li>
                      <strong>사용 타이밍:</strong> 광역 피해 메커니즘 직전 (폭발, 스웜, 장판 등)
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.shimmer} textOnly={true} /> 활용:</strong> 20미터 순간이동 - 시전 중에도 사용 가능 (장판 회피 + 딜 유지)
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>고급 기술:</strong> <SkillIcon skill={skillData.spellsteal} textOnly={true} />로 훔친 버프를 <SkillIcon skill={skillData.arcanesurge} textOnly={true} /> 버스트에 활용
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>공통 생존 메커니즘</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>
                  <SkillIcon skill={skillData.netherprecision} textOnly={true} /> (얼음장) - 6초간 받는 모든 피해 70% 감소 (저체온증으로 30초 재사용 불가)
                </li>
                <li>
                  <SkillIcon skill={skillData.invisibility} textOnly={true} /> - 3초에 걸쳐 투명화, 적의 대상 해제 (20초 지속, 3분 쿨)
                </li>
                <li>
                  <SkillIcon skill={skillData.shimmer} textOnly={true} /> - 20미터 순간이동, 전역 쿨 무시 + 시전 중에도 사용 가능
                </li>
                <li>
                  <strong style={{ color: '#ffa500' }}>파티 유틸:</strong> <SkillIcon skill={skillData.arcaneintellect} textOnly={true} /> - 파티/공격대 전체 지능 3% 증가 (1시간 지속)
                </li>
              </ul>
            </div>

            {/* 실전 팁 */}
            <div style={{ marginTop: '30px' }}>
              <h4 style={{
                color: selectedTier === 'sunfury' ? '#9482C9' : '#32CD32',
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
                  • <strong style={{ color: '#ff6b6b' }}>마나 고갈:</strong> {renderTextWithSkillIcons('환기 미사용으로 마나 30% 이하 지속 → DPS 30% 이상 손실')}<br/>
                  • <strong style={{ color: '#ff6b6b' }}>비전 충전물 낭비:</strong> {renderTextWithSkillIcons('0-1중첩 상태에서 비전 탄막 사용 → 피해 90% 감소')}<br/>
                  {selectedTier === 'sunfury' && (
                    <>
                      • <strong style={{ color: '#ff6b6b' }}>비전의 여파 미활용:</strong> {renderTextWithSkillIcons('비전의 여파 활성 시 딜 집중 누락 → 폭발 피해 손실')}<br/>
                      • <strong style={{ color: '#ff6b6b' }}>번뜩임 낭비:</strong> {renderTextWithSkillIcons('번뜩임 프록 시 신비한 화살 미사용 → 무료 피해 손실')}<br/>
                    </>
                  )}
                  {selectedTier === 'spellslinger' && (
                    <>
                      • <strong style={{ color: '#ff6b6b' }}>비전 보주 쿨 낭비:</strong> {renderTextWithSkillIcons('이동 구간에서 비전 보주 미사용 → 딜 손실')}<br/>
                      • <strong style={{ color: '#ff6b6b' }}>냉정 미활용:</strong> {renderTextWithSkillIcons('이동 중 냉정 사용 누락 → 기동성 손실')}<br/>
                    </>
                  )}
                  • <strong style={{ color: '#ff6b6b' }}>광역 비전 폭발 누락:</strong> {renderTextWithSkillIcons('3+ 적 광역 구간에서 비전 폭발 미사용 → 광역 피해 손실')}
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
                  • <strong style={{ color: '#28a745' }}>주문 대기열 윈도우 활용:</strong> 전역 쿨다운 종료 0.25초 전 다음 스킬 입력 → 즉시 발동<br/>
                  • <strong style={{ color: '#28a745' }}>마나 예측 관리:</strong> {renderTextWithSkillIcons('환기 타이밍 10초 전 마나 50% 이하로 조절 → 최대 효율')}<br/>
                  {selectedTier === 'sunfury' && (
                    <>
                      • <strong style={{ color: '#28a745' }}>버스트 타이밍:</strong> {renderTextWithSkillIcons('환기 + 비전의 여파 + 시간 왜곡 동시 활용 → 최대')} 초당 피해량<br/>
                      • <strong style={{ color: '#28a745' }}>비전의 여파 최대화:</strong> {renderTextWithSkillIcons('비전의 여파 10초 남았을 때 4중첩 비전 작렬 집중 → 폭발 딜 극대화')}<br/>
                    </>
                  )}
                  {selectedTier === 'spellslinger' && (
                    <>
                      • <strong style={{ color: '#28a745' }}>이동 최적화:</strong> {renderTextWithSkillIcons('비전 보주 + 냉정 조합 → 이동 중에도')} 초당 피해량 유지<br/>
                      • <strong style={{ color: '#28a745' }}>일렁임 활용:</strong> {renderTextWithSkillIcons('일렁임으로 위치 선점 + 비전 보주 즉시 사용 → 기동 딜 극대화')}<br/>
                    </>
                  )}
                  • <strong style={{ color: '#28a745' }}>충전물 관리:</strong> {renderTextWithSkillIcons('4중첩 달성 즉시 비전 탄막 사용 → 마나 절약 + 피해 최대화')}<br/>
                  • <strong style={{ color: '#28a745' }}>위크오라 설정:</strong> 비전의 여파, 번뜩임 버프, {selectedTier === 'sunfury' ? '비전 충전물 중첩' : renderTextWithSkillIcons('비전 보주 쿨')}, 마나 게이지 추적 필수
                </p>
              </div>
            </div>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 데이터 - 비전 마법사 TWW 시즌3
  const talentBuilds = {
    sunfury: {  // 성난태양 (Sunfury)
      'raid-single': {
        name: '레이드 단일 대상',
        description: '성난태양을 활용한 단일 대상 빌드입니다. 비전의 여파와 비전 충전물 강화로 보스전에 특화되어 있습니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSikEJSSiQJJhEJSA',  // Sunfury 레이드 단일
        icon: '🔥'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '성난태양을 활용한 광역 빌드입니다. 비전 폭발로 다수 대상에게 강력한 광역 딜을 제공합니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASkkkEJSSiEJJhEJSA',  // Sunfury 레이드 광역
        icon: '🔥'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '성난태양을 활용한 쐐기돌 빌드입니다. 버스트 피해와 비전의 여파로 쐐기돌에 최적화되어 있습니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASkkSSJSSiEJJhkESA',  // Sunfury 쐐기돌
        icon: '🔥'
      }
    },
    spellslinger: {  // 주문술사 (Spellslinger)
      'raid-single': {
        name: '레이드 단일 대상',
        description: '주문술사를 활용한 단일 대상 빌드입니다. 비전 보주로 안정적인 단일 딜을 제공합니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSSSkESSCJJhEJSA',  // Spellslinger 레이드 단일
        icon: '✨'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '주문술사를 활용한 광역 빌드입니다. 비전 보주로 강력한 광역 딜을 제공합니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSSkkkESSCJJhEJSA',  // Spellslinger 레이드 광역
        icon: '✨'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '주문술사를 활용한 쐐기돌 빌드입니다. 이동성과 비전 보주로 쐐기돌에 최적화되어 있습니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSkkSkESSCJJhkESA',  // Spellslinger 쐐기돌
        icon: '✨'
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
              setSelectedTier('sunfury');
              setSelectedBuild('mythic-plus');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'sunfury' ?
                'linear-gradient(135deg, #5a3896 0%, #2a1846 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'sunfury' ? '#9482C9' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'sunfury' ? '#9482C9' : '#94a3b8',
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
            <span>성난태양</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>쐐기 추천</span>
          </button>

          <button
            onClick={() => {
              setSelectedTier('spellslinger');
              setSelectedBuild('raid-single');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'spellslinger' ?
                'linear-gradient(135deg, #2a7a46 0%, #1a3a26 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'spellslinger' ? '#32CD32' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'spellslinger' ? '#32CD32' : '#94a3b8',
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
            <span>주문술사</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>레이드 추천</span>
          </button>
        </div>

        {/* 빌드 선택 버튼들 */}
        <div style={{ padding: '20px' }}>
          {/* ⚠️ TODO: selectedTier 조건을 실제 영웅특성명으로 변경 */}
          <h4 style={{
            color: selectedTier === 'sunfury' ? '#9482C9' : '#32CD32',
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            {selectedTier === 'sunfury' ? '성난태양' : '주문술사'} 특성 빌드
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
        sunfury: {  // 성난태양 (Sunfury)
          single: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#3FC6EA', priority: 'high' }
              ],
              note: 'GCD 감소와 비전 작렬 시전 속도 향상, 비전 충전물 빠른 생성'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '비전의 여파 발동 확률 간접 증가, 평균 딜 향상'
            },
            mastery: {
              breakpoints: [],
              note: '비전 충전물 중첩당 피해 증가, 성난태양 특성과 시너지'
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
                { value: 20.7, label: 'GCD 1초 도달', color: '#3FC6EA', priority: 'high' }
              ],
              note: '빠른 비전 충전물 생성과 비전 탄막 빈도 증가'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '광역 비전 스킬 치명타로 폭발 딜 증가'
            },
            mastery: {
              breakpoints: [],
              note: '모든 비전 피해 증가로 광역에서도 높은 가치'
            },
            versatility: {
              breakpoints: [],
              note: '안정적인 피해 증가 옵션'
            }
          }
        },
        spellslinger: {  // 주문술사 (Spellslinger)
          single: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#3FC6EA', priority: 'high' }
              ],
              note: '비전 보주 빈도 증가와 즉시 시전 효율 향상, 이동 중 딜 극대화'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '비전 보주 치명타 확률 증가, 안정적인 평균 딜 향상'
            },
            mastery: {
              breakpoints: [],
              note: '비전 보주 피해 증가, 주문술사 특성과 시너지'
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
                { value: 20.7, label: 'GCD 1초 도달', color: '#3FC6EA', priority: 'high' }
              ],
              note: '최우선 스탯, 비전 보주 빈도와 광역 딜 극대화'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '광역 비전 보주 치명타로 폭발 딜 증가'
            },
            mastery: {
              breakpoints: [],
              note: '비전 보주와 비전 탄막 피해 증가'
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

    // 스탯 우선순위 - 비전 마법사 TWW 시즌3
    const statPriorities = {
      sunfury: {  // 성난태양 (Sunfury)
        single: ['versatility', 'haste', 'mastery', 'crit'],  // 단일: 유연 > 가속 > 특화 > 치명타
        aoe: ['versatility', 'haste', 'mastery', 'crit']  // 광역: 유연 > 가속 > 특화 > 치명타
      },
      spellslinger: {  // 주문술사 (Spellslinger)
        single: ['haste', 'crit', 'mastery', 'versatility'],  // 단일: 가속 > 치명타 = 특화 > 유연 (비전 조화 중첩)
        aoe: ['haste', 'mastery', 'crit', 'versatility']  // 광역: 가속 > 특화 > 치명타 > 유연 (비전 조화 광역)
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
              onClick={() => setSelectedStatHero('sunfury')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'sunfury' ?
                  'linear-gradient(135deg, #8B6B47 0%, #5a4a2a 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'sunfury' ? '#3FC6EA' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'sunfury' ? '#3FC6EA' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🔥 성난태양
            </button>
            <button
              onClick={() => setSelectedStatHero('spellslinger')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'spellslinger' ?
                  'linear-gradient(135deg, #2a7a8a 0%, #1a4a5a 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'spellslinger' ? '#4ECDC4' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'spellslinger' ? '#4ECDC4' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ✨ 주문술사
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
              color: selectedStatHero === 'sunfury' ? '#3FC6EA' : '#4ECDC4',
              fontSize: '1.3rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{selectedStatHero === 'sunfury' ? '🔥' : '✨'}</span>
              <span>{selectedStatHero === 'sunfury' ? '성난태양' : '주문술사'}</span>
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
                  ((selectedStatHero === 'sunfury' && selectedStatMode === 'single' && index === 2) ||
                   (selectedStatHero === 'spellslinger' && index === 4));

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
                background: 'linear-gradient(135deg, #3FC6EA 0%, #2a9cc4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                textShadow: '0 0 30px rgba(63, 198, 234, 0.3)'
              }}>
                비전 마법사 가이드
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

export default ArcaneMageGuide;