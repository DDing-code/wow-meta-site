import React from 'react';
import styled from 'styled-components';
import { ArrowDown, Check, HeartPulse, Shield, Swords, Users } from 'lucide-react';

// 초보자 안내의 영역마다 글 앞에 두는 '한눈에 보기' 그림. 자료는 src/data/beginnerGuide.js의 beginnerMaps에 있고 여기에는 모양만 둔다.
// 기존 페이지의 평면 언어(어두운 배경·금색 강조·1px 구분선·각진 모서리)를 그대로 쓴다. 장비 설명 그림의 번호 상자는 주문 창 그림(CraftingScreens)과 같은 주황색이다.

const GOLD = '#d2b373';
const LINE = 'rgba(168, 178, 188, 0.14)';
const LINE_STRONG = 'rgba(168, 178, 188, 0.2)';
const PANEL = 'rgba(13, 18, 22, 0.62)';
const INK = '#0f1419';
const CALL = '#ff7a59';
const ROLE = { tank: '#8fb8dc', healer: '#8fd39a', dps: '#e08a7a' };
const ROLE_ICON = { tank: Shield, healer: HeartPulse, dps: Swords };
const iconUrl = name => `https://wow.zamimg.com/images/wow/icons/medium/${name}.jpg`;

const Frame = styled.div`
  margin-top: 20px;
  padding: 16px 20px 20px;
  border: 1px solid ${LINE_STRONG};
  background: ${PANEL};
  box-shadow: inset 0 2px 0 ${GOLD};
  @media (max-width: 560px) { padding: 14px 14px 16px; }
`;
const FrameHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  margin-bottom: 14px;
  b { color: ${GOLD}; font-size: 0.72rem; font-weight: 750; letter-spacing: 0.04em; }
  h3 { color: #eef1f3; font-size: 1.02rem; font-weight: 720; line-height: 1.4; }
`;
const Caption = styled.p`
  margin-top: 12px;
  color: #98a6af;
  font-size: 0.8rem;
  line-height: 1.65;
`;
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;
const ChipLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 28px;
  padding: 2px 8px 2px 9px;
  border: 1px solid rgba(210, 179, 115, 0.35);
  color: #d4cdbd;
  font-size: 0.76rem;
  font-weight: 650;
  line-height: 1.4;
  svg { flex: 0 0 auto; color: ${GOLD}; }
  &:hover, &:focus-visible { border-color: ${GOLD}; color: #eef1f3; background: rgba(210, 179, 115, 0.08); }
`;
const Two = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 28px;
  @media (max-width: 760px) { grid-template-columns: minmax(0, 1fr); }
`;
const Block = styled.div`
  min-width: 0;
  h4 { margin-bottom: 12px; color: #c6d0d6; font-size: 0.84rem; font-weight: 700; }
`;

// 1. 역할과 파티
const Tree = styled.div`
  padding: 12px 12px 14px;
  border: 1px solid ${LINE_STRONG};
  background: ${INK};
  > b { display: block; color: #eef1f3; font-size: 0.9rem; }
  > b small { margin-left: 8px; color: #8f9aa2; font-weight: 500; }
`;
const Specs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  align-items: start;
  margin-top: 10px;
`;
const Spec = styled.div`
  display: grid;
  gap: 8px;
  padding: 8px 8px 10px;
  border: 1px solid ${props => (props.$picked ? GOLD : LINE_STRONG)};
  background: ${props => (props.$picked ? 'rgba(210, 179, 115, 0.07)' : 'transparent')};
  color: ${props => (props.$picked ? '#eef1f3' : '#8f9aa2')};
  font-size: 0.84rem;
  font-weight: 700;
  text-align: center;
  > small { display: block; margin-top: -4px; color: ${GOLD}; font-size: 0.66rem; font-weight: 650; }
  > span { padding: 6px 4px; border: 1px dashed rgba(210, 179, 115, 0.45); color: #d4cdbd; font-size: 0.74rem; font-weight: 650; }
`;
const Party = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
`;
const Slot = styled.div`
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 10px 4px 8px;
  border: 1px solid ${LINE_STRONG};
  border-top: 2px solid ${props => ROLE[props.$role]};
  background: ${INK};
  color: ${props => ROLE[props.$role]};
  font-size: 0.72rem;
  font-weight: 700;
  span { color: #c6d0d6; }
`;
const Roles = styled.div`
  display: grid;
  margin-top: 12px;
  border-top: 1px solid ${LINE};
`;
const RoleRow = styled.a`
  display: grid;
  grid-template-columns: 24px auto minmax(0, 1fr) 14px;
  gap: 10px;
  align-items: center;
  min-height: 44px;
  padding: 6px 2px;
  border-bottom: 1px solid ${LINE};
  color: #aeb8be;
  font-size: 0.82rem;
  svg:first-child { color: ${props => ROLE[props.$role]}; }
  b { color: #eef1f3; font-size: 0.9rem; }
  svg:last-child { color: ${GOLD}; opacity: 0; transition: opacity 120ms ease; }
  &:hover svg:last-child, &:focus-visible svg:last-child { opacity: 1; }
  &:hover { color: #eef1f3; }
`;

// 2. 전투 흐름과 시간
const Flow = styled.ol`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  &::before { content: ''; position: absolute; top: 9px; left: 0; right: 0; border-top: 1px solid rgba(210, 179, 115, 0.5); }
  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    padding-left: 20px;
    &::before { top: 0; bottom: 0; left: 9px; right: auto; border-top: 0; border-left: 1px solid rgba(210, 179, 115, 0.5); }
  }
`;
const Stage = styled.li`
  position: relative;
  min-width: 0;
  padding: 24px 0 0;
  &::before { content: ''; position: absolute; top: 3px; left: 0; width: 11px; height: 11px; border: 1px solid ${GOLD}; background: ${INK}; transform: rotate(45deg); }
  > b { display: block; color: #eef1f3; font-size: 0.92rem; }
  > b i { margin-right: 6px; color: ${GOLD}; font-size: 0.74rem; font-style: normal; font-variant-numeric: tabular-nums; }
  > span { display: block; margin-top: 2px; color: #98a6af; font-size: 0.78rem; line-height: 1.5; }
  @media (max-width: 900px) {
    padding: 0 0 16px;
    &::before { top: 5px; left: -25px; }
    &:last-child { padding-bottom: 0; }
  }
`;
const Clock = styled.div`
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid ${LINE};
  h4 { margin-bottom: 10px; color: #c6d0d6; font-size: 0.84rem; font-weight: 700; }
`;
const ClockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$slots}, minmax(0, 1fr));
  gap: 6px 3px;
  padding: 10px;
  border: 1px solid ${LINE_STRONG};
  background: ${INK};
`;
const Bar = styled.a`
  grid-column: ${props => `1 / span ${props.$span}`};
  display: flex;
  align-items: center;
  min-height: 26px;
  padding: 0 8px;
  border-left: 3px solid ${props => props.$color};
  background: ${props => props.$bg};
  color: #eef1f3;
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover, &:focus-visible { color: ${GOLD}; }
  /* 좁은 화면에서는 한 칸이 30px 남짓이라 글자가 잘린다. 막대는 최소 두 칸을 차지하고 글자를 줄인다. */
  @media (max-width: 560px) { grid-column: ${props => `1 / span ${Math.max(props.$span, 2)}`}; padding: 0 5px; font-size: 0.7rem; }
`;
const Tail = styled.span`
  grid-column: ${props => `${props.$from} / -1`};
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 26px;
  padding-left: 6px;
  color: #8f9aa2;
  font-size: 0.72rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &::before { content: ''; flex: 1 1 8px; max-width: 28px; border-top: 1px dashed rgba(168, 178, 188, 0.4); }
  @media (max-width: 560px) { grid-column: ${props => `${Math.max(props.$from, 3)} / -1`}; font-size: 0.68rem; white-space: normal; line-height: 1.3; &::before { flex-basis: 6px; max-width: 12px; } }
`;
const Tick = styled.div`
  display: grid;
  place-items: center;
  min-width: 0;
  height: 30px;
  border: 1px solid rgba(210, 179, 115, 0.4);
  background: rgba(210, 179, 115, 0.08);
  color: ${GOLD};
  font-size: 0.7rem;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
`;
const Axis = styled.a`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
  color: #98a6af;
  font-size: 0.74rem;
  b { color: #d4cdbd; font-weight: 650; }
  &:hover b, &:focus-visible b { color: ${GOLD}; }
`;

// 3. 콘텐츠 사다리
const Ladder = styled.ol`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
  align-items: end;
  margin: 0;
  padding: 0;
  list-style: none;
  @media (max-width: 720px) { grid-template-columns: minmax(0, 1fr); align-items: stretch; }
`;
const Rung = styled.li`
  display: grid;
  align-content: start;
  gap: 6px;
  min-width: 0;
  min-height: ${props => 92 + props.$index * 24}px;
  padding: 12px 10px;
  border: 1px solid ${LINE_STRONG};
  border-top: 2px solid ${GOLD};
  background: ${INK};
  > a { color: #eef1f3; font-size: 0.92rem; font-weight: 720; line-height: 1.35; }
  > a:hover, > a:focus-visible { color: ${GOLD}; }
  > a i { margin-right: 6px; color: ${GOLD}; font-size: 0.72rem; font-style: normal; font-variant-numeric: tabular-nums; }
  > span { display: inline-flex; align-items: center; gap: 5px; color: #c6d0d6; font-size: 0.78rem; font-weight: 650; }
  > span svg { color: ${GOLD}; }
  > small { color: #8f9aa2; font-size: 0.74rem; line-height: 1.5; }
  @media (max-width: 720px) {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 2px 12px;
    min-height: 0;
    margin-left: ${props => props.$index * 10}px;
    padding: 10px 12px;
    > a { grid-column: 1 / -1; }
  }
`;

// 4. 장비 설명 읽는 법
const TipLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
  gap: 20px 32px;
  align-items: start;
  @media (max-width: 760px) { grid-template-columns: minmax(0, 1fr); }
`;
const Tooltip = styled.div`
  display: grid;
  gap: 3px;
  width: min(100%, 340px);
  padding: 10px 12px 12px;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px #4a4034, 0 4px 14px rgba(0, 0, 0, 0.8);
  background: #0a0a12;
  color: #fff;
  font-size: 0.8rem;
  line-height: 1.5;
  user-select: none;
  > strong { color: #a335ee; font-size: 0.9rem; }
  span { display: block; }
  .gold { color: #ffd100; }
  .green { color: #1eff00; }
  .muted { color: #9a9284; }
  .two { display: flex; justify-content: space-between; gap: 12px; }
  .socket { display: flex; align-items: center; gap: 6px; color: #9a9284; }
  .socket i { display: inline-block; width: 13px; height: 13px; border: 1px solid #6b5733; background: radial-gradient(circle at 40% 35%, #4a4034, #16130f 70%); }
`;
const Mark = styled.div`
  position: relative;
  display: block;
  outline: 2px solid ${CALL};
  outline-offset: 2px;
  margin: 3px 0;
`;
const Badge = styled.b`
  position: absolute;
  top: 50%;
  right: -16px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${CALL};
  color: #140c08;
  font-size: 0.74rem;
  font-weight: 800;
  line-height: 1;
  transform: translateY(-50%);
`;
const Legend = styled.ol`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;
const LegendItem = styled.li`
  a { display: grid; grid-template-columns: 22px minmax(0, 1fr) 14px; gap: 10px; align-items: center; min-height: 36px; padding: 4px 6px 4px 0; border-bottom: 1px solid ${LINE}; color: #c6d0d6; font-size: 0.86rem; font-weight: 650; }
  a b { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: ${CALL}; color: #140c08; font-size: 0.74rem; font-weight: 800; }
  a svg { color: ${GOLD}; opacity: 0; }
  a:hover, a:focus-visible { color: #eef1f3; }
  a:hover svg, a:focus-visible svg { opacity: 1; }
`;

// 5. 소모품 타이밍
const Timeline = styled.ol`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  &::before { content: ''; position: absolute; top: 9px; left: 0; right: 0; border-top: 1px solid rgba(210, 179, 115, 0.5); }
  @media (max-width: 760px) { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 12px; &::before { display: none; } }
  @media (max-width: 440px) { grid-template-columns: minmax(0, 1fr); }
`;
const Stop = styled.li`
  position: relative;
  min-width: 0;
  padding-top: 26px;
  &::before { content: ''; position: absolute; top: 3px; left: 0; width: 11px; height: 11px; border: 1px solid ${GOLD}; background: ${INK}; transform: rotate(45deg); }
  > b { display: block; color: ${GOLD}; font-size: 0.78rem; font-weight: 750; letter-spacing: 0.02em; }
  > p { margin-top: 8px; color: #aeb8be; font-size: 0.8rem; line-height: 1.6; }
  @media (max-width: 760px) { padding-top: 0; &::before { display: none; } > b { padding-bottom: 6px; border-bottom: 1px solid rgba(210, 179, 115, 0.4); } }
`;
const Icons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  img { width: 34px; height: 34px; border: 1px solid #59636b; background: #000; }
`;

// 6. 주문제작 단계 지도
const Phases = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  @media (max-width: 900px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 480px) { grid-template-columns: minmax(0, 1fr); }
`;
const Phase = styled.li`
  min-width: 0;
  padding: 12px 12px 8px;
  border: 1px solid ${LINE_STRONG};
  border-top: 2px solid ${GOLD};
  background: ${INK};
  > b { display: block; margin-bottom: 8px; color: #eef1f3; font-size: 0.88rem; }
  > b i { margin-right: 6px; color: ${GOLD}; font-size: 0.72rem; font-style: normal; }
  ol { margin: 0; padding: 0; list-style: none; }
`;
const StepLink = styled.a`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 2px 8px;
  align-items: center;
  min-height: 44px;
  padding: 6px 0;
  border-top: 1px solid ${LINE};
  color: #c6d0d6;
  font-size: 0.82rem;
  font-weight: 650;
  line-height: 1.4;
  > b { grid-row: span 2; color: ${GOLD}; font-size: 1.05rem; font-weight: 800; font-variant-numeric: tabular-nums; }
  > small { color: #8f9aa2; font-size: 0.72rem; font-weight: 500; }
  &:hover, &:focus-visible { color: #eef1f3; }
  &:hover > b, &:focus-visible > b { color: #eef1f3; }
`;

// 7. 출발 준비 진행
const Progress = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 6px 16px;
  align-items: center;
  > strong { color: #eef1f3; font-size: 1.3rem; font-weight: 800; font-variant-numeric: tabular-nums; }
  > strong small { margin-left: 4px; color: #8f9aa2; font-size: 0.8rem; font-weight: 600; }
  @media (max-width: 440px) { grid-template-columns: minmax(0, 1fr); }
`;
const Segments = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$total}, minmax(0, 1fr));
  gap: 4px;
  > i { display: grid; place-items: center; height: 24px; border: 1px solid ${LINE_STRONG}; color: #0a0d10; transition: background 160ms ease; }
  > i[data-on='true'] { background: ${GOLD}; border-color: ${GOLD}; }
`;

function Chip({ href, children }) {
  return <ChipLink href={href}>{children}<ArrowDown size={12} aria-hidden="true" /></ChipLink>;
}

function Call({ n, children }) {
  return <Mark data-map-callout={n}><Badge aria-hidden="true">{n}</Badge>{children}</Mark>;
}

function BasicsMap({ map, hrefFor }) {
  const { structure, roles, party } = map;
  return (
    <Two>
      <Block>
        <h4>직업 안에서 고르는 것</h4>
        <Tree>
          <b>{structure.className}<small>{structure.classExample}</small></b>
          <Specs>{structure.specs.map(spec => (
            <Spec key={spec.name} $picked={spec.picked}>
              {spec.name}
              {spec.picked ? <small>고른 전문화</small> : null}
              {spec.picked ? structure.inside.map(name => <span key={name}>{name}</span>) : null}
            </Spec>
          ))}</Specs>
        </Tree>
        <Caption>{structure.caption}</Caption>
        <Chips><Chip href={hrefFor(structure.term)}>{structure.term}</Chip></Chips>
      </Block>
      <Block>
        <h4>{party.title}의 역할</h4>
        <Party aria-label={`${party.title} 구성`}>{party.slots.map((role, index) => {
          const Icon = ROLE_ICON[role];
          const name = roles.find(item => item.id === role).name;
          return <Slot key={`${role}-${index}`} $role={role}><Icon size={22} strokeWidth={1.75} aria-hidden="true" /><span>{name}</span></Slot>;
        })}</Party>
        <Roles>{roles.map(role => {
          const Icon = ROLE_ICON[role.id];
          return <RoleRow key={role.id} href={hrefFor(role.term)} $role={role.id}><Icon size={18} strokeWidth={1.75} aria-hidden="true" /><b>{role.name}</b><span>{role.job}</span><ArrowDown size={14} aria-hidden="true" /></RoleRow>;
        })}</Roles>
        <Caption>{party.caption}</Caption>
      </Block>
    </Two>
  );
}

function CombatMap({ map, hrefFor }) {
  const { stages, clock } = map;
  const ticks = Array.from({ length: clock.slots }, (_, index) => index + 1);
  return (
    <>
      <Flow aria-label="전투 한 판의 흐름">{stages.map((stage, index) => (
        <Stage key={stage.title}>
          <b><i>{index + 1}</i>{stage.title}</b>
          <span>{stage.text}</span>
          <Chips>{stage.terms.map(term => <Chip key={term} href={hrefFor(term)}>{term}</Chip>)}</Chips>
        </Stage>
      ))}</Flow>
      <Clock>
        <h4>{clock.title}</h4>
        <ClockGrid $slots={clock.slots} aria-label={clock.title}>
          {clock.rows.map((row, index) => (
            <React.Fragment key={row.label}>
              <Bar href={hrefFor(row.term)} $span={row.span} $color={index === 0 ? CALL : '#8fb8dc'} $bg={index === 0 ? 'rgba(255, 122, 89, 0.14)' : 'rgba(143, 184, 220, 0.14)'}>{row.label}</Bar>
              <Tail $from={row.span + 1}>{row.tail}</Tail>
            </React.Fragment>
          ))}
          {ticks.map(tick => <Tick key={tick} aria-hidden="true">{tick}</Tick>)}
        </ClockGrid>
        <Axis href={hrefFor(clock.slotTerm)}><b>{clock.slotLabel}</b><span>0초 → 12초</span></Axis>
      </Clock>
    </>
  );
}

function ContentMap({ map, hrefFor }) {
  return (
    <>
      <Ladder aria-label="콘텐츠 사다리">{map.ladder.map((rung, index) => (
        <Rung key={rung.name} $index={index}>
          <a href={hrefFor(rung.term)}><i>{index + 1}</i>{rung.name}</a>
          <span><Users size={14} strokeWidth={2} aria-hidden="true" />{rung.people}</span>
          <small>{rung.note}</small>
        </Rung>
      ))}</Ladder>
      <Caption>{map.caption}</Caption>
      <Chips>{map.sideTerms.map(term => <Chip key={term} href={hrefFor(term)}>{term}</Chip>)}</Chips>
    </>
  );
}

function EquipmentMap({ map, hrefFor }) {
  return (
    <>
      <TipLayout>
        <Tooltip role="img" aria-label="장비 설명 창을 본뜬 예시 그림. 번호는 오른쪽 목록과 같습니다.">
          <strong>수호자의 판금 흉갑 (예시)</strong>
          <Call n={1}><span className="gold">아이템 레벨 272</span></Call>
          <Call n={2}><span>영웅 2/6</span></Call>
          <Call n={3}><span>획득 시 귀속</span></Call>
          <span className="two"><span>가슴</span><span>판금</span></span>
          <span>방어도 1,204</span>
          <Call n={4}><span>힘 +1,532</span></Call>
          <span>체력 +4,596</span>
          <Call n={5}><span className="green">+612 치명타 및 극대화</span><span className="green">+410 가속</span></Call>
          <Call n={6}><span className="socket"><i aria-hidden="true" />보석 홈</span><span className="green">마법부여: 세계혼의 징표</span></Call>
          <Call n={7}><span className="gold">수호자의 전투 장비 (1/5)</span><span className="muted">(2) 세트: 전문화 효과 (예시)</span><span className="muted">(4) 세트: 전문화 효과 (예시)</span></Call>
          <span>내구도 165 / 165</span>
        </Tooltip>
        <Legend aria-label="장비 설명에서 보는 곳">{map.callouts.map(item => (
          <LegendItem key={item.n}><a href={hrefFor(item.term)}><b aria-hidden="true">{item.n}</b>{item.label}<ArrowDown size={14} aria-hidden="true" /></a></LegendItem>
        ))}</Legend>
      </TipLayout>
      <Caption>{map.note}</Caption>
      <Chips>{map.extraTerms.map(term => <Chip key={term} href={hrefFor(term)}>{term}</Chip>)}</Chips>
    </>
  );
}

function ConsumablesMap({ map, hrefFor, groups }) {
  const byId = new Map(groups.map(group => [group.id, group]));
  return (
    <Timeline aria-label="소모품을 쓰는 때">{map.timeline.map(stop => (
      <Stop key={stop.when}>
        <b>{stop.when}</b>
        <Icons>{stop.groups.map(id => byId.get(id)).filter(Boolean).map(group => (
          <img key={group.id} src={iconUrl(group.items[0].icon)} alt="" title={group.title} width="34" height="34" loading="lazy" />
        ))}</Icons>
        <p>{stop.text}</p>
        <Chips>{stop.terms.map(term => <Chip key={term} href={hrefFor(term)}>{term}</Chip>)}</Chips>
      </Stop>
    ))}</Timeline>
  );
}

export function parseStep(term) {
  const match = /^(\d{2}) · (.+)$/.exec(term);
  return match ? { number: match[1], title: match[2] } : null;
}

function CraftingMap({ map, hrefFor, entries }) {
  const steps = new Map(entries.map(entry => [parseStep(entry.term)?.number, entry]).filter(([number]) => number));
  return (
    <Phases aria-label="주문제작 열 단계">{map.phases.map((phase, index) => (
      <Phase key={phase.title}>
        <b><i>{index + 1}단계</i>{phase.title}</b>
        <ol>{phase.steps.map(number => {
          const entry = steps.get(number);
          if (!entry) return null;
          return <li key={number}><StepLink href={hrefFor(entry.term)}><b>{number}</b><span>{parseStep(entry.term).title}</span><small>{entry.when}</small></StepLink></li>;
        })}</ol>
      </Phase>
    ))}</Phases>
  );
}

function ReadyMap({ map, done, total }) {
  return (
    <>
      <Progress>
        <strong aria-live="polite">{done}<small>/ {total} 확인</small></strong>
        <Segments $total={total} aria-hidden="true">{Array.from({ length: total }, (_, index) => <i key={index} data-on={index < done ? 'true' : 'false'}>{index < done ? <Check size={14} strokeWidth={3} /> : null}</i>)}</Segments>
      </Progress>
      <Caption>{map.caption}</Caption>
    </>
  );
}

const titles = {
  basics: '역할과 파티 한눈에',
  combat: '전투 한 판의 흐름',
  content: '혼자서부터 공격대까지',
  equipment: '장비 설명(툴팁)에서 보는 곳',
  consumables: '언제 무엇을 쓰나',
  crafting: '열 단계 지도',
  ready: '출발 준비',
};

export function SectionMap({ id, map, hrefFor, groups, entries, done, total }) {
  if (!map) return null;
  let body = null;
  if (id === 'basics') body = <BasicsMap map={map} hrefFor={hrefFor} />;
  else if (id === 'combat') body = <CombatMap map={map} hrefFor={hrefFor} />;
  else if (id === 'content') body = <ContentMap map={map} hrefFor={hrefFor} />;
  else if (id === 'equipment') body = <EquipmentMap map={map} hrefFor={hrefFor} />;
  else if (id === 'consumables') body = <ConsumablesMap map={map} hrefFor={hrefFor} groups={groups} />;
  else if (id === 'crafting') body = <CraftingMap map={map} hrefFor={hrefFor} entries={entries} />;
  else if (id === 'ready') body = <ReadyMap map={map} done={done} total={total} />;
  else return null;
  return (
    <Frame data-map={id}>
      <FrameHead><b>한눈에 보기</b><h3>{titles[id]}</h3></FrameHead>
      {body}
    </Frame>
  );
}

export default SectionMap;
