import { z } from "zod"

export const UpVipProductInputSchema = z.object({
  product_id: z.number().min(1, "Đây là trường bắt buộc"),
  ads_type: z.string().min(1, "Đây là trường bắt buộc"),
  number_of_day: z.number().min(1, "Đây là trường bắt buộc"),
})

export type UpVipProductInput = z.infer<typeof UpVipProductInputSchema>

export type ShowOnFrontEndProductInput = {
  productId: number;
  showOnFrontEnd: boolean;
}

export type SetUpAutoRefreshProductInput = {
  productId: number;
  autoRefresh: boolean;
}
