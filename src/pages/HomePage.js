import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gameIcons, WowIcon } from '../utils/wowIcons';
import NewsSection from '../components/NewsSection';
import RecentGuidesSection from '../components/RecentGuidesSection';

const Container = styled.div`
  padding: 2rem 0;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 1rem;
`;

const MainTitle = styled.h1`
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  background: ${props => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: -0.02em;
`;

const Tagline = styled.p`
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: ${props => props.theme.colors.subtext};
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 15px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const FeatureIcon = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.subtext};
  line-height: 1.6;
`;

function HomePage() {
  const features = [
    {
      iconUrl: gameIcons.raid,
      title: "직업 공략",
      description: "모든 직업의 상세 로테이션, 빌드, 스킬 사용법을 확인하세요.",
      link: "/classes"
    },
    {
      iconUrl: gameIcons.achievement,
      title: "로그 분석",
      description: "WarcraftLogs 로그를 분석하여 개선 사항을 찾아보세요.",
      link: "/log-analyzer"
    },
    {
      iconUrl: gameIcons.instant,
      title: "스킬 데이터베이스",
      description: "모든 직업의 스킬과 특성을 한국어로 검색하고 확인할 수 있습니다.",
      link: "/spells"
    },
    {
      iconUrl: gameIcons.legendary,
      title: "티어 리스트",
      description: "최신 11.2 패치 기준 PvE/PvP 클래스 및 스펙별 티어 리스트를 확인하세요.",
      link: "/tier-list"
    }
  ];

  return (
    <Container>
      <TitleSection>
        <MainTitle>WoW Meta</MainTitle>
        <Tagline>월드 오브 워크래프트의 모든 메타 정보와 전문화 공략</Tagline>
      </TitleSection>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            as={Link}
            to={feature.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ textDecoration: 'none' }}
          >
            <FeatureIcon>
              <WowIcon icon={feature.iconUrl} size={50} />
            </FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      <RecentGuidesSection />

      <NewsSection />
    </Container>
  );
}

export default HomePage;