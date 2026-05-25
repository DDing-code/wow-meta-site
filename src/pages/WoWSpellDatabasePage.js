import React, { useMemo, useState } from 'react';
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
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
  padding: 40px 0 80px;
`;

const Header = styled.header`
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
`;

const Eyebrow = styled.p`
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  color: #f8fafc;
  font-size: clamp(2rem, 5vw, 3.6rem);
`;

const Description = styled.p`
  max-width: 760px;
  color: #cbd5e1;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 180px 180px;
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.input`
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.78);
  color: #f8fafc;
`;

const Select = styled.select`
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.78);
  color: #f8fafc;
`;

const Count = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 12px;
`;

const List = styled.div`
  display: grid;
  gap: 8px;
`;

const Row = styled.a`
  min-height: 72px;
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);

  &:hover {
    border-color: rgba(203, 213, 225, 0.42);
    background: rgba(30, 41, 59, 0.88);
  }
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #020617;
`;

const Name = styled.div`
  color: #f8fafc;
  font-weight: 800;
`;

const Detail = styled.div`
  color: #94a3b8;
  font-size: 0.84rem;
`;

const Type = styled.span`
  color: #cbd5e1;
  font-size: 0.78rem;
  font-weight: 800;
`;

function normalize(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '');
}

const skills = Object.values(kbData.skills || {});
const classOptions = Object.keys(classLabels);
const typeOptions = Array.from(new Set(skills.map(skill => skill.type).filter(Boolean))).sort();

function SpellDatabasePage() {
  const [query, setQuery] = useState('');
  const [className, setClassName] = useState('all');
  const [type, setType] = useState('all');

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    return skills
      .filter(skill => className === 'all' || skill.class === className)
      .filter(skill => type === 'all' || skill.type === type)
      .filter(skill => {
        if (!normalizedQuery) return true;
        return normalize(`${skill.koreanName} ${skill.name} ${skill.englishName} ${skill.spec}`).includes(normalizedQuery);
      })
      .slice(0, 120);
  }, [query, className, type]);

  return (
    <Page>
      <Header>
        <Eyebrow>{kbData.metadata?.patch || '12.0.5'} spell database</Eyebrow>
        <Title>스펠 DB</Title>
        <Description>
          KB에서 생성된 스킬, 특성, 영웅 특성 데이터를 빠르게 확인합니다. 각 항목은 Wowhead 한국어 페이지로 연결됩니다.
        </Description>
      </Header>

      <Controls>
        <Field value={query} onChange={event => setQuery(event.target.value)} placeholder="스킬, 특성, 영문명 검색" />
        <Select value={className} onChange={event => setClassName(event.target.value)}>
          <option value="all">전체 직업</option>
          {classOptions.map(item => (
            <option key={item} value={item}>{classLabels[item]}</option>
          ))}
        </Select>
        <Select value={type} onChange={event => setType(event.target.value)}>
          <option value="all">전체 유형</option>
          {typeOptions.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
      </Controls>

      <Count>표시 {filtered.length}개 / 전체 {skills.length}개</Count>

      <List>
        {filtered.map(skill => (
          <Row
            key={`${skill.class}-${skill.spec}-${skill.id}-${skill.type}`}
            href={`https://ko.wowhead.com/spell=${skill.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <Icon src={skill.iconUrls?.medium || skill.iconUrl} alt="" />
            <div>
              <Name>{skill.koreanName || skill.name}</Name>
              <Detail>{classLabels[skill.class] || skill.class} / {skill.spec || '공용'} / {skill.englishName}</Detail>
            </div>
            <Type>{skill.type}</Type>
          </Row>
        ))}
      </List>
    </Page>
  );
}

export default SpellDatabasePage;
