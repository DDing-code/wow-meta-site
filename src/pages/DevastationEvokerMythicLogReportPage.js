import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Gauge,
  GitBranch,
  ListChecks,
  Target,
  Zap,
} from 'lucide-react';
import kbSkills from '../data/kb-skills.json';
import LogReportSidebarList from '../components/LogReportSidebarList.js';

const skills = kbSkills.skills || {};

const controlledRows = [
  {
    boss: '영혼살무사 네크잘리',
    target: '315 · 8:46.853 · 159.4k',
    reference: '316 · 8:46.879 · 206.2k',
    rank: '45점 → 98점',
    gap: '-22.7%',
  },
  {
    boss: '길 잃은 탐험가',
    target: '315 · 7:05.264 · 214.6k',
    reference: '316 · 7:00.332 · 268.5k',
    rank: '43점 → 96점',
    gap: '-20.1%',
  },
];

const nekzaliRows = [
  { id: '356995', target: '136회 · 41.60M', reference: '160회 · 55.27M', detail: '시전 24회, 피해 13.67M 부족' },
  { id: '436335', target: '버프 57회', reference: '버프 66회', detail: '강화 주문 뒤 다중 대상 채널 9회 차이' },
  { id: '357210', target: '20회 · 12.25M', reference: '22회 · 17.24M', detail: '피해 이벤트 496 / 673' },
  { id: '357208', target: '27회 · 2.59M', reference: '30회 · 5.66M', detail: '직접+지속 피해 이벤트 350 / 601' },
  { id: '359073', target: '31회 · 12.10M', reference: '33회 · 16.13M', detail: '적중 342 / 410' },
  { id: '375802', target: '발동 79회', reference: '발동 109회', detail: '불의 숨결 적중 차이가 필러 발동까지 이어짐' },
];

const explorerRows = [
  { id: '356995', target: '119회 · 44.26M', reference: '125회 · 52.81M', detail: '피해 틱 796 / 864' },
  { id: '436335', target: '버프 48회', reference: '버프 56회', detail: '가동 시간 79.85초 / 91.46초' },
  { id: '357210', target: '17회 · 12.09M', reference: '18회 · 20.53M', detail: '피해 이벤트 510 / 757' },
  { id: '357208', target: '22회 · 4.23M', reference: '24회 · 6.76M', detail: '직접+지속 피해 이벤트 599 / 788' },
  { id: '359073', target: '24회 · 17.12M', reference: '27회 · 20.09M', detail: '적중 425 / 461' },
  { id: '375802', target: '발동 61회', reference: '발동 93회', detail: '즉시 살아있는 불꽃 기회 32회 차이' },
];

const damageRows = {
  nekzali: [
    { id: '356995', target: 41.6, reference: 55.27 },
    { id: '357210', target: 12.25, reference: 17.24 },
    { id: '359073', target: 12.1, reference: 16.13 },
    { id: '357208', target: 2.59, reference: 5.66 },
  ],
  explorers: [
    { id: '356995', target: 44.26, reference: 52.81 },
    { id: '357210', target: 12.09, reference: 20.53 },
    { id: '359073', target: 17.12, reference: 20.09 },
    { id: '357208', target: 4.23, reference: 6.76 },
  ],
};

const targetShareRows = [
  { name: '일등항해사 나마', target: 34.99, targetShare: 38.3, reference: 39.73, referenceShare: 35.2 },
  { name: '무역상 게보', target: 29.43, targetShare: 32.3, reference: 33.65, referenceShare: 29.8 },
  { name: '두루마리현자 이쿠', target: 26.83, targetShare: 29.4, reference: 39.48, referenceShare: 35.0 },
];

const cooldownTimelines = [
  {
    title: '영혼살무사 네크잘리 · 526.9초',
    duration: 527,
    rows: [
      { owner: 'Etretat', marks: [2.4, 125.3, 250.0, 374.1, 499.9] },
      { owner: '98점 비교', marks: [0.8, 121.8, 242.0, 369.4, 490.2] },
    ],
  },
  {
    title: '길 잃은 탐험가 · 약 423초',
    duration: 425,
    rows: [
      { owner: 'Etretat', marks: [2.5, 122.9, 243.9, 369.5] },
      { owner: '96점 비교', marks: [0.6, 121.2, 241.5, 362.8] },
    ],
  },
];

function iconUrl(skill) {
  return skill?.iconUrls?.small || skill?.iconUrls?.medium || skill?.iconUrl || '';
}

function SkillLink({ id, children }) {
  const skill = skills[String(id)] || {};
  const name = children || skill.koreanName || skill.name || '스킬';
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

function CastTable({ rows, label }) {
  return (
    <TableScroll tabIndex="0">
      <CompareTable aria-label={label}>
        <thead><tr><th>주문</th><th>Etretat</th><th>상위 비교</th><th>차이</th></tr></thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <th><SkillLink id={row.id} /></th>
              <td>{row.target}</td>
              <td>{row.reference}</td>
              <td>{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </CompareTable>
    </TableScroll>
  );
}

function DamageBars({ rows }) {
  return (
    <MetricList>
      {rows.map(row => {
        const max = Math.max(row.target, row.reference);
        return (
          <MetricRow key={row.id}>
            <SkillLink id={row.id} />
            <Bars>
              <BarLine><b>Etretat</b><BarTrack><BarFill $width={`${(row.target / max) * 100}%`} $tone="#d79555" /></BarTrack><em>{row.target.toFixed(2)}M</em></BarLine>
              <BarLine><b>상위</b><BarTrack><BarFill $width={`${(row.reference / max) * 100}%`} $tone="#66b6a1" /></BarTrack><em>{row.reference.toFixed(2)}M</em></BarLine>
            </Bars>
          </MetricRow>
        );
      })}
    </MetricList>
  );
}

function Timeline({ title, duration, rows }) {
  return (
    <TimelineBlock>
      <TimelineTitle>{title}</TimelineTitle>
      <TimelineScroll>
        <TimelineCanvas>
          <Scale aria-hidden="true"><span>0초</span><span>{Math.round(duration / 2)}초</span><span>{duration}초</span></Scale>
          {rows.map(row => (
            <TimelineRow key={row.owner}>
              <TimelineLabel><b>{row.owner}</b><SkillLink id="375087" /></TimelineLabel>
              <Track>
                {row.marks.map(mark => (
                  <TimelineMark
                    key={mark}
                    $left={`${(mark / duration) * 100}%`}
                    $reference={row.owner.includes('점')}
                    title={`${mark.toFixed(1)}초`}
                    aria-label={`${mark.toFixed(1)}초`}
                  />
                ))}
              </Track>
              <TimelineTimes>{row.marks.map(mark => Math.round(mark)).join(' · ')}초</TimelineTimes>
            </TimelineRow>
          ))}
        </TimelineCanvas>
      </TimelineScroll>
    </TimelineBlock>
  );
}

function DevastationEvokerMythicLogReportPage() {
  useEffect(() => {
    document.title = 'Etretat 황폐 기원사 신화 로그 분석 | wowmeta';
    window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      try {
        window.$WowheadPower?.refreshLinks?.();
        window.WH?.Tooltips?.refreshLinks?.();
      } catch (error) {
        // The report remains usable when Wowhead's optional tooltip script is unavailable.
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Page>
      <ResponsiveStyles />
      <Hero>
        <HeroTop>
          <BackLink to="/logs/evoker-devastation"><ArrowLeft size={16} aria-hidden="true" />황폐 기원사 로그 분석 목록</BackLink>
          <Snapshot>12.1 · 신화 · 2026-09-05 분석</Snapshot>
        </HeroTop>
        <HeroGrid>
          <div>
            <Eyebrow>WARCRAFT LOGS REVIEW · 맹독 심연 신화</Eyebrow>
            <Title>Etretat 황폐 기원사<br />신화 2킬 분석</Title>
            <Lead>
              현재 신화 처치인 영혼살무사 네크잘리와 길 잃은 탐험가를 장비 레벨 315~316,
              거의 같은 전투 길이의 98점·96점 황폐 로그와 원시 시전·피해·버프 이벤트로 비교했습니다.
            </Lead>
          </div>
          <HeroVerdict>
            <Target size={21} aria-hidden="true" />
            <div>
              <span>결론 먼저</span>
              <strong>극딜은 안 망가졌습니다. 다중 대상 한 줄을 덜 맞히고 있습니다.</strong>
              <p><SkillLink id="375087" /> 횟수와 연장은 정상입니다. 실제 격차의 대부분은 <SkillLink id="356995" /> 처리량과 <SkillLink id="357210" />·<SkillLink id="357208" />의 대상 포착에서 생겼습니다.</p>
            </div>
          </HeroVerdict>
        </HeroGrid>
      </Hero>

      <SnapshotStrip aria-label="분석 요약">
        <SnapshotItem><span>네크잘리</span><strong>159.4k → 206.2k</strong><small>동일한 526.9초 · -22.7%</small></SnapshotItem>
        <SnapshotItem><span>길 잃은 탐험가</span><strong>214.6k → 268.5k</strong><small>425.3초 / 420.3초 · -20.1%</small></SnapshotItem>
        <SnapshotItem><span>극딜 검증</span><strong>용의 분노 정상</strong><small>횟수·총 지속시간 모두 비교군 수준</small></SnapshotItem>
        <SnapshotItem><span>먼저 고칠 것</span><strong>대상 포착</strong><small>대규모 파열 → 날개지도자 → 깊은 숨결</small></SnapshotItem>
      </SnapshotStrip>

      <ReportLayout>
        <ReportNav aria-label="분석 목차">
          <NavLink href="#method">01 비교 기준</NavLink>
          <NavLink href="#diagnosis">02 핵심 진단</NavLink>
          <NavLink href="#cooldowns">03 잘한 부분</NavLink>
          <NavLink href="#nekzali">04 네크잘리</NavLink>
          <NavLink href="#explorers">05 탐험가</NavLink>
          <NavLink href="#mechanism">06 손실 구조</NavLink>
          <NavLink href="#fix">07 교정 순서</NavLink>
          <LogReportSidebarList />
        </ReportNav>

        <Article>
          <Section id="method">
            <SectionHeading number="01 · 비교 기준" title="킬 타임과 장비 구간부터 맞췄습니다" icon={Gauge} />
            <SectionLead>
              대상 기록은 2026년 9월 1일 보고서의 20인 신화 처치입니다. 네크잘리는 전투 길이가 0.026초,
              탐험가는 4.932초 차이인 장비 레벨 316 황폐 로그를 비교군으로 골랐습니다. 비교군은 같은 플레이어의 98점·96점 기록이라
              두 우두머리 사이 운용 기준도 일관됩니다.
            </SectionLead>
            <TableScroll tabIndex="0">
              <CompareTable aria-label="신화 로그 통제 비교">
                <thead><tr><th>우두머리</th><th>Etretat 조건</th><th>상위 비교 조건</th><th>현재 점수</th><th>DPS 격차</th></tr></thead>
                <tbody>
                  {controlledRows.map(row => <tr key={row.boss}><th>{row.boss}</th><td>{row.target}</td><td>{row.reference}</td><td>{row.rank}</td><td><Gap>{row.gap}</Gap></td></tr>)}
                </tbody>
              </CompareTable>
            </TableScroll>
            <MethodNotes>
              <p><strong>같은 조건:</strong> 20인 신화, 12.1 파티션, 비늘사령관, 시즌 2 4세트입니다.</p>
              <p><strong>남은 차이:</strong> 다른 공격대와 장비 세부 옵션은 통제할 수 없습니다. 아래에서 주 능력치 차이와 공격대 사망을 따로 표시했습니다.</p>
            </MethodNotes>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>백분위는 재집계에 따라 바뀝니다. 결론은 2026-09-05에 확인한 점수보다 저장된 시전 횟수, 타임스탬프, 피해 이벤트를 우선합니다.</p>
            </Caution>
          </Section>

          <Section id="diagnosis">
            <SectionHeading number="02 · 핵심 진단" title="한 번의 실수가 아니라 같은 손실이 연쇄됩니다" icon={GitBranch} />
            <CauseRail>
              <Cause><b>01 · 적용</b><strong><SkillLink id="357208" /> 적중 이벤트 부족</strong><span>네크잘리 350 / 601, 탐험가 599 / 788입니다.</span></Cause>
              <Cause><b>02 · 발동</b><strong><SkillLink id="375802" /> 기회 감소</strong><span>네크잘리 79 / 109, 탐험가 61 / 93입니다.</span></Cause>
              <Cause><b>03 · 소비</b><strong><SkillLink id="356995" />·<SkillLink id="436335" /> 감소</strong><span>정수 소비와 다중 대상 채널이 함께 줄었습니다.</span></Cause>
              <Cause><b>04 · 회수</b><strong><SkillLink id="441206" /> 효과 감소</strong><span>깊은 숨결이 늦게 돌아오고 실제 경로 적중도 줄었습니다.</span></Cause>
            </CauseRail>
            <BodyCopy>
              <SkillLink id="357208" />이 여러 대상에 오래 남으면 <SkillLink id="375802" />으로 즉시 <SkillLink id="361469" />을 얻을 기회가 늘고,
              이는 <SkillLink id="359618" />과 <SkillLink id="356995" /> 소비로 이어집니다. 소비가 많을수록 <SkillLink id="375777" />와 시즌 2 4세트가
              강화 주문을 당기고, 강화 주문은 다시 <SkillLink id="436335" />을 준비합니다. 이 채널이 여러 대상을 맞혀야 <SkillLink id="441206" />로
              다음 <SkillLink id="357210" />까지 빨라집니다. Etretat의 수치는 이 연결 고리 전체가 상위 로그보다 한 단계 느리다는 쪽으로 일관됩니다.
            </BodyCopy>
          </Section>

          <Section id="cooldowns">
            <SectionHeading number="03 · 잘한 부분" title="용의 분노를 더 늘리는 것이 1순위는 아닙니다" icon={CheckCircle2} />
            <StrengthGrid>
              <Strength><strong><SkillLink id="375087" /> 횟수</strong><span>네크잘리 5 / 5, 탐험가 4 / 4로 같습니다.</span></Strength>
              <Strength><strong>총 극딜 지속시간</strong><span>네크잘리 158.05 / 153.48초, 탐험가 129.51 / 129.90초입니다.</span></Strength>
              <Strength><strong><SkillLink id="1292321" /> 회수</strong><span>15 / 18, 15 / 10입니다. 12.1 후속 사이클은 대체로 작동합니다.</span></Strength>
              <Strength><strong><SkillLink id="358267" /> 사용</strong><span>35 / 34, 31 / 27입니다. 이동기 버튼 수가 부족한 로그는 아닙니다.</span></Strength>
            </StrengthGrid>
            {cooldownTimelines.map(timeline => <Timeline key={timeline.title} {...timeline} />)}
            <Finding>
              <CheckCircle2 size={18} aria-hidden="true" />
              <div><strong>연장은 정상이고, 마지막 극딜만 조금씩 밀렸습니다.</strong><p>네크잘리는 다섯 번째 <SkillLink id="375087" />가 비교군보다 9.7초, 탐험가는 네 번째가 6.7초 늦었습니다. 횟수와 지속시간은 확보했으므로 큰 구조 변경보다 앞 사이클의 작은 지연을 줄이면 됩니다.</p></div>
            </Finding>
          </Section>

          <Section id="nekzali">
            <SectionHeading number="04 · 영혼살무사 네크잘리" title="24회의 파열과 추가 대상 경로에서 벌어졌습니다" icon={BarChart3} />
            <SectionLead>
              전투 길이는 사실상 같습니다. Etretat은 총 83.99M, 비교군은 108.65M을 기록했습니다.
              가장 큰 단일 차이는 <SkillLink id="356995" /> 13.67M이며, 다음이 <SkillLink id="357210" /> 4.99M입니다.
            </SectionLead>
            <DamageBars rows={damageRows.nekzali} />
            <CastTable rows={nekzaliRows} label="네크잘리 주문 비교" />
            <Subhead>어느 대상에서 빠졌는가</Subhead>
            <TableScroll tabIndex="0">
              <CompareTable aria-label="네크잘리 대상별 피해">
                <thead><tr><th>대상</th><th>Etretat</th><th>상위 비교</th><th>차이</th></tr></thead>
                <tbody>
                  <tr><th>영혼살무사 네크잘리</th><td>46.77M</td><td>60.35M</td><td>-13.58M</td></tr>
                  <tr><th>불안한 아마니</th><td>24.39M</td><td>28.08M</td><td>-3.69M</td></tr>
                  <tr><th>자와에의 메아리</th><td>10.95M</td><td>20.23M</td><td>-9.27M</td></tr>
                  <tr><th>익사한 메아리</th><td>1.88M</td><td>0</td><td>Etretat 쪽에만 있던 추가 대상</td></tr>
                </tbody>
              </CompareTable>
            </TableScroll>
            <Finding $warn>
              <CircleAlert size={18} aria-hidden="true" />
              <div>
                <strong><SkillLink id="357211" /> 8회가 무조건 오답은 아니지만, 이 로그에서는 우선 대상 손실과 같이 나타났습니다.</strong>
                <p>Etretat은 수동 <SkillLink id="357211" /> 피해 2.80M 중 2.57M을 불안한 아마니에 넣었습니다. 비교군은 수동 시전이 없고 <SkillLink id="356995" />을 24회 더 사용해 우두머리와 자와에의 메아리에서만 19.54M을 더 만들었습니다. 아마니 순간 광역 담당이 아니라면 강화 주문 뒤 <SkillLink id="436335" />을 먼저 쓰고, 일반 소비도 우선 대상 <SkillLink id="356995" /> 중심으로 바꾸는 편이 낫습니다.</p>
              </div>
            </Finding>
          </Section>

          <Section id="explorers">
            <SectionHeading number="05 · 길 잃은 탐험가" title="세 대상을 균형 있게 때리는 각도가 부족했습니다" icon={Target} />
            <SectionLead>
              Etretat은 총 91.25M, 비교군은 112.86M입니다. 전체 시전 속도는 분당 40.35회와 41.25회로 큰 차이가 없지만,
              공격 주문 이벤트는 분당 32.03회와 34.40회였습니다. 이 전투는 손이 완전히 쉰 문제보다 어떤 대상에 다중 대상 주문을 걸었는지가 더 큽니다.
            </SectionLead>
            <DamageBars rows={damageRows.explorers} />
            <CastTable rows={explorerRows} label="길 잃은 탐험가 주문 비교" />
            <Subhead>세 대상 피해 분배</Subhead>
            <TargetShareList>
              {targetShareRows.map(row => (
                <TargetShare key={row.name}>
                  <TargetName><strong>{row.name}</strong><span>Etretat {row.target.toFixed(2)}M · 상위 {row.reference.toFixed(2)}M</span></TargetName>
                  <ShareBars>
                    <ShareLine><b>Etretat</b><BarTrack><BarFill $width={`${row.targetShare * 2}%`} $tone="#d79555" /></BarTrack><em>{row.targetShare}%</em></ShareLine>
                    <ShareLine><b>상위</b><BarTrack><BarFill $width={`${row.referenceShare * 2}%`} $tone="#66b6a1" /></BarTrack><em>{row.referenceShare}%</em></ShareLine>
                  </ShareBars>
                </TargetShare>
              ))}
            </TargetShareList>
            <BodyCopy>
              세 우두머리는 생명력을 맞춰야 하고 한 번에 보통 두 대상만 붙습니다. 비교군은 나마 35.2%, 이쿠 35.0%로 거의 균형을 맞췄지만,
              Etretat은 이쿠가 29.4%에 그쳤습니다. 총 피해 차이 21.61M 중 12.65M, 약 58.5%가 이쿠에서 나왔습니다.
              이는 이쿠가 붙는 구간에 <SkillLink id="436335" />의 주 대상과 <SkillLink id="357210" />·<SkillLink id="357208" /> 방향을 바꾸지 못했을 가능성을 보여 줍니다.
            </BodyCopy>

            <Subhead><SkillLink id="1266151" /> 두 번째 시전</Subhead>
            <DeepGrid>
              <DeepCard $tone="#d79555"><span>Etretat</span><strong>성공 간격 평균 8.5초</strong><p>17회 시전. 367.1초 첫 <SkillLink id="357210" /> 뒤 무료 재시전 버프가 385.1초에 만료되어 한 번을 잃었습니다.</p></DeepCard>
              <DeepCard $tone="#66b6a1"><span>96점 비교</span><strong>성공 간격 평균 2.3초</strong><p>18회 시전. 아홉 쌍을 모두 회수했고 두 번째 사용을 1.5~3.4초 안에 이어 갔습니다.</p></DeepCard>
            </DeepGrid>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>Etretat 공격대는 이 전투에서 총 10명이 사망했고 비교 공격대는 0명이었습니다. Etretat 본인은 종료 1.5초 전까지 시전했으므로 개인 사망 손실은 아니지만, 탱킹 위치와 외부 강화 효과가 달라진 점은 비교의 오차입니다.</p>
            </Caution>
          </Section>

          <Section id="mechanism">
            <SectionHeading number="06 · 왜 차이가 커졌는가" title="피해량보다 회전 수가 함께 줄었습니다" icon={Zap} />
            <MechanicBand>
              <div><strong>직접 피해 차이</strong><p>Etretat은 지능 3,044, 비교군은 3,239~3,246이었습니다. 비교군은 특화도 884~958로 Etretat의 341보다 높습니다. 이 차이는 주문 한 번당 피해를 낮추므로 모든 격차를 운용 탓으로 돌릴 수 없습니다.</p></div>
              <div><strong>회전 차이</strong><p>장비 차이로 설명되지 않는 것은 시전·적중 횟수입니다. 네크잘리에서 <SkillLink id="356995" /> 24회, 탐험가에서 <SkillLink id="436335" /> 버프 8회, 두 전투 모두 <SkillLink id="357210" /> 적중 이벤트가 크게 부족합니다.</p></div>
            </MechanicBand>
            <BodyCopy>
              네크잘리는 <SkillLink id="356995" /> 피해 틱이 786 대 944였고, 탐험가는 796 대 864였습니다. 다만 황폐의 채널 연계는 남은 틱을 다음 채널로 넘길 수 있고
              <SkillLink id="436335" />은 다중 대상 틱을 추가하므로, 이 합계만으로 “채널을 몇 번 끊었다”고 단정할 수는 없습니다. 확실히 말할 수 있는 것은
              소비 총량과 다중 대상 채널 총량이 둘 다 낮았다는 점입니다.
            </BodyCopy>
            <Finding>
              <CheckCircle2 size={18} aria-hidden="true" />
              <div><strong>장비는 복사하지 말고 개인 시뮬레이션으로 확인해야 합니다.</strong><p>Etretat은 비교군보다 가속·치명타가 높고 특화가 낮습니다. 로그 한 개만 보고 특화로 전부 바꾸지 말고, 현재 장비를 Raidbots Top Gear와 Droptimizer로 확인한 뒤 실제 교체만 반영하세요.</p></div>
            </Finding>
          </Section>

          <Section id="fix">
            <SectionHeading number="07 · 다음 로그 교정안" title="이 순서로 하나씩 고치면 됩니다" icon={ListChecks} />
            <PriorityList>
              <Priority><b>1</b><div><strong><SkillLink id="357210" /> 경로를 시전 전에 정하기</strong><p>현재 붙어 있는 두 우두머리 또는 우두머리+핵심 추가 대상을 한 줄에 둡니다. 이동용으로 길게 끌지 말고 필요한 대상을 지난 즉시 이탈해 다음 주문으로 복귀합니다.</p></div></Priority>
              <Priority><b>2</b><div><strong><SkillLink id="1266151" /> 무료 재시전을 3~5초 안에 회수하기</strong><p>즉시 재사용이 위험하면 미룰 수 있지만 18초 만료는 금지입니다. 별도 아이콘이나 음성 알림으로 남은 재시전 시간을 추적합니다.</p></div></Priority>
              <Priority><b>3</b><div><strong>강화 주문 뒤 <SkillLink id="436335" />부터 소비하기</strong><p>오래 사는 우선 대상을 주 대상으로 잡고 붙어 있는 대상을 함께 맞힙니다. 이 적중 수가 <SkillLink id="441206" />의 다음 깊은 숨결 시간을 결정합니다.</p></div></Priority>
              <Priority><b>4</b><div><strong><SkillLink id="357208" /> 1단을 두 대상 방향으로 넣기</strong><p>네크잘리는 우두머리와 당시 살아 있는 핵심 추가 대상, 탐험가는 현재 붙은 두 우두머리를 함께 맞힙니다. 지속 피해 이벤트가 늘어야 <SkillLink id="375802" />과 <SkillLink id="361469" />도 따라옵니다.</p></div></Priority>
              <Priority><b>5</b><div><strong>네크잘리 수동 <SkillLink id="357211" /> 조건 좁히기</strong><p>세 대상이 충분히 오래 살고 모두에게 즉시 피해가 필요할 때만 씁니다. 핵심 추가 대상이나 우두머리 피해가 우선이면 <SkillLink id="436335" />과 <SkillLink id="356995" />을 유지합니다.</p></div></Priority>
              <Priority><b>6</b><div><strong>잘하던 <SkillLink id="375087" />·<SkillLink id="1292321" />은 유지하기</strong><p>극딜 연장을 새로 뜯어고치지 않습니다. 앞선 강화 주문·소비 회전이 빨라지면 마지막 사용 지연만 자연스럽게 줄어듭니다.</p></div></Priority>
            </PriorityList>

            <Subhead>같은 전투 길이에서 확인할 숫자</Subhead>
            <TableScroll tabIndex="0">
              <CompareTable aria-label="다음 로그 확인 수치">
                <thead><tr><th>전투</th><th>유지할 것</th><th>1차 목표</th><th>대상 포착</th></tr></thead>
                <tbody>
                  <tr><th>영혼살무사 네크잘리 · 약 527초</th><td><SkillLink id="375087" /> 5회 · 총 150초 이상</td><td><SkillLink id="356995" /> 150회 이상 · <SkillLink id="436335" /> 60회 이상</td><td><SkillLink id="357210" /> 22회 전후 · 피해 이벤트/시전 30 전후</td></tr>
                  <tr><th>길 잃은 탐험가 · 약 420초</th><td><SkillLink id="375087" /> 4회 · 총 128~132초</td><td><SkillLink id="356995" /> 125회 전후 · <SkillLink id="436335" /> 55회 전후</td><td>무료 깊은 숨결 만료 0회 · 이쿠 생명력에 맞춰 주 대상 전환</td></tr>
                </tbody>
              </CompareTable>
            </TableScroll>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>위 횟수는 이번 비교와 비슷한 킬 타임에서만 쓰는 점검선입니다. 전투 시간이 바뀌면 분당 시전과 우두머리별 생명력 균형을 우선하고 절대 횟수는 다시 환산해야 합니다.</p>
            </Caution>
          </Section>

          <Sources>
            <strong>원본·교차검증</strong>
            <SourceLink href="https://www.warcraftlogs.com/character/kr/%EC%95%84%EC%A6%88%EC%83%A4%EB%9D%BC/etretat?difficulty=5">Etretat 신화 기록</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/T67VN4hkq3BgMpvC?fight=5&source=252&type=damage-done">네크잘리 원본</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/Nwt6VLqD1hX24xdr?fight=27&source=286&type=damage-done">네크잘리 98점 비교</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/T67VN4hkq3BgMpvC?fight=30&source=252&type=damage-done">탐험가 원본</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/xZMyLq2FkQ7Czd1D?fight=56&source=6&type=damage-done">탐험가 96점 비교</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/api/docs">Warcraft Logs API</SourceLink>
            <SourceLink href="https://www.wowhead.com/ko/guide/classes/evoker/devastation/rotation-cooldowns-pve-dps">Wowhead 12.1 황폐 운용</SourceLink>
            <SourceLink href="https://www.wowhead.com/ko/spell=1266151">Wowhead 공중 포격</SourceLink>
            <SourceLink href="https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-lost-explorers-boss-strategy-abilities">Wowhead 탐험가 공략</SourceLink>
          </Sources>
        </Article>
      </ReportLayout>
    </Page>
  );
}

const Page = styled.div`min-height:100vh;color:#dce3e5;background:#0a1014;word-break:keep-all;overflow-wrap:break-word;letter-spacing:0;`;
const Hero = styled.header`padding:34px max(24px,calc((100vw - 1180px)/2)) 38px;border-bottom:1px solid rgba(255,255,255,.09);background:#0d151a;`;
const HeroTop = styled.div`display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:34px;`;
const BackLink = styled(Link)`display:inline-flex;align-items:center;gap:7px;color:#93a2aa;font-size:.78rem;font-weight:700;text-decoration:none;&:hover{color:#eef2f3;}`;
const Snapshot = styled.span`color:#c79560;font-size:.72rem;font-weight:800;`;
const HeroGrid = styled.div`display:grid;grid-template-columns:minmax(0,1.45fr) minmax(300px,.75fr);gap:52px;align-items:end;max-width:1180px;margin:0 auto;`;
const Eyebrow = styled.p`margin:0 0 10px;color:#cf9658;font-size:.73rem;font-weight:800;`;
const Title = styled.h1`margin:0;color:#f4f6f6;font-size:2.65rem;line-height:1.14;letter-spacing:0;`;
const Lead = styled.p`max-width:720px;margin:18px 0 0;color:#9eabb1;font-size:.98rem;line-height:1.8;`;
const HeroVerdict = styled.div`display:flex;gap:13px;padding:19px 0 19px 18px;border-left:3px solid #d79555;background:rgba(255,255,255,.025);svg{flex:none;color:#d79555;}span{display:block;color:#c89257;font-size:.69rem;font-weight:800;}strong{display:block;margin-top:5px;color:#f0f2f2;font-size:1rem;line-height:1.5;}p{margin:8px 0 0;color:#9da9af;font-size:.76rem;line-height:1.65;}`;
const SnapshotStrip = styled.section`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));width:min(1180px,calc(100% - 48px));margin:28px auto 0;border:1px solid rgba(255,255,255,.1);background:#0d1418;`;
const SnapshotItem = styled.div`min-width:0;padding:16px 18px;border-right:1px solid rgba(255,255,255,.08);&:last-child{border-right:0;}span,small{display:block;color:#79878e;font-size:.65rem;}strong{display:block;margin:5px 0;color:#eef1f2;font-size:.96rem;line-height:1.4;}small{line-height:1.45;}`;
const ReportLayout = styled.div`display:grid;grid-template-columns:188px minmax(0,1fr);gap:44px;width:min(1180px,calc(100% - 48px));margin:50px auto 0;padding-bottom:64px;`;
const ReportNav = styled.nav`position:sticky;top:86px;align-self:start;display:grid;border-top:1px solid rgba(255,255,255,.12);`;
const NavLink = styled.a`padding:12px 4px;border-bottom:1px solid rgba(255,255,255,.08);color:#77858d;font-size:.7rem;font-weight:700;text-decoration:none;&:hover{color:#e3e8e9;}`;
const Article = styled.article`min-width:0;`;
const Section = styled.section`scroll-margin-top:90px;padding:0 0 54px;margin-bottom:54px;border-bottom:1px solid rgba(255,255,255,.1);&:last-of-type{margin-bottom:30px;}`;
const SectionHead = styled.div`display:flex;align-items:center;gap:12px;margin-bottom:17px;`;
const SectionIcon = styled.span`display:grid;place-items:center;width:34px;height:34px;border:1px solid rgba(215,149,85,.4);color:#d79555;`;
const SectionKicker = styled.span`display:block;color:#be8955;font-size:.66rem;font-weight:800;`;
const SectionTitle = styled.h2`margin:2px 0 0;color:#f0f3f4;font-size:1.42rem;line-height:1.35;letter-spacing:0;`;
const SectionLead = styled.p`margin:0 0 23px;color:#aab4b9;font-size:.91rem;line-height:1.85;`;
const BodyCopy = styled.p`margin:20px 0 0;color:#aab4b9;font-size:.87rem;line-height:1.85;`;
const Subhead = styled.h3`margin:28px 0 13px;color:#e5e9ea;font-size:1rem;letter-spacing:0;`;
const TableScroll = styled.div`max-width:100%;overflow-x:auto;border:1px solid rgba(255,255,255,.1);border-radius:4px;`;
const CompareTable = styled.table`width:100%;min-width:690px;border-collapse:collapse;background:#0c1317;font-size:.75rem;th,td{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.07);text-align:left;vertical-align:middle;line-height:1.55;}thead th{color:#87959c;background:#10191e;font-size:.66rem;}tbody th{color:#e1e6e7;font-weight:700;}td{color:#9da9af;}tbody tr:last-child th,tbody tr:last-child td{border-bottom:0;}`;
const Gap = styled.strong`color:#df8d77;`;
const MethodNotes = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:18px;p{margin:0;padding-left:13px;border-left:2px solid rgba(102,182,161,.5);color:#98a5ab;font-size:.77rem;line-height:1.7;}strong{color:#dce3e5;}`;
const Caution = styled.aside`display:flex;gap:10px;margin-top:20px;padding:14px 16px;border:1px solid rgba(215,149,85,.22);background:rgba(215,149,85,.055);svg{flex:none;color:#d79555;margin-top:2px;}p{margin:0;color:#aab3b7;font-size:.75rem;line-height:1.7;}`;
const CauseRail = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.09);`;
const Cause = styled.div`min-width:0;padding:16px;background:#0c1317;b{display:block;color:#ba8552;font-size:.63rem;}strong{display:block;margin-top:6px;color:#edf0f1;font-size:.8rem;line-height:1.55;}span{display:block;margin-top:7px;color:#7f8d94;font-size:.68rem;line-height:1.65;}`;
const StrengthGrid = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:20px;`;
const Strength = styled.div`padding:13px 0;border-top:2px solid rgba(102,182,161,.6);strong{display:block;color:#dfe6e5;font-size:.73rem;}span{display:block;margin-top:6px;color:#84928f;font-size:.67rem;line-height:1.6;}`;
const Finding = styled.aside`display:flex;gap:11px;margin-top:20px;padding:16px 18px;border-left:3px solid ${p => p.$warn ? '#d79555' : '#66b6a1'};background:${p => p.$warn ? 'rgba(215,149,85,.065)' : 'rgba(102,182,161,.07)'};svg{flex:none;color:${p => p.$warn ? '#d79555' : '#66b6a1'};margin-top:2px;}strong{color:#dce5e3;font-size:.82rem;}p{margin:5px 0 0;color:#98a7a8;font-size:.76rem;line-height:1.75;}`;
const MetricList = styled.div`display:grid;gap:1px;margin-bottom:20px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);`;
const MetricRow = styled.div`display:grid;grid-template-columns:minmax(150px,.55fr) minmax(320px,1.45fr);gap:24px;align-items:center;padding:14px 16px;background:#0c1317;`;
const Bars = styled.div`display:grid;gap:7px;`;
const BarLine = styled.div`display:grid;grid-template-columns:50px minmax(100px,1fr) 58px;gap:8px;align-items:center;b{color:#77858c;font-size:.61rem;}em{color:#cdd4d6;font-size:.68rem;font-style:normal;text-align:right;}`;
const BarTrack = styled.span`display:block;height:6px;background:#202a2f;`;
const BarFill = styled.span`display:block;width:${p => p.$width};max-width:100%;height:100%;background:${p => p.$tone};`;
const TimelineBlock = styled.div`margin-top:14px;padding:15px 16px 13px;border:1px solid rgba(255,255,255,.1);background:#0c1317;`;
const TimelineTitle = styled.h3`margin:0 0 12px;color:#dfe5e7;font-size:.83rem;`;
const TimelineScroll = styled.div`overflow-x:auto;`;
const TimelineCanvas = styled.div`min-width:690px;`;
const Scale = styled.div`display:flex;justify-content:space-between;margin-left:210px;padding-bottom:6px;color:#65737a;font-size:.58rem;`;
const TimelineRow = styled.div`display:grid;grid-template-columns:200px minmax(320px,1fr) 126px;gap:10px;align-items:center;min-height:42px;border-top:1px solid rgba(255,255,255,.06);`;
const TimelineLabel = styled.div`display:grid;grid-template-columns:68px minmax(0,1fr);gap:6px;align-items:center;b{color:#75838a;font-size:.61rem;}`;
const Track = styled.div`position:relative;height:8px;background:#202b30;&:before{content:'';position:absolute;left:50%;top:-4px;width:1px;height:16px;background:rgba(255,255,255,.1);}`;
const TimelineMark = styled.span`position:absolute;left:${p => p.$left};top:50%;width:10px;height:18px;border:2px solid #0c1317;background:${p => p.$reference ? '#66b6a1' : '#d79555'};transform:translate(-50%,-50%);`;
const TimelineTimes = styled.span`color:#7a878e;font-size:.59rem;line-height:1.45;text-align:right;`;
const TargetShareList = styled.div`display:grid;gap:1px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.09);`;
const TargetShare = styled.div`display:grid;grid-template-columns:minmax(180px,.65fr) minmax(320px,1.35fr);gap:22px;align-items:center;padding:14px 16px;background:#0c1317;`;
const TargetName = styled.div`strong{display:block;color:#e5e9ea;font-size:.78rem;}span{display:block;margin-top:4px;color:#718087;font-size:.64rem;}`;
const ShareBars = styled.div`display:grid;gap:6px;`;
const ShareLine = styled.div`display:grid;grid-template-columns:48px minmax(100px,1fr) 42px;gap:8px;align-items:center;b{color:#75838a;font-size:.61rem;}em{color:#aab4b8;font-size:.65rem;font-style:normal;text-align:right;}`;
const DeepGrid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;`;
const DeepCard = styled.div`padding:17px 18px;border-top:3px solid ${p => p.$tone};background:#0c1317;span{color:#7d8a91;font-size:.66rem;font-weight:800;}strong{display:block;margin-top:5px;color:#eef1f2;font-size:1.08rem;}p{margin:8px 0 0;color:#929fa5;font-size:.74rem;line-height:1.75;}`;
const MechanicBand = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;padding:20px;border-top:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09);background:#0c1317;strong{display:block;color:#e4e9ea;font-size:.82rem;}p{margin:8px 0 0;color:#94a1a7;font-size:.75rem;line-height:1.75;}`;
const PriorityList = styled.div`display:grid;gap:1px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.09);`;
const Priority = styled.div`display:grid;grid-template-columns:34px minmax(0,1fr);gap:14px;padding:15px 17px;background:#0c1317;>b{display:grid;place-items:center;width:28px;height:28px;background:#d79555;color:#101518;font-size:.72rem;}strong{color:#e6eaeb;font-size:.82rem;}p{margin:5px 0 0;color:#909da3;font-size:.74rem;line-height:1.7;}`;
const Sources = styled.footer`display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;padding-top:20px;border-top:1px solid rgba(255,255,255,.12);>strong{color:#7d8a91;font-size:.68rem;}`;
const ExternalAnchor = styled.a`display:inline-flex;align-items:center;gap:5px;color:#9aa7ad;font-size:.68rem;text-decoration:none;&:hover{color:#f0f2f3;}`;
const SkillAnchor = styled.a`display:inline-flex;align-items:center;gap:4px;color:#e8b66e;font-weight:750;text-decoration:none;white-space:nowrap;vertical-align:-3px;img{width:18px;height:18px;border:1px solid rgba(255,255,255,.22);border-radius:2px;object-fit:cover;}&:hover{color:#ffd28d;}`;
const SkillFallback = styled.span`display:inline-block;width:18px;height:18px;border:1px solid rgba(255,255,255,.2);background:#263037;`;

const ResponsiveStyles = createGlobalStyle`
@media (max-width:900px){
  ${HeroGrid}{grid-template-columns:1fr;gap:28px;}
  ${SnapshotStrip}{grid-template-columns:repeat(2,minmax(0,1fr));}
  ${SnapshotItem}{border-bottom:1px solid rgba(255,255,255,.08);}
  ${ReportLayout}{grid-template-columns:1fr;gap:24px;}
  ${ReportNav}{position:sticky;top:58px;z-index:4;display:flex;overflow-x:auto;background:#0a1014;border-bottom:1px solid rgba(255,255,255,.1);}
  ${NavLink}{flex:none;padding:11px 13px;}
  ${CauseRail},${StrengthGrid}{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media (max-width:640px){
  ${Hero}{padding:24px 18px 28px;}
  ${HeroTop}{align-items:flex-start;margin-bottom:26px;}
  ${Snapshot}{text-align:right;}
  ${Title}{font-size:1.9rem;}
  ${Lead}{font-size:.88rem;line-height:1.72;}
  ${SnapshotStrip},${ReportLayout}{width:calc(100% - 28px);}
  ${SnapshotStrip}{grid-template-columns:1fr;}
  ${SnapshotItem}{border-right:0;}
  ${Section}{padding-bottom:42px;margin-bottom:42px;}
  ${SectionTitle}{font-size:1.18rem;}
  ${SectionLead},${BodyCopy}{font-size:.82rem;line-height:1.75;}
  ${MethodNotes},${CauseRail},${StrengthGrid},${DeepGrid},${MechanicBand}{grid-template-columns:1fr;}
  ${MetricRow},${TargetShare}{grid-template-columns:1fr;gap:11px;}
  ${Priority}{padding:14px 12px;grid-template-columns:30px minmax(0,1fr);gap:10px;}
}
`;

export default DevastationEvokerMythicLogReportPage;
