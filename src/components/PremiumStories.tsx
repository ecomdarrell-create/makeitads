"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight, X, TrendingUp, Clock, Award, ShieldCheck } from "lucide-react";

const PREMIUM_SUCCESS_STORIES = [
  {
    id: "s1", category: "success", 
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    name: "Aminata D.", age: 29, country: "Côte d'Ivoire", countryFlag: "🇨🇮", 
    profession: "Fondatrice E-commerce", company: "BabiStyle", rating: 5,
    quote: "MakeItAds a identifié des angles marketing que je n'avais jamais envisagés. Mes ventes ont triplé en 2 mois avec exactement le même budget publicitaire.",
    revenueBefore: "150k FCFA/mois", revenueAfter: "480k FCFA/mois", timeToResult: "2 mois", strategiesGenerated: 8,
    results: [{ metric: "Chiffre d'affaires", before: "150k", after: "480k" }, { metric: "Coût par achat", before: "3 500 F", after: "1 200 F" }],
    timeline: [{ event: "Achat du Pack Business", timeframe: "Janvier 2024" }, { event: "Ventes triplées", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "E-commerce", "Meta Ads"]
  },
  {
    id: "s2", category: "success",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face",
    name: "Moussa K.", age: 34, country: "Sénégal", countryFlag: "🇸🇳", 
    profession: "CEO Agence Digitale", company: "Dakar Growth", rating: 5,
    quote: "Nous avons réduit le coût d'acquisition de 60% pour nos clients. L'analyse concurrentielle fournie par l'outil vaut à elle seule 10 fois le prix du pack.",
    revenueBefore: "CAC 15 000 F", revenueAfter: "CAC 6 000 F", timeToResult: "3 mois", strategiesGenerated: 15,
    results: [{ metric: "Coût d'acquisition", before: "15 000 F", after: "6 000 F" }, { metric: "Taux de conversion", before: "1.2%", after: "3.8%" }],
    timeline: [{ event: "Intégration de l'outil", timeframe: "Mars 2024" }, { event: "CAC réduit de 60%", timeframe: "3 mois plus tard" }],
    badges: ["Vérifié", "Agence", "Google Ads"]
  },
  {
    id: "s3", category: "success",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=face",
    name: "Jean-Marc O.", age: 31, country: "Cameroun", countryFlag: "🇨🇲", 
    profession: "Fondateur Startup EdTech", company: "LearnCam", rating: 5,
    quote: "L'intelligence marché a été cruciale pour notre levée de fonds. Les investisseurs ont adoré notre approche basée sur des données locales concrètes.",
    revenueBefore: "0 FCFA", revenueAfter: "25 Millions FCFA levés", timeToResult: "4 mois", strategiesGenerated: 6,
    results: [{ metric: "Levée de fonds", before: "0 F", after: "25M F" }, { metric: "RdV Investisseurs", before: "2", after: "12" }],
    timeline: [{ event: "Génération de la stratégie", timeframe: "Février 2024" }, { event: "Seed round bouclé", timeframe: "4 mois plus tard" }],
    badges: ["Vérifié", "Startup", "Fundraising"]
  },
  {
    id: "f1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&h=150&fit=crop&crop=face",
    name: "Fatima S.", age: 28, country: "Bénin", countryFlag: "🇧🇯", 
    profession: "Fondatrice Marque de Beauté", company: "GlowBenin", rating: 5,
    quote: "Au lieu de deviner où investir notre budget, nous avons enfin eu un plan clair et adapté à notre réalité, avec des textes prêts à l'emploi.",
    revenueBefore: "80k FCFA/mois", revenueAfter: "210k FCFA/mois", timeToResult: "1 mois", strategiesGenerated: 4,
    results: [{ metric: "Leads WhatsApp", before: "+15%", after: "+65%" }, { metric: "Commandes", before: "10/mois", after: "35/mois" }],
    timeline: [{ event: "Lancement campagne", timeframe: "Avril 2024" }, { event: "Leads en hausse de 65%", timeframe: "30 jours plus tard" }],
    badges: ["Vérifié", "Beauté", "Meta Ads"]
  },
  {
    id: "f2", category: "founder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Koffi A.", age: 35, country: "Côte d'Ivoire", countryFlag: "🇨🇮", 
    profession: "Directeur Immobilier", company: "ImmoAbidjan", rating: 5,
    quote: "MakeItAds a identifié des segments d'audience que nous ignorions totalement. C'est comme avoir un directeur marketing senior en interne pour 7 500 FCFA.",
    revenueBefore: "ROAS 1.5x", revenueAfter: "ROAS 4.2x", timeToResult: "2 mois", strategiesGenerated: 10,
    results: [{ metric: "Retour sur pub (ROAS)", before: "1.5x", after: "4.2x" }, { metric: "Temps gagné", before: "15h/sem", after: "2h/sem" }],
    timeline: [{ event: "Optimisation des campagnes", timeframe: "Mai 2024" }, { event: "ROAS atteint 4.2x", timeframe: "45 jours plus tard" }],
    badges: ["Vérifié", "Immobilier", "Lead Gen"]
  },
  {
    id: "a1", category: "agency",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
    name: "Awa N.", age: 30, country: "Sénégal", countryFlag: "🇸🇳", 
    profession: "Directrice d'Agence", company: "ScaleAfrica", rating: 5,
    quote: "Cela a réduit notre temps de développement de stratégie de 2 semaines à 2 heures. Nous pouvons maintenant pitcher des stratégies basées sur les données dès le premier appel.",
    revenueBefore: "Taux de signature 20%", revenueAfter: "Taux de signature 55%", timeToResult: "2 mois", strategiesGenerated: 22,
    results: [{ metric: "Temps de préparation", before: "14 jours", after: "2 heures" }, { metric: "Taux de signature", before: "20%", after: "55%" }],
    timeline: [{ event: "Adoption de l'outil", timeframe: "Janvier 2024" }, { event: "Taux de signature doublé", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "Agence", "Sales Enablement"]
  },
  {
    id: "c1", category: "success",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    name: "Sophie L.", age: 33, country: "Cameroun", countryFlag: "🇨🇲", 
    profession: "Coach Sportif", company: "FitYaoundé", rating: 5,
    quote: "Je ne savais pas comment cibler les professionnels occupés. La stratégie a directement visé leurs douleurs (manque de temps) et mes inscriptions ont explosé.",
    revenueBefore: "12 clients/mois", revenueAfter: "38 clients/mois", timeToResult: "6 semaines", strategiesGenerated: 3,
    results: [{ metric: "Nouveaux clients", before: "12", after: "38" }, { metric: "Coût par lead", before: "4 000 F", after: "1 100 F" }],
    timeline: [{ event: "Pack Startup", timeframe: "Février 2024" }, { event: "File d'attente créée", timeframe: "6 semaines plus tard" }],
    badges: ["Vérifié", "Coach", "Meta Ads"]
  },
  {
    id: "c2", category: "founder",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    name: "Marc T.", age: 27, country: "Côte d'Ivoire", countryFlag: "🇨🇮", 
    profession: "Freelance Graphiste", company: "Marc Design", rating: 5,
    quote: "En tant que freelance, chaque franc compte. Le pack à 2 500 FCFA m'a donné une structure de campagne que j'ai pu lancer moi-même sans agence.",
    revenueBefore: "200k FCFA/mois", revenueAfter: "550k FCFA/mois", timeToResult: "2 mois", strategiesGenerated: 5,
    results: [{ metric: "Revenus", before: "200k", after: "550k" }, { metric: "Prospects qualifiés", before: "2/sem", after: "8/sem" }],
    timeline: [{ event: "Première stratégie", timeframe: "Mars 2024" }, { event: "Revenus x2.5", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "Freelance", "Meta Ads"]
  },
  {
    id: "p1", category: "success",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    name: "Omar B.", age: 42, country: "Sénégal", countryFlag: "🇸🇳", 
    profession: "Gérant PME", company: "Dakar Froid", rating: 5,
    quote: "Nous vendons des équipements professionnels. Le ciblage B2B généré était d'une précision chirurgicale. Nous avons signé 3 gros contrats en un mois.",
    revenueBefore: "1 contrat/mois", revenueAfter: "4 contrats/mois", timeToResult: "1 mois", strategiesGenerated: 2,
    results: [{ metric: "Contrats signés", before: "1", after: "4" }, { metric: "Valeur moyenne", before: "1.5M F", after: "2.1M F" }],
    timeline: [{ event: "Analyse marché", timeframe: "Avril 2024" }, { event: "3 gros contrats", timeframe: "30 jours plus tard" }],
    badges: ["Vérifié", "PME B2B", "LinkedIn/Meta"]
  },
  {
    id: "cr1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
    name: "Julien K.", age: 26, country: "Bénin", countryFlag: "🇧🇯", 
    profession: "Créateur de Contenu", company: "JuliTech", rating: 5,
    quote: "Je voulais monétiser ma communauté. La stratégie m'a montré exactement quel produit digital créer et comment le promouvoir sans paraître 'vendeur'.",
    revenueBefore: "0 FCFA", revenueAfter: "320k FCFA/mois", timeToResult: "1 mois", strategiesGenerated: 4,
    results: [{ metric: "Ventes formation", before: "0", after: "64" }, { metric: "Taux de conversion", before: "0%", after: "2.4%" }],
    timeline: [{ event: "Lancement produit", timeframe: "Mai 2024" }, { event: "64 ventes", timeframe: "30 jours plus tard" }],
    badges: ["Vérifié", "Créateur", "Meta Ads"]
  },
  {
    id: "sl1", category: "success",
    avatar: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f43?w=150&h=150&fit=crop&crop=face",
    name: "Aïcha M.", age: 38, country: "Mali", countryFlag: "🇲🇱", 
    profession: "Service de Livraison", company: "Bamako Express", rating: 5,
    quote: "La concurrence est rude sur la livraison. L'angle 'fiabilité et suivi en temps réel' recommandé par MakeItAds nous a totalement différenciés.",
    revenueBefore: "150 courses/jour", revenueAfter: "280 courses/jour", timeToResult: "2 mois", strategiesGenerated: 6,
    results: [{ metric: "Courses quotidiennes", before: "150", after: "280" }, { metric: "Coût d'acquisition", before: "800 F", after: "450 F" }],
    timeline: [{ event: "Nouveau positionnement", timeframe: "Janvier 2024" }, { event: "Presque x2 en volume", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "Service Local", "Meta Ads"]
  },
  {
    id: "i1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=150&h=150&fit=crop&crop=face",
    name: "David R.", age: 31, country: "Côte d'Ivoire", countryFlag: "🇨🇮", 
    profession: "Infopreneur", company: "Business Masterclass", rating: 5,
    quote: "Mes webinaires ne se remplissaient plus. La nouvelle séquence de publicités et l'angle 'étude de cas réelle' ont fait remonter mes inscriptions de 300%.",
    revenueBefore: "45 inscrits/webinaire", revenueAfter: "180 inscrits/webinaire", timeToResult: "3 semaines", strategiesGenerated: 3,
    results: [{ metric: "Inscriptions", before: "45", after: "180" }, { metric: "Coût par inscrit", before: "2 500 F", after: "900 F" }],
    timeline: [{ event: "Refonte campagne", timeframe: "Mars 2024" }, { event: "Webinaire complet", timeframe: "3 semaines plus tard" }],
    badges: ["Vérifié", "Infopreneur", "Meta Ads"]
  },
  {
    id: "b1", category: "agency",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    name: "Thomas N.", age: 36, country: "Cameroun", countryFlag: "🇨🇲", 
    profession: "Consultant B2B", company: "StratConsult", rating: 5,
    quote: "J'utilise MakeItAds pour préparer mes recommandations clients. Cela me fait gagner un temps fou et le rendu est ultra professionnel.",
    revenueBefore: "2 clients/mois", revenueAfter: "6 clients/mois", timeToResult: "2 mois", strategiesGenerated: 12,
    results: [{ metric: "Nouveaux clients", before: "2", after: "6" }, { metric: "Temps de préparation", before: "8h", after: "1h" }],
    timeline: [{ event: "Intégration outil", timeframe: "Février 2024" }, { event: "Triplement du CA", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "B2B", "Consulting"]
  },
  {
    id: "r1", category: "success",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Nadia F.", age: 29, country: "Sénégal", countryFlag: "🇸🇳", 
    profession: "Restauratrice", company: "Le Coin des Épices", rating: 5,
    quote: "Nous avons rempli notre restaurant les soirs de semaine grâce au ciblage local précis et aux textes appétissants générés par l'outil.",
    revenueBefore: "40% de remplissage", revenueAfter: "85% de remplissage", timeToResult: "1 mois", strategiesGenerated: 4,
    results: [{ metric: "Remplissage soir", before: "40%", after: "85%" }, { metric: "Réservations", before: "5/jour", after: "18/jour" }],
    timeline: [{ event: "Campagne locale", timeframe: "Avril 2024" }, { event: "Complet le week-end", timeframe: "1 mois plus tard" }],
    badges: ["Vérifié", "Restauration", "Meta Ads"]
  },
  {
    id: "h1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    name: "Dr. Koné A.", age: 45, country: "Côte d'Ivoire", countryFlag: "🇨🇮", 
    profession: "Directeur Clinique", company: "Santé Plus", rating: 5,
    quote: "Le ton recommandé était à la fois professionnel et rassurant, ce qui est crucial dans la santé. Nos prises de rendez-vous en ligne ont décollé.",
    revenueBefore: "20 RDV/mois", revenueAfter: "75 RDV/mois", timeToResult: "2 mois", strategiesGenerated: 5,
    results: [{ metric: "RDV en ligne", before: "20", after: "75" }, { metric: "Coût par RDV", before: "5 000 F", after: "1 800 F" }],
    timeline: [{ event: "Lancement digital", timeframe: "Janvier 2024" }, { event: "File d'attente", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "Santé", "Meta Ads"]
  },
  {
    id: "ar1", category: "success",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Yves D.", age: 33, country: "Bénin", countryFlag: "🇧🇯", 
    profession: "Artisan d'Art", company: "Terre & Feu", rating: 5,
    quote: "Je ne connaissais rien au marketing digital. Le guide visuel et les textes m'ont permis de vendre mes créations à l'international.",
    revenueBefore: "5 ventes/mois", revenueAfter: "22 ventes/mois", timeToResult: "2 mois", strategiesGenerated: 3,
    results: [{ metric: "Ventes", before: "5", after: "22" }, { metric: "Portée géographique", before: "Locale", after: "Internationale" }],
    timeline: [{ event: "Première stratégie", timeframe: "Mars 2024" }, { event: "Expéditions hors pays", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "Artisanat", "Meta Ads"]
  },
  {
    id: "t1", category: "agency",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Samuel E.", age: 30, country: "Cameroun", countryFlag: "🇨🇲", 
    profession: "Fondateur SaaS", company: "FactureFacile", rating: 5,
    quote: "L'analyse des concurrents nous a révélé une faille dans leur service client. Nous avons bâti toute notre campagne là-dessus. Résultat : +40% d'essais gratuits.",
    revenueBefore: "50 essais/mois", revenueAfter: "120 essais/mois", timeToResult: "1 mois", strategiesGenerated: 4,
    results: [{ metric: "Essais gratuits", before: "50", after: "120" }, { metric: "Conversion payante", before: "8%", after: "14%" }],
    timeline: [{ event: "Audit concurrentiel", timeframe: "Février 2024" }, { event: "Croissance 40%", timeframe: "1 mois plus tard" }],
    badges: ["Vérifié", "Tech/SaaS", "Google Ads"]
  },
  {
    id: "fa1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Clara M.", age: 27, country: "Côte d'Ivoire", countryFlag: "🇨🇮", 
    profession: "Fondatrice Mode", company: "Wax Chic", rating: 5,
    quote: "Les 9 variantes de copies du pack Business m'ont permis de tester 3 angles différents simultanément. J'ai trouvé mon message gagnant en 4 jours.",
    revenueBefore: "300k FCFA/mois", revenueAfter: "850k FCFA/mois", timeToResult: "1 mois", strategiesGenerated: 9,
    results: [{ metric: "Chiffre d'affaires", before: "300k", after: "850k" }, { metric: "ROAS", before: "1.8x", after: "3.5x" }],
    timeline: [{ event: "Pack Business", timeframe: "Avril 2024" }, { event: "Message gagnant trouvé", timeframe: "4 jours plus tard" }],
    badges: ["Vérifié", "Mode", "Meta Ads"]
  },
  {
    id: "im1", category: "success",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Patrick L.", age: 39, country: "Gabon", countryFlag: "🇬🇦", 
    profession: "Agent Immobilier", company: "ImmoLibreville", rating: 5,
    quote: "Le ciblage par quartier et par niveau de revenu suggéré par l'IA était d'une justesse impressionnante. J'ai vendu 2 appartements en 3 semaines.",
    revenueBefore: "1 vente / 2 mois", revenueAfter: "2 ventes / 3 semaines", timeToResult: "3 semaines", strategiesGenerated: 3,
    results: [{ metric: "Ventes", before: "1/2 mois", after: "2/3 sem" }, { metric: "Leads qualifiés", before: "5/mois", after: "18/mois" }],
    timeline: [{ event: "Nouvelle campagne", timeframe: "Mars 2024" }, { event: "2 ventes conclues", timeframe: "3 semaines plus tard" }],
    badges: ["Vérifié", "Immobilier", "Meta Ads"]
  },
  {
    id: "fo1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&h=150&fit=crop&crop=face",
    name: "Amina S.", age: 34, country: "Sénégal", countryFlag: "🇸🇳", 
    profession: "Formatrice", company: "Excel Pro Dakar", rating: 5,
    quote: "Je formais dans le vide. MakeItAds m'a aidée à identifier la douleur exacte de ma cible (la peur de l'ordinateur au travail) et à adapter mon discours.",
    revenueBefore: "4 inscrits/session", revenueAfter: "18 inscrits/session", timeToResult: "1 mois", strategiesGenerated: 4,
    results: [{ metric: "Inscriptions", before: "4", after: "18" }, { metric: "Taux de remplissage", before: "30%", after: "90%" }],
    timeline: [{ event: "Refonte messaging", timeframe: "Janvier 2024" }, { event: "Sessions complètes", timeframe: "1 mois plus tard" }],
    badges: ["Vérifié", "Formation", "Meta Ads"]
  },
  {
    id: "lo1", category: "success",
    avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488058?w=150&h=150&fit=crop&crop=face",
    name: "Ibrahim T.", age: 41, country: "Mali", countryFlag: "🇲🇱", 
    profession: "Logistique", company: "Mali Transport", rating: 5,
    quote: "Un outil simple qui va droit au but. La stratégie pour cibler les commerçants du marché a généré plus de demandes en une semaine qu'en un mois auparavant.",
    revenueBefore: "10 demandes/sem", revenueAfter: "35 demandes/sem", timeToResult: "1 semaine", strategiesGenerated: 2,
    results: [{ metric: "Demandes", before: "10/sem", after: "35/sem" }, { metric: "Coût par lead", before: "1 500 F", after: "600 F" }],
    timeline: [{ event: "Lancement test", timeframe: "Février 2024" }, { event: "Explosion des leads", timeframe: "1 semaine plus tard" }],
    badges: ["Vérifié", "Logistique", "Meta Ads"]
  },
  {
    id: "be1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    name: "Grace K.", age: 26, country: "Cameroun", countryFlag: "🇨🇲", 
    profession: "Esthéticienne", company: "Glow Douala", rating: 5,
    quote: "Le guide pour créer les visuels sur Canva m'a sauvée. Je n'ai pas eu à payer un graphiste, et mes publicités ont l'air ultra professionnelles.",
    revenueBefore: "15 RDV/sem", revenueAfter: "32 RDV/sem", timeToResult: "3 semaines", strategiesGenerated: 3,
    results: [{ metric: "Rendez-vous", before: "15/sem", after: "32/sem" }, { metric: "Nouveaux clients", before: "3/sem", after: "12/sem" }],
    timeline: [{ event: "Création visuels", timeframe: "Mars 2024" }, { event: "Agenda plein", timeframe: "3 semaines plus tard" }],
    badges: ["Vérifié", "Beauté", "Meta Ads"]
  },
  {
    id: "fi1", category: "agency",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    name: "Robert M.", age: 37, country: "Côte d'Ivoire", countryFlag: "🇨🇮", 
    profession: "Conseiller Financier", company: "Patrimoine CI", rating: 5,
    quote: "La crédibilité est tout dans la finance. Les angles axés sur la 'sécurité et la transparence' ont parfaitement résonné avec ma clientèle haut de gamme.",
    revenueBefore: "2 nouveaux clients/mois", revenueAfter: "7 nouveaux clients/mois", timeToResult: "2 mois", strategiesGenerated: 5,
    results: [{ metric: "Nouveaux clients", before: "2", after: "7" }, { metric: "Actifs sous gestion", before: "+50M F", after: "+180M F" }],
    timeline: [{ event: "Nouveau positionnement", timeframe: "Janvier 2024" }, { event: "Confiance établie", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "Finance", "LinkedIn/Meta"]
  },
  {
    id: "ag1", category: "success",
    avatar: "https://images.unsplash.com/photo-1504257432389-5904bd08d252?w=150&h=150&fit=crop&crop=face",
    name: "Kader D.", age: 32, country: "Bénin", countryFlag: "🇧🇯", 
    profession: "Agro-business", company: "Bio Bénin", rating: 5,
    quote: "Exporter nos produits semblait impossible. La stratégie a identifié les bons groupes Facebook et les arguments 'qualité locale' qui ont convaincu les acheteurs.",
    revenueBefore: "Vente locale uniquement", revenueAfter: "3 commandes export/mois", timeToResult: "2 mois", strategiesGenerated: 4,
    results: [{ metric: "Marché", before: "Local", after: "Sous-régional" }, { metric: "Marge moyenne", before: "15%", after: "35%" }],
    timeline: [{ event: "Stratégie export", timeframe: "Février 2024" }, { event: "Premières expéditions", timeframe: "2 mois plus tard" }],
    badges: ["Vérifié", "Agroalimentaire", "Meta Ads"]
  }
];

type Variant = "top" | "bottom";

export default function PremiumStories({ variant = "bottom" }: { variant?: Variant }) {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPaused || !scrollRef.current) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const newPosition = scrollPosition + 0.5;
        const maxScroll = scrollRef.current.scrollWidth / 2;
        if (newPosition >= maxScroll) {
          setScrollPosition(0);
          scrollRef.current.scrollLeft = 0;
        } else {
          setScrollPosition(newPosition);
          scrollRef.current.scrollLeft = newPosition;
        }
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isPaused, scrollPosition]);

  const duplicatedStories = [...PREMIUM_SUCCESS_STORIES, ...PREMIUM_SUCCESS_STORIES];

  const getBorderColor = (category: string) => {
    switch (category) {
      case "success": return "from-[#6366f1] via-[#8b5cf6] to-[#a78bfa]";
      case "founder": return "from-[#38bdf8] via-[#6366f1] to-[#8b5cf6]";
      case "agency": return "from-amber-400 via-amber-500 to-orange-500";
      default: return "from-[#E7E7EB] via-[#E7E7EB] to-[#E7E7EB]";
    }
  };

  return (
    <section className={`relative z-10 py-16 md:py-24 overflow-hidden ${variant === "top" ? "bg-[#F7F7F8]" : "bg-[#FFFFFF]"}`}>
      {/* ✅ Header centré avec padding desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 md:mb-14">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 flex items-center justify-center rounded-sm">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              ))}
            </div>
            <span className="text-sm sm:text-base font-bold text-[#18181B] ml-2">4.9 / 5</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#18181B] mb-2">
            Approuvé par des centaines d'entrepreneurs en Afrique
          </h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              100% Clients Vérifiés
            </span>
            <span className="text-xs text-[#71717A]">Mis à jour quotidiennement</span>
          </div>
        </div>
      </div>

      {/* ✅ Carrousel edge-to-edge sur mobile */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 py-4 overflow-x-auto scrollbar-hide px-4 sm:px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          {duplicatedStories.map((story, index) => (
            <motion.button
              key={`${story.id}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: (index % PREMIUM_SUCCESS_STORIES.length) * 0.03 }}
              onClick={() => setSelectedStory(story)}
              className="group relative flex-shrink-0 flex flex-col items-center gap-2 focus:outline-none"
            >
              <div className={`relative p-0.5 rounded-full bg-gradient-to-br ${getBorderColor(story.category)} group-hover:scale-105 transition-transform duration-200`}>
                <div className="bg-white p-0.5 rounded-full">
                  <Image src={story.avatar} alt={story.name} width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" loading="lazy" quality={85} />
                </div>
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                  <div className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full flex items-center justify-center ${story.category === "success" ? "bg-[#6366f1]" : story.category === "founder" ? "bg-[#38bdf8]" : "bg-amber-500"}`}>
                    <Award className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] sm:text-xs font-semibold text-[#18181B] truncate max-w-[70px] sm:max-w-[80px]">{story.name.split(" ")[0]}</p>
                <p className="text-[9px] text-[#71717A] truncate max-w-[70px] sm:max-w-[80px]">{story.company}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedStory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 z-50 bg-[#18181B]/40 backdrop-blur-sm"
            />
            {/* ✅ MODAL RESPONSIVE OPTIMISÉ : Compact sur mobile, spacieux sur desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4"
            >
              <div className="relative w-full md:max-w-2xl max-h-[85vh] md:max-h-[85vh] bg-white md:rounded-[24px] rounded-t-[24px] shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col border border-[#E7E7EB]">
                
                <button
                  onClick={() => setSelectedStory(null)}
                  className="sticky top-3 right-3 z-20 ml-auto p-2 rounded-full bg-white border border-[#E7E7EB] text-[#71717A] hover:text-[#18181B] hover:bg-[#F7F7F8] transition-colors md:absolute md:top-4 md:right-4"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                  {/* Sidebar du modal (Informations profil) */}
                  <div className="md:w-[260px] bg-[#F7F7F8] p-4 md:p-6 border-b md:border-b-0 md:border-r border-[#E7E7EB] flex-shrink-0">
                    <div className="flex flex-col items-center text-center">
                      <Image src={selectedStory.avatar} alt={selectedStory.name} width={80} height={80} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shadow-sm mb-3" />
                      <h3 className="text-base md:text-lg font-bold text-[#18181B] mb-0.5">{selectedStory.name}</h3>
                      <p className="text-xs md:text-sm text-[#71717A] mb-0.5">{selectedStory.profession}</p>
                      <p className="text-[10px] md:text-xs text-[#71717A] mb-3">{selectedStory.company}</p>
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-[#71717A] mb-4">
                        <span>{selectedStory.countryFlag}</span>
                        <span>{selectedStory.country}</span>
                        <span>•</span>
                        <span>{selectedStory.age} ans</span>
                      </div>

                      <div className="flex items-center gap-0.5 mb-4">
                        {[...Array(selectedStory.rating)].map((_, i) => (
                          <div key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 bg-emerald-500 flex items-center justify-center rounded-sm">
                            <svg viewBox="0 0 24 24" fill="white" className="w-2 h-2 md:w-2.5 md:h-2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          </div>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 mb-4">
                        <CheckCircle2 className="h-3 w-3" /> Client Vérifié
                      </span>

                      <div className="w-full space-y-2">
                        <div className="bg-white rounded-lg border border-[#E7E7EB] p-2.5 shadow-sm">
                          <p className="text-[9px] font-semibold text-[#71717A] uppercase tracking-wider mb-1">Résultat principal</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[#94A3B8] line-through">{selectedStory.revenueBefore}</span>
                            <ArrowRight className="h-2.5 w-2.5 text-[#6366f1]" />
                            <span className="text-xs font-bold text-[#18181B]">{selectedStory.revenueAfter}</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border border-[#E7E7EB] p-2.5 shadow-sm">
                          <p className="text-[9px] font-semibold text-[#71717A] uppercase tracking-wider mb-1">Temps</p>
                          <p className="text-xs font-bold text-[#18181B]">{selectedStory.timeToResult}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu principal du modal */}
                  <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <blockquote className="text-sm md:text-base text-[#71717A] leading-relaxed mb-6 font-medium italic border-l-2 border-[#6366f1]/30 pl-4">
                      "{selectedStory.quote}"
                    </blockquote>

                    <div className="mb-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-3 flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-[#6366f1]" /> Résultats Mesurables
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedStory.results.map((res: any, i: number) => (
                          <div key={i} className="rounded-lg bg-[#EEF2FF] border border-[#6366f1]/10 p-2.5 text-center">
                            <p className="text-[9px] font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">{res.metric}</p>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[10px] text-[#94A3B8] line-through">{res.before}</span>
                              <ArrowRight className="h-2.5 w-2.5 text-[#6366f1]" />
                              <span className="text-xs font-bold text-[#18181B]">{res.after}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-3 flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#6366f1]" /> Chronologie
                      </h4>
                      <div className="space-y-3 pl-1">
                        {selectedStory.timeline.map((item: any, i: number) => (
                          <div key={i} className="relative flex items-start gap-2.5">
                            {i < selectedStory.timeline.length - 1 && <div className="absolute left-[6px] top-5 bottom-[-12px] w-0.5 bg-[#E7E7EB]" />}
                            <div className="relative z-10 h-3.5 w-3.5 rounded-full bg-[#6366f1] border-2 border-white shadow-sm mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-[#18181B]">{item.event}</p>
                              <p className="text-[10px] text-[#71717A]">{item.timeframe}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E7E7EB] mt-auto">
                      <a href="/dashboard/credits" className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#5558e6] transition-all">
                        Obtenir des crédits <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                      <button onClick={() => setSelectedStory(null)} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[#E7E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#71717A] hover:bg-[#F7F7F8] transition-colors">
                        Fermer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}