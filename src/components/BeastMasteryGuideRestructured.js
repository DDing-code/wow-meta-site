import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';
import styles from './BeastMasteryGuide.module.css';
import WowTalentTreeRealistic from './WowTalentTreeRealistic';
import moduleEventBus from '../services/ModuleEventBus';
import aiFeedbackService from '../services/AIFeedbackService';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons';

// 스타일 컴포넌트
const Container = styled.div`
  padding: 2rem 0;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 2rem;
  transition: color 0.3s;

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const ClassHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(243, 139, 168, 0.1), rgba(203, 166, 247, 0.1));
  border-radius: 15px;
`;

const ClassIcon = styled.div`
  margin-bottom: 1rem;
`;

const ClassName = styled.h1`
  font-size: 3rem;
  color: #AAD372;
  margin-bottom: 0.5rem;
`;

const ClassDescription = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.subtext};
`;

const ContentTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.colors.secondary};
  padding-bottom: 0;
`;

const ContentTab = styled.button`
  padding: 1rem 1.5rem;
  background: transparent;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.subtext};
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: -2px;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ContentSection = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 15px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// 스킬 데이터 - TWW 시즌3 (11.2 패치) 기준
const skillData = {
  bloodshed: {
    id: '321530',
    name: '유혈',
    englishName: 'Bloodshed',
    icon: 'ability_druid_primaltenacity',
    description: '야수에게 명령을 내려 대상을 찢어, 12초에 걸쳐 [전투력 * 1.2 * 12 * 1 * 1 * (1 + 유연성) * 1.02]의 출혈 피해를 입히도록 합니다. 유혈로 피해를 입히면 일정 확률로 광포한 야수를 소환합니다.',
    cooldown: '1분',
    focusCost: '없음'
  },
  bestialWrath: {
    id: '19574',
    name: '야수의 격노',
    englishName: 'Bestial Wrath',
    icon: 'ability_druid_ferociousbite',
    description: '펫에게 격노를 불어넣어 15초 동안 피해량을 25% 증가시킵니다. 야수의 격노는 펫의 집중 소모량을 50% 감소시킵니다.',
    cooldown: '1분 30초',
    focusCost: '없음'
  },
  barbedShot: {
    id: '217200',
    name: '날카로운 사격',
    englishName: 'Barbed Shot',
    icon: 'ability_hunter_barbedshot',
    description: '대상을 가시로 찔러 물리 피해를 입히고 8초 동안 출혈 피해를 입힙니다. 펫의 공격 속도를 30% 증가시키는 광분을 8초 부여합니다. 3번까지 중첩됩니다.',
    cooldown: '재충전 12초',
    focusGain: '20',
    charges: '2'
  },
  killCommand: {
    id: '34026',
    name: '살상 명령',
    englishName: 'Kill Command',
    icon: 'ability_hunter_killcommand',
    description: '펫에게 대상을 즉시 공격하도록 명령하여 물리 피해를 입힙니다.',
    cooldown: '7.5초',
    focusCost: '30'
  },
  cobraShot: {
    id: '193455',
    name: '코브라 사격',
    englishName: 'Cobra Shot',
    icon: 'ability_hunter_cobrashot',
    description: '대상에게 코브라 사격을 날려 물리 피해를 입힙니다. 살상 명령의 재사용 대기시간을 1초 감소시킵니다.',
    castTime: '1.75초',
    focusCost: '35'
  },
  multiShot: {
    id: '2643',
    name: '일제 사격',
    englishName: 'Multi-Shot',
    icon: 'ability_upgrademoonglaive',
    description: '전방의 모든 적에게 물리 피해를 입히고, 펫에게 4초 동안 야수의 회전베기를 부여합니다.',
    focusCost: '40'
  },
  killShot: {
    id: '53351',
    name: '마무리 사격',
    englishName: 'Kill Shot',
    icon: 'ability_hunter_assassinate',
    description: '생명력이 20% 이하인 적에게 강력한 일격을 가합니다.',
    cooldown: '20초',
    focusCost: '10'
  },
  beastCleave: {
    id: '115939',
    name: '야수의 회전베기',
    englishName: 'Beast Cleave',
    icon: 'ability_hunter_sickem',
    description: '일제 사격 후 4초 동안 펫의 기본 공격이 주변의 모든 적에게 피해를 입힙니다.',
    type: 'passive'
  },
  frenzy: {
    id: '272790',
    name: '광분',
    englishName: 'Frenzy',
    icon: 'ability_druid_mangle',
    description: '날카로운 사격이 펫의 공격 속도를 30% 증가시킵니다. 3번까지 중첩됩니다.',
    type: 'passive'
  },
  direBeast: {
    id: '120679',
    name: '광포한 야수',
    englishName: 'Dire Beast',
    icon: 'ability_hunter_longevity',
    description: '야생에서 광포한 야수를 소환하여 15초 동안 대상을 공격합니다.',
    cooldown: '20초',
    focusCost: '25'
  },
  aspectOfTheWild: {
    id: '193530',
    name: '야생의 상',
    englishName: 'Aspect of the Wild',
    icon: 'spell_nature_protectionformnature',
    description: '20초 동안 당신과 펫의 치명타 확률이 20% 증가합니다. 또한 날카로운 사격의 충전 속도가 12초 감소합니다.',
    cooldown: '2분',
    focusCost: '없음'
  },
  callOfTheWild: {
    id: '359844',
    name: '야생의 부름',
    englishName: 'Call of the Wild',
    icon: 'ability_hunter_callofthewild',
    description: '모든 펫과 야수 소환물의 피해량을 20초 동안 20% 증가시킵니다.',
    cooldown: '3분',
    focusCost: '없음'
  },
  explosiveShot: {
    id: '212431',
    name: '폭발 사격',
    englishName: 'Explosive Shot',
    icon: 'ability_hunter_explosiveshot',
    description: '대상에게 폭발 사격을 날려 화염 피해를 입히고 주변 적들에게도 피해를 입힙니다.',
    cooldown: '30초',
    focusCost: '20'
  },
  blackArrow: {
    id: '466932',
    name: '검은 화살',
    englishName: 'Black Arrow',
    icon: 'spell_shadow_painspike',
    description: '대상에게 암흑 화살을 발사하여 암흑 피해를 입히고 어둠 순찰자의 징표를 남깁니다.',
    cooldown: '15초',
    focusCost: '15'
  },
  bleakArrows: {
    id: '467749',
    name: '황폐의 화살',
    englishName: 'Bleak Arrows',
    icon: 'inv_quiver_1h_mawraid_d_01',
    description: '자동 사격이 암흑 피해를 입히며 방어도를 무시합니다. 자동 사격 시 20%의 확률로 죽음의 강타를 부여합니다.',
    type: 'passive'
  },
  howlOfThePack: {
    id: '378739',
    name: '무리 우두머리의 울부짖음',
    englishName: 'Howl of the Pack',
    icon: 'ability_hunter_callofthewild',
    description: '무리의 지도자의 핵심 능력. 야수의 격노, 야생의 부름, 피흘리기 사용 시 추가 펫을 소환하여 15초 동안 함께 전투합니다. 티어 세트 효과로 공격력이 25% 증가합니다.',
    cooldown: '트리거 기반',
    type: 'passive'
  },
  aheadOfTheGame: {
    id: '378740',
    name: '앞서 나가기',
    englishName: 'Ahead of the Game',
    icon: 'ability_hunter_aspectofthefox',
    description: '무리 우두머리의 울부짖음이 활성화된 동안 수여되는 버프. 날카로운 사격의 효율을 크게 증가시키고, 티어 4세트 효과로 날카로운 사격 시전 시 무리 우두머리의 울부짖음 지속시간을 1초 연장합니다.',
    type: 'passive'
  },
  darkRangerMark: {
    id: '466933',
    name: '어둠 순찰자의 징표',
    englishName: 'Dark Ranger\'s Mark',
    icon: 'spell_shadow_shadowwordpain',
    description: '검은 화살이 남기는 디버프. 징표가 있는 동안 살상 명령과 날카로운 사격의 피해량이 15% 증가합니다. 티어 2세트 효과의 핵심 구성 요소입니다.',
    type: 'passive'
  },
  darkRangers: {
    id: '467750',
    name: '어둠 순찰자',
    englishName: 'Dark Rangers',
    icon: 'ability_hunter_ranger',
    description: '티어 4세트 효과로 소환되는 추가 NPC. 황폐의 화살에 적중당한 대상이 검은 화살에 감염된 경우 소환되어 지원 사격을 가합니다.',
    type: 'passive'
  }
};

// 스킬 아이콘 컴포넌트
const SkillIcon = ({ skill, size = 'medium', showTooltip = true, className = '', textOnly = false }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const sizeMap = {
    small: '24px',
    medium: '36px',
    large: '48px'
  };

  const handleMouseEnter = (e) => {
    setShowInfo(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    const tooltipWidth = 380;
    const tooltipHeight = 250;

    let x, y;

    if (rect.right + tooltipWidth + 10 <= window.innerWidth) {
      x = rect.right + scrollX + 10;
    } else if (rect.left - tooltipWidth - 10 >= 0) {
      x = rect.left + scrollX - tooltipWidth - 10;
    } else {
      x = Math.max(10, Math.min(window.innerWidth - tooltipWidth - 10, rect.left + scrollX));
    }

    const elementCenter = rect.top + rect.height / 2 + scrollY;
    y = elementCenter - tooltipHeight / 2;

    if (y < scrollY + 10) {
      y = scrollY + 10;
    } else if (y + tooltipHeight > scrollY + window.innerHeight - 10) {
      y = scrollY + window.innerHeight - tooltipHeight - 10;
    }

    setTooltipPos({ x, y });
  };

  const renderTooltip = () => {
    if (!showTooltip || !showInfo) return null;

    const tooltipContent = (
      <div
        style={{
          position: 'fixed',
          left: `${tooltipPos.x - window.scrollX}px`,
          top: `${tooltipPos.y - window.scrollY}px`,
          zIndex: 10000,
          width: '360px',
          background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
          border: '2px solid #f4c430',
          borderRadius: '12px',
          boxShadow: '0 0 40px rgba(244, 196, 48, 0.3)',
          padding: '18px',
          animation: 'fadeIn 0.3s ease-out',
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
          <img
            src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
            alt={skill.name}
            style={{ width: '48px', height: '48px', borderRadius: '8px' }}
            onError={(e) => {
              e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
            }}
          />
          <div>
            <h4 style={{ margin: 0, color: '#f4c430' }}>{skill.name}</h4>
            <div style={{ color: '#999', fontSize: '12px' }}>{skill.englishName}</div>
            {skill.type === 'passive' && (
              <div style={{ color: '#8b5cf6', fontSize: '12px', marginTop: '2px' }}>
                패시브 특성
              </div>
            )}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
          {skill.cooldown && skill.cooldown !== '없음' && (
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#888' }}>재사용 대기시간: </span>
              <span style={{ color: '#f4c430' }}>{skill.cooldown}</span>
            </div>
          )}
          {skill.castTime && (
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#888' }}>시전 시간: </span>
              <span style={{ color: '#60a5fa' }}>{skill.castTime}</span>
            </div>
          )}
          {skill.focusCost && (
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#888' }}>집중 소모: </span>
              <span style={{ color: '#ef4444' }}>{skill.focusCost}</span>
            </div>
          )}
          {skill.focusGain && (
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#888' }}>집중 생성: </span>
              <span style={{ color: '#4ade80' }}>{skill.focusGain}</span>
            </div>
          )}
          {skill.charges && (
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#888' }}>충전 횟수: </span>
              <span style={{ color: '#60a5fa' }}>{skill.charges}</span>
            </div>
          )}
          <div style={{ color: '#ddd', fontSize: '13px', marginTop: '10px' }}>
            {skill.description}
          </div>
        </div>
      </div>
    );

    return ReactDOM.createPortal(tooltipContent, document.body);
  };

  if (textOnly) {
    return (
      <span
        className="skill-text-link"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowInfo(false)}
        style={{
          color: skill.type === 'passive' ? '#94a3b8' : '#ffa500',
          fontWeight: '600',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: skill.type === 'passive' ? '#64748b' : '#ff6b35',
          cursor: 'pointer',
          display: 'inline-block'
        }}
      >
        {skill.name}
        {renderTooltip()}
      </span>
    );
  }

  return (
    <div
      className={`skill-icon-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowInfo(false)}
      style={{ display: 'inline-block' }}
    >
      <img
        src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
        alt={skill.name}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: skill.type === 'passive' ? '1px solid #64748b' : '1px solid #333',
          borderRadius: '4px',
          opacity: skill.type === 'passive' ? 0.9 : 1,
          cursor: 'pointer'
        }}
        onError={(e) => {
          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
        }}
      />
      {renderTooltip()}
    </div>
  );
};

// 메인 컴포넌트
const BeastMasteryGuide = () => {
  const [selectedTier, setSelectedTier] = useState('packLeader');
  const [activeContent, setActiveContent] = useState('overview');
  const [guideVersion, setGuideVersion] = useState('1.0.0');
  const [aiImprovements, setAiImprovements] = useState([]);

  useEffect(() => {
    // 모듈 등록
    moduleEventBus.registerModule('beastMasteryGuide', {
      name: 'Beast Mastery Guide',
      version: guideVersion,
      specialization: 'Beast Mastery',
      class: 'Hunter'
    });

    // AI 피드백 수신 설정
    const handleGuideUpdates = (data) => {
      if (data.guide && data.guide.spec === 'Beast Mastery') {
        console.log('📝 Guide update received:', data.changes);
        setAiImprovements(data.changes);

        // 가이드 데이터 업데이트 이벤트 발생
        moduleEventBus.emit('guide:updated', {
          spec: 'Beast Mastery',
          changes: data.changes,
          version: `${parseInt(guideVersion.split('.')[0]) + 1}.0.0`
        });
      }
    };

    aiFeedbackService.on('guideUpdated', handleGuideUpdates);

    // 스킬 데이터베이스 업데이트 이벤트 발생
    moduleEventBus.emit('skillDatabase:updated', {
      count: Object.keys(skillData).length,
      spec: 'Beast Mastery'
    });

    // 특성 변경 추적
    const handleTierChange = () => {
      moduleEventBus.emit('talent:buildChanged', {
        spec: 'Beast Mastery',
        heroTalent: selectedTier,
        timestamp: new Date().toISOString()
      });
    };

    return () => {
      aiFeedbackService.off('guideUpdated', handleGuideUpdates);
    };
  }, [guideVersion, selectedTier]);

  // 영웅특성별 컨텐츠
  const heroContent = {
    packLeader: {
      name: '무리의 지도자',
      icon: '🐺',
      tierSet: {
        '2set': (
          <>
            <SkillIcon skill={skillData.bestialWrath} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.bestialWrath} textOnly={true} />,
            {' '}<SkillIcon skill={skillData.callOfTheWild} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.callOfTheWild} textOnly={true} />,
            {' '}<SkillIcon skill={skillData.bloodshed} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.bloodshed} textOnly={true} /> 사용 시 추가로
            <SkillIcon skill={skillData.howlOfThePack} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.howlOfThePack} textOnly={true} />을 소환합니다.
            <SkillIcon skill={skillData.howlOfThePack} textOnly={true} />의 공격력이 25% 증가합니다.
          </>
        ),
        '4set': (
          <>
            <SkillIcon skill={skillData.howlOfThePack} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.howlOfThePack} textOnly={true} />이 활성화되어 있는 동안,
            {' '}<SkillIcon skill={skillData.barbedShot} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.barbedShot} textOnly={true} />의 치명타 확률이 15% 증가합니다.
            <SkillIcon skill={skillData.aheadOfTheGame} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.aheadOfTheGame} textOnly={true} />를 받는 동안 <SkillIcon skill={skillData.barbedShot} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 시전 시 <SkillIcon skill={skillData.howlOfThePack} textOnly={true} />의 지속시간이 1초 증가합니다.
          </>
        )
      },
      singleTarget: {
        opener: [
          skillData.barbedShot,
          skillData.aspectOfTheWild,
          skillData.bestialWrath,
          skillData.killCommand,
          skillData.barbedShot,
          skillData.callOfTheWild,
          skillData.bloodshed,
          skillData.killCommand,
          skillData.barbedShot,
          skillData.direBeast,
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
          skillData.aspectOfTheWild,
          skillData.bestialWrath,
          skillData.barbedShot,
          skillData.bloodshed,
          skillData.multiShot,
          skillData.callOfTheWild,
          skillData.killCommand,
          skillData.barbedShot,
          skillData.multiShot,
          skillData.cobraShot
        ],
        priority: [
          { skill: skillData.multiShot, desc: '야수의 회전베기 활성화' },
          { skill: skillData.barbedShot, desc: '광분 유지' },
          { skill: skillData.killCommand, desc: '주 대상에게' },
          { skill: skillData.multiShot, desc: '집중 소비' }
        ]
      }
    },
    darkRanger: {
      name: '어둠 순찰자',
      icon: '🏹',
      tierSet: {
        '2set': (
          <>
            <SkillIcon skill={skillData.blackArrow} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.blackArrow} textOnly={true} />이 <SkillIcon skill={skillData.darkRangerMark} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.darkRangerMark} textOnly={true} />를 남깁니다.
            {' '}<SkillIcon skill={skillData.blackArrow} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.blackArrow} textOnly={true} /> 또는 <SkillIcon skill={skillData.darkRangerMark} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.darkRangerMark} textOnly={true} />가 활성화되어 있는 동안
            {' '}<SkillIcon skill={skillData.killCommand} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.killCommand} textOnly={true} />과
            {' '}<SkillIcon skill={skillData.barbedShot} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.barbedShot} textOnly={true} />의 피해량이 15% 증가합니다.
          </>
        ),
        '4set': (
          <>
            <SkillIcon skill={skillData.bleakArrows} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.bleakArrows} textOnly={true} />가 활성화되어 있는 동안
            {' '}<SkillIcon skill={skillData.barbedShot} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.barbedShot} textOnly={true} />의 재사용 대기시간이 2초 감소하고,
            {' '}<SkillIcon skill={skillData.barbedShot} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.barbedShot} textOnly={true} />이
            {' '}<SkillIcon skill={skillData.blackArrow} size="small" className="inline-icon" />
            <SkillIcon skill={skillData.blackArrow} textOnly={true} />의 재사용 대기시간을 1초 감소시킵니다.
          </>
        )
      },
      singleTarget: {
        opener: [
          skillData.barbedShot,
          skillData.blackArrow,
          skillData.aspectOfTheWild,
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
          { skill: skillData.barbedShot, desc: '광분 유지' },
          { skill: skillData.killCommand, desc: '사용' },
          { skill: skillData.cobraShot, desc: '필러' }
        ]
      },
      aoe: {
        opener: [
          skillData.multiShot,
          skillData.barbedShot,
          skillData.aspectOfTheWild,
          skillData.bestialWrath,
          skillData.bloodshed,
          skillData.multiShot,
          skillData.callOfTheWild,
          skillData.killCommand,
          skillData.barbedShot,
          skillData.explosiveShot,
          skillData.multiShot
        ],
        priority: [
          { skill: skillData.multiShot, desc: '야수의 회전베기' },
          { skill: skillData.blackArrow, desc: '모든 대상에게' },
          { skill: skillData.bleakArrows, desc: '효과로 자동 사격 암흑 피해' },
          { skill: skillData.multiShot, desc: '집중 소비' }
        ]
      }
    }
  };

  const currentContent = heroContent[selectedTier];

  // 렌더링 함수들
  const renderOverview = () => (
    <>
      <div className="subsection">
        <h3 className="subsection-title">야수 전문화 개요</h3>
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          야수 사냥꾼은 펫과 함께 전투하는 원거리 딜러 전문화입니다.
          TWW 시즌3에서는 무리의 지도자와 어둠 순찰자 영웅특성이 모두 강력하며,
          특히 티어 세트 효과와의 시너지가 뛰어납니다.
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
              borderRadius: '8px'
            }}>
              <SkillIcon skill={skill} size="medium" />
              <div>
                <div style={{ fontWeight: 'bold' }}>{skill.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{skill.cooldown || '즉시'}</div>
              </div>
            </div>
          ))}
        </div>

        <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>리소스 시스템</h4>
        <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
          <li>주 자원: 집중 (0-100)</li>
          <li>집중 생성: 날카로운 사격 (+20), 자동 공격</li>
          <li>집중 소비: 살상 명령 (-30), 코브라 사격 (-35)</li>
          <li>펫 집중: 야수의 격노 중 50% 감소</li>
        </ul>
      </div>
    </>
  );

  const renderRotation = () => (
    <>
      <div className="section">
        <h2 className="section-title">영웅특성별 딜사이클</h2>

        {/* 영웅특성 선택 탭 */}
        <div className="tier-tabs" style={{ marginBottom: '30px' }}>
          <button
            className={`tier-tab ${selectedTier === 'packLeader' ? 'active' : ''}`}
            onClick={() => setSelectedTier('packLeader')}
          >
            <span className="tier-icon">🐺</span> 무리의 지도자
          </button>
          <button
            className={`tier-tab ${selectedTier === 'darkRanger' ? 'active' : ''}`}
            onClick={() => setSelectedTier('darkRanger')}
          >
            <span className="tier-icon">🏹</span> 어둠 순찰자
          </button>
        </div>

        {/* 티어 세트 효과 */}
        <div className="subsection">
          <h3 className="subsection-title">티어 세트 효과</h3>
          <div className="tier-bonuses">
            <div className="bonus-item">
              <span className="bonus-label">2세트:</span>
              <div className="bonus-description" style={{ display: 'inline' }}>
                {currentContent.tierSet['2set']}
              </div>
            </div>
            <div className="bonus-item">
              <span className="bonus-label">4세트:</span>
              <div className="bonus-description" style={{ display: 'inline' }}>
                {currentContent.tierSet['4set']}
              </div>
            </div>
          </div>
        </div>

        {/* 단일 대상 */}
        <div className="subsection">
          <h3 className="subsection-title">단일 대상</h3>

          <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
          <div className="opener-sequence">
            <div className="skill-sequence">
              {currentContent.singleTarget.opener.map((skill, index, arr) => (
                <React.Fragment key={index}>
                  <SkillIcon skill={skill} size="medium" />
                  {index < arr.length - 1 && <span className="arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
          <ol className="priority-list-wow">
            {currentContent.singleTarget.priority.map((item, index) => (
              <li key={index}>
                <span className="priority-number">{index + 1}.</span>
                <SkillIcon skill={item.skill} size="small" className="inline-icon" />
                <SkillIcon skill={item.skill} textOnly={true} /> - {item.desc}
              </li>
            ))}
          </ol>
        </div>

        {/* 광역 대상 */}
        <div className="subsection">
          <h3 className="subsection-title">광역 대상 (3+ 타겟)</h3>

          <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
          <div className="opener-sequence">
            <div className="skill-sequence">
              {currentContent.aoe.opener.map((skill, index, arr) => (
                <React.Fragment key={index}>
                  <SkillIcon skill={skill} size="medium" />
                  {index < arr.length - 1 && <span className="arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
          <ol className="priority-list-wow">
            {currentContent.aoe.priority.map((item, index) => (
              <li key={index}>
                <span className="priority-number">{index + 1}.</span>
                <SkillIcon skill={item.skill} size="small" className="inline-icon" />
                <SkillIcon skill={item.skill} textOnly={true} /> - {item.desc}
              </li>
            ))}
          </ol>
        </div>

        {/* 심화 분석 */}
        <div className="subsection">
          <h3 className="subsection-title">심화 분석</h3>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>
              <SkillIcon skill={skillData.bestialWrath} size="small" className="inline-icon" />
              <SkillIcon skill={skillData.bestialWrath} textOnly={true} /> 최적화
            </h4>
            <ul className="deep-dive-list">
              <li>버스트 윈도우에서 최대한 많은 <SkillIcon skill={skillData.killCommand} textOnly={true} /> 시전</li>
              <li>사용 효과 장신구와 물약을 함께 사용하여 딜 극대화</li>
              <li>펫의 집중 소모량 50% 감소 효과 활용</li>
            </ul>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>
              <SkillIcon skill={skillData.frenzy} size="small" className="inline-icon" />
              <SkillIcon skill={skillData.frenzy} textOnly={true} /> 관리
            </h4>
            <ul className="deep-dive-list">
              <li>3중첩 유지가 최우선 - 떨어지기 1.5초 전에 갱신</li>
              <li><SkillIcon skill={skillData.barbedShot} textOnly={true} />의 충전을 2개 이상 보유하지 않도록 주의</li>
              <li>광분 지속시간이 8초이므로 타이밍 계산 필수</li>
            </ul>
          </div>

          {selectedTier === 'packLeader' ? (
            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>무리의 지도자 특화 전략</h4>
              <ul className="deep-dive-list">
                <li><SkillIcon skill={skillData.howlOfThePack} textOnly={true} /> 활성화 시 <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 우선도 상승</li>
                <li><SkillIcon skill={skillData.aheadOfTheGame} textOnly={true} /> 버프 중 최대한 많은 <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 시전</li>
                <li><SkillIcon skill={skillData.direBeast} textOnly={true} />로 추가 DPS 확보</li>
              </ul>
            </div>
          ) : (
            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>어둠 순찰자 특화 전략</h4>
              <ul className="deep-dive-list">
                <li><SkillIcon skill={skillData.blackArrow} textOnly={true} /> 디버프 100% 유지</li>
                <li><SkillIcon skill={skillData.bleakArrows} textOnly={true} /> 효과로 자동 사격 암흑 피해 극대화</li>
                <li>티어 4세트 효과로 <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 쿨다운 감소 활용</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderBuilds = () => (
    <>
      <div className="subsection">
        <h3 className="subsection-title">특성 빌드</h3>
        <WowTalentTreeRealistic />
      </div>

      <div className="subsection" style={{ marginTop: '30px' }}>
        <h3 className="subsection-title">스탯 우선순위</h3>
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <h4 style={{ color: '#ffa500', marginBottom: '10px' }}>레이드 (단일 대상)</h4>
          <p>민첩성 > 치명타 > 가속 > 특화 > 유연성</p>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '10px' }}>
          <h4 style={{ color: '#ffa500', marginBottom: '10px' }}>신화+ (광역)</h4>
          <p>민첩성 > 가속 > 치명타 > 특화 > 유연성</p>
        </div>
      </div>
    </>
  );

  const renderGuides = () => (
    <>
      <div className="subsection">
        <h3 className="subsection-title">가이드 & 팁</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>광분 3중첩 유지가 최우선 과제입니다</li>
          <li>날카로운 사격은 충전이 2개 이상 되지 않도록 관리하세요</li>
          <li>야수의 격노와 야생의 상은 버스트 타이밍에 함께 사용하세요</li>
          <li>펫의 위치를 잘 관리하여 대상 변경 시 딜로스를 최소화하세요</li>
          <li>티어 세트 효과를 최대한 활용하기 위해 영웅특성에 따른 스킬 우선도를 숙지하세요</li>
        </ul>
      </div>
    </>
  );

  const renderContent = () => {
    switch(activeContent) {
      case 'overview':
        return renderOverview();
      case 'rotation':
        return renderRotation();
      case 'builds':
        return renderBuilds();
      case 'guides':
        return renderGuides();
      default:
        return renderOverview();
    }
  };

  return (
    <Container>
      <BackButton to="/classes">
          ← 직업 목록으로
        </BackButton>

        <ClassHeader>
          <ClassIcon>
            <WowIcon icon={classIcons.hunter} size={80} />
          </ClassIcon>
          <ClassName>
            사냥꾼
          </ClassName>
          <ClassDescription>
            야수와 함께 싸우는 사슬 착용 원거리 클래스
          </ClassDescription>
        </ClassHeader>

        <ContentTabs>
          <ContentTab
            active={activeContent === 'overview'}
            onClick={() => setActiveContent('overview')}
          >
            스킬 개요
          </ContentTab>
          <ContentTab
            active={activeContent === 'rotation'}
            onClick={() => setActiveContent('rotation')}
          >
            딜사이클
          </ContentTab>
          <ContentTab
            active={activeContent === 'builds'}
            onClick={() => setActiveContent('builds')}
          >
            빌드 & 스탯
          </ContentTab>
          <ContentTab
            active={activeContent === 'guides'}
            onClick={() => setActiveContent('guides')}
          >
            가이드
          </ContentTab>
        </ContentTabs>

        <ContentSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={activeContent}
        >
          <SectionTitle>
            <WowIcon icon={gameIcons.hunter} size={30} />
            야수 전문화 가이드
          </SectionTitle>
          {renderContent()}
        </ContentSection>
    </Container>
  );
};

export default BeastMasteryGuide;