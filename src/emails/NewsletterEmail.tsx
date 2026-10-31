interface NewsletterHtmlProps {
  title: string;
  message: string;
  actionLabel?: string | null;
  actionPath?: string | null;
}

export function renderNewsletterHtml({ title, message, actionLabel, actionPath }: NewsletterHtmlProps): string {
  const formattedMessage = message.replace(/\n/g, '<br />');

  const buttonHtml = (actionLabel && actionPath)
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 32px 0 0;">
        <tr>
          <td style="border-radius: 999px; background-color: #6366F1;">
            <a href="${actionPath.startsWith('http') ? actionPath : `https://makeitads.pro${actionPath}`}"
               style="display: inline-block; padding: 14px 32px; color: #FFFFFF; text-decoration: none; border-radius: 999px; font-size: 15px; font-weight: 600; font-family: 'Inter', -apple-system, sans-serif; letter-spacing: -0.01em;">
              ${actionLabel}
            </a>
          </td>
        </tr>
      </table>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFBFC; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFBFC; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto;">
          
          <!-- Logo Officiel -->
          <tr>
            <td style="padding-bottom: 32px; text-align: center;">
              <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 900; font-size: 26px; letter-spacing: -0.04em; line-height: 1;">
                <span style="color: #0F172A;">MakeIt</span><span style="color: #8B5CF6;">Ads</span>
              </div>
            </td>
          </tr>

          <!-- Carte Principale -->
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5E7EB; overflow: hidden; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.04);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 48px 40px;">
                    
                    <!-- Titre -->
                    <h1 style="margin: 0 0 16px; font-family: 'Inter', -apple-system, sans-serif; font-size: 28px; font-weight: 700; line-height: 1.25; letter-spacing: -0.02em; color: #0F172A;">
                      ${title}
                    </h1>

                    <!-- Ligne d'accentuation -->
                    <div style="height: 2px; background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%); width: 40px; margin: 0 0 24px;"></div>

                    <!-- Message -->
                    <div style="font-family: 'Inter', -apple-system, sans-serif; font-size: 16px; line-height: 1.65; color: #475569; letter-spacing: -0.005em;">
                      ${formattedMessage}
                    </div>

                    ${buttonHtml}

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 40px; text-align: center;">
              <p style="margin: 0 0 8px; font-family: 'Inter', -apple-system, sans-serif; font-size: 13px; line-height: 1.6; color: #94A3B8;">
                Vous recevez cet email car vous êtes inscrit sur MakeItAds.
              </p>
              <p style="margin: 0; font-family: 'Inter', -apple-system, sans-serif; font-size: 13px; line-height: 1.6; color: #94A3B8;">
                © ${new Date().getFullYear()} MakeItAds · <a href="https://makeitads.pro" style="color: #6366F1; text-decoration: none; font-weight: 600;">makeitads.pro</a>
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