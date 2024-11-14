export type IColumnTable = {
  /** A unique key for identifying the column */
  key: string;
  /** Name to render on the column header. */
  name: string;
  /** Class name to apply to the column in table header */
  className?: string;
  /** Class name to apply to the column in table row */
  classNameRow?: string;
  /** Define function to return format of each column row */
  onRenderItemColumn?: (item?: A, index?: number) => React.ReactNode;
};
export interface CommonTableViewProps {
  columns: IColumnTable[];
  isLoading?: boolean;
  items: A[];
}
