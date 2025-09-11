'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { OptionForSelect } from '@common/models';
import { FormField, FormItem } from '@components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Button } from '@components/ui/button';
import ProjectPicker from '@components/ajax-pickers/ProjectPicker';
import { ClearButton } from '@components/ui/clear-button';

import { cn } from '@common/utils';

const ProjectForm: React.FC<any> = ({ form }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const project = form.watch('project');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <Building /> Dự án
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div style={{ width: '300px' }}>
          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => {
              const selectedOption = form.watch('project') as OptionForSelect | undefined;

              const handleSelect = async (option: OptionForSelect) => {
                if (option.data?.is_child) {
                  const parentProject = option.data?.parent
                  form.setValue('child_project_id', option.value);
                  form.setValue('project_id', parentProject.value);
                  form.setValue('project', parentProject);
                } else {
                  form.setValue('project_id', option.value);
                  form.setValue('project', option);
                  form.setValue('child_project_id', undefined);
                }

                form.setValue('city_id', option.data?.city_id || undefined);
                form.setValue('district_id', option.data?.district_id || undefined);
                form.setValue('ward_id', option.data?.ward_id || undefined);
                form.setValue('street_id', option.data?.street_id || undefined);
                form.setValue('full_address', option.data?.address);
                setOpenDropdown(false);
              };

              const clearSelection = (e: React.MouseEvent) => {
                form.setValue('project_id', undefined);
                form.setValue('project', undefined);
              };

              return (
                <FormItem className="grid gap-2">
                  <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDropdown}
                        aria-haspopup="listbox"
                        aria-label="Tìm nhanh dự án"
                        className="w-full justify-between pr-2"
                      >
                        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
                          {selectedOption?.text || 'Tìm nhanh dự án'}
                        </span>
                        <div className="flex items-center gap-1">
                          {selectedOption && (
                            <ClearButton onClick={clearSelection} />
                          )}
                          {!selectedOption && <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0"
                      sideOffset={0}
                      align="end"
                    >
                      <ProjectPicker
                        value={selectedOption}
                        onSelect={handleSelect}
                        extraParams={{ scope: 'dashboard' }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              );
            }}
          />
        </div>

        {project && project.data?.child_projects && project.data.child_projects.length > 0 && (
          <div className="mt-2">
            <b>Dự án con:</b>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.data.child_projects.map((childProject: any) => {
                const isSelected = form.watch('child_project_id') === childProject.id;
                return (
                  <Button
                    key={childProject.id}
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
                        form.setValue('child_project_id', childProject.id);
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

        {project && (<div className="mt-2">
          Địa chỉ: <span className="font-bold">{project.data?.address || 'Chưa cập nhật'}</span>
        </div>)}

      </CardContent>
    </Card>
  );
};

export default ProjectForm;
