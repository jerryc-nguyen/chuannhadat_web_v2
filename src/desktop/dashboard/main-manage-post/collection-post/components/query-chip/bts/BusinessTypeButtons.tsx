import { Button } from '@components/ui/button';
import { ButtonGroup } from '@components/ui/button-group';
import { defaultListFilterOptions } from '@mobile/filter_bds/constants';

export default function BusinessTypeButtons({ value, onChange }: { value: string, onChange: (arg0: string) => void }) {
  return (
    <ButtonGroup className={`p-1 bg-muted rounded grid grid-cols-${defaultListFilterOptions.businessTypeOptions.length}`}>
      {defaultListFilterOptions.businessTypeOptions?.map((option) => (
        <Button
          variant={"ghost"}
          key={option.value}
          className={`grid-cols-1 hover:bg-background ${value != option.value ? "bg-transparent" : "bg-background"}`}
          onClick={() => { onChange(option.value + '') }}
        >
          {option.text}
        </Button>
      ))}
    </ButtonGroup>
  );
}
