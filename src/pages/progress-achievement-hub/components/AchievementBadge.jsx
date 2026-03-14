import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AchievementBadge = ({ 
  achievement, 
  isUnlocked = false, 
  showDetails = false,
  onClick,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const rarityColors = {
    bronze: 'from-amber-600 to-amber-800 border-amber-500',
    silver: 'from-gray-400 to-gray-600 border-gray-400',
    gold: 'from-yellow-400 to-yellow-600 border-yellow-400',
    platinum: 'from-purple-400 to-purple-600 border-purple-400',
    diamond: 'from-blue-400 to-blue-600 border-blue-400'
  };

  const getGlowEffect = (rarity) => {
    const glowColors = {
      bronze: 'shadow-amber-500/50',
      silver: 'shadow-gray-400/50',
      gold: 'shadow-yellow-400/50',
      platinum: 'shadow-purple-400/50',
      diamond: 'shadow-blue-400/50'
    };
    return glowColors?.[rarity] || 'shadow-gray-400/50';
  };

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge Container */}
      <div className={`
        relative w-20 h-20 rounded-full border-4 transition-all duration-300
        ${isUnlocked 
          ? `bg-gradient-to-br ${rarityColors?.[achievement?.rarity]} ${getGlowEffect(achievement?.rarity)} shadow-lg`
          : 'bg-muted border-border grayscale opacity-50'
        }
        ${isHovered && isUnlocked ? 'scale-110 shadow-xl' : ''}
      `}>
        {/* Badge Icon */}
        <div className="absolute inset-2 flex items-center justify-center">
          {achievement?.icon ? (
            <Icon 
              name={achievement?.icon} 
              size={28} 
              color={isUnlocked ? "white" : "currentColor"}
              strokeWidth={2.5}
            />
          ) : (
            <Image
              src={achievement?.image}
              alt={achievement?.imageAlt}
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>

        {/* Unlock Animation Particles */}
        {isUnlocked && isHovered && (
          <>
            {[...Array(6)]?.map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-1 h-1 rounded-full animate-bounce-gentle
                  ${i % 3 === 0 ? 'bg-yellow-400' : i % 3 === 1 ? 'bg-white' : 'bg-accent'}
                `}
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${10 + (i * 15)}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </>
        )}

        {/* Lock Overlay for Locked Achievements */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-full">
            <Icon name="Lock" size={20} className="text-muted-foreground" />
          </div>
        )}

        {/* Progress Ring for Partial Achievements */}
        {achievement?.progress && achievement?.progress < 100 && (
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="36"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            <circle
              cx="50%"
              cy="50%"
              r="36"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - achievement?.progress / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
        )}
      </div>
      {/* Badge Label */}
      <div className="text-center mt-2">
        <p className="font-caption text-xs font-semibold text-foreground truncate">
          {achievement?.name}
        </p>
        {achievement?.progress && achievement?.progress < 100 && (
          <p className="font-mono text-xs text-muted-foreground">
            {achievement?.progress}%
          </p>
        )}
      </div>
      {/* Tooltip */}
      {showDetails && isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-pronounced border border-border min-w-48">
            <h4 className="font-heading text-sm font-semibold mb-1">{achievement?.name}</h4>
            <p className="font-body text-xs text-muted-foreground mb-2">
              {achievement?.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-caption text-accent capitalize">{achievement?.rarity}</span>
              <span className="font-mono text-primary">+{achievement?.points} pts</span>
            </div>
            {achievement?.unlockedAt && (
              <p className="font-caption text-xs text-muted-foreground mt-1">
                Unlocked: {new Date(achievement.unlockedAt)?.toLocaleDateString()}
              </p>
            )}
            
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;