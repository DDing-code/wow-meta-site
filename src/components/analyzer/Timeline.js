import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WowIcon, getWowIcon } from '../../utils/wowIcons.js';

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

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.spring};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-family: ${props => props.theme.fonts.main};
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &.active {
    background: ${props => props.theme.gradients.accent};
    color: white;
    border-color: transparent;
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  margin: 1rem 0;
`;

const TimelineWrapper = styled.div`
  position: relative;
  min-height: 400px;
  width: ${props => props.duration * props.scale}px;
  background: rgba(20, 24, 35, 0.5);
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
`;

const TimeAxis = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: ${props => props.theme.colors.primary};
  border-bottom: 2px solid ${props => props.theme.colors.overlay};
  display: flex;
  align-items: center;
`;

const TimeMarker = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: ${props => props.theme.colors.overlay};
  opacity: 0.5;

  &.major {
    background: ${props => props.theme.colors.text};
    opacity: 0.3;
  }
`;

const TimeLabel = styled.div`
  position: absolute;
  top: 5px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.subtext};
  transform: translateX(-50%);
`;

const TrackContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Track = styled.div`
  position: relative;
  height: ${props => props.height}px;
  border-bottom: 1px solid ${props => props.theme.colors.overlay};
  display: flex;
  align-items: center;
`;

const TrackLabel = styled.div`
  position: absolute;
  left: 10px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.secondary}dd;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  z-index: 10;
`;

const EventBar = styled(motion.div)`
  position: absolute;
  height: ${props => props.height || 30}px;
  background: ${props => props.color};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.overlay};
  z-index: ${props => props.zIndex || 1};

  &:hover {
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    filter: brightness(1.2);
  }
`;

const EventIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CastBar = styled(motion.div)`
  position: absolute;
  height: 4px;
  background: ${props => props.color || props.theme.colors.accent};
  border-radius: 2px;
  opacity: 0.8;
`;

const BuffBar = styled(motion.div)`
  position: absolute;
  height: 20px;
  background: ${props => props.color}33;
  border: 1px solid ${props => props.color};
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 0.3rem;
  font-size: 0.7rem;
  color: ${props => props.theme.colors.text};
`;

const ResourceBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: ${props => props.theme.colors.primary};
  border-top: 1px solid ${props => props.theme.colors.overlay};
`;

const ResourceFill = styled.div`
  position: absolute;
  bottom: 0;
  left: ${props => props.start}px;
  width: ${props => props.width}px;
  height: ${props => props.height}%;
  background: ${props => props.color};
  opacity: 0.7;
  transition: all 0.3s;
`;

const Tooltip = styled(motion.div)`
  position: fixed;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.accent};
  border-radius: 8px;
  padding: 1rem;
  z-index: 1000;
  pointer-events: none;
  max-width: 300px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TooltipContent = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
  line-height: 1.4;
`;

const PlaybackControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 8px;
`;

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.primary};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${props => props.theme.colors.overlay};
  border-radius: 3px;
  position: relative;
  cursor: pointer;
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${props => props.progress}%;
  background: ${props => props.theme.colors.accent};
  border-radius: 3px;
  transition: width 0.1s;
`;

const TimeDisplay = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  min-width: 100px;
  text-align: center;
`;

const CurrentTimeIndicator = styled(motion.div)`
  position: absolute;
  top: 30px;
  bottom: 0;
  width: 2px;
  background: ${props => props.theme.colors.error};
  z-index: 50;
  pointer-events: none;

  &:before {
    content: '';
    position: absolute;
    top: -5px;
    left: -4px;
    width: 10px;
    height: 10px;
    background: ${props => props.theme.colors.error};
    border-radius: 50%;
  }
`;

function Timeline({ combatData, duration = 300 }) {
  const [scale, setScale] = useState(5); // pixels per second
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTracks, setSelectedTracks] = useState(['abilities', 'buffs', 'resources']);

  const timelineRef = useRef(null);
  const animationRef = useRef(null);

  // 재생 로직
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - currentTime * 1000;

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;

        if (elapsed >= duration) {
          setCurrentTime(duration);
          setIsPlaying(false);
        } else {
          setCurrentTime(elapsed);
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration]);

  // 시간 포맷
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 타임라인 클릭 핸들러
  const handleTimelineClick = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    const clickedTime = x / scale;
    setCurrentTime(Math.max(0, Math.min(duration, clickedTime)));
  };

  // 이벤트 호버
  const handleEventHover = (event, e) => {
    setHoveredEvent(event);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // 시간 마커 생성
  const renderTimeMarkers = () => {
    const markers = [];
    const interval = scale < 3 ? 30 : scale < 5 ? 10 : 5; // seconds

    for (let i = 0; i <= duration; i += interval) {
      markers.push(
        <React.Fragment key={i}>
          <TimeMarker
            className={i % 60 === 0 ? 'major' : ''}
            style={{ left: i * scale }}
          />
          {i % (interval * 2) === 0 && (
            <TimeLabel style={{ left: i * scale }}>
              {formatTime(i)}
            </TimeLabel>
          )}
        </React.Fragment>
      );
    }
    return markers;
  };

  // 샘플 데이터 (실제로는 combatData prop 사용)
  const sampleData = combatData || {
    abilities: [
      { id: 1, name: '무모한 희생', icon: 'ability_warrior_recklessness', start: 5, duration: 10, color: '#f38ba8' },
      { id: 2, name: '투신', icon: 'ability_warrior_avatar', start: 15, duration: 20, color: '#cba6f7' },
      { id: 3, name: '칼날폭풍', icon: 'ability_warrior_bladestorm', start: 30, duration: 6, color: '#94e2d5' },
      { id: 4, name: '무모한 희생', icon: 'ability_warrior_recklessness', start: 120, duration: 10, color: '#f38ba8' },
      { id: 5, name: '투신', icon: 'ability_warrior_avatar', start: 135, duration: 20, color: '#cba6f7' },
    ],
    casts: [
      { id: 1, name: '피의 갈증', time: 2, color: '#fab387' },
      { id: 2, name: '분쇄', time: 4, color: '#fab387' },
      { id: 3, name: '피의 갈증', time: 6.5, color: '#fab387' },
      { id: 4, name: '격돌', time: 9, color: '#a6e3a1' },
      { id: 5, name: '선풍', time: 12, color: '#89dceb' },
    ],
    buffs: [
      { id: 1, name: '격노', start: 5, duration: 8, color: '#f9e2af' },
      { id: 2, name: '피의 욕망', start: 15, duration: 30, color: '#f38ba8' },
      { id: 3, name: '학살자', start: 25, duration: 15, color: '#cba6f7' },
    ],
    resources: [
      { time: 0, value: 0 },
      { time: 5, value: 30 },
      { time: 10, value: 80 },
      { time: 15, value: 45 },
      { time: 20, value: 100 },
      { time: 25, value: 60 },
      { time: 30, value: 20 },
    ],
    debuffs: [
      { id: 1, name: '깊은 상처', target: 'Boss', start: 3, duration: 20, color: '#f38ba8' },
      { id: 2, name: '압도', target: 'Boss', start: 8, duration: 15, color: '#fab387' },
    ],
    deaths: [
      { time: 145, player: '플레이어1', cause: '불길' },
      { time: 210, player: '플레이어2', cause: '낙사' },
    ]
  };

  return (
    <Container>
      <Header>
        <Title>⏱️ 전투 타임라인</Title>
        <Controls>
          <ControlButton
            className={selectedTracks.includes('abilities') ? 'active' : ''}
            onClick={() => setSelectedTracks(prev =>
              prev.includes('abilities')
                ? prev.filter(t => t !== 'abilities')
                : [...prev, 'abilities']
            )}
          >
            쿨다운
          </ControlButton>
          <ControlButton
            className={selectedTracks.includes('buffs') ? 'active' : ''}
            onClick={() => setSelectedTracks(prev =>
              prev.includes('buffs')
                ? prev.filter(t => t !== 'buffs')
                : [...prev, 'buffs']
            )}
          >
            버프
          </ControlButton>
          <ControlButton
            className={selectedTracks.includes('resources') ? 'active' : ''}
            onClick={() => setSelectedTracks(prev =>
              prev.includes('resources')
                ? prev.filter(t => t !== 'resources')
                : [...prev, 'resources']
            )}
          >
            자원
          </ControlButton>
          <ControlButton onClick={() => setScale(prev => Math.max(2, prev - 1))}>
            축소
          </ControlButton>
          <ControlButton onClick={() => setScale(prev => Math.min(10, prev + 1))}>
            확대
          </ControlButton>
        </Controls>
      </Header>

      <TimelineContainer ref={timelineRef} onClick={handleTimelineClick}>
        <TimelineWrapper duration={duration} scale={scale}>
          <TimeAxis>
            {renderTimeMarkers()}
          </TimeAxis>

          <TrackContainer>
            {/* 쿨다운 트랙 */}
            {selectedTracks.includes('abilities') && (
              <Track height={60}>
                <TrackLabel>쿨다운</TrackLabel>
                {sampleData.abilities.map(ability => (
                  <EventBar
                    key={ability.id}
                    style={{
                      left: ability.start * scale,
                      width: ability.duration * scale,
                      top: 15
                    }}
                    color={ability.color}
                    height={30}
                    onMouseEnter={(e) => handleEventHover(ability, e)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <EventIcon>
                      <WowIcon icon={getWowIcon(ability.icon)} size={24} />
                    </EventIcon>
                  </EventBar>
                ))}
              </Track>
            )}

            {/* 시전 트랙 */}
            <Track height={40}>
              <TrackLabel>시전</TrackLabel>
              {sampleData.casts.map(cast => (
                <CastBar
                  key={cast.id}
                  style={{
                    left: cast.time * scale - 1,
                    width: 2,
                    top: 18
                  }}
                  color={cast.color}
                />
              ))}
            </Track>

            {/* 버프 트랙 */}
            {selectedTracks.includes('buffs') && (
              <Track height={50}>
                <TrackLabel>버프</TrackLabel>
                {sampleData.buffs.map(buff => (
                  <BuffBar
                    key={buff.id}
                    style={{
                      left: buff.start * scale,
                      width: buff.duration * scale,
                      top: 15
                    }}
                    color={buff.color}
                    onMouseEnter={(e) => handleEventHover(buff, e)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    {buff.name}
                  </BuffBar>
                ))}
              </Track>
            )}

            {/* 디버프 트랙 */}
            <Track height={50}>
              <TrackLabel>디버프</TrackLabel>
              {sampleData.debuffs.map(debuff => (
                <BuffBar
                  key={debuff.id}
                  style={{
                    left: debuff.start * scale,
                    width: debuff.duration * scale,
                    top: 15,
                    background: `${debuff.color}44`,
                    borderStyle: 'dashed'
                  }}
                  color={debuff.color}
                  onMouseEnter={(e) => handleEventHover(debuff, e)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {debuff.name}
                </BuffBar>
              ))}
            </Track>

            {/* 죽음 표시 */}
            <Track height={40}>
              <TrackLabel>죽음</TrackLabel>
              {sampleData.deaths.map((death, idx) => (
                <EventBar
                  key={idx}
                  style={{
                    left: death.time * scale - 15,
                    width: 30,
                    top: 10
                  }}
                  color="#f38ba8"
                  height={20}
                  onMouseEnter={(e) => handleEventHover(death, e)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  💀
                </EventBar>
              ))}
            </Track>

            {/* 자원 트랙 */}
            {selectedTracks.includes('resources') && (
              <Track height={60}>
                <TrackLabel>분노</TrackLabel>
                {sampleData.resources.map((point, idx) => {
                  if (idx === 0) return null;
                  const prevPoint = sampleData.resources[idx - 1];
                  return (
                    <ResourceFill
                      key={idx}
                      start={prevPoint.time * scale}
                      width={(point.time - prevPoint.time) * scale}
                      height={point.value}
                      color="#fab387"
                    />
                  );
                })}
              </Track>
            )}
          </TrackContainer>

          {/* 현재 시간 표시기 */}
          <CurrentTimeIndicator
            style={{ left: currentTime * scale }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </TimelineWrapper>
      </TimelineContainer>

      {/* 재생 컨트롤 */}
      <PlaybackControls>
        <PlayButton onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸' : '▶'}
        </PlayButton>
        <ProgressBar onClick={handleTimelineClick}>
          <ProgressFill progress={(currentTime / duration) * 100} />
        </ProgressBar>
        <TimeDisplay>
          {formatTime(currentTime)} / {formatTime(duration)}
        </TimeDisplay>
      </PlaybackControls>

      {/* 툴팁 */}
      {hoveredEvent && (
        <Tooltip
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 50
          }}
        >
          <TooltipTitle>
            {hoveredEvent.icon && (
              <WowIcon icon={getWowIcon(hoveredEvent.icon)} size={20} />
            )}
            {hoveredEvent.name}
          </TooltipTitle>
          <TooltipContent>
            {hoveredEvent.duration && `지속시간: ${hoveredEvent.duration}초`}
            {hoveredEvent.start && ` • 시작: ${formatTime(hoveredEvent.start)}`}
            {hoveredEvent.cause && `원인: ${hoveredEvent.cause}`}
            {hoveredEvent.player && ` • ${hoveredEvent.player}`}
            {hoveredEvent.target && ` • 대상: ${hoveredEvent.target}`}
          </TooltipContent>
        </Tooltip>
      )}
    </Container>
  );
}

export default Timeline;