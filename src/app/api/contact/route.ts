import { NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const resend = getResendClient();
    const { name, email, company, phone, teamSize, message } = await req.json();

    // Validation
    if (!name || !email || !company || !teamSize || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Envoyer l'email à l'équipe MakeItAds
    await resend.emails.send({
      from: 'MakeItAds <onboarding@resend.dev>',
      to: 'darrellkamga@gmail.com', // Remplace par ton email
      subject: `🔥 New Enterprise Lead: ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #080810;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #0f0f1a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);">
                        <h1 style="margin: 0; color: white; font-size: 28px;">🔥 New Enterprise Lead</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                              <strong style="color: #94a3b8;">Name:</strong>
                              <span style="color: white; float: right;">${name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                              <strong style="color: #94a3b8;">Email:</strong>
                              <span style="color: white; float: right;">${email}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                              <strong style="color: #94a3b8;">Company:</strong>
                              <span style="color: white; float: right;">${company}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                              <strong style="color: #94a3b8;">Phone:</strong>
                              <span style="color: white; float: right;">${phone || 'Not provided'}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                              <strong style="color: #94a3b8;">Team Size:</strong>
                              <span style="color: white; float: right;">${teamSize}</span>
                            </td>
                          </tr>
                        </table>
                        
                        <h2 style="color: white; font-size: 18px; margin: 30px 0 15px 0;">Message:</h2>
                        <p style="color: #94a3b8; line-height: 1.6; background-color: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                          ${message}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    // Envoyer un email de confirmation au prospect
    await resend.emails.send({
      from: 'MakeItAds <onboarding@resend.dev>',
      to: email,
      subject: 'We received your message! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #080810;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #0f0f1a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                        <h1 style="margin: 0; color: white; font-size: 28px;">Thank you, ${name}! 🎉</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          We've received your message and our team will get back to you within 24 hours.
                        </p>
                        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                          In the meantime, feel free to explore our platform and see how MakeItAds can help ${company} grow.
                        </p>
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td style="border-radius: 12px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                              <a href="https://makeitads.pro" style="display: inline-block; padding: 16px 32px; color: white; text-decoration: none; font-weight: bold; border-radius: 12px;">
                                Explore MakeItAds
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}