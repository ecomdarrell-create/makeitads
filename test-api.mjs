const response = await fetch("http://localhost:3000/api/generate-strategy", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type_business: "E-commerce cosmétiques naturels",
    produit: "Savons artisanaux à base de karité et huiles essentielles pour peaux sensibles",
    client_ideal: "Femmes de 25 à 45 ans vivant à Abidjan, actives, soucieuses de leur apparence, qui ont déjà eu des réactions cutanées avec des produits classiques",
    zone_geographique: "Abidjan et banlieue (rayon 30 km)",
    budget_mensuel_fcfa: 50000,
    objectif: "Ventes directes via WhatsApp",
    moyens_paiement: ["Wave", "Orange Money", "Paiement à la livraison"],
    concurrents: "Cosmétiques importés, savons industriels, marques locales de karité",
  }),
});

const data = await response.json();
console.log(JSON.stringify(data, null, 2));