-- COPPA Compliance Enhancement Migration
-- Adds verifiable parental consent fields, consent audit trail, and deletion log

-- ─── Add COPPA consent fields to parental_controls ───────────────────────────

ALTER TABLE public.parental_controls
  ADD COLUMN IF NOT EXISTS parent_email TEXT,
  ADD COLUMN IF NOT EXISTS consent_granted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_withdrawn_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_version TEXT DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS consent_ip_hash TEXT,
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pin_set BOOLEAN DEFAULT false;

-- ─── Consent Audit Log Table ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.consent_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'consent_granted' | 'consent_withdrawn' | 'data_deleted' | 'data_exported' | 'pin_set'
    consent_type TEXT,    -- 'analytics' | 'personalization' | 'progress_tracking' | 'all'
    parent_email TEXT,
    consent_version TEXT DEFAULT '1.0',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consent_audit_log_user_id ON public.consent_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_audit_log_action ON public.consent_audit_log(action);

ALTER TABLE public.consent_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_consent_log" ON public.consent_audit_log;
CREATE POLICY "users_manage_own_consent_log"
ON public.consent_audit_log
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ─── Data Retention Enforcement Function ─────────────────────────────────────
-- This function can be called by a scheduled job (pg_cron) to enforce retention

CREATE OR REPLACE FUNCTION public.enforce_data_retention()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete game scores older than the user's retention period
    DELETE FROM public.game_scores gs
    USING public.parental_controls pc
    WHERE gs.user_id = pc.user_id
      AND pc.data_retention_days IS NOT NULL
      AND gs.played_at < (CURRENT_TIMESTAMP - (pc.data_retention_days || ' days')::INTERVAL);

    -- Mark users as needing deletion notification when last_active_at is near retention limit
    UPDATE public.parental_controls
    SET deletion_requested_at = CURRENT_TIMESTAMP
    WHERE last_active_at IS NOT NULL
      AND data_retention_days IS NOT NULL
      AND last_active_at < (CURRENT_TIMESTAMP - (data_retention_days || ' days')::INTERVAL)
      AND deletion_requested_at IS NULL;
END;
$$;
