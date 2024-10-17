import { useState } from 'react';
import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import { OptionForSelect } from '@models';

type IListCheckOptionsV2Props = {
  options: Array<OptionForSelect>,
  onSelect?: (option: OptionForSelect) => void,
  value?: string
}

export default function ListCheckOptionsV2({ onSelect, value, options }: IListCheckOptionsV2Props) {
  const [curVal, setCurval] = useState(value)

  const onLocalSelect = (option: OptionForSelect) => {
    setCurval(option.value.toString())
    if (onSelect) {
      onSelect(option);
    }
  }

  const selectedOption = options.find((item) => item.value == curVal)

  return (
    <>
      <ListCheckOptions
        options={options}
        selectedOption={selectedOption}
        onSelect={(option: OptionForSelect) => {
          onLocalSelect(option)
        }}
      ></ListCheckOptions>
    </>
  );
}
