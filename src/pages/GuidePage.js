import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowUpRight } from 'lucide-react';
import { guideManuscripts } from '../data/guideManuscripts.js';
import { guideSpecIcons } from '../data/guideSpecIcons.js';
import {
  CURRENT_PATCH_LABEL,
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
  min-width: 0;
  min-height: 80px;
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.11);
  border-left: 2px solid transparent;
  background: transparent;

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

const SpecIcon = styled.span`
  display: block;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  background-color: #ffffff;
  mask-image: url('/assets/spec-icons-white-v1.png');
  mask-mode: luminance;
  mask-size: ${1586 / 176 * 100}% ${992 / 176 * 100}%;
  mask-position: var(--spec-icon-position);
  mask-repeat: no-repeat;
  opacity: 0.58;
  transition: opacity 160ms ease;
`;

const OpenIcon = styled.span`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  color: #9aa5ad;
  border: 0;
  background: transparent;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 10px;
  color: #9aa5ad;
  font-size: 0.76rem;
  font-weight: 470;

  span {
    white-space: nowrap;
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

      {grouped.map(group => (
        <ClassSection key={group.name} aria-label={`${group.name} 가이드`}>
          <ClassTitle $color={group.color}>
            <ClassMark $color={group.color} />
            {group.name}
          </ClassTitle>
          <Grid>
            {group.specs.map(item => (
              <SpecCard key={item.id} to={item.path} $color={item.color} $tone={`${item.color}18`}>
                <SpecTop>
                  <SpecName>
                    <SpecIcon aria-hidden="true" data-spec-icon={item.id} style={{ '--spec-icon-position': guideSpecIcons[item.id] }} />
                    {item.spec}
                  </SpecName>
                  <OpenIcon aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </OpenIcon>
                </SpecTop>
                <Meta>
                  <span>{item.roleLabel}</span>
                  <span>{guideManuscripts[item.id]?.patch || CURRENT_PATCH_LABEL}</span>
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
