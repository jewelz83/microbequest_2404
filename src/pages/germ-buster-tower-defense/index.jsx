import { freshCombat, createWave, startCombat, fireCombat, stepCombat, advanceCombat } from '../../services/germCombat.mjs';
import { useDifficultyCeiling } from '../../components/GameAccessGate';
import { permitsDifficulty } from '../../services/gameAccessPolicy.mjs';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import CharacterGuide from '../../components/ui/CharacterGuide';
import useGuideVisibility from '../../hooks/useGuideVisibility';
import GameBoard from './components/GameBoard';
import DefenseToolPanel from './components/DefenseToolPanel';
import HealthBalanceMeters from './components/HealthBalanceMeters';
import WaveProgress from './components/WaveProgress';
import ScoreDisplay from './components/ScoreDisplay';
import GameOverScreen from './components/GameOverScreen';
import BodyLocationSelector from './components/BodyLocationSelector';
import EducationalTips from './components/EducationalTips';
import { saveGameScore } from '../../services/gameProgressService';
import { trackGameModeStart, trackGameModeComplete, trackGameOver } from '../../services/analyticsService';
import { useAuth } from '../../contexts/AuthContext';

const GermBusterTowerDefense = () => {
  const maxDifficulty = useDifficultyCeiling();
  const [difficulty, setDifficultyState] = useState('easy');
  const setDifficulty = level => { if (permitsDifficulty(level, maxDifficulty)) setDifficultyState(level); };
  const [combat, setCombat] = useState(freshCombat);
  const { gameState, currentWave, totalWaves, immuneHealth, bacterialBalance, score, defensePoints, bacteria, projectiles, playerShip, ammoCount, rapidFire, hitIndicators, achievements } = combat;
  const defenseTowers = [];
  const keysPressed = useRef({});
  const { shouldShowGuide, hideGuide } = useGuideVisibility('germ-buster-tower-defense');
  const { isPremium } = useAuth();
  const [showEducationalTip, setShowEducationalTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(null);

  // Body locations with their specific challenges
  const bodyLocations = [
    {
      id: 'gut',
      name: 'Gut Microbiome',
      description: 'Balance good bacteria while fighting food poisoning',
      background: 'bg-gradient-to-b from-amber-50 to-orange-100',
      fact: 'Your gut has over 100 trillion bacteria!',
      winCondition: 'Maintain 80%+ good bacteria for 3 waves',
      challengeType: 'balance',
      enemyTypes: ['salmonella', 'c_difficile'],
      goodBacteria: ['lactobacillus', 'bifidobacterium']
    },
    {
      id: 'skin',
      name: 'Skin Defense',
      description: 'Prevent infections without killing helpful skin bacteria',
      background: 'bg-gradient-to-b from-pink-50 to-rose-100',
      fact: 'Healthy skin bacteria protect you from infections!',
      winCondition: 'Block 10 bad bacteria while preserving good ones',
      challengeType: 'defense',
      enemyTypes: ['staphylococcus'],
      goodBacteria: ['e_faecalis']
    },
    {
      id: 'mouth',
      name: 'Mouth & Teeth',
      description: 'Fight cavity-causing bacteria while keeping helpful mouth bacteria',
      background: 'bg-gradient-to-b from-blue-50 to-cyan-100',
      fact: 'Brushing helps but doesn\'t kill all bacteria!',
      winCondition: 'Reduce harmful bacteria by 70%',
      challengeType: 'reduction',
      enemyTypes: ['streptococcus'],
      goodBacteria: ['lactobacillus']
    },
    {
      id: 'lungs',
      name: 'Lungs & Respiratory',
      description: 'Defend against respiratory infection bacteria',
      background: 'bg-gradient-to-b from-indigo-50 to-blue-100',
      fact: 'Your immune system fights thousands of germs daily!',
      winCondition: 'Survive 5 waves of respiratory pathogens',
      challengeType: 'survival',
      enemyTypes: ['streptococcus', 'staphylococcus'],
      goodBacteria: ['bifidobacterium']
    }
  ];

  // Bacteria types with their properties
  const bacteriaTypes = {
    // Good bacteria
    lactobacillus: {
      name: 'Lactobacillus',
      type: 'good',
      description: 'Helps digestion',
      color: '#22c55e',
      size: 'small',
      speed: 'slow',
      health: 30,
      points: -5 // Penalty for killing good bacteria
    },
    bifidobacterium: {
      name: 'Bifidobacterium',
      type: 'good',
      description: 'Supports immune system',
      color: '#16a34a',
      size: 'medium',
      speed: 'slow',
      health: 40,
      points: -5
    },
    e_faecalis: {
      name: 'E. faecalis',
      type: 'good',
      description: 'Maintains healthy gut',
      color: '#15803d',
      size: 'small',
      speed: 'medium',
      health: 25,
      points: -5
    },
    // Bad bacteria
    streptococcus: {
      name: 'Streptococcus',
      type: 'bad',
      description: 'Causes infections',
      color: '#7c3aed',
      size: 'medium',
      speed: 'medium',
      health: 50,
      points: 10,
      damage: 15
    },
    staphylococcus: {
      name: 'Staphylococcus',
      type: 'bad',
      description: 'Creates skin infections',
      color: '#6d28d9',
      size: 'medium',
      speed: 'fast',
      health: 60,
      points: 15,
      damage: 20
    },
    salmonella: {
      name: 'Salmonella',
      type: 'bad',
      description: 'Food poisoning bacteria',
      color: '#5b21b6',
      size: 'large',
      speed: 'medium',
      health: 80,
      points: 20,
      damage: 25
    },
    c_difficile: {
      name: 'C. difficile',
      type: 'bad',
      description: 'Destroys healthy gut bacteria',
      color: '#4c1d95',
      size: 'large',
      speed: 'slow',
      health: 100,
      points: 25,
      damage: 30
    }
  };

  // Enhanced Defense tools optimized for biological shooting
  const defenseTools = [
    {
      id: 'antibiotic',
      name: 'Antibiotic Shot',
      icon: 'Zap',
      color: 'bg-purple-500',
      projectileColor: '#a855f7',
      description: 'Rapid-fire antibiotic shots that eliminate harmful bacteria',
      cost: 1,
      damage: 75,
      effect: { badBacteria: -75, goodBacteria: -10, balance: -3 },
      cooldown: 100, // Very fast firing rate
      ammoType: 'antibiotic',
      projectileSpeed: 15,
      projectileSize: 4,
      isShootable: true
    },
    {
      id: 'probiotic',
      name: 'Probiotic Beam',
      icon: 'Heart',
      color: 'bg-green-500',
      projectileColor: '#22c55e',
      description: 'Healing beams that restore and strengthen good bacteria',
      cost: 1,
      effect: { goodBacteria: 60, balance: 12 },
      cooldown: 200,
      ammoType: 'probiotic',
      projectileSpeed: 12,
      projectileSize: 6,
      isShootable: true
    },
    {
      id: 'immune-cell',
      name: 'Immune Missile',
      icon: 'Target',
      color: 'bg-blue-500',
      projectileColor: '#3b82f6',
      description: 'Smart missiles that seek and destroy harmful bacteria',
      cost: 2,
      damage: 100,
      effect: { badBacteria: -100, immuneHealth: 8 },
      cooldown: 300,
      ammoType: 'immuneCell',
      projectileSpeed: 10,
      projectileSize: 8,
      isShootable: true,
      isHoming: true // Homes in after shooting straight initially
    },
    {
      id: 'hygiene',
      name: 'Sanitizer Spray',
      icon: 'Droplets',
      color: 'bg-yellow-500',
      projectileColor: '#eab308',
      description: 'Triple-shot sanitizer spray that covers more area',
      cost: 2,
      damage: 40,
      effect: { badBacteria: -40, goodBacteria: -5 },
      cooldown: 250,
      ammoType: 'hygiene',
      projectileSpeed: 8,
      projectileSize: 6,
      isShootable: true,
      isSpreadShot: true // Fires 3 projectiles at once
    },
    {
      id: 'antiseptic',
      name: 'Antiseptic Cannon',
      icon: 'Crosshair',
      color: 'bg-red-500',
      projectileColor: '#ef4444',
      description: 'High-power antiseptic shots that eliminate bacteria instantly',
      cost: 3,
      damage: 200,
      effect: { badBacteria: -200, goodBacteria: -3 },
      cooldown: 600,
      ammoType: 'antiseptic',
      projectileSpeed: 18,
      projectileSize: 12,
      isShootable: true
    },
    {
      id: 'rest',
      name: 'Shield Boost',
      icon: 'Shield',
      color: 'bg-indigo-500',
      description: 'Instantly restores body health and bacterial balance',
      cost: 25,
      effect: { immuneHealth: 25, balance: 8 },
      cooldown: 3000,
      isShootable: false
    }
  ];

  const selectedLocation = bodyLocations.find(location => location.id === combat.locationId);
  const selectedTool = defenseTools.find(tool => tool.id === combat.selectedToolId);
  const toolsRef = useRef(defenseTools);

  useEffect(() => {
    if (gameState !== 'playing') return;
    let previous = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(), elapsed = now - previous;
      previous = now;
      setCombat(state => stepCombat(state, elapsed, toolsRef.current, difficulty, keysPressed.current));
    }, 16);
    return () => clearInterval(timer);
  }, [gameState, difficulty]);

  useEffect(() => {
    const controlled = ['ArrowLeft','ArrowRight','KeyA','KeyD','Space','Enter'];
    const down = event => {
      if (gameState !== 'playing' || !controlled.includes(event.code) || event.target.closest('button,a,input,select,textarea')) return;
      event.preventDefault(); keysPressed.current[event.code] = true;
    };
    const up = event => { delete keysPressed.current[event.code]; };
    const clear = () => { keysPressed.current = {}; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', clear);
    return () => { clear(); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', clear); };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'game-over') trackGameOver('germ-buster', { score, difficulty, currentWave });
    if (gameState === 'victory') {
      trackGameModeComplete('germ-buster', { score, difficulty, wavesCompleted: totalWaves });
      saveGameScore({gameMode:'germ-buster',score,difficulty,metadata:{location:combat.locationId,immuneHealth,bacterialBalance,wavesCompleted:totalWaves}}).catch(console.error);
    }
  }, [gameState]);

  useEffect(() => {
    if (!shouldShowGuide) return;
    const timer = setTimeout(hideGuide, 8000);
    return () => clearTimeout(timer);
  }, [shouldShowGuide, hideGuide]);

  const selectTool = tool => setCombat(state => ({...state, selectedToolId:tool.id}));
  const enhancedBiologicalShoot = () => setCombat(state => fireCombat(state, toolsRef.current.find(tool => tool.id === state.selectedToolId)));
  const useTool = enhancedBiologicalShoot;
  const handleMouseMove = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(20, Math.min(780, event.clientX - rect.left));
    setCombat(state => state.gameState === 'playing' ? {...state, playerShip:{...state.playerShip,x}} : state);
  };
  const handleTouchMove = event => {
    const touch = event.touches[0]; if (!touch) return;
    handleMouseMove({clientX:touch.clientX,currentTarget:event.currentTarget});
  };
  const handleMouseClick = enhancedBiologicalShoot;
  const handleTouchEnd = event => { event.preventDefault(); enhancedBiologicalShoot(); };
  const toggleRapidFire = () => setCombat(state => ({...state, rapidFire:!state.rapidFire}));
  const selectLocation = location => {
    const wave = createWave(1, location, bacteriaTypes);
    setCombat(startCombat(location, wave));
    trackGameModeStart('germ-buster', {location:location.id,difficulty});
  };
  const pauseGame = () => setCombat(state => ({...state,gameState:'paused',rapidFire:false}));
  const resumeGame = () => setCombat(state => ({...state,gameState:'playing'}));
  const restartGame = () => { setCombat(freshCombat()); setShowEducationalTip(false); };
  const nextWave = () => {
    const wave = currentWave < totalWaves ? createWave(currentWave+1,selectedLocation,bacteriaTypes) : [];
    setCombat(state => advanceCombat(state,wave));
  };

  return (
    <div className="min-h-screen bg-background game-screen">
      <Header />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Game Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Icon name="Gamepad2" size={24} color="white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-heading text-foreground">
                Germ Buster: Immune Defense
              </h1>
            </div>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Intuitive shooting action! Move your immune defender with arrow keys or mouse, and blast harmful bacteria with spacebar or click. Protect your body's natural balance!
            </p>
          </div>

          {/* Game Content */}
          {gameState === 'location-select' && (
            <>
              <BodyLocationSelector
                locations={bodyLocations}
                onSelectLocation={selectLocation}
                difficulty={difficulty}
                maxDifficulty={maxDifficulty}
                setDifficulty={setDifficulty}
              />
              {!isPremium && (
                <div className="mt-6 max-w-xl mx-auto rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #1a1030 0%, #2d1b69 50%, #1a1030 100%)', border: '1px solid rgba(139,92,246,0.4)' }}>
                  <div className="text-5xl mb-3">🔒</div>
                  <h3 className="font-heading text-lg text-white mb-2">Premium Game Mode</h3>
                  <p className="text-purple-200 text-sm mb-4">Germ Buster is part of MicrobeQuest Premium. Unlock all 6 game modules and 18 discoveries.</p>
                  <Link to="/premium">
                    <button className="px-6 py-3 rounded-xl font-bold text-gray-900 transition-all hover:opacity-90 hover:scale-105" style={{ backgroundColor: '#FFC107' }}>
                      Unlock the Full Adventure 🌻
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}

          {gameState === 'playing' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Game Board - Main Area */}
              <div className="lg:col-span-3 space-y-4">
                {/* Health & Balance Meters */}
                <HealthBalanceMeters
                  immuneHealth={immuneHealth}
                  bacterialBalance={bacterialBalance}
                  selectedLocation={selectedLocation}
                />

                {/* Wave Progress */}
                <WaveProgress
                  currentWave={currentWave}
                  totalWaves={totalWaves}
                  onPause={pauseGame}
                  onNextWave={nextWave}
                  waveActive={!combat.waveReady}
                  enemiesRemaining={bacteria.filter(b => b.type === 'bad').length}
                />

                {/* Enhanced Game Board with Intuitive Controls */}
                <GameBoard
                  location={selectedLocation}
                  bacteria={bacteria}
                  defenseTowers={defenseTowers}
                  selectedTool={selectedTool}
                  onUseTool={useTool}
                  onShoot={enhancedBiologicalShoot}
                  onMouseMove={handleMouseMove}
                  onMouseClick={handleMouseClick}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  projectiles={projectiles}
                  playerShip={playerShip}
                  gameState={gameState}
                  hitIndicators={hitIndicators}
                  rapidFire={rapidFire}
                />
              </div>

              {/* Side Panel */}
              <div className="space-y-4">
                {/* Score Display with Ammo Counter */}
                <ScoreDisplay
                  score={score}
                  defensePoints={defensePoints}
                  achievements={achievements}
                  ammoCount={ammoCount}
                />

                {/* Enhanced Defense Tools Panel */}
                <DefenseToolPanel
                  tools={defenseTools}
                  selectedTool={selectedTool}
                  defensePoints={defensePoints}
                  ammoCount={ammoCount}
                  onSelectTool={selectTool}
                  rapidFire={rapidFire}
                />

                {/* NEW: Intuitive Controls Panel */}
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-sm font-semibold">Immune Controls</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={pauseGame}
                        aria-label="Pause mission"
                        className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <Icon name="Pause" size={16} />
                      </button>
                      <button
                        onClick={restartGame}
                        aria-label="Restart mission"
                        className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/80 transition-colors"
                      >
                        <Icon name="RotateCcw" size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Control Instructions */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="ArrowLeft" size={12} />
                      <Icon name="ArrowRight" size={12} />
                      <span>Move Defender Left/Right</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-1 bg-muted rounded text-xs">SPACE</div>
                      <span>Shoot / Click to Fire</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Mouse" size={12} />
                      <span>Move mouse to control defender</span>
                    </div>
                  </div>

                  {/* Rapid Fire Toggle */}
                  <button
                    onClick={toggleRapidFire}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-colors ${
                      rapidFire
                        ? 'bg-red-100 text-red-800 border border-red-300' :'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name={rapidFire ? "Zap" : "ZapOff"} size={14} />
                        <span>Rapid Fire Mode</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        rapidFire ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {rapidFire ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </button>

                  {/* Ship Status */}
                  <div className="bg-muted/30 p-2 rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span>Defender Position:</span>
                      <span className="font-mono">{Math.round(playerShip?.x)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fire Rate:</span>
                      <span className="font-mono">{selectedTool?.cooldown || 150}ms</span>
                    </div>
                  </div>

                  <Link
                    to="/game-home-dashboard"
                    className="block w-full py-2 px-4 bg-primary text-primary-foreground rounded-button text-center font-body font-semibold text-sm hover:shadow-moderate transition-all duration-fast"
                  >
                    Back to Menu
                  </Link>
                </div>
              </div>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="text-center space-y-6">
              <div className="bg-card border border-border rounded-2xl p-8 max-w-md mx-auto">
                <Icon name="Pause" size={48} className="mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-heading text-foreground mb-4">Game Paused</h2>
                <div className="space-y-3">
                  <button
                    onClick={resumeGame}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-button font-body font-semibold"
                  >
                    Resume Game
                  </button>
                  <button
                    onClick={restartGame}
                        aria-label="Restart mission"
                    className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-button font-body font-semibold"
                  >
                    Restart Game
                  </button>
                  <Link
                    to="/game-home-dashboard"
                    className="block w-full py-3 px-4 bg-muted text-muted-foreground rounded-button font-body font-semibold text-center"
                  >
                    Back to Menu
                  </Link>
                </div>
              </div>
            </div>
          )}

          {(gameState === 'game-over' || gameState === 'victory') && (
            <GameOverScreen
              isVictory={gameState === 'victory'}
              score={score}
              achievements={achievements}
              selectedLocation={selectedLocation}
              onRestart={restartGame}
              onBackToMenu={restartGame}
            />
          )}
        </div>
      </main>
      {/* Character Guide */}
      <CharacterGuide
        character="aunt-juju"
        message={getCharacterMessage()}
        emotion="encouraging"
        position="bottom-right"
        isVisible={shouldShowGuide}
        onClose={hideGuide}
        showHint={true}
        hintText={getCharacterHint()}
      />
      {/* Educational Tips Modal */}
      <EducationalTips
        isVisible={showEducationalTip}
        tip={currentTip}
        onClose={() => setShowEducationalTip(false)}
      />
    </div>
  );

  function getCharacterMessage() {
    switch (gameState) {
      case 'location-select':
        return "Get ready for intuitive defense action! This simple shooting gameplay lets you move your immune defender and shoot straight up at harmful bacteria!";
      case 'playing':
        return rapidFire
          ? "Rapid Fire activated! Hold down spacebar or click repeatedly to unleash a barrage of immune responses!"
          : "Use arrow keys or mouse to move, spacebar or click to shoot! Simple and intuitive controls for defending your body!";
      case 'paused':
        return "Master the art of immune defense! Use simple controls for maximum bacteria-busting efficiency!";
      case 'victory':
        return "Excellent immune defense skills! You've mastered the art of protecting your body from harmful bacteria!";
      case 'game-over':
        return "Keep practicing those defense reflexes! Move, aim, and shoot with precision to protect your health!";
      default:
        return "Experience intuitive immune defense - simple shooting mechanics with important educational bacteria knowledge!";
    }
  }

  function getCharacterHint() {
    switch (gameState) {
      case 'location-select':
        return "Simple and effective controls: Move with arrows, shoot with spacebar - easy to learn!";
      case 'playing':
        if (rapidFire) {
          return "Rapid Fire is blazing! Watch your ammo count and aim for the harmful bacteria!";
        }
        return "Pro tip: Lead your targets! Bacteria move horizontally, so position yourself accordingly!";
      default:
        return "Master the intuitive controls - smooth movement and precise timing are key to immune defense!";
    }
  }
};

export default GermBusterTowerDefense;