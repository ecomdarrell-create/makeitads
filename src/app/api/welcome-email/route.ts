import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }
    
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to MakeItAds! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #080810;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px; text-align: center;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #0f0f1a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                        <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold;">Welcome to MakeItAds! 🎉</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #e2e8f0; font-size: 16px;">Hi ${name},</p>
                        <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 16px; line-height: 1.6;">
                          Thanks for joining MakeItAds! We're excited to help you create data-driven marketing strategies that actually convert.
                        </p>
                        <h2 style="color: white; font-size: 20px; margin: 30px 0 20px 0;">🚀 What's next?</h2>
                        <ul style="color: #94a3b8; font-size: 16px; line-height: 1.8; padding-left: 20px; margin: 0 0 30px 0;">
                          <li>Generate your first AI-powered marketing strategy</li>
                          <li>Analyze your competitors in real-time</li>
                          <li>Track market trends and opportunities</li>
                          <li>Export professional PDF reports</li>
                        </ul>
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td style="border-radius: 12px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                              <a href="https://makeitads.pro/dashboard" style="display: inline-block; padding: 16px 32px; color: white; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 12px;">
                                Go to Dashboard →
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 30px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                          Need help? Reply to this email or contact us at support@makeitads.pro
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; background-color: rgba(255, 255, 255, 0.02); border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                        <p style="margin: 0; color: #64748b; font-size: 12px;">© 2026 MakeItAds Inc. All rights reserved.</p>
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
    
    if (result.success) {
      return NextResponse.json({ message: 'Welcome email sent!' });
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in welcome-email API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}