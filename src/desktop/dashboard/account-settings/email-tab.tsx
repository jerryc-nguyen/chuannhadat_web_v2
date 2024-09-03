import { Button } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const EmailTab: React.FC = () => {
  const formSchema = Yup.object({
    newEmail: Yup.string().email({
      message: 'Vui lòng nhập địa chỉ email hợp lệ',
    }),
  });
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      newEmail: '',
    },
  });
  const { handleSubmit, control } = form;

  function onSubmit(values: A) {
    console.log(values);
  }
  return (
    <>
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Thay đổi email</h3>
      </div>
      <p className="mt-4">
        Email hiện tại của bạn là <b>Darwinle@gmail.com</b>
      </p>
      <Form {...form}>
        <form className="mt-2 flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Địa chỉ email mới</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="mt-2"
                    placeholder="Nhập địa chỉ email mới"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="absolute bottom-0 w-fit -translate-y-4" type="submit">
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EmailTab;
