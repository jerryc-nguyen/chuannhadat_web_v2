export interface IUploadedImage {
  id: string | number;
  url: string;
  progress?: number;
  uploading?: boolean;
  uploadedFile?: File;
  hasError?: boolean;
}

export interface IImageSignS3_Request {
  folder: string;
  file_name: string;
  new_file_name?: string;
}

export interface IImageSignS3_Response {
  code: number;
  status: boolean;
  s3_key: string;
  s3_url: string;
  signed_url: string;
}

export interface ITrackUploadedUrl_Request {
  s3_key: string;
  s3_url: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

export interface ITrackUploadedUrl_Response {
  success: boolean;
  id: number;
}
