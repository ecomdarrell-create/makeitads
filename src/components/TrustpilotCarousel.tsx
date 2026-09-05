"use client";

import { useRef } from "react";
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
  title: string;
  footerNote: string;
}

function StarRating({ rating }: { rating: number }) {
  const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  return (
    <div className="flex gap-[1px] md:gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 24 24" className="w-[14px] h-[14px] md:w-[20px] md:h-[20px]" fill={star <= rating ? "#00B67A" : "#DCDCE6"}>
          <path d={starPath} />
        </svg>
      ))}
    </div>
  );
}

export default function TrustpilotCarousel({ reviews, title, footerNote }: TrustpilotCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const isMobile = window.innerWidth < 768;
      const scrollAmount = isMobile ? 296 : 396;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section className="relative z-10 py-10 md:py-16 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg md:text-2xl font-bold text-[#1A1A1A] mb-6 md:mb-8 text-center md:text-left">
          {title}
        </h2>

        <div className="relative group">
          {/* Flèche Gauche (Toujours visible sur mobile, hover sur desktop) */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E8E8E8] shadow-sm flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Avis précédent"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
            
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] md:w-[380px] snap-start bg-white border border-[#E8E8E8] rounded-[12px] p-4 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={review.rating} />
                  {/* Badge Bleu "Avis certifié" */}
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                    <span className="text-[10px] md:text-xs font-semibold text-blue-600">Avis certifié</span>
                  </div>
                </div>

                <h3 className="text-[13px] md:text-[15px] font-bold text-[#1A1A1A] mb-2 leading-tight">
                  {review.title}
                </h3>

                <p className="text-[12px] md:text-[14px] text-[#4A4A4A] leading-[1.5] md:leading-[1.6] mb-4">
                  {review.text}
                </p>

                <div className="border-t border-[#F0F0F0] pt-3">
                  <p className="text-[11px] md:text-[12px] text-[#6B6B6B] font-medium mb-1">
                    {review.author}
                  </p>
                  <p className="text-[10px] md:text-[11px] text-[#9CA3AF]">
                    {review.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Flèche Droite (Toujours visible sur mobile, hover sur desktop) */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E8E8E8] shadow-sm flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Avis suivant"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 text-center md:text-left">
          <p className="text-xs md:text-sm text-[#4A4A4A] font-medium">{footerNote}</p>
          <span className="text-[#00B67A] font-bold text-base md:text-lg tracking-tight flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Trustpilot
          </span>
        </div>
      </div>
    </section>
  );
}

export const section1Reviews: Review[] = [
  { rating: 5, title: "Exactement ce dont j'avais besoin!", text: "En moins de 24h j'avais une stratégie complète pour mes publicités Meta. Ciblage précis, messages clairs, budget bien réparti. J'ai lancé et les résultats sont là dès la première semaine.", author: "Aminata Diallo, E-commerce mode — Sénégal", time: "Il y a 2 jours" },
  { rating: 4, title: "Très bonne approche, je recommande!", text: "J'étais sceptique au départ mais la stratégie reçue était vraiment personnalisée. Pas du tout générique. On sentait que quelqu'un avait vraiment analysé mon business. Je reviendrai.", author: "Kwame Asante, Coach — Ghana", time: "Il y a 5 jours" },
  { rating: 5, title: "Ma première campagne rentable enfin!", text: "Après 4 mois à dépenser sans résultats, j'ai enfin une direction claire. MakeItAds m'a dit exactement sur quelle plateforme aller et quoi dire. Premier mois: ROI positif. Incroyable!", author: "Fatoumata Koné, Cosmétiques — Côte d'Ivoire", time: "Il y a 1 semaine" },
  { rating: 3, title: "Bon service, quelques ajustements.", text: "La stratégie était claire et bien structurée. J'aurais aimé plus de détails sur le retargeting mais globalement le travail est sérieux et la réactivité est bonne.", author: "Thomas Girard, Consultant — France", time: "Il y a 3 jours" },
  { rating: 5, title: "Le meilleur investissement de mon année!", text: "Je gérais une boutique en ligne depuis 2 ans sans vraiment maîtriser la publicité. MakeItAds m'a ouvert les yeux. Maintenant je vends tous les jours.", author: "Blessing Okafor, Boutique — Nigeria", time: "Il y a 4 jours" },
  { rating: 4, title: "Stratégie claire et actionnable!", text: "J'ai apprécié la précision des recommandations. Chaque message publicitaire était prêt à copier-coller. Résultats satisfaisants dès la deuxième semaine.", author: "Mariam Traoré, Formatrice — Mali", time: "Il y a 6 jours" },
  { rating: 5, title: "Enfin quelqu'un qui comprend l'Afrique!", text: "Ce qui m'a frappé c'est que la stratégie tenait compte de mon marché réel. Pas des conseils copiés depuis des blogs américains. Du concret, adapté à mon contexte.", author: "Jean-Baptiste Mongo, Restaurateur — Cameroun", time: "Il y a 2 semaines" },
  { rating: 4, title: "Réactif et professionnel!", text: "J'ai eu ma stratégie en moins de 24h comme promis. Le niveau de détail était impressionnant. Je m'attendais à quelque chose de basique et j'ai eu une vraie analyse.", author: "Nadia Bensalem, Agence de voyage — Tunisie", time: "Il y a 1 semaine" },
  { rating: 5, title: "Mes ventes ont doublé en 3 semaines!", text: "Je vendais des vêtements depuis 8 mois avec très peu de résultats. MakeItAds m'a donné une stratégie TikTok que je n'aurais jamais pensé à utiliser.", author: "Awa Sylla, Créatrice de mode — Sénégal", time: "Il y a 5 jours" },
  { rating: 3, title: "Bon mais peut faire mieux!", text: "La stratégie était correcte mais j'aurais souhaité plus de variantes de messages. Le service reste sérieux et je reviendrai pour tester le plan Pro.", author: "Samuel Mensah, Informatique — Ghana", time: "Il y a 1 semaine" },
  { rating: 5, title: "Transformation totale de mon business", text: "Je ne savais pas par où commencer. Le diagnostic gratuit m'a donné une feuille de route claire. J'ai souscrit au plan Pro et c'est le meilleur choix que j'ai fait.", author: "Omar Diop, Services B2B — Sénégal", time: "Il y a 3 jours" },
  { rating: 5, title: "Enfin de la clarté dans mes dépenses", text: "Avant, je jetais l'argent par les fenêtres. Maintenant, chaque franc est investi avec une intention précise. Merci pour cette approche méthodique.", author: "Aïcha Koné, Artisanat — Côte d'Ivoire", time: "Il y a 4 jours" },
  { rating: 4, title: "Service client au top", text: "J'ai eu une question sur mon ciblage et l'équipe a répondu en moins d'une heure sur Telegram. Ce niveau de support est rare.", author: "David Mensah, Tech Startup — Ghana", time: "Il y a 1 semaine" },
  { rating: 5, title: "Rentabilité au rendez-vous", text: "Dès la première semaine d'application de la stratégie, mon coût par acquisition a chuté de 40%. Je recommande à 100%.", author: "Fatima Zahra, E-commerce — Maroc", time: "Il y a 2 jours" },
  { rating: 5, title: "Simple, efficace, africain!", text: "Pas de jargon compliqué, juste des actions concrètes adaptées à notre réalité de Mobile Money et de WhatsApp. Bravo.", author: "Issa Ouédraogo, Commerce — Burkina Faso", time: "Il y a 1 semaine" },
];

export const section2Reviews: Review[] = [
  { rating: 5, title: "Stratégie reçue, commandes rentrées!", text: "La séquence a été parfaite. Formulaire lundi, stratégie mardi, lancé mercredi, premières commandes jeudi. Je n'aurais pas cru que c'était possible aussi vite.", author: "Rokhaya Fall, Bijouterie — Sénégal", time: "Il y a 3 jours" },
  { rating: 4, title: "Vraiment adapté à mon secteur!", text: "Les recommandations correspondaient vraiment à mon secteur, mon audience et mon budget. Du sur-mesure à ce prix c'est rare.", author: "Léa Fontaine, Coach bien-être — Belgique", time: "Il y a 4 jours" },
  { rating: 5, title: "Je ne perds plus d'argent en publicité!", text: "Avant je jetais 200.000 FCFA par mois sans résultats. Maintenant avec la moitié du budget j'ai trois fois plus de résultats. La stratégie a tout changé.", author: "Moussa Coulibaly, Grossiste — Côte d'Ivoire", time: "Il y a 1 semaine" },
  { rating: 4, title: "Service sérieux et livraison rapide!", text: "Très satisfait de la qualité de l'analyse. On voit que du travail réel a été fait. J'enlève une étoile car j'aurais aimé un suivi après livraison.", author: "Idriss Mahamat, BTP — Tchad", time: "Il y a 2 semaines" },
  { rating: 5, title: "Un service que tout entrepreneur devrait utiliser!", text: "Je recommande MakeItAds à tous mes amis. Pas parce qu'on me le demande, mais parce que j'ai vu ce que ça fait concrètement sur mes résultats.", author: "Grace Asiedu, Marketing PME — Ghana", time: "Il y a 5 jours" },
  { rating: 3, title: "Bien mais j'attendais plus de détails!", text: "La stratégie était claire. Mais pour mon secteur spécifique (immobilier) j'aurais aimé des recommandations encore plus pointues. Je tenterai le plan Premium.", author: "Youssef Benali, Immobilier — Maroc", time: "Il y a 1 semaine" },
  { rating: 5, title: "Ma première campagne TikTok a explosé!", text: "Je n'avais jamais osé TikTok Ads. MakeItAds m'a donné exactement quoi faire, comment cibler et quoi dire. 40.000 vues en 5 jours.", author: "Chloé Mbeki, Créatrice — Afrique du Sud", time: "Il y a 3 jours" },
  { rating: 4, title: "Professionnalisme et clarté!", text: "J'ai été agréablement surpris par la qualité du document reçu. Structuré, clair, avec des recommandations concrètes. Je reviendrai.", author: "Emmanuel Tshilumba, Finance — RDC", time: "Il y a 6 jours" },
  { rating: 5, title: "La meilleure décision pour mon business!", text: "J'hésitais entre payer une agence à 500.000 FCFA ou essayer MakeItAds. J'ai bien fait. Le résultat est aussi bon et j'ai économisé énormément.", author: "Fatima Zahra El Idrissi, Boutique — Maroc", time: "Il y a 2 jours" },
  { rating: 5, title: "Simple, efficace, africain!", text: "Ce qui me plaît c'est qu'ils comprennent notre contexte. Le Mobile Money, les budgets modestes, les marchés locaux. Pas un service adapté en catastrophe.", author: "Issa Ouédraogo, Commerçant — Burkina Faso", time: "Il y a 1 semaine" },
  { rating: 5, title: "Un gain de temps énorme", text: "Je n'avais pas le temps de me former au marketing. MakeItAds m'a mâché le travail. Je n'ai eu qu'à copier-coller et lancer.", author: "Koffi N'Guessan, Services — Côte d'Ivoire", time: "Il y a 4 jours" },
  { rating: 4, title: "Très bon rapport qualité-prix", text: "Pour le prix d'un repas au restaurant, j'ai eu une stratégie qui a généré 15 nouveaux clients la première semaine. Incroyable.", author: "Aminata Sow, Esthétique — Sénégal", time: "Il y a 1 semaine" },
  { rating: 5, title: "Enfin des résultats concrets", text: "Fini les likes inutiles. MakeItAds m'a appris à viser les ventes. Mon chiffre d'affaires a augmenté de 30% ce mois-ci.", author: "Jean-Marc Ebogo, Formation — Cameroun", time: "Il y a 3 jours" },
  { rating: 5, title: "Support réactif et bienveillant", text: "J'ai posé des questions bêtes et on m'a répondu avec patience et pédagogie. On sent vraiment l'envie de nous voir réussir.", author: "Mariama Diallo, Mode — Mali", time: "Il y a 5 jours" },
  { rating: 4, title: "Je recommande vivement", text: "La stratégie était solide. J'ai juste dû adapter légèrement le ton pour ma niche, mais la structure était parfaite.", author: "Ousmane Traoré, Agroalimentaire — Burkina Faso", time: "Il y a 1 semaine" },
];