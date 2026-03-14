import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const GameModeCards = ({ className = "" }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const gameModes = [
    {
      id: 'matching',
      title: 'Microbe Matching',
      description: 'Match microorganisms with their characteristics and learn about different types of bacteria, viruses, and fungi.',
      route: '/microbe-matching-game',
      icon: 'Puzzle',
      image: "https://images.unsplash.com/photo-1725589946752-5d0c8b045845",
      alt: 'Colorful puzzle pieces with microscopic bacteria and virus illustrations floating and connecting together',
      difficulty: 'Beginner',
      estimatedTime: '10-15 min',
      points: '50-100',
      color: 'primary',
      bgGradient: 'from-primary/20 to-primary/5',
      microbes: [
        { type: 'bacteria', icon: 'Circle', color: 'text-green-600' },
        { type: 'virus', icon: 'Zap', color: 'text-orange-600' },
        { type: 'fungi', icon: 'Flower', color: 'text-purple-600' }
      ]
    },
    {
      id: 'timeline',
      title: 'Microbe Timeline Adventure',
      description: 'Travel through 350+ years of scientific discovery! Meet famous microbiologists, explore historical breakthroughs, and see how microscopes evolved.',
      route: '/microbe-timeline-adventure',
      icon: 'Clock',
      image: "https://images.unsplash.com/photo-1634141737357-bbec5c1d21f6",
      alt: 'Vintage scientific laboratory with antique microscopes, historical documents, and timeline showing evolution of microbiology discoveries',
      difficulty: 'Intermediate',
      estimatedTime: '20-30 min',
      points: '100-200',
      color: 'accent',
      bgGradient: 'from-accent/20 to-accent/5',
      microbes: [
        { type: 'history', icon: 'BookOpen', color: 'text-blue-600' },
        { type: 'scientist', icon: 'User', color: 'text-indigo-600' },
        { type: 'discovery', icon: 'Lightbulb', color: 'text-yellow-600' }
      ]
    },
    {
      id: 'detective',
      title: 'Microbe Detective',
      description: 'Solve mysterious disease outbreaks! Interview patients, analyze samples, and use real scientific methods to identify harmful microbes.',
      route: '/microbe-detective-mystery-outbreak',
      icon: 'Search',
      image: "https://images.unsplash.com/photo-1705592886711-ac47f3ecf4f4",
      alt: 'Detective magnifying glass examining medical charts, laboratory samples, and microscope slides with mysterious bacterial cultures',
      difficulty: 'Advanced',
      estimatedTime: '25-35 min',
      points: '150-250',
      color: 'secondary',
      bgGradient: 'from-secondary/20 to-secondary/5',
      microbes: [
        { type: 'evidence', icon: 'FileText', color: 'text-red-600' },
        { type: 'analysis', icon: 'Microscope', color: 'text-cyan-600' },
        { type: 'solution', icon: 'CheckCircle', color: 'text-emerald-600' }
      ]
    },
    {
      id: 'explorer',
      title: 'World Explorer',
      description: 'Explore different environments and discover hidden microorganisms in soil, water, and living organisms.',
      route: '/world-explorer-mode',
      icon: 'Compass',
      image: "https://images.unsplash.com/photo-1683817495034-e58e1530be34",
      alt: 'Magnifying glass hovering over diverse natural environments showing soil cross-section, water droplets, and plant roots with tiny microorganisms',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      points: '75-150',
      color: 'secondary',
      bgGradient: 'from-secondary/20 to-secondary/5',
      microbes: [
        { type: 'protozoa', icon: 'Waves', color: 'text-teal-600' },
        { type: 'algae', icon: 'Leaf', color: 'text-lime-600' },
        { type: 'bacteria', icon: 'Circle', color: 'text-amber-600' }
      ]
    },
    {
      id: 'quiz',
      title: 'Quiz Challenge',
      description: 'Test your knowledge about microorganisms through fun interactive quizzes with immediate feedback.',
      route: '/quiz-challenge-system',
      icon: 'Brain',
      image: "https://images.unsplash.com/photo-1724242373344-5e9f66009f11",
      alt: 'Cartoon brain character with question marks and lightbulbs floating around, surrounded by colorful microorganism illustrations',
      difficulty: 'All Levels',
      estimatedTime: '5-10 min',
      points: '25-75',
      color: 'accent',
      bgGradient: 'from-accent/20 to-accent/5',
      microbes: [
        { type: 'mixed', icon: 'HelpCircle', color: 'text-violet-600' },
        { type: 'facts', icon: 'BookOpen', color: 'text-rose-600' },
        { type: 'quiz', icon: 'CheckCircle', color: 'text-green-600' }
      ]
    },
    {
      id: 'germ-buster',
      title: 'Germ Buster',
      description: 'Protect the human body from harmful infections using strategic defense tools while maintaining healthy microbial balance.',
      route: '/germ-buster-tower-defense',
      icon: 'Shield',
      image: "https://images.unsplash.com/photo-1604168919451-424c80a7053e",
      alt: 'Colorful cartoon immune system battle scene with friendly white blood cells defending against red bacteria invaders in a tower defense style',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      points: '100-200',
      color: 'secondary',
      bgGradient: 'from-secondary/20 to-secondary/5',
      microbes: [
        { type: 'immune-cell', icon: 'Zap', color: 'text-blue-600' },
        { type: 'antibiotic', icon: 'Shield', color: 'text-purple-600' },
        { type: 'probiotic', icon: 'Plus', color: 'text-green-600' }
      ]
    }
  ];

  return (
    <div className={`${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-heading text-foreground mb-3">
          Choose Your Adventure
        </h2>
        <p className="font-body text-muted-foreground max-w-2xl mx-auto">
          Select a game mode to start your microbiology learning journey. Each adventure offers unique challenges and discoveries!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameModes?.map((mode, index) => (
          <Link
            key={mode?.id}
            to={mode?.route}
            className="group block"
            onMouseEnter={() => setHoveredCard(mode?.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className={`
                relative bg-gradient-to-br ${mode?.bgGradient} border-2 border-border
                rounded-2xl p-6 h-full transition-all duration-normal
                hover:shadow-pronounced hover:border-${mode?.color}/30 hover:-translate-y-1
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Header Image */}
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <div className="w-full h-32 bg-muted">
                  <Image
                    src={mode?.image}
                    alt={mode?.alt}
                    className="w-full h-full object-cover transition-transform duration-normal group-hover:scale-105"
                  />
                </div>

                {/* Floating Icon - Enhanced contrast with shadow and border */}
                <div className={`
                  absolute top-3 right-3 w-10 h-10 bg-white rounded-full
                  flex items-center justify-center shadow-lg border-2 border-white
                  ${hoveredCard === mode?.id ? 'animate-bounce-gentle' : ''}
                `}>
                  <Icon name={mode?.icon} size={20} className={`text-${mode?.color}`} strokeWidth={2.5} />
                </div>

                {/* Difficulty Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className={`
                    px-2 py-1 bg-white border-2 border-${mode?.color}/30 rounded-full
                    font-caption text-xs text-${mode?.color} font-bold shadow-sm
                  `}>
                    {mode?.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-heading text-foreground mb-2 group-hover:text-primary transition-colors duration-fast">
                    {mode?.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {mode?.description}
                  </p>
                </div>

                {/* Microbe Types - Enhanced with white background and stronger colors */}
                <div className="flex items-center justify-center space-x-3 py-2">
                  {mode?.microbes?.map((microbe, idx) => (
                    <div
                      key={idx}
                      className={`
                        w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center
                        transition-all duration-fast shadow-sm
                        ${hoveredCard === mode?.id ? 'animate-bounce-gentle' : ''}
                      `}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <Icon
                        name={microbe?.icon}
                        size={16}
                        className={microbe?.color}
                        strokeWidth={2.5}
                      />
                    </div>
                  ))}
                </div>

                {/* Stats - Enhanced icon colors */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Icon name="Clock" size={14} className="text-gray-600" strokeWidth={2} />
                      <span className="font-mono text-xs text-muted-foreground">
                        {mode?.estimatedTime}
                      </span>
                    </div>
                    <p className="font-caption text-xs text-muted-foreground">Duration</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Icon name="Star" size={14} className="text-yellow-500" strokeWidth={2} />
                      <span className="font-mono text-xs text-accent font-medium">
                        {mode?.points}
                      </span>
                    </div>
                    <p className="font-caption text-xs text-muted-foreground">Points</p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <div className={`
                    w-full py-3 px-4 bg-${mode?.color} text-white
                    rounded-button text-center font-body font-semibold text-sm
                    transition-all duration-fast group-hover:shadow-moderate
                    flex items-center justify-center space-x-2
                  `}>
                    <span>Start Adventure</span>
                    <Icon
                      name="ArrowRight"
                      size={16}
                      color="white"
                      strokeWidth={2.5}
                      className={`transition-transform duration-fast ${
                        hoveredCard === mode?.id ? 'translate-x-1' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Floating Particles */}
              {hoveredCard === mode?.id && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  {[...Array(4)]?.map((_, i) => (
                    <div
                      key={i}
                      className={`
                        absolute w-1 h-1 rounded-full animate-bounce-gentle
                        bg-${mode?.color}/60
                      `}
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${10 + i * 15}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameModeCards;