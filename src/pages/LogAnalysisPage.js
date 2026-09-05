import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, ArrowUpRight, BarChart3, BookOpen, CalendarDays } from 'lucide-react';
import { getAllGuideSpecs } from '../data/guideRegistry.js';
import { getLogReportsByGuideId, logReports } from '../data/logReportRegistry.js';

const guides = getAllGuideSpecs();
const guidesById = new Map(guides.map(guide => [guide.id, guide]));

function formatDate(date) {
  return date.replaceAll('-', '.');
}

function LogAnalysisPage() {
  const { guideId } = useParams();
  const guide = guideId ? guidesById.get(guideId) : null;
  const reports = useMemo(
    () => [...(guideId ? getLogReportsByGuideId(guideId) : logReports)].sort((a, b) => b.date.localeCompare(a.date)),
    [guideId]
  );
  const latestDate = reports[0]?.date;
  const specCount = new Set(reports.map(report => report.guideId)).size;

  useEffect(() => {
    document.title = `${guide ? `${guide.spec} ${guide.className} ` : ''}로그 분석 | wowmeta`;
    window.scrollTo(0, 0);
  }, [guide]);

  return (
    <Page>
      <Header>
        {guide && (
          <BackLink to={guide.path}>
            <ArrowLeft size={16} aria-hidden="true" />
            {guide.spec} {guide.className} 가이드
          </BackLink>
        )}
        <Eyebrow>WOWMETA COMBAT LOG REVIEW</Eyebrow>
        <Title>{guide ? `${guide.spec} ${guide.className} 로그 분석` : '로그 분석'}</Title>
        <Description>
          {guide
            ? `${guide.spec} ${guide.className} 기록만 모았습니다. 원본 로그와 비교 조건, 확인된 손실 구간을 보고서별로 확인할 수 있습니다.`
            : '직접 분석한 Warcraft Logs 보고서를 최신순으로 모았습니다. 전문화, 분석 날짜와 전투 조건을 확인한 뒤 상세 보고서로 이동할 수 있습니다.'}
        </Description>
        <Metrics>
          <Metric><span>reports</span><strong>{reports.length}개</strong></Metric>
          <Metric><span>specializations</span><strong>{specCount}개 전문화</strong></Metric>
          <Metric><span>latest</span><strong>{latestDate ? formatDate(latestDate) : '등록 전'}</strong></Metric>
        </Metrics>
      </Header>

      {guide && (
        <ScopeBar>
          <span>{guide.spec} {guide.className}만 표시 중</span>
          <Link to="/logs">전체 로그 분석 보기</Link>
        </ScopeBar>
      )}

      {reports.length > 0 ? (
        <ReportList aria-label="로그 분석 보고서 목록">
          {reports.map(report => {
            const reportGuide = guidesById.get(report.guideId);
            return (
              <ReportLink key={report.id} to={report.path} $color={reportGuide?.color || '#75bda9'}>
                <ReportDate>
                  <CalendarDays size={15} aria-hidden="true" />
                  <time dateTime={report.date}>{formatDate(report.date)}</time>
                </ReportDate>
                <ReportBody>
                  <ReportSpec $color={reportGuide?.color || '#75bda9'}>
                    {reportGuide ? `${reportGuide.className} · ${reportGuide.spec}` : '전문화'}
                  </ReportSpec>
                  <ReportTitle>{report.title}</ReportTitle>
                  <ReportSummary>{report.summary}</ReportSummary>
                  <ReportMeta>
                    <span>{report.encounter}</span>
                    <span>{report.fights}</span>
                    <span>대상: {report.subject}</span>
                  </ReportMeta>
                </ReportBody>
                <OpenIcon aria-hidden="true"><ArrowUpRight size={19} /></OpenIcon>
              </ReportLink>
            );
          })}
        </ReportList>
      ) : (
        <EmptyState>
          <BarChart3 size={24} aria-hidden="true" />
          <h2>등록된 로그 분석이 없습니다</h2>
          <p>이 전문화의 첫 분석 보고서가 작성되면 여기에 자동으로 표시됩니다.</p>
          {guide && <Link to={guide.path}><BookOpen size={15} />가이드로 돌아가기</Link>}
        </EmptyState>
      )}
    </Page>
  );
}

const Page = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 96px;
  color: #dfe4e7;

  @media (max-width: 560px) {
    width: calc(100% - 24px);
    padding-top: 30px;
  }
`;

const Header = styled.header`margin-bottom:32px;`;
const BackLink = styled(Link)`display:inline-flex;align-items:center;gap:7px;margin-bottom:26px;color:#9ba6ad;font-size:.78rem;font-weight:650;&:hover{color:#eef1f3;}`;
const Eyebrow = styled.p`color:#d2b373;font-size:.76rem;font-weight:700;letter-spacing:.04em;`;
const Title = styled.h1`margin-top:8px;color:#eef1f3;font-size:clamp(2rem,4vw,3.1rem);line-height:1.14;letter-spacing:0;word-break:keep-all;`;
const Description = styled.p`max-width:780px;margin-top:14px;color:#aeb8be;font-size:.96rem;line-height:1.78;word-break:keep-all;`;
const Metrics = styled.div`display:flex;flex-wrap:wrap;margin-top:28px;padding:11px 0;border-top:1px solid rgba(168,178,188,.14);border-bottom:1px solid rgba(168,178,188,.14);`;
const Metric = styled.div`display:flex;align-items:baseline;gap:8px;padding:3px 20px;border-left:1px solid rgba(168,178,188,.14);font-size:.82rem;&:first-child{padding-left:0;border-left:0;}span{color:#7f8b94;font-size:.64rem;font-weight:650;text-transform:uppercase;}strong{color:#dfe4e7;}@media(max-width:620px){width:100%;padding:6px 0;border-left:0;}`;
const ScopeBar = styled.div`display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:18px;padding:10px 0;border-bottom:1px solid rgba(168,178,188,.14);color:#89959d;font-size:.74rem;span{color:#d2b373;font-weight:700;}a{color:#aeb8be;font-weight:650;&:hover{color:#eef1f3;}}`;
const ReportList = styled.section`border-top:1px solid rgba(168,178,188,.16);`;
const ReportLink = styled(Link)`
  position:relative;
  display:grid;
  grid-template-columns:128px minmax(0,1fr) 34px;
  gap:24px;
  align-items:start;
  padding:24px 10px 24px 14px;
  border-bottom:1px solid rgba(168,178,188,.13);
  border-left:3px solid transparent;

  &:hover{border-left-color:${props => props.$color};background:${props => `${props.$color}0a`};}
  &:focus-visible{outline:2px solid ${props => props.$color};outline-offset:-2px;}

  @media(max-width:700px){grid-template-columns:1fr;gap:12px;padding:20px 38px 20px 10px;}
`;
const ReportDate = styled.div`display:flex;align-items:center;gap:7px;color:#8e9aa2;font-size:.72rem;font-weight:650;white-space:nowrap;svg{color:#6f7c84;}`;
const ReportBody = styled.div`min-width:0;`;
const ReportSpec = styled.div`color:${props => props.$color};font-size:.7rem;font-weight:750;`;
const ReportTitle = styled.h2`margin-top:5px;color:#e9edef;font-size:1.12rem;line-height:1.4;letter-spacing:0;word-break:keep-all;`;
const ReportSummary = styled.p`max-width:76ch;margin-top:8px;color:#8f9aa2;font-size:.78rem;line-height:1.65;word-break:keep-all;`;
const ReportMeta = styled.div`display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:12px;color:#717e86;font-size:.68rem;span+span{position:relative;&::before{content:'';position:absolute;left:-9px;top:50%;width:2px;height:2px;background:#59656c;}}@media(max-width:480px){display:grid;gap:4px;span+span::before{display:none;}}`;
const OpenIcon = styled.span`display:grid;place-items:center;width:30px;height:30px;color:#8e9aa2;@media(max-width:700px){position:absolute;top:18px;right:6px;}`;
const EmptyState = styled.section`display:grid;justify-items:start;gap:9px;padding:36px 0;border-top:1px solid rgba(168,178,188,.16);border-bottom:1px solid rgba(168,178,188,.16);color:#75bda9;h2{color:#e4e8ea;font-size:1.05rem;}p{color:#849098;font-size:.78rem;}a{display:inline-flex;align-items:center;gap:6px;margin-top:8px;color:#c5cdd1;font-size:.76rem;}`;

export default LogAnalysisPage;
