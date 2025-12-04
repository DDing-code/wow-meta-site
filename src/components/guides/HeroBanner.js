// ============================================================
// HeroBanner Component - 다크 아카데믹 스타일 히어로 배너
// ============================================================
// styled-components 기반 재구축
// 논문 스타일 헤더 + WoW 클래스 색상
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const BannerContainer = styled.header`
  background: ${props => props.theme.colors.background.surface};
  padding: 6rem 2rem;
  text-align: center;
  border-bottom: 2px solid ${props => props.classColor};
  position: relative;
  overflow: hidden;

  /* Method 스타일: 강한 오렌지 그라데이션 배경 */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      ${props => props.theme.colors.accent.orangeDark}10 0%,
      transparent 60%
    );
    pointer-events: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 4rem 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 3rem 1rem;
  }
`;

const TitleGroup = styled.div`
  position: relative;
  z-index: 1;
`;

const ClassName = styled.div`
  color: ${props => props.classColor};
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.extrabold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 1rem 0;
  font-family: ${props => props.theme.typography.fontFamily.heading};
  line-height: ${props => props.theme.typography.headingLineHeight};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 2rem 0;
  font-weight: ${props => props.theme.typography.fontWeight.regular};
  line-height: ${props => props.theme.typography.baseLineHeight};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.base};
    margin-bottom: 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.typography.fontSize.sm};
    margin-bottom: 1rem;
  }
`;

const MetadataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
  flex-wrap: wrap;
  position: relative;
  z-index: 1;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const MetadataItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
  }

  &:first-child::before {
    display: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    &::before {
      display: none;
    }
  }
`;

const MetadataLabel = styled.strong`
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

// ============================================================
// Main Component
// ============================================================

/**
 * HeroBanner - 다크 아카데믹 스타일 가이드 히어로 배너
 *
 * @param {string} className - 클래스 영문명
 * @param {string} classNameKo - 클래스 한글명
 * @param {string} specName - 전문화 영문명
 * @param {string} specNameKo - 전문화 한글명
 * @param {string} color - WoW 클래스 색상
 * @param {string} description - 간단한 설명 (선택)
 * @param {string} patch - 패치 버전
 * @param {string} lastUpdate - 최종 업데이트 날짜
 */
const HeroBanner = ({
  className,
  classNameKo,
  specName,
  specNameKo,
  color,
  description,
  patch,
  lastUpdate
}) => {
  return (
    <BannerContainer classColor={color}>
      <TitleGroup>
        <ClassName classColor={color}>
          {classNameKo} {className && `(${className})`}
        </ClassName>
        <Title>{specNameKo} 가이드</Title>
        {description && <Subtitle>{description}</Subtitle>}
      </TitleGroup>

      <MetadataContainer>
        {patch && (
          <MetadataItem>
            <MetadataLabel>패치:</MetadataLabel>
            {patch}
          </MetadataItem>
        )}
        {lastUpdate && (
          <MetadataItem>
            <MetadataLabel>최종 업데이트:</MetadataLabel>
            {lastUpdate}
          </MetadataItem>
        )}
      </MetadataContainer>
    </BannerContainer>
  );
};

HeroBanner.propTypes = {
  className: PropTypes.string.isRequired,
  classNameKo: PropTypes.string.isRequired,
  specName: PropTypes.string.isRequired,
  specNameKo: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  description: PropTypes.string,
  patch: PropTypes.string.isRequired,
  lastUpdate: PropTypes.string.isRequired
};

export default HeroBanner;
