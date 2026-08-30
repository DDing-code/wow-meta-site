import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BookOpen, Database, Newspaper } from 'lucide-react';

const Page = styled.div`
  width: min(1080px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 96px;

  @media (max-width: 560px) {
    width: calc(100% - 24px);
    padding-top: 30px;
  }
`;

const Hero = styled.section`
  display: grid;
  gap: 18px;
  padding: 18px 0 36px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
`;

const Label = styled.p`
  color: #d2b373;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  max-width: 760px;
  color: #eef1f3;
  font-size: clamp(2.1rem, 4vw, 3.4rem);
  line-height: 1.14;
  letter-spacing: 0;
`;

const Summary = styled.p`
  max-width: 720px;
  color: #aeb8be;
  font-size: 1rem;
  font-weight: 450;
  line-height: 1.78;
  word-break: keep-all;
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin-top: 8px;
  border-top: 1px solid rgba(168, 178, 188, 0.12);
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);
`;

const Stat = styled.div`
  min-width: 132px;
  padding: 10px 18px;
  border-left: 1px solid rgba(168, 178, 188, 0.12);
  background: transparent;

  &:first-child {
    padding-left: 0;
    border-left: 0;
  }
`;

const StatValue = styled.div`
  color: #e7ebed;
  font-size: 1rem;
  font-weight: 700;
`;

const StatLabel = styled.div`
  color: #7f8b94;
  font-size: 0.7rem;
  font-weight: 520;
`;

const Section = styled.section`
  padding-top: 38px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid rgba(168, 178, 188, 0.12);

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const Action = styled(Link)`
  min-height: 138px;
  display: grid;
  align-content: space-between;
  gap: 20px;
  padding: 20px 18px;
  border-right: 1px solid rgba(168, 178, 188, 0.12);
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);
  background: transparent;

  &:hover {
    box-shadow: inset 0 2px 0 ${props => props.$color};
    background: rgba(168, 178, 188, 0.035);
  }

  &:focus-visible {
    outline-color: ${props => props.$color};
    outline-offset: -2px;
  }

  @media (max-width: 780px) {
    border-left: 1px solid rgba(168, 178, 188, 0.12);
  }
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.$color};
`;

const ActionTitle = styled.h2`
  color: #e7ebed;
  font-size: 1.12rem;
`;

const ActionText = styled.p`
  margin-top: 6px;
  color: #929da5;
  font-size: 0.88rem;
  font-weight: 450;
  line-height: 1.65;
`;

const actions = [
  {
    to: '/guide',
    title: '직업 가이드',
    text: '역할과 직업을 고르고 전문화별 공략을 읽습니다.',
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
    title: '업데이트',
    text: '패치 변경과 가이드 갱신 내역을 확인합니다.',
    color: '#AAD372',
    icon: Newspaper,
  },
];

function HomePage() {
  return (
    <Page>
      <Hero>
        <Label>WOWMETA</Label>
        <Title>전문화별 실전 가이드</Title>
        <Summary>
          현재 패치의 빌드와 전투 흐름, 핵심 스킬과 로그 기준을 한곳에서 확인합니다.
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
            <StatValue>2,477</StatValue>
            <StatLabel>원자 노트</StatLabel>
          </Stat>
          <Stat>
            <StatValue>428</StatValue>
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
