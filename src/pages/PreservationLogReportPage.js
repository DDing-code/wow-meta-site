import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Droplets,
  ExternalLink,
  Gauge,
  ListChecks,
  Route,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react';
import kbSkills from '../data/kb-skills.json';

const skills = kbSkills.skills || {};

const reports = [
  {
    id: 'ulatek',
    name: '울라텍',
    verdict: '개선 우선',
    tone: '#d49a58',
    href: 'https://www.warcraftlogs.com/reports/6rh4f3MJqDTz9d1C?fight=55&type=healing&source=8',
    referenceHref: 'https://www.warcraftlogs.com/reports/1PRzFwCZNTrayKXj?fight=11&type=healing&source=17',
    player: '26인 · 6힐 · 587초 · 아이템 레벨 310',
    reference: '25인 · 5힐 · 591초 · 아이템 레벨 310',
    hps: '275.2k',
    percentile: '20',
    bracket: '21',
    overheal: '36.9%',
    mana: '1.5%',
    peer: '287.6k',
    peerDelta: '-4.3%',
    summary: '출력보다 마나와 메아리 회수 순서가 먼저 무너졌습니다. 같은 공격대 보존과의 HPS 차이는 작지만, 물약 2개를 쓰고도 마나가 거의 남지 않았습니다.',
  },
  {
    id: 'altar',
    name: '휘감긴 제단',
    verdict: '출력 양호 · 효율 개선',
    tone: '#55a68f',
    href: 'https://www.warcraftlogs.com/reports/h4FVJ9f1zvcDGNWg?fight=61&type=healing&source=138',
    referenceHref: 'https://www.warcraftlogs.com/reports/AzGN6hw4QKpDF8qx?fight=53&type=healing&source=248',
    player: '29인 · 6힐 · 424초 · 아이템 레벨 307',
    reference: '27인 · 5힐 · 427초 · 아이템 레벨 310',
    hps: '308.7k',
    percentile: '76',
    bracket: '83',
    overheal: '38.5%',
    mana: '5.3%',
    peer: '298.8k',
    peerDelta: '+3.3%',
    summary: '같은 공격대의 313레벨 보존보다 HPS가 높아 결과는 좋습니다. 다만 과치유와 마나 소모가 커서 피해량이 더 높은 트라이에서는 같은 흐름을 유지하기 어렵습니다.',
  },
];

const echoMetrics = {
  ulatek: [
    { label: '직접 메아리', player: 61, reference: 103, unit: '회', note: '자연 정수가 꽃으로 빠져 직접 배치 수가 부족했습니다.' },
    { label: '일반 되감기', player: 20, reference: 6, unit: '회', note: '긴급 복구보다 메아리 소비기로 너무 자주 사용했습니다.', inverse: true },
    { label: '축복 시 평균 메아리', player: 2.21, reference: 4.46, unit: '명', note: '축복 횟수는 충분하지만 실어 보낸 대상이 적었습니다.' },
    { label: '메아리 0명 축복', player: 38, reference: 18, unit: '%', note: '42회 중 16회가 메아리 없이 사용됐습니다.', inverse: true },
    { label: '축복 1회당 유효 치유', player: 294, reference: 784, unit: 'k', note: '같은 버튼을 눌러도 회수량이 크게 갈렸습니다.' },
  ],
  altar: [
    { label: '직접 메아리', player: 44, reference: 69, unit: '회', note: '시간 변칙 횟수는 충분했지만 직접 메아리가 부족했습니다.' },
    { label: '일반 되감기', player: 17, reference: 3, unit: '회', note: '메아리 83개가 일반 되감기로 먼저 소비됐습니다.', inverse: true },
    { label: '축복 시 평균 메아리', player: 1.57, reference: 3, unit: '명', note: '축복 직전 준비가 두 전투 중 더 약했습니다.' },
    { label: '메아리 0명 축복', player: 47, reference: 21, unit: '%', note: '30회 중 14회가 메아리 없이 사용됐습니다.', inverse: true },
    { label: '축복 1회당 유효 치유', player: 374, reference: 566, unit: 'k', note: '울라텍보다 낫지만 같은 공대 보존의 529k보다 낮았습니다.' },
  ],
};

const cycle = [
  { skillId: '355936', title: '꿈의 숨결 1단계', note: '메아리가 적을 때 먼저 사용해 지속 치유와 축복을 확보합니다.' },
  { skillId: '373861', title: '시간 변칙', note: '피해 직전에 인원이 많은 방향으로 통과시킵니다.' },
  { skillId: '369299', title: '정수 폭발 확인', note: '발동이 있으면 다친 대상에게 무료 꽃을 사용합니다.' },
  { skillId: '364343', title: '자연 정수로 메아리', note: '쌍둥이 메아리와 자연 정수는 직접 메아리에 씁니다.' },
  { skillId: '1256577', title: '메리스라의 축복', note: '피해가 들어오면 준비한 메아리를 축복으로 회수합니다.' },
  { skillId: '361469', title: '살아있는 불꽃', note: '여유 구간에는 적에게 끝까지 시전해 다음 정수 폭발을 만듭니다.' },
];

const goals = [
  ['유료 에메랄드 꽃', '전투당 0~1회'],
  ['일반 되감기', '비슷한 공격대 전투에서 한 자릿수'],
  ['메아리 0명 축복', '20% 이하'],
  ['축복 시 평균 메아리', '3명 이상'],
  ['정지장에 시간 변칙 포함', '80% 이상'],
  ['살아있는 불꽃 완료율', '80% 이상'],
  ['꿈의 숨결 최초 적중', '평균 8명 이상'],
  ['트라이 종료 마나', '15~20% 이상'],
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

function MetricComparison({ metric }) {
  const max = Math.max(metric.player, metric.reference, 1);
  const playerWidth = `${Math.max((metric.player / max) * 100, 3)}%`;
  const referenceWidth = `${Math.max((metric.reference / max) * 100, 3)}%`;

  return (
    <MetricRow>
      <MetricCopy>
        <strong>{metric.label}</strong>
        <span>{metric.note}</span>
      </MetricCopy>
      <MetricBars aria-label={`${metric.label}: 본인 ${metric.player}${metric.unit}, 상위 참고 ${metric.reference}${metric.unit}`} role="img">
        <MetricBarLine>
          <MetricBarLabel>본인</MetricBarLabel>
          <MetricTrack><MetricFill $width={playerWidth} $tone={metric.inverse ? '#d49a58' : '#4fa78f'} /></MetricTrack>
          <MetricValue>{metric.player}{metric.unit}</MetricValue>
        </MetricBarLine>
        <MetricBarLine>
          <MetricBarLabel>상위</MetricBarLabel>
          <MetricTrack><MetricFill $width={referenceWidth} $tone="#8d99a2" /></MetricTrack>
          <MetricValue>{metric.reference}{metric.unit}</MetricValue>
        </MetricBarLine>
      </MetricBars>
    </MetricRow>
  );
}

function PreservationLogReportPage() {
  useEffect(() => {
    document.title = '보존 기원사 로그 분석 | wowmeta';
    window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      try {
        window.$WowheadPower?.refreshLinks?.();
        window.WH?.Tooltips?.refreshLinks?.();
      } catch (error) {
        // Wowhead links still work if the optional tooltip script is unavailable.
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Page>
      <Hero>
        <HeroTop>
          <BackLink to="/guide/evoker/preservation">
            <ArrowLeft size={16} aria-hidden="true" />
            보존 기원사 가이드
          </BackLink>
          <Snapshot>12.1 · 2026-08-31 분석</Snapshot>
        </HeroTop>
        <HeroBody>
          <div>
            <Eyebrow>WARCRAFT LOGS REVIEW</Eyebrow>
            <Title>코바야시네띵진 보존 기원사 로그 분석</Title>
            <Lead>
              두 영웅 보스 킬을 같은 공격대 보존과 비슷한 전투 길이의 상위 로그에 맞춰 비교했습니다.
              총 HPS보다 메아리 회수, 정수 사용, 마나와 정지장 저장 순서를 중심으로 봅니다.
            </Lead>
          </div>
          <HeroVerdict>
            <HeroVerdictIcon><Target size={21} aria-hidden="true" /></HeroVerdictIcon>
            <div>
              <span>가장 먼저 고칠 것</span>
              <strong>일반 되감기로 메아리를 먼저 소비하지 않기</strong>
              <p>축복 횟수는 충분합니다. 축복을 누를 때 남은 메아리가 적은 것이 핵심 손실입니다.</p>
            </div>
          </HeroVerdict>
        </HeroBody>
      </Hero>

      <VerdictGrid aria-label="전투별 요약">
        {reports.map(report => (
          <FightCard key={report.id} $tone={report.tone}>
            <FightHead>
              <div>
                <FightLabel>{report.verdict}</FightLabel>
                <FightTitle>{report.name}</FightTitle>
              </div>
              <SourceLink href={report.href}>원본 로그</SourceLink>
            </FightHead>
            <FightStats>
              <FightStat><span>HPS</span><strong>{report.hps}</strong></FightStat>
              <FightStat><span>전체 백분위</span><strong>{report.percentile}</strong></FightStat>
              <FightStat><span>아이템 백분위</span><strong>{report.bracket}</strong></FightStat>
              <FightStat><span>과치유</span><strong>{report.overheal}</strong></FightStat>
              <FightStat><span>종료 마나</span><strong>{report.mana}</strong></FightStat>
              <FightStat><span>같은 공대 보존</span><strong>{report.peer} <small>{report.peerDelta}</small></strong></FightStat>
            </FightStats>
            <FightSummary>{report.summary}</FightSummary>
          </FightCard>
        ))}
      </VerdictGrid>

      <ReportLayout>
        <ReportNav aria-label="분석 목차">
          <NavTitle>분석 목차</NavTitle>
          <NavLink href="#context">01 조건 보정</NavLink>
          <NavLink href="#echo">02 메아리 회수</NavLink>
          <NavLink href="#mana">03 마나 누수</NavLink>
          <NavLink href="#stasis">04 정지장</NavLink>
          <NavLink href="#fight-notes">05 전투별 진단</NavLink>
          <NavLink href="#fix-cycle">06 수정 사이클</NavLink>
          <NavLink href="#targets">07 다음 로그 목표</NavLink>
        </ReportNav>

        <Article>
          <Section id="context">
            <SectionHead>
              <SectionIcon><BarChart3 size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>01 · 비교 조건</SectionKicker><SectionTitle>HPS 숫자부터 따라가면 안 됩니다</SectionTitle></div>
            </SectionHead>
            <ConditionGrid>
              {reports.map(report => (
                <Condition key={report.id}>
                  <strong>{report.name}</strong>
                  <span>본인: {report.player}</span>
                  <span>상위 참고: {report.reference}</span>
                  <SourceLink href={report.referenceHref}>상위 참고 로그</SourceLink>
                </Condition>
              ))}
            </ConditionGrid>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>제단 상위 참고 로그는 16명 사망, 다른 힐러 한 명이 36.4k HPS였습니다. 395k를 목표 HPS로 삼지 말고 버튼 배분과 마나만 비교해야 합니다.</p>
            </Caution>
          </Section>

          <Section id="echo">
            <SectionHead>
              <SectionIcon><Sparkles size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>02 · 핵심 원인</SectionKicker><SectionTitle>축복은 눌렀지만 메아리가 비어 있었습니다</SectionTitle></div>
            </SectionHead>
            <SectionLead>
              <SkillLink id="1256577" /> 시전 수는 본인 42회/30회, 상위 참고 39회/33회로 부족하지 않습니다.
              문제는 <SkillLink id="366155" />가 먼저 메아리를 소비해 축복의 복제 대상이 줄었다는 점입니다.
            </SectionLead>
            <EncounterColumns>
              {reports.map(report => (
                <EncounterPanel key={report.id}>
                  <EncounterHeading><span>{report.name}</span><strong>본인 / 상위 참고</strong></EncounterHeading>
                  {echoMetrics[report.id].map(metric => <MetricComparison key={metric.label} metric={metric} />)}
                </EncounterPanel>
              ))}
            </EncounterColumns>
            <Finding>
              <FindingMark>판정</FindingMark>
              <p><SkillLink id="355936" /> 1단계 선택과 사용 횟수는 정상입니다. 바꿀 부분은 꿈의 숨결 이후입니다. <SkillLink id="373861" />과 직접 <SkillLink id="364343" />로 대상을 준비한 뒤 <SkillLink id="1256577" />으로 회수해야 합니다.</p>
            </Finding>
          </Section>

          <Section id="mana">
            <SectionHead>
              <SectionIcon><Droplets size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>03 · 자원</SectionKicker><SectionTitle>두 항목에서만 마나 반 줄이 더 나갔습니다</SectionTitle></div>
            </SectionHead>
            <SpendEquation aria-label="상위 로그 대비 추가 마나 지출">
              <SpendItem>
                <SkillLink id="355913" />
                <strong>유료 꽃 +6회</strong>
                <span>6 × 8,825 = 52,950</span>
              </SpendItem>
              <EquationSymbol>+</EquationSymbol>
              <SpendItem>
                <SkillLink id="366155" />
                <strong>일반 되감기 +14회</strong>
                <span>14 × 5,500 = 77,000</span>
              </SpendItem>
              <EquationSymbol>=</EquationSymbol>
              <SpendTotal>
                <span>추가 지출</span>
                <strong>129,950</strong>
                <small>기본 마나 약 50%</small>
              </SpendTotal>
            </SpendEquation>
            <ManaGrid>
              <ManaRow>
                <div><strong>울라텍</strong><span>물약 2개 사용</span></div>
                <ManaTrack aria-label="울라텍 종료 마나 본인 1.5%, 상위 32.9%" role="img">
                  <ManaLine><span>본인</span><i style={{ width: '1.5%' }} /><b>1.5%</b></ManaLine>
                  <ManaLine><span>상위</span><i style={{ width: '32.9%' }} /><b>32.9%</b></ManaLine>
                </ManaTrack>
              </ManaRow>
              <ManaRow>
                <div><strong>휘감긴 제단</strong><span>물약 미사용</span></div>
                <ManaTrack aria-label="휘감긴 제단 종료 마나 본인 5.3%, 상위 39.1%" role="img">
                  <ManaLine><span>본인</span><i style={{ width: '5.3%' }} /><b>5.3%</b></ManaLine>
                  <ManaLine><span>상위</span><i style={{ width: '39.1%' }} /><b>39.1%</b></ManaLine>
                </ManaTrack>
              </ManaRow>
            </ManaGrid>
            <RuleStrip>
              <Rule><span>정수 폭발 있음</span><strong><SkillLink id="355913" /></strong></Rule>
              <Rule><span>자연 정수</span><strong><SkillLink id="364343" /></strong></Rule>
              <Rule><span>축복 없음 · 즉시 복구</span><strong><SkillLink id="366155" /></strong></Rule>
            </RuleStrip>
          </Section>

          <Section id="stasis">
            <SectionHead>
              <SectionIcon><Route size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>04 · 저장 조합</SectionKicker><SectionTitle>정지장은 횟수가 아니라 내용이 약했습니다</SectionTitle></div>
            </SectionHead>
            <StasisScores>
              <StasisScore><span>울라텍 시간 변칙 포함</span><strong>본인 2/6</strong><small>상위 4/5</small></StasisScore>
              <StasisScore><span>제단 시간 변칙 포함</span><strong>본인 3/5</strong><small>상위 5/5</small></StasisScore>
            </StasisScores>
            <SequenceCompare>
              <SequenceBlock $bad>
                <SequenceLabel>반복된 낮은 가치 저장</SequenceLabel>
                <Sequence>
                  <SkillLink id="355936" /><ChevronRight size={16} /><SkillLink id="355913" /><ChevronRight size={16} /><SkillLink id="355913" />
                </Sequence>
                <p>꽃 저장 자체가 틀린 것은 아니지만 시간 변칙이 빠진 이중 꽃을 반복했습니다.</p>
              </SequenceBlock>
              <SequenceBlock>
                <SequenceLabel>기본 저장</SequenceLabel>
                <Sequence>
                  <SkillLink id="355936" /><ChevronRight size={16} /><SkillLink id="373861" /><ChevronRight size={16} /><SkillLink id="1256577" />
                </Sequence>
                <p>꿈의 숨결과 시간 변칙을 고정하고 세 번째 칸만 피해 패턴에 맞춰 바꿉니다.</p>
              </SequenceBlock>
            </SequenceCompare>
          </Section>

          <Section id="fight-notes">
            <SectionHead>
              <SectionIcon><Gauge size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>05 · 전투별 진단</SectionKicker><SectionTitle>공통 문제와 보스별 문제를 분리합니다</SectionTitle></div>
            </SectionHead>
            <FightNotes>
              <FightNote>
                <h3>울라텍</h3>
                <FindingList>
                  <li><strong>살아있는 불꽃 완료율 50%</strong><span>28회 시작 중 14회만 완료했습니다. 상위 참고는 29회 중 25회입니다.</span></li>
                  <li><strong>축복 1회당 294k</strong><span>축복 시 평균 메아리가 2.21명이라 버튼 횟수가 치유량으로 이어지지 않았습니다.</span></li>
                  <li><strong>미풍 1회</strong><span>공대 생존기 배정이 아니었다면 9분 47초 전투에서 추가 사용 여지가 있습니다.</span></li>
                </FindingList>
              </FightNote>
              <FightNote>
                <h3>휘감긴 제단</h3>
                <FindingList>
                  <li><strong>꿈의 숨결 최초 적중 7.84명</strong><span>상위 참고 9.58명입니다. 횟수보다 전방 각도와 피해 타이밍을 고쳐야 합니다.</span></li>
                  <li><strong>신록의 품 과치유 67.8%</strong><span>자기 시전은 4세트 운용상 정상입니다. 정수 폭발 2중첩에서 발동을 덮지만 않는지 확인합니다.</span></li>
                  <li><strong>흑요석 비늘 1회</strong><span>같은 공격대 보존 3회, 상위 참고 4회보다 개인 생존기 사용이 적었습니다.</span></li>
                </FindingList>
              </FightNote>
            </FightNotes>
          </Section>

          <Section id="fix-cycle">
            <SectionHead>
              <SectionIcon><Shield size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>06 · 수정안</SectionKicker><SectionTitle>다음 트라이에서 이 순서만 지킵니다</SectionTitle></div>
            </SectionHead>
            <CycleRail>
              {cycle.map((step, index) => (
                <CycleStep key={step.title}>
                  <CycleNumber>{String(index + 1).padStart(2, '0')}</CycleNumber>
                  <CycleSkill><SkillLink id={step.skillId}>{step.title}</SkillLink></CycleSkill>
                  <p>{step.note}</p>
                  {index < cycle.length - 1 && <CycleArrow aria-hidden="true"><ChevronRight size={18} /></CycleArrow>}
                </CycleStep>
              ))}
            </CycleRail>
            <EmergencyNote>
              <CircleAlert size={17} aria-hidden="true" />
              <p><SkillLink id="1256577" />이 없고 즉시 복구가 필요한 경우에만 일반 <SkillLink id="366155" />로 메아리를 소비합니다. 일반 되감기를 금지하는 것이 아니라 기본 소비기에서 내리는 것이 목표입니다.</p>
            </EmergencyNote>
          </Section>

          <Section id="targets">
            <SectionHead>
              <SectionIcon><ListChecks size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>07 · 재검수</SectionKicker><SectionTitle>다음 로그에서 볼 숫자</SectionTitle></div>
            </SectionHead>
            <GoalGrid>
              {goals.map(([label, value]) => (
                <Goal key={label}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </Goal>
              ))}
            </GoalGrid>
            <PriorityLine><strong>수정 순서</strong><span>일반 되감기 감소 → 유료 꽃 제거 → 축복 전 메아리 3명 이상 → 정지장 조합 수정</span></PriorityLine>
          </Section>

          <Sources>
            <strong>운용 기준</strong>
            <SourceLink href="https://spiritbloom.pro/preservation/raid">SpiritbloomPro 12.1 레이드</SourceLink>
            <SourceLink href="https://www.wowhead.com/guide/classes/evoker/preservation/rotation-cooldowns-pve-healer">Wowhead 12.1 보존 딜사이클</SourceLink>
            <SourceLink href="https://worldofwarcraft.blizzard.com/en-us/news/24293281/curse-of-ulatek-content-update-notes">Blizzard 12.1 패치 노트</SourceLink>
          </Sources>
        </Article>
      </ReportLayout>
    </Page>
  );
}

const Page = styled.div`
  width: min(1240px, calc(100vw - 40px));
  max-width: calc(100vw - 40px);
  margin: 0 auto;
  padding: 28px 0 96px;
  overflow-x: hidden;
  word-break: keep-all;

  @media (max-width: 560px) {
    width: calc(100vw - 20px);
    max-width: calc(100vw - 20px);
    padding-top: 20px;
  }
`;

const Hero = styled.header`
  border-top: 3px solid #33937f;
  border-bottom: 1px solid rgba(168, 178, 188, 0.16);
  background: rgba(13, 18, 22, 0.72);
`;

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 4px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.11);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #c7bba7;
  font-size: 0.82rem;
  font-weight: 650;
`;

const Snapshot = styled.span`
  color: #9aa5ad;
  font-size: 0.76rem;
  font-weight: 650;
`;

const HeroBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 350px);
  gap: clamp(28px, 5vw, 68px);
  align-items: end;
  padding: clamp(30px, 5vw, 54px) 4px;

  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;

const Eyebrow = styled.div`
  color: #75bda9;
  font-size: 0.74rem;
  font-weight: 750;
`;

const Title = styled.h1`
  max-width: 760px;
  margin-top: 9px;
  color: #f2f4f5;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.14;
`;

const Lead = styled.p`
  max-width: 74ch;
  margin-top: 16px;
  color: #bec8ce;
  font-size: 1rem;
  line-height: 1.78;
  text-wrap: pretty;
`;

const HeroVerdict = styled.div`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 12px;
  padding: 18px 0;
  border-top: 1px solid rgba(117, 189, 169, 0.4);
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);

  span { color: #75bda9; font-size: 0.7rem; font-weight: 750; }
  strong { display: block; margin-top: 4px; color: #eff3f4; font-size: 1rem; line-height: 1.45; }
  p { margin-top: 8px; color: #96a2aa; font-size: 0.78rem; line-height: 1.65; }
`;

const HeroVerdictIcon = styled.div`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #75bda9;
  border: 1px solid rgba(117, 189, 169, 0.4);
`;

const VerdictGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 26px;

  @media (max-width: 820px) { grid-template-columns: 1fr; }
`;

const FightCard = styled.article`
  min-width: 0;
  padding: 20px;
  border-top: 3px solid ${props => props.$tone};
  border-right: 1px solid rgba(168, 178, 188, 0.14);
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
  border-left: 1px solid rgba(168, 178, 188, 0.14);
  background: #0d1216;
`;

const FightHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const FightLabel = styled.div`
  color: #a8b2b8;
  font-size: 0.7rem;
  font-weight: 700;
`;

const FightTitle = styled.h2`
  margin-top: 4px;
  color: #f0f2f3;
  font-size: 1.35rem;
`;

const FightStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 18px;
  border-top: 1px solid rgba(168, 178, 188, 0.13);
  border-left: 1px solid rgba(168, 178, 188, 0.13);

  @media (max-width: 500px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

const FightStat = styled.div`
  min-width: 0;
  min-height: 64px;
  padding: 10px;
  border-right: 1px solid rgba(168, 178, 188, 0.13);
  border-bottom: 1px solid rgba(168, 178, 188, 0.13);

  span { color: #7f8c95; font-size: 0.66rem; }
  strong { display: block; margin-top: 4px; color: #e9edef; font-size: 0.94rem; overflow-wrap: anywhere; }
  small { color: #75bda9; font-size: 0.68rem; }
`;

const FightSummary = styled.p`
  margin-top: 16px;
  color: #aab4ba;
  font-size: 0.84rem;
  line-height: 1.7;
`;

const ReportLayout = styled.div`
  display: grid;
  grid-template-columns: 190px minmax(0, 940px);
  justify-content: center;
  gap: clamp(28px, 4vw, 52px);
  margin-top: 44px;

  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;

const ReportNav = styled.nav`
  position: sticky;
  top: 78px;
  align-self: start;
  display: grid;
  padding-right: 16px;
  border-right: 1px solid rgba(168, 178, 188, 0.14);

  @media (max-width: 980px) {
    position: static;
    display: flex;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid rgba(168, 178, 188, 0.14);
  }
`;

const NavTitle = styled.div`
  padding: 0 8px 10px;
  color: #6f7d86;
  font-size: 0.68rem;
  font-weight: 750;

  @media (max-width: 980px) { display: none; }
`;

const NavLink = styled.a`
  padding: 9px 8px;
  color: #919ca4;
  font-size: 0.76rem;
  border-top: 1px solid rgba(168, 178, 188, 0.08);
  white-space: nowrap;

  &:hover { color: #eef1f3; }
`;

const Article = styled.article`
  min-width: 0;
`;

const Section = styled.section`
  min-width: 0;
  padding: 38px 0 46px;
  border-top: 1px solid rgba(168, 178, 188, 0.15);

  &:first-child { padding-top: 0; border-top: 0; }
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
`;

const SectionIcon = styled.div`
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #75bda9;
  border: 1px solid rgba(117, 189, 169, 0.38);
`;

const SectionKicker = styled.div`
  color: #8b979f;
  font-size: 0.67rem;
  font-weight: 700;
`;

const SectionTitle = styled.h2`
  margin-top: 3px;
  color: #f1f3f4;
  font-size: clamp(1.25rem, 2.6vw, 1.72rem);
`;

const SectionLead = styled.p`
  max-width: 82ch;
  margin-bottom: 20px;
  color: #b1bbc1;
  font-size: 0.94rem;
  line-height: 1.85;
`;

const ConditionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const Condition = styled.div`
  display: grid;
  gap: 6px;
  padding: 15px 0;
  border-top: 2px solid #46535b;
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);

  strong { color: #e8ecee; font-size: 1rem; }
  span { color: #929ea6; font-size: 0.78rem; line-height: 1.55; }
`;

const Caution = styled.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 10px;
  margin-top: 20px;
  padding: 14px 16px;
  color: #d5b273;
  border-left: 3px solid #d5b273;
  background: rgba(213, 178, 115, 0.07);

  p { color: #c8bda9; font-size: 0.82rem; line-height: 1.68; }
`;

const EncounterColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 26px;

  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;

const EncounterPanel = styled.div`
  min-width: 0;
  border-top: 2px solid #33937f;
`;

const EncounterHeading = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(168, 178, 188, 0.13);

  span { color: #eef1f3; font-weight: 720; }
  strong { color: #77858e; font-size: 0.69rem; }
`;

const MetricRow = styled.div`
  padding: 14px 0;
  border-bottom: 1px solid rgba(168, 178, 188, 0.1);
`;

const MetricCopy = styled.div`
  strong { color: #dfe4e7; font-size: 0.82rem; }
  span { display: block; margin-top: 4px; color: #7f8d96; font-size: 0.7rem; line-height: 1.5; }
`;

const MetricBars = styled.div`
  display: grid;
  gap: 5px;
  margin-top: 10px;
`;

const MetricBarLine = styled.div`
  display: grid;
  grid-template-columns: 30px minmax(60px, 1fr) 54px;
  gap: 7px;
  align-items: center;
`;

const MetricBarLabel = styled.span`
  color: #738089;
  font-size: 0.64rem;
`;

const MetricTrack = styled.div`
  height: 5px;
  background: rgba(168, 178, 188, 0.1);
`;

const MetricFill = styled.div`
  width: ${props => props.$width};
  height: 100%;
  background: ${props => props.$tone};
`;

const MetricValue = styled.strong`
  color: #dce2e5;
  font-size: 0.72rem;
  text-align: right;
`;

const Finding = styled.div`
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 14px;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid rgba(117, 189, 169, 0.3);

  p { color: #b4bec4; font-size: 0.84rem; line-height: 1.8; }

  @media (max-width: 560px) { grid-template-columns: 1fr; gap: 8px; }
`;

const FindingMark = styled.strong`
  color: #75bda9;
  font-size: 0.72rem;
`;

const SpendEquation = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr) 24px minmax(140px, 0.72fr);
  gap: 10px;
  align-items: stretch;

  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const SpendItem = styled.div`
  min-width: 0;
  padding: 14px;
  border: 1px solid rgba(168, 178, 188, 0.14);
  background: #0d1216;

  strong { display: block; margin-top: 10px; color: #e7ebed; font-size: 0.88rem; }
  > span { display: block; margin-top: 4px; color: #89969e; font-size: 0.72rem; }
`;

const EquationSymbol = styled.div`
  display: grid;
  place-items: center;
  color: #75828a;
  font-weight: 700;

  @media (max-width: 760px) { height: 18px; }
`;

const SpendTotal = styled.div`
  display: grid;
  align-content: center;
  padding: 14px;
  border: 1px solid rgba(212, 154, 88, 0.42);
  background: rgba(212, 154, 88, 0.07);

  span { color: #b9976d; font-size: 0.68rem; }
  strong { color: #f0d0a8; font-size: 1.35rem; }
  small { color: #9e8a74; font-size: 0.68rem; }
`;

const ManaGrid = styled.div`
  display: grid;
  gap: 0;
  margin-top: 22px;
  border-top: 1px solid rgba(168, 178, 188, 0.13);
`;

const ManaRow = styled.div`
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(168, 178, 188, 0.13);

  > div:first-child strong { display: block; color: #dfe4e7; font-size: 0.82rem; }
  > div:first-child span { color: #77858e; font-size: 0.68rem; }

  @media (max-width: 620px) { grid-template-columns: 1fr; gap: 10px; }
`;

const ManaTrack = styled.div`
  display: grid;
  gap: 6px;
`;

const ManaLine = styled.div`
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) 48px;
  gap: 8px;
  align-items: center;

  span { color: #75828a; font-size: 0.65rem; }
  i { display: block; min-width: 3px; height: 6px; background: #4e9fc4; }
  b { color: #cfd6da; font-size: 0.72rem; text-align: right; }
`;

const RuleStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 20px;
  border-top: 1px solid rgba(117, 189, 169, 0.3);
  border-left: 1px solid rgba(168, 178, 188, 0.12);

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const Rule = styled.div`
  min-width: 0;
  padding: 12px;
  border-right: 1px solid rgba(168, 178, 188, 0.12);
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);

  > span { display: block; color: #829099; font-size: 0.67rem; }
  > strong { display: block; margin-top: 7px; }
`;

const StasisScores = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;

  @media (max-width: 620px) { grid-template-columns: 1fr; }
`;

const StasisScore = styled.div`
  padding: 13px 0;
  border-top: 2px solid #46535b;
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);

  span { color: #84919a; font-size: 0.7rem; }
  strong { display: block; margin-top: 4px; color: #e4e8ea; font-size: 1.05rem; }
  small { color: #75bda9; font-size: 0.71rem; }
`;

const SequenceCompare = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 820px) { grid-template-columns: 1fr; }
`;

const SequenceBlock = styled.div`
  min-width: 0;
  padding: 16px;
  border: 1px solid ${props => props.$bad ? 'rgba(212, 154, 88, 0.32)' : 'rgba(117, 189, 169, 0.32)'};
  background: #0d1216;

  p { margin-top: 12px; color: #87949c; font-size: 0.73rem; line-height: 1.6; }
`;

const SequenceLabel = styled.div`
  color: #9ca7ae;
  font-size: 0.69rem;
  font-weight: 700;
`;

const Sequence = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: #67747c;
`;

const FightNotes = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;

  @media (max-width: 820px) { grid-template-columns: 1fr; }
`;

const FightNote = styled.div`
  min-width: 0;
  border-top: 2px solid #46535b;

  h3 { padding: 13px 0 10px; color: #eef1f3; font-size: 1rem; }
`;

const FindingList = styled.ul`
  list-style: none;

  li { padding: 12px 0; border-top: 1px solid rgba(168, 178, 188, 0.1); }
  strong { display: block; color: #dce2e5; font-size: 0.8rem; }
  span { display: block; margin-top: 4px; color: #839099; font-size: 0.72rem; line-height: 1.6; }
`;

const CycleRail = styled.ol`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  list-style: none;
  border-top: 1px solid rgba(117, 189, 169, 0.35);

  @media (max-width: 980px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 620px) { grid-template-columns: 1fr; }
`;

const CycleStep = styled.li`
  position: relative;
  min-width: 0;
  min-height: 178px;
  padding: 14px 12px;
  border-right: 1px solid rgba(168, 178, 188, 0.12);
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);

  p { margin-top: 10px; color: #7e8b94; font-size: 0.68rem; line-height: 1.55; }

  @media (max-width: 620px) {
    min-height: 0;
    padding: 13px 10px 15px 48px;
  }
`;

const CycleNumber = styled.div`
  color: #5c6b74;
  font-size: 0.66rem;
  font-weight: 750;

  @media (max-width: 620px) { position: absolute; left: 10px; top: 15px; }
`;

const CycleSkill = styled.div`
  margin-top: 12px;
`;

const CycleArrow = styled.div`
  position: absolute;
  z-index: 1;
  top: 42px;
  right: -10px;
  color: #6b777f;

  @media (max-width: 620px) { display: none; }
`;

const EmergencyNote = styled.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 10px;
  margin-top: 18px;
  padding: 13px 0;
  color: #d5b273;
  border-bottom: 1px solid rgba(213, 178, 115, 0.24);

  p { color: #aaa092; font-size: 0.78rem; line-height: 1.7; }
`;

const GoalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(168, 178, 188, 0.14);
  border-left: 1px solid rgba(168, 178, 188, 0.14);

  @media (max-width: 660px) { grid-template-columns: 1fr; }
`;

const Goal = styled.div`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 12px;
  border-right: 1px solid rgba(168, 178, 188, 0.14);
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
  color: #75bda9;

  span { color: #9aa6ad; font-size: 0.75rem; }
  strong { color: #e2e7e9; font-size: 0.78rem; text-align: right; }
`;

const PriorityLine = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 12px;
  margin-top: 18px;
  padding: 14px 0;
  border-top: 2px solid #33937f;
  border-bottom: 1px solid rgba(168, 178, 188, 0.13);

  strong { color: #75bda9; font-size: 0.76rem; }
  span { color: #c0c8cd; font-size: 0.8rem; line-height: 1.65; }

  @media (max-width: 560px) { grid-template-columns: 1fr; gap: 5px; }
`;

const Sources = styled.footer`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(168, 178, 188, 0.14);

  > strong { color: #7d8a93; font-size: 0.7rem; }
`;

const ExternalAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #b9c2c7;
  font-size: 0.7rem;
  font-weight: 650;

  &:hover { color: #f1f3f4; }
`;

const SkillAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  color: #e7c46f;
  font-weight: 680;
  line-height: 1.35;
  vertical-align: -0.16em;
  white-space: nowrap;
  border-bottom: 1px solid rgba(231, 196, 111, 0.22);

  img {
    flex: 0 0 auto;
    width: 1.08em;
    height: 1.08em;
    object-fit: cover;
    border: 1px solid rgba(255, 209, 102, 0.38);
    border-radius: 3px;
  }

  &:hover { color: #f7dda0; border-bottom-color: rgba(247, 221, 160, 0.75); }
`;

const SkillFallback = styled.span`
  width: 1.08em;
  height: 1.08em;
  border: 1px solid rgba(255, 209, 102, 0.38);
  background: rgba(255, 209, 102, 0.16);
`;

export default PreservationLogReportPage;
