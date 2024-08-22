export type Range = {
  min?: number;
  max?: number;
};

export type OptionForSelect = {
  value: number | string;
  text: string;
  range?: Range;
  params?: Record<string, any>;
};
