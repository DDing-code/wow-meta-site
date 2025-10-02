import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  font-weight: 500;
  z-index: 1000;
  animation: ${slideIn} 0.3s ease-out, ${fadeOut} 0.3s ease-out 2.7s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    font-size: 16px;
  }
`;

const Toast = ({ message }) => {
  return (
    <ToastContainer>
      {message}
    </ToastContainer>
  );
};

export default Toast;