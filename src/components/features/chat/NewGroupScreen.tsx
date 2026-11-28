import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Users } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import { useAddChatMembers, useChatMembers, useConnectionsList, useCreateChatGroup } from '@/hooks';
import { addGroupMembersSchema, groupSchema, type GroupSchema } from '@/schemas';
import {
  UIAvatar,
  UIButton,
  UICollapsingHeader,
  UIEmpty,
  UIInput,
  UIQueryError,
  UISearchOverlay,
  UIUniversityLogo,
} from '@/ui/components';
import { rowGroupStyles } from '@/ui/components/UIRow/variants';
import { apiErrorKey, authorName, captureAnalytics, toast } from '@/utils';
import { ChatPickerRow } from './ChatPickerRow';
import { GlassRowSkeletons } from './GroupSettingsScreen';

/** Phone-only: the mobile app's new group screen; with a `groupId`, it adds people to that group. */
export function NewGroupScreen({
  groupId,
  onBack,
  onCreated,
}: {
  groupId?: string;
  onBack: () => void;
  onCreated: (conversationId: string) => void;
}) {
  const { t } = useTranslation();
  const isAdding = Boolean(groupId);
  const { mutateAsync: createGroup, isPending: isCreating } = useCreateChatGroup();
  const { mutateAsync: addMembers, isPending: isAddingMembers } = useAddChatMembers(groupId ?? '');
  const { data: memberPage } = useChatMembers(groupId ?? '', isAdding);
  const memberIds = new Set((memberPage?.items ?? []).map(({ student }) => student.id));
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useConnectionsList();
  // shortcut: search filters the loaded connections; the API has no connection search yet
  const needle = query.trim().toLowerCase();
  const students = (data?.pages.flatMap((page) => page.items ?? []) ?? [])
    .map(({ profile }) => profile)
    // people already in the group are not offered again
    .filter(
      (student) => !memberIds.has(student.id) && authorName(student).toLowerCase().includes(needle),
    );
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<GroupSchema>({
    // adding needs no name, so it only checks the picked people
    resolver: zodResolver(isAdding ? addGroupMembersSchema : groupSchema),
    defaultValues: { name: '', members: [] },
    mode: 'onChange',
  });
  const members = useWatch({ control, name: 'members' });
  const isPendingSubmit = isCreating || isAddingMembers;

  const handleSearchOpen = () => setIsSearching(true);
  const handleSearchClose = () => setIsSearching(false);
  const handleSearchSubmit = () => setQuery(search);
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };
  // the list scrolling hides the keyboard, as the app's keyboardDismissMode on-drag
  const handleListScroll = () => {
    if (document.activeElement instanceof HTMLInputElement) document.activeElement.blur();
  };
  const handleCreate = handleSubmit(
    async ({ name, members: picked }) => {
      try {
        if (groupId) {
          await addMembers(picked);
          onBack();
          return;
        }
        const { id } = await createGroup({ name, memberIds: picked });
        onCreated(id);
      } catch (error) {
        toast.error(t(apiErrorKey(error)));
      }
    },
    () => captureAnalytics('group_form_validation_failed'),
  );

  return (
    <div
      data-hide-bottom-tabs
      className="fixed inset-0 z-50 flex flex-col bg-ink px-4 pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      <UICollapsingHeader
        title={t(isAdding ? 'app.addPeople' : 'chat.action')}
        isCompact={false}
        onBack={onBack}
        backLabel={t('app.back')}
        actions={
          <UIButton
            size="square"
            bg="glass"
            aria-label={t('app.searchStudents')}
            onClick={handleSearchOpen}
          >
            <Search size={18} aria-hidden="true" />
          </UIButton>
        }
      />
      {/* pinned above the list: only the people rows scroll */}
      <div className="flex shrink-0 flex-col gap-6 pt-2 pb-3">
        {!isAdding && (
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <UIInput
                label={t('app.groupName')}
                placeholder={t('app.groupPlaceholder')}
                text={field.value}
                onTextChange={field.onChange}
                onBlur={field.onBlur}
                errorText={fieldState.error ? t('app.required') : undefined}
                maxLength={80}
              />
            )}
          />
        )}
        <div className="flex items-baseline gap-2">
          {!isAdding && (
            <h2 className="min-w-0 flex-1 text-section font-semibold">{t('app.addPeople')}</h2>
          )}
          {members.length > 0 && (
            <span className="ml-auto shrink-0 text-detail font-medium text-sky">
              {t('chat.selected', { count: members.length })}
            </span>
          )}
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        {isPending ? (
          <GlassRowSkeletons count={8} />
        ) : isError ? (
          <UIQueryError retry={() => void refetch()} />
        ) : students.length > 0 ? (
          <Controller
            control={control}
            name="members"
            render={({ field }) => (
              <Virtuoso
                data={students}
                computeItemKey={(_, student) => student.id}
                endReached={handleEndReached}
                onScroll={handleListScroll}
                aria-label={t('app.addPeople')}
                className={`scrollbar-hidden ${rowGroupStyles()} h-full! gap-0`}
                components={{
                  Footer: () => (isFetchingNextPage ? <GlassRowSkeletons count={1} /> : null),
                }}
                itemContent={(_, student) => {
                  const isSelected = field.value.includes(student.id);
                  return (
                    <ChatPickerRow
                      role="checkbox"
                      label="Toggle group member"
                      selected={isSelected}
                      onClick={() =>
                        field.onChange(
                          isSelected
                            ? field.value.filter((id) => id !== student.id)
                            : [...field.value, student.id],
                        )
                      }
                    >
                      <UIAvatar
                        imgSrc={student.avatarUrl ?? '/app/avatar.png'}
                        alt=""
                        className="shrink-0 [&>div]:size-10"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-base font-semibold">
                          {authorName(student) || t('apiState.student')}
                        </span>
                        <span className="flex min-w-0 items-center gap-1.5 text-detail text-secondary">
                          <UIUniversityLogo universityId={student.universityId} size="xs" />
                          <span className="truncate">{student.universityId.toUpperCase()}</span>
                        </span>
                      </span>
                    </ChatPickerRow>
                  );
                }}
              />
            )}
          />
        ) : null}
        {!isPending && !isError && students.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <UIEmpty>
              <p>{t('students.noResults')}</p>
            </UIEmpty>
          </div>
        )}
      </div>
      {!isAdding && (
        <p className="shrink-0 pt-3 text-detail text-secondary">{t('app.minimumMembers')}</p>
      )}
      {/* pinned at the bottom; the open search overlay covers it */}
      <div className="shrink-0 pt-2">
        <UIButton
          disabled={!isValid || isPendingSubmit}
          leftIcon={Users}
          onClick={() => void handleCreate()}
          className="min-h-14 w-full rounded-[14px] text-base"
        >
          {t(isAdding ? 'chat.addToGroup' : 'app.createGroup')}
        </UIButton>
      </div>
      <UISearchOverlay
        isOpen={isSearching}
        value={search}
        onChangeText={setSearch}
        onSubmit={handleSearchSubmit}
        onClose={handleSearchClose}
        placeholder={t('app.searchStudents')}
        submitLabel={t('topbar.search')}
      />
    </div>
  );
}
