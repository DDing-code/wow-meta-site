import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Users, AlertTriangle, Target, Shield, Heart,
  Zap, Clock, ChevronRight, ChevronDown, Info,
  PlayCircle, Book, Award, Star, Sword, Activity,
  Navigation, Crosshair, AlertCircle, CheckCircle,
  XCircle, TrendingUp, Filter, Search
} from 'lucide-react';

const GuideContainer = styled.div`
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  padding: 10px 20px;
  background: ${props => props.active ?
    'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
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
      'linear-gradient(135deg, #059669 0%, #10b981 100%)' :
      'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const SearchBar = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SideNav = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  max-height: 800px;
  overflow-y: auto;

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

const NavSection = styled.div`
  margin-bottom: 25px;
`;

const NavTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NavItem = styled(motion.div)`
  padding: 10px 15px;
  background: ${props => props.active ?
    'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))' :
    'transparent'};
  border: 1px solid ${props => props.active ?
    'rgba(16, 185, 129, 0.3)' :
    'transparent'};
  border-radius: 8px;
  color: ${props => props.active ? '#10b981' : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;

  &:hover {
    background: rgba(16, 185, 129, 0.1);
    transform: translateX(5px);
  }
`;

const NavLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const DifficultyBadge = styled.span`
  padding: 2px 8px;
  background: ${props =>
    props.difficulty === 'mythic' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
    props.difficulty === 'heroic' ? 'linear-gradient(135deg, #a855f7, #9333ea)' :
    props.difficulty === 'normal' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
    'linear-gradient(135deg, #6b7280, #4b5563)'};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
`;

const MainContent = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px;
`;

const BossHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const BossInfo = styled.div`
  flex: 1;
`;

const BossName = styled.h3`
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
`;

const BossSubtitle = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
`;

const BossStats = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const BossStat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
`;

const PhaseContainer = styled.div`
  margin-bottom: 30px;
`;

const PhaseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
  border-left: 4px solid #10b981;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15));
  }
`;

const PhaseNumber = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const PhaseTitle = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
`;

const PhaseContent = styled(motion.div)`
  padding: 0 20px;
  overflow: hidden;
`;

const MechanicsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
`;

const MechanicItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const MechanicIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props =>
    props.type === 'tankbuster' ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))' :
    props.type === 'raidwide' ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))' :
    props.type === 'mechanic' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))' :
    'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.2))'};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props =>
    props.type === 'tankbuster' ? '#ef4444' :
    props.type === 'raidwide' ? '#fbbf24' :
    props.type === 'mechanic' ? '#a855f7' :
    '#60a5fa'};
`;

const MechanicInfo = styled.div`
  flex: 1;
`;

const MechanicName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 5px;
`;

const MechanicDescription = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
`;

const RoleSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const RoleCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const RoleIcon = styled.div`
  width: 30px;
  height: 30px;
  background: ${props =>
    props.role === 'tank' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
    props.role === 'healer' ? 'linear-gradient(135deg, #10b981, #059669)' :
    props.role === 'dps' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
    'linear-gradient(135deg, #6b7280, #4b5563)'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const RoleTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const RoleTips = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RoleTip = styled.li`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;

  &::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: ${props =>
      props.role === 'tank' ? '#3b82f6' :
      props.role === 'healer' ? '#10b981' :
      props.role === 'dps' ? '#ef4444' :
      '#6b7280'};
  }
`;

const VideoSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
`;

const VideoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const VideoTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const VideoCard = styled.a`
  display: block;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
`;

const VideoInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VideoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const VideoDetails = styled.div`
  flex: 1;
`;

const VideoName = styled.div`
  font-size: 14px;
  color: #fff;
  margin-bottom: 3px;
`;

const VideoAuthor = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

const RaidDungeonGuide = () => {
  const [selectedContent, setSelectedContent] = useState('nerubarak');
  const [selectedDifficulty, setSelectedDifficulty] = useState('heroic');
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // 레이드/던전 데이터
  const content = {
    nerubarak: {
      name: '안수브 여왕',
      subtitle: '네루바르 왕궁 - 최종 보스',
      health: '850M',
      enrage: '10:00',
      phases: [
        {
          number: 1,
          title: '거미 여왕의 분노 (100% - 70%)',
          mechanics: [
            {
              name: '독성 폭발',
              type: 'raidwide',
              icon: <AlertTriangle />,
              description: '전체 공격대에게 막대한 자연 피해를 입히고 10초간 지속 피해를 남깁니다. 공대 생존기 필수.'
            },
            {
              name: '그림자 베기',
              type: 'tankbuster',
              icon: <Shield />,
              description: '현재 탱커에게 강력한 물리 피해. 탱커 교대 필요. 디버프 2중첩 시 즉사.'
            },
            {
              name: '거미줄 덫',
              type: 'mechanic',
              icon: <Target />,
              description: '무작위 3명에게 거미줄 표식. 8초 후 해당 위치에 거미줄 생성. 가장자리로 유도.'
            }
          ]
        },
        {
          number: 2,
          title: '지하 침공 (70% - 40%)',
          mechanics: [
            {
              name: '땅굴 돌진',
              type: 'mechanic',
              icon: <Navigation />,
              description: '보스가 땅속으로 들어가 무작위 위치에서 출현. 예고 장판 확인 후 회피.'
            },
            {
              name: '산성 웅덩이',
              type: 'raidwide',
              icon: <AlertCircle />,
              description: '전장에 산성 웅덩이 생성. 밟으면 초당 5% 체력 감소. 안전지대 확보 중요.'
            }
          ]
        },
        {
          number: 3,
          title: '최후의 저항 (40% - 0%)',
          mechanics: [
            {
              name: '광폭화',
              type: 'mechanic',
              icon: <Zap />,
              description: '보스 공격속도 50% 증가, 피해량 30% 증가. 블러드 사용 필수.'
            },
            {
              name: '절망의 포효',
              type: 'raidwide',
              icon: <AlertTriangle />,
              description: '30초마다 전체 공격. 누적 피해 증가. 빠른 처치 필요.'
            }
          ]
        }
      ]
    }
  };

  const roleGuides = {
    tank: [
      '1페이즈에서 그림자 베기 2중첩 전 탱커 교대',
      '거미줄 덫은 공대원과 겹치지 않게 유도',
      '2페이즈 땅굴 돌진 시 보스 어그로 빠르게 획득',
      '3페이즈 광폭화 시 개인 생존기 순환 사용'
    ],
    healer: [
      '독성 폭발 전 공대 체력 100% 유지',
      '거미줄에 걸린 공대원 집중 케어',
      '산성 웅덩이 피해 받는 공대원 우선 힐',
      '3페이즈 절망의 포효 대비 쿨다운 분배'
    ],
    dps: [
      '거미줄 덫 표식 시 가장자리로 빠르게 이동',
      '2페이즈 보스 위치 예측하여 빠른 딜 재개',
      '산성 웅덩이 회피하며 딜 유지',
      '3페이즈 블러드/히어로 타이밍에 폭딜'
    ]
  };

  const videos = [
    { title: '안수브 여왕 영웅 공략', author: 'Method', views: '125K' },
    { title: '탱커 시점 상세 가이드', author: 'Limit', views: '89K' },
    { title: '힐러 쿨다운 로테이션', author: 'Echo', views: '67K' }
  ];

  return (
    <GuideContainer>
      <Header>
        <Title>
          <Map size={28} />
          레이드/던전 전략 가이드
        </Title>
        <FilterControls>
          <FilterButton
            active={selectedDifficulty === 'normal'}
            onClick={() => setSelectedDifficulty('normal')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            일반
          </FilterButton>
          <FilterButton
            active={selectedDifficulty === 'heroic'}
            onClick={() => setSelectedDifficulty('heroic')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            영웅
          </FilterButton>
          <FilterButton
            active={selectedDifficulty === 'mythic'}
            onClick={() => setSelectedDifficulty('mythic')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            신화
          </FilterButton>
          <SearchBar>
            <SearchInput
              placeholder="보스 또는 던전 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon size={18} />
          </SearchBar>
        </FilterControls>
      </Header>

      <ContentGrid>
        <SideNav>
          <NavSection>
            <NavTitle>네루바르 왕궁</NavTitle>
            <NavItem
              active={selectedContent === 'nerubarak'}
              onClick={() => setSelectedContent('nerubarak')}
              whileHover={{ scale: 1.02 }}
            >
              <NavLabel>
                <Sword size={16} />
                안수브 여왕
              </NavLabel>
              <DifficultyBadge difficulty={selectedDifficulty}>
                {selectedDifficulty === 'mythic' ? '신화' :
                 selectedDifficulty === 'heroic' ? '영웅' : '일반'}
              </DifficultyBadge>
            </NavItem>
            <NavItem whileHover={{ scale: 1.02 }}>
              <NavLabel>
                <Shield size={16} />
                실크스트랜드
              </NavLabel>
            </NavItem>
            <NavItem whileHover={{ scale: 1.02 }}>
              <NavLabel>
                <Zap size={16} />
                넥사라무스
              </NavLabel>
            </NavItem>
          </NavSection>

          <NavSection>
            <NavTitle>신화+ 던전</NavTitle>
            <NavItem whileHover={{ scale: 1.02 }}>
              <NavLabel>
                <Map size={16} />
                룬의 새벽
              </NavLabel>
            </NavItem>
            <NavItem whileHover={{ scale: 1.02 }}>
              <NavLabel>
                <Map size={16} />
                넬타리온의 둥지
              </NavLabel>
            </NavItem>
            <NavItem whileHover={{ scale: 1.02 }}>
              <NavLabel>
                <Map size={16} />
                아즈샤라의 영광
              </NavLabel>
            </NavItem>
          </NavSection>
        </SideNav>

        <MainContent>
          {content[selectedContent] && (
            <>
              <BossHeader>
                <BossInfo>
                  <BossName>{content[selectedContent].name}</BossName>
                  <BossSubtitle>{content[selectedContent].subtitle}</BossSubtitle>
                  <BossStats>
                    <BossStat>
                      <Heart size={16} />
                      체력: {content[selectedContent].health}
                    </BossStat>
                    <BossStat>
                      <Clock size={16} />
                      격노: {content[selectedContent].enrage}
                    </BossStat>
                    <BossStat>
                      <Users size={16} />
                      공대 규모: 20명
                    </BossStat>
                  </BossStats>
                </BossInfo>
              </BossHeader>

              {content[selectedContent].phases.map((phase) => (
                <PhaseContainer key={phase.number}>
                  <PhaseHeader onClick={() => setExpandedPhase(
                    expandedPhase === phase.number ? null : phase.number
                  )}>
                    <PhaseNumber>{phase.number}</PhaseNumber>
                    <PhaseTitle>{phase.title}</PhaseTitle>
                    {expandedPhase === phase.number ?
                      <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </PhaseHeader>

                  <AnimatePresence>
                    {expandedPhase === phase.number && (
                      <PhaseContent
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MechanicsList>
                          {phase.mechanics.map((mechanic, index) => (
                            <MechanicItem key={index}>
                              <MechanicIcon type={mechanic.type}>
                                {mechanic.icon}
                              </MechanicIcon>
                              <MechanicInfo>
                                <MechanicName>{mechanic.name}</MechanicName>
                                <MechanicDescription>
                                  {mechanic.description}
                                </MechanicDescription>
                              </MechanicInfo>
                            </MechanicItem>
                          ))}
                        </MechanicsList>
                      </PhaseContent>
                    )}
                  </AnimatePresence>
                </PhaseContainer>
              ))}

              <RoleSection>
                <RoleCard>
                  <RoleHeader>
                    <RoleIcon role="tank">
                      <Shield size={18} />
                    </RoleIcon>
                    <RoleTitle>탱커 가이드</RoleTitle>
                  </RoleHeader>
                  <RoleTips>
                    {roleGuides.tank.map((tip, index) => (
                      <RoleTip key={index} role="tank">{tip}</RoleTip>
                    ))}
                  </RoleTips>
                </RoleCard>

                <RoleCard>
                  <RoleHeader>
                    <RoleIcon role="healer">
                      <Heart size={18} />
                    </RoleIcon>
                    <RoleTitle>힐러 가이드</RoleTitle>
                  </RoleHeader>
                  <RoleTips>
                    {roleGuides.healer.map((tip, index) => (
                      <RoleTip key={index} role="healer">{tip}</RoleTip>
                    ))}
                  </RoleTips>
                </RoleCard>

                <RoleCard>
                  <RoleHeader>
                    <RoleIcon role="dps">
                      <Sword size={18} />
                    </RoleIcon>
                    <RoleTitle>딜러 가이드</RoleTitle>
                  </RoleHeader>
                  <RoleTips>
                    {roleGuides.dps.map((tip, index) => (
                      <RoleTip key={index} role="dps">{tip}</RoleTip>
                    ))}
                  </RoleTips>
                </RoleCard>
              </RoleSection>

              <VideoSection>
                <VideoHeader>
                  <VideoIcon>
                    <PlayCircle size={18} />
                  </VideoIcon>
                  <VideoTitle>추천 영상 가이드</VideoTitle>
                </VideoHeader>
                <VideoGrid>
                  {videos.map((video, index) => (
                    <VideoCard key={index}>
                      <VideoInfo>
                        <VideoIcon>
                          <PlayCircle size={20} />
                        </VideoIcon>
                        <VideoDetails>
                          <VideoName>{video.title}</VideoName>
                          <VideoAuthor>{video.author} • 조회수 {video.views}</VideoAuthor>
                        </VideoDetails>
                      </VideoInfo>
                    </VideoCard>
                  ))}
                </VideoGrid>
              </VideoSection>
            </>
          )}
        </MainContent>
      </ContentGrid>
    </GuideContainer>
  );
};

export default RaidDungeonGuide;