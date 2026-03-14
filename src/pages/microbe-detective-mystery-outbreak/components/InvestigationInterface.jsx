import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, FileText, Users, Beaker, CheckCircle, Clock, Target } from 'lucide-react';
import EvidenceBoard from './EvidenceBoard';
import DigitalLab from './DigitalLab';
import InterviewRoom from './InterviewRoom';
import AnalysisCenter from './AnalysisCenter';
import CharacterBriefing from './CharacterBriefing';
import Icon from '../../../components/AppIcon';


const InvestigationInterface = ({ selectedCase, onComplete, onBack, playerStats }) => {
  const [currentTool, setCurrentTool] = useState('briefing');
  const [collectedClues, setCollectedClues] = useState([]);
  const [identifiedMicrobe, setIdentifiedMicrobe] = useState(null);
  const [solutionSubmitted, setSolutionSubmitted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [caseProgress, setCaseProgress] = useState({
    cluesFound: 0,
    totalClues: selectedCase?.clues || 5,
    microbeIdentified: false,
    solutionRecommended: false
  });

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tools = [
    { id: 'briefing', name: 'Case Briefing', icon: FileText, color: 'blue' },
    { id: 'evidence', name: 'Evidence Board', icon: Search, color: 'purple' },
    { id: 'lab', name: 'Digital Lab', icon: Beaker, color: 'green' },
    { id: 'interview', name: 'Interview Room', icon: Users, color: 'orange' },
    { id: 'analysis', name: 'Analysis Center', icon: Target, color: 'pink' }
  ];

  const handleClueFound = (clue) => {
    if (!collectedClues?.find(c => c?.id === clue?.id)) {
      setCollectedClues(prev => [...prev, clue]);
      setCaseProgress(prev => ({
        ...prev,
        cluesFound: prev?.cluesFound + 1
      }));
    }
  };

  const handleMicrobeIdentified = (microbe) => {
    setIdentifiedMicrobe(microbe);
    setCaseProgress(prev => ({
      ...prev,
      microbeIdentified: true
    }));
  };

  const handleSolutionSubmit = (solution) => {
    setSolutionSubmitted(true);
    setCaseProgress(prev => ({
      ...prev,
      solutionRecommended: true
    }));

    // Calculate score
    const baseScore = selectedCase?.points || 50;
    const timeBonus = timeElapsed < 300 ? 25 : timeElapsed < 600 ? 15 : 5; // 5min/10min thresholds
    const perfectBonus = caseProgress?.cluesFound === caseProgress?.totalClues ? 25 : 0;
    const totalScore = baseScore + timeBonus + perfectBonus;
    const isPerfect = caseProgress?.cluesFound === caseProgress?.totalClues && timeElapsed < 300;

    setTimeout(() => {
      onComplete(selectedCase?.id, totalScore, isPerfect);
    }, 2000);
  };

  const getToolColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600'
    };
    return colors?.[color] || colors?.blue;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'briefing':
        return (
          <CharacterBriefing
            selectedCase={selectedCase}
            onStartInvestigation={() => setCurrentTool('evidence')}
          />
        );
      case 'evidence':
        return (
          <EvidenceBoard
            selectedCase={selectedCase}
            collectedClues={collectedClues}
            onClueFound={handleClueFound}
            onSwitchTool={setCurrentTool}
          />
        );
      case 'lab':
        return (
          <DigitalLab
            selectedCase={selectedCase}
            collectedClues={collectedClues}
            onMicrobeIdentified={handleMicrobeIdentified}
            identifiedMicrobe={identifiedMicrobe}
          />
        );
      case 'interview':
        return (
          <InterviewRoom
            selectedCase={selectedCase}
            onClueFound={handleClueFound}
            collectedClues={collectedClues}
          />
        );
      case 'analysis':
        return (
          <AnalysisCenter
            selectedCase={selectedCase}
            collectedClues={collectedClues}
            identifiedMicrobe={identifiedMicrobe}
            onSolutionSubmit={handleSolutionSubmit}
            solutionSubmitted={solutionSubmitted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 py-4 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
              <span className="text-lg">Back to Cases</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">{selectedCase?.title}</h1>
              <p className="text-purple-200">{selectedCase?.location}</p>
            </div>

            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <Clock size={16} />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <span className="font-semibold">{caseProgress?.cluesFound}/{caseProgress?.totalClues} Clues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-80px)]">
        {/* Tool Navigation */}
        <div className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-white/10 p-4">
          <h3 className="text-lg font-bold text-white mb-6">Investigation Tools</h3>
          <div className="space-y-2">
            {tools?.map((tool) => {
              const Icon = tool?.icon;
              const isActive = currentTool === tool?.id;
              const isCompleted = 
                (tool?.id === 'evidence' && collectedClues?.length > 0) ||
                (tool?.id === 'lab' && identifiedMicrobe) ||
                (tool?.id === 'analysis' && solutionSubmitted);

              return (
                <button
                  key={tool?.id}
                  onClick={() => setCurrentTool(tool?.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r ' + getToolColor(tool?.color) + ' text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="flex-1 text-left">{tool?.name}</span>
                  {isCompleted && <CheckCircle size={16} className="text-green-400" />}
                </button>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-semibold mb-3">Case Progress</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/80">
                <span>Clues Found</span>
                <span className={caseProgress?.cluesFound === caseProgress?.totalClues ? 'text-green-400' : ''}>
                  {caseProgress?.cluesFound}/{caseProgress?.totalClues}
                </span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Microbe ID</span>
                <span className={caseProgress?.microbeIdentified ? 'text-green-400' : 'text-red-400'}>
                  {caseProgress?.microbeIdentified ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Solution</span>
                <span className={caseProgress?.solutionRecommended ? 'text-green-400' : 'text-red-400'}>
                  {caseProgress?.solutionRecommended ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTool}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderCurrentTool()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestigationInterface;