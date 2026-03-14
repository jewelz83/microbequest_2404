import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, Search, FileText, Users, Award, ChevronLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CaseSelectionBoard from './components/CaseSelectionBoard';
import InvestigationInterface from './components/InvestigationInterface';

import CareerConnectionPanel from './components/CareerConnectionPanel';
import CharacterSpriteSystem from '../../components/ui/CharacterSpriteSystem';

const MicrobeDetectiveMysteryOutbreak = () => {
  const [currentView, setCurrentView] = useState('home'); // home, case-selection, investigation, career
  const [selectedCase, setSelectedCase] = useState(null);
  const [unlockedCases, setUnlockedCases] = useState([1, 2]); // Start with first 2 cases unlocked
  const [completedCases, setCompletedCases] = useState([]);
  const [playerStats, setPlayerStats] = useState({
    totalPoints: 0,
    badgesEarned: [],
    casesCompleted: 0,
    perfectScores: 0
  });
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleCaseComplete = (caseId, score, perfect) => {
    setCompletedCases(prev => [...new Set([...prev, caseId])]);
    setPlayerStats(prev => ({
      ...prev,
      totalPoints: prev?.totalPoints + score,
      casesCompleted: prev?.casesCompleted + 1,
      perfectScores: perfect ? prev?.perfectScores + 1 : prev?.perfectScores,
      badgesEarned: [
        ...prev?.badgesEarned,
        ...(prev?.casesCompleted === 0 ? ['Junior Detective'] : []),
        ...(prev?.casesCompleted === 2 ? ['Epidemiologist'] : []),
        ...(prev?.casesCompleted === 5 ? ['Master Investigator'] : []),
        ...(perfect ? ['Perfect Detective'] : [])
      ]
    }));

    // Unlock next cases based on progress
    if (caseId === 2 && !unlockedCases?.includes(3)) {
      setUnlockedCases(prev => [...prev, 3, 4]);
    }
    if (caseId === 4 && !unlockedCases?.includes(5)) {
      setUnlockedCases(prev => [...prev, 5, 6]);
    }
  };

  const renderHomeScreen = () => (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-purple-800 to-blue-800 py-8"
        variants={itemVariants}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22white%22%20opacity%3D%220.3%22%3E%3Cpath%20d%3D%22M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10zm10%200c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
              <span className="text-lg">Back to Games</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-white font-semibold">Points: {playerStats?.totalPoints}</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-white font-semibold">Badges: {playerStats?.badgesEarned?.length}</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <motion.h1 
              className="text-6xl font-bold text-white mb-4"
              variants={itemVariants}
            >
              🔬 Microbe Detective
            </motion.h1>
            <motion.h2 
              className="text-3xl text-purple-200 font-semibold mb-6"
              variants={itemVariants}
            >
              Mystery Outbreak Investigation
            </motion.h2>
            <motion.p 
              className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Join Aunt Juju and Charlie as a Junior Microbiologist! Investigate real-world disease outbreaks, 
              gather clues, identify culprit microbes, and save communities. Use everything you've learned 
              from other games in this ultimate scientific challenge!
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Investigation Headquarters */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-500/30 p-4 rounded-xl">
                  <Search size={32} className="text-purple-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Investigation Headquarters</h3>
                  <p className="text-purple-200">Your scientific command center</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                  <FileText size={24} className="text-blue-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{completedCases?.length}</div>
                  <div className="text-blue-200 text-sm">Cases Solved</div>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 text-center">
                  <Award size={24} className="text-green-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{playerStats?.perfectScores}</div>
                  <div className="text-green-200 text-sm">Perfect Scores</div>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('case-selection')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <Play size={24} />
                Start Investigation
              </button>
            </div>

            {/* Recent Badges */}
            {playerStats?.badgesEarned?.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award size={20} className="text-yellow-400" />
                  Recent Badges
                </h4>
                <div className="flex flex-wrap gap-2">
                  {playerStats?.badgesEarned?.slice(-3)?.map((badge, index) => (
                    <div key={index} className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm">
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Character Introduction */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-500/30 p-4 rounded-xl">
                  <Users size={32} className="text-green-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Your Research Team</h3>
                  <p className="text-green-200">Meet your investigation partners</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <CharacterSpriteSystem
                    character="aunt-juju"
                    size="medium"
                    className="flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white">Aunt Juju</h4>
                    <p className="text-purple-200 text-sm">Chief Epidemiologist & Your Guide</p>
                    <p className="text-white/80 text-xs mt-1">
                      "Ready to solve real mysteries and help communities?"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <CharacterSpriteSystem
                    character="charlie-zebra"
                    size="medium"
                    className="flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white">Charlie the Zebra</h4>
                    <p className="text-orange-200 text-sm">Field Assistant & Cheerleader</p>
                    <p className="text-white/80 text-xs mt-1">
                      "This is un-ZEBRA-lievably exciting detective work!"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Investigation Tools Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Microscope size={20} className="text-blue-400" />
                Investigation Tools
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-500/20 text-blue-200 p-3 rounded-lg text-center">
                  Evidence Board
                </div>
                <div className="bg-purple-500/20 text-purple-200 p-3 rounded-lg text-center">
                  Digital Lab
                </div>
                <div className="bg-green-500/20 text-green-200 p-3 rounded-lg text-center">
                  Interview Room
                </div>
                <div className="bg-orange-500/20 text-orange-200 p-3 rounded-lg text-center">
                  Analysis Center
                </div>
              </div>
            </div>

            {/* Career Connection Button */}
            <button
              onClick={() => setCurrentView('career')}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105"
            >
              Explore Science Careers
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'case-selection':
        return (
          <CaseSelectionBoard
            unlockedCases={unlockedCases}
            completedCases={completedCases}
            onSelectCase={(caseData) => {
              setSelectedCase(caseData);
              setCurrentView('investigation');
            }}
            onBack={() => setCurrentView('home')}
            playerStats={playerStats}
          />
        );
      case 'investigation':
        return (
          <InvestigationInterface
            selectedCase={selectedCase}
            onComplete={handleCaseComplete}
            onBack={() => setCurrentView('case-selection')}
            playerStats={playerStats}
          />
        );
      case 'career':
        return (
          <CareerConnectionPanel
            onBack={() => setCurrentView('home')}
            playerStats={playerStats}
          />
        );
      default:
        return renderHomeScreen();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderCurrentView()}
    </AnimatePresence>
  );
};

export default MicrobeDetectiveMysteryOutbreak;