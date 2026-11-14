import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/api';
import i18n from '@/i18n';

export function useUploadImage(kind: Parameters<typeof uploadImage>[1]) {
  return useMutation({
    meta: { analyticsAction: 'image_upload', progress: () => i18n.t('progress.imageUpload') },
    mutationKey: ['media', 'upload', kind],
    mutationFn: async (file: File) => ({ file, mediaId: await uploadImage(file, kind) }),
  });
}
