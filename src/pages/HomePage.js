import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gameIcons, classIcons, WowIcon } from '../utils/wowIcons';
import NewsSection from '../components/NewsSection';
import RecentGuidesSection from '../components/RecentGuidesSection';

const Container = styled.div`
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, rgba(243, 139, 168, 0.1), rgba(203, 166, 247, 0.1));
  border-radius: 20px;
  margin-bottom: 3rem;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #f38ba8, #cba6f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 2rem;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f38ba8, #cba6f7);
  color: ${props => props.theme.colors.primary};
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
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

const PatchSection = styled.section`
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 15px;
  margin: 3rem 0;
`;

const PatchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PatchTitle = styled.h2`
  font-size: 2rem;
`;

const PatchBadge = styled.span`
  background: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.primary};
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  font-weight: 700;
`;

const PatchContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const PatchItem = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
`;

const PatchItemTitle = styled.h4`
  color: ${props => props.theme.colors.accent};
  margin-bottom: 0.5rem;
`;

const PatchItemList = styled.ul`
  list-style: none;
  color: ${props => props.theme.colors.subtext};

  li {
    padding: 0.3rem 0;
    &:before {
      content: "→ ";
      color: ${props => props.theme.colors.accent};
    }
  }
`;

const ClassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const ClassIcon = styled(Link)`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    border-color: ${props => props.color};
    transform: scale(1.05);
  }
`;

const ClassName = styled.div`
  color: ${props => props.color};
  font-weight: 600;
  margin-top: 0.5rem;
  font-size: 0.9rem;
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

  const classes = [
    { name: '죽음기사', engName: 'deathknight', color: '#C41E3A' },
    { name: '악마사냥꾼', engName: 'demonhunter', color: '#A330C9' },
    { name: '드루이드', engName: 'druid', color: '#FF7C0A' },
    { name: '기원사', engName: 'evoker', color: '#33937F' },
    { name: '사냥꾼', engName: 'hunter', color: '#AAD372' },
    { name: '마법사', engName: 'mage', color: '#3FC7EB' },
    { name: '수도사', engName: 'monk', color: '#00FF98' },
    { name: '성기사', engName: 'paladin', color: '#F48CBA' },
    { name: '사제', engName: 'priest', color: '#FFFFFF' },
    { name: '도적', engName: 'rogue', color: '#FFF468' },
    { name: '주술사', engName: 'shaman', color: '#0070DD' },
    { name: '흑마법사', engName: 'warlock', color: '#8788EE' },
    { name: '전사', engName: 'warrior', color: '#C69B6D' }
  ];

  return (
    <Container>
      <HeroSection>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          WoW 11.2 직업 공략 & 로그 분석
        </Title>
        <Subtitle>케이레스의 유령 - 상세 공략과 성능 분석</Subtitle>
        <CTAButton to="/classes">
          직업 공략 보기 →
        </CTAButton>
      </HeroSection>

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

      <PatchSection>
        <PatchHeader>
          <PatchTitle>패치 11.2.0 주요 변경사항</PatchTitle>
          <PatchBadge>NEW</PatchBadge>
        </PatchHeader>
        <PatchContent>
          <PatchItem>
            <PatchItemTitle>새로운 레이드</PatchItemTitle>
            <PatchItemList>
              <li>마나단조 오메가 (8보스)</li>
              <li>신규 티어 세트 추가</li>
              <li>영웅 특성 시너지 강화</li>
            </PatchItemList>
          </PatchItem>
          <PatchItem>
            <PatchItemTitle>신화+ 시즌 3</PatchItemTitle>
            <PatchItemList>
              <li>새로운 던전 로테이션</li>
              <li>어픽스 시스템 개편</li>
              <li>보상 구조 개선</li>
            </PatchItemList>
          </PatchItem>
          <PatchItem>
            <PatchItemTitle>클래스 밸런스</PatchItemTitle>
            <PatchItemList>
              <li>언홀리 DK 버프</li>
              <li>화법 너프</li>
              <li>수양사제 리워크</li>
            </PatchItemList>
          </PatchItem>
          <PatchItem>
            <PatchItemTitle>PvP 변경사항</PatchItemTitle>
            <PatchItemList>
              <li>새로운 PvP 시즌</li>
              <li>솔로 셔플 개선</li>
              <li>명예 시스템 리워크</li>
            </PatchItemList>
          </PatchItem>
        </PatchContent>
      </PatchSection>

      <RecentGuidesSection />

      <NewsSection />

      <section>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>클래스 선택</h2>
        <ClassGrid>
          {classes.map(cls => (
            <ClassIcon key={cls.engName} to={`/class/${cls.engName}`} color={cls.color}>
              <WowIcon icon={classIcons[cls.engName]} size={50} />
              <ClassName color={cls.color}>{cls.name}</ClassName>
            </ClassIcon>
          ))}
        </ClassGrid>
      </section>
    </Container>
  );
}

export default HomePage;