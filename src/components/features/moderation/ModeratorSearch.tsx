import { useState } from 'react';
import { Search, ShieldCheck, UserPlus, X } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StudentSearchResults } from '@/components/features/connections';
import { useModerators } from '@/hooks';
import { UIButton, UISearch } from '@/ui/components';
import { GrantModeratorButton } from './GrantModeratorButton';

/** The all-students search, submitted like the exams search, with the grant action on students who aren't moderators yet. */
export function ModeratorSearch() {
  const { t } = useTranslation();
  const form = useForm<{ search: string }>({ defaultValues: { search: '' } });
  const { search: text = '' } = useWatch({ control: form.control });
  // The submitted search; typing doesn't fetch until then, as on the exams page.
  const [query, setQuery] = useState('');
  const { data: moderatorPages } = useModerators();
  const moderatorIds = new Set(
    moderatorPages?.pages.flatMap((page) => page.items ?? []).map(({ userId }) => userId),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <form
        role="search"
        className="relative shrink-0"
        onSubmit={form.handleSubmit(({ search }) => setQuery(search.trim()))}
      >
        <UISearch
          value={text}
          onChange={(value) => {
            const next = value.slice(0, 120);
            form.setValue('search', next);
            if (!next.trim()) setQuery('');
          }}
          label={t('students.search')}
          hideIcon
          hideClearButton
          className="pr-22"
        />
        {text && (
          <UIButton
            type="button"
            size="icon"
            bg="plain"
            aria-label={t('app.clearSearch')}
            className="absolute top-1/2 right-11 -translate-y-1/2"
            onClick={() => {
              form.reset();
              setQuery('');
            }}
          >
            <X size={18} aria-hidden="true" />
          </UIButton>
        )}
        <UIButton
          type="submit"
          size="icon"
          bg="plain"
          aria-label={t('students.search')}
          className="absolute top-1/2 right-1 -translate-y-1/2"
        >
          <Search size={18} aria-hidden="true" />
        </UIButton>
      </form>
      <div className="min-h-0 flex-1">
        <StudentSearchResults
          search={query}
          name={query}
          action={(student) =>
            moderatorIds.has(student.id) ? (
              <span
                role="img"
                aria-label={t('moderation.alreadyModerator')}
                title={t('moderation.alreadyModerator')}
                className="flex size-9.5 shrink-0 items-center justify-center text-secondary"
              >
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
            ) : (
              <GrantModeratorButton userId={student.id} icon={UserPlus} />
            )
          }
        />
      </div>
    </div>
  );
}
