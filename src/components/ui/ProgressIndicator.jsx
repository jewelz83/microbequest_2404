import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  completedActivities = 0, 
  totalActivities = 5, 
  discoveredMicrobes = 0, 
  totalMicrobes = 20, 
  achievements = [],
  className = "" 
}) => {
  const activityProgress = (completedActivities / totalActivities) * 100;
  const discoveryProgress = (discoveredMicrobes / totalMicrobes) * 100;
  
  const progressStats = [
    {
      label: 'Activities',
      current: completedActivities,
      total: totalActivities,
      progress: activityProgress,
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      label: 'Discoveries',
      current: discoveredMicrobes,
      total: totalMicrobes,
      progress: discoveryProgress,
      icon: 'Microscope',
      color: 'text-primary'
    },
    {
      label: 'Achievements',
      current: achievements?.length,
      total: 10,
      progress: (achievements?.length / 10) * 100,
      icon: 'Trophy',
      color: 'text-accent'
    }
  ];

  return (
    <div className={`bg-card rounded-lg p-6 shadow-moderate border border-border ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading text-foreground">Learning Progress</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse-soft"></div>
          <span className="font-caption text-sm text-muted-foreground">Active</span>
        </div>
      </div>
      {/* Progress Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {progressStats?.map((stat, index) => (
          <div key={stat?.label} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className={`p-2 rounded-full bg-muted ${stat?.color}`}>
                <Icon name={stat?.icon} size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-body font-semibold text-foreground">
                {stat?.current}/{stat?.total}
              </p>
              <p className="font-caption text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Overall Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-foreground">Overall Progress</span>
          <span className="font-mono text-sm text-primary font-semibold">
            {Math.round((activityProgress + discoveryProgress) / 2)}%
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-normal animate-smooth relative"
              style={{ width: `${Math.round((activityProgress + discoveryProgress) / 2)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse-soft rounded-full"></div>
            </div>
          </div>
          
          {/* Progress Particles */}
          {Math.round((activityProgress + discoveryProgress) / 2) > 50 && (
            <div className="absolute -top-1 -right-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce-gentle"></div>
            </div>
          )}
        </div>
      </div>
      {/* Recent Achievements */}
      {achievements?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="font-body font-semibold text-sm text-foreground mb-3">Recent Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {achievements?.slice(0, 3)?.map((achievement, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20"
              >
                <Icon name="Star" size={14} strokeWidth={2} />
                <span className="font-caption text-xs font-medium">{achievement}</span>
              </div>
            ))}
            {achievements?.length > 3 && (
              <div className="flex items-center space-x-1 text-muted-foreground px-2 py-1">
                <Icon name="Plus" size={14} strokeWidth={2} />
                <span className="font-caption text-xs">
                  {achievements?.length - 3} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;