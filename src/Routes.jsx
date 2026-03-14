import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MicrobeMatchingGame from './pages/microbe-matching-game';
import ProgressAchievementHub from './pages/progress-achievement-hub';
import WorldExplorerMode from './pages/world-explorer-mode';
import QuizChallengeSystem from './pages/quiz-challenge-system';
import GameHomeDashboard from './pages/game-home-dashboard';
import MicroscopeDiscoveryLab from './pages/microscope-discovery-lab';
import GermBusterTowerDefense from './pages/germ-buster-tower-defense';
import MicrobeDetectiveMysteryOutbreak from './pages/microbe-detective-mystery-outbreak';
import MicrobeTimelineAdventure from './pages/microbe-timeline-adventure';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<GameHomeDashboard />} />
        <Route path="/microbe-matching-game" element={<MicrobeMatchingGame />} />
        <Route path="/progress-achievement-hub" element={<ProgressAchievementHub />} />
        <Route path="/world-explorer-mode" element={<WorldExplorerMode />} />
        <Route path="/quiz-challenge-system" element={<QuizChallengeSystem />} />
        <Route path="/game-home-dashboard" element={<GameHomeDashboard />} />
        <Route path="/microscope-discovery-lab" element={<MicroscopeDiscoveryLab />} />
        <Route path="/germ-buster-tower-defense" element={<GermBusterTowerDefense />} />
        <Route path="/microbe-detective-mystery-outbreak" element={<MicrobeDetectiveMysteryOutbreak />} />
        <Route path="/microbe-timeline-adventure" element={<MicrobeTimelineAdventure />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;