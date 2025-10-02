import React, { useState, useMemo, useEffect } from 'react';
import './AdvancedSpellDatabasePage.css';
import { twwS3SkillDatabase, heroTalentsData as heroTalentsFromDB, classData as classDataFromDB, databaseStats } from '../data/twwS3SkillDatabase';
import SkillDetailModal from '../components/SkillDetailModal';

// 클래스 데이터 (DB에서 가져온 데이터 사용)
const classData = classDataFromDB || {
  '전사': { name: '전사', color: '#C79C6E', specs: ['무기', '분노', '방어'] },
  '성기사': { name: '성기사', color: '#F58CBA', specs: ['신성', '보호', '징벌'] },
  '사냥꾼': { name: '사냥꾼', color: '#ABD473', specs: ['야수', '사격', '생존'] },
  '도적': { name: '도적', color: '#FFF569', specs: ['암살', '무법', '잠행'] },
  '사제': { name: '사제', color: '#FFFFFF', specs: ['수양', '신성', '암흑'] },
  '주술사': { name: '주술사', color: '#0070DE', specs: ['정기', '고양', '복원'] },
  '마법사': { name: '마법사', color: '#69CCF0', specs: ['비전', '화염', '냉기'] },
  '흑마법사': { name: '흑마법사', color: '#9482C9', specs: ['고통', '악마', '파괴'] },
  '수도사': { name: '수도사', color: '#00FF96', specs: ['양조', '운무', '풍운'] },
  '드루이드': { name: '드루이드', color: '#FF7D0A', specs: ['조화', '야성', '수호', '회복'] },
  '악마사냥꾼': { name: '악마사냥꾼', color: '#A330C9', specs: ['파멸', '복수'] },
  '죽음의기사': { name: '죽음의기사', color: '#C41E3A', specs: ['혈기', '냉기', '부정'] },
  '기원사': { name: '기원사', color: '#33937F', specs: ['황폐', '보존', '증강'] }
};

// 영웅 특성 데이터 (DB에서 가져온 데이터 사용)
const heroTalents = heroTalentsFromDB || {
  '전사': ['거신', '산왕'],
  '성기사': ['사절', '기사단장'],
  '사냥꾼': ['다크레인저', '파수병'],
  '도적': ['속임수꾼', '사신'],
  '사제': ['대천사', '공허소환사'],
  '주술사': ['폭풍소환사', '선견자'],
  '마법사': ['선파자', '주문도둑'],
  '흑마법사': ['지옥소환사', '영혼수확자'],
  '수도사': ['천신', '도제'],
  '드루이드': ['엘룬의 선택', '세나리우스의 수호자'],
  '악마사냥꾼': ['알드라치 수확자', '지옥 소환'],
  '죽음의기사': ['산 파괴자', '사신기수'],
  '기원사': ['연대의 불꽃', '시간의 화신']
};

const AdvancedSpellDatabasePage = () => {
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSpec, setSelectedSpec] = useState('all');
  const [selectedHeroTalent, setSelectedHeroTalent] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // 데이터 로드
  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        // TWW S3 데이터베이스 사용 (이미 배열 형태)
        setSkillsData(twwS3SkillDatabase || []);
        console.log('Loaded TWW S3 skills data:', twwS3SkillDatabase?.length || 0, 'skills');
        console.log('Database stats:', databaseStats);
        setLoading(false);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setLoading(false);
      }
    };
    loadSkillsData();
  }, []);

  // 고급 검색 함수
  const searchInSkill = (skill, query) => {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();

    return (
      skill.koreanName?.toLowerCase().includes(lowerQuery) ||
      skill.englishName?.toLowerCase().includes(lowerQuery) ||
      skill.description?.toLowerCase().includes(lowerQuery) ||
      skill.id?.toString().includes(query) ||
      skill.cooldown?.toLowerCase().includes(lowerQuery) ||
      skill.range?.toLowerCase().includes(lowerQuery) ||
      skill.resource?.toLowerCase().includes(lowerQuery) ||
      skill.castTime?.toLowerCase().includes(lowerQuery) ||
      skill.duration?.toLowerCase().includes(lowerQuery)
    );
  };

  // 필터링 및 정렬 로직
  const filteredAndSortedSkills = useMemo(() => {
    let skills = Array.isArray(skillsData) ? [...skillsData] : [];

    // 클래스 필터
    if (selectedClass !== 'all') {
      skills = skills.filter(skill => skill.class === selectedClass);
    }

    // 전문화 필터
    if (selectedSpec !== 'all') {
      skills = skills.filter(skill => skill.spec === selectedSpec);
    }

    // 영웅특성 필터
    if (selectedHeroTalent !== 'all') {
      skills = skills.filter(skill => skill.heroTalent === selectedHeroTalent);
    }

    // 스킬 타입 필터
    if (selectedType !== 'all') {
      skills = skills.filter(skill => skill.type === selectedType || (selectedType === 'pvp' && skill.pvp));
    }

    // 검색 필터
    skills = skills.filter(skill => searchInSkill(skill, searchQuery));

    // 정렬
    skills.sort((a, b) => {
      let compareValue = 0;
      switch (sortBy) {
        case 'name':
          compareValue = (a.koreanName || '').localeCompare(b.koreanName || '', 'ko');
          break;
        case 'nameEn':
          compareValue = (a.englishName || '').localeCompare(b.englishName || '');
          break;
        case 'class':
          compareValue = (a.class || '').localeCompare(b.class || '');
          break;
        case 'type':
          compareValue = (a.type || '').localeCompare(b.type || '', 'ko');
          break;
        case 'cooldown':
          const cdA = parseFloat(a.cooldown) || 0;
          const cdB = parseFloat(b.cooldown) || 0;
          compareValue = cdA - cdB;
          break;
        case 'id':
        default:
          compareValue = (a.id || 0) - (b.id || 0);
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return skills;
  }, [skillsData, selectedClass, selectedSpec, selectedHeroTalent, selectedType, searchQuery, sortBy, sortOrder]);

  // 페이지네이션
  const paginatedSkills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedSkills.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedSkills, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedSkills.length / itemsPerPage);

  // 정렬 토글 함수
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // 스킬 클릭 핸들러
  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  // 아이콘 URL 생성
  const getIconUrl = (icon) => {
    if (!icon || icon === 'inv_misc_questionmark') {
      return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
    }
    return `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
  };

  return (
    <div className="advanced-spell-database-page">
      {/* 헤더 */}
      <div className="database-header">
        <h1>WoW 스킬 데이터베이스</h1>
        <p className="subtitle">TWW Season 3 (11.2 패치) - {databaseStats?.totalSkills || 0}개 스킬</p>
      </div>

      {/* 고급 컨트롤 패널 */}
      <div className="advanced-control-panel">
        {/* 검색 바 */}
        <div className="search-section">
          <input
            type="text"
            className="advanced-search-input"
            placeholder="🔍 통합 검색 (한글명, 영문명, 설명, ID)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* 필터 섹션 */}
        <div className="filter-section">
          {/* 클래스 필터 */}
          <div className="filter-group">
            <label>직업</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSpec('all');
                setSelectedHeroTalent('all');
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">모든 직업</option>
              {Object.entries(classData).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>

          {/* 전문화 필터 */}
          {selectedClass !== 'all' && (
            <div className="filter-group">
              <label>전문화</label>
              <select
                value={selectedSpec}
                onChange={(e) => {
                  setSelectedSpec(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="all">모든 전문화</option>
                {classData[selectedClass]?.specs.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          )}

          {/* 영웅 특성 필터 */}
          {selectedClass !== 'all' && (
            <div className="filter-group">
              <label>영웅 특성</label>
              <select
                value={selectedHeroTalent}
                onChange={(e) => {
                  setSelectedHeroTalent(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="all">모든 영웅 특성</option>
                {heroTalents[selectedClass]?.map(talent => (
                  <option key={talent} value={talent}>{talent}</option>
                ))}
              </select>
            </div>
          )}

          {/* 스킬 타입 필터 */}
          <div className="filter-group">
            <label>스킬 타입</label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">모든 타입</option>
              <option value="기본">기본</option>
              <option value="특성">특성</option>
              <option value="영웅특성">영웅 특성</option>
              <option value="pvp">PvP</option>
            </select>
          </div>
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="stats-bar">
        <span>검색 결과: {filteredAndSortedSkills.length}개</span>
        <span>현재 페이지: {currentPage} / {totalPages || 1}</span>
      </div>

      {/* 스킬 테이블 */}
      {loading ? (
        <div className="loading">데이터 로딩 중...</div>
      ) : (
        <div className="skill-table-container">
          <table className="skill-table">
            <thead>
              <tr>
                <th width="60">아이콘</th>
                <th onClick={() => handleSort('name')} className="sortable">
                  한글명 {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('nameEn')} className="sortable">
                  영문명 {sortBy === 'nameEn' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('id')} className="sortable" width="100">
                  ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('class')} className="sortable" width="120">
                  직업 {sortBy === 'class' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th width="80">상세</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSkills.map(skill => (
                <tr key={skill.id} className="skill-row">
                  <td className="icon-cell">
                    <img
                      src={getIconUrl(skill.icon)}
                      alt={skill.koreanName}
                      className="skill-icon-small"
                      onError={(e) => {
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                      }}
                    />
                  </td>
                  <td className="name-cell">
                    <span className="skill-name-korean">{skill.koreanName || '이름 없음'}</span>
                  </td>
                  <td className="name-cell">
                    <span className="skill-name-english">{skill.englishName || '-'}</span>
                  </td>
                  <td className="id-cell">
                    <span className="skill-id-badge">{skill.id}</span>
                  </td>
                  <td className="class-cell">
                    <span
                      className="class-badge"
                      style={{
                        backgroundColor: classData[skill.class]?.color || '#888',
                        color: ['사냥꾼', '도적', '사제', '마법사', '수도사'].includes(skill.class) ? '#000' : '#fff'
                      }}
                    >
                      {skill.class}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="detail-button"
                      onClick={() => handleSkillClick(skill)}
                      title="상세 정보 보기"
                    >
                      🔍
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ⏮️
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ◀️
          </button>

          <span className="page-info">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            ▶️
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            ⏭️
          </button>
        </div>
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
    </div>
  );
};

export default AdvancedSpellDatabasePage;