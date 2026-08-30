import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  width: min(880px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 96px;

  @media (max-width: 560px) {
    width: calc(100% - 24px);
    padding-top: 30px;
  }
`;

const Header = styled.header`
  margin-bottom: 32px;
  padding-bottom: 26px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
`;

const Title = styled.h1`
  color: #eef1f3;
  font-size: clamp(2rem, 4vw, 3.1rem);
`;

const Description = styled.p`
  margin-top: 10px;
  color: #aeb8be;
  font-weight: 450;
  line-height: 1.78;
`;

const Timeline = styled.div`
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(168, 178, 188, 0.12);
`;

const Item = styled.article`
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 22px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(168, 178, 188, 0.11);

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

const Date = styled.div`
  color: #89959d;
  font-size: 0.78rem;
  font-weight: 560;
  font-variant-numeric: tabular-nums;
`;

const ItemTitle = styled.h2`
  color: #e7ebed;
  font-size: 1.1rem;
  font-weight: 680;
`;

const Body = styled.p`
  margin-top: 6px;
  color: #9fa9b0;
  font-size: 0.9rem;
  font-weight: 450;
  line-height: 1.7;
`;

const entries = [
  {
    date: '2026-08-25',
    title: '12.1 신성 사제 가이드 갱신',
    body: '축도와 빛의 권능: 평온의 변경, 공격대 집정관과 쐐기 예언자 운용, 최근 로그 비교를 반영했습니다.',
  },
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
        <Title>업데이트</Title>
        <Description>패치 데이터와 가이드 변경 내역을 기록합니다.</Description>
      </Header>
      <Timeline>
        {entries.map(item => (
          <Item key={`${item.date}-${item.title}`}>
            <Date as="time" dateTime={item.date}>{item.date}</Date>
            <div>
              <ItemTitle>{item.title}</ItemTitle>
              <Body>{item.body}</Body>
            </div>
          </Item>
        ))}
      </Timeline>
    </Page>
  );
}

export default NewsPage;
