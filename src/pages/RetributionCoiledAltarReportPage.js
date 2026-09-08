import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import report from '../data/retributionCoiledAltarReport.json';
import kb from '../data/kb-skills.json';
import LogReportSidebarList from '../components/LogReportSidebarList.js';

const spellIds = [31884,343527,375576,255937,24275,184575,20271,383328,53385,431377,431425,267344,10060,409311,395152,407067,445200,498];
const namedSkills = spellIds.map(id => kb.skills[id]).filter(Boolean).sort((a,b) => b.koreanName.length-a.koreanName.length);
const namePattern = new RegExp(`(${namedSkills.map(s => s.koreanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
const byName = new Map(namedSkills.map(s => [s.koreanName,s]));
const time = seconds => `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;

function Skill({ id }) {
  const skill = kb.skills[id];
  return <Spell href={`https://ko.wowhead.com/spell=${id}`} data-wowhead={`spell=${id}&domain=ko`} target="_blank" rel="noreferrer">
    <img src={skill.iconUrls?.small || skill.iconUrl} width="17" height="17" alt="" loading="lazy" />{skill.koreanName}
  </Spell>;
}
function Text({ children }) {
  return children.split(namePattern).map((part,i) => byName.has(part) ? <Skill key={i} id={byName.get(part).id} /> : part);
}
function Table({ caption, headers, rows }) {
  return <TableScroll tabIndex={0} aria-label={caption}><table><caption>{caption}</caption><thead><tr>{headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th key={j} scope="row">{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></TableScroll>;
}
function Figure({ section }) {
  const [a,b] = report.players;
  if (section==='conditions') return <>
    <Table caption="전투 시작 시 능력치 평점 · 퍼센트가 아닙니다" headers={['능력치',a.name,b.name]} rows={['힘','치명타','가속','특화','유연성'].map((n,i)=>[n,a.stats[i],b.stats[i]])} />
    <Table caption="버프 가동 시간 · 초" headers={['효과',a.name,b.name,'해석']} rows={report.buffs.map(r=>[<Text>{r.name}</Text>,r.a.toFixed(1),r.b.toFixed(1),<Text>{r.note}</Text>])} />
  </>;
  if (section==='cooldowns') return <>
    <figure><figcaption>응징의 격노 직접 시전 · 공통 8분 축</figcaption>{report.players.map((p,i)=><Timeline key={p.name} $reference={i===1}><strong>{p.name}</strong><div role="img" aria-label={`${p.name}: ${p.wings.map(time).join(', ')}`}>{p.wings.map((t,j)=><i key={t} style={{left:`${t/480*100}%`}} title={`${j+1}회: ${t.toFixed(3)}초`} />)}</div><small>{p.wings.map(time).join(' · ')}</small></Timeline>)}</figure>
    <Table caption="선택된 배우의 cast 이벤트 · 분당 횟수는 전투 길이로 보정" headers={['기술',a.name,b.name,'분당 횟수 A / B']} rows={report.casts.map(r=>[<Skill id={r.id}/>,`${r.a}회`,`${r.b}회`,`${(r.a*60/a.duration).toFixed(2)} / ${(r.b*60/b.duration).toFixed(2)}`])} />
    <Note>자동 발동이 기록되는 기술도 있어 전체 cast 합계를 손으로 누른 횟수로 읽으면 안 됩니다.</Note>
  </>;
  if (section==='opener') return <Opener>{report.players.map((p,i)=><div key={p.name}><h3>{p.name}</h3><ol>{report.opener[i].map((s,j)=><li key={j}><time>{s.t.toFixed(2)}초</time><Skill id={s.id}/></li>)}</ol></div>)}<Note>전투 시작 기준. 공격 순서 비교를 위해 자동 공격·장신구·물약은 이 도표에서 생략했습니다. 전체 입력 기록이 아닌 선별된 오프닝입니다.</Note></Opener>;
  if (section==='resources') return <Table caption="신성한 힘 이벤트 · 자동 생성 포함" headers={['항목',a.name,b.name]} rows={[
    ['생성 시도',report.resources.a.generated,report.resources.b.generated],
    ['낭비',report.resources.a.waste,report.resources.b.waste],
    ['낭비 비율',...['a','b'].map(key=>`${(report.resources[key].waste/report.resources[key].generated*100).toFixed(1)}%`)],
    [<Text>파멸의 재</Text>,report.resources.a.wakeWaste,report.resources.b.wakeWaste]
  ]}/>;
  if (section==='targets') return <Table caption="적 대상 원시 유효 피해 · 흡수량 제외, 랭킹 DPS와 집계 기준이 다름" headers={['대상',a.name,b.name,'분당 피해 A / B']} rows={report.targets.map(r=>[r.name,`${(r.a/1e6).toFixed(2)}M`,`${(r.b/1e6).toFixed(2)}M`,`${(r.a/a.duration*60/1e6).toFixed(2)}M / ${(r.b/b.duration*60/1e6).toFixed(2)}M`])}/>;
  return null;
}
export default function RetributionCoiledAltarReportPage() {
  useEffect(()=>{ document.title=`${report.title} | wowmeta`; window.scrollTo(0,0); },[]);
  return <Page>
    <header><Back to="/logs/paladin-retribution"><ArrowLeft size={16}/>징벌 성기사 로그 분석 목록</Back><Meta>12.1 · {report.encounter} · <time dateTime={report.date}>{report.date}</time></Meta><h1>{report.title}</h1><Lead>{report.verdict}</Lead>
      <Players>{report.players.map((p,i)=><article key={p.name} data-reference={i===1}><span>{i===0?'분석 대상':'비교 로그'}</span><h2>{p.name}</h2><strong>{(p.dps/1000).toFixed(1)}<small>k DPS</small></strong><p>전체 {p.rank}점 · 장비 구간 {p.ilvlRank}점</p><p>장비 {p.ilvl} · {time(p.duration)} · {p.raidSize}인 · 사망 {p.deaths}회</p></article>)}</Players>
      <Note>Uyrte가 약 15.4% 높습니다. 동일 장비·지원 조건에서 측정한 순수 운용 격차가 아닙니다.</Note>
    </header>
    <Layout><main>{report.sections.map((s,i)=><Section id={s.id} key={s.id}><SectionNumber>{String(i+1).padStart(2,'0')}</SectionNumber><h2>{s.title}</h2>{s.paragraphs.map((p,j)=><p key={j}><Text>{p}</Text></p>)}<Figure section={s.id}/></Section>)}
      <Section id="sources"><h2>원본과 참고 자료</h2>{report.sources.map(s=><Source key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title}<ExternalLink size={15}/></Source>)}<p>본문은 이 두 전투를 위한 분석이며 모든 징벌 성기사에게 동일한 특성과 수치를 권하는 가이드가 아닙니다.</p></Section>
    </main><Aside><nav aria-label="보고서 목차">{report.sections.map((s,i)=><a key={s.id} href={`#${s.id}`}><span>{String(i+1).padStart(2,'0')}</span>{s.title}</a>)}<a href="#sources">출처</a></nav><LogReportSidebarList/></Aside></Layout>
  </Page>;
}

const Page=styled.div`max-width:1260px;margin:auto;padding:36px 28px 80px;color:#dce2e5;line-height:1.85;overflow-wrap:anywhere;h1{font-size:32px;line-height:1.35;letter-spacing:0;margin:12px 0;}h2{font-size:23px;line-height:1.5;letter-spacing:0;}h3{font-size:18px;}p{margin:16px 0;word-break:keep-all;}figure{margin:24px 0;}figcaption{font-size:14px;color:#b8c3cb;margin-bottom:12px;}@media(max-width:600px){padding:24px 16px 60px;h1{font-size:26px;}h2{font-size:21px;}}`;
const Back=styled(Link)`display:inline-flex;align-items:center;gap:7px;color:#90c6b9;font-size:14px;`;
const Meta=styled.div`margin-top:25px;color:#b6a17b;font-size:13px;`;
const Lead=styled.p`max-width:860px;color:#bbc5ca;font-size:18px;`;
const Players=styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:28px;article{padding:22px;border:1px solid #3d4245;border-top:3px solid #d6a06a;background:#12181b;}article[data-reference=true]{border-top-color:#73c3ad;}h2{margin:4px 0;}strong{font-size:32px;}small{font-size:14px;margin-left:8px;font-weight:500;}span,p{font-size:14px;color:#a6b2b9;}p{margin:5px 0;}@media(max-width:540px){grid-template-columns:1fr;}`;
const Note=styled.div`color:#a5b5bf;font-size:14px;padding:14px 0;line-height:1.8;`;
const Layout=styled.div`display:grid;grid-template-columns:minmax(0,1fr) 240px;gap:40px;main{min-width:0;}@media(max-width:1050px){grid-template-columns:1fr;}`;
const Aside=styled.aside`align-self:start;position:sticky;top:90px;padding-top:36px;max-height:calc(100vh - 110px);overflow:auto;nav{display:grid;gap:10px;}nav a{font-size:13px;line-height:1.6;color:#aab8bf;padding:5px 0;}nav span{color:#d6a06a;margin-right:8px;}@media(max-width:1050px){position:static;max-height:none;grid-row:1;nav{grid-template-columns:repeat(2,minmax(0,1fr));}padding-top:20px;}@media(max-width:540px){nav{grid-template-columns:1fr;}}`;
const Section=styled.section`padding:34px 0;border-top:1px solid #2c353a;scroll-margin-top:90px;p{color:#bcc6cc;font-size:16px;}h2{margin:6px 0 22px;}`;
const SectionNumber=styled.span`color:#d6a06a;font-size:13px;font-weight:700;`;
const Spell=styled.a`color:#e6bc77;font-weight:600;white-space:normal;word-break:keep-all;img{display:inline-block;vertical-align:-3px;margin-right:4px;border-radius:2px;} &:hover{text-decoration:underline;}`;
const TableScroll=styled.div`overflow-x:auto;margin:24px 0;max-width:100%;table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.7;}caption{text-align:left;color:#a9b9c3;font-size:13px;margin-bottom:10px;}th,td{padding:12px 10px;border-bottom:1px solid #303a40;text-align:left;min-width:82px;vertical-align:top;}thead{background:#192125;}thead th{color:#d2bc99;}tbody th{font-weight:500;min-width:135px;}td{color:#b8c6cd;}td:last-child{min-width:145px;} &:focus-visible{outline:2px solid #73c3ad;}`;
const Timeline=styled.div`margin:16px 0;strong{font-size:14px;}div{position:relative;height:32px;margin:5px 8px 5px 0;background:#1e272c;border-bottom:1px solid #48545c;}i{position:absolute;top:7px;width:6px;height:18px;background:${p=>p.$reference?'#73c3ad':'#d6a06a'};}small{font-size:12px;color:#a8b6bd;}`;
const Opener=styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:24px;h3{color:#d6bc97;}ol{list-style:none;padding:0;margin:12px 0;}li{display:grid;grid-template-columns:66px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid #283339;font-size:14px;}time{color:#90a8b8;font-variant-numeric:tabular-nums;} ${Note}{grid-column:1/-1;}@media(max-width:600px){grid-template-columns:1fr;}`;
const Source=styled.a`display:flex;align-items:center;gap:10px;color:#8fc7ba;margin:12px 0;svg{flex-shrink:0;}`;
