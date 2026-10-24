import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, FileText, Users, Beaker, CheckCircle, Clock, Target } from 'lucide-react';
import EvidenceBoard from './EvidenceBoard';
import DigitalLab from './DigitalLab';
import InterviewRoom from './InterviewRoom';
import AnalysisCenter from './AnalysisCenter';
import CharacterBriefing from './CharacterBriefing';

const InvestigationInterface = ({ selectedCase, onComplete, onBack, playerStats }) => {
  const completionTimer = useRef(null);
  const completing = useRef(false);
  const clueIds = useRef(new Set());
  useEffect(() => () => clearTimeout(completionTimer.current), []);
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

  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const tools = [
    { id: 'briefing', name: 'Briefing', icon: FileText, color: 'blue' },
    { id: 'evidence', name: 'Evidence', icon: Search, color: 'purple' },
    { id: 'lab', name: 'Lab', icon: Beaker, color: 'green' },
    { id: 'interview', name: 'Interview', icon: Users, color: 'orange' },
    { id: 'analysis', name: 'Analysis', icon: Target, color: 'pink' }
  ];

  const handleClueFound = (clue) => {
    if (!clueIds.current.has(clue.id)) {
      clueIds.current.add(clue.id);
      setCollectedClues(prev => [...prev, clue]);
      setCaseProgress(prev => ({ ...prev, cluesFound: prev?.cluesFound + 1 }));
    }
  };

  const handleMicrobeIdentified = (microbe) => {
    setIdentifiedMicrobe(microbe);
    setCaseProgress(prev => ({ ...prev, microbeIdentified: true }));
  };

  const handleSolutionSubmit = (solution) => {
    if (completing.current || !solution?.isPerfect || !identifiedMicrobe || collectedClues.length === 0) return;
    completing.current = true;
    setSolutionSubmitted(true);
    setCaseProgress(prev => ({ ...prev, solutionRecommended: true }));
    const baseScore = selectedCase?.points || 50;
    const timeBonus = timeElapsed < 300 ? 25 : timeElapsed < 600 ? 15 : 5;
    const perfectBonus = caseProgress?.cluesFound === caseProgress?.totalClues ? 25 : 0;
    const totalScore = baseScore + timeBonus + perfectBonus;
    const isPerfect = caseProgress?.cluesFound === caseProgress?.totalClues && timeElapsed < 300;
    completionTimer.current = setTimeout(() => onComplete(selectedCase?.id, totalScore, isPerfect), 2000);
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

  const isCompleted = (toolId) =>
    (toolId === 'evidence' && collectedClues?.length > 0) ||
    (toolId === 'lab' && identifiedMicrobe) ||
    (toolId === 'analysis' && solutionSubmitted);

  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'briefing': return <CharacterBriefing selectedCase={selectedCase} onStartInvestigation={() => setCurrentTool('evidence')} />;
      case 'evidence': return <EvidenceBoard selectedCase={selectedCase} collectedClues={collectedClues} onClueFound={handleClueFound} onSwitchTool={setCurrentTool} />;
      case 'lab': return <DigitalLab selectedCase={selectedCase} collectedClues={collectedClues} onMicrobeIdentified={handleMicrobeIdentified} identifiedMicrobe={identifiedMicrobe} />;
      case 'interview': return <InterviewRoom selectedCase={selectedCase} onClueFound={handleClueFound} collectedClues={collectedClues} />;
      case 'analysis': return <AnalysisCenter selectedCase={selectedCase} collectedClues={collectedClues} identifiedMicrobe={identifiedMicrobe} onSolutionSubmit={handleSolutionSubmit} solutionSubmitted={solutionSubmitted} />;
      default: return null;
    }
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 py-3 border-b border-white/10 flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-2">
            <button onClick={onBack} className="flex items-center gap-1 text-white/80 hover:text-white transition-colors flex-shrink-0">
              <ChevronLeft size={20} />
              <span className="text-sm hidden sm:inline">Back</span>
            </button>

            <div className="text-center min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold text-white truncate">{selectedCase?.title}</h1>
              <p className="text-purple-200 text-xs sm:text-sm hidden sm:block">{selectedCase?.location}</p>
            </div>

            <div className="flex items-center gap-2 text-white flex-shrink-0">
              <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1 text-xs sm:text-sm">
                <Clock size={12} />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
              <div className="bg-white/10 rounded-lg px-2 py-1 text-xs sm:text-sm">
                <span>{caseProgress?.cluesFound}/{caseProgress?.totalClues}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop: sidebar + content | Mobile: content + bottom tabs */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — desktop only */}
        <div className="hidden md:flex w-56 bg-slate-800/50 backdrop-blur-sm border-r border-white/10 p-4 flex-col flex-shrink-0">
          <h3 className="text-sm font-bold text-white mb-4">Investigation Tools</h3>
          <div className="space-y-1 flex-1">
            {tools?.map((tool) => {
              const ToolIcon = tool?.icon;
              const active = currentTool === tool?.id;
              const done = isCompleted(tool?.id);
              return (
                <button key={tool?.id} onClick={() => setCurrentTool(tool?.id)}
                  disabled={tool.id === 'analysis' && (!identifiedMicrobe || collectedClues.length === 0)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm ${
                    active ? 'bg-gradient-to-r ' + getToolColor(tool?.color) + ' text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                  <ToolIcon size={18} />
                  <span className="flex-1 text-left">{tool?.name}</span>
                  {done && <CheckCircle size={14} className="text-green-400" />}
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="p-3 bg-white/5 rounded-lg mt-4">
            <h4 className="text-white text-xs font-semibold mb-2">Progress</h4>
            <div className="space-y-1 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Clues</span>
                <span className={caseProgress?.cluesFound === caseProgress?.totalClues ? 'text-green-400' : ''}>{caseProgress?.cluesFound}/{caseProgress?.totalClues}</span>
              </div>
              <div className="flex justify-between">
                <span>Microbe ID</span>
                <span className={caseProgress?.microbeIdentified ? 'text-green-400' : 'text-red-400'}>{caseProgress?.microbeIdentified ? '✓' : '✗'}</span>
              </div>
              <div className="flex justify-between">
                <span>Solution</span>
                <span className={caseProgress?.solutionRecommended ? 'text-green-400' : 'text-red-400'}>{caseProgress?.solutionRecommended ? '✓' : '✗'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div key={currentTool}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} className="min-h-full">
              {renderCurrentTool()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Bottom tab bar — mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 z-50">
        <div className="flex items-stretch">
          {tools?.map((tool) => {
            const ToolIcon = tool?.icon;
            const active = currentTool === tool?.id;
            const done = isCompleted(tool?.id);
            return (
              <button key={tool?.id} onClick={() => setCurrentTool(tool?.id)}
                  disabled={tool.id === 'analysis' && (!identifiedMicrobe || collectedClues.length === 0)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 transition-all relative ${
                  active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}>
                {active && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400" />}
                <div className="relative">
                  <ToolIcon size={18} />
                  {done && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />}
                </div>
                <span className="text-xs font-medium leading-tight">{tool?.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default InvestigationInterface;
