# Guide de configuration du direct (Agent OBS + YouTube)

Ce guide explique, étape par étape, comment relier votre PC de diffusion (OBS Studio) à la plateforme KNR COM pour que les boutons "Démarrer / Terminer le direct" de l'admin pilotent réellement OBS et YouTube.

Vous n'avez besoin de toucher au code à aucun moment : tout se passe dans OBS, dans Google Cloud Console, et dans la page **Paramètres** de l'admin.

## Vue d'ensemble

- **OBS Studio** (sur le PC de diffusion) capture l'image/le son et envoie le flux vers YouTube.
- **L'Agent OBS** (`agent-obs/`) est un petit programme qui tourne sur ce même PC. Il reçoit les ordres "démarrer/arrêter" depuis l'admin et les transmet à OBS. Deux façons de le faire tourner : une application avec icône dans la barre des tâches (recommandé), ou un script Node.js en ligne de commande (option avancée).
- **La page Paramètres** de l'admin centralise les identifiants (clé API YouTube, ID de chaîne, port/mot de passe OBS, token de l'agent). Le port et le mot de passe OBS sont envoyés automatiquement à l'agent dès l'enregistrement — l'agent n'a besoin que de deux valeurs stables en local (`BACKEND_URL` et `AGENT_OBS_TOKEN`), configurées une seule fois.

## Étape 1 — Créer la clé API YouTube (Google Cloud Console)

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com) et créer un projet (ou utiliser un projet existant).
2. Menu "API et services" → "Bibliothèque" → rechercher **"YouTube Data API v3"** → cliquer "Activer".
3. "API et services" → "Identifiants" → "Créer des identifiants" → "Clé API". Copier la clé générée.
4. Recommandé : cliquer "Restreindre la clé" → limiter aux API à "YouTube Data API v3" uniquement, pour éviter tout usage détourné si la clé fuite.

## Étape 2 — Récupérer l'ID de la chaîne YouTube

1. Se connecter à [YouTube Studio](https://studio.youtube.com) avec le compte de la chaîne KNR COM.
2. "Paramètres" → "Chaîne" → "Informations de base" → l'ID de chaîne commence par `UC...`. Le copier.

## Étape 3 — Configurer obs-websocket dans OBS

1. Ouvrir OBS Studio sur le PC de diffusion.
2. Menu "Outils" → "obs-websocket Settings" (OBS 28 et plus récent l'a déjà intégré nativement).
3. Cocher "Activer le serveur WebSocket" (Enable WebSocket server).
4. Cocher "Utiliser l'authentification" et définir un mot de passe — **noter ce mot de passe**, il sera renseigné dans Paramètres à l'étape 5 (pas dans un fichier local).
5. Noter le **port** affiché (par défaut `4455`). Ne pas le changer sauf besoin spécifique.

## Étape 4 — Configurer la destination du direct dans OBS

1. Toujours dans OBS : "Réglages" → "Stream".
2. Choisir "YouTube - RTMPS" (recommandé, le plus simple) ou "Personnalisé" si vous utilisez un service comme Restream pour diffuser sur plusieurs plateformes à la fois.
3. Coller la clé de stream ("Stream key") récupérée depuis YouTube Studio → "Créer" → "Diffuser en direct", ou depuis votre compte Restream.

> L'Agent OBS ne configure jamais cette destination : il se contente de dire à OBS "démarre" / "arrête" le flux déjà configuré ici.

## Étape 5 — Renseigner la page Paramètres de l'admin

Dans l'admin, aller sur **Paramètres** et remplir :

- **Clé API YouTube Data** → la clé de l'étape 1.
- **ID de la chaîne YouTube** → l'ID de l'étape 2.
- **Token partagé Agent OBS** → une chaîne secrète de votre choix (ex: une suite de lettres/chiffres aléatoires). Ce champ ne se remplit pas tout seul : tapez-en une et enregistrez — c'est ce même texte qui devra se retrouver dans le fichier `.env` de l'agent (voir étape 6, rempli automatiquement par le téléchargement).
- **Port obs-websocket** → le port noté à l'étape 3 (généralement `4455`).
- **Mot de passe obs-websocket** → le mot de passe défini à l'étape 3.

Cliquer **"Enregistrer les paramètres"**.

Le panneau "Diagnostic" doit alors afficher tous les éléments requis comme renseignés (coche verte), à l'exception de "Agent OBS connecté" et "OBS Studio connecté" qui ne passeront au vert qu'après l'étape 7.

## Étape 6 — Installer l'Agent OBS (à faire une seule fois)

**Méthode recommandée — application avec icône dans la barre des tâches :**

1. Toujours sur la page Paramètres, cliquer **"Télécharger l'Agent OBS (installeur Windows)"** et installer le fichier téléchargé sur le PC de diffusion.
2. Lancer l'application. Une icône apparaît dans la barre des tâches Windows.
3. Double-cliquer l'icône → "Ouvrir les paramètres" → renseigner l'**URL du site** et le **Token Agent OBS** (le même texte que celui saisi à l'étape 5), puis "Enregistrer et se connecter".
4. L'icône passe au vert dès que l'agent est connecté. Elle reste résidente et se relance automatiquement à l'ouverture de session Windows.

Cette étape ne se refait plus jamais ensuite : si vous changez le port ou le mot de passe OBS plus tard dans Paramètres, l'agent déjà lancé se reconfigure tout seul, sans rien réinstaller ni relancer.

**Option avancée — script en ligne de commande (Node.js + pm2), sans interface graphique :**

1. Sur la page Paramètres, dérouler "Option avancée : installation manuelle" et cliquer **"Télécharger la configuration (.env)"**. Le fichier contient l'URL du serveur et le token.
2. Placer ce fichier `.env` dans le dossier `agent-obs/` du projet, à côté de `index.js`.
3. Installer et lancer :
   ```bash
   cd agent-obs
   npm install
   npm run legacy:start
   ```
4. Pour le garder actif en permanence (redémarre seul en cas de plantage ou de redémarrage du PC) :
   ```bash
   npm install -g pm2
   npm run service:start
   pm2 save
   pm2-startup install
   ```

Voir `agent-obs/README.md` pour le détail des commandes (logs, arrêt, etc.) et l'alternative via le Planificateur de tâches Windows.

## Étape 7 — Vérifier que tout est branché

1. Retourner sur la page **Paramètres** (ou **Live**) de l'admin — les diagnostics "Agent OBS connecté" et "OBS Studio connecté" doivent passer au vert.
2. Depuis l'admin **Live**, démarrer un direct : OBS doit se mettre à streamer automatiquement (sans avoir à cliquer sur "Démarrer la diffusion" dans OBS).
3. Après quelques secondes, l'URL/ID YouTube du direct doit se remplir automatiquement dans l'admin (le serveur interroge YouTube pour détecter que la chaîne est en direct).
4. Terminer le direct depuis l'admin — OBS doit arrêter le stream automatiquement.

## Nombre de spectateurs en direct

Aucune configuration supplémentaire n'est nécessaire : dès qu'un direct est détecté "en direct" côté YouTube (étape 7.3), le serveur interroge automatiquement l'API YouTube Data (avec la même clé API que l'étape 1) toutes les 30 secondes pour récupérer le nombre de spectateurs simultanés, et le diffuse en temps réel sur `/admin/lives` et `/webtv`. Ce suivi démarre et s'arrête tout seul avec le direct.

## En cas de problème

- **"Agent OBS connecté" reste rouge** → l'agent n'a pas pu joindre le serveur. Vérifier que l'URL du site (ou `BACKEND_URL` dans le `.env` pour l'option avancée) pointe bien vers l'adresse accessible du serveur, et que le token correspond exactement à celui affiché dans Paramètres.
- **"OBS Studio connecté" reste rouge** → vérifier le port et le mot de passe obs-websocket enregistrés dans Paramètres (étape 3/5) et qu'OBS est bien ouvert sur le PC où tourne l'agent. Après une correction dans Paramètres, l'agent se reconnecte automatiquement — pas besoin de le relancer.
- **Le direct démarre dans OBS mais l'ID YouTube ne se remplit jamais** → vérifier la clé API YouTube et l'ID de chaîne (étapes 1-2), et que la chaîne est bien passée "en direct" côté YouTube (cela peut prendre jusqu'à 1-2 minutes).
- **Un ancien direct affiche une vidéo qui n'a rien à voir avec le vrai direct** → un live créé/modifié manuellement en base avec un `youtubeId` déjà renseigné n'est jamais redécouvert automatiquement (le serveur fait confiance à cette valeur tant qu'elle existe). Dans l'admin **Live**, supprimer la ligne concernée et recréer le live (en laissant les champs "URL YouTube"/"ID YouTube" vides) pour que la détection automatique (étapes 1-2) fasse son travail.
