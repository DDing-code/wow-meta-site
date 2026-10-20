import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, BookOpen, Castle, Check, Compass, FlaskConical, Hammer, ListChecks, Search, Shield, Swords, X } from 'lucide-react';
import { beginnerCraftingScreens, beginnerEmbellishments, beginnerMaps, beginnerSections, beginnerSources } from '../data/beginnerGuide.js';
import consumables from '../data/beginnerConsumables.json';
import { CraftingScreen } from '../components/beginner/CraftingScreens.js';
import { SectionMap, parseStep } from '../components/beginner/BeginnerMaps.js';

// 기존 가이드 페이지의 평면 언어(어두운 배경, 금색 강조, 1px 구분선, 각진 모서리)를 그대로 쓴다.
const GOLD = '#d2b373';
const LINE = 'rgba(168, 178, 188, 0.14)';
const LINE_STRONG = 'rgba(168, 178, 188, 0.2)';
const PANEL = 'rgba(13, 18, 22, 0.62)';

const sectionIcons = { basics: Compass, combat: Swords, content: Castle, equipment: Shield, consumables: FlaskConical, crafting: Hammer, ready: ListChecks };
const startLinks = [
  { id: 'basics', icon: Compass, title: '와우가 처음이라면', text: '직업과 역할부터 알아보기' },
  { id: 'consumables', icon: FlaskConical, title: '무엇을 챙겨야 할까?', text: '영약·물약·음식·보석·마법부여 찾아보기' },
  { id: 'ready', icon: ListChecks, title: '첫 파티를 앞두고 있다면', text: '출발 전 다섯 가지 확인' },
];

const Page = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 104px;
  word-break: keep-all;
  overflow-wrap: anywhere;
  @media (max-width: 560px) { width: calc(100% - 24px); padding-top: 20px; }
`;
const Hero = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 400px);
  gap: 32px clamp(32px, 6vw, 72px);
  align-items: end;
  padding: clamp(28px, 4vw, 44px) 0 32px;
  border-top: 3px solid ${GOLD};
  border-bottom: 1px solid rgba(168, 178, 188, 0.16);
  @media (max-width: 900px) { grid-template-columns: minmax(0, 1fr); gap: 28px; align-items: start; }
`;
const Eyebrow = styled.p`
  color: ${GOLD};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
`;
const Title = styled.h1`
  margin-top: 10px;
  color: #eef1f3;
  font-size: clamp(2rem, 4vw, 3.1rem);
  line-height: 1.14;
`;
const Lead = styled.p`
  max-width: 600px;
  margin-top: 16px;
  color: #aeb8be;
  font-size: 1rem;
  line-height: 1.78;
  text-wrap: pretty;
`;
const SearchPanel = styled.div`
  padding: 18px 18px 14px;
  border: 1px solid ${LINE_STRONG};
  background: ${PANEL};
  box-shadow: inset 0 2px 0 ${GOLD};
  label { display: block; margin-bottom: 10px; color: #eef1f3; font-size: 0.86rem; font-weight: 700; }
  @media (max-width: 560px) { padding: 14px 14px 12px; }
`;
const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 6px 0 12px;
  border: 1px solid #59636b;
  background: #0f1419;
  transition: border-color 160ms ease;
  &:focus-within { border-color: ${GOLD}; }
  > svg { flex: 0 0 auto; color: #aeb8be; }
  input { min-width: 0; width: 100%; padding: 12px 0; border: 0; background: transparent; color: #eef1f3; font-size: 1rem; outline: none; }
  input::placeholder { color: #8f9aa2; }
  input::-webkit-search-cancel-button { display: none; }
`;
const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border: 0;
  background: transparent;
  color: #aeb8be;
  &:hover { color: #eef1f3; background: rgba(168, 178, 188, 0.08); }
`;
const Status = styled.p`
  min-height: 22px;
  margin-top: 10px;
  color: #98a6af;
  font-size: 0.8rem;
  strong { color: #eef1f3; font-weight: 700; }
`;
const Start = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 28px;
  border-top: 1px solid ${LINE};
  border-left: 1px solid ${LINE};
  @media (max-width: 720px) { grid-template-columns: minmax(0, 1fr); }
`;
const StartLink = styled.a`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 4px 14px;
  align-items: center;
  min-height: 84px;
  padding: 16px 18px;
  border-right: 1px solid ${LINE};
  border-bottom: 1px solid ${LINE};
  svg { grid-row: span 2; justify-self: center; color: ${GOLD}; }
  strong { color: #eef1f3; font-size: 0.96rem; }
  span { color: #98a6af; font-size: 0.82rem; }
  &:hover { background: rgba(168, 178, 188, 0.035); box-shadow: inset 0 2px 0 ${GOLD}; }
  &:hover span { color: #c6d0d6; }
  @media (max-width: 720px) { min-height: 68px; padding: 12px 16px; }
`;
const Body = styled.div`
  display: grid;
  grid-template-columns: 208px minmax(0, 1fr);
  gap: 48px;
  margin-top: 40px;
  @media (max-width: 900px) { grid-template-columns: minmax(0, 1fr); gap: 28px; margin-top: 28px; }
`;
const Contents = styled.nav`
  position: sticky;
  top: 86px;
  align-self: start;
  p { margin-bottom: 8px; color: #8f9aa2; font-size: 0.72rem; font-weight: 680; letter-spacing: 0.04em; }
  @media (max-width: 900px) { position: static; }
`;
const ContentsList = styled.div`
  display: grid;
  border-top: 1px solid ${LINE_STRONG};
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
    padding-top: 10px;
  }
`;
const ContentsLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 44px;
  padding: 10px 10px 10px 12px;
  margin-left: -12px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.1);
  border-left: 2px solid ${props => (props.$active ? GOLD : 'transparent')};
  color: ${props => (props.$active ? '#eef1f3' : '#aeb8be')};
  font-size: 0.86rem;
  font-weight: ${props => (props.$active ? 700 : 500)};
  b { color: ${props => (props.$active ? GOLD : '#7f8b94')}; font-size: 0.76rem; font-weight: 700; font-variant-numeric: tabular-nums; }
  &:hover { color: #eef1f3; }
  &:hover b { color: ${GOLD}; }
  @media (max-width: 900px) {
    margin-left: 0;
    padding: 8px 12px;
    border: 1px solid ${LINE_STRONG};
    border-left-width: 2px;
    background: ${PANEL};
  }
`;
const Results = styled.div`
  min-width: 0;
`;
const ResultBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 12px 16px;
  margin-bottom: 28px;
  border: 1px solid ${LINE_STRONG};
  border-left: 3px solid ${GOLD};
  background: ${PANEL};
  color: #c6d0d6;
  font-size: 0.88rem;
  strong { color: #eef1f3; }
`;
const TextButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 4px 10px;
  border: 1px solid #59636b;
  color: #eef1f3;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 650;
  &:hover { border-color: ${GOLD}; color: ${GOLD}; }
`;
const Section = styled.section`
  min-width: 0;
  padding-bottom: 44px;
  & + & { padding-top: 40px; border-top: 1px solid rgba(168, 178, 188, 0.13); }
`;
const SectionHead = styled.div`
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  gap: 6px 14px;
  align-items: center;
  h2 { color: #eef1f3; font-size: clamp(1.34rem, 2.4vw, 1.72rem); line-height: 1.3; letter-spacing: 0; }
  @media (max-width: 560px) { grid-template-columns: 38px minmax(0, 1fr); }
`;
const SectionIcon = styled.div`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #d9bd7b;
  border: 1px solid rgba(168, 178, 188, 0.18);
  background: ${PANEL};
`;
const SectionCount = styled.span`
  color: #7f8b94;
  font-size: 0.78rem;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  @media (max-width: 560px) { grid-column: 2; }
`;
const Intro = styled.p`
  max-width: 68ch;
  margin: 14px 0 0;
  color: #aeb8be;
  font-size: 0.94rem;
  line-height: 1.75;
`;
const Note = styled.p`
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid rgba(210, 179, 115, 0.22);
  border-left: 3px solid ${GOLD};
  background: rgba(210, 179, 115, 0.05);
  color: #d4cdbd;
  font-size: 0.86rem;
  line-height: 1.75;
`;
const Entries = styled.dl`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
  @media (max-width: 760px) { grid-template-columns: minmax(0, 1fr); gap: 10px; }
`;
const Entry = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
  padding: 18px 18px 20px;
  border: 1px solid ${LINE_STRONG};
  background: ${PANEL};
  transition: border-color 160ms ease, box-shadow 160ms ease;
  &:hover { border-color: rgba(210, 179, 115, 0.4); box-shadow: inset 0 2px 0 ${GOLD}; }
  dt { color: #eef1f3; font-size: 1rem; font-weight: 720; line-height: 1.45; }
  dd { color: #c3cbd0; font-size: 0.9rem; line-height: 1.8; }
  mark { background: transparent; color: ${GOLD}; box-shadow: inset 0 -1px 0 rgba(210, 179, 115, 0.6); }
  &[data-done='true'] { border-color: rgba(210, 179, 115, 0.5); box-shadow: inset 0 2px 0 ${GOLD}; }
  &[data-done='true'] dt { color: ${GOLD}; }
  @media (max-width: 560px) { padding: 15px 14px 17px; }
`;
const When = styled.span`
  display: block;
  width: fit-content;
  margin-bottom: 8px;
  padding: 2px 8px;
  border: 1px solid rgba(210, 179, 115, 0.35);
  color: ${GOLD};
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.5;
`;
const Step = styled.b`
  display: inline-block;
  min-width: 2.2em;
  margin-right: 8px;
  color: ${GOLD};
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
  vertical-align: -0.08em;
  font-variant-numeric: tabular-nums;
`;
const Tip = styled.p`
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px dashed rgba(168, 178, 188, 0.22);
  color: #a4b0b8;
  font-size: 0.84rem;
  line-height: 1.7;
  b { margin-right: 8px; color: ${GOLD}; font-size: 0.74rem; font-weight: 750; }
`;
const PhaseHead = styled.h3`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 28px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${LINE_STRONG};
  color: #eef1f3;
  font-size: 1.02rem;
  font-weight: 720;
  b { color: ${GOLD}; font-size: 0.74rem; font-weight: 750; letter-spacing: 0.04em; }
  small { color: #7f8b94; font-size: 0.76rem; font-weight: 600; font-variant-numeric: tabular-nums; }
  & + dl { margin-top: 14px; }
`;
const CheckRow = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
`;
const CheckButton = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${props => (props.$done ? GOLD : '#59636b')};
  background: ${props => (props.$done ? GOLD : 'transparent')};
  color: #0a0d10;
  transition: background 160ms ease, border-color 160ms ease;
  &:hover { border-color: ${GOLD}; }
  &:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 2px; }
`;
const ScreenGuide = styled.div`
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid ${LINE_STRONG};
  > h3 { color: #eef1f3; font-size: 1.3rem; }
  > p { max-width: 68ch; margin-top: 10px; color: #aeb8be; font-size: 0.9rem; line-height: 1.75; }
`;
const ScreenFigure = styled.figure`
  margin: 30px 0 0;
  padding: 22px 0 0;
  border-top: 1px dashed rgba(168, 178, 188, 0.22);
  figcaption h4 { color: #eef1f3; font-size: 1.06rem; line-height: 1.45; }
  figcaption h4 b { margin-right: 10px; color: ${GOLD}; font-size: 0.8rem; font-weight: 750; letter-spacing: 0.04em; }
  figcaption > p { max-width: 68ch; margin-top: 8px; color: #aeb8be; font-size: 0.88rem; line-height: 1.7; }
  @media (max-width: 560px) { margin-top: 24px; padding-top: 18px; }
`;
const StepLinks = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  color: #98a6af;
  font-size: 0.76rem;
  b { padding: 1px 7px; border: 1px solid rgba(210, 179, 115, 0.35); color: ${GOLD}; font-weight: 700; font-variant-numeric: tabular-nums; }
`;
const Legend = styled.ol`
  display: grid;
  gap: 10px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 10px; align-items: start; color: #c3cbd0; font-size: 0.88rem; line-height: 1.7; }
  li > b { display: grid; place-items: center; width: 22px; height: 22px; margin-top: 2px; border-radius: 50%; background: #ff7a59; color: #140c08; font-size: 0.74rem; font-weight: 800; }
  li strong { margin-right: 6px; color: #eef1f3; font-weight: 720; }
  mark { background: transparent; color: ${GOLD}; box-shadow: inset 0 -1px 0 rgba(210, 179, 115, 0.6); }
  @media (min-width: 761px) { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 24px; }
`;
const ItemCatalog = styled.div`
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid ${LINE_STRONG};
  > h3 { color: #eef1f3; font-size: 1.3rem; }
  > p { margin-top: 10px; color: #aeb8be; font-size: 0.9rem; line-height: 1.75; }
`;
const ItemGroup = styled.div`
  margin-top: 28px;
  h4 { color: ${GOLD}; font-size: 1rem; line-height: 1.5; }
  > p { margin: 7px 0 12px; color: #aeb8be; font-size: 0.85rem; line-height: 1.7; }
  ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  li { min-width: 0; display: flex; flex-direction: column; }
  li > a:first-child { flex: 1; height: auto; }
  @media (max-width: 760px) { ul { grid-template-columns: minmax(0, 1fr); } }
`;
const ItemLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  padding: 12px;
  border: 1px solid ${LINE_STRONG};
  background: ${PANEL};
  img { width: 36px; height: 36px; flex: 0 0 36px; border: 1px solid #59636b; }
  > span { min-width: 0; }
  strong { display: block; color: #eef1f3; font-size: 0.9rem; line-height: 1.5; }
  small { display: block; margin-top: 3px; color: #aeb8be; font-size: 0.76rem; line-height: 1.6; }
  em { color: ${GOLD}; font-style: normal; }
  mark { background: transparent; color: ${GOLD}; }
  &:hover, &:focus-visible { border-color: ${GOLD}; }
  &:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 2px; }
`;
const EffectSource = styled.a`
  display: inline-block;
  padding: 6px 0;
  color: #aeb8be;
  font-size: 0.76rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  &:hover, &:focus-visible { color: ${GOLD}; }
`;
const Empty = styled.div`
  padding: 36px 24px 40px;
  border: 1px dashed rgba(168, 178, 188, 0.28);
  text-align: center;
  h2 { color: #eef1f3; font-size: 1.3rem; }
  p { margin: 10px auto 20px; max-width: 42ch; color: #aeb8be; font-size: 0.92rem; }
`;
const Reset = styled.button`
  min-height: 44px;
  padding: 8px 18px;
  border: 1px solid #59636b;
  color: #eef1f3;
  background: transparent;
  font-size: 0.9rem;
  font-weight: 650;
  &:hover { border-color: ${GOLD}; color: ${GOLD}; }
`;
const Footer = styled.footer`
  margin-top: 8px;
`;
const NextPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px 32px;
  padding: 26px 28px;
  border: 1px solid ${LINE_STRONG};
  border-top: 3px solid ${GOLD};
  background: ${PANEL};
  h2 { color: #eef1f3; font-size: 1.3rem; letter-spacing: 0; }
  p { max-width: 54ch; margin-top: 8px; color: #aeb8be; font-size: 0.9rem; line-height: 1.75; }
  @media (max-width: 560px) { padding: 20px 16px; }
`;
const NextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 10px 20px;
  border: 1px solid ${GOLD};
  color: ${GOLD};
  font-size: 0.94rem;
  font-weight: 700;
  white-space: nowrap;
  &:hover { background: ${GOLD}; color: #0a0d10; }
  &:hover svg { transform: translateX(3px); }
  svg { transition: transform 160ms ease; }
`;
const Sources = styled.details`
  margin-top: 28px;
  color: #aeb8be;
  font-size: 0.84rem;
  line-height: 1.75;
  summary { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; cursor: pointer; color: #c6d0d6; font-weight: 650; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  summary::before { content: '+'; width: 18px; height: 18px; border: 1px solid #59636b; color: ${GOLD}; font-size: 0.8rem; line-height: 16px; text-align: center; }
  &[open] summary::before { content: '−'; }
  > p { max-width: 74ch; margin-top: 6px; }
  ul { margin-top: 12px; padding-left: 20px; }
  li { margin-top: 8px; }
  li a { text-decoration: underline; text-underline-offset: 3px; color: #c6d0d6; }
  li a:hover { color: ${GOLD}; }
`;

function Highlight({ text, query }) {
  if (!query || !text) return text;
  const lower = text.toLocaleLowerCase();
  const parts = [];
  let from = 0;
  for (let at = lower.indexOf(query, from); at !== -1; at = lower.indexOf(query, from)) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(<mark key={at}>{text.slice(at, at + query.length)}</mark>);
    from = at + query.length;
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

function Term({ term, query }) {
  const step = /^(\d{2}) · (.+)$/.exec(term);
  if (step) return <><Step aria-hidden="true">{step[1]}</Step>{' '}<Highlight text={step[2]} query={query} /></>;
  return <Highlight text={term} query={query} />;
}

function useActiveSection(key) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const ids = key.split(' ').filter(Boolean);
    setActive(ids[0] || '');
    if (typeof window === 'undefined' || !ids.length) return undefined;
    // 화면 위쪽 기준선(상단 메뉴 아래 약 140px)을 지난 마지막 영역을 현재 위치로 본다. 영역이 6개뿐이라 한 프레임에 한 번만 잰다.
    let frame = 0;
    const pick = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(pick); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    pick();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [key]);
  return active;
}

function BeginnerPage() {
  const [search, setSearch] = useState('');
  const query = search.trim().toLocaleLowerCase();
  const itemGroups = consumables.groups.map(group => ({
    ...group,
    items: group.items.filter(item => !query ||
      [group.title, group.keywords, item.name, item.effect, item.hearty ? '든든한 사망 후 유지' : ''].join(' ').toLocaleLowerCase().includes(query)),
  })).filter(group => group.items.length);
  const itemCount = itemGroups.reduce((total, group) => total + group.items.length, 0);
  const embellishmentGroups = beginnerEmbellishments.groups.map(group => ({
    ...group,
    items: group.items.filter(item => !query ||
      ['장식', group.title, item.name, item.effect, item.requirement].join(' ').toLocaleLowerCase().includes(query)),
  })).filter(group => group.items.length);
  const embellishmentCount = embellishmentGroups.reduce((total, group) => total + group.items.length, 0);
  const totalItemCount = itemCount + embellishmentCount;
  const screens = beginnerCraftingScreens.filter(screen => !query ||
    ['주문 제작 화면', screen.title, screen.summary, ...screen.legend.flatMap(item => [item.label, item.text])].join(' ').toLocaleLowerCase().includes(query));
  const sections = beginnerSections.map(section => ({
    ...section,
    entries: section.entries.filter(entry => !query ||
      [section.title, entry.term, entry.aliases, entry.when, entry.description, entry.tip].filter(Boolean).join(' ').toLocaleLowerCase().includes(query)),
  })).filter(section => section.entries.length || (section.id === 'consumables' && itemCount) || (section.id === 'crafting' && (embellishmentCount || screens.length)));
  const count = sections.reduce((total, section) => total + section.entries.length, 0);
  const active = useActiveSection(sections.map(section => section.id).join(' '));
  const clear = () => setSearch('');
  // 그림의 낱말을 누르면 아래 설명으로 내려간다. 설명 id는 영역 id와 원래 순서로 정한다(검색으로 걸러도 같은 id).
  const entryIds = new Map(beginnerSections.flatMap(section => section.entries.map((entry, index) => [entry.term, `${section.id}-e${index + 1}`])));
  const hrefFor = term => (entryIds.has(term) ? `#${entryIds.get(term)}` : undefined);
  const [done, setDone] = useState(() => new Set());
  const toggleDone = term => setDone(current => {
    const next = new Set(current);
    if (next.has(term)) next.delete(term); else next.add(term);
    return next;
  });
  const readyTotal = beginnerSections.find(section => section.id === 'ready').entries.length;
  const renderEntry = (section, entry) => (
    <Entry key={entry.term} id={entryIds.get(entry.term)} data-done={section.id === 'ready' && done.has(entry.term) ? 'true' : undefined}>
      {section.id === 'ready' ? (
        <CheckRow>
          <CheckButton type="button" $done={done.has(entry.term)} aria-pressed={done.has(entry.term)} aria-label={`${entry.term} 확인`} onClick={() => toggleDone(entry.term)}>{done.has(entry.term) ? <Check size={22} strokeWidth={2.5} aria-hidden="true" /> : null}</CheckButton>
          <div>
            <dt><Term term={entry.term} query={query} /></dt>
            <dd>
              <p><Highlight text={entry.description} query={query} /></p>
              <Tip><b>팁</b>{' '}<Highlight text={entry.tip} query={query} /></Tip>
            </dd>
          </div>
        </CheckRow>
      ) : (
        <>
          <dt>{entry.when ? <When>{entry.when}</When> : null}<Term term={entry.term} query={query} /></dt>
          <dd>
            <p><Highlight text={entry.description} query={query} /></p>
            <Tip><b>팁</b>{' '}<Highlight text={entry.tip} query={query} /></Tip>
          </dd>
        </>
      )}
    </Entry>
  );
  const renderEntries = section => {
    if (section.id === 'crafting') {
      // 열 단계를 지도와 같은 네 묶음으로 나눠 보여 준다. 묶음에 남은 단계가 없으면(검색) 그 묶음은 건너뛴다.
      const phases = beginnerMaps.crafting.phases.map(phase => ({ ...phase, entries: section.entries.filter(entry => phase.steps.includes(parseStep(entry.term)?.number)) })).filter(phase => phase.entries.length);
      const rest = section.entries.filter(entry => !parseStep(entry.term));
      return (
        <>
          {phases.map((phase, index) => (
            <React.Fragment key={phase.title}>
              <PhaseHead><b>{index + 1}단계</b>{phase.title}<small>{phase.steps[0]}–{phase.steps[phase.steps.length - 1]}</small></PhaseHead>
              <Entries $columns={2}>{phase.entries.map(entry => renderEntry(section, entry))}</Entries>
            </React.Fragment>
          ))}
          {rest.length ? <Entries $columns={2}>{rest.map(entry => renderEntry(section, entry))}</Entries> : null}
        </>
      );
    }
    return <Entries $columns={section.id === 'ready' ? 1 : 2}>{section.entries.map(entry => renderEntry(section, entry))}</Entries>;
  };

  return (
    <Page>
      <Hero>
        <div>
          <Eyebrow>와우의 첫걸음 · 본 서버 공통 개념</Eyebrow>
          <Title>초보자 안내</Title>
          <Lead>처음 보는 말이 많아도 괜찮습니다. 역할과 전투 용어부터 소모품·보석·마법부여, 주문제작과 장식까지, 영역마다 그림으로 먼저 보고 필요한 설명만 찾아 읽을 수 있게 모았습니다.</Lead>
        </div>
        <SearchPanel>
          <label htmlFor="beginner-search">모르는 말 찾아보기</label>
          <SearchField>
            <Search size={18} aria-hidden="true" />
            <input id="beginner-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="예: 영약, 보석, 마부, 주문제작" aria-controls="beginner-results" autoComplete="off" />
            {search ? <ClearButton type="button" onClick={clear} aria-label="검색 지우기"><X size={18} aria-hidden="true" /></ClearButton> : null}
          </SearchField>
          <Status role="status">{query ? <>검색 결과 <strong>{count}개 설명</strong>{totalItemCount ? <> · 아이템 <strong>{totalItemCount}종</strong></> : null}</> : <><strong>{count}개 설명</strong> · 아이템 <strong>{totalItemCount}종</strong></>}</Status>
        </SearchPanel>
      </Hero>
      <Start aria-label="상황별 바로가기">
        {startLinks.map(item => {
          const Icon = item.icon;
          return (
            <StartLink key={item.id} href={`#${item.id}`} onClick={clear}>
              <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </StartLink>
          );
        })}
      </Start>
      <Body>
        <Contents aria-label="초보자 안내 목차">
          <p>이 페이지에서</p>
          <ContentsList>
            {sections.map(section => (
              <ContentsLink key={section.id} href={`#${section.id}`} $active={section.id === active} aria-current={section.id === active ? 'location' : undefined}>
                {section.title}<b>{section.entries.length || (section.id === 'consumables' ? itemCount : section.id === 'crafting' ? embellishmentCount : 0)}</b>
              </ContentsLink>
            ))}
          </ContentsList>
        </Contents>
        <Results id="beginner-results">
          {query && sections.length ? (
            <ResultBar>
              <span>“<strong>{search.trim()}</strong>” 검색 결과 · 설명 {count}개{totalItemCount ? ` · 아이템 ${totalItemCount}종` : ''}</span>
              <TextButton type="button" onClick={clear}><X size={14} aria-hidden="true" />검색 지우기</TextButton>
            </ResultBar>
          ) : null}
          {sections.length ? sections.map(section => {
            const Icon = sectionIcons[section.id] || BookOpen;
            return (
              <Section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                <SectionHead>
                  <SectionIcon><Icon size={19} strokeWidth={1.75} aria-hidden="true" /></SectionIcon>
                  <h2 id={`${section.id}-title`}>{section.title}</h2>
                  <SectionCount>{section.entries.length}개 설명{section.id === 'consumables' && itemCount ? ` · 아이템 ${itemCount}종` : section.id === 'crafting' && embellishmentCount ? ` · 아이템 ${embellishmentCount}종` : ''}</SectionCount>
                </SectionHead>
                <Intro>{section.intro}</Intro>
                {!query ? <SectionMap id={section.id} map={beginnerMaps[section.id]} hrefFor={hrefFor} groups={consumables.groups} entries={section.entries} done={done.size} total={readyTotal} /> : null}
                {section.note ? <Note>{section.note}</Note> : null}
                {renderEntries(section)}
                {section.id === 'consumables' && itemCount ? (
                  <ItemCatalog aria-label="현재 버전 소모품·보석·마법부여 목록">
                    <h3>한밤 {consumables.metadata.patch} 소모품·보석·마법부여 목록</h3>
                    <p>이름과 아이콘을 누르면 한국어 아이템 설명이 열립니다. 같은 이름의 품질별 효과와 사용 조건도 확인하세요. 아래는 전투 준비에 쓰는 주요 소모품, 장비 홈에 끼우는 보석, 장비 부위에 바르는 마법부여이며, 모두 구매할 필요는 없습니다.</p>
                    <p>1차 스탯은 힘·민첩·지능, 2차 스탯은 치명타·가속·특화·유연성을 말합니다. ‘든든한’ 음식은 사망 후에도 효과가 남습니다. 마법부여는 같은 이름도 품질이 두 단계라, 목록에는 높은 단계의 아이템과 수치를 적었습니다. 귀속 조건을 확인해 준비하세요.</p>
                    {itemGroups.map(group => (
                      <ItemGroup key={group.id} data-item-group={group.id}>
                        <h4>{group.title}</h4>
                        <p>{group.intro}</p>
                        <ul>{group.items.map(item => (
                          <li key={item.id}>
                            <ItemLink href={item.source} target="_blank" rel="noreferrer" data-item-id={item.id} aria-label={`${item.name} — 한국어 아이템 설명, 새 창`}>
                              <img src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`} alt="" width="36" height="36" loading="lazy" />
                              <span>
                                <strong><Highlight text={item.name} query={query} /></strong>
                                <small>{item.effect}{item.hearty ? <em> · 사망 후 유지</em> : null}</small>
                              </span>
                            </ItemLink>
                          </li>
                        ))}</ul>
                      </ItemGroup>
                    ))}
                  </ItemCatalog>
                ) : null}
                {section.id === 'crafting' && screens.length ? (
                  <ScreenGuide aria-label="주문 제작 창 화면 안내">
                    <h3>게임 창에서 어디를 누르나요?</h3>
                    <p>주문 제작 담당 NPC에게 말을 걸면 열리는 ‘주문 제작 의뢰’ 창을 실제 한국어 게임 화면의 배치와 문구대로 본떠 그렸습니다. 번호 상자가 가리키는 곳을 위 단계와 맞춰 보세요. 장비·재료·숫자는 예시입니다.</p>
                    {screens.map(screen => (
                      <ScreenFigure key={screen.id} data-screen-id={screen.id}>
                        <figcaption>
                          <h4><b>화면 {beginnerCraftingScreens.indexOf(screen) + 1}</b><Highlight text={screen.title} query={query} /></h4>
                          <StepLinks>위 단계 {screen.steps.map(step => <b key={step}>{step}</b>)}</StepLinks>
                          <p><Highlight text={screen.summary} query={query} /></p>
                        </figcaption>
                        <CraftingScreen id={screen.id} />
                        <Legend>{screen.legend.map((item, index) => (
                          <li key={item.label}><b aria-hidden="true">{index + 1}</b><span><strong><Highlight text={item.label} query={query} /></strong><Highlight text={item.text} query={query} /></span></li>
                        ))}</Legend>
                      </ScreenFigure>
                    ))}
                  </ScreenGuide>
                ) : null}
                {section.id === 'crafting' && embellishmentCount ? (
                  <ItemCatalog aria-label="현재 버전 장식 목록">
                    <h3>{beginnerEmbellishments.title}</h3>
                    <p>{beginnerEmbellishments.intro}</p>
                    <Note>{beginnerEmbellishments.note}</Note>
                    {embellishmentGroups.map(group => (
                      <ItemGroup key={group.id} data-embellishment-group={group.id}>
                        <h4>{group.title}</h4>
                        <p>{group.intro}</p>
                        <ul>{group.items.map(item => (
                          <li key={item.id}>
                            <ItemLink href={item.source} target="_blank" rel="noreferrer" data-embellishment-id={item.id} aria-label={`${item.name} — 한국어 아이템 설명, 새 창`}>
                              <img src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`} alt="" width="36" height="36" loading="lazy" />
                              <span>
                                <strong><Highlight text={item.name} query={query} /></strong>
                                <small><em><Highlight text={item.requirement} query={query} /></em></small>
                                <small><Highlight text={item.effect} query={query} /></small>
                              </span>
                            </ItemLink>
                            {item.effectSource ? <EffectSource href={item.effectSource} target="_blank" rel="noreferrer">{item.name} 효과 원문 · 새 창</EffectSource> : null}
                          </li>
                        ))}</ul>
                      </ItemGroup>
                    ))}
                  </ItemCatalog>
                ) : null}
              </Section>
            );
          }) : (
            <Empty>
              <h2>일치하는 설명이 없습니다</h2>
              <p>더 짧은 말이나 다른 표현으로 찾아보세요. 예: 힐, 쿨, 물약.</p>
              <Reset type="button" onClick={clear}>전체 설명 보기</Reset>
            </Empty>
          )}
          <Footer>
            <NextPanel>
              <div>
                <h2>이제 내 직업을 알아볼까요?</h2>
                <p>공통 개념을 익혔다면 전문화 가이드에서 내 스킬과 전투 흐름, 특성 견본을 확인하세요.</p>
              </div>
              <NextLink to="/guide">내 직업 가이드 찾기 <ArrowRight size={16} aria-hidden="true" /></NextLink>
            </NextPanel>
            <Sources>
              <summary>설명의 범위와 공식 참고 자료</summary>
              <p>클래식이 아닌 본 서버의 공통 개념을 다룹니다. 시즌별 입장 조건·보상 수치·구매할 소모품 목록은 게임 안 안내와 현재 전문화 가이드를 확인하세요. 과거 공식 소개 글은 시스템의 기본 개념을 참고한 자료이며, 당시 수치를 현재 시즌에 적용하지 않습니다.</p>
              <ul>{beginnerSources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a> — {source.detail}</li>)}</ul>
            </Sources>
          </Footer>
        </Results>
      </Body>
    </Page>
  );
}

export default BeginnerPage;
