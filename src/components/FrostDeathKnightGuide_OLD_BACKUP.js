import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase.js';
import { frostDeathKnightSkills as skillData } from '../data/frostDeathKnightSkillData.js';
import styles from './DevastationEvokerGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus.js';
import aiFeedbackService from '../services/AIFeedbackService.js';
import externalGuideCollector from '../services/ExternalGuideCollector.js';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater.js';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer.js';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons.js';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// Guide 페이지의 통일된 테마 (Frost Death Knight 가이드 레이아웃)
const unifiedTheme = {
  colors: {
    primary: '#C41E3A',      // 죽음의 기사 클래스 색상 (냉기 적색)
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#3FC6EA',       // 냉기 청색 액센트
    border: '#2a2a3e',
    hover: 'rgba(196, 30, 58, 0.1)',
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
    if (props.heroType === 'deathbringer') {
      return 'linear-gradient(135deg, rgba(63, 198, 234, 0.05), rgba(255, 107, 107, 0.05))';
    } else if (props.heroType === 'rideroftheapocalypse') {
      return 'linear-gradient(135deg, rgba(78, 205, 196, 0.05), rgba(93, 173, 226, 0.05))';
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'deathbringer') {
      return 'rgba(63, 198, 234, 0.3)';
    } else if (props.heroType === 'rideroftheapocalypse') {
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
      if (props.heroType === 'deathbringer') {
        return 'linear-gradient(90deg, #3FC6EA, #FF6B6B)';
      } else if (props.heroType === 'rideroftheapocalypse') {
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

// 영웅특성별 콘텐츠 생성 함수 (SkillIcon 컴포넌트 사용을 위해 함수로 변경)
// 영웅특성별 콘텐츠 생성 함수 (SkillIcon 컴포넌트 사용을 위해 함수로 변경)
const getHeroContent = (SkillIcon) => ({
  deathbringer: {
    name: '죽음인도자',
    icon: '⚔️',
    tierSet: {
      '2set': '냉기 강타 또는 절멸 사용 시 10% 확률로 룬 강화 - 다음 룬 마력 소모 스킬의 피해가 25% 증가하고 룬 마력 소모량이 10만큼 감소합니다.',
      '4set': '룬 강화 효과 발동 시 냉기의 순환 중첩을 1개 얻습니다. 냉기의 순환이 10중첩에 도달하면 모든 중첩이 소모되어 12초 동안 룬 마력 생성량이 20% 증가합니다.'
    },
    singleTarget: {
      opener: [
        skillData.pillarofFrost,        // 냉기의 기둥 (주요 쿨다운)
        skillData.empowerRuneWeapon,    // 룬 무기 강화
        skillData.obliterate,            // 절멸 (룬 소모)
        skillData.obliterate,            // 절멸
        skillData.froststr,              // 냉기 강타 (룬 마력 소모)
        skillData.froststr,              // 냉기 강타
        skillData.howlingblast,          // 울부짖는 한파
        skillData.obliterate             // 절멸
      ],
      priority: [
        {
          skill: skillData.remorselessWinter,
          desc: '매정한 겨울 (쿨다운)',
          conditions: [
            '쿨다운 완료',
            '룬 마력 40+ 확보'
          ],
          priority: 0,
          why: '주요 광역 쿨다운 - 룬 마력이(가) 충분할 때 사용'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서리 열병)',
          conditions: [
            '서리 열병 없음',
            '서리 열병 만료 임박'
          ],
          priority: 1,
          why: '서리 열병 유지 필수 - 냉기 강타 피해 증폭'
        },
        {
          skill: skillData.pillarofFrost,
          desc: '냉기의 기둥 (버스트)',
          conditions: [
            '쿨다운 완료',
            '룬 2개 이상'
          ],
          priority: 2,
          why: '주요 쿨다운 - 룬 마력과 함께 버스트 윈도우 시작'
        },
        {
          skill: skillData.empowerRuneWeapon,
          desc: '룬 무기 강화 (룬 생성)',
          conditions: [
            '쿨다운 완료',
            '룬 3개 미만'
          ],
          priority: 3,
          why: '룬 마력 25 생성 + 모든 룬 즉시 재충전'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서릿발 발동)',
          conditions: [
            '서릿발 버프 있음'
          ],
          priority: 4,
          why: '서릿발 발동 시 룬 소모 없이 사용 가능'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (살육 기계 유지)',
          conditions: [
            '살육 기계 중첩 5 미만',
            '룬 2개 이상'
          ],
          priority: 5,
          why: '살육 기계 중첩 유지 - 냉기 강타 피해 증가'
        },
        {
          skill: skillData.froststr,
          desc: '냉기 강타 (룬 마력 소모)',
          conditions: [
            '룬 마력 25 이상',
            '살육 기계 5중첩'
          ],
          priority: 6,
          why: '룬 마력 주요 소모처 - 살육 기계 최대 중첩 시 강력'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (룬 소모)',
          conditions: [
            '룬 4개 이상'
          ],
          priority: 7,
          why: '룬 낭비 방지 - 재충전 시간 활용'
        },
        {
          skill: skillData.froststr,
          desc: '냉기 강타 (필러)',
          conditions: [
            '룬 마력 40 이상'
          ],
          priority: 8,
          why: '룬 마력 넘침 방지'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (필러)',
          conditions: [
            '다른 스킬 대기 중'
          ],
          priority: 9,
          why: '룬 마력 생성 + 서리 열병 유지'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.remorselessWinter,    // 매정한 겨울
        skillData.pillarofFrost,        // 냉기의 기둥
        skillData.empowerRuneWeapon,    // 룬 무기 강화
        skillData.howlingblast,          // 울부짖는 한파
        skillData.frostscythe,           // 냉기 낫 (광역)
        skillData.frostscythe,           // 냉기 낫
        skillData.obliterate,            // 절멸
        skillData.froststr               // 냉기 강타
      ],
      priority: [
        {
          skill: skillData.remorselessWinter,
          desc: '매정한 겨울 (광역 최우선)',
          conditions: [
            '3+ 적',
            '쿨다운 완료'
          ],
          priority: 0,
          why: '광역 주요 쿨다운 - 지속 피해 + 슬로우'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서리 열병)',
          conditions: [
            '3+ 적',
            '서리 열병 없음'
          ],
          priority: 1,
          why: '광역 서리 열병 전파 필수'
        },
        {
          skill: skillData.frostscythe,
          desc: '냉기 낫 (광역 주력)',
          conditions: [
            '3+ 적',
            '살육 기계 5중첩'
          ],
          priority: 2,
          why: '광역 룬 소모 주력 스킬'
        },
        {
          skill: skillData.glacialadvance,
          desc: '빙하 진군 (룬 마력 광역)',
          conditions: [
            '3+ 적',
            '룬 마력 30 이상'
          ],
          priority: 3,
          why: '광역 룬 마력 소모 + 칼날얼음 중첩'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서릿발)',
          conditions: [
            '서릿발 발동',
            '3+ 적'
          ],
          priority: 4,
          why: '서릿발 발동 시 룬 무료 사용'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (살육 기계)',
          conditions: [
            '3+ 적',
            '살육 기계 5 미만'
          ],
          priority: 5,
          why: '광역에서도 살육 기계 유지'
        }
      ]
    },
    mechanics: [
      {
        title: '살육 기계',
        icon: '⚙️',
        desc: '절멸 사용 시 중첩 생성 - 냉기 강타 피해 증가',
        details: [
          '절멸 1회 사용 시 살육 기계 1중첩 생성',
          '최대 5중첩 - 중첩당 냉기 강타 피해 10% 증가',
          '5중첩 달성 후 냉기 강타로 소모'
        ],
        why: '죽음인도자 핵심 - 절멸 → 냉기 강타 사이클'
      },
      {
        title: '서릿발 (Rime)',
        icon: '❄️',
        desc: '절멸 사용 시 45% 확률로 발동 - 무료 울부짖는 한파',
        details: [
          '발동: 절멸 사용 시 45% 확률',
          '효과: 다음 울부짖는 한파 룬 소모 없음',
          '지속시간: 15초 - 발동 시 즉시 사용 권장'
        ]
      },
      {
        title: '냉기의 순환 (T32 4세트)',
        icon: '🔄',
        desc: '룬 강화 발동 시 중첩 획득 - 10중첩 시 룬 마력 생성 20% 증가',
        details: [
          '룬 강화(T32 2세트): 10% 확률 발동',
          '냉기의 순환: 룬 강화 발동 시 1중첩 획득',
          '10중첩 도달: 12초 동안 룬 마력 생성 20% 증가'
        ]
      }
    ]
  },
  rideroftheapocalypse: {
    name: '종말의 기수',
    icon: '🏇',
    tierSet: {
      '2set': '냉기 강타 또는 절멸 사용 시 10% 확률로 룬 강화 - 다음 룬 마력 소모 스킬의 피해가 25% 증가하고 룬 마력 소모량이 10만큼 감소합니다.',
      '4set': '룬 강화 효과 발동 시 냉기의 순환 중첩을 1개 얻습니다. 냉기의 순환이 10중첩에 도달하면 모든 중첩이 소모되어 12초 동안 룬 마력 생성량이 20% 증가합니다.'
    },
    singleTarget: {
      opener: [
        skillData.pillarofFrost,        // 냉기의 기둥
        skillData.apocalypse,            // 종말 (종말의 기수 전용)
        skillData.obliterate,            // 절멸
        skillData.obliterate,            // 절멸
        skillData.froststr,              // 냉기 강타
        skillData.froststr,              // 냉기 강타
        skillData.soulReaper,            // 영혼 수확자
        skillData.obliterate             // 절멸
      ],
      priority: [
        {
          skill: skillData.apocalypse,
          desc: '종말 (종말의 기수 쿨다운)',
          conditions: [
            '쿨다운 완료',
            '서리 열병 활성'
          ],
          priority: 0,
          why: '종말의 기수 핵심 - 네 기수 소환 + 막대한 피해'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서리 열병)',
          conditions: [
            '서리 열병 없음'
          ],
          priority: 1,
          why: '서리 열병 유지 - 종말 사용 전제조건'
        },
        {
          skill: skillData.pillarofFrost,
          desc: '냉기의 기둥 (버스트)',
          conditions: [
            '쿨다운 완료'
          ],
          priority: 2,
          why: '주요 쿨다운'
        },
        {
          skill: skillData.soulReaper,
          desc: '영혼 수확자 (처형기)',
          conditions: [
            '대상 생명력 35% 미만',
            '쿨다운 완료'
          ],
          priority: 3,
          why: '저체력 대상 처형 - 5초 후 폭발 피해'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (살육 기계)',
          conditions: [
            '살육 기계 5 미만'
          ],
          priority: 4,
          why: '살육 기계 중첩 쌓기'
        },
        {
          skill: skillData.froststr,
          desc: '냉기 강타 (주력)',
          conditions: [
            '살육 기계 5중첩',
            '룬 마력 25 이상'
          ],
          priority: 5,
          why: '룬 마력 소모 주력'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서릿발)',
          conditions: [
            '서릿발 발동'
          ],
          priority: 6,
          why: '서릿발 발동 시 무료 사용'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (룬 소모)',
          conditions: [
            '룬 4개 이상'
          ],
          priority: 7,
          why: '룬 낭비 방지'
        },
        {
          skill: skillData.froststr,
          desc: '냉기 강타 (필러)',
          conditions: [
            '룬 마력 40 이상'
          ],
          priority: 8,
          why: '룬 마력 소모'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.remorselessWinter,    // 매정한 겨울
        skillData.apocalypse,            // 종말
        skillData.pillarofFrost,        // 냉기의 기둥
        skillData.frostscythe,           // 냉기 낫
        skillData.frostscythe,           // 냉기 낫
        skillData.glacialadvance,        // 빙하 진군
        skillData.froststr               // 냉기 강타
      ],
      priority: [
        {
          skill: skillData.apocalypse,
          desc: '종말 (광역)',
          conditions: [
            '3+ 적',
            '쿨다운 완료'
          ],
          priority: 0,
          why: '종말의 기수 핵심 - 네 기수 광역 피해'
        },
        {
          skill: skillData.remorselessWinter,
          desc: '매정한 겨울 (광역)',
          conditions: [
            '3+ 적'
          ],
          priority: 1,
          why: '광역 주요 쿨다운'
        },
        {
          skill: skillData.frostscythe,
          desc: '냉기 낫 (광역 주력)',
          conditions: [
            '3+ 적',
            '살육 기계 5중첩'
          ],
          priority: 2,
          why: '광역 룬 소모'
        },
        {
          skill: skillData.glacialadvance,
          desc: '빙하 진군 (광역)',
          conditions: [
            '3+ 적',
            '룬 마력 30 이상'
          ],
          priority: 3,
          why: '광역 룬 마력 소모'
        }
      ]
    },
    mechanics: [
      {
        title: '종말 (Apocalypse)',
        icon: '💀',
        desc: '네 기수 소환 - 대상에게 폭발적 피해 + 네 기수의 지속 피해',
        details: [
          '재사용 대기시간: 90초 (주요 쿨다운)',
          '효과: 대상의 서리 열병 1초당 1중첩 터뜨려 즉시 피해',
          '네 기수 소환: 20초간 전투 지원 + 추가 피해'
        ],
        why: '종말의 기수 핵심 - 서리 열병 활성 상태에서 사용 필수'
      },
      {
        title: '네 기수',
        icon: '🐴',
        desc: '종말 사용 시 소환 - 전쟁/기근/죽음/역병 기수가 20초간 전투 지원',
        details: [
          '전쟁의 기수: 물리 피해',
          '기근의 기수: 생명력 흡수',
          '죽음의 기수: 암흑 피해',
          '역병의 기수: 서리 열병 확산'
        ]
      },
      {
        title: '영혼 수확자',
        icon: '💀',
        desc: '저체력(35% 미만) 대상 처형 - 5초 후 폭발 피해',
        details: [
          '사용 조건: 대상 생명력 35% 미만',
          '즉시 피해 + 5초 후 폭발 피해 (대상 최대 생명력의 %)',
          '재사용 대기시간: 6초'
        ]
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
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [selectedTier, setSelectedTier] = useState('deathbringer');
  const [showToast, setShowToast] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('raid-single');
  const [selectedStatHero, setSelectedStatHero] = useState('deathbringer');
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

    // 스킬명 자동 매칭: skillData 객체의 koreanName으로 자동 매핑
    const skillNameMap = {};

    // skillData에서 모든 스킬의 koreanName 추출하여 매핑 생성
    Object.values(skillData).forEach(skill => {
      if (skill && skill.koreanName) {
        skillNameMap[skill.koreanName] = skill;
      }
    });

    // 빈 맵 체크: 스킬이 없으면 원본 텍스트 반환 (무한 루프 방지)
    if (Object.keys(skillNameMap).length === 0) {
      return text;
    }

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
          <h3 className={styles.subsectionTitle}>냉기 죽음의 기사 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            냉기 죽음의 기사는 <strong style={{ color: '#C41E3A' }}>룬(Runes)과 룬 마력(Runic Power)을 효율적으로 관리하여 강력한 냉기 피해를 입히는</strong> 근접 DPS 전문화입니다.
            TWW 시즌 3 현재 레이드와 쐐기돌 모두에서 <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>죽음인도자(Deathbringer)</span>가 주류 빌드이며,
            <SkillIcon skill={skillData.obliterate} textOnly={true} />로 살육 기계(Killing Machine) 중첩을 쌓아 <SkillIcon skill={skillData.froststr} textOnly={true} /> 치명타를 극대화하는 것이 핵심입니다.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            서릿발(Rime) 프록 발동 시 <SkillIcon skill={skillData.howlingblast} textOnly={true} />를 즉시 시전하고,
            <SkillIcon skill={skillData.pillarofFrost} textOnly={true} />와 <SkillIcon skill={skillData.empowerRuneWeapon} textOnly={true} />로 버스트 윈도우를 열어
            룬 마력 자원을 극대화한 후 <SkillIcon skill={skillData.froststr} textOnly={true} />로 집중 딜링을 펼칩니다.
            룬 재충전 사이클과 룬 마력 생성 효율을 이해하는 것이 높은 DPS의 핵심입니다.
          </p>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {[
              { skill: skillData.obliterate, label: '룬 마력 생성' },
              { skill: skillData.froststr, label: '룬 마력 소모' },
              { skill: skillData.howlingblast, label: '서릿발 소비' },
              { skill: skillData.pillarofFrost, label: '버스트 쿨다운' },
              { skill: skillData.empowerRuneWeapon, label: '룬 재충전' },
              { skill: skillData.remorselessWinter, label: '광역 쿨다운' }
            ].map(({ skill, label }) => (
              <div key={skill?.id || Math.random()} style={{
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
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, color: label.includes('생성') ? '#32CD32' : label.includes('소모') ? '#FF6B6B' : '#ffa500' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          <h4 ref={subSectionRefs['overview-resource']} style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>리소스 시스템</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li>주 자원: <span style={{ color: '#C41E3A', fontWeight: 'bold' }}>룬 (Runes)</span> (최대 6개, 개별 재충전 10초, 전투 이탈 시 유지)</li>
            <li>보조 자원: <span style={{ color: '#3FC6EA', fontWeight: 'bold' }}>룬 마력 (Runic Power)</span> (최대 100, 전투 이탈 시 유지)</li>
            <li>룬 소모 및 룬 마력 생성:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.obliterate} textOnly={true} /> - 룬 2개 소모 → 룬 마력 15 생성 (살육 기계 1중첩 획득)</li>
                <li><SkillIcon skill={skillData.howlingblast} textOnly={true} /> - 룬 1개 소모 → 룬 마력 10 생성 (광역 서리 열병 적용)</li>
                <li><SkillIcon skill={skillData.frostscythe} textOnly={true} /> - 룬 1개 소모 → 룬 마력 12 생성 (광역 전용)</li>
              </ul>
            </li>
            <li>룬 마력 소모:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.froststr} textOnly={true} /> - 룬 마력 25 소모 (주력 딜 스킬, 살육 기계 중첩으로 치명타 보장)</li>
              </ul>
            </li>
            <li><strong style={{ color: '#ffa500' }}>핵심 전략:</strong> 룬 재충전 낭비 방지 → <SkillIcon skill={skillData.obliterate} textOnly={true} />로 살육 기계 최대 2중첩 유지 → <SkillIcon skill={skillData.froststr} textOnly={true} /> 치명타 극대화</li>
            <li><strong style={{ color: '#ff6b6b' }}>주의:</strong> 룬이 6개 가득 차면 재충전이 멈추므로 적시에 소모 필수 (버스트 윈도우 외에는 항상 소모 상태 유지)</li>
          </ul>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginTop: '25px', marginBottom: '15px' }}>주요 메커니즘</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li><strong style={{ color: '#C41E3A' }}>살육 기계 (Killing Machine):</strong> <SkillIcon skill={skillData.obliterate} textOnly={true} /> 또는 <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 사용 시 확률로 발동, 최대 2중첩 보유 가능. 다음 <SkillIcon skill={skillData.froststr} textOnly={true} />가 100% 치명타 보장 (중첩당 1회 소모)</li>
            <li><strong style={{ color: '#3FC6EA' }}>서릿발 (Rime):</strong> <SkillIcon skill={skillData.obliterate} textOnly={true} /> 또는 <SkillIcon skill={skillData.frostscythe} textOnly={true} /> 시전 시 45% 확률 발동, 다음 <SkillIcon skill={skillData.howlingblast} textOnly={true} /> 룬 소모 없이 즉시 시전 가능 (광역 상황 필수 사용)</li>
            <li><strong style={{ color: '#ffa500' }}>얼음 기둥 (Pillar of Frost):</strong> 12초간 힘 +30%, 룬 마력 생성 증가. 주요 버스트 윈도우의 시작점이며 <SkillIcon skill={skillData.empowerRuneWeapon} textOnly={true} />와 함께 사용</li>
            <li><strong style={{ color: '#FFD700' }}>버스트 윈도우 전략:</strong> <SkillIcon skill={skillData.pillarofFrost} textOnly={true} /> → <SkillIcon skill={skillData.empowerRuneWeapon} textOnly={true} /> → 모든 룬 재충전 → <SkillIcon skill={skillData.obliterate} textOnly={true} /> 연타로 살육 기계 2중첩 확보 → <SkillIcon skill={skillData.froststr} textOnly={true} /> 치명타 폭발</li>
            <li><strong style={{ color: '#32CD32' }}>영웅 특성별 차이:</strong> 죽음인도자는 룬 파쇄자(Reaper's Mark) 시스템으로 폭발적 순간 버스트 집중, 종말의 기수는 네 기수(Four Horsemen) 소환으로 지속 딜과 유틸리티 강화</li>
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
              className={`${styles.tierTab} ${selectedTier === 'deathbringer' ? styles.active : ''}`}
              onClick={() => setSelectedTier('deathbringer')}
            >
              <span className={styles.tierIcon}>☀️</span> 죽음인도자
            </button>
            <button
              className={`${styles.tierTab} ${selectedTier === 'rideroftheapocalypse' ? styles.active : ''}`}
              onClick={() => setSelectedTier('rideroftheapocalypse')}
            >
              <span className={styles.tierIcon}>🔮</span> 종말의 기수
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'deathbringer' ? '#3FC6EA' : '#4ECDC4'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'deathbringer'
                ? 'linear-gradient(135deg, rgba(63, 198, 234, 0.1), rgba(63, 198, 234, 0.05))'
                : 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'deathbringer'
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
            border: selectedTier === 'deathbringer'
              ? '1px solid rgba(63, 198, 234, 0.3)'
              : '1px solid rgba(78, 205, 196, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'deathbringer' ? '#3FC6EA' : '#4ECDC4'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'deathbringer' ? (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#FF8C42' }}>죽음인도자</strong>는 {' '}
                  <strong style={{ color: '#3FC6EA' }}>룬 강화</strong>를 통한 {' '}
                  <strong style={{ color: '#ffa500' }}>룬 마력 효율화와 냉기의 순환 중첩 관리</strong>로 {' '}
                  <strong style={{ color: '#FFD700' }}>레이드 보스전에서 최고의 성능</strong>을 제공합니다.
                  티어 세트와 결합 시 룬 강화 proc 확률 증가로 냉기의 순환 10중첩을 빠르게 달성하여
                  12초간 룬 마력 생성량 20% 증가 버프를 유지할 수 있습니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#FF8C42', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {renderTextWithSkillIcons('절멸')} / {renderTextWithSkillIcons('냉기 강타')} - 핵심 피해 스킬
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li><strong style={{ color: '#3FC6EA' }}>룬 소모:</strong> {renderTextWithSkillIcons('절멸')} 2개 룬, {renderTextWithSkillIcons('냉기 강타')} 룬 마력 25</li>
                    <li><strong style={{ color: '#ffa500' }}>티어 2세트:</strong> 10% 확률로 <strong>룬 강화</strong> proc - 다음 룬 마력 소모 스킬 피해 25% 증가, 룬 마력 소모 10 감소</li>
                    <li><strong style={{ color: '#FF8C42' }}>티어 4세트:</strong> 룬 강화 발동 시 <strong>냉기의 순환</strong> 중첩 1개 획득 (10중첩 → 12초간 룬 마력 생성 20% 증가)</li>
                    <li><strong style={{ color: '#FFD700' }}>연계:</strong> 룬 강화 proc → {renderTextWithSkillIcons('냉기 강타')} 25% 강화 피해 + 룬 마력 절약</li>
                  </ul>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    죽음인도자는 룬 강화 proc 관리가 핵심이며, 냉기의 순환 10중첩 달성 후 {' '}
                    {renderTextWithSkillIcons('냉기의 기둥')} + {renderTextWithSkillIcons('룬 무기 강화')} 버스트 윈도우에서 최대 딜을 발휘합니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#3FC6EA', fontSize: '1.1rem', marginBottom: '15px' }}>
                    냉기의 순환 - 버스트 타이밍
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>준비 단계:</strong> 룬 강화 proc 누적으로 냉기의 순환 8-9중첩 확보
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버프 효과:</strong> 10중첩 달성 시 12초간 룬 마력 생성량 20% 증가
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>피해 증폭:</strong> {renderTextWithSkillIcons('냉기의 기둥')} + {renderTextWithSkillIcons('룬 무기 강화')}와 함께 사용하여 버스트 극대화
                    </li>
                    <li>
                      <strong>장신구/물약 조합:</strong> 냉기의 순환 10중첩 + {renderTextWithSkillIcons('냉기의 기둥')} 활성화 중 모든 쿨기 사용
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 티어 2세트로 {renderTextWithSkillIcons('절멸')} / {renderTextWithSkillIcons('냉기 강타')} 사용 시 10% 확률로 룬 강화가 발동하므로
                    냉기의 순환 중첩을 빠르게 쌓아 버스트 윈도우를 자주 만들 수 있습니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#3FC6EA' }}>룬/룬 마력 관리:</strong> 룬 6개 충전 대기 + 룬 마력 100 유지로 버스트 준비
                    </li>
                    <li>
                      {renderTextWithSkillIcons('냉기의 기둥')} (30초 쿨) + {renderTextWithSkillIcons('룬 무기 강화')} (90초 쿨) 동기화가 핵심
                    </li>
                    <li>레이드 단일 대상과 보스 버스트 구간에서 최고 성능</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#64B5F6' }}>종말의 기수</strong>는 {' '}
                  <strong style={{ color: '#4ECDC4' }}>4기사 소환을 통한 협동 공격과 추가 AoE 피해</strong>로 {' '}
                  <strong style={{ color: '#ffa500' }}>쐐기돌 던전과 광역 전투에서 탁월한 성능</strong>을 제공합니다.
                  티어 세트 효과로 룬 강화 proc 시 냉기의 순환 중첩을 빠르게 쌓아
                  4기사의 협동 공격 빈도를 증가시킬 수 있습니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#64B5F6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    종말의 기수 소환 - 핵심 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#3FC6EA' }}>4기사 시스템:</strong> 전쟁, 기근, 죽음, 역병 기수가 순차적으로 소환되어 협동 공격
                    </li>
                    <li>
                      <strong style={{ color: '#64B5F6' }}>티어 2세트:</strong> 10% 확률로 <strong>룬 강화</strong> proc - 기수 소환 빈도 증가
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>티어 4세트:</strong> 룬 강화 발동 시 <strong>냉기의 순환</strong> 중첩 1개 획득
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>AoE 피해:</strong> 각 기수가 주변 적에게 추가 피해 (3+ 대상에서 강력)
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>지속 효과:</strong> 4기사가 활성화된 동안 지속적인 추가 피해
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: {renderTextWithSkillIcons('절멸')} / {renderTextWithSkillIcons('냉기 강타')} 사용 빈도가 높을수록 기수 소환이 자주 발생하여
                    쐐기돌 던전에서 지속적인 AoE 피해를 제공합니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#3FC6EA', fontSize: '1.1rem', marginBottom: '15px' }}>
                    AoE 최적화 전략
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>3+ 대상:</strong> {renderTextWithSkillIcons('울부짖는 한파')} + {renderTextWithSkillIcons('무자비한 겨울')} 우선순위 상승
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>서릿발 proc:</strong> {renderTextWithSkillIcons('절멸')} 사용 시 45% 확률로 무료 {renderTextWithSkillIcons('울부짖는 한파')} 즉시 소비
                    </li>
                    <li>
                      <strong style={{ color: '#64B5F6' }}>기수 연계:</strong> 4기사 소환 중 {renderTextWithSkillIcons('무자비한 겨울')} 사용으로 광역 피해 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>냉기의 기둥:</strong> 광역 전투 시작 시 사용하여 4기사 협동 공격과 동기화
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#3FC6EA' }}>쐐기돌 최적화:</strong> 지속적인 4기사 소환으로 광역 전투 유리
                    </li>
                    <li>
                      <strong style={{ color: '#64B5F6' }}>안정성:</strong> 기수 시스템이 자동으로 작동하여 플레이 부담 감소
                    </li>
                    <li>
                      {renderTextWithSkillIcons('무자비한 겨울')} 13초 쿨다운 → 자주 사용 가능
                    </li>
                    <li>쐐기돌 던전 광역 구간과 레이드 애드 처리에서 최고 성능</li>
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
                  renderTextWithSkillIcons('⏱️ 전투 10초 전: 룬 6개 모두 충전 완료 대기 → 룬 마력 100 확보 후 버스트 시작') :
                  renderTextWithSkillIcons('⏱️ 전투 직전: 룬 6개 충전 확인 → 4기사 소환 준비')}
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
                  💡 팁: 룬은 10초마다 1개씩 충전되므로 전투 시작 10초 전부터 대기하여 6개 풀충전 상태로 버스트 시작
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
                  💡 팁: 룬은 10초마다 1개씩 충전되므로 전투 시작 10초 전부터 대기하여 6개 풀충전 상태로 버스트 시작
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
                    ⚡ 살육 기계 5중첩 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> {renderTextWithSkillIcons('절멸')} 사용 시 일정 확률로 <strong>살육 기계</strong> proc 발동
                    </li>
                    <li>
                      <strong>중첩 쌓기:</strong> 살육 기계 proc 시 중첩 1개 획득, 최대 5중첩까지 누적 가능
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>5중첩 효과:</strong> 다음 {renderTextWithSkillIcons('냉기 강타')} 피해 <strong>50% 증가</strong>
                    </li>
                    <li>
                      <strong>최적 타이밍:</strong> 5중첩 달성 즉시 {renderTextWithSkillIcons('냉기 강타')} 사용하여 강화 피해 적용
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버스트 연계:</strong> {renderTextWithSkillIcons('냉기의 기둥')} 활성화 중 5중첩 {renderTextWithSkillIcons('냉기 강타')} 집중 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 {renderTextWithSkillIcons('냉기의 기둥')} + {renderTextWithSkillIcons('룬 무기 강화')} 동기화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>{renderTextWithSkillIcons('냉기의 기둥')}:</strong> 30초 쿨다운 - 힘 +20%, 공격 속도 +30%, 지속시간 12초
                    </li>
                    <li>
                      <strong>{renderTextWithSkillIcons('룬 무기 강화')}:</strong> 90초 쿨다운 - 모든 룬 즉시 충전 + 룬 충전 속도 +100% (10초간)
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 원칙:</strong> {renderTextWithSkillIcons('냉기의 기둥')} 활성화 후 즉시 {renderTextWithSkillIcons('룬 무기 강화')} 사용
                    </li>
                    <li>
                      <strong>버스트 순서:</strong> {renderTextWithSkillIcons('냉기의 기둥')} → {renderTextWithSkillIcons('룬 무기 강화')} → {renderTextWithSkillIcons('절멸')} + {renderTextWithSkillIcons('냉기 강타')} 집중 사용
                    </li>
                    <li>
                      <strong>룬 마력 관리:</strong> 버스트 시작 전 룬 마력 80-100 확보하여 {renderTextWithSkillIcons('냉기 강타')} 연타 가능하도록 준비
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💥 서릿발 proc 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> {renderTextWithSkillIcons('절멸')} 사용 시 <strong>45% 확률</strong>로 무료 {renderTextWithSkillIcons('울부짖는 한파')} proc 발동
                    </li>
                    <li>
                      <strong>단일 대상 전투:</strong> 서릿발 proc 발동 즉시 {renderTextWithSkillIcons('울부짖는 한파')} 사용
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>광역 전투 (2+ 대상):</strong> 서릿발 proc 저장 → <strong>3+ 대상 집결 시까지 대기</strong> → 최대 효율로 사용
                    </li>
                    <li>
                      <strong>주의사항:</strong> 서릿발 proc은 <strong>중첩되지 않음</strong> - 대기 중 추가 proc 발동 시 이전 proc 사라짐
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>최적 사용:</strong> 광역 상황에서도 15초 이상 대기 금지 - proc 낭비 방지
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚔️ 룬/룬 마력 풀링 전략 (고급)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>풀링 개념:</strong> {renderTextWithSkillIcons('냉기의 기둥')} 사용 직전 <strong>룬 6개 + 룬 마력 100</strong> 확보하여 버스트 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>룬 풀링:</strong> {renderTextWithSkillIcons('냉기의 기둥')} 쿨다운 5-10초 전부터 룬 사용 자제 → 6개 충전 완료 시 즉시 버스트
                    </li>
                    <li>
                      <strong>룬 마력 풀링:</strong> {renderTextWithSkillIcons('냉기 강타')} 사용 자제 → 룬 마력 80+ 유지 → 버스트 시 연속 시전
                    </li>
                    <li>
                      <strong>효율성:</strong> 풀링을 통해 {renderTextWithSkillIcons('냉기의 기둥')} 12초 동안 <strong>최대 DPS 집중</strong>
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>주의사항:</strong> 과도한 풀링으로 룬/룬 마력 낭비 금지 - <strong>쿨다운 10초 전</strong>부터만 풀링 시작
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🌪️ {renderTextWithSkillIcons('무자비한 겨울')} AoE 최적화 (쐐기 전용)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>기술 개요:</strong> 5+ 대상 상황에서 {renderTextWithSkillIcons('무자비한 겨울')} + {renderTextWithSkillIcons('울부짖는 한파')} 조합으로 광역 피해 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>실행 방법:</strong> {renderTextWithSkillIcons('무자비한 겨울')} 활성화 → 서릿발 proc 대기 → 대상 집결 시 {renderTextWithSkillIcons('울부짖는 한파')} 시전
                    </li>
                    <li>
                      <strong>요구사항:</strong> 정확한 포지셔닝 - 모든 대상이 8야드 범위 내 집결
                    </li>
                    <li>
                      <strong>광역 우선순위:</strong> {renderTextWithSkillIcons('무자비한 겨울')} → {renderTextWithSkillIcons('얼어붙은 망령')} → {renderTextWithSkillIcons('울부짖는 한파')} (서릿발) → {renderTextWithSkillIcons('절멸')}
                    </li>
                    <li>
                      <strong>주의사항:</strong> {renderTextWithSkillIcons('무자비한 겨울')} 지속시간 8초 - 버프 활성 중 최대 룬 마력 소비
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚠️ 냉기의 순환 10중첩 관리 (죽음인도자 특화)
                  </h4>

                  {/* 냉기의 순환 게이지 시각화 */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid rgba(99, 199, 255, 0.3)'
                  }}>
                    <p style={{ fontSize: '0.9rem', color: '#63C7FF', marginBottom: '12px', fontWeight: 'bold' }}>
                      📊 냉기의 순환 중첩 게이지 (T32 4세트)
                    </p>

                    {/* 게이지 바 */}
                    <div style={{
                      position: 'relative',
                      height: '40px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '2px solid rgba(99, 199, 255, 0.5)',
                      marginBottom: '15px'
                    }}>
                      {/* 초기 구간 (0-5 중첩) - 주황색 */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '50%',
                        background: 'linear-gradient(90deg, rgba(255, 152, 0, 0.3), rgba(255, 152, 0, 0.2))'
                      }} />

                      {/* 최적 구간 (6-10 중첩) - 청록색 */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        bottom: '0',
                        width: '50%',
                        background: 'linear-gradient(90deg, rgba(99, 199, 255, 0.4), rgba(64, 224, 208, 0.4))'
                      }} />

                      {/* 10중첩 표시선 */}
                      <div style={{
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        bottom: '0',
                        width: '3px',
                        background: '#FFD700',
                        boxShadow: '0 0 10px #FFD700'
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
                        <span>0 중첩</span>
                        <span style={{ color: '#ffa500' }}>5 중첩</span>
                        <span style={{ color: '#FFD700' }}>10 중첩</span>
                      </div>
                    </div>

                    {/* 구간별 설명 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(255, 152, 0, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 152, 0, 0.3)'
                      }}>
                        <strong style={{ color: '#ffa500' }}>0-5 중첩:</strong> <span style={{ color: '#ccc' }}>중첩 쌓기 단계</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(99, 199, 255, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(99, 199, 255, 0.3)'
                      }}>
                        <strong style={{ color: '#63C7FF' }}>6-10 중첩:</strong> <span style={{ color: '#ccc' }}>버프 대기 구간</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(255, 215, 0, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        gridColumn: 'span 2'
                      }}>
                        <strong style={{ color: '#FFD700' }}>10 중첩 달성:</strong> <span style={{ color: '#ccc' }}>룬 마력 생성량 20% 증가 (12초 지속)</span>
                      </div>
                    </div>
                  </div>

                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> 룬 강화 (10% proc) → 냉기의 순환 중첩 1개 획득 (최대 10중첩)
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>10중첩 효과:</strong> <strong>룬 마력 생성량 20% 증가</strong> (12초 지속) → {renderTextWithSkillIcons('냉기 강타')} 연타 가능
                    </li>
                    <li>
                      <strong>중첩 쌓기:</strong> {renderTextWithSkillIcons('절멸')}, {renderTextWithSkillIcons('냉기 강타')}, {renderTextWithSkillIcons('울부짖는 한파')} 사용 시 룬 강화 proc 기회
                    </li>
                    <li>
                      <strong>버프 활용:</strong> 10중첩 달성 시 {renderTextWithSkillIcons('냉기의 기둥')} 사용 → 12초간 최대 룬 마력 소비
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6347', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 {renderTextWithSkillIcons('어둠의 변신')} 타이밍 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> {renderTextWithSkillIcons('어둠의 변신')} 사용 시 <strong>힘 30% 증가</strong> + 룬 마력 소비 스킬 강화 (8초 지속)
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>최적 사용:</strong> {renderTextWithSkillIcons('냉기의 기둥')} 활성 중 + 살육 기계 5중첩 시 사용 → 버스트 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#dc3545' }}>주의사항:</strong> 어둠의 변신 8초 동안 <strong>모든 룬 마력 소비</strong> 필수 - 자원 낭비 방지
                    </li>
                    <li>
                      <strong>우선순위:</strong> {renderTextWithSkillIcons('냉기 강타')} (살육 기계) → {renderTextWithSkillIcons('서리 낫')} → {renderTextWithSkillIcons('냉기 강타')} 연타
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버스트 종료 후:</strong> {renderTextWithSkillIcons('절멸')}로 룬 재충전 + 살육 기계/서릿발 proc 확보
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff1493', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ✨ {renderTextWithSkillIcons('영혼 수확자')} 버프 관리 (죽음인도자)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>메커니즘:</strong> {renderTextWithSkillIcons('영혼 수확자')} 버프 획득 시 다음 {renderTextWithSkillIcons('절멸')} 피해 <strong>30% 증가</strong>
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>발동 조건:</strong> {renderTextWithSkillIcons('서리 낫')}, {renderTextWithSkillIcons('죽음의 일격')} 사용 시 일정 확률로 proc
                    </li>
                    <li>
                      <strong>우선순위:</strong> 영혼 수확자 proc 발동 시 즉시 {renderTextWithSkillIcons('절멸')} 사용 (다른 스킬보다 우선)
                    </li>
                    <li>
                      <strong>버프 유지:</strong> {renderTextWithSkillIcons('냉기의 기둥')} 활성 중에는 영혼 수확자 proc 저장하여 버스트 윈도우에 집중 사용
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>주의사항:</strong> 영혼 수확자 버프는 <strong>중첩되지 않음</strong> - proc 발동 즉시 사용 필요
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#4169e1', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 4기사 소환 최적화 (종말의 기수)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심 메커니즘:</strong> {renderTextWithSkillIcons('얼어붙은 망령')}, {renderTextWithSkillIcons('절멸')}, {renderTextWithSkillIcons('영혼 수확자')} 사용 시 <strong>4기사 중 1명 소환</strong>
                    </li>
                    <li>
                      <strong>소환 우선순위:</strong> 전쟁 (단일/광역 피해) → 역병 (AoE 도트) → 기근 (힐 감소) → 죽음 (공격 속도 감소)
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>최적 사용:</strong> 광역 전투 시작 전 4기사 모두 소환 → {renderTextWithSkillIcons('울부짖는 한파')} 연타로 협동 공격 극대화
                    </li>
                    <li>
                      <strong>버스트 윈도우:</strong> {renderTextWithSkillIcons('냉기의 기둥')} + 4기사 소환 완료 → 룬 마력 최대 소비
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>쐐기 활용:</strong> 각 기사의 AoE 효과로 5+ 대상 전투에서 최대 효율
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#00ced1', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🛡️ 쐐기 필수 유틸리티
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>{renderTextWithSkillIcons('죽음의 손아귀')}:</strong> 30야드 대상을 자신에게 끌어당김 - 몹 집결 및 인터럽트 조합
                    </li>
                    <li>
                      <strong>활용 상황:</strong> 원거리 캐스터 몹 끌어당기기, 탱커 지원용 몹 집결
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>{renderTextWithSkillIcons('대마법 지대')}:</strong> 2분 쿨 - 10초간 파티원 마법 피해 20% 감소 + 마법 인터럽트 효과
                    </li>
                    <li>
                      <strong>사용 타이밍:</strong> 광역 마법 피해 메커니즘 직전 (폭발, 스웜, 장판 등)
                    </li>
                    <li>
                      <strong>{renderTextWithSkillIcons('살의 손길')} 활용:</strong> 파티원에게 피해 흡수 보호막 부여 (20% 체력) - 탱커/힐러 생존 지원
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>고급 기술:</strong> {renderTextWithSkillIcons('시체 폭발')}로 처치한 몹 폭발 → 광역 피해 + 몹 정리 가속
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>공통 생존 메커니즘</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>
                  {renderTextWithSkillIcons('얼음같은 인내력')} - 3분 쿨 - 받는 모든 피해 20% 감소 (8초 지속)
                </li>
                <li>
                  {renderTextWithSkillIcons('흡혈의 일격')} - 룬 마력 30 소비 - 피해량의 30%를 체력으로 흡수
                </li>
                <li>
                  {renderTextWithSkillIcons('룬 전환')} - 1분 쿨 - 모든 룬을 룬 마력으로 전환 (긴급 회복용)
                </li>
                <li>
                  <strong style={{ color: '#ffa500' }}>파티 유틸:</strong> {renderTextWithSkillIcons('죽음의 행진')} - 40초간 이동 불가 면역 + 이동 속도 증가 (파티 전체)
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
                  • <strong style={{ color: '#ff6b6b' }}>룬 낭비:</strong> {renderTextWithSkillIcons('룬 6개 만충전 상태에서 대기 → 룬 재충전 시간 손실')}<br/>
                  • <strong style={{ color: '#ff6b6b' }}>룬 마력 오버캡:</strong> {renderTextWithSkillIcons('룬 마력 100 상태에서 절멸 사용 → 자원 낭비')}<br/>
                  {selectedTier === 'deathbringer' && (
                    <>
                      • <strong style={{ color: '#ff6b6b' }}>냉기의 순환 미활용:</strong> {renderTextWithSkillIcons('냉기의 순환 10중첩 시 냉기의 기둥 미사용 → 버프 손실')}<br/>
                      • <strong style={{ color: '#ff6b6b' }}>살육 기계 낭비:</strong> {renderTextWithSkillIcons('살육 기계 5중첩 달성 시 냉기 강타 미사용 → 피해 50% 손실')}<br/>
                    </>
                  )}
                  {selectedTier === 'rideroftheapocalypse' && (
                    <>
                      • <strong style={{ color: '#ff6b6b' }}>4기사 미소환:</strong> {renderTextWithSkillIcons('얼어붙은 망령 쿨다운 놀림 → 협동 공격 손실')}<br/>
                      • <strong style={{ color: '#ff6b6b' }}>서릿발 proc 낭비:</strong> {renderTextWithSkillIcons('광역 전투에서 서릿발 단일 대상 사용 → AoE 효율 손실')}<br/>
                    </>
                  )}
                  • <strong style={{ color: '#ff6b6b' }}>무자비한 겨울 누락:</strong> {renderTextWithSkillIcons('5+ 적 광역 구간에서 무자비한 겨울 미사용 → 광역 피해 손실')}
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
                  • <strong style={{ color: '#28a745' }}>스킬 대기열 활용:</strong> 전역 쿨다운 종료 0.25초 전 다음 스킬 입력 → 즉시 발동<br/>
                  • <strong style={{ color: '#28a745' }}>룬 예측 관리:</strong> {renderTextWithSkillIcons('냉기의 기둥 타이밍 10초 전 룬 6개 + 룬 마력 80+ 확보 → 최대 효율')}<br/>
                  {selectedTier === 'deathbringer' && (
                    <>
                      • <strong style={{ color: '#28a745' }}>버스트 타이밍:</strong> {renderTextWithSkillIcons('냉기의 순환 10중첩 + 냉기의 기둥 + 룬 무기 강화 동시 활용 → 최대')} 초당 피해량<br/>
                      • <strong style={{ color: '#28a745' }}>살육 기계 최대화:</strong> {renderTextWithSkillIcons('살육 기계 5중첩 + 냉기의 기둥 활성 시 냉기 강타 집중 → 피해 극대화')}<br/>
                    </>
                  )}
                  {selectedTier === 'rideroftheapocalypse' && (
                    <>
                      • <strong style={{ color: '#28a745' }}>이동 최적화:</strong> {renderTextWithSkillIcons('주살자 + 죽음의 손아귀 조합 → 이동 중에도')} 초당 피해량 유지<br/>
                      • <strong style={{ color: '#28a745' }}>4기사 극대화:</strong> {renderTextWithSkillIcons('전투 시작 전 4기사 소환 완료 + 냉기의 기둥 즉시 사용 → 협동 공격 극대화')}<br/>
                    </>
                  )}
                  • <strong style={{ color: '#28a745' }}>자원 관리:</strong> {renderTextWithSkillIcons('룬 3개 이하 시 절멸 우선 → 룬 마력 80+ 유지 → 냉기 강타 효율 극대화')}<br/>
                  • <strong style={{ color: '#28a745' }}>위크오라 설정:</strong> 살육 기계 중첩, 서릿발 proc, {selectedTier === 'deathbringer' ? '냉기의 순환 중첩' : renderTextWithSkillIcons('4기사 소환 상태')}, 룬/룬 마력 게이지 추적 필수
                </p>
              </div>
            </div>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 데이터 - 냉기 죽음의 기사 TWW 시즌3
  const talentBuilds = {
    deathbringer: {  // 죽음인도자
      'raid-single': {
        name: '레이드 단일 대상',
        description: '죽음인도자를 활용한 단일 대상 빌드입니다. 살육 기계와 냉기 강타 강화로 보스전에 특화되어 있습니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',  // 죽음인도자 레이드 단일 (실제 빌드 코드 필요)
        icon: '⚔️'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '죽음인도자를 활용한 광역 빌드입니다. 냉기 낫과 매정한 겨울로 다수 대상에게 강력한 광역 딜을 제공합니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',  // 죽음인도자 레이드 광역 (실제 빌드 코드 필요)
        icon: '⚔️'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '죽음인도자를 활용한 쐐기돌 빌드입니다. 빠른 룬 생성과 살육 기계로 쐐기돌에 최적화되어 있습니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',  // 죽음인도자 쐐기돌 (실제 빌드 코드 필요)
        icon: '⚔️'
      }
    },
    rideroftheapocalypse: {  // 종말의 기수
      'raid-single': {
        name: '레이드 단일 대상',
        description: '종말의 기수를 활용한 단일 대상 빌드입니다. 종말과 네 기수로 안정적인 단일 딜을 제공합니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',  // 종말의 기수 레이드 단일 (실제 빌드 코드 필요)
        icon: '🏇'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '종말의 기수를 활용한 광역 빌드입니다. 종말과 매정한 겨울로 강력한 광역 딜을 제공합니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',  // 종말의 기수 레이드 광역 (실제 빌드 코드 필요)
        icon: '🏇'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '종말의 기수를 활용한 쐐기돌 빌드입니다. 높은 기동성과 종말로 쐐기돌에 최적화되어 있습니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',  // 종말의 기수 쐐기돌 (실제 빌드 코드 필요)
        icon: '🏇'
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
          
          <button
            onClick={() => {
              setSelectedTier('deathbringer');
              setSelectedBuild('mythic-plus');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'deathbringer' ?
                'linear-gradient(135deg, #5a3896 0%, #2a1846 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'deathbringer' ? '#9482C9' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'deathbringer' ? '#9482C9' : '#94a3b8',
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
            color: selectedTier === 'deathbringer' ? '#9482C9' : '#32CD32',
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
        deathbringer: {  // 죽음인도자
          single: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#3FC6EA', priority: 'high' }
              ],
              note: '룬 재충전 속도 가속, GCD 감소로 절멸과 냉기 강타 빈도 증가'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '냉기 강타와 서리 낫 치명타 확률 증가, 안정적인 평균 딜 향상'
            },
            mastery: {
              breakpoints: [],
              note: '냉기 피해 증가, 냉기의 순환 10중첩 유지 시 룬 마력 생성 20% 증가와 시너지'
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
              note: '무자비한 겨울과 냉기 낫 빠른 시전, 광역 딜 극대화'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '광역 스킬 치명타로 폭발 딜 증가, 서릿발 발동 빈도 간접 증가'
            },
            mastery: {
              breakpoints: [],
              note: '모든 냉기 피해 증가로 광역에서도 높은 가치'
            },
            versatility: {
              breakpoints: [],
              note: '안정적인 피해 증가 옵션'
            }
          }
        },
        rideroftheapocalypse: {  // 종말의 기수
          single: {
            haste: {
              softcap: '20.7%',
              breakpoints: [
                { value: 20.7, label: 'GCD 1초 도달', color: '#3FC6EA', priority: 'high' }
              ],
              note: '네 기수 소환 빈도 증가, 룬 재충전 가속화로 종말 스킬 효율 향상'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '종말 스킬 치명타로 네 기수 딜 증가, 안정적인 평균 딜 향상'
            },
            mastery: {
              breakpoints: [],
              note: '냉기 피해 증가, 네 기수 종말 스킬 딜 향상'
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
              note: '최우선 스탯, 네 기수 광역 딜과 무자비한 겨울 빈도 극대화'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '광역 종말 스킬 치명타로 폭발 딜 증가'
            },
            mastery: {
              breakpoints: [],
              note: '네 기수와 냉기 스킬 모든 피해 증가'
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

    // 스탯 우선순위 - 냉기 죽음의 기사 TWW 시즌3
    const statPriorities = {
      deathbringer: {  // 죽음인도자
        single: ['mastery', 'crit', 'haste', 'versatility'],  // 단일: 특화 > 치명타 > 가속 > 유연 (냉기 피해 강화)
        aoe: ['mastery', 'haste', 'crit', 'versatility']  // 광역: 특화 > 가속 > 치명타 > 유연 (냉기 낫 강화)
      },
      rideroftheapocalypse: {  // 종말의 기수
        single: ['mastery', 'crit', 'haste', 'versatility'],  // 단일: 특화 > 치명타 > 가속 > 유연 (종말 피해 강화)
        aoe: ['mastery', 'haste', 'crit', 'versatility']  // 광역: 특화 > 가속 > 치명타 > 유연 (매정한 겨울)
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
              🔥 죽음인도자
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
              <span>{selectedStatHero === 'deathbringer' ? '🔥' : '✨'}</span>
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
              룬 & 룬 마력 시스템
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
                냉기 죽음의 기사 가이드
              </h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                최종 수정일: 2025.10.10 | 작성: WoWMeta
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