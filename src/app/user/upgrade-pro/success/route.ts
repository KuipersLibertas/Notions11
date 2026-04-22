import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { activatePro } from '@/lib/db/user';

// After Stripe checkout, the user lands here with ?session_id=cs_xxx.
// The webhook at /api/webhooks/stripe is the primary activation path,
// but this page also activates Pro as a reliable fallback in case the
// webhook hasn't fired yet or experienced a delivery failure.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const userId = session.metadata?.user_id
        ? parseInt(session.metadata.user_id, 10)
        : null;
      const stripeCustomerId = session.customer as string | null;
      const subscriptionId = session.subscription as string | null;

      if (userId && stripeCustomerId && subscriptionId) {
        // Check if already activated (idempotency — webhook may have fired first)
        const { data: user } = await supabase
          .from('users')
          .select('is_pro')
          .eq('id', userId)
          .single();

        if (user && user.is_pro !== 1) {
          await activatePro(userId, stripeCustomerId, subscriptionId);
        }
      }
    } catch (err: any) {
      console.error('upgrade-pro success activation error:', err.message);
    }
  }

  redirect('/user/plan?upgraded=1');
}
