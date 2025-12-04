import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SkillIcon } from './SkillIcon.js';

// ============================================================================
// Styled Components
// ============================================================================

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.nav`
  position: sticky;
  top: 2rem;
  height: fit-content;
  background: rgba(30, 30, 46, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);

  h3 {
    color: ${props => props.themeColor || '#3FC6EA'};
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #b0b0c0;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${props => props.themeColor || '#3FC6EA'};
    }
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled(motion.section)`
  background: rgba(30, 30, 46, 0.8);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(63, 198, 234, 0.1);

  h2 {
    color: ${props => props.themeColor || '#3FC6EA'};
    margin-bottom: 1.5rem;
    font-size: 2rem;
    border-bottom: 2px solid ${props => props.themeColor || '#3FC6EA'};
    padding-bottom: 0.5rem;
  }

  h3 {
    color: ${props => props.themeColor || '#3FC6EA'};
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const Header = styled.header`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(30, 30, 46, 0.9);
  border-radius: 12px;
  border: 2px solid ${props => props.themeColor || '#3FC6EA'};

  h1 {
    font-size: 3rem;
    color: ${props => props.themeColor || '#3FC6EA'};
    margin-bottom: 0.5rem;
    text-shadow: 0 0 20px ${props => props.themeColor || '#3FC6EA'}40;
  }

  p {
    font-size: 1.2rem;
    color: #b0b0c0;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? props.themeColor || '#3FC6EA' : 'rgba(30, 30, 46, 0.8)'};
  color: ${props => props.active ? '#1e1e2e' : '#b0b0c0'};
  border: 2px solid ${props => props.themeColor || '#3FC6EA'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.themeColor || '#3FC6EA'};
    color: #1e1e2e;
  }
`;

const OpenerList = styled.ol`
  list-style: none;
  counter-reset: opener-counter;
  padding: 0;

  li {
    counter-increment: opener-counter;
    position: relative;
    padding: 1rem 1rem 1rem 3.5rem;
    margin-bottom: 1rem;
    background: rgba(45, 45, 68, 0.6);
    border-radius: 8px;
    border-left: 4px solid ${props => props.themeColor || '#3FC6EA'};

    &::before {
      content: counter(opener-counter);
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 2rem;
      height: 2rem;
      background: ${props => props.themeColor || '#3FC6EA'};
      color: #1e1e2e;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  }
`;

const PriorityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PriorityItem = styled.div`
  background: rgba(45, 45, 68, 0.6);
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid ${props => {
    if (props.priority === 0) return '#ff4444';
    if (props.priority === 1) return '#ff8844';
    if (props.priority === 2) return '#ffcc44';
    return '#44ccff';
  }};

  .priority-number {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: ${props => {
      if (props.priority === 0) return '#ff4444';
      if (props.priority === 1) return '#ff8844';
      if (props.priority === 2) return '#ffcc44';
      return '#44ccff';
    }};
    color: #1e1e2e;
    border-radius: 50%;
    text-align: center;
    line-height: 2rem;
    font-weight: bold;
    margin-right: 1rem;
  }

  .skill-desc {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .conditions {
    font-style: italic;
    color: #b0b0c0;
    margin-bottom: 0.5rem;
  }

  .why {
    color: #3FC6EA;
  }
`;

const TalentBuildCard = styled.div`
  background: rgba(45, 45, 68, 0.6);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid ${props => props.themeColor || '#3FC6EA'};

  h4 {
    color: ${props => props.themeColor || '#3FC6EA'};
    margin-bottom: 1rem;
  }

  .build-code {
    background: rgba(30, 30, 46, 0.8);
    padding: 1rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    word-break: break-all;
    margin: 1rem 0;
  }

  button {
    background: ${props => props.themeColor || '#3FC6EA'};
    color: #1e1e2e;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const StatPriorityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .stat-item {
    display: flex;
    align-items: center;
    background: rgba(45, 45, 68, 0.6);
    border-radius: 8px;
    padding: 1rem;

    .stat-rank {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background: ${props => props.themeColor || '#3FC6EA'};
      color: #1e1e2e;
      border-radius: 50%;
      font-weight: bold;
      margin-right: 1rem;
    }

    .stat-name {
      flex: 1;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .stat-weight {
      color: #3FC6EA;
      margin-right: 1rem;
    }

    .stat-note {
      color: #b0b0c0;
      font-style: italic;
    }
  }
`;

// ============================================================================
// Sub-Components
// ============================================================================

const OverviewSection = ({ config, themeColor }) => (
  <Section id="overview" themeColor={themeColor}>
    <h2>개요</h2>
    <h3>리소스 시스템</h3>
    <p><strong>주 리소스:</strong> {config.resource?.primary || 'N/A'}</p>
    {config.resource?.secondary && (
      <p><strong>부 리소스:</strong> {config.resource.secondary}</p>
    )}
    {config.resource?.mechanics && (
      <div>
        <h4>핵심 메커니즘</h4>
        <ul>
          {config.resource.mechanics.map((mech, idx) => (
            <li key={idx}>{mech}</li>
          ))}
        </ul>
      </div>
    )}

    {config.tierSet && (
      <div>
        <h3>티어 세트 효과</h3>
        <p><strong>2세트:</strong> {config.tierSet['2set']}</p>
        <p><strong>4세트:</strong> {config.tierSet['4set']}</p>
      </div>
    )}
  </Section>
);

const RotationSection = ({ config, rotation, skills, themeColor }) => {
  const [activeHero, setActiveHero] = useState(config.heroTalents?.[0]?.key || 'default');

  const heroData = rotation[activeHero] || {};

  return (
    <Section id="rotation" themeColor={themeColor}>
      <h2>딜사이클</h2>

      {config.heroTalents && config.heroTalents.length > 1 && (
        <TabContainer>
          {config.heroTalents.map(hero => (
            <Tab
              key={hero.key}
              active={activeHero === hero.key}
              themeColor={themeColor}
              onClick={() => setActiveHero(hero.key)}
            >
              {hero.korean}
            </Tab>
          ))}
        </TabContainer>
      )}

      {heroData.opener && (
        <div>
          <h3>오프닝</h3>
          <OpenerList themeColor={themeColor}>
            {heroData.opener.map((item, idx) => (
              <li key={idx}>
                {skills[item.skillId] && (
                  <SkillIcon skillData={skills[item.skillId]} />
                )}
                <div>
                  {item.timing && <strong>{item.timing}:</strong>} {item.note}
                </div>
              </li>
            ))}
          </OpenerList>
        </div>
      )}

      {heroData.singleTarget && (
        <div>
          <h3>단일 대상 우선순위</h3>
          <PriorityList>
            {heroData.singleTarget.map((item, idx) => (
              <PriorityItem key={idx} priority={item.priority}>
                <div>
                  <span className="priority-number">{item.priority}</span>
                  {skills[item.skillId] && (
                    <SkillIcon skillData={skills[item.skillId]} />
                  )}
                </div>
                <div className="skill-desc">{item.desc || skills[item.skillId]?.koreanName}</div>
                {item.conditions && (
                  <div className="conditions">조건: {item.conditions.join(', ')}</div>
                )}
                {item.why && <div className="why">이유: {item.why}</div>}
              </PriorityItem>
            ))}
          </PriorityList>
        </div>
      )}

      {heroData.aoe && (
        <div>
          <h3>다수 대상 (AoE)</h3>
          <PriorityList>
            {heroData.aoe.map((item, idx) => (
              <PriorityItem key={idx} priority={item.priority}>
                <div>
                  <span className="priority-number">{item.priority}</span>
                  {skills[item.skillId] && (
                    <SkillIcon skillData={skills[item.skillId]} />
                  )}
                </div>
                <div className="skill-desc">{item.desc || skills[item.skillId]?.koreanName}</div>
                {item.conditions && (
                  <div className="conditions">조건: {item.conditions.join(', ')}</div>
                )}
                {item.why && <div className="why">이유: {item.why}</div>}
              </PriorityItem>
            ))}
          </PriorityList>
        </div>
      )}
    </Section>
  );
};

const TalentSection = ({ config, talents, themeColor }) => {
  const [activeHero, setActiveHero] = useState(config.heroTalents?.[0]?.key || 'default');

  const heroTalents = talents[activeHero] || {};

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('특성 코드가 복사되었습니다!');
  };

  return (
    <Section id="talents" themeColor={themeColor}>
      <h2>특성 빌드</h2>

      {config.heroTalents && config.heroTalents.length > 1 && (
        <TabContainer>
          {config.heroTalents.map(hero => (
            <Tab
              key={hero.key}
              active={activeHero === hero.key}
              themeColor={themeColor}
              onClick={() => setActiveHero(hero.key)}
            >
              {hero.korean}
            </Tab>
          ))}
        </TabContainer>
      )}

      {heroTalents.raid && (
        <TalentBuildCard themeColor={themeColor}>
          <h4>레이드 빌드</h4>
          <p>{heroTalents.raid.description}</p>
          <div className="build-code">{heroTalents.raid.code}</div>
          <button onClick={() => copyToClipboard(heroTalents.raid.code)}>
            코드 복사
          </button>
          {heroTalents.raid.url && (
            <a href={heroTalents.raid.url} target="_blank" rel="noopener noreferrer">
              Wowhead에서 보기 →
            </a>
          )}
        </TalentBuildCard>
      )}

      {heroTalents.mythicPlus && (
        <TalentBuildCard themeColor={themeColor}>
          <h4>쐐기돌 빌드</h4>
          <p>{heroTalents.mythicPlus.description}</p>
          <div className="build-code">{heroTalents.mythicPlus.code}</div>
          <button onClick={() => copyToClipboard(heroTalents.mythicPlus.code)}>
            코드 복사
          </button>
          {heroTalents.mythicPlus.url && (
            <a href={heroTalents.mythicPlus.url} target="_blank" rel="noopener noreferrer">
              Wowhead에서 보기 →
            </a>
          )}
        </TalentBuildCard>
      )}
    </Section>
  );
};

const StatsSection = ({ config, stats, themeColor }) => {
  const [activeHero, setActiveHero] = useState(config.heroTalents?.[0]?.key || 'default');

  const heroStats = stats[activeHero] || {};

  return (
    <Section id="stats" themeColor={themeColor}>
      <h2>스탯 우선순위</h2>

      {config.heroTalents && config.heroTalents.length > 1 && (
        <TabContainer>
          {config.heroTalents.map(hero => (
            <Tab
              key={hero.key}
              active={activeHero === hero.key}
              themeColor={themeColor}
              onClick={() => setActiveHero(hero.key)}
            >
              {hero.korean}
            </Tab>
          ))}
        </TabContainer>
      )}

      {heroStats.priority && (
        <StatPriorityList themeColor={themeColor}>
          {heroStats.priority.map((statItem, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-rank">{idx + 1}</div>
              <div className="stat-name">{statItem.stat}</div>
              <div className="stat-weight">가중치: {statItem.weight}</div>
              <div className="stat-note">{statItem.note}</div>
            </div>
          ))}
        </StatPriorityList>
      )}

      {heroStats.breakpoints && heroStats.breakpoints.length > 0 && (
        <div>
          <h3>중요 스탯 브레이크포인트</h3>
          <ul>
            {heroStats.breakpoints.map((bp, idx) => (
              <li key={idx}>
                <strong>{bp.stat} {bp.value}:</strong> {bp.note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
};

// ============================================================================
// Main GuideRenderer Component
// ============================================================================

export const GuideRenderer = ({ specData }) => {
  const { config, rotation, talents, stats, skills } = specData;

  // 클래스별 테마 색상
  const getThemeColor = (className) => {
    const colors = {
      warrior: '#C79C6E',
      paladin: '#F58CBA',
      hunter: '#ABD473',
      rogue: '#FFF569',
      priest: '#FFFFFF',
      deathknight: '#C41E3A',
      shaman: '#0070DE',
      mage: '#3FC6EA',
      warlock: '#8787ED',
      monk: '#00FF96',
      druid: '#FF7D0A',
      demonhunter: '#A330C9',
      evoker: '#33937F'
    };
    return colors[className] || '#3FC6EA';
  };

  const themeColor = getThemeColor(config.class);

  const navigationSections = [
    { id: 'overview', name: '개요' },
    { id: 'rotation', name: '딜사이클' },
    { id: 'talents', name: '특성 빌드' },
    { id: 'stats', name: '스탯' }
  ];

  return (
    <PageWrapper>
      <Header themeColor={themeColor}>
        <h1>{config.koreanName}</h1>
        <p>{config.englishName}</p>
        {config.meta && (
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#888' }}>
            패치 {config.meta.patch} | 마지막 업데이트: {config.meta.lastUpdated}
          </p>
        )}
      </Header>

      <Container>
        <Sidebar themeColor={themeColor}>
          <h3>목차</h3>
          <ul>
            {navigationSections.map(section => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.name}</a>
              </li>
            ))}
          </ul>

          {config.heroTalents && (
            <>
              <h3 style={{ marginTop: '2rem' }}>영웅 특성</h3>
              <ul>
                {config.heroTalents.map(hero => (
                  <li key={hero.key}>{hero.korean}</li>
                ))}
              </ul>
            </>
          )}
        </Sidebar>

        <MainContent>
          <OverviewSection config={config} themeColor={themeColor} />
          <RotationSection config={config} rotation={rotation} skills={skills} themeColor={themeColor} />
          <TalentSection config={config} talents={talents} themeColor={themeColor} />
          <StatsSection config={config} stats={stats} themeColor={themeColor} />
        </MainContent>
      </Container>
    </PageWrapper>
  );
};

export default GuideRenderer;
