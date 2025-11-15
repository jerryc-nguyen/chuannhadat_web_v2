import { UseFormReturn } from 'react-hook-form';

export const useScrollToInvalidField = (
  form: UseFormReturn<any>,
  priority?: string[]
) => {
  return (errors: Record<string, unknown>) => {
    const keys = Object.keys(errors);
    if (!keys.length) return;

    const pr = Array.isArray(priority) ? priority : [];
    // Build candidate list: priority (only those currently invalid) then remaining error keys
    const candidates = pr.length
      ? [...pr.filter((k) => keys.includes(k)), ...keys.filter((k) => !pr.includes(k))]
      : keys;

    // Prefer a candidate that has a DOM target; fall back to first candidate
    const targetName =
      candidates.find((name) =>
        document.querySelector(`[data-field-name="${name}"]`) ||
        document.querySelector(`[name="${name}"]`)
      ) ?? candidates[0];

    // Focus and scroll into view
    form.setFocus(targetName as any);
    const el =
      (document.querySelector(`[data-field-name="${targetName}"]`) as HTMLElement | null) ||
      (document.querySelector(`[name="${targetName}"]`) as HTMLElement | null);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
};
