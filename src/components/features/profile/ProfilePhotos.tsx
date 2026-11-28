import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { apiErrorCode } from '@/api';
import {
  useAddProfilePhoto,
  useDeleteProfilePhoto,
  useMyProfilePhotos,
  usePhoneViewport,
  useReorderProfilePhotos,
  useUploadImage,
} from '@/hooks';
import { avatarImageSchema } from '@/schemas';
import { UIButton, UIPanel } from '@/ui/components';
import { cn } from '@/ui/cn';
import { toast } from '@/utils';
import { PhotoViewer } from './PhotoViewer';

// The backend counts the avatar toward this limit.
const MAX_PHOTOS = 6;

/** Profile photos, the avatar first; changes save right away. */
export function ProfilePhotos() {
  const { t } = useTranslation();
  const { data } = useMyProfilePhotos();
  const { mutateAsync: upload, isPending: isUploading } = useUploadImage('avatar');
  const { mutateAsync: addPhoto, isPending: isAdding } = useAddProfilePhoto();
  const { mutateAsync: deletePhoto, isPending: isDeleting } = useDeleteProfilePhoto();
  const { mutateAsync: reorderPhotos, isPending: isReordering } = useReorderProfilePhotos();
  const photos = data?.photos ?? [];
  // The avatar is changed and removed through its own controls, so only these reorder.
  const extras = photos.filter((photo) => !photo.isAvatar);
  const canAdd = photos.length < MAX_PHOTOS;
  const busy = isUploading || isAdding || isDeleting || isReordering;
  const isPhone = usePhoneViewport();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

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

  // on a phone, as the app: several photos at once, up to the free slots
  async function addMany(files: File[]) {
    for (const file of files.slice(0, MAX_PHOTOS - photos.length)) await add(file);
  }

  async function removePhoto(id: string) {
    try {
      await deletePhoto(id);
      toast.success(t('app.saved'));
    } catch {
      toast.error(t('apiState.profileSaveError'));
    }
  }

  function move(index: number, offset: number) {
    const ids = extras.map((photo) => photo.id);
    [ids[index], ids[index + offset]] = [ids[index + offset]!, ids[index]!];
    void run(() => reorderPhotos(ids));
  }

  const handleViewerClose = () => setViewerIndex(null);
  if (isPhone) {
    // the mobile app's ProfilePhotos: a heading with the count over a strip that bleeds to the screen edges
    return (
      <section className="flex flex-col gap-3" aria-label={t('students.photos')}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-section font-semibold">{t('students.photos')}</h2>
          <span className="text-micro text-secondary">
            {photos.length} / {MAX_PHOTOS}
          </span>
        </div>
        <ul className="-mx-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className="relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-60"
            >
              <button
                type="button"
                aria-label={t('app.openImage')}
                data-ph-capture-attribute-label="Open profile photo"
                onClick={() => setViewerIndex(index)}
                className="size-full"
              >
                <img src={photo.url} alt="" className="size-full object-cover" />
              </button>
              {!photo.isAvatar && (
                <button
                  type="button"
                  aria-label={t('postComposer.removePhoto')}
                  data-ph-capture-attribute-label="Remove profile photo"
                  disabled={busy}
                  onClick={() => void removePhoto(photo.id)}
                  className="absolute top-1.5 right-1.5 flex size-5.5 items-center justify-center rounded-full bg-ink-70 text-white disabled:opacity-40"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
          {canAdd && (
            <li className="shrink-0">
              <label
                aria-label={t('postComposer.addPhoto')}
                data-ph-capture-attribute-label="Add profile photos"
                className={cn(
                  'flex h-32 w-24 items-center justify-center rounded-2xl border border-white-12 bg-white-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue',
                  busy ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                )}
              >
                <Plus size={20} aria-hidden="true" />
                <input
                  type="file"
                  multiple
                  disabled={busy}
                  className="sr-only"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    void addMany(Array.from(e.target.files ?? []));
                    e.target.value = '';
                  }}
                />
              </label>
            </li>
          )}
        </ul>
        <PhotoViewer
          urls={photos.map(({ url }) => url)}
          index={viewerIndex}
          onClose={handleViewerClose}
        />
      </section>
    );
  }

  return (
    <UIPanel surface="tint" className="space-y-4 rounded-profile">
      <div className="flex items-baseline justify-between gap-3 max-lg:flex-col max-lg:items-start max-lg:gap-1">
        <h2 className="text-section font-semibold">{t('students.photosTitle')}</h2>
        <p className="text-detail text-secondary">{t('students.photosHint')}</p>
      </div>
      {/* on a phone, a sideways strip of portrait thumbnails to the panel edge, as in the app */}
      <ul className="grid grid-cols-2 gap-3 max-lg:-mx-5 max-lg:flex max-lg:[scrollbar-width:none] max-lg:gap-2 max-lg:overflow-x-auto max-lg:px-5 sm:grid-cols-3 lg:grid-cols-5">
        {photos.map((photo) => {
          const index = extras.indexOf(photo);
          return (
            <li
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-2xl max-lg:aspect-[3/4] max-lg:w-28 max-lg:shrink-0"
            >
              <img src={photo.url} alt="" className="size-full object-cover" />
              {!photo.isAvatar && (
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
                    disabled={busy || index === extras.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </UIButton>
                </div>
              )}
            </li>
          );
        })}
        {canAdd && (
          <li className="max-lg:w-28 max-lg:shrink-0">
            <label
              data-ph-capture-attribute-label={t('students.photoAdd')}
              className={cn(
                'flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white-10 text-detail text-secondary transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue max-lg:aspect-[3/4]',
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
