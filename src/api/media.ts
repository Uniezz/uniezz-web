import type { components } from '@/@types/schema';
import { api } from './client';

export async function uploadImage(
  file: File,
  kind: components['schemas']['CreateUploadInputBody']['kind'],
) {
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
    file.size === 0 ||
    file.size > (kind === 'avatar' ? 5 : 10) * 1024 * 1024
  ) {
    throw new Error('Invalid image');
  }
  const { data } = await api.POST('/media/uploads', {
    body: {
      kind,
      size: file.size,
      contentType: file.type as components['schemas']['CreateUploadInputBody']['contentType'],
    },
  });
  const response = await fetch(data!.uploadUrl, {
    method: 'PUT',
    headers: data!.headers,
    body: file,
    credentials: 'omit',
  });
  if (!response.ok) throw new Error('Image upload failed');
  return data!.mediaId;
}
