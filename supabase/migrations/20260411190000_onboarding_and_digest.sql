-- Add onboarding tracking to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add digest preferences and tracking to parental_controls
ALTER TABLE public.parental_controls
ADD COLUMN IF NOT EXISTS digest_frequency TEXT DEFAULT 'weekly'; -- 'weekly' | 'monthly' | 'disabled'

ALTER TABLE public.parental_controls
ADD COLUMN IF NOT EXISTS last_digest_sent TIMESTAMPTZ;

-- Index for digest scheduling queries
CREATE INDEX IF NOT EXISTS idx_parental_controls_digest
ON public.parental_controls(digest_frequency, last_digest_sent)
WHERE digest_frequency != 'disabled';
