"use client";

import { useRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

interface Review {
  rating: number;
  title: string;
  text: string;
  author: string;
  time: string;
}

interface TrustpilotCarouselProps {
  reviews: Review[];
  title: ReactNode;
  footerNote: string;
}

function StarRating({ rating }: { rating: number }) {
  const starPath =
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5"
          fill={star <= rating ? "#00B67A" : "#DCDCE6"}
        >
          <path d={starPath} />
        </svg>
      ))}
    </div>
  );
}

export default function TrustpilotCarousel({
  reviews,
  title,
  footerNote,
}: TrustpilotCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const firstCard =
        scrollContainerRef.current.querySelector<HTMLElement>(".snap-start");
      const styles = window.getComputedStyle(scrollContainerRef.current);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      const scrollAmount = firstCard ? firstCard.offsetWidth + gap : 340;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative z-10 w-full py-12 md:py-16 bg-[#FFFFFF]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <h2 className="text-xl md:text-3xl font-semibold text-[#18181B] mb-6 md:mb-8 text-left leading-tight">
          {title}
        </h2>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E8E8E8] shadow-sm flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Avis précédent"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 md:gap-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] snap-start bg-white border border-[#E8E8E8] rounded-2xl p-5 flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={review.rating} />
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] font-semibold text-blue-600">
                      Certifié
                    </span>
                  </div>
                </div>

                <h3 className="text-xs md:text-sm font-bold text-[#1A1A1A] mb-2 leading-snug">
                  {review.title}
                </h3>

                <p className="text-[11px] md:text-xs text-[#4A4A4A] leading-relaxed flex-1 overflow-hidden">
                  {review.text}
                </p>

                <div className="border-t border-[#F0F0F0] pt-3 mt-3">
                  <p className="text-[10px] md:text-[11px] text-[#6B6B6B] font-medium mb-0.5 truncate">
                    {review.author}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF]">{review.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E8E8E8] shadow-sm flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Avis suivant"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-start gap-2 text-left md:flex-row md:items-center md:gap-3">
          <p className="text-xs md:text-sm text-[#4A4A4A] font-medium">
            {footerNote}
          </p>
          <span className="text-[#00B67A] font-bold text-base md:text-lg tracking-tight flex items-center gap-1">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 md:w-5 md:h-5"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Trustpilot
          </span>
        </div>
      </div>
    </section>
  );
}

export const section1Reviews: Review[] = [
  { rating: 5, title: "Exactement ce dont j'avais besoin!", text: "En moins de 24h j'avais une stratégie complète pour mes publicités Meta. Ciblage précis, messages clairs, budget bien réparti.", author: "Aminata Diallo, E-commerce - Sénégal", time: "Il y a 2 jours" },
  { rating: 4, title: "Très bonne approche!", text: "J'étais sceptique au départ mais la stratégie reçue était vraiment personnalisée. Pas du tout générique.", author: "Kwame Asante, Coach - Ghana", time: "Il y a 5 jours" },
  { rating: 5, title: "Ma première campagne rentable!", text: "Après 4 mois à dépenser sans résultats, j'ai enfin une direction claire. Premier mois: ROI positif.", author: "Fatoumata Koné, Cosmétiques - Côte d'Ivoire", time: "Il y a 1 semaine" },
  { rating: 3, title: "Bon service, quelques ajustements.", text: "La stratégie était claire et bien structurée. J'aurais aimé plus de détails sur le retargeting.", author: "Thomas Girard, Consultant - France", time: "Il y a 3 jours" },
  { rating: 5, title: "Le meilleur investissement de mon année!", text: "Je gérais une boutique en ligne depuis 2 ans sans vraiment maîtriser la publicité. MakeItAds m'a ouvert les yeux.", author: "Blessing Okafor, Boutique - Nigeria", time: "Il y a 4 jours" },
  { rating: 4, title: "Stratégie claire et actionnable!", text: "Chaque message publicitaire était prêt à copier-coller. Résultats satisfaisants dès la deuxième semaine.", author: "Mariam Traoré, Formatrice - Mali", time: "Il y a 6 jours" },
  { rating: 5, title: "Enfin quelqu'un qui comprend l'Afrique!", text: "La stratégie tenait compte de mon marché réel. Pas des conseils copiés depuis des blogs américains.", author: "Jean-Baptiste Mongo, Restaurateur - Cameroun", time: "Il y a 2 semaines" },
  { rating: 4, title: "Réactif et professionnel!", text: "J'ai eu ma stratégie en moins de 24h comme promis. Le niveau de détail était impressionnant.", author: "Nadia Bensalem, Agence de voyage - Tunisie", time: "Il y a 1 semaine" },
  { rating: 5, title: "Mes ventes ont doublé!", text: "Je vendais des vêtements depuis 8 mois avec très peu de résultats. MakeItAds m'a donné une stratégie TikTok.", author: "Awa Sylla, Créatrice de mode - Sénégal", time: "Il y a 5 jours" },
  { rating: 3, title: "Bon mais peut faire mieux!", text: "La stratégie était correcte mais j'aurais souhaité plus de variantes de messages.", author: "Samuel Mensah, Informatique - Ghana", time: "Il y a 1 semaine" },
  { rating: 5, title: "Transformation totale!", text: "Je ne savais pas par où commencer. Le diagnostic gratuit m'a donné une feuille de route claire.", author: "Omar Diop, Services B2B - Sénégal", time: "Il y a 3 jours" },
  { rating: 5, title: "Enfin de la clarté!", text: "Avant, je jetais l'argent par les fenêtres. Maintenant, chaque franc est investi avec intention.", author: "Aïcha Koné, Artisanat - Côte d'Ivoire", time: "Il y a 4 jours" },
  { rating: 4, title: "Service client au top", text: "J'ai eu une question sur mon ciblage et l'équipe a répondu en moins d'une heure sur Telegram.", author: "David Mensah, Tech Startup - Ghana", time: "Il y a 1 semaine" },
  { rating: 5, title: "Rentabilité au rendez-vous", text: "Dès la première semaine d'application, mon coût par acquisition a chuté de 40%.", author: "Fatima Zahra, E-commerce - Maroc", time: "Il y a 2 jours" },
  { rating: 5, title: "Simple, efficace, africain!", text: "Pas de jargon compliqué, juste des actions concrètes adaptées à notre réalité de Mobile Money.", author: "Issa Ouédraogo, Commerce - Burkina Faso", time: "Il y a 1 semaine" },
];

export const section2Reviews: Review[] = [
  { rating: 5, title: "Stratégie reçue, commandes rentrées!", text: "La séquence a été parfaite. Formulaire lundi, stratégie mardi, lancé mercredi, premières commandes jeudi.", author: "Rokhaya Fall, Bijouterie - Sénégal", time: "Il y a 3 jours" },
  { rating: 4, title: "Vraiment adapté à mon secteur!", text: "Les recommandations correspondaient vraiment à mon secteur, mon audience et mon budget.", author: "Léa Fontaine, Coach bien-être - Belgique", time: "Il y a 4 jours" },
  { rating: 5, title: "Je ne perds plus d'argent!", text: "Avant je jetais 200.000 FCFA par mois sans résultats. Maintenant avec la moitié du budget j'ai trois fois plus de résultats.", author: "Moussa Coulibaly, Grossiste - Côte d'Ivoire", time: "Il y a 1 semaine" },
  { rating: 4, title: "Service sérieux et rapide!", text: "Très satisfait de la qualité de l'analyse. On voit que du travail réel a été fait.", author: "Idriss Mahamat, BTP - Tchad", time: "Il y a 2 semaines" },
  { rating: 5, title: "Un service à recommander!", text: "Je recommande MakeItAds à tous mes amis. J'ai vu ce que ça fait concrètement sur mes résultats.", author: "Grace Asiedu, Marketing PME - Ghana", time: "Il y a 5 jours" },
  { rating: 3, title: "Bien mais j'attendais plus!", text: "La stratégie était claire. Mais pour mon secteur (immobilier) j'aurais aimé plus de précision.", author: "Youssef Benali, Immobilier - Maroc", time: "Il y a 1 semaine" },
  { rating: 5, title: "Ma campagne TikTok a explosé!", text: "Je n'avais jamais osé TikTok Ads. MakeItAds m'a donné exactement quoi faire. 40.000 vues en 5 jours.", author: "Chloé Mbeki, Créatrice - Afrique du Sud", time: "Il y a 3 jours" },
  { rating: 4, title: "Professionnalisme et clarté!", text: "La qualité du document reçu était excellente. Structuré, clair, avec des recommandations concrètes.", author: "Emmanuel Tshilumba, Finance - RDC", time: "Il y a 6 jours" },
  { rating: 5, title: "La meilleure décision!", text: "J'hésitais entre payer une agence à 500.000 FCFA ou essayer MakeItAds. J'ai bien fait.", author: "Fatima Zahra El Idrissi, Boutique - Maroc", time: "Il y a 2 jours" },
  { rating: 5, title: "Simple, efficace, africain!", text: "Ce qui me plaît c'est qu'ils comprennent notre contexte. Le Mobile Money, les budgets modestes.", author: "Issa Ouédraogo, Commerçant - Burkina Faso", time: "Il y a 1 semaine" },
  { rating: 5, title: "Un gain de temps énorme", text: "Je n'avais pas le temps de me former au marketing. MakeItAds m'a mâché le travail.", author: "Koffi N'Guessan, Services - Côte d'Ivoire", time: "Il y a 4 jours" },
  { rating: 4, title: "Très bon rapport qualité-prix", text: "Pour le prix d'un repas, j'ai eu une stratégie qui a généré 15 nouveaux clients la première semaine.", author: "Aminata Sow, Esthétique - Sénégal", time: "Il y a 1 semaine" },
  { rating: 5, title: "Enfin des résultats concrets", text: "Fini les likes inutiles. MakeItAds m'a appris à viser les ventes. +30% de CA ce mois.", author: "Jean-Marc Ebogo, Formation - Cameroun", time: "Il y a 3 jours" },
  { rating: 5, title: "Support réactif et bienveillant", text: "J'ai posé des questions bêtes et on m'a répondu avec patience et pédagogie.", author: "Mariama Diallo, Mode - Mali", time: "Il y a 5 jours" },
  { rating: 4, title: "Je recommande vivement", text: "La stratégie était solide. J'ai juste dû adapter légèrement le ton pour ma niche.", author: "Ousmane Traoré, Agroalimentaire - Burkina Faso", time: "Il y a 1 semaine" },
];