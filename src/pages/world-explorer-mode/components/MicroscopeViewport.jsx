import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MicroscopeViewport = ({ 
  selectedMicrobe = null,
  isOpen = false,
  onClose,
  onNavigateToLab,
  className = ""
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [focusRing, setFocusRing] = useState(50);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const zoomLevels = [
    { level: 1, label: '10x', description: 'Low magnification - cell overview' },
    { level: 2, label: '40x', description: 'Medium magnification - cell details' },
    { level: 3, label: '100x', description: 'High magnification - molecular structures' }
  ];

  useEffect(() => {
    if (isOpen && selectedMicrobe) {
      setZoomLevel(1);
      setFocusRing(50);
    }
  }, [isOpen, selectedMicrobe]);

  const handleZoomChange = (newLevel) => {
    setIsAdjusting(true);
    setZoomLevel(newLevel);
    
    setTimeout(() => {
      setIsAdjusting(false);
    }, 500);
  };

  const handleFocusAdjust = (direction) => {
    const adjustment = direction === 'up' ? 10 : -10;
    const newFocus = Math.max(0, Math.min(100, focusRing + adjustment));
    setFocusRing(newFocus);
  };

  if (!isOpen || !selectedMicrobe) return null;

  const currentZoom = zoomLevels?.find(z => z?.level === zoomLevel);
  const isInFocus = focusRing >= 40 && focusRing <= 60;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className={`
        bg-card rounded-2xl shadow-pronounced border-2 border-border 
        w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Icon name="Microscope" size={20} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-heading text-foreground">Microscope View</h2>
              <p className="font-caption text-sm text-muted-foreground">
                Examining: {selectedMicrobe?.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateToLab}
              className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-button hover:bg-primary/80 transition-colors"
            >
              <Icon name="ExternalLink" size={16} />
              <span className="font-caption text-sm">Open in Lab</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-button transition-colors"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Microscope Viewport */}
          <div className="flex-1 p-6">
            <div className="relative">
              {/* Microscope Frame */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-8 border-gray-800 bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner">
                  {/* Focus Rings */}
                  <div className={`
                    absolute inset-4 rounded-full border-4 transition-all duration-300
                    ${isInFocus ? 'border-success shadow-lg shadow-success/30' : 'border-warning'}
                  `}>
                    <div className={`
                      absolute inset-2 rounded-full border-2 transition-all duration-300
                      ${isInFocus ? 'border-success/50' : 'border-warning/50'}
                    `}>
                      {/* Viewport Content */}
                      <div className="absolute inset-2 rounded-full overflow-hidden bg-black">
                        <div className={`
                          relative w-full h-full transition-all duration-500
                          ${isAdjusting ? 'blur-sm' : isInFocus ? 'blur-0' : 'blur-md'}
                        `}>
                          {/* Microbe Image */}
                          <div 
                            className="absolute inset-0 transition-transform duration-500"
                            style={{ 
                              transform: `scale(${zoomLevel}) translate(${(focusRing - 50) * 0.5}px, ${(focusRing - 50) * 0.3}px)` 
                            }}
                          >
                            <Image
                              src={selectedMicrobe?.image}
                              alt={selectedMicrobe?.imageAlt}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Grid Overlay */}
                          <div className="absolute inset-0 opacity-20">
                            <svg className="w-full h-full">
                              <defs>
                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                          </div>

                          {/* Measurement Scale */}
                          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                            {zoomLevel === 1 ? '10μm' : zoomLevel === 2 ? '5μm' : '1μm'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Focus Indicator */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => handleFocusAdjust('up')}
                      className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    >
                      <Icon name="Plus" size={16} className="text-foreground" />
                    </button>
                    
                    <div className="h-32 w-2 bg-muted rounded-full relative">
                      <div 
                        className={`
                          absolute w-4 h-4 rounded-full transform -translate-x-1 transition-all duration-300
                          ${isInFocus ? 'bg-success' : 'bg-warning'}
                        `}
                        style={{ top: `${focusRing}%` }}
                      ></div>
                    </div>
                    
                    <button
                      onClick={() => handleFocusAdjust('down')}
                      className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    >
                      <Icon name="Minus" size={16} className="text-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex justify-center mt-6 space-x-2">
                {zoomLevels?.map((zoom) => (
                  <button
                    key={zoom?.level}
                    onClick={() => handleZoomChange(zoom?.level)}
                    className={`
                      px-4 py-2 rounded-button transition-all duration-fast
                      ${zoomLevel === zoom?.level 
                        ? 'bg-primary text-primary-foreground shadow-moderate' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    <span className="font-mono text-sm">{zoom?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Information Panel */}
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-muted/20">
            <div className="p-6 space-y-6">
              {/* Microbe Info */}
              <div>
                <h3 className="font-heading text-lg text-foreground mb-2">{selectedMicrobe?.name}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name={
                    selectedMicrobe?.type === 'bacteria' ? 'Circle' :
                    selectedMicrobe?.type === 'virus' ? 'Zap' :
                    selectedMicrobe?.type === 'fungi' ? 'Flower' :
                    selectedMicrobe?.type === 'protozoa' ? 'Waves' : 'Leaf'
                  } size={16} className="text-primary" />
                  <span className="font-caption text-sm text-primary capitalize">{selectedMicrobe?.type}</span>
                </div>
                <p className="font-body text-sm text-foreground leading-relaxed">
                  {selectedMicrobe?.description}
                </p>
              </div>

              {/* Current View Info */}
              <div className="bg-card rounded-lg p-4 border border-border">
                <h4 className="font-heading text-sm text-foreground mb-2">Current View</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-caption text-xs text-muted-foreground">Magnification:</span>
                    <span className="font-mono text-xs text-foreground">{currentZoom?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-caption text-xs text-muted-foreground">Focus:</span>
                    <span className={`font-mono text-xs ${isInFocus ? 'text-success' : 'text-warning'}`}>
                      {isInFocus ? 'Sharp' : 'Adjusting'}
                    </span>
                  </div>
                  <p className="font-caption text-xs text-muted-foreground mt-2">
                    {currentZoom?.description}
                  </p>
                </div>
              </div>

              {/* Fun Facts */}
              <div>
                <h4 className="font-heading text-sm text-foreground mb-3">Fun Facts</h4>
                <div className="space-y-2">
                  {selectedMicrobe?.facts?.map((fact, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={12} className="text-accent mt-1 flex-shrink-0" />
                      <p className="font-body text-xs text-foreground">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discovery Stats */}
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-caption text-sm text-accent">Discovery Points</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} className="text-accent" />
                    <span className="font-mono text-lg font-semibold text-accent">
                      {selectedMicrobe?.points}
                    </span>
                  </div>
                </div>
                <p className="font-caption text-xs text-muted-foreground">
                  Rarity: <span className="capitalize text-accent">{selectedMicrobe?.rarity}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroscopeViewport;