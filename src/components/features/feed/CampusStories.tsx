import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// TODO(api): Replace mock stories with API-backed feed data.
import { FEEDMOCKS, matchesSearch } from '@/utils';
import { UIDialog } from '@/ui/components';

export function CampusStories({ search }: { search: string }) {
  const { t } = useTranslation();
  const [story, setStory] = useState<number | null>(null);
  return (
    <>
      <div className="mb-6 flex gap-3 overflow-x-auto">
        {FEEDMOCKS.stories.map(
          (item, i) =>
            matchesSearch(search, item.title, item.university) && (
              <button
                key={item.title}
                onClick={() => setStory(i)}
                className="relative h-47 min-w-36 flex-1 overflow-hidden rounded-story text-left focus-visible:outline-2 focus-visible:outline-blue"
              >
                <img
                  src={`/app/b4YP8L-${i}.jpg`}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <span className="absolute inset-0 bg-linear-to-t from-ink-90 via-ink-0 to-ink-0" />
                <span
                  className={`absolute top-2.5 left-2.5 rounded-full px-2.25 py-1 text-micro font-bold ${i === 0 ? 'bg-red' : 'border border-white-20 bg-ink-40 backdrop-blur-[12px]'}`}
                >
                  {i === 0 ? t('app.liveNow') : item.time}
                </span>
                <span className="absolute right-3 bottom-3 left-3">
                  <strong className="block text-label leading-[1.2]">{item.title}</strong>
                  <span className="mt-1 block text-micro font-medium text-white-80">
                    ◉ {item.university}
                  </span>
                </span>
              </button>
            ),
        )}
      </div>{' '}
      {story !== null && (
        <UIDialog
          open
          onOpenChange={() => setStory(null)}
          title={FEEDMOCKS.stories[story].title}
          description={`${FEEDMOCKS.stories[story].time} · ${FEEDMOCKS.stories[story].university}`}
        >
          <img
            src={`/app/b4YP8L-${story}.jpg`}
            alt={FEEDMOCKS.stories[story].title}
            className="max-h-96 w-full rounded-xl object-cover"
          />
        </UIDialog>
      )}
    </>
  );
}
