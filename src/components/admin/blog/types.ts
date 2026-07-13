export type ArticleStatus = "published" | "draft";

export interface Section {
  sousTitre: string;
  paragraphe: string;
}

export interface Article {
  id: string;
  slug: string;
  categorie: string;
  titre: string;
  extrait: string;
  auteur: string;
  date: string;
  dateISO: string;
  tempsLecture: string;
  img: string;
  featured: boolean;
  status: ArticleStatus;
  contenu: {
    intro: string;
    sections: Section[];
    citation?: string;
    conclusion?: string;
  };
}

export interface ArticleCategory {
  id: string;
  name: string;
  article_count: number;
}
