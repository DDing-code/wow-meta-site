import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NewsSection from '../components/NewsSection';
import RecentGuidesSection from '../components/RecentGuidesSection';

const Container = styled.div`
  padding: 0;
  min-height: 100vh;
`;

const HeroSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem 2rem;
`;

const TitleWrapper = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const ShieldLogo = styled.div`
  width: clamp(100px, 15vw, 150px);
  height: clamp(120px, 18vw, 180px);

  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 20px rgba(243, 139, 168, 0.3));
  }
`;

const MainTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  background: ${props => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: -0.03em;
  margin: 0;
`;

const ContentSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem 4rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.theme.gradients.accent};
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.theme.gradients.accent};
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(243, 139, 168, 0.3);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(243, 139, 168, 0.2);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 0.05;
    }
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg,
    rgba(243, 139, 168, 0.2) 0%,
    rgba(203, 166, 247, 0.2) 100%
  );
  transition: all 0.4s ease;
  font-size: 3rem;

  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    background: linear-gradient(135deg,
      rgba(243, 139, 168, 0.3) 0%,
      rgba(203, 166, 247, 0.3) 100%
    );
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: ${props => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    transform: scale(1.05);
  }
`;

function HomePage() {
  const features = [
    {
      emoji: "📰",
      title: "뉴스",
      link: "/news"
    },
    {
      emoji: "⚔️",
      title: "직업 가이드",
      link: "/guide"
    },
    {
      emoji: "⚡",
      title: "스킬 DB",
      link: "/spells"
    },
    {
      emoji: "📊",
      title: "로그 분석",
      link: "/log-analyzer"
    }
  ];

  return (
    <Container>
      <HeroSection>
        <TitleWrapper>
          <LogoContainer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <ShieldLogo>
              <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="mainShieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F38BA8" />
                    <stop offset="50%" stopColor="#CBA6F7" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
                <path d="M50 5 L90 20 L90 55 Q90 85 50 115 Q10 85 10 55 L10 20 Z"
                      stroke="url(#mainShieldGradient)"
                      strokeWidth="5"
                      fill="none"/>
                <text x="50" y="75"
                      fontFamily="Arial, sans-serif"
                      fontSize="48"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="url(#mainShieldGradient)">W</text>
              </svg>
            </ShieldLogo>
            <MainTitle>WoW Meta</MainTitle>
          </LogoContainer>
        </TitleWrapper>
      </HeroSection>

      <ContentSection>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              as={Link}
              to={feature.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
              style={{ textDecoration: 'none' }}
            >
              <IconWrapper>
                {feature.emoji}
              </IconWrapper>
              <FeatureTitle>{feature.title}</FeatureTitle>
            </FeatureCard>
          ))}
        </FeaturesGrid>

        <RecentGuidesSection />

        <NewsSection />
      </ContentSection>
    </Container>
  );
}

export default HomePage;
