export type Emission = {
  slug: string;
  categorie: string;
  titre: string;
  sousTitre: string;
  description: string;
  episodes: number;
  duree: string;
  img: string;
  videoUrl: string;
  animateur: string;
  tags: string[];
};

export const emissions: Emission[] = [
  {
    slug: "tech-talk",
    categorie: "Technologie",
    titre: "Tech Talk",
    sousTitre: "L'innovation au quotidien",
    description: "Tech Talk explore chaque semaine les dernières innovations technologiques qui transforment l'Afrique. Startups, intelligence artificielle, fintech et numérique : des conversations profondes avec les acteurs du changement.",
    episodes: 11,
    duree: "45 min",
    img: "/images/emission.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    animateur: "Ibrahim Bah Zakkarih",
    tags: ["Tech", "Innovation", "Afrique"],
  },
  {
    slug: "culture-creation",
    categorie: "Culture",
    titre: "Culture & Création",
    sousTitre: "L'art sous toutes ses formes",
    description: "Un magazine culturel qui célèbre la richesse et la diversité des arts africains. Musique, mode, littérature, cinéma et arts visuels : la créativité du continent mise à l'honneur.",
    episodes: 11,
    duree: "38 min",
    img: "/images/emission.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    animateur: "Aminata Diallo",
    tags: ["Culture", "Art", "Créativité"],
  },
  {
    slug: "business-africa",
    categorie: "Business",
    titre: "Business Africa",
    sousTitre: "Les leaders qui transforment le continent",
    description: "Les grands entrepreneurs africains partagent leurs parcours, leurs succès et leurs échecs. Une émission de référence pour comprendre le dynamisme économique de l'Afrique.",
    episodes: 8,
    duree: "52 min",
    img: "/images/emission.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    animateur: "Kofi Mensah",
    tags: ["Business", "Entrepreneuriat", "Économie"],
  },
  {
    slug: "africa-next",
    categorie: "Société",
    titre: "Africa Next",
    sousTitre: "La jeunesse qui bâtit demain",
    description: "Africa Next donne la parole à la nouvelle génération africaine qui innove, crée et engage. Une émission tournée vers l'avenir et l'espoir.",
    episodes: 9,
    duree: "42 min",
    img: "/images/emission.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    animateur: "Fatoumata Traoré",
    tags: ["Jeunesse", "Société", "Avenir"],
  },
  {
    slug: "sport-et-talent",
    categorie: "Sport",
    titre: "Sport & Talent",
    sousTitre: "Les champions de demain",
    description: "Du football à l'athlétisme, en passant par le basketball et les sports de combat, Sport & Talent met en lumière les athlètes africains qui brillent sur la scène mondiale.",
    episodes: 7,
    duree: "35 min",
    img: "/images/emission.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    animateur: "Serge Akplogan",
    tags: ["Sport", "Talent", "Champions"],
  },
  {
    slug: "femmes-leaders",
    categorie: "Société",
    titre: "Femmes Leaders",
    sousTitre: "Elles font bouger l'Afrique",
    description: "Des portraits inspirants de femmes africaines qui brisent les plafonds de verre et transforment leurs secteurs. Politique, tech, art, business : leur force, leur vision, leur impact.",
    episodes: 12,
    duree: "48 min",
    img: "/images/emission.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    animateur: "Aïssatou Ndiaye",
    tags: ["Femmes", "Leadership", "Inspiration"],
  },
];
