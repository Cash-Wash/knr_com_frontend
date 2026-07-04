export type Equipement = {
  slug: string;
  categorie: string;
  nom: string;
  prix: string;
  prixJour: number;
  disponible: boolean;
  caution: string;
  img: string;
  images: string[];
  specs: { label: string; valeur: string }[];
  description: string;
  conditions: string[];
  joursReserves: number[];
};

export const equipements: Equipement[] = [
  {
    slug: "dji-mavic-3-pro",
    categorie: "Drones",
    nom: "DJI Mavic 3 Pro",
    prix: "45 000 FCFA",
    prixJour: 45000,
    disponible: true,
    caution: "500 000 FCFA",
    img: "/images/equipement.jpg",
    images: [
      "/images/equipement.jpg",
      "/images/emission.jpg",
      "/images/equipement.jpg",
    ],
    specs: [
      { label: "Résolution Vidéo", valeur: "5.1K / 50fps" },
      { label: "Autonomie", valeur: "43 minutes" },
      { label: "Capteur", valeur: "Hasselblad 4/3 CMOS" },
      { label: "Poids", valeur: "958g" },
    ],
    description: "Le DJI Mavic 3 Pro offre des performances d'imagerie exceptionnelles avec son système à triple caméra. Idéal pour les prises de vue cinématographiques aériennes, il garantit une qualité d'image professionnelle avec son capteur Hasselblad 4/3 CMOS.\n\nParfait pour les documentaires, les clips musicaux et les films d'entreprise nécessitant des plans aériens spectaculaires et stables.",
    conditions: [
      "Pièce d'identité valide requise",
      "Chèque de caution obligatoire",
      "Permis de télépilote recommandé",
      "Restitution dans l'état initial",
    ],
    joursReserves: [1, 4, 8, 9, 12, 16, 20, 21, 26, 27, 30],
  },
  {
    slug: "dji-mini-4-pro",
    categorie: "Drones",
    nom: "DJI Mini 4 Pro",
    prix: "25 000 FCFA",
    prixJour: 25000,
    disponible: true,
    caution: "250 000 FCFA",
    img: "/images/equipements/dji-mini-4-pro.jpg",
    images: ["/images/equipements/dji-mini-4-pro.jpg", "/images/equipements/dji-mini-4-pro.jpg", "/images/equipements/dji-mini-4-pro.jpg"],
    specs: [
      { label: "Résolution Vidéo", valeur: "4K / 60fps" },
      { label: "Autonomie", valeur: "34 minutes" },
      { label: "Capteur", valeur: "1/1.3\" CMOS" },
      { label: "Poids", valeur: "249g" },
    ],
    description: "Le DJI Mini 4 Pro est le drone compact parfait pour les créateurs de contenu. Ultra-léger et performant, il offre une qualité vidéo 4K avec des modes de vol intelligent.\n\nIdéal pour les voyages, les événements et les prises de vue légères ne nécessitant pas d'autorisation de vol dans de nombreuses zones.",
    conditions: [
      "Pièce d'identité valide requise",
      "Caution par chèque ou espèces",
      "Respect des zones de vol autorisées",
      "Restitution en bon état",
    ],
    joursReserves: [2, 3, 7, 13, 14, 19, 22, 25, 28],
  },
  {
    slug: "sony-fx3",
    categorie: "Caméras",
    nom: "Sony FX3",
    prix: "35 000 FCFA",
    prixJour: 35000,
    disponible: true,
    caution: "400 000 FCFA",
    img: "/images/equipements/sony-fx3.jpg",
    images: ["/images/equipements/sony-fx3.jpg", "/images/equipements/sony-fx3.jpg", "/images/equipements/sony-fx3.jpg"],
    specs: [
      { label: "Résolution Vidéo", valeur: "4K / 120fps" },
      { label: "Capteur", valeur: "Full-Frame 12.1MP" },
      { label: "Stabilisation", valeur: "5 axes actif" },
      { label: "Poids", valeur: "715g" },
    ],
    description: "La Sony FX3 est une caméra de cinéma compacte avec un capteur plein format. Elle offre une gamme dynamique exceptionnelle, une excellente performance en basse lumière et la stabilisation active SteadyShot.\n\nParfaite pour les films d'entreprise, clips musicaux, documentaires et tout projet nécessitant un rendu cinématographique professionnel.",
    conditions: [
      "Pièce d'identité valide requise",
      "Chèque de caution obligatoire",
      "Expérience caméra requise",
      "Restitution avec nettoyage capteur",
    ],
    joursReserves: [1, 5, 6, 11, 15, 18, 23, 24, 29],
  },
  {
    slug: "rode-wireless-pro",
    categorie: "Micros",
    nom: "Røde Wireless PRO",
    prix: "8 000 FCFA",
    prixJour: 8000,
    disponible: true,
    caution: "80 000 FCFA",
    img: "/images/equipements/rode-wireless.jpg",
    images: ["/images/equipements/rode-wireless.jpg", "/images/equipements/rode-wireless.jpg", "/images/equipements/rode-wireless.jpg"],
    specs: [
      { label: "Portée", valeur: "260 mètres" },
      { label: "Autonomie", valeur: "7 heures" },
      { label: "Format audio", valeur: "32-bit float" },
      { label: "Connectique", valeur: "USB-C / Jack 3.5mm" },
    ],
    description: "Le Røde Wireless PRO est le système de micro sans fil le plus avancé du marché. Il offre une qualité audio professionnelle avec enregistrement de sécurité intégré en 32-bit float.\n\nIdéal pour les interviews, reportages, captations événementielles et toute prise de son sur le terrain nécessitant une mobilité maximale.",
    conditions: [
      "Pièce d'identité valide requise",
      "Vérification du matériel au retrait",
      "Chargement complet avant restitution",
      "Restitution avec tous les accessoires",
    ],
    joursReserves: [3, 4, 9, 10, 17, 20, 25, 26],
  },
  {
    slug: "aputure-600d",
    categorie: "Éclairages",
    nom: "Aputure 600D Pro",
    prix: "20 000 FCFA",
    prixJour: 20000,
    disponible: false,
    caution: "200 000 FCFA",
    img: "/images/equipements/aputure-600d.jpg",
    images: ["/images/equipements/aputure-600d.jpg", "/images/equipements/aputure-600d.jpg", "/images/equipements/aputure-600d.jpg"],
    specs: [
      { label: "Puissance", valeur: "600W" },
      { label: "Température couleur", valeur: "5600K Daylight" },
      { label: "Rendu couleur", valeur: "CRI 96+" },
      { label: "Poids", valeur: "5.1 kg" },
    ],
    description: "L'Aputure 600D Pro est l'un des éclairages LED les plus puissants du marché pour la vidéo et la photographie. Son rendu de couleur exceptionnel (CRI 96+) garantit des images naturelles et professionnelles.\n\nParfait pour les studios, les tournages en extérieur nécessitant un grand volume de lumière, et les films d'entreprise haut de gamme.",
    conditions: [
      "Pièce d'identité valide requise",
      "Maîtrise de l'éclairage professionnel requise",
      "Transport avec précaution obligatoire",
      "Restitution avec ballast et accessoires",
    ],
    joursReserves: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14],
  },
  {
    slug: "canon-r5c",
    categorie: "Caméras",
    nom: "Canon EOS R5 C",
    prix: "40 000 FCFA",
    prixJour: 40000,
    disponible: true,
    caution: "450 000 FCFA",
    img: "/images/equipements/canon-r5c.jpg",
    images: ["/images/equipements/canon-r5c.jpg", "/images/equipements/canon-r5c.jpg", "/images/equipements/canon-r5c.jpg"],
    specs: [
      { label: "Résolution Vidéo", valeur: "8K RAW / 30fps" },
      { label: "Capteur", valeur: "Full-Frame 45MP" },
      { label: "Stabilisation", valeur: "IBIS 8 axes" },
      { label: "Poids", valeur: "680g" },
    ],
    description: "Le Canon EOS R5 C combine la puissance d'une caméra de cinéma avec la polyvalence d'un appareil photo hybride. La vidéo 8K RAW et le refroidissement actif font de lui l'outil ultime pour les productions haut de gamme.\n\nIdéal pour les longs métrages, documentaires ambitieux et toute production nécessitant la meilleure qualité d'image disponible.",
    conditions: [
      "Pièce d'identité valide requise",
      "Expérience avancée en vidéo requise",
      "Chèque de caution obligatoire",
      "Restitution avec nettoyage capteur inclus",
    ],
    joursReserves: [5, 6, 7, 11, 12, 19, 20, 27, 28],
  },
];
