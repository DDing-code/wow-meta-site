import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colorSystem, typography, transitions } from '../../../styles/designSystem';

// 공통 가이드 레이아웃 컴포넌트
// 모든 클래스 가이드에서 재사용 가능

const Container = styled.div`
  min-height: 100vh;
  background: ${colorSystem.background.main};
  color: ${colorSystem.text.primary};
  font-family: ${typography.fontFamily.base};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.normal};
`;

const Header = styled.header`
  background: ${props => props.bgColor || '#1a1a2e'};
  padding: 30px 20px;
  text-align: center;
  border-bottom: 3px solid ${props => props.borderColor || '#A330C9'};
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${props => props.color || colorSystem.primary.main};
  margin: 0;
  line-height: ${typography.lineHeight.tight};
`;

const Sidebar = styled.nav`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  max-height: 80vh;
  background: ${colorSystem.background.surface};
  border-right: 1px solid ${colorSystem.border.muted};
  border-radius: 0 8px 8px 0;
  overflow-y: auto;
  padding: 20px 0;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a2e;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.color || '#A330C9'};
    border-radius: 3px;
    opacity: 0.8;
  }

  /* 모바일에서 숨기기 */
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavSection = styled.div`
  padding: 0 20px;
`;

const NavItem = styled.a`
  display: block;
  padding: 12px 15px;
  margin: 0.2rem 0;
  color: ${props => props.active ? props.color : '#e0e0e0'};
  text-decoration: none;
  border-left: 3px solid ${props => props.active ? props.color : 'transparent'};
  background: ${props => props.active ? 'rgba(255,255,255,0.05)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: rgba(255,255,255,0.05);
    color: ${props => props.color};
  }
`;

const SubNavItem = styled.a`
  display: block;
  padding: 8px 15px;
  padding-left: 40px;
  margin: 0.1rem 0;
  color: ${props => props.active ? props.color : '#a0a0a0'};
  text-decoration: none;
  border-left: 2px solid ${props => props.active ? props.color : 'transparent'};
  background: ${props => props.active ? 'rgba(255,255,255,0.03)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '500' : '400'};

  &:hover {
    background: rgba(255,255,255,0.03);
    color: ${props => props.color};
  }
`;

const Content = styled.main`
  margin-left: 260px;
  width: calc(100% - 260px);
  max-width: 800px; /* 논문 스타일 - 좁은 읽기 영역 */
  padding: 60px 80px; /* 논문 스타일 - 넉넉한 여백 */
  font-size: 1.125rem; /* 논문 스타일 - 18px */
  line-height: 1.8; /* 논문 가독성 향상 */

  /* Tablet adjustments */
  @media (max-width: 1024px) {
    padding: 40px 50px;
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: 1.5rem;
    font-size: 1rem;
    line-height: 1.7;
  }
`;

const Section = styled.section`
  margin-bottom: 5rem; /* 논문 스타일 - 80px 섹션 간격 */
  scroll-margin-top: 100px;

  /* 논문 스타일 - 섹션 구분 강화 */
  &:not(:last-child) {
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

export default function GuideLayout({
  className,
  color = '#A330C9',
  title,
  sections = ['overview', 'rotation', 'talents', 'stats'],
  sectionTitles = {
    overview: '개요',
    rotation: '딜사이클',
    talents: '특성 빌드',
    stats: '스탯 우선순위'
  },
  subsections = {}, // { rotation: ['aldrachireaver', 'felscarred'], stats: ['aldrachireaver', 'felscarred'] }
  subsectionTitles = {}, // { aldrachireaver: '알드라치 파괴자', felscarred: '지옥상흔' }
  children
}) {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubsection, setActiveSubsection] = useState('');
  const sectionRefs = useRef({});
  const subsectionRefs = useRef({});

  // 섹션별 ref 초기화
  useEffect(() => {
    sections.forEach(section => {
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef();
      }
    });

    // 하위 섹션 ref 초기화
    Object.keys(subsections).forEach(sectionKey => {
      subsections[sectionKey].forEach(subsection => {
        const key = `${sectionKey}-${subsection}`;
        if (!subsectionRefs.current[key]) {
          subsectionRefs.current[key] = React.createRef();
        }
      });
    });
  }, [sections, subsections]);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      // 하위 섹션 확인 (우선순위 높음)
      for (const sectionKey of Object.keys(subsections)) {
        for (const subsection of subsections[sectionKey]) {
          const key = `${sectionKey}-${subsection}`;
          const ref = subsectionRefs.current[key];
          if (ref && ref.current) {
            const { offsetTop, offsetHeight } = ref.current;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(sectionKey);
              setActiveSubsection(subsection);
              return;
            }
          }
        }
      }

      // 메인 섹션 확인
      for (const section of sections) {
        const ref = sectionRefs.current[section];
        if (ref && ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            setActiveSubsection('');
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, subsections]);

  const scrollToSection = (sectionId) => {
    const ref = sectionRefs.current[sectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSubsection = (sectionKey, subsection) => {
    const key = `${sectionKey}-${subsection}`;
    const ref = subsectionRefs.current[key];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container className={className}>
      <Header bgColor={`${color}10`} borderColor={color}>
        <Title color={color}>{title}</Title>
      </Header>

      <Sidebar color={color}>
        <NavSection>
          {sections.map(section => (
            <div key={section}>
              <NavItem
                active={activeSection === section}
                color={color}
                onClick={() => scrollToSection(section)}
              >
                {sectionTitles[section] || section}
              </NavItem>

              {/* 하위 섹션 */}
              {subsections[section] && subsections[section].map(subsection => (
                <SubNavItem
                  key={subsection}
                  active={activeSection === section && activeSubsection === subsection}
                  color={color}
                  onClick={() => scrollToSubsection(section, subsection)}
                >
                  {subsectionTitles[subsection] || subsection}
                </SubNavItem>
              ))}
            </div>
          ))}
        </NavSection>
      </Sidebar>

      <Content>
        {React.Children.map(children, (child, index) => {
          if (!child) return null;

          const sectionId = sections[index] || `section-${index}`;
          return (
            <Section ref={sectionRefs.current[sectionId]} id={sectionId}>
              {React.cloneElement(child, {
                subsectionRefs: subsectionRefs.current
              })}
            </Section>
          );
        })}
      </Content>
    </Container>
  );
}
