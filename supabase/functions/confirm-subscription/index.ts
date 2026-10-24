import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno?.env?.get('SUPABASE_URL') ?? '',
  Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno?.serve(async (req) => {
  if (req?.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId, userId } = await req?.json()

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Retrieve session from Stripe
    const session = await stripe?.checkout?.sessions?.retrieve(sessionId)

    const paymentStatus = session?.payment_status === 'paid' ? 'succeeded' : 'pending'
    const subscriptionStatus = session?.payment_status === 'paid' ? 'active' : 'inactive'

    // Update subscription record
    if (userId) {
      await supabase?.from('subscriptions')?.update({
          payment_status: paymentStatus,
          subscription_status: subscriptionStatus,
          current_period_start: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString(),
        })?.eq('stripe_session_id', sessionId)?.eq('user_id', userId)
    }

    return new Response(
      JSON.stringify({
        success: session.payment_status === 'paid',
        paymentStatus,
        subscriptionStatus,
        planType: session.metadata?.planType,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Confirm subscription error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Failed to confirm subscription' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
