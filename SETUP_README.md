# KNR COM - Frontend avec Admin Dashboard & Live/Réunions

## 🎯 Vue d'ensemble

Plateforme media Next.js avec :
- 🎬 WebTV avec lives en direct
- 💼 Dashboard d'administration
- 👥 Gestion utilisateurs/émissions/réunions
- 📞 Module de réunion online

## 🚀 Démarrage rapide

### Prerequisites
- Node.js 18+
- npm ou yarn
- Backend Express lancé

### Installation & Lancement

```bash
# Frontend
yarn install
yarn dev

# Backend (dans un autre terminal)
cd server
npm install
npm run dev
```

Accès :
- Frontend : http://localhost:3000
- Backend : http://localhost:4000
- Admin : http://localhost:3000/admin
- WebTV : http://localhost:3000/webtv

## 📁 Structure du projet

```
knr_com_frontend/
├── src/
│   ├── app/
│   │   ├── admin/              # Tableau de bord
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── users/          # Gestion users
│   │   │   ├── emissions/      # Gestion émissions
│   │   │   ├── reunions/       # Gestion réunions
│   │   │   └── settings/       # Paramètres
│   │   ├── webtv/              # Page TV avec lives
│   │   └── ...autres pages
│   └── components/
│       ├── AdminSidebar.tsx    # Nav admin
│       ├── StartLiveModal.tsx  # Modal live
│       └── StartReunionModal.tsx # Modal réunion
├── server/
│   ├── src/
│   │   └── index.js            # Express server
│   ├── package.json
│   └── .env
├── INTEGRATION_GUIDE.md         # Documentation API
└── test-api.js                  # Tests endpoints
```

## 🔧 Configuration

### Variables d'environnement

**Frontend** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend** (`server/.env`)
```env
PORT=4000
NODE_ENV=development
```

## 📚 Pages principales

### User-facing
- `/` - Accueil
- `/webtv` - Streaming live
- `/emissions` - Catalogue émissions
- `/formations` - Formations
- `/blog` - Articles

### Admin
- `/admin` - Dashboard
- `/admin/users` - Gestion utilisateurs
- `/admin/emissions` - Gestion émissions
- `/admin/reunions` - Gestion réunions
- `/admin/settings` - Paramètres

## 🎨 Design System

**Couleurs principales**
- Primaire : `sky-400`
- Dark : `neutral-950`
- Live : `red-500`
- Réunion : `sky-500`

**Fonts**
- Titres : `Poppins`
- Corps : `Inter`

**Animations**
- Framer Motion pour transitions
- Tailwind pour micro-animations

## 🔌 API Endpoints (Backend)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/users` | Liste utilisateurs |
| GET | `/api/emissions` | Liste émissions |
| GET | `/api/reunions` | Liste réunions |
| POST | `/api/reunions` | Créer réunion |
| POST | `/api/start-live` | Démarrer live |

## 🧪 Tests

```bash
# Test API
node test-api.js

# Tests unitaires (TBD)
yarn test

# Tests e2e (TBD)
yarn test:e2e
```

## 🐳 Docker

```bash
# Build & run backend
cd server
docker build -t knr-backend:latest .
docker run -p 4000:4000 knr-backend:latest

# Ou docker-compose (TBD)
docker-compose up
```

## 📦 Dependencies principales

**Frontend**
- `next` - Framework React
- `react` - UI Library
- `framer-motion` - Animations
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `next/image` - Optimisation images

**Backend**
- `express` - Web server
- `socket.io` - Real-time
- `cors` - Cross-origin

## 🔐 Sécurité

- [ ] JWT authentication
- [ ] CORS configuré
- [ ] Input validation
- [ ] Rate limiting
- [ ] HTTPS en production
- [ ] Secrets dans environment

## 📝 Prochaines étapes

1. Authentification complète (JWT + refresh tokens)
2. Base de données (MongoDB/PostgreSQL)
3. Upload fichiers (multer + S3)
4. Notifications (email + SMS)
5. Streaming vidéo (HLS/DASH)
6. Webinars (Jitsi/Whereby)

## 🐛 Troubleshooting

**Erreur CORS ?**
- Vérifier `NEXT_PUBLIC_API_URL`
- Vérifier backend CORS settings
- Port 4000 ouvert ?

**API timeout ?**
- Backend lancé ? (`cd server && npm run dev`)
- Vérifier logs terminal

**Modaux ne s'affichent pas ?**
- Vérifier imports des modaux
- Vérifier z-index CSS

## 📞 Support

- Issues : GitHub Issues
- Docs : [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- Checklist : [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

