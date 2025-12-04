import React from 'react';
import styled from 'styled-components';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';

// 가이드 표 컴포넌트
// Material-UI Table을 사용하여 다크 테마 스타일링
// 스탯 우선순위, 티어 세트 비교 등에 활용

const StyledTableContainer = styled(TableContainer)`
  background: #15151f;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
`;

const StyledTable = styled(Table)`
  .MuiTableCell-root {
    color: #e0e0e0;
    border-color: #2a2a3e;
    font-family: 'Noto Sans KR', sans-serif;
    padding: 16px;
    font-size: 0.95rem;
  }

  .MuiTableCell-head {
    background: ${props => props.themecolor || '#A330C9'}20;
    color: ${props => props.themecolor || '#A330C9'};
    font-weight: bold;
    font-size: 1rem;
    text-align: center;
  }

  .MuiTableCell-body {
    &:first-child {
      font-weight: 600;
      color: ${props => props.themecolor || '#A330C9'};
    }
  }

  .MuiTableRow-root {
    &:hover {
      background: rgba(255,255,255,0.03);
    }
  }
`;

const TableTitle = styled.h4`
  color: #ffa500;
  font-size: 1.2rem;
  margin: 20px 0 10px 0;
  font-weight: bold;
`;

function GuideTable({
  data,
  color = '#A330C9',
  title = ''
}) {
  // 데이터 검증
  if (!data || !data.columns || !data.rows) {
    console.warn('GuideTable: Invalid data structure', data);
    return null;
  }

  return (
    <>
      {title && <TableTitle>{title}</TableTitle>}
      <StyledTableContainer>
        <StyledTable themecolor={color}>
          <TableHead>
            <TableRow>
              {data.columns.map((col, idx) => (
                <TableCell key={idx}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.rows.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <TableCell key={cellIdx}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </>
  );
}

// React.memo로 최적화 - props가 변경되지 않으면 리렌더링 방지
export default React.memo(GuideTable);
