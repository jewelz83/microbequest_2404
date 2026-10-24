import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PLANS: Record<string, { priceId: string; amount: number; name: string; interval: string }> = {
  monthly:   { priceId: 'price_1TP5lO0JbGAg5yQ8iOsqbErj', amount: 199,  name: 'MicrobeQuest Scientist — Monthly',        interval: 'month' },
  annual:    { priceId: 'price_1TP5m40JbGAg5yQ8aNmv4ZDr', amount: 1499, name: 'MicrobeQuest Scientist — Annual',          interval: 'year'  },
  classroom: { priceId: 'price_1TP5mt0JbGAg5yQ8wrKXNPm1', amount: 7900, name: 'MicrobeQuest Classroom License',           interval: 'year'  },
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planType, userId, userEmail, couponCode, successUrl, cancelUrl } = await req.json()

    const plan = PLANS[planType]
    if (!plan) {
      return new Response(JSON.stringify({ error: 'Invalid plan type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId: string | undefined

    if (userId) {
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .not('stripe_customer_id', 'is', null)
        .limit(1)
        .maybeSingle()

      if (existingSub?.stripe_customer_id) {
        stripeCustomerId = existingSub.stripe_customer_id
      }
    }

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail || undefined,
        metadata: { userId: userId || 'guest' },
      })
      stripeCustomerId = customer.id
    }

    // Build session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${Deno.env.get('SITE_URL') || 'https://microbeque6490.builtwithrocket.new'}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${Deno.env.get('SITE_URL') || 'https://microbeque6490.builtwithrocket.new'}/premium?cancelled=true`,
      metadata: {
        userId: userId || 'guest',
        planType,
      },
    }

    // Apply coupon if provided
    if (couponCode && couponCode.trim()) {
      sessionParams.discounts = [{ coupon: couponCode.trim() }]
    } else {
      sessionParams.allow_promotion_codes = true
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionParams)

    // Save pending subscription record
    if (userId) {
      await supabase.from('subscriptions').insert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_session_id: session.id,
        plan_type: planType,
        amount: plan.amount / 100,
        currency: 'usd',
        payment_status: 'pending',
        subscription_status: 'inactive',
      })
    }

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Checkout session error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Failed to create checkout session' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
