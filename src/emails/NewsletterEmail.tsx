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
      <a href="${actionPath.startsWith('http') ? actionPath : `https://makeitads.pro${actionPath}`}"
         style="display: inline-block; margin-top: 28px; padding: 14px 28px; background-color: #6366F1; color: #FFFFFF; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 700; font-family: Inter, -apple-system, sans-serif;">
        ${actionLabel} →
      </a>
    `
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC;">
  <div style="font-family: Inter, -apple-system, sans-serif; padding: 32px 16px;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 20px 40px rgba(15,23,42,0.06);">
      
      <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 28px 32px;">
        <div style="font-size: 22px; font-weight: 900; letter-spacing: -0.04em; color: #FFFFFF; font-family: Inter, -apple-system, sans-serif;">
          MakeItAds
        </div>
      </div>

      <div style="padding: 36px 32px;">
        <h1 style="margin: 0 0 16px; font-size: 26px; font-weight: 800; color: #0F172A; line-height: 1.25; letter-spacing: -0.02em; font-family: Inter, -apple-system, sans-serif;">
          ${title}
        </h1>
        <div style="font-size: 15px; line-height: 1.7; color: #475569; font-family: Inter, -apple-system, sans-serif;">
          ${formattedMessage}
        </div>
        ${buttonHtml}
      </div>

      <div style="padding: 20px 32px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; text-align: center; line-height: 1.6; font-family: Inter, -apple-system, sans-serif;">
        Vous recevez cet email car vous êtes inscrit ou avez manifesté un intérêt pour MakeItAds.<br />
        <a href="https://makeitads.pro" style="color: #8B5CF6; text-decoration: none; font-weight: 600;">makeitads.pro</a>
      </div>

    </div>
  </div>
</body>
</html>
  `;
}