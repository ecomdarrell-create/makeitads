import * as React from 'react';

interface Props {
  firstName: string;
  title: string;
  message: string;
  actionLabel?: string | null;
  actionPath?: string;
  category?: string;
}

const ICONS: Record<string, string> = {
  welcome: '✨',
  credits: '🎁',
  feature: '🚀',
  account: '🔒',
  system: '⚠️',
};

export function NotificationEmail({
  firstName,
  title,
  message,
  actionLabel,
  actionPath,
  category = 'system',
}: Props) {
  return (
    <div
      style={{
        fontFamily: 'Inter, -apple-system, sans-serif',
        backgroundColor: '#F8FAFC',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
      >
        <div style={{ padding: '28px 32px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em' }}>
            <span style={{ color: '#0F172A' }}>MakeIt</span>
            <span style={{ color: '#8B5CF6' }}>Ads</span>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>
            {ICONS[category] || '🔔'}
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
            Bonjour {firstName},
          </p>
          <h1
            style={{
              margin: '8px 0 16px',
              fontSize: 22,
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#475569' }}>
            {message}
          </p>

          {actionLabel && actionPath && (
            <a
              href={actionPath}
              style={{
                display: 'inline-block',
                marginTop: 24,
                padding: '12px 24px',
                backgroundColor: '#6366F1',
                color: '#FFFFFF',
                textDecoration: 'none',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {actionLabel}
            </a>
          )}
        </div>

        <div
          style={{
            padding: '24px 32px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #F1F5F9',
            fontSize: 12,
            color: '#94A3B8',
            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} MakeItAds ·{' '}
          <a
            href="https://makeitads.pro"
            style={{ color: '#8B5CF6', textDecoration: 'none' }}
          >
            makeitads.pro
          </a>
        </div>
      </div>
    </div>
  );
}