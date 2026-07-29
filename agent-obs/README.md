# Agent OBS — KNR COM

Petit programme à installer sur le **PC de diffusion** (celui qui fait tourner OBS Studio). Il fait le pont entre la plateforme web KNR et OBS : quand un admin clique "Démarrer"/"Arrêter" sur `/admin/lives`, ce processus reçoit la commande et pilote OBS en local.

Deux façons de le faire tourner : une application avec icône dans la barre des tâches (recommandé, aucune connaissance technique requise), ou un script Node.js en ligne de commande (option avancée).

## Prérequis

- OBS Studio 28+ (obs-websocket est intégré nativement).
- OBS déjà configuré pour streamer vers YouTube ou Restream (serveur RTMP + clé de stream renseignés dans OBS > Réglages > Stream) — cet agent ne fait que démarrer/arrêter la diffusion, il ne configure jamais cette destination.

## Installation recommandée : application avec icône dans la barre des tâches

1. Télécharger et installer `Agent OBS KNR` depuis la page admin **Paramètres → Diffusion (OBS / YouTube)** (bouton "Télécharger l'Agent OBS (installeur Windows)"), ou lancer soi-même `npm run dist` dans ce dossier pour produire l'installeur (`dist/Agent OBS KNR Setup *.exe`).
2. Lancer l'application installée. Une icône apparaît dans la barre des tâches Windows.
3. À la première ouverture (ou via double-clic sur l'icône → "Ouvrir les paramètres"), renseigner :
   - **URL du site** — l'adresse du backend (ex. `https://api.knr-expertises.com`).
   - **Token Agent OBS** — copié depuis Paramètres → Diffusion côté admin.
4. Cliquer "Enregistrer et se connecter". L'icône passe au vert dès que l'agent est connecté au serveur.

Le port et le mot de passe obs-websocket **ne se saisissent jamais dans l'agent** : ils sont reçus automatiquement depuis les Paramètres de l'admin, à la connexion et à chaque modification — aucune reconfiguration nécessaire si vous les changez plus tard.

Par défaut, l'application se relance automatiquement à l'ouverture de session Windows (décochable dans ses paramètres).

## Option avancée : script en ligne de commande (Node.js + pm2)

Pour un usage sans interface graphique (serveur dédié, environnement automatisé) :

1. Dans l'admin, Paramètres → Diffusion : renseigner le token Agent OBS, enregistrer, puis cliquer "Télécharger la configuration (.env)". Le fichier contient déjà `BACKEND_URL` et `AGENT_OBS_TOKEN`.
2. Renommer ce fichier `.env` et le déposer dans ce dossier `agent-obs/`, à côté de `index.js`. (Alternative manuelle : copier `.env.example` vers `.env` et renseigner les deux valeurs à la main.)
3. Installer et lancer :
   ```bash
   cd agent-obs
   npm install
   npm run legacy:start
   ```

Les logs indiquent la connexion au backend, puis la réception de la configuration OBS et la connexion à OBS. Tant que ce processus tourne, l'admin peut démarrer/arrêter le live depuis le site — s'il est fermé, l'admin voit "Agent OBS hors ligne" et le bouton Démarrer est désactivé.

### Garder le script actif en permanence (pm2)

```bash
npm install -g pm2
npm run service:start   # démarre l'agent via pm2 (voir ecosystem.config.js)
pm2 save                # mémorise l'état actuel des process pm2
pm2-startup install     # (une seule fois) enregistre pm2 pour démarrer avec Windows
```

Commandes utiles ensuite :

```bash
npm run service:logs    # voir les logs en direct
npm run service:stop    # arrêter l'agent
```

Alternative sans pm2 : le Planificateur de tâches Windows, avec une tâche déclenchée "à l'ouverture de session", action `node.exe` avec pour argument le chemin complet vers `agent-obs/index.js`, dossier de démarrage = `agent-obs/`.

## Construire l'installeur soi-même

```bash
cd agent-obs
npm install
npm run dist
```

Produit `dist/Agent OBS KNR Setup <version>.exe` (NSIS, installation Windows classique avec raccourci menu Démarrer/bureau).

## Fonctionnement (identique dans les deux modes)

- Se connecte au backend via Socket.IO (`/agent`, authentifié par un token partagé) avec reconnexion automatique.
- Reçoit du serveur la configuration OBS (`agent:config` : port + mot de passe) à la connexion et à chaque modification dans Paramètres, et se (re)connecte à OBS en conséquence.
- Se connecte à OBS en local et surveille son état de diffusion (`StreamStateChanged`).
- Reçoit `cmd:start_stream` / `cmd:stop_stream`, appelle `StartStream`/`StopStream` sur OBS, et n'accuse réception qu'une fois qu'OBS a confirmé le changement d'état réel (pas juste l'acceptation de la requête).
- Si OBS s'arrête localement (crash, arrêt manuel dans OBS) sans passer par le bouton "Arrêter" du site, l'agent le signale au backend pour que le live soit automatiquement clôturé côté plateforme.
