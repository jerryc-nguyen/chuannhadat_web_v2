export interface FilterOption {
  id?: string | number;
  text: string;
  params: Record<string, any>;
  count?: number;
}

export interface LocationOption {
  id?: string | number;
  text?: string;
}
