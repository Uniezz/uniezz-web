import { useState, type UIEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatImagePreview } from '@/components/features/chat';
import { cn } from '@/ui/cn';

/** The mobile app's post media on a phone: swipe between photos, dots under them, tap to open full screen. */
export function PostMediaPager({ images }: { images: string[] }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = event.currentTarget;
    setIndex(Math.round(scrollLeft / Math.max(clientWidth, 1)));
  };
  const handlePreviewClose = () => setPreview(null);

  return (
    <div className="relative h-47.5 overflow-hidden rounded-2xl bg-surface-60">
      <div
        data-swipe-ignore=""
        onScroll={handleScroll}
        className="scrollbar-hidden flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {images.map((src, imageIndex) => (
          <button
            key={src}
            type="button"
            aria-label={t('app.openImage')}
            data-ph-capture-attribute-label="Open post image"
            onClick={() => setPreview(imageIndex)}
            className="size-full shrink-0 snap-center focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue"
          >
            <img
              src={src}
              alt={`${t('postComposer.photoPreview')} ${imageIndex + 1}`}
              decoding="async"
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink-40 px-2 py-1.25"
        >
          {images.map((src, dot) => (
            <span
              key={src}
              className={cn('size-1.5 rounded-full', dot === index ? 'bg-white' : 'bg-white-40')}
            />
          ))}
        </span>
      )}
      <ChatImagePreview
        preview={
          preview === null
            ? null
            : {
                images: images.map((url) => ({ url, name: t('postComposer.photoPreview') })),
                index: preview,
              }
        }
        onIndexChange={setPreview}
        onClose={handlePreviewClose}
      />
    </div>
  );
}
