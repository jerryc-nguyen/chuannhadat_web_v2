import { FilterComponentProps } from '../types/pure-ui-types';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';

interface BusinessTypeButtonsProps extends FilterComponentProps {
  /** Custom className for styling */
  className?: string;
}

/**
 * Pure UI component for business type selection
 * Receives all state via props and communicates changes via callbacks
 */
export default function BusinessTypeButtons({
  value,
  options,
  onValueChange,
  isLoading = false,
  disabled = false,
  className,
}: BusinessTypeButtonsProps) {
  return (
    <Tabs 
      defaultValue={value?.value as string} 
      className={className}
    >
      <TabsList className="flex w-full h-11">
        {options?.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value + ''}
            className="flex-1 rounded-md py-2"
            disabled={disabled || isLoading}
            onClick={() => {
              onValueChange(option);
            }}
          >
            {option.text}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}