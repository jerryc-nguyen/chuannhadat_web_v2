import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OptionForSelect } from '@models';
import ListItem from '@components/konsta/ListItem';
import List from '@components/konsta/List';
import { CardTitle } from '@components/ui/card';
import ProjectPicker from '@components/ajax-pickers/ProjectPicker';
import { IPostForm } from '../../../types';

interface ProjectFieldProps {
  form: UseFormReturn<IPostForm>;
  openModal: (params: any) => void;
  closeModal: () => void;
  updateLocationOptions: (options: {
    city?: OptionForSelect | undefined;
    district?: OptionForSelect | undefined;
    ward?: OptionForSelect | undefined;
    street?: OptionForSelect | undefined;
  }) => void;
}

export default function ProjectField({
  form,
  openModal,
  closeModal,
  updateLocationOptions
}: ProjectFieldProps) {
  const [curProject, setCurProject] = useState<OptionForSelect | undefined>(form.watch('project'));

  const handleSelectProject = (option: OptionForSelect) => {
    closeModal();
    setCurProject(option);

    // Set project values in form
    if (option.value !== undefined) {
      form.setValue('project_id', option.value);
      form.setValue('project', option);
    }

    // Set additional data if available
    if (option.data) {
      // Update form values
      form.setValue('city_id', option.data?.city_id || '');
      form.setValue('district_id', option.data?.district_id || '');
      form.setValue('ward_id', option.data?.ward_id || '');
      form.setValue('street_id', option.data?.street_id || '');
      form.setValue('full_address', option.data?.address || '');

      // Update location options for parent component
      updateLocationOptions({
        city: option.data?.city_id ? {
          value: option.data.city_id,
          text: option.data.city_name || ''
        } : undefined,
        district: option.data?.district_id ? {
          value: option.data.district_id,
          text: option.data.district_name || ''
        } : undefined,
        ward: option.data?.ward_id ? {
          value: option.data.ward_id,
          text: option.data.ward_name || ''
        } : undefined,
        street: option.data?.street_id ? {
          value: option.data.street_id,
          text: option.data.street_name || ''
        } : undefined
      });
    }
  };

  const handleClearProject = () => {
    setCurProject(undefined);
    form.setValue('project_id', '');
    form.setValue('project', undefined);
  };

  return (
    <>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Địa chỉ</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <ListItem
          link
          title="Dự án"
          after={curProject?.text}
          value={curProject?.value}
          onClear={handleClearProject}
          onClick={() => {
            openModal({
              name: 'project',
              title: 'Dự án',
              content: (
                <ProjectPicker
                  value={curProject}
                  onSelect={handleSelectProject}
                  extraParams={{ scope: 'dashboard' }}
                />
              ),
              maxHeightPercent: 0.6,
            });
          }}
        />
      </List>
    </>
  );
} 
