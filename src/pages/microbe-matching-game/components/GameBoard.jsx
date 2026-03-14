import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const GameBoard = ({ 
  cards = [], 
  onCardClick, 
  flippedCards = [], 
  matchedCards = [], 
  gameState = 'playing',
  difficulty = 'easy',
  className = "" 
}) => {
  const [animatingCards, setAnimatingCards] = useState([]);
  const [celebratingPairs, setCelebratingPairs] = useState([]);

  // Grid configuration based on difficulty
  const gridConfig = {
    easy: { cols: 4, rows: 3, cardCount: 12 },
    medium: { cols: 4, rows: 4, cardCount: 16 },
    hard: { cols: 6, rows: 4, cardCount: 24 }
  };

  const currentConfig = gridConfig?.[difficulty] || gridConfig?.easy;

  useEffect(() => {
    // Animate card flips
    if (flippedCards?.length > 0) {
      setAnimatingCards(flippedCards);
      const timer = setTimeout(() => {
        setAnimatingCards([]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [flippedCards]);

  useEffect(() => {
    // Celebrate matched pairs
    if (matchedCards?.length > 0) {
      const newMatches = matchedCards?.slice(-2);
      setCelebratingPairs(newMatches);
      const timer = setTimeout(() => {
        setCelebratingPairs([]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [matchedCards?.length]);

  const isCardFlipped = (cardId) => {
    return flippedCards?.includes(cardId) || matchedCards?.includes(cardId);
  };

  const isCardAnimating = (cardId) => {
    return animatingCards?.includes(cardId);
  };

  const isCardCelebrating = (cardId) => {
    return celebratingPairs?.includes(cardId);
  };

  const handleCardClick = (card) => {
    if (gameState !== 'playing') return;
    if (isCardFlipped(card?.id)) return;
    if (flippedCards?.length >= 2) return;
    
    onCardClick(card);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Game Board Grid */}
      <div 
        className={`
          grid gap-3 sm:gap-4 p-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 
          rounded-2xl border-2 border-primary/20 shadow-moderate
        `}
        style={{
          gridTemplateColumns: `repeat(${currentConfig?.cols}, 1fr)`,
          aspectRatio: `${currentConfig?.cols}/${currentConfig?.rows}`
        }}
      >
        {cards?.map((card) => (
          <div
            key={card?.id}
            onClick={() => handleCardClick(card)}
            className={`
              relative aspect-square cursor-pointer group
              ${isCardFlipped(card?.id) ? 'pointer-events-none' : 'hover:scale-105'}
              transition-all duration-300 animate-smooth
              ${isCardCelebrating(card?.id) ? 'animate-bounce-gentle' : ''}
            `}
          >
            {/* Card Container */}
            <div className={`
              relative w-full h-full rounded-xl overflow-hidden shadow-moderate
              transform-gpu transition-transform duration-600
              ${isCardAnimating(card?.id) ? 'animate-flip' : ''}
              ${isCardFlipped(card?.id) ? 'rotateY-180' : ''}
            `}>
              {/* Card Back */}
              <div className={`
                absolute inset-0 backface-hidden
                bg-gradient-to-br from-primary to-secondary
                flex items-center justify-center
                ${isCardFlipped(card?.id) ? 'opacity-0' : 'opacity-100'}
              `}>
                <div className="text-center">
                  <Icon 
                    name="Microscope" 
                    size={32} 
                    color="white" 
                    strokeWidth={2.5}
                    className="mx-auto mb-2"
                  />
                  <div className="w-8 h-1 bg-white/30 rounded-full mx-auto"></div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-fast"></div>
              </div>

              {/* Card Front */}
              <div className={`
                absolute inset-0 backface-hidden rotateY-180
                bg-card border-2 border-border
                flex flex-col items-center justify-center p-2
                ${isCardFlipped(card?.id) ? 'opacity-100' : 'opacity-0'}
              `}>
                {/* Microbe Image */}
                <div className="w-full h-3/4 mb-2 relative">
                  <Image
                    src={card?.image}
                    alt={card?.imageAlt}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  
                  {/* Celebration Particles */}
                  {isCardCelebrating(card?.id) && (
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
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.8s'
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Microbe Name */}
                <h4 className="font-heading text-xs sm:text-sm text-center text-foreground leading-tight">
                  {card?.name}
                </h4>

                {/* Category Badge */}
                <div className={`
                  mt-1 px-2 py-0.5 rounded-full text-xs font-caption
                  ${card?.category === 'bacteria' ? 'bg-success/20 text-success' :
                    card?.category === 'virus' ? 'bg-error/20 text-error' :
                    card?.category === 'fungi'? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}
                `}>
                  {card?.category}
                </div>
              </div>
            </div>

            {/* Match Connection Line */}
            {matchedCards?.includes(card?.id) && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-success rounded-xl animate-pulse-soft"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Icon name="Check" size={24} className="text-success" strokeWidth={3} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Game State Overlay */}
      {gameState === 'completed' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
          <div className="bg-card p-8 rounded-2xl shadow-pronounced text-center animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Trophy" size={32} color="white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-heading text-foreground mb-2">Congratulations!</h3>
            <p className="font-body text-muted-foreground">You've matched all the microbes!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;