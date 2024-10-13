import { z } from "zod"

export const productSchema = z.object({
    id: z.string(),
    code: z.string(),
    uid: z.string(),
    title: z.string(),
    detail_path: z.string(),
    formatted_bussiness_category: z.string(),
    ads_type: z.string(),
    images: z.array(z.object({
        id: z.string(),
        url: z.string(),
    })),
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
})

export type Product = z.infer<typeof productSchema>


// {
//   "id": 261271,
//   "code": 261271,
//   "uid": "9dTuaK",
//   "title": "Tiêu đề ngắn gọn dễ hiểu, tối thiểu 30 ký tự và không được dài quá 99 ký tự.",
//   "detail_path": "/post/tieu-de-ngan-gon-de-hieu-toi-thieu-30-ky-tu-va-khong-duoc-dai-qua-99-ky-tu-9dTuaK",
//   "formatted_bussiness_category": "Bán căn hộ chung cư",
//   "ads_type": "normal",
//   "images": [
//     {
//       "id": 920362,
//       "url": "https://chuannhadat-assets.sgp1.digitaloceanspaces.com/cnd/15991/product_images/images_457684223_2802947709859880_1255636215703683059_n-jpg.jpg"
//     }
//   ],
//   "images_count": 1,
//   "short_location_name": "Thanh Oai, Hà Nội",
//   "formatted_price": "12 tỷ",
//   "formatted_area": "32 m²",
//   "formatted_price_per_m2": "375 triệu/m²",
//   "bedrooms_count": 3,
//   "bathrooms_count": 4,
//   "entrance": 12,
//   "floors_count": null,
//   "phap_ly": "sohong_sodo",
//   "visibility": "visible",
//   "hide_on_frontend_reason": null,
//   "formatted_facade_with_label": "Mặt tiền 22 m",
//   "price_per_m2": 375000000,
//   "formatted_kt": "22 x 1.5m",
//   "formatted_created_at": "11 ngày trước",
//   "formatted_published_at": "11 ngày trước"
// }