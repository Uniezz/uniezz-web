import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/api';

export function useUploadImage(kind: Parameters<typeof uploadImage>[1]) {
  return useMutation({
    meta: { analyticsAction: 'image_upload' },
    mutationKey: ['media', 'upload', kind],
    mutationFn: async (file: File) => ({ file, mediaId: await uploadImage(file, kind) }),
  });
}
