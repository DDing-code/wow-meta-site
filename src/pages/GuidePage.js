import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowUpRight, BookOpen, Layers3 } from 'lucide-react';
import {
  CURRENT_PATCH_LABEL,
  guideRoles,
  guideSpecsByRole,
  getAllGuideSpecs,
  getGroupedGuideSpecs,
} from '../data/guideRegistry.js';

const Page = styled.div`
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
  padding: 42px 0 84px;
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 360px);
  gap: 24px;
  align-items: end;
  margin-bottom: 28px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Eyebrow = styled.p`
  color: #b8915b;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin-top: 8px;
  color: #f4efe5;
  font-size: clamp(2rem, 5vw, 3.65rem);
  letter-spacing: 0;
`;

const Description = styled.p`
  max-width: 780px;
  margin-top: 12px;
  color: #c7bba7;
  font-size: 0.98rem;
  font-weight: 700;
  word-break: keep-all;
`;

const HeaderPanel = styled.div`
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid rgba(184, 145, 91, 0.26);
  background: #0d1216;
`;

const HeaderMetric = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #f4efe5;
  font-size: 0.92rem;
  font-weight: 900;

  span:first-child {
    color: #8d9aa3;
    font-size: 0.72rem;
    text-transform: uppercase;
  }
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 30px;
`;

const Tab = styled.button`
  min-height: 38px;
  padding: 8px 14px;
  border: 1px solid ${props => (props.$active ? '#b8915b' : 'rgba(184, 145, 91, 0.24)')};
  border-radius: 0;
  background: ${props => (props.$active ? 'rgba(184, 145, 91, 0.16)' : '#0d1216')};
  color: ${props => (props.$active ? '#f4efe5' : '#c7bba7')};
  font-weight: 900;
`;

const ClassSection = styled.section`
  margin-top: 26px;
`;

const ClassTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => props.$color};
  font-size: 1.18rem;
  margin-bottom: 10px;
`;

const ClassMark = styled.span`
  width: 8px;
  height: 22px;
  background: ${props => props.$color};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
`;

const SpecCard = styled(Link)`
  min-height: 118px;
  display: grid;
  align-content: space-between;
  gap: 18px;
  padding: 14px;
  border: 1px solid rgba(184, 145, 91, 0.2);
  border-left: 3px solid ${props => props.$color};
  background:
    linear-gradient(135deg, ${props => props.$tone} 0%, rgba(13, 18, 22, 0) 54%),
    #0d1216;

  &:hover {
    border-color: ${props => props.$color};
    transform: translateY(-1px);
  }
`;

const SpecTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
`;

const SpecName = styled.h3`
  color: #f4efe5;
  font-size: 1.05rem;
  letter-spacing: 0;
  word-break: keep-all;
`;

const SpecClass = styled.div`
  margin-top: 4px;
  color: #8d9aa3;
  font-size: 0.78rem;
  font-weight: 800;
`;

const OpenIcon = styled.span`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  color: #f4efe5;
  border: 1px solid rgba(244, 239, 229, 0.12);
  background: rgba(244, 239, 229, 0.04);
`;

const Meta = styled.div`
  display: grid;
  gap: 8px;
  color: #c7bba7;
  font-size: 0.8rem;
  font-weight: 800;
`;

const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;

  svg {
    flex: 0 0 auto;
    color: #b8915b;
  }
`;

function GuidePage() {
  const [role, setRole] = useState('all');

  const visibleSpecs = useMemo(() => {
    return role === 'all' ? getAllGuideSpecs() : guideSpecsByRole[role] || [];
  }, [role]);

  const grouped = useMemo(() => getGroupedGuideSpecs(visibleSpecs), [visibleSpecs]);
  const allSpecs = useMemo(() => getAllGuideSpecs(), []);

  return (
    <Page>
      <Header>
        <div>
          <Eyebrow>{CURRENT_PATCH_LABEL} guide index</Eyebrow>
          <Title>직업 가이드</Title>
          <Description>
            KB 원자 노트와 시너지 그래프를 기준으로 모든 전문화 가이드를 다시 연결했습니다.
            포지션별 공통 서식은 유지하고, 딜사이클과 방어/힐링 차트는 전문화 데이터에 맞춰 자동 구성됩니다.
          </Description>
        </div>
        <HeaderPanel>
          <HeaderMetric>
            <span>patch</span>
            <strong>{CURRENT_PATCH_LABEL}</strong>
          </HeaderMetric>
          <HeaderMetric>
            <span>guides</span>
            <strong>{allSpecs.length}개 전문화</strong>
          </HeaderMetric>
          <HeaderMetric>
            <span>source</span>
            <strong>KB + Wowhead 툴팁</strong>
          </HeaderMetric>
        </HeaderPanel>
      </Header>

      <Tabs>
        {guideRoles.map(item => (
          <Tab key={item.id} type="button" $active={role === item.id} onClick={() => setRole(item.id)}>
            {item.label}
          </Tab>
        ))}
      </Tabs>

      {grouped.map(group => (
        <ClassSection key={group.name}>
          <ClassTitle $color={group.color}>
            <ClassMark $color={group.color} />
            {group.name}
          </ClassTitle>
          <Grid>
            {group.specs.map(item => (
              <SpecCard key={item.id} to={item.path} $color={item.color} $tone={`${item.color}18`}>
                <SpecTop>
                  <div>
                    <SpecName>{item.spec}</SpecName>
                    <SpecClass>{item.roleLabel}</SpecClass>
                  </div>
                  <OpenIcon aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </OpenIcon>
                </SpecTop>
                <Meta>
                  <MetaLine>
                    <BookOpen size={14} />
                    <span>{item.status}</span>
                  </MetaLine>
                  <MetaLine>
                    <Layers3 size={14} />
                    <span>{item.focus}</span>
                  </MetaLine>
                </Meta>
              </SpecCard>
            ))}
          </Grid>
        </ClassSection>
      ))}
    </Page>
  );
}

export default GuidePage;
