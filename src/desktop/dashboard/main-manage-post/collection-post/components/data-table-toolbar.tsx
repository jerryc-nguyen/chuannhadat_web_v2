"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ButtonGroup } from "@components/ui/button-group";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Separator } from "@components/ui/separator";
import { Radio } from '@components/ui/Radio';
import { useState } from "react";
import Link from "next/link";
import { DataTableViewOptions } from "./data-table-view-options";
import QueryChip from "./query-chip";
import { listChipsQuery } from "../constant/list_chips_query";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {

  const [selectedOption, setSelectedOption] = useState(0);
  const options = [
    {
      label: "Tất cả",
      value: 0
    },
    {
      label: "Tin ẩn",
      value: 1
    },
    {
      label: "Tin hiện",
      value: 2
    },
  ]

  return (
    <div className="flex flex-col space-y-3">
      <div className="grid md:grid-cols-2 space-x-2">
        <div className="flex items-center space-x-2">
          <ButtonGroup className="flex-1">
            <Input
              placeholder="Tìm theo mã tin, tiêu đề hoặc ghi chú..."
              // value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              // onChange={(event) =>
              //   table.getColumn("title")?.setFilterValue(event.target.value)
              // }
              className="w-full"
            />
            <Button variant="default">
              <Search size={16} />
            </Button>
          </ButtonGroup>
        </div>

        <div className={`flex ${!selectedOption ? "justify-end" : "justify-between"}`}>
          {selectedOption ? (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="px-2 lg:px-3"
            >
              Xóa lọc
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button> ): <></>
          }

          <Link href="/dashboard/manage-post/new-post" target="_blank">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <span className="bg-primary text-primary-foreground hover:bg-primary/90 space-x-2">
                <Plus /><p>Đăng tin bán & cho thuê</p>
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative my-2 flex flex-wrap gap-2">
        {listChipsQuery.map((item) => (
          <QueryChip queryChipItem={item} key={item.id} />
        ))}
      </div>

      <Separator className="h-[1px]" />
      
      <div className="space-x-10 flex">
        <span>Lọc theo:{" "}</span>
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            checked={selectedOption === option.value}
            onChange={() => setSelectedOption(option.value)}
          />
        ))}
      </div>

      {
        table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <div className="space-x-10 flex">
            <div className="text-sm text-muted-foreground content-center">
              <span>
                {table.getFilteredSelectedRowModel().rows.length} /{" "}
                {table.getFilteredRowModel().rows.length} đã chọn.
              </span>
            </div>


            <DataTableViewOptions table={table}/>
            {/* <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <span className="bg-primary text-primary-foreground hover:bg-primary/90 space-x-2">
                <p>Thao tác hàng loạt</p>
              </span>
            </Button> */}
          </div> 
        ) : <></>
      }
    </div>
  );
}
