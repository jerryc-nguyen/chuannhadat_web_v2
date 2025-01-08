import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  code: z.string(),
  uid: z.string(),
  title: z.string(),
  detail_path: z.string(),
  formatted_bussiness_category: z.string(),
  ads_type: z.string(),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
    }),
  ),
  images_count: z.number(),
  short_location_name: z.string(),
  formatted_price: z.string(),
  formatted_area: z.string(),
  formatted_price_per_m2: z.string(),
  bedrooms_count: z.number(),
  bathrooms_count: z.number(),
  entrance: z.number(),
  floors_count: z.number(),
  phap_ly: z.string(),
  visibility: z.string(),
  hide_on_frontend_reason: z.string(),
  formatted_facade_with_label: z.string(),
  price_per_m2: z.string(),
  formatted_kt: z.string(),
  formatted_created_at: z.string(),
  formatted_published_at: z.string(),
  expires_after_days: z.string(),
  visible: z.boolean(),
  auto_refresh_product: z.boolean(),
});

export type Product = z.infer<typeof productSchema>;
