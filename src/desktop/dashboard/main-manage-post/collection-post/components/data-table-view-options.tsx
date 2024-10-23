"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          Thao tác hàng loạt
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuCheckboxItem
            className="capitalize"
            // onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            1
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            className="capitalize"
            // onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            2
          </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            className="capitalize"
            // onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            3
          </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
