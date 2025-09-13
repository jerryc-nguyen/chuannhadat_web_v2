import * as z from 'zod';
const newPasswordRef = { current: '' };
const registerSchema = z.object({
  phone: z.string().min(1, { message: 'Vui lòng nhập số điện thoại hoặc email' }),
  password: z
    .string()
    .min(1, {
      message: 'Mật khẩu mới không được để trống',
    })
    .min(8, {
      message: 'Mật khẩu phải tối thiểu 8 kí tự ',
    })
    .refine((value) => {
      newPasswordRef.current = value;
      return true;
    }),
  confirmPassword: z
    .string()
    .min(1, {
      message: 'Mật khẩu xác nhận không được để trống',
    })
    .min(8, {
      message: 'Mật khẩu phải tối thiểu 8 kí tự ',
    })
    .refine((value) => value === newPasswordRef.current, 'Mật khẩu xác nhận không khớp mật khẩu'),
});
export default registerSchema;
