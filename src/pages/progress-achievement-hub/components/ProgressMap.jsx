import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProgressMap = ({ 
  progressData = [], 
  currentLevel = 1,
  onNodeClick,
  className = "" 
}) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const defaultProgressData = [
    {
      id: 1,
      title: "Basic Microbes",
      description: "Learn about bacteria and viruses",
      isCompleted: true,
      isUnlocked: true,
      isCurrent: false,
      completionPercentage: 100,
      icon: "Circle",
      position: { x: 10, y: 80 },
      connections: [2]
    },
    {
      id: 2,
      title: "Microscope Basics",
      description: "Discover how to use a microscope",
      isCompleted: true,
      isUnlocked: true,
      isCurrent: false,
      completionPercentage: 100,
      icon: "Microscope",
      position: { x: 30, y: 60 },
      connections: [3, 4]
    },
    {
      id: 3,
      title: "Matching Challenge",
      description: "Match microbes with their names",
      isCompleted: true,
      isUnlocked: true,
      isCurrent: false,
      completionPercentage: 85,
      icon: "Puzzle",
      position: { x: 50, y: 40 },
      connections: [5]
    },
    {
      id: 4,
      title: "World Explorer",
      description: "Find hidden microorganisms",
      isCompleted: false,
      isUnlocked: true,
      isCurrent: true,
      completionPercentage: 60,
      icon: "Compass",
      position: { x: 50, y: 80 },
      connections: [6]
    },
    {
      id: 5,
      title: "Quiz Master",
      description: "Test your microbe knowledge",
      isCompleted: false,
      isUnlocked: true,
      isCurrent: false,
      completionPercentage: 30,
      icon: "Brain",
      position: { x: 70, y: 20 },
      connections: [7]
    },
    {
      id: 6,
      title: "Lab Discovery",
      description: "Advanced microscope techniques",
      isCompleted: false,
      isUnlocked: false,
      isCurrent: false,
      completionPercentage: 0,
      icon: "FlaskConical",
      position: { x: 80, y: 60 },
      connections: [7]
    },
    {
      id: 7,
      title: "Microbe Expert",
      description: "Master all microorganism types",
      isCompleted: false,
      isUnlocked: false,
      isCurrent: false,
      completionPercentage: 0,
      icon: "Trophy",
      position: { x: 90, y: 40 },
      connections: []
    }
  ];

  const mapData = progressData?.length > 0 ? progressData : defaultProgressData;

  const getNodeColor = (node) => {
    if (node?.isCompleted) return 'bg-success border-success text-success-foreground';
    if (node?.isCurrent) return 'bg-primary border-primary text-primary-foreground animate-pulse-soft';
    if (node?.isUnlocked) return 'bg-accent border-accent text-accent-foreground';
    return 'bg-muted border-border text-muted-foreground';
  };

  const getConnectionColor = (fromNode, toNode) => {
    if (fromNode?.isCompleted && toNode?.isUnlocked) return 'stroke-success';
    if (fromNode?.isCompleted) return 'stroke-primary';
    return 'stroke-muted-foreground opacity-30';
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  return (
    <div className={`relative bg-card rounded-2xl p-6 border border-border shadow-moderate ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading text-foreground">Learning Journey</h3>
          <p className="font-caption text-sm text-muted-foreground">
            Track your progress through MicrobeQuest
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="font-caption text-xs text-muted-foreground">Completed</span>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse-soft"></div>
          <span className="font-caption text-xs text-muted-foreground">Current</span>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <span className="font-caption text-xs text-muted-foreground">Locked</span>
        </div>
      </div>
      {/* Progress Map */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {mapData?.map(node => 
            node?.connections?.map(connectionId => {
              const targetNode = mapData?.find(n => n?.id === connectionId);
              if (!targetNode) return null;
              
              return (
                <line
                  key={`${node?.id}-${connectionId}`}
                  x1={`${node?.position?.x}%`}
                  y1={`${node?.position?.y}%`}
                  x2={`${targetNode?.position?.x}%`}
                  y2={`${targetNode?.position?.y}%`}
                  strokeWidth="3"
                  strokeDasharray={node?.isCompleted ? "0" : "5,5"}
                  className={`${getConnectionColor(node, targetNode)} transition-all duration-500`}
                />
              );
            })
          )}
        </svg>

        {/* Progress Nodes */}
        {mapData?.map((node) => (
          <div
            key={node?.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${node?.position?.x}%`, top: `${node?.position?.y}%` }}
            onClick={() => handleNodeClick(node)}
          >
            {/* Node Circle */}
            <div className={`
              relative w-16 h-16 rounded-full border-4 flex items-center justify-center
              transition-all duration-300 shadow-moderate
              ${getNodeColor(node)}
              ${node?.isUnlocked ? 'hover:scale-110 hover:shadow-lg' : 'cursor-not-allowed'}
              ${selectedNode?.id === node?.id ? 'ring-4 ring-ring scale-110' : ''}
            `}>
              <Icon 
                name={node?.icon} 
                size={24} 
                strokeWidth={2.5}
                className={node?.isCompleted ? 'text-white' : ''}
              />

              {/* Progress Ring */}
              {node?.completionPercentage > 0 && node?.completionPercentage < 100 && (
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="28"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - node?.completionPercentage / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
              )}

              {/* Completion Checkmark */}
              {node?.isCompleted && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white">
                  <Icon name="Check" size={12} color="white" strokeWidth={3} />
                </div>
              )}

              {/* Lock Icon for Locked Nodes */}
              {!node?.isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-full">
                  <Icon name="Lock" size={16} className="text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Node Label */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center min-w-24">
              <p className="font-caption text-xs font-semibold text-foreground">
                {node?.title}
              </p>
              {node?.completionPercentage > 0 && (
                <p className="font-mono text-xs text-primary">
                  {node?.completionPercentage}%
                </p>
              )}
            </div>

            {/* Hover Tooltip */}
            {node?.isUnlocked && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-pronounced border border-border min-w-48">
                  <h4 className="font-heading text-sm font-semibold mb-1">{node?.title}</h4>
                  <p className="font-body text-xs text-muted-foreground mb-2">
                    {node?.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-caption text-primary">
                      Progress: {node?.completionPercentage}%
                    </span>
                    {node?.isCompleted && (
                      <span className="font-caption text-success">✓ Complete</span>
                    )}
                  </div>
                  
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                </div>
              </div>
            )}

            {/* Animated Particles for Current Node */}
            {node?.isCurrent && (
              <>
                {[...Array(4)]?.map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-primary rounded-full animate-bounce-gentle opacity-60"
                    style={{
                      left: `${-10 + (i * 15)}px`,
                      top: `${-10 + (i * 8)}px`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </>
            )}
          </div>
        ))}

        {/* Charlie the Zebra Mascot */}
        <div className="absolute bottom-4 right-4">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center shadow-moderate animate-bounce-gentle">
            <Image
              src="/assets/images/charlie-zebra-small.png"
              alt="Charlie the Zebra mascot waving encouragingly at progress map"
              className="w-8 h-8 object-cover rounded-full"
            />
          </div>
        </div>
      </div>
      {/* Selected Node Details */}
      {selectedNode && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-heading text-lg text-foreground mb-1">{selectedNode?.title}</h4>
              <p className="font-body text-sm text-muted-foreground mb-3">
                {selectedNode?.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Target" size={16} className="text-primary" />
                  <span className="font-body text-foreground">
                    Progress: <span className="font-mono font-semibold">{selectedNode?.completionPercentage}%</span>
                  </span>
                </div>
                
                {selectedNode?.isCompleted && (
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="font-caption text-success">Completed</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-muted rounded-full transition-colors duration-fast"
            >
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressMap;