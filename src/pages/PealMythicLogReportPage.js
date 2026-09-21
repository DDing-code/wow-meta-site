import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import report from '../data/pealMythicReport.json';
import kb from '../data/kb-skills.json';
import LogReportSidebarList from '../components/LogReportSidebarList.js';

const bosses = {3470:'네크잘리',3445:'매장된 파수꾼',3455:'바쉬니크',3497:'길 잃은 탐험가',3379:'님리사'};
const byKey = new Map(report.fights.map(f => [f.key, f]));
const subjects = report.fights.filter(f => f.key.startsWith('p'));
const ids = [42650,1233448,1247378,458128,55090,47541,1242174,383269,343294,377514,207317,49530,1242158];
const skills = ids.map(id => kb.skills[id]).filter(Boolean).sort((a,b) => b.koreanName.length-a.koreanName.length);
const byName = new Map(skills.map(s => [s.koreanName,s]));
const pattern = new RegExp(`(${skills.map(s => s.koreanName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'g');
const clock = t => `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
const k = n => `${(n/1000).toFixed(1)}k`;
const count = (f,id) => f.times[id]?.length || 0;
const uptime = (f,id) => f.buffs.find(b => b.id===id)?.uptime || 0;
const source = (f,type='damage-done') => `https://www.warcraftlogs.com/reports/${f.code}?fight=${f.fight}&source=${f.actor}&type=${type}`;
const date = n => new Date(n).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});

function Text({children}) {
  return String(children).split(pattern).map((text,i) => {
    const s=byName.get(text);
    return s ? <Spell key={i} href={`https://www.wowhead.com/ko/spell=${s.id}`} data-wowhead={`spell=${s.id}&domain=ko`} target="_blank" rel="noreferrer"><img src={s.iconUrls.small} width="16" height="16" alt="" loading="lazy"/>{text}</Spell> : text;
  });
}
function Table({caption,headers,rows}) {
  return <Scroll tabIndex={0} aria-label={caption}><table><caption>{caption}</caption><thead><tr>{headers.map(h => <th key={h} scope="col"><Text>{h}</Text></th>)}</tr></thead><tbody>{rows.map((row,i) => <tr key={i}>{row.map((v,j) => j===0 ? <th key={j} scope="row">{typeof v==='string'?<Text>{v}</Text>:v}</th> : <td key={j}>{typeof v==='string'?<Text>{v}</Text>:v}</td>)}</tr>)}</tbody></table></Scroll>;
}
function Sequence({fight,id}) {
  return <div><h3>{fight.name} · <Text>{kb.skills[id].koreanName}</Text></h3><Rail>{(fight.times[id] || []).map((t,i) => <li key={t}><b>{i+1}</b><time>{clock(t)}</time><small>{t.toFixed(2)}초</small><small>{i ? `간격 ${(t-fight.times[id][i-1]).toFixed(2)}초`:'첫 사용'}</small></li>)}</Rail></div>;
}
function Evidence({id}) {
  if(id==='nym') return <Table caption="님리사 · 본인 이벤트 타임라인" headers={['시점','확인된 사실']} rows={[
    ['4:46.586','마지막 본인 시전: 괴저 고리'],['5:37.321','본인 사망: 주문 1258677'],['7:17.585','처치 완료 · 이후 본인 시전 재개 없음']
  ]}/>;
  if(id==='vash') {
    const a=byKey.get('pVash'),b=byKey.get('rVash');
    return <Table caption="바쉬니크 · 대상별 DPS (전체 전투 시간 기준)" headers={['피해 대상','페알','Wwdk']} rows={a.targets.map(t => [t.name,k(t.total/a.duration),k((b.targets.find(x => x.name===t.name)?.total||0)/b.duration)])}/>;
  }
  if(id==='nek') return <Table caption="페알 본인 기록 비교 · 영웅 특성 변경에 주의" headers={['항목','이전 네크잘리','최근 네크잘리']} rows={[
    ['영웅 특성',byKey.get('bNek').hero,byKey.get('pNek').hero],
    ['장비',322,325],['당시 점수','84.2','22.5'],
    ['DPS',k(byKey.get('bNek').dps),k(byKey.get('pNek').dps)],
    ['사자의 군대',5,4],['어둠의 변신',9,8],['영혼 수확자',13,0]
  ]}/>;
  return null;
}

export default function PealMythicLogReportPage() {
  const [selected,setSelected] = useState('pSentinel');
  const a=byKey.get(selected),b=byKey.get(`r${selected.slice(1)}`);
  useEffect(() => { document.title=`${report.title} | wowmeta`; },[]);
  return <Page>
    <Link to="/logs/deathknight-unholy"><ArrowLeft size={15}/> 부정 죽음의 기사 로그 분석</Link>
    <header><Meta>12.1 · 부정 죽음의 기사 · 신화 · <time dateTime={report.analyzedAt}>{report.analyzedAt}</time></Meta><h1>{report.title}</h1><Lead>{report.lead}</Lead><p>{report.scope}</p></header>
    <Layout><main>
      <Section id="overview"><h2>최근 5보스, 어디서 벌어졌나</h2>
        <Table caption="최근 처치 · 당시 백분위 · 한국 시간" headers={['보스','날짜','DPS','점수','영웅 특성']} rows={subjects.map(f => [<a href={source(f)} target="_blank" rel="noreferrer">{bosses[f.encounter]}</a>,date(f.date),k(f.dps),f.rank.toFixed(1),f.hero])}/>
        <Control>비교할 보스<select value={selected} onChange={e=>setSelected(e.target.value)} aria-label="비교할 보스">{subjects.map(f => <option key={f.key} value={f.key}>{bosses[f.encounter]}</option>)}</select></Control>
        <Pair aria-live="polite">{[a,b].map((f,i) => <article key={f.key}><small>{i?`상위 목록 ${f.topPagePosition}번째 기록`:'페알의 최근 기록'}</small><h3>{f.name}</h3><strong>{k(f.dps)} <small>DPS</small></strong><p>{f.hero} · 장비 {f.ilvl}<br/>{date(f.date)} · {f.duration.toFixed(3)}초</p><a href={source(f,'casts')} target="_blank" rel="noreferrer">시전 원본 보기</a></article>)}</Pair>
        {a.hero!==b.hero && <Notice>영웅 특성이 다른 비교입니다. 전체 격차를 영웅 특성의 성능 차이로 단정하지 않습니다.</Notice>}
        <Table caption={`${bosses[a.encounter]} · 본인 시전 수와 전체 전투 기준 버프 유지`} headers={['항목','페알',b.name]} rows={[
          ...[42650,1233448,1247378,458128,343294,47541,1242174,207317,383269].map(id => [kb.skills[id].koreanName,count(a,id),count(b,id)]),
          ['부패의 낫 유지율',...[a,b].map(f=>`${(uptime(f,1241077)/f.duration*100).toFixed(1)}%`)],
          ['마지막 군대 이후 남은 시간',...[a,b].map(f=>`${(f.duration-f.times[42650].at(-1)).toFixed(2)}초`)],
          ['본인 사망',a.deaths.length,b.deaths.length]
        ]}/>
        <details><summary>실제 소환 시각과 간격</summary><Sequence fight={a} id={42650}/><Sequence fight={b} id={42650}/><Sequence fight={a} id={1233448}/><Sequence fight={b} id={1233448}/></details>
        <details><summary>대상별 피해와 세부 비교 조건</summary><Table caption="대상별 DPS · 몬스터 원문 이름 보존" headers={['대상','페알',b.name]} rows={Array.from(new Set([...a.targets,...b.targets].map(t=>t.name))).map(name=>[name,...[a,b].map(f=>k((f.targets.find(t=>t.name===name)?.total||0)/f.duration))])}/><p>세부 특성 엔트리 또는 투자 점수가 다른 항목은 {new Set([...a.talents,...b.talents].filter(t=>!a.talents.some(x=>x.id===t.id&&x.rank===t.rank)||!b.talents.some(x=>x.id===t.id&&x.rank===t.rank)).map(t=>t.id)).size}개입니다. 영웅 특성이 같아도 완전히 같은 빌드는 아닙니다. 몬스터 배치, 장비 효과와 공대 배정도 통제하지 않았습니다.</p></details>
      </Section>
      {report.sections.map((s,i) => <Section key={s.id} id={s.id}><Meta>{String(i+1).padStart(2,'0')}</Meta><h2>{s.title}</h2>{s.paragraphs.map((p,j)=><p key={j}><Text>{p}</Text></p>)}<Evidence id={s.id}/><h3>다음 트라이에서</h3><ul>{s.actions.map(action=><li key={action}><Text>{action}</Text></li>)}</ul></Section>)}
      <Section id="method"><h2>집계 방식과 검증 범위</h2><p>{report.method}</p><p><Text>{report.counting}</Text></p><p>{report.limits}</p><Table caption="모든 비교 원본 · 시전 이벤트 종료 커서 확인" headers={['구분','보스','대상','시전 이벤트 원본']} rows={report.fights.map(f=>[f.key.startsWith('p')?'최근':f.key.startsWith('r')?'상위 비교':'본인 이전',bosses[f.encounter],<a href={source(f)} target="_blank" rel="noreferrer">{f.name}</a>,f.rawEvents])}/><p>12개 전투 모두 기술별 피해 합계·Summary 개인 합계·순위 DPS를 대조했습니다. 이벤트 수는 필터 전 응답 수이며 스킬 사용 횟수와 다릅니다. 원고와 분석 DB는 정본 KB에서 동기화됩니다.</p><h3>참고 자료</h3><ul>{report.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}</ul></Section>
    </main><Aside><nav aria-label="보고서 목차"><a href="#overview">보스별 비교표</a>{report.sections.map(s=><a key={s.id} href={`#${s.id}`}>{s.title}</a>)}<a href="#method">집계 방식과 원본</a></nav><LogReportSidebarList/></Aside></Layout>
  </Page>;
}

const Page=styled.div`max-width:1260px;margin:auto;padding:32px 28px 80px;color:#dce3e4;line-height:1.85;overflow-wrap:anywhere;h1,h2,h3,p{word-break:keep-all;}h1{font-size:32px;line-height:1.4;}h2{font-size:23px;line-height:1.5;}h3{font-size:17px;}p{margin:16px 0;}a{color:#94cbbc;}a:focus-visible,summary:focus-visible{outline:2px solid #94cbbc;outline-offset:3px;}summary{cursor:pointer;padding:12px 0;color:#c8d7d4;}li{margin:9px 0;}svg{vertical-align:-2px;}@media(max-width:600px){padding:24px 16px 60px;h1{font-size:26px;}h2{font-size:21px;}}`;
const Layout=styled.div`display:grid;grid-template-columns:minmax(0,1fr) 225px;gap:36px;main{min-width:0;}@media(max-width:1050px){grid-template-columns:1fr;}`;
const Meta=styled.p`font-size:13px;color:#c5a577;`;
const Lead=styled.p`font-size:19px;max-width:900px;`;
const Section=styled.section`border-top:1px solid #303b3c;padding:28px 0;scroll-margin-top:90px;p,li{color:#bfcdcd;}ul{padding-left:22px;}`;
const Scroll=styled.div`max-width:100%;overflow-x:auto;margin:24px 0;table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.65;}caption{text-align:left;color:#a4b6b8;font-size:13px;margin-bottom:10px;}th,td{text-align:left;padding:11px 9px;border-bottom:1px solid #303b3c;vertical-align:top;min-width:76px;}thead{background:#192324;}tbody th{font-weight:500;min-width:130px;} &:focus-visible{outline:2px solid #94cbbc;}`;
const Spell=styled.a`display:inline;white-space:normal;color:#dbc28e!important;font-weight:600;img{vertical-align:-2px;margin-right:4px;border-radius:2px;} &:hover{text-decoration:underline;}`;
const Control=styled.label`display:flex;gap:14px;align-items:center;flex-wrap:wrap;select{font:inherit;background:#192324;color:#dfebe8;border:1px solid #526f68;border-radius:4px;padding:8px 12px;max-width:100%;}select:focus-visible{outline:2px solid #94cbbc;}`;
const Pair=styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin:24px 0;article{border-top:3px solid #c5a577;padding:14px 0;}article+article{border-color:#94cbbc;}h3{margin:6px 0;}strong{font-size:28px;}small,p,a{font-size:13px;}@media(max-width:520px){grid-template-columns:1fr;}`;
const Notice=styled.p`border-left:3px solid #c5a577;padding-left:14px;font-size:14px;`;
const Rail=styled.ol`display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;li{flex:0 1 108px;border-top:2px solid #799a91;padding:7px 5px;}b{font-size:11px;color:#a6b9b2;margin-right:8px;}time{font-weight:700;}small{display:block;font-size:11px;color:#a5b8b5;}`;
const Aside=styled.aside`position:sticky;top:90px;align-self:start;max-height:calc(100vh - 110px);overflow:auto;nav{display:grid;gap:12px;padding:28px 0;font-size:13px;}@media(max-width:1050px){position:static;max-height:none;}`;
