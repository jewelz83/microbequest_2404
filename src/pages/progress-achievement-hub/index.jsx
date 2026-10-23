import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import CharacterGuide from '../../components/ui/CharacterGuide';
import useGuideVisibility from '../../hooks/useGuideVisibility';

import AchievementBadge from './components/AchievementBadge';
import ProgressMap from './components/ProgressMap';
import GameModeStats from './components/GameModeStats';
import MicrobeGallery from './components/MicrobeGallery';
import ParentReports from './components/ParentReports';
import ShareBadgeModal from './components/ShareBadgeModal';
import { loadProgress, loadGameScores } from '../../services/gameProgressService';
import { trackAchievementUnlock, trackAchievementView, trackProgressHubView } from '../../services/analyticsService';

const ALL_EVENTS = [
  'leeuwenhoek-discovery','first-bacteria','jenner-vaccination','pasteur-generation',
  'snow-cholera','lister-antiseptic','koch-tuberculosis','pasteur-rabies','fleming-penicillin',
  'electron-microscope','antibiotics-production','dna-structure-study',
  'watson-crick-dna','genetic-engineering','hiv-discovery','pcr-invention',
  'human-genome','crispr-discovery','covid-pandemic','microbiome-research'
];

const ERA_NAMES = {
  discovery: 'The Discovery Era',
  germTheory: 'The Germ Theory Era',
  modern: 'The Modern Era',
  dnaRevolution: 'The DNA Revolution',
  modernAge: 'The Modern Age',
};

const ERA_EVENTS = {
  discovery: ['leeuwenhoek-discovery','first-bacteria','jenner-vaccination','pasteur-generation'],
  germTheory: ['snow-cholera','lister-antiseptic','koch-tuberculosis','pasteur-rabies','fleming-penicillin'],
  modern: ['electron-microscope','antibiotics-production','dna-structure-study'],
  dnaRevolution: ['watson-crick-dna','genetic-engineering','hiv-discovery','pcr-invention'],
  modernAge: ['human-genome','crispr-discovery','covid-pandemic','microbiome-research'],
};

const getAchievements = (progress) => {
  const completed = progress?.completedEvents || [];
  const points = progress?.totalPoints || 0;
  const unlockedEras = progress?.unlockedEras || ['discovery'];

  return [
    {
      id: 1,
      name: 'First Discovery',
      description: 'Complete your first timeline event',
      icon: 'Microscope',
      rarity: 'bronze',
      points: 10,
      isUnlocked: completed?.length >= 1,
      progress: Math.min(completed?.length / 1 * 100, 100),
    },
    {
      id: 2,
      name: 'Discovery Era Complete',
      description: 'Complete all events in the Discovery Era',
      icon: 'Search',
      rarity: 'silver',
      points: 50,
      isUnlocked: ERA_EVENTS?.discovery?.every(id => completed?.includes(id)),
      progress: Math.round((ERA_EVENTS?.discovery?.filter(id => completed?.includes(id))?.length / ERA_EVENTS?.discovery?.length) * 100),
    },
    {
      id: 3,
      name: 'Germ Theory Master',
      description: 'Complete all events in the Germ Theory Era',
      icon: 'Shield',
      rarity: 'silver',
      points: 75,
      isUnlocked: ERA_EVENTS?.germTheory?.every(id => completed?.includes(id)),
      progress: Math.round((ERA_EVENTS?.germTheory?.filter(id => completed?.includes(id))?.length / ERA_EVENTS?.germTheory?.length) * 100),
    },
    {
      id: 4,
      name: 'DNA Pioneer',
      description: 'Complete all events in the DNA Revolution Era',
      icon: 'Dna',
      rarity: 'gold',
      points: 100,
      isUnlocked: ERA_EVENTS?.dnaRevolution?.every(id => completed?.includes(id)),
      progress: Math.round((ERA_EVENTS?.dnaRevolution?.filter(id => completed?.includes(id))?.length / ERA_EVENTS?.dnaRevolution?.length) * 100),
    },
    {
      id: 5,
      name: 'Point Collector',
      description: 'Earn 500 total points',
      icon: 'Star',
      rarity: 'gold',
      points: 50,
      isUnlocked: points >= 500,
      progress: Math.min(Math.round((points / 500) * 100), 100),
    },
    {
      id: 6,
      name: 'Time Traveler',
      description: 'Unlock all 5 eras',
      icon: 'Clock',
      rarity: 'platinum',
      points: 200,
      isUnlocked: unlockedEras?.length === 5,
      progress: Math.round((unlockedEras?.length / 5) * 100),
    },
    {
      id: 7,
      name: 'Halfway There',
      description: 'Complete 10 timeline events',
      icon: 'TrendingUp',
      rarity: 'bronze',
      points: 30,
      isUnlocked: completed?.length >= 10,
      progress: Math.min(Math.round((completed?.length / 10) * 100), 100),
    },
    {
      id: 8,
      name: 'MicrobeQuest Champion',
      description: 'Complete all 18 timeline events',
      icon: 'Trophy',
      rarity: 'platinum',
      points: 500,
      isUnlocked: completed?.length >= 18,
      progress: Math.round((completed?.length / 18) * 100),
    },
  ];
};

const defaultProgress = {
  unlockedEras: ['discovery'],
  unlockedEvents: ['leeuwenhoek-discovery'],
  completedEvents: [],
  totalPoints: 0,
  collectedCards: [],
  achievements: [],
};

const ProgressAchievementHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { shouldShowGuide, hideGuide } = useGuideVisibility('progress-achievement-hub');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [shareAchievement, setShareAchievement] = useState(null);
  const [progress, setProgress] = useState(defaultProgress);
  const [gameScores, setGameScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track hub view on mount
  useEffect(() => {
    trackProgressHubView('overview');
  }, []);

  // Track tab changes
  useEffect(() => {
    if (activeTab !== 'overview') {
      trackProgressHubView(activeTab);
    }
  }, [activeTab]);

  // Load progress and scores from Supabase (with localStorage fallback)
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [progressData, scoresData] = await Promise.all([
          loadProgress(),
          loadGameScores(),
        ]);
        if (!cancelled) {
          setProgress(progressData ?? defaultProgress);
          setGameScores(scoresData ?? []);
        }
      } catch (err) {
        console.error('Error loading progress hub data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [activeTab]);

  const achievements = getAchievements(progress);
  const completedCount = progress?.completedEvents?.length || 0;
  const unlockedAchievements = achievements?.filter(a => a?.isUnlocked);
  const achievementPoints = unlockedAchievements?.reduce((sum, a) => sum + a?.points, 0);

  // Track newly unlocked achievements
  useEffect(() => {
    if (!loading) {
      unlockedAchievements?.forEach(a => {
        trackAchievementUnlock(a?.id, a?.name, { rarity: a?.rarity, points: a?.points });
      });
    }
  }, [loading]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'achievements', label: 'Achievements', icon: 'Trophy' },
    { id: 'progress', label: 'Learning Map', icon: 'Map' },
    { id: 'collection', label: 'My Collection', icon: 'Grid3X3' },
    { id: 'reports', label: 'Parent Reports', icon: 'FileText' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-moderate">
              <Icon name="Trophy" size={32} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-heading text-foreground mb-1">Your Progress</h2>
              <p className="font-body text-muted-foreground">
                {completedCount === 0
                  ? "Start your journey in the Timeline Adventure!"
                  : `You've completed ${completedCount} discovery${completedCount !== 1 ? 's' : ''} and earned ${unlockedAchievements?.length} achievement${unlockedAchievements?.length !== 1 ? 's' : ''}!`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Star" size={20} className="text-accent" />
              <span className="font-mono text-2xl font-bold text-foreground">{progress?.totalPoints || 0}</span>
            </div>
            <p className="font-caption text-sm text-muted-foreground">Total Points</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <span className="font-caption text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{completedCount}</p>
          <p className="font-caption text-xs text-muted-foreground">of {ALL_EVENTS?.length} events</p>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Trophy" size={20} className="text-accent" />
            <span className="font-caption text-sm text-muted-foreground">Achievements</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{unlockedAchievements?.length}</p>
          <p className="font-caption text-xs text-muted-foreground">of {achievements?.length} unlocked</p>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Unlock" size={20} className="text-primary" />
            <span className="font-caption text-sm text-muted-foreground">Eras Unlocked</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{progress?.unlockedEras?.length || 1}</p>
          <p className="font-caption text-xs text-muted-foreground">of 5 eras</p>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Star" size={20} className="text-secondary" />
            <span className="font-caption text-sm text-muted-foreground">Achievement Pts</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{achievementPoints}</p>
          <p className="font-caption text-xs text-muted-foreground">bonus points</p>
        </div>
      </div>

      {/* Era Progress */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-moderate">
        <h3 className="text-xl font-heading text-foreground mb-4">Era Progress</h3>
        <div className="space-y-4">
          {Object.entries(ERA_EVENTS)?.map(([eraId, events]) => {
            const completed = events?.filter(id => progress?.completedEvents?.includes(id))?.length;
            const isUnlocked = progress?.unlockedEras?.includes(eraId);
            const pct = Math.round((completed / events?.length) * 100);
            const eraColors = { discovery: 'amber', germTheory: 'emerald', modern: 'blue', dnaRevolution: 'purple', modernAge: 'cyan' };
            const color = eraColors?.[eraId] || 'primary';
            return (
              <div key={eraId} className={`${!isUnlocked ? 'opacity-40' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-sm text-foreground font-medium">{ERA_NAMES?.[eraId]}</span>
                  <span className="font-mono text-xs text-muted-foreground">{completed}/{events?.length}</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className={`h-full bg-${color}-500 rounded-full transition-all duration-moderate`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Game Scores */}
      {gameScores?.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-moderate">
          <h3 className="text-xl font-heading text-foreground mb-4">Recent Game Sessions</h3>
          <div className="space-y-3">
            {gameScores?.slice(0, 5)?.map((session) => (
              <div key={session?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Gamepad2" size={18} className="text-primary" />
                  <div>
                    <p className="font-body text-sm font-medium text-foreground capitalize">{session?.gameMode?.replace(/-/g, ' ')}</p>
                    <p className="font-caption text-xs text-muted-foreground">{new Date(session?.playedAt)?.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-foreground">{session?.score} pts</p>
                  {session?.correctAnswers > 0 && (
                    <p className="font-caption text-xs text-muted-foreground">{session?.correctAnswers}/{session?.totalQuestions} correct</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Achievements */}
      {unlockedAchievements?.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-moderate">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading text-foreground">Recent Achievements</h3>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('achievements')} iconName="ArrowRight" iconPosition="right">View All</Button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {unlockedAchievements?.slice(0, 4)?.map((achievement) => (
              <div key={achievement?.id} className="flex-shrink-0">
                <AchievementBadge achievement={achievement} isUnlocked={true} showDetails={true} onClick={() => setSelectedAchievement(achievement)} onShare={setShareAchievement} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {completedCount === 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <Icon name="Rocket" size={48} className="text-primary mx-auto mb-4" />
          <h3 className="font-heading text-xl text-foreground mb-2">Your Adventure Awaits!</h3>
          <p className="font-body text-muted-foreground mb-4">Complete events in the Timeline Adventure to build your progress here.</p>
          <Link to="/microbe-timeline-adventure">
            <Button variant="default" iconName="ArrowRight" iconPosition="right">Go to Timeline Adventure</Button>
          </Link>
        </div>
      )}

      {/* Continue Learning */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-moderate">
        <h3 className="text-xl font-heading text-foreground mb-4">Continue Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/microbe-timeline-adventure" className="group bg-gradient-to-br from-purple-50 to-indigo-100 p-4 rounded-lg border border-purple-200 hover:shadow-moderate transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Icon name="Clock" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-heading text-lg text-purple-900 group-hover:text-purple-700">Timeline Adventure</h4>
                <p className="font-body text-sm text-purple-700">{completedCount} of {ALL_EVENTS?.length} complete</p>
              </div>
              <Icon name="ArrowRight" size={20} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link to="/microbe-matching-game" className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-moderate transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="Puzzle" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-heading text-lg text-blue-900 group-hover:text-blue-700">Matching Game</h4>
                <p className="font-body text-sm text-blue-700">Match microbe pairs</p>
              </div>
              <Icon name="ArrowRight" size={20} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
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
          <p className="font-caption text-sm text-muted-foreground">{unlockedAchievements?.length} of {achievements?.length} achievements unlocked</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Star" size={20} className="text-accent" />
          <span className="font-mono text-lg font-bold text-foreground">{achievementPoints}</span>
          <span className="font-caption text-sm text-muted-foreground">bonus points</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {achievements?.map((achievement) => (
          <AchievementBadge key={achievement?.id} achievement={achievement} isUnlocked={achievement?.isUnlocked} showDetails={true} onClick={() => { setSelectedAchievement(achievement); trackAchievementView(achievement?.id, achievement?.name); }} onShare={achievement?.isUnlocked ? setShareAchievement : undefined} />
        ))}
      </div>

      {/* Progress toward next achievement */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-moderate">
        <h4 className="font-heading text-lg text-foreground mb-4">In Progress</h4>
        <div className="space-y-4">
          {achievements?.filter(a => !a?.isUnlocked)?.map(a => (
            <div key={a?.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon name={a?.icon} size={16} className="text-muted-foreground" />
                  <span className="font-body text-sm text-foreground">{a?.name}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{a?.progress}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${a?.progress}%` }} />
              </div>
              <p className="font-caption text-xs text-muted-foreground mt-1">{a?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading text-foreground mb-1 sm:mb-2">Progress & Achievements</h1>
              <p className="font-body text-muted-foreground text-sm sm:text-base">Track your learning journey and celebrate your discoveries!</p>
            </div>
            <Link to="/game-home-dashboard" className="self-start sm:self-auto">
              <Button variant="outline" iconName="ArrowLeft" iconPosition="left" className="min-h-[44px]">Back to Dashboard</Button>
            </Link>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Icon name="Loader2" size={24} className="animate-spin" />
                <span className="font-body">Loading your progress...</span>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* Tabs — horizontally scrollable on mobile */}
              <div className="mb-6 sm:mb-8">
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 p-1 bg-muted rounded-xl scrollbar-hide -mx-1 px-1">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-fast whitespace-nowrap flex-shrink-0 min-h-[44px] active:scale-[0.97]
                        ${activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground shadow-moderate'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background'
                        }`}
                    >
                      <Icon name={tab?.icon} size={16} sm:size={18} strokeWidth={2} />
                      <span className="font-body font-medium text-sm">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'achievements' && renderAchievements()}
                {activeTab === 'progress' && <ProgressMap onNodeClick={(node) => {}} />}
                {activeTab === 'collection' && <MicrobeGallery />}
                {activeTab === 'reports' && <ParentReports />}
                {activeTab === 'overview' && <GameModeStats />}
              </div>
            </>
          )}
        </div>
      </main>
      <CharacterGuide
        character="charlie-zebra"
        message={
          completedCount === 0
            ? "Welcome! Complete events in the Timeline Adventure to start building your progress here!"
            : `Wow! You've completed ${completedCount} discoveries and earned ${unlockedAchievements?.length} achievements. Keep going!`
        }
        emotion="celebrating"
        position="bottom-right"
        isVisible={shouldShowGuide}
        onClose={hideGuide}
        showHint={true}
        hintText="Click on any achievement to see how to unlock it!"
      />
      {selectedAchievement && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {[...Array(12)]?.map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full animate-bounce-gentle ${i % 4 === 0 ? 'bg-accent' : i % 4 === 1 ? 'bg-primary' : i % 4 === 2 ? 'bg-secondary' : 'bg-success'}`}
              style={{ left: `${10 + (i * 8)}%`, top: `${10 + (i * 7)}%`, animationDelay: `${i * 0.1}s`, animationDuration: '2s' }}
            />
          ))}
        </div>
      )}
      <ShareBadgeModal
        achievement={shareAchievement}
        isOpen={!!shareAchievement}
        onClose={() => setShareAchievement(null)}
      />
    </div>
  );
};

export default ProgressAchievementHub;
