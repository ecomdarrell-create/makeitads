"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";

// ✅ DONNÉES INTÉGRÉES DIRECTEMENT POUR ÉVITER TOUTE ERREUR D'IMPORTATION
interface FaqQuestion {
  q: string;
  a: string;
}

interface FaqCategory {
  category: string;
  questions: FaqQuestion[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    category: "MakeItAds",
    questions: [
      { 
        q: "Qu'est-ce qu'une stratégie MakeItAds ?", 
        a: "C'est un plan d'action publicitaire complet et personnalisé, généré par IA, incluant le ciblage, les textes, les idées de visuels et la structure de campagne, calibré pour le marché africain." 
      },
      { 
        q: "Pourquoi MakeItAds est-il différent des autres outils IA ?", 
        a: "Nous ne générons pas de texte générique. Notre moteur est entraîné sur les réalités locales (FCFA, Mobile Money, comportements d'achat spécifiques) et produit un plan d'exécution, pas juste des idées." 
      },
    ]
  },
  {
    category: "Crédits & Paiement",
    questions: [
      { 
        q: "Combien de crédits consomme une stratégie ?", 
        a: "Exactement 1 crédit par stratégie générée avec succès." 
      },
      { 
        q: "Quand mon crédit est-il déduit ?", 
        a: "Uniquement après que la génération est terminée et que la stratégie est sauvegardée dans votre compte. En cas d'erreur technique, le crédit n'est pas débité." 
      },
      { 
        q: "Comment acheter des crédits ?", 
        a: "Rendez-vous dans la section 'Crédits' de votre Dashboard. Choisissez un pack et payez de manière sécurisée via Chariow (Orange Money, Wave, MTN, Moov, Visa ou PayPal)." 
      },
      { 
        q: "Les crédits sont-ils renouvelés automatiquement ?", 
        a: "Non. MakeItAds fonctionne sans abonnement. Vous achetez des crédits à l'unité. Ils n'expirent pas tant que votre compte reste actif." 
      },
      { 
        q: "Que se passe-t-il si je n'ai plus de crédits ?", 
        a: "Vous ne pourrez plus générer de nouvelles stratégies. Un message vous invitera à recharger votre compte depuis votre Dashboard." 
      },
    ]
  },
  {
    category: "Génération & Utilisation",
    questions: [
      { 
        q: "Comment créer ma première stratégie ?", 
        a: "Cliquez sur 'Nouvelle stratégie' dans le menu ou sur votre Dashboard, puis suivez les 7 étapes du questionnaire." 
      },
      { 
        q: "Puis-je utiliser MakeItAds pour Meta, TikTok et Google ?", 
        a: "Oui. L'outil vous recommandera le ou les canaux les plus pertinents pour votre offre, mais vous pouvez aussi les sélectionner manuellement." 
      },
      { 
        q: "Que signifient les différents angles publicitaires ?", 
        a: "Un angle est l'approche psychologique du message (ex: 'Problème/Solution', 'Preuve sociale'). Nous en fournissons plusieurs pour que vous puissiez tester ce qui résonne le mieux." 
      },
      { 
        q: "Comment utiliser les copies publicitaires ?", 
        a: "Copiez simplement le 'Primary text' et le 'Headline' générés et collez-les directement dans les champs correspondants de votre gestionnaire de publicités." 
      },
      { 
        q: "Puis-je télécharger ma stratégie ?", 
        a: "Oui. Sur la page de chaque stratégie, un bouton 'Exporter' vous permet de télécharger le résumé en format texte (TXT)." 
      },
    ]
  },
  {
    category: "Compte & Support",
    questions: [
      { 
        q: "Comment modifier les informations de mon compte ?", 
        a: "Rendez-vous dans 'Paramètres' > 'Compte'. Vous pouvez y modifier votre nom complet. Pour changer d'email, contactez le support." 
      },
      { 
        q: "Comment contacter le support ?", 
        a: "Vous pouvez nous écrire à support@makeitads.pro ou nous contacter directement via notre canal Telegram dédié." 
      },
    ]
  }
];

// Composant Accordéon pour une question
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#E7E7EB] last:border-0">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between py-4 text-left hover:bg-[#F7F7F8] transition-colors px-1 rounded-lg"
      >
        <span className="text-sm font-semibold text-[#18181B] pr-4">{q}</span>
        <ChevronDown className={`h-4 w-4 text-[#71717A] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div 
        initial={false} 
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} 
        transition={{ duration: 0.2 }} 
        className="overflow-hidden"
      >
        <p className="text-sm text-[#71717A] leading-relaxed pb-4 px-1">{a}</p>
      </motion.div>
    </div>
  );
}

// Page Principale
export default function FaqPage() {
  return (
    <div className="max-w-[760px] mx-auto pb-12">
      {/* Header avec lien retour */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link href="/dashboard/resources" className="text-xs font-medium text-[#6366F1] hover:text-[#8B5CF6] flex items-center gap-1 mb-4">
          <ArrowRight className="h-3 w-3 rotate-180" /> Ressources
        </Link>
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
          Questions fréquentes
        </h1>
        <p className="text-[15px] text-[#71717A] mt-2">
          Tout ce que vous devez savoir pour utiliser MakeItAds efficacement.
        </p>
      </motion.div>

      {/* Liste des catégories et questions */}
      <div className="space-y-8">
        {FAQ_DATA.map((section, i) => (
          <motion.div 
            key={section.category} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
          >
            <h2 className="text-sm font-bold text-[#6366F1] uppercase tracking-wider mb-3 px-1">
              {section.category}
            </h2>
            <div className="bg-white rounded-[14px] border border-[#E7E7EB] px-6">
              {section.questions.map((item, j) => (
                <FaqItem key={j} q={item.q} a={item.a} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}