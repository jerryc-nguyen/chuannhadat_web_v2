"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Separator } from "@components/ui/separator";
import { BadgeInfo } from "lucide-react";
import { IProductForm } from "../../type";

interface IProductDescriptionForm {
  form: UseFormReturn<IProductForm>;
}

const ProductDescriptionForm: React.FC<IProductDescriptionForm> = ({ form }) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2"><BadgeInfo /> Thông tin bài viết</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>
                  <span className="text-red-600">*</span> Tiêu đề
                </FormLabel>
                <Input
                  {...field}
                  className="relative"
                  placeholder="Nhập tiêu đề..."
                  endAdornment={
                    <span className="absolute right-1 top-0 text-2xs">
                      {form.getValues("title").length}/99
                    </span>
                  }
                />
                <FormDescription>
                  Tiêu đề ngắn gọn dễ hiểu, tối thiểu 30 ký tự và không được dài quá 99 ký tự.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>
                  <span className="text-red-600">*</span> Nội dung mô tả
                </FormLabel>
                <Textarea
                  {...field}
                  className="min-h-[150px]"
                  placeholder="Nhập mô tả..."
                  endAdornment={
                    <span className="absolute right-1 top-1 text-2xs">
                      {form.getValues("description").length}/3000
                    </span>
                  }
                />
                <FormDescription>
                  Nội dung mô tả tối thiểu 100 kí tự và không được dài quá 3000 ký tự.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDescriptionForm;
