import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreDisplay = ({ 
  score, 
  defensePoints, 
  achievements,
  ammoCount
}) => {
  // Calculate total ammo remaining
  const getTotalAmmo = () => {
    if (!ammoCount) return 0;
    return Object.values(ammoCount)?.reduce((total, count) => total + count, 0);
  };

  // Get ammo status color
  const getAmmoStatusColor = () => {
    const total = getTotalAmmo();
    if (total <= 10) return 'text-red-500';
    if (total <= 20) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h3 className="font-heading text-foreground font-semibold flex items-center space-x-2">
        <Icon name="Trophy" size={18} className="text-primary" />
        <span>Combat Stats</span>
      </h3>
      
      {/* Main Score Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Icon name="Star" size={16} className="text-primary" />
            <span className="text-sm font-heading text-primary">Score</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {score?.toLocaleString()}
          </div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Icon name="Zap" size={16} className="text-blue-600" />
            <span className="text-sm font-heading text-blue-600">Energy</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {defensePoints}
          </div>
        </div>
      </div>

      {/* New: Ammo Arsenal Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-sm text-foreground">Arsenal Status</h4>
          <div className={`flex items-center space-x-1 ${getAmmoStatusColor()}`}>
            <Icon name="Package" size={14} />
            <span className="text-sm font-semibold">{getTotalAmmo()} total</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ammoCount && Object.entries(ammoCount)?.map(([ammoType, count]) => {
            const getAmmoIcon = (type) => {
              switch (type) {
                case 'antibiotic': return 'Zap';
                case 'probiotic': return 'Heart';
                case 'immuneCell': return 'Target';
                case 'hygiene': return 'Droplets';
                case 'antiseptic': return 'Crosshair';
                default: return 'Package';
              }
            };

            const getAmmoColor = (count) => {
              if (count <= 2) return 'text-red-500 bg-red-50 border-red-200';
              if (count <= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
              return 'text-green-600 bg-green-50 border-green-200';
            };

            const getAmmoName = (type) => {
              switch (type) {
                case 'antibiotic': return 'Antibiotic';
                case 'probiotic': return 'Probiotic';
                case 'immuneCell': return 'Immune';
                case 'hygiene': return 'Sanitizer';
                case 'antiseptic': return 'Antiseptic';
                default: return type;
              }
            };

            return (
              <div 
                key={ammoType}
                className={`p-2 rounded border ${getAmmoColor(count)}`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name={getAmmoIcon(ammoType)} size={12} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {getAmmoName(ammoType)}
                    </div>
                    <div className="text-xs font-mono">
                      {count} rounds
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Display */}
      {achievements?.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-heading text-sm text-foreground flex items-center space-x-2">
            <Icon name="Award" size={14} className="text-yellow-500" />
            <span>Achievements</span>
          </h4>
          <div className="space-y-1">
            {achievements?.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                <Icon name="Medal" size={12} />
                <span className="text-xs font-semibold">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shooting Performance Stats */}
      <div className="space-y-2">
        <h4 className="font-heading text-sm text-foreground flex items-center space-x-2">
          <Icon name="Target" size={14} className="text-primary" />
          <span>Combat Tips</span>
        </h4>
        <div className="text-xs text-muted-foreground space-y-1 p-2 bg-muted/50 rounded border">
          <p>• Conserve ammo - aim carefully</p>
          <p>• Use area weapons on clusters</p>
          <p>• Smart weapons auto-target</p>
          <p>• Earn energy by eliminating threats</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;