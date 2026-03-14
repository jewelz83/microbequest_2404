import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AnswerFeedback = ({
  isCorrect = false,
  explanation = '',
  microbeInfo = null,
  onContinue,
  isVisible = false,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`
      fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4
      animate-fade-in
    `}>
      <div className={`
        bg-card rounded-2xl shadow-pronounced border border-border 
        w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up
        ${className}
      `}>
        {/* Header */}
        <div className={`
          p-6 text-center border-b border-border
          ${isCorrect ? 'bg-success/10' : 'bg-warning/10'}
        `}>
          <div className={`
            w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
            ${isCorrect ? 'bg-success' : 'bg-warning'}
            ${isAnimating ? 'animate-bounce-gentle' : ''}
          `}>
            <Icon 
              name={isCorrect ? 'CheckCircle' : 'AlertCircle'} 
              size={40} 
              color="white" 
              strokeWidth={2.5} 
            />
          </div>
          
          <h2 className={`
            font-heading text-2xl mb-2
            ${isCorrect ? 'text-success' : 'text-warning'}
          `}>
            {isCorrect ? 'Excellent Work!' : 'Good Try!'}
          </h2>
          
          <p className="font-body text-muted-foreground">
            {isCorrect 
              ? 'You got it right! Let\'s learn more about this.' :'Not quite right, but that\'s how we learn!'
            }
          </p>
        </div>

        {/* Explanation Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Main Explanation */}
          <div className="mb-6">
            <h3 className="font-heading text-lg text-foreground mb-3 flex items-center">
              <Icon name="Lightbulb" size={20} className="text-accent mr-2" />
              Scientific Explanation
            </h3>
            <p className="font-body text-foreground leading-relaxed">
              {explanation}
            </p>
          </div>

          {/* Microbe Information */}
          {microbeInfo && (
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-4">
                {microbeInfo?.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-card border border-border flex-shrink-0">
                    <Image
                      src={microbeInfo?.image}
                      alt={microbeInfo?.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-heading text-primary mb-2">
                    Meet {microbeInfo?.name}
                  </h4>
                  <p className="font-body text-sm text-foreground mb-3">
                    {microbeInfo?.description}
                  </p>
                  
                  {microbeInfo?.facts && microbeInfo?.facts?.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-caption text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Fun Facts
                      </p>
                      {microbeInfo?.facts?.slice(0, 2)?.map((fact, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Icon name="Sparkles" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                          <p className="font-body text-xs text-foreground">
                            {fact}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Educational Diagram */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Microscope" size={18} className="text-primary" />
              <h4 className="font-heading text-sm text-foreground">
                Under the Microscope
              </h4>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { 
                  icon: 'Circle', 
                  label: 'Cell Structure',
                  color: 'text-primary'
                },
                { 
                  icon: 'Zap', 
                  label: 'Energy Source',
                  color: 'text-secondary'
                },
                { 
                  icon: 'Shield', 
                  label: 'Protection',
                  color: 'text-accent'
                }
              ]?.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-card rounded-full flex items-center justify-center border border-border">
                    <Icon name={item?.icon} size={16} className={item?.color} />
                  </div>
                  <p className="font-caption text-xs text-muted-foreground">
                    {item?.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2">
            <Icon name="Trophy" size={16} className="text-accent" />
            <span className="font-body text-sm text-foreground">
              +{isCorrect ? 10 : 5} points earned
            </span>
          </div>
          
          <Button
            variant="default"
            onClick={onContinue}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continue Learning
          </Button>
        </div>

        {/* Celebration Particles */}
        {isCorrect && isAnimating && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)]?.map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-3 h-3 rounded-full animate-bounce-gentle
                  ${i % 3 === 0 ? 'bg-success' : i % 3 === 1 ? 'bg-accent' : 'bg-secondary'}
                `}
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${15 + (i * 8)}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerFeedback;