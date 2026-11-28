import { captureAnalytics } from '@/utils';
import { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBlocker } from '@tanstack/react-router';

import { Virtuoso } from 'react-virtuoso';
import { UIButton, UIAvatar, UIField, UIDialog, UISearch } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { authorName, matchesSearch } from '@/utils';
import { groupSchema, type GroupSchema } from '@/schemas';
import { useConnectionsList, useCreateChatGroup, useUniversities } from '@/hooks';

export function CreateGroup({
  onBack,
  onCreated,
}: {
  onBack: () => void;
  onCreated: (conversationId: string) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [createdId, setCreatedId] = useState<string>();
  const { mutate: createGroup, isPending } = useCreateChatGroup();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useConnectionsList();
  const { data: universities = [] } = useUniversities();
  const students =
    data?.pages.flatMap((page) => page.items ?? []).map(({ profile }) => profile) ?? [];
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<GroupSchema>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: '', members: [] },
  });
  const members = useWatch({ control, name: 'members' });
  const hasUnsavedChanges = isDirty || search !== '';
  const blocker = useBlocker({
    shouldBlockFn: () => hasUnsavedChanges && !createdId,
    enableBeforeUnload: () => hasUnsavedChanges && !createdId,
    withResolver: true,
  });
  // Leave only after the blocker knows the group exists, so the unsaved-changes dialog stays away.
  useEffect(() => {
    if (createdId) onCreated(createdId);
  }, [createdId, onCreated]);
  const student = (id: string) => students.find((profile) => profile.id === id);

  return (
    <>
      {blocker.status === 'blocked' && (
        <UIDialog
          open
          onOpenChange={(open) => {
            if (!open) blocker.reset();
          }}
          title={t('app.unsavedGroupTitle')}
          description={t('app.discardGroupDescription')}
        >
          <div className="flex justify-end gap-3">
            <UIButton bg="secondary" onClick={blocker.reset}>
              {t('app.keepEditing')}
            </UIButton>
            <UIButton bg="danger" onClick={blocker.proceed}>
              {t('app.discardChanges')}
            </UIButton>
          </div>
        </UIDialog>
      )}
      <form
        className="flex min-h-0 flex-1 flex-col gap-5"
        onSubmit={handleSubmit(
          ({ name, members }) =>
            createGroup({ name, memberIds: members }, { onSuccess: ({ id }) => setCreatedId(id) }),
          () => captureAnalytics('group_form_validation_failed'),
        )}
      >
        <div className="flex items-center gap-3">
          <UIButton size="icon" bg="transparent" onClick={onBack} aria-label={t('app.back')}>
            <ArrowLeft size={18} />
          </UIButton>
          <h2 className="flex-1 text-card-title font-semibold max-lg:min-w-0 max-lg:truncate">
            {t('chat.action')}
          </h2>
        </div>
        <p className="text-label text-secondary">{t('app.groupDescription')}</p>
        <UIField
          label={t('app.groupName')}
          error={errors.name ? t('app.required') : undefined}
          className="gap-2 [&>span]:text-base [&>span]:font-semibold [&>span]:text-white"
        >
          <input
            autoComplete="off"
            className="app-control"
            {...register('name')}
            maxLength={80}
            placeholder={t('app.groupPlaceholder')}
            spellCheck={false}
          />
        </UIField>
        <h3 className="text-base font-semibold">{t('app.addPeople')}</h3>
        <UISearch
          value={search}
          onChange={setSearch}
          label={t('app.searchStudents')}
          className="rounded-xl"
        />
        <div className="grid grid-cols-[repeat(auto-fill,12rem)] gap-2">
          {members.map((id) => (
            <div
              key={id}
              className="flex min-w-0 items-center gap-2 overflow-hidden rounded-full border border-transparent bg-white-10 px-2 py-1 text-detail text-white"
            >
              <UIAvatar
                className="shrink-0"
                size="sm"
                imgSrc={student(id)?.avatarUrl ?? undefined}
                alt=""
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate">{authorName(student(id))}</span>
              <button
                type="button"
                data-ph-capture-attribute-label="Remove group member"
                aria-label={`${t('app.remove')} ${authorName(student(id))}`}
                onClick={() =>
                  setValue(
                    'members',
                    members.filter((member) => member !== id),
                    {
                      shouldDirty: true,
                    },
                  )
                }
                className="flex size-6 items-center justify-center rounded-full text-white-60 transition-colors hover:text-red focus-visible:outline-2 focus-visible:outline-blue"
              >
                <Minus size={14} />
              </button>
            </div>
          ))}
        </div>
        <p className="text-caption font-semibold text-muted uppercase">{t('app.suggested')}</p>
        <Virtuoso
          data={students.filter(
            (s) => !members.includes(s.id) && matchesSearch(search, authorName(s)),
          )}
          computeItemKey={(_, s) => s.id}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
          }}
          components={listComponents}
          aria-label={t('app.suggested')}
          className="scrollbar-gray min-h-0 flex-1"
          itemContent={(_, s) => (
            <div role="listitem" className="flex items-center justify-between gap-3 pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <UIAvatar size="md" imgSrc={s.avatarUrl ?? undefined} alt="" aria-hidden="true" />
                <div className="min-w-0">
                  <strong className="text-label font-medium max-lg:block max-lg:truncate">
                    {authorName(s)}
                  </strong>
                  <p className="text-micro text-muted max-lg:truncate">
                    {universities.find((university) => university.id === s.universityId)?.name}
                  </p>
                </div>
              </div>
              <UIButton
                bg="transparent"
                size="icon"
                aria-label={`${t('app.add')} ${authorName(s)}`}
                data-ph-capture-attribute-label="Add group member"
                className="group border-transparent bg-transparent enabled:hover:border-transparent enabled:hover:bg-transparent"
                onClick={() => setValue('members', [...members, s.id], { shouldDirty: true })}
              >
                <Plus size={16} className="transition-transform group-hover:scale-125" />
              </UIButton>
            </div>
          )}
        />
        {/* on a phone, a full-width button pinned under the list, as in the app */}
        <div className="flex items-center justify-start gap-3 max-lg:flex-col max-lg:items-stretch">
          {errors.members && (
            <p className="text-detail text-warning" role="alert">
              {t('app.minimumMembers')}
            </p>
          )}
          <UIButton
            type="submit"
            disabled={isPending}
            bg="primary"
            size="sm"
            className="rounded-xl text-ink enabled:hover:bg-white max-lg:min-h-11"
          >
            {t('app.createGroup')}
          </UIButton>
        </div>
      </form>
    </>
  );
}
