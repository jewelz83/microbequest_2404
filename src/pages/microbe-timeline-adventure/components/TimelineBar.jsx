import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TimelineBar = ({ 
  eras = [], 
  selectedEra, 
  unlockedEras = [], 
  onEraSelect,
  className = "" 
}) => {
  const [hoveredEra, setHoveredEra] = useState(null);

  const getEraColor = (eraId) => {
    const colors = {
      discovery: 'amber',
      germTheory: 'emerald', 
      modern: 'blue',
      dnaRevolution: 'purple',
      modernAge: 'cyan'
    };
    return colors?.[eraId] || 'gray';
  };

  const getEraIcon = (eraId) => {
    const icons = {
      discovery: 'Search',
      germTheory: 'Shield',
      modern: 'Zap',
      dnaRevolution: 'Dna',
      modernAge: 'Rocket'
    };
    return icons?.[eraId] || 'Circle';
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 ${className}`}>
      <div className="bg-card/95 backdrop-blur-sm border-t border-border shadow-pronounced">
        <div className="container mx-auto px-4 py-4">
          {/* Timeline Header */}
          <div className="text-center mb-4">
            <h3 className="font-heading text-lg text-foreground mb-1">Timeline Navigator</h3>
            <p className="font-caption text-sm text-muted-foreground">
              Travel through 350+ years of microbiology discoveries
            </p>
          </div>

          {/* Era Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-border rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-moderate"
                style={{ 
                  width: `${(unlockedEras?.length / eras?.length) * 100}%` 
                }}
              />
            </div>

            {/* Era Markers */}
            <div className="flex justify-between items-center relative">
              {eras?.map((era, index) => {
                const isUnlocked = unlockedEras?.includes(era?.id);
                const isSelected = selectedEra === era?.id;
                const isCompleted = era?.completed;
                const color = getEraColor(era?.id);
                
                return (
                  <div key={era?.id} className="flex flex-col items-center">
                    {/* Era Marker */}
                    <button
                      onClick={() => {
                        if (isUnlocked) {
                          // STEP 2: Add click test with more detailed logging
                          const eraNumber = index + 1;
                          console.log(`Era ${eraNumber} clicked`);
                          alert(`You clicked Era ${eraNumber}!`);
                          onEraSelect(era?.id);
                        }
                      }}
                      onMouseEnter={() => setHoveredEra(era?.id)}
                      onMouseLeave={() => setHoveredEra(null)}
                      disabled={!isUnlocked}
                      className={`
                        relative w-16 h-16 rounded-full flex items-center justify-center
                        transition-all duration-fast hover:scale-110 active:scale-95
                        ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                        ${isSelected 
                          ? `bg-${color}-500 text-white shadow-pronounced ring-4 ring-${color}-200` 
                          : isCompleted
                          ? `bg-success text-white shadow-moderate`
                          : isUnlocked
                          ? `bg-card border-2 border-${color}-300 text-${color}-600 hover:bg-${color}-50 shadow-moderate`
                          : 'bg-muted border-2 border-border text-muted-foreground'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Icon name="CheckCircle" size={24} strokeWidth={2.5} />
                      ) : (
                        <Icon 
                          name={getEraIcon(era?.id)} 
                          size={24} 
                          strokeWidth={2.5} 
                        />
                      )}
                      
                      {/* Pulse animation for selected era */}
                      {isSelected && (
                        <div className={`absolute inset-0 rounded-full bg-${color}-400 animate-ping opacity-30`} />
                      )}
                      
                      {/* Unlock indicator */}
                      {!isUnlocked && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-muted border-2 border-card rounded-full flex items-center justify-center">
                          <Icon name="Lock" size={12} className="text-muted-foreground" />
                        </div>
                      )}
                    </button>

                    {/* Era Info */}
                    <div className="mt-3 text-center max-w-24">
                      <h4 className="font-heading text-xs text-foreground font-semibold leading-tight">
                        {era?.name}
                      </h4>
                      <p className="font-mono text-xs text-muted-foreground mt-1">
                        {era?.period}
                      </p>
                    </div>

                    {/* Hover Tooltip */}
                    {hoveredEra === era?.id && isUnlocked && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50">
                        <div className="bg-black text-white rounded-lg px-3 py-2 text-sm whitespace-nowrap shadow-pronounced">
                          <p className="font-caption font-semibold">{era?.subtitle}</p>
                          <p className="font-body text-xs opacity-90 mt-1">
                            {era?.keyEvents?.length} discoveries to explore
                          </p>
                          
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-between mt-4 text-xs">
              <span className="font-mono text-muted-foreground">1670</span>
              <span className="font-mono text-muted-foreground">1800</span>
              <span className="font-mono text-muted-foreground">1900</span>
              <span className="font-mono text-muted-foreground">1950</span>
              <span className="font-mono text-muted-foreground">2000</span>
              <span className="font-mono text-muted-foreground">2024</span>
            </div>
          </div>

          {/* Current Era Info Bar */}
          {selectedEra && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getEraIcon(selectedEra)} 
                    size={20} 
                    className="text-primary" 
                    strokeWidth={2.5} 
                  />
                  <div>
                    <span className="font-heading text-sm text-foreground font-semibold">
                      {eras?.find(e => e?.id === selectedEra)?.name}
                    </span>
                    <p className="font-body text-xs text-muted-foreground">
                      {eras?.find(e => e?.id === selectedEra)?.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Icon name="Target" size={14} className="text-primary" />
                      <span className="font-mono text-foreground">
                        {eras?.find(e => e?.id === selectedEra)?.keyEvents?.filter(e => e?.completed)?.length || 0}/
                        {eras?.find(e => e?.id === selectedEra)?.keyEvents?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} className="text-accent" />
                      <span className="font-mono text-foreground">
                        {eras?.find(e => e?.id === selectedEra)?.period}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineBar;