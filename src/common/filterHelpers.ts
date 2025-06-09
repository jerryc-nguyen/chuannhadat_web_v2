import { FilterFieldName } from '@models';
import { FilterChipOption } from '@mobile/filter_bds/types';

/**
 * Filters out AggProjects from the chip options when aggregations don't contain projects
 * @param chipOptions The original filter chip options array
 * @param aggregations The aggregations object from API response
 * @returns Filtered chip options array
 */
export const filterChipOptionsByAggregations = (
  chipOptions: Array<FilterChipOption>,
  aggregations?: Record<string, any>
): Array<FilterChipOption> => {
  if (!aggregations?.projects || aggregations.projects.length === 0) {
    return chipOptions.filter(option => option.id !== FilterFieldName.AggProjects);
  }
  return chipOptions;
}; 
