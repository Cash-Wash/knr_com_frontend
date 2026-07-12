# Déploiement KNR COM - Checklist

## Phase 1 : Développement Local ✅

- [x] Dashboard admin créé (`/admin`)
- [x] Pages de gestion (users, emissions, reunions)
- [x] Modaux live/réunion intégrés
- [x] Backend scaffold (Express + Socket.io)
- [x] Endpoints de base fonctionnels

## Phase 2 : Préparation Production

### Frontend
- [ ] Remplacer `process.env.NEXT_PUBLIC_API_URL` par variable d'environnement Vercel
- [ ] Configurer CORS côté backend pour domaine production
- [ ] Ajouter authentification JWT
- [ ] Implémenter error boundaries
- [ ] Tests Jest + React Testing Library
- [ ] Optimisation images et lazy loading

### Backend
- [ ] Migrer des données en mémoire vers DB (MongoDB/PostgreSQL)
- [ ] Ajouter middleware d'authentification JWT
- [ ] Validation des inputs (zod/joi)
- [ ] Logging structuré (Winston/Pino)
- [ ] Rate limiting
- [ ] CORS configuré correctement

## Phase 3 : Intégrations Tierces

### Live/Réunions
- [ ] Jitsi Meet (réunions vidéo)
- [ ] Whereby/Whereby (webinar)
- [ ] Twilio (SMS/notifications)
- [ ] Firebase/SendGrid (emails)

### Médias
- [ ] AWS S3 / Cloudinary (CDN)
- [ ] FFmpeg (transcoding)
- [ ] HLS streaming

## Phase 4 : DevOps

- [ ] Docker (Dockerfile + docker-compose)
- [ ] GitHub Actions (CI/CD)
- [ ] Vercel (frontend auto-deploy)
- [ ] Digital Ocean / Railway (backend)
- [ ] Sentry (error tracking)
- [ ] DataDog (monitoring)

## Commandes rapides

```bash
# Frontend dev
yarn dev

# Backend dev
cd server && npm run dev

# Tester API
node test-api.js

# Build frontend
yarn build

# Build Docker backend
docker build -t knr-backend:latest server/
docker run -p 4000:4000 knr-backend:latest
```

## Variables d'environnement requises

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (server/.env)
```
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://...
JWT_SECRET=votre-secret
```

## Contacts & Support

- **Frontend** : Next.js + Tailwind + Framer Motion
- **Backend** : Express + Socket.io
- **Infrastructure** : TBD

