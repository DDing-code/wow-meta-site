import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BookOpen, Database, Newspaper } from 'lucide-react';

const Page = styled.div`
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 56px 0 80px;
`;

const Hero = styled.section`
  min-height: 360px;
  display: grid;
  align-content: center;
  gap: 24px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
`;

const Label = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  max-width: 820px;
  color: #f8fafc;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 1.02;
  letter-spacing: 0;
`;

const Summary = styled.p`
  max-width: 720px;
  color: #cbd5e1;
  font-size: clamp(1rem, 2vw, 1.18rem);
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Stat = styled.div`
  min-width: 132px;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
`;

const StatValue = styled.div`
  color: #f8fafc;
  font-size: 1.4rem;
  font-weight: 900;
`;

const StatLabel = styled.div`
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
`;

const Section = styled.section`
  padding-top: 32px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const Action = styled(Link)`
  min-height: 154px;
  display: grid;
  align-content: space-between;
  gap: 22px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.76);

  &:hover {
    border-color: ${props => props.$color};
    background: rgba(30, 41, 59, 0.86);
  }
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.$color};
`;

const ActionTitle = styled.h2`
  color: #f8fafc;
  font-size: 1.12rem;
`;

const ActionText = styled.p`
  color: #94a3b8;
  font-size: 0.92rem;
`;

const actions = [
  {
    to: '/guide',
    title: '직업 가이드',
    text: '40개 전문화 KB를 기준으로 새 가이드 페이지를 구성합니다.',
    color: '#C69B6D',
    icon: BookOpen,
  },
  {
    to: '/spells',
    title: '스펠 DB',
    text: 'Wowhead 공식 한국어명 기준의 스킬과 특성을 검색합니다.',
    color: '#3FC7EB',
    icon: Database,
  },
  {
    to: '/news',
    title: '작업 로그',
    text: '패치와 사이트 재설계 진행 상태를 정리합니다.',
    color: '#AAD372',
    icon: Newspaper,
  },
];

function HomePage() {
  return (
    <Page>
      <Hero>
        <Label>WoW Meta Knowledge Base</Label>
        <Title>12.0.5 기준 직업 가이드를 새로 만드는 작업대</Title>
        <Summary>
          구버전 가이드 구현을 걷어내고, 새 KB를 기준으로 직업별 가이드와 스펠 데이터베이스를 다시 설계합니다.
        </Summary>
        <Stats>
          <Stat>
            <StatValue>13</StatValue>
            <StatLabel>직업</StatLabel>
          </Stat>
          <Stat>
            <StatValue>40</StatValue>
            <StatLabel>전문화 스코프</StatLabel>
          </Stat>
          <Stat>
            <StatValue>2,397</StatValue>
            <StatLabel>원자 노트</StatLabel>
          </Stat>
          <Stat>
            <StatValue>243</StatValue>
            <StatLabel>시너지 노트</StatLabel>
          </Stat>
        </Stats>
      </Hero>

      <Section>
        <ActionGrid>
          {actions.map(item => {
            const Icon = item.icon;
            return (
              <Action key={item.to} to={item.to} $color={item.color}>
                <ActionHeader $color={item.color}>
                  <Icon size={22} />
                  <span>{item.to}</span>
                </ActionHeader>
                <div>
                  <ActionTitle>{item.title}</ActionTitle>
                  <ActionText>{item.text}</ActionText>
                </div>
              </Action>
            );
          })}
        </ActionGrid>
      </Section>
    </Page>
  );
}

export default HomePage;
