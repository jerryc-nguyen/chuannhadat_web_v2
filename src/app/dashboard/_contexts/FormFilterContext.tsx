import { createContext, useContext } from "react";
export type CounterFetcher = (filters: Record<string, A>) => Promise<Record<string, A>>;

type FormFilterContextValue = {
  filters: A;
  setFilters: (next: Partial<A>) => void;
  submitFilters: () => void;
  counterFetcher?: CounterFetcher;
};

const FormFilterContext = createContext<FormFilterContextValue | null>(null);

export function useFormFilterContext() {
  const ctx = useContext(FormFilterContext);
  if (!ctx) {
    throw new Error("useFormFilterContext must be used within a FormFilterContext.Provider");
  }
  return ctx;
}

export default FormFilterContext;
