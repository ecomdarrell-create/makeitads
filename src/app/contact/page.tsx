"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Send, CheckCircle, ChevronDown, Clock } from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { createClient } from "@/lib/supabase/client";
import { normalizeCurrency, formatPriceFromXOF, type Currency } from "@/lib/currency";

function buildFaqs(currency: Currency): { question: string; answer: string }[] {
  const startupPrice = formatPriceFromXOF(2500, currency);
  const businessPrice = formatPriceFromXOF(7500, currency);
  const enterprisePrice = formatPriceFromXOF(15000, currency);

  return [
    {
      question: "Comment fonctionne MakeItAds ?",
      answer: "C'est très simple : vous achetez un pack de crédits, vous répondez à 7 questions sur votre entreprise, et notre IA génère instantanément une stratégie publicitaire complète (ciblage, textes, idées de visuels) prête à être copiée-collée dans votre gestionnaire de publicité."
    },
    {
      question: "Quels sont vos tarifs ?",
      answer: `Nous fonctionnons sans abonnement. Vous achetez des crédits à l'unité : Pack Startup (${startupPrice} pour 1 stratégie), Pack Business (${businessPrice} pour 3 stratégies) ou Pack Entreprise (${enterprisePrice} pour 10 stratégies). Paiement unique, zéro engagement.`
    },
    {
      question: "Comment se passe le paiement ?",
      answer: "Le paiement est 100% sécurisé via notre partenaire Chariow. Vous pouvez payer par Mobile Money (Orange Money, Wave, MTN, Moov) ou par carte bancaire (Visa/Mastercard). Vos crédits sont ajoutés à votre compte en quelques minutes."
    },
    {
      question: "Est-ce vraiment adapté au marché africain ?",
      answer: `Oui, c'est notre principale force. Contrairement aux IA génériques, MakeItAds est calibré pour nos réalités : budgets réalistes, ciblage par villes (Abidjan, Dakar, Douala, etc.), et leviers de confiance locaux (WhatsApp, paiement à la livraison).`
    },
    {
      question: "Comment contacter le support ?",
      answer: "Vous pouvez nous écrire à support@makeitads.pro. Nous répondons généralement en moins de 24 heures ouvrées."
    },
    {
      question: "Mes données sont-elles en sécurité ?",
      answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et ne partageons jamais vos informations commerciales avec des tiers. Votre confidentialité est notre priorité."
    },
  ];
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>('XOF');

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('currency')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.currency) {
          setCurrency(normalizeCurrency(profile.currency));
        }
      } catch {
        // Silencieux — fallback XOF
      }
    };
    loadCurrency();
  }, []);

  const FAQS = buildFaqs(currency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[#F7F7F8] text-[#18181B]">
      <GlobalNavbar />

      {/* HERO — allégé + pt pour compenser navbar fixe */}
      <section className="relative overflow-hidden border-b border-[#E7E7EB] bg-[#FFFFFF]">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14 md:pt-16 md:pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6366F1]/20 bg-[#6366F1]/5 px-3 py-1 mb-4 sm:px-4 sm:py-1.5 sm:mb-5">
              <MessageCircle className="h-3 w-3 text-[#6366F1] sm:h-3.5 sm:w-3.5" />
              <span className="text-[10.5px] font-semibold text-[#6366F1] uppercase tracking-wider sm:text-xs">Contactez-nous</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#18181B] mb-3 sm:mb-4">
              Démarrons une <span className="text-[#6366F1]">conversation</span>
            </h1>
            <p className="text-[13px] sm:text-sm md:text-base text-[#71717A] leading-relaxed max-w-xl mx-auto px-2">
              Une question, un retour ou besoin d'aide ? Notre équipe est là pour vous. Nous répondons généralement en moins de 24 heures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-[#E7E7EB] bg-[#FFFFFF] p-4 sm:p-5 shadow-sm">
            <div className="h-9 w-9 rounded-lg bg-[#6366F1]/10 flex items-center justify-center mb-3 sm:h-10 sm:w-10">
              <Mail className="h-4 w-4 text-[#6366F1] sm:h-[18px] sm:w-[18px]" />
            </div>
            <h3 className="text-[13px] sm:text-sm font-bold text-[#18181B] mb-1.5">Email</h3>
            <p className="text-[11px] sm:text-xs text-[#71717A] mb-2">Nous répondons sous 24h</p>
            <a href="mailto:support@makeitads.pro" className="text-[11.5px] sm:text-xs font-semibold text-[#6366F1] hover:underline">
              support@makeitads.pro
            </a>
          </div>

          <div className="rounded-2xl border border-[#E7E7EB] bg-[#FFFFFF] p-4 sm:p-5 shadow-sm">
            <div className="h-9 w-9 rounded-lg bg-[#6366F1]/10 flex items-center justify-center mb-3 sm:h-10 sm:w-10">
              <Send className="h-4 w-4 text-[#6366F1] sm:h-[18px] sm:w-[18px]" />
            </div>
            <h3 className="text-[13px] sm:text-sm font-bold text-[#18181B] mb-1.5">Formulaire</h3>
            <p className="text-[11px] sm:text-xs text-[#71717A] mb-2">Réponse en 24h ouvrées</p>
            <a href="#contact-form" className="text-[11.5px] sm:text-xs font-semibold text-[#6366F1] hover:underline">
              Remplir le formulaire
            </a>
          </div>

          <div className="rounded-2xl border border-[#E7E7EB] bg-[#FFFFFF] p-4 sm:p-5 shadow-sm sm:col-span-2 md:col-span-1">
            <div className="h-9 w-9 rounded-lg bg-[#6366F1]/10 flex items-center justify-center mb-3 sm:h-10 sm:w-10">
              <Clock className="h-4 w-4 text-[#6366F1] sm:h-[18px] sm:w-[18px]" />
            </div>
            <h3 className="text-[13px] sm:text-sm font-bold text-[#18181B] mb-1.5">Temps de réponse</h3>
            <p className="text-[11px] sm:text-xs text-[#71717A] mb-2">Du lundi au samedi</p>
            <p className="text-[11.5px] sm:text-xs font-semibold text-[#6366F1]">Moins de 24 heures</p>
          </div>
        </div>
      </section>

      {/* CONTACT FORM — scroll-mt augmenté pour ne pas être caché par le navbar */}
      <section
        id="contact-form"
        className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pt-8 sm:pb-12 scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32"
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 text-center">
              <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600 mx-auto mb-3" />
              <h2 className="text-base sm:text-lg font-bold text-[#18181B] mb-1.5">Message envoyé !</h2>
              <p className="text-[12.5px] sm:text-sm text-[#71717A]">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 bg-[#FFFFFF] p-4 sm:p-6 rounded-2xl border border-[#E7E7EB] shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-1.5">Nom</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-lg border border-[#E7E7EB] bg-[#F7F7F8] px-3 py-2 text-[13px] sm:px-3.5 sm:py-2.5 sm:text-[13.5px] text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-1.5">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full rounded-lg border border-[#E7E7EB] bg-[#F7F7F8] px-3 py-2 text-[13px] sm:px-3.5 sm:py-2.5 sm:text-[13.5px] text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all" placeholder="vous@exemple.com" />
                </div>
              </div>
              <div>
                <label className="block text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-1.5">Entreprise</label>
                <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full rounded-lg border border-[#E7E7EB] bg-[#F7F7F8] px-3 py-2 text-[13px] sm:px-3.5 sm:py-2.5 sm:text-[13.5px] text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all" placeholder="Nom de votre entreprise" />
              </div>
              <div>
                <label className="block text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-1.5">Sujet</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="w-full rounded-lg border border-[#E7E7EB] bg-[#F7F7F8] px-3 py-2 text-[13px] sm:px-3.5 sm:py-2.5 sm:text-[13.5px] text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all" placeholder="Comment pouvons-nous vous aider ?" />
              </div>
              <div>
                <label className="block text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-1.5">Message</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={4} className="w-full rounded-lg border border-[#E7E7EB] bg-[#F7F7F8] px-3 py-2 text-[13px] sm:px-3.5 sm:py-2.5 sm:text-[13.5px] text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all resize-none" placeholder="Dites-nous en plus sur votre demande..." />
              </div>
              <button type="submit" className="w-full rounded-lg bg-[#6366F1] py-2.5 sm:py-3 text-[13px] sm:text-[13.5px] font-semibold text-white hover:bg-[#5558e6] transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#6366F1]/20">
                Envoyer le message <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E7E7EB] bg-[#FFFFFF]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#18181B] mb-2">Questions fréquentes</h2>
            <p className="text-[12.5px] sm:text-sm text-[#71717A]">Tout ce que vous devez savoir sur MakeItAds</p>
          </div>

          <div className="space-y-2 sm:space-y-2.5">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-lg sm:rounded-xl border border-[#E7E7EB] bg-[#F7F7F8] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-[#FFFFFF] transition-colors"
                >
                  <span className="text-[12.5px] sm:text-[13.5px] font-semibold text-[#18181B] pr-3">{faq.question}</span>
                  <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#71717A] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-3 sm:px-4 pb-3 sm:pb-4"
                  >
                    <p className="text-[11.5px] sm:text-[12.5px] text-[#71717A] leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}