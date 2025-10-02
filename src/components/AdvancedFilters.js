import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? props.theme.colors.accent : props.theme.colors.secondary};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.primary};
  }
`;

const FiltersGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.subtext};
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const FilterControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 0.7rem;
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.overlay};
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }

  option {
    background: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.text};
  }
`;

const MultiSelect = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 2px solid ${props => props.theme.colors.overlay};
  border-radius: 8px;
  padding: 0.5rem;
  max-height: 150px;
  overflow-y: auto;

  &:focus-within {
    border-color: ${props => props.theme.colors.accent};
  }
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;

  &:hover {
    background: ${props => props.theme.colors.overlay};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${props => props.theme.colors.accent};
  cursor: pointer;
`;

const RangeSlider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.colors.secondary};
  outline: none;
  transition: all 0.3s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const RangeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const DateRangePicker = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const DateInput = styled.input`
  padding: 0.7rem;
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.overlay};
  border-radius: 8px;
  font-size: 0.9rem;
  flex: 1;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.7rem;
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.overlay};
  border-radius: 8px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }

  &::placeholder {
    color: ${props => props.theme.colors.subtext}66;
  }
`;

const QuickFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const QuickFilterChip = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? props.theme.colors.accent : props.theme.colors.secondary};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.accent : props.theme.colors.overlay};
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background: ${props => props.theme.colors.accent}22;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const AppliedFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.overlay};
`;

const FilterTag = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: ${props => props.theme.colors.accent}22;
  border: 1px solid ${props => props.theme.colors.accent};
  border-radius: 16px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.7rem 1.5rem;
  background: ${props => props.variant === 'primary' ? props.theme.colors.accent : props.theme.colors.secondary};
  color: ${props => props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.text};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.variant === 'primary' ? props.theme.colors.warning : props.theme.colors.overlay};
    transform: translateY(-2px);
  }
`;

function AdvancedFilters({ onFilterChange, availableData = {} }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    classes: [],
    specs: [],
    roles: [],
    performance: [0, 100],
    dateRange: { from: '', to: '' },
    difficulty: 'all',
    encounter: 'all',
    playerSearch: '',
    deaths: 'all',
    consumables: 'all',
    mechanics: 'all'
  });

  const [quickFilters, setQuickFilters] = useState({
    topPerformers: false,
    lowPerformers: false,
    noDeaths: false,
    fullConsumables: false,
    recentLogs: false
  });

  // 필터 업데이트
  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // 빠른 필터 토글
  const toggleQuickFilter = (key) => {
    const newQuickFilters = { ...quickFilters, [key]: !quickFilters[key] };
    setQuickFilters(newQuickFilters);

    // 빠른 필터에 따른 메인 필터 업데이트
    let updatedFilters = { ...filters };

    if (key === 'topPerformers') {
      updatedFilters.performance = newQuickFilters[key] ? [75, 100] : [0, 100];
    } else if (key === 'lowPerformers') {
      updatedFilters.performance = newQuickFilters[key] ? [0, 50] : [0, 100];
    } else if (key === 'noDeaths') {
      updatedFilters.deaths = newQuickFilters[key] ? 'none' : 'all';
    } else if (key === 'fullConsumables') {
      updatedFilters.consumables = newQuickFilters[key] ? 'full' : 'all';
    }

    setFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    const defaultFilters = {
      classes: [],
      specs: [],
      roles: [],
      performance: [0, 100],
      dateRange: { from: '', to: '' },
      difficulty: 'all',
      encounter: 'all',
      playerSearch: '',
      deaths: 'all',
      consumables: 'all',
      mechanics: 'all'
    };
    setFilters(defaultFilters);
    setQuickFilters({
      topPerformers: false,
      lowPerformers: false,
      noDeaths: false,
      fullConsumables: false,
      recentLogs: false
    });
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  // 활성 필터 제거
  const removeFilter = (key) => {
    const newFilters = { ...filters };
    if (key === 'performance') {
      newFilters[key] = [0, 100];
    } else if (Array.isArray(newFilters[key])) {
      newFilters[key] = [];
    } else if (typeof newFilters[key] === 'object') {
      newFilters[key] = { from: '', to: '' };
    } else {
      newFilters[key] = 'all';
    }
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // 활성 필터 목록
  const getActiveFilters = () => {
    const active = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        active.push({ key, label: `${key}: ${value.join(', ')}` });
      } else if (key === 'performance' && (value[0] !== 0 || value[1] !== 100)) {
        active.push({ key, label: `성능: ${value[0]}%-${value[1]}%` });
      } else if (key === 'dateRange' && (value.from || value.to)) {
        active.push({ key, label: `날짜: ${value.from} ~ ${value.to}` });
      } else if (typeof value === 'string' && value !== 'all' && value !== '') {
        active.push({ key, label: `${key}: ${value}` });
      }
    });
    return active;
  };

  return (
    <Container>
      <Header>
        <Title>
          🔍 고급 필터
        </Title>
        <ToggleButton
          active={showFilters}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? '필터 숨기기' : '필터 표시'}
        </ToggleButton>
      </Header>

      {/* 빠른 필터 */}
      <QuickFilters>
        <QuickFilterChip
          active={quickFilters.topPerformers}
          onClick={() => toggleQuickFilter('topPerformers')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🏆 상위 25%
        </QuickFilterChip>
        <QuickFilterChip
          active={quickFilters.lowPerformers}
          onClick={() => toggleQuickFilter('lowPerformers')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📉 하위 50%
        </QuickFilterChip>
        <QuickFilterChip
          active={quickFilters.noDeaths}
          onClick={() => toggleQuickFilter('noDeaths')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💀 무사망
        </QuickFilterChip>
        <QuickFilterChip
          active={quickFilters.fullConsumables}
          onClick={() => toggleQuickFilter('fullConsumables')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🧪 풀소모품
        </QuickFilterChip>
        <QuickFilterChip
          active={quickFilters.recentLogs}
          onClick={() => toggleQuickFilter('recentLogs')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📅 최근 7일
        </QuickFilterChip>
      </QuickFilters>

      {/* 상세 필터 */}
      <AnimatePresence>
        {showFilters && (
          <FiltersGrid
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* 플레이어 검색 */}
            <FilterGroup>
              <FilterLabel>플레이어 검색</FilterLabel>
              <SearchInput
                type="text"
                placeholder="플레이어 이름 검색..."
                value={filters.playerSearch}
                onChange={(e) => updateFilter('playerSearch', e.target.value)}
              />
            </FilterGroup>

            {/* 난이도 선택 */}
            <FilterGroup>
              <FilterLabel>난이도</FilterLabel>
              <Select
                value={filters.difficulty}
                onChange={(e) => updateFilter('difficulty', e.target.value)}
              >
                <option value="all">모든 난이도</option>
                <option value="lfr">공격대 찾기</option>
                <option value="normal">일반</option>
                <option value="heroic">영웅</option>
                <option value="mythic">신화</option>
              </Select>
            </FilterGroup>

            {/* 우두머리 선택 */}
            <FilterGroup>
              <FilterLabel>우두머리</FilterLabel>
              <Select
                value={filters.encounter}
                onChange={(e) => updateFilter('encounter', e.target.value)}
              >
                <option value="all">모든 우두머리</option>
                {availableData.encounters?.map(enc => (
                  <option key={enc.id} value={enc.id}>{enc.name}</option>
                ))}
              </Select>
            </FilterGroup>

            {/* 역할 필터 */}
            <FilterGroup>
              <FilterLabel>역할</FilterLabel>
              <MultiSelect>
                {['탱커', '힐러', 'DPS'].map(role => (
                  <CheckboxOption key={role}>
                    <Checkbox
                      type="checkbox"
                      checked={filters.roles.includes(role)}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...filters.roles, role]
                          : filters.roles.filter(r => r !== role);
                        updateFilter('roles', newRoles);
                      }}
                    />
                    {role}
                  </CheckboxOption>
                ))}
              </MultiSelect>
            </FilterGroup>

            {/* 성능 범위 */}
            <FilterGroup>
              <FilterLabel>성능 백분위</FilterLabel>
              <RangeSlider>
                <SliderInput
                  type="range"
                  min="0"
                  max="100"
                  value={filters.performance[1]}
                  onChange={(e) => updateFilter('performance', [filters.performance[0], parseInt(e.target.value)])}
                />
                <RangeDisplay>
                  <span>{filters.performance[0]}%</span>
                  <span>{filters.performance[1]}%</span>
                </RangeDisplay>
              </RangeSlider>
            </FilterGroup>

            {/* 날짜 범위 */}
            <FilterGroup>
              <FilterLabel>날짜 범위</FilterLabel>
              <DateRangePicker>
                <DateInput
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, from: e.target.value })}
                />
                <span style={{ color: '#94a3b8' }}>~</span>
                <DateInput
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, to: e.target.value })}
                />
              </DateRangePicker>
            </FilterGroup>

            {/* 죽음 필터 */}
            <FilterGroup>
              <FilterLabel>죽음</FilterLabel>
              <Select
                value={filters.deaths}
                onChange={(e) => updateFilter('deaths', e.target.value)}
              >
                <option value="all">모두</option>
                <option value="none">무사망</option>
                <option value="one">1회 이하</option>
                <option value="multiple">2회 이상</option>
              </Select>
            </FilterGroup>

            {/* 소모품 필터 */}
            <FilterGroup>
              <FilterLabel>소모품</FilterLabel>
              <Select
                value={filters.consumables}
                onChange={(e) => updateFilter('consumables', e.target.value)}
              >
                <option value="all">모두</option>
                <option value="full">풀 소모품</option>
                <option value="partial">일부 사용</option>
                <option value="none">미사용</option>
              </Select>
            </FilterGroup>

            {/* 역학 실수 */}
            <FilterGroup>
              <FilterLabel>역학 실수</FilterLabel>
              <Select
                value={filters.mechanics}
                onChange={(e) => updateFilter('mechanics', e.target.value)}
              >
                <option value="all">모두</option>
                <option value="none">실수 없음</option>
                <option value="few">3회 이하</option>
                <option value="many">4회 이상</option>
              </Select>
            </FilterGroup>
          </FiltersGrid>
        )}
      </AnimatePresence>

      {/* 적용된 필터 태그 */}
      {getActiveFilters().length > 0 && (
        <AppliedFilters>
          {getActiveFilters().map((filter, index) => (
            <FilterTag
              key={filter.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {filter.label}
              <RemoveButton onClick={() => removeFilter(filter.key)}>
                ×
              </RemoveButton>
            </FilterTag>
          ))}
        </AppliedFilters>
      )}

      {/* 액션 버튼 */}
      {showFilters && (
        <ActionButtons>
          <Button variant="secondary" onClick={resetFilters}>
            필터 초기화
          </Button>
          <Button variant="primary" onClick={() => setShowFilters(false)}>
            필터 적용
          </Button>
        </ActionButtons>
      )}
    </Container>
  );
}

export default AdvancedFilters;