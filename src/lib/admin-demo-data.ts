export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "presenter" | "user";
  active: boolean;
  phone?: string;
  avatar?: string;
};

export type AdminLive = {
  id: string;
  titre: string;
  youtubeUrl: string;
  youtubeId?: string;
  status: "scheduled" | "live" | "ended";
  viewers: number;
  startedAt?: string;
  endedAt?: string;
  programme: string;
};

export type AdminReunion = {
  id: string;
  titre: string;
  description: string;
  scheduledAt: string;
  host: string;
  status: "scheduled" | "in-progress" | "ended";
  participants: string[];
};

export type AdminProgrammeItem = {
  id: string;
  heure: string;
  titre: string;
  description: string;
  statut: "scheduled" | "en-cours" | "passé";
  date: string;
};

export type AdminArticle = {
  id: string;
  titre: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  author: string;
  category: string;
  publishedAt?: string;
  updatedAt: string;
};

export type AdminEmission = {
  id: string;
  titre: string;
  description: string;
  date: string;
  status: "draft" | "published";
  views: string;
  thumbnail: string;
};

export const adminSeedUsers: AdminUser[] = [
  {
    id: "usr_1",
    name: "Aminata Diallo",
    email: "aminata@knr.com",
    role: "admin",
    active: true,
    phone: "+229 01 00 00 00 01",
  },
  {
    id: "usr_2",
    name: "Moussa Traore",
    email: "moussa@knr.com",
    role: "editor",
    active: true,
    phone: "+229 01 00 00 00 02",
  },
  {
    id: "usr_3",
    name: "Nadia Mensah",
    email: "nadia@knr.com",
    role: "presenter",
    active: true,
    phone: "+229 01 00 00 00 03",
  },
  {
    id: "usr_4",
    name: "Joel Kouassi",
    email: "joel@knr.com",
    role: "user",
    active: false,
    phone: "+229 01 00 00 00 04",
  },
];

export const adminSeedLives: AdminLive[] = [
  {
    id: "live_1",
    titre: "KNR Web TV - Edition du soir",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    status: "live",
    viewers: 1480,
    startedAt: "2026-07-12T18:00:00.000Z",
    programme: "Direct du jour avec interviews et chroniques",
  },
  {
    id: "live_2",
    titre: "Talk Show Business Africa",
    youtubeUrl: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
    youtubeId: "oHg5SJYRHA0",
    status: "scheduled",
    viewers: 0,
    programme: "Diffusion automatique a partir de YouTube",
  },
];

export const adminSeedReunions: AdminReunion[] = [
  {
    id: "meet_1",
    titre: "Reunion editoriale",
    description: "Preparation des contenus de la semaine et planning redactionnel.",
    scheduledAt: "2026-07-12T09:00:00.000Z",
    host: "Aminata Diallo",
    status: "scheduled",
    participants: ["Aminata Diallo", "Moussa Traore", "Nadia Mensah"],
  },
  {
    id: "meet_2",
    titre: "Coordination technique live",
    description: "Verifier la regie et le lancement du flux YouTube.",
    scheduledAt: "2026-07-12T14:30:00.000Z",
    host: "Joel Kouassi",
    status: "in-progress",
    participants: ["Joel Kouassi", "Moussa Traore"],
  },
];

export const adminSeedProgramme: AdminProgrammeItem[] = [
  {
    id: "pro_1",
    heure: "08:00",
    titre: "Revue de presse",
    description: "Debut de journee et selection des sujets chauds.",
    statut: "scheduled",
    date: "2026-07-12",
  },
  {
    id: "pro_2",
    heure: "12:30",
    titre: "Emission politique",
    description: "Interview speciale et discussion de fond.",
    statut: "en-cours",
    date: "2026-07-12",
  },
  {
    id: "pro_3",
    heure: "19:00",
    titre: "Debat Web TV",
    description: "Plateau special et diffusion YouTube.",
    statut: "scheduled",
    date: "2026-07-12",
  },
];

export const adminSeedArticles: AdminArticle[] = [
  {
    id: "art_1",
    titre: "Afrique Connect ouvre de nouvelles perspectives pour les medias",
    slug: "afrique-connect-medias",
    content: "Un texte de demonstration pour un article edit en admin.",
    status: "published",
    author: "Aminata Diallo",
    category: "Culture",
    publishedAt: "2026-07-11",
    updatedAt: "2026-07-12",
  },
  {
    id: "art_2",
    titre: "Comment structurer un live YouTube qui convertit",
    slug: "live-youtube-conversion",
    content: "Un deuxieme contenu pour brouillon et edition rapide.",
    status: "draft",
    author: "Moussa Traore",
    category: "Technologie",
    updatedAt: "2026-07-12",
  },
];

export const adminSeedEmissions: AdminEmission[] = [
  {
    id: "emi_1",
    titre: "Business Africa - Episode 12",
    description: "Edition speciale investisseurs et startups.",
    date: "2026-07-10",
    status: "published",
    views: "4.2K",
    thumbnail: "/images/webtv1.png",
  },
  {
    id: "emi_2",
    titre: "Tech Talk - L'IA en Afrique",
    description: "Un format propose pour les innovations du continent.",
    date: "2026-07-09",
    status: "draft",
    views: "3.1K",
    thumbnail: "/images/webtv2.png",
  },
];

export const adminProfileSeed = {
  name: "Aminata Diallo",
  email: "aminata@knr.com",
  role: "admin",
  phone: "+229 01 00 00 00 01",
  bio: "Direction editoriale et administration de la plateforme KNR.",
};

export function getYoutubeEmbedUrl(input: string, youtubeId?: string) {
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=1&rel=0`;
  }

  const idMatch =
    input.match(/[?&]v=([^&]+)/)?.[1] ??
    input.match(/youtu\.be\/([^?]+)/)?.[1] ??
    input.match(/embed\/([^?]+)/)?.[1];

  return idMatch
    ? `https://www.youtube.com/embed/${idMatch}?autoplay=1&mute=1&controls=1&rel=0`
    : null;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
