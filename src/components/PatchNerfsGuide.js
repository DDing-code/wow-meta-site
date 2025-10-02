import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown, Shield, Sword, Heart, Zap, AlertTriangle,
  ChevronDown, ChevronRight, Info, Target, Users,
  Activity, Percent, Clock, AlertCircle, CheckCircle,
  Skull, Crown, Eye, Flame
} from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

// Maxroll 스타일 헤더
const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
  }
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #94a3b8;
  font-weight: 500;
`;

// Maxroll 스타일 탭
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0;
  margin-bottom: 40px;
  background: #1e293b;
  border-radius: 12px;
  padding: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Tab = styled(motion.button)`
  padding: 12px 32px;
  background: ${props => props.active ?
    'linear-gradient(135deg, #ff6b6b, #ee5a24)' :
    'transparent'};
  border: none;
  border-radius: 8px;
  color: ${props => props.active ? '#fff' : '#94a3b8'};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #fff;
    background: ${props => props.active ?
      'linear-gradient(135deg, #ff6b6b, #ee5a24)' :
      'rgba(255, 107, 107, 0.1)'};
  }
`;

// Maxroll 스타일 카드
const BossCard = styled(motion.div)`
  background: #1e293b;
  border-radius: 16px;
  margin-bottom: 30px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #334155;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    border-color: #ff6b6b;
  }
`;

const BossHeader = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1));
  border-bottom: 2px solid #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(238, 90, 36, 0.15));
  }
`;

const BossInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BossIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
`;

const BossDetails = styled.div``;

const BossName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
`;

const BossPhase = styled.span`
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ExpandIcon = styled.div`
  color: #94a3b8;
  transition: transform 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0)'};
`;

const NerfContent = styled(motion.div)`
  padding: 24px;
  background: #0f172a;
`;

const NerfGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const NerfItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #1e293b;
  border-radius: 12px;
  border-left: 4px solid ${props => props.severity === 'major' ? '#ff6b6b' : '#fbbf24'};
  transition: all 0.3s ease;

  &:hover {
    background: #334155;
    transform: translateX(4px);
  }
`;

const NerfIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.type === 'damage' ?
    'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))' :
    props.type === 'health' ?
    'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))' :
    'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.type === 'damage' ? '#ef4444' :
         props.type === 'health' ? '#22c55e' : '#3b82f6'};
  flex-shrink: 0;
`;

const NerfDetails = styled.div`
  flex: 1;
`;

const NerfName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NerfNameKorean = styled.span`
  color: #94a3b8;
  font-size: 14px;
  font-weight: 400;
`;

const NerfDescription = styled.div`
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
`;

const NerfPercentage = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  color: #ff6b6b;
  font-weight: 600;
  font-size: 14px;
  margin-left: 8px;
`;

// Summary 섹션
const SummarySection = styled.div`
  margin-top: 50px;
  padding: 30px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.05), rgba(238, 90, 36, 0.05));
  border-radius: 16px;
  border: 2px solid #334155;
`;

const SummaryTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SummaryText = styled.p`
  font-size: 15px;
  color: #cbd5e1;
  line-height: 1.8;
`;

const KeyChanges = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const KeyChangeCard = styled.div`
  padding: 16px;
  background: #1e293b;
  border-radius: 12px;
  border-left: 3px solid #ff6b6b;
`;

const KeyChangeTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ff6b6b;
  margin-bottom: 8px;
`;

const KeyChangeValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: ${props => props.type === 'new' ?
    'linear-gradient(135deg, #10b981, #059669)' :
    'linear-gradient(135deg, #ff6b6b, #ee5a24)'};
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 10px;
`;

const PatchNerfsGuide = () => {
  const [selectedTab, setSelectedTab] = useState('salhadaar');
  const [expandedBoss, setExpandedBoss] = useState(null);

  const nerfData = {
    salhadaar: {
      phase1: {
        name: '연합왕 살다하르',
        phase: '1페이즈',
        icon: <Crown />,
        nerfs: [
          {
            name: 'Banishment',
            korean: '추방',
            type: 'damage',
            percentage: -10,
            description: '주기 피해 및 최종 피해 10% 감소',
            severity: 'minor'
          },
          {
            name: 'Invoke the Oath',
            korean: '맹세 발동',
            type: 'damage',
            percentage: -15,
            description: '피해 15% 감소',
            severity: 'major'
          },
          {
            name: 'Vengeful Oath',
            korean: '복수의 맹세',
            type: 'visual',
            description: '시인성 개선을 위한 새로운 애니메이션 추가',
            severity: 'minor',
            isNew: true
          }
        ]
      },
      phase2: {
        name: '연합왕 살다하르',
        phase: '2페이즈',
        icon: <Users />,
        nerfs: [
          {
            name: 'Manaforged Titan',
            korean: '마나로 벼려진 거신',
            type: 'health',
            percentage: -10,
            description: '생명력 10% 감소',
            severity: 'major'
          },
          {
            name: 'Nexus-Prince Xevvos',
            korean: '연합 왕자 제브보스',
            type: 'health',
            percentage: -10,
            description: '생명력 10% 감소',
            severity: 'major'
          },
          {
            name: "Ky'vor",
            korean: '카이보르',
            type: 'health',
            percentage: -10,
            description: '생명력 10% 감소',
            severity: 'major'
          },
          {
            name: 'Shadowguard Reaper',
            korean: '그림자수호병 수확자',
            type: 'health',
            percentage: -10,
            description: '생명력 10% 감소',
            severity: 'major'
          }
        ]
      }
    },
    dimensius: {
      phase1: {
        name: '디멘시우스',
        phase: '1페이즈',
        icon: <Eye />,
        nerfs: [
          {
            name: 'Cosmic Radiation',
            korean: '우주 방사능',
            type: 'damage',
            iconUrl: wowIcons.cosmicRadiation,
            percentage: -10,
            description: '피해 10% 감소',
            severity: 'minor'
          },
          {
            name: 'Living Mass',
            korean: '살아있는 덩어리',
            type: 'health',
            percentage: -9.5,
            description: '생명력 9.5% 감소, 분열 피해 9.5% 감소',
            severity: 'major'
          }
        ]
      },
      phase2: {
        name: '디멘시우스',
        phase: '2페이즈',
        icon: <Skull />,
        nerfs: [
          {
            name: 'Nullbinder',
            korean: '무효속박자',
            type: 'health',
            percentage: -10,
            description: '생명력 10% 감소',
            severity: 'major'
          },
          {
            name: 'Voidwarden',
            korean: '공허감시자',
            type: 'health',
            percentage: -10,
            description: '생명력 10% 감소',
            severity: 'major'
          },
          {
            name: 'Crushing Gravity',
            korean: '분쇄하는 중력',
            type: 'damage',
            iconUrl: wowIcons.crushingGravity,
            percentage: -25,
            description: '피해 25% 감소',
            severity: 'major'
          }
        ]
      },
      phase3: {
        name: '디멘시우스',
        phase: '3페이즈',
        icon: <Flame />,
        nerfs: [
          {
            name: 'Cosmic Radiation',
            korean: '우주 방사능',
            type: 'damage',
            iconUrl: wowIcons.cosmicRadiation,
            percentage: -10,
            description: '피해 10% 감소',
            severity: 'minor'
          },
          {
            name: 'Crushing Gravity',
            korean: '분쇄하는 중력',
            type: 'damage',
            iconUrl: wowIcons.crushingGravity,
            percentage: -25,
            description: '피해 25% 감소',
            severity: 'major'
          }
        ]
      }
    }
  };

  const toggleBoss = (bossKey) => {
    setExpandedBoss(expandedBoss === bossKey ? null : bossKey);
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'damage': return <Sword size={20} />;
      case 'health': return <Heart size={20} />;
      case 'visual': return <Eye size={20} />;
      default: return <Info size={20} />;
    }
  };

  const currentData = nerfData[selectedTab];

  return (
    <Container>
      <Header>
        <Title>네루바르 왕궁 너프 가이드</Title>
        <Subtitle>2024년 12월 18일 비공개 핫픽스 적용</Subtitle>
      </Header>

      <TabContainer>
        <Tab
          active={selectedTab === 'salhadaar'}
          onClick={() => setSelectedTab('salhadaar')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          연합왕 살다하르
        </Tab>
        <Tab
          active={selectedTab === 'dimensius'}
          onClick={() => setSelectedTab('dimensius')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          디멘시우스 (신화)
        </Tab>
      </TabContainer>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {Object.entries(currentData).map(([phaseKey, phaseData]) => (
            <BossCard key={phaseKey}>
              <BossHeader onClick={() => toggleBoss(phaseKey)}>
                <BossInfo>
                  <BossIcon>{phaseData.icon}</BossIcon>
                  <BossDetails>
                    <BossName>{phaseData.name}</BossName>
                    <BossPhase>
                      <Activity size={14} />
                      {phaseData.phase}
                    </BossPhase>
                  </BossDetails>
                </BossInfo>
                <ExpandIcon expanded={expandedBoss === phaseKey}>
                  <ChevronDown size={24} />
                </ExpandIcon>
              </BossHeader>

              <AnimatePresence>
                {expandedBoss === phaseKey && (
                  <NerfContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NerfGrid>
                      {phaseData.nerfs.map((nerf, index) => (
                        <NerfItem key={index} severity={nerf.severity}>
                          <NerfIcon type={nerf.type}>
                            {getIconForType(nerf.type)}
                          </NerfIcon>
                          <NerfDetails>
                            <NerfName>
                              {nerf.name}
                              <NerfNameKorean>({nerf.korean})</NerfNameKorean>
                              {nerf.percentage && (
                                <NerfPercentage>
                                  <TrendingDown size={14} />
                                  {nerf.percentage}%
                                </NerfPercentage>
                              )}
                              {nerf.isNew && <Badge type="new">New</Badge>}
                            </NerfName>
                            <NerfDescription>{nerf.description}</NerfDescription>
                          </NerfDetails>
                        </NerfItem>
                      ))}
                    </NerfGrid>
                  </NerfContent>
                )}
              </AnimatePresence>
            </BossCard>
          ))}
        </motion.div>
      </AnimatePresence>

      <SummarySection>
        <SummaryTitle>
          <AlertCircle size={24} />
          패치 요약
        </SummaryTitle>
        <SummaryText>
          이번 주 정기 점검과 함께 실서버에 적용된 "비공개" 너프입니다.
          명예의 전당 진입을 노리는 상위 길드들에게 필요했던 조정으로,
          특히 분쇄하는 중력의 25% 피해 감소와 주요 쫄몹들의 생명력 10% 감소가 핵심적인 변경사항입니다.
        </SummaryText>

        <KeyChanges>
          <KeyChangeCard>
            <KeyChangeTitle>최대 피해 감소</KeyChangeTitle>
            <KeyChangeValue>-25%</KeyChangeValue>
          </KeyChangeCard>
          <KeyChangeCard>
            <KeyChangeTitle>평균 생명력 감소</KeyChangeTitle>
            <KeyChangeValue>-10%</KeyChangeValue>
          </KeyChangeCard>
          <KeyChangeCard>
            <KeyChangeTitle>영향받은 보스</KeyChangeTitle>
            <KeyChangeValue>2개</KeyChangeValue>
          </KeyChangeCard>
        </KeyChanges>
      </SummarySection>
    </Container>
  );
};

export default PatchNerfsGuide;