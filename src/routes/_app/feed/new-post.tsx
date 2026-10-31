import { useState } from 'react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { ChevronLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { useCreatePost } from '@/hooks/useCreatePost';
import { useMyProfile } from '@/hooks';
import { postSchema } from '@/schemas';
import {
  UIButton,
  UIField,
  UIPanel,
  UIQueryError,
  UITopbar,
  UIUnsavedChanges,
} from '@/ui/components';
import { PostEventDetails } from '@/components/features/feed/PostEventDetails';
import { PostPhotoField } from '@/components/features/feed/PostPhotoField';
import { PostTypeSelector } from '@/components/features/feed/PostTypeSelector';

export const Route = createFileRoute('/_app/feed/new-post')({
  beforeLoad: ({ search }) => {
    if (search.feedRoute !== 'new-post' || search.postId) {
      throw redirect({
        to: '/feed/new-post',
        search: { ...search, feedRoute: 'new-post', postId: undefined },
        replace: true,
      });
    }
  },
  component: NewPostPage,
});

function NewPostPage() {
  const { mutateAsync: createPost, isPending, isError } = useCreatePost();
  const { data: author, isError: profileError, refetch: refetchProfile } = useMyProfile();
  const navigate = Route.useNavigate();
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
    defaultValues: { type: 'announcement', title: '', body: '', date: '', time: '' },
    mode: 'onBlur',
  });
  const { type = 'announcement', body = '' } = useWatch({ control });
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
        <Link
          to="/feed"
          search={{ postId: undefined, feedRoute: undefined }}
          className="mb-4 inline-flex min-h-11 items-center gap-2 text-label text-secondary hover:text-white"
        >
          <ChevronLeft className="size-5" aria-hidden="true" /> {t('feed.title')}
        </Link>
        <UITopbar title={t('app.newPost')} subtitle={t('postComposer.subtitle')} />
      </div>
      <div className="min-h-0 flex-1">
        <UIPanel className="h-full min-h-0 overflow-hidden p-0">
          <form
            autoComplete="off"
            className="flex h-full min-h-0 flex-col"
            onSubmit={handleSubmit(async (values) => {
              try {
                await createPost(values);
                toast.success(t('postComposer.published'));
                void navigate({
                  to: '/feed',
                  search: { postId: undefined, feedRoute: undefined },
                  ignoreBlocker: true,
                });
              } catch {
                // Keep the draft available when publishing fails.
              }
            })}
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              <fieldset disabled={isPending} className="space-y-5 p-5 sm:p-6">
                <PostTypeSelector
                  type={type}
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
                {type !== 'question' && (
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
              <UIButton
                bg="secondary"
                onClick={() =>
                  void navigate({
                    to: '/feed',
                    search: { postId: undefined, feedRoute: undefined },
                  })
                }
                disabled={isPending}
              >
                {t('postComposer.cancel')}
              </UIButton>
              <UIButton
                type="submit"
                leftIcon={Send}
                disabled={readingImage || isPending || !author}
              >
                {t('postComposer.publish')}
              </UIButton>
            </div>
          </form>
        </UIPanel>
      </div>
    </div>
  );
}
