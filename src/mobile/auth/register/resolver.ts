import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  phone: Yup.string().required("Vui lòng nhập số điện thoại hoặc email"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Mật khẩu không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
});
export default registerSchema;
