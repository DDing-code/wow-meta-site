import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, Check, ExternalLink, X } from 'lucide-react';
import {
  FOREVER_ART_NOTE,
  FOREVER_CHECKED_AT,
  FOREVER_NAME,
  foreverHome,
  foreverRules,
  foreverSources,
  foreverStart,
} from '../data/foreverGuide.js';

// 포에버 안내 세 장(/forever 한눈에 보기, /forever/start 시작하기, /forever/rules 규칙·진영).
// 글은 src/data/foreverGuide.js에 있고 여기서는 그리기만 한다. 리테일 KB·스킬 자료는 읽지 않는다.
// 사이트의 평면 디자인(발광·그림자·둥근 모서리 없음)을 따르고, 포에버 쪽 강조색만 초록으로 둔다.
// 그림은 공식 아트·공지 스크린샷을 도트로 다시 그린 것(public/images/forever)이고, 글 자료의 art 항목이 어느 그림인지 정한다.

export const FOREVER_ACCENT = '#8dbb6c';
const LINE = 'rgba(168, 178, 188, 0.14)';
const PANEL = 'rgba(13, 18, 22, 0.62)';

const Page = styled.div`
  width: min(1040px, calc(100% - 32px));
  margin: 0 auto;
  padding: 34px 0 96px;

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
  background: #0b0f13;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${props => props.$focus || 'center'};
  }
`;

// 쪽 맨 위 대표 그림.
const Banner = styled(Frame)`
  margin-bottom: 24px;
  aspect-ratio: 11 / 5;

  @media (max-width: 560px) {
    margin-bottom: 18px;
    aspect-ratio: 16 / 9;
  }
`;

const Eyebrow = styled.p`
  color: ${FOREVER_ACCENT};
  font-size: 0.8rem;
  font-weight: 700;
`;

const Title = styled.h1`
  margin-top: 6px;
  color: #eef1f3;
  font-size: clamp(1.7rem, 4.4vw, 2.3rem);
  font-weight: 800;
  line-height: 1.25;
`;

const Lead = styled.p`
  max-width: 74ch;
  margin-top: 12px;
  color: #c3ccd1;
  font-size: 1rem;
  line-height: 1.75;
  word-break: keep-all;
`;

const Section = styled.section`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  padding-bottom: 10px;
  border-bottom: 1px solid ${LINE};
  color: #eef1f3;
  font-size: 1.16rem;
  font-weight: 750;
  line-height: 1.3;
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 26px;
  border: 1px solid ${LINE};
  background: ${PANEL};

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Fact = styled.div`
  display: grid;
  align-content: start;
  gap: 2px;
  padding: 16px 18px;
  border-left: 1px solid ${LINE};

  &:first-child { border-left: 0; }

  dt { color: #8f9aa2; font-size: 0.78rem; font-weight: 650; }
  dd { color: #eef1f3; font-size: 1.12rem; font-weight: 750; line-height: 1.35; word-break: keep-all; }
  dd + dd { color: #aeb8be; font-size: 0.84rem; font-weight: 500; }

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
  grid-template-columns: 250px minmax(0, 1fr) minmax(0, 0.78fr);
  gap: 22px;
  align-items: start;
  padding: 18px 0;
  border-bottom: 1px solid ${LINE};

  h3 {
    color: ${FOREVER_ACCENT};
    font-size: 1rem;
    font-weight: 750;
    line-height: 1.5;
  }

  p { font-size: 0.94rem; line-height: 1.7; word-break: keep-all; }

  @media (max-width: 820px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    padding: 18px 0;
  }
`;

const DiffArt = styled(Frame)`
  @media (max-width: 820px) {
    aspect-ratio: 16 / 9;
  }
`;

const DiffMain = styled.div`
  display: grid;
  align-content: start;
  gap: 4px;
  min-width: 0;

  p { color: #e7ebed; }
`;

const Aside = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;
  padding-left: 14px;
  border-left: 2px solid rgba(168, 178, 188, 0.2);

  p { color: #aeb8be; }

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
  font-size: 0.86rem;
  font-weight: 700;

  &:hover { color: #eef1f3; }
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
  border: 1px solid rgba(168, 178, 188, 0.18);
  border-left: 3px solid ${FOREVER_ACCENT};
  background: ${PANEL};

  > div:not(:first-child) { display: grid; gap: 2px; min-width: 0; }

  @media (max-width: 400px) {
    grid-template-columns: 96px minmax(0, 1fr) auto;
    gap: 12px;
  }

  strong { color: #eef1f3; font-size: 0.98rem; }
  span { color: #aeb8be; font-size: 0.88rem; word-break: keep-all; }
  svg { color: ${FOREVER_ACCENT}; transition: transform 160ms ease; }

  &:hover { background: rgba(168, 178, 188, 0.045); }
  &:hover svg { transform: translateX(3px); }
`;

const Notice = styled.p`
  margin-top: 28px;
  padding: 14px 16px;
  border: 1px solid ${LINE};
  color: #c3ccd1;
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
    color: #cdd4d8;
    font-size: 0.86rem;
    font-weight: 650;
    line-height: 1.35;
    word-break: keep-all;
  }

  a:hover { background: rgba(168, 178, 188, 0.06); color: #eef1f3; }

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
  padding: 22px 0;
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

  h3 { color: #eef1f3; font-size: 1.04rem; font-weight: 750; line-height: 1.4; }
  p { max-width: 74ch; color: #c3ccd1; font-size: 0.94rem; line-height: 1.75; word-break: keep-all; }
`;

const TableWrap = styled.div`
  max-width: 620px;
  overflow-x: auto;
  border: 1px solid ${LINE};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;

  th, td { padding: 9px 12px; border-bottom: 1px solid ${LINE}; text-align: left; line-height: 1.45; word-break: keep-all; }
  tr:last-child th, tr:last-child td { border-bottom: 0; }
  thead th { color: #8f9aa2; font-size: 0.78rem; font-weight: 700; background: rgba(168, 178, 188, 0.05); }
  tbody th { color: #aeb8be; font-weight: 600; }
  td { color: #e7ebed; }
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
    color: #cdd4d8;
    font-size: 0.84rem;
    line-height: 1.35;
    word-break: keep-all;
  }

  kbd {
    min-width: 30px;
    padding: 2px 8px;
    border: 1px solid rgba(168, 178, 188, 0.4);
    color: #eef1f3;
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

  dt { color: #eef1f3; font-size: 0.94rem; font-weight: 700; line-height: 1.6; word-break: keep-all; }
  dd { max-width: 74ch; color: #c3ccd1; font-size: 0.94rem; line-height: 1.7; word-break: keep-all; }

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

  h3 { color: #eef1f3; font-size: 0.96rem; font-weight: 700; line-height: 1.6; word-break: keep-all; }
  p { max-width: 74ch; color: #c3ccd1; font-size: 0.94rem; line-height: 1.7; word-break: keep-all; }

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
  color: #c3ccd1;
  font-size: 0.94rem;
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
  li > span { color: #cdd4d8; font-size: 0.94rem; line-height: 1.5; word-break: keep-all; }
  li > svg { color: #6f7b83; }
  strong { color: ${FOREVER_ACCENT}; font-size: 1rem; font-weight: 800; }
  em { margin-left: 8px; color: #8f9aa2; font-size: 0.8rem; font-style: normal; white-space: nowrap; }

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
    color: #eef1f3;
    font-size: 1.06rem;
    font-weight: 780;
    line-height: 1.4;
  }

  h3 small { color: #8f9aa2; font-size: 0.78rem; font-weight: 650; }
  p { color: #c3ccd1; font-size: 0.92rem; line-height: 1.7; word-break: keep-all; }
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

  && { color: #e7ebed; font-size: 0.86rem; font-weight: 650; }
  span { margin-right: 8px; color: #8f9aa2; font-weight: 600; }
`;

const FootNote = styled.p`
  max-width: 78ch;
  margin-top: 12px;
  color: #aeb8be;
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
    color: #e7ebed;
    font-size: 0.94rem;
    line-height: 1.6;
    word-break: keep-all;
  }

  svg { margin-top: 3px; }
`;

const SourceBox = styled.footer`
  margin-top: 48px;
  padding-top: 14px;
  border-top: 1px solid ${LINE};

  h2 { color: #8f9aa2; font-size: 0.8rem; font-weight: 700; }

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
    color: #aeb8be;
    font-size: 0.84rem;
    line-height: 1.5;
    word-break: keep-all;
  }

  a:hover { color: #eef1f3; }
  a svg { flex: 0 0 auto; align-self: center; }
  time { color: #6f7b83; font-size: 0.78rem; white-space: nowrap; }
  p { margin-top: 10px; color: #8f9aa2; font-size: 0.8rem; line-height: 1.6; word-break: keep-all; }
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
    <header>
      <Banner $focus={art.focus}>
        <Art art={art} sizes="(max-width: 1072px) calc(100vw - 32px), 1040px" eager />
      </Banner>
      <Eyebrow>{FOREVER_NAME}</Eyebrow>
      <Title>{title}</Title>
      <Lead>{lead}</Lead>
    </header>
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

export default function ForeverPage({ section = 'home' }) {
  const Content = SECTIONS[section] || HomeSection;
  return (
    <Page data-forever-section={section}>
      <Content />
    </Page>
  );
}
