import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@components/ui/drawer';
import { Label } from '@components/ui/label';
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
import { useIsMobile } from '@hooks';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { find } from 'lodash-es';

interface CommonSelectProps {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
  actions?: React.ReactNode;
}

export function CommonSelect({ options, onChange, value, actions }: CommonSelectProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="flex justify-between">
            <span className='truncate'>{find(options, { value })?.label}</span>
            <CaretSortIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <div className="p-4 pb-0">
              <RadioGroup defaultValue={value} onValueChange={onChange} value={value}>
                {options.map((item, index) => (
                  <div
                    className="flex w-full items-center justify-between space-x-2 py-2"
                    key={index}
                  >
                    <Label className="flex-1" htmlFor={item.value}>
                      {item.label}
                    </Label>
                    <RadioGroupItem value={item.value} id={item.value} />
                  </div>
                ))}
              </RadioGroup>
            </div>
            <DrawerFooter className="mb-8">
              <DrawerClose>{actions}</DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">OK</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Select onValueChange={onChange} value={value} defaultValue={value}>
      <SelectTrigger>
        <SelectValue defaultValue={value} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item, index) => (
          <SelectItem key={index} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
