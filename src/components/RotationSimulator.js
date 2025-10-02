import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Settings, Zap, Shield,
  Heart, Clock, Target, AlertTriangle, ChevronRight,
  Activity, BarChart3, Info, CheckCircle, XCircle,
  Flame, Snowflake, Sparkles
} from 'lucide-react';

const SimulatorContainer = styled.div`
  max-width: 1400px;
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
  background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const ControlButton = styled(motion.button)`
  padding: 10px 20px;
  background: ${props => props.active ?
    'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' :
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
      'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' :
      'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SimulationArea = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
`;

const ResourceBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
`;

const ResourceBar = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ResourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ResourceLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResourceValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.color || '#fff'};
`;

const ResourceProgress = styled.div`
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ResourceFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.gradient || 'linear-gradient(90deg, #667eea, #764ba2)'};
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ActionBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 10px;
  margin-bottom: 25px;
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
  100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
`;

const SkillButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  background: ${props => props.ready ?
    'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(239, 68, 68, 0.3))' :
    'rgba(0, 0, 0, 0.5)'};
  border: 2px solid ${props => props.ready ?
    'rgba(249, 115, 22, 0.8)' :
    'rgba(255, 255, 255, 0.2)'};
  border-radius: 10px;
  color: ${props => props.ready ? '#fff' : 'rgba(255, 255, 255, 0.3)'};
  cursor: ${props => props.ready ? 'pointer' : 'not-allowed'};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  animation: ${props => props.glow ? pulse : 'none'} 2s infinite;

  &:hover {
    transform: ${props => props.ready ? 'scale(1.1)' : 'scale(1)'};
    background: ${props => props.ready ?
      'linear-gradient(135deg, rgba(249, 115, 22, 0.5), rgba(239, 68, 68, 0.5))' :
      'rgba(0, 0, 0, 0.5)'};
  }

  &:active {
    transform: ${props => props.ready ? 'scale(0.95)' : 'scale(1)'};
  }
`;

const SkillIcon = styled.div`
  font-size: 24px;
`;

const SkillName = styled.div`
  font-size: 9px;
  text-align: center;
`;

const CooldownOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
`;

const CastBar = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 25px;
`;

const CastBarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CastBarLabel = styled.div`
  font-size: 14px;
  color: #fff;
  font-weight: 600;
`;

const CastTime = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const CastProgress = styled.div`
  height: 12px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  overflow: hidden;
`;

const CastFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 6px;
`;

const CombatLog = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  height: 200px;
  overflow-y: auto;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

const LogEntry = styled.div`
  padding: 4px 0;
  color: ${props => props.type === 'damage' ? '#f87171' :
          props.type === 'heal' ? '#4ade80' :
          props.type === 'buff' ? '#60a5fa' :
          props.type === 'debuff' ? '#fbbf24' :
          'rgba(255, 255, 255, 0.8)'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogTime = styled.span`
  color: rgba(255, 255, 255, 0.5);
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
`;

const StatsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.color || '#fff'};
`;

const BuffContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
`;

const BuffIcon = styled(motion.div)`
  width: 40px;
  height: 40px;
  background: ${props => props.active ?
    'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.3))' :
    'rgba(0, 0, 0, 0.5)'};
  border: 2px solid ${props => props.active ?
    'rgba(96, 165, 250, 0.8)' :
    'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const BuffDuration = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  padding: 1px 3px;
  border-radius: 3px;
`;

const SettingsModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 30px;
  width: 500px;
  max-width: 90vw;
  z-index: 1000;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RotationSimulator = ({ classData, spec }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [resources, setResources] = useState({
    mana: 100,
    energy: 100,
    combo: 0,
    runic: 100,
    rage: 0,
    focus: 100
  });
  const [cooldowns, setCooldowns] = useState({});
  const [buffs, setBuffs] = useState([]);
  const [combatLog, setCombatLog] = useState([]);
  const [casting, setCasting] = useState(null);
  const [stats, setStats] = useState({
    dps: 0,
    totalDamage: 0,
    critRate: 0,
    hitCount: 0,
    missCount: 0,
    rotation: []
  });

  // 스킬 데이터
  const skills = [
    { id: 1, name: '화염구', icon: '🔥', cooldown: 0, cost: 20, castTime: 2.5, damage: 5000 },
    { id: 2, name: '화염 작렬', icon: '💥', cooldown: 8, cost: 30, castTime: 0, damage: 8000 },
    { id: 3, name: '불태우기', icon: '🔥', cooldown: 12, cost: 40, castTime: 1.5, damage: 12000 },
    { id: 4, name: '작열', icon: '☄️', cooldown: 0, cost: 15, castTime: 1.5, damage: 3000 },
    { id: 5, name: '연소', icon: '🌋', cooldown: 120, cost: 50, castTime: 0, damage: 25000 },
    { id: 6, name: '화염 폭풍', icon: '🌪️', cooldown: 30, cost: 60, castTime: 3, damage: 15000 }
  ];

  const simulationRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      simulationRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 0.1);
        updateResources();
        updateCooldowns();
        updateBuffs();
        checkAutoRotation();
      }, 100);
    } else {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    }

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [isRunning]);

  const updateResources = () => {
    setResources(prev => ({
      ...prev,
      mana: Math.min(100, prev.mana + 1),
      energy: Math.min(100, prev.energy + 2),
      focus: Math.min(100, prev.focus + 1.5)
    }));
  };

  const updateCooldowns = () => {
    setCooldowns(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (updated[key] > 0) {
          updated[key] = Math.max(0, updated[key] - 0.1);
        }
      });
      return updated;
    });
  };

  const updateBuffs = () => {
    setBuffs(prev => prev.map(buff => ({
      ...buff,
      duration: Math.max(0, buff.duration - 0.1)
    })).filter(buff => buff.duration > 0));
  };

  const checkAutoRotation = () => {
    // 자동 로테이션 로직
    if (Math.random() < 0.05) {
      const availableSkills = skills.filter(skill =>
        (!cooldowns[skill.id] || cooldowns[skill.id] === 0) &&
        resources.mana >= skill.cost
      );

      if (availableSkills.length > 0) {
        const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        useSkill(skill);
      }
    }
  };

  const useSkill = (skill) => {
    if (cooldowns[skill.id] && cooldowns[skill.id] > 0) return;
    if (resources.mana < skill.cost) return;

    // 자원 소모
    setResources(prev => ({
      ...prev,
      mana: prev.mana - skill.cost
    }));

    // 쿨다운 적용
    if (skill.cooldown > 0) {
      setCooldowns(prev => ({
        ...prev,
        [skill.id]: skill.cooldown
      }));
    }

    // 시전 시작
    if (skill.castTime > 0) {
      setCasting({
        skill: skill,
        progress: 0,
        duration: skill.castTime
      });

      setTimeout(() => {
        completeCast(skill);
      }, skill.castTime * 1000);
    } else {
      completeCast(skill);
    }
  };

  const completeCast = (skill) => {
    setCasting(null);

    // 데미지 계산
    const isCrit = Math.random() < 0.3;
    const damage = skill.damage * (isCrit ? 2 : 1);

    // 전투 로그 추가
    addCombatLog({
      type: 'damage',
      message: `${skill.name} ${isCrit ? '치명타!' : ''} ${damage.toLocaleString()} 피해`,
      time: currentTime.toFixed(1)
    });

    // 통계 업데이트
    setStats(prev => ({
      ...prev,
      totalDamage: prev.totalDamage + damage,
      hitCount: prev.hitCount + 1,
      critRate: isCrit ? (prev.critRate * prev.hitCount + 1) / (prev.hitCount + 1) :
                        (prev.critRate * prev.hitCount) / (prev.hitCount + 1),
      dps: (prev.totalDamage + damage) / Math.max(1, currentTime)
    }));

    // 버프 확률
    if (Math.random() < 0.2) {
      addBuff({
        id: Date.now(),
        name: '열정',
        icon: '⚡',
        duration: 10
      });
    }
  };

  const addCombatLog = (entry) => {
    setCombatLog(prev => [...prev.slice(-19), entry]);
  };

  const addBuff = (buff) => {
    setBuffs(prev => {
      const existing = prev.find(b => b.name === buff.name);
      if (existing) {
        return prev.map(b => b.name === buff.name ? { ...b, duration: buff.duration } : b);
      }
      return [...prev, buff];
    });

    addCombatLog({
      type: 'buff',
      message: `${buff.name} 효과 획득`,
      time: currentTime.toFixed(1)
    });
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setResources({
      mana: 100,
      energy: 100,
      combo: 0,
      runic: 100,
      rage: 0,
      focus: 100
    });
    setCooldowns({});
    setBuffs([]);
    setCombatLog([]);
    setCasting(null);
    setStats({
      dps: 0,
      totalDamage: 0,
      critRate: 0,
      hitCount: 0,
      missCount: 0,
      rotation: []
    });
  };

  return (
    <SimulatorContainer>
      <Header>
        <Title>
          <Flame size={28} />
          로테이션 시뮬레이터
        </Title>
        <ControlPanel>
          <ControlButton
            active={isRunning}
            onClick={() => setIsRunning(!isRunning)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? '일시정지' : '시작'}
          </ControlButton>
          <ControlButton
            onClick={resetSimulation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={16} />
            초기화
          </ControlButton>
          <ControlButton
            onClick={() => setShowSettings(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={16} />
            설정
          </ControlButton>
        </ControlPanel>
      </Header>

      <MainGrid>
        <SimulationArea>
          <ResourceBars>
            <ResourceBar>
              <ResourceHeader>
                <ResourceLabel>
                  <Zap size={16} />
                  마나
                </ResourceLabel>
                <ResourceValue color="#60a5fa">
                  {Math.floor(resources.mana)}/100
                </ResourceValue>
              </ResourceHeader>
              <ResourceProgress>
                <ResourceFill
                  gradient="linear-gradient(90deg, #3b82f6, #60a5fa)"
                  animate={{ width: `${resources.mana}%` }}
                  transition={{ duration: 0.3 }}
                />
              </ResourceProgress>
            </ResourceBar>

            {spec === 'Rogue' && (
              <ResourceBar>
                <ResourceHeader>
                  <ResourceLabel>
                    <Target size={16} />
                    연계 점수
                  </ResourceLabel>
                  <ResourceValue color="#fbbf24">
                    {resources.combo}/5
                  </ResourceValue>
                </ResourceHeader>
                <ResourceProgress>
                  <ResourceFill
                    gradient="linear-gradient(90deg, #f59e0b, #fbbf24)"
                    animate={{ width: `${(resources.combo / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </ResourceProgress>
              </ResourceBar>
            )}
          </ResourceBars>

          <ActionBar>
            {skills.map(skill => (
              <SkillButton
                key={skill.id}
                ready={(!cooldowns[skill.id] || cooldowns[skill.id] === 0) && resources.mana >= skill.cost}
                glow={skill.id === 5 && (!cooldowns[skill.id] || cooldowns[skill.id] === 0)}
                onClick={() => useSkill(skill)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SkillIcon>{skill.icon}</SkillIcon>
                <SkillName>{skill.name}</SkillName>
                {cooldowns[skill.id] > 0 && (
                  <CooldownOverlay>
                    {Math.ceil(cooldowns[skill.id])}
                  </CooldownOverlay>
                )}
              </SkillButton>
            ))}
          </ActionBar>

          {casting && (
            <CastBar>
              <CastBarHeader>
                <CastBarLabel>{casting.skill.name} 시전 중...</CastBarLabel>
                <CastTime>{casting.duration}초</CastTime>
              </CastBarHeader>
              <CastProgress>
                <CastFill
                  animate={{ width: '100%' }}
                  transition={{ duration: casting.duration }}
                />
              </CastProgress>
            </CastBar>
          )}

          <CombatLog>
            {combatLog.map((entry, index) => (
              <LogEntry key={index} type={entry.type}>
                <LogTime>[{entry.time}s]</LogTime>
                {entry.message}
              </LogEntry>
            ))}
          </CombatLog>
        </SimulationArea>

        <SidePanel>
          <StatsCard>
            <StatsTitle>
              <BarChart3 size={18} />
              전투 통계
            </StatsTitle>
            <StatRow>
              <StatLabel>전투 시간</StatLabel>
              <StatValue>{currentTime.toFixed(1)}초</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>DPS</StatLabel>
              <StatValue color="#f87171">
                {Math.floor(stats.dps).toLocaleString()}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>총 피해량</StatLabel>
              <StatValue color="#f97316">
                {stats.totalDamage.toLocaleString()}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>치명타율</StatLabel>
              <StatValue color="#fbbf24">
                {(stats.critRate * 100).toFixed(1)}%
              </StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>적중/빗나감</StatLabel>
              <StatValue>
                {stats.hitCount}/{stats.missCount}
              </StatValue>
            </StatRow>
          </StatsCard>

          <StatsCard>
            <StatsTitle>
              <Sparkles size={18} />
              활성 버프
            </StatsTitle>
            <BuffContainer>
              {buffs.map(buff => (
                <BuffIcon
                  key={buff.id}
                  active
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {buff.icon}
                  {buff.duration > 0 && (
                    <BuffDuration>{buff.duration.toFixed(1)}</BuffDuration>
                  )}
                </BuffIcon>
              ))}
              {buffs.length === 0 && (
                <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                  활성 버프 없음
                </div>
              )}
            </BuffContainer>
          </StatsCard>

          <StatsCard>
            <StatsTitle>
              <Info size={18} />
              시뮬레이터 정보
            </StatsTitle>
            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
              실시간 로테이션 시뮬레이터로 다양한 스킬 조합을 테스트하고
              최적의 로테이션을 찾아보세요. 자원 관리, 쿨다운 타이밍,
              버프 유지 등을 연습할 수 있습니다.
            </div>
          </StatsCard>
        </SidePanel>
      </MainGrid>

      <AnimatePresence>
        {showSettings && (
          <>
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            />
            <SettingsModal
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <StatsTitle>
                <Settings size={18} />
                시뮬레이터 설정
              </StatsTitle>
              <SettingRow>
                <SettingLabel>자동 로테이션</SettingLabel>
                <SettingControl>
                  <ControlButton>활성화</ControlButton>
                </SettingControl>
              </SettingRow>
              <SettingRow>
                <SettingLabel>전투 속도</SettingLabel>
                <SettingControl>
                  <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
                </SettingControl>
              </SettingRow>
              <SettingRow>
                <SettingLabel>타겟 레벨</SettingLabel>
                <SettingControl>
                  <input type="number" defaultValue="70" min="1" max="70" />
                </SettingControl>
              </SettingRow>
              <SettingRow>
                <SettingLabel>버프 표시</SettingLabel>
                <SettingControl>
                  <ControlButton>모두 표시</ControlButton>
                </SettingControl>
              </SettingRow>
            </SettingsModal>
          </>
        )}
      </AnimatePresence>
    </SimulatorContainer>
  );
};

export default RotationSimulator;