import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// BeastMasteryLayoutIntegrated와 동일한 통일된 테마
const defaultTheme = {
  colors: {
    primary: '#AAD372',      // 기본값 - 각 클래스별로 오버라이드
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    textSecondary: '#a0a0a0',
    subtext: '#a0a0a0',
    accent: '#AAD372',
    border: '#2a2a3e',
    hover: 'rgba(170, 211, 114, 0.1)',
    success: '#4caf50',
    danger: '#f44336',
    warning: '#ff9800',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  }
};

// 글로벌 스타일 (BeastMasteryLayoutIntegrated와 동일)
const GlobalStyle = createGlobalStyle`
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// 페이지 래퍼
const PageWrapper = styled.div`
  min-height: 100vh;
  color: ${props => props.theme.colors.text};
  display: flex;
`;

// 사이드바 (BeastMasteryLayoutIntegrated와 동일)
const Sidebar = styled.nav`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  max-height: 80vh;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  border-radius: 0 8px 8px 0;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg} 0;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavSection = styled.div`
  padding: 0 ${props => props.theme.spacing.lg};
`;

const NavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.md};
  margin: 0.2rem 0;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  background: ${props => props.active ? props.theme.colors.hover : 'transparent'};
  transition: all 0.2s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '600' : '400'};
  opacity: ${props => props.disabled ? '0.5' : '1'};

  &:hover {
    background: ${props => props.disabled ? 'transparent' : props.theme.colors.hover};
    color: ${props => props.disabled ? props.theme.colors.text : props.theme.colors.primary};
  }
`;

// 메인 콘텐츠 영역
const MainContent = styled.main`
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${props => props.theme.spacing.md} 0;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 3000px;
  padding: 0 0.5rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

// 헤더 섹션 제거 - BeastMasteryLayoutIntegrated와 통일

const Section = styled.section`
  width: 100%;
  margin-bottom: 1rem;
  scroll-margin-top: 120px;
`;

const SectionHeader = styled.div`
  background: linear-gradient(to right, ${props => props.theme.colors.hover}, transparent);
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  margin-bottom: 0.5rem;
  width: 100%;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    border-radius: 4px;
  }
`;

// GuideLayout 컴포넌트
const GuideLayout = ({
  title = '가이드',
  author = 'WoWMeta',
  lastUpdated = '2025.09.27',
  theme = {},
  sections = [],
  activeSection: controlledActiveSection,
  onSectionChange,
  children
}) => {
  const [internalActiveSection, setInternalActiveSection] = useState('overview');

  // 외부 제어 또는 내부 상태 사용
  const activeSection = controlledActiveSection !== undefined ? controlledActiveSection : internalActiveSection;
  const handleSectionChange = (sectionId) => {
    if (sections.find(s => s.id === sectionId && s.disabled)) {
      return; // 비활성 섹션 클릭 방지
    }

    if (onSectionChange) {
      onSectionChange(sectionId);
    } else {
      setInternalActiveSection(sectionId);
    }
  };

  // 테마 병합 (전달받은 테마가 defaultTheme를 오버라이드)
  const mergedTheme = {
    ...defaultTheme,
    ...theme,
    colors: {
      ...defaultTheme.colors,
      ...(theme.colors || {}),
      // primary와 accent는 함께 변경
      accent: theme.primary || defaultTheme.colors.accent,
      hover: theme.primary ? `rgba(${parseInt(theme.primary.slice(1, 3), 16)}, ${parseInt(theme.primary.slice(3, 5), 16)}, ${parseInt(theme.primary.slice(5, 7), 16)}, 0.1)` : defaultTheme.colors.hover
    }
  };

  return (
    <ThemeProvider theme={mergedTheme}>
      <GlobalStyle />
      <PageWrapper>
        {/* 사이드바 네비게이션 */}
        <Sidebar>
          <NavSection>
            {sections.map(section => (
              <NavItem
                key={section.id}
                active={activeSection === section.id}
                disabled={section.disabled}
                onClick={() => !section.disabled && handleSectionChange(section.id)}
              >
                {section.title}
                {section.disabled && ' (준비 중)'}
              </NavItem>
            ))}
          </NavSection>
        </Sidebar>

        {/* 메인 콘텐츠 영역 */}
        <MainContent>
          <ContentContainer>
            {/* 가이드 제목 및 메타 정보 - BeastMasteryLayoutIntegrated와 동일 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem',
              paddingTop: '2rem'
            }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '900',
                background: `linear-gradient(135deg, ${mergedTheme.colors.primary} 0%, ${mergedTheme.colors.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                textShadow: `0 0 30px ${mergedTheme.colors.primary}30`
              }}>
                {title}
              </h1>
              <p style={{
                color: mergedTheme.colors.textSecondary,
                fontSize: '0.9rem'
              }}>
                최종 수정일: {lastUpdated} | 작성: {author}
              </p>
            </div>

            {/* 콘텐츠 렌더링 */}
            {children}
          </ContentContainer>
        </MainContent>
      </PageWrapper>
    </ThemeProvider>
  );
};

// 내보내기
export default GuideLayout;
export { Section, SectionHeader, SectionTitle, Card };