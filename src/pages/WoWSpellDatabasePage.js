import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';
import SkillDetailModal from '../components/SkillDetailModal';
import { FaSearch, FaTh, FaList, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// twwS3SkillDatabase에서 classData 생성
const classDataFromDB = {
  WARRIOR: { koreanName: '전사', color: '#C79C6E' },
  PALADIN: { koreanName: '성기사', color: '#F58CBA' },
  HUNTER: { koreanName: '사냥꾼', color: '#ABD473' },
  ROGUE: { koreanName: '도적', color: '#FFF569' },
  PRIEST: { koreanName: '사제', color: '#FFFFFF' },
  SHAMAN: { koreanName: '주술사', color: '#0070DE' },
  MAGE: { koreanName: '마법사', color: '#69CCF0' },
  WARLOCK: { koreanName: '흑마법사', color: '#9482C9' },
  MONK: { koreanName: '수도사', color: '#00FF96' },
  DRUID: { koreanName: '드루이드', color: '#FF7D0A' },
  DEMONHUNTER: { koreanName: '악마사냥꾼', color: '#A330C9' },
  DEATHKNIGHT: { koreanName: '죽음의 기사', color: '#C41F3B' },
  EVOKER: { koreanName: '기원사', color: '#33937F' }
};

// 데이터베이스 통계 계산
const databaseStats = {
  totalSkills: twwS3SkillDatabase.length,
  enhancedSkills: twwS3SkillDatabase.filter(skill => skill.coefficient).length,
  classBreakdown: Object.keys(classDataFromDB).reduce((acc, className) => {
    acc[className] = twwS3SkillDatabase.filter(skill => skill.class === className).length;
    return acc;
  }, {})
};

// WoW 스타일 애니메이션
const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.4); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// 메인 컨테이너
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%);
  padding: 20px;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/wow-bg-pattern.png') repeat;
    opacity: 0.03;
    pointer-events: none;
  }
`;

// 헤더 스타일
const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;

  h1 {
    font-size: 2.5rem;
    color: #ffd700;
    font-weight: bold;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
  }

  .subtitle {
    color: #94a3b8;
    font-size: 1.1rem;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

// 컨트롤 패널
const ControlPanel = styled.div`
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

// 검색 바
const SearchBar = styled.div`
  position: relative;
  margin-bottom: 25px;

  input {
    width: 100%;
    padding: 15px 20px 15px 55px;
    background: rgba(15, 23, 42, 0.8);
    border: 2px solid #475569;
    border-radius: 10px;
    color: #e2e8f0;
    font-size: 1.1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    }

    &::placeholder {
      color: #64748b;
    }
  }

  .search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #ffd700;
    font-size: 1.3rem;
  }
`;

// 필터 그룹
const FilterGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;

  .filter-item {
    label {
      display: block;
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    select {
      width: 100%;
      padding: 10px 15px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid #475569;
      border-radius: 5px;
      color: #e2e8f0;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #ffd700;
      }

      &:focus {
        outline: none;
        border-color: #ffd700;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      }
    }
  }
`;

// 뷰 토글 버튼
const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;

  button {
    padding: 10px 20px;
    background: ${props => props.active ?
      'linear-gradient(135deg, #ffd700, #ffed4e)' :
      'rgba(30, 41, 59, 0.8)'};
    border: 2px solid ${props => props.active ? '#ffd700' : '#475569'};
    color: ${props => props.active ? '#1a1f2e' : '#94a3b8'};
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
    }
  }
`;

// 스킬 카드 그리드
const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

// 스킬 카드
const SkillCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
  border: 2px solid ${props => props.classColor || '#475569'};
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: #ffd700;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

    &::before {
      left: 100%;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;

    .skill-icon {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      border: 2px solid ${props => props.classColor || '#475569'};
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .skill-info {
      flex: 1;

      .skill-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: #e2e8f0;
        margin-bottom: 5px;
      }

      .skill-name-en {
        font-size: 0.9rem;
        color: #64748b;
        font-style: italic;
      }
    }
  }

  .card-body {
    .skill-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .meta-badge {
        padding: 5px 12px;
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 15px;
        font-size: 0.9rem;
        color: #ffd700;
        font-weight: 600;
      }

      .spec-badge {
        padding: 5px 12px;
        background: rgba(100, 200, 255, 0.1);
        border: 1px solid rgba(100, 200, 255, 0.3);
        border-radius: 15px;
        font-size: 0.9rem;
        color: #64b5ff;
        font-weight: 600;
      }
    }
  }

  .card-footer {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 215, 0, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .class-badge {
      padding: 5px 12px;
      background: ${props => props.classColor || '#475569'};
      color: ${props => props.textColor || '#fff'};
      border-radius: 5px;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .skill-id {
      color: #ffd700;
      font-size: 1.1rem;
      font-weight: bold;
      background: rgba(255, 215, 0, 0.1);
      padding: 4px 10px;
      border-radius: 5px;
      border: 1px solid rgba(255, 215, 0, 0.3);
    }
  }
`;

// 리스트 뷰 테이블
const ListTable = styled.table`
  width: 100%;
  background: rgba(30, 41, 59, 0.95);
  border: 2px solid #475569;
  border-radius: 10px;
  overflow: hidden;

  thead {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));

    th {
      padding: 15px;
      text-align: left;
      color: #ffd700;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid #ffd700;
      cursor: pointer;
      user-select: none;

      &.sortable:hover {
        background: rgba(255, 215, 0, 0.1);
      }
    }
  }

  tbody {
    tr {
      transition: all 0.3s;
      border-bottom: 1px solid rgba(71, 85, 105, 0.3);

      &:hover {
        background: rgba(255, 215, 0, 0.05);
        cursor: pointer;
      }

      td {
        padding: 12px 15px;
        color: #e2e8f0;

        .skill-icon-small {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 1px solid #475569;
        }

        .class-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 3px;
          font-size: 0.85rem;
          font-weight: bold;
        }
      }
    }
  }
`;

// 페이지네이션
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;

  button {
    padding: 10px 15px;
    background: rgba(30, 41, 59, 0.8);
    border: 2px solid #475569;
    color: #94a3b8;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
      border-color: #ffd700;
      color: #ffd700;
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      color: #1a1f2e;
      border-color: #ffd700;
    }
  }

  .page-info {
    color: #e2e8f0;
    font-weight: bold;
    padding: 0 20px;
  }
`;

// 통계 바
const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 10px;
  margin-bottom: 20px;

  span {
    color: #94a3b8;
    font-size: 0.95rem;

    strong {
      color: #ffd700;
      font-weight: bold;
    }
  }
`;

const WoWSpellDatabasePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSpec, setSelectedSpec] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [skillsData] = useState(() => {
    // 중복 제거를 위한 고유 스킬 저장
    const uniqueSkills = new Map();
    (twwS3SkillDatabase || []).forEach(skill => {
      if (!uniqueSkills.has(skill.id)) {
        uniqueSkills.set(skill.id, skill);
      }
    });
    return Array.from(uniqueSkills.values());
  });

  const itemsPerPage = viewMode === 'grid' ? 24 : 50;

  // 클래스 데이터 - 영어를 한글로 매핑
  const classNameMap = {
    'WARRIOR': '전사',
    'PALADIN': '성기사',
    'HUNTER': '사냥꾼',
    'ROGUE': '도적',
    'PRIEST': '사제',
    'SHAMAN': '주술사',
    'MAGE': '마법사',
    'WARLOCK': '흑마법사',
    'MONK': '수도사',
    'DRUID': '드루이드',
    'DEMONHUNTER': '악마사냥꾼',
    'DEATHKNIGHT': '죽음의기사',
    'EVOKER': '기원사'
  };

  const classData = classDataFromDB || {};

  // 필터링 및 정렬
  const filteredAndSortedSkills = useMemo(() => {
    let skills = [...skillsData];

    // 필터링
    if (selectedClass !== 'all') {
      skills = skills.filter(skill => skill.class === selectedClass);
    }

    if (selectedSpec !== 'all') {
      skills = skills.filter(skill => skill.spec === selectedSpec);
    }

    if (selectedType !== 'all') {
      skills = skills.filter(skill => skill.type === selectedType || (selectedType === 'pvp' && skill.pvp));
    }

    // 검색
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      skills = skills.filter(skill =>
        skill.koreanName?.toLowerCase().includes(query) ||
        skill.englishName?.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query) ||
        skill.id?.toString().includes(query)
      );
    }

    // 정렬
    skills.sort((a, b) => {
      let compareValue = 0;
      switch (sortBy) {
        case 'name':
          compareValue = (a.koreanName || '').localeCompare(b.koreanName || '', 'ko');
          break;
        case 'class':
          const aClass = classNameMap[a.class] || a.class || '';
          const bClass = classNameMap[b.class] || b.class || '';
          compareValue = aClass.localeCompare(bClass, 'ko');
          break;
        case 'type':
          compareValue = (a.type || '').localeCompare(b.type || '', 'ko');
          break;
        case 'id':
          compareValue = parseInt(a.id || 0) - parseInt(b.id || 0);
          break;
        default:
          compareValue = parseInt(a.id || 0) - parseInt(b.id || 0);
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return skills;
  }, [skillsData, selectedClass, selectedSpec, selectedType, searchQuery, sortBy, sortOrder]);

  // 페이지네이션
  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedSkills.slice(start, start + itemsPerPage);
  }, [filteredAndSortedSkills, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedSkills.length / itemsPerPage);

  // 정렬 핸들러
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // 아이콘 URL
  const getIconUrl = (icon) => {
    if (!icon || icon === 'inv_misc_questionmark') {
      return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
    }
    return `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
  };

  // 클래스 색상 가져오기
  const getClassColor = (className) => {
    const koreanName = classNameMap[className] || className;
    return classData[koreanName]?.color || '#475569';
  };

  const getTextColor = (className) => {
    const koreanName = classNameMap[className] || className;
    const lightClasses = ['사냥꾼', '도적', '사제', '마법사', '수도사'];
    return lightClasses.includes(koreanName) ? '#000' : '#fff';
  };

  return (
    <PageContainer>
      <Header>
        <h1>WoW 스킬 데이터베이스</h1>
        <p className="subtitle">TWW Season 3 · 패치 11.2 · {databaseStats?.totalSkills || 0} Skills</p>
      </Header>

      <ControlPanel>
        <SearchBar>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="스킬 이름, 설명, ID로 검색..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </SearchBar>

        <FilterGroup>
          <div className="filter-item">
            <label>직업</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSpec('all');
                setCurrentPage(1);
              }}
            >
              <option value="all">모든 직업</option>
              {Object.entries(classData).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>

          {selectedClass !== 'all' && (
            <div className="filter-item">
              <label>전문화</label>
              <select
                value={selectedSpec}
                onChange={(e) => {
                  setSelectedSpec(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">모든 전문화</option>
                <option value="공용">공용</option>
                {classData[selectedClass]?.specs?.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-item">
            <label>타입</label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">모든 타입</option>
              <option value="기본">기본</option>
              <option value="특성">특성</option>
              <option value="영웅특성">영웅특성</option>
              <option value="pvp">PvP</option>
            </select>
          </div>

          <div className="filter-item">
            <label>정렬</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <option value="id-asc">ID (오름차순)</option>
              <option value="id-desc">ID (내림차순)</option>
              <option value="name-asc">이름 (가나다순)</option>
              <option value="name-desc">이름 (역순)</option>
              <option value="class-asc">직업 (가나다순)</option>
              <option value="class-desc">직업 (역순)</option>
            </select>
          </div>
        </FilterGroup>
      </ControlPanel>

      <ViewToggle>
        <button
          onClick={() => setViewMode('grid')}
          style={{
            background: viewMode === 'grid' ? 'linear-gradient(135deg, #ffd700, #ffed4e)' : 'rgba(30, 41, 59, 0.8)',
            borderColor: viewMode === 'grid' ? '#ffd700' : '#475569',
            color: viewMode === 'grid' ? '#1a1f2e' : '#94a3b8'
          }}
        >
          <FaTh /> 카드 보기
        </button>
        <button
          onClick={() => setViewMode('list')}
          style={{
            background: viewMode === 'list' ? 'linear-gradient(135deg, #ffd700, #ffed4e)' : 'rgba(30, 41, 59, 0.8)',
            borderColor: viewMode === 'list' ? '#ffd700' : '#475569',
            color: viewMode === 'list' ? '#1a1f2e' : '#94a3b8'
          }}
        >
          <FaList /> 리스트 보기
        </button>
      </ViewToggle>

      <StatsBar>
        <span>검색 결과: <strong>{filteredAndSortedSkills.length}</strong>개</span>
        <span>페이지: <strong>{currentPage}</strong> / {totalPages || 1}</span>
        <span>표시: <strong>{paginatedSkills.length}</strong>개</span>
      </StatsBar>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <SkillGrid key="grid">
            {paginatedSkills.map(skill => (
              <SkillCard
                key={skill.id}
                classColor={getClassColor(skill.class)}
                textColor={getTextColor(skill.class)}
                onClick={() => {
                  setSelectedSkill(skill);
                  setIsModalOpen(true);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="card-header">
                  <img
                    src={getIconUrl(skill.icon)}
                    alt={skill.koreanName}
                    className="skill-icon"
                    onError={(e) => {
                      e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                    }}
                  />
                  <div className="skill-info">
                    <div className="skill-name">{skill.koreanName || '이름 없음'}</div>
                    <div className="skill-name-en">{skill.englishName}</div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="skill-meta">
                    {skill.type && <span className="meta-badge">{skill.type}</span>}
                  </div>
                </div>
                <div className="card-footer">
                  <span className="class-badge" style={{
                    backgroundColor: getClassColor(skill.class),
                    color: getTextColor(skill.class),
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>{classNameMap[skill.class] || skill.class}</span>
                  <span className="skill-id">#{skill.id}</span>
                </div>
              </SkillCard>
            ))}
          </SkillGrid>
        ) : (
          <ListTable key="list">
            <thead>
              <tr>
                <th width="50"></th>
                <th className="sortable" onClick={() => handleSort('id')}>
                  ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  한글명 {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>영문명</th>
                <th className="sortable" onClick={() => handleSort('class')}>
                  직업 {sortBy === 'class' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('type')}>
                  타입 {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSkills.map(skill => {
                const koreanClassName = classNameMap[skill.class] || skill.class;
                return (
                  <tr
                    key={`skill-${skill.id}-${skill.koreanName}`}
                    onClick={() => {
                      setSelectedSkill(skill);
                      setIsModalOpen(true);
                    }}
                  >
                    <td>
                      <img
                        src={getIconUrl(skill.icon)}
                        alt={skill.koreanName}
                        className="skill-icon-small"
                        onError={(e) => {
                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                      />
                    </td>
                    <td style={{ color: '#ffd700' }}>#{skill.id}</td>
                    <td>{skill.koreanName || '이름 없음'}</td>
                    <td style={{ color: '#64748b' }}>{skill.englishName}</td>
                    <td>
                      <span
                        className="class-tag"
                        style={{
                          backgroundColor: getClassColor(skill.class),
                          color: getTextColor(skill.class)
                        }}
                      >
                        {koreanClassName}
                      </span>
                    </td>
                    <td>{skill.type || '기본'}</td>
                  </tr>
                );
              })}
            </tbody>
          </ListTable>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <Pagination>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            처음
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>

          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = currentPage <= 3 ? i + 1 :
              currentPage >= totalPages - 2 ? totalPages - 4 + i :
              currentPage - 2 + i;

            if (pageNum < 1 || pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? 'active' : ''}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            마지막
          </button>
        </Pagination>
      )}

      {/* 스킬 상세 모달 */}
      <SkillDetailModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSkill(null);
        }}
        classData={classData}
      />
    </PageContainer>
  );
};

export default WoWSpellDatabasePage;