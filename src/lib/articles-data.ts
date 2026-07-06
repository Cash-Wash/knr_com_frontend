export type Article = {
  slug: string;
  categorie: string;
  titre: string;
  extrait: string;
  auteur: string;
  date: string;
  dateISO: string;
  tempsLecture: string;
  img: string;
  featured: boolean;
  contenu: {
    intro: string;
    sections: { sousTitre?: string; paragraphe: string }[];
    citation?: string;
    conclusion?: string;
  };
};

export const articles: Article[] = [
  {
    slug: "economie-numerique-afrique-2025",
    categorie: "Technologie",
    titre: "L'économie numérique en Afrique : Bilan et Perspectives 2025",
    extrait: "Analyse complète des tendances qui vont façonner le paysage numérique africain dans les prochaines années. Comment les entrepreneurs africains réinventent les modèles économiques.",
    auteur: "Jean-Marc Diop",
    date: "Il y a 2 jours",
    dateISO: "12 Octobre 2023",
    tempsLecture: "5 min de lecture",
    img: "/images/emission.jpg",
    featured: true,
    contenu: {
      intro: "Alors que le continent connaît une croissance démographique sans précédent, le numérique s'impose comme le levier incontournable du développement économique. Analyse des tendances majeures.",
      sections: [
        {
          sousTitre: "L'essor des Fintech",
          paragraphe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        },
        {
          sousTitre: "L'agriculture connectée",
          paragraphe: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
        },
      ],
      citation: "\"La technologie n'est pas une fin en soi, mais un moyen d'accélérer l'inclusion sociale et économique.\"",
      conclusion: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    },
  },
  {
    slug: "innovation-frugale-premiere-partie",
    categorie: "Entrepreneuriat",
    titre: "Innovation frugale : Faire mieux avec moins — Première Partie",
    extrait: "Comment les entrepreneurs africains réinventent les modèles économiques avec des ressources limitées.",
    auteur: "Amina Sow",
    date: "Il y a 3 jours",
    dateISO: "15 Oct 2023",
    tempsLecture: "4 min de lecture",
    img: "/images/emission.jpg",
    featured: false,
    contenu: {
      intro: "L'innovation frugale, ou jugaad en hindi, désigne la capacité à créer des solutions efficaces avec des moyens limités. En Afrique, cette approche n'est pas un choix mais une nécessité qui forge des entrepreneurs d'exception.",
      sections: [
        {
          sousTitre: "Définir l'innovation frugale",
          paragraphe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
          sousTitre: "Des exemples concrets au Bénin",
          paragraphe: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
        },
      ],
      citation: "\"Innover avec peu, c'est innover pour tous.\"",
      conclusion: "L'innovation frugale africaine n'est pas une contrainte mais une force. Les entreprises qui l'adoptent construisent des modèles résilients capables de traverser toutes les crises.",
    },
  },
  {
    slug: "startups-tech-cotonou",
    categorie: "Entrepreneuriat",
    titre: "Les startups tech de Cotonou qui changent la donne",
    extrait: "Portrait de cinq jeunes entreprises béninoises qui révolutionnent leur secteur avec des solutions numériques innovantes et locales.",
    auteur: "Kofi Mensah",
    date: "Il y a 5 jours",
    dateISO: "10 Oct 2023",
    tempsLecture: "6 min de lecture",
    img: "/images/emission.jpg",
    featured: false,
    contenu: {
      intro: "Cotonou s'impose progressivement comme un hub tech en Afrique de l'Ouest. Cinq startups illustrent parfaitement cette dynamique.",
      sections: [
        { sousTitre: "AgriConnect — L'agriculture 2.0", paragraphe: "Cette startup met en relation les agriculteurs et les acheteurs via une plateforme mobile, éliminant les intermédiaires et augmentant les revenus paysans de 40%." },
        { sousTitre: "MediTech Bénin", paragraphe: "La télémédecine accessible à tous, même dans les zones rurales les plus reculées du pays." },
      ],
      citation: "\"Cotonou sera le Lagos de demain.\" — Investisseur international",
      conclusion: "Ces startups prouvent que l'innovation ne connaît pas de frontières géographiques. L'écosystème béninois est en pleine ébullition.",
    },
  },
  {
    slug: "femmes-entrepreneures-afrique",
    categorie: "Culture",
    titre: "Femmes entrepreneures : les pionnières qui redessinentl'Afrique",
    extrait: "Elles dirigent des entreprises, créent des emplois et inspirent des générations. Portrait de femmes qui brisent les barrières en Afrique.",
    auteur: "Fatoumata Traoré",
    date: "Il y a 1 semaine",
    dateISO: "8 Oct 2023",
    tempsLecture: "7 min de lecture",
    img: "/images/emission.jpg",
    featured: false,
    contenu: {
      intro: "À travers le continent, des femmes extraordinaires brisent les plafonds de verre et créent des entreprises qui changent leur communauté.",
      sections: [
        { sousTitre: "Le financement, premier obstacle", paragraphe: "Accéder au capital reste le défi majeur pour les femmes entrepreneurs africaines. Pourtant, des solutions émergent : financement participatif, tontines digitalisées, investisseurs d'impact." },
        { sousTitre: "Des modèles inspirants", paragraphe: "De Dakar à Nairobi, en passant par Cotonou, ces femmes construisent des empires et inspirent des milliers de jeunes filles à entreprendre." },
      ],
      citation: "\"Quand une femme réussit en affaires en Afrique, c'est toute une famille, tout un quartier qui progresse.\"",
      conclusion: "Le leadership féminin n'est pas une option pour l'Afrique, c'est une nécessité pour son développement.",
    },
  },
  {
    slug: "marketing-digital-pme-africaines",
    categorie: "Entrepreneuriat",
    titre: "Le marketing digital, levier de croissance pour les PME africaines",
    extrait: "Comment les petites et moyennes entreprises africaines utilisent les réseaux sociaux, le SEO et le contenu pour rivaliser avec les grandes marques.",
    auteur: "Ibrahim Bah Zakkarih",
    date: "Il y a 10 jours",
    dateISO: "5 Oct 2023",
    tempsLecture: "5 min de lecture",
    img: "/images/emission.jpg",
    featured: false,
    contenu: {
      intro: "La révolution digitale offre aux PME africaines une opportunité historique : rivaliser avec les grandes entreprises à une fraction du coût.",
      sections: [
        { sousTitre: "Les réseaux sociaux comme premier marché", paragraphe: "WhatsApp, TikTok, Instagram : les entrepreneurs africains ont compris que ces plateformes sont leurs premiers points de vente. Les success stories se multiplient." },
        { sousTitre: "SEO local : être trouvé en Afrique", paragraphe: "Optimiser sa présence en ligne pour les recherches locales est encore une discipline peu maîtrisée mais terriblement efficace pour les PME africaines." },
      ],
      citation: "\"Un artisan de Cotonou peut vendre à Paris grâce à Instagram. C'est la magie du digital.\"",
      conclusion: "Le marketing digital n'est plus une option pour les PME africaines. C'est leur principal avantage concurrentiel dans un monde de plus en plus connecté.",
    },
  },
  {
    slug: "energie-solaire-revolution",
    categorie: "Technologie",
    titre: "Énergie solaire : la révolution qui électrifie l'Afrique rurale",
    extrait: "Des millions de foyers africains accèdent enfin à l'électricité grâce aux solutions solaires off-grid. Une révolution silencieuse mais massive.",
    auteur: "Serge Akplogan",
    date: "Il y a 2 semaines",
    dateISO: "1 Oct 2023",
    tempsLecture: "8 min de lecture",
    img: "/images/emission.jpg",
    featured: false,
    contenu: {
      intro: "En Afrique subsaharienne, 600 millions de personnes n'ont pas accès à l'électricité. Les solutions solaires off-grid changent cette réalité à une vitesse remarquable.",
      sections: [
        { sousTitre: "Le off-grid comme modèle économique", paragraphe: "Des entreprises comme M-KOPA ont démontré qu'il est possible de rentabiliser l'accès à l'énergie propre pour les populations les plus pauvres grâce aux paiements mobiles." },
        { sousTitre: "Les défis de la chaîne d'approvisionnement", paragraphe: "Acheminer les panneaux solaires dans les zones rurales reste un défi logistique majeur. Des solutions innovantes émergent pour y répondre." },
      ],
      citation: "\"L'accès à l'énergie, c'est l'accès au développement. L'Afrique solaire est en marche.\"",
      conclusion: "L'Afrique pourrait bien devenir le premier continent à construire une infrastructure énergétique 100% renouvelable en sautant complètement l'étape des énergies fossiles.",
    },
  },
  {
    slug: "musique-africaine-streaming",
    categorie: "Culture",
    titre: "Afrobeats & streaming : comment la musique africaine conquiert le monde",
    extrait: "D'Abidjan à Lagos, en passant par Dakar, les artistes africains explosent sur les plateformes de streaming mondial. Analyse d'un phénomène culturel sans précédent.",
    auteur: "Aminata Diallo",
    date: "Il y a 2 semaines",
    dateISO: "28 Sep 2023",
    tempsLecture: "6 min de lecture",
    img: "/images/emission.jpg",
    featured: false,
    contenu: {
      intro: "Burna Boy, Wizkid, Tems, Ayra Starr... Les artistes africains ne se contentent plus du marché local. Ils dominent les charts mondiaux et redéfinissent la musique populaire globale.",
      sections: [
        { sousTitre: "Spotify, Apple Music et l'explosion africaine", paragraphe: "Les chiffres sont éloquents : les streams d'artistes africains ont augmenté de 180% en 3 ans sur Spotify. L'Afrique est devenue un marché musical stratégique pour toutes les grandes plateformes." },
        { sousTitre: "L'industrie musicale locale se structure", paragraphe: "Des labels indépendants, des studios de qualité, des managers professionnels : l'écosystème musical africain se professionnalise à grande vitesse." },
      ],
      citation: "\"L'Afrobeats n'est pas une tendance. C'est le présent et l'avenir de la musique mondiale.\"",
      conclusion: "La musique africaine vit son âge d'or. Et ce n'est que le début d'une révolution culturelle qui va redessiner la carte de l'industrie musicale mondiale.",
    },
  },
  {
    slug: "agriculture-technologie-benin",
    categorie: "Culture",
    titre: "Agriculture et technologie : le Bénin se réinvente",
    extrait: "Le secteur agricole béninois connaît une transformation profonde grâce aux nouvelles technologies. Drones, capteurs IoT et plateformes numériques révolutionnent les pratiques.",
    auteur: "Boris Hounsinou",
    date: "Il y a 3 semaines",
    dateISO: "20 Sep 2023",
    tempsLecture: "5 min de lecture",
    img: "/images/emission.jpg",
    featured: false,
    contenu: {
      intro: "Le Bénin, traditionnellement agricole, embrasse la révolution technologique dans ses champs. Une transformation qui pourrait multiplier sa production alimentaire par deux d'ici 2030.",
      sections: [
        { sousTitre: "Les drones au service des cultures", paragraphe: "Les drones agricoles permettent désormais aux fermiers béninois de surveiller leurs cultures, détecter les maladies et optimiser l'irrigation à moindre coût." },
        { sousTitre: "Les plateformes d'intermédiation", paragraphe: "Des applications comme e-Zaka connectent directement les producteurs aux consommateurs, éliminant les intermédiaires et augmentant significativement les revenus agricoles." },
      ],
      citation: "\"La tech ne remplacera jamais le paysan. Elle l'aidera à travailler mieux, pas moins.\"",
      conclusion: "L'agritech béninoise est en marche. Le pays a tous les atouts pour devenir un modèle d'agriculture digitale en Afrique de l'Ouest.",
    },
  },
  {
    slug: "innovation-afrique-ouest-etat-des-lieux",
    categorie: "Technologie",
    titre: "L'innovation en Afrique de l'Ouest : État des lieux",
    extrait: "Tour d'horizon complet des hubs d'innovation en Afrique de l'Ouest, des écosystèmes qui émergent et des défis qui restent à surmonter.",
    auteur: "Kofi Mensah",
    date: "10 Oct 2023",
    dateISO: "10 Oct 2023",
    tempsLecture: "7 min de lecture",
    img: "/images/emission.jpg",
    featured: false,
    contenu: {
      intro: "De Dakar à Lagos, en passant par Accra et Cotonou, l'Afrique de l'Ouest construit progressivement un écosystème d'innovation qui commence à attirer les investisseurs internationaux.",
      sections: [
        { sousTitre: "Les hubs technologiques en pleine expansion", paragraphe: "iHub à Nairobi, Co-Creation Hub à Lagos, CTIC à Dakar : ces espaces de coworking et d'incubation ont accéléré l'émergence de centaines de startups africaines." },
        { sousTitre: "Le défi du financement", paragraphe: "Malgré une croissance remarquable, les startups africaines reçoivent encore moins de 1% du capital-risque mondial. Un gap considérable à combler." },
      ],
      citation: "\"L'écosystème startup africain est à l'aube de son âge d'or. Les prochaines années seront décisives.\"",
      conclusion: "L'Afrique de l'Ouest a tous les ingrédients pour devenir un hub d'innovation mondial : talent, marché, créativité. Il manque encore du capital et des connexions internationales.",
    },
  },
];
