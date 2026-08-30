import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import kbData from '../data/kb-skills.json';

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
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 96px;

  @media (max-width: 560px) {
    width: calc(100% - 24px);
    padding-top: 30px;
  }
`;

const Header = styled.header`
  display: grid;
  gap: 12px;
  margin-bottom: 30px;
`;

const Eyebrow = styled.p`
  color: #d2b373;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 180px 180px;
  gap: 8px;
  margin-bottom: 14px;
  padding: 12px 0;
  border-top: 1px solid rgba(168, 178, 188, 0.14);
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.input`
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
  gap: 0;
  border-top: 1px solid rgba(168, 178, 188, 0.12);
`;

const Row = styled.a`
  min-height: 64px;
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.11);
  border-left: 2px solid transparent;
  background: transparent;
  content-visibility: auto;
  contain-intrinsic-size: auto 64px;

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

const Icon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #080b0e;
`;

const Name = styled.div`
  color: #e7ebed;
  font-weight: 680;
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

function normalize(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '');
}

const skills = Object.values(kbData.skills || {});
const classOptions = Object.keys(classLabels);
const typeOptions = Array.from(new Set(skills.map(skill => skill.type).filter(Boolean))).sort();
const RESULT_PAGE_SIZE = 48;

function SpellDatabasePage() {
  const [query, setQuery] = useState('');
  const [className, setClassName] = useState('all');
  const [type, setType] = useState('all');
  const [visibleCount, setVisibleCount] = useState(RESULT_PAGE_SIZE);

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    return skills
      .filter(skill => className === 'all' || skill.class === className)
      .filter(skill => type === 'all' || skill.type === type)
      .filter(skill => {
        if (!normalizedQuery) return true;
        return normalize(`${skill.koreanName} ${skill.name} ${skill.englishName} ${skill.spec}`).includes(normalizedQuery);
      });
  }, [query, className, type]);

  useEffect(() => {
    setVisibleCount(RESULT_PAGE_SIZE);
  }, [query, className, type]);

  const visibleSkills = filtered.slice(0, visibleCount);

  return (
    <Page>
      <Header>
        <Eyebrow>WOWMETA SPELL DATABASE</Eyebrow>
        <Title>스펠 DB</Title>
        <Description>
          KB에서 생성된 스킬, 특성, 영웅 특성 데이터를 빠르게 확인합니다. 각 항목은 Wowhead 한국어 페이지로 연결됩니다.
        </Description>
      </Header>

      <Controls>
        <Field
          name="spell-search"
          aria-label="스킬과 특성 검색"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="스킬, 특성, 영문명 검색…"
        />
        <Select name="class-filter" aria-label="직업 필터" value={className} onChange={event => setClassName(event.target.value)}>
          <option value="all">전체 직업</option>
          {classOptions.map(item => (
            <option key={item} value={item}>{classLabels[item]}</option>
          ))}
        </Select>
        <Select name="type-filter" aria-label="스킬 유형 필터" value={type} onChange={event => setType(event.target.value)}>
          <option value="all">전체 유형</option>
          {typeOptions.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
      </Controls>

      <Count aria-live="polite">표시 {visibleSkills.length}개 / 검색 결과 {filtered.length}개 / 전체 {skills.length}개</Count>

      <List>
        {visibleSkills.map(skill => (
          <Row
            key={`${skill.class}-${skill.spec}-${skill.id}-${skill.type}`}
            href={`https://ko.wowhead.com/spell=${skill.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <Icon src={skill.iconUrls?.medium || skill.iconUrl} alt="" width="40" height="40" loading="lazy" />
            <div>
              <Name>{skill.koreanName || skill.name}</Name>
              <Detail>{classLabels[skill.class] || skill.class} / {skill.spec || '공용'} / {skill.englishName}</Detail>
            </div>
            <Type>{skill.type}</Type>
          </Row>
        ))}
      </List>
      {visibleSkills.length < filtered.length && (
        <LoadMore type="button" onClick={() => setVisibleCount(count => count + RESULT_PAGE_SIZE)}>
          {Math.min(RESULT_PAGE_SIZE, filtered.length - visibleSkills.length)}개 더 보기
        </LoadMore>
      )}
    </Page>
  );
}

export default SpellDatabasePage;
