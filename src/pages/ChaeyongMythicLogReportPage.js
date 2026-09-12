import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import report from '../data/chaeyongMythicReport.json';
import kb from '../data/kb-skills.json';
import LogReportSidebarList from '../components/LogReportSidebarList.js';

const bosses = {3470:'네크잘리',3445:'매장된 파수꾼',3455:'바쉬니크',3497:'길 잃은 탐험가',3379:'님리사'};
const subjects = report.fights.filter(f => f.key.startsWith('p'));
const byKey = new Map(report.fights.map(f => [f.key,f]));
const skillIds = [364343,355913,373861,355936,360995,1256581,1242031,1242745,369299,370537,363534,366155,444088,357208,1265979];
const skills = skillIds.map(id => kb.skills[id]).filter(Boolean).sort((a,b) => b.koreanName.length-a.koreanName.length);
const byName = new Map(skills.map(s => [s.koreanName,s.id]));
const pattern = new RegExp(`(${skills.map(s => s.koreanName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'g');
const sourceById = new Map(report.sources.map(s => [s.id,s]));
const clock = seconds => `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
const kilo = n => `${(n/1000).toFixed(1)}k`;
const date = n => new Date(n).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
const url = (f,type='healing') => `https://www.warcraftlogs.com/reports/${f.code}?fight=${f.fight}&source=${f.actor}&type=${type}`;
const reference = f => byKey.get(`r${f.key.slice(1)}`);
const heal = (f,id) => f.heals.find(h => h.id===id);

function Skill({id}) {
  const s=kb.skills[id];
  return <Spell href={`https://www.wowhead.com/ko/spell=${id}`} data-wowhead={`spell=${id}&domain=ko`} target="_blank" rel="noreferrer"><img src={s.iconUrls.small} width="17" height="17" alt="" loading="lazy"/>{s.koreanName}</Spell>;
}
function Text({children}) {
  return children.split(pattern).map((part,i) => byName.has(part)?<Skill key={i} id={byName.get(part)}/>:part);
}
function Table({caption,headers,rows}) {
  return <Scroll tabIndex={0} aria-label={caption}><table><caption><Text>{caption}</Text></caption><thead><tr>{headers.map(h=><th key={h} scope="col"><Text>{h}</Text></th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((v,j)=>j===0?<th key={j} scope="row">{typeof v==='string'?<Text>{v}</Text>:v}</th>:<td key={j}>{typeof v==='string'?<Text>{v}</Text>:v}</td>)}</tr>)}</tbody></table></Scroll>;
}
function Sources({ids}) {
  return <SourcesRow>{ids.map(id=>{const s=sourceById.get(id);return <a key={id} href={s.url} target="_blank" rel="noreferrer">{s.title}<ExternalLink size={12}/></a>;})}</SourcesRow>;
}
function Figure({id,a,b}) {
  if(id==='chain')return <>
    <Table caption="보스별 시전 이벤트 · 각 칸은 채용 / 비교 대상 · 정지장 재생 포함, fake 제외" headers={['보스','에메랄드 꽃','메아리','메리스라의 축복','일반 구간 2중첩 갱신']} rows={subjects.map(p=>{const r=reference(p);return [bosses[p.encounter],...[355913,364343,1256581].map(id=>`${p.counts[id]||0} / ${r.counts[id]||0}`),`${p.capRefresh.filter(e=>!e.inner).length} / ${r.capRefresh.filter(e=>!e.inner).length}`];})}/>
    <Note><Text>2중첩 갱신은 내면의 불꽃 밖에서 관측된 횟수입니다. 그대로 잘못된 시전 횟수로 환산하지 않습니다.</Text></Note>
  </>;
  if(id==='example')return <figure><figcaption>파수꾼 · 2중첩 갱신을 동반한 꽃 시전 5개</figcaption><Sequence>{[132.590,135.146,137.709,144.898,146.141].map(t=><li key={t}><time>{clock(t)}<small>{t.toFixed(3)}초</small></time><Skill id={355913}/></li>)}</Sequence><a href={`${url(byKey.get('pSentinel'),'casts')}&start=4969033&end=4984033`} target="_blank" rel="noreferrer">해당 구간 시전 원본 <ExternalLink size={13}/></a></figure>;
  if(id==='healing')return <Table caption={`${bosses[a.encounter]} · 기술별 HPS / 오버힐 · 위의 보스 선택과 연동`} headers={['기술','채용 HPS / 오버힐',`${b.name} HPS / 오버힐`]} rows={[[1256581,1256581],[366155,366155],[355936,355936],[355913,355913],[445495,444088],[363534,363534]].map(([id,iconId])=>[<Skill id={iconId}/>,...[a,b].map(f=>{const h=heal(f,id);return h?`${kilo(h.hps)} / ${h.overhealPercent.toFixed(1)}%`:'기록 없음';})])}/>;
  if(id==='stasis')return <Table caption="채용 파수꾼 · 준비 버프 종료와 재생을 함께 판독" headers={['시각','수동 방출','판독']} rows={[
    ['0:37.764','없음','꿈의 숨결 2회 + 시간 변칙 재생'],
    ['2:11.082','있음','꿈의 숨결 + 시간 변칙 + 메리스라의 축복 재생'],
    ['3:38.079','있음','꿈의 숨결 + 시간 변칙 + 메리스라의 축복 재생'],
    ['5:17.402','있음','시간 변칙 + 에메랄드 꽃 2회 재생'],
    ['7:00.559','없음','준비 버프 소멸, 재생 미관측 · 0.055초 후 사망']
  ].map(r=>[r[0],r[1],<Text>{r[2]}</Text>])}/>;
  if(id==='self')return <Table caption="채용 본인의 네크잘리 · 9월 8일 / 최근 기록" headers={['지표','9월 8일','9월 11일']} rows={[
    ['장비',316,319],['전투 시간','7:18.046','7:16.405'],
    ...[['HPS',f=>kilo(f.hps)],['힐러 합산 치유 내 비중',f=>`${f.healerShare.toFixed(1)}%`],['메아리 시전 이벤트',f=>f.counts[364343]],['축복 + 되감기 HPS',f=>kilo(heal(f,1256581).hps+heal(f,366155).hps)]].map(([label,get])=>[label,get(byKey.get('bestNek')),get(byKey.get('pNek'))])
  ]}/>;
  return null;
}

export default function ChaeyongMythicLogReportPage() {
  const [selected,setSelected]=useState('pSentinel');
  const a=byKey.get(selected),b=reference(a);
  useEffect(()=>{document.title=`${report.title} | wowmeta`;const section=document.getElementById(window.location.hash.slice(1));if(section)section.scrollIntoView();else window.scrollTo(0,0);},[]);
  return <Page>
    <Back to="/logs/evoker-preservation"><ArrowLeft size={16}/>보존 기원사 로그 분석</Back>
    <header><Meta>보존 기원사 · 신화 · {report.patch} · <time dateTime={report.analyzedAt}>{report.analyzedAt} 분석</time></Meta><h1>{report.title}</h1><Lead><Text>{report.lead}</Text></Lead><p>{report.scope}</p></header>
    <Layout><div>
      <Section id="overview"><Number>01 · 비교 조건</Number><h2>최근 5개 보스, 같은 조건부터 확인</h2>
        <Table caption="채용의 최근 신화 처치 · 날짜는 한국 시간 · 점수는 해당 전투 당시 백분위" headers={['보스','날짜','HPS','점수','장비','힐러 수']} rows={subjects.map(f=>[<a href={url(f)} target="_blank" rel="noreferrer">{bosses[f.encounter]} <ExternalLink size={12}/></a>,date(f.date),kilo(f.hps),f.rank.toFixed(1),f.ilvl,f.healers.length])}/>
        <Control>비교할 보스<select aria-label="비교할 보스" value={selected} onChange={e=>setSelected(e.target.value)}>{subjects.map(f=><option key={f.key} value={f.key}>{bosses[f.encounter]}</option>)}</select></Control>
        <Pair aria-live="polite">{[a,b].map((f,i)=><article key={f.key}><span>{i?'상위 비교 로그':'채용의 최근 로그'}</span><h3>{f.name}</h3><strong>{kilo(f.hps)} <small>HPS</small></strong><p>{date(f.date)} · {clock(f.duration)} · 장비 {f.ilvl} · {f.healers.length}힐</p><a href={url(f,'casts')} target="_blank" rel="noreferrer">시전 원본 <ExternalLink size={13}/></a></article>)}</Pair>
        <Table caption={`${bosses[a.encounter]} 비교 환경 · 피해량은 공격대 전체 DTPS`} headers={['지표','채용 공격대','비교 공격대']} rows={[
          ['전투 시간 (초)',a.duration.toFixed(3),b.duration.toFixed(3)],['힐러 수',a.healers.length,b.healers.length],['공격대 받은 피해 / 초',kilo(a.raidDtps),kilo(b.raidDtps)],['힐러 합산 치유 내 개인 비중',`${a.healerShare.toFixed(1)}%`,`${b.healerShare.toFixed(1)}%`],['시즌 2 세트 착용',`${a.tier}부위`,`${b.tier}부위`]
        ]}/>
        <details><summary>힐러 구성과 통제하지 못한 조건</summary><p>세부 특성 선택·등급이 다른 항목은 {b.talentEntryDifferences}개입니다. 같은 영웅 특성과 세트를 썼다고 완전히 같은 빌드는 아닙니다.</p><Table caption="전투별 힐러 구성 · WCL 전문화명" headers={['진영','힐러','전문화','HPS']} rows={[a,b].flatMap((f,i)=>f.healers.map(h=>[i?'비교':'채용',h.name,h.spec,kilo(h.hps)]))}/><p>마나·정수 낭비량, 외부 지원, 힐 배정과 위치는 동일 조건으로 보정하지 않았습니다.</p></details>
      </Section>
      {report.sections.map((s,i)=><Section id={s.id} key={s.id}><Number>{String(i+2).padStart(2,'0')}</Number><h2>{s.title}</h2>{s.paragraphs.map((p,j)=><p key={j}><Text>{p}</Text></p>)}<Figure id={s.id} a={a} b={b}/><Sources ids={s.sourceIds}/></Section>)}
      <Section id="method"><Number>09 · 검증 범위</Number><h2>집계 방식과 한계</h2><p>{report.method}</p><p>{report.counting}</p><p>{report.limits}</p><details><summary>수집한 원시 이벤트와 검증</summary><Table caption="치유·흡수 이벤트와 버프 이벤트 · 종료 커서까지 수집" headers={['전투','치유 이벤트','본인 수신 버프','본인 적용 버프']} rows={report.fights.map(f=>[`${f.name} · ${bosses[f.encounter]}`,f.rawEvents.healing.toLocaleString(),f.rawEvents.buffs.toLocaleString(),f.rawEvents.outgoingBuffs.toLocaleString()])}/><p>기술별 치유 합계와 WCL Summary의 개인 합계를 11개 전투 모두 대조했습니다. 원문과 숫자는 KB에서 사이트 DB로 동기화됩니다.</p></details><Sources ids={report.sources.map(s=>s.id)}/><SourcesRow><a href={url(byKey.get('bestNek'))} target="_blank" rel="noreferrer">채용 9월 8일 네크잘리 원본 <ExternalLink size={12}/></a></SourcesRow></Section>
    </div><Aside><nav aria-label="보고서 목차"><a href="#overview">01 비교 조건과 보스 선택</a>{report.sections.map((s,i)=><a key={s.id} href={`#${s.id}`}>{String(i+2).padStart(2,'0')} {s.title}</a>)}<a href="#method">09 집계 방식과 한계</a></nav><LogReportSidebarList/></Aside></Layout>
  </Page>;
}

const Page=styled.div`max-width:1260px;margin:auto;padding:36px 28px 80px;color:#dce3e4;line-height:1.85;overflow-wrap:anywhere;h1,h2,h3{word-break:keep-all;}h1{font-size:32px;line-height:1.4;letter-spacing:0;}h2{font-size:23px;line-height:1.5;letter-spacing:0;}h3{font-size:18px;}p{word-break:keep-all;margin:16px 0;}a{color:#92cdbc;}a:focus-visible,summary:focus-visible{outline:2px solid #92cdbc;outline-offset:4px;}summary{cursor:pointer;color:#bfcacb;font-size:14px;}figure{margin:24px 0;}figcaption{font-size:14px;color:#c4c7b4;}@media(max-width:600px){padding:24px 16px 60px;h1{font-size:26px;}h2{font-size:21px;}}`;
const Back=styled(Link)`display:inline-flex;align-items:center;gap:8px;font-size:14px;`;
const Meta=styled.p`color:#c6a77b;font-size:13px;margin-top:24px!important;`;
const Lead=styled.p`max-width:900px;font-size:19px;color:#d2dddc;`;
const Layout=styled.div`display:grid;grid-template-columns:minmax(0,1fr) 225px;gap:36px;>div{min-width:0;}@media(max-width:1050px){grid-template-columns:1fr;}`;
const Section=styled.section`padding:32px 0;border-top:1px solid #323d3e;scroll-margin-top:90px;p{color:#bdc9ca;font-size:16px;}h2{margin:7px 0 22px;}details{margin:20px 0;}`;
const Number=styled.span`color:#c6a77b;font-size:13px;font-weight:700;`;
const Scroll=styled.div`max-width:100%;overflow-x:auto;margin:24px 0;table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.75;}caption{text-align:left;color:#a6b8b8;font-size:13px;margin-bottom:10px;}th,td{padding:12px 10px;border-bottom:1px solid #303d3e;text-align:left;vertical-align:top;}thead{background:#192324;}thead th{color:#c3d7d1;white-space:nowrap;}tbody th{font-weight:500;min-width:120px;}td{color:#b6c8cb;min-width:90px;}table svg{vertical-align:-2px;} &:focus-visible{outline:2px solid #92cdbc;outline-offset:2px;}`;
const Spell=styled.a`color:#d9c292!important;font-weight:600;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;img{flex-shrink:0;border-radius:2px;} &:hover{text-decoration:underline;}`;
const Note=styled.p`font-size:13px!important;color:#a8b9ba!important;`;
const Control=styled.label`display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:24px 0;font-size:14px;select{font:inherit;max-width:100%;padding:10px 14px;border:1px solid #57706a;border-radius:4px;background:#192324;color:#e1eeea;}select:focus-visible{outline:2px solid #92cdbc;outline-offset:3px;}`;
const Pair=styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;article{border-top:3px solid #c6a77b;padding:18px 0;}article+article{border-color:#80c4af;}span,p,a{font-size:13px;}span,p{color:#a9babb;}h3{margin:8px 0;}strong{font-size:28px;}small{font-size:13px;font-weight:400;}@media(max-width:540px){grid-template-columns:1fr;gap:8px;}`;
const Sequence=styled.ol`display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:0;list-style:none;padding:0;margin:18px 0;li{padding:14px 10px;border-top:2px solid #bb9b66;min-width:0;}time{display:block;color:#e0c090;font-size:17px;font-weight:700;}small{font-size:11px;font-weight:400;color:#b3bdbe;display:block;margin-bottom:8px;}a{font-size:14px;}`;
const SourcesRow=styled.div`display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:16px;a{font-size:12px;display:inline-flex;align-items:center;gap:6px;}svg{flex-shrink:0;}`;
const Aside=styled.aside`position:sticky;top:90px;align-self:start;max-height:calc(100vh - 110px);overflow:auto;padding-top:30px;nav{display:grid;gap:9px;margin-bottom:28px;}nav a{font-size:13px;line-height:1.65;}@media(max-width:1050px){position:static;max-height:none;border-top:1px solid #323d3e;nav{grid-template-columns:repeat(2,minmax(0,1fr));}}@media(max-width:540px){nav{grid-template-columns:1fr;}}`;
