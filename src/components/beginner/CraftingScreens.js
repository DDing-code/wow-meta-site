import React from 'react';
import styled from 'styled-components';

// 주문 제작 의뢰 창을 본뜬 그림 5장. 실제 게임은 캡처할 수 없어 Wowhead 안내와 한국어 클라이언트 캡처(2022 인벤 글)의
// 창 배치·문구를 따라 그렸다. 아이템·재료는 Wowhead 한국어 자료의 실제 이름이며, 수치와 캐릭터 이름은 예시다.
// 번호 상자(강조)는 본문 단계와 맞춘다. 본뜬 그림이므로 글자·배치가 실제 화면과 조금 다를 수 있다.
// 각 그림의 제목·단계·번호 설명은 KB 원본 beginner-crafting.json의 screens(sync-kb → src/data/beginnerCrafting.json)에 있고, 여기에는 그림만 둔다.

const CALL = '#ff7a59';
const WOW_GOLD = '#ffd100';
const EPIC = '#a335ee';
const FRAME = '#4d3f26';
const PANEL_DARK = '#0d0b09';
const TEXT = '#e6ded0';
const MUTED = '#9b9388';
const icon = name => `https://wow.zamimg.com/images/wow/icons/medium/${name}.jpg`;

const Mock = styled.div`
  position: relative;
  margin-top: 22px;
  padding: 0 0 2px;
  border: 1px solid ${FRAME};
  background: linear-gradient(180deg, #1c1813 0%, #15120e 100%);
  color: ${TEXT};
  font-size: 0.8rem;
  line-height: 1.45;
  word-break: keep-all;
  user-select: none;
`;
const TitleBar = styled.div`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 72px;
  align-items: center;
  min-height: 32px;
  padding: 0 8px;
  border-bottom: 1px solid ${FRAME};
  background: #0f0c09;
  color: ${WOW_GOLD};
  font-weight: 700;
  > span { text-align: center; }
  > i { display: grid; place-items: center; justify-self: end; width: 18px; height: 18px; border: 1px solid #8a2b2b; background: #a52a2a; color: #fff; font-size: 0.7rem; font-style: normal; font-weight: 700; }
`;
const Inner = styled.div`
  padding: 12px;
  @media (max-width: 560px) { padding: 10px; }
`;
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;
const Star = styled.span`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid #5c5243;
  background: #262019;
  color: #d8cfbf;
  font-size: 0.9rem;
`;
const Field = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 1 1 140px;
  min-width: 0;
  min-height: 26px;
  padding: 0 10px;
  border: 1px solid #5c5243;
  background: ${PANEL_DARK};
  color: ${props => (props.$placeholder ? MUTED : TEXT)};
  font-size: 0.78rem;
`;
const Button = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  min-height: 26px;
  padding: 0 14px;
  border: 1px solid ${props => (props.$red ? '#7d1f1f' : '#5c5243')};
  background: ${props => (props.$red ? '#8d1d1d' : '#2a241c')};
  color: ${props => (props.$red ? '#ffe5b4' : '#efe7d7')};
  font-size: 0.78rem;
  font-weight: 700;
`;
const Split = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '150px minmax(0, 1fr)'};
  gap: 12px;
  align-items: start;
  margin-top: 12px;
  @media (max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`;
const Nav = styled.div`
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 8px;
  border: 1px solid #2b2520;
  background: ${PANEL_DARK};
  .recraft { display: block; padding: 3px 6px; color: ${WOW_GOLD}; }
  .cats { display: grid; gap: 2px; }
  .cats > span { padding: 3px 6px; color: ${TEXT}; }
  .cats > span.sub { padding-left: 20px; color: #c9c0b1; }
  .cats > span.open { color: ${WOW_GOLD}; }
  @media (max-width: 600px) { .cats { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 2px 8px; } .cats > span.sub { padding-left: 14px; } }
`;
const List = styled.div`
  display: grid;
  align-content: start;
  border: 1px solid #2b2520;
  background: ${PANEL_DARK};
  > header { display: grid; grid-template-columns: 1fr auto; padding: 4px 10px; border-bottom: 1px solid #2b2520; background: #1a1611; color: #d8cfbf; font-size: 0.72rem; }
  > span { display: flex; align-items: center; gap: 8px; min-height: 30px; padding: 2px 10px; color: ${EPIC}; }
  > span img { width: 18px; height: 18px; border: 1px solid #3b3128; }
  > span.hint { justify-content: center; padding: 10px 8px; color: ${WOW_GOLD}; font-size: 0.74rem; text-align: center; }
  @media (max-width: 600px) { > span:nth-child(n + 6) { display: none; } }
`;
const Label = styled.p`
  margin: 12px 0 14px;
  color: ${WOW_GOLD};
  font-size: 0.74rem;
  font-weight: 700;
`;
const ItemHead = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 4px 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #2b2520;
  background: ${PANEL_DARK};
  img { grid-row: span 2; width: 40px; height: 40px; border: 1px solid ${EPIC}; }
  strong { color: ${EPIC}; font-size: 0.9rem; font-weight: 700; }
  small { grid-column: 2; color: ${MUTED}; font-size: 0.72rem; }
  > span { grid-row: span 2; align-self: start; }
  > em { grid-column: 2 / span 2; margin-top: 4px; color: #c9c0b1; font-size: 0.72rem; font-style: normal; }
`;
const Reagents = styled.ul`
  display: grid;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  li { display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; gap: 8px; align-items: center; min-height: 32px; }
  img { width: 30px; height: 30px; border: 1px solid #3b3128; }
  b { color: #ffffff; font-weight: 500; }
  b small { margin-right: 4px; color: ${MUTED}; font-size: 0.74rem; }
  i { display: inline-block; width: 12px; height: 12px; border: 1px solid #7b7265; background: #111; }
  i.on { background: #4f86d6; border-color: #7fb0ff; }
  u { color: ${WOW_GOLD}; font-size: 0.68rem; letter-spacing: 0.08em; text-decoration: none; }
`;
const Slots = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 14px;
  .slot { display: flex; align-items: center; gap: 8px; min-height: 36px; color: #ffffff; }
  .slot > em { display: grid; place-items: center; flex: 0 0 32px; width: 32px; height: 32px; border: 1px solid #3b3128; background: #171310; color: #4ad04a; font-size: 1.2rem; font-style: normal; font-weight: 700; line-height: 1; }
  .slot > img { flex: 0 0 32px; width: 32px; height: 32px; border: 1px solid ${EPIC}; }
  @media (max-width: 420px) { grid-template-columns: minmax(0, 1fr); }
`;
const Side = styled.div`
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 12px;
  border: 1px solid #2b2520;
  background: #120f0c;
`;
const Select = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  width: ${props => props.$width || '100%'};
  max-width: 100%;
  min-height: 26px;
  padding: 0 8px 0 10px;
  border: 1px solid #5c5243;
  background: ${PANEL_DARK};
  color: ${TEXT};
  font-size: 0.78rem;
  &::after { content: '▾'; color: ${WOW_GOLD}; }
`;
const Form = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px 10px;
  align-items: center;
  > label { color: ${WOW_GOLD}; font-size: 0.76rem; font-weight: 700; text-align: right; white-space: nowrap; }
  > div { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
`;
const Coin = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 58px;
  min-height: 26px;
  padding: 0 8px;
  border: 1px solid #5c5243;
  background: ${PANEL_DARK};
  color: ${TEXT};
  font-size: 0.78rem;
  &::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: ${props => (props.$silver ? '#c0c0c0' : '#f1c232')}; }
`;
const Price = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #ffffff;
  &::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: #f1c232; }
`;
const Memo = styled.div`
  min-height: 70px;
  padding: 8px 10px;
  border: 1px solid #5c5243;
  background: ${PANEL_DARK};
  color: ${props => (props.$placeholder ? MUTED : TEXT)};
  > b { display: block; margin-bottom: 4px; color: ${WOW_GOLD}; font-size: 0.74rem; }
`;
const Submit = styled.span`
  display: block;
  margin-top: 6px;
  padding: 7px 0;
  border: 1px solid #6c5c3c;
  background: #2a241c;
  color: #efe7d7;
  font-weight: 700;
  text-align: center;
`;
const Recraft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: fit-content;
  padding: 10px 16px;
  border: 1px solid #2b2520;
  background: ${PANEL_DARK};
  img { width: 40px; height: 40px; border: 1px solid ${EPIC}; }
  > span { color: ${WOW_GOLD}; font-size: 1.2rem; }
  > em { display: grid; place-items: center; width: 40px; height: 40px; border: 1px dashed #6c5c3c; color: #4ad04a; font-size: 1.3rem; font-style: normal; }
`;
const Tooltip = styled.div`
  width: min(100%, 340px);
  padding: 10px 12px;
  border: 1px solid #5c5243;
  background: #0a0a14;
  color: #ffffff;
  font-size: 0.78rem;
  line-height: 1.55;
  > strong { display: block; margin-bottom: 2px; color: ${EPIC}; font-size: 0.92rem; }
  > span, > div > span { display: block; }
  > div { margin: 10px 0; }
  span.gold { color: ${WOW_GOLD}; }
  span.two { display: flex; justify-content: space-between; }
  span.green { color: #1eff00; }
  span.muted { color: ${MUTED}; }
  span.quality { display: flex; align-items: center; gap: 6px; }
  span.quality i { display: inline-block; width: 12px; height: 12px; margin: 0 3px; transform: rotate(45deg); background: linear-gradient(135deg, #f7b733, #b36b00); }
`;
const Mail = styled.div`
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #2b2520;
  background: #16120e;
  color: ${TEXT};
  > b { color: ${WOW_GOLD}; font-size: 0.74rem; }
  > span { display: flex; align-items: center; gap: 8px; }
  > span img { width: 30px; height: 30px; border: 1px solid ${EPIC}; }
`;
const Mark = styled.div`
  position: relative;
  outline: 2px solid ${CALL};
  outline-offset: ${props => props.$offset || '4px'};
  ${props => (props.$inline ? 'display: inline-flex; max-width: 100%;' : '')}
`;
const Badge = styled.b`
  position: absolute;
  top: -15px;
  ${props => (props.$right ? 'right: -15px;' : 'left: -15px;')}
  z-index: 1;
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

function Call({ n, children, offset, inline, right }) {
  return <Mark data-callout={n} $offset={offset} $inline={inline}><Badge aria-hidden="true" $right={right}>{n}</Badge>{children}</Mark>;
}

const sampleItem = { name: '실체 없는 빛 태양 보호대', icon: 'inv_helmet_47', profession: '기계공학 제작법' };
const sampleReagents = [
  ['10', '유연한 철사 구조', 'inv_10_engineering_device_gadget3_color3', true],
  ['15', '야생 마력의 티끌', 'inv_12_profession_thematicfoozles_moteofwildmadic_lightgreen', true],
  ['3', '휘황찬란한 토륨', 'inv_12_profession_mining_dazzlingthorium-', true],
  ['1', '고통받는 탄탈룸', 'inv_10_blacksmithing_craftedoptional_reinforcedmetalplating_color01', false],
  ['10', '실체 없는 빛', 'inv_10_engineering_manufacturedparts_electricalparts_color2', false],
  ['3', '영원핵', 'inv_12_profession_engineering_manufacturedparts_battery_purple', false],
  ['2', '불꽃', 'inv_12_profession_questandcrafting_sparkwhole_gold', false],
];
const embellishment = { name: '비전매듭 안감', icon: 'inv_12_tailoring_rare_cloth_violet_rare-cloth' };
const listItems = [
  ['실체 없는 빛 태양 보호대', 'inv_helmet_47'],
  ['죽음의 골목 빠른발', 'inv_plate_questbloodelf_b_01_boot'],
  ['세계지기의 그루터기판금', 'inv_chest_mail_questbloodelf_b_01'],
  ['세계수 뿌리발등싸개', 'inv_boot_leather_questbloodelf_b_01'],
  ['태양불꽃 발보호대', 'inv_boot_cloth_questbloodelf_b_01'],
  ['공허석 보호막 배열기', 'inv_12_profession_jewelcrafting_necklace3_silver'],
  ['기사단장의 방책', 'inv_shield_1h_questbloodelf_b_01'],
];

function Window({ title, back, children }) {
  return (
    <Mock role="img" aria-label={`${title} 창을 본뜬 그림`}>
      <TitleBar>{back ? <Button $red style={{ minWidth: 0, minHeight: 22, padding: '0 10px' }}>뒤로</Button> : <span />}<span>{title}</span><i>✕</i></TitleBar>
      <Inner>{children}</Inner>
    </Mock>
  );
}

function BrowseScreen() {
  return (
    <Window title="주문 제작 의뢰">
      <Row>
        <Star>★</Star>
        <Call n={1} inline><Field $placeholder>⌕ 검색</Field></Call>
        <Button>필터 ▸</Button>
        <Button $red>검색</Button>
      </Row>
      <Split>
        <Nav>
          <Call n={4} offset="2px"><span className="recraft">재제작 주문 시작</span></Call>
          <Call n={2} offset="2px">
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
        <Call n={3} offset="2px">
          <List>
            <header><span>이름 ▾</span><span>레벨</span></header>
            {listItems.map(([name, image]) => <span key={name}><img src={icon(image)} alt="" loading="lazy" />{name}</span>)}
          </List>
        </Call>
      </Split>
    </Window>
  );
}

function ReagentScreen() {
  return (
    <Window title="주문 제작 의뢰" back>
      <ItemHead>
        <img src={icon(sampleItem.icon)} alt="" loading="lazy" />
        <strong>{sampleItem.name}</strong>
        <Star>☆</Star>
        <small>{sampleItem.profession}</small>
        <em>☐ 제작법 추적</em>
      </ItemHead>
      <Split $columns="minmax(0, 1.1fr) minmax(0, 1fr)">
        <div>
          <Label>재료 제공:</Label>
          <Call n={1} offset="6px">
            <Reagents>
              {sampleReagents.map(([count, name, image, quality]) => (
                <li key={name}><img src={icon(image)} alt="" loading="lazy" /><b><small>0/{count}</small>{name}{quality ? <> <u>◆◆◆</u></> : null}</b><i className={name === '불꽃' ? 'on' : ''} /></li>
              ))}
            </Reagents>
          </Call>
        </div>
        <div>
          <Label>선택 재료:</Label>
          <Slots>
            <Call n={2} offset="4px"><span className="slot"><em>+</em>힘 주입</span></Call>
            <Call n={3} offset="4px"><span className="slot"><em>+</em>보조 능력치 증폭</span></Call>
            <Call n={4} offset="4px"><span className="slot"><img src={icon(embellishment.icon)} alt="" loading="lazy" />장식 추가</span></Call>
            <span className="slot"><em>+</em>장인의 진정성</span>
          </Slots>
          <p style={{ marginTop: 14, color: MUTED, fontSize: '0.72rem' }}>장식 추가 칸에 <b style={{ color: EPIC, fontWeight: 600 }}>{embellishment.name}</b>을 넣은 모습</p>
        </div>
      </Split>
    </Window>
  );
}

function OrderScreen() {
  return (
    <Window title="주문 제작 의뢰" back>
      <Split $columns="minmax(0, 1fr) minmax(0, 1.25fr)">
        <div>
          <ItemHead>
            <img src={icon(sampleItem.icon)} alt="" loading="lazy" />
            <strong>{sampleItem.name}</strong>
            <Star>☆</Star>
            <small>{sampleItem.profession}</small>
          </ItemHead>
          <Label>재료 제공:</Label>
          <Reagents>
            {sampleReagents.slice(0, 4).map(([count, name, image]) => (
              <li key={name}><img src={icon(image)} alt="" loading="lazy" /><b><small>{count}/{count}</small>{name}</b><i className="on" /></li>
            ))}
          </Reagents>
        </div>
        <Side>
          <Call n={1} inline offset="3px"><Select $width="150px">개인 주문</Select></Call>
          <Call n={2} offset="6px">
            <Form>
              <label>받는이:</label><div><Field>제작자 이름-서버</Field></div>
              <label>최소 품질:</label><div><Select $width="92px">◆ 5</Select></div>
            </Form>
          </Call>
          <Call n={3} offset="4px"><Memo><b>제작 참고 사항:</b>재료는 다 보냈어요. 장식 추가에 비전매듭 안감 넣어 주세요.</Memo></Call>
          <Call n={4} offset="6px">
            <Form>
              <label>수수료</label><div><Coin>2,000</Coin><Coin $silver>0</Coin></div>
              <label>기간</label><div><Select $width="110px">24시간</Select></div>
            </Form>
          </Call>
          <Call n={5} offset="6px">
            <Form>
              <label>게시 수수료</label><div><Price>5</Price></div>
              <label>총 가격</label><div><Price>2,005</Price></div>
            </Form>
            <Submit>주문 의뢰하기</Submit>
          </Call>
        </Side>
      </Split>
    </Window>
  );
}

function RecraftScreen() {
  return (
    <Window title="주문 제작 의뢰" back>
      <Split $columns="minmax(0, 1.2fr) minmax(0, 1fr)">
        <div>
          <p><span style={{ color: WOW_GOLD, fontWeight: 700 }}>재제작:</span> <span style={{ color: EPIC }}>{sampleItem.name}</span></p>
          <div style={{ marginTop: 10 }}>
            <Call n={1} offset="4px">
              <Recraft><img src={icon(sampleItem.icon)} alt="" loading="lazy" /><span>➤</span><img src={icon(sampleItem.icon)} alt="" loading="lazy" /></Recraft>
            </Call>
          </div>
          <Label>재료:</Label>
          <Call n={2} offset="6px">
            <Reagents>
              {sampleReagents.slice(0, 3).map(([count, name, image]) => (
                <li key={name}><img src={icon(image)} alt="" loading="lazy" /><b><small>0/{Math.ceil(Number(count) / 2)}</small>{name}</b><span /></li>
              ))}
            </Reagents>
          </Call>
          <p style={{ marginTop: 10, color: MUTED, fontSize: '0.72rem' }}>불꽃처럼 다시 들지 않는 재료도 있고, 일부 재료는 다시 듭니다.</p>
        </div>
        <div>
          <Label>선택 재료:</Label>
          <Call n={3} offset="6px">
            <Slots style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
              <span className="slot"><em>+</em>힘 주입</span>
              <span className="slot"><em>+</em>보조 능력치 증폭</span>
              <span className="slot"><img src={icon(embellishment.icon)} alt="" loading="lazy" />장식 추가</span>
            </Slots>
            <p style={{ margin: '8px 0 0', padding: '6px 8px', border: '1px solid #5c5243', background: '#0a0a14', color: MUTED, fontSize: '0.72rem' }}>이 선택 재료를 제거하려면 오른쪽 클릭</p>
          </Call>
          <div style={{ marginTop: 22 }}>
            <Call n={4} offset="6px">
              <Side style={{ padding: 10 }}>
                <Select $width="150px">개인 주문</Select>
                <Form><label>받는이:</label><div><Field>제작자 이름-서버</Field></div></Form>
                <Submit>주문 의뢰하기</Submit>
              </Side>
            </Call>
          </div>
        </div>
      </Split>
    </Window>
  );
}

function ResultScreen() {
  return (
    <Window title="우편">
      <Split $columns="minmax(0, 1fr) minmax(0, 1.2fr)">
        <Call n={1} offset="4px">
          <Mail>
            <b>제목: 주문 완료 · {sampleItem.name}</b>
            <span>첨부 받기:</span>
            <span><img src={icon(sampleItem.icon)} alt="" loading="lazy" /><span style={{ color: EPIC }}>{sampleItem.name}</span></span>
          </Mail>
        </Call>
        <Tooltip>
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
        </Tooltip>
      </Split>
    </Window>
  );
}

const screens = { browse: BrowseScreen, reagents: ReagentScreen, order: OrderScreen, recraft: RecraftScreen, result: ResultScreen };

export function CraftingScreen({ id }) {
  const Screen = screens[id];
  return Screen ? <Screen /> : null;
}

export default CraftingScreen;
