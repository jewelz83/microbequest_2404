-- Subscriptions table for Stripe premium plans
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_session_id TEXT,
    stripe_subscription_id TEXT,
    plan_type TEXT NOT NULL, -- 'monthly' | 'annual' | 'classroom'
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    payment_status TEXT DEFAULT 'pending', -- 'pending' | 'succeeded' | 'failed' | 'cancelled'
    subscription_status TEXT DEFAULT 'inactive', -- 'active' | 'inactive' | 'cancelled'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_session_id ON public.subscriptions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_subscriptions" ON public.subscriptions;
CREATE POLICY "users_manage_own_subscriptions"
ON public.subscriptions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
