import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { ChatMember } from '@/@types';
import {
  useChatMembers,
  useConversation,
  useLeaveChatGroup,
  useMyProfile,
  useRemoveChatMember,
  useRenameChatGroup,
} from '@/hooks';
import { renameGroupSchema, type RenameGroupSchema } from '@/schemas';
import {
  UIAvatar,
  UIButton,
  UICollapsingHeader,
  UIInput,
  UIQueryError,
  UIRowGroup,
  UIUniversityLogo,
} from '@/ui/components';
import { apiErrorKey, authorName, toast } from '@/utils';
import { ChatConfirm } from './ChatConfirm';

/** Phone-only: the mobile app's group settings — rename (owner), members, add people and leave. */
export function GroupSettingsScreen({ conversationId }: { conversationId: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: me } = useMyProfile();
  const { data: conversation } = useConversation(conversationId);
  const { data: memberPage, isPending, isError, refetch } = useChatMembers(conversationId);
  const members = memberPage?.items ?? [];
  const isOwner = conversation?.myRole === 'owner';
  const { mutateAsync: rename, isPending: isRenaming } = useRenameChatGroup(conversationId);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveChatMember(conversationId);
  const { mutate: leave, isPending: isLeaving } = useLeaveChatGroup(conversationId);
  const [removing, setRemoving] = useState<{ userId: string; name: string } | null>(null);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<RenameGroupSchema>({
    resolver: zodResolver(renameGroupSchema),
    values: { groupName: conversation?.name ?? '' },
    mode: 'onChange',
  });

  const handleBack = () =>
    void navigate({ to: '/chat', search: (previous) => ({ ...previous, conversationId }) });
  const handleRename = handleSubmit(async ({ groupName }) => {
    try {
      const renamed = await rename(groupName);
      reset({ groupName: renamed.name ?? groupName });
      toast.success(t('app.saved'));
    } catch (error) {
      toast.error(t(apiErrorKey(error)));
    }
  });
  const handleAdd = () =>
    void navigate({ to: '/chat/new-group', search: { groupId: conversationId } });
  const handleRemoveConfirm = () => {
    if (!removing) return;
    removeMember(removing.userId, {
      onSuccess: () => setRemoving(null),
      onError: (error) => toast.error(t(apiErrorKey(error))),
    });
  };
  const handleRemoveOpenChange = (open: boolean) => {
    if (!open) setRemoving(null);
  };
  const handleLeaveOpen = () => setIsLeaveOpen(true);
  // the oldest member takes over an owner who leaves; the last one out deletes the group
  const handleLeaveConfirm = () =>
    leave(undefined, {
      onSuccess: () => void navigate({ to: '/chat', search: {} }),
      onError: (error) => toast.error(t(apiErrorKey(error))),
    });

  return (
    <div
      data-hide-bottom-tabs
      className="fixed inset-0 z-50 flex flex-col bg-ink px-4 pb-[max(16px,env(safe-area-inset-bottom))]"
    >
      <UICollapsingHeader
        title={conversation?.name ?? ''}
        isCompact={false}
        onBack={handleBack}
        backLabel={t('app.back')}
        actions={
          <UIButton
            size="square"
            bg="glass"
            aria-label={t('chat.leaveGroup')}
            disabled={isLeaving}
            onClick={handleLeaveOpen}
            className="text-red"
          >
            <LogOut size={18} aria-hidden="true" />
          </UIButton>
        }
      />
      {/* the name and the heading stay put while only the members scroll */}
      <div className="flex shrink-0 flex-col gap-6 pt-2">
        {isOwner && (
          <Controller
            control={control}
            name="groupName"
            render={({ field, fieldState }) => (
              <UIInput
                label={t('app.groupName')}
                text={field.value}
                onTextChange={field.onChange}
                onBlur={field.onBlur}
                errorText={fieldState.error ? t('app.required') : undefined}
                maxLength={80}
              />
            )}
          />
        )}
        <div className="flex items-center gap-2">
          <h2 className="min-w-0 flex-1 text-section font-semibold">
            {t('chat.members', { count: members.length })}
          </h2>
          <UIButton size="square" bg="glass" aria-label={t('app.addPeople')} onClick={handleAdd}>
            <Plus size={18} aria-hidden="true" />
          </UIButton>
        </div>
      </div>
      <div className="-mx-4 scrollbar-hidden min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-4">
        {isPending ? (
          <GlassRowSkeletons count={4} />
        ) : isError ? (
          <UIQueryError retry={() => void refetch()} />
        ) : (
          <UIRowGroup label={t('chat.members', { count: members.length })}>
            {members.map((member) => (
              <GroupMember
                key={member.student.id ?? member.joinedAt}
                member={member}
                canRemove={isOwner && member.student.id !== me?.id}
                onRemove={setRemoving}
              />
            ))}
          </UIRowGroup>
        )}
      </div>
      {/* a changed name brings Save, pinned at the bottom */}
      {isDirty && (
        <div className="shrink-0 pt-2">
          <UIButton
            disabled={!isValid || isRenaming}
            onClick={() => void handleRename()}
            className="min-h-14 w-full rounded-[14px] text-base"
          >
            {t('chat.saveName')}
          </UIButton>
        </div>
      )}
      <ChatConfirm
        open={removing !== null}
        onOpenChange={handleRemoveOpenChange}
        title={t('chat.removeMemberTitle', { name: removing?.name ?? '' })}
        confirmLabel={t('app.remove')}
        onConfirm={handleRemoveConfirm}
        isPending={isRemoving}
      />
      <ChatConfirm
        open={isLeaveOpen}
        onOpenChange={setIsLeaveOpen}
        title={t('chat.leaveGroupTitle')}
        description={t('chat.leaveGroupDescription')}
        confirmLabel={t('chat.leaveGroup')}
        onConfirm={handleLeaveConfirm}
        isPending={isLeaving}
      />
    </div>
  );
}

function GroupMember({
  member,
  canRemove,
  onRemove,
}: {
  member: ChatMember;
  canRemove: boolean;
  onRemove: (member: { userId: string; name: string }) => void;
}) {
  const { t } = useTranslation();
  const { student } = member;
  const name = student.deleted
    ? t('app.accountDeleted')
    : authorName(student) || t('apiState.student');
  // a deleted account has no id, and nothing to remove
  const handleRemove = () => student.id && onRemove({ userId: student.id, name });
  return (
    <div className="flex items-center gap-3 border-b border-white-5 px-2.5 py-2.75 last:border-b-0">
      <UIAvatar
        imgSrc={student.avatarUrl ?? '/app/avatar.png'}
        alt=""
        className="shrink-0 [&>div]:size-10"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold">{name}</p>
        {student.universityId && (
          <p className="flex min-w-0 items-center gap-1.5 text-detail text-secondary">
            <UIUniversityLogo universityId={student.universityId} size="xs" />
            <span className="truncate">{student.universityId.toUpperCase()}</span>
          </p>
        )}
      </div>
      {member.role === 'owner' && (
        <span className="shrink-0 text-micro font-semibold text-secondary">{t('chat.owner')}</span>
      )}
      {canRemove && (
        <UIButton
          size="square"
          bg="glass"
          aria-label={`${t('app.remove')} ${name}`}
          data-ph-capture-attribute-label="Remove group member"
          onClick={handleRemove}
          className="size-7 rounded-lg"
        >
          <X size={14} aria-hidden="true" />
        </UIButton>
      )}
    </div>
  );
}

/** The mobile app's glass skeleton rows. */
export function GlassRowSkeletons({ count }: { count: number }) {
  const { t } = useTranslation();
  return (
    <div role="status" aria-label={t('apiState.loading')} className="flex flex-col gap-2.5">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex items-center gap-3 rounded-xl p-3 glass"
        >
          <span className="size-10 shrink-0 animate-pulse rounded-full bg-white-10" />
          <span className="flex flex-1 flex-col gap-2">
            <span className="h-3.5 w-1/2 animate-pulse rounded-full bg-white-10" />
            <span className="h-3 w-1/3 animate-pulse rounded-full bg-white-10" />
          </span>
        </div>
      ))}
    </div>
  );
}
