import { supabase } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';
import { formatUser } from '@/lib/db/auth';

// SECURITY (L2): keep the price ID in an env var rather than hardcoding it,
// so it isn't exposed if the repository ever becomes public.
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID ?? 'price_1MaIQlIiPwNsdugo6TOqqoWk';
const SITE_URL = process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL ?? 'https://notions11.com';

// Returns true if a Stripe subscription should be treated as active.
// Trialing with cancel_at_period_end=false counts as active (trial still running).
function isSubscriptionActive(sub: { status: string; cancel_at_period_end: boolean }): boolean {
  return ['active', 'trialing'].includes(sub.status) && !sub.cancel_at_period_end;
}

// Check whether the user's Stripe subscription is still active.
// Used at login so the session always reflects the real state.
// Returns the corrected is_pro value (0 or 1).
export async function checkAndSyncProStatus(userId: number, stripeId: string | null, subscriptionId: string | null, currentIsPro: number): Promise<number> {
  if (!stripeId || !subscriptionId) return currentIsPro;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const active = isSubscriptionActive(subscription);
    console.log(`checkAndSyncProStatus userId=${userId} status=${subscription.status} cancel_at_period_end=${subscription.cancel_at_period_end} active=${active}`);

    if (!active && currentIsPro === 1) {
      // Subscription ended — downgrade in DB (keep stripe_id/subscription_id)
      await supabase.from('users').update({ is_pro: 0 }).eq('id', userId);
      return 0;
    }
  } catch (err: any) {
    console.error(`checkAndSyncProStatus Stripe error userId=${userId}:`, err.message);
    // Stripe couldn't find the subscription — fail open (keep current DB value)
  }

  return currentIsPro;
}

export async function getSubscription(userId: number) {
  const { data: user } = await supabase
    .from('users')
    .select('stripe_id')
    .eq('id', userId)
    .single();

  if (!user?.stripe_id) {
    return { success: false as const, message: 'No active subscription found' };
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_id,
      return_url: `${SITE_URL}/api/auth/session-refresh?sync=1&callbackUrl=/user/plan`,
    });
    return { success: true as const, url: portalSession.url };
  } catch (error: any) {
    if (error?.statusCode === 404 || error?.code === 'resource_missing') {
      // Stale customer ID — just clear it so they can resubscribe
      await supabase.from('users').update({ stripe_id: null, subscription_id: null }).eq('id', userId);
      return { success: false as const, message: 'Subscription record not found in Stripe. Please subscribe again.' };
    }
    throw error;
  }
}

export async function upgradePro(userId: number) {
  const { data: user } = await supabase
    .from('users')
    .select('stripe_id')
    .eq('id', userId)
    .single();

  const checkoutParams: Record<string, any> = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${SITE_URL}/user/upgrade-pro/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/prosignup`,
    subscription_data: {
      trial_period_days: 15,
      metadata: { user_id: String(userId) },
    },
    metadata: { user_id: String(userId) },
  };

  const stripeId = user?.stripe_id && user.stripe_id !== 'null' ? user.stripe_id : null;
  if (stripeId) {
    checkoutParams.customer = stripeId;
  }

  const session = await stripe.checkout.sessions.create(checkoutParams as any);
  return { success: true as const, url: session.url };
}

// Called when the user returns from the Stripe Customer Portal.
// Lists all subscriptions for the customer and sets is_pro=0 if none
// are active. Stripe IDs are preserved — they identify the customer
// for future re-subscriptions and status checks.
export async function syncSubscription(userId: number) {
  const { data: dbUser, error: dbErr } = await supabase
    .from('users')
    .select('stripe_id, subscription_id, is_pro')
    .eq('id', userId)
    .single();

  console.log(`syncSubscription START userId=${userId} dbUser=${JSON.stringify(dbUser)} dbErr=${dbErr?.message}`);

  if (dbUser?.stripe_id) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: dbUser.stripe_id,
        limit: 10,
      });

      console.log(`syncSubscription Stripe returned ${subscriptions.data.length} subscription(s)`);
      subscriptions.data.forEach((sub, i) => {
        console.log(`  [${i}] id=${sub.id} status=${sub.status} cancel_at_period_end=${sub.cancel_at_period_end}`);
      });

      const hasActive = subscriptions.data.some(isSubscriptionActive);
      console.log(`syncSubscription hasActive=${hasActive} currentIsPro=${dbUser.is_pro}`);

      if (!hasActive) {
        // Only update is_pro — keep stripe_id and subscription_id
        const { error: updateErr } = await supabase
          .from('users')
          .update({ is_pro: 0 })
          .eq('id', userId);
        console.log(`syncSubscription users update error=${updateErr?.message ?? 'none'}`);

        await supabase
          .from('file_list_user')
          .update({ email_notify: false, track_ip: false, is_paid: null, expires_on: null, expire_count: 0 })
          .eq('user_id', userId);
      }
    } catch (err: any) {
      console.error(`syncSubscription Stripe error userId=${userId}:`, err.message);
    }
  } else {
    console.log(`syncSubscription skipped — no stripe_id in DB for userId=${userId}`);
  }

  const { data: fresh } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  console.log(`syncSubscription END userId=${userId} fresh.is_pro=${fresh?.is_pro}`);
  return fresh ? formatUser(fresh) : null;
}

export async function cancelPro(userId: number) {
  // Only clear is_pro — keep stripe_id and subscription_id
  await supabase.from('users').update({ is_pro: 0 }).eq('id', userId);

  await supabase
    .from('file_list_user')
    .update({ email_notify: false, track_ip: false, is_paid: null, expires_on: null, expire_count: 0 })
    .eq('user_id', userId);

  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  return { success: true as const, user: user ? formatUser(user) : null };
}

export async function uploadLogo(userId: number, fileBuffer: Buffer, mimeType: string) {
  const ext = mimeType.split('/')[1] ?? 'png';
  const storagePath = `${userId}/logo.${ext}`;

  const { error } = await supabase.storage
    .from('logos')
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: true });

  if (error) return { success: false as const, message: error.message };

  const { data: urlData } = supabase.storage.from('logos').getPublicUrl(storagePath);
  const publicUrl = urlData.publicUrl;

  await supabase.from('users').update({ logo: publicUrl }).eq('id', userId);
  return { success: true as const, file: publicUrl };
}

export async function deleteLogo(userId: number) {
  const { data: user } = await supabase
    .from('users')
    .select('logo')
    .eq('id', userId)
    .single();

  if (user?.logo) {
    const match = user.logo.match(/logos\/(.+)$/);
    if (match) {
      await supabase.storage.from('logos').remove([match[1]]);
    }
  }

  await supabase.from('users').update({ logo: null }).eq('id', userId);
  return { success: true as const };
}

export async function activatePro(userId: number, stripeId: string, subscriptionId: string) {
  await supabase
    .from('users')
    .update({ is_pro: 1, stripe_id: stripeId, subscription_id: subscriptionId })
    .eq('id', userId);

  await supabase.from('paid_membership').insert({
    user_id: userId,
    type: 2,
    amount: 5,
    status: 1,
  });
}

// Called by the Stripe webhook (customer.subscription.deleted / updated).
// Only sets is_pro=0 — Stripe IDs are preserved for future re-subscriptions.
export async function deactivatePro(stripeCustomerId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_id', stripeCustomerId)
    .maybeSingle();

  if (!user) return;

  await supabase.from('users').update({ is_pro: 0 }).eq('id', user.id);

  await supabase
    .from('file_list_user')
    .update({ email_notify: false, track_ip: false, is_paid: null, expires_on: null, expire_count: 0 })
    .eq('user_id', user.id);
}
