export interface IUploadedImage {
  id?: string | number;
  url: string;
  previewUrl?: string;
  progress?: number;
  uploading?: boolean;
  uploadedFile?: File;
  hasError?: boolean;
}
