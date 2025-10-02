import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Line, Bar } from 'recharts';

const AnalyzerContainer = styled.div`
  padding: 2rem;
`;

const SpecSection = styled.div`
  margin-bottom: 2rem;
`;

const SpecTitle = styled.h3`
  color: #F48CBA;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AbilityCard = styled(motion.div)`
  background: rgba(244, 140, 186, 0.1);
  border: 1px solid rgba(244, 140, 186, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

// 성기사 능력 데이터
const paladinAbilities = {
  holy: {
    name: '신성',
    abilities: [
      { id: 1, name: '신성 충격', type: '즉시 시전', icon: 'spell_holy_searinglight' },
      { id: 2, name: '빛의 섬광', type: '시전', castTime: 1.5, icon: 'spell_holy_flashheal' },
      { id: 3, name: '성스러운 빛', type: '시전', castTime: 2.5, icon: 'spell_holy_holybolt' },
      { id: 4, name: '천상의 보호막', type: '재사용 대기시간', cooldown: 300, icon: 'spell_holy_divineprotection' },
      { id: 5, name: '복수의 격노', type: '재사용 대기시간', cooldown: 120, icon: 'spell_holy_avengeswrath' },
      { id: 6, name: '신의 축복', type: '재사용 대기시간', cooldown: 180, icon: 'spell_holy_divineprovidence' }
    ],
    rotation: [
      '신성 충격을 쿨마다 사용',
      '급한 치유가 필요할 때 빛의 섬광',
      '예측 가능한 피해에는 성스러운 빛',
      '복수의 격노로 치유량 증폭'
    ]
  },
  protection: {
    name: '보호',
    abilities: [
      { id: 1, name: '정의의 방패', type: '즉시 시전', icon: 'spell_holy_avengersshield' },
      { id: 2, name: '축성의 망치', type: '즉시 시전', icon: 'spell_holy_sealofmight' },
      { id: 3, name: '심판', type: '즉시 시전', icon: 'spell_holy_righteousfury' },
      { id: 4, name: '응징의 방패', type: '재사용 대기시간', cooldown: 120, icon: 'spell_holy_ardentdefender' },
      { id: 5, name: '수호자의 고대 왕', type: '재사용 대기시간', cooldown: 300, icon: 'spell_holy_guardianspirit' },
      { id: 6, name: '축성', type: '재사용 대기시간', cooldown: 9, icon: 'spell_holy_consecration' }
    ],
    rotation: [
      '정의의 방패로 전투 시작 및 침묵',
      '축성을 항상 유지',
      '심판을 쿨마다 사용',
      '응징의 방패는 큰 피해 예상시 사용'
    ]
  },
  retribution: {
    name: '징벌',
    abilities: [
      { id: 1, name: '기사단의 선고', type: '즉시 시전', icon: 'spell_holy_surgeoflight' },
      { id: 2, name: '심판의 칼날', type: '즉시 시전', icon: 'spell_holy_bladeofjustice' },
      { id: 3, name: '천상의 폭풍', type: '신성한 힘 소모', icon: 'spell_holy_divineStorm' },
      { id: 4, name: '격노의 날개', type: '재사용 대기시간', cooldown: 120, icon: 'spell_holy_crusade' },
      { id: 5, name: '최후의 순간', type: '즉시 시전', icon: 'spell_holy_finalreckoning' },
      { id: 6, name: '처형', type: '재사용 대기시간', cooldown: 120, icon: 'spell_holy_execution' }
    ],
    rotation: [
      '격노의 날개를 쿨마다 사용',
      '신성한 힘 5개일 때 천상의 폭풍 또는 기사단의 선고',
      '심판의 칼날을 우선순위로 사용',
      '처형은 격노의 날개와 함께 사용'
    ]
  }
};

const PaladinAnalyzer = ({ spec = 'retribution', combatLog = [] }) => {
  const currentSpec = paladinAbilities[spec];

  const analyzeCombatLog = () => {
    const suggestions = [];

    if (spec === 'retribution') {
      suggestions.push({
        severity: 'major',
        text: '격노의 날개 사용 타이밍을 개선하세요. 버스트 구간에 맞춰 사용해야 합니다.'
      });
      suggestions.push({
        severity: 'minor',
        text: '신성한 힘이 최대치에 도달하기 전에 소모하세요.'
      });
    } else if (spec === 'holy') {
      suggestions.push({
        severity: 'minor',
        text: '신성 충격 사용 빈도를 높이세요. 재사용 대기시간마다 사용해야 합니다.'
      });
    } else if (spec === 'protection') {
      suggestions.push({
        severity: 'major',
        text: '축성 유지율이 낮습니다. 항상 바닥에 축성이 있어야 합니다.'
      });
    }

    return suggestions;
  };

  const suggestions = analyzeCombatLog();

  return (
    <AnalyzerContainer>
      <SpecSection>
        <SpecTitle>
          {currentSpec.name} 특성 분석
        </SpecTitle>

        <h4>주요 스킬</h4>
        {currentSpec.abilities.map((ability) => (
          <AbilityCard
            key={ability.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <h5>{ability.name}</h5>
            <p>유형: {ability.type}</p>
            {ability.cooldown && <p>재사용 대기시간: {ability.cooldown}초</p>}
            {ability.castTime && <p>시전 시간: {ability.castTime}초</p>}
          </AbilityCard>
        ))}

        <h4>권장 로테이션</h4>
        <ol>
          {currentSpec.rotation.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        <h4>개선 제안사항</h4>
        {suggestions.map((suggestion, index) => (
          <div key={index} style={{
            padding: '1rem',
            marginBottom: '1rem',
            background: suggestion.severity === 'major' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,0,0.1)',
            borderRadius: '8px'
          }}>
            {suggestion.text}
          </div>
        ))}
      </SpecSection>
    </AnalyzerContainer>
  );
};

export default PaladinAnalyzer;