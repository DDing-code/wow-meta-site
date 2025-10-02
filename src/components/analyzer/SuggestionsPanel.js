import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled(motion.div)`
  background: rgba(37, 42, 61, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  transition: ${props => props.theme.transitions.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  font-family: ${props => props.theme.fonts.heading};
  font-weight: 700;
  background: ${props => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SeverityFilter = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.gradients.accent : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.85rem;
  font-family: ${props => props.theme.fonts.main};
  font-weight: 500;
  transition: ${props => props.theme.transitions.spring};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.gradients.accent};
    opacity: 0;
    transition: ${props => props.theme.transitions.fast};
  }

  &:hover:before {
    opacity: 0.2;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  ${props => props.active && `
    box-shadow: ${props.theme.shadows.glow};
  `}
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SuggestionCard = styled(motion.div)`
  background: rgba(28, 35, 51, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  border-left: 4px solid ${props =>
    props.severity === 'major' ? props.theme.colors.error :
    props.severity === 'medium' ? props.theme.colors.warning :
    props.theme.colors.info
  };
  cursor: pointer;
  transition: ${props => props.theme.transitions.spring};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      ${props =>
        props.severity === 'major' ? 'rgba(248, 113, 113, 0.1)' :
        props.severity === 'medium' ? 'rgba(251, 191, 36, 0.1)' :
        'rgba(96, 165, 250, 0.1)'
      } 0%,
      transparent 50%
    );
    opacity: 0;
    transition: ${props => props.theme.transitions.default};
  }

  &:hover {
    transform: translateX(8px) scale(1.02);
    box-shadow: ${props => props.theme.shadows.xl};
    border-left-width: 6px;

    &:before {
      opacity: 1;
    }
  }
`;

const SuggestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const SuggestionTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SeverityBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props =>
    props.severity === 'major' ? props.theme.colors.error + '22' :
    props.severity === 'medium' ? props.theme.colors.warning + '22' :
    props.theme.colors.info + '22'
  };
  color: ${props =>
    props.severity === 'major' ? props.theme.colors.error :
    props.severity === 'medium' ? props.theme.colors.warning :
    props.theme.colors.info
  };
`;

const SuggestionIcon = styled.span`
  font-size: 1.2rem;
`;

const SuggestionDescription = styled.div`
  color: ${props => props.theme.colors.subtext};
  line-height: 1.5;
  margin-bottom: 0.8rem;
`;

const ExpandedContent = styled(motion.div)`
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.overlay};
`;

const DetailSection = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.accent};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const DetailContent = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const StatComparison = styled.div`
  display: flex;
  gap: 2rem;
  background: ${props => props.theme.colors.primary};
  padding: 0.8rem;
  border-radius: 8px;
  margin: 0.5rem 0;
`;

const StatColumn = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 0.3rem;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.good ? props.theme.colors.success : props.theme.colors.error};
`;

const ImpactBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const ImpactLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
  min-width: 80px;
`;

const ImpactProgress = styled.div`
  flex: 1;
  height: 8px;
  background: ${props => props.theme.colors.overlay};
  border-radius: 4px;
  overflow: hidden;
`;

const ImpactFill = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background: linear-gradient(90deg,
    ${props => props.theme.colors.info},
    ${props => props.theme.colors.warning},
    ${props => props.theme.colors.error}
  );
  background-size: ${props => 100 / (props.value / 100)}% 100%;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.theme.colors.warning};
    transform: translateY(-2px);
  }
`;

const SummaryBox = styled.div`
  background: ${props => props.theme.colors.primary};
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryCount = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props =>
    props.type === 'major' ? props.theme.colors.error :
    props.type === 'medium' ? props.theme.colors.warning :
    props.type === 'minor' ? props.theme.colors.info :
    props.theme.colors.text
  };
`;

const SummaryLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
  margin-top: 0.3rem;
`;

function SuggestionsPanel({ analysisData }) {
  const [expandedCards, setExpandedCards] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('all');

  // 샘플 제안 데이터
  const suggestions = analysisData?.suggestions || [
    {
      id: 1,
      severity: 'major',
      category: 'rotation',
      icon: '⚔️',
      title: '무모한 희생 활용도 개선 필요',
      description: '무모한 희생을 폭발 구간 밖에서 사용했습니다. 다른 재사용 대기시간 기술과 함께 사용하면 더 큰 효과를 볼 수 있습니다.',
      impact: 85,
      details: {
        현재: '단독 사용 3회, 평균 DPS 증가: 15%',
        권장: '아바타와 함께 사용, 예상 DPS 증가: 25%',
        팁: '무모한 희생은 아바타, 피의 갈증과 함께 사용하면 시너지를 냅니다.'
      },
      stats: {
        actual: { value: '3회', label: '단독 사용' },
        expected: { value: '0회', label: '권장' },
        improvement: '+10% DPS'
      }
    },
    {
      id: 2,
      severity: 'medium',
      category: 'resources',
      icon: '⚡',
      title: '분노 낭비 감소 필요',
      description: '전투 중 총 450의 분노를 낭비했습니다. 분노 생성 능력과 소비 능력의 균형을 맞춰야 합니다.',
      impact: 60,
      details: {
        현재: '분노 상한 도달 12회, 낭비량 450',
        권장: '지속적인 분노 소비로 상한 도달 방지',
        팁: '분노가 80 이상일 때는 회오리바람을 우선 사용하세요.'
      },
      stats: {
        actual: { value: '450', label: '낭비된 분노' },
        expected: { value: '<100', label: '권장' },
        improvement: '+5% 효율'
      }
    },
    {
      id: 3,
      severity: 'minor',
      category: 'buffs',
      icon: '🛡️',
      title: '격노 유지율 개선 가능',
      description: '격노 효과 유지율이 82%입니다. 90% 이상 유지를 목표로 하세요.',
      impact: 40,
      details: {
        현재: '격노 유지율 82%, 평균 지속시간 4.1초',
        권장: '격노 유지율 90%+, 평균 지속시간 4.5초',
        팁: '피의 갈증과 회오리바람을 번갈아 사용하여 격노를 유지하세요.'
      },
      stats: {
        actual: { value: '82%', label: '현재 유지율' },
        expected: { value: '90%+', label: '목표' },
        improvement: '+3% 치명타'
      }
    },
    {
      id: 4,
      severity: 'major',
      category: 'cooldowns',
      icon: '⏰',
      title: '주요 재사용 대기시간 기술 미사용',
      description: '아바타를 전투 중 1회만 사용했습니다. 3분 이상의 전투에서는 2회 사용이 가능합니다.',
      impact: 75,
      details: {
        현재: '아바타 사용 1회 (0:15)',
        권장: '아바타 사용 2회 (0:15, 2:00)',
        팁: '재사용 대기시간이 돌아오는 즉시 사용하여 최대한 많이 사용하세요.'
      },
      stats: {
        actual: { value: '1회', label: '사용 횟수' },
        expected: { value: '2회', label: '가능 횟수' },
        improvement: '+8% DPS'
      }
    },
    {
      id: 5,
      severity: 'medium',
      category: 'mechanics',
      icon: '🎯',
      title: '역학 실수로 인한 DPS 손실',
      description: '이동으로 인한 DPS 손실이 있었습니다. 위치 선정을 개선하면 더 많은 딜을 넣을 수 있습니다.',
      impact: 55,
      details: {
        현재: '불필요한 이동 8회, 손실 시간 12초',
        권장: '최소한의 이동으로 역학 처리',
        팁: '미리 안전 지대를 파악하고 최단 경로로 이동하세요.'
      },
      stats: {
        actual: { value: '12초', label: '이동 시간' },
        expected: { value: '<5초', label: '목표' },
        improvement: '+4% 업타임'
      }
    },
    {
      id: 6,
      severity: 'minor',
      category: 'consumables',
      icon: '🧪',
      title: '물약 사용 시기 최적화',
      description: '두 번째 물약을 너무 늦게 사용했습니다. 쿨다운과 함께 사용하면 효과가 증대됩니다.',
      impact: 30,
      details: {
        현재: '2차 물약 사용: 4:30 (단독)',
        권장: '2차 물약 사용: 3:30 (버스트 윈도우)',
        팁: '주요 쿨다운 사용 직전에 물약을 사용하세요.'
      },
      stats: {
        actual: { value: '4:30', label: '사용 시간' },
        expected: { value: '3:30', label: '최적 시간' },
        improvement: '+2% 버스트'
      }
    }
  ];

  // 필터링된 제안
  const filteredSuggestions = severityFilter === 'all'
    ? suggestions
    : suggestions.filter(s => s.severity === severityFilter);

  // 카드 확장 토글
  const toggleCard = (id) => {
    setExpandedCards(prev =>
      prev.includes(id)
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  // 심각도별 개수
  const severityCounts = {
    major: suggestions.filter(s => s.severity === 'major').length,
    medium: suggestions.filter(s => s.severity === 'medium').length,
    minor: suggestions.filter(s => s.severity === 'minor').length,
    total: suggestions.length
  };

  // 심각도 한글 변환
  const getSeverityText = (severity) => {
    switch(severity) {
      case 'major': return '심각';
      case 'medium': return '보통';
      case 'minor': return '경미';
      default: return severity;
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          💡 개선 제안
        </Title>
        <SeverityFilter>
          <FilterButton
            active={severityFilter === 'all'}
            onClick={() => setSeverityFilter('all')}
          >
            전체 ({severityCounts.total})
          </FilterButton>
          <FilterButton
            active={severityFilter === 'major'}
            onClick={() => setSeverityFilter('major')}
          >
            심각 ({severityCounts.major})
          </FilterButton>
          <FilterButton
            active={severityFilter === 'medium'}
            onClick={() => setSeverityFilter('medium')}
          >
            보통 ({severityCounts.medium})
          </FilterButton>
          <FilterButton
            active={severityFilter === 'minor'}
            onClick={() => setSeverityFilter('minor')}
          >
            경미 ({severityCounts.minor})
          </FilterButton>
        </SeverityFilter>
      </Header>

      {/* 요약 */}
      <SummaryBox>
        <SummaryItem>
          <SummaryCount type="major">{severityCounts.major}</SummaryCount>
          <SummaryLabel>심각한 문제</SummaryLabel>
        </SummaryItem>
        <SummaryItem>
          <SummaryCount type="medium">{severityCounts.medium}</SummaryCount>
          <SummaryLabel>개선 필요</SummaryLabel>
        </SummaryItem>
        <SummaryItem>
          <SummaryCount type="minor">{severityCounts.minor}</SummaryCount>
          <SummaryLabel>권장 사항</SummaryLabel>
        </SummaryItem>
        <SummaryItem>
          <SummaryCount>85%</SummaryCount>
          <SummaryLabel>전체 점수</SummaryLabel>
        </SummaryItem>
      </SummaryBox>

      {/* 제안 목록 */}
      <SuggestionsContainer>
        <AnimatePresence>
          {filteredSuggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.id}
              severity={suggestion.severity}
              onClick={() => toggleCard(suggestion.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <SuggestionHeader>
                <SuggestionTitle>
                  <SuggestionIcon>{suggestion.icon}</SuggestionIcon>
                  {suggestion.title}
                </SuggestionTitle>
                <SeverityBadge severity={suggestion.severity}>
                  {getSeverityText(suggestion.severity)}
                </SeverityBadge>
              </SuggestionHeader>

              <SuggestionDescription>
                {suggestion.description}
              </SuggestionDescription>

              <ImpactBar>
                <ImpactLabel>영향도</ImpactLabel>
                <ImpactProgress>
                  <ImpactFill value={suggestion.impact} />
                </ImpactProgress>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  {suggestion.impact}%
                </span>
              </ImpactBar>

              <AnimatePresence>
                {expandedCards.includes(suggestion.id) && (
                  <ExpandedContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {/* 상세 정보 */}
                    <DetailSection>
                      <DetailTitle>📊 상세 분석</DetailTitle>
                      <DetailContent>
                        <div>🔴 현재: {suggestion.details.현재}</div>
                        <div style={{ marginTop: '0.5rem' }}>
                          ✅ 권장: {suggestion.details.권장}
                        </div>
                        <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                          💡 {suggestion.details.팁}
                        </div>
                      </DetailContent>
                    </DetailSection>

                    {/* 통계 비교 */}
                    <StatComparison>
                      <StatColumn>
                        <StatLabel>현재</StatLabel>
                        <StatValue>{suggestion.stats.actual.value}</StatValue>
                        <StatLabel>{suggestion.stats.actual.label}</StatLabel>
                      </StatColumn>
                      <StatColumn>
                        <StatLabel>목표</StatLabel>
                        <StatValue good>{suggestion.stats.expected.value}</StatValue>
                        <StatLabel>{suggestion.stats.expected.label}</StatLabel>
                      </StatColumn>
                      <StatColumn>
                        <StatLabel>개선 효과</StatLabel>
                        <StatValue good>{suggestion.stats.improvement}</StatValue>
                        <StatLabel>예상 향상</StatLabel>
                      </StatColumn>
                    </StatComparison>

                    <ActionButton style={{ marginTop: '1rem' }}>
                      📚 가이드 보기
                    </ActionButton>
                  </ExpandedContent>
                )}
              </AnimatePresence>
            </SuggestionCard>
          ))}
        </AnimatePresence>
      </SuggestionsContainer>
    </Container>
  );
}

export default SuggestionsPanel;