'use client';
import { cn } from '@common/utils';
import { Avatar, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { HiMail } from 'react-icons/hi';
import { HiOutlineNewspaper, HiPhone } from 'react-icons/hi2';
import { MdManageAccounts } from 'react-icons/md';
import { RiMenuSearchLine, RiVipCrown2Fill } from 'react-icons/ri';
import { z } from 'zod';

const listFeedback = [
  {
    key: 1,
    feedback: 'Dịch vụ tốt',
    content:
      'Tôi rất ấn tượng với sự chuyên nghiệp và nhanh chóng khi sử dụng ChuanNhaDat.Com để đăng tin bất động sản của mình. Dịch vụ miễn phí thật sự tiết kiệm chi phí và thời gian cho tôi.',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Anh Minh',
    type: 'Nhà môi giới',
  },
  {
    key: 2,
    feedback: 'Thông tin nhanh chóng',
    content:
      'Website cung cấp thông tin rất chi tiết và chính xác, giúp tôi nhanh chóng tìm thấy căn hộ ưng ý. Tôi đã thành công trong việc tìm kiếm nơi ở lý tưởng nhờ vào ChuanNhaDat.Com.',
    avatar:
      'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Anh Trung',
    type: 'Người mua nhà',
  },
  {
    key: 3,
    feedback: 'Chi phí rẻ',
    content:
      'ChuanNhaDat.Com không chỉ là nơi đăng tin, mà còn là một nguồn thông tin đáng tin cậy về thị trường bất động sản. Tôi cảm thấy rất tin tưởng khi tham khảo thông tin từ trang web này..',
    avatar:
      'https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Chị Linh',
    type: 'Môi giới bất động sản',
  },
];
const listMainService = [
  {
    key: 1,
    title: 'Đăng tin bất động sản',
    icon: <HiOutlineNewspaper className="text-lg" />,
    contents: [
      'Đơn giản hóa quá trình đăng tin, giúp bạn dễ dàng tiếp cận hàng ngàn khách hàng tiềm năng.',
      'Hỗ trợ đăng tin cho mọi loại hình bất động sản, từ nhà ở, căn hộ chung cư, đến đất nền và bất động sản thương mại.',
    ],
  },
  {
    key: 2,
    title: 'Tìm kiếm, lọc bất động sản',
    icon: <RiMenuSearchLine className="text-lg" />,
    contents: [
      'Cung cấp công cụ tìm kiếm thông minh, giúp bạn nhanh chóng tìm được bất động sản phù hợp với nhu cầu.',
      'Tìm kiếm theo vị trí, giá cả, diện tích, hướng nhà, và nhiều tiêu chí khác.',
    ],
  },
  {
    key: 3,
    title: 'Dịch vụ tin VIP',
    icon: <RiVipCrown2Fill className="text-lg" />,
    contents: [
      'Nổi bật tin đăng của bạn với các gói tin VIP, giúp tăng khả năng tiếp cận và nhận được nhiều lượt xem hơn.',
      'Lựa chọn đa dạng các gói VIP phù hợp với nhu cầu và ngân sách.',
    ],
  },
  {
    key: 4,
    title: 'Quản lý tài khoản, tin đăng',
    icon: <MdManageAccounts className="text-lg" />,
    contents: [
      'Giao diện thân thiện, cho phép bạn quản lý bài đăng, kiểm tra lượt xem, và chỉnh sửa thông tin một cách dễ dàng.',
      'Quản lý tài khoản, nạp tiền, và sử dụng dịch vụ tiện lợi.',
    ],
  },
];
const AboutChuanNhaDat: React.FC = () => {
  const formSchema = z.object({
    fullname: z.string().min(1, {
      message: 'Nhập họ tên của bạn',
    }),
    email: z.string().email({
      message: 'Vui lòng nhập địa chỉ email hợp lệ',
    }),
    message: z.string(),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
      message: '',
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('🚀 ~ values:', values);
  };
  return (
    <section
      className={cn('flex flex-col gap-y-10 px-5 py-10 text-lg md:w-4/5 lg:mx-auto lg:px-0')}
    >
      <section id="about-us" className="relative flex h-[60vh] justify-center px-5 pt-20 lg:px-10">
        <Image
          alt="background"
          className="object-cover opacity-80 brightness-50"
          fill
          priority
          src={
            'https://images.unsplash.com/photo-1605601926548-48b449550a3f?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        />
        <h1 className="z-[1] mx-auto text-center text-4xl font-bold leading-[50px] text-white md:text-5xl md:leading-[70px]">
          &quot;Chuẩn nhà đất - Cầu nối tin cậy giúp bạn dễ dàng tìm kiếm, đăng tin và biến ước mơ
          an cư lạc nghiệp thành hiện thực!&quot;
        </h1>
      </section>
      <section id="target">
        <h2 className="mb-4 text-3xl font-bold">Mục tiêu</h2>
        <p className="md:w-2/3">
          Mục tiêu mà ChuanNhaDat.Com là hướng tới là kênh thông tin hiệu quả nhất, phổ biến nhất,
          thỏa mãn tốt nhất mọi nhu cầu về bất động sản và các lĩnh vực liên quan, là cầu nối thương
          mại giữa người mua - người bán, người thuê - cho thuê, giữa doanh nghiệp với doanh nghiệp.
        </p>
      </section>
      <section id="introduction" className="flex flex-col gap-x-5 bg-[#f3f5f7] lg:flex-row">
        <div className="relative h-[350px] w-full lg:h-auto lg:w-1/2">
          <Image
            priority
            fill
            className="w-full object-cover"
            alt="real estate"
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2196&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
        <div className="flex flex-col justify-center gap-y-2 p-6 lg:w-1/2 lg:p-10 lg:pt-10">
          <h2 className="mb-2 text-3xl font-bold">Giới thiệu</h2>
          <p>
            ChuanNhaDat.Com là website, app đăng tin bất động sản miễn phí loại tin thường. Nếu
            không mua gói dịch vụ hỗ trợ thêm bạn sẽ không tốn bất kì chi phí nào.
          </p>
          <p>
            Ngoài ra, đây còn là kênh thông tin về bất động sản và các lĩnh vực hàng đầu tại Việt
            Nam. Trang web liên tục cập nhật nhanh nhất, chính xác nhất mọi thông tin về thị trường
            bất động sản trong và ngoài nước.
          </p>
        </div>
      </section>
      <section id="our-story">
        <h2 className="mb-4 w-2/3 text-3xl font-bold">Câu chuyện của chúng tôi</h2>
        <div className="flex flex-col-reverse justify-between bg-[#f3f5f7] lg:flex-row">
          <div className="flex flex-col gap-y-4 p-6 text-base lg:w-2/3 lg:p-10">
            <p>
              Chuẩn Nhà Đất được thành lập vào năm 2021, bắt nguồn từ một khát vọng đơn giản nhưng
              đầy ý nghĩa: xây dựng một nền tảng bất động sản đáng tin cậy, nơi mọi người đều có thể
              dễ dàng tiếp cận thông tin minh bạch và chính xác, và đặc biệt là chi phí vô cùng rẻ
              so với các nền tảng khác
            </p>
            <p>
              Qua hành trình phát triển, Chuẩn Nhà Đất đã không ngừng đổi mới để mang lại trải
              nghiệm tốt nhất cho khách hàng. Từ việc xây dựng công cụ tìm kiếm mạnh mẽ, đến hỗ trợ
              đăng tin dễ dàng và nhanh chóng, chúng tôi luôn hướng đến việc làm cho bất động sản
              trở nên dễ tiếp cận hơn với tất cả mọi người.
            </p>
            <p className="block md:hidden xl:block">
              Ngày nay, với sự tin tưởng của hàng trăm ngàn người dùng, Chuẩn Nhà Đất tự hào là đối
              tác đáng tin cậy trên hành trình hiện thực hóa ước mơ an cư và đầu tư bền vững.
            </p>
          </div>
          <div className="relative h-[350px] w-full lg:h-auto lg:w-1/2">
            <Image
              priority
              fill
              className="w-full object-cover"
              alt="our-story"
              src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>
      </section>
      <section id="main-service">
        <h2 className="mb-4 text-3xl font-bold">Dịch vụ</h2>
        <p className="mb-4 md:w-2/3">
          Tại Chuẩn Nhà Đất, chúng tôi cung cấp các dịch vụ toàn diện để đáp ứng mọi nhu cầu trong
          lĩnh vực bất động sản. Các dịch vụ chính của chúng tôi bao gồm:
        </p>
        <div className="flex flex-col flex-wrap gap-4 md:flex-row">
          {listMainService.map((item) => (
            <Card
              className="group min-w-[250px] flex-1 cursor-pointer transition-all hover:bg-[#f3f5f7]"
              key={item.key}
            >
              <CardTitle className="flex flex-col gap-x-2 p-6 pb-3 text-base font-bold">
                <div className="mb-3 flex aspect-square h-10 w-10 items-center justify-center rounded-lg border group-hover:bg-primary_color/10 group-hover:text-primary_color">
                  {item.icon}
                </div>
                {item.title}
              </CardTitle>
              <CardContent>
                <ul className="flex list-disc flex-col gap-y-2">
                  {item.contents.map((el) => (
                    <li className="flex items-center gap-x-2 text-sm" key={el}>
                      {el}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section
        id="feedback"
        className="flex flex-col items-center gap-x-3 gap-y-4 overflow-hidden bg-[#f3f5f7] p-6 lg:flex-row"
      >
        <h2 className="text-3xl font-bold lg:w-1/4">Phản hồi, đóng góp từ người dùng</h2>
        <div className="flex w-full flex-1 gap-x-3 overflow-hidden overflow-x-auto pb-2 lg:w-auto">
          {listFeedback.map((item) => (
            <Card key={item.key} className="h-fit min-w-[400px]">
              <CardTitle className="p-6 pb-3 text-lg font-bold">{item.feedback}</CardTitle>
              <CardContent className="pt-0 text-sm">{item.content}</CardContent>
              <CardFooter className="flex gap-x-2">
                <Avatar>
                  <AvatarImage height={48} width={48} className="" src={item.avatar} />
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="text-sm">{item.type}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      <section
        id="connect"
        className="flex flex-col items-center justify-between gap-x-10 gap-y-5 lg:flex-row"
      >
        <div className="lg:w-1/3">
          <h2 className="mb-4 text-3xl font-bold">Nếu bạn cần hỗ trợ</h2>
          <p>Liên hệ qua Email ? Hãy điền form sau. Chúng tôi sẽ phản hồi nhanh nhất có thể.</p>
          <div className="hidden md:block">
            <h3 className="mt-2 text-xl font-semibold md:mt-4">
              Chúng tôi rất muốn nghe từ bạn{' '}
              <p className="text-base font-medium text-secondary">
                hoặc chỉ cần liên hệ trực tiếp với chúng tôi qua :
              </p>
            </h3>
            <ul className="mt-4 flex flex-col gap-y-2 text-sm">
              <li className="flex items-center gap-x-2 text-nowrap">
                <HiPhone className="text-xl" />
                <span> 0966662192 ( Linh )</span>
              </li>
              <li className="flex items-center gap-x-2 text-nowrap">
                <HiMail className="text-xl" />
                <span>Chuannhadat@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full rounded-md bg-[#f3f5f7] p-5 md:p-10 lg:w-2/3">
          <Form {...form}>
            <form className="mt-4 flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                name="fullname"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      aria-required
                      htmlFor="fullname"
                      className="mb-2 block text-sm font-medium"
                    >
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        {...field}
                        autoComplete="fullname"
                        id="phone"
                        placeholder="Họ và tên"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      aria-required
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        autoComplete="email"
                        type="email"
                        {...field}
                        id="email"
                        placeholder="Email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="message"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      aria-required
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium"
                    >
                      Tin nhắn
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        required
                        className="min-h-[150px]"
                        autoComplete="message"
                        {...field}
                        id="message"
                        placeholder="Tin nhắn"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="flex w-fit items-center gap-x-2 rounded-md px-6 py-2 font-semibold text-white focus-within:animate-pulse"
              >
                Gửi yêu cầu
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </section>
  );
};

export default AboutChuanNhaDat;
