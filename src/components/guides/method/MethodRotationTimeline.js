// ============================================================
// Method.gg 스타일 Rotation Timeline - Enhanced Version
// ============================================================
// 수평 타임라인 형태의 스킬 로테이션 시각화
// - Precast 섹션
// - 메인 로테이션 시퀀스
// - 상단 쿨다운 브래킷
// - 고급 애니메이션 및 호버 효과
// - 반응형 디자인
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import SkillTooltip from '../../SkillTooltip';

// ============================================================
// Keyframe Animations
// ============================================================

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.6;
    box-shadow: 0 0 8px rgba(63, 199, 235, 0.3);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 16px rgba(63, 199, 235, 0.5);
  }
`;

const arrowFlow = keyframes`
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
`;

// ============================================================
// Styled Components
// ============================================================

const TimelineContainer = styled.div`
  width: 100%;
  padding: 1.5rem;
  position: relative;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background.surface} 0%,
    ${props => props.theme.colors.background.default} 100%
  );
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin: 1.5rem 0;
  overflow-x: auto;
  overflow-y: visible;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(63, 199, 235, 0.1);
  animation: ${fadeIn} 0.6s ease-out;

  /* Chart Grid Background */
  background-image:
    linear-gradient(135deg, ${props => props.theme.colors.background.surface} 0%, ${props => props.theme.colors.background.default} 100%),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 119px,
      rgba(63, 199, 235, 0.03) 119px,
      rgba(63, 199, 235, 0.03) 120px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 39px,
      rgba(63, 199, 235, 0.02) 39px,
      rgba(63, 199, 235, 0.02) 40px
    );
  background-blend-mode: normal, normal, normal;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.default};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border.default};
    border-radius: 4px;
    transition: background 0.2s ease;

    &:hover {
      background: ${props => props.theme.colors.accent.blue};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.25rem;
  }
`;

const TimelineTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 1.5rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.accent.blue} 0%,
    ${props => props.theme.colors.accent.blueLight} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
    margin-bottom: 1rem;
    letter-spacing: 1px;
  }
`;

const TimelineWrapper = styled.div`
  position: relative;
  min-width: fit-content;
  padding-top: 65px; /* 쿨다운 레이어 공간 */
  padding-bottom: 1rem;
`;

const CooldownLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  pointer-events: none;
  z-index: 10;
`;

const CooldownBracket = styled.div`
  position: absolute;
  top: 0;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: all;
  animation: ${fadeIn} 0.8s ease-out;
  transition: all 0.3s ease;

  /* 브래킷 상단 연결선 (enhanced) */
  &::before {
    content: '';
    position: absolute;
    top: 38px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      rgba(63, 199, 235, 0.5) 0%,
      rgba(63, 199, 235, 1) 50%,
      rgba(63, 199, 235, 0.5) 100%
    );
    border-radius: 3px;
    box-shadow:
      0 0 12px rgba(63, 199, 235, 0.5),
      0 0 24px rgba(63, 199, 235, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2);
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }

  /* 브래킷 왼쪽 끝 (enhanced) */
  &::after {
    content: '';
    position: absolute;
    top: 28px;
    left: -2px;
    width: 4px;
    height: 18px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(63, 199, 235, 0.8) 20%,
      ${props => props.theme.colors.accent.blue} 50%,
      rgba(63, 199, 235, 0.8) 80%,
      transparent 100%
    );
    border-radius: 3px;
    box-shadow:
      0 0 10px rgba(63, 199, 235, 0.6),
      0 0 20px rgba(63, 199, 235, 0.3);
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:hover::before {
    box-shadow:
      0 0 16px rgba(63, 199, 235, 0.7),
      0 0 32px rgba(63, 199, 235, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CooldownEndCap = styled.div`
  position: absolute;
  top: 28px;
  right: -2px;
  width: 4px;
  height: 18px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(63, 199, 235, 0.8) 20%,
    ${props => props.theme.colors.accent.blue} 50%,
    rgba(63, 199, 235, 0.8) 80%,
    transparent 100%
  );
  border-radius: 3px;
  box-shadow:
    0 0 10px rgba(63, 199, 235, 0.6),
    0 0 20px rgba(63, 199, 235, 0.3);
  transition: all 0.3s ease;
`;

const CooldownIcon = styled.div`
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 2px 8px rgba(63, 199, 235, 0.4));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 4px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: radial-gradient(
    circle at center,
    rgba(63, 199, 235, 0.08) 0%,
    transparent 70%
  );

  /* Icon glow ring */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    border-radius: ${props => props.theme.borderRadius.md};
    background: radial-gradient(
      circle at center,
      rgba(63, 199, 235, 0.15) 0%,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px) scale(1.15);
    filter: drop-shadow(0 6px 16px rgba(63, 199, 235, 0.6));
    background: radial-gradient(
      circle at center,
      rgba(63, 199, 235, 0.15) 0%,
      rgba(63, 199, 235, 0.05) 70%
    );
  }

  &:hover::before {
    opacity: 1;
  }
`;

const MainTimeline = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 1rem 0;
  position: relative;
  z-index: 1;

  /* Timeline Axis Line */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(63, 199, 235, 0.2) 10%,
      rgba(63, 199, 235, 0.3) 50%,
      rgba(63, 199, 235, 0.2) 90%,
      transparent 100%
    );
    z-index: 0;
    pointer-events: none;
  }

  /* Flow Indicator Dots */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(63, 199, 235, 0.4) 0px,
      rgba(63, 199, 235, 0.4) 4px,
      transparent 4px,
      transparent 12px
    );
    z-index: 0;
    pointer-events: none;
    animation: ${arrowFlow} 2s ease-in-out infinite;
  }
`;

const PrecastSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
  padding: 10px 12px;
  background: linear-gradient(
    135deg,
    rgba(63, 199, 235, 0.08) 0%,
    rgba(63, 199, 235, 0.03) 100%
  );
  border: 1px solid rgba(63, 199, 235, 0.25);
  border-radius: ${props => props.theme.borderRadius.md};
  animation: ${slideIn} 0.5s ease-out;
  transition: all 0.3s ease;
  position: relative;
  box-shadow:
    0 2px 8px rgba(63, 199, 235, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  /* Priority Badge */
  &::before {
    content: 'PREP';
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    background: linear-gradient(135deg, rgba(63, 199, 235, 0.9), rgba(63, 199, 235, 0.7));
    color: #0a0e14;
    border-radius: 4px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 6px rgba(63, 199, 235, 0.4);
  }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(63, 199, 235, 0.12) 0%,
      rgba(63, 199, 235, 0.06) 100%
    );
    border-color: rgba(63, 199, 235, 0.5);
    box-shadow:
      0 4px 16px rgba(63, 199, 235, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const PrecastLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.accent.blue};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  white-space: nowrap;
  text-shadow:
    0 0 8px rgba(63, 199, 235, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0.95;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
`;

const TimelineSeparator = styled.div`
  width: 3px;
  height: 90px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(63, 199, 235, 0.2) 10%,
    rgba(63, 199, 235, 0.5) 50%,
    rgba(63, 199, 235, 0.2) 90%,
    transparent 100%
  );
  margin: 0 20px;
  flex-shrink: 0;
  position: relative;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(63, 199, 235, 0.2);

  /* Center node with pulse animation */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    background: linear-gradient(
      135deg,
      rgba(63, 199, 235, 0.9) 0%,
      rgba(63, 199, 235, 0.7) 100%
    );
    border-radius: 50%;
    box-shadow:
      0 0 16px rgba(63, 199, 235, 0.6),
      0 0 24px rgba(63, 199, 235, 0.4),
      inset 0 1px 2px rgba(255, 255, 255, 0.3);
    animation: ${pulseGlow} 2.5s ease-in-out infinite;
  }

  /* Outer glow ring */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border: 2px solid rgba(63, 199, 235, 0.3);
    border-radius: 50%;
    animation: ${pulseGlow} 2.5s ease-in-out infinite;
    animation-delay: 0.3s;
  }
`;

const SkillSlot = styled.div`
  flex-shrink: 0;
  position: relative;
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${props => props.delay}ms;
  animation-fill-mode: both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 6px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: radial-gradient(
    circle at center,
    rgba(63, 199, 235, 0.05) 0%,
    transparent 70%
  );
  box-shadow: 0 0 0 1px rgba(63, 199, 235, 0.1);

  /* Subtle glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% + 12px);
    height: calc(100% + 12px);
    background: radial-gradient(
      circle at center,
      rgba(63, 199, 235, 0.1) 0%,
      transparent 60%
    );
    border-radius: ${props => props.theme.borderRadius.md};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px) scale(1.1);
    filter: drop-shadow(0 6px 16px rgba(63, 199, 235, 0.4));
    background: radial-gradient(
      circle at center,
      rgba(63, 199, 235, 0.12) 0%,
      rgba(63, 199, 235, 0.03) 70%
    );
    box-shadow:
      0 0 0 1px rgba(63, 199, 235, 0.3),
      0 0 20px rgba(63, 199, 235, 0.2);
    z-index: 5;
  }

  &:hover::after {
    opacity: 1;
  }

  /* 스킬 번호 표시 */
  &::before {
    content: attr(data-index);
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.text.tertiary};
    opacity: 0;
    transition: all 0.3s ease;
    background: rgba(63, 199, 235, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  &:hover::before {
    opacity: 1;
    bottom: -26px;
  }
`;

const Arrow = styled.div`
  width: 24px;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(63, 199, 235, 0.2) 0%,
    rgba(63, 199, 235, 0.6) 50%,
    rgba(63, 199, 235, 0.8) 100%
  );
  flex-shrink: 0;
  margin: 0 4px;
  position: relative;
  animation: ${arrowFlow} 2s ease-in-out infinite;
  animation-delay: ${props => props.delay}ms;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(63, 199, 235, 0.3);

  /* Flow glow */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(63, 199, 235, 0.2) 50%,
      rgba(63, 199, 235, 0.4) 100%
    );
    filter: blur(4px);
    opacity: 0.7;
  }

  /* Enhanced Arrow Head */
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 7px solid rgba(63, 199, 235, 0.8);
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    filter: drop-shadow(0 0 4px rgba(63, 199, 235, 0.6));
  }
`;

// ============================================================
// Main Component
// ============================================================

/**
 * MethodRotationTimeline - 수평 타임라인 스킬 로테이션 (Enhanced)
 *
 * @param {string} title - 타임라인 제목
 * @param {Array} precast - Precast 스킬 배열 [{ skillId, label }]
 * @param {Array} timeline - 메인 로테이션 스킬 ID 배열 [skillId1, skillId2, ...]
 * @param {Array} cooldowns - 쿨다운 브래킷 배열
 *   [{ skillId, startIndex, endIndex }]
 */
const MethodRotationTimeline = ({
  title,
  precast = [],
  timeline = [],
  cooldowns = []
}) => {
  // 아이콘 크기 및 간격 설정
  const ICON_SIZE = 72; // hero size (48px에서 50% 증가)
  const ICON_GAP = 120; // 아이콘 간 간격 (icon + arrow 포함, 비례 증가)
  const PRECAST_WIDTH = 240; // Precast 섹션 너비 (비례 증가)
  const SEPARATOR_WIDTH = 72; // 구분선 너비 (비례 증가)

  // 쿨다운 브래킷 위치 계산
  const calculateCooldownPosition = (startIndex, endIndex) => {
    const baseOffset = PRECAST_WIDTH + SEPARATOR_WIDTH;
    const left = baseOffset + (startIndex * ICON_GAP);
    const width = ((endIndex - startIndex) * ICON_GAP) + ICON_SIZE;
    return { left, width };
  };

  return (
    <TimelineContainer>
      {title && <TimelineTitle>{title}</TimelineTitle>}

      <TimelineWrapper>
        {/* 쿨다운 레이어 */}
        {cooldowns.length > 0 && (
          <CooldownLayer>
            {cooldowns.map((cd, idx) => {
              const { left, width } = calculateCooldownPosition(cd.startIndex, cd.endIndex);
              return (
                <CooldownBracket key={`cd-${idx}`} left={left} width={width}>
                  <CooldownIcon>
                    <SkillTooltip skillId={cd.skillId} size="medium" />
                  </CooldownIcon>
                  <CooldownEndCap />
                </CooldownBracket>
              );
            })}
          </CooldownLayer>
        )}

        {/* 메인 타임라인 */}
        <MainTimeline>
          {/* Precast 섹션 */}
          {precast.length > 0 && (
            <>
              <PrecastSection>
                <PrecastLabel>{precast[0].label || 'Precast'}</PrecastLabel>
                <SkillSlot delay={0}>
                  <SkillTooltip skillId={precast[0].skillId} size="large" />
                </SkillSlot>
              </PrecastSection>

              <TimelineSeparator />
            </>
          )}

          {/* 로테이션 스킬 시퀀스 */}
          {timeline.map((skillId, index) => (
            <React.Fragment key={`skill-${index}`}>
              <SkillSlot
                delay={100 + (index * 50)}
                data-index={index + 1}
              >
                <SkillTooltip skillId={skillId} size="large" />
              </SkillSlot>
              {index < timeline.length - 1 && (
                <Arrow delay={150 + (index * 50)} />
              )}
            </React.Fragment>
          ))}
        </MainTimeline>
      </TimelineWrapper>
    </TimelineContainer>
  );
};

MethodRotationTimeline.propTypes = {
  title: PropTypes.string,
  precast: PropTypes.arrayOf(
    PropTypes.shape({
      skillId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string
    })
  ),
  timeline: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  cooldowns: PropTypes.arrayOf(
    PropTypes.shape({
      skillId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      startIndex: PropTypes.number.isRequired,
      endIndex: PropTypes.number.isRequired
    })
  )
};

export default MethodRotationTimeline;
