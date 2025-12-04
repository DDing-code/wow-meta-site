/**
 * BuildCard 모듈
 *
 * 특성 빌드 카드 - Wowhead 빌드 코드 복사 기능
 * - 빌드명 + 설명
 * - Wowhead 링크 생성
 * - 빌드 코드 복사 버튼
 *
 * @example
 * import BuildCard from '../modules/atomic/builds/BuildCard.js';
 *
 * <BuildCard
 *   build={{
 *     name: '레이드 단일 대상',
 *     description: '...',
 *     code: 'CwQA...',
 *     icon: '⚔️'
 *   }}
 *   spec="fury"
 *   className="WARRIOR"
 *   primaryColor="#C69B6D"
 *   onCopy={() => showToast('복사 완료!')}
 * />
 */

import React from 'react';
import styled from 'styled-components';

// ============================================
// Styled Components
// ============================================

const Card = styled.div`
  background: linear-gradient(135deg, ${props => hexToRgba(props.$primary, 0.1)}, transparent);
  border: 2px solid ${props => props.$borderColor || '#2a2a3e'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.$primary};
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &::before {
    content: '${props => props.$icon}';
    position: absolute;
    top: -20px;
    right: -20px;
    font-size: 6rem;
    opacity: 0.1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h4 {
    color: ${props => props.$primary};
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
      font-size: 1.5rem;
    }
  }
`;

const Description = styled.p`
  color: #d0d0d0;
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  text-align: justify;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  background: ${props => props.$variant === 'primary'
    ? props.$primary
    : 'transparent'};
  color: ${props => props.$variant === 'primary' ? 'white' : props.$primary};
  border: 2px solid ${props => props.$primary};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$variant === 'primary'
      ? hexToRgba(props.$primary, 0.8)
      : hexToRgba(props.$primary, 0.1)};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CodeBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.$primary};
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #a0a0a0;
  word-break: break-all;
  user-select: all;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    color: ${props => props.$primary};
  }
`;

// ============================================
// Helper Functions
// ============================================

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================
// BuildCard Component
// ============================================

const BuildCard = ({
  build,
  spec,
  className,
  primaryColor = '#C69B6D',
  onCopy = () => {}
}) => {
  if (!build) {
    return <p style={{ color: '#a0a0a0' }}>빌드 데이터가 없습니다.</p>;
  }

  const { name, description, code, icon = '🎯' } = build;

  // Wowhead 링크 생성
  const wowheadUrl = `https://www.wowhead.com/talent-calc/${className.toLowerCase()}/${spec}/${code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    onCopy();
  };

  const handleWowhead = () => {
    window.open(wowheadUrl, '_blank');
  };

  return (
    <Card $primary={primaryColor} $borderColor="#2a2a3e" $icon={icon}>
      <CardHeader $primary={primaryColor}>
        <h4>
          <span className="icon">{icon}</span>
          {name}
        </h4>
      </CardHeader>

      <Description>{description}</Description>

      <ButtonGroup>
        <Button
          $variant="primary"
          $primary={primaryColor}
          onClick={handleCopy}
        >
          빌드 코드 복사
        </Button>

        <Button
          $variant="secondary"
          $primary={primaryColor}
          onClick={handleWowhead}
        >
          Wowhead에서 보기
        </Button>
      </ButtonGroup>

      <CodeBox $primary={primaryColor} onClick={handleCopy}>
        {code}
      </CodeBox>
    </Card>
  );
};

export default BuildCard;
