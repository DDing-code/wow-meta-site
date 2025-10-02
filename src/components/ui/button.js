import React from 'react';
import styled, { css } from 'styled-components';

const buttonVariants = {
  default: css`
    background: linear-gradient(135deg, #ff6b6b 0%, #c084fc 100%);
    color: white;
    border: none;

    &:hover {
      opacity: 0.9;
    }
  `,
  outline: css`
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `,
  ghost: css`
    background: transparent;
    color: #fff;
    border: none;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `
};

const buttonSizes = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  `,
  md: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
  `
};

const StyledButton = styled.button`
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => buttonVariants[props.$variant || 'default']}
  ${props => buttonSizes[props.$size || 'md']}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Button = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;