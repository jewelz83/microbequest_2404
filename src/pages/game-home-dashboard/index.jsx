import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import CharacterGuide from '../../components/ui/CharacterGuide';
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
      label: 'Play Matching',
      route: '/microbe-matching-game',
      icon: 'Play',
      gradient: 'from-purple-600 to-blue-600',
      description: 'Play Microbe Matching'
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

          <section className="bg-card rounded-2xl p-6 border border-border shadow-moderate">
            <h2 className="text-xl font-heading mb-2">Your saved progress</h2>
            <p className="text-muted-foreground mb-4">See completed timeline events and earned achievements in your progress hub. Guest timeline progress stays in this browser; guest game scores are not saved.</p>
            <Link to="/progress-achievement-hub" className="text-primary font-semibold underline">View saved progress</Link>
          </section>

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

          <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 text-white">
            <h2 className="text-2xl font-heading mb-2">Try World Explorer</h2>
            <p className="mb-4">Visit different environments and discover the microorganisms that live there.</p>
            <Link to="/world-explorer-mode" className="inline-block bg-white text-purple-700 font-semibold rounded-xl px-5 py-3">Start exploring</Link>
          </section>
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
