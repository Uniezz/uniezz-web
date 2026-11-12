import { useMutation } from '@tanstack/react-query';
import { uploadPostImages } from '@/utils/feed';
import type { UploadPostImagesInput } from '@/@types';
import { useUploadImage } from './useUploadImage';

export function useUploadPostImages() {
  const { mutateAsync: uploadImage } = useUploadImage('feed');
  const { data: previous, mutateAsync: upload } = useMutation({
    meta: { analyticsAction: 'images_upload_batch' },
    mutationKey: ['feed', 'upload-images'],
    mutationFn: ({ files, uploaded }: UploadPostImagesInput) =>
      uploadPostImages(files, uploaded, uploadImage),
  });

  async function uploadImages(files: File[]) {
    if (!files.length) return [];
    const result = await upload({ files, uploaded: previous?.uploaded ?? [] });
    if (result.failed) throw result.error;
    return result.mediaIds;
  }

  return { uploadImages };
}
