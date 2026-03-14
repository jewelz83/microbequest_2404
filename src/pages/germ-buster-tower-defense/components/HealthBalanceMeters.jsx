import React from 'react';
import Icon from '../../../components/AppIcon';

const HealthBalanceMeters = ({ 
  immuneHealth, 
  bacterialBalance, 
  selectedLocation 
}) => {
  const getHealthColor = (percentage) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBalanceColor = (balance) => {
    if (balance >= 70) return 'bg-green-500';
    if (balance >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthStatus = (health) => {
    if (health >= 80) return 'Excellent';
    if (health >= 60) return 'Good';
    if (health >= 40) return 'Fair';
    if (health >= 20) return 'Poor';
    return 'Critical';
  };

  const getBalanceStatus = (balance) => {
    if (balance >= 80) return 'Optimal';
    if (balance >= 60) return 'Healthy';
    if (balance >= 40) return 'Imbalanced';
    return 'Critical';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Immune System Health */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Icon name="Shield" size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-foreground">
                Immune System Health
              </h4>
              <p className="font-caption text-xs text-muted-foreground">
                Body's natural defense strength
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="font-mono text-lg font-bold text-foreground">
              {Math.round(immuneHealth)}%
            </span>
            <p className="font-caption text-xs text-muted-foreground">
              {getHealthStatus(immuneHealth)}
            </p>
          </div>
        </div>

        {/* Health Progress Bar */}
        <div className="relative">
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getHealthColor(immuneHealth)}`}
              style={{ width: `${Math.max(0, Math.min(100, immuneHealth))}%` }}
            />
          </div>
          
          {/* Health Markers */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {[25, 50, 75]?.map(marker => (
              <div 
                key={marker}
                className="w-px h-2 bg-white/50"
                style={{ left: `${marker}%` }}
              />
            ))}
          </div>
        </div>

        {/* Health Status Indicators */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-muted-foreground">80-100%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-muted-foreground">40-79%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-muted-foreground">0-39%</span>
            </div>
          </div>
        </div>

        {/* Health Warnings */}
        {immuneHealth < 30 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <Icon name="AlertTriangle" size={14} className="text-red-500" />
            <span className="font-caption text-xs text-red-700">
              Critical health! Use rest and immune cells to recover.
            </span>
          </div>
        )}
      </div>
      {/* Bacterial Balance */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Icon name="Scale" size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-foreground">
                Bacterial Balance
              </h4>
              <p className="font-caption text-xs text-muted-foreground">
                Good vs bad bacteria ratio
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="font-mono text-lg font-bold text-foreground">
              {Math.round(bacterialBalance)}%
            </span>
            <p className="font-caption text-xs text-muted-foreground">
              {getBalanceStatus(bacterialBalance)}
            </p>
          </div>
        </div>

        {/* Balance Progress Bar */}
        <div className="relative">
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getBalanceColor(bacterialBalance)}`}
              style={{ width: `${Math.max(0, Math.min(100, bacterialBalance))}%` }}
            />
          </div>
          
          {/* Balance Optimal Zone Indicator */}
          <div className="absolute inset-0 flex items-center">
            <div 
              className="h-1 bg-green-200 rounded"
              style={{ 
                left: '70%', 
                width: '25%',
                top: '50%',
                transform: 'translateY(-50%)' 
              }}
            />
          </div>
        </div>

        {/* Balance Visualization */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Icon name="Smile" size={12} color="white" strokeWidth={2} />
            </div>
            <span className="font-caption text-xs text-foreground">
              {Math.round(bacterialBalance)}% Good
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Icon name="Frown" size={12} color="white" strokeWidth={2} />
            </div>
            <span className="font-caption text-xs text-foreground">
              {Math.round(100 - bacterialBalance)}% Bad
            </span>
          </div>
        </div>

        {/* Balance Warnings */}
        {bacterialBalance < 50 && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
            <Icon name="AlertTriangle" size={14} className="text-yellow-600" />
            <span className="font-caption text-xs text-yellow-700">
              Bacterial imbalance! Use probiotics to restore balance.
            </span>
          </div>
        )}

        {bacterialBalance < 30 && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <Icon name="AlertCircle" size={14} className="text-red-500" />
            <span className="font-caption text-xs text-red-700">
              Severe imbalance! Avoid antibiotics, focus on probiotics!
            </span>
          </div>
        )}
      </div>
      {/* Location-Specific Information */}
      {selectedLocation && (
        <div className="md:col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Info" size={20} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-heading text-sm font-semibold text-foreground mb-1">
                {selectedLocation?.name} Challenge
              </h4>
              <p className="font-body text-sm text-muted-foreground mb-2">
                {selectedLocation?.fact}
              </p>
              <div className="flex items-center space-x-2">
                <Icon name="Target" size={14} className="text-primary" />
                <span className="font-caption text-xs text-foreground">
                  Goal: {selectedLocation?.winCondition}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthBalanceMeters;