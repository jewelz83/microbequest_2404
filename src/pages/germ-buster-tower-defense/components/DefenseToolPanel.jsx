import React from 'react';
import Icon from '../../../components/AppIcon';

const DefenseToolPanel = ({ 
  tools, 
  selectedTool, 
  defensePoints, 
  ammoCount, 
  onSelectTool,
  rapidFire 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-foreground font-semibold">Medical Arsenal</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">Immune Tools</span>
        </div>
      </div>
      
      {/* Medical-Style Weapon Grid */}
      <div className="grid grid-cols-1 gap-2">
        {tools?.map((tool) => {
          const isSelected = selectedTool?.id === tool?.id;
          const canAfford = defensePoints >= tool?.cost;
          const hasAmmo = tool?.isShootable ? ammoCount?.[tool?.ammoType] > 0 : true;
          const isAvailable = canAfford && hasAmmo && !tool?.onCooldown;
          
          return (
            <button
              key={tool?.id}
              onClick={() => onSelectTool(tool)}
              disabled={!isAvailable}
              className={`
                p-3 rounded-lg text-left transition-all duration-200 border-2
                ${isSelected 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105' 
                  : isAvailable
                    ? 'bg-background hover:bg-muted border-border hover:border-primary hover:shadow-md'
                    : 'bg-muted/50 text-muted-foreground border-muted cursor-not-allowed opacity-60'
                }
                ${tool?.isShootable ? 'border-l-4 border-l-blue-500' : ''}
                ${rapidFire && isSelected ? 'animate-pulse' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Medical Tool Icon with Effect */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                    ${tool?.color} ${isSelected ? 'shadow-lg' : ''}
                    ${tool?.isShootable ? 'border-2 border-white/20' : ''}
                  `}>
                    <Icon 
                      name={tool?.icon} 
                      size={20} 
                      color="white" 
                      strokeWidth={2.5}
                      className={tool?.onCooldown ? 'animate-spin' : ''}
                    />
                  </div>
                  
                  {/* Medical Tool Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm">{tool?.name}</h4>
                      {tool?.isShootable && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-mono bg-blue-500/20 px-1 rounded">INJECT</span>
                        </div>
                      )}
                      {tool?.isHoming && (
                        <Icon name="Navigation" size={12} className="text-blue-400" title="Smart Targeting" />
                      )}
                      {tool?.isSpreadShot && (
                        <Icon name="GitBranchPlus" size={12} className="text-yellow-400" title="Wide Coverage" />
                      )}
                    </div>
                    <p className="text-xs opacity-80 leading-tight">{tool?.description}</p>
                    
                    {/* Medical Tool Stats for Injectable Tools */}
                    {tool?.isShootable && (
                      <div className="flex items-center space-x-3 mt-1 text-xs">
                        <div className="flex items-center space-x-1">
                          <Icon name="Zap" size={10} />
                          <span>{tool?.damage || 'Heal'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={10} />
                          <span>{tool?.cooldown}ms</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="TrendingUp" size={10} />
                          <span>Speed {tool?.projectileSpeed}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Cost and Ammo Display */}
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="Coins" size={12} className="text-yellow-500" />
                      <span className="text-xs font-mono">{tool?.cost}</span>
                    </div>
                    {tool?.onCooldown && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Ammo Counter for Shootable Tools */}
                  {tool?.isShootable && (
                    <div className="flex items-center space-x-1 justify-end">
                      <Icon name="Package" size={10} className="text-blue-500" />
                      <span className={`text-xs font-mono ${
                        ammoCount?.[tool?.ammoType] <= 5 ? 'text-red-500 font-bold' : 
                        ammoCount?.[tool?.ammoType] <= 10 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {ammoCount?.[tool?.ammoType] || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Rapid Response Indicator */}
              {isSelected && rapidFire && tool?.isShootable && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    <Icon name="Zap" size={12} className="text-red-400 animate-pulse" />
                    <span className="text-red-400 font-bold animate-pulse">RAPID RESPONSE ACTIVE</span>
                    <Icon name="Zap" size={12} className="text-red-400 animate-pulse" />
                  </div>
                </div>
              )}
              
              {/* Medical Tool Special Abilities */}
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
                  {tool?.isHoming && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Icon name="Target" size={10} className="text-blue-400" />
                      <span className="text-blue-400">Seeks harmful bacteria with smart targeting</span>
                    </div>
                  )}
                  {tool?.isSpreadShot && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Icon name="GitBranchPlus" size={10} className="text-yellow-400" />
                      <span className="text-yellow-400">Covers wider area with triple injection</span>
                    </div>
                  )}
                  {tool?.isAreaEffect && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Icon name="Circle" size={10} className="text-orange-400" />
                      <span className="text-orange-400">Area treatment effect</span>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Immune Defense Control Tips */}
      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={14} className="text-primary" />
          <span className="text-sm font-semibold">Defense Controls</span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>• Select a medical tool and move your immune defender</p>
          <p>• Press SPACE or click to inject treatment upward</p>
          <p>• Enable Rapid Response for continuous treatment</p>
          <p>• Smart targeting tools track harmful bacteria</p>
          <p>• Wide coverage tools treat larger areas</p>
        </div>
        
        {/* Current Medical Tool Status */}
        {selectedTool && (
          <div className="mt-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Active Tool:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${selectedTool?.color?.replace('bg-', 'bg-')}`}></div>
                <span className="text-xs font-mono">{selectedTool?.name}</span>
              </div>
            </div>
            
            {selectedTool?.isShootable && (
              <div className="mt-1 flex items-center justify-between text-xs">
                <span>Response Rate:</span>
                <span className="font-mono">{selectedTool?.cooldown}ms</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Medical Supply Status */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Package" size={14} className="text-blue-500" />
          <span className="text-sm font-semibold">Medical Supplies</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(ammoCount)?.map(([ammoType, count]) => {
            const weapon = tools?.find(t => t?.ammoType === ammoType);
            if (!weapon) return null;
            
            return (
              <div key={ammoType} className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${weapon?.color?.replace('bg-', 'bg-')}`}></div>
                  <span className="truncate">{weapon?.name?.split(' ')?.[0]}</span>
                </div>
                <span className={`font-mono font-semibold ${
                  count <= 5 ? 'text-red-500' : 
                  count <= 10 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Low Supply Warning */}
        {Object.values(ammoCount)?.some(count => count <= 5) && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center space-x-2 text-red-500">
              <Icon name="AlertTriangle" size={12} className="animate-pulse" />
              <span className="text-xs font-semibold">LOW SUPPLY WARNING</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefenseToolPanel;