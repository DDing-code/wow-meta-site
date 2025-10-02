import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const CardHeaderContainer = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const CardContentContainer = styled.div`
  padding: 1.5rem;
`;

export const Card = ({ children, className, ...props }) => {
  return (
    <CardContainer className={className} {...props}>
      {children}
    </CardContainer>
  );
};

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <CardHeaderContainer className={className} {...props}>
      {children}
    </CardHeaderContainer>
  );
};

export const CardContent = ({ children, className, ...props }) => {
  return (
    <CardContentContainer className={className} {...props}>
      {children}
    </CardContentContainer>
  );
};

export default Card;