import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WowIcon, classIcons } from '../utils/wowIcons';

const Section = styled.section`
  margin: 4rem 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  background: linear-gradient(135deg, #f38ba8, #cba6f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ViewAllLink = styled(Link)`
  color: ${props => props.theme.colors.accent};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    gap: 1rem;
  }
`;

const GuidesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GuideCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.classColor || props.theme.colors.accent};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: ${props => props.classColor || props.theme.colors.accent};
  }
`;

const GuideHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ClassIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${props => `${props.classColor}20` || 'rgba(243, 139, 168, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${GuideCard}:hover & {
    transform: scale(1.1);
  }
`;

const GuideInfo = styled.div`
  flex: 1;
`;

const GuideTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.classColor || props.theme.colors.text};
  margin-bottom: 0.3rem;
`;

const GuideSpec = styled.div`
  color: ${props => props.theme.colors.subtext};
  font-size: 0.9rem;
`;

const GuideMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-size: 0.8rem;
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.subtext};
`;

const GuideExcerpt = styled.p`
  color: ${props => props.theme.colors.subtext};
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 1rem;
`;

const GuideFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UpdateDate = styled.span`
  color: ${props => props.theme.colors.subtext};
  font-size: 0.85rem;
`;

const ReadButton = styled.span`
  color: ${props => props.classColor || props.theme.colors.accent};
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: gap 0.3s ease;

  ${GuideCard}:hover & {
    gap: 1rem;
  }
`;

function RecentGuidesSection() {
  const recentGuides = [
    {
      id: 1,
      class: '흑마법사',
      classEng: 'warlock',
      spec: '고통',
      specEng: 'affliction',
      title: '고통 흑마법사',
      excerpt: '시들기 기반 빌드와 로테이션, 영웅 특성 선택 가이드',
      patch: '11.2',
      difficulty: '중급',
      updateDate: '2025-01-15',
      link: '/guide/warlock/affliction',
      classColor: '#8788EE'
    },
    {
      id: 2,
      class: '흑마법사',
      classEng: 'warlock',
      spec: '악마',
      specEng: 'demonology',
      title: '악마 흑마법사',
      excerpt: '악마 소환 최적화와 티란의 권능 활용법',
      patch: '11.2',
      difficulty: '고급',
      updateDate: '2025-01-14',
      link: '/guide/warlock/demonology',
      classColor: '#8788EE'
    },
    {
      id: 3,
      class: '사냥꾼',
      classEng: 'hunter',
      spec: '야수',
      specEng: 'beast-mastery',
      title: '야수 사냥꾼',
      excerpt: '펫 관리와 광기 스택 최적화 전략',
      patch: '11.2',
      difficulty: '초급',
      updateDate: '2025-01-13',
      link: '/guide/hunter/beast-mastery',
      classColor: '#AAD372'
    },
    {
      id: 4,
      class: '기원사',
      classEng: 'evoker',
      spec: '황폐',
      specEng: 'devastation',
      title: '황폐 기원사',
      excerpt: '정수 폭발 타이밍과 화염의 숨결 활용법',
      patch: '11.2',
      difficulty: '중급',
      updateDate: '2025-01-12',
      link: '/guide/evoker/devastation',
      classColor: '#33937F'
    },
    {
      id: 5,
      class: '주술사',
      classEng: 'shaman',
      spec: '정기',
      specEng: 'elemental',
      title: '정기 주술사',
      excerpt: '번개 화살과 용암 폭발 우선순위 가이드',
      patch: '11.2',
      difficulty: '중급',
      updateDate: '2025-01-11',
      link: '/guide/shaman/elemental',
      classColor: '#0070DD'
    }
  ];

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>최근 공략</SectionTitle>
        <ViewAllLink to="/guide">
          전체 공략 보기 →
        </ViewAllLink>
      </SectionHeader>

      <GuidesGrid>
        {recentGuides.map((guide, index) => (
          <GuideCard
            key={guide.id}
            as={Link}
            to={guide.link}
            classColor={guide.classColor}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GuideHeader>
              <ClassIconWrapper classColor={guide.classColor}>
                <WowIcon icon={classIcons[guide.classEng]} size={30} />
              </ClassIconWrapper>
              <GuideInfo>
                <GuideTitle classColor={guide.classColor}>{guide.title}</GuideTitle>
                <GuideSpec>{guide.spec} 전문화</GuideSpec>
              </GuideInfo>
            </GuideHeader>

            <GuideMeta>
              <MetaBadge>📌 패치 {guide.patch}</MetaBadge>
              <MetaBadge>⭐ {guide.difficulty}</MetaBadge>
            </GuideMeta>

            <GuideExcerpt>{guide.excerpt}</GuideExcerpt>

            <GuideFooter>
              <UpdateDate>📅 {guide.updateDate}</UpdateDate>
              <ReadButton classColor={guide.classColor}>
                읽기 →
              </ReadButton>
            </GuideFooter>
          </GuideCard>
        ))}
      </GuidesGrid>
    </Section>
  );
}

export default RecentGuidesSection;
