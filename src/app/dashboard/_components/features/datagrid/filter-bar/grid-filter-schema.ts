import { filter } from 'lodash-es';
import { z } from 'zod';

export const gridFilterSchema = z.object({
  search: z.object({
    search_by: z.enum(['code', 'title', 'note']),
    keyword: z.string(),
  }),
  filter: z.object({
    business_type: z.string(),
    category_type: z.string(),
    city_id: z.string(),
    district_id: z.string(),
    ward_id: z.string(),
    street_id: z.string(),
    project_id: z.string(),
    price: z.string(),
    area: z.string(),
    floors_count: z.string(),

    directions: z.string(),
    furnitures: z.string(),

    mat_tien: z.string(),
    bedrooms_count: z.string(),
    bathrooms_count: z.string(),
    selected_ids: z.string(),
  }),
  quickFilter: z.object({
    visibility: z.enum(['hidden', 'visible', '']),
  }),
  soft: z.object({
    sort_by: z.string(),
    sort_direction: z.string(),
  }),
  pagination: z.object({
    page: z.number(),
    per_page: z.number(),
  }),
});
