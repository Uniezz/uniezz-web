import { useMutation } from '@tanstack/react-query';
import { uploadPostImages, type UploadedPostImage } from '@/utils/feed';
import { useUploadImage } from './useUploadImage';

export function useUploadPostImages() {
  const { mutateAsync: uploadImage } = useUploadImage('feed');
  const { data: previous, mutateAsync: upload } = useMutation({
    meta: { analyticsAction: 'images_upload_batch' },
    mutationKey: ['feed', 'upload-images'],
    mutationFn: ({ files, uploaded }: { files: File[]; uploaded: UploadedPostImage[] }) =>
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
