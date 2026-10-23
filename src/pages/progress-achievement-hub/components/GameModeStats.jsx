import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { Link } from 'react-router-dom';
import { loadGameScores } from '../../../services/gameProgressService';

const GAME_MODES = [
  {
    id: 'microbe-matching',
    name: 'Microbe Matching',
    route: '/microbe-matching-game',
    icon: 'Puzzle',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Match microorganisms with their names and characteristics',
  },
  {
    id: 'world-explorer',
    name: 'World Explorer',
    route: '/world-explorer-mode',
    icon: 'Compass',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Discover hidden microbes in different environments',
  },
  {
    id: 'quiz-challenge',
    name: 'Quiz Challenge',
    route: '/quiz-challenge-system',
    icon: 'Brain',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Test your knowledge with interactive quizzes',
  },
  {
    id: 'microscope-lab',
    name: 'Discovery Lab',
    route: '/microscope-discovery-lab',
    icon: 'Microscope',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Examine specimens under the microscope',
  },
  {
    id: 'microbe-detective',
    name: 'Microbe Detective',
    route: '/microbe-detective-mystery-outbreak',
    icon: 'Search',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'Investigate mystery outbreaks and identify culprit microbes',
  },
  {
    id: 'germ-buster',
    name: 'Germ Buster',
    route: '/germ-buster-tower-defense',
    icon: 'Shield',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Defend the body from harmful bacteria',
  },
];

const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'bg-success';
  if (percentage >= 60) return 'bg-primary';
  if (percentage >= 40) return 'bg-accent';
  return 'bg-warning';
};

const GameModeStats = ({ className = '' }) => {
  const [allScores, setAllScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadGameScores()?.then((scores) => {
      if (!cancelled) {
        setAllScores(scores ?? []);
        setLoading(false);
      }
    })?.catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const buildStats = () => {
    return GAME_MODES?.map((mode) => {
      const modeScores = allScores?.filter((s) => s?.gameMode === mode?.id);
      const sessions = modeScores?.length ?? 0;
      const bestScore = sessions > 0
        ? Math.max(...modeScores?.map((s) => s?.score ?? 0))
        : 0;
      const avgScore = sessions > 0
        ? Math.round(modeScores?.reduce((acc, s) => acc + (s?.score ?? 0), 0) / sessions)
        : 0;
      const lastPlayed = sessions > 0
        ? modeScores?.sort((a, b) => new Date(b?.playedAt) - new Date(a?.playedAt))?.[0]?.playedAt
        : null;
      // Completion percentage based on sessions played (capped at 100)
      const completionPercentage = Math.min(sessions * 10, 100);

      return {
        ...mode,
        sessions,
        bestScore,
        avgScore,
        lastPlayed,
        completionPercentage,
        hasData: sessions > 0,
      };
    });
  };

  const stats = buildStats();
  const totalSessions = allScores?.length ?? 0;
  const overallAvg = totalSessions > 0
    ? Math.round(allScores?.reduce((acc, s) => acc + (s?.score ?? 0), 0) / totalSessions)
    : 0;

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center space-x-3 text-muted-foreground py-8 justify-center">
          <Icon name="Loader2" size={20} className="animate-spin" />
          <span className="font-body text-sm">Loading game stats...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading text-foreground">Game Mode Statistics</h3>
          <p className="font-caption text-sm text-muted-foreground">
            Your progress across all learning activities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-success" />
          <span className="font-body text-sm text-foreground">Overall Progress</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats?.map((game) => (
          <Link key={game?.id} to={game?.route} className="block group">
            <div className={`
              bg-card border-2 ${game?.borderColor} rounded-xl p-6
              transition-all duration-300 hover:shadow-lg hover:scale-105
              ${game?.bgColor} hover:border-opacity-60 relative
            `}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${game?.bgColor} border-2 ${game?.borderColor}`}>
                    <Icon name={game?.icon} size={24} className={game?.color} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg text-foreground group-hover:text-primary transition-colors">
                      {game?.name}
                    </h4>
                    <p className="font-caption text-xs text-muted-foreground">{game?.description}</p>
                  </div>
                </div>
                <Icon name="ExternalLink" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {game?.hasData ? (
                <>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body text-sm text-foreground">Activity</span>
                      <span className="font-mono text-sm font-semibold text-primary">{game?.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(game?.completionPercentage)}`}
                        style={{ width: `${game?.completionPercentage}%` }}
                      >
                        <div className="h-full bg-white/20 animate-pulse-soft rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Icon name="Trophy" size={14} className={game?.color} />
                        <span className="font-mono text-lg font-bold text-foreground">{game?.bestScore?.toLocaleString()}</span>
                      </div>
                      <p className="font-caption text-xs text-muted-foreground">Best Score</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Icon name="Target" size={14} className={game?.color} />
                        <span className="font-mono text-lg font-bold text-foreground">{game?.avgScore?.toLocaleString()}</span>
                      </div>
                      <p className="font-caption text-xs text-muted-foreground">Avg Score</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Icon name="Gamepad2" size={14} className={game?.color} />
                        <span className="font-mono text-lg font-bold text-foreground">{game?.sessions}</span>
                      </div>
                      <p className="font-caption text-xs text-muted-foreground">Sessions</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Icon name="Clock" size={14} className={game?.color} />
                        <span className="font-mono text-sm font-bold text-foreground">
                          {game?.lastPlayed ? new Date(game?.lastPlayed)?.toLocaleDateString() : '—'}
                        </span>
                      </div>
                      <p className="font-caption text-xs text-muted-foreground">Last Played</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center">
                  <Icon name="Play" size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="font-body text-sm text-muted-foreground">Not played yet</p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">Play to see your stats here!</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-caption text-xs text-muted-foreground">
                  {game?.lastPlayed
                    ? `Last played: ${new Date(game?.lastPlayed)?.toLocaleDateString()}`
                    : 'Never played'}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="font-caption text-xs text-primary group-hover:text-primary/80">
                    {game?.hasData ? 'Continue Playing' : 'Start Playing'}
                  </span>
                  <Icon name="ArrowRight" size={12} className="text-primary group-hover:text-primary/80 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Active indicator */}
              {game?.completionPercentage > 0 && (
                <div className="absolute top-2 right-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse-soft ${game?.completionPercentage === 100 ? 'bg-success' : 'bg-primary'}`} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Overall Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading text-lg text-foreground mb-1">Overall Performance</h4>
            <p className="font-body text-sm text-muted-foreground">
              {totalSessions > 0
                ? `${totalSessions} total sessions · Average score: ${overallAvg} pts`
                : 'Play any game to start tracking your performance!'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-primary">{totalSessions}</p>
            <p className="font-caption text-xs text-muted-foreground">Total Sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeStats;