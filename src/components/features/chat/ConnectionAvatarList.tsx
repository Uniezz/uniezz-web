import { useState, type UIEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { components } from '@/@types/schema';
import { useConnectionsList, useDeleteConnection, useLongPress, useOpenDirectChat } from '@/hooks';
import { UIAvatar } from '@/ui/components';
import { apiErrorKey, toast } from '@/utils';
import { ChatConfirm } from './ChatConfirm';

type Connection = components['schemas']['Connection'];

/** The mobile app's matches strip: a chat with each match a tap away; a long press removes one. */
export function ConnectionAvatarList() {
  const { t } = useTranslation();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useConnectionsList();
  const { openChat } = useOpenDirectChat();
  const { mutate: deleteConnection, isPending } = useDeleteConnection();
  const [removing, setRemoving] = useState<Connection | null>(null);
  const connections = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  if (connections.length === 0) return null;

  const handleScroll = (event: UIEvent<HTMLUListElement>) => {
    const { scrollLeft, clientWidth, scrollWidth } = event.currentTarget;
    if (scrollLeft + clientWidth >= scrollWidth - 64 && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };
  const handleRemoveOpenChange = (open: boolean) => {
    if (!open) setRemoving(null);
  };
  const handleRemoveConfirm = () => {
    if (!removing) return;
    deleteConnection(removing.id, {
      onSuccess: () => setRemoving(null),
      onError: (error) => toast.error(t(apiErrorKey(error))),
    });
  };

  return (
    <>
      <ul
        aria-label={t('connections.title')}
        onScroll={handleScroll}
        className="-mx-4 scrollbar-hidden flex shrink-0 gap-3.5 overflow-x-auto px-4"
      >
        {connections.map((connection) => (
          <li key={connection.id} className="shrink-0">
            <ConnectionAvatar connection={connection} onOpen={openChat} onRemove={setRemoving} />
          </li>
        ))}
      </ul>
      <ChatConfirm
        open={removing !== null}
        onOpenChange={handleRemoveOpenChange}
        title={t('connections.removeTitle')}
        description={t('connections.removeDescription')}
        confirmLabel={t('app.remove')}
        onConfirm={handleRemoveConfirm}
        isPending={isPending}
      />
    </>
  );
}

function ConnectionAvatar({
  connection,
  onOpen,
  onRemove,
}: {
  connection: Connection;
  onOpen: (userId: string) => void;
  onRemove: (connection: Connection) => void;
}) {
  const { t } = useTranslation();
  const { profile, mode } = connection;
  const name = profile.firstName ?? t('apiState.student');
  const longPress = useLongPress(() => onRemove(connection));
  const handleClick = () => void onOpen(profile.id);
  return (
    <button
      type="button"
      aria-label={name}
      data-ph-capture-attribute-label="Open match chat"
      onClick={handleClick}
      {...longPress}
      className="flex w-16 flex-col items-center gap-0.5 select-none [-webkit-touch-callout:none] focus-visible:outline-2 focus-visible:outline-blue active:opacity-80"
    >
      <UIAvatar
        imgSrc={profile.avatarUrl ?? '/app/avatar.png'}
        alt=""
        className="[&>div]:size-12"
      />
      <span className="max-w-full truncate text-micro">{name}</span>
      <span className="max-w-full truncate text-micro text-secondary">{t(`app.${mode}`)}</span>
    </button>
  );
}
