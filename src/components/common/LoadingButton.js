import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colorSystem, springConfigs, borderRadius, typography } from '../../styles/designSystem';

/**
 * LoadingButton - Stripe-style 로딩 버튼 컴포넌트
 *
 * @param {boolean} isLoading - 로딩 상태 (true일 때 스피너 표시)
 * @param {React.ReactNode} children - 버튼 텍스트/콘텐츠
 * @param {string} variant - 버튼 스타일 ('primary' | 'secondary' | 'outline')
 * @param {object} ...props - 기타 button HTML attributes
 *
 * @example
 * <LoadingButton
 *   isLoading={isSubmitting}
 *   onClick={handleSubmit}
 *   variant="primary"
 * >
 *   제출하기
 * </LoadingButton>
 */

const ButtonWrapper = styled(motion.button)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${borderRadius.DEFAULT};
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
  font-family: ${typography.fontFamily.base};

  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${colorSystem.secondary.main};
          color: ${colorSystem.text.primary};
          &:hover:not(:disabled) {
            background: ${colorSystem.secondary.dark};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${colorSystem.primary.main};
          border: 1px solid ${colorSystem.primary.main};
          &:hover:not(:disabled) {
            background: ${colorSystem.primary.subtle};
          }
        `;
      default: // primary
        return `
          background: ${colorSystem.primary.main};
          color: ${colorSystem.text.primary};
          &:hover:not(:disabled) {
            background: ${colorSystem.primary.dark};
          }
        `;
    }
  }}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 2px solid ${colorSystem.primary.main};
    outline-offset: 2px;
  }
`;

const Spinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
`;

const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

export function LoadingButton({
  isLoading = false,
  children,
  variant = 'primary',
  disabled,
  ...props
}) {
  return (
    <ButtonWrapper
      whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
      transition={springConfigs.snappy}
      disabled={isLoading || disabled}
      variant={variant}
      {...props}
    >
      {isLoading && (
        <Spinner
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
      <ButtonContent>
        {children}
      </ButtonContent>
    </ButtonWrapper>
  );
}

export default LoadingButton;
