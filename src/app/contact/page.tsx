"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Send, CheckCircle, ChevronDown, Clock, Globe } from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

const FAQS = [
  {
    question: "Comment fonctionne MakeItAds ?",
    answer: "C'est très simple : vous achetez un pack de crédits, vous répondez à 7 questions sur votre entreprise, et notre IA génère instantanément une stratégie publicitaire complète (ciblage, textes, idées de visuels) prête à être copiée-collée dans votre gestionnaire de publicité."
  },
  {
    question: "Quels sont vos tarifs ?",
    answer: "Nous fonctionnons sans abonnement. Vous achetez des crédits à l'unité : Pack Startup (2 500 FCFA pour 1 stratégie), Pack Business (7 500 FCFA pour 3 stratégies) ou Pack Entreprise (15 000 FCFA pour 10 stratégies). Paiement unique, zéro engagement."
  },
  {
    question: "Comment se passe le paiement ?",
    answer: "Le paiement est 100% sécurisé via notre partenaire Chariow. Vous pouvez payer par Mobile Money (Orange Money, Wave, MTN, Moov) ou par carte bancaire (Visa/Mastercard). Vos crédits sont ajoutés à votre compte en quelques minutes."
  },
  {
    question: "Est-ce vraiment adapté au marché africain ?",
    answer: "Oui, c'est notre principale force. Contrairement aux IA génériques, MakeItAds est calibré pour nos réalités : budgets en FCFA, ciblage par villes (Abidjan, Dakar, Douala, etc.), et leviers de confiance locaux (WhatsApp, paiement à la livraison)."
  },
  {
    question: "Comment contacter le support ?",
    answer: "Vous pouvez nous écrire à support@makeitads.pro ou nous contacter directement via notre canal Telegram dédié. Nous répondons généralement en moins de 24 heures ouvrées."
  },
  {
    question: "Mes données sont-elles en sécurité ?",
    answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et ne partageons jamais vos informations commerciales avec des tiers. Votre confidentialité est notre priorité."
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[#F7F7F8] text-[#18181B]">
      <GlobalNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#E7E7EB] bg-[#FFFFFF]">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/20 bg-[#6366F1]/5 px-4 py-1.5 mb-6">
              <MessageCircle className="h-3.5 w-3.5 text-[#6366F1]" />
              <span className="text-xs font-semibold text-[#6366F1] uppercase tracking-wider">Contactez-nous</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#18181B] mb-4 sm:mb-6">
              Démarrons une <span className="text-[#6366F1]">conversation</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#71717A] leading-relaxed max-w-2xl mx-auto px-2">
              Une question, un retour ou besoin d'aide ? Notre équipe est là pour vous. Nous répondons généralement en moins de 24 heures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl sm:rounded-3xl border border-[#E7E7EB] bg-[#FFFFFF] p-6 sm:p-8 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center mb-4">
              <Mail className="h-5 w-5 text-[#6366F1]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#18181B] mb-2">Email</h3>
            <p className="text-xs sm:text-sm text-[#71717A] mb-3">Nous répondons sous 24h</p>
            <p className="text-xs sm:text-sm font-semibold text-[#6366F1]">support@makeitads.pro</p>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-[#E7E7EB] bg-[#FFFFFF] p-6 sm:p-8 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-5 w-5 text-[#6366F1]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#18181B] mb-2">Telegram</h3>
            <p className="text-xs sm:text-sm text-[#71717A] mb-3">Rejoignez la communauté</p>
            <a href="https://t.me/MakeItAds_Pro" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-semibold text-[#6366F1] hover:underline">
              @MakeItAds_Pro
            </a>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-[#E7E7EB] bg-[#FFFFFF] p-6 sm:p-8 shadow-sm sm:col-span-2 md:col-span-1">
            <div className="h-12 w-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-[#6366F1]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#18181B] mb-2">Temps de réponse</h3>
            <p className="text-xs sm:text-sm text-[#71717A] mb-3">Du lundi au samedi</p>
            <p className="text-xs sm:text-sm font-semibold text-[#6366F1]">Moins de 24 heures</p>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-emerald-50 p-8 sm:p-12 text-center">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] mb-2">Message envoyé !</h2>
              <p className="text-sm sm:text-base text-[#71717A]">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E7E7EB] shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">Nom</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-xl border border-[#E7E7EB] bg-[#F7F7F8] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full rounded-xl border border-[#E7E7EB] bg-[#F7F7F8] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all" placeholder="vous@exemple.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">Entreprise</label>
                <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full rounded-xl border border-[#E7E7EB] bg-[#F7F7F8] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all" placeholder="Nom de votre entreprise" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">Sujet</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="w-full rounded-xl border border-[#E7E7EB] bg-[#F7F7F8] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all" placeholder="Comment pouvons-nous vous aider ?" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">Message</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={5} className="w-full rounded-xl border border-[#E7E7EB] bg-[#F7F7F8] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-[#18181B] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all resize-none" placeholder="Dites-nous en plus sur votre demande..." />
              </div>
              <button type="submit" className="w-full rounded-xl bg-[#6366F1] py-3.5 sm:py-4 text-sm font-bold text-white hover:bg-[#5558e6] transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#6366F1]/25">
                Envoyer le message <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FAQ SECTION */}
      <section className="border-t border-[#E7E7EB] bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#18181B] mb-3 sm:mb-4">Questions fréquentes</h2>
            <p className="text-sm sm:text-base md:text-lg text-[#71717A]">Tout ce que vous devez savoir sur MakeItAds</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl border border-[#E7E7EB] bg-[#F7F7F8] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-[#FFFFFF] transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#18181B] pr-4">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-[#71717A] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 pb-4 sm:pb-6"
                  >
                    <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">{faq.answer}</p>
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