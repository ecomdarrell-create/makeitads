import { getResendClient } from './resend';

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: 'MakeItAds <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Welcome to MakeItAds! 🚀',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                        <p style="margin: 0 0 20px 0; color: #e2e8f0; font-size: 16px;">Hi ${userName},</p>
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
                              <a href="https://makeitads.com/dashboard" style="display: inline-block; padding: 16px 32px; color: white; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 12px;">
                                Go to Dashboard →
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 30px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                          Need help? Reply to this email or check our documentation.
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
    console.log('✅ Welcome email sent to', userEmail);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
}

export async function sendPaymentConfirmationEmail(
  userEmail: string,
  userName: string,
  planName: string,
  amount: number
) {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: 'MakeItAds <onboarding@resend.dev>',
      to: [userEmail],
      subject: `Payment Confirmed - ${planName} Plan `,
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
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #34d399 100%);">
                        <h1 style="margin: 0; color: white; font-size: 28px;">Payment Successful! ✅</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #e2e8f0; font-size: 16px; margin: 0 0 20px 0;">Hi ${userName},</p>
                        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                          Your payment has been processed successfully. You now have access to the <strong style="color: white;">${planName}</strong> plan!
                        </p>
                        <table role="presentation" style="width: 100%; background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; margin: 20px 0;">
                          <tr>
                            <td style="color: #94a3b8; font-size: 14px;">Plan</td>
                            <td style="color: white; font-size: 14px; text-align: right; font-weight: bold;">${planName}</td>
                          </tr>
                          <tr>
                            <td style="color: #94a3b8; font-size: 14px; padding-top: 10px;">Amount</td>
                            <td style="color: white; font-size: 14px; text-align: right; font-weight: bold;">$${amount}/month</td>
                          </tr>
                          <tr>
                            <td style="color: #94a3b8; font-size: 14px; padding-top: 10px;">Status</td>
                            <td style="color: #10b981; font-size: 14px; text-align: right; font-weight: bold;">Active ✓</td>
                          </tr>
                        </table>
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td style="border-radius: 12px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                              <a href="https://makeitads.com/dashboard/billing" style="display: inline-block; padding: 14px 28px; color: white; text-decoration: none; font-weight: bold; border-radius: 12px;">
                                View Billing Details
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                          Questions? Contact us at support@makeitads.com
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
    console.log('✅ Payment confirmation email sent to', userEmail);
  } catch (error) {
    console.error(' Error sending payment email:', error);
    throw error;
  }
}

// ======================================================
// ✅ NOUVEAU: EMAIL NOTIFICATION STRATÉGIE PRÊTE
// ======================================================

export async function sendStrategyReadyEmail({
  to,
  userName,
  strategyName,
  strategyId,
}: {
  to: string;
  userName: string;
  strategyName: string;
  strategyId: string;
}) {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: 'MakeItAds <onboarding@resend.dev>',
      to: [to],
      subject: `🎉 Your strategy "${strategyName}" is ready!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #080810;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px; text-align: center;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #0f0f1a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">🎉 Your Strategy is Ready!</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #e2e8f0; font-size: 16px;">Hi ${userName},</p>
                        <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 16px; line-height: 1.6;">
                          Great news! Your marketing strategy <strong style="color: white;">"${strategyName}"</strong> has been generated and is ready to view.
                        </p>
                        
                        <table role="presentation" style="width: 100%; background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; margin: 20px 0;">
                          <tr>
                            <td style="color: #94a3b8; font-size: 14px;">Strategy Name</td>
                            <td style="color: white; font-size: 14px; text-align: right; font-weight: bold;">${strategyName}</td>
                          </tr>
                          <tr>
                            <td style="color: #94a3b8; font-size: 14px; padding-top: 10px;">Status</td>
                            <td style="color: #10b981; font-size: 14px; text-align: right; font-weight: bold;">Ready ✓</td>
                          </tr>
                        </table>
                        
                        <h2 style="color: white; font-size: 18px; margin: 30px 0 16px 0;">📊 What's included?</h2>
                        <ul style="color: #94a3b8; font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0 0 30px 0;">
                          <li>Complete market intelligence analysis</li>
                          <li>Competitor benchmarking & SWOT</li>
                          <li>Step-by-step execution roadmap</li>
                          <li>Budget allocation recommendations</li>
                          <li>Ad copy templates & creative angles</li>
                        </ul>
                        
                        <table role="presentation" style="margin: 30px 0; width: 100%;">
                          <tr>
                            <td style="border-radius: 12px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); text-align: center;">
                              <a href="https://makeitads.com/dashboard/strategy/${strategyId}" style="display: inline-block; padding: 16px 32px; color: white; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 12px;">
                                View Your Strategy →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                          Need help implementing your strategy? Reply to this email or check our documentation.
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
    console.log('✅ Strategy ready email sent to', to);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending strategy ready email:', error);
    return { success: false, error };
  }
}