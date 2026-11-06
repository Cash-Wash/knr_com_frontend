Scaffold backend pour KNR COM


* Email : `contact@knr-expertises.com`
* Mot de passe : `KnrExpert2026!Secure`

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
- POST /api/start-live (body: { emissionId })

Socket.io: émet `live:started` aux clients connectés.

(Fonctionnalité "Réunions" désactivée — routes /api/reunions* commentées dans src/index.js.)
