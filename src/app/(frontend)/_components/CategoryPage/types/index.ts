import { IResponseData } from "@common/types";

/**
 * Top author structure
 */
export interface ITopAuthor {
  avatar_url: string;
  full_name: string;
  id: number;
  phone: string;
  slug: string;
  top_position: number;
}

/**
 * Top authors response
 */
export type TopAuthorsResponse = IResponseData<ITopAuthor[]>;
