-- Parental Controls Settings Migration
-- Module: parental_controls

-- ─── Parental Controls Table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.parental_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    -- Screen Time
    daily_time_limit_minutes INTEGER DEFAULT 60,
    session_time_limit_minutes INTEGER DEFAULT 30,
    screen_time_enabled BOOLEAN DEFAULT true,
    allowed_days JSONB DEFAULT '["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]'::jsonb,
    allowed_start_time TEXT DEFAULT '08:00',
    allowed_end_time TEXT DEFAULT '20:00',
    -- Content Filters
    max_difficulty_level TEXT DEFAULT 'medium',
    allowed_game_modes JSONB DEFAULT '["matching","quiz","explorer","lab","timeline","detective","tower_defense"]'::jsonb,
    educational_content_only BOOLEAN DEFAULT false,
    -- Data Collection Preferences (COPPA/GDPR-K compliance)
    analytics_consent BOOLEAN DEFAULT false,
    personalization_consent BOOLEAN DEFAULT false,
    progress_tracking_consent BOOLEAN DEFAULT true,
    data_retention_days INTEGER DEFAULT 90,
    -- Metadata
    pin_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_parental_controls_user_id ON public.parental_controls(user_id);

-- ─── Enable RLS ───────────────────────────────────────────────────────────────

ALTER TABLE public.parental_controls ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "users_manage_own_parental_controls" ON public.parental_controls;
CREATE POLICY "users_manage_own_parental_controls"
ON public.parental_controls
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow public (unauthenticated) read for preview mode
DROP POLICY IF EXISTS "public_read_parental_controls" ON public.parental_controls;
CREATE POLICY "public_read_parental_controls"
ON public.parental_controls
FOR SELECT
TO public
USING (true);

-- ─── Updated At Trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_parental_controls_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_parental_controls_updated_at ON public.parental_controls;
CREATE TRIGGER set_parental_controls_updated_at
    BEFORE UPDATE ON public.parental_controls
    FOR EACH ROW
    EXECUTE FUNCTION public.update_parental_controls_updated_at();
