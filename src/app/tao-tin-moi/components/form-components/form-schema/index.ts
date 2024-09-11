import * as yup from 'yup';

// const ImgSchema = yup.object().shape({
//     fileName: yup.string().required(),
//     name: yup.string().required(),
//     fileSize: yup.number().required(),
//     size: yup.number().required(),
//     fileKey: yup.string().required(),
//     key: yup.string().required(),
//     fileUrl: yup.string().required(),
//     url: yup.string().required(),
// });

export const FormSchemaTransactionType = yup.object().shape({
    business_type: yup.string().required(),
    category_type: yup.string().required(),
    title: yup
      .string()
      .min(30, 'Tiêu đề tối thiểu 30 ký tự.')
      .max(99, 'Tiêu đề không được dài quá 99 ký tự.')
      .required(),
    description: yup
      .string()
      .min(100, 'Nội dung mô tả tối thiểu 100 kí tự.')
      .max(3000, 'Nội dung mô tả không được dài quá 3000 ký tự.')
      .required(),
    area: yup.string().required("Đây là trường bắt buộc."),
    phap_ly: yup.string(),
    price_in_vnd: yup.string().required("Đây là trường bắt buộc."),
    city_id: yup.string().required("Đây là trường bắt buộc."),
    district_id: yup.string().required("Đây là trường bắt buộc."),
    ward_id: yup.string(),
    street_id: yup.string(),
    project_id: yup.string(),
    full_address: yup.string(),
    bedrooms_count: yup.string(),
    bathrooms_count: yup.string(),
    facade: yup.number(),
    entrance: yup.number(),
    floors_count: yup.string(),
    entrance_direction: yup.string(),
    view_direction: yup.string(),
    furniture: yup.string(),
    image_ids: yup.string().required("Đăng tối thiểu 1 ảnh."),
});