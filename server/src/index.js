require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const prisma = require("./prismaClient");
const { authMiddleware, adminMiddleware } = require("./middleware/auth");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

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
    participants: Array.isArray(reunion.participants) ? reunion.participants : [],
  };
}

function mapProgrammeItem(item) {
  const statut = mapRole(item.statut);
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

function mapArticle(article) {
  return {
    id: article.id,
    titre: article.titre,
    slug: article.slug,
    content: article.content,
    status: mapRole(article.status),
    author: article.author?.name ?? "",
    category: article.category ?? "",
    publishedAt: toDateOnly(article.publishedAt),
    updatedAt: toDateOnly(article.updatedAt),
    thumbnail: article.thumbnail ?? "",
  };
}

function mapEmission(emission) {
  return {
    id: emission.id,
    titre: emission.titre,
    slug: emission.slug,
    description: emission.description ?? "",
    thumbnail: emission.thumbnail ?? "",
    youtubeUrl: emission.youtubeUrl ?? "",
    views: String(emission.views),
    status: mapRole(emission.status),
    publishedAt: toDateOnly(emission.publishedAt),
    updatedAt: toDateOnly(emission.updatedAt),
    author: emission.author?.name ?? "",
  };
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
    joursClotureInscription: formation.joursClotureInscription,
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
  };
}

function mapEquipment(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category ?? "",
    status: item.status,
    description: item.description ?? "",
    location: item.location ?? "",
    image: item.image ?? "",
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
    await prisma.emission.createMany({
      data: [
        {
          titre: "Business Africa - Episode 12",
          slug: createSlug("Business Africa - Episode 12"),
          description: "Edition speciale investisseurs et startups.",
          thumbnail: "/images/webtv1.png",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          views: 4200,
          status: "PUBLISHED",
          publishedAt: new Date("2026-07-10T00:00:00.000Z"),
          authorId: admin.id,
        },
        {
          titre: "Tech Talk - L'IA en Afrique",
          slug: createSlug("Tech Talk - L'IA en Afrique"),
          description: "Un format propose pour les innovations du continent.",
          thumbnail: "/images/webtv2.png",
          youtubeUrl: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
          views: 3100,
          status: "DRAFT",
          authorId: admin.id,
        },
      ],
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
          category: "Video",
          status: "RESERVED",
          description: "Camera principale reservee pour le live du jour.",
          location: "Studio principal",
          image: "/images/webtv1.png",
        },
        {
          name: "Kit micro",
          category: "Audio",
          status: "AVAILABLE",
          description: "Microphones et accessoires disponibles.",
          location: "Regie audio",
          image: "/images/webtv2.png",
        },
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
  if (!titre || !youtubeUrl) {
    return res.status(400).json({ error: "Titre et URL YouTube requis." });
  }

  const created = await prisma.live.create({
    data: {
      titre,
      youtubeUrl,
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

app.post("/api/lives/:id/start", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
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
  res.json({ ok: true, live: mapLive(live) });
}));

app.post("/api/lives/:id/stop", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const live = await prisma.live.update({
    where: { id: req.params.id },
    data: {
      status: "ENDED",
      endedAt: new Date(),
    },
  });

  io.emit("live:stopped", mapLive(live));
  res.json({ ok: true, live: mapLive(live) });
}));

app.get("/api/reunions", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const reunions = await prisma.reunion.findMany({
    include: { host: true },
    orderBy: { scheduledAt: "desc" },
  });
  res.json(reunions.map(mapReunion));
}));

app.post("/api/reunions", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { titre, description = "", scheduledAt, hostId, host, participants = [] } = req.body ?? {};
  const resolvedHostId = hostId || req.user.sub;
  if (!titre || !scheduledAt) {
    return res.status(400).json({ error: "Titre, date et responsable requis." });
  }

  const reunion = await prisma.reunion.create({
    data: {
      titre,
      description: description || null,
      scheduledAt: new Date(scheduledAt),
      hostId: resolvedHostId,
      status: "SCHEDULED",
      participants,
    },
    include: { host: true },
  });

  io.emit("reunion:created", mapReunion(reunion));
  res.status(201).json(mapReunion(reunion));
}));

app.patch("/api/reunions/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titre, description, scheduledAt, hostId, host, status, participants } = req.body ?? {};

  const reunion = await prisma.reunion.update({
    where: { id },
    data: {
      ...(titre ? { titre } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      ...(hostId ? { hostId } : host ? { hostId: req.user.sub } : {}),
      ...(status ? { status: String(status).toUpperCase() } : {}),
      ...(participants ? { participants } : {}),
    },
    include: { host: true },
  });

  res.json(mapReunion(reunion));
}));

app.delete("/api/reunions/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.reunion.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/programme", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const items = await prisma.programmeItem.findMany({ orderBy: [{ date: "desc" }, { heure: "asc" }] });
  res.json(items.map(mapProgrammeItem));
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

  res.status(201).json(mapProgrammeItem(item));
}));

app.patch("/api/programme/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { heure, titre, description, statut, date } = req.body ?? {};

  const item = await prisma.programmeItem.update({
    where: { id },
    data: {
      ...(heure ? { heure } : {}),
      ...(titre ? { titre } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(statut ? { statut: String(statut).toUpperCase() } : {}),
      ...(date ? { date: new Date(date) } : {}),
    },
  });

  res.json(mapProgrammeItem(item));
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
  const { titre, content, category = "", thumbnail = "", status = "draft", authorId } = req.body ?? {};
  if (!titre || !content) {
    return res.status(400).json({ error: "Titre et contenu requis." });
  }

  const article = await prisma.blogArticle.create({
    data: {
      titre,
      slug: createSlug(titre),
      content,
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
  const { titre, content, category, thumbnail, status } = req.body ?? {};

  const article = await prisma.blogArticle.update({
    where: { id },
    data: {
      ...(titre ? { titre, slug: createSlug(titre) } : {}),
      ...(content !== undefined ? { content } : {}),
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
  const emissions = await prisma.emission.findMany({ include: { author: true }, orderBy: { updatedAt: "desc" } });
  res.json(emissions.map(mapEmission));
}));

app.post("/api/emissions", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { titre, description = "", thumbnail = "", youtubeUrl = "", views = 0, status = "draft", authorId } = req.body ?? {};
  if (!titre) {
    return res.status(400).json({ error: "Titre requis." });
  }

  const emission = await prisma.emission.create({
    data: {
      titre,
      slug: createSlug(titre),
      description: description || null,
      thumbnail: thumbnail || null,
      youtubeUrl: youtubeUrl || null,
      views: Number(views) || 0,
      status: String(status).toUpperCase(),
      authorId: authorId || req.user.sub,
      publishedAt: String(status).toLowerCase() === "published" ? new Date() : null,
    },
    include: { author: true },
  });

  res.status(201).json(mapEmission(emission));
}));

app.patch("/api/emissions/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titre, description, thumbnail, youtubeUrl, views, status } = req.body ?? {};

  const emission = await prisma.emission.update({
    where: { id },
    data: {
      ...(titre ? { titre, slug: createSlug(titre) } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(thumbnail !== undefined ? { thumbnail: thumbnail || null } : {}),
      ...(youtubeUrl !== undefined ? { youtubeUrl: youtubeUrl || null } : {}),
      ...(views !== undefined ? { views: Number(views) || 0 } : {}),
      ...(status ? { status: String(status).toUpperCase() } : {}),
      ...(status && String(status).toLowerCase() === "published" ? { publishedAt: new Date() } : {}),
    },
    include: { author: true },
  });

  res.json(mapEmission(emission));
}));

app.delete("/api/emissions/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.emission.delete({ where: { id: req.params.id } });
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
    joursClotureInscription = 0,
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
      joursClotureInscription: Number(joursClotureInscription) || 0,
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
    joursClotureInscription,
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
      ...(joursClotureInscription !== undefined ? { joursClotureInscription: Number(joursClotureInscription) || 0 } : {}),
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

app.get("/api/messages", authMiddleware, adminMiddleware, asyncHandler(async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { updatedAt: "desc" } });
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
  const { name, category = "", status = "AVAILABLE", description = "", location = "", image = "" } = req.body ?? {};
  if (!name) {
    return res.status(400).json({ error: "Nom de l'equipement requis." });
  }

  const created = await prisma.equipment.create({
    data: {
      name,
      category: category || null,
      status,
      description: description || null,
      location: location || null,
      image: image || null,
    },
  });

  res.status(201).json(mapEquipment(created));
}));

app.patch("/api/equipment/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, status, description, location, image } = req.body ?? {};

  const updated = await prisma.equipment.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(category !== undefined ? { category: category || null } : {}),
      ...(status ? { status } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(location !== undefined ? { location: location || null } : {}),
      ...(image !== undefined ? { image: image || null } : {}),
    },
  });

  res.json(mapEquipment(updated));
}));

app.delete("/api/equipment/:id", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  await prisma.equipment.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.get("/api/webtv/current", asyncHandler(async (_req, res) => {
  const live = await prisma.live.findFirst({ where: { status: "LIVE" }, orderBy: { updatedAt: "desc" } });
  const programme = await prisma.programmeItem.findMany({ orderBy: [{ date: "desc" }, { heure: "asc" }] });
  const emissions = await prisma.emission.findMany({ include: { author: true }, orderBy: { updatedAt: "desc" }, take: 6 });

  res.json({
    live: live ? mapLive(live) : null,
    programme: programme.map(mapProgrammeItem),
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
    server.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error);
    process.exit(1);
  }
})();
