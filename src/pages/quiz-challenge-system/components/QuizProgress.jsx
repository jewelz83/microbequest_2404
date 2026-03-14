import React from 'react';
import Icon from '../../../components/AppIcon';

const QuizProgress = ({
  currentQuestion = 1,
  totalQuestions = 10,
  score = 0,
  timeRemaining = null,
  difficulty = 'medium',
  className = ""
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  const accuracy = currentQuestion > 1 ? Math.round((score / ((currentQuestion - 1) * 10)) * 100) : 0;

  const difficultyConfig = {
    easy: { color: 'text-success', bgColor: 'bg-success/10', icon: 'Smile' },
    medium: { color: 'text-warning', bgColor: 'bg-warning/10', icon: 'Brain' },
    hard: { color: 'text-error', bgColor: 'bg-error/10', icon: 'Zap' }
  };

  const currentDifficulty = difficultyConfig?.[difficulty] || difficultyConfig?.medium;

  return (
    <div className={`bg-card rounded-xl shadow-moderate border border-border p-4 ${className}`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Target" size={16} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-heading text-sm text-foreground">Quiz Progress</h3>
            <p className="font-caption text-xs text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Timer */}
        {timeRemaining !== null && (
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full
            ${timeRemaining <= 10 ? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'}
          `}>
            <Icon 
              name="Clock" 
              size={14} 
              strokeWidth={2}
              className={timeRemaining <= 10 ? 'animate-pulse-soft' : ''}
            />
            <span className="font-mono text-sm font-semibold">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60)?.toString()?.padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs text-muted-foreground">Overall Progress</span>
          <span className="font-mono text-xs text-primary font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-normal animate-smooth relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse-soft rounded-full"></div>
            </div>
          </div>
          
          {/* Progress Markers */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {Array.from({ length: Math.min(totalQuestions, 10) }, (_, i) => (
              <div
                key={i}
                className={`
                  w-1 h-4 rounded-full transition-colors duration-fast
                  ${i < currentQuestion ? 'bg-primary' : 'bg-muted-foreground/30'}
                `}
              ></div>
            ))}
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Score */}
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1 bg-accent/10 rounded-full flex items-center justify-center">
            <Icon name="Star" size={14} className="text-accent" strokeWidth={2} />
          </div>
          <p className="font-mono text-sm font-semibold text-foreground">{score}</p>
          <p className="font-caption text-xs text-muted-foreground">Points</p>
        </div>

        {/* Accuracy */}
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Target" size={14} className="text-success" strokeWidth={2} />
          </div>
          <p className="font-mono text-sm font-semibold text-foreground">{accuracy}%</p>
          <p className="font-caption text-xs text-muted-foreground">Accuracy</p>
        </div>

        {/* Difficulty */}
        <div className="text-center">
          <div className={`w-8 h-8 mx-auto mb-1 ${currentDifficulty?.bgColor} rounded-full flex items-center justify-center`}>
            <Icon name={currentDifficulty?.icon} size={14} className={currentDifficulty?.color} strokeWidth={2} />
          </div>
          <p className={`font-mono text-sm font-semibold ${currentDifficulty?.color} capitalize`}>
            {difficulty}
          </p>
          <p className="font-caption text-xs text-muted-foreground">Level</p>
        </div>
      </div>
      {/* Achievement Indicators */}
      {accuracy >= 80 && currentQuestion > 3 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center space-x-2 text-accent">
            <Icon name="Trophy" size={16} strokeWidth={2} />
            <span className="font-caption text-xs font-medium">
              Excellent Performance!
            </span>
            <div className="flex space-x-1">
              {[...Array(3)]?.map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-accent rounded-full animate-pulse-soft"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizProgress;