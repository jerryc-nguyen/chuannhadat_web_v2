import useFilterState from '../../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@common/models';
import useMainContentNavigator from '@frontend/features/navigation/main-content-navigator/hooks';
import ProjectPicker from '@components/ajax-pickers/ProjectPicker';

export default function Projects() {
  const { getLocalFieldValue, setLocalFieldValue } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Project);
  const { extraParams } = useMainContentNavigator();

  const onSelect = (option: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.Project, option);
  };

  return (
    <ProjectPicker
      value={value}
      onSelect={onSelect}
      extraParams={extraParams}
    />
  );
}
