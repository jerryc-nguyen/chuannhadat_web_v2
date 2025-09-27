import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OptionForSelect } from '@common/types';
import ListItem from '@components/konsta/ListItem';
import List from '@components/konsta/List';
import { CardTitle } from '@components/ui/card';
import ProjectPicker from '@components/ajax-pickers/ProjectPicker';
import { Button } from '@components/ui/button';
import { IPostForm } from '@dashboard/PostManagement/types';

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
  const project = form.watch('project');
  const handleSelectProject = (option: OptionForSelect) => {
    closeModal();

    // Handle child project selection
    if (option.data?.is_child) {
      const parentProject = option.data?.parent;
      form.setValue('child_project_id', String(option.value));
      form.setValue('project_id', String(parentProject.value));
      form.setValue('project', parentProject);
    } else {
      // Handle parent project selection
      form.setValue('project_id', String(option.value));
      form.setValue('project', option);
      form.setValue('child_project_id', undefined);
    }

    setCurProject(form.getValues('project'));

    // Set additional data if available
    // Use the option data directly if it's a child project, or use the parent project data
    const projectData = option.data?.is_child ? option.data?.parent.data : option.data;

    if (projectData) {
      // Update form values
      form.setValue('city_id', projectData.city_id ? String(projectData.city_id) : '');
      form.setValue('district_id', projectData.district_id ? String(projectData.district_id) : '');
      form.setValue('ward_id', projectData.ward_id ? String(projectData.ward_id) : '');
      form.setValue('street_id', projectData.street_id ? String(projectData.street_id) : '');
      form.setValue('full_address', projectData.address || '');

      // Update location options for parent component
      updateLocationOptions({
        city: projectData.city_id ? {
          value: projectData.city_id,
          text: projectData.city_name || ''
        } : undefined,
        district: projectData.district_id ? {
          value: projectData.district_id,
          text: projectData.district_name || ''
        } : undefined,
        ward: projectData.ward_id ? {
          value: projectData.ward_id,
          text: projectData.ward_name || ''
        } : undefined,
        street: projectData.street_id ? {
          value: projectData.street_id,
          text: projectData.street_name || ''
        } : undefined
      });
    }
  };

  const handleClearProject = () => {
    setCurProject(undefined);
    form.setValue('project_id', '');
    form.setValue('project', undefined);
    form.setValue('child_project_id', undefined);
  };

  return (
    <>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Dự án</CardTitle>
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

        {project?.value && (<div className="p-4">
          Địa chỉ: <span className="font-bold">{project.data?.address || 'Chưa cập nhật'}</span>
        </div>)}

        {project?.value && project.data?.child_projects && project.data.child_projects.length > 0 && (
          <div className="px-4 pb-4">
            <b>Dự án con:</b>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.data.child_projects.map((childProject: any) => {
                const childProjectId = childProject.id ? String(childProject.id) : '';
                const selectedChildProjectId = form.watch('child_project_id');
                const isSelected = selectedChildProjectId === childProjectId;

                return (
                  <Button
                    key={childProjectId}
                    variant={isSelected ? "default" : "outline"}
                    className={`text-xs rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();

                      if (isSelected) {
                        // Deselect if already selected
                        form.setValue('child_project_id', undefined);
                      } else {
                        // Select this child project
                        form.setValue('child_project_id', childProjectId);
                      }
                    }}
                  >
                    {childProject.name}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </List>

    </>
  );
} 
