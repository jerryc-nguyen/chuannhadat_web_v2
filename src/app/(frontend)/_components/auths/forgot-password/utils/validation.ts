import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  phoneReset: z
    .string()
    .min(1, {
      message: 'Số điện thoại không được để trống.',
    })
    .min(7, {
      message: 'Vui lòng nhập số điện thoại hợp lệ',
    })
    .max(10, {
      message: 'Vui lòng nhập số điện thoại hợp lệ',
    }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
