import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CharacterGuide from '../../components/ui/CharacterGuide';
import FunFactModal from '../../components/ui/FunFactModal';
import useGuideVisibility from '../../hooks/useGuideVisibility';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { getMicrobeById } from '../../utils/microbeData';

// Import page-specific components
import ExplorationEnvironment from './components/ExplorationEnvironment';
import CharacterGuideLocal from './components/CharacterGuide';
import DiscoveryPanel from './components/DiscoveryPanel';
import MicroscopeViewport from './components/MicroscopeViewport';
import EnvironmentSelector from './components/EnvironmentSelector';

const WorldExplorerMode = () => {
  const navigate = useNavigate();
  
  // Game state
  const [currentEnvironment, setCurrentEnvironment] = useState('soil');
  const [isExploring, setIsExploring] = useState(false);
  const [discoveredMicrobes, setDiscoveredMicrobes] = useState([]);
  const [selectedMicrobe, setSelectedMicrobe] = useState(null);
  const [showMicroscope, setShowMicroscope] = useState(false);
  const [gamePhase, setGamePhase] = useState('selection'); // 'selection', 'exploring', 'completed'
  const { shouldShowGuide: showGuide, hideGuide: setShowGuide } = useGuideVisibility('world-explorer-mode');
  const { shouldShowGuide: showLocalGuide, hideGuide: handleLocalGuideClose } = useGuideVisibility('world-explorer-local');
  
  // Fun fact modal state
  const [showFunFact, setShowFunFact] = useState(false);
  const [currentFunFactMicrobe, setCurrentFunFactMicrobe] = useState(null);
  const [pendingFunFacts, setPendingFunFacts] = useState([]);

  // Discovery counts by environment
  const [discoveredCounts, setDiscoveredCounts] = useState({
    soil: 0,
    water: 0,
    body: 0
  });

  // Character guide state
  const [guideMessage, setGuideMessage] = useState('');
  const [guideEmotion, setGuideEmotion] = useState('happy');

  useEffect(() => {
    // Update discovery counts when microbes are discovered
    const counts = { soil: 0, water: 0, body: 0 };
    discoveredMicrobes?.forEach(microbeId => {
      if (microbeId?.startsWith('soil-')) counts.soil++;
      else if (microbeId?.startsWith('water-')) counts.water++;
      else if (microbeId?.startsWith('body-')) counts.body++;
    });
    setDiscoveredCounts(counts);

    // Check if current environment is completed
    const currentCount = counts?.[currentEnvironment];
    if (currentCount === 3 && isExploring) {
      setGamePhase('completed');
      setGuideMessage(`Amazing work! You've discovered all microorganisms in the ${currentEnvironment} environment!`);
      setGuideEmotion('celebrating');
    }
  }, [discoveredMicrobes, currentEnvironment, isExploring]);

  const handleStartExploration = (environmentId = currentEnvironment) => {
    // If a specific environment is provided, switch to it first
    if (environmentId !== currentEnvironment) {
      setCurrentEnvironment(environmentId);
    }
    
    setGamePhase('exploring');
    setIsExploring(true);
    setGuideMessage(`Welcome to the ${environmentId} environment! Use your magnifying glass to search for hidden microorganisms.`);
    setGuideEmotion('encouraging');
  };

  const handleEnvironmentChange = (environmentId) => {
    setCurrentEnvironment(environmentId);
    setIsExploring(false);
    setGamePhase('selection');
    setSelectedMicrobe(null);
    setShowMicroscope(false);
    setGuideMessage(`You've selected the ${environmentId} environment. Ready to start exploring?`);
    setGuideEmotion('happy');
    
    // Show any pending fun facts when changing environments
    if (pendingFunFacts?.length > 0) {
      setCurrentFunFactMicrobe(pendingFunFacts?.[0]);
      setShowFunFact(true);
      setPendingFunFacts(prev => prev?.slice(1));
    }
  };

  const handleMicrobeDiscovered = (microbe) => {
    if (!discoveredMicrobes?.includes(microbe?.id)) {
      setDiscoveredMicrobes(prev => [...prev, microbe?.id]);
      
      // Get detailed microbe data
      const detailedMicrobe = getMicrobeById(microbe?.id);
      if (detailedMicrobe) {
        // Store pending fun fact instead of showing immediately during exploration
        if (isExploring && gamePhase === 'exploring') {
          setPendingFunFacts(prev => [...prev, detailedMicrobe]);
          // Update guide message to mention discovery without popup
          setGuideMessage(`Great discovery! You found ${microbe?.name}! Keep exploring to find more microbes, or return to selection to see fun facts.`);
          setGuideEmotion('excited');
        } else {
          // Show fun fact immediately if not actively exploring zones
          setCurrentFunFactMicrobe(detailedMicrobe);
          setShowFunFact(true);
          setGuideMessage(`Amazing discovery! You found ${microbe?.name}! Check out the fun fact that just appeared - it's fascinating!`);
          setGuideEmotion('excited');
        }
      }
    }
  };

  const handleFunFactClose = () => {
    setShowFunFact(false);
    setCurrentFunFactMicrobe(null);
    
    // Show next pending fun fact if available
    if (pendingFunFacts?.length > 0) {
      setTimeout(() => {
        setCurrentFunFactMicrobe(pendingFunFacts?.[0]);
        setShowFunFact(true);
        setPendingFunFacts(prev => prev?.slice(1));
      }, 500);
    }
  };

  const handleFunFactViewDetails = (microbe) => {
    setSelectedMicrobe(microbe);
    setShowMicroscope(true);
  };

  const handleMicrobeSelect = (microbe) => {
    const detailedMicrobe = getMicrobeById(microbe?.id || microbe);
    setSelectedMicrobe(detailedMicrobe || microbe);
    setShowMicroscope(true);
  };

  const handleMicroscopeClose = () => {
    setShowMicroscope(false);
    setSelectedMicrobe(null);
  };

  const handleNavigateToLab = () => {
    navigate('/microscope-discovery-lab', { 
      state: { selectedMicrobe, fromExplorer: true } 
    });
  };

  const handleNavigateToQuiz = () => {
    navigate('/quiz-challenge-system', { 
      state: { discoveredMicrobes, currentEnvironment } 
    });
  };

  const handleHintRequest = () => {
    setGuideMessage(`Look carefully in the darker areas and near organic matter. Microorganisms love places with lots of nutrients!`);
    setGuideEmotion('thinking');
  };

  const handleReturnToSelection = () => {
    setGamePhase('selection');
    setIsExploring(false);
    setSelectedMicrobe(null);
    setShowMicroscope(false);
    setGuideMessage('Choose another environment to continue your exploration journey!');
    setGuideEmotion('encouraging');
    
    // Show any pending fun facts when returning to selection
    if (pendingFunFacts?.length > 0) {
      setCurrentFunFactMicrobe(pendingFunFacts?.[0]);
      setShowFunFact(true);
      setPendingFunFacts(prev => prev?.slice(1));
    }
  };

  const totalDiscovered = Object.values(discoveredCounts)?.reduce((sum, count) => sum + count, 0);
  const totalMicrobes = 9;
  const overallProgress = (totalDiscovered / totalMicrobes) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-heading text-foreground mb-2">
                  World Explorer Mode
                </h1>
                <p className="font-body text-muted-foreground max-w-2xl">
                  Embark on an exciting journey to discover hidden microorganisms in different environments. 
                  Use your scientific tools to explore soil, water, and biological systems!
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-heading text-primary">{totalDiscovered}</div>
                  <div className="font-caption text-xs text-muted-foreground">Discovered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading text-accent">{Math.round(overallProgress)}%</div>
                  <div className="font-caption text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-card rounded-lg p-4 border border-border shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-sm text-foreground">Overall Exploration Progress</span>
                <span className="font-mono text-sm text-primary font-semibold">
                  {totalDiscovered}/{totalMicrobes} microbes
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {gamePhase === 'selection' && (
            <div className="space-y-8">
              <EnvironmentSelector
                currentEnvironment={currentEnvironment}
                onEnvironmentChange={handleEnvironmentChange}
                onStartExploration={handleStartExploration}
                discoveredCounts={discoveredCounts}
              />
            </div>
          )}

          {gamePhase === 'exploring' && (
            <div className="space-y-6">
              {/* Exploration Controls */}
              <div className="flex items-center justify-between bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReturnToSelection}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Change Environment
                  </Button>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Target" size={16} className="text-primary" />
                    <span className="font-body text-foreground">
                      {discoveredCounts?.[currentEnvironment]}/3 microbes found
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNavigateToQuiz}
                    iconName="Brain"
                    iconPosition="left"
                    disabled={discoveredMicrobes?.length === 0}
                  >
                    Take Quiz
                  </Button>
                </div>
              </div>

              {/* Exploration Environment */}
              <ExplorationEnvironment
                currentEnvironment={currentEnvironment}
                onMicrobeDiscovered={handleMicrobeDiscovered}
                discoveredMicrobes={discoveredMicrobes}
                isExploring={isExploring}
              />
            </div>
          )}

          {gamePhase === 'completed' && (
            <div className="text-center space-y-6">
              <div className="bg-success/10 border border-success/20 rounded-xl p-8">
                <Icon name="Trophy" size={64} className="text-success mx-auto mb-4" />
                <h2 className="text-2xl font-heading text-success mb-2">
                  Environment Complete!
                </h2>
                <p className="font-body text-foreground mb-6">
                  Congratulations! You've discovered all microorganisms in the {currentEnvironment} environment.
                </p>
                
                {/* Show pending fun facts notification */}
                {pendingFunFacts?.length > 0 && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
                    <p className="font-body text-sm text-foreground">
                      You have {pendingFunFacts?.length} fun fact{pendingFunFacts?.length !== 1 ? 's' : ''} waiting! 
                      They'll appear when you return to environment selection.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleReturnToSelection}
                    iconName="Compass"
                    iconPosition="left"
                  >
                    Explore Another Environment
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleNavigateToQuiz}
                    iconName="Brain"
                    iconPosition="left"
                  >
                    Test Your Knowledge
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Discovery Panel */}
      {(gamePhase === 'exploring' || gamePhase === 'completed') && (
        <DiscoveryPanel
          discoveredMicrobes={discoveredMicrobes}
          totalMicrobes={totalMicrobes}
          onMicrobeSelect={handleMicrobeSelect}
          selectedMicrobe={selectedMicrobe}
        />
      )}
      {/* Character Guide */}
      {showLocalGuide && (gamePhase === 'exploring' || gamePhase === 'completed') && (
        <CharacterGuideLocal
          currentEnvironment={currentEnvironment}
          discoveredCount={discoveredCounts?.[currentEnvironment]}
          isExploring={isExploring}
          onHintRequest={handleHintRequest}
          onClose={handleLocalGuideClose}
        />
      )}
      {/* Global Character Guide */}
      <CharacterGuide
        character="aunt-juju"
        message={guideMessage}
        emotion={guideEmotion}
        position="bottom-right"
        isVisible={gamePhase === 'selection'}
        showHint={false}
        onClose={() => setShowGuide(false)}
      />
      {/* Microscope Viewport */}
      <MicroscopeViewport
        selectedMicrobe={selectedMicrobe}
        isOpen={showMicroscope}
        onClose={handleMicroscopeClose}
        onNavigateToLab={handleNavigateToLab}
      />
      
      {/* Fun Fact Modal */}
      <FunFactModal
        microbe={currentFunFactMicrobe}
        isOpen={showFunFact}
        onClose={handleFunFactClose}
        onViewDetails={handleFunFactViewDetails}
      />
    </div>
  );
};

export default WorldExplorerMode;