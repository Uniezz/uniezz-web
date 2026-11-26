import { Link, useLocation } from '@tanstack/react-router';
import { Check, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { useMarkImageReviewed, useRemoveImage, useUnreviewedImages } from '@/hooks';
import { UIButton, UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { toast, dateFormatter } from '@/utils';
import { ConfirmActionButton } from './ConfirmActionButton';

/** Uploaded avatars, banners and feed photos no moderator has checked yet, oldest first. */
export function ImageQueue() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useUnreviewedImages();
  const { mutateAsync: markReviewed, isPending: isMarking } = useMarkImageReviewed();
  const { mutateAsync: removeImage } = useRemoveImage();
  const href = useLocation({ select: (location) => location.href });
  const images = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const formatDate = dateFormatter(i18n.resolvedLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const kindLabels = {
    avatar: t('moderation.imageAvatar'),
    banner: t('moderation.imageBanner'),
    feed: t('moderation.imageFeed'),
  };

  async function markChecked(id: string) {
    try {
      await markReviewed(id);
      toast.success(t('moderation.imageChecked'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  if (isPending) return <p role="status">{t('apiState.loading')}</p>;
  if (isError && images.length === 0) return <UIQueryError retry={() => void refetch()} />;
  if (images.length === 0) {
    return (
      <UIEmpty>
        <p>{t('moderation.noImages')}</p>
      </UIEmpty>
    );
  }

  return (
    <Virtuoso
      data={images}
      computeItemKey={(_, image) => image.id}
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
      }}
      components={listComponents}
      aria-label={t('moderation.images')}
      className="min-h-0 flex-1 motion-safe:animate-rise-in"
      itemContent={(_, image) => (
        <div
          role="listitem"
          className="flex flex-wrap items-center gap-4 border-b border-white-10 py-3 text-label"
        >
          <a
            href={image.url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-xl focus-visible:outline-2 focus-visible:outline-sky"
            aria-label={t('moderation.openImage')}
            data-ph-capture-attribute-label="Open image"
          >
            <img
              src={image.url}
              alt=""
              className="size-24 rounded-xl bg-surface object-cover sm:size-32"
            />
          </a>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-semibold">{kindLabels[image.kind]}</p>
            <p className="text-detail text-secondary">
              {formatDate.format(new Date(image.createdAt))}
            </p>
            <Link
              to="/connections/students/$profileId"
              params={{ profileId: image.ownerId }}
              search={{ studentSearch: undefined, from: href }}
              className="text-detail text-secondary hover:text-white hover:underline"
              data-ph-capture-attribute-label="Open image owner profile"
            >
              {t('moderation.openOwner')}
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <UIButton
              size="icon"
              bg="plain"
              aria-label={t('moderation.markImageChecked')}
              title={t('moderation.markImageChecked')}
              disabled={isMarking}
              onClick={() => void markChecked(image.id)}
            >
              <Check className="size-5" aria-hidden="true" />
            </UIButton>
            <ConfirmActionButton
              label={t('moderation.removeImage')}
              description={t('moderation.removeImageDescription')}
              success={t('moderation.imageRemoved')}
              onConfirm={() => removeImage(image.id)}
              icon={Trash2}
              danger
            />
          </div>
        </div>
      )}
    />
  );
}
