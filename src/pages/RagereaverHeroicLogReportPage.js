import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import report from '../data/ragereaverHeroicReport.json';
import kb from '../data/kb-skills.json';
import LogReportSidebarList from '../components/LogReportSidebarList.js';

const bossNames = {3470:'네크잘리',3445:'매장된 파수꾼',3455:'바쉬니크',3497:'길 잃은 탐험가',3420:'스조라크',3421:'쌍둥이 송곳니',3429:'똬리의 제단',3492:'울라텍',3379:'님리사'};
const specNames = {Demonology:'악마',Destruction:'파괴'};
const byKey = new Map(report.fights.map(f => [f.key, f]));
const current = report.currentKeys.map(key => byKey.get(key));
const skillIds = [265187,104316,105174,264178,1276452,196277,428522,1276222,1122,442726,445468,80240,116858,17877,80353,10060,395152,409311];
const byName = new Map(skillIds.map(id => kb.skills[id]).filter(Boolean).map(s => [s.koreanName, s.id]));
const skillPattern = new RegExp(`(${[...byName.keys()].sort((a,b) => b.length-a.length).map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
const clock = seconds => `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
const date = value => new Date(value).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric'});
const logUrl = (f,type='casts') => `https://www.warcraftlogs.com/reports/${f.code}?fight=${f.fight}&source=${f.actor}&type=${type}`;
const kDps = n => `${(n/1000).toFixed(1)}k`;

function Skill({id}) {
  const s = kb.skills[id];
  return <Spell href={`https://www.wowhead.com/ko/spell=${id}`} data-wowhead={`spell=${id}&domain=ko`} target="_blank" rel="noreferrer"><img src={s.iconUrls.small} alt="" width="17" height="17" loading="lazy"/>{s.koreanName}</Spell>;
}
function Text({children}) {
  return children.split(skillPattern).map((part,i) => byName.has(part) ? <Skill key={i} id={byName.get(part)}/> : part);
}
function Table({caption,headers,rows}) {
  return <Scroll tabIndex={0} aria-label={caption}><table><caption>{caption}</caption><thead><tr>{headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=>j===0?<th key={j} scope="row">{c}</th>:<td key={j}>{c}</td>)}</tr>)}</tbody></table></Scroll>;
}
function Compare({index,ids}) {
  const comparison = report.comparisons[index];
  const a = byKey.get(comparison.subject), b = byKey.get(comparison.reference);
  return <>
    <Pair>{[a,b].map(f=><article key={f.key}><span>{f===a?'분석 대상':'비교 대상'} · {specNames[f.spec]}</span><h3>{f.name}</h3><strong>{kDps(f.dps)} <small>DPS</small></strong><p>장비 {f.ilvl} · {clock(f.duration)} · {f.raidSize}인 · {f.rank.toFixed(1)}점</p><a href={logUrl(f)} target="_blank" rel="noreferrer">원본 시전 기록 <ExternalLink size={13}/></a></article>)}</Pair>
    <Note>{comparison.note} 특성 선택·등급이 다른 항목은 각각 {comparison.talentDifferences.join('개 / ')}개입니다.</Note>
    <Table caption="본인의 성공 시전만 집계 · 괄호는 분당 횟수" headers={['기술',a.name,b.name]} rows={ids.map(id=>[<Skill id={id}/>,... [a,b].map(f=>`${f.counts[id]||0}회 (${((f.counts[id]||0)*60/f.duration).toFixed(2)})`)])}/>
  </>;
}
function BurstLines() {
  const fights = ['recent-65','oldAltar-93','refAltar-41'].map(k=>byKey.get(k));
  return <figure><figcaption>제단 3개 기록 · 같은 8분 10초 축</figcaption><Legend><span>보라색 선: 폭군 시전</span><span>붉은 영역: 사망 상태</span><span>초록 영역: 개인 시간 왜곡·영웅심</span></Legend>{fights.map(f=><Timeline key={f.key}><strong>{f.name} · {date(f.date)}</strong><div role="img" aria-label={`${f.name} ${date(f.date)} 폭군: ${f.cooldowns.filter(c=>c.id===265187).map(c=>clock(c.t)).join(', ')}`}>
    {f.deaths.map(d=><span key={d.t} className="death" style={{left:`${d.t/490*100}%`,width:`${((d.resurrect??f.duration)-d.t)/490*100}%`}}/>)}
    {f.buffs.filter(b=>[80353,32182,2825].includes(b.id)).flatMap(b=>b.bands.map(([start,end])=><span key={`${b.id}-${start}`} className="haste" style={{left:`${start/490*100}%`,width:`${(end-start)/490*100}%`}}/>))}
    {f.cooldowns.filter(c=>c.id===265187).map(c=><i key={c.t} title={`${clock(c.t)} · ${c.t.toFixed(3)}초`} style={{left:`${c.t/490*100}%`}}/>)}
  </div><small>{f.cooldowns.filter(c=>c.id===265187).map(c=>clock(c.t)).join(' · ')}</small></Timeline>)}<Note>사망과 강화 구간은 실제 이벤트 기준입니다. 회차가 같아도 같은 페이즈라는 뜻은 아닙니다.</Note></figure>;
}
function Figure({section}) {
  if(section==='altar')return <><EventList>{report.evidence.altar.map(e=><li key={e.t}><time>{clock(e.t)}<small>{e.t.toFixed(3)}초</small></time><span><Text>{e.label}</Text></span></li>)}</EventList><Source href={logUrl(byKey.get('recent-65'),'deaths')} target="_blank" rel="noreferrer">제단 사망 원본 <ExternalLink size={14}/></Source></>;
  if(section==='cooldowns') {
    const a=byKey.get('recent-65'),b=byKey.get('refAltar-41');
    return <><BurstLines/><Compare index={0} ids={[265187,104316,1276452,105174,196277]}/><Table caption="아르거스의 지배자 실제 구간 · 굴단의 손 + 황폐 성공 시전" headers={['회차','Ragereaver','디프니']} rows={Array.from({length:Math.max(a.argus.length,b.argus.length)},(_,i)=>[i+1,...[a,b].map(f=>f.argus[i]?`${clock(f.argus[i].start)} · ${f.argus[i].spenders}회`:'—')])}/></>;
  }
  if(section==='ulatek') {
    const a=byKey.get('ulatek-18'),b=byKey.get('refUlatek-17');
    return <><Compare index={1} ids={[265187,104316,1276452,105174,196277]}/><Table caption="적 대상별 WCL 피해 합계 · M = 백만" headers={['대상',a.name,b.name]} rows={['Ula\'tek','Venomous Heart','Blightscale Rawling','Weakened Doomscale'].map(name=>[name,...[a,b].map(f=>`${((f.targets[name]||0)/1e6).toFixed(2)}M`)])}/><Table caption="본인에게 관측된 외부 버프 · 초" headers={['효과',a.name,b.name]} rows={[['시간 왜곡','관측 없음','40.012'],['칠흑의 힘','관측 없음','543.534'],['예지','관측 없음','165.170']]}/></>;
  }
  if(section==='destruction')return <Compare index={2} ids={[1122,442726,80240,116858,17877]}/>;
  return null;
}

export default function RagereaverHeroicLogReportPage() {
  const [spec,setSpec]=useState('all');
  const [selected,setSelected]=useState('recent-65');
  const fight=byKey.get(selected);
  const cooldownId=fight.spec==='Demonology'?265187:1122;
  useEffect(()=>{document.title=`${report.title} | wowmeta`;window.scrollTo(0,0);},[]);
  const visible=current.filter(f=>spec==='all'||f.spec===spec);
  return <Page>
    <Back to="/logs"><ArrowLeft size={16}/>전체 로그 분석</Back>
    {report.verificationNotice && <Note role="note">{report.verificationNotice}</Note>}
    <header><Eyebrow>흑마법사 · 악마 / 파괴 · 12.1 · 2026.09.09 분석</Eyebrow><h1>{report.title}</h1><Lead>{report.lead}</Lead><Stats><div><span>9월 7일 처치</span><strong>7 / 8 <small>88점 이상</small></strong></div><div><span>제단 사망 상태</span><strong>52.6 <small>초</small></strong></div><div><span>울라텍 폭군</span><strong>9 / 9 <small>본인 / 비교</small></strong></div></Stats><p>{report.scope}</p></header>
    <Layout><div>
      <Section id="overview"><SectionNumber>01 · 전체 기록</SectionNumber><h2>보스별 성적과 운용을 구분해서 봅니다</h2>
        <Control>전문화 필터<select value={spec} onChange={e=>setSpec(e.target.value)}><option value="all">전체 전문화</option><option value="Demonology">악마</option><option value="Destruction">파괴</option></select></Control>
        <Table caption="선택한 최근 처치 · 점수는 처치 당시 백분위" headers={['보스','전문화','날짜 (한국)','DPS','당시 점수','장비','사망']} rows={visible.map(f=>[<a href={logUrl(f,'damage-done')} target="_blank" rel="noreferrer" title={`${bossNames[f.encounter]} 원본 로그`}>{bossNames[f.encounter]} ↗</a>,specNames[f.spec],date(f.date),kDps(f.dps),<Score $low={f.rank<50}>{f.rank.toFixed(1)}</Score>,f.ilvl,`${f.deaths.length}회`])}/>
        <Note>울라텍만 9월 2일 기록입니다. 최고 기록 평균이나 서로 다른 전문화의 중간값을 이번 공격대 성적으로 표시하지 않았습니다.</Note>
        <Control>상세 지표를 볼 보스<select value={selected} onChange={e=>setSelected(e.target.value)}>{current.map(f=><option key={f.key} value={f.key}>{bossNames[f.encounter]} · {specNames[f.spec]}</option>)}</select></Control>
        <Detail aria-live="polite"><h3>{bossNames[fight.encounter]} · {specNames[fight.spec]}</h3><p>{date(fight.date)} · {clock(fight.duration)} · {fight.raidSize}인 · {kDps(fight.dps)} DPS</p><p><Skill id={cooldownId}/> {fight.counts[cooldownId]||0}회: {fight.cooldowns.filter(c=>c.id===cooldownId).map(c=>clock(c.t)).join(' · ')}</p>{fight.spec==='Demonology'&&<p><Skill id={105174}/> {fight.counts[105174]||0}회 · <Skill id={428522}/> {fight.counts[434635]||0}회 · <Skill id={104316}/> {fight.counts[104316]||0}회</p>}<a href={logUrl(fight)} target="_blank" rel="noreferrer">이 전투의 시전 기록 <ExternalLink size={14}/></a></Detail>
      </Section>
      {report.sections.map((s,i)=><Section id={s.id} key={s.id}><SectionNumber>{String(i+2).padStart(2,'0')}</SectionNumber><h2>{s.title}</h2>{s.paragraphs.map((p,j)=><p key={j}><Text>{p}</Text></p>)}<Figure section={s.id}/></Section>)}
      <Section id="method"><SectionNumber>08 · 근거와 범위</SectionNumber><h2>집계 방식과 원본</h2><p>{report.method}</p><p>{report.limits}</p><details><summary>수치 검증 내역</summary><ul>{report.evidence.checks.map(c=><li key={c}>{c}</li>)}</ul></details>{report.sources.map(s=><Source key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title}<ExternalLink size={14}/></Source>)}<Note>비교 대상 3명의 개별 전투 링크는 각 비교 표 위에 있습니다. 조회 이후 WCL 현재 순위는 달라질 수 있습니다.</Note></Section>
    </div><Aside><nav aria-label="보고서 목차"><a href="#overview">01 전체 기록</a>{report.sections.map((s,i)=><a key={s.id} href={`#${s.id}`}>{String(i+2).padStart(2,'0')} {s.title.split(':')[0]}</a>)}<a href="#method">08 집계 방식과 출처</a></nav><Related><Link to="/logs/warlock-demonology">악마 로그 목록</Link><Link to="/logs/warlock-destruction">파괴 로그 목록</Link></Related><LogReportSidebarList/></Aside></Layout>
  </Page>;
}

const Page=styled.div`max-width:1260px;margin:auto;padding:36px 28px 80px;color:#dce2e5;line-height:1.85;overflow-wrap:anywhere;h1{font-size:clamp(28px,4vw,42px);line-height:1.3;letter-spacing:0;margin:12px 0;}h2{font-size:24px;line-height:1.5;letter-spacing:0;}h3{font-size:18px;margin:10px 0;}p{margin:16px 0;word-break:keep-all;}a:focus-visible,summary:focus-visible{outline:2px solid #aaa2e0;outline-offset:4px;}figure{margin:28px 0;}figcaption{font-size:14px;color:#bec8d0;margin-bottom:12px;}@media(max-width:600px){padding:24px 16px 60px;h2{font-size:21px;}}`;
const Back=styled(Link)`display:inline-flex;align-items:center;gap:7px;color:#b6b0e3;font-size:14px;`;
const Eyebrow=styled.p`color:#aaa2e0;font-size:13px;margin-top:24px!important;`;
const Lead=styled.p`max-width:900px;color:#c4cbd3;font-size:19px;`;
const Stats=styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin:28px 0;padding:20px 0;border-top:1px solid #343440;border-bottom:1px solid #343440;span{display:block;color:#a8a8ba;font-size:13px;}strong{font-size:30px;color:#e1dff1;}small{font-size:13px;font-weight:500;color:#aaa8ba;}@media(max-width:640px){grid-template-columns:1fr;gap:14px;}`;
const Layout=styled.div`display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:38px;>div{min-width:0;}@media(max-width:1050px){grid-template-columns:1fr;}`;
const Aside=styled.aside`align-self:start;position:sticky;top:90px;padding-top:36px;max-height:calc(100vh - 110px);overflow:auto;nav{display:grid;gap:10px;}nav a{font-size:13px;line-height:1.6;color:#b5b5ca;padding:5px 0;}@media(max-width:1050px){position:static;max-height:none;grid-row:1;nav{grid-template-columns:repeat(2,minmax(0,1fr));}padding-top:12px;}@media(max-width:540px){nav{grid-template-columns:1fr;gap:3px;}}`;
const Related=styled.div`display:flex;flex-wrap:wrap;gap:12px;margin-top:20px;font-size:12px;a{color:#aaa2e0;}`;
const Section=styled.section`padding:32px 0;border-top:1px solid #30343e;scroll-margin-top:88px;p{color:#bdc5ce;font-size:16px;}h2{margin:6px 0 22px;}summary{cursor:pointer;color:#c7c0f0;}li{color:#b8c2cd;font-size:14px;}`;
const SectionNumber=styled.span`color:#aaa2e0;font-size:13px;font-weight:700;`;
const Note=styled.div`color:#a7b2c2;font-size:14px;padding:12px 0;line-height:1.8;`;
const Control=styled.label`display:flex;align-items:center;flex-wrap:wrap;gap:12px;color:#c2bfd7;font-size:14px;margin:20px 0;select{max-width:100%;background:#19202b;color:#e2e4ef;border:1px solid #596071;border-radius:4px;padding:10px 12px;font:inherit;}select:focus-visible{outline:2px solid #aaa2e0;outline-offset:3px;}`;
const Scroll=styled.div`overflow-x:auto;margin:24px 0;max-width:100%;table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.7;}caption{text-align:left;color:#adb9c9;font-size:13px;margin-bottom:10px;}th,td{padding:12px 10px;border-bottom:1px solid #303a46;text-align:left;vertical-align:top;white-space:nowrap;}thead{background:#19212d;}thead th{color:#c6c0e3;}tbody th{font-weight:500;white-space:normal;min-width:130px;}td{color:#bac6d4;}a{color:#c6bef1;} &:focus-visible{outline:2px solid #aaa2e0;}`;
const Score=styled.strong`color:${p=>p.$low?'#f0b09b':'#bfafff'};font-variant-numeric:tabular-nums;`;
const Spell=styled.a`color:#cbc3ff;font-weight:600;word-break:keep-all;img{display:inline-block;vertical-align:-3px;margin-right:4px;border-radius:2px;} &:hover{text-decoration:underline;}`;
const Detail=styled.div`padding:16px 20px;border-left:3px solid #aaa2e0;background:#171d27;h3{color:#e1dcfa;}p{font-size:14px;margin:8px 0;}a{color:#bdb5ee;}svg{vertical-align:-2px;}`;
const Pair=styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:25px;article{padding:20px;border:1px solid #3c4050;border-top:3px solid #a99dd9;background:#141b24;}article+article{border-top-color:#73b7a3;}span,p{font-size:13px;color:#a9b5c3;}strong{font-size:29px;}small{font-size:13px;font-weight:400;}a{color:#bcb4e9;font-size:13px;}@media(max-width:540px){grid-template-columns:1fr;}`;
const EventList=styled.ol`list-style:none;padding:0;margin:24px 0;border-top:1px solid #383b49;li{display:grid;grid-template-columns:92px minmax(0,1fr);gap:15px;padding:12px 0;border-bottom:1px solid #303440;align-items:center;}time{color:#d3c4fa;font-weight:700;font-variant-numeric:tabular-nums;}small{display:block;color:#9aa7b8;font-size:11px;font-weight:400;}span{color:#c4ccd8;}`;
const Legend=styled.div`display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:#b5bdca;`;
const Timeline=styled.div`margin:20px 0;strong{font-size:14px;}div{position:relative;height:40px;margin:6px 8px 6px 0;background:#202633;border-bottom:1px solid #596273;}i{position:absolute;top:5px;width:3px;height:29px;background:#c6b4ff;}span{position:absolute;}span.death{height:100%;background:repeating-linear-gradient(135deg,#773b4266 0,#773b4266 5px,#b3626666 5px,#b3626666 10px);}span.haste{height:8px;bottom:0;background:#71b9a1;}small{font-size:12px;color:#adb9c9;}`;
const Source=styled.a`display:flex;align-items:center;gap:9px;color:#b6b0e3;margin:13px 0;font-size:14px;svg{flex-shrink:0;}`;
