import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, Check, ExternalLink, X } from 'lucide-react';
import {
  FOREVER_ART_NOTE,
  FOREVER_CHECKED_AT,
  FOREVER_NAME,
  foreverHome,
  foreverGuides,
  foreverPages,
  foreverRules,
  foreverSources,
  foreverStart,
} from '../data/foreverGuide.js';

// 포에버 안내 세 장(/forever 한눈에 보기, /forever/start 시작하기, /forever/rules 규칙·진영).
// 글은 src/data/foreverGuide.js에 있고 여기서는 그리기만 한다. 리테일 KB·스킬 자료는 읽지 않는다.
// 숲빛 바탕·금색 제목·초록 이동 표시로 포에버 안내를 구분한다.
// 그림은 공식 아트·공지 스크린샷을 도트로 다시 그린 것(public/images/forever)이고, 글 자료의 art 항목이 어느 그림인지 정한다.

export const FOREVER_ACCENT = '#8dbb6c';
const LINE = '#364438';
const PANEL = '#16231c';

const Surface = styled.div`
  background: #101a15;
  color: #e8e9dc;
  min-height: calc(100vh - 59px);

  a:focus-visible { outline: 2px solid #e4c78b; outline-offset: 4px; }
  ::selection { background: #e4c78b; color: #101a15; }
  @media (prefers-reduced-motion: reduce) {
    a, svg { transition: none; }
    a:hover svg { transform: none; }
  }
`;

const Page = styled.div`
  width: min(1040px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 80px;
  overflow-wrap: anywhere;

  @media (max-width: 560px) {
    width: calc(100% - 24px);
    padding-top: 22px;
  }
`;

// 도트 그림 틀. 비율($ratio)에 맞춰 잘라 보이고, 남길 자리는 $focus로 정한다.
const Frame = styled.div`
  overflow: hidden;
  aspect-ratio: ${props => props.$ratio || '3 / 2'};
  border: 1px solid ${LINE};
  background: #101a15;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${props => props.$focus || 'center'};
  }
`;

const Hero = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  border: 1px solid ${LINE};
  border-top: 3px solid #a98b54;
  background: ${PANEL};

  @media (max-width: 760px) { grid-template-columns: minmax(0, 1fr); }
`;

const HeroCopy = styled.div`
  grid-column: 1;
  grid-row: 1;
  padding: 32px;
  @media (max-width: 760px) { grid-row: 2; padding: 24px 20px; }
`;

const Banner = styled(Frame)`
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
  border: 0;
  border-left: 1px solid ${LINE};
  aspect-ratio: auto;
  min-height: 340px;

  @media (max-width: 760px) {
    grid-column: 1;
    min-height: 0;
    border-left: 0;
    border-bottom: 1px solid ${LINE};
    aspect-ratio: 16 / 9;
  }
`;

const PageNav = styled.nav`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  margin-top: 16px;
  border: 1px solid ${LINE};
  background: ${PANEL};

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 8px;
    border-bottom: 3px solid transparent;
    color: #c4cebd;
    font-size: 0.92rem;
    font-weight: 700;
  }
  a + a { border-left: 1px solid ${LINE}; }
  a[aria-current="page"] { background: #243728; border-bottom-color: ${FOREVER_ACCENT}; color: #f2eddd; }
  a:hover { background: #2b3d2e; color: #f2eddd; }
`;

const Eyebrow = styled.p`
  color: ${FOREVER_ACCENT};
  font-size: 0.85rem;
  font-weight: 700;
`;

const Title = styled.h1`
  margin-top: 14px;
  color: #f0d59b;
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  font-weight: 800;
  line-height: 1.3;
  word-break: keep-all;
`;

const Lead = styled.p`
  max-width: 74ch;
  margin-top: 18px;
  color: #ccd5c6;
  font-size: 1rem;
  line-height: 1.75;
  word-break: keep-all;
`;

const Section = styled.section`
  margin-top: 48px;
`;

const SectionTitle = styled.h2`
  padding: 0 0 14px 14px;
  border-left: 3px solid #a98b54;
  border-bottom: 1px solid ${LINE};
  color: #f0d59b;
  font-size: 1.3rem;
  font-weight: 750;
  line-height: 1.3;
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 24px;
  border: 1px solid ${LINE};
  background: ${PANEL};

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Fact = styled.div`
  display: grid;
  align-content: start;
  gap: 7px;
  padding: 20px 18px;
  border-left: 1px solid ${LINE};

  &:first-child { border-left: 0; }

  dt { color: #acb9a6; font-size: 0.78rem; font-weight: 650; }
  dd { color: #f2eddd; font-size: 1.12rem; font-weight: 750; line-height: 1.35; word-break: keep-all; }
  dd + dd { color: #b8c4af; font-size: 0.84rem; font-weight: 500; }

  @media (max-width: 760px) {
    padding: 14px;
    &:nth-child(odd) { border-left: 0; }
    &:nth-child(n + 3) { border-top: 1px solid ${LINE}; }
    dd { font-size: 1rem; }
  }
`;

const DiffList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const DiffRow = styled.li`
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 12px 28px;
  align-items: start;
  padding: 28px 0;
  border-bottom: 1px solid ${LINE};

  h3 {
    color: ${FOREVER_ACCENT};
    font-size: 1.16rem;
    font-weight: 750;
    line-height: 1.5;
  }

  p { font-size: 1rem; line-height: 1.8; word-break: keep-all; }

  @media (max-width: 820px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    padding: 18px 0;
  }
`;

const DiffArt = styled(Frame)`
  grid-row: span 2;
  @media (max-width: 820px) {
    grid-row: auto;
    aspect-ratio: 16 / 9;
  }
`;

const DiffMain = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;

  p { color: #e8e9dc; }
`;

const Aside = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;
  padding-left: 14px;
  border-left: 2px solid ${LINE};

  p { color: #b8c4af; }

  @media (max-width: 820px) {
    margin-top: 2px;
  }
`;

const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  justify-self: start;
  color: ${FOREVER_ACCENT};
  min-height: 44px;
  font-size: 1rem;
  font-weight: 700;

  text-decoration: underline;
  text-underline-offset: 4px;
  &:hover { color: #f2eddd; }
  &:hover svg { transform: translateX(3px); }
  svg { transition: transform 160ms ease; }
`;

const NextGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const NextCard = styled(Link)`
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 12px 18px 12px 12px;
  border: 1px solid ${LINE};
  border-left: 3px solid ${FOREVER_ACCENT};
  background: ${PANEL};

  > div:not(:first-child) { display: grid; gap: 2px; min-width: 0; }

  @media (max-width: 400px) {
    grid-template-columns: 96px minmax(0, 1fr) auto;
    gap: 12px;
  }

  strong { color: #f2eddd; font-size: 0.98rem; }
  span { color: #b8c4af; font-size: 0.88rem; word-break: keep-all; }
  svg { color: ${FOREVER_ACCENT}; transition: transform 160ms ease; }

  &:hover { background: #243728; border-color: ${FOREVER_ACCENT}; }
  &:hover svg { transform: translateX(3px); }
`;

const Notice = styled.p`
  margin-top: 28px;
  padding: 14px 16px;
  border-left: 3px solid #a98b54;
  background: ${PANEL};
  color: #ccd5c6;
  font-size: 0.9rem;
  line-height: 1.7;
  word-break: keep-all;
`;

// 시작하기: 여섯 단계를 한 줄로 먼저 보여 주는 띠. 누르면 그 단계로 내려간다.
const StepStrip = styled.ol`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin: 26px 0 0;
  padding: 0;
  border: 1px solid ${LINE};
  background: ${PANEL};
  list-style: none;

  li { border-left: 1px solid ${LINE}; }
  li:first-child { border-left: 0; }

  a {
    display: grid;
    gap: 4px;
    height: 100%;
    padding: 12px 12px 13px;
    color: #d7dece;
    font-size: 0.86rem;
    font-weight: 650;
    line-height: 1.35;
    word-break: keep-all;
  }

  a:hover { background: #243728; color: #f2eddd; }

  b { color: ${FOREVER_ACCENT}; font-size: 0.74rem; font-weight: 750; }

  @media (max-width: 760px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    li:nth-child(4) { border-left: 0; }
    li:nth-child(n + 4) { border-top: 1px solid ${LINE}; }
  }
`;

const Steps = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Step = styled.li`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 290px;
  gap: 16px 20px;
  align-items: start;
  padding: 30px 0;
  border-bottom: 1px solid ${LINE};
  scroll-margin-top: 78px;

  @media (max-width: 860px) {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 14px 16px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 12px;
  }
`;

// 좁은 화면에서는 그림이 글 아래로 내려간다(번호 칸은 비운다).
const StepArt = styled(Frame)`
  @media (max-width: 860px) {
    grid-column: 2;
    max-width: 520px;
    aspect-ratio: 16 / 9;
  }
`;

const StepNumber = styled.span`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${FOREVER_ACCENT};
  background: #243728;
  color: ${FOREVER_ACCENT};
  font-size: 1.05rem;
  font-weight: 800;

  @media (max-width: 560px) {
    width: 34px;
    height: 34px;
    font-size: 0.92rem;
  }
`;

const StepBody = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;

  h3 { color: #f2eddd; font-size: 1.04rem; font-weight: 750; line-height: 1.4; }
  p { max-width: 74ch; color: #ccd5c6; font-size: 1rem; line-height: 1.75; word-break: keep-all; }
`;

const TableWrap = styled.div`
  max-width: 620px;
  overflow-x: auto;
  border: 1px solid ${LINE};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;

  th, td { padding: 9px 12px; border-bottom: 1px solid ${LINE}; text-align: left; line-height: 1.45; word-break: keep-all; }
  tr:last-child th, tr:last-child td { border-bottom: 0; }
  thead th { color: #acb9a6; font-size: 0.78rem; font-weight: 700; background: #243728; }
  tbody th { color: #b8c4af; font-weight: 600; }
  td { color: #e8e9dc; }
  td:last-child { color: ${FOREVER_ACCENT}; font-weight: 650; }
`;

const KeyGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    justify-items: start;
    gap: 6px;
    padding: 12px;
    border: 1px solid ${LINE};
    background: ${PANEL};
    color: #d7dece;
    font-size: 0.84rem;
    line-height: 1.35;
    word-break: keep-all;
  }

  kbd {
    min-width: 30px;
    padding: 2px 8px;
    border: 1px solid rgba(168, 178, 188, 0.4);
    color: #f2eddd;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 750;
    text-align: center;
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const TermList = styled.dl`
  margin-top: 6px;

  > div {
    display: grid;
    grid-template-columns: 190px minmax(0, 1fr);
    gap: 18px;
    padding: 13px 0;
    border-bottom: 1px solid ${LINE};
  }

  dt { color: #f2eddd; font-size: 1rem; font-weight: 700; line-height: 1.6; word-break: keep-all; }
  dd { max-width: 74ch; color: #ccd5c6; font-size: 1rem; line-height: 1.7; word-break: keep-all; }

  @media (max-width: 640px) {
    > div { grid-template-columns: minmax(0, 1fr); gap: 2px; }
  }
`;

const BasicList = styled.ul`
  margin: 6px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 120px 150px minmax(0, 1fr);
    gap: 4px 18px;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid ${LINE};
  }

  h3 { color: #f2eddd; font-size: 0.96rem; font-weight: 700; line-height: 1.6; word-break: keep-all; }
  p { max-width: 74ch; color: #ccd5c6; font-size: 1rem; line-height: 1.7; word-break: keep-all; }

  @media (max-width: 640px) {
    li { grid-template-columns: 84px minmax(0, 1fr); gap: 2px 14px; align-items: start; }
    li > div { grid-row: 1 / span 2; }
  }
`;

const TipsRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 24px;
  align-items: center;
  margin-top: 16px;

  @media (max-width: 820px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;

    > div { order: -1; aspect-ratio: 16 / 9; }
  }
`;

const Tips = styled.ol`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0 0 0 22px;
  color: #ccd5c6;
  font-size: 1rem;
  line-height: 1.7;

  li::marker { color: ${FOREVER_ACCENT}; font-weight: 750; }
`;

// 규칙·진영: 상황 → 규칙을 화살표로 잇는 고르기 표.
const Picker = styled.ul`
  margin: 16px 0 0;
  padding: 0;
  border: 1px solid ${LINE};
  background: ${PANEL};
  list-style: none;

  li {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 20px minmax(0, 0.62fr);
    gap: 14px;
    align-items: center;
    padding: 13px 16px;
    border-top: 1px solid ${LINE};
  }

  li:first-child { border-top: 0; }
  li > span { color: #d7dece; font-size: 1rem; line-height: 1.5; word-break: keep-all; }
  li > svg { color: #acb9a6; }
  strong { color: ${FOREVER_ACCENT}; font-size: 1rem; font-weight: 800; }
  em { margin-left: 8px; color: #acb9a6; font-size: 0.8rem; font-style: normal; white-space: nowrap; }

  @media (max-width: 560px) {
    li { grid-template-columns: minmax(0, 1fr); gap: 2px; padding: 12px 14px; }
    li > svg { display: none; }
  }
`;

const RuleGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const RuleCard = styled.li`
  display: grid;
  /* 아직 고를 수 없는 규칙(하드코어)은 맨 아래 한 줄을 다 쓰고, 그림을 왼쪽에 둔다. */
  grid-template-columns: ${props => (props.$later ? 'minmax(0, 1fr) minmax(0, 1fr)' : 'minmax(0, 1fr)')};
  align-content: start;
  border: 1px solid ${LINE};
  border-top: 2px solid ${props => (props.$later ? 'rgba(168, 178, 188, 0.3)' : FOREVER_ACCENT)};
  grid-column: ${props => (props.$later ? '1 / -1' : 'auto')};
  background: ${PANEL};

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }

  h3 {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
    color: #f2eddd;
    font-size: 1.06rem;
    font-weight: 780;
    line-height: 1.4;
  }

  h3 small { color: #acb9a6; font-size: 0.78rem; font-weight: 650; }
  p { color: #ccd5c6; font-size: 1rem; line-height: 1.8; word-break: keep-all; }
`;

const RuleArt = styled(Frame)`
  aspect-ratio: 2 / 1;
  border: 0;
  border-bottom: 1px solid ${LINE};
  /* 아직 열리지 않은 규칙은 그림 색을 조금 뺀다. */
  filter: ${props => (props.$later ? 'saturate(0.7)' : 'none')};

  @media (min-width: 721px) {
    border-bottom-width: ${props => (props.$later ? 0 : '1px')};
    border-right: ${props => (props.$later ? `1px solid ${LINE}` : 0)};
  }
`;

const RuleText = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;
  padding: 16px 18px;
`;

const TogetherArt = styled(Frame)`
  margin-top: 16px;
  aspect-ratio: 2 / 1;

  @media (max-width: 560px) {
    aspect-ratio: 16 / 9;
  }
`;

const FactionLine = styled.p`
  padding-top: 8px;
  border-top: 1px solid ${LINE};

  && { color: #e8e9dc; font-size: 0.86rem; font-weight: 650; }
  span { margin-right: 8px; color: #acb9a6; font-weight: 600; }
`;

const FootNote = styled.p`
  max-width: 78ch;
  margin-top: 12px;
  color: #b8c4af;
  font-size: 0.86rem;
  line-height: 1.7;
  word-break: keep-all;
`;

const CheckList = styled.ul`
  display: grid;
  gap: 0;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr);
    gap: 10px;
    align-items: start;
    padding: 12px 0;
    border-bottom: 1px solid ${LINE};
    color: #e8e9dc;
    font-size: 1rem;
    line-height: 1.6;
    word-break: keep-all;
  }

  svg { margin-top: 3px; }
`;

const SourceBox = styled.footer`
  margin-top: 48px;
  padding-top: 14px;
  border-top: 1px solid ${LINE};

  h2 { color: #acb9a6; font-size: 0.8rem; font-weight: 700; }

  ul {
    display: grid;
    gap: 5px;
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  a {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0 6px;
    color: #b8c4af;
    font-size: 0.84rem;
    line-height: 1.5;
    word-break: keep-all;
  }

  a:hover { color: #f2eddd; }
  a svg { flex: 0 0 auto; align-self: center; }
  time { color: #acb9a6; font-size: 0.78rem; white-space: nowrap; }
  p { margin-top: 10px; color: #acb9a6; font-size: 0.8rem; line-height: 1.6; word-break: keep-all; }
`;

const ART_PATH = '/images/forever';
const ART_WIDTHS = { hero: [768, 1536], square: [512, 1024], scene: [640, 1280] };

// 도트 그림 한 장. 작은 판과 큰 판을 함께 알려 주고 화면 폭에 맞는 쪽을 받게 한다.
function Art({ art, sizes, eager = false }) {
  const [small, large] = ART_WIDTHS[art.kind || 'scene'];
  return (
    <img
      src={`${ART_PATH}/${art.id}-${small}.webp`}
      srcSet={`${ART_PATH}/${art.id}-${small}.webp ${small}w, ${ART_PATH}/${art.id}-${large}.webp ${large}w`}
      sizes={sizes}
      alt={art.alt}
      width={large}
      height={art.kind === 'square' ? large : Math.round((large * 2) / 3)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

function collectSources(...groups) {
  const ids = [];
  groups.flat().forEach(item => {
    // 항목({ sources: [...] }) 묶음과 근거 이름 목록(['rules', ...])을 함께 받는다.
    const list = typeof item === 'string' ? [item] : item.sources || [];
    list.forEach(id => { if (!ids.includes(id)) ids.push(id); });
  });
  return ids;
}

function Sources({ ids }) {
  return (
    <SourceBox>
      <h2>근거 · 블리자드 한국어 공지 ({FOREVER_CHECKED_AT} 확인)</h2>
      <ul>
        {ids.map(id => {
          const source = foreverSources[id];
          return (
            <li key={id}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
                {source.date ? <time dateTime={source.date}>{source.date}</time> : null}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
      <p>{FOREVER_ART_NOTE}</p>
    </SourceBox>
  );
}

function Head({ title, lead, art }) {
  return (
    <>
      <Hero>
        <Banner $focus={art.focus}>
          <Art art={art} sizes="(max-width: 760px) calc(100vw - 32px), 572px" eager />
        </Banner>
        <HeroCopy>
          <Eyebrow>{FOREVER_NAME}</Eyebrow>
          <Title>{title}</Title>
          <Lead>{lead}</Lead>
        </HeroCopy>
      </Hero>
      <PageNav aria-label="포에버 안내">
        {foreverPages.map(page => (
          <NavLink key={page.id} to={page.path} end>{page.label}</NavLink>
        ))}
      </PageNav>
    </>
  );
}

function HomeSection() {
  const data = foreverHome;
  return (
    <>
      <Head title={data.title} lead={data.lead} art={data.art} />
      <Facts>
        {data.facts.map(fact => (
          <Fact key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
            <dd>{fact.note}</dd>
          </Fact>
        ))}
      </Facts>

      <Section aria-labelledby="forever-differences">
        <SectionTitle id="forever-differences">{data.differencesTitle}</SectionTitle>
        <DiffList>
          {data.differences.map(item => (
            <DiffRow key={item.topic}>
              <DiffArt $focus={item.art.focus}>
                <Art art={item.art} sizes="(max-width: 820px) calc(100vw - 32px), 250px" />
              </DiffArt>
              <DiffMain>
                <h3>{item.topic}</h3>
                <p>{item.forever}</p>
              </DiffMain>
              <Aside>
                <p>{item.note}</p>
                {item.link ? (
                  <TextLink to={item.link.path}>
                    {item.link.label}
                    <ArrowRight size={14} aria-hidden="true" />
                  </TextLink>
                ) : null}
              </Aside>
            </DiffRow>
          ))}
        </DiffList>
      </Section>

      <Section aria-labelledby="forever-next">
        <SectionTitle id="forever-next">이어서 보기</SectionTitle>
        <NextGrid>
          {data.next.map(item => (
            <NextCard key={item.path} to={item.path}>
              <Frame>
                <Art art={item.art} sizes="132px" />
              </Frame>
              <div>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
            </NextCard>
          ))}
        </NextGrid>
        <Notice>{data.notice}</Notice>
      </Section>

      <Sources ids={collectSources(data.facts, data.differences)} />
    </>
  );
}

function StartSection() {
  const data = foreverStart;
  return (
    <>
      <Head title={data.title} lead={data.lead} art={data.art} />
      <StepStrip aria-label="시작 여섯 단계">
        {data.steps.map((step, index) => (
          <li key={step.short}>
            <a href={`#step-${index + 1}`}>
              <b>{index + 1}단계</b>
              {step.short}
            </a>
          </li>
        ))}
      </StepStrip>

      <Section aria-label="단계별 안내">
        <Steps>
          {data.steps.map((step, index) => (
            <Step key={step.short} id={`step-${index + 1}`}>
              <StepNumber aria-hidden="true">{index + 1}</StepNumber>
              <StepBody>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {step.presets ? (
                  <TableWrap>
                    <Table>
                      <thead>
                        <tr>{data.presets.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr>
                      </thead>
                      <tbody>
                        {data.presets.rows.map(([label, classic, enhanced]) => (
                          <tr key={label}>
                            <th scope="row">{label}</th>
                            <td>{classic}</td>
                            <td>{enhanced}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableWrap>
                ) : null}
                {step.link ? (
                  <TextLink to={step.link.path}>
                    {step.link.label}
                    <ArrowRight size={14} aria-hidden="true" />
                  </TextLink>
                ) : null}
              </StepBody>
              <StepArt $focus={step.art.focus}>
                <Art art={step.art} sizes="(max-width: 860px) min(520px, calc(100vw - 80px)), 290px" />
              </StepArt>
            </Step>
          ))}
        </Steps>
      </Section>

      <Section aria-labelledby="forever-first">
        <SectionTitle id="forever-first">{data.firstTitle}</SectionTitle>
        <KeyGrid aria-label="기본 단축키">
          {data.keys.map(item => (
            <li key={item.key}>
              <kbd>{item.key}</kbd>
              {item.label}
            </li>
          ))}
        </KeyGrid>
        <BasicList>
          {data.basics.map(item => (
            <li key={item.title}>
              <Frame $ratio="1 / 1">
                <Art art={item.art} sizes="120px" />
              </Frame>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </BasicList>
      </Section>

      <Section aria-labelledby="forever-tips">
        <SectionTitle id="forever-tips">{data.tipsTitle}</SectionTitle>
        <TipsRow>
          <Tips>
            {data.tips.map(tip => <li key={tip}>{tip}</li>)}
          </Tips>
          <Frame $focus={data.tipsArt.focus}>
            <Art art={data.tipsArt} sizes="(max-width: 820px) calc(100vw - 32px), 330px" />
          </Frame>
        </TipsRow>
      </Section>

      <Sources ids={collectSources(data.steps, data.basicsSources)} />
    </>
  );
}

function RulesSection() {
  const data = foreverRules;
  return (
    <>
      <Head title={data.title} lead={data.lead} art={data.art} />

      <Section aria-labelledby="forever-picker">
        <SectionTitle id="forever-picker">{data.pickerTitle}</SectionTitle>
        <Picker>
          {data.picker.map(item => (
            <li key={item.rule}>
              <span>{item.when}</span>
              <ArrowRight size={16} aria-hidden="true" />
              <span>
                <strong>{item.rule}</strong>
                {item.note ? <em>{item.note}</em> : null}
              </span>
            </li>
          ))}
        </Picker>
      </Section>

      <Section aria-labelledby="forever-rule-list">
        <SectionTitle id="forever-rule-list">{data.rulesTitle}</SectionTitle>
        <RuleGrid>
          {data.rules.map(rule => (
            <RuleCard key={rule.name} $later={Boolean(rule.tag)}>
              <RuleArt $later={Boolean(rule.tag)} $focus={rule.art.focus}>
                <Art art={rule.art} sizes="(max-width: 720px) calc(100vw - 32px), 520px" />
              </RuleArt>
              <RuleText>
                <h3>
                  {rule.name}
                  {rule.tag ? <small>{rule.tag}</small> : null}
                </h3>
                <p>{rule.body}</p>
                <FactionLine>
                  <span>진영</span>
                  {rule.faction}
                </FactionLine>
              </RuleText>
            </RuleCard>
          ))}
        </RuleGrid>
        <FootNote>{data.factionNote}</FootNote>
      </Section>

      <Section aria-labelledby="forever-together">
        <SectionTitle id="forever-together">{data.togetherTitle}</SectionTitle>
        <TogetherArt $focus={data.togetherArt.focus}>
          <Art art={data.togetherArt} sizes="(max-width: 1072px) calc(100vw - 32px), 1040px" />
        </TogetherArt>
        <CheckList>
          {data.together.map(item => (
            <li key={item.text}>
              {item.ok
                ? <Check size={17} color={FOREVER_ACCENT} aria-label="됩니다" />
                : <X size={17} color="#d98a7a" aria-label="안 됩니다" />}
              {item.text}
            </li>
          ))}
        </CheckList>
      </Section>

      <Section aria-labelledby="forever-limits">
        <SectionTitle id="forever-limits">{data.limitsTitle}</SectionTitle>
        <TermList>
          {data.limits.map(item => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </TermList>
      </Section>

      <Sources ids={collectSources(data.rules, data.togetherSources, data.limitsSources)} />
    </>
  );
}

const SECTIONS = { home: HomeSection, start: StartSection, rules: RulesSection };

const GuideContents = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  margin-top: 24px;
  padding: 16px 0;
  border-block: 1px solid ${LINE};

  a { color: ${FOREVER_ACCENT}; font-size: 0.88rem; line-height: 1.6; }
  a:hover { color: #eef1f3; }
`;

const GuideBlock = styled(Section)`
  scroll-margin-top: 78px;

  > p { margin-top: 14px; color: #c3ccd1; line-height: 1.75; word-break: keep-all; }
  > a { display: inline-flex; margin-top: 12px; color: #8f9aa2; font-size: 0.8rem; }
  > a:hover { color: #eef1f3; }
`;

const GuideTableWrap = styled(TableWrap)`
  max-width: 100%;
  margin-top: 16px;

  table { min-width: 590px; }
  th:first-child { width: 26%; }
  td:last-child { color: #c3ccd1; font-weight: 500; }
  &:focus-visible { outline: 2px solid ${FOREVER_ACCENT}; outline-offset: 3px; }
`;

function GuideSection({ data }) {
  return (
    <>
      <Head title={data.title} lead={data.lead} art={data.art} />
      <GuideContents aria-label="이 페이지 목차">
        {data.sections.map(block => <a key={block.id} href={`#${block.id}`}>{block.title}</a>)}
      </GuideContents>
      {data.sections.map(block => (
        <GuideBlock key={block.id} id={block.id} aria-labelledby={`${block.id}-title`}>
          <SectionTitle id={`${block.id}-title`}>{block.title}</SectionTitle>
          {block.lead ? <p>{block.lead}</p> : null}
          {block.items ? (
            <TermList>
              {block.items.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.body}</dd></div>)}
            </TermList>
          ) : null}
          {block.table ? (
            <>
              <FootNote>좁은 화면에서는 표를 좌우로 밀어 볼 수 있습니다.</FootNote>
              <GuideTableWrap tabIndex={0} role="region" aria-label={`${block.title} 표 · 좌우로 이동 가능`}>
                <Table aria-labelledby={`${block.id}-title`}>
                  <thead><tr>{block.table.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
                  <tbody>{block.table.rows.map(([label, ...cells]) => (
                    <tr key={[label, ...cells].join('|')}><th scope="row">{label}</th>{cells.map((cell, index) => <td key={index}>{cell}</td>)}</tr>
                  ))}</tbody>
                </Table>
              </GuideTableWrap>
            </>
          ) : null}
          <a href={foreverSources[block.sources[0]].url} target="_blank" rel="noopener noreferrer" aria-label={`${block.title} 공식 근거`}>블리자드 공식 안내 ↗</a>
        </GuideBlock>
      ))}
      <Sources ids={collectSources(data.sections)} />
    </>
  );
}

export default function ForeverPage({ section = 'home' }) {
  const Content = SECTIONS[section] || HomeSection;
  const guide = foreverGuides[section];
  return (
    <Surface>
      <Page data-forever-section={section}>
      {guide ? <GuideSection data={guide} /> : <Content />}
      </Page>
    </Surface>
  );
}
