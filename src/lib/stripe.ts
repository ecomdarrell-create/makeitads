import Stripe from 'stripe';
import { getRequiredEnv } from './env';

export function getStripeClient() {
  return new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'), {
    apiVersion: '2026-05-27.dahlia',
  });
}

export function getStripeWebhookSecret() {
  return getRequiredEnv('STRIPE_WEBHOOK_SECRET');
}
