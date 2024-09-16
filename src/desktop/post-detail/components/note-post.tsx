import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import React from 'react';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import styles from '../styles/note-post.module.scss';
import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { LuAlertTriangle, LuSendHorizonal } from 'react-icons/lu';
import { Textarea } from '@components/ui/textarea';
import { Input } from '@components/ui/input';
import { cn } from '@common/utils';

type NotePostProps = object;

const NotePost: React.FC<NotePostProps> = () => {
  const [isAcceptCapcha, setIsAcceptCapcha] = React.useState<boolean>(false);

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
    other: z.string(),
    reason_options: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      phoneNumber: '',
      email: '',
      other: '',
      reason_options: [],
    },
  });
  const { handleSubmit, control, reset } = form;
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAcceptCapcha(false);
    console.log('🐴 values', values);
  }
  const onChageCapcha = (value: A) => {
    console.log('🫒 value', value);
    setIsAcceptCapcha(true);
  };
  const listReasonOtion = [
    {
      id: 'incorrect address',
      label: 'Địa chỉ của bất động sản sai',
    },
    {
      id: 'incorrect image',
      label: 'Ảnh không chính xác',
    },
    {
      id: 'duplicate post',
      label: 'Trùng với tin rao khác',
    },
    {
      id: 'can not contact',
      label: 'Không liên lạc được',
    },
    {
      id: 'wrong post',
      label: 'Tin không thật',
    },
    {
      id: 'estate selled',
      label: 'Bất động sản đã bán',
    },
  ];
  const dialogReportPost = () => {
    return (
      <Dialog
        onOpenChange={() => {
          reset();
        }}
      >
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant={'outline'}>
                  <LuAlertTriangle className="mr-2" />
                  Phản ánh/Báo xấu
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <TooltipContent>
              <p className="text-center">
                Báo cáo tin rao có nội
                <br /> dung không đúng
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="pt-4 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Báo cáo tin rao có nội dung không đúng</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className={cn('grid gap-4', styles.dialog_content)}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-y-2">
                <FormField
                  control={form.control}
                  name="reason_options"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Vui lòng chọn lý do</FormLabel>
                      </div>
                      {listReasonOtion.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="reason_options"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id as never)}
                                    onCheckedChange={(checked: boolean) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== item.id),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <FormField
                  control={control}
                  name="other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="message" className="text-left">
                        Phản hồi khác
                      </FormLabel>
                      <FormControl>
                        <Textarea className={styles.message_input} id="other" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_CAPCHA_SITE_KEY as string}
                onChange={onChageCapcha}
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
                  Gửi yêu cầu
                  <LuSendHorizonal />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };
  return (
    <div className="important-note">
      <h2 className="pb-2 text-lg font-semibold">Lưu ý : </h2>
      <p className="mb-2 text-xs text-slate-500">
        Quý vị đang xem nội dung tin rao{' '}
        <strong>
          &quot;Bán căn nhà đường Võ Oanh, Hẻm xe hơi 5x15,1 Trệt 2 lầu/ 1 tum, nhà kiên cố ở liền,
          Giá 15ty &quot; - Mã tin 250809
        </strong>
        . Mọi thông tin, nội dung liên quan tới tin rao này là do người đăng tin đăng tải và chịu
        trách nhiệm. Chuannhadat.com luôn cố gắng để các thông tin được hữu ích nhất cho quý vị tuy
        nhiên Chuannhadat.com không đảm bảo và không chịu trách nhiệm về bất kỳ thông tin, nội dung
        nào liên quan tới tin rao này. Trường hợp phát hiện nội dung tin đăng không chính xác. Quý
        vị hãy cung cấp thông tin cho Chuannhadat.com bằng cách gửi{' '}
        <strong>&quot; Phản ánh / Báo xấu &quot; </strong>
        để Ban quản trị kiểm tra lại thông tin bài đăng nhanh và kịp thời nhất.
      </p>
      {dialogReportPost()}
    </div>
  );
};

export default NotePost;
