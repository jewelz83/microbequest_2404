import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import CharacterSpriteSystem from '../../../components/ui/CharacterSpriteSystem';

// ─── Step IDs ────────────────────────────────────────────────────────────────
const STEP = {
  WELCOME_JUJU: 0,
  WELCOME_CHARLIE: 1,
  PROFILE_SETUP: 2,
  AGE_DIFFICULTY: 3,
  GAME_WALKTHROUGH: 4,
  BADGE_INTRO: 5,
  MAP_TOUR: 6,
  PARENT_SETUP: 7,
  CELEBRATION: 8,
};

const TOTAL_STEPS = 9;

// ─── Avatar options ───────────────────────────────────────────────────────────
const AVATARS = [
  { id: 'bacteria', emoji: '🦠', label: 'Bacteria Buddy' },
  { id: 'virus', emoji: '🔬', label: 'Micro Scientist' },
  { id: 'dna', emoji: '🧬', label: 'DNA Explorer' },
  { id: 'atom', emoji: '⚗️', label: 'Lab Wizard' },
  { id: 'star', emoji: '⭐', label: 'Star Discoverer' },
  { id: 'rocket', emoji: '🚀', label: 'Science Rocket' },
];

const COLORS = [
  { id: 'purple', bg: 'bg-purple-500', ring: 'ring-purple-400', label: 'Purple' },
  { id: 'teal', bg: 'bg-teal-500', ring: 'ring-teal-400', label: 'Teal' },
  { id: 'orange', bg: 'bg-orange-500', ring: 'ring-orange-400', label: 'Orange' },
  { id: 'pink', bg: 'bg-pink-500', ring: 'ring-pink-400', label: 'Pink' },
  { id: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-400', label: 'Blue' },
  { id: 'green', bg: 'bg-green-500', ring: 'ring-green-400', label: 'Green' },
];

const DIFFICULTY_OPTIONS = [
  {
    id: 'explorer',
    emoji: '🌱',
    title: 'Curious Explorer',
    ages: 'Ages 7–9',
    desc: 'Simple words, fun pictures, easy quizzes. Perfect for beginners!',
    gradient: 'from-green-400 to-teal-500',
    border: 'border-green-300',
    bg: 'bg-green-50',
  },
  {
    id: 'scientist',
    emoji: '🔬',
    title: 'Junior Scientist',
    ages: 'Ages 10–13',
    desc: 'Real science terms, deeper discoveries, harder challenges!',
    gradient: 'from-purple-500 to-indigo-600',
    border: 'border-purple-300',
    bg: 'bg-purple-50',
  },
];

const GAME_MODES = [
  { icon: '🗺️', label: 'Timeline Adventure', route: '/microbe-timeline-adventure', desc: 'Travel through 350 years of discoveries' },
  { icon: '🧩', label: 'Microbe Matching', route: '/microbe-matching-game', desc: 'Match microbes and learn their names' },
  { icon: '🧠', label: 'Quiz Challenge', route: '/quiz-challenge-system', desc: 'Test your science knowledge' },
  { icon: '🕵️', label: 'Microbe Detective', route: '/microbe-detective-mystery-outbreak', desc: 'Solve outbreak mysteries' },
  { icon: '🏰', label: 'Germ Buster', route: '/germ-buster-tower-defense', desc: 'Defend against germs' },
  { icon: '🌍', label: 'World Explorer', route: '/world-explorer-mode', desc: 'Explore microbe environments' },
];

// ─── Tooltip component ────────────────────────────────────────────────────────
const Tooltip = ({ text, position = 'bottom', children }) => (
  <div className="relative inline-block group">
    {children}
    <div className={`absolute z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity
      ${position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : 'bottom-full mb-2 left-1/2 -translate-x-1/2'}
      bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-xl`}>
      {text}
    </div>
  </div>
);

// ─── Step progress bar ────────────────────────────────────────────────────────
const StepProgress = ({ current, total }) => (
  <div className="flex items-center gap-1.5 justify-center pt-4 pb-1">
    {Array.from({ length: total })?.map((_, i) => (
      <motion.div
        key={i}
        animate={{ width: i === current ? 24 : 8 }}
        transition={{ duration: 0.3 }}
        className={`h-2 rounded-full transition-colors duration-300 ${
          i < current ? 'bg-purple-400' : i === current ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gray-200'
        }`}
      />
    ))}
  </div>
);

// ─── Character speech bubble ──────────────────────────────────────────────────
const SpeechBubble = ({ message = '', borderColor = 'border-purple-200', children }) => (
  <div className={`relative bg-white border-2 ${borderColor} rounded-2xl p-4 shadow-sm`}>
    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" />
    {children || <p className="text-sm text-gray-700 leading-relaxed">{message}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const OnboardingTutorial = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP?.WELCOME_JUJU);
  const [direction, setDirection] = useState(1);

  // Profile state
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS?.[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS?.[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  // Walkthrough state
  const [walkthroughPhase, setWalkthroughPhase] = useState(0);
  const WALKTHROUGH_PHASES = [
    { tip: '👆 This is the Timeline Bar — it shows all the eras you can explore!', highlight: 'timeline' },
    { tip: '🔍 Click on any era card to dive into that discovery period!', highlight: 'era' },
    { tip: '🏆 Earn points for every correct answer and discovery you make!', highlight: 'score' },
    { tip: '🦓 Charlie will pop up with hints whenever you need help!', highlight: 'charlie' },
  ];

  // Parent setup state
  const [parentEmail, setParentEmail] = useState('');
  const [parentPin, setParentPin] = useState('');
  const [skipParent, setSkipParent] = useState(false);

  // Badge animation
  const [badgeVisible, setBadgeVisible] = useState(false);
  useEffect(() => {
    if (step === STEP?.BADGE_INTRO) {
      const t = setTimeout(() => setBadgeVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [step]);

  const goTo = (nextStep) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) goTo(step + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    onComplete?.({ playerName, selectedAvatar, selectedColor, selectedDifficulty, parentEmail, parentPin });
  };

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  const renderStep = () => {
    switch (step) {
      // ── Step 0: Welcome — Aunt Juju ─────────────────────────────────────────
      case STEP?.WELCOME_JUJU:
        return (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 mb-1">
              <span className="text-xs font-bold text-purple-700">Your Science Guide</span>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CharacterSpriteSystem character="aunt-juju" size="xlarge" className="mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-gray-900">Welcome to MicrobeQuest! 🌻</h2>
            <SpeechBubble borderColor="border-purple-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                Hey there, superstar scientist! I'm <strong>Aunt Juju</strong> — your guide through the incredible world of microbiology. Together we'll journey through <strong>350+ years of discoveries</strong>, from Leeuwenhoek's first microscope all the way to modern breakthroughs. Are you ready to explore the world you can't see? 🔬
              </p>
            </SpeechBubble>
            <ActionButton onClick={next} gradient="from-purple-600 to-indigo-600">
              Meet Charlie the Zebra →
            </ActionButton>
          </div>
        );

      // ── Step 1: Welcome — Charlie ───────────────────────────────────────────
      case STEP?.WELCOME_CHARLIE:
        return (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 mb-1">
              <span className="text-xs font-bold text-teal-700">Adventure Companion</span>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CharacterSpriteSystem character="charlie-zebra" size="xlarge" className="mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-gray-900">Howdy, Explorer! 🦓</h2>
            <SpeechBubble borderColor="border-teal-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                I'm <strong>Charlie the Zebra</strong> — your striped safari guide! I'll be bouncing alongside you through every era, every game, and every discovery. We've got <strong>matching games, quiz challenges, a detective mystery, tower defense</strong>, and even a real digital microscope.
                Let's go on the most epic science adventure ever! 🎉
              </p>
            </SpeechBubble>
            <ActionButton onClick={next} gradient="from-teal-500 to-green-600">
              Let's Set Up Your Profile →
            </ActionButton>
            <SkipButton onClick={handleFinish} />
          </div>
        );

      // ── Step 2: Profile Setup ───────────────────────────────────────────────
      case STEP?.PROFILE_SETUP:
        return (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create Your Profile 🧑‍🔬</h2>
              <p className="text-sm text-gray-500">Tell us a bit about yourself, scientist!</p>
            </div>
            {/* Name input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Your Scientist Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e?.target?.value)}
                placeholder="e.g. Alex the Explorer"
                maxLength={30}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-gray-800 font-medium text-sm bg-purple-50/50 transition-colors"
              />
            </div>
            {/* Avatar picker */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pick Your Avatar</label>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS?.map((av) => (
                  <motion.button
                    key={av?.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setSelectedAvatar(av)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      selectedAvatar?.id === av?.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <span className="text-2xl">{av?.emoji}</span>
                    <span className="text-xs font-semibold text-gray-600">{av?.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            {/* Color picker */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Choose Your Color</label>
              <div className="flex gap-3 flex-wrap">
                {COLORS?.map((c) => (
                  <motion.button
                    key={c?.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-full ${c?.bg} transition-all ${
                      selectedColor?.id === c?.id ? `ring-4 ring-offset-2 ${c?.ring} scale-110` : 'hover:scale-105'
                    }`}
                    title={c?.label}
                  />
                ))}
              </div>
            </div>
            <ActionButton
              onClick={next}
              gradient="from-purple-600 to-indigo-600"
              disabled={!playerName?.trim()}
            >
              {playerName?.trim() ? `Looking good, ${playerName?.trim()}! →` : 'Enter your name to continue'}
            </ActionButton>
            <SkipButton onClick={handleFinish} />
          </div>
        );

      // ── Step 3: Age / Difficulty ────────────────────────────────────────────
      case STEP?.AGE_DIFFICULTY:
        return (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Choose Your Level 🎯</h2>
              <p className="text-sm text-gray-500">We'll adjust the science to match your style!</p>
            </div>
            <div className="flex flex-col gap-4">
              {DIFFICULTY_OPTIONS?.map((opt) => (
                <motion.button
                  key={opt?.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDifficulty(opt?.id)}
                  className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                    selectedDifficulty === opt?.id
                      ? `${opt?.border} ${opt?.bg} shadow-lg`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Selected indicator */}
                  {selectedDifficulty === opt?.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center"
                    >
                      <Icon name="Check" size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${opt?.gradient} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                    {opt?.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-gray-900">{opt?.title}</span>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{opt?.ages}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{opt?.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <ActionButton
              onClick={next}
              gradient="from-yellow-500 to-orange-500"
              disabled={!selectedDifficulty}
            >
              {selectedDifficulty ? 'Perfect! Show Me Around →' : 'Pick your level to continue'}
            </ActionButton>
            <SkipButton onClick={handleFinish} />
          </div>
        );

      // ── Step 4: Guided Game Walkthrough ────────────────────────────────────
      case STEP?.GAME_WALKTHROUGH:
        return (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Your First Adventure 🗺️</h2>
              <p className="text-sm text-gray-500">Here's how Timeline Adventure works — your first game!</p>
            </div>
            {/* Mock game UI with tooltips */}
            <div className="relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-4 overflow-hidden">
              {/* Decorative stars */}
              {[...Array(8)]?.map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-300 text-xs"
                  style={{ left: `${10 + i * 11}%`, top: `${8 + (i % 3) * 12}%` }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >✦</motion.div>
              ))}

              {/* Mock Timeline Bar */}
              <motion.div
                animate={walkthroughPhase === 0 ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`relative mb-3 bg-white/10 backdrop-blur rounded-xl p-3 border-2 transition-all ${
                  walkthroughPhase === 0 ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {['1670s', '1800s', '1900s', '1950s', '2000s']?.map((era, i) => (
                    <div key={era} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-gray-900' : 'bg-white/20 text-white'}`}>
                      {era}
                    </div>
                  ))}
                </div>
                {walkthroughPhase === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10"
                  >
                    👆 Timeline Bar — tap an era!
                  </motion.div>
                )}
              </motion.div>

              {/* Mock Era Card */}
              <motion.div
                animate={walkthroughPhase === 1 ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`relative mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border-2 transition-all ${
                  walkthroughPhase === 1 ? 'border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.5)]' : 'border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center text-2xl">🔬</div>
                  <div>
                    <p className="text-white font-bold text-sm">Leeuwenhoek's Discovery</p>
                    <p className="text-white/70 text-xs">1670s · First Microscope Era</p>
                  </div>
                </div>
                {walkthroughPhase === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-teal-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10"
                  >
                    🔍 Tap a card to explore!
                  </motion.div>
                )}
              </motion.div>

              {/* Mock Score */}
              <motion.div
                animate={walkthroughPhase === 2 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`relative mt-4 flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3 border-2 transition-all ${
                  walkthroughPhase === 2 ? 'border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.5)]' : 'border-white/20'
                }`}
              >
                <Icon name="Star" size={20} className="text-yellow-400" />
                <span className="text-white font-bold text-sm">Score: 0 pts</span>
                <span className="ml-auto text-white/60 text-xs">+10 per discovery</span>
                {walkthroughPhase === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-orange-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10"
                  >
                    🏆 Earn points for every answer!
                  </motion.div>
                )}
              </motion.div>

              {/* Charlie hint */}
              {walkthroughPhase === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3 border-2 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]"
                >
                  <CharacterSpriteSystem character="charlie-zebra" size="small" />
                  <div>
                    <p className="text-white font-bold text-xs">Charlie says:</p>
                    <p className="text-white/80 text-xs">"Tap me anytime for a hint! 🦓"</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-green-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10"
                  >
                    🦓 Charlie gives hints!
                  </motion.div>
                </motion.div>
              )}
            </div>
            {/* Walkthrough navigation */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {WALKTHROUGH_PHASES?.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === walkthroughPhase ? 'w-5 bg-purple-500' : i < walkthroughPhase ? 'w-3 bg-purple-300' : 'w-3 bg-gray-200'}`} />
                ))}
              </div>
              {walkthroughPhase < WALKTHROUGH_PHASES?.length - 1 ? (
                <button
                  onClick={() => setWalkthroughPhase((p) => p + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold hover:bg-purple-200 transition-colors"
                >
                  Next tip <Icon name="ChevronRight" size={16} />
                </button>
              ) : (
                <ActionButton onClick={next} gradient="from-purple-600 to-indigo-600" className="!py-2 !px-5 !text-sm !rounded-xl">
                  Got it! →
                </ActionButton>
              )}
            </div>
            <SkipButton onClick={handleFinish} />
          </div>
        );

      // ── Step 5: Badge Intro ─────────────────────────────────────────────────
      case STEP?.BADGE_INTRO:
        return (
          <div className="flex flex-col items-center text-center gap-5">
            <h2 className="text-2xl font-extrabold text-gray-900">Earn Badges! 🏅</h2>
            <p className="text-sm text-gray-500 max-w-xs">Every discovery earns you a badge. Here's your very first one — just for starting your adventure!</p>
            {/* Badge reveal */}
            <AnimatePresence>
              {badgeVisible && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="relative"
                >
                  {/* Glow ring */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-yellow-400/40 blur-xl"
                  />
                  <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 flex items-center justify-center shadow-2xl border-4 border-yellow-300">
                    <div className="text-center">
                      <div className="text-5xl mb-1">🌟</div>
                      <p className="text-xs font-extrabold text-yellow-900">FIRST STEP</p>
                    </div>
                  </div>
                  {/* Sparkles */}
                  {[...Array(6)]?.map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400 text-lg"
                      style={{
                        top: `${50 + 55 * Math.sin((i / 6) * Math.PI * 2)}%`,
                        left: `${50 + 55 * Math.cos((i / 6) * Math.PI * 2)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                    >✦</motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 w-full">
              <p className="font-bold text-gray-800 mb-1">🏅 "First Step" Badge Unlocked!</p>
              <p className="text-sm text-gray-600">You'll collect badges for every game you play, every discovery you make, and every quiz you ace. Check them all in your Progress Hub!</p>
            </div>
            <ActionButton onClick={next} gradient="from-yellow-500 to-orange-500">
              Show Me the Map! 🗺️
            </ActionButton>
            <SkipButton onClick={handleFinish} />
          </div>
        );

      // ── Step 6: Home Dashboard Map Tour ────────────────────────────────────
      case STEP?.MAP_TOUR:
        return (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Your Adventure Map 🗺️</h2>
              <p className="text-sm text-gray-500">Here's everything waiting for you on the home dashboard!</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GAME_MODES?.map((mode, i) => (
                <motion.div
                  key={mode?.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-100 rounded-xl p-3 hover:border-purple-300 transition-colors"
                >
                  <span className="text-2xl leading-none flex-shrink-0">{mode?.icon}</span>
                  <div>
                    <p className="text-xs font-extrabold text-gray-800 leading-tight">{mode?.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{mode?.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Trophy" size={20} className="text-yellow-300" />
                <span className="font-bold text-sm">Progress Hub</span>
              </div>
              <p className="text-xs text-white/80">Track all your badges, scores, and discoveries in one place. Your parents can see your progress too!</p>
            </div>
            <ActionButton onClick={next} gradient="from-purple-600 to-indigo-600">
              Almost Done! Set Up Parent Access →
            </ActionButton>
            <SkipButton onClick={handleFinish} />
          </div>
        );

      // ── Step 7: Parent PIN / Email Setup ───────────────────────────────────
      case STEP?.PARENT_SETUP:
        return (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
                👨‍👩‍👧
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Parent Setup 🔒</h2>
              <p className="text-sm text-gray-500">Optional: Let a parent or guardian keep track of your progress!</p>
            </div>
            {!skipParent ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Parent / Guardian Email</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e?.target?.value)}
                    placeholder="parent@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-gray-800 text-sm bg-blue-50/50 transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-1">We'll send weekly progress digests — no spam, ever.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Create a 4-Digit Parent PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={parentPin}
                    onChange={(e) => setParentPin(e?.target?.value?.replace(/\D/g, '')?.slice(0, 4))}
                    placeholder="••••"
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-gray-800 text-sm bg-blue-50/50 transition-colors tracking-widest text-center text-xl"
                  />
                  <p className="text-xs text-gray-400 mt-1">Used to access parent controls and settings.</p>
                </div>

                <ActionButton onClick={next} gradient="from-blue-500 to-indigo-600">
                  {parentEmail || parentPin ? 'Save & Continue →' : 'Continue Without →'}
                </ActionButton>

                <button
                  onClick={() => setSkipParent(true)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
                >
                  Skip for now — I'll set this up later
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="text-5xl">👍</div>
                <p className="text-sm text-gray-600 text-center">No problem! You can always set up parent access later in the <strong>Parent Controls</strong> section.</p>
                <ActionButton onClick={next} gradient="from-blue-500 to-indigo-600">
                  Let's Celebrate! 🎉
                </ActionButton>
              </div>
            )}
          </div>
        );

      // ── Step 8: Celebration ─────────────────────────────────────────────────
      case STEP?.CELEBRATION:
        return (
          <div className="flex flex-col items-center text-center gap-5">
            {/* Confetti-like floating emojis */}
            <div className="relative w-full h-24 overflow-hidden">
              {['🎉', '🌟', '🦠', '🔬', '🏅', '🦓', '🌻', '⭐']?.map((emoji, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{ left: `${5 + i * 12}%`, top: '0%' }}
                  animate={{ y: [0, 80], opacity: [1, 0], rotate: [0, 360] }}
                  transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.15, ease: 'easeIn' }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex gap-4"
            >
              <CharacterSpriteSystem character="aunt-juju" size="large" />
              <CharacterSpriteSystem character="charlie-zebra" size="large" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You're All Set! 🎊</h2>
              <p className="text-base font-bold text-purple-600 mb-1">Your adventure begins now!</p>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                {playerName ? `Welcome, ${playerName}! ` : ''}Aunt Juju and Charlie are so excited to explore the microscopic world with you. Let's go! 🚀
              </p>
            </div>
            {/* Summary card */}
            <div className="w-full bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-4 text-left space-y-2">
              {playerName && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{selectedAvatar?.emoji}</span>
                  <span className="font-bold text-gray-800">{playerName}</span>
                  <div className={`w-4 h-4 rounded-full ${selectedColor?.bg} ml-auto`} />
                </div>
              )}
              {selectedDifficulty && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon name="Target" size={14} className="text-purple-500" />
                  <span>{selectedDifficulty === 'explorer' ? 'Curious Explorer (Ages 7–9)' : 'Junior Scientist (Ages 10–13)'}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="Award" size={14} className="text-yellow-500" />
                <span>"First Step" badge earned!</span>
              </div>
            </div>
            <motion.button
              onClick={handleFinish}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 rounded-2xl text-white font-extrabold text-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-xl flex items-center justify-center gap-3"
            >
              <Icon name="Rocket" size={22} />
              Start My MicrobeQuest!
            </motion.button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Gradient header bar */}
        <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 flex-shrink-0" />

        {/* Step progress */}
        <div className="flex-shrink-0 px-6">
          <StepProgress current={step} total={TOTAL_STEPS} />
          <div className="text-center mt-1 mb-0">
            <span className="text-xs text-gray-400 font-medium">Step {step + 1} of {TOTAL_STEPS}</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Shared sub-components ────────────────────────────────────────────────────
const ActionButton = ({ onClick, gradient, disabled = false, children, className = '' }) => (
  <motion.button
    onClick={disabled ? undefined : onClick}
    whileHover={disabled ? {} : { scale: 1.03 }}
    whileTap={disabled ? {} : { scale: 0.97 }}
    className={`w-full py-3.5 rounded-2xl text-white font-bold text-base bg-gradient-to-r ${gradient} shadow-lg flex items-center justify-center gap-2 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </motion.button>
);

const SkipButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-xs text-gray-400 hover:text-gray-600 transition-colors w-full text-center"
  >
    Skip intro
  </button>
);

export default OnboardingTutorial;
