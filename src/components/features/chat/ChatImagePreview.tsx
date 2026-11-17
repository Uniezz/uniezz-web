import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { UIButton } from '@/ui/components';

export type ChatPreviewState = { images: { url: string; name: string }[]; index: number };

export function ChatImagePreview({
  preview,
  onIndexChange,
  onClose,
}: {
  preview: ChatPreviewState | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const image = preview?.images[preview.index];
  const count = preview?.images.length ?? 0;
  const index = preview?.index ?? 0;

  return (
    <Dialog.Root open={Boolean(preview)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' && index > 0) onIndexChange(index - 1);
            if (event.key === 'ArrowRight' && index < count - 1) onIndexChange(index + 1);
          }}
        >
          <Dialog.Title className="sr-only">{t('app.imagePreview')}</Dialog.Title>
          {image && (
            // key: every image starts again at normal size.
            <TransformWrapper
              key={image.url}
              minScale={1}
              maxScale={4}
              centerOnInit
              doubleClick={{ mode: 'toggle', step: 1 }}
            >
              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  draggable={false}
                  className="max-h-full max-w-full object-contain select-none"
                />
              </TransformComponent>
            </TransformWrapper>
          )}
          <Dialog.Close asChild>
            <UIButton
              size="icon"
              bg="secondary"
              aria-label={t('app.close')}
              className="absolute top-4 right-4 bg-surface"
            >
              <X size={18} aria-hidden="true" />
            </UIButton>
          </Dialog.Close>
          {count > 1 && (
            <>
              <UIButton
                size="icon"
                bg="secondary"
                aria-label={t('app.previousImage')}
                disabled={index === 0}
                onClick={() => onIndexChange(index - 1)}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-surface"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </UIButton>
              <UIButton
                size="icon"
                bg="secondary"
                aria-label={t('app.nextImage')}
                disabled={index === count - 1}
                onClick={() => onIndexChange(index + 1)}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-surface"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </UIButton>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
