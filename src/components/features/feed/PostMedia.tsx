import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UIButton } from '@/ui/components';

export function PostMedia({ images, title }: { images: string[]; title: string }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, Math.max(0, images.length - 1));
  return (
    <div className="bg-ink-20 relative flex aspect-[4/3] items-center justify-center md:aspect-auto md:h-full">
      {images[index] ? (
        <img
          src={images[index]}
          alt={`${t('postComposer.photoPreview')} ${index + 1}`}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="p-8 text-center">
          <h1 className="text-body font-semibold tracking-[-0.2px] wrap-anywhere">{title}</h1>
        </div>
      )}
      {images.length > 1 && (
        <>
          <UIButton
            size="icon"
            bg="secondary"
            aria-label={t('postComposer.previousPhoto')}
            disabled={index === 0}
            onClick={() => setSelected(index - 1)}
            className="absolute left-3 bg-surface"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </UIButton>
          <UIButton
            size="icon"
            bg="secondary"
            aria-label={t('postComposer.nextPhoto')}
            disabled={index === images.length - 1}
            onClick={() => setSelected(index + 1)}
            className="absolute right-3 bg-surface"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </UIButton>
          <span
            aria-live="polite"
            className="absolute right-3 bottom-3 rounded-full bg-ink-70 px-3 py-1 text-detail font-semibold text-white"
          >
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
