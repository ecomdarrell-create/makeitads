"use client";

import Image from "next/image";

const entrepreneurs = [
  { image: "/images/entrepreneurs/aminata-d.jpg" },
  { image: "/images/entrepreneurs/kwame-a.jpg" },
  { image: "/images/entrepreneurs/fatoumata-k.jpg" },
  { image: "/images/entrepreneurs/jean-baptiste-m.jpg" },
  { image: "/images/entrepreneurs/blessing-o.jpg" },
  { image: "/images/entrepreneurs/mariam-t.jpg" },
  { image: "/images/entrepreneurs/awa-s.jpg" },
  { image: "/images/entrepreneurs/samuel-m.jpg" },
  { image: "/images/entrepreneurs/rokhaya-f.jpg" },
  { image: "/images/entrepreneurs/moussa-c.jpg" },
];

const duplicatedEntrepreneurs = [...entrepreneurs, ...entrepreneurs, ...entrepreneurs];

export default function EntrepreneursCarousel() {
  return (
    // ✅ FOND CLAIR ÉPURÉ POUR TOUTE LA SECTION
    <section className="relative z-10 bg-[#F8F8FC] py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Badge "VU SUR…" */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-3 md:gap-4 bg-white border border-[#E2E2EC] rounded-full px-5 py-2.5 md:px-6 md:py-3 shadow-sm">
            <span className="text-[12px] md:text-[13px] font-bold text-[#18181B] tracking-wide">
              VU SUR…
            </span>
            <div className="w-px h-4 bg-[#18181B]/20" />
            <div className="flex items-center gap-3 md:gap-4">
              <svg className="h-5 w-auto" viewBox="0 0 24 24" fill="#0088CC" aria-label="Telegram">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <svg className="h-5 w-auto" viewBox="0 0 24 24" fill="#25D366" aria-label="WhatsApp">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <svg className="h-5 w-auto" viewBox="0 0 24 24" fill="#1877F2" aria-label="Facebook">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <svg className="h-5 w-auto" viewBox="0 0 24 24" fill="#000000" aria-label="TikTok">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Titre principal (adapté au fond clair) */}
        <h2 className="text-[28px] md:text-[52px] font-black uppercase tracking-[-0.5px] text-center mb-4 md:mb-5 leading-tight">
          <span className="text-[#6366F1]">VALIDÉ</span>{" "}
          <span className="text-[#080810]">PAR NOS ENTREPRENEURS</span>
        </h2>

        {/* Texte sous le titre (adapté au fond clair) */}
        <div className="max-w-[800px] mx-auto text-center mb-8 md:mb-12 px-2">
          <p className="text-[12px] md:text-[15px] leading-[1.7] text-[#475569]">
            Et oui! MakeItAds c'est la <strong className="text-[#080810] font-bold">référence en stratégie publicitaire pour entrepreneurs africains</strong> et ça c'est confirmé par des centaines d'entrepreneurs à travers toute l'Afrique francophone: Cameroun, Côte d'Ivoire, Sénégal, Mali, RDC, Burkina Faso, Togo et bien d'autres. On peut pas te promettre de faire exploser ton business du jour au lendemain mais on peut te promettre une <strong className="text-[#080810] font-bold">stratégie claire et immédiatement actionnable</strong>. Découvre les <strong className="text-[#080810] font-bold">témoignages de notre communauté</strong>.
          </p>
        </div>

        {/* Carrousel de photos */}
        <div className="relative w-full overflow-hidden group">
          <div className="flex gap-[10px] md:gap-4 animate-[scroll-entrepreneurs_35s_linear_infinite] group-hover:[animation-play-state:paused] w-max">
            {duplicatedEntrepreneurs.map((entrepreneur, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-[140px] md:w-[200px] h-[187px] md:h-[267px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
              >
                <Image
                  src={entrepreneur.image}
                  alt="Entrepreneur MakeItAds"
                  fill
                  sizes="(max-width: 768px) 140px, 200px"
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
            ))}
          </div>

          <style jsx>{`
            @keyframes scroll-entrepreneurs {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-100% / 3)); }
            }
          `}</style>
        </div>

      </div>
    </section>
  );
}