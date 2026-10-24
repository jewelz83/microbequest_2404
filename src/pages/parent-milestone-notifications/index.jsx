import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Shield, Trophy, Zap, Microscope, CheckCircle, Bell, BellOff, Filter, ChevronDown, Loader2, Award, Flame, Target, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const SUNFLOWER = "#F5C518";

const MILESTONE_TYPES = {
  badge_earned: {
    label: "Badge Earned",
    icon: Award,
    color: "text-yellow-400",
    bg: "bg-yellow-500/15 border-yellow-500/30",
    dot: "bg-yellow-400",
    emoji: "🏅",
  },
  game_mode_completed: {
    label: "Game Mode Completed",
    icon: Trophy,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
    dot: "bg-emerald-400",
    emoji: "🏆",
  },
  milestone_reached: {
    label: "Milestone Reached",
    icon: Target,
    color: "text-purple-400",
    bg: "bg-purple-500/15 border-purple-500/30",
    dot: "bg-purple-400",
    emoji: "⭐",
  },
  streak: {
    label: "Streak",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-500/15 border-orange-500/30",
    dot: "bg-orange-400",
    emoji: "🔥",
  },
  level_up: {
    label: "Level Up",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
    dot: "bg-blue-400",
    emoji: "⚡",
  },
};

// Realistic mock milestones for when no real data exists
const MOCK_MILESTONES = [
  {
    id: "m1",
    type: "badge_earned",
    title: "Bacteria Explorer Badge",
    description: "Identified all 8 bacteria types in the Microscope Discovery Lab",
    child_name: "Your child",
    created_at: new Date(Date.now() - 1000 * 60 * 30)?.toISOString(),
    read: false,
  },
  {
    id: "m2",
    type: "game_mode_completed",
    title: "Microbe Matching — Complete!",
    description: "Finished all 3 difficulty levels of the Microbe Matching Game",
    child_name: "Your child",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3)?.toISOString(),
    read: false,
  },
  {
    id: "m3",
    type: "milestone_reached",
    title: "100 Points Milestone",
    description: "Reached 100 total discovery points across all game modes",
    child_name: "Your child",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24)?.toISOString(),
    read: true,
  },
  {
    id: "m4",
    type: "streak",
    title: "3-Day Learning Streak 🔥",
    description: "Played MicrobeQuest 3 days in a row — keep it up!",
    child_name: "Your child",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48)?.toISOString(),
    read: true,
  },
  {
    id: "m5",
    type: "badge_earned",
    title: "Germ Buster Badge",
    description: "Defeated 50 germs in the Tower Defense game",
    child_name: "Your child",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72)?.toISOString(),
    read: true,
  },
  {
    id: "m6",
    type: "level_up",
    title: "Level 5 Scientist!",
    description: "Reached Scientist Level 5 through consistent learning",
    child_name: "Your child",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96)?.toISOString(),
    read: true,
  },
  {
    id: "m7",
    type: "game_mode_completed",
    title: "World Explorer — Complete!",
    description: "Explored all 4 environments in World Explorer Mode",
    child_name: "Your child",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120)?.toISOString(),
    read: true,
  },
];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso)?.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function MilestoneCard({ milestone, onMarkRead }) {
  const cfg = MILESTONE_TYPES?.[milestone?.type] || MILESTONE_TYPES?.milestone_reached;
  const MilestoneIcon = cfg?.icon;

  return (
    <div
      className={`relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        !milestone?.read ? "border-indigo-500/50" : "border-indigo-900/40"
      }`}
      style={{
        background: !milestone?.read
          ? "rgba(49,46,129,0.5)"
          : "rgba(30,27,75,0.4)",
      }}
    >
      {!milestone?.read && (
        <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${cfg?.dot}`} />
      )}
      <div className="flex items-start gap-3.5">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${cfg?.bg}`}
        >
          <span className="text-xl">{cfg?.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">{milestone?.title}</p>
              <p className="text-indigo-400 text-xs mt-0.5 leading-relaxed">{milestone?.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg?.bg} ${cfg?.color}`}
            >
              <MilestoneIcon size={10} />
              {cfg?.label}
            </span>
            <span className="text-indigo-500 text-xs flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(milestone?.created_at)}
            </span>
            {!milestone?.read && (
              <button
                onClick={() => onMarkRead(milestone?.id)}
                className="text-xs font-semibold hover:opacity-80 transition-opacity min-h-[28px]"
                style={{ color: SUNFLOWER }}
              >
                Mark read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ emoji, label, value, color }) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col items-center text-center"
      style={{ background: "rgba(30,27,75,0.6)", borderColor: "rgba(99,102,241,0.3)" }}
    >
      <span className="text-2xl mb-1.5">{emoji}</span>
      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      <p className="text-indigo-400 text-xs mt-0.5">{label}</p>
    </div>
  );
}

export default function ParentMilestoneNotificationsPage() {
  const { user } = useAuth();

  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    const loadMilestones = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          const { data } = await supabase
            ?.from("parent_milestone_notifications")
            ?.select("*")
            ?.eq("parent_id", user?.id)
            ?.order("created_at", { ascending: false })
            ?.limit(50);
          if (data && data?.length > 0) {
            setMilestones(data);
          } else {
            setMilestones(MOCK_MILESTONES);
          }
        } else {
          setMilestones(MOCK_MILESTONES);
        }
      } catch {
        setMilestones(MOCK_MILESTONES);
      } finally {
        setLoading(false);
      }
    };
    loadMilestones();
  }, [user?.id]);

  const handleMarkRead = async (id) => {
    setMilestones((prev) =>
      prev?.map((m) => (m?.id === id ? { ...m, read: true } : m))
    );
    if (user?.id) {
      try {
        await supabase
          ?.from("parent_milestone_notifications")
          ?.update({ read: true })
          ?.eq("id", id)
          ?.eq("parent_id", user?.id);
      } catch {
        // silent
      }
    }
  };

  const handleMarkAllRead = () => {
    setMilestones((prev) => prev?.map((m) => ({ ...m, read: true })));
  };

  const filtered = filter === "all"
    ? milestones
    : filter === "unread"
    ? milestones?.filter((m) => !m?.read)
    : milestones?.filter((m) => m?.type === filter);

  const unreadCount = milestones?.filter((m) => !m?.read)?.length;

  const stats = {
    badges: milestones?.filter((m) => m?.type === "badge_earned")?.length,
    completed: milestones?.filter((m) => m?.type === "game_mode_completed")?.length,
    milestones: milestones?.filter((m) => m?.type === "milestone_reached" || m?.type === "level_up")?.length,
    streaks: milestones?.filter((m) => m?.type === "streak")?.length,
  };

  const FILTER_OPTIONS = [
    { value: "all", label: "All Activity" },
    { value: "unread", label: "Unread" },
    { value: "badge_earned", label: "Badges" },
    { value: "game_mode_completed", label: "Game Modes" },
    { value: "milestone_reached", label: "Milestones" },
    { value: "streak", label: "Streaks" },
    { value: "level_up", label: "Level Ups" },
  ];

  return (
    <div
      className="min-h-screen pb-24 lg:pb-10"
      style={{ background: "#0f0c29" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b border-indigo-900/50"
        style={{ background: "rgba(15,12,41,0.92)" }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              to="/parent-controls-dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-white transition-colors min-h-[44px] shrink-0"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Parent Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <span className="text-indigo-700 hidden sm:inline">·</span>
            <span className="text-white font-semibold text-sm hidden sm:inline truncate">Milestone Notifications</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: SUNFLOWER, color: "#1a1000" }}
              >
                {unreadCount} new
              </span>
            )}
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs">
              <Shield size={13} />
              <span className="hidden sm:inline">Parent View</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-5 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border"
            style={{ color: SUNFLOWER, borderColor: `${SUNFLOWER}40`, background: `${SUNFLOWER}12` }}
          >
            <Bell size={11} /> Milestone Notifications
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5">
            Your Child's Progress
          </h1>
          <p className="text-indigo-300 text-sm">
            Badges earned, game modes completed, and learning milestones.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatPill emoji="🏅" label="Badges" value={stats?.badges} color="text-yellow-400" />
          <StatPill emoji="🏆" label="Completed" value={stats?.completed} color="text-emerald-400" />
          <StatPill emoji="⭐" label="Milestones" value={stats?.milestones} color="text-purple-400" />
          <StatPill emoji="🔥" label="Streaks" value={stats?.streaks} color="text-orange-400" />
        </div>

        {/* Filter + Mark All Read */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-700/50 text-indigo-300 hover:text-white hover:border-indigo-500 text-sm font-semibold transition-all min-h-[44px] active:scale-[0.98]"
              style={{ background: "rgba(30,27,75,0.7)" }}
            >
              <Filter size={13} />
              {FILTER_OPTIONS?.find((f) => f?.value === filter)?.label || "All Activity"}
              <ChevronDown size={13} />
            </button>
            {showFilterMenu && (
              <div
                className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-indigo-700/50 shadow-2xl z-20 overflow-hidden"
                style={{ background: "rgba(15,12,41,0.97)" }}
              >
                {FILTER_OPTIONS?.map((opt) => (
                  <button
                    key={opt?.value}
                    onClick={() => { setFilter(opt?.value); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors hover:bg-indigo-800/40 ${
                      filter === opt?.value ? "text-yellow-400" : "text-indigo-300"
                    }`}
                  >
                    {opt?.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity min-h-[44px] px-2"
              style={{ color: SUNFLOWER }}
            >
              <CheckCircle size={12} /> Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={20} className="animate-spin text-indigo-400" />
            <span className="text-indigo-300 text-sm">Loading milestones…</span>
          </div>
        ) : filtered?.length === 0 ? (
          <div
            className="rounded-2xl border border-indigo-700/30 p-10 text-center"
            style={{ background: "rgba(30,27,75,0.4)" }}
          >
            <BellOff size={32} className="mx-auto mb-4 text-indigo-600" />
            <p className="text-white font-bold text-base mb-1">No notifications yet</p>
            <p className="text-indigo-400 text-sm">
              {filter === "unread" ?"All caught up! No unread notifications." :"Milestones will appear here as your child plays."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered?.map((milestone) => (
              <MilestoneCard
                key={milestone?.id}
                milestone={milestone}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        )}

        {/* Email Preferences Link */}
        <div
          className="mt-8 rounded-2xl border p-5 flex items-center gap-4"
          style={{ background: `${SUNFLOWER}10`, borderColor: `${SUNFLOWER}30` }}
        >
          <div className="text-3xl shrink-0">📧</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm mb-0.5">Get email notifications</p>
            <p className="text-indigo-300 text-xs leading-relaxed">
              Configure which milestones trigger email alerts in your account settings.
            </p>
          </div>
          <Link
            to="/parent-account-settings"
            className="shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:opacity-90 whitespace-nowrap min-h-[44px] flex items-center active:scale-[0.98]"
            style={{ background: SUNFLOWER, color: "#1a1000" }}
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
