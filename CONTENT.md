CONTENT.md — Format et workflow de contenu
==========================================

But
---
Documenter le format des fichiers `src/lib/*.ts` pour que les contributeurs sachent comment ajouter/éditer du contenu sans casser le site.

Emplacement
-----------
Les fichiers de contenu actuels se trouvent dans `src/lib/` :
- `articles-data.ts`
- `emissions-data.ts`
- `formations-data.ts`
- `equipements-data.ts`

Convention générale d'objet
---------------------------
Tous les contenus doivent respecter un schéma minimal commun :

Exemple (objet générique):

{
  id: "uuid-or-unique-string",
  slug: "mon-article-ou-emission",
  title: "Titre",
  description: "Courte description (100-160 chars)",
  image: "/images/...jpg", // chemin relatif public/ ou URL
  tags: ["tag1","tag2"],
  publishedAt: "2026-07-01T00:00:00.000Z",
  author: "Nom",
  metaTitle: "Titre SEO",
  metaDescription: "Description SEO",
  content: "..." // pour articles / détails (chaine ou markdown)
}

Schémas spécifiques
--------------------
Émission (fields additionnels):
- videoUrl: string (URL ou chemin public)
- duration: string | number
- season?: number
- episodeNumber?: number
- thumbnail?: string

Formation:
- price?: string | number
- duration?: string
- startDates?: string[] (ISO)
- level?: "débutant|intermédiaire|avancé"
- prerequisites?: string[]

Équipement:
- name: string
- specs: { key: value }
- images?: string[]
- availability?: string

Bonnes pratiques
-----------------
- `slug` en kebab-case, unique.
- `metaDescription` 120-160 caractères.
- Utiliser images optimisées (WebP/AVIF) et placer dans `public/images/`.
- Si vidéo hébergée externement, fournir `videoUrl` vers lecteur compatible (HLS/MP4/YouTube).

Workflow de publication (MVP)
-----------------------------
1. Cloner le repo.
2. Créer une branche `feature/content/<slug>`.
3. Éditer le fichier `src/lib/<type>-data.ts` en ajoutant l'objet.
4. Tester localement (`yarn dev`).
5. Ouvrir PR, reviewer valide, merger.
6. Déploiement automatique (Vercel) rebuild.

Workflow recommandé (avec CMS)
-----------------------------
1. Éditeur crée brouillon dans le CMS.
2. Workflow editorial: Relecture → Publication.
3. CMS envoie webhook vers Vercel pour ISR/SSG.

Validation et tests rapides
---------------------------
- Vérifier que `slug` n'existe pas déjà.
- Lancer le site local et vérifier page correspondante.
- S'assurer que les meta tags sont renseignés.

Exemple d'ajout (pour `emissions-data.ts`)
------------------------------------------
export const EMISSIONS = [
  {
    id: "episode-001",
    slug: "pilot",
    title: "Pilot",
    description: "Épisode pilote",
    image: "/images/emissions/pilot.jpg",
    videoUrl: "https://.../video.mp4",
    publishedAt: "2026-07-01T00:00:00.000Z",
    author: "Equipe KNR",
    metaTitle: "Pilot — KNR",
    metaDescription: "Episode pilote de la WebTV KNR...",
  }
];

Notes pour les développeurs
---------------------------
- Si vous migrez vers un CMS, mappez les champs listés ci-dessus pour conserver compatibilité avec le front.
- Documenter toute extension de schéma dans ce fichier.

Contact
-------
Pour clarifications, voir `PRD.md` ou contacter l'équipe technique.
