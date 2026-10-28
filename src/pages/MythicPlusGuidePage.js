import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, Castle, ExternalLink, KeyRound, Map as MapIcon, Route, Users, X, Youtube } from 'lucide-react';
import mythicPlusGuide from '../data/mythicPlusGuide.json';
import { CURRENT_PATCH_LABEL } from '../data/guideRegistry.js';

// 쐐기 가이드. 글은 KB 정본(00-공통/공용/Meta/mythicplus-guide.json)에서 sync-kb로 받은 mythicPlusGuide.json을 그대로 보여 준다.
// 던전마다 한 탭(/mythicplus/<던전 id>)이고, 전체 루트 → 네임드 → 풀링 순서 → 근거 순서다.
// 디자인은 레이드 가이드와 같은 평면 언어(어두운 배경, 금색 강조, 1px 구분선, 각진 모서리)를 쓴다.
const GOLD = '#d2b373';
const LINE = 'rgba(168, 178, 188, 0.14)';
const LINE_STRONG = 'rgba(168, 178, 188, 0.2)';
const PANEL = 'rgba(13, 18, 22, 0.62)';
const INK = '#0a0e11';

// 몹 스킬 표시(차단·해제·피하기·탱커·통제) 색 — 스토리보드·영상과 같은 색이다.
const TAG_COLORS = { '차단': '#ee786c', '해제': '#c29ded', '피하기': '#f0a050', '탱커': '#83d0ed', '통제': '#a6d779' };
const ROLE_COLORS = { '탱커': '#83d0ed', '힐러': '#a6d779', '딜러': '#f6dba1' };

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
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 28px clamp(32px, 6vw, 72px);
  align-items: end;
  padding: clamp(28px, 4vw, 44px) 0 28px;
  border-top: 3px solid ${GOLD};
  border-bottom: 1px solid rgba(168, 178, 188, 0.16);
  @media (max-width: 900px) { grid-template-columns: minmax(0, 1fr); gap: 22px; align-items: start; }
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
  max-width: 640px;
  margin-top: 16px;
  color: #aeb8be;
  font-size: 1rem;
  line-height: 1.78;
  text-wrap: pretty;
`;
const Metrics = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid ${LINE};
  border-left: 1px solid ${LINE};
  div { padding: 12px 14px; border-right: 1px solid ${LINE}; border-bottom: 1px solid ${LINE}; }
  dt { color: #7f8b94; font-size: 0.66rem; font-weight: 650; letter-spacing: 0.04em; text-transform: uppercase; }
  dd { margin-top: 4px; color: #eef1f3; font-size: 0.98rem; font-weight: 700; font-variant-numeric: tabular-nums; }
`;
const Notes = styled.ul`
  display: grid;
  gap: 0;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid ${LINE_STRONG};
  border-left: 3px solid ${GOLD};
  background: ${PANEL};
  li { padding: 10px 16px; color: #c9c3b5; font-size: 0.84rem; line-height: 1.65; }
  li + li { border-top: 1px solid ${LINE}; }
  @media (min-width: 761px) { grid-template-columns: repeat(2, minmax(0, 1fr)); li + li { border-top: 0; } li:nth-child(n + 3) { border-top: 1px solid ${LINE}; } li:nth-child(odd) { border-right: 1px solid ${LINE}; } }
`;
const Tabs = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 22px;
  margin-top: 26px;
  border-bottom: 1px solid ${LINE};
  @media (max-width: 560px) { gap: 0 14px; }
`;
const Tab = styled(Link)`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-height: 54px;
  padding: 6px 0 8px;
  margin-bottom: -1px;
  border-bottom: 2px solid ${props => (props.$active ? props.$color : 'transparent')};
  color: ${props => (props.$active ? '#eef1f3' : '#8f9aa2')};
  font-size: 0.9rem;
  font-weight: ${props => (props.$active ? 700 : 540)};
  small { color: ${props => (props.$active ? props.$color : '#6f7b84')}; font-size: 0.7rem; font-weight: 650; }
  &:hover { color: #eef1f3; }
  &:hover small { color: ${props => props.$color}; }
`;
// 던전 머리: 왼쪽 이름·한 줄 사실·개요, 오른쪽 던전 그림(유튜브 썸네일과 같은 픽셀아트).
const DungeonHead = styled.section`
  display: grid;
  grid-template-columns: 6px minmax(0, 1fr) minmax(240px, 320px);
  gap: 18px;
  margin-top: 34px;
  > span { background: ${props => props.$color}; }
  h2 { color: #eef1f3; font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.2; }
  h2 small { margin-left: 10px; color: #8f9aa2; font-size: 0.82rem; font-weight: 600; }
  @media (max-width: 900px) { grid-template-columns: 6px minmax(0, 1fr); }
`;
const DungeonArt = styled.div`
  align-self: start;
  border: 1px solid ${LINE_STRONG};
  border-bottom: 2px solid ${props => props.$color};
  background: ${INK};
  img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
  @media (max-width: 900px) { grid-column: 2; max-width: 420px; }
`;
const Facts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  li { color: #aeb8be; font-size: 0.86rem; font-weight: 600; font-variant-numeric: tabular-nums; }
  li b { margin-right: 6px; color: ${GOLD}; font-size: 0.72rem; font-weight: 750; letter-spacing: 0.03em; }
`;
const Scope = styled.p`
  max-width: 74ch;
  margin-top: 12px;
  color: #c6d0d6;
  font-size: 0.94rem;
  line-height: 1.76;
  text-wrap: pretty;
`;
// 영상(유튜브 번호가 들어오면 보인다). 장면을 누르면 그 시각부터 재생한다.
const VideoPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr);
  margin-top: 26px;
  border: 1px solid ${LINE_STRONG};
  background: ${PANEL};
  scroll-margin-top: 86px;
  @media (max-width: 900px) { grid-template-columns: minmax(0, 1fr); }
`;
const VideoFrame = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background: ${INK};
  iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
`;
const VideoSide = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 18px 18px 14px;
  border-left: 1px solid ${LINE_STRONG};
  box-shadow: inset 0 2px 0 ${GOLD};
  h3 { color: #eef1f3; font-size: 1rem; line-height: 1.4; }
  > p { margin-top: 6px; color: #98a6af; font-size: 0.8rem; }
  > a { display: inline-flex; gap: 5px; align-items: center; align-self: flex-start; margin-top: auto; padding-top: 12px; color: #d9bd7b; font-size: 0.84rem; font-weight: 650; }
  > a:hover { color: #eef1f3; }
  @media (max-width: 900px) { border-left: 0; border-top: 1px solid ${LINE_STRONG}; }
`;
const Chapters = styled.ol`
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${LINE};
  li { display: flex; align-items: stretch; border-bottom: 1px solid ${LINE}; }
  li > a { display: inline-flex; align-items: center; padding: 0 4px 0 10px; color: #8f9aa2; font-size: 0.76rem; font-weight: 650; }
  li > a:hover { color: ${GOLD}; }
`;
const ChapterButton = styled.button`
  display: flex;
  flex: 1 1 auto;
  gap: 12px;
  align-items: center;
  min-width: 0;
  min-height: 38px;
  padding: 6px 4px;
  border: 0;
  background: transparent;
  color: ${props => (props.$current ? '#eef1f3' : '#c6d0d6')};
  font-size: 0.86rem;
  font-weight: ${props => (props.$current ? 700 : 500)};
  text-align: left;
  b { flex: 0 0 auto; min-width: 38px; color: ${GOLD}; font-size: 0.78rem; font-variant-numeric: tabular-nums; }
  &:hover { color: #eef1f3; }
`;
const Body = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 48px;
  margin-top: 34px;
  @media (max-width: 900px) { grid-template-columns: minmax(0, 1fr); gap: 24px; margin-top: 24px; }
`;
const Contents = styled.nav`
  position: sticky;
  top: 86px;
  align-self: start;
  max-height: calc(100vh - 100px);
  overflow: auto;
  p { margin-bottom: 8px; color: #8f9aa2; font-size: 0.72rem; font-weight: 680; letter-spacing: 0.04em; }
  @media (max-width: 900px) { position: static; max-height: none; }
`;
const ContentsList = styled.div`
  display: grid;
  border-top: 1px solid ${LINE_STRONG};
  @media (max-width: 900px) { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; padding-top: 10px; border-top: 0; }
`;
const ContentsGroup = styled.div`
  border-bottom: 1px solid rgba(168, 178, 188, 0.1);
  @media (max-width: 900px) { border: 1px solid ${LINE_STRONG}; background: ${PANEL}; }
`;
const ContentsLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 44px;
  padding: 10px 10px 10px 12px;
  margin-left: -12px;
  border-left: 2px solid ${props => (props.$active ? GOLD : 'transparent')};
  color: ${props => (props.$active ? '#eef1f3' : '#aeb8be')};
  font-size: 0.86rem;
  font-weight: ${props => (props.$active ? 700 : 560)};
  b { color: ${props => (props.$active ? GOLD : '#7f8b94')}; font-size: 0.72rem; font-weight: 700; white-space: nowrap; }
  &:hover { color: #eef1f3; }
  @media (max-width: 900px) { margin-left: 0; padding: 8px 12px; border-left-width: 2px; }
`;
const Main = styled.div`
  min-width: 0;
`;
const Section = styled.section`
  min-width: 0;
  padding-bottom: 44px;
  scroll-margin-top: 80px;
  & + & { padding-top: 40px; border-top: 1px solid rgba(168, 178, 188, 0.13); }
`;
const SubHead = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0;
  color: #eef1f3;
  font-size: 1.12rem;
  font-weight: 720;
  scroll-margin-top: 80px;
  small { color: #7f8b94; font-size: 0.78rem; font-weight: 650; font-variant-numeric: tabular-nums; }
  svg { color: ${GOLD}; }
  & + * { margin-top: 14px; }
`;
const MinorHead = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 26px;
  color: #eef1f3;
  font-size: 0.9rem;
  font-weight: 720;
  small { color: #7f8b94; font-size: 0.74rem; font-weight: 650; }
`;
const RouteLine = styled.p`
  margin-top: 10px;
  color: #8f9aa2;
  font-size: 0.8rem;
  line-height: 1.6;
  a { text-decoration: underline; text-underline-offset: 3px; color: #c6d0d6; }
  a:hover { color: ${GOLD}; }
`;
// 그림(전체 루트·풀링 지도·동작 도식). 누르면 큰 그림으로 연다.
const Figure = styled.figure`
  min-width: 0;
  margin: ${props => (props.$wide ? '14px 0 0' : '0')};
  button { display: block; width: 100%; padding: 0; border: 1px solid ${LINE_STRONG}; background: ${INK}; cursor: zoom-in; }
  button:hover, button:focus-visible { border-color: ${GOLD}; }
  img { display: block; width: 100%; height: auto; aspect-ratio: ${props => props.$ratio || '16 / 9'}; object-fit: contain; background: ${INK}; }
  figcaption { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 6px; color: #a4b0b8; font-size: 0.78rem; line-height: 1.5; }
  figcaption b { color: ${GOLD}; font-size: 0.7rem; font-weight: 750; letter-spacing: 0.03em; }
`;
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(4, 6, 8, 0.9);
  cursor: zoom-out;
  figure { margin: 0; max-width: min(1600px, 100%); }
  img { display: block; max-width: 100%; max-height: calc(100vh - 110px); width: auto; height: auto; border: 1px solid ${LINE_STRONG}; }
  figcaption { margin-top: 10px; color: #c6d0d6; font-size: 0.9rem; line-height: 1.5; }
  figcaption b { margin-right: 10px; color: ${GOLD}; }
  button { position: absolute; top: 14px; right: 16px; display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid ${LINE_STRONG}; background: #0d1216; color: #eef1f3; cursor: pointer; }
`;
// 꼭 끊을 것 · 지울 것(우선도 순). 몹 이름과 스킬 칩을 한 줄에 둔다.
const Musts = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 14px;
  @media (min-width: 761px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;
const Must = styled.div`
  padding: 12px 14px;
  border: 1px solid ${LINE_STRONG};
  border-top: 2px solid ${props => props.$color};
  background: ${PANEL};
  h4 { display: flex; align-items: center; gap: 8px; color: ${props => props.$color}; font-size: 0.82rem; font-weight: 750; letter-spacing: 0.03em; }
  h4 small { color: #7f8b94; font-weight: 650; }
  ul { display: grid; gap: 6px; margin: 10px 0 0; padding: 0; list-style: none; }
  li { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; font-size: 0.84rem; }
  li > span { color: #c3cbd0; font-weight: 600; }
  p { margin-top: 8px; color: #7f8b94; font-size: 0.78rem; }
`;
const Boss = styled(Section)``;
const BossHead = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 6px 16px;
  align-items: end;
  h2 { padding-bottom: 6px; color: #eef1f3; font-size: clamp(1.34rem, 2.4vw, 1.72rem); line-height: 1.3; }
  h2 small { display: block; margin-top: 2px; color: ${GOLD}; font-size: 0.74rem; font-weight: 700; letter-spacing: 0.04em; }
  h2 em { margin-left: 8px; color: #7f8b94; font-size: 0.78rem; font-style: normal; font-weight: 600; }
`;
// 네임드 도트 모델(투명 배경).
const BossSprite = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-width: 96px;
  height: 96px;
  padding: 0 4px;
  border-bottom: 2px solid ${props => props.$color};
  img { max-width: 150px; height: 96px; width: auto; object-fit: contain; filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.55)); }
  @media (max-width: 560px) { min-width: 68px; height: 68px; img { height: 68px; max-width: 110px; } }
`;
const Summary = styled.p`
  max-width: 74ch;
  margin-top: 16px;
  color: #c6d0d6;
  font-size: 0.98rem;
  line-height: 1.78;
  text-wrap: pretty;
`;
const VideoLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  color: #8f9aa2;
  font-size: 0.78rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-variant-numeric: tabular-nums;
  &:hover { color: ${GOLD}; }
`;
const Tips = styled.ul`
  display: grid;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${LINE_STRONG};
  li { display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 4px 14px; align-items: start; padding: 11px 0; border-bottom: 1px solid rgba(168, 178, 188, 0.11); }
  li ul { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; }
  li ul li { display: block; padding: 0; border: 0; color: #c3cbd0; font-size: 0.88rem; line-height: 1.68; text-wrap: pretty; }
  @media (max-width: 560px) { li { grid-template-columns: minmax(0, 1fr); gap: 4px; } }
`;
const Role = styled.span`
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  margin-top: 2px;
  padding: 2px 8px;
  border: 1px solid ${props => props.$color};
  color: ${props => props.$color};
  font-size: 0.74rem;
  font-weight: 720;
  line-height: 1.5;
  white-space: nowrap;
`;
const PhaseHead = styled.h4`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 28px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${LINE_STRONG};
  color: #eef1f3;
  font-size: 1rem;
  font-weight: 720;
  small { color: #7f8b94; font-size: 0.76rem; font-weight: 650; font-variant-numeric: tabular-nums; }
`;
const Steps = styled.ol`
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  container-type: inline-size;
`;
// 동작 하나: 넓은 화면에서 왼쪽 도식·오른쪽 글, 좁은 화면에서 도식 → 글 순서.
const Step = styled.li`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: 'fig' 'num' 'body';
  gap: 10px;
  padding: 12px;
  border: 1px solid ${LINE_STRONG};
  border-left: 3px solid ${props => props.$color};
  background: ${PANEL};
  > figure { grid-area: fig; }
  > span { grid-area: num; }
  > div { grid-area: body; min-width: 0; }
  h5 { color: #eef1f3; font-size: 0.98rem; font-weight: 720; line-height: 1.45; }
  p { margin-top: 6px; color: #c3cbd0; font-size: 0.88rem; line-height: 1.72; text-wrap: pretty; }
  &[data-no-figure] { grid-template-areas: 'num' 'body'; }
  @container (min-width: 640px) {
    &:not([data-no-figure]) {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
      grid-template-rows: auto 1fr;
      grid-template-areas: 'fig num' 'fig body';
      gap: 8px 18px;
      padding: 12px 18px 12px 12px;
    }
    &[data-no-figure] { grid-template-columns: 64px minmax(0, 1fr); grid-template-areas: 'num body'; }
  }
`;
const StepNum = styled.span`
  display: inline-grid;
  place-items: center;
  align-self: start;
  width: 28px;
  height: 28px;
  margin-top: 2px;
  border: 1px solid rgba(210, 179, 115, 0.5);
  color: ${GOLD};
  font-size: 0.8rem;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
`;
const Danger = styled.p`
  max-width: 74ch;
  margin-top: 18px;
  padding: 10px 14px;
  border: 1px solid rgba(238, 120, 108, 0.6);
  border-left: 3px solid #ee786c;
  background: rgba(238, 120, 108, 0.08);
  color: #e9d2cd;
  font-size: 0.86rem;
  line-height: 1.65;
  b { margin-right: 8px; color: #ee786c; font-size: 0.74rem; font-weight: 750; }
`;
const SpellStrip = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
`;
const SpellChip = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 4px 10px 4px 4px;
  border: 1px solid ${LINE_STRONG};
  background: ${PANEL};
  color: #e7c46f;
  font-size: 0.84rem;
  font-weight: 680;
  img { width: 28px; height: 28px; border: 1px solid #59636b; }
  &:hover { border-color: ${GOLD}; color: #f7dda0; }
`;
const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border: 1px solid ${props => props.$color};
  background: ${props => `${props.$color}1f`};
  color: ${props => props.$color};
  font-size: 0.68rem;
  font-weight: 750;
  letter-spacing: 0.02em;
  white-space: nowrap;
`;
// 풀링 카드: 왼쪽 지도(800x720), 오른쪽 번호·병력·몹 목록·주의.
const Pulls = styled.ol`
  display: grid;
  gap: 14px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  container-type: inline-size;
`;
const Pull = styled.li`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
  border: 1px solid ${LINE_STRONG};
  border-left: 3px solid ${props => (props.$boss ? GOLD : '#9aa5ad')};
  background: ${PANEL};
  scroll-margin-top: 80px;
  > figure { min-width: 0; }
  @container (min-width: 700px) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 10px 20px;
    padding: 12px 18px 12px 12px;
  }
`;
const PullHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  h4 { color: ${props => (props.$boss ? GOLD : '#eef1f3')}; font-size: 1.08rem; font-weight: 750; font-variant-numeric: tabular-nums; }
  h4 small { margin-left: 6px; color: #7f8b94; font-size: 0.76rem; font-weight: 650; }
`;
const Progress = styled.div`
  margin-top: 8px;
  div { position: relative; height: 8px; background: rgba(30, 40, 46, 1); }
  div > i { position: absolute; top: 0; bottom: 0; left: 0; background: #546e46; }
  div > i + i { background: #a6d779; }
  p { margin-top: 4px; color: #8f9aa2; font-size: 0.74rem; font-variant-numeric: tabular-nums; }
`;
const MobList = styled.ul`
  display: grid;
  gap: 6px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
`;
const MobRow = styled.li`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 2px 10px;
  align-items: center;
  > div { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; }
  strong { color: #eef1f3; font-size: 0.9rem; font-weight: 700; }
  strong b { margin-left: 4px; color: ${props => props.$color}; font-weight: 750; }
  span { color: #7f8b94; font-size: 0.76rem; font-variant-numeric: tabular-nums; }
  > ul { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px; margin: 2px 0 0; padding: 0; list-style: none; }
`;
const MobThumb = styled.div`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border: 1px solid ${props => props.$color};
  border-radius: 50%;
  background: #141a1f;
  img { width: 36px; height: 36px; object-fit: contain; object-position: 50% 20%; }
  span { width: 14px; height: 14px; background: ${props => props.$color}; }
`;
const MiniSpell = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 28px;
  padding: 2px 8px 2px 2px;
  border: 1px solid ${LINE_STRONG};
  background: rgba(9, 12, 15, 0.5);
  color: #e7c46f;
  font-size: 0.76rem;
  font-weight: 650;
  img { width: 20px; height: 20px; border: 1px solid #59636b; }
  &:hover { border-color: ${GOLD}; color: #f7dda0; }
`;
const PullNotes = styled.ul`
  margin: 12px 0 0;
  padding: 0 0 0 16px;
  color: #c3cbd0;
  font-size: 0.86rem;
  line-height: 1.68;
  li + li { margin-top: 4px; }
  li::marker { color: ${GOLD}; }
`;
// 이 풀링에 처음 나오는 쫄 설명(접힘).
const NewMobs = styled.details`
  grid-column: 1 / -1;
  margin-top: 4px;
  summary { display: inline-flex; align-items: center; gap: 8px; min-height: 40px; cursor: pointer; color: #c6d0d6; font-size: 0.84rem; font-weight: 650; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  summary::before { content: '+'; width: 18px; height: 18px; border: 1px solid #59636b; color: ${GOLD}; font-size: 0.8rem; line-height: 16px; text-align: center; }
  &[open] summary::before { content: '−'; }
`;
const MobCards = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 6px;
  @media (min-width: 761px) { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
`;
const MobCard = styled.article`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 6px 14px;
  padding: 12px 14px;
  border: 1px solid ${LINE_STRONG};
  border-top: 2px solid ${props => props.$color};
  background: rgba(9, 12, 15, 0.55);
  h5 { color: #eef1f3; font-size: 0.96rem; font-weight: 720; }
  h5 small { display: block; margin-top: 2px; color: #7f8b94; font-size: 0.72rem; font-weight: 600; }
  > div { min-width: 0; }
`;
const MobArt = styled.div`
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border: 1px solid ${LINE};
  background: ${INK};
  img { max-width: 68px; max-height: 68px; width: auto; height: auto; object-fit: contain; }
  span { width: 22px; height: 22px; background: ${props => props.$color}; }
`;
const MobSpells = styled.ul`
  grid-column: 1 / -1;
  display: grid;
  gap: 8px;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  li { display: grid; gap: 4px; padding-top: 8px; border-top: 1px dashed rgba(168, 178, 188, 0.2); }
  li > div { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  li p { color: #b7c1c7; font-size: 0.8rem; line-height: 1.6; }
  li p i { color: #7f8b94; font-style: normal; }
`;
const MobNotes = styled.ul`
  grid-column: 1 / -1;
  margin: 8px 0 0;
  padding: 0 0 0 16px;
  color: #c3cbd0;
  font-size: 0.84rem;
  line-height: 1.65;
  li::marker { color: ${GOLD}; }
`;
const Cc = styled.p`
  grid-column: 1 / -1;
  margin-top: 6px;
  color: #8f9aa2;
  font-size: 0.76rem;
  line-height: 1.5;
  b { margin-right: 6px; color: ${TAG_COLORS['통제']}; font-size: 0.7rem; font-weight: 750; }
`;
const SourceList = styled.ul`
  margin: 12px 0 0;
  padding: 0 0 0 18px;
  color: #aeb8be;
  font-size: 0.82rem;
  line-height: 1.7;
  li + li { margin-top: 4px; }
  a { text-decoration: underline; text-underline-offset: 3px; color: #c6d0d6; }
  a:hover { color: ${GOLD}; }
`;
const Term = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  margin: 0 1px;
  color: #e7c46f;
  font-weight: 680;
  line-height: 1.35;
  vertical-align: -0.18em;
  white-space: nowrap;
  border-bottom: 1px solid rgba(231, 196, 111, 0.22);
  img { flex: 0 0 auto; width: 1.05em; height: 1.05em; object-fit: cover; border: 1px solid rgba(255, 209, 102, 0.38); border-radius: 3px; }
  &:hover { color: #f7dda0; border-bottom-color: rgba(247, 221, 160, 0.76); }
`;
const TermGlue = styled.span`
  white-space: nowrap;
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
  h2 { color: #eef1f3; font-size: 1.3rem; }
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
`;
const Basis = styled.details`
  margin-top: 28px;
  color: #aeb8be;
  font-size: 0.84rem;
  line-height: 1.75;
  summary { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; cursor: pointer; color: #c6d0d6; font-weight: 650; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  summary::before { content: '+'; width: 18px; height: 18px; border: 1px solid #59636b; color: ${GOLD}; font-size: 0.8rem; line-height: 16px; text-align: center; }
  &[open] summary::before { content: '−'; }
  ul { margin-top: 10px; padding-left: 20px; }
  li { margin-top: 8px; max-width: 80ch; }
  li a { text-decoration: underline; text-underline-offset: 3px; color: #c6d0d6; }
  li a:hover { color: ${GOLD}; }
`;

// 그림 파일(public/images/mythicplus). 정본의 figure 값이 파일 이름이다.
const IMAGE = (dungeonId, key, width) => `/images/mythicplus/${dungeonId}/${key}-${width}.webp`;
const SPRITE = id => `/images/mythicplus/sprites/${id}.webp`;
const THUMB = id => `/images/mythicplus/thumb/${id}-960.webp`;
const ICON = icon => `https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`;
const wowhead = id => `https://ko.wowhead.com/spell=${id}`;

function clock(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function mobColor(mob) {
  if (!mob) return '#9aa5ad';
  if (mob.boss) return GOLD;
  return mob.forces >= 20 ? '#ee786c' : mob.forces >= 5 ? '#f3eee2' : '#9aa5ad';
}

function PlanFigure({ dungeonId, figure, width, ratio, title, caption, onZoom, wide = false, label }) {
  if (!figure) return null;
  const src = IMAGE(dungeonId, figure, width);
  const alt = `${title} — ${caption}`;
  return (
    <Figure $wide={wide} $ratio={ratio} data-figure={figure}>
      <button type="button" onClick={() => onZoom({ src, title, caption, alt })} aria-label={`${alt} 크게 보기`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </button>
      <figcaption><b>{label}</b>{caption}</figcaption>
    </Figure>
  );
}

function PlanLightbox({ zoom, onClose }) {
  useEffect(() => {
    if (!zoom) return undefined;
    const onKey = event => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom, onClose]);
  if (!zoom) return null;
  return (
    <Lightbox role="dialog" aria-modal="true" aria-label={zoom.alt} onClick={onClose}>
      <button type="button" onClick={onClose} aria-label="닫기"><X size={20} aria-hidden="true" /></button>
      <figure>
        <img src={zoom.src} alt={zoom.alt} />
        <figcaption><b>{zoom.title}</b>{zoom.caption}</figcaption>
      </figure>
    </Lightbox>
  );
}

// 글 속의 몹 스킬 이름을 아이콘이 붙은 툴팁 링크로 바꾼다. 긴 이름을 먼저 찾아 '대규모 독살' 안의 '독살'을 따로 잡지 않는다.
// 두 글자 이름(치유·강화·감염 같은 흔한 말)은 다른 뜻으로도 쓰이므로 본문에서는 바꾸지 않는다(몹 카드의 스킬 칩에는 그대로 보인다).
const termsCache = new Map();
function termsFor(dungeon) {
  if (!termsCache.has(dungeon.id)) {
    const terms = Object.entries(dungeon.spells)
      .filter(([, spell]) => spell.name && spell.name.length >= 3)
      .map(([id, spell]) => ({ id, name: spell.name, icon: spell.icon }))
      .sort((a, b) => b.name.length - a.name.length);
    termsCache.set(dungeon.id, terms);
  }
  return termsCache.get(dungeon.id);
}

export function TermText({ text, dungeon }) {
  const terms = termsFor(dungeon);
  if (!text || !terms.length) return text;
  const nodes = [];
  let from = 0;
  for (;;) {
    let best = null;
    for (const term of terms) {
      const at = text.indexOf(term.name, from);
      if (at !== -1 && (!best || at < best.at)) best = { at, term };
    }
    if (!best) break;
    if (best.at > from) nodes.push(text.slice(from, best.at));
    const { term } = best;
    const end = best.at + term.name.length;
    // 바로 뒤에 붙은 조사·문장부호는 이름표와 같은 줄에 둔다. 다음 이름표 앞에서 멈춘다.
    let tail = (text.slice(end).match(/^[^\s·]{0,4}[·.,)」”'"!?:;]?/) || [''])[0];
    for (const other of terms) {
      const at = tail.indexOf(other.name);
      if (at !== -1) tail = tail.slice(0, at);
    }
    const link = (
      <Term key={`${term.id}-${best.at}`} href={wowhead(term.id)} data-wowhead={`spell=${term.id}&domain=ko`} data-wh-rename-link="false" target="_blank" rel="noreferrer" data-term-id={term.id}>
        {term.icon ? <img src={ICON(term.icon)} alt="" width="18" height="18" loading="lazy" /> : null}
        <span>{term.name}</span>
      </Term>
    );
    nodes.push(tail ? <TermGlue key={`glue-${best.at}`} data-term-piece="">{link}{tail}</TermGlue> : link);
    from = end + tail.length;
  }
  if (from < text.length) nodes.push(text.slice(from));
  return nodes;
}

function useActiveSection(key) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const ids = key.split(' ').filter(Boolean);
    setActive(ids[0] || '');
    if (typeof window === 'undefined' || !ids.length) return undefined;
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

export const mythicPlusDungeons = mythicPlusGuide.dungeons;
const pullCount = mythicPlusGuide.dungeons.reduce((total, dungeon) => total + dungeon.pulls.length, 0);
const bossCount = mythicPlusGuide.dungeons.reduce((total, dungeon) => total + dungeon.bosses.filter(boss => !boss.major).length, 0);
const videoReady = dungeon => /^[A-Za-z0-9_-]{11}$/.test(dungeon.video.youtubeId || '');

function SpellLink({ dungeon, id, as: Component = SpellChip, tags = [] }) {
  const spell = dungeon.spells[String(id)];
  if (!spell) return null;
  return (
    <Component href={wowhead(id)} data-wowhead={`spell=${id}&domain=ko`} data-wh-rename-link="false" target="_blank" rel="noreferrer" data-spell-id={id}>
      {tags.map(tag => <Tag key={tag} $color={TAG_COLORS[tag] || '#9aa5ad'}>{tag}</Tag>)}
      {spell.icon ? <img src={ICON(spell.icon)} alt="" loading="lazy" /> : null}
      {spell.name}
    </Component>
  );
}

function MobCardView({ dungeon, id }) {
  const mob = dungeon.mobs[String(id)];
  if (!mob) return null;
  const color = mobColor(mob);
  return (
    <MobCard $color={color} data-mob={id}>
      <MobArt $color={color} aria-hidden="true">
        {mob.sprite ? <img src={SPRITE(mob.sprite)} alt="" loading="lazy" decoding="async" /> : <span />}
      </MobArt>
      <div>
        <h5>{mob.name}<small>병력 {mob.forces}{mob.priority ? ` · 우선도 ${mob.priority}` : ''}</small></h5>
      </div>
      {mob.spells.length ? (
        <MobSpells aria-label={`${mob.name} 스킬`}>
          {mob.spells.map(item => {
            const spell = dungeon.spells[String(item.id)];
            if (!spell) return null;
            return (
              <li key={item.id}>
                <div><SpellLink dungeon={dungeon} id={item.id} as={MiniSpell} tags={item.tags} />{spell.cast ? <i style={{ color: '#7f8b94', fontSize: '0.74rem', fontStyle: 'normal' }}>{spell.cast}</i> : null}</div>
                {spell.desc ? <p>{spell.desc}</p> : null}
              </li>
            );
          })}
        </MobSpells>
      ) : null}
      {mob.notes.length ? (
        <MobNotes>
          {mob.notes.map(note => <li key={note}><TermText text={note} dungeon={dungeon} /></li>)}
        </MobNotes>
      ) : null}
      {mob.cc && mob.cc.length ? <Cc><b>통하는 군중 제어</b>{mob.cc.join(' · ')}</Cc> : null}
    </MobCard>
  );
}

function PullCard({ dungeon, pull, onZoom, playFrom }) {
  const bossNames = pull.bossIds.map(id => dungeon.mobs[String(id)]?.name).filter(Boolean);
  const ready = videoReady(dungeon);
  const prev = Math.max(0, pull.cum - pull.pct);
  return (
    <Pull id={`${dungeon.id}-pull-${pull.n}`} $boss={pull.boss} data-pull={pull.n} data-boss-pull={pull.boss ? 'true' : undefined}>
      <PlanFigure
        dungeonId={dungeon.id}
        figure={pull.figure}
        width={800}
        ratio="800 / 720"
        title={`풀링 ${pull.n}`}
        caption={pull.boss ? `${bossNames.join(' · ')} 자리` : `풀링 ${pull.n} 범위와 몹 자리`}
        onZoom={onZoom}
        label="지도"
      />
      <div>
        <PullHead $boss={pull.boss}>
          <h4>풀링 {pull.n} / {dungeon.pulls.length}<small>{pull.boss ? `네임드 · ${bossNames.join(' · ')}` : `병력 ${pull.forces}`}</small></h4>
          {ready && pull.videoSecond != null ? (
            <VideoLink as="button" type="button" onClick={() => playFrom(pull.videoSecond)} data-video-second={pull.videoSecond} style={{ marginTop: 0, background: 'transparent', border: 0, cursor: 'pointer' }}>
              <Youtube size={13} aria-hidden="true" />영상 {clock(pull.videoSecond)}
            </VideoLink>
          ) : null}
        </PullHead>
        {!pull.boss ? (
          <Progress aria-label={`병력 진행 ${pull.cum}%`}>
            <div><i style={{ width: `${Math.min(100, prev)}%` }} /><i style={{ left: `${Math.min(100, prev)}%`, width: `${Math.max(0, Math.min(100, pull.cum) - Math.min(100, prev))}%` }} /></div>
            <p>+{pull.pct}% · 누적 {pull.cum}%</p>
          </Progress>
        ) : null}
        <MobList aria-label={`풀링 ${pull.n} 몹`}>
          {pull.mobs.map(item => {
            const mob = dungeon.mobs[String(item.id)];
            if (!mob) return null;
            const color = mobColor(mob);
            return (
              <MobRow key={item.id} $color={color} data-mob-row={item.id}>
                <MobThumb $color={color} aria-hidden="true">{mob.sprite ? <img src={SPRITE(mob.sprite)} alt="" loading="lazy" decoding="async" /> : <span />}</MobThumb>
                <div>
                  <strong>{mob.name}<b>×{item.count}</b></strong>
                  <span>{mob.boss ? '네임드' : `병력 ${mob.forces}`}</span>
                </div>
                {mob.spells.some(spell => spell.tags.length) ? (
                  <ul>
                    {mob.spells.filter(spell => spell.tags.length).map(spell => (
                      <li key={spell.id}><SpellLink dungeon={dungeon} id={spell.id} as={MiniSpell} tags={spell.tags} /></li>
                    ))}
                  </ul>
                ) : null}
              </MobRow>
            );
          })}
        </MobList>
        {pull.notes.length ? (
          <PullNotes data-pull-notes={pull.n}>
            {pull.notes.map(note => <li key={note}><TermText text={note} dungeon={dungeon} /></li>)}
          </PullNotes>
        ) : null}
      </div>
      {pull.newMobs.length ? (
        <NewMobs data-new-mobs={pull.n}>
          <summary>이 풀링에서 처음 나오는 몹 {pull.newMobs.length}종 · 스킬과 요령</summary>
          <MobCards>
            {pull.newMobs.map(id => <MobCardView key={id} dungeon={dungeon} id={id} />)}
          </MobCards>
        </NewMobs>
      ) : null}
    </Pull>
  );
}

function MythicPlusGuidePage() {
  const { dungeonId } = useParams();
  const dungeon = mythicPlusGuide.dungeons.find(item => item.id === dungeonId) || mythicPlusGuide.dungeons[0];
  const sectionIds = [`${dungeon.id}-route`, ...dungeon.bosses.map(boss => `${dungeon.id}-boss-${boss.id}`), `${dungeon.id}-pulls`, `${dungeon.id}-sources`];
  const active = useActiveSection(sectionIds.join(' '));
  const [zoom, setZoom] = useState(null);
  const closeZoom = useCallback(() => setZoom(null), []);
  const ready = videoReady(dungeon);
  // 장면을 누르면 그 시각부터 다시 불러 재생한다. 처음에는 재생하지 않는다.
  const [videoStart, setVideoStart] = useState(null);
  const videoRef = useRef(null);
  useEffect(() => { setVideoStart(null); setZoom(null); }, [dungeon.id]);
  const playFrom = second => {
    setVideoStart(second);
    videoRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };
  const currentChapter = videoStart == null ? null : dungeon.video.chapters.filter(chapter => chapter.second <= videoStart).pop();
  const realBosses = dungeon.bosses.filter(boss => !boss.major);
  const contents = [
    { id: `${dungeon.id}-route`, label: '전체 루트', tag: `풀링 ${dungeon.pulls.length}개` },
    ...dungeon.bosses.map(boss => ({ id: `${dungeon.id}-boss-${boss.id}`, label: boss.name, tag: boss.major ? '주요 쫄' : '네임드' })),
    { id: `${dungeon.id}-pulls`, label: '풀링 순서', tag: `${dungeon.pulls.length}개` },
    { id: `${dungeon.id}-sources`, label: '근거', tag: `${dungeon.sources.length}곳` },
  ];
  const mobName = id => dungeon.mobs[String(id)]?.name || '';

  return (
    <Page data-dungeon={dungeon.id}>
      <Hero>
        <div>
          <Eyebrow>{mythicPlusGuide.page.eyebrow}</Eyebrow>
          <Title>{mythicPlusGuide.page.title}</Title>
          <Lead>{mythicPlusGuide.page.lead}</Lead>
        </div>
        <Metrics aria-label="쐐기 가이드 범위">
          <div><dt>던전</dt><dd>{mythicPlusGuide.dungeons.length}곳</dd></div>
          <div><dt>풀링</dt><dd>{pullCount}개</dd></div>
          <div><dt>네임드</dt><dd>{bossCount}곳</dd></div>
          <div><dt>기준</dt><dd>{CURRENT_PATCH_LABEL} · {mythicPlusGuide.metadata.difficulty}</dd></div>
        </Metrics>
      </Hero>
      <Notes aria-label="읽기 전에">
        {mythicPlusGuide.page.notes.map(note => <li key={note}>{note}</li>)}
      </Notes>

      <Tabs aria-label="쐐기 던전 선택">
        {mythicPlusGuide.dungeons.map(item => (
          <Tab key={item.id} to={`/mythicplus/${item.id}`} $active={item.id === dungeon.id} $color={item.color} aria-current={item.id === dungeon.id ? 'page' : undefined}>
            {item.name}
            <small>{Math.round(item.timer / 60)}분 · 네임드 {item.bosses.filter(boss => !boss.major).length}곳</small>
          </Tab>
        ))}
      </Tabs>

      <DungeonHead $color={dungeon.color} aria-labelledby="dungeon-title">
        <span aria-hidden="true" />
        <div>
          <h2 id="dungeon-title">{dungeon.name}<small>{dungeon.en} · {dungeon.abbr}</small></h2>
          <Facts aria-label="던전 기본 정보">
            <li><b>제한 시간</b>{Math.round(dungeon.timer / 60)}분</li>
            <li><b>필요 병력</b>{dungeon.required}</li>
            <li><b>풀링</b>{dungeon.pulls.length}개</li>
            <li><b>루트 병력</b>{Math.round((1000 * dungeon.routeForces) / dungeon.required) / 10}%</li>
            <li><b>네임드</b>{realBosses.map(boss => boss.name).join(' → ')}</li>
          </Facts>
          <Scope><TermText text={dungeon.overview} dungeon={dungeon} /></Scope>
        </div>
        <DungeonArt $color={dungeon.color} aria-hidden="true">
          <img src={THUMB(dungeon.thumbnail)} alt="" width="960" height="540" loading="lazy" decoding="async" />
        </DungeonArt>
      </DungeonHead>

      {ready ? (
        <VideoPanel ref={videoRef} id={`${dungeon.id}-video`} aria-labelledby={`${dungeon.id}-video-title`} data-video={dungeon.video.youtubeId}>
          <VideoFrame>
            <iframe
              key={`${dungeon.id}-${videoStart ?? 'start'}`}
              src={`https://www.youtube.com/embed/${dungeon.video.youtubeId}?rel=0${videoStart != null ? `&start=${videoStart}&autoplay=1` : ''}`}
              title={dungeon.video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </VideoFrame>
          <VideoSide>
            <h3 id={`${dungeon.id}-video-title`}>영상으로 먼저 보기</h3>
            <p>{dungeon.video.length} · 장면을 누르면 그 부분부터 재생합니다.</p>
            <Chapters aria-label="영상 장면">
              {dungeon.video.chapters.map(chapter => (
                <li key={`${chapter.second}-${chapter.label}`}>
                  <ChapterButton type="button" onClick={() => playFrom(chapter.second)} $current={chapter === currentChapter} aria-current={chapter === currentChapter ? 'true' : undefined} data-video-second={chapter.second}>
                    <b>{clock(chapter.second)}</b>{chapter.label}
                  </ChapterButton>
                  <a href={`#${dungeon.id}-${chapter.section}`} aria-label={`${chapter.label} 설명으로 가기`}>글</a>
                </li>
              ))}
            </Chapters>
            <a href={`https://www.youtube.com/watch?v=${dungeon.video.youtubeId}`} target="_blank" rel="noopener noreferrer">유튜브에서 보기 · wowmeta 와우메타<ArrowRight size={13} aria-hidden="true" /></a>
          </VideoSide>
        </VideoPanel>
      ) : null}

      <Body>
        <Contents aria-label="이 던전의 순서">
          <p>이 던전에서</p>
          <ContentsList>
            {contents.map(item => (
              <ContentsGroup key={item.id}>
                <ContentsLink href={`#${item.id}`} $active={item.id === active} aria-current={item.id === active ? 'location' : undefined}>
                  {item.label}<b>{item.tag}</b>
                </ContentsLink>
              </ContentsGroup>
            ))}
          </ContentsList>
        </Contents>
        <Main>
          <Section id={`${dungeon.id}-route`} aria-labelledby={`${dungeon.id}-route-title`} data-section="route">
            <SubHead id={`${dungeon.id}-route-title`}><Route size={16} aria-hidden="true" />전체 루트<small>풀링 {dungeon.pulls.length}개 · 네임드 {realBosses.length}곳</small></SubHead>
            <Figure $wide $ratio="auto" data-figure={dungeon.routeFigure}>
              <button type="button" onClick={() => setZoom({ src: IMAGE(dungeon.id, dungeon.routeFigure, 1600), title: dungeon.name, caption: '전체 루트 · 번호는 풀링 순서, 동그라미는 몹 얼굴, 금색 칸은 네임드', alt: `${dungeon.name} 전체 루트 지도` })} aria-label={`${dungeon.name} 전체 루트 크게 보기`}>
                <img
                  src={IMAGE(dungeon.id, dungeon.routeFigure, 960)}
                  srcSet={`${IMAGE(dungeon.id, dungeon.routeFigure, 960)} 960w, ${IMAGE(dungeon.id, dungeon.routeFigure, 1600)} 1600w`}
                  sizes="(max-width: 900px) 100vw, 852px"
                  alt={`${dungeon.name} 전체 루트 지도`}
                  loading="eager"
                  decoding="async"
                  style={{ aspectRatio: 'auto' }}
                />
              </button>
              <figcaption><b>지도</b>번호는 풀링 순서, 동그라미는 몹 얼굴, 금색 칸은 네임드입니다. 실제 지도를 컬러 도트로 바꾼 그림입니다.</figcaption>
            </Figure>
            <RouteLine data-route-line>
              레이더 아이오 던전 탐색기 루트 1번 · 최근 2주 2~11단 {dungeon.route.totalRuns.toLocaleString()}회 중 {dungeon.route.runs.toLocaleString()}회({Math.round((100 * dungeon.route.runs) / dungeon.route.totalRuns)}%) · 시간 안 {Math.round((100 * dungeon.route.timed) / dungeon.route.runs)}% · 중앙값 {Math.floor(dungeon.route.medianSec / 60)}분 {dungeon.route.medianSec % 60}초
              {dungeon.route.url ? <> · <a href={dungeon.route.url} target="_blank" rel="noreferrer">키스톤 구루에서 루트 보기<ExternalLink size={11} aria-hidden="true" style={{ marginLeft: 4, verticalAlign: '-1px' }} /></a></> : null}
            </RouteLine>
            {dungeon.kicks.length || dungeon.dispels.length ? (
              <Musts>
                {dungeon.kicks.length ? (
                  <Must $color={TAG_COLORS['차단']} data-musts="kick">
                    <h4>꼭 끊을 것<small>{dungeon.kicks.length}개</small></h4>
                    <ul>
                      {dungeon.kicks.map(item => (
                        <li key={`${item.mob}-${item.spell}`}><span>{mobName(item.mob)}</span><SpellLink dungeon={dungeon} id={item.spell} as={MiniSpell} /></li>
                      ))}
                    </ul>
                  </Must>
                ) : null}
                {dungeon.dispels.length ? (
                  <Must $color={TAG_COLORS['해제']} data-musts="dispel">
                    <h4>지울 것<small>{dungeon.dispels.length}개</small></h4>
                    <ul>
                      {dungeon.dispels.map(item => (
                        <li key={`${item.mob}-${item.spell}`}><span>{mobName(item.mob)}</span><SpellLink dungeon={dungeon} id={item.spell} as={MiniSpell} /></li>
                      ))}
                    </ul>
                  </Must>
                ) : null}
              </Musts>
            ) : null}
          </Section>

          {dungeon.bosses.map(boss => (
            <Boss key={boss.id} id={`${dungeon.id}-boss-${boss.id}`} aria-labelledby={`${dungeon.id}-boss-${boss.id}-title`} data-boss={boss.id}>
              <BossHead>
                <BossSprite $color={dungeon.color} aria-hidden="true">
                  {boss.sprite ? <img src={SPRITE(boss.sprite)} alt="" loading="lazy" decoding="async" /> : null}
                </BossSprite>
                <h2 id={`${dungeon.id}-boss-${boss.id}-title`}><small>{boss.order}</small>{boss.name}<em>{boss.en}</em></h2>
              </BossHead>
              <Summary><TermText text={boss.summary} dungeon={dungeon} /></Summary>
              {ready && boss.videoSecond != null ? (
                <VideoLink as="button" type="button" onClick={() => playFrom(boss.videoSecond)} data-video-second={boss.videoSecond} style={{ background: 'transparent', border: 0, cursor: 'pointer' }}>
                  <Youtube size={13} aria-hidden="true" />영상에서 보기 {clock(boss.videoSecond)}
                </VideoLink>
              ) : null}
              {boss.pull ? <VideoLink href={`#${dungeon.id}-pull-${boss.pull}`} data-pull-link={boss.pull}><MapIcon size={13} aria-hidden="true" />풀링 {boss.pull}에서 만남</VideoLink> : null}
              <PhaseHead><Users size={15} aria-hidden="true" style={{ color: GOLD, alignSelf: 'center' }} />역할별 요령<small>{boss.roles.length}역할</small></PhaseHead>
              <Tips data-roles={boss.id}>
                {boss.roles.map(item => (
                  <li key={item.role}>
                    <Role $color={ROLE_COLORS[item.role] || GOLD}>{item.role}</Role>
                    <ul>{item.text.map(line => <li key={line}><TermText text={line} dungeon={dungeon} /></li>)}</ul>
                  </li>
                ))}
              </Tips>
              <PhaseHead>전투 흐름<small>{boss.steps.length}단계 · 도식은 배치 예시</small></PhaseHead>
              <Steps data-steps={boss.id}>
                {boss.steps.map((step, index) => (
                  <Step key={step.title + index} $color={dungeon.color} data-step={index + 1} data-no-figure={step.figure ? undefined : ''}>
                    <PlanFigure dungeonId={dungeon.id} figure={step.figure} width={960} ratio="1100 / 748" title={`${boss.name} ${index + 1}`} caption={step.title} onZoom={setZoom} label="도식" />
                    <StepNum aria-hidden="true">{index + 1}</StepNum>
                    <div>
                      <h5>{step.title}</h5>
                      <p><TermText text={step.text} dungeon={dungeon} /></p>
                    </div>
                  </Step>
                ))}
              </Steps>
              {boss.danger ? <Danger data-danger=""><b>위험한 구간</b><TermText text={boss.danger} dungeon={dungeon} /></Danger> : null}
              {boss.keySpells.length ? (
                <>
                  <PhaseHead>핵심 스킬<small>{boss.keySpells.length}개 · 마우스를 올리면 한국어 툴팁</small></PhaseHead>
                  <SpellStrip aria-label={`${boss.name} 핵심 스킬`} data-key-spells={boss.id}>
                    {boss.keySpells.map(id => <li key={id}><SpellLink dungeon={dungeon} id={id} /></li>)}
                  </SpellStrip>
                </>
              ) : null}
            </Boss>
          ))}

          <Section id={`${dungeon.id}-pulls`} aria-labelledby={`${dungeon.id}-pulls-title`} data-section="pulls">
            <SubHead id={`${dungeon.id}-pulls-title`}><KeyRound size={16} aria-hidden="true" />풀링 순서<small>{dungeon.pulls.length}개 · 지도를 누르면 크게</small></SubHead>
            <MinorHead>표시<small>스킬 칩의 색은 할 일입니다</small></MinorHead>
            <SpellStrip aria-label="표시 뜻" style={{ marginTop: 8 }}>
              {Object.entries(mythicPlusGuide.legend).map(([tag, meaning]) => (
                <li key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#aeb8be', fontSize: '0.8rem' }}><Tag $color={TAG_COLORS[tag]}>{tag}</Tag>{meaning}</li>
              ))}
            </SpellStrip>
            <Pulls data-pulls={dungeon.id}>
              {dungeon.pulls.map(pull => <PullCard key={pull.n} dungeon={dungeon} pull={pull} onZoom={setZoom} playFrom={playFrom} />)}
            </Pulls>
          </Section>

          <Section id={`${dungeon.id}-sources`} aria-labelledby={`${dungeon.id}-sources-title`} data-section="sources">
            <SubHead id={`${dungeon.id}-sources-title`}>근거<small>{dungeon.sources.length}곳</small></SubHead>
            <SourceList>
              {dungeon.sources.map(source => (
                <li key={source.href + source.title}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a>{source.note ? <> — {source.note}</> : null}</li>
              ))}
            </SourceList>
          </Section>

          <Footer>
            <NextPanel>
              <div>
                <h2>레이드도 준비한다면</h2>
                <p>레이드 가이드에는 한밤 시즌 2 신화·영웅 네임드 택틱을 배치도와 함께 적었습니다. 내 전문화의 쐐기 운용은 직업 가이드의 실전 부에서 봅니다.</p>
              </div>
              <NextLink to="/raid">레이드 가이드 보기 <ArrowRight size={16} aria-hidden="true" /></NextLink>
            </NextPanel>
            <Basis>
              <summary><Castle size={15} aria-hidden="true" />이 글의 기준과 한계 · 참고 자료 전체</summary>
              <ul>
                {Object.entries(mythicPlusGuide.sources).map(([key, source]) => (
                  <li key={key}><a href={source.href} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={11} aria-hidden="true" style={{ marginLeft: 4, verticalAlign: '-1px' }} /></a> — {source.note}</li>
                ))}
              </ul>
            </Basis>
          </Footer>
        </Main>
      </Body>
      <PlanLightbox zoom={zoom} onClose={closeZoom} />
    </Page>
  );
}

export default MythicPlusGuidePage;
