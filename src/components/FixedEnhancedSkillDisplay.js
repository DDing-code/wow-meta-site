import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 스킬 데이터베이스 import
let skillDatabase = {};
try {
  // 여러 경로 시도
  try {
    skillDatabase = require('../database-builder/tww-s3-final-ultimate-database.json');
  } catch (e1) {
    try {
      skillDatabase = require('../database-builder/all-classes-skills-data.json');
    } catch (e2) {
      try {
        skillDatabase = require('../data/finalSkillDatabase.js');
      } catch (e3) {
        console.warn('모든 스킬 데이터베이스 로드 실패', e3);
      }
    }
  }
} catch (e) {
  console.warn('스킬 데이터베이스 로드 실패', e);
}

// 스타일 컴포넌트
const SkillGrid = styled.div`
  display: grid;
  gap: 12px;
  margin: 0 auto 20px auto;
  max-width: 1200px;
  padding: 0 20px;
`;

const SkillCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(15, 15, 20, 0.4) 100%);
  border: 1px solid rgba(244, 196, 48, 0.2);
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(15, 15, 20, 0.6) 100%);
    border-color: rgba(244, 196, 48, 0.4);
    box-shadow: 0 4px 12px rgba(244, 196, 48, 0.2);
  }
`;

const SkillIconWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
`;

const SkillIcon = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border: 2px solid #f4c430;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(244, 196, 48, 0.6);
  }
`;

const SkillContent = styled.div`
  flex: 1;
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const SkillName = styled.h3`
  color: #f4c430;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SkillId = styled.span`
  color: #666;
  font-size: 0.8rem;
  font-weight: normal;
`;

const SkillDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 10px 0;
`;

const SkillStats = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const SkillStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
`;

const StatLabel = styled.span`
  color: #888;
`;

const StatValue = styled.span`
  color: #f4c430;
  font-weight: 500;
`;

// 플로팅 툴팁
const FloatingTooltip = styled.div`
  position: fixed;
  z-index: 10000;
  background: #1a1a2e;
  border: 2px solid #f4c430;
  border-radius: 10px;
  padding: 0;
  width: 380px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9);
  display: ${props => props.visible ? 'block' : 'none'};
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  pointer-events: none;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TooltipHeader = styled.div`
  background: linear-gradient(135deg, #2c1810 0%, #1a0e08 100%);
  padding: 15px;
  border-bottom: 1px solid rgba(244, 196, 48, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px 8px 0 0;
`;

const TooltipIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid #f4c430;
`;

const TooltipTitle = styled.div`
  flex: 1;

  h4 {
    color: #f4c430;
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .english {
    color: #999;
    font-size: 0.9rem;
    margin-top: 2px;
  }
`;

const TooltipBody = styled.div`
  padding: 15px;
`;

const TooltipSection = styled.div`
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 0.9rem;

  .label {
    color: #888;
  }

  .value {
    color: #f4c430;
    font-weight: 500;
  }
`;

const TooltipDescription = styled.div`
  font-size: 0.9rem;
  line-height: 1.6;
  color: #e0e0e0;
`;

const FixedEnhancedSkillDisplay = ({ className = 'HUNTER' }) => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hunterSkills, setHunterSkills] = useState([]);

  useEffect(() => {
    console.log('DB 로드 상태:', skillDatabase ? '성공' : '실패');
    console.log('HUNTER 데이터 존재:', skillDatabase.HUNTER ? '예' : '아니오');

    const skills = [];

    // DB에서 스킬 찾기 시도
    if (skillDatabase && skillDatabase.HUNTER) {
      const coreSkillNames = [
        'Kill Command', 'Barbed Shot', 'Arcane Shot', 'Aspect of the Wild',
        'Bestial Wrath', 'Kill Shot', 'Multi-Shot', 'Hunter\'s Mark'
      ];

      // DB에서 핵심 스킬 찾기
      for (const id in skillDatabase.HUNTER) {
        const skill = skillDatabase.HUNTER[id];
        if (coreSkillNames.includes(skill.englishName)) {
          skills.push({
            id: id,
            koreanName: skill.koreanName,
            englishName: skill.englishName,
            icon: skill.icon,
            description: skill.description,
            cooldown: skill.cooldown,
            castTime: skill.castTime,
            range: skill.range,
            resourceCost: skill.resourceCost,
            resourceGain: skill.resourceGain,
            importance: getImportance(skill.englishName)
          });
        }
      }
    }

    // DB에서 못 찾았거나 부족한 경우 기본값 사용
    if (skills.length < 6) {
      // skills 배열 초기화하고 모든 기본 스킬 추가
      skills.length = 0;
      skills.push(
          {
            id: '259489',
            koreanName: '살상 명령',
            englishName: 'Kill Command',
            icon: 'ability_hunter_killcommand',
            description: '펫에게 대상을 맹렬히 공격하도록 명령하여 주요 피해를 입힙니다.',
            cooldown: '7.5 초',
            castTime: '즉시',
            range: '50 야드',
            resourceCost: '집중 30',
            importance: '핵심'
          },
          {
            id: '217200',
            koreanName: '날카로운 사격',
            englishName: 'Barbed Shot',
            icon: 'ability_hunter_barbedshot',
            description: '적을 찢는 투사체를 발사해 출혈을 일으켜 12초에 걸쳐 피해를 입힙니다. 야수를 광기에 휩싸이게 만들어 12초 동안 공격 속도가 30%만큼 증가합니다.',
            cooldown: '12초 충전',
            castTime: '즉시',
            range: '40 야드',
            resourceCost: '없음',
            resourceGain: '집중 20',
            importance: '핵심'
          },
          {
            id: '185358',
            koreanName: '신비한 사격',
            englishName: 'Arcane Shot',
            icon: 'ability_impalingbolt',
            description: '즉시 신비한 피해를 입힙니다.',
            cooldown: '없음',
            castTime: '즉시',
            range: '40 야드',
            resourceCost: '집중 40',
            importance: '보조'
          },
          {
            id: '193530',
            koreanName: '야생의 상',
            englishName: 'Aspect of the Wild',
            icon: 'spell_nature_protectionformnature',
            description: '20초 동안 당신과 펫의 치명타율이 증가하고 집중 생성량이 증가합니다.',
            cooldown: '2 분',
            castTime: '즉시',
            range: '자신',
            resourceCost: '없음',
            importance: '버스트'
          },
          {
            id: '19574',
            koreanName: '야수의 격노',
            englishName: 'Bestial Wrath',
            icon: 'ability_druid_ferociousbite',
            description: '15초 동안 펫의 피해가 25% 증가합니다.',
            cooldown: '1.5 분',
            castTime: '즉시',
            range: '100 야드',
            resourceCost: '없음',
            importance: '버스트'
          },
          {
            id: '53351',
            koreanName: '마무리 사격',
            englishName: 'Kill Shot',
            icon: 'ability_hunter_assassinate2',
            description: '체력이 20% 이하인 대상에게 막대한 물리 피해를 입힙니다.',
            cooldown: '20 초',
            castTime: '즉시',
            range: '40 야드',
            resourceCost: '집중 10',
            importance: '처형'
          },
          {
            id: '2643',
            koreanName: '일제 사격',
            englishName: 'Multi-Shot',
            icon: 'ability_upgrademoonglaive',
            description: '전방의 모든 적에게 물리 피해를 입힙니다.',
            cooldown: '없음',
            castTime: '즉시',
            range: '40 야드',
            resourceCost: '집중 20',
            importance: '광역'
          }
        );
      }

    console.log('최종 스킬 개수:', skills.length);
    setHunterSkills(skills.slice(0, 6)); // 최대 6개만 표시
  }, []);

  const getImportance = (englishName) => {
    switch(englishName) {
      case 'Kill Command': return '핵심';
      case 'Bestial Wrath': return '버스트';
      case 'Aspect of the Wild': return '버스트';
      case 'Kill Shot': return '처형';
      case 'Multi-Shot': return '광역';
      default: return '보조';
    }
  };

  const getImportanceColor = (importance) => {
    switch(importance) {
      case '핵심': return '#ff6b6b';
      case '버스트': return '#ffa726';
      case '처형': return '#ab47bc';
      case '광역': return '#42a5f5';
      case '보조': return '#66bb6a';
      default: return '#78909c';
    }
  };

  const handleSkillHover = (skill, event) => {
    if (skill) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = Math.min(rect.right + 10, window.innerWidth - 400);
      const y = Math.max(rect.top - 50, 10);

      setTooltipPos({ x, y });
      setHoveredSkill(skill);
    } else {
      setHoveredSkill(null);
    }
  };

  return (
    <div style={{width: '100%', maxWidth: '100vw', overflow: 'hidden'}}>
      <SkillGrid>
        {hunterSkills.map((skill, idx) => (
          <SkillCard key={idx}>
            <SkillIconWrapper>
              <SkillIcon
                src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
                alt={skill.koreanName}
                onMouseEnter={(e) => handleSkillHover(skill, e)}
                onMouseLeave={() => handleSkillHover(null)}
                onClick={() => window.open(`https://ko.wowhead.com/spell=${skill.id}`, '_blank')}
              />
            </SkillIconWrapper>

            <SkillContent>
              <SkillHeader>
                <SkillName
                  onClick={() => window.open(`https://ko.wowhead.com/spell=${skill.id}`, '_blank')}
                  onMouseEnter={(e) => handleSkillHover(skill, e)}
                  onMouseLeave={() => handleSkillHover(null)}
                >
                  {skill.koreanName}
                </SkillName>
                <SkillId>ID: {skill.id}</SkillId>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#fff',
                  background: getImportanceColor(skill.importance)
                }}>
                  {skill.importance}
                </span>
              </SkillHeader>

              <SkillDescription>
                {skill.description ?
                  (skill.description.length > 100 ?
                    skill.description.substring(0, 100) + '...' :
                    skill.description) :
                  '스킬 설명이 없습니다.'
                }
              </SkillDescription>

              <SkillStats>
                {skill.cooldown && skill.cooldown !== '없음' && skill.cooldown !== '해당 없음' && (
                  <SkillStat>
                    <StatLabel>재사용:</StatLabel>
                    <StatValue>{skill.cooldown}</StatValue>
                  </SkillStat>
                )}
                {skill.resourceCost && skill.resourceCost !== '없음' && (
                  <SkillStat>
                    <StatLabel>소모:</StatLabel>
                    <StatValue>{skill.resourceCost}</StatValue>
                  </SkillStat>
                )}
                {skill.range && skill.range !== '근접' && (
                  <SkillStat>
                    <StatLabel>사거리:</StatLabel>
                    <StatValue>{skill.range.split(' ')[0]} 야드</StatValue>
                  </SkillStat>
                )}
              </SkillStats>
            </SkillContent>
          </SkillCard>
        ))}
      </SkillGrid>

      {/* 플로팅 툴팁 */}
      {hoveredSkill && (
        <FloatingTooltip visible={true} x={tooltipPos.x} y={tooltipPos.y}>
          <TooltipHeader>
            <TooltipIcon
              src={`https://wow.zamimg.com/images/wow/icons/large/${hoveredSkill.icon}.jpg`}
              alt={hoveredSkill.koreanName}
            />
            <TooltipTitle>
              <h4>{hoveredSkill.koreanName}</h4>
              <div className="english">{hoveredSkill.englishName}</div>
            </TooltipTitle>
          </TooltipHeader>

          <TooltipBody>
            <TooltipSection>
              <TooltipRow>
                <span className="label">시전 시간:</span>
                <span className="value">{hoveredSkill.castTime || '즉시 시전'}</span>
              </TooltipRow>
              <TooltipRow>
                <span className="label">재사용 대기시간:</span>
                <span className="value">{hoveredSkill.cooldown || '없음'}</span>
              </TooltipRow>
              <TooltipRow>
                <span className="label">사거리:</span>
                <span className="value">{hoveredSkill.range || '근접'}</span>
              </TooltipRow>
            </TooltipSection>

            {(hoveredSkill.resourceCost || hoveredSkill.resourceGain) && (
              <TooltipSection>
                {hoveredSkill.resourceCost && hoveredSkill.resourceCost !== '없음' && (
                  <TooltipRow>
                    <span className="label">소모 자원:</span>
                    <span className="value">{hoveredSkill.resourceCost}</span>
                  </TooltipRow>
                )}
                {hoveredSkill.resourceGain && hoveredSkill.resourceGain !== '없음' && (
                  <TooltipRow>
                    <span className="label">생성 자원:</span>
                    <span className="value">{hoveredSkill.resourceGain}</span>
                  </TooltipRow>
                )}
              </TooltipSection>
            )}

            <TooltipSection>
              <TooltipDescription>
                {hoveredSkill.description || '상세 설명이 없습니다.'}
              </TooltipDescription>
            </TooltipSection>
          </TooltipBody>
        </FloatingTooltip>
      )}
    </div>
  );
};

export default FixedEnhancedSkillDisplay;