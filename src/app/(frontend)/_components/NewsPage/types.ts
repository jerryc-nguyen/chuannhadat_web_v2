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

export interface IArticleDetail {
  id: number;
  title: string;
  path: string;
  excerpt: string;
  content: string;
  posted_at: string;
  origin_name: string;
  origin_link: string;
  location: string;
}


export interface ResponseNewsByCategory {
  status: boolean;
  code: number;
  page_id: number;
  title: string;
  articles: Article[];
  related_locations: Relatedlocation[];
}

interface Relatedlocation {
  id: number;
  name: string;
  path: string;
}

interface Article {
  id: number;
  title: string;
  path: string;
  excerpt: string;
  posted_at: string;
  thumb_url: string;
}