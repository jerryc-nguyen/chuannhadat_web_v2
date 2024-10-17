import List from "@components/konsta/List";
import { directionsOptions } from "@mobile/filter_bds/constants";
import { useState } from "react";
import ListItemBtsPicker from "../bts-pickers/ListItemBtsPicker";

export default function TestComponents() {
  const [direction, setDirection] = useState(undefined);

  const options = {
    onSelect: (option: A) => {
      console.log('onSelect', option)
      setDirection(option.value)
    },
    options: directionsOptions,
    btsTitle: 'Hướng',
    value: direction
  }

  return <>
    {JSON.stringify(direction)}
    <List strongIos outlineIos>
      <ListItemBtsPicker {...options} />
    </List>
  </>
}
