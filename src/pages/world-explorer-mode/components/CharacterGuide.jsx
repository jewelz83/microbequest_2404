import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import CharacterSpriteSystem from '../../../components/ui/CharacterSpriteSystem';

const CharacterGuide = ({
  currentEnvironment = 'soil',
  discoveredCount = 0,
  isExploring = false,
  onHintRequest,
  onClose,
  className = ""
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const charlieMessages = {
    welcome: `Howdy there, explorer! Welcome to the ${currentEnvironment} environment! I'm Charlie the Zebra, and I'll help you discover amazing microorganisms hiding all around us.`,
    exploring: `Great job exploring, partner! Use your magnifying glass to search carefully. Microorganisms love to hide in the most interesting places!`,
    discovery: `Fantastic discovery, superstar! You found a microorganism! Each one has its own special role in nature's big adventure. Keep exploring to find more!`,hint: `Psst! Here's a zebra tip - try looking near the darker, moist areas where microorganisms like to gather and party together!`,
    encouragement: `You're doing amazing, young scientist! Remember, microorganisms are nature's tiny helpers - they're everywhere helping make our world wonderful!`
  };

  useEffect(() => {
    let message;
    
    if (discoveredCount === 0 && !isExploring) {
      message = charlieMessages?.welcome;
    } else if (isExploring && discoveredCount === 0) {
      message = charlieMessages?.exploring;
    } else if (discoveredCount > 0) {
      message = charlieMessages?.discovery;
    } else {
      message = charlieMessages?.welcome;
    }

    setCurrentMessage(message);
  }, [discoveredCount, isExploring, currentEnvironment]);

  const handleHintClick = () => {
    setCurrentMessage(charlieMessages?.hint);
    onHintRequest && onHintRequest();

    setTimeout(() => {
      setCurrentMessage(charlieMessages?.encouragement);
    }, 3000);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <div className={`fixed bottom-4 left-4 z-40 ${className}`}>
      {/* Character Container */}
      <div className={`
        bg-card border-2 border-secondary/30 rounded-2xl shadow-pronounced 
        transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        max-w-sm
      `}>
        {/* Character Header */}
        <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-t-xl border-b border-secondary/20">
          <div className="flex items-center space-x-3">
            {/* Charlie Display */}
            <div className="relative">
              <CharacterSpriteSystem
                character="charlie-zebra"
                size="medium"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div>
              <h4 className="font-heading text-sm text-secondary">Charlie</h4>
              <p className="font-caption text-xs text-muted-foreground">Explorer Guide</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleVisibility}
              className="p-1 hover:bg-secondary/20 rounded-full transition-colors duration-300"
            >
              <Icon name={isVisible ? 'ChevronDown' : 'ChevronUp'} size={16} className="text-muted-foreground" />
            </button>
            
            {onClose && (
              <button
                onClick={handleClose}
                className="p-1 hover:bg-secondary/20 rounded-full transition-colors duration-300"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Message Content */}
        {isVisible && (
          <div className="p-4 space-y-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-body text-sm text-foreground leading-relaxed">
                {currentMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleHintClick}
                className="flex items-center space-x-2 px-3 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors duration-300 border border-accent/20"
              >
                <Icon name="Lightbulb" size={14} strokeWidth={2} />
                <span className="font-caption text-xs font-medium">Get Hint</span>
              </button>
              
              <button 
                onClick={handleClose}
                className="flex items-center space-x-1 px-3 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-full transition-colors duration-300"
              >
                <Icon name="ThumbsUp" size={14} strokeWidth={2} />
                <span className="font-caption text-xs font-medium">Got it!</span>
              </button>
            </div>
          </div>
        )}

        {/* Speech Bubble Tail */}
        <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-card"></div>
      </div>

      {/* Discovery Celebration Display */}
      {discoveredCount > 0 && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="bg-success text-success-foreground rounded-full px-4 py-2 shadow-moderate">
            <div className="flex items-center space-x-2">
              <Icon name="Trophy" size={16} />
              <span className="font-caption text-sm font-medium">{discoveredCount} Found!</span>
            </div>
          </div>
        </div>
      )}

      {/* Minimized State */}
      {!isVisible && (
        <button
          onClick={toggleVisibility}
          className="mt-2 w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-moderate hover:shadow-pronounced transition-all duration-300 flex items-center justify-center"
        >
          <Icon name="MessageCircle" size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default CharacterGuide;