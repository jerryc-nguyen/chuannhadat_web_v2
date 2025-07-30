import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@components/ui/input';
import React from 'react';
import { SendHorizonal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './index.module.scss';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { services } from '@api/services';
import { toast } from 'sonner';
import { IRequestCallbackPayload } from '@models/modelPayload';
import { Loader2 } from 'lucide-react';

type DialogContactAgainProps = {
  postId: string | number;
  postUid: string;
  title: string;
  elementTrigger: () => React.ReactNode;
};

const DialogContactAgain: React.FC<DialogContactAgainProps> = ({
  elementTrigger,
  postId,
  title,
  postUid,
}) => {
  const [isAcceptCapcha, setIsAcceptCapcha] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const { mutate: requestMutate, isPending } = useMutation({
    mutationKey: ['request-callbacks'],
    mutationFn: services.manage_contacts.requestCallback,
    onSuccess: (data) => {
      if (data.status) {
        toast.success('Gửi yêu cầu thành công');
        setIsAcceptCapcha(false);
        setOpenDialog(false);
        reset();
      } else {
        toast.error('Gửi yêu cầu thất bại');
      }
    },
    onError: () => {
      toast.error('Gửi yêu cầu thất bại');
    },
  });
  const formSchema = z.object({
    fullname: z.string().min(2, {
      message: 'Vui lòng nhập đầy đủ họ tên',
    }),
    phoneNumber: z
      .string()
      .min(1, {
        message: 'Số điện thoại không được để trống',
      })
      .min(7, {
        message: 'Vui lòng nhập số điện thoại hợp lệ',
      })
      .max(10, {
        message: 'Vui lòng nhập số điện thoại hợp lệ',
      }),
    email: z
      .string()
      .email({
        message: 'Vui lòng nhập email đúng định dạng',
      })
      .optional() // Cho phép bỏ qua nếu không nhập gì
      .or(z.literal('')),
    message: z.string(),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      phoneNumber: '',
      email: '',
      message: `Vui lòng cho tôi biết thêm về BĐS có mã tin: ${postId}, tiêu đề: "${title}".\nXin cảm ơn.`,
      reason_options: [''],
    },
  });
  const { handleSubmit, control, reset } = form;
  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: IRequestCallbackPayload = {
      full_name: values.fullname,
      phone: values.phoneNumber,
      content: values.message,
      email: values.email,
      product_uid: postUid,
    };
    requestMutate(payload);
  }
  const onChageCapcha = (value: A) => {
    setIsAcceptCapcha(!!value);
  };
  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      <DialogTrigger asChild>{elementTrigger()}</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto pt-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông tin liên hệ lại</DialogTitle>
          <DialogDescription>
            Yêu cầu người đăng tin liên hệ theo thông tin dưới đây:
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-2">
              <FormField
                control={control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel aria-required htmlFor="fullname" className="text-left">
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input id="fullname" placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <FormField
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel aria-required htmlFor="phoneNumber" className="text-left">
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        id="phoneNumber"
                        placeholder="Nhập số điện thoại"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="text-left">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" id="email" placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <FormField
                control={control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="message" className="text-left">
                      Lời nhắn
                    </FormLabel>
                    <FormControl>
                      <Textarea className={styles.message_input} id="message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_CAPCHA_SITE_KEY as string}
              onChange={onChageCapcha}
              onExpired={() => {
                setIsAcceptCapcha(false);
              }}
              hl="vi"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Đóng
                </Button>
              </DialogClose>
              <Button
                disabled={!isAcceptCapcha}
                className="flex items-center gap-x-2"
                type="submit"
              >
                {isPending ? 'Đang xác thực' : 'Gửi yêu cầu'}
                {isPending ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogContactAgain;
