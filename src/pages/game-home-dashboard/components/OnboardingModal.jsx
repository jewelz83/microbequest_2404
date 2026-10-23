import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import CharacterSpriteSystem from '../../../components/ui/CharacterSpriteSystem';

const STEPS = [
  {
    id: 'welcome',
    character: 'aunt-juju',
    characterName: 'Aunt Juju',
    characterRole: 'Your Science Guide',
    bgFrom: 'from-purple-600',
    bgTo: 'to-indigo-600',
    accentColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    title: 'Welcome to MicrobeQuest! 🌻',
    message:
      "Hey there, superstar scientist! I'm Aunt Juju — your guide through the incredible world of microbiology. Together we'll journey through 350+ years of discoveries, from Leeuwenhoek's first microscope all the way to modern breakthroughs. Are you ready to explore the world you can't see?",
    buttonLabel: 'Meet Charlie →',
  },
  {
    id: 'charlie',
    character: 'charlie-zebra',
    characterName: 'Charlie the Zebra',
    characterRole: 'Adventure Companion',
    bgFrom: 'from-teal-500',
    bgTo: 'to-green-600',
    accentColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
    title: "Howdy, Explorer! 🦓",
    message:
      "I'm Charlie the Zebra — your striped safari guide! I'll be bouncing alongside you through every era, every game, and every discovery. We've got matching games, quiz challenges, a detective mystery, a tower defense, and even a real digital microscope. Let's go on the most epic science adventure ever!",
    buttonLabel: 'See What Awaits →',
  },
  {
    id: 'features',
    character: null,
    title: 'Your MicrobeQuest Adventure 🔬',
    message: null,
    buttonLabel: "Let\'s Start Exploring!",
    bgFrom: 'from-yellow-400',
    bgTo: 'to-orange-500',
    accentColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-700',
    features: [
      { icon: '🗺️', label: 'Timeline Adventure', desc: '5 eras, 18 discoveries' },
      { icon: '🔬', label: 'Microscope Lab', desc: 'Real digital specimens' },
      { icon: '🧠', label: 'Quiz Challenges', desc: 'Test your knowledge' },
      { icon: '🕵️', label: 'Microbe Detective', desc: 'Solve outbreak mysteries' },
      { icon: '🏰', label: 'Germ Buster', desc: 'Tower defense science' },
      { icon: '🌍', label: 'World Explorer', desc: 'Explore environments' },
    ],
  },
];

const OnboardingModal = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const current = STEPS?.[step];
  const isLast = step === STEPS?.length - 1;

  const advance = () => {
    if (isLast) {
      onComplete?.();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Gradient header bar */}
        <div className={`h-2 bg-gradient-to-r ${current?.bgFrom} ${current?.bgTo}`} />

        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-5 pb-1">
          {STEPS?.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? `w-6 bg-gradient-to-r ${current?.bgFrom} ${current?.bgTo}`
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-4 min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Character step */}
              {current?.character && (
                <div className="flex flex-col items-center text-center flex-1">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${current?.badgeBg} mb-4`}>
                    <span className={`text-xs font-semibold ${current?.badgeText}`}>
                      {current?.characterRole}
                    </span>
                  </div>

                  <div className="mb-4">
                    <CharacterSpriteSystem
                      character={current?.character}
                      size="large"
                      className="mx-auto"
                    />
                  </div>

                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{current?.title}</h2>

                  <div className={`relative bg-gray-50 border ${current?.borderColor} rounded-2xl p-4 text-left`}>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-50" />
                    <p className="text-sm text-gray-700 leading-relaxed">{current?.message}</p>
                  </div>
                </div>
              )}

              {/* Features step */}
              {!current?.character && (
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">{current?.title}</h2>
                  <p className="text-sm text-gray-500 text-center mb-5">
                    Six amazing ways to explore microbiology
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {current?.features?.map((f, i) => (
                      <motion.div
                        key={f?.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-3 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-3"
                      >
                        <span className="text-2xl leading-none">{f?.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{f?.label}</p>
                          <p className="text-xs text-gray-500">{f?.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action button */}
          <motion.button
            onClick={advance}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`mt-6 w-full py-3.5 rounded-2xl text-white font-bold text-base bg-gradient-to-r ${current?.bgFrom} ${current?.bgTo} shadow-lg flex items-center justify-center gap-2`}
          >
            {isLast && <Icon name="Rocket" size={18} />}
            {current?.buttonLabel}
          </motion.button>

          {/* Skip link */}
          {!isLast && (
            <button
              onClick={() => onComplete?.()}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors w-full text-center"
            >
              Skip intro
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
