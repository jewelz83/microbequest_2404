import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby, Bell, Sparkles, ChevronRight, ChevronLeft, Check,
  Plus, X, Star, Zap, Shield, BookOpen, Trophy, Microscope,
  Loader2, ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 5; // 0=Welcome, 1=Children, 2=Notifications, 3=Features, 4=Done

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Timeline Adventure',
    desc: 'Travel through 350 years of microbiology history. Kids unlock eras and meet real scientists.',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    badge: 'Most Popular',
    badgeColor: 'bg-amber-500/20 text-amber-300',
  },
  {
    icon: '🕵️',
    title: 'Microbe Detective',
    desc: 'Solve outbreak mysteries using real science. Builds critical thinking and lab skills.',
    color: 'from-purple-500/20 to-indigo-500/10',
    border: 'border-purple-500/30',
    badge: 'STEM Focus',
    badgeColor: 'bg-purple-500/20 text-purple-300',
  },
  {
    icon: '🧩',
    title: 'Microbe Matching',
    desc: 'Memory-style card game that teaches microbe names, shapes, and functions.',
    color: 'from-teal-500/20 to-cyan-500/10',
    border: 'border-teal-500/30',
    badge: 'Ages 7+',
    badgeColor: 'bg-teal-500/20 text-teal-300',
  },
  {
    icon: '🏰',
    title: 'Germ Buster Defense',
    desc: 'Tower-defense game where kids deploy immune cells to fight invading germs.',
    color: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/30',
    badge: 'Strategy',
    badgeColor: 'bg-rose-500/20 text-rose-300',
  },
  {
    icon: '🔬',
    title: 'Microscope Discovery Lab',
    desc: 'Interactive digital microscope with real specimen data and guided discovery.',
    color: 'from-blue-500/20 to-sky-500/10',
    border: 'border-blue-500/30',
    badge: 'Lab Sim',
    badgeColor: 'bg-blue-500/20 text-blue-300',
  },
  {
    icon: '🧠',
    title: 'Quiz Challenge',
    desc: 'Adaptive quizzes that adjust difficulty based on your child\'s progress.',
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/30',
    badge: 'Adaptive',
    badgeColor: 'bg-green-500/20 text-green-300',
  },
];

const NOTIFICATION_OPTIONS = [
  {
    id: 'badge_earned',
    icon: Trophy,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
    title: 'Badge Earned',
    desc: 'Get notified when your child unlocks a new achievement badge.',
  },
  {
    id: 'game_completed',
    icon: Star,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
    title: 'Game Mode Completed',
    desc: 'Know when your child finishes a game mode or level.',
  },
  {
    id: 'milestone_reached',
    icon: Zap,
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/15',
    title: 'Milestone Reached',
    desc: 'Celebrate big learning milestones together.',
  },
  {
    id: 'weekly_digest',
    icon: BookOpen,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
    title: 'Weekly Progress Digest',
    desc: 'A weekly summary of your child\'s learning activity.',
  },
  {
    id: 'billing_alerts',
    icon: Shield,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/15',
    title: 'Billing & Account Alerts',
    desc: 'Important updates about your subscription and account.',
  },
];

const AGE_GROUPS = ['Under 7', '7–9', '10–12', '13+'];

// ─── Sub-components ───────────────────────────────────────────────────────────
const StepDots = ({ current, total }) => (
  <div className="flex items-center gap-2 justify-center">
    {Array.from({ length: total })?.map((_, i) => (
      <motion.div
        key={i}
        animate={{ width: i === current ? 28 : 8, opacity: i <= current ? 1 : 0.35 }}
        transition={{ duration: 0.3 }}
        className={`h-2 rounded-full ${
          i < current
            ? 'bg-yellow-400'
            : i === current
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :'bg-indigo-700'
        }`}
      />
    ))}
  </div>
);

const NavBtn = ({ onClick, disabled, children, variant = 'primary' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
      variant === 'primary' ?'bg-gradient-to-r from-yellow-400 to-amber-500 text-indigo-950 hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-amber-500/20' :'bg-indigo-800/60 text-indigo-200 hover:bg-indigo-700/60 border border-indigo-600/40'
    }`}
  >
    {children}
  </button>
);

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
      checked ? 'bg-yellow-400' : 'bg-indigo-700'
    }`}
  >
    <motion.div
      animate={{ x: checked ? 22 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
    />
  </button>
);

// ─── Steps ────────────────────────────────────────────────────────────────────
const WelcomeStep = ({ userName }) => (
  <div className="flex flex-col items-center text-center gap-5 py-4">
    <motion.div
      animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="text-7xl"
    >
      🌻
    </motion.div>
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
        Welcome{userName ? `, ${userName}` : ''}! 🎉
      </h2>
      <p className="text-indigo-300 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
        Your parent account is ready. Let's take 2 minutes to set up MicrobeQuest for your family — link your kids, choose notifications, and explore what's waiting for them.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-2">
      {[
        { emoji: '👶', label: 'Link Children' },
        { emoji: '🔔', label: 'Notifications' },
        { emoji: '🎮', label: 'Key Features' },
      ]?.map((item) => (
        <div
          key={item?.label}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-indigo-800/40 border border-indigo-600/30"
        >
          <span className="text-2xl">{item?.emoji}</span>
          <span className="text-xs font-semibold text-indigo-300">{item?.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const ChildrenStep = ({ children, setChildren }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(AGE_GROUPS?.[1]);

  const addChild = () => {
    const trimmed = name?.trim();
    if (!trimmed) return;
    setChildren((prev) => [...prev, { id: Date.now(), name: trimmed, age }]);
    setName('');
    setAge(AGE_GROUPS?.[1]);
  };

  const removeChild = (id) => setChildren((prev) => prev?.filter((c) => c?.id !== id));

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 mb-3">
          <Baby size={14} className="text-teal-400" />
          <span className="text-xs font-bold text-teal-300">Step 1 of 3</span>
        </div>
        <h2 className="text-xl font-extrabold text-white mb-1">Link Your Children 👶</h2>
        <p className="text-indigo-300 text-sm">Add each child so you can track their progress separately.</p>
      </div>

      {/* Add child form */}
      <div className="rounded-2xl bg-indigo-900/40 border border-indigo-600/30 p-4 flex flex-col gap-3">
        <div>
          <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">Child's Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e?.target?.value)}
            onKeyDown={(e) => e?.key === 'Enter' && addChild()}
            placeholder="e.g. Alex"
            maxLength={30}
            className="w-full px-4 py-2.5 rounded-xl bg-indigo-950/60 border border-indigo-600/40 text-white placeholder-indigo-500 text-sm focus:outline-none focus:border-yellow-400/60 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">Age Group</label>
          <div className="flex gap-2 flex-wrap">
            {AGE_GROUPS?.map((g) => (
              <button
                key={g}
                onClick={() => setAge(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  age === g
                    ? 'bg-yellow-400 text-indigo-950' :'bg-indigo-800/50 text-indigo-300 border border-indigo-600/40 hover:border-yellow-400/40'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={addChild}
          disabled={!name?.trim()}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold text-sm hover:bg-teal-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={15} /> Add Child
        </button>
      </div>

      {/* Children list */}
      {children?.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Added ({children?.length})</p>
          <AnimatePresence>
            {children?.map((child) => (
              <motion.div
                key={child?.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-800/40 border border-indigo-600/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {child?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{child?.name}</p>
                    <p className="text-indigo-400 text-xs">{child?.age}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeChild(child?.id)}
                  className="w-7 h-7 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-colors"
                >
                  <X size={13} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {children?.length === 0 && (
        <p className="text-center text-indigo-500 text-xs italic">You can also add children later in Account Settings.</p>
      )}
    </div>
  );
};

const NotificationsStep = ({ prefs, setPrefs }) => {
  const toggle = (id) =>
    setPrefs((prev) => ({ ...prev, [id]: !prev?.[id] }));

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 mb-3">
          <Bell size={14} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-300">Step 2 of 3</span>
        </div>
        <h2 className="text-xl font-extrabold text-white mb-1">Notification Preferences 🔔</h2>
        <p className="text-indigo-300 text-sm">Choose what updates you'd like to receive about your child's progress.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {NOTIFICATION_OPTIONS?.map((opt) => {
          const IconComp = opt?.icon;
          const isOn = prefs?.[opt?.id] !== false; // default on
          return (
            <div
              key={opt?.id}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                isOn
                  ? 'bg-indigo-800/50 border-indigo-500/40' :'bg-indigo-900/30 border-indigo-700/30 opacity-60'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${opt?.iconBg}`}>
                <IconComp size={17} className={opt?.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{opt?.title}</p>
                <p className="text-indigo-400 text-xs leading-snug mt-0.5">{opt?.desc}</p>
              </div>
              <Toggle checked={isOn} onChange={() => toggle(opt?.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FeaturesStep = () => (
  <div className="flex flex-col gap-5">
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 mb-3">
        <Sparkles size={14} className="text-purple-400" />
        <span className="text-xs font-bold text-purple-300">Step 3 of 3</span>
      </div>
      <h2 className="text-xl font-extrabold text-white mb-1">What's Inside MicrobeQuest 🎮</h2>
      <p className="text-indigo-300 text-sm">Six science-packed game modes designed for curious kids.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {FEATURES?.map((f, i) => (
        <motion.div
          key={f?.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className={`relative flex flex-col gap-2 p-3.5 rounded-xl bg-gradient-to-br ${f?.color} border ${f?.border}`}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-2xl">{f?.icon}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${f?.badgeColor}`}>{f?.badge}</span>
          </div>
          <p className="text-white font-bold text-sm">{f?.title}</p>
          <p className="text-indigo-300 text-xs leading-snug">{f?.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const DoneStep = ({ childCount }) => (
  <div className="flex flex-col items-center text-center gap-5 py-4">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl shadow-amber-500/30"
    >
      <Check size={36} className="text-indigo-950" strokeWidth={3} />
    </motion.div>
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">You're All Set! 🚀</h2>
      <p className="text-indigo-300 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
        {childCount > 0
          ? `${childCount} child profile${childCount > 1 ? 's' : ''} linked, notifications configured, and your family is ready to explore the microscopic world.`
          : 'Your account is configured and ready. You can link children anytime from Account Settings.'}
      </p>
    </div>
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30">
        <Check size={14} className="text-teal-400 shrink-0" />
        <span className="text-teal-300 text-sm font-medium">
          {childCount > 0 ? `${childCount} child${childCount > 1 ? 'ren' : ''} linked` : 'Account created'}
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
        <Check size={14} className="text-amber-400 shrink-0" />
        <span className="text-amber-300 text-sm font-medium">Notifications configured</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30">
        <Check size={14} className="text-purple-400 shrink-0" />
        <span className="text-purple-300 text-sm font-medium">Features tour complete</span>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const SETUP_DONE_KEY = 'microbequest_parent_setup_done';

const ParentSetupFlow = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step data
  const [children, setChildren] = useState([]);
  const [notifPrefs, setNotifPrefs] = useState(
    Object.fromEntries(NOTIFICATION_OPTIONS?.map((o) => [o?.id, true]))
  );

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      if (user) {
        // Save notification preferences to user_profiles
        await supabase
          ?.from('user_profiles')
          ?.update({ notification_preferences: notifPrefs, parent_setup_completed: true })
          ?.eq('id', user?.id);
      }
    } catch (err) {
      console.error('Setup save error:', err);
    } finally {
      setSaving(false);
      localStorage.setItem(SETUP_DONE_KEY, 'true');
      navigate('/parent-controls-dashboard', { replace: true });
    }
  };

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
  };

  const displayName = userProfile?.display_name || user?.user_metadata?.display_name || '';

  const renderStep = () => {
    switch (step) {
      case 0: return <WelcomeStep userName={displayName} />;
      case 1: return <ChildrenStep children={children} setChildren={setChildren} />;
      case 2: return <NotificationsStep prefs={notifPrefs} setPrefs={setNotifPrefs} />;
      case 3: return <FeaturesStep />;
      case 4: return <DoneStep childCount={children?.length} />;
      default: return null;
    }
  };

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-purple-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-teal-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Microscope size={20} className="text-yellow-400" />
            <span className="text-yellow-400 font-extrabold text-sm tracking-wide">MicrobeQuest</span>
          </div>
          {step < TOTAL_STEPS - 1 && (
            <button
              onClick={() => {
                localStorage.setItem(SETUP_DONE_KEY, 'true');
                navigate('/parent-controls-dashboard', { replace: true });
              }}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
            >
              Skip setup →
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <StepDots current={step} total={TOTAL_STEPS} />
          <p className="text-center text-indigo-500 text-xs mt-2">
            Step {step + 1} of {TOTAL_STEPS}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: 'rgba(20,18,60,0.85)', borderColor: 'rgba(99,102,241,0.3)', backdropFilter: 'blur(12px)' }}
        >
          <div className="p-6 sm:p-8 min-h-[420px] flex flex-col">
            <div className="flex-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-indigo-800/40">
              <NavBtn
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                variant="secondary"
              >
                <ChevronLeft size={16} /> Back
              </NavBtn>

              {isLastStep ? (
                <NavBtn onClick={handleFinish} disabled={saving}>
                  {saving ? (
                    <><Loader2 size={15} className="animate-spin" /> Saving…</>
                  ) : (
                    <>Go to Dashboard <ArrowRight size={15} /></>
                  )}
                </NavBtn>
              ) : (
                <NavBtn onClick={() => goTo(step + 1)} disabled={false}>
                  {step === 0 ? 'Get Started' : 'Continue'} <ChevronRight size={16} />
                </NavBtn>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-indigo-600 text-xs mt-4">
          All settings can be changed anytime in{' '}
          <button
            onClick={() => navigate('/parent-account-settings')}
            className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
          >
            Account Settings
          </button>
        </p>
      </div>
    </div>
  );
};

export default ParentSetupFlow;
