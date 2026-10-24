import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  Shield,
  AlertTriangle,
  BadgeCheck,
  Clock,
  RefreshCw,
  Receipt,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const SUNFLOWER = "#F5C518";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: BadgeCheck,
  },
  inactive: {
    label: "Inactive",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/30",
    icon: Clock,
  },
  past_due: {
    label: "Past Due",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: AlertTriangle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    icon: XCircle,
  },
};

const MOCK_BILLING_HISTORY = [
  { id: "inv_001", date: "2026-07-01", amount: 1.99, status: "paid", description: "Monthly Scientist Plan" },
  { id: "inv_002", date: "2026-06-01", amount: 1.99, status: "paid", description: "Monthly Scientist Plan" },
  { id: "inv_003", date: "2026-05-01", amount: 1.99, status: "paid", description: "Monthly Scientist Plan" },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso)?.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(iso) {
  if (!iso) return "—";
  return new Date(iso)?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PlanLabel(planType) {
  if (planType === "monthly") return "Monthly Scientist";
  if (planType === "annual") return "Annual Scientist";
  if (planType === "classroom") return "Classroom License";
  return planType || "Unknown Plan";
}

// ── Cancel Confirmation Modal ──────────────────────────────────────────────────
function CancelModal({ onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border border-red-500/30 p-6 sm:p-8 shadow-2xl"
        style={{ background: "linear-gradient(160deg, #1a0a0a 0%, #1e1b4b 100%)" }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center shrink-0">
            <Trash2 size={22} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Cancel Subscription?</h3>
            <p className="text-red-300 text-xs mt-0.5">This action cannot be undone</p>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <ul className="space-y-2">
            {[
              "Your child will lose access to all premium game modes",
              "Progress and achievements will be saved",
              "You can resubscribe at any time",
              "Access continues until the end of your billing period",
            ]?.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-red-200">
                <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm border border-indigo-700/50 text-indigo-300 hover:bg-indigo-800/40 transition-all min-h-[52px] active:scale-[0.98]"
          >
            Keep Subscription
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-500 text-white transition-all flex items-center justify-center gap-2 min-h-[52px] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /> Cancelling…</>
            ) : (
              <><Trash2 size={15} /> Yes, Cancel</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Billing History Row ────────────────────────────────────────────────────────
function BillingRow({ invoice }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-indigo-900/40 last:border-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${SUNFLOWER}18` }}
        >
          <Receipt size={15} style={{ color: SUNFLOWER }} />
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{invoice?.description}</p>
          <p className="text-indigo-400 text-xs mt-0.5">{formatShortDate(invoice?.date)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-white font-bold text-sm">${invoice?.amount?.toFixed(2)}</span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            invoice?.status === "paid" ?"bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" :"bg-red-500/15 text-red-400 border border-red-500/25"
          }`}
        >
          {invoice?.status === "paid" ? "Paid" : "Failed"}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SubscriptionManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [billingHistory] = useState(MOCK_BILLING_HISTORY);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetchSub = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          ?.from("subscriptions")
          ?.select("*")
          ?.eq("user_id", user?.id)
          ?.order("created_at", { ascending: false })
          ?.limit(1)
          ?.maybeSingle();
        setSubscription(data || null);
      } catch (err) {
        console.error("Subscription fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, [user?.id]);

  const handleOpenPortal = async () => {
    if (!user) { navigate("/login"); return; }
    setPortalLoading(true);
    try {
      const { data, error } = await supabase?.functions?.invoke("create-checkout-session", {
        body: {
          action: "portal",
          userId: user?.id,
          returnUrl: `${window.location?.origin}/subscription-management`,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data?.url;
      } else {
        showToast("Unable to open billing portal. Please try again.", "error");
      }
    } catch {
      showToast("Unable to open billing portal. Please try again.", "error");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const { error } = await supabase
        ?.from("subscriptions")
        ?.update({ subscription_status: "cancelled" })
        ?.eq("user_id", user?.id);
      if (error) throw error;
      setSubscription((prev) => ({ ...prev, subscription_status: "cancelled" }));
      setShowCancelModal(false);
      showToast("Subscription cancelled. Access continues until your billing period ends.", "success");
    } catch {
      showToast("Unable to cancel. Please try again or contact support.", "error");
      setCancelLoading(false);
    } finally {
      setCancelLoading(false);
    }
  };

  const status = subscription?.subscription_status || "inactive";
  const cfg = STATUS_CONFIG?.[status] || STATUS_CONFIG?.inactive;
  const StatusIcon = cfg?.icon;
  const isActive = status === "active" || status === "past_due";

  return (
    <div
      className="min-h-screen pb-24 lg:pb-10"
      style={{ background: "#0f0c29", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-3.5 px-5 text-sm font-semibold transition-all`}
          style={{
            background: toast?.type === "success" ? "#166534" : "#7c2d12",
            color: "white",
          }}
        >
          {toast?.type === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {toast?.msg}
          <button onClick={() => setToast(null)} className="ml-4 underline opacity-80 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b border-indigo-900/50"
        style={{ background: "rgba(15,12,41,0.92)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              to="/parent-billing"
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-white transition-colors min-h-[44px] shrink-0"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Billing & Plans</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <span className="text-indigo-700 hidden sm:inline">·</span>
            <span className="text-white font-semibold text-sm hidden sm:inline truncate">
              Subscription Management
            </span>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs shrink-0">
            <Shield size={13} />
            <span className="hidden sm:inline">Secured by Stripe</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-5 py-8 sm:py-10 space-y-6">

        {/* ── PAGE TITLE ── */}
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border"
            style={{ color: SUNFLOWER, borderColor: `${SUNFLOWER}40`, background: `${SUNFLOWER}12` }}
          >
            <CreditCard size={11} /> Subscription Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Manage Your Plan
          </h1>
          <p className="text-indigo-300 text-sm sm:text-base">
            Update payment, view history, or cancel your subscription.
          </p>
        </div>

        {/* ── NOT LOGGED IN ── */}
        {!user && (
          <div
            className="rounded-2xl border border-indigo-700/40 p-6 sm:p-8 text-center"
            style={{ background: "rgba(30,27,75,0.7)" }}
          >
            <CreditCard size={36} className="mx-auto mb-4 text-indigo-400" />
            <h3 className="text-white font-bold text-lg mb-2">Sign in to manage your subscription</h3>
            <p className="text-indigo-400 text-sm mb-5">
              You need an account to view and manage billing.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 min-h-[52px] active:scale-[0.98]"
              style={{ background: SUNFLOWER, color: "#1a1000" }}
            >
              Sign In <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {user && (
          <>
            {/* ── CURRENT PLAN CARD ── */}
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{ background: "rgba(30,27,75,0.7)", borderColor: "rgba(99,102,241,0.3)" }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                <div>
                  <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">
                    Current Plan
                  </p>
                  {loading ? (
                    <div className="h-7 w-48 bg-indigo-800/50 rounded-lg animate-pulse" />
                  ) : subscription ? (
                    <h3 className="text-white font-bold text-xl">
                      MicrobeQuest {PlanLabel(subscription?.plan_type)}
                    </h3>
                  ) : (
                    <h3 className="text-indigo-300 font-semibold text-lg">No active plan</h3>
                  )}
                </div>
                {loading ? (
                  <div className="h-8 w-24 bg-indigo-800/50 rounded-full animate-pulse" />
                ) : subscription ? (
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${cfg?.bg} ${cfg?.color}`}
                  >
                    <StatusIcon size={14} />
                    {cfg?.label}
                  </div>
                ) : null}
              </div>

              {!loading && subscription && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                  <div className="bg-indigo-950/50 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-indigo-500 text-xs mb-1.5">
                      <DollarSign size={11} /> Billing Amount
                    </div>
                    <p className="text-white font-bold text-base">
                      ${subscription?.amount?.toFixed(2)}
                      <span className="text-indigo-400 font-normal text-xs ml-1">
                        {subscription?.plan_type === "monthly" ? "/mo" : "/yr"}
                      </span>
                    </p>
                  </div>
                  {subscription?.current_period_start && (
                    <div className="bg-indigo-950/50 rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 text-indigo-500 text-xs mb-1.5">
                        <Calendar size={11} /> Started
                      </div>
                      <p className="text-white font-semibold text-sm">
                        {formatDate(subscription?.current_period_start)}
                      </p>
                    </div>
                  )}
                  {subscription?.current_period_end && (
                    <div className="bg-indigo-950/50 rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 text-indigo-500 text-xs mb-1.5">
                        <RefreshCw size={11} />
                        {status === "cancelled" ? "Access Until" : "Renews On"}
                      </div>
                      <p className="text-white font-semibold text-sm">
                        {formatDate(subscription?.current_period_end)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!loading && status === "past_due" && (
                <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
                  <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-amber-300 text-xs leading-relaxed">
                    Your last payment failed. Update your payment method to restore full access.
                  </p>
                </div>
              )}

              {!loading && !subscription && (
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-indigo-400 text-sm">
                    You don't have an active subscription.
                  </p>
                  <Link
                    to="/parent-billing"
                    className="text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-1"
                    style={{ color: SUNFLOWER }}
                  >
                    View Plans <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>

            {/* ── ACTIONS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Update Payment Method */}
              <button
                onClick={handleOpenPortal}
                disabled={portalLoading}
                className="flex items-center gap-4 p-5 rounded-2xl border border-indigo-700/40 hover:border-indigo-500/60 transition-all group text-left disabled:opacity-60 active:scale-[0.98]"
                style={{ background: "rgba(30,27,75,0.7)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                  style={{ background: `${SUNFLOWER}18` }}
                >
                  {portalLoading ? (
                    <Loader2 size={20} className="animate-spin" style={{ color: SUNFLOWER }} />
                  ) : (
                    <CreditCard size={20} style={{ color: SUNFLOWER }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm mb-0.5">Update Payment Method</p>
                  <p className="text-indigo-400 text-xs leading-relaxed">
                    Change your card or billing details via Stripe
                  </p>
                </div>
                <ExternalLink size={15} className="text-indigo-500 shrink-0" />
              </button>

              {/* Change Plan */}
              <Link
                to="/parent-billing"
                className="flex items-center gap-4 p-5 rounded-2xl border border-indigo-700/40 hover:border-indigo-500/60 transition-all group active:scale-[0.98]"
                style={{ background: "rgba(30,27,75,0.7)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                  style={{ background: "rgba(99,102,241,0.15)" }}
                >
                  <RefreshCw size={20} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm mb-0.5">Change Plan</p>
                  <p className="text-indigo-400 text-xs leading-relaxed">
                    Upgrade, downgrade, or switch billing cycle
                  </p>
                </div>
                <ArrowRight size={15} className="text-indigo-500 shrink-0" />
              </Link>
            </div>

            {/* ── BILLING HISTORY ── */}
            <div
              className="rounded-2xl border border-indigo-700/40 overflow-hidden"
              style={{ background: "rgba(30,27,75,0.7)" }}
            >
              <button
                onClick={() => setHistoryExpanded(!historyExpanded)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-indigo-800/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${SUNFLOWER}18` }}
                  >
                    <Receipt size={15} style={{ color: SUNFLOWER }} />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Billing History</p>
                    <p className="text-indigo-400 text-xs">Past invoices and payments</p>
                  </div>
                </div>
                {historyExpanded ? (
                  <ChevronUp size={16} className="text-indigo-400" />
                ) : (
                  <ChevronDown size={16} className="text-indigo-400" />
                )}
              </button>

              {historyExpanded && (
                <div className="px-5 sm:px-6 pb-5 border-t border-indigo-900/40">
                  {loading ? (
                    <div className="space-y-3 pt-4">
                      {[1, 2, 3]?.map((i) => (
                        <div key={i} className="h-14 bg-indigo-800/30 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : billingHistory?.length > 0 ? (
                    <div className="pt-2">
                      {billingHistory?.map((inv) => (
                        <BillingRow key={inv?.id} invoice={inv} />
                      ))}
                      <p className="text-indigo-500 text-xs mt-4 text-center">
                        Full invoice history available in your{" "}
                        <button
                          onClick={handleOpenPortal}
                          className="underline hover:text-indigo-300 transition-colors"
                        >
                          Stripe billing portal
                        </button>
                      </p>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Receipt size={28} className="mx-auto mb-3 text-indigo-600" />
                      <p className="text-indigo-400 text-sm">No billing history yet</p>
                      <p className="text-indigo-600 text-xs mt-1">
                        Invoices will appear here after your first payment
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── CANCEL SUBSCRIPTION ── */}
            {isActive && (
              <div
                className="rounded-2xl border border-red-500/20 p-5 sm:p-6"
                style={{ background: "rgba(30,10,10,0.5)" }}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm mb-1">Cancel Subscription</h3>
                    <p className="text-red-300/70 text-xs leading-relaxed">
                      You'll keep access until the end of your current billing period. Your child's
                      progress and achievements will be saved.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all min-h-[44px] active:scale-[0.98]"
                  >
                    <Trash2 size={14} /> Cancel Plan
                  </button>
                </div>
              </div>
            )}

            {/* ── ALREADY CANCELLED ── */}
            {status === "cancelled" && (
              <div
                className="rounded-2xl border border-indigo-700/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
                style={{ background: "rgba(30,27,75,0.5)" }}
              >
                <div className="text-3xl shrink-0">🌻</div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm mb-1">Subscription Cancelled</p>
                  <p className="text-indigo-300 text-xs leading-relaxed">
                    We're sorry to see you go. You can resubscribe anytime to restore full access.
                  </p>
                </div>
                <Link
                  to="/parent-billing"
                  className="shrink-0 px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all min-h-[48px] flex items-center gap-2 active:scale-[0.98]"
                  style={{ background: SUNFLOWER, color: "#1a1000" }}
                >
                  Resubscribe <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* ── SUPPORT STRIP ── */}
            <div
              className="rounded-2xl border border-indigo-700/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left"
              style={{ background: "rgba(30,27,75,0.4)" }}
            >
              <Shield size={22} className="text-indigo-400 shrink-0" />
              <p className="text-indigo-300 text-xs leading-relaxed flex-1">
                Need help with billing? Email us at{" "}
                <a
                  href="mailto:support@chasestreetpress.co"
                  className="underline hover:text-white transition-colors"
                >
                  support@chasestreetpress.co
                </a>{" "}
                or visit your{" "}
                <button
                  onClick={handleOpenPortal}
                  className="underline hover:text-white transition-colors"
                >
                  Stripe billing portal
                </button>{" "}
                for full invoice management.
              </p>
            </div>

            {/* ── FOOTER ── */}
            <div className="pt-2 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-500">
              <span>© Chase Street Press 2026</span>
              <div className="flex gap-4">
                <Link to="/terms" className="hover:text-indigo-300 transition-colors min-h-[44px] flex items-center">Terms</Link>
                <Link to="/privacy" className="hover:text-indigo-300 transition-colors min-h-[44px] flex items-center">Privacy</Link>
                <Link to="/refunds" className="hover:text-indigo-300 transition-colors min-h-[44px] flex items-center">Refund Policy</Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── CANCEL MODAL ── */}
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancelSubscription}
          onClose={() => setShowCancelModal(false)}
          loading={cancelLoading}
        />
      )}
    </div>
  );
}
