import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type PhotoViewerProps = {
  urls: string[];
  /** The photo to open at; null keeps the viewer closed. */
  index: number | null;
  onClose: () => void;
};

/** The mobile app's full-screen image viewer: swipe between the photos, X closes. */
export function PhotoViewer({ urls, index, onClose }: PhotoViewerProps) {
  const { t } = useTranslation();
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };
  // starts at the tapped photo
  const scrollToStart = (element: HTMLDivElement | null) => {
    if (element && index !== null) element.scrollLeft = element.clientWidth * index;
  };
  return (
    <Dialog.Root open={index !== null} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 bg-black outline-none"
        >
          <Dialog.Title className="sr-only">{t('app.openImage')}</Dialog.Title>
          <div
            ref={scrollToStart}
            className="flex size-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto"
          >
            {urls.map((url) => (
              <img
                key={url}
                src={url}
                alt=""
                className="size-full shrink-0 snap-center object-contain"
              />
            ))}
          </div>
          <Dialog.Close
            aria-label={t('app.close')}
            data-ph-capture-attribute-label="Close photo viewer"
            className="absolute top-[max(12px,env(safe-area-inset-top))] right-4 flex size-10 items-center justify-center rounded-full bg-ink-70 text-white"
          >
            <X size={18} aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
