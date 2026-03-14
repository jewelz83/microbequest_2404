import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ScientistCard = ({ 
  scientist, 
  isCollected = false, 
  onCollect, 
  showDetails = false, 
  onClose,
  className = "" 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  if (!scientist) return null;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-success bg-success/10 text-success';
      case 'uncommon': return 'border-primary bg-primary/10 text-primary';
      case 'rare': return 'border-accent bg-accent/10 text-accent';
      case 'legendary': return 'border-error bg-error/10 text-error';
      default: return 'border-border bg-muted text-muted-foreground';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'common': return 'Circle';
      case 'uncommon': return 'Hexagon';
      case 'rare': return 'Star';
      case 'legendary': return 'Crown';
      default: return 'Circle';
    }
  };

  return (
    <>
      {/* Card Container */}
      <div className={`
        relative w-80 h-96 perspective-1000 cursor-pointer
        ${className}
      `}>
        <div className={`
          relative w-full h-full transform-preserve-3d transition-transform duration-moderate
          ${isFlipped ? 'rotate-y-180' : ''}
        `}>
          {/* Card Front */}
          <div className={`
            absolute inset-0 backface-hidden rounded-xl border-2 shadow-pronounced
            bg-card ${getRarityColor(scientist?.rarity)}
            ${isCollected ? 'opacity-100' : 'opacity-75'}
          `}>
            {/* Card Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className={`
                  flex items-center space-x-2 px-3 py-1 rounded-full border
                  ${getRarityColor(scientist?.rarity)}
                `}>
                  <Icon 
                    name={getRarityIcon(scientist?.rarity)} 
                    size={14} 
                    strokeWidth={2.5} 
                  />
                  <span className="font-caption text-xs font-medium capitalize">
                    {scientist?.rarity}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={16} className="text-accent" strokeWidth={2} />
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {scientist?.points}
                  </span>
                </div>
              </div>
            </div>

            {/* Scientist Portrait */}
            <div className="relative p-6 flex-1">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-moderate">
                <Image
                  src={scientist?.portrait}
                  alt={`Portrait of ${scientist?.name}, ${scientist?.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Scientist Info */}
              <div className="text-center">
                <h3 className="font-heading text-lg text-foreground mb-1">
                  {scientist?.name}
                </h3>
                <p className="font-caption text-sm text-muted-foreground mb-2">
                  {scientist?.dates}
                </p>
                <p className="font-body text-sm text-primary font-semibold mb-3">
                  {scientist?.title}
                </p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {scientist?.discovery}
                </p>
              </div>

              {/* Flip Indicator */}
              <button
                onClick={() => setIsFlipped(true)}
                className="absolute bottom-4 right-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-fast"
              >
                <Icon name="RotateCcw" size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Collection Status */}
            <div className="p-4 border-t border-border">
              {isCollected ? (
                <div className="flex items-center justify-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={20} strokeWidth={2.5} />
                  <span className="font-caption text-sm font-medium">Collected</span>
                </div>
              ) : (
                <Button
                  onClick={onCollect}
                  variant="primary"
                  size="sm"
                  iconName="Plus"
                  className="w-full"
                >
                  Collect Scientist
                </Button>
              )}
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-card border-2 border-border rounded-xl shadow-pronounced">
            {/* Back Header */}
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-lg text-foreground">Fun Facts</h4>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-fast"
                >
                  <Icon name="RotateCw" size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Fun Facts List */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                {scientist?.funFacts?.map((fact, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="font-mono text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="font-body text-sm text-foreground leading-relaxed">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>

              {/* Additional Info Button */}
              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  onClick={() => setShowFullBio(true)}
                  variant="outline"
                  size="sm"
                  iconName="BookOpen"
                  className="w-full"
                >
                  Learn More About {scientist?.name?.split(' ')?.[0]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Biography Modal */}
      {showFullBio && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-pronounced border border-border w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={scientist?.portrait}
                    alt={`Portrait of ${scientist?.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-heading text-foreground">{scientist?.name}</h2>
                  <p className="font-caption text-sm text-muted-foreground">{scientist?.dates}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowFullBio(false)} 
                iconName="X" 
              />
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Achievement */}
                <div>
                  <h3 className="font-heading text-lg text-foreground mb-3">Major Achievement</h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {scientist?.discovery}
                  </p>
                </div>

                {/* Fun Facts */}
                <div>
                  <h3 className="font-heading text-lg text-foreground mb-3">Fascinating Facts</h3>
                  <div className="grid gap-3">
                    {scientist?.funFacts?.map((fact, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Icon name="Lightbulb" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                        <p className="font-body text-sm text-foreground">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <h3 className="font-heading text-lg text-foreground mb-3">Historical Impact</h3>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="font-body text-sm text-foreground leading-relaxed">
                      {scientist?.name} revolutionized our understanding of the microscopic world and 
                      laid the foundation for modern {scientist?.title?.toLowerCase()}. Their discoveries 
                      continue to impact science and medicine today.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-center p-6 border-t border-border">
              <Button
                onClick={() => setShowFullBio(false)}
                variant="primary"
              >
                Continue Timeline Adventure
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScientistCard;