import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, Search } from 'lucide-react';
import { beginnerSections, beginnerSources } from '../data/beginnerGuide.js';

const Page = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 96px;
  word-break: keep-all;
  overflow-wrap: anywhere;
  @media (max-width: 560px) { width: calc(100% - 24px); padding-top: 30px; }
`;
const Header = styled.header`
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
  h1 { margin-top: 8px; font-size: clamp(2rem, 4vw, 3.1rem); line-height: 1.2; }
  p:last-child { max-width: 720px; margin-top: 16px; color: #aeb8be; }
`;
const Label = styled.p`
  color: #d2b373;
  font-size: 0.78rem;
  font-weight: 700;
`;
const Start = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 24px 0 32px;
  border-top: 1px solid rgba(168, 178, 188, 0.14);
  a { padding: 16px; border-bottom: 1px solid rgba(168, 178, 188, 0.14); border-right: 1px solid rgba(168, 178, 188, 0.14); }
  a:first-child { padding-left: 0; }
  a:last-child { border-right: 0; }
  a:hover strong { color: #d2b373; }
  span { display: block; margin-top: 4px; color: #aeb8be; font-size: 0.84rem; }
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
    a, a:first-child { padding: 14px 0; border-right: 0; }
  }
`;
const SearchBox = styled.div`
  label { display: block; margin-bottom: 8px; font-size: 0.88rem; font-weight: 650; }
`;
const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid #59636b;
  background: #0f1419;
  svg { flex: 0 0 auto; color: #aeb8be; }
  input { min-width: 0; width: 100%; padding: 12px 0; border: 0; background: transparent; color: #eef1f3; font-size: 1rem; }
  input::placeholder { color: #8f9aa2; }
`;
const Status = styled.p`
  min-height: 24px;
  margin-top: 8px;
  color: #aeb8be;
  font-size: 0.8rem;
`;
const Body = styled.div`
  display: grid;
  grid-template-columns: 184px minmax(0, 1fr);
  gap: 48px;
  margin-top: 28px;
  @media (max-width: 840px) { grid-template-columns: minmax(0, 1fr); gap: 28px; }
`;
const Contents = styled.nav`
  position: sticky;
  top: 86px;
  align-self: start;
  p { color: #8f9aa2; font-size: 0.76rem; margin-bottom: 10px; }
  a { display: block; padding: 10px 0; color: #aeb8be; border-bottom: 1px solid rgba(168, 178, 188, 0.12); font-size: 0.86rem; }
  a:hover { color: #d2b373; }
  @media (max-width: 840px) {
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 0 20px;
    p { width: 100%; }
    a { min-height: 44px; }
  }
`;
const Section = styled.section`
  min-width: 0;
  scroll-margin-top: 86px;
  & + & { margin-top: 56px; }
  h2 { font-size: clamp(1.4rem, 3vw, 1.8rem); line-height: 1.35; }
`;
const Intro = styled.p`
  margin: 10px 0 20px;
  color: #aeb8be;
  font-size: 0.92rem;
`;
const Note = styled.p`
  padding: 14px 16px;
  margin-bottom: 20px;
  border-left: 2px solid #d2b373;
  background: rgba(210, 179, 115, 0.05);
  color: #c7c1b4;
  font-size: 0.86rem;
`;
const Entries = styled.dl`
  border-top: 1px solid rgba(168, 178, 188, 0.2);
`;
const Entry = styled.div`
  display: grid;
  grid-template-columns: 174px minmax(0, 1fr);
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
  dt { color: #eef1f3; font-weight: 700; font-size: 0.94rem; }
  dt span { display: block; margin-top: 5px; color: #d2b373; font-size: 0.76rem; font-weight: 500; }
  dd { color: #c0c8ce; font-size: 0.92rem; line-height: 1.85; }
  dd p + p { margin-top: 8px; color: #98a6af; font-size: 0.84rem; }
  @media (max-width: 620px) { grid-template-columns: minmax(0, 1fr); gap: 8px; }
`;
const Empty = styled.div`
  padding: 32px 0;
  p { margin-bottom: 16px; color: #aeb8be; }
`;
const Reset = styled.button`
  min-height: 44px;
  padding: 8px 16px;
  border: 1px solid #59636b;
  color: #eef1f3;
  background: transparent;
  font-size: 0.9rem;
`;
const Footer = styled.footer`
  margin-top: 48px;
  padding-top: 28px;
  border-top: 1px solid rgba(168, 178, 188, 0.2);
  h2 { font-size: 1.25rem; }
  p { margin-top: 10px; color: #aeb8be; font-size: 0.88rem; }
  > a { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; margin-top: 16px; color: #d2b373; font-weight: 650; }
  details { margin-top: 32px; color: #aeb8be; font-size: 0.82rem; }
  summary { cursor: pointer; padding: 10px 0; }
  ul { padding-left: 20px; }
  li { margin-top: 10px; }
  li a { text-decoration: underline; text-underline-offset: 3px; color: #c6d0d6; }
`;

function BeginnerPage() {
  const [search, setSearch] = useState('');
  const query = search.trim().toLocaleLowerCase();
  const sections = beginnerSections.map(section => ({
    ...section,
    entries: section.entries.filter(entry => !query ||
      [section.title, entry.term, entry.aliases, entry.when, entry.description, entry.tip].filter(Boolean).join(' ').toLocaleLowerCase().includes(query)),
  })).filter(section => section.entries.length);
  const count = sections.reduce((total, section) => total + section.entries.length, 0);

  return (
    <Page>
      <Header>
        <Label>와우의 첫걸음 · 본 서버 공통 개념</Label>
        <h1>초보자 안내</h1>
        <p>처음 보는 말이 많아도 괜찮습니다. 역할과 전투 용어부터 영약·물약을 쓰는 이유까지, 가이드를 읽기 전에 알아두면 좋은 내용을 모았습니다.</p>
      </Header>
      <Start aria-label="상황별 바로가기">
        <a href="#basics" onClick={() => setSearch('')}><strong>와우가 처음이라면</strong><span>직업과 역할부터 알아보기</span></a>
        <a href="#consumables" onClick={() => setSearch('')}><strong>무엇을 챙겨야 할까?</strong><span>영약·물약·음식 구별하기</span></a>
        <a href="#ready" onClick={() => setSearch('')}><strong>첫 파티를 앞두고 있다면</strong><span>출발 전 다섯 가지 확인</span></a>
      </Start>
      <SearchBox>
        <label htmlFor="beginner-search">모르는 말 찾아보기</label>
        <SearchField><Search size={18} aria-hidden="true" /><input id="beginner-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="예: 영약, 쐐기, 어그로, 마부" aria-controls="beginner-results" /></SearchField>
        <Status role="status">{query ? `검색 결과 ${count}개 · 뜻과 설명에서 함께 찾습니다.` : `${count}개 설명 · 처음부터 읽거나 필요한 말만 찾아보세요.`}</Status>
      </SearchBox>
      <Body>
        <Contents aria-label="초보자 안내 목차">
          <p>이 페이지에서</p>
          {sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
          {query ? <Reset type="button" onClick={() => setSearch('')}>검색 지우기</Reset> : null}
        </Contents>
        <div id="beginner-results">
          {sections.length ? sections.map(section => (
            <Section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              <Intro>{section.intro}</Intro>
              {section.note ? <Note>{section.note}</Note> : null}
              <Entries>{section.entries.map(entry => (
                <Entry key={entry.term}>
                  <dt>{entry.term}{entry.when ? <span>{entry.when}</span> : null}</dt>
                  <dd><p>{entry.description}</p><p>{entry.tip}</p></dd>
                </Entry>
              ))}</Entries>
            </Section>
          )) : <Empty><h2>일치하는 설명이 없습니다</h2><p>더 짧은 말이나 다른 표현으로 찾아보세요. 예: 힐, 쿨, 물약.</p><Reset type="button" onClick={() => setSearch('')}>전체 설명 보기</Reset></Empty>}
          <Footer>
            <h2>이제 내 직업을 알아볼까요?</h2>
            <p>공통 개념을 익혔다면 전문화 가이드에서 내 스킬과 전투 흐름, 특성 견본을 확인하세요.</p>
            <Link to="/guide">내 직업 가이드 찾기 <ArrowRight size={16} aria-hidden="true" /></Link>
            <details><summary>설명의 범위와 공식 참고 자료</summary>
              <p>클래식이 아닌 본 서버의 공통 개념을 다룹니다. 시즌별 입장 조건·보상 수치·구매할 소모품 목록은 게임 안 안내와 현재 전문화 가이드를 확인하세요. 과거 공식 소개 글은 시스템의 기본 개념을 참고한 자료이며, 당시 수치를 현재 시즌에 적용하지 않습니다.</p>
              <ul>{beginnerSources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a> — {source.detail}</li>)}</ul>
            </details>
          </Footer>
        </div>
      </Body>
    </Page>
  );
}

export default BeginnerPage;
