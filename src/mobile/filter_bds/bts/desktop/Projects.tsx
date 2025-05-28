import useFilterState from '../../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';
import useMainContentNavigator from '@components/main-content-navigator/hooks';
import ProjectPicker from '@components/ajax-pickers/ProjectPicker';

export default function Projects() {
  const { getLocalFieldValue, setLocalFieldValue } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Project);
  const { autocompleteProjectParams } = useMainContentNavigator();

  const onSelect = (option: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.Project, option);
  };

  return (
    <ProjectPicker
      value={value}
      onSelect={onSelect}
      autocompleteProjectParams={autocompleteProjectParams}
    />
  );
}
