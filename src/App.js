import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import SpellDatabasePage from './pages/WoWSpellDatabasePage';
import LogAnalyzerPage from './pages/LogAnalyzerPage';
import GuidePage from './pages/GuidePage';
import NewsPage from './pages/NewsPage';
import BeastMasteryGuideRestructured from './components/BeastMasteryGuideRestructured';
import BeastMasteryIntegratedGuide from './components/BeastMasteryIntegratedGuide';
import BeastMasteryLayoutIntegrated from './components/BeastMasteryLayoutIntegrated';
import DevastationEvokerLayoutIntegrated from './components/DevastationEvokerLayoutIntegrated';
import DemonologyWarlockGuide from './components/DemonologyWarlockGuide';
import AfflictionWarlockGuide from './components/AfflictionWarlockGuide';
import DestructionWarlockGuide from './components/DestructionWarlockGuide';
import ElementalShamanGuide from './components/ElementalShamanGuide';
import GuideTemplate from './components/GuideTemplate';
// 황폐 기원사 가이드 - 새로운 통합 버전
// 통합 가이드 템플릿 사용
import moduleEventBus from './services/ModuleEventBus';
import aiFeedbackService from './services/AIFeedbackService';
import registerAllPersonas from './ai/personas';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

function App() {
  useEffect(() => {
    // 앱 시작 시 모듈 등록 및 연결 초기화
    console.log('🚀 Initializing organic architecture...');

    // 모듈 등록
    moduleEventBus.registerModule('app', {
      name: 'Main Application',
      version: '1.0.0'
    });

    // AI 피드백 시작
    aiFeedbackService.startFeedbackLoop(300000); // 5분마다

    // 전문화 페르소나 시스템 초기화
    const initializePersonas = async () => {
      try {
        await registerAllPersonas();
        console.log('✅ 전문화 페르소나 시스템 초기화 완료');
      } catch (error) {
        console.error('❌ 페르소나 시스템 초기화 실패:', error);
      }
    };

    initializePersonas();

    // 클린업
    return () => {
      aiFeedbackService.stopFeedbackLoop();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Navigation />
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/class/hunter/beast-mastery" element={<BeastMasteryGuideRestructured />} />
              <Route path="/spells" element={<SpellDatabasePage />} />
              <Route path="/log-analyzer" element={<LogAnalyzerPage />} />
              {/* 메인 야수 사냥꾼 가이드 - Class 내용 + Guide 레이아웃 */}
              <Route path="/guide/hunter/beast-mastery" element={<BeastMasteryLayoutIntegrated />} />
              {/* 황폐 기원사 가이드 - 통합 버전 */}
              <Route path="/guide/evoker/devastation" element={<DevastationEvokerLayoutIntegrated />} />
              {/* 악마 흑마법사 가이드 - 통합 버전 */}
              <Route path="/guide/warlock/demonology" element={<DemonologyWarlockGuide />} />
              {/* 고통 흑마법사 가이드 - 통합 버전 */}
              <Route path="/guide/warlock/affliction" element={<AfflictionWarlockGuide />} />
              {/* 파괴 흑마법사 가이드 - 통합 버전 */}
              <Route path="/guide/warlock/destruction" element={<DestructionWarlockGuide />} />
              {/* 정기 주술사 가이드 - 통합 버전 */}
              <Route path="/guide/shaman/elemental" element={<ElementalShamanGuide />} />
              {/* 가이드 템플릿 - 테스트용 */}
              <Route path="/guide/template" element={<GuideTemplate />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;