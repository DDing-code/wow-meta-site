import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  width: min(960px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0 80px;
`;

const Header = styled.header`
  margin-bottom: 28px;
`;

const Title = styled.h1`
  color: #f8fafc;
  font-size: clamp(2rem, 5vw, 3.6rem);
`;

const Description = styled.p`
  margin-top: 10px;
  color: #cbd5e1;
`;

const Timeline = styled.div`
  display: grid;
  gap: 12px;
`;

const Item = styled.article`
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
`;

const Date = styled.div`
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 800;
`;

const ItemTitle = styled.h2`
  margin-top: 6px;
  color: #f8fafc;
  font-size: 1.1rem;
`;

const Body = styled.p`
  margin-top: 6px;
  color: #cbd5e1;
`;

const entries = [
  {
    date: '2026-05-22',
    title: '12.0.5 KB 재작성 완료',
    body: '13개 직업, 40개 전문화 스코프, 공용 스코프를 새 KB 구조로 정리했습니다.',
  },
  {
    date: '2026-05-22',
    title: '사이트 클린업 시작',
    body: '구버전 가이드 구현과 실험용 코드 연결을 제거하고 새 디자인 목업을 준비합니다.',
  },
];

function NewsPage() {
  return (
    <Page>
      <Header>
        <Title>작업 로그</Title>
        <Description>패치 데이터와 사이트 구조 변경 사항을 간결하게 기록합니다.</Description>
      </Header>
      <Timeline>
        {entries.map(item => (
          <Item key={`${item.date}-${item.title}`}>
            <Date>{item.date}</Date>
            <ItemTitle>{item.title}</ItemTitle>
            <Body>{item.body}</Body>
          </Item>
        ))}
      </Timeline>
    </Page>
  );
}

export default NewsPage;
