import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, #f38ba8, #cba6f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.subtext};
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 1rem;
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

const SearchBar = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 2px solid transparent;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-width: 250px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }

  &::placeholder {
    color: ${props => props.theme.colors.subtext};
  }
`;

const NewsGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const NewsCard = styled(motion.article)`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 300px 1fr;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: ${props => props.theme.colors.accent};
  }
`;

const NewsImage = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
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
  left: 1rem;
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NewsHeader = styled.div``;

const NewsDate = styled.div`
  color: ${props => props.theme.colors.subtext};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewsTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`;

const NewsExcerpt = styled.p`
  color: ${props => props.theme.colors.subtext};
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const NewsFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NewsAuthor = styled.div`
  color: ${props => props.theme.colors.subtext};
  font-size: 0.9rem;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const PageButton = styled.button`
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  border: none;
  background: ${props => props.active ? props.theme.colors.accent : props.theme.colors.surface};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.active ? props.theme.colors.accent : 'rgba(243, 139, 168, 0.1)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const categories = ['All', 'Patch Notes', 'Class Changes', 'Raid', 'PvP', 'Guide'];

  const allNews = [
    {
      id: 1,
      category: 'Patch Notes',
      title: '11.2 패치 노트: 마나단조 오메가 레이드 오픈',
      excerpt: '새로운 레이드 던전 마나단조 오메가가 추가되었습니다. 8개의 보스와 함께 새로운 티어 세트가 등장합니다. 영웅 특성 시너지가 강화되었으며, 각 클래스별 밸런스 조정이 이루어졌습니다.',
      date: '2025-01-15',
      author: 'WoW Meta 팀',
      image: null,
      link: '/news/patch-11-2'
    },
    {
      id: 2,
      category: 'Class Changes',
      title: '주요 클래스 밸런스 패치',
      excerpt: '언홀리 죽음의 기사 버프, 화염 마법사 너프 등 주요 클래스 변경사항이 적용되었습니다. PvE와 PvP 양쪽에서 더 나은 밸런스를 위한 조정이 이루어졌습니다.',
      date: '2025-01-14',
      author: 'WoW Meta 팀',
      image: null,
      link: '/news/class-balance'
    },
    {
      id: 3,
      category: 'Guide',
      title: '고통 흑마법사 완벽 가이드',
      excerpt: 'TWW 시즌 3 기준 고통 흑마법사의 로테이션, 특성, 스탯 우선순위를 상세히 분석했습니다. 시들기와 영혼 부패의 최적 활용법을 알아봅니다.',
      date: '2025-01-13',
      author: 'WoW Meta 팀',
      image: null,
      link: '/guide/warlock/affliction'
    },
    {
      id: 4,
      category: 'Raid',
      title: '마나단조 오메가 공략: 첫 번째 보스',
      excerpt: '마나단조 오메가 첫 번째 보스 공략 전략과 주요 패턴 대처법을 알아봅니다. 탱커, 힐러, 딜러별 포지셔닝과 역할 분담을 상세히 설명합니다.',
      date: '2025-01-12',
      author: 'WoW Meta 팀',
      image: null,
      link: '/news/raid-boss-1'
    },
    {
      id: 5,
      category: 'PvP',
      title: 'PvP 시즌 3 티어 리스트',
      excerpt: '새로운 PvP 시즌의 최강 클래스와 전문화 순위를 확인하세요. 투기장, 전장, 솔로 셔플 각 컨텐츠별 메타를 분석했습니다.',
      date: '2025-01-11',
      author: 'WoW Meta 팀',
      image: null,
      link: '/news/pvp-tier-list'
    },
    {
      id: 6,
      category: 'Guide',
      title: '야수 사냥꾼 심화 가이드',
      excerpt: '패치 11.2 기준 야수 사냥꾼의 최적 빌드와 펫 관리 전략을 공유합니다. 광기 스택 관리와 날카로운 사격 활용법을 상세히 다룹니다.',
      date: '2025-01-10',
      author: 'WoW Meta 팀',
      image: null,
      link: '/guide/hunter/beast-mastery'
    },
    {
      id: 7,
      category: 'Patch Notes',
      title: '신화+ 시즌 3 변경사항',
      excerpt: '새로운 던전 로테이션과 어픽스 시스템 개편 내용을 상세히 알아봅니다. 각 던전별 주요 변경사항과 공략 팁을 제공합니다.',
      date: '2025-01-09',
      author: 'WoW Meta 팀',
      image: null,
      link: '/news/mythic-plus-season-3'
    },
    {
      id: 8,
      category: 'Class Changes',
      title: '수양 사제 리워크 분석',
      excerpt: '수양 사제의 대규모 리워크가 진행되었습니다. 새로운 메커니즘과 플레이 스타일을 분석하고, 최적 빌드를 제시합니다.',
      date: '2025-01-08',
      author: 'WoW Meta 팀',
      image: null,
      link: '/news/disc-priest-rework'
    }
  ];

  // 필터링 및 검색
  const filteredNews = allNews.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container>
      <PageHeader>
        <PageTitle>WoW 뉴스</PageTitle>
        <PageSubtitle>월드 오브 워크래프트 최신 소식과 업데이트</PageSubtitle>
      </PageHeader>

      <FilterSection>
        <CategoryFilter>
          {categories.map(category => (
            <CategoryButton
              key={category}
              active={activeCategory === category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryFilter>

        <SearchBar
          type="text"
          placeholder="뉴스 검색..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </FilterSection>

      <NewsGrid>
        {paginatedNews.map((item, index) => (
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
              <NewsHeader>
                <NewsDate>
                  📅 {new Date(item.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </NewsDate>
                <NewsTitle>{item.title}</NewsTitle>
                <NewsExcerpt>{item.excerpt}</NewsExcerpt>
              </NewsHeader>
              <NewsFooter>
                <NewsAuthor>✍️ {item.author}</NewsAuthor>
                <ReadMoreButton>
                  자세히 보기 →
                </ReadMoreButton>
              </NewsFooter>
            </NewsContent>
          </NewsCard>
        ))}
      </NewsGrid>

      {totalPages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← 이전
          </PageButton>
          {[...Array(totalPages)].map((_, i) => (
            <PageButton
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            다음 →
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
}

export default NewsPage;
