import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import CharacterSpriteSystem from '../../../components/ui/CharacterSpriteSystem';

const CharacterGuidePanel = ({
  gameState = 'playing',
  score = 0,
  matches = 0,
  moves = 0,
  showHint = false,
  hintMessage = '',
  onClose,
  className = ""
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Dynamic messages based on game state
  const messages = {
    welcome: "Welcome to the Microbe Matching Game! Click on cards to find matching pairs of microorganisms.",
    playing: "Great job! Keep looking for matching microbe pairs. Use your scientific observation skills!",
    firstMatch: "Excellent! You found your first match! Each microbe has unique characteristics to remember.",
    goodProgress: "You're doing wonderfully! Remember, bacteria are single-celled organisms that come in many shapes.",
    almostDone: "Almost finished! You\'re becoming a real microbe expert. Just a few more matches to go!",
    completed: "Congratulations, young scientist! You've successfully matched all the microorganisms!",
    hint: hintMessage || "Look for microbes with similar shapes or colors. Bacteria often have round or rod-like forms.",
    paused: "Game paused. Take your time to think about the microbes you\'ve already seen!"
  };

  useEffect(() => {
    let message = '';

    if (showHint) {
      message = messages?.hint;
    } else if (gameState === 'completed') {
      message = messages?.completed;
    } else if (gameState === 'paused') {
      message = messages?.paused;
    } else if (matches === 0 && moves === 0) {
      message = messages?.welcome;
    } else if (matches === 1) {
      message = messages?.firstMatch;
    } else if (matches >= 4) {
      message = messages?.almostDone;
    } else {
      message = messages?.goodProgress;
    }

    if (message !== currentMessage) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMessage(message);
        setIsAnimating(false);
      }, 200);
    }
  }, [gameState, matches, moves, showHint, hintMessage, currentMessage]);

  return (
    <div className={`bg-card rounded-xl p-4 shadow-moderate border border-border ${className}`}>
      {/* Character Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <CharacterSpriteSystem
            character="aunt-juju"
            size="medium"
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-heading text-sm text-primary">Aunt Juju</h3>
          <p className="font-caption text-xs text-muted-foreground">Your Science Guide</p>
        </div>

        {/* Speaking Animation Indicator */}
        <div className="flex space-x-1">
          {[...Array(3)]?.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Message Content */}
      <div className={`
        transition-all duration-300
        ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}
      `}>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
          <p className="font-body text-sm text-foreground leading-relaxed">
            {currentMessage}
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-2 border border-success/20">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Target" size={14} className="text-success" />
              <span className="font-mono text-sm text-foreground">{matches}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Matches</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-2 border border-accent/20">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Star" size={14} className="text-accent" />
              <span className="font-mono text-sm text-foreground">{score}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Points</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-2 border border-primary/20">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="MousePointer" size={14} className="text-primary" />
              <span className="font-mono text-sm text-foreground">{moves}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Moves</p>
          </div>
        </div>
      </div>

      {/* Interactive Encouragement Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Heart" size={16} className="text-error" />
          <span className="font-caption text-xs text-muted-foreground">Keep going!</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 px-2 py-1 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors duration-300">
            <Icon name="ThumbsUp" size={14} className="text-primary" />
            <span className="font-caption text-xs text-primary">Encourage</span>
          </button>
          
          <button className="flex items-center space-x-1 px-2 py-1 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors duration-300">
            <Icon name="Lightbulb" size={14} className="text-accent" />
            <span className="font-caption text-xs text-accent">Hint</span>
          </button>

          {onClose && (
            <button 
              onClick={onClose}
              className="flex items-center space-x-1 px-2 py-1 bg-success/10 hover:bg-success/20 text-success rounded-full transition-colors duration-300"
            >
              <Icon name="Check" size={14} strokeWidth={2} />
              <span className="font-caption text-xs font-medium">Got it!</span>
            </button>
          )}
        </div>
      </div>

      {/* Victory Display */}
      {gameState === 'completed' && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <CharacterSpriteSystem
                character="aunt-juju"
                size="small"
              />
              <p className="font-caption text-xs text-success mt-1">Victory!</p>
            </div>
            <div className="text-center">
              <Icon name="Trophy" size={24} className="text-warning" />
              <p className="font-caption text-xs text-warning mt-1">Expert!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterGuidePanel;