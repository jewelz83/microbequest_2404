import React from 'react';
import Icon from '../../../components/AppIcon';

const WaveProgress = ({ 
  currentWave, 
  totalWaves, 
  onPause, 
  onNextWave,
  waveActive = true,
  enemiesRemaining = 0
}) => {
  const progress = (currentWave / totalWaves) * 100;
  const isLastWave = currentWave === totalWaves;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Icon name="Waves" size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-heading text-foreground font-semibold">
              Wave {currentWave} of {totalWaves}
            </h3>
            <p className="font-caption text-xs text-muted-foreground">
              {isLastWave ? 'Final wave!' : `${totalWaves - currentWave} waves remaining`}
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onPause}
            className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            title="Pause Game"
          >
            <Icon name="Pause" size={16} strokeWidth={2.5} />
          </button>
          
          {!waveActive && enemiesRemaining === 0 && currentWave < totalWaves && (
            <button
              onClick={onNextWave}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <span className="font-body font-semibold text-sm">Next Wave</span>
              <Icon name="ArrowRight" size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Wave Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-caption text-muted-foreground">Overall Progress</span>
          <span className="font-mono text-foreground">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          
          {/* Wave Markers */}
          <div className="absolute inset-0 flex justify-between items-center px-0.5">
            {Array.from({ length: totalWaves - 1 }, (_, i) => (
              <div 
                key={i}
                className="w-px h-full bg-white/50"
                style={{ left: `${((i + 1) / totalWaves) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Wave Indicators */}
        <div className="flex justify-between items-center mt-2">
          {Array.from({ length: totalWaves }, (_, i) => {
            const waveNum = i + 1;
            const isCompleted = waveNum < currentWave;
            const isCurrent = waveNum === currentWave;
            const isPending = waveNum > currentWave;

            return (
              <div 
                key={waveNum}
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold
                  ${isCompleted 
                    ? 'bg-success border-success text-success-foreground' 
                    : isCurrent 
                      ? 'bg-primary border-primary text-primary-foreground animate-pulse' 
                      : 'bg-muted border-border text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Icon name="Check" size={14} strokeWidth={3} />
                ) : (
                  waveNum
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wave Status */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`
              w-3 h-3 rounded-full
              ${waveActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}
            `} />
            <span className="font-caption text-sm text-foreground">
              {waveActive ? 'Wave in progress' : 'Wave complete'}
            </span>
          </div>

          {enemiesRemaining > 0 && (
            <div className="flex items-center space-x-1">
              <Icon name="Target" size={14} className="text-red-500" />
              <span className="font-mono text-sm text-foreground">
                {enemiesRemaining} enemies left
              </span>
            </div>
          )}
        </div>

        {/* Wave Completion Message */}
        {!waveActive && enemiesRemaining === 0 && (
          <div className="mt-2 flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-green-500" />
            <span className="font-caption text-sm text-green-700">
              {isLastWave 
                ? 'All waves completed! Prepare for victory!' 
                : 'Wave cleared! Ready for next challenge.'
              }
            </span>
          </div>
        )}
      </div>

      {/* Tips for Current Wave */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
          <div>
            <p className="font-caption text-xs text-blue-800 font-semibold mb-1">
              Wave {currentWave} Strategy Tips:
            </p>
            <ul className="font-caption text-xs text-blue-700 space-y-1">
              {currentWave === 1 && (
                <>
                  <li>• Focus on identifying bacteria types</li>
                  <li>• Use immune cells for natural defense</li>
                  <li>• Preserve good bacteria when possible</li>
                </>
              )}
              {currentWave === 2 && (
                <>
                  <li>• Balance antibiotics with probiotics</li>
                  <li>• Monitor bacterial balance meter</li>
                  <li>• Save defense points for emergencies</li>
                </>
              )}
              {currentWave >= 3 && (
                <>
                  <li>• Expect stronger, faster bacteria</li>
                  <li>• Use combination of defense tools</li>
                  <li>• Maintain immune system health</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveProgress;