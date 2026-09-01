import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Gauge,
  ListChecks,
  RotateCw,
  Sparkles,
  Target,
} from 'lucide-react';
import kbSkills from '../data/kb-skills.json';

const skills = kbSkills.skills || {};

const logs = [
  {
    label: '분석 대상',
    name: '조나사제',
    detail: '30인 · 4힐 · 295.7초 · 아이템 레벨 310',
    hps: '220.4k',
    percentile: '82 / 71',
    casts: '201 · 40.8 APM',
    mana: '92.2%',
    overheal: '32.9%',
    tier: '12.1 티어 1부위',
    tone: '#d49a58',
  },
  {
    label: '같은 공격대',
    name: '잠실',
    detail: '30인 · 4힐 · 295.7초 · 아이템 레벨 295',
    hps: '231.1k',
    percentile: '87 / 95',
    casts: '229 · 46.5 APM',
    mana: '47.1%',
    overheal: '34.0%',
    tier: '12.1 티어 세트 없음',
    tone: '#75bda9',
  },
  {
    label: '조건 근접 99점',
    name: '남극여행',
    detail: '30인 · 5힐 · 295.4초 · 아이템 레벨 307',
    hps: '297.3k',
    percentile: '99 / 99',
    casts: '217 · 44.1 APM',
    mana: '54.7%',
    overheal: '34.0%',
    tier: '12.1 티어 4세트',
    tone: '#8d99a2',
  },
];

const castRows = [
  { id: '2061', name: '순간 치유', target: 36, peer: 52, top: 57 },
  { id: '2050', name: '빛의 권능: 평온', target: 29, peer: 37, top: 37 },
  { id: '1262763', name: '축도', target: 55, peer: 64, top: 58 },
  { id: '33076', name: '회복의 기원', target: 36, peer: 40, top: 38 },
];

const valueRows = [
  ['빛의 권능: 평온', '330k', '278k', '350k'],
  ['축도', '89.3k', '80.3k', '115.6k'],
  ['순간 치유', '72.9k', '61.0k', '74.8k'],
  ['회복의 기원', '275.7k', '248.8k', '284.4k'],
];

const apotheosisRows = [
  ['조나사제 1차', '35.1–67.1초', '6', '7', '겹침 없음', '양호'],
  ['조나사제 2차', '230.4–262.4초', '2', '5', '천상의 찬가 4초', '핵심 손실'],
  ['잠실 1차', '0.9–32.9초', '8', '10', '없음', '비교'],
  ['잠실 2차', '121.0–153.0초', '8', '11', '없음', '비교'],
  ['99점 1차', '43.1–75.1초', '7', '9', '없음', '비교'],
  ['99점 2차', '209.4–241.4초', '7', '7', '없음', '비교'],
];

const goals = [
  ['종료 마나', '40–60%'],
  ['순간 치유', '50회 이상'],
  ['빛의 권능: 평온', '35회 이상'],
  ['회복의 기원', '38–40회'],
  ['축도 2중첩 시간', '20% 이하'],
  ['절정 한 구간 평온', '6회 이상'],
  ['절정·천상의 찬가', '서로 겹치지 않기'],
  ['선택 특성 무효 사용', '0회'],
];

function iconUrl(skill) {
  return skill?.iconUrls?.small || skill?.iconUrls?.medium || skill?.iconUrl || '';
}

function SkillLink({ id, children }) {
  const skill = skills[String(id)];
  const name = children || skill?.koreanName || skill?.name || '스킬';
  const src = iconUrl(skill);

  return (
    <SkillAnchor
      href={`https://ko.wowhead.com/spell=${id}`}
      data-wowhead={`spell=${id}&domain=ko`}
      target="_blank"
      rel="noreferrer"
      title={`${name} 툴팁 보기`}
    >
      {src ? <img src={src} alt="" width="18" height="18" loading="lazy" /> : <SkillFallback aria-hidden="true" />}
      <span>{name}</span>
    </SkillAnchor>
  );
}

function SourceLink({ href, children }) {
  return (
    <ExternalAnchor href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ExternalLink size={14} aria-hidden="true" />
    </ExternalAnchor>
  );
}

function SectionHeading({ number, title, icon: Icon }) {
  return (
    <SectionHead>
      <SectionIcon><Icon size={18} aria-hidden="true" /></SectionIcon>
      <div><SectionKicker>{number}</SectionKicker><SectionTitle>{title}</SectionTitle></div>
    </SectionHead>
  );
}

function HolyPriestLogReportPage() {
  useEffect(() => {
    document.title = '조나사제 신성 사제 로그 분석 | wowmeta';
    window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      try {
        window.$WowheadPower?.refreshLinks?.();
        window.WH?.Tooltips?.refreshLinks?.();
      } catch (error) {
        // The links still open Wowhead if its optional tooltip script is unavailable.
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Page>
      <Hero>
        <HeroTop>
          <BackLink to="/guide/priest/holy"><ArrowLeft size={16} aria-hidden="true" />신성 사제 가이드</BackLink>
          <Snapshot>12.1 · 2026-09-02 분석</Snapshot>
        </HeroTop>
        <HeroGrid>
          <div>
            <Eyebrow>WARCRAFT LOGS REVIEW · 울라텍 일반</Eyebrow>
            <Title>조나사제 신성 사제 로그 분석</Title>
            <Lead>
              같은 공격대 신성 사제와 전투 길이·인원·아이템 레벨이 가까운 99점 로그를 함께 비교했습니다.
              결론은 과치유나 대상 선택보다 마나를 거의 쓰지 않아 핵심 회전이 멈춘 쪽에 가깝습니다.
            </Lead>
          </div>
          <HeroVerdict>
            <Target size={21} aria-hidden="true" />
            <div>
              <span>한 줄 진단</span>
              <strong>힐을 잘못 꽂은 로그가 아니라, 너무 적게 눌러 평온 회전이 끊긴 로그</strong>
              <p>종료 마나 92.2%와 순간 치유 36회가 가장 먼저 봐야 할 수치입니다.</p>
            </div>
          </HeroVerdict>
        </HeroGrid>
      </Hero>

      <SummaryGrid aria-label="비교 로그 요약">
        {logs.map(log => (
          <Summary key={log.name} $tone={log.tone}>
            <SummaryLabel>{log.label}</SummaryLabel>
            <SummaryName>{log.name}</SummaryName>
            <SummaryDetail>{log.detail}</SummaryDetail>
            <Stats>
              <Stat><span>HPS</span><strong>{log.hps}</strong></Stat>
              <Stat><span>전체 / 장비 백분위</span><strong>{log.percentile}</strong></Stat>
              <Stat><span>시전</span><strong>{log.casts}</strong></Stat>
              <Stat><span>종료 마나</span><strong>{log.mana}</strong></Stat>
              <Stat><span>과치유</span><strong>{log.overheal}</strong></Stat>
              <Stat><span>티어</span><strong>{log.tier}</strong></Stat>
            </Stats>
          </Summary>
        ))}
      </SummaryGrid>

      <ReportLayout>
        <ReportNav aria-label="분석 목차">
          <NavLink href="#verdict">01 손실 경로</NavLink>
          <NavLink href="#casts">02 시전량 비교</NavLink>
          <NavLink href="#benediction">03 축도 중첩</NavLink>
          <NavLink href="#apotheosis">04 절정 구간</NavLink>
          <NavLink href="#talent">05 특성 선택</NavLink>
          <NavLink href="#deaths">06 사망·보정</NavLink>
          <NavLink href="#fix">07 수정 사이클</NavLink>
        </ReportNav>

        <Article>
          <Section id="verdict">
            <SectionHeading number="01 · 핵심 원인" title="손실은 한 줄로 이어집니다" icon={RotateCw} />
            <CauseRail>
              <Cause><b>01</b><strong>마나 92.2% 종료</strong><span>쓸 수 있는 자원을 사실상 남겼습니다.</span></Cause>
              <Cause><b>02</b><strong>순간 치유 16–21회 부족</strong><span>같은 공대 52회, 99점은 57회입니다.</span></Cause>
              <Cause><b>03</b><strong>평온 8회 부족</strong><span>순간 치유가 줄어 평온 재사용 대기시간 회전도 느려졌습니다.</span></Cause>
              <Cause><b>04</b><strong>축도·파장 연쇄 감소</strong><span>평온이 적으니 확정 축도와 후속 광역 치유도 함께 줄었습니다.</span></Cause>
            </CauseRail>
            <Finding>
              <strong>우선순위</strong>
              <p>
                과치유율은 32.9%로 두 비교 로그의 34.0%보다 오히려 낮습니다. 지금은 치유 대상을 더 아끼는 것이 아니라,
                피해가 있는 구간에 <SkillLink id="2061" />를 더 써서 <SkillLink id="2050" />을 다시 당기는 것이 먼저입니다.
              </p>
            </Finding>
          </Section>

          <Section id="casts">
            <SectionHeading number="02 · 시전량과 효율" title="한 번의 품질보다 횟수가 부족했습니다" icon={BarChart3} />
            <SectionLead>
              대상 로그의 핵심 주문 1회당 유효 치유는 같은 공대 사제보다 대부분 높습니다. 즉 대상을 심하게 잘못 고른 것이 아니라,
              치유 기회가 남아 있는데도 주문을 충분히 시전하지 않은 것이 총량 차이의 중심입니다.
            </SectionLead>
            <TableScroll>
              <CompareTable aria-label="핵심 주문 시전 횟수 비교">
                <thead><tr><th>주문</th><th>조나사제</th><th>같은 공대</th><th>99점</th></tr></thead>
                <tbody>
                  {castRows.map(row => (
                    <tr key={row.id}><td><SkillLink id={row.id}>{row.name}</SkillLink></td><td>{row.target}</td><td>{row.peer}</td><td>{row.top}</td></tr>
                  ))}
                </tbody>
              </CompareTable>
            </TableScroll>
            <Subhead>주문 1회당 유효 치유</Subhead>
            <TableScroll>
              <CompareTable aria-label="주문 1회당 유효 치유 비교">
                <thead><tr><th>주문</th><th>조나사제</th><th>같은 공대</th><th>99점</th></tr></thead>
                <tbody>{valueRows.map(row => <tr key={row[0]}>{row.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody>
              </CompareTable>
            </TableScroll>
            <Finding>
              <strong>수치 해석</strong>
              <p>핵심 네 주문 시전 합계는 156회입니다. 같은 공대 사제는 193회로 37회 더 많았습니다. 15레벨 낮은 같은 공대 사제가 HPS도 4.8% 높았던 직접 원인입니다.</p>
            </Finding>
          </Section>

          <Section id="benediction">
            <SectionHeading number="03 · 축도 중첩" title="2중첩을 너무 오래 들고 있었습니다" icon={Gauge} />
            <SectionLead>
              <SkillLink id="1262763" />는 2중첩이 최대입니다. 최대 중첩에서 <SkillLink id="2050" />을 다시 쓰면 다음 축도를 받을 공간이 없어집니다.
              대상은 전투의 28.6%를 2중첩으로 보냈고, 19.8초와 21.4초짜리 긴 방치 구간도 있었습니다.
            </SectionLead>
            <StackRows>
              <StackRow><span>조나사제</span><Track><Fill $width="28.6%" $tone="#d49a58" /></Track><strong>28.6%</strong></StackRow>
              <StackRow><span>같은 공대</span><Track><Fill $width="13.9%" $tone="#75bda9" /></Track><strong>13.9%</strong></StackRow>
              <StackRow><span>99점</span><Track><Fill $width="23.8%" $tone="#8d99a2" /></Track><strong>23.8%</strong></StackRow>
            </StackRows>
            <Timeline aria-label="두 번째 절정 구간 타임라인">
              <TimeEvent><time>218.0초</time><strong>축도 2중첩</strong><span>최대 중첩 진입</span></TimeEvent>
              <TimeEvent><time>230.4초</time><strong>절정</strong><span>2중첩을 든 채 시작</span></TimeEvent>
              <TimeEvent><time>231.6초</time><strong>천상의 찬가</strong><span>절정 약 4초 소모</span></TimeEvent>
              <TimeEvent $bad><time>237.0초</time><strong>평온</strong><span>여전히 2중첩</span></TimeEvent>
              <TimeEvent><time>239.4초</time><strong>첫 축도</strong><span>21.4초 만에 중첩 소비</span></TimeEvent>
            </Timeline>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>로그에는 2중첩 상태의 갱신 이벤트가 9회 있습니다. 이벤트 하나가 곧 확정 손실 1회라는 뜻은 아니지만, 237.0초 평온처럼 중첩을 먼저 쓰지 않은 장면은 명확한 손실입니다.</p>
            </Caution>
          </Section>

          <Section id="apotheosis">
            <SectionHeading number="04 · 절정 구간" title="첫 번째는 괜찮았고, 두 번째가 무너졌습니다" icon={Sparkles} />
            <TableScroll>
              <CompareTable aria-label="절정 구간 비교">
                <thead><tr><th>구간</th><th>시간</th><th>평온</th><th>축도</th><th>쿨기 겹침</th><th>판정</th></tr></thead>
                <tbody>{apotheosisRows.map(row => <tr key={row[0]}>{row.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody>
              </CompareTable>
            </TableScroll>
            <WindowCompare>
              <Window $bad>
                <span>실제 2차 절정</span>
                <strong>축도 2중첩 → 절정 → 천상의 찬가 → 평온 → 축도</strong>
                <p>절정 안에서 찬가를 채널링했고, 최대 중첩 상태로 평온까지 눌렀습니다. 결과는 평온 2회뿐입니다.</p>
              </Window>
              <Window>
                <span>수정 순서</span>
                <strong>축도 소비 → 절정 → 평온 → 축도 → 순간 치유·회복의 기원 → 평온</strong>
                <p>찬가는 다른 피해 구간에 떼어 놓고, 절정 32초는 평온 회전에만 집중합니다.</p>
              </Window>
            </WindowCompare>
          </Section>

          <Section id="talent">
            <SectionHeading number="05 · 특성 선택" title="선택 노드 하나가 전투 내내 비어 있었습니다" icon={ListChecks} />
            <SectionLead>
              같은 공격대 신성 사제와의 특성 차이는 <SkillLink id="372760">천상의 권능</SkillLink> / <SkillLink id="392988">신성한 환영</SkillLink> 선택 노드 하나뿐입니다.
              잠실 로그에서는 신성한 환영이 2.95M의 유효 치유를 냈지만, 대상 로그에는 천상의 권능 시전·버프도 신성한 환영 치유도 없습니다.
            </SectionLead>
            <ChoiceGrid>
              <Choice><strong>운영을 단순하게</strong><p><SkillLink id="392988">신성한 환영</SkillLink>을 선택해 빛의 권능 사용에 따라 자동으로 가치를 받습니다.</p></Choice>
              <Choice><strong>천상의 권능 유지</strong><p><SkillLink id="372760">천상의 권능</SkillLink>을 계획된 평온 구간에 반드시 배정합니다. 선택하고 누르지 않는 상태가 최악입니다.</p></Choice>
            </ChoiceGrid>
          </Section>

          <Section id="deaths">
            <SectionHeading number="06 · 사망과 비교 보정" title="장비 차이와 공대 실수를 분리해야 합니다" icon={CircleAlert} />
            <Notes>
              <Note><strong>사망 4명</strong><p>114.5초 2명, 119.5초 1명, 248.0초 1명이 사망했습니다. Spectral Coils와 Necrotic Vapors가 포함돼 있어 이 수치만으로 개인 힐 실수라고 단정할 수 없습니다.</p></Note>
              <Note><strong>본인 생존은 양호</strong><p>대상은 죽지 않았고 <SkillLink id="586">소실</SkillLink> 4회, <SkillLink id="19236">구원의 기도</SkillLink> 1회를 사용했습니다. 현재 가장 큰 손실은 생존기가 아니라 치유 주문 시전량입니다.</p></Note>
              <Note><strong>티어 4세트 보정</strong><p>99점 로그의 소생 유효 치유는 15.81M, 대상은 7.82M입니다. 대상은 티어 1부위, 99점은 4세트이므로 이 7.99M 차이를 전부 플레이 문제로 보면 안 됩니다.</p></Note>
              <Note><strong>그래도 남는 차이</strong><p>티어가 없는 같은 공대 사제도 순간 치유 52회와 평온 37회를 기록했습니다. 핵심 회전 부족은 장비로 설명되지 않습니다.</p></Note>
            </Notes>
          </Section>

          <Section id="fix">
            <SectionHeading number="07 · 다음 로그 수정안" title="절정은 이 순서로 굴리면 됩니다" icon={CheckCircle2} />
            <CycleRail>
              <Cycle><b>01</b><SkillLink id="33076" /><span>충전이 넘치지 않게 피해 전에 보냅니다.</span></Cycle>
              <Cycle><b>02</b><SkillLink id="1262763" /><span>절정 전에 2중첩이면 먼저 소비합니다.</span></Cycle>
              <Cycle><b>03</b><SkillLink id="200183" /><span>천상의 찬가와 겹치지 않는 피해 구간에 엽니다.</span></Cycle>
              <Cycle><b>04</b><SkillLink id="2050" /><span>즉시 평온을 쓰고 생성된 축도를 바로 이어 갑니다.</span></Cycle>
              <Cycle><b>05</b><SkillLink id="2061" /><span>평온 재사용 대기시간을 당기며 마나를 실제 치유로 바꿉니다.</span></Cycle>
              <Cycle><b>06</b><SkillLink id="2050" /><span>구간 안에서 평온 6회 이상을 목표로 반복합니다.</span></Cycle>
            </CycleRail>
            <Goals>
              {goals.map(([label, value]) => <Goal key={label}><CheckCircle2 size={16} aria-hidden="true" /><span>{label}</span><strong>{value}</strong></Goal>)}
            </Goals>
            <FinalVerdict>
              <strong>고칠 순서</strong>
              <span>마나 사용량 → 순간 치유 수 → 평온 수 → 축도 중첩 → 두 번째 절정 순서로 확인합니다. 과치유와 소생 총량은 그다음 문제입니다.</span>
            </FinalVerdict>
          </Section>

          <Sources>
            <strong>분석 자료</strong>
            <SourceLink href="https://www.warcraftlogs.com/reports/jFKp1nY6zMcJkX3L?fight=45&type=casts&source=32">조나사제 원본 로그</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/jFKp1nY6zMcJkX3L?fight=45&type=healing&source=13">같은 공대 비교</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/7df4Rg2YJHv9VbDj?fight=51&type=healing&source=617">조건 근접 99점 로그</SourceLink>
            <SourceLink href="https://www.wowhead.com/guide/classes/priest/holy/overview-pve-healer">Wowhead 12.1 신성 사제</SourceLink>
          </Sources>
        </Article>
      </ReportLayout>
    </Page>
  );
}

const Page = styled.div`
  width: min(1460px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 72px;
  color: #dfe4e7;

  @media (max-width: 600px) { width: min(100% - 20px, 1460px); padding-top: 18px; }
`;

const Hero = styled.header`
  padding: clamp(20px, 3vw, 34px) 0 30px;
  border-top: 1px solid rgba(213, 178, 115, 0.42);
  border-bottom: 1px solid rgba(168, 178, 188, 0.16);
`;
const HeroTop = styled.div`display:flex; justify-content:space-between; align-items:center; gap:16px;`;
const BackLink = styled(Link)`display:inline-flex; align-items:center; gap:7px; color:#9ba6ad; font-size:.76rem; &:hover{color:#f1f3f4;}`;
const Snapshot = styled.span`color:#b58d5d; font-size:.7rem; font-weight:700; white-space:nowrap;`;
const HeroGrid = styled.div`
  display:grid; grid-template-columns:minmax(0, 1fr) minmax(280px, 390px); gap:clamp(24px, 5vw, 72px); align-items:end; margin-top:28px;
  @media(max-width:820px){grid-template-columns:1fr;}
`;
const Eyebrow = styled.div`color:#b58d5d; font-size:.7rem; font-weight:750;`;
const Title = styled.h1`margin-top:8px; color:#f2f4f5; font-size:clamp(1.9rem, 5vw, 3.55rem); line-height:1.08; letter-spacing:0;`;
const Lead = styled.p`max-width:76ch; margin-top:18px; color:#aab4ba; font-size:clamp(.88rem, 1.5vw, 1rem); line-height:1.82;`;
const HeroVerdict = styled.div`
  display:grid; grid-template-columns:30px minmax(0, 1fr); gap:12px; padding:16px 0; color:#d49a58; border-top:2px solid #d49a58; border-bottom:1px solid rgba(212,154,88,.2);
  span{color:#a88b69; font-size:.68rem; font-weight:700;} strong{display:block; margin-top:5px; color:#eef1f2; font-size:.96rem; line-height:1.5;} p{margin-top:7px; color:#8f9aa1; font-size:.74rem; line-height:1.6;}
`;
const SummaryGrid = styled.section`
  display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-top:24px;
  @media(max-width:980px){grid-template-columns:1fr;}
`;
const Summary = styled.article`min-width:0; padding:17px 0 0; border-top:3px solid ${p => p.$tone};`;
const SummaryLabel = styled.div`color:#7f8c95; font-size:.67rem; font-weight:700;`;
const SummaryName = styled.h2`margin-top:3px; color:#eef1f2; font-size:1.15rem;`;
const SummaryDetail = styled.p`margin-top:5px; color:#7f8b93; font-size:.69rem; line-height:1.55;`;
const Stats = styled.div`display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); margin-top:14px; border-top:1px solid rgba(168,178,188,.13); border-left:1px solid rgba(168,178,188,.13);`;
const Stat = styled.div`min-width:0; padding:9px; border-right:1px solid rgba(168,178,188,.13); border-bottom:1px solid rgba(168,178,188,.13); span{color:#718089; font-size:.62rem;} strong{display:block; margin-top:3px; color:#dce2e5; font-size:.78rem; overflow-wrap:anywhere;}`;
const ReportLayout = styled.div`
  display:grid; grid-template-columns:180px minmax(0,960px); justify-content:center; gap:clamp(26px,4vw,54px); margin-top:48px;
  @media(max-width:980px){grid-template-columns:1fr;}
`;
const ReportNav = styled.nav`
  position:sticky; top:78px; align-self:start; display:grid; border-right:1px solid rgba(168,178,188,.14);
  @media(max-width:980px){position:static; display:flex; overflow-x:auto; border-right:0; border-bottom:1px solid rgba(168,178,188,.14);}
`;
const NavLink = styled.a`padding:9px 8px; color:#89959d; font-size:.73rem; white-space:nowrap; border-top:1px solid rgba(168,178,188,.08); &:hover{color:#f1f3f4;}`;
const Article = styled.article`min-width:0;`;
const Section = styled.section`min-width:0; padding:40px 0 46px; border-top:1px solid rgba(168,178,188,.15); &:first-child{padding-top:0;border-top:0;}`;
const SectionHead = styled.div`display:flex; align-items:center; gap:12px; margin-bottom:20px;`;
const SectionIcon = styled.div`flex:0 0 auto; width:36px; height:36px; display:grid; place-items:center; color:#75bda9; border:1px solid rgba(117,189,169,.38);`;
const SectionKicker = styled.div`color:#87949c; font-size:.66rem; font-weight:700;`;
const SectionTitle = styled.h2`margin-top:3px; color:#f1f3f4; font-size:clamp(1.2rem,2.6vw,1.7rem); line-height:1.3;`;
const SectionLead = styled.p`max-width:84ch; margin-bottom:20px; color:#adb7bd; font-size:.9rem; line-height:1.82;`;
const CauseRail = styled.div`
  display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border-top:1px solid rgba(212,154,88,.38); border-left:1px solid rgba(168,178,188,.12);
  @media(max-width:820px){grid-template-columns:repeat(2,minmax(0,1fr));} @media(max-width:520px){grid-template-columns:1fr;}
`;
const Cause = styled.div`min-width:0; padding:14px; border-right:1px solid rgba(168,178,188,.12); border-bottom:1px solid rgba(168,178,188,.12); b{color:#9d7951;font-size:.65rem;} strong{display:block;margin-top:9px;color:#e7ebed;font-size:.82rem;line-height:1.45;} span{display:block;margin-top:6px;color:#7f8c94;font-size:.69rem;line-height:1.55;}`;
const Finding = styled.div`display:grid; grid-template-columns:84px minmax(0,1fr); gap:14px; margin-top:22px; padding:15px 0; border-top:2px solid #33937f; border-bottom:1px solid rgba(168,178,188,.12); >strong{color:#75bda9;font-size:.73rem;} p{color:#b6c0c5;font-size:.82rem;line-height:1.78;} @media(max-width:560px){grid-template-columns:1fr;gap:6px;}`;
const TableScroll = styled.div`max-width:100%; overflow-x:auto;`;
const CompareTable = styled.table`
  width:100%; min-width:620px; border-collapse:collapse; font-size:.76rem;
  th,td{padding:11px 12px; text-align:right; border-bottom:1px solid rgba(168,178,188,.12);} th:first-child,td:first-child{text-align:left;} th{color:#7d8991;font-size:.65rem;font-weight:700;} td{color:#cfd6da;} tbody tr:hover{background:rgba(117,189,169,.035);}
`;
const Subhead = styled.h3`margin:24px 0 8px; color:#aeb8bd; font-size:.78rem;`;
const StackRows = styled.div`display:grid; gap:12px;`;
const StackRow = styled.div`display:grid; grid-template-columns:90px minmax(80px,1fr) 50px; gap:10px; align-items:center; span{color:#87949c;font-size:.72rem;} strong{color:#dfe4e7;font-size:.74rem;text-align:right;}`;
const Track = styled.div`height:7px; background:rgba(168,178,188,.1);`;
const Fill = styled.div`width:${p => p.$width};height:100%;background:${p => p.$tone};`;
const Timeline = styled.div`
  display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); margin-top:24px; border-top:2px solid #4c5961;
  @media(max-width:760px){grid-template-columns:1fr; border-top:0; border-left:2px solid #4c5961;}
`;
const TimeEvent = styled.div`min-width:0; padding:12px; border-right:1px solid rgba(168,178,188,.12); border-bottom:1px solid rgba(168,178,188,.12); background:${p => p.$bad ? 'rgba(212,154,88,.08)' : 'transparent'}; time{color:#78858d;font-size:.63rem;} strong{display:block;margin-top:5px;color:${p => p.$bad ? '#efc389' : '#e1e6e8'};font-size:.76rem;} span{display:block;margin-top:4px;color:#7c8991;font-size:.65rem;line-height:1.45;}`;
const Caution = styled.div`display:grid; grid-template-columns:24px minmax(0,1fr); gap:10px; margin-top:20px; padding:13px 14px; color:#d5b273; border-left:3px solid #d5b273; background:rgba(213,178,115,.06); p{color:#c5b9a6;font-size:.77rem;line-height:1.65;}`;
const WindowCompare = styled.div`display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px; margin-top:24px; @media(max-width:760px){grid-template-columns:1fr;}`;
const Window = styled.div`min-width:0; padding:15px 0; border-top:2px solid ${p => p.$bad ? '#d49a58' : '#33937f'}; border-bottom:1px solid rgba(168,178,188,.12); span{color:#829099;font-size:.67rem;} strong{display:block;margin-top:8px;color:#e5e9eb;font-size:.82rem;line-height:1.62;} p{margin-top:7px;color:#849199;font-size:.72rem;line-height:1.6;}`;
const ChoiceGrid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;@media(max-width:700px){grid-template-columns:1fr;}`;
const Choice = styled.div`padding:14px 0;border-top:2px solid #46535b;border-bottom:1px solid rgba(168,178,188,.12);>strong{color:#e3e7e9;font-size:.83rem;}p{margin-top:9px;color:#8d99a1;font-size:.77rem;line-height:1.7;}`;
const Notes = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 26px;@media(max-width:720px){grid-template-columns:1fr;}`;
const Note = styled.div`padding:14px 0;border-top:1px solid rgba(168,178,188,.12);strong{color:#dce2e5;font-size:.8rem;}p{margin-top:6px;color:#849199;font-size:.74rem;line-height:1.68;}`;
const CycleRail = styled.ol`
  display:grid;grid-template-columns:repeat(6,minmax(0,1fr));list-style:none;border-top:1px solid rgba(117,189,169,.38);border-left:1px solid rgba(168,178,188,.12);
  @media(max-width:920px){grid-template-columns:repeat(3,minmax(0,1fr));}@media(max-width:560px){grid-template-columns:1fr;}
`;
const Cycle = styled.li`min-width:0;min-height:154px;padding:13px;border-right:1px solid rgba(168,178,188,.12);border-bottom:1px solid rgba(168,178,188,.12);b{display:block;color:#66747d;font-size:.63rem;}a{margin-top:12px;} >span{display:block;margin-top:9px;color:#7f8c94;font-size:.68rem;line-height:1.55;}@media(max-width:560px){min-height:0;}`;
const Goals = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:24px;border-top:1px solid rgba(168,178,188,.14);border-left:1px solid rgba(168,178,188,.14);@media(max-width:620px){grid-template-columns:1fr;}`;
const Goal = styled.div`display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:9px;align-items:center;min-width:0;padding:11px;color:#75bda9;border-right:1px solid rgba(168,178,188,.14);border-bottom:1px solid rgba(168,178,188,.14);span{color:#929ea5;font-size:.72rem;}strong{color:#e1e6e8;font-size:.74rem;text-align:right;}`;
const FinalVerdict = styled.div`display:grid;grid-template-columns:84px minmax(0,1fr);gap:12px;margin-top:22px;padding:14px 0;border-top:2px solid #33937f;border-bottom:1px solid rgba(168,178,188,.12);strong{color:#75bda9;font-size:.73rem;}span{color:#b6c0c5;font-size:.79rem;line-height:1.68;}@media(max-width:560px){grid-template-columns:1fr;gap:5px;}`;
const Sources = styled.footer`display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;padding-top:20px;border-top:1px solid rgba(168,178,188,.14);>strong{color:#7d8a93;font-size:.69rem;}`;
const ExternalAnchor = styled.a`display:inline-flex;align-items:center;gap:6px;color:#b8c1c6;font-size:.69rem;font-weight:650;&:hover{color:#f1f3f4;}`;
const SkillAnchor = styled.a`
  display:inline-flex;align-items:center;gap:4px;max-width:100%;color:#e7c46f;font-weight:680;line-height:1.35;vertical-align:-.16em;white-space:nowrap;border-bottom:1px solid rgba(231,196,111,.22);
  img{flex:0 0 auto;width:1.08em;height:1.08em;object-fit:cover;border:1px solid rgba(255,209,102,.38);border-radius:3px;}
  &:hover{color:#f7dda0;border-bottom-color:rgba(247,221,160,.75);}
`;
const SkillFallback = styled.span`width:1.08em;height:1.08em;border:1px solid rgba(255,209,102,.38);background:rgba(255,209,102,.16);`;

export default HolyPriestLogReportPage;
