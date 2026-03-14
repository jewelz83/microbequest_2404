import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const EnvironmentSelector = ({
  currentEnvironment = 'soil',
  onEnvironmentChange,
  onStartExploration,
  discoveredCounts = {},
  className = ""
}) => {
  const environments = [
    {
      id: 'soil',
      name: 'Soil Cross-Section',
      description: 'Explore the rich underground world of soil microorganisms',
      image: "https://images.unsplash.com/photo-1706225663100-1354e86470a2",
      imageAlt: 'High-resolution cross-section view of rich brown soil layers with visible organic matter, root systems and soil particles',
      icon: 'Mountain',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      totalMicrobes: 3,
      difficulty: 'Easy',
      difficultyColor: 'text-success'
    },
    {
      id: 'water',
      name: 'Water Droplet',
      description: 'Dive into the microscopic aquatic ecosystem',
      image: "https://images.unsplash.com/photo-1602051261083-73f809d3f2c2",
      imageAlt: 'Ultra-clear water droplet with pristine transparency showing light refraction and microscopic detail',
      icon: 'Droplets',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      totalMicrobes: 3,
      difficulty: 'Medium',
      difficultyColor: 'text-warning'
    },
    {
      id: 'body',
      name: 'Human Body System',
      description: 'Discover the microorganisms living inside us',
      image: "https://images.unsplash.com/photo-1715523520522-27158f7d75de",
      imageAlt: 'Detailed anatomical illustration of human circulatory system with clearly defined blood vessels and organs',
      icon: 'Heart',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      totalMicrobes: 3,
      difficulty: 'Hard',
      difficultyColor: 'text-error'
    }
  ];

  const handleExploreEnvironment = (environmentId) => {
    // First select the environment
    onEnvironmentChange(environmentId);
    // Then immediately start exploration
    onStartExploration(environmentId);
  };

  return (
    <div className={`bg-card rounded-xl border border-border shadow-moderate p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading text-foreground">Choose Environment</h2>
          <p className="font-caption text-sm text-muted-foreground">
            Click "Explore" to select and immediately start exploring an environment
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-primary">
          <Icon name="Compass" size={20} strokeWidth={2} />
          <span className="font-heading text-sm">Explorer Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {environments?.map((env) => {
          const discoveredCount = discoveredCounts?.[env.id] || 0;
          const isSelected = currentEnvironment === env.id;
          const completionPercentage = discoveredCount / env.totalMicrobes * 100;

          return (
            <div
              key={env.id}
              className={`
                relative rounded-xl border-2 transition-all duration-300 overflow-hidden
                ${isSelected ? 
                  `${env.borderColor} shadow-lg` : 
                  'border-border hover:border-primary/30 hover:shadow-moderate'}
              `}
            >
              {/* Environment Image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={env.image}
                  alt={env.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 filter-none"
                />
                
                {/* Reduced Overlay opacity for clearer images */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/40 to-transparent
                  ${isSelected ? 'from-black/25' : ''}
                `}></div>
                
                {/* Environment Icon */}
                <div className={`
                  absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                  ${env.bgColor} ${env.borderColor} border-2
                `}>
                  <Icon name={env.icon} size={16} className={env.color} strokeWidth={2.5} />
                </div>

                {/* Progress Badge */}
                {discoveredCount > 0 && (
                  <div className="absolute top-3 left-3 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-caption font-semibold">
                    {discoveredCount}/{env.totalMicrobes}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-heading text-sm text-foreground mb-1">{env.name}</h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {env.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Target" size={14} className="text-primary" />
                    <span className="font-caption text-xs text-foreground">
                      {env.totalMicrobes} microbes
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon name="BarChart3" size={14} className={env.difficultyColor} />
                    <span className={`font-caption text-xs ${env.difficultyColor}`}>
                      {env.difficulty}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-caption text-xs text-muted-foreground">Progress</span>
                    <span className="font-mono text-xs text-primary font-semibold">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        completionPercentage === 100 ? 'bg-success' : 'bg-primary'
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Explore Button - Now acts as selector AND starter */}
                <button
                  onClick={() => handleExploreEnvironment(env.id)}
                  className={`
                    w-full flex items-center justify-center py-3 px-4 rounded-button transition-all duration-200
                    font-caption text-sm font-semibold
                    ${isSelected ? 
                      `${env.bgColor} ${env.color} border-2 ${env.borderColor}` :
                      'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm hover:shadow-md'
                    }
                  `}
                >
                  <Icon
                    name={isSelected ? 'CheckCircle' : 'Play'}
                    size={16}
                    strokeWidth={2}
                    className="mr-2"
                  />
                  {isSelected ? 'Selected Environment' : 'Explore Now'}
                </button>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute inset-0 ${env.borderColor} border-2 rounded-xl`}></div>
                  <div className="absolute top-2 left-2 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                    <Icon name="Check" size={10} color="white" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Environment Summary */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="font-body text-sm text-foreground">
              Total Progress: {Object.values(discoveredCounts)?.reduce((sum, count) => sum + count, 0)}/9 microbes discovered
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="font-caption text-xs text-muted-foreground">Complete</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="font-caption text-xs text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-muted rounded-full"></div>
              <span className="font-caption text-xs text-muted-foreground">Not Started</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSelector;