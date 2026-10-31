import * as React from 'react';

interface Props {
  firstName: string;
  phone: string;
  email: string | null;
  plan?: string;
}

export function AdminInvitationEmail({
  firstName,
  phone,
  email,
  plan = 'free',
}: Props) {
  const phoneDigits = phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    `Bonjour ${firstName}, voici votre invitation au cercle privé MakeItAds : https://t.me/makeitadsbusinessclub`
  )}`;
  const submittedAt = new Date().toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

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
          maxWidth: 560,
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 40px rgba(15,23,42,0.06)',
        }}
      >
        {/* Header gradient */}
        <div
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
            }}
          >
            MakeItAds
          </div>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 11,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Nouvelle demande d'invitation
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '32px' }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              color: '#94A3B8',
              textAlign: 'center',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            {submittedAt}
          </p>

          <h1
            style={{
              margin: '16px 0 8px',
              fontSize: 28,
              fontWeight: 800,
              color: '#0F172A',
              textAlign: 'center',
              letterSpacing: '-0.02em',
            }}
          >
            {firstName}
          </h1>

          <p
            style={{
              margin: '0 0 28px',
              fontSize: 14,
              color: '#64748B',
              textAlign: 'center',
            }}
          >
            souhaite rejoindre le cercle privé MakeItAds
          </p>

          {/* Info cards */}
          <table
            style={{
              width: '100%',
              backgroundColor: '#F8FAFC',
              borderRadius: 12,
              marginBottom: 24,
            }}
            cellPadding={0}
            cellSpacing={0}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '14px 16px',
                    fontSize: 12,
                    color: '#64748B',
                    fontWeight: 600,
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  📱 Numéro WhatsApp
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    fontSize: 14,
                    color: '#0F172A',
                    fontWeight: 700,
                    textAlign: 'right',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  {phone}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '14px 16px',
                    fontSize: 12,
                    color: '#64748B',
                    fontWeight: 600,
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  ✉️ Email
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    fontSize: 14,
                    color: '#0F172A',
                    fontWeight: 700,
                    textAlign: 'right',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  {email || 'Non renseigné'}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '14px 16px',
                    fontSize: 12,
                    color: '#64748B',
                    fontWeight: 600,
                  }}
                >
                  👑 Plan actuel
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    fontSize: 14,
                    color: '#0F172A',
                    fontWeight: 700,
                    textAlign: 'right',
                    textTransform: 'capitalize',
                  }}
                >
                  {plan}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Bouton WhatsApp direct */}
          <a
            href={whatsappUrl}
            style={{
              display: 'block',
              padding: '16px 24px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            💬 Contacter sur WhatsApp
          </a>

          <a
            href={`tel:${phone}`}
            style={{
              display: 'block',
              padding: '12px 24px',
              backgroundColor: '#F1F5F9',
              color: '#0F172A',
              textDecoration: 'none',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            📞 Appeler directement
          </a>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px 32px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            fontSize: 11,
            color: '#94A3B8',
            textAlign: 'center',
          }}
        >
          Envoyé depuis MakeItAds · makeitads.pro
        </div>
      </div>
    </div>
  );
}