import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Database,
  ExternalLink,
  Gauge,
  Layers3,
  ListChecks,
  RefreshCw,
  Target,
  Zap,
} from 'lucide-react';
import kbSkills from '../data/kb-skills.json';
import LogReportSidebarList from '../components/LogReportSidebarList.js';

const skills = kbSkills.skills || {};

const bossRows = [
  { boss: '영혼소환사 네크잘리', best: 81.2, median: 59.4, dps: '126.4k', note: '기본 단일 흐름은 작동' },
  { boss: '매장된 파수꾼', best: 69.1, median: 45.7, dps: '110.9k', note: '다중 대상 소비기 점검' },
  { boss: '악성의 바쉬니크', best: 73.1, median: 61.1, dps: '126.0k', note: '두 기록 모두 비교적 안정' },
  { boss: '길 잃은 탐험가', best: 79.3, median: 52.2, dps: '196.6k', note: '짧은 전투 대응 양호' },
  { boss: '스조라크', best: 83.6, median: 60.0, dps: '127.3k', note: '기본 조작의 양성 대조군' },
  { boss: '쌍둥이 송곳니', best: 64.5, median: 51.6, dps: '141.5k', note: '소비기 기준과 쿨기 횟수' },
  { boss: '똬리의 제단', best: 57.6, median: 47.9, dps: '119.3k', note: '우선 대상 피해 분산' },
  { boss: '울라텍', best: 51.4, median: 27.9, dps: '116.1k', note: '세트·도트·쿨기가 겹침' },
  { boss: '파도소환사 님리사', best: 20.6, median: 20.6, dps: '79.8k', note: '추가 대상 활용 부족' },
];

const controlledRows = [
  { boss: '울라텍', targetIlvl: 298, targetTime: '5:01', target: 109.4, referenceIlvl: 297, referenceTime: '5:01', reference: 175.9 },
  { boss: '똬리의 제단', targetIlvl: 298, targetTime: '4:27', target: 119.3, referenceIlvl: 298, referenceTime: '4:54', reference: 172.4 },
  { boss: '쌍둥이 송곳니', targetIlvl: 298, targetTime: '4:35', target: 141.5, referenceIlvl: 298, referenceTime: '4:41', reference: 196.5 },
  { boss: '스조라크', targetIlvl: 298, targetTime: '4:04', target: 127.3, referenceIlvl: 298, referenceTime: '4:11', reference: 154.5 },
];

const ulaCastRows = [
  { id: '194153', target: 66, reference: 67, note: '필러 수는 사실상 같음' },
  { id: '78674', target: 47, reference: 44, note: '단일 소비기 부족이 아님' },
  { id: '191034', target: 18, reference: 36, note: '지속 다중 대상 소비가 절반' },
  { id: '202770', target: 5, reference: 9, note: '재사용 횟수 차이가 가장 큼' },
  { id: '102560', target: 4, reference: 4, note: '큰 쿨기 횟수는 같음' },
  { id: '48518', target: 6, reference: 7, note: '유지율 51.2% / 56.8%' },
];

const damageRows = [
  { id: '194153', target: 6.36, reference: 9.41 },
  { id: '78674', target: 6.72, reference: 7.74 },
  { id: '191034', target: 3.08, reference: 8.33 },
  { id: '202770', target: 1.03, reference: 3.54 },
  { id: '202342', target: 3.95, reference: 8.01 },
];

const spenderRows = [
  { fight: '똬리의 제단', logA: '73 / 1', logB: '52 / 19', reference: '79 / 1', call: '우선 대상 별빛쇄도 중심' },
  { fight: '쌍둥이 송곳니', logA: '62 / 14', logB: '8 / 61', reference: '32 / 58', call: '별똥별 중심 + 우선 대상 보완' },
];

const nymRows = [
  { id: '194153', target: 69, reference: 68, note: '기본 필러는 동일' },
  { id: '202770', target: 4, reference: 4, note: '쿨기 횟수도 동일' },
  { id: '8921', target: 8, reference: 32, note: '오래 사는 추가 대상 적용 부족' },
  { id: '191034', target: 10, reference: 33, note: '다중 대상 소비 연결 부족' },
];

const furyTimelines = [
  { owner: '멍냥냥님', duration: 300.6, times: [7.8, 71.6, 133.9, 198.9, 273.1], tone: '#d79a5b' },
  { owner: '상위 비교군', duration: 301.2, times: [11.0, 35.3, 61.1, 94.6, 118.6, 139.8, 175.3, 199.3, 285.4], tone: '#66b6a1' },
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

function SectionHeading({ number, children, icon: Icon }) {
  return (
    <SectionHead>
      <SectionIcon><Icon size={18} aria-hidden="true" /></SectionIcon>
      <div><SectionKicker>{number}</SectionKicker><SectionTitle>{children}</SectionTitle></div>
    </SectionHead>
  );
}

function ScoreMeter({ value }) {
  return (
    <Meter aria-label={`${value}점`}>
      <MeterFill $width={`${Math.max(4, value)}%`} $tone={value >= 75 ? '#66b6a1' : value >= 50 ? '#d0a45f' : '#c66e63'} />
    </Meter>
  );
}

function CompareBar({ target, reference }) {
  const max = Math.max(target, reference);
  return (
    <BarPair>
      <BarLine><span>대상</span><BarTrack><BarFill $width={`${(target / max) * 100}%`} $tone="#d79a5b" /></BarTrack><strong>{target.toFixed(2)}M</strong></BarLine>
      <BarLine><span>상위</span><BarTrack><BarFill $width={`${(reference / max) * 100}%`} $tone="#66b6a1" /></BarTrack><strong>{reference.toFixed(2)}M</strong></BarLine>
    </BarPair>
  );
}

function BalanceDruidNormalLogReportPage() {
  useEffect(() => {
    document.title = '멍냥냥님 조화 드루이드 일반 로그 분석 | wowmeta';
    window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      try {
        window.$WowheadPower?.refreshLinks?.();
        window.WH?.Tooltips?.refreshLinks?.();
      } catch (error) {
        // The report stays usable when Wowhead's optional tooltip script is unavailable.
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Page>
      <ResponsiveStyles />
      <Hero>
        <HeroTop>
          <BackLink to="/logs/druid-balance"><ArrowLeft size={16} aria-hidden="true" />조화 드루이드 로그 분석 목록</BackLink>
          <Snapshot>12.1 · 일반 · 2026-09-05 분석</Snapshot>
        </HeroTop>
        <HeroGrid>
          <div>
            <Eyebrow>WARCRAFT LOGS REVIEW · 맹독 심연 일반</Eyebrow>
            <Title>멍냥냥님 조화 드루이드<br />점수가 갈리는 이유</Title>
            <Lead>
              프로필의 일반 난이도 9종을 훑고, 장비 레벨·공격대 규모·전투 길이가 가까운 상위 로그를 원시 이벤트로 다시 맞췄습니다.
              기본 캐스팅은 무너지지 않았습니다. 세트 전환, 소비기 기준, 짧아진 쿨기 회수에서 차이가 커졌습니다.
            </Lead>
          </div>
          <HeroVerdict>
            <Target size={21} aria-hidden="true" />
            <div>
              <span>결론 먼저</span>
              <strong>2+2 세트 상태에서 전투별 소비기 규칙까지 흔들렸습니다</strong>
              <p>시즌 1과 시즌 2 모두 4세트가 꺼진 상태였고, <SkillLink id="78674" />·<SkillLink id="191034" /> 선택이 같은 우두머리에서도 크게 바뀌었습니다. <SkillLink id="202770" />는 울라텍에서 5회, 상위 로그는 9회였습니다.</p>
            </div>
          </HeroVerdict>
        </HeroGrid>
      </Hero>

      <SnapshotStrip aria-label="로그 요약">
        <SnapshotItem><span>최고 기록 평균</span><strong>64.5점</strong><small>9종 최고 점수 기준</small></SnapshotItem>
        <SnapshotItem><span>가장 좋은 전투</span><strong>스조라크 83.6</strong><small>기본 조작은 작동한다는 증거</small></SnapshotItem>
        <SnapshotItem><span>울라텍 통제 비교</span><strong>-37.8%</strong><small>109.4k 대 175.9k DPS</small></SnapshotItem>
        <SnapshotItem><span>우선 교정</span><strong>세트 · 소비기 · 쿨기</strong><small>장비 → 규칙 → 회수 순서</small></SnapshotItem>
      </SnapshotStrip>

      <ReportLayout>
        <ReportNav aria-label="분석 목차">
          <NavLink href="#method">01 비교 기준</NavLink>
          <NavLink href="#diagnosis">02 핵심 진단</NavLink>
          <NavLink href="#bosses">03 전투별 점수</NavLink>
          <NavLink href="#gear">04 세트 전환</NavLink>
          <NavLink href="#ulatek">05 울라텍 심층</NavLink>
          <NavLink href="#spenders">06 소비기 규칙</NavLink>
          <NavLink href="#nymrissa">07 님리사</NavLink>
          <NavLink href="#fix">08 교정 순서</NavLink>
          <LogReportSidebarList />
        </ReportNav>

        <Article>
          <Section id="method">
            <SectionHeading number="01 · 비교 기준" icon={Gauge}>장비와 전투 길이를 먼저 맞췄습니다</SectionHeading>
            <SectionLead>
              프로필 점수만으로 결론을 내리지 않았습니다. 2026년 8월 27일 30인 보고서를 주 분석 로그로 삼고,
              울라텍·똬리의 제단·쌍둥이 송곳니·스조라크는 장비 레벨 297~298의 시간 근접 상위 로그와 비교했습니다.
              님리사는 별도 보고서에서 장비 레벨 291 대 290, 전투 길이 240.4초 대 242.8초로 맞췄습니다.
            </SectionLead>
            <MethodGrid>
              <MethodNote><Database size={17} /><div><strong>실제 이벤트</strong><span>cast, damage, buff를 같은 방식으로 집계했습니다.</span></div></MethodNote>
              <MethodNote><Clock3 size={17} /><div><strong>시간 통제</strong><span>울라텍 비교는 300.6초와 301.2초입니다.</span></div></MethodNote>
              <MethodNote><Layers3 size={17} /><div><strong>빌드 분리</strong><span>다른 영웅 특성·필러 빌드는 그대로 복사하지 않았습니다.</span></div></MethodNote>
            </MethodGrid>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>Warcraft Logs 백분위는 표본과 재집계에 따라 바뀝니다. 이 페이지의 진단은 분석 시점의 점수보다 저장된 시전 횟수와 타임스탬프를 우선합니다.</p>
            </Caution>
            <TableScroll tabIndex="0">
              <DataTable aria-label="통제 비교 로그">
                <thead><tr><th>우두머리</th><th>대상 조건</th><th>대상 DPS</th><th>상위 조건</th><th>상위 DPS</th><th>격차</th></tr></thead>
                <tbody>
                  {controlledRows.map(row => (
                    <tr key={row.boss}>
                      <th>{row.boss}</th>
                      <td>{row.targetIlvl} · {row.targetTime}</td>
                      <td>{row.target.toFixed(1)}k</td>
                      <td>{row.referenceIlvl} · {row.referenceTime}</td>
                      <td>{row.reference.toFixed(1)}k</td>
                      <td><Gap>-{Math.round((1 - row.target / row.reference) * 100)}%</Gap></td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </TableScroll>
          </Section>

          <Section id="diagnosis">
            <SectionHeading number="02 · 핵심 진단" icon={ListChecks}>원인은 네 단계로 이어집니다</SectionHeading>
            <CauseRail>
              <Cause $tone="#c66e63"><b>01 · 먼저 확인</b><strong>시즌 1 2부위 + 시즌 2 2부위</strong><span>양쪽 4세트가 모두 꺼졌습니다. 선택한 동급 상위 로그 네 개는 모두 시즌 1 4세트를 유지했습니다.</span></Cause>
              <Cause $tone="#d79a5b"><b>02 · 반복 실수</b><strong>소비기 기준이 전투마다 바뀜</strong><span>똬리의 제단과 쌍둥이 송곳니에서 두 기록의 단일·광역 소비기 비율이 반대로 뒤집혔습니다.</span></Cause>
              <Cause $tone="#6f9fc3"><b>03 · 회수 손실</b><strong><SkillLink id="202770" /> 재사용 지연</strong><span>울라텍은 5회 대 9회, 쌍둥이 송곳니는 5회 대 12회였습니다.</span></Cause>
              <Cause $tone="#66b6a1"><b>04 · 대상 선택</b><strong>도트 글쿨의 효율이 낮음</strong><span>울라텍에서는 더 많이 눌렀지만 틱과 <SkillLink id="202342" /> 적중은 더 적었습니다.</span></Cause>
            </CauseRail>
            <Finding>
              <CheckCircle2 size={18} aria-hidden="true" />
              <div><strong>기본 딜사이클 전체가 틀린 것은 아닙니다</strong><p>스조라크 83.6점, 울라텍 <SkillLink id="194153" /> 66회 대 67회, <SkillLink id="202345" /> 유지 230.2초 대 227.3초입니다. 먼저 잘되는 축은 그대로 두고 손실이 확인된 세 축만 고치는 편이 빠릅니다.</p></div>
            </Finding>
          </Section>

          <Section id="bosses">
            <SectionHeading number="03 · 전투별 점수" icon={BarChart3}>같은 문제로 모든 전투를 설명할 수는 없습니다</SectionHeading>
            <SectionLead>
              네크잘리·바쉬니크·길 잃은 탐험가·스조라크는 기본 루프가 이미 작동합니다. 점수가 크게 내려간 울라텍과 님리사,
              그리고 두 기록의 소비기 선택이 뒤집힌 똬리의 제단·쌍둥이 송곳니를 우선해서 봐야 합니다.
              오른쪽 DPS는 프로필에 기록된 우두머리별 최고 기록이며, 아래 통제 비교의 선택 전투 DPS와는 구분했습니다.
            </SectionLead>
            <BossList>
              {bossRows.map(row => (
                <BossRow key={row.boss}>
                  <BossName><strong>{row.boss}</strong><span>{row.note}</span></BossName>
                  <ScoreMeter value={row.best} />
                  <BossScore><strong>{row.best.toFixed(1)}</strong><span>중앙 {row.median.toFixed(1)}</span></BossScore>
                  <BossDps>{row.dps}</BossDps>
                </BossRow>
              ))}
            </BossList>
          </Section>

          <Section id="gear">
            <SectionHeading number="04 · 세트 전환" icon={Layers3}>딜사이클을 고치기 전에 세트부터 시뮬레이션해야 합니다</SectionHeading>
            <SectionLead>
              주 분석 로그의 장비 레벨은 298이며 시즌 1 세트 2부위와 시즌 2 세트 2부위를 착용했습니다. 따라서 어느 쪽 4세트도 활성화되지 않습니다.
              반면 울라텍·똬리의 제단·쌍둥이 송곳니·스조라크의 선택한 동급 상위 비교군은 모두 시즌 1 4세트를 유지했습니다.
            </SectionLead>
            <GearGrid>
              <GearPanel $tone="#d79a5b">
                <span>멍냥냥님 · 장비 298</span>
                <strong>시즌 1 ×2 + 시즌 2 ×2</strong>
                <p>울라텍 무료 소비기 10회. 양쪽 4세트가 모두 비활성인 전환 구간입니다.</p>
              </GearPanel>
              <GearPanel $tone="#66b6a1">
                <span>울라텍 상위 · 장비 297</span>
                <strong>시즌 1 4세트 유지</strong>
                <p>울라텍 무료 소비기 36회. 유료 소비기는 오히려 대상보다 11회 적었습니다.</p>
              </GearPanel>
            </GearGrid>
            <BodyCopy>
              이 관찰만으로 “무조건 옛 세트로 돌아가라”고 확정하면 안 됩니다. 보유 아이템의 지능·2차 능력치·장신구까지 다르기 때문입니다.
              다만 선택한 비교군이 모두 같은 결정을 했고 무료 소비기 차이도 매우 크므로, Raidbots Top Gear에서 <b>시즌 1 4세트 복구</b>와 <b>현재 2+2</b>를 가장 먼저 비교해야 합니다.
              시즌 2 4세트가 완성되기 전 교체 기준은 개인 시뮬레이션으로 확정합니다.
            </BodyCopy>
          </Section>

          <Section id="ulatek">
            <SectionHeading number="05 · 울라텍 심층" icon={Target}>필러는 같았고, 쿨기와 다중 대상 가치가 갈렸습니다</SectionHeading>
            <SectionLead>
              5분 1초로 전투 길이를 거의 완전히 맞춘 비교입니다. 대상은 109.4k, 상위 비교군은 175.9k DPS였습니다.
              <SkillLink id="194153" />과 <SkillLink id="78674" /> 횟수는 비슷했지만 <SkillLink id="191034" />, <SkillLink id="202770" />, 무료 소비기에서 벌어졌습니다.
            </SectionLead>
            <TwoColumn>
              <div>
                <Subhead>주요 시전 수</Subhead>
                <TableScroll tabIndex="0">
                  <DataTable aria-label="울라텍 주문 시전 비교">
                    <thead><tr><th>주문</th><th>대상</th><th>상위</th><th>판독</th></tr></thead>
                    <tbody>
                      {ulaCastRows.map(row => (
                        <tr key={row.id}><th><SkillLink id={row.id} /></th><td>{row.target}</td><td>{row.reference}</td><td>{row.note}</td></tr>
                      ))}
                    </tbody>
                  </DataTable>
                </TableScroll>
              </div>
              <div>
                <Subhead>주요 주문 피해</Subhead>
                <DamageList>
                  {damageRows.map(row => (
                    <DamageRow key={row.id}><SkillLink id={row.id} /><CompareBar target={row.target} reference={row.reference} /></DamageRow>
                  ))}
                </DamageList>
              </div>
            </TwoColumn>

            <Subsection>
              <Subhead><SkillLink id="202770" /> 타임라인</Subhead>
              <TimelinePanel>
                {furyTimelines.map(row => (
                  <TimelineRow key={row.owner}>
                    <TimelineLabel><strong>{row.owner}</strong><span>{row.times.length}회</span></TimelineLabel>
                    <TimelineTrack>
                      {row.times.map(time => <TimelineMark key={time} $left={`${(time / row.duration) * 100}%`} $tone={row.tone} title={`${time.toFixed(1)}초`} />)}
                    </TimelineTrack>
                  </TimelineRow>
                ))}
                <TimelineScale><span>0:00</span><span>1:00</span><span>2:00</span><span>3:00</span><span>4:00</span><span>5:00</span></TimelineScale>
              </TimelinePanel>
              <BodyCopy>
                대상의 사용 시점은 7.8, 71.6, 133.9, 198.9, 273.1초로 대부분 62~74초 간격입니다. 상위 비교군은 마지막 긴 공백을 제외하면 대체로 21~35초 간격입니다.
                <SkillLink id="429539" />이 줄인 재사용 대기시간을 놓쳐서, 큰 버튼 한두 번이 아니라 전투 전체에서 네 번의 시전 차이가 생겼습니다.
              </BodyCopy>
            </Subsection>

            <InsightGrid>
              <Insight>
                <span>도트 입력</span><strong>58회 / 36회</strong><p>대상이 <SkillLink id="8921" />·<SkillLink id="93402" />를 22회 더 눌렀습니다.</p>
              </Insight>
              <Insight>
                <span>실제 도트 틱</span><strong>677회 / 774회</strong><p>더 많이 눌렀지만 남은 유효 틱은 오히려 적었습니다.</p>
              </Insight>
              <Insight>
                <span><SkillLink id="202342" /> 적중</span><strong>164회 / 260회</strong><p>살아 있는 대상에 남긴 도트 총량 차이로 이어졌습니다.</p>
              </Insight>
            </InsightGrid>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>대상 수와 전환 상황이 있으므로 58회의 갱신을 전부 실수로 세지는 않습니다. 판정은 “도트를 많이 눌렀다”가 아니라 “도트 한 글쿨이 남긴 틱과 발동이 적었다”입니다.</p>
            </Caution>

            <Subsection>
              <Subhead>오프닝에서 먼저 바꿀 한 가지</Subhead>
              <Flow aria-label="권장 오프닝 원칙">
                <FlowStep><b>1</b><SkillLink id="5176" /><span>가능한 전투에서 선시전</span></FlowStep>
                <FlowArrow>→</FlowArrow>
                <FlowStep><b>2</b><span><SkillLink id="8921" /> + <SkillLink id="93402" /></span><span>도트 준비</span></FlowStep>
                <FlowArrow>→</FlowArrow>
                <FlowStep><b>3</b><span><SkillLink id="102560" /> 또는 <SkillLink id="48518" /></span><span>첫 강화 구간 열기</span></FlowStep>
                <FlowArrow>→</FlowArrow>
                <FlowStep><b>4</b><SkillLink id="202770" /><span>진입 전후에 붙여 재사용 회수</span></FlowStep>
                <FlowArrow>→</FlowArrow>
                <FlowStep><b>5</b><span><SkillLink id="78674" /> / <SkillLink id="191034" /></span><span>대상 수에 맞춰 소비</span></FlowStep>
              </Flow>
              <BodyCopy>
                대상 오프닝은 태양섬광 → 달빛섬광 → 화신 → 별빛쇄도 → 별빛섬광 → 무료 별빛쇄도 → 엘룬의 분노 순이었습니다.
                위 차트는 고정 매크로가 아니라 교정 원칙입니다. 화신이 준비된 풀에서는 일반 일월식을 바로 앞에 눌러 덮어쓰지 말고 화신으로 구간을 열며,
                엘룬의 분노는 일월식·화신 진입 직전 또는 직후에 붙여 재사용 대기시간이 놀지 않게 합니다.
              </BodyCopy>
            </Subsection>
          </Section>

          <Section id="spenders">
            <SectionHeading number="06 · 소비기 규칙" icon={RefreshCw}>같은 우두머리에서 판단이 반대로 뒤집혔습니다</SectionHeading>
            <SectionLead>
              두 개의 연속된 일반 로그를 비교하면 단순 실수보다 “전투별 규칙 부재”가 더 선명합니다. 아래 숫자는 <SkillLink id="78674" /> / <SkillLink id="191034" /> 순서입니다.
            </SectionLead>
            <TableScroll tabIndex="0">
              <DataTable aria-label="소비기 선택 일관성">
                <thead><tr><th>전투</th><th>8월 26일</th><th>8월 27일</th><th>동급 상위</th><th>다음 기준</th></tr></thead>
                <tbody>
                  {spenderRows.map(row => <tr key={row.fight}><th>{row.fight}</th><td>{row.logA}</td><td>{row.logB}</td><td>{row.reference}</td><td>{row.call}</td></tr>)}
                </tbody>
              </DataTable>
            </TableScroll>
            <DecisionGrid>
              <Decision><span>단일·우선 대상</span><strong><SkillLink id="78674" /> 중심</strong><p>똬리의 제단처럼 보스 또는 우선 대상 피해가 중요한 전투는 이 기준을 먼저 둡니다.</p></Decision>
              <Decision><span>오래 사는 3대상 이상</span><strong><SkillLink id="191034" /> 중심</strong><p>쌍둥이 송곳니·울라텍에서 여러 대상이 충분히 오래 남을 때 적용합니다.</p></Decision>
              <Decision><span>정확히 2대상</span><strong>고정 답 없음</strong><p><SkillLink id="393940" />를 포함한 현재 특성, 대상 생존 시간, 우선 대상 요구에 따라 나눕니다.</p></Decision>
            </DecisionGrid>
            <BodyCopy>
              핵심은 “2대상이면 무조건 별똥별” 같은 한 줄 규칙이 아닙니다. 전투 시작 전에 <b>오래 사는 대상 수</b>, <b>반드시 빨리 죽여야 하는 대상</b>,
              <b>무료 소비기 발동</b> 세 가지를 정하고, 로그마다 기준을 바꾸지 않아야 합니다.
            </BodyCopy>
          </Section>

          <Section id="nymrissa">
            <SectionHeading number="07 · 파도소환사 님리사" icon={Zap}>20.6점은 필러보다 추가 대상 처리에서 나왔습니다</SectionHeading>
            <SectionLead>
              대상은 장비 레벨 291, 240.4초, 79.8k DPS였습니다. 비교군은 장비 레벨 290, 242.8초, 173.5k DPS입니다.
              장비와 시간은 거의 같고 <SkillLink id="194153" />, <SkillLink id="202770" />, 유료 소비기 수까지 같았습니다.
            </SectionLead>
            <TableScroll tabIndex="0">
              <DataTable aria-label="파도소환사 님리사 시전 비교">
                <thead><tr><th>주문</th><th>대상</th><th>상위</th><th>판독</th></tr></thead>
                <tbody>
                  {nymRows.map(row => <tr key={row.id}><th><SkillLink id={row.id} /></th><td>{row.target}</td><td>{row.reference}</td><td>{row.note}</td></tr>)}
                  <tr><th>무료 소비기</th><td>10</td><td>30</td><td>발동 생성 구조 차이</td></tr>
                  <tr><th>유료 소비기</th><td>44</td><td>44</td><td>천공의 힘 소비 자체는 동일</td></tr>
                </tbody>
              </DataTable>
            </TableScroll>
            <Finding>
              <CheckCircle2 size={18} aria-hidden="true" />
              <div><strong>이 전투의 연습 목표는 명확합니다</strong><p>곧 죽는 대상이 아니라 충분히 오래 사는 추가 대상에 <SkillLink id="8921" />을 남기고, 실제 다중 대상이 유지되는 동안 <SkillLink id="191034" />로 연결합니다. 필러를 더 빨리 누르는 문제부터 고칠 로그가 아닙니다.</p></div>
            </Finding>
          </Section>

          <Section id="fix">
            <SectionHeading number="08 · 교정 순서" icon={ListChecks}>다음 레이드에서는 이 순서만 확인하면 됩니다</SectionHeading>
            <PriorityList>
              <Priority><b>1</b><div><strong>세트 조합을 먼저 시뮬레이션</strong><p>Raidbots Top Gear에서 시즌 1 4세트 복구와 현재 2+2를 비교합니다. 보유하지 않은 장비를 가정하지 않습니다.</p></div></Priority>
              <Priority><b>2</b><div><strong><SkillLink id="202770" /> 남은 쿨을 중앙에 표시</strong><p><SkillLink id="429539" />으로 줄어든 실제 쿨을 보고 <SkillLink id="48518" /> 안에서 바로 씁니다. 곧 올 확정 피해 구간만 짧게 기다립니다.</p></div></Priority>
              <Priority><b>3</b><div><strong>우두머리별 소비기 규칙을 풀 전에 결정</strong><p>똬리의 제단은 우선 대상, 쌍둥이 송곳니·울라텍은 지속 다중 대상을 기준으로 정하고 전투 중 미터 모양 때문에 뒤집지 않습니다.</p></div></Priority>
              <Priority><b>4</b><div><strong>도트 대상을 생존 시간으로 고르기</strong><p>곧 사라지거나 대상 지정 불가가 되는 적에는 새로 바르지 않습니다. 일월식 직전 또는 자연 만료에 갱신해 내부 글쿨을 비웁니다.</p></div></Priority>
              <Priority><b>5</b><div><strong>다음 로그에서 네 숫자만 재검수</strong><p>우두머리별 소비기 비율, 엘룬의 분노 간격, 무료 소비기 수, 도트 1회당 틱 수를 확인합니다.</p></div></Priority>
            </PriorityList>

            <Subsection>
              <Subhead>잘못 고치면 안 되는 부분</Subhead>
              <NoBlameGrid>
                <NoBlame><strong><SkillLink id="202345" /> 유지</strong><span>230.2초로 상위 227.3초보다 길었습니다.</span></NoBlame>
                <NoBlame><strong><SkillLink id="450356" /> 소비</strong><span>발동 10회와 무료 소비기 10회가 일치했습니다.</span></NoBlame>
                <NoBlame><strong>2차 능력치 하나</strong><span>상위 로그도 치명타형과 특화형이 섞였습니다. SimC로 판단합니다.</span></NoBlame>
                <NoBlame><strong><SkillLink id="20484" /> 1회</strong><span>공격대 기여로 잃은 한 글쿨이며 37.8% 격차의 원인이 아닙니다.</span></NoBlame>
              </NoBlameGrid>
            </Subsection>

            <FinalCall>
              <strong>한 문장 처방</strong>
              <p>세트 4효과를 되살릴 수 있는지 먼저 심한 뒤, 전투별 소비기 규칙을 고정하고, 줄어든 엘룬의 분노를 실제로 회수하세요.</p>
            </FinalCall>
          </Section>

          <Sources>
            <strong>분석 자료</strong>
            <SourceLinks>
              <SourceLink href="https://www.warcraftlogs.com/character/kr/%EC%95%84%EC%A6%88%EC%83%A4%EB%9D%BC/%EB%A9%8D%EB%83%A5%EB%83%A5%EB%8B%98">멍냥냥님 캐릭터 프로필</SourceLink>
              <SourceLink href="https://www.warcraftlogs.com/reports/wJ8pTfq2dW91HkLG">주 분석 보고서</SourceLink>
              <SourceLink href="https://www.warcraftlogs.com/reports/h7njt1YgZxVW826C">반복성 확인 보고서</SourceLink>
              <SourceLink href="https://www.warcraftlogs.com/reports/GcPjrkAQwfK8hRDy?fight=11&source=256">울라텍 상위 비교 로그</SourceLink>
              <SourceLink href="https://www.warcraftlogs.com/reports/7rgMNPnQWAyjHbmV?fight=38&source=309">똬리의 제단 상위 비교 로그</SourceLink>
              <SourceLink href="https://www.warcraftlogs.com/reports/DfB3wmntgATXqjRH?fight=33&source=184">쌍둥이 송곳니 상위 비교 로그</SourceLink>
              <SourceLink href="https://www.warcraftlogs.com/reports/7qFpVRd8Jj392H1X?fight=83&source=1343">스조라크 상위 비교 로그</SourceLink>
              <SourceLink href="https://www.warcraftlogs.com/reports/fd8HTbxmw42RvBQ7?fight=7&source=2681">님리사 상위 비교 로그</SourceLink>
              <SourceLink href="https://www.dreamgrove.gg/blog/balance/compendium">Dreamgrove 조화 자료</SourceLink>
              <SourceLink href="https://www.icy-veins.com/wow/balance-druid-pve-dps-rotation-cooldowns-abilities">Icy Veins 12.1 운용</SourceLink>
              <SourceLink href="https://www.wowhead.com/ko/guide/classes/druid/balance/rotation-cooldowns-pve-dps">Wowhead 한국어 조화 가이드</SourceLink>
            </SourceLinks>
            <p>상위 비교 로그는 분석 시점의 일반 난이도 장비 구간 순위에서 전투 길이와 공격대 규모가 가까운 기록을 골랐습니다. 순위가 바뀌어도 본문의 원시 이벤트 수치는 해당 보고서에 고정됩니다.</p>
          </Sources>
        </Article>
      </ReportLayout>
    </Page>
  );
}

const Page = styled.div`
  min-height:100vh;
  color:#dbe2e5;
  background:#080d10;
  word-break:keep-all;
  overflow-wrap:break-word;
`;

const Hero = styled.header`
  position:relative;
  padding:44px max(24px,calc((100vw - 1260px)/2)) 48px;
  border-bottom:1px solid rgba(177,190,197,.14);
  background:
    linear-gradient(rgba(102,182,161,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(102,182,161,.04) 1px,transparent 1px),
    #0a1115;
  background-size:64px 64px;
`;

const HeroTop = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
  margin-bottom:42px;
`;

const BackLink = styled(Link)`
  display:inline-flex;
  align-items:center;
  gap:7px;
  color:#96a3a9;
  font-size:.75rem;
  font-weight:700;
  &:hover{color:#f0f3f4;}
`;

const Snapshot = styled.span`
  color:#b99161;
  font-size:.68rem;
  font-weight:800;
`;

const HeroGrid = styled.div`
  display:grid;
  grid-template-columns:minmax(0,1.35fr) minmax(320px,.65fr);
  gap:54px;
  align-items:end;
`;

const Eyebrow = styled.div`
  margin-bottom:12px;
  color:#66b6a1;
  font-size:.7rem;
  font-weight:850;
  letter-spacing:0;
`;

const Title = styled.h1`
  margin:0;
  color:#f2f4f5;
  font-size:2.65rem;
  line-height:1.16;
  letter-spacing:0;
`;

const Lead = styled.p`
  max-width:760px;
  margin:20px 0 0;
  color:#aeb8bd;
  font-size:.98rem;
  line-height:1.82;
`;

const HeroVerdict = styled.div`
  display:grid;
  grid-template-columns:24px minmax(0,1fr);
  gap:14px;
  padding:20px 0 20px 20px;
  border-left:2px solid #d79a5b;
  background:rgba(255,255,255,.025);
  color:#d79a5b;
  span{display:block;margin-bottom:7px;font-size:.67rem;font-weight:850;}
  strong{display:block;color:#f0f2f3;font-size:1rem;line-height:1.5;}
  p{margin:9px 0 0;color:#9fabb0;font-size:.78rem;line-height:1.7;}
`;

const SnapshotStrip = styled.section`
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  width:min(1260px,calc(100% - 48px));
  margin:0 auto;
  border-bottom:1px solid rgba(177,190,197,.14);
`;

const SnapshotItem = styled.div`
  min-width:0;
  padding:24px 20px;
  border-right:1px solid rgba(177,190,197,.11);
  &:last-child{border-right:0;}
  span{display:block;color:#718087;font-size:.66rem;font-weight:800;}
  strong{display:block;margin:7px 0 5px;color:#edf1f2;font-size:1.13rem;line-height:1.35;}
  small{display:block;color:#8c999f;font-size:.67rem;line-height:1.5;}
`;

const ReportLayout = styled.div`
  display:grid;
  grid-template-columns:180px minmax(0,1fr);
  gap:48px;
  width:min(1260px,calc(100% - 48px));
  margin:0 auto;
  padding:48px 0 88px;
`;

const ReportNav = styled.nav`
  position:sticky;
  top:82px;
  align-self:start;
  display:grid;
  gap:1px;
`;

const NavLink = styled.a`
  padding:9px 8px;
  border-left:1px solid rgba(177,190,197,.12);
  color:#6f7d84;
  font-size:.68rem;
  font-weight:750;
  &:hover{border-color:#b99161;color:#e3e8ea;background:rgba(255,255,255,.025);}
`;

const Article = styled.article`
  min-width:0;
  max-width:1010px;
`;

const Section = styled.section`
  scroll-margin-top:86px;
  margin-bottom:58px;
  padding-bottom:58px;
  border-bottom:1px solid rgba(177,190,197,.12);
  &:last-of-type{margin-bottom:36px;}
`;

const SectionHead = styled.div`
  display:flex;
  align-items:flex-start;
  gap:13px;
  margin-bottom:20px;
`;

const SectionIcon = styled.span`
  display:grid;
  place-items:center;
  flex:0 0 34px;
  width:34px;
  height:34px;
  border:1px solid rgba(185,145,97,.36);
  color:#d79a5b;
`;

const SectionKicker = styled.span`
  display:block;
  margin:0 0 4px;
  color:#8b979d;
  font-size:.64rem;
  font-weight:800;
`;

const SectionTitle = styled.h2`
  margin:0;
  color:#edf1f2;
  font-size:1.45rem;
  line-height:1.35;
  letter-spacing:0;
`;

const SectionLead = styled.p`
  max-width:900px;
  margin:0 0 24px;
  color:#abb5ba;
  font-size:.9rem;
  line-height:1.85;
`;

const BodyCopy = styled.p`
  margin:20px 0 0;
  color:#aeb8bd;
  font-size:.86rem;
  line-height:1.85;
  b{color:#e2e7e9;}
`;

const MethodGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  border:1px solid rgba(177,190,197,.12);
`;

const MethodNote = styled.div`
  display:grid;
  grid-template-columns:20px minmax(0,1fr);
  gap:10px;
  min-width:0;
  padding:16px;
  border-right:1px solid rgba(177,190,197,.1);
  color:#66b6a1;
  &:last-child{border-right:0;}
  strong{display:block;color:#dfe5e7;font-size:.76rem;}
  span{display:block;margin-top:5px;color:#89969c;font-size:.69rem;line-height:1.55;}
`;

const Caution = styled.div`
  display:grid;
  grid-template-columns:20px minmax(0,1fr);
  gap:10px;
  margin:18px 0;
  padding:14px 16px;
  border-left:2px solid #b99161;
  background:rgba(185,145,97,.06);
  color:#d1a467;
  p{margin:0;color:#aeb6ba;font-size:.75rem;line-height:1.7;}
`;

const TableScroll = styled.div`
  max-width:100%;
  margin-top:18px;
  overflow-x:auto;
  border:1px solid rgba(177,190,197,.12);
  &:focus-visible{outline:2px solid #66b6a1;outline-offset:2px;}
`;

const DataTable = styled.table`
  width:100%;
  min-width:680px;
  border-collapse:collapse;
  color:#aeb8bd;
  font-size:.74rem;
  th,td{padding:12px 13px;border-bottom:1px solid rgba(177,190,197,.09);text-align:left;vertical-align:middle;}
  thead th{color:#77858b;background:#0c1317;font-size:.63rem;font-weight:800;}
  tbody th{color:#dce2e4;font-weight:750;}
  tbody tr:last-child th,tbody tr:last-child td{border-bottom:0;}
  tbody tr:hover{background:rgba(255,255,255,.018);}
`;

const Gap = styled.strong`
  color:#d37b6f;
`;

const CauseRail = styled.div`
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:1px;
  background:rgba(177,190,197,.12);
  border:1px solid rgba(177,190,197,.12);
`;

const Cause = styled.div`
  min-width:0;
  padding:19px;
  background:#0b1216;
  border-top:3px solid ${props => props.$tone};
  b{display:block;color:${props => props.$tone};font-size:.63rem;}
  strong{display:block;margin:8px 0;color:#e4e9ea;font-size:.88rem;line-height:1.5;}
  span{display:block;color:#8f9ba1;font-size:.72rem;line-height:1.65;}
`;

const Finding = styled.div`
  display:grid;
  grid-template-columns:20px minmax(0,1fr);
  gap:11px;
  margin-top:18px;
  padding:16px;
  border-left:2px solid #66b6a1;
  background:rgba(102,182,161,.055);
  color:#66b6a1;
  strong{display:block;color:#dfe6e7;font-size:.8rem;}
  p{margin:6px 0 0;color:#98a5aa;font-size:.73rem;line-height:1.68;}
`;

const BossList = styled.div`
  border-top:1px solid rgba(177,190,197,.13);
`;

const BossRow = styled.div`
  display:grid;
  grid-template-columns:minmax(210px,1.2fr) minmax(160px,1fr) 90px 72px;
  gap:16px;
  align-items:center;
  min-height:66px;
  padding:10px 12px;
  border-bottom:1px solid rgba(177,190,197,.1);
`;

const BossName = styled.div`
  min-width:0;
  strong{display:block;color:#dfe4e6;font-size:.76rem;}
  span{display:block;margin-top:4px;color:#75838a;font-size:.65rem;}
`;

const Meter = styled.div`
  position:relative;
  height:5px;
  background:#141d22;
  overflow:hidden;
`;

const MeterFill = styled.span`
  display:block;
  width:${props => props.$width};
  height:100%;
  background:${props => props.$tone};
`;

const BossScore = styled.div`
  display:flex;
  align-items:baseline;
  gap:6px;
  strong{color:#e7ebec;font-size:.88rem;}
  span{color:#68767d;font-size:.58rem;}
`;

const BossDps = styled.strong`
  color:#9ba7ac;
  font-size:.72rem;
  text-align:right;
`;

const GearGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:1px;
  background:rgba(177,190,197,.12);
  border:1px solid rgba(177,190,197,.12);
`;

const GearPanel = styled.div`
  padding:20px;
  background:#0b1216;
  border-top:3px solid ${props => props.$tone};
  span{display:block;color:${props => props.$tone};font-size:.66rem;font-weight:800;}
  strong{display:block;margin:8px 0;color:#eef1f2;font-size:1.05rem;}
  p{margin:0;color:#8f9ba1;font-size:.72rem;line-height:1.65;}
`;

const TwoColumn = styled.div`
  display:grid;
  grid-template-columns:minmax(0,1.08fr) minmax(320px,.92fr);
  gap:24px;
  align-items:start;
`;

const Subsection = styled.div`
  margin-top:34px;
  padding-top:28px;
  border-top:1px solid rgba(177,190,197,.1);
`;

const Subhead = styled.h3`
  margin:0 0 14px;
  color:#dfe5e7;
  font-size:.95rem;
  line-height:1.5;
`;

const DamageList = styled.div`
  border:1px solid rgba(177,190,197,.12);
`;

const DamageRow = styled.div`
  display:grid;
  grid-template-columns:150px minmax(0,1fr);
  gap:12px;
  align-items:center;
  min-height:69px;
  padding:10px 12px;
  border-bottom:1px solid rgba(177,190,197,.09);
  &:last-child{border-bottom:0;}
`;

const BarPair = styled.div`
  display:grid;
  gap:5px;
  min-width:0;
`;

const BarLine = styled.div`
  display:grid;
  grid-template-columns:32px minmax(0,1fr) 52px;
  gap:7px;
  align-items:center;
  span{color:#6f7d84;font-size:.57rem;}
  strong{color:#aab4b9;font-size:.59rem;text-align:right;}
`;

const BarTrack = styled.div`
  height:4px;
  background:#151e23;
  overflow:hidden;
`;

const BarFill = styled.span`
  display:block;
  width:${props => props.$width};
  height:100%;
  background:${props => props.$tone};
`;

const TimelinePanel = styled.div`
  padding:18px 16px 12px;
  border:1px solid rgba(177,190,197,.12);
  background:#0a1115;
`;

const TimelineRow = styled.div`
  display:grid;
  grid-template-columns:100px minmax(0,1fr);
  gap:14px;
  align-items:center;
  margin-bottom:15px;
`;

const TimelineLabel = styled.div`
  strong{display:block;color:#d9dfe1;font-size:.7rem;}
  span{display:block;margin-top:3px;color:#748187;font-size:.6rem;}
`;

const TimelineTrack = styled.div`
  position:relative;
  height:4px;
  background:#20292e;
`;

const TimelineMark = styled.span`
  position:absolute;
  top:50%;
  left:${props => props.$left};
  width:10px;
  height:10px;
  border:2px solid #0a1115;
  background:${props => props.$tone};
  transform:translate(-50%,-50%);
`;

const TimelineScale = styled.div`
  display:flex;
  justify-content:space-between;
  margin-left:114px;
  color:#56636a;
  font-size:.55rem;
`;

const InsightGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  margin-top:24px;
  border:1px solid rgba(177,190,197,.12);
`;

const Insight = styled.div`
  padding:17px;
  border-right:1px solid rgba(177,190,197,.1);
  &:last-child{border-right:0;}
  >span{display:block;color:#78868c;font-size:.64rem;font-weight:800;}
  >strong{display:block;margin:7px 0;color:#e8ebec;font-size:1rem;}
  p{margin:0;color:#8d999f;font-size:.68rem;line-height:1.6;}
`;

const Flow = styled.div`
  display:grid;
  grid-template-columns:minmax(110px,1fr) 20px minmax(140px,1.2fr) 20px minmax(120px,1fr) 20px minmax(120px,1fr) 20px minmax(150px,1.25fr);
  gap:8px;
  align-items:center;
`;

const FlowStep = styled.div`
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  justify-content:center;
  min-height:86px;
  padding:13px;
  border:1px solid rgba(177,190,197,.14);
  background:#0b1216;
  b{position:absolute;top:7px;right:8px;color:#4e5b61;font-size:.58rem;}
  >span:last-child{margin-top:7px;color:#748188;font-size:.61rem;line-height:1.45;}
`;

const FlowArrow = styled.span`
  color:#59676d;
  font-size:.8rem;
  text-align:center;
`;

const DecisionGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:1px;
  margin-top:20px;
  background:rgba(177,190,197,.12);
  border:1px solid rgba(177,190,197,.12);
`;

const Decision = styled.div`
  padding:18px;
  background:#0b1216;
  >span{display:block;color:#75838a;font-size:.64rem;font-weight:800;}
  >strong{display:block;margin:8px 0;color:#e6eaeb;font-size:.86rem;}
  p{margin:0;color:#8d999f;font-size:.7rem;line-height:1.65;}
`;

const PriorityList = styled.div`
  display:grid;
  gap:1px;
  background:rgba(177,190,197,.11);
  border:1px solid rgba(177,190,197,.11);
`;

const Priority = styled.div`
  display:grid;
  grid-template-columns:38px minmax(0,1fr);
  gap:14px;
  padding:17px 18px;
  background:#0b1216;
  >b{display:grid;place-items:center;width:30px;height:30px;border:1px solid rgba(215,154,91,.35);color:#d79a5b;font-size:.7rem;}
  strong{display:block;color:#e4e9ea;font-size:.8rem;}
  p{margin:6px 0 0;color:#8f9ca1;font-size:.72rem;line-height:1.65;}
`;

const NoBlameGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:1px;
  background:rgba(177,190,197,.11);
  border:1px solid rgba(177,190,197,.11);
`;

const NoBlame = styled.div`
  padding:16px;
  background:#0b1216;
  strong{display:block;color:#dce2e4;font-size:.76rem;}
  >span{display:block;margin-top:6px;color:#819097;font-size:.69rem;line-height:1.55;}
`;

const FinalCall = styled.div`
  margin-top:28px;
  padding:20px;
  border-top:2px solid #66b6a1;
  background:rgba(102,182,161,.055);
  strong{display:block;color:#66b6a1;font-size:.67rem;}
  p{margin:8px 0 0;color:#e1e6e8;font-size:.94rem;font-weight:750;line-height:1.65;}
`;

const Sources = styled.footer`
  padding:20px;
  border:1px solid rgba(177,190,197,.12);
  background:#0a1115;
  >strong{display:block;color:#dce2e4;font-size:.75rem;}
  >p{margin:13px 0 0;color:#6f7d84;font-size:.64rem;line-height:1.65;}
`;

const SourceLinks = styled.div`
  display:flex;
  flex-wrap:wrap;
  gap:8px 14px;
  margin-top:11px;
`;

const ExternalAnchor = styled.a`
  display:inline-flex;
  align-items:center;
  gap:5px;
  color:#9ba8ad;
  font-size:.68rem;
  font-weight:700;
  &:hover{color:#f0f3f4;}
`;

const SkillAnchor = styled.a`
  display:inline-flex;
  align-items:center;
  gap:4px;
  max-width:100%;
  color:#e2b565;
  font-weight:750;
  vertical-align:-3px;
  img{flex:0 0 18px;width:18px;height:18px;border:1px solid rgba(255,255,255,.2);}
  span{min-width:0;}
  &:hover{color:#ffd58b;}
`;

const SkillFallback = styled.span`
  flex:0 0 18px;
  width:18px;
  height:18px;
  border:1px solid rgba(215,154,91,.45);
  background:#131c21;
`;

const ResponsiveStyles = createGlobalStyle`
@media(max-width:1080px){
  ${HeroGrid}{grid-template-columns:1fr;gap:28px;}
  ${HeroVerdict}{max-width:760px;}
  ${SnapshotStrip}{grid-template-columns:repeat(2,minmax(0,1fr));}
  ${SnapshotItem}:nth-child(2){border-right:0;}
  ${SnapshotItem}:nth-child(-n+2){border-bottom:1px solid rgba(177,190,197,.1);}
  ${ReportLayout}{grid-template-columns:1fr;gap:34px;padding-top:0;}
  ${ReportNav}{position:sticky;top:58px;z-index:5;display:flex;overflow-x:auto;background:#080d10;border-bottom:1px solid rgba(177,190,197,.12);}
  ${NavLink}{flex:0 0 auto;padding:12px 13px;border-left:0;}
  ${TwoColumn}{grid-template-columns:1fr;}
  ${Flow}{grid-template-columns:1fr;gap:7px;}
  ${FlowArrow}{transform:rotate(90deg);}
}

@media(max-width:720px){
  ${Hero}{padding:26px 18px 30px;background-size:48px 48px;}
  ${HeroTop}{align-items:flex-start;margin-bottom:30px;}
  ${Snapshot}{max-width:150px;text-align:right;line-height:1.5;}
  ${Title}{font-size:2rem;line-height:1.22;}
  ${Lead}{font-size:.85rem;line-height:1.78;}
  ${HeroVerdict}{padding:16px 0 16px 14px;}
  ${SnapshotStrip},${ReportLayout}{width:calc(100% - 28px);}
  ${SnapshotStrip}{grid-template-columns:1fr;}
  ${SnapshotItem}{padding:17px 12px;border-right:0;border-bottom:1px solid rgba(177,190,197,.1);}
  ${SnapshotItem}:last-child{border-bottom:0;}
  ${ReportLayout}{padding-bottom:56px;}
  ${Section}{margin-bottom:44px;padding-bottom:44px;}
  ${SectionTitle}{font-size:1.18rem;}
  ${SectionLead},${BodyCopy}{font-size:.8rem;line-height:1.78;}
  ${MethodGrid},${CauseRail},${GearGrid},${InsightGrid},${DecisionGrid},${NoBlameGrid}{grid-template-columns:1fr;}
  ${MethodNote},${Insight}{border-right:0;border-bottom:1px solid rgba(177,190,197,.1);}
  ${MethodNote}:last-child,${Insight}:last-child{border-bottom:0;}
  ${BossRow}{grid-template-columns:minmax(0,1fr) 64px 58px;gap:10px;}
  ${BossRow} ${Meter}{grid-column:1 / -1;grid-row:2;}
  ${BossScore}{justify-self:end;}
  ${BossDps}{font-size:.65rem;}
  ${TimelineRow}{grid-template-columns:78px minmax(0,1fr);gap:10px;}
  ${TimelineScale}{margin-left:88px;}
  ${DamageRow}{grid-template-columns:128px minmax(0,1fr);padding:10px 9px;}
  ${Priority}{grid-template-columns:32px minmax(0,1fr);padding:15px 12px;gap:10px;}
}
`;

export default BalanceDruidNormalLogReportPage;
