import Link from 'next/link';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function GlobalFooter() {
  const slogan = 'La plateforme N°1 pour automatiser votre acquisition client en Afrique.';

  return (
    <footer className="bg-[#F7F7F8] border-t border-[#E7E7EB] pt-9 pb-7 px-4 sm:px-6 sm:pt-10 sm:pb-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-7 sm:gap-8 mb-8">

        {/* Logo + slogan */}
        <div className="col-span-1">
          <Link href="/" className="text-[15px] font-semibold text-[#18181B] tracking-tight sm:text-base">
            MakeIt<span className="text-[#6366F1]">Ads</span>
          </Link>
          <p className="text-[10.5px] text-[#71717A] mt-2 leading-relaxed max-w-[240px] sm:text-[11px]">
            {slogan}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[10.5px] font-semibold uppercase tracking-wider text-[#18181B] mb-2.5 sm:text-[11px] sm:mb-3">
            Navigation
          </h4>
          <ul className="space-y-1.5 text-[11.5px] text-[#71717A] sm:space-y-2 sm:text-[12px]">
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
              <Link href="/insights" className="hover:text-[#6366F1] transition-colors">
                À la une
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
          <h4 className="text-[10.5px] font-semibold uppercase tracking-wider text-[#18181B] mb-2.5 sm:text-[11px] sm:mb-3">
            Légal
          </h4>
          <ul className="space-y-1.5 text-[11.5px] text-[#71717A] sm:space-y-2 sm:text-[12px]">
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

        {/* Contact & aide */}
        <div>
          <h4 className="text-[10.5px] font-semibold uppercase tracking-wider text-[#18181B] mb-2.5 sm:text-[11px] sm:mb-3">
            Contact &amp; aide
          </h4>
          <ul className="space-y-1.5 text-[11.5px] text-[#71717A] sm:space-y-2 sm:text-[12px]">
            <li>
              <a
                href="mailto:support@makeitads.pro"
                className="inline-flex items-center gap-1.5 hover:text-[#6366F1] transition-colors sm:gap-2"
              >
                <Mail
                  className="h-3 w-3 shrink-0 opacity-80 sm:h-3.5 sm:w-3.5"
                  strokeWidth={1.9}
                />
                <span>support@makeitads.pro</span>
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 hover:text-[#6366F1] transition-colors sm:gap-2"
              >
                <MessageCircle
                  className="h-3 w-3 shrink-0 opacity-80 sm:h-3.5 sm:w-3.5"
                  strokeWidth={1.9}
                />
                <span>Formulaire de contact</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/resources"
                className="inline-flex items-center gap-1.5 hover:text-[#6366F1] transition-colors sm:gap-2"
              >
                <HelpCircle
                  className="h-3 w-3 shrink-0 opacity-80 sm:h-3.5 sm:w-3.5"
                  strokeWidth={1.9}
                />
                <span>Centre d&apos;aide</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E7E7EB] pt-5 text-center sm:pt-6">
        <p className="text-[9.5px] text-[#94A3B8] sm:text-[10px]">
          © {new Date().getFullYear()} MakeItAds. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}