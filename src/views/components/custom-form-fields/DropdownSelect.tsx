import { Button } from "@components/ui/button";
import { Popover, PopoverContent } from "@components/ui/popover";
import OptionPicker from "@mobile/ui/OptionPicker";
import { OptionForSelect } from "@models";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { LuChevronsUpDown } from "react-icons/lu";

export interface TDropdownSelectFieldProps {
  options: OptionForSelect[]
  placeholder?: string;
  openDropdown: boolean;
  setOpenDropdown: (value: boolean) => void;
  selectedOption?: OptionForSelect
  updateFieldValue: (value: A) => void;
  containerRef: A;
  onSelect: (option: OptionForSelect) => void
}

const DropdownSelectField = ({
  options, containerRef,
  placeholder, openDropdown,
  selectedOption, updateFieldValue,
  setOpenDropdown, onSelect }: TDropdownSelectFieldProps) => {

  const onSelectedOption = (option: OptionForSelect) => {
    updateFieldValue(option.value);
    onSelect(option)
  }

  return (
    <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openDropdown}
          className="w-full justify-between pr-2"
        >
          {selectedOption?.text || placeholder || 'Vui lòng chọn'}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
