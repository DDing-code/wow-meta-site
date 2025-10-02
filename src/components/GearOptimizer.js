import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Search, Filter, TrendingUp, AlertCircle,
  Shield, Sword, Heart, Zap, Target, Award,
  ChevronRight, ChevronDown, X, Check, Info,
  Package, Sparkles, BarChart3, Calculator,
  RefreshCw, Download, Upload, Star
} from 'lucide-react';

const OptimizerContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const ControlButton = styled(motion.button)`
  padding: 10px 20px;
  background: ${props => props.active ?
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' :
    'rgba(255, 255, 255, 0.05)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.active ?
      'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' :
      'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr 350px;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
  }
`;

const GearSlots = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
`;

const SlotsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const SlotItem = styled(motion.div)`
  background: ${props => props.equipped ?
    'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))' :
    'rgba(0, 0, 0, 0.3)'};
  border: 2px solid ${props => props.equipped ?
    'rgba(139, 92, 246, 0.5)' :
    'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.equipped ?
      'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))' :
      'rgba(255, 255, 255, 0.05)'};
    transform: scale(1.02);
  }
`;

const SlotName = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
`;

const ItemName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.quality === 'legendary' ? '#ff8000' :
          props.quality === 'epic' ? '#a335ee' :
          props.quality === 'rare' ? '#0070dd' :
          '#fff'};
  margin-bottom: 3px;
`;

const ItemLevel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CharacterStats = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
`;

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const StatsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatsTabs = styled.div`
  display: flex;
  gap: 10px;
`;

const StatsTab = styled.button`
  padding: 5px 15px;
  background: ${props => props.active ?
    'rgba(139, 92, 246, 0.3)' :
    'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ?
    'rgba(139, 92, 246, 0.5)' :
    'rgba(255, 255, 255, 0.1)'};
  border-radius: 5px;
  color: ${props => props.active ? '#a78bfa' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const StatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatChange = styled.span`
  font-size: 12px;
  color: ${props => props.positive ? '#4ade80' : '#f87171'};
  display: flex;
  align-items: center;
`;

const OptimizationPanel = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
`;

const OptimizationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const OptimizationOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
`;

const OptionCard = styled(motion.div)`
  background: ${props => props.selected ?
    'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))' :
    'rgba(0, 0, 0, 0.3)'};
  border: 2px solid ${props => props.selected ?
    'rgba(139, 92, 246, 0.5)' :
    'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.selected ?
      'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))' :
      'rgba(255, 255, 255, 0.05)'};
    transform: scale(1.02);
  }
`;

const OptionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OptionDescription = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const RunButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RecommendationPanel = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
`;

const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const RecommendationItem = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
`;

const RecommendationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ItemSource = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

const StatComparison = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  font-size: 12px;
`;

const ComparisonItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.positive ? '#4ade80' : '#f87171'};
`;

const WeightSettings = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
`;

const WeightRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const WeightLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
`;

const WeightInput = styled.input`
  width: 60px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: #fff;
  text-align: center;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.5);
  }
`;

const GearOptimizer = ({ classData, spec }) => {
  const [selectedTab, setSelectedTab] = useState('primary');
  const [optimizationMode, setOptimizationMode] = useState('dps');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showWeights, setShowWeights] = useState(false);

  // 장비 슬롯 데이터
  const gearSlots = [
    { slot: '머리', item: '화염 왕관', ilvl: 489, quality: 'epic', equipped: true },
    { slot: '목', item: '마력의 목걸이', ilvl: 486, quality: 'epic', equipped: true },
    { slot: '어깨', item: '불꽃 어깨보호구', ilvl: 489, quality: 'epic', equipped: true },
    { slot: '가슴', item: '용의 로브', ilvl: 496, quality: 'legendary', equipped: true },
    { slot: '허리', item: '시간의 띠', ilvl: 483, quality: 'rare', equipped: true },
    { slot: '다리', item: '화염 다리보호구', ilvl: 489, quality: 'epic', equipped: true },
    { slot: '발', item: '속도의 장화', ilvl: 483, quality: 'epic', equipped: true },
    { slot: '손목', item: '마력 손목보호구', ilvl: 480, quality: 'rare', equipped: true },
    { slot: '손', item: '주문시전자 장갑', ilvl: 486, quality: 'epic', equipped: true },
    { slot: '반지1', item: '힘의 반지', ilvl: 486, quality: 'epic', equipped: true },
    { slot: '반지2', item: '지혜의 반지', ilvl: 483, quality: 'epic', equipped: true },
    { slot: '장신구1', item: '용의 눈', ilvl: 489, quality: 'epic', equipped: true },
    { slot: '장신구2', item: '시간의 모래', ilvl: 486, quality: 'epic', equipped: true },
    { slot: '망토', item: '화염 망토', ilvl: 480, quality: 'rare', equipped: true },
    { slot: '무기', item: '불꽃의 지팡이', ilvl: 496, quality: 'legendary', equipped: true },
    { slot: '보조무기', item: '마력의 보주', ilvl: 486, quality: 'epic', equipped: true }
  ];

  // 캐릭터 스탯
  const characterStats = {
    primary: {
      지능: { value: 8542, change: '+245' },
      체력: { value: 124580, change: '+3200' },
      마나: { value: 85000, change: null },
      주문력: { value: 12458, change: '+458' }
    },
    secondary: {
      치명타: { value: '28.5%', change: '+1.2%' },
      가속: { value: '24.3%', change: '+0.8%' },
      특화: { value: '18.7%', change: '-0.5%' },
      유연성: { value: '12.4%', change: '+0.3%' }
    },
    defensive: {
      방어도: { value: 3254, change: '+125' },
      회피: { value: '8.2%', change: null },
      무기막기: { value: '5.4%', change: null },
      피해감소: { value: '15.8%', change: '+0.5%' }
    }
  };

  // 추천 장비
  const recommendedGear = [
    {
      slot: '머리',
      item: '네루바르 화염 왕관',
      ilvl: 496,
      quality: 'legendary',
      source: '네루바르 왕궁 - 최종 보스',
      stats: { 지능: '+325', 치명타: '+2.1%', 가속: '+1.8%' }
    },
    {
      slot: '목',
      item: '영원한 불꽃 목걸이',
      ilvl: 493,
      quality: 'epic',
      source: '신화+ 20단 주간 보상',
      stats: { 지능: '+285', 특화: '+1.5%', 유연성: '+1.2%' }
    },
    {
      slot: '반지1',
      item: '시간의 균열 반지',
      ilvl: 490,
      quality: 'epic',
      source: '시간의 동굴 - 신화 난이도',
      stats: { 지능: '+265', 가속: '+2.3%', 치명타: '+1.1%' }
    }
  ];

  // 스탯 가중치
  const [statWeights, setStatWeights] = useState({
    지능: 1.0,
    치명타: 0.85,
    가속: 0.90,
    특화: 0.75,
    유연성: 0.60
  });

  const runOptimization = () => {
    setIsOptimizing(true);

    // 시뮬레이션 실행
    setTimeout(() => {
      setIsOptimizing(false);
      setRecommendations(recommendedGear);
    }, 2000);
  };

  const handleWeightChange = (stat, value) => {
    setStatWeights(prev => ({
      ...prev,
      [stat]: parseFloat(value) || 0
    }));
  };

  const getStatIcon = (stat) => {
    switch(stat) {
      case '지능': return <Zap size={14} />;
      case '체력': return <Heart size={14} />;
      case '치명타': return <Target size={14} />;
      case '가속': return <TrendingUp size={14} />;
      case '방어도': return <Shield size={14} />;
      default: return null;
    }
  };

  return (
    <OptimizerContainer>
      <Header>
        <Title>
          <Settings size={28} />
          장비 최적화 시스템
        </Title>
        <Controls>
          <ControlButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload size={16} />
            불러오기
          </ControlButton>
          <ControlButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            내보내기
          </ControlButton>
          <ControlButton
            onClick={() => setShowWeights(!showWeights)}
            active={showWeights}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calculator size={16} />
            가중치 설정
          </ControlButton>
        </Controls>
      </Header>

      <MainGrid>
        <GearSlots>
          <SlotsTitle>
            <Package size={20} />
            장비 슬롯
          </SlotsTitle>
          <SlotGrid>
            {gearSlots.map((gear, index) => (
              <SlotItem
                key={index}
                equipped={gear.equipped}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SlotName>{gear.slot}</SlotName>
                <ItemName quality={gear.quality}>{gear.item}</ItemName>
                <ItemLevel>아이템 레벨 {gear.ilvl}</ItemLevel>
              </SlotItem>
            ))}
          </SlotGrid>
        </GearSlots>

        <CenterPanel>
          <CharacterStats>
            <StatsHeader>
              <StatsTitle>
                <BarChart3 size={20} />
                캐릭터 능력치
              </StatsTitle>
              <StatsTabs>
                <StatsTab
                  active={selectedTab === 'primary'}
                  onClick={() => setSelectedTab('primary')}
                >
                  주 능력치
                </StatsTab>
                <StatsTab
                  active={selectedTab === 'secondary'}
                  onClick={() => setSelectedTab('secondary')}
                >
                  보조 능력치
                </StatsTab>
                <StatsTab
                  active={selectedTab === 'defensive'}
                  onClick={() => setSelectedTab('defensive')}
                >
                  방어 능력치
                </StatsTab>
              </StatsTabs>
            </StatsHeader>
            <StatsGrid>
              {Object.entries(characterStats[selectedTab]).map(([stat, data]) => (
                <StatItem key={stat}>
                  <StatLabel>
                    {getStatIcon(stat)}
                    {stat}
                  </StatLabel>
                  <StatValue>
                    {data.value}
                    {data.change && (
                      <StatChange positive={data.change.startsWith('+')}>
                        {data.change}
                      </StatChange>
                    )}
                  </StatValue>
                </StatItem>
              ))}
            </StatsGrid>
          </CharacterStats>

          <OptimizationPanel>
            <OptimizationHeader>
              <StatsTitle>
                <Sparkles size={20} />
                최적화 설정
              </StatsTitle>
            </OptimizationHeader>
            <OptimizationOptions>
              <OptionCard
                selected={optimizationMode === 'dps'}
                onClick={() => setOptimizationMode('dps')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <OptionTitle>
                  <Sword size={16} />
                  DPS 최적화
                </OptionTitle>
                <OptionDescription>
                  최대 피해량을 위한 장비 조합
                </OptionDescription>
              </OptionCard>
              <OptionCard
                selected={optimizationMode === 'survivability'}
                onClick={() => setOptimizationMode('survivability')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <OptionTitle>
                  <Shield size={16} />
                  생존력 최적화
                </OptionTitle>
                <OptionDescription>
                  생존과 방어를 위한 장비 조합
                </OptionDescription>
              </OptionCard>
              <OptionCard
                selected={optimizationMode === 'balanced'}
                onClick={() => setOptimizationMode('balanced')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <OptionTitle>
                  <Target size={16} />
                  균형 최적화
                </OptionTitle>
                <OptionDescription>
                  DPS와 생존력의 균형잡힌 조합
                </OptionDescription>
              </OptionCard>
              <OptionCard
                selected={optimizationMode === 'pvp'}
                onClick={() => setOptimizationMode('pvp')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <OptionTitle>
                  <Award size={16} />
                  PvP 최적화
                </OptionTitle>
                <OptionDescription>
                  PvP 전투를 위한 특화 조합
                </OptionDescription>
              </OptionCard>
            </OptimizationOptions>
            <RunButton
              onClick={runOptimization}
              disabled={isOptimizing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isOptimizing ? (
                <>
                  <RefreshCw size={20} className="spin" />
                  최적화 진행 중...
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  최적화 실행
                </>
              )}
            </RunButton>

            {showWeights && (
              <WeightSettings>
                <div style={{ marginBottom: '15px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  스탯 가중치 설정
                </div>
                {Object.entries(statWeights).map(([stat, weight]) => (
                  <WeightRow key={stat}>
                    <WeightLabel>{stat}</WeightLabel>
                    <WeightInput
                      type="number"
                      value={weight}
                      onChange={(e) => handleWeightChange(stat, e.target.value)}
                      step="0.05"
                      min="0"
                      max="2"
                    />
                  </WeightRow>
                ))}
              </WeightSettings>
            )}
          </OptimizationPanel>
        </CenterPanel>

        <RecommendationPanel>
          <SlotsTitle>
            <Star size={20} />
            추천 장비
          </SlotsTitle>
          <RecommendationList>
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <RecommendationItem
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <RecommendationHeader>
                    <ItemInfo>
                      <ItemName quality={rec.quality}>{rec.item}</ItemName>
                      <ItemSource>{rec.source}</ItemSource>
                    </ItemInfo>
                    <ItemLevel>ilvl {rec.ilvl}</ItemLevel>
                  </RecommendationHeader>
                  <StatComparison>
                    {Object.entries(rec.stats).map(([stat, value]) => (
                      <ComparisonItem key={stat} positive={value.startsWith('+')}>
                        {stat}: {value}
                      </ComparisonItem>
                    ))}
                  </StatComparison>
                </RecommendationItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
                <Info size={40} style={{ marginBottom: '10px' }} />
                <div>최적화를 실행하여 추천 장비를 확인하세요</div>
              </div>
            )}
          </RecommendationList>
        </RecommendationPanel>
      </MainGrid>
    </OptimizerContainer>
  );
};

export default GearOptimizer;