import React from 'react';
import Icon from '../../../components/AppIcon';
import { Link } from 'react-router-dom';

const GameModeStats = ({ 
  gameStats = [], 
  className = "" 
}) => {
  const defaultGameStats = [
    {
      id: 'matching',
      name: 'Microbe Matching',
      route: '/microbe-matching-game',
      icon: 'Puzzle',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      completionPercentage: 85,
      totalLevels: 12,
      completedLevels: 10,
      bestScore: 2450,
      timeSpent: '2h 15m',
      lastPlayed: '2025-10-16',
      achievements: 8,
      description: 'Match microorganisms with their names and characteristics'
    },
    {
      id: 'explorer',
      name: 'World Explorer',
      route: '/world-explorer-mode',
      icon: 'Compass',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      completionPercentage: 60,
      totalLevels: 15,
      completedLevels: 9,
      bestScore: 1890,
      timeSpent: '1h 45m',
      lastPlayed: '2025-10-17',
      achievements: 5,
      description: 'Discover hidden microbes in different environments'
    },
    {
      id: 'quiz',
      name: 'Quiz Challenge',
      route: '/quiz-challenge-system',
      icon: 'Brain',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      completionPercentage: 45,
      totalLevels: 20,
      completedLevels: 9,
      bestScore: 1650,
      timeSpent: '1h 30m',
      lastPlayed: '2025-10-15',
      achievements: 4,
      description: 'Test your knowledge with interactive quizzes'
    },
    {
      id: 'microscope',
      name: 'Discovery Lab',
      route: '/microscope-discovery-lab',
      icon: 'Microscope',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      completionPercentage: 30,
      totalLevels: 10,
      completedLevels: 3,
      bestScore: 980,
      timeSpent: '45m',
      lastPlayed: '2025-10-14',
      achievements: 2,
      description: 'Examine specimens under the microscope'
    }
  ];

  const stats = gameStats?.length > 0 ? gameStats : defaultGameStats;

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-primary';
    if (percentage >= 40) return 'bg-accent';
    return 'bg-warning';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading text-foreground">Game Mode Statistics</h3>
          <p className="font-caption text-sm text-muted-foreground">
            Your progress across all learning activities
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-success" />
          <span className="font-body text-sm text-foreground">Overall Progress</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats?.map((game) => (
          <Link
            key={game?.id}
            to={game?.route}
            className="block group"
          >
            <div className={`
              bg-card border-2 ${game?.borderColor} rounded-xl p-6 
              transition-all duration-300 hover:shadow-lg hover:scale-105
              ${game?.bgColor} hover:border-opacity-60
            `}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${game?.bgColor} border-2 ${game?.borderColor}
                  `}>
                    <Icon 
                      name={game?.icon} 
                      size={24} 
                      className={game?.color}
                      strokeWidth={2.5}
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-heading text-lg text-foreground group-hover:text-primary transition-colors">
                      {game?.name}
                    </h4>
                    <p className="font-caption text-xs text-muted-foreground">
                      {game?.description}
                    </p>
                  </div>
                </div>
                
                <Icon 
                  name="ExternalLink" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-colors" 
                />
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-sm text-foreground">Progress</span>
                  <span className="font-mono text-sm font-semibold text-primary">
                    {game?.completionPercentage}%
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(game?.completionPercentage)}`}
                    style={{ width: `${game?.completionPercentage}%` }}
                  >
                    <div className="h-full bg-white/20 animate-pulse-soft rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Icon name="Target" size={14} className={game?.color} />
                    <span className="font-mono text-lg font-bold text-foreground">
                      {game?.completedLevels}
                    </span>
                    <span className="font-body text-sm text-muted-foreground">
                      /{game?.totalLevels}
                    </span>
                  </div>
                  <p className="font-caption text-xs text-muted-foreground">Levels</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Icon name="Trophy" size={14} className={game?.color} />
                    <span className="font-mono text-lg font-bold text-foreground">
                      {game?.bestScore?.toLocaleString()}
                    </span>
                  </div>
                  <p className="font-caption text-xs text-muted-foreground">Best Score</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Icon name="Clock" size={14} className={game?.color} />
                    <span className="font-mono text-sm font-bold text-foreground">
                      {game?.timeSpent}
                    </span>
                  </div>
                  <p className="font-caption text-xs text-muted-foreground">Time Played</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Icon name="Star" size={14} className={game?.color} />
                    <span className="font-mono text-lg font-bold text-foreground">
                      {game?.achievements}
                    </span>
                  </div>
                  <p className="font-caption text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>

              {/* Last Played */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-caption text-xs text-muted-foreground">
                  Last played: {new Date(game.lastPlayed)?.toLocaleDateString()}
                </span>
                
                <div className="flex items-center space-x-1">
                  <span className="font-caption text-xs text-primary group-hover:text-primary/80">
                    Continue Playing
                  </span>
                  <Icon 
                    name="ArrowRight" 
                    size={12} 
                    className="text-primary group-hover:text-primary/80 group-hover:translate-x-1 transition-all" 
                  />
                </div>
              </div>

              {/* Animated Progress Indicator */}
              {game?.completionPercentage > 0 && (
                <div className="absolute top-2 right-2">
                  <div className={`
                    w-3 h-3 rounded-full animate-pulse-soft
                    ${game?.completionPercentage === 100 ? 'bg-success' : 'bg-primary'}
                  `}></div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      {/* Overall Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading text-lg text-foreground mb-1">Overall Performance</h4>
            <p className="font-body text-sm text-muted-foreground">
              Keep up the great work! You're making excellent progress.
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="TrendingUp" size={20} className="text-success" />
              <span className="font-mono text-2xl font-bold text-foreground">
                {Math.round(stats?.reduce((sum, game) => sum + game?.completionPercentage, 0) / stats?.length)}%
              </span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Average Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeStats;