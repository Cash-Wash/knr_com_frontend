export type ArticleStatus = "published" | "draft";

export interface Article {
  id: string;
  slug: string;
  categorie: string;
  titre: string;
  extrait: string;
  auteur: string;
  tempsLecture: string;
  img: string;
  featured: boolean;
  status: ArticleStatus;
  content: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  article_count: number;
}
