import { useState, type ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FeedPost } from '@/@types';
import { ApiRequestError } from '@/api';
import { useMyProfile, useScrolledPast, useUniversities } from '@/hooks';
import { postSchema, type PostSchema } from '@/schemas';
import { cn } from '@/ui/cn';
import { UIButton, UIQueryError, UIUniversityLogo, UIUnsavedChanges } from '@/ui/components';
import {
  apiErrorKey,
  captureAnalytics,
  HEADER_COMPACT_OFFSET,
  POST_TYPE_SEGMENTS,
  postFormDefaults,
  toast,
} from '@/utils';
import { PostPhotoField } from './PostPhotoField';
import { PostTagsField } from './PostTagsField';

const fieldClass =
  'w-full rounded-xl border bg-white/3 p-4 text-base text-white outline-none placeholder:text-white-60';

/** The mobile app's new and edit post screens on a phone: a full screen with a pinned header and its action. */
export function PostComposerScreen({
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
  const { t } = useTranslation();
  const { data: author, isError: profileError, refetch: refetchProfile } = useMyProfile();
  const { data: universities = [] } = useUniversities();
  const isScrolled = useScrolledPast(HEADER_COMPACT_OFFSET);
  const [readingImage, setReadingImage] = useState(false);
  const {
    register,
    control,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? postFormDefaults(post)
      : {
          type: 'question',
          audience: 'university',
          title: '',
          body: '',
          date: '',
          time: '',
          images: [],
          tags: [],
          tagDraft: '',
        },
    mode: 'onChange',
  });
  const type = useWatch({ control, name: 'type' });
  const universityName =
    universities.find(({ id }) => id === author?.universityId)?.name ??
    author?.universityId.toUpperCase() ??
    '';
  // new post: valid and ready; edit: only once something changed
  const isActionDisabled = isPending || readingImage || !author || (post ? !isDirty : !isValid);
  const today = new Date().toLocaleDateString('sv');

  const submit = handleSubmit(
    // the app ignores an unfinished tag draft
    async (values) => {
      try {
        await onSubmit(values);
      } catch (error) {
        const limited = error instanceof ApiRequestError && error.status === 429;
        toast.error(t(limited ? 'postComposer.rateLimit' : apiErrorKey(error)));
      }
    },
    (formErrors) => {
      captureAnalytics('post_form_validation_failed');
      if (formErrors.images) toast.error(t('postComposer.photosError'));
    },
  );
  const handleAction = () => void submit();

  return (
    <div className="pb-6">
      <span data-hide-bottom-tabs hidden />
      <UIUnsavedChanges dirty={isDirty && !isPending} />
      <header className="sticky top-0 z-30 -mx-4 -mt-6 px-5 pt-[calc(8px+env(safe-area-inset-top))] pb-3">
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 -z-10 border-b border-white-5 bg-ink-40 backdrop-blur-xl motion-safe:transition-opacity motion-safe:duration-200',
            !isScrolled && 'opacity-0',
          )}
        />
        <div className="flex h-11 items-center gap-2.5">
          <UIButton
            size="square"
            bg="glass"
            aria-label={t('app.close')}
            onClick={onCancel}
            className="size-11 text-white-80"
          >
            <X size={18} aria-hidden="true" />
          </UIButton>
          <h1 className="min-w-0 flex-1 truncate text-section font-semibold">
            {post ? t('apiState.editPost') : t('app.newPost')}
          </h1>
          <button
            type="button"
            disabled={isActionDisabled}
            onClick={handleAction}
            data-ph-capture-attribute-label={post ? 'Save post' : 'Publish post'}
            className="h-11 shrink-0 rounded-xl border border-white-20 bg-white px-4 text-body font-semibold text-ink focus-visible:outline-2 focus-visible:outline-blue disabled:bg-white-40"
          >
            {post ? t('apiState.save') : t('postComposer.post')}
          </button>
        </div>
      </header>
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          handleAction();
        }}
      >
        <fieldset disabled={isPending} className="mt-3 flex min-w-0 flex-col gap-6 px-1">
          {!post && (
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-label={t('postComposer.type')}
                  className="flex rounded-2xl border border-white/12 bg-white/3 p-0.75"
                >
                  {POST_TYPE_SEGMENTS.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={field.value === value}
                      data-ph-capture-attribute-label="Pick post type"
                      onClick={() => {
                        field.onChange(value);
                        clearErrors(['date', 'time']);
                      }}
                      className={cn(
                        'h-9 min-w-0 flex-1 truncate rounded-[10px] px-2 text-label font-semibold focus-visible:outline-2 focus-visible:outline-blue',
                        field.value === value ? 'bg-white text-ink' : 'text-white-80',
                      )}
                    >
                      {t(label)}
                    </button>
                  ))}
                </div>
              )}
            />
          )}
          {!post && type === 'event' && (
            <div className="flex flex-col gap-2">
              <span className="px-1 text-detail font-semibold text-white-80">
                {t('postComposer.eventDetails')}
              </span>
              <div className="rounded-2xl border border-white-10 bg-surface-60 px-4 backdrop-blur-xl">
                <label className="flex min-h-13 items-center justify-between gap-3">
                  <span className="font-medium">{t('postComposer.date')}</span>
                  <input
                    type="date"
                    min={today}
                    {...register('date')}
                    aria-invalid={Boolean(errors.date)}
                    className="min-w-0 bg-transparent text-right text-base text-white scheme-dark outline-none"
                  />
                </label>
                <label className="flex min-h-13 items-center justify-between gap-3 border-t border-white-5">
                  <span className="font-medium">{t('postComposer.time')}</span>
                  <input
                    type="time"
                    {...register('time')}
                    aria-invalid={Boolean(errors.time)}
                    className="min-w-0 bg-transparent text-right text-base text-white scheme-dark outline-none"
                  />
                </label>
              </div>
              {(errors.date || errors.time) && <FieldError>{t('app.required')}</FieldError>}
            </div>
          )}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <PostField
                label={t('postComposer.title')}
                count={field.value.length}
                max={150}
                error={errors.title && t('apiState.titleError')}
              >
                <input
                  {...field}
                  maxLength={150}
                  placeholder={t('postComposer.titlePlaceholder')}
                  aria-invalid={Boolean(errors.title)}
                  className={cn(fieldClass, errors.title ? 'border-red' : 'border-white/12')}
                />
              </PostField>
            )}
          />
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <PostField
                label={t('postComposer.details')}
                count={field.value.length}
                max={5000}
                error={errors.body && t('apiState.detailsError')}
              >
                <textarea
                  {...field}
                  maxLength={5000}
                  placeholder={t('postComposer.detailsPlaceholder')}
                  aria-invalid={Boolean(errors.body)}
                  className={cn(
                    fieldClass,
                    'h-42 resize-none leading-[22.4px]',
                    errors.body ? 'border-red' : 'border-white/12',
                  )}
                />
              </PostField>
            )}
          />
          {!post && (
            <PostPhotoField
              phone
              control={control}
              readingImage={readingImage}
              setReadingImage={setReadingImage}
              disabled={isPending}
            />
          )}
          <PostTagsField phone control={control} />
          {post ? (
            <p className="flex items-start gap-2 px-1 text-detail text-secondary">
              <Info size={15} className="mt-px shrink-0 text-white-60" aria-hidden="true" />
              {t('postComposer.editNote')}
            </p>
          ) : (
            <Controller
              name="audience"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <span className="px-1 text-detail font-semibold text-white-80">
                    {t('postComposer.audience')}
                  </span>
                  <div
                    role="radiogroup"
                    aria-label={t('postComposer.audience')}
                    className="flex flex-col gap-1 rounded-2xl border border-white-10 bg-surface-60 p-1 backdrop-blur-xl"
                  >
                    <AudienceOption
                      selected={field.value === 'all'}
                      onClick={() => field.onChange('all')}
                      icon={<Globe size={20} className="text-white-80" aria-hidden="true" />}
                      title={t('feed.allStudents')}
                      subtitle={t('postComposer.audienceAll')}
                    />
                    <AudienceOption
                      selected={field.value === 'university'}
                      onClick={() => field.onChange('university')}
                      icon={
                        author && (
                          <UIUniversityLogo
                            universityId={author.universityId}
                            size="md"
                            className="size-6"
                          />
                        )
                      }
                      title={universityName}
                      subtitle={t('postComposer.audienceUniversity', {
                        university: universityName,
                      })}
                    />
                  </div>
                </div>
              )}
            />
          )}
          {profileError && <UIQueryError retry={() => void refetchProfile()} />}
        </fieldset>
      </form>
    </div>
  );
}

/** The app's PostField: label and an always-visible counter above the control, the error under it. */
function PostField({
  label,
  count,
  max,
  error,
  children,
}: {
  label: string;
  count: number;
  max: number;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between gap-3 px-1">
        <span className="text-detail font-semibold text-white-80">{label}</span>
        <span className="text-micro text-secondary">
          {count} / {max}
        </span>
      </span>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </label>
  );
}

function FieldError({ children }: { children: ReactNode }) {
  return <span className="text-detail font-semibold text-red">{children}</span>;
}

function AudienceOption({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      data-ph-capture-attribute-label="Pick post audience"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3.5 rounded-xl border p-3 text-left focus-visible:outline-2 focus-visible:outline-blue',
        selected ? 'border-white-20 bg-white-5' : 'border-transparent',
      )}
    >
      <span className="grid size-6 shrink-0 place-items-center">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn('truncate', selected ? 'font-semibold' : 'font-medium')}>{title}</span>
        <span className="truncate text-detail text-secondary">{subtitle}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-5.5 shrink-0 place-items-center rounded-full border-[1.5px]',
          selected ? 'border-sky' : 'border-white-40',
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-sky" />}
      </span>
    </button>
  );
}
