export interface IUploadedImage {
  id?: string | number;
  url: string;
  progress?: number;
  uploading?: boolean;
  uploadedFile?: File;
  hasError?: boolean;
}
