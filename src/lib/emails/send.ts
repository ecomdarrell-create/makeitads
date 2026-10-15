import { Resend } from 'resend';

const FROM_EMAIL = 'MakeItAds <contact@makeitads.pro>';
const APP_URL = 'https://makeitads.pro';

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (resendClient) return resendClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY manquante');
  resendClient = new Resend(key);
  return resendClient;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  previewText?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  try {
    const resend = getResend();
    const html = renderTemplate(opts);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      html,
    });
    if (error) {
      console.error('[email] Erreur envoi:', error);
      return false;
    }
    console.log(`[email] ✅ Envoyé à ${opts.to} — sujet: ${opts.subject}`);
    return true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    console.error('[email] Exception:', msg);
    return false;
  }
}

function renderTemplate(opts: SendEmailOptions): string {
  const preview = opts.previewText ?? opts.title;
  const ctaBlock = opts.ctaLabel && opts.ctaUrl
    ? `
      <tr>
        <td style="padding: 8px 40px 32px 40px;" align="center">
          <a href="${opts.ctaUrl}"
             style="display: inline-block; padding: 12px 28px;
                    background-color: #6366F1; color: #ffffff;
                    text-decoration: none; border-radius: 999px;
                    font-weight: 600; font-size: 14px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${opts.ctaLabel}
          </a>
        </td>
      </tr>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
  
  <div style="display: none; max-height: 0; overflow: hidden;">${escapeHtml(preview)}</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
         style="background-color: #F9FAFB; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width: 560px; background-color: #ffffff;
                      border-radius: 16px; border: 1px solid #E5E7EB;
                      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);">
          
          <tr>
            <td style="padding: 32px 40px 16px 40px;">
              <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.02em;">
                MakeIt<span style="color: #6366F1;">Ads</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 8px 40px 0 40px;">
              <h1 style="margin: 0; font-size: 22px; line-height: 1.3; font-weight: 600; color: #111827;">
                ${escapeHtml(opts.title)}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 16px 40px 24px 40px; font-size: 14px; line-height: 1.6; color: #4B5563;">
              ${opts.bodyHtml}
            </td>
          </tr>

          ${ctaBlock}

          <tr>
            <td style="padding: 0 40px 32px 40px; border-top: 1px solid #F3F4F6; padding-top: 20px;">
              <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #9CA3AF;">
                Vous recevez cet email car vous avez un compte MakeItAds.
                Besoin d'aide ? <a href="mailto:support@makeitads.pro"
                                   style="color: #6366F1; text-decoration: none;">support@makeitads.pro</a>
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #9CA3AF;">
                © ${new Date().getFullYear()} MakeItAds — La plateforme N°1 pour automatiser votre acquisition client en Afrique.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}