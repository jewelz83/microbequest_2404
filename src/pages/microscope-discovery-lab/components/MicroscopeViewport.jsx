import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MicroscopeViewport = ({ 
  selectedSpecimen, 
  zoomLevel = 1, 
  onZoomChange, 
  focusLevel = 50,
  onFocusChange,
  onHotspotClick,
  className = "" 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [discoveredHotspots, setDiscoveredHotspots] = useState(new Set());
  const [celebrationEffect, setCelebrationEffect] = useState(null);
  const [particles, setParticles] = useState([]);

  // Generate focus particles when adjusting
  useEffect(() => {
    if (isAnimating) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.1
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleZoomIn = () => {
    if (zoomLevel < 5) {
      setIsAnimating(true);
      onZoomChange(Math.min(zoomLevel + 0.5, 5));
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setIsAnimating(true);
      onZoomChange(Math.max(zoomLevel - 0.5, 0.5));
    }
  };

  const handleFocusAdjust = (direction) => {
    const newFocus = direction === 'up' 
      ? Math.min(focusLevel + 10, 100)
      : Math.max(focusLevel - 10, 0);
    onFocusChange(newFocus);
    setIsAnimating(true);
  };

  // Dynamic hotspots based on specimen type and zoom level
  const getHotspotsForSpecimen = () => {
    if (!selectedSpecimen) return [];
    
    // Show different hotspots based on zoom level
    const baseHotspots = {
      bacteria: [
        { id: 1, x: 35, y: 40, label: 'Cell Wall', type: 'structure', minZoom: 1, description: 'A tough protective layer that gives bacteria their shape. It\'s like armor for tiny cells!', fun: 'Bacteria cell walls are so strong, some can survive being boiled!' },
        { id: 2, x: 60, y: 55, label: 'Cytoplasm', type: 'organelle', minZoom: 2, description: 'The gel-like substance inside the cell where all the action happens!', fun: 'Think of cytoplasm as the "soup" where all cell parts float around.' },
        { id: 3, x: 45, y: 70, label: 'Flagella', type: 'movement', minZoom: 1.5, description: 'Tail-like structures that spin like propellers to help bacteria swim!', fun: 'A bacterial flagella can spin at 1,000 rotations per second - faster than a helicopter!' }
      ],
      virus: [
        { id: 1, x: 50, y: 45, label: 'Capsid Shell', type: 'structure', minZoom: 1, description: 'The protective protein coat that surrounds a virus. It\'s like a tiny spaceship!', fun: 'Virus shells are made of repeating protein patterns - like LEGO blocks!' },
        { id: 2, x: 50, y: 55, label: 'Genetic Material', type: 'organelle', minZoom: 3, description: 'DNA or RNA that contains the virus\'s instructions for making more viruses.', fun: 'Some viruses have only 4 genes, while humans have over 20,000!' },
        { id: 3, x: 65, y: 40, label: 'Spike Proteins', type: 'movement', minZoom: 2, description: 'Special proteins that help viruses attach to and enter cells.', fun: 'Spike proteins work like keys that unlock specific cell doors!' }
      ],
      fungi: [
        { id: 1, x: 30, y: 35, label: 'Hyphae', type: 'structure', minZoom: 1, description: 'Thread-like structures that fungi use to absorb nutrients and grow.', fun: 'One fungi\'s hyphae network can cover an area bigger than a football field!' },
        { id: 2, x: 55, y: 50, label: 'Spore', type: 'organelle', minZoom: 2.5, description: 'Tiny reproductive cells that spread to create new fungi.', fun: 'A single mushroom can release 16 billion spores per day!' },
        { id: 3, x: 45, y: 65, label: 'Cell Wall', type: 'structure', minZoom: 1.5, description: 'Made of chitin, the same material in insect exoskeletons!', fun: 'Fungal cell walls are tougher than plant cell walls!' }
      ],
      protozoa: [
        { id: 1, x: 40, y: 35, label: 'Cilia', type: 'movement', minZoom: 1, description: 'Tiny hair-like structures that beat in waves to help the organism swim.', fun: 'Cilia beat 10-40 times per second - imagine swimming that fast!' },
        { id: 2, x: 55, y: 50, label: 'Food Vacuole', type: 'organelle', minZoom: 2, description: 'A bubble-like structure where food is digested.', fun: 'Protozoa basically have a "food bubble stomach" inside them!' },
        { id: 3, x: 48, y: 65, label: 'Nucleus', type: 'organelle', minZoom: 2.5, description: 'The control center containing genetic instructions.', fun: 'Some protozoa have TWO nuclei - one for daily tasks and one for reproduction!' }
      ]
    };
    
    const categoryHotspots = baseHotspots[selectedSpecimen.category] || baseHotspots.bacteria;
    
    // Only show hotspots that are visible at current zoom level
    return categoryHotspots.filter(hotspot => zoomLevel >= hotspot.minZoom);
  };
  
  const hotspots = getHotspotsForSpecimen();

  const getBlurLevel = () => {
    const optimalFocus = 50;
    const deviation = Math.abs(focusLevel - optimalFocus);
    return Math.max(0, deviation / 10);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Microscope Frame */}
      <div className="relative w-80 h-80 mx-auto">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-800 shadow-pronounced bg-gradient-to-br from-gray-700 to-gray-900">
          {/* Focus Rings */}
          <div className="absolute inset-2 rounded-full border-2 border-gray-600 opacity-60"></div>
          <div className="absolute inset-4 rounded-full border border-gray-500 opacity-40"></div>
          
          {/* Viewport */}
          <div className="absolute inset-6 rounded-full overflow-hidden bg-black border-2 border-gray-600">
            {selectedSpecimen ? (
              <div 
                className="relative w-full h-full transition-all duration-500"
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: `blur(${getBlurLevel()}px)`
                }}
              >
                {/* Specimen Image */}
                <Image
                  src={selectedSpecimen?.microscopeImage}
                  alt={selectedSpecimen?.microscopeImageAlt}
                  className="w-full h-full object-cover"
                />
                
                {/* Animated Microbe Overlay */}
                <div className="absolute inset-0">
                  {selectedSpecimen?.category === 'bacteria' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse-soft opacity-80">
                        {/* Bacteria Eyes */}
                        <div className="absolute top-6 left-4 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute top-6 right-4 w-2 h-2 bg-white rounded-full"></div>
                        {/* Bacteria Smile */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                  
                  {selectedSpecimen?.category === 'virus' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 transform rotate-45 animate-spin-slow opacity-80">
                        {/* Virus Face */}
                        <div className="absolute inset-2 bg-purple-300 transform -rotate-45 rounded-sm">
                          <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full"></div>
                          <div className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full"></div>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedSpecimen?.category === 'fungi' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        {/* Mushroom Cap */}
                        <div className="w-20 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-full animate-bounce-gentle opacity-80">
                          {/* Spots */}
                          <div className="absolute top-2 left-3 w-2 h-2 bg-white rounded-full opacity-60"></div>
                          <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full opacity-60"></div>
                          {/* Eyes */}
                          <div className="absolute bottom-2 left-4 w-2 h-2 bg-white rounded-full"></div>
                          <div className="absolute bottom-2 right-4 w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        {/* Stem */}
                        <div className="w-4 h-8 bg-gradient-to-b from-yellow-200 to-yellow-400 mx-auto rounded-b-lg">
                          {/* Smile */}
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b border-orange-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Hotspots */}
                {hotspots?.map((hotspot) => {
                  const isDiscovered = discoveredHotspots.has(hotspot.id);
                  return (
                    <button
                      key={hotspot?.id}
                      onClick={() => {
                        setActiveHotspot(hotspot);
                        if (!isDiscovered) {
                          setDiscoveredHotspots(prev => new Set([...prev, hotspot.id]));
                          // Show celebration effect
                          setCelebrationEffect({ x: hotspot.x, y: hotspot.y });
                          setTimeout(() => setCelebrationEffect(null), 1000);
                        }
                        onHotspotClick && onHotspotClick(hotspot);
                      }}
                      className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-moderate transition-all duration-fast ${
                        isDiscovered 
                          ? 'bg-success animate-none scale-110' 
                          : 'bg-accent animate-pulse-soft hover:scale-125'
                      }`}
                      style={{ 
                        left: `${hotspot?.x}%`, 
                        top: `${hotspot?.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {!isDiscovered && (
                        <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75"></div>
                      )}
                      {isDiscovered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
                
                {/* Celebration Effect */}
                {celebrationEffect && (
                  <div 
                    className="absolute pointer-events-none"
                    style={{ 
                      left: `${celebrationEffect.x}%`, 
                      top: `${celebrationEffect.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          left: `${Math.cos(i * Math.PI / 4) * 30}px`,
                          top: `${Math.sin(i * Math.PI / 4) * 30}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.6s'
                        }}
                      />
                    ))}
                    <div className="absolute text-2xl animate-bounce">✨</div>
                  </div>
                )}

                {/* Focus Particles */}
                {particles?.map((particle) => (
                  <div
                    key={particle?.id}
                    className="absolute w-1 h-1 bg-primary rounded-full animate-bounce-gentle opacity-60"
                    style={{
                      left: `${particle?.x}%`,
                      top: `${particle?.y}%`,
                      animationDelay: `${particle?.delay}s`
                    }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                  <Icon name="Microscope" size={48} className="mx-auto mb-2 opacity-40" />
                  <p className="font-caption text-sm">Select a specimen to examine</p>
                </div>
              </div>
            )}
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-1 shadow-moderate">
            <span className="font-mono text-sm text-foreground">{zoomLevel?.toFixed(1)}x</span>
          </div>
          
          {/* Zoom Hint - Show when there are hidden hotspots */}
          {selectedSpecimen && getHotspotsForSpecimen().length < (
            selectedSpecimen.category === 'bacteria' || selectedSpecimen.category === 'virus' || 
            selectedSpecimen.category === 'fungi' || selectedSpecimen.category === 'protozoa' ? 3 : 0
          ) && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2 shadow-moderate animate-bounce">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔍</span>
                <span className="font-caption text-xs text-yellow-800 font-semibold">
                  Zoom in to discover more!
                </span>
              </div>
            </div>
          )}

          {/* Focus Level Indicator */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-1 shadow-moderate">
            <div className="flex items-center space-x-2">
              <Icon name="Focus" size={14} className="text-primary" />
              <span className="font-mono text-sm text-foreground">{focusLevel}%</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 space-y-2">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 5}
            className="w-12 h-12 bg-primary hover:bg-primary/80 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-full flex items-center justify-center shadow-moderate transition-colors duration-fast"
          >
            <Icon name="Plus" size={20} strokeWidth={2.5} />
          </button>
          
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            className="w-12 h-12 bg-primary hover:bg-primary/80 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-full flex items-center justify-center shadow-moderate transition-colors duration-fast"
          >
            <Icon name="Minus" size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Focus Controls */}
        <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 space-y-2">
          <button
            onClick={() => handleFocusAdjust('up')}
            disabled={focusLevel >= 100}
            className="w-12 h-12 bg-secondary hover:bg-secondary/80 disabled:bg-muted disabled:text-muted-foreground text-secondary-foreground rounded-full flex items-center justify-center shadow-moderate transition-colors duration-fast"
          >
            <Icon name="ChevronUp" size={20} strokeWidth={2.5} />
          </button>
          
          <button
            onClick={() => handleFocusAdjust('down')}
            disabled={focusLevel <= 0}
            className="w-12 h-12 bg-secondary hover:bg-secondary/80 disabled:bg-muted disabled:text-muted-foreground text-secondary-foreground rounded-full flex items-center justify-center shadow-moderate transition-colors duration-fast"
          >
            <Icon name="ChevronDown" size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {/* Hotspot Information Panel */}
      {activeHotspot && (
        <div className="absolute top-4 right-4 bg-card border-2 border-primary rounded-lg p-4 shadow-pronounced max-w-xs animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                activeHotspot?.type === 'structure' ? 'bg-blue-500' :
                activeHotspot?.type === 'organelle' ? 'bg-purple-500' : 'bg-green-500'
              } animate-pulse-soft`}></div>
              <h4 className="font-heading text-base text-foreground font-bold">{activeHotspot?.label}</h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="p-1 hover:bg-muted rounded-full transition-colors duration-fast"
            >
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Type Badge */}
            <div className="flex items-center space-x-2">
              <Icon 
                name={activeHotspot?.type === 'structure' ? 'Box' : activeHotspot?.type === 'organelle' ? 'Circle' : 'Zap'} 
                size={14} 
                className="text-muted-foreground" 
              />
              <span className="font-caption text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded-full">
                {activeHotspot?.type}
              </span>
            </div>
            
            {/* Description */}
            <p className="font-body text-sm text-foreground leading-relaxed">
              {activeHotspot?.description}
            </p>
            
            {/* Fun Fact */}
            {activeHotspot?.fun && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
                <div className="flex items-start space-x-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <p className="font-caption text-xs font-semibold text-yellow-800 mb-1">Fun Fact!</p>
                    <p className="font-body text-xs text-yellow-900">{activeHotspot?.fun}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Discovery Badge */}
            {discoveredHotspots.has(activeHotspot.id) && (
              <div className="flex items-center justify-center space-x-2 bg-success/10 text-success px-3 py-2 rounded-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-caption text-xs font-semibold">Discovered!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroscopeViewport;