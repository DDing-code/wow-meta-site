import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

const ContentCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textDim};
  font-size: 1.2rem;
  line-height: 1.8;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.text};

  &:hover {
    transform: translateX(10px);
    transition: transform 0.3s ease;
  }
`;

const ComingSoonBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: bold;
  margin: ${props => props.theme.spacing.lg} auto;
  text-align: center;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .7;
    }
  }
`;

function LogAnalyzerPage() {
  return (
    <PageWrapper>
      <Container>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          로그 분석
        </Title>

        <ContentCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Description>
            WarcraftLogs 데이터를 실시간으로 분석하여
            플레이어의 성능을 개선할 수 있는 인사이트를 제공합니다.
          </Description>

          <div style={{ textAlign: 'center' }}>
            <ComingSoonBadge>개발 중</ComingSoonBadge>
          </div>

          <FeatureList>
            <FeatureItem>
              📊 DPS/HPS 상세 분석 및 비교
            </FeatureItem>
            <FeatureItem>
              🎯 딜사이클 최적화 제안
            </FeatureItem>
            <FeatureItem>
              ⚡ 쿨다운 사용 효율성 분석
            </FeatureItem>
            <FeatureItem>
              🛡️ 생존기 사용 패턴 분석
            </FeatureItem>
            <FeatureItem>
              📈 시간대별 성능 그래프
            </FeatureItem>
          </FeatureList>
        </ContentCard>
      </Container>
    </PageWrapper>
  );
}

export default LogAnalyzerPage;