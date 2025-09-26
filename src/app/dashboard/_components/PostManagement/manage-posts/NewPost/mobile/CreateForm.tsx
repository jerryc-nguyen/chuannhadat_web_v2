'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { useState } from 'react';
import { OptionForSelect } from '@common/types';
import { IPostForm } from '@dashboard/PostManagement/types';

// Import modular field components
import BasicInfoFields from './fields/BasicInfoFields';
import ProjectField from './fields/ProjectField';
import LocationField from './fields/LocationField';
import DescriptionFields from './fields/DescriptionFields';
import PropertyDetailsFields from './fields/PropertyDetailsFields';
import MediaFields from './fields/MediaFields';

/**
 * Mobile form for creating/editing property listings
 */
export const CreateForm: React.FC = () => {
  const { openModal, closeModal } = useModals();
  const form = useFormContext<IPostForm>();

  // Watch for project and full_address values to conditionally show location field
  const project = useWatch({ control: form.control, name: 'project' });
  const fullAddress = useWatch({ control: form.control, name: 'full_address' });
  const shouldShowLocationField = !project?.value || !fullAddress;

  // Location state management
  const [cityOption, setCityOption] = useState<OptionForSelect | undefined>();
  const [districtOption, setDistrictOption] = useState<OptionForSelect | undefined>();
  const [wardOption, setWardOption] = useState<OptionForSelect | undefined>();
  const [streetOption, setStreetOption] = useState<OptionForSelect | undefined>();

  // Handler for updating location options from the project field
  const updateLocationOptions = (options: {
    city?: OptionForSelect | undefined;
    district?: OptionForSelect | undefined;
    ward?: OptionForSelect | undefined;
    street?: OptionForSelect | undefined;
  }) => {
    if (options.city) setCityOption(options.city);
    if (options.district) setDistrictOption(options.district);
    if (options.ward) setWardOption(options.ward);
    if (options.street) setStreetOption(options.street);
  };

  // Handler for location changes
  const handleLocationChange = (options: {
    city?: OptionForSelect | undefined;
    district?: OptionForSelect | undefined;
    ward?: OptionForSelect | undefined;
    street?: OptionForSelect | undefined;
  }) => {
    if (options.city) setCityOption(options.city);
    if (options.district) setDistrictOption(options.district);
    if (options.ward) setWardOption(options.ward);
    if (options.street) setStreetOption(options.street);
  };

  return (
    <div className="grid items-start gap-0 lg:col-span-3">
      {/* Basic property information */}
      <BasicInfoFields
        form={form}
        openModal={openModal}
        closeModal={closeModal}
      />

      {/* Project selection */}
      <ProjectField
        form={form}
        openModal={openModal}
        closeModal={closeModal}
        updateLocationOptions={updateLocationOptions}
      />

      {/* Location selection - only show if project or full_address is missing */}
      {shouldShowLocationField && (
        <LocationField
          form={form}
          openModal={openModal}
          closeModal={closeModal}
          cityOption={cityOption}
          districtOption={districtOption}
          wardOption={wardOption}
          streetOption={streetOption}
          onLocationChange={handleLocationChange}
        />
      )}

      {/* Property description */}
      <DescriptionFields form={form} />

      {/* Detailed property information */}
      <PropertyDetailsFields
        form={form}
        openModal={openModal}
        closeModal={closeModal}
      />

      {/* Media uploads */}
      <MediaFields form={form} />
    </div>
  );
};
