/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  FrostDeathKnightGuide.js - 냉기 죽음의 기사 전문화 가이드           ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 *
 * 📋 가이드 개요:
 * - 기반: GuideTemplate.js → FuryWarriorGuide.js (3,520줄 완전 구조)
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
 *    - arcaneDeath KnightSkills → 실제 전문화 스킬 (예: fireDeath KnightSkills)
 *    - '../data/arcaneDeath KnightSkillData' → 실제 경로
 *
 * 2. Line 58-81: unifiedTheme 색상 변경
 *    - primary/accent: #3FC6EA → 실제 클래스 색상
 *    - hover: rgba(63, 198, 234, 0.1) → 실제 색상 rgba
 *
 * 3. getHeroContent 함수 수정 (검색: "getHeroContent")
 *    - 키 이름: 'deathbringer'/'rideroftheapocalypse' → 실제 영웅특성 영문명
 *    - name/icon/tierSet/opener/priority 모두 교체
 *
 * 4. 영웅특성 선택 버튼 수정 (검색: "setSelectedTier")
 *    - setSelectedTier('deathbringer') → 실제 영웅특성명
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
 * - Death Knight: #3FC6EA (63, 198, 234)
 * - Warlock: #9482C9 (148, 130, 201)
 * - Monk: #00FF96 (0, 255, 150)
 * - Druid: #FF7D0A (255, 125, 10)
 * - DemonHunter: #A330C9 (163, 48, 201)
 * - DeathKnight: #C41E3A (196, 30, 58)
 * - Evoker: #33937F (51, 147, 127)
 */

import React, { useState, useRef, useEffect } from 'react';  // ✅ useState, useRef 복원 (SkillIconComponent, EnglishTerm에서 사용)
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase.js';

// ✅ 스킬 데이터 import (냉기 죽음의 기사)
import { frostDeathKnightSkills as skillData} from '../data/frostDeathKnightSkillData.js';
import styles from './DevastationEvokerGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus.js';
import aiFeedbackService from '../services/AIFeedbackService.js';
import externalGuideCollector from '../services/ExternalGuideCollector.js';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater.js';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer.js';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons.js';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// ✅ 공통 모듈 import
import {
  PageWrapper,
  Sidebar,
  NavSection,
  NavItem,
  SubNavItem,
  MainContent,
  ContentContainer,
  Section,
  SectionHeader,
  SectionTitle,
  Card,
  HeroCard,
  CopyToast,
  UpdateToast,
  GlobalStyle
} from './guide-modules/GuideStyledComponents';
import {
  useGuideNavigation,
  useToast,
  useSelection,
  useCopyToClipboard
} from './guide-modules/GuideHooks';

// ✅ 클래스 색상 테마 (죽음의 기사: #C41E3A)
const unifiedTheme = {
  colors: {
    primary: '#C41E3A',      // Death Knight: (196, 30, 58)
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#C41E3A',       // Death Knight
    accentRGB: '196, 30, 58', // Death Knight RGB (for rgba calculations)
    border: '#2a2a3e',
    hover: 'rgba(196, 30, 58, 0.1)',  // Death Knight RGB
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

// ✅ 영웅 특성 색상 정의
const heroColors = {
  rideroftheapocalypse: {
    bgStart: 'rgba(198, 155, 109, 0.05)',
    bgEnd: 'rgba(255, 107, 107, 0.05)',
    border: 'rgba(198, 155, 109, 0.3)',
    gradient: 'linear-gradient(90deg, #C69B6D, #FF6B6B)'
  },
  deathbringer: {
    bgStart: 'rgba(139, 0, 0, 0.05)',
    bgEnd: 'rgba(196, 30, 58, 0.05)',
    border: 'rgba(139, 0, 0, 0.3)',
    gradient: 'linear-gradient(90deg, #8B0000, #C41E3A)'
  }
};

// ✅ 모든 styled-components는 guide-modules에서 import됨 (Line 78-100)
// ✅ 300줄의 중복 코드 제거 완료!

// 영웅특성별 콘텐츠 생성 함수
// deathbringer (죽음인도자): 치명적인 피의 일격으로 강력한 단일 대상 딜 제공
// rideroftheapocalypse (종말의 기수): 종말의 힘을 사용한 광역 및 단일 대상 딜
const getHeroContent = (SkillIcon) => ({
  deathbringer: {
    name: '죽음인도자',
    icon: '⚔️',
    
    
        {
          skill: skillData.froststr,
          conditions: [
            '다음 시전 전 만료 예정'
          ],
          priority: 1,
          why: '강력한 버프를 낭비하지 않기 위해'
        },
        {
          skill: skillData.howlingblast,
          conditions: [
            '황천의 정밀함 버프 있음',
          ],
          priority: 2,
        },
        {
          skill: skillData.mindfreeze,
          conditions: [
          ],
          priority: 3,
        },
        {
          skill: skillData.howlingblast,
          conditions: [
            '황천의 정밀함 없음'
          ],
          priority: 4,
        },
        {
          skill: skillData.glacialadvance,
          conditions: [
            '충전물 빠른 생성 필요'
          ],
          priority: 5,
          why: '4충전물 목표 달성을 위한 빠른 생성'
        },
        {
          skill: skillData.frostscythe,
          conditions: [
            '지맥 흡수자 버프 활성',
          ],
          priority: 6,
        },
        {
          skill: skillData.froststr,
          conditions: [
            '직관 또는 영광스러운 백열 버프 활성',
          ],
          priority: 7,
        },
        {
          skill: skillData.frostnova,
          conditions: [
            '빠른 충전물 생성 필요'
          ],
          priority: 8,
        },
        {
          skill: skillData.obliterate,
          conditions: [
            '재사용 대기시간 없음',
            '충전물 생성'
          ],
          priority: 9,
        },
        {
          skill: skillData.froststr,
          conditions: [
          ],
          priority: 10,
        }
      ]
    },
    aoe: {
      opener: [
        skillData.raisedead,       // 전투 4초 전: 환영 복제 (DPS 증가 + 생존력)
        skillData.pillarofthe,          // Time Warp (팀 공속 버프)
        skillData.breathofthe,
        skillData.frostscythe
        skillData.frostnova,   // 광역 피해
        skillData.frostnova,   // 광역 피해
        skillData.obliterate,       // 충전 쌓기
        skillData.frostnova    // 광역 계속
      ],
      priority: [
        {
          skill: skillData.howlingblast,
          conditions: [
            '3+ 적 상황에서도 최우선'
          ],
          priority: 0,
        },
        {
          skill: skillData.froststr,
          conditions: [
          ],
          priority: 1,
          why: '강력한 버프를 낭비하지 않기 위해'
        },
        {
          skill: skillData.glacialadvance,
          conditions: [
            '재사용 대기시간 완료'
          ],
          priority: 2,
          why: '광역 상황에서 빠른 충전물 생성'
        },
        {
          skill: skillData.frostnova,
          desc: '신비한 폭발 (광역 주력)',
          conditions: [
            '3+ 적'
          ],
          priority: 3,
          why: '저충전 상태에서 광역 피해 극대화'
        },
        {
          skill: skillData.froststr,
          conditions: [
            '3+ 적'
          ],
          priority: 4,
          why: '4충전 탄막으로(로) 광역 피해 + 보주 재사용 준비'
        },
        {
          skill: skillData.obliterate,
          conditions: [
          ],
          priority: 5,
          why: '4충전 목표 달성을 위한 충전물 생성'
        },
        {
          skill: skillData.frostnova,
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
        icon: '💥',
        details: [
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
        ],
      },
      {
        icon: '🔮',
        details: [
        ],
      },
      {
        icon: '✨',
        details: [
        ],
      },
      {
        icon: '💧',
        details: [
        ],
      }
    ]
  },
  rideroftheapocalypse: {
    name: '종말의 기수',
    icon: '✨',
    
    
        {
          skill: skillData.mindfreeze,
          desc: '힘의 전환 (전략적)',
          conditions: [
            '직관 없음'
          ],
          priority: 1,
        },
        {
          skill: skillData.howlingblast,
          conditions: [
            '황천의 정밀함 없음'
          ],
          priority: 2,
        },
        {
          skill: skillData.obliterate,
          conditions: [
            '재사용 대기시간 없음'
          ],
          priority: 3,
          why: '4충전물 목표 달성 - 항상 4충전 유지가 Rider of the Apocalypse 기본'
        },
        {
          skill: skillData.obliterate,
          conditions: [
            '재사용 대기시간 없음',
          ],
          priority: 4,
        },
        {
          skill: skillData.froststr,
          conditions: [
          ],
          priority: 5,
        }
      ]
    },
    aoe: {
      opener: [
        skillData.raisedead,       // 전투 4초 전: 환영 복제 (DPS 증가 + 생존력)
        skillData.frostnova,   // Pull 시작: 광역 피해
        skillData.glacialadvance
        skillData.pillarofthe,          // Time Warp (팀 공속 버프)
        skillData.frostscythe,    // Touch of the Magi
        skillData.frostnova,   // 광역 피해
        skillData.frostnova,   // 광역 피해
        skillData.obliterate,       // 충전 쌓기
        skillData.obliterate,       // 충전 쌓기
        skillData.frostnova    // 광역 계속
      ],
      priority: [
        {
          skill: skillData.froststr,
          conditions: [
            '2+ 적',
            '다음 조건 중 하나:',
            '  - 직관 발동',
          ],
          priority: 0,
          why: 'AoE에서도 직관 발동이 핵심 - 4충전 탄막으로(로) 광역 폭발 피해'
        },
        {
          skill: skillData.howlingblast,
          conditions: [
            '황천의 정밀함 없음',
            '2+ 적'
          ],
          priority: 1,
        },
        {
          skill: skillData.frostnova,
          conditions: [
            '2+ 적'
          ],
          priority: 2,
        },
        {
          skill: skillData.obliterate,
          conditions: [
            '2+ 적'
          ],
          priority: 3,
          why: 'AoE에서도 4충전 유지'
        },
        {
          skill: skillData.froststr,
          conditions: [
            '2+ 적'
          ],
          priority: 4,
        }
      ]
    },
    mechanics: [
      {
        icon: '🔮',
        details: [
        ],
      },
      {
        icon: '✨',
        desc: '신비한 화살 무료 시전 버프 - 3중첩 우선순위',
        details: [
          '시전 중 이동 가능 - 기동성 극대화 활용'
        ],
      },
      {
        icon: '🌀',
        desc: '신비한 화살 적중 시 피해 증가 중첩',
        details: [
          '발동: 신비한 화살 적중 시마다 중첩 1개 생성',
          '효과: 중첩당 피해 5% 증가 (최대 20중첩 = 100% 피해 증가)',
        ],
      },
      {
        icon: '💧',
        details: [
        ],
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

const FrostDeathKnightGuide = () => {
  // ✅ 공통 hooks 사용 (8개 useState → 3개 custom hooks로 통합)
  const {
    activeSection,
    activeSubSection,
    sectionRefs,
    subSectionRefs,
    scrollToSection,
    scrollToSubSection
  } = useGuideNavigation({
    mainSections: ['overview', 'rotation', 'builds', 'stats'],
    subSections: [
      'overview-intro',
      'overview-resource',
      'rotation-tier',
      'rotation-single',
      'rotation-aoe',
      'builds-talents',
      'stats-priority',
      'stats-simc'
    ],
    defaultSection: 'overview',
    scrollOffset: 150
  });

  const {
    showToast,
    showUpdateToast: showCopyToast,
    triggerToast,
    triggerUpdateToast: triggerCopyToast
  } = useToast(5000);

  const {
    selectedTier,
    selectedBuild,
    selectedStatHero,
    selectedStatMode,
    setSelectedTier,
    setSelectedBuild,
    setSelectedStatHero,
    setSelectedStatMode
  } = useSelection({
    heroTalent: 'rideroftheapocalypse',
    build: 'raid-single',
    statHero: 'rideroftheapocalypse',
    statMode: 'single'
  });

  const { copyToClipboard } = useCopyToClipboard(
    () => triggerCopyToast(),  // 성공 시 복사 토스트 표시
    (err) => console.error('클립보드 복사 실패:', err)  // 실패 시 에러 로그
  );

  // 수동 가이드 업데이트 함수 (외부에서 호출 가능)
  const updateGuideData = (newData) => {
    console.log('📝 수동 가이드 업데이트 수신:', newData);

    // 업데이트 알림 표시
    triggerToast();  // ✅ useToast hook 사용

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
      '신비한 화살': skillData.howlingblast,
      '신비한 폭발': skillData.frostnova,
      '냉정': skillData.pillarofthe,
      '투명화': skillData.iceboundfort,
      '시간 왜곡': skillData.pillarofthe,
      '신비한 지능': skillData.bloodtap,
      '일렁임': skillData.deathsadvance,
      '얼음장': skillData.frostscythe,
      '힘의 전환': skillData.mindfreeze,
      // 버프 및 메커니즘
      '황천의 정밀함': skillData.frostfever,
      '직관': skillData.rimestrike
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

  // ✅ sectionRefs, subSectionRefs는 useGuideNavigation에서 제공됨 (Line 1062-1083)

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
        triggerToast();  // ✅ useToast hook 사용
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

  // ✅ 스크롤 이벤트 처리는 useGuideNavigation에서 자동 처리됨 (130줄 삭제)

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
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          </p>

          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <SkillIcon skill={skillData.obliterate} textOnly={true} />와 {' '}
            <SkillIcon skill={skillData.froststr} textOnly={true} />로 폭발적인 딜을 냅니다.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <SkillIcon skill={skillData.frostscythe} textOnly={true} />는 GCD 밖에서 사용하여 버스트 윈도우를 극대화합니다.
          </p>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {[
              { skill: skillData.obliterate, label: '충전물 1 생성' },
              { skill: skillData.glacialadvance, label: '충전물 + 조화' },
              { skill: skillData.froststr, label: '충전물 소모' },
              { skill: skillData.frostscythe, label: 'GCD 밖 버스트' }
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
            <li>충전물 생성:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
              </ul>
            </li>
            <li>충전물 소비:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.froststr} textOnly={true} /> - 모든 충전물 소모 (충전물당 피해 +90%)</li>
              </ul>
            </li>
          </ul>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginTop: '25px', marginBottom: '15px' }}>주요 메커니즘</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li><strong style={{ color: '#FFD700' }}>GCD 밖 버스트:</strong> <SkillIcon skill={skillData.frostscythe} textOnly={true} />는 GCD 밖에서 사용하여 딜 로스 없이 버스트 윈도우 극대화</li>
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
              className={`${styles.tierTab} ${selectedTier === 'rideroftheapocalypse' ? styles.active : ''}`}
              onClick={() => setSelectedTier('rideroftheapocalypse')}
            >
              <span className={styles.tierIcon}>🏇</span> 종말의 기수
            </button>
            <button
              className={`${styles.tierTab} ${selectedTier === 'deathbringer' ? styles.active : ''}`}
              onClick={() => setSelectedTier('deathbringer')}
            >
              <span className={styles.tierIcon}>⚔️</span> 죽음인도자
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'deathbringer' ? '#8B0000' : '#4ECDC4'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'deathbringer'
                ? 'linear-gradient(135deg, rgba(139, 0, 0, 0.1), rgba(196, 30, 58, 0.05))'
                : 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'deathbringer'
                ? '1px solid rgba(139, 0, 0, 0.3)'
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
            border: selectedTier === 'deathbringer'
              ? '1px solid rgba(139, 0, 0, 0.3)'
              : '1px solid rgba(78, 205, 196, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'deathbringer' ? '#8B0000' : '#4ECDC4'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'deathbringer' ? (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#C41E3A' }}>죽음인도자</strong>는 {' '}
                  <strong style={{ color: '#8B0000' }}>치명적인 피의 일격</strong>으로 {' '}
                  <strong style={{ color: '#ffa500' }}>강력한 단일 대상 딜</strong>을 제공합니다.
                  피해와 생존력을 동시에 강화하는 특성입니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#FF8C42', fontSize: '1.1rem', marginBottom: '15px' }}>
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                  </ul>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#3FC6EA', fontSize: '1.1rem', marginBottom: '15px' }}>
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>레이드 단일 대상과 보스 버스트 구간에서 최고 성능</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#64B5F6' }}>종말의 기수</strong>는 {' '}
                  <strong style={{ color: '#ffa500' }}>쐐기돌 던전과 이동 중 딜에서 탁월한 성능</strong>을 제공합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#64B5F6', fontSize: '1.1rem', marginBottom: '15px' }}>
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#3FC6EA' }}>재사용 대기시간:</strong> 없음 (즉시 시전)
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>이동 중 사용:</strong> 즉시 시전으로 이동 중에도 딜 가능
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#3FC6EA', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('냉정')} - 버스트 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>재사용 대기시간:</strong> 60초
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                    </li>
                    <li>
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
              <p style={{ color: selectedTier === 'deathbringer' ? '#3FC6EA' : '#4ECDC4', fontSize: '0.95rem', margin: 0 }}>
                <strong>💡 추천 콘텐츠:</strong> {' '}
                {selectedTier === 'deathbringer' ?
                  '단일 보스 레이드, 버스트 딜이 중요한 전투' :
                  '쐐기돌 던전, 광역 딜이 필요한 레이드 구간'}
              </p>
            </div>
          </div>

          {/* 단일 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-single']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'deathbringer' ? '#3FC6EA' : '#4ECDC4',
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
                {selectedTier === 'deathbringer' ?
              </p>
              <div className={styles.skillSequence}>
                {currentContent.singleTarget.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              {selectedTier === 'deathbringer' && (
                <p style={{ fontSize: '0.85rem', color: '#3FC6EA', marginTop: '8px' }}>
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
              color: selectedTier === 'deathbringer' ? '#9482C9' : '#32CD32',
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
              {selectedTier === 'deathbringer' && (
                <p style={{ fontSize: '0.85rem', color: '#3FC6EA', marginTop: '8px' }}>
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
              color: selectedTier === 'deathbringer' ? '#9482C9' : '#32CD32',
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

            {selectedTier === 'deathbringer' && (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 룬 마력 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> 죽음인도자의 전체 플레이스타일은 룬 마력과 룬을 효율적으로 관리하는 것
                    </li>
                    <li>
                      <strong>소비 방법:</strong> <SkillIcon skill={skillData.breathofthe} textOnly={true} />과 <SkillIcon skill={skillData.obliterate} textOnly={true} />을 통해 소비
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>최적화:</strong> 룬 마력 충전 후 버스트 윈도우에서 집중 소비
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 <SkillIcon skill={skillData.breathofthe} textOnly={true} /> + <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 동기화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 원칙:</strong> <SkillIcon skill={skillData.froststr} textOnly={true} />가 대상에 적중하기 전에 <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 시전
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong>쿨다운 정렬:</strong> <SkillIcon skill={skillData.mindfreeze} textOnly={true} />를 <SkillIcon skill={skillData.remorselesswinter} textOnly={true} /> 종료 후 사용하여 쿨다운 12초 감소
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💥 <SkillIcon skill={skillData.killingmachine} textOnly={true} />/<SkillIcon skill={skillData.frostfever} textOnly={true} /> 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>우선순위 1:</strong> <SkillIcon skill={skillData.killingmachine} textOnly={true} /> 3중첩 시 즉시 <SkillIcon skill={skillData.howlingblast} textOnly={true} /> 사용
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}><SkillIcon skill={skillData.rimestrike} textOnly={true} />/<SkillIcon skill={skillData.frostfever} textOnly={true} />:</strong> 버프 만료 직전 <SkillIcon skill={skillData.froststr} textOnly={true} /> 시전
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}><SkillIcon skill={skillData.frostfever} textOnly={true} /> 없을 때:</strong> <SkillIcon skill={skillData.killingmachine} textOnly={true} /> 즉시 소비 (버프 낭비 방지)
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.frostscythe} textOnly={true} /> 활성화:</strong> <SkillIcon skill={skillData.obliterate} textOnly={true} /> 우선 시전
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚔️ <SkillIcon skill={skillData.howlingblast} textOnly={true} /> 클리핑 기술 (고급)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>클리핑 개념:</strong> <SkillIcon skill={skillData.howlingblast} textOnly={true} /> 채널을 일부러 중단하여 효율 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 규칙:</strong> <SkillIcon skill={skillData.gatheringstorm} textOnly={true} />로 강화된 <SkillIcon skill={skillData.howlingblast} textOnly={true} /> 제외하고 모두 클리핑
                    </li>
                    <li>
                      <strong>클리핑 타이밍:</strong> 주문 틱(tick)에서 중단 - 버프 유지 우선, 순수 피해는 후순위
                    </li>
                    <li>
                      <strong>효율성:</strong> 클리핑을 통해 전역 쿨다운 최적화 및 버프 윈도우 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>에테르 조율 강화:</strong> <SkillIcon skill={skillData.gatheringstorm} textOnly={true} /> 버프 시 신비한 화살을(를) 끝까지 시전 - 15% 추가 피해 활용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🌪️ 7-10 분할 타격 광역 기술 (쐐기 전용)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>기술 개요:</strong> 8+ 대상 상황에서 <SkillIcon skill={skillData.glacialadvance} textOnly={true} /> 및 <SkillIcon skill={skillData.froststr} textOnly={true} /> 피해 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>실행 방법:</strong> <SkillIcon skill={skillData.froststr} textOnly={true} />를 <SkillIcon skill={skillData.glacialadvance} textOnly={true} />가 모든 대상에 완전히 적중하기 전에 시전
                    </li>
                    <li>
                      <strong>요구사항:</strong> 정확한 포지셔닝 + 타이밍 - 고급 기술
                    </li>
                    <li>
                      <strong>광역 우선순위:</strong> <SkillIcon skill={skillData.frostnova} textOnly={true} /> (0-1 충전물) → <SkillIcon skill={skillData.glacialadvance} textOnly={true} /> → <SkillIcon skill={skillData.froststr} textOnly={true} /> (4 충전물)
                    </li>
                    <li>
                      <strong>대상 수 제한:</strong> 일부 스킬은 대상 수 제한 있음 - 효율적 대상 선택 필요
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                  </h4>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid rgba(255, 152, 0, 0.3)'
                  }}>
                    <p style={{ fontSize: '0.9rem', color: '#ffa500', marginBottom: '12px', fontWeight: 'bold' }}>
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
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6347', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 <SkillIcon skill={skillData.frostscythe} textOnly={true} /> → <SkillIcon skill={skillData.remorselesswinter} textOnly={true} /> 버프 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> <SkillIcon skill={skillData.breathofthe} textOnly={true} /> 시전 시 15% 확률로 <SkillIcon skill={skillData.remorselesswinter} textOnly={true} /> 버프 부여
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong style={{ color: '#dc3545' }}>최우선 순위 (핵심!):</strong> <SkillIcon skill={skillData.remorselesswinter} textOnly={true} /> 마지막 GCD에 <SkillIcon skill={skillData.froststr} textOnly={true} /> 시전
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong>우선순위 3:</strong> <SkillIcon skill={skillData.froststr} textOnly={true} /> 반복 시전
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버프 종료 후:</strong> <SkillIcon skill={skillData.mindfreeze} textOnly={true} />로 쿨다운 12초 감소 → 빠른 재사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff1493', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ✨ <SkillIcon skill={skillData.frostfever} textOnly={true} /> 중첩 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong>빠른 4중첩:</strong> <SkillIcon skill={skillData.frostscythe} textOnly={true} /> → <SkillIcon skill={skillData.breathofthe} textOnly={true} /> → <SkillIcon skill={skillData.obliterate} textOnly={true} /> 4회 → 4중첩 완성
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버스트 극대화:</strong> 4중첩 상태에서 <SkillIcon skill={skillData.froststr} textOnly={true} /> 시전 → 폭발 피해 16% 증가
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#4169e1', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 메아리 타이밍 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 버프 시 <SkillIcon skill={skillData.obliterate} textOnly={true} />이 70% 피해로 메아리 (단일/광역 모두 강력)
                    </li>
                    <li>
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>우선순위:</strong> <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 활성 시 즉시 <SkillIcon skill={skillData.obliterate} textOnly={true} /> 시전 (다른 주문보다 우선)
                    </li>
                    <li>
                      <strong>버스트 윈도우:</strong> <SkillIcon skill={skillData.breathofthe} textOnly={true} /> + <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 활성 시 <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 프록 극대화
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
                    </li>
                    <li>
                      <strong>활용 상황:</strong> 보스/정예몹 강화 버프 제거 + 자신에게 부여 (예: 광폭화, 공속 버프)
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}><SkillIcon skill={skillData.antimagiczone} textOnly={true} /> (집단 보호막):</strong> 2분 쿨 - 파티원 10미터 내 피해 흡수 (15초 지속)
                    </li>
                    <li>
                      <strong>사용 타이밍:</strong> 광역 피해 메커니즘 직전 (폭발, 스웜, 장판 등)
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.deathsadvance} textOnly={true} /> 활용:</strong> 20미터 순간이동 - 시전 중에도 사용 가능 (장판 회피 + 딜 유지)
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>고급 기술:</strong> <SkillIcon skill={skillData.spellsteal} textOnly={true} />로 훔친 버프를 <SkillIcon skill={skillData.breathofthe} textOnly={true} /> 버스트에 활용
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>공통 생존 메커니즘</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>
                  <SkillIcon skill={skillData.frostscythe} textOnly={true} /> (얼음장) - 6초간 받는 모든 피해 70% 감소 (저체온증으로 30초 재사용 불가)
                </li>
                <li>
                  <SkillIcon skill={skillData.iceboundfort} textOnly={true} /> - 3초에 걸쳐 투명화, 적의 대상 해제 (20초 지속, 3분 쿨)
                </li>
                <li>
                  <SkillIcon skill={skillData.deathsadvance} textOnly={true} /> - 20미터 순간이동, 전역 쿨 무시 + 시전 중에도 사용 가능
                </li>
                <li>
                  <strong style={{ color: '#ffa500' }}>파티 유틸:</strong> <SkillIcon skill={skillData.bloodtap} textOnly={true} /> - 파티/공격대 전체 지능 3% 증가 (1시간 지속)
                </li>
              </ul>
            </div>

            {/* 실전 팁 */}
            <div style={{ marginTop: '30px' }}>
              <h4 style={{
                color: selectedTier === 'deathbringer' ? '#9482C9' : '#32CD32',
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
                  {selectedTier === 'deathbringer' && (
                    <>
                    </>
                  )}
                  {selectedTier === 'rideroftheapocalypse' && (
                    <>
                      • <strong style={{ color: '#ff6b6b' }}>냉정 미활용:</strong> {renderTextWithSkillIcons('이동 중 냉정 사용 누락 → 기동성 손실')}<br/>
                    </>
                  )}
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
                  {selectedTier === 'deathbringer' && (
                    <>
                    </>
                  )}
                  {selectedTier === 'rideroftheapocalypse' && (
                    <>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  const talentBuilds = {
    deathbringer: {  // 죽음인도자 (Deathbringer)
      'raid-single': {
        name: '레이드 단일 대상',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASkkkEJSSiEJJhEJSA',  // Deathbringer 레이드 단일
        icon: '⚔️'
      },
      'raid-aoe': {
        name: '레이드 광역',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASkkkEJSSiEJJhEJSA',  // Deathbringer 레이드 광역
        icon: '⚔️'
      },
      'mythic-plus': {
        name: '쐐기돌',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASkkSSJSSiEJJhkESA',  // Deathbringer 쐐기돌
        icon: '⚔️'
      }
    },
    rideroftheapocalypse: {  // 종말의 기수 (Rider of the Apocalypse)
      'raid-single': {
        name: '레이드 단일 대상',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSSSkESSCJJhEJSA',  // Rider of the Apocalypse 레이드 단일
        icon: '✨'
      },
      'raid-aoe': {
        name: '레이드 광역',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSSkkkESSCJJhEJSA',  // Rider of the Apocalypse 레이드 광역
        icon: '✨'
      },
      'mythic-plus': {
        name: '쐐기돌',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSkkSkESSCJJhkESA',  // Rider of the Apocalypse 쐐기돌
        icon: '✨'
      }
    }
  };

  const handleCopyBuild = (code) => {
    copyToClipboard(code);  // ✅ useCopyToClipboard hook 사용 (자동으로 triggerCopyToast 호출)
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
          <button
            onClick={() => {
              setSelectedTier('deathbringer');
              setSelectedBuild('mythic-plus');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'deathbringer' ?
                'linear-gradient(135deg, #8B0000 0%, #5a0000 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'deathbringer' ? '#C41E3A' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'deathbringer' ? '#C41E3A' : '#94a3b8',
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
            <span style={{ fontSize: '1.5rem' }}>⚔️</span>
            <span>죽음인도자</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>쐐기 추천</span>
          </button>

          <button
            onClick={() => {
              setSelectedTier('rideroftheapocalypse');
              setSelectedBuild('raid-single');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'rideroftheapocalypse' ?
                'linear-gradient(135deg, #2a7a46 0%, #1a3a26 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'rideroftheapocalypse' ? '#32CD32' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'rideroftheapocalypse' ? '#32CD32' : '#94a3b8',
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
            <span>종말의 기수</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>레이드 추천</span>
          </button>
        </div>

        {/* 빌드 선택 버튼들 */}
        <div style={{ padding: '20px' }}>
          <h4 style={{
            color: selectedTier === 'deathbringer' ? '#8B0000' : '#4ECDC4',
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            {selectedTier === 'deathbringer' ? '죽음인도자' : '종말의 기수'} 특성 빌드
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
        
              ],
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
            },
            mastery: {
              breakpoints: [],
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
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
            },
            mastery: {
              breakpoints: [],
            },
            versatility: {
              breakpoints: [],
              note: '안정적인 피해 증가 옵션'
            }
          }
        },
        rideroftheapocalypse: {  // 종말의 기수 (Rider of the Apocalypse)
          single: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#3FC6EA', priority: 'high' }
              ],
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
            },
            mastery: {
              breakpoints: [],
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
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
            },
            mastery: {
              breakpoints: [],
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

    const statPriorities = {
      
      rideroftheapocalypse: {  // 종말의 기수 (Rider of the Apocalypse)
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
              onClick={() => setSelectedStatHero('deathbringer')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'deathbringer' ?
                  'linear-gradient(135deg, #8B6B47 0%, #5a4a2a 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'deathbringer' ? '#3FC6EA' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'deathbringer' ? '#3FC6EA' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ⚔️ 죽음인도자
            </button>
            <button
              onClick={() => setSelectedStatHero('rideroftheapocalypse')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'rideroftheapocalypse' ?
                  'linear-gradient(135deg, #2a7a8a 0%, #1a4a5a 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'rideroftheapocalypse' ? '#4ECDC4' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'rideroftheapocalypse' ? '#4ECDC4' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ✨ 종말의 기수
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
              color: selectedStatHero === 'deathbringer' ? '#3FC6EA' : '#4ECDC4',
              fontSize: '1.3rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{selectedStatHero === 'deathbringer' ? '⚔️' : '✨'}</span>
              <span>{selectedStatHero === 'deathbringer' ? '죽음인도자' : '종말의 기수'}</span>
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
                  ((selectedStatHero === 'deathbringer' && selectedStatMode === 'single' && index === 2) ||
                   (selectedStatHero === 'rideroftheapocalypse' && index === 4));

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

export default FrostDeathKnightGuide;