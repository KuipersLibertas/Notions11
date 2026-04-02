import { redirect } from 'next/navigation';

// After Stripe checkout, the user is redirected here.
// The actual pro activation is handled by the Stripe webhook at /api/webhooks/stripe.
// We just send them to the home page; the session will refresh on next load.
export async function GET() {
  redirect('/');
}
