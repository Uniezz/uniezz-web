import type { MediaContentType, MediaKind } from '@/@types';
import { studyMaterialFileSchema } from '@/schemas/exams';
import { api } from './client';

export async function uploadImage(file: File, kind: MediaKind) {
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
    file.size === 0 ||
    file.size > (kind === 'avatar' ? 5 : 10) * 1024 * 1024
  ) {
    throw new Error('Invalid image');
  }
  return uploadFile(file, kind);
}

export async function uploadStudyMaterial(file: File) {
  studyMaterialFileSchema.parse(file);
  return uploadFile(file, 'exam');
}

async function uploadFile(file: File, kind: MediaKind) {
  const { data } = await api.POST('/media/uploads', {
    body: {
      kind,
      size: file.size,
      contentType: file.type as MediaContentType,
    },
  });
  const response = await fetch(data!.uploadUrl, {
    method: 'PUT',
    headers: data!.headers,
    body: file,
    credentials: 'omit',
  });
  if (!response.ok) throw new Error('Media upload failed');
  return data!.mediaId;
}
