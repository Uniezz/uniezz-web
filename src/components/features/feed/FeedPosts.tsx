import { Link } from '@tanstack/react-router';
import { Masonry, type RenderComponentProps } from 'masonic';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { UIPanel, UIEmpty } from '@/ui/components';
import { FEEDMOCKS, matchesSearch } from '@/utils';
import { CampusEvent } from './CampusEvent';
import { CampusQuestion } from './CampusQuestion';
import { TextFormDialog } from './TextFormDialog';

type FeedPostsProps = {
  posts: string[];
  search: string;
};

type FeedItem = {
  id: string;
  searchText: string;
  content: ReactNode;
};

function FeedCard({ data }: RenderComponentProps<FeedItem>): ReactNode {
  return data.content;
}

export function FeedPosts({ posts, search }: FeedPostsProps) {
  const { t } = useTranslation();
  const [going, setGoing] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerOpen, setAnswerOpen] = useState(false);

  const items: FeedItem[] = [
    ...posts.map((post, index) => ({
      id: `post-${posts.length - index}`,
      searchText: post,
      content: (
        <UIPanel>
          <p className="mb-3 text-detail text-secondary">{FEEDMOCKS.currentAuthor}</p>
          <p className="wrap-anywhere whitespace-pre-wrap">{post}</p>
        </UIPanel>
      ),
    })),
    {
      id: 'event',
      searchText: `${FEEDMOCKS.eventTitle} Politechnika`,
      content: <CampusEvent going={going} onGoingChange={setGoing} />,
    },
    {
      id: 'question',
      searchText: `${FEEDMOCKS.question} Olena Kovalenko`,
      content: <CampusQuestion answers={answers} onAnswer={() => setAnswerOpen(true)} />,
    },
    {
      id: 'housing',
      searchText: `${FEEDMOCKS.housing} Kateryna`,
      content: (
        <UIPanel className="overflow-hidden p-0">
          <img src="/app/b4YP8L-14.jpg" alt="" className="h-50 w-full object-cover" />
          <div className="min-w-0 p-5.5">
            <p className="mb-2.5 text-label font-medium text-white-80">{FEEDMOCKS.housingAuthor}</p>
            <h2 className="text-card-title font-semibold tracking-[-0.6px]">{FEEDMOCKS.housing}</h2>
            <p className="mt-2.5 text-body text-white-80">{FEEDMOCKS.housingDescription}</p>
            <Link
              to="/chat"
              search={{ recipient: 'Kateryna Melnyk' }}
              className="mt-4 inline-block text-label text-sky"
            >
              {t('app.message')} →
            </Link>
          </div>
        </UIPanel>
      ),
    },
  ].filter((item) => matchesSearch(search, item.searchText));

  return (
    <>
      {items.length > 0 ? (
        <Masonry
          key={items.map((item) => item.id).join(',')}
          items={items}
          itemKey={(item) => item.id}
          columnWidth={352}
          columnGutter={24}
          maxColumnCount={3}
          render={FeedCard}
          role="list"
        />
      ) : (
        search &&
        !FEEDMOCKS.stories.some((story) =>
          matchesSearch(search, story.title, story.university),
        ) && <UIEmpty />
      )}
      {answerOpen && (
        <TextFormDialog
          title={t('app.answer')}
          onClose={() => setAnswerOpen(false)}
          onSubmit={(text) => setAnswers((answers) => [...answers, text])}
        />
      )}
    </>
  );
}
