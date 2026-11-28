import { SquarePen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { Virtuoso } from 'react-virtuoso';
import { useConversations } from '@/hooks';
import {
  UIAvatar,
  UIButton,
  UIEmpty,
  UIPanel,
  UIQueryError,
  UISearch,
  UISegmented,
  UITopbar,
} from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import {
  chatAvatar,
  chatPreview,
  chatTime,
  chatTitle,
  initials,
  matchesSearch,
  selectedConversationId,
} from '@/utils';
import { ConnectionsList } from './ConnectionsList';

export function ConversationList({
  selected,
  filter,
  hidden,
  onOpen,
  onOpenConnection,
  onFilterChange,
  onNewGroup,
}: {
  /** The open chat from the URL. Without one, the newest chat counts as open. */
  selected: string | undefined;
  filter: 'all' | 'groups' | 'connections';
  hidden: boolean;
  onOpen: (id: string) => void;
  onOpenConnection: (userId: string) => void;
  onFilterChange: (filter: 'all' | 'groups' | 'connections') => void;
  onNewGroup: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { data, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useConversations();
  const form = useForm<{ search: string }>({ defaultValues: { search: '' } });
  const { search = '' } = useWatch({ control: form.control });
  const conversations = (data?.pages.flatMap((page) => page.items ?? []) ?? []).map((c) => ({
    ...c,
    title: chatTitle(c, t('app.accountDeleted')),
    preview: chatPreview(c, t('app.attachedImage')),
  }));
  const selectedId = selectedConversationId(conversations, selected);
  const visible = conversations.filter(
    ({ title, preview, kind }) =>
      matchesSearch(search, title, preview) && (filter !== 'groups' || kind === 'group'),
  );
  return (
    <UIPanel
      className={`${hidden ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col px-3 py-5 max-lg:rounded-none max-lg:border-0 max-lg:bg-transparent max-lg:p-0 max-lg:before:hidden`}
    >
      {/* on a phone, the app's header: the title, the new-group button and the profile avatar */}
      <div className="lg:hidden">
        <UITopbar
          title={t('chat.title')}
          action={{ label: t('chat.action'), icon: SquarePen, onClick: onNewGroup }}
        />
      </div>
      <div className="mb-3.5 flex items-center justify-between px-2 max-lg:hidden">
        <h1 className="text-panel-title font-bold tracking-[-0.8px]">{t('chat.title')}</h1>
        <UIButton size="icon" bg="secondary" aria-label={t('chat.action')} onClick={onNewGroup}>
          <SquarePen size={17} />
        </UIButton>
      </div>
      <div className="px-2 max-lg:px-0">
        <UISearch
          value={search}
          onChange={(search) => form.setValue('search', search)}
          label={t('app.searchConversations')}
        />
      </div>
      <div className="my-3.5 px-2 max-lg:px-0 [&_button]:min-h-8 [&_button]:px-3.5 [&_button]:py-1.5 [&_button]:text-detail">
        <UISegmented
          label={t('chat.title')}
          options={[t('app.all'), t('app.groups'), t('connections.title')]}
          value={t(
            filter === 'all' ? 'app.all' : filter === 'groups' ? 'app.groups' : 'connections.title',
          )}
          onChange={(value) =>
            onFilterChange(
              value === t('app.all') ? 'all' : value === t('app.groups') ? 'groups' : 'connections',
            )
          }
        />
      </div>
      {filter === 'connections' ? (
        <ConnectionsList
          selected={conversations.find((c) => c.id === selectedId)?.peer?.id ?? ''}
          onOpen={onOpenConnection}
        />
      ) : isError ? (
        <UIQueryError retry={() => void refetch()} />
      ) : visible.length === 0 ? (
        <UIEmpty />
      ) : (
        <Virtuoso
          data={visible}
          computeItemKey={(_, c) => c.id}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
          }}
          components={listComponents}
          aria-label={t('chat.title')}
          className="min-h-0 flex-1"
          itemContent={(_, c) => (
            <div role="listitem" className="pb-0.5">
              <button
                data-ph-capture-attribute-label="Open conversation"
                onClick={() => onOpen(c.id)}
                aria-current={selectedId === c.id ? 'true' : undefined}
                className={`flex w-full items-center gap-3 rounded-2xl border border-transparent p-2.5 text-left transition-colors hover:bg-white-5 max-lg:rounded-none max-lg:px-0 ${selectedId === c.id ? 'border-white-10 bg-white-10 max-lg:border-transparent max-lg:bg-transparent' : ''}`}
              >
                <UIAvatar
                  imgSrc={chatAvatar(c)}
                  avatarSymbols={initials(c.title)}
                  className="max-lg:*:size-12"
                />
                <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.75">
                  <strong className="truncate text-body font-semibold max-lg:text-base">
                    {c.title}
                  </strong>
                  <span className="justify-self-end text-detail text-secondary">
                    {c.lastMessage ? chatTime(c.lastMessage.createdAt, i18n.language) : ''}
                  </span>
                  <span className="block min-h-5 truncate text-label text-secondary">
                    {c.preview}
                  </span>
                  {c.unreadCount > 0 && (
                    <span className="justify-self-end rounded-full bg-blue px-1.75 py-0.25 text-micro font-bold">
                      {c.unreadCount}
                    </span>
                  )}
                </span>
              </button>
            </div>
          )}
        />
      )}
    </UIPanel>
  );
}
