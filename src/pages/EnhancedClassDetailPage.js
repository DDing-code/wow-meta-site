import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import LogAnalyzer from '../components/LogAnalyzer';
import VisualClassGuide from '../components/VisualClassGuide';
import DetailedTierSystem from '../components/DetailedTierSystem';
import { gameIcons, classIcons, WowIcon } from '../utils/wowIcons';

const Container = styled.div`
  padding: 2rem 0;
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(243, 139, 168, 0.1), rgba(203, 166, 247, 0.1));
  border-radius: 20px;
`;

const ClassName = styled.h1`
  font-size: 3.5rem;
  color: ${props => props.color};
  margin-bottom: 1rem;
  font-weight: 800;
`;

const ClassDescription = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.subtext};
  max-width: 800px;
  margin: 0 auto;
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const TabButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.active ? props.color : props.theme.colors.surface};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.color};
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.color};
    color: white;
    transform: translateY(-2px);
  }
`;

const ContentSection = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.accent};
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.secondary};
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  border-top: 3px solid ${props => props.color};
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.subtext};
`;

const BiSSection = styled.div`
  margin: 2rem 0;
`;

const GearSlot = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.overlay};
    transform: translateX(5px);
  }
`;

const ItemIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.quality === 'legendary' ? 'linear-gradient(135deg, #ff8c00, #ffd700)' :
                         props.quality === 'epic' ? '#a335ee' :
                         props.quality === 'rare' ? '#0070dd' :
                         '#1eff00'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const ItemSource = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const VideoGuideSection = styled.div`
  margin: 2rem 0;
`;

const VideoCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const VideoThumbnail = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
`;

const VideoInfo = styled.div`
  padding: 1rem;
`;

const VideoTitle = styled.h3`
  margin-bottom: 0.5rem;
`;

const VideoAuthor = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.subtext};
`;

const WeakAuraSection = styled.div`
  margin: 2rem 0;
`;

const WeakAuraCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const ImportString = styled.div`
  background: ${props => props.theme.colors.primary};
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
  margin-top: 1rem;
`;

const CopyButton = styled.button`
  background: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 0.5rem;
  font-weight: 600;

  &:hover {
    opacity: 0.8;
  }
`;

function EnhancedClassDetailPage() {
  const { className } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const classData = {
    deathknight: {
      name: '죽음기사',
      color: '#C41E3A',
      description: '전직 리치 왕의 기사들로, 룬과 룬 마력을 사용하여 강력한 근접 전투와 언데드 마법을 구사합니다.',
      specs: ['혈기 (탱커)', '냉기 (근접 딜러)', '부정 (근접 딜러)'],
      stats: {
        popularity: '12.5%',
        winRate: '52.3%',
        difficulty: '중상',
        tier: 'S'
      },
      bis: {
        head: { name: '지배의 투구', source: '마나단조 오메가 - 3넴', quality: 'epic', ilvl: 489 },
        shoulder: { name: '영원한 겨울 어깨보호구', source: '신화+ 주간 보상', quality: 'epic', ilvl: 483 },
        chest: { name: '죽음의 기사 티어 가슴', source: '마나단조 오메가 - 5넴', quality: 'epic', ilvl: 489 },
        hands: { name: '죽음의 기사 티어 장갑', source: '마나단조 오메가 - 2넴', quality: 'epic', ilvl: 489 },
        legs: { name: '죽음의 기사 티어 다리', source: '마나단조 오메가 - 7넴', quality: 'epic', ilvl: 489 },
        weapon: { name: '파멸의 대검', source: '마나단조 오메가 - 막넴', quality: 'legendary', ilvl: 496 }
      },
      videos: [
        { title: '11.2 부정 죽음기사 완벽 가이드', author: 'Petkick', views: '125K' },
        { title: '혈기 죽음기사 신화+ 탱킹 마스터', author: 'Dorki', views: '89K' },
        { title: '냉기 DK PvP 2400+ 공략', author: 'Mes', views: '67K' }
      ],
      weakauras: [
        { name: '죽음기사 올인원 패키지', author: 'Luxthos', downloads: '450K' },
        { name: '룬 추적 프로', author: 'Afenar', downloads: '230K' }
      ]
    },
    warrior: {
      name: '전사',
      color: '#C69B6D',
      description: '순수한 힘과 분노로 싸우는 전투의 대가. 모든 상황에서 활약할 수 있는 다재다능한 전사입니다.',
      specs: ['무기 (근접 딜러)', '분노 (근접 딜러)', '방어 (탱커)'],
      stats: {
        popularity: '15.2%',
        winRate: '54.1%',
        difficulty: '하',
        tier: 'S'
      }
    },
    paladin: {
      name: '성기사',
      color: '#F48CBA',
      description: '빛의 힘을 사용하는 신성한 전사. 강력한 방어와 치유, 그리고 정의로운 심판을 내립니다.',
      specs: ['신성 (치유)', '보호 (탱커)', '징벌 (근접 딜러)'],
      stats: {
        popularity: '18.3%',
        winRate: '55.7%',
        difficulty: '중',
        tier: 'S+'
      }
    }
  };

  const currentClass = classData[className] || classData.deathknight;

  return (
    <Container>
      <Header>
        <ClassName color={currentClass.color}>
          {currentClass.name}
        </ClassName>
        <ClassDescription>
          {currentClass.description}
        </ClassDescription>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {currentClass.specs.map((spec, idx) => (
            <span key={idx} style={{
              background: currentClass.color,
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {spec}
            </span>
          ))}
        </div>
      </Header>

      <QuickStatsGrid>
        <StatCard
          color="#f38ba8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue color="#f38ba8">{currentClass.stats.tier}</StatValue>
          <StatLabel>현재 티어</StatLabel>
        </StatCard>
        <StatCard
          color="#a6e3a1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue color="#a6e3a1">{currentClass.stats.winRate}</StatValue>
          <StatLabel>승률</StatLabel>
        </StatCard>
        <StatCard
          color="#f9e2af"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue color="#f9e2af">{currentClass.stats.popularity}</StatValue>
          <StatLabel>픽률</StatLabel>
        </StatCard>
        <StatCard
          color="#cba6f7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue color="#cba6f7">{currentClass.stats.difficulty}</StatValue>
          <StatLabel>난이도</StatLabel>
        </StatCard>
      </QuickStatsGrid>

      <TabNavigation>
        <TabButton
          active={activeTab === 'overview'}
          color={currentClass.color}
          onClick={() => setActiveTab('overview')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <WowIcon icon={gameIcons.info} size={20} /> 개요
        </TabButton>
        <TabButton
          active={activeTab === 'guide'}
          color={currentClass.color}
          onClick={() => setActiveTab('guide')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <WowIcon icon={gameIcons.instant} size={20} /> 비주얼 가이드
        </TabButton>
        <TabButton
          active={activeTab === 'logs'}
          color={currentClass.color}
          onClick={() => setActiveTab('logs')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <WowIcon icon={gameIcons.achievement} size={20} /> 로그 분석
        </TabButton>
        <TabButton
          active={activeTab === 'tier'}
          color={currentClass.color}
          onClick={() => setActiveTab('tier')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <WowIcon icon={gameIcons.legendary} size={20} /> 티어 & 메트릭
        </TabButton>
        <TabButton
          active={activeTab === 'bis'}
          color={currentClass.color}
          onClick={() => setActiveTab('bis')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <WowIcon icon={gameIcons.settings} size={20} /> BiS & 세팅
        </TabButton>
        <TabButton
          active={activeTab === 'resources'}
          color={currentClass.color}
          onClick={() => setActiveTab('resources')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <WowIcon icon={gameIcons.quest} size={20} /> 가이드 & 자료
        </TabButton>
      </TabNavigation>

      {activeTab === 'overview' && (
        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SectionTitle>클래스 개요</SectionTitle>
          <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
            {currentClass.name}는 World of Warcraft에서 가장 인기 있는 클래스 중 하나입니다.
            현재 11.2 패치에서 {currentClass.stats.tier} 티어를 유지하고 있으며,
            레이드와 신화+ 던전 모두에서 우수한 성능을 보여주고 있습니다.
          </p>

          <h3 style={{ marginBottom: '1rem', color: currentClass.color }}>강점</h3>
          <ul style={{ marginBottom: '2rem', lineHeight: 1.8 }}>
            <li>높은 생존력과 자가 치유 능력</li>
            <li>강력한 버스트 피해</li>
            <li>우수한 광역 피해</li>
            <li>다양한 유틸리티 스킬</li>
          </ul>

          <h3 style={{ marginBottom: '1rem', color: currentClass.color }}>약점</h3>
          <ul style={{ lineHeight: 1.8 }}>
            <li>제한적인 기동성</li>
            <li>복잡한 자원 관리</li>
            <li>긴 쿨다운 의존도</li>
          </ul>
        </ContentSection>
      )}

      {activeTab === 'guide' && (
        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <VisualClassGuide classType={className} />
        </ContentSection>
      )}

      {activeTab === 'logs' && (
        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LogAnalyzer />
        </ContentSection>
      )}

      {activeTab === 'tier' && (
        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DetailedTierSystem />
        </ContentSection>
      )}

      {activeTab === 'bis' && currentClass.bis && (
        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SectionTitle>Best in Slot 장비</SectionTitle>
          <BiSSection>
            {Object.entries(currentClass.bis).map(([slot, item]) => (
              <GearSlot key={slot}>
                <ItemIcon quality={item.quality}>
                  {item.ilvl}
                </ItemIcon>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemSource>{item.source}</ItemSource>
                </ItemInfo>
              </GearSlot>
            ))}
          </BiSSection>
        </ContentSection>
      )}

      {activeTab === 'resources' && (
        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SectionTitle>가이드 & 자료</SectionTitle>

          {currentClass.videos && (
            <VideoGuideSection>
              <h3 style={{ marginBottom: '1rem' }}>추천 영상 가이드</h3>
              {currentClass.videos.map((video, idx) => (
                <VideoCard key={idx}>
                  <VideoThumbnail>
                    <WowIcon icon={gameIcons.quest} size={40} />
                  </VideoThumbnail>
                  <VideoInfo>
                    <VideoTitle>{video.title}</VideoTitle>
                    <VideoAuthor>{video.author} • 조회수 {video.views}</VideoAuthor>
                  </VideoInfo>
                </VideoCard>
              ))}
            </VideoGuideSection>
          )}

          {currentClass.weakauras && (
            <WeakAuraSection>
              <h3 style={{ marginBottom: '1rem' }}>WeakAuras 패키지</h3>
              {currentClass.weakauras.map((wa, idx) => (
                <WeakAuraCard key={idx}>
                  <h4>{wa.name}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#a6adc8', marginTop: '0.5rem' }}>
                    제작자: {wa.author} • 다운로드: {wa.downloads}
                  </p>
                  <ImportString>
                    !WA:2!nR1tVTrru8Lz3gL2Lz3gL2Lz3gL2Lz3gL2Lz3gL2Lz3gL2Lz3gL2Lz3gL2Lz3g...
                  </ImportString>
                  <CopyButton>복사하기</CopyButton>
                </WeakAuraCard>
              ))}
            </WeakAuraSection>
          )}
        </ContentSection>
      )}
    </Container>
  );
}

export default EnhancedClassDetailPage;