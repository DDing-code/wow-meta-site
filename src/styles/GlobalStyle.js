import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.fonts.main};
    background: #070a0d;
    color: #f4efe5;
    min-height: 100vh;
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: ${props => props.theme.transitions.fast};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: 700;
    line-height: 1.2;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 900;
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 800;
  }

  h3 {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    font-weight: 700;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    transition: ${props => props.theme.transitions.default};
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #070a0d;
    border-radius: 0;
  }

  ::-webkit-scrollbar-thumb {
    background: #b8915b;
    border-radius: 0;
    border: 2px solid #070a0d;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #f7ddb1;
  }

  /* Selection */
  ::selection {
    background: #b8915b;
    color: #070a0d;
  }

  ::-moz-selection {
    background: #b8915b;
    color: #070a0d;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 10px ${props => props.theme.colors.accent},
                  0 0 20px ${props => props.theme.colors.accent},
                  0 0 30px ${props => props.theme.colors.accent};
    }
    to {
      box-shadow: 0 0 20px ${props => props.theme.colors.accent},
                  0 0 30px ${props => props.theme.colors.accent},
                  0 0 40px ${props => props.theme.colors.accent};
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  /* Utility Classes */
  .glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glow {
    animation: ${props => props.theme.animations.glow};
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.surface} 0%,
      ${props => props.theme.colors.overlay} 50%,
      ${props => props.theme.colors.surface} 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .float {
    animation: float 3s ease-in-out infinite;
  }
`;

export default GlobalStyle;
