import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Home',
      path: '/game-home-dashboard',
      icon: 'Home',
      description: 'Start your microbe adventure'
    },
    {
      label: 'Match',
      path: '/microbe-matching-game',
      icon: 'Puzzle',
      description: 'Match microorganisms'
    },
    {
      label: 'Explore',
      path: '/world-explorer-mode',
      icon: 'Compass',
      description: 'Discover hidden microbes'
    },
    {
      label: 'Quiz',
      path: '/quiz-challenge-system',
      icon: 'Brain',
      description: 'Test your knowledge'
    },
    {
      label: 'Lab',
      path: '/microscope-discovery-lab',
      icon: 'Microscope',
      description: 'Examine specimens closely'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-subtle">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <Link 
          to="/game-home-dashboard" 
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-fast"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-moderate">
              <Icon name="Microscope" size={24} color="white" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse-soft"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-heading text-primary">MicrobeQuest</h1>
            <p className="text-xs font-caption text-muted-foreground -mt-1">Scientific Discovery</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`group relative flex items-center space-x-2 px-4 py-2 rounded-button transition-all duration-fast ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-moderate'
                  : 'text-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                strokeWidth={isActivePath(item?.path) ? 2.5 : 2}
              />
              <span className="font-body font-semibold">{item?.label}</span>
              
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-popover text-popover-foreground text-sm font-caption rounded-md shadow-moderate opacity-0 group-hover:opacity-100 transition-opacity duration-fast pointer-events-none whitespace-nowrap z-10">
                {item?.description}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-popover"></div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Progress Access Button - Desktop */}
        <div className="hidden lg:block">
          <Link to="/progress-achievement-hub">
            <Button
              variant={isActivePath('/progress-achievement-hub') ? 'default' : 'outline'}
              size="sm"
              iconName="Trophy"
              iconPosition="left"
              className="font-body font-semibold"
            >
              Progress
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="lg:hidden"
          iconName={isMobileMenuOpen ? 'X' : 'Menu'}
        />
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-pronounced animate-slide-up">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-button transition-all duration-fast ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-moderate'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={22} 
                  strokeWidth={isActivePath(item?.path) ? 2.5 : 2}
                />
                <div className="flex-1">
                  <span className="font-body font-semibold block">{item?.label}</span>
                  <span className="font-caption text-sm text-muted-foreground">{item?.description}</span>
                </div>
              </Link>
            ))}
            
            {/* Mobile Progress Link */}
            <Link
              to="/progress-achievement-hub"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-button transition-all duration-fast border-t border-border mt-4 pt-4 ${
                isActivePath('/progress-achievement-hub')
                  ? 'bg-accent text-accent-foreground shadow-moderate' :'text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name="Trophy" 
                size={22} 
                strokeWidth={isActivePath('/progress-achievement-hub') ? 2.5 : 2}
              />
              <div className="flex-1">
                <span className="font-body font-semibold block">Progress & Achievements</span>
                <span className="font-caption text-sm text-muted-foreground">View your learning journey</span>
              </div>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;