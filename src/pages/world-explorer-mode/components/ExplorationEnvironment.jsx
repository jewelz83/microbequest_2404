import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { getEnvironmentData } from '../../../utils/microbeData';

const ExplorationEnvironment = ({
  currentEnvironment = 'soil',
  onMicrobeDiscovered,
  discoveredMicrobes = [],
  isExploring = false,
  className = ""
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [zoomTarget, setZoomTarget] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredArea, setHoveredArea] = useState(null);
  const [showHints, setShowHints] = useState(true);
  const [pulsingAreas, setPulsingAreas] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef(null);

  const environments = getEnvironmentData();
  const currentEnv = environments?.[currentEnvironment];

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentEnv?.highlightedAreas) {
        setPulsingAreas(currentEnv?.highlightedAreas?.map(area => area?.id));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentEnvironment, currentEnv?.highlightedAreas]);

  const getPositionFromEvent = (e) => {
    if (!containerRef?.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    // Support both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) / rect.width * 100,
      y: (clientY - rect.top) / rect.height * 100,
    };
  };

  const handleMouseMove = (e) => {
    const pos = getPositionFromEvent(e);
    if (pos) setCursorPosition(pos);
  };

  const handleInteraction = (e) => {
    if (!isExploring) return;
    // Prevent scroll on touch
    if (e.touches) e.preventDefault();

    const pos = getPositionFromEvent(e);
    if (!pos) return;

    // Use larger hit radius on touch devices for easier tapping
    const hitRadius = isTouchDevice ? 12 : 8;

    const foundMicrobe = currentEnv?.hiddenMicrobes?.find((microbe) => {
      const distance = Math.sqrt(
        Math.pow(pos.x - microbe?.x, 2) + Math.pow(pos.y - microbe?.y, 2)
      );
      return distance < hitRadius && !discoveredMicrobes?.includes(microbe?.id);
    });

    if (foundMicrobe) {
      setZoomTarget({ x: pos.x, y: pos.y });
      setIsZooming(true);
      setTimeout(() => {
        onMicrobeDiscovered(foundMicrobe);
        setIsZooming(false);
        setZoomTarget(null);
      }, 1000);
    }
  };

  const handleAreaHover = (area) => setHoveredArea(area);
  const handleAreaLeave = () => setHoveredArea(null);

  const handleScroll = (direction) => {
    const maxScroll = 200;
    const scrollAmount = 50;
    if (direction === 'left' && scrollPosition > 0) {
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    } else if (direction === 'right' && scrollPosition < maxScroll) {
      setScrollPosition(Math.min(maxScroll, scrollPosition + scrollAmount));
    }
  };

  const toggleHints = () => setShowHints(!showHints);

  return (
    <div className={`relative w-full h-96 overflow-hidden rounded-2xl border-2 border-border shadow-pronounced ${className}`}>
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden ${isTouchDevice ? 'cursor-default' : 'cursor-none'}`}
        onMouseMove={handleMouseMove}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        style={{ transform: `translateX(-${scrollPosition * 0.5}px)` }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image src={currentEnv?.background} alt={currentEnv?.backgroundAlt} className="w-full h-full object-cover" />
          {currentEnv?.layers?.map((layer, index) => (
            <div key={layer?.name} className={`absolute inset-x-0 ${layer?.color}`}
              style={{ top: `${index * 25}%`, height: '25%', transform: `translateX(-${scrollPosition * (0.3 + index * 0.1)}px)` }}>
              <div className="absolute left-4 top-2 text-white text-xs font-caption bg-black/60 px-2 py-1 rounded">
                {layer?.name}
              </div>
            </div>
          ))}
        </div>

        {/* Highlighted Areas */}
        {showHints && currentEnv?.highlightedAreas?.map((area) => (
          <div key={area?.id}
            className={`absolute border-2 ${area?.borderColor} ${area?.color} rounded-lg transition-all duration-500 cursor-pointer
              ${pulsingAreas?.includes(area?.id) ? 'animate-pulse' : ''}
              ${hoveredArea?.id === area?.id ? 'scale-105 shadow-lg' : ''}`}
            style={{ left: `${area?.x}%`, top: `${area?.y}%`, width: `${area?.width}%`, height: `${area?.height}%`, transform: `translateX(-${scrollPosition * 0.15}px)` }}
            onMouseEnter={() => handleAreaHover(area)}
            onMouseLeave={handleAreaLeave}
          >
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Icon name={area?.icon} size={16} className={`${area?.borderColor?.replace('border-', 'text-')}`} />
            </div>
            <div className="absolute bottom-1 left-1 right-1">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded text-center font-caption">{area?.name}</div>
            </div>
            {hoveredArea?.id === area?.id && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-border p-3 min-w-48 z-50">
                <div className="font-heading text-sm text-foreground mb-1">{area?.name}</div>
                <div className="font-body text-xs text-muted-foreground mb-2">{area?.description}</div>
                <div className="font-caption text-xs text-primary font-semibold">{area?.hint}</div>
                {area?.systemName && <div className="font-caption text-xs text-accent mt-1">🏥 {area?.systemName}</div>}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
              </div>
            )}
          </div>
        ))}

        {/* Hidden Microbes — larger tap targets on mobile */}
        {currentEnv?.hiddenMicrobes?.map((microbe) => {
          const isDiscovered = discoveredMicrobes?.includes(microbe?.id);
          return (
            <div key={microbe?.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${isDiscovered ? 'opacity-100 scale-110' : 'opacity-0 hover:opacity-30'}`}
              style={{ left: `${microbe?.x}%`, top: `${microbe?.y}%`, transform: `translate(-50%, -50%) translateX(-${scrollPosition * 0.2}px)` }}
            >
              {/* Larger invisible tap target for mobile */}
              {!isDiscovered && isTouchDevice && (
                <div className="absolute inset-0 w-16 h-16 -translate-x-4 -translate-y-4 rounded-full" />
              )}
              <div className={`w-8 h-8 rounded-full ${
                microbe?.type === 'bacteria' ? 'bg-green-400' :
                microbe?.type === 'virus' ? 'bg-red-400' :
                microbe?.type === 'fungi' ? 'bg-orange-400' :
                microbe?.type === 'protozoa' ? 'bg-blue-400' : 'bg-purple-400'
              } animate-pulse-soft shadow-lg`}>
                <Icon name={
                  microbe?.type === 'bacteria' ? 'Circle' :
                  microbe?.type === 'virus' ? 'Zap' :
                  microbe?.type === 'fungi' ? 'Flower' :
                  microbe?.type === 'protozoa' ? 'Waves' : 'Sparkles'
                } size={20} color="white" className="w-full h-full p-1" />
              </div>
              {isDiscovered && (
                <div className="absolute inset-0 animate-ping">
                  <div className="w-full h-full rounded-full bg-accent/50"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Magnifying Glass Cursor — desktop only */}
        {isExploring && !isTouchDevice && (
          <div className="absolute pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${cursorPosition?.x}%`, top: `${cursorPosition?.y}%` }}>
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary rounded-full bg-primary/10 backdrop-blur-sm">
                <Icon name="Search" size={24} className="text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="absolute inset-0 border-2 border-accent rounded-full animate-ping opacity-50"></div>
            </div>
          </div>
        )}

        {/* Mobile tap hint */}
        {isExploring && isTouchDevice && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-center">
            <div className="bg-black/50 rounded-full px-4 py-2 text-white text-xs animate-pulse">
              👆 Tap around to find microbes!
            </div>
          </div>
        )}

        {/* Zoom Animation */}
        {isZooming && zoomTarget && (
          <div className="absolute z-30 pointer-events-none"
            style={{ left: `${zoomTarget?.x}%`, top: `${zoomTarget?.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className="w-32 h-32 border-4 border-accent rounded-full bg-accent/20 animate-ping"></div>
            <div className="absolute inset-0 w-32 h-32 border-2 border-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Hint Toggle */}
      <div className="absolute top-4 right-4">
        <button onClick={toggleHints}
          className={`p-2 rounded-full transition-all duration-300 ${showHints ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          <Icon name={showHints ? 'Eye' : 'EyeOff'} size={16} />
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-card/95 rounded-full px-4 py-2 border border-border">
        <button onClick={() => handleScroll('left')} disabled={scrollPosition === 0}
          className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === Math.floor(scrollPosition / 50) ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
        <button onClick={() => handleScroll('right')} disabled={scrollPosition === 200}
          className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors">
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>

      {/* Environment Info */}
      <div className="absolute top-4 left-4 bg-card/95 rounded-lg px-3 py-2 border border-border">
        <h4 className="font-heading text-sm text-foreground">{currentEnv?.name}</h4>
        <p className="font-caption text-xs text-muted-foreground">
          {currentEnv?.hiddenMicrobes?.length - discoveredMicrobes?.filter((id) =>
            currentEnv?.hiddenMicrobes?.some((m) => m?.id === id)
          )?.length} microbes remaining
        </p>
        {currentEnv?.highlightedAreas?.length > 0 && (
          <p className="font-caption text-xs text-accent mt-1">🎯 {currentEnv?.highlightedAreas?.length} discovery zones</p>
        )}
      </div>

      {/* Body Systems Legend */}
      {currentEnvironment === 'body' && showHints && (
        <div className="absolute bottom-16 right-4 bg-card/95 rounded-lg p-3 border border-border max-w-48">
          <h5 className="font-heading text-xs text-foreground mb-2">Body Systems Guide</h5>
          <div className="space-y-1">
            {currentEnv?.highlightedAreas?.slice(0, 3)?.map((area) => (
              <div key={area?.id} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded ${area?.color} ${area?.borderColor} border`}></div>
                <span className="font-caption text-xs text-muted-foreground">{area?.systemName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorationEnvironment;
