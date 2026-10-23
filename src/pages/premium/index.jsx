import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, ChevronDown, ChevronUp, Microscope, Clock, Gamepad2, Smartphone, BookOpen, Sparkles, Star, Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const SUNFLOWER = "#F5C518";
const SUNFLOWER_DARK = "#D4A017";

const faqs = [
  {
    q: "What\'s included in the free Explorer tier?",
    a: "The free Explorer tier gives you full access to the Discovery Era — the foundational era covering the earliest microbiology breakthroughs. You can explore all 4 discoveries in that era, play the associated mini-games, and meet Aunt Juju and Charlie the Zebra. It's a complete experience for one era, no credit card required.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, absolutely. Monthly and annual plans can be cancelled at any time from your account settings. If you cancel a monthly plan, you keep access until the end of your billing period. Annual plans are non-refundable after 14 days but you retain access through the end of your subscription year.",
  },
  {
    q: "How does the classroom license work?",
    a: "The Classroom License covers up to 30 student accounts under one teacher account. You get a teacher dashboard to monitor individual progress, assign specific eras or game modules, and download progress reports. Students log in with their own accounts linked to your classroom code. Perfect for science classes, after-school programs, and homeschool co-ops.",
  },
  {
    q: "What is the Sunflower Access Program?",
    a: "The Sunflower Access Program provides completely free access to MicrobeQuest for verified nonprofits, Title I schools, and community learning centers. We believe every child deserves quality STEM education regardless of economic circumstances. Applications are reviewed within 5 business days. Named after the sunflower — the symbol of Chase Street Press and the state flower of Kansas.",
  },
  {
    q: "Will there be more content added?",
    a: "Yes! We're actively developing new eras, discoveries, and game modules. Premium subscribers get early access to new content before it's released to the general public. We release new content quarterly, and annual subscribers get a bonus: first look at everything new before anyone else.",
  },
];

const included = [
  { icon: <Clock size={20} />, label: "All 5 eras", detail: "350+ years of microbiology history" },
  { icon: <Microscope size={20} />, label: "All 18 timeline discoveries", detail: "From van Leeuwenhoek to CRISPR" },
  { icon: <Gamepad2 size={20} />, label: "All 6 game modules", detail: "Matching, Detective, Tower Defense & more" },
  { icon: <Smartphone size={20} />, label: "Mobile friendly", detail: "Plays great on phones and tablets" },
  { icon: <BookOpen size={20} />, label: "Save progress across sessions", detail: "Pick up right where you left off" },
  { icon: <Sparkles size={20} />, label: "New content added regularly", detail: "Early access for premium subscribers" },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-indigo-800/40 rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: open ? "rgba(79,70,229,0.08)" : "rgba(30,27,75,0.5)" }}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-white font-semibold text-base leading-snug">{q}</span>
        <span className="shrink-0 text-indigo-300">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-indigo-200 text-sm leading-relaxed border-t border-indigo-800/30 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function PremiumPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [confirmingSession, setConfirmingSession] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // Handle return from Stripe Checkout
  useEffect(() => {
    const success = searchParams?.get("success");
    const cancelled = searchParams?.get("cancelled");
    const sessionId = searchParams?.get("session_id");

    if (success === "true" && sessionId) {
      setConfirmingSession(true);
      const confirmPayment = async () => {
        try {
          const { data, error } = await supabase?.functions?.invoke("confirm-subscription", {
            body: { sessionId, userId: user?.id || null },
          });
          if (error) throw error;
          setPaymentResult({ success: data?.success, planType: data?.planType });
        } catch (err) {
          console.error("Confirmation error:", err);
          setPaymentResult({ success: true, planType: null }); // Stripe already charged, show success
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
    setLoadingPlan(planType);
    setCheckoutError(null);
    try {
      const { data, error } = await supabase?.functions?.invoke("create-checkout-session", {
        body: {
          planType,
          userId: user?.id || null,
          userEmail: user?.email || null,
          successUrl: `${window.location?.origin}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location?.origin}/premium?cancelled=true`,
        },
      });
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

  // Payment result banner
  const PaymentBanner = () => {
    if (confirmingSession) {
      return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-4 px-5 text-sm font-semibold" style={{ background: "#312e81", color: "white" }}>
          <Loader2 size={16} className="animate-spin" /> Confirming your subscription…
        </div>
      );
    }
    if (paymentResult?.success) {
      const planLabel = paymentResult?.planType === "monthly" ? "Monthly" : paymentResult?.planType === "annual" ? "Annual" : paymentResult?.planType === "classroom" ? "Classroom" : "Premium";
      return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-4 px-5 text-sm font-semibold" style={{ background: "#166534", color: "white" }}>
          <CheckCircle size={16} /> 🎉 Welcome to MicrobeQuest {planLabel}! Your subscription is active.
          <button onClick={() => setPaymentResult(null)} className="ml-4 underline opacity-80 hover:opacity-100">Dismiss</button>
        </div>
      );
    }
    if (paymentResult?.cancelled) {
      return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-4 px-5 text-sm font-semibold" style={{ background: "#7c2d12", color: "white" }}>
          <XCircle size={16} /> Checkout was cancelled. No charge was made.
          <button onClick={() => setPaymentResult(null)} className="ml-4 underline opacity-80 hover:opacity-100">Dismiss</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen" style={{ background: "#0f0c29", fontFamily: "'DM Sans', sans-serif" }}>
      <PaymentBanner />
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-indigo-900/50" style={{ background: "rgba(15,12,41,0.92)" }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight" style={{ color: SUNFLOWER }}>
            Chase Street Press
          </span>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-white transition-colors px-4 py-2 rounded-xl border border-indigo-700/50 hover:border-indigo-500"
          >
            ← Back to MicrobeQuest
          </Link>
        </div>
      </header>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-24 px-5">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)",
          }}
        />
        <div className="absolute inset-0 -z-10 opacity-5 select-none pointer-events-none overflow-hidden">
          {Array.from({ length: 40 })?.map((_, i) => (
            <span
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 17.3) % 100}%`,
                transform: `rotate(${(i * 23) % 360}deg)`,
              }}
            >
              🔬
            </span>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8 border"
            style={{ color: SUNFLOWER, borderColor: `${SUNFLOWER}40`, background: `${SUNFLOWER}12` }}
          >
            <Star size={12} fill={SUNFLOWER} /> MicrobeQuest Premium
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Unlock the Full{" "}
            <span
              className="relative inline-block"
              style={{
                background: `linear-gradient(90deg, ${SUNFLOWER}, #fbbf24, ${SUNFLOWER})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MicrobeQuest
            </span>{" "}
            Adventure
          </h1>
          <p className="text-indigo-200 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Journey through 350+ years of microbiology discoveries with Aunt Juju and Charlie the Zebra
          </p>
        </div>
      </section>

      {/* ── CHECKOUT ERROR ── */}
      {checkoutError && (
        <div className="max-w-5xl mx-auto px-5 -mt-4 mb-4">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium" style={{ background: "rgba(127,29,29,0.6)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}>
            <XCircle size={16} />
            {checkoutError}
            <button onClick={() => setCheckoutError(null)} className="ml-auto underline opacity-80 hover:opacity-100">Dismiss</button>
          </div>
        </div>
      )}

      {/* ── PRICING CARDS ── */}
      <section className="px-5 pb-24 -mt-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Monthly */}
          <div className="rounded-3xl p-7 flex flex-col border border-indigo-700/40" style={{ background: "rgba(30,27,75,0.7)" }}>
            <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-3">Monthly</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-extrabold text-white">$1.99</span>
              <span className="text-indigo-300 mb-2">/month</span>
            </div>
            <p className="text-indigo-400 text-sm mb-6">Cancel anytime</p>
            <ul className="space-y-3 mb-8 flex-1">
              {["Full access to all eras and games"]?.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-indigo-200">
                  <Check size={16} className="shrink-0 mt-0.5" style={{ color: SUNFLOWER }} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("monthly")}
              disabled={loadingPlan !== null}
              className="w-full py-3.5 rounded-2xl font-bold text-sm border-2 border-indigo-500 text-indigo-200 hover:bg-indigo-800/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingPlan === "monthly" ? <><Loader2 size={16} className="animate-spin" /> Redirecting…</> : "Start Monthly Plan"}
            </button>
          </div>

          {/* Annual — highlighted */}
          <div
            className="rounded-3xl p-7 flex flex-col relative border-2 shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #312e81 0%, #4c1d95 100%)",
              borderColor: SUNFLOWER,
              boxShadow: `0 0 40px ${SUNFLOWER}30`,
            }}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
              style={{ background: SUNFLOWER, color: "#1a1000" }}
            >
              Most Popular 🌻
            </div>
            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3 mt-2">Annual</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-extrabold text-white">$14.99</span>
              <span className="text-indigo-300 mb-2">/year</span>
            </div>
            <div className="flex gap-2 mb-6 flex-wrap">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${SUNFLOWER}22`, color: SUNFLOWER }}
              >
                Save 37% vs monthly
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-700/60 text-indigo-200">
                2 months free
              </span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Full access to all eras and games",
                "Early access to new content",
              ]?.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-indigo-100">
                  <Check size={16} className="shrink-0 mt-0.5" style={{ color: SUNFLOWER }} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("annual")}
              disabled={loadingPlan !== null}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: SUNFLOWER, color: "#1a1000" }}
            >
              {loadingPlan === "annual" ? <><Loader2 size={16} className="animate-spin" /> Redirecting…</> : "Start Annual Plan"}
            </button>
          </div>

          {/* Classroom */}
          <div className="rounded-3xl p-7 flex flex-col border border-indigo-700/40" style={{ background: "rgba(30,27,75,0.7)" }}>
            <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-3">Classroom</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-extrabold text-white">$79</span>
              <span className="text-indigo-300 mb-2">/year</span>
            </div>
            <p className="text-indigo-400 text-sm mb-6">Up to 30 students</p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Teacher dashboard",
                "Progress reports",
                "Full access to all eras and games",
              ]?.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-indigo-200">
                  <Check size={16} className="shrink-0 mt-0.5" style={{ color: SUNFLOWER }} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("classroom")}
              disabled={loadingPlan !== null}
              className="w-full py-3.5 rounded-2xl font-bold text-sm border-2 border-indigo-500 text-indigo-200 hover:bg-indigo-800/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingPlan === "classroom" ? <><Loader2 size={16} className="animate-spin" /> Redirecting…</> : "Get Classroom License"}
            </button>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="px-5 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Everything in Premium</h2>
            <p className="text-indigo-300 text-base">One subscription, the complete MicrobeQuest universe</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {included?.map((item, i) => (
              <div
                key={item?.label}
                className={`rounded-2xl p-5 border border-indigo-800/40 flex flex-col gap-3 ${i === 0 ? "md:col-span-2" : ""}`}
                style={{ background: "rgba(30,27,75,0.6)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${SUNFLOWER}18`, color: SUNFLOWER }}
                >
                  {item?.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{item?.label}</p>
                  <p className="text-indigo-400 text-xs mt-0.5">{item?.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUNFLOWER ACCESS PROGRAM ── */}
      <section className="px-5 pb-24">
        <div className="max-w-3xl mx-auto rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden" style={{ background: SUNFLOWER }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
            {Array.from({ length: 20 })?.map((_, i) => (
              <span
                key={i}
                className="absolute text-5xl"
                style={{ left: `${(i * 19) % 100}%`, top: `${(i * 23) % 100}%` }}
              >
                🌻
              </span>
            ))}
          </div>
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 mb-4">
              The Sunflower Access Program 🌻
            </h2>
            <p className="text-amber-900 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Every child deserves to turn toward the light. MicrobeQuest is completely free for verified nonprofits, Title I schools, and community learning centers.
            </p>
            <a
              href="mailto:sunflower@chasestreetpress.co"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ background: "#1e1b4b", color: "white" }}
            >
              Apply for Free Access
            </a>
            <p className="text-amber-800 text-xs mt-6 max-w-sm mx-auto leading-relaxed">
              Named after the sunflower — the symbol of Chase Street Press and the state flower of Kansas
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Questions & Answers</h2>
          </div>
          <div className="space-y-3">
            {faqs?.map((faq) => (
              <FAQItem key={faq?.q} q={faq?.q} a={faq?.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-indigo-900/50 px-5 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-indigo-300 text-sm leading-relaxed max-w-md">
              MicrobeQuest is created by{" "}
              <span style={{ color: SUNFLOWER }} className="font-semibold">Chase Street Press</span>{" "}
              — a minority and woman-owned STEM learning platform
            </p>
            <p className="text-indigo-500 text-xs mt-1">© Chase Street Press 2026. All rights reserved.</p>
          </div>
          <Link
            to="/"
            className="text-sm font-semibold text-indigo-300 hover:text-white transition-colors px-5 py-2.5 rounded-xl border border-indigo-700/50 hover:border-indigo-500 whitespace-nowrap"
          >
            ← Back to the Game
          </Link>
        </div>
      </footer>
    </div>
  );
}
