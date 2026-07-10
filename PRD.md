PRD — KNR Platform
===================

Version: 1.0
Date: 2026-07-08
Auteur: Équipe technique / Product

Résumé exécutif
----------------
KNR est une plateforme vitrine et média pour un studio audiovisuel. Le site présente le studio, son catalogue d'émissions (WebTV), les formations proposées, des articles de blog, un inventaire d'équipements et un parcours de contact / réservation. Le dépôt actuel est une application Next.js (app router) avec contenu statique stocké dans `src/lib/*.ts`.

Vision produit
--------------
Devenir la plateforme de référence locale pour la production audiovisuelle et la formation associée : centraliser la découverte des contenus, faciliter la réservation du studio et augmenter l'audience des productions via une expérience vidéo fluide et optimisée pour le SEO.

Objectifs métier & KPIs
------------------------
- Objectifs:
  - Convertir les visiteurs en demandes de réservation du studio.
  - Augmenter le nombre de vues et l'engagement sur les émissions.
  - Promouvoir les formations et générer des leads.
- KPIs:
  - Taux de conversion réservation (clic modal → envoi formulaire).
  - Taux de lecture vidéo (play, 25%/50%/100%).
  - Vues uniques sur pages émissions/formations.
  - Temps moyen sur page et taux de rebond.

Utilisateurs & parcours
------------------------
- Personas principaux:
  - Producteur/Créateur (réserve le studio).
  - Auditeur/Fan (consomme les émissions).
  - Étudiant/Apprenant (consulte formations).
  - Presse/Partenaire (informations & contact).
- Parcours clés:
  - Découverte → Détail émission → Lecture vidéo.
  - Accueil → Studio → Voir équipements → Ouvrir modal de réservation.
  - Formations → Détail → Contact / inscription.

Contenu et sujets
------------------
- Types de contenu présents:
  - Émissions / WebTV (`src/lib/emissions-data.ts`)
  - Formations (`src/lib/formations-data.ts`)
  - Articles / Blog (`src/lib/articles-data.ts`)
  - Équipements / Studio (`src/lib/equipements-data.ts`)
- Thématiques: production audiovisuelle, émissions locales, formation professionnelle, ressources techniques.
- Format actuel: content-as-code (fichiers TypeScript exportant tableaux d'objets).

Accès & gouvernance du contenu
-------------------------------
- État actuel: seuls les contributeurs au repo peuvent modifier le contenu via PR.
- Limitations: pas d'interface non-technique, chaque publication nécessite un commit + déploiement.
- Recommandations:
  - Court terme: documenter le format (`CONTENT.md`) et standardiser les objets.
  - Moyen terme: intégrer un CMS headless (Sanity/Strapi/Contentful) et déclenchement via webhooks.
  - Rôles recommandés (à terme): Admin, Éditeur, Modérateur, Visiteur.

Modèle de données canonique (extrait)
-------------------------------------
Champs communs:
- id, slug, title, description, image, tags[], publishedAt, author, metaTitle, metaDescription
Émission (ajouts): videoUrl, duration, season, episodeNumber, thumbnail
Formation (ajouts): price, duration, startDates[], level, prerequisites
Article: content (MD/HTML), excerpt
Équipement: name, specs, images[], availability

Fonctionnalités (MVP)
----------------------
- Pages:
  - Accueil, Emissions (listing + détail), Formations (listing + détail), Blog (listing + article), Studio, Location, Contact.
- Composants:
  - `Navbar`, `Footer`, `VideoPlayer`, `StudioBookingModal`.
- Interactions:
  - Modal de réservation (validate client, POST → `/api/booking` ou service externe).
  - Player vidéo avec events (play/pause/ended) pour tracking.
- SEO:
  - Meta tags dynamiques, OG tags, sitemaps.
- Accessibilité:
  - Focus trap pour modals, labels, contraste, ARIA.

Architecture technique
----------------------
- Front: Next.js (app router) + React + TypeScript.
- Données: fichiers statiques dans `src/lib` (MVP). Migration possible vers CMS headless pour contenu dynamique.
- Déploiement: Vercel recommandé (serverless functions pour endpoints).
- Tests: unitaires pour `VideoPlayer` et `StudioBookingModal`, tests d'intégration parcours réservation.

Non-fonctionnel & sécurité
---------------------------
- Performance: cibles Lighthouse >= 90 sur pages clés; images AVIF/WebP, lazy-load.
- Sécurité: sanitize inputs, protéger endpoints, appliquer rate-limiting si nécessaire.
- RGPD: consentement explicite pour collecte d'emails; politique de confidentialité.
- Disponibilité: hébergement serverless pour montée en charge.

Roadmap & priorisation
-----------------------
- Sprint 1 (2 semaines): stabiliser contenu statique, SEO, Navbar/Footer, VideoPlayer, StudioBookingModal (soumission mock), tests basiques.
- Sprint 2 (2 semaines): endpoint `/api/booking` serverless + stockage/email, analytics, accessibilité.
- Sprint 3 (2-4 semaines): intégration CMS, panneau admin ou import automation, workflows d'édition.

Critères d'acceptation
-----------------------
- Pages statiques rendent les objets de `src/lib/*.ts`.
- `VideoPlayer` lit les vidéos et émet events.
- `StudioBookingModal` valide, ouvre/ferme, et soumet vers endpoint (mock acceptable).
- Meta tags dynamiques présents sur pages dynamiques.
- Tests unitaires pour Modal & Player existants et passent.

Livrables
---------
- Code source avec pages et composants (déjà dans repo).
- `PRD.md` (ce document) et `CONTENT.md` (format de contenu et workflow).
- Endpoint serverless `/api/booking` (optionnel à implémenter ensuite).
- README ajoutant instructions de contribution et format de contenu.

Risques & atténuations
----------------------
- Contenu statique limite rapidité de publication: prévoir migration CMS.
- Hébergement vidéo: coût/bande passante — privilégier hébergement tiers (YouTube/Vimeo/CLOUD)
- Formulaires: besoin backend sécurisé dès qu’on collecte des données sensibles.

Prochaines étapes concrètes
---------------------------
- Standardiser et documenter les formats `src/lib/*.ts` (`CONTENT.md`).
- Ajouter meta tags dynamiques aux pages dynamiques.
- Implémenter un endpoint serverless minimal `/api/booking` et un envoi email/mock.
- Décider stratégie CMS (si nécessaire) et plan de migration.

Contact
-------
Pour poursuivre, je peux implémenter `CONTENT.md`, créer le endpoint mock `/api/booking` et ajouter des tests unitaires. Indiquez quelle action vous souhaitez prioriser et je la réalise.
