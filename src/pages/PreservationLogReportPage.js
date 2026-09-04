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
import LogReportSidebarList from '../components/LogReportSidebarList.js';

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
    name: '똬리의 제단',
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

const venomousFights = [
  { id: 10, name: '영혼살무사 네크잘리', result: '킬', duration: '4:22', koba: 162494, speed: 186158, kobaOh: 67.1, speedOh: 65.7, gap: 14.6 },
  { id: 18, name: '매장된 파수꾼', result: '킬', duration: '4:49', koba: 246584, speed: 305556, kobaOh: 46.9, speedOh: 47.6, gap: 23.9 },
  { id: 24, name: '악성의 바쉬니크', result: '킬', duration: '4:08', koba: 178894, speed: 203610, kobaOh: 61.9, speedOh: 60.7, gap: 13.8 },
  { id: 31, name: '길 잃은 탐험가', result: '킬', duration: '3:39', koba: 155773, speed: 212263, kobaOh: 59.0, speedOh: 58.9, gap: 36.3 },
  { id: 38, name: '스조라크', result: '킬', duration: '4:27', koba: 240130, speed: 361338, kobaOh: 41.2, speedOh: 42.9, gap: 50.5 },
  { id: 40, name: '쌍둥이 송곳니', result: '킬', duration: '5:41', koba: 242316, speed: 303558, kobaOh: 47.6, speedOh: 48.1, gap: 25.3 },
  { id: 44, name: '똬리의 제단', result: '킬', duration: '6:32', koba: 253660, speed: 334689, kobaOh: 43.4, speedOh: 45.3, gap: 31.9 },
  { id: 45, name: '울라텍', result: '전멸', duration: '4:33', koba: 246648, speed: 323424, kobaOh: 40.2, speedOh: 41.8, gap: 31.1 },
  { id: 46, name: '울라텍', result: '킬', duration: '9:32', koba: 292700, speed: 381162, kobaOh: 35.3, speedOh: 37.2, gap: 30.2 },
];

const venomousLoopMetrics = [
  { skillId: '360995', label: '신록의 품', player: 10, reference: 138, unit: '회', note: '0.21회/분 대 2.89회/분. 4세트의 확정 정수 폭발 생성기를 거의 사용하지 않았습니다.' },
  { skillId: '369299', label: '정수 폭발 소비', player: 576, reference: 844, unit: '회', note: 'Speed가 268회 더 소비했습니다. 획득량 차이와 거의 같습니다.' },
  { skillId: '355913', label: '에메랄드 꽃', player: 445, reference: 613, unit: '회', note: 'Speed +37.8%. 무료 꽃이 쌍둥이 메아리와 2세트 자동 치유를 함께 엽니다.' },
  { skillId: '1242031', label: '쌍둥이 메아리 소비', player: 260, reference: 409, unit: '회', note: 'Speed +57.3%. 다음 직접 메아리의 대상 수를 늘리는 핵심 격차입니다.' },
  { skillId: '364343', label: '직접 메아리', player: 361, reference: 583, unit: '회', note: 'Speed +61.5%. 축복 직전의 복제 대상 준비량이 달라졌습니다.' },
];

const venomousOutputMetrics = [
  { skillId: '355913', label: '에메랄드 꽃', player: 85.85, reference: 129.97, unit: 'M', note: '유효 치유 차이 +44.12M. 단일 주문 기준 가장 큰 격차입니다.' },
  { skillId: '366155', label: '되감기', player: 131.53, reference: 159.49, unit: 'M', note: '직접 시전은 65회 대 68회로 비슷하지만 복제·유지 결과가 달랐습니다.' },
  { skillId: '1256577', label: '메리스라의 축복', player: 81.09, reference: 97.71, unit: 'M', note: '218회 대 217회로 횟수는 같고, Speed의 1회당 유효 치유가 21.1% 높았습니다.' },
  { skillId: '363534', label: '되돌리기', player: 37.66, reference: 51.67, unit: 'M', note: '16회 대 17회. Speed는 과치유가 30.1%, 코바야시는 41.2%였습니다.' },
  { label: 'Soulcoiler 장신구', player: 15.82, reference: 33.92, unit: 'M', note: 'WCL 사용 기록 16회 대 29회. 빌드가 아닌 사용 빈도 차이도 큽니다.' },
];

const venomousCycle = [
  { skillId: '355936', title: '꿈의 숨결 1단계', note: '예정된 광역 피해보다 앞서 지속 치유와 축복 발동을 준비합니다.' },
  { skillId: '360995', title: '신록의 품', note: '정수 폭발이 2중첩이 아닐 때 사용해 4세트 확정 발동을 받습니다.' },
  { skillId: '355913', title: '무료 에메랄드 꽃', note: '정수 폭발을 소비해 2세트 자동 치유와 쌍둥이 메아리를 엽니다.' },
  { skillId: '373861', title: '시간 변칙', note: '피해 직전 공대원이 많은 방향으로 보내 약한 메아리를 넓게 깝니다.' },
  { skillId: '364343', title: '메아리', note: '쌍둥이 메아리 중첩을 소비한 뒤 남은 자연 정수도 직접 메아리에 씁니다.' },
  { skillId: '1256577', title: '메리스라의 축복', note: '실제 피해가 들어온 직후 준비한 메아리를 한 번에 회수합니다.' },
];

const venomousTargets = [
  ['신록의 품', '피해·이동이 허용하면 분당 2회 이상'],
  ['정수 폭발', '2중첩 전에 무료 꽃으로 먼저 소비'],
  ['쌍둥이 메아리', '2중첩을 오래 들고 있지 않기'],
  ['되돌리기 과치유', '35% 이하'],
  ['정지장', '큰 피해 전에 저장, 피해 시작과 함께 방출'],
  ['공대 생존기', '미풍·시간 팽창 배정표에 기록'],
  ['딜 전환', '다음 치유 준비가 끝난 구간에만'],
  ['검수 단위', 'HPS보다 메커니즘별 시전·소비량'],
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

function MetricComparison({ metric, playerLabel = '본인', referenceLabel = '상위' }) {
  const max = Math.max(metric.player, metric.reference, 1);
  const playerWidth = `${Math.max((metric.player / max) * 100, 3)}%`;
  const referenceWidth = `${Math.max((metric.reference / max) * 100, 3)}%`;

  return (
    <MetricRow>
      <MetricCopy>
        <strong>{metric.skillId ? <SkillLink id={metric.skillId}>{metric.label}</SkillLink> : metric.label}</strong>
        <span>{metric.note}</span>
      </MetricCopy>
      <MetricBars aria-label={`${metric.label}: ${playerLabel} ${metric.player}${metric.unit}, ${referenceLabel} ${metric.reference}${metric.unit}`} role="img">
        <MetricBarLine>
          <MetricBarLabel>{playerLabel}</MetricBarLabel>
          <MetricTrack><MetricFill $width={playerWidth} $tone={metric.inverse ? '#d49a58' : '#4fa78f'} /></MetricTrack>
          <MetricValue>{metric.player}{metric.unit}</MetricValue>
        </MetricBarLine>
        <MetricBarLine>
          <MetricBarLabel>{referenceLabel}</MetricBarLabel>
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
          <BackLink to="/logs/evoker-preservation">
            <ArrowLeft size={16} aria-hidden="true" />
            보존 기원사 로그 분석 목록
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
          <LogReportSidebarList />
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
                <div><strong>똬리의 제단</strong><span>물약 미사용</span></div>
                <ManaTrack aria-label="똬리의 제단 종료 마나 본인 5.3%, 상위 39.1%" role="img">
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
                <h3>똬리의 제단</h3>
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

function VenomousDepthsComparisonPage() {
  useEffect(() => {
    document.title = '코바야시네띵진 vs Speed | 맹독 심연 로그 분석 | wowmeta';
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
          <BackLink to="/logs/evoker-preservation">
            <ArrowLeft size={16} aria-hidden="true" />
            보존 기원사 로그 분석 목록
          </BackLink>
          <Snapshot>12.1 · 2026-09-04 분석</Snapshot>
        </HeroTop>
        <HeroBody>
          <div>
            <Eyebrow>WARCRAFT LOGS REVIEW · 맹독 심연 영웅</Eyebrow>
            <Title>같은 공대, 같은 보존, 198.3M의 차이</Title>
            <Lead>
              코바야시네띵진과 Speed가 함께 참여한 맹독 심연 8개 우두머리, 9개 전투를 동일 조건으로 비교했습니다.
              결과만 보면 Speed가 29.5% 앞서지만, 진짜 차이는 총 HPS가 아니라 12.1 시즌 2 세트를 실제 사이클로 연결했는지에 있습니다.
            </Lead>
          </div>
          <HeroVerdict>
            <HeroVerdictIcon><Target size={21} aria-hidden="true" /></HeroVerdictIcon>
            <div>
              <span>핵심 판정</span>
              <strong><SkillLink id="360995" /> 10회 대 138회</strong>
              <p>코바야시는 4세트를 착용했지만 확정 <SkillLink id="369299" /> 생성기를 거의 사용하지 않아 이후의 무료 꽃·쌍둥이 메아리·축복 연결까지 함께 줄었습니다.</p>
            </div>
          </HeroVerdict>
        </HeroBody>
      </Hero>

      <VerdictGrid aria-label="전체 비교 요약">
        <FightCard $tone="#d49a58">
          <FightHead>
            <div><FightLabel>코바야시네띵진</FightLabel><FightTitle>유효 치유 673.1M</FightTitle></div>
            <SourceLink href="https://www.warcraftlogs.com/reports/JPFG6A3LQ1dN7nDv?source=95&type=healing">원본 로그</SourceLink>
          </FightHead>
          <FightStats>
            <FightStat><span>통합 HPS</span><strong>235.2k</strong></FightStat>
            <FightStat><span>과치유</span><strong>47.3%</strong></FightStat>
            <FightStat><span>공격 피해</span><strong>29.43M</strong></FightStat>
            <FightStat><span><SkillLink id="360995" /></span><strong>10회</strong></FightStat>
            <FightStat><span><SkillLink id="355913" /></span><strong>445회</strong></FightStat>
            <FightStat><span><SkillLink id="364343" /></span><strong>361회</strong></FightStat>
          </FightStats>
          <FightSummary>기본 호흡기와 시간 변칙 횟수는 오히려 많았습니다. 활동량 부족이 아니라 시즌 2 자원 증폭 고리가 끊긴 것이 문제입니다.</FightSummary>
        </FightCard>
        <FightCard $tone="#55a68f">
          <FightHead>
            <div><FightLabel>Speed</FightLabel><FightTitle>유효 치유 871.3M</FightTitle></div>
            <SourceLink href="https://www.warcraftlogs.com/reports/JPFG6A3LQ1dN7nDv?source=104&type=healing">원본 로그</SourceLink>
          </FightHead>
          <FightStats>
            <FightStat><span>통합 HPS</span><strong>304.5k</strong></FightStat>
            <FightStat><span>과치유</span><strong>47.5%</strong></FightStat>
            <FightStat><span>공격 피해</span><strong>10.03M</strong></FightStat>
            <FightStat><span><SkillLink id="360995" /></span><strong>138회</strong></FightStat>
            <FightStat><span><SkillLink id="355913" /></span><strong>613회</strong></FightStat>
            <FightStat><span><SkillLink id="364343" /></span><strong>583회</strong></FightStat>
          </FightStats>
          <FightSummary>더 많이 치유했지만 과치유율은 거의 같았습니다. 단순히 먼저 선점한 치유가 아니라 실제 자원 생성과 유효 회수가 함께 증가했습니다.</FightSummary>
        </FightCard>
      </VerdictGrid>

      <ReportLayout>
        <ReportNav aria-label="분석 목차">
          <NavTitle>분석 목차</NavTitle>
          <NavLink href="#method">01 범위와 판정법</NavLink>
          <NavLink href="#fights">02 전투별 결과</NavLink>
          <NavLink href="#mechanism">03 핵심 메커니즘</NavLink>
          <NavLink href="#evidence">04 원시 이벤트 증거</NavLink>
          <NavLink href="#timing">05 울라텍 타임라인</NavLink>
          <NavLink href="#cooldowns">06 쿨기와 생존</NavLink>
          <NavLink href="#context">07 해석 보정</NavLink>
          <NavLink href="#fix">08 수정 루틴</NavLink>
          <NavLink href="#limits">09 한계와 재검수</NavLink>
          <LogReportSidebarList />
        </ReportNav>

        <Article>
          <Section id="method">
            <SectionHead>
              <SectionIcon><BarChart3 size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>01 · 범위와 판정법</SectionKicker><SectionTitle>같은 전투 안에서 조건을 최대한 고정했습니다</SectionTitle></div>
            </SectionHead>
            <SectionLead>
              2026년 9월 3일 기록된 한 보고서에서 두 플레이어가 동시에 참여한 맹독 심연 영웅 전투만 골랐습니다.
              8개 우두머리의 8킬과 울라텍 전멸 1회를 합친 47분 42초이며, 코바야시네띵진은 actor 95, Speed는 actor 104입니다.
            </SectionLead>
            <ResearchGrid>
              <ResearchPoint>
                <span>비교 단위</span>
                <strong>동일 공격대 · 동일 전투 · 동일 전문화</strong>
                <p>피해 패턴, 전투 길이, 다른 힐러 구성이 같아 서로 다른 공개 로그보다 훨씬 강한 비교 조건입니다.</p>
              </ResearchPoint>
              <ResearchPoint>
                <span>원시 자료</span>
                <strong>치유·과치유·시전·버프 이벤트</strong>
                <p>활성 시전에서는 WCL의 fake 이벤트를 제외했고, 버프는 획득·중첩 획득·제거·중첩 제거만 셌습니다.</p>
              </ResearchPoint>
              <ResearchPoint>
                <span>판정 원칙</span>
                <strong>결과와 원인을 따로 평가</strong>
                <p>HPS는 결론이 아니라 결과입니다. 특성·장비·딜 전환·사망 시간을 분리한 뒤 플레이 가능한 수정점만 남겼습니다.</p>
              </ResearchPoint>
            </ResearchGrid>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>보고서의 Nymrissa Wavecaller 전투는 블리자드가 공개한 맹독 심연 8개 우두머리에 포함되지 않아 집계에서 제외했습니다. 울라텍은 전멸과 킬을 서로 다른 표본으로 유지했습니다.</p>
            </Caution>
          </Section>

          <Section id="fights">
            <SectionHead>
              <SectionIcon><Gauge size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>02 · 전투별 결과</SectionKicker><SectionTitle>Speed가 9개 전투 모두 앞섰습니다</SectionTitle></div>
            </SectionHead>
            <SectionLead>
              차이는 최소 13.8%, 최대 50.5%였습니다. 스조라크에서 가장 크게 벌어졌고, 울라텍 킬에서도 30.2%가 유지됐습니다.
              특정 보스 한 번의 우연이나 코바야시네띵진의 쌍둥이 송곳니 사망만으로 전체 차이를 설명할 수 없습니다.
            </SectionLead>
            <BossComparison role="table" aria-label="맹독 심연 전투별 유효 HPS 비교">
              <BossHeader role="row">
                <span role="columnheader">전투</span>
                <span role="columnheader">유효 HPS · 과치유</span>
                <span role="columnheader">차이</span>
              </BossHeader>
              {venomousFights.map(fight => (
                <BossRow key={`${fight.id}-${fight.result}`} role="row">
                  <BossIdentity role="cell">
                    <strong>{fight.name}</strong>
                    <span>{fight.result} · {fight.duration}</span>
                  </BossIdentity>
                  <HpsCompare role="cell" aria-label={`코바야시네띵진 ${fight.koba} HPS, Speed ${fight.speed} HPS`}>
                    <HpsLine>
                      <span>Koba</span>
                      <HpsTrack><HpsFill $width={`${(fight.koba / fight.speed) * 100}%`} $tone="#d49a58" /></HpsTrack>
                      <strong>{Math.round(fight.koba / 1000)}k</strong>
                      <small>OH {fight.kobaOh}%</small>
                    </HpsLine>
                    <HpsLine>
                      <span>Speed</span>
                      <HpsTrack><HpsFill $width="100%" $tone="#55a68f" /></HpsTrack>
                      <strong>{Math.round(fight.speed / 1000)}k</strong>
                      <small>OH {fight.speedOh}%</small>
                    </HpsLine>
                  </HpsCompare>
                  <GapBadge role="cell">+{fight.gap}%</GapBadge>
                </BossRow>
              ))}
            </BossComparison>
            <Finding>
              <FindingMark>의미</FindingMark>
              <p>통합 과치유는 47.3% 대 47.5%로 사실상 같습니다. Speed의 추가 198.3M을 “빈 체력부터 먼저 먹은 로그”로만 볼 수 없으며, 어떤 자원과 주문이 실제 유효 치유로 바뀌었는지 추적해야 합니다.</p>
            </Finding>
          </Section>

          <Section id="mechanism">
            <SectionHead>
              <SectionIcon><Route size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>03 · 핵심 메커니즘</SectionKicker><SectionTitle>격차는 4세트 시동 버튼에서 연쇄적으로 커졌습니다</SectionTitle></div>
            </SectionHead>
            <SectionLead>
              12.1 시즌 2의 4세트는 <SkillLink id="360995" />이 <SkillLink id="369299" />을 확정 생성하게 합니다.
              그 무료 자원으로 <SkillLink id="355913" />을 쓰면 2세트가 <SkillLink id="361469" />을 자동 발사하고,
              <SkillLink id="1242031" />가 다음 <SkillLink id="364343" /> 한 번을 두 대상에게 적용합니다.
              이렇게 늘어난 메아리가 <SkillLink id="1256577" />의 복제 대상을 키웁니다.
            </SectionLead>
            <CycleRail>
              {venomousCycle.map((step, index) => (
                <CycleStep key={step.title}>
                  <CycleNumber>{String(index + 1).padStart(2, '0')}</CycleNumber>
                  <CycleSkill><SkillLink id={step.skillId}>{step.title}</SkillLink></CycleSkill>
                  <p>{step.note}</p>
                  {index < venomousCycle.length - 1 && <CycleArrow aria-hidden="true"><ChevronRight size={18} /></CycleArrow>}
                </CycleStep>
              ))}
            </CycleRail>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>이 도식은 고정 매크로가 아니라 기본 골격입니다. <SkillLink id="369299" />이 이미 2중첩이면 <SkillLink id="360995" /> 전에 무료 <SkillLink id="355913" />으로 한 중첩을 먼저 소비하고, 실제 피해 시간에 맞춰 <SkillLink id="373861" />과 <SkillLink id="1256577" />의 위치를 조정해야 합니다.</p>
            </Caution>
          </Section>

          <Section id="evidence">
            <SectionHead>
              <SectionIcon><Sparkles size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>04 · 원시 이벤트 증거</SectionKicker><SectionTitle>기본 주문이 아니라 증폭 고리의 회전수가 달랐습니다</SectionTitle></div>
            </SectionHead>
            <SectionLead>
              코바야시네띵진은 <SkillLink id="355936" /> 141회, <SkillLink id="373861" /> 196회로 Speed의 132회, 183회보다 오히려 많았습니다.
              <SkillLink id="1256577" />도 218회 대 217회입니다. 손이 멈춘 로그가 아니라, 같은 축복 한 번에 싣는 메아리와 시즌 세트 발동량이 부족한 로그입니다.
            </SectionLead>
            <EncounterColumns>
              <EncounterPanel>
                <EncounterHeading><span>사이클 이벤트</span><strong>Koba / Speed</strong></EncounterHeading>
                {venomousLoopMetrics.map(metric => <MetricComparison key={metric.label} metric={metric} playerLabel="Koba" referenceLabel="Speed" />)}
              </EncounterPanel>
              <EncounterPanel>
                <EncounterHeading><span>주요 유효 치유</span><strong>Koba / Speed</strong></EncounterHeading>
                {venomousOutputMetrics.map(metric => <MetricComparison key={metric.label} metric={metric} playerLabel="Koba" referenceLabel="Speed" />)}
              </EncounterPanel>
            </EncounterColumns>
            <DataScroll tabIndex="0" aria-label="자원 버프 이벤트 비교 표">
              <DataTable>
                <thead><tr><th>이벤트</th><th>코바야시네띵진</th><th>Speed</th><th>Speed 차이</th><th>판정</th></tr></thead>
                <tbody>
                  <tr><th><SkillLink id="360995" /></th><td>10회</td><td>138회</td><td>+128회</td><td>4세트 생성기 미사용</td></tr>
                  <tr><th><SkillLink id="369299">정수 폭발 획득</SkillLink></th><td>580회</td><td>850회</td><td>+46.6%</td><td>발동 풀 자체가 작음</td></tr>
                  <tr><th><SkillLink id="369299">정수 폭발 소비</SkillLink></th><td>576회</td><td>844회</td><td>+46.5%</td><td>획득량 차이를 그대로 반영</td></tr>
                  <tr><th><SkillLink id="355913" /></th><td>445회</td><td>613회</td><td>+37.8%</td><td>무료 자원·쌍둥이 메아리 연결 감소</td></tr>
                  <tr><th><SkillLink id="1242031">쌍둥이 메아리 획득</SkillLink></th><td>273회</td><td>418회</td><td>+53.1%</td><td>꽃 시전 차이와 같은 방향</td></tr>
                  <tr><th><SkillLink id="1242031">쌍둥이 메아리 소비</SkillLink></th><td>260회</td><td>409회</td><td>+57.3%</td><td>다음 직접 메아리 효율 감소</td></tr>
                  <tr><th><SkillLink id="364343" /></th><td>361회</td><td>583회</td><td>+61.5%</td><td>축복 전 복제 대상 준비량 감소</td></tr>
                  <tr><th><SkillLink id="1256577" /></th><td>218회</td><td>217회</td><td>-1회</td><td>횟수가 아니라 1회 가치 문제</td></tr>
                </tbody>
              </DataTable>
            </DataScroll>
            <Finding>
              <FindingMark>인과 고리</FindingMark>
              <p><SkillLink id="360995" /> 차이 128회가 <SkillLink id="369299" /> 소비 +268회, <SkillLink id="355913" /> +168회, <SkillLink id="1242031" /> 소비 +149회, 직접 <SkillLink id="364343" /> +222회와 같은 방향으로 이어집니다. 발동 하나하나를 1:1로 귀속할 수는 없지만, 독립된 네 이벤트가 같은 메커니즘을 지지합니다.</p>
            </Finding>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>버프의 refresh 이벤트는 중첩 정보가 없어 낭비로 판정하지 않았습니다. 획득은 applybuff와 applybuffstack, 소비는 removebuff와 removebuffstack만 합산했습니다.</p>
            </Caution>
          </Section>
          <Section id="timing">
            <SectionHead>
              <SectionIcon><Route size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>05 · 울라텍 킬 타임라인</SectionKicker><SectionTitle>같은 큰 피해를 앞에 두고 준비 시점이 달랐습니다</SectionTitle></div>
            </SectionHead>
            <SectionLead>
              가장 긴 울라텍 킬의 505~540초를 따로 잘랐습니다. 515~531초 광역 피해에서 Speed는 미리 저장한 패키지와
              <SkillLink id="363534" />을 앞쪽에 겹쳤고, 코바야시네띵진은 기본 주문을 사용한 뒤 534.4초에 새 <SkillLink id="370537" /> 저장을 시작했습니다.
            </SectionLead>
            <FightNotes>
              <FightNote>
                <h3>코바야시네띵진</h3>
                <FindingList>
                  <li><strong>506.6~514.6초 · 기본 준비</strong><span><SkillLink id="364343" /> 2회 → <SkillLink id="366155" /> → <SkillLink id="355936" /> 순서로 최소 준비는 했습니다.</span></li>
                  <li><strong>517.1~525.7초 · 첫 대응</strong><span><SkillLink id="373861" /> → <SkillLink id="364343" /> → <SkillLink id="1256577" /> → <SkillLink id="355913" /> 2회 → <SkillLink id="364343" /> 2회였습니다.</span></li>
                  <li><strong>527.4~533.4초 · 후속 대응</strong><span><SkillLink id="355913" /> → <SkillLink id="373861" /> → <SkillLink id="366155" /> → <SkillLink id="355936" />로 이어졌습니다.</span></li>
                  <li><strong>534.4초 · 뒤늦은 저장 시작</strong><span>피해가 이미 진행된 뒤 <SkillLink id="370537" />을 켜고 주문을 저장하기 시작했습니다. 이 구간에는 즉시 방출할 패키지가 없었습니다.</span></li>
                </FindingList>
              </FightNote>
              <FightNote>
                <h3>Speed</h3>
                <FindingList>
                  <li><strong>505.2~506.5초 · 선제 방어와 방출</strong><span><SkillLink id="363916" />과 <SkillLink id="374227" />을 먼저 켠 뒤 저장해 둔 <SkillLink id="370537" />을 방출했습니다.</span></li>
                  <li><strong>507.0~511.8초 · 첫 패키지</strong><span><SkillLink id="373861" /> → <SkillLink id="364343" /> 2회 → <SkillLink id="1256577" /> → <SkillLink id="355913" /> → <SkillLink id="355936" />를 압축했습니다.</span></li>
                  <li><strong>516.2~524.2초 · 피해 직후 회수</strong><span><SkillLink id="373861" />과 <SkillLink id="364343" /> 뒤 517.5초 <SkillLink id="363534" />, 축복, 꽃 2회, 522.9초 <SkillLink id="360995" />, 다시 꽃으로 연결했습니다.</span></li>
                  <li><strong>525.5~539.3초 · 두 번째 파동</strong><span><SkillLink id="364343" /> 3회 → <SkillLink id="1256577" /> → 꽃 2회 → <SkillLink id="355936" /> → 메아리 2회 → 축복으로 한 번 더 회수했습니다.</span></li>
                </FindingList>
              </FightNote>
            </FightNotes>
            <Finding>
              <FindingMark>판정</FindingMark>
              <p>Speed는 “저장 완료 → 피해 직전 방출 → 피해 직후 <SkillLink id="363534" /> → <SkillLink id="360995" />으로 다음 무료 자원 생성”까지 한 파동 안에 끝냈습니다. 코바야시네띵진도 핵심 주문은 눌렀지만 회수 쿨기가 빠졌고, 다음 파동용 저장이 피해 뒤로 밀렸습니다.</p>
            </Finding>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>이 장면 하나로 모든 <SkillLink id="370537" /> 사용을 실패로 보지는 않습니다. 전체 저장/방출 횟수는 31/31회 대 32/25회로 비슷하며, 여기서는 가장 큰 피해 구간에 “완성품을 꺼냈는가”만 비교했습니다.</p>
            </Caution>
          </Section>

          <Section id="cooldowns">
            <SectionHead>
              <SectionIcon><Shield size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>06 · 쿨기와 생존</SectionKicker><SectionTitle>횟수가 같아도 피해 직후에 쓴 쪽이 더 남겼습니다</SectionTitle></div>
            </SectionHead>
            <DataScroll tabIndex="0" aria-label="쿨기와 생존기 사용 비교 표">
              <DataTable>
                <thead><tr><th>항목</th><th>코바야시네띵진</th><th>Speed</th><th>해석</th></tr></thead>
                <tbody>
                  <tr><th><SkillLink id="363534" /></th><td>16회 · 37.66M · OH 41.2%</td><td>17회 · 51.67M · OH 30.1%</td><td>Speed의 1회당 유효 치유 +29.1%</td></tr>
                  <tr><th><SkillLink id="370537" /></th><td>저장 31 · 방출 31</td><td>저장 32 · 방출 25</td><td>총횟수보다 피해 시간표와 저장 내용 확인</td></tr>
                  <tr><th><SkillLink id="363916" /></th><td>10회</td><td>26회</td><td>개인 생존과 위험 구간 선제 대응 차이</td></tr>
                  <tr><th><SkillLink id="374227" /></th><td>3회</td><td>7회</td><td>공대 배정이 없었다면 추가 사용 여지</td></tr>
                  <tr><th><SkillLink id="357170" /></th><td>0회</td><td>11회</td><td>탱커·집중 피해 대상 외생기 배정 차이</td></tr>
                  <tr><th>Soulcoiler Ritual Vessel</th><td>16회 · 15.82M</td><td>29회 · 33.92M</td><td>Speed가 13회 더 사용, 유효 치유 2.14배</td></tr>
                </tbody>
              </DataTable>
            </DataScroll>
            <Finding>
              <FindingMark>우선순위</FindingMark>
              <p><SkillLink id="363534" />은 경보가 뜰 때가 아니라 실제 체력이 빠진 직후에, <SkillLink id="370537" />은 큰 피해가 오기 전에 저장을 끝내야 합니다. <SkillLink id="374227" />과 <SkillLink id="357170" />은 개인 로그 경쟁이 아니라 공대 배정표에 따라 평가합니다.</p>
            </Finding>
          </Section>

          <Section id="context">
            <SectionHead>
              <SectionIcon><CircleAlert size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>07 · 해석 보정</SectionKicker><SectionTitle>198.3M 전부를 손가락 차이로 계산하면 틀립니다</SectionTitle></div>
            </SectionHead>
            <ResearchGrid>
              <ResearchPoint>
                <span>딜 기여</span>
                <strong>29.43M 대 10.03M · 코바야시 2.93배</strong>
                <p>코바야시는 직접 <SkillLink id="361469" /> 114회와 불의 숨결 117회, Speed는 15회와 79회였습니다. 치유가 안정된 파밍에서는 이 공격 기여가 가치가 있습니다.</p>
              </ResearchPoint>
              <ResearchPoint>
                <span>장비</span>
                <strong>지능 3,106 대 3,303 · Speed +6.3%</strong>
                <p>울라텍 킬 기준 Speed가 지능·가속·특화가 높았습니다. 표시 아이템 레벨은 비슷하지만 장비 차이는 일부 출력에 기여합니다.</p>
              </ResearchPoint>
              <ResearchPoint>
                <span>특성·자동 치유</span>
                <strong>Enkindle 35.72M · Draconic Instincts 9.88M</strong>
                <p>두 항목은 Speed에게만 WCL 치유로 귀속됐습니다. 특성 선택의 출력이므로 순수한 실행 격차에 그대로 더하지 않았습니다.</p>
              </ResearchPoint>
              <ResearchPoint>
                <span>사망</span>
                <strong>쌍둥이 송곳니 약 10.8초 공백</strong>
                <p>코바야시네띵진은 71.1초에 사망해 81.9초부터 다시 시전했습니다. 다만 나머지 킬에서도 차이가 반복돼 전체 원인은 아닙니다.</p>
              </ResearchPoint>
              <ResearchPoint>
                <span>영웅 특성</span>
                <strong>둘 다 불꽃형성자 계열 로그</strong>
                <p>화염 흡수와 세트 자동 발동이 공통으로 보입니다. WCL의 개별 치유 귀속만으로 모든 선택 노드를 단정하지 않았습니다.</p>
              </ResearchPoint>
              <ResearchPoint>
                <span>힐 로그의 제약</span>
                <strong>치유량은 공대 안에서 서로 경쟁합니다</strong>
                <p>낮은 HPS가 곧 실패는 아닙니다. 그러나 같은 과치유율로 9전투 모두 뒤지고 자원 이벤트까지 같은 방향이면 반복 가능한 운용 차이로 볼 근거가 충분합니다.</p>
              </ResearchPoint>
            </ResearchGrid>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>이 보고서는 코바야시네띵진에게 딜을 중단하라고 결론내리지 않습니다. 다음 피해 준비가 끝났다면 딜이 맞고, <SkillLink id="360995" />·무료 <SkillLink id="355913" />·<SkillLink id="1242031" /> 중첩이 비어 있는데 딜 캐스팅을 시작했다면 우선순위가 뒤집힌 것입니다.</p>
            </Caution>
          </Section>

          <Section id="fix">
            <SectionHead>
              <SectionIcon><ListChecks size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>08 · 수정 루틴</SectionKicker><SectionTitle>다음 로그에서는 버튼 하나보다 연결 순서를 바꿉니다</SectionTitle></div>
            </SectionHead>
            <FightNotes>
              <FightNote>
                <h3>평시와 피해 전</h3>
                <FindingList>
                  <li><strong>1. 중첩부터 확인</strong><span><SkillLink id="369299" /> 2중첩이면 무료 <SkillLink id="355913" />을 먼저 써서 <SkillLink id="360995" />의 확정 발동 자리를 만듭니다.</span></li>
                  <li><strong>2. 신록의 품을 사이클 시동기로 사용</strong><span>위험한 돌진이 아니라면 부상 대상이나 자신에게 사용하고, 생긴 무료 자원을 바로 꽃으로 연결합니다.</span></li>
                  <li><strong>3. 꽃 뒤 메아리를 미루지 않기</strong><span><SkillLink id="1242031" />이 켜지면 다음 <SkillLink id="364343" /> 한 번의 효율이 두 배입니다. 2중첩을 오래 보관하지 않습니다.</span></li>
                </FindingList>
              </FightNote>
              <FightNote>
                <h3>피해 파동과 여유 구간</h3>
                <FindingList>
                  <li><strong>4. 피해 전에는 준비, 피해 뒤에는 회수</strong><span><SkillLink id="355936" />과 <SkillLink id="373861" />을 먼저 배치하고, 실제 체력이 빠진 직후 <SkillLink id="1256577" />과 <SkillLink id="363534" />을 사용합니다.</span></li>
                  <li><strong>5. 정지장은 저장 시점을 한 파동 앞당기기</strong><span>피해가 시작된 뒤 새로 저장하지 말고, 이전 여유 구간에 <SkillLink id="355936" />·<SkillLink id="373861" /> 중심의 패키지를 완성합니다.</span></li>
                  <li><strong>6. 딜은 준비가 끝난 뒤</strong><span><SkillLink id="369299" />·<SkillLink id="1242031" />·다음 피해 시간표를 확인한 뒤에만 적 대상 <SkillLink id="361469" />과 불의 숨결로 전환합니다.</span></li>
                </FindingList>
              </FightNote>
            </FightNotes>
            <GoalGrid>
              {venomousTargets.map(([label, value]) => (
                <Goal key={label}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </Goal>
              ))}
            </GoalGrid>
            <PriorityLine><strong>수정 순서</strong><span><SkillLink id="360995" /> 사용 회복 → 무료 <SkillLink id="355913" /> → <SkillLink id="1242031" /> 즉시 소비 → 축복 전 메아리 확대 → 되돌리기·정지장 시간 보정</span></PriorityLine>
          </Section>

          <Section id="limits">
            <SectionHead>
              <SectionIcon><CheckCircle2 size={18} aria-hidden="true" /></SectionIcon>
              <div><SectionKicker>09 · 한계와 재검수</SectionKicker><SectionTitle>다음 로그에서 같은 가설이 다시 맞는지 확인합니다</SectionTitle></div>
            </SectionHead>
            <SectionLead>
              이 분석은 같은 공격대라는 강한 통제 조건을 갖지만 관찰 자료입니다. 마나 자원 그래프가 API 응답에 없어 종료 마나나 마나 고갈은 판정하지 않았고,
              특성 선택에서 발생한 자동 치유는 실행 평가와 분리했습니다. 다음 주에는 HPS 순위보다 아래 네 비율이 개선되는지 먼저 확인해야 합니다.
            </SectionLead>
            <RuleStrip>
              <Rule><span>4세트 사용률</span><strong><SkillLink id="360995" /> / 분</strong></Rule>
              <Rule><span>세트 연결률</span><strong>신록의 품 뒤 무료 <SkillLink id="355913" /></strong></Rule>
              <Rule><span>메아리 증폭</span><strong><SkillLink id="1242031" /> 소비 / 꽃</strong></Rule>
              <Rule><span>회수 효율</span><strong><SkillLink id="1256577" /> 1회당 유효 치유</strong></Rule>
            </RuleStrip>
            <Finding>
              <FindingMark>최종 결론</FindingMark>
              <p>코바야시네띵진의 기본 운용이 무너진 로그는 아닙니다. 12.1 이전에도 하던 <SkillLink id="355936" />·<SkillLink id="373861" />·<SkillLink id="1256577" /> 회전은 충분했지만, 시즌 2의 <SkillLink id="360995" /> 확정 발동을 기존 회전에 편입하지 못했습니다. 이 한 지점이 무료 자원, 꽃, 쌍둥이 메아리, 직접 메아리, 축복 효율까지 연쇄적으로 줄인 것이 두 플레이어 사이의 가장 재현성 높은 차이입니다.</p>
            </Finding>
          </Section>

          <Sources>
            <strong>자료와 운용 기준</strong>
            <SourceLink href="https://www.warcraftlogs.com/reports/JPFG6A3LQ1dN7nDv">Warcraft Logs 원본 보고서</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/api/docs">Warcraft Logs API</SourceLink>
            <SourceLink href="https://worldofwarcraft.blizzard.com/ko-kr/news/24294062">블리자드 맹독 심연 우두머리 목록</SourceLink>
            <SourceLink href="https://www.method.gg/guides/preservation-evoker/gearing">Method 12.1 세트 효과</SourceLink>
            <SourceLink href="https://www.method.gg/guides/preservation-evoker/playstyle-and-rotation">Method 12.1 운용</SourceLink>
            <SourceLink href="https://www.icy-veins.com/wow/preservation-evoker-pve-healing-rotation-cooldowns-abilities">Icy Veins 12.1 운용</SourceLink>
            <SourceLink href="https://www.wowhead.com/guide/classes/evoker/preservation/bis-gear">Wowhead 12.1 세트 효과</SourceLink>
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
  grid-template-columns: 42px minmax(60px, 1fr) 54px;
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
  grid-template-columns: 22px minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 12px;
  border-right: 1px solid rgba(168, 178, 188, 0.14);
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
  color: #75bda9;

  span { color: #9aa6ad; font-size: 0.75rem; }
  strong { color: #e2e7e9; font-size: 0.78rem; text-align: right; overflow-wrap: anywhere; }

  @media (max-width: 560px) {
    grid-template-columns: 22px minmax(0, 1fr);
    strong { grid-column: 2; text-align: left; }
  }
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

const ResearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 840px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const ResearchPoint = styled.div`
  min-width: 0;
  padding: 15px 0;
  border-top: 2px solid #46535b;
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);

  > span { color: #75bda9; font-size: 0.68rem; font-weight: 720; }
  > strong { display: block; margin-top: 5px; color: #e9edef; font-size: 0.88rem; line-height: 1.5; }
  > p { margin-top: 8px; color: #84919a; font-size: 0.73rem; line-height: 1.65; }
`;

const BossComparison = styled.div`
  border-top: 2px solid #33937f;
  border-bottom: 1px solid rgba(168, 178, 188, 0.16);
`;

const BossHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(150px, 0.8fr) minmax(280px, 2fr) 72px;
  gap: 18px;
  padding: 10px 12px;
  color: #75838c;
  font-size: 0.65rem;
  font-weight: 720;
  background: rgba(168, 178, 188, 0.04);

  span:last-child { text-align: right; }

  @media (max-width: 620px) {
    grid-template-columns: 96px minmax(0, 1fr) 50px;
    gap: 8px;
    padding-inline: 6px;
  }
`;

const BossRow = styled.div`
  display: grid;
  grid-template-columns: minmax(150px, 0.8fr) minmax(280px, 2fr) 72px;
  gap: 18px;
  align-items: center;
  min-width: 0;
  padding: 13px 12px;
  border-top: 1px solid rgba(168, 178, 188, 0.1);

  @media (max-width: 620px) {
    grid-template-columns: 96px minmax(0, 1fr) 50px;
    gap: 8px;
    padding-inline: 6px;
  }
`;

const BossIdentity = styled.div`
  min-width: 0;

  strong { display: block; color: #e8ecee; font-size: 0.78rem; line-height: 1.35; }
  span { display: block; margin-top: 3px; color: #738089; font-size: 0.65rem; }
`;

const HpsCompare = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const HpsLine = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(30px, 1fr) 48px 66px;
  gap: 7px;
  align-items: center;
  min-width: 0;

  span, small { color: #74818a; font-size: 0.62rem; }
  strong { color: #dfe4e7; font-size: 0.7rem; text-align: right; }
  small { text-align: right; }

  @media (max-width: 620px) {
    grid-template-columns: 35px minmax(20px, 1fr) 40px;
    gap: 5px;
    small { display: none; }
  }
`;

const HpsTrack = styled.div`
  min-width: 0;
  height: 6px;
  background: rgba(168, 178, 188, 0.1);
`;

const HpsFill = styled.div`
  width: ${props => props.$width};
  height: 100%;
  background: ${props => props.$tone};
`;

const GapBadge = styled.strong`
  color: #75bda9;
  font-size: 0.78rem;
  text-align: right;
  white-space: nowrap;
`;

const DataScroll = styled.div`
  width: 100%;
  margin-top: 24px;
  overflow-x: auto;
  border-top: 2px solid #46535b;
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);

  &:focus-visible { outline: 2px solid #75bda9; outline-offset: 3px; }
`;

const DataTable = styled.table`
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  color: #aab4ba;
  font-size: 0.72rem;
  line-height: 1.5;

  th, td { padding: 11px 12px; text-align: left; border-bottom: 1px solid rgba(168, 178, 188, 0.1); }
  thead th { color: #7f8d96; font-size: 0.65rem; background: rgba(168, 178, 188, 0.04); }
  tbody th { color: #dfe4e7; font-weight: 680; }
  tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
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

export { VenomousDepthsComparisonPage };
export default PreservationLogReportPage;
