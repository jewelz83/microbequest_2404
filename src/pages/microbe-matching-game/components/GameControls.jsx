import { allowedDifficulties } from '../../../services/gameAccessPolicy.mjs';
import { matchingMetrics } from '../../../services/matchingMetrics.mjs';
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameControls = ({
  score = 0,
  matchedPairs = 0,
  totalPairs = 0,
  timeElapsed = 0,
  moves = 0,
  hintsRemaining = 3,
  gameState = 'playing',
  difficulty = 'easy',
  maxDifficulty = 'easy',
  onHint,
  onPause,
  onRestart,
  onDifficultyChange,
  className = ""
}) => {
  const metrics = matchingMetrics({ matchedPairs, totalPairs, moves });
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
    <div className={`bg-card rounded-xl p-3 sm:p-4 shadow-moderate border border-border ${className}`}>
      {/* Top Row - Score and Timer */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Score */}
          <div className="text-center">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <Icon name="Star" size={16} className="text-accent" strokeWidth={2} />
              <span className="font-heading text-base sm:text-lg text-foreground">{score}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Score</p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <Icon name="Clock" size={16} className="text-primary" strokeWidth={2} />
              <span className="font-mono text-base sm:text-lg text-foreground">{formatTime(timeElapsed)}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Time</p>
          </div>

          {/* Moves */}
          <div className="text-center">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <Icon name="MousePointer" size={16} className="text-secondary" strokeWidth={2} />
              <span className="font-heading text-base sm:text-lg text-foreground">{moves}</span>
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
          <span className="font-caption text-xs sm:text-sm text-muted-foreground capitalize hidden sm:inline">
            {gameState}
          </span>
        </div>
      </div>
      {/* Bottom Row - Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left Controls - Difficulty Selector */}
        <div className="flex items-center space-x-2">
          <span className="font-caption text-xs sm:text-sm text-muted-foreground hidden sm:inline">Level:</span>
          <div className="flex items-center space-x-1">
            {allowedDifficulties(maxDifficulty).map((level) => (
              <button
                key={level}
                onClick={() => onDifficultyChange(level)}
                style={{ touchAction: 'manipulation' }}
                className={`
                  px-2 sm:px-3 py-1.5 rounded-full text-xs font-caption font-medium border transition-all duration-fast min-h-[36px]
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

        {/* Right Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Hint Button */}
          <button
            onClick={onHint}
            disabled={hintsRemaining === 0 || gameState !== 'playing'}
            style={{ touchAction: 'manipulation' }}
            className="relative flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs sm:text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors min-h-[40px]"
          >
            <Icon name="Lightbulb" size={14} />
            <span className="hidden sm:inline">Hint</span>
            <span>({hintsRemaining})</span>
          </button>

          {/* Pause/Resume Button */}
          <button
            onClick={onPause}
            style={{ touchAction: 'manipulation' }}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs sm:text-sm font-medium hover:bg-muted transition-colors min-h-[40px]"
          >
            <Icon name={gameState === 'playing' ? 'Pause' : 'Play'} size={14} />
            <span className="hidden sm:inline">{gameState === 'playing' ? 'Pause' : 'Resume'}</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            style={{ touchAction: 'manipulation' }}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs sm:text-sm font-medium hover:bg-muted transition-colors min-h-[40px]"
          >
            <Icon name="RotateCcw" size={14} />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-caption text-sm text-muted-foreground">{metrics.matchedPairs} of {metrics.totalPairs} pairs</span>
          <span className="font-mono text-sm text-primary" title="Matched cards divided by card flips. Each flip counts as one move.">
            {metrics.efficiencyPercent}% Efficiency
          </span>
        </div>

        <div className="relative">
          <div role="progressbar" aria-label="Matched pairs" aria-valuemin={0} aria-valuemax={metrics.totalPairs} aria-valuenow={metrics.matchedPairs} aria-valuetext={`${metrics.matchedPairs} of ${metrics.totalPairs} pairs matched`} className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-normal animate-smooth"
              style={{ width: `${metrics.progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;