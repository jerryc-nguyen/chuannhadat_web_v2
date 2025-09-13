import { FilterFieldName, OptionForSelect } from '@common/types';

import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
import { useState } from 'react';

type TProps = {
  options?: OptionForSelect[];
  value?: OptionForSelect;
  onChange: (option: OptionForSelect) => void;
}

export default function OptionsTabList(props: TProps) {
  const { options, value, onChange } = props;
  const [curValue, setCurValue] = useState<OptionForSelect | undefined>(value);

  return (
    <Tabs defaultValue={curValue?.value as string}>
      <TabsList className="flex w-full h-11">
        {(options || []).map((option: OptionForSelect) => {
          return (
            <TabsTrigger
              value={option.value + ''}
              key={option.text}
              className="flex-1 rounded-md py-2"
              onClick={() => {
                setCurValue(option);
                onChange(option)
              }}
            >
              {option.text}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
