# Agent OBS — KNR COM

Petit service à installer et lancer sur le **PC de diffusion** (celui qui fait tourner OBS Studio). Il fait le pont entre la plateforme web KNR et OBS : quand un admin clique "Démarrer"/"Arrêter" sur `/admin/lives`, ce processus reçoit la commande et pilote OBS en local.

## Prérequis

- OBS Studio 28+ (obs-websocket est intégré nativement).
- Node.js 18 ou plus récent installé sur ce PC.
- OBS déjà configuré pour streamer vers Restream (serveur RTMP personnalisé + clé de stream renseignés dans OBS > Paramètres > Stream) — cet agent ne fait que démarrer/arrêter la diffusion, il ne configure pas la destination.

## Configuration (à faire une seule fois)

Le port et le mot de passe obs-websocket **ne se configurent plus dans ce dossier** : l'agent les reçoit automatiquement du serveur (Paramètres → Diffusion côté admin) dès qu'il se connecte, et à nouveau à chaque fois qu'ils sont modifiés dans l'admin — pas besoin de relancer l'agent ni de retoucher un fichier.

Il ne reste donc que deux valeurs, stables, à renseigner une seule fois sur ce PC :

1. Dans l'admin du site, ouvrez **Paramètres → Diffusion (OBS / YouTube)**, renseignez le port et le mot de passe obs-websocket (voir OBS : Outils → obs-websocket Settings) ainsi que le token Agent OBS, puis **enregistrez**.
2. Cliquez **"Télécharger la configuration Agent OBS"**. Le fichier téléchargé contient déjà `BACKEND_URL` (l'adresse du site en ligne) et `AGENT_OBS_TOKEN`.
3. Renommez ce fichier `.env` et déposez-le dans ce dossier `agent-obs/`, à côté de `index.js`.

(Alternative manuelle : copier `.env.example` vers `.env` et renseigner `BACKEND_URL`/`AGENT_OBS_TOKEN` à la main.)

## Installation et lancement

```bash
cd agent-obs
npm install
npm start
```

Les logs indiquent la connexion au backend, puis la réception de la configuration OBS et la connexion à OBS. Tant que ce processus tourne, l'admin peut démarrer/arrêter le live depuis le site — s'il est fermé, l'admin voit "Agent OBS hors ligne" et le bouton Démarrer est désactivé.

## Garder l'agent actif en permanence (recommandé)

Pour ne pas avoir à relancer l'agent manuellement à chaque direct, faites-le tourner via [pm2](https://pm2.keymetrics.io/) — il redémarre l'agent automatiquement en cas de plantage et au démarrage du PC.

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

## Fonctionnement

- Se connecte au backend via Socket.IO (`/agent`, authentifié par `AGENT_OBS_TOKEN`) avec reconnexion automatique.
- Reçoit du serveur la configuration OBS (`agent:config` : port + mot de passe) à la connexion et à chaque modification dans Paramètres, et se (re)connecte à OBS en conséquence.
- Se connecte à OBS en local et surveille son état de diffusion (`StreamStateChanged`).
- Reçoit `cmd:start_stream` / `cmd:stop_stream`, appelle `StartStream`/`StopStream` sur OBS, et n'accuse réception qu'une fois qu'OBS a confirmé le changement d'état réel (pas juste l'acceptation de la requête).
- Si OBS s'arrête localement (crash, arrêt manuel dans OBS) sans passer par le bouton "Arrêter" du site, l'agent le signale au backend pour que le live soit automatiquement clôturé côté plateforme.
