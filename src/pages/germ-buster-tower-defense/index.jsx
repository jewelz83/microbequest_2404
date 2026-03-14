import React, { useState, useEffect } from 'react';
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

const GermBusterTowerDefense = () => {
  // Game state
  const [gameState, setGameState] = useState('location-select'); // location-select, playing, paused, game-over, victory
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [currentWave, setCurrentWave] = useState(1);
  const [totalWaves, setTotalWaves] = useState(3);
  const [immuneHealth, setImmuneHealth] = useState(100);
  const [bacterialBalance, setBacterialBalance] = useState(80); // Percentage of good bacteria
  const [score, setScore] = useState(0);
  const [defensePoints, setDefensePoints] = useState(100);
  
  // Game entities
  const [bacteria, setBacteria] = useState([]);
  const [defenseTowers, setDefenseTowers] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [projectiles, setProjectiles] = useState([]); // New: Track projectiles in flight
  
  // NEW: Galaga-style player ship state
  const [playerShip, setPlayerShip] = useState({
    x: 400, // Center of game board
    y: 350, // Near bottom
    width: 40,
    height: 30,
    speed: 8, // Movement speed
    isMovingLeft: false,
    isMovingRight: false,
    isShooting: false,
    lastShotTime: 0,
    fireRate: 150 // Milliseconds between shots
  });
  
  // NEW: Keyboard controls state
  const [keysPressed, setKeysPressed] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    Enter: false
  });
  
  // UI state
  const { shouldShowGuide, hideGuide } = useGuideVisibility('germ-buster-tower-defense');
  const [showEducationalTip, setShowEducationalTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [ammoCount, setAmmoCount] = useState({ // New: Ammo tracking
    antibiotic: 25,
    probiotic: 30,
    immuneCell: 20,
    hygiene: 40,
    antiseptic: 15 // New ammo type
  });

  // Simplified aiming system state - removed complex targeting
  const [rapidFire, setRapidFire] = useState(false); // Auto-fire mode
  const [hitIndicators, setHitIndicators] = useState([]); // Damage number displays
  const [muzzleFlash, setMuzzleFlash] = useState(null); // Enhanced visual launch effects

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

  // NEW: Keyboard event handlers for intuitive controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameState !== 'playing') return;
      
      event?.preventDefault();
      setKeysPressed(prev => ({
        ...prev,
        [event?.code]: true
      }));
    };

    const handleKeyUp = (event) => {
      if (gameState !== 'playing') return;
      
      event?.preventDefault();
      setKeysPressed(prev => ({
        ...prev,
        [event?.code]: false
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // NEW: Mouse event handlers for intuitive controls
  const handleMouseMove = (event) => {
    if (gameState !== 'playing') return;
    
    const rect = event?.currentTarget?.getBoundingClientRect();
    const mouseX = event?.clientX - rect?.left;
    
    setPlayerShip(prev => ({
      ...prev,
      x: Math.max(20, Math.min(780, mouseX))
    }));
  };

  const handleMouseClick = (event) => {
    if (gameState !== 'playing') return;
    
    enhancedBiologicalShoot(playerShip?.x, playerShip?.y);
  };

  // NEW: Toggle rapid fire mode
  const toggleRapidFire = () => {
    setRapidFire(prev => !prev);
  };

  // NEW: Player ship movement and shooting system
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update player ship position
      setPlayerShip(prev => {
        let newX = prev?.x;
        
        // Handle movement
        if (keysPressed?.ArrowLeft || keysPressed?.KeyA) {
          newX = Math.max(20, prev?.x - prev?.speed);
        }
        if (keysPressed?.ArrowRight || keysPressed?.KeyD) {
          newX = Math.min(780, prev?.x + prev?.speed);
        }
        
        // Handle shooting
        const currentTime = Date.now();
        const canShoot = currentTime - prev?.lastShotTime >= prev?.fireRate;
        const shouldShoot = (keysPressed?.Space || keysPressed?.Enter || rapidFire) && canShoot;
        
        if (shouldShoot && selectedTool?.isShootable && ammoCount?.[selectedTool?.ammoType] > 0) {
          // Fire projectile straight up from ship position
          immuneShoot(newX, prev?.y);
          return {
            ...prev,
            x: newX,
            lastShotTime: currentTime
          };
        }
        
        return {
          ...prev,
          x: newX
        };
      });
    }, 16); // ~60 FPS game loop

    return () => clearInterval(gameLoop);
  }, [gameState, keysPressed, selectedTool, ammoCount, rapidFire]);

  // NEW: Immune system shooting function - shoots straight up
  const immuneShoot = (shipX, shipY) => {
    if (!selectedTool || !selectedTool?.isShootable || ammoCount?.[selectedTool?.ammoType] <= 0) return;
    if (defensePoints < selectedTool?.cost) return;

    // Create projectile that shoots straight up from ship
    const newProjectile = {
      id: Date.now() + Math.random(),
      x: shipX,
      y: shipY - 20, // Start slightly above ship
      angle: -Math.PI / 2, // Straight up
      speed: selectedTool?.projectileSpeed || 12,
      color: selectedTool?.projectileColor,
      size: selectedTool?.projectileSize,
      toolId: selectedTool?.id,
      isHoming: selectedTool?.isHoming,
      isAreaEffect: selectedTool?.isAreaEffect,
      biologicalStyle: true // Mark as biological-style projectile
    };

    setProjectiles(prev => [...prev, newProjectile]);
    
    // Consume ammo and defense points
    setAmmoCount(prev => ({
      ...prev,
      [selectedTool?.ammoType]: prev?.[selectedTool?.ammoType] - 1
    }));
    setDefensePoints(prev => prev - selectedTool?.cost);

    // Add shooting cooldown for tool
    const currentTool = selectedTool;
    setSelectedTool({ ...selectedTool, onCooldown: true });
    setTimeout(() => {
      setSelectedTool(prev => prev?.id === currentTool?.id ? { ...prev, onCooldown: false } : prev);
    }, selectedTool?.cooldown || 100);
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

  // Updated projectile animation with biological movement
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setProjectiles(prev => {
        return prev?.map(projectile => {
          let newX = projectile?.x;
          let newY = projectile?.y;
          
          // Biological-style: most projectiles go straight up initially
          if (projectile?.biologicalStyle) {
            if (projectile?.isSpreadShot) {
              // Spread shot projectiles fan out slightly
              const spreadAngle = projectile?.spreadIndex * 0.3 - 0.3; // -0.3, 0, 0.3 radians
              newX += Math.sin(spreadAngle) * projectile?.speed * 0.5;
              newY += Math.cos(spreadAngle) * projectile?.speed;
            } else if (projectile?.isHoming && projectile?.y < 300) {
              // Homing missiles start straight, then home in
              const nearestBadBacterium = bacteria?.filter(b => 
                b?.type === 'bad' && b?.isAlive && b?.spawnDelay <= 0
              )?.reduce((nearest, current) => {
                if (!nearest) return current;
                const currentDist = Math.sqrt(Math.pow(current?.x - projectile?.x, 2) + Math.pow(current?.y - projectile?.y, 2));
                const nearestDist = Math.sqrt(Math.pow(nearest?.x - projectile?.x, 2) + Math.pow(nearest?.y - projectile?.y, 2));
                return currentDist < nearestDist ? current : nearest;
              }, null);

              if (nearestBadBacterium) {
                const angle = Math.atan2(nearestBadBacterium?.y - projectile?.y, nearestBadBacterium?.x - projectile?.x);
                newX += Math.cos(angle) * projectile?.speed;
                newY += Math.sin(angle) * projectile?.speed;
              } else {
                newY -= projectile?.speed; // Continue straight up
              }
            } else {
              // Most projectiles just go straight up
              newY -= projectile?.speed;
            }
          } else {
            // Legacy projectile movement (for backwards compatibility)
            newX += Math.cos(projectile?.angle) * projectile?.speed;
            newY += Math.sin(projectile?.angle) * projectile?.speed;
          }

          // Check collision with bacteria
          const hitBacterium = bacteria?.find(bacterium => {
            if (!bacterium?.isAlive || bacterium?.spawnDelay > 0) return false;
            const distance = Math.sqrt(Math.pow(bacterium?.x - newX, 2) + Math.pow(bacterium?.y - newY, 2));
            return distance < 25; // Collision threshold
          });

          if (hitBacterium) {
            // Apply projectile effect
            handleProjectileHit(projectile, hitBacterium);
            return { ...projectile, shouldRemove: true };
          }

          // Remove projectiles that go off-screen
          if (newX > 850 || newX < -50 || newY > 450 || newY < -50) {
            return { ...projectile, shouldRemove: true };
          }

          return { ...projectile, x: newX, y: newY };
        })?.filter(projectile => !projectile?.shouldRemove);
      });
    }, 16); // Smooth 60fps projectile animation

    return () => clearInterval(interval);
  }, [gameState, bacteria]);

  // Game initialization
  useEffect(() => {
    if (gameState === 'playing' && selectedLocation) {
      initializeGameForLocation(selectedLocation);
    }
  }, [gameState, selectedLocation]);

  // Auto-hide character guide after 8 seconds
  useEffect(() => {
    if (!shouldShowGuide) return;
    const timer = setTimeout(() => {
      hideGuide();
    }, 8000);
    return () => clearTimeout(timer);
  }, [shouldShowGuide, hideGuide]);

  // Updated tool selection for Galaga-style gameplay
  const selectTool = (tool) => {
    if (defensePoints >= tool?.cost && ammoCount?.[tool?.ammoType] > 0) {
      setSelectedTool(tool);
    }
  };

  // NEW: Handle spread shot - fires multiple projectiles
  const handleSpreadShot = (shipX, shipY) => {
    if (!selectedTool?.isSpreadShot) return;
    
    // Fire 3 projectiles in a spread pattern
    for (let i = 0; i < 3; i++) {
      const spreadProjectile = {
        id: Date.now() + Math.random() + i,
        x: shipX,
        y: shipY - 20,
        angle: -Math.PI / 2,
        speed: selectedTool?.projectileSpeed || 8,
        color: selectedTool?.projectileColor,
        size: selectedTool?.projectileSize,
        toolId: selectedTool?.id,
        galacticStyle: true,
        isSpreadShot: true,
        spreadIndex: i // 0, 1, 2 for left, center, right
      };
      
      setProjectiles(prev => [...prev, spreadProjectile]);
    }
  };

  // NEW: Handle projectile hits with enhanced visual feedback
  const handleProjectileHit = (projectile, bacterium) => {
    const tool = defenseTools?.find(t => t?.id === projectile?.toolId);
    if (!tool) return;

    // Enhanced hit indicators with better visual feedback
    const damage = tool?.damage || Math.abs(tool?.effect?.badBacteria || tool?.effect?.goodBacteria || 0);
    setHitIndicators(prev => [...prev, {
      id: Date.now() + Math.random(),
      x: bacterium?.x,
      y: bacterium?.y,
      damage: damage,
      type: bacterium?.type,
      wasAutoAimed: projectile?.wasAutoAimed,
      criticalHit: damage > 100, // Mark high damage hits as critical
      weaponType: projectile?.toolId
    }]);

    // Remove hit indicator after enhanced animation
    setTimeout(() => {
      setHitIndicators(prev => prev?.filter(indicator => indicator?.id !== (Date.now() + Math.random())));
    }, 2000); // Extended duration for better visibility

    // Apply area effect if tool has it
    if (tool?.isAreaEffect) {
      const nearbyBacteria = bacteria?.filter(b => {
        if (!b?.isAlive || b?.spawnDelay > 0) return false;
        const distance = Math.sqrt(Math.pow(b?.x - projectile?.x, 2) + Math.pow(b?.y - projectile?.y, 2));
        return distance < 50;
      });
      
      nearbyBacteria?.forEach(b => applyToolEffect(tool, b));
    } else {
      applyToolEffect(tool, bacterium);
    }
  };

  // New: Separate tool effect application
  const applyToolEffect = (tool, bacterium) => {
    const effect = tool?.effect;
    
    if (effect?.badBacteria && bacterium?.type === 'bad') {
      setBacteria(prev => prev?.map(b => 
        b?.id === bacterium?.id 
          ? { ...b, currentHealth: Math.max(0, b?.currentHealth + effect?.badBacteria) }
          : b
      ));
      
      if (bacterium?.currentHealth + effect?.badBacteria <= 0) {
        setScore(prev => prev + bacterium?.points);
      }
    }
    
    if (effect?.goodBacteria && bacterium?.type === 'good') {
      if (effect?.goodBacteria > 0) {
        setBacteria(prev => prev?.map(b => 
          b?.id === bacterium?.id 
            ? { ...b, currentHealth: Math.min(b?.health, b?.currentHealth + effect?.goodBacteria) }
            : b
        ));
      } else {
        setBacteria(prev => prev?.map(b => 
          b?.id === bacterium?.id 
            ? { ...b, currentHealth: Math.max(0, b?.currentHealth + effect?.goodBacteria) }
            : b
        ));
        
        if (bacterium?.currentHealth + effect?.goodBacteria <= 0) {
          setScore(prev => prev + bacterium?.points);
        }
      }
    }

    if (effect?.immuneHealth) {
      setImmuneHealth(prev => Math.min(100, prev + effect?.immuneHealth));
    }

    if (effect?.balance) {
      setBacterialBalance(prev => Math.max(0, Math.min(100, prev + effect?.balance)));
    }
  };

  // Enhanced shoot function with better visual launch effects
  const enhancedBiologicalShoot = (shipX, shipY) => {
    if (!selectedTool || !selectedTool?.isShootable || ammoCount?.[selectedTool?.ammoType] <= 0) return;
    if (defensePoints < selectedTool?.cost) return;

    if (selectedTool?.isSpreadShot) {
      handleSpreadShot(shipX, shipY);
    } else {
      immuneShoot(shipX, shipY);
    }

    // Add enhanced launch flash effect
    setMuzzleFlash({
      id: Date.now(),
      x: shipX,
      y: shipY - 15,
      color: selectedTool?.projectileColor || '#ffffff',
      size: selectedTool?.projectileSize || 8,
      weaponType: selectedTool?.id
    });
    
    setTimeout(() => setMuzzleFlash(null), 250); // Slightly longer flash
  };

  const initializeGameForLocation = (location) => {
    const locationData = bodyLocations?.find(loc => loc?.id === location?.id);
    setTotalWaves(locationData?.challengeType === 'survival' ? 5 : 3);
    setCurrentWave(1);
    setImmuneHealth(100);
    setBacterialBalance(80);
    setScore(0);
    setDefensePoints(100);
    setBacteria([]);
    setDefenseTowers([]);
    setProjectiles([]);
    // Reset ammo counts
    setAmmoCount({
      antibiotic: 25,
      probiotic: 30,
      immuneCell: 20,
      hygiene: 40,
      antiseptic: 15
    });
    startWave(1, locationData);
  };

  const startWave = (waveNumber, locationData) => {
    const waveSize = Math.min(5 + waveNumber * 2, 15);
    const newBacteria = [];
    
    for (let i = 0; i < waveSize; i++) {
      const isGoodBacteria = Math.random() < 0.3;
      let bacteriaType;
      
      if (isGoodBacteria) {
        bacteriaType = locationData?.goodBacteria?.[Math.floor(Math.random() * locationData?.goodBacteria?.length)];
      } else {
        bacteriaType = locationData?.enemyTypes?.[Math.floor(Math.random() * locationData?.enemyTypes?.length)];
      }
      
      newBacteria?.push({
        id: `bacteria-${waveNumber}-${i}`,
        type: bacteriaType,
        ...bacteriaTypes?.[bacteriaType],
        x: -50,
        y: Math.random() * 400 + 100,
        currentHealth: bacteriaTypes?.[bacteriaType]?.health,
        isAlive: true,
        spawnDelay: i * 1000
      });
    }
    
    setBacteria(newBacteria);
    
    setCurrentTip({
      title: `Wave ${waveNumber} - ${locationData?.name}`,
      fact: locationData?.fact,
      advice: getWaveAdvice(waveNumber, locationData)
    });
    setShowEducationalTip(true);

    // Refill some ammo at wave start
    setAmmoCount(prev => ({
      antibiotic: Math.min(prev?.antibiotic + 5, 15),
      probiotic: Math.min(prev?.probiotic + 8, 20),
      immuneCell: Math.min(prev?.immuneCell + 3, 10),
      hygiene: Math.min(prev?.hygiene + 10, 25),
      antiseptic: Math.min(prev?.antiseptic + 4, 15)
    }));
  };

  const getWaveAdvice = (wave, location) => {
    const tips = [
      "Aim carefully! Use the crosshair to target harmful bacteria precisely!",
      "Try rapid-fire mode with Sanitizer Spray for multiple targets!",
      "Immune Launcher has smart targeting - great for moving bacteria!",
      "Probiotic Boosters heal good bacteria - shoot them for extra health!",
      "Antiseptic Cannon packs a punch but uses more ammo!"
    ];
    return tips?.[Math.min(wave - 1, tips?.length - 1)];
  };

  // Updated tool usage for non-shootable tools
  const useTool = (position, bacteria) => {
    if (!selectedTool || defensePoints < selectedTool?.cost) return;
    
    // If tool is shootable, use shooting system instead
    if (selectedTool?.isShootable) {
      // Use the enhanced galactic shoot function instead
      enhancedBiologicalShoot(playerShip?.x, playerShip?.y);
      return;
    }

    // Existing non-shootable tool logic (rest/recovery)
    const effect = selectedTool?.effect;

    if (effect?.immuneHealth) {
      setImmuneHealth(prev => Math.min(100, prev + effect?.immuneHealth));
    }

    if (effect?.balance) {
      setBacterialBalance(prev => Math.max(0, Math.min(100, prev + effect?.balance)));
    }

    setDefensePoints(prev => prev - selectedTool?.cost);
    setSelectedTool(null);
  };

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setGameState('playing');
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const restartGame = () => {
    setGameState('location-select');
    setSelectedLocation(null);
  };

  const nextWave = () => {
    if (currentWave < totalWaves) {
      const nextWaveNum = currentWave + 1;
      setCurrentWave(nextWaveNum);
      const locationData = bodyLocations?.find(loc => loc?.id === selectedLocation?.id);
      startWave(nextWaveNum, locationData);
    } else {
      setGameState('victory');
      checkAchievements();
    }
  };

  const checkAchievements = () => {
    const newAchievements = [];
    
    if (bacterialBalance >= 90) {
      newAchievements?.push('Balance Master');
    }
    
    if (immuneHealth >= 90) {
      newAchievements?.push('Immune Champion');
    }
    
    if (difficulty === 'hard') {
      newAchievements?.push('Germ Buster Extraordinaire');
    }

    // New shooting-related achievements
    if (projectiles?.length > 50) {
      newAchievements?.push('Sharpshooter');
    }
    
    setAchievements(prev => [...prev, ...newAchievements]);
  };

  return (
    <div className="min-h-screen bg-background">
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
            <BodyLocationSelector 
              locations={bodyLocations}
              onSelectLocation={selectLocation}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
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
                />
                
                {/* Enhanced Game Board with Intuitive Controls */}
                <GameBoard
                  location={selectedLocation}
                  bacteria={bacteria}
                  setBacteria={setBacteria}
                  defenseTowers={defenseTowers}
                  selectedTool={selectedTool}
                  onUseTool={useTool}
                  onShoot={enhancedBiologicalShoot}
                  onMouseMove={handleMouseMove}
                  onMouseClick={handleMouseClick}
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
                        className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <Icon name="Pause" size={16} />
                      </button>
                      <button
                        onClick={restartGame}
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
                      <span className="font-mono">{selectedTool?.fireRate || 150}ms</span>
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
              onBackToMenu={() => setGameState('location-select')}
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