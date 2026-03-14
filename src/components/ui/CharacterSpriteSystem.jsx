import React from 'react';
import Icon from '../AppIcon';

const CharacterSpriteSystem = ({
  character = 'aunt-juju',
  size = 'medium',
  className = ""
}) => {
  // Character data without animations
  const characterSprites = {
    'aunt-juju': {
      name: 'Aunt Juju',
      baseImage: "/assets/images/color_graduating_aunt_juju-1760838289072.png",
      alt: 'Aunt Juju - Illustrated African American woman in graduation attire wearing black graduation cap and gown, holding a green book, with natural curly hair, black glasses, warm smile, and orange circular background representing educational achievement and scholarly expertise',
      primaryColor: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    'charlie-zebra': {
      name: 'Charlie the Zebra',
      baseImage: "/assets/images/IMG_2430-1760838191946.PNG",
      alt: 'Cute cartoon zebra character with black and white stripes, peaceful closed eyes, friendly smile, sitting pose with hands on knees, wearing golden/yellow chest piece decorated with small circular patterns resembling microbes or cells',
      primaryColor: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  };

  const sizes = {
    small: { width: 'w-16 h-16', icon: 16 },
    medium: { width: 'w-24 h-24', icon: 20 },
    large: { width: 'w-32 h-32', icon: 24 },
    xlarge: { width: 'w-48 h-48', icon: 32 }
  };

  const currentCharacter = characterSprites?.[character];
  const sizeClass = sizes?.[size];

  if (!currentCharacter) {
    return (
      <div className={`${sizeClass?.width} ${className} flex items-center justify-center bg-muted rounded-full`}>
        <Icon name="User" size={sizeClass?.icon} className="text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Simple Character Container */}
      <div className={`
        relative ${sizeClass?.width} rounded-full overflow-hidden
        ${currentCharacter?.bgColor} ${currentCharacter?.borderColor} border-4
        shadow-moderate hover:shadow-pronounced transition-all duration-300
      `}>
        {/* Character Image */}
        <div className="w-full h-full relative">
          <img
            src={currentCharacter?.baseImage}
            alt={currentCharacter?.alt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Character Info Tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-moderate min-w-max">
          <p className="font-heading text-xs text-foreground">{currentCharacter?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterSpriteSystem;