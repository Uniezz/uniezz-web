import { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FeedPost } from '@/@types';
import { useMyProfile } from '@/hooks';
import { postSchema, type PostSchema } from '@/schemas';
import { postFormDefaults } from '@/utils/feed';
import {
  UIButton,
  UIField,
  UIPanel,
  UIQueryError,
  UITopbar,
  UIUnsavedChanges,
} from '@/ui/components';
import { PostEventDetails } from './PostEventDetails';
import { PostPhotoField } from './PostPhotoField';
import { PostTypeSelector } from './PostTypeSelector';
import { PostAudienceSelector } from './PostAudienceSelector';

export function PostComposer({
  post,
  isPending,
  isError,
  onSubmit,
  onCancel,
}: {
  post?: FeedPost;
  isPending: boolean;
  isError: boolean;
  onSubmit: (values: PostSchema) => Promise<void>;
  onCancel: () => void;
}) {
  const { data: author, isError: profileError, refetch: refetchProfile } = useMyProfile();
  const { t } = useTranslation();
  const [image, setImage] = useState('');
  const [readingImage, setReadingImage] = useState(false);
  const {
    register,
    control,
    setValue,
    clearErrors,
    setError,
    trigger,
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
        },
    mode: 'onBlur',
  });
  const { type = 'announcement', audience = 'university', body = '' } = useWatch({ control });
  const titlePlaceholder =
    type === 'question'
      ? t('postComposer.questionPlaceholder')
      : type === 'event'
        ? t('postComposer.eventPlaceholder')
        : t('postComposer.titlePlaceholder');

  return (
    <div className="mx-auto flex h-[calc(100svh-136px)] min-h-0 max-w-5xl flex-col overflow-hidden lg:h-[calc(100svh-56px)]">
      <UIUnsavedChanges dirty={isDirty} />
      <div className="shrink-0">
        <UIButton
          bg="transparent"
          size="pill"
          onClick={onCancel}
          className="mb-4 min-h-11 gap-2 border-0 px-0 text-label text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />{' '}
          {post ? t('app.back') : t('feed.title')}
        </UIButton>
        <UITopbar
          title={post ? t('apiState.editPost') : t('app.newPost')}
          subtitle={post ? undefined : t('postComposer.subtitle')}
        />
      </div>
      <div className="min-h-0 flex-1">
        <UIPanel className="h-full min-h-0 overflow-hidden p-0">
          <form
            autoComplete="off"
            className="flex h-full min-h-0 flex-col"
            onSubmit={handleSubmit(async (values) => {
              try {
                await onSubmit(values);
              } catch {
                // Keep the draft available when publishing fails.
              }
            })}
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              <fieldset disabled={isPending} className="space-y-5 p-5 sm:p-6">
                <PostTypeSelector
                  type={type}
                  disabled={Boolean(post)}
                  onSelect={(value) => {
                    setValue('type', value, { shouldDirty: true });
                    clearErrors(['date', 'time']);
                    if (value === 'question') {
                      setValue('image', undefined, { shouldDirty: true });
                      clearErrors('image');
                      setImage('');
                    }
                  }}
                />
                <PostAudienceSelector
                  audience={audience}
                  disabled={Boolean(post)}
                  university={author?.universityId.toUpperCase() ?? t('app.university')}
                  onSelect={(value) => setValue('audience', value, { shouldDirty: true })}
                />
                <div className="space-y-1.5">
                  <label htmlFor="post-title" className="text-micro font-semibold text-secondary">
                    {type === 'question'
                      ? t('postComposer.questionTitle')
                      : t('postComposer.title')}
                  </label>
                  <input
                    autoComplete="off"
                    {...register('title')}
                    id="post-title"
                    className="app-control"
                    placeholder={titlePlaceholder}
                    maxLength={150}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? 'post-title-error' : undefined}
                  />
                  {errors.title && (
                    <p
                      id="post-title-error"
                      role="alert"
                      className="text-micro font-semibold text-danger"
                    >
                      {t('apiState.titleError')}
                    </p>
                  )}
                </div>
                <UIField
                  label={t('postComposer.details')}
                  error={errors.body ? t('apiState.detailsError') : undefined}
                >
                  <textarea
                    autoComplete="off"
                    {...register('body')}
                    className="app-control h-36 max-h-36 min-h-36 shrink-0 resize-none overflow-y-auto"
                    placeholder={t('postComposer.detailsPlaceholder')}
                    maxLength={5000}
                    aria-invalid={Boolean(errors.body)}
                  />
                  <span className="text-right text-micro font-normal text-secondary">
                    {body.length}/5000
                  </span>
                </UIField>
                {type === 'event' && <PostEventDetails register={register} errors={errors} />}
                {post && post.mediaUrls?.[0] && (
                  <div className="space-y-3">
                    <p className="text-detail font-semibold text-secondary">
                      {t('postComposer.photo')}
                    </p>
                    <img
                      src={post.mediaUrls[0]}
                      alt={t('postComposer.photoPreview')}
                      className="h-36 w-full rounded-feature object-cover"
                    />
                  </div>
                )}
                {!post && type !== 'question' && (
                  <PostPhotoField
                    image={image}
                    setImage={setImage}
                    readingImage={readingImage}
                    setReadingImage={setReadingImage}
                    imageError={errors.image}
                    form={{ setValue, clearErrors, setError, trigger }}
                    disabled={isPending}
                  />
                )}
                {isError && <UIQueryError />}
                {profileError && <UIQueryError retry={() => void refetchProfile()} />}
              </fieldset>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-white-10 p-5 sm:p-6">
              <UIButton bg="secondary" onClick={onCancel} disabled={isPending}>
                {t('postComposer.cancel')}
              </UIButton>
              <UIButton
                type="submit"
                leftIcon={Send}
                disabled={readingImage || isPending || !author}
              >
                {post ? t('app.saveChanges') : t('postComposer.publish')}
              </UIButton>
            </div>
          </form>
        </UIPanel>
      </div>
    </div>
  );
}
