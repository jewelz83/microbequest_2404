import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'microbequest_parental_controls';
const CONSENT_AUDIT_KEY = 'microbequest_consent_audit';
const PIN_KEY = 'microbequest_parent_pin';
const DELETION_RECEIPT_KEY = 'microbequest_deletion_receipts';
export const COPPA_CONSENT_VERSION = '1.0';
let accountOwner;
let accountEpoch = 0;
export const setParentalControlsIdentity = (id) => {
  if (accountOwner !== id) { accountOwner = id; accountEpoch += 1; }
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const defaultControls = {
  dailyTimeLimitMinutes: 60,
  sessionTimeLimitMinutes: 30,
  screenTimeEnabled: true,
  allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  allowedStartTime: '08:00',
  allowedEndTime: '20:00',
  maxDifficultyLevel: 'medium',
  allowedGameModes: ['matching', 'quiz', 'explorer', 'lab', 'timeline', 'detective', 'tower_defense'],
  educationalContentOnly: false,
  analyticsConsent: false,
  personalizationConsent: false,
  progressTrackingConsent: false,
  dataRetentionDays: 90,
  // COPPA consent fields
  parentEmail: '',
  consentGrantedAt: null,
  consentWithdrawnAt: null,
  consentVersion: COPPA_CONSENT_VERSION,
  lastActiveAt: null,
  pinSet: false,
};

// ─── Local Storage ────────────────────────────────────────────────────────────

export const loadLocalControls = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultControls, ...JSON.parse(saved) };
  } catch (e) {}
  return { ...defaultControls };
};

export const saveLocalControls = (controls) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));
  } catch (e) {}
};

// ─── PIN Management ───────────────────────────────────────────────────────────

export const getStoredPin = () => {
  try {
    return localStorage.getItem(PIN_KEY) ?? null;
  } catch {
    return null;
  }
};

export const setStoredPin = (pin) => {
  try {
    localStorage.setItem(PIN_KEY, pin);
    return true;
  } catch {
    return false;
  }
};

export const verifyPin = (inputPin) => {
  const stored = getStoredPin();
  // If no PIN has been set yet, use default demo PIN
  if (!stored) return inputPin === '1234';
  return inputPin === stored;
};

// ─── Consent Audit Log (local) ────────────────────────────────────────────────

export const appendLocalConsentAudit = (entry) => {
  try {
    const existing = JSON.parse(localStorage.getItem(CONSENT_AUDIT_KEY) ?? '[]');
    existing?.push({ ...entry, timestamp: new Date()?.toISOString() });
    localStorage.setItem(CONSENT_AUDIT_KEY, JSON.stringify(existing));
  } catch (e) {}
};

export const getLocalConsentAudit = () => {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_AUDIT_KEY) ?? '[]');
  } catch {
    return [];
  }
};

// ─── Deletion Receipts ────────────────────────────────────────────────────────

export const saveDeletionReceipt = (receipt) => {
  try {
    const existing = JSON.parse(localStorage.getItem(DELETION_RECEIPT_KEY) ?? '[]');
    existing?.push(receipt);
    localStorage.setItem(DELETION_RECEIPT_KEY, JSON.stringify(existing));
  } catch (e) {}
};

export const getDeletionReceipts = () => {
  try {
    return JSON.parse(localStorage.getItem(DELETION_RECEIPT_KEY) ?? '[]');
  } catch {
    return [];
  }
};

// ─── Retention Warning ────────────────────────────────────────────────────────

export const getRetentionWarning = (controls) => {
  if (!controls?.lastActiveAt || !controls?.dataRetentionDays) return null;
  const lastActive = new Date(controls.lastActiveAt);
  const retentionMs = controls?.dataRetentionDays * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(lastActive.getTime() + retentionMs);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000));
  if (daysUntilExpiry <= 14 && daysUntilExpiry > 0) {
    return { daysUntilExpiry, expiresAt: expiresAt?.toISOString() };
  }
  if (daysUntilExpiry <= 0) {
    return { daysUntilExpiry: 0, expiresAt: expiresAt?.toISOString(), expired: true };
  }
  return null;
};

// ─── DB Helpers ───────────────────────────────────────────────────────────────

const getCurrentUserId = async () => {
  const ticket = accountEpoch;
  try {
    const { data, error } = await supabase.auth.getSession();
    const id = data?.session?.user?.id ?? null;
    if (error || ticket !== accountEpoch || (accountOwner !== undefined && accountOwner !== id)) return undefined;
    return id;
  } catch {
    return undefined;
  }
};

const dbToControls = (row) => ({
  dailyTimeLimitMinutes: row?.daily_time_limit_minutes ?? defaultControls?.dailyTimeLimitMinutes,
  sessionTimeLimitMinutes: row?.session_time_limit_minutes ?? defaultControls?.sessionTimeLimitMinutes,
  screenTimeEnabled: row?.screen_time_enabled ?? defaultControls?.screenTimeEnabled,
  allowedDays: row?.allowed_days ?? defaultControls?.allowedDays,
  allowedStartTime: row?.allowed_start_time ?? defaultControls?.allowedStartTime,
  allowedEndTime: row?.allowed_end_time ?? defaultControls?.allowedEndTime,
  maxDifficultyLevel: row?.max_difficulty_level ?? defaultControls?.maxDifficultyLevel,
  allowedGameModes: row?.allowed_game_modes ?? defaultControls?.allowedGameModes,
  educationalContentOnly: row?.educational_content_only ?? defaultControls?.educationalContentOnly,
  analyticsConsent: row?.analytics_consent ?? defaultControls?.analyticsConsent,
  personalizationConsent: row?.personalization_consent ?? defaultControls?.personalizationConsent,
  progressTrackingConsent: row?.progress_tracking_consent ?? defaultControls?.progressTrackingConsent,
  dataRetentionDays: row?.data_retention_days ?? defaultControls?.dataRetentionDays,
  // COPPA fields
  parentEmail: row?.parent_email ?? defaultControls?.parentEmail,
  consentGrantedAt: row?.consent_granted_at ?? defaultControls?.consentGrantedAt,
  consentWithdrawnAt: row?.consent_withdrawn_at ?? defaultControls?.consentWithdrawnAt,
  consentVersion: row?.consent_version ?? defaultControls?.consentVersion,
  lastActiveAt: row?.last_active_at ?? defaultControls?.lastActiveAt,
  pinSet: row?.pin_set ?? defaultControls?.pinSet,
});

const controlsToDb = (controls, userId) => ({
  user_id: userId,
  daily_time_limit_minutes: controls?.dailyTimeLimitMinutes,
  session_time_limit_minutes: controls?.sessionTimeLimitMinutes,
  screen_time_enabled: controls?.screenTimeEnabled,
  allowed_days: controls?.allowedDays,
  allowed_start_time: controls?.allowedStartTime,
  allowed_end_time: controls?.allowedEndTime,
  max_difficulty_level: controls?.maxDifficultyLevel,
  allowed_game_modes: controls?.allowedGameModes,
  educational_content_only: controls?.educationalContentOnly,
  analytics_consent: controls?.analyticsConsent,
  personalization_consent: controls?.personalizationConsent,
  progress_tracking_consent: controls?.progressTrackingConsent,
  data_retention_days: controls?.dataRetentionDays,
  // COPPA fields
  parent_email: controls?.parentEmail ?? null,
  consent_granted_at: controls?.consentGrantedAt ?? null,
  consent_withdrawn_at: controls?.consentWithdrawnAt ?? null,
  consent_version: controls?.consentVersion ?? COPPA_CONSENT_VERSION,
  last_active_at: new Date()?.toISOString(),
  pin_set: controls?.pinSet ?? false,
  updated_at: new Date()?.toISOString(),
});

// ─── Consent Audit DB Log ─────────────────────────────────────────────────────

export const logConsentAction = async (action, details = {}) => {
  appendLocalConsentAudit({ action, ...details });

  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase?.from('consent_audit_log')?.insert({
      user_id: userId,
      action,
      consent_type: details?.consentType ?? null,
      parent_email: details?.parentEmail ?? null,
      consent_version: details?.consentVersion ?? COPPA_CONSENT_VERSION,
      metadata: details?.metadata ?? {},
    });
  } catch (err) {
    console.error('Error logging consent action:', err);
  }
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const loadParentalControls = async ({ strict = false } = {}) => {
  const userId = await getCurrentUserId();
  const epoch = accountEpoch;
  if (userId === undefined) {
    if (strict) throw new Error('Could not verify the current account.');
    return { ...defaultControls };
  }
  if (userId === null) return loadLocalControls();

  try {
    const { data, error } = await supabase
      ?.from('parental_controls')
      ?.select('*')
      ?.eq('user_id', userId)
      ?.maybeSingle();

    if (strict && epoch !== accountEpoch) throw new Error('Account changed while loading settings.');
    if (error) {
      if (strict) throw error;
      console.error('Error loading parental controls:', error?.message);
      return { ...defaultControls };
    }

    if (!data) {
      // A browser cache is not evidence of this account's parental consent.
      return { ...defaultControls };
    }

    const controls = dbToControls(data);
    return controls;
  } catch (err) {
    if (strict) throw err;
    console.error('Unexpected error loading parental controls:', err);
    return { ...defaultControls };
  }
};

export const saveParentalControls = async (controls) => {
  const userId = await getCurrentUserId();
  if (userId === undefined) return { error: new Error('Could not verify the current account. Settings were not saved.') };
  if (userId === null) {
    saveLocalControls(controls);
    return { error: null };
  }

  try {
    const { error } = await supabase
      ?.from('parental_controls')
      ?.upsert(controlsToDb(controls, userId), { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving parental controls:', error?.message);
      return { error };
    }
    return { error: null };
  } catch (err) {
    console.error('Unexpected error saving parental controls:', err);
    return { error: err };
  }
};

// ─── Grant / Withdraw Consent ─────────────────────────────────────────────────

export const grantVerifiableConsent = async (controls, parentEmail) => {
  const ticket = accountEpoch;
  const now = new Date()?.toISOString();
  let updated = {
    ...controls,
    parentEmail,
    consentGrantedAt: now,
    consentWithdrawnAt: null,
    consentVersion: COPPA_CONSENT_VERSION,
  };
  const { error } = await saveParentalControls(updated);
  if (error) throw error;
  if (ticket !== accountEpoch) throw new Error('The account changed. Reload settings before continuing.');
  await logConsentAction('consent_granted', {
    parentEmail,
    consentVersion: COPPA_CONSENT_VERSION,
    metadata: {
      analyticsConsent: controls?.analyticsConsent,
      personalizationConsent: controls?.personalizationConsent,
      progressTrackingConsent: controls?.progressTrackingConsent,
    },
  });
  return updated;
};

export const withdrawConsent = async (controls, consentType) => {
  const ticket = accountEpoch;
  const now = new Date()?.toISOString();
  let updated = { ...controls, consentWithdrawnAt: now };
  if (consentType === 'all') {
    updated = { ...updated, analyticsConsent: false, personalizationConsent: false, progressTrackingConsent: false };
  } else if (consentType === 'analytics') {
    updated = { ...updated, analyticsConsent: false };
  } else if (consentType === 'personalization') {
    updated = { ...updated, personalizationConsent: false };
  } else if (consentType === 'progress_tracking') {
    updated = { ...updated, progressTrackingConsent: false };
  }
  const { error } = await saveParentalControls(updated);
  if (error) throw error;
  if (ticket !== accountEpoch) throw new Error('The account changed. Reload settings before continuing.');
  await logConsentAction('consent_withdrawn', { consentType, metadata: { withdrawnAt: now } });
  return updated;
};

// ─── Data Export ──────────────────────────────────────────────────────────────

export const exportChildData = async () => {
  const userId = await getCurrentUserId();

  const exportPayload = {
    exportedAt: new Date()?.toISOString(),
    appName: 'MicrobeQuest',
    coppaCompliance: {
      consentVersion: COPPA_CONSENT_VERSION,
      exportReason: 'Parental right to data portability under COPPA §312.6',
    },
    userId: userId ?? 'local-user',
    parentalControls: null,
    gameProgress: null,
    gameScores: [],
    consentAuditLog: getLocalConsentAudit(),
    deletionReceipts: getDeletionReceipts(),
  };

  try {
    const localControls = loadLocalControls();
    exportPayload.parentalControls = localControls;

    if (userId) {
      const { data: progressData } = await supabase
        ?.from('game_progress')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.maybeSingle();
      if (progressData) exportPayload.gameProgress = progressData;

      const { data: scoresData } = await supabase
        ?.from('game_scores')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('played_at', { ascending: false });
      if (scoresData) exportPayload.gameScores = scoresData;

      const { data: controlsData } = await supabase
        ?.from('parental_controls')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.maybeSingle();
      if (controlsData) exportPayload.parentalControls = controlsData;

      const { data: auditData } = await supabase
        ?.from('consent_audit_log')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });
      if (auditData) exportPayload.consentAuditLog = auditData;
    }

    await logConsentAction('data_exported', { metadata: { exportedAt: exportPayload?.exportedAt } });
    return { data: exportPayload, error: null };
  } catch (err) {
    console.error('Error exporting child data:', err);
    return { data: exportPayload, error: err };
  }
};

// ─── Data Deletion ────────────────────────────────────────────────────────────

export const deleteAllChildData = async () => {
  const deletedAt = new Date()?.toISOString();

  // Log deletion before clearing data
  await logConsentAction('data_deleted', {
    metadata: { deletedAt, reason: 'Parental request under COPPA §312.6' },
  });

  // Save deletion receipt to localStorage (persists as audit trail even after data wipe)
  saveDeletionReceipt({
    deletedAt,
    reason: 'Parental request',
    coppaReference: 'COPPA §312.6 — Right to deletion',
    dataTypes: ['game_scores', 'game_progress', 'parental_controls', 'localStorage'],
  });

  const userId = await getCurrentUserId();
  if (userId === undefined) return { error: new Error('Could not verify the account for deletion.'), deletedAt };

  // Clear this account's new cache as well as legacy keys. Other accounts stay separate.
  try {
    localStorage.removeItem('microbequest_parental_controls');
    localStorage.removeItem('microbequest_progress');
    localStorage.removeItem(`microbequest_progress:v2:${userId ? `user:${userId}` : 'guest'}`);
  } catch (e) {}

  if (!userId) return { error: null, deletedAt };

  const errors = [];

  try {
    const { error: scoresError } = await supabase
      ?.from('game_scores')
      ?.delete()
      ?.eq('user_id', userId);
    if (scoresError) errors?.push(scoresError);
  } catch (err) {
    errors?.push(err);
  }

  try {
    const { error: progressError } = await supabase
      ?.from('game_progress')
      ?.delete()
      ?.eq('user_id', userId);
    if (progressError) errors?.push(progressError);
  } catch (err) {
    errors?.push(err);
  }

  try {
    const { error: controlsError } = await supabase
      ?.from('parental_controls')
      ?.delete()
      ?.eq('user_id', userId);
    if (controlsError) errors?.push(controlsError);
  } catch (err) {
    errors?.push(err);
  }

  return { error: errors?.length > 0 ? errors : null, deletedAt };
};
