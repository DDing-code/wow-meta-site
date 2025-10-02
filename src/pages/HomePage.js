import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gameIcons, WowIcon } from '../utils/wowIcons';
import NewsSection from '../components/NewsSection';
import RecentGuidesSection from '../components/RecentGuidesSection';

const Container = styled.div`
  padding: 0;
  min-height: 100vh;
`;

const HeroSection = styled.div`
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    rgba(243, 139, 168, 0.1) 0%,
    rgba(203, 166, 247, 0.1) 50%,
    rgba(137, 180, 250, 0.1) 100%
  );
  overflow: hidden;
  margin-bottom: 4rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(243, 139, 168, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(203, 166, 247, 0.15) 0%, transparent 50%);
    animation: pulse 8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const TitleWrapper = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
`;

const MainTitle = styled(motion.h1)`
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  background: ${props => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: -0.03em;
  margin: 0;
  text-shadow: 0 0 60px rgba(243, 139, 168, 0.3);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: ${props => props.theme.gradients.accent};
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(243, 139, 168, 0.5);
  }
`;

const ContentSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 6rem;
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
      iconUrl: gameIcons.legendary,
      title: "뉴스",
      link: "/news"
    },
    {
      iconUrl: gameIcons.raid,
      title: "직업 가이드",
      link: "/guide"
    },
    {
      iconUrl: gameIcons.instant,
      title: "스킬 DB",
      link: "/spells"
    },
    {
      iconUrl: gameIcons.achievement,
      title: "로그 분석",
      link: "/log-analyzer"
    }
  ];

  return (
    <Container>
      <HeroSection>
        <TitleWrapper>
          <MainTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            WoW Meta
          </MainTitle>
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
                <WowIcon icon={feature.iconUrl} size={50} />
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
