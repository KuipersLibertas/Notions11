import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { activatePro, deactivatePro } from '@/lib/db/user';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook signature or secret' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    console.error('Stripe webhook signature verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Stripe webhook received: ${event.type} (id: ${event.id})`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.user_id
          ? parseInt(session.metadata.user_id, 10)
          : null;
        const stripeCustomerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        console.log(`checkout.session.completed — userId=${userId} customerId=${stripeCustomerId} subscriptionId=${subscriptionId}`);

        if (userId && stripeCustomerId && subscriptionId) {
          await activatePro(userId, stripeCustomerId, subscriptionId);
          console.log(`activatePro succeeded for userId=${userId}`);
        } else {
          console.warn('checkout.session.completed: missing required fields, skipping activation');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        console.log(`customer.subscription.deleted — customerId=${customerId}`);
        await deactivatePro(customerId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error('Webhook handler error:', error.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
