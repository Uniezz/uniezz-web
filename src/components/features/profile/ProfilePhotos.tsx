import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ImagePlus, Trash2 } from 'lucide-react';
import { apiErrorCode } from '@/api';
import {
  useAddProfilePhoto,
  useDeleteProfilePhoto,
  useMyProfile,
  useMyProfilePhotos,
  useReorderProfilePhotos,
  useUploadImage,
} from '@/hooks';
import { avatarImageSchema } from '@/schemas';
import { UIButton, UIPanel } from '@/ui/components';
import { cn } from '@/ui/cn';
import { toast } from '@/utils';

// The backend counts the avatar toward this limit.
const MAX_PHOTOS = 6;

/** Extra profile photos beyond the avatar; changes save right away. */
export function ProfilePhotos() {
  const { t } = useTranslation();
  const { data: profile } = useMyProfile();
  const { data } = useMyProfilePhotos();
  const { mutateAsync: upload, isPending: isUploading } = useUploadImage('avatar');
  const { mutateAsync: addPhoto, isPending: isAdding } = useAddProfilePhoto();
  const { mutateAsync: deletePhoto, isPending: isDeleting } = useDeleteProfilePhoto();
  const { mutateAsync: reorderPhotos, isPending: isReordering } = useReorderProfilePhotos();
  const photos = (data?.photos ?? []).filter((photo) => !photo.isAvatar);
  const canAdd = photos.length + (profile?.avatarUrl ? 1 : 0) < MAX_PHOTOS;
  const busy = isUploading || isAdding || isDeleting || isReordering;

  async function add(file?: File) {
    if (!file) return;
    if (!avatarImageSchema.safeParse(file).success) {
      toast.error(t('app.photoError'));
      return;
    }
    try {
      const { mediaId } = await upload(file);
      await addPhoto(mediaId);
    } catch (error) {
      toast.error(
        t(
          apiErrorCode(error) === 'profile_photo_limit' ? 'students.photosLimit' : 'app.photoError',
        ),
      );
    }
  }

  async function run(action: () => Promise<void>) {
    try {
      await action();
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  function move(index: number, offset: number) {
    const ids = photos.map((photo) => photo.id);
    [ids[index], ids[index + offset]] = [ids[index + offset]!, ids[index]!];
    void run(() => reorderPhotos(ids));
  }

  return (
    <UIPanel surface="tint" className="space-y-4 rounded-profile">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-section font-semibold">{t('students.photosTitle')}</h2>
        <p className="text-detail text-secondary">{t('students.photosHint')}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <li key={photo.id} className="relative aspect-square overflow-hidden rounded-2xl">
            <img src={photo.url} alt="" className="size-full object-cover" />
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
              <UIButton
                bg="transparent"
                size="pill"
                aria-label={t('students.photoMoveLeft')}
                disabled={busy || index === 0}
                onClick={() => move(index, -1)}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </UIButton>
              <UIButton
                bg="transparent"
                size="pill"
                aria-label={t('students.photoDelete')}
                disabled={busy}
                onClick={() => void run(() => deletePhoto(photo.id))}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </UIButton>
              <UIButton
                bg="transparent"
                size="pill"
                aria-label={t('students.photoMoveRight')}
                disabled={busy || index === photos.length - 1}
                onClick={() => move(index, 1)}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </UIButton>
            </div>
          </li>
        ))}
        {canAdd && (
          <li>
            <label
              data-ph-capture-attribute-label={t('students.photoAdd')}
              className={cn(
                'flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white-10 text-detail text-secondary transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue',
                busy ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:text-white',
              )}
            >
              <ImagePlus className="size-5" aria-hidden="true" />
              {t('students.photoAdd')}
              <input
                type="file"
                disabled={busy}
                className="sr-only"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  void add(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
          </li>
        )}
      </ul>
    </UIPanel>
  );
}
