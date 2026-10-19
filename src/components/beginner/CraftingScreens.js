import React from 'react';
import styled, { css } from 'styled-components';

// 주문 제작 의뢰 창을 본뜬 그림 5장.
// 배치·문구 기준: 사용자가 2026-10-19에 보낸 실제 한국어 클라이언트의 '주문 제작 의뢰' 창 캡처(주문각인 제작법 화면).
//  - 창 왼쪽 위 초상화와 빨간 '뒤로' 단추, 가운데 금색 제목, 오른쪽 위 빨간 닫기 단추, 창 아래 왼쪽 소지금.
//  - 왼쪽 판: 장비 머리글(아이콘·보라색 이름·전문 기술·☆) → '제작법 추적' → '재료 제공:'(40px 칸 + 0/10 이름 + 오른쪽 체크)
//    → '선택 재료 제공:'(초록 + 칸 가로 나열) → '최고 품질 재료 사용'.
//  - 오른쪽 판: 주문 종류 내림 목록 → 받는이 → 최소 품질(기본 '없음') → 제작 참고 사항(자리 글 '여기에 메시지를 입력하십시오.')
//    → 수수료(금·은 칸 + 망치 단추) → 기간(기본 48시간) → 게시 수수료 → 총 가격 → '주문 의뢰하기'.
//  - 고르는 재료 칸(불꽃)은 초록 + 칸을 누르면 옆에 후보 목록과 '사용 불가 아이템 숨기기'가 뜬다.
// 사진에 없는 첫 화면(제작법 목록)과 다섯째 화면(우편·설명)은 같은 창 틀만 맞췄다. 사진의 'Reagents Value' 줄은 애드온 문구라 뺐다.
// 장비·재료는 Wowhead 한국어 자료의 실제 이름(spell=1229873, 불꽃 분류 #401)이고 수치·캐릭터 이름은 예시다. 선택 재료 칸 아래 작은 이름은
// 실제 창에서는 마우스를 올렸을 때 보이는 것을 설명용으로 적어 둔 것이다.
// 각 그림의 제목·단계·번호 설명은 KB 원본 beginner-crafting.json의 screens(sync-kb → src/data/beginnerCrafting.json)에 있고, 여기에는 그림만 둔다.

const CALL = '#ff7a59';
const WOW_GOLD = '#ffd100';
const EPIC = '#a335ee';
const TEXT = '#f0e9db';
const MUTED = '#9a9284';
const GREEN = '#3ddc3d';
const RED = '#ff3b3b';
const FRAME = '#6b5733';
const FRAME_DARK = '#2a2219';
const PANEL = '#1a1713';
const INSET = '#0a0907';
const icon = name => `https://wow.zamimg.com/images/wow/icons/medium/${name}.jpg`;

const bevel = css`
  border: 1px solid #000;
  box-shadow: inset 0 0 0 1px #3a3128;
`;
const field = css`
  ${bevel};
  background: #050504;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px #3a3128, inset 0 2px 4px rgba(0, 0, 0, 0.9);
`;

const Mock = styled.div`
  position: relative;
  margin-top: 22px;
  padding: 0 8px 8px;
  border: 2px solid ${FRAME};
  box-shadow: inset 0 0 0 1px #0a0806, inset 0 0 0 2px ${FRAME_DARK}, 0 6px 18px rgba(0, 0, 0, 0.5);
  background: radial-gradient(120% 90% at 50% 0%, #262019 0%, #171410 55%, #110f0c 100%);
  color: ${TEXT};
  font-size: 0.8rem;
  line-height: 1.45;
  word-break: keep-all;
  user-select: none;
  @media (max-width: 560px) { padding: 0 6px 6px; }
`;
const Chrome = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  min-height: ${props => (props.$tall ? '76px' : '46px')};
  padding: 0 70px;
  > span { color: ${WOW_GOLD}; font-weight: 800; letter-spacing: 0.02em; text-align: center; text-shadow: 0 1px 0 #000, 0 0 6px rgba(0, 0, 0, 0.8); }
  @media (max-width: 560px) { padding: 0 54px 0 60px; }
`;
const Portrait = styled.i`
  position: absolute;
  top: 4px;
  left: 2px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid #c9a24a;
  box-shadow: 0 0 0 1px #000, inset 0 0 0 1px #000;
  background: radial-gradient(circle at 40% 35%, #8fb0c8 0%, #3d5566 45%, #15202b 100%);
  &::after { content: ''; position: absolute; inset: 10px 12px 6px; border-radius: 50% 50% 40% 40%; background: radial-gradient(circle at 50% 30%, #e7d7c6 0%, #b39a84 50%, #5a4636 100%); }
`;
const Close = styled.i`
  position: absolute;
  top: 6px;
  right: 0;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 2px solid #c9a24a;
  box-shadow: 0 0 0 1px #000;
  background: radial-gradient(circle, #d8302e 0%, #7a1210 100%);
  color: #ffe9a8;
  font-size: 0.78rem;
  font-style: normal;
  font-weight: 800;
`;
const Back = styled.span`
  position: absolute;
  top: 46px;
  left: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 92px;
  height: 22px;
  border: 1px solid #000;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px #c04040;
  background: linear-gradient(180deg, #b22222 0%, #7a1414 100%);
  color: #ffe9b8;
  font-size: 0.76rem;
  font-weight: 800;
  text-shadow: 0 1px 0 #000;
  @media (max-width: 560px) { left: 50px; min-width: 76px; }
`;
const Body = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || 'minmax(0, 1.45fr) minmax(0, 1fr)'};
  gap: 8px;
  align-items: stretch;
  @media (max-width: 640px) { grid-template-columns: minmax(0, 1fr); }
`;
const Panel = styled.div`
  ${bevel};
  position: relative;
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(180deg, ${PANEL} 0%, #15120e 100%);
  transition: opacity 0.2s;
  ${props => (props.$dim ? 'opacity: 0.58;' : '')}
  ${props => (props.$stretch ? 'grid-template-rows: auto auto minmax(96px, 1fr) auto auto; > :nth-child(3) > div { box-sizing: border-box; height: 100%; }' : '')}
  @media (max-width: 560px) { padding: 10px; }
`;
const MoneyBar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  max-width: 100%;
  margin-top: 8px;
  padding: 2px 12px;
  ${field};
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;
const Coin = styled.i`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  vertical-align: -1px;
  background: ${props => (props.$kind === 's' ? 'radial-gradient(circle at 35% 35%, #ffffff, #9aa1a8 70%)' : props.$kind === 'c' ? 'radial-gradient(circle at 35% 35%, #f0a070, #9a4b22 70%)' : 'radial-gradient(circle at 35% 35%, #ffe77a, #c7920f 70%)')};
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.7);
`;
const Label = styled.p`
  margin: 0;
  color: ${WOW_GOLD};
  font-size: 0.76rem;
  font-weight: 800;
  text-shadow: 0 1px 0 #000;
`;
const Check = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${props => (props.$gold ? WOW_GOLD : TEXT)};
  font-size: 0.76rem;
  font-weight: ${props => (props.$gold ? 700 : 500)};
  &::before { content: ${props => (props.$on ? "'✓'" : "''")}; display: grid; place-items: center; flex: 0 0 15px; width: 15px; height: 15px; border: 1px solid #000; border-radius: 2px; box-shadow: inset 0 0 0 1px #5a5042; background: #0b0a08; color: ${WOW_GOLD}; font-size: 0.72rem; font-weight: 900; line-height: 1; }
`;
const Star = styled.span`
  color: #cfc6b6;
  font-size: 1.05rem;
  line-height: 1;
`;
const ItemHead = styled.div`
  ${bevel};
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 2px 12px;
  align-items: center;
  padding: 10px;
  background: #0f0d0a;
  img { grid-row: span 2; width: 40px; height: 40px; border: 1px solid #000; box-shadow: 0 0 0 1px ${EPIC}; border-radius: 4px; }
  strong { color: ${EPIC}; font-size: 0.9rem; font-weight: 800; text-shadow: 0 1px 0 #000; }
  small { grid-column: 2; color: #cfc6b6; font-size: 0.72rem; }
  > span { grid-row: span 2; align-self: start; }
  > em { grid-column: 1 / span 3; margin-top: 6px; font-style: normal; }
`;
const Slot = styled.span`
  position: relative;
  display: grid;
  place-items: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px #3a3128;
  background: radial-gradient(circle at 50% 40%, #2a241c 0%, #141210 100%);
  color: ${GREEN};
  font-size: 1.4rem;
  font-weight: 900;
  line-height: 1;
  overflow: hidden;
  img { width: 100%; height: 100%; display: block; }
  ${props => (props.$epic ? `box-shadow: inset 0 0 0 1px ${EPIC};` : '')}
  ${props => (props.$selected ? 'box-shadow: 0 0 0 2px #e8c85a, 0 0 10px #e8c85a; background: #1d1a12;' : '')}
`;
const Reagents = styled.ul`
  display: grid;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
  li { display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; gap: 10px; align-items: center; min-height: 40px; }
  li > b { color: #fff; font-weight: 600; text-shadow: 0 1px 0 #000; }
  li > b small { margin-right: 4px; color: #fff; font-size: 0.8rem; font-weight: 600; }
  li > b u { margin-left: 4px; color: ${WOW_GOLD}; font-size: 0.66rem; letter-spacing: 0.06em; text-decoration: none; }
`;
const Flyout = styled.div`
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin: -2px 0 2px 50px;
  padding: 8px 10px;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px #4a4034, 0 4px 14px rgba(0, 0, 0, 0.8);
  background: #0b0a08;
  &::before { content: ''; position: absolute; top: -7px; left: 14px; border: 6px solid transparent; border-top: 0; border-bottom-color: #4a4034; }
  > div { display: flex; flex-wrap: wrap; gap: 8px 14px; margin-bottom: 8px; }
  > div > span { display: inline-flex; align-items: center; gap: 8px; color: #fff; font-size: 0.78rem; }
  > div > span.off { color: ${MUTED}; }
  > div > span.off img { filter: grayscale(1) brightness(0.55); }
  @media (max-width: 560px) { margin-left: 0; &::before { display: none; } }
`;
const Tip = styled.div`
  width: min(100%, 320px);
  padding: 8px 10px;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px #4a4034, 0 4px 14px rgba(0, 0, 0, 0.8);
  background: #0a0a12;
  color: #fff;
  font-size: 0.78rem;
  line-height: 1.5;
  > strong { display: block; color: ${EPIC}; font-size: 0.86rem; }
  > span { display: block; }
  span.gold { color: ${WOW_GOLD}; }
  span.red { color: ${RED}; }
  span.green { color: #1eff00; }
  span.muted { color: ${MUTED}; }
  span.two { display: flex; justify-content: space-between; gap: 12px; }
  span.quality { display: flex; align-items: center; gap: 6px; }
  span.quality i { display: inline-block; width: 11px; height: 11px; transform: rotate(45deg); background: linear-gradient(135deg, #f7b733, #b36b00); }
`;
const Optional = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  .opt { display: grid; justify-items: center; gap: 4px; width: 64px; }
  .opt small { color: ${MUTED}; font-size: 0.64rem; line-height: 1.3; text-align: center; }
  @media (max-width: 400px) { gap: 8px 6px; .opt { width: 58px; } }
`;
const Form = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px 10px;
  align-items: center;
  > label { color: ${WOW_GOLD}; font-size: 0.76rem; font-weight: 800; text-align: right; white-space: nowrap; text-shadow: 0 1px 0 #000; }
  > div { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
  > div.end { justify-content: flex-end; }
  > div.full { grid-column: 1 / span 2; }
`;
const Input = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: ${props => (props.$grow ? '1 1 120px' : '0 0 auto')};
  min-width: 0;
  min-height: 24px;
  padding: 0 10px;
  ${field};
  color: ${props => (props.$placeholder ? MUTED : '#fff')};
  font-size: 0.78rem;
  ${props => (props.$coin ? 'justify-content: space-between; width: 72px; padding-right: 8px;' : '')}
`;
const Select = styled.span`
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr) 22px;
  align-items: center;
  width: ${props => props.$width || '150px'};
  max-width: 100%;
  min-height: 24px;
  ${field};
  color: #fff;
  font-size: 0.78rem;
  > span { padding: 0 10px; text-align: ${props => (props.$right ? 'right' : 'center')}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &::after { content: '▼'; display: grid; place-items: center; height: 100%; border-left: 1px solid #000; box-shadow: inset 1px 0 0 #3a3128; background: #1b1812; color: ${WOW_GOLD}; font-size: 0.6rem; }
`;
const IconButton = styled.span`
  display: grid;
  place-items: center;
  width: 26px;
  height: 24px;
  ${field};
  background: #1b1812;
  color: ${WOW_GOLD};
  font-size: 0.9rem;
`;
const Memo = styled.div`
  ${field};
  min-height: 96px;
  padding: 6px 10px 10px;
  color: ${props => (props.$placeholder ? MUTED : '#fff')};
  font-size: 0.78rem;
  > b { display: block; margin-bottom: 4px; color: ${WOW_GOLD}; font-size: 0.76rem; text-shadow: 0 1px 0 #000; }
`;
const Price = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
  color: #fff;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;
const Submit = styled.span`
  display: block;
  width: min(100%, 220px);
  margin: 10px auto 0;
  padding: 4px 0;
  border: 1px solid #000;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px ${props => (props.$off ? '#3a3128' : '#8a7446')};
  background: ${props => (props.$off ? '#14120e' : 'linear-gradient(180deg, #2f2820 0%, #1b1712 100%)')};
  color: ${props => (props.$off ? '#6a6256' : '#f3e9cf')};
  font-weight: 800;
  text-align: center;
  text-shadow: 0 1px 0 #000;
`;
const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
const RedButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  height: 24px;
  padding: 0 14px;
  border: 1px solid #000;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px #c04040;
  background: linear-gradient(180deg, #b22222 0%, #7a1414 100%);
  color: #ffe9b8;
  font-size: 0.76rem;
  font-weight: 800;
  text-shadow: 0 1px 0 #000;
`;
const Nav = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
  .recraft { display: block; padding: 2px 4px; color: ${WOW_GOLD}; font-weight: 700; text-shadow: 0 1px 0 #000; }
  .cats { display: grid; gap: 1px; }
  .cats > span { padding: 3px 4px; color: ${TEXT}; }
  .cats > span.sub { padding-left: 18px; color: #c9c0b1; }
  .cats > span.open { color: ${WOW_GOLD}; font-weight: 700; }
  @media (max-width: 640px) { .cats { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 1px 8px; } .cats > span.sub { padding-left: 14px; } }
`;
const List = styled.div`
  ${bevel};
  display: grid;
  align-content: start;
  background: #0f0d0a;
  > header { display: grid; grid-template-columns: 1fr auto; padding: 4px 10px; border-bottom: 1px solid #000; box-shadow: 0 1px 0 #3a3128; background: #1b1812; color: #d8cfbf; font-size: 0.72rem; }
  > span { display: flex; align-items: center; gap: 8px; min-height: 30px; padding: 2px 10px; color: ${EPIC}; font-weight: 600; }
  > span:nth-child(even) { background: rgba(255, 255, 255, 0.025); }
  > span img { width: 20px; height: 20px; border: 1px solid #000; border-radius: 3px; }
  @media (max-width: 640px) { > span:nth-child(n + 6) { display: none; } }
`;
const Recraft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  padding: 8px 12px;
  ${bevel};
  background: #0f0d0a;
  > span { color: ${WOW_GOLD}; font-size: 1.1rem; }
`;
const Mail = styled.div`
  ${bevel};
  display: grid;
  gap: 8px;
  padding: 10px 12px;
  background: #0f0d0a;
  > b { color: ${WOW_GOLD}; font-size: 0.76rem; text-shadow: 0 1px 0 #000; }
  > span { display: flex; align-items: center; gap: 8px; }
`;
const Mark = styled.div`
  position: relative;
  outline: 2px solid ${CALL};
  outline-offset: ${props => props.$offset || '4px'};
  ${props => (props.$inline ? 'display: inline-flex; max-width: 100%;' : '')}
  ${props => (props.$block ? 'display: block;' : '')}
  ${props => (props.$grow ? 'flex: 1 1 200px; > * { flex: 1 1 auto; }' : '')}
`;
const Badge = styled.b`
  position: absolute;
  top: -15px;
  ${props => (props.$right ? 'right: -15px;' : 'left: -15px;')}
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
`;

function Call({ n, children, offset, inline, block, right, grow }) {
  return <Mark data-callout={n} $offset={offset} $inline={inline} $block={block} $grow={grow}><Badge aria-hidden="true" $right={right}>{n}</Badge>{children}</Mark>;
}

const sampleItem = { name: '실체 없는 빛 태양 보호대', icon: 'inv_helmet_47', profession: '기계공학 제작법' };
// Wowhead 한국어 spell=1229873 재료. 마지막 '불꽃'은 재료 분류(#401)라 창에서는 초록 + 칸으로 보이고 눌러서 고른다.
const sampleReagents = [
  ['10', '유연한 철사 구조', 'inv_10_engineering_device_gadget3_color3', true],
  ['15', '야생 마력의 티끌', 'inv_12_profession_thematicfoozles_moteofwildmadic_lightgreen', true],
  ['3', '휘황찬란한 토륨', 'inv_12_profession_mining_dazzlingthorium-', true],
  ['1', '고통받는 탄탈룸', 'inv_10_blacksmithing_craftedoptional_reinforcedmetalplating_color01', false],
  ['10', '실체 없는 빛', 'inv_10_engineering_manufacturedparts_electricalparts_color2', false],
  ['3', '영원핵', 'inv_12_profession_engineering_manufacturedparts_battery_purple', false],
];
// 불꽃 분류(#401)에 드는 아이템: Wowhead 한국어 아이템 목록(filter=243;401;0) 기준.
const sparkChoices = [
  ['해일의 불꽃', 'inv_12_profession_questandcrafting_sparkwhole_green'],
  ['광휘의 불꽃', 'inv_12_profession_questandcrafting_sparkwhole_gold'],
];
const embellishment = { name: '비전매듭 안감', icon: 'inv_12_tailoring_rare_cloth_violet_rare-cloth' };
const optionalSlots = ['힘 주입', '보조 능력치 증폭', '장식 추가', '장인의 진정성'];
const listItems = [
  ['실체 없는 빛 태양 보호대', 'inv_helmet_47'],
  ['죽음의 골목 빠른발', 'inv_plate_questbloodelf_b_01_boot'],
  ['세계지기의 그루터기판금', 'inv_chest_mail_questbloodelf_b_01'],
  ['세계수 뿌리발등싸개', 'inv_boot_leather_questbloodelf_b_01'],
  ['태양불꽃 발보호대', 'inv_boot_cloth_questbloodelf_b_01'],
  ['공허석 보호막 배열기', 'inv_12_profession_jewelcrafting_necklace3_silver'],
  ['기사단장의 방책', 'inv_shield_1h_questbloodelf_b_01'],
];

function Money() {
  return <MoneyBar>24,310 <Coin $kind="g" /> 52 <Coin $kind="s" /> 7 <Coin $kind="c" /></MoneyBar>;
}

function Window({ title, back, children, columns }) {
  return (
    <Mock role="img" aria-label={`${title} 창을 본뜬 그림`}>
      <Chrome $tall={back}><Portrait aria-hidden="true" /><span>{title}</span><Close aria-hidden="true">✕</Close>{back ? <Back>뒤로</Back> : null}</Chrome>
      <Body $columns={columns}>{children}</Body>
      <Money />
    </Mock>
  );
}

function ReagentRow({ count, name, image, quality, on }) {
  return (
    <li><Slot><img src={icon(image)} alt="" loading="lazy" /></Slot><b><small>0/{count}</small>{name}{quality ? <u>◆◆◆</u> : null}</b><Check $on={on} /></li>
  );
}

// 왼쪽 판: 장비 머리글 → 재료 제공 → 선택 재료 제공 → 최고 품질 재료 사용
function ReagentPanel({ dim, calls }) {
  const c = calls || {};
  const wrap = (key, node, offset) => (c[key] ? <Call n={c[key]} offset={offset || '5px'} block>{node}</Call> : node);
  return (
    <Panel $dim={dim}>
      <ItemHead>
        <img src={icon(sampleItem.icon)} alt="" loading="lazy" />
        <strong>{sampleItem.name}</strong>
        <Star>☆</Star>
        <small>{sampleItem.profession}</small>
        <em><Check>제작법 추적</Check></em>
      </ItemHead>
      <Label>재료 제공:</Label>
      {wrap('reagents', (
        <div>
          <Reagents>
            <li><Slot $selected>+</Slot><b><small>0/2</small>불꽃</b><Check $on /></li>
          </Reagents>
          <Flyout>
            <div>
              {sparkChoices.map(([name, image], index) => (
                <span key={name} className={index ? 'off' : ''}><Slot style={{ width: 28, height: 28, flexBasis: 28 }}><img src={icon(image)} alt="" loading="lazy" /></Slot>0/2 {name}</span>
              ))}
            </div>
            <Check $gold>사용 불가 아이템 숨기기</Check>
          </Flyout>
          <Reagents>
            {sampleReagents.map(([count, name, image, quality]) => <ReagentRow key={name} count={count} name={name} image={image} quality={quality} />)}
          </Reagents>
        </div>
      ), '6px')}
      <Label style={{ marginTop: 6 }}>선택 재료 제공:</Label>
      <Optional>
        {optionalSlots.map((name, index) => {
          const filled = name === '장식 추가';
          const node = (
            <span className="opt" key={name}>
              <Slot $epic={filled}>{filled ? <img src={icon(embellishment.icon)} alt="" loading="lazy" /> : '+'}</Slot>
              <small>{name}</small>
            </span>
          );
          const key = ['infuse', 'secondary', 'embellish', 'mark'][index];
          return c[key] ? <Call key={name} n={c[key]} offset="3px" inline>{node}</Call> : node;
        })}
      </Optional>
      <p style={{ margin: 0, color: MUTED, fontSize: '0.7rem' }}>장식 추가 칸에 <b style={{ color: EPIC, fontWeight: 600 }}>{embellishment.name}</b>을 넣은 모습. 칸 이름은 실제 창에서는 마우스를 올리면 보입니다.</p>
      <Check style={{ marginTop: 10 }} $on>최고 품질 재료 사용</Check>
    </Panel>
  );
}

// 오른쪽 판: 주문 종류 → 받는이 → 최소 품질 → 제작 참고 사항 → 수수료·기간 → 게시 수수료·총 가격 → 주문 의뢰하기
function OrderPanel({ dim, filled, calls }) {
  const c = calls || {};
  const wrap = (key, node, offset) => (c[key] ? <Call n={c[key]} offset={offset || '6px'} block>{node}</Call> : node);
  return (
    <Panel $dim={dim} $stretch>
      <Form>
        <div className="full end">{wrap('type', <Select $width="150px"><span>개인 주문</span></Select>, '3px')}</div>
      </Form>
      {wrap('target', (
        <Form>
          <label>받는이:</label><div>{filled ? <Input $grow>제작자 이름-서버</Input> : <Input $grow $placeholder>&nbsp;</Input>}</div>
          <label>최소 품질:</label><div className="end"><Select $width="110px"><span>{filled ? '◆ 5' : '없음'}</span></Select></div>
        </Form>
      ))}
      {wrap('memo', (
        <Memo $placeholder={!filled}>
          <b>제작 참고 사항:</b>
          {filled ? '재료는 다 보냈어요. 장식 추가에 비전매듭 안감 넣어 주세요.' : '여기에 메시지를 입력하십시오.'}
        </Memo>
      ))}
      {wrap('fee', (
        <Form>
          <label>수수료</label>
          <div><Input $coin>{filled ? '2,000' : '0'}<Coin $kind="g" /></Input><Input $coin>0<Coin $kind="s" /></Input><IconButton aria-hidden="true">⚒</IconButton></div>
          <label>기간</label>
          <div><Select $width="150px" $right><span>48시간</span></Select></div>
        </Form>
      ))}
      {wrap('total', (
        <div>
          <Form>
            <label>게시 수수료</label><div><Price>20 <Coin $kind="g" /></Price><Price>0 <Coin $kind="s" /></Price></div>
            <label>총 가격</label><div><Price>{filled ? '2,020' : '20'} <Coin $kind="g" /></Price><Price>0 <Coin $kind="s" /></Price></div>
          </Form>
          <Submit $off={!filled}>주문 의뢰하기</Submit>
        </div>
      ))}
    </Panel>
  );
}

function BrowseScreen() {
  return (
    <Window title="주문 제작 의뢰" columns="minmax(0, 1fr)">
      <Panel>
        <Toolbar>
          <Star>★</Star>
          <Call n={1} inline grow><Input $grow $placeholder>⌕ 검색</Input></Call>
          <Select $width="96px"><span>필터</span></Select>
          <RedButton>검색</RedButton>
        </Toolbar>
        <Body $columns="150px minmax(0, 1fr)">
          <Nav>
            <Call n={4} offset="3px"><span className="recraft">재제작 주문 시작</span></Call>
            <Call n={2} offset="3px">
              <div className="cats">
                <span>무기</span>
                <span className="open">방어구</span>
                <span className="sub">판금</span>
                <span className="sub">사슬</span>
                <span className="sub">가죽</span>
                <span className="sub">천</span>
                <span>가방류</span>
                <span>보석</span>
                <span>아이템 강화</span>
                <span>소비용품</span>
                <span>전문 기술 장비</span>
                <span>기타</span>
              </div>
            </Call>
          </Nav>
          <Call n={3} offset="3px">
            <List>
              <header><span>이름 ▾</span><span>레벨</span></header>
              {listItems.map(([name, image]) => <span key={name}><img src={icon(image)} alt="" loading="lazy" />{name}</span>)}
            </List>
          </Call>
        </Body>
      </Panel>
    </Window>
  );
}

function ReagentScreen() {
  return (
    <Window title="주문 제작 의뢰" back>
      <ReagentPanel calls={{ reagents: 1, infuse: 2, secondary: 3, embellish: 4 }} />
      <OrderPanel dim />
    </Window>
  );
}

function OrderScreen() {
  return (
    <Window title="주문 제작 의뢰" back>
      <ReagentPanel dim />
      <OrderPanel filled calls={{ type: 1, target: 2, memo: 3, fee: 4, total: 5 }} />
    </Window>
  );
}

function RecraftScreen() {
  return (
    <Window title="주문 제작 의뢰" back>
      <Panel>
        <Label>재제작: <span style={{ color: EPIC }}>{sampleItem.name}</span></Label>
        <Call n={1} offset="4px" inline>
          <Recraft><Slot $epic><img src={icon(sampleItem.icon)} alt="" loading="lazy" /></Slot><span>➤</span><Slot $epic><img src={icon(sampleItem.icon)} alt="" loading="lazy" /></Slot></Recraft>
        </Call>
        <Label style={{ marginTop: 6 }}>재료 제공:</Label>
        <Call n={2} offset="6px" block>
          <Reagents>
            {sampleReagents.slice(0, 3).map(([count, name, image, quality]) => <ReagentRow key={name} count={Math.ceil(Number(count) / 2)} name={name} image={image} quality={quality} />)}
          </Reagents>
        </Call>
        <p style={{ margin: 0, color: MUTED, fontSize: '0.7rem' }}>불꽃처럼 다시 들지 않는 재료도 있고, 일부 재료는 다시 듭니다.</p>
        <Label style={{ marginTop: 6 }}>선택 재료 제공:</Label>
        <Call n={3} offset="6px" block>
          <Optional>
            {optionalSlots.slice(0, 3).map(name => {
              const filled = name === '장식 추가';
              return (
                <span className="opt" key={name}>
                  <Slot $epic={filled}>{filled ? <img src={icon(embellishment.icon)} alt="" loading="lazy" /> : '+'}</Slot>
                  <small>{name}</small>
                </span>
              );
            })}
          </Optional>
          <Tip style={{ marginTop: 8 }}><strong>{embellishment.name}</strong><span className="muted">이 선택 재료를 제거하려면 오른쪽 클릭</span></Tip>
        </Call>
      </Panel>
      <Call n={4} offset="4px" block>
        <OrderPanel filled />
      </Call>
    </Window>
  );
}

function ResultScreen() {
  return (
    <Window title="우편" columns="minmax(0, 1fr) minmax(0, 1.2fr)">
      <Panel>
        <Call n={1} offset="4px" block>
          <Mail>
            <b>제목: 주문 완료 · {sampleItem.name}</b>
            <span>첨부 받기:</span>
            <span><Slot $epic><img src={icon(sampleItem.icon)} alt="" loading="lazy" /></Slot><span style={{ color: EPIC, fontWeight: 600 }}>{sampleItem.name}</span></span>
          </Mail>
        </Call>
      </Panel>
      <Panel>
        <Tip>
          <strong>{sampleItem.name}</strong>
          <span className="gold">아이템 레벨 246</span>
          <span>획득 시 귀속</span>
          <Call n={2} inline right offset="2px"><span>고유 장착: 장식됨 (2)</span></Call>
          <span className="two"><span>머리</span><span>판금</span></span>
          <span>방어도 23</span>
          <span>힘 +83</span>
          <span>체력 +1,385</span>
          <Call n={3} inline right offset="2px"><span className="green">+65 가속 · +65 유연성</span></Call>
          <Call n={4} right offset="2px"><span className="green">장착 효과: 주문 및 능력 사용 시 일정 확률로 마나 지룡을 끌어내 자신과 아군을 비전매듭 통찰로 강화합니다.</span></Call>
          <span className="quality">품질: <i /> 5</span>
          <span className="muted">&lt;제작자: 제작자 이름&gt;</span>
        </Tip>
      </Panel>
    </Window>
  );
}

const screens = { browse: BrowseScreen, reagents: ReagentScreen, order: OrderScreen, recraft: RecraftScreen, result: ResultScreen };

export function CraftingScreen({ id }) {
  const Screen = screens[id];
  return Screen ? <Screen /> : null;
}

export default CraftingScreen;
