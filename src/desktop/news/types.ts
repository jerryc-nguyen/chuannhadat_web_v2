export type INews = {
  title: string;
  articles: IArticle[];
}[];

export interface IArticle {
  id: number;
  title: string;
  path: string;
  excerpt: string;
  posted_at: string;
  thumb_url: string;
}
