import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WowIcon, classIcons } from '../utils/wowIcons';
import { getRecentGuides } from '../data/guidesMetadata';

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
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

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
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const UpdateDate = styled.span`
  color: ${props => props.theme.colors.subtext};
  font-size: 0.85rem;
`;

function RecentGuidesSection() {
  // 자동으로 최신 4개 가이드를 가져옵니다
  const recentGuides = getRecentGuides(4);

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
              <UpdateDate>📅 {guide.updateDate}</UpdateDate>
            </GuideMeta>
          </GuideCard>
        ))}
      </GuidesGrid>
    </Section>
  );
}

export default RecentGuidesSection;
