import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Star, ArrowRight, Lightbulb, Minus, Plus } from 'lucide-react';

const MiniGame = ({ id, eventData, onComplete, onClose }) => {
  const [gameState, setGameState] = useState('instructions');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameData, setGameData] = useState({});
  const [showHint, setShowHint] = useState(false);
  
  // Microscope focus game specific state
  const [focusLevel, setFocusLevel] = useState(0);
  const [targetFocus, setTargetFocus] = useState(50);
  
  // Bacteria drawing game specific state
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [requiredShapes, setRequiredShapes] = useState(['rod', 'sphere', 'spiral']);

  // Initialize game-specific data
  useEffect(() => {
    initializeGame(id);
  }, [id]);

  const initializeGame = (gameId) => {
    const games = {
      'microscope-focus': {
        title: 'Focus the Microscope',
        instructions: 'Help Leeuwenhoek focus his microscope to see the "animalcules"! Adjust the focus to make the image sharp and clear.',
        task: 'Click the focus buttons to adjust the image clarity',
        correctFocus: 50,
        hint: 'Try moving the focus slider slowly and watch how the image changes!'
      },
      'bacteria-drawing': {
        title: 'Draw the Bacteria',
        instructions: 'Match the bacterial shapes that Leeuwenhoek observed: rods, spheres, and spirals.',
        task: 'Click on the correct bacterial shapes',
        shapes: ['rod', 'sphere', 'spiral'],
        hint: 'Look for three different shapes: like a stick, a ball, and a corkscrew!'
      },
      'vaccination-timeline': {
        title: 'Vaccination Timeline',
        instructions: 'Help Jenner understand how vaccination works! Place the steps in the correct order.',
        task: 'Arrange the vaccination steps in order',
        steps: [
          'Extract cowpox from milkmaid',
          'Inject cowpox into patient',
          'Patient develops immunity',
          'Patient protected from smallpox'
        ],
        hint: 'Think about the process: First get the cowpox, then give it to the patient!'
      },
      'swan-flask-experiment': {
        title: 'Swan Flask Experiment',
        instructions: 'Recreate Pasteur\'s famous experiment! The curved neck prevents microbes from entering.',
        task: 'Observe what happens in different flask conditions',
        hint: 'Microbes can\'t fly up the curved neck - gravity pulls them down!'
      },
      'outbreak-mapping': {
        title: 'Map the Cholera Outbreak',
        instructions: 'Help Dr. Snow find the contaminated water pump by mapping where sick people live.',
        task: 'Click on the map to mark sick households',
        hint: 'Look for clusters of illness near a single water source!'
      },
      'operating-room-cleaning': {
        title: 'Operating Room Hygiene',
        instructions: 'Help Lister clean the operating room to prevent infections!',
        task: 'Click on all the dirty items to clean them',
        itemsToClean: 8,
        hint: 'Make sure to clean surgical tools, tables, and floors!'
      },
      'kochs-postulates': {
        title: 'Koch\'s Postulates',
        instructions: 'Follow Koch\'s four steps to prove a microbe causes disease.',
        task: 'Complete each postulate in order',
        steps: [
          'Find microbe in sick animals',
          'Grow microbe in pure culture',
          'Infect healthy animal',
          'Find same microbe in new sick animal'
        ],
        hint: 'Each step proves the microbe causes the disease!'
      },
      'pasteur-laboratory': {
        title: 'Pasteur\'s Laboratory',
        instructions: 'Help Pasteur develop the rabies vaccine by conducting experiments!',
        task: 'Complete the laboratory procedures',
        hint: 'Careful experimentation saves lives!'
      },
      'petri-dish-detective': {
        title: 'Petri Dish Detective',
        instructions: 'Identify which colonies are bacteria and which are fungi in Petri dishes.',
        task: 'Click on bacterial colonies',
        hint: 'Bacteria are usually smaller and smoother than fuzzy fungal colonies!'
      },
      'microscope-comparison': {
        title: 'Microscope Evolution',
        instructions: 'Compare microscopes from different eras and see how they improved!',
        task: 'Match each microscope to its era',
        hint: 'Older microscopes are simpler, newer ones are more complex!'
      },
      'antibiotic-assembly': {
        title: 'Discover Penicillin',
        instructions: 'Help Fleming discover how mold kills bacteria!',
        task: 'Observe the clear zone around the mold',
        hint: 'The bacteria can\'t grow near the mold - it\'s making something that kills them!'
      },
      'dna-building': {
        title: 'Build DNA Structure',
        instructions: 'Help Watson and Crick build the double helix!',
        task: 'Connect the base pairs correctly',
        pairs: [
          { base1: 'A', base2: 'T' },
          { base1: 'C', base2: 'G' }
        ],
        hint: 'A always pairs with T, C always pairs with G!'
      },
      'double-helix-building': {
        title: 'Double Helix Structure',
        instructions: 'Assemble the famous double helix structure of DNA.',
        task: 'Twist the DNA strands together',
        hint: 'The two strands spiral around each other like a twisted ladder!'
      },
      'gene-splicing': {
        title: 'Gene Splicing',
        instructions: 'Cut and paste DNA to create recombinant DNA technology!',
        task: 'Move gene segments correctly',
        hint: 'Scientists can move genes from one organism to another!'
      },
      'virus-hunter': {
        title: 'Hunt the Virus',
        instructions: 'Find and identify viruses that are much smaller than bacteria!',
        task: 'Spot all the viruses',
        hint: 'Viruses are tiny and have different shapes - some look like spaceships!'
      },
      'dna-copying': {
        title: 'PCR - Copy DNA',
        instructions: 'Use PCR to make millions of copies of DNA!',
        task: 'Complete the copying cycles',
        hint: 'Heat separates DNA, cool lets it copy - repeat many times!'
      },
      'microbiome-explorer': {
        title: 'Explore Your Microbiome',
        instructions: 'Discover the trillions of helpful bacteria living in your body!',
        task: 'Find beneficial microbes',
        hint: 'Most bacteria in our body are helpful, not harmful!'
      },
      'gene-editor': {
        title: 'CRISPR Gene Editing',
        instructions: 'Use CRISPR like molecular scissors to edit genes!',
        task: 'Cut and edit the gene sequence',
        hint: 'CRISPR can fix broken genes or remove disease-causing mutations!'
      },
      'vaccine-development': {
        title: 'mRNA Vaccine Development',
        instructions: 'Learn how modern mRNA vaccines work!',
        task: 'Assemble the vaccine components',
        hint: 'mRNA teaches your cells to make a protein that triggers immunity!'
      },
      'meet-your-microbes': {
        title: 'Meet Your Microbes',
        instructions: 'Learn about the good bacteria that help keep you healthy!',
        task: 'Match microbes to their helpful roles',
        hint: 'Gut bacteria help digest food, skin bacteria protect from bad germs!'
      }
    };

    setGameData(games?.[gameId] || games?.['microscope-focus']);
  };

  // Generic mini-game logic for clicking/matching activities
  const handleGameAction = () => {
    setAttempts(attempts + 1);
    const success = Math.random() > 0.3; // 70% success rate for demo
    
    if (success) {
      setScore(score + eventData?.points || 10);
      setGameState('success');
      setTimeout(() => {
        onComplete({
          eventId: eventData?.id,
          score: score + (eventData?.points || 10),
          perfect: attempts === 0
        });
      }, 2000);
    } else {
      setGameState('try-again');
      setTimeout(() => setGameState('playing'), 1500);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setAttempts(0);
    
    // Initialize microscope focus game
    if (id === 'microscope-focus') {
      setFocusLevel(0);
      setTargetFocus(45 + Math.floor(Math.random() * 10)); // Random target between 45-55
    }
    
    // Initialize bacteria drawing game
    if (id === 'bacteria-drawing') {
      setSelectedShapes([]);
      setRequiredShapes(['rod', 'sphere', 'spiral']);
    }
  };

  // Microscope focus game handlers
  const adjustFocus = (direction) => {
    setFocusLevel(prev => {
      const newLevel = direction === 'up' ? Math.min(prev + 5, 100) : Math.max(prev - 5, 0);
      return newLevel;
    });
  };

  const checkFocus = () => {
    setAttempts(attempts + 1);
    const difference = Math.abs(focusLevel - targetFocus);
    
    if (difference <= 10) {
      // Success! Within acceptable range
      setScore(score + eventData?.points || 25);
      setGameState('success');
      setTimeout(() => {
        onComplete({
          eventId: eventData?.id,
          score: score + (eventData?.points || 25),
          perfect: attempts === 0
        });
      }, 2000);
    } else {
      // Try again
      setGameState('try-again');
      setTimeout(() => setGameState('playing'), 1500);
    }
  };

  // Calculate blur amount based on focus level
  const getBlurAmount = () => {
    const difference = Math.abs(focusLevel - targetFocus);
    return Math.min(difference / 2, 20); // Max blur of 20px
  };
  
  // Bacteria drawing game handlers
  const toggleShapeSelection = (shape) => {
    setSelectedShapes(prev => {
      if (prev?.includes(shape)) {
        return prev?.filter(s => s !== shape);
      } else {
        return [...prev, shape];
      }
    });
  };
  
  const checkBacteriaDrawing = () => {
    setAttempts(attempts + 1);
    
    // Check if all required shapes are selected
    const allSelected = requiredShapes?.every(shape => selectedShapes?.includes(shape));
    const noExtras = selectedShapes?.length === requiredShapes?.length;
    
    if (allSelected && noExtras) {
      // Success!
      setScore(score + eventData?.points || 30);
      setGameState('success');
      setTimeout(() => {
        onComplete({
          eventId: eventData?.id,
          score: score + (eventData?.points || 30),
          perfect: attempts === 0
        });
      }, 2000);
    } else {
      // Try again
      setGameState('try-again');
      setTimeout(() => setGameState('playing'), 1500);
    }
  };

  // Render different animalcule shapes
  const renderAnimalcule = (type, size = 'medium') => {
    const sizeClasses = {
      small: 'w-8 h-8',
      medium: 'w-12 h-12',
      large: 'w-16 h-16'
    };

    const shapes = {
      rod: (
        <svg className={sizeClasses?.[size]} viewBox="0 0 100 100" fill="none">
          <rect x="30" y="20" width="40" height="60" rx="20" fill="#10b981" stroke="#059669" strokeWidth="3" />
        </svg>
      ),
      sphere: (
        <svg className={sizeClasses?.[size]} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="35" fill="#3b82f6" stroke="#2563eb" strokeWidth="3" />
        </svg>
      ),
      spiral: (
        <svg className={sizeClasses?.[size]} viewBox="0 0 100 100" fill="none">
          <path
            d="M 30 50 Q 40 30, 50 50 T 70 50"
            stroke="#a855f7"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 30 50 Q 40 70, 50 50 T 70 50"
            stroke="#9333ea"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ),
      cluster: (
        <svg className={sizeClasses?.[size]} viewBox="0 0 100 100" fill="none">
          <circle cx="40" cy="40" r="18" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <circle cx="60" cy="40" r="18" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <circle cx="50" cy="60" r="18" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        </svg>
      )
    };

    return shapes?.[type] || shapes?.sphere;
  };

  // Render realistic microscope observation shapes (different from selection buttons)
  const renderMicroscopeObservation = (type, size = 'large') => {
    const sizeClasses = {
      small: 'w-12 h-12',
      medium: 'w-16 h-16',
      large: 'w-24 h-24'
    };

    const microscopeShapes = {
      rod: (
        <svg className={sizeClasses?.[size]} viewBox="0 0 120 120" fill="none">
          {/* Realistic rod bacteria - elongated, slightly curved, darker */}
          <defs>
            <filter id="microscope-grain-rod">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" />
              <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
            </filter>
          </defs>
          <ellipse cx="60" cy="60" rx="12" ry="38" fill="#1a5c3a" opacity="0.85" filter="url(#microscope-grain-rod)" />
          <ellipse cx="58" cy="58" rx="10" ry="36" fill="#2d7a4f" opacity="0.7" />
          <path d="M 58 25 Q 56 40, 58 60 T 58 95" stroke="#0f3d26" strokeWidth="2" opacity="0.6" fill="none" />
          {/* Add some irregular edges for realism */}
          <ellipse cx="58" cy="30" rx="8" ry="6" fill="#1a5c3a" opacity="0.5" />
          <ellipse cx="58" cy="90" rx="8" ry="6" fill="#1a5c3a" opacity="0.5" />
        </svg>
      ),
      sphere: (
        <svg className={sizeClasses?.[size]} viewBox="0 0 120 120" fill="none">
          {/* Realistic sphere bacteria - darker, with depth and texture */}
          <defs>
            <filter id="microscope-grain-sphere">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" />
              <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
            </filter>
            <radialGradient id="sphere-gradient">
              <stop offset="0%" stopColor="#1e4a7a" />
              <stop offset="70%" stopColor="#0f2d4d" />
              <stop offset="100%" stopColor="#081829" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="32" fill="url(#sphere-gradient)" opacity="0.9" filter="url(#microscope-grain-sphere)" />
          <circle cx="60" cy="60" r="28" fill="#1e4a7a" opacity="0.6" />
          {/* Highlight for 3D effect */}
          <ellipse cx="52" cy="52" rx="12" ry="10" fill="#3b6fa8" opacity="0.4" />
          {/* Dark edge */}
          <circle cx="60" cy="60" r="32" stroke="#051220" strokeWidth="2" fill="none" opacity="0.7" />
        </svg>
      ),
      spiral: (
        <svg className={sizeClasses?.[size]} viewBox="0 0 120 120" fill="none">
          {/* Realistic spiral bacteria - hand-drawn look, darker purple/gray */}
          <defs>
            <filter id="microscope-grain-spiral">
              <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="5" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" />
              <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
            </filter>
          </defs>
          {/* Multiple overlapping spirals for organic look */}
          <path
            d="M 25 60 Q 35 40, 45 60 T 65 60 T 85 60 T 95 60"
            stroke="#4a1f5c"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
            filter="url(#microscope-grain-spiral)"
          />
          <path
            d="M 25 60 Q 35 75, 45 60 T 65 60 T 85 60 T 95 60"
            stroke="#3d1a4a"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Add irregular thickness variations */}
          <path
            d="M 30 60 Q 38 45, 45 60"
            stroke="#2a1235"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 70 60 Q 78 50, 85 60"
            stroke="#2a1235"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      )
    };

    return microscopeShapes?.[type] || microscopeShapes?.sphere;
  };

  // Render microscope focus game
  const renderMicroscopeFocusGame = () => (
    <div className="space-y-6">
      {/* Microscope Viewport */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-amber-700 rounded-2xl p-6 shadow-2xl">
        <div className="bg-black rounded-xl overflow-hidden border-4 border-gray-700 relative" style={{ height: '400px' }}>
          {/* Microscope view circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-80 bg-gradient-radial from-gray-100 via-gray-200 to-gray-400 rounded-full border-8 border-black shadow-inner">
              {/* Animalcules with blur effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  filter: `blur(${getBlurAmount()}px)`,
                  transition: 'filter 0.3s ease'
                }}
              >
                {/* Multiple animalcules with different shapes */}
                <motion.div
                  animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-1/4 left-1/4"
                >
                  {renderAnimalcule('rod', 'medium')}
                </motion.div>
                <motion.div
                  animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-1/3 right-1/4"
                >
                  {renderAnimalcule('sphere', 'small')}
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0], y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-1/3 left-1/3"
                >
                  {renderAnimalcule('spiral', 'large')}
                </motion.div>
                <motion.div
                  animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-1/4 right-1/3"
                >
                  {renderAnimalcule('sphere', 'medium')}
                </motion.div>
                <motion.div
                  animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  {renderAnimalcule('cluster', 'large')}
                </motion.div>
                <motion.div
                  animate={{ x: [0, -10, 0], y: [0, -20, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-1/4 right-1/3"
                >
                  {renderAnimalcule('rod', 'small')}
                </motion.div>
                <motion.div
                  animate={{ x: [0, 25, 0], y: [0, 10, 0] }}
                  transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-1/4 left-1/4"
                >
                  {renderAnimalcule('spiral', 'small')}
                </motion.div>
              </motion.div>
              
              {/* Focus indicator */}
              {getBlurAmount() <= 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                >
                  In Focus!
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Focus Controls */}
      <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-2 border-amber-600/50 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-white text-center mb-4">Focus Controls</h3>
        
        {/* Focus Level Display */}
        <div className="bg-black/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Focus Level:</span>
            <span className="text-white font-bold text-lg">{focusLevel}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${focusLevel}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Focus Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => adjustFocus('down')}
            className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Minus className="w-6 h-6" />
            Decrease Focus
          </button>
          
          <button
            onClick={() => adjustFocus('up')}
            className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="w-6 h-6" />
            Increase Focus
          </button>
        </div>

        {/* Check Focus Button */}
        <button
          onClick={checkFocus}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
        >
          Check Focus
        </button>

        {/* Hint */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-1" />
              <p className="text-yellow-200">{gameData?.hint}</p>
            </div>
          </motion.div>
        )}

        <button
          onClick={() => setShowHint(!showHint)}
          className="text-yellow-300 hover:text-yellow-200 text-sm flex items-center gap-2 mx-auto"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
      </div>

      {/* Progress Info */}
      <div className="flex items-center justify-between text-white/70">
        <span>Attempts: {attempts}</span>
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-300" />
          Potential Points: {eventData?.points}
        </span>
      </div>
    </div>
  );

  // Render bacteria drawing game
  const renderBacteriaDrawingGame = () => (
    <div className="space-y-6">
      {/* Reference Panel - Shapes to Observe */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-amber-700 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-amber-400 text-center mb-4">
          🔬 Microscope View - 1683
        </h3>
        <p className="text-amber-200 text-center mb-6 font-semibold">
          Study these bacterial shapes through Leeuwenhoek's microscope:
        </p>
        
        {/* Microscope viewport with realistic observations */}
        <div className="bg-black rounded-xl p-8 border-4 border-gray-700 shadow-inner">
          <div className="bg-gradient-radial from-gray-700 via-gray-800 to-black rounded-full w-full aspect-square max-w-md mx-auto border-8 border-gray-900 shadow-2xl relative overflow-hidden">
            {/* Microscope grain/noise overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" /%3E%3C/svg%3E")',
              backgroundSize: 'cover'
            }} />
            
            {/* Display realistic microscope observations */}
            <div className="grid grid-cols-3 gap-4 p-8 relative z-10">
              {/* Rod Shape Observation */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-gray-800/50 rounded-lg p-4 border-2 border-gray-600">
                  {renderMicroscopeObservation('rod', 'large')}
                </div>
                <span className="text-gray-400 text-xs font-bold">Elongated</span>
              </div>
              
              {/* Sphere Shape Observation */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-gray-800/50 rounded-lg p-4 border-2 border-gray-600">
                  {renderMicroscopeObservation('sphere', 'large')}
                </div>
                <span className="text-gray-400 text-xs font-bold">Round</span>
              </div>
              
              {/* Spiral Shape Observation */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-gray-800/50 rounded-lg p-4 border-2 border-gray-600">
                  {renderMicroscopeObservation('spiral', 'large')}
                </div>
                <span className="text-gray-400 text-xs font-bold">Twisted</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-900/50 border-2 border-amber-600 rounded-lg p-3 mt-4">
          <p className="text-amber-200 text-center font-bold text-sm">
            📝 These are real microscope observations - now identify which shapes match below!
          </p>
        </div>
      </div>

      {/* Selection Area */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-4 border-purple-600 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white text-center mb-6">
          ✏️ Select the Bacterial Shapes You Observed
        </h3>
        
        <div className="bg-black/30 rounded-xl p-6 border-2 border-purple-400 min-h-[300px]">
          <p className="text-purple-200 text-center mb-6 font-semibold">
            Click on each bacterial shape that matches what Leeuwenhoek observed:
          </p>
          
          {/* Display bacterial shapes for selection */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Rod Shape */}
            <motion.button
              onClick={() => toggleShapeSelection('rod')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative bg-gradient-to-br from-green-900/50 to-green-800/50 border-4 rounded-xl p-6 transition-all ${
                selectedShapes?.includes('rod')
                  ? 'border-green-400 shadow-lg shadow-green-500/50 bg-green-700/70' :'border-green-600 hover:border-green-400'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  {renderAnimalcule('rod', 'large')}
                </div>
                <span className="font-bold text-green-200">Rod Shape</span>
              </div>
              {selectedShapes?.includes('rod') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              )}
            </motion.button>
            
            {/* Sphere Shape */}
            <motion.button
              onClick={() => toggleShapeSelection('sphere')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-4 rounded-xl p-6 transition-all ${
                selectedShapes?.includes('sphere')
                  ? 'border-blue-400 shadow-lg shadow-blue-500/50 bg-blue-700/70' :'border-blue-600 hover:border-blue-400'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  {renderAnimalcule('sphere', 'large')}
                </div>
                <span className="font-bold text-blue-200">Sphere Shape</span>
              </div>
              {selectedShapes?.includes('sphere') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              )}
            </motion.button>
            
            {/* Spiral Shape */}
            <motion.button
              onClick={() => toggleShapeSelection('spiral')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-4 rounded-xl p-6 transition-all ${
                selectedShapes?.includes('spiral')
                  ? 'border-purple-400 shadow-lg shadow-purple-500/50 bg-purple-700/70' :'border-purple-600 hover:border-purple-400'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  {renderAnimalcule('spiral', 'large')}
                </div>
                <span className="font-bold text-purple-200">Spiral Shape</span>
              </div>
              {selectedShapes?.includes('spiral') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              )}
            </motion.button>
          </div>
          
          {/* Selection Status */}
          <div className="bg-purple-700/50 border-2 border-purple-400 rounded-lg p-4">
            <p className="text-purple-100 text-center font-semibold">
              Selected: {selectedShapes?.length} of {requiredShapes?.length} shapes
            </p>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        onClick={checkBacteriaDrawing}
        disabled={selectedShapes?.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
      >
        Submit Observations
      </button>
      
      {/* Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-1" />
            <p className="text-yellow-200">{gameData?.hint}</p>
          </div>
        </motion.div>
      )}
      
      <button
        onClick={() => setShowHint(!showHint)}
        className="text-yellow-300 hover:text-yellow-200 text-sm flex items-center gap-2 mx-auto"
      >
        <Lightbulb className="w-4 h-4" />
        {showHint ? 'Hide Hint' : 'Need a Hint?'}
      </button>
      
      {/* Progress Info */}
      <div className="flex items-center justify-between text-white/70">
        <span>Attempts: {attempts}</span>
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-300" />
          Potential Points: {eventData?.points}
        </span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Game Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{gameData?.title}</h2>
            <div className="flex items-center justify-center gap-4 text-white/80">
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300" />
                {eventData?.year}
              </span>
              <span>•</span>
              <span>{eventData?.scientist}</span>
            </div>
          </div>

          {/* Game Content */}
          <div className="p-8">
            {gameState === 'instructions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">How to Play</h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-4">
                    {gameData?.instructions}
                  </p>
                  <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                    <p className="text-yellow-200 font-semibold">
                      Task: {gameData?.task}
                    </p>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-3 mx-auto"
                >
                  Start Mini-Game
                  <ArrowRight className="w-6 h-6" />
                </button>

                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Earn {eventData?.points} points for completing this activity!</span>
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {id === 'microscope-focus' ? (
                  renderMicroscopeFocusGame()
                ) : id === 'bacteria-drawing' ? (
                  renderBacteriaDrawingGame()
                ) : (
                  // Generic game for other activities
                  (<div className="space-y-6">
                    <div className="bg-white/5 border-2 border-white/20 rounded-xl p-12 min-h-[400px] flex flex-col items-center justify-center">
                      <div className="text-center space-y-6">
                        <div className="text-6xl mb-6">
                          {id?.includes('bacteria') || id?.includes('microbe') ? '🦠' :
                           id?.includes('dna') || id?.includes('gene') ? '🧬' :
                           id?.includes('vaccine') ? '💉' :
                           id?.includes('virus') ? '🦠' : '🔬'}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white">{gameData?.task}</h3>
                        
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 rounded-xl p-8">
                            <p className="text-white/90 mb-6">
                              {gameData?.instructions}
                            </p>
                            
                            <button
                              onClick={handleGameAction}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
                            >
                              Complete Activity
                            </button>
                          </div>
                          
                          {showHint && gameData?.hint && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4"
                            >
                              <div className="flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-1" />
                                <p className="text-yellow-200">{gameData?.hint}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="text-yellow-300 hover:text-yellow-200 text-sm flex items-center gap-2 mx-auto"
                        >
                          <Lightbulb className="w-4 h-4" />
                          {showHint ? 'Hide Hint' : 'Need a Hint?'}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Attempts: {attempts}</span>
                      <span className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-300" />
                        Potential Points: {eventData?.points}
                      </span>
                    </div>
                  </div>)
                )}
              </motion.div>
            )}

            {gameState === 'try-again' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="bg-orange-500/20 border-2 border-orange-400/50 rounded-xl p-8">
                  <div className="text-6xl mb-4">🔄</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Almost There!</h3>
                  <p className="text-white/80 text-lg">
                    {id === 'microscope-focus' ?'The image is still blurry. Try adjusting the focus more!' :'Keep trying - science takes practice and patience!'}
                  </p>
                </div>
              </motion.div>
            )}

            {gameState === 'success' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="bg-green-500/20 border-2 border-green-400/50 rounded-xl p-8">
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="inline-block mb-4"
                  >
                    <CheckCircle className="w-24 h-24 text-green-400" />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3">Success!</h3>
                  <p className="text-white/90 text-lg mb-6">
                    {id === 'microscope-focus' ?'Perfect focus! You can now see the animalcules clearly!' : `You've completed ${eventData?.title}!`}
                  </p>
                  
                  <div className="bg-white/10 rounded-lg p-4 inline-block">
                    <div className="flex items-center gap-3 text-yellow-300">
                      <Star className="w-8 h-8" />
                      <span className="text-3xl font-bold">+{eventData?.points}</span>
                      <span className="text-xl">points</span>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">
                      <strong>Fun Fact:</strong> {eventData?.fact}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 p-4 text-center">
            <p className="text-white/60 text-sm">
              Historical Event: {eventData?.year} • {eventData?.scientist}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniGame;
