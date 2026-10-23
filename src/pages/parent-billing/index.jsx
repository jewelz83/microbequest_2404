import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, XCircle, Loader2, Star, RefreshCw, AlertTriangle, ChevronLeft, Shield, Clock, ArrowRight, Check, BadgeCheck, Receipt, Settings, Bell } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const SUNFLOWER = "#F5C518";
const SUNFLOWER_DARK = "#D4A017";

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$1.99",
    period: "/month",
    subtext: "Cancel anytime",
    badge: null,
    features: [
      "Full access to all 5 eras",
      "All 6 game modules",
      "Save progress across sessions",
      "Mobile-friendly play",
    ],
    highlight: false,
  },
  {
    id: "annual",
    label: "Annual",
    price: "$14.99",
    period: "/year",
    subtext: "Save 37% vs monthly",
    badge: "Most Popular 🌻",
    features: [
      "Full access to all 5 eras",
      "All 6 game modules",
      "Save progress across sessions",
      "Mobile-friendly play",
      "Early access to new content",
      "2 months free",
    ],
    highlight: true,
  },
  {
    id: "classroom",
    label: "Classroom",
    price: "$79",
    period: "/year",
    subtext: "Up to 30 students",
    badge: null,
    features: [
      "Teacher dashboard",
      "Progress reports",
      "Full access to all eras and games",
      "30 student accounts",
    ],
    highlight: false,
  },
];

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

function PlanCard({ plan, onSelect, loading, currentPlanId }) {
  const isCurrentPlan = currentPlanId === plan?.id;
  const isLoading = loading === plan?.id;

  return (
    <div
      className={`relative rounded-2xl p-5 sm:p-6 flex flex-col border-2 transition-all duration-200 ${
        plan?.highlight
          ? "border-yellow-400/80 shadow-[0_0_32px_rgba(245,197,24,0.18)]"
          : "border-indigo-700/40 hover:border-indigo-500/60"
      }`}
      style={{
        background: plan?.highlight
          ? "linear-gradient(160deg, #312e81 0%, #4c1d95 100%)"
          : "rgba(30,27,75,0.7)",
      }}
    >
      {plan?.badge && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap"
          style={{ background: SUNFLOWER, color: "#1a1000" }}
        >
          {plan?.badge}
        </div>
      )}
      <div className="mt-1 mb-4">
        <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2">
          {plan?.label}
        </p>
        <div className="flex items-end gap-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-white">{plan?.price}</span>
          <span className="text-indigo-300 text-sm mb-1">{plan?.period}</span>
        </div>
        <p className="text-indigo-400 text-xs mt-1">{plan?.subtext}</p>
      </div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan?.features?.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-indigo-200">
            <Check size={14} className="shrink-0 mt-0.5" style={{ color: SUNFLOWER }} />
            {f}
          </li>
        ))}
      </ul>
      {isCurrentPlan ? (
        <div
          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 min-h-[52px]"
          style={{ background: `${SUNFLOWER}22`, color: SUNFLOWER }}
        >
          <BadgeCheck size={16} /> Current Plan
        </div>
      ) : (
        <button
          onClick={() => onSelect(plan?.id)}
          disabled={loading !== null}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px] active:scale-[0.98] ${
            plan?.highlight
              ? "hover:opacity-90 active:scale-95" :"border-2 border-indigo-500 text-indigo-200 hover:bg-indigo-800/50"
          }`}
          style={plan?.highlight ? { background: SUNFLOWER, color: "#1a1000" } : {}}
        >
          {isLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Redirecting…
            </>
          ) : (
            <>
              Select {plan?.label} <ArrowRight size={15} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function SubscriptionStatusCard({ subscription }) {
  if (!subscription) return null;

  const status = subscription?.subscription_status || "inactive";
  const cfg = STATUS_CONFIG?.[status] || STATUS_CONFIG?.inactive;
  const StatusIcon = cfg?.icon;

  const planLabel =
    subscription?.plan_type === "monthly" ?"Monthly Scientist"
      : subscription?.plan_type === "annual" ?"Annual Scientist"
      : subscription?.plan_type === "classroom" ?"Classroom License"
      : subscription?.plan_type;

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso)?.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="rounded-2xl border p-6 mb-8"
      style={{ background: "rgba(30,27,75,0.7)", borderColor: "rgba(99,102,241,0.3)" }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">
            Current Subscription
          </p>
          <h3 className="text-white font-bold text-xl">MicrobeQuest {planLabel}</h3>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${cfg?.bg} ${cfg?.color}`}
        >
          <StatusIcon size={14} />
          {cfg?.label}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-indigo-500 text-xs mb-1">Billing Amount</p>
          <p className="text-white font-semibold text-sm">
            ${subscription?.amount?.toFixed(2)}{" "}
            <span className="text-indigo-400 font-normal">
              {subscription?.plan_type === "monthly" ? "/mo" : "/yr"}
            </span>
          </p>
        </div>
        {subscription?.current_period_start && (
          <div>
            <p className="text-indigo-500 text-xs mb-1">Started</p>
            <p className="text-white font-semibold text-sm">
              {formatDate(subscription?.current_period_start)}
            </p>
          </div>
        )}
        {subscription?.current_period_end && (
          <div>
            <p className="text-indigo-500 text-xs mb-1">
              {status === "cancelled" ? "Access Until" : "Renews On"}
            </p>
            <p className="text-white font-semibold text-sm">
              {formatDate(subscription?.current_period_end)}
            </p>
          </div>
        )}
      </div>
      {status === "past_due" && (
        <div className="mt-4 flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
          <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-300 text-xs leading-relaxed">
            Your last payment failed. Please update your payment method to keep access.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ParentBillingPage() {
  const { user, subscription: ctxSubscription, subscriptionLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [confirmingSession, setConfirmingSession] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);

  // Load the most recent subscription (active or otherwise) for display
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.id) {
        setSubLoading(false);
        return;
      }
      setSubLoading(true);
      try {
        const { data } = await supabase?.from("subscriptions")?.select("*")?.eq("user_id", user?.id)?.order("created_at", { ascending: false })?.limit(1)?.maybeSingle();
        setActiveSubscription(data || null);
      } catch (err) {
        console.error("Subscription fetch error:", err);
      } finally {
        setSubLoading(false);
      }
    };
    fetchSubscription();
  }, [user?.id, paymentResult]);

  // Handle return from Stripe Checkout
  useEffect(() => {
    const success = searchParams?.get("success");
    const cancelled = searchParams?.get("cancelled");
    const sessionId = searchParams?.get("session_id");

    if (success === "true" && sessionId) {
      setConfirmingSession(true);
      const confirmPayment = async () => {
        try {
          const { data, error } = await supabase?.functions?.invoke(
            "confirm-subscription",
            { body: { sessionId, userId: user?.id || null } }
          );
          if (error) throw error;
          setPaymentResult({ success: data?.success, planType: data?.planType });
        } catch (err) {
          console.error("Confirmation error:", err);
          setPaymentResult({ success: true, planType: null });
        } finally {
          setConfirmingSession(false);
        }
      };
      confirmPayment();
    } else if (cancelled === "true") {
      setPaymentResult({ cancelled: true });
    }
  }, [searchParams, user]);

  const handleCheckout = async (planType) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoadingPlan(planType);
    setCheckoutError(null);
    try {
      const { data, error } = await supabase?.functions?.invoke(
        "create-checkout-session",
        {
          body: {
            planType,
            userId: user?.id || null,
            userEmail: user?.email || null,
            couponCode: couponCode?.trim() || null,
            successUrl: `${window.location?.origin}/parent-billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location?.origin}/parent-billing?cancelled=true`,
          },
        }
      );
      if (error) throw error;
      if (data?.url) {
        window.location.href = data?.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError("Unable to start checkout. Please try again.");
      setLoadingPlan(null);
    }
  };

  const currentPlanId =
    activeSubscription?.subscription_status === "active"
      ? activeSubscription?.plan_type
      : null;

  const isLoading = subLoading || subscriptionLoading;

  return (
    <div
      className="min-h-screen pb-20 lg:pb-0"
      style={{ background: "#0f0c29", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      {/* ── TOAST BANNERS ── */}
      {confirmingSession && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-3.5 px-5 text-sm font-semibold"
          style={{ background: "#312e81", color: "white" }}
        >
          <Loader2 size={15} className="animate-spin" /> Confirming your subscription…
        </div>
      )}
      {paymentResult?.success && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-3.5 px-5 text-sm font-semibold"
          style={{ background: "#166534", color: "white" }}
        >
          <CheckCircle size={15} /> 🎉 Subscription activated! Welcome to MicrobeQuest Premium.
          <button onClick={() => setPaymentResult(null)} className="ml-4 underline opacity-80 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}
      {paymentResult?.cancelled && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-3.5 px-5 text-sm font-semibold"
          style={{ background: "#7c2d12", color: "white" }}
        >
          <XCircle size={15} /> Checkout cancelled. No charge was made.
          <button onClick={() => setPaymentResult(null)} className="ml-4 underline opacity-80 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b border-indigo-900/50"
        style={{ background: "rgba(15,12,41,0.92)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              to="/parent-controls-dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-white transition-colors min-h-[44px] shrink-0"
            >
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Parent Dashboard</span><span className="sm:hidden">Back</span>
            </Link>
            <span className="text-indigo-700 hidden sm:inline">·</span>
            <span className="text-white font-semibold text-sm hidden sm:inline truncate">Billing & Subscription</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs shrink-0">
            <Shield size={13} />
            <span className="hidden sm:inline">Secured by Stripe</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-10">

        {/* ── PAGE TITLE ── */}
        <div className="mb-6 sm:mb-8">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border"
            style={{ color: SUNFLOWER, borderColor: `${SUNFLOWER}40`, background: `${SUNFLOWER}12` }}
          >
            <CreditCard size={11} /> Billing & Plans
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
            Manage Your Subscription
          </h1>
          <p className="text-indigo-300 text-sm sm:text-base">
            Choose a plan that works for your family or classroom.
          </p>
        </div>

        {/* ── NOT LOGGED IN ── */}
        {!user && (
          <div
            className="rounded-2xl border border-indigo-700/40 p-6 sm:p-8 text-center mb-8"
            style={{ background: "rgba(30,27,75,0.7)" }}
          >
            <CreditCard size={36} className="mx-auto mb-4 text-indigo-400" />
            <h3 className="text-white font-bold text-lg mb-2">Sign in to manage billing</h3>
            <p className="text-indigo-400 text-sm mb-5">
              You need an account to subscribe and track your billing history.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 min-h-[52px] active:scale-[0.98]"
              style={{ background: SUNFLOWER, color: "#1a1000" }}
            >
              Sign In <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* ── SUBSCRIPTION STATUS ── */}
        {user && (
          <>
            {isLoading ? (
              <div
                className="rounded-2xl border border-indigo-700/40 p-6 mb-8 flex items-center gap-3"
                style={{ background: "rgba(30,27,75,0.7)" }}
              >
                <Loader2 size={18} className="animate-spin text-indigo-400" />
                <span className="text-indigo-300 text-sm">Loading subscription details…</span>
              </div>
            ) : activeSubscription ? (
              <>
                <SubscriptionStatusCard subscription={activeSubscription} />
                <div className="flex justify-end -mt-4 mb-6">
                  <Link
                    to="/subscription-management"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: SUNFLOWER }}
                  >
                    Manage subscription <ArrowRight size={12} />
                  </Link>
                </div>
              </>
            ) : (
              <div
                className="rounded-2xl border border-indigo-700/40 p-5 sm:p-6 mb-8 flex items-center gap-4"
                style={{ background: "rgba(30,27,75,0.7)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${SUNFLOWER}18` }}
                >
                  <Star size={18} style={{ color: SUNFLOWER }} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">No active subscription</p>
                  <p className="text-indigo-400 text-xs mt-0.5">
                    Choose a plan below to unlock the full MicrobeQuest experience.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── CHECKOUT ERROR ── */}
        {checkoutError && (
          <div
            className="flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl text-sm font-medium mb-6"
            style={{ background: "rgba(127,29,29,0.5)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <XCircle size={15} />
            {checkoutError}
            <button onClick={() => setCheckoutError(null)} className="ml-auto underline opacity-80 hover:opacity-100">
              Dismiss
            </button>
          </div>
        )}

        {/* ── PLAN SELECTION ── */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-white font-bold text-lg mb-1">
            {currentPlanId ? "Change Plan" : "Choose a Plan"}
          </h2>
          <p className="text-indigo-400 text-sm mb-5 sm:mb-6">
            All plans include full access to every era, game mode, and discovery.
          </p>

          {/* ── COUPON CODE ── */}
          <div
            className="rounded-2xl border border-indigo-700/40 p-4 sm:p-5 mb-5 sm:mb-6"
            style={{ background: "rgba(30,27,75,0.5)" }}
          >
            <label className="block text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2">
              Coupon / Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e?.target?.value?.toUpperCase());
                  setCouponApplied(false);
                }}
                placeholder="Enter code (e.g. BETAQUEST)"
                className="flex-1 bg-indigo-950/60 border border-indigo-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder-indigo-600 focus:outline-none focus:border-yellow-400/60 transition-colors min-h-[48px]"
              />
              <button
                type="button"
                onClick={() => { if (couponCode?.trim()) setCouponApplied(true); }}
                className="px-4 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 whitespace-nowrap min-h-[48px] min-w-[80px]"
                style={{ background: SUNFLOWER, color: "#1a1000" }}
              >
                Apply
              </button>
            </div>
            {couponApplied && couponCode?.trim() && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 mt-3">
                <CheckCircle size={14} /> Code applied — discount will show at checkout
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {PLANS?.map((plan) => (
              <PlanCard
                key={plan?.id}
                plan={plan}
                onSelect={handleCheckout}
                loading={loadingPlan}
                currentPlanId={currentPlanId}
              />
            ))}
          </div>
        </div>

        {/* ── BILLING INFO STRIP ── */}
        <div
          className="rounded-2xl border border-indigo-700/30 p-4 sm:p-5 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ background: "rgba(30,27,75,0.5)" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${SUNFLOWER}18` }}>
              <RefreshCw size={15} style={{ color: SUNFLOWER }} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Cancel Anytime</p>
              <p className="text-indigo-400 text-xs mt-0.5">No lock-in. Cancel from your Stripe billing portal.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${SUNFLOWER}18` }}>
              <Shield size={15} style={{ color: SUNFLOWER }} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Secure Payments</p>
              <p className="text-indigo-400 text-xs mt-0.5">Processed by Stripe. We never store card details.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${SUNFLOWER}18` }}>
              <Receipt size={15} style={{ color: SUNFLOWER }} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Receipts via Email</p>
              <p className="text-indigo-400 text-xs mt-0.5">Stripe sends receipts to your account email automatically.</p>
            </div>
          </div>
        </div>

        {/* ── SUNFLOWER ACCESS ── */}
        <div
          className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 border"
          style={{ background: `${SUNFLOWER}12`, borderColor: `${SUNFLOWER}30` }}
        >
          <div className="text-4xl shrink-0">🌻</div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white font-bold text-base mb-1">Sunflower Access Program</p>
            <p className="text-indigo-300 text-sm leading-relaxed">
              Free access for verified nonprofits, Title I schools, and community learning centers.
            </p>
          </div>
          <a
            href="mailto:sunflower@chasestreetpress.co"
            className="w-full sm:w-auto shrink-0 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 whitespace-nowrap text-center min-h-[48px] flex items-center justify-center active:scale-[0.98]"
            style={{ background: SUNFLOWER, color: "#1a1000" }}
          >
            Apply for Free Access
          </a>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-500">
          <span>© Chase Street Press 2026</span>
          <div className="flex gap-4">
            <Link to="/parent-account-settings" className="hover:text-indigo-300 transition-colors min-h-[44px] flex items-center gap-1"><Settings size={11} /> Account</Link>
            <Link to="/parent-milestone-notifications" className="hover:text-indigo-300 transition-colors min-h-[44px] flex items-center gap-1"><Bell size={11} /> Milestones</Link>
            <Link to="/terms" className="hover:text-indigo-300 transition-colors min-h-[44px] flex items-center">Terms</Link>
            <Link to="/privacy" className="hover:text-indigo-300 transition-colors min-h-[44px] flex items-center">Privacy</Link>
            <Link to="/refunds" className="hover:text-indigo-300 transition-colors min-h-[44px] flex items-center">Refund Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
