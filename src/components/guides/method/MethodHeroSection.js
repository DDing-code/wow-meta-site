// ============================================================
// Method.gg 스타일 Hero Section
// ============================================================
// Method.gg의 간소화된 Hero 디자인 복제
// - 작은 클래스 아이콘 + 제목
// - 패치 정보 + 업데이트 날짜
// - 최소한의 시각 효과
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const HeroContainer = styled.section`
  padding: 2rem 0 3rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
  margin-bottom: 2rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ClassIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background.surface};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 20px;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  line-height: ${props => props.theme.typography.headingLineHeight};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const PatchBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: ${props => props.theme.colors.background.elevated};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.xs};
`;

const Separator = styled.span`
  color: ${props => props.theme.colors.text.tertiary};
`;

const LastUpdate = styled.span`
  color: ${props => props.theme.colors.text.tertiary};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin: 1rem 0 0 0;
  line-height: 1.7;
`;

// ============================================================
// Main Component
// ============================================================

/**
 * MethodHeroSection - Method.gg 스타일 간소화된 Hero
 *
 * @param {string} className - 클래스 영문명
 * @param {string} classNameKo - 클래스 한글명
 * @param {string} specName - 전문화 영문명
 * @param {string} specNameKo - 전문화 한글명
 * @param {string} color - WoW 클래스 색상 (최소 사용)
 * @param {string} icon - 클래스/전문화 아이콘 (emoji)
 * @param {string} patch - 패치 버전
 * @param {string} lastUpdate - 최종 업데이트 날짜
 * @param {string} subtitle - 부제목/설명 (선택)
 */
const MethodHeroSection = ({
  className,
  classNameKo,
  specName,
  specNameKo,
  color,
  icon,
  patch,
  lastUpdate,
  subtitle
}) => {
  return (
    <HeroContainer>
      {/* Title Row */}
      <TitleRow>
        <ClassIconWrapper>
          {icon || '⚔️'}
        </ClassIconWrapper>
        <Title>
          {specNameKo} {classNameKo} The War Within {patch} 가이드
        </Title>
      </TitleRow>

      {/* Meta Row */}
      <MetaRow>
        <PatchBadge>Patch {patch}</PatchBadge>
        <Separator>•</Separator>
        <LastUpdate>Last Updated: {lastUpdate}</LastUpdate>
      </MetaRow>

      {/* Subtitle (Optional) */}
      {subtitle && (
        <Subtitle>{subtitle}</Subtitle>
      )}
    </HeroContainer>
  );
};

MethodHeroSection.propTypes = {
  className: PropTypes.string.isRequired,
  classNameKo: PropTypes.string.isRequired,
  specName: PropTypes.string.isRequired,
  specNameKo: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string,
  patch: PropTypes.string.isRequired,
  lastUpdate: PropTypes.string.isRequired,
  subtitle: PropTypes.string
};

export default MethodHeroSection;
