import { SquarePen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import type { Conversation } from '@/@types';
import { UIAvatar, UIButton, UIEmpty, UIPanel, UISearch, UISegmented } from '@/ui/components';
import { matchesSearch } from '@/utils';

export function ConversationList({
  conversations,
  selected,
  hidden,
  onOpen,
  onNewGroup,
}: {
  conversations: Conversation[];
  selected: string;
  hidden: boolean;
  onOpen: (name: string) => void;
  onNewGroup: () => void;
}) {
  const { t } = useTranslation();
  const form = useForm<{ search: string; filter: string }>({
    defaultValues: { search: '', filter: 'all' },
  });
  const { search = '', filter = 'all' } = useWatch({ control: form.control });
  return (
    <UIPanel className={`${hidden ? 'hidden md:flex' : 'flex'} min-h-0 flex-col px-3 py-5`}>
      <div className="mb-3.5 flex items-center justify-between px-2">
        <h1 className="text-panel-title font-bold tracking-[-0.8px]">{t('chat.title')}</h1>
        <UIButton size="icon" bg="secondary" aria-label={t('chat.action')} onClick={onNewGroup}>
          <SquarePen size={17} />
        </UIButton>
      </div>
      <div className="px-2">
        <UISearch
          value={search}
          onChange={(search) => form.setValue('search', search)}
          label={t('app.searchConversations')}
        />
      </div>
      <div className="my-3.5 px-2 [&_button]:min-h-8 [&_button]:px-3.5 [&_button]:py-1.5 [&_button]:text-detail">
        <UISegmented
          label={t('chat.title')}
          options={[t('app.all'), t('app.groups'), t('app.requests')]}
          value={t(
            filter === 'all' ? 'app.all' : filter === 'groups' ? 'app.groups' : 'app.requests',
          )}
          onChange={(value) =>
            form.setValue(
              'filter',
              value === t('app.all') ? 'all' : value === t('app.groups') ? 'groups' : 'requests',
            )
          }
        />
      </div>
      <div className="min-h-0 flex-1 space-y-0.5 overflow-auto">
        {filter === 'requests' ? (
          <UIEmpty />
        ) : (
          conversations
            .filter(
              (c) => matchesSearch(search, c.name, c.preview) && (filter !== 'groups' || c.group),
            )
            .map((c) => (
              <button
                key={c.name}
                onClick={() => onOpen(c.name)}
                aria-current={selected === c.name ? 'true' : undefined}
                className={`flex w-full items-center gap-3 rounded-2xl border border-transparent p-2.5 text-left hover:bg-white-5 ${selected === c.name ? 'border-white-10 bg-white-10' : ''}`}
              >
                <UIAvatar
                  imgSrc={c.imageUrl || (c.image ? `/app/rPsdQ-${c.image}.jpg` : undefined)}
                  avatarSymbols={c.name.slice(0, 2)}
                />
                <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.75">
                  <strong className="truncate text-body font-semibold">{c.name}</strong>
                  <span className="justify-self-end text-detail text-secondary">{c.time}</span>
                  <span className="block min-h-5 truncate text-label text-secondary">
                    {c.preview}
                  </span>
                  {c.unread > 0 && (
                    <span className="justify-self-end rounded-full bg-blue px-1.75 py-0.25 text-micro font-bold">
                      {c.unread}
                    </span>
                  )}
                </span>
              </button>
            ))
        )}
        {filter !== 'requests' &&
          !conversations.some(
            (c) => matchesSearch(search, c.name, c.preview) && (filter !== 'groups' || c.group),
          ) && <UIEmpty />}
      </div>
    </UIPanel>
  );
}
