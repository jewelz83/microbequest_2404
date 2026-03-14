import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const QuizResults = ({
  score = 0,
  totalQuestions = 10,
  correctAnswers = 0,
  timeSpent = 0,
  achievements = [],
  onRetry,
  onContinue,
  onBackToMenu,
  isVisible = false,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const maxScore = totalQuestions * 10;
  const scorePercentage = (score / maxScore) * 100;

  const getPerformanceLevel = () => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-success', icon: 'Trophy' };
    if (accuracy >= 75) return { level: 'Great', color: 'text-primary', icon: 'Star' };
    if (accuracy >= 60) return { level: 'Good', color: 'text-warning', icon: 'ThumbsUp' };
    return { level: 'Keep Learning', color: 'text-muted-foreground', icon: 'BookOpen' };
  };

  const performance = getPerformanceLevel();

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      if (accuracy >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [isVisible, accuracy]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className={`
        bg-card rounded-2xl shadow-pronounced border border-border 
        w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up
        ${className}
      `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 text-center border-b border-border">
          <div className={`
            w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center
            ${accuracy >= 80 ? 'bg-success' : accuracy >= 60 ? 'bg-primary' : 'bg-warning'}
            ${isAnimating ? 'animate-bounce-gentle' : ''}
          `}>
            <Icon 
              name={performance?.icon} 
              size={48} 
              color="white" 
              strokeWidth={2.5} 
            />
          </div>
          
          <h2 className="font-heading text-3xl text-foreground mb-2">
            Quiz Complete!
          </h2>
          
          <p className={`font-body text-lg ${performance?.color} font-semibold`}>
            {performance?.level}
          </p>
        </div>

        {/* Results Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Score Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center bg-muted/50 rounded-xl p-4">
              <div className="w-12 h-12 mx-auto mb-2 bg-accent rounded-full flex items-center justify-center">
                <Icon name="Star" size={24} color="white" strokeWidth={2.5} />
              </div>
              <p className="font-mono text-2xl font-bold text-foreground">{score}</p>
              <p className="font-caption text-sm text-muted-foreground">Total Score</p>
              <p className="font-caption text-xs text-muted-foreground">
                out of {maxScore}
              </p>
            </div>

            <div className="text-center bg-muted/50 rounded-xl p-4">
              <div className="w-12 h-12 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Target" size={24} color="white" strokeWidth={2.5} />
              </div>
              <p className="font-mono text-2xl font-bold text-foreground">{accuracy}%</p>
              <p className="font-caption text-sm text-muted-foreground">Accuracy</p>
              <p className="font-caption text-xs text-muted-foreground">
                {correctAnswers}/{totalQuestions} correct
              </p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-xl p-4 mb-6">
            <h3 className="font-heading text-lg text-foreground mb-4 flex items-center">
              <Icon name="BarChart3" size={20} className="text-primary mr-2" />
              Performance Details
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-10 h-10 mx-auto mb-2 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={18} className="text-success" />
                </div>
                <p className="font-mono text-lg font-semibold text-success">{correctAnswers}</p>
                <p className="font-caption text-xs text-muted-foreground">Correct</p>
              </div>
              
              <div>
                <div className="w-10 h-10 mx-auto mb-2 bg-error/10 rounded-full flex items-center justify-center">
                  <Icon name="XCircle" size={18} className="text-error" />
                </div>
                <p className="font-mono text-lg font-semibold text-error">{totalQuestions - correctAnswers}</p>
                <p className="font-caption text-xs text-muted-foreground">Incorrect</p>
              </div>
              
              <div>
                <div className="w-10 h-10 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="Clock" size={18} className="text-muted-foreground" />
                </div>
                <p className="font-mono text-lg font-semibold text-foreground">
                  {Math.floor(timeSpent / 60)}:{(timeSpent % 60)?.toString()?.padStart(2, '0')}
                </p>
                <p className="font-caption text-xs text-muted-foreground">Time</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {achievements?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-heading text-lg text-foreground mb-3 flex items-center">
                <Icon name="Award" size={20} className="text-accent mr-2" />
                New Achievements
              </h3>
              
              <div className="space-y-2">
                {achievements?.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`
                      flex items-center space-x-3 bg-accent/10 border border-accent/20 
                      rounded-lg p-3 animate-slide-up
                    `}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Icon name="Medal" size={20} color="white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-semibold text-foreground">{achievement?.title}</p>
                      <p className="font-caption text-sm text-muted-foreground">{achievement?.description}</p>
                    </div>
                    <div className="text-accent font-mono text-sm font-semibold">
                      +{achievement?.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Progress */}
          <div className="bg-muted/30 rounded-xl p-4">
            <h4 className="font-heading text-sm text-foreground mb-3 flex items-center">
              <Icon name="TrendingUp" size={16} className="text-primary mr-2" />
              Learning Progress
            </h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-caption text-xs text-muted-foreground">Microbiology Knowledge</span>
                  <span className="font-mono text-xs text-primary">{Math.min(accuracy + 10, 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-normal"
                    style={{ width: `${Math.min(accuracy + 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="font-caption text-muted-foreground">
                  Keep exploring to unlock more microbes!
                </span>
                <div className="flex items-center space-x-1">
                  <Icon name="Microscope" size={12} className="text-secondary" />
                  <span className="font-mono text-secondary">+3 discoveries</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={onBackToMenu}
            iconName="Home"
            iconPosition="left"
          >
            Main Menu
          </Button>
          
          <div className="flex items-center space-x-3">
            {accuracy < 80 && (
              <Button
                variant="secondary"
                onClick={onRetry}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Try Again
              </Button>
            )}
            
            <Button
              variant="default"
              onClick={onContinue}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Continue Learning
            </Button>
          </div>
        </div>

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)]?.map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-2 h-2 rounded-full animate-bounce-gentle
                  ${i % 4 === 0 ? 'bg-success' : 
                    i % 4 === 1 ? 'bg-primary' : 
                    i % 4 === 2 ? 'bg-accent' : 'bg-secondary'}
                `}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResults;