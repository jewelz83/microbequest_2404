import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const BodyLocationSelector = ({ 
  locations, 
  onSelectLocation, 
  difficulty, 
  setDifficulty 
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const difficultySettings = {
    easy: {
      label: 'Easy',
      color: 'bg-green-500',
      description: 'Slower waves, clear bacteria marking, larger targets',
      multiplier: '1x',
      features: ['Slower bacteria', 'Clear good/bad marking', '3 bacteria types', 'More time to react']
    },
    medium: {
      label: 'Medium', 
      color: 'bg-yellow-500',
      description: 'Moderate speed, some bacteria require thinking',
      multiplier: '1.5x',
      features: ['Medium speed', 'Context clues needed', '5 bacteria types', 'Standard timing']
    },
    hard: {
      label: 'Hard',
      color: 'bg-red-500', 
      description: 'Fast waves, complex bacteria types, strategy matters',
      multiplier: '2x',
      features: ['Fast waves', 'Complex strains', '7+ bacteria types', 'Quick decisions']
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocationId(location?.id);
  };

  const handleStartGame = () => {
    if (selectedLocationId) {
      const location = locations?.find(loc => loc?.id === selectedLocationId);
      onSelectLocation(location);
    }
  };

  const getLocationIcon = (locationId) => {
    switch (locationId) {
      case 'gut': return 'Activity';
      case 'skin': return 'User';
      case 'mouth': return 'MessageCircle';
      case 'lungs': return 'Wind';
      default: return 'Circle';
    }
  };

  const getLocationColor = (locationId) => {
    switch (locationId) {
      case 'gut': return 'from-amber-500 to-orange-500';
      case 'skin': return 'from-pink-500 to-rose-500';
      case 'mouth': return 'from-blue-500 to-cyan-500';
      case 'lungs': return 'from-indigo-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-heading text-foreground mb-3">
          Choose Your Defense Mission
        </h2>
        <p className="font-body text-muted-foreground max-w-2xl mx-auto">
          Select a body location to protect and set your difficulty level. Each location has unique challenges and learning opportunities!
        </p>
      </div>
      {/* Difficulty Selection */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-heading text-foreground mb-2">
            Select Difficulty Level
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            Choose your challenge level to customize the learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(difficultySettings)?.map(([key, setting]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-fast
                ${difficulty === key 
                  ? 'border-primary bg-primary/10 shadow-moderate' 
                  : 'border-border bg-muted hover:border-primary/50'
                }
              `}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${setting?.color}`}>
                  <Icon name="Shield" size={24} color="white" strokeWidth={2.5} />
                </div>
                
                <h4 className="font-heading text-foreground font-semibold mb-1">
                  {setting?.label}
                </h4>
                
                <p className="font-caption text-xs text-muted-foreground mb-3 leading-relaxed">
                  {setting?.description}
                </p>

                <div className="space-y-1">
                  {setting?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <Icon name="Check" size={12} className="text-green-600" />
                      <span className="font-caption text-xs text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-xs font-mono text-primary font-semibold">
                  Points: {setting?.multiplier}
                </div>

                {difficulty === key && (
                  <div className="absolute top-2 right-2">
                    <Icon name="CheckCircle" size={20} className="text-primary" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Location Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations?.map((location) => {
          const isSelected = selectedLocationId === location?.id;
          const isHovered = hoveredLocation === location?.id;

          return (
            <button
              key={location?.id}
              onClick={() => handleLocationSelect(location)}
              onMouseEnter={() => setHoveredLocation(location?.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              className={`
                group relative p-6 rounded-2xl border-2 text-left transition-all duration-fast
                ${isSelected 
                  ? 'border-primary bg-primary/10 shadow-pronounced' 
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-moderate hover:-translate-y-1'
                }
              `}
            >
              {/* Background Gradient */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-10 bg-gradient-to-br ${getLocationColor(location?.id)}
                ${isHovered ? 'opacity-20' : ''}
                transition-opacity duration-fast
              `} />
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    bg-gradient-to-br ${getLocationColor(location?.id)}
                    ${isSelected || isHovered ? 'shadow-moderate' : ''}
                    transition-shadow duration-fast
                  `}>
                    <Icon 
                      name={getLocationIcon(location?.id)} 
                      size={24} 
                      color="white" 
                      strokeWidth={2.5} 
                    />
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="Check" size={16} color="white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Location Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-heading text-foreground font-semibold mb-1">
                      {location?.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {location?.description}
                    </p>
                  </div>

                  {/* Challenge Details */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Target" size={14} className="text-primary" />
                      <span className="font-heading text-xs font-semibold text-foreground">
                        Challenge Goal
                      </span>
                    </div>
                    <p className="font-caption text-xs text-muted-foreground">
                      {location?.winCondition}
                    </p>
                  </div>

                  {/* Fun Fact */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon name="Lightbulb" size={14} className="text-blue-600" />
                      <span className="font-heading text-xs font-semibold text-blue-800">
                        Did You Know?
                      </span>
                    </div>
                    <p className="font-caption text-xs text-blue-700">
                      {location?.fact}
                    </p>
                  </div>

                  {/* Bacteria Types Preview */}
                  <div>
                    <p className="font-caption text-xs text-muted-foreground mb-2">
                      You'll encounter:
                    </p>
                    <div className="flex items-center space-x-2">
                      {/* Good Bacteria */}
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Icon name="Smile" size={8} color="white" strokeWidth={2} />
                        </div>
                        <span className="font-caption text-xs text-green-700">
                          {location?.goodBacteria?.length || 0} good
                        </span>
                      </div>
                      
                      {/* Bad Bacteria */}
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <Icon name="Frown" size={8} color="white" strokeWidth={2} />
                        </div>
                        <span className="font-caption text-xs text-red-700">
                          {location?.enemyTypes?.length || 0} harmful
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Elements */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)]?.map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-primary/60 animate-bounce-gentle"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${10 + i * 20}%`,
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {/* Start Game Button */}
      <div className="text-center">
        <button
          onClick={handleStartGame}
          disabled={!selectedLocationId}
          className={`
            px-8 py-4 rounded-button font-body font-semibold text-lg
            transition-all duration-fast flex items-center space-x-3 mx-auto
            ${selectedLocationId
              ? 'bg-primary text-primary-foreground shadow-moderate hover:shadow-pronounced hover:-translate-y-0.5'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          <Icon 
            name="Play" 
            size={20} 
            strokeWidth={2.5} 
            className={selectedLocationId ? '' : 'opacity-50'} 
          />
          <span>Start Defense Mission</span>
          <Icon 
            name="ArrowRight" 
            size={20} 
            strokeWidth={2.5}
            className={`transition-transform duration-fast ${selectedLocationId ? 'group-hover:translate-x-1' : 'opacity-50'}`}
          />
        </button>

        {!selectedLocationId && (
          <p className="font-caption text-xs text-muted-foreground mt-2">
            Please select a body location and difficulty to continue
          </p>
        )}

        {selectedLocationId && (
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg max-w-md mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="font-heading text-sm text-primary font-semibold">
                Ready to Start!
              </span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">
              Location: <span className="text-foreground font-medium">
                {locations?.find(loc => loc?.id === selectedLocationId)?.name}
              </span>
              <br />
              Difficulty: <span className="text-foreground font-medium">
                {difficultySettings?.[difficulty]?.label}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyLocationSelector;