import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { PlayUsageProvider } from './contexts/PlayUsageContext';
import GameAccessGate from "./components/GameAccessGate";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
// Eagerly load NotFound (tiny, no benefit from lazy loading)
import NotFound from "pages/NotFound";
// Lazy-load all page-level components for code-splitting
const GameHomeDashboard = lazy(() => import('./pages/game-home-dashboard'));
const MicrobeMatchingGame = lazy(() => import('./pages/microbe-matching-game'));
const ProgressAchievementHub = lazy(() => import('./pages/progress-achievement-hub'));
const WorldExplorerMode = lazy(() => import('./pages/world-explorer-mode'));
const QuizChallengeSystem = lazy(() => import('./pages/quiz-challenge-system'));
const MicroscopeDiscoveryLab = lazy(() => import('./pages/microscope-discovery-lab'));
const GermBusterTowerDefense = lazy(() => import('./pages/germ-buster-tower-defense'));
const MicrobeDetectiveMysteryOutbreak = lazy(() => import('./pages/microbe-detective-mystery-outbreak'));
const MicrobeTimelineAdventure = lazy(() => import('./pages/microbe-timeline-adventure'));
const ParentControlsDashboard = lazy(() => import('./pages/parent-controls-dashboard'));
const TeacherClassroomDashboard = lazy(() => import('./pages/teacher-classroom-dashboard'));
const ParentBillingPage = lazy(() => import('./pages/parent-billing'));
const SubscriptionManagementPage = lazy(() => import('./pages/subscription-management'));
const ParentAccountSettings = lazy(() => import('./pages/parent-account-settings'));
const ParentMilestoneNotifications = lazy(() => import('./pages/parent-milestone-notifications'));
const ParentSetupFlow = lazy(() => import('./pages/parent-setup-flow'));
const PrivacyPolicy = lazy(() => import('./pages/privacy'));
const TermsOfService = lazy(() => import('./pages/terms'));
const RefundPolicy = lazy(() => import('./pages/refunds'));
const LoginPage = lazy(() => import('./pages/login'));
// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-950 to-purple-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-purple-200 text-lg font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <GATracker />
        <PlayUsageProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterRoutes>
            <Route path="/" element={<GameHomeDashboard />} />
            <Route path="/microbe-matching-game" element={<GameAccessGate mode="matching"><MicrobeMatchingGame /></GameAccessGate>} />
            <Route path="/progress-achievement-hub" element={<ProgressAchievementHub />} />
            <Route path="/world-explorer-mode" element={<GameAccessGate mode="explorer"><WorldExplorerMode /></GameAccessGate>} />
            <Route path="/quiz-challenge-system" element={<GameAccessGate mode="quiz"><QuizChallengeSystem /></GameAccessGate>} />
            <Route path="/game-home-dashboard" element={<GameHomeDashboard />} />
            <Route path="/microscope-discovery-lab" element={<GameAccessGate mode="lab"><MicroscopeDiscoveryLab /></GameAccessGate>} />
            <Route path="/germ-buster-tower-defense" element={<GameAccessGate mode="tower_defense"><GermBusterTowerDefense /></GameAccessGate>} />
            <Route path="/microbe-detective-mystery-outbreak" element={<GameAccessGate mode="detective"><MicrobeDetectiveMysteryOutbreak /></GameAccessGate>} />
            <Route path="/microbe-timeline-adventure" element={<GameAccessGate mode="timeline"><MicrobeTimelineAdventure /></GameAccessGate>} />
            <Route path="/parent-controls-dashboard" element={<ParentControlsDashboard />} />
            <Route path="/teacher-classroom-dashboard" element={<TeacherClassroomDashboard />} />
            <Route path="/parent-billing" element={<ParentBillingPage />} />
            <Route path="/subscription-management" element={<SubscriptionManagementPage />} />
            <Route path="/parent-account-settings" element={<ParentAccountSettings />} />
            <Route path="/parent-milestone-notifications" element={<ParentMilestoneNotifications />} />
            <Route path="/parent-setup-flow" element={<ParentSetupFlow />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refunds" element={<RefundPolicy />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
        </PlayUsageProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
function GATracker() {
  useGoogleAnalytics();
  return null;
}
export default Routes;