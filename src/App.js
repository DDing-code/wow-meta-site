import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle.js';
import { theme } from './styles/theme.js';
import Navigation from './components/Navigation.js';
import HomePage from './pages/HomePage.js';
import GuidePage from './pages/GuidePage.js';
import NewsPage from './pages/NewsPage.js';
import MockupsPage from './pages/MockupsPage.js';
import SpellDatabasePage from './pages/WoWSpellDatabasePage.js';
import GuideDetailPage from './pages/GuideDetailPage.js';
import PreservationLogReportPage, { VenomousDepthsComparisonPage } from './pages/PreservationLogReportPage.js';
import HolyPriestLogReportPage from './pages/HolyPriestLogReportPage.js';
import HolyPaladinLogReportPage from './pages/HolyPaladinLogReportPage.js';
import ElementalShamanUlatekLogReportPage from './pages/ElementalShamanUlatekLogReportPage.js';
import LogAnalysisPage from './pages/LogAnalysisPage.js';
import { getAllGuideSpecs } from './data/guideRegistry.js';

const guideRouteComponents = {
  'warrior-protection': GuideDetailPage,
  'paladin-protection': GuideDetailPage,
  'deathknight-blood': GuideDetailPage,
  'monk-brewmaster': GuideDetailPage,
  'druid-guardian': GuideDetailPage,
  'demonhunter-vengeance': GuideDetailPage,
  'warrior-arms': GuideDetailPage,
  'warrior-fury': GuideDetailPage,
  'paladin-retribution': GuideDetailPage,
  'rogue-assassination': GuideDetailPage,
  'rogue-outlaw': GuideDetailPage,
  'rogue-subtlety': GuideDetailPage,
  'deathknight-frost': GuideDetailPage,
  'deathknight-unholy': GuideDetailPage,
  'monk-windwalker': GuideDetailPage,
  'druid-feral': GuideDetailPage,
  'demonhunter-havoc': GuideDetailPage,
  'demonhunter-devourer': GuideDetailPage,
  'shaman-enhancement': GuideDetailPage,
  'hunter-survival': GuideDetailPage,
  'hunter-beastmastery': GuideDetailPage,
  'hunter-marksmanship': GuideDetailPage,
  'priest-shadow': GuideDetailPage,
  'shaman-elemental': GuideDetailPage,
  'mage-arcane': GuideDetailPage,
  'mage-fire': GuideDetailPage,
  'mage-frost': GuideDetailPage,
  'warlock-affliction': GuideDetailPage,
  'warlock-demonology': GuideDetailPage,
  'warlock-destruction': GuideDetailPage,
  'druid-balance': GuideDetailPage,
  'evoker-devastation': GuideDetailPage,
  'evoker-augmentation': GuideDetailPage,
  'paladin-holy': GuideDetailPage,
  'priest-discipline': GuideDetailPage,
  'priest-holy': GuideDetailPage,
  'shaman-restoration': GuideDetailPage,
  'monk-mistweaver': GuideDetailPage,
  'druid-restoration': GuideDetailPage,
  'evoker-preservation': GuideDetailPage,
};

const guideRoutes = getAllGuideSpecs()
  .filter(spec => guideRouteComponents[spec.id])
  .map(spec => ({
    id: spec.id,
    path: spec.path,
    Component: guideRouteComponents[spec.id],
  }));

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const SkipLink = styled.a`
  position: fixed;
  z-index: 100;
  top: 10px;
  left: 10px;
  padding: 9px 12px;
  color: #090c0f;
  background: #f2f4f5;
  font-size: 0.82rem;
  font-weight: 700;
  transform: translateY(-160%);

  &:focus-visible {
    transform: translateY(0);
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <SkipLink href="#main-content">본문으로 이동</SkipLink>
          <Navigation />
          <MainContent id="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/spells" element={<SpellDatabasePage />} />
              <Route path="/logs" element={<LogAnalysisPage />} />
              <Route path="/logs/:guideId" element={<LogAnalysisPage />} />
              <Route path="/mockups" element={<MockupsPage />} />
              <Route path="/guide/priest/holy/log-analysis" element={<HolyPriestLogReportPage />} />
              <Route path="/guide/paladin/holy/log-analysis/mythic" element={<HolyPaladinLogReportPage />} />
              <Route path="/guide/shaman/elemental/log-analysis/ulatek" element={<ElementalShamanUlatekLogReportPage />} />
              <Route path="/guide/evoker/preservation/log-analysis" element={<PreservationLogReportPage />} />
              <Route path="/guide/evoker/preservation/log-analysis/venomous-depths" element={<VenomousDepthsComparisonPage />} />
              {guideRoutes.map(({ id, path, Component }) => (
                <Route key={id} path={path} element={<Component />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
