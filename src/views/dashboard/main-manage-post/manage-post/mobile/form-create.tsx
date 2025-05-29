'use client';

import { useFormContext } from 'react-hook-form';
import useModals from '@mobile/modals/hooks';
import { useState } from 'react';
import { OptionForSelect } from '@models';
import { IPostForm } from '../../types';

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
export const FormMobile: React.FC = () => {
  const { openModal, closeModal } = useModals();
  const form = useFormContext<IPostForm>();

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

      {/* Location selection */}
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
