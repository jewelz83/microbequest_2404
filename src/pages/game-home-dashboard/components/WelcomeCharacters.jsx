import React from 'react';

import CharacterSpriteSystem from '../../../components/ui/CharacterSpriteSystem';

const WelcomeCharacters = ({ className = "" }) => {
  const characters = [
    {
      id: 'aunt-juju',
      name: 'Aunt Juju',
      role: 'Your Science Guide',
      character: 'aunt-juju',
      greeting: "Hey there, superstar scientist! Welcome to MicrobeQuest! I'm Aunt Juju, and I can't wait to explore the incredible world of microbiology with you. Together, we'll discover amazing career paths like food microbiology, water microbiology, and so much more as we journey through the world you can't see!",
      position: 'left',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      primaryColor: 'text-primary'
    },
    {
      id: 'charlie-zebra',
      name: 'Charlie the Zebra',
      role: 'Adventure Companion',
      character: 'charlie-zebra',
      greeting: "Howdy, young explorer! I'm Charlie the Zebra, your striped safari guide! Ready to go on an amazing adventure and discover some totally awesome tiny creatures together? Let's bounce into the world you can't see and learn about all the exciting careers in microbiology!",
      position: 'right',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      primaryColor: 'text-secondary'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {characters?.map((character, index) => (
          <div
            key={character?.id}
            className={`
              relative ${character?.bgColor} ${character?.borderColor} border-2 rounded-2xl p-6
              shadow-moderate hover:shadow-pronounced transition-all duration-normal
            `}
          >
            {/* Character Display */}
            <div className="relative mb-4 flex justify-center">
              <CharacterSpriteSystem
                character={character?.character}
                size="large"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Character Info */}
            <div className="text-center space-y-3">
              <div>
                <h3 className="text-xl font-heading text-foreground mb-1">
                  {character?.name}
                </h3>
                <p className="font-caption text-sm text-muted-foreground">
                  {character?.role}
                </p>
              </div>

              {/* Speech Bubble */}
              <div className="relative bg-card border border-border rounded-xl p-4 shadow-subtle">
                <p className="font-body text-sm text-foreground leading-relaxed">
                  {character?.greeting}
                </p>
                
                {/* Speech Bubble Tail */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-card" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeCharacters;