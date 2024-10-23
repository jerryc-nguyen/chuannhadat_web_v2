"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Separator } from "@components/ui/separator";
import { BadgeInfo } from "lucide-react";
import {
  businessTypeOptions,
  categoryTypeOptions,
} from "../../constant";
import { IProductForm } from "../../type";

interface IProductTypeForm {
  form: UseFormReturn<IProductForm>;
}

const ProductTypeForm: React.FC<IProductTypeForm> = ({ form }) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2"><BadgeInfo /> Loại giao dịch</CardTitle>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTypeForm;
