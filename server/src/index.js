require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { Server } = require("socket.io");
const prisma = require("./prismaClient");
const { authMiddleware, adminMiddleware } = require("./middleware/auth");
const agentHub = require("./agentHub");
const youtubeDiscovery = require("./youtubeDiscovery");
const settingsStore = require("./settingsStore");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, /^image\//.test(file.mimetype));
  },
});

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(UPLOADS_DIR));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
agentHub.registerAgentNamespace(io);

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-development";
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
const SEED_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@knr.com";
const SEED_NAME = process.env.SEED_ADMIN_NAME || "Aminata Diallo";

function createSlug(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toIsoDate(value) {
  return value ? new Date(value).toISOString() : null;
}

function toDateOnly(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : null;
}

function mapRole(role) {
  return String(role).toLowerCase();
}

function mapUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: mapRole(user.role),
    active: user.active,
    phone: user.phone ?? "",
    bio: user.bio ?? "",
    avatar: user.avatar ?? "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function mapLive(live) {
  return {
    id: live.id,
    titre: live.titre,
    youtubeUrl: live.youtubeUrl,
    youtubeId: live.youtubeId ?? "",
    status: mapRole(live.status),
    viewers: live.viewers,
    startedAt: toIsoDate(live.startedAt),
    endedAt: toIsoDate(live.endedAt),
    programme: live.programme ?? "",
  };
}

function mapReunion(reunion) {
  return {
    id: reunion.id,
    titre: reunion.titre,
    description: reunion.description ?? "",
    scheduledAt: toIsoDate(reunion.scheduledAt),
    host: reunion.host?.name ?? "",
    hostId: reunion.hostId,
    status: mapRole(reunion.status).replace("_", "-"),
    assignedUserIds: Array.isArray(reunion.assignedUserIds) ? reunion.assignedUserIds : [],
    roomSlug: reunion.roomSlug ?? "",
    joinUrl: reunion.roomSlug ? `https://meet.jit.si/${reunion.roomSlug}` : "",
    accessCode: reunion.accessCode ?? "",
  };
}

function generateAccessCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 6);
}

function normalizeReunionStatus(status) {
  return String(status).toUpperCase().replace(/-/g, "_");
}

function mapEntrepreneur(item) {
  return {
    id: item.id,
    name: item.name,
    role: item.role,
    bio: item.bio ?? "",
    photo: item.photo ?? "",
    socials: item.socials && typeof item.socials === "object" ? item.socials : {},
    active: !!item.active,
  };
}

function toMinutesOfDay(heure) {
  const [h, m] = String(heure).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function computeProgrammeStatuses(items) {
  const now = new Date();
  const todayKey = now.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const byDate = new Map();
  items.forEach((item, idx) => {
    const key = new Date(item.date).toDateString();
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(idx);
  });

  const statuses = new Array(items.length);
  for (const [dateKey, indices] of byDate) {
    if (dateKey !== todayKey) {
      const isPast = new Date(dateKey) < new Date(todayKey);
      indices.forEach((i) => { statuses[i] = isPast ? "PAST" : "SCHEDULED"; });
      continue;
    }
    const sorted = [...indices].sort((a, b) => toMinutesOfDay(items[a].heure) - toMinutesOfDay(items[b].heure));
    let currentIdx = -1;
    sorted.forEach((i) => {
      if (toMinutesOfDay(items[i].heure) <= nowMinutes) currentIdx = i;
    });
    sorted.forEach((i) => {
      if (i === currentIdx) statuses[i] = "CURRENT";
      else if (toMinutesOfDay(items[i].heure) < nowMinutes) statuses[i] = "PAST";
      else statuses[i] = "SCHEDULED";
    });
  }
  return statuses;
}

function mapProgrammeItem(item, computedStatut) {
  const statut = mapRole(computedStatut ?? item.statut);
  return {
    id: item.id,
    heure: item.heure,
    titre: item.titre,
    description: item.description ?? "",
    statut:
      statut === "current"
        ? "en-cours"
        : statut === "past"
          ? "passé"
          : "scheduled",
    date: toDateOnly(item.date),
  };
}

function mapProgrammeItems(items) {
  const statuses = computeProgrammeStatuses(items);
  return items.map((item, i) => mapProgrammeItem(item, statuses[i]));
}

function mapArticle(article) {
  return {
    id: article.id,
    titre: article.titre,
    slug: article.slug,
    excerpt: article.excerpt ?? "",
    readTime: article.readTime ?? "",
    featured: !!article.featured,
    content: article.content,
    status: mapRole(article.status),
    author: article.author?.name ?? "",
    category: article.category ?? "",
    publishedAt: toDateOnly(article.publishedAt),
    createdAt: toIsoDate(article.createdAt),
    updatedAt: toDateOnly(article.updatedAt),
    thumbnail: article.thumbnail ?? "",
  };
}

function mapEmission(emission) {
  return {
    id: emission.id,
    titre: emission.titre,
    slug: emission.slug,
    sousTitre: emission.sousTitre ?? "",
    categorie: emission.categorie ?? "",
    animateur: emission.animateur ?? "",
    episodes: Array.isArray(emission.episodes) ? emission.episodes.length : 0,
    duree: emission.duree ?? "",
    tags: Array.isArray(emission.tags) ? emission.tags : [],
    description: emission.description ?? "",
    thumbnail: emission.thumbnail ?? "",
    youtubeUrl: emission.youtubeUrl ?? "",
    views: String(emission.views),
    featured: !!emission.featured,
    status: mapRole(emission.status),
    publishedAt: toDateOnly(emission.publishedAt),
    updatedAt: toDateOnly(emission.updatedAt),
    author: emission.author?.name ?? "",
  };
}

function mapEpisode(episode) {
  return {
    id: episode.id,
    emissionId: episode.emissionId,
    titre: episode.titre ?? "",
    youtubeUrl: episode.youtubeUrl,
    createdAt: toIsoDate(episode.createdAt),
  };
}

function mapTeamMember(member) {
  return {
    id: member.id,
    name: member.name,
    poste: member.poste,
    bio: member.bio ?? "",
    photo: member.photo ?? "",
    status: mapRole(member.status),
  };
}

function mapSettings(settings) {
  return {
    siteName: settings?.siteName ?? "",
    siteTagline: settings?.siteTagline ?? "",
    youtubeApiKey: settings?.youtubeApiKey ?? "",
    youtubeChannelId: settings?.youtubeChannelId ?? "",
    agentObsToken: settings?.agentObsToken ?? "",
    obsWsPort: settings?.obsWsPort ?? "4455",
    obsWsPassword: settings?.obsWsPassword ?? "",
    updatedAt: settings?.updatedAt ? toIsoDate(settings.updatedAt) : null,
  };
}

function mapStudioBooking(booking) {
  return {
    id: booking.id,
    date: booking.date,
    heure: booking.heure ?? "",
    forfait: booking.forfait,
    typeProjet: booking.typeProjet ?? "",
    prenom: booking.prenom,
    nom: booking.nom,
    email: booking.email,
    telephone: booking.telephone,
    entreprise: booking.entreprise ?? "",
    description: booking.description ?? "",
    modePaiement: booking.modePaiement ?? "",
    reference: booking.reference,
    status: booking.status.toLowerCase(),
    createdAt: toIsoDate(booking.createdAt),
  };
}

function generateBookingReference() {
  return `KNR-STUDIO-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function mapFormation(formation) {
  return {
    id: formation.id,
    slug: formation.slug,
    titre: formation.titre,
    categorie: formation.categorie,
    sousTitre: formation.sousTitre ?? "",
    description: formation.description ?? "",
    prix: formation.prix ?? "",
    duree: formation.duree ?? "",
    niveau: formation.niveau ?? "",
    lieu: formation.lieu ?? "",
    debut: formation.debut ?? "",
    fin: formation.fin ?? "",
    placesRestantes: formation.placesRestantes,
    clotureInscriptions: formation.clotureInscriptions ? toDateOnly(formation.clotureInscriptions) : null,
    joursClotureInscription: formation.clotureInscriptions
      ? Math.max(0, Math.ceil((new Date(formation.clotureInscriptions).getTime() - Date.now()) / 86400000))
      : formation.joursClotureInscription,
    img: formation.img ?? "",
    competences: Array.isArray(formation.competences) ? formation.competences : [],
    modules: Array.isArray(formation.modules) ? formation.modules : [],
    formateur: {
      nom: formation.formateurNom ?? "",
      titre: formation.formateurTitre ?? "",
      bio: formation.formateurBio ?? "",
      photo: formation.formateurPhoto ?? "",
    },
    status: mapRole(formation.status).toLowerCase(),
  };
}

function mapContactMessage(message) {
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    status: message.status,
    assignedTo: message.assignedTo ?? "",
    context: message.context ?? "",
    contextId: message.contextId ?? "",
    createdAt: toIsoDate(message.createdAt),
  };
}

function mapEquipment(item) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug ?? "",
    category: item.category ?? "",
    status: item.status,
    description: item.description ?? "",
    location: item.location ?? "",
    image: item.image ?? "",
    tarifJour: item.tarifJour ?? 0,
    caution: item.caution ?? "",
    images: Array.isArray(item.images) ? item.images : [],
    specs: Array.isArray(item.specs) ? item.specs : [],
    conditions: Array.isArray(item.conditions) ? item.conditions : [],
    reservedDates: Array.isArray(item.reservedDates) ? item.reservedDates : [],
  };
}

async function seedDatabase() {
  const adminPassword = await bcrypt.hash(SEED_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: SEED_EMAIL },
    update: {
      name: SEED_NAME,
      role: "ADMIN",
      active: true,
    },
    create: {
      email: SEED_EMAIL,
      password: adminPassword,
      name: SEED_NAME,
      role: "ADMIN",
      active: true,
      phone: "+229 01 00 00 00 01",
      bio: "Direction editoriale et administration de la plateforme KNR.",
    },
  });

  await prisma.user.upsert({
    where: { email: "moussa@knr.com" },
    update: {},
    create: {
      email: "moussa@knr.com",
      password: await bcrypt.hash("Admin123!", 10),
      name: "Moussa Traore",
      role: "EDITOR",
      active: true,
      phone: "+229 01 00 00 00 02",
    },
  });

  await prisma.user.upsert({
    where: { email: "nadia@knr.com" },
    update: {},
    create: {
      email: "nadia@knr.com",
      password: await bcrypt.hash("Admin123!", 10),
      name: "Nadia Mensah",
      role: "PRESENTER",
      active: true,
      phone: "+229 01 00 00 00 03",
    },
  });

  const usersCount = await prisma.user.count();
  if (usersCount === 0) {
    return;
  }

  if ((await prisma.live.count()) === 0) {
    await prisma.live.createMany({
      data: [
        {
          titre: "KNR Web TV - Edition du soir",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          youtubeId: "dQw4w9WgXcQ",
          status: "LIVE",
          viewers: 1480,
          programme: "Direct du jour avec interviews et chroniques",
          createdBy: admin.id,
          startedAt: new Date("2026-07-12T18:00:00.000Z"),
        },
        {
          titre: "Talk Show Business Africa",
          youtubeUrl: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
          youtubeId: "oHg5SJYRHA0",
          status: "SCHEDULED",
          viewers: 0,
          programme: "Diffusion automatique a partir de YouTube",
          createdBy: admin.id,
        },
      ],
    });
  }

  if ((await prisma.reunion.count()) === 0) {
    await prisma.reunion.createMany({
      data: [
        {
          titre: "Reunion editoriale",
          description: "Preparation des contenus de la semaine et planning redactionnel.",
          scheduledAt: new Date("2026-07-12T09:00:00.000Z"),
          hostId: admin.id,
          status: "SCHEDULED",
          participants: ["Aminata Diallo", "Moussa Traore", "Nadia Mensah"],
        },
        {
          titre: "Coordination technique live",
          description: "Verifier la regie et le lancement du flux YouTube.",
          scheduledAt: new Date("2026-07-12T14:30:00.000Z"),
          hostId: admin.id,
          status: "IN_PROGRESS",
          participants: ["Joel Kouassi", "Moussa Traore"],
        },
      ],
    });
  }

  if ((await prisma.programmeItem.count()) === 0) {
    await prisma.programmeItem.createMany({
      data: [
        {
          heure: "08:00",
          titre: "Revue de presse",
          description: "Debut de journee et selection des sujets chauds.",
          statut: "SCHEDULED",
          date: new Date("2026-07-12T00:00:00.000Z"),
          createdBy: admin.id,
        },
        {
          heure: "12:30",
          titre: "Emission politique",
          description: "Interview speciale et discussion de fond.",
          statut: "CURRENT",
          date: new Date("2026-07-12T00:00:00.000Z"),
          createdBy: admin.id,
        },
        {
          heure: "19:00",
          titre: "Debat Web TV",
          description: "Plateau special et diffusion YouTube.",
          statut: "SCHEDULED",
          date: new Date("2026-07-12T00:00:00.000Z"),
          createdBy: admin.id,
        },
      ],
    });
  }

  if ((await prisma.blogArticle.count()) === 0) {
    await prisma.blogArticle.createMany({
      data: [
        {
          titre: "Afrique Connect ouvre de nouvelles perspectives pour les medias",
          slug: createSlug("Afrique Connect ouvre de nouvelles perspectives pour les medias"),
          excerpt: "Analyse des nouvelles perspectives que le numerique ouvre pour les medias africains.",
          readTime: "5 min de lecture",
          featured: true,
          content: "Un texte de demonstration pour un article edit en admin.",
          status: "PUBLISHED",
          authorId: admin.id,
          category: "Culture",
          publishedAt: new Date("2026-07-11T00:00:00.000Z"),
        },
        {
          titre: "Comment structurer un live YouTube qui convertit",
          slug: createSlug("Comment structurer un live YouTube qui convertit"),
          content: "Un deuxieme contenu pour brouillon et edition rapide.",
          status: "DRAFT",
          authorId: admin.id,
          category: "Technologie",
        },
      ],
    });
  }

  if ((await prisma.emission.count()) === 0) {
    await prisma.emission.create({
      data: {
        titre: "Business Africa - Episode 12",
        slug: createSlug("Business Africa - Episode 12"),
        sousTitre: "Investisseurs et startups",
        categorie: "Economie",
        animateur: "Aminata Diallo",
        duree: "42 min",
        tags: ["Business", "Startups", "Afrique"],
        description: "Edition speciale investisseurs et startups.",
        thumbnail: "/images/webtv1.png",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        views: 4200,
        status: "PUBLISHED",
        publishedAt: new Date("2026-07-10T00:00:00.000Z"),
        authorId: admin.id,
        episodes: {
          create: [
            { titre: "Episode 12 - Investisseurs et startups", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
          ],
        },
      },
    });
    await prisma.emission.create({
      data: {
        titre: "Tech Talk - L'IA en Afrique",
        slug: createSlug("Tech Talk - L'IA en Afrique"),
        description: "Un format propose pour les innovations du continent.",
        thumbnail: "/images/webtv2.png",
        youtubeUrl: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
        views: 3100,
        status: "DRAFT",
        authorId: admin.id,
      },
    });
  }

  if ((await prisma.formation.count()) === 0) {
    await prisma.formation.createMany({
      data: [
        {
          slug: createSlug("Communication digitale & Social Media"),
          titre: "Communication digitale & Social Media",
          categorie: "Marketing",
          sousTitre: "Growth Marketing Africa",
          description: "Maitrisez les outils et strategies de la communication digitale pour developper la visibilite d'une marque.",
          prix: "150 000 XOF",
          duree: "3 mois (120 heures)",
          niveau: "Debutant a Intermediaire",
          lieu: "KNR COM, BENIN (Cotonou)",
          debut: "15 Octobre 2026",
          fin: "15 Janvier 2027",
          placesRestantes: 5,
          joursClotureInscription: 12,
          img: "/images/emission.jpg",
          competences: ["Strategie social media", "Creation de contenu", "Publicite en ligne"],
          modules: [
            { numero: 1, label: "Module 1", titre: "Fondamentaux", desc: "Comprendre l'ecosysteme digital." },
            { numero: 2, label: "Module 2", titre: "Social Media", desc: "Animer une communaute en ligne." },
          ],
          formateurNom: "Idriss Diop",
          formateurTitre: "Experte Digital",
          formateurBio: "Plus de 10 ans d'experience dans la strategie digitale pour de grandes marques.",
          formateurPhoto: "/images/team/formateur-1.jpg",
          status: "PUBLISHED",
        },
      ],
    });
  }

  if ((await prisma.equipment.count()) === 0) {
    await prisma.equipment.createMany({
      data: [
        {
          name: "Camera studio",
          slug: "camera-studio",
          category: "Video",
          status: "RESERVED",
          description: "Camera principale reservee pour le live du jour.",
          location: "Studio principal",
          image: "/images/webtv1.png",
        },
        {
          name: "Kit micro",
          slug: "kit-micro",
          category: "Audio",
          status: "AVAILABLE",
          description: "Microphones et accessoires disponibles.",
          location: "Regie audio",
          image: "/images/webtv2.png",
        },
      ],
    });
  }

  if ((await prisma.teamMember.count()) === 0) {
    await prisma.teamMember.createMany({
      data: [
        { name: "Alisa Hester", poste: "Founder & CEO", bio: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.", photo: "/images/equipe1.png", status: "PUBLISHED" },
        { name: "Rich Wilson", poste: "Engineering Manager", bio: "Lead engineering teams at Figma, Pitch, and Protocol Labs.", photo: "/images/equipe2.png", status: "PUBLISHED" },
        { name: "Annie Stanley", poste: "Product Manager", bio: "Former PM for Airtable, Medium, Ghost, and Lumi.", photo: "/images/equipe3.png", status: "PUBLISHED" },
        { name: "Johnny Bell", poste: "Frontend Developer", bio: "Former frontend dev for Linear, Coinbase, and Postscript.", photo: "/images/equipe4.png", status: "PUBLISHED" },
      ],
    });
  }

  if ((await prisma.contactMessage.count()) === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: "Client Partenaire",
          email: "partenaire@example.com",
          subject: "Demande de partenariat",
          message: "Bonjour, nous souhaitons discuter d'une collaboration media.",
          status: "NEW",
        },
        {
          name: "Equipe terrain",
          email: "terrain@example.com",
          subject: "Retour sur le live",
          message: "Le flux de diffusion etait stable pendant la plage du soir.",
          status: "IN_PROGRESS",
        },
      ],
    });
  }
}

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "knr-admin-api" });
});

app.post("/api/uploads", authMiddleware, adminMiddleware, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier reçu (image uniquement)." });
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.post("/api/auth/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    return res.status(401).json({ error: "Identifiants invalides." });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Identifiants invalides." });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: mapRole(user.role),
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || "24h" }
  );

  res.json({ token, user: mapUser(user) });
}));

app.get("/api/auth/me", authMiddleware, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: mapUser(user) });
}));

app.patch("/api/auth/me", authMiddleware, asyncHandler(async (req, res) => {
  const { name, phone, bio, currentPassword, newPassword } = req.body ?? {};

  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (currentPassword || newPassword) {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Mot de passe actuel et nouveau mot de passe requis." });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Mot de passe actuel invalide." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Le nouveau mot de passe est trop court." });
    }
  }

  const updated = await prisma.user.update({
    where: { id: req.user.sub },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(bio !== undefined ? { bio: bio || null } : {}),
      ...(newPassword ? { password: await bcrypt.hash(newPassword, 10) } : {}),
    },
  });

  res.json({ user: mapUser(updated) });
}));

app.get("/api/dashboard/summary", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const [users, lives, articles, reunions, programme] = await Promise.all([
    prisma.user.count(),
    prisma.live.count(),
    prisma.blogArticle.count(),
    prisma.reunion.count(),
    prisma.programmeItem.count(),
  ]);

  const liveNow = await prisma.live.findFirst({ where: { status: "LIVE" }, orderBy: { updatedAt: "desc" } });

  res.json({
    users,
    lives,
    articles,
    reunions,
    programme,
    liveNow: liveNow ? mapLive(liveNow) : null,
  });
}));

app.get("/api/users", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  res.json(users.map(mapUser));
}));

app.post("/api/users", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { name, email, password, role = "user", active = true, phone = "", bio = "" } = req.body ?? {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nom, email et mot de passe requis." });
  }

  const created = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: String(role).toUpperCase(),
      active: Boolean(active),
      phone: phone || null,
      bio: bio || null,
    },
  });

  res.status(201).json(mapUser(created));
}));

app.patch("/api/users/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, active, phone, bio } = req.body ?? {};

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(role ? { role: String(role).toUpperCase() } : {}),
      ...(typeof active === "boolean" ? { active } : {}),
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(bio !== undefined ? { bio: bio || null } : {}),
      ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
    },
  });

  res.json(mapUser(updated));
}));

app.delete("/api/users/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/lives", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const lives = await prisma.live.findMany({ orderBy: { updatedAt: "desc" } });
  res.json(lives.map(mapLive));
}));

app.post("/api/lives", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { titre, youtubeUrl, youtubeId, programme = "", status = "scheduled", viewers = 0 } = req.body ?? {};
  if (!titre) {
    return res.status(400).json({ error: "Titre requis." });
  }

  const created = await prisma.live.create({
    data: {
      titre,
      youtubeUrl: youtubeUrl || null,
      youtubeId: youtubeId || null,
      programme: programme || null,
      viewers: Number(viewers) || 0,
      status: String(status).toUpperCase(),
      createdBy: req.user.sub,
    },
  });

  res.status(201).json(mapLive(created));
}));

app.patch("/api/lives/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titre, youtubeUrl, youtubeId, programme, status, viewers, startedAt, endedAt } = req.body ?? {};

  const updated = await prisma.live.update({
    where: { id },
    data: {
      ...(titre ? { titre } : {}),
      ...(youtubeUrl ? { youtubeUrl } : {}),
      ...(youtubeId !== undefined ? { youtubeId: youtubeId || null } : {}),
      ...(programme !== undefined ? { programme: programme || null } : {}),
      ...(status ? { status: String(status).toUpperCase() } : {}),
      ...(viewers !== undefined ? { viewers: Number(viewers) || 0 } : {}),
      ...(startedAt !== undefined ? { startedAt: startedAt ? new Date(startedAt) : null } : {}),
      ...(endedAt !== undefined ? { endedAt: endedAt ? new Date(endedAt) : null } : {}),
    },
  });

  res.json(mapLive(updated));
}));

app.delete("/api/lives/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.live.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

async function endLive(id, { agentWarning = null } = {}) {
  youtubeDiscovery.stopDiscovery(id);
  const live = await prisma.live.update({
    where: { id },
    data: { status: "ENDED", endedAt: new Date() },
  });
  io.emit("live:stopped", mapLive(live));
  return { live, agentWarning };
}

agentHub.onExternalStreamEnded(async ({ liveId }) => {
  try {
    const live = await prisma.live.findUnique({ where: { id: liveId } });
    if (live && live.status === "LIVE") {
      await endLive(liveId, { agentWarning: "OBS s'est arrêté en dehors de la plateforme." });
    }
  } catch (error) {
    console.error("[agent] échec de clôture après arrêt externe:", error.message);
  }
});

app.get("/api/agent/status", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  res.json(agentHub.getAgentStatus());
}));

app.post("/api/lives/:id/start", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!agentHub.isAgentOnline()) {
    return res.status(503).json({
      error: "Agent OBS hors ligne. Démarrez l'agent sur le PC de streaming avant de lancer le direct.",
    });
  }

  const existing = await prisma.live.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "Live introuvable." });
  }

  try {
    await agentHub.startStream(id);
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }

  const live = await prisma.live.update({
    where: { id },
    data: {
      status: "LIVE",
      startedAt: new Date(),
      endedAt: null,
    },
  });

  await prisma.live.updateMany({
    where: { id: { not: id }, status: "LIVE" },
    data: {
      status: "ENDED",
      endedAt: new Date(),
    },
  });

  io.emit("live:started", mapLive(live));

  if (!live.youtubeId) {
    youtubeDiscovery.startDiscovery(live.id, {
      onFound: async (videoId) => {
        const updated = await prisma.live.update({
          where: { id: live.id },
          data: { youtubeId: videoId, youtubeUrl: `https://www.youtube.com/watch?v=${videoId}` },
        });
        io.emit("live:youtube_ready", mapLive(updated));
      },
      onGiveUp: () => io.emit("live:youtube_pending", { liveId: live.id }),
    });
  }

  res.json({ ok: true, live: mapLive(live) });
}));

app.post("/api/lives/:id/stop", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;

  let agentWarning = null;
  try {
    await agentHub.stopStream(id);
  } catch (error) {
    agentWarning = `Impossible de confirmer l'arrêt OBS (${error.message}). Vérifiez le PC de streaming.`;
  }

  const { live } = await endLive(id, { agentWarning });
  res.json({ ok: true, live: mapLive(live), warning: agentWarning });
}));

app.get("/api/reunions", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const reunions = await prisma.reunion.findMany({
    include: { host: true },
    orderBy: { scheduledAt: "desc" },
  });
  res.json(reunions.map(mapReunion));
}));

app.post("/api/reunions", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { titre, description = "", scheduledAt, assignedUserIds = [] } = req.body ?? {};
  if (!titre || !scheduledAt) {
    return res.status(400).json({ error: "Titre et date requis." });
  }

  const roomSlug = `${createSlug(titre)}-${crypto.randomBytes(4).toString("hex")}`;

  const reunion = await prisma.reunion.create({
    data: {
      titre,
      description: description || null,
      scheduledAt: new Date(scheduledAt),
      hostId: req.user.sub,
      status: "SCHEDULED",
      assignedUserIds: Array.isArray(assignedUserIds) ? assignedUserIds : [],
      roomSlug,
      accessCode: generateAccessCode(),
    },
    include: { host: true },
  });

  io.emit("reunion:created", mapReunion(reunion));
  res.status(201).json(mapReunion(reunion));
}));

app.patch("/api/reunions/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titre, description, scheduledAt, status, assignedUserIds } = req.body ?? {};

  const reunion = await prisma.reunion.update({
    where: { id },
    data: {
      ...(titre ? { titre } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      ...(status ? { status: normalizeReunionStatus(status) } : {}),
      ...(assignedUserIds !== undefined ? { assignedUserIds: Array.isArray(assignedUserIds) ? assignedUserIds : [] } : {}),
    },
    include: { host: true },
  });

  io.emit("reunion:updated", mapReunion(reunion));
  res.json(mapReunion(reunion));
}));

app.delete("/api/reunions/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.reunion.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/programme", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const items = await prisma.programmeItem.findMany({ orderBy: [{ date: "desc" }, { heure: "asc" }] });
  res.json(mapProgrammeItems(items));
}));

app.post("/api/programme", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { heure, titre, description = "", statut = "scheduled", date } = req.body ?? {};
  if (!heure || !titre) {
    return res.status(400).json({ error: "Heure et titre requis." });
  }

  const item = await prisma.programmeItem.create({
    data: {
      heure,
      titre,
      description: description || null,
      statut: String(statut).toUpperCase(),
      date: date ? new Date(date) : new Date(),
      createdBy: req.user.sub,
    },
  });

  res.status(201).json(mapProgrammeItem(item, computeProgrammeStatuses([item])[0]));
}));

app.patch("/api/programme/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { heure, titre, description, date } = req.body ?? {};

  const item = await prisma.programmeItem.update({
    where: { id },
    data: {
      ...(heure ? { heure } : {}),
      ...(titre ? { titre } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(date ? { date: new Date(date) } : {}),
    },
  });

  res.json(mapProgrammeItem(item, computeProgrammeStatuses([item])[0]));
}));

app.delete("/api/programme/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.programmeItem.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/articles", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const articles = await prisma.blogArticle.findMany({ include: { author: true }, orderBy: { updatedAt: "desc" } });
  res.json(articles.map(mapArticle));
}));

app.post("/api/articles", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const {
    titre,
    content,
    excerpt = "",
    readTime = "",
    featured = false,
    category = "",
    thumbnail = "",
    status = "draft",
    authorId,
  } = req.body ?? {};
  if (!titre || !content) {
    return res.status(400).json({ error: "Titre et contenu requis." });
  }

  const article = await prisma.blogArticle.create({
    data: {
      titre,
      slug: createSlug(titre),
      content,
      excerpt: excerpt || null,
      readTime: readTime || null,
      featured: !!featured,
      category: category || null,
      thumbnail: thumbnail || null,
      status: String(status).toUpperCase(),
      authorId: authorId || req.user.sub,
      publishedAt: String(status).toLowerCase() === "published" ? new Date() : null,
    },
    include: { author: true },
  });

  res.status(201).json(mapArticle(article));
}));

app.patch("/api/articles/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titre, content, excerpt, readTime, featured, category, thumbnail, status } = req.body ?? {};

  const article = await prisma.blogArticle.update({
    where: { id },
    data: {
      ...(titre ? { titre, slug: createSlug(titre) } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(excerpt !== undefined ? { excerpt: excerpt || null } : {}),
      ...(readTime !== undefined ? { readTime: readTime || null } : {}),
      ...(featured !== undefined ? { featured: !!featured } : {}),
      ...(category !== undefined ? { category: category || null } : {}),
      ...(thumbnail !== undefined ? { thumbnail: thumbnail || null } : {}),
      ...(status ? { status: String(status).toUpperCase() } : {}),
      ...(status && String(status).toLowerCase() === "published" ? { publishedAt: new Date() } : {}),
    },
    include: { author: true },
  });

  res.json(mapArticle(article));
}));

app.delete("/api/articles/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.blogArticle.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/emissions", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const emissions = await prisma.emission.findMany({ include: { author: true, episodes: true }, orderBy: { updatedAt: "desc" } });
  res.json(emissions.map(mapEmission));
}));

app.post("/api/emissions", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const {
    titre,
    sousTitre = "",
    categorie = "",
    animateur = "",
    duree = "",
    tags = [],
    description = "",
    thumbnail = "",
    youtubeUrl = "",
    views = 0,
    featured = false,
    status = "draft",
    authorId,
  } = req.body ?? {};
  if (!titre) {
    return res.status(400).json({ error: "Titre requis." });
  }

  const emission = await prisma.emission.create({
    data: {
      titre,
      slug: createSlug(titre),
      sousTitre: sousTitre || null,
      categorie: categorie || null,
      animateur: animateur || null,
      duree: duree || null,
      tags,
      description: description || null,
      thumbnail: thumbnail || null,
      youtubeUrl: youtubeUrl || null,
      views: Number(views) || 0,
      featured: !!featured,
      status: String(status).toUpperCase(),
      authorId: authorId || req.user.sub,
      publishedAt: String(status).toLowerCase() === "published" ? new Date() : null,
    },
    include: { author: true, episodes: true },
  });

  if (featured) {
    await prisma.emission.updateMany({ where: { id: { not: emission.id } }, data: { featured: false } });
  }

  res.status(201).json(mapEmission(emission));
}));

app.patch("/api/emissions/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titre, sousTitre, categorie, animateur, duree, tags, description, thumbnail, youtubeUrl, views, featured, status } = req.body ?? {};

  const emission = await prisma.emission.update({
    where: { id },
    data: {
      ...(titre ? { titre, slug: createSlug(titre) } : {}),
      ...(sousTitre !== undefined ? { sousTitre: sousTitre || null } : {}),
      ...(categorie !== undefined ? { categorie: categorie || null } : {}),
      ...(animateur !== undefined ? { animateur: animateur || null } : {}),
      ...(duree !== undefined ? { duree: duree || null } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(thumbnail !== undefined ? { thumbnail: thumbnail || null } : {}),
      ...(youtubeUrl !== undefined ? { youtubeUrl: youtubeUrl || null } : {}),
      ...(views !== undefined ? { views: Number(views) || 0 } : {}),
      ...(featured !== undefined ? { featured: !!featured } : {}),
      ...(status ? { status: String(status).toUpperCase() } : {}),
      ...(status && String(status).toLowerCase() === "published" ? { publishedAt: new Date() } : {}),
    },
    include: { author: true, episodes: true },
  });

  if (featured) {
    await prisma.emission.updateMany({ where: { id: { not: id } }, data: { featured: false } });
  }

  res.json(mapEmission(emission));
}));

app.delete("/api/emissions/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.emission.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/emissions/:emissionId/episodes", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const episodes = await prisma.episode.findMany({
    where: { emissionId: req.params.emissionId },
    orderBy: { createdAt: "desc" },
  });
  res.json(episodes.map(mapEpisode));
}));

app.post("/api/emissions/:emissionId/episodes", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { emissionId } = req.params;
  const { titre = "", youtubeUrl } = req.body ?? {};
  if (!youtubeUrl) {
    return res.status(400).json({ error: "URL YouTube requise." });
  }

  const emission = await prisma.emission.findUnique({ where: { id: emissionId } });
  if (!emission) {
    return res.status(404).json({ error: "Emission introuvable." });
  }

  const episode = await prisma.episode.create({
    data: { emissionId, titre: titre || null, youtubeUrl },
  });
  res.status(201).json(mapEpisode(episode));
}));

app.patch("/api/emissions/:emissionId/episodes/:episodeId", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { emissionId, episodeId } = req.params;
  const { titre, youtubeUrl } = req.body ?? {};

  const existing = await prisma.episode.findUnique({ where: { id: episodeId } });
  if (!existing || existing.emissionId !== emissionId) {
    return res.status(404).json({ error: "Episode introuvable." });
  }

  const episode = await prisma.episode.update({
    where: { id: episodeId },
    data: {
      ...(titre !== undefined ? { titre: titre || null } : {}),
      ...(youtubeUrl !== undefined ? { youtubeUrl } : {}),
    },
  });
  res.json(mapEpisode(episode));
}));

app.delete("/api/emissions/:emissionId/episodes/:episodeId", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { emissionId, episodeId } = req.params;
  const existing = await prisma.episode.findUnique({ where: { id: episodeId } });
  if (!existing || existing.emissionId !== emissionId) {
    return res.status(404).json({ error: "Episode introuvable." });
  }
  await prisma.episode.delete({ where: { id: episodeId } });
  res.status(204).end();
}));

app.get("/api/formations", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const formations = await prisma.formation.findMany({ orderBy: { updatedAt: "desc" } });
  res.json(formations.map(mapFormation));
}));

app.post("/api/formations", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const {
    slug,
    titre,
    categorie,
    sousTitre = "",
    description = "",
    prix = "",
    duree = "",
    niveau = "",
    lieu = "",
    debut = "",
    fin = "",
    placesRestantes = 0,
    clotureInscriptions,
    img = "",
    competences = [],
    modules = [],
    formateur = {},
    status = "draft",
  } = req.body ?? {};

  if (!titre || !categorie) {
    return res.status(400).json({ error: "Titre et categorie requis." });
  }

  const formation = await prisma.formation.create({
    data: {
      slug: slug || createSlug(titre),
      titre,
      categorie,
      sousTitre: sousTitre || null,
      description: description || null,
      prix: prix || null,
      duree: duree || null,
      niveau: niveau || null,
      lieu: lieu || null,
      debut: debut || null,
      fin: fin || null,
      placesRestantes: Number(placesRestantes) || 0,
      clotureInscriptions: clotureInscriptions ? new Date(clotureInscriptions) : null,
      img: img || null,
      competences,
      modules,
      formateurNom: formateur?.nom || null,
      formateurTitre: formateur?.titre || null,
      formateurBio: formateur?.bio || null,
      formateurPhoto: formateur?.photo || null,
      status: String(status).toUpperCase(),
    },
  });

  res.status(201).json(mapFormation(formation));
}));

app.patch("/api/formations/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    slug,
    titre,
    categorie,
    sousTitre,
    description,
    prix,
    duree,
    niveau,
    lieu,
    debut,
    fin,
    placesRestantes,
    clotureInscriptions,
    img,
    competences,
    modules,
    formateur,
    status,
  } = req.body ?? {};

  const formation = await prisma.formation.update({
    where: { id },
    data: {
      ...(slug ? { slug } : {}),
      ...(titre ? { titre } : {}),
      ...(categorie ? { categorie } : {}),
      ...(sousTitre !== undefined ? { sousTitre: sousTitre || null } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(prix !== undefined ? { prix: prix || null } : {}),
      ...(duree !== undefined ? { duree: duree || null } : {}),
      ...(niveau !== undefined ? { niveau: niveau || null } : {}),
      ...(lieu !== undefined ? { lieu: lieu || null } : {}),
      ...(debut !== undefined ? { debut: debut || null } : {}),
      ...(fin !== undefined ? { fin: fin || null } : {}),
      ...(placesRestantes !== undefined ? { placesRestantes: Number(placesRestantes) || 0 } : {}),
      ...(clotureInscriptions !== undefined ? { clotureInscriptions: clotureInscriptions ? new Date(clotureInscriptions) : null } : {}),
      ...(img !== undefined ? { img: img || null } : {}),
      ...(competences !== undefined ? { competences } : {}),
      ...(modules !== undefined ? { modules } : {}),
      ...(formateur?.nom !== undefined ? { formateurNom: formateur.nom || null } : {}),
      ...(formateur?.titre !== undefined ? { formateurTitre: formateur.titre || null } : {}),
      ...(formateur?.bio !== undefined ? { formateurBio: formateur.bio || null } : {}),
      ...(formateur?.photo !== undefined ? { formateurPhoto: formateur.photo || null } : {}),
      ...(status ? { status: String(status).toUpperCase() } : {}),
    },
  });

  res.json(mapFormation(formation));
}));

app.delete("/api/formations/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.formation.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/messages", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { context, contextId } = req.query;
  const messages = await prisma.contactMessage.findMany({
    where: {
      ...(context ? { context: String(context) } : {}),
      ...(contextId ? { contextId: String(contextId) } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
  res.json(messages.map(mapContactMessage));
}));

app.post("/api/messages", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { name, email, subject, message, status = "NEW", assignedTo = "" } = req.body ?? {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Champs de message requis." });
  }

  const created = await prisma.contactMessage.create({
    data: {
      name,
      email,
      subject,
      message,
      status,
      assignedTo: assignedTo || null,
    },
  });

  res.status(201).json(mapContactMessage(created));
}));

app.patch("/api/messages/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, subject, message, status, assignedTo } = req.body ?? {};

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(subject ? { subject } : {}),
      ...(message !== undefined ? { message } : {}),
      ...(status ? { status } : {}),
      ...(assignedTo !== undefined ? { assignedTo: assignedTo || null } : {}),
    },
  });

  res.json(mapContactMessage(updated));
}));

app.delete("/api/messages/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/equipment", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const items = await prisma.equipment.findMany({ orderBy: { updatedAt: "desc" } });
  res.json(items.map(mapEquipment));
}));

app.post("/api/equipment", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const {
    name,
    category = "",
    status = "AVAILABLE",
    description = "",
    location = "",
    image = "",
    tarifJour = 0,
    caution = "",
    images = [],
    specs = [],
    conditions = [],
    reservedDates = [],
  } = req.body ?? {};
  if (!name) {
    return res.status(400).json({ error: "Nom de l'equipement requis." });
  }

  const created = await prisma.equipment.create({
    data: {
      name,
      slug: createSlug(name),
      category: category || null,
      status,
      description: description || null,
      location: location || null,
      image: image || null,
      tarifJour: Number(tarifJour) || 0,
      caution: caution || null,
      images,
      specs,
      conditions,
      reservedDates,
    },
  });

  res.status(201).json(mapEquipment(created));
}));

app.patch("/api/equipment/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, status, description, location, image, tarifJour, caution, images, specs, conditions, reservedDates } = req.body ?? {};

  const updated = await prisma.equipment.update({
    where: { id },
    data: {
      ...(name ? { name, slug: createSlug(name) } : {}),
      ...(category !== undefined ? { category: category || null } : {}),
      ...(status ? { status } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(location !== undefined ? { location: location || null } : {}),
      ...(image !== undefined ? { image: image || null } : {}),
      ...(tarifJour !== undefined ? { tarifJour: Number(tarifJour) || 0 } : {}),
      ...(caution !== undefined ? { caution: caution || null } : {}),
      ...(images !== undefined ? { images } : {}),
      ...(specs !== undefined ? { specs } : {}),
      ...(conditions !== undefined ? { conditions } : {}),
      ...(reservedDates !== undefined ? { reservedDates } : {}),
    },
  });

  res.json(mapEquipment(updated));
}));

app.delete("/api/equipment/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.equipment.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/studio-bookings", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const bookings = await prisma.studioBooking.findMany({ orderBy: { createdAt: "desc" } });
  res.json(bookings.map(mapStudioBooking));
}));

app.patch("/api/studio-bookings/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { status } = req.body ?? {};
  const allowed = ["pending", "confirmed", "rejected", "cancelled"];
  if (!status || !allowed.includes(String(status).toLowerCase())) {
    return res.status(400).json({ error: "Statut invalide." });
  }

  const booking = await prisma.studioBooking.update({
    where: { id: req.params.id },
    data: { status: String(status).toUpperCase() },
  });
  res.json(mapStudioBooking(booking));
}));

app.delete("/api/studio-bookings/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.studioBooking.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/team", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const members = await prisma.teamMember.findMany({ orderBy: { createdAt: "desc" } });
  res.json(members.map(mapTeamMember));
}));

app.post("/api/team", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { name, poste, bio = "", photo = "", status = "draft" } = req.body ?? {};
  if (!name || !poste) {
    return res.status(400).json({ error: "Nom et poste requis." });
  }

  const member = await prisma.teamMember.create({
    data: {
      name,
      poste,
      bio: bio || null,
      photo: photo || null,
      status: String(status).toUpperCase(),
    },
  });

  res.status(201).json(mapTeamMember(member));
}));

app.patch("/api/team/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, poste, bio, photo, status } = req.body ?? {};

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(poste ? { poste } : {}),
      ...(bio !== undefined ? { bio: bio || null } : {}),
      ...(photo !== undefined ? { photo: photo || null } : {}),
      ...(status ? { status: String(status).toUpperCase() } : {}),
    },
  });

  res.json(mapTeamMember(member));
}));

app.delete("/api/team/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.teamMember.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/public/team", asyncHandler(async (_req, res) => {
  const members = await prisma.teamMember.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });
  res.json(members.map(mapTeamMember));
}));

app.get("/api/public/studio-bookings/dates", asyncHandler(async (_req, res) => {
  const bookings = await prisma.studioBooking.findMany({
    where: { status: { in: ["PENDING", "CONFIRMED"] } },
    select: { date: true },
  });
  res.json({ dates: Array.from(new Set(bookings.map((b) => b.date))) });
}));

app.post("/api/public/studio-bookings", asyncHandler(async (req, res) => {
  const {
    date,
    heure = "",
    forfait,
    typeProjet = "",
    prenom,
    nom,
    email,
    telephone,
    entreprise = "",
    description = "",
    modePaiement = "",
  } = req.body ?? {};

  if (!date || !forfait || !prenom || !nom || !email || !telephone) {
    return res.status(400).json({ error: "Date, forfait, prénom, nom, email et téléphone requis." });
  }

  const booking = await prisma.studioBooking.create({
    data: {
      date,
      heure: heure || null,
      forfait,
      typeProjet: typeProjet || null,
      prenom,
      nom,
      email,
      telephone,
      entreprise: entreprise || null,
      description: description || null,
      modePaiement: modePaiement || null,
      reference: generateBookingReference(),
    },
  });

  res.status(201).json(mapStudioBooking(booking));
}));

app.get("/api/settings", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  res.json(mapSettings(settings));
}));

app.patch("/api/settings", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { siteName, siteTagline, youtubeApiKey, youtubeChannelId, agentObsToken, obsWsPort, obsWsPassword } = req.body ?? {};

  const data = {
    ...(siteName !== undefined ? { siteName: siteName || null } : {}),
    ...(siteTagline !== undefined ? { siteTagline: siteTagline || null } : {}),
    ...(youtubeApiKey !== undefined ? { youtubeApiKey: youtubeApiKey || null } : {}),
    ...(youtubeChannelId !== undefined ? { youtubeChannelId: youtubeChannelId || null } : {}),
    ...(agentObsToken !== undefined ? { agentObsToken: agentObsToken || null } : {}),
    ...(obsWsPort !== undefined ? { obsWsPort: obsWsPort || null } : {}),
    ...(obsWsPassword !== undefined ? { obsWsPassword: obsWsPassword || null } : {}),
  };

  const settings = await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  await settingsStore.refreshSettings();
  agentHub.pushConfigToAgent();
  res.json(mapSettings(settings));
}));

app.post("/api/public/messages", asyncHandler(async (req, res) => {
  const { name, email, subject, message, context, contextId } = req.body ?? {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const created = await prisma.contactMessage.create({
    data: {
      name,
      email,
      subject,
      message,
      status: "NEW",
      context: context || null,
      contextId: contextId || null,
    },
  });

  res.status(201).json({ ok: true, id: created.id });
}));

app.get("/api/public/emissions", asyncHandler(async (_req, res) => {
  const emissions = await prisma.emission.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true, episodes: true },
    orderBy: { publishedAt: "desc" },
  });
  res.json(emissions.map(mapEmission));
}));

app.get("/api/public/emissions/:slug", asyncHandler(async (req, res) => {
  const emission = await prisma.emission.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
    include: { author: true, episodes: true },
  });
  if (!emission) return res.status(404).json({ error: "Emission introuvable." });
  res.json(mapEmission(emission));
}));

app.get("/api/public/emissions/:slug/episodes", asyncHandler(async (req, res) => {
  const emission = await prisma.emission.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
  });
  if (!emission) return res.status(404).json({ error: "Emission introuvable." });

  const episodes = await prisma.episode.findMany({
    where: { emissionId: emission.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(episodes.map(mapEpisode));
}));

app.get("/api/public/formations", asyncHandler(async (_req, res) => {
  const formations = await prisma.formation.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
  });
  res.json(formations.map(mapFormation));
}));

app.get("/api/public/formations/:slug", asyncHandler(async (req, res) => {
  const formation = await prisma.formation.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
  });
  if (!formation) return res.status(404).json({ error: "Formation introuvable." });
  res.json(mapFormation(formation));
}));

app.get("/api/public/articles", asyncHandler(async (_req, res) => {
  const articles = await prisma.blogArticle.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
  });
  res.json(articles.map(mapArticle));
}));

app.get("/api/public/articles/:slug", asyncHandler(async (req, res) => {
  const article = await prisma.blogArticle.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
    include: { author: true },
  });
  if (!article) return res.status(404).json({ error: "Article introuvable." });
  res.json(mapArticle(article));
}));

app.get("/api/public/equipment", asyncHandler(async (_req, res) => {
  const items = await prisma.equipment.findMany({ orderBy: { updatedAt: "desc" } });
  res.json(items.map(mapEquipment));
}));

app.get("/api/public/equipment/:slug", asyncHandler(async (req, res) => {
  const item = await prisma.equipment.findFirst({ where: { slug: req.params.slug } });
  if (!item) return res.status(404).json({ error: "Equipement introuvable." });
  res.json(mapEquipment(item));
}));

app.get("/api/entrepreneurs", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const items = await prisma.entrepreneur.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items.map(mapEntrepreneur));
}));

app.post("/api/entrepreneurs", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { name, role, bio = "", photo = "", socials = {}, active = true } = req.body ?? {};
  if (!name || !role) {
    return res.status(400).json({ error: "Nom et rôle requis." });
  }

  const created = await prisma.entrepreneur.create({
    data: {
      name,
      role,
      bio: bio || null,
      photo: photo || null,
      socials: socials && typeof socials === "object" ? socials : {},
      active: !!active,
    },
  });

  res.status(201).json(mapEntrepreneur(created));
}));

app.patch("/api/entrepreneurs/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, role, bio, photo, socials, active } = req.body ?? {};

  const updated = await prisma.entrepreneur.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(role ? { role } : {}),
      ...(bio !== undefined ? { bio: bio || null } : {}),
      ...(photo !== undefined ? { photo: photo || null } : {}),
      ...(socials !== undefined ? { socials: socials && typeof socials === "object" ? socials : {} } : {}),
      ...(active !== undefined ? { active: !!active } : {}),
    },
  });

  res.json(mapEntrepreneur(updated));
}));

app.delete("/api/entrepreneurs/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.entrepreneur.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/public/entrepreneurs", asyncHandler(async (_req, res) => {
  const items = await prisma.entrepreneur.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(items.map(mapEntrepreneur));
}));

function getAuthenticatedUser(req) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function buildJitsiJoinUrl(roomSlug, displayName) {
  const base = `https://meet.jit.si/${roomSlug}`;
  if (!displayName) return base;
  return `${base}#userInfo.displayName=${encodeURIComponent(JSON.stringify(displayName))}`;
}

app.get("/api/public/reunions/:roomSlug", asyncHandler(async (req, res) => {
  const reunion = await prisma.reunion.findFirst({
    where: { roomSlug: req.params.roomSlug },
    include: { host: true },
  });
  if (!reunion) return res.status(404).json({ error: "Réunion introuvable." });

  const mapped = mapReunion(reunion);
  const authUser = getAuthenticatedUser(req);
  const assigned = !!authUser && mapped.assignedUserIds.includes(authUser.sub);
  const started = reunion.status === "IN_PROGRESS";

  res.json({
    titre: mapped.titre,
    scheduledAt: mapped.scheduledAt,
    status: mapped.status,
    host: mapped.host,
    roomSlug: mapped.roomSlug,
    assigned,
    started,
    joinUrl: assigned && started ? buildJitsiJoinUrl(reunion.roomSlug, authUser.name) : null,
  });
}));

app.post("/api/public/reunions/:roomSlug/verify", asyncHandler(async (req, res) => {
  const { code, name } = req.body ?? {};
  const reunion = await prisma.reunion.findFirst({ where: { roomSlug: req.params.roomSlug } });
  if (!reunion) return res.status(404).json({ error: "Réunion introuvable." });

  if (!code || String(code).trim().toUpperCase() !== (reunion.accessCode ?? "").toUpperCase()) {
    return res.status(403).json({ ok: false, error: "Code d'accès invalide." });
  }
  if (reunion.status === "ENDED") {
    return res.status(409).json({ ok: false, error: "Cette réunion est terminée." });
  }
  if (reunion.status !== "IN_PROGRESS") {
    return res.status(409).json({ ok: false, error: "La réunion n'a pas encore démarré. Réessayez lorsque l'hôte l'aura démarrée." });
  }

  const displayName = name && String(name).trim() ? String(name).trim() : "Invité";
  res.json({ ok: true, joinUrl: buildJitsiJoinUrl(reunion.roomSlug, displayName) });
}));

app.get("/api/webtv/current", asyncHandler(async (_req, res) => {
  const live = await prisma.live.findFirst({ where: { status: "LIVE" }, orderBy: { updatedAt: "desc" } });
  const programme = await prisma.programmeItem.findMany({ orderBy: [{ date: "desc" }, { heure: "asc" }] });
  const emissions = await prisma.emission.findMany({ include: { author: true, episodes: true }, orderBy: { updatedAt: "desc" }, take: 6 });

  res.json({
    live: live ? mapLive(live) : null,
    programme: mapProgrammeItems(programme),
    emissions: emissions.map(mapEmission),
  });
}));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await prisma.$connect();
    await seedDatabase();
    await settingsStore.refreshSettings();
    server.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error);
    process.exit(1);
  }
})();
