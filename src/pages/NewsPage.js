import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { guideUpdates } from '../data/guideUpdates.js';
import { getAllGuideSpecs } from '../data/guideRegistry.js';

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
  font-size: 2rem;
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

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 12px;
  font-size: 0.8rem;
  a { color: #b9c9d3; text-underline-offset: 3px; }
  a:hover, a:focus-visible { color: #efc477; }
`;

const guides = getAllGuideSpecs();

function NewsPage() {
  return (
    <Page>
      <Header>
        <Title>업데이트</Title>
        <Description>Git에 반영된 가이드·KB·사이트 변경 내역입니다. 날짜는 커밋 기준이며, 부분 반영은 전체 검수 완료와 구분합니다.</Description>
      </Header>
      <Timeline>
        {guideUpdates.map(item => (
          <Item key={`${item.date}-${item.title}`}>
            <Date as="time" dateTime={item.date}>{item.date}</Date>
            <div>
              <ItemTitle>{item.title}</ItemTitle>
              <Body>{item.body}</Body>
              <Links aria-label="관련 페이지">
                {item.guideIds.map(id => {
                  const guide = guides.find(entry => entry.id === id);
                  return <Link key={id} to={guide.path}>{guide.spec} {guide.className}</Link>;
                })}
                {item.path && <Link to={item.path}>분석 보고서</Link>}
              </Links>
              <Links aria-label="Git 변경 근거">
                {item.commits.map(commit => <a key={commit} href={`https://github.com/DDing-code/wow-meta-site/commit/${commit}`} target="_blank" rel="noreferrer">커밋 {commit}</a>)}
              </Links>
            </div>
          </Item>
        ))}
      </Timeline>
    </Page>
  );
}

export default NewsPage;
