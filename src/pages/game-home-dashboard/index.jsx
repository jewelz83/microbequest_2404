import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import CharacterGuide from '../../components/ui/CharacterGuide';
import DiscoveryCollection from '../../components/ui/DiscoveryCollection';
import useGuideVisibility from '../../hooks/useGuideVisibility';
import WelcomeCharacters from './components/WelcomeCharacters';
import GameModeCards from './components/GameModeCards';
import ReadTheBookSection from './components/ReadTheBookSection';
import OnboardingTutorial from './components/OnboardingTutorial';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FloatingMicrobes,
  PulsingButton,
  GlowCard,
  CountingNumber,
  SuccessCelebration,
  fadeInUp,
  scaleIn,
  staggerContainer
} from '../../components/VisualEffects';
import Footer from '../../components/ui/Footer';

const ONBOARDING_KEY = 'microbequest_onboarding_done';

const GameHomeDashboard = () => {
  const { shouldShowGuide, hideGuide } = useGuideVisibility('game-home-dashboard');
  const { user, userProfile, isPremium } = useAuth();
  const [showDiscoveryCollection, setShowDiscoveryCollection] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Determine if onboarding should show (first-time user)
  useEffect(() => {
    const localDone = localStorage.getItem(ONBOARDING_KEY);
    if (localDone) return; // Already seen locally

    if (user && userProfile) {
      // Authenticated: check DB flag
      if (userProfile?.onboarding_completed === false || userProfile?.onboarding_completed === null || userProfile?.onboarding_completed === undefined) {
        setShowOnboarding(true);
      }
    } else if (!user) {
      // Guest: show once per browser session
      const sessionDone = sessionStorage.getItem(ONBOARDING_KEY);
      if (!sessionDone) {
        setShowOnboarding(true);
      }
    }
  }, [user, userProfile]);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');

    if (user) {
      try {
        await supabase?.from('user_profiles')?.update({ onboarding_completed: true })?.eq('id', user?.id);
      } catch (err) {
        console.error('Failed to mark onboarding complete:', err);
      }
    } else {
      sessionStorage.setItem(ONBOARDING_KEY, 'true');
    }
  };

  // Mock user progress data
  const userProgress = {
    completedActivities: 3,
    totalActivities: 5,
    discoveredMicrobes: 8,
    totalMicrobes: 20,
    achievements: ['First Discovery', 'Bacteria Expert', 'Quiz Master'],
    currentStreak: 5,
    totalPoints: 245
  };

  // Update time and welcome message
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);

      const hour = now?.getHours();
      if (hour < 12) {
        setWelcomeMessage('Good morning, young scientist! Ready to explore the microscopic world?');
      } else if (hour < 17) {
        setWelcomeMessage('Good afternoon! Let\'s continue our microbiology adventure!');
      } else {
        setWelcomeMessage('Good evening! Perfect time for some scientific discovery!');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Show welcome celebration on first visit
  useEffect(() => {
    if (!hasSeenWelcome) {
      setShowCelebration(true);
      setHasSeenWelcome(true);
    }
  }, [hasSeenWelcome]);

  // Auto-hide character guide after 10 seconds
  useEffect(() => {
    if (!shouldShowGuide) return;
    const timer = setTimeout(() => {
      hideGuide();
    }, 10000);
    return () => clearTimeout(timer);
  }, [shouldShowGuide, hideGuide]);

  const quickActions = [
    {
      label: 'Continue Learning',
      route: '/microbe-matching-game',
      icon: 'Play',
      gradient: 'from-purple-600 to-blue-600',
      description: 'Resume your last activity'
    },
    {
      label: 'View Progress',
      route: '/progress-achievement-hub',
      icon: 'Trophy',
      gradient: 'from-yellow-500 to-orange-600',
      description: 'Check achievements and stats'
    },
    {
      label: 'Discovery Lab',
      route: '/microscope-discovery-lab',
      icon: 'Microscope',
      gradient: 'from-green-500 to-teal-600',
      description: 'Explore with digital microscope'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingTutorial onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>
      {/* Floating Background Microbes */}
      <FloatingMicrobes count={15} />
      <Header />
      <main className="pt-20 pb-24 lg:pb-8 relative z-10">
        <div className="container mx-auto px-4 lg:px-6 space-y-6 lg:space-y-8">

          {/* Welcome Section */}
          <motion.section
            className="text-center space-y-3 lg:space-y-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg"
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Icon name="Sparkles" size={16} strokeWidth={2} />
              </motion.div>
              <span className="font-caption text-sm font-medium">
                Welcome to MicrobeQuest
              </span>
            </motion.div>

            {/* Premium Upgrade Banner — shown only to non-premium users */}
            {!isPremium && (
              <motion.div variants={fadeInUp}>
                <Link to="/premium">
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer active:scale-95">
                    <Icon name="Sparkles" size={18} strokeWidth={2.5} />
                    <span className="font-body font-bold text-xs sm:text-sm">Unlock all 6 games &amp; 18 discoveries — Go Premium 🌻</span>
                    <Icon name="ArrowRight" size={16} strokeWidth={2.5} />
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Author Credit Section with Glow */}
            <motion.div
              className="flex items-center justify-center mb-4"
              variants={fadeInUp}
            >
              <GlowCard className="flex items-center space-x-3 px-4 sm:px-6 py-3 bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-xl shadow-lg">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-purple-300 ring-2 ring-purple-100 flex-shrink-0">
                  <img
                    src="/assets/images/casual_big_smile_glasses-1760710103119.jpg"
                    alt="Julianne Tajuba"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-heading text-sm text-gray-700">Created by</span>
                    <span className="font-heading text-purple-600 font-bold">Julianne Tajuba</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 mb-3 font-extrabold px-2"
              variants={fadeInUp}
            >
              Explore the World You Can't See!
            </motion.h1>

            <motion.p
              className="font-body text-base lg:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed px-2"
              variants={fadeInUp}
            >
              {welcomeMessage}
            </motion.p>

            {/* Enhanced Time Display */}
            <motion.div
              className="flex items-center justify-center space-x-3 text-sm"
              variants={fadeInUp}
            >
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                <Icon name="Clock" size={16} className="text-purple-600" />
                <span className="font-mono text-gray-700">
                  {currentTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="w-1 h-1 bg-purple-400 rounded-full" />
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                <Icon name="Calendar" size={16} className="text-purple-600" />
                <span className="font-mono text-gray-700">
                  {currentTime?.toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          </motion.section>

          {/* Enhanced Quick Actions */}
          <motion.section
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {quickActions?.map((action, index) => (
              <Link
                key={action?.label}
                to={action?.route}
                className="w-full sm:w-auto"
              >
                <motion.div
                  variants={scaleIn}
                  custom={index}
                >
                  <PulsingButton
                    className={`
                      w-full sm:w-auto flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-lg
                      bg-gradient-to-r ${action?.gradient} text-white
                      group relative overflow-hidden active:scale-95 transition-transform
                    `}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <Icon name={action?.icon} size={24} strokeWidth={2.5} />
                    <div className="text-left relative z-10 flex-1">
                      <span className="font-body font-bold block">{action?.label}</span>
                      <span className="font-caption text-xs opacity-90">{action?.description}</span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Icon name="ArrowRight" size={20} />
                    </motion.div>
                  </PulsingButton>
                </motion.div>
              </Link>
            ))}
          </motion.section>

          {/* Welcome Characters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <WelcomeCharacters />
          </motion.div>

          {/* Enhanced Progress Overview */}
          <motion.section
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="lg:col-span-2" variants={fadeInUp}>
              <ProgressIndicator
                completedActivities={userProgress?.completedActivities}
                totalActivities={userProgress?.totalActivities}
                discoveredMicrobes={userProgress?.discoveredMicrobes}
                totalMicrobes={userProgress?.totalMicrobes}
                achievements={userProgress?.achievements}
              />
            </motion.div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
              <motion.div variants={scaleIn} className="col-span-1">
                <GlowCard className="bg-gradient-to-br from-orange-500 to-red-500 border-2 border-orange-300 rounded-2xl p-4 lg:p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-2 lg:mb-3">
                    <h4 className="font-heading text-white font-bold text-sm lg:text-base">Streak</h4>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Icon name="Flame" size={20} className="text-yellow-300" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-5xl font-heading text-white font-extrabold mb-1">
                      <CountingNumber value={userProgress?.currentStreak} duration={1.5} />
                    </div>
                    <p className="font-caption text-xs text-white/90">days 🔥</p>
                  </div>
                </GlowCard>
              </motion.div>

              <motion.div variants={scaleIn} className="col-span-1">
                <GlowCard className="bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-yellow-300 rounded-2xl p-4 lg:p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-2 lg:mb-3">
                    <h4 className="font-heading text-white font-bold text-sm lg:text-base">Points</h4>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon name="Star" size={20} className="text-yellow-100" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-5xl font-heading text-white font-extrabold mb-1">
                      <CountingNumber value={userProgress?.totalPoints} duration={2} />
                    </div>
                    <p className="font-caption text-xs text-white/90">earned ⭐</p>
                  </div>
                </GlowCard>
              </motion.div>

              <motion.div variants={scaleIn} className="col-span-1">
                <PulsingButton
                  onClick={() => setShowDiscoveryCollection(true)}
                  className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-4 lg:p-6 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-400/30 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1 lg:mb-2">
                      <span className="font-heading text-sm lg:text-xl font-bold">Collection</span>
                      <Icon name="Collection" size={20} strokeWidth={2.5} />
                    </div>
                    <p className="font-caption text-xs text-white/90">
                      <CountingNumber value={userProgress?.discoveredMicrobes} duration={1} /> microbes 🦠
                    </p>
                  </div>
                </PulsingButton>
              </motion.div>
            </div>
          </motion.section>

          {/* Game Mode Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <GameModeCards />
          </motion.div>

          {/* Read the Book Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <ReadTheBookSection />
          </motion.div>

          {/* Enhanced Daily Challenge */}
          <motion.section
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)]?.map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                  animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                >
                  🦠
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon name="Target" size={28} className="text-purple-600" strokeWidth={2.5} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading text-white font-bold">Daily Challenge</h3>
                    <p className="font-caption text-white/90 text-sm">Complete today's special mission</p>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 self-start sm:self-auto">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="Clock" size={16} className="text-white" />
                    <span className="font-mono text-base sm:text-lg text-white font-bold">23:45:12</span>
                  </div>
                  <p className="font-caption text-xs text-white/80">Time remaining</p>
                </div>
              </div>

              <GlowCard className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <h4 className="font-heading text-white text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  "Bacteria Detective Challenge"
                </h4>
                <p className="font-body text-white/90 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Find and identify 5 different types of bacteria in various environments.
                  Complete this challenge to earn the "Bacteria Detective" badge and 100 bonus points!
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-6">
                    <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 sm:px-4 py-2">
                      <Icon name="Star" size={18} className="text-yellow-300" />
                      <span className="font-mono text-white font-bold text-sm">+100 pts</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 sm:px-4 py-2">
                      <Icon name="Award" size={18} className="text-yellow-300" />
                      <span className="font-caption text-white font-semibold text-sm">Special Badge</span>
                    </div>
                  </div>

                  <Link to="/world-explorer-mode" className="w-full sm:w-auto">
                    <PulsingButton className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 sm:px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-transform min-h-[48px]">
                      <span>Start Challenge</span>
                      <Icon name="ArrowRight" size={18} strokeWidth={2.5} />
                    </PulsingButton>
                  </Link>
                </div>
              </GlowCard>
            </div>
          </motion.section>
        </div>
      </main>
      {/* Character Guide */}
      <CharacterGuide
        character="aunt-juju"
        message="Welcome to your laboratory dashboard! Click on any game mode to start your microbiology adventure. I'll be here to guide you every step of the way!"
        emotion="happy"
        position="bottom-right"
        isVisible={shouldShowGuide}
        onClose={hideGuide}
        showHint={true}
        hintText="Try clicking on the Microbe Matching game to start with something fun and easy!"
      />
      {/* Discovery Collection Modal */}
      <DiscoveryCollection
        isOpen={showDiscoveryCollection}
        onClose={() => setShowDiscoveryCollection(false)}
        discoveries={[]}
        onSelectMicrobe={() => {}}
      />
      {/* Welcome Celebration */}
      <SuccessCelebration
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
      <Footer />
    </div>
  );
};

export default GameHomeDashboard;
