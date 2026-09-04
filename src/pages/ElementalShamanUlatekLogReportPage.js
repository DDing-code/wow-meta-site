import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  Gauge,
  Layers3,
  ListChecks,
  Target,
  Zap,
} from 'lucide-react';
import kbSkills from '../data/kb-skills.json';
import LogReportSidebarList from '../components/LogReportSidebarList.js';

const skills = kbSkills.skills || {};
const skillOverrides = {
  77756: {
    koreanName: '용암 쇄도',
    iconUrl: 'https://wow.zamimg.com/images/wow/icons/small/spell_shaman_lavasurge.jpg',
  },
};

const comparisons = [
  { label: '분석 대상', name: '축전싸개', ilvl: 313, duration: '9:32', dps: 170.6, rank: '전체 29점 · 장비 구간 22점', tone: '#d99655' },
  { label: '동일 장비 비교', name: '可爱哲哲', ilvl: 313, duration: '9:49', dps: 258.1, rank: '동일 장비 구간 상위 로그', tone: '#62b59f' },
  { label: '전체 상위 비교', name: 'Lifeabuse', ilvl: 315, duration: '9:15', dps: 287.8, rank: '분석 시점 세계 1위', tone: '#79a9d1' },
];

const phases = [
  { phase: '1페이즈', note: '첫 심장 피해 증가 포함', target: 194.9, top: 323.9 },
  { phase: '2페이즈', note: '수호자·둠스케일 처리', target: 238.0, top: 318.1 },
  { phase: '사잇단계', note: '플랫폼 이동과 소형 쫄', target: 136.0, top: 199.4 },
  { phase: '3페이즈', note: '보스·원거리 우선 쫄', target: 113.9, top: 259.4 },
];

const castRows = [
  { id: '51505', target: 84, matched: 117, top: 109, note: '가장 큰 핵심 시전 차이' },
  { id: '117014', target: 50, matched: 51, top: 54, note: '횟수는 비슷하지만 1회당 피해 차이' },
  { id: '188443', target: 42, matched: 64, top: 44, note: '동템렙 로그보다 22회 적음' },
  { id: '188196', target: 73, matched: 65, top: 54, note: '단일 필러 비중이 상대적으로 높음' },
  { id: '470057', target: 50, matched: 61, top: 54, note: '다중 대상 화염 기반이 적음' },
  { id: '61882', target: 9, matched: 26, top: 18, note: '3페이즈 사용 0회' },
];

const damageGapRows = [
  { id: '51505', target: 19.58, matched: 34.31, gap: 14.73 },
  { id: '443450', target: 16.80, matched: 29.83, gap: 13.03 },
  { id: '61882', target: 3.61, matched: 11.77, gap: 8.16 },
  { id: '117014', target: 20.49, matched: 27.74, gap: 7.25 },
  { id: '188443', target: 7.12, matched: 11.31, gap: 4.19 },
  { id: '192249', target: 6.57, matched: 9.56, gap: 2.99 },
  { id: '470057', target: 6.12, matched: 8.56, gap: 2.44 },
  { id: '188389', target: 4.13, matched: 5.97, gap: 1.84 },
];

const ascendanceRows = [
  { owner: '축전싸개', windows: [10, 12, 10, 10, 9], total: 51, lava: 18 },
  { owner: '동일 장비 상위', windows: [13, 16, 11, 11, 9], total: 60, lava: 26 },
  { owner: '세계 1위', windows: [14, 16, 13, 12, 14], total: 69, lava: 26 },
];

const statRows = [
  { label: '지능', target: 3344, matched: 3290 },
  { label: '가속', target: 705, matched: 725 },
  { label: '치명타', target: 709, matched: 1115 },
  { label: '특화', target: 1044, matched: 1091 },
  { label: '유연성', target: 386, matched: 0 },
];

function getSkill(id) {
  return skills[String(id)] || skillOverrides[String(id)] || {};
}

function iconUrl(skill) {
  return skill?.iconUrls?.small || skill?.iconUrl || '';
}

function SkillLink({ id, children }) {
  const skill = getSkill(id);
  const name = children || skill.koreanName || skill.name || '주문';
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

function CompareBar({ target, reference, max = Math.max(target, reference), suffix = 'k' }) {
  return (
    <BarPair>
      <BarLine>
        <span>대상</span>
        <BarTrack><BarFill $width={`${(target / max) * 100}%`} $tone="#d99655" /></BarTrack>
        <strong>{target.toFixed(1)}{suffix}</strong>
      </BarLine>
      <BarLine>
        <span>1위</span>
        <BarTrack><BarFill $width={`${(reference / max) * 100}%`} $tone="#79a9d1" /></BarTrack>
        <strong>{reference.toFixed(1)}{suffix}</strong>
      </BarLine>
    </BarPair>
  );
}

function ElementalShamanUlatekLogReportPage() {
  useEffect(() => {
    document.title = '축전싸개 정기 주술사 울라텍 영웅 로그 분석 | wowmeta';
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
      <Hero>
        <HeroTop>
          <BackLink to="/logs/shaman-elemental"><ArrowLeft size={16} aria-hidden="true" />정기 주술사 로그 분석 목록</BackLink>
          <Snapshot>12.1 · 2026-09-04 분석</Snapshot>
        </HeroTop>
        <HeroGrid>
          <div>
            <Eyebrow>WARCRAFT LOGS REVIEW · 울라텍 영웅</Eyebrow>
            <Title>축전싸개 정기 주술사<br />점수가 낮은 이유</Title>
            <Lead>
              9분 32초 처치 로그를 동일 장비 레벨 상위 로그와 전체 1위 로그에 각각 맞춰 비교했습니다.
              결론은 장비나 발동 운이 아니라, 실제 주문 시전과 3페이즈 대상 처리에서 선견자 구조가 끊긴 것입니다.
            </Lead>
          </div>
          <HeroVerdict>
            <Target size={21} aria-hidden="true" />
            <div>
              <span>결론 먼저</span>
              <strong>쿨기는 눌렀지만 쿨기 안에 들어간 주문이 적었습니다</strong>
              <p><SkillLink id="191634" />·<SkillLink id="443454" />·<SkillLink id="114050" /> 횟수는 상위 로그와 같습니다. 차이는 그 뒤에 이어진 <SkillLink id="51505" /> 실제 시전, 선조 복제, 3페이즈 <SkillLink id="188443" />·<SkillLink id="61882" /> 전환입니다.</p>
            </div>
          </HeroVerdict>
        </HeroGrid>
      </Hero>

      <ScoreStrip aria-label="비교 로그 요약">
        {comparisons.map(item => (
          <ScoreItem key={item.label} $tone={item.tone}>
            <span>{item.label}</span>
            <strong>{item.dps.toFixed(1)}k DPS</strong>
            <b>{item.name} · 장비 {item.ilvl} · {item.duration}</b>
            <small>{item.rank}</small>
          </ScoreItem>
        ))}
      </ScoreStrip>

      <ReportLayout>
        <ReportNav aria-label="분석 목차">
          <NavLink href="#method">01 비교 기준</NavLink>
          <NavLink href="#diagnosis">02 핵심 진단</NavLink>
          <NavLink href="#phases">03 페이즈 손실</NavLink>
          <NavLink href="#farseer">04 선견자 구조</NavLink>
          <NavLink href="#casts">05 주문·자원</NavLink>
          <NavLink href="#cooldowns">06 쿨기 구간</NavLink>
          <NavLink href="#gear">07 장비·준비</NavLink>
          <NavLink href="#fix">08 교정안</NavLink>
          <LogReportSidebarList />
        </ReportNav>

        <Article>
          <Section id="method">
            <SectionHeading number="01 · 비교 기준" title="장비 차이와 전투 길이를 따로 통제했습니다" icon={Gauge} />
            <SectionLead>
              대상 로그는 장비 레벨 313, 30인 공격대, 9분 32초 처치입니다. 주 비교군은 같은 장비 레벨 313의 9분 49초 상위 로그이고,
              페이즈별 전투 수행의 상한을 보기 위해 장비 레벨 315의 분석 시점 세계 1위도 함께 사용했습니다.
            </SectionLead>
            <TableScroll tabIndex="0">
              <DataTable aria-label="비교 로그 조건">
                <thead><tr><th>구분</th><th>캐릭터</th><th>장비</th><th>전투 길이</th><th>DPS</th><th>용도</th></tr></thead>
                <tbody>
                  <tr><th>분석 대상</th><td>축전싸개</td><td>313</td><td>9:32.4</td><td>170,586.8</td><td>전체 29점 · 장비 구간 22점</td></tr>
                  <tr><th>주 비교군</th><td>可爱哲哲</td><td>313</td><td>9:48.5</td><td>258,128.8</td><td>동일 장비에서 가능한 수행 비교</td></tr>
                  <tr><th>상한 비교</th><td>Lifeabuse</td><td>315</td><td>9:14.8</td><td>287,793.3</td><td>페이즈·대상 전환 형태 비교</td></tr>
                </tbody>
              </DataTable>
            </TableScroll>
            <MethodGrid>
              <MethodNote><strong>비교 단위</strong><span>총 피해뿐 아니라 원시 cast, damage, buff, resource 이벤트를 같은 방식으로 집계했습니다.</span></MethodNote>
              <MethodNote><strong>외부 강화</strong><span>대상은 증강 기원사 귀속 피해 약 2.41M을 받았고, 동템렙 비교군은 0입니다. 외부 강화 부족은 원인이 아닙니다.</span></MethodNote>
              <MethodNote><strong>순위 변동</strong><span>백분위와 세계 순위는 재집계로 바뀔 수 있습니다. 본문은 저장된 로그의 실제 이벤트 수치를 기준으로 합니다.</span></MethodNote>
            </MethodGrid>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>페이즈 손실과 주문별 손실은 같은 피해를 서로 다른 각도에서 본 값입니다. 두 표의 수치를 더해 총손실로 계산하면 중복됩니다.</p>
            </Caution>
          </Section>

          <Section id="diagnosis">
            <SectionHeading number="02 · 핵심 진단" title="손실은 네 단계로 이어졌습니다" icon={ListChecks} />
            <CauseRail>
              <Cause $tone="#d99655"><b>01 · 가장 큼</b><strong>3페이즈 전환 실패</strong><span>세계 1위보다 25.74M 낮았습니다. 보스뿐 아니라 원거리 우선 쫄과 소형 쫄 피해가 함께 부족했습니다.</span></Cause>
              <Cause $tone="#dcad68"><b>02 · 매우 큼</b><strong><SkillLink id="51505" />·선조 복제 부족</strong><span>동템렙 로그와 두 피해원의 차이만 27.76M입니다. 발동이 아니라 실제 시전 수가 부족했습니다.</span></Cause>
              <Cause $tone="#75b9ac"><b>03 · 큼</b><strong>핵심 주문 밀도 저하</strong><span>분당 32.3회로 동템렙 39.1회보다 17% 낮고, 3초 초과 공백은 29회 대 14회입니다.</span></Cause>
              <Cause $tone="#718da6"><b>04 · 보조 원인</b><strong>2차 능력치·전투 준비</strong><span>유연성 386과 낮은 치명타, 64초 뒤 사라진 <SkillLink id="462854" />가 손실을 보탰지만 주원인은 아닙니다.</span></Cause>
            </CauseRail>
            <Finding>
              <CheckCircle2 size={18} aria-hidden="true" />
              <div><strong>선택한 영웅 특성은 맞습니다</strong><p>12.1 레이드는 선견자가 주류이며 대상도 선견자 4세트 빌드입니다. 낮은 점수는 빌드 선택보다 빌드를 실제 시전으로 전환하지 못한 데서 나왔습니다.</p></div>
            </Finding>
          </Section>

          <Section id="phases">
            <SectionHeading number="03 · 페이즈 손실" title="마지막 3분 30초에 격차가 두 배로 벌어졌습니다" icon={BarChart3} />
            <SectionLead>
              1페이즈부터 차이는 있었지만, 결정타는 3페이즈입니다. 대상은 3페이즈 23.92M, 세계 1위는 49.65M을 기록했습니다.
              상위 로그가 단순히 보스만 더 친 것이 아니라, 반드시 처리해야 하는 원거리 쫄에도 훨씬 많은 피해를 넣었습니다.
            </SectionLead>
            <PhaseChart>
              {phases.map(phase => (
                <PhaseRow key={phase.phase}>
                  <PhaseIdentity><strong>{phase.phase}</strong><span>{phase.note}</span></PhaseIdentity>
                  <CompareBar target={phase.target} reference={phase.top} />
                  <PhaseGap>-{Math.round((1 - phase.target / phase.top) * 100)}%</PhaseGap>
                </PhaseRow>
              ))}
            </PhaseChart>
            <Subhead>3페이즈 대상별 피해</Subhead>
            <TargetGrid>
              <TargetStat><span>울라텍 본체</span><strong>15.06M <i>/ 23.93M</i></strong><small>대상 / 세계 1위</small></TargetStat>
              <TargetStat><span>Shrieker 계열 우선 쫄</span><strong>1.73M <i>/ 10.69M</i></strong><small>약 84% 부족</small></TargetStat>
              <TargetStat><span>잔여 소형 쫄</span><strong>3.05M <i>/ 7.75M</i></strong><small>광역 자원 회수도 함께 감소</small></TargetStat>
            </TargetGrid>
            <BodyCopy>
              이 전투의 3페이즈는 원거리 딜러가 Shrieker 계열 쫄을 빠르게 처리하면서 보스와 소형 쫄을 함께 치는 구간입니다.
              대상은 이 구간에 <SkillLink id="188443" /> 17회, <SkillLink id="61882" /> 0회였고 동템렙 로그는 각각 26회, 14회였습니다.
              <SkillLink id="61882" /> 1회당 적중 수는 42.6 대 44.0으로 배치 자체는 나쁘지 않았습니다. 문제는 유효한 다중 대상 구간에 아예 소비하지 않은 것입니다.
            </BodyCopy>
            <Finding $warning>
              <Target size={18} aria-hidden="true" />
              <div><strong>다음 로그의 첫 확인 지점</strong><p>3페이즈가 시작되는 6:02 이후 대상 프레임을 우선 쫄로 즉시 바꾸고, 쫄이 겹쳐 살아 있는 동안 생성기를 <SkillLink id="188443" />, 소비기를 <SkillLink id="61882" />로 전환했는지 먼저 확인해야 합니다.</p></div>
            </Finding>
          </Section>

          <Section id="farseer">
            <SectionHeading number="04 · 선견자 구조" title="선조를 불렀지만 복제할 주문이 적었습니다" icon={Layers3} />
            <SectionLead>
              선견자는 <SkillLink id="191634" />와 <SkillLink id="443454" />로 선조를 불러낸 뒤, 제한 시간 안에 플레이어가 직접 시전한 주문을 선조가 따라 쓰는 구조입니다.
              원소 과부하는 선조 복제를 추가로 만들지 않으므로, 버튼을 한 번 눌렀다는 사실보다 실제 시전 밀도가 더 중요합니다.
            </SectionLead>
            <MechanicFlow aria-label="선견자 피해 흐름">
              <FlowStep><b>1</b><strong><SkillLink id="191634" />·<SkillLink id="443454" /></strong><span>8초 선조 생성</span></FlowStep>
              <FlowArrow><ArrowRight size={18} /></FlowArrow>
              <FlowStep><b>2</b><strong><SkillLink id="470057" />·<SkillLink id="114050" /></strong><span><SkillLink id="188389" /> 대상 기반 생성</span></FlowStep>
              <FlowArrow><ArrowRight size={18} /></FlowArrow>
              <FlowStep><b>3</b><strong><SkillLink id="51505" />·<SkillLink id="188443" /></strong><span>실제 시전을 선조가 복제</span></FlowStep>
              <FlowArrow><ArrowRight size={18} /></FlowArrow>
              <FlowStep><b>4</b><strong><SkillLink id="117014" />·<SkillLink id="61882" /></strong><span>생성한 소용돌이 결산</span></FlowStep>
            </MechanicFlow>
            <MetricGrid>
              <Metric><span>선조 생성 횟수</span><strong>65 <i>/ 76</i></strong><small>대상 / 동템렙 상위</small></Metric>
              <Metric><span>선조 1회당 피해</span><strong>258k <i>/ 392.5k</i></strong><small>약 34% 낮음</small></Metric>
              <Metric><span>선조 1회당 적중</span><strong>10.15 <i>/ 13.58</i></strong><small>복제된 주문 수 차이</small></Metric>
              <Metric><span><SkillLink id="443450" /> 피해</span><strong>16.80M <i>/ 29.83M</i></strong><small>13.03M 손실</small></Metric>
            </MetricGrid>
            <BodyCopy>
              <SkillLink id="191634" />는 12회 대 12회, <SkillLink id="443454" />은 16회 대 17회로 소환 버튼 자체는 거의 같습니다.
              그런데 선조 한 번이 낸 피해가 258k에 그쳤습니다. 이는 쿨다운 미사용 문제가 아니라, 선조가 떠 있는 8초 동안 실제 <SkillLink id="51505" />·<SkillLink id="188443" /> 시전과
              <SkillLink id="188389" /> 다중 적용이 적었다는 뜻입니다.
            </BodyCopy>
            <Sequence>
              <SequenceLabel>다중 대상에서 맞출 기본 묶음</SequenceLabel>
              <SequenceSteps>
                <SkillLink id="191634" /><ArrowRight size={15} /><SkillLink id="443454" /><ArrowRight size={15} />
                <SkillLink id="470057" /><ArrowRight size={15} /><SkillLink id="114050" />
              </SequenceSteps>
              <p>대상이 실제로 모여 있을 때 사용합니다. <SkillLink id="470057" />은 가능하면 <SkillLink id="114050" /> 직전에 두어 두 화염 충격 적용 효과를 별도로 선조 복제에 연결합니다.</p>
            </Sequence>
          </Section>

          <Section id="casts">
            <SectionHeading number="05 · 주문·자원" title="발동 반응은 좋았고, 비발동 용암 폭발이 부족했습니다" icon={Activity} />
            <Finding>
              <CheckCircle2 size={18} aria-hidden="true" />
              <div><strong><SkillLink id="77756" /> 반응 속도는 원인이 아닙니다</strong><p>발동 후 다음 <SkillLink id="51505" />까지 중앙값은 1.24초로 동템렙 상위 로그의 1.39초보다 빨랐습니다. 3초 초과 반응도 7회 대 14회로 더 적었습니다.</p></div>
            </Finding>
            <Subhead>직접 시전한 용암 폭발</Subhead>
            <TableScroll tabIndex="0">
              <DataTable aria-label="용암 폭발 시전 형태">
                <thead><tr><th>로그</th><th>전체</th><th>비발동 하드캐스트</th><th>승천 밖 하드캐스트</th><th>판독</th></tr></thead>
                <tbody>
                  <tr><th>축전싸개</th><td>84</td><td>30</td><td>23</td><td>발동 주문처럼 운용한 비중이 큼</td></tr>
                  <tr><th>동일 장비 상위</th><td>117</td><td>54</td><td>44</td><td>평시에도 실제 시전을 계속 이어감</td></tr>
                  <tr><th>세계 1위</th><td>109</td><td>50</td><td>43</td><td>전투 길이가 짧아도 하드캐스트 유지</td></tr>
                </tbody>
              </DataTable>
            </TableScroll>
            <BodyCopy>
              현재 트리의 <SkillLink id="1269215" />은 <SkillLink id="470057" /> 쿨다운을 줄여 <SkillLink id="77756" />만으로 모든 <SkillLink id="51505" /> 수요를 채울 수 없게 만듭니다.
              대상은 <SkillLink id="114050" /> 밖 하드캐스트가 23회로 동템렙 로그의 44회보다 21회 적었습니다. 빈 자리를 <SkillLink id="188196" />로 과하게 메우면서
              본인 <SkillLink id="51505" /> 피해와 선조 복제 피해가 동시에 내려갔습니다.
            </BodyCopy>

            <Subhead>핵심 주문 시전 비교</Subhead>
            <TableScroll tabIndex="0">
              <DataTable aria-label="핵심 주문 시전 비교">
                <thead><tr><th>주문</th><th>축전싸개</th><th>동템렙 상위</th><th>세계 1위</th><th>판독</th></tr></thead>
                <tbody>
                  {castRows.map(row => (
                    <tr key={row.id}><th><SkillLink id={row.id} /></th><td>{row.target}</td><td>{row.matched}</td><td>{row.top}</td><td>{row.note}</td></tr>
                  ))}
                </tbody>
              </DataTable>
            </TableScroll>

            <Subhead>동일 장비 로그와 피해 차이가 난 주문</Subhead>
            <TableScroll tabIndex="0">
              <DataTable aria-label="주문별 피해 손실">
                <thead><tr><th>피해원</th><th>축전싸개</th><th>동템렙 상위</th><th>차이</th></tr></thead>
                <tbody>
                  {damageGapRows.map(row => (
                    <tr key={row.id}><th><SkillLink id={row.id} /></th><td>{row.target.toFixed(2)}M</td><td>{row.matched.toFixed(2)}M</td><td>+{row.gap.toFixed(2)}M</td></tr>
                  ))}
                </tbody>
              </DataTable>
            </TableScroll>

            <ResourceGrid>
              <ResourceBlock>
                <span>실제 생성한 소용돌이</span><strong>2,759 <i>/ 3,830</i></strong><small>동템렙 로그보다 약 28% 적음</small>
              </ResourceBlock>
              <ResourceBlock>
                <span>과충전</span><strong>100 <i>/ 44</i></strong><small>약 3.5% / 1.1%</small>
              </ResourceBlock>
              <ResourceBlock>
                <span>소비기 횟수</span><strong>59 <i>/ 77</i></strong><small><SkillLink id="117014" /> + <SkillLink id="61882" /></small>
              </ResourceBlock>
            </ResourceGrid>
            <BodyCopy>
              과충전 100은 고칠 수 있지만 약 한 번의 소비기 차이에 가깝습니다. 세계 1위도 270을 넘겨서, 과충전만으로 87.5k DPS 차이를 설명할 수 없습니다.
              더 큰 문제는 생성량 자체가 1,071 적었다는 점입니다. <SkillLink id="51505" />·<SkillLink id="188443" />·다중 <SkillLink id="188389" />가 줄어 소용돌이를 덜 만들었고,
              그 결과 <SkillLink id="61882" />까지 17회 적어졌습니다.
            </BodyCopy>
          </Section>

          <Section id="cooldowns">
            <SectionHeading number="06 · 쿨기 구간" title="횟수는 맞았지만 승천 15초의 밀도가 낮았습니다" icon={Clock3} />
            <SectionLead>
              5번의 <SkillLink id="114050" />을 모두 사용했습니다. 그러나 각 15초 안에 들어간 핵심 딜 주문은 51회로 동템렙 로그보다 9회,
              세계 1위보다 18회 적었습니다. 큰 버튼을 누르는 것과 큰 구간을 완성하는 것은 다른 문제입니다.
            </SectionLead>
            <TableScroll tabIndex="0">
              <DataTable aria-label="승천 구간별 핵심 주문 수">
                <thead><tr><th>로그</th><th>1회차</th><th>2회차</th><th>3회차</th><th>4회차</th><th>5회차</th><th>합계</th><th>구간 내 용암 폭발</th></tr></thead>
                <tbody>
                  {ascendanceRows.map(row => (
                    <tr key={row.owner}><th>{row.owner}</th>{row.windows.map((value, index) => <td key={index}>{value}</td>)}<td>{row.total}</td><td>{row.lava}</td></tr>
                  ))}
                </tbody>
              </DataTable>
            </TableScroll>
            <CooldownCount>
              <div><SkillLink id="191634" /><strong>12 / 12 / 11</strong><span>대상 / 동템렙 / 1위</span></div>
              <div><SkillLink id="443454" /><strong>16 / 17 / 16</strong><span>사용 횟수는 정상</span></div>
              <div><SkillLink id="114050" /><strong>5 / 5 / 5</strong><span>사용 횟수는 정상</span></div>
            </CooldownCount>
            <Subhead>첫 구간은 준비 순서도 아쉬웠습니다</Subhead>
            <TimelineCompare>
              <TimelineLine $bad><b>축전싸개</b><span>0.17초 <SkillLink id="191634" /></span><ArrowRight size={14} /><span>0.27초 <SkillLink id="114050" /></span><ArrowRight size={14} /><span>1.30초 <SkillLink id="443454" /></span><ArrowRight size={14} /><span>7.52초 <SkillLink id="470057" /></span></TimelineLine>
              <TimelineLine><b>동템렙 상위</b><span>0.13초 <SkillLink id="470057" /></span><ArrowRight size={14} /><span>4.06초 <SkillLink id="191634" /></span><ArrowRight size={14} /><span>4.54초 <SkillLink id="443454" /></span><ArrowRight size={14} /><span>6.14초 <SkillLink id="114050" /></span></TimelineLine>
            </TimelineCompare>
            <BodyCopy>
              대상은 전투 시작 0.27초에 <SkillLink id="114050" />을 열고 <SkillLink id="470057" />을 7.52초에 사용했습니다. 상위 두 로그는 첫 주문을 넣은 뒤 약 6초 시점에 준비를 마치고 첫 <SkillLink id="114050" />을 열었습니다.
              이것만으로 전체 격차가 생긴 것은 아니지만, 첫 <SkillLink id="114050" />의 절반을 화염 기반 준비에 쓰게 된 순서입니다. 다음에는 실제 타격 가능 시점에 맞춰
              <SkillLink id="191634" /> → <SkillLink id="51505" /> → <SkillLink id="114050" /> → <SkillLink id="443454" /> 순서를 기본으로 두고, 다중 대상이면 앞서 제시한 <SkillLink id="470057" /> 연계를 사용합니다.
            </BodyCopy>
          </Section>

          <Section id="gear">
            <SectionHeading number="07 · 장비·준비" title="장비는 보조 원인이지만 정리할 부분이 분명합니다" icon={Zap} />
            <SectionLead>
              동일 장비 비교군은 지능이 오히려 54 낮은데 DPS가 87.5k 높습니다. 따라서 장비 탓으로 결론 내릴 수 없습니다.
              다만 12.1 선견자는 특화 기준점을 맞춘 뒤 치명타와 가속을 나누고, 가능하면 유연성을 피하는 방향이므로 현재 분배는 손볼 가치가 있습니다.
            </SectionLead>
            <StatTable>
              {statRows.map(stat => {
                const max = Math.max(stat.target, stat.matched);
                return (
                  <StatRow key={stat.label}>
                    <strong>{stat.label}</strong>
                    <StatBars>
                      <StatLine><span>축전싸개</span><BarTrack><BarFill $width={`${(stat.target / max) * 100}%`} $tone="#d99655" /></BarTrack><b>{stat.target}</b></StatLine>
                      <StatLine><span>동템렙</span><BarTrack><BarFill $width={`${(stat.matched / max) * 100}%`} $tone="#62b59f" /></BarTrack><b>{stat.matched}</b></StatLine>
                    </StatBars>
                  </StatRow>
                );
              })}
            </StatTable>
            <PrepGrid>
              <Prep><strong><SkillLink id="462854" /> 갱신</strong><p>전투 약 64초에 오라가 사라진 뒤 재시전 기록이 없습니다. 풀 직전에 새로 갱신해 전투 내내 유지합니다.</p></Prep>
              <Prep><strong>2차 능력치 재검토</strong><p>대상은 치명타 709·유연성 386, 동템렙은 치명타 1,115·유연성 0입니다. 단순 보석 교체보다 Raidbots로 현재 장비를 직접 심합니다.</p></Prep>
              <Prep><strong>무기 차이</strong><p>동템렙 비교군은 331 양손 무기, 대상은 321 주무기·보조장비입니다. 일부 격차는 만들지만 지능이 더 높은 대상을 34% 뒤처지게 할 규모는 아닙니다.</p></Prep>
            </PrepGrid>
          </Section>

          <Section id="fix">
            <SectionHeading number="08 · 다음 로그 교정안" title="한 번에 네 가지만 바꾸면 됩니다" icon={ListChecks} />
            <FixGrid>
              <Fix><b>1</b><div><strong>3페이즈 대상 전환을 먼저 고정</strong><p>6:02 이후 원거리 우선 쫄 프레임을 별도로 두고, 2대상 이상이 충분히 살아 있으면 <SkillLink id="188196" /> 대신 <SkillLink id="188443" />, 소비기는 <SkillLink id="61882" />로 바꿉니다.</p></div></Fix>
              <Fix><b>2</b><div><strong><SkillLink id="51505" />을 발동 전용으로 보지 않기</strong><p><SkillLink id="77756" />가 없어도 <SkillLink id="1269215" /> 트리에서는 평시 하드캐스트가 필요합니다. <SkillLink id="188389" />이 붙어 있고 더 높은 우선순위가 없으면 직접 시전합니다.</p></div></Fix>
              <Fix><b>3</b><div><strong>선조 8초를 실제 주문으로 채우기</strong><p><SkillLink id="191634" />·<SkillLink id="443454" /> 직후 이동을 피하고, 다중 대상에서는 <SkillLink id="470057" /> → <SkillLink id="114050" />까지 묶어 선조 복제를 늘립니다.</p></div></Fix>
              <Fix><b>4</b><div><strong>빈 시전부터 줄이기</strong><p>3초 초과 공백 29회를 먼저 20회 아래로 줄입니다. 이동 전 <SkillLink id="79206" />을 배정하고, 쿨기 구간에서는 다음 주문을 미리 결정합니다.</p></div></Fix>
            </FixGrid>

            <Subhead>같은 전투 길이에서 확인할 목표</Subhead>
            <GoalGrid>
              <Goal><CheckCircle2 size={16} /><span>핵심 주문 밀도</span><strong>1차 36회/분, 최종 39회/분</strong></Goal>
              <Goal><CheckCircle2 size={16} /><span><SkillLink id="51505" /></span><strong>전체 100회 이상 · 승천 밖 하드캐스트 40회 이상</strong></Goal>
              <Goal><CheckCircle2 size={16} /><span>3페이즈 광역</span><strong><SkillLink id="188443" /> 20회 이상 · <SkillLink id="61882" /> 5회 이상</strong></Goal>
              <Goal><CheckCircle2 size={16} /><span><SkillLink id="114050" /> 15초</span><strong>평균 핵심 주문 12회 이상</strong></Goal>
              <Goal><CheckCircle2 size={16} /><span>선조 효율</span><strong>1회당 적중 12회 이상</strong></Goal>
              <Goal><CheckCircle2 size={16} /><span>전투 준비</span><strong><SkillLink id="462854" /> 전투 전체 유지</strong></Goal>
            </GoalGrid>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>위 숫자는 이 울라텍 전투 길이와 상위 로그를 기준으로 잡은 검수선입니다. 공격대 쫄 처리 속도나 개인 담당이 바뀌면 <SkillLink id="188443" />·<SkillLink id="61882" /> 목표는 함께 조정해야 합니다.</p>
            </Caution>
            <PriorityLine><strong>교정 우선순위</strong><span>3페이즈 대상 전환 → 비발동 <SkillLink id="51505" /> 하드캐스트 → 선조 8초 시전 밀도 → <SkillLink id="462854" />·능력치 정리 순서입니다.</span></PriorityLine>
          </Section>

          <Sources>
            <strong>원본 및 검증 자료</strong>
            <SourceLink href="https://www.warcraftlogs.com/reports/qMCBYrDyfWvHXP8b?fight=48&type=damage-done">대상 Warcraft Logs</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/7mgNGtj9fBVwd3a1?fight=33&type=damage-done&source=22">동일 장비 상위 로그</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/BJ7zL3Qxjak8AKqv?fight=83&type=damage-done&source=356">세계 1위 비교 로그</SourceLink>
            <SourceLink href="https://www.wowhead.com/guide/classes/shaman/elemental/rotation-cooldowns-pve-dps">Wowhead 12.1 딜사이클</SourceLink>
            <SourceLink href="https://www.wowhead.com/guide/classes/shaman/elemental/stat-priority-pve-dps">Wowhead 12.1 능력치</SourceLink>
            <SourceLink href="https://www.icy-veins.com/wow/elemental-shaman-pve-dps-spec-builds-talents">Icy Veins 12.1 특성</SourceLink>
            <SourceLink href="https://stormearthandlava.com/">Storm, Earth &amp; Lava</SourceLink>
            <SourceLink href="https://www.method.gg/guides/the-venomous-abyss/ulatek-heroic">Method 울라텍 영웅 공략</SourceLink>
          </Sources>
        </Article>
      </ReportLayout>
    </Page>
  );
}

const Page = styled.div`
  --line: rgba(164, 176, 185, 0.14);
  --muted: #87939b;
  color: #dfe4e7;
  background: #0b1014;
`;

const Hero = styled.header`
  padding: 44px max(24px, calc((100vw - 1180px) / 2)) 34px;
  border-bottom: 1px solid var(--line);
  background: #0d1318;

  @media (max-width: 620px) { padding: 28px 16px 26px; }
`;
const HeroTop = styled.div`display:flex;justify-content:space-between;gap:18px;align-items:center;margin-bottom:34px;@media(max-width:560px){align-items:flex-start;flex-direction:column;margin-bottom:24px;}`;
const BackLink = styled(Link)`display:inline-flex;align-items:center;gap:7px;color:#99a5ac;font-size:.76rem;font-weight:650;&:hover{color:#eef1f3;}`;
const Snapshot = styled.span`color:#bb9967;font-size:.7rem;font-weight:750;white-space:nowrap;`;
const HeroGrid = styled.div`display:grid;grid-template-columns:minmax(0,1.4fr) minmax(300px,.8fr);gap:54px;align-items:end;max-width:1180px;margin:0 auto;@media(max-width:850px){grid-template-columns:1fr;gap:28px;}`;
const Eyebrow = styled.p`color:#d0aa71;font-size:.72rem;font-weight:750;`;
const Title = styled.h1`margin-top:9px;color:#f0f2f3;font-size:clamp(2rem,4.6vw,3.7rem);line-height:1.1;letter-spacing:0;word-break:keep-all;`;
const Lead = styled.p`max-width:760px;margin-top:16px;color:#aab4ba;font-size:.92rem;line-height:1.75;word-break:keep-all;`;
const HeroVerdict = styled.aside`display:grid;grid-template-columns:24px minmax(0,1fr);gap:12px;padding:17px 0;border-top:2px solid #d0aa71;border-bottom:1px solid var(--line);color:#d0aa71;span{display:block;color:#9d8c72;font-size:.66rem;font-weight:750;}strong{display:block;margin-top:4px;color:#edf0f2;font-size:1rem;line-height:1.45;word-break:keep-all;}p{margin-top:9px;color:#9ba6ad;font-size:.73rem;line-height:1.65;word-break:keep-all;}`;

const ScoreStrip = styled.section`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:min(1180px,calc(100% - 48px));margin:0 auto;border-left:1px solid var(--line);@media(max-width:760px){grid-template-columns:1fr;width:calc(100% - 32px);}`;
const ScoreItem = styled.div`min-width:0;padding:18px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);border-top:3px solid ${props => props.$tone};span{display:block;color:#7f8c94;font-size:.65rem;font-weight:750;}strong{display:block;margin-top:5px;color:#eef1f2;font-size:1.4rem;}b{display:block;margin-top:6px;color:#b9c2c7;font-size:.72rem;}small{display:block;margin-top:3px;color:#737f87;font-size:.65rem;}`;

const ReportLayout = styled.div`display:grid;grid-template-columns:174px minmax(0,1fr);gap:46px;width:min(1180px,calc(100% - 48px));margin:44px auto 0;@media(max-width:980px){grid-template-columns:1fr;gap:0;}@media(max-width:620px){width:calc(100% - 32px);margin-top:28px;}`;
const ReportNav = styled.nav`position:sticky;top:82px;align-self:start;display:grid;border-top:1px solid var(--line);@media(max-width:980px){position:static;grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:30px;}@media(max-width:620px){grid-template-columns:repeat(2,minmax(0,1fr));}`;
const NavLink = styled.a`padding:10px 8px;border-bottom:1px solid var(--line);color:#78858d;font-size:.68rem;font-weight:650;&:hover{color:#edf0f2;background:rgba(255,255,255,.025);}`;
const Article = styled.article`min-width:0;padding-bottom:96px;`;
const Section = styled.section`scroll-margin-top:90px;padding:0 0 54px;margin-bottom:54px;border-bottom:1px solid var(--line);&:last-of-type{margin-bottom:32px;}@media(max-width:620px){padding-bottom:38px;margin-bottom:38px;}`;
const SectionHead = styled.div`display:flex;gap:12px;align-items:center;margin-bottom:18px;`;
const SectionIcon = styled.span`display:grid;place-items:center;width:34px;height:34px;color:#d0aa71;border:1px solid rgba(208,170,113,.35);`;
const SectionKicker = styled.span`display:block;color:#8f7857;font-size:.63rem;font-weight:750;`;
const SectionTitle = styled.h2`margin-top:3px;color:#edf0f2;font-size:clamp(1.28rem,2.6vw,1.8rem);line-height:1.3;letter-spacing:0;word-break:keep-all;`;
const SectionLead = styled.p`max-width:86ch;color:#b3bcc1;font-size:.88rem;line-height:1.85;word-break:keep-all;`;
const BodyCopy = styled.p`margin-top:22px;color:#a5afb5;font-size:.82rem;line-height:1.9;word-break:keep-all;`;
const Subhead = styled.h3`margin:28px 0 12px;color:#e7eaec;font-size:.96rem;line-height:1.5;letter-spacing:0;`;

const TableScroll = styled.div`width:100%;margin-top:20px;overflow-x:auto;border-top:2px solid #43505a;border-bottom:1px solid var(--line);&:focus-visible{outline:2px solid #d0aa71;outline-offset:3px;}`;
const DataTable = styled.table`width:100%;min-width:680px;border-collapse:collapse;color:#aab4ba;font-size:.71rem;line-height:1.5;th,td{padding:11px 12px;text-align:left;border-bottom:1px solid rgba(164,176,185,.1);}thead th{color:#7d8991;font-size:.64rem;background:rgba(255,255,255,.025);}tbody th{color:#dfe4e7;font-weight:680;}tbody tr:last-child th,tbody tr:last-child td{border-bottom:0;}`;
const MethodGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:22px;@media(max-width:720px){grid-template-columns:1fr;gap:10px;}`;
const MethodNote = styled.div`padding:12px 0;border-top:1px solid var(--line);strong{display:block;color:#d6dce0;font-size:.75rem;}span{display:block;margin-top:5px;color:#7f8c94;font-size:.69rem;line-height:1.65;}`;
const Caution = styled.div`display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;margin-top:22px;padding:13px 0;color:#d5ad70;border-top:1px solid rgba(213,173,112,.3);border-bottom:1px solid rgba(213,173,112,.18);p{color:#a99c8c;font-size:.73rem;line-height:1.7;}`;

const CauseRail = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:22px;border-left:1px solid var(--line);@media(max-width:900px){grid-template-columns:repeat(2,minmax(0,1fr));}@media(max-width:560px){grid-template-columns:1fr;}`;
const Cause = styled.div`min-width:0;padding:15px;border-top:3px solid ${props => props.$tone};border-right:1px solid var(--line);border-bottom:1px solid var(--line);b{display:block;color:${props => props.$tone};font-size:.62rem;}strong{display:block;margin-top:7px;color:#e8ecee;font-size:.83rem;line-height:1.45;}span{display:block;margin-top:7px;color:#7f8c94;font-size:.68rem;line-height:1.65;}`;
const Finding = styled.div`display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;margin-top:22px;padding:14px 0;color:${props => props.$warning ? '#d99655' : '#62b59f'};border-top:1px solid ${props => props.$warning ? 'rgba(217,150,85,.35)' : 'rgba(98,181,159,.3)'};border-bottom:1px solid var(--line);strong{color:#dfe5e7;font-size:.8rem;}p{margin-top:4px;color:#87949c;font-size:.73rem;line-height:1.7;word-break:keep-all;}`;

const PhaseChart = styled.div`margin-top:24px;border-top:2px solid #43505a;`;
const PhaseRow = styled.div`display:grid;grid-template-columns:170px minmax(0,1fr) 48px;gap:18px;align-items:center;padding:15px 10px;border-bottom:1px solid var(--line);@media(max-width:680px){grid-template-columns:minmax(0,1fr) 42px;gap:10px;}`;
const PhaseIdentity = styled.div`strong{display:block;color:#e3e8ea;font-size:.78rem;}span{display:block;margin-top:3px;color:#75828a;font-size:.64rem;}@media(max-width:680px){grid-column:1 / -1;}`;
const BarPair = styled.div`display:grid;gap:7px;min-width:0;`;
const BarLine = styled.div`display:grid;grid-template-columns:32px minmax(0,1fr) 58px;gap:8px;align-items:center;span{color:#6f7d85;font-size:.61rem;}strong{color:#cfd6da;font-size:.68rem;text-align:right;}`;
const BarTrack = styled.div`min-width:0;height:7px;background:rgba(164,176,185,.1);`;
const BarFill = styled.div`width:${props => props.$width};height:100%;background:${props => props.$tone};`;
const PhaseGap = styled.strong`color:#d99655;font-size:.74rem;text-align:right;`;
const TargetGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-left:1px solid var(--line);@media(max-width:700px){grid-template-columns:1fr;}`;
const TargetStat = styled.div`padding:14px;border-top:2px solid #43505a;border-right:1px solid var(--line);border-bottom:1px solid var(--line);span{display:block;color:#8c98a0;font-size:.68rem;}strong{display:block;margin-top:5px;color:#e4e8ea;font-size:.94rem;}i{color:#79a9d1;font-style:normal;}small{display:block;margin-top:4px;color:#707d85;font-size:.63rem;}`;

const MechanicFlow = styled.div`display:grid;grid-template-columns:minmax(0,1fr) 24px minmax(0,1fr) 24px minmax(0,1fr) 24px minmax(0,1fr);align-items:stretch;margin-top:24px;border-top:2px solid #62b59f;border-bottom:1px solid var(--line);@media(max-width:880px){grid-template-columns:1fr;.flow-arrow{display:none;}}`;
const FlowStep = styled.div`min-width:0;padding:14px;border-right:1px solid var(--line);b{display:block;color:#62b59f;font-size:.62rem;}strong{display:block;margin-top:8px;line-height:1.7;}span{display:block;margin-top:7px;color:#78858d;font-size:.66rem;line-height:1.5;}`;
const FlowArrow = styled.div.attrs({ className: 'flow-arrow' })`display:grid;place-items:center;color:#52616a;border-right:1px solid var(--line);`;
const MetricGrid = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:22px;border-left:1px solid var(--line);@media(max-width:760px){grid-template-columns:repeat(2,minmax(0,1fr));}@media(max-width:480px){grid-template-columns:1fr;}`;
const Metric = styled.div`min-width:0;padding:13px;border-top:1px solid var(--line);border-right:1px solid var(--line);border-bottom:1px solid var(--line);span{display:block;color:#7f8c94;font-size:.65rem;}strong{display:block;margin-top:4px;color:#e3e8ea;font-size:1rem;}i{color:#62b59f;font-style:normal;}small{display:block;margin-top:4px;color:#6f7c84;font-size:.61rem;}`;
const Sequence = styled.div`margin-top:24px;padding:15px 0;border-top:2px solid #62b59f;border-bottom:1px solid var(--line);p{margin-top:10px;color:#7f8c94;font-size:.7rem;line-height:1.65;}`;
const SequenceLabel = styled.span`display:block;color:#99a5ac;font-size:.66rem;font-weight:700;`;
const SequenceSteps = styled.div`display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin-top:12px;color:#5e6b73;`;

const ResourceGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:24px;border-left:1px solid var(--line);@media(max-width:680px){grid-template-columns:1fr;}`;
const ResourceBlock = styled.div`padding:14px;border-top:2px solid #43505a;border-right:1px solid var(--line);border-bottom:1px solid var(--line);span{display:block;color:#7d8a92;font-size:.66rem;}strong{display:block;margin-top:5px;color:#e2e7e9;font-size:1rem;}i{color:#62b59f;font-style:normal;}small{display:block;margin-top:4px;color:#6e7b83;font-size:.63rem;}`;

const CooldownCount = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:22px;border-left:1px solid var(--line);@media(max-width:650px){grid-template-columns:1fr;}div{padding:13px;border-top:1px solid var(--line);border-right:1px solid var(--line);border-bottom:1px solid var(--line);}strong{display:block;margin-top:8px;color:#e5e9eb;font-size:.95rem;}span{display:block;margin-top:3px;color:#6f7c84;font-size:.62rem;}`;
const TimelineCompare = styled.div`display:grid;border-top:1px solid var(--line);`;
const TimelineLine = styled.div`display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:13px 8px;border-bottom:1px solid var(--line);color:#58666f;background:${props => props.$bad ? 'rgba(217,150,85,.035)' : 'rgba(98,181,159,.03)'};b{width:90px;color:${props => props.$bad ? '#d99655' : '#62b59f'};font-size:.68rem;}span{color:#89969e;font-size:.67rem;}`;

const StatTable = styled.div`margin-top:22px;border-top:2px solid #43505a;`;
const StatRow = styled.div`display:grid;grid-template-columns:90px minmax(0,1fr);gap:18px;align-items:center;padding:12px 8px;border-bottom:1px solid var(--line);>strong{color:#dbe1e4;font-size:.72rem;}`;
const StatBars = styled.div`display:grid;gap:6px;`;
const StatLine = styled.div`display:grid;grid-template-columns:50px minmax(0,1fr) 44px;gap:8px;align-items:center;span{color:#6f7c84;font-size:.6rem;}b{color:#aeb7bc;font-size:.65rem;text-align:right;}`;
const PrepGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin-top:24px;@media(max-width:760px){grid-template-columns:1fr;gap:12px;}`;
const Prep = styled.div`padding:13px 0;border-top:2px solid #43505a;border-bottom:1px solid var(--line);strong{color:#dfe4e7;font-size:.78rem;}p{margin-top:7px;color:#7f8c94;font-size:.7rem;line-height:1.65;}`;

const FixGrid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-left:1px solid var(--line);@media(max-width:720px){grid-template-columns:1fr;}`;
const Fix = styled.div`display:grid;grid-template-columns:28px minmax(0,1fr);gap:10px;padding:15px;border-top:1px solid var(--line);border-right:1px solid var(--line);border-bottom:1px solid var(--line);>b{color:#d0aa71;font-size:.72rem;}strong{color:#e1e6e8;font-size:.79rem;}p{margin-top:6px;color:#7f8c94;font-size:.69rem;line-height:1.68;}`;
const GoalGrid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-left:1px solid var(--line);@media(max-width:680px){grid-template-columns:1fr;}`;
const Goal = styled.div`display:grid;grid-template-columns:20px minmax(100px,.7fr) minmax(0,1.3fr);gap:9px;align-items:center;padding:12px;border-top:1px solid var(--line);border-right:1px solid var(--line);border-bottom:1px solid var(--line);color:#62b59f;span{color:#89969e;font-size:.68rem;}strong{color:#dce2e5;font-size:.71rem;text-align:right;line-height:1.55;}@media(max-width:520px){grid-template-columns:20px minmax(0,1fr);strong{grid-column:2;text-align:left;}}`;
const PriorityLine = styled.div`display:grid;grid-template-columns:100px minmax(0,1fr);gap:14px;margin-top:22px;padding:14px 0;border-top:2px solid #62b59f;border-bottom:1px solid var(--line);>strong{color:#62b59f;font-size:.72rem;}>span{color:#b2bbc0;font-size:.75rem;line-height:1.75;}@media(max-width:560px){grid-template-columns:1fr;gap:5px;}`;

const Sources = styled.footer`display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;padding:20px 0 54px;border-top:1px solid var(--line);>strong{color:#7d8a93;font-size:.68rem;}`;
const ExternalAnchor = styled.a`display:inline-flex;align-items:center;gap:6px;color:#aeb8bd;font-size:.68rem;font-weight:650;&:hover{color:#f0f2f3;}`;
const SkillAnchor = styled.a`display:inline-flex;align-items:center;gap:4px;max-width:100%;color:#e5c36f;font-weight:680;line-height:1.35;vertical-align:-.16em;white-space:nowrap;border-bottom:1px solid rgba(229,195,111,.22);img{flex:0 0 auto;width:1.08em;height:1.08em;object-fit:cover;border:1px solid rgba(255,209,102,.38);border-radius:3px;}&:hover{color:#f5dc9b;border-bottom-color:rgba(245,220,155,.75);}`;
const SkillFallback = styled.span`width:1.08em;height:1.08em;border:1px solid rgba(255,209,102,.38);background:rgba(255,209,102,.16);`;

export default ElementalShamanUlatekLogReportPage;
