import * as yup from 'yup';

export const PostFormSchema = yup.object().shape({
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
  phap_ly: yup.string().nullable(),
  price_in_vnd: yup.string().required("Đây là trường bắt buộc."),
  city_id: yup.string().required("Vui lòng chọn tỉnh/thành phố."),
  district_id: yup.string().required("Vui lòng chọn quận/huyện."),
  ward_id: yup.string().nullable(),
  street_id: yup.string().nullable(),
  child_project_id: yup.string().nullable(),
  project_id: yup.string().nullable(),
  full_address: yup.string().nullable(),
  bedrooms_count: yup.string().nullable(),
  bathrooms_count: yup.string().nullable(),
  facade: yup.string().nullable(),
  entrance: yup.string().nullable(),
  floors_count: yup.string().nullable(),
  direction: yup.string().nullable(),
  furniture: yup.string().nullable(),
  image_ids: yup.string().required("Đăng tối thiểu 1 ảnh.").nullable()
});
