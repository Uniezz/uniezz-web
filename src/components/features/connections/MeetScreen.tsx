import { useNavigate } from '@tanstack/react-router';
import { Heart, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { ConnectionFilters } from '@/@types';
import { ApiRequestError, apiErrorCode } from '@/api';
import {
  useCandidateAction,
  useDiscovery,
  useMyConnectionPreferences,
  useUpdateMyConnectionPreferences,
} from '@/hooks';
import { UIAvatar, UIButton, UIEmpty, UIQueryError, UISubTabs, UITopbar } from '@/ui/components';
import {
  apiErrorKey,
  authorName,
  CANDIDATE_ERRORS,
  CONNECTION_MODES,
  DAILY_LIKE_LIMIT,
  defaultConnectionFilters,
  toast,
} from '@/utils';
import { BirthDateSheet } from './BirthDateSheet';
import { ConnectionFiltersSheet, type ConnectionPreferencesValues } from './ConnectionFiltersSheet';
import { DiscoverCard } from './DiscoverCard';

/** The toast for a failed write here, as the app maps it. */
function meetErrorKey(error: unknown) {
  const status = error instanceof ApiRequestError ? error.status : undefined;
  const code = apiErrorCode(error);
  if (status !== undefined && CANDIDATE_ERRORS[status]) return CANDIDATE_ERRORS[status];
  if (code === 'dating_requires_adult') return 'connections.datingRequiresAdult';
  if (code === 'dating_requires_profile') return 'connections.datingRequiresProfile';
  return apiErrorKey(error);
}

/** Phone-only: the mobile app's Meet tab — mode tabs, one card, Pass and Connect under it. */
export function MeetScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<ConnectionFilters['mode']>('friends');
  // the sheet edits the form; the deck uses `applied`, copied across when the sheet closes
  const [applied, setApplied] = useState<ConnectionFilters>(defaultConnectionFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filters = { ...applied, mode };
  const {
    data: deck,
    isPending,
    isError,
    refetch,
    isPlaceholderData,
  } = useDiscovery(filters, {
    keepPrevious: true,
  });
  const { data: preferences } = useMyConnectionPreferences();
  const { mutateAsync: savePreferences, isPending: isSaving } = useUpdateMyConnectionPreferences();
  const { mutate: act, isPending: isActing } = useCandidateAction();
  const {
    control,
    reset,
    getValues,
    formState: { isDirty: isFiltersDirty },
  } = useForm<ConnectionFilters>({ defaultValues: defaultConnectionFilters });
  const {
    control: preferencesControl,
    handleSubmit: handlePreferencesSubmit,
    formState: { isDirty: isPreferencesDirty },
  } = useForm<ConnectionPreferencesValues>({ values: { intent: preferences?.intent ?? '' } });
  const card = deck?.items?.[0];
  const openTo = preferences?.openTo ?? [];
  // the server only deals cards for a mode the student is open to
  const isClosedToMode = preferences !== undefined && !openTo.includes(mode);
  const needsBirthDate = preferences !== undefined && !preferences.birthDate;
  const showError = (error: unknown) =>
    toast.error(t(meetErrorKey(error), { limit: DAILY_LIKE_LIMIT }));

  const handleStudents = () =>
    void navigate({ to: '/connections/students', search: { studentSearch: undefined } });
  const handleFiltersOpen = () => {
    reset(applied);
    setIsFiltersOpen(true);
  };
  // closing the sheet, by swipe or Save, applies its filters
  const handleFiltersOpenChange = (open: boolean) => {
    setIsFiltersOpen(open);
    if (!open) setApplied(getValues());
  };
  // saving the preferences opens the student to this mode, then the sheet closes and applies the filters
  const handleSave = handlePreferencesSubmit(async ({ intent }) => {
    try {
      await savePreferences({
        intent,
        openTo: openTo.includes(mode) ? openTo : [...openTo, mode],
      });
      toast.success(t('connections.preferencesSaved'));
      handleFiltersOpenChange(false);
    } catch (error) {
      showError(error);
    }
  });
  const handleAction = (action: 'like' | 'pass') => {
    if (!card) return;
    act(
      { candidateId: card.candidateId, mode, action },
      {
        onSuccess: ({ connection }) => {
          if (connection) showMatchToast(connection.profile);
        },
        onError: (error) => {
          showError(error);
          // an expired card leaves the deck for the next one
          if (error instanceof ApiRequestError && error.status === 404) void refetch();
        },
      },
    );
  };
  const handlePass = () => handleAction('pass');
  const handleConnect = () => handleAction('like');
  const handleBirthDateOpenChange = (open: boolean) => {
    if (!open) void navigate({ to: '/feed', search: { postFrom: undefined }, replace: true });
  };

  const showMatchToast = (profile: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  }) => {
    const name = authorName(profile) || t('apiState.student');
    // the toast opens the Chat tab, where the new match leads the strip
    const openChats = (id: string) => {
      toast.dismiss(id);
      void navigate({ to: '/chat', search: {} });
    };
    toast(
      (shown) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => openChats(shown.id)}
          onKeyDown={(event) => event.key === 'Enter' && openChats(shown.id)}
          className="flex w-full items-center gap-3"
        >
          <UIAvatar size="mobileSm" imgSrc={profile.avatarUrl ?? '/app/avatar.png'} alt="" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-green">{t('app.connected')}</span>
            <span className="block truncate text-detail text-white-80">{name}</span>
          </span>
          <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-detail font-semibold text-ink">
            {t('tabs.chat')}
          </span>
        </div>
      ),
      {
        duration: 8000,
        style: {
          background: 'var(--color-surface)',
          border: '1px solid color-mix(in srgb, var(--color-green) 30%, transparent)',
          borderRadius: 16,
          color: 'white',
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col gap-3 px-4 pt-[calc(4px+env(safe-area-inset-top))] pb-[calc(var(--bottom-tabs-height)+12px)]">
      <UITopbar
        title={t('connections.title')}
        phoneActions={
          <>
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('app.searchStudents')}
              onClick={handleStudents}
            >
              <Search size={18} aria-hidden="true" />
            </UIButton>
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('connections.filters')}
              aria-expanded={isFiltersOpen}
              onClick={handleFiltersOpen}
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
            </UIButton>
          </>
        }
      />
      <UISubTabs
        tabs={CONNECTION_MODES.map(([id, label]) => ({ id, label: t(label) }))}
        value={mode}
        onChange={setMode}
        label={t('connections.title')}
        idPrefix="meet"
        className="-mx-4 -mt-3 shrink-0 gap-0 border-b-0 px-4 pb-1.5"
      />
      <div id="meet-tab-panel" role="tabpanel" className="flex min-h-0 flex-1 flex-col gap-3">
        {isPending ? (
          <div
            role="status"
            aria-label={t('apiState.loading')}
            className="min-h-0 flex-1 animate-pulse rounded-2xl bg-white-10"
          />
        ) : isError ? (
          <UIQueryError retry={() => void refetch()} />
        ) : card ? (
          <>
            {/* a new card starts at its first photo */}
            <DiscoverCard key={card.candidateId} card={card} onReported={() => void refetch()} />
            <div className="flex shrink-0 items-center justify-center gap-7">
              <button
                type="button"
                aria-label={t('app.pass')}
                data-ph-capture-attribute-label="Pass candidate"
                disabled={isActing || isPlaceholderData}
                onClick={handlePass}
                className="flex size-16 items-center justify-center rounded-full text-red glass focus-visible:outline-2 focus-visible:outline-blue active:opacity-80 disabled:opacity-40"
              >
                <X size={24} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={t('app.connect')}
                data-ph-capture-attribute-label="Connect candidate"
                disabled={isActing || isPlaceholderData}
                onClick={handleConnect}
                className="flex size-16 items-center justify-center rounded-full bg-white text-ink focus-visible:outline-2 focus-visible:outline-blue active:opacity-80 disabled:opacity-40"
              >
                <Heart size={24} aria-hidden="true" />
              </button>
            </div>
          </>
        ) : null}
      </div>
      {/* beside the card, so the cat centres on the screen as every empty state in the app */}
      {!isPending && !isError && !card && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <UIEmpty>
            <p>{t(isClosedToMode ? 'connections.closedToMode' : 'connections.emptyDescription')}</p>
          </UIEmpty>
        </div>
      )}
      <ConnectionFiltersSheet
        open={isFiltersOpen}
        onOpenChange={handleFiltersOpenChange}
        control={control}
        preferencesControl={preferencesControl}
        mode={mode}
        // Save also opens the student to this mode, so it stays enabled while they're closed to it
        isSaveDisabled={isSaving || (!isFiltersDirty && !isPreferencesDirty && !isClosedToMode)}
        onSave={() => void handleSave()}
      />
      {/* opened at a direct link; the Meet tab itself asks before it opens */}
      <BirthDateSheet
        open={needsBirthDate}
        onOpenChange={handleBirthDateOpenChange}
        // the saved preferences close it
        onSaved={() => undefined}
      />
    </div>
  );
}
