import { Resend } from 'resend';
import { getRequiredEnv } from './env';

let resendClient: Resend | undefined;

export function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(getRequiredEnv('RESEND_API_KEY'));
  }

  return resendClient;
}
