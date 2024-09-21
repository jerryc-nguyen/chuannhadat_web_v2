"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Separator } from "@components/ui/separator";
import { maskNumber } from "@common/priceHelpers";
import { furnitureTypeOptions, viewDirectionTypeOptions } from "@app/tao-tin-moi/constant";
import { IProductForm } from "@app/tao-tin-moi/type";
import React from "react";
import { Button } from "@components/ui/button";
import { RoundedOptionsNumberInput } from "./fields/rounded-options-number-input";
import { ReceiptText } from "lucide-react";

interface IProductDetailInfoForm {
  form: UseFormReturn<IProductForm>;
}

const ProductDetailInfoForm: React.FC<IProductDetailInfoForm> = ({ form }) => {
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
        <CardTitle className="text-md flex gap-2"><ReceiptText /> Chi tiết Bất động sản</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="bedrooms_count"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Số phòng ngủ</FormLabel>
                  <RoundedOptionsNumberInput
                    {...field}
                    className="relative"
                    placeholder="Nhập số"
                    onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                    maxLength={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms_count"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Số phòng tắm</FormLabel>
                  <RoundedOptionsNumberInput
                    {...field}
                    className="relative"
                    placeholder="Nhập số"
                    onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                    maxLength={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facade"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Mặt tiền</FormLabel>
                  <Input
                    {...field}
                    value={maskNumber(field.value).formattedValue}
                    onChange={(e) => {
                      const { rawValue } = maskNumber(e.target.value);
                      onChangeFieldNumber(field, rawValue);
                    }}
                    placeholder="Nhập số"
                    endAdornment={
                      <span>
                        <b>m</b>
                      </span>
                    }
                    maxLength={8}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entrance"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Đường rộng</FormLabel>
                  <Input
                    {...field}
                    value={maskNumber(field.value).formattedValue}
                    onChange={(e) => {
                      const { rawValue } = maskNumber(e.target.value);
                      onChangeFieldNumber(field, rawValue);
                    }}
                    placeholder="Nhập số"
                    endAdornment={
                      <span>
                        <b>m</b>
                      </span>
                    }
                    maxLength={8}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Thêm thông tin</AccordionTrigger>
              <AccordionContent>
                <Card className="bg-primary/10">
                  <CardContent className="grid gap-4 pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="floors_count"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Số tầng</FormLabel>
                            <RoundedOptionsNumberInput
                              {...field}
                              className="relative"
                              placeholder="Nhập số"
                              onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                              maxLength={3}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="entrance_direction"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Hướng nhà/ đất</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Không xác định"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {viewDirectionTypeOptions.map((item, index) => (
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
                                    form.setValue("entrance_direction", "");
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
                        name="view_direction"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Hướng ban công</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Không xác định"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {viewDirectionTypeOptions.map((item, index) => (
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
                                    form.setValue("view_direction", "");
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
                        name="furniture"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Nội thất</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Không xác định"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {furnitureTypeOptions.map((item, index) => (
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
                                    form.setValue("furniture", "");
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
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetailInfoForm;
