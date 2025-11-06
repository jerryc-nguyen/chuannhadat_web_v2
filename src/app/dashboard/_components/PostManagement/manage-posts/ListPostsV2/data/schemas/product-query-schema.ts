import { z } from 'zod';

export const productQuerySchema = z.object({
  business_type: z.string().optional(),
  category_type: z.string().optional(),
  city_id: z.string().optional(),
  district_id: z.string().optional(),
  ward_id: z.string().optional(),
  street_id: z.string().optional(),
  project_id: z.string().optional(),
  gia: z.string().optional(),
  dien_tich: z.string().optional(),
  floors_count: z.string().optional(),
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

  huong: z.string().optional(),
  furnitures: z.string().optional(),

  mat_tien: z.string().optional(),
  phong_ngu: z.string().optional(),
  phong_tam: z.string().optional(),
  selected_ids: z.string().optional(),

  sort_by: z.string().optional(),
  sort_direction: z.string().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  filter_chips: z.string().optional(),

  visibility: z.enum(['hidden', 'visible', '']).optional(),
  search_by: z.enum(['code', 'title', 'note', 'all', '']).optional(),
  search_value: z.string().optional(),
  aggs_for: z.string().optional()
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
