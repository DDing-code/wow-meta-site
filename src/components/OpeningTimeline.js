/**
 * OpeningTimeline.js - 오프닝 시퀀스 타임라인 컴포넌트
 *
 * 용도: 전투 시작 시 스킬 사용 순서를 시간축으로 시각화
 * 특징: 프리캐스트(-4초, -3초)부터 전투 시작 후까지 표시
 */

import React from 'react';
import styled from 'styled-components';

const OpeningTimeline = ({ skills, duration = 20, theme }) => {
  const timeMarkers = [];
  const interval = 5;

  // 시간 마커 생성 (음수 시간 포함)
  const minTime = Math.min(...skills.map(s => s.time), 0);
  const maxTime = Math.max(...skills.map(s => s.time), duration);

  for (let t = Math.floor(minTime / interval) * interval; t <= maxTime; t += interval) {
    timeMarkers.push(t);
  }

  // 시간을 퍼센트로 변환
  const timeToPercent = (time) => {
    const totalRange = maxTime - minTime;
    return ((time - minTime) / totalRange) * 100;
  };

  return (
    <Container>
      <TimelineWrapper>
        {/* 시간 눈금 */}
        {timeMarkers.map(sec => (
          <TimeMarker
            key={sec}
            style={{ left: `${timeToPercent(sec)}%` }}
            $isZero={sec === 0}
          >
            <MarkerLine $isZero={sec === 0} />
            <MarkerLabel $isZero={sec === 0}>
              {sec === 0 ? 'PULL' : `${sec > 0 ? '+' : ''}${sec}초`}
            </MarkerLabel>
          </TimeMarker>
        ))}

        {/* 진행 바 */}
        <ProgressBar>
          <PreCastZone style={{ width: `${timeToPercent(0)}%` }} />
          <CombatZone style={{ left: `${timeToPercent(0)}%`, width: `${100 - timeToPercent(0)}%` }} />
        </ProgressBar>

        {/* 스킬 아이콘 */}
        {skills.map((item, idx) => (
          <SkillMarker
            key={idx}
            style={{ left: `${timeToPercent(item.time)}%` }}
          >
            <SkillIconWrapper $isPreCast={item.time < 0}>
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${item.skill?.icon || 'inv_misc_questionmark'}.jpg`}
                alt={item.skill?.koreanName || 'Skill'}
                onError={(e) => {
                  e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                }}
              />
              {item.time < 0 && <PreCastBadge>프리캐스트</PreCastBadge>}
            </SkillIconWrapper>

            <SkillInfo>
              <SkillName>{item.skill?.koreanName || item.skill?.name}</SkillName>
              <SkillTime $isPreCast={item.time < 0}>
                {item.time < 0 ? `${item.time}초` : `+${item.time}초`}
              </SkillTime>
            </SkillInfo>

            {item.comment && (
              <CommentBox>{item.comment}</CommentBox>
            )}
          </SkillMarker>
        ))}
      </TimelineWrapper>

      {/* 범례 */}
      <Legend>
        <LegendItem>
          <LegendColor $color="rgba(255, 100, 100, 0.3)" />
          <span>프리캐스트 (Pull 전)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color={theme?.colors?.primary || '#0070DE'} />
          <span>전투 시작 (Pull 후)</span>
        </LegendItem>
      </Legend>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TimelineWrapper = styled.div`
  position: relative;
  height: 140px;
  margin: 20px 0;
`;

const TimeMarker = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transform: translateX(-50%);
`;

const MarkerLine = styled.div`
  width: ${props => props.$isZero ? '3px' : '1px'};
  height: 100%;
  background: ${props => props.$isZero
    ? 'linear-gradient(180deg, #ff6b6b 0%, #ffa500 100%)'
    : 'rgba(255, 255, 255, 0.2)'};
  box-shadow: ${props => props.$isZero ? '0 0 10px rgba(255, 107, 107, 0.5)' : 'none'};
`;

const MarkerLabel = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: ${props => props.$isZero ? '#ff6b6b' : 'rgba(255, 255, 255, 0.6)'};
  font-size: ${props => props.$isZero ? '0.9rem' : '0.8rem'};
  font-weight: ${props => props.$isZero ? 'bold' : 'normal'};
  white-space: nowrap;
  text-shadow: ${props => props.$isZero ? '0 0 8px rgba(255, 107, 107, 0.8)' : 'none'};
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 8px;
  transform: translateY(-50%);
  border-radius: 4px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
`;

const PreCastZone = styled.div`
  position: absolute;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 100, 100, 0.3) 0%, rgba(255, 150, 100, 0.3) 100%);
`;

const CombatZone = styled.div`
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 112, 222, 0.3) 0%, rgba(0, 200, 255, 0.2) 100%);
`;

const SkillMarker = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 10;
`;

const SkillIconWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 3px solid ${props => props.$isPreCast
    ? '#ff6b6b'
    : '#0070DE'};
  box-shadow: ${props => props.$isPreCast
    ? '0 4px 12px rgba(255, 107, 107, 0.5), 0 0 16px rgba(255, 107, 107, 0.3)'
    : '0 4px 12px rgba(0, 112, 222, 0.5), 0 0 16px rgba(0, 112, 222, 0.3)'};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.15);
    box-shadow: ${props => props.$isPreCast
      ? '0 6px 16px rgba(255, 107, 107, 0.7), 0 0 24px rgba(255, 107, 107, 0.5)'
      : '0 6px 16px rgba(0, 112, 222, 0.7), 0 0 24px rgba(0, 112, 222, 0.5)'};
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const PreCastBadge = styled.div`
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 107, 107, 0.95);
  color: #fff;
  font-size: 0.6rem;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
  white-space: nowrap;
`;

const SkillInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.8);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 80px;
`;

const SkillName = styled.div`
  color: #fff;
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
`;

const SkillTime = styled.div`
  color: ${props => props.$isPreCast ? '#ff9999' : '#66b3ff'};
  font-size: 0.75rem;
  font-weight: 600;
`;

const CommentBox = styled.div`
  position: absolute;
  top: 100%;
  margin-top: 60px;
  background: rgba(0, 0, 0, 0.9);
  color: rgba(255, 255, 255, 0.85);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 12px;
  background: ${props => props.$color};
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export default OpeningTimeline;
