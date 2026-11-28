import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoViewer } from './PhotoViewer';

export type ProfilePhotoStripProps = { urls: string[] };

/** The mobile app's ProfilePhotos on a student's profile: a read-only strip that opens full screen. */
export function ProfilePhotoStrip({ urls }: ProfilePhotoStripProps) {
  const { t } = useTranslation();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const handleViewerClose = () => setViewerIndex(null);
  return (
    <section className="flex flex-col gap-3" aria-label={t('students.photos')}>
      <h2 className="text-section font-semibold">{t('students.photos')}</h2>
      <ul className="-mx-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5">
        {urls.map((url, index) => (
          <li key={url} className="h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-60">
            <button
              type="button"
              aria-label={t('app.openImage')}
              data-ph-capture-attribute-label="Open profile photo"
              onClick={() => setViewerIndex(index)}
              className="size-full"
            >
              <img src={url} alt="" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <PhotoViewer urls={urls} index={viewerIndex} onClose={handleViewerClose} />
    </section>
  );
}
