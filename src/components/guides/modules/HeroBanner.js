import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colorSystem, typography, borderRadius, transitions } from '../../../styles/designSystem';

const BannerContainer = styled(motion.div)`
  background: ${colorSystem.background.surface}; /* 논문 스타일 - 단순 배경 */
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
  border-radius: 0;
  border-bottom: 2px solid ${colorSystem.primary.main}; /* 논문 스타일 - 구조적 구분선 */

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['4xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colorSystem.text.primary};
  margin: 0 0 1rem 0;
  font-family: 'Poppins', 'Inter', 'Noto Sans KR', sans-serif;
  line-height: ${typography.lineHeight.tight};

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colorSystem.text.secondary};
  margin: 0 0 2rem 0;
  font-weight: ${typography.fontWeight.regular};
  line-height: ${typography.lineHeight.normal};

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const MetadataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  font-size: ${typography.fontSize.sm};
  color: ${colorSystem.text.tertiary};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1.5rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    font-size: 0.85rem;
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
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
  }

  &:first-child::before {
    display: none;
  }

  @media (max-width: 480px) {
    &::before {
      display: none;
    }
  }
`;

const DifficultyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: ${props => {
    switch (props.difficulty) {
      case '초급': return 'rgba(16, 185, 129, 0.2)';  // colorSystem.semantic.success
      case '중급': return 'rgba(245, 158, 11, 0.2)';  // colorSystem.semantic.warning
      case '상급': return 'rgba(239, 68, 68, 0.2)';   // colorSystem.semantic.error
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.difficulty) {
      case '초급': return colorSystem.semantic.success;
      case '중급': return colorSystem.semantic.warning;
      case '상급': return colorSystem.semantic.error;
      default: return colorSystem.text.secondary;
    }
  }};
  border-radius: ${borderRadius.DEFAULT};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.sm};
`;

/**
 * HeroBanner - 블로그 스타일 가이드 헤더 컴포넌트
 *
 * 학술 논문을 블로그 포스트로 변환하는 "논문→블로그" 디자인 철학을 구현.
 * 그라데이션 배경과 메타데이터로 전문성과 신뢰성을 동시에 표현.
 *
 * @param {string} title - 가이드 제목 (예: "파멸 악마사냥꾼 가이드")
 * @param {string} subtitle - 부제목 (예: "TWW 시즌 3 - 심화 분석 및 최적화 전략")
 * @param {string} lastUpdated - 최종 업데이트 날짜 (예: "2025-01-10")
 * @param {string} difficulty - 난이도 ("초급" | "중급" | "상급")
 * @param {string} author - 작성자 (선택 사항)
 */
export default function HeroBanner({
  title,
  subtitle,
  lastUpdated,
  difficulty,
  author
}) {
  const bannerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const metadataVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <BannerContainer
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
    >
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}

      <MetadataContainer
        as={motion.div}
        variants={metadataVariants}
        initial="hidden"
        animate="visible"
      >
        {lastUpdated && (
          <MetadataItem>
            최종 업데이트: {lastUpdated}
          </MetadataItem>
        )}

        {difficulty && (
          <MetadataItem>
            난이도: <DifficultyBadge difficulty={difficulty}>{difficulty}</DifficultyBadge>
          </MetadataItem>
        )}

        {author && (
          <MetadataItem>
            작성자: {author}
          </MetadataItem>
        )}
      </MetadataContainer>
    </BannerContainer>
  );
}
