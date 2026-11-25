import { useTranslation } from 'react-i18next';

import { cn } from '@/ui/cn';

// Telegram-style collage: the images fill the whole frame, with no empty space.
const frameLayouts: Record<number, string> = {
  1: 'aspect-[4/3] grid-cols-1',
  2: 'aspect-[2/1] grid-cols-2',
  3: 'aspect-square grid-cols-2 grid-rows-2',
  4: 'aspect-square grid-cols-[2fr_1fr] grid-rows-3',
  5: 'aspect-square grid-cols-6 grid-rows-2',
};

function imageLayout(count: number, index: number): string {
  if (count === 3 && index === 0) return 'row-span-2';
  if (count === 4 && index === 0) return 'row-span-3';
  if (count === 5) return index < 2 ? 'col-span-3' : 'col-span-2';
  return '';
}

export function ChatMessageImages({
  images,
  onOpen,
}: {
  images: { url: string }[];
  onOpen: (index: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'mb-1 grid w-72 max-w-full gap-0.5 overflow-hidden rounded-xl',
        frameLayouts[Math.min(images.length, 5)],
      )}
    >
      {images.map((image, index) => (
        <button
          key={image.url}
          type="button"
          aria-label={t('app.openImage')}
          data-ph-capture-attribute-label="Open chat image preview"
          className={cn(
            'min-h-0 min-w-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue',
            imageLayout(images.length, index),
          )}
          onClick={() => onOpen(index)}
        >
          <img src={image.url} alt={t('app.attachedImage')} className="size-full object-cover" />
        </button>
      ))}
    </div>
  );
}
