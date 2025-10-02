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
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
    min-height: 100vh;
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;

    &:before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(192, 132, 252, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(74, 222, 128, 0.05) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    &:after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none;
      opacity: 0.3;
      z-index: 0;
    }
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
    background: ${props => props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.gradients.accent};
    border-radius: ${props => props.theme.borderRadius.full};
    border: 2px solid ${props => props.theme.colors.primary};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.gradients.secondary};
  }

  /* Selection */
  ::selection {
    background: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.textBright};
  }

  ::-moz-selection {
    background: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.textBright};
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