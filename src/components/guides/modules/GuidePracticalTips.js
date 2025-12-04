import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GuideFlowChart from '../visuals/GuideFlowChart';
import { havocVisuals } from '../../../data/guides/havoc-demonhunter/visuals';

// 가이드 실전 팁 모듈
// 공통적인 실수와 고급 팁을 표시
// 영웅 특성 무관하게 전문화 전체에 적용되는 팁
// GuideFlowChart 통합으로 로테이션 결정 트리 시각화 제공

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.color || '#A330C9'};
  margin: 0 0 20px 0;
  border-bottom: 2px solid ${props => props.color || '#A330C9'};
  padding-bottom: 12px;
`;

const TipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SubSection = styled.div`
  margin-bottom: 20px;
`;

const SubTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffa500;
  margin: 0 0 15px 0;
  font-weight: bold;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
`;

const TipCard = styled(motion.div)`
  background: ${props => props.isError ?
    'linear-gradient(135deg, rgba(255, 68, 68, 0.12) 0%, rgba(255, 68, 68, 0.06) 100%)' :
    'linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(76, 175, 80, 0.06) 100%)'
  };
  border: 2px solid ${props => props.isError ? '#ff4444' : '#4caf50'};
  border-radius: 16px; /* Increased for softer appearance */
  padding: 24px; /* Increased padding for better spacing */
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Smooth easing */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Base shadow for depth */

  &:before {
    content: '${props => props.isError ? '❌' : '💡'}';
    position: absolute;
    top: 18px;
    right: 18px;
    font-size: 1.8rem;
    opacity: 0.25;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    border-color: ${props => props.isError ? '#ff6666' : '#66bb6a'};

    &:before {
      opacity: 0.4;
    }
  }
`;

const TipNumber = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.isError ?
    'rgba(255, 68, 68, 0.2)' :
    'rgba(76, 175, 80, 0.2)'
  };
  border: 2px solid ${props => props.isError ? '#ff4444' : '#4caf50'};
  color: ${props => props.isError ? '#ff4444' : '#4caf50'};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 0.9rem;
`;

const TipTitle = styled.h4`
  font-size: 1.1rem;
  color: #fff;
  margin: 0 0 10px 0;
  font-weight: bold;
  padding-right: 30px; // 이모지 공간 확보
`;

const TipDescription = styled.p`
  font-size: 1rem; /* Increased from 0.95rem for better readability */
  color: #e0e0e0;
  line-height: 1.8; /* Increased to match blog-style typography */
  margin: 0;

  strong {
    color: ${props => props.highlightColor || '#A330C9'};
    font-weight: 600; /* Slightly bolder */
  }
`;

const AdvancedTipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AdvancedTipCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(163, 48, 201, 0.12) 0%, rgba(163, 48, 201, 0.06) 100%);
  border: 2px solid ${props => props.borderColor || '#A330C9'};
  border-radius: 16px; /* Increased for consistency */
  padding: 28px; /* Increased padding for blog-style */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Base shadow */

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 10px 30px rgba(163, 48, 201, 0.2);
    border-color: ${props => props.borderColor || '#A330C9'}cc;
  }
`;

const AdvancedTipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const AdvancedTipIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || '#A330C9'}40;
  border: 2px solid ${props => props.color || '#A330C9'};
  color: ${props => props.color || '#A330C9'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const AdvancedTipTitle = styled.h4`
  font-size: 1.2rem;
  color: #fff;
  margin: 0;
  font-weight: bold;
  flex: 1;
`;

const AdvancedTipContent = styled.div`
  font-size: 1rem;
  color: #e0e0e0;
  line-height: 1.7;

  strong {
    color: ${props => props.highlightColor || '#A330C9'};
    font-weight: bold;
  }

  ul {
    margin: 10px 0;
    padding-left: 20px;

    li {
      margin-bottom: 8px;
    }
  }
`;

export default function GuidePracticalTips({
  data,
  color = '#A330C9'
}) {
  // 조건부 렌더링
  if (!data) return null;

  const { commonMistakes = [], advancedTips = [] } = data;

  return (
    <>
      <SectionTitle color={color}>실전 팁</SectionTitle>

      <TipsContainer>
        {/* 흔한 실수 섹션 */}
        {commonMistakes.length > 0 && (
          <SubSection>
            <SubTitle>흔한 실수</SubTitle>
            <TipsGrid>
              {commonMistakes.map((mistake, index) => (
                <TipCard
                  key={index}
                  isError={true}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TipNumber isError={true}>{index + 1}</TipNumber>
                  <TipTitle>{mistake.title}</TipTitle>
                  <TipDescription
                    highlightColor={color}
                    dangerouslySetInnerHTML={{ __html: mistake.description }}
                  />
                </TipCard>
              ))}
            </TipsGrid>
          </SubSection>
        )}

        {/* 고급 팁 섹션 */}
        {advancedTips.length > 0 && (
          <SubSection>
            <SubTitle>고급 팁</SubTitle>
            <AdvancedTipsList>
              {advancedTips.map((tip, index) => (
                <AdvancedTipCard
                  key={index}
                  borderColor={color}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AdvancedTipHeader>
                    <AdvancedTipIcon color={color}>
                      {index + 1}
                    </AdvancedTipIcon>
                    <AdvancedTipTitle>{tip.title}</AdvancedTipTitle>
                  </AdvancedTipHeader>
                  <AdvancedTipContent
                    highlightColor={color}
                    dangerouslySetInnerHTML={{ __html: tip.content }}
                  />
                </AdvancedTipCard>
              ))}
            </AdvancedTipsList>
          </SubSection>
        )}

        {/* 🆕 로테이션 플로우차트 섹션 */}
        {havocVisuals.rotationFlowChart && (
          <SubSection>
            <SubTitle>로테이션 결정 트리</SubTitle>

            {/* 알드라치 파괴자 플로우차트 */}
            {havocVisuals.rotationFlowChart.aldrachireaver && (
              <GuideFlowChart
                data={havocVisuals.rotationFlowChart.aldrachireaver}
                title="알드라치 파괴자 (Aldrachi Reaver)"
                theme="dark"
              />
            )}

            {/* 지옥상흔 플로우차트 */}
            {havocVisuals.rotationFlowChart.felscarred && (
              <GuideFlowChart
                data={havocVisuals.rotationFlowChart.felscarred}
                title="지옥상흔 (Fel-Scarred)"
                theme="dark"
              />
            )}
          </SubSection>
        )}
      </TipsContainer>
    </>
  );
}
