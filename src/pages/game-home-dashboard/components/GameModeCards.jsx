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
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1af3ed922-1765090831841.png",
    alt: 'Colorful puzzle pieces with microscopic bacteria and virus illustrations floating and connecting together',
    difficulty: 'Beginner',
    estimatedTime: '10-15 min',
    points: '50-100',
    color: 'primary',
    bgGradient: 'from-primary/20 to-primary/5',
    buttonClass: 'bg-primary',
    microbes: [
    { type: 'bacteria', icon: 'Circle', color: 'text-green-600' },
    { type: 'virus', icon: 'Zap', color: 'text-orange-600' },
    { type: 'fungi', icon: 'Flower', color: 'text-purple-600' }]

  },
  {
    id: 'timeline',
    title: 'Microbe Timeline Adventure',
    description: 'Travel through 350+ years of scientific discovery! Meet famous microbiologists, explore historical breakthroughs, and see how microscopes evolved.',
    route: '/microbe-timeline-adventure',
    icon: 'Clock',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_100afd403-1765260235152.png",
    alt: 'Vintage scientific laboratory with antique microscopes, historical documents, and timeline showing evolution of microbiology discoveries',
    difficulty: 'Intermediate',
    estimatedTime: '20-30 min',
    points: '100-200',
    color: 'accent',
    bgGradient: 'from-accent/20 to-accent/5',
    buttonClass: 'bg-accent',
    microbes: [
    { type: 'history', icon: 'BookOpen', color: 'text-blue-600' },
    { type: 'scientist', icon: 'User', color: 'text-indigo-600' },
    { type: 'discovery', icon: 'Lightbulb', color: 'text-yellow-600' }]

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
    buttonClass: 'bg-rose-600',
    microbes: [
    { type: 'evidence', icon: 'FileText', color: 'text-red-600' },
    { type: 'analysis', icon: 'Microscope', color: 'text-cyan-600' },
    { type: 'solution', icon: 'CheckCircle', color: 'text-emerald-600' }]

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
    buttonClass: 'bg-teal-600',
    microbes: [
    { type: 'protozoa', icon: 'Waves', color: 'text-teal-600' },
    { type: 'algae', icon: 'Leaf', color: 'text-lime-600' },
    { type: 'bacteria', icon: 'Circle', color: 'text-amber-600' }]

  },
  {
    id: 'quiz',
    title: 'Quiz Challenge',
    description: 'Test your knowledge about microorganisms through fun interactive quizzes with immediate feedback.',
    route: '/quiz-challenge-system',
    icon: 'Brain',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_19077bca4-1767175396714.png",
    alt: 'Cartoon brain character with question marks and lightbulbs floating around, surrounded by colorful microorganism illustrations',
    difficulty: 'All Levels',
    estimatedTime: '5-10 min',
    points: '25-75',
    color: 'accent',
    bgGradient: 'from-accent/20 to-accent/5',
    buttonClass: 'bg-accent',
    microbes: [
    { type: 'mixed', icon: 'HelpCircle', color: 'text-violet-600' },
    { type: 'facts', icon: 'BookOpen', color: 'text-rose-600' },
    { type: 'quiz', icon: 'CheckCircle', color: 'text-green-600' }]

  },
  {
    id: 'germ-buster',
    title: 'Germ Buster',
    description: 'Protect the human body from harmful infections using strategic defense tools while maintaining healthy microbial balance.',
    route: '/germ-buster-tower-defense',
    icon: 'Shield',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c4f7f98f-1773211863294.png",
    alt: 'Colorful cartoon immune system battle scene with friendly white blood cells defending against red bacteria invaders in a tower defense style',
    difficulty: 'Advanced',
    estimatedTime: '20-25 min',
    points: '100-200',
    color: 'secondary',
    bgGradient: 'from-secondary/20 to-secondary/5',
    buttonClass: 'bg-orange-500',
    microbes: [
    { type: 'immune-cell', icon: 'Zap', color: 'text-blue-600' },
    { type: 'antibiotic', icon: 'Shield', color: 'text-purple-600' },
    { type: 'probiotic', icon: 'Plus', color: 'text-green-600' }]

  }];


  return (
    <div className={`${className}`}>
      <div className="text-center mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-heading text-foreground mb-3">
          Choose Your Adventure
        </h2>
        <p className="font-body text-muted-foreground max-w-2xl mx-auto text-sm lg:text-base">
          Select a game mode to start your microbiology learning journey. Each adventure offers unique challenges and discoveries!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {gameModes?.map((mode, index) =>
        <Link
          key={mode?.id}
          to={mode?.route}
          className="group block active:scale-[0.98] transition-transform"
          onMouseEnter={() => setHoveredCard(mode?.id)}
          onMouseLeave={() => setHoveredCard(null)}
          onTouchStart={() => setHoveredCard(mode?.id)}
          onTouchEnd={() => setHoveredCard(null)}
        >
          <div
            className={`
              relative bg-gradient-to-br ${mode?.bgGradient} border-2 border-border
              rounded-2xl p-5 lg:p-6 h-full transition-all duration-normal
              hover:shadow-pronounced hover:border-${mode?.color}/30 hover:-translate-y-1
              animate-slide-up
            `}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Header Image */}
            <div className="relative mb-4 overflow-hidden rounded-xl">
              <div className="w-full h-28 sm:h-32 bg-muted">
                <Image
                  src={mode?.image}
                  alt={mode?.alt}
                  className="w-full h-full object-cover transition-transform duration-normal group-hover:scale-105"
                />
              </div>

              {/* Floating Icon */}
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
            <div className="space-y-3 lg:space-y-4">
              <div>
                <h3 className="text-base lg:text-lg font-heading text-foreground mb-1.5 group-hover:text-primary transition-colors duration-fast">
                  {mode?.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {mode?.description}
                </p>
              </div>

              {/* Microbe Types */}
              <div className="flex items-center justify-center space-x-3 py-1.5">
                {mode?.microbes?.map((microbe, idx) =>
                  <div
                    key={idx}
                    className={`
                      w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center
                      transition-all duration-fast shadow-sm
                      ${hoveredCard === mode?.id ? 'animate-bounce-gentle' : ''}
                    `}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <Icon name={microbe?.icon} size={16} className={microbe?.color} strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Icon name="Clock" size={14} className="text-gray-600" strokeWidth={2} />
                    <span className="font-mono text-xs text-muted-foreground">{mode?.estimatedTime}</span>
                  </div>
                  <p className="font-caption text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Icon name="Star" size={14} className="text-yellow-500" strokeWidth={2} />
                    <span className="font-mono text-xs text-accent font-medium">{mode?.points}</span>
                  </div>
                  <p className="font-caption text-xs text-muted-foreground">Points</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <div className={`
                  w-full py-3 px-4 ${mode?.buttonClass || 'bg-primary'} text-white
                  rounded-button text-center font-body font-semibold text-sm
                  transition-all duration-fast group-hover:opacity-90 group-hover:shadow-moderate
                  min-h-[48px] flex items-center justify-center
                `}>
                  Play Now
                </div>
              </div>
            </div>
          </div>
        </Link>
        )}
      </div>
    </div>
  );

};

export default GameModeCards;