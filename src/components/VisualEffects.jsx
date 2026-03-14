// Visual Effects Library for MicrobeQuest
// Reusable animation components and utilities

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ==================== PARTICLE EFFECTS ====================

export const Confetti = ({ active = true, particleCount = 50 }) => {
  if (!active) return null;

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: ['#FFD700', '#FF69B4', '#00CED1', '#FF4500', '#32CD32'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: '-10%',
            backgroundColor: particle.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 100 - 50],
            opacity: [1, 1, 0],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export const Sparkles = ({ children, active = true }) => {
  const sparklePositions = [
    { top: '10%', left: '10%' },
    { top: '20%', right: '15%' },
    { bottom: '15%', left: '20%' },
    { bottom: '10%', right: '10%' },
  ];

  return (
    <div className="relative">
      {children}
      {active && sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={pos}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  );
};

export const FloatingMicrobes = ({ count = 10 }) => {
  const microbes = ['🦠', '🧫', '🔬', '🧬'];
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: microbes[Math.floor(Math.random() * microbes.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 20 + Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-4xl"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// ==================== ANIMATION VARIANTS ====================

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 200, 
      damping: 20 
    }
  }
};

export const slideInLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const slideInRight = {
  hidden: { x: 50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const bounceIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 15 
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// ==================== INTERACTIVE COMPONENTS ====================

export const PulsingButton = ({ children, className = '', ...props }) => (
  <motion.button
    className={className}
    whileHover={{ 
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    {...props}
  >
    {children}
  </motion.button>
);

export const GlowCard = ({ children, className = '', glow = true }) => (
  <motion.div
    className={`relative ${className}`}
    whileHover={glow ? { 
      boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
      scale: 1.02
    } : {}}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const CountingNumber = ({ value, duration = 1 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const increment = end / (duration * 60); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

export const ProgressRing = ({ progress, size = 100, strokeWidth = 8, color = '#8B5CF6' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
        }}
      />
    </svg>
  );
};

// ==================== SUCCESS ANIMATIONS ====================

export const SuccessCelebration = ({ show, onComplete }) => {
  React.useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <>
      <Confetti active={show} particleCount={100} />
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
      >
        <motion.div
          className="text-9xl"
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 0.6 }}
        >
          🎉
        </motion.div>
      </motion.div>
    </>
  );
};

export const ShakeAnimation = ({ children, trigger }) => {
  return (
    <motion.div
      animate={trigger ? {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      } : {}}
    >
      {children}
    </motion.div>
  );
};

// ==================== LOADING ANIMATIONS ====================

export const LoadingSpinner = ({ size = 40, color = '#8B5CF6' }) => (
  <motion.div
    className="rounded-full border-4 border-gray-200"
    style={{
      width: size,
      height: size,
      borderTopColor: color,
    }}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }}
  />
);

export const PulsingDots = () => (
  <div className="flex space-x-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-3 h-3 bg-purple-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

// ==================== BADGE ANIMATIONS ====================

export const BadgeReveal = ({ badge, show }) => {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-center shadow-2xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 15,
          delay: 0.2
        }}
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{ 
            rotate: [0, 10, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.8,
            delay: 0.5
          }}
        >
          🏆
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          New Achievement!
        </h2>
        <p className="text-xl text-white/90">{badge}</p>
      </motion.div>
      <Confetti active={true} particleCount={150} />
    </motion.div>
  );
};

export default {
  Confetti,
  Sparkles,
  FloatingMicrobes,
  PulsingButton,
  GlowCard,
  CountingNumber,
  ProgressRing,
  SuccessCelebration,
  ShakeAnimation,
  LoadingSpinner,
  PulsingDots,
  BadgeReveal,
  // Animation variants
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  bounceIn,
  staggerContainer,
};
