"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Separator } from "@components/ui/separator";
import { Checkbox } from "@components/ui/checkbox";
import { buildOptionsPrice, maskNumber } from "@common/priceHelpers";
import {
  businessTypeOptions,
  categoryTypeOptions,
  phapLyTypeOptions,
} from "@app/tao-tin-moi/constant";
import { IProductForm } from "@app/tao-tin-moi/type";
import LocationForm from "./location-form";
import { PriceAutoComplete } from "./fields/price-autocomplete";
import { BadgeInfo } from "lucide-react";

interface IProductInfoForm {
  form: UseFormReturn<IProductForm>;
}

const ProductInfoForm: React.FC<IProductInfoForm> = ({ form }) => {
  const price_in_vnd = form.watch("price_in_vnd");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeFieldNumber = (field: ControllerRenderProps<any>, value: string) => {
    // Regular expression to allow only numbers, with one optional comma or period, not at the beginning
    const regex = /^(?![.,])\d+([.,]\d{0,})?$/;

    if (regex.test(value) || value === "") {
      field.onChange(value); // Update the value only if it matches the regex
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2"><BadgeInfo /> Thông tin Bất động sản</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>
                    <span className="text-red-600">*</span> Nhu cầu của bạn là
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypeOptions.map((item, index) => (
                        <SelectItem key={index} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_type"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>
                    <span className="text-red-600">*</span> Loại bất động sản
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryTypeOptions.map((item, index) => (
                        <SelectItem key={index} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phap_ly"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Giấy tờ pháp lý</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue defaultValue={field.value} placeholder="Không xác định" />
                  </SelectTrigger>
                  <SelectContent>
                    {phapLyTypeOptions.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <Button
                      className="w-full px-2"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        form.setValue("phap_ly", "");
                      }}
                    >
                      Xóa lựa chọn
                    </Button>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>
                  <span className="text-red-600">*</span> Diện tích (m²)
                </FormLabel>
                <Input
                  {...field}
                  value={maskNumber(field.value).formattedValue}
                  onChange={(e) => {
                    const { rawValue } = maskNumber(e.target.value);
                    onChangeFieldNumber(field, rawValue);
                  }}
                  placeholder="Nhập diện tích (m²)"
                  maxLength={10}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price_in_vnd"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>
                  <span className="text-red-600">*</span> Giá bán/ thuê (VNĐ)
                </FormLabel>
                <PriceAutoComplete
                  selectedValue={price_in_vnd}
                  onSelectedValueChange={(value) => {
                    const { rawValue } = maskNumber(value);
                    onChangeFieldNumber(field, rawValue);
                  }}
                  items={buildOptionsPrice({
                    searchText: price_in_vnd,
                    businessType: form.getValues("business_type"),
                  })}
                  emptyMessage="Nhập giá bán"
                  InputRender={
                    <Input
                      {...field}
                      value={maskNumber(field.value).formattedValue}
                      placeholder="Nhập giá bán"
                      onChange={(e) => {
                        const { rawValue } = maskNumber(e.target.value);
                        onChangeFieldNumber(field, rawValue);
                      }}
                      maxLength={12}
                      disabled={form.getValues("price_in_vnd") === "Thỏa thuận"}
                    />
                  }
                />

                <div
                  className={`flex ${form.formState.errors.price_in_vnd ? "justify-between" : "justify-end"}`}
                >
                  <FormMessage />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      onCheckedChange={(value) => {
                        if (value) {
                          form.setValue("price_in_vnd", "Thỏa thuận");
                        } else {
                          form.setValue("price_in_vnd", "");
                        }
                      }}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Giá Thương lượng
                    </label>
                  </div>
                </div>
              </FormItem>
            )}
          />

          <LocationForm form={form} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInfoForm;
