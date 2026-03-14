import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';
import Button from './Button';

const FunFactModal = ({ 
  microbe, 
  isOpen, 
  onClose, 
  onViewDetails,
  autoCloseDelay = 8000,
  suppressDuringExploration = false,
  isExploring = false
}) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseDelay / 1000);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isOpen || !microbe) {
      setTimeLeft(autoCloseDelay / 1000);
      return;
    }

    // Don't show modal during exploration if suppression is enabled
    if (suppressDuringExploration && isExploring) {
      return;
    }

    const interval = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onClose?.();
            return autoCloseDelay / 1000;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, onClose, autoCloseDelay, microbe, suppressDuringExploration, isExploring]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleViewDetails = () => {
    onViewDetails?.(microbe);
    onClose?.();
  };

  // Don't render if suppressed during exploration
  if (suppressDuringExploration && isExploring) {
    return null;
  }

  if (!isOpen || !microbe) return null;

  const getMicrobeIcon = (type) => {
    switch (type) {
      case 'bacteria': return 'Circle';
      case 'virus': return 'Zap';
      case 'fungi': return 'Flower';
      case 'protozoa': return 'Waves';
      case 'algae': return 'Sparkles';
      default: return 'Circle';
    }
  };

  const getMicrobeColor = (type) => {
    switch (type) {
      case 'bacteria': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'virus': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'fungi': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'protozoa': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'algae': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-card border-2 border-border rounded-2xl shadow-pronounced max-w-lg w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            {/* Microbe Icon */}
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getMicrobeColor(microbe?.type)}`}>
              <Icon 
                name={getMicrobeIcon(microbe?.type)} 
                size={24} 
                className={getMicrobeColor(microbe?.type)?.split(' ')?.[0]}
              />
            </div>
            
            <div>
              <h3 className="font-heading text-lg text-foreground">{microbe?.name}</h3>
              <p className="font-caption text-sm text-muted-foreground capitalize">{microbe?.type}</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close fun fact"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Fun Fact Badge */}
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Lightbulb" size={16} className="text-accent" />
            <span className="font-heading text-sm text-accent uppercase tracking-wide">
              Did You Know?
            </span>
          </div>

          {/* Fun Fact Text */}
          <div className="bg-accent/5 rounded-lg p-4 mb-6 border border-accent/20">
            <p className="font-body text-foreground leading-relaxed">
              {microbe?.funFact}
            </p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-caption text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Size
              </p>
              <p className="font-body text-sm text-foreground">{microbe?.size}</p>
            </div>
            <div>
              <p className="font-caption text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Environment
              </p>
              <p className="font-body text-sm text-foreground capitalize">{microbe?.environment}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              iconName="Microscope"
              iconPosition="left"
            >
              View in Lab
            </Button>

            <div className="flex items-center space-x-3">
              {/* Auto-close Timer */}
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span className="font-mono text-xs">
                  {isPaused ? 'Paused' : `${timeLeft}s`}
                </span>
              </div>
              
              {/* Got it! Button */}
              <Button
                size="sm"
                onClick={onClose}
                iconName="ThumbsUp"
                iconPosition="left"
                className="bg-primary/90 hover:bg-primary text-primary-foreground"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-muted rounded-b-2xl overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-1000 ease-linear"
            style={{ 
              width: isPaused ? `${(timeLeft / (autoCloseDelay / 1000)) * 100}%` : 
                     `${((autoCloseDelay / 1000 - timeLeft) / (autoCloseDelay / 1000)) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FunFactModal;