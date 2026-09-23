import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowUpRight, Construction } from 'lucide-react';
import { guideManuscripts } from '../data/guideManuscripts.js';
import { getGuidePublication } from '../data/guideUpdates.js';
import SpecializationIcon from '../components/SpecializationIcon.js';
import {
  guideRoles,
  guideSpecsByRole,
  getAllGuideSpecs,
  getGroupedGuideSpecs,
} from '../data/guideRegistry.js';

const Page = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 96px;

  @media (max-width: 560px) {
    width: calc(100% - 24px);
    padding-top: 30px;
  }
`;

const Header = styled.header`
  display: grid;
  gap: 30px;
  margin-bottom: 32px;
`;

const Eyebrow = styled.p`
  color: #d2b373;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin-top: 8px;
  color: #eef1f3;
  font-size: clamp(2rem, 4vw, 3.1rem);
  line-height: 1.14;
  letter-spacing: 0;
`;

const Description = styled.p`
  max-width: 780px;
  margin-top: 12px;
  color: #aeb8be;
  font-size: 1rem;
  font-weight: 450;
  line-height: 1.78;
  word-break: keep-all;
  text-wrap: pretty;
`;

const HeaderPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  padding: 11px 0;
  border-top: 1px solid rgba(168, 178, 188, 0.14);
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
`;

const HeaderMetric = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 20px;
  color: #dfe4e7;
  font-size: 0.82rem;
  font-weight: 620;
  border-left: 1px solid rgba(168, 178, 188, 0.14);

  &:first-child {
    padding-left: 0;
    border-left: 0;
  }

  span:first-child {
    color: #7f8b94;
    font-size: 0.66rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  @media (max-width: 620px) {
    width: 100%;
    padding: 6px 0;
    border-left: 0;
  }
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 22px;
  margin-bottom: 38px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
`;

const TransitionNotice = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: -18px 0 30px;
  padding: 9px 12px;
  border-left: 3px solid #d2b373;
  background: rgba(210, 179, 115, 0.08);
  color: #c9c3b5;
  font-size: 0.78rem;
  line-height: 1.5;

  svg { flex: 0 0 auto; color: #e6c583; }
`;

const Tab = styled.button`
  min-height: 44px;
  padding: 2px 0 0;
  border: 0;
  border-bottom: 2px solid ${props => (props.$active ? '#d2b373' : 'transparent')};
  background: transparent;
  color: ${props => (props.$active ? '#eef1f3' : '#8f9aa2')};
  font-size: 0.84rem;
  font-weight: ${props => (props.$active ? 700 : 520)};

  &:hover {
    color: #eef1f3;
  }
`;

const ClassSection = styled.section`
  margin-top: 24px;
`;

const ClassTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => props.$color};
  font-size: 1.12rem;
  margin-bottom: 8px;
`;

const ClassMark = styled.span`
  width: 5px;
  height: 18px;
  background: ${props => props.$color};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 12px;
  border-top: 1px solid rgba(168, 178, 188, 0.12);

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const SpecCard = styled(Link)`
  position: relative;
  min-width: 0;
  min-height: 80px;
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.11);
  border-left: 3px solid transparent;
  background: ${props => props.$partial ? 'rgba(226, 180, 91, 0.075)' : 'transparent'};

  &::after {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 5px;
    pointer-events: none;
    background: ${props => props.$partial
      ? 'repeating-linear-gradient(180deg, #d2b373 0 7px, #5d4c30 7px 14px)'
      : 'none'};
  }

  &:hover {
    border-left-color: ${props => props.$color};
    background: ${props => props.$tone};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.$color};
    outline-offset: -2px;
  }

  &:hover [data-spec-icon], &:focus-visible [data-spec-icon] {
    opacity: 0.86;
  }

  @media (max-width: 360px) {
    gap: 3px;
    padding: 6px 8px;
  }
`;

const SpecTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
`;

const SpecName = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e7ebed;
  font-size: 1.05rem;
  font-weight: 680;
  letter-spacing: 0;
  word-break: keep-all;
`;

const OpenIcon = styled.span`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  color: ${props => props.$partial ? '#e6c583' : '#9aa5ad'};
  border: 0;
  background: transparent;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 4px;
  color: #9aa5ad;
  font-size: 0.76rem;
  font-weight: 470;

  span {
    white-space: nowrap;
  }
`;

const WorkStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 6px;
  border: 1px solid rgba(230, 197, 131, 0.5);
  border-radius: 2px;
  background: rgba(210, 179, 115, 0.12);
  color: #f0d7a1;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
`;

function GuidePage() {
  const [role, setRole] = useState('all');

  const visibleSpecs = useMemo(() => {
    return role === 'all' ? getAllGuideSpecs() : guideSpecsByRole[role] || [];
  }, [role]);

  const grouped = useMemo(() => getGroupedGuideSpecs(visibleSpecs), [visibleSpecs]);
  const allSpecs = useMemo(() => getAllGuideSpecs(), []);
  const transitioningCount = allSpecs.filter(item =>
    getGuidePublication(item.id, guideManuscripts[item.id]).partial
  ).length;

  return (
    <Page>
      <Header>
        <div>
          <Eyebrow>WOWMETA GUIDE INDEX</Eyebrow>
          <Title>직업 가이드</Title>
          <Description>
            각 전문화의 핵심 스킬, 특성, 시너지 관계를 기준으로 가이드를 연결했습니다.
            포지션별 기본 골조는 유지하고, 딜사이클과 방어/힐링 차트는 전문화별 운용에 맞춰 배치했습니다.
          </Description>
        </div>
        <HeaderPanel>
          <HeaderMetric>
            <span>patch</span>
            <strong>전문화별 표기</strong>
          </HeaderMetric>
          <HeaderMetric>
            <span>guides</span>
            <strong>{allSpecs.length}개 전문화</strong>
          </HeaderMetric>
          <HeaderMetric>
            <span>source</span>
            <strong>Wowhead 툴팁 + 로그</strong>
          </HeaderMetric>
        </HeaderPanel>
      </Header>

      <Tabs role="group" aria-label="포지션별 가이드 필터">
        {guideRoles.map(item => (
          <Tab
            key={item.id}
            type="button"
            aria-pressed={role === item.id}
            $active={role === item.id}
            onClick={() => setRole(item.id)}
          >
            {item.label}
          </Tab>
        ))}
      </Tabs>

      {transitioningCount > 0 && (
        <TransitionNotice>
          <Construction size={15} aria-hidden="true" />
          공사 중 표시가 있는 {transitioningCount}개 가이드는 12.1 전환·검수 중입니다. 이전 패치 내용이 남아 있을 수 있습니다.
        </TransitionNotice>
      )}

      {grouped.map(group => (
        <ClassSection key={group.name} aria-label={`${group.name} 가이드`}>
          <ClassTitle $color={group.color}>
            <ClassMark $color={group.color} />
            {group.name}
          </ClassTitle>
          <Grid>
            {group.specs.map(item => {
              const publication = getGuidePublication(item.id, guideManuscripts[item.id]);
              return (
              <SpecCard key={item.id} to={item.path} $color={item.color} $tone={`${item.color}18`} $partial={publication.partial}>
                <SpecTop>
                  <SpecName>
                    <SpecializationIcon $specId={item.id} />
                    {item.spec}
                  </SpecName>
                  <OpenIcon $partial={publication.partial} aria-hidden="true">
                    {publication.partial ? <Construction size={16} /> : <ArrowUpRight size={16} />}
                  </OpenIcon>
                </SpecTop>
                <Meta>
                  <span>{item.roleLabel}</span>
                  {publication.partial ? (
                    <WorkStatus title={publication.detail} aria-label={publication.detail}>
                      공사 중
                    </WorkStatus>
                  ) : <span title={publication.detail}>{publication.label}</span>}
                </Meta>
              </SpecCard>
              );
            })}
          </Grid>
        </ClassSection>
      ))}
    </Page>
  );
}

export default GuidePage;
