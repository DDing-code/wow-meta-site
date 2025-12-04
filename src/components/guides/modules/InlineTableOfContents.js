import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colorSystem, typography, borderRadius, transitions, shadows } from '../../../styles/designSystem';

const TocContainer = styled(motion.nav)`
  background: rgba(26, 31, 58, 0.8); /* 논문 스타일 - 불투명도 증가 */
  backdrop-filter: blur(4px); /* 논문 스타일 - glassmorphism 감소 */
  border: 1px solid ${colorSystem.border.default};
  border-radius: ${borderRadius.DEFAULT};
  padding: 1.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4); /* 논문 스타일 - 미묘한 그림자 */

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const TocTitle = styled.h2`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colorSystem.primary.main};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📑';
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const TocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TocItem = styled.li`
  margin: 0;
`;

const TocLink = styled.a`
  display: block;
  padding: 0.75rem 1rem;
  color: ${props => props.isActive ? colorSystem.primary.main : colorSystem.text.secondary};
  background: ${props => props.isActive ? colorSystem.primary.subtle : 'transparent'};
  border-left: 3px solid ${props => props.isActive ? colorSystem.primary.main : 'transparent'};
  text-decoration: none;
  font-size: ${typography.fontSize.sm};
  font-weight: ${props => props.isActive ? typography.fontWeight.semibold : typography.fontWeight.regular};
  transition: ${transitions.all.fast};
  border-radius: ${borderRadius.DEFAULT};
  cursor: pointer;

  &:hover {
    color: ${colorSystem.primary.main};
    background: ${colorSystem.primary.subtle};
    border-left-color: ${colorSystem.primary.main};
    transform: translateX(2px);
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const TocNumber = styled.span`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  background: ${props => props.isActive ? colorSystem.primary.main : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isActive ? colorSystem.text.primary : colorSystem.text.tertiary};
  border-radius: ${borderRadius.full};
  text-align: center;
  line-height: 1.5rem;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  margin-right: 0.75rem;
  transition: ${transitions.all.fast};
`;

/**
 * InlineTableOfContents - 블로그 스타일 인라인 목차 컴포넌트
 *
 * 페이지 상단에 표시되는 네비게이션으로, 스크롤 위치에 따라 활성 섹션을 추적.
 * 그리드 레이아웃으로 깔끔한 정리, 모바일에서는 단일 컬럼으로 최적화.
 *
 * @param {Array<string>} sections - 섹션 ID 배열 (예: ['overview', 'rotation', 'talents'])
 * @param {Object} sectionTitles - 섹션 ID → 한국어 제목 매핑 (예: { overview: '개요' })
 */
export default function InlineTableOfContents({ sections, sectionTitles }) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // 현재 스크롤 위치 기준으로 가장 가까운 섹션 찾기
      const scrollPosition = window.scrollY + 150; // 헤더 오프셋

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);

        if (element) {
          const offsetTop = element.offsetTop;

          if (scrollPosition >= offsetTop) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    // 초기 활성 섹션 설정
    handleScroll();

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  const handleClick = (e, sectionId) => {
    e.preventDefault();

    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // 헤더 오프셋
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <TocContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <TocTitle>목차</TocTitle>
      <TocList>
        {sections.map((sectionId, index) => (
          <TocItem key={sectionId}>
            <TocLink
              href={`#${sectionId}`}
              onClick={(e) => handleClick(e, sectionId)}
              isActive={activeSection === sectionId}
            >
              <TocNumber isActive={activeSection === sectionId}>
                {index + 1}
              </TocNumber>
              {sectionTitles[sectionId] || sectionId}
            </TocLink>
          </TocItem>
        ))}
      </TocList>
    </TocContainer>
  );
}
