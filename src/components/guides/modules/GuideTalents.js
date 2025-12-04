import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Toast from '../../Toast';

// 가이드 특성 빌드 모듈
// Props로 특성 빌드 데이터를 받아 자동 렌더링

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.color || '#A330C9'};
  margin: 0 0 20px 0;
  border-bottom: 2px solid ${props => props.color || '#A330C9'};
  padding-bottom: 12px;
`;

const Card = styled.div`
  background: #15151f;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SubTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffa500;
  margin: 20px 0 12px 0;
`;

const BuildGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  margin: 15px 0;
`;

const BuildCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid ${props => props.borderColor || '#A330C9'}40;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: ${props => props.borderColor || '#A330C9'};
  }
`;

const BuildTitle = styled.h4`
  color: ${props => props.color || '#A330C9'};
  font-size: 1.2rem;
  margin: 0 0 15px 0;
`;

const BuildDescription = styled.p`
  color: #a0a0a0;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const WowheadLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.bgColor || '#A330C9'}40;
  border: 1px solid ${props => props.borderColor || '#A330C9'};
  border-radius: 6px;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.bgColor || '#A330C9'};
    transform: translateY(-2px);
  }
`;

const CopyButton = styled(motion.button)`
  margin-left: 10px;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid ${props => props.borderColor || '#A330C9'};
  border-radius: 6px;
  color: ${props => props.color || '#A330C9'};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.bgColor || '#A330C9'}20;
  }
`;

export default function GuideTalents({
  data,
  color = '#A330C9'
}) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!data) return null;

  const { raid, mythicPlus, heroTalents } = data;

  const copyToClipboard = (url, buildName) => {
    navigator.clipboard.writeText(url).then(() => {
      setToastMessage(`${buildName} 빌드 링크 복사 완료!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  return (
    <>
      <SectionTitle color={color}>특성 빌드</SectionTitle>

      {heroTalents && Object.keys(heroTalents).length > 0 && (
        <>
          {Object.entries(heroTalents).map(([heroKey, heroData]) => (
            <Card key={heroKey}>
              <SubTitle>{heroData.name}</SubTitle>

              {heroData.raid && (
                <>
                  <BuildTitle color={color}>레이드 빌드</BuildTitle>
                  <BuildDescription>{heroData.raid.description}</BuildDescription>
                  <div>
                    <WowheadLink
                      href={heroData.raid.wowheadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      bgColor={color}
                      borderColor={color}
                    >
                      Wowhead에서 보기
                    </WowheadLink>
                    <CopyButton
                      color={color}
                      borderColor={color}
                      bgColor={color}
                      onClick={() => copyToClipboard(heroData.raid.wowheadUrl, `${heroData.name} 레이드`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      링크 복사
                    </CopyButton>
                  </div>
                </>
              )}

              {heroData.mythicPlus && (
                <>
                  <BuildTitle color={color} style={{ marginTop: '30px' }}>쐐기돌 빌드</BuildTitle>
                  <BuildDescription>{heroData.mythicPlus.description}</BuildDescription>
                  <div>
                    <WowheadLink
                      href={heroData.mythicPlus.wowheadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      bgColor={color}
                      borderColor={color}
                    >
                      Wowhead에서 보기
                    </WowheadLink>
                    <CopyButton
                      color={color}
                      borderColor={color}
                      bgColor={color}
                      onClick={() => copyToClipboard(heroData.mythicPlus.wowheadUrl, `${heroData.name} 쐐기돌`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      링크 복사
                    </CopyButton>
                  </div>
                </>
              )}
            </Card>
          ))}
        </>
      )}

      {/* 기존 포맷 호환성 */}
      {(raid || mythicPlus) && !heroTalents && (
        <Card>
          <BuildGrid>
            {raid && (
              <BuildCard borderColor={color}>
                <BuildTitle color={color}>레이드</BuildTitle>
                <BuildDescription>{raid.description}</BuildDescription>
                <WowheadLink
                  href={raid.wowheadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  bgColor={color}
                  borderColor={color}
                >
                  Wowhead에서 보기
                </WowheadLink>
              </BuildCard>
            )}

            {mythicPlus && (
              <BuildCard borderColor={color}>
                <BuildTitle color={color}>쐐기돌</BuildTitle>
                <BuildDescription>{mythicPlus.description}</BuildDescription>
                <WowheadLink
                  href={mythicPlus.wowheadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  bgColor={color}
                  borderColor={color}
                >
                  Wowhead에서 보기
                </WowheadLink>
              </BuildCard>
            )}
          </BuildGrid>
        </Card>
      )}

      {showToast && <Toast message={toastMessage} />}
    </>
  );
}
