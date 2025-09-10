import { z } from "zod"

export const upVipProductInputSchema = z.object({
    product_id: z.string().min(1, "Đây là trường bắt buộc"),
    ads_type: z.string().min(1, "Đây là trường bắt buộc"),
    number_of_day: z.string().min(1, "Đây là trường bắt buộc"),
})

export type UpVipProductInput = z.infer<typeof upVipProductInputSchema>

export type ShowOnFrontEndProductInput = {
    productId: string;
    showOnFrontEnd: boolean;
}

export type SetUpAutoRefreshProductInput = {
    productId: string;
    autoRefresh: boolean;
}