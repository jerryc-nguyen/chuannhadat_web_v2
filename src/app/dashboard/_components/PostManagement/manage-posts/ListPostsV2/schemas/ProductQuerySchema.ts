import { z } from 'zod';

export const ProductQuerySchema = z.object({
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

export type ProductQuery = z.infer<typeof ProductQuerySchema>;
