import type Stripe from 'stripe';
import { getRequiredEnv } from './env';

let stripeClient: Stripe | null = null;

export async function getStripeClient(): Promise<Stripe> {
  if (stripeClient) {
    return stripeClient;
  }

  const stripeSecretKey = getRequiredEnv('STRIPE_SECRET_KEY');
  const StripeModule = await import('stripe');
  const StripeConstructor = (StripeModule.default ?? StripeModule) as typeof Stripe;

  stripeClient = new StripeConstructor(stripeSecretKey, {
    apiVersion: '2026-05-27.dahlia',
  });

  return stripeClient;
}

export function getStripeWebhookSecret() {
  return getRequiredEnv('STRIPE_WEBHOOK_SECRET');
}
