import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowUpRight } from 'lucide-react';
import { logReports } from '../data/logReportRegistry.js';

function normalizePath(path = '') {
  return path.replace(/\/+$/, '') || '/';
}

function LogReportSidebarList() {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);
  const reports = [...logReports]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter(report => normalizePath(report.path) !== currentPath)
    .slice(0, 3);

  if (reports.length === 0) return null;

  return (
    <Shelf aria-label="최신 로그 분석">
      <ShelfHead>
        <span>최신 분석</span>
        <Link to="/logs">전체</Link>
      </ShelfHead>
      {reports.map(report => (
        <ReportLink key={report.id} to={report.path}>
          <time dateTime={report.date}>{report.date.slice(5).replace('-', '.')}</time>
          <span>{report.title}</span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </ReportLink>
      ))}
    </Shelf>
  );
}

const Shelf = styled.aside`
  display:grid;
  gap:1px;
  margin-top:22px;
  padding-top:14px;
  border-top:1px solid rgba(168,178,188,.14);

  @media(max-width:980px){display:none;}
`;

const ShelfHead = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  padding:0 8px 8px;
  color:#6f7d86;
  font-size:.65rem;
  font-weight:750;

  a{color:#9aa5ab;&:hover{color:#eef1f3;}}
`;

const ReportLink = styled(Link)`
  position:relative;
  display:grid;
  gap:4px;
  padding:9px 22px 9px 8px;
  border-top:1px solid rgba(168,178,188,.08);
  color:#9ba6ac;

  time{color:#b58d5b;font-size:.6rem;font-weight:750;}
  span{font-size:.68rem;line-height:1.45;word-break:keep-all;}
  svg{position:absolute;top:10px;right:6px;color:#65727a;}

  &:hover{color:#eef1f3;background:rgba(255,255,255,.025);}
`;

export default LogReportSidebarList;
