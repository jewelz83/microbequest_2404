import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import CharacterGuide from '../../components/ui/CharacterGuide';
import useGuideVisibility from '../../hooks/useGuideVisibility';

// Import all components
import AchievementBadge from './components/AchievementBadge';
import ProgressMap from './components/ProgressMap';
import GameModeStats from './components/GameModeStats';
import MicrobeGallery from './components/MicrobeGallery';
import ParentReports from './components/ParentReports';

const ProgressAchievementHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { shouldShowGuide, hideGuide } = useGuideVisibility('progress-achievement-hub');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Mock data for achievements
  const achievements = [
    {
      id: 1,
      name: 'First Discovery',
      description: 'Discovered your first microorganism',
      icon: 'Microscope',
      rarity: 'bronze',
      points: 10,
      isUnlocked: true,
      unlockedAt: '2025-10-15T10:30:00Z',
      progress: 100
    },
    {
      id: 2,
      name: 'Bacteria Expert',
      description: 'Correctly identified 10 different bacteria types',
      icon: 'Circle',
      rarity: 'silver',
      points: 50,
      isUnlocked: true,
      unlockedAt: '2025-10-16T14:20:00Z',
      progress: 100
    },
    {
      id: 3,
      name: 'Quiz Master',
      description: 'Achieved 90% or higher on 5 consecutive quizzes',
      icon: 'Brain',
      rarity: 'gold',
      points: 100,
      isUnlocked: true,
      unlockedAt: '2025-10-17T09:15:00Z',
      progress: 100
    },
    {
      id: 4,
      name: 'Speed Matcher',
      description: 'Complete matching game in under 30 seconds',
      icon: 'Zap',
      rarity: 'silver',
      points: 75,
      isUnlocked: false,
      progress: 80
    },
    {
      id: 5,
      name: 'Explorer Champion',
      description: 'Find all hidden microbes in World Explorer mode',
      icon: 'Compass',
      rarity: 'platinum',
      points: 200,
      isUnlocked: false,
      progress: 60
    },
    {
      id: 6,
      name: 'Microscope Master',
      description: 'Successfully examine 50 specimens in the lab',
      icon: 'FlaskConical',
      rarity: 'gold',
      points: 150,
      isUnlocked: false,
      progress: 35
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'achievements', label: 'Achievements', icon: 'Trophy' },
    { id: 'progress', label: 'Learning Map', icon: 'Map' },
    { id: 'collection', label: 'My Collection', icon: 'Grid3X3' },
    { id: 'reports', label: 'Parent Reports', icon: 'FileText' }
  ];

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-moderate">
              <Icon name="Trophy" size={32} color="white" strokeWidth={2.5} />
            </div>
            
            <div>
              <h2 className="text-2xl font-heading text-foreground mb-1">Great Progress, Emma!</h2>
              <p className="font-body text-muted-foreground">
                You've discovered 15 microorganisms and earned 3 achievements this week!
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Star" size={20} className="text-accent" />
              <span className="font-mono text-2xl font-bold text-foreground">485</span>
            </div>
            <p className="font-caption text-sm text-muted-foreground">Total Points</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <span className="font-caption text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">32</p>
          <p className="font-caption text-xs text-muted-foreground">Activities</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Microscope" size={20} className="text-primary" />
            <span className="font-caption text-sm text-muted-foreground">Discovered</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">15</p>
          <p className="font-caption text-xs text-muted-foreground">Microbes</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={20} className="text-accent" />
            <span className="font-caption text-sm text-muted-foreground">Time Spent</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">8h</p>
          <p className="font-caption text-xs text-muted-foreground">This Week</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-secondary" />
            <span className="font-caption text-sm text-muted-foreground">Streak</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">7</p>
          <p className="font-caption text-xs text-muted-foreground">Days</p>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-moderate">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading text-foreground">Recent Achievements</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab('achievements')}
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All
          </Button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {achievements?.filter(a => a?.isUnlocked)?.slice(0, 4)?.map((achievement) => (
            <div key={achievement?.id} className="flex-shrink-0">
              <AchievementBadge
                achievement={achievement}
                isUnlocked={achievement?.isUnlocked}
                showDetails={true}
                onClick={() => handleAchievementClick(achievement)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator
        completedActivities={32}
        totalActivities={50}
        discoveredMicrobes={15}
        totalMicrobes={25}
        achievements={achievements?.filter(a => a?.isUnlocked)?.map(a => a?.name)}
      />

      {/* Game Mode Quick Access */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-moderate">
        <h3 className="text-xl font-heading text-foreground mb-4">Continue Learning</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/microbe-matching-game"
            className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-moderate transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="Puzzle" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-heading text-lg text-blue-900 group-hover:text-blue-700">
                  Matching Game
                </h4>
                <p className="font-body text-sm text-blue-700">85% Complete</p>
              </div>
              <Icon name="ArrowRight" size={20} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link 
            to="/world-explorer-mode"
            className="group bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 hover:shadow-moderate transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="Compass" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-heading text-lg text-green-900 group-hover:text-green-700">
                  World Explorer
                </h4>
                <p className="font-body text-sm text-green-700">New area unlocked!</p>
              </div>
              <Icon name="ArrowRight" size={20} className="text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-heading text-foreground">Achievement Gallery</h3>
          <p className="font-caption text-sm text-muted-foreground">
            {achievements?.filter(a => a?.isUnlocked)?.length} of {achievements?.length} achievements unlocked
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Star" size={20} className="text-accent" />
          <span className="font-mono text-lg font-bold text-foreground">
            {achievements?.filter(a => a?.isUnlocked)?.reduce((sum, a) => sum + a?.points, 0)}
          </span>
          <span className="font-caption text-sm text-muted-foreground">points</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {achievements?.map((achievement) => (
          <AchievementBadge
            key={achievement?.id}
            achievement={achievement}
            isUnlocked={achievement?.isUnlocked}
            showDetails={true}
            onClick={() => handleAchievementClick(achievement)}
          />
        ))}
      </div>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-gradient-to-br from-bronze-50 to-bronze-100 p-4 rounded-lg border border-bronze-200">
          <h4 className="font-heading text-lg text-bronze-900 mb-2">Discovery Achievements</h4>
          <p className="font-body text-sm text-bronze-700 mb-3">
            Unlock by discovering new microorganisms
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-full bg-bronze-200 rounded-full h-2">
              <div className="bg-bronze-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <span className="font-mono text-xs text-bronze-800">3/5</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-silver-50 to-silver-100 p-4 rounded-lg border border-silver-200">
          <h4 className="font-heading text-lg text-silver-900 mb-2">Skill Achievements</h4>
          <p className="font-body text-sm text-silver-700 mb-3">
            Earn by mastering different game modes
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-full bg-silver-200 rounded-full h-2">
              <div className="bg-silver-600 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <span className="font-mono text-xs text-silver-800">2/5</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gold-50 to-gold-100 p-4 rounded-lg border border-gold-200">
          <h4 className="font-heading text-lg text-gold-900 mb-2">Special Achievements</h4>
          <p className="font-body text-sm text-gold-700 mb-3">
            Rare achievements for exceptional performance
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-full bg-gold-200 rounded-full h-2">
              <div className="bg-gold-600 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
            <span className="font-mono text-xs text-gold-800">1/5</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading text-foreground mb-2">Progress & Achievements</h1>
              <p className="font-body text-muted-foreground">
                Track your learning journey and celebrate your discoveries!
              </p>
            </div>
            
            <Link to="/game-home-dashboard">
              <Button variant="outline" iconName="ArrowLeft" iconPosition="left">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 p-1 bg-muted rounded-lg">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-button transition-all duration-fast
                  ${activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground shadow-moderate'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background'
                  }
                `}
              >
                <Icon name={tab?.icon} size={18} strokeWidth={2} />
                <span className="font-body font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'achievements' && renderAchievements()}
            {activeTab === 'progress' && <ProgressMap onNodeClick={(node) => console.log('Node clicked:', node)} />}
            {activeTab === 'collection' && <MicrobeGallery />}
            {activeTab === 'reports' && <ParentReports />}
            {activeTab === 'overview' && <GameModeStats />}
          </div>
        </div>
      </main>
      {/* Character Guide */}
      <CharacterGuide
        character="charlie-zebra"
        message="Wow! Look at all your amazing progress! Keep exploring and learning about the microscopic world around us."
        emotion="celebrating"
        position="bottom-right"
        isVisible={shouldShowGuide}
        onClose={hideGuide}
        showHint={true}
        hintText="Click on any achievement to learn more about how to unlock it!"
      />
      {/* Floating Action Button for Quick Navigation */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="flex flex-col space-y-2">
          <Link to="/microbe-matching-game">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full shadow-pronounced bg-primary hover:bg-primary/90"
              iconName="Puzzle"
            />
          </Link>
          <Link to="/world-explorer-mode">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full shadow-pronounced bg-secondary hover:bg-secondary/90"
              iconName="Compass"
            />
          </Link>
        </div>
      </div>
      {/* Achievement Celebration Particles */}
      {selectedAchievement && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {[...Array(12)]?.map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-3 h-3 rounded-full animate-bounce-gentle
                ${i % 4 === 0 ? 'bg-accent' : i % 4 === 1 ? 'bg-primary' : i % 4 === 2 ? 'bg-secondary' : 'bg-success'}
              `}
              style={{
                left: `${10 + (i * 8)}%`,
                top: `${10 + (i * 7)}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressAchievementHub;