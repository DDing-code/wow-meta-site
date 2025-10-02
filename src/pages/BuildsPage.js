import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gameIcons, classIcons, WowIcon } from '../utils/wowIcons';
import { FaCopy } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: ${props => props.active ? props.theme.colors.accent : props.theme.colors.surface};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.primary};
  }
`;

const BuildsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
`;

const BuildCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const BuildHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.color}40, ${props => props.color}20);
  padding: 1.5rem;
  border-bottom: 2px solid ${props => props.color};
`;

const BuildTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const BuildMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ClassBadge = styled.span`
  background: ${props => props.color};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.85rem;
`;

const RatingBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.primary};
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.85rem;

  img {
    display: inline-block;
  }
`;

const BuildContent = styled.div`
  padding: 1.5rem;
`;

const BuildDescription = styled.p`
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const TalentString = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TalentCode = styled.code`
  font-family: monospace;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.subtext};
  font-size: 0.9rem;
`;

const UpdateDate = styled.span`
  color: ${props => props.theme.colors.subtext};
  font-size: 0.85rem;
`;

function BuildsPage() {
  const [filter, setFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const builds = [
    {
      id: 1,
      title: '부정 죽음기사 레이드 빌드',
      class: '죽음기사',
      spec: '부정',
      type: 'raid',
      rating: 4.8,
      author: 'Acherus',
      updated: '2024-12-10',
      description: '마나단조 오메가 최적화 빌드. 단일 대상과 광역 피해 균형.',
      talentString: 'BwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAJSSSSCJJtQSLRAAAAAAAAAAAAAgkkEJlkEJSSCBA',
      color: '#C41E3A'
    },
    {
      id: 2,
      title: '황폐 기원사 신화+ 빌드',
      class: '기원사',
      spec: '황폐',
      type: 'mythicplus',
      rating: 4.9,
      author: 'Dragonflight',
      updated: '2024-12-12',
      description: '시즌 3 신화+ 최강 빌드. 강력한 광역 피해와 생존력.',
      talentString: 'BwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgQSSSSSCJJtQSLRAAAAAAAAAAAAAgkkEJlkEJSSCBA',
      color: '#33937F'
    },
    {
      id: 3,
      title: '고양 주술사 PvP 빌드',
      class: '주술사',
      spec: '고양',
      type: 'pvp',
      rating: 4.7,
      author: 'Elements',
      updated: '2024-12-11',
      description: '3v3 아레나 최적화. 높은 폭발 피해와 유틸리티.',
      talentString: 'BwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAJSSSSCJJtQSLRAAAAAAAAAAAAAgkkEJlkEJSSCBA',
      color: '#0070DD'
    },
    {
      id: 4,
      title: '분노 전사 레이드 빌드',
      class: '전사',
      spec: '분노',
      type: 'raid',
      rating: 4.9,
      author: 'Valhalla',
      updated: '2024-12-13',
      description: '최고의 단일 대상 DPS. 격노 유지 최적화.',
      talentString: 'BwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAJSSSSCJJtQSLRAAAAAAAAAAAAAgkkEJlkEJSSCBA',
      color: '#C69B6D'
    },
    {
      id: 5,
      title: '보호 성기사 신화+ 빌드',
      class: '성기사',
      spec: '보호',
      type: 'mythicplus',
      rating: 5.0,
      author: 'LightBringer',
      updated: '2024-12-14',
      description: '최강의 탱킹 빌드. 높은 생존력과 유틸리티.',
      talentString: 'BwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAJSSSSCJJtQSLRAAAAAAAAAAAAAgkkEJlkEJSSCBA',
      color: '#F48CBA'
    },
    {
      id: 6,
      title: '암흑 사제 레이드 빌드',
      class: '사제',
      spec: '암흑',
      type: 'raid',
      rating: 4.8,
      author: 'VoidLord',
      updated: '2024-12-12',
      description: '지속 피해 극대화. 다중 타겟 상황 최적화.',
      talentString: 'BwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAJSSSSCJJtQSLRAAAAAAAAAAAAAgkkEJlkEJSSCBA',
      color: '#FFFFFF'
    }
  ];

  const filteredBuilds = filter === 'all'
    ? builds
    : builds.filter(build => build.type === filter);

  const handleCopy = (id, talentString) => {
    navigator.clipboard.writeText(talentString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const classColors = {
    '죽음기사': '#C41E3A',
    '악마사냥꾼': '#A330C9',
    '드루이드': '#FF7C0A',
    '기원사': '#33937F',
    '사냥꾼': '#AAD372',
    '마법사': '#3FC7EB',
    '수도사': '#00FF98',
    '성기사': '#F48CBA',
    '사제': '#FFFFFF',
    '도적': '#FFF468',
    '주술사': '#0070DD',
    '흑마법사': '#8788EE',
    '전사': '#C69B6D'
  };

  return (
    <Container>
      <PageTitle>빌드 가이드</PageTitle>

      <FilterSection>
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          전체
        </FilterButton>
        <FilterButton active={filter === 'raid'} onClick={() => setFilter('raid')}>
          레이드
        </FilterButton>
        <FilterButton active={filter === 'mythicplus'} onClick={() => setFilter('mythicplus')}>
          신화+
        </FilterButton>
        <FilterButton active={filter === 'pvp'} onClick={() => setFilter('pvp')}>
          PvP
        </FilterButton>
      </FilterSection>

      <BuildsGrid>
        {filteredBuilds.map((build, index) => (
          <BuildCard
            key={build.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <BuildHeader color={classColors[build.class]}>
              <BuildTitle>{build.title}</BuildTitle>
              <BuildMeta>
                <ClassBadge color={classColors[build.class]}>
                  {build.class} - {build.spec}
                </ClassBadge>
                <RatingBadge>
                  <WowIcon icon={gameIcons.achievement} size={16} />
                  {build.rating}
                </RatingBadge>
              </BuildMeta>
            </BuildHeader>

            <BuildContent>
              <BuildDescription>{build.description}</BuildDescription>

              <TalentString>
                <TalentCode>{build.talentString.substring(0, 30)}...</TalentCode>
                <CopyButton onClick={() => handleCopy(build.id, build.talentString)}>
                  <FaCopy />
                  {copiedId === build.id ? '복사됨!' : '복사'}
                </CopyButton>
              </TalentString>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AuthorInfo>
                  <FaUsers />
                  {build.author}
                </AuthorInfo>
                <UpdateDate>
                  업데이트: {build.updated}
                </UpdateDate>
              </div>
            </BuildContent>
          </BuildCard>
        ))}
      </BuildsGrid>
    </Container>
  );
}

export default BuildsPage;