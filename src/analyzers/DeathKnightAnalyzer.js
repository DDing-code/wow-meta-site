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
  color: #C41E3A;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AbilityCard = styled(motion.div)`
  background: rgba(196, 30, 58, 0.1);
  border: 1px solid rgba(196, 30, 58, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

// 죽음의 기사 능력 데이터
const deathKnightAbilities = {
  blood: {
    name: '혈기',
    abilities: [
      { id: 1, name: '피의 일격', type: '룬 소모', icon: 'spell_deathknight_bloodstrike' },
      { id: 2, name: '죽음의 일격', type: '룬 소모', icon: 'spell_deathknight_deathstrike' },
      { id: 3, name: '본 보호막', type: '재사용 대기시간', cooldown: 30, icon: 'spell_deathknight_boneshield' },
      { id: 4, name: '흡혈', type: '재사용 대기시간', cooldown: 90, icon: 'spell_deathknight_vampiricblood' },
      { id: 5, name: '루닉 파워 전환', type: '룬 소모', icon: 'spell_deathknight_runictap' },
      { id: 6, name: '댄싱 룬 웨펀', type: '재사용 대기시간', cooldown: 120, icon: 'spell_deathknight_dancingruneblade' }
    ],
    rotation: [
      '피의 일격으로 피의 역병 유지',
      '죽음의 일격을 생존기로 활용',
      '본 보호막 중첩 유지 (5개 이상)',
      '루닉 파워가 넘치지 않도록 죽음과 부패 사용'
    ]
  },
  frost: {
    name: '냉기',
    abilities: [
      { id: 1, name: '절멸', type: '룬 소모', icon: 'spell_deathknight_obliterate' },
      { id: 2, name: '냉기 폭발', type: '룬 소모', icon: 'spell_deathknight_howlingblast' },
      { id: 3, name: '필멸의 한기', type: '재사용 대기시간', cooldown: 120, icon: 'spell_deathknight_pillaroffrost' },
      { id: 4, name: '냉혹한 겨울', type: '재사용 대기시간', cooldown: 20, icon: 'spell_deathknight_remorselesswinter' },
      { id: 5, name: '서리 충격', type: '룬 무관', icon: 'spell_deathknight_frostscythe' },
      { id: 6, name: '브레스 오브 신드라고사', type: '재사용 대기시간', cooldown: 120, icon: 'spell_deathknight_breathofsindragosa' }
    ],
    rotation: [
      '냉기 폭발로 서리 열병 유지',
      '필멸의 한기 동안 절멸 최대화',
      '룬이 없을 때 서리 충격 사용',
      '브레스 오브 신드라고사 지속시간 최대화'
    ]
  },
  unholy: {
    name: '부정',
    abilities: [
      { id: 1, name: '고름 일격', type: '룬 소모', icon: 'spell_deathknight_festering_strike' },
      { id: 2, name: '죽음의 일격', type: '룬 소모', icon: 'spell_deathknight_deathstrike' },
      { id: 3, name: '스컬지의 일격', type: '룬 소모', icon: 'spell_deathknight_scourgestrike' },
      { id: 4, name: '어둠 변신', type: '재사용 대기시간', cooldown: 60, icon: 'spell_deathknight_darktransformation' },
      { id: 5, name: '부정한 광란', type: '재사용 대기시간', cooldown: 75, icon: 'spell_deathknight_unholyfrenzy' },
      { id: 6, name: '대군의 피조물', type: '재사용 대기시간', cooldown: 480, icon: 'spell_deathknight_armyofthedead' }
    ],
    rotation: [
      '고름 일격으로 상처 중첩 생성',
      '스컬지의 일격으로 상처 터트리기',
      '어둠 변신으로 구울 강화',
      '대군의 피조물은 전투 시작 전 사용'
    ]
  }
};

const DeathKnightAnalyzer = ({ spec = 'frost', combatLog = [] }) => {
  const currentSpec = deathKnightAbilities[spec];

  const analyzeCombatLog = () => {
    // 실제 로그 분석 로직
    const suggestions = [];

    // 예시 분석
    if (spec === 'frost') {
      suggestions.push({
        severity: 'major',
        text: '필멸의 한기 활용도가 낮습니다. 쿨마다 사용하세요.'
      });
    } else if (spec === 'unholy') {
      suggestions.push({
        severity: 'minor',
        text: '고름 일격 사용 빈도를 늘려 상처 중첩을 유지하세요.'
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

export default DeathKnightAnalyzer;