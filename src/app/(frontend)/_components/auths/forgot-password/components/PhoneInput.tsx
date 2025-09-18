'use client';
import React from 'react';
import { Input } from '@components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Control } from 'react-hook-form';
import { ForgotPasswordFormData } from '../utils/validation';

interface PhoneInputProps {
  control: Control<ForgotPasswordFormData>;
  isPending: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ control, isPending }) => {
  return (
    <FormField
      control={control}
      name="phoneReset"
      render={({ field }) => (
        <FormItem>
          <FormLabel aria-required={true} className="text-base">
            Số điện thoại
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              maxLength={11}
              required
              className="mt-2"
              placeholder="Nhập số điện thoại"
              disabled={isPending}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneInput;
