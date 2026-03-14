import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ParentReports = ({ 
  reportData = null,
  className = "" 
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedReport, setSelectedReport] = useState('overview');

  const defaultReportData = {
    childName: 'Emma',
    totalTimeSpent: '8h 45m',
    activitiesCompleted: 32,
    microbesDiscovered: 15,
    averageScore: 87,
    strongAreas: ['Bacteria Identification', 'Microscope Usage', 'Scientific Facts'],
    improvementAreas: ['Virus Classification', 'Quiz Speed'],
    weeklyProgress: [
      { day: 'Mon', timeSpent: 45, activitiesCompleted: 3, score: 85 },
      { day: 'Tue', timeSpent: 60, activitiesCompleted: 4, score: 92 },
      { day: 'Wed', timeSpent: 30, activitiesCompleted: 2, score: 78 },
      { day: 'Thu', timeSpent: 75, activitiesCompleted: 5, score: 94 },
      { day: 'Fri', timeSpent: 90, activitiesCompleted: 6, score: 88 },
      { day: 'Sat', timeSpent: 120, activitiesCompleted: 8, score: 91 },
      { day: 'Sun', timeSpent: 105, activitiesCompleted: 4, score: 86 }
    ],
    learningObjectives: [
      {
        objective: 'Identify basic microorganism types',
        progress: 95,
        status: 'completed',
        completedAt: '2025-10-15'
      },
      {
        objective: 'Understand microscope operation',
        progress: 80,
        status: 'in-progress',
        completedAt: null
      },
      {
        objective: 'Learn microbe habitats',
        progress: 65,
        status: 'in-progress',
        completedAt: null
      },
      {
        objective: 'Master quiz challenges',
        progress: 45,
        status: 'in-progress',
        completedAt: null
      }
    ],
    recentAchievements: [
      {
        name: 'Bacteria Expert',
        earnedAt: '2025-10-16',
        description: 'Correctly identified 10 different bacteria types'
      },
      {
        name: 'Quick Learner',
        earnedAt: '2025-10-15',
        description: 'Completed 5 activities in one day'
      },
      {
        name: 'Microscope Master',
        earnedAt: '2025-10-14',
        description: 'Successfully used microscope 20 times'
      }
    ]
  };

  const data = reportData || defaultReportData;

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Overview', icon: 'BarChart3' },
    { value: 'progress', label: 'Learning Progress', icon: 'TrendingUp' },
    { value: 'achievements', label: 'Achievements', icon: 'Trophy' },
    { value: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' }
  ];

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-success';
    if (progress >= 70) return 'bg-primary';
    if (progress >= 50) return 'bg-accent';
    return 'bg-warning';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'in-progress': return 'text-primary bg-primary/10 border-primary/20';
      case 'not-started': return 'text-muted-foreground bg-muted border-border';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={20} className="text-blue-600" />
            <span className="font-caption text-sm text-blue-800">Time Spent</span>
          </div>
          <p className="font-mono text-2xl font-bold text-blue-900">{data?.totalTimeSpent}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-600" />
            <span className="font-caption text-sm text-green-800">Activities</span>
          </div>
          <p className="font-mono text-2xl font-bold text-green-900">{data?.activitiesCompleted}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Microscope" size={20} className="text-purple-600" />
            <span className="font-caption text-sm text-purple-800">Discoveries</span>
          </div>
          <p className="font-mono text-2xl font-bold text-purple-900">{data?.microbesDiscovered}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={20} className="text-orange-600" />
            <span className="font-caption text-sm text-orange-800">Avg Score</span>
          </div>
          <p className="font-mono text-2xl font-bold text-orange-900">{data?.averageScore}%</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h4 className="font-heading text-lg text-foreground mb-4">Weekly Activity</h4>
        <div className="grid grid-cols-7 gap-2">
          {data?.weeklyProgress?.map((day, index) => (
            <div key={day?.day} className="text-center">
              <div className="mb-2">
                <div 
                  className="w-full bg-muted rounded-lg overflow-hidden"
                  style={{ height: '80px' }}
                >
                  <div 
                    className="bg-primary rounded-lg transition-all duration-500"
                    style={{ 
                      height: `${(day?.timeSpent / 120) * 100}%`,
                      marginTop: `${100 - (day?.timeSpent / 120) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              <p className="font-caption text-xs text-muted-foreground mb-1">{day?.day}</p>
              <p className="font-mono text-xs text-foreground">{day?.timeSpent}m</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-success/5 p-6 rounded-lg border border-success/20">
          <h4 className="font-heading text-lg text-foreground mb-4 flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <span>Strong Areas</span>
          </h4>
          <ul className="space-y-2">
            {data?.strongAreas?.map((area, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="font-body text-sm text-foreground">{area}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-accent/5 p-6 rounded-lg border border-accent/20">
          <h4 className="font-heading text-lg text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Target" size={20} className="text-accent" />
            <span>Growth Opportunities</span>
          </h4>
          <ul className="space-y-2">
            {data?.improvementAreas?.map((area, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Icon name="ArrowUp" size={16} className="text-accent" />
                <span className="font-body text-sm text-foreground">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <h4 className="font-heading text-lg text-foreground">Learning Objectives Progress</h4>
      
      <div className="space-y-4">
        {data?.learningObjectives?.map((objective, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h5 className="font-body font-semibold text-foreground mb-1">
                  {objective?.objective}
                </h5>
                <div className="flex items-center space-x-2">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-caption border
                    ${getStatusColor(objective?.status)}
                  `}>
                    {objective?.status?.replace('-', ' ')}
                  </span>
                  {objective?.completedAt && (
                    <span className="font-caption text-xs text-muted-foreground">
                      Completed: {new Date(objective.completedAt)?.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <span className="font-mono text-lg font-bold text-foreground">
                  {objective?.progress}%
                </span>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(objective?.progress)}`}
                style={{ width: `${objective?.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <h4 className="font-heading text-lg text-foreground">Recent Achievements</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.recentAchievements?.map((achievement, index) => (
          <div key={index} className="bg-gradient-to-br from-accent/10 to-accent/5 p-4 rounded-lg border border-accent/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Trophy" size={20} color="white" strokeWidth={2.5} />
              </div>
              
              <div className="flex-1">
                <h5 className="font-heading text-sm text-foreground mb-1">
                  {achievement?.name}
                </h5>
                <p className="font-body text-xs text-muted-foreground mb-2">
                  {achievement?.description}
                </p>
                <p className="font-caption text-xs text-accent">
                  Earned: {new Date(achievement.earnedAt)?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <h4 className="font-heading text-lg text-foreground">Personalized Recommendations</h4>
      
      <div className="space-y-4">
        <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={24} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-heading text-lg text-foreground mb-2">Focus on Virus Classification</h5>
              <p className="font-body text-sm text-muted-foreground mb-3">
                Emma shows strong understanding of bacteria but could benefit from more practice with virus identification. 
                Consider spending 15-20 minutes on the Quiz Challenge system focusing on virus-related questions.
              </p>
              <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right">
                Try Quiz Challenge
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/5 p-6 rounded-lg border border-secondary/20">
          <div className="flex items-start space-x-3">
            <Icon name="Target" size={24} className="text-secondary flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-heading text-lg text-foreground mb-2">Improve Response Speed</h5>
              <p className="font-body text-sm text-muted-foreground mb-3">
                While Emma's accuracy is excellent, working on faster recognition could boost confidence. The Matching Game's timed mode would be perfect for this.
              </p>
              <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right">
                Play Matching Game
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-accent/5 p-6 rounded-lg border border-accent/20">
          <div className="flex items-start space-x-3">
            <Icon name="Calendar" size={24} className="text-accent flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-heading text-lg text-foreground mb-2">Maintain Learning Momentum</h5>
              <p className="font-body text-sm text-muted-foreground mb-3">
                Emma has been consistently active! To maintain this great progress, aim for 20-30 minutes 
                of daily engagement across different game modes.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="font-body text-foreground">Current streak: 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-card rounded-2xl p-6 border border-border shadow-moderate ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading text-foreground">Parent Progress Report</h3>
          <p className="font-caption text-sm text-muted-foreground">
            Detailed insights into {data?.childName}'s learning journey
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Download" size={20} className="text-muted-foreground" />
          <Button variant="outline" size="sm">Export Report</Button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Timeframe Selection */}
        <div className="flex items-center space-x-2">
          <span className="font-body text-sm text-foreground">Timeframe:</span>
          <div className="flex space-x-1">
            {timeframes?.map((timeframe) => (
              <button
                key={timeframe?.value}
                onClick={() => setSelectedTimeframe(timeframe?.value)}
                className={`
                  px-3 py-1 rounded-button text-sm font-caption transition-all duration-fast
                  ${selectedTimeframe === timeframe?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {timeframe?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="flex items-center space-x-2">
          <span className="font-body text-sm text-foreground">Report:</span>
          <div className="flex space-x-1">
            {reportTypes?.map((type) => (
              <button
                key={type?.value}
                onClick={() => setSelectedReport(type?.value)}
                className={`
                  flex items-center space-x-1 px-3 py-1 rounded-button text-sm font-caption transition-all duration-fast
                  ${selectedReport === type?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                <Icon name={type?.icon} size={14} strokeWidth={2} />
                <span>{type?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Report Content */}
      <div className="min-h-96">
        {selectedReport === 'overview' && renderOverview()}
        {selectedReport === 'progress' && renderProgress()}
        {selectedReport === 'achievements' && renderAchievements()}
        {selectedReport === 'recommendations' && renderRecommendations()}
      </div>
    </div>
  );
};

export default ParentReports;