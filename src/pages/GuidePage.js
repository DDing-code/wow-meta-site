import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// WoW 클래스 색상
const classColors = {
  warrior: '#C79C6E',
  paladin: '#F58CBA',
  hunter: '#AAD372',
  rogue: '#FFF569',
  priest: '#FFFFFF',
  deathknight: '#C41E3A',
  shaman: '#0070DE',
  mage: '#3FC6EA',
  warlock: '#9382C9',
  monk: '#00FF96',
  druid: '#FF7D0A',
  demonhunter: '#A330C9',
  evoker: '#33937F'
};

// 직업 데이터
const classData = {
  tanks: [
    {
      id: 'warrior-protection',
      className: '전사',
      spec: '방어',
      color: classColors.warrior,
      icon: '🛡️',
      ready: true,
      path: '/guide/warrior/protection'
    },
    {
      id: 'paladin-protection',
      className: '성기사',
      spec: '보호',
      color: classColors.paladin,
      icon: '🛡️',
      ready: false,
      path: '/guide/paladin/protection'
    },
    {
      id: 'deathknight-blood',
      className: '죽음의 기사',
      spec: '혈기',
      color: classColors.deathknight,
      icon: '💀',
      ready: false,
      path: '/guide/deathknight/blood'
    },
    {
      id: 'monk-brewmaster',
      className: '수도사',
      spec: '양조',
      color: classColors.monk,
      icon: '🍺',
      ready: false,
      path: '/guide/monk/brewmaster'
    },
    {
      id: 'druid-guardian',
      className: '드루이드',
      spec: '수호',
      color: classColors.druid,
      icon: '🐻',
      ready: false,
      path: '/guide/druid/guardian'
    },
    {
      id: 'demonhunter-vengeance',
      className: '악마사냥꾼',
      spec: '복수',
      color: classColors.demonhunter,
      icon: '😈',
      ready: false,
      path: '/guide/demonhunter/vengeance'
    }
  ],
  melee: [
    {
      id: 'warrior-arms',
      className: '전사',
      spec: '무기',
      color: classColors.warrior,
      icon: '⚔️',
      ready: false,
      path: '/guide/warrior/arms'
    },
    {
      id: 'warrior-fury',
      className: '전사',
      spec: '분노',
      color: classColors.warrior,
      icon: '⚔️',
      ready: true,
      path: '/guide/warrior/fury'
    },
    {
      id: 'paladin-retribution',
      className: '성기사',
      spec: '징벌',
      color: classColors.paladin,
      icon: '⚡',
      ready: false,
      path: '/guide/paladin/retribution'
    },
    {
      id: 'rogue-assassination',
      className: '도적',
      spec: '암살',
      color: classColors.rogue,
      icon: '🗡️',
      ready: false,
      path: '/guide/rogue/assassination'
    },
    {
      id: 'rogue-outlaw',
      className: '도적',
      spec: '무법',
      color: classColors.rogue,
      icon: '🗡️',
      ready: false,
      path: '/guide/rogue/outlaw'
    },
    {
      id: 'rogue-subtlety',
      className: '도적',
      spec: '잠행',
      color: classColors.rogue,
      icon: '🗡️',
      ready: false,
      path: '/guide/rogue/subtlety'
    },
    {
      id: 'deathknight-frost',
      className: '죽음의 기사',
      spec: '냉기',
      color: classColors.deathknight,
      icon: '❄️',
      ready: false,
      path: '/guide/deathknight/frost'
    },
    {
      id: 'deathknight-unholy',
      className: '죽음의 기사',
      spec: '부정',
      color: classColors.deathknight,
      icon: '☠️',
      ready: false,
      path: '/guide/deathknight/unholy'
    },
    {
      id: 'monk-windwalker',
      className: '수도사',
      spec: '풍운',
      color: classColors.monk,
      icon: '🌪️',
      ready: false,
      path: '/guide/monk/windwalker'
    },
    {
      id: 'druid-feral',
      className: '드루이드',
      spec: '야성',
      color: classColors.druid,
      icon: '🐱',
      ready: false,
      path: '/guide/druid/feral'
    },
    {
      id: 'demonhunter-havoc',
      className: '악마사냥꾼',
      spec: '파멸',
      color: classColors.demonhunter,
      icon: '🔥',
      ready: true,
      path: '/guide/demonhunter/havoc'
    },
    {
      id: 'shaman-enhancement',
      className: '주술사',
      spec: '고양',
      color: classColors.shaman,
      icon: '⚡',
      ready: false,
      path: '/guide/shaman/enhancement'
    },
    {
      id: 'hunter-survival',
      className: '사냥꾼',
      spec: '생존',
      color: classColors.hunter,
      icon: '🪓',
      ready: false,
      path: '/guide/hunter/survival'
    }
  ],
  ranged: [
    {
      id: 'hunter-beastmastery',
      className: '사냥꾼',
      spec: '야수',
      color: classColors.hunter,
      icon: '🏹',
      ready: true,
      path: '/guide/hunter/beast-mastery'
    },
    {
      id: 'hunter-marksmanship',
      className: '사냥꾼',
      spec: '사격',
      color: classColors.hunter,
      icon: '🎯',
      ready: false,
      path: '/guide/hunter/marksmanship'
    },
    {
      id: 'priest-shadow',
      className: '사제',
      spec: '암흑',
      color: classColors.priest,
      icon: '🌑',
      ready: false,
      path: '/guide/priest/shadow'
    },
    {
      id: 'shaman-elemental',
      className: '주술사',
      spec: '정기',
      color: classColors.shaman,
      icon: '⚡',
      ready: true,
      path: '/guide/shaman/elemental'
    },
    {
      id: 'mage-arcane',
      className: '마법사',
      spec: '비전',
      color: classColors.mage,
      icon: '✨',
      ready: true,
      path: '/guide/mage/arcane'
    },
    {
      id: 'mage-fire',
      className: '마법사',
      spec: '화염',
      color: classColors.mage,
      icon: '🔥',
      ready: false,
      path: '/guide/mage/fire'
    },
    {
      id: 'mage-frost',
      className: '마법사',
      spec: '냉기',
      color: classColors.mage,
      icon: '❄️',
      ready: false,
      path: '/guide/mage/frost'
    },
    {
      id: 'warlock-affliction',
      className: '흑마법사',
      spec: '고통',
      color: classColors.warlock,
      icon: '💀',
      ready: true,
      path: '/guide/warlock/affliction'
    },
    {
      id: 'warlock-demonology',
      className: '흑마법사',
      spec: '악마',
      color: classColors.warlock,
      icon: '👹',
      ready: true,
      path: '/guide/warlock/demonology'
    },
    {
      id: 'warlock-destruction',
      className: '흑마법사',
      spec: '파괴',
      color: classColors.warlock,
      icon: '🔥',
      ready: true,
      path: '/guide/warlock/destruction'
    },
    {
      id: 'druid-balance',
      className: '드루이드',
      spec: '조화',
      color: classColors.druid,
      icon: '🌙',
      ready: false,
      path: '/guide/druid/balance'
    },
    {
      id: 'evoker-devastation',
      className: '기원사',
      spec: '황폐',
      color: classColors.evoker,
      icon: '🐲',
      ready: true,
      path: '/guide/evoker/devastation'
    },
    {
      id: 'evoker-augmentation',
      className: '기원사',
      spec: '증강',
      color: classColors.evoker,
      icon: '✨',
      ready: false,
      path: '/guide/evoker/augmentation'
    }
  ],
  healers: [
    {
      id: 'paladin-holy',
      className: '성기사',
      spec: '신성',
      color: classColors.paladin,
      icon: '✨',
      ready: false,
      path: '/guide/paladin/holy'
    },
    {
      id: 'priest-discipline',
      className: '사제',
      spec: '수양',
      color: classColors.priest,
      icon: '🛡️',
      ready: false,
      path: '/guide/priest/discipline'
    },
    {
      id: 'priest-holy',
      className: '사제',
      spec: '신성',
      color: classColors.priest,
      icon: '✨',
      ready: false,
      path: '/guide/priest/holy'
    },
    {
      id: 'shaman-restoration',
      className: '주술사',
      spec: '복원',
      color: classColors.shaman,
      icon: '💧',
      ready: false,
      path: '/guide/shaman/restoration'
    },
    {
      id: 'monk-mistweaver',
      className: '수도사',
      spec: '운무',
      color: classColors.monk,
      icon: '☁️',
      ready: false,
      path: '/guide/monk/mistweaver'
    },
    {
      id: 'druid-restoration',
      className: '드루이드',
      spec: '회복',
      color: classColors.druid,
      icon: '🌿',
      ready: false,
      path: '/guide/druid/restoration'
    },
    {
      id: 'evoker-preservation',
      className: '기원사',
      spec: '보존',
      color: classColors.evoker,
      icon: '💚',
      ready: false,
      path: '/guide/evoker/preservation'
    }
  ]
};

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

// Magic Bullet Background
const MagicBulletCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
`;

const Bullet = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${props => props.color || '#fff'};
  border-radius: 50%;
  box-shadow: 0 0 10px ${props => props.color || '#fff'};
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #a0a0a0;
  margin-bottom: 2rem;
`;

const RoleTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const RoleTab = styled(motion.button)`
  padding: 0.7rem 1.5rem;
  background: ${props => props.active ?
    'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2))' :
    'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.active ? '#FFD700' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  color: ${props => props.active ? '#FFD700' : '#a0a0a0'};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.3));
    border-color: #FFD700;
    color: #FFD700;
    transform: translateY(-2px);
  }
`;

const ClassGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const ClassSection = styled.div`
  margin-bottom: 2rem;
`;

const ClassSectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.color};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.color};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClassSectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const ClassCard = styled(motion.div)`
  background: rgba(20, 20, 30, 0.8);
  border: 2px solid ${props => props.ready ? props.color : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 0.7rem 1rem;
  cursor: ${props => props.ready ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.color}, transparent);
    opacity: ${props => props.ready ? 1 : 0.3};
  }

  ${props => props.ready && `
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border-color: ${props.color};
      background: rgba(30, 30, 40, 0.9);
    }
  `}
`;

const ClassIcon = styled.div`
  font-size: 1.5rem;
  filter: ${props => props.ready ? 'none' : 'grayscale(1)'};
  opacity: ${props => props.ready ? 1 : 0.5};
  flex-shrink: 0;
`;

const ClassInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ClassName = styled.h3`
  font-size: 0.95rem;
  color: ${props => props.color};
  margin: 0;
  opacity: ${props => props.ready ? 1 : 0.6};
`;

const SpecName = styled.p`
  font-size: 0.85rem;
  color: #a0a0a0;
  margin: 0;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  background: ${props => props.ready ?
    'linear-gradient(135deg, #4CAF50, #45a049)' :
    'linear-gradient(135deg, #666, #555)'};
  border-radius: 12px;
  font-size: 0.7rem;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #666;
  font-size: 1.2rem;
`;

// Magic Bullet Component
function MagicBullets() {
  const [bullets, setBullets] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBullet = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: -10,
        color: Object.values(classColors)[Math.floor(Math.random() * Object.values(classColors).length)],
        duration: 3 + Math.random() * 2
      };
      setBullets(prev => [...prev.slice(-20), newBullet]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <MagicBulletCanvas>
      <AnimatePresence>
        {bullets.map(bullet => (
          <Bullet
            key={bullet.id}
            color={bullet.color}
            initial={{ x: bullet.x, y: bullet.y }}
            animate={{
              y: window.innerHeight + 10,
              x: bullet.x + (Math.random() - 0.5) * 200
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: bullet.duration,
              ease: "linear"
            }}
          />
        ))}
      </AnimatePresence>
    </MagicBulletCanvas>
  );
}

function GuidePage() {
  const [activeRole, setActiveRole] = useState('all');

  const roles = [
    { id: 'all', label: '전체', icon: '⚔️' },
    { id: 'tanks', label: '탱커', icon: '🛡️' },
    { id: 'melee', label: '근딜', icon: '⚔️' },
    { id: 'ranged', label: '원딜', icon: '🏹' },
    { id: 'healers', label: '힐러', icon: '💚' }
  ];

  const getFilteredClasses = () => {
    if (activeRole === 'all') {
      return [...classData.tanks, ...classData.melee, ...classData.ranged, ...classData.healers];
    }
    return classData[activeRole] || [];
  };

  const getGroupedClasses = () => {
    const allSpecs = [...classData.tanks, ...classData.melee, ...classData.ranged, ...classData.healers];
    const grouped = {};

    allSpecs.forEach(spec => {
      if (!grouped[spec.className]) {
        grouped[spec.className] = {
          name: spec.className,
          color: spec.color,
          specs: []
        };
      }
      grouped[spec.className].specs.push(spec);
    });

    // 직업 순서 정의
    const classOrder = ['전사', '성기사', '사냥꾼', '도적', '사제', '죽음의 기사',
                       '주술사', '마법사', '흑마법사', '수도사', '드루이드', '악마사냥꾼', '기원사'];

    return classOrder
      .filter(className => grouped[className])
      .map(className => grouped[className]);
  };

  const filteredClasses = getFilteredClasses();
  const groupedClasses = getGroupedClasses();

  return (
    <PageWrapper>
      <MagicBullets />

      <Container>
        <Header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>직업 가이드</Title>
          <Subtitle>11.2.5 패치 최신 가이드</Subtitle>
        </Header>

        <RoleTabs>
          {roles.map(role => (
            <RoleTab
              key={role.id}
              active={activeRole === role.id}
              onClick={() => setActiveRole(role.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {role.icon} {role.label}
            </RoleTab>
          ))}
        </RoleTabs>

        <AnimatePresence mode="wait">
          {activeRole === 'all' ? (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {groupedClasses.map((classGroup, groupIndex) => (
                <ClassSection key={classGroup.name}>
                  <ClassSectionTitle color={classGroup.color}>
                    {classGroup.specs[0].icon} {classGroup.name}
                  </ClassSectionTitle>
                  <ClassSectionGrid>
                    {classGroup.specs.map((spec, index) => (
                      <motion.div
                        key={spec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (groupIndex * 3 + index) * 0.05 }}
                      >
                        {spec.ready ? (
                          <Link to={spec.path} style={{ textDecoration: 'none' }}>
                            <ClassCard color={spec.color} ready={spec.ready}>
                              <ClassIcon ready={spec.ready}>{spec.icon}</ClassIcon>
                              <ClassInfo>
                                <ClassName color={spec.color} ready={spec.ready}>
                                  {spec.className}
                                </ClassName>
                                <SpecName>{spec.spec}</SpecName>
                              </ClassInfo>
                              <StatusBadge ready={spec.ready}>
                                이용 가능
                              </StatusBadge>
                            </ClassCard>
                          </Link>
                        ) : (
                          <ClassCard color={spec.color} ready={spec.ready}>
                            <ClassIcon ready={spec.ready}>{spec.icon}</ClassIcon>
                            <ClassInfo>
                              <ClassName color={spec.color} ready={spec.ready}>
                                {spec.className}
                              </ClassName>
                              <SpecName>{spec.spec}</SpecName>
                            </ClassInfo>
                            <StatusBadge ready={spec.ready}>
                              준비 중
                            </StatusBadge>
                          </ClassCard>
                        )}
                      </motion.div>
                    ))}
                  </ClassSectionGrid>
                </ClassSection>
              ))}
            </motion.div>
          ) : (
            <ClassGrid
              key={activeRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredClasses.map((spec, index) => (
                <motion.div
                  key={spec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {spec.ready ? (
                    <Link to={spec.path} style={{ textDecoration: 'none' }}>
                      <ClassCard color={spec.color} ready={spec.ready}>
                        <ClassIcon ready={spec.ready}>{spec.icon}</ClassIcon>
                        <ClassInfo>
                          <ClassName color={spec.color} ready={spec.ready}>
                            {spec.className}
                          </ClassName>
                          <SpecName>{spec.spec}</SpecName>
                        </ClassInfo>
                        <StatusBadge ready={spec.ready}>
                          이용 가능
                        </StatusBadge>
                      </ClassCard>
                    </Link>
                  ) : (
                    <ClassCard color={spec.color} ready={spec.ready}>
                      <ClassIcon ready={spec.ready}>{spec.icon}</ClassIcon>
                      <ClassInfo>
                        <ClassName color={spec.color} ready={spec.ready}>
                          {spec.className}
                        </ClassName>
                        <SpecName>{spec.spec}</SpecName>
                      </ClassInfo>
                      <StatusBadge ready={spec.ready}>
                        준비 중
                      </StatusBadge>
                    </ClassCard>
                  )}
                </motion.div>
              ))}
            </ClassGrid>
          )}
        </AnimatePresence>

        {filteredClasses.length === 0 && (
          <EmptyState>
            선택한 역할군에 해당하는 직업이 없습니다.
          </EmptyState>
        )}
      </Container>
    </PageWrapper>
  );
}

export default GuidePage;