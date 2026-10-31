import { useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Eye,
  FileText,
  ImagePlus,
  MessageCircleQuestion,
  Send,
  Trash2,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { FeedPost } from '@/@types';
import { postSchema, type PostSchema } from '@/schemas';
import { UIButton, UIField, UIMenu, UIPanel, UITopbar, UIUnsavedChanges } from '@/ui/components';
import { useDropdown } from '@/hooks/useDropdown';
// TODO(api): Use the authenticated profile and upload media through the post API.
import { FEEDMOCKS } from '@/utils';
import { FeedPostCard } from './FeedPostCard';

export function CreatePost({
  onCreate,
  onCancel,
}: {
  onCreate: (post: FeedPost) => void;
  onCancel: () => void;
}) {
  const { t, i18n } = useTranslation();
  const {
    ref: postTypeRef,
    isOpen: postTypeOpen,
    toggle: togglePostType,
    close: closePostType,
  } = useDropdown();
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
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: { type: 'post', title: '', body: '', date: '', time: '', location: '' },
    mode: 'onBlur',
  });
  const {
    type = 'post',
    title = '',
    body = '',
    date = '',
    time = '',
    location = '',
  } = useWatch({ control });
  const postTypes = [
    { value: 'post', label: t('postComposer.post'), Icon: FileText },
    { value: 'question', label: t('app.question'), Icon: MessageCircleQuestion },
    { value: 'event', label: t('app.event'), Icon: CalendarDays },
  ];
  const selectedType = postTypes.find((option) => option.value === type) ?? postTypes[0];
  // TODO(api): Replace this mock author and local post construction with the create-post mutation.
  const author = FEEDMOCKS.currentUser;
  const eventDate = date && time ? new Date(`${date}T${time}`) : undefined;
  const summary =
    type === 'event' && eventDate && !Number.isNaN(eventDate.getTime())
      ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(eventDate)
      : type === 'event'
        ? `${t('postComposer.date')} · ${t('postComposer.time')}`
        : t('postComposer.justNow');
  const titlePlaceholder =
    type === 'question'
      ? t('postComposer.questionPlaceholder')
      : type === 'event'
        ? t('postComposer.eventPlaceholder')
        : t('postComposer.titlePlaceholder');
  const preview: FeedPost = {
    id: 'preview',
    type,
    title: title.trim() || titlePlaceholder,
    body,
    author: author.name,
    university: author.university,
    avatar: author.avatar,
    summary,
    image: type !== 'question' ? image || undefined : undefined,
    location: type === 'event' ? location : undefined,
    comments: [],
  };

  async function changePhoto(file?: File) {
    if (!file) return;
    setValue('image', file, { shouldDirty: true });
    if (!(await trigger('image'))) return;
    setReadingImage(true);
    const reader = new FileReader();
    const fail = () => {
      setError('image', { type: 'validate', message: t('app.photoError') });
      setReadingImage(false);
    };
    reader.onerror = fail;
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        fail();
        return;
      }
      const data = reader.result;
      const photo = new Image();
      photo.onerror = fail;
      photo.onload = () => {
        setImage(data);
        setReadingImage(false);
      };
      photo.src = data;
    };
    reader.readAsDataURL(file);
  }

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
      <div className="grid min-h-0 flex-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.65fr)] lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <UIPanel className="min-h-0 overflow-hidden p-0">
          <form
            autoComplete="off"
            className="flex h-full min-h-0 flex-col"
            onSubmit={handleSubmit((values) => {
              onCreate({
                ...preview,
                id: `post-${crypto.randomUUID()}`,
                title: values.title,
                body: values.body,
                eventDate: values.type === 'event' ? `${values.date}T${values.time}` : undefined,
                location: values.type === 'event' ? values.location : undefined,
              });
            })}
          >
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-micro font-semibold text-secondary">
                  {t('postComposer.type')}
                </span>
                <div
                  className="relative"
                  ref={postTypeRef}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      closePostType();
                      postTypeRef.current?.querySelector('button')?.focus();
                    }
                  }}
                >
                  <UIButton
                    size="pill"
                    bg="secondary"
                    leftIcon={selectedType.Icon}
                    leftIconColor="gray"
                    onClick={togglePostType}
                    aria-label={t('postComposer.type')}
                    aria-expanded={postTypeOpen}
                    className="min-h-7 gap-1.5 px-2.5 py-1 text-detail font-medium text-secondary"
                  >
                    {selectedType.label}
                    <ChevronDown size={14} aria-hidden="true" />
                  </UIButton>
                  {postTypeOpen && (
                    <UIMenu
                      options={postTypes}
                      value={type}
                      onSelect={(value) => {
                        if (value !== 'post' && value !== 'question' && value !== 'event') return;
                        setValue('type', value, { shouldDirty: true });
                        clearErrors(['date', 'time', 'location']);
                        if (value === 'question') {
                          setValue('image', undefined, { shouldDirty: true });
                          clearErrors('image');
                          setImage('');
                        }
                        closePostType();
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="post-title" className="text-micro font-semibold text-secondary">
                    {type === 'question'
                      ? t('postComposer.questionTitle')
                      : t('postComposer.title')}
                  </label>
                </div>
                <input
                  {...register('title')}
                  id="post-title"
                  className="app-control"
                  placeholder={titlePlaceholder}
                  maxLength={160}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'post-title-error' : undefined}
                />
                {errors.title && (
                  <p
                    id="post-title-error"
                    role="alert"
                    className="text-micro font-semibold text-danger"
                  >
                    {t('app.required')}
                  </p>
                )}
              </div>
              <UIField
                label={t('postComposer.details')}
                error={errors.body ? t('app.required') : undefined}
              >
                <textarea
                  {...register('body')}
                  className="app-control h-36 max-h-36 min-h-36 shrink-0 resize-none overflow-y-auto"
                  placeholder={t('postComposer.detailsPlaceholder')}
                  maxLength={4000}
                  aria-invalid={Boolean(errors.body)}
                />
                <span className="text-right text-micro font-normal text-secondary">
                  {body.length}/4000
                </span>
              </UIField>
              {type === 'event' && (
                <section
                  aria-labelledby="event-details-heading"
                  className="space-y-4 rounded-feature border border-white-10 bg-white-5 p-4"
                >
                  <h2
                    id="event-details-heading"
                    className="text-micro font-semibold text-secondary"
                  >
                    {t('postComposer.eventDetails')}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <UIField
                      label={t('postComposer.date')}
                      error={errors.date ? t('app.required') : undefined}
                    >
                      <input
                        {...register('date')}
                        type="date"
                        className="app-control [color-scheme:dark]"
                        aria-invalid={Boolean(errors.date)}
                      />
                    </UIField>
                    <UIField
                      label={t('postComposer.time')}
                      error={errors.time ? t('app.required') : undefined}
                    >
                      <input
                        {...register('time')}
                        type="time"
                        className="app-control [color-scheme:dark]"
                        aria-invalid={Boolean(errors.time)}
                      />
                    </UIField>
                  </div>
                  <UIField
                    label={t('postComposer.location')}
                    error={errors.location ? t('app.required') : undefined}
                  >
                    <input
                      {...register('location')}
                      className="app-control"
                      placeholder={t('postComposer.locationPlaceholder')}
                      maxLength={160}
                      aria-invalid={Boolean(errors.location)}
                    />
                  </UIField>
                </section>
              )}
              {type !== 'question' && (
                <div className="space-y-3">
                  <p className="text-detail font-semibold text-secondary">
                    {t('postComposer.photo')}
                  </p>
                  <div className="relative h-36 overflow-hidden rounded-feature focus-within:outline-2 focus-within:outline-blue">
                    <input
                      id="post-photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-label={t('postComposer.addPhoto')}
                      className="sr-only"
                      disabled={readingImage}
                      onChange={(event) => {
                        void changePhoto(event.target.files?.[0]);
                        event.target.value = '';
                      }}
                    />
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt={t('postComposer.photoPreview')}
                          className="size-full object-cover"
                        />
                        <UIButton
                          size="icon"
                          bg="secondary"
                          aria-label={t('postComposer.removePhoto')}
                          className="absolute top-3 right-3 bg-surface"
                          onClick={() => {
                            setImage('');
                            setValue('image', undefined, { shouldDirty: true });
                            clearErrors('image');
                          }}
                        >
                          <Trash2 size={18} className="text-danger" />
                        </UIButton>
                      </>
                    ) : (
                      <label
                        htmlFor="post-photo"
                        className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-feature border border-dashed border-white-20 bg-white-5 p-5 text-center transition-colors hover:bg-white-10"
                      >
                        <ImagePlus className="mb-1 size-6 text-secondary" aria-hidden="true" />
                        <span className="text-label font-semibold">
                          {readingImage
                            ? t('postComposer.readingPhoto')
                            : t('postComposer.addPhoto')}
                        </span>
                        <span className="text-detail text-secondary">
                          {t('postComposer.photoHint')}
                        </span>
                      </label>
                    )}
                  </div>
                  {errors.image && (
                    <p role="alert" className="text-detail text-danger">
                      {t('app.photoError')}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-white-10 p-5 sm:p-6">
              <UIButton bg="secondary" onClick={onCancel}>
                {t('postComposer.cancel')}
              </UIButton>
              <UIButton type="submit" leftIcon={Send} disabled={readingImage}>
                {t('postComposer.publish')}
              </UIButton>
            </div>
          </form>
        </UIPanel>
        <aside
          className="hidden min-h-0 space-y-4 overflow-y-auto md:block"
          aria-label={t('postComposer.preview')}
        >
          <h2 className="flex items-center gap-2 text-detail font-semibold text-secondary">
            <Eye className="size-4" aria-hidden="true" />
            {t('postComposer.preview')}
          </h2>
          <FeedPostCard post={preview} preview />
        </aside>
      </div>
    </div>
  );
}
