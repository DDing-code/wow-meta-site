import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

const CategoryFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  background: ${props => props.active ? 'rgba(243, 139, 168, 0.1)' : props.theme.colors.surface};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NewsCard = styled(motion.article)`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: ${props => props.theme.colors.accent};
  }
`;

const NewsImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, rgba(243, 139, 168, 0.2), rgba(203, 166, 247, 0.2));
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(20, 24, 35, 0.9), transparent);
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 1;
  background: ${props => {
    const colors = {
      'Patch Notes': '#f38ba8',
      'Class Changes': '#cba6f7',
      'Raid': '#fab387',
      'PvP': '#89dceb',
      'Guide': '#a6e3a1'
    };
    return colors[props.category] || '#94e2d5';
  }};
  color: ${props => props.theme.colors.primary};
`;

const NewsContent = styled.div`
  padding: 1.5rem;
`;

const NewsDate = styled.div`
  color: ${props => props.theme.colors.subtext};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewsTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`;

const NewsExcerpt = styled.p`
  color: ${props => props.theme.colors.subtext};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReadMoreButton = styled.span`
  color: ${props => props.theme.colors.accent};
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: gap 0.3s ease;

  ${NewsCard}:hover & {
    gap: 1rem;
  }
`;

function NewsSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Patch Notes', 'Class Changes', 'Raid', 'PvP', 'Guide'];

  const newsItems = [
    {
      id: 1,
      category: 'Patch Notes',
      title: '11.2 패치 노트: 마나단조 오메가 레이드 오픈',
      excerpt: '새로운 레이드 던전 마나단조 오메가가 추가되었습니다. 8개의 보스와 함께 새로운 티어 세트가 등장합니다.',
      date: '2025-01-15',
      image: null,
      link: '/news/patch-11-2'
    },
    {
      id: 2,
      category: 'Class Changes',
      title: '주요 클래스 밸런스 패치',
      excerpt: '언홀리 죽음의 기사 버프, 화염 마법사 너프 등 주요 클래스 변경사항이 적용되었습니다.',
      date: '2025-01-14',
      image: null,
      link: '/news/class-balance'
    },
    {
      id: 3,
      category: 'Guide',
      title: '고통 흑마법사 완벽 가이드',
      excerpt: 'TWW 시즌 3 기준 고통 흑마법사의 로테이션, 특성, 스탯 우선순위를 상세히 분석했습니다.',
      date: '2025-01-13',
      image: null,
      link: '/guide/warlock/affliction'
    },
    {
      id: 4,
      category: 'Raid',
      title: '마나단조 오메가 공략: 첫 번째 보스',
      excerpt: '마나단조 오메가 첫 번째 보스 공략 전략과 주요 패턴 대처법을 알아봅니다.',
      date: '2025-01-12',
      image: null,
      link: '/news/raid-boss-1'
    },
    {
      id: 5,
      category: 'PvP',
      title: 'PvP 시즌 3 티어 리스트',
      excerpt: '새로운 PvP 시즌의 최강 클래스와 전문화 순위를 확인하세요.',
      date: '2025-01-11',
      image: null,
      link: '/news/pvp-tier-list'
    },
    {
      id: 6,
      category: 'Guide',
      title: '야수 사냥꾼 심화 가이드',
      excerpt: '패치 11.2 기준 야수 사냥꾼의 최적 빌드와 펫 관리 전략을 공유합니다.',
      date: '2025-01-10',
      image: null,
      link: '/guide/hunter/beast-mastery'
    }
  ];

  const filteredNews = activeCategory === 'All'
    ? newsItems
    : newsItems.filter(item => item.category === activeCategory);

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>최신 소식</SectionTitle>
        <ViewAllLink to="/news">
          전체 보기 →
        </ViewAllLink>
      </SectionHeader>

      <CategoryFilter>
        {categories.map(category => (
          <CategoryButton
            key={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryFilter>

      <NewsGrid>
        {filteredNews.map((item, index) => (
          <NewsCard
            key={item.id}
            as={Link}
            to={item.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NewsImage src={item.image}>
              <CategoryBadge category={item.category}>
                {item.category}
              </CategoryBadge>
            </NewsImage>
            <NewsContent>
              <NewsDate>
                📅 {new Date(item.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </NewsDate>
              <NewsTitle>{item.title}</NewsTitle>
              <NewsExcerpt>{item.excerpt}</NewsExcerpt>
              <ReadMoreButton>
                자세히 보기 →
              </ReadMoreButton>
            </NewsContent>
          </NewsCard>
        ))}
      </NewsGrid>
    </Section>
  );
}

export default NewsSection;
