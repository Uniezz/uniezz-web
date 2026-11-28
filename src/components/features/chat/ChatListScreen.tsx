import { Search, Settings, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import { useChatRequests, useConversations } from '@/hooks';
import {
  UIButton,
  UIEmpty,
  UIQueryError,
  UISearchOverlay,
  UISubTabs,
  UITopbar,
} from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { CHAT_LIST_TABS, chatTitle } from '@/utils';
import { ChatSettingsSheet } from './ChatSettingsSheet';
import { ConnectionAvatarList } from './ConnectionAvatarList';
import { ConversationRow } from './ConversationRow';

export type ChatListTab = (typeof CHAT_LIST_TABS)[number];

// keeps the last row clear of the floating tab bar, as the app's 110px list padding
const chatListComponents = { ...listComponents, Footer: () => <div className="h-27.5" /> };

/** Phone-only: the mobile app's Chat tab, with search, settings, new group, tabs and the matches strip. */
export function ChatListScreen({
  filter,
  onFilterChange,
  onOpen,
  onNewGroup,
}: {
  filter: ChatListTab;
  onFilterChange: (filter: ChatListTab) => void;
  onOpen: (id: string) => void;
  onNewGroup: () => void;
}) {
  const { t } = useTranslation();
  const conversationsQuery = useConversations();
  const requestsQuery = useChatRequests();
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isRequests = filter === 'requests';
  const active = isRequests ? requestsQuery : conversationsQuery;
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    active;
  const requestCount =
    requestsQuery.data?.pages.reduce((sum, page) => sum + (page.items?.length ?? 0), 0) ?? 0;
  const requestsLabel =
    requestCount > 0
      ? `${t('chat.requestsTab')} (${requestCount}${requestsQuery.hasNextPage ? '+' : ''})`
      : t('chat.requestsTab');
  // shortcut: search filters only the loaded pages; the API has no conversation search yet
  const visible = (data?.pages.flatMap((page) => page.items ?? []) ?? []).filter(
    (item) =>
      chatTitle(item, t('app.accountDeleted')).toLowerCase().includes(query.toLowerCase()) &&
      (filter !== 'groups' || item.kind === 'group'),
  );

  const handleSearchOpen = () => setIsSearching(true);
  const handleSearchSubmit = () => setQuery(search.trim());
  // blurring closes the overlay but keeps the filter
  const handleSearchClose = () => setIsSearching(false);
  const handleSettingsOpen = () => setIsSettingsOpen(true);
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };
  const handleRetry = () => void refetch();

  return (
    <div className="fixed inset-0 flex flex-col gap-4 px-4 pt-[calc(4px+env(safe-area-inset-top))]">
      <UITopbar
        title={t('tabs.chat')}
        phoneActions={
          <>
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('topbar.search')}
              onClick={handleSearchOpen}
            >
              <Search size={18} aria-hidden="true" />
            </UIButton>
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('chat.whoCanMessage')}
              onClick={handleSettingsOpen}
            >
              <Settings size={18} aria-hidden="true" />
            </UIButton>
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('app.createGroup')}
              onClick={onNewGroup}
            >
              <SquarePen size={18} aria-hidden="true" />
            </UIButton>
          </>
        }
      />
      <UISubTabs
        tabs={CHAT_LIST_TABS.map((id) => ({
          id,
          label: id === 'requests' ? requestsLabel : t(id === 'all' ? 'app.all' : 'app.groups'),
        }))}
        value={filter}
        onChange={onFilterChange}
        label={t('tabs.chat')}
        idPrefix="chat"
        className="-mx-4 -mt-4 shrink-0 gap-0 border-b-0 px-4 pb-1.5"
      />
      <ConnectionAvatarList />
      <div id="chat-tab-panel" role="tabpanel" className="min-h-0 flex-1">
        {isPending ? (
          <ChatRowSkeletons />
        ) : isError ? (
          <UIQueryError retry={handleRetry} />
        ) : (
          <Virtuoso
            data={visible}
            computeItemKey={(_, item) => item.id}
            endReached={handleEndReached}
            components={chatListComponents}
            aria-label={t('tabs.chat')}
            className="scrollbar-hidden h-full"
            itemContent={(_, item) => (
              <div role="listitem">
                <ConversationRow conversation={item} onOpen={onOpen} />
              </div>
            )}
          />
        )}
      </div>
      {/* beside the list, so the cat centres on the screen as every empty state in the app */}
      {!isPending && !isError && visible.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <UIEmpty>
            <p>{t(isRequests ? 'chat.noRequests' : 'app.empty')}</p>
          </UIEmpty>
        </div>
      )}
      <ChatSettingsSheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <UISearchOverlay
        isOpen={isSearching}
        value={search}
        onChangeText={setSearch}
        onSubmit={handleSearchSubmit}
        onClose={handleSearchClose}
        placeholder={t('app.searchConversations')}
        submitLabel={t('topbar.search')}
      />
    </div>
  );
}

/** The mobile app's UISkeletonRow with large avatars. */
export function ChatRowSkeletons({ count = 8 }: { count?: number }) {
  const { t } = useTranslation();
  return (
    <div role="status" aria-label={t('apiState.loading')} className="flex flex-col">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} aria-hidden="true" className="flex items-center gap-3 py-2.5">
          <span className="size-12 shrink-0 animate-pulse rounded-full bg-white-10" />
          <span className="flex flex-1 flex-col gap-2">
            <span className="h-3.5 w-1/2 animate-pulse rounded-full bg-white-10" />
            <span className="h-3 w-3/4 animate-pulse rounded-full bg-white-10" />
          </span>
        </div>
      ))}
    </div>
  );
}
