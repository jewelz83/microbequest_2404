import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, User, Lock, Bell, Shield, Loader2, CheckCircle, XCircle, Eye, EyeOff, ChevronDown, ChevronUp, AlertTriangle, LogOut, Trash2, Baby, Plus, Edit2, Check, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import Icon from '../../components/AppIcon';


const SUNFLOWER = "#F5C518";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold max-w-sm animate-slide-up border ${
        toast?.type === "success" ?"bg-emerald-900/90 border-emerald-500/40 text-emerald-200" :"bg-red-900/90 border-red-500/40 text-red-200"
      }`}
    >
      {toast?.type === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
      {toast?.msg}
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, iconBg, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(30,27,75,0.7)", borderColor: "rgba(99,102,241,0.3)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-indigo-900/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={18} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">{title}</p>
            <p className="text-indigo-400 text-xs mt-0.5">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-indigo-500 shrink-0" /> : <ChevronDown size={16} className="text-indigo-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-indigo-900/40">
          {children}
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, value, onSave, type = "text", placeholder }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(val);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="py-3.5 border-b border-indigo-900/30 last:border-0">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition-opacity min-h-[32px] px-2"
            style={{ color: SUNFLOWER }}
          >
            <Edit2 size={11} /> Edit
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2 mt-2">
          <div className="relative flex-1">
            <input
              type={type === "password" && !showPw ? "password" : "text"}
              value={val}
              onChange={(e) => setVal(e?.target?.value)}
              placeholder={placeholder}
              className="w-full bg-indigo-950/60 border border-indigo-700/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-indigo-600 focus:outline-none focus:border-yellow-400/60 transition-colors min-h-[44px]"
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 mt-0.5"
            style={{ background: SUNFLOWER, color: "#1a1000" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          </button>
          <button
            onClick={() => { setEditing(false); setVal(value || ""); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-indigo-700/50 text-indigo-400 hover:text-white transition-all mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <p className="text-white text-sm font-medium">
          {type === "password" ? "••••••••••" : (value || <span className="text-indigo-500 italic">Not set</span>)}
        </p>
      )}
    </div>
  );
}

function NotificationToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-indigo-900/30 last:border-0">
      <div className="flex-1">
        <p className="text-white text-sm font-semibold">{label}</p>
        {description && <p className="text-indigo-400 text-xs mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none mt-0.5 ${checked ? "bg-yellow-500" : "bg-indigo-800"}`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function ChildProfileCard({ child, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(child?.name || "");
  const [age, setAge] = useState(child?.age || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(child?.id, { name, age });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div
      className="rounded-xl border p-4 flex items-center gap-3"
      style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.25)" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
        style={{ background: `${SUNFLOWER}22`, color: SUNFLOWER }}
      >
        {(child?.name || "?")?.[0]?.toUpperCase()}
      </div>
      {editing ? (
        <div className="flex-1 flex gap-2 flex-wrap">
          <input
            value={name}
            onChange={(e) => setName(e?.target?.value)}
            placeholder="Child's name"
            className="flex-1 min-w-[120px] bg-indigo-950/60 border border-indigo-700/50 rounded-lg px-3 py-2 text-white text-sm placeholder-indigo-600 focus:outline-none focus:border-yellow-400/60 min-h-[40px]"
          />
          <input
            value={age}
            onChange={(e) => setAge(e?.target?.value)}
            placeholder="Age"
            type="number"
            min="3"
            max="18"
            className="w-20 bg-indigo-950/60 border border-indigo-700/50 rounded-lg px-3 py-2 text-white text-sm placeholder-indigo-600 focus:outline-none focus:border-yellow-400/60 min-h-[40px]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ background: SUNFLOWER, color: "#1a1000" }}
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-indigo-700/50 text-indigo-400 hover:text-white transition-all"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">{child?.name || "Unnamed"}</p>
            {child?.age && <p className="text-indigo-400 text-xs mt-0.5">Age {child?.age}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-800/50 transition-all"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => onRemove(child?.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ParentAccountSettingsPage() {
  const { user, userProfile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [notifications, setNotifications] = useState({
    badge_earned: true,
    game_mode_completed: true,
    milestone_reached: true,
    weekly_digest: true,
    billing_alerts: true,
  });

  const [children, setChildren] = useState([]);
  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!user?.id) return;
    const loadPrefs = async () => {
      try {
        const { data } = await supabase
          ?.from("user_profiles")
          ?.select("notification_preferences, child_profiles")
          ?.eq("id", user?.id)
          ?.maybeSingle();
        if (data?.notification_preferences) {
          setNotifications((prev) => ({ ...prev, ...data?.notification_preferences }));
        }
        if (data?.child_profiles) {
          setChildren(data?.child_profiles);
        }
      } catch (err) {
        console.error("Prefs load error:", err);
      }
    };
    loadPrefs();
  }, [user?.id]);

  const handleUpdateEmail = async (newEmail) => {
    try {
      const { error } = await supabase?.auth?.updateUser({ email: newEmail });
      if (error) throw error;
      showToast("Confirmation email sent. Check your inbox.");
    } catch (err) {
      showToast(err?.message || "Failed to update email.", "error");
    }
  };

  const handleUpdatePassword = async (newPassword) => {
    if (newPassword?.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }
    try {
      const { error } = await supabase?.auth?.updateUser({ password: newPassword });
      if (error) throw error;
      showToast("Password updated successfully.");
    } catch (err) {
      showToast(err?.message || "Failed to update password.", "error");
    }
  };

  const handleUpdateDisplayName = async (name) => {
    const { error } = await updateProfile({ display_name: name });
    if (error) showToast("Failed to update name.", "error");
    else showToast("Name updated.");
  };

  const handleSaveNotifications = async (updated) => {
    setNotifications(updated);
    try {
      await supabase
        ?.from("user_profiles")
        ?.update({ notification_preferences: updated })
        ?.eq("id", user?.id);
      showToast("Notification preferences saved.");
    } catch {
      showToast("Failed to save preferences.", "error");
    }
  };

  const handleAddChild = async () => {
    if (!newChildName?.trim()) return;
    const newChild = { id: Date.now()?.toString(), name: newChildName?.trim(), age: newChildAge };
    const updated = [...children, newChild];
    setChildren(updated);
    setNewChildName("");
    setNewChildAge("");
    setAddingChild(false);
    try {
      await supabase?.from("user_profiles")?.update({ child_profiles: updated })?.eq("id", user?.id);
      showToast("Child profile added.");
    } catch {
      showToast("Failed to save child profile.", "error");
    }
  };

  const handleUpdateChild = async (id, updates) => {
    const updated = children?.map((c) => (c?.id === id ? { ...c, ...updates } : c));
    setChildren(updated);
    try {
      await supabase?.from("user_profiles")?.update({ child_profiles: updated })?.eq("id", user?.id);
      showToast("Child profile updated.");
    } catch {
      showToast("Failed to update child profile.", "error");
    }
  };

  const handleRemoveChild = async (id) => {
    const updated = children?.filter((c) => c?.id !== id);
    setChildren(updated);
    try {
      await supabase?.from("user_profiles")?.update({ child_profiles: updated })?.eq("id", user?.id);
      showToast("Child profile removed.");
    } catch {
      showToast("Failed to remove child profile.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await supabase?.from("user_profiles")?.delete()?.eq("id", user?.id);
      await supabase?.auth?.signOut();
      navigate("/login");
    } catch (err) {
      showToast("Failed to delete account. Contact support.", "error");
      setDeleteLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pb-24 lg:pb-10"
      style={{ background: "#0f0c29" }}
    >
      <Toast toast={toast} />

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
            <span className="text-white font-semibold text-sm hidden sm:inline truncate">Account Settings</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs shrink-0">
            <Shield size={13} />
            <span className="hidden sm:inline">Parent Account</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-5 py-8">
        {/* Page Title */}
        <div className="mb-7">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border"
            style={{ color: SUNFLOWER, borderColor: `${SUNFLOWER}40`, background: `${SUNFLOWER}12` }}
          >
            <User size={11} /> Account Settings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5">
            Your Parent Account
          </h1>
          <p className="text-indigo-300 text-sm">
            Manage your profile, security, and notification preferences.
          </p>
        </div>

        {!user ? (
          <div
            className="rounded-2xl border border-indigo-700/40 p-8 text-center"
            style={{ background: "rgba(30,27,75,0.7)" }}
          >
            <User size={36} className="mx-auto mb-4 text-indigo-400" />
            <h3 className="text-white font-bold text-lg mb-2">Sign in to manage your account</h3>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm mt-4 hover:opacity-90 transition-opacity min-h-[48px]"
              style={{ background: SUNFLOWER, color: "#1a1000" }}
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Profile Info */}
            <SectionCard icon={User} title="Profile Information" subtitle="Your name and email address" iconBg="bg-indigo-600">
              <div className="mt-3">
                <FieldRow
                  label="Display Name"
                  value={userProfile?.display_name || user?.user_metadata?.full_name || ""}
                  onSave={handleUpdateDisplayName}
                  placeholder="Your name"
                />
                <FieldRow
                  label="Email Address"
                  value={user?.email || ""}
                  onSave={handleUpdateEmail}
                  placeholder="your@email.com"
                />
              </div>
            </SectionCard>

            {/* Security */}
            <SectionCard icon={Lock} title="Security" subtitle="Password and account access" iconBg="bg-purple-700">
              <div className="mt-3">
                <FieldRow
                  label="Password"
                  value=""
                  onSave={handleUpdatePassword}
                  type="password"
                  placeholder="New password (min 8 chars)"
                />
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/parent-controls-dashboard"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-indigo-700/50 text-indigo-300 hover:bg-indigo-800/40 text-sm font-semibold transition-all min-h-[48px] active:scale-[0.98]"
                  >
                    <Shield size={14} /> Manage PIN Lock
                  </Link>
                  <button
                    onClick={() => { signOut(); navigate("/login"); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-indigo-700/50 text-indigo-300 hover:bg-indigo-800/40 text-sm font-semibold transition-all min-h-[48px] active:scale-[0.98]"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </SectionCard>

            {/* Child Profiles */}
            <SectionCard icon={Baby} title="Child Profiles" subtitle="Manage your children's accounts" iconBg="bg-emerald-700">
              <div className="mt-3 space-y-3">
                {children?.length === 0 && !addingChild && (
                  <p className="text-indigo-400 text-sm py-2">No child profiles added yet.</p>
                )}
                {children?.map((child) => (
                  <ChildProfileCard
                    key={child?.id}
                    child={child}
                    onUpdate={handleUpdateChild}
                    onRemove={handleRemoveChild}
                  />
                ))}
                {addingChild ? (
                  <div
                    className="rounded-xl border p-4 space-y-3"
                    style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.25)" }}
                  >
                    <p className="text-white text-sm font-semibold">New Child Profile</p>
                    <div className="flex gap-2 flex-wrap">
                      <input
                        value={newChildName}
                        onChange={(e) => setNewChildName(e?.target?.value)}
                        placeholder="Child's name"
                        className="flex-1 min-w-[140px] bg-indigo-950/60 border border-indigo-700/50 rounded-lg px-3 py-2.5 text-white text-sm placeholder-indigo-600 focus:outline-none focus:border-yellow-400/60 min-h-[44px]"
                      />
                      <input
                        value={newChildAge}
                        onChange={(e) => setNewChildAge(e?.target?.value)}
                        placeholder="Age"
                        type="number"
                        min="3"
                        max="18"
                        className="w-20 bg-indigo-950/60 border border-indigo-700/50 rounded-lg px-3 py-2.5 text-white text-sm placeholder-indigo-600 focus:outline-none focus:border-yellow-400/60 min-h-[44px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddChild}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] min-h-[44px]"
                        style={{ background: SUNFLOWER, color: "#1a1000" }}
                      >
                        Add Profile
                      </button>
                      <button
                        onClick={() => { setAddingChild(false); setNewChildName(""); setNewChildAge(""); }}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-indigo-700/50 text-indigo-300 hover:bg-indigo-800/40 transition-all min-h-[44px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingChild(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-indigo-700/50 text-indigo-400 hover:text-white hover:border-indigo-500 text-sm font-semibold transition-all min-h-[48px] active:scale-[0.98]"
                  >
                    <Plus size={14} /> Add Child Profile
                  </button>
                )}
              </div>
            </SectionCard>

            {/* Notification Preferences */}
            <SectionCard icon={Bell} title="Notification Preferences" subtitle="Choose what emails you receive" iconBg="bg-yellow-700">
              <div className="mt-3">
                <NotificationToggle
                  label="Badge Earned"
                  description="Email when your child unlocks a new achievement badge"
                  checked={notifications?.badge_earned}
                  onChange={(v) => handleSaveNotifications({ ...notifications, badge_earned: v })}
                />
                <NotificationToggle
                  label="Game Mode Completed"
                  description="Email when your child finishes a game mode for the first time"
                  checked={notifications?.game_mode_completed}
                  onChange={(v) => handleSaveNotifications({ ...notifications, game_mode_completed: v })}
                />
                <NotificationToggle
                  label="Milestone Reached"
                  description="Email when your child hits a progression milestone"
                  checked={notifications?.milestone_reached}
                  onChange={(v) => handleSaveNotifications({ ...notifications, milestone_reached: v })}
                />
                <NotificationToggle
                  label="Weekly Progress Digest"
                  description="Weekly summary of your child's learning activity"
                  checked={notifications?.weekly_digest}
                  onChange={(v) => handleSaveNotifications({ ...notifications, weekly_digest: v })}
                />
                <NotificationToggle
                  label="Billing & Account Alerts"
                  description="Payment confirmations, renewal reminders, and account changes"
                  checked={notifications?.billing_alerts}
                  onChange={(v) => handleSaveNotifications({ ...notifications, billing_alerts: v })}
                />
              </div>
            </SectionCard>

            {/* Quick Links */}
            <div
              className="rounded-2xl border p-5 grid grid-cols-1 sm:grid-cols-3 gap-3"
              style={{ background: "rgba(30,27,75,0.5)", borderColor: "rgba(99,102,241,0.25)" }}
            >
              <Link
                to="/parent-billing"
                className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-indigo-800/30 transition-all group min-h-[52px]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${SUNFLOWER}18` }}>
                  <span className="text-base">💳</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold group-hover:text-yellow-300 transition-colors">Billing & Plans</p>
                  <p className="text-indigo-500 text-xs">Manage subscription</p>
                </div>
              </Link>
              <Link
                to="/parent-milestone-notifications"
                className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-indigo-800/30 transition-all group min-h-[52px]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${SUNFLOWER}18` }}>
                  <span className="text-base">🏆</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold group-hover:text-yellow-300 transition-colors">Milestones</p>
                  <p className="text-indigo-500 text-xs">View notifications</p>
                </div>
              </Link>
              <Link
                to="/parent-controls-dashboard"
                className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-indigo-800/30 transition-all group min-h-[52px]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${SUNFLOWER}18` }}>
                  <span className="text-base">🔒</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold group-hover:text-yellow-300 transition-colors">Parental Controls</p>
                  <p className="text-indigo-500 text-xs">Screen time & limits</p>
                </div>
              </Link>
            </div>

            {/* Danger Zone */}
            <div
              className="rounded-2xl border border-red-900/40 p-5"
              style={{ background: "rgba(30,10,10,0.5)" }}
            >
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">Danger Zone</p>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors min-h-[44px]"
                >
                  <Trash2 size={14} /> Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-300 text-xs leading-relaxed">
                      This will permanently delete your account and all associated data. This cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="flex-1 py-3 rounded-xl border border-indigo-700/50 text-indigo-300 hover:bg-indigo-800/40 text-sm font-bold transition-all min-h-[48px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="flex-1 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60"
                    >
                      {deleteLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
