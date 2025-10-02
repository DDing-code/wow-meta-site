import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gameIcons, classIcons, WowIcon } from '../utils/wowIcons';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  border-left: 4px solid ${props => props.theme.colors.accent};
`;

const ClassFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ClassButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? props.color : props.theme.colors.surface};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.color};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.color};
    color: white;
  }
`;

const HeroTalentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const HeroTalentCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const TalentHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.color}60, ${props => props.color}30);
  padding: 1.5rem;
  border-bottom: 3px solid ${props => props.color};
`;

const TalentName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const TalentSpecs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SpecBadge = styled.span`
  background: ${props => props.theme.colors.secondary};
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text};
`;

const TalentContent = styled.div`
  padding: 1.5rem;
`;

const AbilityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Ability = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.accent};
`;

const AbilityName = styled.div`
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CoreBadge = styled.span`
  background: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.primary};
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const AbilityEffect = styled.div`
  color: ${props => props.theme.colors.subtext};
  font-size: 0.9rem;
  line-height: 1.4;
`;

function HeroTalentsPage() {
  const [selectedClass, setSelectedClass] = useState('all');

  const classColors = {
    deathknight: '#C41E3A',
    demonhunter: '#A330C9',
    druid: '#FF7C0A',
    evoker: '#33937F',
    hunter: '#AAD372',
    mage: '#3FC7EB',
    monk: '#00FF98',
    paladin: '#F48CBA',
    priest: '#FFFFFF',
    rogue: '#FFF468',
    shaman: '#0070DD',
    warlock: '#8788EE',
    warrior: '#C69B6D'
  };

  const classNames = {
    deathknight: '죽음기사',
    demonhunter: '악마사냥꾼',
    druid: '드루이드',
    evoker: '기원사',
    hunter: '사냥꾼',
    mage: '마법사',
    monk: '수도사',
    paladin: '성기사',
    priest: '사제',
    rogue: '도적',
    shaman: '주술사',
    warlock: '흑마법사',
    warrior: '전사'
  };

  const heroTalents = [
    {
      class: 'deathknight',
      name: '죽음인도자',
      specs: ['혈기', '냉기'],
      abilities: [
        { name: '사신의 표식', nameKr: 'Reaper\'s Mark', core: true, effect: '대상에 표식을 남겨 추가 암흑 피해' },
        { name: '박멸', nameKr: 'Exterminate', effect: '표식 대상에게 극대화 확률 증가' },
        { name: '피의 열병', nameKr: 'Blood Fever', effect: '질병 피해 증가' }
      ]
    },
    {
      class: 'deathknight',
      name: '묵시록의 기수',
      specs: ['냉기', '부정'],
      abilities: [
        { name: '기수의 용사', nameKr: 'Rider\'s Champion', core: true, effect: '묵시록 기수 소환' },
        { name: '기수의 원조', nameKr: 'Horseman\'s Aid', effect: '기수가 추가 공격' },
        { name: '창백한 말 위에', nameKr: 'On a Paler Horse', effect: '이동 속도 증가' }
      ]
    },
    {
      class: 'warrior',
      name: '거인',
      specs: ['무기', '방어'],
      abilities: [
        { name: '파괴', nameKr: 'Demolish', core: true, effect: '강력한 피해와 방깎' },
        { name: '거인의 힘', nameKr: 'Colossal Might', effect: '크기와 피해 증가' },
        { name: '무예 전문가', nameKr: 'Martial Expert', effect: '극대화 피해 증가' }
      ]
    },
    {
      class: 'warrior',
      name: '산악 영주',
      specs: ['무기', '분노'],
      abilities: [
        { name: '천둥 폭발', nameKr: 'Thunder Blast', core: true, effect: '번개 피해와 감속' },
        { name: '폭풍의 화신', nameKr: 'Avatar of the Storm', effect: '번개 강화' },
        { name: '번개 강타', nameKr: 'Lightning Strikes', effect: '자동 번개 공격' }
      ]
    },
    {
      class: 'paladin',
      name: '태양의 전령',
      specs: ['신성', '보호'],
      abilities: [
        { name: '태양의 화신', nameKr: 'Sun\'s Avatar', core: true, effect: '태양 에너지 폭발' },
        { name: '샛별', nameKr: 'Morning Star', effect: '신성 피해 증가' },
        { name: '오로라', nameKr: 'Aurora', effect: '치유 효과 증가' }
      ]
    },
    {
      class: 'mage',
      name: '서리불꽃',
      specs: ['비전', '냉기', '화염'],
      abilities: [
        { name: '서리불꽃 화살', nameKr: 'Frostfire Bolt', core: true, effect: '서리와 화염 동시 피해' },
        { name: '주입된 보호', nameKr: 'Imbued Warding', effect: '마법 보호막 강화' },
        { name: '원소 친화', nameKr: 'Elemental Affinity', effect: '원소 피해 증가' }
      ]
    },
    {
      class: 'priest',
      name: '대천사',
      specs: ['수양', '신성', '암흑'],
      abilities: [
        { name: '후광', nameKr: 'Halo', core: true, effect: '확장 고리 피해/치유' },
        { name: '완성된 형태', nameKr: 'Perfected Form', effect: '능력 강화' },
        { name: '공명하는 에너지', nameKr: 'Resonant Energy', effect: '연쇄 효과' }
      ]
    },
    {
      class: 'shaman',
      name: '폭풍인도자',
      specs: ['정기', '고양'],
      abilities: [
        { name: '폭풍우', nameKr: 'Tempest', core: true, effect: '폭풍 소환' },
        { name: '쇄도하는 토템', nameKr: 'Surging Totem', effect: '전기 토템' },
        { name: '전호 방출', nameKr: 'Arc Discharge', effect: '연쇄 번개' }
      ]
    },
    {
      class: 'druid',
      name: '발톱의 드루이드',
      specs: ['수호', '야성'],
      abilities: [
        { name: '유린', nameKr: 'Ravage', core: true, effect: '강력한 출혈 공격' },
        { name: '야생력 쇄도', nameKr: 'Wildpower Surge', effect: '야생 에너지 폭발' },
        { name: '살상 타격', nameKr: 'Killing Strikes', effect: '극대화 피해 증가' }
      ]
    },
    {
      class: 'evoker',
      name: '시간감시자',
      specs: ['증강', '보존'],
      abilities: [
        { name: '시간 건너뛰기', nameKr: 'Time Skip', core: true, effect: '시간 조작' },
        { name: '시간 폭발', nameKr: 'Temporal Burst', effect: '시간 에너지 방출' },
        { name: '역전', nameKr: 'Reversal', effect: '상태 되돌리기' }
      ]
    },
    {
      class: 'hunter',
      name: '어둠순찰자',
      specs: ['야수', '사격', '생존'],
      abilities: [
        { name: '검은 화살', nameKr: 'Black Arrow', core: true, effect: '암흑 피해 화살' },
        { name: '그림자 사냥개', nameKr: 'Shadow Hounds', effect: '그림자 소환수' },
        { name: '연막', nameKr: 'Smoke Screen', effect: '은신 효과' }
      ]
    },
    {
      class: 'monk',
      name: '천신의 전달자',
      specs: ['운무', '풍운'],
      abilities: [
        { name: '천신 전달', nameKr: 'Celestial Conduit', core: true, effect: '천신 에너지 전달' },
        { name: '팔월의 축복', nameKr: 'August Blessing', effect: '치유/피해 증가' },
        { name: '비취 성역', nameKr: 'Jade Sanctuary', effect: '보호 영역' }
      ]
    },
    {
      class: 'rogue',
      name: '죽음추적자',
      specs: ['암살', '잠행'],
      abilities: [
        { name: '죽음추적자의 표식', nameKr: 'Deathstalker\'s Mark', core: true, effect: '표식 추적' },
        { name: '가장 어두운 밤', nameKr: 'Darkest Night', effect: '암흑 강화' },
        { name: '추격', nameKr: 'Hunt Them Down', effect: '이동 속도 증가' }
      ]
    },
    {
      class: 'warlock',
      name: '악마술사',
      specs: ['고통', '악마', '파괴'],
      abilities: [
        { name: '악마 의식', nameKr: 'Diabolic Ritual', core: true, effect: '악마 소환 의식' },
        { name: '갈라진 영혼', nameKr: 'Cloven Souls', effect: '영혼 분리' },
        { name: '악마단의 비밀', nameKr: 'Secrets of the Coven', effect: '비밀 지식' }
      ]
    }
  ];

  const filteredTalents = selectedClass === 'all'
    ? heroTalents
    : heroTalents.filter(talent => talent.class === selectedClass);

  return (
    <Container>
      <PageTitle>영웅 특성</PageTitle>

      <InfoBox>
        <p>11.2 패치의 영웅 특성 시스템입니다. 각 클래스마다 3개의 영웅 특성 트리가 있으며,
        각 스펙은 2개의 영웅 특성 중 선택할 수 있습니다.</p>
      </InfoBox>

      <ClassFilter>
        <ClassButton
          active={selectedClass === 'all'}
          color={props => props.theme.colors.accent}
          onClick={() => setSelectedClass('all')}
        >
          전체
        </ClassButton>
        {Object.entries(classNames).map(([key, name]) => (
          <ClassButton
            key={key}
            active={selectedClass === key}
            color={classColors[key]}
            onClick={() => setSelectedClass(key)}
          >
            {name}
          </ClassButton>
        ))}
      </ClassFilter>

      <HeroTalentGrid>
        {filteredTalents.map((talent, index) => (
          <HeroTalentCard
            key={`${talent.class}-${talent.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <TalentHeader color={classColors[talent.class]}>
              <TalentName>{talent.name}</TalentName>
              <TalentSpecs>
                {talent.specs.map(spec => (
                  <SpecBadge key={spec}>{spec}</SpecBadge>
                ))}
              </TalentSpecs>
            </TalentHeader>

            <TalentContent>
              <AbilityList>
                {talent.abilities.map(ability => (
                  <Ability key={ability.name}>
                    <AbilityName>
                      {ability.nameKr}
                      {ability.core && <CoreBadge>핵심</CoreBadge>}
                    </AbilityName>
                    <AbilityEffect>{ability.effect}</AbilityEffect>
                  </Ability>
                ))}
              </AbilityList>
            </TalentContent>
          </HeroTalentCard>
        ))}
      </HeroTalentGrid>
    </Container>
  );
}

export default HeroTalentsPage;