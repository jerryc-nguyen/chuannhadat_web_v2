'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, X } from 'lucide-react';
import { useState } from 'react';
import { OptionForSelect } from '@models';
import { FormField, FormItem } from '@components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Button } from '@components/ui/button';
import ProjectPicker from '@components/ajax-pickers/ProjectPicker';
import { LuChevronsUpDown } from 'react-icons/lu';
import { cn } from '@common/utils';

const ProjectForm: React.FC<any> = ({ form }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <MapPin /> Dự án
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div style={{ width: '300px' }}>
          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => {
              const selectedOption = form.watch('project') as OptionForSelect | undefined;

              const handleSelect = async (option: OptionForSelect) => {
                console.log('option', option);
                // Set project values
                form.setValue('project_id', option.value);
                form.setValue('project', option);
                form.setValue('city_id', option.data?.city_id || undefined);
                form.setValue('district_id', option.data?.district_id || undefined);
                form.setValue('ward_id', option.data?.ward_id || undefined);
                form.setValue('street_id', option.data?.street_id || undefined);
                form.setValue('full_address', option.data?.address);
                setOpenDropdown(false);
              };

              const clearSelection = (e: React.MouseEvent) => {
                e.stopPropagation();
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
                        className="w-full justify-between pr-2"
                      >
                        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
                          {selectedOption?.text || 'Tìm dự án'}
                        </span>
                        <div className="flex items-center gap-1">
                          {selectedOption && (
                            <Button
                              variant="outline"
                              onClick={clearSelection}
                              className="h-6 w-6 p-0 rounded-full border border-muted hover:border-red-500 hover:bg-red-50 transition-colors"
                              type="button"
                            >
                              <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                              <span className="sr-only">Clear</span>
                            </Button>
                          )}
                          <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
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
                        autocompleteProjectParams={{}}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
