import Link from "next/link";

export default function GlobalFooter() {
  const slogan = "La plateforme N°1 pour automatiser votre acquisition client en Afrique.";

  return (
    <footer className="bg-[#F7F7F8] border-t border-[#E7E7EB] pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-1">
          {/* ✅ Logo minimaliste collé + Slogan exact en dessous */}
          <div className="flex flex-col">
            <Link href="/" className="text-lg font-semibold text-[#18181B] tracking-tight">
              MakeIt<span className="text-[#6366F1]">Ads</span>
            </Link>
            <p className="text-[11px] text-[#71717A] mt-1.5 leading-snug max-w-[240px]">
              {slogan}
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-[#18181B] mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs text-[#71717A]">
            <li><Link href="/#how-it-works" className="hover:text-[#6366F1] transition-colors">Comment ça marche</Link></li>
            <li><Link href="/#pricing" className="hover:text-[#6366F1] transition-colors">Tarifs</Link></li>
            <li><Link href="/dashboard" className="hover:text-[#6366F1] transition-colors">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#18181B] mb-3">Légal</h4>
          <ul className="space-y-2 text-xs text-[#71717A]">
            <li><Link href="/privacy" className="hover:text-[#6366F1] transition-colors">Confidentialité</Link></li>
            <li><Link href="/terms" className="hover:text-[#6366F1] transition-colors">Conditions d&apos;utilisation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#18181B] mb-3">Contact & aide</h4>
          <ul className="space-y-2 text-xs text-[#71717A]">
            <li><Link href="/contact" className="hover:text-[#6366F1] transition-colors">Contacter MakeItAds</Link></li>
            <li><a href="https://t.me/MakeitAds_CEO" target="_blank" rel="noreferrer" className="hover:text-[#6366F1] transition-colors">Support sur Telegram</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-[#E7E7EB] pt-6 text-center">
        <p className="text-[10px] text-[#94A3B8]">© 2024 MakeItAds. Tous droits réservés.</p>
      </div>
    </footer>
  );
}