import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  phone: Yup.string().required("Vui lòng nhập số điện thoại hoặc email"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});
export default loginSchema;
