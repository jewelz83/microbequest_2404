import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

const CharacterGuide = ({ 
  character = 'aunt-juju', 
  message = '', 
  emotion = 'happy', 
  position = 'bottom-right',
  isVisible = true,
  onClose,
  showHint = false,
  hintText = '',
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(emotion);

  const characters = {
    'aunt-juju': {
      name: 'Aunt Juju',
      avatar: '/assets/images/color_graduating_aunt_juju-1760838289072.png',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    'charlie-zebra': {
      name: 'Charlie',
      avatar: '/assets/images/IMG_2430-1760838191946.PNG',
      color: 'text-black',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  };

  const emotions = {
    happy: { icon: 'Smile', bounce: true },
    excited: { icon: 'Zap', bounce: true },
    thinking: { icon: 'Brain', bounce: false },
    encouraging: { icon: 'Heart', bounce: true },
    celebrating: { icon: 'PartyPopper', bounce: true }
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-40',
    'bottom-left': 'fixed bottom-4 left-4 z-40',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40',
    'inline': 'relative'
  };

  useEffect(() => {
    if (emotion !== currentEmotion) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentEmotion(emotion);
        setIsAnimating(false);
      }, 200);
    }
  }, [emotion, currentEmotion]);

  const currentCharacter = characters?.[character];
  const currentEmotionData = emotions?.[currentEmotion];

  if (!isVisible) return null;

  return (
    <div className={`${positionClasses?.[position]} ${className}`}>
      <div className={`
        bg-card border-2 ${currentCharacter?.borderColor} rounded-2xl shadow-pronounced 
        max-w-sm animate-slide-up
        ${isAnimating ? 'animate-bounce-gentle' : ''}
      `}>
        {/* Character Header */}
        <div className={`
          flex items-center space-x-3 p-4 ${currentCharacter?.bgColor} 
          rounded-t-xl border-b ${currentCharacter?.borderColor}
        `}>
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-moderate">
              <Image 
                src={currentCharacter?.avatar}
                alt={`${currentCharacter?.name} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Emotion Indicator - hidden for charlie-zebra */}
            {character !== 'charlie-zebra' && (
              <div className={`
                absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full 
                flex items-center justify-center border-2 ${currentCharacter?.borderColor}
                ${currentEmotionData?.bounce ? 'animate-bounce-gentle' : ''}
              `}>
                <Icon 
                  name={currentEmotionData?.icon} 
                  size={12} 
                  className={currentCharacter?.color}
                  strokeWidth={2.5}
                />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-heading text-sm ${currentCharacter?.color}`}>
              {currentCharacter?.name}
            </h4>
            <p className="font-caption text-xs text-muted-foreground">
              Your Learning Guide
            </p>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/50 rounded-full transition-colors duration-fast"
            >
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Message Content */}
        {message && (
          <div className="p-4">
            <p className="font-body text-sm text-foreground leading-relaxed">
              {message}
            </p>
          </div>
        )}

        {/* Hint Section */}
        {showHint && hintText && (
          <div className="px-4 pb-4">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon 
                  name="Lightbulb" 
                  size={16} 
                  className="text-accent mt-0.5 flex-shrink-0" 
                  strokeWidth={2}
                />
                <div>
                  <p className="font-caption text-xs font-semibold text-accent mb-1">
                    Hint
                  </p>
                  <p className="font-body text-xs text-foreground">
                    {hintText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 p-4 pt-0">
          {showHint && (
            <button className="flex items-center space-x-1 px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors duration-fast">
              <Icon name="HelpCircle" size={14} className="text-muted-foreground" />
              <span className="font-caption text-xs text-muted-foreground">More Help</span>
            </button>
          )}
          
          <button 
            onClick={onClose}
            className={`
              flex items-center space-x-1 px-3 py-1 rounded-full transition-colors duration-fast
              ${currentCharacter?.bgColor} hover:opacity-80 ${currentCharacter?.color}
            `}
          >
            <Icon name="ThumbsUp" size={14} strokeWidth={2} />
            <span className="font-caption text-xs font-medium">Got it!</span>
          </button>
        </div>

        {/* Speech Bubble Tail */}
        {position?.includes('bottom') && (
          <div className={`
            absolute top-full ${position?.includes('right') ? 'right-8' : 'left-8'} 
            w-0 h-0 border-l-8 border-r-8 border-t-8 
            border-transparent border-t-card
          `}></div>
        )}
      </div>
      {/* Floating Particles for Celebration */}
      {currentEmotion === 'celebrating' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)]?.map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 rounded-full animate-bounce-gentle
                ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-accent'}
              `}
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 10)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterGuide;