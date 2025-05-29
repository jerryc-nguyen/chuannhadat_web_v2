import { Button } from "@components/ui/button";
import { Popover, PopoverContent } from "@components/ui/popover";
import OptionPicker from "@mobile/ui/OptionPicker";
import { OptionForSelect } from "@models";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { LuChevronsUpDown } from "react-icons/lu";
import { X } from "lucide-react";
import { cn } from "@common/utils";

export interface TDropdownSelectFieldProps {
  options: OptionForSelect[]
  placeholder?: string;
  openDropdown: boolean;
  setOpenDropdown: (value: boolean) => void;
  selectedOption?: OptionForSelect
  updateFieldValue: (value: A) => void;
  containerRef: A;
  onSelect: (option: OptionForSelect) => void;
  showClear?: boolean;
}

const DropdownSelectField = ({
  options, containerRef,
  placeholder, openDropdown,
  selectedOption, updateFieldValue,
  setOpenDropdown, onSelect,
  showClear = false
}: TDropdownSelectFieldProps) => {

  const onSelectedOption = (option: OptionForSelect) => {
    updateFieldValue(option.value);
    onSelect(option);
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateFieldValue(undefined);
    onSelect({ value: undefined, text: '' });
  };

  return (
    <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openDropdown}
          className="w-full justify-between pr-2"
        >
          <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
            {selectedOption?.text || placeholder || 'Vui lòng chọn'}
          </span>
          <div className="flex items-center gap-1">
            {selectedOption?.value && showClear && (
              <Button
                variant="outline"
                onClick={clearSelection}
                className="h-6 w-6 p-0 rounded-full border border-muted hover:border-red-500 hover:bg-red-50 transition-colors"
                type="button"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
            {!selectedOption?.value && <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent container={containerRef.current} className="p-0" align="end" side="right">
        <OptionPicker
          searchable
          options={options}
          value={selectedOption}
          onSelect={onSelectedOption}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DropdownSelectField;
