# Documentation - Intégration KNR COM (Dashboard Admin + Live/Réunions)

## Résumé des changements

Ce projet a reçu :
1. **Page Admin Dashboard** (`src/app/admin/page.tsx`)
2. **Composants Admin** (`AdminSidebar.tsx`, `AdminNavbar.tsx`)
3. **Intégration Live/Réunions** sur `src/app/webtv/page.tsx`
4. **Modaux interactifs** pour démarrer live/réunions
5. **Backend scaffold** (`server/`) - Express + Socket.io

---

## Démarrage rapide

### Frontend

```bash
yarn dev
```

Accès : http://localhost:3000

### Backend scaffold

```bash
cd server
npm install
npm run dev
```

Accès : http://localhost:4000

---

## Pages créées/modifiées

### 1. **Tableau de bord Admin** (`/admin`)
- Navigation latérale avec liens (Dashboard, Utilisateurs, Émissions, Réunions)
- Cartes KPI (nombre utilisateurs, émissions, réunions)
- Listes d'aperçus (utilisateurs récents, émissions récentes, réunions)
- Consomme l'API backend : `GET /api/users`, `GET /api/emissions`, `GET /api/reunions`

### 2. **Page WebTV améliorée** (`/webtv`)
- Boutons ajoutés :
  - **"Démarrer un live"** → Modal pour créer un live
  - **"Réunion"** → Modal pour créer une réunion (sélection utilisateurs par rôle)
- Socket.io écoutera `live:started` et `reunion:created` en temps réel
- Les modaux appellent :
  - `POST /api/start-live` (démarrage d'un live)
  - `POST /api/reunions` (création d'une réunion avec participants)

---

## API Backend (Scaffold)

**Base URL** : http://localhost:4000

### Endpoints disponibles

| Méthode | Route | Body | Description |
|---------|-------|------|-------------|
| GET | `/api/users` | - | Récupère la liste des utilisateurs |
| GET | `/api/emissions` | - | Récupère la liste des émissions |
| GET | `/api/reunions` | - | Récupère la liste des réunions |
| POST | `/api/reunions` | `{ titre, heure, participants: [ids] }` | Crée une réunion |
| POST | `/api/start-live` | `{ emissionId }` | Démarre un live |

### Socket.io Events

- **`live:started`** - Émis quand un live démarre
- **`reunion:created`** - Émis quand une réunion est créée

---

## Composants créés

### `StartLiveModal.tsx`
- Modal pour démarrer un live
- Champ de saisie (titre du live)
- Appelle `POST /api/start-live` au backend
- Couleurs : rouge (thème live)

### `StartReunionModal.tsx`
- Modal pour créer une réunion
- Filtre utilisateurs par rôle
- Sélection multiple des participants
- Appelle `POST /api/reunions` au backend
- Couleurs : sky-blue (thème réunion)

### `AdminSidebar.tsx`
- Navigation admin avec icônes lucide-react
- Liens vers Dashboard, Utilisateurs, Émissions, Réunions, Paramètres
- Style cohérent avec la charte KNR COM

### `AdminNavbar.tsx`
- Entête du dashboard
- Affiche "Panneau d'administration"

---

## Configuration d'environnement

Ajouter dans `.env.local` (frontend) :

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Prochaines étapes recommandées

1. **Authentification** : Ajouter JWT au backend + protéger les routes
2. **Base de données** : Remplacer les arrays en mémoire par MongoDB/PostgreSQL
3. **Validation** : Ajouter zod/joi pour valider les inputs
4. **Tests** : Jest + React Testing Library pour les composants
5. **Déploiement** : Préparer Docker + CI/CD (GitHub Actions)
6. **Webinar SDK** : Intégrer Jitsi/Whereby pour les réunions en vidéo
7. **Notifications** : Socket.io + email pour invitations réunions

---

## Architecture Backend Idéale (À implémenter)

```
server/
├── src/
│   ├── models/          # Mongoose/Prisma schemas
│   │   ├── User.ts
│   │   ├── Emission.ts
│   │   └── Reunion.ts
│   ├── routes/          # Express routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── emissions.ts
│   │   └── reunions.ts
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation
│   ├── socket/          # Socket.io handlers
│   └── index.ts         # Entry point
├── .env
└── package.json
```

---

## Notes de développement

- Les données sont actuellement en mémoire (scaffold)
- Les couleurs suivent la charte : sky-400 (primaire), red-500 (live), neutral-950 (dark)
- Tous les composants utilisent Framer Motion pour les animations
- Next.js 15+ requis (App Router)
- Tailwind CSS avec configuration existante

