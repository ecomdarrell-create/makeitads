'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface Props {
  strategy: {
    title: string;
    type: string;
    platform: string | null;
    created_at: string;
    data: any;
  };
  userPlan: string;
  planLabel: string;
}

export function DownloadPDFButton({ strategy, userPlan, planLabel }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Import dynamique pour éviter SSR
      const [{ pdf }, { StrategyPDFDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./StrategyPDFDocument'),
      ]);

      const blob = await pdf(
        <StrategyPDFDocument
          strategy={strategy}
          userPlan={userPlan}
          planLabel={planLabel}
        />
      ).toBlob();

      // Générer un nom de fichier propre
      const safeTitle = strategy.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);

      const filename = `makeitads-${safeTitle}-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      // Télécharger
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Erreur generation PDF:', e);
      alert('Erreur lors de la génération du PDF. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#18181B] transition-colors hover:bg-slate-50 disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Génération
        </>
      ) : (
        <>
          <Download className="h-3 w-3" />
          Télécharger PDF
        </>
      )}
    </button>
  );
}