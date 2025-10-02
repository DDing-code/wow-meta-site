import React, { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import GuideNav from './GuideNav';
import SkillIcon from './SkillIcon';
import Toast from './Toast';

// Global animations
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

// Layout Components
const PageWrapper = styled.div`
  min-height: 100vh;
  color: ${props => props.theme.colors.text};
  display: flex;
`;

const MainContent = styled.main`
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${props => props.theme.spacing.md} 0;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 3000px;
  padding: 0 0.5rem;
  margin: 0 auto;
`;

export const Section = styled.section`
  width: 100%;
  margin-bottom: 1rem;
  scroll-margin-top: 120px;
`;

export const SectionHeader = styled.div`
  background: linear-gradient(to right, ${props => props.theme.colors.hover}, transparent);
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  margin-bottom: 0.75rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-weight: 700;
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  margin-bottom: 0.5rem;
  width: 100%;
  max-width: 100%;
`;

export const HeroCard = styled(Card)`
  background: ${props => {
    if (props.heroType === 'hero1') {
      return props.theme.heroColors?.hero1?.background || props.theme.colors.surface;
    } else if (props.heroType === 'hero2') {
      return props.theme.heroColors?.hero2?.background || props.theme.colors.surface;
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'hero1') {
      return props.theme.heroColors?.hero1?.border || props.theme.colors.border;
    } else if (props.heroType === 'hero2') {
      return props.theme.heroColors?.hero2?.border || props.theme.colors.border;
    }
    return props.theme.colors.border;
  }};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      if (props.heroType === 'hero1') {
        return props.theme.heroColors?.hero1?.gradient || 'transparent';
      } else if (props.heroType === 'hero2') {
        return props.theme.heroColors?.hero2?.gradient || 'transparent';
      }
      return 'transparent';
    }};
  }
`;

const GuideLayout = ({
  theme,
  sections,
  specName,
  className
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const sectionRefs = {
    overview: useRef(null),
    rotation: useRef(null),
    builds: useRef(null),
    stats: useRef(null),
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const isAtBottom = scrollPosition + windowHeight >= fullHeight - 100;

      if (isAtBottom) {
        setActiveSection('stats');
        return;
      }

      // Check which section is visible
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionBottom = sectionTop + rect.height;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(key);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageWrapper>
        <GuideNav
          activeSection={activeSection}
          activeSubSection={activeSubSection}
          setActiveSection={setActiveSection}
          setActiveSubSection={setActiveSubSection}
          sectionRefs={sectionRefs}
        />

        <MainContent>
          <ContentContainer>
            {sections.overview && (
              <Section ref={sectionRefs.overview} id="overview">
                {sections.overview({ SkillIcon, showToastMessage })}
              </Section>
            )}

            {sections.rotation && (
              <Section ref={sectionRefs.rotation} id="rotation">
                {sections.rotation({ SkillIcon, showToastMessage })}
              </Section>
            )}

            {sections.builds && (
              <Section ref={sectionRefs.builds} id="builds">
                {sections.builds({ SkillIcon, showToastMessage })}
              </Section>
            )}

            {sections.stats && (
              <Section ref={sectionRefs.stats} id="stats">
                {sections.stats({ SkillIcon, showToastMessage })}
              </Section>
            )}
          </ContentContainer>
        </MainContent>

        {showToast && <Toast message={toastMessage} />}
      </PageWrapper>
    </ThemeProvider>
  );
};

export default GuideLayout;