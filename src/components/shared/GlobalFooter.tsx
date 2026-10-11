import Link from 'next/link';
import { Mail, Send, HelpCircle } from 'lucide-react';

export default function GlobalFooter() {
  const slogan = 'La plateforme N°1 pour automatiser votre acquisition client en Afrique.';

  return (
    <footer className="bg-[#F7F7F8] border-t border-[#E7E7EB] pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

        {/* Logo + slogan */}
        <div className="col-span-1">
          <Link href="/" className="text-base font-semibold text-[#18181B] tracking-tight">
            MakeIt<span className="text-[#6366F1]">Ads</span>
          </Link>
          <p className="text-[11px] text-[#71717A] mt-2 leading-relaxed max-w-[240px]">
            {slogan}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#18181B] mb-3">
            Navigation
          </h4>
          <ul className="space-y-2 text-[12px] text-[#71717A]">
            <li>
              <Link href="/#how-it-works" className="hover:text-[#6366F1] transition-colors">
                Comment ça marche
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-[#6366F1] transition-colors">
                Tarifs
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[#6366F1] transition-colors">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#18181B] mb-3">
            Légal
          </h4>
          <ul className="space-y-2 text-[12px] text-[#71717A]">
            <li>
              <Link href="/privacy" className="hover:text-[#6366F1] transition-colors">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#6366F1] transition-colors">
                Conditions d&apos;utilisation
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-[#6366F1] transition-colors">
                Cookies
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#18181B] mb-3">
            Contact & aide
          </h4>
          <ul className="space-y-2.5 text-[12px] text-[#71717A]">
            <li>
              <a
                href="mailto:support@makeitads.com"
                className="inline-flex items-center gap-2 hover:text-[#6366F1] transition-colors"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                <span>support@makeitads.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://t.me/MakeitAds_CEO"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#6366F1] transition-colors"
              >
                <Send className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                <span>Support sur Telegram</span>
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 hover:text-[#6366F1] transition-colors"
              >
                <HelpCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                <span>Contacter MakeItAds</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E7E7EB] pt-6 text-center">
        <p className="text-[10px] text-[#94A3B8]">
          © {new Date().getFullYear()} MakeItAds. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}