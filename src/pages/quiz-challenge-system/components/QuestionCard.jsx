import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QuestionCard = ({
  question,
  onAnswerSelect,
  selectedAnswer = null,
  showResult = false,
  correctAnswer = null,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (showResult) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [showResult]);

  const getAnswerStatus = (optionId) => {
    if (!showResult) return 'default';
    if (optionId === correctAnswer) return 'correct';
    if (optionId === selectedAnswer && optionId !== correctAnswer) return 'incorrect';
    return 'disabled';
  };

  const getAnswerVariant = (status) => {
    switch (status) {
      case 'correct': return 'success';
      case 'incorrect': return 'destructive';
      case 'disabled': return 'outline';
      default: return selectedAnswer === status ? 'default' : 'outline';
    }
  };

  return (
    <div className={`bg-card rounded-2xl shadow-pronounced border border-border overflow-hidden ${className}`}>
      {/* Question Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 border-b border-border">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="HelpCircle" size={24} color="white" strokeWidth={2.5} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-heading text-xl text-foreground mb-2">
              {question?.title}
            </h3>
            <p className="font-body text-foreground leading-relaxed">
              {question?.text}
            </p>
          </div>
        </div>

        {/* Question Image/Diagram */}
        {question?.image && (
          <div className="mt-6">
            <div className="relative w-full h-48 bg-muted rounded-xl overflow-hidden border border-border">
              <Image
                src={question?.image}
                alt={question?.imageAlt}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for scientific accuracy */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Magnifying glass effect */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <Icon name="Search" size={16} className="text-primary" />
              </div>
            </div>
            
            {question?.imageCaption && (
              <p className="font-caption text-sm text-muted-foreground mt-2 text-center">
                {question?.imageCaption}
              </p>
            )}
          </div>
        )}
      </div>
      {/* Answer Options */}
      <div className="p-6">
        <div className="space-y-3">
          {question?.options?.map((option, index) => {
            const status = getAnswerStatus(option?.id);
            const isSelected = selectedAnswer === option?.id;
            
            return (
              <div
                key={option?.id}
                className={`
                  relative transition-all duration-fast
                  ${isAnimating && status === 'correct' ? 'animate-bounce-gentle' : ''}
                  ${isAnimating && status === 'incorrect' ? 'animate-shake' : ''}
                `}
              >
                <Button
                  variant={getAnswerVariant(status === 'default' ? option?.id : status)}
                  fullWidth
                  disabled={showResult}
                  onClick={() => onAnswerSelect(option?.id)}
                  className={`
                    justify-start text-left p-4 h-auto relative overflow-hidden
                    ${isSelected && !showResult ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  {/* Option Content */}
                  <div className="flex items-center space-x-4 w-full">
                    {/* Option Letter */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${status === 'correct' ? 'bg-success text-success-foreground' :
                        status === 'incorrect' ? 'bg-error text-error-foreground' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      <span className="font-heading text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>

                    {/* Option Text */}
                    <div className="flex-1">
                      <p className="font-body text-sm leading-relaxed">
                        {option?.text}
                      </p>
                    </div>

                    {/* Option Image */}
                    {option?.image && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={option?.image}
                          alt={option?.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Result Icon */}
                    {showResult && (
                      <div className="flex-shrink-0">
                        {status === 'correct' && (
                          <Icon name="CheckCircle" size={24} className="text-success" strokeWidth={2.5} />
                        )}
                        {status === 'incorrect' && (
                          <Icon name="XCircle" size={24} className="text-error" strokeWidth={2.5} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Animated Background for Correct Answer */}
                  {showResult && status === 'correct' && (
                    <div className="absolute inset-0 bg-success/10 animate-pulse-soft"></div>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Question Metadata */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="font-caption text-muted-foreground">
                {question?.timeLimit || 60}s
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Icon name="Target" size={16} className="text-accent" />
              <span className="font-caption text-muted-foreground">
                {question?.difficulty || 'Medium'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Icon name="Star" size={16} className="text-accent" />
            <span className="font-mono text-sm text-accent font-semibold">
              {question?.points || 10} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;