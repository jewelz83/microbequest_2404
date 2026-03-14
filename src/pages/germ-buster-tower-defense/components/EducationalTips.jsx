import React from 'react';
import Icon from '../../../components/AppIcon';

const EducationalTips = ({ 
  isVisible, 
  tip, 
  onClose 
}) => {
  if (!isVisible || !tip) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-pronounced animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Icon name="Lightbulb" size={20} color="white" strokeWidth={2.5} />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {tip?.title}
            </h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Educational Fact */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-heading text-sm font-semibold text-blue-800 mb-2">
                Did You Know?
              </h4>
              <p className="font-body text-sm text-blue-700 leading-relaxed">
                {tip?.fact}
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Advice */}
        {tip?.advice && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <Icon name="Target" size={16} className="text-green-600 mt-0.5" />
              <div>
                <h4 className="font-heading text-sm font-semibold text-green-800 mb-2">
                  Strategy Tip
                </h4>
                <p className="font-body text-sm text-green-700 leading-relaxed">
                  {tip?.advice}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-heading text-sm font-semibold text-foreground mb-3">
            Quick Reference Guide
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <h5 className="font-heading font-semibold text-foreground mb-2">Good Bacteria 🟢</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Green colored</li>
                <li>• Smiling faces</li>
                <li>• Help your body</li>
                <li>• Protect with probiotics</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-heading font-semibold text-foreground mb-2">Bad Bacteria 🔴</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Red colored</li>
                <li>• Neutral/frowning</li>
                <li>• Cause infections</li>
                <li>• Target with tools</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tool Effectiveness Guide */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h4 className="font-heading text-sm font-semibold text-amber-800 mb-3">
            Tool Effectiveness
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={8} color="white" strokeWidth={2} />
                </div>
                <span className="font-caption text-xs text-amber-800">Antibiotics</span>
              </div>
              <span className="font-caption text-xs text-amber-700">
                Strong vs bad, harmful to good
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon name="Plus" size={8} color="white" strokeWidth={2} />
                </div>
                <span className="font-caption text-xs text-amber-800">Probiotics</span>
              </div>
              <span className="font-caption text-xs text-amber-700">
                Boosts good bacteria only
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Icon name="Zap" size={8} color="white" strokeWidth={2} />
                </div>
                <span className="font-caption text-xs text-amber-800">Immune Cells</span>
              </div>
              <span className="font-caption text-xs text-amber-700">
                Natural, targets harmful only
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-button font-body font-semibold hover:shadow-moderate transition-all duration-fast flex items-center justify-center space-x-2"
        >
          <span>Got It! Let's Play</span>
          <Icon name="ArrowRight" size={16} strokeWidth={2.5} />
        </button>

        {/* Character Encouragement */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Heart" size={12} className="text-red-500" />
          <span>
            "Remember, every great scientist learns by doing!" - Aunt Juju
          </span>
        </div>
      </div>
    </div>
  );
};

export default EducationalTips;