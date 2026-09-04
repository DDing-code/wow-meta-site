import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  Gauge,
  ListChecks,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import kbSkills from '../data/kb-skills.json';
import LogReportSidebarList from '../components/LogReportSidebarList.js';

const skills = kbSkills.skills || {};

const fightSummaries = [
  {
    id: 'nekzali',
    label: '신화 · 영혼살무사 네크잘리',
    verdict: '활동량과 쿨기 배치를 먼저 고쳐야 합니다',
    targetHps: '245.3k',
    targetRank: '56점',
    referenceHps: '308.1k',
    referenceRank: '조건 근접 상위 로그',
    casts: '357 / 395',
    mana: '38.9% / 5.1%',
    overheal: '42.4% / 36.7%',
    tone: '#d79555',
  },
  {
    id: 'explorers',
    label: '신화 · 길 잃은 탐험가',
    verdict: '이미 상위권이며, 남은 차이는 시전 밀도입니다',
    targetHps: '335.2k',
    targetRank: '94점',
    referenceHps: '380.0k',
    referenceRank: '세계 1위 비교 로그',
    casts: '341 / 390',
    mana: '34.0% / 5.0%',
    overheal: '29.1% / 25.9%',
    tone: '#66b6a1',
  },
];

const nekzaliCasts = [
  { id: '20473', target: 101, reference: 115, note: '평균 간격 4.82초 / 4.09초' },
  { id: '461432', target: 93, reference: 112, note: '봉화 전달량 차이로 이어짐' },
  { id: '19750', target: 61, reference: 76, note: '남은 마나를 유효 치유로 못 바꿈' },
  { id: '200025', target: 28, reference: 29, note: '사용 횟수 자체는 정상' },
  { id: '375576', target: 13, reference: 12, note: '사용 횟수 자체는 정상' },
  { id: '31884', target: 3, reference: 4, note: '첫 사용 71.6초 / 27.5초' },
];

const explorerCasts = [
  { id: '20473', target: 98, reference: 112, note: '평균 간격 4.53초 / 3.97초' },
  { id: '461432', target: 100, reference: 99, note: '소비기 회전은 이미 상위권' },
  { id: '19750', target: 57, reference: 64, note: '7회 차이' },
  { id: '82326', target: 1, reference: 5, note: '4세트 발동용 선택 시전 차이' },
  { id: '200025', target: 26, reference: 25, note: '사용 횟수 우세' },
  { id: '375576', target: 14, reference: 11, note: '사용 횟수 우세' },
  { id: '53600', target: 0, reference: 12, note: '비피해 구간 마나 회수 차이' },
];

const healingRows = [
  { id: '53563', name: '빛의 봉화', target: '32.43M', reference: '41.48M', gap: '+9.05M' },
  { id: '461432', name: '영원의 불꽃', target: '16.53M', reference: '23.25M', gap: '+6.72M' },
  { id: '20473', name: '신성 충격', target: '26.68M', reference: '30.32M', gap: '+3.64M' },
  { id: '1232616', name: '빛의 기둥', target: '6.48M', reference: '8.54M', gap: '+2.06M' },
  { id: '19750', name: '빛의 섬광', target: '8.93M', reference: '10.40M', gap: '+1.47M' },
];

const timelines = [
  {
    title: '영혼살무사 네크잘리 · 약 486초',
    duration: 486,
    rows: [
      { owner: '닉네임', id: '31884', marks: [71.6, 247.4, 368.7] },
      { owner: '상위 로그', id: '31884', marks: [27.5, 150.7, 293.4, 415.7] },
      { owner: '닉네임', label: '사용 장신구', marks: [71.6, 247.4, 368.7] },
      { owner: '상위 로그', label: '사용 장신구', marks: [1.4, 122.9, 241.9, 363.7, 470.4] },
    ],
  },
  {
    title: '길 잃은 탐험가 · 약 446초',
    duration: 446,
    rows: [
      { owner: '닉네임', id: '31884', marks: [13.4, 135.6, 263.3, 384.1] },
      { owner: '상위 로그', id: '31884', marks: [16.7, 140.2, 274.8, 394.8] },
      { owner: '닉네임', label: '사용 장신구', marks: [13.4, 135.6, 263.3, 384.1] },
      { owner: '상위 로그', label: '사용 장신구', marks: [98.1, 243.2, 364.7, 416.7, 441.0] },
    ],
  },
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

function CastTable({ rows, label }) {
  return (
    <TableScroll>
      <CompareTable aria-label={label}>
        <thead>
          <tr><th>주문</th><th>닉네임</th><th>상위 로그</th><th>판독</th></tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <th><SkillLink id={row.id} /></th>
              <td>{row.target}</td>
              <td>{row.reference}</td>
              <td>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </CompareTable>
    </TableScroll>
  );
}

function Metric({ label, target, reference, detail }) {
  const targetValue = Number(target);
  const referenceValue = Number(reference);
  const max = Math.max(targetValue, referenceValue);

  return (
    <MetricRow>
      <MetricCopy><strong>{label}</strong><span>{detail}</span></MetricCopy>
      <Bars>
        <BarLine><b>닉네임</b><BarTrack><BarFill $width={`${(targetValue / max) * 100}%`} $tone="#d79555" /></BarTrack><em>{target}</em></BarLine>
        <BarLine><b>상위</b><BarTrack><BarFill $width={`${(referenceValue / max) * 100}%`} $tone="#66b6a1" /></BarTrack><em>{reference}</em></BarLine>
      </Bars>
    </MetricRow>
  );
}

function Timeline({ title, duration, rows }) {
  return (
    <TimelineBlock>
      <TimelineTitle>{title}</TimelineTitle>
      <TimelineScroll>
        <TimelineCanvas>
          <Scale aria-hidden="true"><span>0초</span><span>{Math.round(duration / 2)}초</span><span>{duration}초</span></Scale>
          {rows.map((row, index) => (
            <TimelineRow key={`${row.owner}-${row.id || row.label}-${index}`}>
              <TimelineLabel>
                <b>{row.owner}</b>
                {row.id ? <SkillLink id={row.id} /> : <span>{row.label}</span>}
              </TimelineLabel>
              <Track>
                {row.marks.map(mark => (
                  <TimelineMark
                    key={mark}
                    $left={`${(mark / duration) * 100}%`}
                    $reference={row.owner === '상위 로그'}
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

function HolyPaladinLogReportPage() {
  useEffect(() => {
    document.title = '닉네임 신성 성기사 신화 2킬 분석 | wowmeta';
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
          <BackLink to="/logs/paladin-holy"><ArrowLeft size={16} aria-hidden="true" />신성 성기사 로그 분석 목록</BackLink>
          <Snapshot>12.1 · 2026-09-04 분석</Snapshot>
        </HeroTop>
        <HeroGrid>
          <div>
            <Eyebrow>WARCRAFT LOGS REVIEW · 맹독 심연 신화</Eyebrow>
            <Title>닉네임 신성 성기사<br />신화 2킬 분석</Title>
            <Lead>
              캐릭터 페이지의 현재 신화 처치 2개를 원시 시전·버프·자원 이벤트로 다시 읽고,
              전투 길이와 장비 구간이 가까운 상위 로그를 각각 골라 비교했습니다.
            </Lead>
          </div>
          <HeroVerdict>
            <Target size={21} aria-hidden="true" />
            <div>
              <span>결론 먼저</span>
              <strong>두 로그를 같은 이유로 평가하면 안 됩니다</strong>
              <p><b>네크잘리</b>는 비는 시전과 늦은 쿨기 때문에 손실이 났습니다. <b>탐험가</b>는 이미 94점이며, 핵심 루프를 유지한 채 남은 마나와 빈 글쿨만 줄이면 됩니다.</p>
            </div>
          </HeroVerdict>
        </HeroGrid>
      </Hero>

      <SummaryGrid aria-label="두 전투 요약">
        {fightSummaries.map(fight => (
          <FightCard key={fight.id} $tone={fight.tone}>
            <SummaryLabel>{fight.label}</SummaryLabel>
            <SummaryTitle>{fight.verdict}</SummaryTitle>
            <ScoreLine>
              <div><span>닉네임</span><strong>{fight.targetHps}</strong><small>{fight.targetRank}</small></div>
              <ScoreArrow>→</ScoreArrow>
              <div><span>비교 로그</span><strong>{fight.referenceHps}</strong><small>{fight.referenceRank}</small></div>
            </ScoreLine>
            <MiniStats>
              <div><span>실제 시전</span><b>{fight.casts}</b></div>
              <div><span>종료 마나</span><b>{fight.mana}</b></div>
              <div><span>과치유율</span><b>{fight.overheal}</b></div>
            </MiniStats>
            <PairNote>표기 순서: 닉네임 / 상위 로그</PairNote>
          </FightCard>
        ))}
      </SummaryGrid>

      <ReportLayout>
        <ReportNav aria-label="분석 목차">
          <NavLink href="#method">01 비교 기준</NavLink>
          <NavLink href="#nekzali">02 네크잘리</NavLink>
          <NavLink href="#timing">03 쿨기 시간표</NavLink>
          <NavLink href="#explorers">04 탐험가</NavLink>
          <NavLink href="#context">05 공격대 맥락</NavLink>
          <NavLink href="#fix">06 교정안</NavLink>
          <LogReportSidebarList />
        </ReportNav>

        <Article>
          <Section id="method">
            <SectionHeading number="01 · 비교 기준" title="순위보다 조건을 먼저 맞췄습니다" icon={ShieldCheck} />
            <SectionLead>
              네크잘리는 세계 최고 HPS가 아니라 전투 길이가 1.8초, WCL 장비 구간이 1 차이인 상위 로그를 골랐습니다.
              탐험가는 세계 1위 로그가 전투 길이도 1.5초 차이라 그대로 사용했습니다. 네 전투 모두 20인, 4힐, 12.1 파티션입니다.
            </SectionLead>
            <TableScroll>
              <CompareTable aria-label="비교 로그 조건">
                <thead><tr><th>전투</th><th>닉네임</th><th>비교 대상</th><th>조건 판정</th></tr></thead>
                <tbody>
                  <tr><th>영혼살무사 네크잘리</th><td>8:06 · 장비 구간 314<br />공격대 평균 314.8</td><td>Iive · 8:04 · 장비 구간 313<br />공격대 평균 317.3</td><td>전투 길이·개인 장비가 매우 가까움</td></tr>
                  <tr><th>길 잃은 탐험가</th><td>7:26 · 장비 구간 316<br />공격대 평균 315.0</td><td>Sqizzpal · 7:27 · 장비 구간 318<br />공격대 평균 317.1</td><td>세계 1위 중 전투 길이가 거의 같음</td></tr>
                </tbody>
              </CompareTable>
            </TableScroll>
            <MethodNotes>
              <p><strong>네크잘리:</strong> 양쪽 특성 기록이 완전히 같습니다. 비교 로그의 지능은 약 4.9% 높지만 HPS는 25.6% 높아 장비만으로 차이를 설명할 수 없습니다.</p>
              <p><strong>탐험가:</strong> 핵심 특성 구성은 같고 내부 특성 항목 1개만 다릅니다. WCL 응답이 그 항목의 현지화 이름을 주지 않아 특정 효과로 단정하지 않았습니다.</p>
            </MethodNotes>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>백분위와 순위는 재집계로 바뀔 수 있습니다. 쿨기 담당표와 음성 지시는 로그에 없으므로 <SkillLink id="31821" /> 시점 차이를 곧바로 실수로 판정하지 않았습니다.</p>
            </Caution>
          </Section>

          <Section id="nekzali">
            <SectionHeading number="02 · 영혼살무사 네크잘리" title="남은 마나보다 비어 있던 시간이 더 큰 문제입니다" icon={BarChart3} />
            <SectionLead>
              8분 전투에서 유효 치유는 119.19M 대 149.15M입니다. 비교 로그는 공격대가 받은 피해가 2.4% 많았을 뿐인데
              신성 성기사 몫은 25.1% 더 컸습니다. 가장 큰 차이는 주문 한 번의 세기가 아니라 주문이 이어진 횟수입니다.
            </SectionLead>
            <MetricList>
              <Metric label="실제 시전" target="357" reference="395" detail="44.1회/분 대 49.0회/분" />
              <Metric label={<SkillLink id="20473" />} target="101" reference="115" detail="10초 초과 공백 9회 대 3회" />
              <Metric label={<SkillLink id="31884" />} target="3" reference="4" detail="첫 사용 71.6초 대 27.5초" />
              <Metric label="종료 마나 사용률" target="61.1" reference="94.9" detail="사망 없이 마나 38.9%를 남김" />
            </MetricList>
            <CastTable rows={nekzaliCasts} label="네크잘리 핵심 주문 시전 비교" />

            <CauseRail>
              <Cause><b>01 · 활동 공백</b><strong>실제 시전 38회 부족</strong><span>닉네임은 6초 이상 공백이 여러 번 있었고, 비교 로그는 3.4초를 넘는 공백이 한 번뿐이었습니다.</span></Cause>
              <Cause><b>02 · 생성기</b><strong><SkillLink id="20473" /> 14회 부족</strong><span>발동과 신성한 힘이 함께 줄어 후속 직접 치유까지 작아졌습니다.</span></Cause>
              <Cause><b>03 · 큰 구간</b><strong><SkillLink id="31884" /> 1회 손실</strong><span>첫 사용이 44초 늦어 8분 전투의 네 번째 사용 기회를 잃었습니다.</span></Cause>
              <Cause><b>04 · 장신구</b><strong>3회 대 5회</strong><span>닉네임은 세 번 모두 <SkillLink id="31884" />와 정확히 묶어 사용해 독립 사용 두 번을 잃었습니다.</span></Cause>
            </CauseRail>

            <Finding>
              <CheckCircle2 size={18} aria-hidden="true" />
              <div>
                <strong>발동 관리는 주원인이 아닙니다</strong>
                <p><SkillLink id="53576" /> 획득은 38회로 비교 로그의 36회보다 많았고, 뚜렷한 만료는 확인되지 않았습니다. 무료 소비기 발동 26회도 모두 소비했습니다. “발동을 못 썼다”가 아니라 발동 밖의 평시 시전과 쿨기 회전이 비었습니다.</p>
              </div>
            </Finding>

            <Subhead>유효 치유 차이가 생긴 위치</Subhead>
            <TableScroll>
              <CompareTable aria-label="네크잘리 주문별 유효 치유">
                <thead><tr><th>치유 효과</th><th>닉네임</th><th>상위 로그</th><th>차이</th></tr></thead>
                <tbody>
                  {healingRows.map(row => (
                    <tr key={row.id}><th><SkillLink id={row.id}>{row.name}</SkillLink></th><td>{row.target}</td><td>{row.reference}</td><td>{row.gap}</td></tr>
                  ))}
                </tbody>
              </CompareTable>
            </TableScroll>
            <BodyCopy>
              가장 큰 9.05M 차이는 <SkillLink id="53563" /> 전달 치유입니다. 봉화는 별도 딜사이클 버튼이 아니라 직접 치유의 결과를 전달하므로,
              <SkillLink id="461432" /> 19회와 <SkillLink id="19750" /> 15회가 적었던 것이 봉화 격차로 다시 확대됐습니다.
              과치유율도 5.7%p 높아, 피해가 들어오기 전에 먼저 채운 치유보다 실제 피해 중 직접 치유 밀도를 높여야 합니다.
            </BodyCopy>
          </Section>

          <Section id="timing">
            <SectionHeading number="03 · 쿨기 시간표" title="네크잘리는 늦었고, 탐험가는 거의 맞았습니다" icon={Clock3} />
            <SectionLead>
              점 하나가 실제 사용 시점입니다. 네크잘리에서는 장신구를 <SkillLink id="31884" />에만 고정한 결과 둘 다 사용 횟수가 줄었고,
              탐험가에서는 <SkillLink id="31884" /> 네 번이 상위 로그와 거의 같은 간격으로 들어갔습니다.
            </SectionLead>
            {timelines.map(timeline => <Timeline key={timeline.title} {...timeline} />)}
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p><SkillLink id="31821" />은 양쪽 모두 전투마다 3회 사용했습니다. 시점이 다른 것은 담당 구간 차이일 수 있어 횟수만 확인하고 옳고 그름은 판정하지 않았습니다.</p>
            </Caution>
          </Section>

          <Section id="explorers">
            <SectionHeading number="04 · 길 잃은 탐험가" title="94점 로그를 실패 로그처럼 고치면 오히려 망가집니다" icon={Zap} />
            <SectionLead>
              이 전투는 기본 구조가 좋습니다. <SkillLink id="461432" /> 100회, <SkillLink id="200025" /> 26회,
              <SkillLink id="375576" /> 14회로 세 항목 모두 세계 1위 비교 로그와 같거나 많습니다. 네 번의 <SkillLink id="31884" />도 거의 같은 시점입니다.
            </SectionLead>
            <StrengthGrid>
              <Strength><strong>소비기 회전</strong><span><SkillLink id="461432" /> 100회 대 99회</span></Strength>
              <Strength><strong>봉화 구간</strong><span><SkillLink id="200025" /> 26회 대 25회</span></Strength>
              <Strength><strong>즉시 회복 묶음</strong><span><SkillLink id="375576" /> 14회 대 11회</span></Strength>
              <Strength><strong>주문 효율</strong><span><SkillLink id="20473" /> 1회당 약 359k 대 333k</span></Strength>
            </StrengthGrid>
            <CastTable rows={explorerCasts} label="길 잃은 탐험가 핵심 주문 시전 비교" />

            <Subhead>남은 13.3%의 대부분은 평시 밀도입니다</Subhead>
            <BodyCopy>
              유효 치유는 149.45M 대 169.97M이고, 실제 시전은 341회 대 390회입니다. 비교 로그는 <SkillLink id="20473" /> 14회,
              <SkillLink id="19750" /> 7회, <SkillLink id="82326" /> 4회, <SkillLink id="20271" /> 3회를 더 사용했습니다.
              닉네임의 핵심 주문 1회당 효율은 낮지 않으므로 대상 선택을 뜯어고칠 이유가 없습니다. 피해가 약한 구간에도 다음 발동과 마나를 만드는 입력을 끊지 않는 것이 다음 단계입니다.
            </BodyCopy>

            <MechanicBand>
              <div>
                <strong><SkillLink id="1296657" /> 루프</strong>
                <p><SkillLink id="53576" />가 없을 때 <SkillLink id="20271" />은 20% 확률로, <SkillLink id="82326" />은 확정으로 새 발동을 만들지만 <SkillLink id="82326" />의 마나 비용은 50% 늘어납니다. 비교 로그는 이 선택 시전을 5회만 사용했습니다. 무조건 연타가 아니라 다음 <SkillLink id="200025" /> 직전 여유가 있을 때만 넣는 보조 수단입니다.</p>
              </div>
              <div>
                <strong><SkillLink id="53600" />의 역할</strong>
                <p>비교 로그는 실제 치유가 필요하지 않은 구간에 12회 사용해 피해와 마나 회수를 챙겼습니다. 다음 피해에 쓸 신성한 힘을 빼앗아서는 안 되며, 마나 34%를 남기는 현재 로그에서는 비는 글쿨을 채우는 선택지로만 추가합니다.</p>
              </div>
            </MechanicBand>

            <Finding>
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <strong>생존과 외부 생존기는 순위보다 먼저입니다</strong>
                <p>닉네임은 생존했지만 비교 대상은 종료 약 4.4초 전에 사망했습니다. 비교 대상의 <SkillLink id="498" /> 6회와 <SkillLink id="6940" /> 2회는 참고할 만하지만, 마지막 위험한 미터기 경쟁까지 복사할 이유는 없습니다. 닉네임은 <SkillLink id="498" /> 첫 사용이 190초로 늦고 총 3회였으므로 이 부분만 전투 전에 배정하면 됩니다.</p>
              </div>
            </Finding>
          </Section>

          <Section id="context">
            <SectionHeading number="05 · 공격대 맥락" title="HPS 차이를 피해량과 힐 경쟁에서 분리했습니다" icon={Gauge} />
            <ContextGrid>
              <ContextBlock>
                <span>영혼살무사 네크잘리</span>
                <strong>22.8% → 28.5%</strong>
                <p>4힐 전체 유효 치유는 522.66M 대 523.59M으로 사실상 같습니다. 닉네임은 4명 중 4위, 비교 성기사는 1위였습니다. 공격대 실패가 아니라 같은 치유 풀을 가져오는 속도와 구간 선택 차이입니다.</p>
              </ContextBlock>
              <ContextBlock>
                <span>길 잃은 탐험가</span>
                <strong>25.1% → 30.5%</strong>
                <p>닉네임 공격대는 오히려 피해를 1.9% 더 받았고 닉네임은 4명 중 2위였습니다. 세계 1위 로그는 더 작은 치유 풀에서 몫을 빨리 확보했지만 막판 연쇄 사망도 있어, 순위용 위험 감수는 교정 목표에서 제외했습니다.</p>
              </ContextBlock>
            </ContextGrid>
            <BodyCopy>
              두 전투 모두 “치유량이 낮으니 더 큰 주문을 찾아야 한다”는 문제가 아닙니다. 네크잘리는 시전 공백과 늦은 큰 구간,
              탐험가는 이미 좋은 소비기 회전 위에 평시 <SkillLink id="20473" />·<SkillLink id="20271" />·<SkillLink id="53600" />을 더 촘촘하게 넣는 문제입니다.
            </BodyCopy>
          </Section>

          <Section id="fix">
            <SectionHeading number="06 · 다음 로그 교정안" title="먼저 고칠 순서만 남겼습니다" icon={ListChecks} />
            <PriorityList>
              <Priority><b>1</b><div><strong>5초 이상 무입력 구간부터 없애기</strong><p>이동 중에도 <SkillLink id="20473" />, 즉시 소비기, <SkillLink id="20271" /> 중 가능한 입력을 이어갑니다. 네크잘리의 6~10초 공백을 먼저 줄이면 나머지 지표가 같이 오릅니다.</p></div></Priority>
              <Priority><b>2</b><div><strong><SkillLink id="31884" />를 전투 전에 네 번 배정하기</strong><p>네크잘리는 첫 계획 피해가 25~35초대라면 그 구간에 첫 <SkillLink id="31884" />를 두고, 담당 지시가 없다면 준비된 뒤 10~15초 이상 미루지 않습니다.</p></div></Priority>
              <Priority><b>3</b><div><strong>장신구를 <SkillLink id="31884" /> 전용으로 묶지 않기</strong><p>보호막이 실제 피해를 받을 구간이면 독립 사용합니다. 네크잘리 기준 최소 4회, 전투 길이가 허용하면 5회가 비교 목표입니다.</p></div></Priority>
              <Priority><b>4</b><div><strong>남은 마나를 평시 시전으로 전환하기</strong><p><SkillLink id="20473" />을 우선하고, 실제 치유가 필요하면 <SkillLink id="19750" />, 여유가 있고 <SkillLink id="53576" />가 없으면 <SkillLink id="82326" />을 선택적으로 사용합니다.</p></div></Priority>
              <Priority><b>5</b><div><strong><SkillLink id="200025" /> 9초를 피해 시작점에 맞추기</strong><p>피해가 오기 전 자원 과충전을 비우고, 봉화 뒤에는 준비된 <SkillLink id="375576" />·<SkillLink id="20473" />·<SkillLink id="461432" />·주입 <SkillLink id="19750" />을 실제로 다친 대상에 연결합니다.</p></div></Priority>
              <Priority><b>6</b><div><strong>개인 생존기와 외부 생존기 별도 배정</strong><p><SkillLink id="498" />은 탐험가에서 첫 사용을 앞당기고, <SkillLink id="6940" />은 탱커 또는 지정 대상의 위험 구간에만 씁니다. HPS를 위한 버튼으로 취급하지 않습니다.</p></div></Priority>
            </PriorityList>

            <Subhead>다음 로그에서 확인할 수치</Subhead>
            <TableScroll>
              <CompareTable aria-label="다음 로그 목표">
                <thead><tr><th>전투</th><th>활동량</th><th>생성기</th><th>큰 구간</th><th>마나</th></tr></thead>
                <tbody>
                  <tr><th>영혼살무사 네크잘리</th><td>실제 시전 48회/분 이상</td><td><SkillLink id="20473" /> 평균 간격 4.2초 이하</td><td><SkillLink id="31884" /> 4회</td><td>종료 마나 5~15%</td></tr>
                  <tr><th>길 잃은 탐험가</th><td>실제 시전 49회/분 이상</td><td><SkillLink id="20473" /> 108회 이상</td><td><SkillLink id="498" /> 5회 전후</td><td>종료 마나 10~20%</td></tr>
                </tbody>
              </CompareTable>
            </TableScroll>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>마나 목표는 안정적으로 처치되는 날의 비교값입니다. 진도 중 부활·해제·외부 생존기 여유가 필요하면 5%까지 태우는 것보다 생존과 담당 수행을 우선합니다.</p>
            </Caution>
          </Section>

          <Sources>
            <strong>원본·교차검증</strong>
            <SourceLink href="https://www.warcraftlogs.com/character/kr/%EC%95%84%EC%A6%88%EC%83%A4%EB%9D%BC/%EB%8B%89%EB%84%A4%EC%9E%84?difficulty=5">닉네임 신화 기록</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/86RcKVAkr1fBnQZY?fight=37&type=healing&source=2">네크잘리 원본</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/cf932Prh4WMA7NnL?fight=26&type=healing&source=2390">네크잘리 비교</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/fnFDpvyrMdwNgmCx?fight=18&type=healing&source=2">탐험가 원본</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/G4NQYpAyxX2m39t7?fight=35&type=healing&source=53">탐험가 비교</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/api/docs">Warcraft Logs API</SourceLink>
            <SourceLink href="https://www.method.gg/guides/holy-paladin/playstyle-and-rotation">Method 12.1 운용</SourceLink>
            <SourceLink href="https://www.method.gg/guides/holy-paladin/gearing">Method 12.1 세트</SourceLink>
            <SourceLink href="https://www.wowhead.com/guide/classes/paladin/holy/rotation-cooldowns-pve-healer">Wowhead 12.1 운용</SourceLink>
            <SourceLink href="https://www.icy-veins.com/wow/holy-paladin-pve-healing-rotation-cooldowns-abilities">Icy Veins 12.1 운용</SourceLink>
            <SourceLink href="https://discord.com/servers/hammer-of-wrath-115288062094868481">Hammer of Wrath</SourceLink>
          </Sources>
        </Article>
      </ReportLayout>
    </Page>
  );
}

const Page = styled.div`
  min-height:100vh;
  color:#dce3e5;
  background:#0a1014;
  word-break:keep-all;
  overflow-wrap:break-word;
  letter-spacing:0;
`;
const Hero = styled.header`padding:34px max(24px,calc((100vw - 1180px)/2)) 38px;border-bottom:1px solid rgba(255,255,255,.09);background:#0d151a;`;
const HeroTop = styled.div`display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:34px;`;
const BackLink = styled(Link)`display:inline-flex;align-items:center;gap:7px;color:#93a2aa;font-size:.78rem;font-weight:700;text-decoration:none;&:hover{color:#eef2f3;}`;
const Snapshot = styled.span`color:#c79560;font-size:.72rem;font-weight:800;`;
const HeroGrid = styled.div`display:grid;grid-template-columns:minmax(0,1.45fr) minmax(300px,.75fr);gap:52px;align-items:end;max-width:1180px;margin:0 auto;`;
const Eyebrow = styled.p`margin:0 0 10px;color:#cf9658;font-size:.73rem;font-weight:800;`;
const Title = styled.h1`margin:0;color:#f4f6f6;font-size:2.65rem;line-height:1.14;letter-spacing:0;`;
const Lead = styled.p`max-width:720px;margin:18px 0 0;color:#9eabb1;font-size:.98rem;line-height:1.8;`;
const HeroVerdict = styled.div`display:flex;gap:13px;padding:19px 0 19px 18px;border-left:3px solid #d79555;background:rgba(255,255,255,.025);svg{flex:none;color:#d79555;}span{display:block;color:#c89257;font-size:.69rem;font-weight:800;}strong{display:block;margin-top:5px;color:#f0f2f2;font-size:1rem;line-height:1.5;}p{margin:8px 0 0;color:#9da9af;font-size:.76rem;line-height:1.65;}b{color:#dfe5e7;}`;
const SummaryGrid = styled.section`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px;width:min(1180px,calc(100% - 48px));margin:30px auto 0;`;
const FightCard = styled.article`min-width:0;padding:19px 20px 16px;border:1px solid rgba(255,255,255,.1);border-top:3px solid ${p => p.$tone};border-radius:6px;background:#0d1418;`;
const SummaryLabel = styled.span`color:#8e9ba2;font-size:.7rem;font-weight:800;`;
const SummaryTitle = styled.h2`margin:7px 0 17px;color:#edf1f2;font-size:1.08rem;line-height:1.45;`;
const ScoreLine = styled.div`display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:center;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,.08);div{display:grid;gap:3px;}span,small{color:#839097;font-size:.67rem;}strong{color:#f4f5f5;font-size:1.45rem;}div:last-child{text-align:right;}`;
const ScoreArrow = styled.span`color:#65727a;font-size:1.2rem;`;
const MiniStats = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px;div{min-width:0;}span{display:block;color:#75838b;font-size:.64rem;}b{display:block;margin-top:3px;color:#cfd6d9;font-size:.75rem;}`;
const PairNote = styled.small`display:block;margin-top:10px;color:#637078;font-size:.61rem;text-align:right;`;
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
const CompareTable = styled.table`width:100%;min-width:650px;border-collapse:collapse;background:#0c1317;font-size:.75rem;th,td{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.07);text-align:left;vertical-align:middle;line-height:1.55;}thead th{color:#87959c;background:#10191e;font-size:.66rem;}tbody th{color:#e1e6e7;font-weight:700;}td{color:#9da9af;}tbody tr:last-child th,tbody tr:last-child td{border-bottom:0;}`;
const MethodNotes = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:18px;p{margin:0;padding-left:13px;border-left:2px solid rgba(102,182,161,.5);color:#98a5ab;font-size:.77rem;line-height:1.7;}strong{color:#dce3e5;}`;
const Caution = styled.aside`display:flex;gap:10px;margin-top:20px;padding:14px 16px;border:1px solid rgba(215,149,85,.22);background:rgba(215,149,85,.055);svg{flex:none;color:#d79555;margin-top:2px;}p{margin:0;color:#aab3b7;font-size:.75rem;line-height:1.7;}`;
const MetricList = styled.div`display:grid;gap:1px;margin-bottom:20px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);`;
const MetricRow = styled.div`display:grid;grid-template-columns:minmax(160px,.7fr) minmax(320px,1.3fr);gap:24px;align-items:center;padding:14px 16px;background:#0c1317;`;
const MetricCopy = styled.div`strong{display:block;color:#e4e9ea;font-size:.8rem;}span{display:block;margin-top:3px;color:#748188;font-size:.65rem;}`;
const Bars = styled.div`display:grid;gap:7px;`;
const BarLine = styled.div`display:grid;grid-template-columns:42px minmax(100px,1fr) 46px;gap:8px;align-items:center;b{color:#77858c;font-size:.61rem;}em{color:#cdd4d6;font-size:.68rem;font-style:normal;text-align:right;}`;
const BarTrack = styled.span`display:block;height:6px;background:#202a2f;`;
const BarFill = styled.span`display:block;width:${p => p.$width};height:100%;background:${p => p.$tone};`;
const CauseRail = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;margin-top:20px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.09);`;
const Cause = styled.div`min-width:0;padding:16px;background:#0c1317;b{display:block;color:#ba8552;font-size:.63rem;}strong{display:block;margin-top:6px;color:#edf0f1;font-size:.8rem;line-height:1.55;}span{display:block;margin-top:7px;color:#7f8d94;font-size:.68rem;line-height:1.65;}`;
const Finding = styled.aside`display:flex;gap:11px;margin-top:20px;padding:16px 18px;border-left:3px solid #66b6a1;background:rgba(102,182,161,.07);svg{flex:none;color:#66b6a1;margin-top:2px;}strong{color:#dce5e3;font-size:.82rem;}p{margin:5px 0 0;color:#98a7a8;font-size:.76rem;line-height:1.75;}`;
const TimelineBlock = styled.div`margin-top:18px;padding:15px 16px 13px;border:1px solid rgba(255,255,255,.1);background:#0c1317;`;
const TimelineTitle = styled.h3`margin:0 0 12px;color:#dfe5e7;font-size:.83rem;`;
const TimelineScroll = styled.div`overflow-x:auto;`;
const TimelineCanvas = styled.div`min-width:720px;`;
const Scale = styled.div`display:flex;justify-content:space-between;margin-left:220px;padding-bottom:6px;color:#65737a;font-size:.58rem;`;
const TimelineRow = styled.div`display:grid;grid-template-columns:210px minmax(320px,1fr) 126px;gap:10px;align-items:center;min-height:42px;border-top:1px solid rgba(255,255,255,.06);`;
const TimelineLabel = styled.div`display:grid;grid-template-columns:68px minmax(0,1fr);gap:6px;align-items:center;b{color:#75838a;font-size:.61rem;}span{color:#9eaaaf;font-size:.66rem;}`;
const Track = styled.div`position:relative;height:8px;background:#202b30;&:before{content:'';position:absolute;left:50%;top:-4px;width:1px;height:16px;background:rgba(255,255,255,.1);}`;
const TimelineMark = styled.span`position:absolute;left:${p => p.$left};top:50%;width:10px;height:18px;border:2px solid #0c1317;background:${p => p.$reference ? '#66b6a1' : '#d79555'};transform:translate(-50%,-50%);`;
const TimelineTimes = styled.span`color:#7a878e;font-size:.59rem;line-height:1.45;text-align:right;`;
const StrengthGrid = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:20px;`;
const Strength = styled.div`padding:13px 0;border-top:2px solid rgba(102,182,161,.6);strong{display:block;color:#dfe6e5;font-size:.73rem;}span{display:block;margin-top:6px;color:#84928f;font-size:.67rem;line-height:1.6;}`;
const MechanicBand = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin-top:22px;padding:20px 0;border-top:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09);strong{display:block;color:#e4e9ea;font-size:.82rem;}p{margin:8px 0 0;color:#94a1a7;font-size:.75rem;line-height:1.75;}`;
const ContextGrid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;`;
const ContextBlock = styled.div`padding:18px;border-top:3px solid #6f8994;background:#0c1317;span{color:#829097;font-size:.68rem;font-weight:800;}strong{display:block;margin-top:5px;color:#eef1f2;font-size:1.5rem;}p{margin:9px 0 0;color:#929fa5;font-size:.74rem;line-height:1.75;}`;
const PriorityList = styled.div`display:grid;gap:1px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.09);`;
const Priority = styled.div`display:grid;grid-template-columns:34px minmax(0,1fr);gap:14px;padding:15px 17px;background:#0c1317;>b{display:grid;place-items:center;width:28px;height:28px;background:#d79555;color:#101518;font-size:.72rem;}strong{color:#e6eaeb;font-size:.82rem;}p{margin:5px 0 0;color:#909da3;font-size:.74rem;line-height:1.7;}`;
const Sources = styled.footer`display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;padding-top:20px;border-top:1px solid rgba(255,255,255,.12);>strong{color:#7d8a91;font-size:.68rem;}`;
const ExternalAnchor = styled.a`display:inline-flex;align-items:center;gap:5px;color:#9aa7ad;font-size:.68rem;text-decoration:none;&:hover{color:#f0f2f3;}`;
const SkillAnchor = styled.a`display:inline-flex;align-items:center;gap:4px;color:#e8b66e;font-weight:750;text-decoration:none;white-space:nowrap;vertical-align:-3px;img{width:18px;height:18px;border:1px solid rgba(255,255,255,.22);border-radius:2px;object-fit:cover;}&:hover{color:#ffd28d;}`;
const SkillFallback = styled.span`display:inline-block;width:18px;height:18px;border:1px solid rgba(255,255,255,.2);background:#263037;`;

const ResponsiveStyles = createGlobalStyle`
@media (max-width:900px){
  ${HeroGrid}{grid-template-columns:1fr;gap:28px;}
  ${SummaryGrid}{grid-template-columns:1fr;}
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
  ${SummaryGrid},${ReportLayout}{width:calc(100% - 28px);}
  ${FightCard}{padding:17px 14px 14px;}
  ${ScoreLine}{gap:8px;strong{font-size:1.2rem;}}
  ${MiniStats}{grid-template-columns:1fr;gap:8px;div{display:flex;justify-content:space-between;gap:12px;}b{margin:0;}}
  ${Section}{padding-bottom:42px;margin-bottom:42px;}
  ${SectionTitle}{font-size:1.18rem;}
  ${SectionLead},${BodyCopy}{font-size:.82rem;line-height:1.75;}
  ${MetricRow}{grid-template-columns:1fr;gap:11px;}
  ${MethodNotes},${CauseRail},${StrengthGrid},${MechanicBand},${ContextGrid}{grid-template-columns:1fr;}
  ${CauseRail}{gap:1px;}
  ${Priority}{padding:14px 12px;grid-template-columns:30px minmax(0,1fr);gap:10px;}
}
`;

export default HolyPaladinLogReportPage;
