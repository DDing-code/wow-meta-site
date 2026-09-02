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
    casts: '156회',
    mana: '약 90%',
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
    casts: '193회',
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
    casts: '190회',
    mana: '약 53%',
    overheal: '34.0%',
    tier: '12.1 티어 4세트',
    tone: '#8d99a2',
  },
];

const castRows = [
  { ids: ['2061', '1262763'], name: '순간 치유 계열', detail: '순간 치유 + 축도', target: '91 (36 + 55)', peer: '116 (52 + 64)', top: '115 (57 + 58)' },
  { ids: ['2050'], name: '빛의 권능: 평온', target: '29', peer: '37', top: '37' },
  { ids: ['33076'], name: '회복의 기원', target: '36', peer: '40', top: '38' },
  { ids: [], name: '핵심 회전 합계', detail: '위 세 행 합계', target: '156', peer: '193', top: '190' },
];

const valueRows = [
  { ids: ['2061', '1262763'], name: '순간 치유 계열', target: '82.8k', peer: '71.7k', top: '95.4k' },
  { ids: ['2050'], name: '빛의 권능: 평온', target: '330.1k', peer: '277.9k', top: '349.8k' },
  { ids: ['33076'], name: '회복의 기원', target: '275.7k', peer: '248.8k', top: '284.4k' },
];

const oracleRows = [
  { ids: ['33076'], name: '회복의 기원 전체', target: '9.93M', peer: '9.95M', verdict: '거의 동일' },
  { ids: ['1246799'], name: '즉발적인 예측', target: '4.29M', peer: '4.03M', verdict: '대상이 더 높음' },
  { ids: [], name: '예언자 보호막', target: '1.46M', peer: '1.46M', verdict: '동일' },
  { ids: ['1246802'], name: '경건', target: '4.44M', peer: '4.66M', verdict: '근소한 차이' },
];

const apotheosisRows = [
  ['조나사제 1차', '35.1–67.1초', '31.21M', '6', '9', '방해 없음'],
  ['조나사제 2차', '230.4–262.4초', '30.93M', '2', '8', '찬가 + 활공 4회'],
  ['잠실 1차', '0.9–32.9초', '28.68M', '8', '15', '방해 없음'],
  ['잠실 2차', '121.0–153.0초', '51.15M', '8', '17', '방해 없음'],
];

const goals = [
  ['종료 마나', '고정값 대신 막판까지 사용'],
  ['순간 치유 계열', '110회 전후'],
  ['빛의 권능: 평온', '35회 이상'],
  ['회복의 기원', '38–40회'],
  ['축도 2중첩 장기 보유', '5초 이상 구간 줄이기'],
  ['32초 절정 평온', '6–8회'],
  ['절정 중 이동 공백', '0회'],
  ['쿨다운 계획', '전투 전 3구간 지정'],
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

function SpellLabel({ ids = [], name, detail }) {
  return (
    <span>
      {ids.length > 0
        ? ids.map((id, index) => (
          <React.Fragment key={id}>
            {index > 0 && ' + '}
            <SkillLink id={id}>{ids.length === 1 ? name : undefined}</SkillLink>
          </React.Fragment>
        ))
        : <strong>{name}</strong>}
      {detail && <small>{detail}</small>}
    </span>
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
              WCL 시전·자원·버프 이벤트를 다시 추출해 같은 공격대 신성 사제를 1차 기준으로 비교했습니다.
              99점 로그는 티어와 힐러 수가 달라 정답지가 아니라 가능한 상한을 확인하는 용도로만 사용했습니다.
            </Lead>
          </div>
          <HeroVerdict>
            <Target size={21} aria-hidden="true" />
            <div>
              <span>한 줄 진단</span>
              <strong>예언자 운용은 정상이고, 핵심 회전량과 두 번째 절정 배치에서 손실이 났습니다</strong>
              <p>축도를 합친 순간 치유 계열은 91회, 핵심 회전은 156회, 종료 마나는 약 90%입니다.</p>
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
              <Stat><span>핵심 회전</span><strong>{log.casts}</strong></Stat>
              <Stat><span>종료 마나</span><strong>{log.mana}</strong></Stat>
              <Stat><span>과치유</span><strong>{log.overheal}</strong></Stat>
              <Stat><span>티어</span><strong>{log.tier}</strong></Stat>
            </Stats>
          </Summary>
        ))}
      </SummaryGrid>

      <ReportLayout>
        <ReportNav aria-label="분석 목차">
          <NavLink href="#verdict">01 판독 결과</NavLink>
          <NavLink href="#casts">02 핵심 회전</NavLink>
          <NavLink href="#oracle">03 예언자 판독</NavLink>
          <NavLink href="#apotheosis">04 절정 구간</NavLink>
          <NavLink href="#benediction">05 축도 중첩</NavLink>
          <NavLink href="#talent">06 특성 판독</NavLink>
          <NavLink href="#resource">07 자원·사망</NavLink>
          <NavLink href="#fix">08 수정 사이클</NavLink>
        </ReportNav>

        <Article>
          <Section id="verdict">
            <SectionHeading number="01 · 재판독 결과" title="잘된 부분과 고칠 부분이 분명합니다" icon={RotateCw} />
            <CauseRail>
              <Cause><b>01 · 집계 교정</b><strong>순간 치유 계열 91회</strong><span>순간 치유 36회와 변환된 축도 55회를 합쳐야 합니다.</span></Cause>
              <Cause><b>02 · 확인</b><strong>핵심 회전 37회 부족</strong><span>156회로 같은 공대의 193회보다 19.2% 적습니다.</span></Cause>
              <Cause><b>03 · 확인</b><strong>2차 절정 평온 2회</strong><span>찬가와 이동이 겹쳐 32초 구간을 충분히 쓰지 못했습니다.</span></Cause>
              <Cause><b>04 · 확인</b><strong>마나 최저 78.8%</strong><span>두 번째 절정 전에는 다시 100%까지 회복했습니다.</span></Cause>
            </CauseRail>
            <Finding>
              <strong>정상 작동</strong>
              <p>
                핵심 주문 1회당 유효 치유는 같은 공대 사제보다 높고, 예언자 보조 치유도 거의 같은 수준입니다.
                대상 선택이나 영웅 특성보다 피해가 이어질 때 주문을 더 자주 연결하고, 절정을 이동이 끝난 구간에 여는 것이 먼저입니다.
              </p>
            </Finding>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p><strong>판독 기준:</strong> 원시 이벤트로 직접 확인한 사실, 비교 로그에서 얻은 해석, 원인 확정이 불가능한 사망을 구분했습니다. 이전 보고서의 ‘천상의 권능 미사용’ 판정은 삭제된 기술을 현재 특성으로 잘못 읽은 오류였습니다.</p>
            </Caution>
          </Section>

          <Section id="casts">
            <SectionHeading number="02 · 핵심 회전" title="한 번은 잘 넣었지만 연결 횟수가 적었습니다" icon={BarChart3} />
            <SectionLead>
              12.1에서는 <SkillLink id="2050" /> 뒤의 <SkillLink id="2061" />가 <SkillLink id="1262763" />로 변환됩니다.
              WCL은 두 이름을 따로 기록하므로 반드시 합쳐야 하며, 합산하면 대상의 순간 치유 계열은 91회입니다.
            </SectionLead>
            <TableScroll>
              <CompareTable aria-label="핵심 주문 시전 횟수 비교">
                <thead><tr><th>주문</th><th>조나사제</th><th>같은 공대</th><th>99점</th></tr></thead>
                <tbody>
                  {castRows.map(row => (
                    <tr key={row.name}>
                      <td><SpellLabel ids={row.ids} name={row.name} detail={row.detail} /></td>
                      <td>{row.target}</td><td>{row.peer}</td><td>{row.top}</td>
                    </tr>
                  ))}
                </tbody>
              </CompareTable>
            </TableScroll>
            <Subhead>주문 1회당 유효 치유</Subhead>
            <TableScroll>
              <CompareTable aria-label="주문 1회당 유효 치유 비교">
                <thead><tr><th>주문</th><th>조나사제</th><th>같은 공대</th><th>99점</th></tr></thead>
                <tbody>{valueRows.map(row => (
                  <tr key={row.name}>
                    <td><SpellLabel ids={row.ids} name={row.name} /></td>
                    <td>{row.target}</td><td>{row.peer}</td><td>{row.top}</td>
                  </tr>
                ))}</tbody>
              </CompareTable>
            </TableScroll>
            <Finding>
              <strong>수치 해석</strong>
              <p>세 계열 합계는 156회로 같은 공대보다 37회 적습니다. 반대로 1회당 유효 치유는 세 계열 모두 같은 공대보다 높습니다. 따라서 ‘대상을 잘못 골랐다’보다 피해가 이어질 때 회전을 끊은 시간이 더 큰 관찰 차이입니다.</p>
            </Finding>
          </Section>

          <Section id="oracle">
            <SectionHeading number="03 · 예언자 판독" title="영웅 특성 메커니즘은 제대로 작동했습니다" icon={ListChecks} />
            <SectionLead>
              <SkillLink id="33076" />은 대상 36회, 같은 공대 40회였지만 관련 치유 총량은 9.93M과 9.95M으로 거의 같습니다.
              <SkillLink id="1246799" />은 오히려 대상이 더 높아, 예언자 빌드 자체를 이번 로그의 원인으로 볼 근거가 없습니다.
            </SectionLead>
            <TableScroll>
              <CompareTable aria-label="예언자 관련 유효 치유 비교">
                <thead><tr><th>효과</th><th>조나사제</th><th>같은 공대</th><th>판정</th></tr></thead>
                <tbody>{oracleRows.map(row => (
                  <tr key={row.name}>
                    <td><SpellLabel ids={row.ids} name={row.name} /></td>
                    <td>{row.target}</td><td>{row.peer}</td><td>{row.verdict}</td>
                  </tr>
                ))}</tbody>
              </CompareTable>
            </TableScroll>
            <Finding>
              <strong>운영 판단</strong>
              <p>영웅 특성을 바꾸기보다 회복의 기원 충전이 2개에서 멈추지 않게 하고, 이미 잘 나온 예언자 보조 치유를 유지하면 됩니다. 이번 로그에서 먼저 고칠 것은 예언자가 아니라 절정과 평온 회전입니다.</p>
            </Finding>
          </Section>

          <Section id="apotheosis">
            <SectionHeading number="04 · 절정 구간" title="두 번째 절정이 이동과 찬가 사이에 끼었습니다" icon={Sparkles} />
            <SectionLead>
              대상은 <SkillLink id="1215245" />을 선택해 <SkillLink id="200183" />이 20초가 아니라 32초 지속됩니다.
              첫 구간은 평온 6회로 기능했지만, 두 번째는 평온 2회에 그쳤습니다.
            </SectionLead>
            <TableScroll>
              <CompareTable aria-label="절정 구간 비교">
                <thead><tr><th>구간</th><th>시간</th><th>공대 피해</th><th>평온</th><th>순간 치유 계열</th><th>방해 요소</th></tr></thead>
                <tbody>{apotheosisRows.map(row => <tr key={row[0]}>{row.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody>
              </CompareTable>
            </TableScroll>
            <Timeline aria-label="두 번째 절정 구간 타임라인">
              <TimeEvent><time>218.0초</time><strong>축도 2중첩</strong><span>최대 중첩 진입</span></TimeEvent>
              <TimeEvent $bad><time>226.7초</time><strong>평온</strong><span>2중첩에서 사용</span></TimeEvent>
              <TimeEvent><time>230.4초</time><strong>절정</strong><span>32초 시작</span></TimeEvent>
              <TimeEvent><time>231.6초</time><strong>천상의 찬가</strong><span>채널링 시작</span></TimeEvent>
              <TimeEvent $bad><time>237.0초</time><strong>평온</strong><span>여전히 2중첩</span></TimeEvent>
              <TimeEvent><time>239.4초</time><strong>첫 축도</strong><span>중첩 소비 시작</span></TimeEvent>
              <TimeEvent $bad><time>249.8–261.7초</time><strong>핵심 회전 공백</strong><span>활공 4회 뒤 회복의 기원</span></TimeEvent>
              <TimeEvent><time>262.4초</time><strong>절정 종료</strong><span>평온 총 2회</span></TimeEvent>
            </Timeline>
            <WindowCompare>
              <Window $bad>
                <span>실제 2차 절정</span>
                <strong>축도 2중첩 → 절정 → 천상의 찬가 → 평온 → 이동</strong>
                <p>249.8초부터 261.7초까지 세 핵심 주문이 없었습니다. 32초 버프의 약 12초가 이동 구간과 겹쳤습니다.</p>
              </Window>
              <Window>
                <span>다음 시도</span>
                <strong>이동 종료 확인 → 남은 축도 소비 → 절정 → 평온·축도 반복</strong>
                <p>찬가를 절정과 무조건 분리할 필요는 없지만, 둘을 겹치면 평온 회전 시간이 줄어듭니다. 공대 배정이 없다면 서로 다른 피해 구간에 두는 편이 낫습니다.</p>
              </Window>
            </WindowCompare>
            <Finding>
              <strong>횟수 계획</strong>
              <p>같은 공대 사제는 0.9초, 121.0초에 두 번을 완주하고 288.7초에 마지막 부분 구간까지 열었습니다. 대상은 35.1초와 230.4초 두 번뿐이므로, 전투 전부터 세 번째 짧은 절정까지 포함해 사용할 시점을 정해 두는 편이 좋습니다.</p>
            </Finding>
          </Section>

          <Section id="benediction">
            <SectionHeading number="05 · 축도 중첩" title="중첩 비율보다 긴 방치 구간을 고쳐야 합니다" icon={Gauge} />
            <SectionLead>
              <SkillLink id="1262763" /> 2중첩 시간은 대상 28.6%, 같은 공대 13.9%, 99점 23.8%입니다.
              99점도 2중첩 시간이 길었으므로 비율 하나만으로 실수를 판정하면 안 됩니다. 대상 로그에서 확실한 문제는 19.8초와 21.4초 동안 중첩을 들고 있었던 두 구간입니다.
            </SectionLead>
            <StackRows>
              <StackRow><span>조나사제</span><Track><Fill $width="28.6%" $tone="#d49a58" /></Track><strong>28.6%</strong></StackRow>
              <StackRow><span>같은 공대</span><Track><Fill $width="13.9%" $tone="#75bda9" /></Track><strong>13.9%</strong></StackRow>
              <StackRow><span>99점</span><Track><Fill $width="23.8%" $tone="#8d99a2" /></Track><strong>23.8%</strong></StackRow>
            </StackRows>
            <Notes>
              <Note><strong>긴 보유 2회</strong><p>161.0–180.9초에 19.8초, 218.0–239.4초에 21.4초 동안 2중첩을 유지했습니다. 첫 구간은 활공 4회와, 두 번째는 절정 진입과 겹쳤습니다.</p></Note>
              <Note><strong>최대 중첩 평온 5회</strong><p>대상 5회, 같은 공대 3회, 99점 4회입니다. 특히 226.7초와 237.0초 평온은 두 번째 절정의 중첩 공간을 줄인 장면으로 확인됩니다.</p></Note>
            </Notes>
            <Caution>
              <CircleAlert size={18} aria-hidden="true" />
              <p>버프 갱신 이벤트 하나를 축도 1회 손실로 환산하지 않았습니다. 실제 피해가 없으면 중첩을 들고 있는 것이 맞을 수 있으므로, 5초 이상 보유와 그 사이의 평온 사용을 함께 확인해야 합니다.</p>
            </Caution>
          </Section>

          <Section id="talent">
            <SectionHeading number="06 · 특성 판독" title="작별의 한마디는 액티브 기술이 아닙니다" icon={ListChecks} />
            <SectionLead>
              12.1 현재 ‘천상의 권능’은 삭제된 기술입니다. 대상이 고른 것은 <SkillLink id="471504" />이며,
              평온 사용 시 12초 소생을 부여하는 패시브라 별도 시전 이벤트가 없는 것이 정상입니다.
            </SectionLead>
            <ChoiceGrid>
              <Choice><strong>대상: 작별의 한마디</strong><p>소생 유효 치유는 7.82M이지만 다른 소생 발생원도 포함되므로 이 수치를 특성 기여량으로 단정할 수 없습니다. 평온을 자주 돌릴수록 간접 가치가 늘어납니다.</p></Choice>
              <Choice><strong>같은 공대: 신성한 환영</strong><p><SkillLink id="392988" /> 치유는 2.95M이었습니다. 두 선택 모두 현재 특성이며, 이번 비교만으로 대상의 선택을 잘못됐다고 판정할 수 없습니다.</p></Choice>
            </ChoiceGrid>
            <Finding>
              <strong>정정</strong>
              <p>이전 보고서의 ‘천상의 권능을 선택하고 한 번도 누르지 않았다’는 결론은 전면 취소합니다. 원인은 구버전 KB 항목과 WCL 특성 엔트리를 이름만으로 연결한 것이며, 현재 KB에서는 해당 삭제 기술과 연결을 제거했습니다.</p>
            </Finding>
          </Section>

          <Section id="resource">
            <SectionHeading number="07 · 자원과 사망" title="마나는 남았지만 사망을 모두 힐 문제로 볼 수는 없습니다" icon={CircleAlert} />
            <Notes>
              <Note><strong>마나 곡선</strong><p>대상은 전투 중 확인된 최저 마나가 78.8%였고, 두 번째 절정 전에는 100%로 회복했습니다. 마지막 주문 비용까지 반영하면 종료 직전은 약 90%입니다. 같은 공대 사제는 최저 43.9%, 종료 47.1%였습니다.</p></Note>
              <Note><strong>고정 종료 마나는 목표가 아님</strong><p>힐 배정과 막판 피해에 따라 종료 마나는 달라집니다. 40%나 50% 같은 숫자를 맞추기보다, 실제 피해가 남아 있는 동안 순간 치유 계열과 평온 회전을 끊지 않는 것을 목표로 둡니다.</p></Note>
              <Note><strong>114.5–119.5초 사망 3명</strong><p>닭모가지와 물떡법사는 Spectral Coils로 동시에 사망했고, 디펜더님의 마지막 피해 주문은 로그에서 특정되지 않았습니다. 개인 힐 실수 여부는 판정 보류입니다.</p></Note>
              <Note><strong>248.0초 사망 1명</strong><p>노란색원꾼의 마지막 피해는 Necrotic Vapors입니다. 대상은 생존했고 <SkillLink id="586">소실</SkillLink> 4회, <SkillLink id="19236">구원의 기도</SkillLink> 1회를 사용했습니다.</p></Note>
              <Note><strong>같은 공대 비교가 우선</strong><p>잠실은 아이템 레벨이 15 낮고 현재 티어 세트가 없지만 핵심 회전은 193회였습니다. 장비 차이로 설명하기 어려운 운영 차이를 보는 기준으로 적합합니다.</p></Note>
              <Note><strong>99점은 상한 참고</strong><p>남극여행은 5힐 구성에 12.1 티어 4세트입니다. 소생 15.81M 등 세트 영향을 받는 총량은 대상과 직접 비교하지 않았습니다.</p></Note>
            </Notes>
          </Section>

          <Section id="fix">
            <SectionHeading number="08 · 다음 로그 수정안" title="외울 것은 여섯 단계면 충분합니다" icon={CheckCircle2} />
            <CycleRail>
              <Cycle><b>01</b><SkillLink id="200183" /><span>전투 전 두 번의 완주 구간과 마지막 짧은 구간까지 세 곳을 정합니다.</span></Cycle>
              <Cycle><b>02</b><SkillLink id="33076" /><span>피해 전에 보내고 2충전에서 오래 멈추지 않게 합니다.</span></Cycle>
              <Cycle><b>03</b><SkillLink id="1262763" /><span>절정 전 2중첩이면 실제 피해 대상에게 먼저 소비합니다.</span></Cycle>
              <Cycle><b>04</b><SkillLink id="2050" /><span>이동이 끝난 뒤 절정을 열고 평온부터 사용합니다.</span></Cycle>
              <Cycle><b>05</b><SkillLink id="1262763" /><span>생성된 축도를 소비하고 순간 치유 계열로 다음 평온을 당깁니다.</span></Cycle>
              <Cycle><b>06</b><SkillLink id="2050" /><span>이동 중에는 즉시 시전을 쓰고 멈추자마자 회전을 재개합니다.</span></Cycle>
            </CycleRail>
            <WindowCompare>
              <Window>
                <span>축도 0–1중첩</span>
                <strong>절정 → 평온 → 축도 → 순간 치유 계열 → 평온</strong>
                <p>피해량과 대상 체력에 따라 회복의 기원을 사이에 넣습니다. 정해진 매크로가 아니라 평온 재사용 대기시간을 계속 줄이는 흐름입니다.</p>
              </Window>
              <Window>
                <span>축도 2중첩</span>
                <strong>축도 1–2회 소비 → 절정 → 평온 → 새 축도 소비</strong>
                <p>쓸 대상이 없으면 억지로 과치유하지 말고 절정 시작을 실제 피해 직전으로 옮깁니다.</p>
              </Window>
            </WindowCompare>
            <Goals>
              {goals.map(([label, value]) => <Goal key={label}><CheckCircle2 size={16} aria-hidden="true" /><span>{label}</span><strong>{value}</strong></Goal>)}
            </Goals>
            <FinalVerdict>
              <strong>고칠 순서</strong>
              <span>절정 3구간 계획 → 순간 치유 계열 110회 전후 → 평온 35회 이상 → 5초 넘는 축도 2중첩 → 막판 마나 사용 순서로 봅니다. 예언자 총량과 대상 선택은 현재 수준을 유지하면 됩니다.</span>
            </FinalVerdict>
          </Section>

          <Sources>
            <strong>분석 자료</strong>
            <SourceLink href="https://www.warcraftlogs.com/reports/jFKp1nY6zMcJkX3L?fight=45&type=casts&source=32">조나사제 원본 로그</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/jFKp1nY6zMcJkX3L?fight=45&type=healing&source=13">같은 공대 비교</SourceLink>
            <SourceLink href="https://www.warcraftlogs.com/reports/7df4Rg2YJHv9VbDj?fight=51&type=healing&source=617">조건 근접 99점 로그</SourceLink>
            <SourceLink href="https://worldofwarcraft.blizzard.com/ko-kr/news/24293281">블리자드 12.1 패치 노트</SourceLink>
            <SourceLink href="https://www.wowhead.com/guide/classes/priest/holy/rotation-cooldowns-pve-healer">Wowhead 12.1 운용</SourceLink>
            <SourceLink href="https://www.wowhead.com/guide/classes/priest/holy/talent-builds-pve-healer">Wowhead 12.1 특성</SourceLink>
            <SourceLink href="https://www.icy-veins.com/wow/holy-priest-pve-healing-rotation-cooldowns-abilities">Icy Veins 12.1 운용</SourceLink>
            <SourceLink href="https://www.method.gg/guides/holy-priest/playstyle-and-rotation">Method 12.1 운용</SourceLink>
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
const Title = styled.h1`margin-top:8px; color:#f2f4f5; font-size:clamp(1.9rem, 5vw, 3.55rem); line-height:1.08; letter-spacing:0; word-break:keep-all; overflow-wrap:break-word;`;
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
const SectionTitle = styled.h2`margin-top:3px; color:#f1f3f4; font-size:clamp(1.2rem,2.6vw,1.7rem); line-height:1.3; word-break:keep-all; overflow-wrap:break-word;`;
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
  th,td{padding:11px 12px; text-align:right; border-bottom:1px solid rgba(168,178,188,.12);} th:first-child,td:first-child{text-align:left;} th{color:#7d8991;font-size:.65rem;font-weight:700;} td{color:#cfd6da;} td small{display:block;margin-top:4px;color:#718089;font-size:.61rem;} tbody tr:hover{background:rgba(117,189,169,.035);}
`;
const Subhead = styled.h3`margin:24px 0 8px; color:#aeb8bd; font-size:.78rem;`;
const StackRows = styled.div`display:grid; gap:12px;`;
const StackRow = styled.div`display:grid; grid-template-columns:90px minmax(80px,1fr) 50px; gap:10px; align-items:center; span{color:#87949c;font-size:.72rem;} strong{color:#dfe4e7;font-size:.74rem;text-align:right;}`;
const Track = styled.div`height:7px; background:rgba(168,178,188,.1);`;
const Fill = styled.div`width:${p => p.$width};height:100%;background:${p => p.$tone};`;
const Timeline = styled.div`
  display:grid; grid-template-columns:repeat(auto-fit,minmax(118px,1fr)); margin-top:24px; border-top:2px solid #4c5961;
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
