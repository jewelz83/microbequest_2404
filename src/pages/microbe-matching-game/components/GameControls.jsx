import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameControls = ({
  score = 0,
  timeElapsed = 0,
  moves = 0,
  hintsRemaining = 3,
  gameState = 'playing',
  difficulty = 'easy',
  onHint,
  onPause,
  onRestart,
  onDifficultyChange,
  className = ""
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-accent bg-accent/10 border-accent/20';
      case 'hard': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className={`bg-card rounded-xl p-4 shadow-moderate border border-border ${className}`}>
      {/* Top Row - Score and Timer */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-6">
          {/* Score */}
          <div className="text-center">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Star" size={18} className="text-accent" strokeWidth={2} />
              <span className="font-heading text-lg text-foreground">{score}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Score</p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Clock" size={18} className="text-primary" strokeWidth={2} />
              <span className="font-mono text-lg text-foreground">{formatTime(timeElapsed)}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Time</p>
          </div>

          {/* Moves */}
          <div className="text-center">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="MousePointer" size={18} className="text-secondary" strokeWidth={2} />
              <span className="font-heading text-lg text-foreground">{moves}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Moves</p>
          </div>
        </div>

        {/* Game State Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`
            w-3 h-3 rounded-full
            ${gameState === 'playing' ? 'bg-success animate-pulse-soft' :
              gameState === 'paused' ? 'bg-accent' :
              gameState === 'completed' ? 'bg-primary' : 'bg-muted-foreground'}
          `}></div>
          <span className="font-caption text-sm text-muted-foreground capitalize">
            {gameState}
          </span>
        </div>
      </div>
      {/* Bottom Row - Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-2">
          {/* Difficulty Selector */}
          <div className="flex items-center space-x-2">
            <span className="font-caption text-sm text-muted-foreground">Level:</span>
            <div className="flex items-center space-x-1">
              {['easy', 'medium', 'hard']?.map((level) => (
                <button
                  key={level}
                  onClick={() => onDifficultyChange(level)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-caption font-medium border transition-all duration-fast
                    ${difficulty === level 
                      ? getDifficultyColor(level)
                      : 'text-muted-foreground bg-muted border-border hover:bg-muted/80'
                    }
                  `}
                >
                  {level?.charAt(0)?.toUpperCase() + level?.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Hint Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onHint}
            disabled={hintsRemaining === 0 || gameState !== 'playing'}
            iconName="Lightbulb"
            iconPosition="left"
            className="relative"
          >
            Hint ({hintsRemaining})
            {hintsRemaining > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center">
                <span className="font-mono text-xs">{hintsRemaining}</span>
              </div>
            )}
          </Button>

          {/* Pause/Resume Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            iconName={gameState === 'playing' ? 'Pause' : 'Play'}
            iconPosition="left"
          >
            {gameState === 'playing' ? 'Pause' : 'Resume'}
          </Button>

          {/* Restart Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Restart
          </Button>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-caption text-sm text-muted-foreground">Game Progress</span>
          <span className="font-mono text-sm text-primary">
            {Math.round((moves > 0 ? (score / (moves * 10)) * 100 : 0))}% Efficiency
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-normal animate-smooth"
              style={{ width: `${Math.min(100, (score / 1000) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;