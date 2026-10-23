import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, Castle, Check, ExternalLink, ListChecks, Users, X, Youtube } from 'lucide-react';
import raidGuide from '../data/raidGuide.json';
import kbSkills from '../data/kb-skills.json';
import { CURRENT_PATCH_LABEL } from '../data/guideRegistry.js';

// 레이드 가이드. 글은 KB 정본(00-공통/공용/Meta/raid-guide.json)에서 sync-kb로 받은 raidGuide.json을 그대로 보여 준다.
// 디자인은 초보자 안내와 같은 평면 언어(어두운 배경, 금색 강조, 1px 구분선, 각진 모서리)를 쓴다.
const GOLD = '#d2b373';
const LINE = 'rgba(168, 178, 188, 0.14)';
const LINE_STRONG = 'rgba(168, 178, 188, 0.2)';
const PANEL = 'rgba(13, 18, 22, 0.62)';

// 단계 카드의 종류 표시. 신화 전용 기믹, 미리 정할 배정, 공대마다 갈리는 선택 택틱을 색으로 구분한다.
const KIND_COLORS = { '공통': '#9aa5ad', '신화': '#c9a0ff', '배정': '#7fb7d9', '선택 택틱': '#e0a060' };

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
  margin-top: 30px;
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
const EpisodeHead = styled.section`
  display: grid;
  grid-template-columns: 6px minmax(0, 1fr);
  gap: 18px;
  margin-top: 34px;
  > span { background: ${props => props.$color}; }
  h2 { color: #eef1f3; font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.2; }
  h2 small { margin-left: 10px; color: #8f9aa2; font-size: 0.82rem; font-weight: 600; }
`;
const Principle = styled.p`
  margin-top: 10px;
  color: ${GOLD};
  font-size: clamp(1.02rem, 2vw, 1.22rem);
  font-weight: 720;
  line-height: 1.5;
`;
const Scope = styled.p`
  max-width: 74ch;
  margin-top: 8px;
  color: #aeb8be;
  font-size: 0.9rem;
  line-height: 1.72;
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
const PhaseLinks = styled.ol`
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
  a { display: block; padding: 5px 0 5px 12px; color: #8f9aa2; font-size: 0.78rem; line-height: 1.5; }
  a:hover { color: #eef1f3; }
  @media (max-width: 900px) { display: none; }
`;
const Main = styled.div`
  min-width: 0;
`;
const Boss = styled.section`
  min-width: 0;
  padding-bottom: 48px;
  & + & { padding-top: 44px; border-top: 1px solid rgba(168, 178, 188, 0.13); }
`;
const BossHead = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 6px 16px;
  align-items: end;
  h2 { padding-bottom: 6px; color: #eef1f3; font-size: clamp(1.34rem, 2.4vw, 1.72rem); line-height: 1.3; }
  h2 small { display: block; margin-top: 2px; color: ${GOLD}; font-size: 0.74rem; font-weight: 700; letter-spacing: 0.04em; }
`;
// 네임드 스프라이트(스토리보드 도트, 투명 배경). 여럿이면 조금씩 겹쳐 한 무리로 보이게 한다.
const BossSprites = styled.div`
  display: flex;
  align-items: flex-end;
  min-width: 88px;
  height: 88px;
  padding: 0 4px;
  border-bottom: 2px solid ${props => props.$color};
  img { width: 88px; height: 88px; image-rendering: pixelated; filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.55)); }
  img + img { margin-left: -26px; }
  @media (max-width: 560px) { min-width: 64px; height: 64px; img { width: 64px; height: 64px; } img + img { margin-left: -20px; } }
`;
// 위에서 본 배치도. 누르면 큰 그림으로 연다.
const Figure = styled.figure`
  min-width: 0;
  margin: ${props => (props.$wide ? '18px 0 0' : '0')};
  button { display: block; width: 100%; padding: 0; border: 1px solid ${LINE_STRONG}; background: #0a0e11; cursor: zoom-in; }
  button:hover, button:focus-visible { border-color: ${GOLD}; }
  img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; }
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
const Summary = styled.p`
  max-width: 74ch;
  margin-top: 16px;
  color: #c6d0d6;
  font-size: 0.98rem;
  line-height: 1.78;
  text-wrap: pretty;
`;
const Checks = styled.ul`
  display: grid;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid ${LINE_STRONG};
  background: ${PANEL};
  box-shadow: inset 0 2px 0 ${GOLD};
  li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 10px; align-items: start; padding: 11px 16px; color: #e3e7ea; font-size: 0.9rem; line-height: 1.6; }
  li + li { border-top: 1px solid ${LINE}; }
  li > span:first-child { display: grid; place-items: center; width: 22px; height: 22px; margin-top: 1px; border: 1px solid rgba(210, 179, 115, 0.5); color: ${GOLD}; }
`;
const ChecksTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 26px;
  color: #eef1f3;
  font-size: 0.86rem;
  font-weight: 720;
  letter-spacing: 0.02em;
  svg { color: ${GOLD}; }
`;
const PhaseHead = styled.h3`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 30px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${LINE_STRONG};
  color: #eef1f3;
  font-size: 1.06rem;
  font-weight: 720;
  b { color: ${GOLD}; font-size: 0.74rem; font-weight: 750; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
`;
const Steps = styled.ol`
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  container-type: inline-size;
`;
// 그림이 있는 행동은 넓은 화면에서 왼쪽 배치도·오른쪽 글, 좁은 화면에서 그림 → 글 순서로 쌓는다.
const Step = styled.li`
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  grid-template-areas: 'kind body';
  gap: 4px 16px;
  padding: 14px 18px 14px 14px;
  border: 1px solid ${LINE_STRONG};
  border-left: 3px solid ${props => props.$color};
  background: ${PANEL};
  > figure { grid-area: fig; }
  > span { grid-area: kind; }
  > div { grid-area: body; min-width: 0; }
  h4 { color: #eef1f3; font-size: 0.98rem; font-weight: 720; line-height: 1.45; }
  p { margin-top: 6px; color: #c3cbd0; font-size: 0.88rem; line-height: 1.72; text-wrap: pretty; }
  @media (max-width: 560px) { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'kind' 'body'; gap: 6px; padding: 12px 14px 12px 12px; }

  &[data-figure] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'fig' 'kind' 'body';
    gap: 10px;
    padding: 12px;
  }
  @container (min-width: 640px) {
    &[data-figure] {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
      grid-template-rows: auto 1fr;
      grid-template-areas: 'fig kind' 'fig body';
      gap: 8px 18px;
      padding: 12px 18px 12px 12px;
    }
  }
`;
const Kind = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: start;
  width: fit-content;
  min-width: 56px;
  margin-top: 2px;
  padding: 2px 8px;
  border: 1px solid ${props => props.$color};
  color: ${props => props.$color};
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;
const StepNote = styled.p`
  && { margin-top: 8px; padding-top: 7px; border-top: 1px dashed rgba(168, 178, 188, 0.22); color: #a4b0b8; font-size: 0.8rem; line-height: 1.6; }
  b { margin-right: 8px; color: ${GOLD}; font-size: 0.72rem; font-weight: 750; }
`;
const SubHead = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  color: #eef1f3;
  font-size: 1.06rem;
  font-weight: 720;
  small { color: #7f8b94; font-size: 0.78rem; font-weight: 650; font-variant-numeric: tabular-nums; }
  svg { color: ${GOLD}; }
`;
const Tips = styled.ul`
  display: grid;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${LINE_STRONG};
  li { display: grid; grid-template-columns: 104px minmax(0, 1fr); gap: 4px 14px; align-items: start; padding: 11px 0; border-bottom: 1px solid rgba(168, 178, 188, 0.11); }
  li p { color: #c3cbd0; font-size: 0.88rem; line-height: 1.68; text-wrap: pretty; }
  @media (max-width: 560px) { li { grid-template-columns: minmax(0, 1fr); gap: 4px; } }
`;
const Role = styled.span`
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  margin-top: 2px;
  padding: 2px 8px;
  border: 1px solid rgba(210, 179, 115, 0.4);
  color: ${GOLD};
  font-size: 0.74rem;
  font-weight: 720;
  line-height: 1.5;
  white-space: nowrap;
`;
const TipSource = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  color: #8f9aa2;
  font-size: 0.76rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  &:hover { color: ${GOLD}; }
`;
const ChoicesLead = styled.p`
  margin-top: 8px;
  color: #a4b0b8;
  font-size: 0.84rem;
  line-height: 1.6;
`;
const Choices = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 12px;
  @media (min-width: 761px) { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
`;
const Choice = styled.div`
  padding: 14px 16px;
  border: 1px solid ${LINE_STRONG};
  border-top: 2px solid ${KIND_COLORS['선택 택틱']};
  background: ${PANEL};
  h4 { color: #eef1f3; font-size: 0.94rem; font-weight: 720; }
  dl { margin-top: 10px; display: grid; gap: 8px; }
  dt { color: ${GOLD}; font-size: 0.72rem; font-weight: 750; letter-spacing: 0.03em; }
  dd { margin-top: 2px; color: #c3cbd0; font-size: 0.86rem; line-height: 1.65; }
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
  min-height: 44px;
  padding: 6px 12px 6px 6px;
  border: 1px solid ${LINE_STRONG};
  background: ${PANEL};
  color: #e7c46f;
  font-size: 0.86rem;
  font-weight: 680;
  img { width: 30px; height: 30px; border: 1px solid #59636b; }
  &:hover { border-color: ${GOLD}; color: #f7dda0; }
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

// 스토리보드 배치도·스프라이트(public/images/raid). 정본의 figure.plan 이 컷 번호다.
const PLAN = (key, width) => `/images/raid/plan/${key}-${width}.webp`;
const SPRITE = id => `/images/raid/sprites/${id}.webp`;

function PlanFigure({ figure, title, onZoom, wide = false, label = '배치도' }) {
  if (!figure) return null;
  const alt = `${title} 배치도 — ${figure.caption}`;
  return (
    <Figure $wide={wide} data-plan={figure.plan}>
      <button type="button" onClick={() => onZoom({ ...figure, title, alt })} aria-label={`${alt} 크게 보기`}>
        <img
          src={PLAN(figure.plan, 960)}
          srcSet={`${PLAN(figure.plan, 960)} 960w, ${PLAN(figure.plan, 1600)} 1600w`}
          sizes={wide ? '(max-width: 900px) 100vw, 852px' : '(max-width: 700px) 100vw, 420px'}
          alt={alt}
          width="960"
          height="540"
          loading="lazy"
          decoding="async"
        />
      </button>
      <figcaption><b>{label}</b>{figure.caption}</figcaption>
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
        <img src={PLAN(zoom.plan, 1600)} alt={zoom.alt} width="1600" height="900" />
        <figcaption><b>{zoom.title}</b>{zoom.caption}</figcaption>
      </figure>
    </Lightbox>
  );
}

const ICON = icon => `https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`;
const wowhead = id => `https://ko.wowhead.com/spell=${id}`;

// 본문에서 이름을 찾으면 아이콘·한국어 공식 툴팁 링크로 바꿀 낱말. 직업 스킬은 KB에서 아이콘을 받고, 네임드 기술은 정본의 아이콘을 쓴다.
const kbByName = new Map(Object.values(kbSkills.skills || {}).map(skill => [skill.koreanName || skill.name, skill]));
const playerTerms = raidGuide.skills.map(({ name, id }) => {
  const skill = kbByName.get(name);
  return { name, id: String(id), icon: skill?.icon || skill?.iconName || '' };
});
const spellTerms = raidGuide.spells.map(spell => ({ ...spell, id: String(spell.id) }));
const termsCache = new Map();
function termsFor(bossId) {
  if (!termsCache.has(bossId)) {
    termsCache.set(bossId, [...playerTerms, ...spellTerms.filter(spell => spell.boss === bossId)].sort((a, b) => b.name.length - a.name.length));
  }
  return termsCache.get(bossId);
}

// 글 속의 스킬·기술 이름을 아이콘이 붙은 툴팁 링크로 바꾼다. 긴 이름을 먼저 찾아 '영혼 절단' 안의 '절단'을 따로 잡지 않는다.
export function TermText({ text, bossId }) {
  const terms = termsFor(bossId);
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
    // 바로 뒤에 붙은 조사·문장부호는 이름표와 같은 줄에 둔다("영혼결속 / 으로"처럼 조사만 떨어지지 않게). 다음 이름표 앞에서 멈춘다.
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

function clock(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
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

export const raidEpisodes = raidGuide.episodes;
const bossCount = raidGuide.episodes.reduce((total, episode) => total + episode.bosses.length, 0);
const tipCount = raidGuide.episodes.reduce((total, episode) => total + episode.bosses.reduce((sum, boss) => sum + boss.tips.length, 0), 0);

function RaidGuidePage() {
  const { episodeId } = useParams();
  const episode = raidGuide.episodes.find(item => item.id === episodeId) || raidGuide.episodes[0];
  const active = useActiveSection(episode.bosses.map(boss => boss.id).join(' '));
  const grarl = raidGuide.sources.grarl;
  const [zoom, setZoom] = useState(null);
  const closeZoom = useCallback(() => setZoom(null), []);

  return (
    <Page>
      <Hero>
        <div>
          <Eyebrow>{raidGuide.page.eyebrow}</Eyebrow>
          <Title>{raidGuide.page.title}</Title>
          <Lead>{raidGuide.page.lead}</Lead>
        </div>
        <Metrics aria-label="레이드 가이드 범위">
          <div><dt>편</dt><dd>{raidGuide.episodes.length}편</dd></div>
          <div><dt>네임드</dt><dd>{bossCount}곳</dd></div>
          <div><dt>실전 팁</dt><dd>{tipCount}개</dd></div>
          <div><dt>기준</dt><dd>{CURRENT_PATCH_LABEL} · {raidGuide.metadata.difficulty}</dd></div>
        </Metrics>
      </Hero>
      <Notes aria-label="읽기 전에">
        {raidGuide.page.notes.map(note => <li key={note}>{note}</li>)}
      </Notes>

      <Tabs aria-label="레이드 편 선택">
        {raidGuide.episodes.map(item => (
          <Tab key={item.id} to={`/raid/${item.id}`} $active={item.id === episode.id} $color={item.color} aria-current={item.id === episode.id ? 'page' : undefined}>
            {item.label}
            <small>{item.place}</small>
          </Tab>
        ))}
      </Tabs>

      <EpisodeHead $color={episode.color} aria-labelledby="episode-title">
        <span aria-hidden="true" />
        <div>
          <h2 id="episode-title">{episode.title}<small>{episode.place}</small></h2>
          <Principle>{episode.principle}</Principle>
          <Scope>{episode.scope}</Scope>
        </div>
      </EpisodeHead>

      <Body>
        <Contents aria-label="이 편의 네임드">
          <p>이 편에서</p>
          <ContentsList>
            {episode.bosses.map(boss => (
              <ContentsGroup key={boss.id}>
                <ContentsLink href={`#${boss.id}`} $active={boss.id === active} aria-current={boss.id === active ? 'location' : undefined}>
                  {boss.name}<b>{boss.order}</b>
                </ContentsLink>
                <PhaseLinks>
                  {boss.phases.map(phase => <li key={phase.id}><a href={`#${boss.id}-${phase.id}`}>{phase.title}</a></li>)}
                  <li><a href={`#${boss.id}-tips`}>역할별 실전 팁</a></li>
                </PhaseLinks>
              </ContentsGroup>
            ))}
          </ContentsList>
        </Contents>
        <Main>
          {episode.bosses.map(boss => {
            const spells = spellTerms.filter(spell => spell.boss === boss.id);
            return (
              <Boss key={boss.id} id={boss.id} aria-labelledby={`${boss.id}-title`} data-boss={boss.id}>
                <BossHead>
                  <BossSprites $color={episode.color} aria-hidden="true">
                    {(boss.sprites || []).map(id => <img key={id} src={SPRITE(id)} alt="" width="88" height="88" loading="lazy" decoding="async" />)}
                  </BossSprites>
                  <h2 id={`${boss.id}-title`}><small>{boss.order}</small>{boss.name}</h2>
                </BossHead>
                <Summary><TermText text={boss.summary} bossId={boss.id} /></Summary>
                <PlanFigure figure={boss.figure} title={boss.name} onZoom={setZoom} wide label="전장 한눈에 보기" />
                <ChecksTitle><ListChecks size={16} aria-hidden="true" />들어가기 전 확인</ChecksTitle>
                <Checks>
                  {boss.checks.map(check => (
                    <li key={check}><span aria-hidden="true"><Check size={14} strokeWidth={2.5} /></span><span><TermText text={check} bossId={boss.id} /></span></li>
                  ))}
                </Checks>
                {boss.phases.map((phase, index) => (
                  <React.Fragment key={phase.id}>
                    <PhaseHead id={`${boss.id}-${phase.id}`}><b>{index + 1}</b>{phase.title}</PhaseHead>
                    <Steps>
                      {phase.steps.map(step => (
                        <Step key={step.title} $color={KIND_COLORS[step.kind] || KIND_COLORS['공통']} data-kind={step.kind} data-figure={step.figure ? step.figure.plan : undefined}>
                          <PlanFigure figure={step.figure} title={step.title} onZoom={setZoom} />
                          <Kind $color={KIND_COLORS[step.kind] || KIND_COLORS['공통']}>{step.kind}</Kind>
                          <div>
                            <h4>{step.title}</h4>
                            <p><TermText text={step.text} bossId={boss.id} /></p>
                            {step.note ? <StepNote><b>참고</b><TermText text={step.note} bossId={boss.id} /></StepNote> : null}
                          </div>
                        </Step>
                      ))}
                    </Steps>
                  </React.Fragment>
                ))}
                <SubHead id={`${boss.id}-tips`}><Users size={16} aria-hidden="true" />역할별 실전 팁<small>{boss.tips.length}개</small></SubHead>
                <Tips data-tips={boss.id}>
                  {boss.tips.map((tip, index) => {
                    const source = raidGuide.sources[tip.source];
                    const timed = tip.grarlSecond != null && source;
                    return (
                      <li key={`${tip.role}-${index}`}>
                        <Role>{tip.role}</Role>
                        <div>
                          <p><TermText text={tip.text} bossId={boss.id} /></p>
                          {timed ? (
                            <TipSource href={`${source.href}&t=${tip.grarlSecond}s`} target="_blank" rel="noreferrer">
                              <Youtube size={13} aria-hidden="true" />그랄 설명회 {clock(tip.grarlSecond)}
                            </TipSource>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </Tips>
                {boss.choices.length ? (
                  <>
                    <SubHead>갈리는 택틱<small>{boss.choices.length}곳 · 참고</small></SubHead>
                    <ChoicesLead data-choices-lead>공대마다 방식이 갈리는 곳입니다. 다른 안은 참고로만 보고, 실제로는 공대 배정표의 한 안을 따르세요.</ChoicesLead>
                    <Choices>
                      {boss.choices.map(choice => (
                        <Choice key={choice.title} data-choice={choice.title} data-open={choice.open ? 'true' : undefined}>
                          <h4>{choice.title}</h4>
                          <dl>
                            <div><dt>{choice.open ? '한 안' : '이 글'}</dt><dd><TermText text={choice.picked} bossId={boss.id} /></dd></div>
                            <div><dt>{choice.open ? '다른 안' : '다른 안 (참고)'}</dt><dd><TermText text={choice.alt} bossId={boss.id} /></dd></div>
                            <div><dt>왜</dt><dd><TermText text={choice.why} bossId={boss.id} /></dd></div>
                          </dl>
                        </Choice>
                      ))}
                    </Choices>
                  </>
                ) : null}
                {spells.length ? (
                  <>
                    <SubHead>네임드 기술 툴팁<small>{spells.length}개</small></SubHead>
                    <SpellStrip aria-label={`${boss.name} 기술`}>
                      {spells.map(spell => (
                        <li key={spell.id}>
                          <SpellChip href={wowhead(spell.id)} data-wowhead={`spell=${spell.id}&domain=ko`} data-wh-rename-link="false" target="_blank" rel="noreferrer" data-spell-id={spell.id}>
                            <img src={ICON(spell.icon)} alt="" width="30" height="30" loading="lazy" />{spell.name}
                          </SpellChip>
                        </li>
                      ))}
                    </SpellStrip>
                  </>
                ) : null}
                <SubHead>근거</SubHead>
                <SourceList>
                  {boss.sources.map(key => {
                    const source = raidGuide.sources[key];
                    return source ? <li key={key}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a> — {source.note}</li> : null;
                  })}
                </SourceList>
              </Boss>
            );
          })}
          <Footer>
            <NextPanel>
              <div>
                <h2>내 전문화의 레이드 운용은?</h2>
                <p>직업 가이드의 실전 부에서 레이드 딜사이클과 특성 견본을 함께 보세요.</p>
              </div>
              <NextLink to="/guide">내 직업 가이드 찾기 <ArrowRight size={16} aria-hidden="true" /></NextLink>
            </NextPanel>
            <Basis>
              <summary><Castle size={15} aria-hidden="true" />이 글의 기준과 한계 · 참고 자료 전체</summary>
              <ul>
                {raidGuide.basisNotes.map(note => <li key={note}>{note}</li>)}
              </ul>
              <ul>
                {Object.entries(raidGuide.sources).map(([key, source]) => (
                  <li key={key}><a href={source.href} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={11} aria-hidden="true" style={{ marginLeft: 4, verticalAlign: '-1px' }} /></a> — {source.note}</li>
                ))}
              </ul>
              {grarl ? <p style={{ marginTop: 10 }}>그랄 설명회 시각 링크는 {grarl.title} 영상의 해당 구간으로 이동합니다.</p> : null}
            </Basis>
          </Footer>
        </Main>
      </Body>
      <PlanLightbox zoom={zoom} onClose={closeZoom} />
    </Page>
  );
}

export default RaidGuidePage;
