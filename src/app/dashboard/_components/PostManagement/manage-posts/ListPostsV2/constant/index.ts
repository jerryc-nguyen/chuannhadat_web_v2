import { FRIENDLY_FIELD_NAMES, NORMAL_FIELD_NAMES } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
export const DEFAULT_CHIP_FILTER_PARAMS = {
  ...Object.fromEntries(
    FRIENDLY_FIELD_NAMES.map(fieldName => [fieldName, ''])
  ),
  ...Object.fromEntries(
    NORMAL_FIELD_NAMES.map(fieldName => [fieldName, ''])
  ),
}
