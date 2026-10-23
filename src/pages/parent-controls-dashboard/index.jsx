import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Clock, Filter, Database, Save, RotateCcw, CheckCircle, AlertCircle, Lock, Unlock, ChevronDown, ChevronUp, Info, Download, Trash2, Key, Mail, FileText, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import {
  loadParentalControls,
  saveParentalControls,
  defaultControls,
  exportChildData,
  deleteAllChildData,
  grantVerifiableConsent,
  withdrawConsent,
  getRetentionWarning,
  getDeletionReceipts,
  getStoredPin,
  setStoredPin,
  verifyPin,
  logConsentAction,
  COPPA_CONSENT_VERSION,
} from '../../services/parentalControlsService';



// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({ icon, title, subtitle, color, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const SectionIcon = icon;
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-subtle">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors duration-fast"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <SectionIcon size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-heading text-base text-foreground">{title}</h3>
            <p className="font-caption text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-border/50">{children}</div>}
    </div>
  );
};

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="flex-1">
      <p className="font-body text-sm font-semibold text-foreground">{label}</p>
      {description && <p className="font-caption text-xs text-muted-foreground mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-primary' : 'bg-muted'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

const SliderField = ({ label, value, onChange, min, max, step = 1, unit }) => (
  <div className="py-3">
    <div className="flex items-center justify-between mb-2">
      <p className="font-body text-sm font-semibold text-foreground">{label}</p>
      <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
        {value} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e?.target?.value))}
      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
    />
    <div className="flex justify-between mt-1">
      <span className="font-caption text-xs text-muted-foreground">{min} {unit}</span>
      <span className="font-caption text-xs text-muted-foreground">{max} {unit}</span>
    </div>
  </div>
);

const TimeField = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <p className="font-body text-sm font-semibold text-foreground">{label}</p>
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e?.target?.value)}
      className="bg-muted border border-border rounded-lg px-3 py-1.5 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
    />
  </div>
);

const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };
const ALL_DAYS = Object.keys(DAY_LABELS);

const DayPicker = ({ value, onChange }) => (
  <div className="py-3">
    <p className="font-body text-sm font-semibold text-foreground mb-2">Allowed Days</p>
    <div className="flex gap-2 flex-wrap">
      {ALL_DAYS?.map((day) => {
        const active = value?.includes(day);
        return (
          <button
            key={day}
            onClick={() => onChange(active ? value?.filter((d) => d !== day) : [...value, day])}
            className={`px-3 py-1.5 rounded-lg font-body text-xs font-semibold transition-all duration-fast ${active ? 'bg-primary text-primary-foreground shadow-moderate' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {DAY_LABELS?.[day]}
          </button>
        );
      })}
    </div>
  </div>
);

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', desc: 'Beginner-friendly content only' },
  { value: 'medium', label: 'Medium', desc: 'Age-appropriate mixed difficulty' },
  { value: 'hard', label: 'Hard', desc: 'All difficulty levels unlocked' },
];

const GAME_MODE_LABELS = {
  matching: 'Microbe Matching',
  quiz: 'Quiz Challenge',
  explorer: 'World Explorer',
  lab: 'Microscope Lab',
  timeline: 'Timeline Adventure',
  detective: 'Detective Mystery',
  tower_defense: 'Germ Buster',
};

const InfoBadge = ({ text }) => (
  <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mt-3">
    <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
    <p className="font-caption text-xs text-blue-300 leading-relaxed">{text}</p>
  </div>
);

const WarningBadge = ({ text }) => (
  <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-3">
    <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
    <p className="font-caption text-xs text-amber-300 leading-relaxed">{text}</p>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const ParentControlsDashboard = () => {
  const [controls, setControls] = useState(defaultControls);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [pinLocked, setPinLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [exportStatus, setExportStatus] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [deletedAt, setDeletedAt] = useState(null);
  const [retentionWarning, setRetentionWarning] = useState(null);
  const [deletionReceipts, setDeletionReceipts] = useState([]);

  // PIN setup state
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSetupError, setPinSetupError] = useState('');
  const [pinSetupSuccess, setPinSetupSuccess] = useState(false);

  // Verifiable consent state
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [consentEmail, setConsentEmail] = useState('');
  const [consentAck, setConsentAck] = useState(false);
  const [consentStatus, setConsentStatus] = useState(null);

  // Withdraw consent state
  const [withdrawStatus, setWithdrawStatus] = useState(null);

  const hasPinSet = !!getStoredPin();

  useEffect(() => {
    const fetchControls = async () => {
      setLoading(true);
      try {
        const data = await loadParentalControls();
        setControls(data);
        setRetentionWarning(getRetentionWarning(data));
        setDeletionReceipts(getDeletionReceipts());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchControls();
  }, []);

  const update = useCallback((key, value) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const { error } = await saveParentalControls(controls);
      setSaveStatus(error ? 'error' : 'success');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleReset = () => {
    setControls({ ...defaultControls });
  };

  const handlePinSubmit = (e) => {
    e?.preventDefault();
    if (verifyPin(pinInput)) {
      setPinLocked(false);
      setPinError('');
      setPinInput('');
    } else {
      setPinError(hasPinSet ? 'Incorrect PIN. Please try again.' : 'Incorrect PIN. Try 1234 for demo.');
      setPinInput('');
    }
  };

  const handlePinSetup = (e) => {
    e?.preventDefault();
    if (newPin?.length < 4) { setPinSetupError('PIN must be 4 digits.'); return; }
    if (newPin !== confirmPin) { setPinSetupError('PINs do not match.'); return; }
    setStoredPin(newPin);
    logConsentAction('pin_set', { metadata: { setAt: new Date()?.toISOString() } });
    const updated = { ...controls, pinSet: true };
    setControls(updated);
    saveParentalControls(updated);
    setPinSetupSuccess(true);
    setPinSetupError('');
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => { setShowPinSetup(false); setPinSetupSuccess(false); }, 2000);
  };

  const toggleGameMode = (mode) => {
    const current = controls?.allowedGameModes ?? [];
    const updated = current?.includes(mode) ? current?.filter((m) => m !== mode) : [...current, mode];
    update('allowedGameModes', updated);
  };

  const handleExportData = async () => {
    setExportStatus('loading');
    try {
      const { data, error } = await exportChildData();
      if (error && !data) {
        setExportStatus('error');
        setTimeout(() => setExportStatus(null), 3000);
        return;
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `microbequest-data-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
      setExportStatus('success');
      setTimeout(() => setExportStatus(null), 3000);
    } catch {
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleDeleteData = async () => {
    if (deleteStatus !== 'confirm') {
      setDeleteStatus('confirm');
      return;
    }
    setDeleteStatus('loading');
    try {
      const { error, deletedAt: ts } = await deleteAllChildData();
      if (error) {
        setDeleteStatus('error');
      } else {
        setDeleteStatus('success');
        setDeletedAt(ts);
        setControls({ ...defaultControls });
        setDeletionReceipts(getDeletionReceipts());
      }
      setTimeout(() => setDeleteStatus(null), 6000);
    } catch {
      setDeleteStatus('error');
      setTimeout(() => setDeleteStatus(null), 3000);
    }
  };

  const handleGrantConsent = async (e) => {
    e?.preventDefault();
    if (!consentEmail || !consentAck) return;
    setConsentStatus('loading');
    try {
      const updated = await grantVerifiableConsent(controls, consentEmail);
      setControls(updated);
      setConsentStatus('success');
      setShowConsentForm(false);
      setConsentEmail('');
      setConsentAck(false);
      setTimeout(() => setConsentStatus(null), 4000);
    } catch {
      setConsentStatus('error');
      setTimeout(() => setConsentStatus(null), 3000);
    }
  };

  const handleWithdrawAllConsent = async () => {
    setWithdrawStatus('loading');
    try {
      const updated = await withdrawConsent(controls, 'all');
      setControls(updated);
      setWithdrawStatus('success');
      setTimeout(() => setWithdrawStatus(null), 3000);
    } catch {
      setWithdrawStatus('error');
      setTimeout(() => setWithdrawStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-muted-foreground">Loading parental controls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 px-4 max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-moderate">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl text-foreground">Parent Controls</h1>
              <p className="font-caption text-sm text-muted-foreground">Manage your child's learning experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <Shield size={16} className="text-amber-400 flex-shrink-0" />
            <p className="font-caption text-xs text-amber-300">
              This dashboard is designed to comply with COPPA and GDPR-K children's privacy regulations. All data collection requires explicit parental consent.
            </p>
          </div>
          <div className="mt-3">
            <Link
              to="/parent-billing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-caption text-xs font-semibold border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 transition-colors"
            >
              💳 Manage Billing & Subscription
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/parent-account-settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-caption text-xs font-semibold border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 transition-colors"
            >
              ⚙️ Account Settings
            </Link>
            <Link
              to="/parent-milestone-notifications"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-caption text-xs font-semibold border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 transition-colors"
            >
              🏆 Milestone Notifications
            </Link>
          </div>
        </div>

        {/* PIN Lock Gate */}
        {pinLocked ? (
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center shadow-subtle">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center mb-4 shadow-moderate">
              <Lock size={28} className="text-white" />
            </div>
            <h2 className="font-heading text-xl text-foreground mb-1">Parent Access Required</h2>
            <p className="font-caption text-sm text-muted-foreground mb-6">Enter your 4-digit PIN to access parental controls</p>
            <form onSubmit={handlePinSubmit} className="w-full max-w-xs flex flex-col gap-3">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e?.target?.value?.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full text-center text-2xl tracking-widest bg-muted border border-border rounded-xl px-4 py-3 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {pinError && (
                <p className="font-caption text-xs text-red-400 text-center">{pinError}</p>
              )}
              <button
                type="submit"
                disabled={pinInput?.length < 4}
                className="w-full bg-primary text-primary-foreground font-body font-semibold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-fast"
              >
                Unlock Controls
              </button>
              {!hasPinSet && (
                <p className="font-caption text-xs text-muted-foreground">Demo PIN: <span className="font-mono text-primary">1234</span> — set a custom PIN after unlocking</p>
              )}
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Unlocked indicator */}
            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Unlock size={14} className="text-green-400" />
                <span className="font-caption text-xs text-green-300">Parent controls unlocked</span>
              </div>
              <button
                onClick={() => setPinLocked(true)}
                className="font-caption text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Lock
              </button>
            </div>

            {/* Retention Warning Banner */}
            {retentionWarning && (
              <div className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${retentionWarning?.expired ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <AlertTriangle size={16} className={`flex-shrink-0 mt-0.5 ${retentionWarning?.expired ? 'text-red-400' : 'text-amber-400'}`} />
                <div>
                  <p className={`font-body text-xs font-semibold ${retentionWarning?.expired ? 'text-red-300' : 'text-amber-300'}`}>
                    {retentionWarning?.expired
                      ? 'Data Retention Period Expired'
                      : `Data Retention Expiring in ${retentionWarning?.daysUntilExpiry} day${retentionWarning?.daysUntilExpiry !== 1 ? 's' : ''}`}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-0.5">
                    {retentionWarning?.expired
                      ? 'Your child\'s data has exceeded the retention period. Please review and delete or extend the retention window.'
                      : `Your child's data will be automatically deleted on ${new Date(retentionWarning?.expiresAt)?.toLocaleDateString()}. Extend the retention period in Data & Privacy settings if needed.`}
                  </p>
                </div>
              </div>
            )}

            {/* ── COPPA Verifiable Parental Consent ── */}
            <SectionCard
              icon={FileText}
              title="Verifiable Parental Consent"
              subtitle="COPPA §312.5 — Required before any data collection"
              color="bg-gradient-to-br from-amber-500 to-orange-600"
              defaultOpen={!controls?.consentGrantedAt}
            >
              {controls?.consentGrantedAt ? (
                <div className="space-y-3 mt-2">
                  <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-body text-sm font-semibold text-green-300">Verifiable Consent Granted</p>
                      <p className="font-caption text-xs text-muted-foreground mt-0.5">
                        Consent recorded on {new Date(controls?.consentGrantedAt)?.toLocaleString()}
                      </p>
                      {controls?.parentEmail && (
                        <p className="font-caption text-xs text-muted-foreground">
                          Parent email: <span className="text-foreground font-mono">{controls?.parentEmail}</span>
                        </p>
                      )}
                      <p className="font-caption text-xs text-muted-foreground">
                        Consent version: <span className="font-mono text-primary">{controls?.consentVersion ?? COPPA_CONSENT_VERSION}</span>
                      </p>
                      {controls?.consentWithdrawnAt && (
                        <p className="font-caption text-xs text-amber-400 mt-1">
                          ⚠ Consent withdrawn on {new Date(controls?.consentWithdrawnAt)?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setShowConsentForm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all duration-fast font-body text-xs font-semibold"
                    >
                      <Mail size={13} />
                      Update Consent
                    </button>
                    <button
                      onClick={handleWithdrawAllConsent}
                      disabled={withdrawStatus === 'loading'}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all duration-fast font-body text-xs font-semibold disabled:opacity-50"
                    >
                      {withdrawStatus === 'loading' ? 'Withdrawing...' : 'Withdraw All Consent'}
                    </button>
                  </div>
                  {withdrawStatus === 'success' && (
                    <div className="flex items-center gap-1.5 text-green-400">
                      <CheckCircle size={13} />
                      <span className="font-caption text-xs">All consent withdrawn. Data collection stopped.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2 space-y-3">
                  <WarningBadge text="COPPA requires verifiable parental consent before collecting any personal information from children under 13. Please provide your consent below to enable data collection features." />
                  {!showConsentForm ? (
                    <button
                      onClick={() => setShowConsentForm(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all duration-fast font-body text-sm font-semibold"
                    >
                      <Mail size={15} />
                      Provide Verifiable Parental Consent
                    </button>
                  ) : null}
                </div>
              )}

              {showConsentForm && (
                <form onSubmit={handleGrantConsent} className="mt-4 space-y-4 bg-muted/40 rounded-xl p-4 border border-border/50">
                  <p className="font-body text-sm font-semibold text-foreground">Parental Consent Form</p>
                  <p className="font-caption text-xs text-muted-foreground leading-relaxed">
                    Under COPPA (Children's Online Privacy Protection Act), we require verifiable parental consent before collecting personal information from children under 13. By submitting this form, you confirm you are the parent or legal guardian.
                  </p>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Parent / Guardian Email Address *</label>
                    <input
                      type="email"
                      required
                      value={consentEmail}
                      onChange={(e) => setConsentEmail(e?.target?.value)}
                      placeholder="parent@example.com"
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setConsentAck(!consentAck)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${consentAck ? 'bg-primary border-primary' : 'border-border bg-muted'}`}
                    >
                      {consentAck && <CheckCircle size={12} className="text-white" />}
                    </button>
                    <p className="font-caption text-xs text-muted-foreground leading-relaxed">
                      I confirm I am the parent or legal guardian of the child using this app. I consent to MicrobeQuest collecting the data types I have enabled above, in accordance with the <span className="text-primary">Privacy Policy</span>. I understand I can withdraw consent at any time.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!consentEmail || !consentAck || consentStatus === 'loading'}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-fast"
                    >
                      {consentStatus === 'loading' ? 'Recording...' : 'Grant Consent'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowConsentForm(false); setConsentEmail(''); setConsentAck(false); }}
                      className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground font-body text-sm font-semibold transition-all duration-fast"
                    >
                      Cancel
                    </button>
                  </div>
                  {consentStatus === 'error' && (
                    <div className="flex items-center gap-1.5 text-red-400">
                      <AlertCircle size={13} />
                      <span className="font-caption text-xs">Failed to record consent. Please try again.</span>
                    </div>
                  )}
                </form>
              )}
            </SectionCard>

            {/* ── PIN Management ── */}
            <SectionCard
              icon={Key}
              title="Parent PIN"
              subtitle="Secure access to parental controls"
              color="bg-gradient-to-br from-slate-500 to-slate-700"
              defaultOpen={false}
            >
              <div className="mt-2 space-y-3">
                <div className="flex items-start gap-3 bg-muted/40 rounded-xl p-4 border border-border/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${hasPinSet ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                    {hasPinSet ? <CheckCircle size={16} className="text-green-400" /> : <AlertTriangle size={16} className="text-amber-400" />}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {hasPinSet ? 'Custom PIN is set' : 'Using default demo PIN (1234)'}
                    </p>
                    <p className="font-caption text-xs text-muted-foreground mt-0.5">
                      {hasPinSet
                        ? 'Your custom PIN protects access to parental controls.' :'Set a custom PIN to properly secure parental controls from child access.'}
                    </p>
                  </div>
                </div>

                {!showPinSetup ? (
                  <button
                    onClick={() => setShowPinSetup(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all duration-fast font-body text-sm font-semibold"
                  >
                    <Key size={14} />
                    {hasPinSet ? 'Change PIN' : 'Set Custom PIN'}
                  </button>
                ) : (
                  <form onSubmit={handlePinSetup} className="space-y-3 bg-muted/40 rounded-xl p-4 border border-border/50">
                    <p className="font-body text-sm font-semibold text-foreground">{hasPinSet ? 'Change PIN' : 'Set Custom PIN'}</p>
                    <div>
                      <label className="font-body text-xs font-semibold text-foreground block mb-1.5">New 4-Digit PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={newPin}
                        onChange={(e) => setNewPin(e?.target?.value?.replace(/\D/g, ''))}
                        placeholder="• • • •"
                        className="w-full text-center text-xl tracking-widest bg-muted border border-border rounded-xl px-4 py-2.5 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Confirm PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e?.target?.value?.replace(/\D/g, ''))}
                        placeholder="• • • •"
                        className="w-full text-center text-xl tracking-widest bg-muted border border-border rounded-xl px-4 py-2.5 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    {pinSetupError && <p className="font-caption text-xs text-red-400">{pinSetupError}</p>}
                    {pinSetupSuccess && (
                      <div className="flex items-center gap-1.5 text-green-400">
                        <CheckCircle size={13} />
                        <span className="font-caption text-xs">PIN set successfully!</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={newPin?.length < 4 || confirmPin?.length < 4}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-fast"
                      >
                        Save PIN
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowPinSetup(false); setNewPin(''); setConfirmPin(''); setPinSetupError(''); }}
                        className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground font-body text-sm font-semibold transition-all duration-fast"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </SectionCard>

            {/* ── Screen Time ── */}
            <SectionCard
              icon={Clock}
              title="Screen Time Limits"
              subtitle="Control daily usage and session length"
              color="bg-gradient-to-br from-blue-500 to-cyan-600"
            >
              <Toggle
                checked={controls?.screenTimeEnabled}
                onChange={(v) => update('screenTimeEnabled', v)}
                label="Enable Screen Time Limits"
                description="Restrict how long your child can use the app each day"
              />
              {controls?.screenTimeEnabled && (
                <>
                  <div className="border-t border-border/50 mt-1 pt-1">
                    <SliderField
                      label="Daily Time Limit"
                      value={controls?.dailyTimeLimitMinutes}
                      onChange={(v) => update('dailyTimeLimitMinutes', v)}
                      min={15}
                      max={240}
                      step={15}
                      unit="min"
                    />
                    <SliderField
                      label="Session Time Limit"
                      value={controls?.sessionTimeLimitMinutes}
                      onChange={(v) => update('sessionTimeLimitMinutes', v)}
                      min={10}
                      max={120}
                      step={5}
                      unit="min"
                    />
                    <DayPicker
                      value={controls?.allowedDays}
                      onChange={(v) => update('allowedDays', v)}
                    />
                    <div className="border-t border-border/50 pt-3 mt-1">
                      <p className="font-body text-sm font-semibold text-foreground mb-2">Allowed Hours</p>
                      <p className="text-sm text-muted-foreground mb-2">Uses this device’s local time. Overnight hours belong to the day they start. Equal start and end times allow no play.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <TimeField label="Start" value={controls?.allowedStartTime} onChange={(v) => update('allowedStartTime', v)} />
                        <TimeField label="End" value={controls?.allowedEndTime} onChange={(v) => update('allowedEndTime', v)} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </SectionCard>

            {/* ── Content Filters ── */}
            <SectionCard
              icon={Filter}
              title="Content Filters"
              subtitle="Manage difficulty levels and available game modes"
              color="bg-gradient-to-br from-emerald-500 to-teal-600"
            >
              <div className="py-3">
                <p className="font-body text-sm font-semibold text-foreground mb-3">Maximum Difficulty Level</p>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTY_OPTIONS?.map((opt) => (
                    <button
                      key={opt?.value}
                      onClick={() => update('maxDifficultyLevel', opt?.value)}
                      className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-fast text-center ${
                        controls?.maxDifficultyLevel === opt?.value
                          ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <span className="font-body text-sm font-bold">{opt?.label}</span>
                      <span className="font-caption text-xs mt-0.5 leading-tight">{opt?.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/50 pt-3">
                <p className="font-body text-sm font-semibold text-foreground mb-3">Allowed Game Modes</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(GAME_MODE_LABELS)?.map(([mode, label]) => {
                    const enabled = controls?.allowedGameModes?.includes(mode);
                    return (
                      <button
                        key={mode}
                        onClick={() => toggleGameMode(mode)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-fast text-left ${
                          enabled
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-border bg-muted/40 text-muted-foreground'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-emerald-500' : 'bg-muted border border-border'}`}>
                          {enabled && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className="font-body text-xs font-semibold">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border/50 pt-1 mt-1">
                <Toggle
                  checked={controls?.educationalContentOnly}
                  onChange={(v) => update('educationalContentOnly', v)}
                  label="Educational Content Only"
                  description="Restrict to strictly curriculum-aligned content, hiding entertainment-focused elements"
                />
              </div>
            </SectionCard>

            {/* ── Parent Digest Emails ── */}
            <SectionCard
              icon={Mail}
              title="Parent Digest Emails"
              subtitle="Weekly or monthly summaries of your child's activity, badges, and progress"
              color="bg-gradient-to-br from-yellow-400 to-orange-500"
              defaultOpen={false}
            >
              <div className="mt-2 space-y-4">
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Receive a beautiful email digest summarizing your child's MicrobeQuest activity — games played, badges earned, time spent learning, and overall progress — without needing to log in.
                </p>

                <div className="space-y-2">
                  <p className="font-body text-sm font-semibold text-foreground">Digest Frequency</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'weekly', label: '📅 Weekly', desc: 'Every Monday' },
                      { value: 'monthly', label: '🗓️ Monthly', desc: '1st of month' },
                      { value: 'disabled', label: '🔕 Off', desc: 'No emails' },
                    ]?.map((opt) => (
                      <button
                        key={opt?.value}
                        onClick={() => update('digestFrequency', opt?.value)}
                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                          (controls?.digestFrequency ?? 'weekly') === opt?.value
                            ? 'border-yellow-400 bg-yellow-50 text-yellow-800' :'border-border bg-muted/30 text-muted-foreground hover:border-yellow-300'
                        }`}
                      >
                        <span className="text-base font-bold">{opt?.label}</span>
                        <span className="text-xs mt-0.5">{opt?.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {(controls?.digestFrequency ?? 'weekly') !== 'disabled' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="font-body text-sm text-yellow-800 leading-relaxed">
                      📬 Digest emails will be sent to the parent email address on file. Make sure your parent email is set in the Verifiable Parental Consent section above.
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ── Data Collection Preferences ── */}
            <SectionCard
              icon={Database}
              title="Data & Privacy Preferences"
              subtitle="Transparent control over your child's data — COPPA & GDPR-K compliant"
              color="bg-gradient-to-br from-violet-500 to-purple-700"
            >
              <InfoBadge text="MicrobeQuest collects only the data you explicitly consent to. Your child's data is never sold or shared with third parties. You can withdraw consent at any time without penalty." />

              {!controls?.consentGrantedAt && (
                <WarningBadge text="Verifiable parental consent has not been recorded. Data collection toggles below are disabled until consent is granted in the 'Verifiable Parental Consent' section above." />
              )}

              <div className="mt-4 space-y-1 divide-y divide-border/50">
                <Toggle
                  checked={controls?.progressTrackingConsent}
                  onChange={async (v) => {
                    const updated = v
                      ? { ...controls, progressTrackingConsent: true }
                      : await withdrawConsent(controls, 'progress_tracking');
                    setControls(updated);
                    if (v) await logConsentAction('consent_granted', { consentType: 'progress_tracking' });
                  }}
                  label="Progress & Learning Tracking"
                  description="Store game scores, achievements, and learning milestones to show your child's growth over time. Required for the Progress Hub."
                />
                <Toggle
                  checked={controls?.analyticsConsent}
                  onChange={async (v) => {
                    const updated = v
                      ? { ...controls, analyticsConsent: true }
                      : await withdrawConsent(controls, 'analytics');
                    setControls(updated);
                    if (v) await logConsentAction('consent_granted', { consentType: 'analytics' });
                  }}
                  label="Usage Analytics"
                  description="Share anonymized usage patterns to help improve the app. No personally identifiable information is included."
                />
                <Toggle
                  checked={controls?.personalizationConsent}
                  onChange={async (v) => {
                    const updated = v
                      ? { ...controls, personalizationConsent: true }
                      : await withdrawConsent(controls, 'personalization');
                    setControls(updated);
                    if (v) await logConsentAction('consent_granted', { consentType: 'personalization' });
                  }}
                  label="Personalized Recommendations"
                  description="Allow the app to suggest game modes and content based on your child's learning patterns."
                />
              </div>

              {/* Persistent Opt-Out */}
              <div className="border-t border-border/50 pt-4 mt-2">
                <div className="flex items-start justify-between gap-3 bg-muted/40 rounded-xl p-4 border border-border/50">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">Persistent Opt-Out</p>
                    <p className="font-caption text-xs text-muted-foreground mt-0.5">
                      Withdraw all data collection consent immediately. This is a persistent opt-out — your preference will be saved and honored across all sessions.
                    </p>
                    {controls?.consentWithdrawnAt && (
                      <p className="font-caption text-xs text-amber-400 mt-1">
                        Opted out on {new Date(controls?.consentWithdrawnAt)?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleWithdrawAllConsent}
                    disabled={withdrawStatus === 'loading' || (!controls?.analyticsConsent && !controls?.personalizationConsent && !controls?.progressTrackingConsent)}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all duration-fast font-body text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {withdrawStatus === 'loading' ? 'Withdrawing...' : 'Opt Out All'}
                  </button>
                </div>
                {withdrawStatus === 'success' && (
                  <div className="flex items-center gap-1.5 mt-2 text-green-400">
                    <CheckCircle size={13} />
                    <span className="font-caption text-xs">All consent withdrawn. Opt-out recorded persistently.</span>
                  </div>
                )}
              </div>

              {/* Data Retention */}
              <div className="border-t border-border/50 pt-4 mt-2">
                <SliderField
                  label="Data Retention Period"
                  value={controls?.dataRetentionDays}
                  onChange={(v) => update('dataRetentionDays', v)}
                  min={30}
                  max={365}
                  step={30}
                  unit="days"
                />
                <InfoBadge text={`Your child's data will be automatically deleted after ${controls?.dataRetentionDays} days of inactivity. The retention period is enforced server-side. You can also request immediate deletion below.`} />
              </div>

              {/* ── Data Export & Deletion ── */}
              <div className="border-t border-border/50 pt-4 mt-2 space-y-3">
                <p className="font-body text-sm font-semibold text-foreground">Data Management</p>

                {/* Export */}
                <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-body text-sm font-semibold text-foreground">Export Child's Data</p>
                      <p className="font-caption text-xs text-muted-foreground mt-0.5">Download all data collected about your child as a JSON file — game scores, progress, achievements, settings, and consent audit log.</p>
                    </div>
                    <button
                      onClick={handleExportData}
                      disabled={exportStatus === 'loading'}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast font-body text-xs font-semibold"
                    >
                      <Download size={14} />
                      {exportStatus === 'loading' ? 'Exporting...' : 'Export'}
                    </button>
                  </div>
                  {exportStatus === 'success' && (
                    <div className="flex items-center gap-1.5 mt-2 text-green-400">
                      <CheckCircle size={13} />
                      <span className="font-caption text-xs">Data exported successfully. Includes consent audit log.</span>
                    </div>
                  )}
                  {exportStatus === 'error' && (
                    <div className="flex items-center gap-1.5 mt-2 text-red-400">
                      <AlertCircle size={13} />
                      <span className="font-caption text-xs">Export failed. Please try again.</span>
                    </div>
                  )}
                </div>

                {/* Delete */}
                <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-body text-sm font-semibold text-red-300">Delete All Child Data</p>
                      <p className="font-caption text-xs text-muted-foreground mt-0.5">Permanently erase all game progress, scores, achievements, and settings. A deletion receipt will be saved for your records. This action cannot be undone.</p>
                    </div>
                    <button
                      onClick={handleDeleteData}
                      disabled={deleteStatus === 'loading'}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border font-body text-xs font-semibold transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed ${
                        deleteStatus === 'confirm' ?'bg-red-500 border-red-500 text-white hover:bg-red-600' :'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                      }`}
                    >
                      <Trash2 size={14} />
                      {deleteStatus === 'loading' ? 'Deleting...' : deleteStatus === 'confirm' ? 'Confirm Delete' : 'Delete'}
                    </button>
                  </div>
                  {deleteStatus === 'confirm' && (
                    <div className="flex items-start gap-1.5 mt-2 bg-red-500/10 rounded-lg px-3 py-2">
                      <AlertCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="font-caption text-xs text-red-300">Click "Confirm Delete" again to permanently erase all data. A deletion receipt will be saved. This cannot be undone.</span>
                    </div>
                  )}
                  {deleteStatus === 'success' && (
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 text-green-400">
                        <CheckCircle size={13} />
                        <span className="font-caption text-xs">All data deleted successfully.</span>
                      </div>
                      {deletedAt && (
                        <p className="font-caption text-xs text-muted-foreground pl-5">
                          Deletion completed at {new Date(deletedAt)?.toLocaleString()} — receipt saved to your export.
                        </p>
                      )}
                    </div>
                  )}
                  {deleteStatus === 'error' && (
                    <div className="flex items-center gap-1.5 mt-2 text-red-400">
                      <AlertCircle size={13} />
                      <span className="font-caption text-xs">Deletion failed. Please try again.</span>
                    </div>
                  )}
                </div>

                {/* Deletion Receipts */}
                {deletionReceipts?.length > 0 && (
                  <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
                    <p className="font-body text-xs font-semibold text-foreground mb-2">Deletion Receipts ({deletionReceipts?.length})</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {deletionReceipts?.map((receipt, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <FileText size={12} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-caption text-xs text-foreground">{new Date(receipt?.deletedAt)?.toLocaleString()}</p>
                            <p className="font-caption text-xs text-muted-foreground">{receipt?.coppaReference}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 bg-muted/40 rounded-xl p-4 border border-border/50">
                <p className="font-body text-xs font-semibold text-foreground mb-2">Your Rights Under COPPA & GDPR-K</p>
                <ul className="space-y-1">
                  {[
                    'Right to access all data collected about your child',
                    'Right to correct inaccurate personal data',
                    'Right to delete your child\'s data at any time',
                    'Right to withdraw consent without penalty (persistent opt-out)',
                    'Right to data portability (export your child\'s data)',
                    'Right to be informed of data retention limits',
                  ]?.map((right, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={12} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-caption text-xs text-muted-foreground">{right}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionCard>

            {/* ── Save / Reset Bar ── */}
            <div className="sticky bottom-4 flex items-center gap-3 bg-card/95 backdrop-blur border border-border rounded-2xl px-5 py-3 shadow-pronounced">
              {saveStatus === 'success' && (
                <div className="flex items-center gap-1.5 text-green-400 flex-1">
                  <CheckCircle size={16} />
                  <span className="font-body text-sm font-semibold">Settings saved!</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-1.5 text-red-400 flex-1">
                  <AlertCircle size={16} />
                  <span className="font-body text-sm font-semibold">Save failed. Try again.</span>
                </div>
              )}
              {!saveStatus && <div className="flex-1" />}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-fast font-body text-sm font-semibold"
              >
                <RotateCcw size={15} />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast shadow-moderate"
              >
                <Save size={15} />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentControlsDashboard;
