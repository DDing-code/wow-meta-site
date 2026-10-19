import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import kbData from '../data/kb-skills.json';
import { getAllGuideSpecs } from '../data/guideRegistry';
import { marksmanshipGraph, matchesSpell, matchesSpellSpec, spellKind, spellKinds, spellName } from '../data/spellRelations';
import SpellRelationMap, { SpellDetail, SpellIcon, SpellReference } from '../components/SpellRelationMap';

const classLabels = {
  DeathKnight: '죽음의 기사',
  DemonHunter: '악마사냥꾼',
  Druid: '드루이드',
  Evoker: '기원사',
  Hunter: '사냥꾼',
  Mage: '마법사',
  Monk: '수도사',
  Paladin: '성기사',
  Priest: '사제',
  Rogue: '도적',
  Shaman: '주술사',
  Warlock: '흑마법사',
  Warrior: '전사',
};

const Page = styled.div`
  width: min(1320px, calc(100% - 72px));
  margin: 0 auto;
  padding: 48px 0 96px;

  @media (max-width: 1100px) {
    width: calc(100% - 40px);
  }
  @media (max-width: 560px) {
    width: calc(100% - 24px);
    padding-top: 30px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 30px;

  @media (max-width: 760px) {
    display: block;
  }
`;

const Eyebrow = styled.p`
  color: #d2b373;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  color: #eef1f3;
  font-size: clamp(2rem, 4vw, 3.1rem);
`;

const Description = styled.p`
  max-width: 760px;
  color: #aeb8be;
  font-size: 1rem;
  font-weight: 450;
  line-height: 1.78;
  word-break: keep-all;
  margin-top: 14px;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 170px 170px 140px;
  gap: 8px;
  margin-bottom: 14px;
  padding: 12px 0;
  border-top: 1px solid rgba(168, 178, 188, 0.14);
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.input`
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(168, 178, 188, 0.2);
  border-radius: 4px;
  background: rgba(13, 18, 22, 0.72);
  color: #e7ebed;

  &::placeholder {
    color: #727e87;
  }
`;

const Select = styled.select`
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(168, 178, 188, 0.2);
  border-radius: 4px;
  background: #0d1216;
  color: #e7ebed;
`;

const Count = styled.div`
  color: #89959d;
  font-size: 0.8rem;
  font-weight: 540;
  margin-bottom: 10px;
  font-variant-numeric: tabular-nums;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  border-top: 1px solid rgba(168, 178, 188, 0.12);
`;

const Row = styled.button`
  width: 100%;
  text-align: left;
  min-height: 64px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.11);
  border-left: 2px solid transparent;
  background: transparent;
  content-visibility: auto;
  contain-intrinsic-size: auto 64px;
  color: inherit;
  cursor: pointer;
  &[aria-pressed=true] { border-left-color: #aad372; background: #141c14; }

  &:hover {
    border-left-color: #d2b373;
    background: rgba(168, 178, 188, 0.035);
    padding-left: 12px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 38px minmax(0, 1fr);

    > span {
      grid-column: 2;
    }
  }
`;

const Name = styled.div`
  color: #e7ebed;
  font-weight: 680;
  overflow-wrap: anywhere;
`;

const Detail = styled.div`
  margin-top: 2px;
  color: #89959d;
  font-size: 0.78rem;
  font-weight: 450;
  overflow-wrap: anywhere;
`;

const Type = styled.span`
  color: #8f9aa2;
  font-size: 0.72rem;
  font-weight: 560;
`;

const LoadMore = styled.button`
  display: block;
  min-height: 42px;
  margin: 20px auto 0;
  padding: 0 18px;
  border: 1px solid rgba(168, 178, 188, 0.2);
  border-radius: 4px;
  background: transparent;
  color: #d7dde0;
  font-size: 0.8rem;
  font-weight: 650;

  &:hover {
    border-color: #d2b373;
    color: #ffffff;
  }
`;

const skills = Object.values(kbData.skills || {});
const classOptions = Object.keys(classLabels);
const specs = getAllGuideSpecs();
const graphById = new Map(marksmanshipGraph.nodes.map(node => [node.id, node]));
const RESULT_PAGE_SIZE = 48;

const ViewMode = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 3px;
  border: 1px solid #323a3e;
  padding: 3px;
  button { min-height: 36px; padding: 7px 15px; font-size: 12px; color: #89969d; }
  button[aria-pressed=true] { color: #e6ebed; background: #20272b; }
  @media (max-width: 760px) { margin-top: 20px; width: fit-content; }
`;

const Notice = styled.p`
  color: #aab6bd;
  font-size: .82rem;
  margin: 16px 0 20px;
  line-height: 1.8;
`;

const SearchResults = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 0 12px;
  button { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid #323a3e; color: #bcc9d0; font-size: 12px; }
  img { width: 24px; height: 24px; }
  small { color: #89969d; }
`;

function SpellDatabasePage() {
  const [query, setQuery] = useState('');
  const [className, setClassName] = useState('Hunter');
  const [specId, setSpecId] = useState('hunter-marksmanship');
  const [view, setView] = useState('map');
  const [selected, setSelected] = useState(graphById.get('19434'));
  const [type, setType] = useState('all');
  const [visibleCount, setVisibleCount] = useState(RESULT_PAGE_SIZE);
  const spec = specs.find(item => item.id === specId);
  const hasMap = specId === 'hunter-marksmanship';
  const showMap = hasMap && view === 'map';

  const filtered = useMemo(() => {
    const records = showMap ? marksmanshipGraph.nodes : skills;
    return records
      .filter(skill => className === 'all' || skill.class === className)
      .filter(skill => matchesSpellSpec(skill, spec))
      .filter(skill => type === 'all' || spellKind(skill) === type)
      .filter(skill => matchesSpell(skill, query));
  }, [query, className, type, spec, showMap]);

  useEffect(() => {
    setVisibleCount(RESULT_PAGE_SIZE);
  }, [query, className, specId, type, view]);

  const visibleSkills = filtered.slice(0, visibleCount);
  const selectRecord = record => {
    setSelected(graphById.get(record.id) || record);
    setQuery(''); setType('all');
    if (!showMap && window.matchMedia('(max-width:760px)').matches) {
      requestAnimationFrame(() => document.querySelector('.spell-explorer .detail')?.scrollIntoView({ block: 'start', behavior: 'instant' }));
    }
  };
  const clearSelected = () => setSelected(null);
  const resetFilters = () => { setQuery(''); setType('all'); };

  return (
    <Page className="spell-explorer">
      <Header>
        <div>
          <Eyebrow>스펠 DB · 스킬과 특성, 관계의 지도</Eyebrow>
          <Title>{showMap ? '스킬 연결 지도' : '스펠 DB'}</Title>
          <Description>{showMap
            ? '하나의 스킬에서 시작해, 연결된 특성과 운용 원리를 따라가 보세요.'
            : '직업과 전문화로 스킬을 찾고, 이름을 눌러 한국어 설명을 확인하세요.'}</Description>
        </div>
        <ViewMode aria-label="보기 방식">
          <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>관계 지도</button>
          <button type="button" aria-pressed={view === 'list'} onClick={() => { setView('list'); if (type === 'note') setType('all'); }}>목록</button>
        </ViewMode>
      </Header>

      <Controls>
        <Field
          name="spell-search"
          aria-label="스킬과 특성 검색"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Escape') setQuery('');
            if (event.key === 'Enter' && showMap && filtered.length) selectRecord(filtered[0]);
          }}
          placeholder={showMap ? '지도에 있는 스킬·특성·주문 번호 검색' : '스킬·특성·영문명·주문 번호 검색'}
        />
        <Select name="class-filter" aria-label="직업 필터" value={className} onChange={event => {
          setClassName(event.target.value); setSpecId('all'); setSelected(null); resetFilters();
        }}>
          <option value="all">전체 직업</option>
          {classOptions.map(item => (
            <option key={item} value={item}>{classLabels[item]}</option>
          ))}
        </Select>
        <Select name="spec-filter" aria-label="전문화 필터" value={specId} onChange={event => {
          const id = event.target.value;
          setSpecId(id); resetFilters(); setSelected(id === 'hunter-marksmanship' ? graphById.get('19434') : null);
        }}>
          <option value="all">전체 전문화</option>
          {specs.filter(item => className === 'all' || item.kbClass === className).map(item => (
            <option key={item.id} value={item.id}>{className === 'all' ? item.className + ' · ' : ''}{item.spec}</option>
          ))}
        </Select>
        <Select name="type-filter" aria-label="스킬 유형 필터" value={type} onChange={event => setType(event.target.value)}>
          <option value="all">전체 유형</option>
          {Object.entries(spellKinds).filter(([key]) => showMap || key !== 'note').map(([key, item]) => (
            <option key={key} value={key}>{item.label}</option>
          ))}
        </Select>
      </Controls>

      {showMap ? <>
        {query && <SearchResults aria-label="검색 결과">
          {filtered.slice(0, 10).map(record => <SpellReference key={record.id} record={record} onClick={() => selectRecord(record)}>
            <SpellIcon record={record} />{spellName(record)}<small>{spellKinds[spellKind(record)].label}</small>
          </SpellReference>)}
          {filtered.length === 0 && <Notice>지도에서 찾지 못했습니다. 목록 보기에서 사격의 다른 스킬도 검색할 수 있습니다.</Notice>}
        </SearchResults>}
        <SpellRelationMap selected={selected} onSelect={selectRecord} onClear={clearSelected} query={query} kind={type} resetFilters={resetFilters} />
      </> : <>
      {view === 'map' && <Notice>관계 지도는 사냥꾼 · 사격부터 볼 수 있습니다. 선택한 범위의 스킬은 아래 목록에서 확인하세요.</Notice>}
      <Count aria-live="polite">표시 {visibleSkills.length}개 / 검색 결과 {filtered.length}개 / 전체 {skills.length}개</Count>
      <div className="list-workbench"><div>
      <List>
        {visibleSkills.map(skill => (
          <Row
            as={SpellReference}
            record={skill}
            key={`${skill.class}-${skill.spec}-${skill.id}-${skill.type}`}
            type="button"
            aria-pressed={selected?.id === skill.id}
            onClick={() => selectRecord(skill)}
          >
            <SpellIcon record={skill} />
            <div>
              <Name>{spellName(skill)}</Name>
              <Detail className="spell-id">주문 번호 {skill.id}</Detail>
              <Detail>{classLabels[skill.class] || skill.class} / {skill.spec || '공용'} / {skill.englishName}</Detail>
            </div>
            <Type>{spellKinds[spellKind(skill)].label}</Type>
          </Row>
        ))}
      </List>
      {filtered.length === 0 && <Notice>검색 결과가 없습니다. 검색어나 필터를 바꿔 보세요.</Notice>}
      {visibleSkills.length < filtered.length && (
        <LoadMore type="button" onClick={() => setVisibleCount(count => count + RESULT_PAGE_SIZE)}>
          {Math.min(RESULT_PAGE_SIZE, filtered.length - visibleSkills.length)}개 더 보기
        </LoadMore>
      )}
      </div><SpellDetail record={selected} onSelect={selectRecord} onClear={clearSelected} /></div>
      </>}
    </Page>
  );
}

export default SpellDatabasePage;
