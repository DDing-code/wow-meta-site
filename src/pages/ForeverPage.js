import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { ArrowRight, ArrowUpRight, Check, ExternalLink, X } from 'lucide-react';
import '../styles/ForeverFonts.css';
import ForeverSpell, { ForeverText, classSpells } from '../components/forever/ForeverSpell';
import ForeverMap from '../components/forever/ForeverMap';
import LevelingJourney from '../components/forever/LevelingJourney';
import { Flow, SkillGroups, TalentGrowth, Facilities } from '../components/forever/ForeverVisuals';
import {
  FOREVER_ART_NOTE,
  FOREVER_CHECKED_AT,
  FOREVER_NAME,
  foreverHome,
  foreverGuides,
  foreverDetailGuides,
  foreverPages,
  isForeverPageActive,
  foreverRules,
  foreverSources,
  foreverStart,
} from '../data/foreverGuide.js';

// 포에버 안내 여덟 쪽. 도트 풍경과 하늘색 모험 일지 테마를 공유한다.
// 글은 src/data/foreverGuide.js에 있고 여기서는 그리기만 한다. 리테일 KB·스킬 자료는 읽지 않는다.
// 어두운 무채색 바탕·중립적인 본문·하늘색 이동 표시로 포에버 안내를 구분한다.
// 그림은 공식 아트·공지 스크린샷을 도트로 다시 그린 것(public/images/forever)이고, 글 자료의 art 항목이 어느 그림인지 정한다.

export const FOREVER_ACCENT = '#8dd9f5';
const LINE = '#353a43';
const PANEL = 'var(--fv-panel)';
const RAISED_PANEL = 'linear-gradient(#30373f, #20252c)';
// 모서리는 고정하고 직선 부분만 늘려 창 크기가 달라도 장식이 찌그러지지 않는다.
const pixelFrame = css`
  border: 10px solid #59636e;
  border-image: var(--fv-frame) 16% / 26px / 0 stretch;
  box-shadow: 0 3px 0 #080a0d, inset 0 0 0 1px #080a0d;
`;

const Surface = styled.div`
  background: #101216;
  color: #e5e7eb;
  min-height: calc(100dvh - 59px);

  a:focus-visible { outline: 2px solid #9edff7; outline-offset: 4px; }
  ::selection { background: #9edff7; color: #101216; }
  h1, h2, h3, nav, kbd {
    font-family: 'Galmuri11', 'Noto Sans KR', sans-serif;
    font-synthesis: none;
    letter-spacing: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    a, svg { transition: none; }
    a:hover svg { transform: none; }
  }
`;

const Page = styled.div`
  width: min(1240px, calc(100% - 32px));
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
  position: relative;
  overflow: hidden;
  aspect-ratio: ${props => props.$ratio || '3 / 2'};
  border: 2px solid #454a53;
  background: #101216;

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px solid #838b9855;
    pointer-events: none;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${props => props.$focus || 'center'};
    image-rendering: pixelated;
  }
`;

const Hero = styled.header`
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: ${props => props.$compact ? '300px' : '420px'};
  align-items: center;
  border: 1px solid #58616e;
  background: #101216;
  box-shadow: 6px 6px 0 #090b0e;

  @media (max-width: 760px) { min-height: 0; }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    ${pixelFrame}
  }
`;

const HeroCopy = styled.div`
  grid-column: 1;
  grid-row: 1;
  position: relative;
  z-index: 1;
  width: 56%;
  padding: 42px;
  text-shadow: 2px 2px 0 #090b0e;
  @media (max-width: 760px) { grid-row: 2; width: 100%; padding: 24px 28px 28px; }
`;

const Banner = styled(Frame)`
  position: absolute;
  inset: 0;
  grid-column: 1;
  grid-row: 1;
  align-self: stretch;
  border: 0;
  aspect-ratio: auto;
  &::after {
    inset: 0;
    border: 0;
    background: linear-gradient(90deg, #101216 0%, #101216f2 27%, #101216bb 52%, #10121630 78%, #10121600), linear-gradient(0deg, #10121666, transparent 45%);
  }

  @media (max-width: 760px) {
    position: relative;
    grid-column: 1;
    min-height: 0;
    border-left: 0;
    border-bottom: 1px solid ${LINE};
    aspect-ratio: 16 / 9;
    img { object-position: ${props => props.$focus || 'center'}; }
    &::after { background: linear-gradient(0deg, #101216, transparent 35%); }
  }
`;

const PageNav = styled.nav`
  display: grid;
  grid-template-columns: repeat(${foreverPages.length}, minmax(0, 1fr));
  margin-top: 10px;
  padding: 6px;
  gap: 5px;
  border: 1px solid #697581;
  background: ${PANEL};
  box-shadow: 4px 4px 0 #090b0e;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 8px;
    border: 1px solid #56616d;
    box-shadow: inset 1px 1px #626c76, inset -1px -2px #080a0d;
    background: linear-gradient(#30363e, #1a1e24);
    color: #c8cdd4;
    font-size: 1rem;
    font-weight: 700;
  }
  a[aria-current="page"] { background: linear-gradient(#29424f, #16242e); border-color: #83d5f5; color: #d5f3ff; box-shadow: inset 0 2px #10181f, inset 0 -2px #456474; }
  a:hover { background: #303c47; color: #d5f3ff; }
  @media (max-width: 1100px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  @media (max-width: 760px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

const Eyebrow = styled.p`
  font-family: 'Galmuri11', sans-serif;
  color: #9edff7;
  font-size: 0.85rem;
  font-weight: 700;
`;

const Title = styled.h1`
  margin-top: 14px;
  color: #edf0f3;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.5;
  word-break: keep-all;
  @media (max-width: 760px) { font-size: 1.5rem; }
`;

const Lead = styled.p`
  max-width: 74ch;
  margin-top: 18px;
  color: #c4c8cf;
  font-size: 1rem;
  line-height: 1.75;
  word-break: keep-all;
`;

const Section = styled.section`
  margin-top: 48px;
`;

const SectionTitle = styled.h2`
  padding: 14px 22px;
  border: 1px solid #3d434d;
  border-left: 3px solid ${FOREVER_ACCENT};
  background: ${RAISED_PANEL};
  color: #e5e7eb;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.5;
  box-shadow: 3px 3px 0 #090b0e;
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 24px;
  border: 1px solid ${LINE};
  border-top-color: #454a53;
  background: ${PANEL};
  ${pixelFrame}

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

  dt { color: #aab1bb; font-size: 0.78rem; font-weight: 650; }
  dd { color: #edf0f3; font-size: 1.12rem; font-weight: 750; line-height: 1.35; word-break: keep-all; }
  dd + dd { color: #b4bbc5; font-size: 0.84rem; font-weight: 500; }

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

  p { color: #e5e7eb; }
`;

const Aside = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;
  padding-left: 14px;
  border-left: 2px solid ${LINE};

  p { color: #b4bbc5; }

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
  &:hover { color: #edf0f3; }
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
  border-left: 3px solid #58616e;
  background: ${PANEL};
  ${pixelFrame}

  > div:not(:first-child) { display: grid; gap: 2px; min-width: 0; }

  @media (max-width: 400px) {
    grid-template-columns: 96px minmax(0, 1fr) auto;
    gap: 12px;
  }

  strong { color: #edf0f3; font-family: 'Galmuri11', sans-serif; font-size: 1rem; }
  span { color: #b4bbc5; font-size: 0.88rem; word-break: keep-all; }
  svg { color: ${FOREVER_ACCENT}; transition: transform 160ms ease; }

  &:hover { background: #252a32; border-color: ${FOREVER_ACCENT}; }
  &:hover svg { transform: translateX(3px); }
`;

const Notice = styled.p`
  margin-top: 28px;
  padding: 14px 16px;
  border-left: 3px solid #58616e;
  background: ${RAISED_PANEL};
  color: #e5e7eb;
  font-size: 0.9rem;
  line-height: 1.7;
  word-break: keep-all;
`;

// 시작하기: 여섯 단계를 한 줄로 먼저 보여 주는 띠. 누르면 그 단계로 내려간다.
const StepStrip = styled.ol`
  font-family: 'Galmuri11', sans-serif;
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
    color: #d1d5dc;
    font-size: 0.86rem;
    font-weight: 650;
    line-height: 1.35;
    word-break: keep-all;
  }

  a:hover { background: #252a32; color: #edf0f3; }

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
  font-family: 'Galmuri11', sans-serif;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${FOREVER_ACCENT};
  box-shadow: inset 0 0 0 3px #101216;
  background: #202b34;
  color: #bcecff;
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

  h3 { color: #edf0f3; font-size: 1.04rem; font-weight: 750; line-height: 1.4; }
  p { max-width: 74ch; color: #c4c8cf; font-size: 1rem; line-height: 1.75; word-break: keep-all; }
`;

const TableWrap = styled.div`
  max-width: 620px;
  overflow-x: auto;
  background: ${PANEL};
  ${pixelFrame}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;

  th, td { padding: 9px 18px; border-bottom: 1px solid ${LINE}; text-align: left; line-height: 1.45; word-break: keep-all; }
  tr:last-child th, tr:last-child td { border-bottom: 0; }
  thead { background: ${RAISED_PANEL}; }
  thead th { color: #e5e7eb; font-size: 0.82rem; font-weight: 800; padding-top: 14px; padding-bottom: 14px; }
  tbody tr:nth-child(even) { background: #ffffff04; }
  tbody tr:hover { background: #8dd9f50c; }
  tbody th { color: #b4bbc5; font-weight: 600; }
  td { color: #e5e7eb; }
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
    color: #d1d5dc;
    font-size: 0.84rem;
    line-height: 1.35;
    word-break: keep-all;
  }

  kbd {
    min-width: 30px;
    padding: 2px 8px;
    border: 1px solid rgba(168, 178, 188, 0.4);
    color: #edf0f3;
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

  dt { color: #edf0f3; font-size: 1rem; font-weight: 700; line-height: 1.6; word-break: keep-all; }
  dd { max-width: 74ch; color: #c4c8cf; font-size: 1rem; line-height: 1.7; word-break: keep-all; }

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

  h3 { color: #edf0f3; font-size: 0.96rem; font-weight: 700; line-height: 1.6; word-break: keep-all; }
  p { max-width: 74ch; color: #c4c8cf; font-size: 1rem; line-height: 1.7; word-break: keep-all; }

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
  color: #c4c8cf;
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
  ${pixelFrame}
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
  li > span { color: #d1d5dc; font-size: 1rem; line-height: 1.5; word-break: keep-all; }
  li > svg { color: #aab1bb; }
  strong { color: ${FOREVER_ACCENT}; font-size: 1rem; font-weight: 800; }
  em { margin-left: 8px; color: #aab1bb; font-size: 0.8rem; font-style: normal; white-space: nowrap; }

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
  ${pixelFrame}

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }

  h3 {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
    color: #edf0f3;
    font-size: 1.06rem;
    font-weight: 780;
    line-height: 1.4;
  }

  h3 small { color: #aab1bb; font-size: 0.78rem; font-weight: 650; }
  p { color: #c4c8cf; font-size: 1rem; line-height: 1.8; word-break: keep-all; }
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

  && { color: #e5e7eb; font-size: 0.86rem; font-weight: 650; }
  span { margin-right: 8px; color: #aab1bb; font-weight: 600; }
`;

const FootNote = styled.p`
  max-width: 78ch;
  margin-top: 12px;
  color: #b4bbc5;
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
    color: #e5e7eb;
    font-size: 1rem;
    line-height: 1.6;
    word-break: keep-all;
  }

  svg { margin-top: 3px; }
`;

const SourceBox = styled.footer`
  margin-top: 48px;
  padding: 22px;
  border: 1px solid ${LINE};
  border-top-color: #58616e;
  background: ${PANEL};
  ${pixelFrame}

  h2 { color: #aab1bb; font-size: 0.8rem; font-weight: 700; }

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
    color: #b4bbc5;
    font-size: 0.84rem;
    line-height: 1.5;
    word-break: keep-all;
  }

  a:hover { color: #edf0f3; }
  a svg { flex: 0 0 auto; align-self: center; }
  time { color: #aab1bb; font-size: 0.78rem; white-space: nowrap; }
  p { margin-top: 10px; color: #aab1bb; font-size: 0.8rem; line-height: 1.6; word-break: keep-all; }
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
      <h2>근거 · 공식 안내와 참고 가이드 ({FOREVER_CHECKED_AT} 확인)</h2>
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

function Head({ title, lead, art, compact = false }) {
  const { pathname } = useLocation();
  return (
    <>
      <Hero $compact={compact} className={compact ? 'fv-compact-hero' : undefined}>
        <Banner $focus={art.focus}>
          <Art art={art} sizes="(max-width: 1072px) calc(100vw - 32px), 1040px" eager />
        </Banner>
        <HeroCopy>
          <Eyebrow>{FOREVER_NAME}</Eyebrow>
          <Title>{title}</Title>
          <Lead>{lead}</Lead>
        </HeroCopy>
      </Hero>
      <PageNav aria-label="포에버 안내">
        {foreverPages.map(page => (
          <Link key={page.id} to={page.path} aria-current={isForeverPageActive(page, pathname) ? 'page' : undefined}>{page.label}</Link>
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
      <Link to="/forever/leveling#dungeons" className="fv-home-atlas"><img src="/images/forever/world-atlas-768.webp" srcSet="/images/forever/world-atlas-768.webp 768w, /images/forever/world-atlas-1536.webp 1536w" alt="새 지역과 던전 위치를 찾아볼 수 있는 포에버 도트 세계 지도" width="768" height="544" loading="lazy"/><span>도트 지도에서 지역·던전 찾기 →</span></Link>
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
  gap: 8px;
  margin-top: 24px;
  padding: 14px;
  border: 1px solid ${LINE};
  background: ${PANEL};
  ${pixelFrame}

  a { display: flex; align-items: center; min-height: 44px; padding: 6px 12px; border: 1px solid #3d434d; color: #d1d5dc; font-size: 0.88rem; line-height: 1.6; }
  a:hover { background: #202b34; border-color: #83d5f5; color: #bcecff; }
`;

const GuideLinks = styled(GuideContents)`
  border: 0;
  box-shadow: none;
  background: none;
  padding: 0;
  a { overflow-wrap: anywhere; }
  ${props => props.$cards && css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    a { display: block; padding: 20px 16px; background: ${PANEL}; box-shadow: inset 0 1px #59636e, 0 3px #080a0d; }
    strong { display: block; color: ${FOREVER_ACCENT}; font-size: 1.08rem; }
    span { display: block; margin-top: 12px; color: #c4c8cf; font-size: 0.95rem; line-height: 1.8; }
    @media (max-width: 760px) { grid-template-columns: minmax(0, 1fr); }
  `}
`;

const GuideBlock = styled(Section)`
  scroll-margin-top: 78px;
  padding: 24px;
  background: ${PANEL};
  ${pixelFrame}

  ${SectionTitle} {
    padding: 0 0 16px;
    border: 0;
    border-bottom: 1px solid #4e5a66;
    background: none;
    box-shadow: none;
    color: #d5f3ff;
    font-size: 1.35rem;
  }
  @media (max-width: 600px) { padding: 18px 12px; }

  > p { margin-top: 14px; color: #c4c8cf; line-height: 1.75; word-break: keep-all; }
  > a { display: inline-flex; align-items: center; min-height: 44px; margin-top: 12px; color: #b4bbc5; font-size: 0.8rem; }
  > a:hover { color: #bcecff; }
`;

const GuideIntro = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$illustrated ? '280px minmax(0, 1fr)' : 'minmax(0, 1fr)'};
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
  p { margin-top: 14px; color: #c4c8cf; line-height: 1.75; word-break: keep-all; }
  @media (max-width: 760px) { grid-template-columns: minmax(0, 1fr); }
`;

const GuideTableWrap = styled(TableWrap)`
  max-width: 100%;
  margin-top: 16px;

  th:first-child { width: 26%; }
  td:last-child { color: #c4c8cf; font-weight: 500; }
  &:focus-visible { outline: 2px solid ${FOREVER_ACCENT}; outline-offset: 3px; }
  @media (max-width: 680px) {
    thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    table, tbody, tr { display: block; }
    tbody tr { padding: 14px; border-bottom: 1px solid ${LINE}; }
    tbody th, tbody td { display: block; width: auto !important; padding: 4px 0; border: 0; }
    tbody th { color: #d5f3ff; font-size: 1.05rem; }
    td::before { content: attr(data-label); display: block; margin: 8px 0 4px; color: #aeb9c7; font-size: 0.78rem; }
  }
`;

const TalentSteps = styled.ol`
  list-style: none; padding: 0; margin: 24px 0;
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;
  li { padding: 18px; background: #191c22; border-top: 2px solid #8dd9f5; }
  p { margin-top: 10px; line-height: 1.75; }
  @media(max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`;

// 직업 가이드·레벨링 가이드 탭의 목록. 리테일 직업 가이드처럼 묶음 제목 아래 칸을 눌러 상세로 간다.
const IndexPanel = styled.section`
  scroll-margin-top: 78px;
  margin-top: 24px;
  padding: 24px;
  background: ${PANEL};
  ${pixelFrame}
  @media (max-width: 600px) { padding: 18px 12px; }
`;

const IndexHead = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #4e5a66;
  h2 { color: #d5f3ff; font-size: 1.35rem; line-height: 1.4; }
  p { max-width: 74ch; margin-top: 10px; color: #c4c8cf; line-height: 1.75; word-break: keep-all; }
`;

const IndexGroup = styled.section`
  padding: 22px 0 6px;
  & + & { border-top: 1px solid ${LINE}; }
`;

const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  img { flex: none; width: 52px; height: 52px; border: 1px solid #080a0d; box-shadow: 0 0 0 1px #4e5a66; image-rendering: pixelated; }
  h3 { display: flex; align-items: center; gap: 10px; color: #edf0f3; font-size: 1.2rem; line-height: 1.3; }
  h3::before { content: ''; width: 4px; height: 1.1em; background: ${props => props.$color}; }
  a { display: inline-flex; align-items: center; gap: 4px; min-height: 44px; margin-left: auto; padding: 0 4px; color: #b4bbc5; font-size: 0.88rem; }
  a:hover { color: #bcecff; }
`;

const IndexGrid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 1000px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`;

const IndexCard = styled(Link)`
  display: grid;
  align-content: start;
  gap: 8px;
  height: 100%;
  padding: 14px 14px 16px;
  border: 1px solid #3d434d;
  border-left: 3px solid ${props => props.$color};
  background: #181b21;
  box-shadow: 0 3px 0 #080a0d;
  color: inherit;
  transition: background-color 140ms ease, border-color 140ms ease;

  > div { display: flex; align-items: center; gap: 10px; min-width: 0; }
  img { flex: none; width: 36px; height: 36px; border: 1px solid #080a0d; }
  strong { flex: 1; min-width: 0; color: #edf0f3; font-family: 'Galmuri11', 'Noto Sans KR', sans-serif; font-size: 1.05rem; line-height: 1.4; word-break: keep-all; }
  svg { flex: none; color: #8b95a1; transition: transform 140ms ease, color 140ms ease; }
  em { color: ${FOREVER_ACCENT}; font-size: 0.82rem; font-style: normal; font-weight: 700; }
  p { color: #b4bbc5; font-size: 0.9rem; line-height: 1.65; word-break: keep-all; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

  &:hover { background: #202b34; border-color: ${FOREVER_ACCENT}; border-left-color: ${props => props.$color}; }
  &:hover svg { color: ${FOREVER_ACCENT}; transform: translate(2px, -2px); }
  @media (prefers-reduced-motion: reduce) { transition: none; &:hover svg { transform: none; } }
`;

function GuideIndex({ index }) {
  const columns = index.kind === 'races' ? 5 : 3;
  return (
    <IndexPanel id={index.id} aria-labelledby={`${index.id}-title`}>
      <IndexHead>
        <h2 id={`${index.id}-title`}>{index.title}</h2>
        <p>{index.lead}</p>
      </IndexHead>
      {index.groups.map(group => (
        <IndexGroup key={group.id} aria-labelledby={`${index.id}-${group.id}`}>
          <GroupTitle $color={group.color}>
            {group.art && <img src={`/images/forever/${group.art.id}-512.webp`} alt="" width="52" height="52" loading="lazy" />}
            <h3 id={`${index.id}-${group.id}`}>{group.label}</h3>
            {group.path && <Link to={group.path}>{group.label} 전문화 비교<ArrowRight size={14} aria-hidden="true" /></Link>}
          </GroupTitle>
          <IndexGrid $columns={columns}>
            {group.items.map(item => (
              <li key={item.path}>
                <IndexCard to={item.path} $color={group.color}>
                  <div>
                    {item.icon && <img src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`} alt="" width="36" height="36" loading="lazy" />}
                    <strong>{item.label}</strong>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </div>
                  {item.start && <em>출발 · {item.start}</em>}
                  <p>{item.description}</p>
                </IndexCard>
              </li>
            ))}
          </IndexGrid>
        </IndexGroup>
      ))}
      <details className="fv-block-sources"><summary>참고한 자료</summary><GuideLinks aria-label={`${index.title} 근거 원문`}>{index.sources.map(source => <a key={source} href={foreverSources[source].url} target="_blank" rel="noopener noreferrer">{foreverSources[source].label} ↗</a>)}</GuideLinks></details>
    </IndexPanel>
  );
}

function GuideSection({ data, section }) {
  const spells = classSpells(section.startsWith('classes/') ? section.split('/')[1] : '');
  return <>
    <Head title={data.title} lead={data.lead} art={data.art} compact />
    {data.back && <GuideLinks className="fv-back" aria-label="가이드 목록으로"><Link to={data.back.path}>← {data.back.label}</Link></GuideLinks>}
    {data.index && <GuideIndex index={data.index} />}
    <div className={data.sections.length > 1 ? 'fv-guide-layout' : 'fv-guide-layout fv-guide-single'}>
      {data.sections.length > 1 && <details className="fv-guide-toc" open><summary>이 페이지 목차</summary><nav aria-label="이 페이지 목차">{data.sections.map(block=><a key={block.id} href={`#${block.id}`}>{block.title}</a>)}</nav></details>}
      <div className="fv-guide-body">
      {data.sections.map(block=><GuideBlock key={block.id} id={block.id} aria-labelledby={`${block.id}-title`}>
        <GuideIntro $illustrated={Boolean(block.art)}>
          {block.art && <Frame $ratio={block.art.kind==='square'?'1 / 1':'3 / 2'} $focus={block.art.focus}><Art art={block.art} sizes="(max-width: 760px) calc(100vw - 32px), 280px" /></Frame>}
          <div><SectionTitle id={`${block.id}-title`}>{block.title}</SectionTitle>{block.lead && <p><ForeverText spells={spells}>{block.lead}</ForeverText></p>}</div>
        </GuideIntro>
        {block.combat && <SkillGroups combat={block.combat}/>}
        {block.map && <ForeverMap config={block.map}/>}
        {block.journey && <LevelingJourney race={block.journey} early={data.sections.find(item => item.id === 'route').table.rows} later={data.sections.find(item => item.id === 'after-30').table.rows}/>}
        {block.flows?.map(flow=><Flow key={flow.title} {...flow} spells={spells}/>)}
        {block.facilities && <Facilities table={block.table} arts={block.facilities}/>}
        {block.growth && <TalentGrowth table={block.table}/>}
        {block.spells && <details className="fv-effect-list"><summary>한국어 효과 원문 {block.spells.length}개 펼쳐 읽기</summary><TermList>{block.spells.map(spell=><div key={spell.id}><dt><ForeverSpell spell={spell}/></dt><dd>{spell.verified ? spell.description : `한국어 설명 확인 전 · ${spell.reason}`}{spell.note && <p>원문 표시 주의 · {spell.note}</p>}</dd></div>)}</TermList></details>}
        {block.items && !block.diagramItems && (block.decisions ? block.items.map(item=><div className="fv-decision" key={item.title}><strong>{item.title}</strong><p><ForeverText spells={spells}>{item.body}</ForeverText></p></div>) : <TermList>{block.items.map(item=><div key={item.title}><dt><ForeverText spells={spells}>{item.title}</ForeverText></dt><dd><ForeverText spells={spells}>{item.body}</ForeverText></dd></div>)}</TermList>)}
        {block.milestones && <TalentSteps aria-label={`${block.title} 추천 순서`}>{block.milestones.map(({spell,reason},i)=><li key={spell.id}><span className="fv-muted">핵심 이정표 {i+1}</span><br/><ForeverSpell spell={spell} size={40}/><p><ForeverText spells={spells}>{reason}</ForeverText></p></li>)}</TalentSteps>}
        {block.table && <>
          <GuideTableWrap role="region" aria-label={`${block.title} 표`}><Table aria-labelledby={`${block.id}-title`}>
            <thead><tr>{block.table.columns.map(column=><th key={column} scope="col">{column}</th>)}</tr></thead>
            <tbody>{block.table.rows.map(([label,...cells])=><tr key={[label,...cells].join('|')}><th scope="row"><ForeverText spells={spells}>{label}</ForeverText></th>{cells.map((cell,i)=><td key={i} data-label={block.table.columns[i+1]}><ForeverText spells={spells}>{cell}</ForeverText></td>)}</tr>)}</tbody>
          </Table></GuideTableWrap>
        </>}
        {block.links && <GuideLinks $cards={block.links.some(link=>link.description || link.art)} aria-label={`${block.title} 관련 안내`}>{block.links.map(link=>link.path.startsWith('/') ? <Link key={link.path} to={link.path} className={link.art?'fv-class-card':undefined}>{link.art && <img src={`/images/forever/${link.art.id}-512.webp`} alt="" loading="lazy"/>}{link.icon && <img className="fv-spec-emblem" src={`https://wow.zamimg.com/images/wow/icons/medium/${link.icon}.jpg`} alt="" loading="lazy"/>}{link.description || link.art ? <><strong>{link.label}</strong>{link.description && <span>{link.description}</span>}</> : link.label}</Link> : <a key={link.path} href={link.path} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</GuideLinks>}
        <details className="fv-block-sources"><summary>참고한 자료</summary><GuideLinks aria-label={`${block.title} 근거 원문`}>{block.sources.map(source=><a key={source} href={foreverSources[source].url} target="_blank" rel="noopener noreferrer">{foreverSources[source].label} ↗</a>)}</GuideLinks></details>
      </GuideBlock>)}
      <Sources ids={collectSources(data.index ? [data.index] : [], data.sections)}/>
      </div>
    </div>
  </>;
}

export default function ForeverPage({ section = 'home' }) {
  const Content = SECTIONS[section] || HomeSection;
  const guide = foreverGuides[section] || foreverDetailGuides[section];
  return (
    <Surface className="fv-theme">
      <Page data-forever-section={section}>
      {guide ? <GuideSection key={section} data={guide} section={section} /> : <Content />}
      </Page>
    </Surface>
  );
}
