import React from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, #2a4330 0%, #1a1a2e 100%);
  border: 2px solid ${props => props.theme?.colors?.primary || '#AAD372'};
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 20px rgba(170, 211, 114, 0.3);
  z-index: 10000;
  animation: slideInRight 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 400px;
`;

const ToastIcon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  color: ${props => props.theme?.colors?.primary || '#AAD372'};
  font-weight: bold;
  margin-bottom: 4px;
`;

const ToastMessage = styled.div`
  color: #cbd5e1;
  font-size: 0.9rem;
`;

const Toast = ({
  message = '복사되었습니다',
  description = '특성 창에서 가져오기 버튼을 누르고 붙여넣으세요.',
  icon = '✅',
  theme
}) => {
  return (
    <ToastContainer theme={theme}>
      <ToastIcon>{icon}</ToastIcon>
      <ToastContent>
        <ToastTitle theme={theme}>{message}</ToastTitle>
        {description && <ToastMessage>{description}</ToastMessage>}
      </ToastContent>
    </ToastContainer>
  );
};

export default Toast;