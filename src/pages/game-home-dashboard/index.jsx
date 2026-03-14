import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import CharacterGuide from '../../components/ui/CharacterGuide';
import DiscoveryCollection from '../../components/ui/DiscoveryCollection';
import useGuideVisibility from '../../hooks/useGuideVisibility';
import WelcomeCharacters from './components/WelcomeCharacters';
import GameModeCards from './components/GameModeCards';
import ReadTheBookSection from './components/ReadTheBookSection';
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

const GameHomeDashboard = () => {
  const { shouldShowGuide, hideGuide } = useGuideVisibility('game-home-dashboard');
  const [showDiscoveryCollection, setShowDiscoveryCollection] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

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
      {/* Floating Background Microbes */}
      <FloatingMicrobes count={15} />
      <Header />
      <main className="pt-20 pb-8 relative z-10">
        <div className="container mx-auto px-4 lg:px-6 space-y-8">
          
          {/* Welcome Section */}
          <motion.section 
            className="text-center space-y-4"
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
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Icon name="Sparkles" size={16} strokeWidth={2} />
              </motion.div>
              <span className="font-caption text-sm font-medium">
                Welcome to MicrobeQuest
              </span>
            </motion.div>
            
            {/* Author Credit Section with Glow */}
            <motion.div 
              className="flex items-center justify-center mb-4"
              variants={fadeInUp}
            >
              <GlowCard className="flex items-center space-x-3 px-6 py-3 bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-xl shadow-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-300 ring-2 ring-purple-100">
                  <img
                    src="/assets/images/casual_big_smile_glasses-1760710103119.jpg"
                    alt="Julianne Tajuba"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-heading text-sm text-gray-700">Created by</span>
                    <span className="font-heading text-purple-600 font-bold">Julianne Tajuba</span>
                  </div>
                  <a
                    href="https://juliannetajuba.com/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 mt-1 text-xs text-gray-600 hover:text-purple-600 transition-colors duration-200 group"
                  >
                    <Icon name="Globe" size={12} />
                    <span>Meet the Author</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <Icon name="ExternalLink" size={10} />
                    </motion.div>
                  </a>
                </div>
              </GlowCard>
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-5xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 mb-3 font-extrabold"
              variants={fadeInUp}
            >
              Explore the World You Can't See!
            </motion.h1>
            
            <motion.p 
              className="font-body text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              {welcomeMessage}
            </motion.p>

            {/* Enhanced Time Display */}
            <motion.div 
              className="flex items-center justify-center space-x-4 text-sm"
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
            className="flex flex-wrap items-center justify-center gap-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {quickActions?.map((action, index) => (
              <Link
                key={action?.label}
                to={action?.route}
              >
                <motion.div
                  variants={scaleIn}
                  custom={index}
                >
                  <PulsingButton
                    className={`
                      flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-lg
                      bg-gradient-to-r ${action?.gradient} text-white
                      group relative overflow-hidden
                    `}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <Icon name={action?.icon} size={24} strokeWidth={2.5} />
                    <div className="text-left relative z-10">
                      <span className="font-body font-bold block">{action?.label}</span>
                      <span className="font-caption text-xs opacity-90">{action?.description}</span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
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
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
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
            <div className="space-y-4">
              <motion.div variants={scaleIn}>
                <GlowCard className="bg-gradient-to-br from-orange-500 to-red-500 border-2 border-orange-300 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading text-white font-bold">Learning Streak</h4>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      <Icon name="Flame" size={24} className="text-yellow-300" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-heading text-white font-extrabold mb-1">
                      <CountingNumber value={userProgress?.currentStreak} duration={1.5} />
                    </div>
                    <p className="font-caption text-sm text-white/90">days in a row 🔥</p>
                  </div>
                </GlowCard>
              </motion.div>
              
              <motion.div variants={scaleIn}>
                <GlowCard className="bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-yellow-300 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading text-white font-bold">Total Points</h4>
                    <motion.div
                      animate={{ 
                        rotate: 360
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Icon name="Star" size={24} className="text-yellow-100" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-heading text-white font-extrabold mb-1">
                      <CountingNumber value={userProgress?.totalPoints} duration={2} />
                    </div>
                    <p className="font-caption text-sm text-white/90">points earned ⭐</p>
                  </div>
                </GlowCard>
              </motion.div>

              <motion.div variants={scaleIn}>
                <PulsingButton
                  onClick={() => setShowDiscoveryCollection(true)}
                  className="w-full bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-400/30 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading text-xl font-bold">My Collection</span>
                      <Icon name="Collection" size={24} strokeWidth={2.5} />
                    </div>
                    <p className="font-caption text-sm text-white/90">
                      <CountingNumber value={userProgress?.discoveredMicrobes} duration={1} /> microbes discovered 🦠
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
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
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
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                >
                  🦠
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <Icon name="Target" size={32} className="text-purple-600" strokeWidth={2.5} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-heading text-white font-bold">Daily Challenge</h3>
                    <p className="font-caption text-white/90">
                      Complete today's special mission
                    </p>
                  </div>
                </div>
                
                <div className="text-right bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="Clock" size={18} className="text-white" />
                    <span className="font-mono text-lg text-white font-bold">23:45:12</span>
                  </div>
                  <p className="font-caption text-xs text-white/80">Time remaining</p>
                </div>
              </div>
              
              <GlowCard className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h4 className="font-heading text-white text-xl font-bold mb-3">
                  "Bacteria Detective Challenge"
                </h4>
                <p className="font-body text-white/90 mb-6 leading-relaxed">
                  Find and identify 5 different types of bacteria in various environments. 
                  Complete this challenge to earn the "Bacteria Detective" badge and 100 bonus points!
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                      <Icon name="Star" size={20} className="text-yellow-300" />
                      <span className="font-mono text-white font-bold">+100 pts</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                      <Icon name="Award" size={20} className="text-yellow-300" />
                      <span className="font-caption text-white font-semibold">Special Badge</span>
                    </div>
                  </div>
                  
                  <Link to="/world-explorer-mode">
                    <PulsingButton className="flex items-center space-x-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-lg hover:shadow-xl">
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
    </div>
  );
};

export default GameHomeDashboard;
