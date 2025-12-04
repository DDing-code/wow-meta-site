import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle.js';
import { theme } from './styles/theme.js';
import Navigation from './components/Navigation.js';
import HomePage from './pages/HomePage.js';
import SpellDatabasePage from './pages/WoWSpellDatabasePage.js';
import LogAnalyzerPage from './pages/LogAnalyzerPage.js';
import GuidePage from './pages/GuidePage.js';
import NewsPage from './pages/NewsPage.js';
import BeastMasteryGuideRestructured from './components/BeastMasteryGuideRestructured.js';
import BeastMasteryLayoutIntegrated from './components/BeastMasteryLayoutIntegrated.js';
import DevastationEvokerLayoutIntegrated from './components/DevastationEvokerLayoutIntegrated.js';
import ArcaneMageGuide from './pages/ArcaneMageGuide.js';  // ✅ 새로운 유기적 시스템 가이드
import HavocDemonHunterGuide from './pages/HavocDemonHunterGuide.js';  // ✅ 새로운 유기적 시스템 가이드
import HavocDemonHunterGuideNew from './components/HavocDemonHunterGuideNew.js';  // ✅ 테스트: 새 모듈 시스템
import BeastMasteryHunterGuide from './pages/BeastMasteryHunterGuide.js';  // ✅ 야수 사냥꾼 심층 가이드 (KB 기반)
import ArcaneMageMethodGuide from './pages/method/ArcaneMageMethodGuide.js';  // ✅ Method.gg 스타일 가이드

// ❌ 아카이브된 가이드 (2025-11-11 삭제)
// import BeastMasteryIntegratedGuide from './components/BeastMasteryIntegratedGuide.js';
// import DemonologyWarlockGuide from './components/DemonologyWarlockGuide.js';
// import AfflictionWarlockGuide from './components/AfflictionWarlockGuide.js';
// import DestructionWarlockGuide from './components/DestructionWarlockGuide.js';
// import FuryWarriorGuide from './components/FuryWarriorGuide.js';
// import ElementalShamanGuide from './components/ElementalShamanGuide.js';
// import FrostDeathKnightGuide from './components/FrostDeathKnightGuide.js';
// import HavocDemonHunterGuide from './components/HavocDemonHunterGuide.js';
import moduleEventBus from './services/ModuleEventBus.js';
import aiFeedbackService from './services/AIFeedbackService.js';
import registerAllPersonas from './ai/personas/index.js';
import { SkillHubProvider } from './contexts/SkillHubContext.js';  // ✅ Central Skill Hub
import ConflictResolverUI from './components/ConflictResolverUI.js';  // ✅ Knowledge Conflict Resolver

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
      <SkillHubProvider>  {/* ✅ Central Skill Hub - 1,186개 스킬 Single Source of Truth */}
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
                {/* 메인 야수 사냥꾼 가이드 - ✅ KB 기반 심층 가이드 (2025-12-02 교체) */}
                <Route path="/guide/hunter/beast-mastery" element={<BeastMasteryHunterGuide />} />
                {/* 황폐 기원사 가이드 - 통합 버전 */}
                <Route path="/guide/evoker/devastation" element={<DevastationEvokerLayoutIntegrated />} />
                {/* 비전 마법사 가이드 - ✅ 유기적 시스템 (SpecGuide + ID 기반 데이터) */}
                <Route path="/guide/mage/arcane" element={<ArcaneMageGuide />} />
                {/* 비전 마법사 Method 스타일 가이드 - ✅ Method.gg 완전 복제 */}
                <Route path="/guide/method/mage/arcane" element={<ArcaneMageMethodGuide />} />
                {/* 파멸 악마사냥꾼 가이드 - ✅ 유기적 시스템 (GuideTemplate + demonhunter.json) */}
                <Route path="/guide/demonhunter/havoc" element={<HavocDemonHunterGuide />} />
                {/* ✅ 테스트: 새 모듈 시스템 가이드 */}
                <Route path="/guide/demonhunter/havoc-new" element={<HavocDemonHunterGuideNew />} />

                {/* ❌ 아카이브된 가이드 (2025-11-11 삭제) - 유기적 시스템으로 재구축 예정 */}
                {/* <Route path="/guide/warlock/demonology" element={<DemonologyWarlockGuide />} /> */}
                {/* <Route path="/guide/warlock/affliction" element={<AfflictionWarlockGuide />} /> */}
                {/* <Route path="/guide/warlock/destruction" element={<DestructionWarlockGuide />} /> */}
                {/* <Route path="/guide/warrior/fury" element={<FuryWarriorGuide />} /> */}
                {/* <Route path="/guide/shaman/elemental" element={<ElementalShamanGuide />} /> */}
                {/* <Route path="/guide/deathknight/frost" element={<FrostDeathKnightGuide />} /> */}
              </Routes>
            </MainContent>
            <ConflictResolverUI />  {/* ✅ Knowledge Conflict Resolver - 지식 충돌 해결 UI */}
          </AppContainer>
        </Router>
      </SkillHubProvider>
    </ThemeProvider>
  );
}

export default App;