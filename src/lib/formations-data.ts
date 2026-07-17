export type Formation = {
  slug: string;
  categorie: string;
  titre: string;
  sousTitre: string;
  description: string;
  prix: string;
  duree: string;
  niveau: string;
  lieu: string;
  debut: string;
  fin: string;
  placesRestantes: number;
  joursClotureInscription: number;
  clotureInscriptions?: string;
  img: string;
  competences: string[];
  modules: { numero: number; label: string; titre: string; desc: string }[];
  formateur: {
    nom: string;
    titre: string;
    bio: string;
    photo: string;
  };
};

export const formations: Formation[] = [
  {
    slug: "communication-digitale-social-media",
    categorie: "Marketing",
    titre: "Communication digitale & Social Media",
    sousTitre: "Résine époxy",
    description:
      "Maîtrisez les outils et stratégies de la communication digitale pour développer la visibilité d'une marque ou d'une entreprise. Cette formation pratique vous plonge au cœur des réalités du community management, de la création de contenu et de la publicité en ligne.",
    prix: "150 000 XOF",
    duree: "3 mois (120 heures)",
    niveau: "Débutant à Intermédiaire",
    lieu: "KNR COM, BENIN (Cotonou)",
    debut: "15 Octobre 2026",
    fin: "15 Janvier 2027",
    placesRestantes: 5,
    joursClotureInscription: 12,
    img: "/images/emission.jpg",
    competences: [
      "Élaborer une stratégie social media complète",
      "Créer et animer une communauté en ligne",
      "Produire des contenus visuels et vidéos pour les réseaux",
      "Lancer et optimiser des campagnes publicitaires Meta & TikTok",
      "Analyser les performances et produire des reportings",
      "Gérer l'image de marque d'une entreprise sur le digital",
    ],
    modules: [
      {
        numero: 1,
        label: "Module 1",
        titre: "Fondamentaux du Marketing Digital",
        desc: "Comprendre l'écosystème et définir ses cibles.",
      },
      {
        numero: 2,
        label: "Module 2",
        titre: "Social Media Management",
        desc: "Animation de communautés et création de planning éditorial.",
      },
      {
        numero: 3,
        label: "Module 3",
        titre: "Création de contenu",
        desc: "Initiation aux outils de design et montage mobile.",
      },
      {
        numero: 4,
        label: "Module 4",
        titre: "Social Ads & Analytics",
        desc: "Lancer des campagnes sponsorisées et mesurer les résultats.",
      },
    ],
    formateur: {
      nom: "Idriss Diop",
      titre: "Experte Digital",
      bio: "Plus de 10 ans d'expérience dans la stratégie digitale pour de grandes marques panafricaines. Passionnée par la transmission de savoir.",
      photo: "/images/team/formateur-1.jpg",
    },
  },
  {
    slug: "production-audiovisuelle",
    categorie: "Audiovisuel",
    titre: "Production Audiovisuelle",
    sousTitre: "Formation Vidéo Pro",
    description:
      "Apprenez à concevoir, filmer et monter des contenus vidéo professionnels. De la prise en main de la caméra à la diffusion finale, maîtrisez tout le processus de production audiovisuelle.",
    prix: "200 000 XOF",
    duree: "2 mois (80 heures)",
    niveau: "Débutant à Avancé",
    lieu: "KNR COM, BENIN (Cotonou)",
    debut: "1 Novembre 2026",
    fin: "31 Décembre 2026",
    placesRestantes: 8,
    joursClotureInscription: 20,
    img: "/images/formations/formation-2.jpg",
    competences: [
      "Maîtriser les fondamentaux de la prise de vue vidéo",
      "Gérer l'éclairage et le son en studio et sur le terrain",
      "Monter des vidéos professionnelles sur DaVinci Resolve",
      "Créer des habillages graphiques et motion design",
      "Produire des interviews et reportages",
      "Diffuser et optimiser vos contenus sur YouTube et les réseaux",
    ],
    modules: [
      { numero: 1, label: "Module 1", titre: "Fondamentaux de la caméra", desc: "Prise en main, réglages manuels, composition d'image." },
      { numero: 2, label: "Module 2", titre: "Son et éclairage", desc: "Techniques de son professionnel et maîtrise de la lumière." },
      { numero: 3, label: "Module 3", titre: "Montage vidéo", desc: "Apprentissage de DaVinci Resolve et du rythme narratif." },
      { numero: 4, label: "Module 4", titre: "Publication & distribution", desc: "Optimiser et diffuser ses contenus sur les plateformes." },
    ],
    formateur: {
      nom: "Kofi Mensah",
      titre: "Réalisateur & Formateur",
      bio: "Réalisateur primé avec plus de 15 ans d'expérience en production audiovisuelle pour la télévision et les grandes entreprises africaines.",
      photo: "/images/team/formateur-2.jpg",
    },
  },
  {
    slug: "podcasting-professionnel",
    categorie: "Média",
    titre: "Podcasting Professionnel",
    sousTitre: "Studio Podcast Master",
    description:
      "Créez, enregistrez et diffusez votre podcast de A à Z. Apprenez les techniques d'interview, la prise de son en studio et la stratégie de distribution pour construire une audience fidèle.",
    prix: "120 000 XOF",
    duree: "6 semaines (48 heures)",
    niveau: "Débutant",
    lieu: "KNR COM, BENIN (Cotonou)",
    debut: "10 Novembre 2026",
    fin: "20 Décembre 2026",
    placesRestantes: 10,
    joursClotureInscription: 30,
    img: "/images/formations/formation-3.jpg",
    competences: [
      "Concevoir le concept et le format de son podcast",
      "Maîtriser la prise de son en studio",
      "Conduire des interviews professionnelles",
      "Monter et masteriser des épisodes audio",
      "Distribuer sur Spotify, Apple Podcasts et YouTube",
      "Fidéliser et développer son audience",
    ],
    modules: [
      { numero: 1, label: "Module 1", titre: "Concept & Format", desc: "Définir sa niche, ses cibles et le format de son podcast." },
      { numero: 2, label: "Module 2", titre: "Technique studio", desc: "Microphones, mixage et enregistrement de qualité." },
      { numero: 3, label: "Module 3", titre: "Montage & Habillage", desc: "Éditer ses épisodes avec Audacity et Adobe Audition." },
      { numero: 4, label: "Module 4", titre: "Distribution & Croissance", desc: "Publier sur toutes les plateformes et développer son audience." },
    ],
    formateur: {
      nom: "Aminata Traoré",
      titre: "Podcasteuse & Coach média",
      bio: "Fondatrice de l'un des podcasts africains les plus écoutés. Accompagne des créateurs de contenu depuis 8 ans.",
      photo: "/images/team/formateur-3.jpg",
    },
  },
  {
    slug: "photographie-professionnelle",
    categorie: "Audiovisuel",
    titre: "Photographie Professionnelle",
    sousTitre: "Photo & Lumière",
    description:
      "Maîtrisez l'art de la photographie professionnelle pour l'entreprise, la mode et l'événementiel. Apprenez à maîtriser votre appareil, la lumière et le post-traitement.",
    prix: "130 000 XOF",
    duree: "4 semaines (60 heures)",
    niveau: "Intermédiaire",
    lieu: "KNR COM, BENIN (Cotonou)",
    debut: "5 Novembre 2026",
    fin: "5 Décembre 2026",
    placesRestantes: 6,
    joursClotureInscription: 15,
    img: "/images/formations/formation-4.jpg",
    competences: [
      "Maîtriser les réglages manuels de son appareil photo",
      "Comprendre et maîtriser la lumière naturelle et artificielle",
      "Photographier des portraits, produits et événements",
      "Retoucher ses photos sur Lightroom et Photoshop",
      "Construire un portfolio professionnel",
      "Commercialiser ses services photographiques",
    ],
    modules: [
      { numero: 1, label: "Module 1", titre: "Maîtrise de l'appareil", desc: "ISO, ouverture, vitesse — comprendre le triangle d'exposition." },
      { numero: 2, label: "Module 2", titre: "Lumière & Composition", desc: "Direction de la lumière, cadrage et règle des tiers." },
      { numero: 3, label: "Module 3", titre: "Shootings pratiques", desc: "Portraits, mode, produits et événementiel sur le terrain." },
      { numero: 4, label: "Module 4", titre: "Post-traitement", desc: "Retouche et colorimétrie sur Lightroom et Photoshop." },
    ],
    formateur: {
      nom: "Serge Akplogan",
      titre: "Photographe professionnel",
      bio: "Photographe de mode et corporate avec plus de 12 ans d'expérience. Ses travaux ont été publiés dans des magazines africains et internationaux.",
      photo: "/images/team/formateur-4.jpg",
    },
  },
  {
    slug: "strategie-marketing-digital",
    categorie: "Marketing",
    titre: "Stratégie Marketing Digital",
    sousTitre: "Growth Marketing Africa",
    description:
      "Apprenez à élaborer et piloter une stratégie marketing digitale complète adaptée au marché africain. SEO, publicité payante, email marketing et analytics au programme.",
    prix: "175 000 XOF",
    duree: "10 semaines (100 heures)",
    niveau: "Intermédiaire à Avancé",
    lieu: "KNR COM, BENIN (Cotonou)",
    debut: "20 Octobre 2026",
    fin: "30 Décembre 2026",
    placesRestantes: 7,
    joursClotureInscription: 8,
    img: "/images/formations/formation-5.jpg",
    competences: [
      "Construire une stratégie digitale complète de A à Z",
      "Maîtriser le SEO et le référencement local africain",
      "Lancer des campagnes Google Ads et Meta Ads rentables",
      "Créer des tunnels de vente et de l'email marketing",
      "Analyser les données avec Google Analytics 4",
      "Présenter des reportings à des clients ou dirigeants",
    ],
    modules: [
      { numero: 1, label: "Module 1", titre: "Stratégie & Positionnement", desc: "Analyse marché, personas et positionnement de marque." },
      { numero: 2, label: "Module 2", titre: "SEO & Content Marketing", desc: "Référencement naturel et stratégie de contenu." },
      { numero: 3, label: "Module 3", titre: "Publicité digitale", desc: "Google Ads, Meta Ads et optimisation des campagnes." },
      { numero: 4, label: "Module 4", titre: "Analytics & Reporting", desc: "Mesurer, analyser et optimiser ses performances." },
    ],
    formateur: {
      nom: "Fatoumata Coulibaly",
      titre: "Growth Marketer",
      bio: "10 ans d'expérience en marketing digital pour des startups et grandes entreprises d'Afrique de l'Ouest. Certifiée Google et HubSpot.",
      photo: "/images/team/formateur-5.jpg",
    },
  },
  {
    slug: "journalisme-web-media",
    categorie: "Média",
    titre: "Journalisme Web & Média",
    sousTitre: "Journalisme Digital",
    description:
      "Formez-vous aux métiers du journalisme web et des nouveaux médias. Rédaction web, investigation, production multimédia et fact-checking au cœur de la formation.",
    prix: "110 000 XOF",
    duree: "8 semaines (64 heures)",
    niveau: "Débutant à Intermédiaire",
    lieu: "KNR COM, BENIN (Cotonou)",
    debut: "3 Novembre 2026",
    fin: "28 Décembre 2026",
    placesRestantes: 12,
    joursClotureInscription: 25,
    img: "/images/formations/formation-6.jpg",
    competences: [
      "Rédiger des articles web optimisés SEO",
      "Mener des interviews et des reportages terrain",
      "Produire des contenus multimédia (audio, vidéo, photo)",
      "Vérifier les informations et lutter contre la désinformation",
      "Gérer un site d'information et sa ligne éditoriale",
      "Développer ses sources et son réseau journalistique",
    ],
    modules: [
      { numero: 1, label: "Module 1", titre: "Écriture web & SEO", desc: "Techniques de rédaction web et référencement éditorial." },
      { numero: 2, label: "Module 2", titre: "Reportage & Investigation", desc: "Méthodes d'enquête, sources et vérification des faits." },
      { numero: 3, label: "Module 3", titre: "Multimédia", desc: "Intégration de la photo, vidéo et audio dans ses articles." },
      { numero: 4, label: "Module 4", titre: "Gestion d'un média web", desc: "Ligne éditoriale, gestion d'équipe et modèle économique." },
    ],
    formateur: {
      nom: "Boris Hounsinou",
      titre: "Journaliste & Formateur média",
      bio: "Journaliste avec 12 ans d'expérience dans les grands médias béninois et internationaux. Spécialiste du fact-checking et du journalisme de données.",
      photo: "/images/team/formateur-6.jpg",
    },
  },
];
