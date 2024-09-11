/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@api/axiosInstance';
import axios from 'axios';
import { API_ROUTES } from '@common/router';
import {
  FileWithPreview,
  IImageSignS3_Request,
  IImageSignS3_Response,
  ITrackUploadedUrl_Request,
  ITrackUploadedUrl_Response,
} from '../type';
import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

const GetSignedUploadUrl = async (data: IImageSignS3_Request): Promise<IImageSignS3_Response> => {
  return await axiosInstance.post(API_ROUTES.IMAGE_UPLOAD.SIGN_S3, data);
};

const TrackUploadedUrl = async (data: ITrackUploadedUrl_Request) => {
  return (await axiosInstance.post(API_ROUTES.IMAGE_UPLOAD.TRACK_UPLOADED_URL, data)).data;
};

const PerformUploadImageS3 = async (
  signedUrl: string,
  data: File,
  config: AxiosRequestConfig<any>,
) => {
  return axios.put(signedUrl, data, config);
};

const ImageUploadApiService = {
  upload: (files: FileWithPreview[]) => {
    const uploadPromises = files.map(async (file) => {
      try {
        const fileExtension = file.name.split('.').pop();
        const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
        const key = `images/${file.name}`;

        const signedUrlResponse: IImageSignS3_Response = await GetSignedUploadUrl({
          folder: 'product_images',
          file_name: fileName,
          new_file_name: key,
        });

        if (!signedUrlResponse?.signed_url) {
          throw new Error('Đã có lỗi xảy ra (code 1)');
        }

        const options = {
          onUploadProgress: (event: AxiosProgressEvent) => {
            const { loaded, total } = event;
            //   onProgress(
            //     {
            //       percent: Math.round((loaded / total) * 100)
            //     },
            //     file
            //   );
            console.log('loaded, total', loaded, total);
          },
          headers: {
            'Content-Type': file.type,
            'x-amz-acl': 'public-read',
          },
        };

        const uploadImageS3Response = await PerformUploadImageS3(
          signedUrlResponse.signed_url,
          file,
          options,
        );
        console.log('uploadImageS3Response', uploadImageS3Response);

        if (uploadImageS3Response.status === 200 || uploadImageS3Response) {
          const trackUploadedUrlResponse: ITrackUploadedUrl_Response = await TrackUploadedUrl({
            s3_key: signedUrlResponse.s3_key,
            s3_url: signedUrlResponse.s3_url,
            file_name: fileName,
            file_size: file.size,
            file_type: fileExtension,
          });

          if (trackUploadedUrlResponse.success && trackUploadedUrlResponse.id) {
            // file.thumbUrl = response.data.thumb_url;
            // file.url = response.data.original_url;
            // file.record = response.data;
            // onSuccess(response.data, file);
            console.log('trackUploadedUrlResponse', trackUploadedUrlResponse);
          } else {
            throw new Error('Đã có lỗi xảy ra (code 4)');
          }
        } else {
          throw new Error('Đã có lỗi xảy ra (code 2)');
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
      }
    });

    // This is an array of Promises
    return uploadPromises;
  },
};

// // Example usage:
// const dataArray = [
//     { file: file1, fileExtension: extension1 },
//     { file: file2, fileExtension: extension2 },
//     // Add more objects as needed
// ];

// const promisesArray = ImageUploadApiService.uploadUsingPresigned(dataArray);

// // To wait for all promises to resolve, you can use Promise.all
// Promise.all(promisesArray)
//     .then((urls) => {
//         console.log('All uploads successful. URLs:', urls);
//     })
//     .catch((err) => {
//         console.error('Error in one or more uploads:', err);
//     });
export default ImageUploadApiService;
