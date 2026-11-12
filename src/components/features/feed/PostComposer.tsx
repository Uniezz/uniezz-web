import { captureAnalytics } from '@/utils/analytics';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import type { FeedPost } from '@/@types';
import { useMyProfile } from '@/hooks';
import { parsePostTagDraft, postSchema, postTagAdditionSchema, type PostSchema } from '@/schemas';
import { postFormDefaults } from '@/utils/feed';
import {
  UIButton,
  UIEmojiPicker,
  UIField,
  UIDialog,
  UIQueryError,
  UIUnsavedChanges,
} from '@/ui/components';
import { PostEventDetails } from './PostEventDetails';
import { PostPhotoField } from './PostPhotoField';
import { PostTagsField } from './PostTagsField';
import { PostTypeSelector } from './PostTypeSelector';
import { PostAudienceSelector } from './PostAudienceSelector';

export function PostComposer({
  post,
  isPending,
  onSubmit,
  onCancel,
}: {
  post?: FeedPost;
  isPending: boolean;
  onSubmit: (values: PostSchema) => Promise<void>;
  onCancel: () => void;
}) {
  const { data: author, isError: profileError, refetch: refetchProfile } = useMyProfile();
  const { t } = useTranslation();
  const [readingImage, setReadingImage] = useState(false);
  const {
    register,
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? postFormDefaults(post)
      : {
          type: 'announcement',
          audience: 'university',
          title: '',
          body: '',
          date: '',
          time: '',
          images: [],
          tags: [],
          tagDraft: '',
        },
    mode: 'onBlur',
  });
  const [type = 'announcement', audience = 'university', title = '', body = ''] = useWatch({
    control,
    name: ['type', 'audience', 'title', 'body'],
  });
  const titlePlaceholder =
    type === 'question'
      ? t('postComposer.questionPlaceholder')
      : type === 'event'
        ? t('postComposer.eventPlaceholder')
        : t('postComposer.titlePlaceholder');

  return (
    <UIDialog
      open
      placement="right"
      dismissible={!isPending && !readingImage}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      title={post ? t('apiState.editPost') : t('app.newPost')}
      description={t('postComposer.subtitle')}
    >
      <UIUnsavedChanges dirty={isDirty} />
      <form
        autoComplete="off"
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={handleSubmit(
          async (values) => {
            try {
              const tags = postTagAdditionSchema.safeParse([
                ...values.tags,
                ...parsePostTagDraft(values.tagDraft),
              ]);
              await onSubmit({ ...values, tags: tags.success ? tags.data : values.tags });
            } catch {
              toast.error(t('apiState.error'));
            }
          },
          (errors) => {
            captureAnalytics('post_form_validation_failed');

            if (errors.images) toast.error(t('postComposer.photosError'));
          },
        )}
      >
        <div className="min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto [overflow-anchor:none]">
          <fieldset disabled={isPending} className="min-w-0 space-y-5 p-1">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <PostTypeSelector
                type={type}
                disabled={Boolean(post)}
                readingImage={readingImage}
                onSelect={(value) => {
                  setValue('type', value, { shouldDirty: true });
                  clearErrors(['date', 'time']);
                  if (value === 'question') {
                    setValue('images', [], { shouldDirty: true });
                    clearErrors('images');
                  }
                }}
              />
              <PostAudienceSelector
                audience={audience}
                disabled={Boolean(post)}
                university={author?.universityId.toUpperCase() ?? t('app.university')}
                universityId={author?.universityId}
                onSelect={(value) => setValue('audience', value, { shouldDirty: true })}
              />
            </div>
            <UIField
              label={
                type === 'question' ? t('postComposer.questionTitle') : t('postComposer.title')
              }
              error={errors.title && t('apiState.titleError')}
              maxLength={150}
              count={title.length}
            >
              <input
                autoComplete="off"
                {...register('title')}
                className="app-control"
                placeholder={titlePlaceholder}
                maxLength={150}
                aria-invalid={Boolean(errors.title)}
              />
            </UIField>
            <UIField
              label={t('postComposer.details')}
              error={errors.body && t('apiState.detailsError')}
              maxLength={5000}
              count={
                Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(body))
                  .length
              }
            >
              <textarea
                autoComplete="off"
                {...register('body')}
                className="app-control h-36 max-h-36 min-h-36 shrink-0 resize-none overflow-y-auto"
                placeholder={t('postComposer.detailsPlaceholder')}
                maxLength={5000}
                aria-invalid={Boolean(errors.body)}
              />
              <UIEmojiPicker align="start" className="absolute bottom-0.5 left-1" />
            </UIField>
            {type === 'event' && <PostEventDetails register={register} errors={errors} />}
            <PostTagsField control={control} />
            {post && post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="space-y-3">
                <p className="text-detail font-semibold text-secondary">
                  {t('postComposer.photos')}
                </p>
                <div className="flex h-36 gap-3 overflow-x-auto rounded-feature">
                  {post.mediaUrls.map((url, index) => (
                    <img
                      key={url}
                      src={url}
                      alt={`${t('postComposer.photoPreview')} ${index + 1}`}
                      className="h-full w-36 shrink-0 rounded-feature object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
            {!post && type !== 'question' && (
              <PostPhotoField
                control={control}
                readingImage={readingImage}
                setReadingImage={setReadingImage}
                disabled={isPending}
              />
            )}
            {profileError && <UIQueryError retry={() => void refetchProfile()} />}
          </fieldset>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-white-10 pt-4">
          <UIButton bg="secondary" onClick={onCancel} disabled={isPending}>
            {t('postComposer.cancel')}
          </UIButton>
          <UIButton
            type="submit"
            leftIcon={Send}
            disabled={readingImage || isPending || !author}
            className={readingImage && !isPending && author ? 'disabled:opacity-100' : undefined}
          >
            {post ? t('app.saveChanges') : t('postComposer.publish')}
          </UIButton>
        </div>
      </form>
    </UIDialog>
  );
}
