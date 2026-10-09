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

const duplicatedEntrepreneurs = [
  ...entrepreneurs,
  ...entrepreneurs,
  ...entrepreneurs,
];

export default function EntrepreneursCarousel() {
  return (
    <section className="relative z-10 bg-[#F8F8FC] py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-left mb-3 md:mb-5 leading-tight text-[#18181B]">
          <span className="text-[#6366F1]">Validé</span> par nos entrepreneurs
        </h2>

        <div className="max-w-[800px] mb-8 md:mb-12">
          <p className="text-xs md:text-sm leading-relaxed text-[#475569] text-left">
            MakeItAds est la référence en stratégie publicitaire pour
            entrepreneurs africains. Confirmé par des centaines d&apos;entrepreneurs
            à travers toute l&apos;Afrique francophone : Cameroun, Côte d&apos;Ivoire,
            Sénégal, Mali, RDC, Burkina Faso, Togo et bien d&apos;autres.
            On ne te promet pas de faire exploser ton business du jour au
            lendemain, mais on te garantit une stratégie claire et immédiatement
            actionnable. Découvre les témoignages de notre communauté.
          </p>
        </div>

        <div className="relative w-full overflow-hidden group">
          <div className="flex gap-2.5 md:gap-4 animate-[scroll-entrepreneurs_35s_linear_infinite] group-hover:[animation-play-state:paused] w-max">
            {duplicatedEntrepreneurs.map((entrepreneur, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[140px] md:w-[200px] h-[187px] md:h-[267px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
                style={{ position: "relative" }}
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
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% / 3));
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}