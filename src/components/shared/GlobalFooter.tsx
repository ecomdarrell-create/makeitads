import Link from "next/link";
import { Mail, HelpCircle, ExternalLink } from "lucide-react";

export default function GlobalFooter() {
  return (
    <footer className="relative z-10 border-t border-[#E7E7EB] bg-[#F7F7F8] pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Colonne 1 : Marque & Centre d'aide */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 mb-4">
              <span className="text-xl font-bold tracking-tight text-[#18181B]">
                MakeIt<span className="text-[#6366F1]">Ads</span>
              </span>
            </Link>
            <p className="text-sm text-[#71717A] mb-6 leading-relaxed">
              L'intelligence marketing calibrée pour l'Afrique. Arrêtez de deviner, commencez à convertir avec des stratégies publicitaires prêtes à l'emploi.
            </p>
            
            {/* Centre d'aide en design pill blanc premium */}
            <Link 
              href="/help" 
              className="inline-flex items-center gap-2 rounded-full bg-[#FFFFFF] border border-[#E7E7EB] px-4 py-2.5 text-sm font-semibold text-[#18181B] hover:border-[#6366F1]/30 hover:shadow-sm transition-all"
            >
              <HelpCircle className="h-4 w-4 text-[#6366F1]" />
              Centre d'aide
            </Link>
          </div>

          {/* Colonne 2 : Produit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-4">Produit</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#how-it-works" className="text-[#18181B] hover:text-[#6366F1] transition-colors">Fonctionnement</Link></li>
              <li><Link href="/#pricing" className="text-[#18181B] hover:text-[#6366F1] transition-colors">Tarifs</Link></li>
              <li><Link href="/dashboard" className="text-[#18181B] hover:text-[#6366F1] transition-colors">Tableau de bord</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Ressources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-4">Ressources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#faq" className="text-[#18181B] hover:text-[#6366F1] transition-colors">FAQ</Link></li>
              <li>
                <a href="https://t.me/MakeItAds_Pro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#18181B] hover:text-[#6366F1] transition-colors">
                  Canal Telegram <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Entreprise */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-4">Entreprise</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-[#18181B] hover:text-[#6366F1] transition-colors">À propos</Link></li>
              <li>
                <a href="https://t.me/MakeItAds_Pro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#18181B] hover:text-[#6366F1] transition-colors">
                  The Boardroom <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li><Link href="/careers" className="text-[#18181B] hover:text-[#6366F1] transition-colors">Recrutement</Link></li>
              <li><Link href="/contact" className="text-[#18181B] hover:text-[#6366F1] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div className="pt-8 border-t border-[#E7E7EB] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-[#71717A]">© 2024 MakeItAds. Tous droits réservés.</p>
          <div className="flex items-center gap-6 text-xs text-[#71717A]">
            <Link href="/privacy" className="hover:text-[#6366F1] transition-colors">Politique de confidentialité</Link>
            <Link href="/terms" className="hover:text-[#6366F1] transition-colors">Conditions d'utilisation</Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#71717A] hover:text-[#6366F1] transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://x.com/dr_darrellkamga?s=11" target="_blank" rel="noopener noreferrer" className="text-[#71717A] hover:text-[#6366F1] transition-colors" aria-label="X (Twitter)">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="mailto:support@makeitads.pro" className="text-[#71717A] hover:text-[#6366F1] transition-colors" aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}