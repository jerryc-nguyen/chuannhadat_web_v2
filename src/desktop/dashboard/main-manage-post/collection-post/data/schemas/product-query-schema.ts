import { z } from 'zod';

export const productQuerySchema = z.object({
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
  // directions: z.enum([
  //     'view_west',
  //     'view_west_south',
  //     'view_west_north',
  //     'view_east',
  //     'view_east_south',
  //     'view_east_north',
  //     'view_south',
  //     'view_north',''
  // ]), // Restricted values for directions

  // furnitures: z.enum([
  //     'full_furniture',
  //     'basic_furniture',
  //     'unfinished_furniture',''
  // ]),

  directions: z.string(),
  furnitures: z.string(),

  mat_tien: z.string(),
  bedrooms_count: z.string(),
  bathrooms_count: z.string(),
  selected_ids: z.string(),

  sort_by: z.string(),
  sort_direction: z.string(),
  page: z.number(),
  per_page: z.number(),

  keyword: z.string(),
  visibility: z.enum(['hidden', 'visible', '']),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
