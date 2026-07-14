import { Resend } from 'resend';

let resendClient: Resend | null = null;

/**
 * Get or create Resend client instance
 * Uses singleton pattern to avoid recreating the client
 */
export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    
    resendClient = new Resend(apiKey);
  }
  
  return resendClient;
}

/**
 * Send email helper function
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = 'MakeItAds <onboarding@makeitads.pro>',
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const resend = getResendClient();
    
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    
    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error(' Error sending email:', error);
    return { success: false, error };
  }
}