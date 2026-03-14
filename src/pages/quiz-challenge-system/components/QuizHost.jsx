import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const QuizHost = ({
  character = 'aunt-juju',
  emotion = 'happy',
  message = '',
  isVisible = true,
  onMessageComplete,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(emotion);

  const characters = {
    'aunt-juju': {
      name: 'Aunt Juju',
      avatar: "/assets/images/color_graduating_aunt_juju-1760838289072.png",
      avatarAlt: 'Aunt Juju - friendly graduating scientist with colorful academic regalia and warm smile',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    'charlie-zebra': {
      name: 'Charlie',
      avatar: "https://images.unsplash.com/photo-1643617065900-78996668dd57",
      avatarAlt: 'Cartoon zebra mascot with friendly smile and educational hat',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  };

  const emotions = {
    happy: { icon: 'Smile', bounce: true, message: 'Great job! Let\'s learn together!' },
    excited: { icon: 'Zap', bounce: true, message: 'This is so exciting!' },
    thinking: { icon: 'Brain', bounce: false, message: 'Hmm, let me think about this...' },
    encouraging: { icon: 'Heart', bounce: true, message: 'You\'re doing wonderfully!' },
    celebrating: { icon: 'PartyPopper', bounce: true, message: 'Amazing work, scientist!' }
  };

  useEffect(() => {
    if (emotion !== currentEmotion) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentEmotion(emotion);
        setIsAnimating(false);
      }, 300);
    }
  }, [emotion, currentEmotion]);

  const currentCharacter = characters?.[character];
  const currentEmotionData = emotions?.[currentEmotion];

  if (!isVisible) return null;

  return (
    <div className={`relative ${className}`}>
      <div className={`
        bg-card border-2 ${currentCharacter?.borderColor} rounded-2xl shadow-pronounced 
        p-6 animate-slide-up relative overflow-hidden
        ${isAnimating ? 'animate-bounce-gentle' : ''}
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent"></div>
        </div>

        {/* Character Section */}
        <div className="relative flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-moderate">
              <Image
                src={currentCharacter?.avatar}
                alt={currentCharacter?.avatarAlt}
                className="w-full h-full object-cover" />

            </div>
            
            {/* Emotion Indicator */}
            <div className={`
              absolute -bottom-2 -right-2 w-8 h-8 bg-card rounded-full 
              flex items-center justify-center border-2 ${currentCharacter?.borderColor}
              ${currentEmotionData?.bounce ? 'animate-bounce-gentle' : ''}
            `}>
              <Icon
                name={currentEmotionData?.icon}
                size={16}
                className={currentCharacter?.color}
                strokeWidth={2.5} />

            </div>
          </div>
          
          <div className="flex-1">
            <h3 className={`font-heading text-lg ${currentCharacter?.color}`}>
              {currentCharacter?.name}
            </h3>
            <p className="font-caption text-sm text-muted-foreground">
              Your Quiz Guide
            </p>
          </div>

          {/* Animated Particles */}
          {currentEmotion === 'celebrating' &&
          <div className="absolute top-0 right-0 pointer-events-none">
              {[...Array(4)]?.map((_, i) =>
            <div
              key={i}
              className={`
                    absolute w-2 h-2 rounded-full animate-bounce-gentle
                    ${i % 2 === 0 ? 'bg-accent' : 'bg-secondary'}
                  `}
              style={{
                right: `${10 + i * 8}px`,
                top: `${5 + i * 6}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.2s'
              }}>
            </div>
            )}
            </div>
          }
        </div>

        {/* Message Bubble */}
        <div className={`
          relative ${currentCharacter?.bgColor} rounded-xl p-4 border ${currentCharacter?.borderColor}
        `}>
          <p className="font-body text-foreground leading-relaxed">
            {message || currentEmotionData?.message}
          </p>
          
          {/* Speech Bubble Tail */}
          <div className={`
            absolute -top-2 left-6 w-0 h-0 border-l-4 border-r-4 border-b-4 
            border-transparent border-b-current ${currentCharacter?.color}
          `}></div>
        </div>

        {/* Interactive Elements */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Icon name="Sparkles" size={16} className="text-accent animate-pulse-soft" />
            <span className="font-caption text-xs text-muted-foreground">
              Science is fun!
            </span>
          </div>
          
          {onMessageComplete &&
          <button
            onClick={onMessageComplete}
            className={`
                flex items-center space-x-1 px-3 py-1 rounded-full transition-colors duration-fast
                ${currentCharacter?.bgColor} hover:opacity-80 ${currentCharacter?.color}
              `}>

              <Icon name="ArrowRight" size={14} strokeWidth={2} />
              <span className="font-caption text-xs font-medium">Continue</span>
            </button>
          }
        </div>
      </div>
    </div>);

};

export default QuizHost;