import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FullTalentSystem } from './TalentGrid.js';
import EdgeRenderer from './EdgeRenderer.js';
import beastMasteryData from '../data/beastMasteryTalents.json';
// TypeScript types removed for JavaScript compatibility

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, #AAD372 0%, #7FB347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(170, 211, 114, 0.3);
`;

const Subtitle = styled.p`
  color: #a0a0a0;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  &::before,
  &::after {
    content: '';
    height: 1px;
    width: 100px;
    background: linear-gradient(90deg, transparent, #AAD372, transparent);
  }
`;

const VersionBadge = styled.span`
  display: inline-block;
  background: rgba(170, 211, 114, 0.1);
  border: 1px solid rgba(170, 211, 114, 0.3);
  color: #AAD372;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-left: 10px;
`;

const InfoSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const InfoCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(170, 211, 114, 0.2);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
`;

const InfoTitle = styled.h3`
  color: #AAD372;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const InfoContent = styled.p`
  color: #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CoreAbilities = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 15px;
`;

const AbilityIcon = styled.img`
  width: 48px;
  height: 48px;
  border: 2px solid rgba(170, 211, 114, 0.5);
  border-radius: 6px;
  transition: transform 0.3s, border-color 0.3s;

  &:hover {
    transform: scale(1.1);
    border-color: #AAD372;
  }
`;

const BuildSection = styled.div`
  max-width: 1600px;
  margin: 40px auto;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 30px;
`;

const BuildTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid rgba(170, 211, 114, 0.2);
`;

const BuildTab = styled.button`
  background: ${props => props.active
    ? 'linear-gradient(135deg, #AAD372, #7FB347)'
    : 'transparent'};
  color: ${props => props.active ? '#1a1a2e' : '#a0a0a0'};
  border: none;
  padding: 10px 20px;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: ${props => props.active ? '#1a1a2e' : '#e0e0e0'};
    background: ${props => props.active
      ? 'linear-gradient(135deg, #AAD372, #7FB347)'
      : 'rgba(170, 211, 114, 0.1)'};
  }
`;

const BuildDescription = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(170, 211, 114, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: #e0e0e0;
`;

const PresetBuilds = {
  raid: {
    name: "레이드 빌드",
    description: "단일 대상 딜링에 최적화된 빌드입니다. 야수의 격노와 야생의 부름을 중심으로 구성됩니다.",
    classNodes: ["class_193530", "class_109215", "class_109304", "class_53271"],
    specNodes: ["spec_217200", "spec_34026", "spec_19574", "spec_270323"],
    heroTree: "pack_leader"
  },
  mythicplus: {
    name: "쐐기돌 빌드",
    description: "다중 대상 처리와 생존력을 균형있게 갖춘 빌드입니다.",
    classNodes: ["class_193530", "class_186265", "class_264656", "class_109248"],
    specNodes: ["spec_217200", "spec_193532", "spec_120679", "spec_378007"],
    heroTree: "dark_ranger"
  },
  pvp: {
    name: "PvP 빌드",
    description: "생존력과 제어기를 중심으로 한 대인전 빌드입니다.",
    classNodes: ["class_186265", "class_109248", "class_264656"],
    specNodes: ["spec_193532", "spec_120679"],
    heroTree: "dark_ranger"
  }
};

const BeastMasteryTalentTree = () => {
  const [selectedBuild, setSelectedBuild] = useState('custom');
  const [buildData, setBuildData] = useState(null);

  const handleBuildChange = useCallback((newBuildData) => {
    setBuildData(newBuildData);
    console.log('빌드 데이터 업데이트:', newBuildData);
  }, []);

  const loadPresetBuild = useCallback((buildType) => {
    const preset = PresetBuilds[buildType];
    // TODO: 프리셋 빌드를 실제로 로드하는 로직 구현
    console.log(`${preset.name} 로드 중...`);
    setSelectedBuild(buildType);
  }, []);

  // 타입 캐스팅
  const talentData = beastMasteryData;

  return (
    <Container>
      <Header>
        <Title>
          야수 사냥꾼 특성 계산기
          <VersionBadge>v11.0.5</VersionBadge>
        </Title>
        <Subtitle>Beast Mastery Hunter Talent Calculator</Subtitle>
      </Header>

      <InfoSection>
        <InfoCard>
          <InfoTitle>🏹 전문화 특징</InfoTitle>
          <InfoContent>
            원거리에서 다수의 야수를 조종하여 전투하는 사냥꾼 전문화입니다.
            펫 중심의 플레이스타일로 안정적인 딜링이 가능합니다.
          </InfoContent>
        </InfoCard>

        <InfoCard>
          <InfoTitle>⚔️ 핵심 기술</InfoTitle>
          <CoreAbilities>
            <AbilityIcon
              src="https://wow.zamimg.com/images/wow/icons/large/ability_hunter_killcommand.jpg"
              alt="처치 명령"
              title="처치 명령"
            />
            <AbilityIcon
              src="https://wow.zamimg.com/images/wow/icons/large/ability_hunter_barbedshot.jpg"
              alt="날카로운 사격"
              title="날카로운 사격"
            />
            <AbilityIcon
              src="https://wow.zamimg.com/images/wow/icons/large/ability_druid_ferociousbite.jpg"
              alt="야수의 격노"
              title="야수의 격노"
            />
          </CoreAbilities>
        </InfoCard>

        <InfoCard>
          <InfoTitle>🦸 영웅 특성</InfoTitle>
          <InfoContent>
            <strong>무리의 지도자</strong>: 다수의 야수 강화<br/>
            <strong>어둠 순찰자</strong>: 암흑 피해 추가
          </InfoContent>
        </InfoCard>
      </InfoSection>

      <BuildSection>
        <BuildTabs>
          <BuildTab
            active={selectedBuild === 'custom'}
            onClick={() => setSelectedBuild('custom')}
          >
            커스텀 빌드
          </BuildTab>
          <BuildTab
            active={selectedBuild === 'raid'}
            onClick={() => loadPresetBuild('raid')}
          >
            레이드
          </BuildTab>
          <BuildTab
            active={selectedBuild === 'mythicplus'}
            onClick={() => loadPresetBuild('mythicplus')}
          >
            쐐기돌
          </BuildTab>
          <BuildTab
            active={selectedBuild === 'pvp'}
            onClick={() => loadPresetBuild('pvp')}
          >
            PvP
          </BuildTab>
        </BuildTabs>

        {selectedBuild !== 'custom' && (
          <BuildDescription>
            <h4>{PresetBuilds[selectedBuild].name}</h4>
            <p>{PresetBuilds[selectedBuild].description}</p>
          </BuildDescription>
        )}

        <FullTalentSystem
          talentData={talentData}
          onBuildChange={handleBuildChange}
        />
      </BuildSection>
    </Container>
  );
};

export default BeastMasteryTalentTree;