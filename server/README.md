Scaffold backend pour KNR COM

Instructions rapides:

1. Se placer dans le dossier `server`:

```
cd server
```

2. Installer les dépendances:

```
npm install
```

3. Lancer en local:

```
npm run dev
```

Endpoints exposés (scaffold):
- GET /api/users
- GET /api/emissions
- GET /api/reunions
- POST /api/reunions  (body: { titre, heure, participants: [userIds] })
- POST /api/start-live (body: { emissionId })

Socket.io: émet `live:started` et `reunion:created` aux clients connectés.