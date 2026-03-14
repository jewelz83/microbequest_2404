import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const GameOverScreen = ({ 
  isVictory, 
  score, 
  achievements = [], 
  selectedLocation, 
  onRestart, 
  onBackToMenu 
}) => {
  const getPerformanceRank = (finalScore) => {
    if (finalScore >= 500) return { rank: 'Master Defender', color: 'text-purple-600', emoji: '👑' };
    if (finalScore >= 300) return { rank: 'Expert Guardian', color: 'text-blue-600', emoji: '🏆' };
    if (finalScore >= 150) return { rank: 'Skilled Protector', color: 'text-green-600', emoji: '🥇' };
    if (finalScore >= 50) return { rank: 'Brave Fighter', color: 'text-yellow-600', emoji: '🥈' };
    return { rank: 'Determined Learner', color: 'text-gray-600', emoji: '🥉' };
  };

  const performance = getPerformanceRank(score);

  const learningOutcomes = [
    "Difference between good and bad bacteria",
    "How antibiotics and probiotics work", 
    "Importance of microbial balance",
    "Immune system defense mechanisms",
    "Smart use of medical tools"
  ];

  const encouragementMessages = {
    victory: [
      "Outstanding work! You\'ve mastered the art of immune defense!",
      "Your strategic thinking protected the body perfectly!",
      "Excellent balance between offense and preservation!"
    ],
    defeat: [
      "Every great scientist learns from experimentation!",
      "You\'re getting closer to mastering immune defense!",
      "Each attempt teaches us something valuable!"
    ]
  };

  const getRandomMessage = () => {
    const messages = isVictory ? encouragementMessages?.victory : encouragementMessages?.defeat;
    return messages?.[Math.floor(Math.random() * messages?.length)];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`
            w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
            ${isVictory ? 'bg-green-500' : 'bg-orange-500'}
          `}>
            <Icon 
              name={isVictory ? 'Trophy' : 'RotateCcw'} 
              size={40} 
              color="white" 
              strokeWidth={2.5} 
            />
          </div>
          
          <h2 className={`
            text-2xl lg:text-3xl font-heading font-bold mb-2
            ${isVictory ? 'text-green-600' : 'text-orange-600'}
          `}>
            {isVictory ? 'Mission Accomplished!' : 'Mission Incomplete'}
          </h2>
          
          <p className="font-body text-muted-foreground mb-4">
            {getRandomMessage()}
          </p>

          {selectedLocation && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Icon name="MapPin" size={16} className="text-primary" />
              <span className="font-heading text-sm text-primary">
                {selectedLocation?.name} Defense
              </span>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{performance?.emoji}</div>
              <h3 className={`font-heading text-lg font-semibold mb-1 ${performance?.color}`}>
                {performance?.rank}
              </h3>
              <div className="mb-3">
                <span className="font-mono text-2xl font-bold text-foreground">
                  {score?.toLocaleString()}
                </span>
                <p className="font-caption text-xs text-muted-foreground">Final Score</p>
              </div>
              
              {/* Score Breakdown */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bacteria eliminated:</span>
                  <span className="text-green-600 font-mono">+{Math.floor(score * 0.6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance maintained:</span>
                  <span className="text-blue-600 font-mono">+{Math.floor(score * 0.3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bonus points:</span>
                  <span className="text-purple-600 font-mono">+{Math.floor(score * 0.1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Award" size={16} className="text-amber-500" />
              <h4 className="font-heading text-foreground font-semibold">
                Achievements Earned
              </h4>
            </div>
            
            {achievements?.length > 0 ? (
              <div className="space-y-2">
                {achievements?.map((achievement, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-amber-50 border border-amber-200 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon name="Star" size={14} className="text-amber-600" />
                    <span className="font-caption text-sm text-amber-800">
                      {achievement}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Icon name="Target" size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="font-caption text-sm text-muted-foreground">
                  No achievements this time. Keep practicing to earn badges!
                </p>
              </div>
            )}

            {/* Potential Achievements */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="font-caption text-xs text-muted-foreground mb-2">
                Available achievements:
              </p>
              <div className="space-y-1">
                {[
                  "Balance Master - Maintain 90%+ good bacteria",
                  "Immune Champion - Keep immune health above 90%", 
                  "Fast Hands - Complete wave in under 60s",
                  "Antibiotic Wisdom - Minimize antibiotic overuse"
                ]?.map((hint, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <Icon name="Circle" size={8} className="text-muted-foreground" />
                    <span className="font-caption text-xs text-muted-foreground">
                      {hint}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What You Learned */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="BookOpen" size={16} className="text-blue-600" />
            <h4 className="font-heading text-blue-800 font-semibold">
              What You Learned Today
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {learningOutcomes?.map((outcome, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={14} className="text-blue-600" />
                <span className="font-caption text-sm text-blue-800">
                  {outcome}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Character Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Aunt Juju Message */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" strokeWidth={2.5} />
              </div>
              <span className="font-heading text-sm font-semibold text-purple-800">
                Aunt Juju
              </span>
            </div>
            <p className="font-body text-sm text-purple-700 leading-relaxed">
              {isVictory 
                ? "Amazing work! You've shown excellent understanding of how our immune system works. Science is all about learning and experimenting!" :"Don't worry, young scientist! Every experiment teaches us something new. Your immune system knowledge is growing with each attempt!"
              }
            </p>
          </div>

          {/* Charlie Message */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="Smile" size={16} color="white" strokeWidth={2.5} />
              </div>
              <span className="font-heading text-sm font-semibold text-green-800">
                Charlie the Zebra
              </span>
            </div>
            <p className="font-body text-sm text-green-700 leading-relaxed">
              {isVictory
                ? "Woohoo! You're a germ-busting champion! 🎉 That was some serious bacteria-fighting action. Ready for the next challenge?"
                : "Hey, no worries! Even us zebras need practice to get our stripes right! 🦓 Try again - I believe in you!"
              }
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onRestart}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-primary text-primary-foreground rounded-button font-body font-semibold hover:shadow-moderate transition-all duration-fast"
          >
            <Icon name="RotateCcw" size={16} strokeWidth={2.5} />
            <span>Try Again</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-secondary text-secondary-foreground rounded-button font-body font-semibold hover:shadow-moderate transition-all duration-fast"
          >
            <Icon name="Grid" size={16} strokeWidth={2.5} />
            <span>Change Location</span>
          </button>

          <Link
            to="/game-home-dashboard"
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-muted text-muted-foreground rounded-button font-body font-semibold hover:bg-muted/80 transition-all duration-fast"
          >
            <Icon name="Home" size={16} strokeWidth={2.5} />
            <span>Main Menu</span>
          </Link>
        </div>

        {/* Progress Integration */}
        <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="font-heading text-sm font-semibold text-accent">
              MicrobeQuest Progress
            </span>
          </div>
          <p className="font-caption text-xs text-muted-foreground mb-3">
            Your Germ Buster performance contributes to your overall MicrobeQuest journey!
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="font-mono text-sm font-semibold text-foreground block">+{score}</span>
              <span className="font-caption text-xs text-muted-foreground">Total Points</span>
            </div>
            <div>
              <span className="font-mono text-sm font-semibold text-foreground block">+{achievements?.length}</span>
              <span className="font-caption text-xs text-muted-foreground">New Badges</span>
            </div>
            <div>
              <span className="font-mono text-sm font-semibold text-foreground block">+1</span>
              <span className="font-caption text-xs text-muted-foreground">Game Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;