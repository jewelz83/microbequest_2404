import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const GameBoard = ({ 
  location, 
  bacteria, 
  setBacteria, 
  defenseTowers, 
  selectedTool, 
  onUseTool, 
  onShoot,
  onMouseMove,
  onMouseClick,
  projectiles,
  playerShip,
  gameState,
  hitIndicators,
  rapidFire
}) => {
  const [animatingBacteria, setAnimatingBacteria] = useState([]);
  const [selectedBacterium, setSelectedBacterium] = useState(null);
  const [explosions, setExplosions] = useState([]);
  const [muzzleFlash, setMuzzleFlash] = useState(null);
  const [shotTrails, setShotTrails] = useState([]);
  const [hitEffects, setHitEffects] = useState([]);

  // NEW: Create shot trail when projectile is created
  useEffect(() => {
    projectiles?.forEach(projectile => {
      // Only create trail for new projectiles
      if (!shotTrails?.some(trail => trail?.projectileId === projectile?.id)) {
        const newTrail = {
          id: Date.now() + Math.random(),
          projectileId: projectile?.id,
          startX: projectile?.x,
          startY: projectile?.y + 10, // Start from slightly behind projectile
          points: [{ x: projectile?.x, y: projectile?.y, timestamp: Date.now() }],
          color: projectile?.color,
          maxLength: 8 // Number of trail points
        };
        
        setShotTrails(prev => [...prev, newTrail]);
      }
    });

    // Update trail points for existing projectiles
    setShotTrails(prev => prev?.map(trail => {
      const matchingProjectile = projectiles?.find(p => p?.id === trail?.projectileId);
      if (matchingProjectile) {
        const newPoint = {
          x: matchingProjectile?.x,
          y: matchingProjectile?.y,
          timestamp: Date.now()
        };
        
        // Add new point and limit trail length
        const updatedPoints = [...trail?.points, newPoint]?.slice(-trail?.maxLength);
        return { ...trail, points: updatedPoints };
      }
      return trail;
    }));

    // Remove trails for projectiles that no longer exist
    const activeProjectileIds = projectiles?.map(p => p?.id);
    setShotTrails(prev => prev?.filter(trail => 
      activeProjectileIds?.includes(trail?.projectileId)
    ));
  }, [projectiles]);

  // Animate bacteria movement
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setBacteria(prev => prev?.map(bacterium => {
        if (!bacterium?.isAlive || bacterium?.spawnDelay > 0) {
          return { 
            ...bacterium, 
            spawnDelay: Math.max(0, bacterium?.spawnDelay - 100) 
          };
        }

        const newX = bacterium?.x + (bacterium?.speed === 'fast' ? 2 : bacterium?.speed === 'medium' ? 1.5 : 1);
        
        // Check if bacterium reached the end
        if (newX > 800) {
          // Bacterium reached the body - cause damage
          return { ...bacterium, isAlive: false, reachedEnd: true };
        }

        return { ...bacterium, x: newX };
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, setBacteria]);

  // Remove dead bacteria
  useEffect(() => {
    setBacteria(prev => prev?.filter(bacterium => 
      bacterium?.currentHealth > 0 && bacterium?.isAlive
    ));
  }, [bacteria, setBacteria]);

  // NEW: Clean up old hit effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setHitEffects(prev => prev?.filter(effect => now - effect?.timestamp < 2000));
      setShotTrails(prev => prev?.filter(trail => {
        const oldestPoint = trail?.points?.[0];
        return oldestPoint && (Date.now() - oldestPoint?.timestamp) < 1000;
      }));
    }, 100);

    return () => clearInterval(cleanup);
  }, []);

  // NEW: Enhanced board click handler with better visual feedback
  const handleBoardClick = (event) => {
    if (gameState !== 'playing') return;
    event?.preventDefault();
    
    if (selectedTool?.isShootable) {
      onShoot?.(playerShip?.x, playerShip?.y);
      
      // Enhanced muzzle flash effect with color based on weapon
      setMuzzleFlash({
        id: Date.now(),
        x: playerShip?.x,
        y: playerShip?.y - 15,
        color: selectedTool?.projectileColor || '#ffffff',
        size: selectedTool?.projectileSize || 8
      });
      
      setTimeout(() => setMuzzleFlash(null), 200);
    } else if (selectedTool?.id === 'rest') {
      // Non-shootable tools can still be used by clicking
      const rect = event?.currentTarget?.getBoundingClientRect();
      const x = event?.clientX - rect?.left;
      const y = event?.clientY - rect?.top;
      
      setExplosions(prev => [...prev, {
        id: Date.now(),
        x: x,
        y: y,
        color: selectedTool?.color
      }]);

      onUseTool?.({ x, y }, null);
    }
  };

  // Updated bacterium click - for info display only
  const handleBacteriumClick = (bacterium) => {
    setSelectedBacterium(bacterium);
    
    // NEW: Create hit effect when clicking on bacterium (for visual feedback)
    setHitEffects(prev => [...prev, {
      id: Date.now() + Math.random(),
      x: bacterium?.x,
      y: bacterium?.y,
      type: 'click',
      color: '#60a5fa',
      timestamp: Date.now()
    }]);
  };

  const getBacteriumIcon = (bacterium) => {
    switch (bacterium?.type) {
      case 'good':
        return 'Smile';
      case 'bad':
        return 'Frown';
      default:
        return 'Circle';
    }
  };

  const getBacteriumSize = (size) => {
    switch (size) {
      case 'small': return 'w-8 h-8';
      case 'medium': return 'w-10 h-10';
      case 'large': return 'w-12 h-12';
      default: return 'w-10 h-10';
    }
  };

  // Enhanced: Environment-specific background renderer - realistic biological environments
  const renderEnvironmentBackground = (locationId) => {
    switch (locationId) {
      case 'lungs':
        return (
          <div className="absolute inset-0">
            {/* Realistic lung alveoli background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/80 via-pink-100/60 to-red-200/70">
              {/* Detailed lung structures */}
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 800 400">
                {/* Bronchial tree */}
                <path
                  d="M 400 0 L 400 120 M 400 120 L 300 180 M 400 120 L 500 180 M 300 180 L 250 220 M 300 180 L 350 220 M 500 180 L 450 220 M 500 180 L 550 220"
                  stroke="#dc2626" strokeWidth="6" fill="none" opacity="0.7"
                />
                {/* Alveolar sacs - realistic clusters */}
                {Array.from({ length: 12 }, (_, i) => {
                  let x = 120 + (i % 6) * 110;
                  let y = 180 + Math.floor(i / 6) * 80;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="25" fill="#fca5a5" opacity="0.6" />
                      <circle cx={x-8} cy={y+8} r="12" fill="#f87171" opacity="0.4" />
                      <circle cx={x+8} cy={y-8} r="15" fill="#f87171" opacity="0.4" />
                    </g>
                  );
                })}
                {/* Capillary networks */}
                {Array.from({ length: 20 }, (_, i) => (
                  <circle key={i} cx={100 + i * 30} cy={300 + Math.sin(i) * 20} r="2" fill="#dc2626" opacity="0.3" />
                ))}
              </svg>
            </div>
          </div>
        );

      case 'gut':
        return (
          <div className="absolute inset-0">
            {/* Realistic intestinal environment */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-100/60 to-yellow-200/70">
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 800 400">
                {/* Intestinal walls with villi */}
                <path
                  d="M 0 320 Q 200 310 400 315 Q 600 320 800 315"
                  stroke="#d97706" strokeWidth="12" fill="none" opacity="0.6"
                />
                <path
                  d="M 0 80 Q 200 90 400 85 Q 600 80 800 85"
                  stroke="#d97706" strokeWidth="12" fill="none" opacity="0.6"
                />
                {/* Villi structures */}
                {Array.from({ length: 15 }, (_, i) => (
                  <g key={i}>
                    <line 
                      x1={50 + i * 50} 
                      y1="320" 
                      x2={50 + i * 50} 
                      y2="290" 
                      stroke="#f59e0b" 
                      strokeWidth="4" 
                      opacity="0.5"
                    />
                    <line 
                      x1={50 + i * 50} 
                      y1="80" 
                      x2={50 + i * 50} 
                      y2="110" 
                      stroke="#f59e0b" 
                      strokeWidth="4" 
                      opacity="0.5"
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        );

      case 'skin':
        return (
          <div className="absolute inset-0">
            {/* Realistic skin layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-pink-100/80 via-rose-100/60 to-orange-100/70">
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 800 400">
                {/* Epidermis */}
                <rect x="0" y="0" width="800" height="100" fill="#fdf2f8" opacity="0.4" />
                <text x="20" y="25" fontSize="12" fill="#be185d" opacity="0.6">Epidermis</text>
                {/* Dermis */}
                <rect x="0" y="100" width="800" height="180" fill="#fed7e2" opacity="0.4" />
                <text x="20" y="125" fontSize="12" fill="#be185d" opacity="0.6">Dermis</text>
                {/* Hair follicles */}
                {Array.from({ length: 8 }, (_, i) => (
                  <g key={i}>
                    <ellipse cx={100 + i * 90} cy="120" rx="8" ry="40" fill="#be185d" opacity="0.3" />
                    <line x1={100 + i * 90} y1="0" x2={100 + i * 90} y2="80" stroke="#78716c" strokeWidth="2" opacity="0.4" />
                  </g>
                ))}
                {/* Subcutaneous tissue */}
                <rect x="0" y="280" width="800" height="120" fill="#fef3cd" opacity="0.4" />
                <text x="20" y="305" fontSize="12" fill="#be185d" opacity="0.6">Subcutaneous</text>
              </svg>
            </div>
          </div>
        );

      case 'mouth':
        return (
          <div className="absolute inset-0">
            {/* Realistic oral cavity */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/80 via-pink-100/60 to-rose-200/70">
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 800 400">
                {/* Oral cavity shape */}
                <ellipse cx="400" cy="200" rx="350" ry="120" fill="#ec4899" opacity="0.3" />
                {/* Teeth */}
                {Array.from({ length: 16 }, (_, i) => (
                  <rect key={i} x={120 + i * 35} y="80" width="20" height="30" rx="10" fill="#f8fafc" opacity="0.7" />
                ))}
                {Array.from({ length: 16 }, (_, i) => (
                  <rect key={i} x={120 + i * 35} y="290" width="20" height="30" rx="10" fill="#f8fafc" opacity="0.7" />
                ))}
                {/* Tongue */}
                <ellipse cx="400" cy="250" rx="200" ry="60" fill="#f472b6" opacity="0.4" />
                {/* Taste buds */}
                {Array.from({ length: 20 }, (_, i) => (
                  <circle key={i} cx={300 + (i % 10) * 20} cy={230 + Math.floor(i / 10) * 40} r="3" fill="#be185d" opacity="0.3" />
                ))}
              </svg>
            </div>
          </div>
        );

      default:
        return (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 to-green-100/80" />
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Enhanced Game Board - Biological Environment Style */}
      <div 
        className="relative w-full h-96 border-2 border-border rounded-xl overflow-hidden bg-white cursor-crosshair"
        onClick={handleBoardClick}
        onMouseMove={onMouseMove}
      >
        {/* Realistic Biological Environment Background */}
        <div className="absolute inset-0">
          {/* Environment-Specific Background - Pure biological environments */}
          {renderEnvironmentBackground(location?.id)}
        </div>

        {/* NEW: Enhanced Shot Trails - Much More Visible */}
        {shotTrails?.map((trail) => {
          if (!trail?.points || trail?.points?.length < 2) return null;
          
          return (
            <svg
              key={trail?.id}
              className="absolute inset-0 w-full h-full pointer-events-none z-12"
              style={{ overflow: 'visible' }}
            >
              {/* Main Trail Line */}
              <path
                d={`M ${trail?.points?.map(point => `${point?.x},${point?.y}`)?.join(' L ')}`}
                stroke={trail?.color}
                strokeWidth="4"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 6px ${trail?.color})`,
                }}
              />
              
              {/* Glowing Trail Effect */}
              <path
                d={`M ${trail?.points?.map(point => `${point?.x},${point?.y}`)?.join(' L ')}`}
                stroke={trail?.color}
                strokeWidth="8"
                fill="none"
                opacity="0.3"
                strokeLinecap="round"
                style={{
                  filter: `blur(2px)`,
                }}
              />
              
              {/* Individual Trail Particles */}
              {trail?.points?.map((point, index) => {
                const age = (Date.now() - point?.timestamp) / 1000;
                const opacity = Math.max(0, 1 - age);
                const size = 3 + (1 - age) * 2;
                
                return (
                  <circle
                    key={`${trail?.id}-${index}`}
                    cx={point?.x}
                    cy={point?.y}
                    r={size}
                    fill={trail?.color}
                    opacity={opacity * 0.6}
                    style={{
                      filter: `drop-shadow(0 0 4px ${trail?.color})`,
                    }}
                  />
                );
              })}
            </svg>
          );
        })}

        {/* NEW: Immune Defender Ship (instead of space ship) */}
        <div
          className="absolute transition-all duration-75 ease-out z-20"
          style={{
            left: `${playerShip?.x - playerShip?.width / 2}px`,
            top: `${playerShip?.y - playerShip?.height / 2}px`,
            width: `${playerShip?.width}px`,
            height: `${playerShip?.height}px`,
          }}
        >
          {/* Immune Defender Body */}
          <div className="relative w-full h-full">
            {/* Main Immune Defender Design */}
            <svg viewBox="0 0 40 30" className="w-full h-full">
              {/* Immune Cell Body */}
              <ellipse cx="20" cy="15" rx="18" ry="12" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />
              {/* Nucleus */}
              <ellipse cx="20" cy="12" rx="8" ry="6" fill="#1e40af" />
              {/* Antibody receptors */}
              <circle cx="8" cy="8" r="2" fill="#ef4444" />
              <circle cx="32" cy="8" r="2" fill="#ef4444" />
              <circle cx="8" cy="22" r="2" fill="#ef4444" />
              <circle cx="32" cy="22" r="2" fill="#ef4444" />
              {/* Membrane details */}
              <path d="M 5 15 Q 10 10 15 15 Q 10 20 5 15" fill="#3b82f6" opacity="0.3" />
              <path d="M 35 15 Q 30 10 25 15 Q 30 20 35 15" fill="#3b82f6" opacity="0.3" />
            </svg>
            
            {/* Weapon Mount Indicator */}
            {selectedTool?.isShootable && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div 
                  className="w-2 h-3 rounded-t-full animate-pulse"
                  style={{ backgroundColor: selectedTool?.projectileColor }}
                />
              </div>
            )}
            
            {/* Rapid Fire Indicator */}
            {rapidFire && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NEW: Super Enhanced Projectiles - Much More Visible */}
        {projectiles?.map((projectile) => (
          <div
            key={projectile?.id}
            className="absolute pointer-events-none z-16"
            style={{
              left: `${projectile?.x - projectile?.size}px`,
              top: `${projectile?.y - projectile?.size}px`,
            }}
          >
            {/* Outer Glow Ring */}
            <div 
              className="absolute rounded-full animate-ping"
              style={{
                width: `${projectile?.size * 3}px`,
                height: `${projectile?.size * 3}px`,
                backgroundColor: projectile?.color,
                opacity: 0.2,
                left: `${-projectile?.size}px`,
                top: `${-projectile?.size}px`,
                filter: `blur(4px)`,
              }}
            />
            
            {/* Main Projectile Body - Much Brighter */}
            <div 
              className="absolute rounded-full border-2 border-white animate-pulse"
              style={{
                width: `${projectile?.size * 2}px`,
                height: `${projectile?.size * 2}px`,
                backgroundColor: projectile?.color,
                boxShadow: `
                  0 0 ${projectile?.size * 3}px ${projectile?.color},
                  0 0 ${projectile?.size * 6}px ${projectile?.color}40,
                  inset 0 0 ${projectile?.size}px rgba(255,255,255,0.3)
                `,
                filter: 'brightness(1.3)',
              }}
            />
            
            {/* Core Bright Center */}
            <div 
              className="absolute rounded-full"
              style={{
                width: `${projectile?.size}px`,
                height: `${projectile?.size}px`,
                backgroundColor: '#ffffff',
                left: `${projectile?.size / 2}px`,
                top: `${projectile?.size / 2}px`,
                opacity: 0.8,
                boxShadow: `0 0 ${projectile?.size * 2}px #ffffff`,
              }}
            />
            
            {/* Directional Motion Blur */}
            <div 
              className="absolute rounded-full opacity-40"
              style={{
                width: `${projectile?.size * 0.8}px`,
                height: `${projectile?.size * 2.5}px`,
                backgroundColor: projectile?.color,
                left: `${projectile?.size * 0.6}px`,
                top: `${projectile?.size * 1.2}px`,
                filter: 'blur(1px)',
              }}
            />
            
            {/* Special Effects for Different Weapon Types */}
            {projectile?.isHoming && (
              <>
                <div className="absolute -inset-2 border-2 border-blue-400 rounded-full animate-spin opacity-70"></div>
                <div className="absolute -inset-1 border border-blue-300 rounded-full animate-pulse opacity-50"></div>
              </>
            )}
            
            {projectile?.isSpreadShot && (
              <>
                <div className="absolute -inset-2 border-2 border-yellow-400 rounded-full animate-ping opacity-60"></div>
                <div className="absolute -inset-3 border border-orange-400 rounded-full animate-pulse opacity-40"></div>
              </>
            )}
            
            {/* Weapon Type Particles */}
            {projectile?.toolId === 'antibiotic' && (
              <div className="absolute inset-0">
                <div className="w-1 h-1 bg-purple-300 rounded-full absolute animate-ping" style={{ left: '-2px', top: '50%' }} />
                <div className="w-1 h-1 bg-purple-300 rounded-full absolute animate-ping" style={{ right: '-2px', top: '50%', animationDelay: '0.1s' }} />
              </div>
            )}
            
            {projectile?.toolId === 'probiotic' && (
              <div className="absolute inset-0">
                <div className="w-1 h-1 bg-green-300 rounded-full absolute animate-bounce" style={{ left: '25%', top: '-2px' }} />
                <div className="w-1 h-1 bg-green-300 rounded-full absolute animate-bounce" style={{ right: '25%', bottom: '-2px', animationDelay: '0.2s' }} />
              </div>
            )}
          </div>
        ))}

        {/* NEW: Enhanced Hit Effects - Super Visible */}
        {hitEffects?.map((effect) => {
          const age = (Date.now() - effect?.timestamp) / 1000;
          const scale = 1 + age * 2;
          const opacity = Math.max(0, 1 - age);
          
          return (
            <div
              key={effect?.id}
              className="absolute pointer-events-none z-25"
              style={{
                left: `${effect?.x - 16}px`,
                top: `${effect?.y - 16}px`,
                transform: `scale(${scale})`,
                opacity: opacity,
              }}
            >
              {/* Main Explosion Ring */}
              <div 
                className="w-8 h-8 rounded-full border-4 animate-ping"
                style={{
                  borderColor: effect?.color,
                  backgroundColor: `${effect?.color}40`,
                  boxShadow: `0 0 20px ${effect?.color}`,
                }}
              />
              
              {/* Inner Flash */}
              <div 
                className="absolute inset-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: `0 0 12px ${effect?.color}`,
                }}
              />
              
              {/* Sparkle Effects */}
              <div className="absolute inset-0">
                <div className="w-1 h-1 bg-white rounded-full absolute animate-ping" style={{ left: '0px', top: '50%' }} />
                <div className="w-1 h-1 bg-white rounded-full absolute animate-ping" style={{ right: '0px', top: '50%', animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-white rounded-full absolute animate-ping" style={{ left: '50%', top: '0px', animationDelay: '0.2s' }} />
                <div className="w-1 h-1 bg-white rounded-full absolute animate-ping" style={{ left: '50%', bottom: '0px', animationDelay: '0.3s' }} />
              </div>
            </div>
          );
        })}

        {/* Enhanced Bacteria with Better Visibility */}
        {bacteria?.map((bacterium) => {
          if (bacterium?.spawnDelay > 0 || !bacterium?.isAlive) return null;
          
          return (
            <div
              key={bacterium?.id}
              className={`
                absolute ${getBacteriumSize(bacterium?.size)} rounded-full
                flex items-center justify-center cursor-pointer
                transform transition-all duration-100 hover:scale-110
                ${selectedBacterium?.id === bacterium?.id ? 'ring-2 ring-primary' : ''}
                ${bacterium?.type === 'good' ? 'animate-bounce-gentle' : 'animate-pulse'}
                z-10
              `}
              style={{
                left: `${bacterium?.x}px`,
                top: `${bacterium?.y}px`,
                backgroundColor: bacterium?.color,
                boxShadow: `0 0 15px ${bacterium?.color}60`,
                border: `2px solid ${bacterium?.type === 'good' ? '#22c55e' : '#ef4444'}`
              }}
              onClick={(e) => {
                e?.stopPropagation();
                handleBacteriumClick(bacterium);
              }}
            >
              {/* Bacterium Icon */}
              <Icon 
                name={getBacteriumIcon(bacterium)} 
                size={bacterium?.size === 'large' ? 20 : bacterium?.size === 'small' ? 12 : 16} 
                color="white" 
                strokeWidth={2}
              />
              
              {/* Health Bar */}
              {bacterium?.currentHealth < bacterium?.health && (
                <div className="absolute -top-3 left-0 w-full">
                  <div className="w-full h-1 bg-gray-800 rounded">
                    <div 
                      className="h-full bg-red-500 rounded transition-all duration-300"
                      style={{ 
                        width: `${(bacterium?.currentHealth / bacterium?.health) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Bacterium Type Indicator */}
              <div className="absolute -top-1 -right-1">
                {bacterium?.type === 'good' ? (
                  <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                ) : (
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                )}
              </div>
            </div>
          );
        })}

        {/* Super Enhanced Muzzle Flash - Much More Visible */}
        {muzzleFlash && (
          <div
            className="absolute pointer-events-none z-25"
            style={{
              left: `${muzzleFlash?.x - 12}px`,
              top: `${muzzleFlash?.y - 12}px`,
            }}
          >
            {/* Outer Flash Ring */}
            <div 
              className="absolute w-16 h-16 rounded-full animate-ping opacity-60"
              style={{
                backgroundColor: muzzleFlash?.color,
                filter: 'blur(4px)',
                left: '-20px',
                top: '-20px',
              }}
            />
            
            {/* Main Muzzle Flash */}
            <div 
              className="w-6 h-12 rounded-full animate-pulse"
              style={{
                background: `linear-gradient(to top, transparent, ${muzzleFlash?.color}, #ffffff)`,
                boxShadow: `0 0 20px ${muzzleFlash?.color}, 0 0 40px #ffffff`,
                filter: 'brightness(1.5)',
              }}
            />
            
            {/* Bright Core */}
            <div className="absolute inset-0 w-3 h-8 bg-white rounded-full animate-pulse ml-1.5 mt-2 opacity-90"></div>
            
            {/* Side Flashes */}
            <div className="absolute top-2 -left-1 w-2 h-2 bg-white rounded-full animate-ping opacity-80"></div>
            <div className="absolute top-2 -right-1 w-2 h-2 bg-white rounded-full animate-ping opacity-80"></div>
          </div>
        )}

        {/* Enhanced Damage Number Indicators */}
        {hitIndicators?.map((indicator) => {
          // NEW: Create hit effect when damage indicator appears
          React.useEffect(() => {
            setHitEffects(prev => [...prev, {
              id: Date.now() + Math.random(),
              x: indicator?.x,
              y: indicator?.y,
              type: 'damage',
              color: indicator?.type === 'good' ? '#ef4444' : '#22c55e',
              timestamp: Date.now()
            }]);
          }, []);

          return (
            <div
              key={indicator?.id}
              className={`absolute pointer-events-none z-30 animate-bounce font-bold text-xl ${
                indicator?.type === 'good' ? 'text-red-400' : 'text-green-400'
              }`}
              style={{
                left: `${indicator?.x}px`,
                top: `${indicator?.y - 20}px`,
                animation: 'float-up-enhanced 1.5s ease-out forwards',
                textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 10px currentColor',
                filter: 'brightness(1.2)',
              }}
            >
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-extrabold">{indicator?.damage}</span>
                {indicator?.type === 'good' ? (
                  <Icon name="Heart" size={16} className="text-red-400 animate-pulse" />
                ) : (
                  <Icon name="Zap" size={16} className="text-green-400 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}

        {/* Explosions */}
        {explosions?.map((explosion) => (
          <div
            key={explosion?.id}
            className="absolute w-16 h-16 pointer-events-none animate-ping z-20"
            style={{
              left: `${explosion?.x - 32}px`,
              top: `${explosion?.y - 32}px`,
            }}
          >
            <div 
              className="w-full h-full rounded-full opacity-75"
              style={{ backgroundColor: explosion?.color?.replace('bg-', '')?.replace('-500', '') }}
            />
          </div>
        ))}

        {/* Game UI Overlays - Updated for biological theme */}
        <div className="absolute top-4 left-4 bg-white/90 text-gray-800 px-3 py-2 rounded-lg text-sm z-30 border border-gray-300">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} />
            <span>IMMUNE DEFENSE</span>
          </div>
        </div>

        {/* Immune Defender Status Display */}
        {selectedTool && (
          <div className="absolute top-4 right-4 bg-white/95 text-gray-800 px-3 py-2 rounded-lg text-sm z-30 border border-gray-300">
            <div className="flex items-center space-x-2">
              <Icon name={selectedTool?.icon} size={16} />
              <div>
                <div className="font-semibold">{selectedTool?.name}</div>
                <div className="text-xs opacity-80">
                  {rapidFire ? 'RAPID RESPONSE' : 'SINGLE SHOT'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Information */}
        <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg text-sm z-30">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} />
            <span>{location?.name}</span>
          </div>
        </div>

        {/* Control Hints - Updated */}
        <div className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-3 py-2 rounded-lg text-xs z-30 border border-gray-300">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Icon name="ArrowLeft" size={12} />
              <Icon name="ArrowRight" size={12} />
              <span>Move</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="px-1 py-0.5 bg-gray-200 rounded text-xs">SPC</div>
              <span>Shoot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bacterium Information Panel */}
      {selectedBacterium && (
        <div className="absolute top-full mt-4 left-0 right-0 bg-card border border-border rounded-lg p-4 z-40">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                style={{ 
                  backgroundColor: selectedBacterium?.color,
                  borderColor: selectedBacterium?.type === 'good' ? '#22c55e' : '#ef4444'
                }}
              >
                <Icon 
                  name={getBacteriumIcon(selectedBacterium)} 
                  size={24} 
                  color="white" 
                  strokeWidth={2}
                />
              </div>
              <div>
                <h4 className="font-heading text-foreground font-semibold">
                  {selectedBacterium?.name}
                </h4>
                <p className="font-body text-sm text-muted-foreground">
                  {selectedBacterium?.description}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Icon name="Heart" size={14} className="text-red-500" />
                    <span className="text-xs font-mono">
                      {selectedBacterium?.currentHealth}/{selectedBacterium?.health}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    <span className="text-xs font-mono">
                      {selectedBacterium?.points > 0 ? '+' : ''}{selectedBacterium?.points} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedBacterium(null)}
              className="p-1 hover:bg-muted rounded"
            >
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
          
          {/* Educational Information - Updated */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm text-foreground">
                  {selectedBacterium?.type === 'good' 
                    ? "This is a beneficial bacterium! Position your immune defender and use Probiotic Beams to boost its health!" :"This is a harmful bacterium! Move your immune defender into position and shoot it before it reaches the body!"
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use arrow keys or mouse to move your immune defender, then shoot straight up with spacebar or click!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced CSS animations for much better shot visibility
const style = document.createElement('style');
style.textContent = `
  @keyframes float-up-enhanced {
    0% {
      transform: translateY(0px) scale(1);
      opacity: 1;
    }
    20% {
      transform: translateY(-10px) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: translateY(-60px) scale(0.8);
      opacity: 0;
    }
  }
  
  @keyframes bounce-gentle {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-2px);
    }
    60% {
      transform: translateY(-1px);
    }
  }
  
  .animate-bounce-gentle {
    animation: bounce-gentle 2s infinite;
  }
  
  @keyframes shot-trail {
    0% {
      opacity: 1;
      width: 4px;
    }
    100% {
      opacity: 0;
      width: 1px;
    }
  }
`;
if (!document.head?.querySelector('style[data-biological-animations]')) {
  style?.setAttribute('data-biological-animations', 'true');
  document.head?.appendChild(style);
}

export default GameBoard;