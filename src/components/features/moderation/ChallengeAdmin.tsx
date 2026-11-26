import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';
import type { Challenge } from '@/@types';
import { useArchiveChallenge, useChallenges } from '@/hooks';
import { UIButton, UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { challengeActionLabel, challengePeriodLabels, challengeText, dateFormatter } from '@/utils';
import { ChallengeFormDialog } from './ChallengeFormDialog';
import { ConfirmActionButton } from './ConfirmActionButton';

/** Every challenge, archived ones too, with create, edit and archive. */
export function ChallengeAdmin() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChallenges();
  const { mutateAsync: archive } = useArchiveChallenge();
  // `null`: the dialog creates a new challenge.
  const [editing, setEditing] = useState<Challenge | null | undefined>(undefined);
  const challenges = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const formatDate = dateFormatter(i18n.resolvedLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex justify-end">
        <UIButton size="sm" leftIcon={Plus} onClick={() => setEditing(null)}>
          {t('moderation.newChallenge')}
        </UIButton>
      </div>
      {isPending ? (
        <p role="status">{t('apiState.loading')}</p>
      ) : isError && challenges.length === 0 ? (
        <UIQueryError retry={() => void refetch()} />
      ) : challenges.length === 0 ? (
        <UIEmpty>
          <p>{t('moderation.noChallenges')}</p>
        </UIEmpty>
      ) : (
        <Virtuoso
          data={challenges}
          computeItemKey={(_, challenge) => challenge.id}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
          }}
          components={listComponents}
          aria-label={t('moderation.challenges')}
          className="min-h-0 flex-1"
          itemContent={(_, challenge) => (
            <div role="listitem" className="pb-3">
              <UIPanel surface="tint" className="space-y-2 rounded-programme p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-section font-semibold wrap-anywhere">
                    {challengeText(challenge.texts, i18n.resolvedLanguage).title}
                  </h3>
                  {challenge.archivedAt && (
                    <span className="text-detail text-secondary">
                      {t('moderation.challengeArchived')}
                    </span>
                  )}
                </div>
                <p className="text-detail text-secondary">
                  {[
                    t(challengeActionLabel(challenge.action)),
                    t(challengePeriodLabels[challenge.period]),
                    t('moderation.challengeSummary', {
                      target: challenge.target,
                      reward: challenge.reward,
                    }),
                  ].join(' · ')}
                </p>
                {(challenge.startsAt || challenge.endsAt) && (
                  <p className="text-detail text-secondary">
                    {challenge.startsAt && formatDate.format(new Date(challenge.startsAt))}
                    {' – '}
                    {challenge.endsAt && formatDate.format(new Date(challenge.endsAt))}
                  </p>
                )}
                {!challenge.archivedAt && (
                  <div className="flex justify-end gap-2">
                    <UIButton size="sm" bg="secondary" onClick={() => setEditing(challenge)}>
                      {t('moderation.editChallenge')}
                    </UIButton>
                    <ConfirmActionButton
                      label={t('moderation.archiveChallenge')}
                      description={t('moderation.archiveChallengeDescription')}
                      success={t('moderation.challengeArchivedToast')}
                      onConfirm={() => archive(challenge.id)}
                    />
                  </div>
                )}
              </UIPanel>
            </div>
          )}
        />
      )}
      <ChallengeFormDialog
        open={editing !== undefined}
        challenge={editing ?? undefined}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
}
