import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeClient, getStripeWebhookSecret } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { sendPaymentConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  const stripe = await getStripeClient();
  const webhookSecret = getStripeWebhookSecret();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planName = session.metadata?.planName;
      const billingCycle = session.metadata?.billingCycle || 'monthly';

      if (!userId || !planName) {
        console.error('❌ Missing metadata in session');
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          plan_type: planName.toLowerCase(),
          billing_cycle: billingCycle,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error updating profile:', updateError);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
      }

      console.log(`✅ User ${userId} upgraded to ${planName} (${billingCycle})`);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = (invoice as any).subscription as string || '';

      if (!subscriptionId) {
        console.log('⚠️ No subscription ID on invoice, skipping');
        break;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, plan_type')
        .eq('stripe_subscription_id', subscriptionId)
        .single();

      if (profileError || !profile) {
        console.error('❌ Profile not found for subscription:', subscriptionId);
        break;
      }

      const amount = (invoice.amount_paid || 0) / 100;
      const planName = profile.plan_type || 'Pro';

      try {
        await sendPaymentConfirmationEmail(
          profile.email,
          profile.full_name || 'there',
          planName,
          amount
        );
        console.log(`✅ Payment confirmation email sent to ${profile.email}`);
      } catch (emailError) {
        console.error('❌ Error sending payment email:', emailError);
      }

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            subscription_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        console.log(`✅ Subscription ${subscription.id} updated to ${status}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            plan_type: 'free',
            billing_cycle: null,
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        console.log(`✅ Subscription ${subscription.id} canceled, user downgraded to Free`);
      }
      break;
    }

    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}