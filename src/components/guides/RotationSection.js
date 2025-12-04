// ============================================================
// RotationSection Component - 다크 아카데믹 스타일 딜사이클 섹션
// ============================================================
// styled-components 기반 재구축
// 탭 형태로 오프닝/우선순위/광역/쿨다운 표시
// ============================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.subsection} 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: ${props => props.theme.spacing.paragraph};
  overflow-x: auto;
  padding-bottom: 0.5rem;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.surface};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border.muted};
    border-radius: ${props => props.theme.borderRadius.full};
  }
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily.base};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  white-space: nowrap;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  border: ${props => props.isActive ? `1px solid ${props.activeColor}` : `1px solid transparent`};
  background: ${props => {
    if (props.isActive) return `${props.activeColor}30`;
    return props.theme.colors.background.surface;
  }};
  color: ${props => {
    if (props.isActive) return props.activeColor;
    return props.theme.colors.text.secondary;
  }};
  box-shadow: ${props => props.isActive ? props.theme.shadows.card : 'none'};

  &:hover {
    background: ${props => {
      if (props.isActive) return `${props.activeColor}30`;
      return props.theme.colors.background.elevated;
    }};
    color: ${props => {
      if (props.isActive) return props.activeColor;
      return props.theme.colors.text.primary;
    }};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.6rem 1.2rem;
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

const TabIcon = styled.span`
  margin-right: 0.5rem;
`;

const ContentCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.cardPadding};
  box-shadow: ${props => props.theme.shadows.card};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const ContentTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepsList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const StepNumber = styled.span`
  display: flex;
  align-items: center;
  justify-center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => `${props.color}30`};
  border: 2px solid ${props => props.color};
  color: ${props => props.color};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  flex-shrink: 0;
  font-family: ${props => props.theme.typography.fontFamily.mono};
`;

const StepContent = styled.div`
  flex: 1;
  padding-top: 0.125rem;
`;

const StepText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0;
`;

const DescriptionText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0;
`;

// ============================================================
// Main Component
// ============================================================

/**
 * RotationSection - 다크 아카데믹 스타일 딜사이클 섹션
 *
 * @param {Object} rotation - 딜사이클 데이터 (opener, priority, aoe, cooldowns)
 * @param {string} color - WoW 클래스 색상
 * @param {number} sectionNumber - 섹션 번호 (Icy Veins 스타일)
 */
const RotationSection = ({ rotation, color, sectionNumber }) => {
  const [activeTab, setActiveTab] = useState('opener');

  // rotation이 없을 때도 빈 배열로 안전하게 처리
  const tabs = rotation ? [
    { id: 'opener', label: '오프닝', icon: '🎬', data: rotation.opener },
    { id: 'priority', label: '우선순위', icon: '📋', data: rotation.priority },
    { id: 'aoe', label: '광역', icon: '💥', data: rotation.aoe },
    { id: 'cooldowns', label: '쿨다운', icon: '⏰', data: rotation.cooldowns }
  ].filter(tab => tab.data) : [];

  // 첫 번째 탭을 기본 활성 탭으로 설정
  React.useEffect(() => {
    if (tabs.length > 0 && !tabs.find(tab => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  // 모든 Hook 이후에 early return
  if (!rotation) {
    return null;
  }

  return (
    <>
      <SectionTitle>
        <span>🔄</span>
        {sectionNumber && `${sectionNumber}. `}딜사이클
      </SectionTitle>

      {/* Tabs */}
      <TabsContainer>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            isActive={activeTab === tab.id}
            activeColor={color}
          >
            <TabIcon>{tab.icon}</TabIcon>
            {tab.label}
          </TabButton>
        ))}
      </TabsContainer>

      {/* Content */}
      <ContentCard>
        {tabs.map((tab) => {
          if (activeTab !== tab.id) return null;

          return (
            <div key={tab.id}>
              <ContentTitle>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </ContentTitle>

              {Array.isArray(tab.data) ? (
                <StepsList>
                  {tab.data.map((step, index) => (
                    <StepItem key={index}>
                      <StepNumber color={color}>
                        {index + 1}
                      </StepNumber>
                      <StepContent>
                        <StepText>{step}</StepText>
                      </StepContent>
                    </StepItem>
                  ))}
                </StepsList>
              ) : typeof tab.data === 'string' ? (
                <DescriptionText>{tab.data}</DescriptionText>
              ) : null}
            </div>
          );
        })}
      </ContentCard>
    </>
  );
};

RotationSection.propTypes = {
  rotation: PropTypes.shape({
    opener: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    priority: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    aoe: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    cooldowns: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
  }),
  color: PropTypes.string.isRequired
};

export default RotationSection;
